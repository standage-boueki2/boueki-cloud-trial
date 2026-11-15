/* 21.92 admin：管理者（STANDAGE の運用担当）の画面の直し（xi18n-84〜92）
   84 一覧の並べ替え：日付の列は日付で、コードの列は文字で比べる（前は「文字の中の最初の数字」で比べていた）
   85 「期限を +14日」は押す前に確かめる／期限の日付を入れ直せる欄（短くする・戻す）を詳細に足す
   86 「今すぐ配信」は押す前に確かめる／サーバーを呼ぶボタンは、押したあと「何を・いつ・どうなったか」を必ず書く
   87 「個社版／全社版」の切り替えは確かめてから
   88 削除の確認を、会社名つきの専用の窓にする
   89 STANDAGE 社員のアカウントに札・絞り込み・CSV の種類・集計の但し書き
   90 一覧の所に「この一覧を CSV に書き出す」／何でも検索でアカウント（会社名・コード・担当）を探せる
   91 「控えたの数」・絞り込みの欄の幅
   92 英語にしたとき日本語のまま残る文の訳
   今の処理（保存・サーバーへ送る中身）は変えない。確認で「はい」のときだけ元のボタンをもう一度押す形で包む。 */
declare const SES: any, ADB: any, I18N: any, V70ADM: any;
declare let v56uiOverlay: any, uxSort: any, uxPalItems: any, v33Csv: any, admDetail: any, renderAdmin: any, poolAdmHtml: any, toast: any, v801fAL: any;
declare const findAcct: any, asave: any, closeDW: any, v70admAskBox: any, v33AdmCsvUse: any, i18nApply: any;
(function () {
    const W: any = window;
    if (W.__v2192admin) return;
    W.__v2192admin = 1;
    const DAYMS = 864e5;
    const isAdm = () => { try { return typeof SES !== "undefined" && !!SES && SES.t === "admin"; } catch (e) { return false; } };
    const lang = () => { try { return String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja"); } catch (e) { return "ja"; } };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const say = (m: string) => { try { if (typeof toast === "function") toast(m); } catch (e) { } };
    const acctOf = (code: any) => { try { return typeof findAcct === "function" ? findAcct(String(code || "")) : null; } catch (e) { return null; } };
    const accts = (): any[] => { try { return (typeof ADB !== "undefined" && ADB && ADB.accounts) || []; } catch (e) { return []; } };
    const ymd = (t: number) => { const d = new Date(+t || 0); return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate(); };
    const hms = (t: number) => { const d = new Date(t); const p = (n: number) => String(n).padStart(2, "0"); return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds()); };
    const coName = (a: any) => String((a && a.co) || "").replace(/^（(無効化した例|見本)）\s*/, "") || String((a && a.code) || "");
    let detCode = "";

    /* ---- 文言（英語ほか） ---- */
    try {
        const rows: string[][] = [
            ["社員", "Staff", "员工", "Personal"],
            ["🏢 社員", "🏢 Staff", "🏢 员工", "🏢 Personal"],
            ["社員（商社デスク）", "Staff (trading desk)", "员工（商社服务台）", "Personal (mesa comercial)"],
            ["この一覧を CSV に書き出す", "Export this list (CSV)", "将此列表导出为 CSV", "Exportar esta lista (CSV)"],
            ["重要なお知らせ・対応が必要な項目", "Important notices and items that need action", "重要通知・需要处理的事项", "Avisos importantes y pendientes"],
            ["アカウントの状況", "Account status", "账户状况", "Estado de las cuentas"],
            ["● うち物流会社", "● Of which forwarders", "● 其中物流公司", "● De las cuales transitarios"],
            ["うち物流会社", "Of which forwarders", "其中物流公司", "De las cuales transitarios"],
            ["アカウント一覧へ", "Go to the account list", "前往账户列表", "Ir a la lista de cuentas"],
            ["クイック操作", "Quick actions", "快捷操作", "Acciones rápidas"],
            ["同期・端末を確かめる", "Check sync and devices", "确认同步・终端", "Comprobar sincronización y dispositivos"],
            ["利用内訳", "Usage breakdown", "使用明细", "Desglose de uso"],
            ["（累計・全アカウント。日ごとの推移は「利用とコスト」）", "(Cumulative, all accounts. Daily trends are under “Usage and cost”)", "（累计・全部账户。每日变化见“使用与成本”）", "(Acumulado, todas las cuentas. La evolución diaria está en «Uso y coste»)"],
            ["まだ利用の記録がありません", "No usage recorded yet", "尚无使用记录", "Aún no hay registros de uso"],
            ["企業・担当者の入力", "Company and contact", "填写企业・负责人", "Empresa y contacto"],
            ["アカウント種別・プラン・期間", "Account type, plan and period", "账户类型・方案・期间", "Tipo de cuenta, plan y periodo"],
            ["荷主／物流会社／STANDAGE 社員・個社版／全社版・日数", "Shipper / forwarder / STANDAGE staff · company-only / all-company · days", "货主／物流公司／STANDAGE 员工・单独版／全公司版・天数", "Cargador / transitario / personal de STANDAGE · solo empresa / toda la red · días"],
            ["表は横に動かせます（表の下のつまみ・Shift＋ホイール・トラックパッドの横スワイプ）。右端の「無効化」「詳細」はいつも見えています。", "The table scrolls sideways (the bar under the table, Shift + wheel, or a sideways swipe). “Deactivate” and “Details” at the right edge are always visible.", "表格可以横向滚动（表格下方的滑块・Shift＋滚轮・触控板横向滑动）。右端的“停用”“详情”始终可见。", "La tabla se desplaza en horizontal (barra inferior, Mayús + rueda o deslizamiento lateral). «Desactivar» y «Detalles», a la derecha, siempre están visibles."],
            ["STANDAGE 管理者", "STANDAGE admin", "STANDAGE 管理员", "Administrador de STANDAGE"],
            ["やめる", "Cancel", "取消", "Cancelar"],
        ];
        if (typeof I18N !== "undefined" && I18N && I18N.dict) {
            rows.forEach((r) => { ["en", "zh", "es"].forEach((l, i) => { const d = I18N.dict[l]; if (d && r[i + 1] && !d[r[0]]) d[r[0]] = r[i + 1]; }); });
        }
        if (typeof I18N !== "undefined" && I18N && Array.isArray(I18N.pat)) {
            [
                { re: /^(\d+)件あります。押すと、その一覧へ移ります。$/, en: "$1 item(s). Press to go to that list.", zh: "有 $1 件。按下后前往该列表。", es: "$1 elemento(s). Pulse para ir a la lista." },
                { re: /^(\d+)／(\d+)字$/, en: "$1 / $2 characters", zh: "$1／$2 字", es: "$1 / $2 caracteres" },
                { re: /^（招待の行の数。同じ方が複数のアカウントにいると別に数えます・実人数 (\d+)名）$/, en: "(Number of invitation rows. The same person in several accounts is counted separately · $1 unique people)", zh: "（邀请行数。同一人在多个账户中会分别计数・实际人数 $1 名）", es: "(Número de filas de invitación. La misma persona en varias cuentas se cuenta por separado · $1 personas únicas)" },
                { re: /^版 ([\d.]+)（build (\w+)）$/, en: "Version $1 (build $2)", zh: "版本 $1（build $2）", es: "Versión $1 (build $2)" },
            ].forEach((p) => I18N.pat.unshift(p));
        }
    } catch (e) { }

    /* ---- 見た目（足した部品だけ） ---- */
    try {
        const st = document.createElement("style");
        st.id = "v92admcss";
        st.textContent = `
#acq{min-width:min(270px,100%)!important}
.v92adm-exp{margin-top:12px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface-2,transparent)}
.v92adm-exp label{display:block;font-size:12px;font-weight:700;margin-bottom:6px}
.v92adm-exp .rw{gap:6px;flex-wrap:wrap;align-items:center}
.v92adm-exp input[type=date]{min-height:32px;font-size:13px}
.v92adm-exp p{font-size:11.5px;line-height:1.7;margin:6px 0 0;color:var(--ink-2,inherit)}
.v92adm-res{font-size:12.5px;line-height:1.7;margin:0 0 4px;font-weight:700;overflow-wrap:anywhere}
.v92adm-res.ng{color:var(--crit)}
.v92adm-hint{font-size:12px;line-height:1.7;margin:4px 0 0;overflow-wrap:anywhere}
.v92adm-stg{margin-left:4px;white-space:nowrap}
`;
        (document.head || document.documentElement).appendChild(st);
    } catch (e) { }

    /* ---- 確認の窓（管理コンソールの「無効化」と同じ窓を使う。無い版ではブラウザの確認） ---- */
    const ask = (o: { title: string, lines: string[], go: string, danger?: boolean }): Promise<boolean> => {
        try {
            if (typeof v70admAskBox === "function") return v70admAskBox(o);
        } catch (e) { }
        return Promise.resolve(window.confirm([o.title].concat(o.lines.filter(Boolean)).join("\n")));
    };
    let asking = 0;
    const syncNote = () => M("この変更は、同期サーバーにつながっていれば台帳にすぐ送られ、ほかの端末の管理コンソールにも届きます。", "If the sync server is connected, this change is sent to the ledger right away and reaches the admin console on other devices.", "若已连接同步服务器，此更改会立即发送到台账，并同步到其他终端的管理控制台。", "Si el servidor de sincronización está conectado, el cambio se envía al registro de inmediato y llega a la consola en otros dispositivos.");

    /* 85・86・88：押す前に確かめる（「はい」のときだけ、元のボタンをもう一度押す） */
    document.addEventListener("click", (e: any) => {
        try {
            const b = e.target && e.target.closest && e.target.closest("#dw-ext,#dw-del,#digRun");
            if (!b || b.__v92ok || !isAdm()) return;
            let o: any = null, after: any = null, pre: any = null;
            if (b.id === "digRun") {
                if (b.disabled) return;
                let n = -1;
                try { const tb = document.querySelector("#digOut table tbody"); if (tb) n = tb.querySelectorAll("tr .p.hi").length; } catch (x) { }
                o = {
                    title: M("日次ダイジェストのメールを、いますぐ配信しますか？", "Send the daily digest email now?", "要立即发送每日摘要邮件吗？", "¿Enviar ahora el correo del resumen diario?"),
                    lines: [
                        M("メール通知を「有効」にしているお客様へ、同期サーバーからメールを送ります（ふだんは毎朝8時の自動配信です）。", "The sync server emails every customer whose email notification is on (normally this runs automatically at 8:00 every morning).", "同步服务器将向已开启邮件通知的客户发送邮件（平时每天早上8点自动发送）。", "El servidor enviará el correo a los clientes con la notificación activada (normalmente se envía solo a las 8:00)."),
                        n >= 0 ? M("直前に取得した配信状況では、「有効」の宛先は " + n + " 件です。", "In the delivery status you just loaded, " + n + " recipient(s) are active.", "根据刚获取的发送状态，“有效”的收件方为 " + n + " 个。", "Según el estado recién cargado, hay " + n + " destinatario(s) activos.")
                            : M("宛先と件数は、先に「配信状況を取得」を押すと確かめられます。", "Press “Get delivery status” first to check the recipients and their number.", "先按“获取发送状态”可确认收件方和数量。", "Pulse antes «Obtener estado de envío» para comprobar los destinatarios."),
                        M("送ったメールは取り消せません。", "Emails cannot be recalled once sent.", "邮件发出后无法撤回。", "Los correos enviados no se pueden cancelar."),
                    ],
                    go: M("いますぐ配信する", "Send now", "立即发送", "Enviar ahora"),
                };
            } else {
                const a = acctOf(detCode || ((typeof V70ADM !== "undefined" && V70ADM && V70ADM.detCode) || ""));
                if (!a) return;
                if (b.id === "dw-ext") {
                    const from = +a.expires || 0, to = Math.max(from, Date.now()) + 14 * DAYMS;
                    o = {
                        title: M("「" + coName(a) + "」（" + a.code + "）の期限を14日延ばしますか？", "Extend the expiry of “" + coName(a) + "” (" + a.code + ") by 14 days?", "要将“" + coName(a) + "”（" + a.code + "）的期限延长14天吗？", "¿Ampliar 14 días el vencimiento de «" + coName(a) + "» (" + a.code + ")?"),
                        lines: [
                            M("期限：" + ymd(from) + " → " + ymd(to), "Expiry: " + ymd(from) + " → " + ymd(to), "期限：" + ymd(from) + " → " + ymd(to), "Vencimiento: " + ymd(from) + " → " + ymd(to)) + (from < Date.now() ? M("（期限が過ぎているため、今日から14日後になります）", " (already expired, so it becomes 14 days from today)", "（已过期，因此为今天起14天后）", " (ya vencida: pasa a 14 días desde hoy)") : ""),
                            M("押し間違えたときは、「詳細」の「期限の日付を変える」で元の日付に戻せます。", "If you pressed it by mistake, you can set the date back under “Change the expiry date” in Details.", "若按错，可在“详情”的“更改期限日期”中改回原日期。", "Si se equivoca, puede restablecer la fecha en «Cambiar la fecha de vencimiento» en Detalles."),
                            syncNote(),
                        ],
                        go: M("14日延ばす", "Extend 14 days", "延长14天", "Ampliar 14 días"),
                    };
                    after = () => say(M("期限を14日延長しました（" + ymd(from) + " → " + ymd(to) + "）。戻すときは「詳細」の「期限の日付を変える」から。", "Expiry extended by 14 days (" + ymd(from) + " → " + ymd(to) + "). To undo, use “Change the expiry date” in Details.", "期限已延长14天（" + ymd(from) + " → " + ymd(to) + "）。如需改回，请在“详情”的“更改期限日期”中操作。", "Vencimiento ampliado 14 días (" + ymd(from) + " → " + ymd(to) + "). Para deshacer, use «Cambiar la fecha de vencimiento» en Detalles."));
                } else {
                    o = {
                        title: M("「" + coName(a) + "」（" + a.code + "）を削除しますか？", "Delete “" + coName(a) + "” (" + a.code + ")?", "要删除“" + coName(a) + "”（" + a.code + "）吗？", "¿Eliminar «" + coName(a) + "» (" + a.code + ")?"),
                        lines: [
                            M("台帳（アカウント一覧）から、このアカウントを消します。", "This removes the account from the ledger (the account list).", "将从台账（账户列表）中删除此账户。", "La cuenta se quitará del registro (lista de cuentas)."),
                            M("30日以内なら「期限切れ・削除」から元に戻せます（この端末に控えた利用の記録は戻りません）。", "Within 30 days you can restore it from “Expired / deleted” (usage records kept on this device are not restored).", "30天内可从“过期・删除”中恢复（保存在本终端的使用记录不会恢复）。", "En 30 días puede restaurarla desde «Vencidas / eliminadas» (los registros de uso guardados en este dispositivo no se recuperan)."),
                            M("ログインを止めるだけなら、削除ではなく「無効化する」を使えます。", "To only stop sign-in, use “Deactivate” instead of deleting.", "若只想停止登录，可使用“停用”而不是删除。", "Si solo quiere impedir el acceso, use «Desactivar» en lugar de eliminar."),
                        ],
                        go: M("削除する", "Delete", "删除", "Eliminar"), danger: true,
                    };
                    pre = () => { const oc = window.confirm; window.confirm = () => true; return () => { window.confirm = oc; }; };
                }
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            if (asking) return;
            asking = 1;
            ask(o).then((ok) => {
                asking = 0;
                if (!ok || !document.body.contains(b)) return;
                let undo: any = null;
                b.__v92ok = 1;
                try { if (pre) undo = pre(); b.click(); } finally { b.__v92ok = 0; if (undo) undo(); }
                try { if (after) after(); } catch (x) { }
            }, () => { asking = 0; });
        } catch (x) { }
    }, true);

    /* 確認の窓で Esc を押したとき、後ろの詳細の窓まで一緒に閉じないようにする（「やめる」と同じ扱い） */
    window.addEventListener("keydown", (e: any) => {
        try {
            if (e.key !== "Escape") return;
            const no: any = document.getElementById("v70admAskNo");
            if (!no || !document.getElementById("v70admAsk")) return;
            e.preventDefault(); e.stopImmediatePropagation();
            no.click();
        } catch (x) { }
    }, true);

    /* 詳細の窓の「Esc で閉じる」は、確認の窓が出ている間は効かせない（今の判定 v56uiOverlay に、確認の窓を足す） */
    if (typeof v56uiOverlay === "function") {
        const __ov92 = v56uiOverlay;
        v56uiOverlay = function (this: any) { try { if (document.getElementById("v70admAsk")) return true; } catch (e) { } return __ov92.apply(this, arguments as any); };
    }

    /* 87：個社版／全社版の切り替えは確かめてから */
    document.addEventListener("change", (e: any) => {
        try {
            const s = e.target;
            if (!s || !s.matches || !s.matches("select[data-poolsel]") || s.__v92ok || !isAdm()) return;
            const a = acctOf(s.dataset.poolsel);
            if (!a) return;
            const prev = a.aiMode === "all" ? "all" : "solo", next = s.value === "all" ? "all" : "solo";
            if (prev === next) return;
            e.stopImmediatePropagation();
            const nm = (m: string) => m === "all" ? M("全社版", "All-company", "全公司版", "toda la red") : M("個社版", "Company-only", "单独版", "solo empresa");
            ask({
                title: M("「" + coName(a) + "」の AI商社マンを「" + nm(next) + "」に切り替えますか？", "Switch the AI for “" + coName(a) + "” to “" + nm(next) + "”?", "要将“" + coName(a) + "”的 AI 切换为“" + nm(next) + "”吗？", "¿Cambiar la IA de «" + coName(a) + "» a «" + nm(next) + "»?"),
                lines: [
                    M("いまは「" + nm(prev) + "」です。", "It is currently “" + nm(prev) + "”.", "当前为“" + nm(prev) + "”。", "Ahora es «" + nm(prev) + "»."),
                    next === "all"
                        ? M("全社版：自社データに加えて、貿易クラウド Ver1.0 と AI商社マンの全ユーザーの、匿名化された一次情報も学びます（社名・商品名は開示しません）。", "All-company: besides the company's own data, the AI also learns from anonymised first-hand information of all users of Boueki Cloud Ver1.0 and the AI (company and product names are not disclosed).", "全公司版：除本公司数据外，还学习贸易云 Ver1.0 和 AI 全体用户的匿名一手信息（不公开公司名・商品名）。", "Toda la red: además de los datos propios, aprende de información anónima de todos los usuarios (no se revelan nombres de empresa ni de producto).")
                        : M("個社版：自社データと、Web・統計・規制だけを学びます。", "Company-only: the AI learns only from the company's own data plus web, statistics and regulations.", "单独版：只学习本公司数据以及网络・统计・法规。", "Solo empresa: aprende solo de los datos propios y de web, estadísticas y normativa."),
                    syncNote(),
                ],
                go: M("切り替える", "Switch", "切换", "Cambiar"),
            }).then((ok) => {
                if (!document.body.contains(s)) return;
                if (!ok) { s.value = prev; return; }
                s.__v92ok = 1;
                try { s.value = next; s.dispatchEvent(new Event("change", { bubbles: true })); } finally { s.__v92ok = 0; }
            });
        } catch (x) { }
    }, true);

    /* 86：サーバーを呼ぶボタンは、押したあと「何を・いつ・どうなったか」を結果の欄の頭に必ず書く */
    const OUT: any = { synctest: "syncout", syncpush: "syncout", syncget: "syncout", digStat: "digOut", digSetup: "digOut", digRun: "digOut" };
    function watch(btn: any, outId: string) {
        const out: any = document.getElementById(outId);
        if (!out) return;
        const label = String(btn.textContent || "").replace(/\s+/g, " ").trim();
        const t0 = Date.now();
        try { if (out.__v92mo) out.__v92mo.disconnect(); clearTimeout(out.__v92t); } catch (e) { }
        try { out.setAttribute("role", "status"); out.setAttribute("aria-live", "polite"); } catch (e) { }
        let told = "";
        const paint = (late?: boolean) => {
            try {
                const main = Array.from(out.children).filter((c: any) => !(c.classList && (c.classList.contains("v92adm-res") || c.classList.contains("v92adm-hint"))));
                const txt = main.map((c: any) => c.textContent || "").join(" ").trim();
                const st = !txt ? "none" : /✕/.test(txt) ? "ng" : /✓/.test(txt) ? "ok" : (/…\s*(（[^）]*）)?\s*$/.test(txt) && txt.length < 60) ? "run" : "ok";
                const key = st + "|" + (late ? 1 : 0) + "|" + txt.slice(0, 80);
                const cur = out.querySelector(".v92adm-res");
                if (cur && cur.getAttribute("data-k") === key && out.firstElementChild === cur) return;
                out.querySelectorAll(".v92adm-res,.v92adm-hint").forEach((x: any) => x.remove());
                const at = hms(t0);
                let head = "", hint = "";
                if (st === "run" || st === "none") {
                    head = late
                        ? M("「" + label + "」：" + at + " に押しましたが、まだサーバーの答えがありません。", "“" + label + "”: pressed at " + at + ", but the server has not answered yet.", "“" + label + "”：" + at + " 已按下，但服务器尚未应答。", "«" + label + "»: pulsado a las " + at + ", pero el servidor aún no responde.")
                        : M("「" + label + "」を実行しています…（" + at + " に押しました）", "Running “" + label + "”… (pressed at " + at + ")", "正在执行“" + label + "”…（" + at + " 按下）", "Ejecutando «" + label + "»… (pulsado a las " + at + ")");
                    if (late) hint = M("通信に時間がかかっています。このまま待つか、「接続テスト」で同期サーバーにつながるかを確かめてください。", "The connection is slow. Keep waiting, or press “Test connection” to check that the sync server is reachable.", "通信耗时较长。请继续等待，或用“连接测试”确认能否连接同步服务器。", "La conexión es lenta. Espere o pulse «Prueba de conexión» para comprobar el servidor.");
                } else if (st === "ok") {
                    head = M("「" + label + "」の結果（" + at + " に実行）：", "Result of “" + label + "” (run at " + at + "):", "“" + label + "”的结果（" + at + " 执行）：", "Resultado de «" + label + "» (a las " + at + "):");
                } else {
                    head = M("「" + label + "」は、完了を確かめられませんでした（" + at + " に実行）。サーバーの答え：", "“" + label + "” could not be confirmed as completed (run at " + at + "). Server reply:", "“" + label + "”未能确认完成（" + at + " 执行）。服务器的应答：", "No se pudo confirmar «" + label + "» (a las " + at + "). Respuesta del servidor:");
                    hint = M("同期サーバーがこの操作に応じませんでした。少し待ってもう一度押すか、「接続テスト」でサーバーにつながるか・版が合っているかを確かめてください。", "The sync server did not accept this operation. Wait a little and press again, or use “Test connection” to check the connection and the server version.", "同步服务器未受理此操作。请稍候再按，或用“连接测试”确认连接和服务器版本。", "El servidor no aceptó la operación. Espere y vuelva a pulsar, o use «Prueba de conexión» para comprobar la conexión y la versión.")
                        + (btn.id === "digRun" ? M("メールが送られたかどうかは、「配信状況を取得」の「最終送信」で確かめられます。", " Whether emails went out can be checked under “Last sent” in “Get delivery status”.", "邮件是否已发送，可在“获取发送状态”的“最后发送”中确认。", " Puede comprobar si se enviaron en «Último envío» de «Obtener estado de envío».") : "");
                }
                const p = document.createElement("p");
                p.className = "v92adm-res" + (st === "ng" ? " ng" : "");
                p.setAttribute("data-k", key); p.setAttribute("data-noi18n", "");
                p.textContent = head;
                out.insertBefore(p, out.firstChild);
                if (hint) { const h = document.createElement("p"); h.className = "nn v92adm-hint"; h.setAttribute("data-noi18n", ""); h.textContent = hint; out.appendChild(h); }
                if ((st === "ok" || st === "ng") && told !== st) {
                    told = st;
                    say(st === "ok" ? M("「" + label + "」が終わりました。結果はボタンの下に出ています。", "“" + label + "” finished. The result is shown under the button.", "“" + label + "”已完成。结果显示在按钮下方。", "«" + label + "» ha terminado. El resultado está bajo el botón.")
                        : M("「" + label + "」は完了を確かめられませんでした。理由はボタンの下に出ています。", "“" + label + "” could not be confirmed. The reason is shown under the button.", "“" + label + "”未能确认完成。原因显示在按钮下方。", "No se pudo confirmar «" + label + "». El motivo está bajo el botón."));
                    try { out.scrollIntoView({ block: "nearest" }); } catch (x) { }
                }
            } catch (x) { }
        };
        try {
            const mo = new MutationObserver(() => paint());
            mo.observe(out, { childList: true });
            out.__v92mo = mo;
            out.__v92t = setTimeout(() => { paint(true); }, 15000);
            setTimeout(() => { try { mo.disconnect(); } catch (x) { } }, 120000);
        } catch (e) { }
        setTimeout(() => paint(), 0);
    }
    document.addEventListener("click", (e: any) => {
        try {
            const b = e.target && e.target.closest && e.target.closest("button[id]");
            if (!b || !OUT[b.id] || b.disabled || !isAdm()) return;
            watch(b, OUT[b.id]);
        } catch (x) { }
    }, false);

    /* 84：並べ替え。日付の列は日付で、コードの列は文字で比べる */
    const dateKey = (s: string): number | null => {
        const m = String(s || "").match(/^\s*(\d{4})\s*[\/\-.年]\s*(\d{1,2})\s*[\/\-.月]\s*(\d{1,2})(?:日)?(?:\s+(\d{1,2}):(\d{2}))?/);
        if (!m) return null;
        const t = new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)).getTime();
        return isNaN(t) ? null : t;
    };
    const codeKey = (c: any): string | null => {
        if (!c) return null;
        const a = c.querySelector && c.querySelector(".acode");
        const s = String((a ? a.textContent : (c.classList && c.classList.contains("acode") ? c.textContent : "")) || "").trim();
        if (s) return s;
        const m = String(c.textContent || "").trim().match(/^[A-Z]{2,5}-[A-Z0-9]{2,}(?:-[A-Z0-9]+)*/);
        return m ? m[0] : null;
    };
    if (typeof uxSort === "function") {
        const __us92 = uxSort;
        uxSort = function (this: any, th: any) {
            try {
                const t = th.closest("table"), tb = t && t.tBodies[0], idx = Array.from(th.parentNode.cells).indexOf(th);
                const rows: any[] = tb ? Array.from(tb.rows) : [];
                if (tb && idx >= 0 && rows.length > 1 && !rows.every((r) => r.cells[idx] && r.cells[idx].dataset.k != null)) {
                    const need = rows.length * 0.6;
                    const txt = rows.map((r) => String(r.cells[idx] ? r.cells[idx].textContent : "").trim());
                    let keys: any[] | null = null, kind = "";
                    const ds = txt.map(dateKey);
                    if (ds.filter((x) => x != null).length >= need) { keys = ds; kind = "date"; }
                    else {
                        const cs = rows.map((r) => codeKey(r.cells[idx]));
                        if (cs.filter((x) => x != null).length >= need) { keys = cs; kind = "code"; }
                    }
                    if (keys) {
                        // 管理コンソールの一覧の「期限」は、台帳の値（時刻まで）で比べる
                        if (kind === "date" && /期限|Expir|到期|Venc/.test(th.textContent || "")) {
                            rows.forEach((r, i) => { const d = r.querySelector && r.querySelector("[data-det]"); const a = d ? acctOf(d.getAttribute("data-det")) : null; if (a && +a.expires) keys![i] = +a.expires; });
                        }
                        const dir = th.dataset.dir === "asc" ? "desc" : "asc";
                        Array.from(th.parentNode.cells).forEach((c: any) => { delete c.dataset.dir; c.removeAttribute("aria-sort"); });
                        th.dataset.dir = dir;
                        th.setAttribute("aria-sort", dir === "asc" ? "ascending" : "descending");
                        const cmp = (x: any, y: any) => {
                            if (x.k == null && y.k == null) return 0;
                            if (x.k == null) return 1;      // 値の無い行は、昇順でも降順でも最後
                            if (y.k == null) return -1;
                            const c = kind === "date" ? x.k - y.k : (x.k < y.k ? -1 : x.k > y.k ? 1 : 0);
                            return dir === "asc" ? c : -c;
                        };
                        rows.map((r, i) => ({ r, i, k: keys![i] })).sort((x, y) => cmp(x, y) || (x.i - y.i)).forEach((x) => tb.appendChild(x.r));
                        const nm = String(th.textContent || "").trim().slice(0, 12);
                        const how = kind === "date"
                            ? (dir === "asc" ? M("日付の早い順", "earliest first", "日期从早到晚", "de más antigua a más reciente") : M("日付の遅い順", "latest first", "日期从晚到早", "de más reciente a más antigua"))
                            : (dir === "asc" ? M("文字の順（A→Z）", "A → Z", "按字母（A→Z）", "A → Z") : M("文字の逆順（Z→A）", "Z → A", "按字母（Z→A）", "Z → A"));
                        say(M("「" + nm + "」で" + (dir === "asc" ? "昇順" : "降順") + "に並べ替えました（" + how + "）", "Sorted by “" + nm + "” (" + how + ")", "已按“" + nm + "”排序（" + how + "）", "Ordenado por «" + nm + "» (" + how + ")"));
                        return;
                    }
                }
            } catch (e) { }
            return __us92.apply(this, arguments as any);
        };
    }

    /* 91：「控えたの数」→「控えた数」 */
    if (typeof v801fAL === "function") {
        const __al92 = v801fAL;
        v801fAL = function (this: any) {
            let s = __al92.apply(this, arguments as any);
            try { if (typeof s === "string") s = s.replace(/控えたの数/g, "控えた数").replace(/控えた\s*([^。（）]{3,24}?時点)の数/g, "控えた数（$1）"); } catch (e) { }
            return s;
        };
    }

    /* 89：CSV の「種類」に社員／90：いま出ている行だけの書き出し */
    if (typeof v33Csv === "function") {
        const __csv92 = v33Csv;
        v33Csv = function (this: any, rows: any, name: any) {
            try {
                if (Array.isArray(rows) && rows.length && /^admin_usage_/.test(String(name || ""))) {
                    const h = rows[0] || [], ci = h.indexOf("コード"), ki = h.indexOf("種類");
                    if (ci >= 0 && ki >= 0) rows.forEach((r: any, i: number) => { if (!i) return; const a = acctOf(r[ci]); if (a && a.role === "stg" && r[ki] === "荷主") r[ki] = "社員"; });
                    const only = W.__v92admCsvOnly;
                    if (only && ci >= 0) { rows = rows.filter((r: any, i: number) => !i || only[String(r[ci])]); }
                }
            } catch (e) { }
            return __csv92.call(this, rows, name);
        };
    }

    /* 89：AI のタブの集計の但し書き（数は変えず、社員を含むことを書く） */
    if (typeof poolAdmHtml === "function") {
        const __pa92 = poolAdmHtml;
        poolAdmHtml = function (this: any) {
            let h = __pa92.apply(this, arguments as any);
            try {
                const n = accts().filter((a) => a && a.role === "stg").length;
                if (n && typeof h === "string") h = h.replace(/荷主のアカウント (\d+)件 <small class="v90basis">（台帳の行の数・物流会社を除く/, (m0: string, b: string) => `荷主・社員のアカウント ${b}件 <small class="v90basis">（台帳の行の数・うち STANDAGE 社員 ${n}件・物流会社を除く`);
            } catch (e) { }
            return h;
        };
    }

    /* 85：詳細に「期限の日付を変える」（短くする・戻す）。保存は「期限を +14日」と同じ（a.expires を書き、asave → 閉じる → 描き直す） */
    function expBox(code: string) {
        const a = acctOf(code), ext = document.getElementById("dw-ext");
        if (!a || !ext || !isAdm() || document.getElementById("v92admExp")) return;
        const row = ext.parentElement;
        if (!row) return;
        const iso = (t: number) => { const d = new Date(t); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
        const d0 = new Date(+a.expires || Date.now());
        const box = document.createElement("div");
        box.id = "v92admExp"; box.className = "v92adm-exp"; box.setAttribute("data-noi18n", "");
        box.innerHTML = `<label for="v92admExpD">${E(M("期限の日付を変える（短くする・元に戻す）", "Change the expiry date (shorten or set back)", "更改期限日期（缩短・改回）", "Cambiar la fecha de vencimiento (acortar o restablecer)"))}</label>
<div class="rw"><input type="date" class="sel" id="v92admExpD" value="${iso(d0.getTime())}" min="${iso(Date.now())}"><button type="button" class="btn g" id="v92admExpGo">${E(M("この日付にする", "Set this date", "设为此日期", "Fijar esta fecha"))}</button></div>
<p>${E(M("いまの期限：" + ymd(d0.getTime()) + " " + String(d0.getHours()).padStart(2, "0") + ":" + String(d0.getMinutes()).padStart(2, "0") + "。今日より前の日付にはできません（すぐ止めるときは「無効化する」）。", "Current expiry: " + ymd(d0.getTime()) + " " + String(d0.getHours()).padStart(2, "0") + ":" + String(d0.getMinutes()).padStart(2, "0") + ". Dates before today are not allowed (to stop access right away, use “Deactivate”).", "当前期限：" + ymd(d0.getTime()) + "。不能设为今天之前的日期（要立即停止请用“停用”）。", "Vencimiento actual: " + ymd(d0.getTime()) + ". No se admiten fechas anteriores a hoy (para detener el acceso ya, use «Desactivar»)."))}</p>`;
        row.insertAdjacentElement("afterend", box);
        const go: any = box.querySelector("#v92admExpGo"), inp: any = box.querySelector("#v92admExpD");
        go.addEventListener("click", () => {
            try {
                const m = String(inp.value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
                if (!m) { say(M("日付を入れてください。", "Enter a date.", "请输入日期。", "Introduzca una fecha.")); inp.focus(); return; }
                const from = +a.expires || 0, f = new Date(from || Date.now());
                let to = new Date(+m[1], +m[2] - 1, +m[3], f.getHours(), f.getMinutes(), f.getSeconds()).getTime();
                const today = new Date(); const t00 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
                if (to < t00) { say(M("今日より前の日付にはできません。", "Dates before today are not allowed.", "不能设为今天之前的日期。", "No se admiten fechas anteriores a hoy.")); inp.focus(); return; }
                if (to <= Date.now()) to = t00 + DAYMS - 1000;     // 今日を選んだとき：今日の終わりまで
                if (ymd(to) === ymd(from)) { say(M("いまの期限と同じ日付です。", "That is the same date as the current expiry.", "与当前期限为同一日期。", "Es la misma fecha que el vencimiento actual.")); return; }
                const diff = Math.round((new Date(+m[1], +m[2] - 1, +m[3]).getTime() - new Date(f.getFullYear(), f.getMonth(), f.getDate()).getTime()) / DAYMS);
                if (asking) return;
                asking = 1;
                ask({
                    title: M("「" + coName(a) + "」（" + a.code + "）の期限を " + ymd(from) + " → " + ymd(to) + " に変えますか？", "Change the expiry of “" + coName(a) + "” (" + a.code + ") from " + ymd(from) + " to " + ymd(to) + "?", "要将“" + coName(a) + "”（" + a.code + "）的期限由 " + ymd(from) + " 改为 " + ymd(to) + " 吗？", "¿Cambiar el vencimiento de «" + coName(a) + "» (" + a.code + ") de " + ymd(from) + " a " + ymd(to) + "?"),
                    lines: [
                        diff < 0 ? M("期限を " + (-diff) + "日 短くします。", "This shortens the period by " + (-diff) + " day(s).", "期限将缩短 " + (-diff) + " 天。", "Se acorta " + (-diff) + " día(s).") : M("期限を " + diff + "日 延ばします。", "This extends the period by " + diff + " day(s).", "期限将延长 " + diff + " 天。", "Se amplía " + diff + " día(s)."),
                        syncNote(),
                    ],
                    go: M("この日付にする", "Set this date", "设为此日期", "Fijar esta fecha"), danger: diff < 0,
                }).then((ok) => {
                    asking = 0;
                    if (!ok) return;
                    const cur = acctOf(code);
                    if (!cur) return;
                    cur.expires = to;
                    try { if (typeof asave === "function") asave(); } catch (x) { }
                    try { if (typeof closeDW === "function") closeDW(); } catch (x) { }
                    try { if (typeof renderAdmin === "function") renderAdmin(); } catch (x) { }
                    say(M("期限を " + ymd(to) + " に変えました（前は " + ymd(from) + "）。", "Expiry changed to " + ymd(to) + " (was " + ymd(from) + ").", "期限已改为 " + ymd(to) + "（原为 " + ymd(from) + "）。", "Vencimiento cambiado a " + ymd(to) + " (antes " + ymd(from) + ")."));
                }, () => { asking = 0; });
            } catch (x) { asking = 0; }
        });
    }
    if (typeof admDetail === "function") {
        const __ad92 = admDetail;
        admDetail = function (this: any, code: any) {
            detCode = String(code || "");
            const r = __ad92.apply(this, arguments as any);
            try { expBox(detCode); } catch (e) { }
            return r;
        };
    }

    /* 89・90：一覧に足す部品（社員の札・「社員」の絞り込み・種類の列・CSV のボタン） */
    let stgOn = false;
    function listAfter() {
        if (!isAdm()) return;
        const well = document.getElementById("well");
        if (!well) return;
        const acq: any = document.getElementById("acq");
        const rows: any[] = Array.from(well.querySelectorAll("tr[data-st]"));
        // 社員の札
        rows.forEach((tr) => {
            const d = tr.querySelector("[data-det]"); const a = d ? acctOf(d.getAttribute("data-det")) : null;
            if (!a || a.role !== "stg") return;
            if (!tr.dataset.role) tr.dataset.role = "stg";
            const b = tr.cells[1] && tr.cells[1].querySelector("b");
            if (b && !tr.querySelector(".v92adm-stg")) b.insertAdjacentHTML("afterend", ` <span class="p on v92adm-stg" style="font-size:8.5px" title="${E(M("STANDAGE 社員（商社デスク）のアカウント", "STANDAGE staff (trading desk) account"))}">${E("🏢 " + M("社員", "Staff", "员工", "Personal"))}</span>`);
        });
        // 種類の列（契約満了の一覧など）：社員は「社員」
        well.querySelectorAll("table").forEach((t: any) => {
            const th: any[] = t.tHead && t.tHead.rows[0] ? Array.from(t.tHead.rows[0].cells) : [];
            const ki = th.findIndex((c) => /^(種類|Type|Kind|类型|Tipo)$/.test(String(c.textContent || "").trim()));
            if (ki < 0) return;
            Array.from(t.tBodies[0] ? t.tBodies[0].rows : []).forEach((r: any) => {
                const c = r.querySelector(".acode"); const a = c ? acctOf(String(c.textContent || "").trim()) : null;
                const td = r.cells[ki];
                if (a && a.role === "stg" && td && !td.dataset.v92) { td.dataset.v92 = "1"; td.textContent = M("社員", "Staff", "员工", "Personal"); }
            });
        });
        // 絞り込み「社員」
        const filt = well.querySelector(".acfilt");
        if (filt && acq && rows.length) {
            const hasStg = rows.some((tr) => tr.dataset.role === "stg");
            let chip: any = filt.querySelector("[data-acf92]");
            if (!chip && hasStg) {
                stgOn = false;
                chip = document.createElement("button");
                chip.className = "q"; chip.type = "button"; chip.setAttribute("data-acf92", "stg");
                chip.textContent = M("社員", "Staff", "员工", "Personal"); chip.setAttribute("data-noi18n", "");
                filt.appendChild(chip);
                const apply = () => {
                    if (!stgOn) return;
                    const s = String(acq.value || "").trim().toLowerCase(); let n = 0;
                    const rs: any[] = Array.from(well.querySelectorAll("tr[data-st]"));
                    rs.forEach((tr) => { const ok = tr.dataset.role === "stg" && (!s || String(tr.dataset.q || "").includes(s)); tr.hidden = !ok; if (ok) n++; });
                    const c = document.getElementById("accnt"); if (c) c.textContent = n + "/" + rs.length + "件";
                };
                chip.addEventListener("click", () => { stgOn = true; filt.querySelectorAll(".q").forEach((x: any) => x.classList.toggle("on", x === chip)); apply(); });
                filt.querySelectorAll("[data-acf]").forEach((x: any) => x.addEventListener("click", () => { stgOn = false; chip.classList.remove("on"); }));
                acq.addEventListener("input", () => apply());
            }
        }
        // CSV のボタン
        if (acq && typeof v33AdmCsvUse === "function" && !document.getElementById("v92admCsv")) {
            const b = document.createElement("button");
            b.type = "button"; b.id = "v92admCsv"; b.className = "btn g"; b.style.fontSize = "11px";
            b.textContent = M("この一覧を CSV に書き出す", "Export this list (CSV)", "将此列表导出为 CSV", "Exportar esta lista (CSV)"); b.setAttribute("data-noi18n", "");
            b.title = M("いま一覧に出ている行（絞り込みの結果）を、「利用状況（CSV）」と同じ項目で書き出します", "Exports the rows now shown (after filtering) with the same columns as “Usage (CSV)”");
            (acq.parentElement || well).appendChild(b);
            b.addEventListener("click", async () => {
                const only: any = {}; let n = 0;
                Array.from(well.querySelectorAll("tr[data-st]")).forEach((tr: any) => { if (tr.hidden) return; const d = tr.querySelector("[data-det]"); if (d) { only[String(d.getAttribute("data-det"))] = 1; n++; } });
                if (!n) { say(M("書き出す行がありません（絞り込みを変えてください）。", "There are no rows to export (change the filter).", "没有可导出的行（请更改筛选）。", "No hay filas que exportar (cambie el filtro).")); return; }
                W.__v92admCsvOnly = only; b.disabled = true;
                try { await v33AdmCsvUse(); say(M("いま出ている " + n + "件を CSV に書き出しました。", "Exported the " + n + " row(s) now shown to CSV.", "已将当前显示的 " + n + " 条导出为 CSV。", "Se exportaron a CSV las " + n + " fila(s) mostradas.")); }
                catch (x) { say(M("CSV を書き出せませんでした。", "Could not export the CSV.", "无法导出 CSV。", "No se pudo exportar el CSV.")); }
                finally { W.__v92admCsvOnly = null; b.disabled = false; }
            });
        }
        // 詳細の窓が開いているとき（ほかの層が描き直したあと）
        try { if (detCode && document.getElementById("dw-ext")) expBox(detCode); } catch (e) { }
    }
    let tmr: any = 0;
    const kick = () => { clearTimeout(tmr); tmr = setTimeout(() => { try { listAfter(); } catch (e) { } }, 120); };
    if (typeof renderAdmin === "function") {
        const __ra92 = renderAdmin;
        renderAdmin = function (this: any) { const r = __ra92.apply(this, arguments as any); try { listAfter(); } catch (e) { } kick(); return r; };
    }
    try {
        const hook = () => { const w = document.getElementById("well"); if (!w || (w as any).__v92admObs) return; (w as any).__v92admObs = 1; new MutationObserver(() => { if (isAdm()) kick(); }).observe(w, { childList: true, subtree: true }); kick(); };
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hook); else hook();
        setTimeout(hook, 1500);
    } catch (e) { }

    /* 90：何でも検索で、アカウント（会社名・コード・担当）を探せる */
    if (typeof uxPalItems === "function") {
        const __pal92 = uxPalItems;
        uxPalItems = function (this: any, q: any) {
            let L = __pal92.apply(this, arguments as any) || [];
            try {
                const qq = String(q || "").trim().toLowerCase();
                if (isAdm() && qq) {
                    const hit = accts().filter((a) => a && [a.code, a.co, a.who].some((x) => String(x || "").toLowerCase().includes(qq))).slice(0, 8);
                    const g = M("アカウント", "Accounts", "账户", "Cuentas");
                    const its = hit.map((a) => ({
                        g, ic: "👤", t: coName(a),
                        sub: [a.code, a.who || "", a.role === "fwd" ? M("物流会社", "Forwarder") : a.role === "stg" ? M("社員", "Staff") : "", a.st === "active" ? M("有効", "Active") : M("無効", "Inactive")].filter(Boolean).join("・"),
                        run: () => {
                            const jump = (n: number) => {
                                const acq: any = document.getElementById("acq");
                                if (!acq && n > 0) { if (n === 12) { const tb: any = document.querySelector('[data-act="sub.admTab"][data-arg="daily"]'); if (tb) tb.click(); } setTimeout(() => jump(n - 1), 250); return; }
                                if (!acq) return;
                                const all: any = document.querySelector('.acfilt [data-acf="all"]'); if (all) all.click();
                                acq.value = String(a.code); acq.dispatchEvent(new Event("input", { bubbles: true }));
                                try { acq.scrollIntoView({ block: "start" }); window.scrollBy(0, -140); } catch (x) { }
                                say(M("アカウント一覧を「" + a.code + "」で絞り込みました。", "Filtered the account list by “" + a.code + "”.", "已按“" + a.code + "”筛选账户列表。", "Lista filtrada por «" + a.code + "»."));
                            };
                            jump(12);
                        },
                    }));
                    if (its.length) L = its.concat(L);
                }
            } catch (e) { }
            return L;
        };
    }
})();
