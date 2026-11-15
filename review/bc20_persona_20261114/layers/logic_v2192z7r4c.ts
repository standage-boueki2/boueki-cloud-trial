/* 21.92 r4c：4巡目の直し（商品情報を登録・商品情報・販売先国・規制・AI商社マン・営業資料・用語集・ヘルプ・入口・スマホ・管理者・物流会社）
   A  取り込みの報告：値が「—」だけの項目は「取り込んだ項目」に数えない（auto-N09・culture-N21）／商品名の「2017年式」を年式の項目に（auto-N09）
   B  販売先国：国別の詳細の「規制当局」に制度・規格の名前（CEマーキング など）が出るとき、当局ではないと分かる書き方に（indagri-N16）
   C  物流会社：時期外の情勢メモ（繁忙期・台風）は日数・順位に足さない（cross-18）／B/L・出荷の情報の ETD・ETA を日付の欄にして前後を確かめる（other-N15）
      ／「この区間の金額を直す」で有効期限も今の値を入れる（other-N14）
   D  メンバーの停止：ブラウザ標準の窓ではなく、アプリの窓で確かめる（xlogin-28）
   E  ログイン画面：担当者が分からないときの窓口（はじめてガイドに載っている連絡先）を出す（xlogin-03）
   F  刷新版の層への橋（商品の有無・足りない項目の数）window.v92r4c（xcut-M06・xlogin-07）
   G  書類の Seller 欄：日本語の住所から、英語の順番の下書きを作る手助け（culture-N20）
   H  HS が不明のとき：文化・教育用品の主な HS の候補（culture-M03）
   I  見本のアカウントでも、案件があれば「はじめまして」を出さずホームから（other-M04）
   J  何でも検索：語の一部に用語の略語が入っているだけの当たり（Pacific の CI）は後ろへ（culture-N24）
   K  推奨FOBの試算：登録済みの重さを、正味重量の欄の下に出す（health-N08）
   L  規制を調べる：関税率が「要確認」のとき、相手国の関税率表の調べ方（JETRO の案内）への入口を同じ言い方で出す（other P3）
   M  ヘルプの窓：「3つのステップだけ…」を、6つの手順の中の最初の3つと分かる文に（culture-13・health-12・indagri-N13）
   数字・規制の中身は足していない（HS の見出し・JETRO の案内ページ・ガイドに載っている窓口だけ） */
