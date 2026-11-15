/* 21.92 r4a：4巡目の直し（書類まわり：書類をつくる・この案件の書類・受注・契約書・ドキュメント）
   今の関数は包むだけ。データ・保存の形は変えない。数字・事実は作らない（アプリが持っている値の出し方だけを直す）。
   (1) culture-M04　案件に支払条件があるのに Payment が「未定（要確認）」のまま → 「未定」の印だけ残った案件を直す
   (2) health-M06・other-M09　商談の記録の単価なのに、点検に「単価が FOB の登録値のまま」が残る → その案件では出さない
   (3) daily-M04　赤の項目が残っている間も、黄（送る前に確かめること）を点検の欄に出す
   (4) food-M06・indagri-M10・xcut-M01　英文の書類の中の日本語（ETD/ETA の日付・梱包明細の合計の単位・見本の相手の名前）
   (5) health-M02　見本の見積書の支払条件の出どころを書く（商談の記録には支払条件が無い）
   (6) other-M05　「この案件で使う書類 N点」と行の数（見積書は数に入れていないことを見出しに）
   (7) other-M06　「点検して相手に送る」を押したあと、次にすること（PDF を保存 → メールの下書き）を画面に出す
   (8) culture-M11　発注書が CIF／CFR ＋ 港のとき、その港を仕向港に入れる
   (9) culture-M12　知育玩具・対象年齢・ST マークから「子ども向けの製品・玩具」の印
   (10) medical-M06・health-M14・auto-N18　判断の表：出どころが別の国の資料のとき／作業メモ／手続きの名前／見本の案件の期限
   (11) food-N16・indagri-N14・culture-M05　契約書の相手の選択：同じ相手は1行・「往復」は送ったメッセージがあるときだけ
   (12) indagri-M06　リンクを登録：表示名に URL がつながる
   (13) culture-N20　Seller の住所：日本語の住所から英語の形の案を出す */
declare const TEN: any, TENS: any, D: any, SES: any, I18N: any, SHIPS: any, V85DOC_D: any, V85CTYW: any, cur: any;
declare let vOpsDoc: any, rDoc: any, v33CkQuote: any, v33PiSend: any, poNorm: any, v85docFlagsAuto: any, v85docSrcHtml: any, v85docRowHtml: any,
    v85docDocInfo: any, v85docDue: any, vLegal: any, d30LinkNew: any, v54docSellerEdit: any, render: any, toast: any, SHIPA: any, v54docSrcNote: any, applyAnswer: any;
