/* 21.92 r9a：9巡目の直し（受注・書類・金額まわりで 8回目に残った課題）
   今の関数は包むだけ。数字・事実は作らない。前の層の直した写しは fix/r9a/ovr/（r8a の注文の並び・知らせの文・換算の行、r8b の輸送の読み方）。
   ■ この層で「1か所」に決めたこと
     (1) 案件の詳細の「書類をつくる」が開く出荷案件 ＝ 次の行動の文が指す案件（r6b の案件の書類 No.＝r6x の「案件 No.」と同じ lookup：docNoOf）。
         まだ書類が無いときに作る元の記録 ＝ その案件の商品の記録のうち、書類のまだ無い「受注」の記録のいちばん古いもの（無ければ、いちばん新しい記録）。
         別の商品の記録（見本の「抹茶スティック」など）は書類に入れない（sameItem）。
     (2) 書類の画面：案件のタブに相手・数量・額。「この書類の案件」の下に、どの注文の書類か（この相手の注文 N件のうち M件目）と、書類のまだ無い受注の記録。
         注文の番号は r8a の注文の一覧（記録した順。ovr で直した）と同じ。
     (3) 見積書の有効期限 ＝ 見積書の Date（S.date → 受注日 → 画面の今日 TODAYS。見本は見本の日付）から数える（v92docValid を包む）。
     (4) 輸送・建値を替えたら、書類の中身（注記）と点検を同時に描き直す（v85docSet を包む）。輸送の読み方は r8b の modeOf（ovr で判断の表と同じ読み方に）。
     (5) 建値の場所が空港なら、仕出港（港）の注記を出さない（海上のままなら「輸送」を航空にする一言）。
     (6) 活動レポート・案件の詳細の記録の価格 ＝ 確定単価があれば確定単価、無ければ希望価格（「希望」と書く）。
   課題：food-U01〜U04／indagri-U01〜U03・U05／medical-U01〜U04／xcut-U07・U08／health-U01・T08・T12／auto-U01〜U03・U06・T07／other-U01・T06／daily-U01〜U03 */
declare const D: any, TENS: any, I18N: any, SHIPS: any, SHIPA: any, TODAYS: any;
declare let TEN: any, cur: any, opsTab: any;
declare let rDoc: any, shipUse: any, render: any, v92docValid: any, v85docSet: any, v92docPolNote: any, dealSave: any, toast: any, a30Collect: any, a30Open: any, dashDrill: any, dashAgg: any, dashMoney: any, vDash: any, v56dCmpParts: any, openStepEdit: any;
declare function shipEnsure(): void;
declare function shipStartCase(o: any): any;
declare function v61dlId(rec: any): string;
declare function v61dlAllCases(): any[];
declare function v61dlEffPrice(rec: any): any;
declare function v61dlRecTerm(rec: any): any;
declare function v61dlIsPrice(v: any): boolean;
declare function v92docCode(s: any): string;
declare function v92docPlace(s: any, code: any): string;
declare function v92docAdd(ymd: any, n: number): string;
declare function v92docYmd(s: any): string;
declare function v83pxState(t: any): any;
declare function v85docCase(): any;
declare function v85docModeOf(S: any): string;
declare function v30Norm(s: any): string;
declare function cnorm(s: any): string;

