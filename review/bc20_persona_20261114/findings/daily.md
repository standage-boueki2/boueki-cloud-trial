# 生活用品（daily）使い勝手評価：貿易クラウドAI商社マン デザイン刷新版 21.91

状態：途中（P1 の登録〜バイヤー開拓まで操作済み。P2・P3 を追加中）

## ペルソナ別の総合点
- **P1 越智 真由美**（今治コットン工房株式会社／貿易素人・はじめての輸出の担当（総務兼務）・今治タオル フェイスタオル 34×80cm（自社資料 xlsx をアップロードして登録））：**3 点** ― （記入中）
  - 5 にするには：（記入中）
- **P2 須藤 健太**（スドウ金属工業株式会社／営業（越境ECと商社経由の輸出を経験）・ステンレス真空断熱タンブラー 350ml（業種サンプル daily））：**3 点** ― （記入中）
  - 5 にするには：（記入中）
- **P3 神崎 玲子**（東和ライフスタイル商事株式会社／雑貨・アパレル専門商社の課長（貿易実務 12 年）・セルビッジデニム 5Pジーンズ 14.8oz（業種サンプル apparel）＋完成形の見本 food）：**3 点** ― （記入中）
  - 5 にするには：（記入中）

## 点数表（画面 × ペルソナ）
| 画面 | キー | P1 | P2 | P3 | 深く操作 | 5 にするには |
|---|---|---|---|---|---|---|

平均：P1 -／P2 -／P3 -（0 画面・機能）

## 課題（重い順・23 件）
件数：blocker 0／major 5／minor 11／polish 7

### major
- **daily-01**［up／ux／P1・P2］「AIの質問に答える」を押しても画面が動かず、質問の入力欄が約1,900px 下（画面の外）に出る
  - 手順：商品情報を登録（up）で資料を登録 → 画面上の右の橙色「AIの質問に答える」を押す
  - 期待：質問と入力欄が見える位置に出る（その場に開く／そこまで自動で移動する）
  - 実際：押した後もスクロール位置は 0 のまま。入力欄（#fans）は画面上端から 1,899〜1,948px の位置（表示の高さ 900px）で、見えている範囲はほぼ変わらない。入力欄にフォーカスも入らない
  - 証拠：測定：押した 3.8 秒後 {"y":0,"vh":900,"fansTop":1899,"fansVisible":false,"active":"BODY"}／画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_11_fill.png
  - 直し方の案：押したら入力欄まで自動で移動してフォーカスを入れる（または右の「AIヒアリング」欄の中でそのまま答えられるようにする）
- **daily-02**［up／bug／P1・P2・P3］AIヒアリングに1問答えるたびに画面が上へ戻り、次の質問と入力欄が画面の外になる
  - 手順：up の「AI商社マンと埋める」の入力欄まで下がる → 選択肢「FOB」を押す（または入力して Enter／送信）
  - 期待：答えた後も会話の最新の位置（次の質問と入力欄）が見えている
  - 実際：答えるたびにスクロール位置が 554〜556px に戻り、次の質問の入力欄は画面上端から 1,346〜1,464px（表示の高さ 900px）。5問とも毎回下へスクロールし直した
  - 証拠：測定：答える前 {"y":1369,"fansTop":577,"fansVisible":true} → 「FOB」を押した後 {"y":554,"fansTop":1358,"fansVisible":false}／Enter 送信後 {"y":556,"fansTop":1464,"fansVisible":false}／画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_12_chat2.png
  - 直し方の案：回答後の再描画でスクロール位置を保ち、最新の質問が見えるようにする
- **daily-03**［ops:reg／data／P1・P2・P3］タオル（HS 6302.60）のアメリカ向けに「FDA食品接触材規制の確認（飲食器の場合）」が必須の手続きとして出て、「まだ輸出できるとは言えません」と表示される
  - 手順：タオルを登録 → 規制を調べる（ops:reg）→「送り先の国」でアメリカを選ぶ
  - 期待：繊維製品に合った内容（繊維の組成・原産国などの表示）。当てはまらない規制は必須に数えない
  - 実際：「□ FDA食品接触材規制の確認（飲食器の場合） 販売前の登録・届出 未対応」「⚠ まだ「このまま輸出できる」とは言えません／未対応 1件／全1件」「気をつけること　飲食に使う器物はFDAの食品接触材規制の対象になり得ます。溶出試験の成績書を用意しておくと通関・商談が速くなります。」と表示。繊維製品の表示に関する項目は無い。フランス・シンガポール・香港は「この表で分かる必須の手続きはありません。」（台湾だけ「繁体字表示」が出る）
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_27_reg_us_fda.png／上の引用は ops:reg の本文
  - 直し方の案：日用雑貨の規制のひな形を HS の類（63類＝繊維製品／73・96類＝金属の飲食器 など）で分ける。当てはまるか分からない項目は「必須・未対応」に数えず「該当するか確認」として別に出す。繊維製品には組成表示（EU は現地語）・原産国表示を入れる
