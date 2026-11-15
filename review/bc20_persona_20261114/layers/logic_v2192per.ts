/* 21.92 per：8カテゴリー×ペルソナ評価（2026-11-14）の直し。本体の層（今の版・刷新版の両方に効く）
   ① AI ヒアリング：「AIの質問に答える」「AIと埋める」を押しても答える欄が画面の外のまま／答えるたびに画面が上へ戻る → 答える欄が見える位置へ送る
   ② AI ヒアリング：取引条件（建値）の質問に、インコタームズでない文（産地など）を送っても「登録しました」になる → 登録せず、聞き直す
   ③ 規制を調べる：「社内規制DBの関連レポートを見る」は STANDAGE 社員の Google アカウントが要り、お客様は行き止まりになる
      → 社員でないアカウントには、いま使える調べ方（AI の詳細調査・AI商社マン・STANDAGE への相談）を案内する窓に（社員は今のまま）
   ④ 規制を調べる：日本の輸出の禁止・規制措置の対象になりうる国・地域（ロシア・ベラルーシ・北朝鮮 ほか）を選んだときの注意
   ⑤ 販売先国の選定：表のチェックを4か国以上入れられ、確定すると上位3つだけが黙って確定される → 4つ目は入れられないようにして理由を出す
   ⑥ 商品情報：取引条件・支払条件・仕出港・産地・認証/規格・期限/保証を、「④ 業種ごとの項目」の先頭に「取引の基本条件」として出し、その場で直せるようにする
   今のアプリの関数は包むだけ（中身は変えない） */
