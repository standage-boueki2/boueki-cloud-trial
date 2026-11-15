/* 21.92 up：商品情報を登録・AIヒアリング・はじめての窓・登録メニューの直し（2026-11-14 8カテゴリー×ペルソナ評価）。本体の層（今の版・刷新版の両方に効く）
   共通の層（logic_v2192per・logic_v2192cat）で済んだ分（答える欄へ送る・取引条件はインコタームズだけ・強み／建値／仕出港の読み取り・登録メニューを閉じたあとの表示）には重ねない。
   A. AI ヒアリングの答えの確かめ（auto-04・culture-02・medical-02・other-05・indagri-21）
      ・支払条件・仕出港・MOQ・リードタイム・入数・産地・期限・商材カテゴリーに、項目に合わない文（「日本」など）を送っても「登録しました」になっていた
        → 登録せず、何を答えればよいかを言って聞き直す（別の項目の答えに見えるときは、その項目に入れるかを選べる）
      ・文末の「です」まで値に入っていた（カテゴリー「建設機械（油圧ショベル）です」）→ 外してから登録。選択肢と同じ言葉なら選択肢に寄せる
      ・共通の層の確かめで、選択肢の「まだ決めていない」（取引条件）まで弾かれていた → 今までどおり登録できるように
      ・登録のたびに「何を・どの項目に」入れたかを見せ、「この答えを直す」でその場で直せる
      ・データ健全性チェックに、取引条件・支払条件・仕出港の形の確かめを足す
   B. 読み取った直後、同じ商品が「未反映（すべて登録する）」と「登録済みの商品」の両方に出て、確認が2か所（auto-14・daily-07・food-08・health-05・other-11）
      → 1商品だけの資料は、読み取った内容をそのまま商品情報に入れる（確認は出さない。入れたくないときは会話の「入れずに元に戻す」）
   C. 読み取り（auto-06・culture-11）：値の中のカンマ（4,800h）や、かっこの中の「＝」で行を割らない／建機などに「カートン」を付けない／資料の所在地を産地の候補にする
   D. 登録済みの商品カードの「✎ 商品名・会社名を編集」と「☆」が重なり、✎ を押すと ☆ が付く（auto-05・other-06）→ 並べて置く
   E. 商品が登録済みなら、はじめましての窓も登録メニューも自動では出さない（auto-13・culture-04）。はじめての方は窓を1枚に（health-11）。Esc で閉じる（indagri-20）
      ホーム「はじめの設定 次：足りない情報を埋める」・登録メニューから、質問の欄へ直接（other-07・indagri-12・culture-03）
   F. ヒアリングの質問・例を商材に合わせる（auto-08・daily-17・medical-11）。仕出港に地元の港（other-12）。同じ文が2回（culture-19）。件数の言い方（indagri-21）
   今のアプリの関数は包むだけ（中身は変えない） */
