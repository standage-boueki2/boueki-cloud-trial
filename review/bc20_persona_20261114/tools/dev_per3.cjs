// 21.92 per：物流レートの入力の確かめ・削除の確認・業種ごとの項目
process.env.BASE = process.env.BASE || 'http://127.0.0.1:8811/';
const fs = require('fs'); const path = require('path');
const L = require('./lib.cjs');
(async () => {
  // 物流会社
  {
    const FIX = JSON.parse(fs.readFileSync(path.join(L.SP, 'tools', 'fwd_fixture.json'), 'utf8'));
    const { browser, page, log } = await L.open({ acct: { code: 'BC-DEV-F3', co: 'デモ物流株式会社', who: '佐藤 健', role: 'fwd' }, mock: { fwdBlob: FIX } });
    const dialogs = [];
    page.removeAllListeners('dialog');
    let accept = false;
    page.on('dialog', async (d) => { dialogs.push(d.message().replace(/\s+/g, ' ').slice(0, 90)); if (accept) await d.accept(); else await d.dismiss(); });
    await L.enter(page);
    await L.go(page, 'frates');
    const n0 = await page.evaluate(() => FWDB.rates.length);
    await page.fill('#frPol', '横浜港'); await page.fill('#frPod', 'ホーチミン'); await page.fill('#frPrice', '-5'); await page.fill('#frTt', '9');
    await page.click('#frAdd'); await page.waitForTimeout(700);
    const n1 = await page.evaluate(() => ({ n: FWDB.rates.length, tst: (document.getElementById('tst') || {}).innerText || '' }));
    await page.fill('#frPol', '横浜港'); await page.fill('#frPod', 'ホーチミン'); await page.fill('#frPrice', '１２，０００'); await page.fill('#frTt', '9');
    await page.click('#frAdd'); await page.waitForTimeout(900);
    const n2 = await page.evaluate(() => ({ n: FWDB.rates.length, last: FWDB.rates.filter((r) => /ホーチミン/.test(r.pod)).map((r) => r.pod + ':' + r.price).join(',') }));
    console.log('fwd add: before', n0, '| -5 →', JSON.stringify(n1).slice(0, 160), '| 12,000 →', JSON.stringify(n2));
    // 削除：やめる → 残る／はい → 消える
    await L.go(page, 'frates');
    accept = false;
    await page.evaluate(() => { const b = document.querySelector('[data-frdel]'); b.scrollIntoView({ block: 'center' }); b.click(); }); await page.waitForTimeout(600);
    const d1 = await page.evaluate(() => FWDB.rates.length);
    accept = true;
    await page.evaluate(() => { const b = document.querySelector('[data-frdel]'); b.click(); }); await page.waitForTimeout(900);
    const d2 = await page.evaluate(() => FWDB.rates.length);
    console.log('fwd delete: cancel →', d1, '| accept →', d2, '| dialogs', JSON.stringify(dialogs).slice(0, 260));
    console.log('fwd errors', JSON.stringify(log.errors).slice(0, 300));
    await browser.close();
  }
  // 業種ごとの項目
  for (const [f, re] of [['商品情報_医療衛生_medical_mask.xlsx', /医療・衛生用品の項目/], ['商品情報_自動車建機_machine_excavator.xlsx', /建設機械・産業機械の項目/], ['商品情報_文化教育_culture_shodo.xlsx', /文化・教育用品の項目/]]) {
    const { browser, page, log } = await L.open({ acct: { code: 'BC-DEV-G' + f.length, co: 'テスト商事株式会社', who: '開発 太郎' } });
    await L.enter(page);
    await L.registerByUpload(page, f, 5000);
    await L.clickText(page, '反映して進める'); await page.waitForTimeout(1500);
    await L.go(page, 'item');
    const t = await L.text(page, '.stage');
    const i = t.search(re);
    console.log(f.slice(5, 14), '→', i >= 0 ? t.slice(i, i + 170).replace(/\n+/g, ' | ') : 'GROUP NOT FOUND', '| groups', await page.evaluate(() => JSON.stringify(v68pGroups(TEN))), '| missing', await page.evaluate(() => scoreOf(TEN).missing.length), '| errors', log.errors.length);
    await browser.close();
  }
})().catch((e) => { console.error(String((e && e.stack) || e).slice(0, 900)); process.exit(1); });
