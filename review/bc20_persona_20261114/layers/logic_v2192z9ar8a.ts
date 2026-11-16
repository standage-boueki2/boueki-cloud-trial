/* 21.92 r8a：8巡目の直し（受注・見積の金額：同じ相手の2件目の受注・数字だけの価格・AI の価格の答え）
   今の関数は包むだけ。数字・事実は作らない。
   ■ この層で「1か所」に決めたこと
     (1) 受注の金額 ＝ 注文ごとの額の合計。注文＝「受注」の記録1件ずつ（同じ相手の2件目からも別の注文）＋ 発注書。
         注文の額：その注文の書類（出荷案件が、その受注の記録につながっている）があれば書類の額、無ければ記録の単価×数量。
         ordersOf()／applyOrders() が案件（r6b の caseList の1件）に c.v92ord（注文の一覧）・c.v92parts（通貨ごとの額）を付ける。
         累計受注金額（dashMoney）・内訳の窓・札の文・ホーム（vDash）・活動レポート（a30Collect）は、全部ここから出す。
         通貨が違う注文はその通貨のまま持ち、換算は r6b の rateOf（レートの無い通貨は「ほかに …（円換算のレートなし）」）。
         「どこまで進んだか」の「サンプル発送」も相手（案件）ごとに数える（同じ相手の2件目の受注で段の数が増えない）。
     (2) 数字だけの価格（例「13.5」）＝ 記録の窓で選んだ通貨（確定単価の横の通貨）。保存のときに通貨を付けて記録する（13.5 → SGD 13.50）。
         前に通貨なしで保存した記録は、読むとき（v61dlEffPrice）に その相手の書類の通貨 → 商品の価格表の通貨 で読む。読めないときは「通貨が未指定」。
         円の単価は小数を丸めない（¥6.5 が ¥7 にならない）。
     (3) 記録より先に書類を開いた案件（見本から写した書類）も、あとの記録につなぐ（linkLoose）。手で直した欄は r7a の「記録に合わせる／このままにする」で聞く。
   課題：auto-T01・T05〜T07／health-T01・T02・T04・T06〜T08・T12／medical-T01・T04・T09・T10／indagri-T01・T03・T08／daily-T05・T06／
         food-T03〜T05・T08・T10／other-T04〜T07・T09／culture-T07 */