- **daily-04**［item・deck／data／P1・P2・P3］資料の「成分・材質｜綿100%（超長綿）」が、材質・素材表で「項目=綿100%（超長綿）／内容=—／備考=食品接触：要確認」と入り、営業資料の仕様ページが作られない
  - 手順：タオルの資料（シート「成分・材質」：項目｜内容＝成分・材質｜綿100%（超長綿））を登録 → 商品情報（item）の「③ 材質・素材表」を見る → 外国語 営業資料（deck）で English の下書きを作り「開く」
  - 期待：項目=成分・材質／内容=綿100%（超長綿）。タオルに「食品接触」は出ない。営業資料に仕様のページができる
  - 実際：item：「綿100%（超長綿）　—　食品接触：要確認」。deck の入力状況は「成分・原材料・仕様（表） 入力済み」なのに、作った後の点検は「送れない　成分・仕様のページがありません（成分表・規格の登録が必要）」「確認　値が入っていない行は資料に載せていません（綿100%（超長綿））。」
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_17_item_3.png（材質・素材表）／/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_30_open.png（営業資料の点検）
  - 直し方の案：2列（項目｜内容）の表は「項目名＝1列目・値＝2列目」として取り込む。「食品接触：要確認」の備考は飲食器など該当する品目だけに付ける。deck の「入力済み」の判定は、実際にページを作れる条件と合わせる
- **daily-05**［ops:reg／ux／P1・P2・P3］「社内規制DBの関連レポートを見る」は standage.co.jp の Google アカウントが必要で、荷主は中を見られない
  - 手順：規制を調べる（ops:reg）→「社内規制DBの関連レポートを見る」を押す
  - 期待：荷主が読めるレポートが開く。読めないなら、荷主にはボタンを出さず「STANDAGE の担当に依頼する」導線にする
  - 実際：「現行の輸出規制調査DB（社内ポータル）に接続します。…standage.co.jp のGoogleアカウントでのサインインが必要です」と出る。画面には「上の表は概算。詳細はAI調査と社内規制DBのレポートで確認できます。」と案内がある
  - 証拠：窓の文言：「🌐 STANDAGE 規制データベース　現行の輸出規制調査DB（社内ポータル）に接続します。国・商材ごとの調査レポート本文はこちらで確認できます。standage.co.jp のGoogleアカウントでのサインインが必要です（初回はログイン画面が表示されます）。」
  - 直し方の案：荷主の画面では「STANDAGE に調査レポートを依頼する」に置き換える（社内ポータルへの入口は管理者・STANDAGE の立場だけに出す）

### minor
- **daily-06**［up／data／P1・P2］資料に書いてある「商品の強み1〜3」「FOB 神戸」が読み取られず、AIヒアリングで聞き直される（規格の欄には梱包の内容が入る）
  - 手順：「商品情報_生活用品_daily_towel.xlsx」（商品の強み1〜3 の行、単価「¥980／枚（FOB 神戸・税抜）」）をアップロード →「すべて登録する（1）」
  - 期待：強み3件・取引条件 FOB・仕出港 神戸が入る。規格には寸法（34×80cm・95g）が出る
  - 実際：登録後「建値 未入力」「残り 5項目（商品の強み・産地・製造国 など）」。ヒアリングで「他社と比べた強みを3つ以上教えてください」「取引条件（インコタームズ）はどれを基本にしますか？」「どの港（または空港）から積み出しますか？」と聞かれる。「規格」は登録前「IC-FT-3480」（品番）、登録後「カートン 60枚／ケース・1ケース 6.5kg」
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_08_after_reg.png／/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_15_top_after.png／AI の文言「取り込んだ項目：会社名・英文社名・商品名・英文商品名・商材カテゴリ・品番・HSコード・価格表（1行）…進出希望国（4か国）」（強みが無い）。※AI 未接続（内蔵の読み取り）での結果
  - 直し方の案：内蔵の読み取りでも「商品の強み1〜3」「強み」の行、単価の文字列の中の建値（FOB/CIF＋港名）を拾う。「規格」欄は寸法・重量を優先する
