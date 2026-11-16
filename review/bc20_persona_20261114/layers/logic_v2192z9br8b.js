(function () {
    const W = window;
    if (W.__v2192r8b)
        return;
    W.__v2192r8b = 1;
    const API = (W.v92r8b = W.v92r8b || {});
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
        console.warn("[21.94 r8b] " + k, e);
    }
    catch (x) { } };
    const hide = (o, k, v) => { try {
        Object.defineProperty(o, k, { value: v, enumerable: false, configurable: true, writable: true });
    }
    catch (e) {
        o[k] = v;
    } };
    const ten = () => { try {
        return (typeof TEN !== "undefined" && TEN) || null;
    }
    catch (e) {
        return null;
    } };
    const ses = () => { try {
        return (typeof SES !== "undefined" && SES) || null;
    }
    catch (e) {
        return null;
    } };
    const lsJ = (k) => { try {
        return JSON.parse(localStorage.getItem(k) || "{}") || {};
    }
    catch (e) {
        return {};
    } };
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
    const own93 = (nm) => {
        try {
            if (typeof v92regBattNm === "function" && nm === v92regBattNm())
                return true;
            if (typeof v92regFcNames === "function" && v92regFcNames().has(nm))
                return true;
            if (/^溶出試験の成績書/.test(nm))
                return true;
            if (typeof V92REG_FCC !== "undefined" && (nm === V92REG_FCC || nm === V92REG_NCC))
                return true;
        }
        catch (e) { }
        return false;
    };
    try {
        if (typeof v92regAdj === "function") {
            const __adj = v92regAdj;
            v92regAdj = function (c, r) {
                let prev = null;
                try {
                    if (r && typeof r === "object" && Array.isArray(r.docs))
                        prev = r.docs.slice();
                }
                catch (e) { }
                const out = __adj.apply(this, arguments);
                try {
                    if (!r || typeof r !== "object" || !Array.isArray(r.docs))
                        return out;
                    const last = r.__r8bOut;
                    const add = Array.isArray(r.__r8bAdd) ? r.__r8bAdd : [];
                    const del = Array.isArray(r.__r8bDel) ? r.__r8bDel : [];
                    if (Array.isArray(last) && prev) {
                        const pv = prev;
                        pv.forEach((d, i) => { if (last.indexOf(d) < 0 && !own93(String(d)) && !add.some((a) => a.nm === d))
                            add.push({ nm: d, after: i > 0 ? pv[i - 1] : "" }); });
                        last.forEach((d) => { if (pv.indexOf(d) < 0 && !own93(String(d)) && del.indexOf(d) < 0)
                            del.push(d); });
                    }
                    hide(r, "__r8bOut", r.docs.slice());
                    hide(r, "__r8bAdd", add);
                    hide(r, "__r8bDel", del);
                    if (add.length || del.length) {
                        const docs = r.docs.filter((d) => del.indexOf(d) < 0);
                        add.forEach((a) => { if (docs.indexOf(a.nm) >= 0)
                            return; const i = a.after ? docs.indexOf(a.after) : -1; if (i >= 0)
                            docs.splice(i + 1, 0, a.nm);
                        else
                            docs.push(a.nm); });
                        r.docs = docs;
                    }
                }
                catch (e) {
                    warn("regAdj", e);
                }
                return out;
            };
        }
    }
    catch (e) {
        warn("regAdj-wrap", e);
    }
    const RE_LIB = /リチウム(?:イオン|ポリマー|金属)?\s*(?:二次)?\s*(?:電池|バッテリー)|lithium[\s-]*(?:ion|polymer|metal)?[\s-]*batter|li-?ion/i;
    const RE_NOTBATT = /リチウム\s*(?:石けん|石鹸|せっけん|セッケン|グリース|基|複合)[^\s、。|｜]*|lithium[\s-]*(?:soap|grease|complex|based?)[a-z]*/gi;
    const isVehicle = (p) => { try {
        const hs = String((p && p.hs) || "").replace(/\D/g, "");
        return /^87/.test(hs) || /中古車|自動車|乗用車/.test(String((p && p.cat) || "")) || String((p && p.catKey) || "") === "car";
    }
    catch (e) {
        return false;
    } };
    const pText = (p) => { try {
        const rows = (x) => (Array.isArray(x) ? x : []).map((y) => (Array.isArray(y) ? y.join(" ") : String(y || ""))).join(" ");
        return [p.item, p.itemEn, rows(p.compRows), rows(p.dimRows), rows(p.strengths), JSON.stringify(p.v68attrs || {})].join(" ");
    }
    catch (e) {
        return "";
    } };
    try {
        if (typeof v92regBatt === "function") {
            const __bt = v92regBatt;
            v92regBatt = function (p) {
                const r = __bt.apply(this, arguments);
                try {
                    if (r && r.v === "yes" && !r.ans && p && isVehicle(p) && !/^850[67]/.test(String(p.hs || "").replace(/\D/g, "")) && !RE_LIB.test(pText(p).replace(RE_NOTBATT, " "))) {
                        return {
                            v: "unk", why: M("車両の電池の種類（ニッケル水素・リチウムイオン・鉛）と容量は、車種・年式で違います。車検証・メーカーの資料で確かめてください（登録には電池の種類がありません）", "The type (NiMH, lithium-ion or lead-acid) and capacity of a vehicle's batteries depend on the model and year. Check the vehicle documents or the maker's data (the registration does not state the battery type)")
                        };
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("batt", e);
    }
    const code = () => String((ses() && ses().code) || "");
    const regId = (t) => String((t && (t.uid || t.item)) || "");
    const isSmp = (t) => !!t && (t.src === "sample" || t.src === "sample2" || !!t.v91smp || t.kind === "demo" || t.kind === "s2");
    function regOk(t) {
        try {
            if (!t)
                return false;
            const rk = t.regKB || {};
            if (Object.keys(rk).some((c) => rk[c] && (rk[c].appliedTxt || rk[c].txt)))
                return true;
            const id = regId(t);
            if (!id || !code())
                return false;
            const core = +(lsJ("bc20_v92core_reg_" + code())[id] || 0);
            if (!core)
                return false;
            if (lsJ("bc20_v92r5c_reg_" + code())[id])
                return true;
            const t0 = +(localStorage.getItem("bc20_v92r5c_t0") || 0);
            return !!(t0 && core < t0);
        }
        catch (e) {
            return false;
        }
    }
    function setupReg() {
        try {
            const S = typeof ux32Setup === "function" ? ux32Setup() : null;
            if (!Array.isArray(S))
                return null;
            const r = S.find((x) => Array.isArray(x) && x[0] === "reg");
            return r ? !!r[4] : null;
        }
        catch (e) {
            return null;
        }
    }
    API.regOk = (t) => { const x = t || ten(); if (x && x === ten() && !isSmp(x)) {
        const s = setupReg();
        if (s !== null)
            return s;
    } return regOk(x); };
    const ownList = () => { try {
        return (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS.filter((t) => t && !isSmp(t)) : [];
    }
    catch (e) {
        return [];
    } };
    try {
        if (typeof v88Sig === "function") {
            const __sg = v88Sig;
            v88Sig = function () {
                const s = __sg.apply(this, arguments);
                try {
                    if (s && typeof s === "object") {
                        const t = ten();
                        if (t && !isSmp(t)) {
                            const r = setupReg();
                            if (r !== null)
                                s.reg = r ? 1 : 0;
                        }
                        else if (t && isSmp(t)) {
                            const own = ownList();
                            if (own.length && ses() && ses().t === "trial")
                                s.reg = own.some(regOk) ? 1 : 0;
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
            const __ph = v88Phases;
            v88Phases = function () {
                const ph = __ph.apply(this, arguments);
                try {
                    (ph || []).forEach((p) => ((p && p.acts) || []).forEach((a) => {
                        if (!a || !/^規制・認証と関税を確かめる|^Check rules/.test(String(a.t || "")))
                            return;
                        a.go = "ops:reg";
                        if (!a.done && !a.why)
                            a.why = M("まだ：「規制を調べる」の画面で、送り先の国を選ぶ・表のボタンを押すなど、調べる枠の中を操作すると ✓ になります（はじめの設定の「規制を調べる」と同じ）", "Not yet: on “Check regulations”, operate the research box (choose the destination, press a button in the table) to tick this (same as the setup step)", "尚未完成：在“查法规”页面的调查框内操作（选择目的国、点击表中的按钮等）后即打勾（与初始设置相同）", "Pendiente: en «Revisar regulaciones», opere el cuadro (elija el destino o pulse un botón de la tabla) para marcarlo (igual que en la configuración)");
                    }));
                }
                catch (e) {
                    warn("phases", e);
                }
                return ph;
            };
        }
    }
    catch (e) {
        warn("goal", e);
    }
    document.addEventListener("click", (e) => {
        try {
            const b = e.target && e.target.closest && e.target.closest('[data-act="rm.go"][data-arg="ops:reg"]');
            if (!b)
                return;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const R = W.RDX;
            if (R && typeof R.goKey === "function") {
                R.goKey("ops:reg");
                return;
            }
            try {
                if (typeof opsTab !== "undefined")
                    opsTab = "reg";
            }
            catch (x) { }
            try {
                if (typeof go === "function")
                    go("ops");
            }
            catch (x) { }
        }
        catch (x) { }
    }, true);
    try {
        const A6 = W.v92r6a;
        if (A6 && typeof A6.now === "function" && !A6.__r8b) {
            A6.__r8b = 1;
            const now0 = A6.now;
            A6.now = function () {
                const N = now0.apply(this, arguments);
                try {
                    if (N && N.next && N.next.id === "fb" && !N.r7b) {
                        const P = W.v92r7b && typeof W.v92r7b.pending === "function" ? W.v92r7b.pending() : null;
                        if (P && P.n > 0) {
                            return Object.assign({}, N, {
                                idx: 4.5, key: "inbox", r7b: "inbox", pend: P.n, pendKey: P.key, rest: 1,
                                label: M(`受信箱で承認して送る（残り ${P.n}件）`, `Approve & send in the inbox (${P.n} left)`, `在收件箱确认后发送（剩余 ${P.n} 件）`, `Aprobar y enviar en la bandeja (quedan ${P.n})`)
                            });
                        }
                    }
                }
                catch (e) { }
                return N;
            };
        }
    }
    catch (e) {
        warn("now", e);
    }
    const refKeys = () => {
        const o = {};
        try {
            if (typeof V68P_G !== "undefined" && V68P_G && typeof NEED !== "undefined" && Array.isArray(NEED))
                Object.keys(V68P_G).forEach((g) => (V68P_G[g].f || []).forEach((f) => { if (f && f.ref && NEED.some((n) => n && n.k === f.ref))
                    o["v68:" + f.k] = 1; }));
        }
        catch (e) { }
        return o;
    };
    const withDemo = (t) => {
        try {
            if (t && t === ten() && typeof v79pDemoKey === "function" && typeof v79pDemoView === "function") {
                const k = v79pDemoKey();
                const V = k ? v79pDemoView(k) : null;
                if (V && V.v68attrs && Object.keys(V.v68attrs).length)
                    return Object.assign({}, t, { v68attrs: Object.assign({}, V.v68attrs, t.v68attrs || {}) });
            }
        }
        catch (e) { }
        return t;
    };
    try {
        if (typeof v92prodOpt === "function") {
            const __po = v92prodOpt;
            v92prodOpt = function (t) {
                const L = __po.call(this, withDemo(t));
                try {
                    if (!Array.isArray(L))
                        return L;
                    const R = refKeys(), seen = {};
                    return L.filter((x) => { if (!x || R[x.k])
                        return false; const n = String(x.n || x.k); if (seen[n])
                        return false; seen[n] = 1; return true; });
                }
                catch (e) {
                    return L;
                }
            };
        }
        if (typeof v90ctyOptMiss === "function" && typeof v92prodOpt === "function") {
            const __om = v90ctyOptMiss;
            v90ctyOptMiss = function (t) {
                try {
                    if (t === undefined)
                        t = ten();
                    if (!t)
                        return [];
                    const L = v92prodOpt(t);
                    if (Array.isArray(L))
                        return L.filter((x) => x && !x.ok).map((x) => ({ k: x.k, n: x.n, go: x.go }));
                }
                catch (e) { }
                return __om.apply(this, arguments);
            };
        }
        if (typeof W.v92itemPct === "function" && typeof v92prodFill === "function") {
            const __ip = W.v92itemPct;
            W.v92itemPct = function (t) {
                const r = __ip.apply(this, arguments);
                try {
                    if (r != null) {
                        const K = v92prodFill(t || ten());
                        if (K && typeof K.pct === "number")
                            return K.pct;
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("opt", e);
    }
    try {
        if (typeof fillSay === "function") {
            const __fs = fillSay;
            fillSay = function (who, html) {
                try {
                    if (typeof html === "string" && /ここまでで登録できたのは<b>\d+項目・/.test(html) && typeof v92prodFill === "function") {
                        const t = ten();
                        const K = t ? v92prodFill(t) : null;
                        if (K) {
                            html = html.replace(/ここまでで登録できたのは<b>\d+項目・/, `ここまでで登録できたのは<b>${K.c}項目・`);
                            if (K.hsGuess) {
                                const hs = String(t.hs || "");
                                const add = `<br><span data-noi18n>${E(M(`HSコード（${hs}）は推定のままです。必須の項目なので、確かめるまで「入っている数」に入れていません。商品情報の画面の「HSコード」で確かめて決めてください（わからないときは、税関の事前教示で確かめられます）。`, `The HS code (${hs}) is still an estimate. It is a required item, so it is not counted until you confirm it under “HS code” on the product information screen (Japan Customs' advance ruling can confirm it).`, `HS编码（${hs}）仍为推定。由于是必填项，确认前不计入。请在商品信息页面的“HS编码”中确认（不确定时可通过海关预先裁定确认）。`, `El código HS (${hs}) sigue siendo una estimación. Es obligatorio y no se cuenta hasta confirmarlo en «Código HS» en la ficha del producto (la consulta previa de aduanas puede confirmarlo).`))}</span>`;
                                const h2 = html.replace(/(です。)(<br>)/, `$1${add}$2`);
                                html = h2 !== html ? h2 : html + add;
                            }
                        }
                    }
                }
                catch (e) {
                    warn("fillSay", e);
                }
                return __fs.apply(this, [who, html].concat([].slice.call(arguments, 2)));
            };
        }
    }
    catch (e) {
        warn("fs-wrap", e);
    }
    const ORIGIN = /^(EXW|FCA|FAS|FOB)$/;
    const SEA_ONLY = /^(FAS|FOB|CFR|CIF)$/;
    const AIR_ALT = { FAS: "FCA", FOB: "FCA", CFR: "CPT", CIF: "CIP" };
    const modeOf = (S) => {
        try {
            if (typeof v85docCase === "function") {
                const m = String(((v85docCase() || {}).inp || {}).mode || "");
                if (m)
                    return m;
            }
        }
        catch (e) { }
        try {
            const f = W.v85docModeOf;
            if (typeof f === "function") {
                const m2 = String(f(S) || "");
                if (m2)
                    return m2;
            }
        }
        catch (e) { }
        const x = String((S && S.mode) || "").toUpperCase();
        return x === "AIR" ? "air" : x === "COURIER" ? "courier" : x === "POST" ? "post" : "sea";
    };
    const isAirMode = (S) => /^(air|courier|post)$/.test(modeOf(S));
    const modeJa = (S) => { const m = modeOf(S); return m === "courier" ? M("クーリエ", "courier", "快递", "mensajería") : m === "post" ? M("郵便", "post", "邮政", "correo") : M("航空", "air", "空运", "aéreo"); };
    const recPort = (S) => {
        try {
            if (!S || !S.v61fb || typeof v61dlRecById !== "function" || typeof v61dlRecTerm !== "function")
                return "";
            const t = v61dlRecTerm(v61dlRecById(S.v61fb.id));
            return t && t.place ? String(t.place) : "";
        }
        catch (e) {
            return "";
        }
    };
    function airWarn(c, S) {
        const alt = AIR_ALT[c] || "FCA";
        const mj = S ? modeJa(S) : "航空";
        return M(`輸送は${mj}にしています。<span class="v92doc-warn">要確認：${c} は海上・内陸水路の輸送の条件です（インコタームズ 2020）。航空なら ${alt} などが一般的です。相手と条件を確かめ、「受注内容を編集」で取引条件を直してください。</span>`, `Transport is set to air. <span class="v92doc-warn">Please check: ${c} is a rule for sea and inland waterway transport (Incoterms 2020). For air, ${alt} is generally used. Agree the rule with the buyer and change it in “Edit order details”.</span>`, `运输方式为空运。<span class="v92doc-warn">请确认：${c} 是海运及内河运输的条件（2020 年国际贸易术语）。空运一般使用 ${alt}。请与对方确认，并在“编辑订单内容”中修改贸易条件。</span>`, `El transporte es aéreo. <span class="v92doc-warn">Revise: ${c} es una regla para transporte marítimo y fluvial (Incoterms 2020). Para aéreo se usa normalmente ${alt}. Acuérdelo con el comprador y cámbielo en «Editar pedido».</span>`);
    }
    try {
        if (typeof v92docPolNote === "function") {
            const __pn = v92docPolNote;
            v92docPolNote = function (S) {
                const h0 = __pn.apply(this, arguments);
                try {
                    if (!S || !S.v92pol)
                        return h0;
                    const cd = typeof v92docCode === "function" ? v92docCode(S.term) : "";
                    if (cd && !ORIGIN.test(cd))
                        return "";
                    if (!S.pol)
                        return h0;
                    const P = S.v92pol || {};
                    if (P.from === "edit" && P.edit)
                        return h0;
                    const place = cd ? v92docPlace(S.term, cd) : "";
                    const shown = place ? v92docPort(place) : String(S.pol || "");
                    const key = (x) => (x ? v92docPortKey(x) : "");
                    const k = key(shown);
                    if (!k)
                        return h0;
                    const nm = `<b data-noi18n>${E(shown)}</b>`;
                    let h = "";
                    if (P.tp && key(P.tp) === k && P.from === "term")
                        h = `仕出港（積出港）は、商品情報の取引条件「<b data-noi18n>${E(String((ten() || {}).term || ""))}</b>」の港 ${nm} です。`;
                    else if (P.reg && key(P.reg) === k)
                        h = `仕出港（積出港）は、商品情報に登録の ${nm} から入れています。`;
                    else {
                        const rp = recPort(S);
                        if (rp && key(rp) === k)
                            h = `仕出港（積出港）は、商談の記録の取引条件「<b data-noi18n>${E(cd + " " + rp)}</b>」から入れています。`;
                        else if (P.tp && key(P.tp) === k)
                            h = `仕出港（積出港）は、商品情報の取引条件「<b data-noi18n>${E(String((ten() || {}).term || ""))}</b>」の港 ${nm} です。`;
                        else if (P.pp && key(P.pp) === k)
                            h = `仕出港（積出港）は、価格表の建値の港 ${nm} から入れています。`;
                        else
                            h = `仕出港（積出港）は、この案件の取引条件「<b data-noi18n>${E(String(S.term || ""))}</b>」の港 ${nm} です。`;
                    }
                    if (P.reg && key(P.reg) !== k)
                        h += ` <span class="v92doc-warn">要確認：商品情報の仕出港は <span data-noi18n>${E(P.reg)}</span> です。どちらから出すか確かめてください。</span>`;
                    else if (P.clash)
                        h += ` <span class="v92doc-warn">要確認：取引条件の港と商品情報の仕出港（<span data-noi18n>${E(P.reg || P.raw || "")}</span>）が違います。どちらかにそろえてください。</span>`;
                    return h;
                }
                catch (e) {
                    warn("polNote", e);
                }
                return h0;
            };
        }
        if (typeof v92docAirNote === "function") {
            const __an = v92docAirNote;
            v92docAirNote = function (S, cd) {
                const h0 = __an.apply(this, arguments);
                try {
                    if (h0 || !S || !isAirMode(S))
                        return h0;
                    const c = cd || (typeof v92docCode === "function" ? v92docCode(S.term) : "");
                    if (SEA_ONLY.test(c || ""))
                        return airWarn(c, S);
                }
                catch (e) { }
                return h0;
            };
        }
    }
    catch (e) {
        warn("docNote", e);
    }
    const curShip = () => {
        try {
            const s = (typeof D !== "undefined" && D && D.ship) || null;
            if (s)
                return s;
        }
        catch (e) { }
        try {
            const c = (typeof SHIPS !== "undefined" && SHIPS && typeof SHIPA !== "undefined" && SHIPS[SHIPA]) || null;
            return (c && c.ship) || null;
        }
        catch (e) {
            return null;
        }
    };
    try {
        if (typeof v92docFillCase === "function") {
            const __fc = v92docFillCase;
            v92docFillCase = function (S) {
                const r = __fc.apply(this, arguments);
                try {
                    const t = ten();
                    if (S && t && !S.poNo && S.docRows && Array.isArray(S.docRows.ex) && typeof v92docValid === "function") {
                        const row = S.docRows.ex.find((x) => x && x[0] === "Validity");
                        const auto = !row || /^30 days|^Until \d{4}-|^\[To be confirmed\] \(price list/.test(String(row[1] || "").trim());
                        if (auto) {
                            const V = v92docValid(S, t);
                            S.v92valid = V;
                            if (row)
                                row[1] = V.en;
                            else
                                S.docRows.ex.push(["Validity", V.en]);
                        }
                    }
                }
                catch (e) {
                    warn("valid", e);
                }
                return r;
            };
        }
    }
    catch (e) {
        warn("fill-wrap", e);
    }
    function airLabels() {
        try {
            const S = curShip();
            if (!S || !isAirMode(S))
                return;
            const o = document.getElementById("dO");
            const doc = o && o.querySelector(".doc");
            if (!doc)
                return;
            doc.querySelectorAll("span, b, td, th, div, p").forEach((x) => {
                if (x.children && x.children.length)
                    return;
                const s = String(x.textContent || "").trim();
                if (s === "B/L No.")
                    x.textContent = "AWB No.";
                else if (s === "Vessel" || s === "Vessel / Voyage")
                    x.textContent = "Flight";
                else if (s === "B/L type (Original / Surrendered / Sea Waybill)" || s === "B/L type")
                    x.textContent = "Transport document";
            });
        }
        catch (e) {
            warn("airLbl", e);
        }
    }
    API.airLabels = airLabels;
    try {
        if (typeof rDoc === "function") {
            const __rd = rDoc;
            rDoc = function () {
                const r = __rd.apply(this, arguments);
                try {
                    airLabels();
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("rdoc", e);
    }
    try {
        if (typeof v85docSpec === "function") {
            const __sp = v85docSpec;
            v85docSpec = function (K, F) {
                const o = __sp.apply(this, arguments);
                try {
                    if (o && F && /^(air|courier|post)$/.test(String(F.mode || ""))) {
                        const fix = (rows) => (rows || []).forEach((r) => {
                            if (!Array.isArray(r))
                                return;
                            if (r[1] === "bl" && /^B\/L type/.test(String(r[0]))) {
                                r[0] = "Transport document";
                                r[2] = F.mode === "air" ? "Air Waybill (AWB)" : F.mode === "courier" ? "Courier waybill" : "Postal receipt";
                            }
                            else if (r[1] === "pol" && /^Port of loading/.test(String(r[0])) && F.mode === "air") {
                                r[0] = "Airport of departure";
                                if (!/空港|airport/i.test(String(r[2] || "")))
                                    r[2] = typeof v85docQ === "function" ? v85docQ() : "[To be confirmed]";
                            }
                            else if (r[1] === "pod" && /^Port of discharge/.test(String(r[0])) && F.mode === "air")
                                r[0] = "Airport of destination";
                        });
                        if (Array.isArray(o.rows))
                            fix(o.rows);
                    }
                }
                catch (e) {
                    warn("spec", e);
                }
                return o;
            };
        }
    }
    catch (e) {
        warn("spec-wrap", e);
    }
    try {
        if (typeof v33CkQuote === "function") {
            const __ck = v33CkQuote;
            v33CkQuote = function () {
                let F = __ck.apply(this, arguments);
                try {
                    if (!Array.isArray(F))
                        return F;
                    const k = String(W.__poDocK || "pi");
                    const S = curShip();
                    const o = document.getElementById("dO");
                    const txt = o ? String(o.textContent || "") : "";
                    if (k !== "pi")
                        F = F.filter((x) => !(x && /^見積の有効期限/.test(String(x.t || ""))));
                    const unit = /Unpacked unit cargo/i.test(txt) || !!(S && S.docRows && Array.isArray(S.docRows.plEx) && S.docRows.plEx.some((r) => Array.isArray(r) && /Unpacked unit cargo/i.test(String(r[1] || ""))));
                    if (unit)
                        F = F.filter((x) => !(x && /Carton size/.test(String(x.t || ""))));
                    if (S && !S.poNo && isAirMode(S)) {
                        const c = typeof v92docCode === "function" ? v92docCode(S.term) : "";
                        if (SEA_ONLY.test(c || "")) {
                            const alt = AIR_ALT[c] || "FCA";
                            const T = M(`輸送は${modeJa(S)}なのに、取引条件が ${c}（海上の条件）です`, `Transport is air but the trade term is ${c} (a sea term)`, `运输方式为空运，但贸易条件为 ${c}（海运条件）`, `El transporte es aéreo pero el término es ${c} (marítimo)`);
                            if (!F.some((x) => x && (x.t === T || /^取引条件 \S+ と航空/.test(String(x.t || "")))))
                                F.push({
                                    lv: "yel", t: T, how: M(`航空なら ${alt} などが一般的です（${c} は海上・内陸水路の輸送の条件）。相手と条件を確かめ、「受注内容を編集」で取引条件を直してください。海上で送るなら、判断の表の「輸送」を海上に戻してください。`, `For air, ${alt} is generally used (${c} is for sea and inland waterway). Agree with the buyer and change the term in “Edit order details”, or set transport back to sea.`, `空运一般使用 ${alt}（${c} 为海运及内河运输条件）。请与对方确认，并在“编辑订单内容”中修改贸易条件；若走海运，请把“运输”改回海运。`, `Para aéreo se usa normalmente ${alt} (${c} es marítimo). Acuérdelo con el comprador y cámbielo en «Editar pedido», o vuelva a transporte marítimo.`)
                                });
                        }
                    }
                    const ord = { red: 0, yel: 1, blu: 2 };
                    F.sort((a, b) => (a && ord[a.lv] != null ? ord[a.lv] : 3) - (b && ord[b.lv] != null ? ord[b.lv] : 3));
                }
                catch (e) {
                    warn("ck", e);
                }
                return F;
            };
        }
    }
    catch (e) {
        warn("ck-wrap", e);
    }
    try {
        if (typeof v54rDocsHtml === "function") {
            const __dh = v54rDocsHtml;
            v54rDocsHtml = function () {
                let h = __dh.apply(this, arguments);
                try {
                    if (typeof h === "string" && h.indexOf("放射性物質検査証明書") >= 0 && h.indexOf("v92r8b-rad") < 0) {
                        const tag = `<small class="v92r8b-rad" data-noi18n>${E(M("（産地によって要る・該当するか確認）", "(depends on the place of origin; please confirm)", "（视产地而定，请确认）", "(según el origen; confirme)"))}</small>`;
                        h = h.replace(/(放射性物質検査証明書[^<]*)(<\/[a-z]+>)/, "$1$2" + tag);
                    }
                }
                catch (e) { }
                return h;
            };
        }
    }
    catch (e) {
        warn("rad", e);
    }
    const strip = (h) => String(h || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim();
    try {
        if (typeof ansReg === "function") {
            const __ar = ansReg;
            ansReg = function (q) {
                const res = __ar.apply(this, arguments);
                try {
                    if (!res || typeof res.a !== "string")
                        return res;
                    const c = typeof pickCountry === "function" ? pickCountry(q) : "";
                    if (!c || typeof v54rStatus !== "function")
                        return res;
                    const st = v54rStatus(c);
                    const cond = ((st && st.cond) || []).filter((x) => x && x.v !== "y").map((x) => String(x.nm));
                    if (!cond.length)
                        return res;
                    const H0 = "<b>必要な書類・認証</b><br>";
                    const i = res.a.indexOf(H0);
                    if (i < 0)
                        return res;
                    const j0 = res.a.indexOf("<br><br>", i + H0.length);
                    const j = j0 < 0 ? res.a.length : j0;
                    const lines = res.a.slice(i + H0.length, j).split("<br>");
                    const keep = lines.filter((ln) => { const t = strip(ln).replace(/^・/, ""); return cond.indexOf(t) < 0; });
                    if (keep.length !== lines.length)
                        res.a = res.a.slice(0, i + H0.length) + keep.join("<br>") + res.a.slice(j);
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
        if (typeof ansDocs === "function") {
            const __ad = ansDocs;
            ansDocs = function () {
                const res = __ad.apply(this, arguments);
                try {
                    const S = (typeof D !== "undefined" && D && D.ship) || null;
                    const smp = S && (/^（想定）/.test(String(S.buyer || "")) || (Array.isArray(S.quotes) && S.quotes.some((q) => q && String(q[4] || "") === "（想定）")));
                    if (res && smp && typeof res.c === "string" && S.no)
                        res.c = res.c.replace("受注 " + S.no, M(`想定の案件 ${S.no}（まだ受注ではありません）`, `assumed case ${S.no} (not an order yet)`, `假设案件 ${S.no}（尚非订单）`, `caso supuesto ${S.no} (aún no es pedido)`));
                }
                catch (e) { }
                return res;
            };
        }
    }
    catch (e) {
        warn("ansDocs-wrap", e);
    }
    const setupStep = (id) => { try {
        const S = typeof ux32Setup === "function" ? ux32Setup() : null;
        if (!Array.isArray(S))
            return null;
        const r = S.find((x) => Array.isArray(x) && x[0] === id);
        return r ? !!r[4] : null;
    }
    catch (e) {
        return null;
    } };
    try {
        if (typeof v71obReadyHtml === "function") {
            const __rh = v71obReadyHtml;
            v71obReadyHtml = function (run) {
                let h = __rh.apply(this, arguments);
                try {
                    const R = (run && run.ready) || null;
                    if (typeof h === "string" && R && !R.deck && setupStep("deck") === true) {
                        const nm = typeof v71obN === "function" ? v71obN("外国語営業資料") : "外国語営業資料";
                        const tag = `<small class="v92r8b-dk" data-noi18n>${E(M("（下書きだけ。納品版を作ると ✓・点数に入ります）", "(draft only; a finished deck counts)", "（仅草稿；制作正式版后计入）", "(solo borrador; cuenta al terminarlo)"))}</small>`;
                        h = h.replace("・ " + nm + "</span>", "・ " + nm + tag + "</span>");
                    }
                }
                catch (e) { }
                return h;
            };
        }
    }
    catch (e) {
        warn("ready", e);
    }
    try {
        if (typeof rReg === "function") {
            const __rr = rReg;
            rReg = function () {
                const out = __rr.apply(this, arguments);
                try {
                    const o = document.getElementById("rO");
                    if (o) {
                        const box = Array.from(o.querySelectorAll("div")).find((d) => d.children.length <= 2 && /^気をつけること/.test(String(d.textContent || "").trim()) && /動物性の食品は、相手国が日本からの輸入を認めている品目か/.test(String(d.textContent || "")));
                        if (box) {
                            const dup = Array.from(o.querySelectorAll("*")).some((x) => x !== box && !box.contains(x) && !x.contains(box) && x.children.length === 0 && /動物性|animal origin/i.test(String(x.textContent || "")));
                            if (dup)
                                box.remove();
                        }
                    }
                }
                catch (e) { }
                return out;
            };
        }
    }
    catch (e) {
        warn("rReg-wrap", e);
    }
    function lgName() {
        try {
            const n = document.getElementById("lg-name");
            if (!n)
                return;
            const ph = M("ご担当者名（招待状・申し込みのときの氏名）", "Your name (as on the invitation or application)", "负责人姓名（邀请函或申请时的姓名）", "Su nombre (como en la invitación o la solicitud)");
            if (n.getAttribute("placeholder") !== ph)
                n.setAttribute("placeholder", ph);
        }
        catch (e) { }
    }
    [0, 900, 2600].forEach((ms) => setTimeout(lgName, ms));
    try {
        document.addEventListener("change", (e) => { if (e.target && e.target.id === "lang")
            setTimeout(lgName, 700); }, true);
    }
    catch (e) { }
    function aiqEx() {
        try {
            const ta = document.getElementById("aiq");
            if (!ta || !ta.placeholder)
                return;
            const d = (typeof D !== "undefined" && D) || {};
            const m = String(d.moq || "").match(/^\s*(\d[\d,]*)\s*(台|両|units?)/);
            if (!m || +m[1].replace(/,/g, "") > 20)
                return;
            const t = ten() || {};
            const pick = (a) => (Array.isArray(a) && a.length ? String((a[0] && (a[0].name || a[0])) || "") : "");
            const tg = (pick(t.ctySel && t.ctySel.chosen) || pick(d.targets) || pick(t.targets) || pick(Object.keys(d.regs || {}))).trim();
            const ph = ta.placeholder.replace(/(例：)?香港に500(台|両)送るといくら/, (_a, ex) => (ex || "") + (tg || "香港") + "に" + m[1] + m[2] + "送るといくら");
            if (ph !== ta.placeholder)
                ta.placeholder = ph;
        }
        catch (e) { }
    }
    try {
        if (typeof render === "function") {
            const __rn = render;
            render = function () { const r = __rn.apply(this, arguments); try {
                aiqEx();
            }
            catch (e) { } return r; };
        }
    }
    catch (e) {
        warn("render", e);
    }
    dict([
        ["ご担当者名（招待状・申し込みのときの氏名）", "Your name (as on the invitation or application)", "负责人姓名（邀请函或申请时的姓名）", "Su nombre (como en la invitación o la solicitud)"],
    ]);
})();
