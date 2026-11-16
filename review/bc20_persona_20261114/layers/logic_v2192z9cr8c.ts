/* 21.92 r8c：8巡目の直し（多言語：英語・中国語・スペイン語。とくに 21.93 が足した部品の訳）。本体の層（今の版・刷新版の両方に効く）
   xcut-T02・T03・T04・T05・T06・S03、food-T06・daily-T07、indagri-T09、culture-T05、culture-S04・daily-S06 の残り、other-S05。
   前の多言語の層（r7c・r3c）と同じ仕組み：I18N.dict に訳を足す（すでにある訳は変えない）・I18N.pat に文の形を足す（前の層より先に見る）。
   ① 21.93 の部品：商品情報の充足度（入っている N項目・任意 あと N件・全体の項目はそろっています・情報 N/21・表示中）、価格の有効期限の選択肢、
      販売先国の「点数と順位の見方」「未評価」・同点の札、見積書の仕出港・有効期限の注記（注記は 21.93 の関数を包んで、その言語の文を出す）
   ② 21.93 の欄「一部が日本語のまま：N件」と、今の版の知らせ「辞書に無い文言は AI 接続時に翻訳」が両方出る → 21.93 の欄の1つに（知らせを出さない）
   ③ 販売先国：区分「その他」の訳（More → “Other” の区分）。おすすめ理由の文は日本語で持ち（＝言語を替えても食い違わない）、出すときに訳す
   ④ 産地「Nara, Japan」「Osaka, Japón」→ 書類の Origin（都道府県）を読む（ローマ字の都道府県名）
   ⑤ 英文の見積書・請求書の単価「HK$115/本」「A$15/個」→「HK$115.00」「A$15.00」（EUR・US$ と同じ形）
   ⑥ 英語の営業メールの署名：登録の英文の氏名（署名・営業資料の英文の担当者名）があれば使う。無ければ点検で「ローマ字の氏名を入れてください」と知らせる（勝手にローマ字にしない）
   日本語の画面：①②③④の訳は I18N.lang が ja のときは通らない。⑤⑥は日本語の画面でも英文の書類・文面に効く（課題そのもの） */
declare const I18N: any, V85PREF_EN: any, AI18N: any, V92MISC: any, SES: any;
declare let i18nStr: any, v92docPolNote: any, v92docValidNote: any, v92docAirNote: any, v92docE: any, v92docT: any, v92docTen: any,
    v54ctyBuyers: any, ctyWhyLocal: any, v85docPref: any, v54docSyncRows: any, v71obTpl: any, v79obSig: any, v33CkText: any, ai18nRun: any, dk3Fixed: any, cur: any, v84cObItems: any, v71obSt: any;
