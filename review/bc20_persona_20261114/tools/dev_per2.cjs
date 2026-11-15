// 21.92 per：読み取り（強み・建値）・登録メニューを閉じたあとの表示・未反映の文・商品情報の文
process.env.BASE = process.env.BASE || 'http://127.0.0.1:8811/';
const L = require('./lib.cjs');
(async () => {
  const { browser, page, log } = await L.open({ acct: { code: 'BC-DEV-P2', co: 'テスト商事株式会社', who: '開発 太郎' } });
  await L.enter(page);
  await L.registerByUpload(page, '商品情報_生活用品_daily_towel.xlsx', 5000);
  console.log('1 parse:', await page.evaluate(() => JSON.stringify({ cat: TEN.cat, term: TEN.term, pol: TEN.pol, strengths: (TEN.strengths || []).map((s) => (Array.isArray(s) ? s[0] : s)).slice(0, 3), pendS: TEN._pend && TEN._pend.prods && TEN._pend.prods[0].x.strengths && TEN._pend.prods[0].x.strengths.length })));
  console.log('2 pend note:', await page.evaluate(() => { const b = document.getElementById('v188pend'); return b ? b.innerText.replace(/\n+/g, ' | ').slice(0, 260) : 'no banner'; }));
  await L.clickText(page, 'すべて登録する（1）'); await page.waitForTimeout(2200);
  console.log('3 after apply:', await page.evaluate(() => JSON.stringify({ term: TEN.term, pol: TEN.pol, strengths: (TEN.strengths || []).length, pend: !!TEN._pend, fill: FILL.on, fk: FILL.cur && FILL.cur.k, miss: scoreOf(TEN).missing.map((m) => m.n) })));
  // 登録メニューを開いて閉じる
  await L.go(page, 'dash:home'); await L.go(page, 'up');
  const m1 = await page.evaluate(() => ({ menu: !!document.getElementById('v1811ov'), regedit: document.querySelectorAll('.regedit').length }));
  if (m1.menu) { await page.click('#v1811skip'); await page.waitForTimeout(700); }
  console.log('4 menu close:', JSON.stringify(m1), '->', await page.evaluate(() => JSON.stringify({ focus: V1811.focus && V1811.focus.k, regedit: document.querySelectorAll('.regedit').length })));
  // ✎ と ☆
  console.log('5 card:', await page.evaluate(() => { const e = document.querySelector('.regedit'); if (!e) return 'no regedit'; e.scrollIntoView({ block: 'center' }); const rc = (x) => { const q = x.getBoundingClientRect(); return Math.round(q.x) + ',' + Math.round(q.y) + ' ' + Math.round(q.width) + 'x' + Math.round(q.height); }; const star = Array.from(e.closest('button, div').parentElement.querySelectorAll('button')).find((b) => /マーク/.test(b.title || '')); return 'edit ' + rc(e) + ' pos=' + getComputedStyle(e).position + ' | star ' + (star ? rc(star) + ' pos=' + getComputedStyle(star).position : 'none') + ' | parent ' + e.parentElement.tagName + '.' + e.parentElement.className + ' ' + rc(e.parentElement); }));
  await L.go(page, 'item');
  console.log('6 item kd:', await page.evaluate(() => { const k = Array.from(document.querySelectorAll('.kd')).find((x) => /関税/.test(x.textContent)); return k ? k.textContent : 'none'; }));
  console.log('errors', JSON.stringify(log.errors).slice(0, 500));
  await browser.close();
})().catch((e) => { console.error(String((e && e.stack) || e).slice(0, 900)); process.exit(1); });
