// 今の版（刷新版の層なし）で 21.92 が動くかの確かめ：BASE=http://127.0.0.1:8802/ node base_smoke.cjs
process.env.BASE = process.env.BASE || 'http://127.0.0.1:8802/';
const L = require('./lib.cjs');
(async () => {
  const { browser, page, log } = await L.open({ acct: { code: 'BC-BASE-0001', co: 'テスト商事株式会社', who: '山田 花子' } });
  await page.goto(L.BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.body.classList.contains('locked') && typeof TENS !== 'undefined', null, { timeout: 30000 });
  await page.waitForTimeout(2500);
  console.log(await page.evaluate(() => JSON.stringify({ ver: BC20_VER, build: BC20_BUILD, cat: !!window.__v2192cat, per: !!window.__v2192per, rd: typeof RDX !== 'undefined', s2: Object.keys(SAMPLES2).length })));
  await page.evaluate(() => { const w = document.getElementById('welgo'); if (w) w.click(); });
  await page.waitForTimeout(600);
  await page.evaluate(() => { try { v1811Close(); } catch (e) {} });
  let bad = 0;
  for (const smp of ['agri', 'machine', 'culture', 'daily']) {
    await page.evaluate((k) => adoptSample2(k), smp); await page.waitForTimeout(1500);
    for (const p of ['dash', 'today', 'up', 'item', 'cty', 'deck', 'db', 'deal', 'msg', 'ops', 'docs', 'legal', 'task', 'team', 'ai']) {
      const e0 = log.errors.length;
      await page.evaluate((p) => go(p), p); await page.waitForTimeout(900);
      const m = await page.evaluate(() => ({ cur, len: document.getElementById('well').innerText.length, sw: document.documentElement.scrollWidth, vw: innerWidth }));
      if (log.errors.length > e0 || m.len < 40) { bad++; console.log('NG', smp, p, JSON.stringify(m), log.errors.slice(e0).join(' | ').slice(0, 300)); }
    }
    console.log(smp, 'ok ten=', await page.evaluate(() => TEN.co + '／' + TEN.cat));
  }
  // サンプルで試すの窓と、社内規制DB
  await page.evaluate(() => v84SmpOpen()); await page.waitForTimeout(500);
  console.log('smp dw:', (await L.overlays(page)).filter((o) => o.id === 'dw').map((o) => o.text.replace(/\s+/g, ' ').slice(0, 90)).join(''));
  await page.evaluate(() => { closeDW(); openRegdb(); }); await page.waitForTimeout(500);
  console.log('regdb dw:', (await L.overlays(page)).filter((o) => o.id === 'dw').map((o) => o.text.replace(/\s+/g, ' ').slice(0, 60)).join(''));
  console.log(bad ? 'NG ' + bad : 'BASE OK', 'errors', JSON.stringify(log.errors).slice(0, 400));
  await browser.close();
})().catch((e) => { console.error(String((e && e.stack) || e).slice(0, 900)); process.exit(1); });