- **daily-07**［up／ux／P1］読み取り直後、同じ商品が「未反映（すべて登録する）」と「登録済みの商品（表示中）」の両方に出る
  - 手順：資料をアップロードした直後の up を下へ見る
  - 期待：登録が済んだのか、まだなのかが1つの言い方で分かる
  - 実際：上の枠に「この資料から 1 商品を読み取りました（未反映）／すべて登録する（1）／反映しない」、すぐ下に「登録済みの商品　今治タオル フェイスタオル 3…　情報 13/21・表示中」。チャットにも「反映して進める」があり、同じ役目のボタンが3か所（すべて登録する・反映して進める・AIの質問に答える）
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_07_before_reg.png
  - 直し方の案：未反映の間は「登録済みの商品」に「仮登録（読み取り結果を未反映）」と出す。主ボタンを1つにする
- **daily-08**［up／ux／P1］上の「AIヒアリング」欄の選択肢（横浜港・東京港・名古屋港・神戸港）が押せそうに見えるが、押しても何も起きない
  - 手順：ヒアリングで仕出港を「わからない（あとで）」にした後、up の上の右「AIヒアリング」欄の「神戸港」を押す
  - 期待：押すとその答えが入る（または押せない見た目にする）
  - 実際：青い札（SPAN.rd-tag）で、押しても画面も内容も変わらない
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_15_top_after.png／押す前後で本文が同じ（「Q1どの港（または空港）から積み出しますか？ 横浜港 東京港 名古屋港 神戸港」）
  - 直し方の案：札をボタンにして、押したらその答えで登録する
- **daily-09**［cty／bug／P1・P3］国の「詳細 →」を開くと、上のカードが「選択する」に戻り「選択中の販売先国 0/3　まだ選んでいません」と出る（実際は選ばれたまま）。画面は一番上に戻り、詳細は下に出る
  - 手順：販売先国の選定（cty）で「AI商社マンにおまかせ」後（3か国が選択中）→ 表のフランスの「詳細 →」を押す
  - 期待：選択中の3か国の表示は変わらない。詳細の見出しが見える位置に出る
  - 実際：詳細を開いている間、上のカード3枚が「＋ 選択する」、右の集計が「選択中の販売先国 0／3か国　まだ選んでいません（カードの「選択する」で1〜3か国）　国を選ぶと確定できます」になる。「← 一覧へ戻る」を押すと「3／3か国・この3か国で確定する」に戻る
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_22_detail_top.png／測定：開いた直後「cards: 3 selected」→ 詳細を開いた後「0 selected, 3 not」→ 一覧へ戻った後「3 selected」
  - 直し方の案：詳細の表示中も選択の状態を保って表示する。詳細は見出しの位置まで移動して開く
- **daily-10**［cty・db／data／P2・P3］STANDAGE 拠点の状態が画面で食い違う（国選定は「開設予定（香港・2027年度）」、バイヤー開拓は香港・シンガポール・フランスを開設済みのように表示）
  - 手順：cty の分析結果の「拠点」の説明と、AIバイヤー開拓（db）の「現地のSTANDAGEネットワーク」を見比べる
  - 期待：同じ拠点は同じ状態で表示される
  - 実際：cty：「STANDAGE拠点は開設予定（香港・2027年度）」「開設予定（シンガポール・2027年度）」「開設予定（フランス・2028〜29年度）」（拠点の点 60・60・45）。db：拠点の一覧が「香港／シンガポール／アメリカ／UAE／台湾／フランス／ベトナム／タイ／マレーシア（開設準備中）／イギリス（開設準備中）…」で、香港などには「開設準備中」が付かず、「陳 美玲（Chan Mei-ling）　拠点長」「この拠点に依頼する」が出る（「メンバー情報はトライアル用の見本表示です」の注記あり）
  - 証拠：本文の引用（/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/../txt/p1_cty_after.txt・/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/../txt/p1_db.txt）
  - 直し方の案：拠点の状態（開設済み／開設予定の年度）を1つの元データから両方の画面に出す