declare const TEN: any, TENS: any, D: any, SES: any, I18N: any, NEED: any, FWD_SITU: any, V79FWD_SEASON: any, FWDB: any, V68P_G: any, FWDON: any;
declare let v54upldGot: any, v68pAbsorb: any, v68pSetF: any, v68pGroups: any, ctyDeepBase: any, fwdSituFor: any, v33CaseEdit: any, tmStopToggle: any, showWelcome: any;
declare let hsCandidates: any, uxPalItems: any, render: any, go: any, cur: any, scoreOf: any, v33Sheet: any, v33SheetClose: any, bmThreadsAll: any, v79fwdMonth: any;
declare let tmFind: any, tmCan: any, tmMe: any, tmAdmGet: any, ux17Help: any, opsTab: any, toast: any, ux32Setup: any;
(function () {
    const W: any = window;
    if (W.__v2192r4c) return;
    W.__v2192r4c = 1;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const LG = () => { try { return (typeof I18N !== "undefined" && I18N && I18N.lang) || document.documentElement.lang || "ja"; } catch (e) { return "ja"; } };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = String(LG()).slice(0, 2); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const NK = (s: any) => String(s == null ? "" : s).normalize("NFKC");
    const ten = () => { try { return typeof TEN !== "undefined" ? TEN : null; } catch (e) { return null; } };
    const dd = () => { try { return typeof D !== "undefined" ? D : null; } catch (e) { return null; } };
    const isFwd = () => { try { return (typeof FWDON !== "undefined" && FWDON) || (typeof SES !== "undefined" && SES && SES.role === "fwd"); } catch (e) { return false; } };

    /* ═════ A. 取り込みの報告・年式 ═════ */
    const DASH = /^[\s—\-ー–‐―－]*$/;
    if (typeof v54upldGot === "function") {
        const __g = v54upldGot;
        v54upldGot = function (this: any, t: any) {
            let r = __g.apply(this, arguments as any);
            try { if (Array.isArray(r) && t) r = r.filter((x: any) => !(x && typeof t[x.k] === "string" && DASH.test(t[x.k]))); } catch (e) { }
            return r;
        };
    }
    if (typeof v68pAbsorb === "function") {
        const __ab = v68pAbsorb;
        v68pAbsorb = function (this: any, t: any) {
            let ch = __ab.apply(this, arguments as any);
            try {
                if (t && (t.src === "upload" || t.src === "sample2") && typeof V68P_G !== "undefined" && V68P_G && typeof v68pGroups === "function") {
                    const A = t.v68attrs || {};
                    // 文化・教育用品：素材表の行 → 素材、強みにある「◯語の手引き・説明書」→ 説明書・教材の言語（culture-N21。手入力した欄は上書きしない）
                    if (V68P_G.v92culture && Array.isArray(V68P_G.v92culture.f) && (v68pGroups(t) || []).indexOf("v92culture") >= 0) {
                        const S = t.v68src || {};
                        const FF = (k: string) => V68P_G.v92culture.f.find((x: any) => x && x.k === k);
                        const put = (k: string, v: string, src: string) => { const f = FF(k); if (!f || !v || S[k] === "手入力" || String(A[k] || "").trim()) return; if (typeof v68pSetF === "function") v68pSetF(t, f, v, src); else { t.v68attrs = t.v68attrs || {}; t.v68attrs[k] = v; } ch = true; };
                        const rows = (t.compRows || []).filter(Array.isArray).map((r: any[]) => r.map((x) => String(x == null ? "" : x).trim()).filter(Boolean)).filter((r: string[]) => r.length >= 2);
                        if (rows.length) put("cuMaterial", rows.map((r: string[]) => r[0] + "＝" + r.slice(1).join("・")).join("、").slice(0, 160), "表");
                        const st = (t.strengths || []).map((x: any) => NK(Array.isArray(x) ? x.join(" ") : x)).join(" ／ ");
                        const m2 = st.match(/((?:[一-龥ァ-ヶー]{1,8}語[・、と]?)+)の?(手引き|説明書|マニュアル|教材|ガイド|解説)/);
                        if (m2) put("cuLang", m2[1].replace(/[・、と]$/, "") + "の" + m2[2] + M("（商品の強みから）", " (from the strengths)"), "強み");
                    }
                    if (!String(A.year || "").trim()) {
                        let f: any = null;
                        (v68pGroups(t) || []).forEach((g: string) => { const G = V68P_G[g]; if (!f && G && Array.isArray(G.f)) f = G.f.find((x: any) => x && x.k === "year" && !x.ref) || null; });
                        const m = NK(t.item || "").match(/((?:19|20)\d{2})\s*年\s*(式|製)/);
                        if (f && m) {
                            const v = m[1] + "年" + m[2];
                            if (typeof v68pSetF === "function") v68pSetF(t, f, v, "商品名");
                            else { t.v68attrs = t.v68attrs || {}; t.v68attrs.year = v; }
                            ch = true;
                        }
                    }
                }
            } catch (e) { }
            return ch;
        };
    }

    /* ═════ B. 国別の詳細の「規制当局」：制度・規格の名前だけのときは、当局ではないと分かる書き方に ═════ */
    if (typeof ctyDeepBase === "function") {
        const __db = ctyDeepBase;
        ctyDeepBase = function (this: any) {
            const b = __db.apply(this, arguments as any);
            try {
                const a = String((b && b.authority) || "");
                if (a && !/要確認|当局/.test(a) && /^(CEマーキング|UKCA|CCC認証|NOM 認証|該当規格|特段の事前登録なし|SNI（国家規格）)/.test(a))
                    b.authority = M(`要確認（アプリの一般表にあるのは制度・規格の名前「${a}」で、当局の名前ではありません。担当の当局と、この商品が対象になるかは、品目ごとに確かめてください）`,
                        `To be confirmed (the app's general table lists a scheme/standard, “${a}”, not an authority. Check the authority in charge and whether this product is covered, item by item)`,
                        `需确认（应用的一般表中列出的是制度・标准名称“${a}”，不是主管机关。主管机关及本商品是否适用，请按品目确认）`,
                        `Por confirmar (la tabla general de la app indica un esquema/norma, «${a}», no una autoridad. Compruebe la autoridad competente y si este producto está cubierto)`);
            } catch (e) { }
            return b;
        };
    }

    /* ═════ C1. 物流会社：時期外の情勢メモは、所要日数・順位に足さない ═════ */
    if (typeof fwdSituFor === "function") {
        const __sf = fwdSituFor;
        fwdSituFor = function (this: any) {
            const out = __sf.apply(this, arguments as any);
            try {
                if (Array.isArray(out) && typeof FWD_SITU !== "undefined" && typeof V79FWD_SEASON !== "undefined" && Array.isArray(V79FWD_SEASON)) {
                    const mo = typeof v79fwdMonth === "function" ? v79fwdMonth() : (new Date().getMonth() + 1);
                    out.forEach((o: any) => {
                        if (!o || o.src !== "内蔵" || !(o.delay || o.risk)) return;
                        const x = FWD_SITU.find((y: any) => y && y.t === o.t);
                        if (!x) return;
                        const k = String(x.reg || "").split("|")[0];
                        const S = V79FWD_SEASON.find((s: any) => s && s.k === k);
                        if (!S || !Array.isArray(S.m) || S.m.includes(mo)) return;
                        o.v92r4cOff = { delay: o.delay, risk: o.risk };
                        o.delay = 0; o.risk = 0;
                        o.t = String(o.t) + M("（いまは時期外のため、所要日数・順位には足していません）", " (out of season now, so not added to the transit days or ranking)", "（现在不在该时期，未计入所需天数和排序）", " (fuera de temporada: no se suma a los días ni al orden)");
                    });
                }
            } catch (e) { }
            return out;
        };
    }

    /* ═════ C2. 物流会社：B/L・出荷の情報の ETD・ETA を日付の欄に。ETA が ETD より前なら保存の前に知らせる ═════ */
    const ISO = /^\d{4}-\d{2}-\d{2}$/;
    const toDay = (s: string) => { const m = NK(s).trim().match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : NaN; };
    if (typeof v33CaseEdit === "function") {
        const __ce = v33CaseEdit;
        v33CaseEdit = function (this: any) {
            const r = __ce.apply(this, arguments as any);
            try {
                const el = document.getElementById("v33sheet");
                if (el && !el.getAttribute("data-v92r4c")) {
                    el.setAttribute("data-v92r4c", "1");
                    const inp = (k: string) => el.querySelector('[data-csf="' + k + '"]') as HTMLInputElement | null;
                    ["etd", "eta", "ready"].forEach((k) => { const i = inp(k); if (i && (!i.value || ISO.test(i.value))) { try { i.type = "date"; } catch (e) { } } });
                    const bd = el.querySelector(".v33sh-bd");
                    const msg = document.createElement("p");
                    msg.className = "v92r4c-blmsg"; msg.setAttribute("role", "alert"); msg.setAttribute("data-noi18n", "1"); msg.hidden = true;
                    msg.style.cssText = "margin:8px 0 0;color:var(--bad,#b3261e);font-weight:700;font-size:13px";
                    if (bd) bd.appendChild(msg);
                    const check = () => {
                        const a = inp("etd"), b = inp("eta");
                        const d1 = a ? toDay(a.value) : NaN, d2 = b ? toDay(b.value) : NaN;
                        const bad = !isNaN(d1) && !isNaN(d2) && d2 < d1;
                        msg.hidden = !bad;
                        if (bad) msg.textContent = M("ETA（到着の予定日）が ETD（出港の予定日）より前になっています。日付を確かめてから保存してください。", "ETA (arrival) is earlier than ETD (departure). Please check the dates before saving.", "ETA（预计到达）早于 ETD（预计开船）。请确认日期后再保存。", "La ETA (llegada) es anterior a la ETD (salida). Revise las fechas antes de guardar.");
                        return bad;
                    };
                    el.addEventListener("input", () => { try { if (!msg.hidden) check(); } catch (e) { } });
                    el.addEventListener("click", (ev: any) => {
                        try {
                            const t = ev.target && ev.target.closest ? ev.target.closest("[data-ok]") : null;
                            if (!t) return;
                            if (check()) { ev.stopImmediatePropagation(); ev.stopPropagation(); ev.preventDefault(); const b = inp("eta"); if (b) b.focus(); }
                        } catch (e) { }
                    }, true);
                }
            } catch (e) { }
            return r;
        };
    }

    /* ═════ C3. 物流会社：「この区間の金額を直す」で、有効期限も今の値を入れる ═════ */
    document.addEventListener("click", (ev: any) => {
        try {
            const b = ev.target && ev.target.closest ? ev.target.closest("[data-v90fleg]") : null;
            if (!b) return;
            let n = 0;
            const tick = () => {
                try {
                    n++;
                    const g = (k: string) => document.getElementById(k) as HTMLInputElement | null;
                    const v = g("frValid"), p = g("frPrice");
                    if (v && p && p.value && !v.value && typeof FWDB !== "undefined" && FWDB && Array.isArray(FWDB.rates)) {
                        const val = (k: string) => String((g(k) || ({} as any)).value || "").trim();
                        const co = val("frCo"), pol = val("frPol"), pod = val("frPod"), mode = val("frMode").toUpperCase();
                        const prof = (FWDB.profile && FWDB.profile.co) || "";
                        const r = FWDB.rates.find((x: any) => x && String(x.pol || "") === pol && String(x.pod || "") === pod && String(x.mode || "").toUpperCase() === mode && (!co || String(x.co || prof) === co));
                        if (r && ISO.test(String(r.valid || ""))) {
                            v.value = String(r.valid);
                            v.dispatchEvent(new Event("input", { bubbles: true }));
                            v.dispatchEvent(new Event("change", { bubbles: true }));
                        }
                        return;
                    }
                } catch (e) { }
                if (n < 12) setTimeout(tick, 300);
            };
            setTimeout(tick, 500);
        } catch (e) { }
    }, true);

    /* ═════ D. メンバーの停止：アプリの窓で確かめる ═════ */
    const askStop = (name: string, msg: string, ok: () => void) => {
        if (typeof v33Sheet !== "function") { if (window.confirm(msg)) ok(); return; }
        const el = v33Sheet({
            title: M("メンバーを停止しますか？", "Suspend this member?", "要停用该成员吗？", "¿Suspender a este miembro?"),
            html: `<p class="v33p" data-noi18n style="line-height:1.8">${E(msg)}</p>`,
            foot: `<button class="btn g" type="button" data-x>${E(M("やめる", "Cancel", "取消", "Cancelar"))}</button><button class="btn" type="button" data-ok>${E(M("停止する", "Suspend", "停用", "Suspender"))}</button>`,
        });
        el.querySelector("[data-x]").onclick = () => { try { v33SheetClose(); } catch (e) { } };
        el.querySelector("[data-ok]").onclick = () => { try { v33SheetClose(); } catch (e) { } ok(); };
    };
    const withYes = (fn: () => void) => { const c0 = window.confirm; window.confirm = function () { return true; }; try { fn(); } finally { window.confirm = c0; } };
    if (typeof tmStopToggle === "function") {
        const __ts = tmStopToggle;
        tmStopToggle = function (this: any, name: any) {
            try {
                const m = typeof tmFind === "function" ? tmFind(name) : null;
                const can = typeof tmCan === "function" ? tmCan() : true;
                const me = typeof tmMe === "function" ? tmMe() : null;
                const self = !!(me && me.m && me.m.name === name);
                if (m && can && !self && m.st !== "disabled") {
                    askStop(name, M(`${name} さんを停止します。停止中はログインできません（あとで「再開」で戻せます）。`, `Suspend ${name}. They cannot sign in while suspended (you can resume later).`, `将停用 ${name}。停用期间无法登录（之后可以恢复）。`, `Se suspenderá a ${name}. No podrá iniciar sesión mientras esté suspendido (puede reanudarse después).`),
                        () => withYes(() => __ts.call(this, name)));
                    return;
                }
            } catch (e) { }
            return __ts.apply(this, arguments as any);
        };
    }
    document.addEventListener("click", (ev: any) => {
        try {
            const b = ev.target && ev.target.closest ? ev.target.closest("[data-tmastop]") : null;
            if (!b || b.getAttribute("data-v92r4c-go") || typeof tmAdmGet !== "function") return;
            const key = b.getAttribute("data-tmastop");
            const g = tmAdmGet(key);
            if (!g || !g.m || g.m.st === "disabled") return;
            ev.stopImmediatePropagation(); ev.stopPropagation(); ev.preventDefault();
            askStop(g.name, M(`${g.name} さんを停止します。停止中は、どの端末からもログインできません（あとで「再開」で戻せます）。`, `Suspend ${g.name}. They cannot sign in from any device while suspended (you can resume later).`, `将停用 ${g.name}。停用期间无法从任何设备登录（之后可以恢复）。`, `Se suspenderá a ${g.name}. No podrá iniciar sesión desde ningún dispositivo (puede reanudarse después).`),
                () => {
                    const all = Array.from(document.querySelectorAll("[data-tmastop]")) as any[];
                    const b2 = all.find((x) => x.getAttribute("data-tmastop") === key);
                    if (b2 && typeof b2.onclick === "function") withYes(() => b2.onclick());
                });
        } catch (e) { }
    }, true);

    /* ═════ E. ログイン画面：窓口（はじめてガイドに載っている連絡先） ═════ */
    const CT_MAIL = "sales_domestic@standage.co.jp", CT_TEL = "03-6435-3371";
    const ctHtml = () => `${E(M("担当者が分からない・連絡がつかないときの窓口：株式会社STANDAGE", "If you do not know your representative, contact STANDAGE Inc.:", "不清楚负责人或联系不上时的窗口：STANDAGE 股份有限公司", "Si no conoce a su responsable, contacte con STANDAGE Inc.:"))}　<a href="mailto:${CT_MAIL}">${CT_MAIL}</a>　／　<a href="tel:${CT_TEL.replace(/-/g, "")}">${E(M("電話 ", "Tel. ", "电话 ", "Tel. "))}${CT_TEL}</a><br><small>${E(M("会社名と、お持ちであればアクセスコードをお伝えください（はじめてガイドに載っている窓口です）。", "Please tell us your company name and, if you have one, your access code (this is the contact listed in the guide).", "请告知公司名称；如有访问码也请一并告知（这是指南中记载的联系窗口）。", "Indique el nombre de su empresa y, si lo tiene, su código de acceso (es el contacto que figura en la guía)."))}</small>`;
    function lgContact() {
        try {
            if (!document.body.classList.contains("locked")) return;
            const d = document.getElementById("v92e-lghelp");
            if (!d) return;
            const lang = LG();
            let p = document.getElementById("v92r4c-lgct");
            if (p && p.getAttribute("data-l") === lang) return;
            if (!p) {
                p = document.createElement("p");
                p.id = "v92r4c-lgct"; p.setAttribute("data-noi18n", "1");
                p.style.cssText = "margin:8px 0 0;padding:9px 12px;border:1px solid var(--line,#d9dee7);border-radius:10px;background:var(--surface-2,#f6f8fb);font-size:13px;line-height:1.7";
                d.insertAdjacentElement("afterend", p);
            }
            p.setAttribute("data-l", lang);
            p.innerHTML = ctHtml();
        } catch (e) { }
    }
    setInterval(lgContact, 1500);
    setTimeout(lgContact, 300);

    /* ═════ F. 刷新版の層への橋 ═════ */
    W.v92r4c = {
        state: () => {
            const o: any = { n: 0, has: false, miss: 0, names: [] as string[] };
            try { o.n = (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS.length : 0; } catch (e) { }
            try {
                const t = ten();
                o.has = !!(t && (t.item || t.file) && o.n > 0);
                if (o.has && typeof scoreOf === "function") { const s = scoreOf(t) || {}; const ms = (s.missing || []); o.miss = ms.length; o.names = ms.map((x: any) => String(x.n || x.k || "")); o.pend = !!t._pend; }
            } catch (e) { }
            return o;
        },
        contact: { mail: CT_MAIL, tel: CT_TEL },
    };

    /* ═════ G. 書類の Seller 欄：日本語の住所から、英語の順番の下書き ═════ */
    const PREF = "北海道|青森県|岩手県|宮城県|秋田県|山形県|福島県|茨城県|栃木県|群馬県|埼玉県|千葉県|東京都|神奈川県|新潟県|富山県|石川県|福井県|山梨県|長野県|岐阜県|静岡県|愛知県|三重県|滋賀県|京都府|大阪府|兵庫県|奈良県|和歌山県|鳥取県|島根県|岡山県|広島県|山口県|徳島県|香川県|愛媛県|高知県|福岡県|佐賀県|長崎県|熊本県|大分県|宮崎県|鹿児島県|沖縄県";
    const prefEn = (p: string) => { try { const e = I18N && I18N.dict && I18N.dict.en && I18N.dict.en[p]; if (e) return String(e).replace(/\s*Prefecture$/i, "").replace(/\s*Metropolis$/i, ""); } catch (e) { } return ""; };
    const hasJa = (s: string) => /[぀-ヿ㐀-鿿]/.test(s);
    function addrDraft(ja: string) {
        let s = NK(ja).replace(/\s+/g, " ").trim();
        let zip = "";
        const z = s.match(/〒?\s*(\d{3}-?\d{4})/);
        if (z) { zip = z[1].length === 7 ? z[1].slice(0, 3) + "-" + z[1].slice(3) : z[1]; s = s.replace(z[0], "").trim(); }
        const m = s.match(new RegExp("^(" + PREF + ")(.*)$"));
        if (!m) return null;
        const pe = prefEn(m[1]);
        let rest = m[2].trim(), city = "";
        const c = rest.match(/^(.+?郡.+?[町村]|.+?市.+?区|.+?[市区町村])(.*)$/);
        if (c) { city = c[1]; rest = c[2].trim(); }
        let town = rest, num = "", bld = "";
        const n = rest.match(/^(.*?)(\d[\d\-‐－ー丁目番地号の]*)\s*(.*)$/);
        if (n) { town = n[1].trim(); num = n[2].replace(/丁目|番地の?|番|の/g, "-").replace(/号/g, "").replace(/[‐－ー]/g, "-").replace(/-+/g, "-").replace(/-$/, ""); bld = n[3].trim(); }
        const q = (x: string) => (x ? (hasJa(x) ? "【" + x + "】" : x) : "");
        const parts = [[q(bld), num, q(town)].filter(Boolean).join(" "), q(city), (pe || q(m[1])) + (zip ? " " + zip : ""), "Japan"].filter(Boolean);
        return parts.join(", ");
    }
    function sellerHelp() {
        try {
            const ad = document.getElementById("v54sAd") as HTMLInputElement | null;
            if (!ad || document.getElementById("v92r4c-adh")) return;
            const dw = ad.closest("#dw, .dw, [role=dialog]") || ad.parentElement;
            let ja = "";
            try { const sp = Array.from((dw as Element).querySelectorAll("span[data-noi18n]")).find((x) => new RegExp("^(〒?\\s*\\d{3}-?\\d{4}\\s*)?(" + PREF + ")").test(NK(x.textContent || "").trim())); if (sp) ja = String(sp.textContent || "").trim(); } catch (e) { }
            const box = document.createElement("div");
            box.id = "v92r4c-adh"; box.setAttribute("data-noi18n", "1");
            box.style.cssText = "margin-top:6px;padding:8px 10px;border:1px dashed var(--line,#cfd6e0);border-radius:8px;font-size:12.5px;line-height:1.7";
            box.innerHTML = `<b>${E(M("日本語の住所から書くとき", "Writing from a Japanese address", "根据日文地址填写时", "Si parte de una dirección en japonés"))}</b>　${E(M("英語では、日本語と逆の順に並べます：建物・番地 → 町名 → 市区町村 → 都道府県 郵便番号 → Japan。", "In English the order is reversed: building / number → town → city → prefecture + postal code → Japan.", "英文的顺序与日文相反：楼名・门牌 → 町名 → 市区町村 → 都道府县 邮编 → Japan。", "En inglés el orden es inverso: edificio / número → barrio → ciudad → prefectura + código postal → Japan."))}
              <div style="margin-top:4px"><button type="button" class="btn g" id="v92r4c-adgo">${E(M("日本語の住所から、英語の順番の下書きを入れる", "Insert a draft in English order from the Japanese address", "根据日文地址填入英文顺序的草稿", "Insertar un borrador en orden inglés"))}</button></div>
              <p id="v92r4c-admsg" style="margin:4px 0 0"></p>`;
            ad.insertAdjacentElement("afterend", box);
            const go2 = document.getElementById("v92r4c-adgo") as HTMLButtonElement;
            go2.addEventListener("click", () => {
                try {
                    const msg = document.getElementById("v92r4c-admsg") as HTMLElement;
                    const src = hasJa(ad.value) ? ad.value : ja;
                    if (!src) { msg.textContent = M("所在地の欄に、日本語の住所（都道府県から）を入れてから押してください。", "Type the Japanese address (starting with the prefecture) in the address field, then press this.", "请先在地址栏中输入日文地址（从都道府县开始），再点击。", "Escriba primero la dirección en japonés (desde la prefectura) y pulse de nuevo."); return; }
                    const d = addrDraft(src);
                    if (!d) { msg.textContent = M("都道府県から始まる住所を入れてください（例：奈良県奈良市三条町45）。", "Please enter an address starting with the prefecture (e.g. 奈良県奈良市三条町45).", "请输入以都道府县开头的地址（例：奈良県奈良市三条町45）。", "Introduzca una dirección que empiece por la prefectura (p. ej. 奈良県奈良市三条町45)."); return; }
                    ad.value = d;
                    ad.dispatchEvent(new Event("input", { bubbles: true }));
                    msg.textContent = hasJa(d)
                        ? M("並びと、都道府県・郵便番号・Japan を英語にしました。【 】の中は読み方が自動では分からないので、ローマ字に書き直してください（例：【奈良市】→ Nara-shi、【三条町】→ Sanjo-cho）。【 】が残っている間は保存できません。", "The order, prefecture, postal code and “Japan” are now in English. Please retype the parts in 【 】 in Latin letters (e.g. 【奈良市】 → Nara-shi). You cannot save while 【 】 remains.", "已将顺序、都道府县、邮编和 Japan 改为英文。【 】中的部分无法自动判断读音，请改写为罗马字（例：【奈良市】→ Nara-shi）。保留【 】时无法保存。", "El orden, la prefectura, el código postal y «Japan» ya están en inglés. Reescriba en letras latinas las partes entre 【 】 (p. ej. 【奈良市】 → Nara-shi).")
                        : M("英語の順番に並べました。内容を確かめてから保存してください。", "Arranged in English order. Please check it before saving.", "已按英文顺序排列。请确认内容后保存。", "Ordenado al estilo inglés. Revíselo antes de guardar.");
                    ad.focus();
                } catch (e) { }
            });
        } catch (e) { }
    }
    document.addEventListener("click", () => { setTimeout(sellerHelp, 250); setTimeout(fobKgHint, 350); }, false);

    /* ═════ H. HS が不明のとき：文化・教育用品の主な HS の候補（見出しの番号だけ・要確認） ═════ */
    if (typeof hsCandidates === "function") {
        const __hc = hsCandidates;
        hsCandidates = function (this: any, t: any) {
            const L0 = __hc.apply(this, arguments as any);
            try {
                const only = Array.isArray(L0) && L0.length === 1 && /9999/.test(String((L0[0] || [])[0] || ""));
                if (t && only) {
                    const s = NK((t.item || "") + " " + (t.itemEn || "")).toLowerCase();
                    const T: any[] = [
                        [/積み木|つみき|パズル|玩具|おもちゃ|知育|人形|ぬいぐるみ|toy|puzzle|doll/, "9503.00", "玩具・パズル（要確認）"],
                        [/筆|書道|習字|calligraphy|brush/, "9603.30", "筆（書画用・化粧用を含む見出し。要確認）"],
                        [/鉛筆|クレヨン|パステル|チョーク|pencil|crayon/, "9609.10", "鉛筆・クレヨン類（要確認）"],
                        [/ボールペン|万年筆|ペン|pen\b/, "9608.10", "ボールペンなどの筆記具（要確認）"],
                        [/ノート|手帳|便箋|notebook/, "4820.10", "ノート・手帳類（要確認）"],
                        [/絵本|書籍|教科書|本\b|book/, "4901.99", "書籍（要確認）"],
                    ];
                    const hit = T.filter((x) => x[0].test(s)).map((x) => [x[1], x[2]]);
                    if (hit.length) return hit;
                }
            } catch (e) { }
            return L0;
        };
    }

    /* ═════ I. 見本のアカウントでも、案件（やりとり）があれば「はじめまして」を出さず、ホームから ═════ */
    if (typeof showWelcome === "function") {
        const __sw = showWelcome;
        showWelcome = function (this: any) {
            try {
                const n = (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS.length : 0;
                const th = typeof bmThreadsAll === "function" ? (bmThreadsAll() || []).length : 0;
                if (n > 0 && th > 0 && !isFwd()) {
                    try { if (typeof SES !== "undefined" && SES && SES.code) localStorage.setItem("bc20_wel_" + SES.code, "1"); } catch (e) { }
                    try { if (typeof cur !== "undefined" && cur === "up" && typeof go === "function") go("dash"); } catch (e) { }
                    return;
                }
            } catch (e) { }
            return __sw.apply(this, arguments as any);
        };
    }

    // データがあとから届く場合：はじめての窓が出たあとで、商品と案件があると分かったら閉じてホームへ（ログインのあと1回だけ）
    let welBusy = 0;
    function welLate() {
        if (W.__r4cWelDone || welBusy || isFwd()) return;
        const v = document.getElementById("welv");
        if (!v) return;
        const n = (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS.length : 0;
        const th = typeof bmThreadsAll === "function" ? (bmThreadsAll() || []).length : 0;
        if (!(n > 0 && th > 0)) return;
        W.__r4cWelDone = 1;
        welBusy = 1;
        try {
            try { if (typeof SES !== "undefined" && SES && SES.code) localStorage.setItem("bc20_wel_" + SES.code, "1"); } catch (e) { }
            v.remove();
            setTimeout(() => { try { if (typeof cur !== "undefined" && cur === "up" && !document.getElementById("v1811ov") && typeof go === "function") go("dash"); } catch (e) { } welBusy = 0; }, 50);
        } catch (e) { welBusy = 0; }
    }

    /* ═════ J. 何でも検索：語の途中に略語が入っているだけの用語は後ろへ ═════ */
    if (typeof uxPalItems === "function") {
        const __pal = uxPalItems;
        uxPalItems = function (this: any, q: any) {
            let items = __pal.apply(this, arguments as any) || [];
            try {
                const s = String(q || "").trim().toLowerCase();
                if (s.length >= 3 && Array.isArray(items)) {
                    const weak = (i: any) => {
                        if (!i || i.ic !== "📖" || !i.v92) return false;
                        const t = String(i.t || "").toLowerCase();
                        if (!t || t.indexOf(s) >= 0 || !/^[a-z0-9\/.\- ]+$/.test(t)) return false;
                        const j = s.indexOf(t);
                        if (j < 0) return false;
                        const a = j > 0 ? s[j - 1] : "", b = j + t.length < s.length ? s[j + t.length] : "";
                        return /[a-z0-9]/.test(a) || /[a-z0-9]/.test(b);
                    };
                    const w = items.filter(weak);
                    if (w.length && w.length < items.length) items = items.filter((i: any) => !weak(i)).concat(w);
                }
            } catch (e) { }
            return items;
        };
    }

    /* ═════ K. 推奨FOBの試算：登録済みの重さを、正味重量の欄の下に出す（入れるのは利用者） ═════ */
    function fobKgHint() {
        try {
            const kg = document.getElementById("fobKg") as HTMLInputElement | null;
            if (!kg || kg.value || document.getElementById("v92r4c-kgh")) return;
            const d = dd();
            if (!d) return;
            const found: { txt: string, kg: number }[] = [];
            const scan = (label: string, cell: any) => {
                const s = NK(cell);
                const re = /(\d+(?:[.,]\d+)?)\s*(kg|g)(?![a-z])/gi;
                let m: RegExpExecArray | null;
                while ((m = re.exec(s))) {
                    const v = parseFloat(m[1].replace(",", "")) * (m[2].toLowerCase() === "g" ? 0.001 : 1);
                    if (v > 0 && v < 100000 && !found.some((f) => f.kg === v)) found.push({ txt: (label ? label + "：" : "") + m[0], kg: Math.round(v * 10000) / 10000 });
                }
            };
            (d.dimRows || []).forEach((r: any) => { if (Array.isArray(r)) r.slice(1).forEach((c: any) => scan(String(r[0] || ""), c)); });
            scan(M("商品名", "Product name"), d.item || "");
            if (!found.length) return;
            const box = document.createElement("p");
            box.id = "v92r4c-kgh"; box.setAttribute("data-noi18n", "1");
            box.style.cssText = "margin:4px 0 0;font-size:12px;line-height:1.7";
            box.innerHTML = E(M("登録されている重さ（正味かどうかを確かめて、押すと入ります）：", "Registered weights (check that it is the net weight, then press to fill in): ", "已登记的重量（请确认是否为净重，点击即可填入）：", "Pesos registrados (compruebe que es el peso neto y pulse para rellenar): "))
                + found.slice(0, 4).map((f, i) => `<button type="button" class="btn g" data-v92r4c-kg="${i}" style="margin:2px 4px 2px 0;padding:2px 8px;font-size:12px">${E(f.txt)} → ${f.kg} kg</button>`).join("");
            (kg.parentElement || kg).insertAdjacentElement("beforeend", box);
            box.addEventListener("click", (ev: any) => {
                const b = ev.target && ev.target.closest ? ev.target.closest("[data-v92r4c-kg]") : null;
                if (!b) return;
                const f = found[+b.getAttribute("data-v92r4c-kg")];
                if (!f) return;
                kg.value = String(f.kg);
                kg.dispatchEvent(new Event("input", { bubbles: true }));
                kg.dispatchEvent(new Event("change", { bubbles: true }));
            });
        } catch (e) { }
    }

    /* ═════ L. 規制を調べる：関税率が「要確認」のとき、関税率表の調べ方への入口 ═════ */
    const TARIFF_URL = "https://www.jetro.go.jp/theme/export/tariff/";
    function tariffEntry() {
        try {
            if (isFwd()) return;
            const well = document.getElementById("well");
            if (!well) return;
            Array.from(well.querySelectorAll(".g3")).forEach((g3) => {
                const cell = g3.children[1] as HTMLElement | undefined;
                if (!cell || cell.querySelector(".v92r4c-tsrc")) return;
                const tx = cell.textContent || "";
                if (!/関税率|Tariff|Duty|关税|Arancel/i.test(tx) || !/要確認|To be confirmed|Check|需确认|Por confirmar|Verificar|目安/i.test(tx)) return;
                const p = document.createElement("p");
                p.className = "v92r4c-tsrc"; p.setAttribute("data-noi18n", "1");
                p.style.cssText = "margin:6px 0 0;font-size:12px;line-height:1.6;font-weight:400";
                p.innerHTML = `${E(M("調べ方：相手国の関税率表は、JETRO の案内", "How to check: the destination's tariff schedule can be searched by HS code via JETRO's page ", "查询方法：对方国家的税则可通过 JETRO 的介绍页", "Cómo comprobar: el arancel del país de destino puede consultarse por código HS desde la página de JETRO "))}<a href="${TARIFF_URL}" target="_blank" rel="noopener">${E(M("「世界各国の関税率」", "“Tariff rates of the world”", "“世界各国的关税率”", "«Aranceles del mundo»"))}</a>${E(M("から、HS コードで調べられます（利用登録が要ります）。分からないときは、下の「STANDAGE に規制の調査を依頼する」へ。", " (registration required). If unsure, use “Ask STANDAGE to research the regulations” below.", "按 HS 编码查询（需要注册）。不清楚时，请使用下方的“委托 STANDAGE 调查法规”。", " (requiere registro). Si tiene dudas, use «Pedir a STANDAGE que investigue la normativa»."))}`;
                cell.appendChild(p);
            });
        } catch (e) { }
    }

    /* ═════ M. ヘルプの窓：「3つのステップだけ…」を、6つの手順の最初の3つと分かる文に ═════ */
    function helpWords() {
        try {
            if (isFwd()) return;
            const dw = document.getElementById("dw");
            if (!dw) return;
            const KEY = "3つのステップだけ覚えてください";
            const vars = [KEY];
            try { ["en", "zh", "es"].forEach((l) => { const v = I18N && I18N.dict && I18N.dict[l] && I18N.dict[l][KEY]; if (v) vars.push(String(v)); }); } catch (e) { }
            Array.from(dw.querySelectorAll("p.lbl")).forEach((p) => {
                if (vars.indexOf((p.textContent || "").trim()) < 0) return;
                p.setAttribute("data-noi18n", "1");
                p.textContent = M("まずは「商品を登録」（はじめの設定の1つ目）。その中でやることは、この3つです", "Start with “Register your product” (step 1 of setup). It takes these three things", "先从“登记商品”开始（初始设置的第1步）。其中要做的是这3件事", "Empiece por «Registrar el producto» (paso 1). Consiste en estas tres cosas");
                const n = document.createElement("p");
                n.setAttribute("data-noi18n", "1");
                n.style.cssText = "font-size:12.5px;line-height:1.7;margin:4px 0 0";
                n.textContent = M("全体の流れは6つの手順です：① 商品を登録 → ② 販売先の国を選ぶ → ③ 規制を調べる → ④ 営業資料をつくる → ⑤ バイヤーを探す → ⑥ 商談を進める（ホームの「はじめの設定」と同じ並び）。", "The whole flow has six steps: ① Register a product → ② Choose target countries → ③ Check regulations → ④ Create sales materials → ⑤ Find buyers → ⑥ Advance deals (same order as “Setup” on Home).", "整体流程共6步：① 登记商品 → ② 选择销售国 → ③ 查询法规 → ④ 制作营业资料 → ⑤ 寻找买家 → ⑥ 推进商谈（与首页“初始设置”的顺序相同）。", "El flujo completo tiene seis pasos: ① Registrar el producto → ② Elegir países → ③ Consultar la normativa → ④ Crear materiales → ⑤ Buscar compradores → ⑥ Avanzar las negociaciones.");
                p.insertAdjacentElement("afterend", n);
            });
        } catch (e) { }
    }
    if (typeof ux17Help === "function") {
        const __h = ux17Help;
        ux17Help = function (this: any) { const r = __h.apply(this, arguments as any); try { helpWords(); setTimeout(helpWords, 200); } catch (e) { } return r; };
    }

    /* ═════ N. はじめの設定：販売先の国が未確定の間は「規制を調べる」を済みにしない（画面を開いただけで先に済みになる・culture-N17） ═════ */
    if (typeof ux32Setup === "function") {
        const __us = ux32Setup;
        ux32Setup = function (this: any) {
            const S = __us.apply(this, arguments as any);
            try {
                if (Array.isArray(S)) {
                    const c = S.find((x: any) => x && x[0] === "cty"), r = S.find((x: any) => x && x[0] === "reg");
                    if (c && r && !c[4] && r[4]) {
                        r[4] = false;
                        if (!r[5]) r[5] = M("まだの理由：販売先の国を確定してから、その国の規制を確かめます", "Not yet: confirm the target countries first, then check their regulations", "未完成的原因：请先确定销售国，再确认该国的法规", "Pendiente: confirme primero los países y luego consulte su normativa");
                    }
                }
            } catch (e) { }
            return S;
        };
    }

    /* ═════ O. 販売先国：根拠の説明の「（自社と同じカテゴリ）」を、実際に数えた区分の言い方に（auto-12・culture-06 の残り。日本語の画面だけ） ═════ */
    function ctyBasisWords() {
        if (isFwd() || String(LG()).slice(0, 2) !== "ja") return;
        if (typeof cur === "undefined" || cur !== "cty") return;
        const well = document.getElementById("well");
        if (!well) return;
        const tx = well.textContent || "";
        const KEY = "STANDAGE が商談したバイヤー（自社と同じカテゴリ）";
        if (tx.indexOf(KEY) < 0) return;
        const to = /近い区分「中古車・車両」/.test(tx) ? "STANDAGE が商談したバイヤー（近い区分「中古車・車両」で数えています）"
            : /区分「その他」/.test(tx) ? "STANDAGE が商談したバイヤー（さまざまな業種を含む区分「その他」で数えています）" : "";
        if (!to) return;
        const tw = document.createTreeWalker(well, NodeFilter.SHOW_TEXT);
        let n: any;
        while ((n = tw.nextNode())) { if (String(n.nodeValue).indexOf(KEY) >= 0) n.nodeValue = String(n.nodeValue).replace(KEY, to); }
    }

    /* ═════ 描いたあとの仕上げ ═════ */
    if (typeof render === "function") {
        const __r = render;
        render = function (this: any) {
            const r = __r.apply(this, arguments as any);
            try { tariffEntry(); setTimeout(tariffEntry, 400); setTimeout(tariffEntry, 1500); } catch (e) { }
            try { welLate(); } catch (e) { }
            try { ctyBasisWords(); } catch (e) { }
            return r;
        };
    }
    W.v92r4c.tariffEntry = tariffEntry;
    W.v92r4c.helpWords = helpWords;
})();
