// 21.92 per の本体の層の確かめ
process.env.BASE = process.env.BASE || 'http://127.0.0.1:8811/';
const L = require('./lib.cjs');
const pos = (page) => page.evaluate(() => { const b = document.getElementById('fin2'); const r = b ? b.getBoundingClientRect() : null; return { y: Math.round(scrollY), fin2: r ? Math.round(r.top) : null, vh: innerHeight, cur: FILL && FILL.cur && FILL.cur.k, on: FILL && FILL.on }; });
(async () => {
  const { browser, page, log } = await L.open({ acct: { code: 'BC-DEV-P1', co: 'テスト商事株式会社', who: '開発 太郎' } });
  await L.enter(page);
  await L.registerByUpload(page, '商品情報_工業農業_agri_fert.xlsx', 5000);
  // 1) AIの質問に答える → 答える欄が見える
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('#rdfill'); await page.waitForTimeout(1600);
  console.log('1 rdfill:', JSON.stringify(await pos(page)));
  // 2) 「反映して進める」→ 次の質問でも見える
  const ok = await L.clickText(page, '反映して進める'); await page.waitForTimeout(1800);
  console.log('2 反映:', ok, JSON.stringify(await pos(page)));
  // 3) 質問に答えていく（取引条件に産地を入れてみる）
  for (let i = 0; i < 8; i++) {
    const st = await pos(page);
    if (!st.on || !st.cur) break;
    const k = st.cur;
    const ans = k === 'term' ? '日本（北海道）' : k === 'pay' ? 'T/T 前払い' : k === 'pol' ? '苫小牧港' : k === 'origin' ? '日本（北海道帯広市）' : k === 'strengths' ? '有機JAS 適合資材／1000倍希釈で使える／糖度向上の試験データあり' : k === 'dimRows' ? '単品 90×90×230mm 1.25kg／外装 390×300×260mm 15.6kg 12本入' : k === 'ctn' ? '12本／ケース・40ケース／パレット' : k === 'priceRows' ? '〜1,199本 US$8.20／1,200本〜 US$7.40' : 'わからない';
    await page.fill('#fans', ans); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
    const st2 = await pos(page);
    const tst = await page.evaluate(() => (document.getElementById('tst') || {}).innerText || '');
    console.log(`3 q=${k} ans=${ans.slice(0, 14)} -> next=${st2.cur} fin2=${st2.fin2}/${st2.vh} term=${await page.evaluate(() => TEN.term)} toast=${tst.slice(0, 40)}`);
    if (k === 'term' && st2.cur === 'term') { await page.fill('#fans', 'FOB 苫小牧'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500); console.log('   term 再回答 ->', await page.evaluate(() => TEN.term), JSON.stringify(await pos(page))); }
  }
  // 4) 商品情報：取引の基本条件
  await L.go(page, 'item');
  const t = await L.text(page, '.stage');
  const i = t.indexOf('取引の基本条件');
  console.log('4 item basic:', i >= 0 ? t.slice(i, i + 260).replace(/\n+/g, ' | ') : 'NOT FOUND');
  // 5) 規制：社内規制DB と 注意
  await L.go(page, 'ops:reg');
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.stage button')).find((x) => /社内規制DB/.test(x.textContent)); if (b) b.click(); }); await page.waitForTimeout(800);
  console.log('5 regdb:', JSON.stringify((await L.overlays(page)).filter((o) => o.id === 'dw').map((o) => o.text.slice(0, 160))));
  await page.evaluate(() => closeDW());
  const opts = await page.evaluate(() => Array.from(document.getElementById('rC').options).map((o) => o.value).filter((v) => /ロシア|北朝鮮|イラン/.test(v)));
  console.log('  sanction options:', opts.join(','));
  if (opts.length) { await page.selectOption('#rC', opts[0]); await page.waitForTimeout(1500); console.log('  note:', await page.evaluate(() => (document.getElementById('v92sanc') || {}).textContent || 'NONE')); }
  // 6) 販売先国：4か国目のチェック
  await L.go(page, 'cty');
  await L.clickText(page, 'AI商社マンにおまかせ（1クリック）', '.stage', { wait: 5000 });
  const n = await page.evaluate(() => { const bs = Array.from(document.querySelectorAll('input[data-ctypick]')).filter((x) => !x.disabled); bs.forEach((b) => { if (b.checked) b.click(); }); let c = 0; for (const b of bs.slice(0, 5)) { b.click(); if (b.checked) c++; } return { boxes: bs.length, checked: Array.from(document.querySelectorAll('input[data-ctypick]')).filter((x) => x.checked).length, clicked: c }; });
  console.log('6 ctypick:', JSON.stringify(n), 'toast:', await page.evaluate(() => (document.getElementById('tst') || {}).innerText || ''));
  console.log('errors', JSON.stringify(log.errors).slice(0, 600));
  await browser.close();
})().catch((e) => { console.error(String((e && e.stack) || e).slice(0, 900)); process.exit(1); });