- **daily-11**［deck／ux／P1・P2］言語ボタンで営業資料を作った後、結果（点検・ダウンロード）が見えない位置のままになる
  - 手順：外国語 営業資料（deck）→「下書き（空欄つき）を作る」→「🇺🇸 English」を押す
  - 期待：作った資料の点検結果（未翻訳の下書き…）が見える位置に出る
  - 実際：作成後のスクロール位置は 2,902px で、見えているのは「ロゴ・商品写真」「見せ方（デザイン）」の欄。結果は「保存した営業資料」の「開く」を押すと表示される
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_29_after_english.png（作成直後）／/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_30_open.png（「開く」の後）
  - 直し方の案：作成が終わったら結果の枠まで移動する
- **daily-12**［deck／data／P2・P3］営業資料の枚数が同じ画面で食い違う（題と一覧は「10枚」、点検は「ページ数が 8枚と少なめです」）
  - 手順：deck で English の下書きを作り、「保存した営業資料」の「開く」を押す
  - 期待：枚数は1つの数え方で出る
  - 実際：題「未翻訳の下書き（English・10枚）」・一覧「10枚」。同じ枠の点検は「提案　ページ数が 8枚と少なめです（沿革・実績・差別化・顧客像などを登録すると充実します）」
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_30_open.png／本文（/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/../txt/p1_deck_after.txt）
  - 直し方の案：点検の枚数は実際に作った枚数（表紙・奥付を含むか）とそろえ、数え方を書く
- **daily-13**［deck・cty・up／layout／P1・P2・P3］右下の「AI商社マンに聞く」が、主ボタンや表の数字に重なる
  - 手順：1440×900 で deck を開く（一番上のまま）／cty の分析結果／up の読み取り直後
  - 期待：主ボタン・数字が隠れない
  - 実際：deck：主ボタン「下書き（空欄つき）を作る →」の文字に重なる。cty：右の表の香港の行（総合スコア・順位）に重なる。up：読み取り直後、資料名の札に重なる
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_28_deck_1.png／/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_20_cty_after_1.png／/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_05_upl_10s.png
  - 直し方の案：本文の右下に余白を取る（主ボタンの列は FAB の幅ぶん避ける）か、スクロール中は丸いアイコンだけに縮める
- **daily-14**［db／data／P1・P2］AIバイヤー開拓の「貴社の準備」で、登録済みの FOB 価格が未準備（・）のまま
  - 手順：タオルに価格表「300枚〜 ¥980／枚（FOB 神戸・税抜）」・取引条件 FOB を登録 → db で「AI商社マンにリストを作らせる」
  - 期待：「FOB 価格」に ✓ が付く
  - 実際：「貴社の準備 13／25点　✓ 規制調査　・ 外国語営業資料　・ FOB 価格　✓ MOQ　準備がそろうほど…：外国語営業資料 → FOB 価格 →」。商品情報（item）では「価格に含むもの（物流費）　輸出港まで含む（FOB 相当…）　取引条件「FOB」から」と出ている
  - 証拠：本文の引用（/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/../txt/p1_db_list.txt・/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/../txt/p1_item.txt）
  - 直し方の案：価格表の文字列（¥980／枚 など）と取引条件から FOB 価格の有無を判定する。数値として読めないときは「価格表を数値で入れてください」と理由を出す
- **daily-15**［item／data／P2・P3］「AI が埋めた欄」の根拠が別の行を指す（成分・材質表の根拠が「賞味期限・使用期限：—」）
  - 手順：商品情報（item）の「AIはこの資料をこう理解しました」→「AI が埋めた欄」を見る
  - 期待：成分・材質表の根拠は資料の「成分・材質：綿100%（超長綿）」
  - 実際：「成分・材質表　1行　自動・原文と一致　資料の表のラベルから読み取りました　資料「商品情報_生活用品_daily_towel.xlsx」：賞味期限・使用期限：—」
  - 証拠：本文の引用（/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/../txt/p1_item.txt）
  - 直し方の案：根拠として出す原文の行を、取り込んだ欄と対応づける
