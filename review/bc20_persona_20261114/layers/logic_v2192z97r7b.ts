/* 21.92 r7b：7巡目の直し（AIバイヤー開拓と受信箱〔確認・承認〕・物流会社の見積）。本体の層。今の関数は包むだけ・保存の形は変えない
   A  リストの相手の ID は必ず別々（daily-S03）。もとの ID は「時刻（ミリ秒）＋乱数2文字（1,296通り）」で、10社を同じミリ秒に作ると約3%で2社が同じ ID になり、
      チェック・文面・送信の記録が2社で混ざっていた。作るときに重ならないことを確かめ、前に保存されたリストの重なりも読み込んだときに直す
   B  「同じ会社」は1か所（v79obDom）で決める（xcut-S01・auto-S03）。見本・予約済みのドメイン（example.com／.org／.net・*.example・.test・.invalid）、
      フリーメール、会社のサイトではない場所（SNS・モール）は、ドメインでは会社を表さないので、相手（会社名＋メールの全体／サイトの場所）で見る。
      実在の会社のドメインは今までどおり（同じ会社への初回は 90日に1回・配信停止・「合わない」で外した会社）
   C  「いまの次の手順」（v92r6a.now）：承認待ちの初回の営業メールがある間は「受信箱で承認して送る（N件）」（indagri-S04）。受信箱の「次は」も同じ出どころ（auto-S01・daily-S04・xcut-S06）
   D  「規制を調べる」は、調べる枠の中を実際に操作したときだけ済み（culture-N17）。見ただけ（4秒）では済みにしない
   E  販売先国の確定の確かめを、ブラウザ標準の窓からアプリの窓に（xcut-S06 (3)）
   F  商談を記録する窓：バイヤー名の候補（登録済みのバイヤー）。見本の印だけ違う名前は同じ相手にまとめる（xcut-S06 (1)）
   G  物流：情勢の見込み（日数）と情勢メモは、その輸送の形に当たるものだけ（other-S02）。海上の事情（紅海・喜望峰の迂回・抜港・積替 など）は、航空・クーリエの見積に足さない
   H  物流：THC等諸掛・書類費は、この版では一律の固定額（other-S01）。「決まった式で出す」という前の文を事実どおりに。AI物流マンが決まり方に答える。英・中・西の質問にも
   I  物流：中国語の見積受信箱に「担当・状態」の列と絞り込み（xcut-S07）／「回答の金額を直す」の窓の中国語・スペイン語・英語（xcut-S05・other-S05）
   数字・規制の中身は足していない */
