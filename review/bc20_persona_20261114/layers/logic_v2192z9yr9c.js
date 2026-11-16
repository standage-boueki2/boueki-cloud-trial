(function () {
    const W = window;
    if (W.__v2192r9c)
        return;
    W.__v2192r9c = 1;
    const ERR = [];
    const warn = (k, e) => { try {
        ERR.push(k + ": " + String((e && e.message) || e).slice(0, 140));
        if (ERR.length > 30)
            ERR.shift();
    }
    catch (x) { } };
    const lg = () => { try {
        return String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja");
    }
    catch (e) {
        return "ja";
    } };
    const L3 = (en, zh, es) => lg() === "zh" ? zh : lg() === "es" ? es : en;
    const JP = /[ぁ-ゖァ-ヺ一-鿿々]/, KANA = /[ぁ-ゖァ-ヺ]/;
    const hasJ = (s) => (lg() === "zh" ? KANA : JP).test(String(s));
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const el = (id) => document.getElementById(id);
    const MINE = { en: {}, zh: {}, es: {} };
    const PATS = [];
    let DI = null;
    try {
        if (typeof I18N !== "undefined" && I18N && I18N.dict) {
            DI = I18N.dict;
            ["en", "zh", "es"].forEach((l) => { if (!DI[l])
                DI[l] = {}; });
        }
    }
    catch (e) { }
    const tr = (x) => { try {
        const r = i18nStr(String(x), (DI && DI[lg()]) || {});
        return r == null ? String(x) : r;
    }
    catch (e) {
        return String(x);
    } };
    const TR = (ja, en, zh, es) => { if (!DI)
        return; if (DI.en[ja] == null && en)
        DI.en[ja] = en; if (DI.zh[ja] == null && zh)
        DI.zh[ja] = zh; if (DI.es[ja] == null && es)
        DI.es[ja] = es; };
    const TN = (ja, en, zh, es) => { TR(ja, en, zh, es); MINE.en[ja] = en; MINE.zh[ja] = zh; MINE.es[ja] = es; };
    const TZ = (ja, zh, es) => { if (!DI)
        return; if (DI.zh[ja] == null && zh)
        DI.zh[ja] = zh; if (DI.es[ja] == null && es)
        DI.es[ja] = es; };
    const HOLE = /\{[A-Za-z]\w*\}/;
    const G = (f) => (m) => { for (let i = 1; i < m.length; i++)
        if (m[i] && HOLE.test(m[i]))
            return null; return f(m); };
    const PF = (re, f0) => { const f = G(f0); PATS.push({ re, en: f, zh: f, es: f }); };
    const PE = (re, f0) => { const f = G(f0); PATS.push({ re, en: f, es: f }); };
    const smp = (s) => String(s).replace(/^\[見本\] ?/, L3("[Sample] ", "[示例] ", "[Muestra] ")).replace(/（見本）\s*$/, L3(" (sample)", "（示例）", " (muestra)"));
    const par = (s) => lg() === "zh" ? "（" + s + "）" : " (" + s + ")";
    let CSET = null, REV = null;
    const nk = (s) => { let x = String(s == null ? "" : s).trim(); try {
        x = x.normalize("NFKD").replace(/[̀-ͯ]/g, "");
    }
    catch (e) { } return x.toLowerCase().replace(/^the\s+/, "").replace(/[\s.\-'’_,·・]/g, ""); };
    const EXTRA = {
        "アメリカ": ["USA", "U.S.A.", "U.S.", "US", "America", "United States of America", "the United States", "EE. UU.", "EEUU", "EE.UU.", "Estados Unidos de América", "美國", "美利坚合众国"],
        "ベトナム": ["Viet Nam", "Việt Nam", "Vietnã", "越南社会主义共和国"],
        "イギリス": ["UK", "U.K.", "Britain", "Great Britain", "England", "Gran Bretaña", "Inglaterra", "大不列颠"],
        "韓国": ["Korea", "Republic of Korea", "Corea", "南韩", "韓國", "大韩民国"],
        "UAE": ["United Arab Emirates", "U.A.E.", "Emiratos Árabes Unidos", "阿拉伯联合酋长国", "Dubai", "Dubái", "迪拜"],
        "香港": ["Hong Kong SAR", "HK", "香港特别行政区"],
        "台湾": ["Taiwan ROC", "台灣", "臺灣"],
        "中国": ["PRC", "People's Republic of China", "Mainland China", "中国大陆", "中國"],
        "サウジアラビア": ["Saudi", "KSA", "Arabia Saudí", "Arabia Saudita", "沙特", "沙特阿拉伯"],
        "オランダ": ["Holland", "The Netherlands", "Holanda"],
        "トルコ": ["Turkey", "Turkiye", "Turquia"],
        "チェコ": ["Czech Republic", "República Checa"],
        "ドイツ": ["Deutschland"],
        "ミャンマー": ["Burma", "Birmania"],
        "マカオ": ["Macao", "Macau", "澳門"],
        "メキシコ": ["Méjico"],
        "シンガポール": ["Singapore", "Singapur", "新加坡"],
        "フィリピン": ["Philippines", "Filipinas", "菲律宾"],
        "ハンガリー": ["Hungary", "Hungría", "匈牙利"],
        "コートジボワール": ["Côte d'Ivoire", "Cote d'Ivoire", "Ivory Coast", "Costa de Marfil", "科特迪瓦"],
        "セネガル": ["Senegal", "塞内加尔"],
        "日本": ["Japan", "Japón", "Nippon"],
    };
    const cset = () => {
        if (CSET)
            return CSET;
        const S = [];
        const add = (a) => { try {
            (a || []).forEach((c) => { c = String(c || "").trim(); if (c && S.indexOf(c) < 0)
                S.push(c); });
        }
        catch (e) { } };
        try {
            add(typeof KNOWN_CTY !== "undefined" ? KNOWN_CTY : []);
        }
        catch (e) { }
        try {
            add(typeof BN_CC !== "undefined" ? Object.keys(BN_CC) : []);
        }
        catch (e) { }
        try {
            add(typeof CTY_REGION !== "undefined" ? [].concat(...Object.values(CTY_REGION)) : []);
        }
        catch (e) { }
        try {
            add(typeof ctyAll === "function" ? ctyAll() : []);
        }
        catch (e) { }
        try {
            add(typeof V16_CTRY !== "undefined" ? V16_CTRY : []);
        }
        catch (e) { }
        try {
            add(typeof V83M_TLD !== "undefined" ? Object.values(V83M_TLD) : []);
        }
        catch (e) { }
        try {
            add(typeof DDP_TAX !== "undefined" ? Object.keys(DDP_TAX) : []);
        }
        catch (e) { }
        add(Object.keys(EXTRA));
        try {
            add(typeof CTRY !== "undefined" ? CTRY : []);
        }
        catch (e) { }
        if (S.length < 20)
            return S;
        CSET = S;
        const R = {};
        const put = (name, ja) => { const k = nk(name); if (k && R[k] == null)
            R[k] = ja; };
        S.forEach((c) => put(c, c));
        ["en", "zh", "es"].forEach((l) => S.forEach((c) => { try {
            const v = DI && DI[l] && DI[l][c];
            if (typeof v === "string" && v && v !== c)
                put(v, c);
        }
        catch (e) { } }));
        Object.keys(EXTRA).forEach((c) => EXTRA[c].forEach((a) => put(a, c)));
        REV = R;
        return S;
    };
    const isCty = (c) => { try {
        return cset().indexOf(String(c)) >= 0;
    }
    catch (e) {
        return false;
    } };
    const ctyOf = (s) => { try {
        cset();
        if (!REV)
            return "";
        return REV[nk(s)] || "";
    }
    catch (e) {
        return "";
    } };
    const CN_X = { "ハンガリー": ["Hungary", "匈牙利", "Hungría"], "コートジボワール": ["Côte d'Ivoire", "科特迪瓦", "Costa de Marfil"], "セネガル": ["Senegal", "塞内加尔", "Senegal"], "ドバイ": ["Dubai", "迪拜", "Dubái"], "豪州": ["Australia", "澳大利亚", "Australia"] };
    Object.keys(CN_X).forEach((k) => TR(k, CN_X[k][0], CN_X[k][1], CN_X[k][2]));
    const ctyName = (c) => { const s = String(c == null ? "" : c); const l = lg(); if (l === "ja" || !s)
        return s; try {
        const v = DI && DI[l] && DI[l][s];
        if (typeof v === "string" && v && !hasJ(v))
            return v;
    }
    catch (e) { } return s; };
    try {
        if (typeof cnorm === "function") {
            const __cn = cnorm;
            cnorm = function (s) {
                const r = __cn.apply(this, arguments);
                try {
                    const t = String(r == null ? "" : r).trim();
                    if (!t || isCty(t))
                        return r;
                    const j = ctyOf(t) || ctyOf(t.replace(/[（(].*?[)）]/g, ""));
                    if (j)
                        return j;
                }
                catch (e) {
                    warn("cnorm", e);
                }
                return r;
            };
        }
        if (typeof c30RoundOf === "function") {
            const __rd = c30RoundOf;
            c30RoundOf = function (b, c) {
                try {
                    if (c && typeof cnorm === "function") {
                        const a = Array.prototype.slice.call(arguments);
                        a[1] = cnorm(c);
                        return __rd.apply(this, a);
                    }
                }
                catch (e) { }
                return __rd.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("cty", e);
    }
    TR("判定にはあと次が要ります", "To judge, these are still needed", "判定还需要以下信息", "Para el juicio aún falta");
    TR("当てはまるか分からない規則", "rules not yet known to apply", "尚不确定是否适用的规则", "reglas cuya aplicación aún no se sabe");
    TR("未選択", "not selected", "未选择", "sin seleccionar");
    TR("まだ記録はありません", "No records yet", "暂无记录", "Aún no hay registros");
    TR("バイヤー名と国は必須です", "Buyer name and country are required", "买家名称和国家为必填项", "El nombre del comprador y el país son obligatorios");
    PF(/^案件 ([A-Z]{2}-\d{4}-\d+)（(.+?)）を開始しました$/, (m) => L3("Started case " + m[1] + " (" + ctyName(m[2]) + ")", "已开始案件 " + m[1] + "（" + ctyName(m[2]) + "）", "Caso " + m[1] + " iniciado (" + ctyName(m[2]) + ")"));
    const WHY = [["価格が合わない", "Price doesn't match", "价格不合适", "El precio no encaja"], ["認証・規制がネック", "Certification / regulations are a hurdle", "认证・法规是障碍", "Certificación o regulaciones son un obstáculo"],
        ["納期が長い", "Lead time too long", "交货期太长", "Plazo de entrega demasiado largo"], ["最小ロットが大きい", "MOQ too large", "最小起订量太大", "Lote mínimo demasiado grande"],
        ["既存仕入先を継続", "Stayed with existing supplier", "继续使用现有供应商", "Siguen con su proveedor actual"], ["反応が消えた", "Went silent", "失去回应", "Dejó de responder"]];
    WHY.forEach((r) => TR(r[0], r[1], r[2], r[3]));
    const whyName = (j) => { const r = WHY.find((x) => x[0] === j); return r ? L3(r[1], r[2], r[3]) : tr(j); };
    const buyersNow = () => { try {
        return typeof myBuyers === "function" ? (myBuyers() || []).filter((b) => b && b.co) : [];
    }
    catch (e) {
        return [];
    } };
    const buyerByShown = (v) => { const k = String(v || "").trim(); if (!k)
        return null; const B = buyersNow(); return B.find((b) => String(b.co) === k) || B.find((b) => smp(String(b.co)) === k) || null; };
    const dealFormFix = () => {
        const f = el("dfC"), b = el("dfB");
        if (!f || !b)
            return;
        const ja = lg() === "ja";
        if (ja && !f.dataset.r9c)
            return;
        const dl = el("dfCL");
        if (dl)
            Array.from(dl.querySelectorAll("option")).forEach((o) => { const v = String(o.value || ""); if (!o.dataset.r9c) {
                o.dataset.r9c = v;
            } const t = ja ? o.dataset.r9c : ctyName(o.dataset.r9c); if (o.value !== t)
                o.value = t; });
        const wl = el("dfWL");
        if (wl)
            Array.from(wl.querySelectorAll("option")).forEach((o) => { if (!o.dataset.r9c)
                o.dataset.r9c = String(o.value || ""); const t = ja ? o.dataset.r9c : whyName(o.dataset.r9c); if (o.value !== t)
                o.value = t; });
        const bl = el("v92r7bBL");
        if (bl)
            Array.from(bl.querySelectorAll("option")).forEach((o) => { if (!o.dataset.r9c) {
                o.dataset.r9c = String(o.value || "");
                o.dataset.r9cc = String(o.textContent || "");
            } const t = ja ? o.dataset.r9c : smp(o.dataset.r9c); if (o.value !== t)
                o.value = t; const c = ja ? o.dataset.r9cc : ctyName(o.dataset.r9cc); if (o.textContent !== c)
                o.textContent = c; });
        const showCty = () => { try {
            const v = String(f.value || "").trim();
            if (!v)
                return;
            if (lg() === "ja") {
                if (!isCty(v)) {
                    const j = ctyOf(v);
                    if (j)
                        f.value = j;
                }
                return;
            }
            if (isCty(v)) {
                const t = ctyName(v);
                if (t !== v)
                    f.value = t;
            }
        }
        catch (e) { } };
        if (!f.dataset.r9c) {
            f.dataset.r9c = "1";
            f.addEventListener("input", showCty);
            f.addEventListener("change", showCty);
            const fillCty = () => { try {
                if (lg() === "ja")
                    return;
                const x = buyerByShown(b.value);
                if (x && x.cty && !String(f.value || "").trim())
                    f.value = ctyName(x.cty);
                showCty();
            }
            catch (e) { } };
            b.addEventListener("input", fillCty);
            b.addEventListener("change", fillCty);
        }
        showCty();
    };
    try {
        if (typeof openDealForm === "function") {
            const __odf = openDealForm;
            openDealForm = function () {
                const r = __odf.apply(this, arguments);
                try {
                    dealFormFix();
                    setTimeout(dealFormFix, 60);
                }
                catch (e) {
                    warn("dealform", e);
                }
                return r;
            };
        }
        if (typeof dealSave === "function") {
            const __ds = dealSave;
            dealSave = function () {
                try {
                    if (lg() !== "ja") {
                        const b = el("dfB");
                        if (b) {
                            const x = buyerByShown(b.value);
                            if (x && String(b.value).trim() !== String(x.co))
                                b.value = x.co;
                        }
                        const w = el("dfWhy");
                        if (w) {
                            const v = String(w.value || "").trim();
                            const r = WHY.find((y) => y.slice(1).indexOf(v) >= 0);
                            if (r)
                                w.value = r[0];
                        }
                    }
                }
                catch (e) {
                    warn("dealsave", e);
                }
                const r = __ds.apply(this, arguments);
                try {
                    setTimeout(polish, 350);
                    setTimeout(polish, 1300);
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) {
        warn("deal", e);
    }
    const INCO = {
        "売り手の施設で引き渡す（輸出の通関・積み込みは買い手）": ["delivered at the seller's premises (export clearance and loading by the buyer)", "在卖方场所交货（出口报关・装货由买方负责）", "entrega en las instalaciones del vendedor (despacho de exportación y carga a cargo del comprador)"],
        "船に積んだところまで（海上運賃・保険は買い手）": ["up to loading on the vessel (ocean freight and insurance by the buyer)", "至货物装上船为止（海运费・保险由买方负责）", "hasta la carga en el buque (flete marítimo y seguro a cargo del comprador)"],
        "船の横まで（積み込み・海上運賃は買い手）": ["alongside the vessel (loading and ocean freight by the buyer)", "至船边（装船・海运费由买方负责）", "al costado del buque (carga y flete a cargo del comprador)"],
        "指定の場所で運送人に引き渡す（主な運賃は買い手）": ["handed to the carrier at the named place (main freight by the buyer)", "在指定地点交给承运人（主要运费由买方负责）", "entrega al transportista en el lugar convenido (flete principal a cargo del comprador)"],
        "仕向港までの海上運賃を売り手が払う（運送中のリスクは買い手）": ["seller pays ocean freight to the destination port (transit risk on the buyer)", "卖方支付至目的港的海运费（运输途中的风险由买方承担）", "el vendedor paga el flete hasta el puerto de destino (riesgo en tránsito del comprador)"],
        "仕向港までの海上運賃と保険を売り手が払う": ["seller pays ocean freight and insurance to the destination port", "卖方支付至目的港的海运费和保险", "el vendedor paga flete y seguro hasta el puerto de destino"],
        "仕向地までの運賃を売り手が払う（運送中のリスクは買い手）": ["seller pays freight to the destination (transit risk on the buyer)", "卖方支付至目的地的运费（运输途中的风险由买方承担）", "el vendedor paga el transporte hasta destino (riesgo en tránsito del comprador)"],
        "仕向地までの運賃と保険を売り手が払う": ["seller pays freight and insurance to the destination", "卖方支付至目的地的运费和保险", "el vendedor paga transporte y seguro hasta destino"],
        "指定の場所まで運ぶ費用とリスクを売り手が持つ（輸入通関は買い手）": ["seller bears cost and risk to the named place (import clearance by the buyer)", "卖方承担运至指定地点的费用和风险（进口报关由买方负责）", "el vendedor asume coste y riesgo hasta el lugar convenido (despacho de importación del comprador)"],
        "指定の場所で荷卸しまで売り手が持つ（輸入通関は買い手）": ["seller bears everything up to unloading at the named place (import clearance by the buyer)", "卖方负责至指定地点卸货为止（进口报关由买方负责）", "el vendedor asume todo hasta la descarga en el lugar convenido (despacho de importación del comprador)"],
        "指定の場所まで運び、輸入の関税・税も売り手が払う": ["seller delivers to the named place and also pays import duties and taxes", "卖方运至指定地点，并支付进口关税・税费", "el vendedor entrega en el lugar convenido y paga también aranceles e impuestos de importación"],
    };
    PF(/^([A-Z]{3})＝(.+?)：(.+)。$/, (m) => { const w = INCO[m[3]]; if (!w)
        return null; const nm = tr(m[2]); const n2 = hasJ(nm) ? "" : (lg() === "zh" ? "（" + nm + "）" : " (" + nm + ")"); return L3(m[1] + n2 + ": " + w[0] + ".", m[1] + n2 + "：" + w[1] + "。", m[1] + n2 + ": " + w[2] + "."); });
    TR("先方の希望は、自社の価格表の範囲に入っています。", "The buyer’s request is within your price list range.", "对方的期望在本公司价格表的范围内。", "La petición del comprador está dentro del rango de su lista de precios.");
    TR("先方の希望は、自社の価格表の範囲に入っています", "The buyer’s request is within your price list range", "对方的期望在本公司价格表的范围内", "La petición del comprador está dentro del rango de su lista de precios");
    TR("先方の希望は、自社の価格より", "The buyer’s request is", "对方的期望比本公司价格", "La petición del comprador está");
    TR("高い金額です。", "above your price.", "高。", "por encima de su precio.");
    TR("低い金額です。", "below your price.", "低。", "por debajo de su precio.");
    PF(/^約 (US\$[\d,.]+)(?:〜([\d,.]+))?(?:（(\d+)(?:〜(\d+))?%）)?$/, (m) => {
        const rng = m[1] + (m[2] ? L3("–", "〜", "–") + m[2] : ""), pc = m[3] ? m[3] + (m[4] ? L3("–", "〜", "–") + m[4] : "") : "";
        return L3("approx. " + rng + (pc ? " (" + pc + "%)" : ""), "约 " + rng + (pc ? "（" + pc + "%）" : ""), "aprox. " + rng + (pc ? " (" + pc + " %)" : ""));
    });
    PF(/^([：:]\s?)?((?:1 [A-Z]{3}＝[\d.,]+円・)?1 US\$＝[\d.,]+円)（(参照レート ?[\d-]*|今日の仲値)）。$/, (m) => {
        const zh = lg() === "zh";
        const rates = m[2].split("・").map((x) => x.replace(/^1 (\S+)＝([\d.,]+)円$/, (_a, c, v) => zh ? "1 " + c + "＝" + v + "日元" : "1 " + c + " = " + v + " JPY")).join(zh ? "・" : ", ");
        const d = (m[3].match(/[\d-]{8,}/) || [""])[0];
        const src = m[3] === "今日の仲値" ? L3("today's mid rate", "今日中间价", "tipo medio de hoy") : L3("reference rate", "参考汇率", "tipo de referencia") + (d ? " " + d : "");
        return (m[1] ? (zh ? "：" : ": ") : "") + (zh ? rates + "（" + src + "）。" : rates + " (" + src + "). ");
    });
    PF(/^数量（(.+?)）に当たる価格$/, (m) => L3("Price for the quantity (" + m[1] + ")", "数量（" + m[1] + "）对应的价格", "Precio para la cantidad (" + m[1] + ")"));
    const BAND = { "mileage": ["行驶里程", "kilometraje"], "operating hours": ["运转时间", "horas de uso"], "model year": ["年份", "año del modelo"] };
    const cmpFix = (h) => {
        const l = lg();
        if (l === "ja" || typeof h !== "string" || !h)
            return h;
        let s = h;
        if (l === "zh" || l === "es") {
            const zh = l === "zh";
            s = s.replace(/Price for the (mileage|operating hours|model year) band \(([^)<]*)\)/g, (_a, b, v) => zh ? BAND[b][0] + "区间（" + v + "）对应的价格" : "Precio para el tramo de " + BAND[b][1] + " (" + v + ")");
            s = s.replace(/Price for the item \(([^)<]*)\)/g, (_a, v) => zh ? "品目（" + v + "）对应的价格" : "Precio del artículo (" + v + ")");
            s = s.replace(/The price list is by “([^”<]*)”, not by quantity\./g, (_a, v) => zh ? "价格表按“" + v + "”划分（不按数量）。" : "La lista de precios va por «" + v + "», no por cantidad.");
            s = s.replace(/The (mileage|operating hours|model year) of this product is not registered, so the comparison uses the whole range\./g, (_a, b) => zh ? "该商品的" + BAND[b][0] + "未登记，因此不确定对应哪一行，按价格表的整个范围比较。" : "El dato de " + BAND[b][1] + " de este producto no está registrado; se compara con todo el rango.");
            s = s.replace(/The price list is by item \(model\)\. The record does not say which item, so the comparison uses the whole range\./g, () => zh ? "价格表按品目（型号）划分。记录中未写明是哪一品目，因此按价格表的整个范围比较。" : "La lista de precios va por artículo (modelo). El registro no indica cuál, así que se compara con todo el rango.");
        }
        if (l === "en" || l === "es")
            s = s.replace(/<\/span>：/g, "</span>: ");
        return s;
    };
    try {
        if (typeof v56dCmpHtml === "function") {
            const __h = v56dCmpHtml;
            v56dCmpHtml = function () { const h = __h.apply(this, arguments); try {
                return cmpFix(h);
            }
            catch (e) {
                return h;
            } };
        }
        if (typeof v56dCmpPlain === "function") {
            const __p = v56dCmpPlain;
            v56dCmpPlain = function () { const h = __p.apply(this, arguments); try {
                return lg() === "zh" || lg() === "es" ? cmpFix(h) : h;
            }
            catch (e) {
                return h;
            } };
        }
    }
    catch (e) {
        warn("cmp", e);
    }
    const RMT = {};
    const R = (ja, zh, es) => { RMT[ja] = [zh, es]; };
    const RMP = [];
    const RP = (re, zh, es) => { RMP.push({ re, zh, es }); };
    R("⚠ 目標と道筋を保存できませんでした（ブラウザの保存容量）", "⚠ 无法保存目标与路径（浏览器存储空间）", "⚠ No se pudo guardar el objetivo y la hoja de ruta (almacenamiento del navegador)");
    R("目標の欄を埋める（金額・年・1社あたりの取引額・体制・予算）", "填写目标栏（金额・年份・每家客户的交易额・团队・预算）", "Completar el objetivo (importe, año, ventas por comprador, equipo, presupuesto)");
    R("全社版にすると、STANDAGE の一次情報（現場の商談記録）も根拠に使えます", "切换到全公司版后，也可将 STANDAGE 的一手信息（现场商谈记录）作为依据", "Con la versión para toda la empresa también se usan los datos de primera mano de STANDAGE");
    R("① スタートライン（事前準備）", "① 起跑线（事前准备）", "① Punto de partida (preparación)");
    R("販売先国を決める（STANDAGE の記録で取引に進んだ割合が高い国も見る）", "确定销售目标国（也参考 STANDAGE 记录中成交比例高的国家）", "Elegir los países de venta (vea también dónde avanzaron más los acuerdos de STANDAGE)");
    R("規制・認証と関税を確かめる（止まる国を先に外す）", "确认法规・认证和关税（先排除走不通的国家）", "Revisar regulaciones, certificaciones y aranceles (descartar antes los países bloqueados)");
    R("輸出の価格（FOB・現地の価格）を決める", "确定出口价格（FOB・当地价格）", "Fijar los precios de exportación (FOB / precio en destino)");
    R("進出国で商標を押さえる（自社ブランドのとき）", "在目标国注册商标（自有品牌时）", "Registrar la marca en los países objetivo (si es marca propia)");
    R("OEM の受け方（最小ロット・仕様の変え方・品質の書類）を1枚にまとめる", "把 OEM 的接单方式（最小批量・规格调整・质量文件）整理成一页", "Resumir en una hoja cómo acepta pedidos OEM (lote mínimo, especificaciones, documentos de calidad)");
    R("外国語の営業資料をつくる", "制作外语营业资料", "Crear la presentación de ventas en otro idioma");
    R("販売先国 2〜3か国・規制の確認・価格表・営業資料", "2〜3个销售目标国・法规确认・价格表・营业资料", "2–3 países de venta, regulaciones revisadas, lista de precios, presentación de ventas");
    R("② 見込み顧客の発見・商談化", "② 发现潜在客户・促成商谈", "② Encontrar clientes potenciales y concretar reuniones");
    R("AIバイヤー開拓で毎月バイヤーに連絡する", "每月通过AI买家开拓联系买家", "Contactar compradores cada mes con la prospección IA");
    R("展示会に出る（対面の商談は取引に進みやすい）", "参加展会（面对面商谈更容易促成交易）", "Participar en ferias (las reuniones presenciales convierten mejor)");
    R("テスト販売・越境EC で小さく売って反応を見る", "通过试销・跨境电商小规模销售，观察反应", "Probar vendiendo poco por comercio electrónico transfronterizo");
    R("返事が来たら返信エージェントで早く返す・商談記録を残す", "收到回复后用回复代理尽快回复・留下商谈记录", "Responder rápido con el agente de respuestas y registrar cada reunión");
    R("サンプルと見積を出す", "寄送样品并提交报价", "Enviar muestras y cotizaciones");
    R("③ 売上の構築", "③ 建立销售", "③ Construir las ventas");
    R("契約の条件（支払・独占・最小ロット）を決める", "确定合同条件（付款・独家・最小批量）", "Acordar las condiciones (pago, exclusividad, lote mínimo)");
    R("初回の出荷と書類をそろえる", "准备首次出货及单据", "Preparar el primer envío y los documentos");
    R("2回目の注文につなげる（売れ方を聞いて販促を一緒に考える）", "促成第二次订单（了解销售情况，一起考虑促销）", "Lograr pedidos repetidos (pregunte cómo se vende y apoye la promoción)");
    R("取引の社数・リピートの回数", "交易客户数・复购次数", "Compradores activos y pedidos repetidos");
    R("④ 広げる（国・販路・ブランド）", "④ 扩展（国家・渠道・品牌）", "④ Expandir (países, canales, marca)");
    R("2か国目へ（1か国目で効いた売り方を写す）", "拓展第二个国家（复制在第一个国家有效的做法）", "Añadir un segundo país (replicar lo que funcionó en el primero)");
    R("国ごとの代理店の条件をそろえる", "统一各国代理商的条件", "Unificar las condiciones de los distribuidores por país");
    R("現地での認知（店頭・SNS・展示会）を広げる", "扩大在当地的认知度（门店・社交媒体・展会）", "Aumentar la notoriedad local (tiendas, redes sociales, ferias)");
    R("国の数・海外売上の比率", "国家数・海外销售占比", "Número de países y peso de las ventas en el exterior");
    R("今のペースでも届く見込み", "按目前的节奏也有望达成", "alcanzable incluso al ritmo actual");
    R("標準のペースで届く見込み", "按标准节奏有望达成", "alcanzable al ritmo estándar");
    R("挑戦のペースなら届く見込み", "按挑战节奏有望达成", "alcanzable al ritmo exigente");
    R("今の道筋では届かない見込み", "按目前的路径难以达成", "no alcanzable con el plan actual");
    R("今のペースでも届く見込みです", "按目前的节奏也有望达成", "Alcanzable incluso al ritmo actual");
    R("標準のペースで届く見込みです", "按标准节奏有望达成", "Alcanzable al ritmo estándar");
    R("挑戦のペース（展示会＋毎月の AIバイヤー開拓）なら届く見込みです", "按挑战节奏（展会＋每月AI买家开拓）有望达成", "Alcanzable al ritmo exigente (ferias + prospección IA mensual)");
    R("今の道筋では届かない見込みです。年をずらすか、打ち手を増やしましょう", "按目前的路径难以达成。请推迟年份或增加举措", "No alcanzable con el plan actual: retrase el año o añada acciones");
    R("目指す貿易の姿を教えてください。達成の年数・道筋・費用・期待できる売上をお出しします", "请告诉我们您的出口目标。我们会给出达成所需年数・路径・费用和可期待的销售额", "Cuéntenos su objetivo de exportación: le daremos los años, los pasos, los costes y las ventas esperables");
    R("STANDAGE がキックオフで最初に伺う項目と同じです（5分ほど・あとで直せます）", "与 STANDAGE 在启动会上首先询问的项目相同（约5分钟・之后可修改）", "Son las preguntas de la reunión inicial de STANDAGE (unos 5 minutos; se pueden cambiar después)");
    R("目標を入れる", "设定目标", "Fijar el objetivo");
    R("目標を入れる（5分）", "设定目标（5分钟）", "Fijar el objetivo (5 min)");
    R("AI商社マンに相談", "咨询AI商社专员", "Consultar al agente comercial IA");
    R("道筋を見直す", "重新审视路径", "Revisar la hoja de ruta");
    R("バイヤーへの連絡を増やす", "增加与买家的联系", "Contactar a más compradores");
    R("道筋に反映して見る", "反映到路径中查看", "Verlo en la hoja de ruta");
    R("3か月の見直しの時期です。目標と道筋を確かめましょう", "到了每3个月的复盘时间。请确认目标与路径", "Toca la revisión trimestral: compruebe el objetivo y la hoja de ruta");
    R("目標を直す", "修改目标", "Editar el objetivo");
    R("目標を直す（年・金額・1社あたり）", "修改目标（年份・金额・每家客户）", "Editar el objetivo (año, importe, por comprador)");
    R("見本の商品ではタスクに入れられません（体験の画面）", "示例商品无法加入任务（体验画面）", "No se pueden añadir tareas para productos de muestra (pantalla de prueba)");
    R("AI の答えが読めませんでした", "无法读取AI的回答", "No se pudo leer la respuesta de la IA");
    R("AIエンジンにつながっていません", "未连接AI引擎", "No hay motor de IA conectado");
    R("先に目標を入れてください", "请先设定目标", "Primero fije el objetivo");
    R("道筋の段階が読めませんでした", "无法读取路径的阶段", "No se pudieron leer las fases");
    R("考えられませんでした：", "无法制定：", "No se pudo planificar: ");
    R("AI で深められませんでした", "无法用AI深入分析", "La IA no pudo afinarlo");
    R("タスクにする", "设为任务", "Convertir en tarea");
    R("AI商社マンからの提案", "AI商社专员的建议", "Sugerencia del agente comercial IA");
    R("一次情報", "一手信息", "datos de primera mano");
    R("なぜ今：", "为什么是现在：", "Por qué ahora: ");
    R("AI商社マンが STANDAGE の一次情報で深めています…", "AI商社专员正在用 STANDAGE 的一手信息深入分析…", "Afinando con los datos de primera mano de STANDAGE…");
    R("目標と道筋を見る", "查看目标与路径", "Ver la hoja de ruta");
    R("一次情報で深める", "用一手信息深入分析", "Afinar con datos de primera mano");
    R("あとで", "稍后", "Más tarde");
    R("今は要らない", "现在不需要", "Ahora no");
    R("よろしければ理由を（次の提案に生かします）：", "如方便请告诉我们原因（用于下次建议）：", "Si quiere, díganos por qué (nos ayuda en próximas sugerencias):");
    R("目的", "目的", "Finalidad");
    R("目標", "目标", "Meta");
    R("金額・比率が未記入", "金额・占比未填写", "Importe y porcentaje sin indicar");
    R("目指す姿", "愿景", "Visión");
    R("目指す姿|Goal", "目标", "Objetivo");
    R("国", "国家", "Mercados");
    R("開拓しない：", "不开拓：", "Excluidos: ");
    R("販路", "渠道", "Canales");
    R("STANDAGE に期待", "对 STANDAGE 的期待", "Qué espera de STANDAGE");
    R("選ぶ", "选择", "Elegir");
    R("目指す貿易の姿（キックオフのヒアリング）", "目标中的贸易形态（启动会访谈）", "Su objetivo de exportación (entrevista inicial)");
    R("STANDAGE がキックオフで伺う項目と同じです。できるだけ数字で。分からない欄は空のままで大丈夫です（AI商社マンが仮の値で計算し、仮だと表示します）", "与 STANDAGE 在启动会上询问的项目相同。请尽量用数字填写。不清楚的栏位可以留空（AI商社专员会用暂定值计算，并标明为暂定）", "Son las preguntas de la reunión inicial de STANDAGE. Use cifras cuando pueda; puede dejar en blanco lo que no sepa (la IA calculará con valores provisionales y lo indicará)");
    R("販路開拓の目的（いくつでも）", "开拓渠道的目的（可多选）", "Finalidad (elija las que quiera)");
    R("目指す姿（できるだけ数字で）", "愿景（尽量用数字）", "Visión (con cifras si es posible)");
    R("例：今の海外売上 2億円を、新しい国・新しい取引先で 4年後に 4億円にしたい。2か月に1回、1パレットが続けて出る取引先を各国に1社つくりたい", "例：希望通过新国家・新客户，在4年后把目前2亿日元的海外销售额提高到4亿日元。希望在每个国家都有1家每2个月稳定出货1托盘的客户", "p. ej.: pasar de ¥200M a ¥400M en ventas en el exterior en 4 años con nuevos países y clientes");
    R("✨ 文章から下の欄を埋める（AI）", "✨ 根据文字填写下方栏位（AI）", "✨ Completar los campos a partir del texto (IA)");
    R("読み取っています…", "正在读取…", "Leyendo…");
    R("目標の海外売上（年・万円）", "目标海外销售额（年・万日元）", "Ventas objetivo en el exterior (¥10.000 / año)");
    R("達成したい年", "希望达成的年份", "Año objetivo");
    R("目標の海外売上の比率（%）", "目标海外销售占比（%）", "Peso objetivo de las ventas en el exterior (%)");
    R("今の全社の売上（年・万円）", "目前全公司销售额（年・万日元）", "Ventas totales actuales (¥10.000 / año)");
    R("今の海外売上（年・万円）", "目前海外销售额（年・万日元）", "Ventas actuales en el exterior (¥10.000 / año)");
    R("1社あたりの年間取引額の想定（万円）", "预计每家客户的年交易额（万日元）", "Ventas anuales esperadas por comprador (¥10.000)");
    R("空欄＝価格表と MOQ から推定", "留空＝根据价格表和 MOQ 推算", "en blanco = estimación con la lista de precios y el MOQ");
    R("開拓したい国・地域とその理由（なければ「相談したい」）", "希望开拓的国家・地区及理由（没有的话填“想咨询”）", "Países o regiones que desea y por qué (o «quiero consultarlo»)");
    R("開拓しない国とその理由（代理店がいる など）", "不开拓的国家及理由（已有代理商等）", "Países que excluye y por qué (ya tiene distribuidor, etc.)");
    R("販路の形", "渠道形式", "Tipo de canal");
    R("STANDAGE に期待すること", "对 STANDAGE 的期待", "Qué espera de STANDAGE");
    R("海外を担当する人数", "负责海外业务的人数", "Personas dedicadas a la exportación");
    R("英語でのやりとり", "英语沟通", "Comunicación en inglés");
    R("年間の海外開拓の予算", "年度海外开拓预算", "Presupuesto anual");
    R("生産の余力（月にどれだけ増やせるか）", "产能余量（每月可增加多少）", "Capacidad disponible (cuánto puede aumentar al mes)");
    R("例：月 3,000本まで増やせる", "例：每月最多可增加 3,000 件", "p. ej.: hasta +3.000 unidades al mes");
    R("強み・認証・実績は商品情報から使います：", "优势・认证・实绩取自商品信息：", "Las fortalezas, certificaciones y logros se toman de la información del producto: ");
    R("商品情報を直す", "修改商品信息", "Editar la información del producto");
    R("やめる", "取消", "Cancelar");
    R("保存して道筋を出す", "保存并生成路径", "Guardar y crear la hoja de ruta");
    R("年|Year", "年份", "Año");
    R("海外売上の見込み（上から 挑戦・標準・保守。縦の線が目標）", "海外销售额预测（从上到下：挑战・标准・保守。竖线为目标）", "Previsión de ventas en el exterior (exigente / estándar / conservadora; la línea es el objetivo)");
    R("海外売上の見込み（上から 挑戦・標準・保守。目標はグラフの外）", "海外销售额预测（从上到下：挑战・标准・保守。目标在图表之外）", "Previsión de ventas en el exterior (exigente / estándar / conservadora; el objetivo queda fuera del gráfico)");
    R("標準（保守〜挑戦）", "标准（保守〜挑战）", "Estándar (conservadora–exigente)");
    R("年後）", "年后）", " años)");
    R("10年以内には届かない", "10年内无法达成", "no se alcanza en 10 años");
    R("10年以内は届かない", "10年内无法达成", "no se alcanza en 10 años");
    R("10年以内は難しい", "10年以上", "en más de 10 años");
    R("達成の見込み", "达成预测", "Previsión");
    R("届く年（標準）", "达成年份（标准）", "Año en que se alcanza (estándar)");
    R("保守 ", "保守 ", "Conservadora ");
    R("挑戦 ", "挑战 ", "Exigente ");
    R("必要な取引の社数", "所需交易客户数", "Compradores necesarios");
    R("要る連絡のペース", "所需联系节奏", "Ritmo de contacto necesario");
    R("目標の海外売上（金額か比率）を入れると、届く年と売上の見込みを出します", "输入目标海外销售额（金额或占比）后，会显示达成年份和销售预测", "Indique un importe o porcentaje objetivo para ver la previsión");
    R("計算の前提：", "计算前提：", "Supuestos: ");
    R("確からしさ", "可信度", "Fiabilidad");
    R("売上の見込みの幅 ±", "销售预测的范围 ±", "margen ±");
    R("開く", "打开", "Abrir");
    R("いまここ", "当前位置", "Está aquí");
    R("済み", "已完成", "Hecho");
    R("STANDAGE に任せる選択肢（別途お見積り）", "可委托 STANDAGE（另行报价）", "Opción: STANDAGE (presupuesto aparte)");
    R("AI商社マンができる", "AI商社专员可完成", "La IA puede hacerlo");
    R("外部の費用の目安 ", "外部费用参考 ", "Coste externo orientativo ");
    R("＋タスク", "＋任务", "+Tarea");
    R("目安：", "参考指标：", "KPI: ");
    R("道筋（ロードマップ）", "路径（路线图）", "Hoja de ruta");
    R("決まった計算の道筋に戻す", "恢复为标准计算的路径", "Volver al plan estándar");
    R("AI商社マンの案を使う", "使用AI商社专员的方案", "Usar el plan de la IA");
    R("練り直し中…（1〜3分）", "重新规划中…（1〜3分钟）", "Replanificando… (1–3 min)");
    R("AI商社マンに練り直してもらう（一次情報＋Web）", "让AI商社专员重新规划（一手信息＋网络）", "Pedir a la IA que lo replanifique (datos de primera mano + web)");
    R("今週すぐできること", "本周马上可做的事", "Lo que puede hacer esta semana");
    R("気をつけること", "注意事项", "Riesgos");
    R("AI商社マンの案を見る", "查看AI商社专员的方案", "Ver el plan de la IA");
    R("費用", "费用", "Coste");
    R("無料の支援", "免费支援", "Apoyo gratuito");
    R("補助金", "补助金", "Subvención");
    R("費用の目安と使える支援（外部の費用）", "费用参考与可用的支援（外部费用）", "Costes orientativos y apoyos disponibles (costes externos)");
    R("展示会・商標・送料など、外部にかかる費用の目安です。出どころと確かめた日を添えています。STANDAGE の伴走（おまかせ貿易・展示会の出展支援など）は営業の担当から別途お見積りします", "展会・商标・运费等外部费用的参考，附有出处和确认日期。STANDAGE 的陪跑服务（委托贸易・参展支援等）由销售负责人另行报价", "Costes externos orientativos (ferias, marcas, envíos…), con fuente y fecha de verificación. Los servicios de STANDAGE se presupuestan aparte");
    R("項目", "项目", "Concepto");
    R("目安", "参考", "Orientativo");
    R("中身", "内容", "Detalle");
    R("出どころ", "出处", "Fuente");
    R("無料／条件あり", "免费／有条件", "Gratis / con condiciones");
    R("確認済み", "已确认", "Verificado");
    R("要確認", "需确认", "Por verificar");
    R("根拠（AI商社マンが使った知識）", "依据（AI商社专员使用的知识）", "Fundamentos (lo que usó la IA)");
    R("STANDAGE の記録（Ver.1）", "STANDAGE 的记录（Ver.1）", "Registros de STANDAGE (Ver.1)");
    R("取引に進んだ割合が高い国（同じ商材・5案件以上）", "成交比例高的国家（同类商品・5个案件以上）", "Países donde más avanzaron los acuerdos (mismo producto, 5+ proyectos)");
    R("STANDAGE の一次情報（現場の商談記録の知識カード）", "STANDAGE 的一手信息（现场商谈记录的知识卡片）", "Fichas de primera mano de STANDAGE");
    R("全社版のため、AI で練り直すときに関係するカードを最大8件読みます（毎朝更新）", "因为是全公司版，用AI重新规划时会读取最多8张相关卡片（每天早上更新）", "Se usan al replanificar con IA (hasta 8 fichas; se actualizan cada mañana)");
    R("個社版のため使っていません", "因为是单个公司版，未使用", "No se usan (modo de una sola empresa)");
    R("確かめた公的な情報（週次で更新）", "已确认的公开信息（每周更新）", "Información pública verificada (semanal)");
    R("AI商社マンの成長レベル", "AI商社专员的成长等级", "Nivel de la IA");
    R("育て方を見る", "查看培养方法", "Cómo hacerla crecer");
    R("未読", "未读", "Nuevo");
    R("表示した", "已显示", "Mostrado");
    R("取り込んだ", "已采纳", "Adoptado");
    R("提案の頻度と履歴", "建议的频率与历史", "Frecuencia e historial");
    R("AI商社マンは、貿易の進み（段階が上がった・止まっている・道筋より遅れた・新しい知識・3か月の見直し）に合わせて、1つずつ提案します。出しすぎないよう、前の提案から間をあけます", "AI商社专员会根据贸易进展（阶段上升・停滞・慢于路径・新知识・每3个月复盘）一次给出一条建议。为避免过多，会与上一条建议间隔一段时间", "Las sugerencias llegan de una en una según el avance (nueva fase, estancamiento, retraso, nueva información, revisión trimestral), con un intervalo mínimo");
    R("まだ提案はありません", "暂无建议", "Aún no hay sugerencias");
    R("目標と道筋", "目标与路径", "Objetivo y hoja de ruta");
    R("まず、目指す姿を教えてください", "首先，请告诉我们您的目标", "Primero, cuéntenos su objetivo");
    R("海外でどれだけ売りたいか（金額・比率）、いつまでに、どんな形で（自社ブランド・OEM・代理店…）。STANDAGE のキックオフと同じ項目です。", "想在海外卖多少（金额・占比）、在何时之前、以什么形式（自有品牌・OEM・代理商…）。与 STANDAGE 启动会的项目相同。", "Cuánto quiere vender (importe o porcentaje), para cuándo y cómo (marca propia, OEM, distribuidores…). Son las preguntas de la reunión inicial de STANDAGE.");
    R("見本の目標で見てみる", "用示例目标试看", "Probar con un objetivo de muestra");
    R("見本", "示例", "Muestra");
    R("直す", "修改", "Editar");
    R("目標を保存しました。道筋を出しました", "已保存目标并生成路径", "Objetivo guardado; hoja de ruta lista");
    R("（見本）海外売上を 3年で 5,000万円に。各国に継続して注文をくれる代理店を1社ずつつくる", "（示例）3年内海外销售额达到5,000万日元。在每个国家建立1家持续下单的代理商", "(Muestra) ¥50M en ventas en el exterior en 3 años, con un distribuidor que repita pedidos en cada país");
    R("先に「目指す姿」を書いてください", "请先填写“愿景”", "Primero escriba la visión");
    R("文章から欄を埋めました。確かめてから保存してください", "已根据文字填写栏位。请确认后保存", "Campos completados: revíselos y guarde");
    R("読み取れませんでした。欄に直接入れてください", "无法读取。请直接填写栏位", "No se pudo leer; complete los campos directamente");
    R("3日後にもう一度お出しします", "3天后再次提示", "Se lo volveré a mostrar en 3 días");
    R("わかりました。同じ種類の提案は30日お休みします", "好的。同类建议将暂停30天", "De acuerdo: no habrá sugerencias similares durante 30 días");
    R("もう対応した", "已处理", "Ya lo hice");
    R("時期が早い", "时机尚早", "Es pronto");
    R("内容が合わない", "内容不合适", "No encaja");
    R("ありがとうございます。次の提案に生かします", "谢谢。会用于下次建议", "Gracias; lo tendremos en cuenta");
    R("タスクに入れました（タスク・進行）", "已加入任务（任务・进度）", "Añadido a tareas (Tareas y avance)");
    R("提案の頻度を変えました：", "已更改建议频率：", "Frecuencia: ");
    R("AI商社マンからの提案（目標と道筋）", "AI商社专员的建议（目标与路径）", "Sugerencia del agente IA (objetivo y hoja de ruta)");
    R("比率だけでは金額が出せません。「今の全社の売上」も入れてください", "仅凭占比无法算出金额。请同时填写“目前全公司销售额”", "Con solo el porcentaje no se puede calcular el importe; indique también las ventas totales actuales");
    R("<b>国（空欄）</b>：国を決めていないため、国を問わない STANDAGE の記録（この商材の全体）で計算します", "<b>国家（空）</b>：尚未确定国家，因此使用不限国家的 STANDAGE 记录（该商品类别整体）计算", "<b>Países (en blanco)</b>: sin países definidos, se usan los registros de STANDAGE de esta categoría en todos los mercados");
    R("海外売上の比率", "海外销售占比", "Peso de las ventas en el exterior");
    R("1社あたり（年）", "每家客户（年）", "Por comprador / año");
    R("（ご入力）", "（您输入的）", " (indicado)");
    R("（仮の値・入れると精度が上がります）", "（暂定值・填写后更准确）", " (provisional; indíquelo para más precisión)");
    R("済みの根拠：", "已完成的依据：", "Hecho porque: ");
    R("商品のデータ", "商品数据", "datos del producto");
    R("（見本の商品のデータ）", "（示例商品的数据）", " (datos del producto de muestra)");
    R("「済み」は、いま開いている見本の商品（業種サンプル）に入っているデータから判定しています。御社の商品を登録すると、御社の進みで判定し直します", "“已完成”是根据当前打开的示例商品（行业示例）中的数据判定的。登记贵公司的商品后，将按贵公司的进展重新判定", "«Hecho» se juzga con los datos del producto de muestra abierto. Registre su producto para ver su avance real");
    R("ここから下は、AI商社マンの成長と育て方です（相談の答えとは別の情報です）", "以下是AI商社专员的成长与培养方法（与咨询回答是不同的信息）", "Abajo: cómo crece su agente IA (información aparte de las respuestas)");
    R("決めたときの商品", "设定时的商品", "Producto al fijarlo");
    R("輸出の価格（FOB・現地の価格）", "出口价格（FOB・当地价格）", "precios de exportación");
    R("規制の確認", "法规确认", "regulaciones revisadas");
    R("営業資料を作った記録", "已制作营业资料", "presentación de ventas creada");
    R("バイヤーへの連絡の記録", "联系买家的记录", "contactos con compradores");
    R("商談の記録", "商谈记录", "reuniones registradas");
    R("サンプル・見積の記録", "样品・报价记录", "muestras y cotizaciones");
    R("契約交渉の記録", "合同谈判记录", "negociaciones");
    R("取引・受注の記録", "交易・接单记录", "operaciones y pedidos");
    R("2か国以上・3社以上の取引", "2个以上国家・3家以上客户的交易", "operaciones en 2+ países / 3+ compradores");
    R("営業資料あり", "已有营业资料", "presentación de ventas lista");
    R("バイヤーへの連絡・自社バイヤーの記録あり", "已有联系买家・自家买家的记录", "contactos con compradores registrados");
    R("商談の記録あり", "已有商谈记录", "reuniones registradas");
    R("サンプル・見積の記録あり", "已有样品・报价记录", "muestras y cotizaciones registradas");
    R("契約交渉の記録あり", "已有合同谈判记录", "negociaciones registradas");
    R("取引・受注の記録あり", "已有交易・接单记录", "operaciones y pedidos registrados");
    R("ご入力の額", "您输入的金额", "Su importe");
    R("仮の値（価格表・MOQ が読めないため）", "暂定值（无法读取价格表・MOQ）", "Valor provisional (no se pudo leer la lista de precios / MOQ)");
    R("（この画面の計算に使っている前提）", "（本页计算所用的前提）", "(usado arriba)");
    R("取引先は毎年 15% 止まる前提・1社あたりの年4回の注文は仮の前提（数字を作らないため、実際の額を入れると置き換わります）", "假设每年有 15% 的客户停止交易・每家客户每年下单4次为暂定前提（为避免编造数字，填写实际金额后会替换）", "Se supone que el 15 % de los clientes deja de comprar cada año; 4 pedidos al año por comprador es un supuesto (se reemplaza al indicar su importe real)");
    R("この前提で届く目安と期限", "按此前提可达成的目标与期限", "Qué se alcanza con estos supuestos, y cuándo");
    R("1社あたりの年間取引額の前提", "每家客户年交易额的前提", "Supuesto por comprador");
    R("計算の前提と根拠：", "计算前提与依据：", "Supuestos: ");
    R("ここの数字は、上の前提どうしの掛け算です（見込みを作るものではありません）。実際の1社あたりの取引額（代理店・卸の年間の仕入れの額）が分かれば「目標を直す」で入れてください。いちばん精度が上がります", "这里的数字是上述前提相乘的结果（并非预测）。如果知道每家客户的实际交易额（代理商・批发商的年进货额），请在“修改目标”中填写，这样精度最高", "Estas cifras multiplican los supuestos anteriores (no son una previsión); indique su importe real por comprador en «Editar el objetivo» para mayor precisión");
    R("1社あたりの取引額が推定・仮の値です。実際の額が大きければ、必要な社数はその分だけ減ります", "每家客户的交易额为推算・暂定值。实际金额越大，所需客户数相应越少", "El importe por comprador es una estimación; si el real es mayor, se necesitan menos compradores");
    R("届かない理由と、現実的な道筋", "难以达成的原因与现实的路径", "Por qué no se alcanza y un camino realista");
    R("目標が大きいこと自体は悪くありません。数字の内訳を見て、どこを動かせば近づくかを決めましょう。", "目标大本身并不是坏事。看看数字的构成，决定从哪里着手更接近目标。", "Un objetivo ambicioso está bien: vea qué palanca lo acerca.");
    R("届かない理由（数字の内訳）", "难以达成的原因（数字构成）", "Por qué (las cifras)");
    R("現実的な道筋", "现实的路径", "Un camino realista");
    R("上限：この接続では回数の上限はありません（月の上限は設けていません）", "上限：此连接没有次数上限（未设月上限）", "Sin límite en esta conexión (no hay límite mensual)");
    [["食品・飲料", "食品・饮料", "Alimentos y bebidas"], ["酒類", "酒类", "Bebidas alcohólicas"], ["健康食品・サプリメント", "保健食品・营养补充剂", "Suplementos"], ["化粧品・美容", "化妆品・美容", "Cosmética y belleza"],
        ["農林水産物・生鮮", "农林水产品・生鲜", "Productos frescos"], ["医療機器・介護", "医疗器械・护理", "Equipos médicos y cuidados"], ["工業製品・部品・素材", "工业产品・零件・材料", "Productos industriales, piezas y materiales"], ["電気・電子機器", "电气・电子设备", "Equipos eléctricos y electrónicos"],
        ["日用品・雑貨・アパレル", "日用品・杂货・服装", "Bienes de consumo y moda"], ["中古車など", "二手车等", "Vehículos usados, etc."],
        ["海外売上を伸ばす", "提高海外销售额", "Aumentar las ventas en el exterior"], ["自社ブランドを海外に広げる", "将自有品牌推广到海外", "Llevar nuestra marca al exterior"], ["OEM・PB を受ける（相手のブランドで作る）", "承接 OEM・PB（以对方品牌生产）", "Aceptar trabajos OEM / marca blanca"],
        ["代理店・卸の網をつくる", "建立代理商・批发网络", "Crear una red de distribuidores"], ["テスト販売で手応えを見る", "通过试销观察反应", "Probar el mercado primero"], ["在庫・余剰品の販路", "库存・剩余商品的销路", "Salida para excedentes de stock"],
        ["輸入代理店・卸", "进口代理商・批发商", "Importadores y distribuidores"], ["小売・量販", "零售・量贩", "Minoristas"], ["飲食・業務用", "餐饮・业务用", "Hostelería / uso profesional"], ["EC・越境EC", "电商・跨境电商", "Comercio electrónico"],
        ["OEM・PB の受託先", "OEM・PB 委托方", "Clientes OEM / marca blanca"], ["現地の製造業（部品・素材）", "当地制造业（零件・材料）", "Fabricantes locales (piezas, materiales)"],
        ["展示会への出展", "参加展会", "Ferias"], ["テストマーケティング", "测试营销", "Pruebas de mercado"], ["バイヤー開拓と商談", "开拓买家与商谈", "Prospección y reuniones"], ["規制・認証の調べ", "法规・认证调查", "Regulaciones y certificación"],
        ["現地出張・商談の同行", "当地出差・陪同商谈", "Viajes al país"], ["物流・書類", "物流・单证", "Logística y documentos"], ["価格づくり", "定价", "Precios"],
        ["〜50万円", "〜50万日元", "< ¥0,5M"], ["50〜200万円", "50〜200万日元", "¥0,5–2M"], ["200〜500万円", "200〜500万日元", "¥2–5M"], ["500万円〜", "500万日元〜", "¥5M+"], ["未定・相談したい", "未定・想咨询", "Sin decidir"],
        ["控えめ（2週に1回まで）", "较少（最多2周1次）", "Baja (cada 2 semanas como máximo)"], ["ふつう（週に1回まで）", "一般（最多每周1次）", "Normal (semanal como máximo)"], ["こまめ（3日に1回まで）", "频繁（最多3天1次）", "Frecuente (cada 3 días como máximo)"], ["止める", "停止", "Desactivado"],
    ].forEach((r) => R(r[0], r[1], r[2]));
    const ZS = (s) => s, num = (s) => s;
    RP(/^商談の記録をあと (\d+)件ためる（成約の割合を御社の実績で補正します）$/, (m) => "再记录 " + m[1] + " 次商谈（用贵公司的实绩修正成交率）", (m) => "Registre " + m[1] + " reuniones más (así usamos su propia tasa de cierre)");
    RP(/^AI商社マンを育てる（成長レベル (\d+)% → 一人前 90%）$/, (m) => "培养AI商社专员（成长等级 " + m[1] + "% → 成熟 90%）", (m) => "Hacer crecer al agente IA (nivel " + m[1] + " % → 90 %)");
    RP(/^会うバイヤー (\d+)社前後で最初の取引（STANDAGE の記録の中央値）$/, (m) => "约见约 " + m[1] + " 家买家后达成首笔交易（STANDAGE 记录的中位数）", (m) => "Primer acuerdo tras unos " + m[1] + " compradores (mediana de STANDAGE)");
    RP(/^会うバイヤー 約(\d+)社（成約の割合 ([\d.]+)%）$/, (m) => "需约见约 " + m[1] + " 家买家（成交率 " + m[2] + "%）", (m) => "reunirse con ~" + m[1] + " compradores (cierre " + m[2] + " %)");
    RP(/^月 ([\d.]+)社$/, (m) => "每月 " + m[1] + " 家", (m) => m[1] + "/mes");
    RP(/^STANDAGE の標準のペースの ([\d.]+)倍$/, (m) => "STANDAGE 标准节奏的 " + m[1] + " 倍", (m) => m[1] + "× el ritmo estándar");
    RP(/^いま：(.+?)。月は今からの目安（STANDAGE の記録の中央値と、御社の連絡のペースから）$/, (m) => "当前：" + m[1] + "。月份为从现在起的估计（根据 STANDAGE 记录的中位数和贵公司的联系节奏）", (m) => "Ahora: " + m[1] + ". Los meses son estimaciones (medianas de STANDAGE y su ritmo de contacto)");
    RP(/^AI商社マンの成長レベル (\d+)%・この商材の STANDAGE の記録 (\d+)案件・自社の商談の記録 (\d+)件・一次情報 (使える|個社版)。AI商社マンが育ち、記録がたまるほど、幅は狭まります$/, (m) => "AI商社专员成长等级 " + m[1] + "%・该商品类别的 STANDAGE 记录 " + m[2] + " 个案件・自家商谈记录 " + m[3] + " 条・一手信息" + (m[4] === "使える" ? "可用" : "未使用（单个公司版）") + "。AI成长、记录越多，范围越窄", (m) => "Nivel de la IA " + m[1] + " %, " + m[2] + " proyectos de STANDAGE, " + m[3] + " reuniones propias, datos de primera mano: " + (m[4] === "使える" ? "sí" : "no (una sola empresa)") + ". El margen se estrecha a medida que crece la IA y se acumulan registros");
    const recSrc = (s, zh) => String(s).replace(/＝件数が少ないため全体/, zh ? "＝因件数较少使用整体" : " = total, por pocos casos").replace(/と自社の記録 (\d+)件/, (_a, n) => zh ? "及自家记录 " + n + " 条" : " y " + n + " registros propios");
    const perSrc = (s, zh) => s === "ご入力" ? (zh ? "您输入的" : "indicado") : s === "仮の値・入力してください" ? (zh ? "暂定值・请填写" : "valor provisional; indíquelo")
        : String(s).replace(/^価格表の単価 (.+) × MOQ (.+) × 年4回の推定$/, (_a, u, q) => zh ? "价格表单价 " + u + " × MOQ " + q + " × 每年4次的推算" : "precio de lista " + u + " × MOQ " + q + " × 4 pedidos/año (estimación)");
    RP(/^1社あたり (.+?)／年（(.+?)）・成約の割合 ([\d.]+)%（STANDAGE の記録 (.+?)）・連絡のペース 月 ([\d.]+)〜([\d.]+)社・取引先は毎年 15% 止まる$/, (m) => "每家客户 " + m[1] + "／年（" + perSrc(m[2], true) + "）・成交率 " + m[3] + "%（STANDAGE 记录 " + recSrc(m[4], true) + "）・联系节奏 每月 " + m[5] + "〜" + m[6] + " 家・每年 15% 的客户停止交易", (m) => "por comprador " + m[1] + "/año (" + perSrc(m[2], false) + "), tasa de cierre " + m[3] + " % (registros de STANDAGE: " + recSrc(m[4], false) + "), ritmo de contacto " + m[5] + "–" + m[6] + " al mes, 15 % de abandono al año");
    RP(/^(\d+)件・(.+?) 時点$/, (m) => m[1] + " 项・截至 " + m[2], (m) => m[1] + " elementos al " + m[2]);
    RP(/^「今は要らない」が2回続いたので、(.+?)から1段控えめにしました$/, (m) => "因连续2次选择“现在不需要”，自" + m[1] + "起降低一级频率", (m) => "Frecuencia reducida desde el " + m[1] + " tras dos «Ahora no»");
    RP(/^（比率 ([\d.]+)% から計算）$/, (m) => "（根据占比 " + m[1] + "% 计算）", (m) => " (a partir del " + m[1] + " %)");
    RP(/^／今の海外売上 (.+)$/, (m) => "／目前海外销售额 " + m[1], (m) => " / ahora " + m[1]);
    RP(/^([\d.]+)%（国内が今のままの場合）・今の全社の売上に対しては ([\d.]+)%$/, (m) => m[1] + "%（国内销售不变时）・占目前全公司销售额的 " + m[2] + "%", (m) => m[1] + " % (si las ventas nacionales no cambian) / " + m[2] + " % del total actual");
    RP(/^（推定：単価 (.+?) × MOQ (.+?) × 年4回）$/, (m) => "（推算：单价 " + m[1] + " × MOQ " + m[2] + " × 每年4次）", (m) => " (estimación: precio " + m[1] + " × MOQ " + m[2] + " × 4/año)");
    RP(/^。?「相手の画面を試す」の模擬の返事だけの会話（(\d+)件）は、進みに数えていません$/, (m) => "仅有“试用对方画面”模拟回复的对话（" + m[1] + " 条）不计入进展", (m) => "Las conversaciones solo con respuestas simuladas (" + m[1] + ") no cuentan");
    RP(/^販売先国 (\d+)か国$/, (m) => "销售目标国 " + m[1] + " 个", (m) => m[1] + " países de venta");
    RP(/^販売先国 (\d+)か国を登録済み$/, (m) => "已登记 " + m[1] + " 个销售目标国", (m) => m[1] + " países de venta registrados");
    RP(/^済みの根拠：(.+?)（御社の商品：(.+)）$/, (m) => "已完成的依据：" + m[1] + "（贵公司的商品：" + m[2] + "）", (m) => "Hecho porque: " + m[1] + " (su producto: " + m[2] + ")");
    RP(/^済みの根拠：(.+?)（見本の商品のデータ：(.+)・御社の進みではありません）$/, (m) => "已完成的依据：" + m[1] + "（示例商品的数据：" + m[2] + "・不是贵公司的进展）", (m) => "Hecho porque: " + m[1] + " (datos del producto de muestra: " + m[2] + "; no es su avance)");
    const simTail = (s, zh) => { const q = String(s || "").match(/（(\d+)件）/); return q ? (zh ? "。仅有“试用对方画面”模拟回复的对话（" + q[1] + " 条）不计入进展" : ". Las conversaciones solo con respuestas simuladas (" + q[1] + ") no cuentan") : ""; };
    RP(/^「✓ 済み」は、御社が登録した商品（(.+)）の記録だけで、手順ごとに判定しています。見本の会社の記録は数えません。商標・展示会など記録で確かめられない手順は、✓ にしません(。「相手の画面を試す」の模擬の返事だけの会話（\d+件）は、進みに数えていません)?$/, (m) => "“✓ 已完成”只根据贵公司登记的商品（" + m[1] + "）的记录逐步判定，不计入示例公司的记录。商标・展会等无法通过记录确认的步骤不会打 ✓" + simTail(m[2], true), (m) => "«✓ Hecho» se juzga paso a paso solo con los registros de sus propios productos (" + m[1] + "). No se cuentan las empresas de muestra. Los pasos que no se pueden comprobar con registros (marcas, ferias) no se marcan" + simTail(m[2], false));
    RP(/^御社の商品がまだ登録されていないため、いま開いている見本の商品（(.+)）のデータで、進み方の例を出しています（御社の進みではありません）。御社の商品を登録すると、御社の記録だけで判定し直します(。「相手の画面を試す」の模擬の返事だけの会話（\d+件）は、進みに数えていません)?$/, (m) => "贵公司尚未登记商品，因此用当前打开的示例商品（" + m[1] + "）的数据展示进展示例（不是贵公司的进展）。登记贵公司的商品后，将只按贵公司的记录重新判定" + simTail(m[2], true), (m) => "Aún no hay productos suyos: se muestra como ejemplo el producto de muestra abierto (" + m[1] + "), no su avance. Registre su producto para juzgar su propio avance" + simTail(m[2], false));
    RP(/^(\d{4})年$/, (m) => m[1] + "年", (m) => m[1]);
    RP(/^(\d{4})年（(\d+)年後）$/, (m) => m[1] + "年（" + m[2] + "年后）", (m) => m[1] + " (" + m[2] + " años)");
    RP(/^(\d{4})年の見込み（標準）$/, (m) => m[1] + "年预测（标准）", (m) => "Previsión para " + m[1] + " (estándar)");
    RP(/^目標 (.+) に届く年（標準）$/, (m) => "达到目标 " + m[1] + " 的年份（标准）", (m) => "Año en que se alcanza " + m[1] + " (estándar)");
    RP(/^(\d+)社$/, (m) => m[1] + "家", (m) => m[1]);
    RP(/^連絡 月 ([\d.]+)社$/, (m) => "每月联系 " + m[1] + " 家", (m) => m[1] + "/mes");
    RP(/^目標の (.+) に (\d{4})年で届くには、標準のペースのままなら1社あたり 年 約 (.+) の取引が要ります（いまの前提 (.+) の ([\d.]+)倍）$/, (m) => "要在 " + m[2] + " 年达到目标 " + m[1] + "，按标准节奏每家客户每年约需 " + m[3] + " 的交易额（为目前前提 " + m[4] + " 的 " + m[5] + " 倍）", (m) => "Para alcanzar " + m[1] + " en " + m[2] + " al ritmo estándar necesita unos " + m[3] + " por comprador al año (" + m[5] + "× el supuesto actual de " + m[4] + ")");
    const rateSrc = (s, zh) => String(s).replace(/^Ver\.1 の承認済みの商談記録/, zh ? "Ver.1 的已批准商谈记录" : "registros aprobados de Ver.1")
        .replace(/^STANDAGE Ver\.1（承認済みの商談記録・社名と人名は使っていない）/, zh ? "STANDAGE Ver.1（已批准的商谈记录・不使用公司名和人名）" : "STANDAGE Ver.1 (registros de reuniones aprobados, sin nombres de empresas ni personas)")
        .replace(/・(\d{4}-\d\d-\d\d) 時点/, (_a, d) => zh ? "・截至 " + d : ", al " + d).replace(/・会ってから180日以上たったバイヤーで数えた割合/, zh ? "・按见面180天以上的买家计算的比例" : ", con compradores vistos hace 180+ días")
        .replace(/・この商材の記録/, zh ? "・该商品类别的记录" : ", registros de esta categoría").replace(/・件数が少ないため全体の記録/, zh ? "・因件数较少使用整体记录" : ", registros generales (pocos casos)")
        .replace(/と御社の記録 (\d+)件/, (_a, n) => zh ? "及贵公司的记录 " + n + " 条" : " y " + n + " registros suyos");
    RP(/^成約の割合 ([\d.]+)%：STANDAGE の記録（(.+)）$/, (m) => "成交率 " + m[1] + "%：STANDAGE 的记录（" + rateSrc(m[2], true) + "）", (m) => "Tasa de cierre " + m[1] + " %: registros de STANDAGE (" + rateSrc(m[2], false) + ")");
    RP(/^連絡のペース 月 ([\d.]+)〜([\d.]+)社：STANDAGE の記録の、1か月に会うバイヤーの数（中央値・上位25%）。挑戦はその 2\.5倍（展示会＋毎月の AIバイヤー開拓）$/, (m) => "联系节奏 每月 " + m[1] + "〜" + m[2] + " 家：STANDAGE 记录中每月约见的买家数（中位数・前25%）。挑战节奏为其 2.5 倍（展会＋每月AI买家开拓）", (m) => "Ritmo de contacto " + m[1] + "–" + m[2] + " al mes: compradores vistos al mes en los registros de STANDAGE (mediana y 25 % superior). El ritmo exigente es 2,5 veces (ferias + prospección IA mensual)");
    RP(/^続けて買う相手は数量帯の上の帯（(.+?)〜・単価 (.+?)）で年4回$/, (m) => "回头客按最高数量档（" + m[1] + "〜・单价 " + m[2] + "）每年4次", (m) => "Compradores recurrentes en el tramo superior (" + m[1] + "+, precio " + m[2] + ") × 4/año");
    RP(/^MOQ（(.+?)）だけの注文・単価 (.+?)で年4回$/, (m) => "仅按 MOQ（" + m[1] + "）下单・单价 " + m[2] + "，每年4次", (m) => "Solo el MOQ (" + m[1] + ") a " + m[2] + " × 4/año");
    RP(/^価格表の単価 (.+?) × MOQ (.+?) × 年4回$/, (m) => "价格表单价 " + m[1] + " × MOQ " + m[2] + " × 每年4次", (m) => "Precio de lista " + m[1] + " × MOQ " + m[2] + " × 4/año");
    RP(/^目標（(\d{4})年に海外売上 (.+?)）：(.+?)。必要な取引はあと約 (.+?)社$/, (m) => "目标（" + m[1] + "年海外销售额 " + m[2] + "）：" + m[3] + "。还需约 " + m[4] + " 家交易客户", (m) => "Objetivo (" + m[2] + " en ventas en el exterior para " + m[1] + "): " + m[3] + ". Faltan unos " + m[4] + " compradores");
    RP(/^「(.+)」まで進みました。$/, (m) => "已推进到“" + m[1] + "”。", (m) => "Ha llegado a «" + m[1] + "». ");
    RP(/^いま「(.+)」。$/, (m) => "当前：“" + m[1] + "”。", (m) => "Ahora: «" + m[1] + "». ");
    RP(/^「(.+)」を開く$/, (m) => "打开“" + m[1] + "”", (m) => "Abrir «" + m[1] + "»");
    RP(/^いま：(.+?)（(.+?)から）。自社の商談の記録 (\d+)件・取引 (\d+)社$/, (m) => "当前：" + m[1] + "（自" + m[2] + "起）。自家商谈记录 " + m[3] + " 条・交易 " + m[4] + " 家", (m) => "Ahora: " + m[1] + " (desde " + m[2] + "). Reuniones registradas " + m[3] + ", operaciones " + m[4]);
    RP(/^いま：(.+?)。選べる手：連絡の数を増やす（AIバイヤー開拓を毎月）・展示会で対面の商談を足す・目標の年を後ろにずらす$/, (m) => "当前：" + m[1] + "。可选的举措：增加联系数量（每月AI买家开拓）・通过展会增加面对面商谈・推迟目标年份", (m) => "Ahora: " + m[1] + ". Opciones: más contactos (prospección IA mensual), añadir una feria o retrasar el año objetivo");
    RP(/^道筋では今ごろ「(.+)」の予定でした。打ち手を選び直しましょう$/, (m) => "按路径现在应处于“" + m[1] + "”。请重新选择举措", (m) => "El plan preveía «" + m[1] + "» a estas alturas: ajustemos");
    RP(/^「(.+)」のまま (\d+)日たちました。止まっている理由を一緒に外しましょう$/, (m) => "已在“" + m[1] + "”停留 " + m[2] + " 天。一起消除停滞的原因吧", (m) => "Lleva " + m[2] + " días en «" + m[1] + "»: desbloqueémoslo");
    RP(/^AI商社マンの案（(.+?)・一次情報 (\d+)件）$/, (m) => "AI商社专员的方案（" + m[1] + "・一手信息 " + m[2] + " 条）", (m) => "Plan de la IA (" + m[1] + ")");
    RP(/^増やしたい海外売上 (.+?) を、1社あたり 年 (.+?)(（推定）|（仮の値）)? で割ると、続けて取引する相手が <b>(\d+)社<\/b> 要ります（毎年 15% の相手が止まる分も含む）$/, (m) => "要增加的海外销售额 " + m[1] + " 按每家客户每年 " + m[2] + (m[3] ? (m[3] === "（推定）" ? "（推算）" : "（暂定值）") : "") + " 计算，需要 <b>" + m[4] + " 家</b>持续交易的客户（含每年 15% 停止交易的部分）", (m) => "Crecer " + m[1] + " a " + m[2] + (m[3] ? (m[3] === "（推定）" ? " (estimación)" : " (provisional)") : "") + " por comprador requiere <b>" + m[4] + "</b> compradores activos (incluye el 15 % que abandona cada año)");
    RP(/^成約の割合 ([\d.]+)%（STANDAGE の記録）で (\d+)社と取引するには、約 <b>(\d+)社<\/b> のバイヤーと会う必要があります$/, (m) => "按成交率 " + m[1] + "%（STANDAGE 记录）要与 " + m[2] + " 家交易，需要约见约 <b>" + m[3] + " 家</b>买家", (m) => "Con una tasa de cierre del " + m[1] + " %, hay que reunirse con unos <b>" + m[3] + "</b> compradores");
    RP(/^(\d{4})年までの残り (\d+)か月で割ると 月 <b>([\d.]+)社<\/b>。STANDAGE の記録の標準（月 ([\d.]+)社）の ([\d.]+)倍です$/, (m) => "按到 " + m[1] + " 年剩余的 " + m[2] + " 个月计算，每月需 <b>" + m[3] + " 家</b>，是 STANDAGE 记录标准（每月 " + m[4] + " 家）的 " + m[5] + " 倍", (m) => "En los " + m[2] + " meses hasta " + m[1] + " son <b>" + m[3] + "</b> al mes: " + m[5] + "× el ritmo estándar de STANDAGE (" + m[4] + " al mes)");
    RP(/^<b>まずの目標<\/b>：(\d{4})年に 標準のペースで (.+?)、挑戦のペース（展示会＋毎月の AIバイヤー開拓）で (.+?) が見込みです。ここを中間の目標にして、届いたら次の目標へ$/, (m) => "<b>第一个里程碑</b>：到 " + m[1] + " 年，按标准节奏预计 " + m[2] + "，按挑战节奏（展会＋每月AI买家开拓）预计 " + m[3] + "。以此为中间目标，达成后再迈向下一个目标", (m) => "<b>Primer hito</b>: para " + m[1] + ", " + m[2] + " al ritmo estándar y " + m[3] + " al ritmo exigente (ferias + prospección IA mensual)");
    RP(/^<b>年を延ばす<\/b>：(.+?) に届くのは 標準のペースで (.+?)、挑戦のペースで (.+)$/, (m) => "<b>延长年份</b>：按标准节奏 " + m[2] + "、按挑战节奏 " + m[3] + " 达到 " + m[1], (m) => "<b>Ampliar el plazo</b>: " + m[1] + " se alcanza " + m[2] + " (estándar) / " + m[3] + " (exigente)");
    RP(/^<b>1社あたりを大きくする<\/b>：(\d{4})年に挑戦のペースで届くには、1社あたり 年 約 (.+?) の取引が要ります（いまの想定は (.+?)）。代理店・卸など大口の相手や、品目を増やすと近づきます$/, (m) => "<b>提高每家客户的交易额</b>：要在 " + m[1] + " 年按挑战节奏达成，每家客户每年约需 " + m[2] + " 的交易额（目前设想为 " + m[3] + "）。与代理商・批发商等大客户合作或增加品目可以更接近", (m) => "<b>Compradores más grandes</b>: para llegar en " + m[1] + " al ritmo exigente se necesitan unos " + m[2] + " por comprador al año (ahora " + m[3] + ")");
    RP(/^<b>最初の取引の目安<\/b>：(\d{4})年(\d{1,2})月ごろ（STANDAGE の記録の中央値。まずはここが最初の山です）$/, (m) => "<b>首笔交易预计</b>：" + m[1] + "年" + m[2] + "月左右（STANDAGE 记录的中位数。这是第一个关口）", (m) => "<b>Primer acuerdo</b>: hacia " + m[2] + "/" + m[1] + " (mediana de STANDAGE)");
    RP(/^(\d{4})年（(\d+)年後）$/, (m) => m[1] + "年（" + m[2] + "年后）", (m) => m[1] + " (" + m[2] + " años)");
    RP(/^1日の上限 <b>(\d+)回<\/b>（今日 (\d+)回・残り <b>(\d+)回<\/b>。AI をサーバー経由で使うときの上限で、毎日 0時にもどります）$/, (m) => "每日上限 <b>" + m[1] + " 次</b>（今天 " + m[2] + " 次・剩余 <b>" + m[3] + " 次</b>。经服务器使用AI时的上限，每天0点重置）", (m) => "Límite diario <b>" + m[1] + "</b> (hoy " + m[2] + ", quedan <b>" + m[3] + "</b>; se reinicia a medianoche, hora de Japón)");
    RP(/^承認済みの商談記録 ([\d,]+)件・(\d+)案件の集計/, (m) => "已批准的商谈记录 " + m[1] + " 条・" + m[2] + " 个案件的汇总", (m) => m[1] + " registros de reuniones aprobados de " + m[2] + " proyectos");
    R("国内の売上が今のままの場合の、全社に占める割合（今の全社の売上に対する割合は下の計算に）", "国内销售不变时占全公司的比例（相对目前全公司销售额的比例见下方计算）", "Peso sobre el total si las ventas nacionales no cambian (respecto al total actual: ver abajo)");
    RP(/^数量帯の上の帯の入口 (.+?)（続けて取引する相手はこの帯で買う前提）$/, (m) => "数量档最高档的起点 " + m[1] + "（假设回头客按此档购买）", (m) => "tramo superior desde " + m[1] + " (se supone que los compradores recurrentes compran en este tramo)");
    RP(/^<b>1社あたり（空欄）<\/b>：価格表の単価 (.+?) × MOQ (.+?) × 年4回 ＝ 年 <b>(.+?)<\/b> と推定して計算します$/, (m) => "<b>每家客户（空）</b>：按价格表单价 " + m[1] + " × MOQ " + m[2] + " × 每年4次 ＝ 每年 <b>" + m[3] + "</b> 推算", (m) => "<b>Por comprador (en blanco)</b>: precio " + m[1] + " × MOQ " + m[2] + " × 4 pedidos = <b>" + m[3] + "</b>/año (estimación)");
    RP(/^<b>1社あたり（空欄）<\/b>：価格表の単価か MOQ が読めないため、仮に 年 <b>(.+?)<\/b> で計算します（仮の値です。分かる額を入れると精度が上がります）$/, (m) => "<b>每家客户（空）</b>：无法读取价格表单价或 MOQ，暂按每年 <b>" + m[1] + "</b> 计算（暂定值，填写已知金额可提高精度）", (m) => "<b>Por comprador (en blanco)</b>: sin precio ni MOQ legibles, se usa un valor provisional de <b>" + m[1] + "</b>/año");
    RP(/^<b>国（空欄）<\/b>：販売先国の (.+) で計算します$/, (m) => "<b>国家（空）</b>：按销售目标国 " + m[1] + " 计算", (m) => "<b>Países (en blanco)</b>: se usan sus países de venta " + m[1]);
    RP(/^<b>比率の計算<\/b>：目標の海外売上 (.+?) ÷（今の国内の売上 (.+?) ＋ 目標の海外売上）＝ <b>([\d.]+)%<\/b>（国内の売上が今のままの場合の全社に占める割合。道筋の計算はこちら）。今の全社の売上 (.+?) に対しては ([\d.]+)% です$/, (m) => "<b>占比计算</b>：目标海外销售额 " + m[1] + " ÷（目前国内销售额 " + m[2] + " ＋ 目标海外销售额）＝ <b>" + m[3] + "%</b>（国内销售不变时占全公司的比例。路径按此计算）。相对目前全公司销售额 " + m[4] + " 为 " + m[5] + "%", (m) => "<b>Peso</b>: objetivo " + m[1] + " ÷ (ventas nacionales actuales " + m[2] + " + objetivo) = <b>" + m[3] + " %</b> (si las ventas nacionales no cambian; la hoja de ruta usa este valor). Respecto al total actual " + m[4] + ": " + m[5] + " %");
    RP(/^<b>金額の計算<\/b>：比率 ([\d.]+)% は、国内の売上が今のまま（(.+?)）なら海外売上 <b>(.+?)<\/b> です$/, (m) => "<b>金额计算</b>：占比 " + m[1] + "% 在国内销售不变（" + m[2] + "）时，相当于海外销售额 <b>" + m[3] + "</b>", (m) => "<b>Importe</b>: el " + m[1] + " % equivale a <b>" + m[3] + "</b> si las ventas nacionales no cambian (" + m[2] + ")");
    RP(/^入力の比率 ([\d.]+)% は金額と合いません。道筋は金額（(.+?)）で計算します$/, (m) => "输入的占比 " + m[1] + "% 与金额不符。路径按金额（" + m[2] + "）计算", (m) => "El porcentaje " + m[1] + " % no cuadra con el importe; la hoja de ruta usa el importe (" + m[2] + ")");
    RP(/^AI の読み取り（([\d.]+)%）は金額と合わないため、金額からの計算に直しました$/, (m) => "AI读取的占比（" + m[1] + "%）与金额不符，已改为按金额计算", (m) => "La IA leyó " + m[1] + " %, que no cuadra con los importes; se sustituyó por el cálculo");
    void ZS;
    void num;
    const SPE = { "年": { en: "", zh: "年", es: "" }, "社": { zh: "家", es: " compradores" }, "件で考えました": { zh: " 条", es: "" } };
    const rmTr = (ja, en) => {
        const l = lg();
        const k = String(ja == null ? "" : ja);
        if (en === "" && SPE[k] && SPE[k][l] != null)
            return SPE[k][l];
        if (l !== "zh" && l !== "es")
            return null;
        const row = RMT[k + "|" + en] || RMT[k];
        if (row)
            return l === "zh" ? row[0] : row[1];
        for (const p of RMP) {
            const m = k.match(p.re);
            if (m) {
                try {
                    const r = p[l](m);
                    if (r != null)
                        return r;
                }
                catch (e) { }
            }
        }
        try {
            const dv = DI && DI[l] && DI[l][k];
            if (typeof dv === "string" && dv && !hasJ(dv))
                return dv;
        }
        catch (e) { }
        return null;
    };
    try {
        if (typeof v88M === "function") {
            const __m = v88M;
            v88M = function (ja, en) { try {
                if (lg() !== "ja") {
                    const r = rmTr(ja, en);
                    if (r != null)
                        return r;
                }
            }
            catch (e) { } return __m.apply(this, arguments); };
        }
        if (typeof v88T === "function") {
            const __t = v88T;
            v88T = function (a) { try {
                if (Array.isArray(a) && lg() !== "ja") {
                    const r = rmTr(a[0], a[1]);
                    if (r != null)
                        return r;
                }
            }
            catch (e) { } return __t.apply(this, arguments); };
        }
        if (typeof v88StNm === "function" && typeof v88StageNow === "function") {
            const __sn = v88StNm;
            let memo = null;
            v88StNm = function (n) {
                const r = __sn.apply(this, arguments);
                try {
                    const l = lg();
                    if ((l !== "zh" && l !== "es") || (n | 0) !== 3)
                        return r;
                    const now = Date.now();
                    if (!memo || now - memo.at > 1500) {
                        const st = v88StageNow();
                        memo = { at: now, stage: st && st.stage, sig: (st && st.sig) || {} };
                    }
                    if (memo.stage !== 3)
                        return r;
                    if (memo.sig.price && !memo.sig.reg)
                        return l === "zh" ? "已准备价格（法规尚待确认）" : "Precios listos (falta revisar regulaciones)";
                    if (memo.sig.reg && !memo.sig.price)
                        return l === "zh" ? "已备好法规信息（价格尚待准备）" : "Información de regulaciones lista (faltan precios)";
                }
                catch (e) { }
                return r;
            };
        }
        if (typeof v88Outlook === "function") {
            const __o = v88Outlook;
            v88Outlook = function () {
                const h = __o.apply(this, arguments);
                try {
                    const l = lg();
                    if ((l === "en" || l === "es") && typeof h === "string")
                        return h.replace(/(\d{4})（(\d+)( yrs\)| años\))/g, "$1 ($2$3").replace(/(<small>[^<]*?)／([^<]*?<\/small>)/g, "$1 / $2").replace(/>／100・/g, ">/100 · ");
                }
                catch (e) { }
                return h;
            };
        }
        if (typeof v88GoalSummary === "function") {
            const __gs = v88GoalSummary;
            v88GoalSummary = function () {
                const h = __gs.apply(this, arguments);
                try {
                    if (lg() === "ja" || typeof h !== "string")
                        return h;
                    return h.replace(/(<dd>)([^<]+)(<\/dd>|<br>)/g, (a, o, t, c) => {
                        const parts = String(t).split(/[・、,，]\s*/).map((x) => x.trim()).filter(Boolean);
                        if (parts.length < 1 || !parts.every((x) => isCty(x)))
                            return a;
                        return o + E(parts.map(ctyName).join(lg() === "zh" ? "、" : ", ")) + c;
                    });
                }
                catch (e) { }
                return h;
            };
        }
    }
    catch (e) {
        warn("rm", e);
    }
    const ANA = {
        "バイヤーから返信（まだ返していません）": ["买家已回复（尚未回复）", "Respuesta del comprador (sin contestar)"], "返信が要る": ["需要回复", "Requiere respuesta"],
        "相手から届いて、まだ返していない相手": ["对方已来信、尚未回复的对象", "Compradores que respondieron y esperan su respuesta"],
        "下の5つの数は、期間を区切らない累計（これまでの全部）です。直近7日の数は「直近7日の活動」に出ます。": ["下方5个数字是不分期间的累计（迄今全部）。最近7天的数字显示在“最近7天的活动”中。", "Las 5 cifras son totales acumulados (sin periodo). Los últimos 7 días aparecen en «Actividad de los últimos 7 días»."],
        " 数はすべて見本（架空）の商品の記録で、実在の取引は入っていません。": [" 所有数字均来自示例（虚构）商品的记录，不含真实交易。", " Todas las cifras son de productos de muestra (ficticios); no hay operaciones reales."],
        "数え方：期間内の商談の記録の件数": ["统计方法：期间内的商谈记录数", "Cómputo: registros de reuniones del periodo"], "金額の記録なし": ["无金额记录", "sin importe registrado"],
        "通知（": ["通知（", "Avisos ("], "。開くと既読になります）": ["。打开后变为已读）", ". Al abrirlos se marcan como leídos)"],
        "メンバーの台帳には未登録です（共通アカウントのため、台帳への登録・担当の割り当てはできません）": ["未在成员名册中登记（共用账号，无法登记到名册或分配负责人）", "No está en la lista de miembros (cuenta compartida: no se puede registrar ni asignar)"],
        "メンバーの台帳には未登録です（「自分をメンバーに登録」で台帳に入り、担当を割り当てられます）": ["尚未在成员名册中登记（通过“将自己登记为成员”加入名册后可分配负责人）", "Aún no está en la lista de miembros (use «Registrarme» para que le asignen tareas)"],
        "あなた": ["您", "Usted"], "参加中（ログイン中）": ["参与中（已登录）", "Activo (con sesión iniciada)"],
    };
    const ANP = [];
    const AP = (re, zh, es) => { ANP.push({ re, zh, es }); };
    const dw2 = (s, zh) => s === "はじめ" ? (zh ? "开始" : "inicio") : s === "今日" ? (zh ? "今天" : "hoy") : s;
    AP(/^下の5つの数の期間：(.+?)〜(.+?)（集計範囲の「期間」で指定）。$/, (m) => "下方5个数字的期间：" + dw2(m[1], true) + "〜" + dw2(m[2], true) + "（在统计范围的“期间”中指定）。", (m) => "Periodo de las 5 cifras: " + dw2(m[1], false) + " a " + dw2(m[2], false) + ".");
    AP(/^ 見本（架空）(\d+)商品と実在の(\d+)商品を合わせた数です（「見本の会社（架空）を含める」を外すと実在だけ）。$/, (m) => " 合计示例（虚构）" + m[1] + " 个商品和真实 " + m[2] + " 个商品的数字（取消“包含示例公司（虚构）”后仅显示真实数据）。", (m) => " Incluye " + m[1] + " productos de muestra (ficticios) y " + m[2] + " reales.");
    AP(/^数え方：商談の記録の件数。(\d+)件は、傾向を読むのに要る記録の目安（1商材 42件）$/, (m) => "统计方法：商谈记录数。" + m[1] + " 条为判断趋势所需的记录参考（每种商品 42 条）", (m) => "Cómputo: registros de reuniones. " + m[1] + " = registros necesarios para ver tendencias (42 por producto)");
    AP(/^数え方：バイヤー一覧で、商談の記録・直接連絡・活動の記録のどれかがある相手（(\d+)社・失注と終了を除く）。「どこまで進んだか」は商談の記録（(\d+)件）だけから数えるので、数が違います$/, (m) => "统计方法：买家列表中有商谈记录・直接联系・活动记录任一项的对象（" + m[1] + " 家・不含失单和已结束）。“进展到哪一步”只按商谈记录（" + m[2] + " 条）统计，因此数字不同", (m) => "Cómputo: compradores de la lista con registro de reunión, mensaje directo o actividad (" + m[1] + "; sin perdidos ni cerrados). «Hasta dónde» cuenta solo registros de reuniones (" + m[2] + "), por eso las cifras difieren");
    AP(/^数え方：商談の記録で価格を出した件数（(\d+)件）。見積金額は見積書（PI）の合計で、まだ見積書がありません$/, (m) => "统计方法：在商谈记录中报出价格的件数（" + m[1] + " 件）。报价金额为报价单（PI）的合计，目前还没有报价单", (m) => "Cómputo: registros de reuniones con precio (" + m[1] + "). El importe cotizado es el total de las cotizaciones (PI); aún no hay");
    AP(/^数え方：価格を出した商談の記録（(\d+)件）。金額は見積書（PI）の合計$/, (m) => "统计方法：报出价格的商谈记录（" + m[1] + " 件）。金额为报价单（PI）的合计", (m) => "Cómputo: registros de reuniones con precio (" + m[1] + "). Importe = total de cotizaciones (PI)");
    AP(/^数え方：消化率 (\d+)%＝完了 (\d+)件÷全部 (\d+)件。右の「期限切れ・開始が遅れている・1週間以内・作業期間中」は、残り (\d+)件を期限で見たもので、未着手・対応中と重なります（足しても合いません）$/, (m) => "统计方法：完成率 " + m[1] + "%＝已完成 " + m[2] + " 件÷全部 " + m[3] + " 件。右侧的“已逾期・开始延迟・1周内・作业期间中”是按期限查看剩余 " + m[4] + " 件，与未开始・处理中有重叠（相加不一致）", (m) => "Cómputo: avance " + m[1] + " % = " + m[2] + " hechas ÷ " + m[3] + " en total. «Vencidas / inicio tardío / en una semana / en curso» miran las " + m[4] + " restantes por fecha y se solapan con no iniciadas / en curso");
    AP(/^ベルの数字（いま (\d+)）＝急ぎで、まだ開いていない知らせ$/, (m) => "铃铛数字（当前 " + m[1] + "）＝紧急且尚未打开的通知", (m) => "Número de la campana (" + m[1] + ") = avisos urgentes sin abrir");
    AP(/^ベルの数字（いま (\d+)）＝まだ開いていない知らせ$/, (m) => "铃铛数字（当前 " + m[1] + "）＝尚未打开的通知", (m) => "Número de la campana (" + m[1] + ") = avisos sin abrir");
    try {
        if (typeof v90anaX === "function") {
            const __ax = v90anaX;
            v90anaX = function (ja) {
                try {
                    const l = lg();
                    if (l === "zh" || l === "es") {
                        const k = String(ja == null ? "" : ja), i = l === "zh" ? 0 : 1;
                        if (ANA[k])
                            return ANA[k][i];
                        for (const p of ANP) {
                            const m = k.match(p.re);
                            if (m) {
                                const r = p[l](m);
                                if (r != null)
                                    return r;
                            }
                        }
                    }
                }
                catch (e) { }
                return __ax.apply(this, arguments);
            };
        }
    }
    catch (e) {
        warn("ana", e);
    }
    TR("アラブ首長国連邦", "United Arab Emirates", "阿拉伯联合酋长国", "Emiratos Árabes Unidos");
    PF(/^([：:]\s?)((?:[^\s・：:]+ \d+%)(?:・[^\s・：:]+ \d+%)*)$/, (m) => {
        const out = [];
        for (const p of m[2].split("・")) {
            const q = p.match(/^(\S+) (\d+%)$/);
            if (!q)
                return null;
            let nm = ctyName(q[1]);
            if (nm === q[1]) {
                try {
                    const v = DI && DI[lg()] && DI[lg()][q[1]];
                    if (typeof v === "string" && v && !hasJ(v))
                        nm = v;
                }
                catch (e) { }
            }
            if (hasJ(nm))
                return null;
            out.push(nm + " " + q[2]);
        }
        return (lg() === "zh" ? "：" : ": ") + out.join(lg() === "zh" ? "・" : ", ");
    });
    const ST2 = { "コンタクト中": ["In contact", "联系中", "En contacto"], "未設定": ["Not set", "未设置", "Sin definir"] };
    const stNm = (s) => { const r = ST2[s]; if (r)
        return L3(r[0], r[1], r[2]); return tr(s); };
    const BY = { "AI（ルール）": ["AI (rules)", "AI（规则）", "IA (reglas)"], "こちらからの送信のみ（返信待ち）": ["only our messages so far (awaiting reply)", "仅我方发送（等待回复）", "solo mensajes nuestros (esperando respuesta)"], "手動": ["by hand", "手动", "manual"], "手で変更": ["changed by hand", "手动更改", "cambiado a mano"] };
    const byNm = (s) => {
        const parts = [];
        let d = 0, c = "";
        for (const ch of String(s)) {
            if (ch === "（" || ch === "(")
                d++;
            else if (ch === "）" || ch === ")")
                d = Math.max(0, d - 1);
            if (ch === "・" && d === 0) {
                parts.push(c);
                c = "";
            }
            else
                c += ch;
        }
        parts.push(c);
        return parts.map((x) => { const r = BY[x.trim()]; return r ? L3(r[0], r[1], r[2]) : tr(x.trim()); }).join(lg() === "zh" ? "・" : ", ");
    };
    PF(/^(📨 )?(.+?)（([^（）]+)）の交渉ステータスを「(.+?)」に更新しました（(.+)）$/, (m) => {
        if (!isCty(m[3]) && m[3] !== "国 未登録")
            return null;
        const b = smp(m[2]), c = m[3] === "国 未登録" ? L3("country not set", "国家未登记", "país sin registrar") : ctyName(m[3]);
        return (m[1] || "") + L3("Updated the negotiation status of " + b + " (" + c + ") to “" + stNm(m[4]) + "” (" + byNm(m[5]) + ")", "已将 " + b + "（" + c + "）的谈判状态更新为“" + stNm(m[4]) + "”（" + byNm(m[5]) + "）", "Estado de negociación de " + b + " (" + c + ") actualizado a «" + stNm(m[4]) + "» (" + byNm(m[5]) + ")");
    });
    PF(/^(📊 )?(.+?)（([^（）]+)）：ステータス「(.+?)」→「(.+?)」（(.+)）$/, (m) => {
        if (!isCty(m[3]) && m[3] !== "国 未登録")
            return null;
        const b = smp(m[2]), c = m[3] === "国 未登録" ? L3("country not set", "国家未登记", "país sin registrar") : ctyName(m[3]);
        return (m[1] || "") + L3(b + " (" + c + "): status “" + stNm(m[4]) + "” → “" + stNm(m[5]) + "” (" + byNm(m[6]) + ")", b + "（" + c + "）：状态“" + stNm(m[4]) + "”→“" + stNm(m[5]) + "”（" + byNm(m[6]) + "）", b + " (" + c + "): estado «" + stNm(m[4]) + "» → «" + stNm(m[5]) + "» (" + byNm(m[6]) + ")");
    });
    PF(/^(\[見本\] )?(.+?) への営業メール$/, (m) => { const b = smp((m[1] || "") + m[2]); return L3("Sales email to " + b, "发给 " + b + " 的营业邮件", "Correo comercial a " + b); });
    TZ("支払条件は、商品情報に登録の「", "付款条件取自商品信息中登记的“", "Las condiciones de pago se toman de la información del producto («");
    TZ("」から入れています（相手と違う条件に決めたら「受注内容の編集」の「支払」で直せます）。", "”（如与对方另行商定，可在“编辑订单内容”的“付款”中修改）。", "»). Si acuerda otras condiciones con el comprador, cámbielas en «Pago» de «Editar el pedido».");
    TZ("支払条件は、受注内容の編集で入れた「", "付款条件为在编辑订单内容中填写的“", "Las condiciones de pago son «");
    TZ("支払条件は、発注書の「", "付款条件取自订购单的“", "Las condiciones de pago son las de la orden de compra: «");
    TZ("支払条件は", "付款条件为", "Las condiciones de pago están ");
    TZ("です。相手と決めていない条件は入れていません（書類には「To be agreed」＝相手と決める、と出ます）。決めたら「受注内容の編集」の「支払」に入れてください。", "。未与对方商定的条件不会填写（单据上显示“To be agreed”＝与对方商定）。商定后请填写到“编辑订单内容”的“付款”中。", ". No se rellenan condiciones no acordadas (los documentos muestran «To be agreed»). Cuando las acuerde, indíquelas en «Pago» de «Editar el pedido».");
    TZ("」です。", "”。", "».");
    TZ("受注内容の編集", "编辑订单内容", "Editar el pedido");
    TZ("Seller 欄に住所を入れてください（見積書・請求書・梱包明細で共通です）", "请在 Seller 栏填写地址（报价单・发票・装箱单共用）", "Escriba la dirección en el campo Seller (común a la cotización, la factura y la lista de empaque)");
    TZ("見積書の Seller 欄に住所を入れてください", "请在报价单的 Seller 栏填写地址", "Escriba la dirección en el campo Seller de la cotización");
    TZ("未定（要確認）", "未定（需确认）", "Sin decidir (por confirmar)");
    TZ("支払条件が未定です（要確認）", "付款条件未定（需确认）", "Las condiciones de pago no están decididas (por confirmar)");
    TZ("送る前に入れる項目があります（下の赤の行）", "发送前有需要填写的项目（下方红色行）", "Hay datos que completar antes de enviar (filas en rojo)");
    TZ("入れる", "填写", "Completar");
    const CHIPS = [["自社で作る（上の「① ここで作る」で下書き）", "自行制作（在上方“① 在此制作”中起草）", "lo prepara usted (borrador arriba)"], ["発行機関へ申請する（申請用の下書きを作れます）", "向签发机构申请（可生成申请草稿）", "solicitar al organismo emisor (borrador disponible)"],
        ["自社・メーカーで用意する（ひな形を作れます）", "由本公司或制造商准备（可生成模板）", "lo prepara usted o el fabricante (plantilla disponible)"], ["物流会社が発行する", "由物流公司签发", "lo emite el transitario"],
        ["通関業者が申告する（税関の許可）", "由报关行申报（海关许可）", "lo presenta el agente de aduanas (permiso de aduana)"], ["輸入者（相手側）が手配する", "由进口方办理", "lo gestiona el importador"],
        ["保険会社が発行する", "由保险公司签发", "lo emite la aseguradora"], ["発行機関に申請・依頼して取得する", "向签发机构申请取得", "solicitar al organismo emisor"],
        ["メーカー（製造者）から取り寄せる", "向制造商索取", "solicitar al fabricante"], ["検査機関に依頼して取得する", "委托检验机构取得", "solicitar a un laboratorio de ensayos"]];
    CHIPS.forEach((c) => { TZ("条件に当たる時だけ：" + c[0], "仅在符合条件时：" + c[1], "Solo si aplica la condición: " + c[2]); TZ("要るか確かめる：" + c[0], "需确认是否需要：" + c[1], "Compruebe si hace falta: " + c[2]); });
    TZ("該当するときだけ", "仅在适用时", "Solo si aplica");
    TZ("対象外", "不适用", "No aplica");
    {
        const f = G((m) => L3("", "“仅在适用时”标记表示仅在符合条件时需要的手续（不计入必需件数）。是否适用可在“" + ctyName(m[1]) + "的法规”中选择。", "«Solo si aplica» marca trámites necesarios solo si se cumple la condición (no cuentan como obligatorios). Puede indicarlo en «Regulaciones de " + ctyName(m[1]) + "»."));
        PATS.push({ re: /^「該当するときだけ」の印は、条件に当たるときだけ要る手続きです（必須の件数には入れていません）。当たるかどうかは「(.+?)の規制」で選べます。$/, zh: f, es: f });
    }
    const payFix = (h) => {
        const l = lg();
        if (l === "ja" || typeof h !== "string" || h.indexOf("v92r3a-ja") < 0)
            return h;
        return h.replace(/(<span class="v68trnote v92r3a-ja"[^>]*>⚠ )The Payment line of this English document contains Japanese: “([\s\S]*?)”\. Rewrite it in English before sending \(Payment in “Edit order details”; e\.g\. T\/T in advance\)\.(<\/span>)/, (_a, o, pay, c) => {
            const raw = pay.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
            const ja = KANA.test(raw);
            const t = L3("The Payment line of this English document contains " + (ja ? "Japanese" : "non-English characters") + ": “" + raw + "”. Rewrite it in English before sending (Payment in “Edit order details”; e.g. T/T in advance).", "英文单据的 Payment（付款条件）中含有" + (ja ? "日文" : "非英文字符") + "：“" + raw + "”。发送前请改为英文（“编辑订单内容”的“付款”。例：T/T in advance）。", "La línea Payment de este documento en inglés contiene " + (ja ? "texto en japonés" : "caracteres no ingleses") + ": «" + raw + "». Reescríbala en inglés antes de enviarla (Pago en «Editar el pedido»; p. ej., T/T in advance).");
            return o + E(t) + c;
        });
    };
    try {
        if (typeof v54docSrcNote === "function") {
            const __sn = v54docSrcNote;
            v54docSrcNote = function () { const h = __sn.apply(this, arguments); try {
                return payFix(h);
            }
            catch (e) {
                return h;
            } };
        }
    }
    catch (e) {
        warn("doc", e);
    }
    const UNIT = { "個": ["pcs", "个", "uds."], "本": ["bottles / pcs", "瓶・支", "botellas / piezas"], "袋": ["bags", "袋", "bolsas"], "箱": ["boxes", "盒", "cajas"], "ケース": ["cases", "箱（整箱）", "estuches"],
        "カートン": ["cartons", "纸箱", "cajas de cartón"], "セット": ["sets", "套", "juegos"], "台": ["units", "台", "unidades"], "枚": ["sheets", "张", "hojas"], "パック": ["packs", "包", "paquetes"], "kg": ["kg", "kg", "kg"] };
    const unitNm = (u) => { const r = UNIT[String(u)]; return r ? L3(r[0], r[1], r[2]) : String(u); };
    const pxFix = () => {
        try {
            const ja = lg() === "ja";
            ["v83pxFx", "v83pxFq"].forEach((id) => {
                const s = el(id);
                if (!s || (ja && !s.hasAttribute("data-r9c")))
                    return;
                s.setAttribute("data-noi18n", "1");
                s.setAttribute("data-r9c", "1");
                Array.from(s.options).forEach((o) => { const v = String(o.value || ""); if (!v)
                    return; const t = ja ? v : unitNm(v); if (o.textContent !== t)
                    o.textContent = t; });
            });
            if (ja)
                return;
            const p = el("v83pxFmq");
            if (p) {
                let reg = "";
                try {
                    reg = typeof v83pxMoqRegUnit === "function" && typeof v83pxCurTen === "function" ? String(v83pxMoqRegUnit(v83pxCurTen()) || "") : "";
                }
                catch (e) {
                    reg = "";
                }
                if (reg && UNIT[reg]) {
                    const t0 = String(p.textContent || "");
                    const t1 = t0.split("“" + reg + "”").join("“" + unitNm(reg) + "”").split("«" + reg + "»").join("«" + unitNm(reg) + "»");
                    if (t1 !== t0) {
                        p.setAttribute("data-noi18n", "1");
                        p.textContent = t1;
                    }
                }
            }
        }
        catch (e) {
            warn("px", e);
        }
    };
    try {
        if (typeof v83pxEdit === "function") {
            const __pe = v83pxEdit;
            v83pxEdit = function () { const r = __pe.apply(this, arguments); try {
                pxFix();
                setTimeout(pxFix, 80);
            }
            catch (e) { } return r; };
        }
    }
    catch (e) {
        warn("pxw", e);
    }
    PF(/^未翻訳の下書き（(.+)・(\d+)枚）$/, (m) => L3("Untranslated draft (" + m[1] + " · " + m[2] + " slides)", "未翻译的草稿（" + m[1] + "・" + m[2] + " 页）", "Borrador sin traducir (" + m[1] + " · " + m[2] + " diapositivas)"));
    PF(/^型：(.+?)（AI商社マンの判断・(.+)）$/, (m) => {
        const why = /区分「/.test(m[2]) ? m[2].replace(/区分「(.+?)」/, (_a, c) => L3("category “" + tr(c) + "”", "类别“" + tr(c) + "”", "categoría «" + tr(c) + "»")).replace(/・(?=HS|category|类别|categoría)/g, L3(", ", "・", ", ")) : tr(m[2]);
        return L3("Template: " + tr(m[1]) + " (chosen by the AI Trade Agent; " + why + ")", "模板：" + tr(m[1]) + "（AI商社专员的判断・" + why + "）", "Plantilla: " + tr(m[1]) + " (elegida por el agente comercial IA; " + why + ")");
    });
    const REGT = {
        "電池（リチウム電池など）が入っているか": ["是否含电池（锂电池等）", "¿Contiene baterías (p. ej., de litio)?"], "入っている": ["含有", "Sí, contiene"], "入っていない": ["不含电池", "Sin baterías"],
        "無線（Bluetooth・Wi-Fi など）を使うか": ["是否使用无线（Bluetooth・Wi-Fi 等）", "¿Usa radio (Bluetooth, Wi-Fi, etc.)?"], "使う": ["使用", "Sí"], "使わない": ["不使用", "No"],
        "スプレー缶（ガスの圧力で出す加圧容器）か": ["是否为喷雾罐（靠气体压力喷出的加压容器）", "¿Es un aerosol (envase presurizado)?"], "スプレー缶（加圧容器）": ["喷雾罐（加压容器）", "Aerosol"], "スプレー缶ではない（トリガー・ポンプ式など）": ["不是喷雾罐（扳机式・泵式等）", "No es aerosol (gatillo o bomba)"],
        "食品に触れる用途の物か（食器・容器・調理器具など）": ["是否为接触食品的用途（餐具・容器・厨具等）", "¿Está destinado a tocar alimentos (vajilla, envases, utensilios)?"], "食品に触れる用途": ["接触食品", "Sí, contacto con alimentos"], "食品に触れる用途ではない": ["不接触食品", "Sin contacto con alimentos"],
        "該当するか確認（商品の登録からは決められません）": ["确认是否适用（无法根据商品登记确定）", "Compruebe si aplican (no se puede decidir con el registro)"], "該当するか確認": ["确认是否适用", "Comprobar"],
        "次の手続きは、商品の作りによって要る・要らないが分かれます。「必須・未対応」とは数えていません。当てはまるかを選ぶと、規制を調べる・書類をつくる・AI商社マンの答えのどれにも使います。": ["以下手续是否需要取决于商品的构造，不计入“必需・未处理”。选择是否适用后，将用于查法规・制作单证・AI商社专员的回答。", "Estos trámites dependen de cómo está hecho el producto y no cuentan como obligatorios. Su respuesta se usa en Regulaciones, Documentos y la IA."],
        "分からない理由：": ["不确定的原因：", "Por qué no se sabe: "], "商品に合わないため外した手続き": ["因不适合该商品而排除的手续", "Trámites quitados por no aplicar a este producto"], "答えを取り消す": ["撤销回答", "Deshacer la respuesta"], "実は当てはまる": ["其实适用", "En realidad sí aplica"],
        "下の「該当するか確認」で、商品に当てはまるかを選んでください。当てはまるものは必須の手続きになります（必須の数には入れていません）。": ["请在下方“确认是否适用”中选择是否适用于该商品。适用的将成为必需手续（尚未计入必需数量）。", "Indique abajo si aplican. Los que apliquen pasan a ser obligatorios (aún no cuentan como obligatorios)."],
        "「規制を調べる」で当てはまるかを選ぶと、必須の手続きかどうかが決まります。": ["在“查法规”中选择是否适用后，即可确定是否为必需手续。", "Responda en «Revisar regulaciones» para decidirlo."],
        "答えを残しました。規制を調べる・書類をつくる・AI商社マンの答えに使います": ["已保存回答。将用于查法规・制作单证・AI商社专员的回答", "Guardado. Se usa en Regulaciones, Documentos y la IA"],
        "品名に電気で動く物の語": ["品名中含有电动物品的词", "El nombre sugiere un artículo eléctrico"], "電動・光る・音が出るなどの玩具": ["电动・发光・发声等玩具", "Juguete electrónico"], "電気を使わない玩具（登録から）": ["不使用电的玩具（根据登记）", "Juguete no eléctrico (según el registro)"],
        "機械・照明（電気を使うかは登録から分かりません）": ["机械・照明（无法根据登记判断是否用电）", "Máquina o lámpara (no se sabe si es eléctrica)"], "ヒアリングの答え": ["访谈的回答", "Su respuesta en la entrevista"],
        "電気で動く商品ですが、電池の有無が登録にありません": ["是电动商品，但登记中没有是否含电池的信息", "Artículo eléctrico; no consta si lleva batería"], "電池を使う商品ではありません（登録から）": ["不是使用电池的商品（根据登记）", "No lleva batería (según el registro)"],
        "電気で動く商品ですが、無線を使うかが登録にありません": ["是电动商品，但登记中没有是否使用无线的信息", "Artículo eléctrico; no consta si usa radio"], "無線を使う商品ではありません（登録から）": ["不是使用无线的商品（根据登记）", "No usa radio (según el registro)"],
        "食品そのものの商品です（包装の決まりは別に確かめます）": ["商品本身是食品（包装规定另行确认）", "El producto es un alimento (las normas de envase se revisan aparte)"], "登録の答え「食品に触れない」": ["登记的回答“不接触食品”", "El registro dice: sin contacto con alimentos"],
        "ヒアリングの答え「食品接触あり」": ["访谈的回答“接触食品”", "Respuesta de la entrevista: contacto con alimentos"],
        "同点": ["同分", "Empate"], "未評価": ["未评价", "Sin evaluar"],
    };
    try {
        if (typeof v92regM === "function") {
            const __rg = v92regM;
            v92regM = function (ja) { try {
                const l = lg();
                if (l === "zh" || l === "es") {
                    const r = REGT[String(ja)];
                    if (r)
                        return l === "zh" ? r[0] : r[1];
                }
            }
            catch (e) { } return __rg.apply(this, arguments); };
        }
    }
    catch (e) {
        warn("reg", e);
    }
    const CMPL = { "日本勢の競合が多い": ["many Japanese competitors", "日本竞争者较多", "muchos competidores japoneses"], "一定の競合あり": ["some competition", "有一定竞争", "algo de competencia"], "競合は少なめ": ["few competitors", "竞争较少", "poca competencia"] };
    TR("通関統計に日本からの輸出実績が無い（先行者不在＝開拓型）", "No exports from Japan in customs statistics (no first movers: a market to open up)", "通关统计中没有日本的出口实绩（无先行者＝开拓型）", "Sin exportaciones de Japón en las estadísticas aduaneras (sin pioneros: mercado por abrir)");
    PF(/^(：)?日本からの輸出シェア(\d+)%＝(日本勢の競合が多い|一定の競合あり|競合は少なめ)(?:・市場平均単価 \$([\d.,]+)\/([^・]+))?(?:・(.+))?$/, (m) => {
        const v = CMPL[m[3]], u = m[5] ? (m[5] === "単位" ? L3("unit", "单位", "unidad") : tr(m[5])) : "", note = m[6] ? tr(m[6]) : "";
        const hd = m[1] ? L3(": ", "：", ": ") : "";
        return hd + L3("Japan's export share " + m[2] + "% = " + v[0] + (m[4] ? " · average market unit price $" + m[4] + "/" + u : "") + (note ? " · " + note : ""), "日本出口份额" + m[2] + "%＝" + v[1] + (m[4] ? "・市场平均单价 $" + m[4] + "/" + u : "") + (note ? "・" + note : ""), "Cuota de exportación de Japón " + m[2] + " % = " + v[2] + (m[4] ? " · precio medio de mercado $" + m[4] + "/" + u : "") + (note ? " · " + note : ""));
    });
    const dutyTr = (m) => L3("Duty " + m[1] + "% (incl. additional tariffs; to be confirmed)" + (m[2] ? "; clearance " + m[2] + (m[3] ? "–" + m[3] : "") + " business days" : ""), "关税" + m[1] + "%（含附加关税・需确认）" + (m[2] ? "・通关" + m[2] + (m[3] ? "〜" + m[3] : "") + "个工作日" : ""), "Arancel " + m[1] + " % (incl. aranceles adicionales; por confirmar)" + (m[2] ? "; despacho " + m[2] + (m[3] ? "–" + m[3] : "") + " días hábiles" : ""));
    PF(/^関税([\d.]+)%（追加関税を含む・要確認）(?:・通関(\d+)(?:〜(\d+))?営業日)?$/, dutyTr);
    PF(/^(関税[\d.]+%（追加関税を含む・要確認）(?:・通関\d+(?:〜\d+)?営業日)?)(／| \/ )(.+)$/, (m) => { const a = tr(m[1]), b = hasJ(m[3]) ? tr(m[3]) : m[3]; if (hasJ(a))
        return null; return a + (lg() === "zh" ? "／" : " / ") + b; });
    const rateEn = (s) => String(s).replace(/＝/g, " = ").replace(/（/g, " (").replace(/）/g, ")").replace(/・/g, ", ").replace(/／/g, " / ").replace(/。/g, ". ").replace(/ {2,}/g, " ").replace(/\( /g, "(");
    const rateHtml = (h) => h.replace(/(Converted at |Conversión: )([^<]*)/g, (_a, p, t) => p + rateEn(t));
    try {
        if (typeof vDash === "function") {
            const __vd = vDash;
            vDash = function () { const h = __vd.apply(this, arguments); try {
                const l = lg();
                if ((l === "en" || l === "es") && typeof h === "string" && /Converted at |Conversión: /.test(h))
                    return rateHtml(h);
            }
            catch (e) { } return h; };
        }
    }
    catch (e) {
        warn("vdash", e);
    }
    try {
        if (DI && Array.isArray(I18N.pat) && typeof i18nStr === "function") {
            PATS.slice().reverse().forEach((p) => I18N.pat.unshift(p));
            const __st = i18nStr;
            i18nStr = function (s, d) {
                try {
                    const l = lg();
                    if (l !== "ja" && d && d === DI[l] && s != null) {
                        const k = String(s).trim();
                        if (k && k.length <= 1500 && d[k] == null) {
                            for (const p of PATS) {
                                const f = p[l];
                                if (!f)
                                    continue;
                                const m = k.match(p.re);
                                if (!m)
                                    continue;
                                const r = f(m);
                                if (r != null)
                                    return String(s).replace(k, () => r);
                            }
                        }
                    }
                }
                catch (e) {
                    warn("str", e);
                }
                const r0 = __st.apply(this, arguments);
                try {
                    if (lg() === "zh" && d && DI && d === DI.zh) {
                        const v = r0 == null ? String(s == null ? "" : s) : String(r0);
                        if (v.indexOf("累计订单金额") >= 0 || v.indexOf("“受注”") >= 0)
                            return v.split("累计订单金额").join("累计接单金额").split("“受注”").join("“成交”");
                    }
                }
                catch (e) { }
                return r0;
            };
        }
    }
    catch (e) {
        warn("dict", e);
    }
    const mine = (k, l) => {
        if (MINE[l] && MINE[l][k] != null)
            return MINE[l][k];
        for (const p of PATS) {
            if (!p[l])
                continue;
            const m = k.match(p.re);
            if (!m)
                continue;
            try {
                const r = p[l](m);
                if (r != null)
                    return r;
            }
            catch (e) { }
        }
        return null;
    };
    const REGEN = {
        "Procedures needed only when they apply": ["仅在适用时需要的手续", "Trámites necesarios solo si aplican"], "(not counted as required)": ["（不计入必需的件数）", "(no cuentan como obligatorios)"],
        "Not yet confirmed": ["尚未确认是否适用", "Sin confirmar"], "Condition": ["条件", "Condición"], "Back to unconfirmed": ["恢复为未确认", "Volver a sin confirmar"],
        "Requested (add to documents)": ["已被要求（加入单证）", "Solicitado (añadir a los documentos)"], "Applies (make it required)": ["适用（设为必需）", "Aplica (hacerlo obligatorio)"],
        "Not applicable": ["不适用", "No aplica"], "Marked not applicable": ["已设为不适用", "Marcado como no aplicable"], "Added to the documents": ["已加入单证", "Añadido a los documentos"],
        "Conditional procedure": ["条件性手续", "Trámite condicional"], "You marked it as applicable, so it is counted as required.": ["已设为“适用”，因此计入必需。", "Lo marcó como aplicable, así que cuenta como obligatorio."],
        "Needed when the destination's registration or import procedure asks for it.": ["在对方国家的登记・进口手续中被要求时需要。", "Necesario si el registro o la importación en destino lo exige."],
        "Needed when the device is Class B–D in Singapore (Class A is exempt from product registration but must be notified).": ["在新加坡属于 B〜D 类时需要（A 类免于产品注册，但需备案）。", "Necesario si el dispositivo es de clase B–D en Singapur (la clase A está exenta de registro, pero debe notificarse)."],
        "For medical devices, first confirm the device class in the destination country. Classes are set by each country and may differ from the Japanese class. Ask the importer, the local registration agent, or the authority's classification guidance. Then choose “Applies / Not applicable” below.": ["医疗器械请先确认在目的国的分类。分类由各国规定，可能与日本的分类不同。请向进口商、当地注册代理或主管机关的分类指南确认，然后在下方选择“适用／不适用”。", "Para dispositivos médicos, confirme primero la clase en el país de destino. Cada país fija sus clases, que pueden diferir de la japonesa. Consulte al importador, al agente de registro local o a la guía de la autoridad, y luego elija «Aplica / No aplica» abajo."],
        "Points to check for this product and destination": ["该商品和目的地需要确认的要点", "Puntos a comprobar para este producto y destino"],
        "These are points not covered by the template table above (a rough guide by category). Whether they are mandatory depends on product details and the destination's latest rules. Check before shipping.": ["这些是上方模板表中未涵盖的要点（按类别的大致参考）。是否为必需取决于商品细节和目的地的最新规定。请在出货前确认。", "Son puntos que no cubre la tabla de plantilla anterior (guía aproximada por categoría). Si son obligatorios depende del producto y de las normas vigentes en destino. Compruébelo antes del envío."],
        "From the app's document decision table (HS code × destination)": ["“制作单证”的判断表（HS 编码 × 目的地）中对应的项目", "De la tabla de decisión de documentos de la app (código HS × destino)"],
        "items not in the template above, with sources": ["上方模板表中没有的项目・附出处", "puntos que no están en la plantilla anterior, con fuentes"],
        "Points to check for this type of product": ["该行业需要确认的观点", "Puntos a comprobar para este tipo de producto"],
        "First confirm the device class in the destination": ["先确认在目的地的分类", "Confirme primero la clase en el destino"],
        "Ask STANDAGE to research": ["请 STANDAGE 调查", "Pedir a STANDAGE que lo investigue"], "See all in “Create documents”": ["在“制作单证”中查看全部", "Ver todo en «Crear documentos»"],
        "How to research further (AI / ask STANDAGE)": ["进一步调查的方法（AI／委托 STANDAGE）", "Cómo investigar más (IA / pedir a STANDAGE)"],
        "The table above is a rough guide. For details, use the AI research or ask your STANDAGE representative.": ["上表为大致参考。详情请使用AI调查或咨询 STANDAGE 负责人。", "La tabla anterior es orientativa. Para más detalle, use la investigación con IA o consulte a su contacto de STANDAGE."],
    };
    const regEn = (k) => {
        const l = lg();
        if (l !== "zh" && l !== "es")
            return null;
        const i = l === "zh" ? 0 : 1;
        const pre = /^[：:]\s?/.test(k) ? (l === "zh" ? "：" : ": ") : "";
        const b = k.replace(/^[：:]\s?/, "");
        if (REGEN[b])
            return pre + REGEN[b][i];
        let m = b.match(/^🔎 Points to check for this product and destination(?:（(.+?)・HS (.+)）| \((.+?) · HS (.+)\))$/);
        if (m && m[3])
            m = [m[0], m[3], m[4]];
        if (m)
            return "🔎 " + REGEN["Points to check for this product and destination"][i] + (l === "zh" ? "（" + m[1] + "・HS " + m[2] + "）" : " (" + m[1] + " · HS " + m[2] + ")");
        m = b.match(/^In addition, (\d+) procedure\(s\) are not yet confirmed as applicable \(choose “Applies \/ Not applicable” under “Procedures needed only when they apply” above\)\.$/);
        if (m)
            return l === "zh" ? "此外还有 " + m[1] + " 项手续尚未确认是否适用（请在上方“仅在适用时需要的手续”中选择适用／不适用）。" : "Además, hay " + m[1] + " trámite(s) sin confirmar (elija «Aplica / No aplica» en «Trámites necesarios solo si aplican», arriba).";
        m = b.match(/^Applied from the category \((.+)\); please confirm$/);
        if (m)
            return l === "zh" ? "根据类别（" + m[1] + "）适用；请确认" : "Aplicado por la categoría (" + m[1] + "); confírmelo";
        m = b.match(/^(.+?) — general guidance without country details \(please confirm\)$/);
        if (m)
            return l === "zh" ? m[1] + "・一般性注意，不含各国细则（需确认）" : m[1] + ": orientación general sin detalles por país (por confirmar)";
        return null;
    };
    const ctyPar = (s) => s.replace(/[（(]([^（）()]{1,16})[）)]/g, (a, c) => isCty(c) ? par(ctyName(c)) : a);
    const SEL = "section.v33dg li, .v38li-t b, .v38li .v33mute, .v92r7a-ask p b, #v92r6bDrill, #tst, .v92f-case";
    let busy = false;
    function polish() {
        const l = lg();
        if (l === "ja" || busy || typeof I18N === "undefined")
            return;
        busy = true;
        try {
            const reg = (l === "zh" || l === "es") && !!document.querySelector("#well .v92o-ch, #well .v92o-pts, #well .v92o-h3, #well .v92o-cn, #well .v92o-tag");
            const roots = Array.from(document.querySelectorAll(SEL));
            if (reg) {
                const w0 = document.getElementById("well");
                if (w0)
                    roots.push(w0);
            }
            for (let i = 0; i < roots.length && i < 400; i++) {
                const root = roots[i];
                const isReg = reg && root.id === "well";
                const ask = !!(root.closest && root.closest(".v92r7a-ask"));
                const drill = root.id === "v92r6bDrill";
                const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
                const L = [];
                while (w.nextNode() && L.length < 600)
                    L.push(w.currentNode);
                for (const n of L) {
                    const p = n.parentNode;
                    if (!p || /^(SCRIPT|STYLE|TEXTAREA|OPTION)$/.test(p.nodeName))
                        continue;
                    const v = String(n.nodeValue || "");
                    const k = v.trim();
                    if (!k || k.length > 1500)
                        continue;
                    let t = null;
                    if (isReg) {
                        if (!JP.test(k)) {
                            const r = regEn(k);
                            if (r != null && r !== k)
                                n.nodeValue = v.replace(k, () => r);
                        }
                        continue;
                    }
                    if (hasJ(k)) {
                        const src = I18N.orig && I18N.orig.has(n) ? String(I18N.orig.get(n)).trim() : k;
                        const r = src === k ? mine(k, l) : null;
                        if (r != null) {
                            if (!I18N.orig.has(n))
                                I18N.orig.set(n, v);
                            n.nodeValue = v.replace(k, () => r);
                            continue;
                        }
                        let x = k.replace(/（見本）/g, L3(" (sample)", "（示例）", " (muestra)")).replace(/^\[見本\] ?/, L3("[Sample] ", "[示例] ", "[Muestra] "));
                        x = ctyPar(x);
                        if (drill || ask)
                            x = x.replace(/(\d[\d,.]*)\s*(個|本|袋|箱|ケース|カートン|セット|台|枚|パック)(?![ぁ-ゖァ-ヺ一-鿿])/g, (_a, q, u) => q + (l === "zh" ? "" : " ") + unitNm(u));
                        if (x !== k)
                            t = x;
                    }
                    if (l === "en" || l === "es") {
                        let y = t == null ? k : t;
                        const y0 = y;
                        y = y.replace(/(\d{4}-\d\d-\d\d)：/g, "$1: ");
                        if (ask)
                            y = y.replace(/・/g, ", ");
                        if (drill && /^(Converted at |Conversión: )/.test(y))
                            y = y.replace(/^(Converted at |Conversión: )([\s\S]*)$/, (_a, a, b) => a + rateEn(b));
                        if (drill)
                            y = y.replace(/）：/g, "): ").replace(/：/g, ": ").replace(/（([^（）ぁ-ゖァ-ヺ一-鿿]*)）/g, (_a, c) => " (" + c.replace(/・/g, ", ") + ")");
                        if (y !== y0)
                            t = y;
                    }
                    if (t != null && t !== k)
                        n.nodeValue = v.replace(k, () => t);
                }
            }
        }
        catch (e) {
            warn("polish", e);
        }
        busy = false;
    }
    let pT = 0;
    const kick = () => { if (pT || lg() === "ja")
        return; pT = setTimeout(() => { pT = 0; polish(); }, 220); };
    try {
        const start = () => { try {
            new MutationObserver(() => { if (lg() !== "ja")
                kick(); }).observe(document.body, { childList: true, subtree: true, characterData: true });
        }
        catch (e) { } };
        if (document.body)
            start();
        else
            document.addEventListener("DOMContentLoaded", start);
    }
    catch (e) { }
    try {
        if (typeof dashDrill === "function") {
            const __dd = dashDrill;
            dashDrill = function () { const r = __dd.apply(this, arguments); try {
                setTimeout(polish, 30);
            }
            catch (e) { } return r; };
        }
    }
    catch (e) { }
    try {
        document.addEventListener("change", (ev) => { try {
            if (ev && ev.target && ev.target.id === "lang")
                setTimeout(() => { pxFix(); dealFormFix(); }, 900);
        }
        catch (e) { } }, false);
    }
    catch (e) { }
    W.v92r9c = { polish, err: ERR, n: PATS.length, ctyOf, cset, rmTr, cmpFix, payFix };
})();
