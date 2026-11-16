/* 21.94 r9b：9巡目の直し（受注・書類・多言語以外の残り）。本体の層。今の関数は包むだけ・保存の形は変えない
   A  商談を記録する窓の「チャネル」：はじめは未選択（展示会が選ばれた状態で始めない）。AIバイヤー開拓でメールを送った相手なら「メール・DM」を入れておく。
      選ばずに保存したら、チャネルは空のまま（展示会にしない）。既にある記録は変えない（culture-U01）
   B  登録の21件の数え方を1つに：「—」だけの値は、表（業種ごとの項目）・取り込んだ項目の報告と同じく「未登録」（culture-T03 の残り・indagri-Q05）。
      資料あり・なしで同じ（資料なしでも、答えていない項目は未登録）。逆に「なし」「未定」など答えとして入っている値は、21件の数どおり表でも登録済みと出す。
      中古品の「動作保証」は、取引の基本条件の「保証（動作保証）」と同じ欄として1行にまとめる（auto-U05・indagri-U04）
   C  目標と道筋：根拠の文の連絡のペースを、計算に使っている保守・標準・挑戦の数で書く（daily-T09・other-T10）
   D  AI商社マン：質問に国名があれば、その国の案件（受注の案件を先に）で答える。その国の案件が無いときは、その国の規制の調べで答える（daily-T08・indagri-T07）。
      国ごとの状況で、同じ注意が何か国にも続くときは1回にまとめる（other-T08）
   E  ログイン：業種サンプルを開いていた人には「アップロードした」と言わない（other-U03）。390 で担当者名の欄の文が切れない（xcut-U09 の一部）
   F  書類の「確かめること」：いくつかの国をまとめた規則の文は、仕向国の分だけ（auto-U04）
   数字・規制の中身は足していない */
