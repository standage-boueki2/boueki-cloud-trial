(function () {
    const W = window;
    if (W.__v2192r4b)
        return;
    W.__v2192r4b = 1;
    const API = (W.v92r4b = W.v92r4b || {});
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
        console.warn("[v92r4b] " + k, e);
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
    catch (e) { } return String(s || "").toLowerCase().replace(/\s+/g, ""); };
    const save = () => { try {
        if (typeof saveTen === "function")
            saveTen();
    }
    catch (e) { } };
    const demo = () => { try {
        return typeof isDemoClock === "function" && isDemoClock();
    }
    catch (e) {
        return false;
    } };
    const realScope = (fn) => {
        let ok = false;
        try {
            if (typeof V54D !== "undefined" && V54D && typeof V54D.realClock === "number") {
                V54D.realClock++;
                ok = true;
            }
        }
        catch (e) { }
        const done = () => { if (ok) {
            ok = false;
            try {
                V54D.realClock--;
            }
            catch (e) { }
        } };
        let r;
        try {
            r = fn();
        }
        catch (e) {
            done();
            throw e;
        }
        if (r && typeof r.then === "function") {
            try {
                r.then(done, done);
            }
            catch (e) {
                done();
            }
        }
        else
            done();
        return r;
    };
    try {
        if (typeof openDealForm === "function") {
            const o = openDealForm;
            openDealForm = function () {
                const isDemo = demo();
                const r = o.apply(this, arguments);
                try {
                    if (isDemo && typeof todayISO === "function") {
                        const el = document.getElementById("dfD");
                        if (el && el.value === "2026-08-04") {
                            el.value = todayISO();
                            el.title = M("今日の日付を入れています（見本のデータは 2026年夏ごろの日付です）", "Set to today's date (the sample data is dated around summer 2026)", "已填入今天的日期（示例数据的日期为2026年夏季前后）", "Se puso la fecha de hoy (los datos de muestra son de mediados de 2026)");
                        }
                    }
                }
                catch (e) {
                    warn("dfD", e);
                }
                return r;
            };
        }
        if (typeof dealSave === "function") {
            const o = dealSave;
            dealSave = function () { const a = arguments; return demo() ? realScope(() => o.apply(this, a)) : o.apply(this, a); };
        }
        if (typeof shipCaseNew === "function") {
            const o = shipCaseNew;
            shipCaseNew = function () {
                const a = arguments;
                if (!demo())
                    return o.apply(this, a);
                const c = realScope(() => o.apply(this, a));
                try {
                    if (c && c.ship && !c.ship.date && !c.ship.orderDate && typeof todayISO === "function")
                        c.ship.date = todayISO();
                }
                catch (e) { }
                return c;
            };
        }
        if (typeof dmNow === "function") {
            const o = dmNow;
            dmNow = function () { const a = arguments; return demo() ? realScope(() => o.apply(this, a)) : o.apply(this, a); };
        }
    }
    catch (e) {
        warn("clock", e);
    }
    try {
        if (typeof a30Collect === "function") {
            const o = a30Collect;
            a30Collect = function (R) {
                let allow = null;
                try {
                    if (typeof dashScopeUnits === "function" && typeof v70dashOpenUnit === "function" && typeof v70dashInScope === "function" && typeof TENS !== "undefined") {
                        const L = dashScopeUnits() || [], op = v70dashOpenUnit();
                        if (op && L.length && !v70dashInScope(L, op))
                            allow = L.map((u) => (u && u.i != null) ? TENS[u.i] : null).filter(Boolean);
                    }
                }
                catch (e) {
                    allow = null;
                }
                let out;
                if (allow && allow.length && typeof v30Tens === "function" && typeof v30Ten === "function") {
                    const vt = v30Tens, v1 = v30Ten, A = allow;
                    const cos = A.map((t) => t.co || "").filter((c, i, a) => a.indexOf(c) === i);
                    try {
                        v30Tens = function () { return (vt() || []).filter((t) => A.indexOf(t) >= 0); };
                        cos.forEach((co) => {
                            v30Ten = function () { return { co, src: "upload", v92r4bFake: 1 }; };
                            const part = o.call(this, R);
                            Object.keys(part || {}).forEach((k) => { const L = (part[k] || []).filter((x) => x && Object.prototype.hasOwnProperty.call(x, "item")); if (!out)
                                out = {}; out[k] = (out[k] || []).concat(L); });
                        });
                    }
                    finally {
                        v30Tens = vt;
                        v30Ten = v1;
                    }
                    if (out) {
                        Object.keys(out).forEach((k) => out[k].sort((a, c) => c.at - a.at));
                        out.v92r4bScoped = 1;
                    }
                    else
                        out = o.apply(this, arguments);
                }
                else
                    out = o.apply(this, arguments);
                try {
                    if (out && Array.isArray(out.appr))
                        out.appr = out.appr.filter((x) => !(x && /直接連絡/.test(String(x.how || "")) && /^商談の記録（\d{4}-\d\d-\d\d）/.test(String(x.txt || ""))));
                }
                catch (e) { }
                return out;
            };
        }
    }
    catch (e) {
        warn("a30", e);
    }
    try {
        if (typeof v61dlCaseListHtml === "function") {
            const o = v61dlCaseListHtml;
            v61dlCaseListHtml = function (rec) {
                let h = o.apply(this, arguments);
                try {
                    const s = v61dlSumOf(rec);
                    if (h && s && s.dq != null && s.rem < 0) {
                        const over = v61dlQtyTxt(-s.rem, s.u), dq = v61dlQtyTxt(s.dq, s.u), sum = v61dlQtyTxt(s.sum, s.u);
                        const t = M(`合計 ${sum}（商談の記録の ${dq} より ${over} 多い）`, `Total ${sum} (${over} more than the ${dq} in the meeting record)`, `合计 ${sum}（比商谈记录的 ${dq} 多 ${over}）`, `Total ${sum} (${over} más que los ${dq} del registro)`);
                        h = String(h).replace(/(<b class="v61dlsum">)[\s\S]*?(<\/b>)/, (m, a, b) => a + E(t) + b);
                    }
                }
                catch (e) {
                    warn("dlsum", e);
                }
                return h;
            };
        }
    }
    catch (e) {
        warn("dl", e);
    }
    const hidStore = () => { const t = ten(); if (t) {
        if (!Array.isArray(t.v92r4bHid))
            t.v92r4bHid = [];
        return t.v92r4bHid;
    } W.__v92r4bHid = W.__v92r4bHid || []; return W.__v92r4bHid; };
    const hidRead = () => { const t = ten(); return (t ? t.v92r4bHid : W.__v92r4bHid) || []; };
    const hidKeysOf = (r) => { const nm = norm(r.name || (r.base && r.base.co) || ""), c = r.cty || (r.base && r.base.cty) || ""; const K = [String(r.key || "")]; if (nm) {
        K.push("nm:" + nm + "|" + c);
        K.push("nm:" + nm + "|");
    } if (r.my && r.my.id)
        K.push("my:" + r.my.id); return K.filter((k, i) => k && K.indexOf(k) === i); };
    const unhide = (test) => { try {
        const t = ten();
        const L = hidRead();
        if (!L.length)
            return;
        const N = L.filter((h) => !test(h));
        if (N.length !== L.length) {
            if (t)
                t.v92r4bHid = N;
            else
                W.__v92r4bHid = N;
            save();
        }
    }
    catch (e) { } };
    try {
        if (typeof b30Collect === "function") {
            const o = b30Collect;
            b30Collect = function () {
                const L = o.apply(this, arguments);
                try {
                    const H = hidRead();
                    if (!H.length || !Array.isArray(L))
                        return L;
                    const set = {};
                    H.forEach((h) => (h.k || []).forEach((k) => { set[k] = 1; }));
                    return L.filter((r) => !(r && !r.my && set[String(r.key)]));
                }
                catch (e) {
                    return L;
                }
            };
        }
        if (typeof b30Remove === "function") {
            const o = b30Remove;
            b30Remove = function (key) {
                let r0 = null, keys = [], nm = "";
                try {
                    r0 = b30Find(key);
                    if (r0) {
                        keys = hidKeysOf(r0);
                        nm = r0.name || "";
                    }
                }
                catch (e) { }
                const had = !!(r0 && ((r0.fbs && r0.fbs.length) || (r0.ths && r0.ths.length) || (r0.logs && r0.logs.length)));
                const r = o.apply(this, arguments);
                try {
                    if (r0 && had) {
                        let still = null, gone = false;
                        try {
                            const L = b30Collect();
                            still = L.find((x) => keys.indexOf(String(x.key)) >= 0) || null;
                            gone = !L.some((x) => x.key === key && x.my);
                        }
                        catch (e) { }
                        if (gone && still) {
                            hidStore().push({ k: keys, n: nm, at: Date.now() });
                            save();
                            try {
                                render();
                            }
                            catch (e) { }
                            try {
                                toast(M(`「${nm}」を一覧から外しました（商談の記録・やりとりは残っています。ゴミ箱から元に戻せます）`, `Removed "${nm}" from the list (its meeting records and messages are kept; you can restore it from Trash)`, `已将「${nm}」从列表中移除（商谈记录和往来仍保留，可从回收站恢复）`, `Se quitó "${nm}" de la lista (sus registros y mensajes se conservan; puede restaurarlo desde la Papelera)`));
                            }
                            catch (e) { }
                        }
                    }
                }
                catch (e) {
                    warn("b30rm", e);
                }
                return r;
            };
        }
        if (typeof V33TR !== "undefined" && V33TR && V33TR.restore && typeof V33TR.restore.myb === "function") {
            const o = V33TR.restore.myb;
            V33TR.restore.myb = function (e) {
                const r = o.apply(this, arguments);
                try {
                    const b = e && e.data && e.data.b;
                    if (b && r !== false) {
                        const nm = norm(b.co || b.name || "");
                        unhide((h) => (h.k || []).some((k) => k === "my:" + b.id || (nm && k.indexOf("nm:" + nm + "|") === 0)));
                    }
                }
                catch (x) { }
                return r;
            };
        }
        if (typeof dealSave === "function") {
            const o = dealSave;
            dealSave = function () {
                try {
                    const el = document.getElementById("dfB");
                    const nm = el ? norm(el.value) : "";
                    if (nm)
                        unhide((h) => (h.k || []).some((k) => k.indexOf("nm:" + nm + "|") === 0));
                }
                catch (e) { }
                return o.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("hid", e);
    }
    try {
        if (typeof shipEnsure === "function") {
            const o = shipEnsure;
            shipEnsure = function () {
                try {
                    const d = dd();
                    if (d && d.ship && typeof SHIPS !== "undefined" && SHIPS && SHIPS[0] && SHIPS[0].seed && !SHIPS[0].custom && SHIPS._pid === PID && SHIPA !== 0 && SHIPS[SHIPA] && SHIPS[SHIPA].custom) {
                        const s0 = SHIPS[0].ship, fresh = d.ship;
                        if (fresh !== SHIPS[SHIPA].ship && fresh !== s0 && /^（想定）/.test(String(fresh.buyer || "")) && !fresh.poNo && !Object.keys(SHIPS[0].mods || {}).length)
                            SHIPS[0].ship = fresh;
                    }
                }
                catch (e) {
                    warn("seed", e);
                }
                const r = o.apply(this, arguments);
                try {
                    const t = ten();
                    if (t && (t.src === "upload" || t.src === "sample2") && Array.isArray(t.targets) && t.targets.length && typeof SHIPS !== "undefined" && SHIPS && SHIPS[0] && SHIPS[0].seed && !SHIPS[0].custom && SHIPA !== 0 && !Object.keys(SHIPS[0].mods || {}).length) {
                        const s0 = SHIPS[0].ship;
                        if (s0 && /^（想定）/.test(String(s0.buyer || "")) && !s0.poNo && t.targets.indexOf(s0.country) < 0 && typeof tenantToD === "function" && !API._seedBusy) {
                            API._seedBusy = 1;
                            try {
                                const f = tenantToD(t);
                                if (f && f.ship && /^（想定）/.test(String(f.ship.buyer || "")) && t.targets.indexOf(f.ship.country) >= 0) {
                                    Object.keys(s0).forEach((k) => { if (/^v\d/.test(k) && f.ship[k] === undefined)
                                        f.ship[k] = s0[k]; });
                                    SHIPS[0].ship = f.ship;
                                }
                            }
                            finally {
                                API._seedBusy = 0;
                            }
                        }
                    }
                }
                catch (e) {
                    warn("seed2", e);
                }
                return r;
            };
        }
    }
    catch (e) {
        warn("ship", e);
    }
    try {
        if (typeof l30Events === "function") {
            const o = l30Events;
            l30Events = function () {
                const L = o.apply(this, arguments);
                try {
                    (L || []).forEach((e) => { if (e && e.src === "直接連絡" && /：送信「商談の記録（\d{4}-/.test(String(e.txt || ""))) {
                        e.txt = String(e.txt).replace("：送信「商談の記録（", "：" + M("記録", "Logged", "记录", "Registro") + "「商談の記録（");
                        e.src = "商談記録";
                    } });
                }
                catch (e) { }
                return L;
            };
        }
    }
    catch (e) {
        warn("l30", e);
    }
    try {
        if (typeof dashAgg === "function") {
            const o = dashAgg;
            dashAgg = function () {
                const A = o.apply(this, arguments);
                try {
                    if (A && Array.isArray(A.quotes) && A.quotes.length && typeof v68CaseByNo === "function") {
                        const isCopy = (q) => { try {
                            const c = v68CaseByNo(q.no);
                            const S = c && c.ship;
                            return !!(S && S.v54copy && !S.poNo);
                        }
                        catch (e) {
                            return false;
                        } };
                        const keep = A.quotes.filter((q) => !isCopy(q));
                        A.v92r4bDraft = A.quotes.length - keep.length;
                        if (A.v92r4bDraft) {
                            A.quotes = keep;
                            A.qmoney = (typeof dashMoney === "function") ? dashMoney(keep) : A.qmoney;
                        }
                    }
                }
                catch (e) {
                    warn("agg", e);
                }
                return A;
            };
        }
        if (typeof vDash === "function") {
            const o = vDash;
            vDash = function () {
                let h = o.apply(this, arguments);
                try {
                    const A = dashAgg(dashScopeUnits());
                    const n = (A && A.v92r4bDraft) || 0;
                    if (n && typeof h === "string") {
                        const a = h.indexOf('id="v68qkd">'), b = a >= 0 ? h.indexOf("</div>", a) : -1;
                        if (b > a) {
                            const t = M(`ほかに、見積書の下書き ${n}件（数量・単価が見本の案件から写した値のまま）は、金額に入れていません`, `${n} draft quote(s) whose quantity and unit price are still copied from the sample case are not included`, `另有 ${n} 份报价草稿（数量和单价仍是从示例案件复制的值）未计入金额`, `Además hay ${n} borrador(es) de cotización con cantidad y precio copiados del caso de muestra; no se incluyen`);
                            h = h.slice(0, b) + `<br><span class="nn v92r4b-draft" data-noi18n style="margin:0">${E(t)}</span>` + h.slice(b);
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
        warn("quote", e);
    }
    try {
        if (typeof v90anaDashNotes === "function") {
            const o = v90anaDashNotes;
            v90anaDashNotes = function () {
                let h = o.apply(this, arguments);
                try {
                    if (typeof h === "string")
                        h = h.replace("（まだ相手に送っていない下書きも入ります。件数は商談の記録、金額は見積書から数えるので、0件でも金額が出ることがあります）", "（まだ相手に送っていない下書きも入ります。ただし、数量・単価が見本の案件から写した値のままの下書きは入れません。件数は商談の記録、金額は見積書から数えるので、0件でも金額が出ることがあります）");
                }
                catch (e) { }
                return h;
            };
        }
    }
    catch (e) {
        warn("dnote", e);
    }
    const tableInco = () => {
        try {
            const d = dd() || {}, t = ten() || {};
            const S = [];
            const add = (x) => { if (x == null)
                return; if (Array.isArray(x))
                x.forEach(add);
            else if (typeof x === "string")
                S.push(x); };
            add(d.priceRows);
            add(d.priceHead);
            add(d.priceHdr);
            add(d.priceNote);
            add(t.priceRows);
            add(t.priceHead);
            add(t.priceNote);
            add(t.price);
            const found = {};
            const re = /(?:^|[^A-Za-z])(EXW|FCA|CPT|CIP|DAP|DPU|DDP|FAS|FOB|CFR|CIF|C&F|CNF)(?![A-Za-z])/gi;
            S.forEach((s) => { const u = String(s).normalize("NFKC"); let m; re.lastIndex = 0; while ((m = re.exec(u))) {
                const c = v56dIncoCode(m[1]);
                if (c)
                    found[c] = 1;
            } });
            const K = Object.keys(found);
            return K.length === 1 ? K[0] : "";
        }
        catch (e) {
            return "";
        }
    };
    API.tableInco = tableInco;
    try {
        if (typeof v56dCmp === "function") {
            const o = v56dCmp;
            v56dCmp = function () {
                const c = o.apply(this, arguments);
                try {
                    if (c) {
                        const ti = tableInco();
                        if (ti && c.ot && ti !== c.ot) {
                            c.v92r4bProdInco = c.ot;
                            c.ot = ti;
                        }
                        else if (ti && !c.ot)
                            c.ot = ti;
                    }
                }
                catch (e) { }
                return c;
            };
        }
        const noteOf = (c) => (c && c.v92r4bProdInco) ? M(`自社の価格表は ${c.ot} の価格です（価格表に書いてある建値。商品情報の建値は ${c.v92r4bProdInco} ですが、価格表の金額は ${c.ot} のままです）。`, `Your price list is in ${c.ot} terms (as written on the list; the product's trade term is set to ${c.v92r4bProdInco}, but the listed prices are still ${c.ot}).`, `贵司价格表是 ${c.ot} 价格（价格表上写明的贸易条件。商品信息的贸易条件为 ${c.v92r4bProdInco}，但价格表金额仍为 ${c.ot}）。`, `Su lista de precios está en ${c.ot} (según la lista; el término del producto es ${c.v92r4bProdInco}, pero los precios siguen en ${c.ot}).`) : "";
        if (typeof v56dCmpHtml === "function") {
            const o = v56dCmpHtml;
            v56dCmpHtml = function (c) { let h = o.apply(this, arguments); try {
                const n = noteOf(c);
                if (n && h)
                    h += `<br><span class="nn" data-noi18n style="margin:0">${E(n)}</span>`;
            }
            catch (e) { } return h; };
        }
        if (typeof v56dCmpPlain === "function") {
            const o = v56dCmpPlain;
            v56dCmpPlain = function (c) { let h = o.apply(this, arguments); try {
                const n = noteOf(c);
                if (n && h)
                    h += "\n" + n;
            }
            catch (e) { } return h; };
        }
    }
    catch (e) {
        warn("cmp", e);
    }
    try {
        if (typeof V33TR !== "undefined" && V33TR && V33TR.restore) {
            V33TR.restore.src = function (e) {
                try {
                    const x = e && e.data && e.data.x;
                    if (!x)
                        return false;
                    const L = srcList();
                    if (L.some((y) => y && ((x.id && y.id === x.id) || (!x.id && y.name === x.name))))
                        return true;
                    const i = Math.max(0, Math.min(L.length, +e.data.i || 0));
                    L.splice(i, 0, x);
                    srcSave();
                    try {
                        render();
                    }
                    catch (z) { }
                    return true;
                }
                catch (z) {
                    return false;
                }
            };
            if (V33TR.label && !V33TR.label.src)
                V33TR.label.src = "取り込んだ情報";
        }
        window.addEventListener("click", (ev) => {
            try {
                const b = ev.target && ev.target.closest ? ev.target.closest("[data-srcdel]") : null;
                if (!b || b.dataset.r3aok)
                    return;
                const idx = +b.dataset.srcdel;
                const x = (typeof srcList === "function") ? srcList()[idx] : null;
                if (!x || typeof v33TrashPut !== "function" || typeof V33TR === "undefined")
                    return;
                let js = "";
                try {
                    js = JSON.stringify(x);
                }
                catch (e) {
                    js = "";
                }
                if (!js || js.length > 300000)
                    return;
                const nm = String(x.name || "");
                const ok = window.confirm(M(`「${nm}」を、取り込んだ情報から削除しますか？\n\n・AI商社マンの参照から外れます\n・ゴミ箱に入ります（30日以内なら「ゴミ箱」から元に戻せます）\n・登録済みの商品情報は消えません`, `Delete "${nm}" from Imported sources?\n\n- The AI agent will stop referring to it\n- It goes to Trash (you can restore it within 30 days)\n- Registered product information is not deleted`, `要从“已导入的信息”中删除「${nm}」吗？\n\n・AI 将不再参考它\n・会放入回收站（30天内可恢复）\n・已登记的商品信息不会被删除`, `¿Eliminar "${nm}" de la información importada?\n\n- El agente dejará de consultarlo\n- Va a la Papelera (se puede restaurar en 30 días)\n- La información del producto registrada no se borra`));
                if (!ok) {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                    ev.stopPropagation();
                    return;
                }
                b.dataset.r3aok = "1";
                const tid = v33TrashPut("src", x.id || nm, M("取り込んだ情報：", "Imported source: ", "已导入的信息：", "Fuente importada: ") + nm, { x: JSON.parse(js), i: idx });
                try {
                    if (typeof V33AU_ACT !== "undefined" && V33AU_ACT && V33AU_ACT.src_del && typeof v33AuLog === "function")
                        v33AuLog("src_del", nm);
                }
                catch (e) { }
                setTimeout(() => { try {
                    if (tid && typeof v33Undo === "function")
                        v33Undo(M(`「${nm}」をゴミ箱に移しました`, `Moved "${nm}" to Trash`, `已将「${nm}」移入回收站`, `"${nm}" se movió a la Papelera`), () => { v33TrashRestore(tid); }, 10000);
                }
                catch (e) { } }, 60);
            }
            catch (e) {
                warn("srcdel", e);
            }
        }, true);
    }
    catch (e) {
        warn("src", e);
    }
})();
(function () {
    const W = window;
    if (W.__v2192r4b2)
        return;
    W.__v2192r4b2 = 1;
    const API = (W.v92r4b = W.v92r4b || {});
    const M = API.M || ((ja) => ja);
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const warn = (k, e) => { try {
        console.warn("[v92r4b] " + k, e);
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
    const dict = (ja, en, zh, es) => { try {
        if (typeof I18N === "undefined" || !I18N || !I18N.dict)
            return;
        const DI = I18N.dict;
        if (DI.en && DI.en[ja] == null)
            DI.en[ja] = en;
        if (DI.zh && DI.zh[ja] == null)
            DI.zh[ja] = zh || en;
        if (DI.es && DI.es[ja] == null)
            DI.es[ja] = es || en;
    }
    catch (e) { } };
    API.dict = dict;
    dict("メンバーの招待・担当する商品の割り当て・役割の変更・停止・削除。すべての商品と案件を扱えます", "Invite members, assign products, change roles, suspend and delete. Can work on every product and case", "邀请成员、分配负责的商品、更改角色、停用和删除。可处理所有商品和案件", "Invitar miembros, asignar productos, cambiar roles, suspender y eliminar. Puede trabajar en todos los productos y casos");
    dict("担当する商品の案件を見る・やりとりに投稿する（担当する商品は、招待のときに管理者が選びます）", "View the cases of the assigned products and post messages (the admin chooses the assigned products when inviting)", "查看所负责商品的案件并在往来中发言（负责的商品由管理员在邀请时选择）", "Ver los casos de los productos asignados y publicar mensajes (el administrador elige los productos al invitar)");
    const hasWork = () => {
        try {
            const L = (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS : [];
            const wk = (t) => !!t && (t.src === "upload" || t.src === "sample2") && (((Array.isArray(t.fbx) ? t.fbx.length : 0) > 0) || (t.dmThreads && Object.keys(t.dmThreads).length > 0) || (Array.isArray(t.myBuyers) && t.myBuyers.length > 0));
            if (L.some(wk))
                return true;
            const t = ten(), d = dd();
            return !!(t && (t.src === "upload" || t.src === "sample2") && d && Array.isArray(d.fb) && d.fb.length);
        }
        catch (e) {
            return false;
        }
    };
    API.hasWork = hasWork;
    try {
        if (typeof showWelcome === "function") {
            const o = showWelcome;
            showWelcome = function () {
                try {
                    if (!(typeof SES !== "undefined" && SES && (SES.role === "fwd" || SES.t === "fwd" || SES.t === "admin")) && hasWork()) {
                        try {
                            if (SES && SES.code)
                                localStorage.setItem("bc20_wel_" + SES.code, "1");
                        }
                        catch (e) { }
                        const home = () => { try {
                            if (typeof cur !== "undefined" && cur === "up" && !document.getElementById("welv")) {
                                if (W.RDX && typeof W.RDX.goKey === "function")
                                    W.RDX.goKey("dash:home");
                                else
                                    go("dash");
                            }
                        }
                        catch (e) { } };
                        let touched = false;
                        const mark = () => { touched = true; };
                        try {
                            window.addEventListener("pointerdown", mark, { capture: true, once: true });
                            window.addEventListener("keydown", mark, { capture: true, once: true });
                        }
                        catch (e) { }
                        [60, 600, 1500].forEach((ms) => setTimeout(() => { if (!touched)
                            home(); }, ms));
                        return;
                    }
                }
                catch (e) {
                    warn("wel", e);
                }
                return o.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("welcome", e);
    }
    try {
        let touched0 = false;
        const mark0 = () => { touched0 = true; };
        try {
            window.addEventListener("pointerdown", mark0, { capture: true, once: true });
            window.addEventListener("keydown", mark0, { capture: true, once: true });
        }
        catch (e) { }
        const fixBoot = () => {
            try {
                if (touched0)
                    return;
                if (typeof SES === "undefined" || !SES || SES.t !== "trial" || SES.role === "fwd")
                    return;
                if (document.body.classList.contains("locked") || !hasWork())
                    return;
                const v = document.getElementById("welv");
                if (v) {
                    try {
                        if (SES.code)
                            localStorage.setItem("bc20_wel_" + SES.code, "1");
                    }
                    catch (e) { }
                    v.remove();
                }
                if (!API._bootHome && typeof cur !== "undefined" && cur === "up" && !document.getElementById("v1811ov")) {
                    API._bootHome = 1;
                    if (W.RDX && typeof W.RDX.goKey === "function")
                        W.RDX.goKey("dash:home");
                    else
                        go("dash");
                }
            }
            catch (e) {
                warn("boot", e);
            }
        };
        [0, 300, 900, 1800].forEach((ms) => setTimeout(fixBoot, ms));
    }
    catch (e) {
        warn("boot0", e);
    }
    try {
        if (typeof v68ExpMapHtml === "function" && typeof V68_EXP_MAP !== "undefined") {
            const o = v68ExpMapHtml;
            v68ExpMapHtml = function (sheets) {
                let h = o.apply(this, arguments);
                try {
                    const have = Array.from(new Set((sheets || []).map((s) => String((s && s.name) || "")))).filter(Boolean);
                    const keys = V68_EXP_MAP.map((r) => String(r[0]));
                    const key = "成分表・材質表";
                    if (!have.some((x) => x === key || x.indexOf(key) === 0)) {
                        const un = have.filter((x) => !keys.some((k) => x === k || x.indexOf(k) === 0) && /(成分|材質|素材|仕様|機械情報|スペック|原材料).{0,8}表|表$/.test(x) && !/寸法|価格|梱包/.test(x));
                        if (un.length === 1 && typeof h === "string") {
                            const re = /<tr class="v68no"><td>— ([^<]*)<\/td><td>([^<]*(?:商品情報|Product info|商品信息|Información del producto)[^<]*(?:成分|Ingredients|Ingredientes)[^<]*)<span class="nn">[^<]*<\/span><\/td><\/tr>/;
                            h = h.replace(re, (m, a, b) => `<tr class=""><td>✅ ${E(un[0])}</td><td>${b}</td></tr>`);
                        }
                    }
                }
                catch (e) {
                    warn("expmap", e);
                }
                return h;
            };
        }
    }
    catch (e) {
        warn("exp", e);
    }
    const contactOf = (th) => {
        try {
            const id = String((th && th.id) || "");
            if (!/^MY-/.test(id))
                return "";
            const L = [];
            ((typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS : []).concat(ten() ? [ten()] : []).forEach((t) => { if (t && Array.isArray(t.myBuyers))
                t.myBuyers.forEach((b) => L.push(b)); });
            const b = L.find((x) => x && x.id === id);
            let c = String((b && b.contact) || "").normalize("NFKC").trim();
            c = c.split(/[（(／\/,、<]|\s[-–—]\s/)[0].trim();
            if (!/^[A-Za-z][A-Za-z .'\-]{1,38}$/.test(c) || /@/.test(c))
                return "";
            if (/^(purchasing|sales|buyer|team|manager|dept|department)\b/i.test(c))
                return "";
            return c;
        }
        catch (e) {
            return "";
        }
    };
    const dear = (s, nm) => (nm && typeof s === "string") ? s.replace(/Dear Purchasing Team,/g, "Dear " + nm + ",") : s;
    try {
        if (typeof bmOfflineAdvice === "function") {
            const o = bmOfflineAdvice;
            bmOfflineAdvice = function (th) {
                let h = o.apply(this, arguments);
                try {
                    const nm = contactOf(th);
                    if (nm) {
                        h = dear(h, E(nm));
                        if (typeof BM !== "undefined" && BM && typeof BM.lastDraft === "string")
                            BM.lastDraft = dear(BM.lastDraft, nm);
                    }
                }
                catch (e) { }
                return h;
            };
        }
        let prepTh = null;
        if (typeof v72Prep === "function") {
            const o = v72Prep;
            v72Prep = function (id) {
                try {
                    const L = (ten() && ten().dmThreads) || {};
                    prepTh = L[id] || { id };
                }
                catch (e) {
                    prepTh = { id };
                }
                return o.apply(this, arguments);
            };
        }
        if (typeof v72TplDraft === "function") {
            const o = v72TplDraft;
            v72TplDraft = function () {
                const r = o.apply(this, arguments);
                try {
                    const nm = prepTh ? contactOf(prepTh) : "";
                    if (nm && r) {
                        if (typeof r === "string")
                            return dear(r, nm);
                        Object.keys(r).forEach((k) => { if (typeof r[k] === "string")
                            r[k] = dear(r[k], nm); });
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("dear", e);
    }
    try {
        if (typeof vInbox33 === "function") {
            const o = vInbox33;
            vInbox33 = function () {
                let h = o.apply(this, arguments);
                try {
                    if (typeof h === "string" && typeof V33IXV !== "undefined" && V33IXV && V33IXV.f === "reply" && typeof V38 !== "undefined" && V38 && V38.lists && Array.isArray(V38.lists.f)) {
                        const L = V38.lists.f;
                        const parts = h.split('<li class="v38li');
                        if (parts.length === L.length + 1) {
                            for (let i = 0; i < L.length; i++) {
                                const x = L[i];
                                const m = x && x.k === "appr" ? /(?:^|:)th:([^:]+):/.exec(String(x.key || "")) : null;
                                if (!m || !/reply/.test(String(x.key || "").split(":").pop() || ""))
                                    continue;
                                const j = parts[i + 1].indexOf("</li>");
                                if (j < 0)
                                    continue;
                                const row = `<div class="v92r4b-rp" data-noi18n style="margin-top:6px;padding:6px 9px;border-left:3px solid var(--or,#f08300);background:var(--surface-2,#f6f7f9);border-radius:6px;font-size:12.5px"><span>↩ ${E(M("この相手から返事が届いています（まだ返していません）。上の承認とは別に、返事を読んで返信できます。", "This buyer has replied (not answered yet). Apart from the approval above, you can read the reply and answer it.", "该对象已回复（尚未答复）。除上面的批准外，可以阅读回复并作答。", "Este comprador respondió (aún sin contestar). Aparte de la aprobación de arriba, puede leer la respuesta y contestar."))}</span> <button class="btn g" type="button" data-v92r4bth="${E(m[1])}" style="margin-left:6px">${E(M("返事を読んで返信する", "Read the reply and answer", "阅读回复并作答", "Leer y responder"))}</button></div>`;
                                parts[i + 1] = parts[i + 1].slice(0, j) + row + parts[i + 1].slice(j);
                            }
                            h = parts.join('<li class="v38li');
                        }
                    }
                }
                catch (e) {
                    warn("ixreply", e);
                }
                return h;
            };
        }
        document.addEventListener("click", (ev) => {
            try {
                const b = ev.target && ev.target.closest ? ev.target.closest("[data-v92r4bth]") : null;
                if (!b)
                    return;
                ev.preventDefault();
                ev.stopPropagation();
                if (typeof openDMThread === "function")
                    openDMThread(b.getAttribute("data-v92r4bth"));
            }
            catch (e) {
                warn("ixopen", e);
            }
        }, true);
    }
    catch (e) {
        warn("inbox", e);
    }
    try {
        document.addEventListener("focusin", (ev) => {
            try {
                const n = ev.target;
                if (!n || n.id !== "d30ln")
                    return;
                const u = document.getElementById("d30lu");
                const auto = u ? String(u.value || "").replace(/^https?:\/\//, "").slice(0, 60) : "";
                if (auto && n.value === auto)
                    setTimeout(() => { try {
                        n.select();
                    }
                    catch (e) { } }, 0);
            }
            catch (e) { }
        }, true);
    }
    catch (e) {
        warn("d30ln", e);
    }
    const fixRefs = () => {
        try {
            const d = dd();
            if (!d || !Array.isArray(d.tasks) || !Array.isArray(d.fb))
                return;
            let ch = 0;
            d.tasks.forEach((t) => {
                const m = t && typeof t.ref === "string" ? /^商談記録：(.{20})$/.exec(t.ref) : null;
                if (!m)
                    return;
                const f = d.fb.find((r) => r && typeof r.b === "string" && r.b.length > 20 && r.b.slice(0, 20) === m[1]);
                if (f) {
                    t.ref = "商談記録：" + f.b.slice(0, 80);
                    ch++;
                }
            });
            if (ch) {
                try {
                    if (typeof saveTen === "function")
                        saveTen();
                }
                catch (e) { }
            }
        }
        catch (e) { }
    };
    try {
        if (typeof dealSave === "function") {
            const o = dealSave;
            dealSave = function () {
                const r = o.apply(this, arguments);
                try {
                    if (r && typeof r.then === "function")
                        r.then(() => { fixRefs(); try {
                            if (typeof cur !== "undefined" && cur === "task")
                                render();
                        }
                        catch (e) { } }, () => { });
                    else
                        fixRefs();
                }
                catch (e) { }
                return r;
            };
        }
        if (typeof render === "function") {
            const o = render;
            let seen = null;
            render = function () {
                try {
                    const d = dd();
                    if (d && d !== seen) {
                        seen = d;
                        fixRefs();
                    }
                }
                catch (e) { }
                return o.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("refs", e);
    }
    const nonFoodShelf = (t) => !!t && String(t.cat || "").trim() === "文化・教育用品";
    API.nonFoodShelf = () => nonFoodShelf(ten());
    try {
        if (typeof v68hearNeed === "function" && typeof V68H_TX !== "undefined" && V68H_TX && V68H_TX.shelf && V68H_TX.shelf.apparel) {
            const o = v68hearNeed;
            v68hearNeed = function (base, p) {
                const r = o.apply(this, arguments);
                try {
                    if (base && base.k === "shelf" && r && r.n === "賞味期限・保証期間" && nonFoodShelf(p)) {
                        const a = V68H_TX.shelf.apparel;
                        return Object.assign({}, r, { n: a.n, q: a.q, ex: a.ex });
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("shelf", e);
    }
    try {
        if (typeof fwdSituFor === "function") {
            const o = fwdSituFor;
            fwdSituFor = function () {
                const L = o.apply(this, arguments);
                try {
                    const mo = new Date().getMonth() + 1;
                    (L || []).forEach((x) => {
                        if (!x || x.src !== "内蔵" || !(+x.delay > 0))
                            return;
                        const t = String(x.t || "");
                        const m = /(\d{1,2})\s*〜\s*(\d{1,2})月/.exec(t);
                        if (!m)
                            return;
                        const a = +m[1], b = +m[2];
                        if (!(a >= 1 && a <= 12 && b >= 1 && b <= 12))
                            return;
                        const off = a <= b ? (mo < a || mo > b) : (mo < a && mo > b);
                        if (!off)
                            return;
                        const d = +x.delay;
                        x.delay = 0;
                        x.v92r4bOff = d;
                        if (t.indexOf("日数には足していません") < 0)
                            x.t = t + M(`（いまは時期外のため、見込みの +${d}日は所要日数に足していません）`, ` (out of season now, so the expected +${d} days are not added to the transit time)`, `（目前为淡季，预计的 +${d} 天未计入所需天数）`, ` (fuera de temporada: los +${d} días previstos no se suman al tránsito)`);
                    });
                }
                catch (e) { }
                return L;
            };
        }
    }
    catch (e) {
        warn("situ", e);
    }
    try {
        if (typeof openFwdQuote === "function") {
            const o = openFwdQuote;
            openFwdQuote = function () {
                const r = o.apply(this, arguments);
                const fix = () => {
                    try {
                        const pn = document.getElementById("pn") || document.getElementById("dw");
                        if (!pn)
                            return;
                        const tw = document.createTreeWalker(pn, NodeFilter.SHOW_TEXT);
                        let n;
                        while ((n = tw.nextNode())) {
                            const v = String(n.nodeValue || "");
                            if (/時期外/.test(v) && /（\+\d+日見込み）/.test(v))
                                n.nodeValue = v.replace(/（\+(\d+)日見込み）/, (m, d) => M(`（この見積の日数に入っている +${d}日は、見積を組んだ日の見込みです。いまは時期外のため、これから組む見積の日数には足しません）`, ` (the +${d} days in this quote were the estimate on the day it was built; out of season now, so new quotes do not add them)`, `（本报价天数中的 +${d} 天是报价当日的预计。目前为淡季，今后生成的报价不再加算）`, ` (los +${d} días de esta cotización eran la previsión del día en que se generó; ahora fuera de temporada, no se suman en las nuevas)`));
                        }
                    }
                    catch (e) { }
                };
                try {
                    fix();
                    setTimeout(fix, 400);
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("fq", e);
    }
    try {
        if (typeof v56regFillNote === "function" && typeof V56REG_FILL !== "undefined") {
            const o = v56regFillNote;
            v56regFillNote = function () {
                let h = o.apply(this, arguments);
                try {
                    if (typeof h === "string" && typeof SES !== "undefined" && SES && SES.t === "trial") {
                        const key = E(V56REG_FILL.whoP), a = h.indexOf(key);
                        const b = a >= 0 ? h.indexOf("。", a + key.length) : -1;
                        if (a >= 0 && b > a) {
                            const due = h.slice(a + key.length, b);
                            const t = M(`トライアルでは、STANDAGE の担当への調査の依頼は出ていません。国ごとの調査のタスクを「タスク・進行」に入れました（期限の目安：`, `In the trial, no research request has been sent to STANDAGE staff. A research task per country was added to "Tasks" (target dates: `, `试用期间不会向 STANDAGE 负责人发出调查委托。已在“任务・进度”中按国家添加调查任务（期限参考：`, `En la prueba no se envía la solicitud al personal de STANDAGE. Se añadió una tarea por país en "Tareas" (fechas: `)
                                + due + M(`）。「規制を調べる」で自社で確かめられます（STANDAGE への調査の依頼も、その画面から）`, `). You can check them yourself in "Check regulations" (a request to STANDAGE can also be made there)`, `）。可在“调查法规”中自行确认（也可从该页面委托 STANDAGE 调查）`, `). Puede comprobarlo en "Consultar regulaciones" (también puede pedirlo a STANDAGE desde allí)`);
                            h = h.slice(0, a) + `<span data-noi18n>${t}</span>` + h.slice(b);
                            const tr = E(V56REG_FILL.trial);
                            h = h.replace(`<br><span style="color:var(--ink-3);font-size:11px">${tr}</span>`, "");
                        }
                    }
                }
                catch (e) {
                    warn("regfill", e);
                }
                return h;
            };
        }
    }
    catch (e) {
        warn("n23", e);
    }
    try {
        if (typeof v88Sig === "function") {
            const o = v88Sig;
            v88Sig = function () {
                const s = o.apply(this, arguments);
                try {
                    const t = ten();
                    if (t && t.src === "sample" && typeof b30Collect === "function") {
                        const n = (b30Collect() || []).filter((r) => r && ((r.fbs && r.fbs.length) || (r.ths && r.ths.length))).length;
                        if (n > 0 && n < (s.met | 0))
                            s.met = n;
                    }
                }
                catch (e) { }
                return s;
            };
        }
        if (typeof v90goalRealHtml === "function") {
            const o = v90goalRealHtml;
            v90goalRealHtml = function (pl) {
                let h = o.apply(this, arguments);
                try {
                    if (h && pl && pl.per && pl.per.src !== "input" && typeof dashAgg === "function") {
                        const A = dashAgg(dashScopeUnits());
                        const n = (A && A.orders && A.orders.length) || 0;
                        const m = n && typeof dashMoney === "function" ? dashMoney(A.orders) : null;
                        if (n && m && m.jpy > 0 && typeof fmtJPY === "function") {
                            const t = M(`参考：分析・レポートの受注の実績は ${n}件・合計 ${fmtJPY(m.jpy)}（1件あたり 約 ${fmtJPY(Math.round(m.jpy / n))}）です。1社あたりの額を実績に合わせて入れ直すと、必要な社数が変わります（「目標を直す」から）`, `For reference: confirmed orders so far are ${n}, total ${fmtJPY(m.jpy)} (about ${fmtJPY(Math.round(m.jpy / n))} each). Re-entering the per-buyer amount to match changes the number of buyers needed ("Edit the goal")`, `参考：分析报告中的订单实绩为 ${n} 件，合计 ${fmtJPY(m.jpy)}（每件约 ${fmtJPY(Math.round(m.jpy / n))}）。按实绩重新填写每家金额后，所需家数会变化（从“修改目标”）`, `Referencia: pedidos confirmados ${n}, total ${fmtJPY(m.jpy)} (aprox. ${fmtJPY(Math.round(m.jpy / n))} cada uno). Si ajusta el importe por comprador, cambia el número necesario ("Editar el objetivo")`);
                            const key = "1社あたりの取引額が推定・仮の値です。実際の額が大きければ、必要な社数はその分だけ減ります";
                            const keyEn = "The per-buyer amount is an estimate; a larger real amount reduces the buyers needed";
                            const ins = `<br><span class="v92r4b-ref" data-noi18n>${E(t)}</span>`;
                            if (h.indexOf(key) >= 0)
                                h = h.replace(key, key + ins);
                            else if (h.indexOf(keyEn) >= 0)
                                h = h.replace(keyEn, keyEn + ins);
                        }
                    }
                }
                catch (e) {
                    warn("goal", e);
                }
                return h;
            };
        }
    }
    catch (e) {
        warn("rm", e);
    }
})();
