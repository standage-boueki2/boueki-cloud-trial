// 回帰の確かめ：全画面を開いてページのエラーが無いことを見る。
//   BASE=http://127.0.0.1:8811/ node regress.cjs <見本キー,…|upload:ファイル名|fwd> [mobile]
const fs = require('fs'); const path = require('path');
const L = require('./lib.cjs');
(async () => {
  const targets = (process.argv[2] || 'food').split(',');
  const mobile = process.argv[3] === 'mobile';
  let bad = 0;
  for (const tg of targets) {
    const fwd = tg === 'fwd';
    const acct = fwd ? { code: 'BC-REG-F1', co: 'デモ物流株式会社', who: '佐藤 健', role: 'fwd' } : { code: 'BC-REG-S1', co: 'テスト商事株式会社', who: '山田 花子' };
    const mock = fwd ? { fwdBlob: JSON.parse(fs.readFileSync(path.join(L.SP, 'tools', 'fwd_fixture.json'), 'utf8')) } : undefined;
    const { browser, page, log } = await L.open({ acct, mock, mobile });
    try {
      await L.enter(page);
      if (!fwd) { if (/^upload:/.test(tg)) { await L.registerByUpload(page, tg.slice(7)); await L.clickText(page, 'すべて登録する（1）').catch(() => {}); await page.waitForTimeout(1500); } else if (tg !== 'none') await L.loadSample(page, tg); }
      const keys = await page.evaluate((f) => (f ? RDX.NAV_F : RDX.NAV_S).flatMap((g) => g.items.map((i) => i[0])), fwd);
      const rows = [];
      for (const k of keys) {
        const e0 = log.errors.length, c0 = log.console.length;
        await L.go(page, k, 1500);
        const m = await page.evaluate(() => ({ cur: RDX.curKey(), sw: document.documentElement.scrollWidth, vw: innerWidth, len: (document.querySelector('.stage') || document.body).innerText.length, ten: (typeof TEN !== 'undefined' && TEN) ? (TEN.co || '') : '' }));
        const errs = log.errors.slice(e0), cons = log.console.slice(c0).filter((x) => /^\[error\]/.test(x) && !/Content Security Policy|Refused to connect|許可リスト/.test(x));
        const over = m.sw > m.vw + 2;
        if (errs.length || cons.length || over || m.len < 40) { bad++; rows.push(`  NG ${k} cur=${m.cur} len=${m.len}${over ? ' 横はみ出し ' + m.sw + '>' + m.vw : ''} ${errs.join(' | ').slice(0, 300)} ${cons.join(' | ').slice(0, 300)}`); }
      }
      console.log(`${tg}${mobile ? '(mobile)' : ''}: ${keys.length} 画面 ${rows.length ? 'NG ' + rows.length : 'OK'}`);
      if (rows.length) console.log(rows.join('\n'));
    } catch (e) { bad++; console.log(tg, 'FAILED', String(e && e.stack || e).slice(0, 400)); }
    await browser.close();
  }
  console.log(bad ? `NG 合計 ${bad}` : 'ALL OK');
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(String(e && e.stack || e).slice(0, 900)); process.exit(1); });
