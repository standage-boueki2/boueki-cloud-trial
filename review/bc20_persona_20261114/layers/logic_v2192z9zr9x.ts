/* 21.94 r9x：9巡目の5本（r9a・r9b・r9c・r9g・r9p）を重ねた版の確かめで見つけた違いの直し（本体の層。今の版と刷新版の両方に効く）
   ① 国名の表の作り直しの入れ子（r9c × 本体の ctyAll。性能）
      r9c は cnorm を包み、国名かどうかを国名の表（r9c の中の cset）で確かめる。表は最初に要ったときに作り、作る材料に本体の ctyAll() を使う。
      ところが ctyAll() は拠点の国を ctyNorm → cnorm で読む。表がまだできていない間に cnorm が呼ばれると
      cset → ctyAll → ctyNorm → cnorm → cset → ctyAll … と、スタックがあふれる（RangeError）まで約1,000段入れ子になり、
      それぞれの段が表を最後まで作り直していた（重ねた版の「更新」1回で String.normalize が約40万回。食品の見本で、CPU そのままで約0.25秒、
      CPU 1/4 で約1秒のスクリプトの仕事が増えていた。日本語の画面でも起きる。r9c だけの版 8905 でも同じ）。
      直し：ctyAll の入れ子を2段までにする（3段目＝表を作っている途中の ctyAll の中から、また表を作りに来た ctyAll だけ空の一覧を返す）。
      いちばん外で表を作る段の ctyAll は今までどおり最後まで動くので、出来上がる表（国名の一覧と、英・中・西の名前の読み替え）は前と同じ。
      ctyAll は本体の中では入れ子に呼ばれない（入れ子になるのは上の輪だけ）ので、ほかの使い方は変わらない。
   ② 英・中・西の「Dubai／Dubái／迪拜」の国のキー（r9c の cnorm。同じ版の中の食い違い）
      r9c の国名の表では、国の一覧にある「ドバイ」の訳（Dubai）が先に入るため、cnorm("Dubai") は「ドバイ」を返す。
      一方、本体の cnorm は「ドバイ」を「UAE」に読む（r9c の別名の表も Dubai を UAE の別名にしている）。
      そのため英・中・西で「Dubai」と打つと、日本語で「ドバイ」と打ったとき（UAE）と別の国のキーになる（案件 No. の国の記号・書類の判断が分かれる）。
      直し：cnorm の結果がもう一度 cnorm で別の値になるときは、その値にする（国のキーを1つに決める）。
      確かめた範囲（国の一覧 77 か国・地域 × 日英中西の名前と別名 606 通り）で、結果が変わるのは Dubai／Dubái／迪拜 の 8 通りだけ。
   ③ 目標と道筋の「連絡のペース」の根拠の文（r9b × r9c。中国語・スペイン語）
      r9b（daily-T09・other-T10）は、根拠の文を「保守 月 lo（中央値）・標準 月 mid（上位25%）・挑戦 月 hi（標準の 2.5倍）」に直した（日本語・英語。
      中・西は英語の文）。r9c は同じ文の前の形（「月 lo〜hi 社（中央値・上位25%）」）を中・西に訳す。重ねると、r9c の訳が先に入るため r9b の置き換えが当たらず、
      中・西では前の形（同じ画面の「標準 月 mid」と食い違う）のまま出ていた（r9b だけの版では英語の新しい文、r9c だけの版では前の形の訳）。
      直し：中・西のとき、r9c の訳した前の形を、r9b と同じ中身の中・西の文に置き換える（数は同じ SC.lo・mid・hi。言葉は r9c の「保守・标准・挑战」「conservador・estándar・exigente」）。
   ④ 「読み込み中」の安全弁（r9p の head の CSS：最初の描画から 15 秒で中身を出す）が、英語・遅い CPU では仕上げより先に効く（r9p × 英語）
      英語の「更新」は日本語より重く（本体の訳の処理。8819・8901 も同じ）、CPU 1/4 では文書の解析が終わるのが 14〜16 秒、仕上げ（rd-ready）は 15〜17 秒。
      CSS の安全弁は最初の描画から 15 秒で中身を出すため、その間（重ねた版で約1.6秒）、仕上がる前の画面が見えていた（m/splash.cjs：16.5 秒に「読み込み中」が消え、
      rd-ready は 18.2 秒）。日本語・CPU 1/4 は 8〜10 秒で仕上がり、当たらない。
      直し：本体のスクリプトが最後まで走った時点（＝この層。まだ 14.5 秒より前で、仕上げ前のときだけ）で、安全弁の 15 秒をそこから数え直す
      （同じ CSS の印に別名の keyframes を当てて、アニメーションを始め直す）。JS が動いている間は、r9p の boot の仕上げ（DCL のあと）・5 秒・load の
      1.5 秒後の出し方がそのまま効く。本体のスクリプトが動かないときは、この層も動かないので、今までどおり 15 秒で出る。
   ⑤ 書類をつくるの案件のタブ（r9a × r9c。英・中・西）
      r9a はタブの文を「案件 No.｜相手（国）｜数量・額」にし、訳さない印（data-noi18n）を付けた。国名・単位は日本語のまま（アメリカ・100セット・2台）。
      r9c だけの版では、タブ（「案件 No.｜国」）は辞書で訳されていた。重ねると英・中・西のタブに日本語が残る（通しの o1_ship・47・48 で 2 行）。
      直し：日本語以外のとき、描いたあとに、タブの国名を辞書の国名に、数量の単位を r9c の単位の訳（同じ表）に、区切りを英・西は「 | 」にする（title も同じ）。
   ⑥ 商品情報の「足りないのは N項目（…）。「商品情報を登録」の画面で、1問ずつ伺います。」と、商品情報を登録の「あと N項目を埋めると、すべての機能が動きます。」
      「🤖 AI エンジンにつながると、AIが資料を読み直して追加ヒアリングも行えます。」（本体の文。英・中・西の訳が無い）
      r9b で「—」だけの値を未登録と数えるようになり、r9c の通し（質問に2つ答える）で書道セット・建機に「足りない項目」が1つ残るようになって、
      英・中・西の画面に出るようになった（r9c だけの版では 21/21 で出ていなかった。足りない項目がある商品では前から日本語のまま）。
      直し：日本語以外のとき、描いたあとに、この3つの文をその言語の文にする（訳さない印を付けた要素に置き換える。言語を日本語に戻すと描き直しで元に戻る）。
   ⑦ 書類の「確かめること」の規則の名前（r9b × r3c の訳。英・中・西）
      r9b（auto-U04）は、いくつかの国をまとめた規則の名前（例「強制規格・認証（ベトナムは…、マレーシアは…、シンガポールは…）」）を仕向国の分だけに縮める。
      r3c は元の名前の全体に英・中・西の訳を持つ（辞書）。縮めた名前には訳が無いため、英・中・西の画面にその行と「要確認：…」が日本語で出ていた
      （通しのスペイン語：建機・ベトナムで 24_doc・o1_ship・47・48 に 2 行ずつ。r9b・r9c それぞれの版では出ない）。
      直し：v85docJudge を包み、r9b が縮めた名前（規則の id から元の名前を引く）に、元の訳の同じ国の分だけを残した訳を辞書に足す
      （括弧の中の国ごとの区切り〔日本語「、」・英西「; 」・中「，」〕の数が元と訳でそろうときだけ。そろわないときは足さない＝今までどおり）。
   ⑨ ホーム・分析の「数え方：消化率 N%＝完了…」の中・西（r9c の文の形が整数の % だけ）
      r9c は v90anaX の日本語の文を形で中・西に訳すが、消化率を「(\d+)%」で読むため、「9.1%」のような小数のときは当たらず英語の文が出ていた
      （通しのスペイン語：タスク 11件中 1件完了＝9.1% で、29_home2・40_rep・41_rep_bd に英語の行。r9c の通しは整数の % で当たっていた）。
      直し：r9c が当てられなかったときだけ、小数も読む同じ形で、r9c と同じ中・西の文を出す。 */