declare const FILL: any, TEN: any, D: any, SES: any, V68P_G: any, V68P_GL: any, V68P_FL: any, S30_NEWS: any, I18N: any;
declare let fillStart: any, fillRender: any, applyAnswer: any, openRegdb: any, render: any, v68pGroups: any, cur: any, opsTab: any, v54upldKind: any, runParseReal: any;
declare const V1811: any, TENS: any;
declare function openDW(h: string): void;
declare function closeDW(): void;
declare function dwChrome(): void;
declare function toast(m: string): void;
declare function go(id: string): void;
declare function regAI(c?: any): void;
declare function v75tcStaff(): boolean;
(function () {
    const W: any = window;
    if (W.__v2192per)
        return;
    W.__v2192per = 1;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]);
    const lang = () => { try {
        const el = document.getElementById("lang") as any;
        const v = String((el && el.value) || "ja");
        return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
    }
    catch (e) {
        return "ja";
    } };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const say = (m: string) => { try {
        if (typeof toast === "function")
            toast(m);
    }
    catch (e) { } };

    /* ───── ① AI ヒアリング：答える欄が見える位置へ ───── */
    const V92 = { jump: 0 };
    function showAnswerBox() {
        const run = () => { try {
            const box = document.getElementById("fin2") || document.getElementById("fchat");
            if (!box)
                return;
            const r = box.getBoundingClientRect(), vh = window.innerHeight || 800;
            if (r.top < 80 || r.bottom > vh - 40) {
                const y = (window.scrollY || 0) + r.top - Math.max(120, Math.round(vh * 0.38));
                window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
            }
        }
        catch (e) { } };
        setTimeout(run, 80);
        setTimeout(run, 480);
        setTimeout(run, 1100);
    }
    W.v92perShowAnswerBox = showAnswerBox;
    if (typeof fillStart === "function") {
        const __fs92 = fillStart;
        fillStart = function (this: any) {
            const r = __fs92.apply(this, arguments as any);
            try {
                V92.jump = Date.now();
                showAnswerBox();
            }
            catch (e) { }
            return r;
        };
    }
    if (typeof fillRender === "function") {
        const __fr92p = fillRender;
        fillRender = function (this: any) {
            const r = __fr92p.apply(this, arguments as any);
            try {
                if (typeof FILL !== "undefined" && FILL && FILL.on && Date.now() - V92.jump < 2500)
                    showAnswerBox();
            }
            catch (e) { }
            return r;
        };
    }
    // 答えを送った・選択肢を押した・続きから始めた＝そのあとの描き直しでも答える欄を見せる
    document.addEventListener("click", ev => { try {
        const t = ev.target as any;
        if (t && t.closest && (t.closest("#fin2") || t.closest("#rdfill") || t.closest("[data-onclick*='fillStart']") || t.closest("[data-onclick*='fillResume']")))
            V92.jump = Date.now();
    }
    catch (e) { } }, true);
    document.addEventListener("keydown", ev => { try {
        const t = ev.target as any;
        if (ev.key === "Enter" && t && t.id === "fans")
            V92.jump = Date.now();
    }
    catch (e) { } }, true);

    /* ───── ② 取引条件（建値）の答えの確かめ ───── */
    const INCO = /(?:^|[^A-Za-z])(EXW|FCA|FAS|FOB|CFR|CIF|CPT|CIP|DAP|DPU|DDP|C&F|CNF)(?![A-Za-z])/i;
    const INCO_JA = /工場渡し|本船渡し|運賃込み|運賃保険料込み|仕向地持込|関税込み持込|未定|決めていない|決まっていない|わからない|分からない|不明|相談|あとで/;
    if (typeof applyAnswer === "function") {
        const __aa92 = applyAnswer;
        applyAnswer = function (this: any, t: any, k: any, raw: any) {
            try {
                V92.jump = Date.now();
                if (k === "term" && t) {
                    const v = String(raw == null ? "" : raw).trim();
                    if (v && v.length <= 60 && !INCO.test(v) && !INCO_JA.test(v)) {
                        say(M("取引条件（建値）は、FOB・CIF・EXW などの条件で答えてください（例：FOB 横浜）。決まっていなければ「未定」で大丈夫です。",
                            "Please answer the trade terms with an Incoterm such as FOB, CIF or EXW (e.g. FOB Yokohama). If undecided, answer “undecided”.",
                            "交易条件请用 FOB、CIF、EXW 等贸易术语回答（例：FOB 横滨）。未定时请回答“未定”。",
                            "Indique las condiciones con un Incoterm como FOB, CIF o EXW (p. ej., FOB Yokohama). Si no está decidido, responda «por decidir»."));
                        return false;
                    }
                }
            }
            catch (e) { }
            return __aa92.apply(this, arguments as any);
        };
    }

    /* ───── ③ 社内規制DB：社員でないアカウントには、いま使える調べ方を案内する ───── */
    const isStaff = () => { try {
        if (typeof v75tcStaff === "function" && v75tcStaff())
            return true;
        return typeof SES !== "undefined" && !!SES && (SES.t === "admin" || SES.role === "stg");
    }
    catch (e) {
        return false;
    } };
    if (typeof openRegdb === "function") {
        const __or92 = openRegdb;
        W.v92perRegdbStaff = function () { try {
            closeDW();
        }
        catch (e) { } return __or92.apply(null, []); };
        openRegdb = function (this: any) {
            try {
                if (!isStaff() && typeof openDW === "function") {
                    openDW(`<div data-noi18n><h3>🌐 ${E(M("規制をくわしく調べるには", "How to research regulations in detail", "如何详细调查法规", "Cómo investigar las regulaciones en detalle"))}</h3>
   <p class="nn" style="margin-top:6px">${E(M("「STANDAGE 規制データベース」は、STANDAGE の社員が調査に使う社内のポータルです（standage.co.jp のアカウントが要るため、お客様のアカウントでは開けません）。お客様は、次の3つで調べられます。",
                        "The “STANDAGE regulation database” is an internal portal for STANDAGE staff (it requires a standage.co.jp account, so it cannot be opened from a customer account). You can research in these three ways.",
                        "“STANDAGE 法规数据库”是 STANDAGE 员工调查用的内部门户（需要 standage.co.jp 账户，客户账户无法打开）。您可以通过以下3种方式调查。",
                        "La «base de datos de regulaciones de STANDAGE» es un portal interno para el personal de STANDAGE (requiere una cuenta standage.co.jp). Puede investigar de estas tres formas."))}</p>
   <ol class="nn" style="margin:10px 0 0 1.2em;line-height:1.9">
     <li><b>${E(M("AI で最新の規制を調べる", "Research the latest regulations with AI", "用 AI 调查最新法规", "Investigar con IA"))}</b>：${E(M("この国・この商品について、AI が公的な出どころつきで調べます（結果は AI商社マンの知識に入ります）。", "AI researches this country and product with official sources (results go into your AI Trade Agent's knowledge).", "AI 会附官方出处调查该国家和商品（结果会进入 AI 商社专员的知识）。", "La IA investiga este país y producto con fuentes oficiales."))}</li>
     <li><b>${E(M("AI商社マンに相談する", "Ask the AI Trade Agent", "咨询 AI 商社专员", "Consultar al Agente IA"))}</b>：${E(M("「この国に出すとき、登録や証明書は何が要る？」のように聞けます。", "Ask, for example, “What registrations or certificates do I need to ship to this country?”", "可以这样问：“出口到这个国家需要哪些登记和证明？”", "Pregunte, por ejemplo: «¿Qué registros o certificados necesito para este país?»"))}</li>
     <li><b>${E(M("STANDAGE の担当に調査を頼む", "Ask your STANDAGE contact to research", "委托 STANDAGE 负责人调查", "Pedir la investigación a su contacto de STANDAGE"))}</b>：${E(M("ひな形の無い商材・国は、担当が調べてこの画面に反映します（「やりとり」から依頼できます）。", "For products or countries without a template, your contact researches and reflects the result on this screen (request it from “Messages”).", "对于没有模板的商品・国家，负责人会调查并反映到此画面（可从“往来”委托）。", "Para productos o países sin plantilla, su contacto investiga y lo refleja aquí (solicítelo desde «Mensajes»)."))}</li>
   </ol>
   <div class="rw" style="margin-top:12px;gap:8px;flex-wrap:wrap">
     <button class="btn" type="button" id="v92rgai">🤖 ${E(M("AI で最新の規制を調べる", "Research with AI", "用 AI 调查", "Investigar con IA"))}</button>
     <button class="btn g" type="button" id="v92rgask">💬 ${E(M("AI商社マンに相談する", "Ask the AI Trade Agent", "咨询 AI 商社专员", "Consultar al Agente IA"))}</button>
     <button class="btn g" type="button" id="v92rgmsg">✉ ${E(M("STANDAGE の担当に頼む（やりとり）", "Ask STANDAGE (Messages)", "委托 STANDAGE（往来）", "Pedir a STANDAGE (Mensajes)"))}</button>
     <button class="btn g" type="button" id="v92rgcls">${E(M("閉じる", "Close", "关闭", "Cerrar"))}</button></div>
   <p class="nn" style="margin-top:10px;color:var(--ink-3)">${E(M("STANDAGE の社員の方は、社員のアカウントでログインすると、このボタンから社内ポータルを開けます。", "STANDAGE staff can open the internal portal from this button when signed in with a staff account.", "STANDAGE 员工使用员工账户登录后，可从此按钮打开内部门户。", "El personal de STANDAGE puede abrir el portal interno con una cuenta de personal."))}</p></div>`);
                    try {
                        if (typeof dwChrome === "function")
                            dwChrome();
                    }
                    catch (e) { }
                    const on = (id: string, fn: () => void) => { const b = document.getElementById(id); if (b)
                        b.addEventListener("click", () => { try {
                            fn();
                        }
                        catch (e) { } }); };
                    on("v92rgai", () => { closeDW(); if (typeof regAI === "function")
                        regAI(); });
                    on("v92rgask", () => { closeDW(); go("ai"); });
                    on("v92rgmsg", () => { closeDW(); go("msg"); });
                    on("v92rgcls", () => closeDW());
                    return;
                }
            }
            catch (e) { }
            return __or92.apply(this, arguments as any);
        };
    }

    /* ───── ④ 輸出の禁止・規制措置の対象になりうる国・地域の注意（規制を調べる） ───── */
    const SANC: any = { "ロシア": 1, "ベラルーシ": 1, "北朝鮮": 2, "イラン": 3, "シリア": 3, "イラク": 3, "リビア": 3, "アフガニスタン": 3, "ミャンマー": 3, "スーダン": 3, "南スーダン": 3, "ソマリア": 3, "中央アフリカ": 3, "コンゴ民主共和国": 3, "レバノン": 3 };
    function sancNote() {
        try {
            const old = document.getElementById("v92sanc");
            const sel = document.getElementById("rC") as any;
            const c = String((sel && sel.value) || "").trim();
            const lv = (typeof cur !== "undefined" && cur === "ops" && typeof opsTab !== "undefined" && opsTab === "reg") ? SANC[c] : 0;
            if (!lv) {
                if (old)
                    old.remove();
                return;
            }
            if (old && old.getAttribute("data-c") === c)
                return;
            if (old)
                old.remove();
            const msg = lv === 2
                ? M(`⛔ ${c}向けの輸出は、日本の外為法の措置により、原則として禁止されています。出荷はできない前提で、必ず経済産業省の最新の案内を確かめてください。`, `⛔ Exports to ${c} are, in principle, prohibited under Japan's Foreign Exchange and Foreign Trade Act measures. Assume you cannot ship, and check the latest guidance from METI.`)
                : lv === 1
                    ? M(`⚠ ${c}向けは、日本の輸出禁止措置（外為法）の対象になる品目が多くあります。この画面の表は、その措置にあたるかを判定していません。出荷・見積の前に、経済産業省の最新の措置と該非判定を必ず確かめてください（要確認）。`, `⚠ Many items are subject to Japan's export bans to ${c} (Foreign Exchange and Foreign Trade Act). The table on this screen does not judge those measures. Check METI's latest measures and your export-control classification before quoting or shipping.`)
                    : M(`⚠ ${c}向けは、国連の武器禁輸などの対象国・地域にあたり、日本の輸出管理（外為法・キャッチオール規制）で確認が厳しくなる場合があります。この画面の表は判定していません。出荷の前に、経済産業省の最新の案内と該非判定を確かめてください（要確認）。`, `⚠ ${c} is subject to measures such as UN arms embargoes, and Japan's export controls (catch-all) may require stricter checks. The table on this screen does not judge this. Check METI's latest guidance and your export-control classification before shipping.`);
            const host = (sel && sel.closest && (sel.closest(".c") || sel.parentElement)) as any;
            if (!host)
                return;
            const d = document.createElement("div");
            d.id = "v92sanc";
            d.setAttribute("data-c", c);
            d.setAttribute("data-noi18n", "");
            d.setAttribute("role", "alert");
            d.style.cssText = "margin:10px 0;padding:12px 14px;border:1.5px solid var(--crit,#c0392b);border-radius:10px;background:var(--crit-soft,#fdecea);color:var(--ink,#1b2a3a);font-size:12.5px;line-height:1.8;font-weight:600";
            d.textContent = msg;
            host.insertAdjacentElement("afterend", d);
        }
        catch (e) { }
    }
    document.addEventListener("change", ev => { try {
        const t = ev.target as any;
        if (t && t.id === "rC")
            setTimeout(sancNote, 60);
    }
    catch (e) { } });

    /* ───── ⑤ 販売先国：表のチェックは3か国まで ───── */
    document.addEventListener("change", ev => { try {
        const t = ev.target as any;
        if (!t || !t.matches || !t.matches("input[data-ctypick]") || !t.checked)
            return;
        const all = Array.from(document.querySelectorAll("input[data-ctypick]")) as any[];
        const n = all.filter(x => x.checked).length;
        if (n > 3) {
            t.checked = false;
            say(M("販売先国は3か国まで選べます。先に、チェック済みの国のどれかを外してください。", "You can select up to 3 destination countries. Uncheck one first.", "销售目的国最多可选3个。请先取消已选的一个。", "Puede elegir hasta 3 países. Desmarque uno primero."));
            ev.stopImmediatePropagation();
        }
    }
    catch (e) { } }, true);

    /* ───── ⑥ 商品情報：取引の基本条件（どの業種にも共通）を ④ 業種ごとの項目 の先頭に ───── */
    try {
        if (typeof V68P_G !== "undefined" && V68P_G && !V68P_G.basic) {
            V68P_G.basic = { ja: "取引の基本条件", f: [
                    { k: "bTerm", ja: "取引条件（建値）", ref: "term", ex: "例：FOB 横浜" },
                    { k: "bPay", ja: "支払条件", ref: "pay", ex: "例：T/T 前払い30%・船積前70%" },
                    { k: "bPol", ja: "仕出港", ref: "pol", ex: "例：横浜港" },
                    { k: "bOrigin", ja: "産地・製造国", ref: "origin", ex: "例：日本（静岡県）" },
                    { k: "bCert", ja: "認証・規格", ref: "cert", ex: "例：ISO 9001／有機JAS／CE（無ければ「なし」）" },
                    { k: "bShelf", ja: "期限・保証（賞味期限／使用期限／保証期間）", ref: "shelf", ex: "例：製造から12か月／保証1年（無ければ「該当なし」）" }
                ] };
            V68P_G.basic.f.forEach((f: any) => { f.g = "basic"; });
            if (typeof V68P_GL !== "undefined" && V68P_GL)
                V68P_GL.basic = ["取引の基本条件", "Basic trade terms", "基本交易条件", "Condiciones comerciales básicas"];
            if (typeof V68P_FL !== "undefined" && V68P_FL)
                Object.assign(V68P_FL, {
                    bTerm: ["取引条件（建値）", "Trade terms (Incoterms)", "交易条件（贸易术语）", "Condiciones (Incoterms)"], bPay: ["支払条件", "Payment terms", "付款条件", "Condiciones de pago"],
                    bPol: ["仕出港", "Port of loading", "装运港", "Puerto de carga"], bOrigin: ["産地・製造国", "Origin / country of manufacture", "产地・制造国", "Origen / país de fabricación"],
                    bCert: ["認証・規格", "Certifications / standards", "认证・标准", "Certificaciones / normas"], bShelf: ["期限・保証（賞味期限／使用期限／保証期間）", "Shelf life / expiry / warranty", "保质期／使用期限／保修期", "Caducidad / vida útil / garantía"]
                });
        }
        if (typeof v68pGroups === "function" && typeof V68P_G !== "undefined" && V68P_G && V68P_G.basic) {
            const __pg92 = v68pGroups;
            v68pGroups = function (this: any, t: any) {
                const g = __pg92.apply(this, arguments as any);
                try {
                    if (Array.isArray(g) && g.indexOf("basic") < 0 && t && (t.src === "upload" || t.src === "sample2" || t.src === "sample"))
                        g.unshift("basic");
                }
                catch (e) { }
                return g;
            };
        }
    }
    catch (e) { }

    /* ───── ⑦ 販売先国の選定：登録の無い「開拓しない国」の欄は本題（候補国・分析）の下へ。データが無いだけの観点を「先行者不在」と言い切らない ───── */
    function ctyTidy() {
        if (typeof cur === "undefined" || cur !== "cty")
            return;
        const w = document.getElementById("well");
        if (!w)
            return;
        const ban = document.getElementById("v83ban");
        if (ban && ban.parentElement === w && !ban.getAttribute("data-v92moved")) {
            const tag = ban.querySelector(".v83ban-hd .p");
            if (tag && /登録なし/.test(tag.textContent || "")) {
                ban.setAttribute("data-v92moved", "1");
                w.appendChild(ban);
            }
        }
        const tw = document.createTreeWalker(w, NodeFilter.SHOW_TEXT);
        const L: any[] = [];
        while (tw.nextNode()) {
            const n: any = tw.currentNode;
            if (n.nodeValue && n.nodeValue.indexOf("先行者不在＝開拓型") >= 0)
                L.push(n);
        }
        L.forEach(n => { n.nodeValue = n.nodeValue.replace(/（先行者不在＝開拓型）/g, "（統計に相手国別の数字が無いだけの場合もあります・要確認）").replace(/先行者不在＝開拓型/g, "統計に数字が無いだけの場合もあります（要確認）"); });
    }

    /* ───── 描いたあとの仕上げ ───── */
    if (typeof render === "function") {
        const __rd92 = render;
        render = function (this: any) {
            const r = __rd92.apply(this, arguments as any);
            try {
                sancNote();
                ctyTidy();
            }
            catch (e) { }
            try {
                itemTidy();
                pendTidy();
            }
            catch (e) { }
            return r;
        };
    }

    /* ───── ⑧ 資料の読み取り：「商品の強み1〜3」の行と、価格の欄に書いた建値・仕出港（例：¥1,450／本（FOB 横浜・税抜））を拾う ───── */
    if (typeof v54upldKind === "function") {
        const __uk92 = v54upldKind;
        v54upldKind = function (this: any, lab: any) {
            const r = __uk92.apply(this, arguments as any);
            if (r)
                return r;
            try {
                const L0 = String(lab == null ? "" : lab).normalize("NFKC").replace(/[\s　]/g, "").replace(/[:：]+$/, "");
                if (/^(商品|製品|当社|自社|弊社)?の?(強み|特徴|特長|セールスポイント|アピールポイント)[0-9①-⑩]*$/.test(L0))
                    return "strengths";
            }
            catch (e) { }
            return r;
        };
    }
    function termFromDoc(t: any) {
        if (!t || t.src !== "upload" || t.v92termDoc)
            return;
        t.v92termDoc = 1;
        const has = (v: any) => !!String(v == null ? "" : v).trim();
        if (has(t.term) && has(t.pol))
            return;
        const cells: string[] = [];
        (Array.isArray(t.priceRows) ? t.priceRows : []).forEach((r: any) => (Array.isArray(r) ? r : []).forEach((c: any) => cells.push(String(c == null ? "" : c))));
        try {
            ((t._pend && t._pend.prods) || []).forEach((p: any) => ((p && p.x && p.x.priceRows) || []).forEach((r: any) => (Array.isArray(r) ? r : []).forEach((c: any) => cells.push(String(c == null ? "" : c)))));
        }
        catch (e) { }
        const txt = cells.join(" ／ ");
        const m = txt.match(/(?:^|[^A-Za-z])(EXW|FCA|FAS|FOB|CFR|CIF|CPT|CIP|DAP|DPU|DDP)\s*([一-龠ぁ-んァ-ヶ]{2,5}?)(?:港)?(?=[\s・、,，)）／\/]|$)/);
        if (!m)
            return;
        if (!has(t.term)) {
            t.term = m[1].toUpperCase();
            t.v92termWhy = "価格の欄の「" + m[0].replace(/^[^A-Za-z]/, "").trim() + "」から";
        }
        if (!has(t.pol) && m[2] && !/税|込|抜|別/.test(m[2]))
            t.pol = m[2] + "港";
    }
    W.v92perTermFromDoc = termFromDoc;
    if (typeof runParseReal === "function") {
        const __rp92p = runParseReal;
        runParseReal = function (this: any, t: any) {
            try {
                termFromDoc(t);
            }
            catch (e) { }
            return __rp92p.apply(this, arguments as any);
        };
    }

    /* ───── ⑨ 登録メニューを「閉じる」と、登録済みの商品があっても「新しい会社の商品を登録」の空の表示になる → 登録済みの商品の表示に戻す ───── */
    document.addEventListener("click", ev => { try {
        const t = ev.target as any;
        if (!t || !t.closest || !t.closest("#v1811skip"))
            return;
        setTimeout(() => { try {
            if (typeof V1811 === "undefined" || !V1811 || typeof TENS === "undefined" || !Array.isArray(TENS) || !TENS.length)
                return;
            if (typeof cur !== "undefined" && cur === "up" && V1811.focus && V1811.focus.k === "newco" && !V1811.mode && !document.getElementById("v1811ov")) {
                V1811.focus = null;
                if (typeof render === "function")
                    render();
            }
        }
        catch (e) { } }, 30);
    }
    catch (e) { } }, true);

    /* ───── ⑩ 商品情報：「調査済みの仕向国 N か国 関税率と必要書類を紐付け済み」と出るのに、下の表は「関税：要確認」 → 実際の状態に合う言い方に ───── */
    function itemTidy() {
        if (typeof cur === "undefined" || cur !== "item")
            return;
        const w = document.getElementById("well");
        if (!w)
            return;
        const kd = (Array.from(w.querySelectorAll(".kd")) as any[]).find(x => (x.textContent || "").trim() === "関税率と必要書類を紐付け済み");
        if (kd && /関税[：:]\s*要確認|関税率が要確認|関税率\s*要確認/.test(w.textContent || "")) {
            kd.textContent = M("関税・必要書類の基本を表示（「要確認」の国は、出荷の前に確かめます）", "Basic duties and documents shown (countries marked “to be confirmed” need checking before shipment)", "显示关税・必要单据的基本信息（标为“待确认”的国家需在出货前确认）", "Se muestran aranceles y documentos básicos (los países «por confirmar» deben verificarse antes del envío)");
            kd.setAttribute("data-noi18n", "");
        }
    }
    /* ───── ⑪ 読み取り直後の「未反映」：帯の「すべて登録する」と、下の AI ヒアリングの「反映して進める」は同じ働き、と書く ───── */
    function pendTidy() {
        const b = document.getElementById("v188pend");
        if (!b || b.getAttribute("data-v92"))
            return;
        b.setAttribute("data-v92", "1");
        const p = document.createElement("p");
        p.className = "v92pendn";
        p.setAttribute("data-noi18n", "");
        p.style.cssText = "margin:8px 0 0;font-size:12.5px;font-weight:700;line-height:1.7;color:var(--ink,#1b2a3a)";
        p.textContent = M("まだ商品情報には入れていません。「すべて登録する」で入ります（下の「反映して進める」も同じ働き。どちらか一方で大丈夫です）。",
            "Not applied yet. Press “Register all” to apply (“Apply and continue” below does the same; either one is enough).",
            "尚未写入商品信息。按“全部登记”即可写入（下方的“反映并继续”作用相同，任选其一即可）。",
            "Aún no se ha aplicado. Pulse «Registrar todo» («Aplicar y continuar» abajo hace lo mismo).");
        const btns = b.querySelector("#v188all");
        const row = btns ? btns.parentElement : null;
        if (row)
            row.insertAdjacentElement("beforebegin", p);
        else
            b.appendChild(p);
    }

    /* ───── ⑫ 押し間違い・入れ間違いの確かめ（今のボタンの手前で止める） ─────
       ・物流レートの手入力：運賃に「-5」や文字を入れても ¥5 などで登録され、すぐ自動回答に使われていた → 正の数でなければ登録しない
       ・物流レートの「削除」：確認なしで消えていた → 確かめてから
       ・規制を調べるの HS 候補「◯◯ にする」：1回押すと確認なしで HS が書き換わっていた → 確かめてから */
    const num = (v: any) => { let x = String(v == null ? "" : v); try {
        x = x.normalize("NFKC");
    }
    catch (e) { } x = x.replace(/[,，\s¥￥円]/g, ""); return /^\d+(\.\d+)?$/.test(x) ? +x : NaN; };
    document.addEventListener("click", ev => { try {
        const t = ev.target as any;
        if (!t || !t.closest)
            return;
        const stop = (m: string) => { ev.preventDefault(); ev.stopImmediatePropagation(); if (m)
            say(m); };
        if (t.closest("#frAdd")) {
            const g = (id: string) => { const el = document.getElementById(id) as any; return el ? String(el.value || "").trim() : ""; };
            if (!g("frPol") || !g("frPod"))
                return stop(M("仕出港と仕向港を入れてください（例：横浜港／香港）。", "Enter the port of loading and the destination port (e.g. Yokohama / Hong Kong)."));
            const p = num(g("frPrice"));
            if (!(p > 0))
                return stop(M("運賃は、0より大きい数字（円）で入れてください（例：9500）。マイナスや文字は登録できません。", "Enter the freight as a number greater than 0 (JPY), e.g. 9500. Negative values and text cannot be registered."));
            const d = g("frTt");
            if (d && !(num(d) > 0))
                return stop(M("日数は、1以上の数字で入れてください（例：7）。", "Enter transit days as a number of 1 or more (e.g. 7)."));
            // 全角の数字・カンマ・「円」は、半角の数字にそろえてから今の登録に渡す
            const put = (id: string, v: number) => { const el = document.getElementById(id) as any; if (el && String(el.value) !== String(v))
                el.value = String(v); };
            put("frPrice", p);
            if (d)
                put("frTt", num(d));
            return;
        }
        const del = t.closest("[data-frdel]");
        if (del) {
            const tr = del.closest("tr");
            const lane = tr ? String(tr.innerText || "").replace(/\s+/g, " ").replace(/削除\s*$/, "").trim().slice(0, 80) : "";
            if (!window.confirm(M("このレートを削除します。よろしいですか？\n" + lane + "\n（削除すると、この区間の自動回答に使われなくなります）", "Delete this rate?\n" + lane + "\n(It will no longer be used for automatic quotes on this lane.)")))
                return stop("");
            return;
        }
        const hs = t.closest("[data-v54hs]");
        if (hs) {
            const to = String(hs.getAttribute("data-v54hs") || "");
            const from = String((typeof TEN !== "undefined" && TEN && TEN.hs) || "");
            if (!window.confirm(M("HSコードを「" + from + "」から「" + to + "」に書き換えます。関税率と必要書類の判定が変わります。よろしいですか？\n（商品に合うかを確かめてから押してください。あとで商品情報から直せます）", "Change the HS code from “" + from + "” to “" + to + "”? Duty rates and required documents will be re-judged.\n(Check that it fits your product. You can change it later in Product information.)")))
                return stop("");
        }
    }
    catch (e) { } }, true);

    /* ───── ⑬ 商品情報「④ 業種ごとの項目」：医療・衛生／建設機械／農業資材／生活用品／文化・教育用品／ペット用品 の項目（どれも任意） ───── */
    try {
        if (typeof V68P_G !== "undefined" && V68P_G && !V68P_G.v92med) {
            const DEF: any = {
                v92med: ["医療・衛生用品の項目", "Medical / hygiene details", [
                        ["mdClass", "医療機器のクラス分類（日本／相手国）", "Device class (Japan / destination)", "例：日本 クラスII（管理医療機器）。相手国の区分は要確認"],
                        ["mdUse", "医療用／一般用の別", "Medical or general use", "例：医療用（JIS T 9001 クラスII）／一般用"],
                        ["mdSterile", "滅菌の有無・方法・有効期限", "Sterilization (method / validity)", "例：EOG滅菌・有効期限3年／非滅菌"],
                        ["mdReg", "届出・認証・登録の番号", "Notification / certification numbers", "例：一般医療機器 届出番号・ISO 13485 認証番号"]]],
                v92mach: ["建設機械・産業機械の項目", "Machinery details", [
                        ["mcHours", "稼働時間（アワーメーター）", "Operating hours (hour meter)", "例：4,800時間"],
                        ["mcSerial", "機番（シリアル番号）", "Serial number", "例：XX120-12345（書類には全桁）"],
                        ["mcWeight", "機械質量・輸送時の寸法", "Operating weight / transport dimensions", "例：12,400kg・9,520×2,800×2,950mm"],
                        ["mcEmission", "排出ガスの基準", "Emission standard", "例：2014年基準適合（相手国の基準は要確認）"],
                        ["mcCond", "整備・足回りの状態", "Maintenance / undercarriage condition", "例：点検・整備・洗浄済み、足回り70%"]]],
                v92agri: ["農業資材の項目", "Agricultural input details", [
                        ["agReg", "肥料・農薬の登録（国内／相手国）", "Fertilizer / pesticide registration (Japan / destination)", "例：国内は届出済み。相手国の肥料登録は輸入者と要確認"],
                        ["agSds", "SDS・危険物の区分", "SDS / dangerous goods class", "例：SDS 英語版あり・危険物に該当しない"],
                        ["agUse", "使い方・希釈倍率・対象の作物", "Usage / dilution / target crops", "例：1,000倍に薄めて葉面散布（イチゴ・トマト）"]]],
                v92living: ["生活用品の項目", "Household goods details", [
                        ["lvMaterial", "素材・組成（品質表示）", "Material / composition (labelling)", "例：綿100%／ステンレス SUS304"],
                        ["lvOem", "OEM・名入れの条件", "OEM / personalization terms", "例：名入れ刺繍は100枚から"],
                        ["lvTest", "試験成績・安全の規格", "Test reports / safety standards", "例：吸水性試験／食品衛生法の溶出試験"]]],
                v92culture: ["文化・教育用品の項目", "Culture / education goods details", [
                        ["cuMaterial", "素材（動物の毛・木・竹などの天然素材）", "Materials (natural: animal hair, wood, bamboo…)", "例：筆＝馬毛・羊毛／竹軸、墨＝煤・膠（検疫・ワシントン条約の確認に使う）"],
                        ["cuAge", "対象年齢・安全の規格（子ども向けのとき）", "Age range / safety standards (if for children)", "例：6歳以上・ST マーク／CE／ASTM は要確認"],
                        ["cuLang", "説明書・教材の言語", "Languages of manuals / materials", "例：英語・フランス語の手引きつき"]]],
                v92pet: ["ペット用品の項目", "Pet supplies details", [
                        ["ptTarget", "対象の動物・サイズ", "Target animal / size", "例：猫用・Mサイズ"],
                        ["ptMaterial", "材質（口に入る・舐めるものは成分）", "Materials (ingredients if chewed or licked)", "例：強化段ボール・でんぷん糊。またたびなど植物由来は国により確認"]]]
            };
            Object.keys(DEF).forEach(g => {
                V68P_G[g] = { ja: DEF[g][0], f: DEF[g][2].map((x: any) => ({ k: x[0], ja: x[1], ex: x[3], g })) };
                if (typeof V68P_GL !== "undefined" && V68P_GL)
                    V68P_GL[g] = [DEF[g][0], DEF[g][1], DEF[g][0], DEF[g][1]];
                if (typeof V68P_FL !== "undefined" && V68P_FL)
                    DEF[g][2].forEach((x: any) => { V68P_FL[x[0]] = [x[1], x[2], x[1], x[2]]; });
            });
        }
        if (typeof v68pGroups === "function" && typeof V68P_G !== "undefined" && V68P_G && V68P_G.v92med) {
            const __pg92b = v68pGroups;
            v68pGroups = function (this: any, t: any) {
                const g = __pg92b.apply(this, arguments as any);
                try {
                    if (Array.isArray(g) && t) {
                        const c = String(t.cat || "").trim();
                        const add = c === "医療・衛生用品" || c === "医療機器" ? "v92med" : c === "建設機械" ? "v92mach" : c === "農業資材" ? "v92agri" : c === "日用雑貨" ? "v92living" : c === "文化・教育用品" ? "v92culture" : c === "ペット用品" ? "v92pet" : "";
                        if (add && g.indexOf(add) < 0) {
                            const i = g.indexOf("basic");
                            g.splice(i >= 0 ? i + 1 : 0, 0, add);
                        }
                        // 建設機械には、部品向けの項目（公差・表面処理・図面番号）は出さない
                        if (c === "建設機械") {
                            const j = g.indexOf("industrial");
                            if (j >= 0)
                                g.splice(j, 1);
                        }
                    }
                }
                catch (e) { }
                return g;
            };
        }
    }
    catch (e) { }

    /* ───── お知らせ ───── */
    try {
        if (typeof S30_NEWS !== "undefined" && Array.isArray(S30_NEWS) && !S30_NEWS.some((x: any) => x && x[1] === "v21.92"))
            S30_NEWS.unshift(["2026-11", "v21.92", "8つの商材カテゴリーの見本と、使い勝手の直し",
                ["業種サンプルに「農業資材・健康食品・建設機械・文化・教育用品・ペット用品」を足しました。「サンプルで試す」は、食品／生活用品／工業・農業／健康・美容／医療・衛生／自動車・建機／文化・教育／その他 の8つの分類で選べます",
                    "商材カテゴリーの選択肢を8つの分類ごとにまとめ、資料のカテゴリーの欄・品名・HSコードから、より正しく読み取るようにしました（サプリメント＝健康食品、油圧ショベル＝建設機械 など）",
                    "AIヒアリングで答える欄が画面の外に出る・「社内規制DB」がお客様のアカウントで行き止まりになる・販売先国を4か国以上チェックできる、などを直しました。商品情報の「④ 業種ごとの項目」の先頭で、取引条件・支払条件・仕出港・産地・認証・期限を直せます"]]);
    }
    catch (e) { }
})();
