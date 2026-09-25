// Login gate end-to-end checks, for the Playwright MCP tool (browser_run_code with
// filename: web/tests/e2e-auth.mcp.js). Needs the static site built with the two
// NEXT_PUBLIC_SUPABASE_* values set (placeholders are fine) and served:
//   npm run build && npx serve out -l 4321
// Logged-in checks use fake stored sessions, no account. The bad reset-link check calls
// Supabase's verify endpoint (with placeholders it can't connect, which also passes); the
// successful reset runs against a mocked Supabase (page.route).
// Runs in its own browser context (in fresh tabs of the MCP one when that has no browser()).
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
  // Expected noise: the /xyz/ 404 itself; sign-out and the bad reset link calling Supabase.
  const unexpected = () => errors.filter((e) => !/\/xyz\/|\/auth\/v1\//.test(e));
  // Fake long-lived session (unsigned JWT; the SDK takes it offline), stored the way Supabase stores it.
  const seed = (p) =>
    p.evaluate(() => {
      const b64 = (o) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
      const exp = 4102444800;
      const user = { id: 'e2e', aud: 'authenticated', email: 'e2e@example.com', user_metadata: { full_name: 'Cô Test', role: 'giao-vien' }, app_metadata: {} };
      const jwt = `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ sub: user.id, aud: user.aud, role: 'authenticated', email: user.email, exp })}.`;
      localStorage.setItem('tgat-auth', JSON.stringify({ access_token: jwt, refresh_token: 'e2e', token_type: 'bearer', expires_in: 3600, expires_at: exp, user }));
    });
  const stored = (p) => p.evaluate(() => localStorage.getItem('tgat-auth'));
  const accountMenu = (p) => p.locator('summary[aria-label="Tài khoản"]:visible').or(p.locator('summary:visible', { hasText: 'Tài khoản' })).first().click();

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

  // ── Logged in ──
  const u = await open();
  await u.setViewportSize({ width: 1280, height: 800 }); // the account menu is desktop (lg+)
  await go(u, '/gioi-thieu/');
  await seed(u);
  await u.reload();
  const inside = await u.getByRole('link', { name: 'Vào học', exact: true }).waitFor({ timeout: 5000 }).then(() => true, () => false);
  check('logged in: public header shows "Vào học"', inside);

  await go(u, '/', '/trang-chu/');
  check('logged in: / -> /trang-chu/', path(u) === '/trang-chu/', u.url());
  await go(u, '/dang-nhap/?next=%2Fchu-de%2F', '/chu-de/');
  check('logged in: /dang-nhap/?next=/chu-de/ -> /chu-de/', path(u) === '/chu-de/', u.url());
  await go(u, '/dang-nhap/?next=%2F%2Fevil.com', '/trang-chu/');
  check('logged in: ?next=//evil.com -> /trang-chu/', u.url() === BASE + '/trang-chu/', u.url());

  await accountMenu(u);
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
  errors.length = 0;

  // ── Password-reset links: their session is never stored ──
  for (const p of [g, l, u]) await p.close(); // other tabs would react to the seeded sessions
  const r = await open();
  await r.setViewportSize({ width: 1280, height: 800 });
  const hdr = r.locator('header');
  const guestHeader = async () =>
    (await hdr.getByRole('link', { name: 'Đăng nhập', exact: true }).isVisible()) &&
    (await hdr.getByRole('link', { name: 'Đăng ký', exact: true }).isVisible()) &&
    (await hdr.getByRole('link', { name: 'Vào học', exact: true }).count()) === 0;
  const resetForm = (p) => p.getByLabel('Nhập lại mật khẩu', { exact: true }).waitFor({ timeout: 8000 }).then(() => true, () => false);
  const alertText = async (p) => {
    const a = p.locator('main [role=alert]').filter({ hasText: /\S/ }).first(); // not Next's route announcer
    await a.waitFor({ timeout: 15000 }).catch(() => {});
    return (await a.innerText().catch(() => '')).trim();
  };
  const save = async (p, pw) => {
    await p.getByLabel('Mật khẩu', { exact: true }).fill(pw);
    await p.getByLabel('Nhập lại mật khẩu', { exact: true }).fill(pw);
    await p.getByRole('button', { name: 'Lưu mật khẩu mới' }).click();
  };
  const LINK = '/dat-lai-mat-khau/?token_hash=abc&type=recovery';

  // A link is used up as soon as the page opens; the real Supabase refuses this fake token.
  await go(r, LINK, '/dat-lai-mat-khau/');
  let said = await alertText(r);
  check('reset link: token gone from the address bar', r.url() === BASE + '/dat-lai-mat-khau/', r.url());
  check('reset link: no token in the history entry', !(await r.evaluate(() => location.href + JSON.stringify(history.state))).includes('token_hash'));
  check('bad link: checked on open, Vietnamese expired/used message', /^(Link đã hết hạn hoặc đã được dùng|Không kết nối được máy chủ)/.test(said), said);
  check('bad link: "Gửi lại link" -> /quen-mat-khau/', /Không kết nối/.test(said) || (await r.getByRole('link', { name: 'Gửi lại link' }).getAttribute('href')) === '/quen-mat-khau/');
  check('reset link: guest header ("Đăng nhập" + "Đăng ký", no "Vào học")', await guestHeader());
  check('reset link: nothing stored', (await stored(r)) === null);
  await r.reload();
  said = await alertText(r);
  check('reset link: a reload finds no token', /không còn dùng được/.test(said), said);

  // Old implicit links (#access_token…&type=recovery) are refused on any page.
  for (const from of ['/', '/dat-lai-mat-khau/']) {
    await go(r, `${from}#access_token=x.y.z&type=recovery`, '/dat-lai-mat-khau/');
    said = await alertText(r);
    check(`old link on ${from}: -> ?link=cu, hash gone, old-link message`, r.url() === BASE + '/dat-lai-mat-khau/?link=cu' && /đã cũ/.test(said), `${r.url()} ${said}`);
    check(`old link on ${from}: nothing stored`, (await stored(r)) === null);
  }

  // A successful reset against a mocked Supabase: the link's session stays in memory; the
  // only session ever written to tgat-auth is the password login that follows.
  const m = await open();
  await m.addInitScript(() => {
    const set = Storage.prototype.setItem;
    window.__writes = [];
    Storage.prototype.setItem = function (k, v) {
      if (this === localStorage) window.__writes.push([k, String(v)]);
      return set.call(this, k, v);
    };
  });
  let REC = '', PW = '';
  const calls = [];
  const user = { id: 'e2e-r', aud: 'authenticated', role: 'authenticated', email: 'reset@example.com', user_metadata: { full_name: 'Cô Reset', role: 'giao-vien' }, app_metadata: {} };
  const session = (t) => JSON.stringify({ access_token: t, refresh_token: t === REC ? 'rec-refresh' : 'pw-refresh', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user });
  await m.route('**/auth/v1/**', (route) => {
    const req = route.request();
    const cors = { 'access-control-allow-origin': BASE, 'access-control-allow-methods': 'GET,POST,PUT,OPTIONS', 'access-control-allow-headers': req.headers()['access-control-request-headers'] || '*' };
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const at = req.url().replace(/^.*\/auth\/v1/, '');
    const bearer = (req.headers().authorization || '').replace('Bearer ', '');
    calls.push(`${req.method()} ${at}${bearer === REC ? ' rec' : bearer === PW ? ' pw' : ''}`);
    const json = (body) => route.fulfill({ status: 200, headers: { ...cors, 'content-type': 'application/json' }, body });
    if (at.startsWith('/verify')) return json(session(REC));
    if (at.startsWith('/user') && req.method() === 'PUT') return json(JSON.stringify(user));
    if (at.startsWith('/logout')) return route.fulfill({ status: 204, headers: cors });
    if (at.startsWith('/token?grant_type=password')) return json(session(PW));
    return route.fulfill({ status: 500, headers: { ...cors, 'content-type': 'application/json' }, body: '{"code":"unexpected"}' });
  });
  await go(m, '/gioi-thieu/');
  [REC, PW] = await m.evaluate(() => {
    const b64 = (o) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    const jwt = (sid) => `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ sub: 'e2e-r', aud: 'authenticated', role: 'authenticated', email: 'reset@example.com', exp: 4102444800, session_id: sid })}.`;
    return [jwt('recovery'), jwt('password')];
  });
  // A valid link: the form shows only after the check, and nothing is stored yet.
  await go(m, LINK, '/dat-lai-mat-khau/');
  check('valid link: form shown after the check on open', await resetForm(m));
  check('valid link: nothing stored before saving', (await stored(m)) === null);
  // Leaving drops the link: Back finds nothing to use.
  await m.locator('header a.chrome-logo').click();
  await m.waitForURL((x) => x.pathname === '/', { timeout: 8000 }).catch(() => {});
  check('valid link: leaving by the logo stores nothing', path(m) === '/' && (await stored(m)) === null, m.url());
  await m.goBack().catch(() => {});
  await m.waitForURL((x) => x.pathname === '/dat-lai-mat-khau/', { timeout: 8000 }).catch(() => {});
  said = await alertText(m);
  check('valid link: Back to it shows no form', /không còn dùng được/.test(said) && !(await m.getByLabel('Nhập lại mật khẩu', { exact: true }).count()), `${m.url()} ${said}`);
  // The Back/Forward cache keeps a page as it was left: pagehide must drop the link's session.
  await go(m, LINK, '/dat-lai-mat-khau/');
  await resetForm(m);
  await m.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  said = await alertText(m);
  check('valid link: pagehide drops it', /không còn dùng được/.test(said) && !(await m.getByLabel('Nhập lại mật khẩu', { exact: true }).count()), said);
  // Full success path.
  await go(m, '/gioi-thieu/');
  await m.evaluate(() => (window.__writes = []));
  calls.length = 0;
  await go(m, LINK, '/dat-lai-mat-khau/');
  await resetForm(m);
  await save(m, 'Matkhau-moi-123');
  await m.waitForURL((x) => x.pathname === '/trang-chu/', { timeout: 15000 }).catch(() => {});
  check('mocked reset: ends on /trang-chu/', path(m) === '/trang-chu/', path(m) === '/trang-chu/' ? '' : `${m.url()} ${await alertText(m)}`);
  const want = ['POST /verify', 'PUT /user rec', 'POST /logout?scope=local rec', 'POST /token?grant_type=password'];
  check('mocked reset: verify, PUT user and logout with the link session, then password login', JSON.stringify(calls) === JSON.stringify(want), JSON.stringify(calls));
  const writes = await m.evaluate(() => window.__writes);
  const authWrites = writes.filter(([k]) => k === 'tgat-auth').map(([, v]) => v);
  check('mocked reset: tgat-auth only ever written with the password session', authWrites.length > 0 && authWrites.every((v) => v.includes(PW) && !v.includes(REC)), `${authWrites.length} write(s)`);
  check('mocked reset: the link session never reached localStorage', !writes.some(([, v]) => v.includes(REC) || v.includes('rec-refresh')), JSON.stringify(writes.map(([k]) => k)));
  check('mocked reset: stored session is the password one', ((await stored(m)) || '').includes(PW));
  await m.unroute('**/auth/v1/**');
  await m.evaluate(() => localStorage.removeItem('tgat-auth'));
  await m.close();

  // "Đổi mật khẩu" with a normal session: unchanged.
  await go(r, '/gioi-thieu/');
  await seed(r);
  await go(r, '/trang-chu/');
  check('normal session: /trang-chu/ opens', path(r) === '/trang-chu/', r.url());
  await go(r, '/dat-lai-mat-khau/');
  said = await alertText(r);
  check('normal session: /dat-lai-mat-khau/ not from the menu shows no form', /không còn dùng được/.test(said) && !(await r.getByLabel('Nhập lại mật khẩu', { exact: true }).count()), said);
  await go(r, '/trang-chu/');
  await accountMenu(r);
  await r.locator('details[open]').getByRole('link', { name: 'Đổi mật khẩu' }).click();
  await r.waitForURL((x) => x.pathname === '/dat-lai-mat-khau/', { timeout: 8000 }).catch(() => {});
  check('normal session: "Đổi mật khẩu" shows the form', path(r) === '/dat-lai-mat-khau/' && (await resetForm(r)), r.url());
  check('normal session: header keeps "Vào học", session kept', (await hdr.getByRole('link', { name: 'Vào học', exact: true }).isVisible()) && (await stored(r)) !== null);
  await r.evaluate(() => localStorage.removeItem('tgat-auth'));
  check('reset links: no console errors', !unexpected().length, unexpected().slice(0, 3).join(' || '));

  if (browser) await ctx.close();
  else await r.close();
  return log.join('\n');
}
