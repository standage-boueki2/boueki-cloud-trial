/* 21.92 core：横断の課題の直し（2026-11-14 8カテゴリー×ペルソナ評価）。本体の層（今の版・刷新版の両方に効く）
   ① 手順の数え方を1つに（indagri-10・other-13・other-16・culture-13・health-12・medical-13・food-15）
      「はじめの設定」を6つの手順（商品を登録 → 販売先の国を選ぶ → 規制を調べる → 営業資料をつくる → バイヤーを探す → 商談を進める）にそろえる。
      これまでの6項目のうち「資料を登録」「足りない情報を埋める」は1つ目にまとめ、無かった「規制を調べる」を3つ目に入れる（ux32Setup を包む）。
      ほかの部品（刷新版の帯・スタートガイド・ホーム）は window.v92coreSteps() を読んで、同じ名前・同じ数を出す
   ② はじめての窓（#welv）：「3つのステップ」は1つ目の手順の中身だと分かる文に・全体の6つの手順を1行で・Esc で閉じる（health-11・indagri-20・other-16）
      登録メニュー（#v1811ov）：はじめての人には、押せない2つの選択肢を出さない（health-11）
   ③ 目標と道筋の段階の名前：規制か価格のどちらかだけで「規制と価格を準備した」と出ていた → 済んだほうだけを言う（indagri-10）
   ④ 何でも検索（Ctrl+K）：用語（HSコード など）と、画面に関係する言葉で当たるように。刷新版では画面名・分け方を左メニューと同じに（auto-18）
   ⑤ 営業資料：作り終わったら結果の枠へ送る（daily-11）／下書きの枚数の数え方を点検の文に書く（daily-12）／
      国ごとの進め方の文から、食品でない商材では食品の言葉（賞味期限・添加物・ハラール）を外す（culture-10 の残り）
   ⑥ AIバイヤー開拓「貴社の準備」：円の価格表（¥980／枚 など）でも FOB 価格を「済み」に。表示は今の登録内容で出す（daily-14）
   ⑦ 用語の印：刷新版の印（abbr.k-term）の中に今のアプリの印（.tm）が重ねて付き「？」が2つ出る → 重ねて付けない（medical-17・daily-18）
   今のアプリの関数は包むだけ（中身は変えない）。数字・事実はアプリが持っているものだけ */
declare const TEN: any, TENS: any, D: any, SES: any, I18N: any, GL: any, PAGES: any, DK3G: any, V85DK: any, V85DK_REG: any, V85DK_CATS: any, PID: any, FWDON: any, BCACT: any;
declare let ux32Setup: any, render: any, cur: any, opsTab: any, showWelcome: any, ux25Popup: any, v88StNm: any, uxPalItems: any, dk3Generate: any, dk3Check: any,
    v85dkJudgeHtml: any, dk3PlanPrompt: any, v71obReady: any, v71obReadyHtml: any, ux25Terms: any;
