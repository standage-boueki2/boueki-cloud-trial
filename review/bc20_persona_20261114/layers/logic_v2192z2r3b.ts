/* 21.92 r3b：3回目の評価の残り（内容と表示）
   (a) 価格表の1列目が稼働時間・走行距離・年式の帯のとき、商談の「価格と条件の差」と AI の答えも、商品の値で行を当てる（auto-N05・N08）。
       1列目が型番のときは、記録の品目の行と比べる（決められないときは幅で示す）（indagri-M05）。円の価格表と US$ の希望を比べたときも換算を書く（culture-N12）
   (c) 関税率：商品の HS とひな形の代表品目の HS が違うとき、数字を主に出さず「要確認（別の品目の目安：◯%）」にそろえる（daily-N05・M08・health-M16・medical P3）
   (f) AI商社マン：用語集にある語は用語集から答える（medical-M07）。聞き方の例を登録の国・単位に（auto-08）
   (g) 用語集に 抹消・RORO・フラットラック・船積前検査・該非判定・リスト規制・キャッチオール規制（auto-M07・indagri-N13）。用語を登録すると Bahasa Indonesia の列が出る（auto-M04）
   ほかは下の各節の頭に書く。数字・規制の中身は足していない（一般的な用語の説明だけ） */
declare const TEN: any, TENS: any, D: any, GL: any, I18N: any, BCACT: any, V33GL_LANG: any, NEED: any;
declare let v56dTier: any, v56dMoney: any, v56dUsd: any;
declare let brain: any, v56dCmp: any, v56dCmpParts: any, v56dCmpHtml: any, v56dCmpPlain: any, ctyWhyLocal: any, v56rqGlSync: any, render: any, go: any, rItem: any;
declare let v56rqGlCfg: any, pickCountry: any, lang: any, opsTab: any, opsRegC: any;
(function () {
    const W: any = window;
    if (W.__v2192r3b) return;
    W.__v2192r3b = 1;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const LG = () => { try { return (typeof I18N !== "undefined" && I18N && I18N.lang) || document.documentElement.lang || "ja"; } catch (e) { return "ja"; } };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = String(LG()).slice(0, 2); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const dict = (rows: string[][]) => { try { if (typeof I18N === "undefined" || !I18N || !I18N.dict) return; rows.forEach((r) => { if (r[1]) { I18N.dict.en = I18N.dict.en || {}; if (!I18N.dict.en[r[0]]) I18N.dict.en[r[0]] = r[1]; } if (r[2]) { I18N.dict.zh = I18N.dict.zh || {}; if (!I18N.dict.zh[r[0]]) I18N.dict.zh[r[0]] = r[2]; } if (r[3]) { I18N.dict.es = I18N.dict.es || {}; if (!I18N.dict.es[r[0]]) I18N.dict.es[r[0]] = r[3]; } }); } catch (e) { } };
    const ten = () => { try { return typeof TEN !== "undefined" ? TEN : null; } catch (e) { return null; } };
    const dd = () => { try { return typeof D !== "undefined" ? D : null; } catch (e) { return null; } };
    const NK = (s: any) => String(s == null ? "" : s).normalize("NFKC");
    const fmtN = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
    const bandOf = (t: any) => { try { return typeof W.v92docsBandOf === "function" ? W.v92docsBandOf(t) : null; } catch (e) { return null; } };
    const BAND_JA: any = { km: "走行距離", hour: "稼働時間", year: "年式" };
    const BAND_EN: any = { km: "mileage", hour: "operating hours", year: "model year" };
    const bandIdx = (B: any) => (B ? (B.chosen >= 0 ? B.chosen : B.auto) : -1);
    const bandNm = (B: any) => M(BAND_JA[B.kind] || B.head, BAND_EN[B.kind] || B.head);

    /* ═════ (a) 商談の「価格と条件の差」：数量でない帯は商品の値で、型番の表は記録の品目で当てる ═════ */
    const QTY_HEAD = /数量|ロット|qty|quantity|個数|本数|枚数|台数|MOQ|発注|注文/i;
    const looksTier = (lab: string) => { const s = NK(lab).replace(/,/g, "").trim(); return /^[\d.]+\s*[^\dA-Za-z]{0,6}\s*([〜~～\-]|以上|以下|未満|まで|\+)/.test(s) || /^[〜~～]\s*[\d.]+/.test(s) || /^[\d.]+\s*(個|本|枚|台|箱|袋|kg|g|セット|ケース|缶|瓶|着|点|pcs|units?|cartons?|トン|t)(?![a-z])/i.test(s); };
    if (typeof v56dCmp === "function") {
        const __c = v56dCmp;
        v56dCmp = function (this: any, rec: any) {
            const c = __c.apply(this, arguments as any);
            try {
                const d = dd();
                if (!c || !d || !Array.isArray(d.priceRows)) return c;
                const B = bandOf(d);
                if (B) {
                    const i = bandIdx(B);
                    let pick: any = null;
                    if (i >= 0 && Array.isArray(d.priceRows[i])) { const lab = String(d.priceRows[i][0] == null ? "" : d.priceRows[i][0]); pick = c.rows.find((r: any) => String(r.label) === lab) || null; }
                    c.pick = pick;
                    c.v92band = B;
                    return c;
                }
                const head = NK((d.priceCols || [])[0] || "");
                const labs = c.rows.map((r: any) => String(r.label || ""));
                if (labs.length >= 2 && !QTY_HEAD.test(head) && labs.filter(looksTier).length * 2 < labs.length) {
                    // 1列目が型番・品名の表：数量では引かない。記録に書いてある型番の行だけを当てる
                    const txt = NK(JSON.stringify([rec && rec.item, rec && rec.prod, rec && rec.sku, rec && rec.spec, rec && rec.note, rec && rec.memo, rec && rec.t, rec && rec.title].filter(Boolean))).toLowerCase().replace(/\s+/g, "");
                    let pick: any = null;
                    c.rows.forEach((r: any) => { const k = NK(r.label).toLowerCase().replace(/\s+/g, ""); if (k.length >= 3 && txt.indexOf(k) >= 0 && (!pick || k.length > NK(pick.label).length)) pick = r; });
                    if (!pick) { const txt2 = NK([d.item, d.sku].filter(Boolean).join(" ")).toLowerCase().replace(/\s+/g, ""); c.rows.forEach((r: any) => { const k = NK(r.label).toLowerCase().replace(/\s+/g, ""); if (k.length >= 3 && txt2.indexOf(k) >= 0 && (!pick || k.length > NK(pick.label).length)) pick = r; }); }
                    // 列が数量帯（〜99・100〜499 …）の表なら、記録の数量に当たる列の値で比べる
                    try {
                        if (pick && c.lotN && typeof v56dTier === "function" && typeof v56dMoney === "function" && typeof v56dUsd === "function") {
                            const row = d.priceRows.find((r: any) => Array.isArray(r) && String(r[0]) === String(pick.label));
                            const cols = d.priceCols || [];
                            if (row) for (let i = 1; i < row.length; i++) {
                                const tr = v56dTier(cols[i]);
                                const m = v56dMoney(String(row[i] == null ? "" : row[i]));
                                if (tr && m && /\d/.test(NK(cols[i] || "")) && !/MOQ|リード|lead/i.test(NK(cols[i] || "")) && (tr.min == null || c.lotN >= tr.min) && (tr.max == null || c.lotN <= tr.max)) {
                                    pick = { label: String(pick.label) + "・" + String(cols[i]), m, usd: v56dUsd(m, c.fx), tier: tr };
                                    break;
                                }
                            }
                        }
                    } catch (e) { }
                    c.pick = pick;
                    c.v92sku = 1;
                }
            } catch (e) { }
            return c;
        };
    }
    if (typeof v56dCmpParts === "function") {
        const __p = v56dCmpParts;
        v56dCmpParts = function (this: any, c: any) {
            const P = __p.apply(this, arguments as any);
            try {
                // 自社の価格表が円など・先方が US$ のときも、換算に使ったレートを書く（culture-N12）
                if (P && c && !P.fx && c.busd != null) {
                    const fx = c.fx || {}, r = fx.rates || {};
                    const cur = (c.rows.map((x: any) => x.m && x.m.cur).filter((x: string) => x && x !== "USD") as string[])[0];
                    if (cur && r[cur] && r.USD)
                        P.fx = (cur === "JPY" ? "" : "1 " + cur + "＝" + r[cur] + "円・") + "1 US$＝" + r.USD + "円（" + (fx.live ? "今日の仲値" : "参照レート " + (fx.at || "")) + "）";
                }
            } catch (e) { }
            return P;
        };
    }
    const cmpLabel = (c: any) => {
        if (!c) return null;
        if (c.v92band) {
            const B = c.v92band, nm = bandNm(B);
            if (c.pick) return { head: M(`${nm}（${B.valTxt || String(c.pick.label)}）に当たる価格`, `Price for the ${nm} band (${B.valTxt || String(c.pick.label)})`), note: M(`価格表は「${B.head}」ごとです（数量では変わりません）。`, `The price list is by “${B.head}”, not by quantity.`) };
            return { head: "", note: M(`価格表は「${B.head}」ごとです（数量では変わりません）。この商品の${nm}が登録に無いため、どの行に当たるかを決めず、価格表の幅と比べています。`, `The price list is by “${B.head}”, not by quantity. The ${nm} of this product is not registered, so the comparison uses the whole range.`) };
        }
        if (c.v92sku) {
            if (c.pick) return { head: M(`品目（${String(c.pick.label).split("・")[0]}）${c.lot && String(c.pick.label).indexOf("・") > 0 ? "・数量（" + c.lot + "）" : ""}に当たる価格`, `Price for the item (${String(c.pick.label)})`), note: "" };
            return { head: "", note: M("価格表は品目（型番）ごとです。記録にどの品目かが書かれていないため、価格表の幅と比べています。", "The price list is by item (model). The record does not say which item, so the comparison uses the whole range.") };
        }
        return null;
    };
    if (typeof v56dCmpHtml === "function") {
        const __h = v56dCmpHtml;
        v56dCmpHtml = function (this: any, c: any) {
            let h = __h.apply(this, arguments as any);
            try {
                const L = cmpLabel(c);
                if (L && typeof h === "string" && h) {
                    if (L.head) h = h.replace(`<span>数量（${E(c.lot)}）に当たる価格</span>`, `<span data-noi18n>${E(L.head)}</span>`);
                    if (L.note) h = h.replace(/<br><span class="nn" style="margin:0">/, `<br><span data-noi18n>${E(L.note)}</span>$&`);
                }
            } catch (e) { }
            return h;
        };
    }
    if (typeof v56dCmpPlain === "function") {
        const __q = v56dCmpPlain;
        v56dCmpPlain = function (this: any, c: any) {
            let s = __q.apply(this, arguments as any);
            try {
                const L = cmpLabel(c);
                if (L && typeof s === "string" && s) {
                    if (L.head) s = s.replace(`数量（${c.lot}）に当たる価格`, L.head);
                    if (L.note) s += "\n" + L.note;
                }
            } catch (e) { }
            return s;
        };
    }

    /* ═════ (c) 関税率：別の品目の目安のときは「要確認（別の品目の目安：◯%）」 ═════ */
    const RE_MIS = /（別の品目〈([^〉]*)〉の目安・要確認）/;
    if (typeof ctyWhyLocal === "function") {
        const __cw = ctyWhyLocal;
        ctyWhyLocal = function (this: any, r: any) {
            let s = __cw.apply(this, arguments as any);
            try {
                const m = typeof s === "string" ? s.match(RE_MIS) : null;
                if (m) {
                    const f = (r && r.facts) || {};
                    const duty = String(f.duty || "");
                    const rate = (duty.match(/[\d.]+\s*%/) || [""])[0].replace(/\s/g, "");
                    const epa = /EPA|FTA|協定/.test(duty) ? "・EPA" : "";
                    const lead = f.lead && f.lead !== "要確認" ? "・" + String(f.lead).replace(/^通関\s*/, "通関") : "";
                    const rest = s.indexOf("／") >= 0 ? s.slice(s.indexOf("／")) : "";
                    if (rate) s = `関税 要確認（別の品目の目安 ${rate}${epa}）` + lead + rest;
                }
            } catch (e) { }
            return s;
        };
    }
    dict([["関税 要確認（別の品目の目安 ", "Duty to be confirmed (guide for another item "]]);
    function sweepDuty() {
        try {
            // 規制を調べる：関税率の枠（ops の層が「カテゴリーの代表的な品目…の目安です」を足した所）
            document.querySelectorAll(".v92o-dn").forEach((p: any) => {
                const cell = p.parentElement;
                if (!cell || cell.dataset.v92r3b) return;
                cell.dataset.v92r3b = "1";
                const mm = (p.textContent || "").match(/（([^（）]*?)・HS\s*([\d.]+)）/) || (p.textContent || "").match(/\(()HS\s*([\d.]+)\)/);
                // 値：枠の中で、注記の外にある最初の「◯%」
                const w0 = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
                let n0: any, rate = "";
                while ((n0 = w0.nextNode())) {
                    if (p.contains(n0) || !/[\d.]+\s*%/.test(String(n0.nodeValue || ""))) continue;
                    const pe = n0.parentElement;
                    const lab = M("要確認", "To be confirmed", "需确认", "Por confirmar");
                    if (pe && pe !== cell && !pe.contains(p)) { rate = (pe.textContent || "").replace(/\s+/g, " ").trim(); pe.textContent = lab; pe.setAttribute("data-noi18n", ""); pe.setAttribute("data-v92r3b-old", rate); }
                    else { rate = String(n0.nodeValue || "").trim(); n0.nodeValue = lab; }
                    break;
                }
                if (!rate) { delete cell.dataset.v92r3b; return; }
                p.textContent = M(`別の品目${mm && mm[1] ? `（${mm[1]}・HS ${mm[2]}）` : ""}の目安：${rate}。この商品の HS コードでの税率は、相手国の関税率表で確かめてください。`, `Guide for another item${mm ? ` (HS ${mm[2]})` : ""}: ${rate}. Check the destination's tariff schedule for the rate under this product's HS code.`, `其他品目${mm ? `（HS ${mm[2]}）` : ""}的参考值：${rate}。请查阅对方国家税则确认本商品 HS 编码的税率。`, `Orientativo de otro producto${mm ? ` (HS ${mm[2]})` : ""}: ${rate}. Consulte el arancel del país de destino para este código HS.`);
            });
            // 商品情報：通関統計コネクトの表（content の層が注記を足した行）
            document.querySelectorAll(".v56tariff-bench .v56tariff-tc .v92ct-ref").forEach((p: any) => {
                const tc = p.parentElement;
                if (!tc || tc.dataset.v92r3b) return;
                tc.dataset.v92r3b = "1";
                const w = document.createTreeWalker(tc, NodeFilter.SHOW_TEXT);
                let n: any, rate = "";
                while ((n = w.nextNode())) {
                    if (p.contains(n)) continue;
                    const m = String(n.nodeValue || "").match(/[\d.]+\s*%/);
                    if (m) { rate = m[0].replace(/\s/g, ""); n.nodeValue = String(n.nodeValue).replace(/[\d.]+\s*%/, M("要確認", "to be confirmed", "需确认", "por confirmar")); if (n.parentElement) n.parentElement.setAttribute("data-noi18n", ""); break; }
                }
                if (rate) p.textContent = M(`別の品目の目安：${rate}（この商品の税率は未確認）`, `Guide for another item: ${rate} (rate for this product not confirmed)`, `其他品目的参考值：${rate}（本商品税率未确认）`, `Orientativo de otro producto: ${rate} (sin confirmar para este producto)`);
            });
            document.querySelectorAll(".v56tariff-bench .v56tariff-lc .v92ct-ref").forEach((p: any) => {
                if (p.dataset.v92r3b) return;
                p.dataset.v92r3b = "1";
                p.textContent = M("別の品目の関税率で計算した参考の値です（価格の決定には使わない）。", "Reference value calculated with another item's duty rate (do not use for pricing).", "按其他品目税率计算的参考值（请勿用于定价）。", "Valor de referencia con el arancel de otro producto (no usar para fijar precios).");
            });
        } catch (e) { }
    }

    /* ═════ (g) 用語集：この業種の書類・輸出管理で使う言葉（一般的な説明だけ） ═════ */
    try {
        if (typeof GL !== "undefined" && GL) {
            const add: string[][] = [
                ["輸出抹消仮登録証明書", "日本で登録されていた自動車を輸出するために、運輸支局で「輸出抹消仮登録」の手続きをすると交付される書類です（「抹消」と略して呼ばれます）。中古車の輸出通関で使います。有効期間があるので、船積みの予定に合わせて取ります（手続きの決まりは運輸支局・通関業者に要確認）。", "A certificate issued by the Japanese transport bureau when a registered vehicle is deregistered for export. It is used for export customs clearance of used vehicles and has a validity period (confirm the procedure with the transport bureau or your customs broker)."],
                ["RORO船", "Roll-on/Roll-off の略。車両や建設機械を、クレーンで吊らずに、自走またはけん引で積み降ろしする船です。コンテナに入らない車両・機械の輸送でよく使われます。", "Roll-on/Roll-off vessel: vehicles and machinery are driven or towed on and off the ship instead of being lifted by crane. Common for vehicles and machines that do not fit in a container."],
                ["フラットラックコンテナ", "屋根と側面の壁が無いコンテナ。普通のコンテナに入らない大きさ・重さの機械などを載せて運びます。", "A container without a roof or side walls, used for machinery and other cargo too large or heavy for a standard container."],
                ["船積前検査（PSI）", "輸出の前に、輸入国が指定する検査機関が、品物の品質・数量や、その国の基準に合うかを確かめる検査（Pre-Shipment Inspection）。中古車では、輸入国によって、走行できる状態か・年式などの検査が求められます。対象と検査機関は国ごとに違います（要確認）。", "Pre-shipment inspection: before export, an inspection body designated by the importing country checks quality, quantity and conformity with that country's standards. For used vehicles some countries require checks such as roadworthiness and age. Scope and inspection bodies differ by country (please confirm)."],
                ["該非判定", "輸出する品物や技術が、外為法の輸出規制（リスト規制）の対象に当たるか（該当）、当たらないか（非該当）を判定すること。メーカーが出す「該非判定書」で確かめるのが一般的です。", "Classification under Japan's export control: determining whether goods or technology are covered by the control list (“applicable”) or not (“not applicable”), usually confirmed with the manufacturer's classification certificate."],
                ["リスト規制", "外為法にもとづく輸出規制のひとつ。武器や、軍事に転用できる性能の高い品物・技術を法令のリストで定め、当たるものの輸出には経済産業大臣の許可が要ります。当たるかどうかは「該非判定」で確かめます。", "List control under Japan's Foreign Exchange and Foreign Trade Act: weapons and high-performance dual-use goods and technology are listed by law, and exporting listed items requires a licence from METI. Whether an item is listed is confirmed by classification."],
                ["キャッチオール規制", "リスト規制に当たらない品物でも、大量破壊兵器や通常兵器の開発などに使われるおそれがあるときは、輸出に経済産業大臣の許可が要る、という規制です。用途と相手先（需要者）を確かめます。", "Catch-all control: even for items not on the control list, a METI licence is required when they may be used for developing weapons of mass destruction or conventional weapons. Check the end use and the end user."],
            ];
            add.forEach(([k, v, en]) => {
                const base = k.split("（")[0].replace(/(船|コンテナ)$/, "");
                const has = Object.keys(GL).some((x) => x === k || x.indexOf(base) >= 0);
                if (!has) GL[k] = v;
                dict([[k, k === "RORO船" ? "RORO vessel" : k === "輸出抹消仮登録証明書" ? "Export deregistration certificate" : k === "フラットラックコンテナ" ? "Flat rack container" : k === "船積前検査（PSI）" ? "Pre-shipment inspection (PSI)" : k === "該非判定" ? "Export control classification" : k === "リスト規制" ? "List control" : "Catch-all control"], [v, en]]);
            });
        }
    } catch (e) { }
    // 用語を登録すると「Bahasa Indonesia」の列ができる：言語コード id が、行の番号（id）とぶつかっていた（auto-M04）。自分で足した列でなければ出さない
    if (typeof v56rqGlSync === "function") {
        const __gs = v56rqGlSync;
        v56rqGlSync = function (this: any) {
            const r = __gs.apply(this, arguments as any);
            try {
                if (typeof V33GL_LANG !== "undefined" && Array.isArray(V33GL_LANG)) {
                    const cfg = typeof v56rqGlCfg === "function" ? (v56rqGlCfg() || []) : [];
                    if (cfg.indexOf("id") < 0) { const i = V33GL_LANG.findIndex((x: any) => x && x[0] === "id"); if (i >= 0) V33GL_LANG.splice(i, 1); }
                }
            } catch (e) { }
            return r;
        };
    }

    /* ═════ (f) AI商社マン：用語集から答える・帯の価格・聞き方の例 ═════ */
    const GL_ALIAS: any = { "輸出抹消仮登録証明書": ["抹消", "輸出抹消"], "RORO船": ["RORO", "ローロー"], "フラットラックコンテナ": ["フラットラック"], "船積前検査（PSI）": ["船積み前検査", "船積前検査"], "該非判定": ["該非"], "キャッチオール規制": ["キャッチオール"] };
    const glFind = (q: string) => {
        try {
            if (typeof GL === "undefined" || !GL) return null;
            const nq = NK(q).toLowerCase();
            let best: any = null;
            Object.keys(GL).forEach((k) => {
                const cands = [k].concat(k.split(/[・／\/（）()、,]/)).concat(GL_ALIAS[k] || []).map((x) => NK(x).trim()).filter((x) => x.length >= 2);
                cands.forEach((cn) => {
                    const lc = cn.toLowerCase();
                    let hit = false;
                    if (/^[\x20-\x7e]+$/.test(lc)) { const i = nq.indexOf(lc); hit = i >= 0 && !/[a-z0-9]/.test(nq.charAt(i - 1) || " ") && !/[a-z0-9]/.test(nq.charAt(i + lc.length) || " "); }
                    else hit = nq.indexOf(lc) >= 0;
                    if (hit && (!best || lc.length > best.len)) best = { k, len: lc.length };
                });
            });
            return best ? best.k : null;
        } catch (e) { return null; }
    };
    const T_ = (s: string) => { try { const l = String(LG()).slice(0, 2); return (l !== "ja" && I18N && I18N.dict && I18N.dict[l] && I18N.dict[l][s]) || s; } catch (e) { return s; } };
    function ansGloss(q: string) {
        const k = glFind(q);
        if (!k) return null;
        return {
            a: `<b data-noi18n>${E(T_(k))}</b><br><span data-noi18n>${E(T_(String(GL[k])))}</span><br><br><span class="nn" data-noi18n>${E(M("用語集の説明です。この商品・相手国で必要かどうかは「規制を調べる」で確かめられます。", "From the glossary. Whether it applies to this product and destination can be checked in “Check regulations”."))}</span><br><button class="btn g" type="button" data-act="v92r3b.gloss" data-noi18n>📖 ${E(M("用語集を開く", "Open the glossary"))}</button> <button class="btn g" type="button" data-act="v92ct.reg" data-noi18n>🔎 ${E(M("「規制を調べる」を開く", "Open “Check regulations”"))}</button>`,
            c: M(`根拠：用語集「${k}」。内蔵の答えです`, `Basis: glossary “${k}”. Built-in answer`),
        };
    }
    function exQty() {
        const d = dd() || {};
        const mq = NK(d.moq || "").match(/([\d,]+)\s*([^\d\s（(〜~]+)/);
        if (!mq) return "";
        const n = parseFloat(mq[1].replace(/,/g, ""));
        return (n <= 1 ? "2" : mq[1]) + mq[2];
    }
    function fixEx(s: string) {
        try {
            const d = dd() || {}, t = ten() || {};
            const tg = (t.targets || Object.keys(d.regs || {}) || [])[0] || "";
            const q = exQty();
            if (tg && tg !== "香港") s = s.split("<b>香港</b>の関税は？").join(`<b>${E(tg)}</b>の関税は？`);
            if (q && !/袋/.test(q)) s = s.split("<b>500袋</b>だといくら？").join(`<b>${E(q)}</b>だといくら？`);
        } catch (e) { }
        return s;
    }
    function bandAnswer(r: any, q: string) {
        try {
            const d = dd();
            const B = d ? bandOf(d) : null;
            if (!B || !r || typeof r.a !== "string" || !/の価格です/.test(r.a)) return r;
            const re = /<b>[^<]*<\/b>(?:（[^）]*）)?の価格です(?:（[^）]*）)?。[\s\S]*?(?=<br><br>|$)/;
            const m0 = r.a.match(re);
            if (!m0) return r;
            // 見出しのすぐ後ろの「◯◯ごとの価格…」の段も入れ替える
            let cut = r.a.indexOf(m0[0]) + m0[0].length;
            const tail = r.a.slice(cut);
            const m1 = tail.match(/^<br><br><b>[^<]*(?:ごとの価格|数量帯ごとの単価)[\s\S]*?(?=<br><br>|$)/);
            if (m1) cut += m1[0].length;
            const nm = bandNm(B), i = bandIdx(B);
            const hit = i >= 0 ? B.rows.find((x: any) => x.idx === i) : null;
            let a = `<b>${E(String(d.item || M("この商品", "This product")))}</b>${E(M(`の価格です。価格は「${B.head}」ごとに決まります（数量では変わりません）。`, `: the price depends on “${B.head}” (not on quantity).`))}<br><br>` +
                B.rows.map((x: any) => { const s2 = `${E(x.label)}：<b>${E(x.v)}</b>`; return x === hit ? `<span style="background:var(--good-soft,#e7f5ec);border-radius:4px;padding:0 4px">${s2}</span>` : s2; }).join("　／　");
            if (hit) {
                a += `<br><br>${E(M(`この商品の${nm}（${B.valTxt || hit.label}）に当たるのは`, `For this product's ${nm} (${B.valTxt || hit.label}) the row is`))} <b>${E(hit.label)}</b>：<b>${E(hit.v)}</b>${d.term ? E(`（${String(d.term).split(/\s/)[0]}）`) : ""}${B.chosen >= 0 ? E(M("（「書類をつくる」で選んだ行）", " (row chosen in “Create documents”)")) : ""}`;
                const mq = NK(q || "").match(/([\d,]+)\s*(台|個|本|箱|袋|枚|セット|ケース|缶|瓶|着|点|kg|トン|units?)/);
                const n = mq ? parseFloat(mq[1].replace(/,/g, "")) : 0;
                const up = parseFloat(String(hit.v).replace(/[^\d.]/g, ""));
                if (n > 1 && up > 0) {
                    const sym = /¥|￥|円/.test(String(hit.v)) ? "¥" : (String(hit.v).match(/^[A-Z]{0,3}\$|^€/) || ["US$"])[0];
                    a += `<br><br><span class="v92ct-total"><b>${E(M("合計の目安", "Estimated total"))}</b>　${E(hit.v)} × ${E(mq![1] + mq![2])} ＝ <b>${E(sym + fmtN(up * n))}</b>${E(M(`（同じ${nm}の帯のものを ${mq![1]}${mq![2]}とした場合。1${mq![2]}ごとに状態が違うときは、それぞれの帯の価格を足します。運賃・保険・相手国の税は含みません）`, ` (assuming ${mq![1]} units in the same band; if each unit differs, add the price of each band. Freight, insurance and destination taxes not included)`))}</span>`;
                }
            } else {
                const mq2 = NK(q || "").match(/([\d,]+)\s*(台|個|本|箱|袋|枚|セット|ケース|缶|瓶|着|点|kg|トン|units?)/);
                const n2 = mq2 ? parseFloat(mq2[1].replace(/,/g, "")) : 0;
                const ups = B.rows.map((x: any) => parseFloat(String(x.v).replace(/[^\d.]/g, ""))).filter((x: number) => x > 0);
                if (n2 > 1 && ups.length) {
                    const v0 = String(B.rows[0].v), sym = /¥|￥|円/.test(v0) ? "¥" : (v0.match(/^[A-Z]{0,3}\$|^€/) || ["US$"])[0];
                    a += `<br><br><span class="v92ct-total"><b>${E(M("合計の目安", "Estimated total"))}</b>　${E(mq2![1] + mq2![2])}${E(M("で", ": "))} <b>${E(sym + fmtN(Math.min(...ups) * n2))}〜${E(sym + fmtN(Math.max(...ups) * n2))}</b>${E(M(`（どの${nm}の帯に当たるかで変わります。運賃・保険・相手国の税は含みません）`, ` (depends on the ${nm} band; freight, insurance and destination taxes not included)`))}</span>`;
                }
                a += `<br><br>${E(M(`この商品の${nm}が登録に無いため、どの行に当たるかを決められません。商品情報に${nm}を入れるか、「書類をつくる」で価格表の行を選んでください。`, `The ${nm} of this product is not registered, so the row cannot be determined. Add it in Product information or choose the row in “Create documents”.`))}`;
            }
            r.a = r.a.slice(0, r.a.indexOf(m0[0])) + `<span data-noi18n>${a}</span>` + r.a.slice(cut);
        } catch (e) { }
        return r;
    }
    if (typeof brain === "function") {
        const __b = brain;
        brain = function (this: any, q: any, opts: any) {
            const raw = String((opts && opts.raw) || q || "");
            const res = __b.apply(this, arguments as any);
            const fin = (r: any) => {
                try {
                    if (r && typeof r.a === "string") {
                        if (/その質問には答えられませんでした/.test(r.a) || (/(って|とは|の意味|って何|とは何|what is|meaning of)/i.test(raw) && raw.length <= 40 && !/の価格です|関税率/.test(r.a))) {
                            const g = ansGloss(raw);
                            if (g) return g;
                        }
                        r.a = fixEx(r.a);
                        r = bandAnswer(r, raw);
                        r = dutyAnswer(r);
                    }
                } catch (e) { }
                return r;
            };
            if (res && typeof res.then === "function") return res.then(fin);
            return fin(res);
        };
    }
    // AI の答えの「関税率 12.5% ⚠ 関税率は、カテゴリーの代表的な品目…」→ 数字を主にしない
    function dutyAnswer(r: any) {
        try {
            if (!r || typeof r.a !== "string" || !/カテゴリーの代表的な品目（/.test(r.a)) return r;
            const m = r.a.match(/カテゴリーの代表的な品目（([^）]*?)・HS\s*([\d.]+)）/);
            if (!m) return r;
            let done = 0;
            r.a = r.a.replace(/(関税率\s*(?:<\/[a-z]+>|<[a-z][^>]*>|\s|：|:)*)([\d.]+\s*%(?:（[^（）]*）)?)/, (_all: string, pre: string, rate: string) => { done = 1; return `${pre}<span data-noi18n>${E(M(`要確認（別の品目〈${m[1]}・HS ${m[2]}〉の目安：${rate}）`, `to be confirmed (guide for another item, HS ${m[2]}: ${rate})`))}</span>`; });
            if (done) r.a = r.a.replace(/関税率は、カテゴリーの代表的な品目（[^）]*）の目安です。この商品（HS ([\d.]+)）の税率は未確認です。相手国の関税率表で確かめてください（要確認）。/, M("この商品（HS $1）の税率は未確認です。相手国の関税率表で確かめてください。", "The rate for this product (HS $1) has not been confirmed — check the destination's tariff schedule."));
        } catch (e) { }
        return r;
    }
    try {
        if (W.BCACT && BCACT.on) {
            BCACT.on("v92r3b.gloss", () => { try { go("gloss"); render(); window.scrollTo(0, 0); } catch (e) { } }, { replace: true });
        }
    } catch (e) { }

    /* ═════ 描いたあとの直し（まとめて） ═════ */
    let tm: any = 0, busy = 0;
    function sweep() {
        if (busy) return;
        busy = 1;
        try { sweepDuty(); } catch (e) { }
        try { for (const f of (W.__v92r3bSweeps || [])) { try { f(); } catch (e) { } } } catch (e) { }
        busy = 0;
    }
    const kick = () => { if (!tm) tm = setTimeout(() => { tm = 0; sweep(); }, 60); };
    try {
        const mo = new MutationObserver(() => { if (!busy) kick(); });
        const boot = () => { try { mo.observe(document.body, { childList: true, subtree: true }); kick(); } catch (e) { } };
        if (document.body) boot(); else document.addEventListener("DOMContentLoaded", boot);
    } catch (e) { }
    W.__v92r3bSweeps = W.__v92r3bSweeps || [];
    W.v92r3b = { E, M, dict, ten, dd, NK, bandOf, bandIdx, bandNm, kick, exQty, T_ };
})();
