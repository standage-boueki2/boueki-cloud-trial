/* 21.92 r6c：6巡目の直し（書類＝仕向港・出港日・船積依頼書／物流会社の AI）。今の関数は包むだけ。保存の形は変えない（r5a が足した pod・v92podTerm・etd を同じ意味で使う）。
   (1) 仕向港を1つにそろえる（indagri-R03・other-R01・daily-R05・food-R03・auto-R01・food-R05）
       案件の仕向港を返す関数は v92r6c.pod(S) の1つ。決め方：利用者が「仕向港」の欄に入れた値 ＞ C・D 系の取引条件の場所 ＞ 無し。
       ・取引条件の場所を変えたとき、仕向港が取引条件から入った値（＝取引条件の場所と同じ）なら一緒に変える。
       ・利用者が入れた値と取引条件の場所が違うときは、編集の窓・保存の知らせ・書類の画面の箱（どちらに合わせるかを選べる）・点検（黄）で知らせる。
       ・S/I・荷印・原産地証明の下書き（v85docParties）は、この1つを使う。国名しか無いときは空欄（［要確認］に数える）。
       ・日本語の地名は PI と同じ変換（v56docPortEn）で英語に。「CIF ル・アーヴル」が「CIF ル」に切れるのを止める（v56shipTermPlace）。
   (2) 出港の予定日（food-R02・daily-R08・food-R05）：利用者が入れた日は年を動かさない（過ぎた日は「出港済み（実績）」）。ETA は ETD より後。ETA が希望着荷より後なら点検で黄。
   (3) 船積依頼書（other-R02）：Packages・Weight・容積は梱包明細と同じ計算（v68trPlFill）から。出せないときは空欄（［要確認］に数える）。
   (4) 物流会社の AI物流マン（other-R04・cross-09）：自社のレーンだけ／未対応だけ／金額の直し方と内訳（FOB の金額がどこから来るか）。
   (5) health-R04（支払条件の出どころの文）・culture-R06（仕向国と違う国の資料名）・契約書関連②のボタンが押せない理由。 */
