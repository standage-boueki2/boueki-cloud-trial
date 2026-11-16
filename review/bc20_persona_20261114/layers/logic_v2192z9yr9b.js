(function () {
    const W = window;
    if (W.__v2192r9b)
        return;
    W.__v2192r9b = 1;
    const API = (W.v92r9b = W.v92r9b || {});
    const LG = () => { try {
        return (typeof I18N !== "undefined" && I18N && I18N.lang) || document.documentElement.lang || "ja";
    }
    catch (e) {
        return "ja";
    } };
    const L2 = () => String(LG()).slice(0, 2);
    const M = (ja, en, zh, es) => { const l = L2(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const warn = (k, e) => { try {
        console.warn("[21.94 r9b] " + k, e);
    }
    catch (x) { } };
    const ten = () => { try {
        return (typeof TEN !== "undefined" && TEN) || null;
    }
    catch (e) {
        return null;
    } };
    const NK = (s) => String(s == null ? "" : s).normalize("NFKC").toLowerCase().replace(/（見本）|\(sample\)/g, "").replace(/[\s・.,'"’\-]/g, "");
    API.M = M;
    const dict = (rows) => {
        try {
            if (typeof I18N === "undefined" || !I18N || !I18N.dict)
                return;
            const DI = I18N.dict;
            ["en", "zh", "es"].forEach((l) => { if (!DI[l])
                DI[l] = {}; });
            rows.forEach((r) => { if (r[1] && DI.en[r[0]] == null)
                DI.en[r[0]] = r[1]; if (r[2] && DI.zh[r[0]] == null)
                DI.zh[r[0]] = r[2]; if (r[3] && DI.es[r[0]] == null)
                DI.es[r[0]] = r[3]; });
        }
        catch (e) { }
    };
    const CH_MAIL = "メール・DM";
    const mailedTo = (name) => {
        try {
            const k = NK(name);
            if (!k || typeof v71obSt !== "function")
                return false;
            const runs = ((v71obSt() || {}).runs) || [];
            for (const r of runs)
                for (const L of ((r && r.leads) || [])) {
                    if (!L || !Array.isArray(L.sent) || !L.sent.length)
                        continue;
                    if (NK(L.name || L.co || "") === k)
                        return true;
                }
        }
        catch (e) { }
        return false;
    };
    API.mailedTo = mailedTo;
    try {
        if (typeof openDealForm === "function") {
            const __odf = openDealForm;
            openDealForm = function () {
                const r = __odf.apply(this, arguments);
                try {
                    const sel = document.getElementById("dfCh");
                    if (sel && sel.tagName === "SELECT" && !sel.dataset.r9b) {
                        sel.dataset.r9b = "1";
                        const o = document.createElement("option");
                        o.value = "";
                        o.textContent = M("（選んでください）", "(choose)", "（请选择）", "(elija)");
                        o.setAttribute("data-noi18n", "1");
                        sel.insertBefore(o, sel.firstChild);
                        sel.value = "";
                        sel.addEventListener("change", () => { sel.dataset.r9bMan = "1"; const n = document.getElementById("r9bChNote"); if (n)
                            n.remove(); });
                        const auto = () => {
                            try {
                                if (sel.dataset.r9bMan || sel.value)
                                    return;
                                const b = document.getElementById("dfB");
                                if (!b || !mailedTo(b.value))
                                    return;
                                sel.value = CH_MAIL;
                                if (!document.getElementById("r9bChNote")) {
                                    const n = document.createElement("small");
                                    n.id = "r9bChNote";
                                    n.setAttribute("data-noi18n", "1");
                                    n.style.cssText = "display:block;margin:3px 0 0;font-size:11.5px;color:var(--ink-3,#6b7280)";
                                    n.textContent = M("AIバイヤー開拓でメールを送った相手なので「メール・DM」にしました（違うときは選び直してください）", "Set to “E-mail / DM” because you e-mailed this buyer from AI Buyer Outreach (change it if needed)", "因为已通过AI买家开拓向该对象发送邮件，已设为“邮件・私信”（不对时请重新选择）", "Se puso «Correo / DM» porque escribió a este comprador desde la prospección con IA (cámbielo si no es así)");
                                    sel.insertAdjacentElement("afterend", n);
                                }
                            }
                            catch (e) { }
                        };
                        const b = document.getElementById("dfB");
                        if (b) {
                            b.addEventListener("change", auto);
                            b.addEventListener("input", auto);
                        }
                        [300, 900].forEach((ms) => setTimeout(auto, ms));
                    }
                }
                catch (e) {
                    warn("dealform", e);
                }
                return r;
            };
        }
        if (typeof dealSave === "function") {
            const __ds = dealSave;
            dealSave = function () {
                try {
                    const sel = document.getElementById("dfCh");
                    const b = document.getElementById("dfB");
                    if (sel && !sel.value && !sel.dataset.r9bMan && b && mailedTo(b.value))
                        sel.value = CH_MAIL;
                }
                catch (e) { }
                return __ds.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("deal", e);
    }
    const DASH = /^[\s—\-ー–‐―－]+$/;
    const isDash = (v) => typeof v === "string" && v !== "" && DASH.test(v);
    const shelfLbl = () => { try {
        return typeof v68pFL === "function" ? String(v68pFL("bShelf") || "") : "";
    }
    catch (e) {
        return "";
    } };
    const merged = (t) => {
        try {
            if (!t || typeof v68pGroups !== "function")
                return false;
            const G = v68pGroups(t) || [];
            return G.indexOf("used") >= 0 && G.indexOf("basic") >= 0 && /保証|warrant|保修|garant/i.test(shelfLbl());
        }
        catch (e) {
            return false;
        }
    };
    const real = (v) => { try {
        return typeof v68pHas === "function" ? (v68pHas(v) && !(typeof v68pPlace === "function" && v68pPlace(v))) : !!String(v || "").trim();
    }
    catch (e) {
        return false;
    } };
    const markDash = (t, k) => { try {
        if (!t.v92r9bDash || typeof t.v92r9bDash !== "object")
            t.v92r9bDash = {};
        t.v92r9bDash[k] = 1;
    }
    catch (e) { } };
    API.onlyDash = (t) => {
        try {
            if (!t || !t.v92r9bDash || typeof scoreOf !== "function")
                return false;
            const s = scoreOf(t);
            const miss = (s && s.missing) || [];
            return miss.length > 0 && miss.every((x) => x && t.v92r9bDash[x.k]);
        }
        catch (e) {
            return false;
        }
    };
    let inFix = false;
    function dashFix(t) {
        let ch = false;
        if (inFix)
            return false;
        inFix = true;
        try {
            if (!t || typeof t !== "object" || typeof NEED === "undefined" || !Array.isArray(NEED))
                return false;
            NEED.forEach((x) => { if (x && isDash(t[x.k])) {
                t[x.k] = "";
                ch = true;
                markDash(t, x.k);
            } });
            const A = t.v68attrs;
            if (A && real(A.warranty) && !String(t.shelf || "").trim() && merged(t)) {
                t.shelf = String(A.warranty);
                ch = true;
            }
        }
        catch (e) { }
        finally {
            inFix = false;
        }
        return ch;
    }
    API.dashFix = dashFix;
    const fixAll = () => { try {
        const t = ten();
        if (t)
            dashFix(t);
        if (typeof TENS !== "undefined" && Array.isArray(TENS))
            TENS.forEach((x) => { if (x && x !== t)
                dashFix(x); });
    }
    catch (e) { } };
    try {
        if (typeof scoreOf === "function") {
            const __so = scoreOf;
            scoreOf = function (t) { try {
                dashFix(t);
            }
            catch (e) { } return __so.apply(this, arguments); };
        }
        if (typeof v92prodFill === "function") {
            const __pf = v92prodFill;
            v92prodFill = function (t) { try {
                dashFix(t === undefined ? ten() : t);
            }
            catch (e) { } return __pf.apply(this, arguments); };
        }
        if (typeof v54upldGot === "function") {
            const __ug = v54upldGot;
            v54upldGot = function (t) { try {
                dashFix(t);
            }
            catch (e) { } return __ug.apply(this, arguments); };
        }
        if (typeof v54upldApply === "function") {
            const __ua = v54upldApply;
            v54upldApply = function (t) {
                const got = __ua.apply(this, arguments);
                try {
                    if (t && Array.isArray(got)) {
                        const drop = got.filter((k) => typeof k === "string" && isDash(t[k]));
                        if (drop.length) {
                            drop.forEach((k) => { t[k] = ""; markDash(t, k); });
                            return got.filter((k) => drop.indexOf(k) < 0);
                        }
                    }
                }
                catch (e) { }
                return got;
            };
        }
        if (typeof v92prodOpt === "function") {
            const __po = v92prodOpt;
            v92prodOpt = function (t) {
                const L = __po.apply(this, arguments);
                try {
                    if (Array.isArray(L) && merged(t))
                        return L.filter((x) => !(x && x.k === "v68:warranty"));
                }
                catch (e) { }
                return L;
            };
        }
        if (typeof render === "function") {
            const __rn = render;
            render = function () { fixAll(); return __rn.apply(this, arguments); };
        }
    }
    catch (e) {
        warn("dash", e);
    }
    try {
        if (typeof ux32Setup === "function") {
            const __us = ux32Setup;
            ux32Setup = function () {
                const S = __us.apply(this, arguments);
                try {
                    const t = ten();
                    if (Array.isArray(S) && t && API.onlyDash(t)) {
                        const r = S.find((x) => Array.isArray(x) && x[0] === "fill");
                        const up = S.find((x) => Array.isArray(x) && x[0] === "up");
                        if (r && !r[4] && (!up || up[4])) {
                            r[4] = true;
                            if (r.length > 6 && /足りない情報/.test(String(r[6] || "")))
                                r[6] = "";
                        }
                    }
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
        if (typeof fillAnswer === "function") {
            const __fa = fillAnswer;
            fillAnswer = function (v) {
                const args = [].slice.call(arguments);
                try {
                    const cu = (typeof FILL !== "undefined" && FILL) ? FILL.cur : null;
                    const vs = String(v == null ? "" : v).trim();
                    if (cu && cu.k === "shelf" && /^(なし|無し|ない|ないです|ありません|特になし|特にない|該当なし|none|no)$/i.test(vs) && /なし/.test(String(cu.q || "") + String(cu.ex || "")))
                        args[0] = /保証|warrant/i.test(String(cu.n || "") + String(cu.q || "")) ? "保証なし" : "該当なし";
                }
                catch (e) { }
                return __fa.apply(this, args);
            };
        }
    }
    catch (e) {
        warn("fa", e);
    }
    try {
        if (typeof v68pFieldRow === "function") {
            const __fr = v68pFieldRow;
            const MARK = "R9BVALUE0";
            v68pFieldRow = function (t, f) {
                try {
                    if (t && f && f.g === "used" && f.k === "warranty" && merged(t))
                        return "";
                    if (t && f && f.ref && typeof NEED !== "undefined" && NEED.some((n) => n && n.k === f.ref)) {
                        let v = t[f.ref];
                        const A = t.v68attrs || {};
                        const both = f.ref === "shelf" && merged(t) && real(A.warranty) && real(v) && NK(A.warranty) !== NK(v);
                        const counted = typeof v === "string" && v.trim() && !isDash(v) && typeof v68pPlace === "function" && v68pPlace(v);
                        if (both || counted) {
                            const show = both ? String(v) + " ／ " + String(A.warranty) : String(v);
                            const t2 = Object.assign({}, t);
                            t2[f.ref] = MARK;
                            const h = String(__fr.call(this, t2, f));
                            if (h.indexOf(MARK) >= 0)
                                return h.split(MARK).join(typeof v68pE === "function" ? v68pE(show) : E(show));
                        }
                    }
                }
                catch (e) {
                    warn("row", e);
                }
                return __fr.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("row-wrap", e);
    }
    try {
        if (typeof v92goalReachHtml === "function") {
            const __rh = v92goalReachHtml;
            v92goalReachHtml = function (pl) {
                let h = __rh.apply(this, arguments);
                try {
                    const SC = pl && pl.SC;
                    if (typeof h === "string" && SC && SC.lo && SC.mid && SC.hi) {
                        const f = (x) => (+x.pace || 0).toFixed(1);
                        h = h.replace(/連絡のペース 月 [\d.]+〜[\d.]+社：STANDAGE の記録の、1か月に会うバイヤーの数（中央値・上位25%）。挑戦はその 2\.5倍（展示会＋毎月の AIバイヤー開拓）/, E(`連絡のペース（1か月に会うバイヤーの数・STANDAGE の記録）：保守 月 ${f(SC.lo)}社（中央値）・標準 月 ${f(SC.mid)}社（上位25%）・挑戦 月 ${f(SC.hi)}社（標準の 2.5倍：展示会＋毎月の AIバイヤー開拓）。この画面の「標準」は 月 ${f(SC.mid)}社 です`))
                            .replace(/Outreach pace from STANDAGE medians/, E(`Outreach pace (buyers met per month, STANDAGE records): cautious ${f(SC.lo)} (median), standard ${f(SC.mid)} (top 25%), stretch ${f(SC.hi)} (2.5× standard: trade shows + monthly AI outreach). “Standard” on this screen means ${f(SC.mid)} a month`));
                    }
                }
                catch (e) {
                    warn("reach", e);
                }
                return h;
            };
        }
    }
    catch (e) {
        warn("reach-wrap", e);
    }
    const caseFor = (c) => {
        try {
            if (typeof SHIPS === "undefined" || !Array.isArray(SHIPS))
                return -1;
            const L = SHIPS.map((x, i) => ({ x, i })).filter((o) => o.x && o.x.ship && (!c || String(o.x.ship.country || "") === c));
            if (!L.length)
                return -1;
            const smp = (S) => { try {
                return typeof v536Smp === "function" ? !!v536Smp(S) : /^（想定）/.test(String(S.buyer || ""));
            }
            catch (e) {
                return false;
            } };
            const ord = (o) => !!(o.x.po || o.x.ship.poNo);
            const sc = (o) => (smp(o.x.ship) ? 0 : 2) + (ord(o) ? 1 : 0) + (o.i === SHIPA ? 0.5 : 0);
            L.sort((a, b) => sc(b) - sc(a) || (+(b.x.at || 0) - +(a.x.at || 0)));
            return L[0].i;
        }
        catch (e) {
            return -1;
        }
    };
    API.caseFor = caseFor;
    try {
        if (typeof ansDocs === "function") {
            const __ad = ansDocs;
            ansDocs = function (q) {
                const args = arguments;
                try {
                    const c = typeof pickCountry === "function" ? String(pickCountry(q) || "") : "";
                    const S0 = (typeof D !== "undefined" && D && D.ship) || null;
                    const i = caseFor(c);
                    if (c && i < 0 && S0 && String(S0.country || "") !== c && typeof ansReg === "function") {
                        const R = ansReg(q);
                        const known = !!(typeof D !== "undefined" && D && D.regs && D.regs[c]);
                        if (R && typeof R.a === "string" && !known)
                            return R;
                        if (R && typeof R.a === "string") {
                            const head = `<span data-noi18n>${E(M(`${c}向けの案件はまだありません。${c}の規制の調べから、要る手続き・書類をお答えします（見積書・請求書・梱包明細の下書きは、${c}向けの案件を作ると「書類をつくる」でつくれます）。`, `There is no case for ${c} yet. Here are the procedures and documents from the ${c} regulation check (drafts of the quotation, invoice and packing list can be made in “Create documents” once there is a case for ${c}).`, `还没有面向${c}的案件。以下根据${c}的法规调查回答所需手续和文件（建立面向${c}的案件后，可在“制作文件”中制作报价单・发票・装箱单的草稿）。`, `Aún no hay un caso para ${c}. Estos son los trámites y documentos según la revisión de normativa de ${c} (los borradores de cotización, factura y lista de empaque se crean en «Crear documentos» cuando haya un caso para ${c}).`))}</span><br><br>`;
                            return Object.assign({}, R, { a: head + R.a });
                        }
                    }
                    if (i >= 0 && typeof SHIPS !== "undefined" && SHIPS[i] && SHIPS[i].ship && SHIPS[i].ship !== S0) {
                        const a0 = SHIPA;
                        try {
                            D.ship = SHIPS[i].ship;
                            SHIPA = i;
                            return __ad.apply(this, args);
                        }
                        finally {
                            D.ship = S0;
                            SHIPA = a0;
                        }
                    }
                }
                catch (e) {
                    warn("ansDocs", e);
                }
                return __ad.apply(this, args);
            };
        }
    }
    catch (e) {
        warn("ansDocs-wrap", e);
    }
    try {
        if (typeof ansReg === "function") {
            const __ar = ansReg;
            ansReg = function () {
                const res = __ar.apply(this, arguments);
                try {
                    if (!res || typeof res.a !== "string")
                        return res;
                    const re = /<br><span style="color:var\(--warn\)">⚠ ([^<]*)<\/span>/g;
                    const seen = {};
                    let m;
                    while ((m = re.exec(res.a)))
                        seen[m[1]] = (seen[m[1]] || 0) + 1;
                    const dup = Object.keys(seen).filter((k) => seen[k] > 1);
                    if (!dup.length)
                        return res;
                    let a = res.a;
                    dup.forEach((w) => {
                        const tag = `<br><span style="color:var(--warn)">⚠ ${w}</span>`;
                        const n = seen[w];
                        const one = `<br><span style="color:var(--warn)">⚠ ${E(M(`${n}か国 共通：`, `Same for all ${n} countries: `, `${n}个国家相同：`, `Igual para los ${n} países: `))}${w}</span>`;
                        a = a.split(tag).reduce((acc, s, j) => j === 0 ? s : acc + (j === n ? one : "") + s, "");
                    });
                    res.a = a;
                }
                catch (e) {
                    warn("ansReg", e);
                }
                return res;
            };
        }
    }
    catch (e) {
        warn("ansReg-wrap", e);
    }
    try {
        if (typeof toast === "function") {
            const __to = toast;
            toast = function (m) {
                const args = [].slice.call(arguments);
                try {
                    const s = String(m == null ? "" : m);
                    const t = ten();
                    if (t && /^前回アップロードした商品情報を復元しました/.test(s) && typeof v54upldOrigin === "function" && typeof v54upldRestoreMsg === "function") {
                        const o = v54upldOrigin(t);
                        if (o === "sample" || o === "manual") {
                            let pct = "";
                            try {
                                pct = scoreOf(t).pct;
                            }
                            catch (e) { }
                            args[0] = v54upldRestoreMsg(t, pct);
                        }
                    }
                }
                catch (e) { }
                return __to.apply(this, args);
            };
        }
    }
    catch (e) {
        warn("toast", e);
    }
    function lgName() {
        try {
            const n = document.getElementById("lg-name");
            if (!n)
                return;
            const narrow = (window.innerWidth || 1024) <= 520;
            let hint = document.getElementById("r9bLgHint");
            if (!narrow) {
                if (hint)
                    hint.remove();
                if (n.dataset.r9bPh && n.getAttribute("placeholder") === n.dataset.r9bPh && n.dataset.r9bLong)
                    n.setAttribute("placeholder", n.dataset.r9bLong);
                return;
            }
            const short = M("ご担当者名", "Your name", "负责人姓名", "Su nombre");
            const long = M("招待状・申し込みのときの氏名を入れてください", "Enter your name as on the invitation or application", "请输入邀请函或申请时的姓名", "Escriba su nombre como en la invitación o la solicitud");
            const cur = n.getAttribute("placeholder") || "";
            if (cur !== short) {
                n.dataset.r9bLong = cur;
                n.dataset.r9bPh = short;
                n.setAttribute("placeholder", short);
            }
            if (!hint) {
                hint = document.createElement("small");
                hint.id = "r9bLgHint";
                hint.setAttribute("data-noi18n", "1");
                hint.style.cssText = "display:block;margin:4px 0 0;font-size:12px;line-height:1.5;color:var(--ink-3,#6b7280);text-align:left";
                n.insertAdjacentElement("afterend", hint);
            }
            if (hint.textContent !== long)
                hint.textContent = long;
        }
        catch (e) { }
    }
    API.lgName = lgName;
    try {
        const watch = () => {
            const n = document.getElementById("lg-name");
            if (!n)
                return;
            lgName();
            try {
                new MutationObserver(() => { lgName(); }).observe(n, { attributes: true, attributeFilter: ["placeholder"] });
            }
            catch (e) { }
        };
        [0, 1200, 3000].forEach((ms) => setTimeout(() => { const n = document.getElementById("lg-name"); if (n && !n.dataset.r9bW) {
            n.dataset.r9bW = "1";
            watch();
        }
        else
            lgName(); }, ms));
        window.addEventListener("resize", () => lgName());
        document.addEventListener("change", (e) => { if (e.target && e.target.id === "lang")
            setTimeout(lgName, 900); }, true);
    }
    catch (e) { }
    try {
        if (typeof v85docJudge === "function") {
            const __jd = v85docJudge;
            v85docJudge = function () {
                const J = __jd.apply(this, arguments);
                try {
                    const dc = J && J.F && J.F.dest;
                    const dn = dc && typeof v85docCName === "function" ? String(v85docCName(dc) || "") : "";
                    const names = typeof V85CN !== "undefined" && V85CN ? Object.keys(V85CN).map((k) => String(V85CN[k] || "")).filter((x) => x && x !== dn) : [];
                    if (!dn || !names.length)
                        return J;
                    const other = (s) => names.some((n) => s.indexOf(n + "は") === 0 || s.indexOf(n + " ") === 0 || s.indexOf(n + "の") === 0);
                    const mine = (s) => s.indexOf(dn) === 0;
                    const cut = (c) => String(c || "").replace(/（([^（）]*(?:（[^（）]*）[^（）]*)*)）/g, (m0, inner) => {
                        const parts = inner.split("、");
                        if (parts.length < 2 || !parts.some(mine) || !parts.some(other))
                            return m0;
                        return "（" + parts.filter((p) => !other(p)).join("、") + "）";
                    });
                    const cutN = (n) => { const S = String(n || "").split("。").filter((x) => x.trim()); if (S.length < 2 || !S.some(mine) || !S.some(other))
                        return n; return S.filter((x) => !other(x)).join("。") + "。"; };
                    const cutS = (s) => { const P = String(s || "").split("／"); if (P.length < 2 || !P.some((x) => x.indexOf(dn) >= 0) || !P.some((x) => other(x.trim())))
                        return s; return P.filter((x) => !other(x.trim())).join("／"); };
                    Object.keys(J.rows || {}).forEach((k) => {
                        const r = J.rows[k];
                        (r.why || []).forEach((w) => { if (w && w.c)
                            w.c = cut(w.c); if (w && w.n)
                            w.n = cutN(w.n); });
                        (r.src || []).forEach((x) => { if (x && x.s)
                            x.s = cutS(x.s); });
                    });
                }
                catch (e) {
                    warn("judge", e);
                }
                return J;
            };
        }
    }
    catch (e) {
        warn("judge-wrap", e);
    }
    try {
        if (typeof vCty === "function") {
            const __vc = vCty;
            vCty = function () {
                let h = __vc.apply(this, arguments);
                try {
                    if (typeof h !== "string" || typeof ctyStore !== "function" || typeof ctyChosen !== "function")
                        return h;
                    const s = ctyStore() || {};
                    const top = s.top || [], rec = s.rec || [], ch = ctyChosen() || [];
                    const add = rec.filter((r) => r && ch.indexOf(r.c) >= 0 && top.indexOf(r.c) < 0);
                    const OPEN = '<div class="g2" style="align-items:start;gap:11px;margin-bottom:11px">';
                    const at = h.indexOf(OPEN);
                    if (!add.length || at < 0)
                        return h;
                    const lead = (x) => { try {
                        return typeof v54ctyLead === "function" ? v54ctyLead(x) : x;
                    }
                    catch (e) {
                        return x;
                    } };
                    const num = (x) => { try {
                        return typeof v56priceCNum === "function" ? v56priceCNum(x) : x;
                    }
                    catch (e) {
                        return x;
                    } };
                    const cards = add.map((r) => {
                        const f = r.facts || {}, sc = r.sc || {};
                        const docs = Array.isArray(f.docs) ? f.docs.map(E).join("・") : "";
                        const rows = [];
                        rows.push(`<b>📋 ${E(M("規制", "Regulation", "法规", "Normativa"))}（${E(sc.reg)}）</b>：${E(M("関税", "Duty", "关税", "Arancel"))} ${E(f.duty || "—")}／${E(M("通関", "Customs", "通关", "Aduana"))} ${E(lead(f.lead) || "—")}${docs ? "／" + E(M("必要書類", "Documents", "所需文件", "Documentos")) + " " + docs : ""}`);
                        rows.push(`<b>📈 ${E(M("市場性", "Market", "市场性", "Mercado"))}（${E(num(sc.mkt))}）</b>　<b>⚔ ${E(M("競合", "Competition", "竞争", "Competencia"))}（${E(num(sc.comp))}）</b>　<b>📍 ${E(M("STANDAGE拠点", "STANDAGE base", "STANDAGE据点", "Base STANDAGE"))}（${E(sc.base)}）</b>`);
                        const why = [r.why && `<b>${E(M("評価の要点", "Key points", "评估要点", "Puntos clave"))}</b><br>${E(r.why)}`, r.risk && `<b style="color:var(--crit)">${E(M("リスク", "Risks", "风险", "Riesgos"))}</b><br>${E(r.risk)}`, r.next && `<b style="color:var(--bl)">${E(M("最初の一歩", "First step", "第一步", "Primer paso"))}</b><br>${E(r.next)}`].filter(Boolean).join("<br>");
                        return `<div class="c" data-r9bcty="${E(r.c)}"><div class="rw" style="justify-content:space-between;gap:8px;flex-wrap:wrap"><h3>${E(r.c)} <span class="p">${E(M("推奨の3か国の外", "Not in the top 3", "不在推荐的3国内", "Fuera de los 3 recomendados"))}</span> <span class="n" style="font-size:16px;color:var(--or-deep)">${E(sc.total)}${E(M("点", " pts", "分", " pts"))}</span></h3><span class="p hi">${E(M("確定済み", "Confirmed", "已确定", "Confirmado"))}</span></div>
    <div class="g2" style="margin-top:8px;gap:8px"><div style="padding:9px 11px;border:1px solid var(--line);border-radius:var(--r2);background:var(--surface-2);font-size:11.5px;line-height:1.7">${rows.join("<br>")}</div>
    <div style="padding:9px 11px;border:1px solid var(--line);border-radius:var(--r2);font-size:11.5px;line-height:1.7">${why || E(M("この国の評価の文はまだありません（上の表の行の点数で確かめてください）", "No written assessment yet (see the scores in the table above)", "该国尚无评估说明（请看上表中的分数）", "Aún no hay evaluación escrita (vea los puntos en la tabla)"))}</div></div></div>`;
                    }).join("");
                    h = h.slice(0, at + OPEN.length) + cards + h.slice(at + OPEN.length);
                }
                catch (e) {
                    warn("vCty", e);
                }
                return h;
            };
        }
    }
    catch (e) {
        warn("vCty-wrap", e);
    }
    try {
        if (typeof v85dkCta === "function") {
            const __ct = v85dkCta;
            v85dkCta = function () {
                const L = __ct.apply(this, arguments);
                try {
                    const c = String((ten() || {}).cat || "");
                    if (Array.isArray(L) && (c === "中古車" || c === "建設機械"))
                        return L.map((o) => (o === "drawing" ? "spec" : o)).filter((o, i, a) => a.indexOf(o) === i);
                }
                catch (e) { }
                return L;
            };
        }
    }
    catch (e) {
        warn("cta", e);
    }
    dict([
        ["（選んでください）", "(choose)", "（请选择）", "(elija)"],
    ]);
})();