declare let ctyAll: any, cnorm: any, v92goalReachHtml: any, render: any, v85docJudge: any, v90anaX: any;
declare const V85DOC_D: any;
declare const I18N: any;
(function () {
    const W: any = window;
    if (W.__v2192r9x) return;
    const S: any = (W.__v2192r9x = { caCut: 0 });
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
    } catch (e) { }
    try {
        if (typeof ctyAll === "function") {
            const __ca = ctyAll;
            let depth = 0;
            ctyAll = function (this: any) {
                if (depth >= 2) { S.caCut++; return []; }
                depth++;
                try { return __ca.apply(this, arguments as any); } finally { depth--; }
            };
        }
    } catch (e) { }
    try {
        if (typeof cnorm === "function") {
            const __cn = cnorm;
            cnorm = function (this: any, s: any) {
                const r = __cn.apply(this, arguments as any);
                try {
                    if (typeof r === "string" && r && r !== String(s == null ? "" : s).trim()) {
                        const r2 = __cn.call(this, r);
                        if (typeof r2 === "string" && r2 && r2 !== r) { S.cnFix = (S.cnFix || 0) + 1; return r2; }
                    }
                } catch (e) { }
                return r;
            };
        }
    } catch (e) { }
    try {
        if (typeof v92goalReachHtml === "function") {
            const __rh = v92goalReachHtml;
            const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as any)[c]));
            v92goalReachHtml = function (this: any, pl: any) {
                let h = __rh.apply(this, arguments as any);
                try {
                    const l = String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja").slice(0, 2);
                    const SC = pl && pl.SC;
                    if (typeof h === "string" && (l === "zh" || l === "es") && SC && SC.lo && SC.mid && SC.hi) {
                        const f = (x: any) => (+x.pace || 0).toFixed(1);
                        const h0 = h;
                        if (l === "zh") h = h.replace(/联系节奏 每月 [\d.]+〜[\d.]+ 家：STANDAGE 记录中每月约见的买家数（中位数・前25%）。挑战节奏为其 2\.5 倍（展会＋每月AI买家开拓）/,
                            () => E(`联系节奏（每月约见的买家数・STANDAGE 记录）：保守 每月 ${f(SC.lo)} 家（中位数）・标准 每月 ${f(SC.mid)} 家（前25%）・挑战 每月 ${f(SC.hi)} 家（标准的 2.5 倍：展会＋每月AI买家开拓）。本页面的“标准”为每月 ${f(SC.mid)} 家`));
                        else h = h.replace(/Ritmo de contacto [\d.]+–[\d.]+ al mes: compradores vistos al mes en los registros de STANDAGE \(mediana y 25 % superior\)\. El ritmo exigente es 2,5 veces \(ferias \+ prospección IA mensual\)/,
                            () => E(`Ritmo de contacto (compradores vistos al mes, registros de STANDAGE): conservador ${f(SC.lo)} (mediana), estándar ${f(SC.mid)} (25 % superior), exigente ${f(SC.hi)} (2,5 veces el estándar: ferias + prospección IA mensual). El «estándar» de esta pantalla es ${f(SC.mid)} al mes`));
                        if (h !== h0) S.pace = (S.pace || 0) + 1;
                    }
                } catch (e) { }
                return h;
            };
        }
    } catch (e) { }

    /* ⑤⑥ 日本語以外の画面：描いたあとに整える */
    const lg = () => { try { return String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja").slice(0, 2); } catch (e) { return "ja"; } };
    const L3 = (en: string, zh: string, es: string) => { const l = lg(); return l === "zh" ? zh : l === "es" ? es : en; };
    const dict = (): any => { try { return (I18N.dict && I18N.dict[lg()]) || {}; } catch (e) { return {}; } };
    const KANA = /[ぁ-ゖァ-ヺ]/, JPC = /[ぁ-ゖァ-ヺ一-鿿]/;
    const okTr = (v: any) => typeof v === "string" && !!v && (lg() === "zh" ? !KANA.test(v) : !JPC.test(v));
    const ctyNm = (c: string) => { const v = dict()[c]; return okTr(v) ? v : c; };
    const par = (s: string) => lg() === "zh" ? "（" + s + "）" : " (" + s + ")";
    const UNIT: any = { "個": ["pcs", "个", "uds."], "本": ["bottles / pcs", "瓶・支", "botellas / piezas"], "袋": ["bags", "袋", "bolsas"], "箱": ["boxes", "盒", "cajas"], "ケース": ["cases", "箱（整箱）", "estuches"],
        "カートン": ["cartons", "纸箱", "cajas de cartón"], "セット": ["sets", "套", "juegos"], "台": ["units", "台", "unidades"], "枚": ["sheets", "张", "hojas"], "パック": ["packs", "包", "paquetes"] };
    const qtyTr = (s: string) => s.replace(/(\d[\d,.]*)\s*(個|本|袋|箱|ケース|カートン|セット|台|枚|パック)(?![ぁ-ゖァ-ヺ一-鿿])/g, (_a: string, q: string, u: string) => q + (lg() === "zh" ? "" : " ") + L3(UNIT[u][0], UNIT[u][1], UNIT[u][2]));
    const labelTr = (s: string) => {
        const seg = String(s).split("｜").map((x, i) => {
            if (i === 0) return x;
            let y = x.replace(/（([^（）]+)）/g, (a: string, c: string) => { const n = ctyNm(c); return n !== c ? par(n) : a; });
            const t = y.trim(); const n = ctyNm(t); if (n !== t) y = y.replace(t, n);
            y = qtyTr(y).replace(/＝/g, "=").replace(/×/g, "×");
            if (lg() !== "zh") y = y.replace(/・/g, " · ");
            return y;
        });
        return seg.join(lg() === "zh" ? "｜" : " | ");
    };
    const tidyTabs = (root: any) => {
        root.querySelectorAll('[data-onclick^="shipActivate("][data-r9a]').forEach((b: any) => {
            try {
                const sig = b.getAttribute("data-r9a") || "";
                if (b.getAttribute("data-r9x") === lg() + "|" + sig) return;
                const tn = Array.from(b.childNodes).find((x: any) => x.nodeType === 3 && JPC.test(String(x.nodeValue || ""))) as any;
                if (tn) { const v = String(tn.nodeValue); const m = v.match(/^(\s*)(.*?)( 📥)?\s*$/); if (m) { const t = labelTr(m[2]); if (t !== m[2]) tn.nodeValue = m[1] + t + (m[3] || ""); } }
                if (b.title && JPC.test(b.title)) b.title = labelTr(b.title);
                b.setAttribute("data-r9x", lg() + "|" + sig);
                S.tabs = (S.tabs || 0) + 1;
            } catch (e) { }
        });
    };
    const nmList = (s: string) => {
        // 「保証・品質の条件・産地」のように「・」を含む名前もあるので、辞書にある長い名前から当てる
        const d = dict(); const P = s.split("・"); const out: string[] = [];
        for (let i = 0; i < P.length;) {
            let hit = -1;
            for (let j = P.length; j > i; j--) { const k = P.slice(i, j).join("・"); if (okTr(d[k])) { out.push(d[k]); hit = j; break; } }
            if (hit < 0) { out.push(P[i]); i++; } else i = hit;
        }
        return out.join(lg() === "zh" ? "、" : ", ");
    };
    const swap = (nodes: any[], text: string) => {
        const sp = document.createElement("span");
        sp.setAttribute("data-noi18n", "1"); sp.setAttribute("data-r9x", "1");
        sp.textContent = text;
        nodes[0].parentNode.insertBefore(sp, nodes[0]);
        nodes.forEach((n: any) => { try { n.parentNode && n.parentNode.removeChild(n); } catch (e) { } });
        S.msg = (S.msg || 0) + 1;
    };
    const tidyMsgs = (root: any) => {
        const scr = (() => { const v = dict()["商品情報を登録"]; return okTr(v) ? v : L3("Register product info", "登记商品信息", "Registrar información del producto"); })();
        root.querySelectorAll("b").forEach((b: any) => {
            try {
                // 辞書の訳がすでに当たっていれば（「1項目」→「1 item」など）、元の文で見る
                const tn = b.firstChild;
                const t = String((tn && tn.nodeType === 3 && I18N.orig && I18N.orig.has(tn)) ? I18N.orig.get(tn) : (b.textContent || "")).trim();
                let m = t.match(/^足りないのは(\d+)項目$/);
                if (m && b.childElementCount === 0) {
                    const n = b.nextSibling;
                    const v = n && n.nodeType === 3 ? String(n.nodeValue) : "";
                    const m2 = v.match(/^（([\s\S]+?)( ほか)?）。\s*「商品情報を登録」の画面で、1問ずつ伺います。([\s\S]*)$/);
                    if (!m2) return;
                    const nm = nmList(m2[1].trim()) + (m2[2] ? L3(", etc.", "等", ", etc.") : "");
                    n.nodeValue = m2[3];   // 後ろに続く文（あれば）はそのまま辞書で訳される
                    swap([b], L3(`Missing: ${m[1]} item(s) (${nm}). We'll ask about them one question at a time on the “${scr}” screen.`,
                        `还缺 ${m[1]} 项（${nm}）。将在“${scr}”页面逐一询问。`,
                        `Faltan ${m[1]} campo(s) (${nm}). Se los preguntaremos uno a uno en la pantalla «${scr}».`));
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
                        p.nodeValue = pre; n.nodeValue = rest;
                        const sp = document.createElement("span");
                        sp.setAttribute("data-noi18n", "1"); sp.setAttribute("data-r9x", "1");
                        sp.textContent = L3("🤖 Once the AI engine is connected, the AI can re-read your file and run an additional interview.", "🤖 连接 AI 引擎后，AI 可重新读取资料并进行追加问答。", "🤖 Con el motor de IA conectado, la IA puede releer su archivo y hacer una entrevista adicional.");
                        b.parentNode.insertBefore(sp, b); b.parentNode.removeChild(b);
                        S.msg = (S.msg || 0) + 1;
                    }
                }
            } catch (e) { }
        });
    };
    const tidy = () => {
        try {
            if (lg() === "ja") return;
            const st = document.querySelector(".stage") || document.getElementById("well");
            if (!st) return;
            tidyTabs(st);
            tidyMsgs(st);
        } catch (e) { }
    };
    S.tidy = tidy;
    // ⑥ と同じ画面のボタン「AIと続きを埋める」（本体の文。英・中・西の訳が無い）。すでに訳があれば変えない
    try {
        const DI = (typeof I18N !== "undefined" && I18N && I18N.dict) || null;
        const T = { "AIと続きを埋める": ["Fill in the rest with AI", "与 AI 一起补齐剩余项目", "Completar el resto con la IA"] } as any;
        if (DI) Object.keys(T).forEach((k) => ["en", "zh", "es"].forEach((l, i) => { if (DI[l] && DI[l][k] == null) DI[l][k] = T[k][i]; }));
    } catch (e) { }

    /* ⑨ 数え方：消化率（小数） */
    try {
        if (typeof v90anaX === "function") {
            const __ax = v90anaX;
            const RE9 = /^数え方：消化率 ([\d.]+)%＝完了 (\d+)件÷全部 (\d+)件。右の「期限切れ・開始が遅れている・1週間以内・作業期間中」は、残り (\d+)件を期限で見たもので、未着手・対応中と重なります（足しても合いません）$/;
            v90anaX = function (this: any, ja: any, en: any) {
                const r = __ax.apply(this, arguments as any);
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
                } catch (e) { }
                return r;
            };
        }
    } catch (e) { }

    /* ⑦ 縮めた規則の名前の訳 */
    const GRP_JA = /（([^（）]*(?:（[^（）]*）[^（）]*)*)）/g;
    const cutTr = (orig: string, cut: string, tr: string, l: string): string | null => {
        // 元と縮めたあとで、中身が変わった括弧を1つ見つけ、残った区切りの番号を出す
        const go: string[] = [], gc: string[] = [];
        String(orig).replace(GRP_JA, (_a: string, i: string) => { go.push(i); return _a; });
        String(cut).replace(GRP_JA, (_a: string, i: string) => { gc.push(i); return _a; });
        if (!go.length || go.length !== gc.length) return null;
        let gi = -1;
        for (let i = 0; i < go.length; i++) if (go[i] !== gc[i]) { if (gi >= 0) return null; gi = i; }
        if (gi < 0) return null;
        const P = go[gi].split("、"), Q = gc[gi].split("、");
        const keep = Q.map((q) => P.indexOf(q));
        if (keep.some((k) => k < 0)) return null;
        // 訳の側：中は「（…，…）」、英・西は「(…; …)」。同じ並びの括弧のうち、区切りの数が元と同じものを使う
        const sep = l === "zh" ? /，|、/ : /; /;
        const joinS = l === "zh" ? "，" : "; ";
        const re = l === "zh" ? /（((?:[^（）]|（[^（）]*）)*)）/g : /\(((?:[^()]|\([^()]*\))*)\)/g;   // 中に1段の括弧（CoA など）があってもよい
        let done = false;
        const out = String(tr).replace(re, (a: string, inner: string) => {
            if (done) return a;
            const T = inner.split(sep);
            if (T.length !== P.length) return a;
            done = true;
            const x = keep.map((k) => T[k]).join(joinS);
            return l === "zh" ? "（" + x + "）" : "(" + x + ")";
        });
        return done && out !== tr ? out : null;
    };
    try {
        if (typeof v85docJudge === "function") {
            const __jd2 = v85docJudge;
            v85docJudge = function (this: any) {
                const J = __jd2.apply(this, arguments as any);
                try {
                    const R: any[] = (typeof V85DOC_D !== "undefined" && V85DOC_D && Array.isArray(V85DOC_D.rules)) ? V85DOC_D.rules : [];
                    const DI = (typeof I18N !== "undefined" && I18N && I18N.dict) || null;
                    if (!R.length || !DI) return J;
                    Object.keys((J && J.rows) || {}).forEach((k) => {
                        ((J.rows[k] && J.rows[k].why) || []).forEach((w: any) => {
                            if (!w || !w.id || !w.c) return;
                            const r = R.find((x: any) => x && x.id === w.id);
                            if (!r || !r.c || r.c === w.c) return;
                            ["en", "zh", "es"].forEach((l) => {
                                const D = DI[l];
                                if (!D || D[w.c] != null || typeof D[r.c] !== "string") return;
                                const t = cutTr(r.c, w.c, D[r.c], l);
                                if (t) { D[w.c] = t; S.rule = (S.rule || 0) + 1; }
                            });
                        });
                    });
                } catch (e) { }
                return J;
            };
        }
    } catch (e) { }
    try {
        if (typeof render === "function") {
            const __rn = render;
            render = function (this: any) {
                const r = __rn.apply(this, arguments as any);
                try { if (lg() !== "ja") [90, 450, 1300].forEach((ms) => setTimeout(tidy, ms)); } catch (e) { }
                return r;
            };
        }
    } catch (e) { }
})();
