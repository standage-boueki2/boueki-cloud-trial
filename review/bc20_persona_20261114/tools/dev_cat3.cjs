// カテゴリーの判定の確かめ：8種類の資料を順に登録し、cat・catRaw・営業資料の型・バイヤーの区分を出す
process.env.BASE = process.env.BASE || 'http://127.0.0.1:8811/';
const L = require('./lib.cjs');
const FILES = ['商品情報_食品_food_honey.xlsx', '商品情報_生活用品_daily_towel.xlsx', '商品情報_工業農業_agri_fert.xlsx', '商品情報_健康美容_health_supp.xlsx', '商品情報_医療衛生_medical_mask.xlsx', '商品情報_自動車建機_machine_excavator.xlsx', '商品情報_文化教育_culture_shodo.xlsx', '商品情報_その他_other_pet.xlsx'];
(async () => {
  for (const f of FILES) {
    const { browser, page, log } = await L.open({ acct: { code: 'BC-DEV-C' + FILES.indexOf(f), co: 'テスト商事株式会社', who: '開発 太郎' } });
    try {
      await L.enter(page);
      await L.registerByUpload(page, f, 5000);
      const r = await page.evaluate(() => {
        const t = TEN; const out = { cat: t.cat, raw: t.catRaw, ck: t.catKey, why: t.v92catWhy || '', ask: t.v92catAsk || '', hs: t.hs, comp: t.compTitle };
        try { out.ind = v68indOf(t); } catch (e) { out.ind = 'ERR ' + e.message; }
        try { out.deck = V85DK.cat(t).k; } catch (e) { out.deck = 'ERR ' + e.message; }
        try { out.buy = v41MyCat(); } catch (e) { out.buy = 'ERR ' + e.message; }
        try { out.car = v70prodIsCar(t); } catch (e) { out.car = 'ERR'; }
        try { out.used = v68indIsUsed(t); } catch (e) { out.used = 'ERR'; }
        return out;
      });
      console.log(f.replace('商品情報_', '').replace('.xlsx', ''), JSON.stringify(r), log.errors.length ? 'ERRORS ' + JSON.stringify(log.errors).slice(0, 300) : '');
    } catch (e) { console.log(f, 'FAILED', String(e).slice(0, 200)); }
    await browser.close();
  }
  // 自由入力の読み取り
  const { browser, page } = await L.open({ acct: { code: 'BC-DEV-CX', co: 'テスト商事株式会社', who: '開発 太郎' } });
  await L.enter(page);
  const T = ['ペット用品（猫用の爪とぎ・段ボール製のベッド）', '文化・教育（書道用品）です', '健康・美容', '自動車・建機', '工業・農業', '生活用品', '医療・衛生', '文化・教育', '油圧ショベル', '有機液体肥料', '乳酸菌サプリメント', '知育玩具', '釣具', '今治タオル', 'はちみつ', '純米大吟醸'];
  const r = await page.evaluate((T) => T.map((x) => { let a, b; try { a = v54hearCatOf(x, true); } catch (e) { a = { cat: 'ERR' }; } try { b = v54hearCatOf(x, false); } catch (e) { b = { cat: 'ERR' }; } return x + ' → strict:' + (a ? a.cat : 'null') + ' / loose:' + (b ? b.cat : 'null'); }), T);
  console.log(r.join('\n'));
  await browser.close();
})().catch((e) => { console.error(String((e && e.stack) || e).slice(0, 900)); process.exit(1); });
