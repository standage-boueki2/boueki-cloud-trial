(function () {
    const W = window;
    if (W.__v2192r8x)
        return;
    W.__v2192r8x = 1;
    const warn = (w, e) => { try {
        console.warn("[r8x] " + w, e);
    }
    catch (x) { } };
    const lg = () => { try {
        const v = String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja");
        return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
    }
    catch (e) {
        return "ja";
    } };
    const L3 = (en, zh, es) => { const l = lg(); return l === "zh" ? zh : l === "es" ? es : en; };
    const asJa = (f) => {
        if (typeof I18N === "undefined" || !I18N)
            return f();
        const l0 = I18N.lang;
        try {
            I18N.lang = "ja";
            return f();
        }
        finally {
            I18N.lang = l0;
        }
    };
    const unE = (s) => String(s || "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    const docE = (s) => { try {
        return typeof v92docE === "function" ? v92docE(s) : String(s);
    }
    catch (e) {
        return String(s);
    } };
    const JP = /[ぁ-ゖァ-ヺ一-鿿]/, KANA = /[ぁ-ゖァ-ヺ]/;
    const port = (s) => {
        const v = String(s == null ? "" : s);
        try {
            const d = I18N && I18N.dict && I18N.dict[lg()];
            const t = d && typeof d[v] === "string" ? d[v] : null;
            return t && !(lg() === "zh" ? KANA : JP).test(t) ? t : v;
        }
        catch (e) {
            return v;
        }
    };
    const b = (s) => `<b data-noi18n>${docE(s)}</b>`;
    const RX_B = "<b data-noi18n>([\\s\\S]*?)<\\/b>";
    const P_TERM = new RegExp("^仕出港（積出港）は、商品情報の取引条件「" + RX_B + "」の港 " + RX_B + " です。");
    const P_POL = new RegExp("^仕出港（積出港）は、商品情報に登録の " + RX_B + " から入れています。");
    const P_REC = new RegExp("^仕出港（積出港）は、商談の記録の取引条件「" + RX_B + "」から入れています。");
    const P_PP = new RegExp("^仕出港（積出港）は、価格表の建値の港 " + RX_B + " から入れています。");
    const P_CASE = new RegExp("^仕出港（積出港）は、この案件の取引条件「" + RX_B + "」の港 " + RX_B + " です。");
    const W_REG = /<span class="v92doc-warn">要確認：商品情報の仕出港は <span data-noi18n>([\s\S]*?)<\/span> です。どちらから出すか確かめてください。<\/span>/;
    const W_CLASH = /<span class="v92doc-warn">要確認：取引条件の港と商品情報の仕出港（<span data-noi18n>([\s\S]*?)<\/span>）が違います。どちらかにそろえてください。<\/span>/;
    const BTN = /<button type="button" class="btn g" data-v92act="pol"[\s\S]*?<\/button>/;
    const polLang = (hj) => {
        let m, o = "";
        if ((m = hj.match(P_REC))) {
            const t = unE(m[1]).trim();
            const i = t.indexOf(" ");
            const rt = i > 0 ? t.slice(0, i) + " " + port(t.slice(i + 1)) : t;
            o = L3(`Port of loading: taken from the trade terms ${b(rt)} in the meeting record.`, `装运港取自商谈记录的交易条件“${b(rt)}”。`, `Puerto de carga: tomado de las condiciones ${b(rt)} del registro de la reunión.`);
        }
        else if ((m = hj.match(P_CASE))) {
            const tm = b(unE(m[1])), nm = b(port(unE(m[2])));
            o = L3(`Port of loading: ${nm}, the port in this case's trade terms “${tm}”.`, `装运港为本案件交易条件“${tm}”中的港口 ${nm}。`, `Puerto de carga: ${nm}, el puerto de las condiciones «${tm}» de este caso.`);
        }
        else if ((m = hj.match(P_TERM))) {
            const tm = b(unE(m[1])), nm = b(port(unE(m[2])));
            o = L3(`Port of loading: ${nm}, the port in the trade terms “${tm}” in Product info.`, `装运港为商品信息交易条件“${tm}”中的港口 ${nm}。`, `Puerto de carga: ${nm}, el puerto de las condiciones «${tm}» de la información del producto.`);
        }
        else if ((m = hj.match(P_POL))) {
            const nm = b(port(unE(m[1])));
            o = L3(`Port of loading: ${nm}, as registered in Product info.`, `装运港取自商品信息中登记的 ${nm}。`, `Puerto de carga: ${nm}, según lo registrado en la información del producto.`);
        }
        else if ((m = hj.match(P_PP))) {
            const nm = b(port(unE(m[1])));
            o = L3(`Port of loading: ${nm}, the port in the price list's trade term.`, `装运港取自价格表贸易术语中的港口 ${nm}。`, `Puerto de carga: ${nm}, el puerto del término comercial de la lista de precios.`);
        }
        else
            return null;
        if ((m = hj.match(W_REG))) {
            const r = `<span data-noi18n>${docE(port(unE(m[1])))}</span>`;
            o += ` <span class="v92doc-warn">${L3(`Please check: the port of loading in Product info is ${r}. Confirm which port it ships from.`, `需确认：商品信息中的装运港为 ${r}。请确认从哪个港口发货。`, `Revise: el puerto de carga de la información del producto es ${r}. Confirme desde qué puerto se envía.`)}</span>`;
        }
        else if ((m = hj.match(W_CLASH))) {
            const r = `<span data-noi18n>${docE(port(unE(m[1])))}</span>`;
            o += ` <span class="v92doc-warn">${L3(`Check: the port in the trade terms differs from the port of loading in Product info (${r}). Make them the same.`, `需确认：交易条件中的港口与商品信息中的装运港（${r}）不同。请统一为其中一个。`, `Revise: el puerto de las condiciones no coincide con el puerto de carga de la información del producto (${r}). Unifíquelos.`)}</span>`;
        }
        return o;
    };
    try {
        if (typeof v92docPolNote === "function") {
            const __pn = v92docPolNote;
            v92docPolNote = function (S) {
                const self = this, a = arguments;
                const h = __pn.apply(self, a);
                try {
                    if (lg() === "ja" || !h || !S || !S.v92pol)
                        return h;
                    const hj = String(asJa(() => __pn.apply(self, a)) || "");
                    const o = hj ? polLang(hj) : null;
                    if (o == null)
                        return h;
                    const bt = BTN.test(hj) ? (String(h).match(BTN) || [""])[0] : "";
                    return o + (bt ? " " + bt : "");
                }
                catch (e) {
                    warn("pol", e);
                }
                return h;
            };
        }
    }
    catch (e) {
        warn("pol-wrap", e);
    }
    const P_AIR = /^輸送は(航空|クーリエ|郵便)にしています。<span class="v92doc-warn">要確認：([A-Z]{3}) は海上・内陸水路の輸送の条件です（インコタームズ 2020）。航空なら ([A-Z]{3}) などが一般的です。/;
    try {
        if (typeof v92docAirNote === "function") {
            const __an = v92docAirNote;
            v92docAirNote = function (S, cd) {
                const self = this, a = arguments;
                const h = __an.apply(self, a);
                try {
                    if (lg() === "ja" || !h)
                        return h;
                    const hj = String(asJa(() => __an.apply(self, a)) || "");
                    const m = hj.match(P_AIR);
                    if (!m)
                        return h;
                    const md = m[1], c = docE(m[2]), alt = docE(m[3]);
                    const mode = md === "クーリエ" ? L3("courier", "快递", "por mensajería") : md === "郵便" ? L3("post", "邮政", "por correo") : L3("air", "空运", "aéreo");
                    return L3(`Transport is set to ${mode}. <span class="v92doc-warn">Please check: ${c} is a rule for sea and inland waterway transport (Incoterms 2020). For air, ${alt} is generally used. Agree the rule with the buyer and change it in “Edit order details”.</span>`, `运输方式为${mode}。<span class="v92doc-warn">请确认：${c} 是海运及内河运输的条件（2020 年国际贸易术语）。空运一般使用 ${alt}。请与对方确认，并在“编辑订单内容”中修改贸易条件。</span>`, `El transporte es ${mode}. <span class="v92doc-warn">Revise: ${c} es una regla para transporte marítimo y fluvial (Incoterms 2020). Para aéreo se usa normalmente ${alt}. Acuérdelo con el comprador y cámbielo en «Editar el pedido».</span>`);
                }
                catch (e) {
                    warn("air", e);
                }
                return h;
            };
        }
    }
    catch (e) {
        warn("air-wrap", e);
    }
    const ZH_OLD = "每个案件一个金额（有单据取单据金额，否则取记录的确定单价×数量）。";
    const ZH_NEW = "接单金额按订单相加（同一客户第2条起的“成交”记录也各算一个订单；该订单有单据取单据金额，否则取记录的确定单价×数量）。报价金额每个案件一个（有报价单取其金额，否则取记录的单价×数量）。";
    const ES_OLD = "Un importe por caso (documento si existe; si no, precio confirmado × cantidad).";
    const ES_NEW = "Pedidos: se suma cada pedido (cada registro «ganado» posterior del mismo comprador es un pedido aparte; importe de su documento si existe, si no, precio confirmado × cantidad). Cotizaciones: un importe por caso.";
    const SCOPE_WORDS = ["全社", "商品", "グループ"];
    const drillLang = () => {
        try {
            const l = lg();
            if (l === "ja")
                return;
            const root = document.getElementById("v92r6bDrill");
            if (!root)
                return;
            const ps = Array.from(root.querySelectorAll("p.nn"));
            try {
                const nm = typeof dashScopeName === "function" ? String(dashScopeName() || "") : "";
                const tr = SCOPE_WORDS.indexOf(nm) >= 0 ? port(nm) : "";
                if (tr && tr !== nm && ps[0]) {
                    const t = String(ps[0].textContent || "");
                    const t2 = t.replace(/^(Scope: |统计范围：|Ámbito: )([^／/]*?)( \/ |／)/, (m0, a, b0, c) => b0.trim() === nm ? a + tr + c : m0);
                    if (t2 !== t)
                        ps[0].textContent = t2;
                }
            }
            catch (e) { }
            if (l !== "zh" && l !== "es")
                return;
            ps.forEach((p) => {
                const t = String(p.textContent || "");
                if (l === "zh" && t.indexOf(ZH_OLD) >= 0)
                    p.textContent = t.replace(ZH_OLD, ZH_NEW).replace("接单＝商谈记录为“受注”", "接单＝商谈记录为“成交”");
                else if (l === "es" && t.indexOf(ES_OLD) >= 0)
                    p.textContent = t.replace(ES_OLD, ES_NEW);
            });
            if (root.getAttribute("data-kind") && !/won|order|money/.test(String(root.getAttribute("data-kind"))))
                return;
            const A = (typeof dashAgg === "function" && typeof dashScopeUnits === "function") ? dashAgg(dashScopeUnits()) : null;
            const nO = (A && +A.v92nOrd) || 0, nC = ((A && A.orders) || []).length;
            if (nO > nC && ps[0]) {
                const t = String(ps[0].textContent || "");
                const t2 = l === "zh" ? t.replace(/已接单案件 (\d+)件・/, (m0, a) => `已接单案件 ${a}件（订单 ${nO}个）・`)
                    : t.replace(/(\d+) caso\(s\) con pedido, /, (m0, a) => `${a} caso(s) con pedido (${nO} pedidos), `);
                if (t2 !== t)
                    ps[0].textContent = t2;
            }
        }
        catch (e) {
            warn("drill", e);
        }
    };
    try {
        if (typeof dashDrill === "function") {
            const __dd = dashDrill;
            dashDrill = function () {
                const r = __dd.apply(this, arguments);
                try {
                    drillLang();
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("drill-wrap", e);
    }
    W.v92r8x = { polLang, drillLang };
})();
