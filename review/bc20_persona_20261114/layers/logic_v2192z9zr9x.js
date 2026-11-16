(function () {
    const W = window;
    if (W.__v2192r9x)
        return;
    const S = (W.__v2192r9x = { caCut: 0 });
    try {
        const h = document.documentElement;
        const t = (W.performance && performance.now) ? performance.now() : 0;
        S.t = Math.round(t);
        if (t > 0 && t < 14500 && document.getElementById("r9pboot") && !h.classList.contains("rd-ready")) {
            const st = document.createElement("style");
            st.id = "r9xboot";
            st.textContent = "html.r9x-valve:not(.rd-ready) body > *{animation-name:r9xShow}" +
                "html.r9x-valve:not(.rd-ready) body::before{animation-name:r9xHide}" +
                "@keyframes r9xShow{to{opacity:1;pointer-events:auto}}@keyframes r9xHide{to{visibility:hidden;opacity:0}}";
            (document.head || h).appendChild(st);
            h.classList.add("r9x-valve");
            S.valve = S.t;
        }
    }
    catch (e) { }
    try {
        if (typeof ctyAll === "function") {
            const __ca = ctyAll;
            let depth = 0;
            ctyAll = function () {
                if (depth >= 2) {
                    S.caCut++;
                    return [];
                }
                depth++;
                try {
                    return __ca.apply(this, arguments);
                }
                finally {
                    depth--;
                }
            };
        }
    }
    catch (e) { }
    try {
        if (typeof cnorm === "function") {
            const __cn = cnorm;
            cnorm = function (s) {
                const r = __cn.apply(this, arguments);
                try {
                    if (typeof r === "string" && r && r !== String(s == null ? "" : s).trim()) {
                        const r2 = __cn.call(this, r);
                        if (typeof r2 === "string" && r2 && r2 !== r) {
                            S.cnFix = (S.cnFix || 0) + 1;
                            return r2;
                        }
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { }
    try {
        if (typeof v92goalReachHtml === "function") {
            const __rh = v92goalReachHtml;
            const E = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
            v92goalReachHtml = function (pl) {
                let h = __rh.apply(this, arguments);
                try {
                    const l = String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja").slice(0, 2);
                    const SC = pl && pl.SC;
                    if (typeof h === "string" && (l === "zh" || l === "es") && SC && SC.lo && SC.mid && SC.hi) {
                        const f = (x) => (+x.pace || 0).toFixed(1);
                        const h0 = h;
                        if (l === "zh")
                            h = h.replace(/联系节奏 每月 [\d.]+〜[\d.]+ 家：STANDAGE 记录中每月约见的买家数（中位数・前25%）。挑战节奏为其 2\.5 倍（展会＋每月AI买家开拓）/, () => E(`联系节奏（每月约见的买家数・STANDAGE 记录）：保守 每月 ${f(SC.lo)} 家（中位数）・标准 每月 ${f(SC.mid)} 家（前25%）・挑战 每月 ${f(SC.hi)} 家（标准的 2.5 倍：展会＋每月AI买家开拓）。本页面的“标准”为每月 ${f(SC.mid)} 家`));
                        else
                            h = h.replace(/Ritmo de contacto [\d.]+–[\d.]+ al mes: compradores vistos al mes en los registros de STANDAGE \(mediana y 25 % superior\)\. El ritmo exigente es 2,5 veces \(ferias \+ prospección IA mensual\)/, () => E(`Ritmo de contacto (compradores vistos al mes, registros de STANDAGE): conservador ${f(SC.lo)} (mediana), estándar ${f(SC.mid)} (25 % superior), exigente ${f(SC.hi)} (2,5 veces el estándar: ferias + prospección IA mensual). El «estándar» de esta pantalla es ${f(SC.mid)} al mes`));
                        if (h !== h0)
                            S.pace = (S.pace || 0) + 1;
                    }
                }
                catch (e) { }
                return h;
            };
        }
    }
    catch (e) { }
    const lg = () => { try {
        return String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja").slice(0, 2);
    }
    catch (e) {
        return "ja";
    } };
    const L3 = (en, zh, es) => { const l = lg(); return l === "zh" ? zh : l === "es" ? es : en; };
    const dict = () => { try {
        return (I18N.dict && I18N.dict[lg()]) || {};
    }
    catch (e) {
        return {};
    } };
    const KANA = /[ぁ-ゖァ-ヺ]/, JPC = /[ぁ-ゖァ-ヺ一-鿿]/;
    const okTr = (v) => typeof v === "string" && !!v && (lg() === "zh" ? !KANA.test(v) : !JPC.test(v));
    const ctyNm = (c) => { const v = dict()[c]; return okTr(v) ? v : c; };
    const par = (s) => lg() === "zh" ? "（" + s + "）" : " (" + s + ")";
    const UNIT = { "個": ["pcs", "个", "uds."], "本": ["bottles / pcs", "瓶・支", "botellas / piezas"], "袋": ["bags", "袋", "bolsas"], "箱": ["boxes", "盒", "cajas"], "ケース": ["cases", "箱（整箱）", "estuches"],
        "カートン": ["cartons", "纸箱", "cajas de cartón"], "セット": ["sets", "套", "juegos"], "台": ["units", "台", "unidades"], "枚": ["sheets", "张", "hojas"], "パック": ["packs", "包", "paquetes"] };
    const qtyTr = (s) => s.replace(/(\d[\d,.]*)\s*(個|本|袋|箱|ケース|カートン|セット|台|枚|パック)(?![ぁ-ゖァ-ヺ一-鿿])/g, (_a, q, u) => q + (lg() === "zh" ? "" : " ") + L3(UNIT[u][0], UNIT[u][1], UNIT[u][2]));
    const labelTr = (s) => {
        const seg = String(s).split("｜").map((x, i) => {
            if (i === 0)
                return x;
            let y = x.replace(/（([^（）]+)）/g, (a, c) => { const n = ctyNm(c); return n !== c ? par(n) : a; });
            const t = y.trim();
            const n = ctyNm(t);
            if (n !== t)
                y = y.replace(t, n);
            y = qtyTr(y).replace(/＝/g, "=").replace(/×/g, "×");
            if (lg() !== "zh")
                y = y.replace(/・/g, " · ");
            return y;
        });
        return seg.join(lg() === "zh" ? "｜" : " | ");
    };
    const tidyTabs = (root) => {
        root.querySelectorAll('[data-onclick^="shipActivate("][data-r9a]').forEach((b) => {
            try {
                const sig = b.getAttribute("data-r9a") || "";
                if (b.getAttribute("data-r9x") === lg() + "|" + sig)
                    return;
                const tn = Array.from(b.childNodes).find((x) => x.nodeType === 3 && JPC.test(String(x.nodeValue || "")));
                if (tn) {
                    const v = String(tn.nodeValue);
                    const m = v.match(/^(\s*)(.*?)( 📥)?\s*$/);
                    if (m) {
                        const t = labelTr(m[2]);
                        if (t !== m[2])
                            tn.nodeValue = m[1] + t + (m[3] || "");
                    }
                }
                if (b.title && JPC.test(b.title))
                    b.title = labelTr(b.title);
                b.setAttribute("data-r9x", lg() + "|" + sig);
                S.tabs = (S.tabs || 0) + 1;
            }
            catch (e) { }
        });
    };
    const nmList = (s) => {
        const d = dict();
        const P = s.split("・");
        const out = [];
        for (let i = 0; i < P.length;) {
            let hit = -1;
            for (let j = P.length; j > i; j--) {
                const k = P.slice(i, j).join("・");
                if (okTr(d[k])) {
                    out.push(d[k]);
                    hit = j;
                    break;
                }
            }
            if (hit < 0) {
                out.push(P[i]);
                i++;
            }
            else
                i = hit;
        }
        return out.join(lg() === "zh" ? "、" : ", ");
    };
    const swap = (nodes, text) => {
        const sp = document.createElement("span");
        sp.setAttribute("data-noi18n", "1");
        sp.setAttribute("data-r9x", "1");
        sp.textContent = text;
        nodes[0].parentNode.insertBefore(sp, nodes[0]);
        nodes.forEach((n) => { try {
            n.parentNode && n.parentNode.removeChild(n);
        }
        catch (e) { } });
        S.msg = (S.msg || 0) + 1;
    };
    const tidyMsgs = (root) => {
        const scr = (() => { const v = dict()["商品情報を登録"]; return okTr(v) ? v : L3("Register product info", "登记商品信息", "Registrar información del producto"); })();
        root.querySelectorAll("b").forEach((b) => {
            try {
                const tn = b.firstChild;
                const t = String((tn && tn.nodeType === 3 && I18N.orig && I18N.orig.has(tn)) ? I18N.orig.get(tn) : (b.textContent || "")).trim();
                let m = t.match(/^足りないのは(\d+)項目$/);
                if (m && b.childElementCount === 0) {
                    const n = b.nextSibling;
                    const v = n && n.nodeType === 3 ? String(n.nodeValue) : "";
                    const m2 = v.match(/^（([\s\S]+?)( ほか)?）。\s*「商品情報を登録」の画面で、1問ずつ伺います。([\s\S]*)$/);
                    if (!m2)
                        return;
                    const nm = nmList(m2[1].trim()) + (m2[2] ? L3(", etc.", "等", ", etc.") : "");
                    n.nodeValue = m2[3];
                    swap([b], L3(`Missing: ${m[1]} item(s) (${nm}). We'll ask about them one question at a time on the “${scr}” screen.`, `还缺 ${m[1]} 项（${nm}）。将在“${scr}”页面逐一询问。`, `Faltan ${m[1]} campo(s) (${nm}). Se los preguntaremos uno a uno en la pantalla «${scr}».`));
                    return;
                }
                m = t.match(/^(\d+)項目$/);
                if (m && b.childElementCount === 0) {
                    const p = b.previousSibling, n = b.nextSibling;
                    if (p && p.nodeType === 3 && /^\s*あと\s*$/.test(String(p.nodeValue)) && n && n.nodeType === 3 && /^を埋めると、すべての機能が動きます。/.test(String(n.nodeValue))) {
                        n.nodeValue = String(n.nodeValue).replace(/^を埋めると、すべての機能が動きます。/, " ");
                        swap([p, b], L3(`Fill in ${m[1]} more item(s) and every feature will work.`, `再补齐 ${m[1]} 项，所有功能即可使用。`, `Complete ${m[1]} campo(s) más y todas las funciones estarán disponibles.`));
                    }
                    return;
                }
                if (t === "追加ヒアリング" && b.childElementCount === 0) {
                    const p = b.previousSibling, n = b.nextSibling;
                    if (p && p.nodeType === 3 && /🤖 AI エンジンにつながると、AIが資料を読み直して\s*$/.test(String(p.nodeValue)) && n && n.nodeType === 3 && /^\s*も行えます。/.test(String(n.nodeValue))) {
                        const pre = String(p.nodeValue).replace(/🤖 AI エンジンにつながると、AIが資料を読み直して\s*$/, "");
                        const rest = String(n.nodeValue).replace(/^\s*も行えます。/, "");
                        p.nodeValue = pre;
                        n.nodeValue = rest;
                        const sp = document.createElement("span");
                        sp.setAttribute("data-noi18n", "1");
                        sp.setAttribute("data-r9x", "1");
                        sp.textContent = L3("🤖 Once the AI engine is connected, the AI can re-read your file and run an additional interview.", "🤖 连接 AI 引擎后，AI 可重新读取资料并进行追加问答。", "🤖 Con el motor de IA conectado, la IA puede releer su archivo y hacer una entrevista adicional.");
                        b.parentNode.insertBefore(sp, b);
                        b.parentNode.removeChild(b);
                        S.msg = (S.msg || 0) + 1;
                    }
                }
            }
            catch (e) { }
        });
    };
    const tidy = () => {
        try {
            if (lg() === "ja")
                return;
            const st = document.querySelector(".stage") || document.getElementById("well");
            if (!st)
                return;
            tidyTabs(st);
            tidyMsgs(st);
        }
        catch (e) { }
    };
    S.tidy = tidy;
    try {
        const DI = (typeof I18N !== "undefined" && I18N && I18N.dict) || null;
        const T = { "AIと続きを埋める": ["Fill in the rest with AI", "与 AI 一起补齐剩余项目", "Completar el resto con la IA"] };
        if (DI)
            Object.keys(T).forEach((k) => ["en", "zh", "es"].forEach((l, i) => { if (DI[l] && DI[l][k] == null)
                DI[l][k] = T[k][i]; }));
    }
    catch (e) { }
    try {
        if (typeof v90anaX === "function") {
            const __ax = v90anaX;
            const RE9 = /^数え方：消化率 ([\d.]+)%＝完了 (\d+)件÷全部 (\d+)件。右の「期限切れ・開始が遅れている・1週間以内・作業期間中」は、残り (\d+)件を期限で見たもので、未着手・対応中と重なります（足しても合いません）$/;
            v90anaX = function (ja, en) {
                const r = __ax.apply(this, arguments);
                try {
                    const l = lg();
                    if ((l === "zh" || l === "es") && r === en) {
                        const m = String(ja).match(RE9);
                        if (m) {
                            S.ana = (S.ana || 0) + 1;
                            return l === "zh"
                                ? "统计方法：完成率 " + m[1] + "%＝已完成 " + m[2] + " 件÷全部 " + m[3] + " 件。右侧的“已逾期・开始延迟・1周内・作业期间中”是按期限查看剩余 " + m[4] + " 件，与未开始・处理中有重叠（相加不一致）"
                                : "Cómputo: avance " + m[1] + " % = " + m[2] + " hechas ÷ " + m[3] + " en total. «Vencidas / inicio tardío / en una semana / en curso» miran las " + m[4] + " restantes por fecha y se solapan con no iniciadas / en curso";
                        }
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { }
    const GRP_JA = /（([^（）]*(?:（[^（）]*）[^（）]*)*)）/g;
    const cutTr = (orig, cut, tr, l) => {
        const go = [], gc = [];
        String(orig).replace(GRP_JA, (_a, i) => { go.push(i); return _a; });
        String(cut).replace(GRP_JA, (_a, i) => { gc.push(i); return _a; });
        if (!go.length || go.length !== gc.length)
            return null;
        let gi = -1;
        for (let i = 0; i < go.length; i++)
            if (go[i] !== gc[i]) {
                if (gi >= 0)
                    return null;
                gi = i;
            }
        if (gi < 0)
            return null;
        const P = go[gi].split("、"), Q = gc[gi].split("、");
        const keep = Q.map((q) => P.indexOf(q));
        if (keep.some((k) => k < 0))
            return null;
        const sep = l === "zh" ? /，|、/ : /; /;
        const joinS = l === "zh" ? "，" : "; ";
        const re = l === "zh" ? /（((?:[^（）]|（[^（）]*）)*)）/g : /\(((?:[^()]|\([^()]*\))*)\)/g;
        let done = false;
        const out = String(tr).replace(re, (a, inner) => {
            if (done)
                return a;
            const T = inner.split(sep);
            if (T.length !== P.length)
                return a;
            done = true;
            const x = keep.map((k) => T[k]).join(joinS);
            return l === "zh" ? "（" + x + "）" : "(" + x + ")";
        });
        return done && out !== tr ? out : null;
    };
    try {
        if (typeof v85docJudge === "function") {
            const __jd2 = v85docJudge;
            v85docJudge = function () {
                const J = __jd2.apply(this, arguments);
                try {
                    const R = (typeof V85DOC_D !== "undefined" && V85DOC_D && Array.isArray(V85DOC_D.rules)) ? V85DOC_D.rules : [];
                    const DI = (typeof I18N !== "undefined" && I18N && I18N.dict) || null;
                    if (!R.length || !DI)
                        return J;
                    Object.keys((J && J.rows) || {}).forEach((k) => {
                        ((J.rows[k] && J.rows[k].why) || []).forEach((w) => {
                            if (!w || !w.id || !w.c)
                                return;
                            const r = R.find((x) => x && x.id === w.id);
                            if (!r || !r.c || r.c === w.c)
                                return;
                            ["en", "zh", "es"].forEach((l) => {
                                const D = DI[l];
                                if (!D || D[w.c] != null || typeof D[r.c] !== "string")
                                    return;
                                const t = cutTr(r.c, w.c, D[r.c], l);
                                if (t) {
                                    D[w.c] = t;
                                    S.rule = (S.rule || 0) + 1;
                                }
                            });
                        });
                    });
                }
                catch (e) { }
                return J;
            };
        }
    }
    catch (e) { }
    try {
        if (typeof render === "function") {
            const __rn = render;
            render = function () {
                const r = __rn.apply(this, arguments);
                try {
                    if (lg() !== "ja")
                        [90, 450, 1300].forEach((ms) => setTimeout(tidy, ms));
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { }
})();