declare function dashScopeUnits(): any[];
(function () {
    const W: any = window;
    if (W.__v2192r9a) return;
    W.__v2192r9a = 1;
    const API: any = (W.v92r9a = W.v92r9a || {});
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const lang = () => { try { const s: any = document.getElementById("lang"); const v = String((s && s.value) || (typeof I18N !== "undefined" && I18N && I18N.lang) || "ja"); return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja"; } catch (e) { return "ja"; } };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const warn = (k: string, e: any) => { try { console.warn("[v92r9a] " + k, e); } catch (x) { } };
    const dd = () => { try { return (typeof D !== "undefined" && D) ? D : null; } catch (e) { return null; } };
    const ten = () => { try { return (typeof TEN !== "undefined" && TEN) ? TEN : null; } catch (e) { return null; } };
    const norm = (s: any) => { try { if (typeof v30Norm === "function") return v30Norm(s); } catch (e) { } return String(s || "").toLowerCase().replace(/[\s.,　・\-]/g, ""); };
    const cn = (c: any) => { try { if (typeof cnorm === "function") return cnorm(c || "") || String(c || ""); } catch (e) { } return String(c || ""); };
    const nfkc = (s: any) => { let x = String(s == null ? "" : s); try { x = x.normalize("NFKC"); } catch (e) { } return x; };
    const num = (s: any): any => { const m = nfkc(s).match(/\d[\d,]*(?:\.\d+)?/); return m ? parseFloat(m[0].replace(/,/g, "")) : null; };
    const isObj = (r: any) => !!r && !Array.isArray(r) && typeof r === "object";
    const isMihon = (S: any) => !!S && (/（想定）/.test(String(S.buyer || "")) || /想定シナリオ/.test(String(S.qty || "")));
    const R6 = (): any => W.v92r6b || null;
    const R7 = (): any => W.v92r7a || {};
    const R8 = (): any => W.v92r8a || {};
    const allShips = (): any[] => { try { return (typeof v61dlAllCases === "function") ? (v61dlAllCases() || []) : []; } catch (e) { return []; } };
    const effP = (r: any): any => { try { return (typeof v61dlEffPrice === "function") ? v61dlEffPrice(r) : null; } catch (e) { return null; } };
    const fmtQty = (s: any): string => { try { if (R8().fmtQty) return R8().fmtQty(s); } catch (e) { } return String(s == null ? "" : s); };
    const recTxt = (r: any): string => {
        const p = effP(r), q = String((r && r.lot) || "").trim();
        let t: any = null; try { t = (typeof v61dlRecTerm === "function") ? v61dlRecTerm(r) : null; } catch (e) { }
        return [q ? fmtQty(q) : "", p ? p.s : "", t && t.code ? (t.code + " " + (t.place || "")).trim() : ""].filter(Boolean).join("・");
    };
    const casesAll = (): any[] => { try { const A = R6(); return (A && typeof A.cases === "function") ? (A.cases() || []) : []; } catch (e) { return []; } };
    const userTen = (t: any) => !!(t && (t.src === "upload" || t.src === "sample2"));
    const fbList = (): any[] => { try { const t = ten(); if (userTen(t)) return Array.isArray(t.fbx) ? t.fbx : []; const d = dd(); return (d && Array.isArray(d.fb)) ? d.fb : []; } catch (e) { return []; } };
    const curItem = (): string => { try { const d = dd(); return String((d && d.item) || ((ten() || {}) as any).item || ""); } catch (e) { return ""; } };
    /* その記録は、いまの商品の記録か（見本には別の商品〔抹茶スティック など〕の記録が入っている） */
    const sameItem = (r: any): boolean => {
        try {
            const a = norm(r && r.item), b = norm(curItem());
            if (!a || !b) return true;
            return a === b || a.indexOf(b) >= 0 || b.indexOf(a) >= 0;
        }
        catch (e) { return true; }
    };
    API.sameItem = sameItem;

    /* ══ (1) 案件の詳細 →「書類をつくる」 ══ */
    /* 次の行動の文が指す案件（r6x の docOf と同じ：r6b の案件で、相手の名前と商品の並びが合うもの） */
    const caseOf = (c: any): any => {
        try {
            const n = norm(c && c.name);
            if (!n) return null;
            return casesAll().find((x: any) => x && x.S && x.no && norm(x.buyer) === n && (c.pi == null || !x.u || x.u.i == null || x.u.i === c.pi)) || null;
        }
        catch (e) { return null; }
    };
    const docNoOf = (c: any): string => { const x = caseOf(c); return x ? String(x.no || "") : ""; };
    API.docNoOf = docNoOf;
    let WANT: any = null;
    /* 書類のまだ無い受注の記録（つながる出荷案件の無いもの） */
    const linkedIds = (): any => { const o: any = {}; allShips().forEach((S: any) => { if (S && S.v61fb && S.v61fb.id) o[String(S.v61fb.id)] = 1; }); return o; };
    const recsForCase = (c: any): any[] => {
        const k = norm(c.name), cty = c.cty ? cn(c.cty) : "";
        return fbList().map((r: any, i: number) => ({ r, i })).filter((x: any) => isObj(x.r) && x.r.b && norm(x.r.b) === k && (!cty || !x.r.c || cn(x.r.c) === cty))
            .sort((a: any, b: any) => String(b.r.d || "").localeCompare(String(a.r.d || "")) || a.i - b.i);       // 新しい順（同じ日は後から入れた記録が先）
    };
    const pickDoc = (c: any) => {
        try {
            if (!c) return;
            const d = dd();
            if (!d || !d.ship || typeof shipEnsure !== "function") return;
            shipEnsure();
            if (typeof SHIPS === "undefined" || !Array.isArray(SHIPS)) return;
            const cty = cn(c.cty);
            const nm = c.named ? String(c.name) : `${c.cty}の${c.biz || "バイヤー"}（ID ${c.id}）`;
            const hit = (S: any) => !!S && (S.v92case === c.id || (norm(S.buyer) === norm(nm) && cn(S.country) === cty));
            const L = SHIPS.map((x: any, i: number) => ({ x, i })).filter((o: any) => o.x && o.x.ship && hit(o.x.ship));
            if (L.length) {
                if (L.length < 2) return;                       // 1つだけなら、今まで（flow の caseDoc）と同じ
                const no = docNoOf(c);
                const p = no ? L.find((o: any) => String(o.x.ship.no) === no) : null;
                if (!p) return;
                WANT = { i: p.i, k: norm(p.x.ship.buyer), at: Date.now() };
                if (SHIPA !== p.i && typeof shipUse === "function") shipUse(p.i);
                return;
            }
            if (!c.named) return;                               // やりとりだけの相手は、今まで（flow）と同じ
            const R = recsForCase(c).filter((x: any) => x.r.st !== "失注");
            const R1 = R.filter((x: any) => sameItem(x.r));
            const ids = linkedIds();
            const won = R1.filter((x: any) => x.r.st === "受注" && !(x.r.v61id && ids[String(x.r.v61id)]));
            let rec: any = null;
            if (won.length) rec = won[won.length - 1].r;        // 書類のまだ無い受注の記録のいちばん古いもの（記録した順の1件目の注文）
            else if (R1.length) rec = R1[0].r;                  // いちばん新しい記録（今までと同じ）
            if (!rec && !R.length) return;                      // 記録が無い：今まで（flow）と同じ
            if (rec) { try { v61dlId(rec); } catch (e) { } }
            const ok = shipStartCase(rec ? { cty: cn(rec.c || c.cty), buyer: rec.b || nm, src: "fb", v61rec: rec } : { cty, buyer: nm, src: "my" });
            try { const S = SHIPS[SHIPA] && SHIPS[SHIPA].ship; if (ok && S && norm(S.buyer) === norm(rec ? rec.b : nm)) { S.v92case = c.id; if (!rec && R.length) S.v92r9aOther = 1; } } catch (e) { }
        }
        catch (e) { warn("pickDoc", e); }
    };
    API.pickDoc = pickDoc;
    try {
        if (typeof shipUse === "function") {
            const o = shipUse;
            shipUse = function (this: any, i: any) {
                try {
                    // 同じクリックの中で flow の caseDoc が1件目へ切り替えようとしたときだけ、選んだ案件へ（1回だけ・1秒以内。タブを押した操作には効かない）
                    if (WANT && Date.now() - WANT.at < 1000 && i !== WANT.i && SHIPS[i] && SHIPS[WANT.i] && SHIPS[i].ship && norm(SHIPS[i].ship.buyer) === WANT.k) {
                        const j = WANT.i;
                        WANT = null;
                        return o.call(this, j);
                    }
                }
                catch (e) { }
                return o.apply(this, arguments as any);
            };
        }
    }
    catch (e) { warn("shipUse-wrap", e); }
    try {
        // flow の caseDoc（document の capture）より前に、開く案件を決める（window の capture は document より先）
        window.addEventListener("click", (e: any) => {
            try {
                const tg = e.target && e.target.closest ? e.target : null;
                if (!tg) return;
                const b = tg.closest('.k-cd [data-kbc="ops:doc"]');
                if (b && W.RDX && W.RDX._case0) { pickDoc(W.RDX._case0); setTimeout(() => { WANT = null; }, 0); }
            }
            catch (x) { }
        }, true);
    }
    catch (e) { }

    /* ══ (2) 書類の画面：案件のタブ・どの注文の書類か ══ */
    const sh = (b: any) => { const t = String(b || "").replace(/ (Ltd|Co|Inc|Pte|LLC|GmbH|JSC|SARL|DMCC|Sdn|Corp|Corporation|Company|Limited|S\.A|S\.L)\b\.?.*$/i, "").trim(); return t.length > 20 ? t.slice(0, 19) + "…" : t; };
    const qtyS = (S: any) => fmtQty(String((S && S.qty) || "").split("（")[0]);
    const tabLabel = (S: any): any => {
        const b = isMihon(S) ? "" : sh(S.buyer);
        const q = qtyS(S), tot = String(S.total || "").trim();
        const body = [q && q !== "—" ? q : "", tot && /\d/.test(tot) ? tot : ""].filter(Boolean).join("・");
        return {
            t: `${S.no}｜${b ? b + "（" + (S.country || "") + "）" : (S.country || "")}${body ? "｜" + body : ""}`,
            title: `${S.no}｜${S.buyer || ""}（${S.country || ""}）${body ? "｜" + [q, S.unitPrice ? "× " + S.unitPrice : "", tot ? "＝ " + tot : ""].filter(Boolean).join(" ") : ""}`,
        };
    };
    const paintTabs = (root: any) => {
        try {
            if (typeof SHIPS === "undefined" || !Array.isArray(SHIPS)) return;
            root.querySelectorAll('[data-onclick^="shipActivate("]').forEach((b: any) => {
                const m = String(b.getAttribute("data-onclick") || "").match(/^shipActivate\((\d+)\);render\(\)$/);
                if (!m) return;
                const C = SHIPS[+m[1]], S = C && C.ship;
                if (!S || !S.no) return;
                const L = tabLabel(S);
                const sig = L.t;
                if (b.getAttribute("data-r9a") === sig) return;
                const tn = Array.from(b.childNodes).find((x: any) => x.nodeType === 3 && String(x.nodeValue || "").indexOf(String(S.no)) >= 0) as any;
                if (!tn) return;
                const po = / 📥\s*$/.test(String(tn.nodeValue || "")) ? " 📥" : "";
                tn.nodeValue = (/^\s/.test(String(tn.nodeValue)) ? " " : "") + L.t + po;
                b.setAttribute("data-r9a", sig);
                b.setAttribute("data-noi18n", "1");
                b.title = L.title;
            });
        }
        catch (e) { warn("tabs", e); }
    };
    /* どの注文の書類か（r8a の注文の一覧 c.v92ord と同じ番号） */
    const ordInfo = (S: any): any => {
        try {
            if (!S || !S.no || isMihon(S)) return null;
            const has = (x: any) => x && Array.isArray(x.v92ord) && x.v92ord.some((o: any) => (o.ships || []).indexOf(S) >= 0 || (o.ships || []).some((T: any) => T && String(T.no) === String(S.no)));
            let c: any = null;
            try { const A = dashAgg(dashScopeUnits()); c = ((A && A.v92won) || []).find(has) || null; } catch (e) { }   // 見本の受注を1件目に入れた一覧（daily-U01）
            if (!c) c = casesAll().find(has);
            if (!c) return null;
            const L = c.v92ord;
            const i = L.findIndex((o: any) => (o.ships || []).some((T: any) => T === S || (T && String(T.no) === String(S.no))));
            if (i < 0) return null;
            return { c, i, n: L.length, o: L[i], rest: L.filter((o: any) => o.k === "rec") };
        }
        catch (e) { return null; }
    };
    API.ordInfo = ordInfo;
    const boxShown = (S: any): boolean => {
        try {
            const a = R7().askOf ? R7().askOf(S) : null;
            if (!a || a.kind !== "more") return false;
            const B = recsForCase({ name: S.buyer, cty: "" });
            const L = S.v61fb || {};
            const cu = B.findIndex((x: any) => x.r.v61id === L.id);
            const ids = linkedIds();
            return cu > 0 && B.slice(0, cu).some((x: any) => x.r.st === "受注" && !(x.r.v61id && ids[String(x.r.v61id)]));
        }
        catch (e) { return false; }
    };
    const paintOrd = () => {
        try {
            if (typeof cur === "undefined" || cur !== "ops" || typeof opsTab === "undefined" || opsTab !== "doc") return;
            const st = document.querySelector(".stage") || document.getElementById("well") || document.body;
            if (!st) return;
            paintTabs(st);
            const bar = st.querySelector(".v92f-case");
            const S = dd() && dd().ship;
            const old = st.querySelector(".v92r9a-ord");
            const I = S ? ordInfo(S) : null;
            if (!bar || !I || (I.n < 2 && !I.rest.length)) { if (old) old.remove(); return; }
            const o = I.o, r = o.rec && o.rec.r;
            const src = o.k === "base" ? "" : r ? M(`受注の記録 ${r.d || ""}：${recTxt(r)}`, `order record ${r.d || ""}: ${recTxt(r)}`, `接单记录 ${r.d || ""}：${recTxt(r)}`, `registro del pedido ${r.d || ""}: ${recTxt(r)}`)
                : o.k === "po" ? M("取り込んだ発注書", "imported purchase order", "导入的订购单", "orden de compra importada") : "";
            let t = M(`注文：この書類は、この相手の注文 ${I.n}件のうち ${I.i + 1}件目です${src ? "（" + src + "）" : ""}。番号は記録した順で、分析の内訳と同じです`,
                `Order: these documents are order ${I.i + 1} of ${I.n} from this buyer${src ? " (" + src + ")" : ""}. Orders are numbered in the order they were recorded, as in the analytics breakdown`,
                `订单：本单据是该客户 ${I.n} 个订单中的第 ${I.i + 1} 个${src ? "（" + src + "）" : ""}。编号按记录顺序，与分析明细相同`,
                `Pedido: estos documentos son el pedido ${I.i + 1} de ${I.n} de este comprador${src ? " (" + src + ")" : ""}. Se numeran en el orden de registro, como en el desglose`);
            const rest = I.rest.filter((x: any) => x !== o);
            if (rest.length && !boxShown(S)) {
                const items = rest.map((x: any) => `${(x.rec && x.rec.r && x.rec.r.d) || ""}${M("：", ": ", "：", ": ")}${x.rec && x.rec.r ? recTxt(x.rec.r) : ""}`).join(M("／", " / ", "／", " / "));
                t += M(`。書類のまだ無い「受注」の記録が ${rest.length}件あります（${items}）。その記録の「出荷案件を作る」で、その注文の書類を作れます`,
                    `. ${rest.length} “Order” record(s) have no documents yet (${items}); create them with “Create a shipment case” on that record`,
                    `。还有 ${rest.length} 条尚无单据的“接单”记录（${items}），可在该记录的“创建出货案件”中制作`,
                    `. Hay ${rest.length} registro(s) de «Pedido» sin documentos (${items}); créelos con «Crear el caso de envío» en ese registro`);
            }
            if (old && old.getAttribute("data-t") === t) return;
            const el = old || document.createElement("div");
            el.className = "v92r9a-ord";
            el.setAttribute("data-noi18n", "1");
            el.setAttribute("data-t", t);
            el.textContent = t;
            if (!old) bar.appendChild(el);
        }
        catch (e) { warn("paintOrd", e); }
    };
    API.paintOrd = paintOrd;
    const soon = (f: any, L: number[]) => { try { L.forEach((ms) => setTimeout(f, ms)); } catch (e) { } };
    try {
        if (typeof render === "function") {
            const o = render;
            render = function (this: any) {
                const r = o.apply(this, arguments as any);
                soon(paintOrd, [40, 360, 1150]);
                return r;
            };
        }
    }
    catch (e) { warn("render-wrap", e); }

    /* ══ (3) 見積書の有効期限：見積書の Date から数える（food-U02・indagri-U02） ══ */
    const ymd = (s: any) => { try { if (typeof v92docYmd === "function") return v92docYmd(s) || ""; } catch (e) { } const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || "")); return m ? m[0] : ""; };
    const addD = (s: string, n: number) => { try { if (typeof v92docAdd === "function") return v92docAdd(s, n); } catch (e) { } const d = new Date(s + "T00:00:00Z"); return isNaN(d.getTime()) ? "" : new Date(d.getTime() + n * 864e5).toISOString().slice(0, 10); };
    try {
        if (typeof v92docValid === "function") {
            const o = v92docValid;
            v92docValid = function (this: any, S: any, t: any) {
                const V = o.apply(this, arguments as any);
                try {
                    let today = ""; try { today = String(TODAYS || "").slice(0, 10); } catch (e) { }
                    const date = ymd(S && (S.date || S.orderDate)) || ymd(today);   // 見積書の Date と同じ順（S.date → 受注日 → 画面の今日）
                    if (!V || !date || V.date === date) return V;
                    const d30 = addD(date, 30), pu = String(V.pu || "");
                    if (pu && pu < date) return Object.assign({}, V, { date, d30, why: "exp", until: "", en: "[To be confirmed] (price list expired on " + pu + ")" });
                    if (pu && pu < d30) return Object.assign({}, V, { date, d30, why: "price", until: pu, en: "Until " + pu + " (price list validity)" });
                    return Object.assign({}, V, { date, d30, why: "30", until: d30, en: "30 days (until " + d30 + ")" });
                }
                catch (e) { warn("valid", e); }
                return V;
            };
        }
    }
    catch (e) { warn("valid-wrap", e); }

    /* ══ (4) 輸送・建値を替えたら、書類の中身と点検を同時に描き直す（auto-U01・xcut-U07・health-U01） ══ */
    try {
        if (typeof v85docSet === "function") {
            const o = v85docSet;
            v85docSet = function (this: any, k: any) {
                const r = o.apply(this, arguments as any);
                try {
                    if ((k === "mode" || k === "inc") && document.getElementById("dO") && typeof rDoc === "function") {
                        const kk = String(W.__poDocK || "pi");
                        setTimeout(() => { try { if (document.getElementById("dO")) rDoc(kk); } catch (e) { } }, 0);
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { warn("docset-wrap", e); }

    /* ══ (5) 建値の場所が空港：仕出港（港）の注記を出さない（other-U01） ══ */
    const modeNow = (S: any): string => {
        try { if (typeof v85docCase === "function") { const c = v85docCase() || {}; const m = String((c.inp && c.inp.mode) || ""); if (m) return m; } } catch (e) { }
        try { if (typeof v85docModeOf === "function") return String(v85docModeOf(S) || "sea"); } catch (e) { }
        return /^AIR$/i.test(String((S && S.mode) || "")) ? "air" : "sea";
    };
    const AIRPORT = /空港|airport|\bAPT\b|Aeropuerto|机场/i;
    try {
        if (typeof v92docPolNote === "function") {
            const o = v92docPolNote;
            v92docPolNote = function (this: any, S: any) {
                const h = o.apply(this, arguments as any);
                try {
                    if (!S) return h;
                    const cd = typeof v92docCode === "function" ? v92docCode(S.term) : "";
                    const place = cd && typeof v92docPlace === "function" ? String(v92docPlace(S.term, cd) || "") : "";
                    if (!place || !AIRPORT.test(place)) return h;
                    if (/^(air|courier|post)$/.test(modeNow(S))) return "";
                    return `<span data-noi18n>${E(M(`建値の場所は ${place}（空港）です。航空で送るなら、上の判断の表の「輸送」を「航空」にしてください（請求書・船積依頼書も航空の書き方になります）。`,
                        `The delivery place is ${place} (an airport). If you ship by air, set “Transport” to air in the table above (the invoice and shipping instructions then use air wording).`,
                        `交货地点为 ${place}（机场）。如走空运，请在上方判断表中把“运输”改为空运（发票和托运单也会改为空运的写法）。`,
                        `El lugar de entrega es ${place} (un aeropuerto). Si envía por avión, ponga «Transporte» en aéreo en la tabla superior (la factura y las instrucciones usarán términos aéreos).`))}</span>`;
                }
                catch (e) { warn("pol", e); }
                return h;
            };
        }
    }
    catch (e) { warn("pol-wrap", e); }

    /* ══ (6) 記録の価格：確定単価 ＞ 希望価格（daily-U02） ══ */
    const priceTxt = (f: any): any => {
        try {
            const p = effP(f);
            if (!p || !p.s) return null;
            const fixed = !p.prov && !!(f && typeof v61dlIsPrice === "function" && v61dlIsPrice(f.fixPrice));
            return { s: String(p.s), fixed };
        }
        catch (e) { return null; }
    };
    API.priceTxt = priceTxt;
    try {
        if (typeof a30Collect === "function") {
            const o = a30Collect;
            a30Collect = function (this: any) {
                const out = o.apply(this, arguments as any);
                try {
                    const seen: any[] = [];
                    Object.keys(out || {}).forEach((k) => (Array.isArray(out[k]) ? out[k] : []).forEach((x: any) => {
                        if (!x || !x.f || !isObj(x.f) || seen.indexOf(x) >= 0) return;
                        seen.push(x);
                        const f = x.f;
                        const P = priceTxt(f);
                        if (!P || !P.fixed) return;
                        // 確定単価のある記録：内容の行は確定単価で（「見積提示・単価 EUR 9.00/個・数量 600個」）。提案の列も確定単価（a30Open は f.price を読む）
                        if (k !== "lost") {
                            const t0 = String(x.txt || "");
                            const t1 = f.price && t0.indexOf("希望価格 " + f.price) >= 0 ? t0.replace("希望価格 " + f.price, "単価 " + P.s + "（希望価格 " + f.price + "）") : [f.st, "単価 " + P.s, f.lot && ("数量 " + f.lot)].filter(Boolean).join("・");
                            if (!/^[^・\s]+-\d/.test(t0)) x.txt = t1;
                        }
                        x.f = Object.assign({}, f, { price: P.s });
                    }));
                    // 希望価格だけの記録は、提案の列で「希望」と分かるように
                    seen.forEach((x: any) => { const f = x.f; const P = priceTxt(f); if (P && !P.fixed && f.price && !/^希望 /.test(String(f.price))) x.f = Object.assign({}, f, { price: "希望 " + f.price }); });
                }
                catch (e) { warn("a30", e); }
                return out;
            };
        }
    }
    catch (e) { warn("a30-wrap", e); }

    /* ══ 磨き ══ */
    /* auto-U06・indagri-U05：「先方の希望：SGD 51000」→ 桁区切り */
    const commas = (s: any) => String(s == null ? "" : s).replace(/((?:^|[^\d.,])(?:[A-Z]{3} ?|US\$|[¥$]))(\d{4,})(\.\d+)?(?![\d,])/g, (m: string, a: string, b: string, c: string) => a + Number(b).toLocaleString("en-US") + (c || ""));
    API.commas = commas;
    try {
        if (typeof v56dCmpParts === "function") {
            const o = v56dCmpParts;
            v56dCmpParts = function (this: any) {
                const P = o.apply(this, arguments as any);
                try { if (P && typeof P.buyer === "string") P.buyer = commas(P.buyer); if (P && typeof P.own === "string") P.own = commas(P.own); } catch (e) { }
                return P;
            };
        }
    }
    catch (e) { }
    /* auto-T07：「受注内容を編集」で「5000個」のように単位つきで入れても、桁区切りを付けて保存（r8a は数字だけのときだけ） */
    try {
        if (typeof openStepEdit === "function") {
            const o = openStepEdit;
            openStepEdit = function (this: any, i: any) {
                const r = o.apply(this, arguments as any);
                try {
                    const g: any = document.getElementById("seGo"), q: any = document.getElementById("seQ");
                    if (i === 0 && g && q && !g.dataset.v92r9a) {
                        g.dataset.v92r9a = "1";
                        g.addEventListener("click", () => {
                            try { const x = nfkc(q.value).trim(); const m = x.match(/^([\d,]+(?:\.\d+)?)\s*([^\d\s,.]{1,6})$/); if (m) { const n = parseFloat(m[1].replace(/,/g, "")); if (n > 0) q.value = n.toLocaleString("en-US", { maximumFractionDigits: 3 }) + m[2]; } } catch (e) { }
                        }, true);
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { }
    /* 書類の画面の表示：梱包明細の Total・注記の数量（「5000 pcs」「US$1.20／5,000／…」）に桁区切りと単位（auto-T07・other-T06） */
    const docTidy = () => {
        try {
            const o = document.getElementById("dO");
            if (!o) return;
            Array.from(o.querySelectorAll(".doc td")).forEach((td: any) => {
                if (td.children.length) return;
                const t = String(td.textContent || "");
                const t2 = t.replace(/(^|[\s/])(\d{4,})(\s*pcs\b)/g, (m: string, a: string, b: string, c: string) => a + Number(b).toLocaleString("en-US") + c);
                if (t2 !== t) td.textContent = t2;
            });
            const sp = o.querySelector(".v92r5a-src");
            if (sp && !sp.getAttribute("data-r9a")) {
                const t = String(sp.textContent || "");
                const t2 = t.replace(/(商談の記録は [^／]*／)([\d,]+(?:\.\d+)?)(／)/, (m: string, a: string, b: string, c: string) => a + fmtQty(b) + c);
                sp.setAttribute("data-r9a", "1");
                if (t2 !== t) sp.textContent = t2;
            }
            // health-T12：見本の梱包明細にも、カートン数の式（何個入 × 何カートン）。表の行のカートン数と同じときだけ。外装重量が無いときは重量の式は出さない（作らない）
            try {
                const S0 = dd() && dd().ship;
                const f1: any = W.v68trPack, f2: any = W.v68trPackNote;
                if (String(W.__poDocK || "") === "pl" && S0 && typeof f1 === "function" && typeof f2 === "function" && !o.querySelector(".v68trnote, .v92r9a-pl") && !/寸法表の外装の情報から計算|calculated from the carton information/.test(String(o.textContent || ""))) {
                    const R = f1(S0);
                    const rowTxt = String(((o.querySelector(".doc table tbody tr") || {}) as any).textContent || "");
                    if (R && R.cartons && rowTxt.indexOf(R.cartons + " CTN") >= 0) {
                        const tmp = document.createElement("div");
                        tmp.innerHTML = String(f2(S0) || "");
                        const sp0 = tmp.querySelector("span");
                        let t = sp0 ? String(sp0.textContent || "") : "";
                        if (t && !R.gw) t = t.replace("カートン数・重量は、", "カートン数は、").replace("Cartons and weights are calculated", "Cartons are calculated");
                        if (t) {
                            // 書類の下の注記（帳票の会社設定のボタンのある行）の頭に入れる（刷新版は、ボタンの無い長い注記を「説明」にたたむため）
                            const main: any = Array.from(o.querySelectorAll("p.nn")).find((x: any) => x.querySelector("button"));
                            const sp = document.createElement("span");
                            sp.className = "v92r9a-pl"; sp.setAttribute("data-noi18n", "1");
                            sp.textContent = t;
                            if (main) { main.insertBefore(document.createElement("br"), main.firstChild); main.insertBefore(sp, main.firstChild); }
                            else { const pp = document.createElement("p"); pp.className = "nn"; pp.appendChild(sp); const dc = o.querySelector(".doc"); if (dc) dc.insertAdjacentElement("afterend", pp); else o.appendChild(pp); }
                        }
                    }
                }
            }
            catch (e) { }
            // food-U03：別の商品の記録しかない相手の書類（商品情報の値で作った）に、「商談記録の希望価格…がそのまま入っています」と出していた
            const S = dd() && dd().ship;
            if (S && S.v92r9aOther) {
                const p: any = Array.from(o.querySelectorAll("p.nn")).find((x: any) => /^商談記録の/.test(String(x.textContent || "").trim()) || /^(The meeting record|商谈记录|El registro)/.test(String(x.textContent || "").trim()));
                if (p && !p.getAttribute("data-r9a")) {
                    const items: string[] = [];
                    recsForCase({ name: S.buyer, cty: S.country }).forEach((x: any) => { const it = String(x.r.item || "").trim(); if (it && !sameItem(x.r) && items.indexOf(it) < 0) items.push(it); });
                    const v = [String(S.unitPrice || ""), String(S.qty || "").split("（")[0], String(S.term || "")].filter(Boolean).join("／");
                    const t = M(`商品情報（価格表・最小発注数量・取引条件）の値 ${v} を入れています。${items.length ? `この相手の商談の記録（${items.join("・")}）は別の商品の記録なので、書類には入れていません。` : ""}数量・単価は「受注内容を編集」で直せます。`,
                        `Values from the product information (price list, MOQ, trade term) are used: ${v}. ${items.length ? `This buyer's meeting records (${items.join(", ")}) are for another product, so they are not used. ` : ""}Change quantity and price in “Edit order details”.`,
                        `使用了商品信息（价目表・最小起订量・贸易条件）的值 ${v}。${items.length ? `该客户的商谈记录（${items.join("・")}）属于其他商品，未写入单据。` : ""}数量・单价可在“编辑订单内容”中修改。`,
                        `Se usan los valores de la ficha del producto (lista de precios, MOQ, condición): ${v}. ${items.length ? `Los registros de este comprador (${items.join(", ")}) son de otro producto y no se usan. ` : ""}Cambie cantidad y precio en «Editar pedido».`);
                    const keep = Array.from(p.querySelectorAll("button"));
                    p.textContent = t;
                    keep.forEach((b: any) => { p.appendChild(document.createTextNode("　")); p.appendChild(b); });
                    p.setAttribute("data-r9a", "1");
                    p.setAttribute("data-noi18n", "1");
                }
            }
        }
        catch (e) { }
    };
    API.docTidy = docTidy;
    try { document.addEventListener("click", () => { setTimeout(docTidy, 500); setTimeout(docTidy, 1700); }, false); } catch (e) { }
    try {
        if (typeof render === "function") {
            const o = render;
            render = function (this: any) { const r = o.apply(this, arguments as any); soon(docTidy, [80, 760]); return r; };
        }
        if (typeof rDoc === "function") {
            // rDoc は名前で呼ばれる（書類の種類のボタン）。描いたあとに整える
            const o2 = rDoc;
            rDoc = function (this: any) { const r = o2.apply(this, arguments as any); soon(docTidy, [0, 120]); soon(paintOrd, [30]); return r; };
        }
    }
    catch (e) { }

    /* medical-U04：記録より先に開いた書類（見本から写した書類）が、記録の値に替わったときも知らせる */
    const looseNos = (): string[] => allShips().filter((S: any) => S && !S.v61fb && !S.poNo && !isMihon(S) && (S.v54copy || S.v56shipFb)).map((S: any) => String(S.no));
    try {
        if (typeof dealSave === "function") {
            const o = dealSave;
            dealSave = function (this: any) {
                let before: string[] = [];
                try { before = looseNos(); } catch (e) { }
                const r = o.apply(this, arguments as any);
                const fin = () => {
                    setTimeout(() => {
                        try {
                            if (!before.length) return;
                            const now = looseNos();
                            const L = before.filter((no) => now.indexOf(no) < 0).map((no) => allShips().find((S: any) => S && String(S.no) === no && S.v61fb)).filter(Boolean);
                            if (!L.length || typeof toast !== "function") return;
                            const S = L[0];
                            // 取引条件は記録の値（仕向港の層が、書類を開くと記録の港に直すため。途中の値「CIF レムチャバン」を出さない）
                            let tm = String(S.term || "");
                            try { const rf: any = W.v61dlRecById; const rec = (S.v61fb && typeof rf === "function") ? rf(S.v61fb.id) : null; const t = rec && typeof v61dlRecTerm === "function" ? v61dlRecTerm(rec) : null; if (t && t.code) tm = (t.code + " " + (t.place || "")).trim(); } catch (e) { }
                            const v = [String(S.qty || "").split("（")[0], S.unitPrice, tm].filter(Boolean).join("・");
                            toast(M(`新しい記録に合わせて、書類（${L.map((x: any) => x.no).join("・")}）の値を更新しました：${v}`, `Documents (${L.map((x: any) => x.no).join(", ")}) were updated from the new record: ${v}`, `已按新记录更新单据（${L.map((x: any) => x.no).join("・")}）：${v}`, `Documentos (${L.map((x: any) => x.no).join(", ")}) actualizados con el nuevo registro: ${v}`));
                        }
                        catch (e) { warn("loose-toast", e); }
                    }, 1100);
                };
                try { if (r && typeof r.then === "function") r.then(fin, fin); else fin(); } catch (e) { }
                return r;
            };
        }
    }
    catch (e) { warn("dealSave-wrap", e); }

    /* auto-U03：別の注文の知らせで「このままにする」を押したときの文（内訳に違いの行は出ないので、言い方を分ける） */
    let LASTK: any = null;
    try {
        window.addEventListener("click", (e: any) => {
            try {
                const b = e.target && e.target.closest && e.target.closest('[data-v92r7a-ask="keep"]');
                if (!b) return;
                const box = b.closest(".v92r7a-ask");
                LASTK = { more: !!(box && box.querySelector('[data-v92r7a-ask="rec"]')), at: Date.now() };
            }
            catch (x) { }
        }, true);
        if (typeof toast === "function") {
            const o = toast;
            toast = function (this: any, m: any) {
                try {
                    if (LASTK && LASTK.more && Date.now() - LASTK.at < 1500 && /^(書類はこのままにしました（内訳の窓には|Documents kept as they are \(the breakdown|单据保持不变（明细窗口|Los documentos se dejaron como están)/.test(String(m || ""))) {
                        LASTK = null;
                        return o.call(this, M("書類はこのままにしました。書類のまだ無い受注の記録は、別の注文として累計受注金額に足しています（分析の内訳に注文ごとに出ます）",
                            "Documents kept as they are. Order records without documents are added to the total order value as separate orders (shown per order in the breakdown)",
                            "单据保持不变。尚无单据的接单记录作为另外的订单计入累计接单金额（在分析明细中按订单显示）",
                            "Documentos sin cambios. Los registros de pedido sin documentos se suman al total como pedidos aparte (se ven por pedido en el desglose)"));
                    }
                }
                catch (e) { }
                return o.apply(this, arguments as any);
            };
        }
    }
    catch (e) { }

    /* auto-U02：内訳の見出し「受注が決まった案件 1件（注文 3件）」の下に出荷案件の番号が2つ並ぶ → 出荷案件の数も書く */
    try {
        if (typeof dashDrill === "function") {
            const o = dashDrill;
            dashDrill = function (this: any) {
                const r = o.apply(this, arguments as any);
                try {
                    const root: any = document.getElementById("v92r6bDrill");
                    if (root && root.getAttribute("data-kind") === "orders" && !root.getAttribute("data-r9a")) {
                        root.setAttribute("data-r9a", "1");
                        const A = dashAgg(dashScopeUnits());
                        const won: any[] = (A && A.v92won) || [];
                        const nShip = won.reduce((s: number, c: any) => s + ((c.v92ord || []).reduce((t: number, x: any) => t + ((x.ships || []).length ? 1 : 0), 0)), 0);
                        const nCase = won.length;
                        const p: any = root.querySelector("p.nn");
                        if (p && nShip > nCase) {
                            const t = String(p.textContent || "");
                            const t2 = t.replace(/受注が決まった案件 (\d+)件（注文 (\d+)件）・/, (m: string, a: string, b: string) => `受注が決まった案件 ${a}件（相手ごと。注文 ${b}件・うち書類のある出荷案件 ${nShip}件）・`)
                                .replace(/(\d+) confirmed order case\(s\) \((\d+) orders\), /, (m: string, a: string, b: string) => `${a} confirmed order case(s) (per buyer; ${b} orders, ${nShip} shipment case(s) with documents), `)
                                .replace(/已确认订单的案件 (\d+)件（订单 (\d+)个）/, (m: string, a: string, b: string) => `已确认订单的案件 ${a}件（按客户；订单 ${b}个，其中有单据的出货案件 ${nShip}件）`);
                            if (t2 !== t) p.textContent = t2;
                        }
                    }
                }
                catch (e) { warn("drill", e); }
                return r;
            };
        }
    }
    catch (e) { }

    /* ══ daily-U01：完成形の見本で、見本の受注（MD-2608-01 など）がある相手にご自分で受注を足したとき、2件目の注文として数える ══
       前は「初めての受注 2件」「受注が決まった案件 2件」「初回受注 2」（別の相手の扱い）で、目標と道筋（2回目の注文 ✓）と食い違った。
       → その相手の案件の注文の一覧（r8a の c.v92ord）の先頭に見本の受注を入れ、見本の受注の行は外す（累計受注金額は同じ）。
          初めての受注・初回受注は相手ごとなので 1 減らす。期間で区切ったときは今までどおり。 */
    const fmtCur = (a: any): string => {
        const v = +a.v || 0;
        if (a.cur === "USD") return "US$" + v.toLocaleString("en-US", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
        if (a.cur === "JPY") return "¥" + Math.round(v).toLocaleString("en-US");
        return (a.cur || "") + " " + v.toLocaleString("en-US", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
    };
    const sumBy = (P: any[]): any[] => { const out: any[] = []; (P || []).forEach((p: any) => { if (!p || !(p.v > 0) || !p.cur) return; const x = out.find((y: any) => y.cur === p.cur); if (x) x.v = Math.round((x.v + p.v) * 100) / 100; else out.push({ cur: p.cur, v: p.v }); }); return out; };
    const mergeBase = (A: any) => {
        if (!A || A.per || A.v92r9aB || !Array.isArray(A.orders) || !Array.isArray(A.v92won)) return;
        A.v92r9aB = 1;
        const base = A.orders.filter((x: any) => x && x.src === "base");
        A.v92baseAll = base.slice();
        if (!base.length) return;
        let merged = 0;
        A.v92won.forEach((c: any) => {
            if (!c || !Array.isArray(c.v92ord)) return;
            const x = base.find((b: any) => b && norm(b.buyer) === norm(c.buyer) && (!b.ref || !c.ref || b.ref === c.ref) && A.orders.indexOf(b) >= 0);
            if (!x || !x.a || !(x.a.v > 0)) return;
            const d = String(x.dISO || "").slice(0, 10);
            if (!c.v92base) {
                const part = { cur: x.a.cur, v: x.a.v, docRate: +x.docRate || 0, d, v92base: 1 };
                const o = { k: "base", base: x, ships: [], rec: { r: { lot: x.qty, d }, fi: "" }, ra: { unit: x.unit, prov: 0 }, parts: [part], d, i: -1 };
                c.v92ord.unshift(o);
                c.v92ord.sort((a: any, b: any) => String(a.d).localeCompare(String(b.d)));
                c.v92parts = [part].concat(c.v92parts || []);
                c.v92sums = sumBy(c.v92parts);
                c.v92base = { no: x.no, d, total: x.total, qty: x.qty, unit: x.unit };
            }
            const row = A.orders.find((y: any) => y && y.v92c === c);
            if (row) {
                const bp = c.v92parts.find((p: any) => p && p.v92base);
                const P = Array.isArray(row.v92p) ? row.v92p.slice() : (c.v92parts || []).filter((p: any) => !p.v92base);
                if (bp && !P.some((p: any) => p && p.v92base)) P.unshift(bp);
                row.v92p = P;
                const S = sumBy(P);
                row.a = S.length ? { cur: S[0].cur, v: S[0].v } : row.a;
                row.total = S.length ? S.map(fmtCur).join(" ＋ ") : row.total;
                if (P.length > 1) row.docRate = 0;
            }
            A.orders.splice(A.orders.indexOf(x), 1);
            merged++;
        });
        if (!merged) return;
        A.v92r9aMerged = merged;
        let nOrd = 0;
        A.orders.forEach((x: any) => { const c = x && x.v92c; nOrd += (c && Array.isArray(c.v92ord)) ? Math.max(1, c.v92ord.length) : 1; });
        A.v92nOrd = nOrd;
        try { A.money = dashMoney(A.orders); } catch (e) { warn("base-money", e); }
        if (A.K) A.K.won = Math.max(0, (+A.K.won || 0) - merged);
        try {
            // 「見積を提示」「サンプル発送」「初回受注」は相手ごと（r8a）。見本の数にこの相手が入っているので、ご自分の案件の分を引く
            if (Array.isArray(A.funnel)) [/見積/, /サンプル/, /受注/].forEach((re: RegExp) => { const i = A.funnel.findIndex((r: any) => r && re.test(String(r[0] || ""))); if (i >= 0) A.funnel[i] = [A.funnel[i][0], Math.max(0, (+A.funnel[i][1] || 0) - merged)].concat(A.funnel[i].slice(2)); });
            if (A.v92fun) ["won", "rq", "rs"].forEach((k) => { if (A.v92fun[k] != null) A.v92fun[k] = Math.max(0, (+A.v92fun[k] || 0) - merged); });
        }
        catch (e) { }
    };
    API.mergeBase = mergeBase;
    try {
        if (typeof dashAgg === "function") {
            const o = dashAgg;
            dashAgg = function (this: any) {
                const A = o.apply(this, arguments as any);
                try { mergeBase(A); } catch (e) { warn("mergeBase", e); }
                return A;
            };
        }
    }
    catch (e) { }
    /* どこまで進んだか の数え方の文：見本の受注と同じ相手の分は、見本の決まった数で数えていることを書く */
    try {
        if (typeof vDash === "function") {
            const o = vDash;
            vDash = function (this: any) {
                let h = o.apply(this, arguments as any);
                try {
                    if (typeof h !== "string") return h;
                    const A = dashAgg(dashScopeUnits());
                    const m = +(A && A.v92r9aMerged) || 0;
                    if (m) h = h.replace(/受注に進んだ (\d+)件＋見本の決まった数/, (x: string, n: string) => `受注に進んだ ${n}件（うち ${m}件は見本の受注と同じ相手なので、見本の決まった数のほうで数えています）＋見本の決まった数`);
                }
                catch (e) { }
                return h;
            };
        }
    }
    catch (e) { }
    /* 内訳の窓：見本の受注の札（r8a の札の形で描かれる）を、見本のデータの書き方に */
    const baseCards = () => {
        try {
            const root: any = document.getElementById("v92r6bDrill");
            if (!root || root.getAttribute("data-r9ab")) return;
            const A = dashAgg(dashScopeUnits());
            if (!A || !A.v92r9aMerged) return;
            root.setAttribute("data-r9ab", "1");
            const kind = root.getAttribute("data-kind");
            const won: any[] = A.v92won || [], quo: any[] = A.v92quo || [];
            const ALL = kind === "quotes" ? quo.concat(won) : won.concat(quo);
            ALL.forEach((c: any, ci: number) => {
                if (!c || !c.v92base || !Array.isArray(c.v92ord)) return;
                const cards = Array.from(root.querySelectorAll(`.v92r8a-ord[data-v92r8a-ci="${ci}"]`));
                c.v92ord.forEach((o: any, j: number) => {
                    if (o.k !== "base") return;
                    const cd: any = cards[j];
                    if (!cd) return;
                    const no = cd.querySelector(".v92r6b-no"); if (no) no.textContent = c.v92base.no || "";
                    const ed = cd.querySelector(".v92r8a-ed"); if (ed) ed.remove();
                    const c4 = cd.querySelector(".v92r6b-c4");
                    if (c4) c4.textContent = M("金額の出どころ：見本のデータ（見本の受注。同じ相手からの1件目の注文として数えています）", "Amount source: sample data (the sample order, counted as the first order from this buyer)", "金额来源：示例数据（示例订单，计为该客户的第一个订单）", "Origen: datos de muestra (pedido de muestra, contado como el primer pedido de este comprador)");
                });
            });
        }
        catch (e) { warn("baseCards", e); }
    };
    try {
        if (typeof dashDrill === "function") {
            const o = dashDrill;
            dashDrill = function (this: any) { const r = o.apply(this, arguments as any); try { baseCards(); } catch (e) { } return r; };
        }
    }
    catch (e) { }
    /* 記録の保存：見本の受注がある相手への「受注」の記録は、2件目の注文として足したことを窓の中で知らせる */
    try {
        if (typeof dealSave === "function") {
            const o = dealSave;
            dealSave = function (this: any) {
                let b = "", st = "";
                try { b = String(((document.getElementById("dfB") || {}) as any).value || "").trim(); st = String(((document.getElementById("dfSt") || {}) as any).value || ""); } catch (e) { }
                const r = o.apply(this, arguments as any);
                const fin = () => setTimeout(() => {
                    try {
                        if (!b || st !== "受注") return;
                        const A = dashAgg(dashScopeUnits());
                        const x = ((A && A.v92baseAll) || []).find((y: any) => y && norm(y.buyer) === norm(b));
                        if (!x) return;
                        const box = document.getElementById("dfAI");
                        if (!box || box.querySelector(".v92r9a-base")) return;
                        const d = document.createElement("div");
                        d.className = "v92r9a-base";
                        d.setAttribute("data-noi18n", "1");
                        d.textContent = M(`この相手（${x.buyer}）には見本の受注（${x.no}・${x.total}）があります。この記録は同じ相手からの別の注文として、累計受注金額に足しています（「初めての受注」「初回受注」の数は増えません。分析の内訳では、この相手の注文として並びます）。`,
                            `This buyer (${x.buyer}) already has the sample order (${x.no}, ${x.total}). This record is added to the total order value as a separate order from the same buyer (the “first order” count does not increase; the breakdown lists it under this buyer).`,
                            `该客户（${x.buyer}）已有示例订单（${x.no}・${x.total}）。本记录作为同一客户的另一个订单计入累计接单金额（“首次接单”数不增加）。`,
                            `Este comprador (${x.buyer}) ya tiene el pedido de muestra (${x.no}, ${x.total}). Este registro se suma al total como otro pedido del mismo comprador (el número de «primeros pedidos» no aumenta).`);
                        const first = box.firstElementChild;
                        if (first) first.insertAdjacentElement("afterend", d); else box.appendChild(d);
                    }
                    catch (e) { warn("base-note", e); }
                }, 300);
                try { if (r && typeof r.then === "function") r.then(fin, fin); else fin(); } catch (e) { }
                return r;
            };
        }
    }
    catch (e) { }

    /* 見た目 */
    try {
        const stl = document.createElement("style");
        stl.id = "v92r9a-css";
        stl.textContent = ".v92r9a-base{margin:7px 0 0;padding:8px 11px;border:1px solid #e0b252;background:#fff8e6;border-radius:9px;font-size:11.5px;line-height:1.6;color:#4a3a10}.v92r9a-ord{flex:1 1 100%;margin:2px 0 0;font-size:11.5px;line-height:1.6;color:var(--ink-2,#444)}";
        (document.head || document.documentElement).appendChild(stl);
    }
    catch (e) { }
})();
