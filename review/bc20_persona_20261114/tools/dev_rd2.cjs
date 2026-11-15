// 21.92 per の刷新版の層の確かめ（販売先国・説明・AI のボタン）
process.env.BASE = process.env.BASE || 'http://127.0.0.1:8811/';
const L = require('./lib.cjs');
(async () => {
  const { browser, page, log } = await L.open({ profile: 'dev_rd2', acct: { code: 'BC-DEV-R2', co: 'テスト商事株式会社', who: '開発 太郎' } });
  await L.enter(page);
  if (!(await page.evaluate(() => TENS.length))) { await L.registerByUpload(page, '商品情報_工業農業_agri_fert.xlsx', 5000); await L.clickText(page, '反映して進める'); await page.waitForTimeout(1500); }
  await L.go(page, 'cty');
  if (!(await page.evaluate(() => ((TEN.ctySel && TEN.ctySel.rec) || []).length))) await L.clickText(page, 'AI商社マンにおまかせ（1クリック）', '.stage', { wait: 6000 });
  await L.go(page, 'cty');
  const a = await page.evaluate(() => { const box = document.querySelector('.rd-x.rd-p2'); const cells = Array.from(box.querySelectorAll('.k-tiles [title]')).filter((e) => /^(市場性|規制|競合|拠点)：/.test(e.title)).map((e) => e.innerText.replace(/\s+/g, ' ')); const svg = box.querySelector('svg[aria-label="主要指標の比較"]'); return { cells: cells.slice(0, 8), polys: svg ? svg.querySelectorAll('polygon[fill-opacity]').length : -1, lines: svg ? svg.querySelectorAll('polyline').length : -1, note: (box.querySelector('.k-v92nan') || {}).textContent || '', order: Array.from(document.querySelectorAll('#well > *')).map((e) => e.id || e.className.split(' ')[0]).join(' > '), senko: /先行者不在/.test(document.querySelector('.stage').innerText) }; });
  console.log('cty:', JSON.stringify(a).slice(0, 900));
  await L.shot(page, 'dev_rd2_cty');
  // 詳細を開く
  const opened = await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.stage button, .stage a')).find((x) => /詳細\s*→|詳細レポートを見る/.test(x.textContent || '')); if (b) { b.click(); return b.textContent.trim().slice(0, 20); } return ''; });
  await page.waitForTimeout(1500);
  const d = await page.evaluate(() => { const h = Array.from(document.querySelectorAll('.lbl')).find((x) => /COUNTRY DEEP-DIVE/.test(x.textContent || '')); const box = document.querySelector('.rd-x.rd-p2'); return { y: Math.round(scrollY), deepTop: h ? Math.round(h.getBoundingClientRect().top) : null, folded: box && box.classList.contains('k-v92deep'), boxH: box ? Math.round(box.getBoundingClientRect().height) : -1 }; });
  console.log('deep:', opened, JSON.stringify(d));
  await L.shot(page, 'dev_rd2_deep');
  // 一覧へ戻る
  await L.clickText(page, '← 一覧へ戻る', '.stage'); await page.waitForTimeout(1200);
  console.log('back:', await page.evaluate(() => { const box = document.querySelector('.rd-x.rd-p2'); return JSON.stringify({ folded: box.classList.contains('k-v92deep'), sel: (document.getElementById('k-ctysel') || {}).innerText || '' }).slice(0, 200); }));
  // AI のボタン（下へ送る）
  await page.evaluate(() => window.scrollTo(0, 900)); await page.waitForTimeout(500);
  console.log('fab:', await page.evaluate(() => { const f = document.getElementById('askfab'); const r = f.getBoundingClientRect(); return JSON.stringify({ min: f.classList.contains('k-v92min'), w: Math.round(r.width), h: Math.round(r.height), kids: Array.from(f.children).map((c) => c.tagName + ':' + (c.textContent || '').slice(0, 8)) }); }));
  await L.shot(page, 'dev_rd2_fab');
  // 説明の重複（規制の画面と登録の画面）
  for (const k of ['ops:reg', 'up']) { await L.go(page, k); await L.dismissFirstRun(page); console.log(k, 'qline:', await page.evaluate(() => { const L2 = Array.from(document.querySelectorAll('.k-qline')); let adj = 0; L2.forEach((q) => { const n = q.nextElementSibling; if (n && n.classList.contains('k-qline')) adj++; }); return L2.length + ' adjacent=' + adj + ' text=' + /説明\s*\?\s*説明|\?\s*説明\s*\?\s*説明/.test(document.querySelector('.stage').innerText.replace(/\n/g, ' ')); })); }
  console.log('errors', JSON.stringify(log.errors).slice(0, 500), JSON.stringify(log.console.filter((x) => /rd v92/.test(x))).slice(0, 300));
  await browser.close();
})().catch((e) => { console.error(String((e && e.stack) || e).slice(0, 900)); process.exit(1); });
