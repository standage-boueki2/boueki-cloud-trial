/* 21.92 r5c：5巡目の直し（右上の「次は」・商品情報を登録・多言語の残り・物流会社・そのほか）
   A  はじめの設定「規制を調べる」：画面を開いただけでは済みにしない。画面の中を見た（下へ送った・押した）ときに済みにする（culture-N17）
      ・前の層（core）は「開いた」ときに印を付ける。この層は、その印を「この層が入る前のもの」だけ引き継ぎ、あとは自分の印（window.v92r5c.regMark）で数える
   数字・規制の中身は足していない */
declare const TEN: any, TENS: any, D: any, SES: any, I18N: any, FWDON: any, NEED: any;
declare const SAMPLES2: any, PRODUCTS: any;
declare let i18nStr: any, uxPalItems: any, v84SmpOpen: any, bmOfflineAdvice: any, BM: any, v71obTpl: any, dmTemplateEN: any, v33CkText: any, closeDW: any, openDMThread: any, dk3Check: any;
declare let FILL: any, scoreOf: any, v54hearSkip: any, skipCurrent: any, fillRender: any, fillSay: any;
declare let ux32Setup: any, render: any, go: any, cur: any, toast: any, opsTab: any;
(function () {
    const W: any = window;
    if (W.__v2192r5c) return;
    W.__v2192r5c = 1;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const LG = () => { try { return (typeof I18N !== "undefined" && I18N && I18N.lang) || document.documentElement.lang || "ja"; } catch (e) { return "ja"; } };
    const L2 = () => String(LG()).slice(0, 2);
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = L2(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const ten = () => { try { return typeof TEN !== "undefined" ? TEN : null; } catch (e) { return null; } };
    const ses = () => { try { return typeof SES !== "undefined" ? SES : null; } catch (e) { return null; } };
    const isFwd = () => { try { return !!((typeof FWDON !== "undefined" && FWDON) || (ses() && ses().role === "fwd")); } catch (e) { return false; } };
    const isAdm = () => { try { return !!(ses() && ses().t === "admin"); } catch (e) { return false; } };
    const lsGet = (k: string) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
    const lsSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch (e) { } };
    const jget = (k: string) => { try { return JSON.parse(lsGet(k) || "{}") || {}; } catch (e) { return {}; } };
    const API: any = (W.v92r5c = W.v92r5c || {});
    API.M = M;

    /* ═════ A. 「規制を調べる」は、中を見たら済み ═════ */
    const T0K = "bc20_v92r5c_t0";
    let t0 = +(lsGet(T0K) || 0);
    if (!t0) { t0 = Date.now(); lsSet(T0K, String(t0)); }
    const code = () => String((ses() && ses().code) || "");
    const regId = (t: any) => String((t && (t.uid || t.item)) || "");
    const hasCty = (t: any) => !!(t && t.ctySel && Array.isArray(t.ctySel.chosen) && t.ctySel.chosen.length);
    function regSeen(t: any): boolean {
        try {
            if (!t) return false;
            const rk = t.regKB || {};
            if (Object.keys(rk).some((c) => rk[c] && (rk[c].appliedTxt || rk[c].txt))) return true;
            const id = regId(t);
            if (!id) return false;
            if (jget("bc20_v92r5c_reg_" + code())[id]) return true;
            const o = +(jget("bc20_v92core_reg_" + code())[id] || 0);
            return !!(o && o < t0); // この層が入る前に「開いて済み」になっていた分は、そのまま
        } catch (e) { return false; }
    }
    // 画面の中を見たときに呼ぶ。新しく印を付けたら true
    API.regMark = function (): boolean {
        try {
            const t = ten();
            if (!t || !code() || isFwd() || isAdm() || !hasCty(t)) return false;
            if (typeof cur === "undefined" || cur !== "ops" || typeof opsTab === "undefined" || opsTab !== "reg") return false;
            const id = regId(t);
            if (!id) return false;
            const F = jget("bc20_v92r5c_reg_" + code());
            if (F[id]) return false;
            const was = regSeen(t);
            F[id] = Date.now();
            lsSet("bc20_v92r5c_reg_" + code(), JSON.stringify(F));
            return !was;
        } catch (e) { return false; }
    };
    API.regSeen = () => regSeen(ten());
    if (typeof ux32Setup === "function") {
        const __us5 = ux32Setup;
        ux32Setup = function (this: any) {
            const S = __us5.apply(this, arguments as any);
            try {
                if (Array.isArray(S)) {
                    const r = S.find((x: any) => x && x[0] === "reg");
                    if (r && r[4] && !regSeen(ten())) {
                        r[4] = false;
                        r[5] = M("「規制を調べる」の画面で、販売先の国の決まりごとをまだ確かめていません（画面の中の表まで見ると済みになります）", "You have not reviewed the regulations for your target countries yet (scroll to the table on the Regulations screen)", "尚未在“查法规”页面确认销售国的规定（看到页面中的表格即算完成）", "Aún no ha revisado las regulaciones de los países de venta (vea la tabla en la pantalla de regulaciones)");
                    }
                }
            } catch (e) { }
            return S;
        };
    }

    /* ═════ B. 任意の項目を「わからない」で終えたら、「商品を登録」は済み（culture-Q02） ═════
       ・必須（重み5）の項目が全部あり、残りが「わからない（無理に埋めなくて大丈夫）」で終えた任意の項目だけのとき
       ・トライアルでは「STANDAGEの担当が伺って埋めます」と言わない（依頼は出ていないため） */
    const SKK = () => "bc20_v92r5c_skip_" + code();
    const skipped = (t: any): string[] => { const a = jget(SKK())[regId(t)]; return Array.isArray(a) ? a : []; };
    const needW = (k: string) => { try { const n = NEED.find((x: any) => x.k === k); return n ? n.w : 9; } catch (e) { return 9; } };
    function fillBySkip(t: any): boolean {
        try {
            if (!t || typeof scoreOf !== "function") return false;
            const ms = scoreOf(t).missing || [];
            if (!ms.length) return false;
            const sk = skipped(t);
            return ms.every((m: any) => m.w < 5 && sk.indexOf(m.k) >= 0);
        } catch (e) { return false; }
    }
    API.fillBySkip = () => fillBySkip(ten());
    const lastAi = () => { try { const L = FILL.log; for (let i = L.length - 1; i >= 0; i--) if (L[i].who === "ai") return L[i]; } catch (e) { } return null; };
    const wrapSkip = (inner: any) => function (this: any) {
        let k = "", n0 = 0;
        try { k = (FILL && FILL.cur && !FILL.cur.x && FILL.cur.k) || ""; n0 = FILL.log.length; } catch (e) { }
        const r = inner.apply(this, arguments as any);
        try {
            const t = ten();
            if (k && t && needW(k) < 5) {
                const said = FILL.log.slice(n0).some((m: any) => m.who === "ai" && /無理に埋めなくて大丈夫/.test(String(m.html)));
                if (said) {
                    const F = jget(SKK()), id = regId(t);
                    const a: string[] = Array.isArray(F[id]) ? F[id] : [];
                    if (a.indexOf(k) < 0) { a.push(k); F[id] = a; lsSet(SKK(), JSON.stringify(F)); try { if (typeof render === "function" && !FILL.cur) render(); } catch (e) { } }
                }
            }
        } catch (e) { }
        return r;
    };
    try { if (typeof v54hearSkip === "function") v54hearSkip = wrapSkip(v54hearSkip); } catch (e) { }
    try { if (typeof skipCurrent === "function") skipCurrent = wrapSkip(skipCurrent); } catch (e) { }
    if (typeof ux32Setup === "function") {
        const __us5b = ux32Setup;
        ux32Setup = function (this: any) {
            const S = __us5b.apply(this, arguments as any);
            try {
                if (Array.isArray(S)) {
                    const f = S.find((x: any) => x && x[0] === "fill");
                    if (f && !f[4] && fillBySkip(ten())) { f[4] = true; f[5] = ""; f[6] = ""; }
                }
            } catch (e) { }
            return S;
        };
    }
    // 刷新版の「次は 足りない情報に答える（残り N項目）」も、同じ数え方に
    try {
        if (W.v92r4c && typeof W.v92r4c.state === "function") {
            const st0 = W.v92r4c.state;
            W.v92r4c.state = function (this: any) {
                const s = st0.apply(this, arguments as any);
                try { if (s && s.miss > 0 && fillBySkip(ten())) return Object.assign({}, s, { miss: 0, names: [] }); } catch (e) { }
                return s;
            };
        }
    } catch (e) { }

    /* ═════ C. 会話の文：取り込んだ項目の数を1つに（indagri-Q05）／トライアルの言い方（culture-Q02） ═════
       ・取り込みの直後の文「商品情報に入れました（N項目）…いまの情報は N/21」→ 後ろは登録の項目の数え方（21件のうち、足りない数を引いた数）にする
       ・開き直したときの文「…N項目を取り込みました」→ 取り込んだ時点の数（この端末に控える）に固定し、いまの数は「登録の項目は F/21」と分けて言う */
    const GK = () => "bc20_v92r5c_got_" + code();
    const isTrial = () => { try { return !!(ses() && ses().t === "trial"); } catch (e) { return false; } };
    function fixLog() {
        const t = ten();
        if (!t || typeof FILL === "undefined" || !FILL || !Array.isArray(FILL.log)) return;
        const id = regId(t), N = (typeof NEED !== "undefined" && NEED.length) || 21;
        FILL.log.forEach((m: any) => {
            if (!m || m.who !== "ai" || typeof m.html !== "string" || m.r5c) return;
            let h: string = m.html;
            // 取り込みの直後
            const a = h.match(/商品情報に入れました（<b>(\d+)項目<\/b>）|added it to the product information \(<b>(\d+) fields<\/b>\)/);
            if (a) {
                const n = +(a[1] || a[2]);
                const G = jget(GK());
                if (id && (!G[id] || G[id].file !== (t.file || ""))) { G[id] = { n, file: t.file || "", at: Date.now() }; lsSet(GK(), JSON.stringify(G)); }
                const mm = h.match(/読み取れなかった<b>(\d+)項目<\/b>|about the <b>(\d+) item\(s\)<\/b>/);
                const f0 = mm ? N - +(mm[1] || mm[2]) : -1;
                if (f0 >= 0) {
                    h = h.replace(/いまの情報は <b>\d+\/\d+<\/b> です。/, `登録の項目（全体 ${N}件）は <b>${f0}/${N}</b> そろっています。`)
                        .replace(/The information is now <b>\d+\/\d+<\/b>\./, `Registration items filled: <b>${f0}/${N}</b>.`);
                }
                m.r5c = 1;
            }
            // 開き直したとき
            const b = h.match(/個の表を検出し、(?:<b>)?(\d+)項目(?:<\/b>)?を取り込みました。/);
            if (b && id) {
                const g = jget(GK())[id];
                let f = -1;
                try { f = scoreOf(t).filled.length; } catch (e) { }
                if (g && g.file === (t.file || "") && g.n > 0) {
                    const now = +b[1];
                    const tail = f >= 0 ? `<span data-noi18n>${E(M(`（登録の項目〔全体 ${N}件〕は、いま ${f}/${N} そろっています）`, ` (registration items filled now: ${f}/${N})`, `（登记项目〔共 ${N} 项〕目前已填 ${f}/${N}）`, ` (campos de registro completos ahora: ${f}/${N})`))}</span>` : "";
                    h = h.replace(/(個の表を検出し、(?:<b>)?)\d+(項目(?:<\/b>)?を取り込みました。)/, "$1" + g.n + "$2" + tail);
                    if (now !== g.n) h = h.replace(/取り込んだ項目：/, "いま入っている項目：");
                }
                m.r5c = 1;
            }
            if (isTrial()) {
                h = h.replace(/STANDAGEの担当からあらためて確認します。/g, "あとで「商品情報」の画面から、いつでも入れられます。")
                    .replace(/残りはSTANDAGEの担当が伺って埋めます。/g, "残りは、あとで「商品情報」の画面から入れられます。");
            }
            if (h !== m.html) m.html = h;
        });
    }
    if (typeof fillRender === "function") {
        const __fr5 = fillRender;
        fillRender = function (this: any) {
            try { fixLog(); } catch (e) { }
            return __fr5.apply(this, arguments as any);
        };
    }

    /* ═════ D. 多言語（英・中・西）の残り（xcut-Q01・Q02・M03・xi18n-66） ═════
       前の多言語の層と同じ仕組み（I18N.dict に足す・I18N.pat に文の形を足す）。数字・会社名・日付はそのまま。日本語の画面には何もしない */
    try {
        if (typeof I18N !== "undefined" && I18N && I18N.dict) {
            const DI: any = I18N.dict;
            ["en", "zh", "es"].forEach((l) => { if (!DI[l]) DI[l] = {}; });
            const TR = (ja: string, en: string, zh: string, es: string) => { if (DI.en[ja] == null) DI.en[ja] = en; if (DI.zh[ja] == null) DI.zh[ja] = zh; if (DI.es[ja] == null) DI.es[ja] = es; };
            const L3 = (en: string, zh: string, es: string) => I18N.lang === "zh" ? zh : I18N.lang === "es" ? es : en;
            const tr = (x: any, d?: any) => { try { const r = i18nStr(String(x), d || DI[I18N.lang] || {}); return r == null ? String(x) : r; } catch (e) { return String(x); } };
            const PF = (re: RegExp, f: (m: any, d: any) => any) => { if (Array.isArray(I18N.pat)) I18N.pat.unshift({ re, en: f, zh: f, es: f }); };
            // 今日やること（登録直後の3つの提案）・停滞中の案件
            TR("止まっている相手はいません", "No stalled buyers", "没有停滞的对象", "No hay compradores estancados");
            TR("バイヤーへの接触を開始", "Start contacting buyers", "开始联系买家", "Empezar a contactar con compradores");
            TR("規制調査が終わった国から始めます。", "Start with the countries whose regulation check is done.", "从已完成法规调查的国家开始。", "Empiece por los países cuya revisión de regulaciones ya terminó.");
            TR("商談記録を貯める", "Build up deal records", "积累商谈记录", "Acumular registros de negociación");
            TR("42件ほど貯まると、国別・価格帯別の分析ができます。", "With about 42 records, analysis by country and price band becomes available.", "积累约42条后，可按国家・价格带进行分析。", "Con unos 42 registros se puede analizar por país y por franja de precio.");
            TR("初回の見積を出す", "Send the first quote", "发出首次报价", "Enviar la primera cotización");
            TR("AIが下書きを作ります。", "AI drafts it for you.", "由 AI 起草。", "La IA prepara el borrador.");
            // タスク・進行
            PF(/^期限切れ・7日以内の数は、分析・レポートと同じ数え方です(?:（見本の会社は、見本の日付 (\S+) を「今日」として数えています）)?(。?)$/, (m) => L3(
                "Overdue and within-7-days counts use the same rules as Analytics & reports" + (m[1] ? " (for the sample company, the sample date " + m[1] + " is treated as “today”)" : "") + ".",
                "已逾期・7天内的数量与“分析・报告”采用相同的统计方式" + (m[1] ? "（样例公司以样例日期 " + m[1] + " 作为“今天”统计）" : "") + "。",
                "Los vencidos y los de 7 días se cuentan igual que en Análisis e informes" + (m[1] ? " (para la empresa de muestra, la fecha de muestra " + m[1] + " se toma como «hoy»)" : "") + "."));
            PF(/^「規制を調べる」で自社で確かめる（STANDAGE への調査の依頼もそこから）(・制裁の対象国（輸出禁止の確認が先）)?$/, (m) => L3(
                "Check it yourself on “Check regulations” (you can also request research from STANDAGE there)" + (m[1] ? " · sanctioned country (check export bans first)" : ""),
                "在“查法规”中自行确认（也可在那里委托 STANDAGE 调查）" + (m[1] ? "・制裁对象国（先确认出口禁令）" : ""),
                "Compruébelo usted en «Ver regulaciones» (desde ahí también puede pedir la investigación a STANDAGE)" + (m[1] ? " · país sancionado (primero confirme la prohibición de exportación)" : "")));
            // 受信箱
            TR("が商談中〜契約交渉", " in talks to contract negotiation", " 处于商谈中～合同谈判", " entre conversaciones y negociación de contrato");
            // スペイン語：荷主の画面（受信箱・案件・バイヤー）の「N社」は、物流会社（transitarios）ではなく相手の会社
            PF(/^(\d+)社$/, (m) => {
                if (I18N.lang !== "es") return null;
                let k = "";
                try { k = (W.RDX && W.RDX.curKey) ? W.RDX.curKey() : String(cur); } catch (e) { }
                if (isFwd() || !/^(inbox|today|dash:home|dash:case|db|deal|dash)$/.test(k)) return null;
                return m[1] + (m[1] === "1" ? " empresa" : " empresas");
            });
            // 右下の AI の窓
            TR("のデータを読み込み済みです。画面を見ながら、そのまま聞いてください。", " data is loaded. Ask me anything while you look at the screen.", "的数据已读取。请一边看画面，一边直接提问。", ": datos cargados. Pregunte lo que quiera mientras mira la pantalla.");
            TR("いま見ている画面のことも、何でも質問できます（Enterで送信・Shift+Enterで改行）", "Ask anything, including about the screen you are viewing (Enter to send, Shift+Enter for a new line)", "可以提任何问题，包括当前画面的内容（Enter 发送・Shift+Enter 换行）", "Pregunte lo que quiera, también sobre esta pantalla (Enter envía, Shift+Enter salto de línea)");
            // 契約書関連・AI商社マンに相談（登録直後）
            TR("まだ直接メッセージでやり取り中の相手も、商談を記録した相手もいません。", "There are no buyers you are messaging directly or have recorded deals with yet.", "还没有正在直接消息往来的对象，也没有已记录商谈的对象。", "Aún no hay compradores con mensajes directos ni con negociaciones registradas.");
            PF(/^STANDAGE の記録 (\d+)案件（さまざまな業種を含む区分「その他」。「(.+)」だけの記録はまだありません）から、道筋の目安を出します$/, (m, d) => { const c = tr(m[2], d); return L3(
                "Estimates the roadmap from " + m[1] + " STANDAGE cases (the mixed-industry group “Other”; there are no records for “" + c + "” alone yet)",
                "根据 STANDAGE 的 " + m[1] + " 个案件记录（包含多种行业的分类“其他”。尚无仅“" + c + "”的记录）给出路线的参考",
                "Estima la ruta a partir de " + m[1] + " casos de STANDAGE (grupo mixto «Otros»; aún no hay registros solo de «" + c + "»)"); });
            // 何でも検索の操作
            TR("通関統計エクスプローラーを開く", "Open the customs statistics explorer", "打开通关统计浏览器", "Abrir el explorador de estadísticas aduaneras");
            TR("推奨FOB Japan Price を算出", "Calculate the recommended FOB Japan price", "计算推荐的 FOB Japan 价格", "Calcular el precio FOB Japan recomendado");
            TR("物流会社にAI見積を依頼（相見積）", "Request AI quotes from forwarders (comparison)", "向物流公司请求 AI 报价（比价）", "Pedir cotizaciones con IA a transitarios (comparativa)");
            TR("商品情報のアップロード", "Upload product information", "上传商品信息", "Subir información del producto");
            // ログイン画面
            const LGN: string[][] = [
                ["貿易業務を、もっと", "Make trade operations", "让贸易业务", "Haga el comercio exterior"],
                ["かんたん・スマートに。", "simpler and smarter.", "更简单、更智能。", "más fácil e inteligente."],
                ["AI商社マンは、", "AI Trade Agent is", "AI商社人是", "AI Trade Agent es"],
                ["海外展開の調査・交渉・", "a cloud service that uses AI to support", "一项用 AI 支持", "un servicio en la nube que apoya con IA"],
                ["規制確認などを", "overseas market research, negotiation", "海外拓展的调查、谈判、", "la investigación, la negociación"],
                ["AI でサポートする、", "and regulation checks", "法规确认等的", "y la revisión de regulaciones"],
                ["貿易業務の", "for your", "贸易业务", "de su"],
                ["クラウドサービスです。", "trade operations.", "云服务。", "comercio exterior."],
                ["ご利用までの", "Getting started in", "开始使用的", "Empiece en"],
                ["3ステップ", "3 steps", "3个步骤", "3 pasos"],
                ["ログイン方法を選ぶ", "Choose how to sign in", "选择登录方式", "Elija cómo iniciar sesión"],
                ["メール・パスワード か コード", "Email & password, or a code", "邮箱・密码 或 访问码", "Correo y contraseña, o un código"],
                ["必要な情報を入力", "Enter your details", "输入所需信息", "Introduzca sus datos"],
                ["メール・パスワード または アクセスコード", "Email & password, or access code", "邮箱・密码 或 访问码", "Correo y contraseña, o código de acceso"],
                ["利用を開始", "Start using it", "开始使用", "Empiece a usarlo"],
                ["すぐにご利用いただけます", "Ready to use right away", "马上即可使用", "Listo para usar de inmediato"],
                ["安心・安全について（データの暗号化と、AI・物流会社に送る範囲）", "Security & privacy (data encryption and what is sent to AI and forwarders)", "关于安全（数据加密，以及发送给 AI・物流公司的范围）", "Seguridad y privacidad (cifrado de datos y qué se envía a la IA y a los transitarios)"],
                ["会員の方", "Members", "会员", "Miembros"],
                ["（お客様ログイン）", "(customer sign-in)", "（客户登录）", "(acceso de clientes)"],
                ["アカウントをお持ちの方", "If you have an account", "已有账号的用户", "Si ya tiene cuenta"],
                ["アクセスコードでログイン", "Sign in with an access code", "用访问码登录", "Entrar con código de acceso"],
                ["（体験用・デモ用のコード）", "(trial / demo codes)", "（体验・演示用访问码）", "(códigos de prueba / demo)"],
                ["体験用・デモ用のコードをお持ちの方", "If you have a trial / demo code", "持有体验・演示用访问码的用户", "Si tiene un código de prueba / demo"],
                ["くわしい版（はじめてガイド・別のタブ）", "Detailed version (getting-started guide, new tab)", "详细版（入门指南・新标签页）", "Versión detallada (guía de inicio, pestaña nueva)"],
                ["アカウントの発行・再有効化は、STANDAGE の担当までご連絡ください。", "To have an account issued or reactivated, please contact your STANDAGE representative.", "账号的发放・重新启用，请联系 STANDAGE 负责人。", "Para emitir o reactivar una cuenta, contacte con su responsable de STANDAGE."],
                ["ご担当者名（任意。招待された方は、招待状の氏名）", "Your name (optional; if invited, the name on the invitation)", "负责人姓名（选填。受邀者请填邀请函上的姓名）", "Su nombre (opcional; si fue invitado, el de la invitación)"]
            ];
            // 「このアカウントは無効化されています。」は辞書に入れない（entry の層が、元の日本語の文を見て案内の2行目を足すため）。写しの1行目は下の E で直す
            LGN.forEach((r) => TR(r[0], r[1], r[2], r[3]));
            // 物流会社「集計」の推奨の理由（「／」でつないだ文を、1つずつ訳す。会社名はそのまま）
            const co = (x: string, d: any) => tr(x, d);
            const seg = (s: string, d: any): string | null => {
                let m: any;
                if ((m = s.match(/^(\d+)社中 最安（合計 (¥[\d,]+)。次点 (.+) より (¥[\d,]+) 安い）$/)))
                    return L3(`cheapest of ${m[1]} (total ${m[2]}; ${m[4]} cheaper than the runner-up, ${co(m[3], d)})`, `${m[1]}家中最便宜（合计 ${m[2]}。比第二名 ${co(m[3], d)} 便宜 ${m[4]}）`, `el más barato de ${m[1]} (total ${m[2]}; ${m[4]} menos que el siguiente, ${co(m[3], d)})`);
                if ((m = s.match(/^最安ではない（最安 (.+) (¥[\d,]+) との差 (¥[\d,]+)）が、(最安案は希望納期に間に合わない|最安案は要望と違う輸送形態|所要日数・有効期限を含めた総合点で上回る)$/))) {
                    const i = ["最安案は希望納期に間に合わない", "最安案は要望と違う輸送形態", "所要日数・有効期限を含めた総合点で上回る"].indexOf(m[4]);
                    const why = L3(["the cheapest option misses the requested date", "the cheapest option uses a different transport mode", "it scores higher overall, including transit time and validity"][i],
                        ["最便宜的方案赶不上希望交期", "最便宜的方案运输方式与要求不同", "综合时效和有效期的总分更高"][i],
                        ["la opción más barata no llega a la fecha solicitada", "la opción más barata usa otro modo de transporte", "obtiene mejor puntuación global, incluidos el tránsito y la vigencia"][i]);
                    return L3(`not the cheapest (cheapest: ${co(m[1], d)} ${m[2]}, difference ${m[3]}), but ${why}`, `不是最便宜（最便宜：${co(m[1], d)} ${m[2]}，差额 ${m[3]}），但${why}`, `no es el más barato (el más barato: ${co(m[1], d)} ${m[2]}, diferencia ${m[3]}), pero ${why}`);
                }
                if ((m = s.match(/^(回答は1社のみ（相見積なし）。)?所要 約(\d+)日(?:＋情勢見込み(\d+)日)?(?:(（最速）)|（最速の (.+) より \+(\d+)日）)?$/))) {
                    const head = m[1] ? L3("only 1 forwarder answered (no comparison). Transit", "只有1家回复（无比价）。时效", "solo respondió 1 transitario (sin comparativa). Tránsito") : L3("transit", "时效", "tránsito");
                    return head + L3(` approx. ${m[2]} days`, `约${m[2]}天`, ` aprox. ${m[2]} días`)
                        + (m[3] ? L3(` + situation ${m[3]} days`, `＋形势预估${m[3]}天`, ` + situación ${m[3]} días`) : "")
                        + (m[4] ? L3(" (fastest)", "（最快）", " (el más rápido)") : m[5] ? L3(` (+${m[6]} days vs the fastest, ${co(m[5], d)})`, `（比最快的 ${co(m[5], d)} 多${m[6]}天）`, ` (+${m[6]} días frente al más rápido, ${co(m[5], d)})`) : "");
                }
                if ((m = s.match(/^有効期限 (\d{4}-\d\d-\d\d)（あと(\d+)日）$/)))
                    return L3(`valid until ${m[1]} (${m[2]} days left)`, `有效期 ${m[1]}（还剩${m[2]}天）`, `válido hasta ${m[1]} (quedan ${m[2]} días)`);
                if ((m = s.match(/^⚠ 有効期限 (\S+) が間近（あと(\d+)日）。早めの仮押さえを$/)))
                    return L3(`⚠ validity ${m[1]} is close (${m[2]} days left) — hold space early`, `⚠ 有效期 ${m[1]} 即将到期（还剩${m[2]}天）。请尽早预留舱位`, `⚠ la vigencia ${m[1]} está próxima (quedan ${m[2]} días); reserve pronto`);
                if ((m = s.match(/^希望納期 (\S+) に間に合う見込み（通関・カット余裕3日込みで (-?\d+)日の余裕）$/)))
                    return L3(`expected to meet the requested date ${m[1]} (${m[2]} days of slack, incl. 3 days for customs / cut-off)`, `预计赶得上希望交期 ${m[1]}（含通关・截关余量3天，尚有${m[2]}天余量）`, `se prevé cumplir la fecha solicitada ${m[1]} (margen de ${m[2]} días, incl. 3 de aduana / corte)`);
                if ((m = s.match(/^⚠ 希望納期 (\S+) に (\d+)日 不足（航空便・直行便の再見積を推奨）$/)))
                    return L3(`⚠ ${m[2]} days short of the requested date ${m[1]} (re-quoting by air or direct service is recommended)`, `⚠ 距希望交期 ${m[1]} 差 ${m[2]} 天（建议重新询价空运・直航）`, `⚠ faltan ${m[2]} días para la fecha solicitada ${m[1]} (se recomienda recotizar aéreo o directo)`);
                if ((m = s.match(/^要望の (.+) は未登録のため (.+) で提示$/)))
                    return L3(`the requested ${m[1]} is not registered, so it is quoted as ${m[2]}`, `要求的 ${m[1]} 未登记，因此以 ${m[2]} 报价`, `el ${m[1]} solicitado no está registrado; se cotiza como ${m[2]}`);
                return null;
            };
            const cap = (s: string) => s.replace(/^(⚠ )?([a-zñ])/, (x, a, b) => (a || "") + b.toUpperCase());
            PF(/^(?:\d+社中 最安（|最安ではない（最安 |回答は1社のみ（相見積なし）。所要 |所要 約\d+日).*$/, (m, d) => {
                const parts = String(m[0]).split("／");
                const out: string[] = [];
                for (const p of parts) { const t = seg(p, d); if (t == null) return null; out.push(t); }
                return cap(out.join(I18N.lang === "zh" ? "／" : " / "));
            });
            PF(/^1位（(.+)）との差は主に(日数|金額)です。$/, (m, d) => L3(
                `The gap to No. 1 (${co(m[1], d)}) is mainly ${m[2] === "日数" ? "transit days" : "price"}.`,
                `与第1名（${co(m[1], d)}）的差距主要在${m[2] === "日数" ? "天数" : "金额"}。`,
                `La diferencia con el n.º 1 (${co(m[1], d)}) es sobre todo de ${m[2] === "日数" ? "días" : "precio"}.`));
            // 「宛先：」が、訳した文の頭に残る（xcut-M03）
            if (typeof i18nStr === "function") {
                const s5 = i18nStr;
                i18nStr = function (this: any, s: any, d: any) {
                    let r = s5.apply(this, arguments as any);
                    try {
                        if (I18N.lang !== "ja") {
                            if (typeof r === "string" && r.indexOf("宛先：") >= 0) r = r.replace(/宛先：/g, L3("To: ", "收件方：", "Para: "));
                            else if (r == null && /^\s*宛先：/.test(String(s)) && d && d === DI[I18N.lang]) r = String(s).replace(/宛先：/, L3("To: ", "收件方：", "Para: "));
                        }
                    } catch (e) { }
                    return r;
                };
            }
            // 何でも検索：用語の説明（途中で切った文）は辞書に無いので、元の文の訳を引いて同じ長さに切る（xcut-Q02）
            if (typeof uxPalItems === "function") {
                const p5 = uxPalItems;
                const memo: any = {};
                const JP = /[ぁ-ゖァ-ヺ]/;
                uxPalItems = function (this: any, q: any) {
                    const items = p5.apply(this, arguments as any);
                    try {
                        const l = I18N.lang;
                        if (l !== "ja" && Array.isArray(items) && DI[l]) {
                            items.forEach((it: any) => {
                                if (!it || typeof it.sub !== "string" || !/…$/.test(it.sub) || !JP.test(it.sub)) return;
                                const head = it.sub.replace(/…$/, "");
                                const key = l + "|" + head;
                                if (!(key in memo)) {
                                    memo[key] = null;
                                    if (head.length >= 12) for (const k in DI[l]) { if (k.length > head.length && k.lastIndexOf(head, 0) === 0 && typeof DI[l][k] === "string") { memo[key] = DI[l][k]; break; } }
                                }
                                const t = memo[key];
                                if (t) { const n = l === "zh" ? 60 : 110; it.sub = t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t; }
                            });
                        }
                    } catch (e) { }
                    return items;
                };
            }
        }
    } catch (e) { try { console.warn("v2192r5c i18n", e); } catch (x) { } }

    /* ═════ E. 言語を変えたあとも、ログイン画面の窓口の説明・無効／期限切れの1行目・見本の窓を、その言語に（xcut-Q01 (6)・xi18n-66） ═════ */
    const LGFIX: string[][] = [
        ["このアカウントは無効化されています。", "This account has been disabled.", "此账号已被停用。", "Esta cuenta ha sido desactivada."],
        ["このアカウントは有効期限が切れています。", "This account has expired.", "此账号已过期。", "Esta cuenta ha caducado."],
        ["※ くわしい版の絵と道順は、刷新前の配置です", "* The pictures and paths in the detailed guide show the layout before the redesign", "※ 详细版中的图片和路径为改版前的布局", "* Las imágenes y rutas de la guía detallada muestran el diseño anterior"]
    ];
    const PH_SHORT: string[][] = [["lg-code", "アクセスコード（例：BC-XXXX-XXXX-XXXX）", "コード（例：BC-XXXX-XXXX-XXXX）"], ["lg-name", "ご担当者名（任意。招待された方は、招待状の氏名）", "ご担当者名（任意・招待状の氏名）"]];
    try {
        if (typeof I18N !== "undefined" && I18N && I18N.dict) {
            const DI: any = I18N.dict;
            const put = (ja: string, en: string, zh: string, es: string) => { if (DI.en && DI.en[ja] == null) DI.en[ja] = en; if (DI.zh && DI.zh[ja] == null) DI.zh[ja] = zh; if (DI.es && DI.es[ja] == null) DI.es[ja] = es; };
            put("コード（例：BC-XXXX-XXXX-XXXX）", "Code (e.g. BC-XXXX-XXXX-XXXX)", "访问码（例：BC-XXXX-XXXX-XXXX）", "Código (ej. BC-XXXX-XXXX-XXXX)");
            put("ご担当者名（任意・招待状の氏名）", "Your name (optional)", "负责人姓名（选填）", "Su nombre (opcional)");
        }
    } catch (e) { }
    const LIDX = () => { const l = L2(); return l === "en" ? 1 : l === "zh" ? 2 : l === "es" ? 3 : 0; };
    function lgFix() {
        try {
            if (!document.body.classList.contains("locked")) return;
            const l = L2(), ix = LIDX();
            // 窓口の説明（entry の層が、作ったときの言語で1回だけ作る）→ 言語が変わったら作り直してもらう
            const d = document.getElementById("v92e-lghelp") as any;
            if (d) {
                if (!d.getAttribute("data-r5cl")) d.setAttribute("data-r5cl", d.getAttribute("data-r5cl0") || l);
                else if (d.getAttribute("data-r5cl") !== l) { W.__r5cLgOpen = !!d.open; d.remove(); }
                else if (W.__r5cLgOpen != null) { if (W.__r5cLgOpen) d.open = true; W.__r5cLgOpen = null; }
            }
            // スマホの幅（480px 以下）：入力例が欄の途中で切れる → 短い言い方に（xcut-Q04。日本語の画面だけ。ほかの言語は字を小さくする＝CSS）
            if (window.innerWidth <= 480) {
                const DL: any = (l !== "ja" && typeof I18N !== "undefined" && I18N && I18N.dict && I18N.dict[l]) || null;
                PH_SHORT.forEach(([id, long, short]) => {
                    const e = document.getElementById(id) as any;
                    if (!e) return;
                    if (l === "ja") { if (e.placeholder === long) e.placeholder = short; }
                    else if (DL && DL[short] && (e.placeholder === DL[long] || e.placeholder === long || e.placeholder === short)) e.placeholder = DL[short];
                });
            }
            // 無効・期限切れの1行目と、ガイドの注記（data-noi18n の中）
            document.querySelectorAll("#v92e-lgerr, .k-r4c-gnote").forEach((el: any) => {
                const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
                let n: any;
                while ((n = w.nextNode())) {
                    const v = String(n.nodeValue || "").trim();
                    if (!v) continue;
                    const row = LGFIX.find((r) => r.indexOf(v) >= 0);
                    if (row && row[ix] !== v) n.nodeValue = String(n.nodeValue).replace(v, row[ix]);
                }
            });
        } catch (e) { }
    }
    setInterval(lgFix, 700);
    // 「サンプルで試す」の窓：見本の名前を、見本が持つ英文社名・英文商品名で出す（日本語以外）
    function smpNames() {
        try {
            if (L2() === "ja") return;
            const DI: any = (typeof I18N !== "undefined" && I18N && I18N.dict && I18N.dict[I18N.lang]) || {};
            document.querySelectorAll(".v84smp .v84smp-row").forEach((b: any) => {
                if (b.getAttribute("data-r5c")) return;
                const a = String(b.getAttribute("data-arg") || "");
                const x = /^s2:/.test(a) ? (typeof SAMPLES2 !== "undefined" ? SAMPLES2[a.slice(3)] : null) : (typeof PRODUCTS !== "undefined" ? PRODUCTS[a] : null);
                if (!x) return;
                b.setAttribute("data-r5c", "1");
                const bb = b.querySelector(".v84smp-t b"), sm = b.querySelector(".v84smp-t small");
                const item = x.itemEn || DI[x.item] || "", coN = x.coEn || DI[x.co] || "";
                if (bb && item) bb.textContent = item;
                if (sm) {
                    const parts = String(sm.textContent || "").split("・");
                    const kind = parts[parts.length - 1];
                    const cat = DI[x.cat] || x.cat;
                    sm.textContent = [coN || x.co, cat, kind].join(L2() === "zh" ? "・" : " · ");
                }
            });
        } catch (e) { }
    }
    try {
        if (typeof v84SmpOpen === "function") {
            const so5 = v84SmpOpen;
            v84SmpOpen = function (this: any) { const r = so5.apply(this, arguments as any); try { smpNames(); setTimeout(smpNames, 200); } catch (e) { } return r; };
        }
    } catch (e) { }
    /* ═════ F. 直接連絡の返信案（英文）：日本語の値（food-N09 の残り）・英文の中の中黒（medical-M09 b） ═════
       ・訳は作り込まない。決まった形（数＋単位「300本」／「受注後21日」／「製造から12ヶ月」／港の名前／支払の決まった言い方）だけ英語に置き換える
       ・それ以外の日本語（漢字だけの値を含む）は、送る前の点検が「どこに・どの欄の値が」残っているかを知らせる（これまでは かな の数だけ） */
    const JAc = /[ぁ-んァ-ヶ一-龠々]/;
    const UNITS: any = { 本: "pcs", 個: "pcs", 枚: "sheets", 袋: "bags", 缶: "cans", 箱: "boxes", 台: "units", セット: "sets", ケース: "cases", 足: "pairs", 着: "pcs", 点: "pcs", 冊: "copies", 粒: "tablets", 錠: "tablets", 瓶: "bottles", ボトル: "bottles", パック: "packs" };
    const PORT: any = { 横浜: "Yokohama", 東京: "Tokyo", 名古屋: "Nagoya", 神戸: "Kobe", 大阪: "Osaka", 博多: "Hakata", 清水: "Shimizu", 門司: "Moji", 新潟: "Niigata", 苫小牧: "Tomakomai", 那覇: "Naha", 成田: "Narita", 関西: "Kansai", 羽田: "Haneda", 中部: "Chubu" };
    const timeU = (u: string) => u === "日" ? "days" : u === "営業日" ? "business days" : u === "週間" ? "weeks" : u === "年" ? "years" : "months";
    function enFixed(v: any): string {
        const raw = String(v == null ? "" : v);
        if (!JAc.test(raw)) return raw;
        let s = raw.normalize("NFKC").trim();
        s = s.replace(/受注後\s*約?\s*(\d+)\s*(営業日|日|週間|[ヶかカヵ]月)(?:以内)?/g, (_m, n, u) => `${n} ${timeU(u)} after order`);
        s = s.replace(/製造日?(?:から|より)\s*(\d+)\s*(日|週間|[ヶかカヵ]月|年)/g, (_m, n, u) => `${n} ${timeU(u)} from manufacture`);
        s = s.replace(/\(要冷蔵\)/g, " (keep refrigerated)").replace(/\(要冷凍\)/g, " (keep frozen)").replace(/\(常温\)/g, " (ambient)");
        s = s.replace(/(横浜|東京|名古屋|神戸|大阪|博多|清水|門司|新潟|苫小牧|那覇)港/g, (_m, p) => PORT[p]);
        s = s.replace(/(成田|関西|羽田|中部)(?:国際)?空港/g, (_m, p) => PORT[p] + " Airport");
        s = s.replace(/前払い?\s*\(出荷前に全額\)/g, "in advance (full payment before shipment)").replace(/前払い?\s*100%/g, "100% in advance").replace(/前払い?/g, "in advance").replace(/\s*\(信用状\)/g, "");
        s = s.replace(/(\d[\d,]*)\s*(営業日|日|週間|[ヶかカヵ]月)(?![ぁ-んァ-ヶ一-龠々])/g, (_m, n, u) => `${n} ${timeU(u)}`);
        s = s.replace(/(\d[\d,]*)\s*(セット|ケース|ボトル|パック|本|個|枚|袋|缶|箱|台|足|着|点|冊|粒|錠|瓶)(?![ぁ-んァ-ヶ一-龠々])/g, (_m, n, u) => `${n} ${UNITS[u]}`);
        s = s.replace(/(\d [a-z]+)\s*[〜~]\s*$/, "$1 or more");
        return s.replace(/\s{2,}/g, " ").trim();
    }
    API.enFixed = enFixed;
    const midDot = (s: any) => typeof s === "string" ? s.replace(/([\x21-\x7e])・(?=[\x21-\x7e])/g, "$1 / ") : s;
    const enLike = (s: any) => { const t = String(s || ""); const la = (t.match(/[A-Za-z]/g) || []).length, ja = (t.match(/[ぁ-んァ-ヶ一-龠々]/g) || []).length; return la > ja * 3; };
    try {
        if (typeof bmOfflineAdvice === "function") {
            const o5 = bmOfflineAdvice;
            bmOfflineAdvice = function (this: any, th: any, mode: any, b: any, lastBy: any) {
                let b2 = b;
                try { if (b && typeof b === "object") { b2 = Object.assign({}, b); ["moq", "lead", "shelf", "term", "pay"].forEach((k) => { if (typeof b2[k] === "string") b2[k] = enFixed(b2[k]); }); } } catch (e) { b2 = b; }
                let h = o5.call(this, th, mode, b2, lastBy);
                try {
                    if (typeof BM !== "undefined" && BM && typeof BM.lastDraft === "string" && enLike(BM.lastDraft)) {
                        const d0 = BM.lastDraft, d1 = midDot(d0);
                        if (d1 !== d0) { BM.lastDraft = d1; if (typeof h === "string") h = h.split(E(d0)).join(E(d1)); }
                    }
                } catch (e) { }
                return h;
            };
        }
    } catch (e) { }
    try {
        if (typeof v71obTpl === "function") {
            const t5 = v71obTpl;
            v71obTpl = function (this: any) {
                const res = t5.apply(this, arguments as any);
                try { if (res && Array.isArray(res.seq)) res.seq.forEach((m: any) => { if (m && enLike(m.body)) { m.body = midDot(m.body); if (typeof m.subj === "string") m.subj = midDot(m.subj); } }); } catch (e) { }
                return res;
            };
        }
    } catch (e) { }
    try {
        if (typeof dmTemplateEN === "function") {
            const d5 = dmTemplateEN;
            dmTemplateEN = function (this: any) {
                const res = d5.apply(this, arguments as any);
                try { if (res && typeof res.body === "string" && enLike(res.body)) { res.body = midDot(res.body); if (typeof res.subj === "string") res.subj = midDot(res.subj); } } catch (e) { }
                return res;
            };
        }
    } catch (e) { }
    // 送る前の点検：外国語の本文に残った日本語（漢字を含む）を、場所と欄の名前つきで知らせる
    const FLD: any[] = [["moq", "MOQ"], ["lead", "リードタイム"], ["cert", "認証・規格"], ["shelf", "賞味期限・保証期間"], ["term", "取引条件"], ["pol", "仕出港"], ["pay", "支払条件"]];
    try {
        if (typeof v33CkText === "function") {
            const c5 = v33CkText;
            v33CkText = function (this: any, F: any, txt: any, o: any) {
                const n0 = Array.isArray(F) ? F.length : 0;
                const r = c5.apply(this, arguments as any);
                try {
                    const oo = o || {};
                    const s = String(txt || "");
                    if (!Array.isArray(F) || oo.ja || !JAc.test(s) || !enLike(s)) return r;
                    if (/中文|简体|簡体|繁體|繁体|Chinese|日本語|Japanese/i.test(String(oo.lang || ""))) return r;
                    const mine = F.slice(n0);
                    if (mine.some((f: any) => f && f.lv === "red" && /^日本語が残っています/.test(String(f.t)))) return r;
                    const toks = Array.from(new Set(s.split(/[\s:：;,／\/\-–—]+/).map((x) => x.replace(/^[「『]+|[」』。、.]+$/g, "")).filter((x) => JAc.test(x)))) as string[];
                    if (!toks.length) return r;
                    for (let i = F.length - 1; i >= n0; i--) if (F[i] && /^日本語が少し残っています/.test(String(F[i].t))) F.splice(i, 1);
                    const show = toks.slice(0, 6).map((x) => "「" + x.slice(0, 24) + "」").join("");
                    F.push({ lv: "yel", t: "本文に、日本語（漢字を含む）のままの所が " + toks.length + "か所あります：" + show + (toks.length > 6 ? " ほか" : ""), how: "相手は読めません。本文の中で、送る言語（固有名詞はローマ字）に直してください", go: oo.go });
                    const d: any = (typeof D !== "undefined" && D) || ten() || {};
                    const hit = FLD.filter(([k]) => { const v = String(d[k] || "").normalize("NFKC"); return v && JAc.test(v) && toks.some((t) => { const tt = t.normalize("NFKC"); return v.indexOf(tt) >= 0 || tt.indexOf(v) >= 0; }); });
                    if (hit.length)
                        F.push({ lv: "yel", t: "登録が日本語のままの欄：" + hit.map(([k, n]) => n + "「" + String(d[k]).slice(0, 24) + "」").join("・"), how: "「商品情報」で英語でも入れておくと、次から返信案に英語で入ります（この項目から「商品情報」を開けます。書きかけの本文は消えるので、先に写しておいてください）",
                            go: () => { try { if (typeof closeDW === "function") closeDW(); } catch (e) { } try { go("item"); } catch (e) { } } });
                } catch (e) { }
                return r;
            };
        }
    } catch (e) { }
    try {
        if (typeof I18N !== "undefined" && I18N && Array.isArray(I18N.pat)) {
            const L3 = (en: string, zh: string, es: string) => I18N.lang === "zh" ? zh : I18N.lang === "es" ? es : en;
            const f1 = (m: any) => L3(`The message still contains Japanese text (including kanji) in ${m[1]} place(s): ${m[2]}`, `正文中有 ${m[1]} 处仍为日语（含汉字）：${m[2]}`, `El mensaje aún contiene texto en japonés (incluidos kanji) en ${m[1]} lugar(es): ${m[2]}`);
            I18N.pat.unshift({ re: /^本文に、日本語（漢字を含む）のままの所が (\d+)か所あります：(.+)$/, en: f1, zh: f1, es: f1 });
            const f2 = (m: any) => L3(`Fields registered in Japanese only: ${m[1]}`, `仅以日语登记的栏目：${m[1]}`, `Campos registrados solo en japonés: ${m[1]}`);
            I18N.pat.unshift({ re: /^登録が日本語のままの欄：(.+)$/, en: f2, zh: f2, es: f2 });
            const DI: any = I18N.dict;
            const TR = (ja: string, en: string, zh: string, es: string) => { if (DI.en && DI.en[ja] == null) DI.en[ja] = en; if (DI.zh && DI.zh[ja] == null) DI.zh[ja] = zh; if (DI.es && DI.es[ja] == null) DI.es[ja] = es; };
            TR("相手は読めません。本文の中で、送る言語（固有名詞はローマ字）に直してください", "The buyer cannot read it. Rewrite it in the language you are sending (use romaji for proper names)", "对方看不懂。请在正文中改为发送的语言（专有名词用罗马字）", "El comprador no puede leerlo. Reescríbalo en el idioma de envío (nombres propios en romaji)");
            TR("「商品情報」で英語でも入れておくと、次から返信案に英語で入ります（この項目から「商品情報」を開けます。書きかけの本文は消えるので、先に写しておいてください）", "If you also enter them in English in Product information, reply drafts will use the English from next time (this item opens Product information; copy your draft first, as it will be lost)", "在“商品信息”中同时用英语填写后，下次回复草稿将使用英语（此项可打开“商品信息”；正在写的正文会丢失，请先复制）", "Si también los introduce en inglés en Información del producto, los borradores usarán el inglés (este elemento abre esa pantalla; copie antes su borrador, se perderá)");
        }
    } catch (e) { }
    /* ═════ G. 「返信をシミュレート（体験用）」（medical-M10） ═════
       調べたこと：ボタンは効いている（押すと 1〜2秒で見本の返信が1通入り、知らせも出る）。評価の道具は「返信をシミュレート（体験用）」という文字で要素を探すが、
       ボタンの文字は絵文字つき（🧪 返信を…）の1つの文字の節で、文字どおりには見つからず、押せていなかった。絵文字と言葉を別の要素に分ける（見た目・働きは同じ） */
    function simLabel() {
        try {
            const b = document.getElementById("bmSim");
            if (!b || b.children.length) return;
            const m = String(b.textContent || "").match(/^\s*(🧪)\s*(.+)$/u);
            if (!m) return;
            b.textContent = "";
            const a = document.createElement("span"); a.setAttribute("aria-hidden", "true"); a.textContent = m[1] + " ";
            const t = document.createElement("span"); t.textContent = m[2];
            b.appendChild(a); b.appendChild(t);
        } catch (e) { }
    }
    try {
        if (typeof openDMThread === "function") {
            const od5 = openDMThread;
            openDMThread = function (this: any) { const r = od5.apply(this, arguments as any); try { simLabel(); setTimeout(simLabel, 300); } catch (e) { } return r; };
        }
    } catch (e) { }
    /* ═════ H. 磨き ═════
       H1 中古車・建設機械：AIバイヤー開拓の業態の選択肢「飲食・ホテル（HoReCa）」「専門店・セレクトショップ」は、たたんで出す（消さない。押せば出る）（auto-N06）
       H2 中古車・建設機械：商品情報のタブ「成分・仕様」→「仕様・状態」、出どころ「成分表・材質表から」→「仕様の表から」（auto-07）
       H3 営業資料の点検：成分表の行はあるが値が無いとき、「成分・仕様のページがありません（…登録が必要）」を、理由の合う言い方に（health-N09） */
    const isAuto = () => { try { const c = String((ten() && ten().cat) || ""); return c === "中古車" || c === "建設機械"; } catch (e) { return false; } };
    function bizFold() {
        const box = document.querySelector(".v71bz") as any;
        if (!box) return;
        const auto = !isFwd() && isAuto();
        const off = ["horeca", "spec"];
        const chips: any[] = Array.from(box.querySelectorAll(".v71chip[data-v71bz]")).filter((c: any) => off.indexOf(c.getAttribute("data-v71bz")) >= 0);
        let tg = box.querySelector(".v92r5c-bzmore") as any;
        if (!auto || !chips.length || chips.some((c: any) => c.classList.contains("on")) || box.getAttribute("data-r5copen")) {
            chips.forEach((c: any) => { if (c.style.display === "none") c.style.display = ""; });
            if (tg) tg.remove();
            return;
        }
        chips.forEach((c: any) => { if (c.style.display !== "none") c.style.display = "none"; });
        if (!tg) {
            tg = document.createElement("button");
            tg.type = "button"; tg.className = "v71chip v92r5c-bzmore"; tg.setAttribute("data-noi18n", "1");
            tg.style.cssText = "border-style:dashed;color:var(--ink-3,#667085)";
            tg.textContent = M("＋ ほかの業態（" + chips.length + "）", "+ Other types (" + chips.length + ")", "＋ 其他业态（" + chips.length + "）", "+ Otros tipos (" + chips.length + ")");
            tg.title = M("車両・機械では選ばれることの少ない業態（飲食・ホテル、専門店）をたたんでいます。押すと出ます", "Buyer types rarely used for vehicles and machinery are folded. Press to show them", "车辆・机械很少选择的业态已折叠，点击显示", "Tipos poco usados para vehículos y maquinaria están plegados. Pulse para mostrarlos");
            tg.addEventListener("click", () => { box.setAttribute("data-r5copen", "1"); bizFold(); });
            box.appendChild(tg);
        }
    }
    function autoWords() {
        try {
            if (typeof cur === "undefined" || cur !== "item" || isFwd() || !isAuto()) return;
            const well = document.getElementById("well");
            if (!well) return;
            const ja = L2() === "ja";
            well.querySelectorAll(".v33tab, .uxsc").forEach((b: any) => {
                const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
                let n: any;
                while ((n = w.nextNode())) {
                    const v = String(n.nodeValue || "");
                    if (ja && v.trim() === "成分・仕様") n.nodeValue = v.replace("成分・仕様", "仕様・状態");
                }
            });
            if (!ja) return;
            const tw = document.createTreeWalker(well, NodeFilter.SHOW_TEXT);
            let n: any, i = 0;
            while ((n = tw.nextNode()) && i++ < 6000) {
                const v = String(n.nodeValue || "");
                if (v.indexOf("成分表・材質表から") >= 0) n.nodeValue = v.replace("成分表・材質表から", "仕様の表から");
            }
        } catch (e) { }
    }
    setInterval(() => { try { if (document.body.classList.contains("locked")) return; bizFold(); autoWords(); } catch (e) { } }, 900);
    try {
        if (typeof dk3Check === "function") {
            const dk5 = dk3Check;
            dk3Check = function (this: any) {
                const r = dk5.apply(this, arguments as any);
                try {
                    if (r && Array.isArray(r.crit) && Array.isArray(r.warn) && r.warn.some((x: any) => x && x.k === "v79empty")) {
                        const c = r.crit.find((x: any) => x && x.k === "spec");
                        if (c) c.t = "成分・仕様のページを作れていません（成分表・規格の行は登録済みですが、値の入った行がありません。下の「値が入っていない行」を見てください）";
                    }
                } catch (e) { }
                return r;
            };
        }
        if (typeof I18N !== "undefined" && I18N && I18N.dict) {
            const DI: any = I18N.dict;
            const k = "成分・仕様のページを作れていません（成分表・規格の行は登録済みですが、値の入った行がありません。下の「値が入っていない行」を見てください）";
            if (DI.en && DI.en[k] == null) DI.en[k] = "The ingredients/specifications page could not be made (rows are registered, but none has a value — see “Rows without a value” below)";
            if (DI.zh && DI.zh[k] == null) DI.zh[k] = "未能生成成分・规格页面（成分表・规格的行已登记，但没有填入数值的行。请看下方“未填数值的行”）";
            if (DI.es && DI.es[k] == null) DI.es[k] = "No se pudo crear la página de ingredientes/especificaciones (hay filas registradas, pero ninguna con valor; vea «Filas sin valor» abajo)";
        }
    } catch (e) { }
})();
