/* 21.94 r10w：AI の「Web検索」が「利用できないため」と答える件（利用者の指摘・Trial-2026・シンガポール・純米大吟醸 湊 720ml・HS 2206.00）
   原因（index.html 本体の llmAsk・llmSysPrompt・llmRoute。どの層でも直っていなかった）
   ① 調査の依頼（regAIRun・追加調査・営業資料・市場調査など forceWeb の依頼）で、AI へのシステムの指示を本体の llmSysPrompt() が作る。
      その中の Web の一文は WEBON（AI商社マンの相談の画面の 🌐 トグル。既定は OFF・その画面でしか ON にならない）だけを見て、
      OFF なら「Web検索は使わず、社内データと一般的な貿易知識だけで答えてください。」と書く。管理画面の「🌐 Web検索：許可」（アカウントの web）も、
      forceWeb も見ない。そのため Gemini（google_search の道具が付く）でも、システムの指示が Web検索を禁じ、AI が「Web検索は利用できないため…」と答える。
   ② 道具を付けるのは、PROV の search が 1 のエンジン（Perplexity・Gemini）だけ。Claude・ChatGPT の経路では forceWeb でも道具が付かない
      （WEBON が OFF なので、代わりの参考情報 llmWebCtx も付かない）。
   ③ 経路（llmRoute）は Web が要るとき Perplexity → Gemini の順に探し、どちらも無いと接続の1番目（ChatGPT が先）を選ぶ。Claude は選ばれない。
   ④ 管理画面で「🌐 Web検索：許可しない」でも、forceWeb の依頼には Gemini の道具が付く（webPerm を見ていない）。
   ⑤ 「AI接続の共有」（同期サーバーの代理 ai_relay）は、アプリの側では依頼の本文（tools を含む）をそのまま送る（ここでは落ちていない）。
   直し（この層）
   ・依頼ごとに「Web検索を使うか」を決める（管理画面の許可・接続しているエンジン・AI の接続の有無）。使えるときは、検索に対応したエンジン
     （Perplexity・Gemini・Claude）を選び、Claude には Web検索の道具（web_search）を付け、システムの指示の Web の一文を「Web検索で確かめて出典を示す」にする。
     使えないときは、AI に Web検索を頼まない指示にし（答えの冒頭に「使えない」と書かせない）、理由はアプリが出す。
   ・判断は llmAsk のいちばん外で行い、依頼の本文の書き換え（道具・指示）は fetch のいちばん外で行う（直接の接続も、同期サーバーの代理も同じ所を通る）。
     2つの間は、問いの末尾に付けた印（[[r10w:番号]]）でつなぎ、印は外へ出る前に消す。
   ・規制の詳細調査・追加調査の結果に、Web検索を使ったか・出典の数・使えなかった理由を出す。追加調査の「🌐 Web検索で追加調査」は、使えないときは押せない（理由つき）。
   ・管理画面（AIエンジン設定・アカウントの 🌐Web検索 の列・発行の「🌐 Web検索を許可」・トライアル環境のしくみ）の説明を、実際の動きに合わせる。 */
