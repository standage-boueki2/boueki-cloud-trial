(function () {
    const W = window;
    if (W.__v2192r7a)
        return;
    W.__v2192r7a = 1;
    const R6 = W.v92r6b || null;
    const API = (W.v92r7a = W.v92r7a || {});
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
        console.warn("[v92r7a] " + k, e);
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
    const norm = (s) => { try {
        if (typeof v30Norm === "function")
            return v30Norm(s);
    }
    catch (e) { } return String(s || "").toLowerCase().replace(/[\s.,　・\-]/g, ""); };
    const nfkc = (s) => { let x = String(s == null ? "" : s); try {
        x = x.normalize("NFKC");
    }
    catch (e) { } return x; };
    const num = (s) => { const m = nfkc(s).match(/\d[\d,]*(?:\.\d+)?/); return m ? parseFloat(m[0].replace(/,/g, "")) : null; };
    const stShort = (s) => String(s || "").replace(/（.*$/, "");
    const ST = { talk: "商談中", quote: "見積提示", nego: "契約交渉", won: "取引中", lost: "失注" };
    const ST_IDX = { "コンタクト中": 0, "商談中": 1, "サンプル出荷": 2, "見積提示": 3, "契約交渉": 4, "取引中": 5 };
    const CUR_RE = [
        [/NZD|NZ\$|ニュージーランドドル/i, "NZD"], [/HKD|HK\$|香港ドル|港币|港元/i, "HKD"], [/SGD|(?<![A-Za-z])S\$|シンガポールドル/i, "SGD"],
        [/TWD|NTD|NT\$|台湾ドル|新台币|新臺幣/i, "TWD"], [/AUD|(?<![A-Za-z])A\$|AU\$|豪ドル|オーストラリアドル/i, "AUD"], [/CAD|(?<![A-Za-z])C\$|CA\$|カナダドル/i, "CAD"],
        [/USD|US\$|米ドル/i, "USD"], [/EUR|€|ユーロ/i, "EUR"], [/GBP|£|ポンド/i, "GBP"], [/CNY|RMB|CN¥|人民元|人民币/i, "CNY"], [/JPY|日本円/i, "JPY"],
        [/THB|バーツ|฿/i, "THB"], [/KRW|₩|ウォン/i, "KRW"], [/\b(AED|VND|CHF|MYR|IDR|PHP|INR|MXN|BRL|SAR)\b/i, ""],
        [/円|¥|￥/, "JPY"], [/元/, "CNY"], [/ドル|\$/, "USD"],
    ];
    const curOf = (s) => {
        const x = nfkc(s);
        if (!x)
            return "";
        for (const [re, c] of CUR_RE) {
            const m = x.match(re);
            if (m)
                return c || m[1].toUpperCase();
        }
        try {
            if (typeof v61dlCurOf === "function")
                return v61dlCurOf(x) || "";
        }
        catch (e) { }
        return "";
    };
    const amt = (s) => {
        const t = nfkc(s).trim();
        if (!t || !/\d/.test(t))
            return null;
        const c = curOf(t);
        let v = null;
        try {
            if (c === "USD" || c === "JPY") {
                const a = amtParse(t);
                if (a && a.cur === c && a.v > 0)
                    v = a.v;
            }
        }
        catch (e) { }
        if (v == null)
            v = num(t);
        return (v != null) ? { cur: c, v: +v || 0 } : null;
    };
    const fmtTot = (c, v) => {
        const s = (+v || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
        return c === "USD" ? "US$" + s : c === "JPY" ? "¥" + Math.round(+v || 0).toLocaleString("en-US") : (c ? c + " " : "") + s;
    };
    const fmtUnit = (c, v) => { try {
        if (c && typeof v61dlFmt === "function")
            return v61dlFmt(c, v);
    }
    catch (e) { } return fmtTot(c, v); };
    API.curOf = curOf;
    API.amt = amt;
    const fbList = () => { try {
        const d = dd();
        return (d && Array.isArray(d.fb)) ? d.fb : [];
    }
    catch (e) {
        return [];
    } };
    const isObj = (r) => !!r && !Array.isArray(r) && typeof r === "object";
    const isMihon = (S) => !!S && (/（想定）/.test(String(S.buyer || "")) || /想定シナリオ/.test(String(S.qty || "")));
    const effP = (r) => { try {
        return (typeof v61dlEffPrice === "function") ? v61dlEffPrice(r) : null;
    }
    catch (e) {
        return null;
    } };
    const hasFix = (r) => { const p = effP(r); return !!(p && !p.prov); };
    const recById = (id) => { try {
        return id ? (fbList().find((f) => isObj(f) && f.v61id === id) || null) : null;
    }
    catch (e) {
        return null;
    } };
    const recsOf = (buyer) => {
        const k = norm(buyer);
        if (!k)
            return [];
        return fbList().map((r, i) => ({ r, i })).filter((x) => isObj(x.r) && x.r.b && norm(x.r.b) === k)
            .sort((a, b) => String(b.r.d || "").localeCompare(String(a.r.d || "")) || a.i - b.i);
    };
    const usable = (r) => r.st !== "失注" && (!!effP(r) || (num(r.lot) || 0) > 0);
    const caseCur = (S) => {
        try {
            let c = curOf(S && S.unitPrice) || curOf(S && S.total);
            if (c)
                return c;
            const rec = S && S.v61fb ? recById(S.v61fb.id) : null;
            const p = rec ? effP(rec) : null;
            c = (p && curOf(p.s)) || (rec && rec.fixCur) || "";
            if (c)
                return c;
            try {
                c = (typeof v61dlProdCur === "function") ? v61dlProdCur() : "";
            }
            catch (e) { }
            return c || "USD";
        }
        catch (e) {
            return "USD";
        }
    };
    API.caseCur = caseCur;
    const unitSfx = (s) => { const m = nfkc(s).match(/[\/／]\s*[^\s\/／]{1,8}\s*$/); return m ? m[0].replace(/\s+/g, "").replace("／", "/") : ""; };
    const withCur = (v, c, old) => {
        const n = num(v);
        if (n == null)
            return String(v == null ? "" : v);
        return fmtUnit(c, n) + (unitSfx(v) || unitSfx(old));
    };
    const rows = (S) => { try {
        if (typeof v61dlRows === "function")
            v61dlRows(S);
    }
    catch (e) { } };
    const totOf = (S, c) => { const a = amt(S.unitPrice), q = num(S.qty); return (a && a.v > 0 && q > 0) ? fmtTot(a.cur || c || caseCur(S), Math.round(a.v * q * 100) / 100) : ""; };
    const normShip = (S) => {
        try {
            if (!S || isMihon(S))
                return false;
            let ch = false;
            const up = String(S.unitPrice == null ? "" : S.unitPrice);
            if (/\d/.test(up) && !curOf(up)) {
                let c = curOf(S.total);
                if (!c) {
                    const rec = S.v61fb ? recById(S.v61fb.id) : null;
                    const p = rec ? effP(rec) : null;
                    c = (p && curOf(p.s)) || (rec && rec.fixCur) || "";
                }
                if (!c) {
                    try {
                        c = (typeof v61dlProdCur === "function") ? v61dlProdCur() : "";
                    }
                    catch (e) { }
                }
                if (c) {
                    S.unitPrice = withCur(up, c);
                    ch = true;
                }
            }
            const tot = String(S.total == null ? "" : S.total);
            const a = amt(tot);
            if (tot.trim() && (!a || !(a.v > 0) || !a.cur)) {
                const c = curOf(S.unitPrice);
                const t = (a && a.v > 0 && c) ? fmtTot(c, a.v) : totOf(S, c);
                if (t && t !== tot) {
                    S.total = t;
                    ch = true;
                }
            }
            if (ch)
                rows(S);
            return ch;
        }
        catch (e) {
            warn("normShip", e);
            return false;
        }
    };
    const mergedRec = (B, x) => {
        const m = Object.assign({}, x.r);
        try {
            if (!(typeof v61dlIsPrice === "function" ? v61dlIsPrice(m.fixPrice) : /\d/.test(String(m.fixPrice || "")))) {
                const older = B.slice(B.indexOf(x) + 1).find((y) => y.r.st !== "失注" && hasFix(y.r));
                if (older) {
                    m.fixPrice = older.r.fixPrice;
                    m.fixCur = older.r.fixCur;
                }
            }
        }
        catch (e) { }
        return m;
    };
    const userShip = (S) => !!S && !!S.v61fb && !S.poNo && !isMihon(S);
    const KEYS = ["qty", "price", "term", "pay"];
    const MANK = { qty: "qty", price: "unitPrice", term: "term", pay: "pay" };
    const termCode = (s) => { const m = nfkc(s).toUpperCase().match(/(?:^|[^A-Z])(EXW|FCA|FAS|FOB|CFR|CNF|CIF|CPT|CIP|DAP|DPU|DDP)(?![A-Z])/); return m ? m[1].replace("CNF", "CFR") : ""; };
    const diffKeys = (S, m) => {
        const man = S.v61man || {}, out = [];
        try {
            if (man.qty) {
                const a = num(m.lot), b = num(S.qty);
                if (a > 0 && b != null && a !== b)
                    out.push("qty");
            }
            if (man.unitPrice) {
                const p = effP(m), a = p ? amt(p.s) : null, b = amt(S.unitPrice);
                if (a && a.v > 0 && b && (Math.abs(a.v - b.v) > 0.0001 || (a.cur && b.cur && a.cur !== b.cur)))
                    out.push("price");
            }
            if (man.term) {
                const t = (typeof v61dlRecTerm === "function") ? v61dlRecTerm(m) : null;
                if (t && t.code && termCode(S.term) && t.code !== termCode(S.term))
                    out.push("term");
            }
            if (man.pay) {
                const a = String(m.pay || "").trim();
                if (a && a !== String(S.pay || "").trim())
                    out.push("pay");
            }
        }
        catch (e) { }
        return out;
    };
    const recTxt = (m) => {
        const p = effP(m), q = String(m.lot || "").trim();
        let t = null;
        try {
            t = (typeof v61dlRecTerm === "function") ? v61dlRecTerm(m) : null;
        }
        catch (e) { }
        return [q, p ? p.s : "", t && t.code ? (t.code + " " + (t.place || "")).trim() : "", String(m.pay || "").trim()].filter(Boolean).join("・");
    };
    const stT = (s) => { try {
        return (typeof v61dlStT === "function") ? v61dlStT(s) : String(s || "");
    }
    catch (e) {
        return String(s || "");
    } };
    const relinkS = (S) => {
        try {
            if (!userShip(S))
                return false;
            const L = S.v61fb;
            const B = recsOf(S.buyer || L.b);
            if (!B.length)
                return false;
            const cu = L.id ? B.find((x) => x.r.v61id === L.id) : null;
            if (L.won || (cu && cu.r.st === "受注"))
                return false;
            const N = B.slice(0, cu ? B.indexOf(cu) : B.length).find((x) => usable(x.r));
            if (!N)
                return false;
            const m = mergedRec(B, N);
            L.id = v61dlId(N.r);
            L.d = N.r.d || "";
            L.b = N.r.b || L.b;
            L.c = N.r.c || L.c;
            L.won = 0;
            const done = v61dlApply(S, m, KEYS);
            L.snap = v61dlSnap(N.r);
            if (N.r.st === "受注")
                L.won = 1;
            L.v92re = { at: Date.now(), from: cu ? (cu.r.d || "") : "", keys: done };
            delete L.v92keep;
            normShip(S);
            return true;
        }
        catch (e) {
            warn("relink", e);
            return false;
        }
    };
    const askOf = (S) => {
        try {
            if (!userShip(S))
                return null;
            const L = S.v61fb, B = recsOf(S.buyer || L.b);
            const cu = L.id ? B.find((x) => x.r.v61id === L.id) : null;
            if (!cu)
                return null;
            const newer = B.slice(0, B.indexOf(cu));
            const more = (cu.r.st === "受注" || L.won) ? newer.filter((x) => x.r.st === "受注" && usable(x.r)) : [];
            if (more.length) {
                const sig = "more:" + more.map((x) => v61dlId(x.r)).join(",");
                if (L.v92keepM !== sig)
                    return { kind: "more", S, rec: more[0].r, fi: more[0].i, n: more.length, cur: cu.r, curFi: cu.i, sig };
            }
            if (!L.v92re)
                return null;
            const m = mergedRec(B, cu);
            const keys = diffKeys(S, m);
            if (!keys.length)
                return null;
            const sig = "diff:" + L.id + ":" + keys.join(",") + ":" + recTxt(m);
            if (L.v92keep === sig)
                return null;
            return { kind: "diff", S, rec: cu.r, fi: cu.i, m, keys, sig };
        }
        catch (e) {
            warn("ask", e);
            return null;
        }
    };
    API.askOf = askOf;
    const save = () => { try {
        if (typeof v61dlSave === "function")
            v61dlSave();
        else if (typeof saveTen === "function")
            saveTen();
    }
    catch (e) { } };
    const allShips = () => { try {
        return (typeof v61dlAllCases === "function") ? (v61dlAllCases() || []) : [];
    }
    catch (e) {
        return [];
    } };
    let LASTRE = [];
    let KW = null;
    let BUSY = 0;
    const relinkAll = () => {
        const out = [];
        let ch = false;
        if (BUSY)
            return out;
        try {
            allShips().forEach((S) => {
                if (!S)
                    return;
                const user = userShip(S) || !!(S.v61man && Object.keys(S.v61man).length) || !!S.v56shipFb;
                if (!user)
                    return;
                if (relinkS(S)) {
                    out.push(S.no);
                    ch = true;
                }
                else if (normShip(S))
                    ch = true;
            });
            if (ch)
                save();
        }
        catch (e) {
            warn("relinkAll", e);
        }
        if (out.length)
            LASTRE = out;
        return out;
    };
    API.relinkAll = relinkAll;
    const askApply = (S) => {
        try {
            const a = askOf(S);
            if (!a || a.kind !== "diff")
                return false;
            S.v61man = S.v61man || {};
            a.keys.forEach((k) => { delete S.v61man[MANK[k]]; });
            v61dlApply(S, a.m, a.keys);
            S.v61fb.snap = v61dlSnap(a.rec);
            normShip(S);
            save();
            return true;
        }
        catch (e) {
            warn("askApply", e);
            return false;
        }
    };
    const askKeep = (S) => { try {
        const a = askOf(S);
        if (a) {
            if (a.kind === "more")
                S.v61fb.v92keepM = a.sig;
            else
                S.v61fb.v92keep = a.sig;
            save();
        }
    }
    catch (e) { } };
    const KN = (k) => k === "qty" ? M("数量", "quantity", "数量", "cantidad") : k === "price" ? M("単価", "unit price", "单价", "precio unitario") : k === "term" ? M("取引条件", "trade term", "贸易条件", "condición comercial") : M("支払条件", "payment terms", "付款条件", "condiciones de pago");
    const docTxt = (S, keys) => { const K = keys || KEYS; return [K.indexOf("qty") >= 0 ? String(S.qty || "").split("（")[0] : "", K.indexOf("price") >= 0 ? S.unitPrice : "", K.indexOf("term") >= 0 ? S.term : "", K.indexOf("pay") >= 0 ? S.pay : ""].filter(Boolean).join("・"); };
    const askMsg = (a) => {
        const r = a.rec, lab = `${r.d || ""}・${stT(r.st || "")}`;
        if (a.kind === "more")
            return M(`この相手に、新しい「受注」の記録（${lab}：${recTxt(r)}）があります。この書類（${a.S.no}）は、前の受注（${a.cur.d || ""}）のものなので変えていません。新しい記録は別の注文として、累計受注金額に足しています。同じ注文の言い直しなら、古い方の記録の状況を直してください。`, `There is a newer “Order” record for this buyer (${lab}: ${recTxt(r)}). These documents (${a.S.no}) belong to the earlier order (${a.cur.d || ""}) and were not changed. The newer record is counted as a separate order in the total order value. If it is a correction of the same order, change the status of the older record.`, `该客户有更新的“接单”记录（${lab}：${recTxt(r)}）。本单据（${a.S.no}）属于之前的订单（${a.cur.d || ""}），未作更改。新记录作为另一笔订单计入累计接单金额。如果是同一订单的更正，请修改旧记录的状态。`, `Hay un registro de «Pedido» más reciente para este comprador (${lab}: ${recTxt(r)}). Estos documentos (${a.S.no}) son del pedido anterior (${a.cur.d || ""}) y no se cambiaron. El nuevo registro se cuenta como otro pedido. Si es una corrección del mismo pedido, cambie el estado del registro anterior.`);
        const names = a.keys.map(KN).join(M("・", ", ", "・", ", "));
        return M(`新しい記録（${lab}：${recTxt(a.m)}）と書類の値が違います。書類（${a.S.no}）の ${names} は「受注内容を編集」で手で直した値（${docTxt(a.S, a.keys)}）なので、変えていません。`, `The newer record (${lab}: ${recTxt(a.m)}) differs from the documents. The ${names} in the documents (${a.S.no}) ${a.keys.length > 1 ? "were" : "was"} edited by hand in “Edit order details” (${docTxt(a.S, a.keys)}), so nothing was changed.`, `新记录（${lab}：${recTxt(a.m)}）与单据的值不同。单据（${a.S.no}）的${names}是在“编辑订单内容”中手动修改的值（${docTxt(a.S, a.keys)}），因此未作更改。`, `El registro más reciente (${lab}: ${recTxt(a.m)}) difiere de los documentos. ${names} de los documentos (${a.S.no}) se editó a mano en «Editar pedido» (${docTxt(a.S, a.keys)}), por lo que no se cambió.`);
    };
    const askHtml = (a, where) => {
        const b1 = a.kind === "diff" ? `<button class="btn" type="button" data-v92r7a-ask="apply">${E(M("記録に合わせる", "Use the record", "按记录更新", "Usar el registro"))}</button>` : `<button class="btn g" type="button" data-v92r7a-ask="rec">${E(M("古い方の記録を開く", "Open the older record", "打开旧记录", "Abrir el registro anterior"))}</button>`;
        return `<div class="v92r7a-ask" role="alert" data-noi18n data-v92r7a-no="${E(a.S.no || "")}" data-v92r7a-w="${E(where)}"><p><b>⚠ ${E(askMsg(a))}</b></p><span class="rw" style="gap:6px;flex-wrap:wrap">${b1}<button class="btn g" type="button" data-v92r7a-ask="keep">${E(M("このままにする", "Keep as is", "保持不变", "Dejar como está"))}</button></span></div>`;
    };
    const shipByNo = (no) => allShips().find((S) => S && String(S.no) === String(no)) || null;
    const rerender = () => { try {
        if (typeof render === "function")
            render();
    }
    catch (e) { } };
    document.addEventListener("click", (ev) => {
        try {
            const b = ev.target && ev.target.closest && ev.target.closest("[data-v92r7a-ask]");
            if (!b)
                return;
            const box = b.closest(".v92r7a-ask");
            const S = box ? shipByNo(box.getAttribute("data-v92r7a-no")) : null;
            if (!S)
                return;
            const k = b.getAttribute("data-v92r7a-ask");
            const fl = document.getElementById("v92r7aFloat");
            if (k === "apply") {
                if (askApply(S))
                    toast(M(`書類（${S.no}）を、新しい記録の値に合わせました：${docTxt(S)}`, `Documents (${S.no}) now use the newer record: ${docTxt(S)}`, `单据（${S.no}）已按新记录更新：${docTxt(S)}`, `Los documentos (${S.no}) usan ahora el registro más reciente: ${docTxt(S)}`));
            }
            else if (k === "keep") {
                askKeep(S);
                toast(M("書類はこのままにしました（内訳の窓には、記録の額との違いが出ます）", "Documents kept as they are (the breakdown shows the difference from the record)", "单据保持不变（明细窗口会显示与记录的差异）", "Los documentos se dejaron como están"));
            }
            else if (k === "rec") {
                const a = askOf(S);
                if (a && typeof v61dlFbEdit === "function") {
                    if (fl)
                        fl.remove();
                    try {
                        if (box && box.closest("#dw"))
                            closeDW();
                    }
                    catch (e) { }
                    v61dlFbEdit(a.curFi);
                    return;
                }
            }
            if (fl)
                fl.remove();
            if (box && box.closest("#dw")) {
                try {
                    box.remove();
                }
                catch (e) { }
            }
            rerender();
        }
        catch (e) {
            warn("ask-click", e);
        }
    }, true);
    const afterRecSave = (buyer) => {
        try {
            const re = LASTRE;
            LASTRE = [];
            const asks = allShips().map(askOf).filter(Boolean).filter((a) => !buyer || norm(a.S.buyer) === norm(buyer));
            const old = document.getElementById("v92r7aFloat");
            if (old)
                old.remove();
            if (asks.length) {
                const d = document.createElement("div");
                d.id = "v92r7aFloat";
                d.className = "v92r7a-float";
                d.innerHTML = askHtml(asks[0], "float");
                document.body.appendChild(d);
                return;
            }
            if (re.length) {
                const L = re.map(shipByNo).filter(Boolean);
                if (L.length)
                    setTimeout(() => { try {
                        toast(M(`新しい記録に合わせて、書類（${L.map((S) => S.no).join("・")}）の値を更新しました：${docTxt(L[0])}`, `Documents (${L.map((S) => S.no).join(", ")}) were updated from the newer record: ${docTxt(L[0])}`, `已按新记录更新单据（${L.map((S) => S.no).join("・")}）：${docTxt(L[0])}`, `Documentos (${L.map((S) => S.no).join(", ")}) actualizados con el registro más reciente: ${docTxt(L[0])}`));
                    }
                    catch (e) { } }, 2600);
            }
        }
        catch (e) {
            warn("afterRecSave", e);
        }
    };
    const edited = (S) => { try {
        const m = S && S.v61man;
        return !!(m && (m.qty || m.unitPrice || m.term || m.pay));
    }
    catch (e) {
        return false;
    } };
    const isPo = (c) => !!(c && (c.po || c.src === "po" || (c.ship && c.ship.poNo)));
    const recAmt = (r) => {
        try {
            const p = effP(r);
            const a = p ? amt(p.s) : null;
            const q = num(r.lot);
            if (!a || !(a.v > 0) || !a.cur || !(q > 0))
                return null;
            return { cur: a.cur, v: Math.round(a.v * q * 100) / 100, unit: p.s, qty: r.lot, prov: p.prov };
        }
        catch (e) {
            return null;
        }
    };
    const fixCase = (c, all) => {
        try {
            if (!c || c.v92r7a)
                return c;
            c.v92r7a = 1;
            c.recs.sort((a, b) => String(a.r.d || "").localeCompare(String(b.r.d || "")) || (b.fi - a.fi));
            const recs = c.recs.map((x) => x.r);
            const last = recs[recs.length - 1];
            const st = c.row ? stShort(c.row.st) : "";
            const useSt = !!c.row && !(c.demo && !all && c.rowSmp);
            const wonRecs = c.recs.filter((x) => x.r.st === "受注");
            const qRecs = c.recs.filter((x) => x.r.st === "見積提示");
            const poShips = c.ships.filter(isPo);
            const priced = (S) => !!(S && S.v61man && S.v61man.unitPrice);
            const docOk = c.ships.length > 0 && (!recs.length || recs.some(hasFix) || c.ships.some((x) => priced(x.ship)) || qRecs.length > 0);
            const stQ = useSt && (st === ST.quote || st === ST.nego) && !(c.row && c.row.th && c.row.th.statusBy === "書類" && !docOk && !qRecs.length);
            c.quoteBy = qRecs.length ? "rec" : docOk ? "doc" : stQ ? "st" : "";
            const lost = !c.wonBy && ((last && last.st === "失注") || (c.row && c.row.lead === "失注") || st === ST.lost);
            c.stage = c.wonBy ? "won" : lost ? "lost" : c.quoteBy ? "quote" : "talk";
            c.reachedQuote = c.stage === "won" || c.stage === "quote";
            const pick = (L) => { for (let i = L.length - 1; i >= 0; i--) {
                const a = recAmt(L[i].r);
                if (a)
                    return { a, x: L[i] };
            } return null; };
            const rp = c.stage === "won" ? (pick(wonRecs) || pick(c.recs.filter((x) => hasFix(x.r))) || pick(qRecs)) : c.stage === "quote" ? (pick(qRecs) || pick(c.recs.filter((x) => hasFix(x.r)))) : null;
            c.amt = null;
            c.amtSrc = "";
            c.no = "";
            c.unitS = "—";
            c.qtyS = "—";
            c.docRate = 0;
            c.recAlt = null;
            delete c.nSum;
            delete c.v92more;
            if (c.S) {
                const a = amt(c.S.total);
                if (a && a.v > 0) {
                    const cu = a.cur || caseCur(c.S);
                    c.amt = { cur: cu, v: a.v };
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
                    const lid = c.S.v61fb && c.S.v61fb.id;
                    const lk = lid ? c.recs.find((x) => x.r.v61id === lid) : null;
                    const la = lk ? recAmt(lk.r) : null;
                    const cmp = la ? { a: la, x: lk } : rp;
                    if (cmp && (cmp.a.cur !== cu || Math.abs(cmp.a.v - a.v) > 0.005))
                        c.recAlt = cmp.a;
                    if (c.stage === "won" && c.ships.length === 1 && !poShips.length && lk && lk.r.st === "受注") {
                        const more = wonRecs.filter((x) => x !== lk).map((x) => recAmt(x.r)).filter((y) => y && y.cur === cu);
                        if (more.length) {
                            const sum = more.reduce((s, y) => s + y.v, 0);
                            c.amt.v = Math.round((a.v + sum) * 100) / 100;
                            c.v92more = { n: more.length, doc: a.v, recs: more };
                            c.unitS = String(c.unitS) + M(`（書類 ${fmtTot(cu, a.v)}）＋ 別の注文として記録した受注 ${more.length}件（${fmtTot(cu, sum)}。書類はまだありません）`, ` (documents ${fmtTot(cu, a.v)}) + ${more.length} other order record(s) (${fmtTot(cu, sum)}; no documents yet)`, `（单据 ${fmtTot(cu, a.v)}）＋ 另记为其他订单的接单 ${more.length}件（${fmtTot(cu, sum)}，尚无单据）`, ` (documentos ${fmtTot(cu, a.v)}) + ${more.length} pedido(s) registrados aparte (${fmtTot(cu, sum)})`);
                        }
                    }
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
            if (c.stage === "quote")
                c.quoteD = qRecs.length ? String(qRecs[qRecs.length - 1].r.d || "").slice(0, 10) : c.quoteD;
            if (c.stage !== "won" && c.stage !== "quote")
                c.dISO = last ? String(last.d || "").slice(0, 10) : (c.dISO || "");
        }
        catch (e) {
            warn("fixCase", e);
        }
        return c;
    };
    const r6List = R6 && R6.caseList, r6Cases = R6 && R6.cases, r6Rm = R6 && R6.rmFacts;
    const primeUs = (us) => { try {
        if (r6List && Array.isArray(us))
            (r6List(us) || []).forEach((c) => fixCase(c, false));
    }
    catch (e) {
        warn("prime", e);
    } };
    const prime = (rm) => {
        try {
            if (typeof dashScopeUnits === "function")
                primeUs(dashScopeUnits());
        }
        catch (e) {
            warn("prime-s", e);
        }
        if (rm) {
            try {
                const F = r6Rm ? r6Rm() : null;
                if (F && Array.isArray(F.CS))
                    F.CS.forEach((c) => fixCase(c, true));
            }
            catch (e) {
                warn("prime-rm", e);
            }
        }
    };
    let HOLD = 0;
    const hold = (fn, pre) => {
        if (HOLD) {
            try {
                if (pre)
                    pre();
            }
            catch (e) { }
            return fn();
        }
        const dn = Date.now, t0 = dn.call(Date);
        HOLD = 1;
        try {
            Date.now = () => t0;
            if (pre)
                pre();
            return fn();
        }
        finally {
            Date.now = dn;
            HOLD = 0;
        }
    };
    if (R6) {
        R6.caseList = function (us, opt) { const L = r6List.apply(this, arguments) || []; const all = !!(opt && opt.all); L.forEach((c) => fixCase(c, all)); return L; };
        R6.cases = function () { const L = r6Cases.apply(this, arguments) || []; L.forEach((c) => fixCase(c, false)); return L; };
        R6.rmFacts = function () { return hold(() => r6Rm.apply(R6, arguments), () => prime(true)); };
    }
    API.cases = () => (R6 ? R6.cases() : []);
    const wrapHold = (name, get, set, rm, preUs) => {
        try {
            const o = get();
            if (typeof o !== "function")
                return;
            set(function () {
                const self = this, args = arguments;
                return hold(() => o.apply(self, args), () => { if (preUs && Array.isArray(args[0]))
                    primeUs(args[0]); prime(rm); });
            });
        }
        catch (e) {
            warn("wrap-" + name, e);
        }
    };
    try {
        wrapHold("dashAgg", () => (typeof dashAgg === "function" ? dashAgg : null), (f) => { dashAgg = f; }, false, true);
    }
    catch (e) { }
    try {
        wrapHold("dashDrill", () => (typeof dashDrill === "function" ? dashDrill : null), (f) => { dashDrill = f; });
    }
    catch (e) { }
    try {
        wrapHold("a30Collect", () => (typeof a30Collect === "function" ? a30Collect : null), (f) => { a30Collect = f; });
    }
    catch (e) { }
    try {
        wrapHold("v88Sig", () => (typeof v88Sig === "function" ? v88Sig : null), (f) => { v88Sig = f; }, true);
    }
    catch (e) { }
    try {
        wrapHold("v88Phases", () => (typeof v88Phases === "function" ? v88Phases : null), (f) => { v88Phases = f; }, true);
    }
    catch (e) { }
    try {
        wrapHold("v88Road", () => (typeof v88Road === "function" ? v88Road : null), (f) => { v88Road = f; }, true);
    }
    catch (e) { }
    let GATE = 0;
    try {
        if (typeof dashUnits === "function") {
            const o = dashUnits;
            dashUnits = function () {
                if (GATE) {
                    try {
                        if (/syncStatus/.test(String(new Error().stack || "")))
                            return [];
                    }
                    catch (e) { }
                }
                return o.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("units-wrap", e);
    }
    const dayOf = (ms) => { try {
        const d = new Date(+ms);
        if (isNaN(d.getTime()))
            return "";
        return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    catch (e) {
        return "";
    } };
    const setSt = (th, st, by, why) => {
        th.status = st;
        th.statusAt = Date.now();
        th.statusBy = by;
        th.statusWhy = String(why || "").slice(0, 140);
        th.stLog = (th.stLog || []).concat([{ st, at: Date.now(), by, why: th.statusWhy }]).slice(-12);
    };
    let syncBusy = false;
    const syncStatus = () => {
        if (syncBusy || !R6)
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
            (R6.caseList([u]) || []).forEach((c) => {
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
    try {
        if (typeof render === "function") {
            const o = render;
            render = function () {
                try {
                    if (KW && KW.d && KW.d.kpi && KW.d.kpi.won === KW.v + 1)
                        KW.d.kpi.won = KW.v;
                }
                catch (e) { }
                try {
                    relinkAll();
                }
                catch (e) { }
                try {
                    samplePlAll();
                }
                catch (e) { }
                try {
                    syncStatus();
                }
                catch (e) { }
                GATE++;
                try {
                    return o.apply(this, arguments);
                }
                finally {
                    GATE--;
                    try {
                        setTimeout(paint, 0);
                    }
                    catch (e) { }
                }
            };
        }
    }
    catch (e) {
        warn("render-wrap", e);
    }
    try {
        if (typeof shipEnsure === "function") {
            const o = shipEnsure;
            shipEnsure = function () { const r = o.apply(this, arguments); try {
                relinkAll();
            }
            catch (e) { } return r; };
        }
    }
    catch (e) {
        warn("ensure-wrap", e);
    }
    try {
        if (typeof dealSave === "function") {
            const o = dealSave;
            dealSave = function () {
                let b = "";
                try {
                    b = String((document.getElementById("dfB") || {}).value || "").trim();
                }
                catch (e) { }
                const n0 = fbList().length;
                try {
                    const d0 = dd();
                    KW = (demoNow() && d0 && d0.kpi && typeof d0.kpi.won === "number") ? { d: d0, v: d0.kpi.won } : null;
                }
                catch (e) {
                    KW = null;
                }
                BUSY++;
                let r;
                try {
                    r = o.apply(this, arguments);
                }
                catch (e) {
                    BUSY = 0;
                    throw e;
                }
                const fin = () => {
                    BUSY = 0;
                    try {
                        if (KW && KW.d.kpi.won === KW.v + 1)
                            KW.d.kpi.won = KW.v;
                    }
                    catch (e) { }
                    KW = null;
                    try {
                        if (fbList().length === n0)
                            return;
                        const re = relinkAll();
                        afterRecSave(b);
                        if (re.length)
                            rerender();
                    }
                    catch (e) {
                        warn("dealSave", e);
                    }
                };
                try {
                    if (r && typeof r.then === "function")
                        r.then(fin, fin);
                    else
                        fin();
                }
                catch (e) {
                    BUSY = 0;
                }
                return r;
            };
        }
    }
    catch (e) {
        warn("dealSave-wrap", e);
    }
    try {
        if (typeof v61dlAfterFbChange === "function") {
            const o = v61dlAfterFbChange;
            v61dlAfterFbChange = function (f) {
                const r = o.apply(this, arguments);
                try {
                    setTimeout(() => afterRecSave(f && f.b), 80);
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("fbchange-wrap", e);
    }
    const editFix = () => {
        try {
            const $ = (id) => document.getElementById(id);
            const q = $("seQ"), u = $("seU"), tt = $("seT"), g = $("seGo"), w = $("seW");
            const S = dd() && dd().ship;
            if (!q || !u || !tt || !g || !S || g.dataset.v92r7a)
                return;
            g.dataset.v92r7a = "1";
            const c0 = caseCur(S), up0 = S.unitPrice;
            let mT = false;
            const noCur = (v) => /\d/.test(String(v || "")) && !curOf(v);
            const fixU = () => { if (noCur(u.value))
                u.value = withCur(u.value, c0, up0); };
            const reTot = () => {
                if (mT)
                    return;
                const n = num(q.value), a = amt(u.value);
                if (n > 0 && a && a.v > 0)
                    tt.value = fmtTot(a.cur || c0, Math.round(a.v * n * 100) / 100);
            };
            tt.addEventListener("input", (ev) => { if (ev && ev.isTrusted)
                mT = true; });
            q.addEventListener("input", reTot);
            u.addEventListener("input", reTot);
            u.addEventListener("change", () => { fixU(); reTot(); });
            fixU();
            const hint = document.createElement("p");
            hint.className = "nn v92r7a-curh";
            hint.setAttribute("data-noi18n", "1");
            hint.textContent = M(`この案件の通貨は ${c0} です。単価を数字だけで入れたときは ${c0} として保存します（合計は 数量×単価）。`, `This case is in ${c0}. A unit price entered as a number only is saved in ${c0} (total = quantity × unit price).`, `本案件的货币为 ${c0}。只输入数字的单价按 ${c0} 保存（合计＝数量×单价）。`, `Este caso está en ${c0}. Un precio solo numérico se guarda en ${c0} (total = cantidad × precio).`);
            u.insertAdjacentElement("afterend", hint);
            try {
                const a = askOf(S);
                if (a) {
                    const d = document.createElement("div");
                    d.innerHTML = askHtml(a, "edit");
                    const h3 = g.closest("#dw") ? g.closest("#dw").querySelector("h3") : null;
                    if (h3 && d.firstElementChild)
                        h3.insertAdjacentElement("afterend", d.firstElementChild);
                }
            }
            catch (e) { }
            const o = g.onclick;
            if (typeof o !== "function")
                return;
            g.onclick = function (ev) {
                try {
                    fixU();
                    const a = amt(tt.value);
                    if (!mT || !a || !(a.v > 0)) {
                        mT = false;
                        reTot();
                    }
                    else if (!a.cur)
                        tt.value = fmtTot(curOf(u.value) || c0, a.v);
                    if (w && !String(w.value || "").trim() && S.want)
                        S.want = "";
                }
                catch (e) {
                    warn("edit-pre", e);
                }
                const r = o.call(this, ev);
                try {
                    normShip(S);
                    if (S.v61fb)
                        delete S.v61fb.v92re;
                    save();
                }
                catch (e) { }
                return r;
            };
        }
        catch (e) {
            warn("editFix", e);
        }
    };
    try {
        if (typeof openStepEdit === "function") {
            const o = openStepEdit;
            openStepEdit = function (i) { const r = o.apply(this, arguments); try {
                if (i === 0)
                    editFix();
            }
            catch (e) { } return r; };
        }
    }
    catch (e) {
        warn("ose-wrap", e);
    }
    try {
        if (typeof V84MIG !== "undefined" && V84MIG && Array.isArray(V84MIG.man) && !V84MIG.man.some((t) => t && t[0] === "a30Quick("))
            V84MIG.man.push(["a30Quick(", /^a30Quick\('([a-z0-9_]{1,20})'\)$/, "q", function (event, $) { try {
                    a30Quick($[0]);
                }
                catch (e) {
                    warn("a30Quick", e);
                } }]);
    }
    catch (e) {
        warn("a30-reg", e);
    }
    const prods = () => { try {
        return (typeof PRODUCTS !== "undefined" && PRODUCTS) ? PRODUCTS : {};
    }
    catch (e) {
        return {};
    } };
    const demoNow = () => { try {
        const P = prods(), d = dd();
        return (typeof PID !== "undefined" && P[PID] && P[PID] === d) ? String(PID) : "";
    }
    catch (e) {
        return "";
    } };
    const BASEPL = {};
    try {
        const P = prods();
        Object.keys(P).forEach((k) => {
            try {
                const S0 = P[k] && P[k].ship, row = S0 && S0.docRows && Array.isArray(S0.docRows.plRows) && S0.docRows.plRows.length === 1 ? S0.docRows.plRows[0] : null;
                const q = S0 ? num(S0.qty) : null, ctn = row ? num(row[2]) : null, gw = row ? num(row[3]) : null;
                if (q > 0 && ctn > 0 && /CTN/i.test(String(row[2])))
                    BASEPL[k] = { q, ctn, gw: gw > 0 ? gw : 0, per: q / ctn, kg: gw > 0 ? gw / ctn : 0, u: (typeof v61dlUnit === "function" ? v61dlUnit(S0.qty) : "") || "", row2: String(row[2]), row3: String(row[3]) };
            }
            catch (e) { }
        });
    }
    catch (e) {
        warn("basepl", e);
    }
    const samplePl = (S) => {
        try {
            const k = demoNow(), B = k ? BASEPL[k] : null;
            if (!B || !S || S.poNo)
                return false;
            const R = S.docRows, row = R && Array.isArray(R.plRows) && R.plRows.length === 1 && Array.isArray(R.plRows[0]) ? R.plRows[0] : null;
            const q = num(S.qty);
            if (!row || !(q > 0))
                return false;
            const ctn = Math.ceil(q / B.per - 1e-9);
            const gw = B.kg ? Math.round(ctn * B.kg * 10) / 10 : 0;
            const c2 = q === B.q ? B.row2 : ctn + " CTN", c3 = q === B.q ? B.row3 : (gw ? "G.W. " + gw.toFixed(1) + "kg" : row[3]);
            let ch = false;
            if (row[2] !== c2) {
                row[2] = c2;
                ch = true;
            }
            if (row[3] !== c3) {
                row[3] = c3;
                ch = true;
            }
            const n = q === B.q ? B.ctn : ctn;
            (Array.isArray(R.plEx) ? R.plEx : []).forEach((x) => { if (Array.isArray(x) && x[0] === "Marks" && /C-?\s?No\.?\s*1\s*-\s*\d+/i.test(String(x[1]))) {
                const v = String(x[1]).replace(/(C-?\s?No\.?\s*1\s*-\s*)\d+/i, "$1" + n);
                if (v !== x[1]) {
                    x[1] = v;
                    ch = true;
                }
            } });
            S.v92plS = q === B.q ? 0 : { ctn, gw, q };
            return ch;
        }
        catch (e) {
            warn("samplePl", e);
            return false;
        }
    };
    const samplePlAll = () => { try {
        if (!demoNow())
            return;
        let ch = false;
        (typeof SHIPS !== "undefined" && Array.isArray(SHIPS) ? SHIPS : []).forEach((c) => { if (c && c.ship && samplePl(c.ship))
            ch = true; });
        if (ch)
            save();
    }
    catch (e) { } };
    const samplePlNote = (S) => {
        const k = demoNow(), B = k ? BASEPL[k] : null;
        if (!B || !S)
            return "";
        const q = num(S.qty), u = B.u, f = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US");
        const baseT = M(`見本の受注（${f(B.q)}${u}＝${B.ctn}カートン${B.gw ? "・総重量 " + B.gw.toFixed(1) + "kg" : ""}）`, `the sample order (${f(B.q)} = ${B.ctn} cartons${B.gw ? ", G.W. " + B.gw.toFixed(1) + " kg" : ""})`, `示例订单（${f(B.q)}${u}＝${B.ctn}箱${B.gw ? "・毛重 " + B.gw.toFixed(1) + "kg" : ""}）`, `el pedido de muestra (${f(B.q)} = ${B.ctn} cajas${B.gw ? ", P.B. " + B.gw.toFixed(1) + " kg" : ""})`);
        if (!(q > 0) || q === B.q)
            return `<span data-noi18n>${E(M(`カートン数・重量は、${baseT}の決まった値です。`, `Cartons and weight are the fixed values of ${baseT}.`, `箱数・重量为${baseT}的固定值。`, `Las cajas y el peso son los valores fijos de ${baseT}.`))}</span>`;
        const ctn = Math.ceil(q / B.per - 1e-9), gw = B.kg ? Math.round(ctn * B.kg * 10) / 10 : 0;
        return `<span data-noi18n>${E(M(`カートン数・重量は、${baseT}と同じ入数（1カートン ${f(B.per)}${u}${B.kg ? "・" + f(B.kg) + "kg" : ""}）で、いまの数量から計算し直しています：${f(q)}${u} ÷ ${f(B.per)}${u}入 ＝ ${ctn}カートン${gw ? "、総重量 " + f(B.kg) + "kg × " + ctn + " ＝ " + gw.toFixed(1) + "kg（端数の箱も満杯として概算）" : ""}。見本の商品には寸法表が無いため、実際の梱包に合わせて確かめてください。`, `Cartons and weight are recalculated for the current quantity with the same packing as ${baseT} (${f(B.per)} per carton${B.kg ? ", " + f(B.kg) + " kg" : ""}): ${f(q)} ÷ ${f(B.per)} = ${ctn} cartons${gw ? ", G.W. " + f(B.kg) + " kg × " + ctn + " = " + gw.toFixed(1) + " kg (approx.)" : ""}. The sample product has no dimensions table; check against the actual packing.`, `箱数・重量按与${baseT}相同的入数（每箱 ${f(B.per)}${u}${B.kg ? "・" + f(B.kg) + "kg" : ""}）根据当前数量重新计算：${f(q)}${u} ÷ ${f(B.per)} ＝ ${ctn}箱${gw ? "，毛重 " + gw.toFixed(1) + "kg（概算）" : ""}。示例商品没有尺寸表，请按实际包装确认。`, `Las cajas y el peso se recalculan con el mismo embalaje que ${baseT} (${f(B.per)} por caja${B.kg ? ", " + f(B.kg) + " kg" : ""}): ${f(q)} ÷ ${f(B.per)} = ${ctn} cajas${gw ? ", P.B. " + gw.toFixed(1) + " kg (aprox.)" : ""}. Compruébelo con el embalaje real.`))}</span>`;
    };
    try {
        if (typeof v54docSrcNote === "function") {
            const o = v54docSrcNote;
            v54docSrcNote = function (S) {
                try {
                    if (demoNow() && String((W.__poDocK) || "pi") === "pl") {
                        samplePl(S);
                        const n = samplePlNote(S);
                        if (n)
                            return n;
                    }
                }
                catch (e) {
                    warn("srcNote", e);
                }
                return o.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("srcNote-wrap", e);
    }
    const UNIT_EN = (S) => {
        try {
            const u = String((typeof v61dlUnit === "function" ? v61dlUnit(S && S.qty) : "") || "").replace(/（.*$/, "");
            if (!u)
                return "";
            if (/^[A-Za-z]+$/.test(u))
                return u;
            const X = Object.assign({ 台: "units", 個: "pcs", 本: "bottles", 袋: "bags", 箱: "boxes", 枚: "sheets", 缶: "cans", 瓶: "bottles", セット: "sets", 着: "pcs", 点: "pcs", 足: "pairs", 脚: "pcs", 冊: "copies", 巻: "rolls", kg: "kg" }, (typeof V85UNIT !== "undefined" && V85UNIT) || {});
            return X[u] || "";
        }
        catch (e) {
            return "";
        }
    };
    try {
        if (typeof v68trPlFill === "function") {
            const o = v68trPlFill;
            v68trPlFill = function (S) {
                const r = o.apply(this, arguments);
                try {
                    const ue = UNIT_EN(S), ex = S && S.docRows && S.docRows.plEx;
                    if (ue && ue !== "pcs" && Array.isArray(ex))
                        ex.forEach((x) => { if (Array.isArray(x) && x[0] === "Packing" && / pcs \/ carton/.test(String(x[1])))
                            x[1] = String(x[1]).replace(/ pcs \/ carton/, " " + ue + " / carton"); });
                }
                catch (e) {
                    warn("plUnit", e);
                }
                return r;
            };
        }
    }
    catch (e) {
        warn("plFill-wrap", e);
    }
    const isSeed = (S) => { try {
        return (typeof SHIPS !== "undefined" && Array.isArray(SHIPS)) && SHIPS.some((c) => c && c.ship === S && c.seed);
    }
    catch (e) {
        return false;
    } };
    const etdProv = (S) => {
        try {
            if (!S || S.poNo || isMihon(S) || isSeed(S) || S.v92etdUser)
                return false;
            const b = document.getElementById("v92r5a-etd");
            if (b && dd() && dd().ship === S)
                return /^1\|/.test(String(b.getAttribute("data-sig") || ""));
            return !(S.etd && /^\d{4}-\d{2}-\d{2}/.test(String(S.etd)));
        }
        catch (e) {
            return false;
        }
    };
    try {
        if (typeof v85docParties === "function") {
            const o = v85docParties;
            v85docParties = function (F) {
                const P = o.apply(this, arguments);
                try {
                    const S = (F && F.ship) || null;
                    if (P && S && etdProv(S))
                        P.etd = "";
                }
                catch (e) {
                    warn("parties", e);
                }
                return P;
            };
        }
    }
    catch (e) {
        warn("parties-wrap", e);
    }
    const ctnOf = (S) => {
        try {
            const R = S && S.docRows, L = R && Array.isArray(R.plRows) ? R.plRows : [];
            let n = 0;
            L.forEach((r) => { const m = String((r && r[2]) || "").match(/(\d[\d,]*)\s*CTN/i); if (m)
                n += parseInt(m[1].replace(/,/g, ""), 10) || 0; });
            return n;
        }
        catch (e) {
            return 0;
        }
    };
    try {
        if (typeof v85docSpec === "function") {
            const o = v85docSpec;
            v85docSpec = function (K, F) {
                const sp = o.apply(this, arguments);
                try {
                    const S = (F && F.ship) || (dd() && dd().ship) || null;
                    const Q = (typeof v85docQ === "function") ? v85docQ() : "";
                    if (sp && S && Q && !S.poNo) {
                        try {
                            if (typeof v68trPlFill === "function")
                                v68trPlFill(S);
                        }
                        catch (e) { }
                        samplePl(S);
                        const n = ctnOf(S);
                        const mk = String(S.marks || "").trim();
                        if (K === "SHIP_MARK" && Array.isArray(sp.sec))
                            sp.sec.forEach((r) => { if (Array.isArray(r) && r[0] === "Case No." && n > 0 && String(r[1]).indexOf(Q) >= 0)
                                r[1] = "C/No. 1 - " + n; });
                        if (K === "SI" && Array.isArray(sp.rows) && !mk) {
                            const P = v85docParties(F || { ship: S });
                            const main = P && P.cons ? String(P.cons).replace(/[^A-Za-z ]/g, "").split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 4).toUpperCase() : "";
                            if (main && P.pod && !/[\u3040-\u30ff\u3400-\u9fff]/.test(String(P.pod)) && n > 0)
                                sp.rows.forEach((r) => { if (Array.isArray(r) && r[1] === "marks" && r[2] === Q)
                                    r[2] = main + " / " + P.pod + " / C/No. 1 - " + n; });
                        }
                        if (K === "CO_GEN" && Array.isArray(sp.rows))
                            sp.rows.forEach((r) => { if (Array.isArray(r) && r[1] === "route" && typeof r[2] === "string" && /→\s*(\(|$)/.test(r[2]))
                                r[2] = r[2].replace(/→\s*/, "→ " + Q + " ").trim(); });
                    }
                }
                catch (e) {
                    warn("spec", e);
                }
                return sp;
            };
        }
    }
    catch (e) {
        warn("spec-wrap", e);
    }
    const etdCell = () => {
        try {
            const o = document.getElementById("dO");
            const doc = o && o.querySelector(".doc");
            const S = dd() && dd().ship;
            if (!doc || !S || !etdProv(S))
                return;
            const Q = "[To be confirmed]";
            doc.querySelectorAll(".dl").forEach((dl) => {
                const c = Array.from(dl.children);
                for (let i = 0; i + 1 < c.length; i++) {
                    if (String(c[i].textContent || "").trim() !== "ETD / ETA")
                        continue;
                    const v = c[i + 1];
                    if (v.querySelector("*") || String(v.textContent || "").trim() === Q)
                        continue;
                    v.textContent = Q;
                    v.setAttribute("data-noi18n", "1");
                    v.setAttribute("lang", "en");
                    v.title = M("出港の予定日がまだ入っていないため、仮の日は載せていません（「受注内容を編集」で入れると、その日が入ります）", "No planned sailing date yet, so the provisional date is not shown (enter it in “Edit order details”)", "尚未填写预定出港日，因此不显示暂定日期", "Aún no hay fecha de salida prevista; no se muestra la fecha provisional");
                }
            });
        }
        catch (e) {
            warn("etdCell", e);
        }
    };
    try {
        if (typeof v33CkQuote === "function") {
            const o = v33CkQuote;
            v33CkQuote = function () {
                let F = o.apply(this, arguments);
                try {
                    if (!Array.isArray(F))
                        return F;
                    const S = dd() && dd().ship;
                    const k = String(W.__poDocK || "pi");
                    const o2 = document.getElementById("dO");
                    const txt = o2 ? String(o2.textContent || "") : "";
                    const hasVal = /Validity\s*\d+\s*days|有効期限[:：]?\s*\d/.test(txt) || !!(S && S.docRows && Array.isArray(S.docRows.ex) && S.docRows.ex.some((r) => r && /^Validity/i.test(String(r[0])) && /\d/.test(String(r[1]))));
                    if (k !== "pi" || hasVal)
                        F = F.filter((x) => !(x && x.t === "見積の有効期限を本文に書くと安心です"));
                    if (k === "pl" && S && !S.poNo && !demoNow()) {
                        const ex = (S.docRows && Array.isArray(S.docRows.plEx)) ? S.docRows.plEx : [];
                        const cs = ex.find((r) => Array.isArray(r) && r[0] === "Carton size");
                        const miss = !cs || !String(cs[1] || "").trim() || /^[—\-–]$|要入力/.test(String(cs[1]).trim());
                        const T = M("梱包明細の Carton size（外装の寸法）が未入力です", "Carton size on the packing list is not entered", "装箱单的 Carton size（外箱尺寸）未填写", "Falta el tamaño de la caja en la lista de empaque");
                        if (miss && !F.some((x) => x && x.t === T))
                            F.push({ lv: "yel", t: T, how: M("商品情報の「② 価格表・寸法」の寸法表に外装のサイズ（縦×横×高さ）を入れると、梱包明細の Carton size と容積に入ります", "Enter the carton dimensions in the product's dimensions table (② Price list & dimensions); they fill Carton size and Volume", "在商品信息“② 价格表・尺寸”的尺寸表中填写外箱尺寸后，将写入装箱单", "Introduzca las dimensiones de la caja en la tabla de dimensiones del producto"), go: () => { try {
                                    go("item");
                                }
                                catch (e) { } } });
                    }
                    const ord = { red: 0, yel: 1, blu: 2 };
                    F.sort((a, b) => ord[a.lv] - ord[b.lv]);
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
        if (typeof dashAgg === "function") {
            const o = dashAgg;
            dashAgg = function () {
                const A = o.apply(this, arguments);
                try {
                    if (A && Array.isArray(A.funnel) && !A.v92r7aFun) {
                        let adj = 0;
                        for (let i = A.funnel.length - 2; i >= 0; i--) {
                            const a = A.funnel[i], b = A.funnel[i + 1];
                            if (Array.isArray(a) && Array.isArray(b) && (+b[1] || 0) > (+a[1] || 0)) {
                                A.funnel[i] = [a[0], +b[1] || 0].concat(a.slice(2));
                                adj++;
                            }
                        }
                        A.v92r7aFun = { adj };
                    }
                }
                catch (e) {
                    warn("funnel", e);
                }
                return A;
            };
        }
    }
    catch (e) {
        warn("agg2-wrap", e);
    }
    try {
        if (typeof vDash === "function") {
            const o = vDash;
            vDash = function () {
                let h = o.apply(this, arguments);
                try {
                    if (typeof h !== "string")
                        return h;
                    h = h.replace("（先方の希望価格だけの記録は入りません）", M("（先方の希望価格だけの記録や、それを仮に入れただけの見積書の下書き、数量・港・日付だけを直した書類は入りません。確定単価を入れるか、状況を「見積提示」にすると入ります）", "（先方の希望価格だけの記録は入りません）", "（先方の希望価格だけの記録は入りません）", "（先方の希望価格だけの記録は入りません）"));
                    const A = dashAgg(dashScopeUnits());
                    if (A && A.v92baseQ) {
                        h = h.replace(/（(\d+)件のうち金額のある (\d+)件の合計）/, (m, a, b) => M(`（見本の決まった数 ${A.v92baseQ}件＋ご自分で足した ${a}件のうち金額のある ${b}件の合計）`, m, m, m))
                            .replace(/ \(total of (\d+) of (\d+) with an amount\)/, (m, b, a) => ` (fixed sample figures: ${A.v92baseQ} + ${b} of your ${a} with an amount)`);
                    }
                    if (A && A.v92r7aFun && A.v92r7aFun.adj) {
                        const fn = h.indexOf('id="v73fnote"');
                        const b = fn >= 0 ? h.indexOf("</p>", fn) : -1;
                        if (b > fn)
                            h = h.slice(0, b) + `<span data-noi18n>${E(M("前の段を通らずに先へ進んだ案件（商談の記録が無いまま見積・受注になった相手など）は、通った段として前の段にも数えています（通過率が 100% を超えないようにするため）。", " Cases that moved ahead without passing an earlier stage are also counted in the earlier stages, so no rate exceeds 100%.", "未经过前一阶段而前进的案件，也计入前面的阶段（使通过率不超过 100%）。", " Los casos que avanzaron sin pasar por una etapa anterior también se cuentan en ella."))}</span>` + h.slice(b);
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
    const repFix = () => {
        try {
            if (typeof cur === "undefined" || cur !== "deal")
                return;
            const st = document.querySelector(".stage") || document.getElementById("well") || document.body;
            const cards = Array.from(st.querySelectorAll(".c"));
            const c = cards.find((x) => { const l = x.querySelector(":scope > p.lbl"); return l && /^同じ相手との再商談$/.test(String(l.textContent || "").trim()); });
            if (!c)
                return;
            const cnt = {};
            fbList().forEach((f) => { if (isObj(f) && f.b) {
                const k = norm(f.b);
                cnt[k] = (cnt[k] || 0) + 1;
            }
            else if (Array.isArray(f) && f[1]) {
                const k = norm(f[1]);
                cnt[k] = (cnt[k] || 0) + 1;
            } });
            const n = Object.keys(cnt).filter((k) => cnt[k] >= 2).length;
            const kv = c.querySelector(".kv");
            if (!kv || !n)
                return;
            const tn = Array.from(kv.childNodes).find((x) => x.nodeType === 3 && /\d/.test(x.nodeValue || ""));
            if (tn && String(tn.nodeValue).trim() !== String(n))
                tn.nodeValue = String(n);
        }
        catch (e) {
            warn("repFix", e);
        }
    };
    const plNote = () => {
        const o = document.getElementById("dO");
        const old = o ? o.querySelector(".v92r7a-plnote") : null;
        const S = dd() && dd().ship;
        const doc = o ? o.querySelector(".doc") : null;
        if (!o || !doc || !S || !demoNow() || String(W.__poDocK || "pi") !== "pl") {
            if (old)
                old.remove();
            return;
        }
        samplePl(S);
        const h = samplePlNote(S);
        if (!h) {
            if (old)
                old.remove();
            return;
        }
        const sig = String(S.no) + "|" + String(S.qty) + "|" + lang();
        if (old && old.getAttribute("data-sig") === sig)
            return;
        if (old)
            old.remove();
        const p = document.createElement("p");
        p.className = "nn v92r7a-plnote";
        p.setAttribute("data-sig", sig);
        p.style.marginTop = "6px";
        p.innerHTML = h;
        doc.insertAdjacentElement("afterend", p);
    };
    const paint = () => {
        try {
            plNote();
        }
        catch (e) { }
        try {
            paintAsk();
        }
        catch (e) {
            warn("paint", e);
        }
        try {
            etdCell();
        }
        catch (e) { }
        try {
            repFix();
        }
        catch (e) { }
    };
    const paintAsk = () => {
        const st = document.querySelector(".stage") || document.getElementById("stage") || document.body;
        const old = Array.from(document.querySelectorAll('.v92r7a-ask[data-v92r7a-w="doc"]'));
        const S = dd() && dd().ship;
        const onOps = (typeof cur !== "undefined" && cur === "ops");
        const a = (onOps && S) ? askOf(S) : null;
        if (!a) {
            old.forEach((x) => x.remove());
            return;
        }
        const html = askHtml(a, "doc");
        const anchor = document.getElementById("dO") || (st && st.querySelector(".v61dlcase"));
        if (!anchor) {
            old.forEach((x) => x.remove());
            return;
        }
        if (old.length === 1 && old[0].dataset.sig === a.sig && document.body.contains(old[0]))
            return;
        old.forEach((x) => x.remove());
        const d = document.createElement("div");
        d.innerHTML = html;
        const el = d.firstElementChild;
        if (!el)
            return;
        el.dataset.sig = a.sig;
        const bar = st && st.querySelector(".v92f-case");
        if (bar)
            bar.insertAdjacentElement("afterend", el);
        else {
            const card = (anchor.closest && anchor.closest(".c")) || anchor;
            card.insertAdjacentElement("beforebegin", el);
        }
        const fl = document.getElementById("v92r7aFloat");
        if (fl)
            fl.remove();
    };
    API.paint = paint;
    try {
        if (typeof v85docRepaint === "function") {
            const o = v85docRepaint;
            v85docRepaint = function () { const r = o.apply(this, arguments); try {
                setTimeout(paint, 0);
            }
            catch (e) { } return r; };
        }
    }
    catch (e) { }
    try {
        document.addEventListener("click", () => { setTimeout(paint, 350); setTimeout(paint, 1500); }, false);
    }
    catch (e) { }
    try {
        const stl = document.createElement("style");
        stl.id = "v92r7a-css";
        stl.textContent = ".v92r7a-ask{border:1px solid #e0b252;background:#fff8e6;border-radius:10px;padding:10px 12px;margin:8px 0 10px;font-size:12px;line-height:1.6;color:#4a3a10}.v92r7a-ask p{margin:0 0 6px}.v92r7a-ask b{font-weight:600}.v92r7a-float{position:fixed;right:18px;bottom:84px;z-index:9000;max-width:440px;box-shadow:0 8px 28px rgba(0,0,0,.18);border-radius:10px}.v92r7a-float .v92r7a-ask{margin:0}.v92r7a-curh{margin-top:4px;font-size:10.5px}@media (max-width:640px){.v92r7a-float{left:10px;right:10px;bottom:70px;max-width:none}}";
        (document.head || document.documentElement).appendChild(stl);
    }
    catch (e) { }
})();
