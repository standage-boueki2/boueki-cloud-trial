(function () {
    const W = window;
    if (W.__v2192cty)
        return;
    W.__v2192cty = 1;
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const lang = () => {
        try {
            const v = String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja");
            return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
        }
        catch (e) {
            return "ja";
        }
    };
    const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const say = (m) => {
        try {
            if (typeof toast === "function")
                toast(m);
        }
        catch (e) { }
    };
    const busy = () => !!(W.__ctyBusy);
    const deepOn = () => {
        try {
            return !!(typeof CTY_VIEW !== "undefined" && CTY_VIEW && CTY_VIEW.c);
        }
        catch (e) {
            return false;
        }
    };
    const store = () => {
        try {
            return typeof ctyStore === "function" ? ctyStore() : null;
        }
        catch (e) {
            return null;
        }
    };
    const chosen = () => {
        try {
            return typeof ctyChosen === "function" ? (ctyChosen() || []) : [];
        }
        catch (e) {
            return [];
        }
    };
    const banned = (c) => {
        try {
            return typeof v83banHit === "function" && !!v83banHit(c);
        }
        catch (e) {
            return false;
        }
    };
    const norm = (c) => {
        try {
            return typeof ctyNorm === "function" ? ctyNorm(c) : String(c || "").trim();
        }
        catch (e) {
            return String(c || "").trim();
        }
    };
    const tc = (c) => {
        try {
            return lang() !== "ja" && typeof W.v30T === "function" ? String(W.v30T(c) || c) : c;
        }
        catch (e) {
            return c;
        }
    };
    const joinC = (a) => lang() === "ja" ? a.join("・") : a.map(tc).join(", ");
    const KIND_OF_CAT = { "食品": "food", "酒類": "food", "健康食品": "health", "化粧品": "beauty", "日用雑貨": "living", "アパレル": "living", "家具": "living",
        "工業部品": "parts", "農業資材": "agri", "医療・衛生用品": "medical", "医療機器": "medical", "医薬品": "medical", "中古車": "car", "建設機械": "machine",
        "文化・教育用品": "culture", "ペット用品": "pet", "中古品": "other", "その他": "other" };
    function kindOf() {
        let cat = "", hs = "", txt = "";
        try {
            const d = (typeof D !== "undefined" && D) || {}, t = (typeof TEN !== "undefined" && TEN) || {};
            cat = String(d.cat || t.cat || "").trim();
            hs = String(d.hs || t.hs || "");
            txt = [d.item || t.item, d.itemEn || t.itemEn].filter(Boolean).join(" ");
        }
        catch (e) { }
        let k = KIND_OF_CAT[cat] || "";
        let nm = cat;
        if (!k || k === "other") {
            let c2 = "";
            try {
                c2 = typeof W.v92catByHS === "function" ? String(W.v92catByHS(hs, txt) || "") : "";
            }
            catch (e) { }
            if (c2 && KIND_OF_CAT[c2] && KIND_OF_CAT[c2] !== "other") {
                k = KIND_OF_CAT[c2];
                nm = c2;
            }
            else if (/ペット|犬用|猫用|\bpets?\b/i.test(txt)) {
                k = "pet";
                nm = "ペット用品";
            }
        }
        if (!k) {
            let ck = "";
            try {
                ck = typeof ctyCatKey === "function" ? ctyCatKey() : "";
            }
            catch (e) { }
            k = { food: "food", cosme: "beauty", parts: "parts", daily: "living", car: "car", liquor: "food", apparel: "living", medical: "medical" }[ck] || "other";
        }
        return { k, cat: nm || "その他", b2b: /^(parts|agri|car|machine)$/.test(k), liquor: cat === "酒類", claims: /^(food|health|beauty|medical)$/.test(k) };
    }
    W.v92ctyKind = kindOf;
    const RE_DRUG = /ドラッグ|薬局|美容|健康|Watsons|Mannings|Guardian|Cosmed|Boots|Pharmac|Mercury Drug|Sephora|Marionnaud|Olive Young|Shoppers Drug|Nahdi|Al-Dawaa|(^|[^A-Za-z])dm([^A-Za-z]|$)|Rossmann|Superdrug|CVS|Walgreens|Ulta|Chemist Warehouse|Priceline|Cult Beauty|Namshi|Nykaa|iHerb|Well\.ca|クリニック/;
    const RE_FOOD = /食品|ParknShop|Wellcome|city'?super|PX Mart|Carrefour|微風|FairPrice|Cold Storage|Donki|AEON|Jaya Grocer|Tops|Gourmet Market|WinMart|Lotte Mart|Ranch Market|SM Supermarket|Robinsons|E-mart|Ole'|Whole Foods|Sprouts|Mitsuwa|Loblaws|T&T|Lulu|Spinneys|Panda|Danube|Monoprix|Rewe|Edeka|Waitrose|Tesco|Woolworths|Coles|Reliance Retail|Spencer|Shoprite|Spar|Ocado|BigBasket|RedMart|エピスリー|スーパー/;
    function chKeep(kind, txt) {
        const drug = RE_DRUG.test(txt), food = RE_FOOD.test(txt);
        if (kind === "food")
            return !drug;
        if (kind === "beauty" || kind === "medical")
            return !food;
        if (kind === "health")
            return true;
        return !drug && !food;
    }
    function chFilterOne(kind, x) {
        const s = String(x == null ? "" : x);
        const m = s.match(/^(.*?)（([^（）]*)）$/);
        if (m && /食品|美容|健康|ドラッグ|薬局/.test(m[2]))
            return chKeep(kind, m[2]) ? s : "";
        const parts = s.split("・");
        const keep = parts.filter(p => chKeep(kind, p));
        return keep.length === parts.length ? s : keep.join("・");
    }
    function chFilter(kind, ch) {
        if (!ch)
            return ch;
        const f = (a) => (Array.isArray(a) ? a : []).map(x => chFilterOne(kind, x)).filter(Boolean);
        return { online: f(ch.online), live: ch.live, offline: f(ch.offline) };
    }
    if (typeof ctyDeepBase === "function") {
        const __db92 = ctyDeepBase;
        ctyDeepBase = function (c) {
            const b = __db92.apply(this, arguments);
            try {
                const K = kindOf();
                b.v92kind = K.k;
                if (K.b2b)
                    b.channels = null;
                else if (b.channels) {
                    b.channels = chFilter(K.k, b.channels);
                    if (K.k === "medical")
                        b.channels.live = "";
                }
                const A = (typeof CTY_AUTH !== "undefined" && CTY_AUTH && CTY_AUTH[c]) || null;
                if (A) {
                    const spec = (K.k === "food" && !K.liquor) || K.k === "health" ? A.food : K.k === "beauty" ? A.cosme : K.k === "parts" ? A.parts : "";
                    if (spec)
                        b.authority = spec;
                    else if (K.k === "agri" || K.k === "machine" || K.k === "car")
                        b.authority = "要確認（この商材を担当する当局は、アプリの一般表にありません）";
                    else
                        b.authority = A._ ? "要確認（アプリの一般表では「" + String(A._) + "」。この商材に当てはまるかは未確認です）" : "要確認（この商材を担当する当局は、アプリの一般表にありません）";
                }
            }
            catch (e) { }
            return b;
        };
    }
    const Q = "要確認（AI接続でWeb調査）";
    const NOTE_CH = "この国での具体的な相手は要確認";
    const AIB = "AIバイヤー開拓で候補先をリストにし、現地拠点と絞り込む";
    const B2B = {
        machine: {
            sell: ["現地の輸入業者・販売店（ディーラー）", "建設会社・レンタル会社など、使う会社への直接販売", "中古機械の取引サイト・業者間の入札（オークション）"],
            regLabel: "輸入の条件（年式・検査・登録など）", limLabel: "排出ガス・安全などの基準",
            regItems: ["中古の機械の輸入の可否・年式の制限（要確認）", "排出ガス・安全の基準への適合（要確認）", "船積前検査・洗浄（土や植物の付着）の求め（要確認）"],
            road: [["仕向国の輸入の条件（中古機械の可否・年式・排出ガス・検査）の確認と必要書類の準備", "在庫リスト（写真・製造年・稼働時間・点検記録）と見積の提示", AIB],
                ["輸入者との売買契約と支払条件（前払い・L/C など）の取り決め", "初回の船積み（RORO船・フラットラックコンテナ）と現地での引き渡し", "実績のモニタリング"],
                ["取り扱う機種・台数の拡大", "定期取引化・部品の供給や整備の体制づくり", "近隣国への横展開"]]
        },
        car: {
            sell: ["現地の輸入業者・中古車の販売店（ディーラー）", "業者間の取引サイト・オークションを通じた販売", "法人・個人の買い手への直接販売（国により可否は要確認）"],
            regLabel: "輸入の条件（年式・検査・登録など）", limLabel: "排出ガス・安全などの基準",
            regItems: ["中古車の輸入の可否・年式の制限（要確認）", "ハンドルの位置（右・左）・排出ガス・安全の基準（要確認）", "船積前検査・輸出抹消などの書類（要確認）"],
            road: [["仕向国の輸入の条件（年式・ハンドルの位置・排出ガス・検査）の確認と必要書類の準備", "在庫リスト（写真・年式・走行距離・状態の評価）と見積の提示", AIB],
                ["輸入者との売買契約と支払条件（前払い・L/C など）の取り決め", "初回の船積み（RORO船・コンテナ）と現地での引き渡し", "実績のモニタリング"],
                ["取り扱う車種・台数の拡大", "定期取引化・部品の供給の体制づくり", "近隣国への横展開"]]
        },
        parts: {
            sell: ["現地の輸入代理店・技術商社", "完成品・装置のメーカーの調達部門への直接販売", "保守・補修向けの販売店"],
            regLabel: "規格・適合（該当するもの）", limLabel: "規格・含有物質の制限",
            regItems: ["製品の規格・認証への適合（該当する場合・要確認）", "該非判定（日本からの輸出に許可が要るかの確認）", "含有化学物質などの規制（該当する場合・要確認）"],
            road: [["仕様・図面・規格の確認と必要書類（該非判定書など）の準備", "サンプル・見積の提示（輸入代理店・メーカーの調達部門）", AIB],
                ["代理店・顧客との契約と支払条件の取り決め", "初回出荷と、顧客での評価（品質の確認）", "実績のモニタリング"],
                ["品番・用途の拡大", "定期取引化・在庫と納期の体制づくり", "近隣国への横展開"]]
        },
        agri: {
            sell: ["現地の輸入代理店・ディストリビューター（農業資材）", "農業資材の卸・販売店", "生産者団体・大規模農園への直接販売"],
            regLabel: "表示要件（ラベル）", limLabel: "成分・規格の上限",
            regItems: ["製品の登録・届出の要否（肥料・農薬・種子などは、登録が要る国があります・要確認）", "現地語のラベル・成分の表示（要確認）", "成分・重金属などの基準（要確認）"],
            road: [["仕向国での登録・届出の要否の確認と必要書類（成分の分析・SDS など）の準備", "サンプル・見積の提示（輸入代理店・農業資材の卸）", AIB],
                ["輸入代理店との契約と、要る場合は製品の登録の手続き", "初回出荷と、現地での試験的な使用（効果の確認）", "実績のモニタリング"],
                ["取り扱う品目・販売地域の拡大", "定期取引化・現地での使い方の説明と販促", "近隣国への横展開"]]
        }
    };
    const B2B_NOTE = "企業どうしの取引（B2B）が中心の商材のため、消費者向けの越境EC・ライブコマース・小売の定型は出していません。";
    const B2B_NA = "対象外（B2B の商材のため、定型を出していません）";
    const CONS_ADD = { living: ["生活雑貨・インテリアの専門店、ライフスタイルショップ"], culture: ["文具・画材・楽器・玩具の専門店、ミュージアムショップ、学校・文化教室"],
        pet: ["ペット用品の専門店・量販店"], medical: ["医療・衛生用品の輸入販売業者（許認可を持つ会社）", "病院・クリニック・介護施設の調達"] };
    function adaptLocal(L, c) {
        const d = L && L.d;
        if (!d)
            return;
        const K = kindOf();
        let b = {};
        try {
            b = ctyDeepBase(c) || {};
        }
        catch (e) { }
        d.v92kind = K.k;
        if (!(b.exportUsd > 0)) {
            let noS = false;
            try {
                noS = !ctyStats();
            }
            catch (e) { }
            if (d.market)
                d.market.exportFromJapan = noS ? "この HS コードの通関統計を引けていません（要確認）" : "通関統計に、この国向けの数字がありません（実績が無いとは限りません・要確認）";
            if (d.competition)
                d.competition.shareNote = noS ? "通関統計を引けていないため、競合の状況は分かりません（要確認）" : "通関統計にこの国向けの数字が無いため、競合の状況は分かりません（要確認）";
        }
        if (!K.b2b) {
            const add = CONS_ADD[K.k];
            if (add && d.channels && Array.isArray(d.channels.offline))
                add.forEach((x) => d.channels.offline.push({ channel: x, note: "この国での具体的な店・相手は要確認" }));
            if (K.k === "medical" && d.channels)
                d.channels.live = { platform: "", note: "" };
            return;
        }
        const T = B2B[K.k];
        if (!T)
            return;
        let pay = "";
        try {
            pay = String((typeof D !== "undefined" && D && D.pay) || "").trim();
        }
        catch (e) { }
        if (d.overview)
            d.overview.summary = "この商材（" + K.cat + "）は、" + B2B_NOTE + String(d.overview.summary || "");
        if (d.regulation) {
            d.regulation.labeling = T.regItems.slice();
            d.regulation.claimsOK = [B2B_NA];
            d.regulation.claimsNG = [B2B_NA];
        }
        if (d.market)
            d.market.ecommerce = "要確認（B2B の取引サイトの使われ方）";
        d.channels = { online: [{ platform: "B2B の取引サイト・業界の掲載先・自社の英語サイト", note: "この国でよく使われる掲載先は要確認" }],
            live: { platform: B2B_NA, note: "" }, offline: T.sell.map((x) => ({ channel: x, note: NOTE_CH })), importer: "現地の輸入者・代理店（要選定）", notes: "" };
        const duty = String(b.duty || "要確認");
        d.pricing = { retail: Q, retailJpy: "", position: Q, vs: Q,
            online: { platformFee: String(b.price || "").trim() || "要確認（価格表が未登録）", logistics: "要確認（物流の見積で確かめます）", payment: pay || "要確認", net: "要確認" },
            offline: { retailMargin: duty !== "要確認" ? "関税 " + duty + "（そのほかの税は要確認）" : "要確認", distributor: "要確認", importer: "要確認（消費財向けの定型の率は当てはめていません）", net: "要確認" },
            tax: { duty, vat: Q, deMinimis: "対象外（B2B）" },
            rationale: "企業どうしの取引（B2B）のため、消費財向けの流通マージンの定型は当てはめていません。現地での販売価格と利幅は、輸入者との見積のやり取りと AI の詳細調査で確かめます（要確認）。" };
        d.roadmap = [{ phase: "Phase 1", period: "0〜3ヶ月", actions: T.road[0].slice() }, { phase: "Phase 2", period: "3〜9ヶ月", actions: T.road[1].slice() }, { phase: "Phase 3", period: "9ヶ月〜", actions: T.road[2].slice() }];
        d.kpi = [{ gate: "6ヶ月", items: ["初回受注・出荷の完了", "商談5件以上", "引き合い・見積依頼の蓄積"] }, { gate: "12ヶ月", items: ["限界利益 ±0以上", "リピート発注の発生", "取引先（輸入者・販売店）の確立"] }, { gate: "18ヶ月", items: ["取引先・販売地域の拡大", "近隣国への展開判断"] }];
        d.risks = [{ risk: "輸入の条件・規制の不適合", mitigation: "事前の確認・AI詳細調査・現地拠点の確認" }, { risk: "価格競争", mitigation: "強み・エビデンス（点検記録・試験データなど）で差別化" },
            { risk: "物流・リードタイム", mitigation: "AI物流見積で複数社を比較（大きい・重い貨物は、船の種類と港を早めに確認）" }, { risk: "代金回収", mitigation: "前払い／L/C・信用調査" }];
        if (d.standage)
            d.standage.support = ["規制・輸入の条件の調査と書類作成", "バイヤー開拓・商談代行（拠点に依頼）", "物流AI見積・出荷手続き"];
    }
    if (typeof ctyDeepLocal === "function") {
        const __dl92 = ctyDeepLocal;
        ctyDeepLocal = function (c) {
            const L = __dl92.apply(this, arguments);
            try {
                adaptLocal(L, c);
            }
            catch (e) { }
            return L;
        };
    }
    if (typeof llmAsk === "function") {
        const __la92 = llmAsk;
        llmAsk = function (q, maxTok, opts) {
            try {
                const s = String(q == null ? "" : q);
                if (/「国別戦略レポート」/.test(s) && s.indexOf("追加の規則（21.92）") < 0) {
                    const K = kindOf();
                    if (K.b2b)
                        q = s + "\n追加の規則（21.92）：この商品（" + K.cat + "）は企業どうしの取引（B2B）が中心です。消費者向けの越境EC・ライブコマース・小売店の定型に当てはめない。channels.online・offline には、輸入業者・販売店・代理店・使う会社への直接販売など B2B の売り先と引き合いの入口を書き、channels.live.platform は「対象外」と書く。pricing の online・offline・tax.deMinimis で、B2B に当てはまらない項目は「対象外」と書く。regulation.claimsOK・claimsNG は、該当しなければ空の配列にする。確かめられないことは「要確認」。";
                }
            }
            catch (e) { }
            return __la92.call(this, q, maxTok, opts);
        };
    }
    if (typeof ctyDeepAI === "function") {
        const __da92 = ctyDeepAI;
        ctyDeepAI = async function (c) {
            const r = await __da92.apply(this, arguments);
            try {
                if (r && r.d && !r.local) {
                    r.d.v92kind = kindOf().k;
                    r.d.v92ai = 1;
                }
            }
            catch (e) { }
            return r;
        };
    }
    const rep1 = (h, a, b) => { const i = h.indexOf(a); return i < 0 ? h : h.slice(0, i) + b + h.slice(i + a.length); };
    const LBL = (t) => '<span style="color:var(--ink-3);flex:none">' + t + "</span>";
    const NA_RE = /^(?:—|-|対象外|該当なし|要確認)/;
    function deepRelabel(h, DP, c) {
        const d = DP && DP.d;
        if (!d)
            return h;
        const K = kindOf();
        const kind = String(d.v92kind || "");
        const b2b = /^(parts|agri|car|machine)$/.test(kind);
        const live = String((d.channels && d.channels.live && d.channels.live.platform) || "").trim();
        if (!live || (!b2b && NA_RE.test(live) && !/要確認/.test(live)))
            h = h.replace(/<p class="lbl" style="margin-top:8px">ライブコマース<\/p><p style="font-size:12px;margin-top:3px"><b>[^<]*<\/b>(?:：[^<]*)?<\/p>/, "");
        if (!K.claims && d.regulation) {
            const none = (a) => !Array.isArray(a) || !a.length || a.every((x) => NA_RE.test(String(x || "").trim()));
            if (none(d.regulation.claimsOK) && none(d.regulation.claimsNG))
                h = h.replace(/<div class="g2" style="gap:8px;margin-top:8px"><div style="padding:8px 10px;border-radius:8px;background:var\(--good-soft\)">[\s\S]*?<\/div><div style="padding:8px 10px;border-radius:8px;background:var\(--crit-soft\)">[\s\S]*?<\/div><\/div>/, "");
        }
        try {
            const st = String((typeof v56priceCSt === "function" && v56priceCSt(c)) || "");
            const mem = (d.standage && Array.isArray(d.standage.members)) ? d.standage.members : [];
            if (st && st !== "open" && mem.length && h.indexOf("data-v92basen") < 0)
                h = rep1(h, '<p class="lbl" style="margin-top:8px">提供できる支援</p>', '<p class="nn" data-v92basen="1" data-noi18n data-kqn="1" style="margin-top:4px">' + E(M("上のメンバーは、トライアル用の見本の表示です。拠点の開設までは本社が対応します。", "The members above are sample entries for the trial. Until the base opens, the head office supports you.", "以上成员为试用版的样例显示。据点开设前由总部对应。", "Los miembros de arriba son ejemplos de la prueba. Hasta que abra la base, atiende la sede.")) + "</p>" + '<p class="lbl" style="margin-top:8px">提供できる支援</p>');
        }
        catch (e) { }
        if (!b2b)
            return h;
        if (!DP.local) {
            h = rep1(h, '<p class="lbl" style="margin-top:6px">オンライン（越境EC・EC）</p>', '<p class="lbl" style="margin-top:6px">オンライン</p>');
            h = rep1(h, '<p class="lbl" style="margin-top:8px">オフライン（小売・専門チャネル）</p>', '<p class="lbl" style="margin-top:8px">オフライン（売り先）</p>');
            return h;
        }
        const T = B2B[kind] || B2B.parts;
        h = rep1(h, "<h3>📋 規制・表示</h3>", kind === "agri" ? "<h3>📋 規制・表示</h3>" : "<h3>📋 規制・輸入の条件</h3>");
        h = rep1(h, '<p class="lbl" style="margin-top:8px">表示要件</p>', '<p class="lbl" style="margin-top:8px">' + E(T.regLabel) + "</p>");
        h = rep1(h, '<p class="lbl" style="margin-top:8px">成分・規格の上限</p>', '<p class="lbl" style="margin-top:8px">' + E(T.limLabel) + "</p>");
        h = rep1(h, LBL("EC・越境EC"), LBL("オンラインでの取引"));
        h = rep1(h, '<p class="lbl" style="margin-top:6px">オンライン（越境EC・EC）</p>', '<p class="lbl" style="margin-top:6px">オンラインでの引き合い（B2B）</p>');
        h = rep1(h, '<p class="lbl" style="margin-top:8px">ライブコマース</p>', '<p class="lbl" style="margin-top:8px">消費者向けの EC・ライブ販売</p>');
        h = rep1(h, '<p class="lbl" style="margin-top:8px">オフライン（小売・専門チャネル）</p>', '<p class="lbl" style="margin-top:8px">主な売り先（B2B）</p>');
        h = rep1(h, LBL("正規輸入者"), LBL("輸入者・代理店"));
        h = rep1(h, LBL("推奨小売価格"), LBL("現地での販売価格（目安）"));
        h = rep1(h, "<b>オンライン（越境EC）単価分解</b>", "<b>輸出側（当社）の内訳</b>");
        h = rep1(h, LBL("プラットフォーム手数料"), LBL("当社の価格（登録の価格表）"));
        h = rep1(h, LBL("国際物流・FF"), LBL("国際輸送・保険"));
        h = rep1(h, LBL("決済手数料"), LBL("支払条件"));
        h = rep1(h, "<b>オフライン（正規流通）単価分解</b>", "<b>輸入側（現地）の内訳</b>");
        h = rep1(h, LBL("小売マージン"), LBL("関税・輸入時の税"));
        h = rep1(h, LBL("ディストリビューター"), LBL("現地の輸送・登録・検査の費用"));
        h = rep1(h, LBL("輸入者・諸経費"), LBL("輸入者・販売店の利幅"));
        {
            const k = LBL("当社手取り（概算）");
            const i1 = h.indexOf(k), i2 = i1 >= 0 ? h.indexOf(k, i1 + k.length) : -1;
            if (i2 >= 0)
                h = h.slice(0, i2) + LBL("現地での販売価格（目安）") + h.slice(i2 + k.length);
        }
        h = rep1(h, LBL("越境ECの免税枠（de minimis）"), LBL("消費者向け EC の免税枠"));
        return h;
    }
    if (typeof ctyDeepView === "function") {
        const __dv92 = ctyDeepView;
        ctyDeepView = function (c) {
            try {
                const S0 = ctyDeepStore(), DP0 = S0 && S0[c];
                if (DP0 && DP0.local && DP0.d && DP0.d.v92kind !== kindOf().k && typeof ctyDeepLocal === "function" && !W.__ctyDeepBusy) {
                    const N = ctyDeepLocal(c);
                    if (N && N.d) {
                        if (DP0.v90trig)
                            N.v90trig = DP0.v90trig;
                        if (DP0.err)
                            N.err = DP0.err;
                        S0[c] = N;
                    }
                }
            }
            catch (e) { }
            let h = __dv92.apply(this, arguments);
            try {
                if (typeof h === "string") {
                    h = deepRelabel(h, ctyDeepOf(c), c);
                    h = deepPickBtn(h, c);
                }
            }
            catch (e) { }
            return h;
        };
    }
    const PPT_MAP = [["オンライン（越境EC・EC）", "オンラインでの引き合い（B2B）", 0], ["ライブコマース", "消費者向けの EC・ライブ販売", 0], ["オフライン（小売・専門チャネル）", "主な売り先（B2B）", 0],
        ["正規輸入者：", "輸入者・代理店：", 1], ["推奨小売価格 ", "現地での販売価格 ", 1], ["オンライン（越境EC）", "輸出側（当社）", 0], ["ﾌﾟﾗｯﾄﾌｫｰﾑ手数料", "当社の価格", 0], ["決済手数料", "支払条件", 0],
        ["オフライン（正規流通）", "輸入側（現地）", 0], ["小売マージン", "関税・輸入時の税", 0], ["ﾃﾞｨｽﾄﾘﾋﾞｭｰﾀｰ", "現地の輸送・検査", 0], ["輸入者・諸経費", "輸入者等の利幅", 0], ["／越境EC免税枠 ", "／消費者向けECの免税枠 ", 2],
        ["言える表現（OK）", "広告の表現（言える）", 0], ["言えない表現（NG）", "広告の表現（言えない）", 0], ["EC・越境EC", "オンラインでの取引", 0]];
    if (typeof ctyDeepSlides === "function") {
        const __ds92 = ctyDeepSlides;
        ctyDeepSlides = function (c) {
            const S = __ds92.apply(this, arguments);
            try {
                const DP = ctyDeepOf(c), d = DP && DP.d;
                if (Array.isArray(S) && DP && DP.local && d && /^(parts|agri|car|machine)$/.test(String(d.v92kind || ""))) {
                    const T = B2B[d.v92kind];
                    const reg = T.regLabel.replace(/（.*$/, "");
                    const map = PPT_MAP.concat([["必要書類・表示要件", "必要書類・" + reg, 0], ["表示要件", reg, 0], ["成分・規格の上限：", T.limLabel + "：", 1]]);
                    return S.map((x) => String(x).replace(/<a:t>([\s\S]*?)<\/a:t>/g, (m0, t) => {
                        let o = t;
                        for (const p of map) {
                            if (p[2] === 0 && o === p[0]) {
                                o = p[1];
                                break;
                            }
                            if (p[2] === 1 && o.indexOf(p[0]) === 0) {
                                o = p[1] + o.slice(p[0].length);
                                break;
                            }
                            if (p[2] === 2 && o.indexOf(p[0]) >= 0)
                                o = o.split(p[0]).join(p[1]);
                        }
                        return "<a:t>" + o + "</a:t>";
                    }));
                }
            }
            catch (e) { }
            return S;
        };
    }
    const thin = (r) => !!(r && r.sc && r.sc.mkt == null && r.sc.comp == null);
    const tot = (r) => (r && r.sc && isFinite(+r.sc.total)) ? +r.sc.total : -1;
    function hopeList(s) {
        let L = [];
        try {
            const t = (typeof TEN !== "undefined" && TEN) || null;
            L = chosen().length ? (Array.isArray(s && s.v92hope) ? s.v92hope : (Array.isArray(s && s.prevTargets) ? s.prevTargets : [])) : ((t && t.targets) || []);
        }
        catch (e) { }
        const out = [];
        (L || []).forEach((c) => {
            const n = norm(c);
            if (n && out.indexOf(n) < 0)
                out.push(n);
        });
        return out;
    }
    function ruleTop(s) {
        const rec = (s.rec || []).filter((r) => r && r.c && !banned(r.c));
        const hope = hopeList(s);
        const isH = (r) => hope.indexOf(r.c) >= 0;
        const byT = (a, b) => tot(b) - tot(a);
        const H = rec.filter(isH).sort((a, b) => (thin(a) ? 1 : 0) - (thin(b) ? 1 : 0) || byT(a, b));
        const O = rec.filter(r => !isH(r) && !thin(r)).sort(byT);
        let top = H.concat(O).slice(0, 3);
        if (!top.length)
            top = rec.slice().sort(byT).slice(0, 3);
        return top.map(r => r.c);
    }
    function applyRule(s) {
        if (!s || !Array.isArray(s.rec) || !s.rec.length || busy())
            return;
        if (s.ai) {
            if (s.v92rule)
                delete s.v92rule;
            return;
        }
        const top = ruleTop(s);
        const sig = top.join("\u0001") + "|" + hopeList(s).join("\u0001");
        if (s.v92rule === sig && Array.isArray(s.v92top))
            return;
        s.v92rule = sig;
        s.v92top = top.slice();
        s.top = top.slice();
        try {
            if (typeof ctySave === "function")
                ctySave();
        }
        catch (e) { }
    }
    if (typeof ctyStore === "function") {
        const __cs92 = ctyStore;
        ctyStore = function () {
            const s = __cs92.apply(this, arguments);
            try {
                if (s && !s.ai && s.v92rule && Array.isArray(s.v92top) && Array.isArray(s.top) && s.top.length === s.v92top.length && s.top.join("\u0001") !== s.v92top.join("\u0001")
                    && s.top.every((c) => s.v92top.indexOf(c) >= 0))
                    s.top.splice(0, s.top.length, ...s.v92top);
            }
            catch (e) { }
            return s;
        };
    }
    function ruleInfo() {
        const s = store();
        const o = { on: false, ai: false, rule: false, hope: [], hopeIn: [], hopeOut: [], hopeNoCand: [], thin: [], top: [], higher: [], pick: [], chosen: chosen(), kind: kindOf().k };
        if (!s || !Array.isArray(s.rec) || !s.rec.length)
            return o;
        o.on = true;
        o.ai = !!s.ai;
        o.rule = !s.ai && !!s.v92rule;
        o.top = (s.top || []).slice();
        const hope = hopeList(s);
        o.hope = hope.filter(c => s.rec.some((r) => r.c === c));
        o.hopeNoCand = hope.filter(c => !s.rec.some((r) => r.c === c));
        o.hopeIn = o.hope.filter((c) => o.top.indexOf(c) >= 0);
        o.hopeOut = o.hope.filter((c) => o.top.indexOf(c) < 0);
        o.thin = s.rec.filter(thin).map((r) => r.c);
        const minTop = Math.min(...s.rec.filter((r) => o.top.indexOf(r.c) >= 0).map(tot));
        o.higher = s.rec.filter((r) => o.top.indexOf(r.c) < 0 && o.hope.indexOf(r.c) < 0 && tot(r) > minTop).map((r) => ({ c: r.c, total: tot(r), thin: thin(r) }));
        o.pick = pickNow(s);
        o.flat = s.rec.every((r) => r && r.facts && !r.facts.known && !(r.facts.exportUsd > 0));
        return o;
    }
    W.v92ctyInfo = ruleInfo;
    function ruleBox(s) {
        const I = ruleInfo();
        if (!I.rule)
            return "";
        const li = [];
        if (I.hope.length) {
            li.push(M("商品の登録で選んだ進出希望国：", "Target markets from your product registration: ", "商品登记时选择的目标市场：", "Mercados objetivo del registro: ") + "<b>" + E(joinC(I.hope)) + "</b>"
                + (I.hopeOut.length ? M("（3か国までのため、推奨に入れていない国：", " (not recommended because the limit is 3: ", "（因最多3个国家而未列入推荐：", " (fuera de la recomendación por el límite de 3: ") + E(joinC(I.hopeOut)) + M("。表のチェックで入れ替えられます）", "; swap them with the checkboxes)", "。可用表中的勾选替换）", "; cámbielos con las casillas)") : ""));
        }
        else
            li.push(M("進出希望国の登録が無い（または候補に入っていない）ため、データのある国を総合点の高い順に選んでいます。", "No target markets are registered (or none is among the candidates), so countries with data are chosen by total score.", "未登记目标市场（或不在候选中），因此按综合分从高到低选择有数据的国家。", "No hay mercados objetivo registrados (o no están entre los candidatos); se eligen los países con datos por puntuación total."));
        if (I.flat)
            li.push(M("この商品は、通関統計と規制のひな形のデータが無いため、国ごとの点数の差は「STANDAGE が商談したバイヤーの数」と「拠点の開設の状況」だけで付いています（商品の売れやすさの差ではありません）。", "For this product there are no customs statistics and no regulation template, so the differences between countries come only from the number of buyers STANDAGE has talked with and the status of its bases (not from how well the product would sell).", "该商品没有海关统计和法规模板的数据，各国分数的差异仅来自“STANDAGE洽谈过的买家数量”和“据点的开设状况”（并非商品好卖程度的差异）。", "Para este producto no hay estadísticas aduaneras ni plantilla de regulación; las diferencias entre países provienen solo del número de compradores con los que STANDAGE ha negociado y del estado de sus bases."));
        if (I.hopeNoCand.length)
            li.push(M("候補に入っていない進出希望国：", "Target markets not among the candidates: ", "不在候选中的目标市场：", "Mercados objetivo fuera de los candidatos: ") + E(joinC(I.hopeNoCand)) + M("（「① 候補国」に足して再分析すると、評価に入ります）", " (add them under “① Candidate countries” and re-analyse)", "（在“① 候选国”中添加后重新分析即可纳入评估）", " (añádalos en «① Países candidatos» y vuelva a analizar)"));
        if (I.higher.length)
            li.push(M("総合点は高いが、推奨に入れていない国：", "Higher total score but not recommended: ", "综合分较高但未列入推荐的国家：", "Mayor puntuación total pero no recomendados: ")
                + I.higher.map((x) => E(tc(x.c)) + " " + x.total + M("点", " pts", "分", " pts") + (x.thin ? M("（データ不足）", " (insufficient data)", "（数据不足）", " (datos insuficientes)") : M("（進出希望国ではない）", " (not a target market)", "（非目标市场）", " (no es mercado objetivo)"))).join(M("、", ", ", "、", ", ")));
        return `<div class="v92rule" id="v92ctyrule" data-noi18n role="note"><b>${E(M("この推奨の決め方（内蔵の採点・AI 未接続）", "How this recommendation was decided (built-in scoring, AI not connected)", "此推荐的决定方式（内置评分・未连接AI）", "Cómo se decidió esta recomendación (puntuación integrada, IA no conectada)"))}</b>
    <p>${E(M("内蔵の採点は、商品の特性（用途・価格帯・強み）を見ていません。そのため、①商品の登録で選んだ進出希望国を先に、②残りを総合点の高い順に選んでいます。市場性と競合がどちらも未評価の国は「データ不足」とし、進出希望国でなければ推奨に入れていません（総合点が、規制と拠点の2つの観点だけで決まるためです）。", "The built-in scoring does not look at your product's characteristics (use, price range, strengths). So (1) the target markets you chose at registration come first, and (2) the rest are filled in by total score. Countries where both Market and Competition are not rated are marked “insufficient data” and are not recommended unless they are your target markets (their total comes only from Regulation and Base).", "内置评分不考虑商品特性（用途・价格带・优势）。因此，①优先选择商品登记时选定的目标市场，②其余按综合分从高到低选择。市场性和竞争均未评估的国家标为“数据不足”，除非是目标市场，否则不列入推荐（因为综合分仅由法规和据点两项决定）。", "La puntuación integrada no considera las características del producto. Por eso (1) van primero los mercados objetivo elegidos en el registro y (2) el resto se completa por puntuación total. Los países sin evaluación de Mercado ni Competencia se marcan «datos insuficientes» y no se recomiendan salvo que sean sus mercados objetivo."))}</p>
    <ul>${li.map(x => "<li>" + x + "</li>").join("")}</ul>
    <p>${E(M("推奨は出発点です。表のチェックで入れ替えられます（3か国まで）。AI が接続されると、商品の特性に照らして選び直します。", "The recommendation is a starting point. Swap countries with the checkboxes (up to 3). When AI is connected, it re-selects in light of your product.", "推荐仅为起点。可用表中的勾选替换（最多3个国家）。连接AI后，将结合商品特性重新选择。", "La recomendación es un punto de partida. Cambie países con las casillas (hasta 3). Con la IA conectada, se vuelve a elegir según su producto."))}</p></div>`;
    }
    function validPick(s, list) {
        const rec = (s && s.rec) || [];
        const out = [];
        (list || []).forEach(c => {
            if (typeof c === "string" && out.indexOf(c) < 0 && rec.some(r => r && r.c === c) && !banned(c))
                out.push(c);
        });
        return out.slice(0, 3);
    }
    function pickNow(s) {
        const ch = chosen();
        if (ch.length)
            return ch;
        if (!s)
            return [];
        return validPick(s, Array.isArray(s.v92pick) ? s.v92pick : (s.top || []));
    }
    W.v92ctyPick = function () { return pickNow(store()); };
    function pickSet(list) {
        const s = store();
        if (!s || chosen().length)
            return false;
        s.v92pick = validPick(s, list);
        return true;
    }
    W.v92ctyPickSet = pickSet;
    function pickFromDom() {
        const s = store();
        if (!s || chosen().length || deepOn())
            return false;
        const bx = Array.from(document.querySelectorAll("#well input[data-ctypick]"));
        if (!bx.length)
            return false;
        const L = bx.filter(x => x.checked && !x.disabled).map(x => String(x.dataset.ctypick));
        const cur0 = pickNow(s);
        if (L.slice().sort().join("\u0001") === cur0.slice().sort().join("\u0001"))
            return false;
        s.v92pick = L.slice(0, 3);
        return true;
    }
    W.v92ctyPickFromDom = pickFromDom;
    function selLine() {
        const s = store();
        const L = pickNow(s);
        return L.length ? M("選択中：", "Selected: ", "已选：", "Seleccionados: ") + joinC(L) + M("（" + L.length + "／3か国）", " (" + L.length + " of 3)", "（" + L.length + "／3个国家）", " (" + L.length + " de 3)")
            : M("まだ選んでいません（表のチェックで1〜3か国）", "None selected yet (tick 1 to 3 countries in the table)", "尚未选择（在表中勾选1〜3个国家）", "Ninguno seleccionado (marque de 1 a 3 países en la tabla)");
    }
    function selPaint() {
        const el = document.getElementById("v92ctysel");
        if (el)
            el.textContent = selLine();
    }
    W.v92ctySelPaint = selPaint;
    document.addEventListener("change", ev => {
        try {
            const t = ev.target;
            if (!t || !t.matches || !t.matches("#well input[data-ctypick]"))
                return;
            pickFromDom();
            selPaint();
            try {
                document.dispatchEvent(new CustomEvent("v92ctypick", { detail: { from: "table" } }));
            }
            catch (e) { }
        }
        catch (e) { }
    });
    function applyPicksHtml(h, s) {
        if (chosen().length || !Array.isArray(s.v92pick))
            return h;
        const pick = validPick(s, s.v92pick);
        return h.replace(/<input type="checkbox" data-ctypick="([^"]+)"([^>]*)>/g, (m0, c, rest) => {
            if (/\sdisabled/.test(rest))
                return m0;
            const want = pick.some(p => E(p) === c);
            return '<input type="checkbox" data-ctypick="' + c + '"' + (want ? " checked" : "") + rest.replace(/\schecked(="[^"]*")?/, "") + ">";
        });
    }
    if (typeof ctyRun === "function") {
        const __cr92 = ctyRun;
        ctyRun = async function () {
            try {
                if (!busy()) {
                    const s = store();
                    if (s) {
                        delete s.v92pick;
                        delete s.v92rule;
                        delete s.v92top;
                        if (!chosen().length && typeof TEN !== "undefined" && TEN)
                            s.v92hope = (TEN.targets || []).slice();
                    }
                }
            }
            catch (e) { }
            return __cr92.apply(this, arguments);
        };
    }
    if (typeof ctyUnconfirm === "function") {
        const __cu92 = ctyUnconfirm;
        ctyUnconfirm = function () {
            try {
                const s = store(), ch = chosen();
                if (s && ch.length)
                    s.v92pick = ch.slice();
            }
            catch (e) { }
            return __cu92.apply(this, arguments);
        };
    }
    if (typeof ctyConfirm === "function") {
        const __cc92 = ctyConfirm;
        ctyConfirm = function () {
            try {
                const s = store();
                const bx = Array.from(document.querySelectorAll("[data-ctypick]"));
                const sel = bx.filter(x => x.checked).map(x => String(x.dataset.ctypick));
                if (bx.length && !sel.length) {
                    say(M("国を1〜3か国選んでください（表のチェック）", "Select 1 to 3 countries (tick the table)", "请选择1〜3个国家（在表中勾选）", "Seleccione de 1 a 3 países (marque la tabla)"));
                    return;
                }
                if (sel.length > 3) {
                    say(M("販売先国は3か国まで選べます。チェックを3つまでに減らしてください。", "You can select up to 3 destination countries. Reduce the ticks to 3.", "销售目的国最多可选3个。请将勾选减少到3个。", "Puede elegir hasta 3 países. Reduzca las marcas a 3."));
                    return;
                }
                const list = (sel.length ? sel : ((s && s.top) || [])).slice(0, 3);
                if (list.length && !chosen().length && typeof TEN !== "undefined" && TEN) {
                    const hope = [];
                    (TEN.targets || []).forEach(c => {
                        const n = norm(c);
                        if (n && hope.indexOf(n) < 0)
                            hope.push(n);
                    });
                    const out = hope.filter(c => list.indexOf(c) < 0);
                    if (out.length && !banStops(list)) {
                        const ok = window.confirm(M("次の" + list.length + "か国を、販売先国に確定します：\n　" + joinC(list) + "\n\n商品の登録で選んだ進出希望国（" + joinC(hope) + "）は、確定した国に置き換わります。\n　外れる国：" + joinC(out) + "\n\nよろしいですか？（あとで「選び直す」で変えられます）", "Confirm these " + list.length + " destination countries:\n  " + joinC(list) + "\n\nThe target markets from your product registration (" + joinC(hope) + ") will be replaced by the confirmed countries.\n  Removed: " + joinC(out) + "\n\nContinue? (You can change this later with “Choose again”.)", "将以下" + list.length + "个国家确定为销售目的国：\n　" + joinC(list) + "\n\n商品登记时选择的目标市场（" + joinC(hope) + "）将替换为已确定的国家。\n　被移除的国家：" + joinC(out) + "\n\n确定吗？（之后可通过“重新选择”更改）", "Confirmar estos " + list.length + " países de destino:\n  " + joinC(list) + "\n\nLos mercados objetivo del registro (" + joinC(hope) + ") se sustituirán por los países confirmados.\n  Se quitan: " + joinC(out) + "\n\n¿Continuar? (Puede cambiarlo después con «Elegir de nuevo».)"));
                        if (!ok)
                            return;
                    }
                    if (s)
                        s.v92hope = hope.slice();
                }
            }
            catch (e) { }
            return __cc92.apply(this, arguments);
        };
    }
    function banStops(list) {
        try {
            return list.some(c => banned(c));
        }
        catch (e) {
            return false;
        }
    }
    const pickMode = (c) => { const s = store(); return !!(s && Array.isArray(s.rec) && s.rec.some((r) => r && r.c === c) && !chosen().length); };
    if (typeof ctyDeepToggle === "function") {
        const __dt92 = ctyDeepToggle;
        ctyDeepToggle = function (c) {
            try {
                if (pickMode(c) && !banned(c)) {
                    const s = store();
                    const cur0 = pickNow(s);
                    if (cur0.indexOf(c) >= 0) {
                        s.v92pick = cur0.filter(x => x !== c);
                        say(M("「" + c + "」を選択から外しました。" + selLine(), "Removed “" + tc(c) + "” from the selection. " + selLine(), "已将“" + c + "”从选择中移除。" + selLine(), "Se quitó «" + c + "» de la selección. " + selLine()));
                    }
                    else if (cur0.length >= 3) {
                        say(M("販売先国は3か国まで選べます（選択中：" + joinC(cur0) + "）。先に「← 一覧へ戻る」の表でどれかのチェックを外してください。", "You can select up to 3 countries (selected: " + joinC(cur0) + "). Go “← Back to the list” and untick one first.", "销售目的国最多可选3个（已选：" + joinC(cur0) + "）。请先通过“← 返回列表”在表中取消一个勾选。", "Puede elegir hasta 3 países (seleccionados: " + joinC(cur0) + "). Vuelva a la lista y desmarque uno primero."));
                        return;
                    }
                    else {
                        s.v92pick = cur0.concat([c]);
                        say(M("「" + c + "」を選択に入れました。" + selLine() + "。確定は「← 一覧へ戻る」のあと、確定のボタンで行います。", "Added “" + tc(c) + "” to the selection. " + selLine() + ". Confirm from the list (“← Back to the list”).", "已将“" + c + "”加入选择。" + selLine() + "。请通过“← 返回列表”后用确定按钮确定。", "Se añadió «" + c + "» a la selección. " + selLine() + ". Confirme desde la lista."));
                    }
                    try {
                        ctySave();
                    }
                    catch (e) { }
                    try {
                        render();
                    }
                    catch (e) { }
                    return;
                }
            }
            catch (e) { }
            return __dt92.apply(this, arguments);
        };
    }
    function deepPickBtn(h, c) {
        if (!pickMode(c))
            return h;
        const s = store();
        const cur0 = pickNow(s);
        const on = cur0.indexOf(c) >= 0;
        h = h.replace(/(<button class="btn g" data-onclick="ctyDeepToggle\([^"]*\)")>[^<]*<\/button>/, (m0, a) => a + ' data-v92pickbtn="' + (on ? "on" : "off") + '" data-noi18n>' + E(on ? M("選択から外す", "Remove from selection", "从选择中移除", "Quitar de la selección") : M("＋ 選択に入れる", "+ Add to selection", "＋ 加入选择", "+ Añadir a la selección")) + "</button>");
        if (on)
            h = rep1(h, '<span class="p or">推奨</span>', '<span class="p or">推奨</span><span class="p hi" data-v92picked="1" data-noi18n>' + E(M("選択中", "Selected", "已选", "Seleccionado")) + "</span>");
        if (on && h.indexOf('data-v92picked="1"') < 0)
            h = h.replace(/(<span class="p lo">拠点 [^<]*<\/span>)/, (m0) => m0 + '<span class="p hi" data-v92picked="1" data-noi18n>' + E(M("選択中", "Selected", "已选", "Seleccionado")) + "</span>");
        const note = '<p class="nn v92deepsel" id="v92ctydeepsel" data-noi18n data-kqn="1" style="margin-top:8px"><b>' + E(selLine()) + "</b>　" + E(M("確定は「← 一覧へ戻る」のあと、確定のボタンで行います（このボタンは、選択に入れる・外すだけです）。", "Confirm from the list after “← Back to the list” (this button only adds to or removes from the selection).", "请通过“← 返回列表”后用确定按钮确定（此按钮仅用于加入或移除选择）。", "Confirme desde la lista (este botón solo añade o quita de la selección).")) + "</p>";
        const k = h.indexOf("data-v92pickbtn=");
        const e = k >= 0 ? h.indexOf("</div></div>", k) : -1;
        if (e >= 0)
            h = h.slice(0, e + 12) + note + h.slice(e + 12);
        return h;
    }
    if (typeof ctyDeepClose === "function") {
        const __dc92 = ctyDeepClose;
        ctyDeepClose = function () {
            let c = "";
            try {
                c = String((typeof CTY_VIEW !== "undefined" && CTY_VIEW && CTY_VIEW.c) || "");
            }
            catch (e) { }
            const r = __dc92.apply(this, arguments);
            try {
                if (c)
                    setTimeout(() => {
                        try {
                            const b = Array.from(document.querySelectorAll("#well input[data-ctypick]")).find(x => x.dataset.ctypick === c);
                            const tr = b && b.closest("tr");
                            if (tr) {
                                tr.scrollIntoView({ block: "center" });
                                tr.classList.add("v92back");
                                setTimeout(() => tr.classList.remove("v92back"), 1800);
                            }
                        }
                        catch (e) { }
                    }, 140);
            }
            catch (e) { }
            return r;
        };
    }
    const COMP_OLD = /通関統計に日本からの輸出実績が無い（先行者不在＝開拓型）/;
    const compTxt = () => {
        let noS = false;
        try {
            noS = !ctyStats();
        }
        catch (e) { }
        return noS ? "この HS コードの通関統計を引けていません（競合の状況は分かりません・要確認）" : "通関統計に、この国向けの輸出の数字がありません（競合の状況は分かりません・要確認）";
    };
    const noStatTxt = () => {
        let noS = false;
        try {
            noS = !ctyStats();
        }
        catch (e) { }
        return noS ? "この HS コードの通関統計を引けていません（要確認）" : "通関統計に、この国向けの数字がありません（実績が無いとは限りません・要確認）";
    };
    if (typeof ctyCompLocal === "function") {
        const __cl92 = ctyCompLocal;
        ctyCompLocal = function (r) {
            const t = __cl92.apply(this, arguments);
            try {
                if (COMP_OLD.test(String(t || "")))
                    return compTxt();
            }
            catch (e) { }
            return t;
        };
    }
    const US_FOOD = "・茶・コーヒー・香辛料などは対象外の可能性";
    const usFix = (t) => { const s = String(t == null ? "" : t); return s.indexOf(US_FOOD) >= 0 ? s.split(US_FOOD).join("・一部の品目は扱いが違います") : s; };
    const isFoodKind = () => { const k = kindOf().k; return k === "food" || k === "health"; };
    if (typeof ctyRiskLocal === "function") {
        const __rl92 = ctyRiskLocal;
        ctyRiskLocal = function (r) {
            const t = __rl92.apply(this, arguments);
            try {
                if (!isFoodKind())
                    return usFix(t);
            }
            catch (e) { }
            return t;
        };
    }
    function scrubStored(s) {
        if (!s || !Array.isArray(s.rec) || s.ai || busy())
            return;
        const food = isFoodKind();
        let n = 0;
        s.rec.forEach((r) => {
            if (!r)
                return;
            if (typeof r.comp === "string" && COMP_OLD.test(r.comp)) {
                r.comp = compTxt();
                n++;
            }
            if (!food && typeof r.risk === "string" && r.risk.indexOf(US_FOOD) >= 0) {
                r.risk = usFix(r.risk);
                n++;
            }
        });
        if (n) {
            try {
                ctySave();
            }
            catch (e) { }
        }
    }
    if (typeof ctySlides === "function") {
        const __sl92 = ctySlides;
        ctySlides = function () {
            const S = __sl92.apply(this, arguments);
            try {
                const s = store();
                if (!Array.isArray(S) || !s)
                    return S;
                const rule = !s.ai && !!s.v92rule;
                const ns = noStatTxt();
                return S.map((x) => String(x).replace(/<a:t>([\s\S]*?)<\/a:t>/g, (m0, t) => {
                    let o = t;
                    if (o.indexOf("通関統計に実績なし") >= 0)
                        o = o.split("通関統計に実績なし").join(ns);
                    if (rule)
                        o = o.replace(/（AI未接続のため、[^（）]*?の採点で並べています。/, "（AI未接続のため、商品の登録で選んだ進出希望国を先に、残りを総合点の高い順に選んでいます。市場性と競合がどちらも未評価の国は、進出希望国でなければ推奨に入れていません。");
                    return o === t ? m0 : "<a:t>" + o + "</a:t>";
                }));
            }
            catch (e) { }
            return S;
        };
    }
    function whyCell(h, s) {
        const rec = s.rec || [];
        let i = 0;
        return h.replace(/<td style="font-size:11px;color:var\(--ink-2\);min-width:220px">([^<]*)<\/td><\/tr>/g, (m0, txt) => {
            const r = rec[i++];
            try {
                let full = String((r && r.why) || "");
                try {
                    if (r && typeof v89ctyWhy === "function")
                        full = String(v89ctyWhy(r.c, full) || full);
                }
                catch (e) { }
                if (full.length <= 110 || E(full.slice(0, 110)) !== txt) {
                    const n = txt.replace(/&(amp|lt|gt|quot|#39);/g, "x").length;
                    return n >= 110 ? m0.replace("</td></tr>", "…</td></tr>") : m0;
                }
                let cut = Math.max(full.lastIndexOf("／", 110), full.lastIndexOf("。", 109) + 1);
                if (cut < 40)
                    cut = 110;
                const head = full.slice(0, cut), rest = full.slice(cut);
                if (!rest.trim())
                    return m0;
                return '<td style="font-size:11px;color:var(--ink-2);min-width:220px" data-v92why="1">' + E(head) + '<details class="v92why"><summary data-noi18n>' + E(M("…続きを読む", "… Read more", "…展开全文", "… Leer más")) + "</summary>" + E(rest) + "</details></td></tr>";
            }
            catch (e) {
                return m0;
            }
        });
    }
    function marks(h, s) {
        const hope = hopeList(s);
        (s.rec || []).forEach((r) => {
            if (!r || !r.c)
                return;
            const isH = hope.indexOf(r.c) >= 0, isT = thin(r);
            if (!isH && !isT)
                return;
            const c = E(r.c);
            const a = h.indexOf('data-ctypick="' + c + '"');
            if (a < 0)
                return;
            const bTag = "<b>" + c + "</b>";
            const b = h.indexOf(bTag, a);
            if (b < 0 || b - a > 400)
                return;
            const add = (isH ? ' <span class="p lo v92hope" data-noi18n title="' + E(M("商品の登録で選んだ進出希望国です", "A target market you chose at product registration", "商品登记时选择的目标市场", "Mercado objetivo elegido en el registro")) + '">' + E(M("進出希望", "Target market", "目标市场", "Objetivo")) + "</span>" : "")
                + (isT ? ' <span class="p lo v92thin" data-noi18n title="' + E(M("市場性と競合がどちらも未評価です。総合点は、規制と拠点の2つの観点だけで出しています", "Market and Competition are both not rated. The total comes only from Regulation and Base", "市场性和竞争均未评估。综合分仅由法规和据点两项得出", "Mercado y Competencia sin evaluar. El total sale solo de Regulación y Base")) + '">' + E(M("データ不足", "Insufficient data", "数据不足", "Datos insuficientes")) + "</span>" : "");
            h = h.slice(0, b + bTag.length) + add + h.slice(b + bTag.length);
        });
        return h;
    }
    function decorate(h, s) {
        h = applyPicksHtml(h, s);
        h = marks(h, s);
        const anchor = '<div class="tw" style="margin-top:9px;max-height:none"><table><thead><tr><th>国</th>';
        if (!s.ai && s.v92rule) {
            try {
                const oldJa = "推奨（色の付いた行）は、総合点の上位3か国です（内蔵ロジック）。";
                let oldT = oldJa;
                try {
                    oldT = typeof W.v54ctyT === "function" ? W.v54ctyT(oldJa) : oldJa;
                }
                catch (e) { }
                const neu = E(M("推奨（色の付いた行）の決め方は、すぐ下の「この推奨の決め方」のとおりです。", "How the recommended (coloured) rows were chosen is explained just below.", "推荐（有底色的行）的决定方式见下方“此推荐的决定方式”。", "Cómo se eligieron las filas recomendadas (de color) se explica justo debajo."));
                [E(oldT), E(oldJa)].forEach(o => {
                    if (h.indexOf(o) >= 0)
                        h = h.split(o).join(neu);
                });
            }
            catch (e) { }
            const i = h.indexOf(anchor);
            if (i >= 0 && h.indexOf('id="v92ctyrule"') < 0)
                h = h.slice(0, i) + ruleBox(s) + h.slice(i);
        }
        h = whyCell(h, s);
        if (h.indexOf("：通関統計に実績なし／") >= 0)
            h = h.split("：通関統計に実績なし／").join("：" + E(noStatTxt()) + "／");
        if (!chosen().length) {
            const k = h.indexOf('data-onclick="ctyConfirm()"');
            const e = k >= 0 ? h.indexOf("</button>", k) : -1;
            if (e >= 0 && h.indexOf('id="v92ctysel"') < 0)
                h = h.slice(0, e + 9) + '<span class="v92sel" id="v92ctysel" data-noi18n aria-live="polite">' + E(selLine()) + "</span>" + h.slice(e + 9);
        }
        return h;
    }
    function exampleCty(h) {
        try {
            const k = 'placeholder="一覧に無い国名を入力（例：メキシコ）"';
            if (h.indexOf(k) < 0 || typeof ctyAll !== "function")
                return h;
            const all = ctyAll();
            const ex = ["カンボジア", "ポーランド", "スイス", "モンゴル", "ガーナ"].find(c => all.indexOf(c) < 0);
            return ex ? h.split(k).join('placeholder="一覧に無い国名を入力（例：' + ex + '）"') : h;
        }
        catch (e) {
            return h;
        }
    }
    if (typeof vCty === "function") {
        const __vc92 = vCty;
        vCty = function () {
            let s = null;
            const deep = deepOn();
            try {
                s = store();
                if (s && !deep) {
                    applyRule(s);
                    scrubStored(s);
                }
            }
            catch (e) { }
            let h = __vc92.apply(this, arguments);
            try {
                if (typeof h === "string" && !deep) {
                    if (s && Array.isArray(s.rec) && s.rec.length && !busy())
                        h = decorate(h, s);
                    h = exampleCty(h);
                }
            }
            catch (e) { }
            return h;
        };
    }
    function baseSt(c) {
        try {
            return typeof v56priceCSt === "function" ? String(v56priceCSt(c) || "") : "";
        }
        catch (e) {
            return "";
        }
    }
    function baseStLabel(st) {
        if (st === "open")
            return M("開設済み", "open", "已开设", "abierta");
        let fy = "";
        try {
            fy = String((typeof V56PRICE_C_FY !== "undefined" && V56PRICE_C_FY && V56PRICE_C_FY[st]) || "");
        }
        catch (e) { }
        if (!fy)
            return "";
        return M(fy + "に開設予定", "planned " + (st === "fy27" ? "FY2027" : "FY2028–29"), (st === "fy27" ? "2027财年" : "2028〜29财年") + "计划开设", "prevista " + (st === "fy27" ? "AF2027" : "AF2028–29"));
    }
    function baseState() {
        const bs = document.getElementById("bsel");
        if (!bs)
            return;
        Array.from(bs.options).forEach((o) => {
            const nm = String(o.getAttribute("data-v92nm") || o.value || o.textContent || "").replace(/（[^（）]*）\s*$/, "").trim();
            if (!nm)
                return;
            const lab = baseStLabel(baseSt(nm));
            if (!lab)
                return;
            let tn = nm;
            try {
                tn = typeof W.v30T === "function" ? String(W.v30T(nm) || nm) : nm;
            }
            catch (e) { }
            const want = M(nm + "（" + lab + "）", tn + " (" + lab + ")", tn + "（" + lab + "）", tn + " (" + lab + ")");
            if (o.textContent !== want) {
                o.setAttribute("data-v92nm", nm);
                o.setAttribute("data-noi18n", "");
                if (!o.hasAttribute("value"))
                    o.value = nm;
                o.textContent = want;
            }
        });
        const sb = document.getElementById("staffbox");
        if (!sb)
            return;
        const cur0 = String(bs.value || "");
        const st = baseSt(cur0);
        let n = sb.querySelector("#v92basest");
        if (!st || st === "open") {
            if (n)
                n.remove();
            return;
        }
        let txt = "";
        try {
            txt = v56priceCBaseTxt({ kind: "direct", c: cur0, st, staff: [] }, 0);
        }
        catch (e) { }
        if (!txt)
            return;
        txt += M("。開設までは本社が対応します（販売先国の選定の「拠点」の点も、この状況で付けています）。", ". Until it opens, the head office supports you (the Base score in destination selection uses this status).", "。开设前由总部对应（销售目的国选定中的“据点”分数也按此状况评分）。", ". Hasta su apertura atiende la sede (la puntuación de Base usa este estado).");
        Array.from(sb.querySelectorAll("p.nn")).forEach((p) => {
            if (p.id !== "v92basest" && /開設準備中/.test(p.textContent || ""))
                p.remove();
        });
        if (!n) {
            n = document.createElement("p");
            n.id = "v92basest";
            n.className = "nn v92basest";
            n.setAttribute("data-noi18n", "");
            n.setAttribute("data-kqn", "1");
            n.setAttribute("role", "note");
            sb.insertBefore(n, sb.firstChild);
        }
        if (n.textContent !== txt)
            n.textContent = txt;
    }
    W.v92ctyBaseState = baseState;
    if (typeof rStaff === "function") {
        const __rs92 = rStaff;
        rStaff = function () {
            const r = __rs92.apply(this, arguments);
            try {
                baseState();
            }
            catch (e) { }
            return r;
        };
    }
    function afterRender() {
        let k = "";
        try {
            k = typeof cur !== "undefined" ? String(cur) : "";
        }
        catch (e) { }
        if (k === "cty") {
            try {
                const ban = document.getElementById("v83ban");
                const ux = document.getElementById("uxsec");
                const chip = ux ? ux.querySelector('[data-sec="v83ban"]') : null;
                if (ban && ban.getAttribute("data-v92moved") && chip && chip !== ux.lastElementChild) {
                    const wasOn = chip.classList.contains("on");
                    ux.appendChild(chip);
                    if (wasOn) {
                        chip.classList.remove("on");
                        const first = ux.querySelector(".uxsc");
                        if (first)
                            first.classList.add("on");
                    }
                }
                const dt = ban ? ban.querySelector("details.v83ban-add") : null;
                if (dt && ban.getAttribute("data-v92moved") && !dt.getAttribute("data-v92shut")) {
                    dt.setAttribute("data-v92shut", "1");
                    dt.open = false;
                }
            }
            catch (e) { }
        }
        if (k === "db") {
            try {
                baseState();
            }
            catch (e) { }
        }
        if (k === "ops")
            usNoteFix();
    }
    function usNoteFix() {
        try {
            if (isFoodKind())
                return;
            const w = document.getElementById("well");
            if (!w || (w.textContent || "").indexOf("茶・コーヒー・香辛料など一部の農産品") < 0)
                return;
            const tw = document.createTreeWalker(w, NodeFilter.SHOW_TEXT);
            const L = [];
            while (tw.nextNode()) {
                const n = tw.currentNode;
                if (n.nodeValue && n.nodeValue.indexOf("茶・コーヒー・香辛料など一部の農産品") >= 0)
                    L.push(n);
            }
            L.forEach(n => { n.nodeValue = n.nodeValue.replace(/など232条の対象品や、茶・コーヒー・香辛料など一部の農産品は、扱いが違います/g, "など232条の対象品をはじめ、一部の品目は扱いが違います"); });
        }
        catch (e) { }
    }
    if (typeof rReg === "function") {
        const __rr92 = rReg;
        rReg = function () {
            const r = __rr92.apply(this, arguments);
            try {
                usNoteFix();
            }
            catch (e) { }
            return r;
        };
    }
    if (typeof render === "function") {
        const __rd92c = render;
        render = function () {
            const r = __rd92c.apply(this, arguments);
            try {
                afterRender();
            }
            catch (e) { }
            return r;
        };
    }
    try {
        if (!document.getElementById("v92ctycss")) {
            const st = document.createElement("style");
            st.id = "v92ctycss";
            st.textContent = ".v92rule{margin:8px 0 2px;padding:10px 12px;border:1px solid var(--line,#dfe5ec);border-left:4px solid var(--or,#f8951d);border-radius:8px;background:var(--surface-2,#f8fafc);font-size:12px;line-height:1.75}" +
                ".v92rule b{font-size:12.5px}.v92rule p{margin:4px 0 0}.v92rule ul{margin:4px 0 0 18px;padding:0}" +
                ".v92hope{border-color:var(--bl,#1f6fd1)!important;color:var(--bl,#1f6fd1)!important;background:var(--bl-soft,#eef5fd)!important}" +
                ".v92thin{border-style:dashed!important;color:var(--ink-3,#6b7a90)!important}" +
                ".v92sel{font-size:12px;font-weight:700;color:var(--or-deep,#c25600);margin-left:2px}" +
                ".v92why{display:inline}.v92why>summary{display:inline;cursor:pointer;color:var(--bl,#1f6fd1);font-weight:700;list-style:none;margin-left:2px}.v92why>summary::-webkit-details-marker{display:none}" +
                ".v92why[open]>summary{display:none}" +
                "tr.v92back{outline:2px solid var(--or,#f8951d);outline-offset:-2px;transition:outline-color .4s}" +
                ".v92basest{margin:0 0 8px;padding:7px 10px;border:1px dashed var(--line,#dfe5ec);border-radius:8px;font-size:12px;line-height:1.7;color:var(--ink-2,#44546a)}" +
                ".v92deepsel{font-size:12.5px;line-height:1.7}";
            (document.head || document.documentElement).appendChild(st);
        }
    }
    catch (e) { }
    try {
        if (typeof v30I18n === "function")
            v30I18n([
                ["📋 規制・輸入の条件", "📋 Regulations & import conditions", "📋 法规・进口条件", "📋 Regulaciones y condiciones de importación"],
                ["規制・輸入の条件", "Regulations & import conditions", "法规・进口条件", "Regulaciones y condiciones de importación"],
                ["輸入の条件（年式・検査・登録など）", "Import conditions (year of manufacture, inspection, registration, etc.)", "进口条件（年份・检验・登记等）", "Condiciones de importación (año, inspección, registro, etc.)"],
                ["排出ガス・安全などの基準", "Emission and safety standards", "排放・安全等标准", "Normas de emisiones y seguridad"],
                ["規格・適合（該当するもの）", "Standards & conformity (where applicable)", "规格・合规（如适用）", "Normas y conformidad (si aplica)"],
                ["規格・含有物質の制限", "Standards & restricted substances", "规格・所含物质的限制", "Normas y sustancias restringidas"],
                ["表示要件（ラベル）", "Labelling requirements", "标示要求（标签）", "Requisitos de etiquetado"],
                ["オンラインでの取引", "Online trade", "线上交易", "Comercio en línea"],
                ["オンラインでの引き合い（B2B）", "Online enquiries (B2B)", "线上询盘（B2B）", "Consultas en línea (B2B)"],
                ["消費者向けの EC・ライブ販売", "Consumer e-commerce & live selling", "面向消费者的电商・直播销售", "Comercio electrónico y venta en directo al consumidor"],
                ["主な売り先（B2B）", "Main buyers (B2B)", "主要销售对象（B2B）", "Principales compradores (B2B)"],
                ["オフライン（売り先）", "Offline (buyers)", "线下（销售对象）", "Fuera de línea (compradores)"],
                ["輸入者・代理店", "Importer / agent", "进口商・代理商", "Importador / agente"],
                ["現地での販売価格（目安）", "Local selling price (indicative)", "当地销售价格（参考）", "Precio de venta local (orientativo)"],
                ["輸出側（当社）の内訳", "Export side (your company)", "出口方（贵公司）明细", "Lado exportador (su empresa)"],
                ["当社の価格（登録の価格表）", "Your price (registered price list)", "贵公司价格（登记的价格表）", "Su precio (lista registrada)"],
                ["国際輸送・保険", "International freight & insurance", "国际运输・保险", "Flete internacional y seguro"],
                ["支払条件", "Payment terms", "付款条件", "Condiciones de pago"],
                ["輸入側（現地）の内訳", "Import side (local)", "进口方（当地）明细", "Lado importador (local)"],
                ["関税・輸入時の税", "Customs duty & import taxes", "关税・进口时的税", "Arancel e impuestos de importación"],
                ["現地の輸送・登録・検査の費用", "Local transport, registration & inspection costs", "当地运输・登记・检验费用", "Costes locales de transporte, registro e inspección"],
                ["輸入者・販売店の利幅", "Importer / dealer margin", "进口商・经销商的利润", "Margen del importador / distribuidor"],
                ["消費者向け EC の免税枠", "De minimis for consumer e-commerce", "面向消费者电商的免税额度", "De minimis para comercio electrónico al consumidor"],
                [B2B_NA, "Not applicable (B2B product; no template shown)", "不适用（B2B商品，不显示模板）", "No aplica (producto B2B; sin plantilla)"],
                ["対象外（B2B）", "Not applicable (B2B)", "不适用（B2B）", "No aplica (B2B)"],
                [NOTE_CH, "Specific counterparts in this country need checking", "该国的具体对象需确认", "Las contrapartes concretas en este país requieren verificación"],
                ["この国での具体的な店・相手は要確認", "Specific shops and counterparts in this country need checking", "该国的具体店铺・对象需确认", "Las tiendas y contrapartes concretas requieren verificación"],
                ["現地の輸入者・代理店（要選定）", "Local importer / agent (to be selected)", "当地进口商・代理商（待选定）", "Importador / agente local (por seleccionar)"],
                ["現地の輸入業者・販売店（ディーラー）", "Local importers and dealers", "当地进口商・经销商", "Importadores y distribuidores locales"],
                ["建設会社・レンタル会社など、使う会社への直接販売", "Direct sales to users such as construction and rental companies", "向建筑公司・租赁公司等使用方直接销售", "Venta directa a usuarios como constructoras y empresas de alquiler"],
                ["中古機械の取引サイト・業者間の入札（オークション）", "Used-machinery trading sites and trade auctions", "二手机械交易网站・同业拍卖", "Sitios de maquinaria usada y subastas entre profesionales"],
                ["現地の輸入代理店・ディストリビューター（農業資材）", "Local import agents and distributors (agricultural inputs)", "当地进口代理商・分销商（农业资材）", "Agentes de importación y distribuidores locales (insumos agrícolas)"],
                ["農業資材の卸・販売店", "Agricultural-input wholesalers and retailers", "农业资材的批发商・销售店", "Mayoristas y tiendas de insumos agrícolas"],
                ["生産者団体・大規模農園への直接販売", "Direct sales to producer groups and large farms", "向生产者团体・大型农场直接销售", "Venta directa a agrupaciones de productores y grandes explotaciones"],
                ["現地の輸入代理店・技術商社", "Local import agents and technical trading companies", "当地进口代理商・技术商社", "Agentes de importación y comercializadoras técnicas locales"],
                ["完成品・装置のメーカーの調達部門への直接販売", "Direct sales to procurement at finished-goods and equipment makers", "向成品・设备制造商的采购部门直接销售", "Venta directa a compras de fabricantes de equipos"],
                ["保守・補修向けの販売店", "Dealers for maintenance and repair", "面向维护・维修的销售店", "Distribuidores para mantenimiento y reparación"],
                ["B2B の取引サイト・業界の掲載先・自社の英語サイト", "B2B trading sites, industry listings and your own English website", "B2B交易网站・行业刊登渠道・自有英文网站", "Sitios B2B, directorios del sector y su web en inglés"],
                ["この国でよく使われる掲載先は要確認", "Which listings are commonly used in this country needs checking", "该国常用的刊登渠道需确认", "Hay que verificar qué directorios se usan en este país"],
                ["通関統計に、この国向けの数字がありません（実績が無いとは限りません・要確認）", "Customs statistics have no figure for this country (this does not necessarily mean no exports; to be checked)", "海关统计中没有该国的数字（不一定表示没有实绩・需确认）", "Las estadísticas aduaneras no tienen cifra para este país (no implica que no haya exportaciones; por verificar)"],
                ["この HS コードの通関統計を引けていません（要確認）", "Customs statistics could not be retrieved for this HS code (to be checked)", "未能查到该HS编码的海关统计（需确认）", "No se pudieron obtener estadísticas aduaneras para este código HS (por verificar)"],
                ["通関統計にこの国向けの数字が無いため、競合の状況は分かりません（要確認）", "Competition is unknown because customs statistics have no figure for this country (to be checked)", "因海关统计中没有该国的数字，竞争状况不明（需确认）", "La competencia se desconoce porque no hay cifra aduanera para este país (por verificar)"],
                ["通関統計を引けていないため、競合の状況は分かりません（要確認）", "Competition is unknown because customs statistics could not be retrieved (to be checked)", "因未能查到海关统计，竞争状况不明（需确认）", "La competencia se desconoce porque no se obtuvieron estadísticas aduaneras (por verificar)"]
            ]);
    }
    catch (e) { }
})();
