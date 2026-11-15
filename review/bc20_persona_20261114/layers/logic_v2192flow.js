(function () {
    const W = window;
    if (W.__v2192flow)
        return;
    W.__v2192flow = 1;
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
        console.warn("[v92flow] " + k, e);
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
    const isFwd = () => { try {
        return !!(typeof SES !== "undefined" && SES && (SES.role === "fwd" || SES.t === "fwd"));
    }
    catch (e) {
        return false;
    } };
    const isAdmin = () => { try {
        return !!(typeof SES !== "undefined" && SES && SES.t === "admin");
    }
    catch (e) {
        return false;
    } };
    const userTen = (t) => !!(t && (t.src === "upload" || t.src === "sample2"));
    const norm = (s) => { try {
        if (typeof v30Norm === "function")
            return v30Norm(s);
    }
    catch (e) { } return String(s || "").toLowerCase().replace(/\s+/g, ""); };
    const cn = (c) => { try {
        if (typeof cnorm === "function")
            return cnorm(c || "") || String(c || "");
    }
    catch (e) { } return String(c || ""); };
    const BM = () => { try {
        return (typeof BM_ST !== "undefined" && Array.isArray(BM_ST) && BM_ST.length >= 7) ? BM_ST : null;
    }
    catch (e) {
        return null;
    } };
    const stage = (st) => { const B = BM(); return B ? B.indexOf(st) : -1; };
    const short = (st) => { try {
        return (typeof BM_STS !== "undefined" && BM_STS[st]) || st;
    }
    catch (e) {
        return st;
    } };
    const save = (t) => { try {
        if (userTen(t) && typeof saveTen === "function")
            saveTen();
    }
    catch (e) { } };
    const fbList = (t) => { try {
        if (userTen(t))
            return Array.isArray(t.fbx) ? t.fbx : [];
        const d = dd();
        return (d && Array.isArray(d.fb)) ? d.fb : [];
    }
    catch (e) {
        return [];
    } };
    const fbToBm = (st) => { const B = BM(); if (!B)
        return ""; return st === "受注" ? B[5] : (st === "サンプル発送" || st === "サンプル出荷") ? B[2] : st === "見積提示" ? B[3] : st === "商談中" ? B[1] : st === "失注" ? B[6] : B[0]; };
    const fbDay = (f) => String((f && f.d) || "");
    function fbsOf(t, b) {
        if (!t || !b || !b.co)
            return [];
        const k = norm(b.co), c = b.cty ? cn(b.cty) : "";
        return fbList(t).filter((f) => f && !Array.isArray(f) && f.b && norm(f.b) === k && (!c || !f.c || cn(f.c) === c));
    }
    function fbFloor(t, b) {
        const L = fbsOf(t, b).slice().sort((a, c) => fbDay(a).localeCompare(fbDay(c)));
        if (!L.length)
            return null;
        const last = L[L.length - 1];
        if (last.st === "失注")
            return { st: fbToBm("失注"), d: fbDay(last), raw: "失注", lost: 1 };
        let best = null;
        L.forEach((f) => { if (f.st === "失注")
            return; const s = fbToBm(f.st); if (!best || stage(s) > stage(best.st))
            best = { st: s, d: fbDay(f), raw: f.st || "" }; });
        return best;
    }
    const buyerOfTh = (t, th) => { try {
        return (Array.isArray(t.myBuyers) ? t.myBuyers : []).find((x) => x && x.id === th.id) || null;
    }
    catch (e) {
        return null;
    } };
    function setSt(th, st, by, why) {
        if (!th || !st || th.status === st)
            return false;
        th.status = st;
        th.statusAt = Date.now();
        th.statusBy = by;
        th.statusWhy = String(why || "").slice(0, 140);
        th.stLog = (th.stLog || []).concat([{ st, at: Date.now(), by, why: th.statusWhy }]).slice(-12);
        return true;
    }
    const BY_FB = "商談の記録";
    function floorApply(t, th) {
        try {
            if (!BM() || !th || !Array.isArray(th.msgs) || !th.msgs.length)
                return false;
            const b = buyerOfTh(t, th);
            const f = fbFloor(t, b);
            if (!f)
                return false;
            const why = `商談の記録（${f.d}）の状況「${f.raw}」`;
            if (th.v91smp && /^見本/.test(String(th.statusBy || ""))) {
                if (th.status === f.st)
                    return false;
                th.status = f.st;
                if (Array.isArray(th.stLog) && th.stLog.length)
                    th.stLog[th.stLog.length - 1].st = f.st;
                return true;
            }
            if (th.statusBy === "手動" || th.status === BM()[6] || f.lost)
                return false;
            if (stage(f.st) > stage(th.status || BM()[0]))
                return setSt(th, f.st, BY_FB, why);
        }
        catch (e) {
            warn("floor", e);
        }
        return false;
    }
    function ensureCase(t, rec) {
        if (!t || !rec || Array.isArray(rec) || !rec.b || !rec.c || !BM())
            return null;
        if (typeof mybNew !== "function")
            return null;
        const MB = t.myBuyers = Array.isArray(t.myBuyers) ? t.myBuyers : [];
        const k = norm(rec.b), c = cn(rec.c);
        let b = MB.find((x) => x && x.co && norm(x.co) === k && (!x.cty || cn(x.cty) === c)) || null;
        let made = false;
        if (!b) {
            b = mybNew();
            let n = 0;
            while (MB.some((x) => x && x.id === b.id) || (t.dmThreads && t.dmThreads[b.id]))
                b.id = "MY-" + (Date.now() + (++n)).toString(36).toUpperCase().slice(-5);
            b.co = String(rec.b).trim();
            b.cty = rec.c;
            b.memo = `商談の記録（${fbDay(rec)}）から登録`;
            b.v92fb = 1;
            MB.push(b);
            made = true;
        }
        t.dmThreads = t.dmThreads || {};
        let th = t.dmThreads[b.id];
        if (!th)
            th = t.dmThreads[b.id] = { id: b.id, cty: b.cty || rec.c, biz: b.biz || "バイヤー", lang: "English", unread: 0, msgs: [] };
        if (!Array.isArray(th.msgs))
            th.msgs = [];
        if (!th.msgs.length) {
            const ok = (v) => { v = String(v == null ? "" : v).trim(); return v && v !== "—" && v !== "-" ? v : ""; };
            const body = [`【商談の記録（${fbDay(rec)}${ok(rec.ch) ? "・" + rec.ch : ""}）】`, ok(rec.item) && `品目：${rec.item}`, ok(rec.price) && `価格：${rec.price}`, ok(rec.lot) && `数量：${rec.lot}`, ok(rec.term) && `条件：${rec.term}`,
                ok(rec.spec) && `相手の求める仕様：${rec.spec}`, ok(rec.st) && `状況：${rec.st}`, ok(rec.react) && `反応：${rec.react}`, ok(rec.why) && `見送りの理由：${rec.why}`, ok(rec.note) && `メモ：${rec.note}`,
                "※ 商談の記録から作った案件です。この文は相手に送っていません（記録のみ）。"].filter(Boolean).join("\n");
            let tm = "";
            try {
                tm = typeof dmNow === "function" ? dmNow() : "";
            }
            catch (e) { }
            th.msgs.push({ w: "me", t: tm, subj: `商談の記録（${fbDay(rec)}）`, body, st: "logged", at: +rec.v68at || Date.now(), v92fb: 1 });
            const f = fbFloor(t, b) || { st: fbToBm(rec.st), d: fbDay(rec), raw: rec.st || "" };
            th.status = "";
            setSt(th, f.st, BY_FB, `商談の記録（${f.d}）の状況「${f.raw}」`);
            made = true;
        }
        else if (floorApply(t, th))
            made = true;
        rec.v92c = b.id;
        return { b, th, made };
    }
    let syncBusy = false;
    function syncCases() {
        if (syncBusy || isFwd() || isAdmin())
            return false;
        const t = ten();
        if (!t || !BM())
            return false;
        syncBusy = true;
        let ch = false;
        try {
            fbList(t).forEach((f) => { if (f && !Array.isArray(f) && f.user && !f.v92c && f.b && f.c) {
                const r = ensureCase(t, f);
                if (r && r.made)
                    ch = true;
            } });
            Object.values(t.dmThreads || {}).forEach((th) => { if (th && /^MY-/.test(String(th.id || "")) && floorApply(t, th))
                ch = true; });
            if (ch)
                save(t);
        }
        catch (e) {
            warn("sync", e);
        }
        syncBusy = false;
        return ch;
    }
    W.v92flowSync = syncCases;
    if (typeof bmRule === "function") {
        const __br92 = bmRule;
        bmRule = function (th) {
            const r = __br92.apply(this, arguments);
            try {
                const t = ten(), B = BM();
                if (r && t && B && th && r.status !== B[6]) {
                    const f = fbFloor(t, buyerOfTh(t, th));
                    if (f && !f.lost && stage(f.st) > stage(r.status))
                        return { status: f.st, why: `商談の記録（${f.d}）の状況「${f.raw}」` };
                }
            }
            catch (e) {
                warn("rule", e);
            }
            return r;
        };
    }
    if (typeof b30Derive === "function") {
        const __bd92 = b30Derive;
        b30Derive = function (r) {
            const out = __bd92.apply(this, arguments);
            try {
                const R = out || r, x = (R && R.x) || {}, B = BM();
                if (R && R.th && B && R.th.statusBy === "手動" && !x.st) {
                    const s = short(R.th.status);
                    if (R.th.status === B[6]) {
                        if (!x.lead)
                            R.lead = "失注";
                    }
                    else if (s && (typeof V70DEAL_ST === "undefined" || V70DEAL_ST.indexOf(s) >= 0)) {
                        R.st = s;
                        R.stWhy = "直接連絡のスレッドで手で変更";
                        if (!x.lead)
                            R.lead = "有効";
                    }
                }
            }
            catch (e) {
                warn("derive", e);
            }
            return out;
        };
    }
    function fixSmp(t, fb) {
        try {
            const B = BM();
            if (!t || !B || !t.dmThreads || t.v92smpfix)
                return;
            t.v92smpfix = 1;
            const MB = Array.isArray(t.myBuyers) ? t.myBuyers : [];
            Object.values(t.dmThreads).forEach((th) => {
                if (!th || !th.v91smp)
                    return;
                const b = MB.find((x) => x && x.id === th.id);
                if (!b)
                    return;
                const L = (fb || []).filter((f) => f && f.b && norm(f.b) === norm(b.co) && (!b.cty || !f.c || cn(f.c) === cn(b.cty))).sort((a, c) => fbDay(a).localeCompare(fbDay(c)));
                if (!L.length)
                    return;
                const last = L[L.length - 1];
                let st = fbToBm("失注");
                if (last.st !== "失注") {
                    st = "";
                    L.forEach((f) => { if (f.st === "失注")
                        return; const s = fbToBm(f.st); if (!st || stage(s) > stage(st))
                        st = s; });
                }
                if (st && th.status !== st) {
                    th.status = st;
                    if (Array.isArray(th.stLog) && th.stLog.length)
                        th.stLog[th.stLog.length - 1].st = st;
                }
            });
        }
        catch (e) {
            warn("smp", e);
        }
    }
    if (typeof tenantFromSample === "function") {
        const __tfs92 = tenantFromSample;
        tenantFromSample = function (x) {
            const t = __tfs92.apply(this, arguments);
            try {
                if (t && t.v91smp && x && Array.isArray(x.fb))
                    fixSmp(t, x.fb);
            }
            catch (e) { }
            return t;
        };
    }
    if (typeof dealSave === "function") {
        const __ds92 = dealSave;
        dealSave = function () {
            const t0 = ten();
            const n0 = fbList(t0).length;
            const r = __ds92.apply(this, arguments);
            const after = () => {
                try {
                    const t = ten();
                    const L = fbList(t);
                    if (!t || L.length <= n0)
                        return;
                    const rec = L[0];
                    const ch = syncCases();
                    try {
                        toast(M(`✓ 商談を記録しました（${rec.b}）。案件一覧にも出ます`, `✓ Meeting recorded (${rec.b}). It also appears in the case list`, `✓ 已记录商谈（${rec.b}），也会显示在案件列表中`, `✓ Reunión registrada (${rec.b}). También aparece en la lista de casos`));
                    }
                    catch (e) { }
                    const box = document.getElementById("dfAI");
                    if (box) {
                        try {
                            box.scrollIntoView({ block: "center" });
                        }
                        catch (e) { }
                    }
                    if (ch && typeof render === "function") {
                        const keep = document.getElementById("dfAI") ? document.getElementById("dfAI").innerHTML : "";
                        render();
                        const b2 = document.getElementById("dfAI");
                        if (b2 && keep && !b2.innerHTML)
                            b2.innerHTML = keep;
                    }
                }
                catch (e) {
                    warn("dealSave", e);
                }
            };
            try {
                if (r && typeof r.then === "function") {
                    setTimeout(after, 0);
                }
                else
                    after();
            }
            catch (e) { }
            return r;
        };
    }
    function caseDoc(c) {
        try {
            const d = dd(), t = ten();
            if (!c || !d || !d.ship || typeof shipEnsure !== "function" || typeof shipStartCase !== "function")
                return false;
            shipEnsure();
            if (typeof SHIPS === "undefined" || !Array.isArray(SHIPS))
                return false;
            const cty = cn(c.cty);
            const nm = c.named ? String(c.name) : `${c.cty}の${c.biz || "バイヤー"}（ID ${c.id}）`;
            const hit = (S) => !!S && (S.v92case === c.id || (norm(S.buyer) === norm(nm) && cn(S.country) === cty));
            let i = SHIPS.findIndex((x) => x && x.ship && x.open !== false && hit(x.ship));
            if (i < 0)
                i = SHIPS.findIndex((x) => x && x.ship && hit(x.ship));
            if (i >= 0) {
                if (SHIPA !== i && typeof shipUse === "function")
                    shipUse(i);
                return true;
            }
            let rec = null;
            if (c.named && t) {
                const L = fbsOf(t, { co: c.name, cty: c.cty }).filter((f) => f.st !== "失注").sort((a, b) => fbDay(b).localeCompare(fbDay(a)));
                rec = L[0] || null;
            }
            if (rec) {
                try {
                    if (typeof v61dlId === "function")
                        v61dlId(rec);
                }
                catch (e) { }
            }
            const ok = shipStartCase(rec ? { cty: cn(rec.c || c.cty), buyer: rec.b || nm, src: "fb", v61rec: rec } : { cty, buyer: nm, src: c.named ? "my" : "dm" });
            try {
                const S = SHIPS[SHIPA] && SHIPS[SHIPA].ship;
                if (ok && S && (norm(S.buyer) === norm(rec ? rec.b : nm)))
                    S.v92case = c.id;
            }
            catch (e) { }
            return !!ok;
        }
        catch (e) {
            warn("caseDoc", e);
            return false;
        }
    }
    W.v92flowCaseDoc = caseDoc;
    try {
        const A = W;
        if (typeof A.v61dlStart === "function") {
            const __st92 = A.v61dlStart;
            A.v61dlStart = function () {
                const r = __st92.apply(this, arguments);
                try {
                    if (r && W.RDX && typeof W.RDX.goKey === "function")
                        setTimeout(() => { try {
                            opsTab = "doc";
                            W.RDX.goKey("ops:doc");
                        }
                        catch (e) { } }, 0);
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { }
    document.addEventListener("click", (e) => {
        try {
            const tg = e.target && e.target.closest ? e.target : null;
            if (!tg)
                return;
            const b = tg.closest('.k-cd [data-kbc="ops:doc"]');
            if (b && W.RDX && W.RDX._case0) {
                caseDoc(W.RDX._case0);
                try {
                    opsTab = "doc";
                }
                catch (x) { }
                return;
            }
            const nw = tg.closest("[data-v92f]");
            if (nw) {
                const k = nw.getAttribute("data-v92f");
                if (k === "shipnew" && typeof openShipNew === "function") {
                    e.preventDefault();
                    openShipNew();
                }
                return;
            }
            const chip = tg.closest(".b30sum button");
            if (chip && typeof B30 !== "undefined" && B30) {
                const lost = /^\s*失注\s/.test(chip.textContent || "") || chip.getAttribute("data-v92lost") === "1";
                if (lost) {
                    e.preventDefault();
                    e.stopPropagation();
                    B30.v92lost = !B30.v92lost;
                    B30.st = "";
                    B30.star = false;
                    B30.reap = false;
                    if (typeof b30Re === "function")
                        b30Re();
                }
                else if (B30.v92lost) {
                    B30.v92lost = false;
                    setTimeout(() => { try {
                        if (typeof b30Re === "function")
                            b30Re();
                    }
                    catch (x) { } }, 0);
                }
            }
        }
        catch (x) {
            warn("click", x);
        }
    }, true);
    if (typeof b30Filter === "function") {
        const __bf92 = b30Filter;
        b30Filter = function (L) {
            try {
                if (typeof B30 !== "undefined" && B30 && B30.v92lost && !B30.st && !B30.star && !B30.reap) {
                    const keep = B30.noLost;
                    B30.noLost = false;
                    const out = __bf92.apply(this, arguments);
                    B30.noLost = keep;
                    return (out || []).filter((r) => r && r.lead === "失注");
                }
            }
            catch (e) {
                warn("filter", e);
            }
            return __bf92.apply(this, arguments);
        };
    }
    if (typeof b30ListHtml === "function") {
        const __bl92 = b30ListHtml;
        b30ListHtml = function () {
            let h = __bl92.apply(this, arguments);
            try {
                let s = String(h);
                const on = typeof B30 !== "undefined" && B30 && B30.v92lost;
                const i = s.indexOf('class="b30sum"');
                if (i >= 0) {
                    let head = s.slice(0, i), tail = s.slice(i);
                    tail = tail.replace(/>すべて <b>/, ">すべて（失注を除く） <b>");
                    tail = tail.replace(/<button type="button" class="([^"]*)"( data-onclick="B30\.noLost=false;[^"]*")>失注 <b>/, (m, c, a) => `<button type="button" class="${on ? "on" : ""}" data-v92lost="1" title="失注した相手だけを出します（もう一度押すと戻ります）">失注 <b>`);
                    if (on)
                        tail = tail.replace(/<button type="button" class="on"( data-onclick="B30\.st='';B30\.star=false;B30\.reap=false;b30Re\(\)")/, '<button type="button" class=""$1');
                    s = head + tail;
                }
                h = s;
            }
            catch (e) {
                warn("listHtml", e);
            }
            return h;
        };
    }
    try {
        if (typeof V38IX_F !== "undefined" && Array.isArray(V38IX_F) && !V38IX_F.some((x) => x && x[0] === "chat"))
            V38IX_F.splice(3, 0, ["chat", "社内メッセージ"]);
    }
    catch (e) { }
    try {
        if (typeof V38_KN !== "undefined" && V38_KN && !V38_KN.chat)
            V38_KN.chat = "社内メッセージ";
    }
    catch (e) { }
    if (typeof v33InboxItems === "function") {
        const __ib92 = v33InboxItems;
        v33InboxItems = function () {
            const L = __ib92.apply(this, arguments);
            try {
                if (Array.isArray(L) && !isFwd())
                    L.forEach((x) => { if (x && x.k === "reply" && /^nt:msgnew:/.test(String(x.key || "")))
                        x.k = "chat"; });
            }
            catch (e) { }
            return L;
        };
    }
    if (typeof v38DashWait === "function") {
        const __dw92 = v38DashWait;
        v38DashWait = function () {
            let h = String(__dw92.apply(this, arguments));
            try {
                if (!isFwd()) {
                    let n = 0;
                    try {
                        n = (v33InboxItems() || []).filter((x) => x && x.k === "chat").length;
                    }
                    catch (e) { }
                    if (n)
                        h = h.replace(/(data-v38wf="reply">[\s\S]*?<span class="v38ws">)([^<]*)(<\/span>)/, (m, a, b, c) => a + b + E(M(`（ほかに社内の新着メッセージ ${n}件は受信箱に）`, ` (plus ${n} new internal message(s) in the inbox)`, `（另有 ${n} 条内部新消息在收件箱）`, ` (más ${n} mensaje(s) interno(s) en la bandeja)`)) + c);
                }
            }
            catch (e) { }
            return h;
        };
    }
    const TD = {
        "バイヤーへの接触を開始": { pg: "db", nm: "AIバイヤー開拓・拠点" },
        "商談記録を貯める": { pg: "deal", nm: "商談・バイヤー" },
        "初回の見積を出す": { pg: "ops", nm: "書類をつくる", pre: "doc" },
    };
    const tdOf = (x) => (x && !x.v83px && !x.cty && TD[String(x.t || "").trim()]) || null;
    if (typeof todayStepsOf === "function") {
        const __ts92 = todayStepsOf;
        todayStepsOf = function (x) {
            const base = __ts92.apply(this, arguments);
            try {
                const g = tdOf(x);
                if (g) {
                    const t = ten(), d = dd();
                    const run = (base || []).find((s) => s && s.id === "run");
                    const man = (id) => !!((base || []).find((s) => s && s.id === id && !s.auto && s.ok));
                    let st = {};
                    try {
                        const A = W;
                        st = (typeof A.tdStepSt === "function" && typeof A.tdKey === "function") ? (A.tdStepSt()[A.tdKey(x)] || {}) : {};
                    }
                    catch (e) {
                        st = {};
                    }
                    const done = (id) => !!st[id] || man(id);
                    const ths = Object.values((t && t.dmThreads) || {}).filter((th) => th && Array.isArray(th.msgs) && th.msgs.length);
                    const sent = ths.filter((th) => th.msgs.some((m) => m && m.w === "me" && !m.v92fb && !m.smp)).length;
                    const nfb = fbList(t).filter((f) => f && !Array.isArray(f) && f.b).length;
                    const S = [];
                    const add = (id, label, o) => S.push(Object.assign({ id, label, auto: 0, ok: done(id), go: null, goNm: "", pre: "" }, o || {}));
                    const key = String(x.t).trim();
                    if (key === "バイヤーへの接触を開始") {
                        add("v92tgt", "進出したい国を決める", { auto: 1, ok: !!((t && t.targets && t.targets.length) || (d && Object.keys(d.regs || {}).length)), go: "cty", goNm: "販売先国の選定" });
                        add("v92reg", "送り先国の規制を確認する", { go: "ops", goNm: "規制を調べる", pre: "reg" });
                        add("v92db", "バイヤー候補を絞り込む", { go: "db", goNm: "AIバイヤー開拓・拠点" });
                        add("v92snd", "最初の連絡を送る", { auto: 1, ok: sent > 0, go: "db", goNm: "AIバイヤー開拓・拠点" });
                    }
                    else if (key === "商談記録を貯める") {
                        add("v92by", "相手（バイヤー）を登録する", { auto: 1, ok: !!((t && Array.isArray(t.myBuyers) && t.myBuyers.length) || ths.length || nfb), go: "deal", goNm: "商談・バイヤー" });
                        add("v92fb1", `商談を記録する（いま ${nfb}件）`, { auto: 1, ok: nfb > 0, go: "deal", goNm: "商談・バイヤー" });
                        add("v92fbr", "相手の反応・断られた理由も残す", { go: "deal", goNm: "商談・バイヤー" });
                    }
                    else {
                        add("v92who", "見積を出す相手を決める（案件）", { auto: 1, ok: ths.length > 0, go: "deal", goNm: "商談・バイヤー" });
                        add("v92pi", "見積書（PI）の下書きを確かめる", { go: "ops", goNm: "書類をつくる", pre: "doc" });
                        add("v92ms", "やりとりで相手に送る", { go: "msg", goNm: "やりとり" });
                    }
                    return S.concat(run ? [run] : []);
                }
                (base || []).forEach((s) => { if (s && s.go === "ops" && /^貿易実務・書類・出荷/.test(String(s.goNm || ""))) {
                    if (s.pre === "reg" || /規制/.test(s.goNm)) {
                        s.goNm = "規制を調べる";
                        s.pre = "reg";
                    }
                    else {
                        s.goNm = "書類をつくる";
                        s.pre = "doc";
                    }
                } });
            }
            catch (e) {
                warn("steps", e);
            }
            return base;
        };
    }
    if (typeof todayGoOf === "function") {
        const __tg92 = todayGoOf;
        todayGoOf = function (x) {
            try {
                const g = tdOf(x);
                if (g)
                    return { pg: g.pg, nm: g.nm, pre: g.pre || "" };
            }
            catch (e) { }
            const r = __tg92.apply(this, arguments);
            try {
                if (r && r.pg === "ops" && r.nm === "貿易実務・書類・出荷") {
                    if (r.pre === "reg")
                        r.nm = "規制を調べる";
                    else {
                        r.nm = "書類をつくる";
                        r.pre = "doc";
                    }
                }
            }
            catch (e) { }
            return r;
        };
    }
    if (typeof tdStepGo === "function") {
        const __sg92 = tdStepGo;
        tdStepGo = function (pg, pre, fk) {
            if (pg === "ops" && pre === "doc") {
                try {
                    opsTab = "doc";
                }
                catch (e) { }
                return go("ops");
            }
            return __sg92.apply(this, arguments);
        };
    }
    if (typeof buildShip === "function") {
        const __bs92f = buildShip;
        buildShip = function (d, t) {
            const S = __bs92f.apply(this, arguments);
            try {
                if (S && userTen(t) && typeof S.no === "string") {
                    const pre = String(t.sku || "NEW").slice(0, 6).toUpperCase();
                    const old = pre + "-2608-01";
                    const pre2 = pre.replace(/[^0-9A-Z]+$/, "").replace(/[^0-9A-Z]+/g, "-") || "NEW";
                    if (S.no === old && pre2 !== pre) {
                        let ym = "2608";
                        try {
                            const b = t._born ? new Date(+t._born) : null;
                            if (b && !isNaN(b.getTime()))
                                ym = String(b.getFullYear()).slice(2) + String(b.getMonth() + 1).padStart(2, "0");
                        }
                        catch (e) { }
                        const neu = pre2 + "-" + ym + "-01";
                        let ext = false;
                        try {
                            ext = JSON.stringify([t.shipCases || null, t.poCases || null]).indexOf(old) >= 0 ||
                                !!(typeof FWDB !== "undefined" && FWDB && Array.isArray(FWDB.reqs) && FWDB.reqs.some((q) => q && q.caseNo === old));
                        }
                        catch (e) {
                            ext = true;
                        }
                        if (!ext) {
                            if (t.shipSeed && t.shipSeed.no === old)
                                t.shipSeed.no = neu;
                            if (t.v85docs && t.v85docs.cases && t.v85docs.cases[old] && !t.v85docs.cases[neu]) {
                                t.v85docs.cases[neu] = t.v85docs.cases[old];
                                delete t.v85docs.cases[old];
                            }
                            try {
                                if (typeof SHIPS !== "undefined" && Array.isArray(SHIPS))
                                    SHIPS.forEach((c) => { if (c && c.seed && c.ship && c.ship.no === old)
                                        c.ship.no = neu; });
                            }
                            catch (e) { }
                            S.no = neu;
                        }
                    }
                }
            }
            catch (e) {
                warn("shipno", e);
            }
            return S;
        };
    }
    if (typeof v68SetupWhy === "function") {
        const __sw92 = v68SetupWhy;
        v68SetupWhy = function (k, t, D0) {
            let s = __sw92.apply(this, arguments);
            try {
                if (typeof s === "string") {
                    const T = (t && Array.isArray(t.targets) && t.targets.length) ? t.targets : ((ten() && Array.isArray(ten().targets)) ? ten().targets : []);
                    const n = T.length - 3;
                    if (n > 0)
                        s = s.replace(/(進出希望国（[^）]*)(）は登録済み)/, `$1 ほか${n}か国$2`).replace(/(Target markets \([^)]*)(\) are registered)/, `$1 and ${n} more$2`).replace(/(已登记目标市场（[^）]*)(）)/, `$1 等另${n}国$2`);
                }
            }
            catch (e) { }
            return s;
        };
    }
    if (typeof tenantToD === "function") {
        const __ttd92 = tenantToD;
        tenantToD = function (t) {
            const d = __ttd92.apply(this, arguments);
            try {
                if (d && Array.isArray(d.tasks) && userTen(t) && typeof SES !== "undefined" && SES && SES.t === "trial") {
                    d.tasks.forEach((x) => {
                        if (x && /の規制調査$/.test(String(x.n || "")) && x.who === "STANDAGE／FS" && x.st !== "完了") {
                            x.who = t.co || "貴社";
                            const s = /制裁の対象国/.test(String(x.ref || ""));
                            x.ref = "「規制を調べる」で自社で確かめる（STANDAGE への調査の依頼もそこから）" + (s ? "・制裁の対象国（輸出禁止の確認が先）" : "");
                        }
                    });
                }
            }
            catch (e) {
                warn("tasks", e);
            }
            return d;
        };
    }
    let stDirty = false;
    if (typeof bmSetStatus === "function") {
        const __bss92 = bmSetStatus;
        bmSetStatus = function () { const r = __bss92.apply(this, arguments); try {
            if (r)
                stDirty = true;
        }
        catch (e) { } return r; };
    }
    if (typeof closeDW === "function") {
        const __cd92 = closeDW;
        closeDW = function () {
            const r = __cd92.apply(this, arguments);
            try {
                if (stDirty) {
                    stDirty = false;
                    if (typeof render === "function" && !document.getElementById("dfSave"))
                        setTimeout(() => { try {
                            render();
                        }
                        catch (e) { } }, 0);
                }
            }
            catch (e) { }
            return r;
        };
    }
    function docBar() {
        try {
            if (typeof cur === "undefined" || cur !== "ops" || typeof opsTab === "undefined" || opsTab !== "doc")
                return;
            const p = document.querySelector("#well p.v85doc-from");
            if (!p || (p.parentElement && p.parentElement.querySelector(".v92f-case")))
                return;
            const d = dd(), S = d && d.ship;
            if (!S)
                return;
            let n = 0;
            try {
                n = (typeof SHIPS !== "undefined" && Array.isArray(SHIPS)) ? SHIPS.length : 0;
            }
            catch (e) { }
            const div = document.createElement("div");
            div.className = "v92f-case";
            div.setAttribute("data-noi18n", "");
            div.innerHTML = `<span>${E(M("この書類の案件：", "Case for these documents: ", "本单据的案件：", "Caso de estos documentos: "))}<b lang="en">${E(S.no || "")}</b>｜${E(S.buyer || "")}（${E(S.country || "")}）</span>` +
                `<button type="button" class="btn g" data-v92f="shipnew">${E(M(n > 1 ? "案件を切り替える・＋ 新しい案件" : "＋ 新しい案件（相手・国を選ぶ）", n > 1 ? "Switch case / ＋ New case" : "＋ New case (choose buyer & country)", n > 1 ? "切换案件・＋ 新案件" : "＋ 新案件（选择对象和国家）", n > 1 ? "Cambiar caso / ＋ Nuevo caso" : "＋ Nuevo caso (elegir comprador y país)"))}</button>`;
            p.before(div);
        }
        catch (e) {
            warn("docBar", e);
        }
    }
    try {
        if (!document.getElementById("v92flowcss")) {
            const st = document.createElement("style");
            st.id = "v92flowcss";
            st.textContent = ".v92f-case{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 6px;padding:8px 11px;border:1px solid var(--line,#d5dbe3);border-left:4px solid var(--or,#f08300);border-radius:8px;background:var(--surface,#fff);font-size:12.5px;line-height:1.6}" +
                ".v92f-case span{min-width:0;flex:1 1 260px;overflow-wrap:anywhere}.v92f-case .btn{flex:none;padding:5px 11px;font-size:12px}" +
                ".v80fsec-note[data-v92dup]{display:none!important}";
            document.head.appendChild(st);
        }
    }
    catch (e) { }
    if (typeof render === "function") {
        const __r92 = render;
        render = function () {
            try {
                syncCases();
            }
            catch (e) { }
            const r = __r92.apply(this, arguments);
            try {
                docBar();
                setTimeout(docBar, 300);
                setTimeout(docBar, 1000);
            }
            catch (e) { }
            return r;
        };
    }
    function dwFix() {
        try {
            const dw = document.getElementById("dw");
            if (!dw)
                return;
            const seen = {};
            dw.querySelectorAll(".v80fsec-note").forEach((n) => { const k = (n.textContent || "").replace(/\s+/g, "").slice(0, 60); if (seen[k])
                n.setAttribute("data-v92dup", "1");
            else {
                seen[k] = 1;
                n.removeAttribute("data-v92dup");
            } });
            if (!isAdmin()) {
                if (/管理者がサーバーを v2\.2 に更新すると/.test(dw.textContent || "")) {
                    const tw = document.createTreeWalker(dw, NodeFilter.SHOW_TEXT);
                    const L = [];
                    while (tw.nextNode())
                        L.push(tw.currentNode);
                    L.forEach((n) => { const s = String(n.nodeValue || ""); if (/（管理者がサーバーを v2\.2 に更新すると[^）]*）/.test(s))
                        n.nodeValue = s.replace(/（管理者がサーバーを v2\.2 に更新すると[^）]*）/, M("（メールの実送信は準備中です。いまは記録だけ残ります）", " (real e-mail sending is not available yet; records only)", "（实际发送邮件尚在准备中，目前仅保留记录）", " (el envío real aún no está disponible; solo se registra)")); });
                }
            }
        }
        catch (e) { }
    }
    try {
        let tm = 0;
        const start = () => {
            const dw = document.getElementById("dw");
            if (!dw || W.__v92flowObs)
                return;
            W.__v92flowObs = 1;
            new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(dwFix, 80); }).observe(dw, { childList: true, subtree: true });
        };
        if (document.readyState === "loading")
            document.addEventListener("DOMContentLoaded", start);
        else
            start();
        setTimeout(start, 1500);
    }
    catch (e) { }
    try {
        const t = ten();
        if (t && t.v91smp && t.src === "sample") {
            const d = dd();
            fixSmp(t, (d && Array.isArray(d.fb)) ? d.fb : []);
        }
    }
    catch (e) { }
    try {
        if (typeof I18N !== "undefined" && I18N && I18N.dict && I18N.dict.en) {
            const en = I18N.dict.en;
            const add = (ja, e) => { if (!en[ja])
                en[ja] = e; };
            add("社内メッセージ", "Internal messages");
            add("すべて（失注を除く）", "All (excl. lost)");
            add("進出したい国を決める", "Decide target countries");
            add("送り先国の規制を確認する", "Check the destination's regulations");
            add("バイヤー候補を絞り込む", "Narrow down buyer candidates");
            add("最初の連絡を送る", "Send the first message");
            add("相手（バイヤー）を登録する", "Register a buyer");
            add("相手の反応・断られた理由も残す", "Also record the buyer's reaction / reason for declining");
            add("見積を出す相手を決める（案件）", "Decide who to quote (case)");
            add("見積書（PI）の下書きを確かめる", "Check the draft quotation (PI)");
            add("やりとりで相手に送る", "Send it in Messages");
            add("規制を調べる", "Check regulations");
            add("書類をつくる", "Create documents");
            add("商談の記録", "Meeting record");
        }
    }
    catch (e) { }
})();
