(function () {
    const W = window;
    if (W.__v2192r5a)
        return;
    W.__v2192r5a = 1;
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const lang = () => { try {
        const s = document.getElementById("lang");
        const v = (s && s.value) || "ja";
        return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
    }
    catch (e) {
        return "ja";
    } };
    const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const warn = (k, e) => { try {
        console.warn("[v92r5a] " + k, e);
    }
    catch (x) { } };
    const ten = () => { try {
        return (typeof TEN !== "undefined" && TEN) ? TEN : null;
    }
    catch (e) {
        return null;
    } };
    const tens = () => { try {
        const L = (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS.slice() : [];
        const t = ten();
        if (t && L.indexOf(t) < 0)
            L.unshift(t);
        return L;
    }
    catch (e) {
        const t = ten();
        return t ? [t] : [];
    } };
    const dd = () => { try {
        return (typeof D !== "undefined" && D) ? D : null;
    }
    catch (e) {
        return null;
    } };
    const ship = () => { const d = dd(); return (d && d.ship) || null; };
    const curCase = () => { try {
        return (typeof SHIPS !== "undefined" && SHIPS && SHIPS[SHIPA]) || null;
    }
    catch (e) {
        return null;
    } };
    const isPo = (S) => { try {
        const c = curCase();
        return !!(S && (S.poNo || (c && c.po && c.ship === S)));
    }
    catch (e) {
        return !!(S && S.poNo);
    } };
    const isSmp = (S) => { try {
        return typeof v54docIsSmp === "function" ? !!v54docIsSmp(S) : !!(S && /^（想定）/.test(String(S.buyer || "")));
    }
    catch (e) {
        return false;
    } };
    const isCty = (s) => { try {
        return typeof v56docIsCty === "function" && !!v56docIsCty(s);
    }
    catch (e) {
        return false;
    } };
    const save = () => { try {
        if (typeof saveTen === "function")
            saveTen();
    }
    catch (e) { } };
    const say = (m) => { try {
        if (typeof toast === "function")
            toast(m);
    }
    catch (e) { } };
    const API = W.v92r5a = W.v92r5a || {};
    const dict = (rows) => { try {
        if (typeof I18N === "undefined" || !I18N || !I18N.dict)
            return;
        rows.forEach((r) => { ["en", "zh", "es"].forEach((l, i) => { const v = r[i + 1] || r[1]; if (v && I18N.dict[l] && I18N.dict[l][r[0]] == null)
            I18N.dict[l][r[0]] = v; }); });
    }
    catch (e) { } };
    const INC_RE = /\b(EXW|FCA|FAS|FOB|CFR|CNF|CIF|CPT|CIP|DAP|DPU|DDP)\b/i;
    function termInfo(S) {
        const raw = String((S && S.term) || "").replace(/[（(]?\s*Incoterms[^)）]*[)）]?/i, " ");
        const m = raw.match(INC_RE);
        const code = m ? m[1].toUpperCase() : "";
        let place = code ? raw.replace(INC_RE, " ").replace(/\s+/g, " ").replace(/^[\s,、・:：\/／]+|[\s,、・:：\/／]+$/g, "").trim() : "";
        if (/入れてください|未定|要確認|^（.*）$/.test(place) || /^[\d,.\s$¥￥]+$/.test(place))
            place = "";
        const cty = !!place && (place === String((S && S.country) || "") || isCty(place));
        return { code, place, cty };
    }
    function hasPod(S) {
        const v = String((S && S.pod) || "").trim();
        return !!v && v !== String(S.country || "") && !/^（.*未|^—|未登録|未設定|未読取/.test(v) && !isCty(v);
    }
    function podState(S) {
        if (!S)
            return "ok";
        if (hasPod(S))
            return "ok";
        const t = termInfo(S);
        if (/^(EXW|FCA|FAS|FOB)$/.test(t.code))
            return "na";
        if (t.code && t.place && !t.cty)
            return "term";
        return "missing";
    }
    function podSync(S) {
        try {
            if (!S || isPo(S) || hasPod(S))
                return false;
            const t = termInfo(S);
            if (/^(CFR|CNF|CIF)$/.test(t.code) && t.place && !t.cty) {
                S.pod = t.place;
                S.v92podTerm = 1;
                return true;
            }
        }
        catch (e) { }
        return false;
    }
    API.podState = podState;
    function openEdit(focusId) {
        try {
            if (typeof openStepEdit !== "function")
                return;
            try {
                if (typeof closeDW === "function")
                    closeDW();
            }
            catch (e) { }
            setTimeout(() => {
                try {
                    openStepEdit((typeof shipStep !== "undefined" && shipStep) || 0);
                    setTimeout(() => { const e = document.getElementById(focusId); if (e) {
                        try {
                            e.scrollIntoView({ block: "center" });
                        }
                        catch (x) { }
                        e.focus();
                    } }, 120);
                }
                catch (e) {
                    warn("openEdit", e);
                }
            }, 60);
        }
        catch (e) {
            warn("openEdit", e);
        }
    }
    API.openEdit = openEdit;
    const PORT_T = "仕向港がありません";
    if (typeof v33CkQuote === "function") {
        const __ck = v33CkQuote;
        v33CkQuote = function () {
            const S0 = ship();
            try {
                if (S0 && podSync(S0))
                    save();
            }
            catch (e) { }
            let F = __ck.apply(this, arguments);
            try {
                const S = ship();
                if (Array.isArray(F) && S && !isPo(S)) {
                    const st = podState(S);
                    if (st !== "missing")
                        F = F.filter((f) => !(f && f.t === PORT_T));
                    else
                        F.forEach((f) => { if (f && f.t === PORT_T)
                            f.go = () => openEdit("v92r5aPod"); });
                }
            }
            catch (e) {
                warn("ck", e);
            }
            return F;
        };
    }
    const today = () => { try {
        return typeof v85docToday === "function" ? String(v85docToday()) : new Date().toISOString().slice(0, 10);
    }
    catch (e) {
        return new Date().toISOString().slice(0, 10);
    } };
    const addDays = (ymd, n) => { try {
        const d = new Date(ymd + "T00:00:00Z");
        d.setUTCDate(d.getUTCDate() + n);
        return d.toISOString().slice(0, 10);
    }
    catch (e) {
        return "";
    } };
    const dayDiff = (a, b) => Math.round((Date.parse(a + "T00:00:00Z") - Date.parse(b + "T00:00:00Z")) / 86400000);
    const md = (ymd) => String(ymd || "").slice(5).replace("-", "/");
    function ymdOfMd(s) {
        if (!/^\d{2}-\d{2}$/.test(String(s)))
            return "";
        const td = today();
        let y = +td.slice(0, 4);
        if (s < td.slice(5) && (+td.slice(5, 7) - +s.slice(0, 2)) > 2)
            y++;
        return y + "-" + s;
    }
    function realQuotes(S) { try {
        const Q = (S && S.quotes) || [];
        return Q.some((q) => q && String(q[4] || "") !== "（想定）");
    }
    catch (e) {
        return false;
    } }
    function etdAuto(S) {
        return !!S && !S.v92etdUser && !(S.etd && /^\d{4}-\d{2}-\d{2}/.test(String(S.etd))) && !isPo(S) && !isSmp(S) && !realQuotes(S);
    }
    function etdNow(S) {
        try {
            if (S && S.etd && /^\d{4}-\d{2}-\d{2}/.test(String(S.etd)))
                return String(S.etd).slice(0, 10);
            const it = ((S && S.sched) || []).find((x) => /ETD|出港/.test(String((x && x[1]) || "")));
            return it ? ymdOfMd(String(it[0])) : "";
        }
        catch (e) {
            return "";
        }
    }
    function setEtd(S, ymd) {
        const old = etdNow(S);
        S.etd = ymd;
        S.v92etdUser = 1;
        try {
            const delta = old ? dayDiff(ymd, old) : 0;
            (S.sched || []).forEach((r) => {
                if (!Array.isArray(r) || /入金/.test(String(r[1] || "")))
                    return;
                if (/ETD|出港/.test(String(r[1] || ""))) {
                    r[0] = ymd.slice(5);
                    return;
                }
                const y = ymdOfMd(String(r[0]));
                if (y && delta) {
                    const n = addDays(y, delta);
                    if (n)
                        r[0] = n.slice(5);
                }
            });
        }
        catch (e) {
            warn("setEtd", e);
        }
    }
    if (typeof v85docDue === "function") {
        const __due = v85docDue;
        v85docDue = function (ld) {
            const r = __due.apply(this, arguments);
            try {
                const S = typeof v85docShip === "function" ? v85docShip() : ship();
                const n = +ld || 0;
                if (r && r.late && n > 0 && etdAuto(S)) {
                    const etd = typeof v85docEtd === "function" ? String(v85docEtd() || "") : etdNow(S);
                    const due = etd ? addDays(etd, -n) : "";
                    return {
                        t: M(`出港の${n}日前まで（出港の予定日が未入力です。仮の出港日 ${md(etd)} で数えると ${md(due)}。上の「出港の予定日を入れる」で入れると、数え直します）`, `${n} days before sailing (no sailing date entered yet; with the provisional date ${md(etd)} this would be ${md(due)}. Enter the planned sailing date above to recalculate)`, `出港前 ${n} 天（尚未填写预定出港日；按暂定出港日 ${md(etd)} 计算为 ${md(due)}。在上方填写预定出港日后重新计算）`, `${n} días antes de la salida (aún sin fecha de salida; con la fecha provisional ${md(etd)} sería ${md(due)}. Introduzca arriba la fecha prevista para recalcular)`), late: 0
                    };
                }
            }
            catch (e) {
                warn("due", e);
            }
            return r;
        };
    }
    function etdNote() {
        try {
            const prem = document.querySelector("#v85doc .v85doc-prem") || document.querySelector(".v85doc-prem");
            const old = document.getElementById("v92r5a-etd");
            const S = ship();
            if (!prem || !S || isPo(S) || isSmp(S) || typeof openStepEdit !== "function") {
                if (old)
                    old.remove();
                return;
            }
            const auto = etdAuto(S), etd = etdNow(S);
            if (!auto && !S.v92etdUser) {
                if (old)
                    old.remove();
                return;
            }
            const sig = [auto ? 1 : 0, etd, lang()].join("|");
            if (old && old.isConnected && old.getAttribute("data-sig") === sig && old.previousElementSibling === prem)
                return;
            if (old)
                old.remove();
            const box = document.createElement("div");
            box.id = "v92r5a-etd";
            box.className = "v92r5a-note v92r5a-etd";
            box.style.fontSize = "12px";
            box.style.margin = "8px 0 10px";
            box.setAttribute("data-noi18n", "1");
            box.setAttribute("data-sig", sig);
            box.setAttribute("role", "note");
            const msg = auto
                ? M(`出港の予定日がまだ入っていません。下の書類の期限は、アプリが仮に置いた出港日${etd ? "（" + etd + "）" : ""}から数えています。予定日を入れると、その日から数え直します。`, `No planned sailing date yet. The deadlines below are counted from a provisional sailing date set by the app${etd ? " (" + etd + ")" : ""}. Enter the planned date to recalculate them.`, `尚未填写预定出港日。下方单证的期限按系统暂定的出港日${etd ? "（" + etd + "）" : ""}计算。填写后将按该日重新计算。`, `Aún no hay fecha de salida prevista. Los plazos de abajo se cuentan desde una fecha provisional${etd ? " (" + etd + ")" : ""}. Introduzca la fecha prevista para recalcularlos.`)
                : M(`出港の予定日：${etd}（受注内容の編集で入れた日）。下の書類の期限は、この日から数えています。`, `Planned sailing date: ${etd} (entered in “Edit order details”). The deadlines below are counted from this date.`, `预定出港日：${etd}（在“编辑订单内容”中填写）。下方单证的期限按该日计算。`, `Fecha de salida prevista: ${etd} (introducida en «Editar el pedido»). Los plazos de abajo se cuentan desde esta fecha.`);
            box.innerHTML = `<span>${E(msg)}</span> <button type="button" class="btn g" data-v92r5a="etd">${E(auto ? M("出港の予定日を入れる", "Enter the sailing date", "填写预定出港日", "Introducir la fecha de salida") : M("出港の予定日を変える", "Change the sailing date", "修改预定出港日", "Cambiar la fecha de salida"))}</button>`;
            prem.insertAdjacentElement("afterend", box);
            const b = box.querySelector("button");
            if (b)
                b.addEventListener("click", () => openEdit("v92r5aEtd"));
        }
        catch (e) {
            warn("etdNote", e);
        }
    }
    if (typeof openStepEdit === "function") {
        const __ose = openStepEdit;
        openStepEdit = function (i) {
            const r = __ose.apply(this, arguments);
            try {
                const S = ship();
                const seI = document.getElementById("seI"), seW = document.getElementById("seW"), g = document.getElementById("seGo");
                if (i === 0 && S && seI && seW && g && !isPo(S) && !document.getElementById("v92r5aPod")) {
                    const t0 = termInfo(S);
                    const lab = (s) => `<p class="lbl" style="margin-top:8px" data-noi18n>${E(s)}</p>`;
                    const podV = hasPod(S) ? String(S.pod) : "";
                    seI.insertAdjacentHTML("afterend", lab(M("仕向港（荷を降ろす港・空港）", "Port of discharge (destination port / airport)", "目的港（卸货港・机场）", "Puerto de destino (puerto / aeropuerto de descarga)")) +
                        `<input class="sel" id="v92r5aPod" value="${E(podV)}" placeholder="${E(M("例：Le Havre／Bangkok", "e.g. Le Havre / Bangkok", "例：Le Havre／Bangkok", "p. ej. Le Havre / Bangkok"))}" style="width:100%;box-sizing:border-box" data-noi18n>` +
                        `<p class="nn" style="margin-top:3px" data-noi18n>${E(M("CIF・CFR のときは、取引条件に書いた場所（例：CIF Le Havre）が仕向港です。空のままなら、その場所を入れます。FOB などでは、分かったときに入れてください（船積みの書類で使います）。", "For CIF / CFR, the place in the terms (e.g. CIF Le Havre) is the destination port; if left empty, that place is used. For FOB etc., enter it when known (used in shipping documents).", "CIF・CFR 时，贸易条件中的地点（例：CIF Le Havre）即目的港；留空则使用该地点。FOB 等可在确定后填写（用于装运单证）。", "Con CIF / CFR, el lugar indicado en las condiciones (p. ej. CIF Le Havre) es el puerto de destino; si se deja vacío se usa ese lugar. Con FOB, etc., introdúzcalo cuando lo sepa."))}</p>`);
                    const auto = etdAuto(S), etd = etdNow(S);
                    const etdV = (!auto && S.etd && /^\d{4}-\d{2}-\d{2}/.test(String(S.etd))) ? String(S.etd).slice(0, 10) : "";
                    seW.insertAdjacentHTML("afterend", lab(M("出港の予定日（ETD）", "Planned sailing date (ETD)", "预定出港日（ETD）", "Fecha de salida prevista (ETD)")) +
                        `<input type="date" class="sel" id="v92r5aEtd" value="${E(etdV)}" style="width:100%;box-sizing:border-box">` +
                        `<p class="nn" style="margin-top:3px" data-noi18n>${E(etdV
                            ? M("書類の期限（出港の◯日前まで）と、請求書の ETD / ETA は、この日から数えます。", "Document deadlines (N days before sailing) and ETD / ETA on the invoice are counted from this date.", "单证期限（出港前 N 天）和发票的 ETD / ETA 按该日计算。", "Los plazos de los documentos y ETD / ETA de la factura se cuentan desde esta fecha.")
                            : M(`まだ入っていません${etd ? "（いまは、アプリが仮に置いた " + etd + " で数えています）" : ""}。入れると、書類の期限（出港の◯日前まで）と、請求書の ETD / ETA をこの日から数え直します。`, `Not entered yet${etd ? " (currently counted from the provisional date " + etd + " set by the app)" : ""}. Once entered, document deadlines and ETD / ETA on the invoice are recalculated from it.`, `尚未填写${etd ? "（目前按系统暂定的 " + etd + " 计算）" : ""}。填写后，单证期限和发票的 ETD / ETA 将按该日重新计算。`, `Aún sin introducir${etd ? " (ahora se cuenta desde la fecha provisional " + etd + ")" : ""}. Al introducirla se recalculan los plazos y ETD / ETA de la factura.`))}</p>`);
                    const o = g.onclick;
                    if (typeof o === "function") {
                        g.onclick = function (ev) {
                            let pv = null, ev2 = null;
                            try {
                                const a = document.getElementById("v92r5aPod"), b = document.getElementById("v92r5aEtd");
                                pv = a ? String(a.value || "").trim() : null;
                                ev2 = b ? String(b.value || "") : null;
                            }
                            catch (e) { }
                            const rr = o.call(this, ev);
                            try {
                                const T = ship();
                                if (T && T === S) {
                                    let chg = false;
                                    if (pv != null) {
                                        if (pv && pv !== podV) {
                                            T.pod = pv;
                                            delete T.v92podTerm;
                                            chg = true;
                                        }
                                        else if (!pv && podV) {
                                            T.pod = T.country || "";
                                            delete T.v92podTerm;
                                            chg = true;
                                        }
                                        else if (pv && pv === podV && T.v92podTerm) {
                                            const t1 = termInfo(T);
                                            if (/^(CFR|CNF|CIF)$/.test(t1.code) && t1.place && !t1.cty && t1.place !== t0.place) {
                                                T.pod = t1.place;
                                                chg = true;
                                            }
                                        }
                                    }
                                    if (podSync(T))
                                        chg = true;
                                    if (ev2 != null) {
                                        if (/^\d{4}-\d{2}-\d{2}$/.test(ev2) && ev2 !== etdV) {
                                            setEtd(T, ev2);
                                            chg = true;
                                        }
                                        else if (!ev2 && etdV) {
                                            delete T.etd;
                                            delete T.v92etdUser;
                                            chg = true;
                                        }
                                    }
                                    if (chg) {
                                        try {
                                            const t = ten();
                                            if (t && t.shipEdit && typeof t.shipEdit === "object" && (t.src === "upload" || t.src === "sample2"))
                                                t.shipEdit.v92r5a = { pod: hasPod(T) ? T.pod : "", podTerm: T.v92podTerm ? 1 : 0, etd: T.v92etdUser ? T.etd : "" };
                                        }
                                        catch (e) { }
                                        save();
                                        try {
                                            if (typeof render === "function")
                                                render();
                                        }
                                        catch (e) { }
                                    }
                                }
                            }
                            catch (e) {
                                warn("editSave", e);
                            }
                            return rr;
                        };
                    }
                }
            }
            catch (e) {
                warn("ose", e);
            }
            return r;
        };
    }
    function editBack() {
        try {
            const t = ten(), S = ship();
            const x = t && t.shipEdit && t.shipEdit.v92r5a;
            if (!x || !S || isPo(S) || !S.v54gen || S.v92case || S.v61fb)
                return;
            if (String(t.shipEdit.buyer || "") !== String(S.buyer || ""))
                return;
            if (x.pod && !hasPod(S)) {
                S.pod = x.pod;
                if (x.podTerm)
                    S.v92podTerm = 1;
            }
            if (x.etd && /^\d{4}-\d{2}-\d{2}$/.test(String(x.etd)) && !S.v92etdUser)
                setEtd(S, String(x.etd));
        }
        catch (e) {
            warn("editBack", e);
        }
    }
    const MAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/;
    const norm = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
    function findMail(S) {
        try {
            const nm = norm(S && S.buyer);
            if (!nm)
                return "";
            const pick = (o) => { for (const k of ["email", "mail", "contact", "person", "to"]) {
                const m = String((o && o[k]) || "").match(MAIL_RE);
                if (m)
                    return m[0];
            } return ""; };
            for (const t of tens()) {
                for (const b of (Array.isArray(t.myBuyers) ? t.myBuyers : [])) {
                    if (b && norm(b.co || b.name) === nm) {
                        const m = pick(b);
                        if (m)
                            return m;
                    }
                }
            }
            for (const t of tens()) {
                const TH = (t && t.dmThreads) || {};
                for (const id of Object.keys(TH)) {
                    const th = TH[id];
                    if (th && norm(th.co || th.name || th.buyer) === nm) {
                        const m = pick(th);
                        if (m)
                            return m;
                    }
                }
            }
        }
        catch (e) { }
        return "";
    }
    API.findMail = findMail;
    function mailFix() {
        try {
            const box = document.getElementById("v92r4a-next");
            if (!box || box.getAttribute("data-v92r5a"))
                return;
            box.setAttribute("data-v92r5a", "1");
            const a = box.querySelector('a[data-v92r4a="mail"]');
            const S = ship();
            if (!a || !S || isSmp(S))
                return;
            const href = String(a.getAttribute("href") || "");
            if (!/^mailto:\?/.test(href))
                return;
            const em = findMail(S);
            if (!em)
                return;
            a.setAttribute("href", "mailto:" + encodeURIComponent(em).replace(/%40/g, "@") + href.slice(7));
            const sm = a.parentElement && a.parentElement.querySelector("small");
            const tn = sm && sm.firstChild;
            if (tn && tn.nodeType === 3)
                tn.textContent = M("宛先", "To", "收件人", "Para") + "：" + em + M("（バイヤーの登録の連絡先から）", " (from the buyer's registered contact)", "（取自买家登记的联系方式）", " (del contacto registrado del comprador)") + "　" + M("件名", "Subject", "主题", "Asunto") + "：";
        }
        catch (e) {
            warn("mailFix", e);
        }
    }
    try {
        new MutationObserver(() => { try {
            const b = document.getElementById("v92r4a-next");
            if (b && !b.getAttribute("data-v92r5a"))
                mailFix();
        }
        catch (e) { } }).observe(document.documentElement, { childList: true, subtree: true });
    }
    catch (e) { }
    const codeOf = (x) => { const m = String(x || "").match(INC_RE); return m ? m[1].toUpperCase() : ""; };
    function smpNote() {
        try {
            const o = document.getElementById("dO");
            const S = ship();
            if (!o || !S || !S.v61fb || isPo(S) || isSmp(S))
                return;
            const p = Array.from(o.querySelectorAll("p.nn")).find((x) => !x.getAttribute("data-v92r5a") && /がそのまま入っています|手入力はありません|entered as[- ]is|No manual input/i.test(x.textContent || ""));
            if (!p)
                return;
            const man = S.v61man || {};
            let snap = null;
            try {
                const rec = typeof v68trRecOf === "function" ? v68trRecOf(S) : null;
                snap = rec && typeof v61dlSnap === "function" ? v61dlSnap(rec) : null;
            }
            catch (e) { }
            const ed = [];
            if (man.unitPrice)
                ed.push(["単価", "unit price", "单价", "precio unitario"]);
            if (man.qty)
                ed.push(["数量", "quantity", "数量", "cantidad"]);
            const rc = codeOf(snap && snap.term), sc = codeOf(S.term);
            if (man.term || (rc && sc && rc !== sc))
                ed.push(["取引条件", "terms", "贸易条件", "condiciones"]);
            if (!ed.length)
                return;
            p.setAttribute("data-v92r5a", "1");
            const li = lang() === "en" ? 1 : lang() === "zh" ? 2 : lang() === "es" ? 3 : 0;
            const names = ed.map((x) => x[li]).join(li ? ", " : "・");
            const now = [S.unitPrice, String(S.qty || "").split("（")[0], S.term].filter(Boolean).join("／");
            const recS = snap ? [snap.price, snap.qty, snap.term].filter(Boolean).join("／") : "";
            const msg = M(`いまの値は ${now} です。このうち ${names} は、商談の記録から手で直した値です（「受注内容を編集」か、上の判断の欄で）。${recS ? "商談の記録は " + recS + " でした。" : ""}`, `Current values: ${now}. Of these, ${names} ${ed.length > 1 ? "were" : "was"} changed by hand from the meeting record (in “Edit order details” or the fields above).${recS ? " The meeting record had " + recS + "." : ""}`, `当前值为 ${now}。其中 ${names} 是在商谈记录的基础上手动修改的（在“编辑订单内容”或上方的判断栏）。${recS ? "商谈记录为 " + recS + "。" : ""}`, `Valores actuales: ${now}. De ellos, ${names} se ${ed.length > 1 ? "cambiaron" : "cambió"} a mano respecto al registro de la reunión.${recS ? " El registro decía " + recS + "." : ""}`);
            const btn = p.querySelector("button");
            Array.from(p.childNodes).forEach((n) => { if (n !== btn)
                p.removeChild(n); });
            const sp = document.createElement("span");
            sp.setAttribute("data-noi18n", "1");
            sp.className = "v92r5a-src";
            sp.textContent = msg + "　";
            p.insertBefore(sp, btn || null);
        }
        catch (e) {
            warn("smpNote", e);
        }
    }
    if (typeof poParseLocal === "function") {
        const __pp = poParseLocal;
        poParseLocal = function (text) {
            const j = __pp.apply(this, arguments);
            try {
                const t = String(text || "").replace(/\r/g, "");
                if (j && !/\d/.test(String(j.poNo || ""))) {
                    const m = t.match(/(?:P\.?\s?O\.?|Purchase\s*Order|Order)\s*(?:No\.?|Number|#|№)\s*[:：]?\s*([A-Z0-9][A-Z0-9\-\/_.]*\d[A-Z0-9\-\/_]*)/i)
                        || t.match(/(?:P\.?\s?O\.?|Purchase\s*Order)\s*[:：#]\s*([A-Z0-9][A-Z0-9\-\/_.]*\d[A-Z0-9\-\/_]*)/i);
                    j.poNo = m ? String(m[1]).trim() : "";
                }
                if (j && j.poNo)
                    j.poNo = String(j.poNo).replace(/[.,;:]+$/, "");
                if (j && !String(j.delivery || "").trim()) {
                    const m = t.match(/^\s*(?:Shipment|Shipping|Latest\s*Shipment|Ship\s*by|Time\s*of\s*Shipment|Delivery|納期|出荷)\s*[:：]\s*([^\n]{3,60})/im);
                    if (m)
                        j.delivery = String(m[1]).trim();
                }
            }
            catch (e) {
                warn("poParse", e);
            }
            return j;
        };
    }
    if (typeof v54docSellerEdit === "function") {
        const __se = v54docSellerEdit;
        v54docSellerEdit = function () {
            const r = __se.apply(this, arguments);
            try {
                const g = document.getElementById("v54sGo");
                if (g && !g.getAttribute("data-v92r5a") && typeof g.onclick === "function") {
                    g.setAttribute("data-v92r5a", "1");
                    const o = g.onclick;
                    g.onclick = function (ev) {
                        let nm = "", ad = "";
                        try {
                            nm = String((document.getElementById("v54sCo") || {}).value || "").trim();
                            ad = String((document.getElementById("v54sAd") || {}).value || "").trim();
                        }
                        catch (e) { }
                        const rr = o.call(this, ev);
                        try {
                            if (nm && !ad && !/[\u3040-\u30ff\u3400-\u9fff]/.test(nm)) {
                                let has = "";
                                try {
                                    has = String((v54docSeller() || {}).addr || "").trim();
                                }
                                catch (e) { }
                                if (!has)
                                    setTimeout(() => say(M("会社名を保存しました。住所はまだ空です（書類の Seller 欄は「住所 未登録」のままです。「会社名・住所を入れる」で英語の住所を入れてください）", "Company name saved. The address is still empty (the Seller field still shows no address; enter the English address under “Enter company name and address”)", "已保存公司名称。地址仍为空（单证的 Seller 栏仍显示未登记地址，请填写英文地址）", "Nombre guardado. La dirección sigue vacía (el campo Seller sigue sin dirección; introduzca la dirección en inglés)")), 30);
                            }
                        }
                        catch (e) {
                            warn("seller", e);
                        }
                        return rr;
                    };
                }
            }
            catch (e) {
                warn("sellerEdit", e);
            }
            return r;
        };
    }
    const payCat = (s) => { const p = String(s || ""); return /L\/C|信用状/i.test(p) ? "LC" : /D\/P|D\/A/i.test(p) ? "DP" : /前払|advance|prepay/i.test(p) ? "TT_PRE" : /後払|days|after|日/i.test(p) ? "TT_POST" : ""; };
    if (typeof v85docSet === "function") {
        const __ds = v85docSet;
        v85docSet = function (k, v) {
            const r = __ds.apply(this, arguments);
            try {
                const S = ship();
                if (k === "pay" && v && S && String(S.pay || "").trim() && payCat(S.pay) !== v) {
                    let shown = String(S.pay);
                    try {
                        if (typeof v54docPayEn === "function")
                            shown = String(v54docPayEn(S.pay) || S.pay);
                    }
                    catch (e) { }
                    const edit = isPo(S) ? M("発注書の内容の編集", "editing the order", "编辑订单", "la edición del pedido") : M("「受注内容を編集」の「支払」", "Payment in “Edit order details”", "“编辑订单内容”中的“付款”", "Pago en «Editar el pedido»");
                    setTimeout(() => say(M(`ここの「支払」は、要る書類を判断するための区分です。見積書・請求書の Payment（いま「${shown}」）は変わりません。書類の支払条件を変えるときは、${edit}で直してください。`, `“Payment” here is only used to decide which documents are needed. Payment on the quotation and invoice (now “${shown}”) is not changed. To change it, use ${edit}.`, `此处的“付款”仅用于判断所需单证。报价单・发票的 Payment（现为“${shown}”）不会改变。如需修改，请使用${edit}。`, `«Pago» aquí solo sirve para decidir qué documentos hacen falta. El Payment de la cotización y la factura (ahora «${shown}») no cambia. Para cambiarlo use ${edit}.`)), 60);
                }
            }
            catch (e) {
                warn("paySet", e);
            }
            return r;
        };
    }
    dict([["海上", "Sea", "海运", "Marítimo"], ["航空", "Air", "空运", "Aéreo"], ["クーリエ", "Courier", "快递", "Mensajería"], ["郵便", "Post", "邮政", "Correo postal"],
        ["T/T 前払い", "T/T in advance", "T/T 预付", "T/T por adelantado"], ["T/T 後払い", "T/T after shipment", "T/T 后付", "T/T posterior al envío"],
        ["L/C（信用状）", "L/C (letter of credit)", "L/C（信用证）", "L/C (carta de crédito)"], ["D/P・D/A", "D/P / D/A", "D/P・D/A", "D/P / D/A"], ["そのほか", "Other", "其他", "Otro"],
        ["輸入者が不要と言った", "The importer said it is not needed", "进口商表示不需要", "El importador dijo que no hace falta"],
        ["この国・この商材では要らない", "Not needed for this country / product", "该国・该商品不需要", "No hace falta para este país / producto"],
        ["別の書類で代える", "Replaced by another document", "以其他单证代替", "Se sustituye por otro documento"],
        ["今回は使わない（EPA など）", "Not used this time (EPA etc.)", "本次不使用（EPA 等）", "No se usa esta vez (EPA, etc.)"],
        ["不要の理由", "Reason not needed", "不需要的理由", "Motivo por el que no hace falta"]]);
    let tm = 0;
    function after() { try {
        editBack();
        etdNote();
        smpNote();
        mailFix();
    }
    catch (e) {
        warn("after", e);
    } }
    const later = () => { try {
        clearTimeout(tm);
        tm = setTimeout(after, 160);
        setTimeout(after, 750);
    }
    catch (e) { } };
    API.after = after;
    if (typeof render === "function") {
        const __r = render;
        render = function () { try {
            const S = ship();
            if (S) {
                editBack();
                podSync(S);
            }
        }
        catch (e) { } const r = __r.apply(this, arguments); later(); return r; };
    }
    if (typeof v85docRepaint === "function") {
        const __rp = v85docRepaint;
        v85docRepaint = function () { const r = __rp.apply(this, arguments); try {
            etdNote();
        }
        catch (e) { } later(); return r; };
    }
    if (typeof rDoc === "function") {
        const __rd = rDoc;
        rDoc = function () { const r = __rd.apply(this, arguments); try {
            smpNote();
        }
        catch (e) { } later(); return r; };
    }
    try {
        setTimeout(after, 900);
    }
    catch (e) { }
})();
