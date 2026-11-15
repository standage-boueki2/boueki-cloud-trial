/* 21.92 entry：入口と案内の課題の直し（2026-11-15 評価 xlogin-01〜33）。本体の層（今の版・刷新版の両方に効く）
   ① ログインの失敗の案内を、押したボタンのすぐ下（見える位置）に出す。空のままのときは「入力してください」。
      期限切れ・無効・コード不明のときは、次にすること（STANDAGE の担当者へ・何を添えるか）を文で足す（xlogin-01・03・05）
      ※ 連絡先の実データ（メール・電話）はアプリが持っていないため、作らない。もとの #lg-err は動かさず（ほかの層が読むため）、写しを出す
   ② 右下「AI商社マンに聞く」の窓：答えの欄に高さを配る（説明文は会話が始まったらたたむ・質問の例は1行に・入力欄は低く）（xlogin-31）
   ③ メンバーの招待・役割・担当・停止・再開・削除を「操作の記録」に残す（tmLog を包み、今の v33AuLog と同じ形で記録）（xlogin-25）
   ④ AI の答え（内蔵エンジン）：「ログアウトはどこ」「トライアルの期限」「何から始める」に答える。CIF などの建値を聞かれたら、
      答えの単価が登録済みの価格表の金額であることを添える。HS コードを聞かれたら、登録済みの番号を先頭に（xlogin-32・22）
   ⑤ 何でも検索：ログアウト・文字の大きさ・困ったとき・スタートガイドが当たる。0件のときは「AI商社マンに聞く」（xlogin-19・22 の残り）
   ⑥ メンバーの画面の言葉（台帳・同期サーバー・Ver.1）を利用者の言葉に。招待の入力の誤りは欄へ送る。入り方の説明をそろえる（xlogin-26・27・28）
   ⑦ 知らせの言葉：「表示の密度」→「文字の大きさ」（xlogin-24）／登録メニューに、商品が無いあいだ ほかの画面が開けない理由（xlogin-07）
   ⑧ 取り込んだ情報・用語集・通知の設定の細かい言葉（xlogin-16・23・29）／操作の記録の「誰が」を折り返さない（xlogin-33）
   今のアプリの関数は包むだけ（中身は変えない）。保存の形は変えない。数字・事実はアプリが持っているものだけ */
