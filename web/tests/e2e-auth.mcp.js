// Login gate end-to-end checks, for the Playwright MCP tool (browser_run_code with
// filename: web/tests/e2e-auth.mcp.js). Needs the static site built with the two
// NEXT_PUBLIC_SUPABASE_* values set (placeholders are fine) and served:
//   npm run build && npx serve out -l 4321
// No network needed: the logged-in half uses a fake stored session. Runs in its own
// browser context (in fresh tabs of the MCP one when that has no browser()).
// Returns a short log; every failed check starts with FAIL.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- the file is one function expression
async (page) => {
  const BASE = 'http://127.0.0.1:4321';
  const PUBLIC = ['/', '/gioi-thieu/', '/dang-nhap/', '/dang-ky/', '/quen-mat-khau/', '/dat-lai-mat-khau/'];
  const log = [];
  const errors = [];
  const check = (name, ok, detail) => log.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' | ' + detail : ''}`);
  const browser = page.context().browser();
  const ctx = browser ? await browser.newContext() : page.context(); // MCP's persistent profile has no browser()

  // A fresh tab (fresh sessionStorage, so the intro may play) at 390 px. Before the
  // page's own scripts it watches every gated page, also on a Back/Forward cache
  // restore, and notes in sessionStorage "e2e-paint": "/path/=<visibility at the
  // first frame>", then "/path/=SHOWN" if a frame ever had its content visible.
  const open = async () => {
    const p = await ctx.newPage();
    await p.setViewportSize({ width: 390, height: 844 });
    p.on('console', (m) => m.type() === 'error' && errors.push(`${m.text()} @ ${m.location().url}`));
    p.on('pageerror', (e) => errors.push(String(e)));
    await p.addInitScript((pub) => {
      const note = (s) => {
        try { sessionStorage.setItem('e2e-paint', (sessionStorage.getItem('e2e-paint') || '') + s + ' '); } catch {}
      };
      const watch = () => {
        const path = location.pathname.replace(/\/?$/, '/');
        if (pub.includes(path)) return;
        let first = true;
        const tick = () => {
          const d = document.documentElement;
          if (!d) return requestAnimationFrame(tick);
          const vis = getComputedStyle(d).visibility;
          if (first) { first = false; note(`${path}=${vis}`); }
          if (vis !== 'hidden' && document.querySelector('main, h1, [data-kid-target]')) return note(`${path}=SHOWN`);
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      watch();
      addEventListener('pageshow', (e) => e.persisted && watch());
    }, PUBLIC);
    return p;
  };
  // No URL global in the MCP sandbox: split the string instead.
  const path = (p) => p.url().replace(/^[a-z]+:\/\/[^/]+/, '').replace(/[?#].*$/, '');
  const nextOf = (p) => {
    const m = /[?&]next=([^&#]*)/.exec(p.url());
    return m ? decodeURIComponent(m[1]) : null;
  };
  const painted = (p) => p.evaluate(() => sessionStorage.getItem('e2e-paint') || '');
  const intro = (p) => p.evaluate(() => document.documentElement.classList.contains('intro-js'));
  // The head script's redirect interrupts the first load: wait on the landing path instead.
  const go = async (p, to, lands = to.replace(/[?#].*$/, '')) => {
    await p.goto(BASE + to, { waitUntil: 'commit' }).catch(() => {});
    await p.waitForURL((u) => u.pathname === lands, { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(800); // hydration, AuthGuard
  };
  // Exactly one h1 (with this text, when given) and no sideways scroll at 390 px.
  const audit = async (p, want) => {
    const at = path(p);
    const h1 = (await p.locator('h1').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
    check(`${at} has one h1${want ? ` "${want}"` : ''}`, h1.length === 1 && (!want || h1[0] === want), JSON.stringify(h1));
    const [sw, cw] = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    check(`${at} no horizontal overflow at 390px`, sw <= cw, `${sw}/${cw}`);
  };
  // Expected noise: the /xyz/ 404 itself; sign-out calling the (placeholder) Supabase host.
  const unexpected = () => errors.filter((e) => !/\/xyz\/|\/auth\/v1\//.test(e));

  if (!browser) {
    // Shared profile: start logged out.
    const p0 = await ctx.newPage();
    await p0.goto(BASE + '/gioi-thieu/');
    await p0.evaluate(() => localStorage.removeItem('tgat-auth'));
    await p0.close();
  }

  // ── Guest ──
  const g = await open();
  const GAME = '/on-tap/nghe-chon-hinh/?nhom=tu-nhien';
  await go(g, GAME, '/dang-nhap/');
  check('guest: game link -> /dang-nhap/?next=<game>', path(g) === '/dang-nhap/' && nextOf(g) === GAME, g.url());
  let seen = await painted(g);
  check('guest: game page never painted', !seen.includes('SHOWN'), seen || 'no frame before the redirect');
  check('guest: intro plays after the gate redirect', await intro(g));
  await audit(g, 'Đăng nhập');

  await go(g, '/xyz/', '/dang-nhap/');
  check('guest: unknown /xyz/ -> /dang-nhap/?next=/xyz/', path(g) === '/dang-nhap/' && nextOf(g) === '/xyz/', g.url());
  seen = await painted(g);
  check('guest: /xyz/ never painted', !seen.includes('SHOWN'), seen);

  for (const [to, h1] of [['/dang-ky/', 'Đăng ký tài khoản'], ['/quen-mat-khau/', 'Quên mật khẩu'], ['/dat-lai-mat-khau/', 'Đặt mật khẩu mới'], ['/gioi-thieu/']]) {
    await go(g, to);
    check(`guest: ${to} stays`, path(g) === to, g.url());
    await audit(g, h1);
  }

  const l = await open(); // fresh tab: the intro plays on the cover too
  await go(l, '/');
  check('guest: / stays (cover page)', path(l) === '/', l.url());
  check('guest: intro plays on / in a fresh tab', await intro(l));
  await audit(l, 'Thế giới Âm thanh');
  const cta = await l.getByRole('link', { name: 'Đăng ký miễn phí' }).evaluateAll((a) => a.map((x) => x.getAttribute('href')));
  check('cover: "Đăng ký miễn phí" -> /dang-ky/', cta.length > 0 && cta.every((h) => h?.startsWith('/dang-ky/')), JSON.stringify(cta));
  const header = l.locator('header');
  check(
    'cover: header links "Đăng nhập" + "Đăng ký"',
    (await header.getByRole('link', { name: 'Đăng nhập', exact: true }).isVisible()) && (await header.getByRole('link', { name: 'Đăng ký', exact: true }).isVisible()),
  );
  check('guest: no console errors', !unexpected().length, unexpected().slice(0, 3).join(' || '));
  errors.length = 0;

  // ── Logged in (fake long-lived session, unsigned JWT; the SDK takes it offline) ──
  const u = await open();
  await u.setViewportSize({ width: 1280, height: 800 }); // the account menu is desktop (lg+)
  await go(u, '/gioi-thieu/');
  await u.evaluate(() => {
    const b64 = (o) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    const exp = 4102444800;
    const user = { id: 'e2e', aud: 'authenticated', email: 'e2e@example.com', user_metadata: { full_name: 'Cô Test', role: 'giao-vien' }, app_metadata: {} };
    const jwt = `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ sub: user.id, aud: user.aud, role: 'authenticated', email: user.email, exp })}.`;
    localStorage.setItem('tgat-auth', JSON.stringify({ access_token: jwt, refresh_token: 'e2e', token_type: 'bearer', expires_in: 3600, expires_at: exp, user }));
  });
  await u.reload();
  const inside = await u.getByRole('link', { name: 'Vào học', exact: true }).waitFor({ timeout: 5000 }).then(() => true, () => false);
  check('logged in: public header shows "Vào học"', inside);

  await go(u, '/', '/trang-chu/');
  check('logged in: / -> /trang-chu/', path(u) === '/trang-chu/', u.url());
  await go(u, '/dang-nhap/?next=%2Fchu-de%2F', '/chu-de/');
  check('logged in: /dang-nhap/?next=/chu-de/ -> /chu-de/', path(u) === '/chu-de/', u.url());
  await go(u, '/dang-nhap/?next=%2F%2Fevil.com', '/trang-chu/');
  check('logged in: ?next=//evil.com -> /trang-chu/', u.url() === BASE + '/trang-chu/', u.url());

  await u.locator('summary[aria-label="Tài khoản"]:visible').or(u.locator('summary:visible', { hasText: 'Tài khoản' })).first().click();
  check('account menu shows the name', await u.locator('details[open]').getByText('Cô Test').first().isVisible());
  await u.getByRole('button', { name: 'Đăng xuất' }).first().click();
  await u.waitForURL((x) => x.pathname === '/', { timeout: 10000 }).catch(() => {});
  check('Đăng xuất -> /', path(u) === '/', u.url());
  check('Đăng xuất removes tgat-auth', (await u.evaluate(() => localStorage.getItem('tgat-auth'))) === null);

  // Back lands on the /chu-de/ entry (maybe from the Back/Forward cache): it must bounce, never show.
  await u.evaluate(() => sessionStorage.removeItem('e2e-paint'));
  await u.goBack().catch(() => {});
  await u.waitForURL((x) => x.pathname === '/dang-nhap/', { timeout: 8000 }).catch(() => {});
  await u.waitForTimeout(800);
  seen = await painted(u);
  check('Back after sign-out shows no gated page', ['/dang-nhap/', '/'].includes(path(u)) && !seen.includes('SHOWN'), `${u.url()} ${seen}`);
  check('logged in + sign-out: no console errors', !unexpected().length, unexpected().slice(0, 3).join(' || '));

  if (browser) await ctx.close();
  else for (const p of [g, l, u]) await p.close();
  return log.join('\n');
}
