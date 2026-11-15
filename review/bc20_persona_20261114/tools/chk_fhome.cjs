// 物流会社のホーム「全体の状況」に null が出ないか・札に名前があるか
process.env.BASE = process.env.BASE || 'http://127.0.0.1:8811/';
const fs = require('fs'); const path = require('path');
const L = require('./lib.cjs');
(async () => {
  const FIX = JSON.parse(fs.readFileSync(path.join(L.SP, 'tools', 'fwd_fixture.json'), 'utf8'));
  const { browser, page, log } = await L.open({ acct: { code: 'BC-DEV-F6', co: 'デモ物流株式会社', who: '佐藤 健', role: 'fwd' }, mock: { fwdBlob: FIX } });
  await L.enter(page);
  await L.go(page, 'fhome');
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const box = document.querySelector('.rd-tiles.k-v92ov');
    if (!box) return { box: false };
    return { box: true, hasNull: /null/.test(box.innerText), groups: Array.from(box.querySelectorAll('.k-v92ovg')).map((x) => x.textContent), tiles: Array.from(box.querySelectorAll('.rd-tile b')).map((x) => x.textContent) };
  });
  console.log(JSON.stringify(r), 'errors', log.errors.length);
  await browser.close();
})().catch((e) => { console.error(String((e && e.stack) || e).slice(0, 600)); process.exit(1); });
