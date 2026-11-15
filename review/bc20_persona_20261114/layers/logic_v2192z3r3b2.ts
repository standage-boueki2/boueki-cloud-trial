/* 21.92 r3b（その2）：3回目の評価の残り（国選定・業態・営業資料・商品情報・入力例・言葉）
   (d) 機械情報表の 稼働時間・質量・排ガス・整備 が商品情報の「建設機械の項目」に入らない（auto-N09）
   (e) 国選定：リスクの文が70字で切れる／建機で「中古車・車両の商品で商談したバイヤー」・「その他の商品で」（auto-12・culture-06）／「＋ 開拓しない国を登録する」が開いたまま（medical-14）
   (g) 業態：合わない業態を後ろへ（auto-N06）／営業資料の見せ方の判断の文を業種に合わせる（auto-N16・medical-M08・indagri-N08・other-N11）／
       ケニアの8年の決まりの年またぎの注意（auto-N15）／書類の出どころの欄の調査メモ（medical-M06）／言葉（medical-M09）
   (f) 入力例を商品の単位・国に合わせる（auto-08）
   規制・税の中身は足していない */
declare const TEN: any, D: any, I18N: any, V71OB_BIZ: any, V85DK: any, V85DK_REG: any, V56TARIFF_T: any, V85DOC_D: any, V68P_G: any;
declare let v68pIndLabel: any;
declare let ctyRiskLocal: any, v54ctyBuyers: any, v85dkJudgeHtml: any, v71obPaint: any, v71obHtml: any, v71obBuild: any, v68pAbsorb: any, v68pSetF: any, v71obTpl: any, dmTemplateEN: any, v85dkTen: any;
(function () {
    const W: any = window;
    if (W.__v2192r3b2) return;
    W.__v2192r3b2 = 1;
    const X = W.v92r3b;
    if (!X) return;
    const { E, M, dict, ten, dd, NK } = X;
    const group = () => { try { const t = ten(), d = dd(); return typeof W.v92catGroupOf === "function" ? W.v92catGroupOf(String((t && t.cat) || (d && d.cat) || "")) : null; } catch (e) { return null; } };
    const gk = () => { const g = group(); return g ? g.k : ""; };
    const catNow = () => { const t = ten() || {}, d = dd() || {}; return String(t.cat || d.cat || ""); };

    /* ═════ (e) 国選定 ═════ */
    // リスクの文：規制の注意を70字で切っていた → 文の切れ目（。）まで。長いときは「…」を付ける
    if (typeof ctyRiskLocal === "function") {
        const __cr = ctyRiskLocal;
        ctyRiskLocal = function (this: any, r: any) {
            let s = __cr.apply(this, arguments as any);
            try {
                const w = String((r && r.facts && r.facts.warn) || "");
                if (w.length > 70 && typeof s === "string") {
                    const cut = w.slice(0, 70);
                    if (s.indexOf(cut) >= 0 && s.indexOf(w) < 0) {
                        const i = w.indexOf("。");
                        const full = i >= 0 && i < 140 ? w.slice(0, i + 1) : w.length <= 140 ? w : cut + "…";
                        s = s.replace(cut, full.replace(/。$/, ""));
                    }
                }
            } catch (e) { }
            return s;
        };
    }
    // バイヤー数の言い方：商品の区分と、バイヤーを数えた区分が違うとき
    if (typeof v54ctyBuyers === "function") {
        const __cb = v54ctyBuyers;
        v54ctyBuyers = function (this: any) {
            let s = __cb.apply(this, arguments as any);
            try {
                if (typeof s === "string") {
                    if (catNow() === "建設機械") s = s.replace("が中古車・車両の商品で", "が近い区分「中古車・車両」の商品で");
                    s = s.replace("がその他の商品で", "がさまざまな業種を含む区分「その他」の商品で");
                }
            } catch (e) { }
            return s;
        };
    }
    // 「＋ 開拓しない国を登録する」：最初は閉じておく（自分で開いたら、描き直しても開いたまま）
    let banOpen = false;
    function sweepBan() {
        document.querySelectorAll("details.v83ban-add").forEach((dt: any) => {
            if (dt.dataset.v92r3b) return;
            dt.dataset.v92r3b = "1";
            const ae = document.activeElement;
            if (dt.open !== banOpen && !(ae && dt.contains(ae))) dt.open = banOpen;
            dt.addEventListener("toggle", () => { banOpen = !!dt.open; });
        });
    }

    /* ═════ (g) 業態：その商材に合いにくい業態は後ろへ ═════ */
    const BIZ_DROP: any = { medical: ["horeca", "spec"], beauty: ["horeca"], industry: ["horeca", "spec", "chain"], auto: ["horeca", "spec", "chain"], culture: ["horeca"], other: ["horeca"] };
    function bizOrder() {
        try {
            if (typeof V71OB_BIZ === "undefined" || !Array.isArray(V71OB_BIZ)) return;
            const k = gk();
            if (k === "other" && !/ペット/.test(catNow())) return;
            const drop: string[] = BIZ_DROP[k] || [];
            // もとの並び（輸入商社・量販・EC・飲食・代理店・専門店）を基準に、合いにくいものだけ後ろへ
            const BASE = ["imp", "chain", "ec", "horeca", "dist", "spec"];
            const rank = (key: string) => (drop.indexOf(key) >= 0 ? 1000 + BASE.indexOf(key) : 0);
            const cur = V71OB_BIZ.slice();
            const next = cur.map((x: any, i: number) => ({ x, i })).sort((a: any, b: any) => (rank(a.x[0]) - rank(b.x[0])) || (a.i - b.i)).map((o: any) => o.x);
            // 前に別の商品で後ろへ回したものは、もとの位置へ戻す
            if (!drop.length) {
                const fixed = cur.filter((x: any) => BASE.indexOf(x[0]) < 0);
                const base = BASE.map((b) => cur.find((x: any) => x[0] === b)).filter(Boolean);
                const merged = base.slice(0, 1).concat(fixed, base.slice(1));
                if (merged.length === cur.length && JSON.stringify(merged) !== JSON.stringify(cur)) V71OB_BIZ.splice(0, cur.length, ...merged);
                return;
            }
            if (JSON.stringify(next) !== JSON.stringify(cur)) V71OB_BIZ.splice(0, cur.length, ...next);
        } catch (e) { }
    }
    try {
        if (typeof v71obPaint === "function") { const f0 = v71obPaint; v71obPaint = function (this: any) { const r = f0.apply(this, arguments as any); return r; }; }
        if (typeof v71obHtml === "function") { const f0 = v71obHtml; v71obHtml = function (this: any) { bizOrder(); let r = f0.apply(this, arguments as any); try { bizOrder(); } catch (e) { } return r; }; }
        if (typeof v71obBuild === "function") { const f0 = v71obBuild; v71obBuild = function (this: any) { bizOrder(); return f0.apply(this, arguments as any); }; }
    } catch (e) { }
    // 画面に出たあとの札の並び（最初の1回は、足す業態が入る前に描かれることがある）
    function sweepBiz() {
        try {
            const k = gk();
            const drop: string[] = (k === "other" && !/ペット/.test(catNow())) ? [] : (BIZ_DROP[k] || []);
            if (!drop.length || typeof V71OB_BIZ === "undefined") return;
            const lab: string[] = V71OB_BIZ.filter((x: any) => drop.indexOf(x[0]) >= 0).map((x: any) => String(x[1]));
            document.querySelectorAll(".v71bz").forEach((p: any) => {
                if (!p || p.dataset.v92r3bBiz) return;
                const kids = Array.from(p.children) as any[];
                const chips = kids.filter((c) => c.hasAttribute("data-v71bz"));
                if (chips.length < 3) return;
                p.dataset.v92r3bBiz = "1";
                const late = chips.filter((c) => { const key = c.getAttribute("data-v71bz") || ""; return drop.indexOf(key) >= 0 || lab.indexOf((c.textContent || "").trim()) >= 0; });
                const lastChip = chips[chips.length - 1];
                if (!late.length || late.every((c) => chips.indexOf(c) >= chips.length - late.length)) return;
                let ref: any = lastChip.nextSibling;
                late.forEach((c) => p.insertBefore(c, ref));
            });
        } catch (e) { }
    }

    /* ═════ (g) 営業資料「見せ方」の判断：地域ごとの一言を、業種に合わせる ═════ */
    const REG_B2B: any = {
        auto: { NA: "年式・稼働時間（走行距離）・整備の記録と写真を先に。規制への適合は、分かる範囲を事実で", EU: "仕様・状態の数字と、現地の規格への対応（登録にある時だけ）を前に", SEA: "仕様・状態（年式・稼働時間・整備の記録）と写真、価格・納期を前に", ME: "返事の速さと、状態の写真・価格を前に" },
        medical: { NA: "規格・認証（取得しているものだけ）と性能の数値を先に。「日本で売れている」だけでは効かない", EU: "現地の規格・表示への対応（登録にある時だけ）と性能の数値を前に", SEA: "規格・認証（取得しているものだけ）と性能の数値、供給の安定・価格帯を前に", ME: "返事の速さと、規格・認証（取得しているものだけ）を前に" },
        industry: { NA: "仕様・規格の数字と、登録・表示への適合（分かる範囲）・実績を先に", EU: "仕様・規格の数字と、現地の規格や表示への対応（登録にある時だけ）を前に", SEA: "仕様・使い方と効果の事実、価格帯・納期を前に", ME: "返事の速さと、仕様・納期を前に" },
    };
    if (typeof v85dkJudgeHtml === "function") {
        const __jh = v85dkJudgeHtml;
        v85dkJudgeHtml = function (this: any) {
            let saved: any = null;
            try {
                if (typeof V85DK_REG !== "undefined" && V85DK_REG) {
                    const k = gk(), d = dd() || {};
                    const B = REG_B2B[k];
                    const noShelf = !/\d/.test(String(d.shelf || d.expiry || "")) && (k === "other" || k === "culture" || k === "living");
                    Object.keys(V85DK_REG).forEach((key) => {
                        const row = V85DK_REG[key];
                        if (!Array.isArray(row)) return;
                        let alt = B ? B[key] : "";
                        if (!alt && noShelf) alt = String(row[1]).replace(/と賞味期限・/, "と").replace(/賞味期限・/, "").replace(/・賞味期限/, "");
                        if (alt && alt !== row[1]) { saved = saved || {}; saved[key] = row; V85DK_REG[key] = [row[0], alt]; }
                    });
                }
            } catch (e) { }
            try {
                let h = __jh.apply(this, arguments as any);
                try {
                    // 内側の層が食品でない型の文に差し替えたあとでも、業種の文にそろえる
                    const k = gk(), B = REG_B2B[k];
                    if (B && typeof h === "string")
                        h = h.replace(/見た目・パッケージで選ばれる。(?:ハラール（取得している時だけ）・)?価格帯を前に/g, B.SEA).replace(/規制への適合（登録・表示）と(?:賞味期限・|使用期限・)?現地での販売実績を先に。「日本で売れている」だけでは効かない/g, B.NA);
                    else if (typeof h === "string" && (k === "other" || k === "culture" || k === "living") && !/\d/.test(String((dd() || {}).shelf || "")))
                        h = h.replace(/（登録・表示）と賞味期限・現地での/g, "（登録・表示）と現地での");
                } catch (e) { }
                return h;
            } finally {
                try { if (saved) Object.keys(saved).forEach((key) => { V85DK_REG[key] = saved[key]; }); } catch (e) { }
            }
        };
    }
    try {
        const rows: string[][] = [];
        const EN: any = { auto: { NA: "Lead with year, operating hours (mileage), maintenance records and photos; state compliance only as far as known", EU: "Lead with specification and condition figures, and conformity with local standards (only if registered)", SEA: "Lead with specification and condition (year, hours, maintenance records), photos, price and delivery", ME: "Lead with fast replies, condition photos and price" }, medical: { NA: "Lead with standards / certifications (only those obtained) and performance figures; “sells well in Japan” alone does not work", EU: "Lead with conformity to local standards and labelling (only if registered) and performance figures", SEA: "Lead with standards / certifications (only those obtained), performance figures, stable supply and price range", ME: "Lead with fast replies and standards / certifications (only those obtained)" }, industry: { NA: "Lead with specification figures, registration / labelling compliance (as far as known) and track record", EU: "Lead with specification figures and conformity to local standards and labelling (only if registered)", SEA: "Lead with specification, usage and factual results, price range and delivery", ME: "Lead with fast replies, specification and delivery" } };
        Object.keys(REG_B2B).forEach((g) => Object.keys(REG_B2B[g]).forEach((r) => rows.push([REG_B2B[g][r], EN[g][r]])));
        dict(rows);
    } catch (e) { }

    /* ═════ (g) ケニアの「初度登録から8年」：年をまたぐときの注意（アプリが持つ決まりの範囲で・要確認） ═════ */
    try {
        if (typeof V56TARIFF_T !== "undefined" && V56TARIFF_T && typeof V56TARIFF_T.KE_A_OK === "string" && V56TARIFF_T.KE_A_OK.indexOf("年が替わる") < 0) {
            const old = V56TARIFF_T.KE_A_OK;
            const addJa = "年数は初度登録の年で数えるため、年が替わると1年進みます。船積み・到着が年をまたぐ予定のときは、その時点でも条件に合うかを、輸入者・KRA の最新の案内で確かめてください（要確認）。";
            V56TARIFF_T.KE_A_OK = old + addJa;
            try {
                ["en", "zh", "es"].forEach((l) => { const dct = I18N && I18N.dict && I18N.dict[l]; if (dct && dct[old]) dct[V56TARIFF_T.KE_A_OK] = dct[old] + (l === "en" ? " The age is counted by the year of first registration, so it advances by one when the year changes. If shipment or arrival will cross the year end, confirm with the importer and KRA's latest guidance that the vehicle still qualifies at that time (please confirm)." : l === "zh" ? " 年数按首次登记年份计算，跨年后会增加一年。如装船或到港跨年，请向进口商和 KRA 的最新指引确认届时是否仍符合条件（需确认）。" : " La antigüedad se cuenta por el año de primera matriculación; si el embarque o la llegada cruzan el fin de año, confirme con el importador y la KRA que el vehículo sigue cumpliendo (por confirmar)."); });
            } catch (e) { }
        }
    } catch (e) { }

    /* ═════ (g) 書類の「出どころ」：調べた人のメモ（「…は時間切れで開けなかった」）を出さない ═════ */
    try {
        if (typeof V85DOC_D !== "undefined" && V85DOC_D) {
            const clean = (s: string) => s.replace(/。?\s*[^。（）()／]*時間切れで開けなかった/g, "").replace(/（理由：\s*）/g, "");
            const walk = (o: any, depth: number) => {
                if (!o || depth > 6) return;
                if (Array.isArray(o)) { o.forEach((v, i) => { if (typeof v === "string") { if (v.indexOf("時間切れ") >= 0) o[i] = clean(v); } else walk(v, depth + 1); }); return; }
                if (typeof o === "object") Object.keys(o).forEach((k) => { const v = o[k]; if (typeof v === "string") { if (v.indexOf("時間切れ") >= 0) o[k] = clean(v); } else walk(v, depth + 1); });
            };
            walk(V85DOC_D, 0);
        }
    } catch (e) { }

    /* ═════ (d) 機械情報表（成分・仕様の表／寸法の表）の値を「建設機械の項目」に入れる ═════ */
    if (typeof v68pAbsorb === "function") {
        const __ab = v68pAbsorb;
        v68pAbsorb = function (this: any, t: any) {
            let ch = __ab.apply(this, arguments as any);
            try {
                if (t && (t.src === "upload" || t.src === "sample2") && String(t.cat || "") === "建設機械" && typeof V68P_G !== "undefined" && V68P_G && V68P_G.v92mach) {
                    const A = t.v68attrs || {}, S = t.v68src || {};
                    const rows = ([] as any[]).concat(t.compRows || [], t.specRows || []).filter(Array.isArray);
                    const dims = (t.dimRows || []).filter(Array.isArray);
                    const val = (r: any[]) => r.slice(1).map((x) => String(x == null ? "" : x).trim()).filter(Boolean);
                    const find = (re: RegExp, src: any[]) => { const r = src.find((x) => re.test(NK(x[0] || ""))); return r ? val(r) : null; };
                    const get: any = {
                        mcHours: () => { const v = find(/稼働時間|稼動時間|アワー|hour\s*meter/i, rows); return v && v[0] ? v[0].replace(/(\d)\s*h$/i, "$1時間") : ""; },
                        mcSerial: () => { const v = find(/機番|シリアル|serial|製造番号|車台番号/i, rows); return v && v[0] ? v[0] : ""; },
                        mcWeight: () => {
                            const out: string[] = [];
                            const w = find(/質量|重量|weight/i, dims) || find(/質量|重量|weight/i, rows);
                            const l = find(/全長|寸法|輸送時|L\s*[×x]\s*W/i, dims);
                            if (w && w[0] && !/寸法/.test(NK((dims.find((x: any) => /質量|重量|weight/i.test(NK(x[0] || ""))) || [""])[0]))) out.push(w[0]);
                            if (l && l[0]) out.push(l[0]);
                            return Array.from(new Set(out)).join("・");
                        },
                        mcEmission: () => {
                            const v = find(/排出?ガス|emission/i, rows);
                            if (v && v[0]) return v[0];
                            for (const r of rows) for (const c of val(r)) { const m = c.match(/排出?ガス\s*[:：]?\s*(.+)/); if (m) return m[1].trim(); }
                            return "";
                        },
                        mcCond: () => {
                            const out: string[] = [];
                            rows.forEach((r) => { const l = NK(r[0] || ""); if (/整備|足回り|点検|メンテ/.test(l)) { const v = val(r); if (v[0]) out.push(String(r[0]).trim() + " " + v[0]); } });
                            return out.join("・");
                        },
                    };
                    V68P_G.v92mach.f.forEach((f: any) => {
                        if (!get[f.k] || S[f.k] === "手入力" || String(A[f.k] || "").trim()) return;
                        const v = String(get[f.k]() || "").trim();
                        if (!v) return;
                        if (typeof v68pSetF === "function") v68pSetF(t, f, v, "表");
                        else { t.v68attrs = t.v68attrs || {}; t.v68attrs[f.k] = v; }
                        ch = true;
                    });
                }
            } catch (e) { }
            return ch;
        };
    }

    /* ═════ 商品情報「業種ごとの項目（その他）」：足した商材カテゴリー（農業資材・文化・教育用品 など）は、その名前で出す（indagri-N13） ═════ */
    if (typeof v68pIndLabel === "function") {
        const __il = v68pIndLabel;
        v68pIndLabel = function (this: any) {
            let r = __il.apply(this, arguments as any);
            try {
                const c = catNow();
                if (r === "その他" && c && c !== "その他" && c !== "中古品" && typeof W.v92catGroupOf === "function" && W.v92catGroupOf(c)) r = c;
            } catch (e) { }
            return r;
        };
    }

    /* ═════ 英語の文面：英数字の間の中黒（BFE・PFE・VFE）を「, 」に（medical-M09） ═════ */
    const dotFix = (s: any) => { if (typeof s !== "string") return s; let p = ""; while (p !== s) { p = s; s = s.replace(/([\x21-\x7e])・(?=[\x21-\x7e])/g, "$1, "); } return s; };
    try {
        if (typeof v71obTpl === "function") { const f0 = v71obTpl; v71obTpl = function (this: any) { const r = f0.apply(this, arguments as any); try { if (typeof r === "string") return dotFix(r); if (r && typeof r === "object") { ["body", "subject", "b", "s", "text"].forEach((k) => { if (typeof r[k] === "string") r[k] = dotFix(r[k]); }); } } catch (e) { } return r; }; }
        if (typeof dmTemplateEN === "function") { const f0 = dmTemplateEN; dmTemplateEN = function (this: any) { const r = f0.apply(this, arguments as any); try { if (typeof r === "string") return dotFix(r); if (r && typeof r === "object") { ["body", "subject", "b", "s", "text"].forEach((k) => { if (typeof r[k] === "string") r[k] = dotFix(r[k]); }); } } catch (e) { } return r; }; }
    } catch (e) { }

    /* ═════ (f) 入力例・言葉：商品の単位・国に合わせる ═════ */
    function unitNow() { const m = NK((dd() || {}).moq || "").match(/[\d,]+\s*([^\d\s（(〜~]+)/); return m ? m[1] : ""; }
    function firstPrice() {
        try {
            const d = dd() || {};
            for (const r of (d.priceRows || [])) { if (!Array.isArray(r)) continue; for (let i = 1; i < r.length; i++) { const m = NK(r[i] || "").match(/(US\$|¥|￥|€)\s?[\d,]+(?:\.\d+)?/); if (m) return m[0].replace("￥", "¥"); } }
        } catch (e) { }
        return "";
    }
    function sweepEx() {
        try {
            const u = unitNow(), q = X.exQty(), k = gk();
            const t = ten() || {}, d = dd() || {};
            const tg = String((t.targets || Object.keys(d.regs || {}) || [])[0] || "");
            const setPh = (id: string, from: string, to: string) => { const el: any = document.getElementById(id); if (el && el.getAttribute("placeholder") === from && to && to !== from) { el.setAttribute("placeholder", to); el.setAttribute("data-noi18n", ""); } };
            if (u && u !== "個") {
                const p = firstPrice();
                setPh("dfP", "例：US$10.50/個", M("例：", "e.g. ") + (p || "US$10.50") + "/" + u);
                setPh("dfL", "例：初回500個", M("例：初回", "e.g. first order ") + (q || "500" + u));
            }
            if (k === "auto") setPh("dfSpec", "例：小容量パッケージ・英語ラベル希望", M("例：年式・稼働時間（走行距離）・色などの希望", "e.g. preferred year, hours (mileage), colour"));
            else if (k === "industry" || k === "medical") setPh("dfSpec", "例：小容量パッケージ・英語ラベル希望", M("例：規格・仕様・数量の希望（試験成績書の要否 など）", "e.g. required standard, specification, quantity (test report needed, etc.)"));
            if (tg && tg !== "香港") setPh("k30nn", "例：香港向けラベルの英訳を確認する", M(`例：${tg}向けの見積書の内容を確認する`, `e.g. Check the quotation for ${tg}`));
            const cap: any = document.getElementById("v88cap");
            if (cap && u && u !== "本" && !cap.dataset.v92r3b) {
                const ph = cap.getAttribute("placeholder") || "";
                if (/3,000本/.test(ph)) { cap.dataset.v92r3b = "1"; const n = /^(台|基|機|セット)$/.test(u) ? "5" : "3,000"; cap.setAttribute("placeholder", ph.replace("3,000本", n + u)); cap.setAttribute("data-noi18n", ""); }
            }
        } catch (e) { }
        // 文字の言い換え（葉の文字だけ・決まった文だけ）
        try {
            const k = gk(), q = X.exQty();
            const rep: Array<[RegExp, string]> = [[/Ver\.1 のバイヤー情報と同じ項目です。/, ""]];
            if (q && !/個$/.test(q)) rep.push([/「500個でいくら？」/, `「${q}でいくら？」`]);
            if (k === "auto") rep.push([/^成分・原材料・仕様（表）/, "仕様・状態（表）"]);
            else if (k === "medical" || k === "industry") rep.push([/^成分・原材料・仕様（表）/, "仕様・材質（表）"]);
            const cat0 = catNow();
            if (cat0 && cat0 !== "その他") rep.push([/業種ごとの項目（その他）/, `業種ごとの項目（${cat0}）`]);
            const hot = /Ver\.1 のバイヤー情報|500個でいくら|成分・原材料・仕様（表）|業種ごとの項目（その他）/;
            const todo: any[] = [];
            document.querySelectorAll("#welv, #dw, .stage").forEach((root: any) => {
                if (!hot.test(root.textContent || "")) return;
                const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
                let n: any;
                while ((n = w.nextNode())) { const v = String(n.nodeValue || ""); if (hot.test(v)) todo.push(n); }
            });
            todo.forEach((n2) => {
                const pe = n2.parentElement;
                if (!pe || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(pe.tagName)) return;
                let v = String(n2.nodeValue || ""), v0 = v;
                rep.forEach(([re, to]) => { v = v.replace(re, to); });
                if (v !== v0) { n2.nodeValue = v; pe.setAttribute("data-noi18n", ""); }
            });
        } catch (e) { }
    }

    (W.__v92r3bSweeps = W.__v92r3bSweeps || []).push(sweepBan, sweepBiz, sweepEx);
    try { X.kick(); } catch (e) { }
})();
