// 評価の課題一覧（ISSUES.md）を作る：node mk_issues.cjs <findings dir> <out.md>
const fs = require('fs'); const path = require('path');
const [dir, out] = process.argv.slice(2);
// 21.92 での対応。F＝直した／P＝一部を直した／N＝未対応（次の版の候補）
const F = 'cross-06 cross-07 medical-04 food-01 culture-07 indagri-04 other-08 food-02 auto-11 daily-09 culture-05 indagri-01 culture-14 food-14 medical-14 daily-01 indagri-06 medical-01 health-03 daily-02 food-07 other-05 daily-06 food-09 health-04 food-10 culture-16 other-14 medical-09 auto-15 indagri-18 food-03 medical-03 indagri-09 other-03 culture-12 medical-08 food-05 culture-09 daily-05 medical-06 other-04 health-07 food-13 daily-13 auto-20 culture-01 indagri-07 other-01 health-01 culture-06 daily-08 auto-16'.split(' ');
const P = {
  'auto-02': '分類を直した（油圧ショベルは「建設機械」になり、中古乗用車の決まりは当てはめない）。建機向けの規制の中身は未',
  'auto-12': 'カードの「0」は「未評価」に。推奨の決め方（拠点を優先）は未', 'medical-05': 'カードの「0」は「未評価」に。未評価の国を1位にする決め方は未',
  'health-06': '詳細を開いた時の表示は直した。「確定に含める」が1か国だけで確定する件は未', 'indagri-05': '詳細を開いた時の帯の表示は直した。帯と表のチェックの連動は未',
  'auto-10': '4か国目のチェックは入らないようにした。2系統の選び方の一本化は未', 'daily-21': '「開拓しない国」は本題の下へ。「おまかせ」ボタンの重複は未', 'health-13': '同上', 'indagri-16': '同上',
  'culture-02': '取引条件（建値）はインコタームズ以外を登録しない。ほかの項目の確かめは未', 'medical-02': '同上（カードの質問の順番は未）', 'auto-04': '同上。登録した条件は商品情報「取引の基本条件」で見て直せる',
  'culture-11': '強み・建値・仕出港は読み取る。所在地は未', 'indagri-11': '強み・建値・仕出港・カテゴリーは読み取る', 'auto-06': '強み・建値は読み取る。カンマで割れる件・「規格」の欄は未',
  'food-08': '帯に「どちらか一方で大丈夫」と明記。表示の一本化は未', 'daily-07': '同上', 'auto-14': '同上', 'health-05': '同上', 'other-11': '同上',
  'culture-04': '登録メニューを閉じたあと、登録済みの商品の表示に戻す。毎回の「はじめまして」は評価環境の事情（実際のログインでは1回だけ）', 'auto-13': '同上', 'indagri-12': '同上（質問の欄までの手数は未）',
  'medical-12': '選択肢は「例」の見た目に・切れた文に「…」', 'daily-19': '同上（同じ文が2回は未）', 'food-16': '同上（100% でも「あとで埋める」が残る件は未）',
  'health-09': '「？説明」の重複は直した。用語の「？」が語の途中に入る件は未', 'daily-18': '同上',
  'other-02': '取引条件・支払条件・仕出港・産地・認証・期限は商品情報で直せる。カテゴリーをその場で直す欄は未',
  'auto-03': '制裁・輸出管理の対象になりうる国を選ぶと注意を出す（国の選択欄に出る国が対象。ロシアでの表示は未確認）',
  'culture-10': '営業資料の型は「玩具・文具・ホビー」になる。国ごとの進め方の文の「賞味期限」は未',
  'indagri-20': 'はじめての窓の「オレンジのバー」の文は刷新版の言い方に。Esc で閉じない件は未', 'food-15': '同上（手順の名前のゆれは未）', 'health-11': '同上（窓が2枚続く件は未）',
  'auto-01': 'HS の書き換えの前に確認を出す。建設機械と正しく分類されれば乗用車の候補は勧めない想定（要確認）', 'auto-07': '建設機械の項目（稼働時間・機番・質量・排出ガス・整備の状態）を足し、部品向けの項目は出さない。ヒアリングの例文は未', 'indagri-13': '農業資材の項目（登録・SDS・使い方）を足した', 'daily-16': '生活用品の項目（素材・OEM/名入れ・試験成績）を足した',
  'medical-11': '商品情報の表示名は「期限・保証（賞味期限／使用期限／保証期間）」に。ヒアリングの文は未',
};
const SEV = { blocker: 0, major: 1, minor: 2, polish: 3 }, SJ = { blocker: '重大', major: '大', minor: '中', polish: '小' };
const all = [];
for (const f of fs.readdirSync(dir).filter((x) => /\.json$/.test(x))) { const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); for (const i of d.issues || []) all.push(Object.assign({ src: d.id, cat: d.category }, i)); }
const st = (i) => (F.includes(i.no) ? 'F' : P[i.no] ? 'P' : 'N');
const n = (s) => all.filter((i) => st(i) === s).length;
const esc = (s) => String(s == null ? '' : s).replace(/\|/g, '｜').replace(/\s+/g, ' ').trim();
let md = `# 課題一覧（2026-11-14 8カテゴリー×ペルソナ評価・途中経過）\n\n全 ${all.length} 件：**直した ${n('F')} 件**・一部を直した ${n('P')} 件・未対応 ${n('N')} 件（21.92 時点）。\n重さ：重大 ${all.filter((i) => i.severity === 'blocker').length}・大 ${all.filter((i) => i.severity === 'major').length}・中 ${all.filter((i) => i.severity === 'minor').length}・小 ${all.filter((i) => i.severity === 'polish').length}。\n再現手順・証拠は \`findings/<担当>.json\` の同じ番号にあります（証拠の画像のパスは評価時の作業フォルダのもの）。\n\n`;
for (const [key, title] of [['N', '未対応（次の版の候補）'], ['P', '一部を直した'], ['F', '直した（21.92）']]) {
  const L = all.filter((i) => st(i) === key).sort((a, b) => (SEV[a.severity] - SEV[b.severity]) || String(a.screen).localeCompare(String(b.screen)));
  md += `## ${title}：${L.length} 件\n\n| 番号 | 重さ | 画面 | 課題 |${key === 'P' ? ' 21.92 での対応 |' : key === 'N' ? ' 直し方の案 |' : ''}\n|---|---|---|---|${key === 'F' ? '' : '---|'}\n`;
  for (const i of L) md += `| ${i.no} | ${SJ[i.severity] || i.severity} | ${esc(i.screen).slice(0, 24)} | ${esc(i.title)} |${key === 'P' ? ' ' + esc(P[i.no]) + ' |' : key === 'N' ? ' ' + esc(i.suggestion).slice(0, 160) + ' |' : ''}\n`;
  md += '\n';
}
fs.writeFileSync(out, md);
console.log('issues', all.length, 'F', n('F'), 'P', n('P'), 'N', n('N'));
const sevN = (k, s) => all.filter((i) => st(i) === k && i.severity === s).length;
console.log('N by sev: major', sevN('N', 'major'), 'minor', sevN('N', 'minor'), 'polish', sevN('N', 'polish'), '| F major', sevN('F', 'major'), 'P major', sevN('P', 'major'));