declare let llmAsk: any, llmRoute: any, regAIView: any, regAskAI: any, regAnsHtml: any, v54askWebInfo: any, v54askWebBanner: any, ppCardHtml: any, vAI: any, renderAdmin: any;
declare const PROV: any, LLM: any, SES: any, I18N: any, V54ASK: any, V54ASK_REGQ: any, WEBON: any, WEBDB: any, V63A_TAG: any;
declare const webPerm: any, llmActive: any, ppReady: any, v63aIsOn: any, regStore: any, saveTen: any, regKbOf: any, regKbSave: any;
(function () {
    const W: any = window;
    if (W.__v2192r10w) return;
    const S: any = (W.__v2192r10w = { seq: 0, calls: {}, anthOff: 0, anthErr: "", last: null, regInfo: {}, pendAdd: null, n: { ask: 0, web: 0, noweb: 0, tool: 0, reroute: 0 } });
    const MK = / ?\[\[r10w:([a-z0-9]+)\]\]/g;
    const ORDER = ["perplexity", "gemini", "anthropic"];
    const NOWEB_JA = "Web検索は使わず、社内データと一般的な貿易知識だけで答えてください。";
    const WEBOK_JA = "必要に応じて最新のWeb情報（検索または与えられた参考情報）を使って構いません。使った場合は出典を示してください。";
    const SYS_WEB = "この依頼では Web検索が使えます。最新の公的な情報（規制当局・税関・公的機関のサイトなど）を Web検索で確かめ、社内データと突き合わせて答えてください。Web検索で確かめた内容には出典（サイト名・URL）を示してください。";
    const SYS_NOWEB = "この依頼では Web検索は使えません（理由は、アプリが利用者に別に伝えます）。依頼文に「Web検索で」とあっても、社内データと一般的な貿易知識の範囲で答えてください。Web検索が使えない・使わなかったことは本文に書かず、確かめられない点は「要確認」と書いてください。";
    const SYS_NOWEB_ADD = "\n（この依頼では Web検索は使えません。依頼文に「Web検索で」とあっても手元の情報の範囲で答え、Web検索が使えないことには触れないでください。）";
    const ANTH_TOOL = { type: "web_search_20250305", name: "web_search", max_uses: 5 };
    const AIH: any = { "generativelanguage.googleapis.com": "gemini", "api.anthropic.com": "anthropic", "api.openai.com": "openai", "api.perplexity.ai": "perplexity" };
    const LG = (): string => { try { return (typeof I18N !== "undefined" && I18N && I18N.lang) || "ja"; } catch (e) { return "ja"; } };
    const M = (ja: string, en: string, zh?: string, es?: string): string => { const l = LG(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const E = (s: any): string => String(s == null ? "" : s).replace(/[&<>"']/g, (c: string) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const PN = (p: string): string => { try { return (PROV[p] && PROV[p].short) || p; } catch (e) { return p; } };
    const SEP = (): string => (LG() === "ja" || LG() === "zh" ? "・" : ", ");
    const names = (a: string[]): string => (a || []).map(PN).join(LG() === "ja" ? "・" : LG() === "zh" ? "、" : ", ");
    function can(p: string): boolean { return p === "perplexity" || p === "gemini" || (p === "anthropic" && !S.anthOff); }
    function active(): string[] { try { return (typeof llmActive === "function" ? llmActive() : []) || []; } catch (e) { return []; } }
    function perm(): boolean { try { return typeof webPerm === "function" ? !!webPerm() : true; } catch (e) { return true; } }
    function ready(): boolean { try { return typeof ppReady === "function" ? !!ppReady() : active().length > 0; } catch (e) { return false; } }
    function conn(): string {
        try { if (typeof v63aIsOn === "function" && v63aIsOn()) return "air"; } catch (e) { }
        try { if (localStorage.getItem("bc20_llm_shared") === "1") return "shared"; } catch (e) { }
        return active().length ? "direct" : "none";
    }
    function webOn(): boolean { try { return typeof WEBON !== "undefined" && !!WEBON; } catch (e) { return false; } }
    // 依頼ごとに「Web検索を使うか」を決める。Web が要らない依頼は null（何もしない）
    function decide(o: any): any {
        if (!o || o.noWeb) return null;
        const chat = !o.forceWeb && webOn() && perm();
        if (!o.forceWeb && !chat) return null;
        const act = active();
        const d: any = { force: o.forceWeb ? 1 : 0, chat: chat ? 1 : 0, act, sr: act.filter(can), conn: conn(), perm: perm() ? 1 : 0, web: 0, why: "" };
        if (!act.length || !ready()) d.why = "noai";
        else if (!d.perm) d.why = "off";
        else if (!d.sr.length) d.why = "noeng";
        else d.web = 1;
        if (chat && !d.web) return null;
        return d;
    }
    S.decide = decide;
    // Claude は Web検索の道具（web_search）で調べられる。AI の会社の側で断られたら、この画面の間は元に戻す
    try { if (PROV && PROV.anthropic && !S.anthOff) PROV.anthropic.search = 1; } catch (e) { }
    function anthOff(msg: string) { S.anthOff = 1; S.anthErr = String(msg || "").slice(0, 200); try { PROV.anthropic.search = 0; } catch (e) { } }

    // 経路：Web が要る依頼は、検索に対応したエンジンが接続されていればそちらへ
    if (typeof llmRoute === "function") {
        const __lr = llmRoute;
        llmRoute = function (this: any, opts: any) {
            const r = __lr.apply(this, arguments as any);
            try {
                const o = opts || {};
                if (!r || !o.needWeb || o.prov || o.att || can(r.prov)) return r;
                const act = active();
                const best = ORDER.find((p) => act.includes(p) && can(p));
                if (!best) return r;
                const r2 = __lr.call(this, Object.assign({}, o, { prov: best }));
                if (r2 && r2.prov === best) {
                    r2.why = String(r2.why || "").replace(/^指定/, "Web検索");
                    r2.r10wFrom = r.prov;
                    S.n.reroute++;
                    return r2;
                }
            } catch (e) { }
            return r;
        };
    }

    // 答えの冒頭の「Web検索は利用できないため…」（Web検索を頼まなかったときだけ消す。理由はアプリが出す）
    const LEAD_JA = /^\s*(?:[*_＊]*\s*)?[^。\n]{0,40}?(?:Web|ウェブ|ネット|インターネット)\s*検索[^。\n]{0,30}?(?:でき|使え|行え|利用でき|使用でき|実行でき|アクセスでき)(?:ない|ません|ず|なかった)[^。\n]*(?:。|\n)\s*/;
    const LEAD_EN = /^\s*[^.\n]{0,60}?\bweb\s*search[^.\n]{0,60}?(?:not available|unavailable|cannot|can't|could not|couldn't|isn't|is not|was not|wasn't)[^.\n]*(?:\.|\n)\s*/i;
    function strip(t: string): string {
        let s = String(t || "");
        for (let i = 0; i < 2; i++) { const s2 = s.replace(LEAD_JA, "").replace(LEAD_EN, ""); if (s2 === s || !s2.trim()) break; s = s2; }
        return s;
    }
    S.strip = strip;
    function whyLabel(x: any): string {
        if (x.web && x.n > 0) return M("Web検索あり" + SEP() + "出典" + x.n + "件", "web search used" + SEP() + x.n + " source(s)", "已用网络搜索" + SEP() + "来源" + x.n + "条", "con búsqueda web" + SEP() + x.n + " fuente(s)");
        if (x.web) return M("Web検索を依頼" + SEP() + "出典なし", "web search requested" + SEP() + "no sources returned", "已请求网络搜索" + SEP() + "无来源", "búsqueda web solicitada" + SEP() + "sin fuentes");
        return M("Web検索なし", "no web search", "未使用网络搜索", "sin búsqueda web");
    }
    function reasonShort(x: any): string {
        const w = x.why || "";
        if (w === "off") return M("管理画面で、このアカウントの Web検索が「許可しない」になっています", "Web search is turned off for this account in the admin console", "管理后台已对此账户关闭网络搜索", "La búsqueda web está desactivada para esta cuenta en la consola de administración");
        if (w === "noeng") return M("このアカウントの AI 接続（" + names(x.act) + "）は Web検索に対応していません", "This account's AI connection (" + names(x.act) + ") does not support web search", "此账户的AI连接（" + names(x.act) + "）不支持网络搜索", "La conexión de IA de esta cuenta (" + names(x.act) + ") no admite búsqueda web");
        if (w === "noai") return M("AI が接続されていません", "AI is not connected", "未连接AI", "La IA no está conectada");
        if (w === "reject") return M("Claude の Web検索が、AI の会社（Anthropic）の側で使えない設定です", "Claude web search is not enabled on the AI provider (Anthropic) side", "Claude 的网络搜索在AI服务商（Anthropic）一侧未启用", "La búsqueda web de Claude no está habilitada en el proveedor (Anthropic)");
        if (w === "fallback") return M("検索に対応したエンジンがエラーのため、" + PN(x.prov) + "（Web検索なし）に切り替わりました", "The web-capable engine failed, so it switched to " + PN(x.prov) + " (no web search)", "支持搜索的引擎出错，已切换到 " + PN(x.prov) + "（无网络搜索）", "El motor con búsqueda falló y se cambió a " + PN(x.prov) + " (sin búsqueda web)");
        if (w === "att") return M("添付資料つきの依頼では、Web検索を使いません", "Requests with attachments do not use web search", "带附件的请求不使用网络搜索", "Las solicitudes con adjuntos no usan búsqueda web");
        return "";
    }
    S.reasonShort = reasonShort;

    // 判断（いちばん外の llmAsk）
    if (typeof llmAsk === "function") {
        const __la = llmAsk;
        llmAsk = async function (this: any, q: any, maxTok: any, opts: any) {
            const o0 = opts || {};
            if (typeof q !== "string" || q.indexOf("[[r10w:") >= 0) return __la.apply(this, arguments as any);
            let d: any = null;
            try { d = decide(o0); } catch (e) { d = null; }
            if (!d) return __la.apply(this, arguments as any);
            const id = (++S.seq).toString(36) + Math.random().toString(36).slice(2, 6);
            const rec: any = { id, d, at: Date.now(), sent: [], res: null };
            S.calls[id] = rec;
            try { const ks = Object.keys(S.calls); if (ks.length > 40) ks.slice(0, ks.length - 40).forEach((k) => { delete S.calls[k]; }); } catch (e) { }
            S.n.ask++;
            let o = o0;
            if (!d.web && o0.forceWeb) o = Object.assign({}, o0, { forceWeb: 0, noWeb: 1 });
            const r = await __la.call(this, q + " [[r10w:" + id + "]]", maxTok, o);
            try { post(r, rec, q); } catch (e) { }
            return r;
        };
    }
    function post(r: any, rec: any, q0: string) {
        if (!r || typeof r !== "object") return;
        ["txt", "a"].forEach((k) => { if (typeof r[k] === "string" && r[k].indexOf("[[r10w:") >= 0) r[k] = r[k].replace(MK, ""); });
        const last = rec.sent[rec.sent.length - 1] || null;
        const res = rec.res || {};
        if (r.prov === "anthropic" && !(r.cits && r.cits.length) && res.cits && res.cits.length) r.cits = res.cits.slice(0, 8);
        const used = !!(last && last.tool);
        const x: any = { want: 1, web: used ? 1 : 0, n: (r.cits || []).length, q: res.q || 0, prov: r.prov || (last && last.prov) || "", via: last ? last.via : "",
            conn: rec.d.conn, perm: rec.d.perm, act: rec.d.act.slice(), sr: rec.d.sr.slice(), why: "", err: res.err || "", at: Date.now() };
        if (!rec.d.web) x.why = rec.d.why;
        else if (!used) x.why = (last && last.why) || "fallback";
        r.r10w = x;
        if (!x.web && typeof r.txt === "string") r.txt = strip(r.txt);
        if (rec.d.force || x.web) r.why = (r.why ? String(r.why) + SEP() : "") + whyLabel(x);
        S.last = x;
        if (x.web) S.n.web++; else S.n.noweb++;
        try {
            const m = (typeof V54ASK_REGQ !== "undefined") ? V54ASK_REGQ.exec(q0) : null;
            if (m) {
                const c = m[1];
                S.regInfo[c] = x;
                if (typeof V54ASK !== "undefined" && V54ASK && V54ASK.run && V54ASK.run[c] && typeof v54askWebInfo === "function") {
                    const w = v54askWebInfo(r);
                    w.r10w = x;
                    V54ASK.res[c] = (w.fb || !w.web || w.deny || !x.web || !x.n) ? w : null;
                }
            }
        } catch (e) { }
    }

    // 依頼の本文（いちばん外の fetch）：印を消し、道具とシステムの指示を整える
    function sysGet(p: string, b: any): string {
        try {
            if (p === "gemini") return ((b.system_instruction || {}).parts || []).map((x: any) => x.text || "").join("");
            if (p === "anthropic") return typeof b.system === "string" ? b.system : Array.isArray(b.system) ? b.system.map((x: any) => x.text || "").join("") : "";
            const m = (b.messages || []).find((x: any) => x.role === "system"); return m && typeof m.content === "string" ? m.content : "";
        } catch (e) { return ""; }
    }
    function sysSet(p: string, b: any, s: string) {
        if (p === "gemini") { if (b.system_instruction && Array.isArray(b.system_instruction.parts) && b.system_instruction.parts.length) { b.system_instruction.parts = [{ text: s }]; } else b.system_instruction = { parts: [{ text: s }] }; return; }
        if (p === "anthropic") { if (Array.isArray(b.system)) b.system = [{ type: "text", text: s }]; else b.system = s; return; }
        const m = (b.messages || []).find((x: any) => x.role === "system");
        if (m) m.content = s; else b.messages = [{ role: "system", content: s }].concat(b.messages || []);
    }
    function userMap(p: string, b: any, f: (s: string) => string) {
        try {
            if (p === "gemini") (b.contents || []).forEach((c: any) => (c.parts || []).forEach((x: any) => { if (typeof x.text === "string") x.text = f(x.text); }));
            else (b.messages || []).forEach((m: any) => {
                if (m.role === "system") return;
                if (typeof m.content === "string") m.content = f(m.content);
                else if (Array.isArray(m.content)) m.content.forEach((x: any) => { if (x && typeof x.text === "string") x.text = f(x.text); });
            });
        } catch (e) { }
    }
    function hasAtt(p: string, b: any): boolean {
        try {
            if (p === "gemini") return (b.contents || []).some((c: any) => (c.parts || []).some((x: any) => x.inline_data));
            return (b.messages || []).some((m: any) => Array.isArray(m.content) && m.content.some((x: any) => x && x.type && x.type !== "text"));
        } catch (e) { return false; }
    }
    function patch(p: string, b: any, rec: any, via: string): any {
        const d = rec.d;
        let webNow = !!d.web && can(p);
        let why = "";
        if (d.web && !can(p)) why = "fallback";
        if (webNow && p === "gemini" && hasAtt(p, b) && !(b.tools || []).some((t: any) => t && t.google_search)) { webNow = false; why = "att"; }
        const sys = sysGet(p, b);
        const deflt = sys.indexOf(NOWEB_JA) >= 0 || sys.indexOf(WEBOK_JA) >= 0;
        let s2 = sys;
        if (webNow) {
            if (sys.indexOf(NOWEB_JA) >= 0) s2 = sys.replace(NOWEB_JA, SYS_WEB);
        } else {
            const RW = /Web検索で(?:も)?(?:最新(?:の)?情報を)?(確認|調べ)/g;
            if (deflt) s2 = sys.replace(NOWEB_JA, SYS_NOWEB).replace(WEBOK_JA, SYS_NOWEB);
            else s2 = sys.replace(RW, "手元の情報で$1") + SYS_NOWEB_ADD;
            userMap(p, b, (t) => t.replace(RW, "手元の情報で$1"));
        }
        if (s2 !== sys) sysSet(p, b, s2);
        let tool = "";
        if (p === "gemini") {
            const has = (b.tools || []).some((t: any) => t && t.google_search);
            if (webNow && !has) b.tools = (b.tools || []).concat([{ google_search: {} }]);
            if (!webNow && has) { b.tools = (b.tools || []).filter((t: any) => !(t && t.google_search)); if (!b.tools.length) delete b.tools; }
            if (webNow) tool = "google_search";
        } else if (p === "anthropic") {
            const has = (b.tools || []).some((t: any) => t && /^web_search/.test(String(t.type || "")));
            if (webNow && !has) b.tools = (b.tools || []).concat([Object.assign({}, ANTH_TOOL)]);
            if (!webNow && has) { b.tools = (b.tools || []).filter((t: any) => !(t && /^web_search/.test(String(t.type || "")))); if (!b.tools.length) delete b.tools; }
            if (webNow) tool = "web_search";
        } else if (p === "perplexity") {
            if (webNow) tool = "builtin";
        }
        const sent = { prov: p, tool, via, why, model: b.model || "", at: Date.now() };
        rec.sent.push(sent);
        if (tool) S.n.tool++;
        return sent;
    }
    function hostOf(u: string): string { const m = /^https:\/\/([^/?#]+)/i.exec(String(u || "")); return m ? m[1].toLowerCase() : ""; }
    function hv(h: any, k: string): string { try { if (!h) return ""; if (typeof h.get === "function") return String(h.get(k) || ""); const kk = Object.keys(h).find((x) => x.toLowerCase() === k); return kk ? String(h[kk]) : ""; } catch (e) { return ""; } }
    function anthCollect(j: any, res: any) {
        const U: string[] = [];
        let qn = 0;
        (j && j.content || []).forEach((b: any) => {
            if (!b) return;
            if (b.type === "server_tool_use") qn++;
            if (b.type === "web_search_tool_result") {
                if (Array.isArray(b.content)) b.content.forEach((x: any) => { if (x && x.url && U.indexOf(x.url) < 0) U.push(String(x.url)); });
                else if (b.content && b.content.error_code) res.err = String(b.content.error_code);
            }
            if (b.type === "text" && Array.isArray(b.citations)) b.citations.forEach((c: any) => { if (c && c.url && U.indexOf(c.url) < 0) U.unshift(String(c.url)); });
        });
        try { const u = j.usage && j.usage.server_tool_use && j.usage.server_tool_use.web_search_requests; if (+u > qn) qn = +u; } catch (e) { }
        res.cits = U.slice(0, 10);
        res.q = qn;
    }
    (function () {
        try {
            const F = window.fetch;
            if (typeof F !== "function" || (F as any).__v2192r10w) return;
            const Wf: any = async function (this: any, input: any, init: any) {
                let rec: any = null, p = "", sent: any = null, raw = "", via = "direct";
                try {
                    const u = (typeof input === "string") ? input : (input && typeof input.url === "string") ? input.url : "";
                    p = AIH[hostOf(u)] || "";
                    if (p && init && typeof init.body === "string" && init.body.indexOf("[[r10w:") >= 0) {
                        let id = "";
                        raw = init.body.replace(MK, (_m: string, x: string) => { if (!id) id = x; return ""; });
                        rec = S.calls[id] || null;
                        let body = raw;
                        if (rec) {
                            try {
                                const b = JSON.parse(raw);
                                const tag = (typeof V63A_TAG !== "undefined") ? V63A_TAG : "@air";
                                const H = init.headers;
                                via = (hv(H, "x-api-key") === tag || hv(H, "x-goog-api-key") === tag || hv(H, "authorization") === "Bearer " + tag) ? "relay" : "direct";
                                sent = patch(p, b, rec, via);
                                body = JSON.stringify(b);
                            } catch (e) { }
                        }
                        init = Object.assign({}, init, { body });
                    }
                } catch (e) { }
                if (!rec) return F.call(this, input, init);
                let resp: any = await F.call(this, input, init);
                try {
                    const res: any = rec.res = rec.res || {};
                    if (p === "anthropic" && sent && sent.tool) {
                        if (!resp.ok && resp.status === 400) {
                            let t = ""; try { t = await resp.clone().text(); } catch (e) { }
                            if (/web_?search|server.?tool|tools?\b/i.test(t)) {
                                // Claude の Web検索が断られた（AI の会社の側で無効など）：道具を外し、Web検索を頼まない形で送り直す
                                anthOff(t);
                                rec.sent.pop();
                                const b3 = JSON.parse(raw);
                                sent = patch(p, b3, rec, via);
                                sent.why = "reject";
                                init = Object.assign({}, init, { body: JSON.stringify(b3) });
                                resp = await F.call(this, input, init);
                            }
                        }
                        if (resp.ok && sent.tool) {
                            let j: any = null; try { j = await resp.clone().json(); } catch (e) { j = null; }
                            let n = 0;
                            while (j && j.stop_reason === "pause_turn" && n < 2) {
                                n++;
                                try {
                                    const b2 = JSON.parse(init.body);
                                    b2.messages = (b2.messages || []).concat([{ role: "assistant", content: j.content }]);
                                    const r2 = await F.call(this, input, Object.assign({}, init, { body: JSON.stringify(b2) }));
                                    if (!r2.ok) break;
                                    const j2 = await r2.json();
                                    j = Object.assign({}, j2, { content: (j.content || []).concat(j2.content || []) });
                                } catch (e) { break; }
                            }
                            if (n && j) resp = new Response(JSON.stringify(j), { status: 200, headers: { "Content-Type": "application/json" } });
                            if (j) anthCollect(j, res);
                        }
                    } else if (p === "gemini" && sent && sent.tool && resp.ok) {
                        try { const j = await resp.clone().json(); const gm = j && j.candidates && j.candidates[0] && j.candidates[0].groundingMetadata; res.q = gm && gm.webSearchQueries ? gm.webSearchQueries.length : 0; res.cits = gm && gm.groundingChunks ? gm.groundingChunks.map((c: any) => c.web && c.web.uri).filter(Boolean).slice(0, 10) : []; } catch (e) { }
                    } else if (p === "perplexity" && resp.ok) {
                        try { const j = await resp.clone().json(); res.cits = (j.citations || (j.search_results || []).map((x: any) => x.url) || []).filter(Boolean).slice(0, 10); } catch (e) { }
                    }
                } catch (e) { }
                return resp;
            };
            Object.keys(F).forEach((k) => { try { Wf[k] = (F as any)[k]; } catch (e) { } });
            Wf.__v2192r10w = 1;
            window.fetch = Wf;
        } catch (e) { }
    })();

    // 規制の詳細調査：上の知らせ（理由）と「使用エンジン」の行
    function noteBody(x: any, c: string): any {
        const relay = x.via === "relay" || x.conn === "air";
        if (x.web && x.n > 0) return null;
        if (x.web) {
            return { warn: 1, rerun: 1,
                t: M("⚠ Web検索を頼みましたが、出典が返ってきませんでした", "⚠ Web search was requested, but no sources came back", "⚠ 已请求网络搜索，但没有返回来源", "⚠ Se pidió la búsqueda web, pero no llegaron fuentes"),
                L: [M("Web検索に対応した AI（" + PN(x.prov) + "）に、Web検索の道具を付けて頼みましたが、検索の結果（出典）が返ってきませんでした。", "The request was sent to a web-capable AI (" + PN(x.prov) + ") with the web search tool, but no search results (sources) came back.", "已向支持搜索的AI（" + PN(x.prov) + "）附带网络搜索工具发出请求，但没有返回搜索结果（来源）。", "Se envió a una IA con búsqueda (" + PN(x.prov) + ") con la herramienta de búsqueda web, pero no llegaron resultados (fuentes)."),
                    relay ? M("このアカウントの AI は STANDAGE の同期サーバーを通ります（サーバーの側の扱いは、この画面からは確かめられません）。", "This account's AI goes through the STANDAGE sync server (how the server handles it cannot be checked from this screen).", "此账户的AI经由 STANDAGE 同步服务器（服务器端的处理无法在此画面确认）。", "La IA de esta cuenta pasa por el servidor de sincronización de STANDAGE (no se puede comprobar desde aquí cómo lo trata el servidor).") : "",
                    M("下の内容は、最新の規制で確かめられていません。少し時間をおいて、もう一度調べてください。", "The content below has not been checked against the latest regulations. Please try again a little later.", "以下内容尚未用最新法规核实。请稍后再查一次。", "El contenido de abajo no se ha comprobado con la normativa más reciente. Vuelva a intentarlo más tarde.")].filter(Boolean) };
        }
        const L: string[] = [reasonShort(x) + (x.why === "noeng" ? M("（管理画面の Web検索：許可）", " (admin console web search: allowed)", "（管理后台的网络搜索：允许）", " (búsqueda web en la consola: permitida)") : "") + M("。", ".", "。", ".")];
        L.push(M("AI には Web検索を頼まず、登録データと一般的な知識で整理しました。最新の規制は「🌐 社内規制DB」か、STANDAGE への調査の依頼で確かめてください。", "The AI was not asked to search the web; this summary uses registered data and general knowledge. Check the latest rules in the in-house regulation DB or ask STANDAGE to research them.", "未让AI进行网络搜索，以下根据登记数据和一般知识整理。最新法规请通过「🌐 公司内部法规DB」或委托 STANDAGE 调查来确认。", "No se pidió a la IA buscar en la web; se resumió con los datos registrados y conocimientos generales. Compruebe la normativa más reciente en la BD interna o pida a STANDAGE que la investigue."));
        if (x.why === "noeng") L.push(M("Web検索を使うには、管理者が Gemini・Perplexity・Claude のどれかを接続します（ChatGPT は、この画面の呼び出し方では Web検索に対応していません）。", "To use web search, the administrator connects Gemini, Perplexity or Claude (ChatGPT does not support web search in the way this app calls it).", "要使用网络搜索，需由管理员连接 Gemini、Perplexity 或 Claude（按本应用的调用方式，ChatGPT 不支持网络搜索）。", "Para usar la búsqueda web, el administrador conecta Gemini, Perplexity o Claude (ChatGPT no admite búsqueda web tal como lo llama esta app)."));
        if (x.why === "off") L.push(M("Web検索を使うには、管理者が管理画面の「アカウント一覧と利用状況」で、このアカウントの「🌐 Web検索」を許可にします。", "To use web search, the administrator allows “🌐 Web search” for this account in the admin console (account list).", "要使用网络搜索，需由管理员在管理后台的账户列表中为此账户允许「🌐 网络搜索」。", "Para usar la búsqueda web, el administrador permite «🌐 Búsqueda web» para esta cuenta en la consola (lista de cuentas)."));
        if (x.why === "reject") L.push(M("管理者は、AI の会社（Anthropic）の管理画面で Web検索が有効になっているかを確かめてください。", "The administrator should check that web search is enabled in the AI provider's (Anthropic) console.", "请管理员在AI服务商（Anthropic）的管理画面确认已启用网络搜索。", "El administrador debe comprobar que la búsqueda web está habilitada en la consola del proveedor (Anthropic)."));
        return { warn: x.why === "fallback" || x.why === "reject" ? 1 : 0, rerun: x.why === "fallback" ? 1 : 0,
            t: M("ℹ 今回は Web検索をしていません", "ℹ No web search this time", "ℹ 本次未进行网络搜索", "ℹ Esta vez no se buscó en la web"), L };
    }
    S.noteBody = noteBody;
    function bannerHtml(c: string, x: any): string {
        const nb = noteBody(x, c);
        if (!nb) return "";
        return `<div class="v54ask-wb ${nb.warn ? "warn" : "info"} r10w-why" role="status" data-noi18n data-r10w="${E(x.why || (x.web ? "nosrc" : ""))}"><b>${E(nb.t)}</b>${nb.L.map((l: string) => `<span>${E(l)}</span>`).join("")}${nb.rerun ? `<div class="v54ask-wb-act"><button type="button" class="btn" data-v54rerun="${E(c)}">${E(M("🔄 もう一度調べる", "🔄 Research again", "🔄 重新调查", "🔄 Investigar de nuevo"))}</button></div>` : ""}</div>`;
    }
    if (typeof v54askWebBanner === "function") {
        const __wb = v54askWebBanner;
        v54askWebBanner = function (this: any, c: any, w: any) {
            try {
                if (w && w.r10w) {
                    const x = w.r10w;
                    if (x.web && x.n > 0) return w.fb ? __wb.apply(this, arguments as any) : "";
                    return bannerHtml(String(c || ""), x);
                }
            } catch (e) { }
            return __wb.apply(this, arguments as any);
        };
    }
    function engLine(x: any): string {
        if (!x) return "";
        let s = "🌐 " + whyLabel(x);
        if (x.web && x.prov) s += M("（" + PN(x.prov) + "）", " (" + PN(x.prov) + ")", "（" + PN(x.prov) + "）", " (" + PN(x.prov) + ")");
        if (!x.web && x.why) s += M("：", ": ", "：", ": ") + reasonShort(x);
        return s;
    }
    S.engLine = engLine;
    function paintEng(c: string) {
        const o = document.getElementById("regaiO");
        if (!o) return;
        let st: any = null;
        try { st = typeof regStore === "function" ? regStore()[c] : null; } catch (e) { st = null; }
        const x = st && st.r10w;
        o.querySelectorAll(".r10w-eng").forEach((e) => e.remove());
        if (!x) return;
        const ps = Array.from(o.querySelectorAll("p.nn")) as any[];
        const p = ps.find((e) => /^(使用エンジン|Engine|AI engine|Motor|使用引擎)/i.test((e.textContent || "").trim())) || ps[ps.length - 1];
        const sp = document.createElement("span");
        sp.className = "r10w-eng";
        sp.setAttribute("data-noi18n", "");
        sp.setAttribute("data-r10w", x.web ? (x.n ? "web" : "nosrc") : (x.why || "noweb"));
        sp.textContent = engLine(x);
        if (p) { p.appendChild(document.createTextNode(" ")); p.appendChild(sp); }
        else { const q = document.createElement("p"); q.className = "nn"; q.appendChild(sp); o.appendChild(q); }
    }
    function paintComposer() {
        const wb: any = document.getElementById("regweb");
        if (!wb) return;
        const lab: any = wb.closest("label") || wb.parentElement;
        document.querySelectorAll(".r10w-wst").forEach((e: any) => e.remove());
        const d = decide({ forceWeb: 1 });
        if (!d) return;
        paintIntro(d);
        if (d.web) {
            wb.disabled = false;
            if (lab) lab.title = M("ONにすると、Web検索に対応した AI（" + names(d.sr) + "）が Web検索で最新情報を確かめて答えます（追加調査）", "When ON, a web-capable AI (" + names(d.sr) + ") checks the latest information by web search (extra research)", "开启后，支持搜索的AI（" + names(d.sr) + "）会通过网络搜索确认最新信息后回答（追加调查）", "Si se activa, una IA con búsqueda (" + names(d.sr) + ") comprueba la información más reciente en la web");
            return;
        }
        const why = reasonShort(d);
        wb.checked = false;
        wb.disabled = true;
        // 入力の言葉（「調査」など）で自動で ON になる本体の動きを、押せないときは打ち消す
        const tq: any = document.getElementById("regq");
        if (tq && !tq.__r10w) { tq.__r10w = 1; tq.addEventListener("input", () => { try { const w2: any = document.getElementById("regweb"); if (w2 && w2.disabled) w2.checked = false; } catch (e) { } }); }
        if (lab) { lab.title = why; lab.style.cursor = "not-allowed"; }
        // 理由は入力欄の下に（送信のボタンの並びを崩さない）
        const comp: any = document.getElementById("regcomp") || (lab && lab.parentElement);
        if (comp) {
            const sp = document.createElement("p");
            sp.className = "nn r10w-wst";
            sp.setAttribute("data-noi18n", "");
            sp.textContent = M("🌐 Web検索で追加調査：使えません（", "🌐 Further research with web search: not available (", "🌐 网络搜索追加调查：不可用（", "🌐 Investigación adicional con búsqueda web: no disponible (") + why + M("）", ")", "）", ")");
            comp.insertAdjacentElement("afterend", sp);
        }
    }
    // 上の「Web検索で最新情報を確認して整理します。」は、使えないときは実際の動きに合わせる
    const INTRO_JA = "Web検索で最新情報を確認して整理します。";
    function paintIntro(d: any) {
        const body = document.getElementById("regbody");
        if (!body || d.web) return;
        const p: any = Array.from(body.querySelectorAll("p.nn")).find((e: any) => (e.textContent || "").indexOf(INTRO_JA) >= 0);
        if (!p) return;
        const tw = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
        while (tw.nextNode()) {
            const n: any = tw.currentNode;
            if (n.nodeValue && n.nodeValue.indexOf(INTRO_JA) >= 0) { n.nodeValue = n.nodeValue.replace(INTRO_JA, M("登録データと一般的な知識で整理します（このアカウントでは、いまは Web検索を使えません）。", "This is organised from registered data and general knowledge (web search is not available for this account right now). ", "根据登记数据和一般知识整理（此账户目前无法使用网络搜索）。", "Se organiza con los datos registrados y conocimientos generales (la búsqueda web no está disponible ahora para esta cuenta). ")); break; }
        }
    }
    S.paintComposer = paintComposer;
    if (typeof regAIView === "function") {
        const __rv = regAIView;
        regAIView = function (this: any, c: any, html: any) {
            const r = __rv.apply(this, arguments as any);
            try {
                const cc = String(c || "");
                const st = typeof regStore === "function" ? regStore()[cc] : null;
                if (st && typeof html === "string" && html === st.h && S.regInfo[cc]) {
                    st.r10w = S.regInfo[cc];
                    delete S.regInfo[cc];
                    try { if (typeof V54ASK !== "undefined" && V54ASK) V54ASK.dirty = 1; else if (typeof saveTen === "function") saveTen(); } catch (e) { }
                }
                const run = () => { try { paintEng(cc); paintComposer(); } catch (e) { } };
                run();
                setTimeout(run, 0);
                setTimeout(run, 500);
            } catch (e) { }
            return r;
        };
    }
    // 追加調査（regSend → regAskAI → llmAsk）：答えの下に、Web検索を使ったか・理由
    if (typeof regAskAI === "function") {
        const __ra = regAskAI;
        regAskAI = async function (this: any, c: any, q: any, web: any) {
            const r = await __ra.apply(this, arguments as any);
            try { S.pendAdd = (r && r.r10w) ? { q: String(q == null ? "" : q).trim(), x: r.r10w, at: Date.now() } : null; } catch (e) { }
            return r;
        };
    }
    if (typeof regAnsHtml === "function") {
        const __rh = regAnsHtml;
        regAnsHtml = function (this: any, x: any) {
            try {
                const P = S.pendAdd;
                if (x && !x.r10w && P && P.q === String(x.q || "").trim() && Date.now() - P.at < 600000) {
                    x.r10w = P.x;
                    if (!P.x.web) x.web = false;
                    S.pendAdd = null;
                    try { if (typeof regKbSave === "function") setTimeout(regKbSave, 0); } catch (e) { }
                }
            } catch (e) { }
            let h = __rh.apply(this, arguments as any);
            try {
                const y = x && x.r10w;
                if (y && !y.web && y.why) {
                    // 使えなかった理由は、答えの上に出す（「調べた手順」に畳まれない）
                    h = `<div class="v54ask-wb info v54ask-wb-s r10w-why" role="status" data-noi18n data-r10w="${E(y.why)}"><b>${E(M("ℹ 今回は Web検索をしていません", "ℹ No web search this time", "ℹ 本次未进行网络搜索", "ℹ Esta vez no se buscó en la web"))}</b><span>${E(reasonShort(y) + M("。登録データと一般的な知識で答えています。", ". Answered from registered data and general knowledge.", "。根据登记数据和一般知识回答。", ". Respondido con los datos registrados y conocimientos generales."))}</span></div>` + h;
                } else if (y) {
                    h += `<div class="ci r10w-ci" data-noi18n data-r10w="${E(y.web ? (y.n ? "web" : "nosrc") : "noweb")}">${E(engLine(y))}</div>`;
                }
            } catch (e) { }
            return h;
        };
    }

    // 管理画面：Web検索の意味と、いまの接続で効くエンジン
    function admWebHtml(): string {
        const act = active();
        const sr = act.filter(can);
        const all = Object.keys(PROV || {});
        const L = all.map((p) => PN(p) + (can(p) ? "✓" : "✗")).join(LG() === "ja" ? "・" : ", ");
        const now = !act.length ? M("いまは未接続（Web検索は使えません）", "not connected now (web search unavailable)", "当前未连接（无法使用网络搜索）", "sin conexión ahora (sin búsqueda web)")
            : sr.length ? M("いまの接続では " + names(sr) + " で Web検索します", "with the current connection, web search uses " + names(sr), "按当前连接，使用 " + names(sr) + " 进行网络搜索", "con la conexión actual, la búsqueda web usa " + names(sr))
                : M("いまの接続（" + names(act) + "）では Web検索はできません。Gemini・Perplexity・Claude のどれかを接続してください", "the current connection (" + names(act) + ") cannot search the web; connect Gemini, Perplexity or Claude", "当前连接（" + names(act) + "）无法进行网络搜索，请连接 Gemini、Perplexity 或 Claude", "la conexión actual (" + names(act) + ") no puede buscar en la web; conecte Gemini, Perplexity o Claude");
        return `<p class="nn r10w-adm" data-noi18n style="margin-top:6px"><b>${E(M("🌐 Web検索：", "🌐 Web search: ", "🌐 网络搜索：", "🌐 Búsqueda web: ") + now)}</b>${E(M("（対応：", " (support: ", "（支持：", " (compatibilidad: ") + L + M("）。", "). ", "）。", "). "))}${E(M("アカウントの「🌐 Web検索」が許可のとき、AI の調査（規制の詳細調査・追加調査・市場調査・営業資料など）は、Web検索に対応したエンジンを選び、Web検索の道具を付けて頼みます。許可しないとき・対応したエンジンが無いときは、Web検索を頼まず、その理由を画面に出します。", "When “🌐 Web search” is allowed for an account, AI research (regulation research, follow-up research, market research, sales materials, etc.) picks a web-capable engine and sends the request with the web search tool. When it is not allowed or no web-capable engine is connected, the AI is not asked to search and the screen shows why.", "账户的「🌐 网络搜索」为允许时，AI调查（法规详查、追加调查、市场调查、营销资料等）会选择支持搜索的引擎并附带网络搜索工具。不允许或没有支持搜索的引擎时，不让AI搜索，并在画面上显示原因。", "Si «🌐 Búsqueda web» está permitida para la cuenta, la investigación con IA (normativa, investigación adicional, mercado, materiales de venta, etc.) elige un motor con búsqueda y envía la herramienta de búsqueda web. Si no está permitida o no hay un motor compatible, no se pide buscar y la pantalla muestra el motivo."))}</p>`;
    }
    S.admWebHtml = admWebHtml;
    if (typeof ppCardHtml === "function") {
        const __pc = ppCardHtml;
        ppCardHtml = function (this: any) {
            let h = String(__pc.apply(this, arguments as any) || "");
            try {
                if (h && h.indexOf("r10w-adm") < 0) {
                    const i = h.indexOf("</p>");
                    h = i >= 0 ? h.slice(0, i + 4) + admWebHtml() + h.slice(i + 4) : h + admWebHtml();
                }
            } catch (e) { }
            return h;
        };
    }
    const COL_T = () => M("Web検索を許可しているか（アカウントの状態ではありません。状態は「状態」の列）。許可：AI の調査で、Web検索に対応したエンジン（Perplexity・Gemini・Claude）が Web検索をして答えます（ChatGPT だけの接続ではできません）。許可しない：Web検索を頼まず、その理由を画面に出します。",
        "Whether web search is allowed (not the account status; see the Status column). Allowed: AI research searches the web with a web-capable engine (Perplexity, Gemini, Claude; not possible with ChatGPT only). Not allowed: the AI is not asked to search and the screen shows why.",
        "是否允许网络搜索（不是账户状态，状态见「状态」列）。允许：AI调查由支持搜索的引擎（Perplexity、Gemini、Claude）进行网络搜索（仅连接 ChatGPT 时不可）。不允许：不让AI搜索，并在画面显示原因。",
        "Si se permite la búsqueda web (no es el estado de la cuenta). Permitida: la investigación con IA busca en la web con un motor compatible (Perplexity, Gemini, Claude; no con solo ChatGPT). No permitida: no se pide buscar y se muestra el motivo.");
    function patchAdmin() {
        try {
            const nb: any = document.getElementById("nweb");
            const lab = nb && (nb.closest("label") || nb.parentElement);
            if (lab) lab.title = COL_T();
            document.querySelectorAll("table thead th").forEach((th: any) => { if (/🌐\s*Web/.test(th.textContent || "")) th.title = COL_T(); });
            document.querySelectorAll("b").forEach((b: any) => {
                if ((b.textContent || "").trim() !== "Web検索はライブ＋内蔵ナレッジ" || b.getAttribute("data-r10w")) return;
                const p = b.nextElementSibling;
                b.setAttribute("data-r10w", "1");
                b.setAttribute("data-noi18n", "");
                b.textContent = M("Web検索（アカウントごとに許可）", "Web search (allowed per account)", "网络搜索（按账户允许）", "Búsqueda web (permitida por cuenta)");
                if (p) {
                    p.setAttribute("data-noi18n", "");
                    let n = 0; try { n = (WEBDB || []).length; } catch (e) { n = 0; }
                    p.textContent = M("アカウントの「🌐 Web検索」が許可のとき、AI の調査は Web検索に対応したエンジン（Perplexity・Gemini・Claude）で Web検索をして答えます（ChatGPT だけの接続ではできません）。AI が未接続のときの AI商社マンの 🌐 Web検索は、為替レートのライブ取得と内蔵の貿易ナレッジ（" + n + "件）で補います。",
                        "When “🌐 Web search” is allowed for an account, AI research searches the web with a web-capable engine (Perplexity, Gemini, Claude; not possible with ChatGPT only). Without an AI connection, the AI Agent's 🌐 web search uses a live exchange rate and the built-in trade knowledge (" + n + " items).",
                        "账户的「🌐 网络搜索」为允许时，AI调查由支持搜索的引擎（Perplexity、Gemini、Claude）进行网络搜索（仅连接 ChatGPT 时不可）。未连接AI时，AI商社专员的 🌐 网络搜索以实时汇率和内置贸易知识（" + n + "条）补充。",
                        "Si «🌐 Búsqueda web» está permitida, la investigación con IA busca en la web con un motor compatible (Perplexity, Gemini, Claude; no con solo ChatGPT). Sin conexión de IA, la búsqueda web del agente usa el tipo de cambio en vivo y el conocimiento integrado (" + n + " elementos).");
                }
            });
        } catch (e) { }
    }
    S.patchAdmin = patchAdmin;
    if (typeof renderAdmin === "function") {
        const __ra2 = renderAdmin;
        renderAdmin = function (this: any) {
            const r = __ra2.apply(this, arguments as any);
            try { patchAdmin(); setTimeout(patchAdmin, 0); setTimeout(patchAdmin, 800); setTimeout(patchAdmin, 2000); } catch (e) { }
            return r;
        };
    }
    // AI商社マンの画面の「Web検索ができる AI（Perplexity・Gemini）」に Claude を足す
    if (typeof vAI === "function") {
        const __va = vAI;
        vAI = function (this: any) {
            let h = __va.apply(this, arguments as any);
            try {
                if (typeof h === "string" && !S.anthOff) h = h.replace("Web検索ができる AI（Perplexity・Gemini）", "Web検索ができる AI（Perplexity・Gemini・Claude）").replace("(Perplexity, Gemini)", "(Perplexity, Gemini, Claude)").replace("（Perplexity、Gemini）", "（Perplexity、Gemini、Claude）");
            } catch (e) { }
            return h;
        };
    }
    try {
        const st = document.createElement("style");
        st.id = "r10wcss";
        st.textContent = ".r10w-eng{display:inline-block;margin-left:2px;font-weight:700;color:var(--ink-2)}.r10w-eng[data-r10w=web]{color:var(--good)}.r10w-eng[data-r10w=nosrc],.r10w-eng[data-r10w=fallback],.r10w-eng[data-r10w=reject]{color:var(--warn)}.r10w-wst{font-size:11px;color:var(--ink-3);margin-top:4px}.r10w-why span{display:block}.r10w-adm b{color:var(--ink-1,inherit)}";
        (document.head || document.documentElement).appendChild(st);
    } catch (e) { }
})();