declare const TEN: any, TENS: any, D: any, I18N: any, SHIPS: any, shipStep: any, V85DOC_D: any, V56DOC_CTY: any, FWD_POD: any, V56SHIP: any;
declare let render: any, v33CkQuote: any, openStepEdit: any, rDoc: any, vOpsDoc: any, v85docParties: any, v85docGoods: any, v85docSpec: any, v56shipTermPlace: any, v85docRowHtml: any, toast: any, SHIPA: any, fwdBrain: any, FWDB: any, FWDON: any, v85docRepaint: any, fwdRender: any, v90fAnsOpen: any, fwdAsk: any;
declare function fwdSave(): void;
declare function v56docPortEn(s: any, cty?: any): any;
declare function v85docEtd(): string;
declare function v85docToday(): string;
declare function v85docCName(cc: any): string;
declare function v68trPlFill(S: any): any;
declare function v54docSyncRows(S: any): void;
declare function v61dlRecById(id: any): any;
declare function v68trRecOf(S: any): any;
declare function v61dlRecTerm(rec: any): any;
declare function saveTen(): void;
declare function fwdCo(): string;
declare function fwdReqStatus(r: any): string;
declare function fwdRateValid(r: any): boolean;
declare function go(k: any): void;
(function () {
    const W: any = window;
    if (W.__v2192r6c) return;
    W.__v2192r6c = 1;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const lang = () => { try { const s: any = document.getElementById("lang"); const v = (s && s.value) || (typeof I18N !== "undefined" && I18N && I18N.lang) || "ja"; return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja"; } catch (e) { return "ja"; } };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const warn = (k: string, e: any) => { try { console.warn("[v92r6c] " + k, e); } catch (x) { } };
    const ten = () => { try { return (typeof TEN !== "undefined" && TEN) ? TEN : null; } catch (e) { return null; } };
    const dd = () => { try { return (typeof D !== "undefined" && D) ? D : null; } catch (e) { return null; } };
    const ship = () => { const d = dd(); return (d && d.ship) || null; };
    const curCase = () => { try { return (typeof SHIPS !== "undefined" && SHIPS && SHIPS[SHIPA]) || null; } catch (e) { return null; } };
    const isPo = (S: any) => { try { const c = curCase(); return !!(S && (S.poNo || (c && c.po && c.ship === S))); } catch (e) { return !!(S && S.poNo); } };
    const save = () => { try { if (typeof saveTen === "function") saveTen(); } catch (e) { } };
    const say = (m: string) => { try { if (typeof toast === "function") toast(m); } catch (e) { } };
    const rnd = () => { try { if (typeof render === "function") render(); } catch (e) { } };
    const el = (id: string): any => document.getElementById(id);
    const API: any = W.v92r6c = W.v92r6c || {};
    // 見た目（今の版にも効くよう、本体の層からも入れる。刷新版の rd_v92r6c.css と同じ中身）
    try { if (!document.getElementById("v92r6c-css")) { const st = document.createElement("style"); st.id = "v92r6c-css"; st.textContent = ".v92r6c-note{margin:8px 0 10px;padding:9px 11px;border:1px solid var(--line,#d9dee5);border-left:3px solid var(--warn,#b7791f);border-radius:8px;background:var(--bg-2,#fafbfc);font-size:12px;line-height:1.65}.v92r6c-note.yel{background:#fff8e6;border-color:#e6c97a;border-left-color:#b7791f;color:#3d2f0a}.v92r6c-note .v92r6c-acts{margin-top:6px;display:flex;flex-wrap:wrap;gap:6px 8px}.v92r6c-note .btn{font-size:12px;padding:4px 10px}.v92r6c-hint{margin:4px 0 2px;padding:6px 9px;border-radius:6px;background:var(--bg-2,#f4f6f8);font-size:11.5px;line-height:1.6;color:var(--ink-2,#44505c)}.v92r6c-hint.yel{background:#fff8e6;border:1px solid #e6c97a;color:#3d2f0a}.v92r6c-hint .btn{font-size:11.5px;padding:3px 9px;margin-left:4px}.v92r6c-why{display:block;margin:4px 0 0;font-size:11.5px;line-height:1.55;color:var(--ink-2,#5a4a1a)}.v85doc-tb{table-layout:auto;word-break:normal}.v85doc-tb th{white-space:normal;word-break:normal;overflow-wrap:normal;hyphens:none;overflow:visible;text-overflow:clip;font-size:10px;padding:4px 3px}.v85doc-tb td{font-size:12px;padding:4px 3px;overflow-wrap:anywhere}@media (prefers-color-scheme: dark){:root[data-theme=\"dark\"] .v92r6c-note.yel,:root[data-theme=\"dark\"] .v92r6c-hint.yel{background:#3a2f12;border-color:#7a6220;color:#f3e6bf}}"; (document.head || document.documentElement).appendChild(st); } } catch (e) { }
    const JA = /[぀-ヿ㐀-鿿]/;
    const NK = (s: any) => { let x = String(s == null ? "" : s); try { x = x.normalize("NFKC"); } catch (e) { } return x; };

    /* ═════════ (1) 仕向港：1つの関数 ═════════ */
    const INC_G = /(^|[^A-Za-z])(EXW|FCA|FAS|FOB|CFR|CNF|C&F|CIF|CPT|CIP|DAP|DPU|DDP)(?![A-Za-z])/i;
    const C_D = /^(CFR|CIF|CPT|CIP|DAP|DPU|DDP)$/;
    function termParts(term: any): { code: string, place: string } {
        const raw = NK(term).replace(/[（(]\s*Incoterms[^)）]*[)）]/ig, " ").replace(/Incoterms\s*®?\s*20\d\d/ig, " ");
        const m = raw.match(INC_G);
        if (!m) return { code: "", place: "" };
        let code = m[2].toUpperCase(); if (code === "CNF" || code === "C&F") code = "CFR";
        let place = raw.replace(INC_G, "$1 ").replace(/\s+/g, " ").replace(/^[\s,、・:：\/／\-]+|[\s,、・:：\/／]+$/g, "").trim();
        if (/入れてください|未定|要確認|^（.*）$/.test(place) || /^[\d,.\s$¥￥]+$/.test(place) || /US\$|USD|JPY|EUR|[¥￥€]\s*\d/.test(place)) place = "";
        return { code, place };
    }
    // 地名を、書類で使う値に（PI と同じ変換）。国名・空・「未登録」などは ""（＝港が無い）
    function placeVal(x: any, S: any): string {
        const s = NK(x).trim();
        if (!s || /^（.*未|^[—\-–]+$|未登録|未設定|未読取|入れてください|要確認/.test(s)) return "";
        try {
            if (typeof v56docPortEn === "function") {
                const pe = v56docPortEn(s, S && S.country);
                if (!pe || pe.miss === "empty" || pe.miss === "country") return "";
                return String(pe.t || "").trim();
            }
        } catch (e) { }
        return (S && s === String(S.country || "")) ? "" : s;
    }
    const keyOf = (v: any) => NK(v).split(/[,(（]/)[0].toLowerCase().replace(/\b(port|city|harbou?r)\b/g, "").replace(/[^a-z0-9぀-ヿ㐀-鿿]+/g, "").replace(/港$/, "");
    function same(a: any, b: any): boolean {
        const x = keyOf(a), y = keyOf(b);
        if (!x || !y) return false;
        return x === y || (Math.min(x.length, y.length) >= 4 && (x.indexOf(y) === 0 || y.indexOf(x) === 0));
    }
    /* 案件の仕向港（ここ1か所で決める）
       v＝書類で使う値（無ければ ""）／src＝"user"（仕向港の欄・発注書・記録）｜"term"（取引条件の場所）｜""／tp＝取引条件の場所（C・D 系のときだけ）／mismatch＝利用者の値と取引条件の場所が違う */
    function pod(S: any): { v: string, src: string, tp: string, code: string, mismatch: boolean } {
        if (!S) return { v: "", src: "", tp: "", code: "", mismatch: false };
        const t = termParts(S.term);
        const tp = C_D.test(t.code) ? placeVal(t.place, S) : "";
        const cur = placeVal(S.pod, S);
        const auto = !!S.v92podTerm;
        if (cur && !auto) return { v: cur, src: "user", tp, code: t.code, mismatch: !!tp && !same(cur, tp) };
        if (tp) return { v: tp, src: "term", tp, code: t.code, mismatch: false };
        if (cur) return { v: cur, src: "term", tp, code: t.code, mismatch: false };
        return { v: "", src: "", tp, code: t.code, mismatch: false };
    }
    API.pod = pod; API.termParts = termParts; API.placeVal = placeVal; API.same = same;
    // 商談の記録の「CIF ル・アーヴル」が「CIF ル」で入っている案件（前の版で作った分）を、記録のとおりに戻す
    function termRepair(S: any): boolean {
        try {
            if (!S || !S.v61fb || (S.v61man && S.v61man.term) || typeof v61dlRecById !== "function" || typeof v61dlRecTerm !== "function") return false;
            const rec = v61dlRecById(S.v61fb.id); if (!rec) return false;
            const t = v61dlRecTerm(rec); if (!t || !t.place) return false;
            const full = (t.code + " " + t.place).trim(), now = String(S.term || "").trim();
            if (full !== now && now.length < full.length && full.indexOf(now) === 0 && /・/.test(full.slice(now.length, now.length + 1))) {
                S.term = full;
                if (S.v61fb.snap && String(S.v61fb.snap.term || "") === now) S.v61fb.snap.term = full;
                try { if (typeof v54docSyncRows === "function") v54docSyncRows(S); } catch (e) { }
                return true;
            }
        } catch (e) { }
        return false;
    }
    // 案件の pod を、決め方に合わせて書き直す（何度呼んでも同じ）。発注書の案件は触らない
    function sync(S: any): boolean {
        try {
            if (!S || isPo(S)) return false;
            let chg = termRepair(S);
            const t = termParts(S.term);
            const tp = C_D.test(t.code) ? placeVal(t.place, S) : "";
            const cur = placeVal(S.pod, S);
            if (cur && !S.v92podTerm) {
                if (tp && same(cur, tp)) { S.v92podTerm = 1; chg = true; }   // 取引条件の場所と同じ＝取引条件に付いて動く値
                return chg;
            }
            if (tp) {
                if (!cur || !same(cur, tp)) { S.pod = tp; chg = true; }
                if (!S.v92podTerm) { S.v92podTerm = 1; chg = true; }
            }
            else if (!cur) {
                const c = String(S.country || "");
                if (String(S.pod || "") !== c) { S.pod = c; chg = true; }
                if (S.v92podTerm) { delete S.v92podTerm; chg = true; }
            }
            return chg;
        } catch (e) { warn("sync", e); return false; }
    }
    API.sync = sync;
    const syncNow = () => { try { const S = ship(); if (S && sync(S)) save(); } catch (e) { } };
    function keep(S: any) {
        // 資料で登録した商品・業種サンプルのはじめの案件は入り直すと作り直される → r5a と同じ置き場に控える
        try { const t = ten(); if (t && t.shipEdit && typeof t.shipEdit === "object" && (t.src === "upload" || t.src === "sample2")) { const c = pod(S); t.shipEdit.v92r5a = { pod: c.v, podTerm: S.v92podTerm ? 1 : 0, etd: S.v92etdUser ? S.etd : "" }; } } catch (e) { }
    }
    function openEdit(id: string) { try { if (W.v92r5a && typeof W.v92r5a.openEdit === "function") W.v92r5a.openEdit(id); else if (typeof openStepEdit === "function") openStepEdit((typeof shipStep !== "undefined" && shipStep) || 0); } catch (e) { warn("openEdit", e); } }

    /* 「CIF ル・アーヴル」→ 場所が「ル」で切れる（もとの関数は「・」を区切りにして最初の1語を取る） */
    if (typeof v56shipTermPlace === "function") {
        const __tp = v56shipTermPlace;
        v56shipTermPlace = function (this: any, s: any, code: any) {
            const r = __tp.apply(this, arguments as any);
            try {
                if (r && /^[ァ-ヶー]+$/.test(r)) {
                    const x = NK(s); const i = x.indexOf(r + "・");
                    if (i >= 0) { const m = x.slice(i).match(/^[ァ-ヶー]+(?:・[ァ-ヶー]+)+/); if (m) return m[0]; }
                }
            } catch (e) { }
            return r;
        };
    }

    /* 揃える操作（書類の画面の箱・編集の窓から） */
    function alignPod(S: any) { const c = pod(S); if (!c.tp) return; S.pod = c.tp; S.v92podTerm = 1; keep(S); save(); rnd(); say(M(`仕向港を ${c.tp} にそろえました（S/I・荷印もこの港になります）`, `Port of discharge set to ${c.tp} (also used in the S/I and shipping marks)`, `目的港已统一为 ${c.tp}（S/I・唛头也使用该港）`, `Puerto de destino unificado: ${c.tp} (también en S/I y marcas)`)); }
    function alignTerm(S: any) {
        const c = pod(S); if (!c.v || !c.code) return;
        S.term = c.code + " " + c.v; S.v92podTerm = 1;
        try { if (S.v61man) S.v61man.term = 1; } catch (e) { }
        try { const t = ten(); if (t && t.shipEdit && typeof t.shipEdit === "object" && String(t.shipEdit.buyer || "") === String(S.buyer || "")) t.shipEdit.term = S.term; } catch (e) { }
        try { if (typeof v54docSyncRows === "function") v54docSyncRows(S); } catch (e) { }
        keep(S); save(); rnd();
        say(M(`取引条件を ${S.term} にそろえました（見積書・請求書の Delivery もこの場所になります）`, `Terms set to ${S.term} (also shown as Delivery on the quotation and invoice)`, `贸易条件已统一为 ${S.term}（报价单・发票的 Delivery 同步）`, `Condiciones unificadas: ${S.term} (también en Delivery de la cotización y la factura)`));
    }
    const T_MIS = (c: any) => M(`仕向港（${c.v}）と、取引条件の場所（${c.code} ${c.tp}）が違います`, `Port of discharge (${c.v}) differs from the place in the terms (${c.code} ${c.tp})`, `目的港（${c.v}）与贸易条件中的地点（${c.code} ${c.tp}）不一致`, `El puerto de destino (${c.v}) no coincide con el lugar de las condiciones (${c.code} ${c.tp})`);
    const H_MIS = () => M("見積書・請求書の Delivery には取引条件の場所、船積依頼書（S/I）・荷印には仕向港が出ます。CIF・CFR などでは取引条件の場所が仕向港なので、どちらかにそろえてください。", "The quotation / invoice show the place in the terms under Delivery; the S/I and shipping marks show the port of discharge. With CIF / CFR etc. the named place is the destination port, so align one with the other.", "报价单・发票的 Delivery 显示贸易条件中的地点，S/I・唛头显示目的港。CIF・CFR 等条件下两者应一致，请统一。", "La cotización / factura muestran el lugar de las condiciones en Delivery; el S/I y las marcas muestran el puerto de destino. Con CIF / CFR deben coincidir: unifíquelos.");

    /* ═════════ (2) 出港の予定日 ═════════ */
    const today = () => { try { return typeof v85docToday === "function" ? String(v85docToday()) : new Date().toISOString().slice(0, 10); } catch (e) { return new Date().toISOString().slice(0, 10); } };
    // 「過ぎた日」かどうかは、書類の日付と同じ実際のきょうで見る（完成形の見本は、アプリの中の「きょう」が見本の日付のため）
    const realToday = () => { let b = ""; try { const d = new Date(); b = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); } catch (e) { } const a = today(); return a > b ? a : b; };
    const addDays = (ymd: string, n: number) => { try { const d = new Date(ymd + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); } catch (e) { return ""; } };
    const dayDiff = (a: string, b: string) => Math.round((Date.parse(a + "T00:00:00Z") - Date.parse(b + "T00:00:00Z")) / 86400000);
    const YMD = /^\d{4}-\d{2}-\d{2}/;
    // 利用者が入れた（または年つきで決まっている）出港日。無ければ ""
    function etdUser(S: any): string { return (S && S.etd && YMD.test(String(S.etd))) ? String(S.etd).slice(0, 10) : ""; }
    function schedMd(S: any, re: RegExp): string { try { const it = ((S && S.sched) || []).find((x: any) => re.test(String((x && x[1]) || ""))); return it && /^\d{2}-\d{2}$/.test(String(it[0])) ? String(it[0]) : ""; } catch (e) { return ""; } }
    // 到着の見込み（年つき）。出港日より前にはならない
    function etaOf(S: any): string {
        const etd = etdUser(S); const md = schedMd(S, /ETA|到着/);
        if (!etd || !md) return "";
        let y = +etd.slice(0, 4); if (md < etd.slice(5)) y++;
        return y + "-" + md;
    }
    function transit(S: any): number { const a = schedMd(S, /ETD|出港/), b = schedMd(S, /ETA|到着/); if (!a || !b) return -1; const y = 2001; let n = dayDiff(y + "-" + b, y + "-" + a); if (n < 0) n += 365; return n; }
    const sailed = (S: any) => { const e = etdUser(S); return !!e && !!S.v92etdUser && e < realToday(); };
    API.etaOf = etaOf;
    function lateArrival(S: any): { eta: string, want: string, n: number } | null {
        try {
            const eta = etaOf(S), want = (S && YMD.test(String(S.want || ""))) ? String(S.want).slice(0, 10) : "";
            if (!eta || !want || eta <= want) return null;
            return { eta, want, n: dayDiff(eta, want) };
        } catch (e) { return null; }
    }

    /* ═════════ 点検の項目（1）（2） ═════════ */
    const PORT_T = "仕向港がありません";
    if (typeof v33CkQuote === "function") {
        const __ck = v33CkQuote;
        v33CkQuote = function (this: any) {
            syncNow();
            let F = __ck.apply(this, arguments as any);
            try {
                const S = ship();
                if (Array.isArray(F) && S && !isPo(S)) {
                    const c = pod(S);
                    if (c.v) F = F.filter((f: any) => !(f && f.t === PORT_T));
                    if (c.mismatch) F.push({ lv: "yel", t: T_MIS(c), how: H_MIS() + M("（「直す」で受注内容の編集が開きます）", " (“Fix” opens Edit order details)", "（点“修改”打开订单内容编辑）", " («Corregir» abre la edición del pedido)"), go: () => openEdit("v92r5aPod"), v92: "podmis" });
                    const la = lateArrival(S);
                    if (la) F.push({ lv: "yel", t: M(`到着の見込み（ETA ${la.eta}）が、希望着荷（${la.want}）より ${la.n}日 後です`, `Estimated arrival (ETA ${la.eta}) is ${la.n} days after the requested delivery date (${la.want})`, `预计到港（ETA ${la.eta}）比希望到货日（${la.want}）晚 ${la.n} 天`, `La llegada estimada (ETA ${la.eta}) es ${la.n} días posterior a la entrega solicitada (${la.want})`), how: M("出港の予定日を早めるか、着荷日を相手に確かめてください（「直す」で受注内容の編集が開きます。希望着荷もそこで直せます）", "Bring the sailing date forward or confirm the delivery date with the buyer (“Fix” opens Edit order details, where the requested date can also be changed)", "请提前出港日，或与对方确认到货日（点“修改”打开订单内容编辑）", "Adelante la salida o confirme la fecha de entrega con el comprador («Corregir» abre la edición del pedido)"), go: () => openEdit("v92r5aEtd"), v92: "etalate" });
                }
            } catch (e) { warn("ck", e); }
            return F;
        };
    }

    /* ═════════ 受注内容を編集：仕向港の欄を取引条件と連動させる／過ぎた出港日 ═════════ */
    function editExtra() {
        const S = ship();
        const seI: any = el("seI"), pf: any = el("v92r5aPod"), ef: any = el("v92r5aEtd"), g: any = el("seGo"), seW: any = el("seW");
        if (!S || !seI || !pf || !g || pf.getAttribute("data-v92r6c")) return;
        pf.setAttribute("data-v92r6c", "1");
        const c0 = pod(S);
        pf.value = c0.v;
        let touched = false, auto = c0.src !== "user";
        pf.insertAdjacentHTML("afterend", `<div id="v92r6cPodHint" class="v92r6c-hint" data-noi18n role="status" hidden></div>`);
        const hint: any = el("v92r6cPodHint");
        const tpNow = () => { const t = termParts(seI.value || S.term); return { code: t.code, tp: C_D.test(t.code) ? placeVal(t.place, S) : "" }; };
        const paint = () => {
            try {
                const t = tpNow(), pv = String(pf.value || "").trim();
                let h = "", yel = false;
                if (pv && !placeVal(pv, S)) { yel = true; h = E(M("国名だけでは港が決まりません。港・空港の名前を入れてください（このまま保存すると、仕向港は未入力の扱いになり、S/I は［要確認］になります）。", "A country name alone does not identify the port. Enter the port / airport (if saved as is, the port is treated as not entered and the S/I shows [To be confirmed]).", "仅有国名无法确定港口，请填写港口・机场名称（照此保存则视为未填写，S/I 显示［待确认］）。", "El nombre del país no basta. Introduzca el puerto / aeropuerto (si guarda así, se trata como no introducido).")); }
                else if (pv && t.tp && !same(pv, t.tp)) {
                    yel = true;
                    h = E(M(`取引条件の場所は ${t.tp}、仕向港は ${pv} です。${t.code} では取引条件の場所が仕向港です。このまま保存すると、見積書・請求書は ${t.tp}、S/I・荷印は ${pv} になり、点検に黄で出ます。`, `The terms say ${t.tp}; the port of discharge says ${pv}. Under ${t.code} the named place is the destination port. If saved as is, the quotation / invoice show ${t.tp} and the S/I / marks show ${pv}; the check will flag it.`, `贸易条件的地点为 ${t.tp}，目的港为 ${pv}。${t.code} 下两者应一致。照此保存则报价单・发票显示 ${t.tp}，S/I・唛头显示 ${pv}，检查时会以黄色提示。`, `Las condiciones indican ${t.tp}; el puerto de destino, ${pv}. Con ${t.code} deben coincidir. Si guarda así, la revisión lo marcará.`)) +
                        ` <button type="button" class="btn g" id="v92r6cPodFit">${E(M(`仕向港を ${t.tp} にする`, `Set the port to ${t.tp}`, `将目的港改为 ${t.tp}`, `Usar ${t.tp} como puerto`))}</button>`;
                }
                else if (pv && t.tp && auto) h = E(M("取引条件の場所から入れています。取引条件の場所を変えると、ここも一緒に変わります。", "Taken from the place in the terms. If you change that place, this field follows.", "取自贸易条件中的地点；修改该地点时此处同步变化。", "Tomado del lugar de las condiciones; si lo cambia, este campo lo sigue."));
                hint.hidden = !h; hint.className = "v92r6c-hint" + (yel ? " yel" : ""); hint.innerHTML = h;
                const b: any = el("v92r6cPodFit");
                if (b) b.addEventListener("click", () => { pf.value = tpNow().tp; auto = true; touched = false; paint(); });
            } catch (e) { warn("paint", e); }
        };
        seI.addEventListener("input", () => { const t = tpNow(); if (!touched && auto && t.tp) pf.value = t.tp; paint(); });
        pf.addEventListener("input", () => { touched = true; auto = false; paint(); });
        paint();
        // 過ぎた出港日・希望着荷に間に合わない出港日
        if (ef) {
            ef.insertAdjacentHTML("afterend", `<div id="v92r6cEtdHint" class="v92r6c-hint" data-noi18n role="status" hidden></div>`);
            const eh: any = el("v92r6cEtdHint");
            const tr = transit(S);
            const ep = () => {
                try {
                    const v = String(ef.value || ""), L: string[] = []; let yel = false;
                    if (YMD.test(v) && v < realToday()) L.push(M("過ぎた日です。出港済み（実績の日）として、入れた年のまま使います。請求書の ETD もこの日になり、ETA はこの日から数えます。", "This date has passed. It is kept as entered (actual sailing date): the invoice ETD shows this date and ETA is counted from it.", "该日期已过。按填写的年份作为实际出港日使用：发票的 ETD 为该日，ETA 由该日起算。", "Fecha pasada. Se usa tal cual (fecha real de salida): el ETD de la factura será esta fecha y el ETA se cuenta desde ella."));
                    const w = seW ? String(seW.value || "") : "";
                    if (YMD.test(v) && YMD.test(w) && tr >= 0) { const eta = addDays(v, tr); if (eta > w) { yel = true; L.push(M(`この出港日だと、到着の見込みは ${eta} で、希望着荷（${w}）より ${dayDiff(eta, w)}日 後です。`, `With this sailing date the estimated arrival is ${eta}, ${dayDiff(eta, w)} days after the requested delivery date (${w}).`, `按此出港日，预计 ${eta} 到港，比希望到货日（${w}）晚 ${dayDiff(eta, w)} 天。`, `Con esta salida la llegada estimada es ${eta}, ${dayDiff(eta, w)} días después de la entrega solicitada (${w}).`)); } }
                    eh.hidden = !L.length; eh.className = "v92r6c-hint" + (yel ? " yel" : ""); eh.textContent = L.join(" ");
                } catch (e) { }
            };
            ef.addEventListener("input", ep); ef.addEventListener("change", ep); if (seW) { seW.addEventListener("input", ep); seW.addEventListener("change", ep); }
            ep();
        }
        const o = g.onclick;
        if (typeof o === "function") {
            g.onclick = function (this: any, ev: any) {
                let pv = "", wasAuto = false;
                try { pv = String(pf.value || "").trim(); wasAuto = auto && !touched; } catch (e) { }
                const rr = o.call(this, ev);
                try {
                    const T = ship();
                    if (T && T === S && !isPo(T)) {
                        const pvN = pv ? placeVal(pv, T) : "";
                        if (pvN) { T.pod = pvN; if (wasAuto) T.v92podTerm = 1; else delete T.v92podTerm; }
                        else { T.pod = String(T.country || ""); delete T.v92podTerm; }
                        sync(T);
                        const c = pod(T);
                        keep(T); save(); rnd();
                        const la = lateArrival(T);
                        const msgs: string[] = [];
                        if (pv && !pvN) msgs.push(M(`仕向港の欄は国名（${pv}）だったので、港は未入力のままです。`, `The port field held a country name (${pv}), so the port is still not entered.`, `目的港栏填写的是国名（${pv}），港口仍视为未填写。`, `El campo del puerto contenía un país (${pv}); el puerto sigue sin introducir.`));
                        if (c.mismatch) msgs.push(T_MIS(c) + M("。書類の画面の黄色の箱で、どちらかにそろえられます。", ". Use the yellow box on the documents screen to align them.", "。可在单证页面的黄色框中统一。", ". Puede unificarlos en el recuadro amarillo de la pantalla de documentos."));
                        else if (c.v && c0.v && !same(c.v, c0.v) && wasAuto) msgs.push(M(`取引条件の場所に合わせて、仕向港も ${c.v} にしました（S/I・荷印もこの港になります）。`, `The port of discharge now follows the terms: ${c.v} (also used in the S/I and marks).`, `目的港已随贸易条件改为 ${c.v}（S/I・唛头同步）。`, `El puerto de destino sigue a las condiciones: ${c.v} (también en S/I y marcas).`));
                        if (la) msgs.push(M(`到着の見込み（${la.eta}）が希望着荷（${la.want}）より ${la.n}日 後です。`, `Estimated arrival (${la.eta}) is ${la.n} days after the requested delivery date (${la.want}).`, `预计到港（${la.eta}）比希望到货日（${la.want}）晚 ${la.n} 天。`, `La llegada estimada (${la.eta}) es ${la.n} días posterior a la entrega solicitada (${la.want}).`));
                        if (msgs.length) setTimeout(() => say(M("保存しました。", "Saved. ", "已保存。", "Guardado. ") + msgs.join(" ")), 350);
                    }
                } catch (e) { warn("editSave", e); }
                return rr;
            };
        }
    }
    if (typeof openStepEdit === "function") {
        const __ose = openStepEdit;
        openStepEdit = function (this: any, i: any) {
            try { if (i === 0) syncNow(); } catch (e) { }
            const r = __ose.apply(this, arguments as any);
            try { if (i === 0) editExtra(); } catch (e) { warn("ose", e); }
            return r;
        };
    }

    /* ═════════ 書類の画面：食い違いの箱（どちらに合わせるかを選ぶ）／出港済みの注記 ═════════ */
    function podNote() {
        try {
            const old = el("v92r6c-pod");
            const S = ship();
            const prem = document.querySelector("#v85doc .v85doc-prem") || document.querySelector(".v85doc-prem");
            const c = (S && !isPo(S)) ? pod(S) : null;
            if (!prem || !c || !c.mismatch) { if (old) old.remove(); return; }
            const after: any = el("v92r5a-etd") || prem;
            const sig = [c.v, c.tp, c.code, lang()].join("|");
            if (old && old.isConnected && old.getAttribute("data-sig") === sig && old.previousElementSibling === after) return;
            if (old) old.remove();
            const box = document.createElement("div");
            box.id = "v92r6c-pod"; box.className = "v92r6c-note yel"; box.setAttribute("data-noi18n", "1"); box.setAttribute("data-sig", sig); box.setAttribute("role", "note");
            box.innerHTML = `<b>${E(T_MIS(c))}</b><br><span>${E(H_MIS())}</span><div class="v92r6c-acts"><button type="button" class="btn g" data-v92r6c="pod">${E(M(`仕向港を ${c.tp} にそろえる`, `Use ${c.tp} as the port of discharge`, `目的港统一为 ${c.tp}`, `Usar ${c.tp} como puerto de destino`))}</button> <button type="button" class="btn g" data-v92r6c="term">${E(M(`取引条件を ${c.code} ${c.v} にそろえる`, `Change the terms to ${c.code} ${c.v}`, `贸易条件统一为 ${c.code} ${c.v}`, `Cambiar las condiciones a ${c.code} ${c.v}`))}</button></div>`;
            after.insertAdjacentElement("afterend", box);
            box.querySelectorAll("button").forEach((b: any) => b.addEventListener("click", () => { const T = ship(); if (!T) return; if (b.getAttribute("data-v92r6c") === "pod") alignPod(T); else alignTerm(T); }));
        } catch (e) { warn("podNote", e); }
    }
    function sailedNote() {
        try {
            const box: any = el("v92r5a-etd"); const S = ship();
            if (!box || !S || !sailed(S) || box.getAttribute("data-v92r6c") === box.getAttribute("data-sig")) return;
            const sp = box.querySelector("span"); if (!sp) return;
            const etd = etdUser(S), eta = etaOf(S);
            sp.textContent = M(`出港日：${etd}（過ぎた日のため、出港済み＝実績の日として扱っています）。請求書の ETD はこの日、ETA は${eta ? " " + eta : "この日から数えた日"}です。下の書類の期限も、この日から数えています。`,
                `Sailing date: ${etd} (already past, so treated as the actual sailing date). The invoice shows this as ETD${eta ? " and " + eta + " as ETA" : ""}. The deadlines below are counted from this date.`,
                `出港日：${etd}（已过，按实际出港日处理）。发票的 ETD 为该日${eta ? "，ETA 为 " + eta : ""}。下方单证期限按该日计算。`,
                `Fecha de salida: ${etd} (ya pasada: se trata como salida real). La factura muestra este ETD${eta ? " y ETA " + eta : ""}. Los plazos de abajo se cuentan desde esta fecha.`);
            box.setAttribute("data-v92r6c", box.getAttribute("data-sig") || "1");
        } catch (e) { warn("sailedNote", e); }
    }
    // 請求書・見積書の「ETD / ETA」：利用者が入れた出港日は年を動かさない。ETA は ETD より後
    function etdCell() {
        try {
            const o = el("dO"); const doc: any = o && o.querySelector(".doc"); const S = ship();
            if (!doc || !S || !S.v92etdUser) return;
            const etd = etdUser(S); if (!etd) return;
            const eta = etaOf(S);
            doc.querySelectorAll(".dl").forEach((dl: any) => {
                const c = Array.from(dl.children) as any[];
                for (let i = 0; i + 1 < c.length; i++) {
                    if (String(c[i].textContent || "").trim() !== "ETD / ETA") continue;
                    const v = c[i + 1]; if (v.querySelector("*")) continue;
                    const parts = String(v.textContent || "").split(/\s+\/\s+/);
                    const want = etd + " / " + (eta || parts[1] || "");
                    if (String(v.textContent || "").trim() !== want.trim()) { v.textContent = want; v.setAttribute("data-noi18n", "1"); v.setAttribute("lang", "en"); }
                }
            });
        } catch (e) { warn("etdCell", e); }
    }

    /* ═════════ (3) 船積依頼書：S/I・荷印・原産地証明の下書き ═════════ */
    if (typeof v85docParties === "function") {
        const __pt = v85docParties;
        v85docParties = function (this: any, F: any) {
            try { const S0 = F && F.ship; if (S0 && sync(S0)) save(); } catch (e) { }
            const P = __pt.apply(this, arguments as any);
            try {
                const S = (F && F.ship) || null;
                if (P) {
                    const inner = String(P.pod || "");
                    // 判断の表で仕向国を替えている間（もとの層が国名を入れる）・国名しか無いとき → 空欄（［要確認］に数える）
                    if (S && !isPo(S)) P.pod = (inner && inner !== String(S.pod || "") && !placeVal(inner, S)) ? "" : pod(S).v;
                    else P.pod = placeVal(inner, S || {});
                }
            } catch (e) { warn("parties", e); }
            return P;
        };
    }
    const blank = (v: any) => { const s = String(v == null ? "" : v).trim(); return !s || /^[—\-–]+$/.test(s); };
    if (typeof v85docGoods === "function") {
        const __gd = v85docGoods;
        v85docGoods = function (this: any, F: any) {
            const S = (F && F.ship) || null;
            // 梱包明細と同じ計算で、いまの数量のカートン数・重量にしてから読む（梱包明細を開いたときと同じ関数）
            try { if (S && !isPo(S) && typeof v68trPlFill === "function") v68trPlFill(S); } catch (e) { warn("plFill", e); }
            const rows = __gd.apply(this, arguments as any);
            try {
                if (Array.isArray(rows)) {
                    const ex = (S && S.docRows && Array.isArray(S.docRows.plEx)) ? S.docRows.plEx : [];
                    const vol = rows.length === 1 ? String(((ex.find((x: any) => Array.isArray(x) && x[0] === "Volume") || [])[1]) || "").trim() : "";
                    rows.forEach((r: any) => {
                        if (!Array.isArray(r)) return;
                        for (let j = 2; j <= 4; j++) if (blank(r[j])) r[j] = "";      // 空欄は［要確認］になり、印刷の前の確かめに数える
                        if (r[4] && vol && !blank(vol) && String(r[4]).indexOf(vol) < 0) r[4] = r[4] + " / " + vol;
                    });
                }
            } catch (e) { warn("goods", e); }
            return rows;
        };
    }
    if (typeof v85docSpec === "function") {
        const __sp = v85docSpec;
        v85docSpec = function (this: any, K: any) {
            const r = __sp.apply(this, arguments as any);
            try { if (K === "SI" && r && r.tb && Array.isArray(r.tb.c) && r.tb.c[4] === "Weight") r.tb = { c: r.tb.c.slice(0, 4).concat(["Weight / Measurement"]), r: r.tb.r }; } catch (e) { }
            return r;
        };
    }

    /* ═════════ (5a) health-R04：支払条件の出どころ ═════════ */
    function paySrcFix(S: any) {
        // 判断の表で建値だけ替えると、もとの層は「受注内容の編集で入れた」と書く。支払が記録の値のままなら、出どころは商談の記録
        try {
            if (!S || !S.v61fb || S.v90paySrc !== "edit") return;
            let rec: any = null;
            try { if (typeof v68trRecOf === "function") rec = v68trRecOf(S); } catch (e) { }
            try { if (!rec && typeof v61dlRecById === "function") rec = v61dlRecById(S.v61fb.id); } catch (e) { }
            if (!rec) return;
            let rp = String(rec.pay || "").trim();
            try { if (!rp && W.v92r4a && typeof W.v92r4a.recPay === "function") rp = String(W.v92r4a.recPay(rec) || "").trim(); } catch (e) { }
            if (rp && rp === String(S.pay || "").trim()) S.v90paySrc = "rec";
        } catch (e) { }
    }

    /* ═════════ (5b) culture-R06：仕向国と違う国の資料名 ═════════ */
    const ACR: any = { SFDA: "SA", SASO: "SA", MoIAT: "AE", ESMA: "AE", TFDA: "TW", MFDS: "KR", NMPA: "CN", GACC: "CN" };
    const CC_JA: any = { "サウジアラビア": "SA", "サウジ": "SA", "UAE": "AE", "アラブ首長国連邦": "AE", "台湾": "TW", "韓国": "KR", "中国": "CN", "香港": "HK", "タイ": "TH", "ベトナム": "VN", "シンガポール": "SG", "マレーシア": "MY", "インドネシア": "ID", "フィリピン": "PH", "インド": "IN", "米国": "US", "アメリカ": "US", "カナダ": "CA", "英国": "GB", "イギリス": "GB", "ドイツ": "DE", "フランス": "FR", "イタリア": "IT", "スペイン": "ES", "オランダ": "NL", "オーストラリア": "AU", "豪州": "AU", "ブラジル": "BR", "メキシコ": "MX", "ロシア": "RU", "トルコ": "TR", "カタール": "QA", "エジプト": "EG" };
    function srcOther(name: any, dest: string): string {
        // 資料名が、仕向国と違う国のものなら、その国の名前を返す（EU・湾岸は加盟国なら合う）
        try {
            const s = String(name || ""); if (!s || !dest || /各国|ほか|など|等）/.test(s)) return "";      // 「各国の…（ブラジル・南ア ほか）」のような、国をまたぐ資料は対象外
            const G = (typeof V85DOC_D !== "undefined" && V85DOC_D && V85DOC_D.groups) || {};
            const hits: string[] = [];
            Object.keys(CC_JA).forEach((k) => { const re = new RegExp("(^|[\\s　「『（(・／/])" + k + "($|[\\s　」』）)・／/のへ向])"); if (re.test(s)) hits.push(k); });
            Object.keys(ACR).forEach((k) => { if (new RegExp("(^|[^A-Za-z])" + k + "(?![A-Za-z])").test(s)) hits.push(k); });
            if (!hits.length) return "";
            const ccOf = (k: string) => CC_JA[k] || ACR[k];
            if (hits.some((k) => ccOf(k) === dest)) return "";
            if (/湾岸|GCC|GSO/.test(s) && (G.GCC || []).indexOf(dest) >= 0) return "";
            const k0 = hits[0];
            return CC_JA[k0] ? k0 : (Object.keys(CC_JA).find((n) => CC_JA[n] === ACR[k0]) || k0);
        } catch (e) { return ""; }
    }
    // 出港済み（実績の日）のときの期限の注記（r4a の「出港日を入れ直すと…」は、まだ出ていない前提の文）
    const PAST_T = "（出港の予定日そのものが過ぎています。出港日を入れ直すと、期限を計算し直します）";
    function dueTxt(h: any) {
        try {
            if (typeof h === "string" && h.indexOf(PAST_T) >= 0 && sailed(ship()))
                return h.split(PAST_T).join(`<span data-noi18n>${E(M("（出港済み〔実績の日〕から数えた日付です。まだ出港していないときは、出港の予定日を入れ直すと数え直します）", "(counted from the actual sailing date entered; if the cargo has not sailed yet, enter the planned date to recalculate)", "（按已出港的实际日期计算；若尚未出港，请重新填写预定出港日）", "(contado desde la fecha real de salida; si aún no ha salido, introduzca la fecha prevista)"))}</span>`);
        } catch (e) { }
        return h;
    }
    if (typeof v85docRowHtml === "function") {
        const __rh = v85docRowHtml;
        v85docRowHtml = function (this: any, r: any, J: any) {
            try {
                const dest = J && J.F && J.F.dest;
                if (r && dest && Array.isArray(r.src) && r.src.length) {
                    const fit: any[] = [], oth: any[] = [];
                    r.src.forEach((x: any) => { const o = x && x.s ? srcOther(x.s, dest) : ""; if (o) oth.push(Object.assign({}, x, { s: x.s + M(`〔${o}の資料。仕向国の決まりは要確認〕`, ` [source for another country (${o}); check the destination's rules]`, `〔${o}的资料，目的国规定需确认〕`, ` [fuente de otro país (${o}); verifique las normas del destino]`), ok: /^確認済み/.test(String(x.ok || "")) ? "要確認" : x.ok })); else fit.push(x); });
                    if (oth.length) return dueTxt(__rh.call(this, Object.assign({}, r, { src: fit.concat(oth) }), J));
                }
            } catch (e) { warn("rowHtml", e); }
            return dueTxt(__rh.apply(this, arguments as any));
        };
    }

    /* ═════════ 描く前後 ═════════ */
    let tm: any = 0;
    function after() { try { podNote(); sailedNote(); etdCell(); legalWhy(); fwdHint(); } catch (e) { warn("after", e); } }
    const later = () => { try { clearTimeout(tm); tm = setTimeout(after, 200); setTimeout(after, 800); } catch (e) { } };
    API.after = after;
    if (typeof vOpsDoc === "function") {
        const __vod = vOpsDoc;
        vOpsDoc = function (this: any) { syncNow(); try { paySrcFix(ship()); } catch (e) { } return __vod.apply(this, arguments as any); };
    }
    if (typeof rDoc === "function") {
        const __rd = rDoc;
        rDoc = function (this: any) {
            syncNow(); try { paySrcFix(ship()); } catch (e) { }
            const r = __rd.apply(this, arguments as any);
            try { etdCell(); } catch (e) { }
            later();
            return r;
        };
    }
    if (typeof render === "function") {
        const __r = render;
        render = function (this: any) { const r = __r.apply(this, arguments as any); later(); return r; };
    }
    if (typeof v85docRepaint === "function") {
        const __rp = v85docRepaint;
        v85docRepaint = function (this: any) { const r = __rp.apply(this, arguments as any); later(); return r; };
    }

    /* ═════════ (5c) 契約書関連：②の2つのボタンが押せない理由をボタンのそばに ═════════ */
    function legalWhy() {
        try {
            const a: any = el("leggo"), b: any = el("legwhich"); const old = el("v92r6c-legwhy");
            if (!a || !b || !(a.disabled && b.disabled)) { if (old) old.remove(); return; }
            if (old && old.isConnected) return;
            const row = a.parentElement; if (!row) return;
            row.insertAdjacentHTML("afterend", `<small id="v92r6c-legwhy" class="v92r6c-why" data-noi18n role="note">${E(M("この2つのボタンは、AIエンジンが未接続のため、いまは押せません（起草・相談は AI が文章を作るためです）。接続すると押せるようになります。相手・種別の選択はこのまま残ります。", "These two buttons are disabled because the AI engine is not connected (drafting and advice are generated by the AI). They become available once it is connected. Your buyer / type selection is kept.", "由于 AI 引擎未连接，这两个按钮目前无法点击（起草与咨询由 AI 生成）。连接后即可使用，已选的对象・类型会保留。", "Estos dos botones están desactivados porque el motor de IA no está conectado. Estarán disponibles al conectarlo; la selección se conserva."))}</small>`);
        } catch (e) { warn("legalWhy", e); }
    }

    /* ═════════ (4) 物流会社：AI物流マン／FOB の依頼の金額がどこから来るか ═════════ */
    const fOn = () => { try { return typeof FWDON !== "undefined" && !!FWDON && typeof FWDB !== "undefined" && !!FWDB; } catch (e) { return false; } };
    const fMe = () => { try { return typeof fwdCo === "function" ? String(fwdCo()) : String((FWDB.profile && FWDB.profile.co) || ""); } catch (e) { return ""; } };
    const Y = (n: any) => "¥" + Math.round(+n || 0).toLocaleString();
    const fSt = (r: any) => { try { return typeof fwdReqStatus === "function" ? String(fwdReqStatus(r)) : String(r.status || ""); } catch (e) { return String((r && r.status) || ""); } };
    const ownLegs = (r: any): any[] => { try { if (typeof W.v90fOwnLegs === "function") return W.v90fOwnLegs(r) || []; } catch (e) { } const m = fMe(); return ((r && r.legs) || []).map((l: any) => ({ l, o: (l.offers || []).find((x: any) => x && x.co === m) || null })); };
    const isAirM = (m: any) => /AIR|COURIER/i.test(String(m || ""));
    // FOB の依頼の金額：どこから来て、どこを直すと変わるか（窓と AI の答えで同じ文）
    const FOB_SRC = () => M("FOB の依頼の見積合計は「THC等諸掛＋書類費」だけです。この2つは、レート表ではなく、アプリが依頼の貨物（量・重さ・荷姿・輸送の形）から決まった式で出す標準の額です。直す欄は、いまの版にはありません（運賃＝区間のレートを直しても、FOB の依頼の見積合計は変わりません。運賃は買い手の負担のためです）。",
        "For an FOB request the total is only “terminal charges + documentation”. Both are standard amounts the app calculates from the cargo of the request (volume, weight, packing, mode), not from the rate table. There is no field to edit them in this version (editing the freight, i.e. the lane rate, does not change an FOB total because the freight is paid by the buyer).",
        "FOB 请求的报价合计仅为“THC 等杂费＋单证费”。这两项不是来自费率表，而是系统按该请求的货物（体积・重量・包装・运输方式）以固定公式算出的标准金额。当前版本没有可修改的栏位（修改运费＝区间费率不会改变 FOB 请求的合计，因为运费由买方承担）。",
        "En una solicitud FOB el total es solo «gastos de terminal + documentación». Ambos son importes estándar que la aplicación calcula a partir de la carga (volumen, peso, embalaje, modo), no de la tabla de tarifas. No hay campo para editarlos en esta versión (cambiar el flete no modifica un total FOB porque lo paga el comprador).");
    const FOB_CHG = () => M("区間のレートを直して変わるのは、CFR・CIF など運賃込みの依頼の見積合計と、相見積の比較に使う所要日数・有効期限です。", "Editing the lane rate changes the totals of freight-inclusive requests (CFR, CIF, etc.) and the transit days / validity used in the comparison.", "修改区间费率会改变 CFR・CIF 等含运费请求的合计，以及比价所用的航程天数・有效期。", "Cambiar la tarifa del tramo modifica los totales de las solicitudes con flete incluido (CFR, CIF, etc.) y los días de tránsito / validez usados en la comparación.");
    function brkOf(r: any): string[] {
        const out: string[] = [];
        ownLegs(r).forEach((it: any) => {
            const q = it && it.o && it.o.quote, rt = it && it.o && it.o.rate, l = it && it.l;
            if (!q) return;
            const air = isAirM(q.mode || (rt && rt.mode)), fob = !!q.v56shipFob;
            const rateT = rt ? `${rt.cur || "¥"}${(+rt.price || 0).toLocaleString()}${rt.unit || ""}` : "";
            const lane = `${(rt && rt.pol) || r.pol || ""} → ${(rt && rt.pod) || (l && (l.pod || l.cty)) || ""}`;
            if (fob) out.push(M(`${lane}：見積合計 ${Y(q.total)} ＝ ${air ? "取扱いの諸掛" : "THC等諸掛"} ${Y(q.thc)} ＋ 書類費 ${Y(q.doc)}（FOB のため、${air ? "航空運賃" : "海上運賃"}${rateT ? " " + rateT : ""} は買い手の負担で、合計に入りません）`, `${lane}: total ${Y(q.total)} = terminal charges ${Y(q.thc)} + documentation ${Y(q.doc)} (FOB: the freight${rateT ? " " + rateT : ""} is paid by the buyer and not included)`, `${lane}：合计 ${Y(q.total)} ＝ 杂费 ${Y(q.thc)} ＋ 单证费 ${Y(q.doc)}（FOB：运费${rateT ? " " + rateT : ""}由买方承担，不计入）`, `${lane}: total ${Y(q.total)} = gastos ${Y(q.thc)} + documentación ${Y(q.doc)} (FOB: el flete${rateT ? " " + rateT : ""} lo paga el comprador)`));
            else out.push(M(`${lane}：見積合計 ${Y(q.total)} ＝ 運賃 ${Y(q.freight)}${rateT ? "（" + rateT + (q.basis ? " × " + q.basis : "") + "）" : ""}${q.courier ? "" : ` ＋ THC等諸掛 ${Y(q.thc)} ＋ 書類費 ${Y(q.doc)}`}`, `${lane}: total ${Y(q.total)} = freight ${Y(q.freight)}${rateT ? " (" + rateT + (q.basis ? " × " + q.basis : "") + ")" : ""}${q.courier ? "" : ` + terminal charges ${Y(q.thc)} + documentation ${Y(q.doc)}`}`, `${lane}：合计 ${Y(q.total)} ＝ 运费 ${Y(q.freight)}${q.courier ? "" : ` ＋ 杂费 ${Y(q.thc)} ＋ 单证费 ${Y(q.doc)}`}`, `${lane}: total ${Y(q.total)} = flete ${Y(q.freight)}${q.courier ? "" : ` + gastos ${Y(q.thc)} + documentación ${Y(q.doc)}`}`));
        });
        return out;
    }
    const HOW_FIX = () => M("金額の直し方：「見積受信箱」で依頼の行の「回答の金額を直す」→「この区間の金額を直す（レート管理で）」→ 物流レート管理の手入力の欄に今の値が入るので、直して「追加」。直すのは「区間のレート」で、同じ区間のほかの依頼の見積にも使われます。この依頼だけの金額（スポットの見積）は出せません。見積がまだ無い依頼は、行の「レートを登録して回答」から区間のレートを登録します。",
        "To change an amount: in the Quote inbox press “Edit the reply amount” on the request row → “Edit this lane's price (in Rates)” → the manual form in Rates is prefilled; edit it and press Add. This edits the lane rate, which is also used for other requests on the same lane. A one-off (spot) price for a single request is not available. For a request with no quote yet, use “Register a rate and reply” on the row.",
        "修改金额：在“报价收件箱”中点该请求行的“修改回复金额”→“修改该区间金额（在费率管理中）”→ 费率管理的手动输入栏会带入当前值，修改后点“添加”。修改的是“区间费率”，同区间的其他请求也会使用。无法只为单个请求报价（现货报价）。尚无报价的请求，请用该行的“登记费率并回复”。",
        "Para cambiar un importe: en la Bandeja de cotizaciones pulse «Corregir el importe» en la fila → «Editar el precio de este tramo (en Tarifas)» → edite el formulario y pulse Añadir. Se edita la tarifa del tramo, que también se usa en otras solicitudes del mismo tramo. No hay precio puntual (spot) para una sola solicitud. Si aún no hay cotización, use «Registrar tarifa y responder».");
    const ASK_BRK = /内訳|うちわけ|breakdown|(金額|合計|見積).*(どこから|変わらな|のまま)|(変わらな|のまま).*(金額|合計|見積)/i;
    const ASK_FIX = /(金額|見積|回答|合計|料金|運賃|THC|書類費|諸掛).*(直す|直し|直せ|直した|変える|変えた|変えられ|変更|修正|訂正|下げ|上げ)|スポット|spot|(直す|直し|変える|変更).*(金額|見積)/i;
    function fwdAns(q: string, inner: any): any {
        const s = String(q || "");
        const base = (inner && inner.c) || "";
        const reqs: any[] = (FWDB.reqs || []);
        // (a) 金額の直し方・内訳・スポット
        const idm = s.match(/RQ-[A-Z0-9]+/i);
        const rq = idm ? reqs.find((r: any) => r && String(r.id).toUpperCase() === idm[0].toUpperCase()) : null;
        const askBrk = ASK_BRK.test(s);
        const askFix = ASK_FIX.test(s);
        if (askBrk || askFix) {
            const L: string[] = [];
            const targets = rq ? [rq] : (askBrk ? reqs.filter((r: any) => ownLegs(r).some((it: any) => it && it.o && it.o.quote)).slice(0, 3) : []);
            if (rq && !brkOf(rq).length) L.push(E(M(`${rq.id} には、貴社の見積がまだありません（状況：${fSt(rq)}）。`, `${rq.id} has no quote from your company yet (status: ${fSt(rq)}).`, `${rq.id} 尚无贵公司的报价（状态：${fSt(rq)}）。`, `${rq.id} aún no tiene cotización de su empresa (estado: ${fSt(rq)}).`)));
            targets.forEach((r: any) => { const B = brkOf(r); if (B.length) L.push(`<b>${E(r.id)}</b>（${E(r.co || "")}・${E(r.term || "")}）<br>` + B.map((x) => "・" + E(x)).join("<br>")); });
            const anyFob = targets.some((r: any) => ownLegs(r).some((it: any) => it && it.o && it.o.quote && it.o.quote.v56shipFob)) || /FOB|スポット|spot|THC|書類費|諸掛|変わらな|まま/i.test(s) || (!targets.length && reqs.some((r: any) => /FOB/i.test(String(r.term || ""))));
            if (askFix || !targets.length) L.push(E(HOW_FIX()));
            if (anyFob) L.push(E(FOB_SRC()) + "<br>" + E(FOB_CHG()));
            return { a: L.join("<br><br>"), c: base };
        }
        // (b) 未対応の依頼：見積受信箱の「要確認」と同じ数え方（レートが無くて見積を出せなかった依頼）だけ
        if (/未対応|要確認|出せなかった|未回答|unanswered|pending/i.test(s) && /依頼|見積|リクエスト|request|は[?？]?$/i.test(s)) {
            const ng = reqs.filter((r: any) => /未登録|要確認/.test(fSt(r)));
            const done = reqs.length - ng.length;
            const head = M(`未対応（要確認）の依頼は<b>${ng.length}件</b>です（受信 ${reqs.length}件のうち、レートが無くて見積を出せなかった依頼。見積受信箱の「要確認」と同じ数え方）。`, `<b>${ng.length}</b> request(s) need attention (of ${reqs.length} received: no matching rate, so no quote was sent; same count as “To check” in the Quote inbox).`, `未处理（待确认）的请求共 <b>${ng.length}</b> 件（已接收 ${reqs.length} 件中，因无费率而未能报价；与报价收件箱的“待确认”口径相同）。`, `<b>${ng.length}</b> solicitud(es) pendientes (de ${reqs.length} recibidas: sin tarifa aplicable; mismo criterio que «Por revisar» en la bandeja).`);
            const rows = ng.slice(0, 8).map((r: any) => `・${E(r.d || "")} ${E(r.id)}（${E(r.co || "")}）${E(r.pol || "")}→${E(r.cty || "")}：${E(fSt(r))}`).join("<br>");
            const tail = (done > 0 ? M(`残りの ${done}件は見積を出し済み（AI回答済みなど）のため、ここには並べていません。`, `The other ${done} already have a quote (answered by AI etc.) and are not listed here.`, `其余 ${done} 件已报价（AI 已回复等），未列出。`, `Las otras ${done} ya tienen cotización y no se listan aquí.`) : "") +
                (ng.length ? M("行の「レートを登録して回答」で区間のレートを登録すると、見積が出ます。", " Use “Register a rate and reply” on the row to register the lane rate; the quote is then sent.", "点该行的“登记费率并回复”登记区间费率后即可报价。", " Use «Registrar tarifa y responder» en la fila para enviar la cotización.") : "");
            return { a: head + (rows ? "<br>" + rows : "") + (tail ? "<br>" + tail : ""), c: base };
        }
        // (c) レート表のアップロード（取り込み）はいつ：履歴のうち、レート表・レートの操作だけ
        if (/アップロード|取り込|upload/i.test(s) && /いつ|最近|最後|履歴|when|last/i.test(s)) {
            const f2 = (t: any) => { const d = new Date(t); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
            const H: any[] = (FWDB.hist || []);
            const up = H.filter((h: any) => h && /アップロード|取り込|レート表|レートを|レートの|upload/i.test(String(h.d || "")) && !/見積依頼を受信/.test(String(h.d || "")));
            if (up.length) return { a: M(`レート表・レートの操作の記録は ${up.length}件です（新しい順）：`, `${up.length} rate-table / rate operation(s) on record (newest first):`, `费率表・费率操作记录共 ${up.length} 条（按时间倒序）：`, `${up.length} operación(es) de tarifas registradas (más recientes primero):`) + "<br>" + up.slice(0, 6).map((h: any) => `・${E(f2(h.t))}　${E(h.d)}`).join("<br>"), c: base };
            return { a: M(`レート表のアップロード（取り込み）の記録は、操作履歴にまだありません。履歴の ${H.length}件は、見積依頼の受信などレート表以外の記録です。いまのレート表は ${(FWDB.rates || []).length}レーンです。「物流レート管理」でレート表を取り込むか、手入力で追加すると、その日時がここに残ります。`, `There is no rate-table upload on record yet. The ${H.length} history entries are other events (e.g. quote requests received). The current rate table has ${(FWDB.rates || []).length} lanes. Uploading a table or adding a rate in “Rates” records the date here.`, `操作记录中尚无费率表上传记录。现有 ${H.length} 条记录为收到报价请求等其他记录。当前费率表共 ${(FWDB.rates || []).length} 条。在“费率管理”中上传或手动添加后，会记录时间。`, `Aún no hay cargas de tablas de tarifas registradas. Las ${H.length} entradas del historial son otros eventos. La tabla actual tiene ${(FWDB.rates || []).length} tramos.`), c: base };
        }
        // (d) 「◯◯向けのレーンはある？」：自社のレーンだけ（ほかの物流会社は本数だけ）
        try {
            const a0 = String((inner && inner.a) || "");
            if (/レーン<\/b>登録があります/.test(a0)) {
                const ctyHit = (typeof FWD_POD !== "undefined" && FWD_POD ? Object.keys(FWD_POD).find((c) => s.includes(c)) : "") || (s.includes("米国") ? "アメリカ" : "");
                const podHit = [...new Set((FWDB.rates || []).map((r: any) => r.pod))].find((p: any) => p && s.includes(p)) as any;
                const key = podHit || (ctyHit && FWD_POD[ctyHit]) || ctyHit;
                if (key) {
                    const rs = (FWDB.rates || []).filter((r: any) => r && (r.pod === key || String(r.pod || "").includes(key) || (ctyHit && (r.pod === ctyHit || String(r.pod || "").includes(ctyHit) || String(r.note || "").includes(ctyHit)))));
                    const me = fMe();
                    const own = rs.filter((r: any) => String(r.co || me) === me), oth = rs.filter((r: any) => String(r.co || me) !== me);
                    const line = (r: any) => { let ok = true; try { ok = typeof fwdRateValid === "function" ? !!fwdRateValid(r) : true; } catch (e) { } return `・${E(r.pol)}→${E(r.pod)}（${E(r.mode)}）<b>${E(r.cur)}${(+r.price || 0).toLocaleString()}${E(r.unit)}</b>／${E(M("所要", "transit ", "航程", "tránsito "))}${E(r.tt)}${E(M("日", " days", "天", " días"))}／${E(M("有効", "valid to ", "有效期", "válida hasta "))}${E(r.valid)}${ok ? "" : E(M("（期限切れ・見積には使いません）", " (expired; not used for quotes)", "（已过期，不用于报价）", " (caducada)"))}`; };
                    const nm = E(ctyHit || podHit);
                    let h = own.length
                        ? M(`<b>${nm}向け</b>の自社（${E(me)}）のレーンは<b>${own.length}本</b>です：`, `Your company (${E(me)}) has <b>${own.length}</b> lane(s) to <b>${nm}</b>:`, `贵公司（${E(me)}）前往<b>${nm}</b>的航线共 <b>${own.length}</b> 条：`, `Su empresa (${E(me)}) tiene <b>${own.length}</b> tramo(s) a <b>${nm}</b>:`) + "<br>" + own.slice(0, 6).map(line).join("<br>")
                        : M(`<b>${nm}向け</b>の自社（${E(me)}）のレーンは未登録です。「物流レート管理」から追加すると、見積に使います。`, `Your company (${E(me)}) has no lane to <b>${nm}</b>. Add one in “Rates” to use it for quotes.`, `贵公司（${E(me)}）尚未登记前往<b>${nm}</b>的航线。`, `Su empresa (${E(me)}) no tiene tramos a <b>${nm}</b>.`);
                    if (oth.length) h += "<br>" + M(`<span style="font-size:10.5px;color:var(--ink-3)">ほかの物流会社の登録が ${oth.length}本あります（個別の運賃はここには出しません。相見積の状況は「相見積・AI推奨」で見られます）。</span>`, `<span style="font-size:10.5px;color:var(--ink-3)">Other forwarders have ${oth.length} lane(s) (their individual rates are not shown here; see “Comparison / AI pick”).</span>`, `<span style="font-size:10.5px;color:var(--ink-3)">其他物流公司登记了 ${oth.length} 条（此处不显示其具体运费）。</span>`, `<span style="font-size:10.5px;color:var(--ink-3)">Otros transitarios tienen ${oth.length} tramo(s) (sus tarifas no se muestran aquí).</span>`);
                    return { a: h, c: base };
                }
            }
        } catch (e) { warn("laneAns", e); }
        return null;
    }
    if (typeof fwdBrain === "function") {
        const __fb = fwdBrain;
        fwdBrain = function (this: any, q: any) {
            const o = __fb.apply(this, arguments as any);
            try { if (fOn()) { const mine = fwdAns(String(q || ""), o); if (mine && mine.a) return mine; } } catch (e) { warn("fwdBrain", e); }
            return o;
        };
    }
    API.fwdAns = (q: string) => { try { return fwdAns(q, { c: "" }); } catch (e) { return null; } };
    // 金額の直し方・内訳・スポットの質問は、操作ガイドの一般の手引きより先に、ここで答える（窓と同じ文・同じ数）
    if (typeof fwdAsk === "function") {
        const __fa = fwdAsk;
        fwdAsk = function (this: any, v: any) {
            try {
                const s = String(v || "").trim();
                if (s && fOn() && (ASK_BRK.test(s) || ASK_FIX.test(s))) {
                    const k = fwdAns(s, { c: M(`根拠：見積依頼 ${(FWDB.reqs || []).length}件の自社の見積の内訳・「回答の金額を直す」の窓と同じ内容（内蔵の計算。実AIは使っていません）`, `Basis: breakdown of your quotes for ${(FWDB.reqs || []).length} request(s); same content as the “Edit the reply amount” window (built-in calculation, no live AI)`, `依据：${(FWDB.reqs || []).length} 件请求中贵公司报价的明细，与“修改回复金额”窗口内容相同（内置计算）`, `Base: desglose de sus cotizaciones para ${(FWDB.reqs || []).length} solicitud(es) (cálculo integrado)`) });
                    if (k && k.a) {
                        FWDB.chat = FWDB.chat || [];
                        FWDB.chat.push({ w: "u", t: E(s), ts: Date.now() });
                        FWDB.chat.push({ w: "a", t: k.a + `<div style="margin-top:6px;font-size:9.5px;color:var(--ink-3)">${E(k.c)}</div>`, ts: Date.now() });
                        FWDB.chat = FWDB.chat.slice(-60);
                        try { if (typeof fwdSave === "function") fwdSave(); } catch (e) { }
                        try { if (typeof fwdRender === "function") fwdRender(); } catch (e) { }
                        return Promise.resolve();
                    }
                }
            } catch (e) { warn("fwdAsk", e); }
            return __fa.apply(this, arguments as any);
        };
    }
    // 「回答の金額を直す」の窓：FOB の依頼の金額がどこから来ているか・直せる欄が無いこと
    function fwdHint() {
        try {
            if (!fOn()) return;
            const sh = el("v33sheet"); if (!sh || sh.querySelector(".v92r6c-fob")) return;
            const brk = Array.from(sh.querySelectorAll(".v92fansb")) as any[];
            const fob = brk.filter((x) => /FOB/.test(String(x.textContent || "")));
            if (!fob.length) return;
            fob[fob.length - 1].insertAdjacentHTML("afterend", `<div class="v92r6c-fob v92r6c-hint" data-noi18n role="note">${E(FOB_SRC())}<br>${E(FOB_CHG())}</div>`);
        } catch (e) { warn("fwdHint", e); }
    }
    if (typeof v90fAnsOpen === "function") {
        const __ao = v90fAnsOpen;
        v90fAnsOpen = function (this: any) { const r = __ao.apply(this, arguments as any); try { fwdHint(); setTimeout(fwdHint, 150); } catch (e) { } return r; };
    }
    if (typeof fwdRender === "function") {
        const __fr = fwdRender;
        fwdRender = function (this: any) { const r = __fr.apply(this, arguments as any); try { setTimeout(fwdHint, 200); } catch (e) { } return r; };
    }
    try { setTimeout(after, 1000); } catch (e) { }
})();
