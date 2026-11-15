(function () {
    const W = window;
    if (W.__v2192cat)
        return;
    W.__v2192cat = 1;
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const V92_GROUPS = [
        { k: "food", ja: "食品", en: "Food", zh: "食品", es: "Alimentos", ic: "🍱", hint: "加工食品・茶・調味料・菓子・酒類", cats: ["食品", "酒類"], smp: ["food", "s2:liquor"] },
        { k: "living", ja: "生活用品", en: "Daily goods", zh: "生活用品", es: "Artículos del hogar", ic: "🧺", hint: "日用雑貨・キッチン・アパレル・家具", cats: ["日用雑貨", "アパレル", "家具"], smp: ["s2:daily", "s2:apparel"] },
        { k: "industry", ja: "工業・農業", en: "Industry & agriculture", zh: "工业・农业", es: "Industria y agricultura", ic: "⚙️", hint: "部品・機械・素材・肥料・農業資材", cats: ["工業部品", "農業資材"], smp: ["parts", "s2:agri"] },
        { k: "beauty", ja: "健康・美容", en: "Health & beauty", zh: "健康・美容", es: "Salud y belleza", ic: "🧴", hint: "化粧品・スキンケア・健康食品・サプリ", cats: ["化粧品", "健康食品"], smp: ["cosme", "s2:supp"] },
        { k: "medical", ja: "医療・衛生", en: "Medical & hygiene", zh: "医疗・卫生", es: "Médico e higiene", ic: "🩹", hint: "衛生材料・マスク・医療機器・医薬品", cats: ["医療・衛生用品", "医療機器", "医薬品"], smp: ["s2:medical"] },
        { k: "auto", ja: "自動車・建機", en: "Vehicles & machinery", zh: "汽车・工程机械", es: "Vehículos y maquinaria", ic: "🚜", hint: "中古車・自動車部品・建設機械・重機", cats: ["中古車", "建設機械"], smp: ["s2:car", "s2:machine"] },
        { k: "culture", ja: "文化・教育", en: "Culture & education", zh: "文化・教育", es: "Cultura y educación", ic: "🖌", hint: "書道・画材・楽器・玩具・教材・伝統工芸", cats: ["文化・教育用品"], smp: ["s2:culture"] },
        { k: "other", ja: "その他", en: "Other", zh: "其他", es: "Otros", ic: "📦", hint: "ペット用品・中古品・上のどれにも入らないもの", cats: ["ペット用品", "中古品", "その他"], smp: ["s2:pet"] }
    ];
    W.V92_GROUPS = V92_GROUPS;
    const V92_NEWCATS = ["農業資材", "健康食品", "建設機械", "文化・教育用品", "ペット用品"];
    const V92_ORDER = V92_GROUPS.reduce((a, g) => a.concat(g.cats), []);
    W.v92catGroupOf = function (cat) { const c = String(cat || "").trim(); return V92_GROUPS.find(g => g.cats.indexOf(c) >= 0) || null; };
    try {
        if (typeof SAMPLES2 !== "undefined" && SAMPLES2 && !SAMPLES2.agri) {
            Object.assign(SAMPLES2, {
                agri: { key: "agri", cat: "農業資材", co: "グリーンアース農材株式会社", coEn: "GREEN EARTH AGRI-MATERIALS Co., Ltd.",
                    city: "北海道帯広市", item: "有機液体肥料 アミノグロウ 1L", itemEn: "Organic Liquid Fertilizer AMINOGROW 1L",
                    sku: "GE-AG1L", hs: "3101.00", file: "グリーンアース農材_輸出用商品資料.xlsx",
                    tagline: "魚由来アミノ酸・有機JAS適合資材・1,000倍に薄めて使う",
                    strengths: [["魚由来アミノ酸の発酵液(N-P-K 6-2-2)", "葉面散布と潅水の両方に使え、1,000倍希釈で経済的"],
                        ["有機JAS適合資材として登録", "有機栽培の農家・輸入者に説明しやすい"],
                        ["イチゴ・トマトの糖度向上の試験データ", "比較試験の結果を英文で提出可能"],
                        ["SDS(安全データシート)の英語版を整備", "輸入時の確認と、現地の肥料登録の申請に使える"],
                        ["重金属(カドミウム・ヒ素・鉛)不検出の分析成績書", "各国の肥料の規格の確認に提出可能"]],
                    priceCols: ["数量帯", "単価(FOB)", "備考"],
                    priceRows: [["〜1,199本", "US$8.20", "1Lボトル"], ["1,200〜5,999本", "US$7.40", "現地語ラベル対応"], ["6,000本〜", "US$6.60", "20L業務用も可"]],
                    dimCols: ["項目", "寸法", "重量"],
                    dimRows: [["単品(1Lボトル)", "90×90×230mm", "1.25kg"], ["外装カートン(12入)", "390×300×260mm", "15.6kg"], ["パレット", "外装40ケース", "約640kg"]],
                    compTitle: "成分・規格表", compCols: ["項目", "内容", "備考"],
                    compRows: [["窒素全量(N)", "6.0%", ""], ["りん酸全量(P)", "2.0%", ""], ["加里全量(K)", "2.0%", ""],
                        ["原料", "魚由来アミノ酸発酵液", "動物由来(魚)"], ["pH", "4.5", ""],
                        ["重金属", "カドミウム・ヒ素・鉛 不検出", "分析成績書あり"], ["使用期限", "製造から36ヶ月", "直射日光を避けて保管"]],
                    moq: "600本", lead: "受注後21日", ctn: "外装12本入／パレット40ケース", cert: "有機JAS適合資材・SDSあり",
                    shelf: "製造から36ヶ月", term: "FOB", pay: "T/T 30日", pol: "苫小牧港",
                    targets: ["ベトナム", "タイ", "台湾", "マレーシア"] },
                supp: { key: "supp", cat: "健康食品", co: "株式会社ウェルネスラボ京都", coEn: "WELLNESS LAB KYOTO Inc.",
                    city: "京都府京都市", item: "乳酸菌サプリメント 京の菌活 60粒", itemEn: "Lactic Acid Bacteria Supplement KYO-NO-KINKATSU 60 tablets",
                    sku: "WL-KK60", hs: "2106.90", file: "ウェルネスラボ京都_輸出用商品資料.xlsx",
                    tagline: "植物性乳酸菌 1粒100億個・GMP認定工場・常温24ヶ月",
                    strengths: [["京都の漬物由来の植物性乳酸菌を1粒に100億個", "由来と菌数を数字で説明できる"],
                        ["GMP認定工場で製造", "輸入者・薬局チェーンの監査で求められる製造管理を証明できる"],
                        ["殺菌乳酸菌で常温流通・賞味期限24ヶ月", "冷蔵が要らず、船便で運べる"],
                        ["国内EC 累計25万個の販売実績", "レビューと再購入率のデータを提示できる"],
                        ["全原材料・栄養成分の英文規格書を整備", "各国の健康食品・サプリメントの届出の確認に使える"]],
                    priceCols: ["数量帯", "単価(FOB)", "備考"],
                    priceRows: [["〜999個", "US$12.50", ""], ["1,000〜4,999個", "US$11.20", "現地語ラベル対応"], ["5,000個〜", "US$9.90", "OEM対応"]],
                    dimCols: ["項目", "寸法", "重量"],
                    dimRows: [["単品(ボトル)", "60×60×110mm", "85g"], ["外装カートン(48入)", "400×270×250mm", "4.6kg"], ["パレット", "外装60ケース", ""]],
                    compTitle: "原材料・栄養成分表", compCols: ["項目", "内容", "備考"],
                    compRows: [["植物性乳酸菌(殺菌)", "1粒あたり100億個", "漬物由来"], ["難消化性デキストリン", "食物繊維", ""],
                        ["ビタミンB群", "B1・B2・B6", ""], ["形状", "タブレット 250mg×60粒", "1日2粒が目安"],
                        ["アレルゲン", "特定原材料 不使用", ""], ["製造", "GMP認定工場", "証明書提出可"], ["賞味期限", "製造から24ヶ月", "常温"]],
                    moq: "500個", lead: "受注後45日", ctn: "外装48個入／パレット60ケース", cert: "GMP(健康補助食品)",
                    shelf: "製造から24ヶ月", term: "FOB", pay: "T/T 30日", pol: "大阪港",
                    targets: ["台湾", "香港", "ベトナム", "アメリカ"] },
                machine: { key: "machine", cat: "建設機械", co: "北関東マシナリー株式会社", coEn: "KITA-KANTO MACHINERY Co., Ltd.",
                    city: "栃木県宇都宮市", item: "中古油圧ショベル 0.45m³クラス(2017年式)", itemEn: "Used Hydraulic Excavator 0.45m3 class (2017)",
                    sku: "KM-EX17", hs: "8429.52", file: "北関東マシナリー_在庫機械リスト.xlsx",
                    tagline: "自社ヤードで点検・整備済み・稼働時間の記録つき",
                    strengths: [["自社ヤードで点検・整備・洗浄してから出荷", "点検記録(写真つき)を1台ごとに英文で提出可能"],
                        ["稼働時間・製造年を確かめられる機械のみ", "アワーメーターと製造銘板の写真・点検記録で確認できる"],
                        ["RORO船・フラットラックコンテナの両対応", "仕向地の港と機械の寸法に合わせて選べる"],
                        ["船積前の洗浄(土・植物の付着なし)に対応", "輸入国の検疫・船積前検査の求めに合わせて実施"],
                        ["東南アジア・中東・アフリカ向け 年間120台の輸出実績", "国ごとの年式・排出ガスの決まりの確認に慣れている"]],
                    priceCols: ["稼働時間帯", "単価(FOB)", "備考"],
                    priceRows: [["〜2,999時間", "US$46,000", "足回り80%以上"], ["3,000〜5,999時間", "US$38,000", "足回り70%"], ["6,000〜8,999時間", "US$29,500", "現状渡し"]],
                    dimCols: ["項目", "数値", ""],
                    dimRows: [["全長×全幅×全高(輸送時)", "9,520×2,800×2,950mm", ""], ["機械質量", "12,400kg", ""], ["積載", "RORO または フラットラックコンテナ(40ft)", ""]],
                    compTitle: "機械情報表", compCols: ["項目", "内容", "備考"],
                    compRows: [["バケット容量", "0.45m³", ""], ["エンジン", "ディーゼル 72kW", "排出ガス 2014年基準適合"],
                        ["稼働時間", "4,800時間", "アワーメーターの写真あり"], ["製造年", "2017年", "製造銘板の写真あり"],
                        ["足回り", "残り70%", "点検記録あり"], ["整備", "点検・整備・洗浄済み", "点検記録つき"],
                        ["該非判定", "メーカーの該非判定書を取り寄せ可能", "輸出許可が要るかは仕向国・用途で確認"]],
                    moq: "1台", lead: "入金後10日で船積み準備", ctn: "RORO／フラットラックコンテナ(40ft)", cert: "特定自主検査済み・点検記録つき",
                    shelf: "該当なし", term: "FOB", pay: "T/T 前払100%", pol: "横浜港",
                    targets: ["フィリピン", "ベトナム", "UAE", "ケニア"] },
                culture: { key: "culture", cat: "文化・教育用品", co: "株式会社墨雅堂", coEn: "BOKUGADO Co., Ltd.",
                    city: "奈良県奈良市", item: "書道セット 入門用(英語の手引きつき)", itemEn: "Japanese Calligraphy Starter Set (with English guide)",
                    sku: "BG-SET01", hs: "9603.30", file: "墨雅堂_輸出用商品資料.xlsx",
                    tagline: "奈良筆・奈良墨の職人製・英語とフランス語の手引きつき",
                    strengths: [["奈良筆・奈良墨の職人による国産の道具", "産地と作り手を説明でき、文化教室・専門店に選ばれる"],
                        ["英語・フランス語の手引きと動画つき", "先生がいなくても始められ、学校・文化教室で使いやすい"],
                        ["教室用10セットパックあり", "日本語学校・文化センターのまとめ買いに対応"],
                        ["筆の毛は馬・羊(家畜の毛)", "素材の一覧を英文で提出でき、通関での確認が速い"],
                        ["名入れ・ロゴ入りの箱は100セットから", "ミュージアムショップ・記念品の別注に対応"]],
                    priceCols: ["数量帯", "単価(FOB)", "備考"],
                    priceRows: [["〜299セット", "US$24.00", "化粧箱入り"], ["300〜999セット", "US$21.50", "教室用パック可"], ["1,000セット〜", "US$19.00", "名入れ対応"]],
                    dimCols: ["項目", "寸法", "重量"],
                    dimRows: [["単品(化粧箱)", "300×230×45mm", "780g"], ["外装カートン(20入)", "620×480×250mm", "16.5kg"], ["パレット", "外装24ケース", ""]],
                    compTitle: "セット内容・素材表", compCols: ["品目", "素材", "備考"],
                    compRows: [["筆 2本(大・小)", "馬毛・羊毛／竹軸", "奈良筆"], ["墨", "煤・膠", "奈良墨"], ["硯", "天然石", ""],
                        ["文鎮", "鉄", ""], ["下敷き", "フェルト", ""], ["手引き", "英語・フランス語", "動画のQRコードつき"], ["箱", "紙(FSC認証)", ""]],
                    moq: "100セット", lead: "受注後25日", ctn: "外装20セット入／パレット24ケース", cert: "伝統的工芸品(奈良筆)",
                    shelf: "該当なし", term: "FOB", pay: "T/T 30日", pol: "大阪港",
                    targets: ["アメリカ", "フランス", "オーストラリア", "台湾"] },
                pet: { key: "pet", cat: "ペット用品", co: "株式会社にゃんライフ", coEn: "NYAN LIFE Inc.",
                    city: "福岡県福岡市", item: "猫用 爪とぎベッド 段ボール製 Mサイズ", itemEn: "Cat Scratcher Bed, Corrugated Cardboard, Size M",
                    sku: "NL-SBM", hs: "4823.90", file: "にゃんライフ_輸出用商品資料.xlsx",
                    tagline: "両面使えて約2倍長持ち・国産古紙90%・でんぷん糊",
                    strengths: [["両面使えて約2倍長持ち", "裏返して使える構造。買い替えの周期を数字で説明できる"],
                        ["国産古紙90%の強化段ボール・無漂白", "環境への配慮を訴求でき、FSC認証の証明を提出可能"],
                        ["接着はでんぷん糊", "材料の一覧を英文で提出可能"],
                        ["国内EC 猫用品ランキング 12ヶ月連続1位", "レビューの件数と評価を提案資料に使える"],
                        ["平たく重ねられる形で輸送の効率がよい", "外装1ケースに8個入り"]],
                    priceCols: ["数量帯", "単価(FOB)", "備考"],
                    priceRows: [["〜799個", "US$8.60", ""], ["800〜2,999個", "US$7.70", "現地語の説明書対応"], ["3,000個〜", "US$6.90", "OEM・別注の柄"]],
                    dimCols: ["項目", "寸法", "重量"],
                    dimRows: [["単品", "450×300×120mm", "620g"], ["外装カートン(8入)", "620×470×260mm", "5.6kg"], ["パレット", "外装36ケース", ""]],
                    compTitle: "材質・素材表", compCols: ["部位", "材質", "備考"],
                    compRows: [["本体", "強化段ボール(国産古紙90%)", "無漂白"], ["接着", "でんぷん糊", ""], ["印刷", "植物油インキ", ""],
                        ["付属のまたたび粉", "天然またたび 2g", "植物由来。国により持ち込みの確認が要る"], ["梱包", "紙箱(FSC認証)", ""]],
                    moq: "400個", lead: "受注後30日", ctn: "外装8個入／パレット36ケース", cert: "FSC認証(段ボール)",
                    shelf: "該当なし", term: "FOB", pay: "T/T 30日", pol: "博多港",
                    targets: ["アメリカ", "台湾", "韓国", "ドイツ"] }
            });
        }
        if (typeof CATMETA !== "undefined" && CATMETA && !CATMETA.agri) {
            Object.assign(CATMETA, {
                agri: { ic: "🌱", bg: "var(--good-soft)", cl: "var(--good)" }, supp: { ic: "💊", bg: "var(--or-soft)", cl: "var(--or-deep)" },
                machine: { ic: "🚜", bg: "var(--bl-soft)", cl: "var(--bl)" }, culture: { ic: "🖌", bg: "var(--or-soft)", cl: "var(--or-deep)" },
                pet: { ic: "🐾", bg: "var(--good-soft)", cl: "var(--good)" }
            });
        }
    }
    catch (e) {
        try {
            console.warn("v2192cat samples", e);
        }
        catch (x) { }
    }
    try {
        const reorder = (a) => {
            if (!Array.isArray(a))
                return;
            const had = a.slice();
            const out = V92_ORDER.filter(c => had.indexOf(c) >= 0 || V92_NEWCATS.indexOf(c) >= 0);
            had.forEach((c) => {
                if (out.indexOf(c) < 0)
                    out.splice(Math.max(0, out.length - 1), 0, c);
            });
            a.length = 0;
            out.forEach(c => a.push(c));
        };
        try {
            const n = (typeof NEED !== "undefined" && Array.isArray(NEED)) ? NEED.find((x) => x && x.k === "cat") : null;
            if (n)
                reorder(n.chips);
        }
        catch (e) { }
        try {
            if (typeof V54HEAR_CATS !== "undefined")
                reorder(V54HEAR_CATS);
        }
        catch (e) { }
        try {
            if (typeof V54U_CATS !== "undefined")
                reorder(V54U_CATS);
        }
        catch (e) { }
        try {
            if (typeof V68IND_CHIPS !== "undefined")
                reorder(V68IND_CHIPS);
        }
        catch (e) { }
        if (typeof V54HEAR_CAT !== "undefined" && Array.isArray(V54HEAR_CAT) && !V54HEAR_CAT.some((x) => x && x[0] === "建設機械")) {
            const add = (cat, re, ex) => { V54HEAR_CAT.push(ex ? [cat, re, ex] : [cat, re]); };
            add("建設機械", /建設機械|建機|重機|油圧ショベル|ショベルカー|パワーショベル|ユンボ|ブルドーザー?|ホイールローダー?|フォークリフト|クローラー?クレーン|ラフタークレーン|excavator|bulldozer|wheel\s*loader|forklift/i);
            add("農業資材", /農業資材|農業用資材|肥料|液肥|堆肥|培養土|土壌改良|農薬|種子|種苗|育苗|飼料|農機具?|農業機械|農具|園芸資材|fertili[sz]er|pesticide/i);
            add("健康食品", /健康食品|サプリメント|サプリ|栄養補助食品|機能性表示食品|特定保健用食品|プロテイン|青汁|supplement/i);
            add("文化・教育用品", /文化・教育|文化用品|教育用品|書道|習字|毛筆|画材|絵具|絵の具|和楽器|楽器|三味線|尺八|教材|知育|玩具|おもちゃ|パズル|ボードゲーム|カードゲーム|フィギュア|プラモデル|模型|絵本|伝統工芸|工芸品|calligraphy|\btoys?\b|puzzle/i);
            add("ペット用品", /ペット用品|ペット|犬用|猫用|爪とぎ|キャットタワー|ペットフード|キャットフード|ドッグフード|\bpet\b/i);
            const gen = (cat, add2) => {
                const m = V54HEAR_CAT.find((x) => x && x[0] === cat);
                if (m && m[1] && String(m[1].source).indexOf(add2) < 0)
                    m[1] = new RegExp(m[1].source + "|" + add2, m[1].flags);
            };
            gen("日用雑貨", "生活用品|生活雑貨");
            gen("工業部品", "工業製品");
        }
        try {
            if (typeof V68IND_LIST !== "undefined" && Array.isArray(V68IND_LIST)) {
                const put = (key, cat) => {
                    const x = V68IND_LIST.find((y) => y && y.key === key);
                    if (x && Array.isArray(x.cats) && x.cats.indexOf(cat) < 0)
                        x.cats.push(cat);
                };
                put("food", "健康食品");
                put("industrial", "建設機械");
                put("other", "農業資材");
                put("other", "文化・教育用品");
                put("other", "ペット用品");
            }
        }
        catch (e) { }
    }
    catch (e) {
        try {
            console.warn("v2192cat chips", e);
        }
        catch (x) { }
    }
    const lang = () => {
        try {
            const el = document.getElementById("lang");
            const v = String((el && el.value) || "ja");
            return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
        }
        catch (e) {
            return "ja";
        }
    };
    const gname = (g) => { const l = lang(); return (l !== "ja" && g[l]) || g.ja; };
    const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    function css() {
        if (document.getElementById("v92catcss"))
            return;
        const st = document.createElement("style");
        st.id = "v92catcss";
        st.textContent = ".v92cg{display:flex;flex-wrap:wrap;align-items:center;gap:6px;width:100%;padding:5px 0;border-top:1px dashed var(--line-2,#e6e9ee)}.v92cg:first-of-type{border-top:0}" +
            ".v92cgl{flex:0 0 9.5em;font-size:11.5px;font-weight:700;color:var(--ink-2,#44546a);white-space:nowrap}" +
            ".v92cgn{width:100%;margin:6px 0 0;font-size:11px;color:var(--ink-3,#6b7a90);line-height:1.6}" +
            "@media(max-width:560px){.v92cgl{flex-basis:100%}}" +
            ".v92sg{margin:12px 0 4px;font-size:12px;font-weight:800;color:var(--ink-2,#44546a);display:flex;align-items:center;gap:6px}.v92sg small{font-weight:500;color:var(--ink-3,#6b7a90)}" +
            ".v92sgn{margin:2px 0 0;font-size:11.5px;color:var(--ink-3,#6b7a90)}";
        (document.head || document.documentElement).appendChild(st);
    }
    function v92catChipsGroup() {
        const box = document.getElementById("fin2");
        if (!box || typeof FILL === "undefined" || !FILL || !FILL.cur || FILL.cur.k !== "cat")
            return;
        const qb = box.querySelector(".qb");
        if (!qb || qb.getAttribute("data-v92g"))
            return;
        const btns = Array.from(qb.querySelectorAll("button.q[data-chip]"));
        if (btns.filter(b => V92_ORDER.indexOf(String(b.getAttribute("data-chip"))) >= 0).length < 8)
            return;
        css();
        qb.setAttribute("data-v92g", "1");
        const frag = document.createDocumentFragment();
        btns.filter(b => V92_ORDER.indexOf(String(b.getAttribute("data-chip"))) < 0).forEach(b => frag.appendChild(b));
        V92_GROUPS.forEach(g => {
            const bs = btns.filter(b => g.cats.indexOf(String(b.getAttribute("data-chip"))) >= 0);
            if (!bs.length)
                return;
            const row = document.createElement("div");
            row.className = "v92cg";
            row.setAttribute("role", "group");
            row.setAttribute("aria-label", gname(g));
            row.setAttribute("data-noi18n", "");
            row.innerHTML = `<span class="v92cgl" title="${E(g.hint)}">${g.ic} ${E(gname(g))}</span>`;
            bs.forEach(b => row.appendChild(b));
            frag.appendChild(row);
        });
        const note = document.createElement("p");
        note.className = "v92cgn";
        note.textContent = M("当てはまるものが無いときは「その他」を選ぶか、下の欄に商材の種類をそのまま書いてください（例：釣具、楽器、園芸用品）。あとで商品情報の画面で直せます。", "If nothing fits, choose “Other” or type the kind of product below (e.g. fishing tackle, musical instruments). You can change it later in Product information.", "如果没有合适的选项，请选择“其他”，或在下面直接填写商品种类（例：渔具、乐器）。之后可以在商品信息中修改。", "Si nada encaja, elija «Otros» o escriba abajo el tipo de producto (p. ej., artículos de pesca, instrumentos). Puede cambiarlo después en Información del producto.");
        frag.appendChild(note);
        qb.insertBefore(frag, qb.firstChild);
    }
    W.v92catChipsGroup = v92catChipsGroup;
    if (typeof fillRender === "function") {
        const __fr92 = fillRender;
        fillRender = function () {
            const r = __fr92.apply(this, arguments);
            try {
                v92catChipsGroup();
            }
            catch (e) { }
            return r;
        };
    }
    if (typeof v84SmpOpen === "function") {
        const __so92 = v84SmpOpen;
        v84SmpOpen = function () {
            try {
                if (typeof openDW !== "function" || typeof SAMPLES2 === "undefined" || typeof PRODUCTS === "undefined")
                    return __so92.apply(this, arguments);
                css();
                const KD = M("完成形（2年分のデータ入り）", "Complete (2 years of data)", "完成形（含2年数据）", "Completo (2 años de datos)");
                const K1 = M("1日目の状態から", "Day-1 state", "从第1天的状态开始", "Estado del día 1");
                const row = (arg, x, kind) => `<button type="button" class="v84smp-row" data-act="sub.smpGo" data-arg="${E(arg)}"><span class="v84smp-tag">${E(M("見本", "Sample", "样例", "Muestra"))}</span><span class="v84smp-t"><b>${E(x.item)}</b><small>${E(x.co)}・${E(x.cat)}・${E(kind)}</small></span></button>`;
                const done = {};
                let h = "";
                V92_GROUPS.forEach(g => {
                    const rows = g.smp.map(a => {
                        const s2 = /^s2:/.test(a);
                        const x = s2 ? SAMPLES2[a.slice(3)] : PRODUCTS[a];
                        if (!x)
                            return "";
                        done[a] = 1;
                        return row(a, x, s2 ? K1 : KD);
                    }).join("");
                    if (rows)
                        h += `<p class="v92sg" data-noi18n>${g.ic} ${E(gname(g))} <small>${lang() === "ja" ? E(g.hint) : ""}</small></p>${rows}`;
                });
                const rest = Object.values(PRODUCTS).filter((x) => x && !done[x.key]).map((x) => row(x.key, x, KD)).join("") +
                    Object.values(SAMPLES2).filter((x) => x && !done["s2:" + x.key]).map((x) => row("s2:" + x.key, x, K1)).join("");
                if (rest)
                    h += `<p class="v92sg" data-noi18n>${E(M("そのほかの見本", "Other samples", "其他样例", "Otras muestras"))}</p>${rest}`;
                openDW(`<div class="v84smp" data-noi18n><h3>🧪 ${E(M("サンプルで試す（見本・架空のデータ）", "Try with samples (fictional data)", "用样例试用（虚构数据）", "Probar con muestras (datos ficticios)"))}</h3>
      <p class="nn">${E(M("貴社の業種に近い見本を選んでください。見本は架空の会社のデータです。貴社の商品の一覧・ダッシュボードの数・成長レベルには入りません。見本を開いている間は、上の「貴社の商品に戻る」で戻れます。", "Pick the sample closest to your business. Samples are fictional companies; they are not counted in your product list, dashboard numbers or growth level. While a sample is open, use “Back to your products” at the top to return.", "请选择与贵公司行业相近的样例。样例为虚构公司的数据，不计入贵公司的商品列表、仪表盘数字和成长等级。打开样例时，可通过上方的“返回贵公司的商品”返回。", "Elija la muestra más cercana a su sector. Las muestras son empresas ficticias y no cuentan en su lista de productos, cifras del panel ni nivel de crecimiento. Con una muestra abierta, vuelva con «Volver a sus productos» arriba."))}</p>
      <p class="v92sgn">${E(M("「完成形」は2年分の商談・書類が入った状態、「1日目の状態から」は商品を登録した直後の状態です。貴社の商品は、業種にかかわらず「商品情報を登録」から登録できます。", "“Complete” includes two years of deals and documents; “Day-1 state” is right after registering a product. You can register your own products in any category from “Register product information”.", "“完成形”包含2年的商谈和单据；“从第1天的状态开始”是刚登记商品后的状态。无论行业，贵公司的商品都可以从“登记商品信息”登记。", "«Completo» incluye dos años de negociaciones y documentos; «Estado del día 1» es justo después de registrar un producto. Puede registrar sus productos de cualquier sector en «Registrar información del producto»."))}</p>${h}</div>`);
                if (typeof dwChrome === "function")
                    dwChrome();
                return;
            }
            catch (e) {
                try {
                    console.warn("v2192cat smp", e);
                }
                catch (x) { }
            }
            return __so92.apply(this, arguments);
        };
    }
    const nrm = (v) => {
        let x = String(v == null ? "" : v);
        try {
            x = x.normalize("NFKC");
        }
        catch (e) { }
        return x.replace(/\s+/g, "").replace(/[･·•\/／]/g, "・").trim();
    };
    const GROUP_RE = [[/^(食品|食料品|飲食料品)$/, "food"], [/^(生活用品|生活雑貨)$/, "living"], [/^(工業・農業|工業農業|農業・工業)$/, "industry"],
        [/^(健康・美容|健康美容|美容・健康|美容健康)$/, "beauty"], [/^(医療・衛生|医療衛生)$/, "medical"], [/^(自動車・建機|自動車建機|建機・自動車)$/, "auto"],
        [/^(文化・教育|文化教育|教育・文化)$/, "culture"], [/^その他$/, "other"]];
    const GROUP_DEFAULT = { food: "食品", living: "日用雑貨", industry: "工業部品", beauty: "", medical: "医療・衛生用品", auto: "", culture: "文化・教育用品", other: "その他" };
    function groupOfRaw(raw) {
        const x = nrm(raw);
        if (!x)
            return null;
        const hit = GROUP_RE.find(r => r[0].test(x));
        return hit ? (V92_GROUPS.find(g => g.k === hit[1]) || null) : null;
    }
    W.v92catGroupOfRaw = groupOfRaw;
    function v92catByHS(hs, txt) {
        const d = String(hs == null ? "" : hs).replace(/\D/g, "");
        if (d.length < 4)
            return "";
        const c2 = +d.slice(0, 2), c4 = +d.slice(0, 4);
        if (c4 >= 2203 && c4 <= 2208)
            return "酒類";
        if (c4 === 2106 && /サプリ|錠|粒|カプセル|健康食品|栄養補助|supplement|tablet|capsule/i.test(txt))
            return "健康食品";
        if (c4 === 2309)
            return /ペット|犬|猫|\bpet\b|dog|cat\b/i.test(txt) ? "ペット用品" : "農業資材";
        if (c2 === 31 || c4 === 3808 || c4 === 1209 || (c4 >= 8432 && c4 <= 8436))
            return "農業資材";
        if (c2 >= 2 && c2 <= 22)
            return "食品";
        if (c4 === 3003 || c4 === 3004)
            return "医薬品";
        if (c4 === 3005 || c4 === 3006)
            return "医療・衛生用品";
        if (c4 >= 9018 && c4 <= 9022)
            return "医療機器";
        if ((c4 >= 3303 && c4 <= 3307) || c4 === 3401)
            return "化粧品";
        if (c4 >= 8426 && c4 <= 8430)
            return "建設機械";
        if ((c4 >= 8702 && c4 <= 8704) || c4 === 8711)
            return "中古車";
        if (c4 >= 6301 && c4 <= 6304)
            return "日用雑貨";
        if (c4 === 6307 && /マスク|mask|ガーゼ|gauze/i.test(txt))
            return "医療・衛生用品";
        if (c2 === 61 || c2 === 62 || c2 === 64 || c2 === 65)
            return "アパレル";
        if (c4 >= 9401 && c4 <= 9403)
            return "家具";
        if (c2 === 92 || c2 === 95 || c2 === 97 || c4 === 9603 || (c4 >= 9608 && c4 <= 9612) || (c4 >= 4901 && c4 <= 4905) || c4 === 4820)
            return "文化・教育用品";
        if (c4 === 7323 || c4 === 7615 || (c4 >= 8211 && c4 <= 8215) || c4 === 6911 || c4 === 6912 || c4 === 7013 || c4 === 9617)
            return "日用雑貨";
        if ((c2 >= 72 && c2 <= 85) || c2 === 90 || c2 === 39 || c2 === 40)
            return "工業部品";
        return "";
    }
    W.v92catByHS = v92catByHS;
    if (typeof v54hearCatOf === "function") {
        const __hc92 = v54hearCatOf;
        v54hearCatOf = function (name, strict) {
            try {
                const g = groupOfRaw(name);
                if (g) {
                    const d = GROUP_DEFAULT[g.k];
                    const x = nrm(name);
                    return d ? { cat: d, kw: x, end: x.length, i: 98, v92group: g.k } : null;
                }
                const s0 = String(name == null ? "" : name);
                const head = s0.replace(/[（(][^（）()]*[）)]/g, " ").replace(/\s*(です|でございます|になります)[。.．]?\s*$/, "").replace(/\s+/g, " ").trim();
                if (head && head !== s0.trim() && head.length >= 2) {
                    const r = __hc92.call(this, head, strict);
                    if (r)
                        return r;
                }
            }
            catch (e) { }
            return __hc92.apply(this, arguments);
        };
    }
    function v92catRefine(t) {
        if (!t)
            return "";
        const g = groupOfRaw(t.catRaw);
        if (!g)
            return "";
        const txt = [t.item, t.itemEn].filter(Boolean).join(" ");
        let c = "", why = "";
        try {
            if (txt && typeof V54HEAR_CAT !== "undefined" && Array.isArray(V54HEAR_CAT)) {
                const hits = {};
                V54HEAR_CAT.forEach((x) => {
                    if (!x || !x[1])
                        return;
                    const t2 = x[2] ? txt.replace(new RegExp(x[2].source, "g" + (x[2].flags.indexOf("i") >= 0 ? "i" : "")), " ") : txt;
                    const m = t2.match(x[1]);
                    if (m && !hits[x[0]])
                        hits[x[0]] = m[0];
                });
                const pick = g.cats.find((k) => k !== "その他" && hits[k]);
                if (pick) {
                    c = pick;
                    why = "品名「" + String(hits[pick]).slice(0, 16) + "」";
                }
            }
        }
        catch (e) { }
        if (!c) {
            const byHs = v92catByHS(t.hs, txt);
            if (byHs && g.cats.indexOf(byHs) >= 0) {
                c = byHs;
                why = "HS " + String(t.hs || "").slice(0, 7);
            }
        }
        if (!c)
            c = GROUP_DEFAULT[g.k] || "";
        const cur = String(t.cat || "").trim();
        if (c === cur)
            return c;
        if (!c) {
            if (cur && !t.v92catAsk) {
                t.cat = "";
                t.catKey = null;
            }
            t.v92catAsk = g.k;
            return "";
        }
        if (t.v92catAsk)
            return cur;
        t.cat = c;
        try {
            t.catKey = typeof catKeyOf === "function" ? catKeyOf(c) : t.catKey;
        }
        catch (e) { }
        t.v92catWhy = why;
        try {
            if (typeof v54upldCompTitle === "function" && (!t.compTitle || /^(成分表(・材質表)?|全成分表（INCI）|材質・素材表|車両情報表)$/.test(String(t.compTitle)))) {
                const ct = c === "健康食品" ? "原材料・栄養成分表" : c === "建設機械" ? "機械情報表" : c === "農業資材" ? "成分・規格表" : (c === "文化・教育用品" || c === "ペット用品") ? "材質・素材表" : v54upldCompTitle(t.catKey);
                if (ct)
                    t.compTitle = ct;
            }
        }
        catch (e) { }
        return c;
    }
    W.v92catRefine = v92catRefine;
    function v92catFromDoc(t) {
        if (!t || t.src !== "upload" || t.v92catDoc)
            return;
        t.v92catDoc = 1;
        let raw = String(t.catRaw || "").trim();
        if (!raw) {
            const txt = (Array.isArray(t.sources) ? t.sources : []).map((x) => String((x && x.txt) || "")).join("\n").slice(0, 24000);
            const m = txt.match(/(?:^|\n)\s*(?:商材カテゴリ[ーｰ]?|商品カテゴリ[ーｰ]?|カテゴリ[ーｰ]?|商品分類|商材区分|業種)\s*[|｜:：\t]\s*([^\n|｜]{1,40})/);
            if (m)
                raw = m[1].trim();
        }
        if (!raw || !groupOfRaw(raw))
            return;
        t.catRaw = raw.slice(0, 40);
        v92catRefine(t);
    }
    W.v92catFromDoc = v92catFromDoc;
    function v92catCompTitle(t) {
        if (!t || t.src !== "upload")
            return;
        const c = String(t.cat || "").trim();
        const want = c === "健康食品" ? "原材料・栄養成分表" : c === "建設機械" ? "機械情報表" : c === "農業資材" ? "成分・規格表" : (c === "文化・教育用品" || c === "ペット用品") ? "材質・素材表" : "";
        if (want && (!t.compTitle || /^(成分表(・材質表)?|全成分表（INCI）|車両情報表)$/.test(String(t.compTitle))))
            t.compTitle = want;
    }
    W.v92catCompTitle = v92catCompTitle;
    if (typeof runParseReal === "function") {
        const __rp92 = runParseReal;
        runParseReal = function (t) {
            try {
                v92catFromDoc(t);
                v92catCompTitle(t);
            }
            catch (e) { }
            return __rp92.apply(this, arguments);
        };
    }
    if (typeof v54upldApply === "function") {
        const __ua92 = v54upldApply;
        v54upldApply = function (t) {
            const r = __ua92.apply(this, arguments);
            try {
                v92catRefine(t);
            }
            catch (e) { }
            return r;
        };
    }
    if (typeof v41MyCat === "function") {
        const __mc92 = v41MyCat;
        v41MyCat = function () {
            try {
                const c = String((typeof D !== "undefined" && D && D.cat) || (typeof TEN !== "undefined" && TEN && TEN.cat) || "").trim();
                const m = { "文化・教育用品": "other", "ペット用品": "other", "農業資材": "other", "建設機械": "car" };
                if (m[c])
                    return m[c];
            }
            catch (e) { }
            return __mc92.apply(this, arguments);
        };
    }
    try {
        if (typeof V85DK !== "undefined" && V85DK && typeof V85DK.cat === "function" && typeof V85DK_CATS !== "undefined") {
            const __dc92 = V85DK.cat;
            V85DK.cat = function (T) {
                const r = __dc92.apply(this, arguments);
                try {
                    const t = T || (typeof TEN !== "undefined" ? TEN : null);
                    if (r && r.src !== "manual" && t) {
                        const c = String(t.cat || "").trim();
                        const txt = [t.item, t.itemEn, t.cert].filter(Boolean).join(" ");
                        if ((c === "医療・衛生用品" || c === "医療機器") && (r.k === "apparel" || r.k === "household" || r.k === "food") && V85DK_CATS.medical)
                            return { k: "medical", why: "区分「" + c + "」", src: "cat" };
                        const k = c === "文化・教育用品" ? (/伝統工芸|工芸|漆|陶|磁器|織|染|craft/i.test(txt) && !/書道|筆|墨|文具|玩具|教材|楽器/.test(txt) ? "craft_interior" : "toy_stationery")
                            : c === "ペット用品" ? "pet" : c === "農業資材" ? "feed_agri" : c === "健康食品" ? "supplement" : c === "建設機械" ? "industrial" : "";
                        if (k && V85DK_CATS[k] && r.k !== k)
                            return { k, why: "区分「" + c + "」", src: "cat" };
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { }
    try {
        if (typeof I18N !== "undefined" && I18N && I18N.dict) {
            const rows = [
                ["農業資材", "Agricultural inputs", "农业资材", "Insumos agrícolas"], ["健康食品", "Health foods & supplements", "保健食品", "Alimentos saludables y suplementos"],
                ["建設機械", "Construction machinery", "工程机械", "Maquinaria de construcción"], ["文化・教育用品", "Culture & education goods", "文化・教育用品", "Artículos culturales y educativos"],
                ["ペット用品", "Pet supplies", "宠物用品", "Productos para mascotas"],
                ["生活用品", "Daily goods", "生活用品", "Artículos del hogar"], ["工業・農業", "Industry & agriculture", "工业・农业", "Industria y agricultura"],
                ["健康・美容", "Health & beauty", "健康・美容", "Salud y belleza"], ["医療・衛生", "Medical & hygiene", "医疗・卫生", "Médico e higiene"],
                ["自動車・建機", "Vehicles & machinery", "汽车・工程机械", "Vehículos y maquinaria"], ["文化・教育", "Culture & education", "文化・教育", "Cultura y educación"]
            ];
            rows.forEach(r => {
                if (!I18N.dict.en[r[0]])
                    I18N.dict.en[r[0]] = r[1];
                if (!I18N.dict.zh[r[0]])
                    I18N.dict.zh[r[0]] = r[2];
                if (!I18N.dict.es[r[0]])
                    I18N.dict.es[r[0]] = r[3];
            });
        }
    }
    catch (e) { }
})();