declare function go(id: string): void;
declare function toast(m: string): void;
declare function openDW(h: string): void;
declare function dwChrome(): void;
declare function v88Sig(): any;
declare function v88StageNow(): any;
declare function v85dkTen(): any;
(function () {
    const W: any = window;
    if (W.__v2192core)
        return;
    W.__v2192core = 1;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]);
    const lang = () => {
        try {
            const el = document.getElementById("lang") as any;
            const v = String((el && el.value) || "ja");
            return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
        }
        catch (e) {
            return "ja";
        }
    };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const isFwd = () => { try { return !!((typeof FWDON !== "undefined" && FWDON) || (typeof SES !== "undefined" && SES && SES.role === "fwd")); } catch (e) { return false; } };
    const isAdm = () => { try { return !!(typeof SES !== "undefined" && SES && SES.t === "admin"); } catch (e) { return false; } };

    /* ───── ① 手順の数え方を1つに：6つの手順 ───── */
    // id＝「はじめの設定」の行の id／key＝刷新版の画面のキー／pg＝今の版の画面
    const STEPS = [
        { id: "fill", key: "up", pg: "up", t: "商品を登録", s: "資料をアップロード。足りない情報は、AIの質問に答えて埋めます", en: "Register your product", zh: "登记商品", es: "Registrar el producto" },
        { id: "cty", key: "cty", pg: "cty", t: "販売先の国を選ぶ", s: "", en: "Choose target markets", zh: "选择销售目标国", es: "Elegir los países de venta" },
        { id: "reg", key: "ops:reg", pg: "ops", t: "規制を調べる", s: "選んだ国の決まりごと・関税・必要な書類を確かめます", en: "Check regulations", zh: "查法规", es: "Ver regulaciones" },
        { id: "deck", key: "deck", pg: "deck", t: "営業資料をつくる", s: "", en: "Create a sales deck", zh: "制作营业资料", es: "Crear la presentación" },
        { id: "buyer", key: "db", pg: "db", t: "バイヤーを探す", s: "", en: "Find buyers", zh: "寻找买家", es: "Buscar compradores" },
        { id: "fb", key: "dash:home", pg: "deal", t: "商談を進める", s: "「案件」で、相手の反応・価格・次の一手を記録します", en: "Advance your deals", zh: "推进商谈", es: "Avanzar las negociaciones" }
    ];
    W.V92CORE_STEPS = STEPS;
    const REG_WHY = "「規制を調べる」の画面で、販売先の国の決まりごとをまだ確かめていません";
    const regFlags = (): any => { try { return JSON.parse(localStorage.getItem("bc20_v92core_reg_" + ((typeof SES !== "undefined" && SES && SES.code) || "")) || "{}") || {}; } catch (e) { return {}; } };
    const regId = (t: any) => String((t && (t.uid || t.item)) || "");
    function regDone(t: any): boolean {
        try {
            if (!t)
                return false;
            const rk = t.regKB || {};
            if (Object.keys(rk).some(c => rk[c] && (rk[c].appliedTxt || rk[c].txt)))
                return true;
            return !!regFlags()[regId(t)];
        }
        catch (e) {
            return false;
        }
    }
    function regMark() {
        try {
            if (typeof TEN === "undefined" || !TEN || typeof SES === "undefined" || !SES || !SES.code || isFwd() || isAdm())
                return;
            const id = regId(TEN);
            if (!id)
                return;
            const has = (TEN.ctySel && Array.isArray(TEN.ctySel.chosen) && TEN.ctySel.chosen.length) || (Array.isArray(TEN.targets) && TEN.targets.length);
            if (!has)
                return;
            const F = regFlags();
            if (F[id])
                return;
            F[id] = Date.now();
            localStorage.setItem("bc20_v92core_reg_" + SES.code, JSON.stringify(F));
        }
        catch (e) { }
    }
    function unify(S: any) {
        if (!Array.isArray(S) || !S.length)
            return S;
        if (S.some((r: any) => r && r[0] === "reg"))
            return S;
        const by = (id: string) => S.find((r: any) => r && r[0] === id);
        const up = by("up"), fill = by("fill"), cty = by("cty"), deck = by("deck"), buyer = by("buyer"), fb = by("fb");
        if (!fill || !cty || !deck || !buyer || !fb)
            return S; // 形の違う版では、そのまま
        const t = (typeof TEN !== "undefined" && TEN) || null;
        const r1 = fill.slice();
        r1[1] = STEPS[0].t;
        r1[2] = STEPS[0].s;
        r1[4] = !!((!up || up[4]) && fill[4]);
        r1[6] = ((!up || up[4]) && !fill[4]) ? "足りない情報を埋める" : ""; // 資料は登録済みで、残りは足りない情報だけ、のとき（ボタンの補足に使う）
        const r2 = cty.slice();
        r2[1] = STEPS[1].t;
        const rd = regDone(t);
        const r3: any[] = ["reg", STEPS[2].t, STEPS[2].s, "opsTab='reg';go('ops')", rd, rd ? "" : REG_WHY];
        const r4 = deck.slice();
        r4[1] = STEPS[3].t;
        const r5 = buyer.slice();
        r5[1] = STEPS[4].t;
        const r6 = fb.slice();
        r6[1] = STEPS[5].t;
        r6[2] = STEPS[5].s;
        const known = { up: 1, fill: 1, cty: 1, deck: 1, buyer: 1, fb: 1 } as any;
        return [r1, r2, r3, r4, r5, r6].concat(S.filter((r: any) => r && !known[r[0]]));
    }
    if (typeof ux32Setup === "function") {
        const __us92 = ux32Setup;
        ux32Setup = function (this: any) {
            const S = __us92.apply(this, arguments as any);
            try {
                return unify(S);
            }
            catch (e) {
                return S;
            }
        };
    }
    // ほかの部品（刷新版の帯・スタートガイド・ホーム）が読む、いまの進み具合
    W.v92coreSteps = function () {
        let S: any = null;
        try {
            S = (typeof ux32Setup === "function") ? ux32Setup() : null;
        }
        catch (e) {
            S = null;
        }
        const has = Array.isArray(S) && S.length > 0;
        const rows = STEPS.map(st => {
            const r = has ? S.find((x: any) => x && x[0] === st.id) : null;
            return { id: st.id, key: st.key, pg: st.pg, t: st.t, s: (r && r[2]) || st.s, done: !!(r && r[4]), why: (r && r[5]) || "", sub: (r && r[6]) || "", now: false };
        });
        const i = rows.findIndex(x => !x.done);
        if (i >= 0)
            rows[i].now = true;
        return { has, steps: rows, done: rows.filter(x => x.done).length, all: rows.length, next: i >= 0 ? rows[i] : null, idx: i };
    };
    // 「規制を調べる」を開いた＝確かめた、の印（この端末に覚える。保存の形は変えない）
    if (typeof render === "function") {
        const __rn92c = render;
        render = function (this: any) {
            const r = __rn92c.apply(this, arguments as any);
            try {
                if (typeof cur !== "undefined" && cur === "ops" && typeof opsTab !== "undefined" && opsTab === "reg")
                    regMark();
            }
            catch (e) { }
            return r;
        };
    }
    // 刷新版・今の版のボタンから、手順の画面へ（data-act="v92core.step" data-arg="id"）
    function goStep(id: string) {
        try {
            const st = STEPS.find(x => x.id === id || x.key === id);
            if (!st)
                return;
            if (W.RDX && typeof W.RDX.goKey === "function") {
                W.RDX.goKey(st.key);
                return;
            }
            if (st.pg === "ops" && typeof opsTab !== "undefined")
                opsTab = "reg";
            go(st.pg === "deal" ? "deal" : st.pg);
        }
        catch (e) { }
    }
    W.v92coreGoStep = goStep;
    try {
        if (typeof BCACT !== "undefined" && BCACT && typeof BCACT.on === "function" && !BCACT.has("v92core.step"))
            BCACT.on("v92core.step", function (el: any) { goStep(String((el && el.getAttribute && el.getAttribute("data-arg")) || "")); });
    }
    catch (e) { }

    /* ───── ② はじめての窓：文と Esc ───── */
    const flowLine = () => STEPS.map((s, i) => "①②③④⑤⑥".charAt(i) + " " + M(s.t, s.en, s.zh, s.es)).join(" → ");
    function fixWelcome() {
        const v = document.getElementById("welv") as any;
        if (!v || v.dataset.v92core)
            return;
        v.dataset.v92core = "1";
        v.setAttribute("role", "dialog");
        v.setAttribute("aria-modal", "true");
        v.setAttribute("aria-label", M("はじめての方へ", "Welcome", "欢迎", "Bienvenido"));
        Array.from(v.querySelectorAll("span, p")).forEach((el: any) => {
            if (el.children.length === 0 && /3つのステップだけ覚えてください/.test(el.textContent || "")) {
                el.setAttribute("data-noi18n", "1");
                el.textContent = M("貿易の知識はいりません。まずは「商品を登録」から。やることは、この3つだけです。", "No trade knowledge needed. Start with “Register your product” — just these three things.", "无需贸易知识。先从“登记商品”开始，只需做这三件事。", "No necesita saber de comercio exterior. Empiece por «Registrar el producto»: solo estas tres cosas.");
            }
        });
        const g3 = v.querySelector(".g3");
        if (g3 && !v.querySelector(".v92c-wflow"))
            g3.insertAdjacentHTML("afterend", `<p class="v92c-wflow" data-noi18n="1" style="margin:12px 0 0;padding:9px 12px;border-radius:10px;background:var(--surface-2,#F6F8FB);font-size:12px;line-height:1.75;color:var(--ink-2,#44546A)"><b>${E(M("全体の流れ（はじめの設定・6つの手順）", "The whole flow (setup in 6 steps)", "整体流程（初始设置・6个步骤）", "El recorrido completo (6 pasos)"))}</b><br>${E(flowLine())}</p>`);
        try {
            // 小さい画面・大きい文字でも「さっそく始める」が画面の外に出ないように：窓の中で送れるようにし、ボタンの行は下に留める
            const wc = v.querySelector(".wc") as any;
            if (wc)
                wc.style.cssText += ";max-height:calc(100vh - 36px);max-height:calc(100dvh - 36px);overflow-y:auto";
            const b = v.querySelector("#welgo") as any;
            const row = b && b.parentElement;
            if (row && row !== wc)
                row.style.cssText += ";position:sticky;bottom:-24px;background:var(--surface,#fff);padding:10px 0 14px;margin-bottom:-14px;z-index:1";
            if (b)
                b.focus();
        }
        catch (e) { }
    }
    if (typeof showWelcome === "function") {
        const __sw92 = showWelcome;
        showWelcome = function (this: any) {
            const r = __sw92.apply(this, arguments as any);
            try {
                fixWelcome();
            }
            catch (e) { }
            return r;
        };
    }
    try {
        fixWelcome();
    }
    catch (e) { }
    document.addEventListener("keydown", ev => {
        try {
            if (ev.key !== "Escape")
                return;
            const v = document.getElementById("welv");
            if (!v)
                return;
            const pal = document.getElementById("uxpal");
            if ((pal && pal.classList.contains("on")) || document.getElementById("v1811ov") || document.getElementById("k-qg"))
                return; // 上に別の窓があるときは、そちらを先に閉じる
            try {
                if (typeof SES !== "undefined" && SES && SES.code)
                    localStorage.setItem("bc20_wel_" + SES.code, "1");
            }
            catch (e) { }
            v.remove();
        }
        catch (e) { }
    });
    // 登録メニュー：はじめての人（会社も商品もまだ無い）には、押せない2つを出さない（1つ登録すると出る）
    function firstMenu() {
        const v = document.getElementById("v1811ov") as any;
        if (!v || v.dataset.v92core)
            return;
        const a = v.querySelector('[data-v1811="addto"]') as any, b = v.querySelector('[data-v1811="edit"]') as any, n = v.querySelector('[data-v1811="newco"]') as any;
        if (!a || !b || !n || !a.disabled || !b.disabled || n.disabled)
            return;
        v.dataset.v92core = "1";
        a.style.display = "none";
        b.style.display = "none";
        const s = v.querySelector(".v1811h .s") as any;
        if (s && /3つから選んでください/.test(s.textContent || "")) {
            s.setAttribute("data-noi18n", "1");
            s.textContent = M("はじめての登録です。下から始めてください（あとからいつでも変更できます）。", "This is your first registration. Start below (you can change it any time).", "这是第一次登记。请从下方开始（之后随时可以更改）。", "Es su primer registro. Empiece abajo (puede cambiarlo cuando quiera).");
        }
        const num = n.querySelector(".top .k") as any;
        if (num && /^\s*1\s*$/.test(num.textContent || ""))
            num.style.display = "none";
        n.style.gridColumn = "1 / -1"; // 1つだけなので、横いっぱいに
        const grid = n.parentElement as any;
        if (grid && !v.querySelector(".v92c-mnote"))
            grid.insertAdjacentHTML("afterend", `<p class="nn v92c-mnote" data-noi18n="1" style="margin:8px 2px 0;font-size:12.5px !important;line-height:1.7;color:var(--ink-3,#6B7B93)">${E(M("「既存の会社に商品を追加」「既存の商品を編集」は、商品を1つ登録すると、このメニューに出ます。", "“Add a product to an existing company” and “Edit an existing product” appear here after you register your first product.", "登记第一个商品后，此菜单会出现“为已有公司添加商品”“编辑已有商品”。", "«Añadir producto a una empresa existente» y «Editar un producto» aparecerán aquí cuando registre el primero."))}</p>`);
    }
    if (typeof ux25Popup === "function") {
        const __pp92 = ux25Popup;
        ux25Popup = function (this: any) {
            const r = __pp92.apply(this, arguments as any);
            try {
                firstMenu();
            }
            catch (e) { }
            return r;
        };
    }

    /* ───── ③ 目標と道筋の段階の名前（段階3）：済んだほうだけを言う ───── */
    if (typeof v88StNm === "function" && typeof v88Sig === "function" && typeof v88StageNow === "function") {
        const __sn92 = v88StNm;
        let memo: any = null;
        v88StNm = function (this: any, n: any) {
            const r = __sn92.apply(this, arguments as any);
            try {
                if ((n | 0) !== 3)
                    return r;
                const now = Date.now();
                if (!memo || now - memo.at > 1500) {
                    const st = v88StageNow();
                    memo = { at: now, stage: st && st.stage, sig: (st && st.sig) || {} };
                }
                if (memo.stage !== 3)
                    return r; // いまの段階の名前としてだけ言い直す（予定の段階の名前はそのまま）
                if (memo.sig.price && !memo.sig.reg)
                    return M("価格を準備した（規制の確認はこれから）", "Pricing prepared (regulations still to check)", "已准备价格（法规尚待确认）", "Precios listos (falta revisar regulaciones)");
                if (memo.sig.reg && !memo.sig.price)
                    return M("規制の情報を用意した（価格の準備はこれから）", "Regulation info ready (pricing still to prepare)", "已备好法规信息（价格尚待准备）", "Información de regulaciones lista (faltan precios)");
            }
            catch (e) { }
            return r;
        };
    }

    /* ───── ④ 何でも検索（Ctrl+K） ───── */
    // 画面に関係する言葉（画面の名前に入っていない言葉でも当たるように）
    const KW: any = {
        "dash:home": "案件 案件一覧 ホーム 一覧 ダッシュボード 商談",
        "dash:prod": "商品 商品一覧 商品管理",
        "dash:rep": "分析 レポート ダッシュボード 数字 グラフ 集計",
        today: "タスク 今日やること やること todo",
        rm: "目標 道筋 ロードマップ 売上目標 計画",
        inbox: "通知 お知らせ 確認待ち 受信",
        ai: "AI 相談 質問 チャット",
        db: "バイヤー 開拓 リスト 見込み客 輸入商社 営業メール 拠点",
        deck: "営業資料 提案書 プレゼン パワーポイント PowerPoint PDF 会社案内 翻訳 外国語",
        deal: "商談 バイヤー 記録 フィードバック 失注",
        msg: "メール メッセージ 返信 チャット やりとり",
        memo: "議事録 会議 メモ",
        rqp: "依頼 物流会社 回答",
        cty: "国 販売先 市場 進出 国選定 おすすめの国 ターゲット",
        "ops:reg": "規制 関税 関税率 HSコード HS 必要書類 輸入規制 認証 通関 決まりごと EPA 原産地証明",
        "ops:doc": "書類 インボイス パッキングリスト PI CI PL S/I 発注書 PO 見積書",
        "ops:ship": "出荷 物流 見積 フォワーダー 船 航空 B/L 仮押さえ",
        "ops:ord": "受注 請求 入金 請求書 売上",
        "ops:file": "書類 下書き 申請 案件の書類",
        item: "商品情報 HSコード HS 価格 価格表 MOQ 最小発注数量 リードタイム 建値 取引条件 インコタームズ FOB 寸法 重量 成分 強み 認証 原産地 支払条件",
        up: "商品登録 アップロード 資料 Excel PDF カタログ 新しい商品 読み取り",
        docs: "ドキュメント ファイル 資料 共有",
        legal: "契約 NDA 契約書 販売店契約 秘密保持",
        gloss: "用語 用語集 言葉 意味 辞書 貿易用語",
        srcs: "取り込んだ情報 ナレッジ 読み込んだ資料",
        task: "タスク 期限 担当 進行",
        team: "メンバー 招待 権限 担当 セキュリティ パスワード 二段階",
        trash: "ゴミ箱 削除 元に戻す 操作の記録"
    };
    // 今の版の画面名 → 刷新版の左メニューの名前（「最近開いた画面」などに残る名前の言い直し）
    const RD_NM: any = { "ダッシュボード": "案件", "貿易実務・書類・出荷": "規制を調べる・書類をつくる", "メンバー・担当": "メンバー・権限・セキュリティ", "取り込んだ情報一覧": "取り込んだ情報", "用語集": "用語集（貿易のことば）", "AI商社マン": "AI商社マンに相談" };
    function termList(): any[] {
        const out: any[] = [], seen: any = {};
        try {
            const Dc = (W.RDX && typeof W.RDX.termDict === "function") ? W.RDX.termDict() : null;
            if (Dc)
                Object.keys(Dc).forEach(k => { const x = Dc[k]; if (!x || !x.s) return; const n = String(k); if (seen[n] || seen["=" + x.s]) return; seen[n] = 1; seen[k] = 1; seen["=" + x.s] = 1; out.push({ n, s: String(x.s), k: k }); });
        }
        catch (e) { }
        try {
            if (typeof GL !== "undefined" && GL)
                Object.keys(GL).forEach(k => { if (!GL[k] || seen[k] || seen["=" + GL[k]]) return; seen[k] = 1; out.push({ n: k, s: String(GL[k]), k }); });
        }
        catch (e) { }
        return out;
    }
    function openTerm(x: any) {
        try {
            if (W.RDX && typeof W.RDX.goKey === "function" && !isFwd()) {
                W.RDX.goKey("gloss");
                const put = () => { const i = document.getElementById("v90glq") as any; if (!i) return false; i.value = x.n; i.dispatchEvent(new Event("input", { bubbles: true })); try { i.scrollIntoView({ block: "center" }); } catch (e) { } return true; };
                setTimeout(() => { if (!put()) setTimeout(put, 900); }, 700);
                return;
            }
            if (typeof openDW === "function") {
                openDW(`<div class="c"><h3>📖 ${E(x.n)}</h3><p style="line-height:1.8;margin-top:8px">${E(x.s)}</p></div>`);
                try { if (typeof dwChrome === "function") dwChrome(); } catch (e) { }
            }
            else if (typeof toast === "function")
                toast(x.n + "：" + x.s);
        }
        catch (e) { }
    }
    function palFix(items: any[], q: string, base: any, q0: string): any[] {
        if (isFwd() || isAdm() || typeof PAGES === "undefined" || !Array.isArray(PAGES))
            return items;
        const rel = "（「" + q0 + "」に関係する画面）";
        const hasP = (typeof PID !== "undefined" && PID);
        const hit = (s: string) => !q || s.toLowerCase().indexOf(q) >= 0;
        const RD = W.RDX;
        const pgNm: any = {};
        PAGES.forEach((p: any) => { if (p && p.id) pgNm[p.id] = p.nm; });
        let out = items.slice();
        if (RD && Array.isArray(RD.NAV_S)) {
            // 刷新版：画面の名前と分け方を、左メニュー（すべての機能）と同じにする
            let all: any[] = [];
            try {
                all = q ? (base("") || []) : items;
            }
            catch (e) {
                all = items;
            }
            const avail: any = {};
            all.forEach((i: any) => { if (i && i.g === "画面") avail[i.t] = 1; });
            const fromPages: any = { "AI商社マン": 1 };
            PAGES.forEach((p: any) => { if (p && p.nm) fromPages[p.nm] = 1; });
            const nav: any[] = [];
            RD.NAV_S.forEach((g: any) => (g.items || []).forEach((it: any) => {
                const key = String(it[0]), bs = key.split(":")[0];
                if (key === "ship")
                    return; // 「出荷を進める（前の画面）」は、操作の欄に今のまま出る
                const ok = bs === "ai" ? (avail["AI商社マン"] || avail[pgNm.ai]) : avail[pgNm[bs]];
                if (!ok)
                    return;
                const kw = KW[key] || "";
                const byName = hit(it[1] + " " + g.g + " 画面");
                if (!byName && !hit(kw))
                    return;
                nav.push({ g: "画面", t: it[1], sub: g.g + (q && !byName ? rel : ""), ic: "📄", v92: 1, run: () => { try { RD.goKey(key); } catch (e) { } } });
            }));
            let at = out.findIndex((i: any) => i && i.g === "画面" && fromPages[i.t]);
            out = out.filter((i: any) => !(i && i.g === "画面" && fromPages[i.t]));
            if (at < 0)
                at = q ? 0 : out.length;
            out = out.slice(0, at).concat(nav, out.slice(at));
            const grpOf = (nm: string) => { let r = ""; RD.NAV_S.forEach((g: any) => (g.items || []).forEach((it: any) => { if (!r && pgNm[String(it[0]).split(":")[0]] === nm) r = g.g; })); return r; };
            out = out.map((i: any) => {
                if (!i || i.v92 || i.g !== "最近開いた画面")
                    return i;
                const g2 = grpOf(i.t);
                return Object.assign({}, i, { t: RD_NM[i.t] || i.t, sub: g2 || i.sub });
            });
        }
        else if (q) {
            // 今の版：画面に関係する言葉でも当たるように（名前はそのまま）
            const add: any[] = [];
            const seen: any = {};
            out.forEach((i: any) => { if (i && i.g === "画面") seen[i.t] = 1; });
            Object.keys(KW).forEach(key => {
                const bs = key.split(":")[0];
                const p = PAGES.find((x: any) => x && x.id === bs);
                if (!p || p.hide || !(p.free || hasP) || seen[p.nm] || !hit(KW[key]))
                    return;
                seen[p.nm] = 1;
                add.push({ g: "画面", t: p.nm, sub: (p.grp || "") + rel, ic: "📄", v92: 1, run: () => { try { if (key === "ops:reg" && typeof opsTab !== "undefined") opsTab = "reg"; go(p.id); } catch (e) { } } });
            });
            out = add.concat(out);
        }
        if (q && hasP) {
            // 用語（HSコード・FOB など）：用語の説明へ
            const T = termList().filter(x => x.n.toLowerCase().indexOf(q) >= 0 || (q.length >= 2 && q.indexOf(x.n.toLowerCase()) >= 0));
            T.sort((a, b) => (a.n.toLowerCase() === q ? 0 : 1) - (b.n.toLowerCase() === q ? 0 : 1) || a.n.length - b.n.length);
            const terms = T.slice(0, 6).map(x => ({ g: M("用語（貿易のことば）", "Glossary (trade terms)", "术语（贸易用语）", "Glosario"), t: x.n, sub: x.s.length > 54 ? x.s.slice(0, 53) + "…" : x.s, ic: "📖", v92: 1, run: () => openTerm(x) }));
            if (terms.length) {
                // 画面の当たりのすぐあとに置く
                let j = -1;
                out.forEach((i: any, n: number) => { if (i && i.g === "画面") j = n; });
                out = out.slice(0, j + 1).concat(terms, out.slice(j + 1));
            }
        }
        return out;
    }
    if (typeof uxPalItems === "function") {
        const __pal92 = uxPalItems;
        uxPalItems = function (this: any, q: any) {
            let items = __pal92.apply(this, arguments as any) || [];
            try {
                items = palFix(items, String(q || "").trim().toLowerCase(), __pal92, String(q || "").trim());
            }
            catch (e) { }
            return items;
        };
    }

    /* ───── ⑤ 営業資料 ───── */
    // 作り終わったら、結果（点検・ダウンロード）の枠へ送る
    function showDeckResult() {
        const run = () => {
            try {
                if (typeof cur === "undefined" || cur !== "deck")
                    return;
                const el = document.getElementById("dk3res1");
                if (!el)
                    return;
                let d = el.parentElement as any;
                while (d) {
                    if (d.tagName === "DETAILS" && !d.open)
                        d.open = true;
                    d = d.parentElement;
                }
                const r = el.getBoundingClientRect(), vh = window.innerHeight || 800;
                if (r.top < 70 || r.top > vh * 0.45)
                    window.scrollTo({ top: Math.max(0, (window.scrollY || 0) + r.top - 96), behavior: "auto" });
            }
            catch (e) { }
        };
        setTimeout(run, 160);
        setTimeout(run, 900);
    }
    if (typeof dk3Generate === "function") {
        const __dg92 = dk3Generate;
        dk3Generate = async function (this: any) {
            const r = await __dg92.apply(this, arguments as any);
            try {
                if (typeof DK3G !== "undefined" && DK3G && DK3G.deck && !DK3G.run)
                    showDeckResult();
            }
            catch (e) { }
            return r;
        };
    }
    // 下書き：題・一覧の枚数（全部）と、点検の枚数（未入力を示すページを除く）が食い違って見えた → 数え方を書く
    if (typeof dk3Check === "function") {
        const __ck92 = dk3Check;
        dk3Check = function (this: any, deck: any) {
            const r = __ck92.apply(this, arguments as any);
            try {
                if (r && deck && deck.v54draft && Array.isArray(deck.slides) && Array.isArray(r.warn)) {
                    const all = deck.slides.length, real = deck.slides.filter((s: any) => !(s && s.v54)).length;
                    if (all > real)
                        r.warn.forEach((w: any) => {
                            if (w && w.k === "thin" && /^ページ数が \d+枚と少なめです/.test(String(w.t || "")))
                                w.t = "中身のあるページが " + real + "枚と少なめです（全 " + all + "枚のうち " + (all - real) + "枚は、未入力の項目を示す下書き用のページ。沿革・実績・差別化・顧客像などを登録すると充実します）";
                        });
                }
            }
            catch (e) { }
            return r;
        };
    }
    // 国ごとの進め方の文：食品でない型では、食品の言葉（賞味期限・添加物・ハラール）を外す
    const FOODISH = /^(food|fresh|tea|beverage_alcohol|supplement|pet|feed_agri)$/;
    const SEMI = /^(cosmetics|cosmetic_ingredient|medical)$/; // 期限・ハラールが関係しうる型（賞味期限 → 使用期限）
    const NEUTRAL: any = {
        NA: "規制への適合（登録・表示）と現地での販売実績を先に。「日本で売れている」だけでは効かない",
        EU: "欧州に無い物であること・現地の規格や表示への対応（登録にある時だけ）・サステナビリティの事実を前に",
        SEA: "見た目・パッケージで選ばれる。価格帯を前に",
        ME: "返事の速さを前に"
    };
    function withRegText(fn: () => any) {
        let saved: any = null;
        try {
            if (typeof V85DK !== "undefined" && V85DK && typeof V85DK_REG !== "undefined" && V85DK_REG) {
                const T0 = (typeof v85dkTen === "function" ? v85dkTen() : null) || (typeof TEN !== "undefined" ? TEN : null);
                const J = T0 ? V85DK.cat(T0) : null;
                const k = String((J && J.k) || "");
                if (k && !FOODISH.test(k)) {
                    saved = {};
                    Object.keys(V85DK_REG).forEach(key => {
                        const row = V85DK_REG[key];
                        if (!Array.isArray(row))
                            return;
                        const alt = SEMI.test(k) ? String(row[1]).replace(/賞味期限/g, "使用期限").replace(/添加物や残留基準/g, "成分の決まり") : NEUTRAL[key];
                        if (alt && alt !== row[1]) {
                            saved[key] = row;
                            V85DK_REG[key] = [row[0], alt];
                        }
                    });
                }
            }
        }
        catch (e) { }
        try {
            return fn();
        }
        finally {
            try {
                if (saved)
                    Object.keys(saved).forEach(key => { V85DK_REG[key] = saved[key]; });
            }
            catch (e) { }
        }
    }
    if (typeof v85dkJudgeHtml === "function") {
        const __jh92 = v85dkJudgeHtml;
        v85dkJudgeHtml = function (this: any) { const a = arguments as any, self = this; return withRegText(() => __jh92.apply(self, a)); };
    }
    if (typeof dk3PlanPrompt === "function") {
        const __pp92b = dk3PlanPrompt;
        dk3PlanPrompt = function (this: any) { const a = arguments as any, self = this; return withRegText(() => __pp92b.apply(self, a)); };
    }

    /* ───── ⑥ AIバイヤー開拓「貴社の準備」：FOB 価格 ───── */
    const PRICE_RE = /(?:US\$|\$|USD|€|EUR|£|GBP|¥|￥|JPY|CNY|RMB)\s?\d[\d,.]*|\d[\d,.]*\s?(?:円|ドル|ユーロ|元|USD|JPY|EUR)/i;
    function priceState(): { num: boolean, any: boolean } {
        const o = { num: false, any: false };
        try {
            const d = (typeof D !== "undefined" && D) || {};
            const cols = Array.isArray(d.priceCols) ? d.priceCols : [];
            (d.priceRows || []).forEach((r: any) => {
                const arr = Array.isArray(r) ? r : [r];
                arr.forEach((v: any, i: number) => {
                    const s = String(v == null ? "" : v).trim();
                    if (!s || s === "—")
                        return;
                    o.any = true;
                    // 通貨の付いた金額（¥980・US$4.20・980円）か、単価の列の数字（980）
                    if (PRICE_RE.test(s) || (/\d/.test(s) && (i >= 1 || arr.length === 1) && (/^[\d,.\s]+$/.test(s) || /単価|価格|price|fob|cif|exw|円|usd|\$/i.test(String(cols[i] || "")))))
                        o.num = true;
                });
            });
        }
        catch (e) { }
        return o;
    }
    if (typeof v71obReady === "function") {
        const __rd92 = v71obReady;
        v71obReady = function (this: any) {
            const R = __rd92.apply(this, arguments as any);
            try {
                if (R && !R.price) {
                    const P = priceState();
                    if (P.num) {
                        R.price = true;
                        R.pts = (R.pts || 0) + 5;
                        if (Array.isArray(R.miss))
                            R.miss = R.miss.filter((m: any) => !(m && /^FOB 価格/.test(String(m[0]))));
                    }
                    else if (P.any && Array.isArray(R.miss))
                        R.miss = R.miss.map((m: any) => (m && m[0] === "FOB 価格") ? ["FOB 価格（価格表に、金額を数字で入れてください）", m[1]] : m);
                }
            }
            catch (e) { }
            return R;
        };
    }
    // 表示は、リストを作った時の控えではなく、今の登録内容で（価格や資料を足したら ✓ に変わる）
    if (typeof v71obReadyHtml === "function" && typeof v71obReady === "function") {
        const __rh92 = v71obReadyHtml;
        v71obReadyHtml = function (this: any, run: any) {
            try {
                if (run && run.cty) {
                    const now = v71obReady(run.cty);
                    if (now)
                        return __rh92.call(this, Object.assign({}, run, { ready: now }));
                }
            }
            catch (e) { }
            return __rh92.apply(this, arguments as any);
        };
    }

    /* ───── ⑦ 用語の印：刷新版の印（abbr.k-term）の中には、今のアプリの印（.tm）を重ねて付けない ───── */
    if (typeof ux25Terms === "function") {
        const __ut92 = ux25Terms;
        ux25Terms = function (this: any) {
            try {
                const w = document.getElementById("well");
                if (w)
                    Array.from(w.querySelectorAll("abbr.k-term:not([data-noterm])")).forEach((a: any) => a.setAttribute("data-noterm", "1"));
            }
            catch (e) { }
            return __ut92.apply(this, arguments as any);
        };
    }

    /* ───── 足した文言の辞書（英語・中国語・スペイン語） ───── */
    try {
        if (typeof I18N !== "undefined" && I18N && I18N.dict) {
            const rows: string[][] = [
                ["商品を登録", "Register your product", "登记商品", "Registrar el producto"],
                ["販売先の国を選ぶ", "Choose target markets", "选择销售目标国", "Elegir los países de venta"],
                ["営業資料をつくる", "Create a sales deck", "制作营业资料", "Crear la presentación"],
                ["バイヤーを探す", "Find buyers", "寻找买家", "Buscar compradores"],
                ["商談を進める", "Advance your deals", "推进商谈", "Avanzar las negociaciones"],
                ["資料をアップロード。足りない情報は、AIの質問に答えて埋めます", "Upload your documents; fill the gaps by answering the AI's questions", "上传资料。缺少的信息通过回答AI的提问来补全", "Suba sus documentos; complete lo que falte respondiendo a la IA"],
                ["選んだ国の決まりごと・関税・必要な書類を確かめます", "Check the rules, duties and required documents for the countries you chose", "确认所选国家的规定・关税・所需单证", "Revise normas, aranceles y documentos de los países elegidos"],
                ["「案件」で、相手の反応・価格・次の一手を記録します", "In “Cases”, record each buyer's response, prices and next step", "在“案件”中记录对方的反应・价格・下一步", "En «Casos», registre la respuesta, los precios y el siguiente paso"],
                [REG_WHY, "You haven't checked the rules for your target markets on the “Check regulations” screen yet", "尚未在“查法规”页面确认销售目标国的规定", "Aún no ha revisado las normas de sus países en «Ver regulaciones»"],
                ["FOB 価格（価格表に、金額を数字で入れてください）", "FOB price (enter amounts as numbers in the price table)", "FOB 价格（请在价格表中用数字填写金额）", "Precio FOB (escriba importes en números en la tabla)"]
            ];
            rows.forEach(r => {
                if (I18N.dict.en && !I18N.dict.en[r[0]])
                    I18N.dict.en[r[0]] = r[1];
                if (I18N.dict.zh && !I18N.dict.zh[r[0]])
                    I18N.dict.zh[r[0]] = r[2];
                if (I18N.dict.es && !I18N.dict.es[r[0]])
                    I18N.dict.es[r[0]] = r[3];
            });
            if (Array.isArray(I18N.pat))
                I18N.pat.push({ re: /^中身のあるページが (\d+)枚と少なめです（全 (\d+)枚のうち (\d+)枚は、未入力の項目を示す下書き用のページ。沿革・実績・差別化・顧客像などを登録すると充実します）$/,
                    en: "Only $1 slides have content ($3 of the $2 slides are draft placeholders for missing items; registering history, track record, differentiators and customer profiles will make it fuller)",
                    zh: "有内容的页面只有 $1 页（全部 $2 页中有 $3 页是标示未填写项目的草稿页。登记沿革・业绩・差异化・客户画像等会更充实）",
                    es: "Solo $1 diapositivas tienen contenido ($3 de las $2 son marcadores de borrador; registre historia, resultados, diferenciación y perfil de cliente para completarla)" });
        }
    }
    catch (e) { }
})();