declare const TEN: any, TENS: any, SES: any, I18N: any, FWDON: any, V79OB_DUPDAYS: any, FWD_THC: any, FWD_DOC: any, V84C: any, FWD_POD: any;
declare let v71obId: any, v79obDom: any, v79obSupHit: any, v79obDup: any, v79obGate: any, v84cObItems: any, v71obSt: any, ctyConfirm: any, openDealForm: any, dealSave: any;
declare let render: any, fwdSituFor: any, fwdLegBuild: any, fwdScoreOffers: any, v68fDelay: any, fwdLaneAgg: any, fwdRender: any, fwdBrain: any, fwdAsk: any, v90fAnsOpen: any, v33FwdInbox: any, FWDB: any, i18nStr: any;
declare function v71obMail(s: any): any;
declare function v79obSupAll(): any[];
declare function v79obHost(u: any): string;
declare function myBuyers(): any[];
declare function dmThreads(): any;
declare function v84qItems(): any[];
declare function fwdSave(): void;
(function () {
    const W: any = window;
    if (W.__v2192r7b) return;
    W.__v2192r7b = 1;
    const API: any = (W.v92r7b = W.v92r7b || {});
    const LG = () => { try { return (typeof I18N !== "undefined" && I18N && I18N.lang) || document.documentElement.lang || "ja"; } catch (e) { return "ja"; } };
    const L2 = () => String(LG()).slice(0, 2);
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = L2(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as any)[c]));
    const warn = (k: string, e: any) => { try { console.warn("[21.92 r7b] " + k, e); } catch (x) { } };
    const el = (id: string) => document.getElementById(id);
    API.M = M;

    /* ═════ A. リストの相手の ID は必ず別々 ═════ */
    const obRuns = (): any[] => { try { return typeof v71obSt === "function" ? ((v71obSt() || {}).runs || []) : []; } catch (e) { return []; } };
    try {
        if (typeof v71obId === "function") {
            const __id = v71obId;
            const issued: any = {};
            const taken = (id: string) => { if (issued[id]) return true; for (const r of obRuns()) for (const x of (r.leads || [])) if (x && x.id === id) return true; return false; };
            v71obId = function (this: any) {
                let id = "";
                for (let k = 0; k < 40; k++) { const c = String(__id.apply(this, arguments as any)); if (!taken(c)) { id = c; break; } }
                if (!id) { let n = 0; const b = String(__id.apply(this, arguments as any)); do { id = b + (n++).toString(36).toUpperCase(); } while (taken(id)); }
                issued[id] = 1;
                return id;
            };
        }
    } catch (e) { warn("id", e); }
    // 前に保存されたリストの中の重なり：あとの行に新しい ID を付ける（文面・送信の記録は ID の先頭の行に付いていたので、そのまま先頭の行のもの）
    let dupSig = "";
    function fixDupIds() {
        try {
            const R = obRuns();
            const sig = R.length + ":" + R.reduce((a: number, r: any) => a + ((r && r.leads) || []).length, 0);
            if (sig === dupSig) return 0;
            dupSig = sig;
            const seen: any = {};
            let n = 0;
            R.forEach((r: any) => ((r && r.leads) || []).forEach((x: any) => {
                if (!x || !x.id) return;
                if (seen[x.id]) { x.v92r7bId0 = x.id; x.id = typeof v71obId === "function" ? v71obId() : x.id + "X" + n; n++; }
                seen[x.id] = 1;
            }));
            return n;
        } catch (e) { return 0; }
    }
    API.fixDupIds = fixDupIds;
    try {
        if (typeof v71obSt === "function") {
            const __st = v71obSt;
            let busy = 0;
            v71obSt = function (this: any) {
                const S = __st.apply(this, arguments as any);
                if (!busy) { busy = 1; try { fixDupIds(); } catch (e) { } busy = 0; }
                return S;
            };
        }
    } catch (e) { warn("st", e); }

    /* ═════ B. 「同じ会社」の決め方（1か所） ═════ */
    const RESV = /(^|\.)example\.(com|org|net|co\.jp|jp)$|(^|\.)(example|test|invalid|localhost)$/;
    const FREE: any = {};
    ("gmail.com googlemail.com yahoo.com yahoo.co.jp yahoo.co.uk yahoo.fr yahoo.de yahoo.com.sg yahoo.com.hk yahoo.com.tw ymail.com outlook.com outlook.jp hotmail.com hotmail.co.jp hotmail.co.uk hotmail.fr live.com live.jp msn.com icloud.com me.com mac.com aol.com " +
        "proton.me protonmail.com gmx.com gmx.de gmx.net web.de mail.com mail.ru yandex.com yandex.ru zoho.com qq.com 163.com 126.com sina.com sina.cn foxmail.com naver.com daum.net hanmail.net kakao.com rediffmail.com " +
        "docomo.ne.jp ezweb.ne.jp au.com softbank.ne.jp i.softbank.jp nifty.com ocn.ne.jp biglobe.ne.jp so-net.ne.jp " +
        "facebook.com fb.com instagram.com linkedin.com x.com twitter.com youtube.com tiktok.com line.me wa.me whatsapp.com wechat.com t.me linktr.ee " +
        "wixsite.com wordpress.com blogspot.com business.site sites.google.com google.com myshopify.com shopify.com alibaba.com aliexpress.com amazon.com amazon.co.jp etsy.com ebay.com rakuten.co.jp tmall.com taobao.com lazada.com shopee.com")
        .split(/\s+/).forEach((d) => { if (d) FREE[d] = 1; });
    // そのドメインは会社を表さない（見本・予約済み／フリーメール／SNS・モール）
    const nonCo = (d: string) => { d = String(d || "").toLowerCase(); return !!d && (RESV.test(d) || !!FREE[d]); };
    const nmKey = (s: any) => String(s || "").replace(/^\[見本\]\s*/, "").replace(/（見本）\s*$/, "").toLowerCase().replace(/[\s.,'’"“”()（）・\-_/&]+/g, "");
    const mailOf = (L: any): string => { try { return String((typeof v71obMail === "function" ? v71obMail((L && L.contact) || "") : "") || "").toLowerCase(); } catch (e) { return ""; } };
    const hostOf = (u: any): string => { try { return typeof v79obHost === "function" ? String(v79obHost(u) || "") : ""; } catch (e) { return ""; } };
    // 相手を表すキー：会社名＋メールの全体（メールが無ければ、会社名＋サイトの場所）
    const partyKey = (L: any): string => {
        const m = mailOf(L);
        if (m) return nmKey(L.name || L.co) + "｜" + m;
        let u = String((L && (L.url || (L.v79f && L.v79f.url))) || "").toLowerCase().replace(/^https?:\/\//, "").replace(/[?#].*$/, "").replace(/\/+$/, "");
        if (!u) u = hostOf(L && L.contact);
        return nmKey(L.name || L.co) + "｜" + u;
    };
    const PARTY: any = {};   // キー → 画面に出す言葉（メール／サイト）
    const partyShow = (L: any) => mailOf(L) || hostOf(L && (L.url || (L.v79f && L.v79f.url))) || String((L && L.name) || "");
    let __dom0: any = null;
    try {
        if (typeof v79obDom === "function") {
            __dom0 = v79obDom;
            v79obDom = function (this: any, L: any) {
                const d = __dom0.apply(this, arguments as any);
                try { if (L && d && nonCo(d)) { const k = partyKey(L); PARTY[k] = partyShow(L); return k; } } catch (e) { }
                return d;
            };
        }
    } catch (e) { warn("dom", e); }
    API.sameCoKey = (L: any) => { try { return typeof v79obDom === "function" ? v79obDom(L) : ""; } catch (e) { return ""; } };
    API.nonCo = nonCo;
    const isParty = (L: any) => { try { return !!(__dom0 && L && nonCo(__dom0(L))); } catch (e) { return false; } };
    // 送らない一覧：前の版で「ドメイン」で入れた分（example.com・gmail.com など）は、同じメールのときだけ当てる
    try {
        if (typeof v79obSupHit === "function") {
            const __sh = v79obSupHit;
            v79obSupHit = function (this: any, L: any) {
                const r = __sh.apply(this, arguments as any);
                if (r) return r;
                try {
                    if (isParty(L) && typeof v79obSupAll === "function") {
                        const m = mailOf(L);
                        if (m) return v79obSupAll().find((x: any) => x && nonCo(String(x.d || "")) && String(x.a || "").toLowerCase() === m) || null;
                    }
                } catch (e) { }
                return r;
            };
        }
    } catch (e) { warn("sup", e); }
    // 同じ相手への二重の初回：登録済みのバイヤーとのやりとりも、相手（会社名＋メール）で見る
    try {
        if (typeof v79obDup === "function") {
            const __du = v79obDup;
            v79obDup = function (this: any, L: any) {
                const r = __du.apply(this, arguments as any);
                if (r) return r;
                try {
                    if (isParty(L) && typeof myBuyers === "function") {
                        const k = partyKey(L);
                        const lim = Date.now() - (typeof V79OB_DUPDAYS !== "undefined" ? +V79OB_DUPDAYS : 90) * 864e5;
                        const TH = typeof dmThreads === "function" ? (dmThreads() || {}) : {};
                        for (const b of myBuyers()) {
                            if (!b || b.id === L.myId) continue;
                            if (partyKey({ name: b.co, contact: b.contact, url: b.url }) !== k) continue;
                            const th = TH[b.id];
                            const m = th && (th.msgs || []).find((x: any) => x && x.w === "me" && (+x.at || 0) >= lim);
                            if (m) return { at: m.at, nm: b.co };
                        }
                    }
                } catch (e) { }
                return r;
            };
        }
    } catch (e) { warn("dup", e); }
    // 断るときの文：キーではなく、相手のメール／サイトを出す
    try {
        if (typeof v79obGate === "function") {
            const __g = v79obGate;
            v79obGate = function (this: any, L: any) {
                const r = __g.apply(this, arguments as any);
                try {
                    if (r && r.k === "dup" && isParty(L)) {
                        const k = partyKey(L);
                        r.t = String(r.t).split("（" + k + "）").join("（" + partyShow(L) + "）").split("(" + k + ")").join("(" + partyShow(L) + ")")
                            .replace("この会社（", "この相手（").replace("同じ会社への初回は", "同じ相手への初回は");
                    }
                } catch (e) { }
                return r;
            };
        }
    } catch (e) { warn("gate", e); }
    try {
        if (typeof v84cObItems === "function") {
            const __oi = v84cObItems;
            v84cObItems = function (this: any) {
                const out = __oi.apply(this, arguments as any);
                try {
                    (out || []).forEach((it: any) => {
                        if (it && it.diffHtml && /同じ会社（ドメイン）/.test(it.diffHtml)) {
                            let L: any = null;
                            for (const r of obRuns()) { L = (r.leads || []).find((x: any) => x && x.id === it.lead); if (L) break; }
                            if (L && isParty(L)) it.diffHtml = String(it.diffHtml).replace("同じ会社（ドメイン）", M("同じ相手（会社名とメール）", "the same party (company name and e-mail)", "同一对象（公司名称与邮箱）", "la misma contraparte (nombre y correo)"));
                        }
                    });
                } catch (e) { }
                return out;
            };
        }
    } catch (e) { warn("obitems", e); }

    /* ═════ C. いまの次の手順：承認待ちの初回の営業メールがある間は、受信箱で承認 ═════ */
    let pendC = { t: 0, n: 0, key: "" };
    API.pending = function () {
        try {
            const now = Date.now();
            if (now - pendC.t < 350) return pendC;
            let Q: any[] = [];
            if (typeof v84qItems === "function") Q = (v84qItems() || []).filter((x: any) => x && x.src === "ob" && x.i === 0);
            pendC = { t: now, n: Q.length, key: Q.length ? String(Q[0].key) : "" };
        } catch (e) { pendC = { t: Date.now(), n: 0, key: "" }; }
        return pendC;
    };
    API.pendingReset = () => { pendC.t = 0; };
    try {
        const A6: any = W.v92r6a;
        if (A6 && typeof A6.now === "function" && !A6.__r7b) {
            A6.__r7b = 1;
            const now0 = A6.now;
            A6.now = function (this: any) {
                const N = now0.apply(this, arguments as any);
                try {
                    if (N && N.next && N.next.id === "buyer") {
                        const P = API.pending();
                        if (P.n > 0) {
                            // idx は「どの画面の手順か」の番号。AIバイヤー開拓（4）でも商談（5）でもない所＝受信箱 を指すので、間の値にする（どの画面でも「次は」は受信箱へ移る）
                            return Object.assign({}, N, {
                                idx: 4.5, key: "inbox", r7b: "inbox", pend: P.n, pendKey: P.key,
                                label: M(`受信箱で承認して送る（${P.n}件）`, `Approve & send in the inbox (${P.n})`, `在收件箱确认后发送（${P.n}件）`, `Aprobar y enviar en la bandeja (${P.n})`)
                            });
                        }
                    }
                } catch (e) { }
                return N;
            };
        }
    } catch (e) { warn("now", e); }
    // 受信箱の「確認・承認」を、承認待ちの営業メールの所で開く
    API.openApprove = function () {
        try {
            const P = API.pending();
            const f: any = (W as any).v84qOpen;
            if (typeof f === "function") { f(P.key || ""); return true; }
        } catch (e) { }
        return false;
    };

    /* ═════ D. 規制を調べる：枠の中を実際に操作したときだけ済み ═════ */
    try {
        const A6: any = W.v92r6a;
        if (A6 && typeof A6.regLook === "function") {
            const rl = A6.regLook;
            let allow = 0;
            A6.regLook = function (this: any) { if (!allow) return false; return rl.apply(this, arguments as any); };
            API.regOp = function () { allow = 1; try { return !!rl.call(A6); } catch (e) { return false; } finally { allow = 0; } };
        }
    } catch (e) { warn("reg", e); }

    /* ═════ アプリの確認の窓（E で使う） ═════ */
    function askBox(msg: string, onOk: () => void, onNo?: () => void) {
        try {
            const old = el("v92r7b-ask"); if (old) old.remove();
            if (!el("v92r7b-css")) {
                const st = document.createElement("style"); st.id = "v92r7b-css";
                st.textContent = "#v92r7b-ask{position:fixed;inset:0;z-index:99990;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;padding:16px}" +
                    "#v92r7b-ask .v92r7b-box{background:#fff;color:#1f2937;border-radius:14px;max-width:520px;width:100%;max-height:86vh;overflow:auto;padding:20px 22px;box-shadow:0 18px 50px rgba(0,0,0,.28);font-size:14.5px;line-height:1.75}" +
                    "#v92r7b-ask h3{margin:0 0 8px;font-size:16.5px}#v92r7b-ask p{margin:0 0 6px;white-space:pre-wrap}" +
                    "#v92r7b-ask .v92r7b-row{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:14px}" +
                    "#v92r7b-ask button{min-height:44px;padding:8px 18px;border-radius:10px;border:1.5px solid #d1d5db;background:#fff;font:700 14.5px/1.3 inherit;cursor:pointer}" +
                    "#v92r7b-ask button.ok{background:#F08A1C;border-color:#F08A1C;color:#fff}" +
                    "@media (max-width:520px){#v92r7b-ask .v92r7b-row button{flex:1 1 100%}}";
                document.head.appendChild(st);
            }
            const parts = String(msg).split(/\n\n+/);
            const d = document.createElement("div");
            d.id = "v92r7b-ask"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("data-noi18n", "1");
            d.innerHTML = `<div class="v92r7b-box"><h3>${E(parts[0].split("\n")[0])}</h3>${[parts[0].split("\n").slice(1).join("\n")].concat(parts.slice(1)).filter((x) => x.trim()).map((x) => `<p>${E(x)}</p>`).join("")}` +
                `<div class="v92r7b-row"><button type="button" class="no">${E(M("やめる", "Cancel", "取消", "Cancelar"))}</button><button type="button" class="ok">${E(M("確定する", "Confirm", "确定", "Confirmar"))}</button></div></div>`;
            const close = () => { try { d.remove(); document.removeEventListener("keydown", key, true); } catch (e) { } };
            const key = (ev: any) => { if (ev.key === "Escape") { ev.stopPropagation(); close(); if (onNo) onNo(); } };
            (d.querySelector(".ok") as any).addEventListener("click", () => { close(); onOk(); });
            (d.querySelector(".no") as any).addEventListener("click", () => { close(); if (onNo) onNo(); });
            d.addEventListener("click", (ev) => { if (ev.target === d) { close(); if (onNo) onNo(); } });
            document.addEventListener("keydown", key, true);
            document.body.appendChild(d);
            try { (d.querySelector(".ok") as any).focus(); } catch (e) { }
        } catch (e) { warn("ask", e); if (window.confirm(msg)) onOk(); else if (onNo) onNo(); }
    }
    API.askBox = askBox;

    /* ═════ E. 販売先国の確定：確かめはアプリの窓で ═════ */
    try {
        if (typeof ctyConfirm === "function") {
            const __cc = ctyConfirm;
            ctyConfirm = function (this: any) {
                const self = this, args = arguments as any;
                const yes: any = {};
                const runOnce = (): any => {
                    const c0 = window.confirm;
                    let asked = "";
                    (window as any).confirm = function (m: any) { const s = String(m == null ? "" : m); if (yes[s]) return true; asked = asked || s; return false; };
                    let r: any;
                    try { r = __cc.apply(self, args); } finally { (window as any).confirm = c0; }
                    if (asked) askBox(asked, () => { yes[asked] = 1; runOnce(); });
                    return r;
                };
                return runOnce();
            };
        }
    } catch (e) { warn("cty", e); }

    /* ═════ F. 商談を記録する窓：バイヤー名の候補 ═════ */
    const buyersNow = (): any[] => { try { return typeof myBuyers === "function" ? (myBuyers() || []).filter((b: any) => b && b.co) : []; } catch (e) { return []; } };
    try {
        if (typeof openDealForm === "function") {
            const __odf = openDealForm;
            openDealForm = function (this: any) {
                const r = __odf.apply(this, arguments as any);
                try {
                    const inp: any = el("dfB");
                    if (inp && !inp.getAttribute("list")) {
                        const B = buyersNow();
                        if (B.length) {
                            const dl = document.createElement("datalist"); dl.id = "v92r7bBL";
                            const seen: any = {};
                            dl.innerHTML = B.filter((b: any) => { const k = String(b.co); if (seen[k]) return false; seen[k] = 1; return true; }).slice(0, 200).map((b: any) => `<option value="${E(b.co)}">${E(b.cty || "")}</option>`).join("");
                            inp.insertAdjacentElement("afterend", dl);
                            inp.setAttribute("list", "v92r7bBL");
                            inp.setAttribute("autocomplete", "off");
                            const note = document.createElement("small");
                            note.setAttribute("data-noi18n", "1");
                            note.style.cssText = "display:block;margin:3px 0 0;font-size:11.5px;color:var(--ink-3,#6b7280)";
                            note.textContent = M(`登録済みのバイヤー ${B.length}社から選べます（欄を押すと候補が出ます）。新しい相手は、そのまま名前を入れてください`, `Pick from your ${B.length} registered buyer(s) (click the field for suggestions), or type a new name`, `可从已登记的 ${B.length} 家买家中选择（点击输入栏显示候选），新对象请直接输入名称`, `Elija entre sus ${B.length} compradores registrados (pulse el campo) o escriba un nombre nuevo`);
                            dl.insertAdjacentElement("afterend", note);
                            const fill = () => {
                                try {
                                    const v = String(inp.value).trim();
                                    let b = B.find((x: any) => String(x.co) === v);
                                    if (!b && v) { const hit = B.filter((x: any) => nmKey(x.co) === nmKey(v)); if (hit.length === 1) b = hit[0]; }
                                    const c: any = el("dfC");
                                    if (b && b.cty && c && !String(c.value || "").trim()) { c.value = b.cty; c.dispatchEvent(new Event("input", { bubbles: true })); c.dispatchEvent(new Event("change", { bubbles: true })); }
                                } catch (e) { }
                            };
                            inp.addEventListener("change", fill); inp.addEventListener("input", fill);
                        }
                    }
                } catch (e) { warn("dealform", e); }
                return r;
            };
        }
        if (typeof dealSave === "function") {
            const __ds = dealSave;
            dealSave = function (this: any) {
                try {
                    const inp: any = el("dfB");
                    const v = inp ? String(inp.value || "").trim() : "";
                    if (v) {
                        const B = buyersNow();
                        if (!B.some((b: any) => String(b.co) === v)) {
                            const k = nmKey(v);
                            const hit = B.filter((b: any) => nmKey(b.co) === k);
                            if (k && hit.length === 1) inp.value = hit[0].co;   // 「（見本）」の印・空白・大文字小文字だけ違う名前は、登録済みの相手にまとめる
                        }
                    }
                } catch (e) { warn("dealsave", e); }
                return __ds.apply(this, arguments as any);
            };
        }
    } catch (e) { warn("deal", e); }

    /* ═════ G. 物流：情勢の見込みは、その輸送の形に当たるものだけ ═════ */
    const modeKind = (m: any) => { const s = String(m || "").toUpperCase(); return /COURIER|クーリエ/.test(s) ? "cr" : /AIR|航空/.test(s) ? "air" : "sea"; };
    // 海上だけの事情（航路・港・船・コンテナ）。航空の言葉が入っているメモは、航空にも当てる
    const seaOnly = (t: any) => { const s = String(t || ""); return /紅海|喜望峰|迂回|抜港|航路|海上|本船|コンテナ|ＣＦＳ|CFS|港湾|港の混雑|積替|スペースが逼迫|スエズ|パナマ運河|船腹|船社|red sea|cape of good hope|vessel|container|port congestion|transship/i.test(s) && !/航空|エア|空港|フライト|\bAIR\b|air ?freight|airport|flight/i.test(s); };
    API.seaOnly = seaOnly; API.modeKind = modeKind;
    const offersKind = (offers: any[], reqMode?: any) => {
        const O = (offers || []).filter((o: any) => o && (o.rate || o.mode));
        if (!O.length) return modeKind(reqMode) === "sea" ? "sea" : "air";
        return O.every((o: any) => modeKind((o.rate && o.rate.mode) || o.mode) !== "sea") ? "air" : "sea";
    };
    let CM = "";   // いま組んでいる見積の輸送の形（"air" の間は、海上だけの事情を当てない）
    try {
        if (typeof fwdSituFor === "function") {
            const __sf = fwdSituFor;
            fwdSituFor = function (this: any) {
                const L = __sf.apply(this, arguments as any);
                try { if (CM === "air" && Array.isArray(L)) return L.filter((x: any) => !(x && seaOnly(x.t))); } catch (e) { }
                return L;
            };
        }
        if (typeof fwdScoreOffers === "function") {
            const __so = fwdScoreOffers;
            fwdScoreOffers = function (this: any, rs: any, mode: any, cbm: any, etd: any, situ: any) {
                try {
                    if (Array.isArray(situ) && situ.some((x: any) => x && seaOnly(x.t)) && Array.isArray(rs) && rs.length && rs.every((r: any) => modeKind(r && r.mode) !== "sea"))
                        return __so.call(this, rs, mode, cbm, etd, situ.filter((x: any) => !(x && seaOnly(x.t))));
                } catch (e) { }
                return __so.apply(this, arguments as any);
            };
        }
        if (typeof fwdLegBuild === "function") {
            const __lb = fwdLegBuild;
            fwdLegBuild = function (this: any, cty: any, pod: any, mode: any) {
                const l = __lb.apply(this, arguments as any);
                try {
                    if (CM) return l;
                    const k = l && l.ok ? offersKind(l.offers, mode) : (modeKind(mode) === "sea" ? "sea" : "air");
                    if (l && k === "air" && Array.isArray(l.situ) && l.situ.some(seaOnly)) {
                        CM = "air";
                        try { return __lb.apply(this, arguments as any); } finally { CM = ""; }
                    }
                } catch (e) { CM = ""; }
                return l;
            };
        }
        if (typeof v68fDelay === "function") {
            const __vd = v68fDelay;
            v68fDelay = function (this: any, x: any) {
                let air = false;
                try { air = !!x && (Array.isArray(x.offers) && x.offers.length ? offersKind(x.offers) === "air" : modeKind(x.mode || (x.recQ && x.recQ.mode)) !== "sea"); } catch (e) { }
                if (!air || CM) return __vd.apply(this, arguments as any);
                CM = "air";
                try { return __vd.apply(this, arguments as any); } finally { CM = ""; }
            };
        }
        if (typeof fwdLaneAgg === "function") {
            const __la = fwdLaneAgg;
            fwdLaneAgg = function (this: any) {
                const A = __la.apply(this, arguments as any);
                try { if (Array.isArray(A)) A.forEach((x: any) => { if (x && modeKind(x.mode) !== "sea" && Array.isArray(x.situ)) x.situ = x.situ.filter((t: any) => !seaOnly(t)); }); } catch (e) { }
                return A;
            };
        }
    } catch (e) { warn("situ", e); }
    // 前に保存された見積（航空・クーリエの区間に、海上の見込みが足されたもの）：読み込んだときに、同じ決め方に直す
    const fixWhyAir = (s: string, d: number): string | null => {
        s = String(s);
        if (/^情勢：/.test(s)) {
            const body = s.replace(/^情勢：/, "").replace(/（逼迫区間のため最速案に加点）$/, "");
            const keep = body.split("／").filter((p) => p && !seaOnly(p));
            return keep.length ? "情勢：" + keep.join("／") : null;
        }
        s = s.replace(/所要 約(\d+)日（(航空|クーリエ) 約(\d+)日＋情勢見込み (\d+)日）/g, (m, t, md, b, dd) => { const nd = Math.max(0, +dd - d); return nd ? `所要 約${+b + nd}日（${md} 約${b}日＋情勢見込み ${nd}日）` : `所要 約${b}日`; });
        s = s.replace(/所要 約(\d+)日＋情勢見込み(\d+)日/g, (m, b, dd) => { const nd = Math.max(0, +dd - d); return nd ? `所要 約${b}日＋情勢見込み${nd}日` : `所要 約${b}日`; });
        return s;
    };
    function normLegs() {
        let n = 0;
        try {
            if (typeof FWDB === "undefined" || !FWDB || !Array.isArray(FWDB.reqs)) return 0;
            FWDB.reqs.forEach((r: any) => {
                if (!r || !Array.isArray(r.legs)) return;
                let allAir = r.legs.length > 0, dReq = 0;
                r.legs.forEach((l: any) => {
                    if (!l) return;
                    const k = l.ok ? offersKind(l.offers, r.mode) : (modeKind(r.mode) === "sea" ? "sea" : "air");
                    if (k !== "air") { allAir = false; return; }
                    if (!Array.isArray(l.situ) || !l.situ.some(seaOnly)) return;
                    let d = 0;
                    l.situ.filter(seaOnly).forEach((t: any) => { const m = /（\+(\d+)日見込み）/.exec(String(t)); if (m) d += +m[1]; });
                    l.situ = l.situ.filter((t: any) => !seaOnly(t));
                    if (l.ok) {
                        d = Math.min(d, Math.max(0, +l.delay || 0));
                        l.delay = Math.max(0, (+l.delay || 0) - d);
                        (l.offers || []).forEach((o: any) => {
                            if (!o) return;
                            if (+o.ttx > 0 && o.rate && +o.ttx - d >= (+o.rate.tt || 0)) o.ttx = +o.ttx - d;
                            if (Array.isArray(o.reasons)) o.reasons = o.reasons.map((s: any) => fixWhyAir(s, d)).filter((s: any) => s != null);
                        });
                        if (Array.isArray(l.recWhy)) l.recWhy = l.recWhy.map((s: any) => fixWhyAir(s, d)).filter((s: any) => s != null);
                    }
                    dReq = Math.max(dReq, d);
                    n++;
                });
                // その依頼に付いた文（交渉記録・荷主に届く文）：全部の区間が航空・クーリエの依頼だけ
                if (allAir && Array.isArray(r.msgs)) r.msgs.forEach((m: any) => {
                    if (!m || typeof m.t !== "string" || !/情勢見込み|情勢メモ/.test(m.t)) return;
                    const d0 = dReq || (() => { const x = /情勢見込み ?(\d+)日/.exec(m.t); return x ? +x[1] : 0; })();
                    let t = fixWhyAir(m.t, d0) || m.t;
                    t = t.replace(/情勢メモ：([^。<]*。?)/g, (mm: string, body: string) => seaOnly(body) ? "" : mm);
                    if (t !== m.t) { m.t = t; n++; }
                });
            });
        } catch (e) { warn("normLegs", e); }
        return n;
    }
    API.normLegs = normLegs;

    /* ═════ H. 物流：THC等諸掛・書類費は、この版では一律の固定額 ═════ */
    const Y = (n: any) => "¥" + Math.round(+n || 0).toLocaleString();
    const THC = () => { try { return typeof FWD_THC !== "undefined" ? +FWD_THC : 12000; } catch (e) { return 12000; } };
    const DOC = () => { try { return typeof FWD_DOC !== "undefined" ? +FWD_DOC : 8000; } catch (e) { return 8000; } };
    const FIXED: { [k: string]: () => string } = {
        ja: () => `この2つは、レート表から出す額ではなく、この版ではどの依頼にも同じ固定の額（THC等諸掛 ${Y(THC())}＋書類費 ${Y(DOC())}）です。依頼ごと・貨物ごと（量・重さ・荷姿・輸送の形）には変わりません。`,
        en: () => `Both are fixed amounts in this version — terminal charges ${Y(THC())} + documentation ${Y(DOC())}, the same for every request. They do not come from the rate table and do not vary by request or cargo (volume, weight, packing, mode).`,
        zh: () => `这两项不是来自费率表，在当前版本中对所有请求都是相同的固定金额（THC 等杂费 ${Y(THC())}＋单证费 ${Y(DOC())}），不随请求或货物（体积・重量・包装・运输方式）而变化。`,
        es: () => `Ambos son importes fijos en esta versión (gastos de terminal ${Y(THC())} + documentación ${Y(DOC())}), iguales para todas las solicitudes. No proceden de la tabla de tarifas y no varían según la solicitud ni la carga (volumen, peso, embalaje, modo).`
    };
    const WRONG: [RegExp, string][] = [
        [/この2つは、レート表ではなく、アプリが依頼の貨物（量・重さ・荷姿・輸送の形）から決まった式で出す標準の額です。/g, "ja"],
        [/Both are standard amounts the app calculates from the cargo of the request \(volume, weight, packing, mode\), not from the rate table\./g, "en"],
        [/这两项不是来自费率表，而是系统按该请求的货物（体积・重量・包装・运输方式）以固定公式算出的标准金额。/g, "zh"],
        [/Ambos son importes estándar que la aplicación calcula a partir de la carga \(volumen, peso, embalaje, modo\), no de la tabla de tarifas\./g, "es"]
    ];
    const fixThc = (s: any): any => { if (typeof s !== "string" || s.length < 40) return s; let t = s; WRONG.forEach(([re, l]) => { re.lastIndex = 0; if (re.test(t)) { re.lastIndex = 0; t = t.replace(re, FIXED[l]()); } }); return t; };
    API.fixThc = fixThc;
    const fOn = () => { try { return typeof FWDON !== "undefined" && !!FWDON && typeof FWDB !== "undefined" && !!FWDB; } catch (e) { return false; } };
    // 画面に出ている前の文（窓・交渉記録・AI の答えの履歴）を直す
    function fixThcDom(root: any) {
        try {
            if (!root) return;
            const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            let n: any;
            while ((n = tw.nextNode())) { const v = n.nodeValue; if (v && v.length >= 40) { const t = fixThc(v); if (t !== v) n.nodeValue = t; } }
        } catch (e) { }
    }
    function fixChat() { try { if (fOn() && Array.isArray(FWDB.chat)) FWDB.chat.forEach((m: any) => { if (m && typeof m.t === "string") m.t = fixThc(m.t); }); } catch (e) { } }
    // AI物流マン：THC等・書類費の決まり方／英・中・西で聞いた金額の直し方
    const ASK_THC = /(THC|ＴＨＣ|書類費|諸掛|ドキュメント|terminal (handling )?charges?|documentation|doc(ument)? fees?|单证费|杂费|gastos de terminal|documentaci[oó]n)/i;
    const ASK_HOW = /(どう|どの|どこ|なぜ|なに|何|いくら|根拠|決ま|決め|計算|算出|式|一律|固定|同じ|変わ|違|how|why|what|basis|decid|determin|calculat|fixed|same|怎|如何|为什么|多少|依据|固定|c[oó]mo|por qu[eé]|cu[aá]nto|calcul|fij)/i;
    const ASK_FIX_X = /(change|edit|fix|correct|adjust|lower|raise|update|modify)\b.{0,40}(quote|amount|price|total|rate|reply)|(quote|amount|price|total)\b.{0,30}(change|edit|fix|correct|adjust)|(修改|更改|改).{0,12}(金额|报价|价格|费率)|(金额|报价|价格).{0,12}(修改|更改|怎么改)|(cambiar|corregir|editar|modificar|ajustar).{0,40}(importe|cotizaci|precio|tarifa|total)/i;
    const THC_ANS = () => {
        const a = M(`<b>THC等諸掛は ${Y(THC())}、書類費は ${Y(DOC())}</b>です。この版では、どの依頼にも同じ固定の額で、依頼ごと・貨物ごと（量・重さ・荷姿・輸送の形）には変わりません（FCL・LCL・航空のどれでも同じ額です。クーリエ便だけは、諸掛・書類費を運賃に含めて出します）。`,
            `<b>Terminal charges (THC etc.) are ${Y(THC())} and documentation is ${Y(DOC())}</b>. In this version these are fixed amounts, the same for every request; they do not vary by request or cargo (volume, weight, packing, mode) — the same for FCL, LCL and air (courier quotes include them in the freight).`,
            `<b>THC 等杂费为 ${Y(THC())}，单证费为 ${Y(DOC())}</b>。在当前版本中，对所有请求都是相同的固定金额，不随请求或货物（体积・重量・包装・运输方式）而变化（FCL・LCL・空运均相同；仅快递报价将其含在运费内）。`,
            `<b>Los gastos de terminal (THC, etc.) son ${Y(THC())} y la documentación ${Y(DOC())}</b>. En esta versión son importes fijos, iguales para todas las solicitudes; no varían según la solicitud ni la carga (igual para FCL, LCL y aéreo; en courier van incluidos en el flete).`);
        const b = M("この2つを会社ごと・依頼ごとに直す欄は、いまの版にはありません。「区間のレート」（運賃・所要日数・有効期限）は「物流レート管理」で直せます。FOB の依頼の見積合計は「THC等諸掛＋書類費」だけ（運賃は買い手の負担）なので、運賃を直しても合計は変わりません。CFR・CIF など運賃込みの依頼は、運賃＋この2つが合計です。",
            "There is no field to edit these two per company or per request in this version. The lane rate (freight, transit days, validity) can be edited in “Rates”. For an FOB request the total is only “terminal charges + documentation” (the buyer pays the freight), so editing the freight does not change it. For freight-inclusive requests (CFR, CIF, etc.) the total is freight + these two.",
            "当前版本没有按公司或按请求修改这两项的栏位。“区间费率”（运费・航程天数・有效期）可在“费率管理”中修改。FOB 请求的合计仅为“THC 等杂费＋单证费”（运费由买方承担），因此修改运费不会改变合计。CFR・CIF 等含运费的请求，合计为运费＋这两项。",
            "En esta versión no hay campo para editar estos dos importes por empresa o por solicitud. La tarifa del tramo (flete, días de tránsito, validez) se edita en «Tarifas». En una solicitud FOB el total es solo «gastos de terminal + documentación» (el flete lo paga el comprador), así que cambiar el flete no lo modifica. En las solicitudes con flete incluido (CFR, CIF, etc.) el total es flete + estos dos.");
        return a + "<br><br>" + b;
    };
    API.thcAns = THC_ANS;
    const BASIS = () => M(`根拠：この版の見積の計算（THC等諸掛 ${Y(THC())}・書類費 ${Y(DOC())} は固定）。「回答の金額を直す」の窓と同じ内容（内蔵の計算。実AIは使っていません）`,
        `Basis: how quotes are calculated in this version (terminal charges ${Y(THC())} and documentation ${Y(DOC())} are fixed); same content as the “Edit quoted rate” window (built-in calculation, no live AI)`,
        `依据：当前版本的报价计算方式（THC 等杂费 ${Y(THC())}・单证费 ${Y(DOC())} 为固定金额），与“修改已回复的金额”窗口内容相同（内置计算，未使用实时AI）`,
        `Base: cálculo de cotizaciones de esta versión (gastos de terminal ${Y(THC())} y documentación ${Y(DOC())} fijos); mismo contenido que la ventana «Editar importe cotizado» (cálculo integrado, sin IA en vivo)`);
    function myAns(q: string): { a: string, c: string } | null {
        const s = String(q || "");
        try {
            const r6: any = W.v92r6c;
            if (ASK_THC.test(s) && ASK_HOW.test(s) && !/(直す|直し|直せ|変える|変更|修正|下げ|上げ)/.test(s)) return { a: THC_ANS(), c: BASIS() };
            if (L2() !== "ja" && ASK_FIX_X.test(s) && r6 && typeof r6.fwdAns === "function") {
                const k = r6.fwdAns("見積の金額を直すには？ FOB");
                if (k && k.a) return { a: fixThc(k.a), c: BASIS() };
            }
        } catch (e) { warn("myAns", e); }
        return null;
    }
    // 内蔵の答えの「質問の例」：英・中・西の画面では、その言語で（内蔵のエンジンが答えられる質問を、その言語でも受ける）
    const GENERIC = () => {
        const nR = (FWDB.rates || []).length, nQ = (FWDB.reqs || []).length;
        return M("", `I'm the AI logistics agent. I look at your <b>rate table (${nR} lanes), quote requests (${nQ}) and operation history</b>.<br>Without a live AI connection, the built-in engine can answer questions such as:<br>・“How do I change the quote amount?”<br>・“How are THC and documentation fees decided?”<br>and, typed in Japanese as shown:<br>・「韓国向けのレーンはある？」 (lanes to Korea)<br>・「有効期限が近いレートは？」 (rates expiring soon)<br>・「未対応の依頼は？」 (requests needing attention)<br><span style="font-size:10.5px;color:var(--ink-3)">Once an AI engine is connected, free-form questions in any language are answered by the live AI.</span>`,
            `我是AI物流专员。我会查看贵公司的<b>费率表（${nR} 条航线）・报价请求（${nQ} 件）・操作记录</b>。<br>未连接实时AI时，内置引擎可以回答例如：<br>・“怎么修改报价金额？”<br>・“THC 和单证费是怎么决定的？”<br>以及按下列日语原文输入的问题：<br>・「韓国向けのレーンはある？」（是否有前往韩国的航线）<br>・「有効期限が近いレートは？」（即将到期的费率）<br>・「未対応の依頼は？」（待处理的请求）<br><span style="font-size:10.5px;color:var(--ink-3)">连接AI引擎后，任何语言的自由提问都由实时AI回答。</span>`,
            `Soy el agente logístico de IA. Consulto su <b>tabla de tarifas (${nR} tramos), solicitudes de cotización (${nQ}) e historial</b>.<br>Sin conexión a una IA en vivo, el motor integrado responde preguntas como:<br>・«¿Cómo cambio el importe cotizado?»<br>・«¿Cómo se deciden el THC y la documentación?»<br>y, escritas en japonés tal cual:<br>・「韓国向けのレーンはある？」 (tramos a Corea)<br>・「有効期限が近いレートは？」 (tarifas próximas a caducar)<br>・「未対応の依頼は？」 (solicitudes pendientes)<br><span style="font-size:10.5px;color:var(--ink-3)">Con un motor de IA conectado, las preguntas libres en cualquier idioma las responde la IA en vivo.</span>`);
    };
    try {
        if (typeof fwdBrain === "function") {
            const __fb = fwdBrain;
            fwdBrain = function (this: any, q: any) {
                try { if (fOn()) { const mine = myAns(String(q || "")); if (mine) return mine; } } catch (e) { }
                const o = __fb.apply(this, arguments as any);
                try {
                    if (o && typeof o.a === "string") {
                        o.a = fixThc(o.a);
                        if (L2() !== "ja" && fOn() && /^\s*AI物流マンです。/.test(o.a)) {
                            o.a = GENERIC();
                            o.c = M("", `Basis: rate table ${(FWDB.rates || []).length} lanes / ${(FWDB.reqs || []).length} request(s) (built-in engine)`, `依据：费率表 ${(FWDB.rates || []).length} 条航线／请求 ${(FWDB.reqs || []).length} 件（内置引擎）`, `Base: tabla de tarifas ${(FWDB.rates || []).length} tramos / ${(FWDB.reqs || []).length} solicitud(es) (motor integrado)`);
                        }
                    }
                } catch (e) { }
                return o;
            };
        }
        if (typeof fwdAsk === "function") {
            const __fa = fwdAsk;
            fwdAsk = function (this: any, v: any) {
                try {
                    const s = String(v || "").trim();
                    const k = s && fOn() ? myAns(s) : null;
                    if (k) {
                        FWDB.chat = FWDB.chat || [];
                        FWDB.chat.push({ w: "u", t: E(s), ts: Date.now() });
                        FWDB.chat.push({ w: "a", t: k.a + `<div style="margin-top:6px;font-size:9.5px;color:var(--ink-3)">${E(k.c)}</div>`, ts: Date.now() });
                        FWDB.chat = FWDB.chat.slice(-60);
                        try { if (typeof fwdSave === "function") fwdSave(); } catch (e) { }
                        try { if (typeof fwdRender === "function") fwdRender(); } catch (e) { }
                        return Promise.resolve();
                    }
                } catch (e) { warn("fwdAsk", e); }
                const r = __fa.apply(this, arguments as any);
                try { Promise.resolve(r).then(() => { fixChat(); fixThcDom(el("well")); }).catch(() => { }); } catch (e) { }
                return r;
            };
        }
    } catch (e) { warn("brain", e); }

    /* ═════ I. 物流：中国語の見積受信箱の「担当・状態」／「回答の金額を直す」の窓の言葉 ═════ */
    try {
        if (typeof v33FwdInbox === "function") {
            const __fi = v33FwdInbox;
            v33FwdInbox = function (this: any) {
                // もとの処理は、表の最初の見出しの文字（受信日／Received／收到／Recibid）で依頼の表を探す。中国語の見出しは「接收日」で当たらなかった
                let th: any = null, t0 = "";
                try {
                    const w = el("well");
                    if (w) {
                        const tb = Array.from(w.querySelectorAll("table")).find((t: any) => { const h = t.querySelector("th"); return h && !t.dataset.v33fw && /^\s*(接收日|接收日期|收件日)/.test(h.textContent || ""); }) as any;
                        if (tb) { th = tb.querySelector("th"); t0 = th.textContent; th.textContent = "收到"; }
                    }
                } catch (e) { }
                try { return __fi.apply(this, arguments as any); } finally { try { if (th) th.textContent = t0; } catch (e) { } }
            };
        }
    } catch (e) { warn("fwdinbox", e); }
    // 窓・一覧に残る日本語（英・中・西の画面だけ）
    const dictOf = () => { try { return (I18N && I18N.dict && I18N.dict[I18N.lang]) || {}; } catch (e) { return {}; } };
    const trS = (x: any): string => { try { if (L2() === "ja") return String(x); const r = typeof i18nStr === "function" ? i18nStr(String(x), dictOf()) : null; if (r != null) return r; const r2 = (L2() !== "en" && I18N.dict && I18N.dict.en) ? I18N.dict.en[String(x).trim()] : null; return r2 != null ? r2 : String(x); } catch (e) { return String(x); } };
    API.trS = trS;
    const UNIT = () => M("/本", "/container", "/箱", "/contenedor");
    function sheetWords() {
        try {
            const l = L2();
            const sh = el("v33sheet");
            if (!sh) return;
            fixThcDom(sh);
            if (l === "ja" || !fOn()) return;
            // 題
            const hs = Array.from(sh.querySelectorAll("h3, h2, .v33sh-t, b")) as any[];
            const h = hs.find((x) => /回答の金額を直す（区間のレートを直します）|Quote reply \(edit price\)|見積回答（金額を直す）/.test(x.textContent || ""));
            if (h) {
                const tn: any = (h.firstChild && h.firstChild.nodeType === 3) ? h.firstChild : null;
                const rep = (s: string) => s.replace(/回答の金額を直す（区間のレートを直します）|Quote reply \(edit price\)|見積回答（金額を直す）/, M("", "Edit the quoted amount (this edits the lane rate)", "修改已回复的金额（修改的是区间费率）", "Editar el importe cotizado (se edita la tarifa del tramo)")).replace(/：\s*(RQ-)/, l === "zh" ? "：$1" : ": $1");
                if (tn) tn.nodeValue = rep(String(tn.nodeValue)); else if (!h.children.length) h.textContent = rep(String(h.textContent));
                h.setAttribute("data-noi18n", "1");
            }
            // 説明（前の層は日本語と英語だけ）
            const p: any = sh.querySelector("p.v92fansn");
            if (p && (l === "zh" || l === "es") && !p.dataset.r7b) {
                const shipper = /The shipper gets the re-built quote/.test(p.textContent || "");
                p.dataset.r7b = "1";
                p.textContent = l === "zh"
                    ? "这里修改的是“区间费率”。无法只为这一件请求单独报价（现货报价）。同一区间的费率也会用于该区间的其他请求。点“修改该区间的金额”后，费率管理的手动输入栏会带入当前值。修改后点“添加”，" + (shipper ? "货主下次打开页面时，会收到按新费率重新计算的报价。" : "系统只会按相同规则重新计算相关请求，并在页面上显示“从多少→变为多少”。") + "在点“添加”之前，不会有任何变化。"
                    : "Aquí se edita la «tarifa del tramo». No es posible un precio puntual (spot) solo para esta solicitud. La misma tarifa se usa en otras solicitudes del mismo tramo. Pulse «Editar el precio de este tramo» para rellenar el formulario manual de Tarifas; tras pulsar «Añadir», " + (shipper ? "el cargador recibirá la cotización recalculada la próxima vez que abra la pantalla. " : "solo se recalculan las solicitudes relacionadas con las mismas reglas y se muestran los importes antes/después. ") + "Nada cambia hasta que pulse «Añadir».";
            }
            // 内訳（前の層は日本語と英語だけ）・単位・港の名前
            const tw = document.createTreeWalker(sh, NodeFilter.SHOW_TEXT);
            let n: any;
            const todo: any[] = [];
            while ((n = tw.nextNode())) todo.push(n);
            todo.forEach((n: any) => {
                let v = String(n.nodeValue || "");
                if (!v.trim()) return;
                const v0 = v;
                let m: any;
                if ((l === "zh" || l === "es") && (m = /^(\s*)Total (¥[\d,]+) = terminal charges (¥[\d,]+) \+ documentation (¥[\d,]+)\. This request is FOB, so the freight \((.*?)\) is paid by the buyer and not included\.(.*)$/.exec(v)))
                    v = m[1] + (l === "zh" ? `合计 ${m[2]} ＝ 杂费 ${m[3]} ＋ 单证费 ${m[4]}。本请求为 FOB，运费（${m[5]}）由买方承担，不计入合计。修改运费不会改变本请求的合计（天数・有效期会反映到比价中）。` : `Total ${m[2]} = gastos de terminal ${m[3]} + documentación ${m[4]}. Esta solicitud es FOB: el flete (${m[5]}) lo paga el comprador y no se incluye. Cambiar el flete no modifica este total (los días y la validez sí se reflejan en la comparación).`);
                else if ((l === "zh" || l === "es") && (m = /^(\s*)Total (¥[\d,]+) = freight (¥[\d,]+) \((.*?)\) \+ charges (¥[\d,]+)\.(.*)$/.exec(v)))
                    v = m[1] + (l === "zh" ? `合计 ${m[2]} ＝ 运费 ${m[3]}（${m[4]}）＋ 杂费・单证费 ${m[5]}。修改运费后，合计也会改变。` : `Total ${m[2]} = flete ${m[3]} (${m[4]}) + gastos y documentación ${m[5]}. Si cambia el flete, el total también cambia.`);
                v = v.replace(/\/本/g, UNIT());
                v = v.replace(/(日数|Days|天数|Días) (\d+)日/g, (x: string, a: string, d: string) => l === "en" ? `Transit ${d} days` : l === "zh" ? `航程 ${d}天` : `Tránsito ${d} días`);
                v = v.replace(/有効期限 (\d{4}-\d\d-\d\d)/g, (x: string, d: string) => (l === "en" ? "Valid until " : l === "zh" ? "有效期 " : "Válida hasta ") + d);
                v = v.replace(/貴社のレートでの見積なし（レーン未登録）/g, M("", "No quote at your rates (lane not registered)", "没有按贵公司费率的报价（航线未登记）", "Sin cotización con sus tarifas (tramo no registrado)"));
                v = v.replace(/この区間のレートを登録/g, M("", "Register a rate for this lane", "登记该区间的费率", "Registrar la tarifa de este tramo"));
                v = v.replace(/この区間の金額を直す（レート管理で）/g, M("", "Edit this lane's price (in Rates)", "修改该区间的金额（在费率管理中）", "Editar el precio de este tramo (en Tarifas)"));
                if ((l === "zh" || l === "es")) v = v.replace(/^(\s*)Edit this lane's price \(in Rates\)(\s*)$/, "$1" + (l === "zh" ? "修改该区间的金额（在费率管理中）" : "Editar el precio de este tramo (en Tarifas)") + "$2").replace(/^(\s*)Edit this lane's price(\s*)$/, "$1" + (l === "zh" ? "修改该区间的金额" : "Editar el precio de este tramo") + "$2");
                // 「横浜港 → ロサンゼルス・FCL20」
                if ((m = /^(\s*)(.*?)([぀-ヿ一-鿿][^→]*?) → ([^・·]+?)([・·]\s*)([A-Za-z0-9]+)(\s*)$/.exec(v)) && /[぀-ヿ]|港/.test(m[3] + m[4]))
                    v = m[1] + (m[2].trim() ? trS(m[2].trim()) + "　" : m[2]) + trS(m[3].trim()) + " → " + trS(m[4].trim()) + " · " + m[6] + m[7];
                if (v !== v0) n.nodeValue = v;
            });
        } catch (e) { warn("sheet", e); }
    }
    API.sheetWords = sheetWords;
    // 見積受信箱の行：「アメリカ：AI pick…」の国名（英・中・西）
    function rowWords() {
        try {
            const l = L2();
            if (l === "ja" || !fOn()) return;
            const w = el("well"); if (!w) return;
            const CT: string[] = (typeof FWD_POD !== "undefined" && FWD_POD) ? Object.keys(FWD_POD) : [];
            if (!CT.length) return;
            const tw = document.createTreeWalker(w, NodeFilter.SHOW_TEXT);
            let n: any;
            while ((n = tw.nextNode())) {
                const v = String(n.nodeValue || "");
                const m = /^(\s*)([぀-ヿ一-鿿A-Z]{2,10})(：|: )(?=[A-Za-z¥一-鿿])/.exec(v);
                if (!m || CT.indexOf(m[2]) < 0) continue;
                const t = trS(m[2]);
                if (t && t !== m[2]) n.nodeValue = m[1] + t + (l === "zh" ? "：" : ": ") + v.slice(m[0].length);
            }
        } catch (e) { }
    }
    let fwT: any = 0;
    const fwLater = () => { try { clearTimeout(fwT); fwT = setTimeout(() => { sheetWords(); rowWords(); fixThcDom(el("well")); }, 260); setTimeout(() => { sheetWords(); rowWords(); }, 900); } catch (e) { } };
    try {
        if (typeof v90fAnsOpen === "function") {
            const __ao = v90fAnsOpen;
            v90fAnsOpen = function (this: any) { const r = __ao.apply(this, arguments as any); try { sheetWords(); fwLater(); } catch (e) { } return r; };
        }
        if (typeof fwdRender === "function") {
            const __fr = fwdRender;
            fwdRender = function (this: any) {
                try { if (fOn()) { normLegs(); fixChat(); } } catch (e) { }
                const r = __fr.apply(this, arguments as any);
                try { if (fOn()) { fixThcDom(el("well")); fwLater(); } } catch (e) { }
                return r;
            };
        }
        // 辞書（ほかの所に出る同じ言葉）
        if (typeof I18N !== "undefined" && I18N && I18N.dict) {
            const DI: any = I18N.dict;
            ["en", "zh", "es"].forEach((l) => { if (!DI[l]) DI[l] = {}; });
            const TR = (ja: string, en: string, zh: string, es: string) => { if (DI.en[ja] == null) DI.en[ja] = en; if (DI.zh[ja] == null) DI.zh[ja] = zh; if (DI.es[ja] == null) DI.es[ja] = es; };
            TR("貴社のレートでの見積なし（レーン未登録）", "No quote at your rates (lane not registered)", "没有按贵公司费率的报价（航线未登记）", "Sin cotización con sus tarifas (tramo no registrado)");
            TR("この区間のレートを登録", "Register a rate for this lane", "登记该区间的费率", "Registrar la tarifa de este tramo");
        }
    } catch (e) { warn("fwdwords", e); }
    try {
        if (typeof render === "function") {
            const __r = render;
            render = function (this: any) { try { if (fOn()) { normLegs(); fixChat(); } } catch (e) { } const r = __r.apply(this, arguments as any); try { if (fOn()) fwLater(); } catch (e) { } return r; };
        }
    } catch (e) { warn("render", e); }
    try { [1200, 3500].forEach((ms) => setTimeout(() => { try { if (fOn()) { normLegs(); fixChat(); } fixDupIds(); } catch (e) { } }, ms)); } catch (e) { }
})();
