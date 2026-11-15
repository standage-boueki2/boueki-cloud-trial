/* 21.92 r3a：3回目の評価で残った課題（商談・案件・やりとり・受信箱・件数・「次は」・目標と道筋・書類の画面の案件の選び方）
   (a) medical-M01：手で決めたステータスを、送信のあとの自動の判定で下げない（「再判定」を押したときだけ判定し直す）。
       バイヤー一覧で手で設定した状態 ⇔ 直接連絡のスレッドの状態（案件一覧）を同じ値に
   (b) auto-M02・medical-M02・health-M07・indagri-M01・other-M03：商談の記録から作った案件（まだ送っていない）は「返信待ち」に数えない。
       「次の行動」は、バイヤー一覧と同じ出どころ（次のアクション／商談の記録の「次の行動・期限」）から出す（刷新版の層が W.v92r3a.next を読む）
   (f) auto-M03・daily-M06・indagri-M02：自社で登録した相手（ID が MY-）は社名で出す（受信箱・知らせ・やりとりの窓・契約書関連）
   ほかは、下の各ブロックの頭に書く */
declare const TEN: any, TENS: any, D: any, SES: any, BM_ST: any, BM_STS: any, V70DEAL_ST: any, SHIPS: any, TODAYS: any, I18N: any, V33IXV: any, V38: any;
declare let render: any, bmStOf: any, bmJudge: any, bmSetStatus: any, v30Put: any, v38WaitItems: any, v33InboxItems: any, v90anaMsgStat: any, toast: any, openDMThread: any, openDW: any;
declare function go(id: string): void;
declare function saveTen(): void;
declare function b30Collect(): any[];
declare function b30Ext(k: string): any;
declare function v33Sig(r: any): any;
declare function v33Day(at: any): string;
declare function v30Norm(s: any): string;
declare function cnorm(c: any): string;
declare function v38MineItems(): any[];
declare const CTY_ASK_RE: any, cur: any, PID: any, shipStep: any;
declare let brain: any, go: any, v85docSet: any, v33CkQuote: any, SHIPA: any;
declare function shipEnsure(): void;
declare function shipUse(i: number): boolean;
declare function v54docIsSmp(S: any): boolean;
declare function v85docIncOf(s: any): string;
declare function openStepEdit(i: number): void;
declare function closeDW(): void;
declare let v54docSrcNote: any, v88Sig: any, v88Phases: any, v90goalRealHtml: any;
declare function v88Tens(): any[];
declare function v88ThStage(th: any): number;
declare function ux32Setup(): any;
declare function v90goalReal(pl: any): any;
declare let v73dashFunnelNote: any, v90anaDashNotes: any, memoSumLocal: any, bmSimulate: any;
declare const V33AU_ACT: any;
declare function v56dMatchMember(w: any): any;
declare function srcList(): any[];
declare function v33AuLog(a: any, b: any): any;
declare function k30New(): void;
declare let dealSave: any, rDoc: any;
declare function v54docSetBuyer(): void;
declare const V56UI: any;
declare function v56uiDrop(): void;
declare function v68trRecOf(S: any): any;
declare function v54docExPay(S: any): any;
declare function v54docPayEn(s: any): any;
declare function v90anaQth(): any;
(function () {
    const W: any = window;
    if (W.__v2192r3a) return;
    W.__v2192r3a = 1;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const lang = () => { try { const s: any = document.getElementById("lang"); const v = (s && s.value) || "ja"; return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja"; } catch (e) { return "ja"; } };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const warn = (k: string, e: any) => { try { console.warn("[v92r3a] " + k, e); } catch (x) { } };
    const ten = () => { try { return (typeof TEN !== "undefined" && TEN) ? TEN : null; } catch (e) { return null; } };
    const tens = (): any[] => { try { const L = (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS.slice() : []; const t = ten(); if (t && L.indexOf(t) < 0) L.unshift(t); return L; } catch (e) { const t = ten(); return t ? [t] : []; } };
    const dd = () => { try { return (typeof D !== "undefined" && D) ? D : null; } catch (e) { return null; } };
    const isFwd = () => { try { return !!(typeof SES !== "undefined" && SES && (SES.role === "fwd" || SES.t === "fwd")); } catch (e) { return false; } };
    const isAdmin = () => { try { return !!(typeof SES !== "undefined" && SES && SES.t === "admin"); } catch (e) { return false; } };
    const userTen = (t: any) => !!(t && (t.src === "upload" || t.src === "sample2"));
    const norm = (s: any) => { try { if (typeof v30Norm === "function") return v30Norm(s); } catch (e) { } return String(s || "").toLowerCase().replace(/\s+/g, ""); };
    const cn = (c: any) => { try { if (typeof cnorm === "function") return cnorm(c || "") || String(c || ""); } catch (e) { } return String(c || ""); };
    const BM = (): string[] | null => { try { return (typeof BM_ST !== "undefined" && Array.isArray(BM_ST) && BM_ST.length >= 7) ? BM_ST : null; } catch (e) { return null; } };
    const short = (st: any) => { try { return (typeof BM_STS !== "undefined" && BM_STS[st]) || st; } catch (e) { return st; } };
    const rxEsc = (s: any) => String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const fbList = (t: any): any[] => { try { if (userTen(t)) return Array.isArray(t.fbx) ? t.fbx : []; const d = dd(); return (d && Array.isArray(d.fb)) ? d.fb : []; } catch (e) { return []; } };
    const API: any = W.v92r3a = W.v92r3a || {};

    /* ───────── 共通：スレッド・相手 ───────── */
    function thFind(id: any): any { // [tenant, thread]
        id = String(id || "");
        for (const t of tens()) { try { const th = t && t.dmThreads && t.dmThreads[id]; if (th) return [t, th]; } catch (e) { } }
        return [null, null];
    }
    function buyerOf(id: any): any {
        id = String(id || "");
        for (const t of tens()) { try { const b = (Array.isArray(t.myBuyers) ? t.myBuyers : []).find((x: any) => x && x.id === id); if (b) return b; } catch (e) { } }
        return null;
    }
    /* 商談の記録から作っただけ（相手に1通も送っていない）のスレッド */
    const logOnly = (th: any) => !!(th && Array.isArray(th.msgs) && th.msgs.length && th.msgs.every((m: any) => m && m.v92fb));
    API.logOnly = logOnly;

    /* ───────── (f) 自社で登録した相手は社名で ───────── */
    function nameFix(s: any): any {
        if (typeof s !== "string" || s.indexOf("MY-") < 0) return s;
        return (function () {
            let out = s as string;
            const ids = Array.from(new Set(s.match(/MY-[A-Z0-9]{3,8}/g) || []));
            ids.forEach((id) => {
                const b = buyerOf(id);
                if (!b || !b.co) return;
                const [, th] = thFind(id);
                const cty = String((th && th.cty) || b.cty || ""), biz = String((th && th.biz) || b.biz || "バイヤー");
                const bizRx = Array.from(new Set([biz, String(b.biz || ""), "バイヤー"].filter(Boolean))).map(rxEsc).join("|");
                // 「タイ バイヤー（ID MY-…）」「タイのバイヤー（ID MY-…・往復 1通）」「タイ／バイヤー（ID MY-…）」
                const re = new RegExp((cty ? rxEsc(cty) : "[^\\s：:、。]{1,12}") + "(?:の|／|・|\\s)*(?:" + bizRx + ")\\s*[（(]\\s*ID\\s*" + id, "g");
                out = out.replace(re, String(b.co) + "（" + (cty || M("国 未登録", "country not set")));
                // かっこなし：「タイのバイヤー ID MY-…」
                const re2 = new RegExp((cty ? rxEsc(cty) : "[^\\s：:、。]{1,12}") + "(?:の|／|・|\\s)*(?:" + bizRx + ")\\s+ID\\s*" + id, "g");
                out = out.replace(re2, String(b.co) + "（" + (cty || M("国 未登録", "country not set")) + "）");
            });
            return out;
        })();
    }
    API.nameFix = nameFix;
    /* 画面の文字（描いたあと）：ID MY-… を含む文字だけを直す */
    function nameDom(root: any) {
        try {
            if (!root || isFwd() || isAdmin()) return;
            const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
            const L: any[] = [];
            let n: any;
            while ((n = tw.nextNode())) { const v = n.nodeValue; if (v && v.indexOf("MY-") >= 0 && /ID\s*MY-/.test(v)) L.push(n); }
            L.forEach((x) => { const p = x.parentNode; if (p && /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return; const v = nameFix(x.nodeValue); if (v !== x.nodeValue) x.nodeValue = v; });
        }
        catch (e) { warn("nameDom", e); }
    }
    let nmT: any = 0;
    const nameLater = () => { clearTimeout(nmT); nmT = setTimeout(() => { nameDom(document.body); dmHead(); }, 60); };
    /* やりとりの窓の題：「📨 タイのバイヤー [ID MY-…]」→ 社名を先に。宛先の「🔒 未開示（つなぐ依頼…）」は仲介の相手の言葉なので、自社の相手では言い直す */
    function dmHead() {
        try {
            const dw = document.getElementById("dw") || document.getElementById("pn");
            const pn: any = document.querySelector("#pn");
            const id = String((pn && pn.dataset && pn.dataset.dmid) || "");
            if (!dw || !/^MY-/.test(id)) return;
            const b = buyerOf(id);
            const h = (pn || dw).querySelector("h3");
            if (b && b.co && h && !h.dataset.r3a && /📨/.test(h.textContent || "")) {
                h.dataset.r3a = "1";
                const t: any = Array.from(h.childNodes).find((x: any) => x.nodeType === 3 && /📨/.test(x.nodeValue || ""));
                const [, th] = thFind(id);
                if (t) t.nodeValue = "📨 " + b.co + "（" + String((th && th.cty) || b.cty || "") + "） ";
            }
            const root = pn || dw;
            const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
            let n: any;
            while ((n = tw.nextNode())) {
                const v = String(n.nodeValue || "");
                if (v.indexOf("🔒 未開示（つなぐ依頼で相手が承諾すると開示）") >= 0) n.nodeValue = v.replace("🔒 未開示（つなぐ依頼で相手が承諾すると開示）", M("未登録（自社で登録した相手です）", "not set (a buyer you registered yourself)", "未登记（自行登记的对象）", "sin registrar (comprador registrado por usted)"));
            }
            const sel: any = document.getElementById("bmStSel");
            if (sel && sel.title && /次のメッセージが来るまで/.test(sel.title)) sel.title = M("手で変更（「再判定」を押すまで、この状態のままにします）", "Set by hand (kept until you press Re-judge)");
        }
        catch (e) { warn("dmHead", e); }
    }
    if (typeof toast === "function") {
        const __to = toast;
        toast = function (this: any, m: any) { try { arguments[0] = nameFix(m); } catch (e) { } return __to.apply(this, arguments as any); };
    }

    /* ───────── (a) 手で決めたステータスは、自動の判定で変えない ───────── */
    let force = 0, mirror = 0;
    const manual = (th: any) => { const B = BM(); return !!(th && B && th.statusBy === "手動" && B.indexOf(th.status) >= 0); };
    if (typeof bmStOf === "function") {
        const __so = bmStOf;
        bmStOf = function (this: any, th: any) { try { if (manual(th)) return th.status; } catch (e) { } return __so.apply(this, arguments as any); };
    }
    if (typeof bmJudge === "function") {
        const __bj = bmJudge;
        bmJudge = function (this: any, th: any, opts: any) {
            try { if (!(opts && opts.force) && manual(th)) return Promise.resolve(th.status); } catch (e) { }
            const f = !!(opts && opts.force);
            if (f) force++;
            let r: any;
            try { r = __bj.apply(this, arguments as any); } catch (e) { if (f) force--; throw e; }
            if (f) { try { Promise.resolve(r).then(() => { force--; }, () => { force--; }); } catch (e) { force--; } }
            return r;
        };
    }
    /* スレッドの状態 → バイヤー一覧の手での設定（あるときだけ）を同じ値に */
    const thKey = (id: any) => (/^MY-/.test(String(id)) ? "my:" : "db:") + String(id);
    if (typeof bmSetStatus === "function") {
        const __bs = bmSetStatus;
        bmSetStatus = function (this: any, th: any, st: any, by: any) {
            try { if (!force && manual(th) && by !== "手動") return false; } catch (e) { }
            const r = __bs.apply(this, arguments as any);
            try {
                if (by === "手動" && !mirror && th && th.id && typeof b30Ext === "function" && typeof v30Put === "function") {
                    const x = b30Ext(thKey(th.id)) || {};
                    const s = short(st);
                    if (x.st && x.st !== s && (typeof V70DEAL_ST === "undefined" || V70DEAL_ST.indexOf(s) >= 0)) { mirror++; try { v30Put("bx", thKey(th.id), { st: s }); } finally { mirror--; } }
                }
            }
            catch (e) { warn("mirror1", e); }
            return r;
        };
    }
    /* バイヤー一覧で手で設定した状態 → スレッド（案件一覧・案件の詳細・やりとり）へ */
    if (typeof v30Put === "function") {
        const __vp = v30Put;
        v30Put = function (this: any, sec: any, id: any, patch: any) {
            const r = __vp.apply(this, arguments as any);
            try {
                const B = BM();
                if (sec === "bx" && patch && Object.prototype.hasOwnProperty.call(patch, "st") && !mirror && B && /^(my|db):/.test(String(id))) {
                    const [t, th] = thFind(String(id).slice(3));
                    if (th && Array.isArray(th.msgs) && th.msgs.length) {
                        const v = String(patch.st || "");
                        const bm = B.find((s) => short(s) === v) || "";
                        mirror++;
                        try {
                            if (bm && bm !== B[6]) { if (typeof bmSetStatus === "function") bmSetStatus(th, bm, "手動", M("バイヤー一覧で手で変更", "Set by hand in the buyer list"), true); }
                            else if (!v && th.statusBy === "手動" && /バイヤー一覧/.test(String(th.statusWhy || ""))) { th.statusBy = "AI（ルール）"; th.statusAt = 0; try { if (userTen(t) && typeof saveTen === "function") saveTen(); } catch (e) { } }
                        }
                        finally { mirror--; }
                    }
                }
            }
            catch (e) { warn("mirror2", e); }
            return r;
        };
    }

    /* ───────── (b) 記録から作った案件：次の行動・返信待ち ───────── */
    let rowsC: any = null, rowsAt = 0;
    const rows = (): any[] => { const now = Date.now(); if (!rowsC || now - rowsAt > 400) { try { rowsC = (typeof b30Collect === "function") ? b30Collect() : []; } catch (e) { rowsC = []; } rowsAt = now; } return rowsC || []; };
    /* その相手の「次の行動」：バイヤー一覧の「次のアクション」と同じ出どころ（v33Sig）。無ければ、商談の記録の「次の行動・期限」 */
    function nextOf(id: any): any {
        try {
            id = String(id || "");
            const r = rows().find((x: any) => x && x.key === thKey(id));
            if (r && typeof v33Sig === "function") {
                const s = v33Sig(r);
                if (s && s.what) return { t: String(s.what), due: s.at ? (typeof v33Day === "function" ? v33Day(s.at) : "") : "", when: s.at ? String(s.t || "") : "", od: s.k === "od", src: "na" };
            }
            const b = buyerOf(id);
            if (b && b.co) {
                const k = norm(b.co), c = b.cty ? cn(b.cty) : "";
                for (const t of tens()) {
                    const f = fbList(t).filter((x: any) => x && !Array.isArray(x) && x.b && norm(x.b) === k && (!c || !x.c || cn(x.c) === c) && String(x.next || "").trim())
                        .sort((a: any, z: any) => String(z.d || "").localeCompare(String(a.d || "")))[0];
                    if (f) return { t: String(f.next).trim(), due: String(f.due || ""), when: "", od: false, src: "fb", d: String(f.d || "") };
                }
            }
        }
        catch (e) { warn("next", e); }
        return null;
    }
    API.next = nextOf;
    const dmIdOfKey = (k: any) => { const m = String(k || "").match(/^(?:nt:)?dm:([^:]+)/); return m ? m[1] : ""; };
    if (typeof v38WaitItems === "function") {
        const __wi = v38WaitItems;
        v38WaitItems = function (this: any) {
            let L = __wi.apply(this, arguments as any);
            try {
                if (Array.isArray(L) && !isFwd()) {
                    L = L.filter((x: any) => { const id = x && x.k === "dm" ? dmIdOfKey(x.key) : ""; if (!id) return true; const [, th] = thFind(id); return !logOnly(th); });
                    L.forEach((x: any) => { if (x && typeof x.t === "string") x.t = nameFix(x.t); });
                }
            }
            catch (e) { warn("wait", e); }
            return L;
        };
    }
    if (typeof v33InboxItems === "function") {
        const __ib = v33InboxItems;
        v33InboxItems = function (this: any) {
            const L = __ib.apply(this, arguments as any);
            try { if (Array.isArray(L) && !isFwd()) L.forEach((x: any) => { if (!x) return; if (typeof x.t === "string") x.t = nameFix(x.t); if (typeof x.sub === "string") x.sub = nameFix(x.sub); }); } catch (e) { warn("inbox", e); }
            return L;
        };
    }
    if (typeof v90anaMsgStat === "function") {
        const __ms = v90anaMsgStat;
        v90anaMsgStat = function (this: any) {
            const o = __ms.apply(this, arguments as any);
            try { if (o && Array.isArray(o.wait)) { const all = o.wait.length; o.wait = o.wait.filter((x: any) => !logOnly(x && x.th)); o.logOnly = all - o.wait.length; } } catch (e) { warn("msgstat", e); }
            return o;
        };
    }

    /* ───────── (c) daily-N08：「要対応」の数の内訳（受信箱で「済み／あとで」にした分） ───────── */
    API.needInfo = function () {
        try {
            const S = v90anaMsgStat();
            const L: any[] = (typeof v38MineItems === "function") ? v38MineItems() : [];
            let qth: any = {};
            try { qth = (typeof v90anaQth === "function") ? v90anaQth() : {}; } catch (e) { }
            const have = new Set<string>();
            L.forEach((x: any) => { const k = String((x && x.key) || ""); const id = dmIdOfKey(k); if (id && (x.k === "reply" || x.v90reply)) have.add(id); if (qth[k]) have.add(String(qth[k])); });
            const done = S.need.filter((n: any) => !have.has(String(n.id))).length;
            return { all: S.need.length, done };
        }
        catch (e) { return null; }
    };

    /* ───────── (d) auto-N08・indagri-N10：候補の質問「どの国に売れますか」で、知らせなしに別の画面へ移る → その場で答え、移るのはボタンで ───────── */
    let holdCty = 0;
    if (typeof brain === "function") {
        const __br = brain;
        brain = function (this: any, q: any, opts: any) {
            let hit = false;
            try {
                const raw = String((opts && opts.raw) || q || "").split("\n=== ")[0];
                if (typeof CTY_ASK_RE !== "undefined" && CTY_ASK_RE.test(raw) && (typeof cur === "undefined" || cur !== "cty")) { hit = true; holdCty = Date.now(); }
            }
            catch (e) { }
            const r = __br.apply(this, arguments as any);
            if (!hit) return r;
            const HEAD = "<b>販売先国の選定</b>画面を開きました。";
            const fix = (x: any) => {
                try {
                    if (x && typeof x.a === "string" && x.a.indexOf(HEAD) === 0) {
                        x.a = M("<b>販売先国の選定</b>の画面で決めます（下のボタンで開けます。この画面のまま、いまの状況をお答えします）。", "This is decided on the <b>Target market selection</b> screen (open it with the button below; here is the current status). ") +
                            x.a.slice(HEAD.length) +
                            `<br><button type="button" class="btn g" data-r3ago="cty" data-noi18n style="margin-top:6px">${E(M("「販売先国の選定」の画面を開く →", "Open “Target market selection” →", "打开“选择销售国家” →", "Abrir «Selección de países» →"))}</button>`;
                        setTimeout(() => { holdCty = 0; }, 500);
                    }
                    else holdCty = 0;
                }
                catch (e) { warn("brain", e); }
                return x;
            };
            try { if (r && typeof r.then === "function") return r.then(fix); } catch (e) { }
            fix(r);
            return r;
        };
    }
    if (typeof go === "function") {
        const __go = go;
        go = function (this: any, id: any) {
            try { if (id === "cty" && holdCty && Date.now() - holdCty < 60000) { holdCty = 0; return; } } catch (e) { }
            return __go.apply(this, arguments as any);
        };
    }
    document.addEventListener("click", (ev: any) => {
        try {
            const b = ev.target && ev.target.closest ? ev.target.closest("[data-r3ago]") : null;
            if (!b) return;
            ev.preventDefault();
            holdCty = 0;
            const k = String(b.getAttribute("data-r3ago") || "");
            if (W.RDX && typeof W.RDX.goKey === "function") W.RDX.goKey(k); else go(k);
        }
        catch (e) { warn("r3ago", e); }
    });

    /* ───────── (e) 書類の画面 ───────── */
    const isSmpShip = (S: any) => { try { return typeof v54docIsSmp === "function" ? !!v54docIsSmp(S) : !!(S && /^（想定）/.test(String(S.buyer || ""))); } catch (e) { return false; } };
    /* daily-M03・culture-M02・health-M10・other-M02：入り直したあと「書類をつくる」「この案件の書類」を開くと見本の案件に戻る
       → 自分の案件があれば、最後に触った自分の案件（無ければいちばん新しい自分の案件）を開く。入り直して最初に開いたときだけ（そのあと見本に切り替えるのは自由） */
    const shipInit: any = {};
    function shipPick() {
        try {
            if (typeof cur === "undefined" || cur !== "ops" || isFwd() || isAdmin()) return;
            const d = dd(), t = ten();
            if (!d || !d.ship || typeof shipEnsure !== "function") return;
            const pid = String((typeof PID !== "undefined" && PID) || "_");
            if (!shipInit[pid]) {
                shipEnsure();
                if (typeof SHIPS === "undefined" || !Array.isArray(SHIPS)) return;
                shipInit[pid] = 1;
                if (isSmpShip(d.ship)) {
                    const L = SHIPS.map((c: any, i: number) => ({ c, i })).filter((x: any) => x.c && x.c.ship && !isSmpShip(x.c.ship) && !x.c.done);
                    if (L.length) {
                        const last = t && t.v92r3aShip ? L.find((x: any) => String(x.c.ship.no) === String(t.v92r3aShip)) : null;
                        const pick = last || L.slice().sort((a: any, b: any) => ((b.c.at || 0) - (a.c.at || 0)) || (b.i - a.i))[0];
                        if (pick && typeof shipUse === "function") shipUse(pick.i);
                    }
                }
            }
            // 最後に触った自分の案件を覚える
            const S = dd() && dd().ship;
            if (t && userTen(t) && S && S.no && !isSmpShip(S) && t.v92r3aShip !== S.no) { t.v92r3aShip = S.no; try { if (typeof saveTen === "function") saveTen(); } catch (e) { } }
        }
        catch (e) { warn("shipPick", e); }
    }
    /* daily-M02・health-M05：判断の欄の「建値」を変えても、見積書・請求書の Delivery が前のまま
       → 判断の欄で選んだ建値を、受注内容の取引条件（同じ値）に入れる。場所（港）は、同じ側の条件（F 同士／C・D 同士）のときだけ残す */
    const INC_F = /^(EXW|FCA|FAS|FOB)$/;
    if (typeof v85docSet === "function") {
        const __ds = v85docSet;
        v85docSet = function (this: any, k: any, v: any) {
            try {
                const S = dd() && dd().ship;
                if (k === "inc" && v && S && !S.poNo && typeof v85docIncOf === "function" && typeof openStepEdit === "function") {
                    const old = String(S.term || ""), oc = v85docIncOf(old);
                    if (oc !== v) {
                        let place = old.replace(/\(?Incoterms[^)]*\)?/i, "").replace(new RegExp("\\b(" + (oc || "EXW|FCA|FAS|FOB|CFR|CNF|CIF|CPT|CIP|DAP|DPU|DDP") + ")\\b", "i"), "").trim();
                        const same = oc && (INC_F.test(oc) === INC_F.test(v));
                        if (!same) place = "";
                        const nt = (v + " " + place).trim();
                        let ok = false;
                        try {
                            openStepEdit((typeof shipStep !== "undefined" && shipStep) || 0);
                            const inp: any = document.getElementById("seI"), goB: any = document.getElementById("seGo");
                            if (inp && goB) { inp.value = nt; goB.click(); ok = true; }
                            else { try { closeDW(); } catch (e) { } }
                        }
                        catch (e) { warn("incEdit", e); }
                        const S2 = dd() && dd().ship;
                        if (ok && S2 && v85docIncOf(S2.term) === v) {
                            const r = __ds.call(this, "inc", "");
                            try {
                                toast(M(`建値を ${v} にしました。見積書・請求書の Delivery も ${v} に変わります。${same && place ? "" : "場所（港・都市）は「受注内容を編集」の取引条件で入れてください。"}単価は自動では変えていません。`,
                                    `Trade term set to ${v}. Delivery on the quotation and invoice now shows ${v}. ${same && place ? "" : "Enter the place (port/city) under Terms in “Edit order details”. "}The unit price was not changed.`));
                            }
                            catch (e) { }
                            return r;
                        }
                    }
                }
            }
            catch (e) { warn("docSet", e); }
            return __ds.apply(this, arguments as any);
        };
    }
    /* auto-M01・health-M06・daily-M04：見積書・請求書の下の注記
       ・単価が商談の記録・受注内容の編集から来ている案件（S.v61fb）では、「単価は価格表のまま」「価格表の行の値を入れています」は当たらない
         → 外して、「参考：価格表は…ごとの価格。この書類の単価は価格表からは入れていません」の1行に（行を選んでも単価は変わらないので、行の選択も出さない）
       ・状況が受注でない記録の確定単価を「確定単価（受注時）」と呼ばない
       ・英文の書類の Payment に日本語が残っているときは、赤の項目が残っている間も注記に出す（訳は作らない） */
    const JA_RE = /[぀-ヿ㐀-鿿]/;
    if (typeof v54docSrcNote === "function") {
        const __sn = v54docSrcNote;
        v54docSrcNote = function (this: any, S: any) {
            let h = __sn.apply(this, arguments as any);
            try {
                const k = String(W.__poDocK || "pi");
                if (S && !S.poNo && (k === "pi" || k === "ci")) {
                    let s = String(h == null ? "" : h);
                    if (S.v61fb) {
                        s = s.replace(/<span class="v68trnote v92docs-gap"[\s\S]*?<\/span><br>/, "");
                        const i = s.indexOf("この価格表は「");
                        if (i >= 0) {
                            const j = s.lastIndexOf("<br><span", i);
                            const head = String((S.v92band && S.v92band.head) || "");
                            if (j >= 0) s = s.slice(0, j) + `<br><span data-noi18n>${E(M(`参考：商品の価格表は「${head}」ごとの価格です。この書類の単価は、上のとおり商談の記録（または受注内容の編集）の値で、価格表からは入れていません。`, `Note: the product's price list is by “${head}”. The unit price on this document comes from the meeting record (or your edit), not from the price list.`))}</span>`;
                        }
                        let rec: any = null;
                        try { rec = typeof v68trRecOf === "function" ? v68trRecOf(S) : null; } catch (e) { }
                        if (rec && rec.st !== "受注") s = s.replace("単価は、商談の記録の確定単価（受注時）です：", "単価は、商談の記録に入れた確定単価です：");
                    }
                    let pay = "";
                    try { pay = String((typeof v54docExPay === "function" && v54docExPay(S)) || (typeof v54docPayEn === "function" ? v54docPayEn(S.pay || "") : (S.pay || "")) || ""); } catch (e) { pay = String(S.pay || ""); }
                    if (pay && JA_RE.test(pay) && s.indexOf("v92r3a-ja") < 0)
                        s = `<span class="v68trnote v92r3a-ja" style="color:var(--warn);font-weight:700" data-noi18n>⚠ ${E(M(`英文の書類の Payment（支払条件）に日本語が入っています：「${pay}」。相手に送る前に、英語で書き直してください（「受注内容を編集」の「支払」。例：T/T in advance）。`, `The Payment line of this English document contains Japanese: “${pay}”. Rewrite it in English before sending (Payment in “Edit order details”; e.g. T/T in advance).`))}</span><br>` + s;
                    h = s;
                }
            }
            catch (e) { warn("srcNote", e); }
            return h;
        };
    }
    /* health-M01：完成形の見本の会社で作った自分の案件（商談の記録から）にも「受注内容を編集」の入口を出す（docs の層は、資料で登録した商品の案件だけに出していた） */
    if (typeof rDoc === "function") {
        const __rd = rDoc;
        rDoc = function (this: any) {
            const r = __rd.apply(this, arguments as any);
            try {
                const S = dd() && dd().ship;
                const o = document.getElementById("dO");
                const card: any = o && (o as any).closest ? (o as any).closest(".c") : null;
                if (S && card && !S.poNo && S.v61fb && !isSmpShip(S) && !card.querySelector(".v92docs-edit") && typeof v54docSetBuyer === "function") {
                    const has = Array.from(card.querySelectorAll("button")).some((b: any) => /相手の社名・条件を入れる|受注内容を編集/.test(b.textContent || "") && b.offsetParent);
                    if (!has) {
                        const div = document.createElement("div");
                        div.className = "rw v92docs-edit";
                        div.setAttribute("style", "margin-top:8px;gap:6px;flex-wrap:wrap;align-items:center");
                        div.innerHTML = `<button class="btn g" type="button" data-v92docs="edit" data-noi18n>${E(M("✎ 受注内容を編集（相手・数量・単価・取引条件・支払）", "✎ Edit order details (buyer, quantity, price, terms, payment)", "✎ 编辑订单内容", "✎ Editar el pedido"))}</button>`;
                        (o as any).insertAdjacentElement("beforebegin", div);
                    }
                }
            }
            catch (e) { warn("rDoc", e); }
            return r;
        };
    }
    /* medical-M09(c)：請求書・梱包明細の赤の行が「見積書の Seller 欄」 */
    if (typeof v33CkQuote === "function") {
        const __ck = v33CkQuote;
        v33CkQuote = function (this: any) {
            const F = __ck.apply(this, arguments as any);
            try { if (Array.isArray(F)) F.forEach((f: any) => { if (f && f.how === "見積書の Seller 欄に住所を入れてください") f.how = "Seller 欄に住所を入れてください（見積書・請求書・梱包明細で共通です）"; }); } catch (e) { }
            try { const S = dd() && dd().ship; if (Array.isArray(F) && S && S.v61fb) return F.filter((f: any) => !(f && /いちばん上の行の値が仮に入っています/.test(String(f.how || "")))); } catch (e) { }
            return F;
        };
    }
    try { if (typeof I18N !== "undefined" && I18N && I18N.dict && I18N.dict.en) I18N.dict.en["Seller 欄に住所を入れてください（見積書・請求書・梱包明細で共通です）"] = "Enter the address in the Seller field (shared by the quotation, invoice and packing list)"; } catch (e) { }

    /* ───────── (c) 目標と道筋（daily-M09・auto-M06・medical-M04・indagri-M03） ─────────
       ・「自社の商談の記録 N件」は、実際は「商談の記録の相手の数＋直接連絡のスレッドの数」。商談を記録すると案件（スレッド）もできるので、同じ相手を2回数えていた
         → 同じ相手は1回だけ数え、言葉を「商談・やりとりのある相手 N社（商談の記録 M件）」に（分析・商談の「商談の記録 M件」と同じ M）
       ・道筋の「済み」：はじめの設定（ホームの手順）と同じ判定に（国の確定・規制・営業資料・バイヤー開拓）。価格は価格の登録があるときだけ
       ・「1社あたりを大きくする」：要る額が、いまの想定より小さいときは出さない */
    const tensRm = (): any[] => { try { if (typeof v88Tens === "function") return v88Tens() || []; } catch (e) { } return tens(); };
    const recN = () => { let n = 0; try { tensRm().forEach((t: any) => { n += (Array.isArray(t.fbx) ? t.fbx : []).filter((f: any) => f && !Array.isArray(f)).length; }); const t = ten(), d = dd(); if (t && t.src === "sample" && d && Array.isArray(d.fb)) n += d.fb.length; } catch (e) { } return n; };
    if (typeof v88Sig === "function") {
        const __sg = v88Sig;
        v88Sig = function (this: any) {
            const s = __sg.apply(this, arguments as any);
            try {
                let dup = 0, dupDeal = 0;
                tensRm().forEach((t: any) => {
                    const fb: any[] = (Array.isArray(t.fbx) ? t.fbx : []).filter((f: any) => f && !Array.isArray(f) && f.b);
                    if (!fb.length || !t.dmThreads) return;
                    const MB: any[] = Array.isArray(t.myBuyers) ? t.myBuyers : [];
                    Object.values(t.dmThreads).forEach((th: any) => {
                        if (!th || !Array.isArray(th.msgs) || !th.msgs.length) return;
                        const b = MB.find((x: any) => x && x.id === th.id);
                        if (!b || !b.co) return;
                        const L = fb.filter((f: any) => norm(f.b) === norm(b.co));
                        if (!L.length) return;
                        dup++;
                        let k = 0; try { k = typeof v88ThStage === "function" ? v88ThStage(th) : 0; } catch (e) { }
                        if (k >= 9 && L.some((f: any) => /成約|受注|取引中/.test(String(f.st || "") + " " + String(f.note || "")))) dupDeal++;
                    });
                });
                if (dup) s.met = Math.max(0, (s.met | 0) - dup);
                if (dupDeal) s.deals = Math.max(0, (s.deals | 0) - dupDeal);
            }
            catch (e) { warn("sig", e); }
            return s;
        };
    }
    const setupDone = (): any => { const o: any = {}; try { const S = (typeof ux32Setup === "function") ? ux32Setup() : null; if (Array.isArray(S)) S.forEach((r: any) => { if (Array.isArray(r)) o[r[0]] = !!r[4]; }); else return null; } catch (e) { return null; } return o; };
    if (typeof v88Phases === "function") {
        const __ph = v88Phases;
        v88Phases = function (this: any, G: any, B: any, st: any) {
            const ph = __ph.apply(this, arguments as any);
            try {
                const sig = (st && st.sig) || {};
                const SD = setupDone();
                const off = (a: any, why: string) => { a.done = false; delete a.why; a.r3aWhy = why; };
                (ph || []).forEach((p: any) => (p.acts || []).forEach((a: any) => {
                    if (!a || !a.done) return;
                    const t = String(a.t || "");
                    if (/^販売先国を決める|^Choose target markets/.test(t)) { if (SD && SD.cty === false) off(a, "cty"); }
                    else if (/^規制・認証と関税を確かめる|^Check rules/.test(t)) { if (SD && SD.reg === false) off(a, "reg"); else if (a.why) a.why = M("済みの根拠：規制の確認あり", "Done because: rules checked"); }
                    else if (/^輸出の価格|^Set export prices/.test(t)) { if (!sig.price) off(a, "price"); else if (a.why) a.why = M("済みの根拠：価格表・輸出価格あり", "Done because: prices on file"); }
                    else if (/^外国語の営業資料をつくる|^Create the foreign-language/.test(t)) { if (SD && SD.deck === false) off(a, "deck"); }
                    else if (/^AIバイヤー開拓で毎月|^Reach out to buyers/.test(t)) { if (SD && SD.buyer === false) off(a, "buyer"); }
                }));
            }
            catch (e) { warn("phases", e); }
            return ph;
        };
    }
    if (typeof v90goalRealHtml === "function") {
        const __rh = v90goalRealHtml;
        v90goalRealHtml = function (this: any, pl: any) {
            let h = __rh.apply(this, arguments as any);
            try {
                const X = typeof v90goalReal === "function" ? v90goalReal(pl) : null;
                if (X && X.per && +X.perNeed <= +X.per.v) h = String(h).replace(/<li><b>(?:1社あたりを大きくする|Bigger buyers)<\/b>[\s\S]*?<\/li>/, "");
            }
            catch (e) { warn("realHtml", e); }
            return h;
        };
    }
    function rmWords() {
        try {
            if (typeof cur === "undefined" || cur !== "rm") return;
            const w = document.getElementById("well");
            if (!w) return;
            const m = recN();
            const tw = document.createTreeWalker(w, NodeFilter.SHOW_TEXT, null);
            const L: any[] = [];
            let n: any;
            while ((n = tw.nextNode())) { const v = String(n.nodeValue || ""); if (/自社の商談の記録 \d+件|商談の記録をあと \d+件ためる/.test(v)) L.push(n); }
            L.forEach((x) => {
                x.nodeValue = String(x.nodeValue)
                    .replace(/自社の商談の記録 (\d+)件/g, (_: string, a: string) => `商談・やりとりのある相手 ${a}社（商談の記録は ${m}件。分析・レポートと同じ数え方）`)
                    .replace(/商談の記録をあと (\d+)件ためる/g, (_: string, a: string) => `商談・やりとりのある相手をあと ${a}社ふやす`);
            });
        }
        catch (e) { warn("rmWords", e); }
    }
    API.rmWords = rmWords;
    let rmObs: any = null, rmT: any = 0;
    function rmWatch() {
        try {
            const w = document.getElementById("well");
            if (!w || rmObs) return;
            rmObs = new MutationObserver(() => { try { if (typeof cur === "undefined" || cur !== "rm") return; } catch (e) { return; } clearTimeout(rmT); rmT = setTimeout(rmWords, 120); });
            rmObs.observe(w, { childList: true, subtree: true });
        }
        catch (e) { }
    }

    /* ───────── (c) 分析・レポートの数え方の注記 ─────────
       auto-M08：受注だけの記録でも「サンプル発送 1」になる（受注まで進んだ記録を、通った段として数えている）→ 数え方に書く
       health-M11・other-M07：「見積を出している案件 0件」なのに見積金額がある（金額は、送っていない下書きの見積書も足している）→ 数え方に書く */
    if (typeof v73dashFunnelNote === "function") {
        const __fn = v73dashFunnelNote;
        v73dashFunnelNote = function (this: any) {
            const r = __fn.apply(this, arguments as any);
            try { if (typeof r === "string" && r && r.indexOf("通った段") < 0) return r + M("「サンプル発送」には、状況が「受注」の記録も入ります（先の段まで進んだ記録は、通った段として数えています。サンプルを送っていない取引もここに入ります）。", " “Samples sent” also counts records whose status is “Order” (records that went further are counted as having passed this stage)."); } catch (e) { }
            return r;
        };
    }
    if (typeof v90anaDashNotes === "function") {
        const __dn = v90anaDashNotes;
        v90anaDashNotes = function (this: any) {
            let h = __dn.apply(this, arguments as any);
            try {
                if (typeof h === "string") h = h.replace(/(数え方：価格を出した商談の記録（\d+件）。)金額は見積書（PI）の合計/, "$1金額は、案件ごとに作った見積書（PI）の合計です（まだ相手に送っていない下書きも入ります。件数は商談の記録、金額は見積書から数えるので、0件でも金額が出ることがあります）");
            }
            catch (e) { }
            return h;
        };
    }

    /* ───────── (g) そのほか ───────── */
    /* medical-M05・other-M01・health-M12：会議メモの宿題（内蔵の抽出）
       ・担当：かっこの中の語をそのまま担当にしない。「担当：◯◯」と書いたかっこ・メンバーの名前・「◯◯さん」・行の頭の「名前：」だけから取る
       ・1行に文が2つ以上あるときは文ごとに分ける。期限は「◯/◯ までに」の日付を先に取る */
    const GEN_WHO = /^(宿題|課題|決定|決定事項|議題|メモ|備考|次回|対応|確認|TODO|ToDo|todo|日時|場所|参加者|出席者|当社|弊社|自社|貴社|先方|相手|バイヤー|当方|共通|全員|各自|その他|補足|注|注意|要確認|PI|CI|PL|BL|B\/L|CFS|HS|FOB|CIF|NDA|MOQ|EPA|L\/C|T\/T)$/;
    if (typeof memoSumLocal === "function") {
        const __ml = memoSumLocal;
        memoSumLocal = function (this: any, text: any) {
            let tx = String(text || "");
            try { tx = tx.replace(/\r/g, "").split("\n").map((l) => ((l.match(/。/g) || []).length >= 2 || (/。./.test(l) && /までに/.test(l))) ? l.split(/(?<=。)/).map((x) => x.trim()).filter(Boolean).join("\n") : l).join("\n"); } catch (e) { tx = String(text || ""); }
            const r = __ml.call(this, tx);
            try {
                const isMem = (w: string) => { try { return typeof v56dMatchMember === "function" ? !!v56dMatchMember(w) : false; } catch (e) { return false; } };
                (r && Array.isArray(r.todo) ? r.todo : []).forEach((t: any) => {
                    const l = String(t.t || "");
                    let who = "";
                    const p = l.match(/[（(]\s*(?:担当者|担当|責任者|owner)\s*[：:]\s*([^（()）]{1,12})[)）]/i);
                    if (p) who = p[1].trim();
                    if (!who) { const q = l.match(/[（(]([^（()）]{1,12})[)）]/); const c = q ? q[1].trim() : ""; if (c && !GEN_WHO.test(c) && (isMem(c) || /(さん|氏|様|部長|課長|社長|担当)$/.test(c))) who = c; }
                    if (!who) { const h = l.match(/^([^\s：:、。（(]{1,10}?)(さん|氏|様)?\s*[：:]/); const c = h ? h[1].trim() : ""; if (c && !GEN_WHO.test(c) && !/^\d/.test(c) && (isMem(c) || !!h![2] || /^[一-鿿]{2,4}$/.test(c) || /^[A-Z][a-z]+$/.test(c))) who = c; }
                    if (!who) { const s = l.match(/([^\s：:、。（(は]{1,8})(さん|氏)[がはにも]/); if (s && !GEN_WHO.test(s[1])) who = s[1]; }
                    t.who = who;
                    const dm = l.match(/(\d{1,2}\/\d{1,2}|\d{1,2}月\d{1,2}日)\s*(?:（[^）]{1,3}）)?\s*(?:まで|迄|締切|〆)/);
                    if (dm) t.due = dm[1];
                });
            }
            catch (e) { warn("memo", e); }
            return r;
        };
    }
    /* medical-M10：「返信をシミュレート（体験用）」を押しても変化が見えないとき、理由を知らせる */
    if (typeof bmSimulate === "function") {
        const __sim = bmSimulate;
        bmSimulate = function (this: any, id: any) {
            const [, th0] = thFind(id);
            const n0 = th0 && Array.isArray(th0.msgs) ? th0.msgs.length : 0;
            let done = false;
            const slow = setTimeout(() => { if (!done) { try { toast(M("🧪 返信の見本を作っています…（しばらくお待ちください）", "🧪 Creating a sample reply… please wait")); } catch (e) { } } }, 6000);
            let r: any;
            try { r = __sim.apply(this, arguments as any); } catch (e) { done = true; clearTimeout(slow); throw e; }
            const fin = () => {
                done = true; clearTimeout(slow);
                try {
                    const [, th] = thFind(id);
                    const n1 = th && Array.isArray(th.msgs) ? th.msgs.length : 0;
                    if (n1 <= n0) toast(M("この環境では、返信の見本を入れられませんでした（スレッドは変わっていません）。", "A sample reply could not be added in this environment (the thread is unchanged)."));
                    else {
                        const box = document.getElementById("dmThread");
                        if (box) { box.scrollTop = box.scrollHeight; const last: any = box.lastElementChild; if (last) { last.style.outline = "2px solid var(--or,#f08300)"; last.style.borderRadius = "10px"; setTimeout(() => { try { last.style.outline = ""; } catch (e) { } }, 2600); } }
                    }
                }
                catch (e) { }
            };
            try { Promise.resolve(r).then(fin, fin); } catch (e) { fin(); }
            return r;
        };
    }
    /* medical-N13・culture-M01・indagri-M08：窓のいちばん上の見出しが、右上の「拡大」ボタンの下に入る → 見出しの右を空ける */
    function headPad() {
        try {
            const pn = document.getElementById("pn"), mx = document.getElementById("dwmax");
            if (!pn || !mx) return;
            const mr = mx.getBoundingClientRect();
            if (!mr.width) return;
            const hs = Array.from(pn.querySelectorAll("h2, h3, h4")).slice(0, 3) as any[];
            hs.forEach((h) => {
                const r = h.getBoundingClientRect();
                if (!r.width || r.bottom < mr.top || r.top > mr.bottom || r.right < mr.left) return;
                const need = Math.ceil(r.right - mr.left) + 12;
                const cur0 = parseFloat(getComputedStyle(h).paddingRight) || 0;
                if (need > cur0) { h.style.paddingRight = need + "px"; h.style.boxSizing = "border-box"; }
            });
        }
        catch (e) { }
    }
    /* auto-M05：取り込んだ情報の 🗑 が、確かめなしで消える（ゴミ箱にも記録にも入らない）→ 消す前に確かめ、操作の記録に残す */
    try { if (typeof V33AU_ACT !== "undefined" && V33AU_ACT && !V33AU_ACT.src_del) V33AU_ACT.src_del = "取り込んだ情報を削除"; } catch (e) { }
    document.addEventListener("click", (ev: any) => {
        try {
            const b = ev.target && ev.target.closest ? ev.target.closest("[data-srcdel]") : null;
            if (!b || b.dataset.r3aok) return;
            let nm = "";
            try { const x = (typeof srcList === "function") ? srcList()[+b.dataset.srcdel] : null; nm = String((x && x.name) || ""); } catch (e) { }
            const ok = window.confirm(M(`「${nm}」を、取り込んだ情報から削除しますか？\n\n・AI商社マンの参照からも外れます\n・この削除はゴミ箱に入らず、元に戻せません（もう一度アップロードすれば入れ直せます）\n・登録済みの商品情報は消えません`, `Delete “${nm}” from imported sources?\n\nThis cannot be undone (it does not go to the trash). Registered product information is kept.`));
            if (!ok) { ev.preventDefault(); ev.stopImmediatePropagation(); ev.stopPropagation(); return; }
            try { if (typeof v33AuLog === "function") v33AuLog("src_del", nm); } catch (e) { }
        }
        catch (e) { warn("srcdel", e); }
    }, true);
    /* daily-M07：「入金の予定をタスクに入れる」がタスクの画面の先頭に移るだけ → タスクの新規作成の窓を、題「入金の確認：」つきで開く */
    API.payTask = function () {
        try {
            if (W.RDX && typeof W.RDX.goKey === "function") W.RDX.goKey("task"); else go("task");
            setTimeout(() => {
                try {
                    if (typeof k30New !== "function") return;
                    k30New();
                    const S = dd() && dd().ship;
                    const inp: any = document.getElementById("k30nn");
                    if (inp && !inp.value) { inp.value = M("入金の確認：", "Check payment: ") + (S && S.buyer && !isSmpShip(S) ? String(S.buyer) + (S.no ? "（" + S.no + "）" : "") : ""); try { inp.focus(); } catch (e) { } }
                    toast(M("入金の予定日を「終了日（期限）」に入れて保存すると、タスクと通知に出ます。", "Set the expected payment date as the due date and save."));
                }
                catch (e) { warn("payTask", e); }
            }, 500);
        }
        catch (e) { warn("payTask", e); }
    };
    document.addEventListener("click", (ev: any) => {
        try {
            const b = ev.target && ev.target.closest ? ev.target.closest('[data-act="v90reg.task"]') : null;
            if (!b) return;
            ev.preventDefault(); ev.stopImmediatePropagation(); ev.stopPropagation();
            API.payTask();
        }
        catch (e) { }
    }, true);

    /* indagri-M04：商談を保存したあと別の画面へ移ると「入力の途中のパネルを閉じました…続きを開く／入力を消す」と出る（保存は済んでいる）
       → 保存が済んだら、書きかけの扱いにしない */
    if (typeof dealSave === "function") {
        const __dsv = dealSave;
        dealSave = function (this: any) {
            const cnt = () => { try { const t = ten(); return ((t && Array.isArray(t.fbx)) ? t.fbx.length : 0) + ((dd() && Array.isArray(dd().fb)) ? dd().fb.length : 0); } catch (e) { return 0; } };
            const n0 = cnt();
            const r = __dsv.apply(this, arguments as any);
            const fin = () => { try { if (cnt() > n0 && typeof V56UI !== "undefined" && V56UI) { V56UI.dirty = 0; if (V56UI.stash && typeof v56uiDrop === "function") v56uiDrop(); } } catch (e) { } };
            try { fin(); setTimeout(fin, 0); if (r && typeof r.then === "function") r.then(fin, fin); } catch (e) { }
            return r;
        };
    }

    /* ───────── 描いたあと ───────── */
    if (typeof render === "function") {
        const __rn = render;
        render = function (this: any) {
            rowsC = null;
            try { shipPick(); } catch (e) { }
            const r = __rn.apply(this, arguments as any);
            try { nameLater(); rmWatch(); rmWords(); } catch (e) { }
            return r;
        };
    }
    if (typeof openDMThread === "function") {
        const __od = openDMThread;
        openDMThread = function (this: any) { const r = __od.apply(this, arguments as any); try { dmHead(); nameLater(); headPad(); setTimeout(headPad, 200); } catch (e) { } return r; };
    }
    if (typeof openDW === "function") {
        const __ow = openDW;
        openDW = function (this: any) { const r = __ow.apply(this, arguments as any); try { nameLater(); headPad(); setTimeout(headPad, 200); } catch (e) { } return r; };
    }
})();