declare const TEN: any, TENS: any, FILL: any, NEED: any, V1811: any, SES: any, I18N: any, KNOWN_CTY: any, V54U: any;
declare let fillStart: any, fillRender: any, fillCommit: any, fillAnswer: any, fillSay: any, applyAnswer: any, render: any, cur: any;
declare let v54hearAsk: any, v68hearTxOf: any, v54upldComp: any, v68hearCompParse: any, v68pSplitLV: any, v54upldDims: any, productTableToFields: any, runParseReal: any, adoptReal: any;
declare let tenHealth: any, dk15UpOk: any, v1811Maybe: any, v1811Open: any, v1811Act: any, v1811Manual: any, showWelcome: any, t30DecorateProducts: any, ux32Fill: any;
declare let v54upldGot: any, v54upldGotLabel: any, v79pIndSave: any, buildSummary: any;
declare function scoreOf(t: any): any;
declare function syncTenant(): void;
declare function saveTen(): void;
declare function toast(m: string): void;
declare function go(id: string): void;
declare function esc(s: any): string;
declare function v68hearNeed(nx: any, p: any): any;
declare function v188ApplyAll(mode: string): number;
declare function skipCurrent(note?: string): void;
declare function tenLeadIsTime(v: any): boolean;
declare function ux25ToSamples(): void;
declare function v1812ToDrop(): void;
declare function fillNext(): void;
declare function v1811Close(): void;
(function () {
    const W: any = window;
    if (W.__v2192up)
        return;
    W.__v2192up = 1;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]);
    const lang = () => { try {
        const el = document.getElementById("lang") as any;
        const v = String((el && el.value) || "ja");
        return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
    }
    catch (e) {
        return "ja";
    } };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const say = (m: string) => { try {
        if (typeof toast === "function")
            toast(m);
    }
    catch (e) { } };
    const Nf = (v: any) => { let x = String(v == null ? "" : v); try {
        x = x.normalize("NFKC");
    }
    catch (e) { } return x.replace(/\s+/g, " ").trim(); };
    const hasV = (v: any) => Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim());
    const ten = () => { try {
        return (typeof TEN !== "undefined" && TEN) ? TEN : null;
    }
    catch (e) {
        return null;
    } };
    const fill = () => { try {
        return (typeof FILL !== "undefined" && FILL) ? FILL : null;
    }
    catch (e) {
        return null;
    } };
    const need = (k: string) => { try {
        return (typeof NEED !== "undefined" && Array.isArray(NEED)) ? (NEED.find((n: any) => n && n.k === k) || null) : null;
    }
    catch (e) {
        return null;
    } };
    const needOf = (k: string, t?: any) => { const n0 = need(k); if (!n0)
        return null; try {
        return typeof v68hearNeed === "function" ? (v68hearNeed(n0, t || ten()) || n0) : n0;
    }
    catch (e) {
        return n0;
    } };
    const plain = (h: any) => String(h == null ? "" : h).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    /* 項目の名前などを、いまの言語の辞書にあれば言い換える（無ければそのまま） */
    const Tn = (s0: any) => { const s = String(s0 == null ? "" : s0); try {
        const l = lang();
        if (l !== "ja" && typeof I18N !== "undefined" && I18N && I18N.dict && I18N.dict[l] && I18N.dict[l][s])
            return String(I18N.dict[l][s]);
    }
    catch (e) { } return s; };
    const V: any = { at: 0, force: 0, auto: 0 };

    /* ───── 見た目（本体の層なので、ここで足す） ───── */
    try {
        if (!document.getElementById("v92upcss")) {
            const st = document.createElement("style");
            st.id = "v92upcss";
            st.textContent =
                /* D. ✎ と ☆ を並べる（☆ は右上の角・✎ はその左）。商品名は2つのボタンの下に入り込まない */
                "#regprod .smp.regc .regedit{right:36px;top:4px;min-width:26px;min-height:24px;display:inline-flex;align-items:center;justify-content:center;z-index:2;box-sizing:border-box}" +
                    "#regprod .smp.regc .b30star.t30ps{z-index:2;min-width:26px;min-height:24px}" +
                    "#regprod .smp.regc > b{padding-right:62px}" +
                    /* A. 登録した内容と「この答えを直す」 */
                    ".v92upreg{margin-top:7px;padding-top:6px;border-top:1px dashed var(--line-2,#e6e9ee);font-size:11.5px;line-height:1.7;color:var(--ink-2,#44546a);display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center}" +
                    ".v92upreg b{color:var(--ink,#1b2a3a);overflow-wrap:anywhere}" +
                    ".v92upfix{border:1px solid var(--line,#d5dbe3);background:var(--surface,#fff);color:var(--bl,#0064bf);border-radius:999px;padding:2px 10px;font:inherit;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap}" +
                    ".v92upfix:hover,.v92upfix:focus-visible{border-color:var(--bl,#0064bf);background:var(--bl-soft,#eaf3fc)}" +
                    ".v92upundo{margin-top:8px;font-size:11.5px;line-height:1.75;color:var(--ink-2,#44546a)}" +
                    ".v92upundo button{margin-left:4px}" +
                    /* E. はじめての窓の、資料が無いときの入口 */
                    ".v92upwel{margin-top:12px;padding-top:11px;border-top:1px dashed var(--line,#d5dbe3);display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:12px;color:var(--ink-2,#44546a)}" +
                    ".v92upwel .btn{padding:6px 13px}" +
                    /* 小さい画面では、はじめての窓の中を上下に送れるようにする（下のボタンが切れない） */
                    "#welv .wc{max-height:calc(100vh - 36px);max-height:calc(100dvh - 36px);overflow-y:auto}";
            (document.head || document.documentElement).appendChild(st);
        }
    }
    catch (e) { }

    /* ═════════ A. AI ヒアリングの答えの確かめ ═════════ */
    const INCO = /(?:^|[^A-Za-z])(EXW|FCA|FAS|FOB|CFR|CIF|CPT|CIP|DAP|DPU|DDP|C&F|CNF)(?![A-Za-z])/i;
    const INCO_JA = /工場渡し|本船渡し|運賃込み|運賃保険料込み|仕向地持込|関税込み持込/;
    const UNDEC = /^(?:まだ)?(?:決めていない|決めてない|決まっていない|決まってない|未定|未決定|検討中|これから(?:決め(?:る|ます))?|相談(?:中)?|応相談|要相談|TBD|undecided|not decided(?: yet)?)(?:です)?$/i;
    const PAY = /T\s*\/?\s*T(?![a-z])|L\s*\/?\s*C(?![a-z])|D\s*\/?\s*[PA](?![a-z])|O\s*\/\s*A|\bCAD\b|前払|先払|前金|後払|送金|振込|信用状|掛け|月末|締め|翌月|現金|代引|クレジット|カード|paypal|ペイパル|出荷前|出荷後|船積前|船積後|到着後|着荷後|受領後|納品後|入金|着金|決済|手形|小切手|振替|分割|一括|掛売|売掛|請求書|\d+\s*日|\d+\s*%|％|net\s*\d|advance|deposit|prepay|wire|transfer|remit|letter of credit|open account|cash|invoice/i;
    const PORTS = ["横浜", "東京", "川崎", "千葉", "名古屋", "四日市", "清水", "御前崎", "大阪", "神戸", "堺泉北", "姫路", "和歌山下津", "博多", "門司", "北九州", "下関", "苫小牧", "小樽", "石狩湾新", "室蘭", "函館", "八戸", "仙台塩釜", "仙台", "秋田", "酒田", "小名浜", "新潟", "直江津", "伏木富山", "金沢", "敦賀", "舞鶴", "境", "浜田", "水島", "広島", "福山", "徳山下松", "高松", "松山", "今治", "高知", "徳島小松島", "伊万里", "長崎", "熊本", "八代", "大分", "細島", "志布志", "鹿児島", "那覇", "茨城", "常陸那珂", "鹿島", "三河", "釜石"];
    const AIRPORTS = ["成田", "羽田", "関西", "関空", "中部", "セントレア", "新千歳", "那覇", "仙台", "広島", "小松"];
    const PORT_RE = /港|空港|埠頭|ふ頭|ターミナル|\bport\b|airport|\bCY\b|\bCFS\b|工場|倉庫|ヤード|デポ/i;
    const PORTS_EN = /\b(?:yokohama|tokyo|kawasaki|chiba|nagoya|yokkaichi|shimizu|osaka|kobe|hakata|moji|kitakyushu|shimonoseki|tomakomai|sendai|niigata|hiroshima|naha|narita|haneda|kansai|chubu|centrair|fukuoka|kix|nrt|hnd|ngo)\b/i;
    /* 都道府県 → 近い港・空港の候補（貿易の貨物を扱う主な港。どの港を使うかは、物流会社と決める） */
    const PREF_PORTS: any = { "北海道": ["苫小牧港", "石狩湾新港", "新千歳空港"], "青森県": ["八戸港"], "岩手県": ["釜石港", "仙台塩釜港"], "宮城県": ["仙台塩釜港", "仙台空港"], "秋田県": ["秋田港"], "山形県": ["酒田港"], "福島県": ["小名浜港"],
        "茨城県": ["茨城港（常陸那珂）", "鹿島港", "成田空港"], "栃木県": ["東京港", "横浜港", "成田空港"], "群馬県": ["東京港", "横浜港", "成田空港"], "埼玉県": ["東京港", "横浜港", "成田空港"], "千葉県": ["千葉港", "東京港", "成田空港"], "東京都": ["東京港", "横浜港", "羽田空港", "成田空港"], "神奈川県": ["横浜港", "川崎港", "羽田空港"],
        "新潟県": ["新潟港", "直江津港"], "富山県": ["伏木富山港"], "石川県": ["金沢港"], "福井県": ["敦賀港"], "山梨県": ["東京港", "横浜港", "清水港"], "長野県": ["名古屋港", "横浜港", "東京港"], "岐阜県": ["名古屋港", "中部国際空港"], "静岡県": ["清水港", "御前崎港"], "愛知県": ["名古屋港", "三河港", "中部国際空港"], "三重県": ["四日市港", "名古屋港"],
        "滋賀県": ["大阪港", "神戸港", "名古屋港"], "京都府": ["舞鶴港", "大阪港", "神戸港", "関西空港"], "大阪府": ["大阪港", "堺泉北港", "関西空港"], "兵庫県": ["神戸港", "姫路港"], "奈良県": ["大阪港", "神戸港", "関西空港"], "和歌山県": ["和歌山下津港", "大阪港"],
        "鳥取県": ["境港"], "島根県": ["浜田港", "境港"], "岡山県": ["水島港", "神戸港"], "広島県": ["広島港", "福山港"], "山口県": ["下関港", "徳山下松港"], "徳島県": ["徳島小松島港", "神戸港"], "香川県": ["高松港", "神戸港"], "愛媛県": ["松山港", "今治港"], "高知県": ["高知港"],
        "福岡県": ["博多港", "門司港", "福岡空港"], "佐賀県": ["伊万里港", "博多港"], "長崎県": ["長崎港", "博多港"], "熊本県": ["熊本港", "八代港"], "大分県": ["大分港"], "宮崎県": ["細島港"], "鹿児島県": ["志布志港", "鹿児島港"], "沖縄県": ["那覇港", "那覇空港"] };
    const prefOf = (s: any) => { const m = Nf(s).match(/北海道|東京都|京都府|大阪府|[^\s、,（(]{2,3}県/); return m && PREF_PORTS[m[0]] ? m[0] : ""; };
    function docAddr(t: any) {
        if (!t)
            return "";
        if (t.v92addr)
            return String(t.v92addr);
        try {
            const txt = (Array.isArray(t.sources) ? t.sources : []).map((x: any) => String((x && x.txt) || "")).join("\n").slice(0, 24000);
            const m = txt.match(/(?:^|\n)\s*(?:本社所在地|会社所在地|所在地|本社住所|会社住所|住所)\s*[|｜:：\t]\s*([^\n|｜]{4,80})/);
            if (m && prefOf(m[1]))
                return m[1].trim();
        }
        catch (e) { }
        return "";
    }
    /* 住所 → 「長野県松本市」 */
    function placeOf(addr: any) {
        const a = Nf(addr), pf = prefOf(a);
        if (!pf)
            return "";
        const rest = a.slice(a.indexOf(pf) + pf.length).trim();
        const m = rest.match(/^(.{1,8}?市)(?!市)/) || rest.match(/^(.{1,6}?区)/) || rest.match(/^(.{1,6}?郡.{1,6}?[町村])/) || rest.match(/^(.{1,8}?[町村])/);
        return pf + (m ? m[1] : "");
    }
    function localPorts(t: any) {
        const pf = prefOf(docAddr(t)) || prefOf(t && t.origin) || prefOf(t && t.deckMeta && t.deckMeta.addr);
        return pf ? { pref: pf, ports: (PREF_PORTS[pf] || []).slice() } : null;
    }
    function polChips(t: any, base: any) {
        const b = Array.isArray(base) ? base.slice() : [];
        const lp = localPorts(t);
        if (!lp)
            return b;
        const out = lp.ports.slice();
        b.forEach((c: string) => { if (out.indexOf(c) < 0)
            out.push(c); });
        return out.slice(0, 9);
    }
    W.v92upPolChips = (base: any) => polChips(ten(), base);
    /* 文末の「です」など（短い答えだけ） */
    function stripPolite(v: any) {
        let s = String(v == null ? "" : v).trim();
        if (!s || s.length > 80)
            return s;
        for (let i = 0; i < 3; i++) {
            const t = s.replace(/[。．.！!]+$/, "").replace(/\s*(?:です|でございます|になります|となります|だと思います|かと思います|と思います|でした|ですね|ですよ)$/, "").trim();
            if (t === s || !t)
                break;
            s = t;
        }
        return s;
    }
    const termOk = (v: any) => { const s = Nf(v); return !s || INCO.test(s) || INCO_JA.test(s) || UNDEC.test(s) || /未定|まだ決めていない/.test(s); };
    const payOk = (v: any) => { const s = Nf(v); return !s || PAY.test(s) || UNDEC.test(s) || /未定|まだ決めていない/.test(s); };
    function polNorm(v: any) {
        let s = Nf(stripPolite(v)).replace(/^(?:日本[のの・,、 ]*)/, "").trim();
        if (!s)
            return "";
        const bare = s.replace(/(から|より|発|出し|積み|で)$/, "").trim();
        if (PORT_RE.test(s))
            return s;
        if (/^[A-Za-z0-9 .,'()\-\/]+$/.test(s) && PORTS_EN.test(s) && s.length <= 40)
            return s;
        if (AIRPORTS.indexOf(bare) >= 0 && PORTS.indexOf(bare) < 0)
            return (bare === "関空" ? "関西" : bare === "セントレア" ? "中部国際" : bare) + "空港";
        if (PORTS.indexOf(bare) >= 0)
            return bare + "港";
        return "";
    }
    const polOk = (v: any) => { const s = Nf(v); return !s || !!polNorm(s); };
    const PLACE = /[都道府県市区町村郡]|日本|国産|国内|Japan|中国|台湾|韓国|ベトナム|タイ|インドネシア|マレーシア|フィリピン|インド|アメリカ|米国|ドイツ|フランス|イタリア|イギリス|英国|スペイン|オーストラリア|カナダ|メキシコ|ブラジル|トルコ|バングラデシュ|カンボジア|ミャンマー|工場|産$/i;
    const PLACE_EN = /\b(?:made in|japan|china|taiwan|korea|vietnam|thailand|indonesia|malaysia|philippines|india|usa|u\.s\.a?\.?|united states|america|germany|france|italy|uk|united kingdom|britain|spain|australia|canada|mexico|brazil|turkey|bangladesh|cambodia|myanmar|prefecture|province|city|county|pref\.)\b|[A-Za-z]{3,}\s*,\s*[A-Za-z]{3,}/i;
    const FIELD_NM: any = { term: ["取引条件", "trade terms"], pay: ["支払条件", "payment terms"], pol: ["仕出港", "port of loading"], origin: ["産地・製造国", "origin"] };
    /* ほかの項目の答えに見えるか（まだ入っていない項目だけ） */
    function altField(k: string, vs: string, t: any) {
        const s = Nf(vs);
        if (!s || s.length > 40 || !t)
            return "";
        const free = (f: string) => f !== k && !hasV(t[f]);
        if (free("term") && INCO.test(s) && s.length <= 24)
            return "term";
        if (free("pay") && /T\s*\/?\s*T|L\s*\/?\s*C|前払|後払|信用状/i.test(s))
            return "pay";
        if (free("pol") && polNorm(s))
            return "pol";
        if (free("origin") && /[都道府県市]|日本|国産|Japan/i.test(s) && !PORT_RE.test(s) && !INCO.test(s) && !/\d{3,}/.test(s))
            return "origin";
        return "";
    }
    /* 答えの確かめ。{ ok } ／ { ok:false, msg, chips, noForce } ／ { skip:true }（「未定」＝あとで） */
    function check(cu: any, raw: string, t: any) {
        const k = String(cu && cu.k || ""), s = Nf(stripPolite(raw));
        const ex = String((cu && cu.ex) || "").replace(/^例[:：]\s*/, "");
        const exT = ex ? M(`（例：${ex}）`, ` (e.g. ${ex})`) : "";
        const later = M("分からなければ「わからない（あとで）」で飛ばせます。", "If you are not sure, press “I don't know (later)”.");
        const undec = UNDEC.test(s);
        const other = (re: RegExp) => re.test(s);
        switch (k) {
            case "term":
                if (termOk(s))
                    return { ok: true };
                return { ok: false, noForce: 1, msg: M(`取引条件（インコタームズ）は、<b>FOB・CIF・DDP・EXW</b> などの条件で答えてください（例：FOB、FOB 横浜）。下の選択肢を押しても登録できます。決まっていなければ「まだ決めていない」を選んでください。`,
                        `Please answer the trade terms with an Incoterm such as <b>FOB, CIF, DDP or EXW</b> (e.g. FOB, FOB Yokohama). You can also press one of the choices below. If undecided, choose “Not decided yet”.`) };
            case "pay":
                if (payOk(s))
                    return { ok: true };
                return { ok: false, msg: M(`支払条件は、<b>代金の受け取り方</b>で答えてください（例：T/T 前払い、L/C、T/T 30日）。下の選択肢を押しても登録できます。決まっていなければ「まだ決めていない」を選んでください。`,
                        `Please answer the payment terms with <b>how you receive payment</b> (e.g. T/T in advance, L/C, T/T 30 days). You can also press one of the choices below. If undecided, choose “Not decided yet”.`) };
            case "pol": {
                if (undec)
                    return { skip: true };
                if (polNorm(s))
                    return { ok: true };
                const pf = prefOf(s) || (s.length <= 4 ? prefOf(s + "県") : ""), cand = pf ? PREF_PORTS[pf] : null;
                return { ok: false, chips: cand || undefined, msg: cand
                        ? M(`仕出港は、<b>荷物を積み出す港・空港の名前</b>で答えてください。${E(pf)}からは、下の港・空港がよく使われます（どの港を使うかは、物流会社と決めます）。`, `Please answer with the <b>name of the port or airport</b> the goods leave from. From ${E(pf)}, the ports below are commonly used (your forwarder decides the actual port).`)
                        : M(`仕出港は、<b>荷物を積み出す港・空港の名前</b>で答えてください（例：横浜港、博多港、成田空港）。下の選択肢を押しても登録できます。${later}`, `Please answer with the <b>name of the port or airport</b> the goods leave from (e.g. Yokohama Port, Hakata Port, Narita Airport). You can also press a choice below. ${later}`) };
            }
            case "origin":
                if (undec)
                    return { skip: true };
                if ((other(INCO) && s.length <= 24) || /^\d[\d,.\s]*$/.test(s) || !(PLACE.test(s) || PLACE_EN.test(s)))
                    return { ok: false, msg: M(`産地・製造国は、<b>つくっている場所（国・都道府県・市区町村）</b>で答えてください（例：日本（静岡県掛川市））。${later}`, `Please answer the origin with <b>where the product is made (country, prefecture, city)</b> (e.g. Japan (Kakegawa, Shizuoka)). ${later}`) };
                return { ok: true };
            case "moq":
                if (/応相談|要相談/.test(s))
                    return { ok: true };
                if (undec)
                    return { skip: true };
                if (/^[\d,.]+$/.test(s) || /\d\s*(?:個|本|台|枚|箱|セット|ケース|袋|缶|瓶|着|足|組|点|脚|冊|巻|kg|g|t|トン|L|ml|m|pcs|pc|units?|sets?|cases?|cartons?|ロット|パレット|コンテナ|から|〜|～|以上)/i.test(s) || /[一二三四五六七八九十百千万]\s*(?:個|本|台|枚|箱|セット|ケース|袋|缶|着|kg|トン)/.test(s) || /制限なし|なし|無し|いくつでも|ひとつから/.test(s))
                    return { ok: true };
                return { ok: false, msg: M(`最小発注数量（MOQ）は、<b>数量</b>で答えてください${exT}。決まっていなければ「応相談」でも大丈夫です。${later}`, `Please answer the MOQ as a <b>quantity</b>${exT}. “Negotiable” is also fine. ${later}`) };
            case "lead": {
                if (undec)
                    return { skip: true };
                const ok = /\d\s*(?:日|週|か月|ヶ月|カ月|ケ月|箇月|月|年|営業日|時間|days?|weeks?|wks?|months?)/i.test(s) || /即納|即日|翌日|当日|随時|在庫|受注生産|[一二三四五六七八九十]\s*(?:日|週|か月|ヶ月|カ月)/.test(s);
                if (ok)
                    return { ok: true };
                return { ok: false, msg: M(`リードタイムは、<b>受注から出荷までの日数</b>で答えてください${exT}。在庫があれば「在庫あり・即納」でも大丈夫です。${later}`, `Please answer the lead time as the <b>number of days from order to shipment</b>${exT}. “In stock” is also fine. ${later}`) };
            }
            case "ctn":
                if (undec)
                    return { skip: true };
                if (/\d\s*(?:ケース|箱|カートン|パレット|個|本|枚|袋|缶|瓶|台|セット|段|着|c\/s|cs(?![a-z])|ctn|plt|pcs|ft|フィート)/i.test(s) || /ケース|パレット|カートン|コンテナ|バラ|積み|RORO|ローロー|フラットラック|自走|なし|無し|該当なし|不要|使わない/i.test(s))
                    return { ok: true };
                return { ok: false, msg: M(`${E(plain(cu.n))}は、<b>数や積み方</b>で答えてください${exT}。パレットを使わないときは「なし」で大丈夫です。`, `Please answer with <b>quantities or how the goods are loaded</b>${exT}. If you do not use pallets, “none” is fine.`) };
            case "shelf":
                if (undec)
                    return { skip: true };
                if (/\d/.test(s) || /期限|保証|なし|無し|該当|無期限|現状渡し|年|か月|ヶ月|カ月|常温|冷蔵|冷凍|賞味|消費|使用|交換|返品|[—\-－ー]$/.test(s))
                    return { ok: true };
                return { ok: false, msg: M(`${E(plain(cu.n))}は、<b>期間や条件</b>で答えてください${exT}。無ければ「なし」で大丈夫です。`, `Please answer with a <b>period or condition</b>${exT}. If there is none, “none” is fine.`) };
            case "cat": {
                const chips = (need("cat") || {}).chips || [];
                const head = s.replace(/[（(][^（）()]*[）)]/g, "").trim();
                if (chips.indexOf(s) >= 0 || chips.indexOf(head) >= 0)
                    return { ok: true };
                if ((other(INCO) && s.length <= 24) || (PAY.test(s) && /T\s*\/?\s*T|L\s*\/?\s*C/i.test(s)) || /^\d[\d,.\s]*$/.test(s) || s.length > 40)
                    return { ok: false, noForce: 1, msg: M(`商材カテゴリは、<b>下の選択肢から近いもの</b>を選んでください。当てはまるものが無いときは「その他」を選ぶか、商材の種類を短く書いてください（例：釣具、楽器）。`, `Please choose the <b>closest product category below</b>. If nothing fits, choose “Other” or type the kind of product briefly (e.g. fishing tackle).`) };
                return { ok: true };
            }
            default:
                return { ok: true };
        }
    }
    W.v92upCheck = (k: string, v: string) => check(needOf(k) || { k }, v, ten());
    function reask(cu: any, vs: string, c: any) {
        const F = fill(), t = ten();
        if (!F)
            return;
        const cnt = (cu._v92bad && cu._v92bad.n || 0) + 1;
        const base = (needOf(String(cu.k), t) || cu);
        let chips: string[] = (c.chips || cu._v92chips0 || cu.chips || base.chips || []).filter((x: string) => !/^「.*」を.*に登録する$/.test(x) && x !== FORCE());
        const alt = altField(String(cu.k), vs, t);
        const short = vs.length > 18 ? vs.slice(0, 18) + "…" : vs;
        let altChip = "";
        if (alt) {
            altChip = M(`「${short}」を${FIELD_NM[alt][0]}に登録する`, `Register “${short}” as ${FIELD_NM[alt][1]}`);
            chips = [altChip].concat(chips);
        }
        const allowForce = !c.noForce && (cnt >= 2 || !(base.chips && base.chips.length));
        if (allowForce)
            chips = chips.concat([FORCE()]);
        const cu2 = Object.assign({}, cu, { chips: chips.length ? chips : null, multi: 0, _v92bad: { v: vs, n: cnt }, _v92alt: alt ? { k: alt, v: vs, chip: altChip } : null, _v92chips0: cu._v92chips0 || cu.chips || null });
        F.cur = cu2;
        F.sel = [];
        const head = M(`「${E(short)}」は、<b>${E(plain(cu.n))}</b>の答えとして読み取れなかったため、登録していません。`, `“${E(short)}” could not be read as an answer for <b>${E(Tn(plain(cu.n)))}</b>, so it was not registered.`);
        const altNote = alt ? M(`<br>${E(FIELD_NM[alt][0])}の答えでしたら、下の「${E(altChip)}」を押してください。`, `<br>If this is your ${E(FIELD_NM[alt][1])}, press “${E(altChip)}” below.`) : "";
        const forceNote = allowForce ? M(`<br><span style="font-size:11px;color:var(--ink-3)">この内容のまま登録したいときは「${E(FORCE())}」を押してください。</span>`, `<br><span style="font-size:11px;color:var(--ink-3)">To register it as it is, press “${E(FORCE())}”.</span>`) : "";
        try {
            fillSay("ai", `<span data-noi18n>${head}<br>${c.msg}${altNote}${forceNote}</span>`, { ask: cu2 });
        }
        catch (e) { }
        try {
            render();
        }
        catch (e) { }
    }
    const FORCE = () => M("このまま登録する", "Register as it is");

    /* 登録の直前（applyAnswer）：
       ・値をととのえる（文末の「です」・選択肢への寄せ・港の名前・桁区切りのカンマ）
       ・ヒアリングの答えで、いま聞いている項目に合わないものは登録しない（false を返し、下の後始末で聞き直す）
       今の版の会話は、AI が未接続のとき fillCommit を通らず applyAnswer を直接呼ぶため、確かめはここに置く */
    V.hear = 0;
    V.rej = null;
    if (typeof applyAnswer === "function") {
        const __aa92u = applyAnswer;
        applyAnswer = function (this: any, t: any, k: any, raw: any) {
            let v: any = raw, undecTerm = "", ph = false;
            try {
                const s0 = String(raw == null ? "" : raw);
                // 確かめ（ヒアリングの答え・いまの質問の項目だけ）
                const F = fill(), cu = F ? F.cur : null;
                if (V.hear > 0 && !V.force && t && t === ten() && cu && !cu.x && cu.k === k && need(String(k)) && s0.trim()) {
                    const vs = s0.trim();
                    const hit = !!(cu.chips && cu.chips.indexOf(vs) >= 0 && !cu._v92bad);
                    if (!hit) {
                        const c: any = check(cu, vs, t);
                        if (c.skip || c.ok === false) {
                            V.rej = { cu, vs, c, n: (F && Array.isArray(F.log)) ? F.log.length : -1 };
                            return false;
                        }
                    }
                }
                if (t && typeof k === "string" && /^(co|item|cat|sku|moq|lead|ctn|cert|origin|term|pay|pol|shelf)$/.test(k) && s0.trim().length <= 80)
                    v = stripPolite(s0);
                if (k === "term") {
                    const s = Nf(v);
                    // 共通の層の確かめは「未定」は通すが、選択肢の「まだ決めていない」は弾く → いったん「未定」で通し、あとで元の言葉に戻す
                    if (s && !INCO.test(s) && !INCO_JA.test(s) && !/未定|わからない|分からない|不明|相談|あとで/.test(s) && UNDEC.test(s)) {
                        undecTerm = String(v);
                        v = "未定";
                    }
                    else {
                        const m = s.match(INCO);
                        if (m && s.length <= 40)
                            v = s.replace(m[1], m[1].toUpperCase().replace(/^(C&F|CNF)$/, "CFR"));
                    }
                }
                else if (k === "cat") {
                    const chips = (need("cat") || {}).chips || [];
                    const s = Nf(v), head = s.replace(/[（(][^（）()]*[）)]/g, "").trim();
                    if (chips.indexOf(s) < 0 && head && head !== s && chips.indexOf(head) >= 0) {
                        v = head;
                        try {
                            t.catRaw = s.slice(0, 40);
                        }
                        catch (e) { }
                    }
                }
                else if (k === "pol") {
                    const p = polNorm(v);
                    if (p && Nf(v).length <= 24)
                        v = p;
                }
                else if (k === "compRows") {
                    const p = protect(String(v));
                    ph = p !== String(v);
                    v = p;
                }
                else if (k === "dimRows")
                    v = dimNorm(String(v));
            }
            catch (e) {
                v = raw;
            }
            const a = [].slice.call(arguments) as any[];
            a[2] = v;
            const r = __aa92u.apply(this, a);
            try {
                if (r && undecTerm && t && t.term === "未定")
                    t.term = undecTerm;
                if (ph && t)
                    unprotectTen(t);
            }
            catch (e) { }
            return r;
        };
    }

    /* 答えの前後：登録しなかったときは聞き直す。登録したときは、何を・どの項目に入れたかを残す */
    const TABLE: any = { priceRows: 1, dimRows: 1, compRows: 1, strengths: 1, targets: 1 };
    function preview(t: any, k: string) {
        const v = t ? t[k] : "";
        if (Array.isArray(v)) {
            if (k === "strengths")
                return v.slice(0, 3).map((x: any) => String(Array.isArray(x) ? x[0] : x)).join("／") + (v.length > 3 ? M(` ほか${v.length - 3}件`, ` +${v.length - 3}`) : "");
            if (k === "targets")
                return v.join("・");
            return v.slice(0, 2).map((r: any) => (Array.isArray(r) ? r : [r]).filter((c: any) => String(c == null ? "" : c).trim()).join(" ")).join("／") + (v.length > 2 ? M(` ほか${v.length - 2}行`, ` +${v.length - 2} rows`) : "");
        }
        const s = String(v == null ? "" : v);
        return s.length > 70 ? s.slice(0, 70) + "…" : s;
    }
    function enter() {
        const F = fill(), t = ten(), cu = F ? F.cur : null, k = String(cu && cu.k || "");
        const isNeed = !!(cu && !cu.x && k && !/^_/.test(k) && need(k));
        V.hear++;
        V.at = Date.now();
        return { t, cu, k, isNeed, n0: (F && Array.isArray(F.log)) ? F.log.length : 0, had: isNeed && t ? JSON.stringify(t[k] == null ? "" : t[k]) : "", nStr0: t && Array.isArray(t.strengths) ? t.strengths.length : 0 };
    }
    function leave(S: any) {
        V.hear = Math.max(0, V.hear - 1);
        const F = fill(), t = ten();
        // 登録しなかった答え：今の版の「うまく読み取れませんでした」を外し、何を答えればよいかを言って聞き直す
        try {
            const R = V.rej;
            if (R) {
                V.rej = null;
                if (F && Array.isArray(F.log)) {
                    const m = R.n >= 0 ? F.log[R.n] : null;
                    if (m && m.who === "ai" && !(m.extra && m.extra.ask))
                        F.log.splice(R.n, 1);
                    const cuNow = (F.cur && F.cur.k === R.cu.k) ? F.cur : R.cu;
                    if (R.c.skip) {
                        F.cur = cuNow;
                        if (typeof skipCurrent === "function")
                            skipCurrent();
                    }
                    else
                        reask(cuNow, R.vs, R.c);
                }
                return;
            }
        }
        catch (e) {
            try {
                console.warn("v2192up reask", e);
            }
            catch (x) { }
        }
        // 登録した答え：何を・どの項目に入れたか（会話の「登録しました」の吹き出しに付ける。描くのは fillRender）
        try {
            const k = S.k;
            if (S.isNeed && t && t === S.t && F && Array.isArray(F.log) && JSON.stringify(t[k] == null ? "" : t[k]) !== S.had && hasV(t[k])) {
                if (!F.log.slice(S.n0).some((m: any) => m && m.v92reg && m.v92reg.k === k)) {
                    for (let i = S.n0; i < F.log.length; i++) {
                        const m = F.log[i];
                        if (m && m.who === "ai" && !m.v92reg && !(m.extra && m.extra.ask) && /を登録しました|の下書きに入れました|で登録しました|registered|已登记|registr/i.test(String(m.html)) && !/あわせて登録しました/.test(String(m.html))) {
                            m.v92reg = { k, n: plain(S.cu.n), val: preview(t, k) };
                            break;
                        }
                    }
                }
                // ヒアリングで入れた項目の控え（「資料から取り込んだ数」と分けて言うため）
                const hk = Array.isArray(t.v92hearKeys) ? t.v92hearKeys : (t.v92hearKeys = []);
                if (hk.indexOf(k) < 0)
                    hk.push(k);
                if (k === "strengths" && S.nStr0 === 0)
                    t.v92strHear = 1;
                if (F.v92undo)
                    F.v92undo = null;
                // 聞き直しのために足した札が残っていたら外す
                if (F.cur && F.cur.k === k && (F.cur._v92bad || F.cur._v92alt))
                    F.cur = Object.assign({}, F.cur, { chips: F.cur._v92chips0 || null, _v92bad: null, _v92alt: null, _v92chips0: null });
                decorateChat();
            }
        }
        catch (e) { }
    }
    if (typeof fillCommit === "function") {
        const __fc92u = fillCommit;
        fillCommit = function (this: any) {
            const S = enter();
            try {
                return __fc92u.apply(this, arguments as any);
            }
            finally {
                leave(S);
            }
        };
    }
    /* 「この答えを直す」：その項目を、いまの登録を見せて聞き直す */
    function fixAsk(k: string) {
        const F = fill(), t = ten();
        const nx = needOf(k, t);
        if (!F || !t || !nx)
            return;
        if (TABLE[k]) {
            try {
                F.on = false;
                go("item");
            }
            catch (e) { }
            say(M(`「${plain(nx.n)}」は、商品情報の表の「✎」で直せます。`, `Edit “${plain(nx.n)}” with ✎ on the Product information screen.`));
            return;
        }
        const cu = Object.assign({}, nx, { _keep: 1, chips: ["このままでOK"].concat(k === "pol" ? polChips(t, nx.chips) : (nx.chips || [])), multi: 0 });
        F.on = true;
        F.cur = cu;
        F.sel = [];
        try {
            fillSay("ai", `<span data-noi18n>${M(`<b>${E(plain(nx.n))}</b>を直します。いまの登録：<b>${E(preview(t, k)) || "—"}</b><br>新しい内容を入力するか、下の選択肢を押してください。このままでよければ「このままでOK」を押してください。`,
                `Let's correct <b>${E(plain(nx.n))}</b>. Current value: <b>${E(preview(t, k)) || "—"}</b><br>Type the new value or press a choice below. To keep it, press “このままでOK”.`)}</span>`, { ask: cu });
        }
        catch (e) { }
        V.at = Date.now();
        try {
            if (typeof cur !== "undefined" && cur !== "up")
                hearOpen(false);
            else
                render();
        }
        catch (e) { }
        showBox(true);
    }
    W.v92upFixAsk = fixAsk;
    W.v92upShowBox = () => { V.at = Date.now(); showBox(true); try {
        if (typeof W.v92perShowAnswerBox === "function")
            W.v92perShowAnswerBox();
    }
    catch (e) { } };
    W.v92upHearing = () => { const F = fill(); return !!(F && F.on && F.cur && typeof cur !== "undefined" && cur === "up" && document.getElementById("fin2")); };
    document.addEventListener("click", ev => { try {
        const el = ev.target as any;
        const b = el && el.closest ? el.closest("[data-v92upfix]") : null;
        if (b) {
            ev.preventDefault();
            ev.stopPropagation();
            fixAsk(String(b.getAttribute("data-v92upfix") || ""));
            return;
        }
        const u = el && el.closest ? el.closest("[data-v92upundo]") : null;
        if (u) {
            ev.preventDefault();
            ev.stopPropagation();
            undoAuto();
        }
    }
    catch (e) { } });

    /* 答えの入口：聞き直しの札（別の項目に入れる・このまま登録する）と、前後の後始末 */
    if (typeof fillAnswer === "function") {
        const __fa92u = fillAnswer;
        fillAnswer = function (this: any, v: any) {
            try {
                V.at = Date.now();
                const F = fill(), t = ten(), cu = F ? F.cur : null, vs = String(v == null ? "" : v).trim();
                if (F && t && cu && vs) {
                    if (F.v92undo)
                        F.v92undo = null;
                    if (cu._v92alt && vs === cu._v92alt.chip) {
                        const A = cu._v92alt, nm = plain((needOf(A.k, t) || {}).n || A.k);
                        fillSay("u", E(vs));
                        const c2: any = check(needOf(A.k, t) || { k: A.k }, A.v, t);
                        const ok = (c2.ok !== false && !c2.skip) ? applyAnswer(t, A.k, A.v) : false;
                        const back = Object.assign({}, cu, { chips: cu._v92chips0 || null, _v92bad: null, _v92alt: null, _v92chips0: null });
                        F.cur = back;
                        if (ok) {
                            try {
                                const hk = Array.isArray(t.v92hearKeys) ? t.v92hearKeys : (t.v92hearKeys = []);
                                if (hk.indexOf(A.k) < 0)
                                    hk.push(A.k);
                                syncTenant();
                                if (typeof saveTen === "function")
                                    saveTen();
                            }
                            catch (e) { }
                            const s = scoreOf(t);
                            F.log.push({ who: "ai", html: `<span data-noi18n>${M(`<b>${E(nm)}</b>を登録しました。情報 ${s.filled.length}/${NEED.length}`, `Registered <b>${E(nm)}</b>. Info ${s.filled.length}/${NEED.length}`)}</span>`, v92reg: { k: A.k, n: nm, val: preview(t, A.k) } });
                        }
                        else
                            fillSay("ai", `<span data-noi18n>${M(`${E(nm)}としては登録できませんでした。`, `It could not be registered as ${E(nm)}.`)}</span>`);
                        if (hasV(t[cu.k])) {
                            F.cur = null;
                            fillNext();
                        }
                        else {
                            fillSay("ai", `<span data-noi18n>${M(`続けて、<b>${E(plain(cu.n))}</b>を教えてください。`, `Next, please tell me <b>${E(plain(cu.n))}</b>.`)}</span>`, { ask: back });
                            render();
                        }
                        return;
                    }
                    if (cu._v92bad && vs === FORCE()) {
                        const val = String(cu._v92bad.v || "");
                        fillSay("u", E(vs));
                        F.cur = Object.assign({}, cu, { chips: cu._v92chips0 || null, _v92bad: null, _v92alt: null, _v92chips0: null });
                        V.force = 1;
                        try {
                            fillCommit(val);
                        }
                        finally {
                            V.force = 0;
                        }
                        return;
                    }
                }
            }
            catch (e) {
                try {
                    console.warn("v2192up answer", e);
                }
                catch (x) { }
            }
            const S = enter();
            try {
                return __fa92u.apply(this, arguments as any);
            }
            finally {
                leave(S);
            }
        };
    }

    /* データ健全性チェック：取引条件・支払条件・仕出港・カテゴリーの形（前に入った値も見つけられるように） */
    if (typeof tenHealth === "function") {
        const __th92u = tenHealth;
        tenHealth = function (this: any, t: any) {
            const out = __th92u.apply(this, arguments as any);
            try {
                if (t && Array.isArray(out)) {
                    const add = (k: string, label: string, why: string) => { if (!out.some((x: any) => x && x.k === k))
                        out.push({ k, label, val: String(t[k]), why }); };
                    if (hasV(t.term) && !termOk(t.term))
                        add("term", "取引条件", "インコタームズ（FOB・CIF など）の形ではありません");
                    if (hasV(t.pay) && !payOk(t.pay))
                        add("pay", "支払条件", "支払条件（T/T・L/C など）として読めません");
                    if (hasV(t.pol) && !polOk(t.pol))
                        add("pol", "仕出港", "港・空港の名前として読めません");
                    if (hasV(t.cat) && /(?:です|でございます)[。.]?$/.test(String(t.cat)))
                        add("cat", "商材カテゴリ", "文末の「です」まで登録されています");
                }
            }
            catch (e) { }
            return out;
        };
    }
    /* 「その他」の種類の答え：文末の「です」を外してから記録する */
    if (typeof v79pIndSave === "function") {
        const __is92u = v79pIndSave;
        v79pIndSave = function (this: any, v: any) {
            const a = [].slice.call(arguments) as any[];
            try {
                a[0] = stripPolite(v);
            }
            catch (e) { }
            return __is92u.apply(this, a);
        };
    }

    /* ═════════ 答える欄の位置（共通の層 ① の続き：選択肢が多い質問でも入力欄が見える・カーソルを入れる） ═════════ */
    function showBox(focus: boolean) {
        const run = () => { try {
            const fin = document.getElementById("fin2"), wrap = document.getElementById("fanswrap") || fin;
            if (!wrap)
                return;
            const vh = window.innerHeight || 800, r = wrap.getBoundingClientRect();
            // 上の帯が画面に固定されているときは、その下から
            let top = 16;
            const bar = document.querySelector(".bar") as any;
            if (bar) {
                const bb = bar.getBoundingClientRect().bottom, ps = getComputedStyle(bar).position;
                if ((ps === "sticky" || ps === "fixed") && bb > 0 && bb < 240)
                    top = Math.round(bb) + 14;
            }
            const chat = document.getElementById("fchat");
            const q = chat ? chat.lastElementChild : null;
            const qTop = (q && chat) ? Math.max(q.getBoundingClientRect().top, chat.getBoundingClientRect().top) : r.top;
            const chips = !!(fin && fin.querySelector(".qb .q"));
            let d = 0;
            if (r.bottom - qTop <= vh - top - 20) { // 質問から入力欄まで、画面に入る
                if (r.bottom > vh - 20)
                    d = r.bottom - (vh - 20);
                else if (qTop < top)
                    d = qTop - top;
            }
            else if (chips) // 選択肢の多い質問：質問と選択肢を見せる
                d = qTop - top;
            else // 入力で答える質問：入力欄を見せる
                d = r.bottom - (vh - 20);
            if (Math.abs(d) > 4)
                window.scrollBy(0, Math.round(d));
            if (focus && window.innerWidth >= 768) {
                const f = document.getElementById("fans") as any;
                if (f && document.activeElement !== f && !(document.activeElement && /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement as any).tagName)))
                    f.focus({ preventScroll: true });
            }
        }
        catch (e) { } };
        setTimeout(run, 150);
        setTimeout(run, 580);
        setTimeout(run, 1220);
    }
    document.addEventListener("click", ev => { try {
        const t = ev.target as any;
        if (t && t.closest && (t.closest("#fin2") || t.closest("#rdfill") || t.closest("[data-onclick*='fillStart']") || t.closest("[data-v1811='edit-fill']") || t.closest("#v1811go")))
            V.at = Date.now();
    }
    catch (e) { } }, true);
    document.addEventListener("keydown", ev => { try {
        const t = ev.target as any;
        if (ev.key === "Enter" && t && (t.id === "fans" || t.id === "v1811co" || t.id === "v1811item"))
            V.at = Date.now();
    }
    catch (e) { } }, true);
    /* 会話の吹き出しに、登録した内容と「この答えを直す」を付ける */
    function decorateChat() {
        const F = fill();
        const c = document.getElementById("fchat");
        if (!F || !c || !Array.isArray(F.log))
            return;
        const kids = c.children;
        let added = false;
        if (kids.length === F.log.length) {
            F.log.forEach((m: any, i: number) => {
                if (!m || !m.v92reg)
                    return;
                const bb = kids[i].querySelector(".bb");
                if (!bb || bb.querySelector(".v92upreg"))
                    return;
                const g = m.v92reg, d = document.createElement("div");
                d.className = "v92upreg";
                d.setAttribute("data-noi18n", "");
                d.innerHTML = `<span>${E(M("登録した内容", "Registered"))}（${E(Tn(g.n))}）：<b>${E(g.val)}</b></span><button type="button" class="v92upfix" data-v92upfix="${E(g.k)}">${E(M("この答えを直す", "Correct this answer"))}</button>`;
                bb.appendChild(d);
                added = true;
            });
        }
        if (!F.v92undo)
            c.querySelectorAll(".v92upundo").forEach(x => x.remove());
        if (added)
            c.scrollTop = c.scrollHeight;
    }
    if (typeof fillRender === "function") {
        const __fr92u = fillRender;
        fillRender = function (this: any) {
            const r = __fr92u.apply(this, arguments as any);
            try {
                const F = fill();
                decorateChat();
                if (F && F.on && Date.now() - V.at < 3000)
                    showBox(true);
            }
            catch (e) { }
            return r;
        };
    }

    /* ═════════ B. 1商品だけの資料は、読み取った内容をそのまま商品情報に入れる ═════════ */
    const UNDO_KEYS = ["co", "coEn", "item", "itemEn", "cat", "catKey", "catRaw", "sku", "hs", "hsGuess", "_hsNote", "origin", "cert", "shelf", "store", "msrp", "term", "pay", "pol", "lead", "moq", "ctn", "priceCols", "priceRows", "dimCols", "dimRows", "compCols", "compRows", "compTitle", "strengths", "targets", "aiNotes", "allergens", "allergenNone", "v68comp"];
    const KEY_NM: any = { priceRows: "価格表", dimRows: "寸法・重量", compRows: "成分・材質表", ctn: "入数", moq: "MOQ", lead: "リードタイム", strengths: "商品の強み", targets: "進出希望国", term: "取引条件", pay: "支払条件", pol: "仕出港", origin: "産地・製造国", cert: "認証・規格", shelf: "期限・保証", sku: "品番", hs: "HSコード", msrp: "希望小売価格", store: "保存方法", cat: "商材カテゴリ", itemEn: "英文商品名", coEn: "英文社名", item: "商品名", co: "会社名" };
    const pendOne = (t: any) => (t && t.src === "upload" && t._pend && Array.isArray(t._pend.prods) && t._pend.prods.length === 1) ? t._pend : null;
    const gotList = (t: any) => { try {
        return typeof v54upldGot === "function" ? v54upldGot(t) : scoreOf(t).filled;
    }
    catch (e) {
        return [];
    } };
    const gotLabel = (t: any, x: any) => { try {
        return typeof v54upldGotLabel === "function" ? v54upldGotLabel(t, x) : x.n;
    }
    catch (e) {
        return x.n;
    } };
    function autoApply(t: any, P: any) {
        const F = fill();
        if (!F || typeof v188ApplyAll !== "function")
            return false;
        const before: any = {};
        UNDO_KEYS.forEach(k => { before[k] = t[k] === undefined ? undefined : JSON.parse(JSON.stringify(t[k])); });
        V.auto = 1;
        try {
            v188ApplyAll("all");
        }
        finally {
            V.auto = 0;
        }
        const F2 = fill();
        if (ten() !== t || t._pend || !F2)
            return false;
        const changed = UNDO_KEYS.filter(k => JSON.stringify(t[k] === undefined ? null : t[k]) !== JSON.stringify(before[k] === undefined ? null : before[k]));
        const names = changed.map(k => KEY_NM[k]).filter((x, i, a) => x && a.indexOf(x) === i);
        const bk: any = {};
        changed.forEach(k => { bk[k] = before[k]; });
        F2.v92undo = names.length ? { t, before: bk, names } : null;
        const got = gotList(t), s = scoreOf(t), sep = lang() === "ja" ? "・" : ", ";
        const miss = (s.missing || []).slice().sort((a: any, b: any) => b.w - a.w);
        const notes = Array.isArray(P.notes) ? P.notes : [];
        let msg = M(`<b>${E(t.file)}</b> を読み取り、商品情報に入れました（<b>${got.length}項目</b>）。`, `Read <b>${E(t.file)}</b> and added it to the product information (<b>${got.length} fields</b>).`);
        msg += `<br><span class="v54got">${E(M("取り込んだ項目：", "Imported: "))}${E(got.map((x: any) => gotLabel(t, x)).join(sep))}</span>`;
        if (notes.length)
            msg += `<br><br><b>🤖 ${E(M("AIの気づき：", "AI notes:"))}</b><br>` + notes.map((n: any) => "・" + E(n)).join("<br>");
        msg += "<br><br>" + (miss.length
            ? M(`いまの情報は <b>${got.length}/${NEED.length}</b> です。資料から読み取れなかった<b>${miss.length}項目</b>（${E(miss.slice(0, 4).map((m: any) => plain((needOf(m.k, t) || m).n)).join("・"))}${miss.length > 4 ? " など" : ""}）だけ、順番に伺います。`,
                `The information is now <b>${got.length}/${NEED.length}</b>. I will only ask about the <b>${miss.length} item(s)</b> that could not be read from the document.`)
            : M("<b>必要な項目は、すべて資料から読み取れました。</b>", "<b>All required items were read from the document.</b>"));
        msg += `<div class="ci">${M("読み取った内容は「商品情報」で確かめて直せます。", "You can check and correct what was read on the Product information screen.")}</div>`;
        if (F2.v92undo)
            msg += `<div class="v92upundo">${M(`表から読み取った内容（${E(names.join("・"))}）を入れたくないときは`, `If you do not want the table contents (${E(names.join(", "))}) applied:`)}<button type="button" class="q" data-v92upundo="1">${E(M("入れずに元に戻す", "Undo"))}</button></div>`;
        const L = F2.log;
        const iAsk = L.findIndex((m: any) => m && m.extra && m.extra.ask && m.extra.ask.k === "_pend");
        const iDone = L.findIndex((m: any) => m && m.who === "ai" && /画面のバナーから反映しました/.test(String(m.html)));
        const mine = { who: "ai", html: `<span data-noi18n>${msg}</span>`, v92auto: 1 };
        if (iAsk >= 0) {
            L[iAsk] = mine;
            if (iDone > iAsk)
                L.splice(iDone, 1);
        }
        else if (iDone >= 0)
            L[iDone] = mine;
        else
            L.unshift(mine);
        try {
            render();
        }
        catch (e) { }
        return true;
    }
    function undoAuto() {
        const F = fill(), t = ten();
        const U = F && F.v92undo;
        if (!F || !t || !U || U.t !== t) {
            say(M("元に戻せる内容がありません（商品情報の画面で直せます）。", "Nothing to undo (you can edit on the Product information screen)."));
            return;
        }
        Object.keys(U.before).forEach(k => { if (U.before[k] === undefined)
            delete t[k];
        else
            t[k] = U.before[k]; });
        t._pendSkip = Date.now();
        delete t._pendDone;
        delete t._pend;
        F.v92undo = null;
        try {
            syncTenant();
        }
        catch (e) { }
        try {
            if (typeof saveTen === "function")
                saveTen();
        }
        catch (e) { }
        F.log.push({ who: "u", html: E(M("入れずに元に戻す", "Undo")) });
        try {
            fillSay("ai", `<span data-noi18n>${M(`表から読み取った内容（${E(U.names.join("・"))}）を、商品情報から外しました。必要な項目は、1つずつ伺います。`, `The table contents (${E(U.names.join(", "))}) were removed from the product information. I will ask for the items one by one.`)}</span>`);
        }
        catch (e) { }
        F.cur = null;
        V.at = Date.now();
        try {
            fillNext();
        }
        catch (e) {
            try {
                render();
            }
            catch (x) { }
        }
    }
    if (typeof fillStart === "function") {
        const __fs92u = fillStart;
        fillStart = function (this: any) {
            V.at = Date.now();
            const t0 = ten();
            const P = pendOne(t0);
            const r = __fs92u.apply(this, arguments as any);
            try {
                const F = fill();
                if (P && t0 && ten() === t0 && t0._pend === P && F && F.on && F.cur && F.cur.k === "_pend")
                    autoApply(t0, P);
            }
            catch (e) {
                try {
                    console.warn("v2192up auto", e);
                }
                catch (x) { }
            }
            showBox(true);
            return r;
        };
    }

    /* ═════════ F. 会話の文：同じ文が2回・件数の言い方 ═════════ */
    if (typeof fillSay === "function") {
        const __fy92u = fillSay;
        fillSay = function (this: any, who: any, html: any, extra: any) {
            let h = html, hk: string[] = [], g0: any = null;
            const t = ten();
            try {
                if (who === "ai" && typeof h === "string") {
                    // 「支払条件を教えてください。支払条件を教えてください。」
                    h = h.replace(/(<b>([^<]{1,30})<\/b>を教えてください。<br>\s*)\2を教えてください。(?:\s*<br>)?/, "$1");
                    // 「◯項目を取り込みました」は、資料から入った数だけを言う（ヒアリングで足した分は分けて言う）
                    if (t && /個の表を検出し、(?:<b>)?\d+項目(?:<\/b>)?を取り込みました。/.test(h) && Array.isArray(t.v92hearKeys) && t.v92hearKeys.length && typeof v54upldGot === "function") {
                        const all = v54upldGot(t);
                        hk = all.filter((x: any) => t.v92hearKeys.indexOf(x.k) >= 0).map((x: any) => x.k);
                        if (hk.length) {
                            h = h.replace(/(個の表を検出し、(?:<b>)?)\d+(項目(?:<\/b>)?を取り込みました。)/, "$1" + (all.length - hk.length) + "$2");
                            g0 = v54upldGot;
                            const keys = hk;
                            v54upldGot = function (this: any, x: any) { const r = g0.apply(this, arguments as any); return (x === t && Array.isArray(r)) ? r.filter((y: any) => keys.indexOf(y.k) < 0) : r; };
                        }
                    }
                }
            }
            catch (e) {
                h = html;
            }
            let r: any;
            try {
                r = __fy92u.call(this, who, h, extra);
            }
            finally {
                if (g0)
                    v54upldGot = g0;
            }
            try {
                if (hk.length && t) {
                    const F = fill(), L = F && F.log, last = L && L[L.length - 1];
                    if (last && last.who === "ai" && /を取り込みました|imported|导入|importaron/i.test(String(last.html))) {
                        const all = g0(t), sep = lang() === "ja" ? "・" : ", ";
                        const mine = all.filter((x: any) => hk.indexOf(x.k) >= 0).map((x: any) => gotLabel(t, x)).join(sep);
                        last.html = String(last.html).replace(/(<br><br>|$)/, `<br><span class="v54got" data-noi18n>${E(M(`そのあとヒアリングで登録した項目（${hk.length}）：`, `Registered afterwards in the hearing (${hk.length}): `))}${E(mine)}</span>$1`);
                    }
                }
            }
            catch (e) { }
            return r;
        };
    }
    /* 「取り込んだ項目」の名前を、商材に合う言い方に（医療・衛生＝使用期限 など） */
    if (typeof v54upldGotLabel === "function") {
        const __gl92u = v54upldGotLabel;
        v54upldGotLabel = function (this: any, t: any, x: any) {
            try {
                if (x && (x.k === "shelf" || x.k === "compRows" || x.k === "ctn") && typeof v68hearNeed === "function") {
                    const y = v68hearNeed(x, t);
                    if (y && y.n && y.n !== x.n)
                        return __gl92u.call(this, t, Object.assign({}, x, { n: y.n }));
                }
            }
            catch (e) { }
            return __gl92u.apply(this, arguments as any);
        };
    }
    /* 商品情報の要約：ヒアリングで入れた強みを「資料から読み取りました」と言わない */
    if (typeof buildSummary === "function") {
        const __bs92u = buildSummary;
        buildSummary = function (this: any, t: any) {
            const r = __bs92u.apply(this, arguments as any);
            try {
                if (t && t.v92strHear && typeof r === "string")
                    return r.replace(/資料から<b>強みを(\d+)点<\/b>読み取りました。/, M("ヒアリングで入力いただいた<b>強みは$1点</b>です。", "You entered <b>$1 strengths</b> in the hearing."));
            }
            catch (e) { }
            return r;
        };
    }

    /* ═════════ C. 読み取り ═════════ */
    /* 値の中の桁区切りのカンマ（4,800h）と、かっこの中の「＝」「：」を、分ける目印にしない（いったん置き換えて、分けたあとで戻す） */
    const PC = (n: number) => String.fromCharCode(0xE0C0 + n);
    const PH: any = { ",": PC(1), "＝": PC(2), "=": PC(3), "：": PC(4), ":": PC(5), "／": PC(6), "/": PC(7) };
    const PH_RE = new RegExp("[" + PC(1) + "-" + PC(7) + "]", "g"), PH_T = new RegExp("[" + PC(1) + "-" + PC(7) + "]"), PH_BACK: any = {};
    Object.keys(PH).forEach(k => { PH_BACK[PH[k]] = k; });
    function protect(raw: string) {
        let s = String(raw == null ? "" : raw);
        if (!s)
            return s;
        s = s.replace(/(\d),(?=\d{3}(?!\d))/g, "$1" + PH[","]);
        let out = "", d = 0;
        for (const ch of s) {
            if ("（(［[【".indexOf(ch) >= 0)
                d++;
            else if ("）)］]】".indexOf(ch) >= 0)
                d = Math.max(0, d - 1);
            out += (d > 0 && PH[ch] && ch !== "," && ch !== "／" && ch !== "/") ? PH[ch] : ch;
        }
        // 「筆：馬毛・羊毛／竹軸、墨：奈良墨、硯：天然石」のように「、」で 項目：内容 が並ぶ文では、内容の中の「／」で割らない
        try {
            const keyed = out.split(/[、，]/).filter(x => /^\s*[^：:（(、，／\/]{1,12}[：:]/.test(x)).length;
            if (keyed >= 2)
                out = out.replace(/([／\/])(?=([^、，／\/\n]*))/g, (m0: string, sl: string, nxt: string) => /[：:]/.test(nxt) ? sl : PH[sl]);
        }
        catch (e) { }
        return out;
    }
    const unprotect = (x: any): any => {
        if (typeof x === "string")
            return PH_T.test(x) ? x.replace(PH_RE, c => PH_BACK[c]) : x;
        if (Array.isArray(x))
            return x.map(unprotect);
        if (x && typeof x === "object") {
            Object.keys(x).forEach(k => { x[k] = unprotect(x[k]); });
            return x;
        }
        return x;
    };
    function unprotectTen(t: any) {
        ["compRows", "compCols", "v68comp", "allergens", "dimRows", "dimNote"].forEach(k => { if (t[k] != null)
            t[k] = unprotect(t[k]); });
        try {
            if (typeof V54U !== "undefined" && V54U && V54U.say && typeof V54U.say.txt === "string")
                V54U.say.txt = unprotect(V54U.say.txt);
        }
        catch (e) { }
    }
    if (typeof v54upldComp === "function") {
        const __uc92u = v54upldComp;
        v54upldComp = function (this: any, raw: any) {
            const a = [].slice.call(arguments) as any[];
            try {
                a[0] = protect(String(raw == null ? "" : raw));
            }
            catch (e) { }
            return unprotect(__uc92u.apply(this, a));
        };
    }
    if (typeof v68hearCompParse === "function") {
        const __cp92u = v68hearCompParse;
        v68hearCompParse = function (this: any, raw: any) {
            const a = [].slice.call(arguments) as any[];
            try {
                a[0] = protect(String(unprotect(String(raw == null ? "" : raw))));
            }
            catch (e) { }
            return unprotect(__cp92u.apply(this, a));
        };
    }
    /* 「魚由来アミノ酸発酵液（N-P-K＝6-2-2）・pH 4.5」を、かっこの中の「＝」で 項目｜内容 に割らない */
    if (typeof v68pSplitLV === "function") {
        const __lv92u = v68pSplitLV;
        v68pSplitLV = function (this: any, s: any) {
            try {
                const x = String(s == null ? "" : s), i = x.search(/[：:＝=]/);
                if (i > 0) {
                    const pre = x.slice(0, i);
                    const open = (pre.match(/[（(［\[【]/g) || []).length, close = (pre.match(/[）)］\]】]/g) || []).length;
                    if (open > close)
                        return null;
                }
            }
            catch (e) { }
            return __lv92u.apply(this, arguments as any);
        };
    }
    /* 寸法：桁区切りのカンマ（9,520×2,800×2,950mm）と「全長・全幅・全高」の言葉を外してから読む */
    function dimNorm(raw: string) {
        let s = String(raw == null ? "" : raw);
        if (/\d,\d{3}/.test(s) && !(/\d{1,3},\d{3},\d{3}/.test(s) && !/[×xX✕＊*]/.test(s)))
            s = s.replace(/(\d),(?=\d{3}(?!\d))/g, "$1");
        if (/[×xX✕＊*]/.test(s))
            s = s.replace(/(?:全長|全幅|全高|車長|車幅|車高)\s*[:：]?\s*(?=\d)/g, "");
        return s;
    }
    if (typeof v54upldDims === "function") {
        const __ud92u = v54upldDims;
        v54upldDims = function (this: any, raw: any) {
            const a = [].slice.call(arguments) as any[];
            try {
                a[0] = dimNorm(String(raw == null ? "" : raw));
            }
            catch (e) { }
            const r = __ud92u.apply(this, a);
            try {
                if (r && typeof r === "object" && raw != null)
                    r.src = String(raw).trim().slice(0, 300);
            }
            catch (e) { }
            return r;
        };
    }
    /* 「梱包・入数」の欄：数の無い文（RORO 船・フラットラック など）に「カートン」を付けない */
    const ctnFix = (v: any) => { const s = String(v == null ? "" : v); const m = s.match(/^カートン\s+(.+)$/); return (m && !/\d/.test(m[1])) ? m[1] : s; };
    if (typeof productTableToFields === "function") {
        const __pt92u = productTableToFields;
        productTableToFields = function (this: any) {
            const r = __pt92u.apply(this, arguments as any);
            try {
                if (r && Array.isArray(r.prods))
                    r.prods.forEach((p: any) => { if (p && p.ctn)
                        p.ctn = ctnFix(p.ctn); });
            }
            catch (e) { }
            return r;
        };
    }
    /* 資料の「所在地」を控える（産地の候補・近い港の候補に使う。産地には勝手に入れない） */
    function docTidy(t: any) {
        if (!t || t.src !== "upload")
            return;
        try {
            if (!t.v92addr) {
                const a = docAddr(t);
                if (a)
                    t.v92addr = a.slice(0, 80);
            }
            if (t.ctn)
                t.ctn = ctnFix(t.ctn);
            ((t._pend && t._pend.prods) || []).forEach((p: any) => { if (p && p.x && p.x.ctn)
                p.x.ctn = ctnFix(p.x.ctn); });
        }
        catch (e) { }
    }
    if (typeof runParseReal === "function") {
        const __rp92u = runParseReal;
        runParseReal = function (this: any, t: any) {
            docTidy(t);
            return __rp92u.apply(this, arguments as any);
        };
    }
    if (typeof adoptReal === "function") {
        const __ar92u = adoptReal;
        adoptReal = function (this: any, t: any) {
            docTidy(t);
            return __ar92u.apply(this, arguments as any);
        };
    }

    /* ═════════ F. 質問の出し方：産地は資料の所在地を候補に・仕出港は地元の港を先に ═════════ */
    if (typeof v54hearAsk === "function") {
        const __ask92u = v54hearAsk;
        v54hearAsk = function (this: any, nx: any) {
            const a = [].slice.call(arguments) as any[];
            try {
                const t = ten();
                if (nx && t && !nx._v92) {
                    if (nx.k === "origin" && !hasV(t.origin)) {
                        // 車両・機械は、会社の所在地が製造地とは限らない（メーカーの製造国を聞く）ので、候補は出さない
                        const kd = kindOf(t);
                        const ad = (kd === "machine" || kd === "car") ? "" : docAddr(t), pl = placeOf(ad);
                        if (pl) {
                            const cand = "日本（" + pl + "）";
                            a[0] = Object.assign({}, nx, { _v92: 1, chips: [cand], q: String(nx.q || "") + `<br><span data-noi18n>${M(`資料の「所在地」は「<b>${E(ad)}</b>」です。製造している場所も同じなら、下の「${E(cand)}」を押してください。違うときは、製造地をお書きください。`,
                                    `The address in your document is “<b>${E(ad)}</b>”. If the product is made there too, press “${E(cand)}” below. Otherwise, type where it is made.`)}</span>` });
                        }
                    }
                    else if (nx.k === "pol" && !hasV(t.pol)) {
                        const lp = localPorts(t);
                        if (lp)
                            a[0] = Object.assign({}, nx, { _v92: 1, chips: polChips(t, nx.chips), q: String(nx.q || "") + `<br><span data-noi18n style="font-size:11px;color:var(--ink-2)">${M(`${E(lp.pref)}に近い港・空港を先に並べています（どの港を使うかは、物流会社と決めます）。`, `Ports and airports near ${E(lp.pref)} are listed first (your forwarder decides the actual port).`)}</span>` });
                    }
                }
            }
            catch (e) { }
            return __ask92u.apply(this, a);
        };
    }

    /* ═════════ F. ヒアリングの質問・例を、商材に合わせる ═════════ */
    const KIND_MACHINE = /油圧ショベル|ショベルカー|パワーショベル|ユンボ|ブルドーザ|ホイールローダ|フォークリフト|クレーン|建設機械|建機|重機|excavator|bulldozer|wheel\s*loader|forklift/i;
    const KIND_TEXTILE = /タオル|ハンカチ|手ぬぐい|てぬぐい|ふきん|布巾|寝具|シーツ|毛布|ブランケット|クッション|風呂敷|織物|towel|linen|blanket/i;
    function kindOf(p: any) {
        if (!p)
            return "";
        const c = String(p.cat || "").trim(), nm = [p.item, p.itemEn].filter(Boolean).join(" ");
        if (c === "建設機械")
            return "machine";
        if (c === "中古車" || String(p.catKey || "") === "car")
            return "car";
        if (c === "農業資材")
            return "agri";
        if (c === "健康食品")
            return "supp";
        if (c === "文化・教育用品")
            return "culture";
        if (c === "ペット用品")
            return "pet";
        if (c === "日用雑貨" && KIND_TEXTILE.test(nm))
            return "textile";
        if ((!c || c === "その他" || c === "中古品" || c === "工業部品") && KIND_MACHINE.test(nm))
            return "machine";
        return "";
    }
    W.v92upKindOf = kindOf;
    // [日本語, English]。n＝項目の名前・q＝質問・ex＝例
    const TX: any = {
        machine: {
            itemEn: { ex: ["例：Used Hydraulic Excavator 0.45m3 class (2017)", "e.g. Used Hydraulic Excavator 0.45m3 class (2017)"] },
            sku: { q: ["管理番号・機番（シリアル番号）を教えてください。", "Please tell me the stock number or serial number."], ex: ["例：KM-EX-2017-031", "e.g. KM-EX-2017-031"] },
            hs: { ex: ["例：8429.52（油圧ショベルなど）。分からなければ「不明」", "e.g. 8429.52 (hydraulic excavators). If unsure, type “unknown”"] },
            priceRows: { ex: ["例：1台 US$38,000（現状渡し）", "e.g. 1 unit US$38,000 (as is)"] },
            moq: { ex: ["例：1台から", "e.g. from 1 unit"] },
            dimRows: { q: ["機械の<b>輸送時の寸法（全長×全幅×全高）と質量</b>を教えてください。これがないと物流会社にAI見積を頼めません。", "Please tell me the machine's <b>transport dimensions (length × width × height) and weight</b>. Forwarders need this for a quote."], ex: ["例：全長 9,520×全幅 2,800×全高 2,950mm・12,400kg", "e.g. 9,520 × 2,800 × 2,950 mm, 12,400 kg"] },
            ctn: { n: ["積み方（船積みの方法）", "Loading method"], q: ["どの方法で船に積みますか？（RORO船に自走で積む／フラットラックコンテナに載せる／分解してコンテナに入れる など）1回に何台積めるかが分かれば、それも。", "How is it loaded on the vessel? (driven onto a RORO vessel / on a flat-rack container / dismantled into a container, etc.) Also the number of units per shipment, if known."], ex: ["例：RORO船（自走）／40ftフラットラックコンテナに1台", "e.g. RORO (self-driven) / 1 unit on a 40ft flat rack"] },
            compRows: { n: ["機械情報（仕様・状態）", "Machine details (specs / condition)"], q: ["年式・稼働時間（アワーメーター）・エンジン・排出ガスの基準・整備や足回りの状態を教えてください。<b>中古の機械は、年式や排出ガスの基準で輸入を制限している国があります（国ごとに要確認）。</b>", "Please tell me the year, operating hours (hour meter), engine, emission standard, and maintenance / undercarriage condition. <b>Some countries restrict imports of used machinery by age or emission standard (check each country).</b>"], ex: ["例：年式：2017年／稼働時間：4,800時間／エンジン：ディーゼル 72kW／排出ガス：2014年基準適合／足回り：70%", "e.g. Year: 2017 / Hours: 4,800 / Engine: diesel 72 kW / Emission: 2014 standard / Undercarriage: 70%"] },
            strengths: { ex: ["例：点検・整備・洗浄済み（点検記録つき）／稼働時間・年式の証明書類あり／同じ型の輸出実績あり", "e.g. Inspected, serviced and cleaned (with records) / Proof of hours and year / Export track record for this model"] },
            cert: { ex: ["例：特定自主検査済み／点検・整備の記録／船積前検査に対応", "e.g. Periodic self-inspection done / Service records / Pre-shipment inspection available"] },
            shelf: { n: ["保証（動作保証）", "Warranty (working condition)"], q: ["機械の保証（動作保証・返品の条件）はありますか？<b>無ければ「保証なし（現状渡し）」</b>とお書きください。", "Is there a warranty (working condition / returns)? <b>If not, write “No warranty (as is)”.</b>"], ex: ["例：到着後30日の動作保証／保証なし（現状渡し）", "e.g. 30-day working warranty after arrival / No warranty (as is)"] },
            origin: { q: ["製造国（メーカーの工場のある国）はどちらですか？", "In which country was it manufactured?"], ex: ["例：日本", "e.g. Japan"] }
        },
        car: {
            itemEn: { ex: ["例：Used Hybrid Sedan 2018 (1.8L, 45,000 km)", "e.g. Used Hybrid Sedan 2018 (1.8L, 45,000 km)"] },
            hs: { ex: ["例：8703 から始まる6桁（乗用車）。分からなければ「不明」", "e.g. a 6-digit code starting with 8703 (passenger cars). If unsure, type “unknown”"] },
            priceRows: { ex: ["例：1台 US$8,500", "e.g. 1 unit US$8,500"] },
            moq: { ex: ["例：1台から", "e.g. from 1 unit"] },
            dimRows: { q: ["車両の<b>全長×全幅×全高と車両重量</b>を教えてください。これがないと物流会社にAI見積を頼めません。", "Please tell me the vehicle's <b>length × width × height and weight</b>. Forwarders need this for a quote."], ex: ["例：全長 4,540×全幅 1,760×全高 1,470mm・1,380kg", "e.g. 4,540 × 1,760 × 1,470 mm, 1,380 kg"] },
            ctn: { n: ["積み方（船積みの方法）", "Loading method"], q: ["どの方法で船に積みますか？（RORO船／コンテナ）コンテナなら1本に何台かも。", "How is it loaded? (RORO / container) If by container, how many units per container?"], ex: ["例：RORO船／40ftコンテナに3台", "e.g. RORO / 3 units per 40ft container"] },
            compRows: { n: ["車両情報表", "Vehicle details"], q: ["年式・走行距離・排気量・燃料・修復歴の有無・車台番号を教えてください。<b>中古車は、年式やハンドルの位置で輸入を制限している国があります（国ごとに要確認）。</b>", "Please tell me the year, mileage, engine size, fuel, accident history and chassis number. <b>Some countries restrict imports of used cars by age or steering position (check each country).</b>"], ex: ["例：年式：2018年／走行距離：45,000km／排気量：1,800cc／燃料：ハイブリッド／修復歴：なし", "e.g. Year: 2018 / Mileage: 45,000 km / Engine: 1,800 cc / Fuel: hybrid / Accident history: none"] },
            strengths: { ex: ["例：走行距離 4.5万km／修復歴なし／点検整備記録簿あり", "e.g. 45,000 km / No accident history / Service records available"] },
            cert: { ex: ["例：輸出抹消仮登録証明書／点検整備記録簿／第三者の車両検査", "e.g. Export certificate / Service records / Third-party inspection"] },
            shelf: { n: ["保証", "Warranty"], q: ["車両の保証（故障時・返品の条件）はありますか？無ければ「保証なし（現状渡し）」とお書きください。", "Is there a warranty (breakdown / returns)? If not, write “No warranty (as is)”."], ex: ["例：保証なし（現状渡し）", "e.g. No warranty (as is)"] },
            origin: { q: ["製造国（メーカーの工場のある国）はどちらですか？", "In which country was it manufactured?"], ex: ["例：日本", "e.g. Japan"] }
        },
        agri: {
            itemEn: { ex: ["例：Organic Liquid Fertilizer 1L", "e.g. Organic Liquid Fertilizer 1L"] },
            hs: { ex: ["例：3101.00（動物性・植物性の肥料）。分からなければ「不明」", "e.g. 3101.00 (animal or vegetable fertilisers). If unsure, type “unknown”"] },
            priceRows: { ex: ["例：〜1,199本 US$8.20／1,200本〜 US$7.40", "e.g. up to 1,199 bottles US$8.20 / 1,200+ US$7.40"] },
            moq: { ex: ["例：600本（50ケース）", "e.g. 600 bottles (50 cases)"] },
            dimRows: { ex: ["例：単品 90×90×230mm・1.25kg／外装 390×300×260mm・15.6kg・12本入", "e.g. Unit 90×90×230 mm, 1.25 kg / Carton 390×300×260 mm, 15.6 kg, 12 bottles"] },
            compRows: { n: ["成分・規格表", "Composition / specs"], q: ["保証成分（窒素・りん酸・加里 など）・原料・pH・重金属の分析結果を教えてください。<b>肥料・農薬は、相手国での登録が要ることがあります（国ごとに要確認）。</b>", "Please tell me the guaranteed analysis (N, P, K etc.), raw materials, pH and heavy-metal test results. <b>Fertilisers and pesticides may need registration in the destination country (check each country).</b>"], ex: ["例：窒素全量 6.0%／りん酸全量 2.0%／加里全量 2.0%／原料：魚由来アミノ酸／pH 4.5", "e.g. Total N 6.0% / P 2.0% / K 2.0% / Raw material: fish amino acids / pH 4.5"] },
            strengths: { ex: ["例：有機JAS 適合資材／1,000倍に薄めて使える／糖度向上の試験データあり", "e.g. Organic JAS-compliant input / Used at 1,000× dilution / Test data on sugar content"] },
            cert: { ex: ["例：有機JAS 適合資材／肥料の届出・登録／SDS（安全データシート）あり", "e.g. Organic JAS-compliant input / Fertiliser registration / SDS available"] },
            shelf: { n: ["使用期限（品質を保てる期間）", "Shelf life"], q: ["使用期限（未開封で品質を保てる期間）はどれくらいですか？", "How long does the product keep its quality unopened?"], ex: ["例：製造から36か月（直射日光を避けて保管）", "e.g. 36 months from manufacture (store away from sunlight)"] }
        },
        supp: {
            itemEn: { ex: ["例：Lactic Acid Bacteria Supplement 60 tablets", "e.g. Lactic Acid Bacteria Supplement 60 tablets"] },
            hs: { ex: ["例：2106.90（その他の調製食料品）。分からなければ「不明」", "e.g. 2106.90 (other food preparations). If unsure, type “unknown”"] },
            priceRows: { ex: ["例：〜999個 US$12.50／1,000個〜 US$11.20", "e.g. up to 999 units US$12.50 / 1,000+ US$11.20"] },
            moq: { ex: ["例：500個", "e.g. 500 units"] },
            dimRows: { ex: ["例：単品 60×60×110mm・85g／外装 400×270×250mm・4.6kg・48個入", "e.g. Unit 60×60×110 mm, 85 g / Carton 400×270×250 mm, 4.6 kg, 48 units"] },
            compRows: { n: ["原材料・栄養成分表", "Ingredients / nutrition"], q: ["原材料・栄養成分・1日の目安量・アレルゲンを教えてください。<b>健康食品・サプリメントは、成分や表示で相手国の届出・登録が要ることがあります（国ごとに要確認）。</b>", "Please tell me the ingredients, nutrition facts, daily intake and allergens. <b>Supplements may need notification or registration in the destination country depending on ingredients and claims (check each country).</b>"], ex: ["例：原材料：乳酸菌（殺菌）・難消化性デキストリン／1日2粒／アレルゲン：なし", "e.g. Ingredients: lactic acid bacteria (heat-killed), dextrin / 2 tablets a day / Allergens: none"] },
            strengths: { ex: ["例：1粒に乳酸菌100億個／GMP認定工場で製造／国内販売 累計25万個", "e.g. 10 billion bacteria per tablet / Made in a GMP-certified plant / 250,000 units sold in Japan"] },
            cert: { ex: ["例：GMP（健康補助食品）／HACCP／ISO 22000／ハラール", "e.g. GMP (supplements) / HACCP / ISO 22000 / Halal"] }
        },
        culture: {
            itemEn: { ex: ["例：Japanese Calligraphy Starter Set", "e.g. Japanese Calligraphy Starter Set"] },
            hs: { ex: ["例：9603.30（筆）。分からなければ「不明」", "e.g. 9603.30 (brushes). If unsure, type “unknown”"] },
            priceRows: { ex: ["例：〜299セット US$24.00／300セット〜 US$21.50", "e.g. up to 299 sets US$24.00 / 300+ US$21.50"] },
            moq: { ex: ["例：100セット", "e.g. 100 sets"] },
            dimRows: { ex: ["例：単品（箱）300×230×45mm・780g／外装 620×480×250mm・16.5kg・20セット入", "e.g. Unit (box) 300×230×45 mm, 780 g / Carton 620×480×250 mm, 16.5 kg, 20 sets"] },
            compRows: { n: ["セット内容・素材表", "Contents / materials"], q: ["セットの内容と、部品ごとの素材（動物の毛・木・竹などの天然素材は種類まで）を教えてください。<b>天然素材は、検疫や条約（ワシントン条約）の確認に使います（国ごとに要確認）。</b>", "Please tell me what is in the set and the material of each part (for natural materials such as animal hair, wood or bamboo, the species). <b>Natural materials are checked for quarantine and CITES (check each country).</b>"], ex: ["例：筆：馬毛・羊毛／竹軸、墨：煤・膠、硯：天然石、箱：紙", "e.g. Brush: horse and goat hair, bamboo / Ink: soot and glue / Inkstone: natural stone / Box: paper"] },
            strengths: { ex: ["例：産地の職人による国産品／英語の手引きつき／教室用のまとめ買いパックあり", "e.g. Made by local craftsmen in Japan / English guide included / Classroom packs available"] },
            cert: { ex: ["例：伝統的工芸品の指定／FSC 認証（紙・木）／子ども向けは安全規格（要確認）", "e.g. Traditional craft designation / FSC (paper, wood) / Safety standards for children's items (to be confirmed)"] },
            shelf: { n: ["保証・品質の条件", "Warranty / quality terms"], q: ["品質の保証や返品・交換の条件はありますか？<b>食品ではないので賞味期限は要りません。</b>無ければ「なし」で大丈夫です。", "Are there quality warranty or return/exchange terms? <b>No best-before date is needed as this is not food.</b> If none, “none” is fine."], ex: ["例：初期不良のみ交換／なし", "e.g. Exchange for initial defects only / none"] }
        },
        pet: {
            itemEn: { ex: ["例：Cat Scratcher Bed (Corrugated Cardboard, M)", "e.g. Cat Scratcher Bed (Corrugated Cardboard, M)"] },
            priceRows: { ex: ["例：〜799個 US$8.60／800個〜 US$7.70", "e.g. up to 799 units US$8.60 / 800+ US$7.70"] },
            moq: { ex: ["例：400個", "e.g. 400 units"] },
            dimRows: { ex: ["例：単品 450×300×120mm・620g／外装 620×470×260mm・5.6kg・8個入", "e.g. Unit 450×300×120 mm, 620 g / Carton 620×470×260 mm, 5.6 kg, 8 units"] },
            compRows: { n: ["材質・素材表", "Materials"], q: ["部位ごとの材質と、<b>ペットが口にする・舐める部分の成分</b>を教えてください。フード・おやつ・植物由来のもの（またたび など）は、相手国の検疫の確認が要ることがあります（国ごとに要確認）。", "Please tell me the material of each part and <b>the ingredients of anything the pet may chew or lick</b>. Food, treats and plant-derived items (such as silver vine) may need quarantine checks (check each country)."], ex: ["例：本体：強化段ボール／接着：でんぷん糊／印刷：植物油インキ", "e.g. Body: reinforced cardboard / Glue: starch / Print: vegetable-oil ink"] },
            strengths: { ex: ["例：両面使えて長持ち／国産の古紙90%・でんぷん糊／国内EC ランキング1位", "e.g. Reversible and long-lasting / 90% recycled paper, starch glue / No.1 in a Japanese online ranking"] },
            cert: { ex: ["例：FSC 認証（紙）／材質の試験成績書", "e.g. FSC (paper) / Material test report"] },
            shelf: { n: ["保証・使用期限", "Warranty / shelf life"], q: ["保証や使用期限はありますか？フード・おやつは賞味期限を、用品は無ければ「なし」とお書きください。", "Is there a warranty or shelf life? For food and treats give the best-before period; for goods, write “none” if there is none."], ex: ["例：なし／賞味期限 製造から18か月（フードのとき）", "e.g. none / best before 18 months from manufacture (for food)"] }
        },
        textile: {
            itemEn: { ex: ["例：Cotton Face Towel 34x80cm", "e.g. Cotton Face Towel 34x80cm"] },
            hs: { ex: ["例：6302.60（綿のタオル類）。分からなければ「不明」", "e.g. 6302.60 (cotton terry towels). If unsure, type “unknown”"] },
            priceRows: { ex: ["例：〜599枚 US$7.20／600枚〜 US$6.50", "e.g. up to 599 pcs US$7.20 / 600+ US$6.50"] },
            moq: { ex: ["例：300枚", "e.g. 300 pcs"] },
            dimRows: { ex: ["例：単品 34×80cm・95g／外装 500×400×300mm・6.5kg・60枚入", "e.g. Unit 34×80 cm, 95 g / Carton 500×400×300 mm, 6.5 kg, 60 pcs"] },
            compRows: { n: ["材質・素材表", "Materials"], q: ["素材の組成（綿100% など）と、糸・染色・加工、サイズ・重さを教えてください。", "Please tell me the fibre composition (e.g. 100% cotton), yarn / dyeing / finishing, and size / weight."], ex: ["例：綿100%（超長綿）／無撚糸／34×80cm・95g", "e.g. 100% cotton (extra-long staple) / zero-twist yarn / 34×80 cm, 95 g"] },
            strengths: { ex: ["例：吸水試験5秒以内／洗濯後もやわらかい無撚糸／名入れ刺繍は100枚から", "e.g. Absorbs water within 5 seconds / Stays soft after washing / Custom embroidery from 100 pcs"] },
            cert: { ex: ["例：OEKO-TEX STANDARD 100／産地ブランドの認定／ISO 9001", "e.g. OEKO-TEX STANDARD 100 / Regional brand certification / ISO 9001"] }
        }
    };
    if (typeof v68hearTxOf === "function") {
        const __tx92u = v68hearTxOf;
        v68hearTxOf = function (this: any, k: any, p: any) {
            const base = __tx92u.apply(this, arguments as any);
            try {
                const kd = kindOf(p === undefined ? ten() : p);
                const x = kd && TX[kd] ? TX[kd][k] : null;
                if (x) {
                    const i = lang() === "ja" ? 0 : 1, o: any = Object.assign({}, base || {});
                    Object.keys(x).forEach(f => { o[f] = x[f][i]; });
                    return o;
                }
            }
            catch (e) { }
            return base;
        };
    }

    /* ═════════ E. はじめての窓・登録メニュー ═════════ */
    const hasOwn = () => { try {
        return typeof TENS !== "undefined" && Array.isArray(TENS) && TENS.some((t: any) => t && t.src === "upload");
    }
    catch (e) {
        return false;
    } };
    const v1811 = () => { try {
        return (typeof V1811 !== "undefined" && V1811) ? V1811 : null;
    }
    catch (e) {
        return null;
    } };
    const welSeen = () => { try {
        if (typeof SES !== "undefined" && SES && SES.code)
            localStorage.setItem("bc20_wel_" + SES.code, "1");
    }
    catch (e) { } };
    /* 登録済みの商品があれば、「商品情報を登録」を開いても登録メニューを自動では出さない（登録済みの商品を見せる。メニューは「登録メニュー」のボタンから） */
    if (typeof dk15UpOk === "function") {
        const __ok92u = dk15UpOk;
        dk15UpOk = function (this: any) {
            try {
                if (hasOwn())
                    return false;
            }
            catch (e) { }
            return __ok92u.apply(this, arguments as any);
        };
    }
    if (typeof v1811Maybe === "function") {
        const __mb92u = v1811Maybe;
        v1811Maybe = function (this: any) {
            try {
                if (hasOwn())
                    return;
            }
            catch (e) { }
            return __mb92u.apply(this, arguments as any);
        };
    }
    /* ヒアリングを開く（表示中の商品の、足りない項目の質問へ直接） */
    function hearOpen(start: boolean) {
        const X = v1811();
        V.at = Date.now();
        const prev = X ? X.sup : false;
        try {
            if (X) {
                X.sup = true;
                X.focus = null;
                X.mode = null;
            }
            try {
                if (typeof v1811Close === "function")
                    v1811Close();
            }
            catch (e) { }
            if (typeof cur === "undefined" || cur !== "up")
                go("up");
            if (start && typeof fillStart === "function")
                fillStart();
            else
                render();
        }
        finally {
            if (X)
                X.sup = prev;
        }
        showBox(true);
        try {
            if (typeof W.v92perShowAnswerBox === "function")
                W.v92perShowAnswerBox();
        }
        catch (e) { }
    }
    W.v92upHearGo = function () {
        const t = ten();
        try {
            if (t && (t.src === "upload" || t.src === "sample2")) {
                const s = scoreOf(t);
                if ((s.missing && s.missing.length) || t._pend) {
                    hearOpen(true);
                    return true;
                }
            }
        }
        catch (e) { }
        return false;
    };
    if (typeof ux32Fill === "function") {
        const __uf92u = ux32Fill;
        ux32Fill = function (this: any) {
            try {
                if (W.v92upHearGo())
                    return;
            }
            catch (e) { }
            return __uf92u.apply(this, arguments as any);
        };
    }
    /* 資料なしで始めたときも、質問の欄へ */
    if (typeof v1811Manual === "function") {
        const __vm92u = v1811Manual;
        v1811Manual = function (this: any) {
            V.at = Date.now();
            const r = __vm92u.apply(this, arguments as any);
            try {
                const F = fill();
                if (F && F.on) {
                    showBox(true);
                    if (typeof W.v92perShowAnswerBox === "function")
                        W.v92perShowAnswerBox();
                }
            }
            catch (e) { }
            return r;
        };
    }
    /* 登録メニュー：会社が1つなら、会社を選ぶ段を飛ばす。押せない選択肢には理由を書く */
    if (typeof v1811Act === "function") {
        const __va92u = v1811Act;
        v1811Act = function (this: any, k: any, ds: any, v: any) {
            try {
                if (k === "edit" || k === "addto") {
                    const own = (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS : [];
                    const cos: string[] = [];
                    own.forEach((t: any) => { const c = (String(t && t.co || "").trim()) || "（会社名 未登録）"; if (cos.indexOf(c) < 0)
                        cos.push(c); });
                    const demo = document.querySelector("#v1811ov [data-v70demo]");
                    if (cos.length === 1 && !demo && typeof v1811Open === "function") {
                        if (k === "edit")
                            return v1811Open("edit", cos[0]);
                        return __va92u.call(this, "addto-co", { co: cos[0] }, v);
                    }
                }
            }
            catch (e) { }
            return __va92u.apply(this, arguments as any);
        };
    }
    if (typeof v1811Open === "function") {
        const __vo92u = v1811Open;
        v1811Open = function (this: any, step: any) {
            const r = __vo92u.apply(this, arguments as any);
            try {
                const v = document.getElementById("v1811ov");
                if (v && (!step || step === "main")) {
                    v.querySelectorAll(".v1811o[disabled]").forEach((b: any) => {
                        const m = b.querySelector(".m");
                        if (m && !m.getAttribute("data-v92")) {
                            m.setAttribute("data-v92", "1");
                            m.textContent = "まだ選べません（商品を1つ登録すると選べます）";
                        }
                    });
                }
            }
            catch (e) { }
            return r;
        };
    }
    /* はじめての窓：商品が登録済みなら出さない。はじめての方は、この窓1枚で始められる（続けて「何をしますか？」の窓を出さない） */
    function welClose() {
        const v = document.getElementById("welv");
        if (!v)
            return false;
        welSeen();
        v.remove();
        return true;
    }
    function welToUp() {
        const X = v1811();
        const prev = X ? X.sup : false;
        try {
            if (X)
                X.sup = true;
            const F = fill();
            if (F)
                F.on = false;
            if (typeof cur === "undefined" || cur !== "up")
                go("up");
            if (X) {
                X.mode = null;
                X.focus = { k: "newco" };
            }
            render();
        }
        finally {
            if (X)
                X.sup = prev;
        }
        setTimeout(() => { try {
            if (typeof v1812ToDrop === "function")
                v1812ToDrop();
            say(M("商品の資料を、ここにドロップしてください（クリックして選ぶこともできます）。", "Drop your product documents here (or click to choose files)."));
        }
        catch (e) { } }, 160);
    }
    function welDecorate() {
        const v = document.getElementById("welv");
        if (!v || v.getAttribute("data-v92up"))
            return;
        v.setAttribute("data-v92up", "1");
        v.setAttribute("role", "dialog");
        v.setAttribute("aria-modal", "true");
        const goBtn = document.getElementById("welgo") as any;
        if (goBtn) {
            goBtn.onclick = () => { welClose(); if (hasOwn()) {
                try {
                    render();
                }
                catch (e) { }
            }
            else
                welToUp(); };
            const row = goBtn.closest(".rw") || goBtn.parentElement;
            if (row && !v.querySelector(".v92upwel")) {
                const d = document.createElement("div");
                d.className = "v92upwel";
                d.innerHTML = `<span>資料が手元に無いときは：</span><button type="button" class="btn g" id="v92welsmp">見本で試してみる</button><button type="button" class="btn g" id="v92welman">資料なしで、会社名から始める</button><span style="margin-left:auto;font-size:11px;color:var(--ink-3)">Esc キーでも閉じられます</span>`;
                row.insertAdjacentElement("afterend", d);
                const smp = d.querySelector("#v92welsmp") as any, man = d.querySelector("#v92welman") as any;
                if (smp)
                    smp.onclick = () => { welClose(); try {
                        if (typeof ux25ToSamples === "function")
                            ux25ToSamples();
                        else
                            go("up");
                    }
                    catch (e) { } };
                if (man)
                    man.onclick = () => {
                        welClose();
                        const X = v1811();
                        const prev = X ? X.sup : false;
                        try {
                            if (X)
                                X.sup = true;
                            if (typeof cur === "undefined" || cur !== "up")
                                go("up");
                        }
                        finally {
                            if (X)
                                X.sup = prev;
                        }
                        try {
                            if (typeof v1811Open === "function") {
                                v1811Open("newco");
                                const m = document.querySelector("#v1811ov #v1811manual") as any;
                                if (m)
                                    m.hidden = false;
                                const i = document.querySelector("#v1811ov #v1811co") as any;
                                if (i)
                                    i.focus();
                            }
                        }
                        catch (e) { }
                    };
            }
            try {
                goBtn.focus({ preventScroll: true });
            }
            catch (e) { }
        }
    }
    if (typeof showWelcome === "function") {
        const __sw92u = showWelcome;
        showWelcome = function (this: any) {
            try {
                if (hasOwn()) {
                    welSeen();
                    return;
                }
            }
            catch (e) { }
            const r = __sw92u.apply(this, arguments as any);
            try {
                welDecorate();
            }
            catch (e) { }
            return r;
        };
    }
    document.addEventListener("keydown", ev => { try {
        if (ev.key !== "Escape" || !document.getElementById("welv"))
            return;
        if (document.getElementById("v1811ov") || document.querySelector(".dw[data-open='true']"))
            return;
        if (welClose())
            ev.stopPropagation();
    }
    catch (e) { } });

    /* ═════════ 描いたあとの仕上げ ═════════ */
    function afterRender() {
        // はじめての窓：データが届いて商品が登録済みと分かったら閉じる
        try {
            if (document.getElementById("welv")) {
                if (hasOwn())
                    welClose();
                else
                    welDecorate();
            }
        }
        catch (e) { }
        // 2商品以上の資料の帯：会話の選択肢の名前（すべて反映する）に合わせる（共通の層の1行は、1商品のときの言い方）
        try {
            const t = ten(), n = document.querySelector("#v188pend .v92pendn") as any;
            if (n && t && t._pend && Array.isArray(t._pend.prods) && t._pend.prods.length > 1 && !n.getAttribute("data-v92up") && lang() === "ja") {
                n.setAttribute("data-v92up", "1");
                n.textContent = "まだ商品情報には入れていません。「すべて登録する」で、読み取った商品をそれぞれ登録します（下の会話の「すべて反映する」も同じ働き。どちらか一方で大丈夫です）。";
            }
        }
        catch (e) { }
        try {
            if (typeof cur === "undefined" || cur !== "up")
                return;
            const F = fill(), t = ten();
            // そろったあとは「あとで埋める（デモを見る）」と言わない
            if (F && F.on && t) {
                const b = document.querySelector('#well button[data-onclick="FILL.on=false;render()"]') as any;
                if (b && !b.getAttribute("data-v92up")) {
                    let done = false;
                    try {
                        done = !(scoreOf(t).missing || []).length;
                    }
                    catch (e) { }
                    if (done) {
                        b.setAttribute("data-v92up", "1");
                        b.textContent = "ヒアリングを閉じる（登録の画面へ）";
                    }
                }
            }
        }
        catch (e) { }
    }
    if (typeof render === "function") {
        const __rd92u = render;
        render = function (this: any) {
            const r = __rd92u.apply(this, arguments as any);
            try {
                afterRender();
            }
            catch (e) { }
            return r;
        };
    }
    /* ───── 足した言葉の辞書（英語・中国語・スペイン語）。会話の吹き出しの中の文は M() で言語に合わせている ───── */
    try {
        if (typeof I18N !== "undefined" && I18N && I18N.dict) {
            const rows = [
                ["資料が手元に無いときは：", "No documents at hand?", "手头没有资料时：", "¿No tiene documentos a mano?"],
                ["見本で試してみる", "Try with a sample", "用样例试用", "Probar con una muestra"],
                ["資料なしで、会社名から始める", "Start from the company name (no documents)", "不用资料，从公司名称开始", "Empezar por el nombre de la empresa (sin documentos)"],
                ["Esc キーでも閉じられます", "You can also close this with Esc", "也可以按 Esc 关闭", "También puede cerrar con Esc"],
                ["まだ選べません（商品を1つ登録すると選べます）", "Not available yet (register one product first)", "尚不可选（登记一个商品后可选）", "Aún no disponible (registre primero un producto)"],
                ["ヒアリングを閉じる（登録の画面へ）", "Close the hearing (back to registration)", "关闭询问（返回登记画面）", "Cerrar las preguntas (volver al registro)"],
                ["選択肢の例：", "Examples:", "选项示例：", "Ejemplos:"],
                ["登録した内容を見る・直す（商品情報）", "View / edit what was registered (Product information)", "查看・修改已登记的内容（商品信息）", "Ver / editar lo registrado (Información del producto)"],
                ["梱包・入数", "Packing / qty", "包装・装箱数", "Embalaje / cant."],
                ["積み方", "Loading", "装载方式", "Carga"],
                ["このまま登録する", "Register as it is", "按此内容登记", "Registrar tal cual"]
            ];
            rows.forEach(r => { ["en", "zh", "es"].forEach((l, i) => { if (I18N.dict[l] && !I18N.dict[l][r[0]])
                I18N.dict[l][r[0]] = r[i + 1]; }); });
        }
    }
    catch (e) { }
    /* ヒアリングの次の質問（刷新版の「AIヒアリング」の箱を、実際に聞く順にそろえるため） */
    W.v92upHearOrder = function () {
        const t = ten(), F = fill();
        if (!t)
            return [];
        try {
            const s = scoreOf(t);
            const sk = (F && F.on && Array.isArray(F.skip)) ? F.skip : [], ord = (F && F.on && Array.isArray(F.v54hearOrd)) ? F.v54hearOrd : [];
            const oi = (k: string) => { const i = ord.indexOf(k); return i < 0 ? 999 : i; };
            let rest = (s.missing || []).filter((m: any) => sk.indexOf(m.k) < 0).sort((a: any, b: any) => (oi(a.k) - oi(b.k)) || (b.w - a.w));
            if (!rest.length)
                rest = (s.missing || []).slice().sort((a: any, b: any) => b.w - a.w);
            const ck = F && F.on && F.cur && !F.cur.x ? String(F.cur.k || "") : "";
            if (ck) {
                const i = rest.findIndex((m: any) => m.k === ck);
                if (i > 0)
                    rest.unshift(rest.splice(i, 1)[0]);
            }
            return rest.map((m: any) => {
                const n = needOf(m.k, t) || m;
                let chips = Array.isArray(n.chips) ? n.chips.slice() : [];
                if (m.k === "pol")
                    chips = polChips(t, chips);
                if (m.k === "origin" && !chips.length && !/^(machine|car)$/.test(kindOf(t))) {
                    const pl = placeOf(docAddr(t));
                    if (pl)
                        chips = ["日本（" + pl + "）"];
                }
                return { k: m.k, n: plain(n.n), q: plain(String(n.q || "").split(/<br\s*\/?>/i)[0]), chips };
            });
        }
        catch (e) {
            return [];
        }
    };
})();
