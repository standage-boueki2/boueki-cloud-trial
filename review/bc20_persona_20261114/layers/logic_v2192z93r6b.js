(function () {
    const W = window;
    if (W.__v2192r6b)
        return;
    W.__v2192r6b = 1;
    const API = (W.v92r6b = W.v92r6b || {});
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const lang = () => { try {
        if (typeof I18N !== "undefined" && I18N && I18N.lang) {
            const v = String(I18N.lang);
            return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
        }
    }
    catch (e) { } return "ja"; };
    const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const warn = (k, e) => { try {
        console.warn("[v92r6b] " + k, e);
    }
    catch (x) { } };
    const ten = () => { try {
        return (typeof TEN !== "undefined" && TEN) ? TEN : null;
    }
    catch (e) {
        return null;
    } };
    const dd = () => { try {
        return (typeof D !== "undefined" && D) ? D : null;
    }
    catch (e) {
        return null;
    } };
    const tensAll = () => { try {
        return (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS : [];
    }
    catch (e) {
        return [];
    } };
    const norm = (s) => { try {
        if (typeof v30Norm === "function")
            return v30Norm(s);
    }
    catch (e) { } return String(s || "").toLowerCase().replace(/[\s.,　・\-]/g, ""); };
    const cnt = (a) => Array.isArray(a) ? a.length : 0;
    const ST = { talk: "商談中", quote: "見積提示", nego: "契約交渉", won: "取引中", lost: "失注" };
    const ST_IDX = { "コンタクト中": 0, "商談中": 1, "サンプル出荷": 2, "見積提示": 3, "契約交渉": 4, "取引中": 5 };
    const stShort = (s) => String(s || "").replace(/（.*$/, "");
    const CODE = { "US$": "USD", "USD": "USD", "$": "USD", "¥": "JPY", "￥": "JPY", "JPY": "JPY", "円": "JPY", "€": "EUR", "EUR": "EUR", "ユーロ": "EUR", "£": "GBP", "GBP": "GBP", "RMB": "CNY", "CNY": "CNY", "元": "CNY" };
    const amtX = (s) => {
        const t = String(s == null ? "" : s).trim();
        if (!t)
            return null;
        let m = t.match(/(US\$|USD|EUR|GBP|CNY|RMB|HKD|SGD|THB|AED|TWD|VND|AUD|CAD|CHF|KRW|NZD|MYR|IDR|PHP|INR|JPY|€|£|¥|￥|\$)\s?\$?\s?([\d,]+(?:\.\d+)?)/i);
        if (m) {
            const k = m[1].toUpperCase();
            return { cur: CODE[k] || CODE[m[1]] || k, v: parseFloat(m[2].replace(/,/g, "")) || 0 };
        }
        m = t.match(/([\d,]+(?:\.\d+)?)\s?(円|ユーロ|元|USD|EUR|GBP|CNY|HKD|SGD|THB|AED|TWD|VND|AUD|CAD|CHF|KRW)/i);
        if (m) {
            const k = m[2].toUpperCase();
            return { cur: CODE[m[2]] || CODE[k] || k, v: parseFloat(m[1].replace(/,/g, "")) || 0 };
        }
        try {
            const a = amtParse(t);
            if (a && a.cur && a.v)
                return a;
        }
        catch (e) { }
        return null;
    };
    const fmtCur = (a) => {
        if (!a)
            return "—";
        const v = +a.v || 0;
        if (a.cur === "USD")
            return "US$" + v.toLocaleString("en-US", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
        if (a.cur === "JPY")
            return "¥" + Math.round(v).toLocaleString("en-US");
        return (a.cur || "") + " " + v.toLocaleString("en-US", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
    };
    const rateOf = (cur) => {
        try {
            if (cur === "JPY")
                return { v: 1, d: "", src: "" };
            if (cur === "USD") {
                const r = dashRate();
                return (r && r.v > 0) ? { v: +r.v, d: r.d || "", src: r.live ? "live" : (r.src || "ref") } : null;
            }
            const f = (typeof ddpFx === "function") ? ddpFx() : null;
            const v = f && f.rates ? +f.rates[cur] : 0;
            if (!(v > 0))
                return null;
            const p = (f.per && f.per[cur]) || {};
            return { v, d: p.d || f.at || "", src: p.src || (f.live ? "live" : "ref") };
        }
        catch (e) {
            return null;
        }
    };
    const srcName = (r) => r.src === "ecb" ? M("欧州中央銀行の参照レート", "ECB reference rate", "欧洲央行参考汇率", "tipo de referencia del BCE")
        : (r.src === "live" || r.src === "murc") ? M("公表相場（TTM）", "published TTM", "公布汇率（TTM）", "TTM publicado")
            : M("参照レート", "reference rate", "参考汇率", "tipo de referencia");
    const rateLine = (curs, docRates) => {
        const out = [];
        curs.forEach((c) => {
            if (c === "JPY")
                return;
            const r = rateOf(c);
            if (!r)
                return;
            out.push(`1 ${c === "USD" ? "US$" : c}＝${r.v.toFixed(2)}${M("円", " JPY", "日元", " JPY")}（${srcName(r)}${r.d ? "・" + r.d : ""}）`);
        });
        (docRates || []).forEach((x) => { const t = M(`${x}円（書類に書いたレート）`, `¥${x} (rate on the document)`, `${x}日元（单据上的汇率）`, `¥${x} (tipo del documento)`); if (out.indexOf(t) < 0)
            out.push(t); });
        return out.length ? M("換算：", "Converted at ", "换算：", "Conversión: ") + out.join("／") : "";
    };
    API.rateOf = rateOf;
    try {
        if (typeof dashMoney === "function") {
            const o = dashMoney;
            dashMoney = function (orders) {
                const R = o.apply(this, arguments) || {};
                try {
                    const r = dashRate();
                    let jpy = 0, usd = 0, mixed = 0;
                    const noRate = {}, used = {}, docRates = [];
                    (orders || []).forEach((x) => {
                        const a = (x && x.a) || {};
                        if (!(a.v > 0))
                            return;
                        if (a.cur === "USD") {
                            const rt = x.docRate || r.v;
                            usd += a.v;
                            jpy += a.v * rt;
                            if (x.docRate) {
                                if (docRates.indexOf(x.docRate) < 0)
                                    docRates.push(x.docRate);
                            }
                            else
                                used.USD = 1;
                        }
                        else if (a.cur === "JPY") {
                            jpy += a.v;
                            usd += a.v / (x.docRate || r.v);
                        }
                        else {
                            const q = a.cur ? rateOf(a.cur) : null;
                            if (q) {
                                jpy += a.v * q.v;
                                usd += a.v * q.v / r.v;
                                used[a.cur] = 1;
                            }
                            else {
                                mixed++;
                                const k = a.cur || "?";
                                noRate[k] = (noRate[k] || 0) + a.v;
                            }
                        }
                    });
                    R.jpy = jpy;
                    R.usd = usd;
                    R.mixed = mixed;
                    R.rate = r;
                    R.noRate = noRate;
                    R.used = Object.keys(used);
                    R.docRates = docRates;
                }
                catch (e) {
                    warn("money", e);
                }
                return R;
            };
        }
    }
    catch (e) {
        warn("money-wrap", e);
    }
    const isMihon = (S) => !!S && (/（想定）/.test(String(S.buyer || "")) || /想定シナリオ/.test(String(S.qty || "")));
    const isCopy = (S) => !!(S && S.v54copy && !S.poNo);
    const isPo = (c) => !!(c && (c.po || c.src === "po" || (c.ship && c.ship.poNo)));
    const edited = (S) => { try {
        const m = S && S.v61man;
        return !!(m && (m.qty || m.unitPrice || m.term || m.pay));
    }
    catch (e) {
        return false;
    } };
    const shipped = (c) => { try {
        const S = c && c.ship;
        if (!S)
            return false;
        const bl = String(S.bl || "").trim();
        return (bl && !/未発行|未定|^[（(]/.test(bl)) || (+c.step || 0) >= 6;
    }
    catch (e) {
        return false;
    } };
    const etdOf = (S) => (S && S.v92etdUser && /^\d{4}-\d{2}-\d{2}$/.test(String(S.etd || ""))) ? String(S.etd) : "";
    const tenOfUnit = (u) => { try {
        const T = tensAll();
        if (u && u.i >= 0 && T[u.i])
            return T[u.i];
        if (u && u.act)
            return ten();
    }
    catch (e) { } return null; };
    const shipCasesOf = (u, t) => {
        try {
            if (u && u.act && typeof SHIPS !== "undefined" && Array.isArray(SHIPS) && (typeof PID === "undefined" || SHIPS._pid === PID))
                return SHIPS.filter((c) => c && c.ship);
            const L = [], seen = {};
            [].concat((t && t.shipCases) || [], (t && t.poCases) || []).forEach((c) => { if (c && c.ship && !seen[c.ship.no]) {
                seen[c.ship.no] = 1;
                L.push(c);
            } });
            return L;
        }
        catch (e) {
            return [];
        }
    };
    const recAmt = (r) => {
        try {
            const p = (typeof v61dlEffPrice === "function") ? v61dlEffPrice(r) : null;
            const a = p ? amtX(p.s) : null;
            const q = (typeof v61dlNum === "function") ? v61dlNum(r.lot) : null;
            if (!a || !(a.v > 0) || !(q > 0))
                return null;
            return { cur: a.cur, v: Math.round(a.v * q * 100) / 100, unit: p.s, qty: r.lot, prov: p.prov };
        }
        catch (e) {
            return null;
        }
    };
    const hasFix = (r) => { try {
        const p = (typeof v61dlEffPrice === "function") ? v61dlEffPrice(r) : null;
        return !!(p && !p.prov);
    }
    catch (e) {
        return false;
    } };
    const dayOf = (ms) => { try {
        const d = new Date(+ms);
        if (isNaN(d.getTime()))
            return "";
        return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    catch (e) {
        return "";
    } };
    let CACHE = {};
    const cacheClear = () => { CACHE = {}; };
    const caseList = (us, opt) => {
        const all = !!(opt && opt.all);
        let ck = "";
        try {
            ck = (all ? "A:" : "N:") + (us || []).map((u) => (u && u.ref) + (u && u.act ? "*" : "")).join(",");
            const h = CACHE[ck];
            if (h && Date.now() - h.at < 250 && h.us.length === (us || []).length && h.us.every((u, i) => u === us[i]))
                return h.out;
        }
        catch (e) { }
        const out = caseList0(us, all);
        try {
            CACHE[ck] = { at: Date.now(), out, us: (us || []).slice() };
        }
        catch (e) { }
        return out;
    };
    const caseList0 = (us, all) => {
        const out = [];
        (us || []).forEach((u) => {
            try {
                if (!u || !u.D)
                    return;
                const demo = u.kind === "demo";
                const t = tenOfUnit(u);
                const Mp = {};
                const get = (name, cty) => {
                    const k = norm(name);
                    if (!k)
                        return null;
                    let c = Mp[k];
                    if (!c) {
                        c = Mp[k] = { u, ref: u.ref, t, key: k, buyer: String(name), cty: cty || "", recs: [], ships: [], row: null, demo, item: u.item, co: u.co };
                        out.push(c);
                    }
                    if (!c.cty && cty)
                        c.cty = cty;
                    return c;
                };
                (u.D.fb || []).forEach((r, fi) => {
                    if (!r || Array.isArray(r) || !r.b)
                        return;
                    if (demo && !all && !r.user)
                        return;
                    const c = get(r.b, r.c);
                    if (c)
                        c.recs.push({ r, fi });
                });
                const SC = shipCasesOf(u, t);
                SC.forEach((c0, i) => {
                    const S = c0.ship;
                    if (!S || isMihon(S) || isCopy(S) || c0.seed)
                        return;
                    const user = isPo(c0) || !!(S.v61fb || S.v56shipFb || S.v54copy);
                    if (demo && !user && !all)
                        return;
                    const k = norm(S.buyer);
                    if (demo && !all && !isPo(c0) && !edited(S) && !Mp[k])
                        return;
                    const c = get(S.buyer, S.country);
                    if (c)
                        c.ships.push(c0);
                });
                if (demo && all && u.D.ship && !isMihon(u.D.ship) && !SC.some((c0) => c0.ship === u.D.ship)) {
                    const c = get(u.D.ship.buyer, u.D.ship.country);
                    if (c && !c.ships.some((x) => x.ship && x.ship.no === u.D.ship.no))
                        c.ships.push({ ship: u.D.ship, step: 0, base: 1 });
                }
                try {
                    if (t && typeof v70dealRowsOf === "function" && (!demo || all || Object.keys(Mp).length)) {
                        (v70dealRowsOf(t) || []).forEach((r) => {
                            if (!r)
                                return;
                            const k = norm(r.name);
                            let c = Mp[k];
                            const st = stShort(r.st);
                            const smp = !!(r.th && r.th.v91smp && /^見本/.test(String(r.th.statusBy || "")));
                            if (!c && (st === ST.won || st === ST.quote || st === ST.nego) && r.lead !== "失注" && (!demo || all))
                                c = get(r.name, r.cty);
                            if (c && !c.row) {
                                c.row = r;
                                c.rowSmp = smp;
                            }
                        });
                    }
                }
                catch (e) {
                    warn("rows", e);
                }
            }
            catch (e) {
                warn("unit", e);
            }
        });
        out.forEach((c) => {
            try {
                c.recs.sort((a, b) => String(a.r.d || "").localeCompare(String(b.r.d || "")));
                const recs = c.recs.map((x) => x.r);
                const last = recs[recs.length - 1];
                const st = c.row ? stShort(c.row.st) : "";
                const useSt = !!c.row && !(c.demo && !all && c.rowSmp);
                const wonRecs = c.recs.filter((x) => x.r.st === "受注");
                const poShips = c.ships.filter(isPo);
                c.wonBy = wonRecs.length ? "rec" : poShips.length ? "po" : c.ships.some((x) => x.ship.v61fb && x.ship.v61fb.won) ? "rec" : (useSt && st === ST.won) ? "st" : "";
                const qRecs = c.recs.filter((x) => x.r.st === "見積提示");
                const docOk = c.ships.length > 0 && (!recs.length || recs.some(hasFix) || c.ships.some((x) => edited(x.ship)) || qRecs.length > 0);
                c.quoteBy = qRecs.length ? "rec" : docOk ? "doc" : (useSt && (st === ST.quote || st === ST.nego)) ? "st" : "";
                const lost = !c.wonBy && ((last && last.st === "失注") || (c.row && c.row.lead === "失注") || st === ST.lost);
                c.stage = c.wonBy ? "won" : lost ? "lost" : c.quoteBy ? "quote" : "talk";
                c.reachedQuote = c.stage === "won" || c.stage === "quote";
                c.nWonRec = wonRecs.length;
                const sh = poShips[poShips.length - 1] || c.ships[c.ships.length - 1] || null;
                c.S = sh ? sh.ship : null;
                c.case0 = sh;
                c.amt = null;
                c.amtSrc = "";
                c.no = "";
                c.unitS = "—";
                c.qtyS = "—";
                c.docRate = 0;
                c.rec = null;
                c.recAlt = null;
                const pick = (L) => { for (let i = L.length - 1; i >= 0; i--) {
                    const a = recAmt(L[i].r);
                    if (a)
                        return { a, x: L[i] };
                } return null; };
                const rp = c.stage === "won" ? (pick(wonRecs) || pick(c.recs.filter((x) => hasFix(x.r))) || pick(qRecs)) : c.stage === "quote" ? (pick(qRecs) || pick(c.recs.filter((x) => hasFix(x.r)))) : null;
                if (c.S) {
                    const a = amtX(c.S.total);
                    if (a && a.v > 0) {
                        c.amt = { cur: a.cur, v: a.v };
                        c.amtSrc = edited(c.S) ? "edit" : "doc";
                        c.no = c.S.no || "";
                        c.unitS = c.S.unitPrice || "—";
                        c.qtyS = c.S.qty || "—";
                        try {
                            c.docRate = (typeof docRateOf === "function") ? (docRateOf(c.S) || 0) : 0;
                        }
                        catch (e) {
                            c.docRate = 0;
                        }
                        if (rp && (rp.a.cur !== a.cur || Math.abs(rp.a.v - a.v) > 0.005))
                            c.recAlt = rp.a;
                    }
                }
                if (!c.amt && rp) {
                    if (c.stage === "won" && wonRecs.length > 1) {
                        const L = wonRecs.map((x) => recAmt(x.r)).filter((a) => a && a.cur === rp.a.cur);
                        c.amt = { cur: rp.a.cur, v: Math.round(L.reduce((s, a) => s + a.v, 0) * 100) / 100 };
                        c.nSum = L.length;
                    }
                    else
                        c.amt = { cur: rp.a.cur, v: rp.a.v };
                    c.amtSrc = "rec";
                    c.unitS = rp.a.unit || "—";
                    c.qtyS = rp.a.qty || "—";
                }
                c.rec = rp ? rp.x : (c.stage === "won" ? wonRecs[wonRecs.length - 1] : c.stage === "quote" ? qRecs[qRecs.length - 1] : null) || c.recs[c.recs.length - 1] || null;
                const stAt = c.row && c.row.th && c.row.th.statusAt ? dayOf(c.row.th.statusAt) : "";
                const fbD = (S) => (S && S.v61fb && S.v61fb.d) ? String(S.v61fb.d).slice(0, 10) : "";
                c.wonD = c.stage === "won" ? (wonRecs.length ? String(wonRecs[0].r.d || "").slice(0, 10) : (c.wonBy === "po" ? (dashDate(poShips[0].ship.orderDate || poShips[0].ship.date || "") || fbD(c.S)) : "") || stAt || "") : "";
                c.quoteD = qRecs.length ? String(qRecs[qRecs.length - 1].r.d || "").slice(0, 10) : (c.quoteBy === "doc" ? (fbD(c.S) || (last ? String(last.d || "").slice(0, 10) : "")) : c.quoteBy === "st" ? stAt : "");
                c.dISO = c.stage === "won" ? c.wonD : c.stage === "quote" ? c.quoteD : (last ? String(last.d || "").slice(0, 10) : "");
                c.etd = etdOf(c.S);
                c.want = c.S ? (dashDate(c.S.want) || "") : "";
                c.shipped = c.ships.some(shipped);
            }
            catch (e) {
                warn("case", e);
                c.stage = c.stage || "talk";
            }
        });
        return out;
    };
    API.caseList = caseList;
    API.cases = () => caseList(dashScopeUnits());
    const SRC_REC = () => M("商談の記録", "Meeting record", "商谈记录", "Registro de reunión");
    const SRC_ST = () => M("ステータス「取引中」", "Status “Active deal”", "状态“交易中”", "Estado «En operación»");
    const toOrder = (c, kind) => {
        const shipTxt = c.etd ? c.etd : c.want ? M("希望着荷 ", "Requested arrival ", "希望到货 ", "Llegada deseada ") + c.want : "";
        return {
            no: c.no || (c.amtSrc === "rec" || c.wonBy === "rec" || kind === "q" ? SRC_REC() : SRC_ST()), buyer: c.buyer || "—", cty: c.cty || "—", item: c.item, co: c.co,
            qty: c.qtyS || "—", unit: c.unitS || "—", total: c.amt ? fmtCur(c.amt) : M("（金額の記録なし）", "(no amount recorded)", "（未记录金额）", "(sin importe)"),
            a: c.amt ? { cur: c.amt.cur, v: c.amt.v } : { cur: "", v: 0 }, docRate: (c.amt && c.amt.cur === "USD") ? (c.docRate || 0) : 0, dISO: c.dISO || "", ref: c.ref,
            src: "v92c", v68k: kind === "q" ? "q" : (c.wonBy === "po" ? "po" : "fb"), v92c: c, v92ship: shipTxt,
        };
    };
    try {
        if (typeof dashAgg === "function") {
            const o = dashAgg;
            dashAgg = function (us) {
                const A = o.apply(this, arguments);
                try {
                    if (!A || !A.K || A.v92r6b)
                        return A;
                    A.v92r6b = 1;
                    const U = A.us || us || [];
                    const per = !!A.per;
                    const ok = (d) => !per || (!!d && (!DASH.from || d >= DASH.from) && (!DASH.to || d <= DASH.to));
                    const CS = caseList(U);
                    const won = CS.filter((c) => c.stage === "won" && ok(c.dISO));
                    const quo = CS.filter((c) => c.stage === "quote" && ok(c.dISO));
                    const demoU = U.filter((u) => u && u.kind === "demo");
                    const baseOrd = (A.orders || []).filter((x) => x && x.src === "base" && demoU.some((u) => u.ref === x.ref));
                    A.orders = baseOrd.concat(won.map((c) => toOrder(c, "o")));
                    A.quotes = quo.filter((c) => c.amt).map((c) => toOrder(c, "q"));
                    A.v92cases = CS;
                    A.v92won = won;
                    A.v92quo = quo;
                    A.money = dashMoney(A.orders);
                    A.qmoney = dashMoney(A.quotes);
                    A.v92r4bDraft = 0;
                    const bq = per ? 0 : demoU.reduce((s, u) => s + (+((u.D.kpi || {}).quotes) || 0), 0);
                    const bw = per ? baseOrd.length : demoU.reduce((s, u) => s + (+((u.D.kpi || {}).won) || 0), 0);
                    A.v92baseQ = bq;
                    A.v92baseW = bw;
                    A.K.quotes = bq + quo.length;
                    A.K.won = bw + won.length;
                    if (Array.isArray(A.funnel)) {
                        const idx = (re) => A.funnel.findIndex((r) => r && re.test(String(r[0] || "")));
                        const iq = idx(/見積/), iw = idx(/受注/);
                        const baseRow = (i) => per ? 0 : demoU.reduce((s, u) => s + (+((((u.D.funnel || [])[i]) || [])[1]) || 0), 0);
                        const rq = CS.filter((c) => c.reachedQuote && ok(c.dISO)).length;
                        if (iq >= 0)
                            A.funnel[iq] = [A.funnel[iq][0], baseRow(iq) + rq];
                        if (iw >= 0)
                            A.funnel[iw] = [A.funnel[iw][0], (per ? baseOrd.length : baseRow(iw)) + won.length];
                        A.v92fun = { rq, won: won.length };
                    }
                }
                catch (e) {
                    warn("agg", e);
                }
                return A;
            };
        }
    }
    catch (e) {
        warn("agg-wrap", e);
    }
    const cutDiv = (h, from, marker) => { const a = h.indexOf(marker, from); if (a < 0)
        return [-1, -1]; const b = h.indexOf("</div>", a); return b > a ? [a, b + 6] : [-1, -1]; };
    const noRateTxt = (m) => { const K = Object.keys((m && m.noRate) || {}); return K.length ? K.map((k) => fmtCur({ cur: k, v: m.noRate[k] })).join("・") : ""; };
    const money = (m) => { try {
        return (DASH && DASH.cur === "USD") ? fmtUSD(m.usd || 0) : fmtJPY(m.jpy || 0);
    }
    catch (e) {
        return fmtJPY((m && m.jpy) || 0);
    } };
    const cursOf = (L) => { const s = {}; (L || []).forEach((x) => { if (x && x.a && x.a.v > 0 && x.a.cur && x.a.cur !== "JPY" && !x.docRate)
        s[x.a.cur] = 1; }); return Object.keys(s).filter((c) => !!rateOf(c)); };
    try {
        if (typeof vDash === "function") {
            const o = vDash;
            vDash = function () {
                let h = o.apply(this, arguments);
                try {
                    if (typeof h !== "string")
                        return h;
                    const A = dashAgg(dashScopeUnits());
                    if (!A || !A.v92cases)
                        return h;
                    const quo = A.v92quo || [], won = A.v92won || [], per = !!A.per;
                    const K = A.K || {};
                    const lb = h.indexOf('<p class="lbl">見積を出している案件</p>');
                    if (lb >= 0) {
                        const baseAmt = per ? 0 : (+K.quoteAmt || 0);
                        const qm = A.qmoney || { jpy: 0, usd: 0 };
                        const r = dashRate();
                        const tot = { jpy: (qm.jpy || 0) + baseAmt, usd: (qm.usd || 0) + baseAmt / ((r && r.v) || 150) };
                        const nAmt = quo.filter((c) => c.amt).length, nNo = quo.length - nAmt;
                        const nr = noRateTxt(qm);
                        const L = [];
                        const head = M("見積金額（受注未確定）", "Quoted (order not confirmed)", "报价金额（订单未确定）", "Cotizado (pedido no confirmado)");
                        if (!quo.length && !A.v92baseQ)
                            L.push(`${E(head)} <span class="n" id="v68qamt">${E(won.length ? M("受注未確定の見積はありません", "no open quotes", "没有未确定的报价", "sin cotizaciones abiertas") : M("まだありません", "none yet", "尚无", "aún no hay"))}</span>`);
                        else if (!(tot.jpy > 0) && !nr)
                            L.push(`${E(head)} <span class="n" id="v68qamt">${E(M("金額の記録なし", "no amount recorded", "未记录金额", "sin importe"))}</span>`);
                        else
                            L.push(`${E(head)} <span class="n" id="v68qamt">${E(money(tot))}</span>` + (quo.length ? E(M(`（${quo.length}件のうち金額のある ${nAmt - (qm.mixed || 0)}件の合計）`, ` (total of ${nAmt - (qm.mixed || 0)} of ${quo.length} with an amount)`, `（${quo.length}件中有金额的 ${nAmt - (qm.mixed || 0)}件合计）`, ` (total de ${nAmt - (qm.mixed || 0)} de ${quo.length} con importe)`)) : ""));
                        if (nr)
                            L.push(`<span class="v92r6b-nr">${E(M(`ほかに ${nr}（円換算のレートなし。合計に入れていません）`, `Plus ${nr} (no JPY rate; not included in the total)`, `另有 ${nr}（无日元汇率，未计入合计）`, `Además ${nr} (sin tipo a JPY; no incluido)`))}</span>`);
                        if (nNo)
                            L.push(E(M(`金額の記録がない案件 ${nNo}件（単価と数量を記録に入れるか、書類をつくると入ります）`, `${nNo} case(s) without an amount (add unit price and quantity, or make documents)`, `无金额记录的案件 ${nNo}件（在记录中填写单价和数量，或制作单据后计入）`, `${nNo} caso(s) sin importe (añada precio y cantidad, o cree documentos)`)));
                        if (A.v92baseQ)
                            L.push(E(M(`うち見本の決まった数：${A.v92baseQ}件・${fmtJPY(baseAmt)}（見本のデータ。1件ずつの明細は入っていません）`, `Of which fixed sample figures: ${A.v92baseQ} / ${fmtJPY(baseAmt)} (sample data; no per-case detail)`, `其中示例的固定数字：${A.v92baseQ}件・${fmtJPY(baseAmt)}（示例数据，无逐件明细）`, `De ello, cifras fijas de muestra: ${A.v92baseQ} / ${fmtJPY(baseAmt)} (datos de muestra; sin detalle)`)));
                        if (!per && (+K.weighted || 0) > 0)
                            L.push(`${E(M("確度加味", "Weighted", "按确度加权", "Ponderado"))} <span class="n">¥${(K.weighted / 1e6).toFixed(1)}M</span>${A.v92baseQ ? E(M("（見本の数だけから）", " (sample figures only)", "（仅示例数字）", " (solo muestra)")) : ""}`);
                        const rl = (!DASH || DASH.cur !== "USD") ? rateLine(cursOf(A.quotes), (qm.docRates || [])) : "";
                        if (rl)
                            L.push(`<span class="v92r6b-rate" style="font-size:9px">${E(rl)}</span>`);
                        const [a, b] = cutDiv(h, lb, '<div class="kd" id="v68qkd"');
                        if (a >= 0)
                            h = h.slice(0, a) + `<div class="kd" id="v68qkd" data-kqn="1" data-noi18n>${L.join("<br>")}</div>` + h.slice(b);
                        const def = M(`数え方：相手（案件）ごとに1件。受注がまだで、状況「見積提示」の商談の記録か見積書（PI）がある案件です（先方の希望価格だけの記録は入りません）。金額は案件ごとに1つ：書類（見積書）があればその合計、無ければ記録の単価×数量。開いている案件や書類の画面には左右されません。${won.length ? `受注に進んだ ${won.length}件は「累計受注金額」に入れています。` : ""}`, `Counted: one per buyer (case) — not yet ordered, with a meeting record in status “Quote sent” or a quotation (PI). Records with only the buyer's desired price are not counted. One amount per case: the quotation total if there is one, otherwise unit price × quantity from the record.${won.length ? ` ${won.length} case(s) that became orders are in “Total order value”.` : ""}`, `计数方式：每个对象（案件）计1件。尚未接单、且有状态为“已报价”的商谈记录或报价单（PI）的案件（仅有对方期望价的记录不计入）。每个案件一个金额：有单据则取其合计，否则取记录的单价×数量。${won.length ? `已接单的 ${won.length}件计入“累计接单金额”。` : ""}`, `Cómputo: uno por comprador (caso), aún sin pedido y con registro en estado «Cotización enviada» o una cotización (PI). No cuentan los registros con solo el precio deseado. Un importe por caso: total de la cotización si existe; si no, precio × cantidad del registro.${won.length ? ` ${won.length} caso(s) con pedido están en «Importe total de pedidos».` : ""}`);
                        const lb2 = h.indexOf('<p class="lbl">見積を出している案件</p>');
                        const end = h.indexOf('<span class="ddhint">', lb2);
                        const [c, d] = cutDiv(h, lb2, '<div class="v90ana-def"');
                        if (c >= 0 && (end < 0 || c < end))
                            h = h.slice(0, c) + `<div class="v90ana-def" data-v90def="1" data-noi18n>${E(def)}</div>` + h.slice(d);
                        else if (end >= 0)
                            h = h.slice(0, end) + `<div class="v90ana-def" data-v90def="1" data-noi18n>${E(def)}</div>` + h.slice(end);
                    }
                    const lw = h.indexOf('<p class="lbl">初めての受注</p>');
                    if (lw >= 0) {
                        const [a, b] = cutDiv(h, lw, '<div class="kd"');
                        if (a >= 0) {
                            const seg = h.slice(a, b);
                            if ((+K.won || 0) > 0 && /これからです|Not yet/.test(seg))
                                h = h.slice(0, a) + seg.replace(/これからです|Not yet/, M("初受注おめでとうございます！", "Congratulations on your first order!", "恭喜获得首单！", "¡Enhorabuena por el primer pedido!")) + h.slice(b);
                            else if (!(+K.won || 0) && /おめでとう|Congratulations/.test(seg))
                                h = h.slice(0, a) + `<div class="kd" data-kqn="1">${E(M("これからです", "Not yet", "尚未开始", "Aún no"))}</div>` + h.slice(b);
                        }
                    }
                    const lo = h.indexOf('<p class="lbl">累計受注金額');
                    if (lo >= 0) {
                        const hint = h.indexOf('<span class="ddhint">', lo);
                        const m = A.money || {};
                        const X = [];
                        const cs0 = cursOf(A.orders);
                        const baseShown = hint >= 0 && h.slice(lo, hint).indexOf("MUFG RC TTM") >= 0;
                        const rl = rateLine(baseShown ? cs0.filter((c) => c !== "USD") : cs0, (m.docRates || []));
                        if (rl)
                            X.push(rl);
                        const nr = noRateTxt(m);
                        if (nr)
                            X.push(M(`ほかに ${nr}（円換算のレートなし。合計に入れていません）`, `Plus ${nr} (no JPY rate; not included)`, `另有 ${nr}（无日元汇率，未计入）`, `Además ${nr} (sin tipo a JPY; no incluido)`));
                        const nNo = won.filter((c) => !c.amt).length;
                        if (nNo)
                            X.push(M(`金額の記録がない受注 ${nNo}件（受注の記録に確定単価・数量を入れるか、書類をつくると入ります）`, `${nNo} order(s) without an amount (add the confirmed unit price and quantity to the record, or make documents)`, `无金额记录的订单 ${nNo}件（在接单记录中填写确定单价和数量，或制作单据后计入）`, `${nNo} pedido(s) sin importe (añada precio y cantidad al registro, o cree documentos)`));
                        if (X.length && hint >= 0)
                            h = h.slice(0, hint) + `<div class="kd v92r6b-ordx" data-kqn="1" data-noi18n style="font-size:9.5px">${X.map(E).join("<br>")}</div>` + h.slice(hint);
                    }
                    const fn = h.indexOf('id="v73fnote"');
                    if (fn >= 0 && A.v92fun) {
                        const a = h.indexOf(">", fn), b = h.indexOf("</p>", fn);
                        if (a >= 0 && b > a) {
                            const add = M(`「見積を提示」「初回受注」は、相手（案件）ごとに数えています（見積を提示＝見積を出している案件 ${quo.length}件＋受注に進んだ ${won.length}件${A.v92baseQ ? "＋見本の決まった数" : ""}。上の札と同じ判定）。`, ` “Quote sent” and “First order” are counted per buyer (case): quote sent = ${quo.length} open quote case(s) + ${won.length} that became orders — the same rule as the tiles above.`, `“已报价”“首次接单”按对象（案件）计数（已报价＝报价中的案件 ${quo.length}件＋已接单 ${won.length}件，与上方卡片相同）。`, ` «Cotización enviada» y «Primer pedido» se cuentan por comprador (caso): ${quo.length} con cotización abierta + ${won.length} con pedido, igual que las tarjetas.`);
                            let inner = h.slice(a + 1, b).replace(/数え方：どの段も、/, "数え方：「見積を提示」「初回受注」のほかの段は、");
                            h = h.slice(0, a + 1) + inner + `<span data-noi18n>${E(add)}</span>` + h.slice(b);
                        }
                    }
                }
                catch (e) {
                    warn("vdash", e);
                }
                return h;
            };
        }
    }
    catch (e) {
        warn("vdash-wrap", e);
    }
    const stageLbl = (c) => c.stage === "won"
        ? (c.wonBy === "po" ? M("受注（発注書）", "Order (PO)", "接单（订购单）", "Pedido (OC)") : c.wonBy === "st" ? M("受注（ステータスを「取引中」にした）", "Order (status set to Active deal)", "接单（状态设为“交易中”）", "Pedido (estado «En operación»)") : M("受注（商談の記録が「受注」）", "Order (meeting record: Won)", "接单（商谈记录为“受注”）", "Pedido (registro: ganado)"))
        : (c.quoteBy === "rec" ? M("見積（状況「見積提示」の記録）", "Quote (record: Quote sent)", "报价（记录为“已报价”）", "Cotización (registro)") : c.quoteBy === "doc" ? M("見積（見積書あり）", "Quote (quotation made)", "报价（有报价单）", "Cotización (documento)") : M("見積（ステータスが見積提示・契約交渉）", "Quote (status)", "报价（状态）", "Cotización (estado)"));
    const srcLbl = (c) => !c.amt ? M("金額の記録なし", "no amount recorded", "未记录金额", "sin importe")
        : c.amtSrc === "edit" ? M("書類の額（「受注内容を編集」で直した値）", "document amount (edited in “Edit order details”)", "单据金额（在“编辑订单内容”中修改）", "importe del documento (editado)")
            : c.amtSrc === "doc" ? M("書類の額", "document amount", "单据金额", "importe del documento")
                : (c.nSum > 1 ? M(`受注の記録 ${c.nSum}件の合計（単価×数量）`, `sum of ${c.nSum} order records (unit price × qty)`, `${c.nSum} 条接单记录合计（单价×数量）`, `suma de ${c.nSum} registros (precio × cantidad)`) : M("記録の単価×数量（書類をつくると書類の額に替わります）", "unit price × qty from the record (replaced by the document amount once documents are made)", "记录的单价×数量（制作单据后改为单据金额）", "precio × cantidad del registro (se sustituye por el documento)"));
    const yenOf = (c) => {
        if (!c.amt)
            return "";
        if (c.amt.cur === "JPY")
            return (DASH && DASH.cur === "USD") ? "≒" + fmtUSD(c.amt.v / ((c.docRate) || dashRate().v)) : "";
        const r = (c.amt.cur === "USD" && c.docRate) ? { v: c.docRate } : rateOf(c.amt.cur);
        if (!r)
            return M("（円換算のレートなし・合計に入れていません）", "(no JPY rate; not in the total)", "（无日元汇率，未计入合计）", "(sin tipo a JPY; no incluido)");
        const j = c.amt.v * r.v;
        return "≒" + ((DASH && DASH.cur === "USD") ? (c.amt.cur === "USD" ? "" : fmtUSD(j / dashRate().v)) : fmtJPY(j)) + ((c.amt.cur === "USD" && c.docRate) ? M(`（書類レート${c.docRate}）`, ` (doc rate ${c.docRate})`, `（单据汇率${c.docRate}）`, ` (tipo doc. ${c.docRate})`) : "");
    };
    const cardHtml = (o) => `<div class="v92r6b-cd"${o.attr || ""}>`
        + `<div class="v92r6b-c1"><span class="v92r6b-nm"><span class="n v92r6b-no">${E(o.no)}</span> <b>${E(o.buyer)}</b><span class="v92r6b-ct">（${E(o.cty || "—")}）</span></span>`
        + `<span class="v92r6b-am n"><b>${E(o.total)}</b>${o.yen ? `<br><span class="v92r6b-sub">${E(o.yen)}</span>` : ""}</span></div>`
        + `<div class="v92r6b-c2">${E(o.item || "")}　${E(o.qty || "—")} × ${E(o.unit || "—")}</div>`
        + `<div class="v92r6b-c3"><span class="p lo">${E(o.stage)}</span>${o.btn || ""}</div>`
        + (o.src ? `<div class="v92r6b-c4">${E(M("金額の出どころ：", "Amount source: ", "金额来源：", "Origen del importe: "))}${E(o.src)}</div>` : "")
        + (o.alt ? `<div class="v92r6b-c4">${E(o.alt)}</div>` : "")
        + (o.ship ? `<div class="v92r6b-c4">${E(M("出荷予定：", "Shipment: ", "预计出货：", "Envío: "))}${E(o.ship)}</div>` : "")
        + `</div>`;
    const caseRow = (c, i, kind) => cardHtml({
        attr: ` data-v92ci="${i}" data-v92k="${kind}"`, no: c.no || (c.rec ? SRC_REC() : SRC_ST()), buyer: c.buyer, cty: c.cty, total: c.amt ? fmtCur(c.amt) : M("金額の記録なし", "no amount recorded", "未记录金额", "sin importe"), yen: yenOf(c),
        item: c.item, qty: c.qtyS, unit: c.unitS, stage: stageLbl(c), src: c.amt ? srcLbl(c) : "",
        alt: c.recAlt ? M(`商談の記録では ${fmtCur(c.recAlt)}。書類の額を使っています（「受注内容を編集」で直せます）`, `The meeting record says ${fmtCur(c.recAlt)}; the document amount is used (fix it in “Edit order details”)`, `商谈记录为 ${fmtCur(c.recAlt)}，此处采用单据金额（可在“编辑订单内容”中修改）`, `El registro indica ${fmtCur(c.recAlt)}; se usa el importe del documento`) : "",
        ship: kind === "won" ? (c.etd ? c.etd + M("（出港の予定日 ETD）", " (ETD)", "（预计开船日 ETD）", " (ETD)") : c.want ? M(`希望着荷 ${c.want}（出港の予定日 ETD は、まだ入っていません）`, `requested arrival ${c.want} (ETD not entered yet)`, `希望到货 ${c.want}（尚未填写预计开船日 ETD）`, `llegada deseada ${c.want} (ETD sin indicar)`) : M("まだ入っていません", "not entered yet", "尚未填写", "sin indicar")) : "",
        btn: ((c.S && c.S.no) || c.rec) ? ` <button type="button" class="btn g v92r6b-ed" style="padding:2px 7px;font-size:10px" title="${E(M("編集", "Edit", "编辑", "Editar"))}">✎</button>` : "",
    });
    const caseTable = (L, kind, off, pre) => `<div class="v92r6b-list">${pre || ""}${L.map((c, i) => caseRow(c, off + i, kind)).join("")}</div>`;
    const bindEdit = (root, ALL) => {
        try {
            root.querySelectorAll("[data-v92ci] .v92r6b-ed").forEach((b) => {
                b.addEventListener("click", (ev) => {
                    try {
                        ev.stopPropagation();
                        const c = ALL[+b.closest("[data-v92ci]").dataset.v92ci];
                        if (!c)
                            return;
                        if (c.S && c.S.no && c.u && c.u.act && typeof dashOrdEdit === "function")
                            dashOrdEdit(c.S.no);
                        else if (c.rec && typeof dashFbEdit === "function")
                            dashFbEdit(c.ref, c.rec.fi);
                        else
                            toast(M("この案件の商品を開いてから編集してください", "Open this case's product to edit", "请先打开该案件的商品再编辑", "Abra el producto del caso para editar"));
                    }
                    catch (e) {
                        warn("edit", e);
                    }
                });
            });
        }
        catch (e) { }
    };
    const perChip = () => { try {
        return (DASH.from || DASH.to) ? `<span class="p lo">${E(M("期間", "Period", "期间", "Período"))} ${E(DASH.from || "…")}〜${E(DASH.to || "…")}</span>` : "";
    }
    catch (e) {
        return "";
    } };
    const quoteBox = (A, off) => {
        const quo = A.v92quo || [], qm = A.qmoney || {}, per = !!A.per;
        const baseAmt = per ? 0 : (+A.K.quoteAmt || 0);
        const r = dashRate();
        const tot = { jpy: (qm.jpy || 0) + baseAmt, usd: (qm.usd || 0) + baseAmt / ((r && r.v) || 150) };
        const nr = noRateTxt(qm);
        const n = quo.length + (A.v92baseQ || 0);
        return `<h4 data-noi18n>📝 ${E(M("見積を出している案件（受注未確定）", "Quoted cases (order not confirmed)", "报价中的案件（订单未确定）", "Casos cotizados (pedido no confirmado)"))}（${n}${E(M("件", "", "件", ""))}・${E(money(tot))}${nr ? E(M(`＋ ${nr}〔円換算のレートなし〕`, ` + ${nr} [no JPY rate]`, `＋ ${nr}〔无日元汇率〕`, ` + ${nr} [sin tipo]`)) : ""}）</h4>`
            + (A.v92baseQ ? `<p class="nn" data-noi18n style="margin-top:4px">${E(M(`見本の決まった数：${A.v92baseQ}件・${fmtJPY(baseAmt)}（見本のデータです。1件ずつの明細は入っていません。上の札の件数・金額は、これに下の表の案件を足したものです）`, `Fixed sample figures: ${A.v92baseQ} / ${fmtJPY(baseAmt)} (sample data without per-case detail; the tile adds the cases listed below)`, `示例的固定数字：${A.v92baseQ}件・${fmtJPY(baseAmt)}（示例数据，无逐件明细；卡片上的数字为其加上下表案件）`, `Cifras fijas de muestra: ${A.v92baseQ} / ${fmtJPY(baseAmt)} (sin detalle; la tarjeta suma los casos de abajo)`))}</p>` : "")
            + (quo.length ? caseTable(quo, "quote", off) : `<p class="nn" data-noi18n>${E(A.v92baseQ ? M("ご自分で足した見積の案件はありません。", "No quote cases of your own.", "没有您自己添加的报价案件。", "No hay casos propios cotizados.") : M("見積を出している案件はありません（状況「見積提示」の記録か、見積書があると、ここに出ます）。", "No quoted cases (they appear once there is a record in status “Quote sent” or a quotation).", "没有报价中的案件（有“已报价”记录或报价单后显示）。", "No hay casos cotizados."))}</p>`);
    };
    const rateNote = (A) => { const rl = rateLine(cursOf((A.orders || []).concat(A.quotes || [])), ((A.money || {}).docRates || []).concat((A.qmoney || {}).docRates || [])); return rl ? `<p class="nn v92r6b-rn" data-noi18n style="margin-top:7px">${E(rl)}${E(M("。札・この窓・ほかの画面の換算は、同じレートです（新しい参照レートが届いたら、全部を同時に換算し直します）", ". The tiles, this window and other screens use the same rate (all are re-converted together when a newer reference rate arrives)", "。卡片、本窗口及其他画面使用同一汇率（收到新参考汇率时同时重新换算）", ". Las tarjetas, esta ventana y otras pantallas usan el mismo tipo"))}</p>` : ""; };
    const HOW = () => M("💡 数え方：相手（案件）ごとに段階を1つ決めています。受注＝商談の記録が「受注」／発注書を取り込んだ／ステータスを「取引中」にした。見積＝受注がまだで、状況「見積提示」の記録か見積書がある（先方の希望価格だけの記録は入りません）。金額は案件ごとに1つ（書類があれば書類の額、無ければ記録の確定単価×数量）。開いている案件・書類には左右されません。", "💡 How it is counted: each buyer (case) has one stage. Order = the meeting record is “Won” / a PO was imported / the status was set to “Active deal”. Quote = not yet ordered, with a record in status “Quote sent” or a quotation (records with only the buyer's desired price are not counted). One amount per case (document amount if any, otherwise confirmed unit price × quantity from the record). It does not depend on which case or document is open.", "💡 计数方式：每个对象（案件）确定一个阶段。接单＝商谈记录为“受注”／已导入订购单／状态设为“交易中”。报价＝尚未接单且有“已报价”记录或报价单（仅有对方期望价的记录不计入）。每个案件一个金额（有单据取单据金额，否则取记录的确定单价×数量）。不受当前打开的案件或单据影响。", "💡 Cómputo: cada comprador (caso) tiene una etapa. Pedido = registro «ganado» / OC importada / estado «En operación». Cotización = sin pedido, con registro «Cotización enviada» o una cotización (no cuentan los registros con solo el precio deseado). Un importe por caso (documento si existe; si no, precio confirmado × cantidad). No depende del caso o documento abierto.");
    const baseShip = (x) => {
        try {
            const u = (dashUnits() || []).find((y) => y && y.ref === x.ref);
            const S = u && u.D && u.D.ship;
            if (S && S.no === x.no) {
                const row = (S.sched || []).find((r) => /出港|ETD/.test(String((r && r[1]) || "")));
                const etd = row ? dashDate(row[0]) : "";
                const want = dashDate(S.want) || "";
                if (etd)
                    return etd + M("（出港 ETD）", " (ETD)", "（开船 ETD）", " (ETD)") + (want ? M(`／希望着荷 ${want}`, ` / requested arrival ${want}`, `／希望到货 ${want}`, ` / llegada deseada ${want}`) : "");
                if (want)
                    return M(`希望着荷 ${want}`, `requested arrival ${want}`, `希望到货 ${want}`, `llegada deseada ${want}`);
            }
        }
        catch (e) { }
        return x.dISO || "";
    };
    const drillOrders = (A) => {
        const won = A.v92won || [];
        const baseOrd = (A.orders || []).filter((x) => x && x.src === "base");
        const m = A.money || {};
        const nr = noRateTxt(m);
        const ALL = won.concat(A.v92quo || []);
        const baseRows = baseOrd.map((x) => {
            const r = x.docRate ? { v: x.docRate } : rateOf(x.a.cur);
            return cardHtml({ no: x.no, buyer: x.buyer, cty: x.cty, total: x.total, yen: (x.a.cur === "JPY" || !r) ? "" : "≒" + fmtJPY(x.a.v * r.v), item: x.item, qty: x.qty, unit: x.unit, stage: M("受注（見本のデータ）", "Order (sample data)", "接单（示例数据）", "Pedido (muestra)"), src: "", ship: baseShip(x), btn: ` <button type="button" class="btn g v92r6b-be" data-no="${E(x.no)}" style="padding:2px 7px;font-size:10px">✎</button>` });
        }).join("");
        const n = A.orders.length;
        let h = `<h3 data-noi18n>💰 ${E(M("受注金額の内訳", "Order value breakdown", "接单金额明细", "Desglose de pedidos"))} ${perChip()}</h3>`
            + `<p class="nn" data-noi18n style="margin-top:4px">${E(M(`集計範囲：${dashScopeName()}／受注が決まった案件 ${n}件・${money(m)}${nr ? `＋ ${nr}〔円換算のレートなし・合計に入れていません〕` : ""}（札の「累計受注金額」と同じ）`, `Scope: ${dashScopeName()} / ${n} confirmed order case(s), ${money(m)}${nr ? ` + ${nr} [no JPY rate; not included]` : ""} (same as the “Total order value” tile)`, `统计范围：${dashScopeName()}／已接单案件 ${n}件・${money(m)}${nr ? `＋ ${nr}〔无日元汇率，未计入〕` : ""}（与“累计接单金额”卡片相同）`, `Ámbito: ${dashScopeName()} / ${n} caso(s) con pedido, ${money(m)}${nr ? ` + ${nr} [sin tipo; no incluido]` : ""}`))}</p>`;
        if (n) {
            h += caseTable(won, "won", 0, baseRows);
            const nNo = won.filter((c) => !c.amt).length;
            if (nNo)
                h += `<p class="nn" data-noi18n style="margin-top:6px">${E(M(`金額の記録がない受注が ${nNo}件あります（ステータスを手で「取引中」にしただけ、または受注の記録に確定単価・数量が無い案件）。受注の記録に確定単価と数量を入れるか、書類をつくると、金額に入ります。`, `${nNo} order(s) have no amount (status set by hand, or the order record lacks a confirmed unit price / quantity). Add them to the record, or make documents, to include the amount.`, `有 ${nNo} 件接单没有金额记录（仅手动改为“交易中”，或接单记录缺少确定单价・数量）。在记录中填写或制作单据后计入金额。`, `${nNo} pedido(s) sin importe. Añada precio confirmado y cantidad al registro, o cree documentos.`))} <button type="button" class="btn g v92r6b-rec" style="padding:2px 8px;font-size:10.5px">${E(M("＋ 受注の記録を入れる", "+ Add an order record", "＋ 添加接单记录", "+ Añadir registro de pedido"))}</button></p>`;
        }
        else
            h += `<p class="nn" data-noi18n style="margin-top:8px">${E(M("受注が決まった案件はまだありません。", "No confirmed orders yet.", "尚无已确认订单的案件。", "Aún no hay pedidos confirmados."))}</p>`;
        h += `<div id="v68qdrill" class="v68q-t">${quoteBox(A, won.length)}</div>` + rateNote(A)
            + `<p class="nn" data-noi18n style="margin-top:7px">${E(HOW())}</p>`
            + `<p class="nn" data-noi18n style="margin-top:5px">${E(M("✎ から、案件の書類（受注内容）か商談の記録を編集できます。", "Use ✎ to edit the case's documents (order details) or the meeting record.", "点击 ✎ 可编辑案件单据（订单内容）或商谈记录。", "Use ✎ para editar los documentos del caso o el registro."))}</p>`;
        openDW(`<div id="v92r6bDrill" data-kind="orders">${h}</div>`);
        const root = document.getElementById("v92r6bDrill");
        if (root) {
            bindEdit(root, ALL);
            root.querySelectorAll(".v92r6b-be").forEach((b) => b.addEventListener("click", () => { try {
                dashOrdEdit(b.dataset.no);
            }
            catch (e) { } }));
            root.querySelectorAll(".v92r6b-rec").forEach((b) => b.addEventListener("click", () => { try {
                closeDW();
                go("deal");
            }
            catch (e) { } }));
        }
        try {
            if (typeof dwChrome === "function")
                dwChrome();
        }
        catch (e) { }
    };
    const drillQuotes = (A) => {
        const quo = A.v92quo || [], won = (A.v92won || []);
        const ALL = quo.concat(won);
        let h = `<h3 data-noi18n>📈 ${E(M("見積を提示した案件", "Cases with a quote", "已报价的案件", "Casos con cotización"))} ${perChip()}</h3>`
            + `<p class="nn" data-noi18n style="margin-top:4px">${E(M(`集計範囲：${dashScopeName()}／いま見積を出している案件 ${quo.length + (A.v92baseQ || 0)}件（札と同じ）・受注に進んだ案件 ${won.length}件（「どこまで進んだか」の「見積を提示」は、この2つの合計）`, `Scope: ${dashScopeName()} / ${quo.length + (A.v92baseQ || 0)} open quote case(s) (same as the tile), ${won.length} that became orders (“Quote sent” in the funnel is the sum of both)`, `统计范围：${dashScopeName()}／报价中的案件 ${quo.length + (A.v92baseQ || 0)}件（与卡片相同）・已接单 ${won.length}件（漏斗的“已报价”为两者之和）`, `Ámbito: ${dashScopeName()} / ${quo.length + (A.v92baseQ || 0)} con cotización abierta, ${won.length} con pedido`))}</p>`
            + `<div class="v68q-t">${quoteBox(A, 0)}</div>`;
        if (won.length)
            h += `<h4 data-noi18n style="margin-top:12px">✅ ${E(M("受注に進んだ案件（累計受注金額に入れています）", "Cases that became orders (counted in Total order value)", "已接单的案件（计入累计接单金额）", "Casos con pedido (en el total de pedidos)"))}（${won.length}${E(M("件", "", "件", ""))}）</h4>` + caseTable(won, "won", quo.length);
        h += rateNote(A) + `<p class="nn" data-noi18n style="margin-top:7px">${E(HOW())}</p>`;
        openDW(`<div id="v92r6bDrill" data-kind="quotes">${h}</div>`);
        const root = document.getElementById("v92r6bDrill");
        if (root)
            bindEdit(root, ALL);
        try {
            if (typeof dwChrome === "function")
                dwChrome();
        }
        catch (e) { }
    };
    try {
        if (typeof dashDrill === "function") {
            const o = dashDrill;
            dashDrill = function (kind, arg) {
                try {
                    const isQ = kind === "funnel" && /見積/.test(String(arg || ""));
                    const isO = kind === "orders" || (kind === "funnel" && /受注/.test(String(arg || "")));
                    if (isQ || isO) {
                        const A = dashAgg(dashScopeUnits());
                        if (A && A.v92cases) {
                            API._drill = [kind, arg];
                            if (isQ)
                                drillQuotes(A);
                            else
                                drillOrders(A);
                            return;
                        }
                    }
                    API._drill = null;
                }
                catch (e) {
                    warn("drill", e);
                }
                return o.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("drill-wrap", e);
    }
    try {
        if (typeof a30Collect === "function") {
            const o = a30Collect;
            a30Collect = function (R) {
                let out, done = false;
                try {
                    if (typeof v30Tens === "function" && typeof dashScopeUnits === "function") {
                        const U = dashScopeUnits() || [], T = tensAll();
                        const A = U.map((u) => (u && u.i >= 0) ? T[u.i] : null).filter(Boolean);
                        const vt = v30Tens;
                        if (A.length && A.length === U.length && (vt() || []).some((t) => A.indexOf(t) < 0 && A.some((x) => (x.co || "") === (t.co || "")))) {
                            try {
                                v30Tens = function () { return (vt() || []).filter((t) => A.indexOf(t) >= 0); };
                                out = o.apply(this, arguments);
                                done = true;
                            }
                            finally {
                                v30Tens = vt;
                            }
                        }
                    }
                }
                catch (e) {
                    warn("a30-scope", e);
                }
                if (!done)
                    out = o.apply(this, arguments);
                try {
                    if (out && Array.isArray(out.quote) && Array.isArray(out.won) && typeof a30T === "function" && typeof a30In === "function") {
                        const CS = caseList(dashScopeUnits());
                        const has = (L, c) => L.some((x) => x && norm(x.b) === c.key);
                        CS.forEach((c) => {
                            if (c.reachedQuote && c.quoteBy && c.quoteBy !== "rec" && c.quoteD) {
                                const at = a30T(c.quoteD);
                                if (a30In(at, R) && !has(out.quote, c))
                                    out.quote.push({ at, who: "", b: c.buyer, how: c.quoteBy === "doc" ? M("見積書", "Quotation", "报价单", "Cotización") : M("ステータス", "Status", "状态", "Estado"), txt: [c.no, c.amt ? fmtCur(c.amt) : ""].filter(Boolean).join("・"), item: c.item });
                            }
                            if (c.stage === "won" && c.wonBy !== "rec" && c.wonD) {
                                const at = a30T(c.wonD);
                                if (a30In(at, R) && !has(out.won, c))
                                    out.won.push({ at, who: "", b: c.buyer, how: c.wonBy === "po" ? M("発注書", "Purchase order", "订购单", "Orden de compra") : M("ステータス「取引中」", "Status “Active deal”", "状态“交易中”", "Estado «En operación»"), txt: [c.no, c.amt ? fmtCur(c.amt) : ""].filter(Boolean).join("・"), item: c.item });
                            }
                        });
                        out.quote.sort((a, c) => c.at - a.at);
                        out.won.sort((a, c) => c.at - a.at);
                    }
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
    const setSt = (th, st, by, why) => {
        th.status = st;
        th.statusAt = Date.now();
        th.statusBy = by;
        th.statusWhy = String(why || "").slice(0, 140);
        th.stLog = (th.stLog || []).concat([{ st, at: Date.now(), by, why: th.statusWhy }]).slice(-12);
    };
    let syncBusy = false;
    const syncStatus = () => {
        if (syncBusy)
            return 0;
        syncBusy = true;
        let n = 0;
        try {
            const t = ten();
            if (!t || !t.dmThreads || typeof dashUnits !== "function")
                return 0;
            const u = (dashUnits() || []).find((x) => x && x.act);
            if (!u)
                return 0;
            caseList([u]).forEach((c) => {
                try {
                    const th = c.row && c.row.th;
                    if (!th || !Array.isArray(th.msgs) || !th.msgs.length)
                        return;
                    if (th.v91smp && /^見本/.test(String(th.statusBy || "")))
                        return;
                    const now = stShort(th.status);
                    if (now === ST.lost || (c.row && c.row.lead === "失注"))
                        return;
                    const manual = th.statusBy === "手動";
                    if (c.stage === "won" && c.wonBy !== "st" && now !== ST.won) {
                        if (manual && !(c.wonD && th.statusAt && c.wonD >= dayOf(th.statusAt)))
                            return;
                        setSt(th, ST.won, c.wonBy === "po" ? "発注書" : "商談の記録", c.wonBy === "po" ? `発注書を取り込んだ案件（${c.no || ""}）` : `商談の記録（${c.wonD || ""}）の状況「受注」`);
                        n++;
                    }
                    else if (c.stage === "quote" && c.quoteBy !== "st" && !manual && (ST_IDX[now] == null ? 0 : ST_IDX[now]) < ST_IDX[ST.quote]) {
                        setSt(th, ST.quote, c.quoteBy === "doc" ? "書類" : "商談の記録", c.quoteBy === "doc" ? `見積書（${c.no || ""}）あり` : `商談の記録（${c.quoteD || ""}）の状況「見積提示」`);
                        n++;
                    }
                }
                catch (e) { }
            });
            if (n) {
                try {
                    if (typeof saveTen === "function")
                        saveTen();
                }
                catch (e) { }
            }
        }
        catch (e) {
            warn("sync", e);
        }
        finally {
            syncBusy = false;
        }
        return n;
    };
    API.syncStatus = syncStatus;
    try {
        if (typeof render === "function") {
            const o = render;
            render = function () {
                try {
                    cacheClear();
                    syncStatus();
                    cacheClear();
                }
                catch (e) { }
                return o.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("render-wrap", e);
    }
    try {
        if (typeof v54fobFxAfter === "function") {
            const o = v54fobFxAfter;
            v54fobFxAfter = function () {
                const r = o.apply(this, arguments);
                try {
                    const dw = document.getElementById("dw");
                    if (typeof cur !== "undefined" && cur === "dash" && dw && dw.dataset.open === "true" && document.getElementById("v92r6bDrill") && API._drill) {
                        const d = API._drill;
                        render();
                        dashDrill(d[0], d[1]);
                        const q = rateOf("USD");
                        if (q)
                            toast(M(`為替の参照レートが新しい値（1 US$＝${q.v.toFixed(2)}円${q.d ? "・" + q.d : ""}）に替わりました。画面とこの窓の金額を同じレートで換算し直しました`, `The reference rate was updated (1 US$ = ¥${q.v.toFixed(2)}${q.d ? ", " + q.d : ""}); all amounts were re-converted at the same rate`, `参考汇率已更新（1 US$＝${q.v.toFixed(2)}日元${q.d ? "・" + q.d : ""}），画面和本窗口的金额已按同一汇率重新换算`, `Se actualizó el tipo de referencia (1 US$ = ¥${q.v.toFixed(2)}); todos los importes se recalcularon`));
                    }
                }
                catch (e) {
                    warn("fx", e);
                }
                return r;
            };
        }
    }
    catch (e) {
        warn("fx-wrap", e);
    }
    const origOf = (c) => { try {
        if (!c)
            return c;
        const T = tensAll();
        if (T.indexOf(c) >= 0 || c === ten())
            return c;
        const t0 = ten();
        if (t0 && t0.item === c.item && t0.co === c.co && t0.file === c.file && t0.src === c.src)
            return t0;
        return T.find((t) => t && t.item === c.item && t.co === c.co && t.file === c.file && t.src === c.src) || c;
    }
    catch (e) {
        return c;
    } };
    const rmTens = () => { let L = []; try {
        if (typeof v88Tens === "function")
            L = v88Tens() || [];
    }
    catch (e) { } if (!L.length) {
        const t = ten();
        L = t ? [t] : [];
    } const out = []; L.forEach((c) => { const o = origOf(c); if (out.indexOf(o) < 0)
        out.push(o); }); return out; };
    const rmUnits = () => {
        const T = rmTens(), all = (() => { try {
            return dashUnits() || [];
        }
        catch (e) {
            return [];
        } })(), TT = tensAll();
        return T.map((t) => {
            const u = all.find((x) => x && ((x.i >= 0 && TT[x.i] === t) || (x.act && t === ten())));
            if (u)
                return u;
            const d = t === ten() ? dd() : null;
            return { ref: "rm", i: TT.indexOf(t), co: t.co, item: t.item, D: d || { fb: Array.isArray(t.fbx) ? t.fbx : [] }, act: t === ten(), kind: t.src === "sample" ? "demo" : t.src === "sample2" ? "s2" : "up" };
        });
    };
    const rmFacts = () => {
        const CS = caseList(rmUnits(), { all: 1 });
        const won = CS.filter((c) => c.stage === "won");
        const ctys = {};
        won.forEach((c) => { if (c.cty)
            ctys[c.cty] = 1; });
        const repeat = won.filter((c) => c.nWonRec >= 2 || c.ships.filter(isPo).length >= 2);
        const shippedL = CS.filter((c) => c.shipped);
        let nego = 0, sampleRec = 0, legal = 0;
        CS.forEach((c) => {
            const th = c.row && c.row.th;
            const st = c.row ? stShort(c.row.st) : "";
            if (st === ST.nego || (th && Array.isArray(th.stLog) && th.stLog.some((l) => l && stShort(l.st) === ST.nego)))
                nego++;
            sampleRec += c.recs.filter((x) => x.r.st === "サンプル発送").length;
        });
        try {
            rmTens().forEach((t) => { legal += cnt(t.legal && t.legal.docs); });
        }
        catch (e) { }
        return { CS, won, nCty: Object.keys(ctys).length, repeat, shippedL, nego, legal, sampleRec, quoteN: CS.filter((c) => c.reachedQuote).length };
    };
    API.rmFacts = rmFacts;
    const contactedBuyers = () => {
        const ids = {};
        try {
            rmTens().forEach((t, ti) => {
                Object.values(t.dmThreads || {}).forEach((th) => {
                    const ms = (th && Array.isArray(th.msgs)) ? th.msgs : [];
                    if (ms.some((m) => m && !m.sim && (m.w !== "me" || !/^商談の記録（/.test(String(m.subj || "")))))
                        ids[ti + "|" + String(th.id)] = 1;
                });
                const idOf = (x) => String((x && (x.id || x.bid || x.buyerId || x.to || x.b || x.co)) || "");
                (Array.isArray(t.outreach) ? t.outreach : []).concat(Array.isArray(t.netConnects) ? t.netConnects : []).forEach((x, i) => { const k = idOf(x); ids[ti + "|" + (k || ("o" + i))] = 1; });
            });
        }
        catch (e) { }
        return Object.keys(ids).length;
    };
    API.contactedBuyers = contactedBuyers;
    const isSampleTen = () => { const t = ten(); return !!(t && (t.src === "sample" || t.src === "sample2")); };
    try {
        if (typeof v88Sig === "function") {
            const o = v88Sig;
            v88Sig = function () {
                const s = o.apply(this, arguments);
                try {
                    if (s) {
                        const F = rmFacts();
                        s.deals = F.won.length;
                        s.deal = F.won.length ? 1 : 0;
                        const dc = {};
                        F.won.forEach((c) => { if (c.cty)
                            dc[c.cty] = 1; });
                        s.dealCty = dc;
                        const t = ten();
                        if (t && t.src !== "sample" && typeof v70dealActive === "function") {
                            const T = rmTens().filter((x) => x && x.src !== "sample");
                            if (T.length) {
                                const n = v70dealActive({ tens: T }).n;
                                if (typeof n === "number") {
                                    s.v92metOld = s.met;
                                    s.met = n;
                                }
                            }
                        }
                    }
                }
                catch (e) {
                    warn("sig", e);
                }
                return s;
            };
        }
        if (typeof v88Phases === "function") {
            const o = v88Phases;
            v88Phases = function (G, B, st) {
                const ph = o.apply(this, arguments);
                try {
                    const F = rmFacts();
                    const smp = isSampleTen();
                    const t0 = ten();
                    const SFX0 = ["（見本の商品のデータ）", " (sample product data)"];
                    const sfx = !smp ? "" : (t0 && t0.src === "sample") ? M("（見本の商品のデータ）", " (sample product data)", "（示例商品的数据）", " (datos de la muestra)")
                        : M("（見本の商品に入っている記録と、ご自分で足した記録から）", " (from the sample product's records and the ones you added)", "（来自示例商品中的记录和您添加的记录）", " (de los registros de la muestra y los que añadió)");
                    const W1 = (ja, en, zh, es) => M("済みの根拠：", "Done because: ", "已完成的依据：", "Hecho porque: ") + M(ja, en, zh, es) + sfx;
                    const set = (a, ok, why, not) => { if (ok) {
                        a.done = true;
                        a.why = why;
                        delete a.v92not;
                    }
                    else {
                        a.done = false;
                        delete a.why;
                        if (not)
                            a.v92not = not;
                    } };
                    (ph || []).forEach((p) => (p.acts || []).forEach((a) => {
                        if (!a)
                            return;
                        const t = String(a.t || "");
                        if (/^AIバイヤー開拓で毎月|^Reach out to buyers/.test(t)) {
                            if (ten() && ten().src !== "sample") {
                                const n = contactedBuyers();
                                set(a, n > 0, W1(`バイヤーへの連絡の記録あり（連絡した相手 ${n}社）`, `buyer outreach on file (${n} buyer(s) contacted)`, `已有联系买家的记录（已联系 ${n} 家）`, `contactos registrados (${n} comprador(es))`));
                            }
                        }
                        else if (a.tag === "sample") {
                            set(a, F.sampleRec + F.quoteN > 0, W1(`サンプル発送の記録 ${F.sampleRec}件・見積を出した案件 ${F.quoteN}件`, `${F.sampleRec} sample record(s), ${F.quoteN} quoted case(s)`, `寄样记录 ${F.sampleRec} 条・已报价案件 ${F.quoteN} 件`, `${F.sampleRec} registro(s) de muestra, ${F.quoteN} caso(s) cotizados`));
                        }
                        else if (/^契約の条件|^Agree terms/.test(t)) {
                            const L = [F.nego ? M(`ステータスが「契約交渉」になった相手 ${F.nego}社`, `${F.nego} buyer(s) reached “Negotiating contract”`, `状态到过“合同谈判”的对象 ${F.nego} 家`, `${F.nego} comprador(es) en «Negociación»`) : "", F.legal ? M(`契約書 ${F.legal}件（契約書関連）`, `${F.legal} contract(s) on file`, `合同 ${F.legal} 份`, `${F.legal} contrato(s)`) : ""].filter(Boolean).join("・");
                            set(a, !!(F.nego || F.legal), M("済みの根拠：", "Done because: ", "已完成的依据：", "Hecho porque: ") + L + sfx);
                        }
                        else if (/^初回の出荷|^Prepare the first shipment/.test(t)) {
                            set(a, F.shippedL.length > 0, W1(`船積みまで進んだ出荷の案件 ${F.shippedL.length}件（B/L 番号あり・出荷の手続き完了）`, `${F.shippedL.length} shipment case(s) reached loading (B/L number / shipping steps completed)`, `已进行到装船的出货案件 ${F.shippedL.length} 件（有提单号・出货手续完成）`, `${F.shippedL.length} envío(s) embarcados (B/L / trámites completos)`));
                        }
                        else if (/^2回目の注文|^Turn the first order/.test(t)) {
                            set(a, F.repeat.length > 0, W1(`同じ相手からの受注が2件以上（${F.repeat.map((c) => c.buyer).slice(0, 2).join("・")}）`, `2+ orders from the same buyer (${F.repeat.map((c) => c.buyer).slice(0, 2).join(", ")})`, `同一对象的接单达2件以上（${F.repeat.map((c) => c.buyer).slice(0, 2).join("・")}）`, `2+ pedidos del mismo comprador (${F.repeat.map((c) => c.buyer).slice(0, 2).join(", ")})`));
                        }
                        else if (/^2か国目へ|^Add a second market/.test(t)) {
                            set(a, F.nCty >= 2 && F.won.length >= 3, W1(`受注・取引のある相手 ${F.won.length}社・${F.nCty}か国（2か国以上・3社以上で済み）`, `${F.won.length} buyer(s) with orders in ${F.nCty} market(s) (done at 2+ markets and 3+ buyers)`, `有接单・交易的对象 ${F.won.length} 家・${F.nCty} 个国家（2国以上且3家以上视为完成）`, `${F.won.length} comprador(es) con pedidos en ${F.nCty} mercado(s) (hecho con 2+ mercados y 3+ compradores)`));
                        }
                    }));
                    if (t0 && t0.src === "sample")
                        (ph || []).forEach((p) => (p.acts || []).forEach((a) => {
                            if (!a || !a.done || a.st !== 10 || /^2か国目へ|^Add a second market/.test(String(a.t || "")))
                                return;
                            if (!(F.nCty >= 2 && F.won.length >= 3)) {
                                a.done = false;
                                delete a.why;
                            }
                        }));
                    if (smp && t0 && t0.src !== "sample")
                        (ph || []).forEach((p) => (p.acts || []).forEach((a) => { if (a && typeof a.why === "string")
                            SFX0.forEach((x) => { if (a.why.endsWith(x))
                                a.why = a.why.slice(0, -x.length) + sfx; }); }));
                    (ph || []).forEach((p) => { if (p && p.done && !(p.acts || []).every((a) => a && a.done))
                        p.done = false; });
                }
                catch (e) {
                    warn("phases", e);
                }
                return ph;
            };
        }
    }
    catch (e) {
        warn("rm", e);
    }
    try {
        const g = W;
        if (typeof g.v88Road === "function" || typeof v88Road === "function") {
            const o = v88Road;
            v88Road = function () {
                let h = o.apply(this, arguments);
                try {
                    if (typeof h === "string")
                        h = h.replace(/の模擬の返事だけの会話（(\d+)件）は、進みに数えていません/, (m, n) => `の模擬の返事だけの会話（${n}件）は、段階（いまどこまで進んだか）の判定に使っていません。こちらから連絡した相手の数には入れています（分析・レポートと同じ）`);
                }
                catch (e) { }
                return h;
            };
        }
    }
    catch (e) {
        warn("road", e);
    }
    try {
        if (!document.getElementById("v92r6bcss")) {
            const st = document.createElement("style");
            st.id = "v92r6bcss";
            st.textContent = "#v92r6bDrill .v92r6b-list{margin-top:8px;display:flex;flex-direction:column;gap:6px;max-height:380px;overflow-y:auto}#v92r6bDrill .v92r6b-cd{border:1px solid var(--line,#e3e6ea);border-radius:8px;padding:8px 10px;background:var(--card,#fff);font-size:11px;line-height:1.55}#v92r6bDrill .v92r6b-c1{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}#v92r6bDrill .v92r6b-nm{min-width:0;overflow-wrap:anywhere}#v92r6bDrill .v92r6b-no{font-size:10.5px;color:var(--ink-3,#667)}#v92r6bDrill .v92r6b-ct{color:var(--ink-3,#667)}#v92r6bDrill .v92r6b-am{text-align:right;white-space:nowrap;flex:0 0 auto}#v92r6bDrill .v92r6b-sub{font-size:9.5px;color:var(--ink-3,#667)}#v92r6bDrill .v92r6b-c2,#v92r6bDrill .v92r6b-c4{font-size:10.5px;color:var(--ink-2,#445);margin-top:2px;overflow-wrap:anywhere}#v92r6bDrill .v92r6b-c3{margin-top:3px}#v92r6bDrill .p.lo{white-space:normal;display:inline-block}.v92r6b-nr{font-weight:700}";
            (document.head || document.documentElement).appendChild(st);
        }
    }
    catch (e) { }
})();
