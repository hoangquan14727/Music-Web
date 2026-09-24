// End-to-end run of the 5 games, for the Playwright MCP tool (browser_run_code
// with filename: web/tests/e2e-games.mcp.js). Needs the static site served:
//   npm run build && npx serve out -l 4321
// Returns a short log; expected scores: NCH 5/6, Đoán 6/6 (4 options), Nối 8/9.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- the file is one function expression
async (page) => {
  const BASE = 'http://127.0.0.1:4321';
  const log = [];
  const idOf = (src) => src.split('/').pop().replace('.mp3', '');
  const playing = () => page.evaluate(() => document.documentElement.dataset.playing || null);
  const waitPlaying = async () => {
    for (let i = 0; i < 40; i++) { const p = await playing(); if (p) return p; await page.waitForTimeout(100); }
    return null;
  };
  // Questions change inside a view transition: wait until the old one has left the DOM.
  const next = async () => {
    const old = await page.locator('[data-option], [data-token], [data-answer]').first().elementHandle().catch(() => null);
    await page.getByRole('button', { name: /Câu tiếp theo|Xem kết quả/ }).click();
    if (old) await old.waitForElementState('hidden').catch(() => {});
  };
  await page.setViewportSize({ width: 1024, height: 768 });

  // 1) Nghe – chọn hình: 1 wrong first tap, rest correct -> 5/6
  await page.goto(BASE + '/on-tap/nghe-chon-hinh/');
  await page.getByRole('button', { name: /Bắt đầu/ }).click();
  for (let q = 0; q < 6; q++) {
    const src = await waitPlaying();
    if (q === 0 && !src) log.push('NCH: Q1 audio did NOT start');
    await page.locator('[data-option]').first().waitFor({ timeout: 8000 });
    await page.getByTestId('replay').click();
    const id = idOf(await waitPlaying());
    const opts = await page.locator('[data-option]').evaluateAll((e) => e.map((x) => x.dataset.option));
    if (q === 0) {
      await page.locator(`[data-option="${opts.find((o) => o !== id)}"]`).click();
      await page.getByText('Thử lại nhé!').waitFor({ timeout: 3000 });
      await page.waitForTimeout(1200);
    }
    await page.locator(`[data-option="${id}"]`).click();
    await page.locator(`[data-option="${id}"]`).click({ force: true }).catch(() => {});
    await next();
  }
  log.push('NCH: ' + (await page.getByRole('heading', { level: 1 }).innerText()));

  // 2) Đoán âm thanh: level 5–6 tuổi -> 4 options
  await page.goto(BASE + '/on-tap/doan-am-thanh/');
  await page.getByRole('button', { name: /5–6 tuổi/ }).click();
  await page.locator('[data-option]').first().waitFor({ timeout: 8000 });
  log.push('Đoán 5–6 tuổi options: ' + (await page.locator('[data-option]').count()));
  for (let q = 0; q < 6; q++) {
    await page.locator('[data-option]').first().waitFor({ timeout: 8000 });
    await page.getByTestId('replay').click();
    const id = idOf(await waitPlaying());
    await page.locator(`[data-option="${id}"]`).click();
    await next();
  }
  log.push('Đoán: ' + (await page.getByRole('heading', { level: 1 }).innerText()));

  // 3) Nối: board 1 has one wrong attempt -> 8/9
  await page.goto(BASE + '/on-tap/noi-am-thanh-hinh-anh/');
  await page.getByRole('button', { name: /Bắt đầu/ }).click();
  for (let b = 0; b < 3; b++) {
    await page.locator('[data-token]').first().waitFor({ timeout: 8000 });
    const tokens = await page.locator('[data-token]').evaluateAll((e) => e.map((x) => x.dataset.token));
    // tapping a picture before a sound -> hint, not scored
    if (b === 0) {
      await page.locator('[data-image]').first().click();
      await page.getByText('Chạm vào chiếc loa trước nhé!').waitFor({ timeout: 2000 });
    }
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      await page.locator(`[data-token="${t}"]`).click();
      if (b === 0 && i === 0) {
        const wrong = tokens.find((x) => x !== t);
        await page.locator(`[data-image="${wrong}"]`).click();
        await page.getByText('Thử lại nhé!').waitFor({ timeout: 2000 });
        await page.waitForTimeout(1200);
        await page.locator(`[data-token="${t}"]`).click();
      }
      await page.locator(`[data-image="${t}"]`).click();
    }
    await next();
  }
  log.push('Nối: ' + (await page.getByRole('heading', { level: 1 }).innerText()));

  // 4) Phân biệt: answer via data-answer after reveal; check sounds play in sequence
  await page.goto(BASE + '/on-tap/phan-biet-am-thanh/');
  await page.getByRole('button', { name: /Bắt đầu/ }).click();
  const seen = new Set();
  for (let q = 0; q < 5; q++) {
    for (let i = 0; i < 60; i++) { const p = await playing(); if (p) seen.add(p); await page.waitForTimeout(100); if (seen.size && !p && i > 25) break; }
    const answers = await page.locator('[data-answer]').evaluateAll((e) => e.map((x) => x.dataset.answer));
    // read correct answer from DOM is impossible (by design); try each until "Giỏi quá!"
    for (const a of answers) {
      await page.locator(`[data-answer="${a}"]`).click({ timeout: 12000 });
      if (await page.getByText('Giỏi quá!').isVisible().catch(() => false)) break;
      await page.waitForTimeout(3500);
    }
    await next();
  }
  log.push('Phân biệt: ' + (await page.getByRole('heading', { level: 1 }).innerText()) + ' | distinct sounds played: ' + seen.size);

  // 5) Ôn tập nhanh: just complete it, whatever the kinds
  await page.goto(BASE + '/on-tap/on-tap-nhanh/');
  await page.getByRole('button', { name: /Bắt đầu/ }).click();
  const kinds = [];
  for (let q = 0; q < 6; q++) {
    await page.waitForTimeout(300);
    if (await page.locator('[data-token]').count()) {
      kinds.push('match');
      const tokens = await page.locator('[data-token]').evaluateAll((e) => e.map((x) => x.dataset.token));
      for (const t of tokens) { await page.locator(`[data-token="${t}"]`).click(); await page.locator(`[data-image="${t}"]`).click(); }
    } else if (await page.getByTestId('replay').innerText().then((t) => t.includes('cả hai')).catch(() => false)) {
      kinds.push('compare');
      await page.locator('[data-answer]').first().waitFor();
      await page.waitForFunction(() => !document.querySelector('[data-answer]')?.className.includes('pointer-events-none'), null, { timeout: 12000 });
      for (const a of await page.locator('[data-answer]').evaluateAll((e) => e.map((x) => x.dataset.answer))) {
        await page.locator(`[data-answer="${a}"]`).click();
        if (await page.getByText('Giỏi quá!').isVisible().catch(() => false)) break;
        await page.waitForTimeout(3500);
      }
    } else {
      kinds.push('choose');
      await page.locator('[data-option]').first().waitFor({ timeout: 8000 });
      await page.getByTestId('replay').click();
      const id = idOf(await waitPlaying());
      await page.locator(`[data-option="${id}"]`).click();
    }
    await next();
  }
  log.push('Ôn tập nhanh kinds: ' + kinds.join(',') + ' | ' + (await page.getByRole('heading', { level: 1 }).innerText()));
  return log.join('\n');
}
