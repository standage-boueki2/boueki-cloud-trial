/* 21.94 r8x：r8a・r8b・r8c を重ねた版（8811）の確かめで見つけた、層どうしの食い違いの直し
   (1) 見積書の注記（仕出港・航空）：r8b が出どころの判定を直した文（商談の記録の取引条件から入れた／この案件の取引条件の港／
       商品情報の仕出港と違う＝要確認／書類の画面の判断の表で航空なのに海上の条件）を、r8c の英・中・西の包み（21.93 の S.v92pol.from と
       「仕出港が空港」の前提だけで文を組み直す）が上書きしていた。英・中・西では r8b の直す前の言い方（「商品情報に登録の…から」
       「仕出港が空港のため航空」）に戻り、要確認の注意も消えていた（other-T03・daily-T04・culture-T04・medical-T06・food-T07 が英・中・西で戻る）。
       → いちばん外で包む。言語を日本語にして内側（r8c → r8b → 21.93）を呼び、r8b が決めた形（日本語の文）を読み取って、その形の英・中・西の文を出す。
         言い方は r8c（21.93 と同じ形のもの）と r8b の M()（航空の注意）にそろえる。形が読めないとき・日本語の画面では、今までの出力のまま。 */
declare let v92docPolNote: any, v92docAirNote: any, dashDrill: any;
declare const I18N: any, v92docE: any, dashScopeName: any, dashAgg: any, dashScopeUnits: any;
(function () {
    const W: any = window;
    if (W.__v2192r8x) return;
    W.__v2192r8x = 1;
    const warn = (w: string, e: any) => { try { console.warn("[r8x] " + w, e); } catch (x) { } };
    const lg = (): string => { try { const v = String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja"); return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja"; } catch (e) { return "ja"; } };
    const L3 = (en: string, zh: string, es: string) => { const l = lg(); return l === "zh" ? zh : l === "es" ? es : en; };
    // 内側を日本語で呼ぶ（同期の呼び出しの間だけ。finally で戻す）
    const asJa = (f: () => any): any => {
        if (typeof I18N === "undefined" || !I18N) return f();
        const l0 = I18N.lang;
        try { I18N.lang = "ja"; return f(); } finally { I18N.lang = l0; }
    };
    const unE = (s: string) => String(s || "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    const docE = (s: any) => { try { return typeof v92docE === "function" ? v92docE(s) : String(s); } catch (e) { return String(s); } };
    // 港の名前：辞書に訳があれば（日本語の残らない訳だけ）その言語で。r8c と同じ扱い
    const JP = /[ぁ-ゖァ-ヺ一-鿿]/, KANA = /[ぁ-ゖァ-ヺ]/;
    const port = (s: string) => {
        const v = String(s == null ? "" : s);
        try {
            const d = I18N && I18N.dict && I18N.dict[lg()];
            const t = d && typeof d[v] === "string" ? d[v] : null;
            return t && !(lg() === "zh" ? KANA : JP).test(t) ? t : v;
        } catch (e) { return v; }
    };
    const b = (s: string) => `<b data-noi18n>${docE(s)}</b>`;

    /* ── (1a) 仕出港の注記 ── */
    // r8b・21.93 が出す日本語の形（<b data-noi18n>…</b> の中は値）
    const RX_B = "<b data-noi18n>([\\s\\S]*?)<\\/b>";
    const P_TERM = new RegExp("^仕出港（積出港）は、商品情報の取引条件「" + RX_B + "」の港 " + RX_B + " です。");
    const P_POL = new RegExp("^仕出港（積出港）は、商品情報に登録の " + RX_B + " から入れています。");
    const P_REC = new RegExp("^仕出港（積出港）は、商談の記録の取引条件「" + RX_B + "」から入れています。");
    const P_PP = new RegExp("^仕出港（積出港）は、価格表の建値の港 " + RX_B + " から入れています。");
    const P_CASE = new RegExp("^仕出港（積出港）は、この案件の取引条件「" + RX_B + "」の港 " + RX_B + " です。");
    const W_REG = /<span class="v92doc-warn">要確認：商品情報の仕出港は <span data-noi18n>([\s\S]*?)<\/span> です。どちらから出すか確かめてください。<\/span>/;
    const W_CLASH = /<span class="v92doc-warn">要確認：取引条件の港と商品情報の仕出港（<span data-noi18n>([\s\S]*?)<\/span>）が違います。どちらかにそろえてください。<\/span>/;
    const BTN = /<button type="button" class="btn g" data-v92act="pol"[\s\S]*?<\/button>/;
    const polLang = (hj: string): string | null => {
        let m: any, o = "";
        if ((m = hj.match(P_REC))) {
            const t = unE(m[1]).trim(); const i = t.indexOf(" ");
            const rt = i > 0 ? t.slice(0, i) + " " + port(t.slice(i + 1)) : t;
            o = L3(`Port of loading: taken from the trade terms ${b(rt)} in the meeting record.`, `装运港取自商谈记录的交易条件“${b(rt)}”。`, `Puerto de carga: tomado de las condiciones ${b(rt)} del registro de la reunión.`);
        } else if ((m = hj.match(P_CASE))) {
            const tm = b(unE(m[1])), nm = b(port(unE(m[2])));
            o = L3(`Port of loading: ${nm}, the port in this case's trade terms “${tm}”.`, `装运港为本案件交易条件“${tm}”中的港口 ${nm}。`, `Puerto de carga: ${nm}, el puerto de las condiciones «${tm}» de este caso.`);
        } else if ((m = hj.match(P_TERM))) {
            const tm = b(unE(m[1])), nm = b(port(unE(m[2])));
            o = L3(`Port of loading: ${nm}, the port in the trade terms “${tm}” in Product info.`, `装运港为商品信息交易条件“${tm}”中的港口 ${nm}。`, `Puerto de carga: ${nm}, el puerto de las condiciones «${tm}» de la información del producto.`);
        } else if ((m = hj.match(P_POL))) {
            const nm = b(port(unE(m[1])));
            o = L3(`Port of loading: ${nm}, as registered in Product info.`, `装运港取自商品信息中登记的 ${nm}。`, `Puerto de carga: ${nm}, según lo registrado en la información del producto.`);
        } else if ((m = hj.match(P_PP))) {
            const nm = b(port(unE(m[1])));
            o = L3(`Port of loading: ${nm}, the port in the price list's trade term.`, `装运港取自价格表贸易术语中的港口 ${nm}。`, `Puerto de carga: ${nm}, el puerto del término comercial de la lista de precios.`);
        } else return null;
        if ((m = hj.match(W_REG))) {
            const r = `<span data-noi18n>${docE(port(unE(m[1])))}</span>`;
            o += ` <span class="v92doc-warn">${L3(`Please check: the port of loading in Product info is ${r}. Confirm which port it ships from.`, `需确认：商品信息中的装运港为 ${r}。请确认从哪个港口发货。`, `Revise: el puerto de carga de la información del producto es ${r}. Confirme desde qué puerto se envía.`)}</span>`;
        } else if ((m = hj.match(W_CLASH))) {
            const r = `<span data-noi18n>${docE(port(unE(m[1])))}</span>`;
            o += ` <span class="v92doc-warn">${L3(`Check: the port in the trade terms differs from the port of loading in Product info (${r}). Make them the same.`, `需确认：交易条件中的港口与商品信息中的装运港（${r}）不同。请统一为其中一个。`, `Revise: el puerto de las condiciones no coincide con el puerto de carga de la información del producto (${r}). Unifíquelos.`)}</span>`;
        }
        return o;
    };
    try {
        if (typeof v92docPolNote === "function") {
            const __pn = v92docPolNote;
            v92docPolNote = function (this: any, S: any) {
                const self = this, a = arguments;
                const h = __pn.apply(self, a as any);
                try {
                    if (lg() === "ja" || !h || !S || !S.v92pol) return h;
                    const hj = String(asJa(() => __pn.apply(self, a as any)) || "");
                    const o = hj ? polLang(hj) : null;
                    if (o == null) return h;
                    // 21.93 の「確かめる・登録する」ボタンは、日本語の文にあるときだけ（r8c の出力から持ってくる）
                    const bt = BTN.test(hj) ? (String(h).match(BTN) || [""])[0] : "";
                    return o + (bt ? " " + bt : "");
                } catch (e) { warn("pol", e); }
                return h;
            };
        }
    } catch (e) { warn("pol-wrap", e); }

    /* ── (1b) 航空の注意：r8b（書類の画面の判断の表で航空・建値が海上の条件）の文を、その言語で ── */
    const P_AIR = /^輸送は(航空|クーリエ|郵便)にしています。<span class="v92doc-warn">要確認：([A-Z]{3}) は海上・内陸水路の輸送の条件です（インコタームズ 2020）。航空なら ([A-Z]{3}) などが一般的です。/;
    try {
        if (typeof v92docAirNote === "function") {
            const __an = v92docAirNote;
            v92docAirNote = function (this: any, S: any, cd: any) {
                const self = this, a = arguments;
                const h = __an.apply(self, a as any);
                try {
                    if (lg() === "ja" || !h) return h;
                    const hj = String(asJa(() => __an.apply(self, a as any)) || "");
                    const m = hj.match(P_AIR);
                    if (!m) return h;
                    const md = m[1], c = docE(m[2]), alt = docE(m[3]);
                    const mode = md === "クーリエ" ? L3("courier", "快递", "por mensajería") : md === "郵便" ? L3("post", "邮政", "por correo") : L3("air", "空运", "aéreo");
                    return L3(`Transport is set to ${mode}. <span class="v92doc-warn">Please check: ${c} is a rule for sea and inland waterway transport (Incoterms 2020). For air, ${alt} is generally used. Agree the rule with the buyer and change it in “Edit order details”.</span>`,
                        `运输方式为${mode}。<span class="v92doc-warn">请确认：${c} 是海运及内河运输的条件（2020 年国际贸易术语）。空运一般使用 ${alt}。请与对方确认，并在“编辑订单内容”中修改贸易条件。</span>`,
                        `El transporte es ${mode}. <span class="v92doc-warn">Revise: ${c} es una regla para transporte marítimo y fluvial (Incoterms 2020). Para aéreo se usa normalmente ${alt}. Acuérdelo con el comprador y cámbielo en «Editar el pedido».</span>`);
                } catch (e) { warn("air", e); }
                return h;
            };
        }
    } catch (e) { warn("air-wrap", e); }

    /* ── (2) 分析の「金額の内訳」の窓（r6b の窓・r8a の書き換え）：中国語・スペイン語 ──
          r8a は、注文ごとに足すようにした数え方の文と、見出しの「（注文 N件）」を、日本語・英語の文だけ書き換えていた
          （中国語の見出しは r6b の文と違う形で探していて当たらない）。中・西では「每个案件一个金额／Un importe por caso」のまま、
          同じ窓の札（注文ごとの額）と食い違っていた。あわせて、集計範囲の名前（dashScopeName の「全社」）が data-noi18n の中で訳されずに残る（r6b から）。 */
    const ZH_OLD = "每个案件一个金额（有单据取单据金额，否则取记录的确定单价×数量）。";
    const ZH_NEW = "接单金额按订单相加（同一客户第2条起的“成交”记录也各算一个订单；该订单有单据取单据金额，否则取记录的确定单价×数量）。报价金额每个案件一个（有报价单取其金额，否则取记录的单价×数量）。";
    const ES_OLD = "Un importe por caso (documento si existe; si no, precio confirmado × cantidad).";
    const ES_NEW = "Pedidos: se suma cada pedido (cada registro «ganado» posterior del mismo comprador es un pedido aparte; importe de su documento si existe, si no, precio confirmado × cantidad). Cotizaciones: un importe por caso.";
    const SCOPE_WORDS = ["全社", "商品", "グループ"];
    const drillLang = () => {
        try {
            const l = lg();
            if (l === "ja") return;
            const root: any = document.getElementById("v92r6bDrill");
            if (!root) return;
            const ps: any[] = Array.from(root.querySelectorAll("p.nn"));
            // 集計範囲の名前（全社・商品・グループ）：辞書の訳（日本語が残らないものだけ）
            try {
                const nm = typeof dashScopeName === "function" ? String(dashScopeName() || "") : "";
                const tr = SCOPE_WORDS.indexOf(nm) >= 0 ? port(nm) : "";
                if (tr && tr !== nm && ps[0]) {
                    const t = String(ps[0].textContent || "");
                    const t2 = t.replace(/^(Scope: |统计范围：|Ámbito: )([^／/]*?)( \/ |／)/, (m0: string, a: string, b0: string, c: string) => b0.trim() === nm ? a + tr + c : m0);
                    if (t2 !== t) ps[0].textContent = t2;
                }
            } catch (e) { }
            if (l !== "zh" && l !== "es") return;
            // 数え方の文
            ps.forEach((p: any) => {
                const t = String(p.textContent || "");
                if (l === "zh" && t.indexOf(ZH_OLD) >= 0) p.textContent = t.replace(ZH_OLD, ZH_NEW).replace("接单＝商谈记录为“受注”", "接单＝商谈记录为“成交”");
                else if (l === "es" && t.indexOf(ES_OLD) >= 0) p.textContent = t.replace(ES_OLD, ES_NEW);
            });
            // 見出しの注文の数（r8a と同じ数：dashAgg の v92nOrd）
            if (root.getAttribute("data-kind") && !/won|order|money/.test(String(root.getAttribute("data-kind")))) return;
            const A = (typeof dashAgg === "function" && typeof dashScopeUnits === "function") ? dashAgg(dashScopeUnits()) : null;
            const nO = (A && +A.v92nOrd) || 0, nC = ((A && A.orders) || []).length;
            if (nO > nC && ps[0]) {
                const t = String(ps[0].textContent || "");
                const t2 = l === "zh" ? t.replace(/已接单案件 (\d+)件・/, (m0: string, a: string) => `已接单案件 ${a}件（订单 ${nO}个）・`)
                    : t.replace(/(\d+) caso\(s\) con pedido, /, (m0: string, a: string) => `${a} caso(s) con pedido (${nO} pedidos), `);
                if (t2 !== t) ps[0].textContent = t2;
            }
        } catch (e) { warn("drill", e); }
    };
    try {
        if (typeof dashDrill === "function") {
            const __dd = dashDrill;
            dashDrill = function (this: any) {
                const r = __dd.apply(this, arguments as any);
                try { drillLang(); } catch (e) { }
                return r;
            };
        }
    } catch (e) { warn("drill-wrap", e); }

    W.v92r8x = { polLang, drillLang };
})();