declare const SES: any, I18N: any, TENS: any, D: any, FWDON: any, V33AU_ACT: any, GL: any, TEN: any;
declare let tmLog: any, brain: any, uxPalItems: any, toast: any, render: any, openDW: any, v61Toast: any, cur: any;
declare function v33AuLog(a: string, w: string, x?: any): void;
declare function acct(): any;
declare function dleft(a: any): any;
declare function fdate(a: any): any;
declare function go(id: string): void;
declare function closeDW(): void;
(function () {
    const W: any = window;
    if (W.__v2192entry)
        return;
    W.__v2192entry = 1;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]);
    const lang = () => {
        try {
            let v = "";
            try { v = String((typeof I18N !== "undefined" && I18N && I18N.lang) || ""); } catch (e) { }
            if (!v) {
                const el = (document.getElementById("lang") || document.getElementById("lang2")) as any;
                v = String((el && el.value) || "ja");
            }
            return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
        }
        catch (e) {
            return "ja";
        }
    };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const isRd = () => { try { return document.documentElement.classList.contains("rd") && !!W.RDX; } catch (e) { return false; } };
    const isFwd = () => { try { return !!((typeof FWDON !== "undefined" && FWDON) || (typeof SES !== "undefined" && SES && SES.role === "fwd")); } catch (e) { return false; } };
    const isAdm = () => { try { return !!(typeof SES !== "undefined" && SES && SES.t === "admin"); } catch (e) { return false; } };
    const vis = (e: any) => { try { if (!e || e.hidden) return false; const c = getComputedStyle(e), r = e.getBoundingClientRect(); return c.display !== "none" && c.visibility !== "hidden" && r.width > 0 && r.height > 0; } catch (x) { return false; } };
    const dictAdd = (pairs: string[][]) => { try { if (typeof I18N === "undefined" || !I18N || !I18N.dict) return; pairs.forEach(p => { ["en", "zh", "es"].forEach((l, i) => { if (p[i + 1] && I18N.dict[l] && !I18N.dict[l][p[0]]) I18N.dict[l][p[0]] = p[i + 1]; }); }); } catch (e) { } };

    /* ───── 見た目（今の版・刷新版の両方） ───── */
    try {
        const st = document.createElement("style");
        st.id = "v92entrycss";
        st.textContent = [
            // ① ログインの案内の写し
            "#lgv .v92e-err{margin:10px 0 2px;padding:10px 12px;border-radius:10px;border:1.5px solid #E7A39B;background:#FDF0EE;color:#A32B1F;font-size:14px;font-weight:700;line-height:1.7;text-align:left}",
            "#lgv .v92e-err.wait{border-color:#B9CCE6;background:#F1F6FD;color:#27456F}",
            "#lgv .v92e-err small{display:block;margin-top:4px;font-size:13px;font-weight:600;color:#5B2620}",
            "#lgv.v92e-mir #lg-err{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;clip-path:inset(50%)!important;margin:0!important;padding:0!important;border:0!important}",
            "#lgv .v92e-bad{outline:2px solid #D9534F!important;outline-offset:1px}",
            "#lgv .v92e-help{margin:10px 0 0;font-size:13px;line-height:1.75;text-align:left;color:var(--ink-2,#3B4A61)}",
            "#lgv .v92e-help summary{cursor:pointer;font-weight:800;color:var(--bl,#1F6FD1)}",
            "#lgv .v92e-help ul{margin:6px 0 0;padding-left:1.2em}",
            "#lgv .v92e-help li{margin:3px 0}",
            // ② AI に聞く窓：答えの欄に高さを配る
            "#pn .dwbody:has(> #dwchat){min-height:0}",
            "#pn .dwbody > #dwchat{flex:1 1 auto;min-height:150px}",
            "#pn .dwbody:has(> #dwchat) > .qb{flex:0 0 auto;max-height:92px;overflow-y:auto}",
            "#pn .dwbody:has(> #dwchat .m.u) > .qb{flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;max-height:none;padding-bottom:4px}",
            "#pn .dwbody:has(> #dwchat .m.u) > .qb > .q{flex:none;white-space:nowrap}",
            "#pn .dwbody:has(> #dwchat .m.u) > p.nn{display:none}",
            "#pn .dwbody:has(> #dwchat) > p.nn{flex:none}",
            "@media (max-height:860px){#pn:has(#dwchat) .dwfoot #dwq{height:56px;min-height:48px}#pn:has(#dwchat .m.u) .dwfoot .composer > .rw:first-child > span{display:none}#pn:has(#dwchat) .dwfoot{padding-top:6px;padding-bottom:6px}}",
            // ⑧ 操作の記録：「誰が」「日時」は折り返さない
            ".v33t th:nth-child(1),.v33t td:nth-child(1),.v33t th:nth-child(2),.v33t td:nth-child(2){white-space:nowrap}",
            "@media (min-width:900px){.v33t th:nth-child(3),.v33t td:nth-child(3){white-space:nowrap}}",
            // ⑥ 招待の入力の誤り
            "#pn .v92e-bad{outline:2px solid #D9534F!important;outline-offset:1px}",
            "#v1811ov .v92e-gate{margin:8px 0 10px;padding:9px 12px;border-radius:10px;background:#FFF6EC;border:1px solid #F8D9B4;font-size:13.5px;line-height:1.7;color:#5A3A12}",
            ".v92e-note{margin:8px 0 0;padding:9px 12px;border-radius:10px;background:#F1F6FD;border:1px solid #C9DAF0;font-size:13.5px;line-height:1.75;color:#27456F}",
            ".v92e-askbtn{margin-top:8px}"
        ].join("\n");
        (document.head || document.documentElement).appendChild(st);
    }
    catch (e) { }

    /* ───── ① ログインの案内（xlogin-01・03・05） ───── */
    const LG = { btn: null as any, cand: null as any, candAt: 0, obs: null as any, host: null as any, busy: 0 };
    const cardBtn = (inp: any): any => {
        const id = String((inp && inp.id) || "");
        const pick = (s: string) => document.getElementById(s);
        if (/^v65a-(mail|pw|show)/.test(id))
            return pick("v65a-go");
        if (/^lg-(code|name)/.test(id))
            return pick("lg-go");
        if (/^ad-/.test(id))
            return pick("ad-go");
        // そのほか（確認コードの窓など）：同じ箱の中の主ボタン
        try {
            let p = inp && inp.parentElement;
            for (let i = 0; i < 4 && p; i++, p = p.parentElement) {
                const b = p.querySelector("button.btn:not(.g)");
                if (b)
                    return b;
            }
        }
        catch (e) { }
        return null;
    };
    const val = (id: string) => { const e = document.getElementById(id) as any; return e ? String(e.value || "").trim() : ""; };
    // 案内の言い直し：[出す文, 添える文, 入力へ戻す欄の id]
    function lgWords(t: string, btn: any): [string, string, string] {
        const bid = String((btn && btn.id) || "");
        let main = t, sub = "", focus = "";
        try {
            if (bid === "v65a-go") {
                if (!val("v65a-mail") && /メールアドレスの形が正しくありません|email/i.test(t)) {
                    main = M("メールアドレスを入力してください。", "Please enter your email address.", "请输入邮箱地址。", "Introduzca su correo electrónico.");
                    focus = "v65a-mail";
                }
                else if (/メールアドレスの形/.test(t))
                    focus = "v65a-mail";
                else if (/パスワードを入力/.test(t))
                    focus = "v65a-pw";
            }
            if (bid === "ad-go" && /IDまたはパスワードが違います/.test(t)) {
                const noId = !val("ad-id"), noPw = !val("ad-pw");
                if (noId || noPw) {
                    main = noId && noPw ? M("管理者IDとパスワードを入力してください。", "Please enter the admin ID and password.", "请输入管理员ID和密码。", "Introduzca el ID de administrador y la contraseña.")
                        : noId ? M("管理者IDを入力してください。", "Please enter the admin ID.", "请输入管理员ID。", "Introduzca el ID de administrador.")
                            : M("パスワードを入力してください。", "Please enter the password.", "请输入密码。", "Introduzca la contraseña.");
                    focus = noId ? "ad-id" : "ad-pw";
                }
            }
            if (bid === "lg-go") {
                if (/アクセスコードを入力/.test(t))
                    focus = "lg-code";
                if (/有効期限が切れています/.test(t))
                    sub = M("延長・再開をご希望のときは、このアクセスコードをお渡しした STANDAGE の担当者へ、会社名とアクセスコードを添えてご連絡ください。ご契約のアカウント（メールアドレスとパスワード）をお持ちの方は、「メールアドレスとパスワード」の欄からログインできます。",
                        "To extend or reactivate, please contact the STANDAGE representative who gave you this access code, with your company name and the code. If you have a contract account (email and password), sign in from “Members”.",
                        "如需延长或恢复，请联系向您提供此访问码的 STANDAGE 负责人，并告知公司名称和访问码。", "Para ampliar o reactivar, contacte con el responsable de STANDAGE que le entregó este código, indicando el nombre de su empresa y el código.");
                else if (/無効化されています/.test(t))
                    sub = M("再開をご希望のときは、このアクセスコードをお渡しした STANDAGE の担当者へ、会社名とアクセスコードを添えてご連絡ください。",
                        "To reactivate, please contact the STANDAGE representative who gave you this access code, with your company name and the code.",
                        "如需恢复，请联系向您提供此访问码的 STANDAGE 负责人，并告知公司名称和访问码。", "Para reactivarla, contacte con el responsable de STANDAGE que le entregó este código, indicando el nombre de su empresa y el código.");
                else if (/登録されていません/.test(t)) {
                    sub = M("ハイフンの位置と文字（0 と O、1 と I など）を確かめてください。コードが分からないときは、コードをお渡しした STANDAGE の担当者へお問い合わせください。",
                        "Please check the hyphens and look-alike characters (0/O, 1/I). If you do not know your code, ask the STANDAGE representative who gave it to you.",
                        "请确认连字符的位置和相似字符（0 与 O、1 与 I 等）。如果不知道访问码，请咨询向您提供访问码的 STANDAGE 负责人。", "Compruebe los guiones y los caracteres parecidos (0/O, 1/I). Si no conoce su código, pregunte al responsable de STANDAGE que se lo entregó.");
                    focus = "lg-code";
                }
            }
        }
        catch (e) { }
        return [main, sub, focus];
    }
    function lgPlace() {
        if (LG.busy)
            return;
        LG.busy = 1;
        try {
            const v = document.getElementById("lgv");
            const e = document.getElementById("lg-err") as any;
            let m = document.getElementById("v92e-lgerr") as any;
            const t = e && !e.hidden ? String(e.textContent || "").trim() : "";
            let btn = LG.btn && v && v.contains(LG.btn) && vis(LG.btn) ? LG.btn : null;
            if (!btn && LG.btn && LG.btn.id && v) {
                // 箱が描き直されて、押したボタンが新しい部品に入れ替わったとき：同じ id のボタンを探す
                const b2 = document.getElementById(LG.btn.id);
                if (b2 && v.contains(b2) && vis(b2))
                    btn = LG.btn = b2;
            }
            if (!v || !t || !btn) {
                if (m)
                    m.remove();
                if (v)
                    v.classList.remove("v92e-mir");
                v && v.querySelectorAll(".v92e-bad").forEach((x: any) => x.classList.remove("v92e-bad"));
                // 押したボタンが分からないとき（開いた直後の知らせ など）は、もとの案内を見える位置へ送るだけ
                if (v && t && e && vis(e)) {
                    const r = e.getBoundingClientRect();
                    if (r.bottom > (window.innerHeight || 0) || r.top < 0) {
                        try { e.scrollIntoView({ block: "center" }); } catch (x) { }
                    }
                }
                return;
            }
            const wait = /^☁/.test(t);
            const [main, sub, focus] = wait ? [t, "", ""] : lgWords(t, btn);
            const key = btn.id + "|" + main + "|" + sub;
            if (!m) {
                m = document.createElement("div");
                m.id = "v92e-lgerr";
                m.setAttribute("data-noi18n", "1");
            }
            m.className = "v92e-err" + (wait ? " wait" : "");
            m.setAttribute("role", wait ? "status" : "alert");
            if (m.dataset.k !== key) {
                m.dataset.k = key;
                m.innerHTML = E(main) + (sub ? "<small>" + E(sub) + "</small>" : "");
            }
            if (m.previousElementSibling !== btn)
                btn.insertAdjacentElement("afterend", m);
            v.classList.add("v92e-mir");
            v.querySelectorAll(".v92e-bad").forEach((x: any) => x.classList.remove("v92e-bad"));
            if (!wait) {
                const f = focus ? document.getElementById(focus) as any : null;
                if (f && vis(f)) {
                    f.classList.add("v92e-bad");
                    f.setAttribute("aria-invalid", "true");
                    if (m.dataset.f !== key) {
                        m.dataset.f = key;
                        try { f.focus({ preventScroll: true }); } catch (x) { }
                    }
                }
                // 見える位置へ（下にはみ出すときだけ送る）
                const r = m.getBoundingClientRect(), vh = window.innerHeight || 0;
                if (r.bottom > vh - 8 || r.top < 8) {
                    try { m.scrollIntoView({ block: r.height > vh * 0.5 ? "start" : "center" }); } catch (x) { }
                }
            }
        }
        catch (e) { }
        finally {
            LG.busy = 0;
        }
    }
    // コードが分からない・期限が切れた・申し込みたいときの案内（アクセスコードの箱の下）
    function lgHelp() {
        try {
            const v = document.getElementById("lgv");
            const go = document.getElementById("lg-go");
            if (!v || !go || document.getElementById("v92e-lghelp"))
                return;
            const d = document.createElement("details");
            d.id = "v92e-lghelp";
            d.className = "v92e-help";
            d.setAttribute("data-noi18n", "1");
            d.innerHTML = "<summary>" + E(M("コードが分からない・期限が切れた・申し込みたいとき", "Lost your code, expired, or want to apply?", "不知道访问码、已过期或想申请时", "¿No tiene el código, ha caducado o quiere solicitarlo?")) + "</summary><ul>"
                + "<li>" + E(M("コードが分からない：アクセスコードは、STANDAGE の担当者からのご案内（招待状）に書かれています。見つからないときは、その担当者へお問い合わせください。", "Lost code: your access code is in the invitation from your STANDAGE representative. If you cannot find it, please ask that representative.", "不知道访问码：访问码写在 STANDAGE 负责人发给您的邀请函中。找不到时，请咨询该负责人。", "Código perdido: está en la invitación de su responsable de STANDAGE. Si no la encuentra, pregúntele.")) + "</li>"
                + "<li>" + E(M("期限が切れた・無効になった：延長・再開は STANDAGE の担当者が行います。会社名とアクセスコードを添えてご連絡ください。", "Expired or disabled: your STANDAGE representative can extend or reactivate it. Please send your company name and the code.", "已过期或被停用：由 STANDAGE 负责人办理延长或恢复，请告知公司名称和访问码。", "Caducado o desactivado: su responsable de STANDAGE puede ampliarlo o reactivarlo. Indique el nombre de su empresa y el código.")) + "</li>"
                + "<li>" + E(M("これから申し込みたい：アカウントの発行は STANDAGE の担当者が行います（この画面からは申し込めません）。", "New application: accounts are issued by STANDAGE staff (you cannot apply from this screen).", "想申请：账号由 STANDAGE 负责人发放（此页面无法申请）。", "Nueva solicitud: las cuentas las emite el personal de STANDAGE (no se puede solicitar desde esta pantalla).")) + "</li>"
                + "<li>" + E(M("ログインできたあとは、「困ったとき › お問い合わせ」から STANDAGE へ質問を送れます。", "After signing in, you can send questions to STANDAGE from “Help › Contact us”.", "登录后，可以从“遇到问题时 › 咨询”向 STANDAGE 提问。", "Tras iniciar sesión, puede enviar preguntas a STANDAGE desde «Ayuda › Contacto».")) + "</li></ul>";
            // 案内の写しがボタンの直後に入るので、その後ろに置く
            const after = document.getElementById("v92e-lgerr");
            (after && after.previousElementSibling === go ? after : go).insertAdjacentElement("afterend", d);
        }
        catch (e) { }
    }
    function lgWatch() {
        try {
            const v = document.getElementById("lgv");
            if (!v) {
                LG.host = null;
                return;
            }
            lgHelp();
            try {
                // ログアウトして、ログインの画面が見えたら知らせる（数秒だけ・入力の箱の上）
                let lo = +(W.__v92eLo || 0);
                try { lo = lo || +(sessionStorage.getItem("v92e_lo") || 0); } catch (e) { }
                try { const m = /^v92e_lo=(\d+)$/.exec(window.name || ""); if (m) lo = lo || +m[1]; } catch (e) { }
                const veil = document.getElementById("v56authlo");
                // 印は消さずに、押してから 12秒のあいだだけ出す（ログアウトの直後にページが読み直されても、同じ印で出し直せるように）
                const showLo = !!lo && Date.now() - lo < 12000 && document.body.classList.contains("locked") && vis(v) && !(veil && vis(veil));
                if (lo && Date.now() - lo >= 12000) {
                    W.__v92eLo = 0;
                    try { sessionStorage.removeItem("v92e_lo"); } catch (e) { }
                    try { if (/^v92e_lo=\d+$/.test(window.name || "")) window.name = ""; } catch (e) { }
                }
                let n = document.getElementById("v92e-lo");
                if (showLo) {
                    const card = v.querySelector(".lgc");
                    if (!n && card) {
                        n = document.createElement("div");
                        n.id = "v92e-lo";
                        n.className = "v92e-err wait";
                        n.setAttribute("role", "status");
                        n.setAttribute("data-noi18n", "1");
                        n.textContent = M("✓ ログアウトしました。", "✓ You have been logged out.", "✓ 已退出登录。", "✓ Ha cerrado sesión.");
                        card.insertAdjacentElement("afterbegin", n);
                    }
                }
                else if (n)
                    n.remove();
            }
            catch (e) { }
            if (LG.host === v)
                return;
            LG.host = v;
            if (LG.obs) {
                try { LG.obs.disconnect(); } catch (e) { }
            }
            LG.obs = new MutationObserver((recs: any[]) => {
                try {
                    // 案内（#lg-err）が書き換わったときだけ、直前に押したボタンを「この案内のボタン」と見なす
                    const e = document.getElementById("lg-err");
                    if (e && recs.some(r => r.target === e || (r.target && r.target.parentNode === e))) {
                        if (LG.cand && Date.now() - LG.candAt < 60000)
                            LG.btn = LG.cand;
                    }
                    lgHelp();
                    lgPlace();
                }
                catch (x) { }
            });
            LG.obs.observe(v, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["hidden"] });
            lgPlace();
        }
        catch (e) { }
    }
    const lgDown = (ev: any) => {
        try {
            const v = document.getElementById("lgv"), t: any = ev.target;
            if (!v || !t || !t.closest || !v.contains(t))
                return;
            lgWatch();
            const b = t.closest("button");
            if (b && !b.hasAttribute("data-t")) {
                LG.cand = b;
                LG.candAt = Date.now();
            }
        }
        catch (e) { }
    };
    // ほかの層がクリックを途中で止めることがあるので、押し始め（pointerdown・mousedown）でも覚える
    document.addEventListener("click", lgDown, true);
    document.addEventListener("pointerdown", lgDown, true);
    document.addEventListener("mousedown", lgDown, true);
    window.addEventListener("click", lgDown, true);
    document.addEventListener("keydown", ev => {
        try {
            if (ev.key !== "Enter")
                return;
            const v = document.getElementById("lgv"), t: any = ev.target;
            if (!v || !t || !v.contains(t) || t.tagName !== "INPUT")
                return;
            lgWatch();
            const b = cardBtn(t);
            if (b) {
                LG.cand = b;
                LG.candAt = Date.now();
            }
        }
        catch (e) { }
    }, true);
    // ログイン画面が出たら見張りを付ける（body の直下に #lgv が足される）
    try {
        const start = () => {
            lgWatch();
            new MutationObserver(() => { try { lgWatch(); } catch (e) { } }).observe(document.body, { childList: true });
            setInterval(() => { try { if (document.body.classList.contains("locked")) lgWatch(); } catch (e) { } }, 1200);
        };
        if (document.body)
            start();
        else
            document.addEventListener("DOMContentLoaded", start);
    }
    catch (e) { }

    /* ───── ③ メンバーの操作を「操作の記録」に残す（xlogin-25） ───── */
    try {
        const TM: any = {
            "メンバー招待": ["tm_inv", "メンバーを招待"],
            "メンバー招待（まとめて）": ["tm_invs", "メンバーを招待（まとめて）"],
            "担当の変更": ["tm_asg", "メンバーの担当を変更"],
            "役割の変更": ["tm_role", "メンバーの役割を変更"],
            "停止": ["tm_stop", "メンバーを停止"],
            "再開": ["tm_resume", "メンバーを再開"],
            "メンバー削除": ["tm_del", "メンバーを削除"],
            "メンバー登録（本人）": ["tm_self", "メンバーに登録（本人）"],
            "メンバー登録（本人・最初の管理者）": ["tm_self1", "メンバーに登録（本人・最初の管理者）"],
            "メイン担当": ["tm_main", "商品のメイン担当を変更"],
            "サブ担当": ["tm_sub", "商品のサブ担当に追加"],
            "サブ担当を外す": ["tm_unsub", "商品のサブ担当から外す"]
        };
        if (typeof V33AU_ACT !== "undefined" && V33AU_ACT) {
            Object.keys(TM).forEach(k => { if (!V33AU_ACT[TM[k][0]]) V33AU_ACT[TM[k][0]] = TM[k][1]; });
            if (!V33AU_ACT.tm_misc)
                V33AU_ACT.tm_misc = "メンバー・担当の変更";
        }
        dictAdd([["メンバーを招待", "Invited a member"], ["メンバーを招待（まとめて）", "Invited members (bulk)"], ["メンバーの担当を変更", "Changed a member's assignments"], ["メンバーの役割を変更", "Changed a member's role"],
            ["メンバーを停止", "Suspended a member"], ["メンバーを再開", "Reactivated a member"], ["メンバーを削除", "Removed a member"], ["メンバーに登録（本人）", "Registered self as a member"], ["メンバーに登録（本人・最初の管理者）", "Registered self as the first admin"],
            ["商品のメイン担当を変更", "Changed the main owner of a product"], ["商品のサブ担当に追加", "Added a sub owner of a product"], ["商品のサブ担当から外す", "Removed a sub owner of a product"], ["メンバー・担当の変更", "Member / assignment change"]]);
        if (typeof tmLog === "function" && typeof v33AuLog === "function") {
            const __tl92e = tmLog;
            tmLog = function (this: any, s: any) {
                const r = __tl92e.apply(this, arguments as any);
                try {
                    const str = String(s || "");
                    const i = str.indexOf(":");
                    const head = i >= 0 ? str.slice(0, i) : "", rest = i >= 0 ? str.slice(i + 1) : str;
                    const def = TM[head];
                    if (def) {
                        // 「氏名→役割」「氏名（引き継ぎ：○○）」は、氏名を内容に、残りを補足に
                        const m = /^(.*?)(→.*|（引き継ぎ：.*）)$/.exec(rest);
                        v33AuLog(def[0], m ? m[1] : rest, m ? m[2] : "");
                    }
                    else
                        v33AuLog("tm_misc", str, "");
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { }

    /* ───── ④ AI の答え（内蔵エンジン）（xlogin-32・22） ───── */
    const GUIDE_SRC = () => M("根拠：貿易クラウドの操作ガイド", "Source: Trade Cloud operation guide", "依据：贸易云操作指南", "Fuente: guía de uso de Trade Cloud");
    function preAnswer(raw: string): any {
        if (isAdm() || isFwd())
            return null;
        const q = String(raw || "");
        if (q.length > 60)
            return null;
        // ログアウト
        if (/ログアウト|サインアウト|log\s?out|sign\s?out/i.test(q)) {
            const where = isRd()
                ? M("画面の右上の<b>会社名のボタン</b>を押すと開く窓の、いちばん下の「<b>ログアウト</b>」です。", "Click the <b>company-name button</b> at the top right; “<b>Log out</b>” is at the bottom of the panel that opens.", "点击右上角的<b>公司名称按钮</b>，在打开的面板最下方有“<b>退出登录</b>”。", "Pulse el <b>botón con el nombre de la empresa</b> arriba a la derecha; «<b>Cerrar sesión</b>» está al final del panel.")
                : M("画面の上の帯の右のほうにある「<b>ログアウト</b>」です。", "It is “<b>Log out</b>” toward the right of the top bar.", "在页面上方栏靠右的“<b>退出登录</b>”。", "Es «<b>Cerrar sesión</b>», a la derecha de la barra superior.");
            return { a: where + "<br><br>" + M("押すと、確認の窓は出ずにログインの画面へ戻ります。登録した内容は、次にログインしたときにそのまま使えます（体験用・デモ用のアカウントは、ログアウトすると初めの状態に戻ります）。", "It returns to the sign-in screen without a confirmation. Your saved data is available the next time you sign in (trial / demo accounts are reset on logout).", "点击后不会弹出确认窗口，直接回到登录页面。已保存的内容下次登录时可继续使用（体验用、演示用账号退出后会恢复到初始状态）。", "Vuelve a la pantalla de inicio de sesión sin confirmación. Sus datos guardados estarán disponibles la próxima vez (las cuentas de prueba / demo se reinician al salir)."), c: GUIDE_SRC() };
        }
        // トライアルの期限
        if (/(トライアル|体験|お試し|利用|アカウント).{0,8}(期限|いつまで|残り|何日)|^(期限|有効期限)(は|って)?(いつ|何日)/.test(q) || /trial.{0,20}(expire|end|left|until)/i.test(q)) {
            try {
                if (typeof SES !== "undefined" && SES && SES.t === "trial" && typeof acct === "function" && typeof dleft === "function" && typeof fdate === "function") {
                    const a = acct();
                    if (a && a.expires)
                        return { a: M(`このトライアル環境は、<b>残り ${E(dleft(a))}日（${E(fdate(a.expires))} まで）</b>です。<br><br>延長をご希望のときは、アクセスコードをお渡しした STANDAGE の担当者へご連絡ください。残りの日数は、左メニューのいちばん下にもいつも出ています。`,
                            `This trial environment has <b>${E(dleft(a))} days left (until ${E(fdate(a.expires))})</b>.<br><br>To extend it, please contact the STANDAGE representative who gave you the access code. The remaining days are always shown at the bottom of the left menu.`,
                            `此试用环境<b>还剩 ${E(dleft(a))} 天（至 ${E(fdate(a.expires))}）</b>。<br><br>如需延长，请联系向您提供访问码的 STANDAGE 负责人。`,
                            `Este entorno de prueba tiene <b>${E(dleft(a))} días restantes (hasta ${E(fdate(a.expires))})</b>.<br><br>Para ampliarlo, contacte con el responsable de STANDAGE que le entregó el código.`),
                            c: M("根拠：このアカウントの有効期限", "Source: this account's expiry date", "依据：此账号的有效期", "Fuente: fecha de caducidad de esta cuenta") };
                }
            }
            catch (e) { }
            return null;
        }
        // 何から始めればよいか
        if (/何から(始|はじ|やれ|すれ|手を)|なにから(始|はじ)|(はじめて|初めて).{0,6}輸出|最初に(何|なに)|どこから(始|はじ)/.test(q) || /where (do|should) i (start|begin)|how (do|should) i (start|begin)|get(ting)? started/i.test(q)) {
            let st: any = null;
            try { st = typeof W.v92coreSteps === "function" ? W.v92coreSteps() : null; } catch (e) { st = null; }
            if (st && Array.isArray(st.steps) && st.steps.length) {
                const rows = st.steps.map((x: any, i: number) => `${i + 1}. ${x.done ? "✅ " : ""}${x.now ? "<b>" : ""}${E(x.t)}${x.now ? "</b> ← " + M("いまはここ", "you are here", "当前在这里", "está aquí") : ""}`).join("<br>");
                const nx = st.next ? M(`次にやることは「<b>${E(st.next.t)}</b>」です。「案件」（ホーム）の見出しの右の「次は」ボタンからも進めます。`, `Your next step is “<b>${E(st.next.t)}</b>”. You can also use the “Next” button on the Home screen.`, `下一步是“<b>${E(st.next.t)}</b>”。`, `Su siguiente paso es «<b>${E(st.next.t)}</b>».`)
                    : M("6つの手順はすべて済んでいます。「案件」で、相手ごとの商談を進めてください。", "All six steps are done. Continue your deals on the Home screen.", "6个步骤已全部完成。", "Los seis pasos están completos.");
                return { a: M("貿易の知識がなくても、次の<b>6つの手順</b>を上から順に進めれば大丈夫です。", "Even without trade knowledge, just follow these <b>six steps</b> in order.", "即使没有贸易知识，按顺序完成以下<b>6个步骤</b>即可。", "Aunque no tenga experiencia, siga estos <b>seis pasos</b> en orden.") + "<br><br>" + rows + "<br><br>" + nx
                    + "<br><br>" + M("全体の流れは、左下の「3分でわかるスタートガイド」で見られます。", "See the “3-minute start guide” at the bottom left for the overall flow.", "整体流程可在左下方的“3分钟入门指南”中查看。", "Vea la «guía de inicio de 3 minutos» abajo a la izquierda."),
                    c: M("根拠：はじめの設定（6つの手順）の進み具合", "Source: progress of the six setup steps", "依据：初始设置（6个步骤）的进度", "Fuente: progreso de los seis pasos iniciales") };
            }
        }
        return null;
    }
    function postAnswer(x: any, raw: string): any {
        try {
            if (!x || typeof x.a !== "string" || isAdm() || isFwd())
                return x;
            const q = String(raw || "");
            const t = (typeof TEN !== "undefined" && TEN) ? TEN : (typeof D !== "undefined" ? D : null);
            // 建値（CIF など）を聞かれて、価格表の単価で答えたとき：その単価が何の金額かを添える
            const inc = /(CIF|CFR|C&F|DDP|DAP|CIP|CPT)/i.exec(q);
            if (inc && /単価|合計|US\$|¥|€/.test(x.a) && x.a.indexOf(inc[1].toUpperCase()) < 0 && !/v92e-inc/.test(x.a)) {
                const term = inc[1].toUpperCase();
                x.a += `<br><br><span class="v92e-inc" style="color:var(--ink-2)">⚠ ${M(`上の金額は、<b>登録されている価格表の単価</b>で計算したものです（価格表の建値は、商品情報の「価格表」で確かめられます）。<b>${E(term)}</b> の金額にするには、相手の港・都市までの運賃${/CIF|CIP/.test(term) ? "と保険料" : ""}${/DDP/.test(term) ? "・関税などの費用" : ""}を足す必要があります。運賃は「出荷を進める」の見積で確かめてください（要確認）。`,
                    `The amount above uses the <b>unit price in your registered price list</b> (check its trade term in Product info › Price list). For a <b>${E(term)}</b> price you need to add freight${/CIF|CIP/.test(term) ? " and insurance" : ""}${/DDP/.test(term) ? ", duties and other costs" : ""} to the destination. Please confirm freight with a quote (to be confirmed).`,
                    `以上金额按<b>已登记价格表的单价</b>计算。若要得到 <b>${E(term)}</b> 价格，还需加上到目的地的运费${/CIF|CIP/.test(term) ? "和保险费" : ""}（需确认）。`,
                    `El importe anterior usa el <b>precio unitario de su lista de precios</b>. Para un precio <b>${E(term)}</b> hay que añadir el flete${/CIF|CIP/.test(term) ? " y el seguro" : ""} hasta destino (por confirmar).`)}</span>`;
            }
            // HS コードを聞かれたのに番号が無いとき：登録済みの番号を先頭に
            if (/HS\s?コード|HSコード|HS\s?code|税番/i.test(q) && t && t.hs && String(t.hs).trim() && x.a.indexOf(String(t.hs).trim()) < 0 && !/v92e-hs/.test(x.a)) {
                x.a = `<span class="v92e-hs">${M("この商品の HSコード（登録済み）", "HS code of this product (registered)", "此商品的 HS 编码（已登记）", "Código HS de este producto (registrado)")}：<b>${E(String(t.hs).trim())}</b>${t.hsGuess ? M("（AI の推定・要確認）", " (AI estimate – to be confirmed)", "（AI 推定，需确认）", " (estimación de IA, por confirmar)") : ""}</span><br><br>` + x.a;
            }
            // 刷新版：答えの中の画面の名前を、いまのメニューの名前に（xlogin-12 の一部）
            if (isRd()) {
                x.a = x.a.replace(/「貿易実務・書類・出荷」/g, "「規制を調べる」「書類をつくる」「出荷を進める」（左メニューの「すべての機能」）")
                    .replace(/貿易実務・書類・出荷 › /g, "すべての機能 › 物流・出荷 › ")
                    .replace(/画面の上のバー（商材を切り替えます）/g, "画面の右上の会社名のボタン（商品を切り替えます）");
            }
        }
        catch (e) { }
        return x;
    }
    if (typeof brain === "function") {
        const __br92e = brain;
        brain = function (this: any, q: any, opts: any) {
            const raw = String((opts && opts.raw) || q || "");
            try {
                const pre = preAnswer(raw);
                if (pre)
                    return pre;
            }
            catch (e) { }
            const r = __br92e.apply(this, arguments as any);
            const fx = (x: any) => postAnswer(x, raw);
            return (r && typeof r.then === "function") ? r.then(fx) : fx(r);
        };
    }

    /* ───── ⑤ 何でも検索（xlogin-19・22） ───── */
    const clickId = (id: string) => { const e = document.getElementById(id) as any; if (e && typeof e.click === "function") { e.click(); return true; } return false; };
    function openAcctMenu(focusId: string) {
        // 刷新版：会社名のボタンの中にある → 窓を開いて、その部品に目印
        setTimeout(() => {
            try {
                const co = document.querySelector(".bar .k-co") as any;
                const dd = document.querySelector(".bar .k-dd") as any;
                if (co && dd && !dd.classList.contains("on"))
                    co.click();
                const t = document.getElementById(focusId) as any;
                if (t) {
                    try { t.focus(); } catch (e) { }
                    t.style.outline = "3px solid #F08A1C";
                    t.style.outlineOffset = "2px";
                    setTimeout(() => { try { t.style.outline = ""; t.style.outlineOffset = ""; } catch (e) { } }, 3500);
                }
            }
            catch (e) { }
        }, 120);
    }
    if (typeof uxPalItems === "function") {
        const __pal92e = uxPalItems;
        uxPalItems = function (this: any, q: any) {
            let items = __pal92e.apply(this, arguments as any) || [];
            try {
                const s = String(q || "").trim().toLowerCase();
                if (!s || isAdm())
                    return items;
                const hit = (kw: string) => kw.toLowerCase().split(" ").some(k => k && (k.indexOf(s) >= 0 || (s.length >= 2 && s.indexOf(k) >= 0)));
                const G0 = M("設定・その他", "Settings & more", "设置及其他", "Ajustes y más");
                const add: any[] = [];
                const has = (t: string) => items.some((i: any) => i && i.t === t);
                if (hit("ログアウト サインアウト logout signout ろぐあうと") && document.getElementById("lgout")) {
                    const t = M("ログアウト（場所を示します）", "Log out (show where it is)", "退出登录（显示位置）", "Cerrar sesión (mostrar dónde está)");
                    if (!has(t))
                        add.push({ g: G0, t, sub: isRd() ? M("右上の会社名のボタンの中にあります", "Inside the company-name button at the top right", "在右上角公司名称按钮中", "Dentro del botón con el nombre de la empresa") : M("上の帯の右にあります", "At the right of the top bar", "在上方栏右侧", "A la derecha de la barra superior"), ic: "🚪", v92e: 1, run: () => openAcctMenu("lgout") });
                }
                if (hit("文字 文字の大きさ 表示の密度 フォント 大きく 小さく font size もじ") && !isFwd()) {
                    const btn = document.getElementById("dens") || document.getElementById("densb") || document.querySelector("[data-act*=dens],[aria-label*='文字の大きさ'],[title*='文字の大きさ']");
                    if (btn)
                        add.push({ g: G0, t: M("文字の大きさを変える", "Change text size", "更改文字大小", "Cambiar el tamaño del texto"), sub: M("上の帯の「文字の大きさ」（ゆったり・標準・コンパクト）", "“Text size” in the top bar", "上方栏的“文字大小”", "«Tamaño del texto» en la barra superior"), ic: "🔠", v92e: 1, run: () => { try { (btn as any).click(); } catch (e) { } } });
                }
                if (hit("困ったとき ヘルプ help サポート 問い合わせ お問い合わせ へるぷ 使い方") && document.getElementById("helpb"))
                    add.push({ g: G0, t: M("困ったとき（ヘルプ・お問い合わせ）", "Help & contact", "遇到问题时（帮助、咨询）", "Ayuda y contacto"), sub: M("使い方・お問い合わせ・はじめてガイド", "How-to, contact, guide", "使用方法、咨询、指南", "Uso, contacto, guía"), ic: "❓", v92e: 1, run: () => { clickId("helpb"); } });
                if (hit("スタートガイド はじめて ガイド 手順 すたーと start guide") && isRd() && W.RDX && typeof W.RDX.quickGuide === "function")
                    add.push({ g: G0, t: M("3分でわかるスタートガイド", "3-minute start guide", "3分钟入门指南", "Guía de inicio de 3 minutos"), sub: M("6つの手順で、使い方の流れを見る", "See the flow in six steps", "通过6个步骤了解流程", "Vea el flujo en seis pasos"), ic: "🚀", v92e: 1, run: () => { try { W.RDX.quickGuide(); } catch (e) { } } });
                if (add.length)
                    items = items.concat(add);
                // 0件のとき：AI商社マンに聞く
                if (!items.length && !isFwd()) {
                    const fab = document.getElementById("askfab") as any;
                    if (fab && fab.dataset && fab.dataset.act === "dw") {
                        const raw = String(q || "").trim();
                        items = [{ g: M("見つからないとき", "Not found?", "找不到时", "¿No lo encuentra?"), t: M(`「${raw}」を AI商社マンに聞く`, `Ask the AI about “${raw}”`, `向 AI 询问“${raw}”`, `Preguntar a la IA sobre «${raw}»`), sub: M("画面・商品・タスク・用語には見つかりませんでした", "No screen, product, task or term matched", "未找到匹配的页面、商品、任务或术语", "No hay pantallas, productos, tareas ni términos"), ic: "🤖", v92e: 1, run: () => { try { fab.click(); setTimeout(() => { const ta = document.getElementById("dwq") as any; if (ta) { ta.value = raw; try { ta.dispatchEvent(new Event("input", { bubbles: true })); ta.focus(); } catch (e) { } } }, 400); } catch (e) { } } }];
                    }
                }
            }
            catch (e) { }
            return items;
        };
    }

    /* ───── ⑦ 知らせの言葉（xlogin-24・27） ───── */
    const fixToast = (m: any) => {
        try {
            if (typeof m !== "string")
                return m;
            if (/^表示の密度[：:]/.test(m))
                return m.replace(/^表示の密度/, "文字の大きさ");
            if (/同期サーバーがまだ新しい版になっていないため、使えません（管理者にご連絡ください）/.test(m))
                return m.replace("同期サーバーがまだ新しい版になっていないため、使えません（管理者にご連絡ください）", "この機能は、いま準備中です（お急ぎのときは STANDAGE の担当者へご連絡ください）");
        }
        catch (e) { }
        return m;
    };
    dictAdd([["この機能は、いま準備中です（お急ぎのときは STANDAGE の担当者へご連絡ください）", "This feature is in preparation (if urgent, please contact your STANDAGE representative)", "此功能正在准备中（如急需，请联系 STANDAGE 负责人）", "Esta función está en preparación (si es urgente, contacte con su responsable de STANDAGE)"]]);
    if (typeof toast === "function") {
        const __t92e = toast;
        toast = function (this: any, m: any) { const a: any[] = Array.prototype.slice.call(arguments); a[0] = fixToast(m); return __t92e.apply(this, a as any); };
    }
    if (typeof v61Toast === "function") {
        const __t61e = v61Toast;
        v61Toast = function (this: any, m: any) { const a: any[] = Array.prototype.slice.call(arguments); a[0] = fixToast(m); return __t61e.apply(this, a as any); };
    }

    /* ───── ⑥⑧ 画面の言葉の直し（描いたあとに、文字だけを言い直す） ───── */
    // [もとの言い方, 新しい言い方]。同じ文字の節を何度見ても結果が変わらないもの（新しい言い方に、もとの言い方を含めない）だけ
    const TEAM_WORDS: [RegExp, string][] = [
        [/（同期サーバーの更新の後に使えます）/g, ""],
        [/（同期サーバーの更新の後に出ます）/g, ""],
        [/メンバーの台帳には未登録/g, "メンバーの一覧には、まだ入っていません"],
        [/台帳には未登録/g, "メンバーの一覧には、まだ入っていません"],
        [/台帳に登録/g, "一覧に登録済み"],
        [/（Ver\.1 と同じく、引き継いでから外す流れ）/g, ""],
        [/（同期サーバー・新しい順）/g, "（新しい順）"],
        [/同期サーバーがまだ新しい版になっていないため、使えません（管理者にご連絡ください）/g, "この機能は、いま準備中です（お急ぎのときは STANDAGE の担当者へご連絡ください）"]
    ];
    const SRCS_WORDS: [RegExp, string][] = [
        [/左から追加するか/g, "上の「ソースを追加」から追加するか"]
    ];
    const SRCS_WORDS_RD: [RegExp, string][] = [
        [/「貿易実務・書類・出荷 › この案件の書類」/g, "「すべての機能 › 物流・出荷 › この案件の書類」"]
    ];
    const NOTI_WORDS: [RegExp, string][] = [
        [/（このデモはブラウザ内通知）/g, "（いまは、このブラウザの中の通知だけです）"],
        [/（同期サーバー v[0-9.]+）/g, ""]
    ];
    function reword(root: any, table: [RegExp, string][]) {
        if (!root)
            return;
        try {
            const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            const hits: any[] = [];
            let n: any;
            while ((n = tw.nextNode())) {
                const v = n.nodeValue;
                if (!v || v.length < 4)
                    continue;
                for (const [re] of table) {
                    re.lastIndex = 0;
                    if (re.test(v)) {
                        hits.push(n);
                        break;
                    }
                }
            }
            hits.forEach(x => { let v = x.nodeValue; table.forEach(([re, to]) => { re.lastIndex = 0; v = v.replace(re, to); }); if (v !== x.nodeValue) x.nodeValue = v; });
        }
        catch (e) { }
    }
    // メンバーの画面：入り方の説明をそろえる（体験用・デモ用のコードで入っているあいだは、招待状のとおり アクセスコード＋氏名）
    function teamLoginNote(root: any) {
        try {
            if (!root || !(typeof SES !== "undefined" && SES && SES.t === "trial"))
                return;
            const ps = Array.prototype.slice.call(root.querySelectorAll("p, li, div")) as any[];
            const p = ps.find(x => x.children.length <= 6 && /招待したメンバーは、\s*メールアドレス＋パスワード\s*でログインします/.test((x.textContent || "").replace(/\s+/g, " ")));
            if (!p || (p.nextElementSibling && p.nextElementSibling.classList.contains("v92e-note")) || p.querySelector(".v92e-note"))
                return;
            const d = document.createElement("p");
            d.className = "v92e-note";
            d.textContent = M("いまのこの環境（体験用・デモ用のアクセスコードでログインしている環境）では、招待したメンバーも、招待状のとおり「アクセスコード＋ご本人の氏名」でログインします。上の「メールアドレス＋パスワード」は、ご契約のアカウントでの入り方です。",
                "In this environment (signed in with a trial / demo access code), invited members also sign in with the access code and their own name, as written in the invitation. “Email + password” above is how contract accounts sign in.",
                "在当前环境（使用体验用、演示用访问码登录）中，受邀成员也按邀请函所写，用“访问码＋本人姓名”登录。上述“邮箱＋密码”是签约账号的登录方式。",
                "En este entorno (con código de acceso de prueba / demo), los miembros invitados también entran con el código de acceso y su nombre, como indica la invitación. «Correo + contraseña» es para las cuentas con contrato.");
            d.setAttribute("data-noi18n", "1");
            p.insertAdjacentElement("afterend", d);
        }
        catch (e) { }
    }
    // 用語集：見つからないときに、その言葉を AI商社マンに聞くボタン
    function glossAsk(root: any) {
        try {
            if (!root)
                return;
            const fab = document.getElementById("askfab") as any;
            const els = Array.prototype.slice.call(root.querySelectorAll("p, div, td, li")) as any[];
            const p = els.find(x => x.children.length <= 2 && /見つかりませんでした/.test(x.textContent || "") && /AIに聞く/.test(x.textContent || "") && (x.textContent || "").length < 160);
            const old = root.querySelector(".v92e-askbtn");
            if (!p) {
                if (old)
                    old.remove();
                return;
            }
            if (old || !fab || fab.dataset.act !== "dw")
                return;
            const inp = (root.querySelector("input[type=search], input[type=text], input:not([type])") as any);
            const b = document.createElement("button");
            b.type = "button";
            b.className = "btn v92e-askbtn";
            b.setAttribute("data-noi18n", "1");
            b.textContent = M("この言葉を AI商社マンに聞く", "Ask the AI about this word", "向 AI 询问这个词", "Preguntar a la IA por esta palabra");
            b.addEventListener("click", () => {
                try {
                    const w = String((inp && inp.value) || "").trim();
                    fab.click();
                    setTimeout(() => { const ta = document.getElementById("dwq") as any; if (ta) { ta.value = w ? M(`「${w}」とは何ですか？`, `What does “${w}” mean?`, `“${w}”是什么意思？`, `¿Qué significa «${w}»?`) : ""; try { ta.dispatchEvent(new Event("input", { bubbles: true })); ta.focus(); } catch (e) { } } }, 400);
                }
                catch (e) { }
            });
            p.insertAdjacentElement("afterend", b);
        }
        catch (e) { }
    }
    let fixT: any = 0;
    function fixScreen() {
        try {
            const well = document.getElementById("well");
            const c = (typeof cur !== "undefined") ? String(cur) : "";
            if (well) {
                if (c === "team" || c === "fteam") {
                    reword(well, TEAM_WORDS);
                    teamLoginNote(well);
                }
                if (c === "srcs") {
                    reword(well, SRCS_WORDS);
                    if (isRd())
                        reword(well, SRCS_WORDS_RD);
                }
                if (c === "gloss")
                    glossAsk(well);
            }
            const pn = document.getElementById("pn");
            if (pn && vis(pn)) {
                reword(pn, TEAM_WORDS);
                reword(pn, NOTI_WORDS);
                teamLoginNote(pn);
                inviteErr();
                contactScreen();
            }
            // 「？」の吹き出し・通知の設定など、body の直下に出る小さな窓
            Array.prototype.slice.call(document.querySelectorAll("body > [role=dialog], body > .pop, body > .uxpop, body > [role=tooltip], body > [class*=pop]")).forEach((x: any) => { if (vis(x) && (x.textContent || "").length < 3000) { reword(x, TEAM_WORDS); reword(x, NOTI_WORDS); } });
            gateNote();
        }
        catch (e) { }
    }
    const fixSoon = () => { if (fixT) return; fixT = setTimeout(() => { fixT = 0; fixScreen(); }, 60); };
    // 招待の入力の誤り：欄へ送る（xlogin-28）
    function inviteErr() {
        try {
            const e = document.getElementById("tmErr") as any;
            if (!e)
                return;
            const t = !e.hidden ? String(e.textContent || "").trim() : "";
            const mark = (id: string, on: boolean) => { const f = document.getElementById(id) as any; if (f) { f.classList.toggle("v92e-bad", on); if (on) f.setAttribute("aria-invalid", "true"); else f.removeAttribute("aria-invalid"); } return f; };
            const nameBad = /氏名|登録されています|代表の方と同じ/.test(t), mailBad = /メールアドレス/.test(t), bulkBad = /1行に1人|行があります/.test(t);
            const f1 = mark("tmN", !!t && nameBad), f2 = mark("tmM", !!t && mailBad && !bulkBad), f3 = mark("tmBulk", !!t && bulkBad);
            if (t && e.dataset.v92e !== t) {
                e.dataset.v92e = t;
                e.setAttribute("role", "alert");
                e.style.fontSize = "14px";
                e.style.fontWeight = "700";
                const f = (nameBad && f1) || (bulkBad && f3) || (mailBad && f2) || null;
                // 文を、誤りのある欄のすぐ下へ（欄が無いときは、見える位置へ送るだけ）
                if (f && f.parentElement && e.previousElementSibling !== f) {
                    try { f.insertAdjacentElement("afterend", e); } catch (x) { }
                }
                try { if (f) f.focus({ preventScroll: true }); } catch (x) { }
                try { e.scrollIntoView({ block: "center" }); } catch (x) { }
            }
            if (!t)
                delete e.dataset.v92e;
        }
        catch (e) { }
    }
    // お問い合わせの窓の「どの画面で」：刷新版では、いまのメニューの名前に（xlogin-15 の一部）
    function contactScreen() {
        try {
            const f = document.getElementById("s30tp") as any;
            if (!f || f.dataset.v92e || !isRd())
                return;
            f.dataset.v92e = "1";
            const nm = typeof W.v92entryRdName === "function" ? W.v92entryRdName() : "";
            if (nm)
                f.value = nm;
        }
        catch (e) { }
    }
    // 登録メニュー：商品が無いあいだ、ほかの画面が開けない理由を書く（xlogin-07）
    function gateNote() {
        try {
            const ov = document.getElementById("v1811ov");
            if (!ov || !vis(ov))
                return;
            const none = !(typeof TENS !== "undefined" && Array.isArray(TENS) && TENS.length > 0);
            let n = ov.querySelector(".v92e-gate") as any;
            if (!none) {
                if (n)
                    n.remove();
                return;
            }
            if (!n) {
                const h = ov.querySelector("h1, h2, h3, .ttl, b");
                if (!h)
                    return;
                n = document.createElement("p");
                n.className = "v92e-gate";
                n.setAttribute("data-noi18n", "1");
                n.textContent = M("商品を1つ登録する（または「サンプルで試す」）と、案件・タスク・やりとり・AI商社マンなどの画面が使えるようになります。それまでは、どのメニューを押してもこの登録の画面に戻ります。",
                    "Once you register one product (or choose “Try a sample”), the Deals, Tasks, Messages and AI screens become available. Until then, every menu returns to this registration screen.",
                    "登记一个商品（或选择“用示例试用”）后，即可使用案件、任务、往来、AI 等页面。在此之前，点击任何菜单都会回到此登记页面。",
                    "Cuando registre un producto (o elija «Probar con un ejemplo»), podrá usar Casos, Tareas, Mensajes y la IA. Hasta entonces, cualquier menú vuelve a esta pantalla de registro.");
                const host = (h.closest("header") || h) as any;
                host.insertAdjacentElement("afterend", n);
            }
            // 「閉じる（このまま画面を見る）」は、見られるのが登録の画面だけなので、その名前に
            Array.prototype.slice.call(ov.querySelectorAll("button")).forEach((b: any) => { if ((b.textContent || "").trim() === "閉じる（このまま画面を見る）") b.textContent = M("閉じる（登録の画面を見る）", "Close (view the registration screen)", "关闭（查看登记页面）", "Cerrar (ver la pantalla de registro)"); });
        }
        catch (e) { }
    }
    try {
        const startFix = () => {
            const mo = new MutationObserver(() => fixSoon());
            const well = document.getElementById("well"), pn = document.getElementById("pn");
            if (well)
                mo.observe(well, { childList: true, subtree: true });
            if (pn)
                mo.observe(pn, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
            mo.observe(document.body, { childList: true });
            fixSoon();
        };
        if (document.readyState === "loading")
            document.addEventListener("DOMContentLoaded", startFix);
        else
            startFix();
    }
    catch (e) { }
    if (typeof render === "function") {
        const __rn92e = render;
        render = function (this: any) { const r = __rn92e.apply(this, arguments as any); try { fixSoon(); } catch (e) { } return r; };
    }
    if (typeof openDW === "function") {
        const __od92e = openDW;
        openDW = function (this: any) { const r = __od92e.apply(this, arguments as any); try { fixSoon(); } catch (e) { } return r; };
    }

    /* ───── ログアウトしたことの知らせ（xlogin-22） ───── */
    // ほかの層がクリックを途中で止めるので、押し始め（pointerdown・mousedown）と Enter でも覚える。
    // 途中でページを読み直し、端末の控えも消すことがあるので、このタブの名前（window.name）にも印を残して、ログインの画面で読む
    const loMark = (ev: any) => {
        try {
            const t: any = ev.target;
            if (!t || !t.closest || !t.closest("#lgout"))
                return;
            if (ev.type === "keydown" && ev.key !== "Enter" && ev.key !== " ")
                return;
            const now = String(Date.now());
            W.__v92eLo = +now;
            try { sessionStorage.setItem("v92e_lo", now); } catch (e) { }
            try { if (!window.name || /^v92e_lo=\d+$/.test(window.name)) window.name = "v92e_lo=" + now; } catch (e) { }
        }
        catch (e) { }
    };
    ["pointerdown", "mousedown", "click", "keydown"].forEach(k => document.addEventListener(k, loMark, true));
})();
