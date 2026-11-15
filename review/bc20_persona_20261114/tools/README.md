# 組み立てと確かめの道具

## 組み立て（21.91 → 21.92）
```bash
# 1) 層を今のアプリと同じ形（ES2020・コメントなし）にする（typescript が要る：npm i typescript）
node tools/tsx.cjs layers/logic_v2192cat.ts out/logic_v2192cat.js
node tools/tsx.cjs layers/logic_v2192per.ts out/logic_v2192per.js
# 2) 本体（21.91 の index.html）に層を足し、版・build・CSP のハッシュ・version.json を更新する。
#    刷新版（21.91 の刷新版の index.html）と同じ土台なら、刷新版の index.html と rd/ のファイルも作る
python3 tools/build.py <21.91 の index.html> <21.91 の刷新版の index.html> 21.92 <出力: 本体のフォルダ> <出力: 刷新版のフォルダ> \
  --layer out/logic_v2192cat.js out/logic_v2192per.js --rd rd/rd_v92per.css rd/rd_v92per.js
```
- 層は、本体のいちばん大きい `<script>` の末尾（`v35Restore` の手前）に足します。build の値は「前の build ＋ 層の中身」の SHA-256 の先頭12桁です。
- `layers/*.js` は、今回の組み立てに使った変換後の層です（.ts から作り直せます）。

## 操作の確かめ（Playwright・Chromium）
```bash
cd <刷新版のフォルダ> && python3 -m http.server 8811 --bind 127.0.0.1 &
(mkdir -p vendor && cd vendor && npm init -y && npm i chart.js@4.4.1)   # CDN の代わりに手元の Chart.js を渡す
BASE=http://127.0.0.1:8811/ node tools/regress.cjs food,daily,agri,culture,fwd   # 全画面を開いてページのエラーが無いこと
BASE=http://127.0.0.1:8811/ node tools/dev_cat3.cjs                              # カテゴリーの読み取り
```
- `lib.cjs`：開く・見本を開く・資料を登録する・画面を移る・文字と画像を採る。`mock.cjs`：同期サーバーの最小限の代役（認証・メール・AI の中継は再現しません）。くわしくは `LIB_README.md`。
- `fwd_fixture.json`：物流会社の画面の確かめ用（見本の荷主から出した見積依頼 5件と、見本の3社のレート）。
- `dev_*.cjs`：21.92 の直しを1件ずつ確かめたスクリプト。
- 評価に使った架空の商品資料は `files/`。