- **daily-16**［item・up／missing／P2・P3］「④ 業種ごとの項目」に生活用品の項目が無い（中古品・卸・量販の3つだけ）
  - 手順：商品情報（item）→「④ 業種ごとの項目」→「項目を編集」
  - 期待：生活用品らしい項目（素材・組成表示、洗濯表示、色・サイズ展開、名入れ／OEM の可否と最小数、安全規格・試験成績 など）を入れられる
  - 実際：選べるのは「中古品として扱う／卸の項目（製造元・仕入）／量販の項目（ケース・パレット・JAN）」の3つ。資料の強み「名入れ刺繍 100枚から対応」は強みの文としてだけ残る
  - 証拠：窓の文言：「✎ ④ 業種ごとの項目を編集　…　中古品として扱う　卸の項目（製造元・仕入）　量販の項目（ケース・パレット・JAN）　保存して反映」
  - 直し方の案：日用雑貨・繊維向けの項目（組成・表示・OEM/名入れの最小数・カラー展開・試験成績）を足す

### polish
- **daily-17**［up・deck・ops:reg／copy／P1・P2］例文・助言が商品に合わない（タオルに「保温6時間・保冷12時間／食洗機対応」「添加物や残留基準」「HACCP」「COLA の承認番号」）
  - 手順：タオルを登録して、up のヒアリング／deck の「見せ方」「ポイント」／ops:reg の「対応済みにする」を開く
  - 期待：商品（繊維の日用品）に合う例
  - 実際：up：「商品の強みを教えてください。…例：保温6時間・保冷12時間／食洗機対応／国内工場で一貫生産」。deck：「相手の国：フランス（欧州）→ 欧州に無い物であること・添加物や残留基準・表示への対応…」「認証・規格（ISO・HACCP など）があると…」。ops:reg の根拠入力：「例：輸入者の担当に確認。COLA の承認番号を受け取った」
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_27_reg_us_fda.png（COLA）／/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_28_deck_1.png（HACCP）／本文（/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/../txt/p1_deck.txt）
  - 直し方の案：例文を HS の類・商品名から選ぶ（繊維：吸水性・洗濯耐久・OEKO-TEX など）。国の説明は食品向けの語を品目で出し分ける
- **daily-18**［共通（up・ops:reg ほか）／layout／P1・P2・P3］説明の「？」が2つ並ぶ（「？説明 ？説明」／用語の「？」が二重）。語の途中にも入る（「関税？率」）
  - 手順：up を開く（登録メニューを閉じた後の帯）／ops:reg の「販売先国（確定）」の帯／up の AIヒアリングの「FOB」「通関」
  - 期待：「？」は1つ。語の後ろに付く
  - 実際：「🏢 新しい会社の商品を登録 ？説明 ？説明」「🌏 販売先国（確定）：フランス・シンガポール・香港（3か国）？説明 ？説明」。AIヒアリングの「FOB」「通関」に「？」が2つ。規制の画面で「関税？率」「通関？にかかる日数」
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_09_enter.png／/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_24_reg_1.png／/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_06_load.png／/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_01_first.png
  - 直し方の案：用語の印を付ける処理が2回走っても二重に付かないようにする。複合語（関税率）は語の後ろに付ける
- **daily-19**［up／layout／P1］上の「AIヒアリング」欄の質問文が途中で切れる／同じ文が2回出る
  - 手順：up の右上「AIヒアリング」の Q1 を読む／ヒアリングの支払条件の質問を読む
  - 期待：文末まで読める（または「…」で省略と分かる）。同じ文は1回
  - 実際：「Q1 バイヤーに出す輸出用の価格（FOB など）を教えてください。数量帯ごとにあると、AIが「その数量」で終わる。「Q1 他社と比べた強みを…AIはここを引用して商談の」で終わる。支払条件は「支払条件を教えてください。　支払条件を教えてください。」と2回
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_05_upl_10s.png／/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_08_after_reg.png／本文の引用
  - 直し方の案：3行で切るなら「…」を付ける。題と本文が同じ質問は本文を出さない
- **daily-20**［cty／layout／P1・P2・P3］レーダーチャートの軸の名前（規制・競合）が図形に重なる
  - 手順：cty で「AI商社マンにおまかせ」後、右上の「主要指標の比較」を見る
  - 期待：軸の名前が図形の外に出る
  - 実際：「規制」「競合」の文字に図形の線・塗りが重なる
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_20_cty_after_1.png
  - 直し方の案：軸ラベルの余白を広げる
