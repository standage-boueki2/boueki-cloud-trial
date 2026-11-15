(function () {
    const W = window;
    if (W.__v2192r5b)
        return;
    W.__v2192r5b = 1;
    const API = (W.v92r5b = W.v92r5b || {});
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const lang = () => { try {
        if (typeof I18N !== "undefined" && I18N && I18N.lang) {
            const v = String(I18N.lang);
            return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
        }
    }
    catch (e) { } return "ja"; };
    const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    API.M = M;
    const warn = (k, e) => { try {
        console.warn("[v92r5b] " + k, e);
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
    const ships = () => { try {
        return (typeof SHIPS !== "undefined" && Array.isArray(SHIPS) && SHIPS.length && (typeof PID === "undefined" || SHIPS._pid === PID)) ? SHIPS : null;
    }
    catch (e) {
        return null;
    } };
    const isUserCase = (c) => { try {
        const S = c && c.ship;
        return !!(c && c.po) || !!(S && (S.poNo || S.v61fb || S.v56shipFb || S.v54copy));
    }
    catch (e) {
        return true;
    } };
    const REC_NO = () => M("商談の記録", "Meeting record", "商谈记录", "Registro de reunión");
    const recOrders = (us, have) => {
        const out = [];
        try {
            (us || []).forEach((u) => {
                const fb = (u && u.D && u.D.fb) || [];
                fb.forEach((r) => {
                    try {
                        if (!r || Array.isArray(r) || r.st !== "受注" || !r.user)
                            return;
                        if (u.act && r.v61id && typeof v61dlCasesOf === "function" && (v61dlCasesOf(r.v61id) || []).length)
                            return;
                        if (have.some((o) => o && o.ref === u.ref && String(o.buyer || "") === String(r.b || "") && o.src !== "v92rec"))
                            return;
                        const p = typeof v61dlEffPrice === "function" ? v61dlEffPrice(r) : null;
                        const a = p ? amtParse(p.s) : null;
                        const q = typeof v61dlNum === "function" ? v61dlNum(r.lot) : null;
                        if (!a || !a.cur || !(a.v > 0) || !(q > 0))
                            return;
                        const v = Math.round(a.v * q * 100) / 100;
                        const total = (a.cur === "USD" ? "US$" : "¥") + v.toLocaleString("en-US", a.cur === "USD" ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 });
                        out.push({ no: REC_NO(), buyer: r.b || "—", cty: r.c || "—", item: u.item, co: u.co, qty: r.lot || "—", unit: p.s, total, a: { cur: a.cur, v }, docRate: 0, dISO: String(r.d || "").slice(0, 10), ref: u.ref, src: "v92rec", v68k: "fb", v92rec: 1 });
                    }
                    catch (e) { }
                });
            });
        }
        catch (e) {
            warn("recOrders", e);
        }
        return out;
    };
    try {
        if (typeof dashOrders === "function") {
            const o = dashOrders;
            dashOrders = function (us) {
                let us2 = us;
                try {
                    const S = ships();
                    if (S && Array.isArray(us)) {
                        us2 = us.map((u) => {
                            if (!u || !u.act || !u.D || !u.D.ship)
                                return u;
                            const s0 = S[0] && S[0].ship;
                            const own = (u.kind === "demo" && s0 && !isUserCase(S[0])) ? s0 : null;
                            if (u.D.ship === own)
                                return u;
                            if (!own && !S.some((c) => c && c.ship === u.D.ship))
                                return u;
                            const D2 = Object.create(u.D);
                            D2.ship = own;
                            return Object.assign({}, u, { D: D2 });
                        });
                    }
                }
                catch (e) {
                    warn("orders-us", e);
                    us2 = us;
                }
                const out = o.call(this, us2) || [];
                try {
                    recOrders(us, out).forEach((x) => out.push(x));
                }
                catch (e) {
                    warn("orders-rec", e);
                }
                return out;
            };
        }
    }
    catch (e) {
        warn("orders", e);
    }
    const isQ = (r) => !!r && !Array.isArray(r) && ((!!r.price && r.price !== "—") || /見積提示|サンプル発送|受注/.test(String(r.st || "")));
    try {
        if (typeof dashAgg === "function") {
            const o = dashAgg;
            dashAgg = function (us) {
                const A = o.apply(this, arguments);
                try {
                    if (A && A.K && !A.per && !A.v92r5bQ) {
                        A.v92r5bQ = 1;
                        (A.us || us || []).forEach((u) => {
                            const fb = (u && u.D && u.D.fb) || [];
                            if (u.kind === "demo")
                                A.K.quotes += fb.filter((r) => r && r.user && isQ(r)).length;
                            else
                                A.K.quotes += Math.max(0, fb.filter(isQ).length - (+((u.D.kpi || {}).quotes) || 0));
                        });
                    }
                    if (A && API._qd && Array.isArray(A.fb))
                        A.fb.forEach((r) => { if (isQ(r) && !(r.price && r.price !== "—"))
                            r.price = M("（価格の記録なし）", "(no price recorded)", "（未记录价格）", "(sin precio)"); });
                }
                catch (e) {
                    warn("agg", e);
                }
                return A;
            };
        }
        if (typeof dashDrill === "function") {
            const o = dashDrill;
            dashDrill = function (kind, arg) {
                const q = kind === "funnel" && /見積/.test(String(arg || ""));
                if (q)
                    API._qd = 1;
                let r;
                try {
                    r = o.apply(this, arguments);
                }
                finally {
                    if (q)
                        API._qd = 0;
                }
                try {
                    if (kind === "orders") {
                        const pn = document.getElementById("pn") || document.getElementById("dw");
                        if (pn)
                            pn.querySelectorAll("tr").forEach((tr) => {
                                const td = tr.querySelector("td");
                                if (!td || String(td.textContent || "").trim() !== REC_NO())
                                    return;
                                const b = tr.querySelector("button");
                                if (b && b.parentElement)
                                    b.parentElement.innerHTML = `<span class="nn" data-noi18n style="font-size:9.5px;margin:0">${E(M("単価×数量（書類をつくると Invoice の額に替わります）", "unit price × qty (replaced by the invoice amount once documents are made)", "单价×数量（制作单据后改为发票金额）", "precio × cantidad (se sustituye por la factura al crear documentos)"))}</span>`;
                            });
                    }
                }
                catch (e) {
                    warn("drill", e);
                }
                return r;
            };
        }
    }
    catch (e) {
        warn("quotes", e);
    }
    try {
        if (typeof vDash === "function") {
            const o = vDash;
            vDash = function () {
                let h = o.apply(this, arguments);
                try {
                    if (typeof h !== "string" || h.indexOf('id="v68qkd"') < 0)
                        return h;
                    h = h.replace('<div class="kd" id="v68qkd">', '<div class="kd" id="v68qkd" data-kqn="1">');
                    const A = dashAgg(dashScopeUnits());
                    const nOrd = (A.orders || []).filter((x) => x && x.src !== "base").length;
                    if (nOrd) {
                        h = h.replace("見積金額は見積書（PI）の合計で、まだ見積書がありません", M("見積金額は、受注がまだ決まっていない案件の見積書（PI）の合計です。受注が決まった案件の分は、累計受注金額に入れています", "", "", ""));
                        h = h.replace("The quoted amount is the total of quotations (PI); none yet", "The quoted amount is the total of quotations (PI) for cases not yet ordered; confirmed orders are counted in the order total");
                        h = h.replace(/(<span class="n" id="v68qamt">)(金額の記録なし|no amount recorded)(<\/span>)/, (m, a, b, c) => a + E(M("受注未確定の見積書はありません", "no open quotations", "没有未确定的报价单", "sin cotizaciones abiertas")) + c);
                    }
                    const qs = (A.quotes || []).filter((x) => x && x.a && x.a.cur === "USD");
                    if (qs.length && (!DASH || DASH.cur !== "USD")) {
                        const r = dashRate();
                        const rates = [];
                        qs.forEach((x) => { const t = x.docRate ? M(`${x.docRate}円（見積書に書いたレート）`, `¥${x.docRate} (rate on the quotation)`, `${x.docRate}日元（报价单上的汇率）`, `¥${x.docRate} (tipo de la cotización)`) : M(`${r.v.toFixed(2)}円（参照レート ${r.d || ""}）`, `¥${r.v.toFixed(2)} (reference rate ${r.d || ""})`, `${r.v.toFixed(2)}日元（参考汇率 ${r.d || ""}）`, `¥${r.v.toFixed(2)} (tipo de referencia ${r.d || ""})`); if (rates.indexOf(t) < 0)
                            rates.push(t); });
                        const a = h.indexOf('id="v68qkd"'), b = a >= 0 ? h.indexOf("</div>", a) : -1;
                        if (b > a)
                            h = h.slice(0, b) + `<br><span class="v92r5b-qrate" data-noi18n style="font-size:9px">${E(M("換算：1 US$＝", "Converted at 1 US$ = ", "换算：1 US$＝", "Conversión: 1 US$ = "))}${E(rates.join("／"))}</span>` + h.slice(b);
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
    try {
        const comma = (s) => s.replace(/US\$(\d{4,})(\.\d+)?/g, (m, a, b) => "US$" + a.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (b || ""));
        const dirOf = (h) => h.indexOf("<span>高い金額です。</span>") >= 0 ? "high" : h.indexOf("自社の価格表の範囲に入っています") >= 0 ? "same" : "low";
        if (typeof v56dCmpHtml === "function") {
            const o = v56dCmpHtml;
            v56dCmpHtml = function (c) {
                let h = o.apply(this, arguments);
                try {
                    if (typeof h === "string" && h) {
                        const key = "の価格に運賃などを足して比べる必要があるので、実際の差はもっと大きくなります。";
                        const i = h.indexOf(key);
                        if (i >= 0) {
                            const d = dirOf(h);
                            const t = d === "high" ? M("の価格に運賃などを足して比べる必要があるので、先方が高い分（余裕）は小さくなります（運賃しだいで、足りなくなることもあります）。", " price needs freight etc. added before comparing, so the buyer's margin above your price becomes smaller (and may turn negative depending on freight). ", "的价格需加上运费等再比较，因此对方高出的部分（余量）会变小（视运费而定，也可能不够）。", " debe sumar el flete, etc. antes de comparar, por lo que el margen a favor se reduce (y puede volverse negativo según el flete). ")
                                : d === "same" ? M("の価格に運賃などを足して比べる必要があるので、足したあとは、先方の希望のほうが低くなることがあります。", " price needs freight etc. added before comparing; after that the buyer's offer may be lower than your price. ", "的价格需加上运费等再比较，加上之后对方的期望价可能更低。", " debe sumar el flete, etc. antes de comparar; después la oferta puede quedar por debajo. ") : "";
                            if (t)
                                h = h.slice(0, i) + `</span><span data-noi18n>${E(t)}</span><span>` + h.slice(i + key.length);
                        }
                        h = comma(h);
                    }
                }
                catch (e) { }
                return h;
            };
        }
        if (typeof v56dCmpPlain === "function") {
            const o = v56dCmpPlain;
            v56dCmpPlain = function (c) {
                let s = o.apply(this, arguments);
                try {
                    if (typeof s === "string" && s) {
                        const key = "の価格に運賃などを足して比べるため、実際の差はもっと大きい";
                        if (s.indexOf(key) >= 0) {
                            const hi = /先方の希望は自社の価格より .* 高い/.test(s), same = /先方の希望は価格表の範囲内/.test(s);
                            if (hi)
                                s = s.replace(key, "の価格に運賃などを足して比べるため、先方が高い分（余裕）は小さくなる（足りなくなることもある）");
                            else if (same)
                                s = s.replace(key, "の価格に運賃などを足して比べるため、足したあとは先方の希望のほうが低くなることがある");
                        }
                        s = comma(s);
                    }
                }
                catch (e) { }
                return s;
            };
        }
    }
    catch (e) {
        warn("cmp", e);
    }
    const cnt = (a) => Array.isArray(a) ? a.length : 0;
    const rmTens = () => { try {
        if (typeof v88Tens === "function")
            return v88Tens() || [];
    }
    catch (e) { } const t = ten(); return t ? [t] : []; };
    const isSample = () => { const t = ten(); return !!(t && t.src === "sample"); };
    const setupDone = () => { const o = {}; try {
        const S = (typeof ux32Setup === "function") ? ux32Setup() : null;
        if (Array.isArray(S))
            S.forEach((r) => { if (Array.isArray(r))
                o[r[0]] = !!r[4]; });
        else
            return null;
    }
    catch (e) {
        return null;
    } return o; };
    const contacted = () => {
        let n = 0;
        try {
            rmTens().forEach((t) => {
                n += cnt(t.outreach) + cnt(t.netConnects);
                Object.values(t.dmThreads || {}).forEach((th) => {
                    const ms = (th && Array.isArray(th.msgs)) ? th.msgs : [];
                    if (ms.some((m) => m && !m.sim && (m.w !== "me" || !/^商談の記録（/.test(String(m.subj || "")))))
                        n++;
                });
            });
        }
        catch (e) { }
        return n;
    };
    const hasPriceTable = () => { try {
        const d = dd();
        if (d && cnt(d.priceRows))
            return true;
        return rmTens().some((t) => cnt(t.priceRows) || t.fobIn || Object.keys(t.ddpPx || {}).length);
    }
    catch (e) {
        return false;
    } };
    const fbAll = () => { const L = []; try {
        rmTens().forEach((t) => (Array.isArray(t.fbx) ? t.fbx : []).forEach((f) => { if (f && !Array.isArray(f))
            L.push(f); }));
    }
    catch (e) { } return L; };
    const taskDone = (re) => {
        try {
            const L = [];
            rmTens().forEach((t) => (t.xtasks || []).forEach((x) => L.push(x)));
            const d = dd();
            if (d && Array.isArray(d.tasks))
                d.tasks.forEach((x) => { L.push(x); (x.kids || []).forEach((k) => L.push(k)); });
            const x = L.find((y) => y && y.st === "完了" && re.test(String(y.n || "")));
            return x ? String(x.n || "").replace(/^🧭\s*/, "") : "";
        }
        catch (e) {
            return "";
        }
    };
    API.contacted = contacted;
    try {
        if (typeof v88Sig === "function") {
            const o = v88Sig;
            v88Sig = function () {
                const s = o.apply(this, arguments);
                try {
                    if (s && !isSample()) {
                        s.reach = contacted() ? 1 : 0;
                        if (hasPriceTable())
                            s.price = 1;
                        const SD = setupDone();
                        if (SD && SD.cty === false)
                            s.tg = 0;
                        if (SD && SD.reg === false)
                            s.reg = 0;
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
                    const sig = (st && st.sig) || {};
                    const smp = isSample();
                    const W1 = (ja, en, zh, es) => M("済みの根拠：", "Done because: ", "已完成的依据：", "Hecho porque: ") + M(ja, en, zh, es);
                    const byTask = (a, re) => { const n = taskDone(re); if (n) {
                        a.done = true;
                        a.why = W1(`タスク「${n}」を完了`, `task “${n}” completed`, `任务“${n}”已完成`, `tarea “${n}” completada`);
                    }
                    else {
                        a.done = false;
                        delete a.why;
                    } };
                    const set = (a, ok, why) => { if (ok) {
                        a.done = true;
                        a.why = why;
                    }
                    else {
                        a.done = false;
                        delete a.why;
                    } };
                    if (!smp)
                        (ph || []).forEach((p) => (p.acts || []).forEach((a) => {
                            if (!a)
                                return;
                            const t = String(a.t || "");
                            if (a.tag === "tm")
                                byTask(a, /商標|trademark/i);
                            else if (a.tag === "fair") {
                                if (/^展示会に出る|^Exhibit/.test(t)) {
                                    const n = fbAll().filter((f) => /展示会/.test(String(f.ch || ""))).length;
                                    if (n)
                                        set(a, true, W1(`チャネルが「展示会」の商談の記録 ${n}件`, `${n} meeting record(s) with channel “Trade show”`, `渠道为“展会”的商谈记录 ${n} 条`, `${n} registro(s) con canal “Feria”`));
                                    else
                                        byTask(a, /展示会|trade show/i);
                                }
                                else
                                    byTask(a, /認知|awareness/i);
                            }
                            else if (a.tag === "ec")
                                byTask(a, /テスト販売|越境EC|e-commerce/i);
                            else if (/^OEM|^Summarise how you take OEM/.test(t))
                                byTask(a, /OEM/);
                            else if (/^輸出の価格|^Set export prices/.test(t))
                                set(a, hasPriceTable(), W1("価格表・輸出価格あり", "prices on file", "已有价格表・出口价格", "precios registrados"));
                            else if (/^AIバイヤー開拓で毎月|^Reach out to buyers/.test(t)) {
                                const n = contacted();
                                set(a, n > 0, W1(`バイヤーへの連絡の記録あり（${n}件）`, `buyer outreach on file (${n})`, `已有联系买家的记录（${n} 条）`, `contactos con compradores registrados (${n})`));
                            }
                            else if (/^返事が来たら|^Reply fast/.test(t)) {
                                const n = fbAll().length;
                                set(a, n > 0, W1(`商談の記録 ${n}件`, `${n} meeting record(s)`, `商谈记录 ${n} 条`, `${n} registro(s) de reunión`));
                            }
                            else if (a.tag === "sample") {
                                if (!sig.sample) {
                                    a.done = false;
                                    delete a.why;
                                }
                            }
                            else if (/^契約の条件|^Agree terms/.test(t)) {
                                if (!sig.nego) {
                                    a.done = false;
                                    delete a.why;
                                }
                            }
                            else if (/^初回の出荷|^Prepare the first shipment/.test(t)) {
                                if (!sig.deal) {
                                    a.done = false;
                                    delete a.why;
                                }
                            }
                            else if (/^2回目の注文|^Turn the first order/.test(t)) {
                                if (!((sig.deals | 0) >= 2 || (sig.orders | 0) >= 2)) {
                                    a.done = false;
                                    delete a.why;
                                }
                            }
                            else if (/^2か国目へ|^Add a second market/.test(t)) {
                                if (Object.keys(sig.dealCty || {}).length < 2) {
                                    a.done = false;
                                    delete a.why;
                                }
                            }
                            else if (/^国ごとの代理店|^Standardise distributor/.test(t))
                                byTask(a, /代理店|distributor/i);
                        }));
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
        if (typeof ux32Setup === "function") {
            const o = ux32Setup;
            ux32Setup = function () {
                const S = o.apply(this, arguments);
                try {
                    if (Array.isArray(S))
                        S.forEach((r) => { if (Array.isArray(r) && typeof r[5] === "string")
                            r[5] = r[5].replace(/^(まだの理由：|Not yet: |Why not yet: |未完成的原因：|Pendiente: |Por qué falta: )/, ""); });
                }
                catch (e) { }
                return S;
            };
        }
    }
    catch (e) {
        warn("setup", e);
    }
    try {
        const early = () => {
            try {
                if (typeof SES === "undefined" || !SES || SES.t !== "trial" || SES.role === "fwd")
                    return false;
                if (typeof PID !== "undefined" && PID)
                    return false;
                if (document.getElementById("lgv") || document.body.classList.contains("locked"))
                    return false;
                const t = loadTen();
                if (!t)
                    return false;
                TEN = t;
                PID = "custom";
                try {
                    syncTenant();
                }
                catch (e) { }
                try {
                    cur = scoreOf(TEN).missing.length ? "up" : "dash";
                }
                catch (e) { }
                try {
                    const w = document.getElementById("welv");
                    if (w)
                        w.remove();
                }
                catch (e) { }
                API._early = (API._early | 0) + 1;
                try {
                    buildNav();
                }
                catch (e) { }
                try {
                    render();
                }
                catch (e) { }
                return true;
            }
            catch (e) {
                warn("early", e);
                return false;
            }
        };
        API.early = early;
        if (!early()) {
            let n = 0;
            const iv = setInterval(() => { n++; try {
                if (early() || (typeof PID !== "undefined" && PID) || n > 40)
                    clearInterval(iv);
            }
            catch (e) {
                clearInterval(iv);
            } }, 150);
        }
    }
    catch (e) {
        warn("boot", e);
    }
    try {
        if (typeof v38DashWait === "function") {
            const o = v38DashWait;
            v38DashWait = function () {
                let h = String(o.apply(this, arguments));
                try {
                    let all = 0;
                    try {
                        const S = taskStats();
                        const td = String((typeof TODAYS !== "undefined" && TODAYS) || "").slice(0, 10);
                        if (td)
                            all = (S.all || []).filter((t) => t && t.e && !/^(完了|中止)$/.test(String(t.st || "")) && String(t.e).slice(0, 10) <= td).length;
                    }
                    catch (e) { }
                    let mine = 0;
                    try {
                        mine = (v38WaitCounts() || {}).today | 0;
                    }
                    catch (e) { }
                    const sub = M("自分の番のもの（過ぎたものを含む）", "Yours only (incl. overdue)", "仅自己负责的（含已过期）", "Solo lo suyo (incl. vencido)")
                        + (all > mine ? M(`。会社全体のタスクでは ${all}件（タスク・進行）`, `. Company-wide tasks: ${all} (Tasks)`, `。全公司任务为 ${all} 件（任务・进度）`, `. Tareas de toda la empresa: ${all} (Tareas)`) : "");
                    h = h.replace(/(data-v38wf="today">[\s\S]*?<span class="v38ws")(>)[^<]*(<\/span>)/, (m, a, b, c) => a + " data-noi18n" + b + E(sub) + c);
                }
                catch (e) { }
                return h;
            };
        }
    }
    catch (e) {
        warn("wait", e);
    }
    const hidList = () => { try {
        const t = ten();
        return ((t ? t.v92r4bHid : W.__v92r4bHid) || []);
    }
    catch (e) {
        return [];
    } };
    API.hidThreads = () => { const out = []; try {
        hidList().forEach((h) => { (h.th || []).forEach((id) => out.push(String(id))); (h.k || []).forEach((k) => { const m = /^my:(.+)$/.exec(String(k)); if (m)
            out.push(m[1]); }); });
    }
    catch (e) { } return out; };
    try {
        const nrm = (s) => { try {
            if (typeof v30Norm === "function")
                return v30Norm(s);
        }
        catch (e) { } return String(s || "").toLowerCase().replace(/\s+/g, ""); };
        if (typeof v70dealActive === "function") {
            const o = v70dealActive;
            v70dealActive = function () {
                const A = o.apply(this, arguments);
                try {
                    const H = hidList();
                    if (H.length && A && Array.isArray(A.rows)) {
                        const set = {};
                        H.forEach((h) => (h.k || []).forEach((k) => { set[k] = 1; }));
                        const rows = A.rows.filter((r) => { if (!r || r.my)
                            return true; const n = nrm(r.name); return !(set[String(r.key)] || set["nm:" + n + "|" + (r.cty || "")] || set["nm:" + n + "|"]); });
                        if (rows.length !== A.rows.length) {
                            A.rows = rows;
                            A.n = rows.length;
                            A.hot = rows.filter((r) => r.prob === "高").length;
                            A.ctys = new Set(rows.map((r) => r.cty).filter(Boolean)).size;
                        }
                    }
                }
                catch (e) { }
                return A;
            };
            try {
                W.V70DEAL_ACTIVE = v70dealActive;
            }
            catch (e) { }
        }
        if (typeof b30Remove === "function") {
            const o = b30Remove;
            b30Remove = function (key) {
                let ids = [], n0 = 0;
                try {
                    const r0 = b30Find(key);
                    n0 = hidList().length;
                    if (r0) {
                        [].concat(r0.ths || [], r0.th ? [r0.th] : []).forEach((x) => { const id = x && (x.id || (x.th && x.th.id)); if (id)
                            ids.push(String(id)); });
                        if (r0.my && r0.my.id)
                            ids.push(String(r0.my.id));
                    }
                }
                catch (e) { }
                const r = o.apply(this, arguments);
                try {
                    const H = hidList();
                    if (H.length > n0 && ids.length) {
                        H[H.length - 1].th = ids.filter((x, i) => ids.indexOf(x) === i);
                        try {
                            saveTen();
                        }
                        catch (e) { }
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("hid", e);
    }
    try {
        const tabFix = () => {
            try {
                const b = document.querySelector("#b30tabs .optab b");
                if (!b || typeof b30Collect !== "function")
                    return;
                const n = b30Collect().filter((r) => r && r.lead !== "失注").length;
                const t = String(b.textContent || "");
                const u = t.replace(/[（(]\d+[）)]/, (m) => m.charAt(0) + n + m.charAt(m.length - 1));
                if (u !== t)
                    b.textContent = u;
            }
            catch (e) { }
        };
        const dwFix = () => {
            try {
                const dw = document.getElementById("dw");
                if (!dw)
                    return;
                const MB = (() => { try {
                    const t = ten();
                    return (t && Array.isArray(t.myBuyers)) ? t.myBuyers : [];
                }
                catch (e) {
                    return [];
                } })();
                dw.querySelectorAll('[data-shipgo="dm"]:not([data-v92r5b])').forEach((btn) => {
                    btn.setAttribute("data-v92r5b", "1");
                    const row = btn.parentElement;
                    if (!row)
                        return;
                    const m = /（ID ([^）]+)）\s*$/.exec(String(btn.getAttribute("data-buyer") || ""));
                    const b = m ? MB.find((x) => x && String(x.id) === m[1] && x.co) : null;
                    const tw = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, null);
                    let n;
                    const T = [];
                    while ((n = tw.nextNode()))
                        T.push(n);
                    T.forEach((x) => { if (/往復 \d+通/.test(x.nodeValue))
                        x.nodeValue = x.nodeValue.replace(/往復 (\d+)通/, (q, k) => M(`やりとり ${k}通`, `${k} message(s)`, `往来 ${k} 条`, `${k} mensaje(s)`)); });
                    if (b) {
                        const cty = btn.getAttribute("data-cty") || b.cty || "";
                        const first = T.find((x) => String(x.nodeValue || "").trim() && !btn.contains(x));
                        if (first)
                            first.nodeValue = b.co + (cty ? `（${cty}）` : "");
                        btn.setAttribute("data-buyer", b.co);
                    }
                });
                const w = dw.querySelector(".v79dtgt-w:not([data-v92r5b])");
                if (w && /見本の商品です|sample product/.test(String(w.textContent || ""))) {
                    w.setAttribute("data-v92r5b", "1");
                    if (isSample())
                        w.insertAdjacentHTML("beforeend", ` <span data-noi18n>${E(M("完成形の見本に足した記録は、アプリを開き直すと残りません（見本は毎回、最初の状態に戻ります）。", "Records added to a full sample are not kept when you reopen the app (the sample resets each time).", "添加到完整示例中的记录，重新打开应用后不会保留（示例每次都会恢复到初始状态）。", "Los registros añadidos al ejemplo completo no se conservan al reabrir la aplicación (el ejemplo se reinicia cada vez)."))}</span>`);
                }
            }
            catch (e) { }
        };
        let tm = 0;
        const soon = () => { if (tm)
            return; tm = setTimeout(() => { tm = 0; tabFix(); dwFix(); }, 80); };
        if (typeof render === "function") {
            const o = render;
            render = function () { const r = o.apply(this, arguments); soon(); return r; };
        }
        document.addEventListener("click", () => { soon(); setTimeout(soon, 400); }, true);
        document.addEventListener("input", soon, true);
    }
    catch (e) {
        warn("dom", e);
    }
})();