declare function v90docPayTbd(s: any): boolean;
declare function v54docPayEn(s: any): any;
declare function v54docIsSmp(S: any): boolean;
declare function v68trRecOf(S: any): any;
declare function v33CkGate(o: any): void;
declare function v33PiPrint(): void;
declare function v33AuLog(a: any, b: any, c?: any): any;
declare function v33Toast(m: any): void;
declare function v85docText(d: any): string;
declare function v85docCName(c: any): string;
declare function v85docIsFood(hs: any, ck: any): boolean;
declare function v85docShip(): any;
declare function v85docD(): any;
declare function v85docHsDigits(s: any): string;
declare function v54docSetBuyer(): void;
declare function v56docIsCty(s: any): boolean;
declare function saveTen(): void;
declare const PID: any;
declare let d30Del: any;
declare function v70admAskBox(o: any): Promise<boolean>;
declare function v30One(sec: string, id: any): any;
declare let v54hearPrices: any, v54hearPriceSave: any;
declare function v85docEtd(): string;
declare function v85docToday(): string;
(function () {
    const W: any = window;
    if (W.__v2192r4a) return;
    W.__v2192r4a = 1;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const lang = () => { try { const s: any = document.getElementById("lang"); const v = (s && s.value) || "ja"; return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja"; } catch (e) { return "ja"; } };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const warn = (k: string, e: any) => { try { console.warn("[v92r4a] " + k, e); } catch (x) { } };
    const ten = () => { try { return (typeof TEN !== "undefined" && TEN) ? TEN : null; } catch (e) { return null; } };
    const tens = (): any[] => { try { const L = (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS.slice() : []; const t = ten(); if (t && L.indexOf(t) < 0) L.unshift(t); return L; } catch (e) { const t = ten(); return t ? [t] : []; } };
    const dd = () => { try { return (typeof D !== "undefined" && D) ? D : null; } catch (e) { return null; } };
    const ship = () => { const d = dd(); return (d && d.ship) || null; };
    const isSmp = (S: any) => { try { return typeof v54docIsSmp === "function" ? !!v54docIsSmp(S) : !!(S && /^（想定）/.test(String(S.buyer || ""))); } catch (e) { return false; } };
    const JA_RE = /[぀-ヿ㐀-鿿]/;
    const API: any = W.v92r4a = W.v92r4a || {};
    const dict = (rows: any[]) => { try { if (typeof I18N === "undefined" || !I18N || !I18N.dict) return; rows.forEach((r) => { ["en", "zh", "es"].forEach((l, i) => { const v = r[i + 1] || r[1]; if (v && I18N.dict[l]) I18N.dict[l][r[0]] = v; }); }); } catch (e) { } };

    /* ───────── (1) culture-M04：支払条件が入っているのに「未定（要確認）」の印だけ残る ─────────
       商品に支払条件が無い → 案件を作るとき「未定」の印（v54payDef・v90tbd）が付く → そのあと商談の記録の支払条件が S.pay に入っても印が残っていた */
    const PAY_RE = /T\/T|L\/C|D\/P|D\/A|前払|後払|信用状|送金|advance|at sight|days/i;
    // 商談の記録の支払条件：専用の欄（pay）。無ければ「取引条件」の欄の「／」より後ろ（見本の記録は「FOB 東京／T/T 45日」の形）
    function recPay(rec: any): string {
        try {
            if (!rec) return "";
            const p = String(rec.pay || "").trim();
            if (p) return p;
            const parts = String(rec.term || "").split(/／|\s\/\s|、|,\s/).map((x) => x.trim()).filter(Boolean);
            const hit = parts.slice(1).find((x) => PAY_RE.test(x) && !/^(EXW|FCA|FAS|FOB|CFR|CIF|CPT|CIP|DAP|DPU|DDP)\b/.test(x));
            return hit || "";
        } catch (e) { return ""; }
    }
    function recOf(S: any): any {
        try {
            if (!S) return null;
            if (S.v61fb && typeof v68trRecOf === "function") { const r = v68trRecOf(S); if (r) return r; }
            const d = dd(), t = ten();
            const L = ((t && Array.isArray(t.fbx) && t.fbx.length) ? t.fbx : ((d && Array.isArray(d.fb)) ? d.fb : [])) as any[];
            const nm = String(S.buyer || "").trim().toLowerCase();
            const hit = L.filter((r) => r && String(r.b || "").trim().toLowerCase() === nm);
            return hit.length ? hit.slice().sort((a, b) => String(b.d || "").localeCompare(String(a.d || "")))[0] : null;
        } catch (e) { return null; }
    }
    API.recPay = recPay;
    function payFix(S: any) {
        try {
            if (!S || S.poNo || !S.v61fb) return false;
            let force = false;
            // health-M02：記録の「取引条件」に書いてある支払条件（例：T/T 45日）が、商品情報の登録値（T/T 30日）に置き換わっていた
            try {
                const rec = recOf(S), rp = recPay(rec);
                if (rp && rec && !String(rec.pay || "").trim() && !(S.v61man && S.v61man.pay)) {
                    const d0 = dd(), t0 = ten();
                    const def = String((d0 && d0.pay) || (t0 && t0.pay) || "").trim();
                    const cur0 = String(S.pay || "").trim();
                    const tbd0 = typeof v90docPayTbd === "function" && v90docPayTbd(cur0);
                    if (cur0 !== rp && (tbd0 || cur0 === def)) { S.pay = rp; force = true; }
                }
            } catch (e) { }
            const p = String(S.pay || "").trim();
            if (!p || typeof v90docPayTbd !== "function" || v90docPayTbd(p)) return false;
            if (!force && !S.v90tbd && !S.v54payDef) return S.v90paySrc === "rec";
            delete S.v90tbd; delete S.v54payDef;
            S.v90paySrc = "rec";
            const R = S.docRows;
            const row = R && Array.isArray(R.ex) ? R.ex.find((r: any) => r && r[0] === "Payment") : null;
            if (row) { try { row[1] = typeof v54docPayEn === "function" ? v54docPayEn(p) : p; } catch (e) { row[1] = p; } }
            return true;
        }
        catch (e) { warn("payFix", e); return false; }
    }
    API.payFix = payFix;

    /* ───────── (2)(3) 点検の項目 ───────── */
    if (typeof v33CkQuote === "function") {
        const __ck = v33CkQuote;
        v33CkQuote = function (this: any) {
            try { payFix(ship()); } catch (e) { }
            let F = __ck.apply(this, arguments as any);
            try {
                const S = ship();
                // 単価が商談の記録・受注内容の編集から来ている案件では「単価が FOB の登録値のまま」は当たらない
                // （記録の建値と書類の建値が同じときだけ。判断の欄で建値を変えたあとは、単価の見直しが要るので残す）
                const code = (x: any) => { const m = String(x || "").toUpperCase().match(/\b(EXW|FCA|FAS|FOB|CFR|CIF|CPT|CIP|DAP|DPU|DDP)\b/); return m ? m[1] : ""; };
                let same = false;
                try { const rec = S && S.v61fb ? recOf(S) : null; const rc = code((S && S.v61fb && S.v61fb.snap && S.v61fb.snap.term) || (rec && rec.term)); same = !!rc && rc === code(S.term); } catch (e) { }
                if (Array.isArray(F) && S && S.v61fb && same) F = F.filter((f: any) => !(f && (f.v92 === "gap" || /^単価が .* の登録値のまま/.test(String(f.t || "")))));
            }
            catch (e) { warn("ck", e); }
            return F;
        };
    }
    function yelBox() {
        try {
            const well = document.getElementById("well") || document;
            const btn: any = Array.from(well.querySelectorAll("button")).find((b: any) => /点検して相手に送る|Check and send|检查后发送给对方|Revisar y enviar/.test(b.textContent || ""));
            const old = document.getElementById("v92r4a-yel");
            if (!btn || typeof v33CkQuote !== "function") { if (old) old.remove(); return; }
            const F = (v33CkQuote() || []).filter((f: any) => f && f.lv === "yel");
            if (!F.length) { if (old) old.remove(); return; }
            const sig = F.map((f: any) => f.t).join("|") + "|" + lang();
            if (old && old.getAttribute("data-sig") === sig && old.isConnected) return;
            if (old) old.remove();
            const box = document.createElement("div");
            box.id = "v92r4a-yel"; box.className = "v92r4a-yel"; box.style.fontSize = "12px"; box.setAttribute("role", "note"); box.setAttribute("data-sig", sig);
            box.innerHTML = `<b>${E(M(`送る前に確かめること（${F.length}件・黄）`, `Check before sending (${F.length})`, `发送前请确认（${F.length}项）`, `Compruebe antes de enviar (${F.length})`))}</b><ul>` +
                F.map((f: any, i: number) => `<li><span>${E(f.t)}</span>${typeof f.go === "function" ? ` <button type="button" class="btn g" data-v92r4ago="${i}">${E(M("直す", "Fix", "修改", "Corregir"))}</button>` : ""}<br><small>${E(f.how || "")}</small></li>`).join("") + `</ul>`;
            const anchor = document.getElementById("v90send") || btn.parentElement || btn;
            anchor.insertAdjacentElement("afterend", box);
            box.querySelectorAll("[data-v92r4ago]").forEach((b: any) => b.addEventListener("click", () => { try { const f = F[+b.getAttribute("data-v92r4ago")]; f && f.go && f.go(); } catch (e) { } }));
        }
        catch (e) { warn("yelBox", e); }
    }

    /* ───────── (4)(5) 書類の中身（描いたあとの直し） ───────── */
    const UNIT: any = { 個: "pcs", 台: "units", 本: "pcs", 袋: "bags", 箱: "boxes", 枚: "sheets", 缶: "cans", 瓶: "bottles", セット: "sets", 着: "pcs", 点: "pcs", 足: "pairs", 脚: "pcs", 冊: "copies", 巻: "rolls", ケース: "cases", パック: "packs", 組: "sets", 丁: "pcs", 式: "sets" };
    function unitOfCi(S: any): string {
        // 請求書の「Unit of quantity」と同じ言葉を使う（PL の行にすでに英語の単位があればそれ）
        try {
            const r = S && S.docRows && Array.isArray(S.docRows.plRows) && S.docRows.plRows[0];
            const m = r && String(r[1] || "").match(/[\d,.]+\s*([A-Za-z]+)$/);
            if (m) return m[1];
        } catch (e) { }
        return "";
    }
    function enTotal(s: string, S: any): string {
        let t = String(s || "");
        if (!JA_RE.test(t)) return t;
        const u0 = unitOfCi(S);
        t = t.replace(/(\d)\s*カートン/g, "$1 CTN").replace(/総重量\s*/g, "G.W. ").replace(/正味重量\s*/g, "N.W. ").replace(/容積\s*/g, "Measurement ").replace(/\s*・\s*/g, " / ");
        t = t.replace(/(\d)\s*(個|台|本|袋|箱|枚|缶|瓶|セット|着|点|足|脚|冊|巻|ケース|パック|組|丁|式)/g, (m: string, d: string, u: string) => d + " " + (u0 || UNIT[u] || u));
        return t;
    }
    function ymdOf(part: string, base: string): string {
        // 「8月13日」「12-06」「12/06」→ 年つき（書類の日付より前の月日は翌年とみる）
        const p = String(part || "").trim();
        let m = p.match(/^(\d{1,2})月(\d{1,2})日$/) || p.match(/^(\d{1,2})[-\/](\d{1,2})$/);
        if (!m) return p;
        const mm = ("0" + m[1]).slice(-2), d2 = ("0" + m[2]).slice(-2);
        const b = String(base || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (!b) return mm + "-" + d2;
        let y = +b[1];
        if (mm + "-" + d2 < b[2] + "-" + b[3]) y++;
        return y + "-" + mm + "-" + d2;
    }
    function docFix(k: any) {
        try {
            const o = document.getElementById("dO");
            const doc: any = o && o.querySelector(".doc");
            const S = ship();
            if (!o || !doc || !S) return;
            k = String(k || W.__poDocK || "");
            if (!/^(pi|ci|pl)$/.test(k)) { const h4 = doc.querySelector("h4"); const t = String((h4 && h4.textContent) || ""); k = /PACKING/.test(t) ? "pl" : /COMMERCIAL/.test(t) ? "ci" : /PROFORMA/.test(t) ? "pi" : ""; }
            if (!k) return;
            const pairs: any[] = [];
            doc.querySelectorAll(".dl").forEach((dl: any) => { const c = Array.from(dl.children) as any[]; for (let i = 0; i + 1 < c.length; i++) pairs.push([String(c[i].textContent || "").trim(), c[i + 1]]); });
            const val = (re: RegExp) => { const p = pairs.find((x) => re.test(x[0])); return p ? p[1] : null; };
            // ETD / ETA：年つきの日付に
            const dateEl = val(/^Date$/), ee = val(/^ETD \/ ETA$/);
            if (ee && !ee.querySelector("*")) {
                const raw = String(ee.textContent || "");
                if (/月|^\s*\d{1,2}[-\/]\d{1,2}\s*\//.test(raw)) {
                    const base = String((dateEl && dateEl.textContent) || "").trim();
                    const out = (/月/.test(raw) ? raw.split(/\s*\/\s*/) : raw.split(/\s+\/\s+/)).map((x: string) => ymdOf(x, base));
                    if (out.length === 2 && out.join(" / ") !== raw) { ee.textContent = out.join(" / "); ee.setAttribute("data-noi18n", "1"); ee.setAttribute("lang", "en"); }
                }
            }
            // 見本の相手の名前（日本語の仮の名前）を、英文の書類では英語で
            const be = val(/^Buyer$/);
            if (be && isSmp(S) && !be.querySelector("*")) {
                const t = String(be.textContent || "");
                const m = t.match(/^（想定）[^,]*,\s*(.*)$/);
                if (m) { be.textContent = "(Sample buyer - fictitious), " + m[1]; be.setAttribute("data-noi18n", "1"); be.setAttribute("lang", "en"); }
            }
            // 梱包明細：合計と行の数量の単位を英語に
            if (k === "pl") {
                doc.querySelectorAll("table td.num").forEach((td: any) => { if (td.querySelector("*")) return; const t = String(td.textContent || ""); if (JA_RE.test(t)) { const n = enTotal(t, S); if (n !== t) { td.textContent = n; td.setAttribute("data-noi18n", "1"); } } });
            }
            // 支払条件の出どころ
            if (k !== "pl" && !o.querySelector(".v90paysrc") && !o.querySelector(".v92r4a-paysrc")) {
                let msg = "";
                const payEl = val(/^Payment$/);
                const shown = String((payEl && payEl.textContent) || "").trim();
                const t = ten(), d = dd();
                const reg = String((d && d.pay) || (t && t.pay) || "").trim();
                const rec = recOf(S), rp = recPay(rec);
                if (S.v90paySrc === "rec" && S.v61fb)
                    msg = M(`支払条件は、商談の記録の「${S.pay}」です（違うときは「受注内容を編集」の「支払」で直せます）。`, `Payment terms are the ones in the meeting record: “${S.pay}” (change them under Payment in “Edit order details”).`, `付款条件取自商谈记录：“${S.pay}”。`, `Las condiciones de pago provienen del registro de la reunión: «${S.pay}».`);
                else if (!S.poNo && shown && reg && String(S.pay || "").trim() === reg && (isSmpNote(o) || S.v61fb)) {
                    if (!rec || !rp)
                        msg = M(`支払条件「${shown}」は、商品情報に登録の「${reg}」から入れています。商談の記録には支払条件が入っていないため、相手と決めた条件と違うときは直してください。`, `Payment “${shown}” comes from the product information (“${reg}”). The meeting record has no payment terms, so correct it if you agreed otherwise.`, `付款条件“${shown}”取自商品信息中登记的“${reg}”。商谈记录中没有付款条件，如与对方约定不同请修改。`, `El pago «${shown}» proviene de la información del producto («${reg}»). El registro de la reunión no tiene condiciones de pago; corríjalo si acordó otra cosa.`);
                    else if (rp !== reg)
                        msg = M(`支払条件「${shown}」は、商品情報に登録の「${reg}」です。商談の記録（${rec.d || ""}）には「${rp}」とあります。相手と決めたほうに直してください。`, `Payment “${shown}” is the registered value (“${reg}”). The meeting record (${rec.d || ""}) says “${rp}”. Change it to what you agreed.`, `付款条件“${shown}”为商品信息中登记的“${reg}”。商谈记录（${rec.d || ""}）中为“${rp}”。请改为与对方约定的条件。`, `El pago «${shown}» es el valor registrado («${reg}»). El registro de la reunión (${rec.d || ""}) dice «${rp}». Cámbielo a lo acordado.`);
                }
                if (msg) doc.insertAdjacentHTML("afterend", `<div class="v92r4a-paysrc v92r4a-note" style="margin-top:6px;font-size:12px;opacity:.85" data-noi18n>${E(msg)}</div>`);
            }
            yelBox();
        }
        catch (e) { warn("docFix", e); }
    }
    // 見本の書類の注記（「商談記録の希望価格 … がそのまま入っています」）が出ているか
    function isSmpNote(o: any) { try { return /商談記録の|がそのまま入っています|as recorded|meeting record/.test(String(o.textContent || "").slice(-600)); } catch (e) { return false; } }
    if (typeof rDoc === "function") {
        const __rd = rDoc;
        rDoc = function (this: any, k: any) {
            try { payFix(ship()); } catch (e) { }
            const r = __rd.apply(this, arguments as any);
            try { docFix(k); setTimeout(() => docFix(k), 120); setTimeout(() => docFix(k), 600); } catch (e) { }
            return r;
        };
    }

    /* ───────── (6) other-M05：「この案件で使う書類 N点」の下に N+1 行（見積書は数に入れていない） ───────── */
    if (typeof vOpsDoc === "function") {
        const __vod = vOpsDoc;
        vOpsDoc = function (this: any) {
            try { payFix(ship()); } catch (e) { }
            let h = __vod.apply(this, arguments as any);
            try {
                const S = ship();
                if (typeof h === "string" && S && Array.isArray(S.docs) && S.docs.some((d: any) => d && d[0] === "PI") && h.indexOf("v92r4a-pi") < 0)
                    h = h.replace(/(この案件で使う書類 \d+点)(<\/h3>)/g, `$1<small class="v92r4a-pi" data-noi18n> ${E(M("＋見積書（PI）", "+ proforma invoice (PI)", "＋形式发票（PI）", "+ factura proforma (PI)"))}</small>$2`);
            }
            catch (e) { warn("vod", e); }
            return h;
        };
    }
    function fileNote() {
        // この案件の書類：表の行は「書類をつくる」の数＋見積書（PI）
        try {
            const st = document.querySelector(".stage") || document.getElementById("well");
            if (!st || document.getElementById("v92r4a-fnote")) return;
            const S = ship();
            if (!S || !Array.isArray(S.docs) || !S.docs.some((d: any) => d && d[0] === "PI")) return;
            const tb: any = Array.from(st.querySelectorAll("table")).find((t: any) => /Proforma Invoice/.test(t.textContent || "") && /Packing List/.test(t.textContent || "") && !t.closest(".doc"));
            if (!tb || tb.closest("#dO")) return;
            const h3s = Array.from(st.querySelectorAll("h3")) as any[];
            if (h3s.some((h) => /この案件で使う書類/.test(h.textContent || ""))) return; // 「書類をつくる」の側は見出しに書いてある
            const n = S.docs.length - 1;
            (tb.closest(".tw") || tb).insertAdjacentHTML("afterend", `<div class="v92r4a-note" id="v92r4a-fnote" style="margin-top:6px;font-size:12px;opacity:.85" data-noi18n>${E(M(`この表は ${n + 1}行です：「書類をつくる」の「この案件で使う書類 ${n}点」に、商談の書類の見積書（PI）を足した数です。`, `This table has ${n + 1} rows: the ${n} documents counted in “Create documents”, plus the proforma invoice (PI).`, `本表共 ${n + 1} 行：“制作单证”中的 ${n} 份单证，加上形式发票（PI）。`, `Esta tabla tiene ${n + 1} filas: los ${n} documentos de «Crear documentos» más la factura proforma (PI).`))}</div>`);
        }
        catch (e) { warn("fileNote", e); }
    }

    /* ───────── (7) other-M06：「点検して相手に送る」を押しても、知らせが出るだけで何も始まらない ─────────
       点検が通ったら印刷（PDF）の窓を開き、ボタンの下に「次にすること」を残す（宛先・件名・本文の入ったメールの下書きを開ける）。
       貿易クラウドからファイルを添付して送ることはできないので、そこは今までどおり利用者のメールソフトで。 */
    function buyerMail(S: any): string {
        try {
            const nm = String((S && S.buyer) || "").trim().toLowerCase();
            if (!nm) return "";
            for (const t of tens()) {
                const b = (Array.isArray(t.myBuyers) ? t.myBuyers : []).find((x: any) => x && String(x.co || "").trim().toLowerCase() === nm);
                const em = b && String(b.email || b.mail || "").trim();
                if (em && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return em;
            }
        } catch (e) { }
        return "";
    }
    function tabNow(): string { try { const b = document.querySelector('[data-doc][aria-pressed="true"]'); const k = b && b.getAttribute("data-doc"); return k === "ci" || k === "pl" ? k : "pi"; } catch (e) { return "pi"; } }
    function nextBox() {
        try {
            const S = ship();
            const well = document.getElementById("well") || document;
            const btn: any = Array.from(well.querySelectorAll("button")).find((b: any) => /点検して相手に送る|Check and send|检查后发送给对方|Revisar y enviar/.test(b.textContent || ""));
            if (!S || !btn) return;
            const old = document.getElementById("v92r4a-next"); if (old) old.remove();
            const k = tabNow();
            const NM: any = { pi: ["Proforma Invoice", "PI"], ci: ["Commercial Invoice", "CI"], pl: ["Packing List", "PL"] };
            const no = String(S.no || "").replace(/^([A-Z]+)-/, "$1-" + NM[k][1] + "-");
            const d = dd() || {};
            const co = String(d.coEn || "").trim();
            const to = isSmp(S) ? "" : buyerMail(S);
            const buyer = isSmp(S) ? "" : String(S.buyer || "").trim();
            const subj = NM[k][0] + " " + no + (co ? " - " + co : "");
            const body = "Dear " + (buyer || "Sir or Madam") + ",\n\nPlease find attached our " + NM[k][0] + " No. " + no + ".\nShould you have any questions, please let us know.\n\nBest regards,\n" + co + "\n";
            const href = "mailto:" + encodeURIComponent(to) + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
            const box = document.createElement("div");
            box.id = "v92r4a-next"; box.className = "v92r4a-next"; box.style.fontSize = "12px"; box.setAttribute("role", "status"); box.setAttribute("data-noi18n", "1");
            box.innerHTML = `<b>${E(M("点検が済みました。相手に送るまでの手順（貿易クラウドからはファイルを添付して送れません）", "Check passed. Steps to send it (Trade Cloud cannot send attachments)", "检查完成。发送给对方的步骤（贸易云无法发送附件）", "Revisión completada. Pasos para enviarlo (Trade Cloud no envía adjuntos)"))}</b>
<ol><li>${E(M("開いた印刷の窓で、送信先を「PDF に保存」にして保存します。窓が開かなかったときは →", "In the print window that opened, choose “Save as PDF”. If no window opened →", "在打开的打印窗口中选择“另存为 PDF”。若未打开窗口 →", "En la ventana de impresión elija «Guardar como PDF». Si no se abrió →"))} <button type="button" class="btn g" data-v92r4a="print">${E(M("PDFで書き出す（印刷）", "Export PDF (print)", "导出 PDF（打印）", "Exportar PDF (imprimir)"))}</button></li>
<li>${E(M("メールの下書きを開き、保存した PDF を添付して送ります。", "Open a draft email, attach the saved PDF and send it.", "打开邮件草稿，附上保存的 PDF 后发送。", "Abra un borrador de correo, adjunte el PDF y envíelo."))} <a class="btn" href="${E(href)}" data-v92r4a="mail">${E(M("✉ メールの下書きを開く（件名・本文入り）", "✉ Open draft email (subject and text filled in)", "✉ 打开邮件草稿（已填主题和正文）", "✉ Abrir borrador (asunto y texto)"))}</a><br><small>${E(to ? M(`宛先：${to}`, `To: ${to}`) : M("宛先のメールアドレスは登録が無いため空です。メールソフトで入れてください。", "The recipient address is not registered; enter it in your mail app.", "未登记收件人邮箱，请在邮件软件中填写。", "No hay dirección registrada; escríbala en su correo."))}　${E(M("件名", "Subject", "主题", "Asunto"))}：<span lang="en">${E(subj)}</span></small></li></ol>`;
            const anchor = document.getElementById("v92r4a-yel") || document.getElementById("v90send") || btn.parentElement || btn;
            anchor.insertAdjacentElement("afterend", box);
            const pb: any = box.querySelector('[data-v92r4a="print"]');
            if (pb) pb.addEventListener("click", () => { try { v33PiPrint(); } catch (e) { } });
            try { box.scrollIntoView({ block: "nearest" }); } catch (e) { }
        }
        catch (e) { warn("nextBox", e); }
    }
    API.nextBox = nextBox;
    if (typeof v33PiSend === "function" && typeof v33CkGate === "function") {
        const __ps = v33PiSend;
        v33PiSend = function (this: any) {
            try {
                v33CkGate({
                    title: "送る前の点検（見積書）", what: "見積書", sendLabel: "点検して PDF を作る", run: v33CkQuote, send: (a: any) => {
                        try { v33PiPrint(); } catch (e) { }
                        try { const S = ship(); v33AuLog("quote_send", "見積書（PI）" + (S && S.buyer ? "：" + S.buyer : ""), a && a.yel ? ("確認 " + a.yel + "件") : ""); } catch (e) { }
                        try { v33Toast("PDF を保存して、メールに添付して送ってください（貿易クラウドからはファイルを添付して送れません）"); } catch (e) { }
                        setTimeout(nextBox, 60);
                    }
                });
            }
            catch (e) { warn("piSend", e); return __ps.apply(this, arguments as any); }
        };
    }

    /* ───────── (8) culture-M11：発注書「CIF Los Angeles」→ 仕向港 ───────── */
    if (typeof poNorm === "function") {
        const __pn = poNorm;
        poNorm = function (this: any, j: any) {
            const r = __pn.apply(this, arguments as any);
            try {
                // CFR・CIF の場所は仕向港（インコタームズの決まり）。港の欄が空のときだけ入れる
                if (r && !String(r.pod || "").trim() && /^(CFR|CIF)$/.test(String(r.incoterm || "")) ) {
                    const pl = String(r.incotermPlace || "").replace(/[\s,.;]+$/, "").trim();
                    let isC = false; try { isC = typeof v56docIsCty === "function" && !!v56docIsCty(pl); } catch (e) { }
                    if (pl && !isC && !/^(port|incoterms?)$/i.test(pl)) { r.pod = pl; r._v92podInc = 1; }
                }
            }
            catch (e) { warn("poNorm", e); }
            return r;
        };
    }

    /* ───────── (9) culture-M12：知育玩具・対象年齢・ST マーク ───────── */
    if (typeof v85docFlagsAuto === "function") {
        const __fa = v85docFlagsAuto;
        v85docFlagsAuto = function (this: any, d: any, hs: any) {
            const o = __fa.apply(this, arguments as any);
            try {
                if (o && !o.children_product) {
                    const t = [typeof v85docText === "function" ? v85docText(d) : "", d && d.cert, d && d.certs, d && d.target, d && d.usage, d && d.spec].filter(Boolean).map(String).join(" ");
                    const m = t.match(/知育|積み木|つみき|パズル|ぬいぐるみ|人形|ままごと|\d\s*歳(?:から|以上|〜|~|児)|対象年齢|ST\s?マーク|STマーク|\bST mark\b|玩具安全/i);
                    if (m) o.children_product = M("品名・対象年齢・認証に子ども向け・玩具の語（" + m[0] + "）", "Product name / age / certification suggests a children's product or toy (" + m[0] + ")");
                }
            }
            catch (e) { }
            return o;
        };
    }

    /* ───────── (10) 判断の表 ───────── */
    let rowDest = "";
    const destHit = (txt: string, dest: string) => {
        try {
            const me = typeof v85docCName === "function" ? String(v85docCName(dest) || "") : "";
            if (me && txt.indexOf(me) >= 0) return true;
            const G = (typeof V85DOC_D !== "undefined" && V85DOC_D && V85DOC_D.groups) || {};
            if (/EU|欧州/.test(txt) && (G.EU || []).indexOf(dest) >= 0) return true;
            if (/中東|湾岸|GCC/.test(txt) && (G.GCC || []).indexOf(dest) >= 0) return true;
            const AL: any = { US: /米国|アメリカ/, GB: /英国|イギリス/, AU: /豪州|オーストラリア/, AE: /UAE|ドバイ/, SA: /サウジ/, KR: /韓国/, CN: /中国/, TW: /台湾/, HK: /香港/ };
            if (AL[dest] && AL[dest].test(txt)) return true;
        } catch (e) { }
        return false;
    };
    const CTYW = () => { try { return (typeof V85CTYW !== "undefined" && Array.isArray(V85CTYW)) ? V85CTYW.concat(["中東", "湾岸", "欧州"]) : []; } catch (e) { return []; } };
    function srcFix(x: any): any {
        if (!x || !x.ok) return x;
        let ok = String(x.ok);
        // 調べた人の作業メモ（担当・時間切れ など）は出さない
        ok = ok.replace(/（理由：([^）]*)）/g, (m: string, r: string) => {
            const keep = String(r).split("。").map((s) => s.trim()).filter((s) => s && !/担当|時間切れ|開けなかった|確かめていない|未確認$|調べは/.test(s));
            return keep.length ? "（理由：" + keep.join("。") + "）" : "";
        });
        // 別の国で確かめた資料：この国は未確認、とはっきり書く
        const m = ok.match(/^確認済み\s*[\d-]+（([^）]+)）／(.*要確認.*)$/);
        if (m && rowDest) {
            const named = CTYW().filter((w: string) => m[1].indexOf(w) >= 0);
            if (named.length && !destHit(m[1], rowDest)) {
                const me = typeof v85docCName === "function" ? String(v85docCName(rowDest) || rowDest) : rowDest;
                ok = M(`${me}では未確認です。輸入者・輸出先の当局で確かめてください（左の資料は「${m[1]}」で確かめたもの＝参考）`, "Not verified for this country. Check with the importer / local authority (the source on the left was verified for another country or product; reference only)", "该国尚未确认，请向进口商或当地主管部门确认（左侧资料针对其他国家或品类，仅供参考）", "No verificado para este país. Confirme con el importador o la autoridad local (la fuente es de otro país o producto; solo referencia)");
            }
        }
        if (ok === x.ok) return x;
        return Object.assign({}, x, { ok });
    }
    if (typeof v85docSrcHtml === "function") {
        const __sh = v85docSrcHtml;
        v85docSrcHtml = function (this: any, x: any) { try { arguments[0] = srcFix(x); } catch (e) { } return __sh.apply(this, arguments as any); };
    }
    if (typeof v85docRowHtml === "function") {
        const __rh = v85docRowHtml;
        v85docRowHtml = function (this: any, r: any, J: any) {
            const prev = rowDest;
            try { rowDest = String((J && J.F && J.F.dest) || ""); } catch (e) { rowDest = ""; }
            let h: any;
            try { h = __rh.apply(this, arguments as any); } finally { rowDest = prev; }
            try {
                // 自分の案件で期限が過ぎているとき：どうすればよいかを書く
                if (typeof h === "string" && h.indexOf("v85doc-late") >= 0 && !isSmp(ship())) {
                    let past = false;
                    try { const etd = String((W.v85docEtd ? W.v85docEtd() : (typeof v85docEtd === "function" ? v85docEtd() : "")) || ""); const td = typeof v85docToday === "function" ? String(v85docToday()) : new Date().toISOString().slice(0, 10); past = !!etd && etd < td; } catch (e) { }
                    h = h.replace(" （過ぎています）", " " + E(past ? "（出港の予定日そのものが過ぎています。出港日を入れ直すと、期限を計算し直します）" : "（過ぎています：いまの出港の予定では間に合いません。すぐ着手するか、出港日を見直してください）"));
                }
            } catch (e) { }
            return h;
        };
    }
    dict([["（出港の予定日そのものが過ぎています。出港日を入れ直すと、期限を計算し直します）", "(the planned sailing date itself has passed; enter a new sailing date to recalculate)", "（预定出港日本身已过。重新填写出港日后将重新计算期限）", "(la fecha de salida prevista ya pasó; introduzca una nueva para recalcular)"]]);
    dict([["（過ぎています：いまの出港の予定では間に合いません。すぐ着手するか、出港日を見直してください）", "(overdue: this cannot be done before the planned sailing date. Start now or move the sailing date)", "（已过期：按目前的出港计划来不及。请立即着手或调整出港日）", "(vencido: no llega a la fecha de salida prevista. Empiece ya o cambie la fecha)"]]);
    // health-M14：台湾 TFDA の手続きの名前を品目で出し分ける（食品・健康食品に「化粧品の製品登録」と出さない）
    if (typeof v85docDocInfo === "function") {
        const __di = v85docDocInfo;
        v85docDocInfo = function (this: any, k: any) {
            const r = __di.apply(this, arguments as any);
            try {
                if (k === "TW_TFDA" && r && /化粧品の製品登録/.test(String(r.ja || ""))) {
                    const d = (typeof v85docD === "function" ? v85docD() : dd()) || {};
                    const t = ten();
                    const hs = typeof v85docHsDigits === "function" ? v85docHsDigits(d.hs || (t && t.hs) || "") : String(d.hs || "").replace(/\D/g, "");
                    const ck = String(d.catKey || "");
                    const cosme = /^33/.test(hs) || /cosme|beauty/i.test(ck) || /化粧/.test(String(d.cat || ""));
                    const food = typeof v85docIsFood === "function" ? v85docIsFood(hs, ck) : false;
                    if (food && !cosme) return Object.assign({}, r, { ja: "台湾 TFDA の輸入査験（食品・健康食品）", en: "Taiwan TFDA Import Inspection (food / health food)" });
                    if (!cosme) return Object.assign({}, r, { ja: "台湾 TFDA の輸入査験・製品登録（品目による）", en: "Taiwan TFDA Import Inspection / Product Registration (by product type)" });
                }
            }
            catch (e) { }
            return r;
        };
    }
    dict([["台湾 TFDA の輸入査験（食品・健康食品）", "Taiwan TFDA import inspection (food / health food)", "台湾 TFDA 进口查验（食品・保健食品）", "Inspección de importación de la TFDA de Taiwán (alimentos / complementos)"],
        ["台湾 TFDA の輸入査験・製品登録（品目による）", "Taiwan TFDA import inspection / product registration (by product type)", "台湾 TFDA 进口查验・产品登录（视品类而定）", "Inspección de importación / registro de productos de la TFDA de Taiwán (según el producto)"]]);
    // auto-N18：見本の案件の期限は、過ぎた日付を出さない（見本の出港日は過去のことがある）
    if (typeof v85docDue === "function") {
        const __due = v85docDue;
        v85docDue = function (this: any, ld: any) {
            const r = __due.apply(this, arguments as any);
            try {
                if (r && /見本の出港日での計算|sample sailing date|样本出港日|salida de muestra/.test(String(r.t || "")) && (+ld || 0) > 0)
                    return { t: M(`出港の${+ld}日前まで（見本の案件のため日付は出していません。実際の出港日を入れると、日付で出ます）`, `${+ld} days before sailing (sample case: no date shown; enter the real sailing date to get one)`, `出港前 ${+ld} 天（样本案件不显示日期；填入实际出港日后显示）`, `${+ld} días antes de la salida (caso de muestra: sin fecha)`), late: 0 };
            }
            catch (e) { }
            return r;
        };
    }

    /* ───────── (11) 契約書の相手の選択 ───────── */
    function thFind(id: any): any { id = String(id || ""); for (const t of tens()) { try { const th = t && t.dmThreads && t.dmThreads[id]; if (th) return th; } catch (e) { } } return null; }
    const logOnly = (th: any) => !!(th && Array.isArray(th.msgs) && th.msgs.length && th.msgs.every((m: any) => m && m.v92fb));
    function legalFix() {
        try {
            const sel: any = document.getElementById("legbuyer");
            if (!sel) return;
            const sigOf = () => (Array.from(sel.options) as any[]).map((o: any) => o.textContent).join("\n");
            if (!sel || sel.__v92r4aSig === sigOf()) return;
            const key = (t: string) => { const m = String(t || "").match(/^(.*?)（([^・（）]*)・/); return m ? (m[1].trim().toLowerCase() + "|" + m[2].trim()) : ""; };
            const seen: any = {};
            (Array.from(sel.options) as any[]).forEach((o: any) => {
                const v = String(o.value || ""), txt = String(o.textContent || "");
                if (!/^v56d:/.test(v)) {
                    const th = thFind(v);
                    if (th && logOnly(th) && /往復 \d+通|\d+ messages?/.test(txt)) { o.textContent = txt.replace(/往復 \d+通/, M("商談の記録のみ・メッセージはまだ", "meeting record only, no messages yet", "仅有商谈记录，尚无消息", "solo registro de reunión, sin mensajes")); }
                    const k = key(o.textContent); if (k && !seen[k]) seen[k] = o;
                }
                else {
                    const k = key(txt), first = k && seen[k];
                    if (first) {
                        const m = txt.match(/・([^・）]*)）\s*$/);
                        if (m && String(first.textContent).indexOf(m[1]) < 0) first.textContent = String(first.textContent).replace(/）\s*$/, "・" + m[1] + "）");
                        o.remove();
                    }
                    else if (k) seen[k] = o;
                }
            });
            (Array.from(sel.querySelectorAll("optgroup")) as any[]).forEach((g: any) => { if (!g.querySelector("option")) g.remove(); });
            sel.__v92r4aSig = sigOf();
        }
        catch (e) { warn("legal", e); }
    }

    /* ───────── (12) indagri-M06：リンクを登録の表示名に URL がつながる ─────────
       URL を入れると表示名に URL が自動で入り、そこへ続けて打つと「URL＋名前」になっていた → 自動で入った分は、欄に入ったとき全部選ぶ。つながったまま登録されたら URL の分を外す */
    if (typeof d30LinkNew === "function") {
        const __ln = d30LinkNew;
        d30LinkNew = function (this: any) {
            const r = __ln.apply(this, arguments as any);
            try {
                const u: any = document.getElementById("d30lu"), n: any = document.getElementById("d30ln"), g: any = document.getElementById("d30lgo");
                if (u && n && g && !n.getAttribute("data-v92r4a")) {
                    n.setAttribute("data-v92r4a", "1");
                    const auto = () => String(u.value || "").replace(/^https?:\/\//, "").slice(0, 60);
                    u.addEventListener("change", () => { if (n.value && n.value === auto()) n.setAttribute("data-auto", n.value); });
                    // 自動で入った URL は、欄に入ったら消して薄い字（placeholder）に回す（空のまま登録すると、今までどおり URL が名前になる）
                    n.addEventListener("focus", () => { try { if (n.getAttribute("data-auto") && n.value === n.getAttribute("data-auto")) { n.placeholder = M("表示名（空のままなら URL）", "Display name (URL if left empty)", "显示名称（留空则用 URL）", "Nombre (URL si se deja vacío)"); n.value = ""; } } catch (e) { } });
                    g.addEventListener("click", () => { try { const a = n.getAttribute("data-auto") || auto(); const v = String(n.value || ""); if (a && v.length > a.length && v.indexOf(a) === 0) n.value = v.slice(a.length).trim(); } catch (e) { } }, true);
                }
            }
            catch (e) { warn("link", e); }
            return r;
        };
    }
    // すでに「URL＋名前」で登録された分は、確認の文・一覧では直さない（保存の中身は変えない）

    /* ───────── (13) culture-N20：Seller の住所。日本語の住所から英語の形の案 ───────── */
    const PREF: any = { 北海道: "Hokkaido", 青森県: "Aomori", 岩手県: "Iwate", 宮城県: "Miyagi", 秋田県: "Akita", 山形県: "Yamagata", 福島県: "Fukushima", 茨城県: "Ibaraki", 栃木県: "Tochigi", 群馬県: "Gunma", 埼玉県: "Saitama", 千葉県: "Chiba", 東京都: "Tokyo", 神奈川県: "Kanagawa", 新潟県: "Niigata", 富山県: "Toyama", 石川県: "Ishikawa", 福井県: "Fukui", 山梨県: "Yamanashi", 長野県: "Nagano", 岐阜県: "Gifu", 静岡県: "Shizuoka", 愛知県: "Aichi", 三重県: "Mie", 滋賀県: "Shiga", 京都府: "Kyoto", 大阪府: "Osaka", 兵庫県: "Hyogo", 奈良県: "Nara", 和歌山県: "Wakayama", 鳥取県: "Tottori", 島根県: "Shimane", 岡山県: "Okayama", 広島県: "Hiroshima", 山口県: "Yamaguchi", 徳島県: "Tokushima", 香川県: "Kagawa", 愛媛県: "Ehime", 高知県: "Kochi", 福岡県: "Fukuoka", 佐賀県: "Saga", 長崎県: "Nagasaki", 熊本県: "Kumamoto", 大分県: "Oita", 宮崎県: "Miyazaki", 鹿児島県: "Kagoshima", 沖縄県: "Okinawa" };
    function addrDraft(ja: string): any {
        // 日本語の住所を、英語の住所の並び（小さい順）に組み替える。読みが要る所は［ ］で残す（読みは作らない）
        let s = String(ja || "").replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/[－‐―ー−]/g, "-").replace(/\s+/g, " ").trim();
        let zip = "";
        s = s.replace(/〒?\s*(\d{3})-?(\d{4})/, (m: string, a: string, b: string) => { zip = a + "-" + b; return ""; }).trim();
        const pk = Object.keys(PREF).find((p) => s.indexOf(p) === 0);
        if (!pk) return null;
        let rest = s.slice(pk.length);
        const parts: string[] = [];
        const mCity = rest.match(/^(.+?郡.+?[町村]|.+?市|.+?区|.+?[町村])/);
        let city = "";
        if (mCity) { city = mCity[1]; rest = rest.slice(city.length); }
        let ward = "";
        const mW = rest.match(/^(.+?区)/);
        if (mW && /市$/.test(city)) { ward = mW[1]; rest = rest.slice(ward.length); }
        const mNum = rest.match(/^(.*?)([\d-]+(?:番地?|号)?(?:[\d-]*)?)(.*)$/);
        let town = rest, num = "", bld = "";
        if (mNum) { town = mNum[1]; num = mNum[2].replace(/番地?|号/g, "-").replace(/-+$/, "").replace(/丁目/g, "-"); bld = mNum[3].trim(); }
        town = town.replace(/(\d+)丁目$/, (m: string, a: string) => { num = a + (num ? "-" + num : ""); return ""; });
        const sfx = (x: string) => /市$/.test(x) ? "-shi" : /区$/.test(x) ? "-ku" : /町$/.test(x) ? "-cho（または -machi）" : /村$/.test(x) ? "-mura" : "";
        const yomi = (x: string) => x ? "［" + x + " の読み" + (sfx(x) ? "＋" + sfx(x) : "") + "］" : "";
        if (bld) parts.push("［" + bld + " の英語名］");
        parts.push((num ? num + " " : "") + (town ? "［" + town + " の読み］" : ""));
        if (ward) parts.push(yomi(ward));
        if (city) parts.push(yomi(city));
        parts.push(PREF[pk] + (zip ? " " + zip : ""));
        parts.push("Japan");
        return { text: parts.map((x) => x.trim()).filter(Boolean).join(", "), pref: PREF[pk], zip };
    }
    API.addrDraft = addrDraft;
    if (typeof v54docSellerEdit === "function") {
        const __se = v54docSellerEdit;
        v54docSellerEdit = function (this: any) {
            const r = __se.apply(this, arguments as any);
            try {
                const g: any = document.getElementById("v54sGo"), ad: any = document.getElementById("v54sAd"), msg: any = document.getElementById("v54sMsg");
                if (g && ad && msg && !g.getAttribute("data-v92r4a")) {
                    g.setAttribute("data-v92r4a", "1");
                    const help = () => {
                        try {
                            const old = document.getElementById("v92r4a-addr"); if (old) old.remove();
                            const v = String(ad.value || "").trim();
                            if (!JA_RE.test(v)) return;
                            const dft = addrDraft(v);
                            const box = document.createElement("div");
                            box.id = "v92r4a-addr"; box.className = "v92r4a-addr"; box.style.fontSize = "12px"; box.setAttribute("data-noi18n", "1");
                            box.innerHTML = `<b>${E(M("英語の住所の書き方（日本語と逆に、小さい所から並べます）", "How to write the address in English (smallest unit first)", "英文地址写法（从小到大排列）", "Cómo escribir la dirección en inglés (de menor a mayor)"))}</b><br>` +
                                (dft ? `${E(M("入れた住所から作った形：", "Draft from what you entered:", "根据所填地址生成的格式：", "Borrador a partir de lo introducido:"))}<br><span class="v92r4a-addrtx">${E(dft.text)}</span><br><small>${E(M("［ ］の中は、読みをローマ字にして入れてください（例：三条町 → Sanjo-cho、奈良市 → Nara-shi）。都道府県・郵便番号・番地は入れてあります。読みは自動では作っていません（読み違いを書類に載せないため）。", "Replace each [ ] with the reading in Latin letters (e.g. 三条町 → Sanjo-cho, 奈良市 → Nara-shi). The prefecture, postal code and numbers are filled in. Readings are not generated automatically, to avoid misreadings on documents.", "请把［ ］中的内容改成罗马字读音。都道府县、邮编、门牌号已填好。", "Sustituya cada [ ] por la lectura en letras latinas. La prefectura, el código postal y los números ya están puestos."))}</small><br><button type="button" class="btn g" id="v92r4a-addrgo">${E(M("この形を欄に入れて直す", "Put this draft in the field to edit", "将此格式填入栏内再修改", "Poner este borrador en el campo"))}</button>`
                                    : E(M("例：45 Sanjo-cho, Nara-shi, Nara 630-8244, Japan（番地 町名, 市区町村, 都道府県 郵便番号, Japan の順。町名・市名は読みをローマ字で）", "Example: 45 Sanjo-cho, Nara-shi, Nara 630-8244, Japan (number town, city, prefecture postal code, Japan)", "例：45 Sanjo-cho, Nara-shi, Nara 630-8244, Japan", "Ejemplo: 45 Sanjo-cho, Nara-shi, Nara 630-8244, Japan")));
                            msg.insertAdjacentElement("afterend", box);
                            const b: any = document.getElementById("v92r4a-addrgo");
                            if (b && dft) b.addEventListener("click", () => { try { ad.value = dft.text; ad.focus(); const i = ad.value.indexOf("［"); const j = ad.value.indexOf("］"); if (i >= 0 && j > i) ad.setSelectionRange(i, j + 1); msg.textContent = M("［ ］の所を読み（ローマ字）に直してから保存してください。", "Replace the [ ] parts with Latin-letter readings, then save."); } catch (e) { } });
                        }
                        catch (e) { warn("addr", e); }
                    };
                    g.addEventListener("click", () => setTimeout(help, 0));
                }
            }
            catch (e) { warn("sellerEdit", e); }
            return r;
        };
    }

    /* ───────── (14) culture-N09：価格表の答え「100〜299個 2,400円／300個〜 2,150円（FOB 清水）」の2段目の数量帯が「FOB」になる ─────────
       原因：建値の語（FOB など）がある区切りは、行の名前を建値にしていた（v54hearPrices）。
       → 数量帯が並んだ答えの終わりに「（FOB 清水）」と建値が添えてあるときは、建値を外して読み直し（行の名前は数量帯）、建値は取引条件に回す（まだ無いときだけ） */
    const TERM_PAREN = /[（(]\s*((?:FOB|EXW|CIF|CFR|CPT|CIP|DAP|DPU|DDP|FCA|FAS)\b[^）)]{0,24})[）)]/i;
    if (typeof v54hearPrices === "function") {
        const __hp = v54hearPrices;
        v54hearPrices = function (this: any, text: any, opt: any) {
            const r = __hp.apply(this, arguments as any);
            try {
                if (Array.isArray(r) && r.length >= 2 && r.some((f: any) => f && f.term && f.label === f.term) && r.some((f: any) => f && !(f.term && f.label === f.term))) {
                    const m = String(text || "").match(TERM_PAREN);
                    if (m) {
                        const r2 = __hp.call(this, String(text).replace(TERM_PAREN, " "), Object.assign({}, opt || {}, { exp: true }));
                        if (Array.isArray(r2) && r2.length === r.length && r2.every((f: any) => f && f.kind === "exp" && f.label && !/^(FOB|EXW|CIF|CFR|CPT|CIP|DAP|DPU|DDP|FCA|FAS)$/.test(f.label))) {
                            const code = (m[1].match(/^[A-Za-z]{3}/) || [""])[0].toUpperCase();
                            r2.forEach((f: any) => { f.term = code; });
                            return r2;
                        }
                    }
                }
            }
            catch (e) { warn("hearPrices", e); }
            return r;
        };
    }
    if (typeof v54hearPriceSave === "function") {
        const __ps2 = v54hearPriceSave;
        v54hearPriceSave = function (this: any, F: any, raw: any) {
            const r = __ps2.apply(this, arguments as any);
            try {
                const m = String(raw || "").match(TERM_PAREN);
                const t = ten();
                if (m && t && Array.isArray(F) && F.length >= 2 && F.every((f: any) => f && f.kind === "exp") && !String(t.term || "").trim() && typeof applyAnswer === "function") {
                    applyAnswer(t, "term", m[1].trim());
                    try { if (typeof saveTen === "function") saveTen(); } catch (e) { }
                }
            }
            catch (e) { warn("hearSave", e); }
            return r;
        };
    }

    dict([["CIF・CIP で売る時（売主が保険を手配）", "When selling on CIF / CIP terms (the seller arranges insurance)", "以 CIF・CIP 条件销售时（由卖方投保）", "Al vender en CIF / CIP (el vendedor contrata el seguro)"]]);

    /* ───────── 描いたあと ───────── */
    let lastAfter = 0, lastYel = 0;
    function after() {
        const now = Date.now();
        if (now - lastAfter < 250) return;
        lastAfter = now;
        try { legalFix(); } catch (e) { }
        try { fileNote(); } catch (e) { }
        try { if (document.getElementById("dO") && now - lastYel > 1000) { lastYel = now; yelBox(); } } catch (e) { }
    }
    /* medical-N12：販売先国を確定して国が変わっても、見本の案件（一覧の行）が前の国のまま残る
       → 見本の案件を開いている間（自分の案件を開いていない間）は、描く前に、一覧の見本の行をいまの見本の案件（D.ship）に合わせる（本体の shipEnsure と同じ合わせ方） */
    function seedSync() {
        try {
            if (typeof SHIPS === "undefined" || !SHIPS || !SHIPS[0] || typeof SHIPA === "undefined" || SHIPA !== 0) return;
            const c = SHIPS[0], d = dd();
            if (!c.seed || c.custom || !d || !d.ship || c.ship === d.ship) return;
            if (typeof PID !== "undefined" && SHIPS._pid !== PID) return;
            if (!isSmp(d.ship) || !isSmp(c.ship)) return;
            c.ship = d.ship;
        }
        catch (e) { }
    }
    /* xlogin-28（ドキュメントの 🗑）：確認の窓をブラウザ標準の窓でなく、アプリの確認の窓で */
    if (typeof d30Del === "function" && typeof v70admAskBox === "function") {
        const __dd = d30Del;
        d30Del = async function (this: any, id: any) {
            let d: any = null;
            try { d = typeof v30One === "function" ? v30One("docs", id) : null; } catch (e) { }
            if (!d) return __dd.apply(this, arguments as any);
            let ok = false;
            try {
                ok = await v70admAskBox({ title: M(`「${d.n}」をゴミ箱に移しますか？`, `Move “${d.n}” to the trash?`, `要将“${d.n}”移到回收站吗？`, `¿Mover «${d.n}» a la papelera?`), lines: [M("30日以内なら、ゴミ箱から元に戻せます。", "You can restore it from the trash within 30 days.", "30天内可从回收站恢复。", "Puede restaurarlo desde la papelera en 30 días.")], go: M("ゴミ箱に移す", "Move to trash", "移到回收站", "Mover a la papelera"), danger: true });
            } catch (e) { return __dd.apply(this, arguments as any); }
            if (!ok) return;
            const oc = window.confirm;
            let p: any;
            try { window.confirm = () => true; p = __dd.apply(this, arguments as any); } finally { window.confirm = oc; }
            return p;
        };
    }

    if (typeof render === "function") {
        const __r = render;
        render = function (this: any) {
            try { seedSync(); } catch (e) { }
            const r = __r.apply(this, arguments as any);
            try { after(); setTimeout(after, 150); setTimeout(after, 700); } catch (e) { }
            return r;
        };
    }
    API.after = after;
    try { setTimeout(after, 800); } catch (e) { }
})();