- **daily-21**［cty／ux／P1］はじめて開いたとき、「開拓しない国（会社の方針）」の入力フォームが開いた状態で主な作業より上にある／「AI商社マンにおまかせ」が上下に2つ
  - 手順：商品登録の直後に cty を開く
  - 期待：はじめての人には「おまかせ」→ 結果 → 確定 が先に見える
  - 実際：上から「AIが有望な販売先国を提案します＋おまかせ（1クリック）」「使い方を見る＋おまかせ（1クリック）」「開拓しない国（会社の方針）…＋ 開拓しない国を登録する（国・理由・メモの入力欄が開いている）」の順
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_19_cty_1.png
  - 直し方の案：「開拓しない国」は閉じた状態で下へ。おまかせのボタンは1つ
- **daily-22**［ops:reg・db／copy／P1・P2］メニュー・パンくずの名前と画面の題が違う（「規制を調べる」→「規制・必要な書類」、「AIバイヤー開拓・拠点」→「AIバイヤー開拓・商談」）
  - 手順：ops:reg・db を開いて、パンくずと題を見比べる
  - 期待：同じ名前
  - 実際：ops:reg：パンくず「規制を調べる」／題「規制・必要な書類」。db：パンくず「AIバイヤー開拓・拠点」／題「AIバイヤー開拓・商談」
  - 証拠：画像 /tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/p1_24_reg_1.png／本文（/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/../txt/p1_db.txt の先頭）
  - 直し方の案：題をメニューの名前にそろえる
- **daily-23**［ops:reg・db／data／P2・P3］見本の内容が商品に合わない（案件番号「IC-FT--2608-01」、見本バイヤーの社名が食品系）
  - 手順：ops:reg の「出荷の進み具合」／db で作った見本のリストを見る
  - 期待：番号の形が整っている。見本の社名が日用雑貨らしい
  - 実際：見本の案件番号「IC-FT--2608-01」（ハイフンが2つ・年月が 2608）。見本のリスト「[見本] Harbor Fine Foods Trading」「[見本] Pacific Gourmet Importers」（説明は「日本の日用雑貨を扱う想定の会社」）
  - 証拠：本文の引用（/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/../txt/p1_reg.txt・/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad/agents/daily/img/../txt/p1_db_list.txt）
  - 直し方の案：品番から番号を作るとき末尾の記号を落とす。見本の社名を業種ごとに用意する

## 良かった点（残すべきもの）
- はじめての窓（3つのステップ → 登録メニュー → 資料をアップロード）が短く、資料1つで会社名・商品名・HSコード・MOQ・リードタイムまで入る
- AIヒアリングの質問が素人向け（FOB／CIF／DDP／EXW を「誰がどこまで負担するか」で説明、後払いの危険の注意、「わからない（あとで）」で止まらない、何に使うかを毎回示す）
- 価格の有効期限を聞き、「2027-03-31 まで（あと 137日）・期限の14日前にお知らせ」と出る
- 各画面の右上の「次は ○○」で、商品登録 → 国選定 → 規制 → 営業資料 → バイヤー開拓 と迷わず進めた
- 国選定の「おまかせ（1クリック）」：配点（市場性35・規制25・競合20・拠点20）と根拠（通関統計 HS 630260・2025年）を明記、確定すると何が変わるかを事前に説明
- 規制の「対応済みにする」で根拠（メモ・書類番号・URL）を残せる／進出希望国に無い国を選ぶと「この国は進出希望国に入っていません」と足す導線が出る
- 営業資料の点検（送れない・確認・提案の3段階、「その欄へ」）と、未入力の項目を【未入力】で示した下書きを作れること
- AI 未接続・見本（架空）であることを毎回はっきり書いている（見本のバイヤーには「実在しない相手なので、見積書は送らないでください」）

## 確かめられなかったこと
- 「はじめまして」の窓が、商品登録後も入り直すたびに出た（評価用の入り方では、最初の判定に使う会社コードが後で置き換わるため）。本番のログインでも起きるかは未確認
- 米国の関税「通常の関税 3.4%＋追加関税 9.1%（通商法301条・2026年7月24日から）」が HS 6302.60（綿のタオル）の率として正しいかは、外部に確かめられず未確認
- AI の答え・翻訳・Web 調査・実送信・招待メールは、この環境では未接続のため未確認