declare const TENS: any, D: any, I18N: any, SHIPS: any, DASH: any, V92AI: any;
declare let TEN: any, PID: any, cur: any;
(function () {
    const W: any = window;
    if (W.__v2192r8a) return;
    W.__v2192r8a = 1;
    const R6: any = W.v92r6b || null;
    const R7: any = W.v92r7a || {};
    const API: any = (W.v92r8a = W.v92r8a || {});
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const lang = () => { try { if (typeof I18N !== "undefined" && I18N && I18N.lang) { const v = String(I18N.lang); return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja"; } } catch (e) { } return "ja"; };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const warn = (k: string, e: any) => { try { console.warn("[v92r8a] " + k, e); } catch (x) { } };
    const dd = () => { try { return (typeof D !== "undefined" && D) ? D : null; } catch (e) { return null; } };
    const norm = (s: any) => { try { if (typeof v30Norm === "function") return v30Norm(s); } catch (e) { } return String(s || "").toLowerCase().replace(/[\s.,　・\-]/g, ""); };
    const nfkc = (s: any) => { let x = String(s == null ? "" : s); try { x = x.normalize("NFKC"); } catch (e) { } return x; };
    const num = (s: any): any => { const m = nfkc(s).match(/\d[\d,]*(?:\.\d+)?/); return m ? parseFloat(m[0].replace(/,/g, "")) : null; };
    const isObj = (r: any) => !!r && !Array.isArray(r) && typeof r === "object";
    const fbList = (): any[] => { try { const d = dd(); return (d && Array.isArray(d.fb)) ? d.fb : []; } catch (e) { return []; } };
    const curOf = (s: any): string => { try { if (R7.curOf) return R7.curOf(s) || ""; } catch (e) { } try { return (typeof v61dlCurOf === "function") ? (v61dlCurOf(s) || "") : ""; } catch (e) { return ""; } };
    const amtOf = (s: any): any => { try { if (R7.amt) return R7.amt(s); } catch (e) { } const n = num(s); return n != null ? { cur: curOf(s), v: n } : null; };
    const allShips = (): any[] => { try { return (typeof v61dlAllCases === "function") ? (v61dlAllCases() || []) : []; } catch (e) { return []; } };
    const isMihon = (S: any) => !!S && (/（想定）/.test(String(S.buyer || "")) || /想定シナリオ/.test(String(S.qty || "")));
    const isPo = (c0: any) => !!(c0 && (c0.po || c0.src === "po" || (c0.ship && c0.ship.poNo)));
    const edited = (S: any) => { try { const m = S && S.v61man; return !!(m && (m.qty || m.unitPrice || m.term || m.pay)); } catch (e) { return false; } };
    const save = () => { try { if (typeof v61dlSave === "function") v61dlSave(); else if (typeof saveTen === "function") saveTen(); } catch (e) { } };
    const prodCur = (): string => { try { return (typeof v61dlProdCur === "function") ? (v61dlProdCur() || "") : ""; } catch (e) { return ""; } };
    const shipByNo = (no: any) => allShips().find((S: any) => S && String(S.no) === String(no)) || null;
    const r2 = (v: number) => Math.round((+v || 0) * 100) / 100;

    /* ══ (2) 数字だけの価格 ══ */
    /* 単価の書き方：US$ と ¥ は記号、ほかは通貨コード。円・ウォンは小数があるときだけ小数を出す（¥6.5 → ¥6.50） */
    const fmtP = (c: string, n: number): string => {
        const v = +n || 0;
        if (c === "JPY" || c === "KRW") { const s = v.toLocaleString("en-US", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 }); return c === "JPY" ? "¥" + s : "KRW " + s; }
        const s = v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return c === "USD" ? "US$" + s : (c ? c + " " : "") + s;
    };
    /* 合計の書き方（r6b の fmtCur と同じ） */
    const fmtCur = (a: any): string => {
        if (!a) return "—";
        const v = +a.v || 0;
        if (a.cur === "USD") return "US$" + v.toLocaleString("en-US", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
        if (a.cur === "JPY") return "¥" + Math.round(v).toLocaleString("en-US");
        return (a.cur || "") + " " + v.toLocaleString("en-US", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
    };
    /* 数字だけ（「13.5」「41,000」「6.5/本」）か */
    const numOnly = (s: any): any => {
        const x = nfkc(s).replace(/，/g, ",").trim();
        const m = x.match(/^([\d,]+(?:\.\d+)?)\s*(?:\/\s*([^\s\d\/]{1,8}))?$/);
        if (!m) return null;
        const n = parseFloat(m[1].replace(/,/g, ""));
        return (n > 0) ? { n, sfx: m[2] ? "/" + m[2] : "" } : null;
    };
    API.numOnly = numOnly; API.fmtP = fmtP;
    /* 前に通貨なしで保存した記録の通貨：その相手の書類の通貨 → 商品の価格表の通貨（r7a の「数字だけの単価は案件の通貨」と同じ） */
    const recCur = (r: any): string => {
        try {
            if (r && r.v92cur) return String(r.v92cur);
            const k = norm(r && r.b);
            if (k) {
                const S = allShips().find((x: any) => x && !isMihon(x) && norm(x.buyer) === k && (curOf(x.unitPrice) || curOf(x.total)));
                if (S) return curOf(S.unitPrice) || curOf(S.total);
            }
            return prodCur();
        }
        catch (e) { return ""; }
    };
    try {
        if (typeof v61dlEffPrice === "function") {
            const o = v61dlEffPrice;
            v61dlEffPrice = function (this: any, rec: any) {
                const p = o.apply(this, arguments as any);
                try {
                    if (p && p.s) {
                        const x = numOnly(p.s);
                        if (x) { const c = recCur(rec); return c ? { s: fmtP(c, x.n) + x.sfx, prov: p.prov, v92cur: c } : Object.assign({}, p, { v92nocur: 1 }); }
                    }
                }
                catch (e) { }
                return p;
            };
        }
    }
    catch (e) { warn("eff-wrap", e); }
    /* 円の単価を丸めない（indagri-T01：¥6.5 が ¥7 になり、数量×単価と合わなかった） */
    try {
        if (typeof v61dlFmt === "function") {
            const o = v61dlFmt;
            v61dlFmt = function (this: any, c: any, n: any) {
                try { if ((c === "JPY" || c === "KRW") && Number(n) % 1) return fmtP(c, Number(n)); } catch (e) { }
                return o.apply(this, arguments as any);
            };
        }
    }
    catch (e) { warn("fmt-wrap", e); }
    const formCur = (): string => { try { const s: any = document.getElementById("v61dlcur"); return s && s.value ? String(s.value) : ""; } catch (e) { return ""; } };
    /* 記録の窓：希望価格が数字だけのとき、どの通貨で記録するかをその場で出す */
    const hintP = () => {
        try {
            const P: any = document.getElementById("dfP");
            if (!P) return;
            let h: any = document.getElementById("v92r8aPH");
            const x = numOnly(P.value);
            if (!x) { if (h) h.remove(); return; }
            const c = formCur() || prodCur() || "USD";
            if (!h) { h = document.createElement("p"); h.id = "v92r8aPH"; h.className = "nn v92r8a-ph"; h.setAttribute("data-noi18n", "1"); P.insertAdjacentElement("afterend", h); }
            const v = fmtP(c, x.n) + x.sfx;
            h.textContent = M(`通貨が書いていないので、下の「確定単価（受注時）」の欄で選んでいる通貨（${c}）として記録します：${v}。違う通貨なら、US$13.50 のように通貨を付けるか、その欄の通貨を選び直してください。`,
                `No currency is written, so it is recorded in the currency selected under “Confirmed unit price” below (${c}): ${v}. If it is another currency, write it like US$13.50 or change that currency.`,
                `未写币种，将按下方“确定单价”栏所选币种（${c}）记录：${v}。如为其他币种，请写成 US$13.50 的形式，或重新选择该栏币种。`,
                `No se indicó moneda; se registra en la moneda elegida en «Precio unitario confirmado» (${c}): ${v}. Si es otra moneda, escríbala (p. ej. US$13.50) o cambie esa moneda.`);
        }
        catch (e) { }
    };
    try {
        document.addEventListener("input", (ev: any) => { try { if (ev.target && ev.target.id === "dfP") hintP(); } catch (e) { } }, true);
        document.addEventListener("change", (ev: any) => { try { if (ev.target && (ev.target.id === "v61dlcur" || ev.target.id === "dfP")) setTimeout(hintP, 0); } catch (e) { } }, true);
    }
    catch (e) { }

    /* ══ その相手の記録（r7a と同じ並び：日付の新しい順、同じ日は D.fb の先頭＝後から入れた記録が先） ══ */
    const effP = (r: any): any => { try { return (typeof v61dlEffPrice === "function") ? v61dlEffPrice(r) : null; } catch (e) { return null; } };
    const usableRec = (r: any) => !!r && r.st !== "失注" && (!!effP(r) || (num(r.lot) || 0) > 0);
    const recsOf = (buyer: any): any[] => {
        const k = norm(buyer);
        if (!k) return [];
        return fbList().map((r: any, i: number) => ({ r, i })).filter((x: any) => isObj(x.r) && x.r.b && norm(x.r.b) === k)
            .sort((a: any, b: any) => String(b.r.d || "").localeCompare(String(a.r.d || "")) || a.i - b.i);
    };
    const recAmt = (r: any): any => {
        try {
            const p = effP(r);
            const a = p ? amtOf(p.s) : null;
            const q = num(r && r.lot);
            if (!p || !a || !(a.v > 0) || !(q > 0)) return null;
            return { cur: a.cur || "", v: r2(a.v * q), unit: p.s, qty: r.lot, prov: p.prov };
        }
        catch (e) { return null; }
    };
    const fmtQty = (s: any): string => {
        const t = String(s == null ? "" : s).trim();
        if (!t) return "—";
        const m = nfkc(t).match(/^([\d,]+(?:\.\d+)?)(.*)$/);
        if (!m) return t;
        const n = parseFloat(m[1].replace(/,/g, ""));
        return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 3 }) + m[2] : t;
    };
    API.fmtQty = fmtQty;
    const recTxt = (r: any): string => {
        const p = effP(r), q = String(r.lot || "").trim();
        let t: any = null; try { t = (typeof v61dlRecTerm === "function") ? v61dlRecTerm(r) : null; } catch (e) { }
        return [q ? fmtQty(q) : "", p ? p.s : "", t && t.code ? (t.code + " " + (t.place || "")).trim() : ""].filter(Boolean).join("・");
    };
    const shipAmt = (S: any): any => {
        const a = amtOf(S && S.total);
        if (!a || !(a.v > 0)) return null;
        let c = a.cur;
        if (!c) { try { c = R7.caseCur ? R7.caseCur(S) : ""; } catch (e) { c = ""; } }
        return c ? { cur: c, v: a.v } : null;
    };
    const dOf = (s: any) => String(s || "").slice(0, 10);
    const sumBy = (P: any[]): any[] => {
        const out: any[] = [];
        (P || []).forEach((p: any) => { if (!p || !(p.v > 0) || !p.cur) return; const x = out.find((y: any) => y.cur === p.cur); if (x) x.v = r2(x.v + p.v); else out.push({ cur: p.cur, v: r2(p.v) }); });
        return out;
    };
    const rateOf = (c: string): any => { try { return (R6 && R6.rateOf) ? R6.rateOf(c) : null; } catch (e) { return null; } };

    /* ══ (1) 注文ごとの額 ══ */
    const ordersOf = (c: any): any[] => {
        const recs: any[] = (c.recs || []).filter((x: any) => x && x.r);
        const wonRecs = recs.filter((x: any) => x.r.st === "受注");
        const byKey: any = {}, out: any[] = [];
        (c.ships || []).filter((x: any) => x && x.ship).forEach((c0: any) => {
            const S = c0.ship, po = isPo(c0);
            const id = (!po && S.v61fb && S.v61fb.id) ? String(S.v61fb.id) : "";
            const lk = id ? recs.find((x: any) => x.r.v61id === id) : null;
            const ord = po || (lk ? lk.r.st === "受注" : !!(S.v61fb && S.v61fb.won)) || (!id && !wonRecs.length);
            if (!ord) return;
            const key = (lk && id) ? id : "S:" + S.no;
            let o = byKey[key];
            if (!o) {
                o = byKey[key] = { k: po ? "po" : "doc", ships: [], rec: lk, parts: [], d: dOf((lk && lk.r.d) || (S.v61fb && S.v61fb.d) || S.orderDate || S.date || c.wonD || ""), i: out.length };
                out.push(o);
            }
            o.ships.push(S);
            const a = shipAmt(S);
            let dr = 0;
            if (a && a.cur === "USD") { try { dr = (typeof docRateOf === "function") ? (+docRateOf(S) || 0) : 0; } catch (e) { dr = 0; } }
            if (a) o.parts.push({ cur: a.cur, v: a.v, docRate: dr }); else o.noAmt = 1;
        });
        wonRecs.forEach((x: any) => {
            const id = x.r.v61id;
            if (id && byKey[id]) return;
            const a = recAmt(x.r);
            const o: any = { k: "rec", ships: [], rec: x, parts: [], d: dOf(x.r.d), ra: a, i: out.length };
            if (a && a.cur) o.parts.push({ cur: a.cur, v: a.v, docRate: 0 });
            else { o.noAmt = 1; if (a && !a.cur) o.noCur = 1; }
            out.push(o);
        });
        out.sort((a: any, b: any) => String(a.d).localeCompare(String(b.d)) || a.i - b.i);
        out.forEach((o: any) => o.parts.forEach((p: any) => { p.d = o.d; }));
        return out;
    };
    const ordUnit = (o: any) => { const S = o.ships[o.ships.length - 1]; return S ? String(S.unitPrice || "—") : (o.ra ? o.ra.unit : ((effP(o.rec.r) || {}).s || "—")); };
    const ordQty = (o: any) => { if (o.ships.length) { const n = o.ships.reduce((s: number, S: any) => s + (num(S.qty) || 0), 0); const u = String(o.ships[0].qty || "").replace(/^[\s\d,.]+/, "").replace(/（.*$/, ""); return n > 0 ? n.toLocaleString("en-US") + u : "—"; } return fmtQty(o.rec && o.rec.r.lot); };
    /* 金額の記録がない案件：入れた数量・価格を出す（food-T08・auto-T05・other-T05）。価格に通貨が無いときは「通貨が未指定」 */
    const noAmtFill = (c: any) => {
        try {
            if (c.amt) return;
            const x = c.rec || (c.recs && c.recs.length ? c.recs[c.recs.length - 1] : null);
            if (!x || !x.r) return;
            const p = effP(x.r);
            if ((!c.qtyS || c.qtyS === "—") && x.r.lot) c.qtyS = fmtQty(x.r.lot);
            if ((!c.unitS || c.unitS === "—") && p) c.unitS = p.s;
            if (p && !curOf(p.s) && (num(x.r.lot) || 0) > 0) c.v92nocur = { fi: x.fi };
        }
        catch (e) { }
    };
    const applyOrders = (c: any) => {
        try {
            if (!c || c.v92r8a) return c;
            c.v92r8a = 1;
            if (c.stage !== "won") { noAmtFill(c); return c; }
            const out = ordersOf(c);
            if (!out.length) { noAmtFill(c); return c; }
            // 注文のどれにも金額が無く、r7a が書類（見積書）の額を出しているときは、今までどおり（金額が消えないように）
            if (c.amt && out.every((o: any) => !o.parts.length)) return c;
            const parts: any[] = [];
            out.forEach((o: any) => o.parts.forEach((p: any) => parts.push(p)));
            const sums = sumBy(parts);
            c.v92ord = out; c.v92parts = parts; c.v92sums = sums;
            c.nWonRec = Math.max(+c.nWonRec || 0, out.length);
            if (out.length === 1) {
                const o = out[0];
                if (o.k === "rec") {
                    c.amt = sums.length ? { cur: sums[0].cur, v: sums[0].v } : null;
                    c.amtSrc = "rec"; c.unitS = ordUnit(o); c.qtyS = ordQty(o); c.no = ""; c.recAlt = null; c.rec = o.rec; delete c.nSum;
                    if (o.noCur) c.v92nocur = { fi: o.rec.fi };
                }
                else {
                    const S = o.ships[o.ships.length - 1];
                    if (!(o.ships.length === 1 && c.S === S && !c.v92more)) {
                        c.amt = sums.length ? { cur: sums[0].cur, v: sums[0].v } : null;
                        c.S = S; c.no = S.no || ""; c.unitS = S.unitPrice || "—"; c.qtyS = S.qty || "—"; c.amtSrc = edited(S) ? "edit" : "doc"; delete c.nSum;
                        c.docRate = (o.parts.length === 1) ? (o.parts[0].docRate || 0) : 0;
                        const la = o.rec ? recAmt(o.rec.r) : null;
                        c.recAlt = (la && sums.length && (la.cur !== sums[0].cur || Math.abs(la.v - sums[0].v) > 0.005)) ? la : null;
                    }
                }
                return c;
            }
            // 注文が2件以上：通貨ごとの額を持つ（札・内訳の窓は注文ごとに出す）
            c.amt = sums.length ? { cur: sums[0].cur, v: sums[0].v } : null;
            c.amtSrc = "multi"; c.recAlt = null; c.v92more = null; delete c.nSum;
            const lastDoc = out.slice().reverse().find((o: any) => o.ships.length);
            if (lastDoc) { c.S = lastDoc.ships[lastDoc.ships.length - 1]; c.no = c.S.no || ""; }
            c.docRate = 0;
            c.qtyS = out.map(ordQty).join(" ＋ ");
            c.unitS = M(`注文 ${out.length}件`, `${out.length} orders`, `订单 ${out.length}件`, `${out.length} pedidos`) + "（" + out.map((o: any) => o.parts.length ? fmtCur(sumBy(o.parts)[0]) : "—").join(" ＋ ") + "）";
        }
        catch (e) { warn("applyOrders", e); }
        return c;
    };
    API.applyOrders = applyOrders; API.ordersOf = ordersOf;
    if (R6) {
        try {
            const L0 = R6.caseList, C0 = R6.cases, F0 = R6.rmFacts;
            if (typeof L0 === "function") R6.caseList = function (this: any) { const L = L0.apply(this, arguments as any) || []; try { L.forEach(applyOrders); } catch (e) { } return L; };
            if (typeof C0 === "function") R6.cases = function (this: any) { const L = C0.apply(this, arguments as any) || []; try { L.forEach(applyOrders); } catch (e) { } return L; };
            if (typeof F0 === "function") R6.rmFacts = function (this: any) {
                const F = F0.apply(this, arguments as any);
                try { if (F && Array.isArray(F.CS)) { F.CS.forEach(applyOrders); if (Array.isArray(F.won)) F.repeat = F.won.filter((c: any) => (+c.nWonRec || 0) >= 2 || (c.ships || []).filter(isPo).length >= 2); } } catch (e) { warn("rm", e); }
                return F;
            };
        }
        catch (e) { warn("r6-wrap", e); }
    }
    /* 累計受注金額：注文ごとの通貨の額に分けて換算する（r6b の dashMoney にそのまま渡す） */
    try {
        if (typeof dashMoney === "function") {
            const o = dashMoney;
            dashMoney = function (this: any, orders: any) {
                try {
                    if (Array.isArray(orders) && orders.some((x: any) => x && Array.isArray(x.v92p))) {
                        const L: any[] = [];
                        orders.forEach((x: any) => { if (x && Array.isArray(x.v92p)) x.v92p.forEach((p: any) => L.push({ a: { cur: p.cur, v: p.v }, docRate: p.docRate || 0, v92part: 1 })); else L.push(x); });
                        return o.call(this, L);
                    }
                }
                catch (e) { warn("money", e); }
                return o.apply(this, arguments as any);
            };
        }
    }
    catch (e) { warn("money-wrap", e); }
    const okD = (A: any) => { const per = !!(A && A.per); return (d: any) => { if (!per) return true; try { return !!d && (!DASH.from || d >= DASH.from) && (!DASH.to || d <= DASH.to); } catch (e) { return true; } }; };
    /* 「どこまで進んだか」：「見積を提示」「サンプル発送」「初回受注」は相手（案件）ごと。後ろの段より少ない前の段は、後ろの段の数に上げる（r7a と同じ） */
    const funnelFix = (A: any, us: any) => {
        try {
            if (!Array.isArray(A.funnel) || A.per) return;
            const U: any[] = A.us || us || [];
            const F0 = (U[0] && U[0].D && U[0].D.funnel) || [];
            if (!F0.length) return;
            const base: any[] = F0.map((row: any, i: number) => [row[0], U.reduce((a: number, u: any) => a + (+((((u && u.D && u.D.funnel) || [])[i] || [])[1]) || 0), 0)]);
            const demoU = U.filter((u: any) => u && u.kind === "demo");
            const baseRow = (i: number) => demoU.reduce((s: number, u: any) => s + (+((((u.D.funnel || [])[i]) || [])[1]) || 0), 0);
            const idx = (re: RegExp) => base.findIndex((r: any) => r && re.test(String(r[0] || "")));
            const iq = idx(/見積/), is = idx(/サンプル/), iw = idx(/受注/);
            const CS: any[] = A.v92cases || [];
            const rq = CS.filter((c: any) => c.reachedQuote).length;
            const nw = (A.v92won || []).length;
            const rs = CS.filter((c: any) => c.stage === "won" || (c.recs || []).some((x: any) => x && x.r && /サンプル発送|受注/.test(String(x.r.st || "")))).length;
            if (iq >= 0) base[iq] = [base[iq][0], baseRow(iq) + rq];
            if (is >= 0) base[is] = [base[is][0], baseRow(is) + rs];
            if (iw >= 0) base[iw] = [base[iw][0], baseRow(iw) + nw];
            let adj = 0;
            for (let i = base.length - 2; i >= 0; i--) { if ((+base[i + 1][1] || 0) > (+base[i][1] || 0)) { base[i] = [base[i][0], +base[i + 1][1] || 0]; adj++; } }
            A.funnel = base.map((r: any, i: number) => Array.isArray(A.funnel[i]) ? [r[0], r[1]].concat(A.funnel[i].slice(2)) : r);
            A.v92r7aFun = { adj };
            A.v92fun = Object.assign({}, A.v92fun || {}, { rq, won: nw, rs });
        }
        catch (e) { warn("funnel", e); }
    };
    const patchAgg = (A: any, us: any) => {
        (A.v92cases || []).forEach(applyOrders);
        const ok = okD(A);
        let nOrd = 0;
        (A.orders || []).forEach((x: any) => {
            if (!x) return;
            const c = x.v92c;
            if (x.src === "base" || !c || !c.v92ord) { nOrd++; return; }
            const P = (c.v92parts || []).filter((p: any) => ok(p.d));
            nOrd += Math.max(1, c.v92ord.filter((o: any) => ok(o.d)).length);
            x.v92p = P;
            const sums = sumBy(P);
            x.a = sums.length ? { cur: sums[0].cur, v: sums[0].v } : { cur: "", v: 0 };
            x.total = sums.length ? sums.map(fmtCur).join(" ＋ ") : M("（金額の記録なし）", "(no amount recorded)", "（未记录金额）", "(sin importe)");
            x.docRate = (P.length === 1 && P[0].cur === "USD") ? (P[0].docRate || 0) : 0;
            x.unit = c.unitS; x.qty = c.qtyS; if (c.no) x.no = c.no;
        });
        A.v92nOrd = nOrd;
        try { A.money = dashMoney(A.orders); } catch (e) { warn("agg-money", e); }
        funnelFix(A, us);
    };
    try {
        if (typeof dashAgg === "function") {
            const o = dashAgg;
            dashAgg = function (this: any, us: any) {
                const A = o.apply(this, arguments as any);
                try { if (A && A.v92cases && !A.v92r8a) { A.v92r8a = 1; patchAgg(A, us); } } catch (e) { warn("agg", e); }
                return A;
            };
        }
    }
    catch (e) { warn("agg-wrap", e); }
    API.agg = () => dashAgg(dashScopeUnits());

    /* ══ (3) 記録より先に書類を開いた案件（見本の案件から写した書類）を、あとの記録につなぐ（medical-T04） ══ */
    const linkLoose = (): string[] => {
        const out: string[] = [];
        try {
            allShips().forEach((S: any) => {
                if (!S || S.v61fb || S.poNo || isMihon(S)) return;
                if (!(S.v54copy || S.v56shipFb)) return;
                const B = recsOf(S.buyer).filter((x: any) => x.r.user && usableRec(x.r));
                if (!B.length) return;
                const N = B[0];
                S.v61man = S.v61man || {};
                S.v61fb = { id: v61dlId(N.r), d: N.r.d || "", b: N.r.b || S.buyer, c: N.r.c || "", won: N.r.st === "受注" ? 1 : 0, prov: 0 };
                const done = v61dlApply(S, N.r, ["qty", "price", "term", "pay"]) || [];
                S.v61fb.snap = v61dlSnap(N.r);
                if (done.indexOf("qty") >= 0 && done.indexOf("price") >= 0) delete S.v54copy;
                S.v61fb.v92re = { at: Date.now(), from: "", keys: done };
                out.push(String(S.no));
            });
            if (out.length) save();
        }
        catch (e) { warn("linkLoose", e); }
        return out;
    };
    API.linkLoose = linkLoose;
    /* 受注の書類のあとの「受注」の記録が、全部ほかの出荷案件の書類になったら、前の書類では聞かない（r7a の「このままにする」と同じ印） */
    const keepMore = () => {
        try {
            const SH = allShips().filter((S: any) => S && S.v61fb && S.v61fb.id && !S.poNo && !isMihon(S));
            const by: any = {};
            SH.forEach((S: any) => { const k = String(S.v61fb.id); (by[k] = by[k] || []).push(S); });
            let ch = false;
            SH.forEach((S: any) => {
                const L = S.v61fb, B = recsOf(S.buyer || L.b);
                const cu = B.find((x: any) => x.r.v61id === L.id);
                if (!cu || !(cu.r.st === "受注" || L.won)) return;
                const more = B.slice(0, B.indexOf(cu)).filter((x: any) => x.r.st === "受注" && usableRec(x.r));
                if (!more.length) return;
                if (more.some((x: any) => !(by[String(x.r.v61id || "")] || []).some((T: any) => T !== S))) return;
                const sig = "more:" + more.map((x: any) => v61dlId(x.r)).join(",");
                if (L.v92keepM !== sig) { L.v92keepM = sig; ch = true; }
            });
            if (ch) save();
        }
        catch (e) { warn("keepMore", e); }
    };

    /* ══ 知らせ（r7a の黄色の箱）：文を、実際にしたことに合わせる／記録の窓の中に並べる（health-T04・auto-T06） ══ */
    const moreMsg = (S: any): any => {
        const L = S.v61fb;
        if (!L) return "";
        const B = recsOf(S.buyer || L.b);
        const cu = B.find((x: any) => x.r.v61id === L.id);
        if (!cu) return "";
        const SH = allShips();
        const other = (id: any) => !!id && SH.some((T: any) => T && T !== S && T.v61fb && T.v61fb.id === id);
        const more = B.slice(0, B.indexOf(cu)).filter((x: any) => x.r.st === "受注" && usableRec(x.r) && !other(x.r.v61id)).reverse();
        if (!more.length) return null;
        const items = more.map((x: any) => `${x.r.d || ""}：${recTxt(x.r)}`).join(M("／", " / ", "／", " / "));
        const A = more.map((x: any) => recAmt(x.r));
        const noAmt = A.filter((a: any) => !a || !a.cur).length;
        const nr: string[] = [];
        A.forEach((a: any) => { if (a && a.cur && a.cur !== "JPY" && !rateOf(a.cur) && nr.indexOf(a.cur) < 0) nr.push(a.cur); });
        const n = more.length;
        let t = M(`この相手に、この書類（${S.no}）の注文（${cu.r.d || ""}）より後の「受注」の記録が ${n}件あります（${items}）。この書類は変えていません。後の記録は別の注文として、累計受注金額に足しています`,
            `This buyer has ${n} “Order” record(s) after the order of these documents (${S.no}, ${cu.r.d || ""}): ${items}. These documents were not changed. The later record(s) are added to the total order value as separate orders`,
            `该客户在本单据（${S.no}）的订单（${cu.r.d || ""}）之后还有 ${n} 条“接单”记录（${items}）。本单据未作更改。之后的记录作为另外的订单计入累计接单金额`,
            `Este comprador tiene ${n} registro(s) de «Pedido» posteriores al pedido de estos documentos (${S.no}, ${cu.r.d || ""}): ${items}. Los documentos no se cambiaron. Los registros posteriores se suman al total como pedidos aparte`);
        if (nr.length) t += M(`（${nr.join("・")} は円に換算するレートが無いため、合計とは別に「ほかに ${nr.join("・")} …」と出しています）`, ` (${nr.join(", ")} has no JPY rate, so it is shown separately as “Plus ${nr.join(", ")} …”)`, `（${nr.join("・")} 无日元汇率，另行显示为“另有 ${nr.join("・")} …”）`, ` (${nr.join(", ")} sin tipo a JPY; se muestra aparte)`);
        if (noAmt) t += M(`。ただし、確定単価か数量が入っていない ${noAmt}件は、金額が分からないため足していません`, `. ${noAmt} record(s) without a unit price or quantity are not added because the amount is unknown`, `。但未填写确定单价或数量的 ${noAmt} 条因金额不明未计入`, `. ${noAmt} registro(s) sin precio o cantidad no se suman`);
        t += M("。同じ注文の言い直しなら、古い方の記録の状況を直してください。新しい注文の書類は、その記録の「出荷案件を作る」で作れます。",
            ". If it restates the same order, change the status of the older record. Documents for the new order can be made with “Create a shipment case” on that record.",
            "。如果是同一订单的更正，请修改旧记录的状态。新订单的单据可在该记录的“创建出货案件”中制作。",
            ". Si es el mismo pedido, cambie el estado del registro anterior. Los documentos del nuevo pedido se crean con «Crear el caso de envío» en ese registro.");
        return t;
    };
    const dwOpen = () => { try { const dw: any = document.getElementById("dw"); if (!dw) return false; const cs = getComputedStyle(dw); const r = dw.getBoundingClientRect(); return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 10 && r.left < window.innerWidth - 10; } catch (e) { return false; } };
    const fixAsk = (box: any) => {
        try {
            if (!box || !box.getAttribute || !document.body.contains(box)) return;
            const no = box.getAttribute("data-v92r7a-no");
            const S = no ? shipByNo(no) : null;
            const sig = box.getAttribute("data-v92r8a");
            if (S && box.querySelector('[data-v92r7a-ask="rec"]')) {
                const t = moreMsg(S);
                if (t === null) {
                    // 後の受注が全部ほかの出荷案件の書類になった → この書類では聞かない
                    keepMore();
                    const fl0 = box.closest("#v92r7aFloat");
                    if (fl0) fl0.remove(); else box.remove();
                    return;
                }
                const b = box.querySelector("p b");
                if (t && b && sig !== t) { b.textContent = "⚠ " + t; box.setAttribute("data-v92r8a", t); }
            }
            const fl = box.closest("#v92r7aFloat");
            if (fl) {
                const ai: any = document.getElementById("dfAI");
                const dw: any = document.getElementById("dw");
                if (ai && dw && dw.contains(ai) && dwOpen()) {
                    box.setAttribute("data-v92r7a-w", "dw");
                    box.classList.add("v92r8a-inbox");
                    const first = ai.firstElementChild;
                    if (first) first.insertAdjacentElement("afterend", box); else ai.appendChild(box);
                    fl.remove();
                }
            }
        }
        catch (e) { warn("fixAsk", e); }
    };
    const paintFix = () => {
        try { Array.from(document.querySelectorAll(".v92r7a-ask")).forEach(fixAsk); } catch (e) { }
    };
    API.paintFix = paintFix;
    try {
        const mo = new MutationObserver((ms: any[]) => {
            try {
                for (const m of ms) for (const n of Array.from(m.addedNodes || []) as any[]) {
                    if (n && n.id === "v92r7aFloat") { const b = n.querySelector(".v92r7a-ask"); if (b) { fixAsk(b); setTimeout(() => fixAsk(b), 60); } }
                }
            }
            catch (e) { }
        });
        const go0 = () => { try { mo.observe(document.body, { childList: true }); } catch (e) { } };
        if (document.body) go0(); else document.addEventListener("DOMContentLoaded", go0);
    }
    catch (e) { }
    try { document.addEventListener("click", () => { setTimeout(paintFix, 420); setTimeout(paintFix, 1600); }, false); } catch (e) { }
    try {
        if (typeof v85docRepaint === "function") { const o = v85docRepaint; v85docRepaint = function (this: any) { const r = o.apply(this, arguments as any); try { setTimeout(paintFix, 40); } catch (e) { } return r; }; }
    }
    catch (e) { }

    /* ══ 描く前：書類のつなぎ直し（r7a の relinkAll より前に） ══ */
    try {
        if (typeof render === "function") {
            const o = render;
            render = function (this: any) {
                try { linkLoose(); } catch (e) { }
                try { keepMore(); } catch (e) { }
                const r = o.apply(this, arguments as any);
                try { setTimeout(paintFix, 30); setTimeout(paintFix, 400); } catch (e) { }
                return r;
            };
        }
    }
    catch (e) { warn("render-wrap", e); }
    /* 記録の保存：数字だけの希望価格に、窓で選んだ通貨を付けてから保存する。保存のあと、写した書類をつなぐ */
    try {
        if (typeof dealSave === "function") {
            const o = dealSave;
            dealSave = function (this: any) {
                try {
                    const P: any = document.getElementById("dfP");
                    const x = P ? numOnly(P.value) : null;
                    if (P && x) { const c = formCur() || prodCur(); if (c) { P.value = fmtP(c, x.n) + x.sfx; const h = document.getElementById("v92r8aPH"); if (h) h.remove(); } }
                }
                catch (e) { warn("dfP", e); }
                const r = o.apply(this, arguments as any);
                const fin = () => {
                    setTimeout(() => {
                        try {
                            const L = linkLoose();
                            if (L.length) {
                                const S = shipByNo(L[0]);
                                if (S && typeof toast === "function") toast(M(`新しい記録に合わせて、書類（${L.join("・")}）の値を更新しました：${[String(S.qty || "").split("（")[0], S.unitPrice, S.term].filter(Boolean).join("・")}`, `Documents (${L.join(", ")}) were updated from the new record`, `已按新记录更新单据（${L.join("・")}）`, `Documentos (${L.join(", ")}) actualizados con el nuevo registro`));
                                if (typeof render === "function") render();
                            }
                            keepMore();
                            paintFix();
                        }
                        catch (e) { warn("dealSave-fin", e); }
                    }, 140);
                };
                try { if (r && typeof r.then === "function") r.then(fin, fin); else fin(); } catch (e) { }
                return r;
            };
        }
    }
    catch (e) { warn("dealSave-wrap", e); }

    /* ══ 内訳の窓：注文が2件以上の相手は、注文ごとに1枚の札にする ══ */
    const fmtYen = (j: number) => { try { if (typeof DASH !== "undefined" && DASH && DASH.cur === "USD" && typeof fmtUSD === "function") return fmtUSD(j / ((dashRate() || {}).v || 150)); return (typeof fmtJPY === "function") ? fmtJPY(j) : "¥" + Math.round(j).toLocaleString("en-US"); } catch (e) { return "¥" + Math.round(j).toLocaleString("en-US"); } };
    const yenTxt = (sums: any[], dr: number): string => {
        const L: string[] = [];
        let noR = false;
        sums.forEach((a: any) => {
            if (a.cur === "JPY") return;
            const r = (a.cur === "USD" && dr) ? { v: dr } : rateOf(a.cur);
            if (!r || !(+r.v > 0)) { noR = true; return; }
            L.push(fmtYen(a.v * r.v));
        });
        let s = L.length ? "≒" + L.join(" ＋ ") : "";
        if (noR) s += M("（円換算のレートなし・合計に入れていません）", " (no JPY rate; not in the total)", "（无日元汇率，未计入合计）", " (sin tipo a JPY; no incluido)");
        if (dr && sums.length === 1 && sums[0].cur === "USD") s += M(`（書類レート${dr}）`, ` (doc rate ${dr})`, `（单据汇率${dr}）`, ` (tipo doc. ${dr})`);
        return s;
    };
    let DRILL: any[] = [];
    const ordCard = (c: any, ci: number, o: any, i: number, n: number, ok: any): string => {
        const sums = sumBy(o.parts);
        const S = o.ships.length ? o.ships[o.ships.length - 1] : null;
        const total = sums.length ? sums.map(fmtCur).join(" ＋ ") : (o.noCur ? M("通貨が未指定", "currency not specified", "未指定币种", "moneda sin indicar") : M("金額の記録なし", "no amount recorded", "未记录金额", "sin importe"));
        const yen = sums.length ? yenTxt(sums, o.parts.length === 1 ? (o.parts[0].docRate || 0) : 0) : "";
        const no = o.ships.length ? o.ships.map((s: any) => s.no).join("・") : M("商談の記録", "Meeting record", "商谈记录", "Registro") + (o.d ? " " + o.d : "");
        const stage = M(`受注・${i + 1}件目の注文（${n}件中）`, `Order ${i + 1} of ${n}`, `接单・第${i + 1}个订单（共${n}个）`, `Pedido ${i + 1} de ${n}`);
        const src = o.k === "po" ? M("発注書の額", "PO amount", "订购单金额", "importe de la OC")
            : o.k === "doc" ? (edited(S) ? M("書類の額（「受注内容を編集」で直した値）", "document amount (edited in “Edit order details”)", "单据金额（在“编辑订单内容”中修改）", "importe del documento (editado)") : M("書類の額", "document amount", "单据金额", "importe del documento"))
                : o.noCur ? M("希望価格に通貨が無いため、合計に入れていません。✎ から商談の記録の価格に通貨（US$ など）を付けてください", "The price has no currency, so it is not in the total. Use ✎ to add a currency (e.g. US$) to the record's price", "价格没有币种，未计入合计。请点 ✎ 在商谈记录的价格上加币种（如 US$）", "El precio no tiene moneda; no se incluye. Use ✎ para añadirla")
                    : o.noAmt ? M("確定単価か数量が無いため、金額に入っていません（✎ から商談の記録に入れてください）", "No unit price or quantity, so no amount (add them to the record with ✎)", "缺少确定单价或数量，未计入金额（请点 ✎ 在商谈记录中填写）", "Sin precio o cantidad (añádalos con ✎)")
                        : (o.ra && o.ra.prov) ? M("商談の記録の希望価格×数量（確定単価が未入力・この注文の書類はまだありません）", "requested price × qty from the record (no confirmed price yet; no documents for this order yet)", "商谈记录的期望价格×数量（未填写确定单价，该订单尚无单据）", "precio deseado × cantidad del registro (sin documentos aún)")
                            : M("商談の記録の確定単価×数量（この注文の書類はまだありません。記録の「出荷案件を作る」で作れます）", "confirmed price × qty from the record (no documents for this order yet; create them with “Create a shipment case”)", "商谈记录的确定单价×数量（该订单尚无单据，可在记录中“创建出货案件”）", "precio confirmado × cantidad del registro (sin documentos aún)");
        let alt = "";
        if (o.k === "doc" && o.rec && sums.length) { const la = recAmt(o.rec.r); if (la && la.cur && (la.cur !== sums[0].cur || Math.abs(la.v - sums[0].v) > 0.005)) alt = M(`商談の記録では ${fmtCur(la)}。書類の額を使っています（「受注内容を編集」で直せます）`, `The meeting record says ${fmtCur(la)}; the document amount is used`, `商谈记录为 ${fmtCur(la)}，此处采用单据金额`, `El registro indica ${fmtCur(la)}; se usa el importe del documento`); }
        const outP = ok(o.d) ? "" : M("（集計期間の外の注文です。合計には入れていません）", " (outside the period; not in the total)", "（不在统计期间内，未计入合计）", " (fuera del período; no incluido)");
        const ship = S && S.want ? M(`希望着荷 ${S.want}`, `requested arrival ${S.want}`, `希望到货 ${S.want}`, `llegada deseada ${S.want}`) : "";
        const btn = ` <button type="button" class="btn g v92r8a-ed" data-ci="${ci}" data-k="${o.k === "rec" ? "rec" : "doc"}" data-no="${E(S ? S.no : "")}" data-fi="${o.rec ? E(o.rec.fi) : ""}" style="padding:2px 7px;font-size:10px" title="${E(M("編集", "Edit", "编辑", "Editar"))}">✎</button>`;
        return `<div class="v92r6b-cd v92r8a-ord" data-v92r8a-ci="${ci}">`
            + `<div class="v92r6b-c1"><span class="v92r6b-nm"><span class="n v92r6b-no">${E(no)}</span> <b>${E(c.buyer)}</b><span class="v92r6b-ct">（${E(c.cty || "—")}）</span></span>`
            + `<span class="v92r6b-am n"><b>${E(total)}</b>${yen ? `<br><span class="v92r6b-sub">${E(yen)}</span>` : ""}</span></div>`
            + `<div class="v92r6b-c2">${E(c.item || "")}　${E(ordQty(o))} × ${E(ordUnit(o))}</div>`
            + `<div class="v92r6b-c3"><span class="p lo">${E(stage)}</span>${btn}</div>`
            + `<div class="v92r6b-c4">${E(M("金額の出どころ：", "Amount source: ", "金额来源：", "Origen del importe: "))}${E(src)}${E(outP)}</div>`
            + (alt ? `<div class="v92r6b-c4">${E(alt)}</div>` : "")
            + (ship ? `<div class="v92r6b-c4">${E(M("出荷予定：", "Shipment: ", "预计出货：", "Envío: "))}${E(ship)}</div>` : "")
            + `</div>`;
    };
    /* 換算のレートの行：注文ごとに分けた通貨（2件目からの注文の SGD など）も出す（r6b の rateLine と同じ書き方） */
    const srcName = (r: any) => r.src === "ecb" ? M("欧州中央銀行の参照レート", "ECB reference rate", "欧洲央行参考汇率", "tipo de referencia del BCE")
        : (r.src === "live" || r.src === "murc") ? M("公表相場（TTM）", "published TTM", "公布汇率（TTM）", "TTM publicado")
            : M("参照レート", "reference rate", "参考汇率", "tipo de referencia");
    const extraRates = (A: any): string[] => {
        const shown: any = {}, out: string[] = [];
        (A.orders || []).concat(A.quotes || []).forEach((x: any) => { if (x && x.a && x.a.cur && !x.docRate) shown[x.a.cur] = 1; });
        const seen: any = {};
        (A.orders || []).forEach((x: any) => (Array.isArray(x && x.v92p) ? x.v92p : []).forEach((p: any) => {
            const c = p.cur;
            if (!c || c === "JPY" || shown[c] || seen[c] || (c === "USD" && p.docRate)) return;
            seen[c] = 1;
            const r = rateOf(c);
            if (r && +r.v > 0) out.push(`1 ${c === "USD" ? "US$" : c}＝${(+r.v).toFixed(2)}${M("円", " JPY", "日元", " JPY")}（${srcName(r)}${r.d ? "・" + r.d : ""}）`);
        }));
        return out;
    };
    API.extraRates = extraRates;
    const grpHead = (c: any, n: number, sums: any[]) => `<div class="v92r8a-grp" data-noi18n>${E(M(`${c.buyer}（${c.cty || "—"}）：同じ相手からの注文 ${n}件。1件ずつ別の注文として、累計受注金額に足しています（合計 ${sums.map(fmtCur).join(" ＋ ") || "—"}）`, `${c.buyer} (${c.cty || "—"}): ${n} orders from the same buyer, each added to the total order value (${sums.map(fmtCur).join(" + ") || "—"})`, `${c.buyer}（${c.cty || "—"}）：同一客户的订单 ${n}个，各自计入累计接单金额（合计 ${sums.map(fmtCur).join(" ＋ ") || "—"}）`, `${c.buyer} (${c.cty || "—"}): ${n} pedidos del mismo comprador, cada uno sumado al total (${sums.map(fmtCur).join(" + ") || "—"})`))}</div>`;
    const drillFix = () => {
        try {
            const root: any = document.getElementById("v92r6bDrill");
            if (!root || root.getAttribute("data-v92r8a")) return;
            root.setAttribute("data-v92r8a", "1");
            const A = dashAgg(dashScopeUnits());
            if (!A || !A.v92won) return;
            const kind = root.getAttribute("data-kind");
            const won: any[] = A.v92won, quo: any[] = A.v92quo || [];
            const ALL = kind === "quotes" ? quo.concat(won) : won.concat(quo);
            DRILL = ALL;
            const ok = okD(A);
            root.querySelectorAll("[data-v92ci]").forEach((el: any) => {
                const ci = +el.getAttribute("data-v92ci");
                const c = ALL[ci];
                if (!c) return;
                if (c.v92ord && c.v92ord.length > 1) {
                    const n = c.v92ord.length;
                    const h = grpHead(c, n, sumBy((c.v92parts || []).filter((p: any) => ok(p.d)))) + c.v92ord.map((o: any, i: number) => ordCard(c, ci, o, i, n, ok)).join("");
                    const d = document.createElement("div");
                    d.className = "v92r8a-grpw";
                    d.innerHTML = h;
                    el.replaceWith(d);
                }
                else if (c.v92nocur && !c.amt) {
                    const am = el.querySelector(".v92r6b-am b");
                    if (am) am.textContent = M("通貨が未指定", "currency not specified", "未指定币种", "moneda sin indicar");
                    const nt = document.createElement("div");
                    nt.className = "v92r6b-c4";
                    nt.textContent = M("希望価格に通貨が無いため、金額に入れていません。✎ から商談の記録の価格に通貨（US$ など）を付けてください。", "The price has no currency, so it is not counted. Use ✎ to add a currency (e.g. US$) to the record's price.", "价格没有币种，未计入金额。请点 ✎ 在商谈记录的价格上加币种（如 US$）。", "El precio no tiene moneda; no se cuenta. Use ✎ para añadirla.");
                    el.appendChild(nt);
                }
            });
            // 換算のレート・数え方の文
            const ex = extraRates(A).filter((x: string) => !/^1 US\$/.test(x));
            if (ex.length) {
                const rn: any = root.querySelector(".v92r6b-rn");
                if (rn) { const t = String(rn.textContent || ""); const k = t.search(/。|\. /); rn.textContent = k > 0 ? t.slice(0, k) + "／" + ex.join("／") + t.slice(k) : t + "／" + ex.join("／"); }
                else { const p = document.createElement("p"); p.className = "nn v92r6b-rn"; p.setAttribute("data-noi18n", "1"); p.style.marginTop = "7px"; p.textContent = M("換算：", "Converted at ", "换算：", "Conversión: ") + ex.join("／"); const q = root.querySelector("#v68qdrill"); if (q) q.insertAdjacentElement("afterend", p); else root.appendChild(p); }
            }
            root.querySelectorAll("p.nn").forEach((p: any) => {
                const t = String(p.textContent || "");
                if (t.indexOf("金額は案件ごとに1つ（書類があれば書類の額、無ければ記録の確定単価×数量）") >= 0)
                    p.textContent = t.replace("金額は案件ごとに1つ（書類があれば書類の額、無ければ記録の確定単価×数量）", "受注の金額は注文ごとに足します（同じ相手の2件目からの「受注」の記録も、1件ずつ別の注文。その注文の書類があれば書類の額、無ければ記録の確定単価×数量）。見積の金額は案件ごとに1つ（見積書があればその額、無ければ記録の単価×数量）");
                else if (t.indexOf("One amount per case (document amount if any, otherwise confirmed unit price × quantity from the record).") >= 0)
                    p.textContent = t.replace("One amount per case (document amount if any, otherwise confirmed unit price × quantity from the record).", "Order amounts are added per order (each later “Won” record for the same buyer is a separate order; the order's document amount if any, otherwise confirmed unit price × quantity). Quotes: one amount per case.");
            });
            const nO = A.v92nOrd || 0, nC = (A.orders || []).length;
            if (nO > nC) {
                const p: any = root.querySelector("p.nn");
                if (p) {
                    const t = String(p.textContent || "");
                    const t2 = t.replace(/受注が決まった案件 (\d+)件・/, `受注が決まった案件 $1件（注文 ${nO}件）・`).replace(/(\d+) confirmed order case\(s\), /, `$1 confirmed order case(s) (${nO} orders), `).replace(/已确认订单的案件 (\d+)件/, `已确认订单的案件 $1件（订单 ${nO}个）`);
                    if (t2 !== t) p.textContent = t2;
                }
            }
            if (!root.dataset.v92r8aB) {
                root.dataset.v92r8aB = "1";
                root.addEventListener("click", (ev: any) => {
                    try {
                        const b = ev.target && ev.target.closest && ev.target.closest(".v92r8a-ed");
                        if (!b) return;
                        ev.stopPropagation();
                        const c = DRILL[+b.getAttribute("data-ci")];
                        if (!c) return;
                        const k = b.getAttribute("data-k"), no = b.getAttribute("data-no"), fi = b.getAttribute("data-fi");
                        if (k === "doc" && no && c.u && c.u.act && typeof dashOrdEdit === "function") dashOrdEdit(no);
                        else if (fi !== "" && fi != null && typeof dashFbEdit === "function") dashFbEdit(c.ref, +fi);
                        else if (typeof toast === "function") toast(M("この案件の商品を開いてから編集してください", "Open this case's product to edit", "请先打开该案件的商品再编辑", "Abra el producto del caso para editar"));
                    }
                    catch (e) { warn("drill-ed", e); }
                });
            }
        }
        catch (e) { warn("drillFix", e); }
    };
    try {
        if (typeof dashDrill === "function") {
            const o = dashDrill;
            dashDrill = function (this: any) {
                const r = o.apply(this, arguments as any);
                try { drillFix(); } catch (e) { }
                return r;
            };
        }
    }
    catch (e) { warn("drill-wrap", e); }

    /* ══ 分析の札・どこまで進んだか の文 ══ */
    const SMP_JA_OLD = "「サンプル発送」には、状況が「受注」の記録も入ります（先の段まで進んだ記録は、通った段として数えています。サンプルを送っていない取引もここに入ります）。";
    const SMP_EN_OLD = " “Samples sent” also counts records whose status is “Order” (records that went further are counted as having passed this stage).";
    try {
        if (typeof vDash === "function") {
            const o = vDash;
            vDash = function (this: any) {
                let h = o.apply(this, arguments as any);
                try {
                    if (typeof h !== "string") return h;
                    const A = dashAgg(dashScopeUnits());
                    if (!A) return h;
                    const n = (A.orders || []).length, m = +A.v92nOrd || 0;
                    if (m > n) {
                        h = h.replace(`受注が決まった案件 ${n}件の合計（見積は入りません）`, `受注が決まった案件 ${n}件（注文 ${m}件）の合計（見積は入りません）`)
                            .replace(`total of ${n} confirmed order(s) (quotes excluded)`, `total of ${n} confirmed order case(s) (${m} orders) (quotes excluded)`)
                            .replace(`${n}个已确认订单的合计（不含报价）`, `${n}个已确认订单的案件（订单 ${m}个）的合计（不含报价）`)
                            .replace(`total de ${n} pedido(s) confirmado(s) (sin cotizaciones)`, `total de ${n} caso(s) con pedido (${m} pedidos) (sin cotizaciones)`);
                    }
                    // 換算のレート：2件目からの注文の通貨も
                    const ex = extraRates(A).filter((x: string) => !/^1 US\$/.test(x));
                    if (ex.length) {
                        const lo = h.indexOf('<p class="lbl">累計受注金額');
                        if (lo >= 0) {
                            const hint = h.indexOf('<span class="ddhint">', lo);
                            const ox = h.indexOf('class="kd v92r6b-ordx"', lo);
                            const L0 = E(M("換算：", "Converted at ", "换算：", "Conversión: ")), add = E(ex.join("／"));
                            if (ox >= 0 && (hint < 0 || ox < hint)) {
                                const a = h.indexOf(">", ox) + 1;
                                if (h.startsWith(L0, a)) { const e1 = [h.indexOf("<br>", a), h.indexOf("</div>", a)].filter((i: number) => i >= 0).sort((x: number, y: number) => x - y)[0]; if (e1 > a) h = h.slice(0, e1) + "／" + add + h.slice(e1); }
                                else h = h.slice(0, a) + L0 + add + "<br>" + h.slice(a);
                            }
                            else if (hint >= 0) h = h.slice(0, hint) + `<div class="kd v92r6b-ordx" data-kqn="1" data-noi18n style="font-size:9.5px">${L0}${add}</div>` + h.slice(hint);
                        }
                    }
                    // どこまで進んだか：「サンプル発送」も相手（案件）ごと
                    if (!A.per) {
                        h = h.split(SMP_JA_OLD).join("「サンプル発送」は、状況「サンプル発送」か「受注」の記録がある相手（案件）の数です（受注まで進んだ相手も通った段として数えます。同じ相手の2件目からの受注は、別の注文として累計受注金額には入りますが、ここでは数えません）。")
                            .split(SMP_EN_OLD).join(" “Samples sent” counts buyers (cases) with a record in status “Samples sent” or “Order” (a second order from the same buyer is added to the total order value but not counted here).")
                            .split("数え方：「見積を提示」「初回受注」のほかの段は、").join("数え方：「見積を提示」「サンプル発送」「初回受注」のほかの段は、")
                            .split("「見積を提示」「初回受注」は、相手（案件）ごとに数えています").join("「見積を提示」「サンプル発送」「初回受注」は、相手（案件）ごとに数えています");
                    }
                    // 見積の札：レートの無い通貨があるときの言い方（other-T04）
                    const qm = A.qmoney || {};
                    const mx = +qm.mixed || 0;
                    if (mx > 0) {
                        h = h.replace(/（(\d+)件のうち金額のある (\d+)件の合計）/, (s: string, a: string, b: string) => `（${a}件のうち金額のある ${+b + mx}件・そのうち円に換算できた ${b}件の合計）`)
                            .replace(/ \(total of (\d+) of (\d+) with an amount\)/, (s: string, b: string, a: string) => ` (total of the ${b} converted to JPY, of ${+b + mx} with an amount out of ${a})`);
                    }
                    // 通貨が未指定の見積（数字だけの価格を前に保存した記録）
                    const nc = (A.v92quo || []).filter((c: any) => !c.amt && c.v92nocur).length;
                    if (nc) {
                        const k = h.indexOf("金額の記録がない案件 ");
                        const e = k >= 0 ? h.indexOf("）", k) : -1;
                        if (e > k) h = h.slice(0, e + 1) + E(M(`。うち ${nc}件は、希望価格に通貨が無い（通貨が未指定）ため入れていません。商談の記録の価格に US$ などの通貨を付けてください`, "", "", "")) + h.slice(e + 1);
                    }
                }
                catch (e) { warn("vdash", e); }
                return h;
            };
        }
    }
    catch (e) { warn("vdash-wrap", e); }
    /* 活動レポートの「見積」「受注」の行：その書類の額（daily-T06：案件の受注金額の合計が、見積書の額として出ていた） */
    try {
        if (typeof a30Collect === "function") {
            const o = a30Collect;
            a30Collect = function (this: any) {
                const out = o.apply(this, arguments as any);
                try {
                    const fix = (e: any) => {
                        const m = String((e && e.txt) || "").match(/^([^・\s]+)・(.+)$/);
                        if (!m) return;
                        const S = shipByNo(m[1]);
                        if (!S) return;
                        const a = shipAmt(S);
                        e.txt = m[1] + (a ? "・" + fmtCur(a) : "");
                    };
                    if (out && Array.isArray(out.quote)) out.quote.forEach(fix);
                    if (out && Array.isArray(out.won)) out.won.forEach(fix);
                }
                catch (e) { warn("a30", e); }
                return out;
            };
        }
    }
    catch (e) { warn("a30-wrap", e); }
    /* ══ (4) AI商社マンの価格の答え ══ */
    /* food-T03：答えに「合計は US$4,740.00」と合計が出ているのに、その合計を単価とみなして数量をもう一度掛けた「合計の目安」を足していた → 足さない */
    const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const fixTotal = (a: string): string => {
        try {
            const i = a.indexOf('<span class="v92ct-total">');
            if (i < 0) return a;
            const j = a.indexOf("</span>", i);
            if (j < 0) return a;
            const span = a.slice(i, j + 7).replace(/<[^>]+>/g, "");
            const m = span.match(/(US\$|¥|￥|\$)\s?([\d,]+(?:\.\d+)?)\s*×/);
            if (!m) return a;
            const before = a.slice(0, i).replace(/<[^>]+>/g, "");
            const re = new RegExp("(?:合計|総額|[Tt]otal)[^。\\n]{0,14}?" + escRe(m[1]) + "\\s?" + escRe(m[2]) + "(?![\\d])");
            if (!re.test(before)) return a;
            const k = a.lastIndexOf("<br><br>", i);
            return a.slice(0, (k >= 0 && k >= i - 8) ? k : i) + a.slice(j + 7);
        }
        catch (e) { return a; }
    };
    /* medical-T10：円の金額に小数（¥1,260,000.00）を付けない */
    const fixYen = (a: string) => a.replace(/([¥￥][\d,]+)\.00(?![\d])/g, "$1");
    try {
        if (typeof brain === "function") {
            const o = brain;
            brain = function (this: any) {
                const res = o.apply(this, arguments as any);
                const fin = (r: any) => { try { if (r && typeof r.a === "string") r.a = fixYen(fixTotal(r.a)); } catch (e) { } return r; };
                if (res && typeof res.then === "function") return res.then(fin);
                return fin(res);
            };
        }
    }
    catch (e) { warn("brain-wrap", e); }
    /* food-T04：見本の数量の単位が「K」になる。MOQ に単位が無いとき、価格表の1列目（SKU：MD-MAT-1K）の文字を単位と読んでいた → 商品の単位（袋）を先に使う。
       「2,500袋」の中の「500袋」を例の数として置き換えていた → 前が数字・カンマのときは置き換えない */
    try {
        if (typeof v92aiUnitQ === "function") {
            const o = v92aiUnitQ;
            v92aiUnitQ = function (this: any) {
                const U = o.apply(this, arguments as any);
                try {
                    const d: any = dd() || {};
                    const mu = String(d.moq || "").match(/([\d,]+)\s*([^\d\s,.、。（(）)]{1,6})/);
                    let u2 = ""; try { if (typeof v83pxMoqUnit === "function" && typeof TEN !== "undefined" && TEN) u2 = v83pxMoqUnit(TEN) || ""; } catch (e) { }
                    if (U && !mu && !u2 && d.unit && U.u !== String(d.unit)) U.u = String(d.unit);
                }
                catch (e) { }
                return U;
            };
        }
        if (typeof v92aiUnitFix === "function") {
            v92aiUnitFix = function (this: any, a: any) {
                const U = v92aiUnitQ();
                if (!U || U.u === "袋" || String(a).indexOf("500袋") < 0) return a;
                try { if (typeof V92AI !== "undefined" && V92AI && V92AI.n) V92AI.n.unit = (V92AI.n.unit || 0) + 1; } catch (e) { }
                return String(a).replace(/(^|[^\d,，.])500袋/g, (m: string, p: string) => p + U.n.toLocaleString("ja-JP") + U.u);
            };
        }
    }
    catch (e) { warn("unit-wrap", e); }
    /* food-T05：目標と道筋の「1社あたり（空欄）」の推定。価格表が SKU ごとの行と数量帯の列のとき、1行目（別の SKU）の単価で計算していた
       → この商品の SKU の行の、MOQ が入る数量帯の単価で計算する（行や帯が読めないときは今までどおり） */
    const skuEst = (): any => {
        try {
            const d: any = dd() || {};
            const cols: string[] = Array.isArray(d.priceCols) ? d.priceCols.map(String) : [];
            const rows: any[] = Array.isArray(d.priceRows) ? d.priceRows : [];
            const sku = String(d.sku || "").trim();
            if (cols.length < 3 || !rows.length || !sku) return null;
            const band = (s: string): any => {
                const x = nfkc(s).replace(/\s/g, "").replace(/～/g, "〜");
                let m = x.match(/^[〜~]([\d,]+)$/); if (m) return { lo: 1, hi: +m[1].replace(/,/g, "") };
                m = x.match(/^([\d,]+)[〜~\-–]([\d,]+)$/); if (m) return { lo: +m[1].replace(/,/g, ""), hi: +m[2].replace(/,/g, "") };
                m = x.match(/^([\d,]+)(?:[〜~]|以上|\+)$/); if (m) return { lo: +m[1].replace(/,/g, ""), hi: Infinity };
                return null;
            };
            const B = cols.map((c, i) => ({ i, b: band(c), c })).filter((x) => x.b);
            if (B.length < 2) return null;
            const row = rows.find((r: any) => Array.isArray(r) && r.some((c: any) => String(c).trim() === sku));
            if (!row) return null;
            const moq = num(d.moq);
            if (!(moq > 0)) return null;
            const bx = B.find((x) => moq >= x.b.lo && moq <= x.b.hi);
            if (!bx) return null;
            const cell = String(row[bx.i] || "");
            let fx = 150;
            try { const f = (typeof ddpFx === "function") ? ddpFx() : null; if (f && f.rates && +f.rates.USD > 50) fx = +f.rates.USD; } catch (e) { }
            let unit: any = null;
            const mu = cell.match(/(?:US\$|USD|\$)\s*([\d,]+(?:\.\d+)?)/);
            if (mu) unit = parseFloat(mu[1].replace(/,/g, "")) * fx;
            else { const y = cell.match(/[¥￥]\s*([\d,]+(?:\.\d+)?)|([\d,]+(?:\.\d+)?)\s*円/); if (y) unit = parseFloat((y[1] || y[2]).replace(/,/g, "")); }
            if (!(unit > 0)) return null;
            return { unit, moq, cell, band: bx.c, sku };
        }
        catch (e) { return null; }
    };
    API.skuEst = skuEst;
    try {
        if (typeof v88PerBuyer === "function") {
            const o = v88PerBuyer;
            v88PerBuyer = function (this: any, G: any) {
                const p = o.apply(this, arguments as any);
                try {
                    if (p && p.src === "input") return p;
                    const s = skuEst();
                    if (!s) return p;
                    const v = Math.max(1e5, Math.min(1e9, Math.round(s.unit * s.moq * 4)));
                    return { v, src: "est", unit: Math.round(s.unit), moq: s.moq, v92sku: s };
                }
                catch (e) { return p; }
            };
        }
    }
    catch (e) { warn("perbuyer-wrap", e); }

    /* ══ (5) 磨き ══ */
    /* culture-T07：記録の通貨が US$ でないとき、自社の価格との差を記録の通貨で（US$ はかっこに） */
    try {
        if (typeof v56dCmpParts === "function") {
            const o = v56dCmpParts;
            v56dCmpParts = function (this: any, c: any) {
                const P = o.apply(this, arguments as any);
                try {
                    if (P && c && c.bm && c.bm.cur && c.bm.cur !== "USD" && (P.high || P.low) && c.busd != null) {
                        const r = (c.fx && c.fx.rates) || {};
                        const rb = c.bm.cur === "JPY" ? 1 : +r[c.bm.cur], ru = +r.USD;
                        const usds = (c.rows || []).map((x: any) => x.usd).filter((v: any) => v != null);
                        if (rb > 0 && ru > 0 && usds.length) {
                            const k = ru / rb;
                            const ref = c.pick;
                            const lo = ref && ref.usd != null ? ref.usd : Math.min(...usds), hi = ref && ref.usd != null ? ref.usd : Math.max(...usds);
                            const f = (v: number) => c.bm.cur === "JPY" ? "¥" + Math.round(v).toLocaleString("en-US") : c.bm.cur + " " + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            const u = (v: number) => "US$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            if (P.high) { const d = c.busd - hi; P.diff = `約 ${f(d * k)}（≒${u(d)}）`; }
                            else { const d1 = lo - c.busd, d2 = hi - c.busd; P.diff = lo === hi ? `約 ${f(d1 * k)}（≒${u(d1)}・${Math.round(d1 / lo * 100)}%）` : `約 ${f(d1 * k)}〜${f(d2 * k)}（≒${u(d1)}〜${u(d2)}・${Math.round(d1 / lo * 100)}〜${Math.round(d2 / hi * 100)}%）`; }
                        }
                    }
                }
                catch (e) { }
                return P;
            };
        }
    }
    catch (e) { warn("cmp-wrap", e); }
    /* other-T06・auto-T07：「受注内容を編集」で数量を数字だけで入れたとき、桁区切りと単位を付けて保存（梱包明細の Total・内訳と同じ書き方に） */
    try {
        if (typeof openStepEdit === "function") {
            const o = openStepEdit;
            openStepEdit = function (this: any, i: any) {
                const r = o.apply(this, arguments as any);
                try {
                    const g: any = document.getElementById("seGo"), q: any = document.getElementById("seQ");
                    const S = dd() && dd().ship;
                    if (i === 0 && g && q && S && !g.dataset.v92r8a && typeof g.onclick === "function") {
                        g.dataset.v92r8a = "1";
                        const un = String(S.qty || "").replace(/（.*$/, "").replace(/^[\s\d,.]+/, "").trim();
                        const og = g.onclick;
                        g.onclick = function (this: any, ev: any) {
                            try { const x = nfkc(q.value).trim(); if (/^[\d,]+(?:\.\d+)?$/.test(x)) { const n = parseFloat(x.replace(/,/g, "")); if (n > 0) q.value = n.toLocaleString("en-US", { maximumFractionDigits: 3 }) + un; } } catch (e) { }
                            return og.call(this, ev);
                        };
                    }
                }
                catch (e) { warn("ose", e); }
                return r;
            };
        }
    }
    catch (e) { warn("ose-wrap", e); }
    /* medical-T09・other-T07：完成形の見本の書類の注記が、確定単価を「希望価格」と呼んでいた／数量に桁区切りが無かった */
    const recById = (id: any) => { try { return id ? (fbList().find((f: any) => isObj(f) && f.v61id === id) || null) : null; } catch (e) { return null; } };
    const docNote = () => {
        try {
            const o = document.getElementById("dO");
            const S = dd() && dd().ship;
            if (o && S && S.v61fb) {
            const rec = recById(S.v61fb.id);
            const fx = !!(rec && typeof v61dlIsPrice === "function" && v61dlIsPrice(rec.fixPrice));
            Array.from(o.querySelectorAll("p.nn")).forEach((p: any) => {
                const b = p.querySelector("b");
                if (fx && b && /^希望価格 /.test(String(b.textContent || "")) && /^商談記録の/.test(String(p.textContent || "").trim())) b.textContent = String(b.textContent).replace(/^希望価格 /, "確定単価 ");
                const sp = p.querySelector(".v92r5a-src");
                if (sp && !sp.getAttribute("data-r8a")) { sp.setAttribute("data-r8a", "1"); const t = String(sp.textContent || ""); const t2 = t.replace(/(商談の記録は |The meeting record had |商谈记录为 |El registro decía )(.*?)( でした|\.(?=\s|$)|。)/, (m: string, a: string, x: string, z: string) => a + x.replace(/(^|[^\d.,])(\d{4,})(?![\d.,])/g, (mm: string, pp: string, nn: string) => pp + Number(nn).toLocaleString("en-US")) + z); if (t2 !== t) sp.textContent = t2; }
            });
            }
        }
        catch (e) { warn("docNote", e); }
        // medical-T10：書類の金額の書き方を通貨でそろえる（US$ と同じく小数2桁・単価と合計で同じ通貨の書き方。S$5.00 → SGD 5.00）
        try {
            const o = document.getElementById("dO");
            const SYM: any = { "S$": "SGD", "HK$": "HKD", "A$": "AUD", "AU$": "AUD", "NT$": "TWD", "C$": "CAD", "CA$": "CAD", "NZ$": "NZD" };
            if (o) Array.from(o.querySelectorAll(".doc td")).forEach((td: any) => {
                if (td.children.length) return;
                const t = String(td.textContent || "").trim();
                let m = t.match(/^(S\$|HK\$|A\$|AU\$|NT\$|C\$|CA\$|NZ\$)\s?([\d,]+(?:\.\d+)?)$/);
                if (m) { const n = parseFloat(m[2].replace(/,/g, "")); td.textContent = SYM[m[1]] + " " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); return; }
                m = t.match(/^(SGD|HKD|EUR|AUD|TWD|CAD|NZD|GBP|CNY|THB|CHF|AED|MYR) ([\d,]+)$/);
                if (m) td.textContent = m[1] + " " + parseFloat(m[2].replace(/,/g, "")).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            });
        }
        catch (e) { }
        // health-T12：梱包明細の Total の行に、行と同じカートン数・総重量を（見本の書類は数量だけだった）
        try {
            if (String(W.__poDocK || "") !== "pl") return;
            const o = document.getElementById("dO");
            const tb = o ? o.querySelector(".doc table") : null;
            if (!tb) return;
            const trs: any[] = Array.from(tb.querySelectorAll("tbody tr"));
            const tot = trs.find((tr: any) => /^Total$/.test(String(((tr.querySelector("td") || {}) as any).textContent || "").trim()));
            const data = trs.filter((tr: any) => tr !== tot);
            if (!tot || data.length !== 1) return;
            const cs = data[0].querySelectorAll("td"), tc = tot.querySelectorAll("td");
            const cell = tc[tc.length - 1];
            const t = String(cell.textContent || "").trim();
            const ctn = cs[2] ? String(cs[2].textContent || "").trim() : "", gw = cs[3] ? String(cs[3].textContent || "").trim() : "";
            if (/^[\d,]+\s*(pcs)?$/i.test(t) && /CTN/.test(ctn) && /kg/i.test(gw)) cell.textContent = `${t} / ${ctn} / ${gw}`;
        }
        catch (e) { }
    };
    /* 次の行動：いちばん新しい記録が「受注」で次の行動が空なら、前の記録の次の行動（サンプルを送る など）は出さない（health-T08） */
    const recsByName = (name: any): any[] => recsOf(name).map((x: any) => x.r);
    const staleNext = (name: any, t: any): boolean => {
        try {
            const R = recsByName(name);
            const top = R[0];
            if (!top || top.st !== "受注" || String(top.next || "").trim()) return false;
            return !!t && R.slice(1).some((r: any) => String(r.next || "").trim() === String(t).trim());
        }
        catch (e) { return false; }
    };
    API.staleNext = staleNext;
    /* indagri-T08：活動レポートの「次の手」を、ホーム・案件一覧の「次の行動」と同じ出どころ（バイヤー一覧の次のアクション → 記録の次の行動）に */
    const homeNext = (name: string): any => {
        try {
            const k = norm(name);
            let N: any = null;
            const rows = (typeof b30Collect === "function") ? (b30Collect() || []) : [];
            const r = rows.find((x: any) => x && norm(x.name) === k);
            if (r && typeof v33Sig === "function") { const s = v33Sig(r); if (s && s.what) N = { t: String(s.what), due: s.at && typeof v33Day === "function" ? v33Day(s.at) : "" }; }
            if (!N) { const f = recsByName(name).find((x: any) => String(x.next || "").trim()); if (f) N = { t: String(f.next).trim(), due: String(f.due || "") }; }
            if (N && staleNext(name, N.t)) N = null;
            if (!N && R6 && typeof R6.cases === "function") {
                // 次の行動が無いときは、案件一覧（r6a・r6x・r7a の刷新版の層）と同じ言い方
                const c = (R6.cases() || []).find((x: any) => x && x.key === k);
                if (c && c.stage === "won") N = { t: (c.ships && c.ships.length) ? M("受注の書類を確かめて送る（見積書・請求書）", "Review and send the order documents (quote / invoice)", "确认并发送订单文件（报价单・发票）", "Revisar y enviar los documentos del pedido") : M("受注の書類をつくる（見積書・請求書）", "Create the order documents (quote / invoice)", "制作订单文件（报价单・发票）", "Crear los documentos del pedido"), due: "" };
                else if (c && c.stage === "quote") N = { t: M("見積の返事を確かめる", "Check for a reply to the quote", "确认报价的回复", "Comprobar la respuesta a la cotización"), due: "" };
            }
            return N;
        }
        catch (e) { return null; }
    };
    API.homeNext = homeNext;
    try {
        if (typeof a30Open === "function") {
            const o = a30Open;
            a30Open = function (this: any) {
                const r = o.apply(this, arguments as any);
                try {
                    const dw = document.getElementById("dw") || document.getElementById("pn");
                    const tb = dw ? Array.from(dw.querySelectorAll("table")).find((t: any) => /次の手/.test(String((t.querySelector("thead") || {}).textContent || ""))) as any : null;
                    if (tb) Array.from(tb.querySelectorAll("tbody tr")).forEach((tr: any) => {
                        const tds = tr.querySelectorAll("td");
                        const nm = tds[0] && tds[0].querySelector("b") ? String(tds[0].querySelector("b").textContent || "").trim() : "";
                        const last = tds[tds.length - 1];
                        if (!nm || !last) return;
                        const N = homeNext(nm);
                        last.textContent = N ? N.t + (N.due ? "（" + N.due + "）" : "") : "—";
                    });
                }
                catch (e) { warn("a30open", e); }
                return r;
            };
        }
    }
    catch (e) { warn("a30open-wrap", e); }
    /* food-T10：見本の「見積を提示した案件」の窓：見本の決まった数の受注は、見本の「見積を提示」の数に入っていることを書く */
    const quoteHead = () => {
        try {
            const root: any = document.getElementById("v92r6bDrill");
            if (!root || root.getAttribute("data-kind") !== "quotes" || root.getAttribute("data-v92r8aq")) return;
            root.setAttribute("data-v92r8aq", "1");
            const A = dashAgg(dashScopeUnits());
            const bw = +(A && A.v92baseW) || 0, bq = +(A && A.v92baseQ) || 0;
            if (!bw && !bq) return;
            const p: any = root.querySelector("p.nn");
            if (!p) return;
            p.textContent = String(p.textContent || "") + M(`。見本の決まった数（見積 ${bq}件・受注 ${bw}件。1件ずつの明細は入っていません）の受注は、上の「いま見積を出している案件」の見本の数と「どこまで進んだか」の「見積を提示」に入っていて、「受注に進んだ案件」にはご自分で足した案件だけを数えています`, `. The fixed sample figures (${bq} quotes, ${bw} order(s); no per-case detail) are included in the sample count above and in “Quote sent”; “became orders” counts only the cases you added`, `。示例的固定数字（报价 ${bq}件・接单 ${bw}件）已含在上面的示例数和“已报价”中；“已接单的案件”只计您自己添加的案件`, `. Las cifras fijas de muestra (${bq} cotizaciones, ${bw} pedido(s)) ya están en el recuento de muestra; «con pedido» solo cuenta los casos añadidos por usted`);
        }
        catch (e) { warn("quoteHead", e); }
    };
    try {
        if (typeof dashDrill === "function") {
            const o = dashDrill;
            dashDrill = function (this: any) { const r = o.apply(this, arguments as any); try { quoteHead(); } catch (e) { } return r; };
        }
    }
    catch (e) { }
    try { document.addEventListener("click", () => { setTimeout(docNote, 450); setTimeout(docNote, 1650); }, false); } catch (e) { }
    try {
        if (typeof v85docRepaint === "function") { const o = v85docRepaint; v85docRepaint = function (this: any) { const r = o.apply(this, arguments as any); try { setTimeout(docNote, 60); setTimeout(docNote, 700); } catch (e) { } return r; }; }
        if (typeof render === "function") { const o = render; render = function (this: any) { const r = o.apply(this, arguments as any); try { setTimeout(docNote, 60); setTimeout(docNote, 700); } catch (e) { } return r; }; }
    }
    catch (e) { }

    /* 見た目 */
    try {
        const stl = document.createElement("style");
        stl.id = "v92r8a-css";
        stl.textContent = ".v92r8a-ph{margin:3px 0 0;font-size:10.5px;color:var(--warn,#9a6700)}.v92r8a-grp{margin:8px 0 4px;font-size:11px;font-weight:600;color:var(--ink-2,#444)}.v92r8a-grpw{margin-bottom:6px}.v92r8a-inbox{margin:7px 0 0!important}";
        (document.head || document.documentElement).appendChild(stl);
    }
    catch (e) { }
})();