(function () {
    const W: any = window;
    if (W.__v2192r8c) return;
    W.__v2192r8c = 1;
    const ERR: string[] = [];
    const warn = (k: string, e: any) => { try { ERR.push(k + ": " + String((e && e.message) || e).slice(0, 140)); if (ERR.length > 30) ERR.shift(); } catch (x) { } };
    const lg = () => { try { return String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja"); } catch (e) { return "ja"; } };
    const L3 = (en: string, zh: string, es: string) => lg() === "zh" ? zh : lg() === "es" ? es : en;
    const JP = /[ぁ-ゖァ-ヺ一-鿿々]/, KANA = /[ぁ-ゖァ-ヺ]/;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]);
    const MINE: any = { en: {}, zh: {}, es: {} };
    const PATS: any[] = [];
    const MP: any[] = [];   // 吹き出し・data-noi18n の中だけで当てる文の形（辞書の仕組みには入れない）
    let DI: any = null;
    const tr = (x: any) => { try { const r = i18nStr(String(x), (DI && DI[lg()]) || {}); return r == null ? String(x) : r; } catch (e) { return String(x); } };
    const hasJ = (s: any) => (lg() === "zh" ? KANA : JP).test(String(s));
    /* 日本語のまま計算する（保存する文を日本語で持つため）。同期の関数の中だけで替えて、すぐ戻す */
    const withJa = (f: () => any) => { const keep = lg(); if (keep === "ja" || typeof I18N === "undefined") return f(); I18N.lang = "ja"; try { return f(); } finally { I18N.lang = keep; } };

    try {
        if (typeof I18N !== "undefined" && I18N && I18N.dict && Array.isArray(I18N.pat) && typeof i18nStr === "function") {
            DI = I18N.dict;
            ["en", "zh", "es"].forEach((l) => { if (!DI[l]) DI[l] = {}; });
            const TR = (ja: string, en: string, zh: string, es: string) => { if (DI.en[ja] == null) DI.en[ja] = en; if (DI.zh[ja] == null) DI.zh[ja] = zh; if (DI.es[ja] == null) DI.es[ja] = es; };
            const TN = (ja: string, en: string, zh: string, es: string) => { TR(ja, en, zh, es); MINE.en[ja] = en; MINE.zh[ja] = zh; MINE.es[ja] = es; };
            const HOLE = /\{[A-Za-z]\w*\}/;
            const G = (f: (m: any) => any) => (m: any) => { for (let i = 1; i < m.length; i++) if (m[i] && HOLE.test(m[i])) return null; return f(m); };
            const PF = (re: RegExp, f0: (m: any) => any) => { const f = G(f0); PATS.push({ re, en: f, zh: f, es: f }); };
            const PN = (re: RegExp, f0: (m: any) => any) => { const f = G(f0); PATS.push({ re, en: f, zh: f, es: f, no: 1 }); };
            const PE = (re: RegExp, f0: (m: any) => any) => { const f = G(f0); PATS.push({ re, zh: f, es: f, no: 1 }); };
            const sepL = () => lg() === "zh" ? "・" : ", ";
            const splitDot = (s: string): string[] => { const out: string[] = []; let d = 0, c = ""; for (const ch of String(s)) { if (ch === "（" || ch === "(") d++; else if (ch === "）" || ch === ")") d = Math.max(0, d - 1); if (ch === "・" && d === 0) { out.push(c); c = ""; } else c += ch; } out.push(c); return out.map((x) => x.trim()).filter(Boolean); };
            const trList = (s: string, sp?: string): string => {
                const a = splitDot(s), out: string[] = [];
                for (let i = 0; i < a.length;) {
                    let hit = 0;
                    for (let j = Math.min(a.length, i + 4); j > i + 1; j--) { const c = a.slice(i, j).join("・"); const dv = (DI[lg()] || {})[c]; if (typeof dv === "string" && dv) { out.push(dv); i = j; hit = 1; break; } }
                    if (!hit) { out.push(tr(a[i])); i++; }
                }
                return out.join(sp == null ? sepL() : sp);
            };
            const etc = (x: any) => x ? L3(", etc.", " 等", ", etc.") : "";
            const left = (n: string) => L3(n + " left", "还剩 " + n + " 项", n === "1" ? "falta 1" : "faltan " + n);

            /* ═════ ① 21.93：商品情報を登録・商品情報の充足度（xcut-T02・daily-S06） ═════ */
            PF(/^入っている (\d+)項目（全体 (\d+)）$/, (m) => L3(m[1] + " of " + m[2] + " items filled in", "已填 " + m[1] + " 项（共 " + m[2] + " 项）", m[1] + " de " + m[2] + " datos completos"));
            TR("全体の項目はそろっています", "All items are filled in", "全部项目已齐全", "Todos los datos están completos");
            PF(/^任意 あと(\d+)件（(.+?)( など)?）$/, (m) => L3("Optional: " + left(m[1]) + " (" + trList(m[2]) + etc(m[3]) + ")", "可选：" + left(m[1]) + "（" + trList(m[2]) + etc(m[3]) + "）", "Opcional: " + left(m[1]) + " (" + trList(m[2]) + etc(m[3]) + ")"));
            PF(/^任意 あと(\d+)件$/, (m) => L3("Optional: " + left(m[1]), "可选：" + left(m[1]), "Opcional: " + left(m[1])));
            PF(/^登録済み（任意 あと(\d+)件）$/, (m) => L3("Registered (optional: " + left(m[1]) + ")", "已登记（可选：" + left(m[1]) + "）", "Registrado (opcional: " + left(m[1]) + ")"));
            PF(/^全体 (\d+)\/(\d+) 項目（(.+)）$/, (m) => L3("All items " + m[1] + "/" + m[2] + " (" + tr(m[3]) + ")", "全部项目 " + m[1] + "/" + m[2] + "（" + tr(m[3]) + "）", "Todos los datos " + m[1] + "/" + m[2] + " (" + tr(m[3]) + ")"));
            PF(/^全体 (\d+)\/(\d+)：あと (.+?)( など)?$/, (m) => L3("All items " + m[1] + "/" + m[2] + ": still missing " + trList(m[3]) + etc(m[4]), "全部项目 " + m[1] + "/" + m[2] + "：还缺 " + trList(m[3]) + etc(m[4]), "Todos los datos " + m[1] + "/" + m[2] + ": faltan " + trList(m[3]) + etc(m[4])));
            PF(/^情報 (\d+)\/(\d+)・表示中$/, (m) => L3("Info " + m[1] + "/" + m[2] + " · showing", "信息 " + m[1] + "/" + m[2] + "・显示中", "Información " + m[1] + "/" + m[2] + " · en pantalla"));
            PF(/^情報 (\d+)\/(\d+)$/, (m) => L3("Info " + m[1] + "/" + m[2], "信息 " + m[1] + "/" + m[2], "Información " + m[1] + "/" + m[2]));
            TR("強み・進出国", "Strengths & target countries", "优势・目标国家", "Fortalezas y países objetivo");
            TR("任意の項目", "Optional items", "可选项目", "Datos opcionales");
            TR("（%の外）", " (not in the %)", "（不计入%）", " (fuera del %)");
            TR("（推定・要確認）", "(estimated; needs checking)", "（推定・需确认）", "(estimado; por verificar)");
            TR("HSコード（推定・要確認）", "HS code (estimated; needs checking)", "HS编码（推定・需确认）", "Código HS (estimado; por verificar)");
            TR("価格の有効期限", "Price validity", "价格有效期", "Validez del precio");
            TR("価格の有効期限（切れています）", "Price validity (expired)", "价格有效期（已过期）", "Validez del precio (vencida)");
            TR("供給できる最大数量", "Maximum supply quantity", "可供应的最大数量", "Cantidad máxima de suministro");
            PF(/^%は、登録の項目（全体 (\d+)件）がそろっている割合です$/, (m) => L3("The % is the share of the " + m[1] + " registration items that are filled in", "%为登记项目（共 " + m[1] + " 项）中已填写的比例", "El % es la proporción de los " + m[1] + " datos de registro que están completos"));
            PF(/^%は、登録の項目（全体 (\d+)件）のうち入っている数の割合です（(\d+)\/(\d+)）。(HSコードの推定（要確認）は数に入れていません。)?$/, (m) => L3(
                "The % is the share of the " + m[1] + " registration items that are filled in (" + m[2] + "/" + m[3] + ")." + (m[4] ? " An estimated HS code (needs checking) is not counted." : ""),
                "%为登记项目（共 " + m[1] + " 项）中已填写的比例（" + m[2] + "/" + m[3] + "）。" + (m[4] ? "推定的HS编码（需确认）不计入。" : ""),
                "El % es la proporción de los " + m[1] + " datos de registro que están completos (" + m[2] + "/" + m[3] + ")." + (m[4] ? " Un código HS estimado (por verificar) no se cuenta." : "")));
            PF(/^（入っている数で数えます：(\d+)\/(\d+)(?:で全体はそろっています|＝(\d+)%)。そのうち必須は (\d+)件で、入っているのは (\d+)件）。(HSコードの推定（要確認）は数に入れていません。)?(?:下の任意の項目は%に入れず、別に数えます（任意 (\d+)\/(\d+)(?:・あと(\d+)件)?）。)?$/, (m) => {
                const full = m[3] == null;
                const en = " (Counted by filled items: " + m[1] + "/" + m[2] + (full ? ", so all items are filled in" : " = " + m[3] + "%") + ". Of these, " + m[4] + " are required and " + m[5] + " of them are filled in.)" + (m[6] ? " An estimated HS code (needs checking) is not counted." : "") + (m[7] ? " The optional items below are not in the % and are counted separately (optional " + m[7] + "/" + m[8] + (m[9] ? ", " + m[9] + " left" : "") + ")." : "");
                const zh = "（按已填写的数量计算：" + m[1] + "/" + m[2] + (full ? "，全部项目已齐全" : "＝" + m[3] + "%") + "。其中必填 " + m[4] + " 项，已填 " + m[5] + " 项）。" + (m[6] ? "推定的HS编码（需确认）不计入。" : "") + (m[7] ? "下方的可选项目不计入%，另行计算（可选 " + m[7] + "/" + m[8] + (m[9] ? "・还剩 " + m[9] + " 项" : "") + "）。" : "");
                const es = " (Se cuenta por datos completos: " + m[1] + "/" + m[2] + (full ? ", así que todos los datos están completos" : " = " + m[3] + " %") + ". De ellos, " + m[4] + " son obligatorios y hay " + m[5] + " completos.)" + (m[6] ? " Un código HS estimado (por verificar) no se cuenta." : "") + (m[7] ? " Los datos opcionales de abajo no entran en el % y se cuentan aparte (opcional " + m[7] + "/" + m[8] + (m[9] ? ", faltan " + m[9] : "") + ")." : "");
                return L3(en, zh, es);
            });
            /* 価格の有効期限の選択肢（21.93 prod の「すぐ決める」。語は 21.93 の訳と同じ） */
            const QD: any = { "1か月後": ["In 1 month", "1个月后", "En 1 mes"], "3か月後": ["In 3 months", "3个月后", "En 3 meses"], "6か月後": ["In 6 months", "6个月后", "En 6 meses"], "1年後": ["In 1 year", "1年后", "En 1 año"], "年度末": ["Fiscal year end", "财年末", "Fin del año fiscal"] };
            PF(/^(1か月後|3か月後|6か月後|1年後|年度末)（(\d{4}\/\d{1,2}\/\d{1,2})）$/, (m) => { const q = QD[m[1]]; return L3(q[0] + " (" + m[2] + ")", q[1] + "（" + m[2] + "）", q[2] + " (" + m[2] + ")"); });
            PF(/^(\d{4}-\d\d-\d\d) までの価格にします$/, (m) => L3("Set the price as valid until " + m[1], "将价格有效期设为 " + m[1], "Fijar el precio como válido hasta el " + m[1]));
            TR("日付の形が途中です。年（4桁）・月・日の順に「2027/03/31」のように入れるか、「3か月後」などのボタンを押してください", "The date is incomplete. Enter year (4 digits), month and day, e.g. 2027/03/31, or press a button such as “In 3 months”.", "日期格式不完整。请按年（4位）・月・日的顺序输入，例如 2027/03/31，或点击“3个月后”等按钮", "La fecha está incompleta. Escriba año (4 cifras), mes y día, p. ej. 2027/03/31, o pulse un botón como «En 3 meses».");

            /* ═════ ② 21.93：販売先国の選定（xcut-T02・culture-S04・daily-S06） ═════ */
            TR("点数と順位の見方", "How to read the scores and ranks", "分数与排名的说明", "Cómo leer las puntuaciones y posiciones");
            TR("「未評価」は、その国のデータが無い観点です（例：通関統計に相手国ごとの数字が無いときの競合）。0点ではなく、総合点からも外しています。上の比較の図では、未評価の観点を中心（0の位置）に描いています。",
                "“Not rated” means there is no data for that criterion in that country (e.g. competition when customs statistics have no figure for the country). It is not 0 points and is left out of the overall score. In the comparison chart above, criteria that are not rated are drawn at the centre (0).",
                "“未评价”表示该国在这一观点上没有数据（例如：通关统计中没有该国数字时的竞争）。不是0分，也不计入综合得分。在上方的对比图中，未评价的观点画在中心（0的位置）。",
                "«Sin evaluar» significa que no hay datos de ese criterio para el país (p. ej., la competencia cuando las estadísticas aduaneras no tienen cifras del país). No son 0 puntos y no cuenta en la puntuación global. En el gráfico comparativo de arriba, los criterios sin evaluar se dibujan en el centro (0).");
            PF(/^順位は総合点で付けています。AI商社マンの文の中の順位の言い方（「最も推奨」「第二候補」など）は、総合点の順と食い違うことがあるため外しました（(\d+)か所）。$/, (m) => L3(
                "Ranks follow the overall score. Rank wording in the AI Trade Agent's text (such as “most recommended” or “second choice”) was removed because it can disagree with the overall-score order (" + m[1] + (m[1] === "1" ? " place)." : " places)."),
                "排名按综合得分排列。AI商社专员文字中的排名说法（“最推荐”“第二候选”等）可能与综合得分的顺序不一致，已删除（" + m[1] + " 处）。",
                "Las posiciones siguen la puntuación global. Se quitaron las expresiones de posición del texto del agente comercial IA (como «el más recomendado» o «segunda opción») porque pueden no coincidir con el orden de la puntuación global (" + m[1] + (m[1] === "1" ? " lugar)." : " lugares).")));
            TR("同点", "Tie", "同分", "Empate");
            const ctyList = (s: string) => { const a = String(s).split("・").map((x) => tr(x.trim())); return lg() === "zh" ? a.join("・") : a.join(", "); };
            PF(/^(.+?)と同点（(\d+)点）$/, (m) => L3("Tied with " + ctyList(m[1]) + " (" + m[2] + " pts)", "与" + ctyList(m[1]) + "同分（" + m[2] + "分）", "Empate con " + ctyList(m[1]) + " (" + m[2] + " pts)"));
            PF(/^(市場性|規制|競合|拠点)：データが無いため未評価（総合点は、この観点を除いて出しています）$/, (m) => L3(tr(m[1]) + ": not rated because there is no data (the overall score is calculated without this criterion)", tr(m[1]) + "：因没有数据而未评价（综合得分不含此观点）", tr(m[1]) + ": sin evaluar por falta de datos (la puntuación global se calcula sin este criterio)"));
            /* 同点の説明（21.93 の reg は日本語以外で英語の文を出す → 中・西は英語の文から訳す） */
            const AXZ: any = { market: ["市场性", "mercado"], regulation: ["法规", "normativa"], competition: ["竞争", "competencia"], base: ["据点", "base"] };
            PATS.push({ re: /^(.+?) are tied \((\d+) pts\)\. Ties are ordered by the heavier criteria first \(market → regulation → competition → base\)(?:: (market|regulation|competition|base) \((.+)\)\.|: all criteria equal, so by name\.)$/, en: (m: any) => {
                const nm = ctyList(m[1]);
                const list = m[4] ? String(m[4]).split(" / ").map((x) => { const k = x.match(/^(.+) (\S+|not rated)$/); return k ? tr(k[1]) + " " + k[2] : tr(x); }) : [];
                const out = nm + " are tied (" + m[2] + " pts). Ties are ordered by the heavier criteria first (market → regulation → competition → base)" + (m[3] ? ": " + m[3] + " (" + list.join(" / ") + ")." : ": all criteria equal, so by name.");
                return out === m[0] ? null : out;
            }, no: 1 });
            PE(/^(.+?) are tied \((\d+) pts\)\. Ties are ordered by the heavier criteria first \(market → regulation → competition → base\)(?:: (market|regulation|competition|base) \((.+)\)\.|: all criteria equal, so by name\.)$/, (m) => {
                const nm = ctyList(m[1]);
                const list = m[4] ? String(m[4]).split(" / ").map((x) => { const k = x.match(/^(.+) (\S+|not rated)$/); return k ? tr(k[1]) + " " + (k[2] === "not rated" ? L3("not rated", "未评价", "sin evaluar") : k[2]) : tr(x); }) : [];
                if (lg() === "zh") return nm + "同分（" + m[2] + "分）。同分时，按配分大的观点顺序（市场性→法规→竞争→据点）将得分高的国家排在前面" + (m[3] ? "：" + AXZ[m[3]][0] + "的得分（" + list.join("／") + "）。" : "：4个观点得分也相同，因此按国名顺序。");
                return nm + (/[・,]/.test(m[1]) ? " empatan" : " empata") + " (" + m[2] + " pts). En caso de empate se ordenan por los criterios de más peso (mercado → normativa → competencia → base)" + (m[3] ? ": " + AXZ[m[3]][1] + " (" + list.join(" / ") + ")." : ": todos los criterios iguales, así que por nombre.");
            });
            /* 販売先国：日本からの輸出（年つき） */
            PF(/^日本からの輸出 (.+?)（(\d{4})年・シェア(\d+)%(?:・前年比([+-]?\d+)%)?）$/, (m) => L3(
                "Exports from Japan " + tr(m[1]) + " (" + m[2] + ", share " + m[3] + "%" + (m[4] ? ", " + m[4] + "% YoY" : "") + ")",
                "日本出口 " + tr(m[1]) + "（" + m[2] + "年・份额" + m[3] + "%" + (m[4] ? "・同比" + m[4] + "%" : "") + "）",
                "Exportaciones de Japón " + tr(m[1]) + " (" + m[2] + ", cuota " + m[3] + "%" + (m[4] ? ", " + m[4] + "% interanual" : "") + ")"));

            /* ═════ ③ 販売先国：バイヤー数の文（xcut-T04）。区分「その他」は “Other” の区分（「その他」の訳 More を使わない） ═════ */
            const catP = (c: string): string => {
                let m: any;
                if (/^さまざまな業種を含む区分「その他」$/.test(c) || c === "その他") return L3("“Other” (mixed-industry) products", "“其他”（涵盖各行业）类别商品", "productos de la categoría «Otros» (varios sectores)");
                if ((m = c.match(/^近い区分「(.+)」$/))) return L3("products in the closest category, “" + tr(m[1]) + "”,", "相近类别“" + tr(m[1]) + "”的商品", "productos de la categoría más cercana, «" + tr(m[1]) + "»,");
                return L3(tr(c) + " products", tr(c) + "商品", "productos de " + tr(c));
            };
            const buyN = (n: string) => n + (n === "1" ? " buyer" : " buyers");
            PF(/^STANDAGE ?が(.+?)の商品で商談したバイヤー ?(\d+)社（この国で商談 ?計(\d+)社）$/, (m) => L3(
                "STANDAGE negotiated with " + buyN(m[2]) + " for " + catP(m[1]) + " (" + m[3] + " in this country in total)",
                "STANDAGE就" + catP(m[1]) + "洽谈过的买家 " + m[2] + "家（该国共洽谈" + m[3] + "家）",
                "STANDAGE negoció con " + m[2] + (m[2] === "1" ? " comprador" : " compradores") + " de " + catP(m[1]) + " (" + m[3] + " en total en este país)"));
            PF(/^STANDAGE ?が商談したバイヤー ?(\d+)社（この国）$/, (m) => L3("STANDAGE negotiated with " + buyN(m[1]) + " in this country", "STANDAGE在该国洽谈过的买家 " + m[1] + "家", "STANDAGE negoció con " + m[1] + (m[1] === "1" ? " comprador" : " compradores") + " en este país"));

            /* ═════ ④ 見積書・請求書（xcut-T02・other-S05）：見本の帯・Seller の住所・題 ═════ */
            TR("仕出港を確かめる", "Check the port of loading", "确认装运港", "Comprobar el puerto de carga");
            TR("仕出港を登録する", "Register the port of loading", "登记装运港", "Registrar el puerto de carga");
            TR("宛先は実在しない相手の例です。この請求書は送らないでください。", "The buyer is a fictitious example. Please do not send this invoice.", "收件方为虚构示例。请勿发送此发票。", "El comprador es un ejemplo ficticio. No envíe esta factura.");
            TR("宛先は実在しない相手の例です。この梱包明細は送らないでください。", "The buyer is a fictitious example. Please do not send this packing list.", "收件方为虚构示例。请勿发送此装箱单。", "El comprador es un ejemplo ficticio. No envíe esta lista de empaque.");
            TR("請求書の Seller（売り手＝貴社）に入れる住所が未登録です。", "Your company address for the Seller field of the invoice is not registered.", "发票 Seller（卖方＝贵公司）栏的地址尚未登记。", "No está registrada la dirección de su empresa para el campo Seller de la factura.");
            TR("梱包明細の Seller（売り手＝貴社）に入れる住所が未登録です。", "Your company address for the Seller field of the packing list is not registered.", "装箱单 Seller（卖方＝贵公司）栏的地址尚未登记。", "No está registrada la dirección de su empresa para el campo Seller de la lista de empaque.");
            TR("COMMERCIAL INVOICE（商業送り状）", "COMMERCIAL INVOICE", "COMMERCIAL INVOICE（商业发票）", "COMMERCIAL INVOICE (factura comercial)");
            TN("（未発行）", "(not issued)", "（未开具）", "(sin emitir)");

            /* ═════ ⑤ タスク「関連・根拠」・分析・登録の会話（xcut-S03・indagri-T09） ═════ */
            PF(/^AIバイヤー開拓（(.+)）$/, (m) => L3("AI Buyer Prospecting (" + tr(m[1]) + ")", "AI买家开拓（" + tr(m[1]) + "）", "Prospección IA (" + tr(m[1]) + ")"));
            TR("初受注おめでとうございます！", "Congratulations on your first order!", "恭喜获得首单！", "¡Enhorabuena por el primer pedido!");
            /* 分析の換算の注記（r6b の rateLine）：英語・スペイン語の文に日本語の記号（＝（）・／）が混ざる → その言語の記号に */
            const rateFix = (s: string) => s.replace(/＝/g, " = ").replace(/（/g, " (").replace(/）/g, ")").replace(/・/g, ", ").replace(/／/g, " / ").replace(/ {2,}/g, " ");
            PATS.push({ re: /^([\s\S]*?)(Converted at |Conversión: )(1 [\s\S]*[＝（）／・][\s\S]*)$/, en: (m: any) => m[1] + m[2] + rateFix(m[3]), es: (m: any) => m[1] + m[2] + rateFix(m[3]) });
            // 取り込みの直後の会話（今の版の文。21.93 以前の層が「充足度 N%」を「情報 N/21」に替えた形）：吹き出しの中は文の切れ目ごとに当てる
            TN("いまの情報は", "The information is now", "目前的信息为", "La información está ahora en");
            TN("です。貿易クラウドがフルパワーで動くには、あと", ". To run Trade Cloud at full power, it still needs ", "。要让贸易云全力运转，还需要 ", ". Para que Trade Cloud funcione a plena potencia, faltan ");
            TN("資料を理解した上で、足りない情報だけを順番に伺いますね。", "I have read the documents and will ask only about the missing information, one item at a time.", "我已理解资料，只会依次询问缺少的信息。", "Ya leí los documentos y solo le preguntaré por la información que falta, de una en una.");
            TN("途中でのご質問・修正依頼・📎資料追加もOKです。", " You can ask questions, request corrections or add 📎 documents along the way.", "过程中也可以提问、要求修改或📎追加资料。", " Puede hacer preguntas, pedir correcciones o añadir 📎 documentos en cualquier momento.");
            TN("すべての項目が揃っています。", "All items are complete.", "所有项目已齐全。", "Todos los datos están completos.");
            MP.push({ re: /^(\d+)項目$/, f: (m: any) => L3(m[1] + (m[1] === "1" ? " item" : " items"), m[1] + " 项", m[1] + (m[1] === "1" ? " dato" : " datos")) });

            /* ═════ ⑥ ホームの提案の札：区分名（xcut-T06）。STANDAGE の記録の区分（V88_PROFNM）の英語名 → 中・西 ═════ */
            const CATX: any = { "Food & beverages": ["食品・饮料", "Alimentos y bebidas"], "Alcoholic beverages": ["酒类", "Bebidas alcohólicas"], "Supplements": ["保健食品・营养补充剂", "Suplementos"], "Cosmetics": ["化妆品・美容", "Cosmética y belleza"],
                "Fresh produce": ["农林水产品・生鲜", "Productos frescos"], "Medical & care": ["医疗器械・护理", "Médico y cuidados"], "Industrial": ["工业产品・零部件・材料", "Productos industriales"], "Electronics": ["电气・电子设备", "Electrónica"],
                "Consumer goods": ["日用品・杂货・服装", "Bienes de consumo"], "Used cars etc.": ["二手车等", "Coches usados, etc."], "Other": ["其他", "Otros"] };
            const catX = (en: string) => { const c = CATX[String(en).trim()]; return c ? (lg() === "zh" ? c[0] : c[1]) : null; };
            const z = (zh: string, es: string) => lg() === "zh" ? zh : lg() === "es" ? es : null;
            PE(/^I'll use STANDAGE records from (\d+) similar projects \((.+)\)$/, (m) => { const c = catX(m[2]); return c == null ? null : z("将根据类似商品（" + c + "）的 STANDAGE " + m[1] + " 个案件记录，给出路径的参考", "Usaré los registros de STANDAGE de " + m[1] + " proyectos similares (" + c + ") para estimar la ruta"); });
            PE(/^STANDAGE records \((.+)\): first meeting after (\S+) months \(median\); first deal after about (\S+) buyers$/, (m) => { const c = catX(m[1]); return c == null ? null : z("根据 STANDAGE 的记录，" + c + "从签约到首次商谈的中位数为 " + m[2] + " 个月，首笔交易前接触的买家中位数为 " + m[3] + " 家", "Registros de STANDAGE (" + c + "): primera reunión a los " + m[2] + " meses (mediana); primera operación tras unos " + m[3] + " compradores"); });
            PE(/^STANDAGE records: (\S+)% of buyers met became customers \((.+)\); face-to-face meetings led most deals$/, (m) => { const c = catX(m[2]); return c == null ? null : z("根据 STANDAGE 的记录，见面满6个月以上的买家中，进展到交易的占 " + m[1] + "%（" + c + "）。促成交易的商谈方式以面对面最多", "Registros de STANDAGE: el " + m[1] + "% de los compradores contactados llegó a operar (" + c + "); las reuniones presenciales generaron la mayoría de las operaciones"); });
            PE(/^New verified information this week for (.+)$/, (m) => { const c = catX(m[1]); return c == null ? null : z("本周有关于 " + c + " 的新确认信息", "Esta semana hay información verificada nueva sobre " + c); });

            /* ═════ 営業資料の型の理由の「相手の国 → 前に出すこと」（通しの中国語・スペイン語で英語のまま出ていた。英語は前の層の訳） ═════ */
            const RB: any[] = [
                ["年式・稼働時間（走行距離）・整備の記録と写真を先に。規制への適合は、分かる範囲を事実で", "年份・运转时间（行驶里程）・维修记录和照片放在前面；法规符合情况只按已知事实说明", "Primero el año, las horas de uso (kilometraje), los registros de mantenimiento y las fotos; la conformidad normativa, solo en lo que se sepa"],
                ["仕様・状態の数字と、現地の規格への対応（登録にある時だけ）を前に", "突出规格・状态的数字，以及对当地标准的符合情况（仅限已登记时）", "Destacar las cifras de especificación y estado, y la conformidad con las normas locales (solo si está registrada)"],
                ["仕様・状態（年式・稼働時間・整備の記録）と写真、価格・納期を前に", "突出规格・状态（年份・运转时间・维修记录）和照片、价格・交期", "Destacar especificación y estado (año, horas, registros de mantenimiento), fotos, precio y plazo de entrega"],
                ["返事の速さと、状態の写真・価格を前に", "突出回复速度，以及状态照片・价格", "Destacar la rapidez de respuesta, las fotos del estado y el precio"],
                ["規格・認証（取得しているものだけ）と性能の数値を先に。「日本で売れている」だけでは効かない", "先说明标准・认证（仅限已取得的）和性能数值；只说“在日本卖得好”不起作用", "Primero normas y certificaciones (solo las obtenidas) y cifras de rendimiento; «se vende bien en Japón» por sí solo no funciona"],
                ["現地の規格・表示への対応（登録にある時だけ）と性能の数値を前に", "突出对当地标准・标示的符合情况（仅限已登记时）和性能数值", "Destacar la conformidad con normas y etiquetado locales (solo si está registrada) y las cifras de rendimiento"],
                ["規格・認証（取得しているものだけ）と性能の数値、供給の安定・価格帯を前に", "突出标准・认证（仅限已取得的）和性能数值、供应稳定・价格区间", "Destacar normas y certificaciones (solo las obtenidas), cifras de rendimiento, suministro estable y rango de precios"],
                ["返事の速さと、規格・認証（取得しているものだけ）を前に", "突出回复速度，以及标准・认证（仅限已取得的）", "Destacar la rapidez de respuesta y las normas y certificaciones (solo las obtenidas)"],
                ["仕様・規格の数字と、登録・表示への適合（分かる範囲）・実績を先に", "先说明规格・标准的数字，以及对登记・标示的符合情况（已知范围）和业绩", "Primero las cifras de especificación y normas, la conformidad con registro y etiquetado (en lo que se sepa) y la trayectoria"],
                ["仕様・規格の数字と、現地の規格や表示への対応（登録にある時だけ）を前に", "突出规格・标准的数字，以及对当地标准和标示的符合情况（仅限已登记时）", "Destacar las cifras de especificación y normas, y la conformidad con normas y etiquetado locales (solo si está registrada)"],
                ["仕様・使い方と効果の事実、価格帯・納期を前に", "突出规格・用法和效果的事实、价格区间・交期", "Destacar especificación, uso y resultados comprobados, rango de precios y plazo de entrega"],
                ["返事の速さと、仕様・納期を前に", "突出回复速度，以及规格・交期", "Destacar la rapidez de respuesta, la especificación y el plazo de entrega"]];
            RB.forEach((r) => { if (DI.zh[r[0]] == null) DI.zh[r[0]] = r[1]; if (DI.es[r[0]] == null) DI.es[r[0]] = r[2]; });

            /* ═════ ⑦ 英語の営業メールの点検（culture-T05） ═════ */
            TR("相手は読めません。ローマ字の氏名（例：Taro Yamada）を「✍ 署名」に入れてください（自動ではローマ字にしません）。入れると、英語の文面の署名に入ります",
                "The buyer cannot read it. Enter your name in Latin letters (e.g. Taro Yamada) in “✍ Signature” (we do not romanize it automatically). It then goes into the signature of English messages.",
                "对方无法阅读。请在“✍ 签名”中填写罗马字姓名（例：Taro Yamada）（不会自动转换为罗马字）。填写后会用于英文邮件的签名。",
                "El comprador no puede leerlo. Escriba su nombre en letras latinas (p. ej., Taro Yamada) en «✍ Firma» (no lo romanizamos automáticamente). Después se usará en la firma de los mensajes en inglés.");
            TR("署名が日本語", "Signature in Japanese", "签名为日文", "Firma en japonés");
            PF(/^署名の氏名が日本語のままです：「(.+)」$/, (m) => L3("Your signature name is still in Japanese: “" + m[1] + "”", "签名中的姓名仍为日文：“" + m[1] + "”", "El nombre de la firma sigue en japonés: «" + m[1] + "»"));

            /* ── 文の形を辞書の仕組みに入れる（前の層より先に見る） ──
                  ほかの層があとから I18N.pat の頭に足す形（例：「A → B」）が先に当たることがあるので、i18nStr を包んで、この層の形を先に見る */
            PATS.slice().reverse().forEach((p) => I18N.pat.unshift(p));
            const __st = i18nStr;
            i18nStr = function (this: any, s: any, d: any) {
                try {
                    const l = lg();
                    if (l !== "ja" && d && d === DI[l] && s != null) {
                        const k = String(s).trim();
                        if (k && k.length <= 1200 && d[k] == null) {
                            for (const p of PATS) {
                                const f = p[l];
                                if (!f) continue;
                                const m = k.match(p.re);
                                if (!m) continue;
                                const r = f(m);
                                if (r != null) return String(s).replace(k, () => r);
                            }
                        }
                    }
                } catch (e) { warn("str", e); }
                return __st.apply(this, arguments as any);
            };
        }
    } catch (e) { warn("dict", e); }

    /* ═════ 見積書の注記（21.93 の v92doc）：日本語以外は、その言語の文を出す（xcut-T02・other-S05） ═════ */
    const docE = (s: any) => { try { return typeof v92docE === "function" ? v92docE(s) : E(s); } catch (e) { return E(s); } };
    const docT = (s: string) => { try { return typeof v92docT === "function" ? v92docT(s) : s; } catch (e) { return s; } };
    const port = (s: any) => { const v = String(s == null ? "" : s); try { const d = DI && DI[lg()]; const t = d && typeof d[v] === "string" ? d[v] : null; return t && !hasJ(t) ? t : v; } catch (e) { return v; } };
    const termOf = () => { try { return String(((typeof v92docTen === "function" && v92docTen()) || {}).term || ""); } catch (e) { return ""; } };
    try {
        if (typeof v92docPolNote === "function") {
            const __pn = v92docPolNote;
            v92docPolNote = function (this: any, S: any) {
                const h = __pn.apply(this, arguments as any);
                try {
                    if (lg() === "ja" || !h || !S || !S.v92pol) return h;
                    const P = S.v92pol;
                    const btn = `<button type="button" class="btn g" data-v92act="pol" style="font-size:10.5px;padding:3px 10px">${docE(docT(P.reg ? "仕出港を確かめる" : "仕出港を登録する"))}</button>`;
                    if (!S.pol) return `<span class="v92doc-red">${docE(L3("The port of loading is not registered in Product info.", "商品信息中尚未登记装运港。", "El puerto de carga no está registrado en la información del producto."))}</span>${docE(L3(" The quotation's trade term has no port (no placeholder such as Yokohama is put in). Once you register the port, it goes into the documents.", "报价单的贸易术语中没有填写港口（没有临时填入横滨港等）。登记港口后会填入单证。", " El término comercial de la cotización no lleva puerto (no se pone uno provisional como Yokohama). Al registrar el puerto, se incluirá en los documentos."))} ${btn}`;
                    const nm = `<b data-noi18n>${docE(port(S.pol))}</b>`;
                    const tm = `<b data-noi18n>${docE(termOf())}</b>`;
                    let o = P.from === "term" ? L3(`Port of loading: ${nm}, the port in the trade terms “${tm}” in Product info.`, `装运港为商品信息交易条件“${tm}”中的港口 ${nm}。`, `Puerto de carga: ${nm}, el puerto de las condiciones «${tm}» de la información del producto.`)
                        : P.from === "pol" ? L3(`Port of loading: ${nm}, as registered in Product info.`, `装运港取自商品信息中登记的 ${nm}。`, `Puerto de carga: ${nm}, según lo registrado en la información del producto.`)
                            : P.from === "edit" ? L3(`Port of loading: ${nm}, the port in the trade terms entered when editing the order.`, `装运港为编辑订单内容时填写的交易条件中的港口 ${nm}。`, `Puerto de carga: ${nm}, el puerto de las condiciones introducidas al editar el pedido.`)
                                : L3(`Port of loading: ${nm}, the port in the price list's trade term.`, `装运港取自价格表贸易术语中的港口 ${nm}。`, `Puerto de carga: ${nm}, el puerto del término comercial de la lista de precios.`);
                    if (P.clash) o += ` <span class="v92doc-warn">${docE(L3("Check: the port in the trade terms differs from the port of loading in Product info (", "需确认：交易条件中的港口与商品信息中的装运港（", "Revise: el puerto de las condiciones no coincide con el puerto de carga de la información del producto ("))}<span data-noi18n>${docE(port(P.reg || P.raw))}</span>${docE(L3("). Make them the same.", "）不同。请统一为其中一个。", "). Unifíquelos."))}</span> ${btn}`;
                    return o;
                } catch (e) { warn("pol", e); return h; }
            };
        }
        if (typeof v92docValidNote === "function") {
            const __vn = v92docValidNote;
            v92docValidNote = function (this: any, S: any) {
                const h = __vn.apply(this, arguments as any);
                try {
                    const V = S && S.v92valid;
                    if (lg() === "ja" || !h || !V) return h;
                    if (V.why === "exp") return `<span class="v92doc-red">${docE(L3(`Validity: the price list's validity (${V.pu}) has expired, so the quotation's validity is [to be confirmed].`, `有效期：价格表的期限（${V.pu}）已过期，因此报价单的有效期为［需确认］。`, `Validez: la validez de la lista de precios (${V.pu}) venció, así que la validez de la cotización está [por confirmar].`))}</span>${docE(L3(" Update the price or extend its validity.", "请更新价格或延长期限。", " Actualice el precio o amplíe su validez."))}`;
                    if (V.why === "price") return L3(`Valid until <b>${docE(V.until)}</b> (the product's price validity is ${docE(V.pu)}; it comes before 30 days from the quotation date ${docE(V.date)} [${docE(V.d30)}], so the price validity applies).`, `有效期至 <b>${docE(V.until)}</b>（商品价格的有效期为 ${docE(V.pu)}，早于报价单日期 ${docE(V.date)} 起30天〔${docE(V.d30)}〕，因此以价格的期限为准）。`, `Válida hasta el <b>${docE(V.until)}</b> (la validez del precio del producto es ${docE(V.pu)}; es anterior a 30 días desde la fecha de la cotización ${docE(V.date)} [${docE(V.d30)}], así que se aplica la validez del precio).`);
                    return L3(`Valid until <b>${docE(V.until)}</b> (30 days from the quotation date ${docE(V.date)}).`, `有效期至 <b>${docE(V.until)}</b>（自报价单日期 ${docE(V.date)} 起30天）。`, `Válida hasta el <b>${docE(V.until)}</b> (30 días desde la fecha de la cotización ${docE(V.date)}).`)
                        + (V.pu ? L3(` This comes before the product's price validity (${docE(V.pu)}), so the 30 days apply.`, `早于商品价格的有效期（${docE(V.pu)}），因此以30天为准。`, ` Es anterior a la validez del precio del producto (${docE(V.pu)}), así que se aplican los 30 días.`)
                            : L3(" The product's price validity is not set (once set, the earlier date is used).", "商品价格的有效期尚未设置（设置后采用较早的日期）。", " La validez del precio del producto no está fijada (al fijarla, se usa la fecha más temprana)."));
                } catch (e) { warn("valid", e); return h; }
            };
        }
        if (typeof v92docAirNote === "function") {
            const __an = v92docAirNote;
            v92docAirNote = function (this: any, S: any, code: any) {
                const h = __an.apply(this, arguments as any);
                try {
                    if (lg() === "ja" || !h) return h;
                    let o = L3("Transport is set to <b>air</b> (the port of loading is an airport).", "运输方式设为<b>空运</b>（装运港为机场）。", "El transporte es <b>aéreo</b> (el puerto de carga es un aeropuerto).");
                    const src = String(h).match(/<span class="v92doc-from">[\s\S]*<\/span>$/);
                    if (/^(FOB|FAS|CFR|CIF)$/.test(code || "")) o += ` <span class="v92doc-warn">${docE(L3(`Check: ${code} is a term for sea and inland waterway transport. For air, FCA (Free Carrier) and similar terms are common. Confirm the terms with the buyer.`, `需确认：${code} 本来是海运・内河运输的条件。空运一般使用 FCA（货交承运人）等。请与对方确认条件。`, `Revise: ${code} es un término para transporte marítimo y fluvial. Para el aéreo suele usarse FCA (franco transportista). Confirme las condiciones con el comprador.`))}</span>` + (src ? src[0] : "");
                    return o;
                } catch (e) { warn("air", e); return h; }
            };
        }
    } catch (e) { warn("docnote", e); }

    /* ═════ 21.93 の欄と今の版の知らせの重なり（xcut-T02）：21.93 の欄（一部が日本語のまま：N件）があるので、今の版の知らせは出さない ═════ */
    try {
        if (typeof ai18nRun === "function" && typeof V92MISC !== "undefined") {
            const __ar = ai18nRun;
            ai18nRun = function (this: any) {
                try { if (typeof AI18N !== "undefined" && AI18N) AI18N.noted = true; } catch (e) { }
                return __ar.apply(this, arguments as any);
            };
        }
    } catch (e) { warn("ai18n", e); }

    /* ═════ 販売先国：おすすめ理由の文は日本語で持つ。バイヤー数の文は日本語の文から訳す（xcut-T04） ═════ */
    try {
        if (typeof ctyWhyLocal === "function") {
            const __cw = ctyWhyLocal;
            ctyWhyLocal = function (this: any) { const self = this, a = arguments; return withJa(() => __cw.apply(self, a as any)); };
        }
        if (typeof v54ctyBuyers === "function") {
            const __cb = v54ctyBuyers;
            v54ctyBuyers = function (this: any) {
                if (lg() === "ja") return __cb.apply(this, arguments as any);
                try {
                    const self = this, a = arguments;
                    const ja = withJa(() => __cb.apply(self, a as any));
                    if (typeof ja === "string" && ja) { const t = tr(ja); if (t !== ja && !hasJ(t)) return t; }
                } catch (e) { warn("buy", e); }
                return __cb.apply(this, arguments as any);
            };
        }
    } catch (e) { warn("cty", e); }
    /* 前に英語で分析して持っていた文（“for More products”）は、日本語の画面では日本語で出す（表示だけ。持っている文は変えない） */
    const BUY_EN = /STANDAGE negotiated with (\d+) buyers? for (?:More|Other) products \((\d+) in this country in total\)/g;

    /* ═════ 産地（英語・スペイン語の地名）→ 書類の Origin（都道府県）（xcut-T05） ═════ */
    try {
        if (typeof v85docPref === "function") {
            const __pf = v85docPref;
            const fold = (s: string) => { try { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, ""); } catch (e) { return String(s); } };
            v85docPref = function (this: any, s: any) {
                const r = __pf.apply(this, arguments as any);
                if (r) return r;
                try {
                    const x = fold(String(s || ""));
                    if (!/[A-Za-z]{3}/.test(x) || typeof V85PREF_EN === "undefined") return r;
                    const x2 = x.replace(/ou/gi, "o").replace(/oo/gi, "o"); // Kyouto・Oosaka などの書き方
                    for (const p of Object.keys(V85PREF_EN)) {
                        const en = String(V85PREF_EN[p] || "");
                        if (!en) continue;
                        const re = new RegExp("(^|[^A-Za-z])" + en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![A-Za-z])", "i");
                        if (re.test(x) || re.test(x2)) return p;
                    }
                } catch (e) { warn("pref", e); }
                return r;
            };
        }
    } catch (e) { warn("pref0", e); }

    /* ═════ 英文の書類の単価「HK$115/本」→「HK$115.00」（food-T06・daily-T07）。EUR・US$ は前の層（docs）と同じ結果 ═════ */
    const CUR = "(?:US\\$|USD|HK\\$|HKD|S\\$|SGD|A\\$|AUD|NT\\$|TWD|C\\$|CAD|NZ\\$|NZD|RM|MYR|THB|RMB|CNY|EUR|€|GBP|£|¥|￥|JPY|\\$)";
    const UP = new RegExp("^\\s*(" + CUR + ")\\s*([\\d,]+(?:\\.\\d+)?)\\s*[\\/／]\\s*[^\\s\\d]{1,6}\\s*$", "i");
    const upClean = (v: any) => {
        const s = String(v == null ? "" : v);
        let n = s; try { n = s.normalize("NFKC"); } catch (e) { }
        const m = n.match(UP);
        if (!m) return s;
        const cur0 = m[1], num = m[2];
        // US$・EUR・¥ などは前の層（docs）の形のまま（数字は書いたとおり）。それ以外の通貨は小数2桁にそろえる
        if (/^(US\$|USD|\$|¥|￥|JPY|EUR|€)$/i.test(cur0)) return cur0 + (/^[A-Z]{3}$/i.test(cur0) ? " " : "") + num;
        const f = +num.replace(/,/g, "");
        if (!isFinite(f)) return s;
        const body = f.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
        return (/^[A-Z]{2,3}$/i.test(cur0) ? cur0.toUpperCase() + " " : cur0) + body;
    };
    try {
        if (typeof v54docSyncRows === "function") {
            const __sr = v54docSyncRows;
            v54docSyncRows = function (this: any, S: any) {
                const r = __sr.apply(this, arguments as any);
                try {
                    const R = S && S.docRows;
                    if (R && !S.poNo) ["pi", "ci"].forEach((k) => { if (Array.isArray(R[k])) R[k].forEach((row: any) => { if (Array.isArray(row) && row.length >= 3 && typeof row[2] === "string") row[2] = upClean(row[2]); }); });
                } catch (e) { warn("rows", e); }
                return r;
            };
        }
    } catch (e) { warn("rows0", e); }

    /* ═════ 英語の営業メールの署名（culture-T05）：登録の英文の氏名を使う。無ければ点検で知らせる（勝手にローマ字にしない） ═════ */
    const jaName = (): string => { try { const s = typeof v79obSig === "function" ? v79obSig() : null; return String((s && s.name) || "").trim(); } catch (e) { return ""; } };
    const enName = (): string => {
        try {
            const n = jaName();
            if (n && !JP.test(n)) return n;
            const fx = typeof dk3Fixed === "function" ? dk3Fixed() : null;
            const p = String((fx && fx.personEn) || "").trim();
            if (p && !JP.test(p)) return p;
        } catch (e) { }
        return "";
    };
    const latinBody = (b: string) => { const la = (b.match(/[A-Za-z]/g) || []).length, ja = (b.match(/[ぁ-んァ-ヶ一-龠々]/g) || []).length; return la > 40 && la > ja * 3; };
    try {
        if (typeof v71obTpl === "function") {
            const __tp = v71obTpl;
            v71obTpl = function (this: any) {
                const res = __tp.apply(this, arguments as any);
                try {
                    const nj = jaName(), ne = enName();
                    if (res && Array.isArray(res.seq) && nj && JP.test(nj) && ne)
                        res.seq.forEach((m: any) => { const b = String((m && m.body) || ""); if (b && latinBody(b) && b.indexOf(nj) >= 0) m.body = b.split(nj).join(ne); });
                } catch (e) { warn("tpl", e); }
                return res;
            };
        }
        /* 受信箱の確認・承認の札（AIバイヤー開拓の文面）：英語などの文面の署名が日本語の氏名のとき
             英文の氏名が登録済み → 文面の署名をその氏名に（送る前の文面）。無い → 札に点検の知らせ（勝手にローマ字にしない） */
        if (typeof v84cObItems === "function") {
            const __oi = v84cObItems;
            const acctJa = (): string => { try { const w = String((typeof SES !== "undefined" && SES && SES.who) || "").replace(/様$/, "").trim(); return w || jaName(); } catch (e) { return jaName(); } };
            const leadOf = (id: any) => { try { for (const r of ((typeof v71obSt === "function" && v71obSt()) || {}).runs || []) for (const L of (r.leads || [])) if (L && L.id === id) return L; } catch (e) { } return null; };
            v84cObItems = function (this: any) {
                const out = __oi.apply(this, arguments as any);
                try {
                    if (!Array.isArray(out)) return out;
                    const nj = acctJa();
                    if (!nj || !JP.test(nj)) return out;
                    const ne = enName();
                    const re = new RegExp("(regards|Saludos|Atentamente|Sincerely),?[ \\t]*\\n[ \\t]*" + nj.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=\\s|$)", "i");
                    out.forEach((it: any) => {
                        if (!it || it.src !== "ob") return;
                        const L = leadOf(it.lead);
                        const m = L && L.ap && Array.isArray(L.ap.seq) ? L.ap.seq[it.i] : null;
                        const body = String((m && m.body) || "");
                        if (!m || !latinBody(body) || !re.test(body)) return;
                        if (ne) {
                            m.body = body.replace(re, (a: string) => a.slice(0, a.length - nj.length) + ne);
                            it.bodyHtml = String(it.bodyHtml || "").split(E(nj)).join(E(ne));
                            return;
                        }
                        const L4 = (ja: string, en: string, zh: string, es: string) => lg() === "ja" ? ja : L3(en, zh, es);
                        it.diffHtml = (it.diffHtml || "") + `<div class="v84-diff v92r8c-sig" data-noi18n><b>${E(L4("点検", "Check", "检查", "Revisión"))}</b>${lg() === "ja" || lg() === "zh" ? "：" : ": "}${E(L4(
                            "署名の氏名が日本語のままです（" + nj + "）。相手は読めません。AIバイヤー開拓の「✍ 署名」に、ローマ字の氏名（例：Taro Yamada）を入れてください（自動ではローマ字にしません）。入れると、英語の文面の署名に入ります。",
                            "The signature name is still in Japanese (" + nj + "). The buyer cannot read it. Enter your name in Latin letters (e.g. Taro Yamada) in “✍ Signature” in AI Buyer Prospecting (we do not romanize it automatically). It then goes into the signature of English messages.",
                            "签名中的姓名仍为日文（" + nj + "）。对方无法阅读。请在AI买家开拓的“✍ 签名”中填写罗马字姓名（例：Taro Yamada）（不会自动转换为罗马字）。填写后会用于英文邮件的签名。",
                            "El nombre de la firma sigue en japonés (" + nj + "). El comprador no puede leerlo. Escriba su nombre en letras latinas (p. ej., Taro Yamada) en «✍ Firma» de la prospección IA (no lo romanizamos automáticamente). Después se usará en la firma de los mensajes en inglés."))}</div>`;
                        const tg = Array.isArray(it.tags) ? it.tags : (it.tags = []);
                        if (!tg.some((t: any) => t && t.v92r8c)) tg.push({ t: "署名が日本語", c: "chk", v92r8c: 1 });
                    });
                } catch (e) { warn("obitems", e); }
                return out;
            };
        }
        if (typeof v33CkText === "function") {
            const __ck = v33CkText;
            v33CkText = function (this: any, F: any, txt: any) {
                const r = __ck.apply(this, arguments as any);
                try {
                    const s = String(txt || "");
                    const nj = jaName();
                    if (!Array.isArray(F) || !nj || !JP.test(nj) || !latinBody(s)) return r;
                    const re = new RegExp("(regards|Saludos|Atentamente|Sincerely|Best),?[ \\t]*\\n[ \\t]*" + nj.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
                    if (!re.test(s) || F.some((f: any) => f && f.v92r8c)) return r;
                    F.push({ lv: "yel", v92r8c: 1, t: "署名の氏名が日本語のままです：「" + nj + "」", how: "相手は読めません。ローマ字の氏名（例：Taro Yamada）を「✍ 署名」に入れてください（自動ではローマ字にしません）。入れると、英語の文面の署名に入ります" });
                } catch (e) { warn("ck", e); }
                return r;
            };
        }
    } catch (e) { warn("sig", e); }

    /* ═════ 表示の仕上げ：吹き出し・data-noi18n の中（この層の表にある文だけ）／日本語の画面で前に英語で持った文 ═════ */
    const mine = (k: string, l: string): string | null => {
        const t = MINE[l] && MINE[l][k];
        if (t != null) return t;
        for (const p of PATS) {
            if (!p.no || !p[l]) continue;
            const m = k.match(p.re);
            if (!m) continue;
            try { const r = p[l](m); if (r != null) return r; } catch (e) { }
        }
        for (const p of MP) { const m = k.match(p.re); if (m) { try { const r = p.f(m); if (r != null) return r; } catch (e) { } } }
        return null;
    };
    const fix = () => {
        try {
            const l = lg();
            if (l === "ja") {
                if (typeof cur === "undefined" || cur !== "cty") return;
                const well = document.getElementById("well");
                if (!well || (well.textContent || "").indexOf("STANDAGE negotiated with") < 0) return;
                const w = document.createTreeWalker(well, NodeFilter.SHOW_TEXT);
                let n: any;
                while ((n = w.nextNode())) {
                    const v = String(n.nodeValue || "");
                    if (v.indexOf("STANDAGE negotiated with") < 0) continue;
                    const t = v.replace(BUY_EN, (_a: any, b: any, c: any) => "STANDAGE がさまざまな業種を含む区分「その他」の商品で商談したバイヤー " + b + "社（この国で商談 計" + c + "社）");
                    if (t !== v) n.nodeValue = t;
                }
                return;
            }
            if (!MINE[l] || !DI || typeof I18N === "undefined") return;
            const els = document.querySelectorAll("[data-noi18n], #fchat .m.a .bb");
            for (let i = 0; i < els.length && i < 1500; i++) {
                const el: any = els[i];
                if (el.closest("#uxpq,.acode,.msgtr,.m.u")) continue;
                const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
                const L: any[] = [];
                while (w.nextNode() && L.length < 400) L.push(w.currentNode);
                for (let j = 0; j < L.length; j++) {
                    const n = L[j];
                    const p = n.parentNode;
                    if (!p || /^(SCRIPT|STYLE|TEXTAREA|CODE|PRE)$/.test(p.nodeName)) continue;
                    let src = String(n.nodeValue || "");
                    if (I18N.orig.has(n)) {
                        const o = String(I18N.orig.get(n) || "");
                        if (src !== o) { if (/^\s+[.,;:。]/.test(src) && MINE[l][o.trim()] != null) n.nodeValue = src.replace(/^\s+/, ""); continue; }
                        src = o;
                    }
                    const k = src.trim();
                    if (!k || k.length > 1500) continue;
                    let t: any = null;
                    if (JP.test(k)) t = k.length > 400 ? null : mine(k, l);
                    else if ((k === "。" && l !== "zh") || (k === ")." && l === "zh")) {
                        // 訳した言葉のすぐ後ろの句点・閉じかっこ（「2項目」+「。」→「2 items」+「.」）
                        const pv = j > 0 ? L[j - 1] : null;
                        if (pv && I18N.orig.has(pv) && String(pv.nodeValue) !== String(I18N.orig.get(pv))) t = k === "。" ? "." : "）。";
                    } else if (l !== "en" && /^Imported: /.test(k)) t = (l === "zh" ? "已导入：" + k.slice(10).split(", ").join("、") : "Importado: " + k.slice(10));
                    if (t == null || t === k) continue;
                    if (!I18N.orig.has(n)) I18N.orig.set(n, src);
                    // 文の頭が句読点の訳（「です。…」→「. …」）は、前の空白を詰める
                    n.nodeValue = /^[.,;:。]/.test(t) ? src.replace(/^\s+/, "").replace(k, () => t) : src.replace(k, () => t);
                }
            }
        } catch (e) { warn("fix", e); }
    };
    let fixT: any = 0;
    const kick = () => { if (fixT) return; fixT = setTimeout(() => { fixT = 0; fix(); }, 170); };
    try {
        const start = () => { try { new MutationObserver(kick).observe(document.body, { childList: true, subtree: true, characterData: true }); kick(); } catch (e) { } };
        if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
    } catch (e) { }
    W.v92r8c = { fix, err: ERR, n: PATS.length, upClean };
})();
