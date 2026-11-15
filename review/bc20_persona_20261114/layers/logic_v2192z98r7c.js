(function () {
    const W = window;
    if (W.__v2192r7c)
        return;
    W.__v2192r7c = 1;
    try {
        if (typeof I18N === "undefined" || !I18N || !I18N.dict || !Array.isArray(I18N.pat) || typeof i18nStr !== "function")
            return;
        const DI = I18N.dict;
        ["en", "zh", "es"].forEach((l) => { if (!DI[l])
            DI[l] = {}; });
        const MINE = { en: {}, zh: {}, es: {} };
        const PATS = [];
        const JP = /[ぁ-ゖァ-ヺ一-鿿々]/, KANA = /[ぁ-ゖァ-ヺ]/;
        const lg = () => String(I18N.lang || "ja");
        const L3 = (en, zh, es) => lg() === "zh" ? zh : lg() === "es" ? es : en;
        const hasJ = (s) => (lg() === "zh" ? KANA : JP).test(String(s));
        const TR = (ja, en, zh, es) => { if (DI.en[ja] == null)
            DI.en[ja] = en; if (DI.zh[ja] == null)
            DI.zh[ja] = zh; if (DI.es[ja] == null)
            DI.es[ja] = es; };
        const TN = (ja, en, zh, es) => { TR(ja, en, zh, es); MINE.en[ja] = en; MINE.zh[ja] = zh; MINE.es[ja] = es; };
        const TE = (en, zh, es) => { if (DI.zh[en] == null)
            DI.zh[en] = zh; if (DI.es[en] == null)
            DI.es[en] = es; MINE.zh[en] = zh; MINE.es[en] = es; };
        const TEM = (en, zh, es) => { MINE.zh[en] = zh; MINE.es[en] = es; };
        const tr = (x) => { try {
            const r = i18nStr(String(x), DI[lg()] || {});
            return r == null ? String(x) : r;
        }
        catch (e) {
            return String(x);
        } };
        const known = (x) => { try {
            return !hasJ(x) || i18nStr(String(x), DI[lg()] || {}) != null;
        }
        catch (e) {
            return false;
        } };
        const HOLE = /\{[A-Za-z]\w*\}/;
        const G = (f) => (m) => { for (let i = 1; i < m.length; i++)
            if (m[i] && HOLE.test(m[i]))
                return null; return f(m); };
        const PF = (re, f0) => { const f = G(f0); PATS.push({ re, en: f, zh: f, es: f }); };
        const PN = (re, f0) => { const f = G(f0); PATS.push({ re, en: f, zh: f, es: f, no: 1 }); };
        const PE = (re, f0) => { const f = G(f0); PATS.push({ re, zh: f, es: f, no: 1 }); };
        const sepL = () => lg() === "zh" ? "・" : ", ";
        const dot = () => lg() === "zh" ? "・" : " · ";
        const par = (s) => lg() === "zh" ? "（" + s + "）" : " (" + s + ")";
        const low = (s) => lg() === "zh" ? s : s.charAt(0).toLowerCase() + s.slice(1);
        const splitDot = (s) => { const out = []; let d = 0, c = ""; for (const ch of String(s)) {
            if (ch === "（" || ch === "(")
                d++;
            else if (ch === "）" || ch === ")")
                d = Math.max(0, d - 1);
            if (ch === "・" && d === 0) {
                out.push(c);
                c = "";
            }
            else
                c += ch;
        } out.push(c); return out; };
        const trList = (s, sp) => {
            const a = splitDot(s), out = [];
            for (let i = 0; i < a.length;) {
                let hit = 0;
                for (let j = Math.min(a.length, i + 4); j > i + 1; j--) {
                    const c = a.slice(i, j).join("・");
                    const dv = (DI[lg()] || {})[c];
                    if (typeof dv === "string" && dv) {
                        out.push(dv);
                        i = j;
                        hit = 1;
                        break;
                    }
                }
                if (!hit) {
                    out.push(tr(a[i]));
                    i++;
                }
            }
            return out.join(sp == null ? sepL() : sp);
        };
        const PM = {};
        const prod = (s0) => {
            const s = String(s0), l = lg(), key = l + "|" + s;
            if (PM[key] != null)
                return PM[key];
            let out = s;
            try {
                const d = DI[l] || {};
                if (typeof d[s] === "string" && d[s])
                    out = d[s];
                else if (JP.test(s)) {
                    const pre = s.replace(/…$/, "");
                    if (pre.length >= 6) {
                        for (const k in d) {
                            if (k.length > pre.length && k.lastIndexOf(pre, 0) === 0 && typeof d[k] === "string" && d[k] && !JP.test(d[k])) {
                                const v = String(d[k]);
                                out = v.length > 30 ? v.slice(0, 29) + "…" : v + "…";
                                break;
                            }
                        }
                    }
                }
            }
            catch (e) { }
            PM[key] = out;
            return out;
        };
        const smp = (s) => String(s).replace(/^\[見本\] ?/, L3("[Sample] ", "[示例] ", "[Muestra] ")).replace(/（見本）$/, L3(" (sample)", "（示例）", " (muestra)"));
        const days = (s) => { const m = String(s).match(/^(\d+)〜(\d+)営業日$/); return m ? L3(m[1] + "–" + m[2] + " business days", m[1] + "〜" + m[2] + "个工作日", m[1] + "–" + m[2] + " días hábiles") : tbc(s); };
        const tbc = (s) => String(s).trim() === "要確認" ? L3("to be confirmed", "需确认", "por confirmar") : tr(s);
        const fy = (s) => { const m = String(s).match(/^(\d{4})(?:〜(\d\d))?年度$/); return m ? L3("FY" + m[1] + (m[2] ? "–" + m[2] : ""), m[1] + (m[2] ? "〜" + m[2] : "") + "财年", "AF" + m[1] + (m[2] ? "–" + m[2] : "")) : tr(s); };
        TR("総合点が最も高い", "Highest overall score", "综合得分最高", "Mayor puntuación global");
        TR("おすすめの中で総合点が最も高い", "Highest overall score among the picks", "推荐中综合得分最高", "Mayor puntuación global entre las recomendadas");
        TR("総合点の順位", "Overall rank", "综合排名", "Posición global");
        TR("総合点の順位：", "Overall rank: ", "综合排名：", "Posición global: ");
        TR("総合点", "Overall score", "综合得分", "Puntuación global");
        TR("総合スコア", "Overall score", "综合得分", "Puntuación global");
        TR("総合", "Overall", "综合", "Global");
        TR("要点", "Key points", "要点", "Puntos clave");
        TR("選択中（押すと外す）", "Selected (click to remove)", "已选（点击取消）", "Seleccionado (pulse para quitar)");
        TR("選択中（外す）", "Selected (remove)", "已选（取消）", "Seleccionado (quitar)");
        TR("選択する", "Select", "选择", "Seleccionar");
        TR("押すと外します", "Click to remove", "点击取消选择", "Pulse para quitar");
        TR("押すと選びます（3か国まで）", "Click to select (up to 3 countries)", "点击选择（最多3个国家）", "Pulse para seleccionar (hasta 3 países)");
        TR("主要指標の比較", "Key indicators compared", "主要指标对比", "Comparación de indicadores clave");
        TR("選択中の販売先国", "Selected target markets", "已选的销售目标国", "Países de venta seleccionados");
        TR("確定した販売先国", "Confirmed target markets", "已确定的销售目标国", "Países de venta confirmados");
        TR("/ 3 か国", "/ 3 countries", "/ 3 个国家", "/ 3 países");
        TR("国を選ぶと確定できます", "Select countries to confirm", "选择国家后即可确定", "Elija países para poder confirmar");
        TR("選び直す", "Choose again", "重新选择", "Volver a elegir");
        TR("確定した国で次へ（規制を調べる）", "Continue with the confirmed countries (Check regulations)", "以已确定的国家进入下一步（查法规）", "Seguir con los países confirmados (Ver regulaciones)");
        TR("確定した国で次へ（規制確認）", "Continue with the confirmed countries (Check regulations)", "以已确定的国家进入下一步（查法规）", "Seguir con los países confirmados (Ver regulaciones)");
        TR("③ 確定後の連動", "③ What is linked after you confirm", "③ 确定后的联动", "③ Qué se vincula al confirmar");
        TR("確定後の連動", "What is linked after you confirm", "确定后的联动", "Qué se vincula al confirmar");
        TR("推奨理由", "Why recommended", "推荐理由", "Motivo de la recomendación");
        TR("リスク", "Risks", "风险", "Riesgos");
        TR("最初の一歩", "First step", "第一步", "Primer paso");
        TR("確定済み", "Confirmed", "已确定", "Confirmado");
        TR("分析済み・未確定", "Analysed, not confirmed", "已分析・未确定", "Analizado, sin confirmar");
        TR("（高いほど競合が少ない）", "(higher = fewer competitors)", "（分越高竞争越少）", "(más alto = menos competidores)");
        const NOSTAT = ["通関統計に、この国向けの輸出の数字がありません（競合の状況は分かりません・要確認）", "Customs statistics show no export figures for this country (competition unknown; needs checking)", "通关统计中没有面向该国的出口数据（竞争情况不明・需确认）", "Las estadísticas aduaneras no tienen cifras de exportación a este país (competencia desconocida; por verificar)"];
        const NOHS = ["この HS コードの通関統計を引けていません（競合の状況は分かりません・要確認）", "Customs statistics for this HS code could not be retrieved (competition unknown; needs checking)", "未能查到该 HS 编码的通关统计（竞争情况不明・需确认）", "No se pudieron obtener las estadísticas aduaneras de este código SA (competencia desconocida; por verificar)"];
        [NOSTAT, NOHS].forEach((r) => { TR(r[0], r[1], r[2], r[3]); TR("：" + r[0], ": " + r[1], "：" + r[2], ": " + r[3]); });
        TR("貿易実務（規制・関税・必要書類）", "Trade operations (regulations, duties, required documents)", "贸易实务（法规・关税・所需单证）", "Operativa de comercio exterior (normativa, aranceles, documentos)");
        TR("商品情報の価格設定（推奨FOB・DDP）", "Pricing in Product info (recommended FOB / DDP)", "商品信息的定价（推荐FOB・DDP）", "Precios en la información del producto (FOB / DDP recomendados)");
        TR("出荷を進める（物流AI見積の送り先）", "Proceed to shipping (destinations for AI freight quotes)", "推进出货（物流AI报价的目的地）", "Avanzar envío (destinos para cotizaciones de flete con IA)");
        TR("AIバイヤー開拓・拠点（AIバイヤー開拓の国の候補）", "AI Buyer Prospecting & Bases (candidate countries for prospecting)", "AI买家开拓・据点（AI买家开拓的候选国家）", "Prospección IA y bases (países candidatos para la prospección)");
        TR("物流会社に見積を依頼（相見積）→", "Request quotes from forwarders (comparison) →", "向物流公司询价（比价）→", "Pedir cotizaciones a transitarios (comparativa) →");
        TR("必要書類", "Required documents", "所需单证", "Documentos necesarios");
        TR("現地拠点なし（本社からの遠隔対応）", "No local base (remote support from head office)", "无当地据点（由总部远程对应）", "Sin base local (atención remota desde la sede)");
        TR("規制・関税が未確認", "Regulations and duties not yet confirmed", "法规・关税尚未确认", "Normativa y aranceles sin confirmar");
        TR("輸出額が前年比マイナス", "Exports are down year on year", "出口额同比下降", "Las exportaciones bajan respecto al año anterior");
        TR("規制の詳細調査（AI）→ 必要書類の確定 → 提案", "Detailed regulation research (AI) → settle the required documents → propose", "法规详细调查（AI）→ 确定所需单证 → 提案", "Investigación detallada de la normativa (IA) → definir los documentos → propuesta");
        if (DI.en["、"] == null)
            DI.en["、"] = ", ";
        if (DI.es["、"] == null)
            DI.es["、"] = ", ";
        PF(/^(\d+)か国中 (\d+)位$/, (m) => L3("No. " + m[2] + " of " + m[1] + " countries", m[1] + "个国家中第" + m[2] + "名", "n.º " + m[2] + " de " + m[1] + " países"));
        PF(/^総合 (\d+)位$/, (m) => L3("Overall No. " + m[1], "综合第" + m[1] + "名", "N.º " + m[1] + " global"));
        PF(/^総合 (\d+)点・(\d+)位$/, (m) => L3("Overall " + m[1] + " pts · No. " + m[2], "综合 " + m[1] + "分・第" + m[2] + "名", "Global " + m[1] + " pts · n.º " + m[2]));
        PF(/^おすすめ (\d+)$/, (m) => L3("Pick " + m[1], "推荐 " + m[1], "Recomendado " + m[1]));
        PF(/^(\d+)点$/, (m) => L3(m[1] + " pts", m[1] + "分", m[1] + " pts"));
        PF(/^この(\d+)か国で確定する$/, (m) => L3("Confirm " + (m[1] === "1" ? "this country" : "these " + m[1] + " countries"), "确定这" + m[1] + "个国家", "Confirmar " + (m[1] === "1" ? "este país" : "estos " + m[1] + " países")));
        PF(/^点数は0〜100点の目安（高いほど有利）。配点は市場性(\d+)・規制(\d+)・競合(\d+)・拠点(\d+)。(おすすめは、AI商社マンが点数に加えて商品の特性で決めています。)?$/, (m) => L3("Scores are a 0–100 guide (higher is better). Weights: market potential " + m[1] + ", regulations " + m[2] + ", competition " + m[3] + ", bases " + m[4] + "." + (m[5] ? " The picks are decided by the AI Trade Agent from the scores plus the product's characteristics." : ""), "分数为0〜100分的参考值（越高越有利）。权重：市场性" + m[1] + "・法规" + m[2] + "・竞争" + m[3] + "・据点" + m[4] + "。" + (m[5] ? "推荐由AI商社专员在分数之外结合商品特性决定。" : ""), "La puntuación es orientativa de 0 a 100 (más alta, mejor). Pesos: potencial de mercado " + m[1] + ", normativa " + m[2] + ", competencia " + m[3] + ", bases " + m[4] + "." + (m[5] ? " Las recomendaciones las decide el agente comercial IA con la puntuación y las características del producto." : "")));
        PF(/^分析済み・未確定（推奨 (.+)）$/, (m) => L3("Analysed, not confirmed (recommended: " + trList(m[1]) + ")", "已分析・未确定（推荐 " + trList(m[1]) + "）", "Analizado, sin confirmar (recomendados: " + trList(m[1]) + ")"));
        PF(/^(\d{4}-\d\d-\d\d \d\d:\d\d(?::\d\d)?)・内蔵ロジック$/, (m) => m[1] + L3(" · built-in logic", "・内置逻辑", " · lógica integrada"));
        PF(/^(\d{4}-\d\d-\d\d \d\d:\d\d(?::\d\d)?)・(.+)が判断$/, (m) => m[1] + L3(" · decided by " + m[2], "・由 " + m[2] + " 判断", " · decidido por " + m[2]));
        PF(/^✅ 確定：(.+)（進出希望国に反映済み）$/, (m) => L3("✅ Confirmed: " + trList(m[1]) + " (reflected in your target countries)", "✅ 已确定：" + trList(m[1]) + "（已反映到目标国家）", "✅ Confirmado: " + trList(m[1]) + " (reflejado en los países objetivo)"));
        PF(/^販売先国を確定しました：(.+?)（(?:進出希望国・)?規制・価格・物流・出荷・AI商社マンに反映）$/, (m) => L3("Target markets confirmed: " + trList(m[1]) + " (reflected in target countries, regulations, pricing, logistics, shipping and the AI Trade Agent)", "已确定销售目标国：" + trList(m[1]) + "（已反映到目标国家・法规・价格・物流・出货・AI商社专员）", "Países de venta confirmados: " + trList(m[1]) + " (reflejado en países objetivo, normativa, precios, logística, envíos y el agente comercial IA)"));
        PF(/^確定した(\d+)か国は「進出希望国」になり、$/, (m) => L3("The " + m[1] + " confirmed countries become your “Target countries” and are reflected in ", "已确定的" + m[1] + "个国家将成为“目标国家”，并反映到", "Los " + m[1] + " países confirmados pasan a ser sus «países objetivo» y se reflejan en "));
        PF(/^に反映されます。AI商社マンは、この(\d+)か国を前提に戦略・伴走・アドバイスを行います。$/, (m) => L3(". The AI Trade Agent bases its strategy, support and advice on these " + m[1] + " countries.", "。AI商社专员将以这" + m[1] + "个国家为前提提供战略・陪跑・建议。", ". El agente comercial IA basa su estrategia, acompañamiento y consejos en estos " + m[1] + " países."));
        PF(/^規制（(.+)）$/, (m) => L3("Regulations (" + tr(m[1]) + ")", "法规（" + tr(m[1]) + "）", "Normativa (" + tr(m[1]) + ")"));
        PF(/^市場性（(.+)）$/, (m) => L3("Market potential (" + tr(m[1]) + ")", "市场性（" + tr(m[1]) + "）", "Potencial de mercado (" + tr(m[1]) + ")"));
        PF(/^競合（(.+)）$/, (m) => L3("Competition (" + tr(m[1]) + ")", "竞争（" + tr(m[1]) + "）", "Competencia (" + tr(m[1]) + ")"));
        PF(/^STANDAGE拠点（(.+)）$/, (m) => L3("STANDAGE base (" + tr(m[1]) + ")", "STANDAGE据点（" + tr(m[1]) + "）", "Base de STANDAGE (" + tr(m[1]) + ")"));
        PF(/^(：?)関税 (.+?)／通関 (.+?)／必要書類 (.+)$/, (m) => (m[1] ? (lg() === "zh" ? "：" : ": ") : "") + L3("Duty: " + tbc(m[2]) + " / Customs clearance: " + days(m[3]) + " / Required documents: " + trList(m[4]), "关税 " + tbc(m[2]) + "／通关 " + days(m[3]) + "／所需单证 " + trList(m[4]), "Arancel: " + tbc(m[2]) + " / Despacho: " + days(m[3]) + " / Documentos necesarios: " + trList(m[4])));
        PF(/^規制の詳細調査（AI）→ (.+)の準備 → 現地バイヤーへ提案$/, (m) => L3("Detailed regulation research (AI) → prepare " + trList(m[1]) + " → propose to local buyers", "法规详细调查（AI）→ 准备" + trList(m[1]) + " → 向当地买家提案", "Investigación detallada de la normativa (IA) → preparar " + trList(m[1]) + " → propuesta a compradores locales"));
        const seg = (s) => {
            let m;
            if ((m = s.match(/^STANDAGE拠点は開設予定（(.+)・([^・]+)）$/)))
                return L3("STANDAGE base planned (" + tr(m[1]) + ", " + fy(m[2]) + ")", "STANDAGE据点计划开设（" + tr(m[1]) + "・" + fy(m[2]) + "）", "Base de STANDAGE prevista (" + tr(m[1]) + ", " + fy(m[2]) + ")");
            if ((m = s.match(/^近隣の拠点（(.+?)）は開設予定（(.+?)）。開設までは本社が対応$/)))
                return L3("Nearby base (" + tr(m[1]) + ") planned (" + fy(m[2]) + "); head office supports until it opens", "邻近据点（" + tr(m[1]) + "）计划开设（" + fy(m[2]) + "），开设前由总部对应", "Base cercana (" + tr(m[1]) + ") prevista (" + fy(m[2]) + "); la sede atiende hasta su apertura");
            if ((m = s.match(/^近隣の拠点（(.+?)）が担当$/)))
                return L3("Covered by the nearby base (" + tr(m[1]) + ")", "由邻近据点（" + tr(m[1]) + "）负责", "Atiende la base cercana (" + tr(m[1]) + ")");
            if ((m = s.match(/^STANDAGE拠点あり（(.+?)(?:・メンバー(\d+)名)?）$/)))
                return L3("STANDAGE base available (" + tr(m[1]) + (m[2] ? ", " + m[2] + " members" : "") + ")", "有STANDAGE据点（" + tr(m[1]) + (m[2] ? "・成员" + m[2] + "名" : "") + "）", "Hay base de STANDAGE (" + tr(m[1]) + (m[2] ? ", " + m[2] + " miembros" : "") + ")");
            if ((m = s.match(/^関税 要確認（別の品目の目安 ([\d.]+%)(・EPA)?）(?:・通関(.+))?$/)))
                return L3("Duty to be confirmed (guide for another item: " + m[1] + (m[2] ? ", EPA" : "") + ")" + (m[3] ? "; clearance " + days(m[3]) : ""), "关税需确认（其他品目的参考值 " + m[1] + (m[2] ? "・EPA" : "") + "）" + (m[3] ? "・通关" + days(m[3]) : ""), "Arancel por confirmar (orientativo de otro producto: " + m[1] + (m[2] ? ", EPA" : "") + ")" + (m[3] ? "; despacho " + days(m[3]) : ""));
            if ((m = s.match(/^関税 ?([^・／]+?)(?:・通関(.+))?$/)) && /%|要確認|無税|免税/.test(m[1]))
                return L3("Duty " + tbc(m[1]) + (m[2] ? "; clearance " + days(m[2]) : ""), "关税 " + tbc(m[1]) + (m[2] ? "・通关" + days(m[2]) : ""), "Arancel " + tbc(m[1]) + (m[2] ? "; despacho " + days(m[2]) : ""));
            if ((m = s.match(/^日本からの輸出 (.+?)（シェア(\d+)%(?:・前年比([+-]?\d+)%)?）$/)))
                return L3("Exports from Japan " + tr(m[1]) + " (share " + m[2] + "%" + (m[3] ? ", " + m[3] + "% YoY" : "") + ")", "日本出口 " + tr(m[1]) + "（份额" + m[2] + "%" + (m[3] ? "・同比" + m[3] + "%" : "") + "）", "Exportaciones de Japón " + tr(m[1]) + " (cuota " + m[2] + "%" + (m[3] ? ", " + m[3] + "% interanual" : "") + ")");
            if ((m = s.match(/^日本勢の競合が多い市場（シェア(\d+)%）$/)))
                return L3("Market with many Japanese competitors (share " + m[1] + "%)", "日本同行竞争较多的市场（份额" + m[1] + "%）", "Mercado con muchos competidores japoneses (cuota " + m[1] + "%)");
            if ((m = s.match(/^米国の追加関税（日本からの輸入品は合計12\.5%が目安・(一部の品目は扱いが違います|茶・コーヒー・香辛料などは対象外の可能性)・(\d{4})年(\d+)月時点・要確認）$/))) {
                const a = m[1].charAt(0) === "一";
                const mon = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][+m[3] - 1] || m[3];
                const mes = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][+m[3] - 1] || m[3];
                return L3("US additional tariff (imports from Japan: about 12.5% in total as a guide; " + (a ? "some items are treated differently" : "tea, coffee, spices, etc. may be exempt") + "; as of " + mon + " " + m[2] + "; needs checking)", "美国附加关税（自日本进口的商品合计约12.5%为参考・" + (a ? "部分品目的处理不同" : "茶・咖啡・香辛料等可能不在对象内") + "・截至" + m[2] + "年" + m[3] + "月・需确认）", "Arancel adicional de EE. UU. (importaciones de Japón: alrededor del 12,5% en total, orientativo; " + (a ? "algunos productos se tratan de otro modo" : "té, café, especias, etc. podrían quedar excluidos") + "; a " + mes + " de " + m[2] + "; por verificar)");
            }
            return null;
        };
        let busy = 0;
        PF(/^[\s\S]*(?:拠点|関税|日本からの輸出|日本勢の競合|米国の追加関税)[\s\S]*$/, (m) => {
            if (busy)
                return null;
            const src = String(m[0]);
            if (src.length > 600)
                return null;
            const parts = src.split("／");
            let hit = 0;
            busy = 1;
            try {
                const out = parts.map((p) => { const t = seg(p.trim()); if (t != null) {
                    hit++;
                    return t;
                } if (!hasJ(p))
                    return p; const t2 = tr(p); if (t2 !== p && parts.length > 1)
                    hit++; return t2; });
                return hit ? out.join(lg() === "zh" ? "／" : " / ") : null;
            }
            catch (e) {
                return null;
            }
            finally {
                busy = 0;
            }
        });
        PF(/^残り (\d+)項目（(.+?)( など)?）$/, (m) => L3(m[1] + (m[1] === "1" ? " item left (" : " items left (") + trList(m[2]) + (m[3] ? ", etc." : "") + ")", "还剩 " + m[1] + " 项（" + trList(m[2]) + (m[3] ? " 等" : "") + "）", (m[1] === "1" ? "Falta 1 dato (" : "Faltan " + m[1] + " datos (") + trList(m[2]) + (m[3] ? ", etc." : "") + ")"));
        PF(/^(.+?) など (\d+)項目$/, (m) => L3(trList(m[1]) + " and others: " + m[2] + " items", trList(m[1]) + " 等 " + m[2] + " 项", trList(m[1]) + " y otros: " + m[2] + " datos"));
        PF(/^([^ ]*[ぁ-ゖァ-ヺ一-鿿][^ ]*) (needed|pendiente)$/, (m) => known(m[1]) ? tr(m[1]) + " " + m[2] : null);
        PF(/^([\s\S]*)（無ければ「該当なし」）(）?)$/, (m) => hasJ(m[1]) ? null : m[1] + L3(" (if none, enter “N/A”)", "（没有则填“N/A”）", " (si no hay, escriba «N/A»)") + (m[2] || ""));
        PF(/^([\s\S]*) \[(source for another country|fuente de otro país) \((.+?)\); ([^\]]+)\]$/, (m) => known(m[3]) && hasJ(m[3]) ? m[1] + " [" + m[2] + " (" + tr(m[3]) + "); " + m[4] + "]" : null);
        PF(/^([\s\S]*)〔(.+?)的资料，目的国规定需确认〕$/, (m) => known(m[2]) && KANA.test(m[2]) ? m[1] + "〔" + tr(m[2]) + "的资料，目的国规定需确认〕" : null);
        PF(/^前回の資料：(.+)$/, (m) => L3("Previous document: ", "上次的资料：", "Documento anterior: ") + m[1]);
        TR("会社名・商品名で検索", "Search by company or product name", "按公司名・商品名搜索", "Buscar por empresa o producto");
        TN("を登録しました。情報", " registered. Info", "已登记。信息", ": registrado. Información");
        TN("を登録しました。充足度", " registered. Completeness", "已登记。完整度", ": registrado. Completitud");
        TN("規制判定・書類の自動作成・運賃の見積依頼・AIの商談準備、すべてが動く状態です。", "Regulation checks, automatic document creation, freight quote requests and the AI's meeting preparation are all ready to run.", "法规判定・单证自动制作・运费询价・AI的商谈准备，现在全部可以运行。", "La comprobación normativa, la creación automática de documentos, la solicitud de fletes y la preparación de reuniones con IA ya están operativas.");
        TN("残りはSTANDAGEの担当が伺って埋めます。埋まっている範囲では今すぐ動きます。", "Your STANDAGE representative will ask about the rest. Everything already filled in works right away.", "其余部分由 STANDAGE 负责人询问后补全。已填写的范围现在即可运行。", "Su responsable de STANDAGE preguntará por el resto. Lo ya completado funciona desde ahora.");
        TN("見積書（PI）・請求書の", "For the ", "报价单（PI）・发票的", "En el campo ");
        TN("Seller（売り手＝貴社）", "Seller (your company)", "Seller（卖方＝贵公司）", "Seller (vendedor = su empresa)");
        TN("欄に入る", " field of quotes (PI) and invoices, the following is not registered yet: ", "栏中要填的", " de cotizaciones (PI) y facturas aún falta registrar: ");
        TN("英語の住所", "English address", "英文地址", "dirección en inglés");
        TN("英文社名", "English company name", "英文公司名", "nombre de la empresa en inglés");
        TN("英文社名と英語の住所", "English company name and English address", "英文公司名和英文地址", "nombre de la empresa y dirección en inglés");
        TN("が、まだ登録されていません。書類を作る前に入れておくと、そのまま使えます。", ". Enter it before creating documents and it will be used as is.", "尚未登记。在制作单证前填好，就可以直接使用。", ". Introdúzcalo antes de crear los documentos y se usará tal cual.");
        TN("会社名・住所を入れる", "Enter company name and address", "填写公司名称和地址", "Introducir nombre y dirección de la empresa");
        PN(/^これで全項目が揃いました。(情報|充足度) (.+?)。$/, (m) => { const i = m[1] === "情報"; return L3("All items are now complete. " + (i ? "Info " : "Completeness ") + m[2] + ".", "至此所有项目已齐全。" + (i ? "信息 " : "完整度 ") + m[2] + "。", "Ya están todos los datos. " + (i ? "Información " : "Completitud ") + m[2] + "."); });
        PN(/^ヒアリングは以上です。(情報|充足度) (.+?)。$/, (m) => { const i = m[1] === "情報"; return L3("That is all the questions. " + (i ? "Info " : "Completeness ") + m[2] + ".", "询问到此结束。" + (i ? "信息 " : "完整度 ") + m[2] + "。", "Eso es todo. " + (i ? "Información " : "Completitud ") + m[2] + "."); });
        PN(/^残り (\d+)項目・(情報|充足度) (.+)$/, (m) => { const i = m[2] === "情報"; return L3(m[1] + " left · " + (i ? "Info " : "Completeness ") + m[3], "还剩 " + m[1] + " 项・" + (i ? "信息 " : "完整度 ") + m[3], "Faltan " + m[1] + " · " + (i ? "Información " : "Completitud ") + m[3]); });
        TR("選択中の輸出先（仕向け国）", "Selected destinations (countries)", "已选的出口目的地（目的国）", "Destinos seleccionados (países)");
        TR("進出希望国（まだ販売先国は確定していません）", "Target countries (target markets not confirmed yet)", "目标国家（尚未确定销售目标国）", "Países objetivo (los países de venta aún no están confirmados)");
        PF(/^保存 (\d+)件$/, (m) => L3(m[1] + " saved", "已保存 " + m[1] + " 件", m[1] + (m[1] === "1" ? " guardado" : " guardados")));
        TR("作ったあと", "After creating", "制作之后", "Después de crear");
        TR("完成した営業資料", "Completed sales deck", "已完成的销售资料", "Material de ventas terminado");
        TR("保存した資料から", "From your saved decks", "来自已保存的资料", "De sus materiales guardados");
        TR("AI生成・要確認", "AI-generated · needs review", "AI生成・需确认", "Generado por IA · por revisar");
        TR("開く（見本・PowerPoint・PDF）", "Open (preview · PowerPoint · PDF)", "打开（预览・PowerPoint・PDF）", "Abrir (vista previa · PowerPoint · PDF)");
        TR("営業資料が完成しました！", "Your sales deck is ready!", "销售资料已完成！", "¡El material de ventas está listo!");
        TR("バイヤーに送る前に内容を確認しましょう。", "Review the content before sending it to buyers.", "发给买家前，请先确认内容。", "Revise el contenido antes de enviarlo a los compradores.");
        TR("連絡先：登録のメールアドレス・URL だけ（仮のドメインなし）", "Contact: only the registered email address and URL (no placeholder domains)", "联系方式：仅使用已登记的邮箱地址・URL（无临时域名）", "Contacto: solo el correo y la URL registrados (sin dominios provisionales)");
        PF(/^(.+?)：(\d+)社（(\d+\/\d+ \d+:\d+) 作成）$/, (m) => L3(trList(m[1]) + ": " + m[2] + (m[2] === "1" ? " company" : " companies") + " (created " + m[3] + ")", trList(m[1]) + "：" + m[2] + "家（" + m[3] + " 创建）", trList(m[1]) + ": " + m[2] + (m[2] === "1" ? " empresa" : " empresas") + " (creada el " + m[3] + ")"));
        PF(/^選んだ(\d+)社を1件ずつ確かめて送る$/, (m) => L3("Review and send to the " + m[1] + " selected, one by one", "逐一确认并发送给已选的" + m[1] + "家", "Revisar y enviar una a una a las " + m[1] + " seleccionadas"));
        PF(/^(\d+)社を自社のバイヤーに入れました（商談・バイヤーの一覧に出ます）$/, (m) => L3("Added " + m[1] + (m[1] === "1" ? " company" : " companies") + " to your buyers (shown in the Deals & buyers list)", "已将" + m[1] + "家加入自有买家（显示在“商谈・买家”列表中）", "Se " + (m[1] === "1" ? "añadió 1 empresa" : "añadieron " + m[1] + " empresas") + " a sus compradores (aparecen en la lista de Negociaciones y compradores)"));
        PF(/^(\d+)社の文面を「確認・承認」に入れました。1件ずつ確かめて送ってください$/, (m) => L3("The messages for " + m[1] + (m[1] === "1" ? " company are" : " companies are") + " now in “Review & approve”. Check and send them one by one", "已将" + m[1] + "家的文稿放入“确认・审批”。请逐一确认后发送", "Los mensajes para " + m[1] + (m[1] === "1" ? " empresa" : " empresas") + " están en «Revisar y aprobar». Revíselos y envíelos uno a uno"));
        TN("公開情報（見本）", "Public information (sample)", "公开信息（示例）", "Información pública (muestra)");
        TN("見本（架空）の会社です", "A sample (fictional) company", "示例（虚构）公司", "Empresa de muestra (ficticia)");
        PN(/^(「?)見本の例：(.+?)で、日本の(.+?)を扱う想定の会社(」?)$/, (m) => { const q = !!m[1]; const b = tr(m[2]), c = low(tr(m[3])); const t = L3("Sample example: a company in “" + b + "” assumed to handle Japanese " + c, "示例：属于“" + b + "”、设想经营日本" + c + "的公司", "Ejemplo de muestra: empresa del tipo «" + b + "» que se supone que trabaja con " + c + " de Japón"); return q ? L3("“" + t + "”", "「" + t + "」", "«" + t + "»") : t; });
        PN(/^\[見本\] ([\x20-\x7e]+)$/, (m) => smp(m[0]));
        PN(/^([\s\S]*?)\[見本\] ?([\s\S]*)$/, (m) => { if (hasJ(m[1]) || hasJ(m[2]))
            return null; const a = lg() !== "zh" && /^：/.test(m[1]) ? ": " + m[1].slice(1) : m[1]; return a + L3("[Sample] ", "[示例] ", "[Muestra] ") + m[2]; });
        PF(/^([\x20-\x7e]+)（見本）$/, (m) => smp(m[0]));
        PF(/^返信待ち（あと(\d+)日でフォロー(\d+)）$/, (m) => L3("Awaiting reply (follow-up " + m[2] + " in " + m[1] + (m[1] === "1" ? " day)" : " days)"), "等待回复（" + m[1] + "天后跟进" + m[2] + "）", "Esperando respuesta (seguimiento " + m[2] + " en " + m[1] + (m[1] === "1" ? " día)" : " días)")));
        TR("こちらからの送信のみ（返信待ち）", "Only sent by you so far (awaiting reply)", "仅我方已发送（等待回复）", "Solo enviados por usted (esperando respuesta)");
        PF(/^商談の記録 (\d\d-\d\d \d\d:\d\d)$/, (m) => L3("Meeting record ", "商谈记录 ", "Registro de reunión ") + m[1]);
        PF(/^([^（【\n]{1,14}[：:] ?)?商談の記録（(\d{4}-\d\d-\d\d)） (【商談の記録（[\s\S]*)$/, (m) => (m[1] ? (known(m[1].replace(/[：:] ?$/, "")) ? tr(m[1].replace(/[：:] ?$/, "")) + (lg() === "zh" ? "：" : ": ") : m[1]) : "") + L3("Meeting record (" + m[2] + ")", "商谈记录（" + m[2] + "）", "Registro de reunión (" + m[2] + ")") + " " + tr(m[3]));
        PF(/^([ァ-ヺー一-鿿A-Za-z .]{1,24})の(.{1,40})$/, (m) => { const d = DI[lg()] || {}; const loc = !KANA.test(m[1]) && d[m[1]] == null; const c = loc ? m[1] : d[m[1]]; const b = d[m[2]]; if (typeof c !== "string" || typeof b !== "string" || !c || !b || (!loc && !/^[A-Z]/.test(String(DI.en[m[1]] || ""))))
            return null; return L3(b + " in " + (c === "United States" ? "the United States" : c), c + "的" + b, b + " en " + c); });
        PF(/^(.+?) に、(.+?)（(.+?)）を送ります$/, (m) => L3("Send the " + low(tr(m[2])) + " (" + tr(m[3]) + ") to " + smp(m[1]), "向 " + smp(m[1]) + " 发送" + tr(m[2]) + "（" + tr(m[3]) + "）", "Enviar " + low(tr(m[2])) + " (" + tr(m[3]) + ") a " + smp(m[1])));
        PF(/^見込み ([A-Z])（(\d+)点）$/, (m) => L3("Likelihood " + m[1] + " (" + m[2] + " pts)", "可能性 " + m[1] + "（" + m[2] + "分）", "Probabilidad " + m[1] + " (" + m[2] + " pts)"));
        TR("送る前に、元に無いアドレス・番号が無いかを確かめます。", "Before sending, the message is checked for addresses or numbers that are not in the source.", "发送前，会检查是否含有原始资料中没有的地址・号码。", "Antes de enviar, se comprueba que no haya direcciones ni números que no estén en el original.");
        PF(/^(：?)同じ会社（ドメイン）に (\S+) に送っています（(.*)）$/, (m) => (m[1] ? (lg() === "zh" ? "：" : ": ") : "") + L3("already sent to the same company (domain) on " + m[2] + " (" + smp(m[3]) + ")", "已于 " + m[2] + " 发送给同一家公司（域名）（" + smp(m[3]) + "）", "ya se envió a la misma empresa (dominio) el " + m[2] + " (" + smp(m[3]) + ")"));
        TN("「見本の文面です（AIエンジンにつなぐと、相手と一次情報に合わせて書き分けます）。初回に強み・価格の目安・MOQ・サンプルの提案を入れ、返信しやすい質問で締めています。」", "“This is a sample message (once an AI engine is connected, it is tailored to the buyer and to primary sources). The first email includes your strengths, a price guide, the MOQ and a sample offer, and closes with an easy-to-answer question.”", "「这是示例文稿（连接AI引擎后，会根据对方和一手信息分别撰写）。首封邮件包含优势・价格参考・MOQ・样品提案，并以容易回复的提问结尾。」", "«Es un mensaje de muestra (al conectar un motor de IA se adapta al comprador y a las fuentes primarias). El primer correo incluye sus puntos fuertes, un precio orientativo, el MOQ y una oferta de muestras, y termina con una pregunta fácil de responder.»");
        PF(/^AI の案の確認 (\d+)件（いちばん古いもの (.+)）$/, (m) => L3("AI proposals to review: " + m[1] + " (oldest: " + low(tr(m[2])) + ")", "待确认的 AI 方案 " + m[1] + " 件（最早的：" + tr(m[2]) + "）", "Propuestas de la IA por revisar: " + m[1] + " (la más antigua: " + low(tr(m[2])) + ")"));
        TR("記録しました。", "Recorded.", "已记录。", "Registrado.");
        TR("ダッシュボード・脈あり度・AIの回答に反映済みです。", "Reflected in the dashboard, the lead score and the AI's answers.", "已反映到仪表盘・线索热度・AI的回答中。", "Reflejado en el panel, la puntuación de interés y las respuestas de la IA.");
        TR("AI商社マンから", "From the AI Trade Agent", "来自AI商社专员", "Del agente comercial IA");
        TR("希望価格が入ると、値付けと値引き余地の学習に使えます（次回でOK）", "Once a target price is entered, it is used to learn pricing and discount room (next time is fine)", "填入期望价格后，可用于学习定价和让价空间（下次再填也可以）", "Si indica el precio deseado, se usa para aprender sobre precios y margen de descuento (puede ser la próxima vez)");
        TR("数量が分かると「その数量ならいくら」をAIが即答できるようになります", "With the quantity, the AI can answer “how much for that quantity?” right away", "知道数量后，AI就能立即回答“这个数量是多少钱”", "Con la cantidad, la IA puede responder al instante «¿cuánto cuesta esa cantidad?»");
        TR("サンプル到着の頃合いで、使用感と規制面（表示・成分）の確認を", "Around when the sample arrives, check how it was received and the regulatory side (labelling, ingredients)", "在样品到达前后，请确认使用感受和法规方面（标签・成分）", "Cuando llegue la muestra, confirme la experiencia de uso y la parte normativa (etiquetado, ingredientes)");
        TR("商談の記録から作った案件（まだ送っていません）", "Case created from a meeting record (nothing sent yet)", "根据商谈记录创建的案件（尚未发送）", "Caso creado a partir de un registro de reunión (aún no se ha enviado nada)");
        TR("商談の記録から作った案件です（相手にはまだ送っていません）", "This case was created from a meeting record (nothing has been sent to the buyer yet)", "这是根据商谈记录创建的案件（尚未发送给对方）", "Este caso se creó a partir de un registro de reunión (aún no se ha enviado nada al comprador)");
        TR("相手の返事を待つ", "Wait for the buyer's reply", "等待对方回复", "Esperar la respuesta del comprador");
        TR("最初の連絡を送る", "Send the first message", "发送首次联系", "Enviar el primer mensaje");
        TR("この案件のタスクはありません", "No tasks for this case", "此案件没有任务", "No hay tareas para este caso");
        PF(/^(.+?) 送信済み$/, (m) => known(m[1]) ? L3("Sent " + low(tr(m[1])), tr(m[1]) + " 已发送", "Enviado " + low(tr(m[1]))) : null);
        PF(/^商談の記録（(\d{4}-\d\d-\d\d)）$/, (m) => L3("Meeting record (" + m[1] + ")", "商谈记录（" + m[1] + "）", "Registro de reunión (" + m[1] + ")"));
        PF(/^商談の記録（(\d{4}-\d\d-\d\d)）の状況「(.+)」$/, (m) => L3("Status “" + tr(m[2]) + "” in the meeting record (" + m[1] + ")", "商谈记录（" + m[1] + "）的状态“" + tr(m[2]) + "”", "Estado «" + tr(m[2]) + "» en el registro de reunión (" + m[1] + ")"));
        PF(/^(期限 \S+?(?:（.+?）)?|期限なし)・商談の記録の「次の行動」（相手にはまだ送っていません）$/, (m) => { const d = String(m[1]).match(/^期限 (\S+?)(?:（(.+?)）)?$/); const head = d ? L3("Due " + d[1] + (d[2] ? " (" + low(tr(d[2])) + ")" : ""), "期限 " + d[1] + (d[2] ? "（" + tr(d[2]) + "）" : ""), "Vence " + d[1] + (d[2] ? " (" + low(tr(d[2])) + ")" : "")) : tr("期限なし"); return head + dot() + L3("“next action” from the meeting record (not sent to the buyer yet)", "商谈记录中的“下一步行动”（尚未发送给对方）", "«próxima acción» del registro de reunión (aún no enviada al comprador)"); });
        PF(/^(.*?) · ID (\S+)( · .+)?$/, (m) => hasJ(m[1]) && known(m[1]) ? tr(m[1]) + " · ID " + m[2] + (m[3] || "") : null);
        PF(/^(.+?)・(.+?)・ID (\S+?)(?:・商品 (.+))?$/, (m) => tr(m[1]) + dot() + tr(m[2]) + dot() + "ID " + m[3] + (m[4] ? dot() + L3("Product: ", "商品 ", "Producto: ") + prod(m[4]) : ""));
        PF(/^(.+)の規制はまだ調べていません$/, (m) => L3("Regulations for " + tr(m[1]) + " have not been checked yet", "尚未调查" + tr(m[1]) + "的法规", "Aún no se han revisado las regulaciones de " + tr(m[1])));
        PF(/^(\d{4}-\d\d-\d\d)・([^・\d][^・]*)$/, (m) => known(m[2]) ? m[1] + dot() + tr(m[2]) : null);
        PF(/^AIバイヤー開拓：(.+?) にフォロー(\d+)（返信が無ければ）$/, (m) => L3("AI Buyer Prospecting: follow-up " + m[2] + " to " + m[1] + " (if there is no reply)", "AI买家开拓：向 " + m[1] + " 跟进" + m[2] + "（如无回复）", "Prospección IA: seguimiento " + m[2] + " a " + m[1] + " (si no hay respuesta)"));
        PF(/^AIバイヤー開拓：([^ぁ-ゖァ-ヺ一-鿿]*…)$/, (m) => tr("AIバイヤー開拓") + (lg() === "zh" ? "：" : ": ") + m[1]);
        PF(/^タスク：(.+)$/, (m) => known(m[1]) ? L3("Task: ", "任务：", "Tarea: ") + tr(m[1]) : null);
        const RLAB = { "品目": ["Item", "品目", "Artículo"], "価格": ["Price", "价格", "Precio"], "数量": ["Quantity", "数量", "Cantidad"], "条件": ["Terms", "条件", "Condiciones"], "相手の求める仕様": ["Specs requested by the buyer", "对方要求的规格", "Especificaciones que pide el comprador"], "状況": ["Status", "状态", "Estado"], "反応": ["Response", "反应", "Respuesta"], "見送りの理由": ["Reason for passing", "搁置的原因", "Motivo de descarte"], "メモ": ["Note", "备注", "Nota"] };
        const RNOTE = ["※ 商談の記録から作った案件です。この文は相手に送っていません（記録のみ）。", "* This case was created from a meeting record. This text has not been sent to the buyer (record only).", "※ 这是根据商谈记录创建的案件。此文未发送给对方（仅作记录）。", "* Este caso se creó a partir de un registro de reunión. Este texto no se ha enviado al comprador (solo registro)."];
        TR(RNOTE[0], RNOTE[1], RNOTE[2], RNOTE[3]);
        PF(/^【商談の記録（(\d{4}-\d\d-\d\d)(?:・([^）\n]+))?）】([\s\S]*)$/, (m) => {
            const li = lg() === "zh" ? 1 : lg() === "es" ? 2 : 0, col = li === 1 ? "：" : ": ";
            const head = L3("[Meeting record (" + m[1] + (m[2] ? " · " + tr(m[2]) : "") + ")]", "【商谈记录（" + m[1] + (m[2] ? "・" + tr(m[2]) : "") + "）】", "[Registro de reunión (" + m[1] + (m[2] ? " · " + tr(m[2]) : "") + ")]");
            let body = String(m[3]);
            body = body.replace(RNOTE[0], () => RNOTE[li + 1]);
            body = body.replace(/([※*] ?)([^※*]{2,})$/, (x, a, r) => { const r0 = r.replace(/…$/, ""); return r0.length >= 2 && RNOTE[0].slice(2).lastIndexOf(r0, 0) === 0 ? RNOTE[li + 1] + (r0.length < RNOTE[0].length - 2 ? "…" : "") : x; });
            const STS = ["商談中", "コンタクト中", "初回接触", "サンプル発送", "見積提示", "契約交渉", "受注", "取引中", "失注", "保留"];
            const cut = (v) => { const v0 = v.replace(/…$/, ""); if (known(v))
                return tr(v); const c = v0 ? STS.find((x) => x.lastIndexOf(v0, 0) === 0 && known(x)) : null; return c ? tr(c) + "…" : v; };
            body = body.replace(/(^|\s)(状況|反応)：(\S*)/g, (x, sp, lab, v) => sp + RLAB[lab][li] + col + cut(v));
            body = body.replace(/(^|\s)品目：([^\n]*?)(?=\s(?:価格|数量|条件|相手の求める仕様|Status|状态|Estado|Response|反应|Respuesta|見送りの理由|メモ)[：:]|\s[※*]|\n|$)/, (x, sp, v) => sp + RLAB["品目"][li] + col + prod(v.trim()));
            body = body.replace(/(^|\s)(価格|数量|条件|相手の求める仕様|見送りの理由|メモ)：/g, (x, sp, lab) => sp + RLAB[lab][li] + col);
            return head + body;
        });
        TE("Drop your product documents here (or click to choose files).", "请把商品资料拖放到这里（也可以点击选择文件）。", "Suelte aquí los documentos del producto (o haga clic para elegir archivos).");
        TE("Undo", "不填入并恢复原状", "Deshacer");
        TE("Send the first message", "发送首次联系", "Enviar el primer mensaje");
        TE("Tell me your export goal — I'll map the years, steps, costs and expected sales", "请告诉我您想实现的贸易目标。我会给出达成所需的年数・路径・费用和可期待的销售额", "Cuénteme su objetivo de exportación: le indicaré los años, los pasos, los costes y las ventas previstas");
        TE("Same questions STANDAGE asks at kickoff (about 5 minutes)", "与 STANDAGE 在启动会上最先询问的项目相同（约5分钟・之后可以修改）", "Son las mismas preguntas que STANDAGE hace al inicio (unos 5 minutos; se pueden cambiar después)");
        TE("Set the goal", "填写目标", "Indicar el objetivo");
        TE("Edit the goal", "修改目标", "Editar el objetivo");
        TE("Review the roadmap", "重新审视路径", "Revisar la hoja de ruta");
        TE("See it in the roadmap", "反映到路径中查看", "Verlo en la hoja de ruta");
        TE("Contact more buyers", "增加与买家的联系", "Contactar con más compradores");
        TE("Ask the AI advisor", "咨询AI商社专员", "Consultar al agente comercial IA");
        TE("We assume about 15% of buyers stop each year; repeat orders and new markets carry growth", "我们按每年约有15%的交易买家停止来估算。第二次订单以及第二家・第二个国家将成为销售的支柱", "Suponemos que cada año se pierde alrededor del 15% de los compradores; los pedidos repetidos y los nuevos mercados sostienen el crecimiento");
        TE("Quarterly review: check the goal and roadmap", "到了每3个月回顾的时候。请确认目标与路径", "Revisión trimestral: compruebe el objetivo y la hoja de ruta");
        let REV = null;
        const catL = (en) => { try {
            if (!REV) {
                REV = {};
                Object.keys(DI.en).forEach((k) => { const v = DI.en[k]; if (typeof v === "string" && v.length < 40 && REV[v] == null && DI.zh[k] && DI.es[k])
                    REV[v] = k; });
            }
            const k = REV[String(en).trim()];
            return k ? DI[lg()][k] : en;
        }
        catch (e) {
            return en;
        } };
        const z = (zh, es) => lg() === "zh" ? zh : lg() === "es" ? es : null;
        PE(/^I'll use STANDAGE records from (\d+) similar projects \((.+)\)$/, (m) => z("将根据类似商品（" + catL(m[2]) + "）的 STANDAGE " + m[1] + " 个案件记录，给出路径的参考", "Usaré los registros de STANDAGE de " + m[1] + " proyectos similares (" + catL(m[2]) + ") para estimar la ruta"));
        PE(/^You've reached "(.+?)"\. ([\s\S]*)$/, (m) => z("已进展到“" + m[1] + "”。" + tr(m[2]), "Ha llegado a «" + m[1] + "». " + tr(m[2])));
        PE(/^Now: "(.+?)"\. ([\s\S]*)$/, (m) => z("目前“" + m[1] + "”。" + tr(m[2]), "Ahora: «" + m[1] + "». " + tr(m[2])));
        PE(/^STANDAGE records \((.+)\): first meeting after (\S+) months \(median\); first deal after about (\S+) buyers$/, (m) => z("根据 STANDAGE 的记录，" + catL(m[1]) + "从签约到首次商谈的中位数为 " + m[2] + " 个月，首笔交易前接触的买家中位数为 " + m[3] + " 家", "Registros de STANDAGE (" + catL(m[1]) + "): primera reunión a los " + m[2] + " meses (mediana); primera operación tras unos " + m[3] + " compradores"));
        PE(/^STANDAGE records: (\S+)% of buyers met became customers \((.+)\); face-to-face meetings led most deals$/, (m) => z("根据 STANDAGE 的记录，见面满6个月以上的买家中，进展到交易的占 " + m[1] + "%（" + catL(m[2]) + "）。促成交易的商谈方式以面对面最多", "Registros de STANDAGE: el " + m[1] + "% de los compradores contactados llegó a operar (" + catL(m[2]) + "); las reuniones presenciales generaron la mayoría de las operaciones"));
        PE(/^You've been at "(.+?)" for (\d+) days — let's unblock it$/, (m) => z("停留在“" + m[1] + "”已 " + m[2] + " 天。一起排除停滞的原因吧", "Lleva " + m[2] + " días en «" + m[1] + "»: desbloqueémoslo"));
        PE(/^Typical: (\S+) days\. Common blockers here: (missing information|too few contacts or no replies|price, terms or incumbent suppliers)$/, (m) => { const i = ["missing information", "too few contacts or no replies", "price, terms or incumbent suppliers"].indexOf(m[2]); return z("参考值为 " + m[1] + " 天。此阶段常见的停滞原因：" + ["信息不足", "联系数量少・没有回复", "价格・条件谈不拢・已有供应商"][i], "Lo habitual: " + m[1] + " días. Bloqueos frecuentes aquí: " + ["falta de información", "pocos contactos o sin respuesta", "precio, condiciones o proveedores actuales"][i]); });
        PE(/^The plan expected "(.+?)" by now — let's adjust$/, (m) => z("按路径现在应已到“" + m[1] + "”。重新选择对策吧", "El plan preveía «" + m[1] + "» a estas alturas: ajustémoslo"));
        PE(/^Now: (.+)\. Options: more outreach, add a trade show, or move the target year$/, (m) => z("目前：" + m[1] + "。可选对策：增加联系数量・增加展会面谈・推后目标年份", "Ahora: " + m[1] + ". Opciones: más contactos, añadir una feria o retrasar el año objetivo"));
        PE(/^New verified information this week for (.+)$/, (m) => z("本周有关于 " + catL(m[1]) + " 的新确认信息", "Esta semana hay información verificada nueva sobre " + catL(m[1])));
        PE(/^Now: (.+)\. Logged meetings (\d+), deals (\d+)$/, (m) => z("目前：" + m[1] + "。自家商谈记录 " + m[2] + " 条・交易 " + m[3] + " 家", "Ahora: " + m[1] + ". Reuniones registradas: " + m[2] + "; operaciones: " + m[3]));
        PN(/^If you do not want the table contents \((.+)\) applied:$/, (m) => { const n = String(m[1]).split(", ").map((x) => tr(x)).join(sepL()); return L3("If you do not want the table contents (" + n + ") applied:", "如果不想填入从表格读取的内容（" + n + "）：", "Si no quiere aplicar el contenido de las tablas (" + n + "):"); });
        TE("The address in your document is “", "资料中的“所在地”是“", "La dirección del documento es «");
        PE(/^”\. If the product is made there too, press “(.+)” below\. Otherwise, type where it is made\.$/, (m) => z("”。如果生产地点也相同，请点击下方的“" + m[1] + "”。不同的话，请填写生产地。", "». Si el producto también se fabrica allí, pulse «" + m[1] + "» abajo. Si no, escriba dónde se fabrica."));
        TE("The information is now", "目前的信息为", "La información está ahora en");
        TE(". I will only ask about the", "。只会依次询问资料中未能读取的", ". Solo preguntaré por");
        TE("that could not be read from the document.", "。", "que no se pudieron leer del documento.");
        PE(/^(\d+) item\(s\)$/, (m) => z(m[1] + " 项", m[1] + " dato(s)"));
        TEM("Registered", "已登记", "Registrado");
        TEM("Read", "已读取", "Se leyó");
        TEM("and added it to the product information (", "，并已填入商品信息（", "y se añadió a la información del producto (");
        PE(/^(\d+) fields$/, (m) => z(m[1] + " 项", m[1] + " campos"));
        TE("Registration items filled:", "已填写的登记项目：", "Datos de registro completados:");
        TE("You can check and correct what was read on the Product information screen.", "读取的内容可以在“商品信息”中确认并修改。", "Puede comprobar y corregir lo leído en la pantalla de información del producto.");
        TE("Correct this answer", "修改这个回答", "Corregir esta respuesta");
        TE("Buyers who replied and are waiting for you", "对方已回复、尚未回复的对象", "Compradores que respondieron y esperan su respuesta");
        TE("Need your reply", "需要回复", "Requieren respuesta");
        TE("In which country was it manufactured?", "是在哪个国家生产的？", "¿En qué país se fabricó?");
        PE(/^\. Info (\d+\/\d+)$/, (m) => z("。信息 " + m[1], ". Información " + m[1]));
        PATS.slice().reverse().forEach((p) => I18N.pat.unshift(p));
        const mine = (k, l) => {
            const t = MINE[l][k];
            if (t != null)
                return t;
            for (const p of PATS) {
                if (!p.no || !p[l])
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
        const fix = () => {
            try {
                const l = lg();
                if (l === "ja" || !MINE[l])
                    return;
                try {
                    const lt = document.querySelectorAll(".k-clrow .k-lt.v90lt, .k-clrow .c-nx");
                    for (let i = 0; i < lt.length && i < 300; i++) {
                        const e = lt[i];
                        if (JP.test(e.textContent || "") && typeof i18nApply === "function")
                            i18nApply(e);
                    }
                }
                catch (e) { }
                const els = document.querySelectorAll("[data-noi18n], #fchat .m.a .bb");
                for (let i = 0; i < els.length && i < 1500; i++) {
                    const el = els[i];
                    if (el.closest("#uxpq,.acode,.msgtr,.m.u"))
                        continue;
                    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
                    const L = [];
                    while (w.nextNode() && L.length < 400)
                        L.push(w.currentNode);
                    for (const n of L) {
                        const p = n.parentNode;
                        if (!p || /^(SCRIPT|STYLE|TEXTAREA|CODE|PRE)$/.test(p.nodeName))
                            continue;
                        let src = String(n.nodeValue || "");
                        if (I18N.orig.has(n)) {
                            const o = String(I18N.orig.get(n) || "");
                            if (src !== o)
                                continue;
                            src = o;
                        }
                        const k = src.trim();
                        if (!k || k.length > 400)
                            continue;
                        if (!(JP.test(k) || (l !== "en" && /[A-Za-z]{2}/.test(k))))
                            continue;
                        const t = mine(k, l);
                        if (t == null || t === k)
                            continue;
                        if (!I18N.orig.has(n))
                            I18N.orig.set(n, src);
                        n.nodeValue = src.replace(k, () => t);
                    }
                }
            }
            catch (e) { }
        };
        let fixT = 0;
        const kick = () => { if (lg() === "ja" || fixT)
            return; fixT = setTimeout(() => { fixT = 0; fix(); }, 160); };
        try {
            const start = () => { try {
                new MutationObserver(kick).observe(document.body, { childList: true, subtree: true, characterData: true });
                kick();
            }
            catch (e) { } };
            if (document.body)
                start();
            else
                document.addEventListener("DOMContentLoaded", start);
        }
        catch (e) { }
        W.v92r7c = { fix, n: PATS.length };
    }
    catch (e) { }
})();
