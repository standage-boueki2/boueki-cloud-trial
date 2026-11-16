(function () {
    const W = window;
    if (W.__v2192r9a)
        return;
    W.__v2192r9a = 1;
    const API = (W.v92r9a = W.v92r9a || {});
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const lang = () => { try {
        const s = document.getElementById("lang");
        const v = String((s && s.value) || (typeof I18N !== "undefined" && I18N && I18N.lang) || "ja");
        return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
    }
    catch (e) {
        return "ja";
    } };
    const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const warn = (k, e) => { try {
        console.warn("[v92r9a] " + k, e);
    }
    catch (x) { } };
    const dd = () => { try {
        return (typeof D !== "undefined" && D) ? D : null;
    }
    catch (e) {
        return null;
    } };
    const ten = () => { try {
        return (typeof TEN !== "undefined" && TEN) ? TEN : null;
    }
    catch (e) {
        return null;
    } };
    const norm = (s) => { try {
        if (typeof v30Norm === "function")
            return v30Norm(s);
    }
    catch (e) { } return String(s || "").toLowerCase().replace(/[\s.,　・\-]/g, ""); };
    const cn = (c) => { try {
        if (typeof cnorm === "function")
            return cnorm(c || "") || String(c || "");
    }
    catch (e) { } return String(c || ""); };
    const nfkc = (s) => { let x = String(s == null ? "" : s); try {
        x = x.normalize("NFKC");
    }
    catch (e) { } return x; };
    const num = (s) => { const m = nfkc(s).match(/\d[\d,]*(?:\.\d+)?/); return m ? parseFloat(m[0].replace(/,/g, "")) : null; };
    const isObj = (r) => !!r && !Array.isArray(r) && typeof r === "object";
    const isMihon = (S) => !!S && (/（想定）/.test(String(S.buyer || "")) || /想定シナリオ/.test(String(S.qty || "")));
    const R6 = () => W.v92r6b || null;
    const R7 = () => W.v92r7a || {};
    const R8 = () => W.v92r8a || {};
    const allShips = () => { try {
        return (typeof v61dlAllCases === "function") ? (v61dlAllCases() || []) : [];
    }
    catch (e) {
        return [];
    } };
    const effP = (r) => { try {
        return (typeof v61dlEffPrice === "function") ? v61dlEffPrice(r) : null;
    }
    catch (e) {
        return null;
    } };
    const fmtQty = (s) => { try {
        if (R8().fmtQty)
            return R8().fmtQty(s);
    }
    catch (e) { } return String(s == null ? "" : s); };
    const recTxt = (r) => {
        const p = effP(r), q = String((r && r.lot) || "").trim();
        let t = null;
        try {
            t = (typeof v61dlRecTerm === "function") ? v61dlRecTerm(r) : null;
        }
        catch (e) { }
        return [q ? fmtQty(q) : "", p ? p.s : "", t && t.code ? (t.code + " " + (t.place || "")).trim() : ""].filter(Boolean).join("・");
    };
    const casesAll = () => { try {
        const A = R6();
        return (A && typeof A.cases === "function") ? (A.cases() || []) : [];
    }
    catch (e) {
        return [];
    } };
    const userTen = (t) => !!(t && (t.src === "upload" || t.src === "sample2"));
    const fbList = () => { try {
        const t = ten();
        if (userTen(t))
            return Array.isArray(t.fbx) ? t.fbx : [];
        const d = dd();
        return (d && Array.isArray(d.fb)) ? d.fb : [];
    }
    catch (e) {
        return [];
    } };
    const curItem = () => { try {
        const d = dd();
        return String((d && d.item) || (ten() || {}).item || "");
    }
    catch (e) {
        return "";
    } };
    const sameItem = (r) => {
        try {
            const a = norm(r && r.item), b = norm(curItem());
            if (!a || !b)
                return true;
            return a === b || a.indexOf(b) >= 0 || b.indexOf(a) >= 0;
        }
        catch (e) {
            return true;
        }
    };
    API.sameItem = sameItem;
    const caseOf = (c) => {
        try {
            const n = norm(c && c.name);
            if (!n)
                return null;
            return casesAll().find((x) => x && x.S && x.no && norm(x.buyer) === n && (c.pi == null || !x.u || x.u.i == null || x.u.i === c.pi)) || null;
        }
        catch (e) {
            return null;
        }
    };
    const docNoOf = (c) => { const x = caseOf(c); return x ? String(x.no || "") : ""; };
    API.docNoOf = docNoOf;
    let WANT = null;
    const linkedIds = () => { const o = {}; allShips().forEach((S) => { if (S && S.v61fb && S.v61fb.id)
        o[String(S.v61fb.id)] = 1; }); return o; };
    const recsForCase = (c) => {
        const k = norm(c.name), cty = c.cty ? cn(c.cty) : "";
        return fbList().map((r, i) => ({ r, i })).filter((x) => isObj(x.r) && x.r.b && norm(x.r.b) === k && (!cty || !x.r.c || cn(x.r.c) === cty))
            .sort((a, b) => String(b.r.d || "").localeCompare(String(a.r.d || "")) || a.i - b.i);
    };
    const pickDoc = (c) => {
        try {
            if (!c)
                return;
            const d = dd();
            if (!d || !d.ship || typeof shipEnsure !== "function")
                return;
            shipEnsure();
            if (typeof SHIPS === "undefined" || !Array.isArray(SHIPS))
                return;
            const cty = cn(c.cty);
            const nm = c.named ? String(c.name) : `${c.cty}の${c.biz || "バイヤー"}（ID ${c.id}）`;
            const hit = (S) => !!S && (S.v92case === c.id || (norm(S.buyer) === norm(nm) && cn(S.country) === cty));
            const L = SHIPS.map((x, i) => ({ x, i })).filter((o) => o.x && o.x.ship && hit(o.x.ship));
            if (L.length) {
                if (L.length < 2)
                    return;
                const no = docNoOf(c);
                const p = no ? L.find((o) => String(o.x.ship.no) === no) : null;
                if (!p)
                    return;
                WANT = { i: p.i, k: norm(p.x.ship.buyer), at: Date.now() };
                if (SHIPA !== p.i && typeof shipUse === "function")
                    shipUse(p.i);
                return;
            }
            if (!c.named)
                return;
            const R = recsForCase(c).filter((x) => x.r.st !== "失注");
            const R1 = R.filter((x) => sameItem(x.r));
            const ids = linkedIds();
            const won = R1.filter((x) => x.r.st === "受注" && !(x.r.v61id && ids[String(x.r.v61id)]));
            let rec = null;
            if (won.length)
                rec = won[won.length - 1].r;
            else if (R1.length)
                rec = R1[0].r;
            if (!rec && !R.length)
                return;
            if (rec) {
                try {
                    v61dlId(rec);
                }
                catch (e) { }
            }
            const ok = shipStartCase(rec ? { cty: cn(rec.c || c.cty), buyer: rec.b || nm, src: "fb", v61rec: rec } : { cty, buyer: nm, src: "my" });
            try {
                const S = SHIPS[SHIPA] && SHIPS[SHIPA].ship;
                if (ok && S && norm(S.buyer) === norm(rec ? rec.b : nm)) {
                    S.v92case = c.id;
                    if (!rec && R.length)
                        S.v92r9aOther = 1;
                }
            }
            catch (e) { }
        }
        catch (e) {
            warn("pickDoc", e);
        }
    };
    API.pickDoc = pickDoc;
    try {
        if (typeof shipUse === "function") {
            const o = shipUse;
            shipUse = function (i) {
                try {
                    if (WANT && Date.now() - WANT.at < 1000 && i !== WANT.i && SHIPS[i] && SHIPS[WANT.i] && SHIPS[i].ship && norm(SHIPS[i].ship.buyer) === WANT.k) {
                        const j = WANT.i;
                        WANT = null;
                        return o.call(this, j);
                    }
                }
                catch (e) { }
                return o.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("shipUse-wrap", e);
    }
    try {
        window.addEventListener("click", (e) => {
            try {
                const tg = e.target && e.target.closest ? e.target : null;
                if (!tg)
                    return;
                const b = tg.closest('.k-cd [data-kbc="ops:doc"]');
                if (b && W.RDX && W.RDX._case0) {
                    pickDoc(W.RDX._case0);
                    setTimeout(() => { WANT = null; }, 0);
                }
            }
            catch (x) { }
        }, true);
    }
    catch (e) { }
    const sh = (b) => { const t = String(b || "").replace(/ (Ltd|Co|Inc|Pte|LLC|GmbH|JSC|SARL|DMCC|Sdn|Corp|Corporation|Company|Limited|S\.A|S\.L)\b\.?.*$/i, "").trim(); return t.length > 20 ? t.slice(0, 19) + "…" : t; };
    const qtyS = (S) => fmtQty(String((S && S.qty) || "").split("（")[0]);
    const tabLabel = (S) => {
        const b = isMihon(S) ? "" : sh(S.buyer);
        const q = qtyS(S), tot = String(S.total || "").trim();
        const body = [q && q !== "—" ? q : "", tot && /\d/.test(tot) ? tot : ""].filter(Boolean).join("・");
        return {
            t: `${S.no}｜${b ? b + "（" + (S.country || "") + "）" : (S.country || "")}${body ? "｜" + body : ""}`,
            title: `${S.no}｜${S.buyer || ""}（${S.country || ""}）${body ? "｜" + [q, S.unitPrice ? "× " + S.unitPrice : "", tot ? "＝ " + tot : ""].filter(Boolean).join(" ") : ""}`,
        };
    };
    const paintTabs = (root) => {
        try {
            if (typeof SHIPS === "undefined" || !Array.isArray(SHIPS))
                return;
            root.querySelectorAll('[data-onclick^="shipActivate("]').forEach((b) => {
                const m = String(b.getAttribute("data-onclick") || "").match(/^shipActivate\((\d+)\);render\(\)$/);
                if (!m)
                    return;
                const C = SHIPS[+m[1]], S = C && C.ship;
                if (!S || !S.no)
                    return;
                const L = tabLabel(S);
                const sig = L.t;
                if (b.getAttribute("data-r9a") === sig)
                    return;
                const tn = Array.from(b.childNodes).find((x) => x.nodeType === 3 && String(x.nodeValue || "").indexOf(String(S.no)) >= 0);
                if (!tn)
                    return;
                const po = / 📥\s*$/.test(String(tn.nodeValue || "")) ? " 📥" : "";
                tn.nodeValue = (/^\s/.test(String(tn.nodeValue)) ? " " : "") + L.t + po;
                b.setAttribute("data-r9a", sig);
                b.setAttribute("data-noi18n", "1");
                b.title = L.title;
            });
        }
        catch (e) {
            warn("tabs", e);
        }
    };
    const ordInfo = (S) => {
        try {
            if (!S || !S.no || isMihon(S))
                return null;
            const has = (x) => x && Array.isArray(x.v92ord) && x.v92ord.some((o) => (o.ships || []).indexOf(S) >= 0 || (o.ships || []).some((T) => T && String(T.no) === String(S.no)));
            let c = null;
            try {
                const A = dashAgg(dashScopeUnits());
                c = ((A && A.v92won) || []).find(has) || null;
            }
            catch (e) { }
            if (!c)
                c = casesAll().find(has);
            if (!c)
                return null;
            const L = c.v92ord;
            const i = L.findIndex((o) => (o.ships || []).some((T) => T === S || (T && String(T.no) === String(S.no))));
            if (i < 0)
                return null;
            return { c, i, n: L.length, o: L[i], rest: L.filter((o) => o.k === "rec") };
        }
        catch (e) {
            return null;
        }
    };
    API.ordInfo = ordInfo;
    const boxShown = (S) => {
        try {
            const a = R7().askOf ? R7().askOf(S) : null;
            if (!a || a.kind !== "more")
                return false;
            const B = recsForCase({ name: S.buyer, cty: "" });
            const L = S.v61fb || {};
            const cu = B.findIndex((x) => x.r.v61id === L.id);
            const ids = linkedIds();
            return cu > 0 && B.slice(0, cu).some((x) => x.r.st === "受注" && !(x.r.v61id && ids[String(x.r.v61id)]));
        }
        catch (e) {
            return false;
        }
    };
    const paintOrd = () => {
        try {
            if (typeof cur === "undefined" || cur !== "ops" || typeof opsTab === "undefined" || opsTab !== "doc")
                return;
            const st = document.querySelector(".stage") || document.getElementById("well") || document.body;
            if (!st)
                return;
            paintTabs(st);
            const bar = st.querySelector(".v92f-case");
            const S = dd() && dd().ship;
            const old = st.querySelector(".v92r9a-ord");
            const I = S ? ordInfo(S) : null;
            if (!bar || !I || (I.n < 2 && !I.rest.length)) {
                if (old)
                    old.remove();
                return;
            }
            const o = I.o, r = o.rec && o.rec.r;
            const src = o.k === "base" ? "" : r ? M(`受注の記録 ${r.d || ""}：${recTxt(r)}`, `order record ${r.d || ""}: ${recTxt(r)}`, `接单记录 ${r.d || ""}：${recTxt(r)}`, `registro del pedido ${r.d || ""}: ${recTxt(r)}`)
                : o.k === "po" ? M("取り込んだ発注書", "imported purchase order", "导入的订购单", "orden de compra importada") : "";
            let t = M(`注文：この書類は、この相手の注文 ${I.n}件のうち ${I.i + 1}件目です${src ? "（" + src + "）" : ""}。番号は記録した順で、分析の内訳と同じです`, `Order: these documents are order ${I.i + 1} of ${I.n} from this buyer${src ? " (" + src + ")" : ""}. Orders are numbered in the order they were recorded, as in the analytics breakdown`, `订单：本单据是该客户 ${I.n} 个订单中的第 ${I.i + 1} 个${src ? "（" + src + "）" : ""}。编号按记录顺序，与分析明细相同`, `Pedido: estos documentos son el pedido ${I.i + 1} de ${I.n} de este comprador${src ? " (" + src + ")" : ""}. Se numeran en el orden de registro, como en el desglose`);
            const rest = I.rest.filter((x) => x !== o);
            if (rest.length && !boxShown(S)) {
                const items = rest.map((x) => `${(x.rec && x.rec.r && x.rec.r.d) || ""}${M("：", ": ", "：", ": ")}${x.rec && x.rec.r ? recTxt(x.rec.r) : ""}`).join(M("／", " / ", "／", " / "));
                t += M(`。書類のまだ無い「受注」の記録が ${rest.length}件あります（${items}）。その記録の「出荷案件を作る」で、その注文の書類を作れます`, `. ${rest.length} “Order” record(s) have no documents yet (${items}); create them with “Create a shipment case” on that record`, `。还有 ${rest.length} 条尚无单据的“接单”记录（${items}），可在该记录的“创建出货案件”中制作`, `. Hay ${rest.length} registro(s) de «Pedido» sin documentos (${items}); créelos con «Crear el caso de envío» en ese registro`);
            }
            if (old && old.getAttribute("data-t") === t)
                return;
            const el = old || document.createElement("div");
            el.className = "v92r9a-ord";
            el.setAttribute("data-noi18n", "1");
            el.setAttribute("data-t", t);
            el.textContent = t;
            if (!old)
                bar.appendChild(el);
        }
        catch (e) {
            warn("paintOrd", e);
        }
    };
    API.paintOrd = paintOrd;
    const soon = (f, L) => { try {
        L.forEach((ms) => setTimeout(f, ms));
    }
    catch (e) { } };
    try {
        if (typeof render === "function") {
            const o = render;
            render = function () {
                const r = o.apply(this, arguments);
                soon(paintOrd, [40, 360, 1150]);
                return r;
            };
        }
    }
    catch (e) {
        warn("render-wrap", e);
    }
    const ymd = (s) => { try {
        if (typeof v92docYmd === "function")
            return v92docYmd(s) || "";
    }
    catch (e) { } const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || "")); return m ? m[0] : ""; };
    const addD = (s, n) => { try {
        if (typeof v92docAdd === "function")
            return v92docAdd(s, n);
    }
    catch (e) { } const d = new Date(s + "T00:00:00Z"); return isNaN(d.getTime()) ? "" : new Date(d.getTime() + n * 864e5).toISOString().slice(0, 10); };
    try {
        if (typeof v92docValid === "function") {
            const o = v92docValid;
            v92docValid = function (S, t) {
                const V = o.apply(this, arguments);
                try {
                    let today = "";
                    try {
                        today = String(TODAYS || "").slice(0, 10);
                    }
                    catch (e) { }
                    const date = ymd(S && (S.date || S.orderDate)) || ymd(today);
                    if (!V || !date || V.date === date)
                        return V;
                    const d30 = addD(date, 30), pu = String(V.pu || "");
                    if (pu && pu < date)
                        return Object.assign({}, V, { date, d30, why: "exp", until: "", en: "[To be confirmed] (price list expired on " + pu + ")" });
                    if (pu && pu < d30)
                        return Object.assign({}, V, { date, d30, why: "price", until: pu, en: "Until " + pu + " (price list validity)" });
                    return Object.assign({}, V, { date, d30, why: "30", until: d30, en: "30 days (until " + d30 + ")" });
                }
                catch (e) {
                    warn("valid", e);
                }
                return V;
            };
        }
    }
    catch (e) {
        warn("valid-wrap", e);
    }
    try {
        if (typeof v85docSet === "function") {
            const o = v85docSet;
            v85docSet = function (k) {
                const r = o.apply(this, arguments);
                try {
                    if ((k === "mode" || k === "inc") && document.getElementById("dO") && typeof rDoc === "function") {
                        const kk = String(W.__poDocK || "pi");
                        setTimeout(() => { try {
                            if (document.getElementById("dO"))
                                rDoc(kk);
                        }
                        catch (e) { } }, 0);
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("docset-wrap", e);
    }
    const modeNow = (S) => {
        try {
            if (typeof v85docCase === "function") {
                const c = v85docCase() || {};
                const m = String((c.inp && c.inp.mode) || "");
                if (m)
                    return m;
            }
        }
        catch (e) { }
        try {
            if (typeof v85docModeOf === "function")
                return String(v85docModeOf(S) || "sea");
        }
        catch (e) { }
        return /^AIR$/i.test(String((S && S.mode) || "")) ? "air" : "sea";
    };
    const AIRPORT = /空港|airport|\bAPT\b|Aeropuerto|机场/i;
    try {
        if (typeof v92docPolNote === "function") {
            const o = v92docPolNote;
            v92docPolNote = function (S) {
                const h = o.apply(this, arguments);
                try {
                    if (!S)
                        return h;
                    const cd = typeof v92docCode === "function" ? v92docCode(S.term) : "";
                    const place = cd && typeof v92docPlace === "function" ? String(v92docPlace(S.term, cd) || "") : "";
                    if (!place || !AIRPORT.test(place))
                        return h;
                    if (/^(air|courier|post)$/.test(modeNow(S)))
                        return "";
                    return `<span data-noi18n>${E(M(`建値の場所は ${place}（空港）です。航空で送るなら、上の判断の表の「輸送」を「航空」にしてください（請求書・船積依頼書も航空の書き方になります）。`, `The delivery place is ${place} (an airport). If you ship by air, set “Transport” to air in the table above (the invoice and shipping instructions then use air wording).`, `交货地点为 ${place}（机场）。如走空运，请在上方判断表中把“运输”改为空运（发票和托运单也会改为空运的写法）。`, `El lugar de entrega es ${place} (un aeropuerto). Si envía por avión, ponga «Transporte» en aéreo en la tabla superior (la factura y las instrucciones usarán términos aéreos).`))}</span>`;
                }
                catch (e) {
                    warn("pol", e);
                }
                return h;
            };
        }
    }
    catch (e) {
        warn("pol-wrap", e);
    }
    const priceTxt = (f) => {
        try {
            const p = effP(f);
            if (!p || !p.s)
                return null;
            const fixed = !p.prov && !!(f && typeof v61dlIsPrice === "function" && v61dlIsPrice(f.fixPrice));
            return { s: String(p.s), fixed };
        }
        catch (e) {
            return null;
        }
    };
    API.priceTxt = priceTxt;
    try {
        if (typeof a30Collect === "function") {
            const o = a30Collect;
            a30Collect = function () {
                const out = o.apply(this, arguments);
                try {
                    const seen = [];
                    Object.keys(out || {}).forEach((k) => (Array.isArray(out[k]) ? out[k] : []).forEach((x) => {
                        if (!x || !x.f || !isObj(x.f) || seen.indexOf(x) >= 0)
                            return;
                        seen.push(x);
                        const f = x.f;
                        const P = priceTxt(f);
                        if (!P || !P.fixed)
                            return;
                        if (k !== "lost") {
                            const t0 = String(x.txt || "");
                            const t1 = f.price && t0.indexOf("希望価格 " + f.price) >= 0 ? t0.replace("希望価格 " + f.price, "単価 " + P.s + "（希望価格 " + f.price + "）") : [f.st, "単価 " + P.s, f.lot && ("数量 " + f.lot)].filter(Boolean).join("・");
                            if (!/^[^・\s]+-\d/.test(t0))
                                x.txt = t1;
                        }
                        x.f = Object.assign({}, f, { price: P.s });
                    }));
                    seen.forEach((x) => { const f = x.f; const P = priceTxt(f); if (P && !P.fixed && f.price && !/^希望 /.test(String(f.price)))
                        x.f = Object.assign({}, f, { price: "希望 " + f.price }); });
                }
                catch (e) {
                    warn("a30", e);
                }
                return out;
            };
        }
    }
    catch (e) {
        warn("a30-wrap", e);
    }
    const commas = (s) => String(s == null ? "" : s).replace(/((?:^|[^\d.,])(?:[A-Z]{3} ?|US\$|[¥$]))(\d{4,})(\.\d+)?(?![\d,])/g, (m, a, b, c) => a + Number(b).toLocaleString("en-US") + (c || ""));
    API.commas = commas;
    try {
        if (typeof v56dCmpParts === "function") {
            const o = v56dCmpParts;
            v56dCmpParts = function () {
                const P = o.apply(this, arguments);
                try {
                    if (P && typeof P.buyer === "string")
                        P.buyer = commas(P.buyer);
                    if (P && typeof P.own === "string")
                        P.own = commas(P.own);
                }
                catch (e) { }
                return P;
            };
        }
    }
    catch (e) { }
    try {
        if (typeof openStepEdit === "function") {
            const o = openStepEdit;
            openStepEdit = function (i) {
                const r = o.apply(this, arguments);
                try {
                    const g = document.getElementById("seGo"), q = document.getElementById("seQ");
                    if (i === 0 && g && q && !g.dataset.v92r9a) {
                        g.dataset.v92r9a = "1";
                        g.addEventListener("click", () => {
                            try {
                                const x = nfkc(q.value).trim();
                                const m = x.match(/^([\d,]+(?:\.\d+)?)\s*([^\d\s,.]{1,6})$/);
                                if (m) {
                                    const n = parseFloat(m[1].replace(/,/g, ""));
                                    if (n > 0)
                                        q.value = n.toLocaleString("en-US", { maximumFractionDigits: 3 }) + m[2];
                                }
                            }
                            catch (e) { }
                        }, true);
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { }
    const docTidy = () => {
        try {
            const o = document.getElementById("dO");
            if (!o)
                return;
            Array.from(o.querySelectorAll(".doc td")).forEach((td) => {
                if (td.children.length)
                    return;
                const t = String(td.textContent || "");
                const t2 = t.replace(/(^|[\s/])(\d{4,})(\s*pcs\b)/g, (m, a, b, c) => a + Number(b).toLocaleString("en-US") + c);
                if (t2 !== t)
                    td.textContent = t2;
            });
            const sp = o.querySelector(".v92r5a-src");
            if (sp && !sp.getAttribute("data-r9a")) {
                const t = String(sp.textContent || "");
                const t2 = t.replace(/(商談の記録は [^／]*／)([\d,]+(?:\.\d+)?)(／)/, (m, a, b, c) => a + fmtQty(b) + c);
                sp.setAttribute("data-r9a", "1");
                if (t2 !== t)
                    sp.textContent = t2;
            }
            try {
                const S0 = dd() && dd().ship;
                const f1 = W.v68trPack, f2 = W.v68trPackNote;
                if (String(W.__poDocK || "") === "pl" && S0 && typeof f1 === "function" && typeof f2 === "function" && !o.querySelector(".v68trnote, .v92r9a-pl") && !/寸法表の外装の情報から計算|calculated from the carton information/.test(String(o.textContent || ""))) {
                    const R = f1(S0);
                    const rowTxt = String((o.querySelector(".doc table tbody tr") || {}).textContent || "");
                    if (R && R.cartons && rowTxt.indexOf(R.cartons + " CTN") >= 0) {
                        const tmp = document.createElement("div");
                        tmp.innerHTML = String(f2(S0) || "");
                        const sp0 = tmp.querySelector("span");
                        let t = sp0 ? String(sp0.textContent || "") : "";
                        if (t && !R.gw)
                            t = t.replace("カートン数・重量は、", "カートン数は、").replace("Cartons and weights are calculated", "Cartons are calculated");
                        if (t) {
                            const main = Array.from(o.querySelectorAll("p.nn")).find((x) => x.querySelector("button"));
                            const sp = document.createElement("span");
                            sp.className = "v92r9a-pl";
                            sp.setAttribute("data-noi18n", "1");
                            sp.textContent = t;
                            if (main) {
                                main.insertBefore(document.createElement("br"), main.firstChild);
                                main.insertBefore(sp, main.firstChild);
                            }
                            else {
                                const pp = document.createElement("p");
                                pp.className = "nn";
                                pp.appendChild(sp);
                                const dc = o.querySelector(".doc");
                                if (dc)
                                    dc.insertAdjacentElement("afterend", pp);
                                else
                                    o.appendChild(pp);
                            }
                        }
                    }
                }
            }
            catch (e) { }
            const S = dd() && dd().ship;
            if (S && S.v92r9aOther) {
                const p = Array.from(o.querySelectorAll("p.nn")).find((x) => /^商談記録の/.test(String(x.textContent || "").trim()) || /^(The meeting record|商谈记录|El registro)/.test(String(x.textContent || "").trim()));
                if (p && !p.getAttribute("data-r9a")) {
                    const items = [];
                    recsForCase({ name: S.buyer, cty: S.country }).forEach((x) => { const it = String(x.r.item || "").trim(); if (it && !sameItem(x.r) && items.indexOf(it) < 0)
                        items.push(it); });
                    const v = [String(S.unitPrice || ""), String(S.qty || "").split("（")[0], String(S.term || "")].filter(Boolean).join("／");
                    const t = M(`商品情報（価格表・最小発注数量・取引条件）の値 ${v} を入れています。${items.length ? `この相手の商談の記録（${items.join("・")}）は別の商品の記録なので、書類には入れていません。` : ""}数量・単価は「受注内容を編集」で直せます。`, `Values from the product information (price list, MOQ, trade term) are used: ${v}. ${items.length ? `This buyer's meeting records (${items.join(", ")}) are for another product, so they are not used. ` : ""}Change quantity and price in “Edit order details”.`, `使用了商品信息（价目表・最小起订量・贸易条件）的值 ${v}。${items.length ? `该客户的商谈记录（${items.join("・")}）属于其他商品，未写入单据。` : ""}数量・单价可在“编辑订单内容”中修改。`, `Se usan los valores de la ficha del producto (lista de precios, MOQ, condición): ${v}. ${items.length ? `Los registros de este comprador (${items.join(", ")}) son de otro producto y no se usan. ` : ""}Cambie cantidad y precio en «Editar pedido».`);
                    const keep = Array.from(p.querySelectorAll("button"));
                    p.textContent = t;
                    keep.forEach((b) => { p.appendChild(document.createTextNode("　")); p.appendChild(b); });
                    p.setAttribute("data-r9a", "1");
                    p.setAttribute("data-noi18n", "1");
                }
            }
        }
        catch (e) { }
    };
    API.docTidy = docTidy;
    try {
        document.addEventListener("click", () => { setTimeout(docTidy, 500); setTimeout(docTidy, 1700); }, false);
    }
    catch (e) { }
    try {
        if (typeof render === "function") {
            const o = render;
            render = function () { const r = o.apply(this, arguments); soon(docTidy, [80, 760]); return r; };
        }
        if (typeof rDoc === "function") {
            const o2 = rDoc;
            rDoc = function () { const r = o2.apply(this, arguments); soon(docTidy, [0, 120]); soon(paintOrd, [30]); return r; };
        }
    }
    catch (e) { }
    const looseNos = () => allShips().filter((S) => S && !S.v61fb && !S.poNo && !isMihon(S) && (S.v54copy || S.v56shipFb)).map((S) => String(S.no));
    try {
        if (typeof dealSave === "function") {
            const o = dealSave;
            dealSave = function () {
                let before = [];
                try {
                    before = looseNos();
                }
                catch (e) { }
                const r = o.apply(this, arguments);
                const fin = () => {
                    setTimeout(() => {
                        try {
                            if (!before.length)
                                return;
                            const now = looseNos();
                            const L = before.filter((no) => now.indexOf(no) < 0).map((no) => allShips().find((S) => S && String(S.no) === no && S.v61fb)).filter(Boolean);
                            if (!L.length || typeof toast !== "function")
                                return;
                            const S = L[0];
                            let tm = String(S.term || "");
                            try {
                                const rf = W.v61dlRecById;
                                const rec = (S.v61fb && typeof rf === "function") ? rf(S.v61fb.id) : null;
                                const t = rec && typeof v61dlRecTerm === "function" ? v61dlRecTerm(rec) : null;
                                if (t && t.code)
                                    tm = (t.code + " " + (t.place || "")).trim();
                            }
                            catch (e) { }
                            const v = [String(S.qty || "").split("（")[0], S.unitPrice, tm].filter(Boolean).join("・");
                            toast(M(`新しい記録に合わせて、書類（${L.map((x) => x.no).join("・")}）の値を更新しました：${v}`, `Documents (${L.map((x) => x.no).join(", ")}) were updated from the new record: ${v}`, `已按新记录更新单据（${L.map((x) => x.no).join("・")}）：${v}`, `Documentos (${L.map((x) => x.no).join(", ")}) actualizados con el nuevo registro: ${v}`));
                        }
                        catch (e) {
                            warn("loose-toast", e);
                        }
                    }, 1100);
                };
                try {
                    if (r && typeof r.then === "function")
                        r.then(fin, fin);
                    else
                        fin();
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("dealSave-wrap", e);
    }
    let LASTK = null;
    try {
        window.addEventListener("click", (e) => {
            try {
                const b = e.target && e.target.closest && e.target.closest('[data-v92r7a-ask="keep"]');
                if (!b)
                    return;
                const box = b.closest(".v92r7a-ask");
                LASTK = { more: !!(box && box.querySelector('[data-v92r7a-ask="rec"]')), at: Date.now() };
            }
            catch (x) { }
        }, true);
        if (typeof toast === "function") {
            const o = toast;
            toast = function (m) {
                try {
                    if (LASTK && LASTK.more && Date.now() - LASTK.at < 1500 && /^(書類はこのままにしました（内訳の窓には|Documents kept as they are \(the breakdown|单据保持不变（明细窗口|Los documentos se dejaron como están)/.test(String(m || ""))) {
                        LASTK = null;
                        return o.call(this, M("書類はこのままにしました。書類のまだ無い受注の記録は、別の注文として累計受注金額に足しています（分析の内訳に注文ごとに出ます）", "Documents kept as they are. Order records without documents are added to the total order value as separate orders (shown per order in the breakdown)", "单据保持不变。尚无单据的接单记录作为另外的订单计入累计接单金额（在分析明细中按订单显示）", "Documentos sin cambios. Los registros de pedido sin documentos se suman al total como pedidos aparte (se ven por pedido en el desglose)"));
                    }
                }
                catch (e) { }
                return o.apply(this, arguments);
            };
        }
    }
    catch (e) { }
    try {
        if (typeof dashDrill === "function") {
            const o = dashDrill;
            dashDrill = function () {
                const r = o.apply(this, arguments);
                try {
                    const root = document.getElementById("v92r6bDrill");
                    if (root && root.getAttribute("data-kind") === "orders" && !root.getAttribute("data-r9a")) {
                        root.setAttribute("data-r9a", "1");
                        const A = dashAgg(dashScopeUnits());
                        const won = (A && A.v92won) || [];
                        const nShip = won.reduce((s, c) => s + ((c.v92ord || []).reduce((t, x) => t + ((x.ships || []).length ? 1 : 0), 0)), 0);
                        const nCase = won.length;
                        const p = root.querySelector("p.nn");
                        if (p && nShip > nCase) {
                            const t = String(p.textContent || "");
                            const t2 = t.replace(/受注が決まった案件 (\d+)件（注文 (\d+)件）・/, (m, a, b) => `受注が決まった案件 ${a}件（相手ごと。注文 ${b}件・うち書類のある出荷案件 ${nShip}件）・`)
                                .replace(/(\d+) confirmed order case\(s\) \((\d+) orders\), /, (m, a, b) => `${a} confirmed order case(s) (per buyer; ${b} orders, ${nShip} shipment case(s) with documents), `)
                                .replace(/已确认订单的案件 (\d+)件（订单 (\d+)个）/, (m, a, b) => `已确认订单的案件 ${a}件（按客户；订单 ${b}个，其中有单据的出货案件 ${nShip}件）`);
                            if (t2 !== t)
                                p.textContent = t2;
                        }
                    }
                }
                catch (e) {
                    warn("drill", e);
                }
                return r;
            };
        }
    }
    catch (e) { }
    const fmtCur = (a) => {
        const v = +a.v || 0;
        if (a.cur === "USD")
            return "US$" + v.toLocaleString("en-US", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
        if (a.cur === "JPY")
            return "¥" + Math.round(v).toLocaleString("en-US");
        return (a.cur || "") + " " + v.toLocaleString("en-US", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
    };
    const sumBy = (P) => { const out = []; (P || []).forEach((p) => { if (!p || !(p.v > 0) || !p.cur)
        return; const x = out.find((y) => y.cur === p.cur); if (x)
        x.v = Math.round((x.v + p.v) * 100) / 100;
    else
        out.push({ cur: p.cur, v: p.v }); }); return out; };
    const mergeBase = (A) => {
        if (!A || A.per || A.v92r9aB || !Array.isArray(A.orders) || !Array.isArray(A.v92won))
            return;
        A.v92r9aB = 1;
        const base = A.orders.filter((x) => x && x.src === "base");
        A.v92baseAll = base.slice();
        if (!base.length)
            return;
        let merged = 0;
        A.v92won.forEach((c) => {
            if (!c || !Array.isArray(c.v92ord))
                return;
            const x = base.find((b) => b && norm(b.buyer) === norm(c.buyer) && (!b.ref || !c.ref || b.ref === c.ref) && A.orders.indexOf(b) >= 0);
            if (!x || !x.a || !(x.a.v > 0))
                return;
            const d = String(x.dISO || "").slice(0, 10);
            if (!c.v92base) {
                const part = { cur: x.a.cur, v: x.a.v, docRate: +x.docRate || 0, d, v92base: 1 };
                const o = { k: "base", base: x, ships: [], rec: { r: { lot: x.qty, d }, fi: "" }, ra: { unit: x.unit, prov: 0 }, parts: [part], d, i: -1 };
                c.v92ord.unshift(o);
                c.v92ord.sort((a, b) => String(a.d).localeCompare(String(b.d)));
                c.v92parts = [part].concat(c.v92parts || []);
                c.v92sums = sumBy(c.v92parts);
                c.v92base = { no: x.no, d, total: x.total, qty: x.qty, unit: x.unit };
            }
            const row = A.orders.find((y) => y && y.v92c === c);
            if (row) {
                const bp = c.v92parts.find((p) => p && p.v92base);
                const P = Array.isArray(row.v92p) ? row.v92p.slice() : (c.v92parts || []).filter((p) => !p.v92base);
                if (bp && !P.some((p) => p && p.v92base))
                    P.unshift(bp);
                row.v92p = P;
                const S = sumBy(P);
                row.a = S.length ? { cur: S[0].cur, v: S[0].v } : row.a;
                row.total = S.length ? S.map(fmtCur).join(" ＋ ") : row.total;
                if (P.length > 1)
                    row.docRate = 0;
            }
            A.orders.splice(A.orders.indexOf(x), 1);
            merged++;
        });
        if (!merged)
            return;
        A.v92r9aMerged = merged;
        let nOrd = 0;
        A.orders.forEach((x) => { const c = x && x.v92c; nOrd += (c && Array.isArray(c.v92ord)) ? Math.max(1, c.v92ord.length) : 1; });
        A.v92nOrd = nOrd;
        try {
            A.money = dashMoney(A.orders);
        }
        catch (e) {
            warn("base-money", e);
        }
        if (A.K)
            A.K.won = Math.max(0, (+A.K.won || 0) - merged);
        try {
            if (Array.isArray(A.funnel))
                [/見積/, /サンプル/, /受注/].forEach((re) => { const i = A.funnel.findIndex((r) => r && re.test(String(r[0] || ""))); if (i >= 0)
                    A.funnel[i] = [A.funnel[i][0], Math.max(0, (+A.funnel[i][1] || 0) - merged)].concat(A.funnel[i].slice(2)); });
            if (A.v92fun)
                ["won", "rq", "rs"].forEach((k) => { if (A.v92fun[k] != null)
                    A.v92fun[k] = Math.max(0, (+A.v92fun[k] || 0) - merged); });
        }
        catch (e) { }
    };
    API.mergeBase = mergeBase;
    try {
        if (typeof dashAgg === "function") {
            const o = dashAgg;
            dashAgg = function () {
                const A = o.apply(this, arguments);
                try {
                    mergeBase(A);
                }
                catch (e) {
                    warn("mergeBase", e);
                }
                return A;
            };
        }
    }
    catch (e) { }
    try {
        if (typeof vDash === "function") {
            const o = vDash;
            vDash = function () {
                let h = o.apply(this, arguments);
                try {
                    if (typeof h !== "string")
                        return h;
                    const A = dashAgg(dashScopeUnits());
                    const m = +(A && A.v92r9aMerged) || 0;
                    if (m)
                        h = h.replace(/受注に進んだ (\d+)件＋見本の決まった数/, (x, n) => `受注に進んだ ${n}件（うち ${m}件は見本の受注と同じ相手なので、見本の決まった数のほうで数えています）＋見本の決まった数`);
                }
                catch (e) { }
                return h;
            };
        }
    }
    catch (e) { }
    const baseCards = () => {
        try {
            const root = document.getElementById("v92r6bDrill");
            if (!root || root.getAttribute("data-r9ab"))
                return;
            const A = dashAgg(dashScopeUnits());
            if (!A || !A.v92r9aMerged)
                return;
            root.setAttribute("data-r9ab", "1");
            const kind = root.getAttribute("data-kind");
            const won = A.v92won || [], quo = A.v92quo || [];
            const ALL = kind === "quotes" ? quo.concat(won) : won.concat(quo);
            ALL.forEach((c, ci) => {
                if (!c || !c.v92base || !Array.isArray(c.v92ord))
                    return;
                const cards = Array.from(root.querySelectorAll(`.v92r8a-ord[data-v92r8a-ci="${ci}"]`));
                c.v92ord.forEach((o, j) => {
                    if (o.k !== "base")
                        return;
                    const cd = cards[j];
                    if (!cd)
                        return;
                    const no = cd.querySelector(".v92r6b-no");
                    if (no)
                        no.textContent = c.v92base.no || "";
                    const ed = cd.querySelector(".v92r8a-ed");
                    if (ed)
                        ed.remove();
                    const c4 = cd.querySelector(".v92r6b-c4");
                    if (c4)
                        c4.textContent = M("金額の出どころ：見本のデータ（見本の受注。同じ相手からの1件目の注文として数えています）", "Amount source: sample data (the sample order, counted as the first order from this buyer)", "金额来源：示例数据（示例订单，计为该客户的第一个订单）", "Origen: datos de muestra (pedido de muestra, contado como el primer pedido de este comprador)");
                });
            });
        }
        catch (e) {
            warn("baseCards", e);
        }
    };
    try {
        if (typeof dashDrill === "function") {
            const o = dashDrill;
            dashDrill = function () { const r = o.apply(this, arguments); try {
                baseCards();
            }
            catch (e) { } return r; };
        }
    }
    catch (e) { }
    try {
        if (typeof dealSave === "function") {
            const o = dealSave;
            dealSave = function () {
                let b = "", st = "";
                try {
                    b = String((document.getElementById("dfB") || {}).value || "").trim();
                    st = String((document.getElementById("dfSt") || {}).value || "");
                }
                catch (e) { }
                const r = o.apply(this, arguments);
                const fin = () => setTimeout(() => {
                    try {
                        if (!b || st !== "受注")
                            return;
                        const A = dashAgg(dashScopeUnits());
                        const x = ((A && A.v92baseAll) || []).find((y) => y && norm(y.buyer) === norm(b));
                        if (!x)
                            return;
                        const box = document.getElementById("dfAI");
                        if (!box || box.querySelector(".v92r9a-base"))
                            return;
                        const d = document.createElement("div");
                        d.className = "v92r9a-base";
                        d.setAttribute("data-noi18n", "1");
                        d.textContent = M(`この相手（${x.buyer}）には見本の受注（${x.no}・${x.total}）があります。この記録は同じ相手からの別の注文として、累計受注金額に足しています（「初めての受注」「初回受注」の数は増えません。分析の内訳では、この相手の注文として並びます）。`, `This buyer (${x.buyer}) already has the sample order (${x.no}, ${x.total}). This record is added to the total order value as a separate order from the same buyer (the “first order” count does not increase; the breakdown lists it under this buyer).`, `该客户（${x.buyer}）已有示例订单（${x.no}・${x.total}）。本记录作为同一客户的另一个订单计入累计接单金额（“首次接单”数不增加）。`, `Este comprador (${x.buyer}) ya tiene el pedido de muestra (${x.no}, ${x.total}). Este registro se suma al total como otro pedido del mismo comprador (el número de «primeros pedidos» no aumenta).`);
                        const first = box.firstElementChild;
                        if (first)
                            first.insertAdjacentElement("afterend", d);
                        else
                            box.appendChild(d);
                    }
                    catch (e) {
                        warn("base-note", e);
                    }
                }, 300);
                try {
                    if (r && typeof r.then === "function")
                        r.then(fin, fin);
                    else
                        fin();
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { }
    try {
        const stl = document.createElement("style");
        stl.id = "v92r9a-css";
        stl.textContent = ".v92r9a-base{margin:7px 0 0;padding:8px 11px;border:1px solid #e0b252;background:#fff8e6;border-radius:9px;font-size:11.5px;line-height:1.6;color:#4a3a10}.v92r9a-ord{flex:1 1 100%;margin:2px 0 0;font-size:11.5px;line-height:1.6;color:var(--ink-2,#444)}";
        (document.head || document.documentElement).appendChild(stl);
    }
    catch (e) { }
})();