declare const TEN: any, TENS: any, SES: any, I18N: any, D: any, NEED: any, V68P_G: any, V85CN: any;
declare let SHIPS: any, SHIPA: any;
declare let openDealForm: any, dealSave: any, scoreOf: any, v92prodFill: any, v92prodOpt: any, v54upldGot: any, v54upldApply: any, v68pFieldRow: any, render: any;
declare let v92goalReachHtml: any, ansDocs: any, ansReg: any, toast: any, v85docJudge: any, fillAnswer: any;
declare const FILL: any;
declare let vCty: any, ux32Setup: any, v85dkCta: any;
declare function ctyStore(): any;
declare function ctyChosen(): any;
declare function v54ctyLead(x: any): any;
declare function v56priceCNum(x: any): any;
declare function pickCountry(q: any): string;
declare function v536Smp(S: any): boolean;
declare function v54upldOrigin(t: any): string;
declare function v54upldRestoreMsg(t: any, pct: any): string;
declare function v68pPlace(v: any): boolean;
declare function v68pHas(v: any): boolean;
declare function v68pGroups(t: any): any;
declare function v68pFL(k: any): string;
declare function v68pE(s: any): string;
declare function v71obSt(): any;
declare function v85docCName(cc: any): string;
(function () {
    const W: any = window;
    if (W.__v2192r9b) return;
    W.__v2192r9b = 1;
    const API: any = (W.v92r9b = W.v92r9b || {});
    const LG = () => { try { return (typeof I18N !== "undefined" && I18N && I18N.lang) || document.documentElement.lang || "ja"; } catch (e) { return "ja"; } };
    const L2 = () => String(LG()).slice(0, 2);
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = L2(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as any)[c]));
    const warn = (k: string, e: any) => { try { console.warn("[21.94 r9b] " + k, e); } catch (x) { } };
    const ten = (): any => { try { return (typeof TEN !== "undefined" && TEN) || null; } catch (e) { return null; } };
    const NK = (s: any) => String(s == null ? "" : s).normalize("NFKC").toLowerCase().replace(/（見本）|\(sample\)/g, "").replace(/[\s・.,'"’\-]/g, "");
    API.M = M;
    const dict = (rows: string[][]) => {
        try {
            if (typeof I18N === "undefined" || !I18N || !I18N.dict) return;
            const DI: any = I18N.dict;
            ["en", "zh", "es"].forEach((l) => { if (!DI[l]) DI[l] = {}; });
            rows.forEach((r) => { if (r[1] && DI.en[r[0]] == null) DI.en[r[0]] = r[1]; if (r[2] && DI.zh[r[0]] == null) DI.zh[r[0]] = r[2]; if (r[3] && DI.es[r[0]] == null) DI.es[r[0]] = r[3]; });
        } catch (e) { }
    };

    /* ═════ A. 商談を記録する窓：チャネルは はじめ未選択 ═════ */
    const CH_MAIL = "メール・DM";
    // AIバイヤー開拓で営業メールを送った相手か（名前で照らす）
    const mailedTo = (name: any): boolean => {
        try {
            const k = NK(name);
            if (!k || typeof v71obSt !== "function") return false;
            const runs = ((v71obSt() || {}).runs) || [];
            for (const r of runs) for (const L of ((r && r.leads) || [])) {
                if (!L || !Array.isArray(L.sent) || !L.sent.length) continue;
                if (NK(L.name || L.co || "") === k) return true;
            }
        } catch (e) { }
        return false;
    };
    API.mailedTo = mailedTo;
    try {
        if (typeof openDealForm === "function") {
            const __odf = openDealForm;
            openDealForm = function (this: any) {
                const r = __odf.apply(this, arguments as any);
                try {
                    const sel: any = document.getElementById("dfCh");
                    if (sel && sel.tagName === "SELECT" && !sel.dataset.r9b) {
                        sel.dataset.r9b = "1";
                        const o = document.createElement("option");
                        o.value = "";
                        o.textContent = M("（選んでください）", "(choose)", "（请选择）", "(elija)");
                        o.setAttribute("data-noi18n", "1");
                        sel.insertBefore(o, sel.firstChild);
                        sel.value = "";
                        sel.addEventListener("change", () => { sel.dataset.r9bMan = "1"; const n = document.getElementById("r9bChNote"); if (n) n.remove(); });
                        const auto = () => {
                            try {
                                if (sel.dataset.r9bMan || sel.value) return;
                                const b: any = document.getElementById("dfB");
                                if (!b || !mailedTo(b.value)) return;
                                sel.value = CH_MAIL;
                                if (!document.getElementById("r9bChNote")) {
                                    const n = document.createElement("small");
                                    n.id = "r9bChNote"; n.setAttribute("data-noi18n", "1");
                                    n.style.cssText = "display:block;margin:3px 0 0;font-size:11.5px;color:var(--ink-3,#6b7280)";
                                    n.textContent = M("AIバイヤー開拓でメールを送った相手なので「メール・DM」にしました（違うときは選び直してください）", "Set to “E-mail / DM” because you e-mailed this buyer from AI Buyer Outreach (change it if needed)", "因为已通过AI买家开拓向该对象发送邮件，已设为“邮件・私信”（不对时请重新选择）", "Se puso «Correo / DM» porque escribió a este comprador desde la prospección con IA (cámbielo si no es así)");
                                    sel.insertAdjacentElement("afterend", n);
                                }
                            } catch (e) { }
                        };
                        const b: any = document.getElementById("dfB");
                        if (b) { b.addEventListener("change", auto); b.addEventListener("input", auto); }
                        [300, 900].forEach((ms) => setTimeout(auto, ms));   // 相手の名前が入った状態で開く入口（バイヤーの一覧から）にも効かせる
                    }
                } catch (e) { warn("dealform", e); }
                return r;
            };
        }
        if (typeof dealSave === "function") {
            const __ds = dealSave;
            dealSave = function (this: any) {
                try {
                    const sel: any = document.getElementById("dfCh");
                    const b: any = document.getElementById("dfB");
                    if (sel && !sel.value && !sel.dataset.r9bMan && b && mailedTo(b.value)) sel.value = CH_MAIL;
                } catch (e) { }
                return __ds.apply(this, arguments as any);
            };
        }
    } catch (e) { warn("deal", e); }

    /* ═════ B. 登録の21件：「—」だけの値は未登録（表・取り込みの報告と同じ） ═════ */
    const DASH = /^[\s—\-ー–‐―－]+$/;
    const isDash = (v: any) => typeof v === "string" && v !== "" && DASH.test(v);
    // 中古品で、取引の基本条件の欄の名前が「保証」のとき、中古品の「動作保証」は同じ欄としてまとめる
    const shelfLbl = (): string => { try { return typeof v68pFL === "function" ? String(v68pFL("bShelf") || "") : ""; } catch (e) { return ""; } };
    const merged = (t: any): boolean => {
        try {
            if (!t || typeof v68pGroups !== "function") return false;
            const G = v68pGroups(t) || [];
            return G.indexOf("used") >= 0 && G.indexOf("basic") >= 0 && /保証|warrant|保修|garant/i.test(shelfLbl());
        } catch (e) { return false; }
    };
    const real = (v: any) => { try { return typeof v68pHas === "function" ? (v68pHas(v) && !(typeof v68pPlace === "function" && v68pPlace(v))) : !!String(v || "").trim(); } catch (e) { return false; } };
    // 資料に「—」とだけあった項目の印（はじめの設定の「商品を登録」は、この項目だけが残るときは済みのまま。
    //  前の版で 21/21 として済みになっていた人の手順を戻さない。数と表は「未登録」で、AIの質問・商品情報から入れられる）
    const markDash = (t: any, k: string) => { try { if (!t.v92r9bDash || typeof t.v92r9bDash !== "object") t.v92r9bDash = {}; t.v92r9bDash[k] = 1; } catch (e) { } };
    API.onlyDash = (t: any): boolean => {
        try {
            if (!t || !t.v92r9bDash || typeof scoreOf !== "function") return false;
            const s = scoreOf(t);
            const miss = (s && s.missing) || [];
            return miss.length > 0 && miss.every((x: any) => x && t.v92r9bDash[x.k]);
        } catch (e) { return false; }
    };
    let inFix = false;
    function dashFix(t: any): boolean {
        let ch = false;
        if (inFix) return false;
        inFix = true;
        try {
            if (!t || typeof t !== "object" || typeof NEED === "undefined" || !Array.isArray(NEED)) return false;
            NEED.forEach((x: any) => { if (x && isDash(t[x.k])) { t[x.k] = ""; ch = true; markDash(t, x.k); } });
            // 中古品の「動作保証」に入っていて、登録の欄（保証）が空なら、登録の欄にも入れる（同じ欄の1つの値）
            const A = t.v68attrs;
            if (A && real(A.warranty) && !String(t.shelf || "").trim() && merged(t)) { t.shelf = String(A.warranty); ch = true; }
        } catch (e) { } finally { inFix = false; }
        return ch;
    }
    API.dashFix = dashFix;
    const fixAll = () => { try { const t = ten(); if (t) dashFix(t); if (typeof TENS !== "undefined" && Array.isArray(TENS)) TENS.forEach((x: any) => { if (x && x !== t) dashFix(x); }); } catch (e) { } };
    try {
        if (typeof scoreOf === "function") {
            const __so = scoreOf;
            scoreOf = function (this: any, t: any) { try { dashFix(t); } catch (e) { } return __so.apply(this, arguments as any); };
        }
        if (typeof v92prodFill === "function") {
            const __pf = v92prodFill;
            v92prodFill = function (this: any, t: any) { try { dashFix(t === undefined ? ten() : t); } catch (e) { } return __pf.apply(this, arguments as any); };
        }
        if (typeof v54upldGot === "function") {
            const __ug = v54upldGot;
            v54upldGot = function (this: any, t: any) { try { dashFix(t); } catch (e) { } return __ug.apply(this, arguments as any); };
        }
        // 資料から読み取るとき：「—」だけの値は入れない（入れた・登録したと言わない。ヒアリングの途中で資料から読み直すときも同じ）
        if (typeof v54upldApply === "function") {
            const __ua = v54upldApply;
            v54upldApply = function (this: any, t: any) {
                const got = __ua.apply(this, arguments as any);
                try {
                    if (t && Array.isArray(got)) {
                        const drop = got.filter((k: any) => typeof k === "string" && isDash(t[k]));
                        if (drop.length) { drop.forEach((k: string) => { t[k] = ""; markDash(t, k); }); return got.filter((k: any) => drop.indexOf(k) < 0); }
                    }
                } catch (e) { }
                return got;
            };
        }
        // 任意の項目の一覧：まとめた「動作保証」は数えない（登録の21件の「保証（動作保証）」で数えている）
        if (typeof v92prodOpt === "function") {
            const __po = v92prodOpt;
            v92prodOpt = function (this: any, t: any) {
                const L = __po.apply(this, arguments as any);
                try { if (Array.isArray(L) && merged(t)) return L.filter((x: any) => !(x && x.k === "v68:warranty")); } catch (e) { }
                return L;
            };
        }
        if (typeof render === "function") {
            const __rn = render;
            render = function (this: any) { fixAll(); return __rn.apply(this, arguments as any); };
        }
    } catch (e) { warn("dash", e); }
    // はじめの設定の「商品を登録」：残りが資料に「—」とあった項目だけなら済み（上の印。前の版で済みだった人の手順を戻さない）
    try {
        if (typeof ux32Setup === "function") {
            const __us = ux32Setup;
            ux32Setup = function (this: any) {
                const S = __us.apply(this, arguments as any);
                try {
                    const t = ten();
                    if (Array.isArray(S) && t && API.onlyDash(t)) {
                        const r = S.find((x: any) => Array.isArray(x) && x[0] === "fill");
                        const up = S.find((x: any) => Array.isArray(x) && x[0] === "up");
                        if (r && !r[4] && (!up || up[4])) { r[4] = true; if (r.length > 6 && /足りない情報/.test(String(r[6] || ""))) r[6] = ""; }
                    }
                } catch (e) { }
                return S;
            };
        }
    } catch (e) { warn("setup", e); }
    // AIの質問「保証・品質の条件（無ければ「なし」で大丈夫です）」に「なし」と答えたら、飛ばさずに「保証なし」として入れる
    //（前からの層は「なし」を「答えない」と読むため、問いの文どおりに答えても未登録のまま残っていた）
    try {
        if (typeof fillAnswer === "function") {
            const __fa = fillAnswer;
            fillAnswer = function (this: any, v: any) {
                const args: any = [].slice.call(arguments);
                try {
                    const cu = (typeof FILL !== "undefined" && FILL) ? FILL.cur : null;
                    const vs = String(v == null ? "" : v).trim();
                    if (cu && cu.k === "shelf" && /^(なし|無し|ない|ないです|ありません|特になし|特にない|該当なし|none|no)$/i.test(vs) && /なし/.test(String(cu.q || "") + String(cu.ex || "")))
                        args[0] = /保証|warrant/i.test(String(cu.n || "") + String(cu.q || "")) ? "保証なし" : "該当なし";
                } catch (e) { }
                return __fa.apply(this, args);
            };
        }
    } catch (e) { warn("fa", e); }
    // 業種ごとの項目の表
    try {
        if (typeof v68pFieldRow === "function") {
            const __fr = v68pFieldRow;
            const MARK = "R9BVALUE0";
            v68pFieldRow = function (this: any, t: any, f: any) {
                try {
                    if (t && f && f.g === "used" && f.k === "warranty" && merged(t)) return "";   // 取引の基本条件の「保証（動作保証）」の行にまとめた
                    if (t && f && f.ref && typeof NEED !== "undefined" && NEED.some((n: any) => n && n.k === f.ref)) {
                        let v = t[f.ref];
                        const A = t.v68attrs || {};
                        const both = f.ref === "shelf" && merged(t) && real(A.warranty) && real(v) && NK(A.warranty) !== NK(v);
                        // 21件の数で「入っている」値（なし・未定 などの答え）は、表でも登録済みと出す
                        const counted = typeof v === "string" && v.trim() && !isDash(v) && typeof v68pPlace === "function" && v68pPlace(v);
                        if (both || counted) {
                            const show = both ? String(v) + " ／ " + String(A.warranty) : String(v);
                            const t2 = Object.assign({}, t); t2[f.ref] = MARK;
                            const h = String(__fr.call(this, t2, f));
                            if (h.indexOf(MARK) >= 0) return h.split(MARK).join(typeof v68pE === "function" ? v68pE(show) : E(show));
                        }
                    }
                } catch (e) { warn("row", e); }
                return __fr.apply(this, arguments as any);
            };
        }
    } catch (e) { warn("row-wrap", e); }

    /* ═════ C. 目標と道筋：連絡のペースの根拠の文を、計算の数（保守・標準・挑戦）で ═════ */
    try {
        if (typeof v92goalReachHtml === "function") {
            const __rh = v92goalReachHtml;
            v92goalReachHtml = function (this: any, pl: any) {
                let h = __rh.apply(this, arguments as any);
                try {
                    const SC = pl && pl.SC;
                    if (typeof h === "string" && SC && SC.lo && SC.mid && SC.hi) {
                        const f = (x: any) => (+x.pace || 0).toFixed(1);
                        h = h.replace(/連絡のペース 月 [\d.]+〜[\d.]+社：STANDAGE の記録の、1か月に会うバイヤーの数（中央値・上位25%）。挑戦はその 2\.5倍（展示会＋毎月の AIバイヤー開拓）/,
                            E(`連絡のペース（1か月に会うバイヤーの数・STANDAGE の記録）：保守 月 ${f(SC.lo)}社（中央値）・標準 月 ${f(SC.mid)}社（上位25%）・挑戦 月 ${f(SC.hi)}社（標準の 2.5倍：展示会＋毎月の AIバイヤー開拓）。この画面の「標準」は 月 ${f(SC.mid)}社 です`))
                            .replace(/Outreach pace from STANDAGE medians/,
                                E(`Outreach pace (buyers met per month, STANDAGE records): cautious ${f(SC.lo)} (median), standard ${f(SC.mid)} (top 25%), stretch ${f(SC.hi)} (2.5× standard: trade shows + monthly AI outreach). “Standard” on this screen means ${f(SC.mid)} a month`));
                    }
                } catch (e) { warn("reach", e); }
                return h;
            };
        }
    } catch (e) { warn("reach-wrap", e); }

    /* ═════ D. AI商社マン：国の名前のある質問は、その国の案件・調べで答える ═════ */
    const caseFor = (c: string): number => {
        try {
            if (typeof SHIPS === "undefined" || !Array.isArray(SHIPS)) return -1;
            const L = SHIPS.map((x: any, i: number) => ({ x, i })).filter((o: any) => o.x && o.x.ship && (!c || String(o.x.ship.country || "") === c));
            if (!L.length) return -1;
            const smp = (S: any) => { try { return typeof v536Smp === "function" ? !!v536Smp(S) : /^（想定）/.test(String(S.buyer || "")); } catch (e) { return false; } };
            const ord = (o: any) => !!(o.x.po || o.x.ship.poNo);
            const sc = (o: any) => (smp(o.x.ship) ? 0 : 2) + (ord(o) ? 1 : 0) + (o.i === SHIPA ? 0.5 : 0);
            L.sort((a: any, b: any) => sc(b) - sc(a) || (+(b.x.at || 0) - +(a.x.at || 0)));
            return L[0].i;
        } catch (e) { return -1; }
    };
    API.caseFor = caseFor;
    try {
        if (typeof ansDocs === "function") {
            const __ad = ansDocs;
            ansDocs = function (this: any, q: any) {
                const args = arguments;
                try {
                    const c = typeof pickCountry === "function" ? String(pickCountry(q) || "") : "";
                    const S0 = (typeof D !== "undefined" && D && D.ship) || null;
                    const i = caseFor(c);
                    if (c && i < 0 && S0 && String(S0.country || "") !== c && typeof ansReg === "function") {
                        // その国の案件が無い：その国の規制の調べで答える（ほかの国の案件の書類を出さない）
                        const R = ansReg(q);
                        const known = !!(typeof D !== "undefined" && D && D.regs && D.regs[c]);
                        if (R && typeof R.a === "string" && !known) return R;   // まだ調べていない国：調べ方の案内だけ（前置きを重ねない）
                        if (R && typeof R.a === "string") {
                            const head = `<span data-noi18n>${E(M(`${c}向けの案件はまだありません。${c}の規制の調べから、要る手続き・書類をお答えします（見積書・請求書・梱包明細の下書きは、${c}向けの案件を作ると「書類をつくる」でつくれます）。`,
                                `There is no case for ${c} yet. Here are the procedures and documents from the ${c} regulation check (drafts of the quotation, invoice and packing list can be made in “Create documents” once there is a case for ${c}).`,
                                `还没有面向${c}的案件。以下根据${c}的法规调查回答所需手续和文件（建立面向${c}的案件后，可在“制作文件”中制作报价单・发票・装箱单的草稿）。`,
                                `Aún no hay un caso para ${c}. Estos son los trámites y documentos según la revisión de normativa de ${c} (los borradores de cotización, factura y lista de empaque se crean en «Crear documentos» cuando haya un caso para ${c}).`))}</span><br><br>`;
                            return Object.assign({}, R, { a: head + R.a });
                        }
                    }
                    if (i >= 0 && typeof SHIPS !== "undefined" && SHIPS[i] && SHIPS[i].ship && SHIPS[i].ship !== S0) {
                        // 同じ国（または国の指定なし）で、受注の案件がある：その案件で答える（いま開いている案件は変えない）
                        const a0 = SHIPA;
                        try { D.ship = SHIPS[i].ship; SHIPA = i; return __ad.apply(this, args as any); }
                        finally { D.ship = S0; SHIPA = a0; }
                    }
                } catch (e) { warn("ansDocs", e); }
                return __ad.apply(this, args as any);
            };
        }
    } catch (e) { warn("ansDocs-wrap", e); }
    try {
        if (typeof ansReg === "function") {
            const __ar = ansReg;
            ansReg = function (this: any) {
                const res = __ar.apply(this, arguments as any);
                try {
                    if (!res || typeof res.a !== "string") return res;
                    const re = /<br><span style="color:var\(--warn\)">⚠ ([^<]*)<\/span>/g;
                    const seen: any = {};
                    let m: any;
                    while ((m = re.exec(res.a))) seen[m[1]] = (seen[m[1]] || 0) + 1;
                    const dup = Object.keys(seen).filter((k) => seen[k] > 1);
                    if (!dup.length) return res;
                    let a = res.a;
                    dup.forEach((w) => {
                        const tag = `<br><span style="color:var(--warn)">⚠ ${w}</span>`;
                        const n = seen[w];
                        // 最後の1つだけ残し、「N か国 共通」を付ける（国ごとの行の下に同じ文を重ねない）
                        const one = `<br><span style="color:var(--warn)">⚠ ${E(M(`${n}か国 共通：`, `Same for all ${n} countries: `, `${n}个国家相同：`, `Igual para los ${n} países: `))}${w}</span>`;
                        a = a.split(tag).reduce((acc: string, s: string, j: number) => j === 0 ? s : acc + (j === n ? one : "") + s, "");
                    });
                    res.a = a;
                } catch (e) { warn("ansReg", e); }
                return res;
            };
        }
    } catch (e) { warn("ansReg-wrap", e); }

    /* ═════ E. ログイン ═════ */
    // 業種サンプル・手入力の商品を開いていた人には「アップロードした商品情報を復元」と言わない（other-U03）
    try {
        if (typeof toast === "function") {
            const __to = toast;
            toast = function (this: any, m: any) {
                const args: any = [].slice.call(arguments);
                try {
                    const s = String(m == null ? "" : m);
                    const t = ten();
                    if (t && /^前回アップロードした商品情報を復元しました/.test(s) && typeof v54upldOrigin === "function" && typeof v54upldRestoreMsg === "function") {
                        const o = v54upldOrigin(t);
                        if (o === "sample" || o === "manual") {
                            let pct: any = "";
                            try { pct = scoreOf(t).pct; } catch (e) { }
                            args[0] = v54upldRestoreMsg(t, pct);
                        }
                    }
                } catch (e) { }
                return __to.apply(this, args);
            };
        }
    } catch (e) { warn("toast", e); }
    // 390：担当者名の欄の文（placeholder）は短く、長い説明は欄の下に（欄の文が切れない）
    function lgName() {
        try {
            const n: any = document.getElementById("lg-name");
            if (!n) return;
            const narrow = (window.innerWidth || 1024) <= 520;
            let hint: any = document.getElementById("r9bLgHint");
            if (!narrow) { if (hint) hint.remove(); if (n.dataset.r9bPh && n.getAttribute("placeholder") === n.dataset.r9bPh && n.dataset.r9bLong) n.setAttribute("placeholder", n.dataset.r9bLong); return; }
            const short = M("ご担当者名", "Your name", "负责人姓名", "Su nombre");
            const long = M("招待状・申し込みのときの氏名を入れてください", "Enter your name as on the invitation or application", "请输入邀请函或申请时的姓名", "Escriba su nombre como en la invitación o la solicitud");
            const cur = n.getAttribute("placeholder") || "";
            if (cur !== short) { n.dataset.r9bLong = cur; n.dataset.r9bPh = short; n.setAttribute("placeholder", short); }
            if (!hint) {
                hint = document.createElement("small");
                hint.id = "r9bLgHint"; hint.setAttribute("data-noi18n", "1");
                hint.style.cssText = "display:block;margin:4px 0 0;font-size:12px;line-height:1.5;color:var(--ink-3,#6b7280);text-align:left";
                n.insertAdjacentElement("afterend", hint);
            }
            if (hint.textContent !== long) hint.textContent = long;
        } catch (e) { }
    }
    API.lgName = lgName;
    try {
        const watch = () => {
            const n = document.getElementById("lg-name");
            if (!n) return;
            lgName();
            try { new MutationObserver(() => { lgName(); }).observe(n, { attributes: true, attributeFilter: ["placeholder"] }); } catch (e) { }
        };
        [0, 1200, 3000].forEach((ms) => setTimeout(() => { const n: any = document.getElementById("lg-name"); if (n && !n.dataset.r9bW) { n.dataset.r9bW = "1"; watch(); } else lgName(); }, ms));
        window.addEventListener("resize", () => lgName());
        document.addEventListener("change", (e: any) => { if (e.target && e.target.id === "lang") setTimeout(lgName, 900); }, true);
    } catch (e) { }

    /* ═════ F. 書類の「確かめること」：まとめた規則の文は仕向国の分だけ（auto-U04） ═════ */
    try {
        if (typeof v85docJudge === "function") {
            const __jd = v85docJudge;
            v85docJudge = function (this: any) {
                const J = __jd.apply(this, arguments as any);
                try {
                    const dc = J && J.F && J.F.dest;
                    const dn = dc && typeof v85docCName === "function" ? String(v85docCName(dc) || "") : "";
                    const names: string[] = typeof V85CN !== "undefined" && V85CN ? Object.keys(V85CN).map((k) => String(V85CN[k] || "")).filter((x) => x && x !== dn) : [];
                    if (!dn || !names.length) return J;
                    const other = (s: string) => names.some((n) => s.indexOf(n + "は") === 0 || s.indexOf(n + " ") === 0 || s.indexOf(n + "の") === 0);
                    const mine = (s: string) => s.indexOf(dn) === 0;
                    // 「（ベトナムは…、マレーシアは…、シンガポールは…）」→ 仕向国の分だけ
                    const cut = (c: string) => String(c || "").replace(/（([^（）]*(?:（[^（）]*）[^（）]*)*)）/g, (m0: string, inner: string) => {
                        const parts = inner.split("、");
                        if (parts.length < 2 || !parts.some(mine) || !parts.some(other)) return m0;
                        return "（" + parts.filter((p) => !other(p)).join("、") + "）";
                    });
                    const cutN = (n: string) => { const S = String(n || "").split("。").filter((x) => x.trim()); if (S.length < 2 || !S.some(mine) || !S.some(other)) return n; return S.filter((x) => !other(x)).join("。") + "。"; };
                    const cutS = (s: string) => { const P = String(s || "").split("／"); if (P.length < 2 || !P.some((x) => x.indexOf(dn) >= 0) || !P.some((x) => other(x.trim()))) return s; return P.filter((x) => !other(x.trim())).join("／"); };
                    Object.keys(J.rows || {}).forEach((k) => {
                        const r = J.rows[k];
                        (r.why || []).forEach((w: any) => { if (w && w.c) w.c = cut(w.c); if (w && w.n) w.n = cutN(w.n); });
                        (r.src || []).forEach((x: any) => { if (x && x.s) x.s = cutS(x.s); });
                    });
                } catch (e) { warn("judge", e); }
                return J;
            };
        }
    } catch (e) { warn("judge-wrap", e); }

    /* ═════ G. 販売先国の選定：推奨の3か国の外の国を確定したときも、その国の評価のカードを出す（indagri-N15） ═════ */
    try {
        if (typeof vCty === "function") {
            const __vc = vCty;
            vCty = function (this: any) {
                let h = __vc.apply(this, arguments as any);
                try {
                    if (typeof h !== "string" || typeof ctyStore !== "function" || typeof ctyChosen !== "function") return h;
                    const s = ctyStore() || {};
                    const top: string[] = s.top || [], rec: any[] = s.rec || [], ch: string[] = ctyChosen() || [];
                    const add = rec.filter((r: any) => r && ch.indexOf(r.c) >= 0 && top.indexOf(r.c) < 0);
                    const OPEN = '<div class="g2" style="align-items:start;gap:11px;margin-bottom:11px">';
                    const at = h.indexOf(OPEN);
                    if (!add.length || at < 0) return h;
                    const lead = (x: any) => { try { return typeof v54ctyLead === "function" ? v54ctyLead(x) : x; } catch (e) { return x; } };
                    const num = (x: any) => { try { return typeof v56priceCNum === "function" ? v56priceCNum(x) : x; } catch (e) { return x; } };
                    const cards = add.map((r: any) => {
                        const f = r.facts || {}, sc = r.sc || {};
                        const docs = Array.isArray(f.docs) ? f.docs.map(E).join("・") : "";
                        const rows: string[] = [];
                        rows.push(`<b>📋 ${E(M("規制", "Regulation", "法规", "Normativa"))}（${E(sc.reg)}）</b>：${E(M("関税", "Duty", "关税", "Arancel"))} ${E(f.duty || "—")}／${E(M("通関", "Customs", "通关", "Aduana"))} ${E(lead(f.lead) || "—")}${docs ? "／" + E(M("必要書類", "Documents", "所需文件", "Documentos")) + " " + docs : ""}`);
                        rows.push(`<b>📈 ${E(M("市場性", "Market", "市场性", "Mercado"))}（${E(num(sc.mkt))}）</b>　<b>⚔ ${E(M("競合", "Competition", "竞争", "Competencia"))}（${E(num(sc.comp))}）</b>　<b>📍 ${E(M("STANDAGE拠点", "STANDAGE base", "STANDAGE据点", "Base STANDAGE"))}（${E(sc.base)}）</b>`);
                        const why = [r.why && `<b>${E(M("評価の要点", "Key points", "评估要点", "Puntos clave"))}</b><br>${E(r.why)}`, r.risk && `<b style="color:var(--crit)">${E(M("リスク", "Risks", "风险", "Riesgos"))}</b><br>${E(r.risk)}`, r.next && `<b style="color:var(--bl)">${E(M("最初の一歩", "First step", "第一步", "Primer paso"))}</b><br>${E(r.next)}`].filter(Boolean).join("<br>");
                        return `<div class="c" data-r9bcty="${E(r.c)}"><div class="rw" style="justify-content:space-between;gap:8px;flex-wrap:wrap"><h3>${E(r.c)} <span class="p">${E(M("推奨の3か国の外", "Not in the top 3", "不在推荐的3国内", "Fuera de los 3 recomendados"))}</span> <span class="n" style="font-size:16px;color:var(--or-deep)">${E(sc.total)}${E(M("点", " pts", "分", " pts"))}</span></h3><span class="p hi">${E(M("確定済み", "Confirmed", "已确定", "Confirmado"))}</span></div>
    <div class="g2" style="margin-top:8px;gap:8px"><div style="padding:9px 11px;border:1px solid var(--line);border-radius:var(--r2);background:var(--surface-2);font-size:11.5px;line-height:1.7">${rows.join("<br>")}</div>
    <div style="padding:9px 11px;border:1px solid var(--line);border-radius:var(--r2);font-size:11.5px;line-height:1.7">${why || E(M("この国の評価の文はまだありません（上の表の行の点数で確かめてください）", "No written assessment yet (see the scores in the table above)", "该国尚无评估说明（请看上表中的分数）", "Aún no hay evaluación escrita (vea los puntos en la tabla)"))}</div></div></div>`;
                    }).join("");
                    h = h.slice(0, at + OPEN.length) + cards + h.slice(at + OPEN.length);
                } catch (e) { warn("vCty", e); }
                return h;
            };
        }
    } catch (e) { warn("vCty-wrap", e); }

    /* ═════ H. 営業資料：中古車・建設機械（1台ずつ売る中古の機械）は、次の一歩の選択肢を「図面で見積」ではなく「仕様書」に（auto-N16） ═════ */
    try {
        if (typeof v85dkCta === "function") {
            const __ct = v85dkCta;
            v85dkCta = function (this: any) {
                const L = __ct.apply(this, arguments as any);
                try {
                    const c = String((ten() || {}).cat || "");
                    if (Array.isArray(L) && (c === "中古車" || c === "建設機械")) return L.map((o: any) => (o === "drawing" ? "spec" : o)).filter((o: any, i: number, a: any[]) => a.indexOf(o) === i);
                } catch (e) { }
                return L;
            };
        }
    } catch (e) { warn("cta", e); }

    dict([
        ["（選んでください）", "(choose)", "（请选择）", "(elija)"],
    ]);
})();
