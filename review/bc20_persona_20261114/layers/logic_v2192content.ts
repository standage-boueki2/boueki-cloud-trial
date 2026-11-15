/* 21.92 content：商材に合わない内容・画面どうしの内容の食い違いの直し（2026-11-15 2回目の評価）。本体の層（今の版・刷新版の両方に効く）
   今のアプリの関数は包むだけ。数字・事実はアプリが持っているものだけ（規制・税の中身は足さない。確かでないことは「要確認」）。
   (a) 関税率のひな形の流用（health-N01・daily-N05・food-04 の残り）：商品の HS と、ひな形の代表品目の HS が違うとき、
       商品情報の通関統計コネクト（税の欄・関税込み概算）・国選定の要点と配点の説明・AI商社マンの答えに「別の品目の目安（要確認）」「参考」と明記する。
       数字そのものは変えない・足さない（規制の画面の注記＝ops の層と同じ条件：TPL_HS・v92opsKind）。
   (b) 内蔵の AI商社マンの答え（health-N02・daily-N07・health-02 の残り・medical-N03・indagri-N10・auto-N12）：
       国の規制の答えは、規制の画面（ops の層が描く「この商品と送り先で確かめる点」＝書類の判断の表・業種の観点・条件つきの手続き）を
       見えない枠に描いて、その中身から作る（同じ出どころ）。「必須の登録・表示はありません」「0%（かかりません）」と言い切らない。
       案件の詳細からの質問（【案件：…】で始まる）は、案件の状態の語で「やり取り中の Buyer の一覧」に振り分けられていた → 本文で振り分ける。
       「見積の出し方」には、登録の取引条件・価格表・MOQ・支払条件から手順を答える。
   (c) 営業メールの文面（medical-N01・health-N07・daily-N06・indagri-N17・auto-N06・food-N09）：英語の文に入れる値は英語の形に
       （国名・業態・カテゴリー・単位はアプリの英語名。訳せない自由記述＝強み・産地などは入れず、文面の窓で「入れていない項目」と「日本語が残っている所」を知らせる）。
       署名の [Your Name] は登録の名前に。業態が空のバイヤー（業態の位置に社名）には「a leading 〈社名〉」と書かない。
       中古の1台もの（中古車・建機）には「We make」「send samples」と書かない。
   (d) AIバイヤー開拓の業態の選択肢を、商材の大カテゴリー（V92_GROUPS）で言い分ける（足すだけ。今の候補は消さない）。
       業態を選ばないときの見本リストには、その商材に合わない業態（医療に飲食・ホテル など）を入れない。
   (e) そのほか：規制の画面の「通関・出荷で使う書類」が「—」（health-N11）／営業資料の「完成しました！」と件数（health-N09）／
       推奨FOBの試算が登録の単価を読めない（health-N08）／用語集に D/P・D/A・510(k)（medical-N14）／同じ注意書きが2回（medical-N09 ほか）／
       「中継 未設定（管理者がサーバーを…）」（medical-N10）／リチウム石けん基のグリースを電池と読む（indagri-N01・auto-N07 の電池の分）／
       AI商社マンの例文が食品のまま（auto-08）／答えの根拠の案件番号の二重ハイフン（auto-19）／数量を聞かれたら合計も（auto-N08）／
       価格表の帯が数量でない（走行距離帯・稼働時間帯）ときの言い方（auto-N05 の AI・商品情報・メールの分）／食品の編集の窓の「中古品として扱う」（food-03 の残り） */
declare const TEN: any, D: any, SES: any, I18N: any, GL: any, PID: any, BCACT: any, V71OB_BIZ: any, V71OB_SMP: any, V71OB: any, V85UNIT: any, V56DECK_QU: any;
declare let rReg: any, ansReg: any, brain: any, v71obTpl: any, dmTemplateEN: any, v79obSigFill: any, v71obSample: any, v71obPaint: any, v71obHtml: any, v71obBuild: any, ctyWhyLocal: any,
    csCurFob: any, bmNoteHtml: any, applyAnswer: any, fillSay: any, FILL: any, opsRegC: any, opsRegI: any, render: any, opsTab: any, v68regBatt: any, v85docFlagsAuto: any, v71obBrief: any, dmBrief: any;
declare function esc(s: any): string;
declare function go(id: string): void;
declare function pickCountry(q: any): any;
declare function v79obSig(): any;
declare function v71obLead(id: any): any;
declare function ctyEn(c: any): string;
declare function v68trPxCells(t: any): any;
declare function ddpFx(): any;
declare function v85docText(d: any): string;
(function () {
    const W: any = window;
    if (W.__v2192content)
        return;
    W.__v2192content = 1;
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]);
    const lang = () => { try {
        const el = document.getElementById("lang") as any;
        const v = String((el && el.value) || (typeof I18N !== "undefined" && I18N && I18N.lang) || "ja");
        return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
    }
    catch (e) {
        return "ja";
    } };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const warn = (k: string, e: any) => { try {
        (W.__v92ctErr = W.__v92ctErr || []).push(k + ":" + String((e && e.message) || e).slice(0, 160));
    }
    catch (x) { } };
    const dict = (rows: string[][]) => { try {
        if (typeof I18N === "undefined" || !I18N || !I18N.dict)
            return;
        rows.forEach(r => { if (r[1] && I18N.dict.en && !I18N.dict.en[r[0]])
            I18N.dict.en[r[0]] = r[1]; if (r[2] && I18N.dict.zh && !I18N.dict.zh[r[0]])
            I18N.dict.zh[r[0]] = r[2]; if (r[3] && I18N.dict.es && !I18N.dict.es[r[0]])
            I18N.dict.es[r[0]] = r[3]; });
    }
    catch (e) { } };
    const isStaff = () => { try {
        return typeof SES !== "undefined" && !!SES && (SES.t === "admin" || SES.role === "stg");
    }
    catch (e) {
        return false;
    } };
    const ten = () => { try {
        return (typeof TEN !== "undefined" && TEN) ? TEN : null;
    }
    catch (e) {
        return null;
    } };
    const dd = () => { try {
        return (typeof D !== "undefined" && D) ? D : null;
    }
    catch (e) {
        return null;
    } };
    const own = () => { const t = ten(); return !!t && (t.src === "upload" || t.src === "sample2"); };
    const digits = (s: any) => String(s == null ? "" : s).replace(/[^\d]/g, "");
    const JA = /[ぁ-んァ-ヶ一-龠々]/;
    const group = () => { try {
        const d = dd() || {}, t = ten() || {};
        return (W.v92catGroupOf && (W.v92catGroupOf(t.cat || d.cat) || W.v92catGroupOf(d.cat))) || null;
    }
    catch (e) {
        return null;
    } };
    const catNow = () => { const d = dd() || {}, t = ten() || {}; return String(t.cat || d.cat || ""); };
    function css() {
        if (document.getElementById("v92ct-css"))
            return;
        const s = document.createElement("style");
        s.id = "v92ct-css";
        s.textContent = `.v92ct-ref{margin:4px 0 0;font-size:11px;line-height:1.55;color:var(--warn,#B45309);font-weight:600;white-space:normal;text-align:left}
.v92ct-tag{display:inline-block;margin-right:5px;padding:1px 7px;border-radius:999px;background:var(--warn-soft,#FEF3C7);color:var(--warn,#B45309);font-size:10.5px;font-weight:700;vertical-align:middle}
.v92ct-note{margin:8px 0;padding:9px 12px;border-radius:10px;background:var(--warn-soft,#FEF3C7);color:var(--warn,#92400E);font-size:12px;line-height:1.7;font-weight:600}
.v92ct-mailwarn{margin:8px 0;padding:9px 12px;border-radius:10px;background:var(--warn-soft,#FEF3C7);color:var(--warn,#92400E);font-size:12px;line-height:1.7}
.v92ct-mailwarn b{display:block}.v92ct-mailwarn ul{margin:3px 0 0 18px;padding:0}
.v92ct-ans{margin-top:10px;padding:10px 12px;border-radius:10px;border:1px solid var(--line,#E5E7EB);background:var(--surface-2,#F8FAFC);line-height:1.7}
.v92ct-ans .lv{display:inline-block;margin-right:6px;padding:0 7px;border-radius:999px;font-size:10.5px;font-weight:700;background:var(--warn-soft,#FEF3C7);color:var(--warn,#B45309)}
.v92ct-ans .lv.required,.v92ct-ans .lv.ban{background:var(--crit-soft,#FEE2E2);color:var(--crit,#B91C1C)}
.v92ct-ans small{display:block;color:var(--ink-2,#475569);font-size:11.5px;margin:0 0 4px}`;
        document.head.appendChild(s);
    }

    /* ═════ (a) 関税率のひな形の流用 ═════ */
    const TPL_HS: any = { food: ["0902", "茶", "tea"], cosme: ["3304", "スキンケア", "skin care"], parts: ["8482", "軸受", "bearings"], daily: ["9617", "魔法瓶", "vacuum flasks"], liquor: ["2206", "清酒", "sake"],
        apparel: ["6203", "綿のズボン", "cotton trousers"], car: ["8703", "乗用車", "passenger cars"], medical: ["3005", "衛生材料", "dressings"] };
    function tplMis() {
        try {
            if (!own() || typeof W.v92opsKind !== "function")
                return null;
            const K = W.v92opsKind();
            if (!K)
                return null;
            const T = TPL_HS[K.ck === "supp" ? "food" : K.ck];
            const hs = String(K.hs || "");
            if (!T || hs.length < 4 || hs.slice(0, 4) === T[0])
                return null;
            return { tpl: T[0], nm: lang() === "ja" ? T[1] : T[2], hs: hs.slice(0, 4) + (hs.length >= 6 ? "." + hs.slice(4, 6) : "") };
        }
        catch (e) {
            return null;
        }
    }
    const misOn = (r: any) => { const duty = String((r && r.duty) || ""); return !!duty && !/要確認/.test(duty) && duty !== "—"; };
    const misShort = (m: any) => M(`別の品目（${m.nm}・HS ${m.tpl}）の目安・要確認`, `guide for another item (${m.nm}, HS ${m.tpl}) — to be confirmed`, `其他品目（${m.nm}・HS ${m.tpl}）的参考值・需确认`, `orientativo de otro producto (${m.nm}, HS ${m.tpl}) — por confirmar`);
    const misLong = (m: any) => M(`関税率は、カテゴリーの代表的な品目（${m.nm}・HS ${m.tpl}）の目安です。この商品（HS ${m.hs}）の税率は未確認です。相手国の関税率表で確かめてください（要確認）。`,
        `The duty rate is a guide for a typical item of this category (${m.nm}, HS ${m.tpl}). The rate for this product (HS ${m.hs}) has not been confirmed — check the destination's tariff schedule.`,
        `关税率是该类别代表性品目（${m.nm}・HS ${m.tpl}）的参考值。本商品（HS ${m.hs}）的税率尚未确认，请查阅对方国家的税则（需确认）。`,
        `El arancel es orientativo de un producto típico de la categoría (${m.nm}, HS ${m.tpl}). El tipo de este producto (HS ${m.hs}) no está confirmado: consulte el arancel del país de destino.`);
    // 国選定の要点（カード・表・レポート）：「関税17%」のあとに注記
    if (typeof ctyWhyLocal === "function") {
        const __cw = ctyWhyLocal;
        ctyWhyLocal = function (this: any, r: any) {
            let s = __cw.apply(this, arguments as any);
            try {
                const m = tplMis(), f = r && r.facts;
                if (m && f && f.known && misOn(f) && f.c !== "香港" && typeof s === "string" && !/別の品目/.test(s))
                    s = s.replace(/^(関税[^／・]*)/, "$1（" + `別の品目〈${m.nm}・HS ${m.tpl}〉の目安・要確認` + "）");
            }
            catch (e) { }
            return s;
        };
    }
    function sweepMis() {
        const m = tplMis();
        const d = dd();
        if (!m || !d || !d.regs)
            return;
        // 商品情報：通関統計コネクトの表
        document.querySelectorAll(".v56tariff-bench tr[data-v56tariff-c]").forEach((tr: any) => {
            if (tr.querySelector(".v92ct-ref"))
                return;
            const c = tr.getAttribute("data-v56tariff-c") || "";
            const r = d.regs[c];
            const tc = tr.querySelector(".v56tariff-tc"), lc = tr.querySelector(".v56tariff-lc");
            if (!r || !misOn(r) || !tc)
                return;
            // アプリが「この国は輸入の税なし」と持っている国（品目によらない）は、そのまま
            if (/輸入の税なし/.test(tc.textContent || ""))
                return;
            css();
            tc.insertAdjacentHTML("beforeend", `<p class="v92ct-ref" data-noi18n>⚠ ${E(misShort(m))}<br>${E(M(`この商品（HS ${m.hs}）の税率は未確認`, `Rate for this product (HS ${m.hs}) not confirmed`, `本商品（HS ${m.hs}）的税率未确认`, `Tipo de este producto (HS ${m.hs}) sin confirmar`))}</p>`);
            if (lc && /[¥$€\d]/.test(lc.textContent || "")) {
                lc.insertAdjacentHTML("afterbegin", `<span class="v92ct-tag" data-noi18n>${E(M("参考", "Reference", "参考", "Referencia"))}</span>`);
                lc.insertAdjacentHTML("beforeend", `<p class="v92ct-ref" data-noi18n>${E(M("別の品目の関税率で計算した参考の値です。価格の決定には使わず、この商品の税率を確かめてから計算し直してください。", "A reference value calculated with another item's duty rate. Do not use it for pricing; recalculate after confirming the rate for this product.", "按其他品目的关税率计算的参考值。请勿用于定价，确认本商品税率后再重新计算。", "Valor de referencia calculado con el arancel de otro producto. No lo use para fijar precios; recalcule tras confirmar el tipo de este producto."))}</p>`);
            }
        });
        // 商品情報：上の札「調査済みの仕向国 … 関税率と必要書類を紐付け済み」
        document.querySelectorAll(".kd").forEach((kd: any) => {
            if (kd.dataset.v92ct || !/^(関税率と必要書類を紐付け済み|関税・必要書類の基本を表示)/.test((kd.textContent || "").trim()))
                return;
            kd.dataset.v92ct = "1";
            css();
            kd.insertAdjacentHTML("beforeend", `<span class="v92ct-ref" style="display:block" data-noi18n>${E(M(`関税率は ${misShort(m)}`, `Duty rates: ${misShort(m)}`, `关税率：${misShort(m)}`, `Aranceles: ${misShort(m)}`))}</span>`);
        });
        // 国選定：配点の説明のそばに
        try {
            const st = document.querySelector(".stage") || document.body;
            if (!st.querySelector("[data-v92ct='ctymis']") && d.regs && Object.keys(d.regs).some(c => misOn(d.regs[c]))) {
                const cand = (Array.from(st.querySelectorAll("p, div.nn, small, span.nn")) as any[]).filter(x => /評価の配点：/.test(x.textContent || "") && x.children.length < 6);
                const el = cand.sort((a, b) => (a.textContent || "").length - (b.textContent || "").length)[0];
                if (el) {
                    css();
                    el.insertAdjacentHTML("afterend", `<p class="v92ct-note" data-v92ct="ctymis" data-noi18n>⚠ ${E(M(`要点の「関税◯%」と「規制」の点は、カテゴリーの代表的な品目（${m.nm}・HS ${m.tpl}）のひな形から出した参考の値です。この商品（HS ${m.hs}）の税率と必要な手続きは、国を決める前に「規制を調べる」と相手国の関税率表で確かめてください（要確認）。`,
                        `The “duty ◯%” in the key points and the “Regulation” score are reference values from the template for a typical item of this category (${m.nm}, HS ${m.tpl}). Confirm the rate and procedures for this product (HS ${m.hs}) in “Check regulations” and the destination's tariff schedule before deciding.`,
                        `要点中的“关税◯%”和“法规”得分，是根据该类别代表性品目（${m.nm}・HS ${m.tpl}）模板得出的参考值。请在确定国家前，通过“查询法规”和对方国家税则确认本商品（HS ${m.hs}）的税率和手续（需确认）。`,
                        `El «arancel ◯%» y la puntuación de «Regulación» son valores de referencia de la plantilla de un producto típico (${m.nm}, HS ${m.tpl}). Confirme el tipo y los trámites de este producto (HS ${m.hs}) antes de decidir.`))}</p>`);
                }
            }
        }
        catch (e) { }
    }

    /* ═════ (b) AI商社マンの答え：規制の画面と同じ出どころから ═════ */
    let busy = 0;
    const DG: any = {};
    function digest(c: string) {
        try {
            const d = dd();
            if (!d || !d.regs || !d.regs[c] || typeof rReg !== "function")
                return null;
            const key = [typeof PID !== "undefined" ? PID : "", c, d.hs, d.cat, lang(), JSON.stringify((ten() || {}).regCond || {}).length].join("|");
            if (DG[key] && Date.now() - DG[key].at < 15000)
                return DG[key].v;
            const olds = (["rO", "rC", "rI"].map(id => document.getElementById(id)).filter(Boolean)) as any[];
            const h = document.createElement("div");
            h.hidden = true;
            h.setAttribute("data-v92ct-h", "1");
            let out: any = null;
            const o1 = opsRegC, o2 = opsRegI;
            busy++;
            try {
                olds.forEach(e => { e.setAttribute("data-v92oid", e.id); e.id = e.id + "__v92ct"; });
                h.innerHTML = `<select id="rC"><option selected></option></select><div id="rO"></div>`;
                (h.querySelector("option") as any).value = c;
                document.body.appendChild(h);
                rReg();
                const box = h.querySelector("#rO") as any;
                const tx = (el: any) => String((el && el.textContent) || "").replace(/\s+/g, " ").trim();
                const st = box.querySelector(".v54r-st");
                out = { st: st ? { b: tx(st.querySelector("b")), p: tx(st.querySelector("p")), cls: st.className } : null, dn: tx(box.querySelector(".v92o-dn")), rows: [], vp: [], cond: [], vpNm: "" };
                box.querySelectorAll("[data-v92pts] .v92o-ul > li").forEach((li: any) => {
                    const lv = li.querySelector(".v92o-lv");
                    const row = { lv: tx(lv), k: lv ? String(lv.className).replace(/v92o-lv/, "").trim() : "", t: tx(li.querySelector("b")), d: tx(li.querySelector(".v92o-tc")) };
                    if (row.k === "cf")
                        out.vp.push(row);
                    else
                        out.rows.push(row);
                });
                const h3 = (Array.from(box.querySelectorAll("[data-v92pts] .v92o-h3 small")) as any[]).pop();
                out.vpNm = out.vp.length && h3 ? tx(h3).split(/・一般的な注意| — general/)[0] : "";
                box.querySelectorAll(".v92o-cond.unk").forEach((x: any) => out.cond.push({ t: tx(x.querySelector("b")), d: tx(x.querySelector(".v92o-why")) }));
            }
            catch (e) {
                warn("digest", e);
                out = null;
            }
            finally {
                try {
                    h.remove();
                }
                catch (e) { }
                olds.forEach(e => { e.id = e.getAttribute("data-v92oid"); e.removeAttribute("data-v92oid"); });
                try {
                    opsRegC = o1;
                    opsRegI = o2;
                }
                catch (e) { }
                busy--;
            }
            DG[key] = { at: Date.now(), v: out };
            return out;
        }
        catch (e) {
            return null;
        }
    }
    W.v92ctDigest = digest;
    const cnt = (G: any, k: string) => G.rows.filter((x: any) => x.k === k).length;
    function digestHtml(G: any, c: string, q: string) {
        if (!G || (!G.rows.length && !G.vp.length && !G.cond.length))
            return "";
        css();
        // 質問に表示・ラベルの語があれば、その点を先に
        const lab = /表示|ラベル|label/i.test(q || "");
        const ord = (L: any[]) => lab ? L.slice().sort((a, b) => (/表示|ラベル|label/i.test(b.t + b.d) ? 1 : 0) - (/表示|ラベル|label/i.test(a.t + a.d) ? 1 : 0)) : L;
        const clip = (s: string, n: number) => s.length > n ? s.slice(0, n) + "…" : s;
        let a = `<div class="v92ct-ans" data-noi18n><b>🔎 ${E(M("この商品と送り先で確かめる点", "Points to check for this product and destination"))}（${E(c)}）</b><small>${E(M("「規制を調べる」の画面と同じ内容です。上の表（カテゴリーのひな形・概算）に入っていない点も含みます。必須かどうかは、商品の細かい条件と相手国の最新の決まりで変わります（要確認）。",
            "Same content as the “Check regulations” screen, including points not covered by the template table above. Whether they are mandatory depends on product details and the destination's latest rules (please confirm)."))}</small>`;
        if (G.rows.length)
            a += ord(G.rows).map((x: any) => `<span class="lv ${E(x.k)}">${E(x.lv)}</span><b>${E(x.t)}</b>${x.d ? "：" + E(clip(x.d, 150)) : ""}`).join("<br>");
        if (G.cond.length)
            a += (G.rows.length ? "<br><br>" : "") + `<b>${E(M("該当するときだけ必要な手続き（該当するか未確認）", "Procedures needed only when they apply (not yet confirmed)"))}</b><br>` + G.cond.map((x: any) => `・<b>${E(x.t)}</b>${x.d ? "　" + E(clip(x.d, 120)) : ""}`).join("<br>");
        if (G.vp.length)
            a += ((G.rows.length || G.cond.length) ? "<br><br>" : "") + `<b>${E(M("この業種で確かめる観点", "Points to check for this type of product"))}${G.vpNm ? "（" + E(G.vpNm) + "）" : ""}</b><br>` + ord(G.vp).map((x: any) => `・<b>${E(x.t)}</b>${x.d ? "<br>　" + E(clip(x.d, lab && /表示|ラベル|label/i.test(x.t + x.d) ? 260 : 130)) : ""}`).join("<br>");
        a += `<br><br><button class="btn g" type="button" data-act="v92ct.reg" data-arg="${E(c)}">${E(M("「規制を調べる」で開く", "Open in “Check regulations”"))}</button></div>`;
        return a;
    }
    const NO_A = "この表で分かる必須の登録・表示はありません。規制は商品ごとに違うため、出荷の前にAI詳細調査で確かめてください。";
    const NO_B = "この表で分かる必須の登録・表示はありません（規制は要確認）。";
    if (typeof ansReg === "function") {
        const __ar = ansReg;
        ansReg = function (this: any, q: any) {
            const res = __ar.apply(this, arguments as any);
            try {
                if (!res || typeof res.a !== "string")
                    return res;
                const d = dd();
                if (!d || !d.regs)
                    return res;
                const m = tplMis();
                let c: any = null;
                try {
                    c = typeof pickCountry === "function" ? pickCountry(q) : null;
                }
                catch (e) { }
                if (c && d.regs[c]) {
                    const r = d.regs[c];
                    if (m && misOn(r)) {
                        res.a = res.a.replace(/(<b>関税率　[^<]*<\/b>)(（かかりません）|　卸価格への影響を確認してください。)?/, (_all: string, a: string) => a + `<br><span style="color:var(--warn)">⚠ ${E(misLong(m))}</span>`);
                    }
                    else
                        res.a = res.a.replace("（かかりません）", "（アプリのひな形の目安です。適用の条件は要確認）");
                    const G = digest(c);
                    if (G) {
                        const req = cnt(G, "required") + cnt(G, "ban");
                        if (res.a.indexOf(NO_A) >= 0) {
                            const lead = req ? M(`<b>⚠ 必須の手続きがあるかは要確認です。</b>上のひな形の表（概算）には手続きの名前が入っていませんが、アプリの書類の判断の表には、この商品とこの国に当たる手続きがあります（必須 ${req}件）。下をご覧ください。`,
                                `<b>⚠ Whether mandatory procedures exist needs confirmation.</b> The template table above lists none, but the app's document decision table has procedures for this product and country (${req} required). See below.`)
                                : (G.rows.length || G.vp.length || G.cond.length) ? M("上のひな形の表（概算）には、必須の登録・表示の名前は入っていません。ただし「無い」とは言い切れません。下の確かめる点を、出荷の前に確かめてください（要確認）。",
                                    "The template table above lists no mandatory registration or labelling, but that does not mean there is none. Check the points below before shipping (please confirm).")
                                    : M("上のひな形の表（概算）には、必須の登録・表示の名前は入っていません。規制は商品ごとに違うため、出荷の前に AI 詳細調査か STANDAGE への相談で確かめてください（要確認）。",
                                        "The template table above lists no mandatory registration or labelling. Rules differ by product; confirm before shipping (AI research or ask STANDAGE).");
                            res.a = res.a.split(NO_A).join(lead);
                        }
                        res.a += digestHtml(G, c, String(q || ""));
                    }
                }
                else if (!c) {
                    Object.keys(d.regs).forEach(k => {
                        const G = digest(k);
                        if (!G)
                            return;
                        const req = cnt(G, "required") + cnt(G, "ban"), cd = cnt(G, "conditional") + G.cond.length, ck = cnt(G, "check") + G.vp.length;
                        if (!req && !cd && !ck)
                            return;
                        const sum = M(`ひな形の表のほかに、確かめる点があります（書類の判断の表：必須 ${req}件・条件つき ${cd}件・確かめること ${ck}件。要確認）`,
                            `besides the template table, there are points to check (decision table: ${req} required, ${cd} conditional, ${ck} to check — please confirm)`);
                        const head = `<b>${E(k)}</b>　`;
                        if (res.a.indexOf(head + NO_B) >= 0)
                            res.a = res.a.replace(head + NO_B, head + sum + "。");
                    });
                    try {
                        const t = ten() || {};
                        const c0 = ((t.targets || []).filter((k: string) => d.regs[k])[0]) || Object.keys(d.regs)[0];
                        const G0 = c0 ? digest(c0) : null;
                        if (G0 && res.a.indexOf("v92ct-ans") < 0) {
                            const h0 = digestHtml(G0, c0, String(q || ""));
                            if (h0)
                                res.a += h0 + (Object.keys(d.regs).length > 1 ? `<span class="nn" data-noi18n>${E(M("ほかの国の確かめる点は、国名を入れて聞くか、「規制を調べる」で国を替えると出ます。", "For other countries, ask with the country name or switch the country in “Check regulations”."))}</span>` : "");
                        }
                    }
                    catch (e) { }
                    if (m && Object.keys(d.regs).some(k => misOn(d.regs[k])) && res.a.indexOf("v92ct-misline") < 0)
                        res.a = res.a.replace("<br><br>国名を入れて聞いていただくと", `<br><span class="v92ct-misline" style="color:var(--warn)">⚠ ${E(misLong(m))}</span><br><br>国名を入れて聞いていただくと`);
                }
            }
            catch (e) {
                warn("ansReg", e);
            }
            return res;
        };
    }
    // 見積の出し方（案件の詳細の「見積の出し方」）
    function nonQtyBand() {
        try {
            const d = dd() || {};
            const h = String((d.priceCols || [])[0] || "");
            const rows = (d.priceRows || []).map((r: any) => String((r || [])[0] || "")).join(" ");
            if (/走行|稼働|年式|時間帯|距離/.test(h) || /km|ｋｍ|時間|年式/.test(rows) && !/個|本|袋|箱|台|枚|ケース|セット|pcs/i.test(rows))
                return h || M("条件", "condition");
            return "";
        }
        catch (e) {
            return "";
        }
    }
    function ansQuote(caseNm: string) {
        const d = dd() || {};
        const term = [d.term, d.pol].filter(Boolean).join(" ");
        const rows = (d.priceRows || []).slice(0, 5).map((r: any) => (r || []).filter((x: any) => x != null && String(x).trim() !== "").map(String).join("："));
        const band = nonQtyBand();
        const no = `<span style="color:var(--warn)">${E(M("未登録（商品情報で入れてください）", "not registered (enter it in Product information)"))}</span>`;
        let a = `<b>${E(M("見積の出し方", "How to prepare the quotation"))}</b>${caseNm ? "（" + E(caseNm) + "）" : ""}<br>${E(M("登録してある内容から、決めることを順に並べます。金額と条件は、送る前に必ずご自身で確かめてください。", "From your registered data, here is what to decide, in order. Always check amounts and terms yourself before sending."))}<br><br>`;
        a += `<b>1. ${E(M("取引条件（建値）", "Trade terms"))}</b>：${term ? "<b>" + E(term) + "</b>" : no}<br>　${E(M("相手が CIF・DDP などを望むときは、運賃・保険（・関税）を足した単価に出し直します。FOB の単価をそのまま CIF の見積に入れないでください。", "If the buyer wants CIF/DDP, re-quote with freight and insurance (and duty) added. Do not put the FOB price into a CIF quotation as is."))}<br>`;
        a += `<b>2. ${E(band ? M(`価格（「${band}」ごとの帯）`, `Prices (by “${band}”)`) : M("数量帯と単価", "Quantity tiers and unit prices"))}</b>：${rows.length ? "<br>　" + rows.map(E).join("<br>　") : no}<br>` +
            (band ? `　${E(M("この価格表の帯は数量ではありません。どの帯（状態）の商品かを確かめてから、単価を入れてください。", "The bands in this price list are not quantities. Confirm which band (condition) applies before entering the unit price."))}<br>` : "") +
            `　${E(M("最小発注数量（MOQ）", "MOQ"))}：${d.moq ? "<b>" + E(d.moq) + "</b>" : no}<br>`;
        a += `<b>3. ${E(M("支払条件", "Payment terms"))}</b>：${d.pay ? "<b>" + E(d.pay) + "</b>" : no}<br>`;
        a += `<b>4. ${E(M("有効期限", "Validity"))}</b>：${E(M("見積書には有効期限を必ず入れます（為替・運賃が動くため）。商品情報の「価格の条件」で価格の期限を決めておくと、期限の前にお知らせします。", "Always state a validity date (exchange rates and freight move). Set the price validity under “Price conditions” in Product information to get a reminder."))}<br><br>`;
        a += `<b>${E(M("注意点", "Notes"))}</b><br>・${E(M("相手国の関税・必要な手続きは「規制を調べる」で確かめます（見積の前に）。", "Check the destination's duty and procedures in “Check regulations” before quoting."))}<br>・${E(M("見積書（PI）は「書類をつくる」で作れます。相手の社名・数量・建値を入れてから出してください。", "Create the quotation (PI) in “Create documents”; enter the buyer, quantity and trade terms first."))}` +
            `<br><br><button class="btn" type="button" data-act="v92ct.doc">📄 ${E(M("「書類をつくる」で見積書（PI）を作る", "Create the quotation (PI) in “Create documents”"))}</button>`;
        return { a, c: M("根拠：商品情報（取引条件・価格表・MOQ・支払条件）。内蔵の答えです", "Basis: Product information (trade terms, price list, MOQ, payment). Built-in answer") };
    }
    const RE_CASE = /^\s*【案件：([^】]*)】\s*/;
    function fixExamples(s: string) {
        try {
            const d = dd() || {}, t = ten() || {};
            const tg = (t.targets || Object.keys(d.regs || {}) || [])[0] || "";
            const mq = String(d.moq || "").match(/([\d,]+)\s*([^\d\s（(〜~]+)/);
            const q = mq ? mq[1] + mq[2] : "";
            if (tg && tg !== "香港")
                s = s.split("香港の関税は？").join(tg + "の関税は？").split("香港に500袋").join(tg + "に" + (q || "500袋"));
            if (q && !/袋/.test(q))
                s = s.split("500袋だといくら？").join(q + "だといくら？").split("500袋送るといくら").join(q + "送るといくら");
        }
        catch (e) { }
        return s;
    }
    function post(res: any, q: string) {
        try {
            if (!res || typeof res.a !== "string")
                return res;
            res.a = fixExamples(res.a);
            // 根拠の案件番号：二重ハイフン・見本の番号は、規制の画面と同じ番号に
            const d = dd() || {};
            const no = String((d.ship && d.ship.no) || "");
            const fixNo = (s: string) => { s = s.replace(/([A-Z0-9]{2,})--(\d{4}-\d{2})/g, "$1-$2"); if (no) {
                const pre = no.replace(/-\d{4}-\d{2}$/, "");
                if (pre && pre !== no)
                    s = s.replace(new RegExp(pre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "-\\d{4}-\\d{2}", "g"), no);
            } return s; };
            res.a = fixNo(res.a);
            if (typeof res.c === "string")
                res.c = fixNo(res.c);
            // 価格の答えの「◯◯向けの注意　関税 17%」にも、別の品目の目安であることを書く
            try {
                const m = tplMis();
                if (m && /関税 ?[\d.]+%/.test(res.a) && !/代表的な品目|別の品目/.test(res.a))
                    res.a += `<br><span style="color:var(--warn)">⚠ ${E(misLong(m))}</span>`;
            }
            catch (e) { }
            // 価格表の帯が数量でないとき
            const band = nonQtyBand();
            if (band && /数量帯/.test(res.a))
                res.a = res.a.split("数量帯ごとの単価").join(`「${E(band)}」ごとの価格（数量帯ではありません）`);
            // 数量を聞かれたら、合計の目安も
            const mq = String(q || "").match(/([\d,]+)\s*(台|個|本|箱|袋|枚|セット|ケース|缶|瓶|着|点|kg|トン)/);
            if (mq && /いくら|合計|総額|how much/i.test(q) && res.a.indexOf("v92ct-total") < 0 && !band) {
                const n = parseFloat(mq[1].replace(/,/g, ""));
                const txt = res.a.replace(/<[^>]+>/g, " ");
                const toks = Array.from(new Set((txt.match(/(?:US\$|¥|￥)\s?[\d,]+(?:\.\d+)?/g) || []).map((x: string) => x.replace(/\s/g, ""))));
                if (n > 1 && toks.length === 1) {
                    const sym = /^US\$/.test(toks[0] as string) ? "US$" : "¥";
                    const up = parseFloat(String(toks[0]).replace(/[^\d.]/g, ""));
                    if (up > 0) {
                        const tot = up * n;
                        res.a += `<br><br><span class="v92ct-total"><b>${E(M("合計の目安", "Estimated total"))}</b>　${E(toks[0])} × ${E(mq[1] + mq[2])} ＝ <b>${sym}${tot.toLocaleString("en-US", { maximumFractionDigits: 2 })}</b>${E(M("（登録の単価 × 数量。運賃・保険・相手国の税は含みません）", " (registered unit price × quantity; freight, insurance and destination taxes not included)"))}</span>`;
                    }
                }
            }
        }
        catch (e) {
            warn("post", e);
        }
        return res;
    }
    if (typeof brain === "function") {
        const __b = brain;
        brain = function (this: any, q: any, opts: any) {
            let q1 = q, o1 = opts, caseNm = "";
            try {
                const raw = String((opts && opts.raw) || q || "");
                const mm = raw.match(RE_CASE);
                if (mm) {
                    caseNm = String(mm[1] || "").split("（")[0].trim();
                    const body = raw.replace(RE_CASE, "");
                    if (/見積/.test(body) && /出し方|作り方|注意点|どう(出|作)/.test(body))
                        return post(ansQuote(caseNm), body);
                    // 案件の状態の語（コンタクト中 など）で「やり取り中の Buyer の一覧」に振り分けられないよう、本文で答える
                    q1 = String(q || "").replace(RE_CASE, "") || body;
                    o1 = Object.assign({}, opts || {}, { raw: body });
                }
            }
            catch (e) { }
            const res = __b.call(this, q1, o1);
            const fin = (r: any) => { try {
                if (caseNm && r && typeof r.a === "string" && r.a.indexOf("v92ct-case") < 0)
                    r.a = `<span class="v92ct-case nn">${E(M(`案件「${caseNm}」についての質問として、登録の内容から答えます。`, `Answering for the deal “${caseNm}” from your registered data.`))}</span><br>` + r.a;
            }
            catch (e) { }
            try {
                const qq = String(q1 || "");
                if (r && typeof r.a === "string" && /その質問には答えられませんでした/.test(r.a) && /規制|認証|検疫|条約|登録|届出|表示|ラベル|証明|許可|輸入できる|禁止/.test(qq)) {
                    const d = dd() || {}, t = ten() || {};
                    let c: any = null;
                    try {
                        c = typeof pickCountry === "function" ? pickCountry(qq) : null;
                    }
                    catch (e) { }
                    if (!c || !(d.regs || {})[c])
                        c = ((t.targets || []).filter((k: string) => (d.regs || {})[k])[0]) || Object.keys(d.regs || {})[0];
                    const G = c ? digest(c) : null;
                    const h = G ? digestHtml(G, c, qq) : "";
                    if (h)
                        r = { a: E(M("内蔵の答え（AI 未接続）では、このご質問にそのまま答えられません。「規制を調べる」の画面にある、この商品と送り先で確かめる点をお出しします。該当するかどうかは、輸入者・相手国の当局・STANDAGE への相談で確かめてください（要確認）。",
                            "The built-in answer (AI not connected) cannot answer this directly. Here are the points to check for this product and destination from the “Check regulations” screen. Please confirm with the importer, the authority or STANDAGE.")) + h,
                            c: M(`根拠：「規制を調べる」（${c}）の確かめる点。内蔵の答えです`, `Basis: points to check in “Check regulations” (${c}). Built-in answer`) };
                }
            }
            catch (e) { }
            return post(r, String(q1 || "")); };
            if (res && typeof res.then === "function")
                return res.then(fin);
            return fin(res);
        };
    }
    try {
        if (W.BCACT && BCACT.on) {
            BCACT.on("v92ct.doc", () => { try {
                go("ops");
                opsTab = "doc";
                render();
                window.scrollTo(0, 0);
            }
            catch (e) { } }, { replace: true });
            BCACT.on("v92ct.reg", (el: any) => { try {
                const c = String((el && el.getAttribute("data-arg")) || "");
                go("ops");
                opsTab = "reg";
                if (c)
                    opsRegC = c;
                render();
                window.scrollTo(0, 0);
            }
            catch (e) { } }, { replace: true });
        }
    }
    catch (e) { }

    /* ═════ (c) 営業メールの文面 ═════ */
    const enOf = (s: any) => { try {
        const v = I18N.dict.en[String(s)];
        return v && !JA.test(v) ? String(v) : "";
    }
    catch (e) {
        return "";
    } };
    const title = (s: string) => s.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase()).replace(/\bUsa\b/, "USA").replace(/\bUk\b/, "UK").replace(/\bUae\b/, "UAE");
    const CTY_FIX: any = { "アメリカ": "the United States", "イギリス": "the United Kingdom", "UAE": "the UAE", "韓国": "South Korea", "オランダ": "the Netherlands", "フィリピン": "the Philippines" };
    function ctyE(c: any) {
        c = String(c || "");
        if (!c || !JA.test(c))
            return c;
        if (CTY_FIX[c])
            return CTY_FIX[c];
        let v = "";
        try {
            v = typeof ctyEn === "function" ? ctyEn(c) : "";
        }
        catch (e) { }
        if (v)
            return title(v);
        return enOf(c) || c;
    }
    const BIZ_EN: any = { "輸入商社・卸": "import and wholesale business", "小売チェーン・量販": "retail chain", "EC・オンライン小売": "online retail business", "飲食・ホテル（HoReCa）": "restaurant and hotel supply business",
        "代理店・ディストリビューター": "distribution business", "専門店・セレクトショップ": "specialty retail business", "ドラッグストア": "drugstore business", "エステサロン": "salon business" };
    function bizE(b: any) {
        b = String(b || "");
        if (!b)
            return "";
        if (!JA.test(b))
            return b;
        if (BIZ_EN[b])
            return BIZ_EN[b];
        const v = enOf(b);
        return v ? v.charAt(0).toLowerCase() + v.slice(1) : "";
    }
    const UNIT = (u: string) => { try {
        return (typeof V85UNIT !== "undefined" && V85UNIT[u]) || (typeof V56DECK_QU !== "undefined" && V56DECK_QU[u]) || "";
    }
    catch (e) {
        return "";
    } };
    function qtyE(s: any) {
        s = String(s || "").trim();
        if (!s || !JA.test(s))
            return s;
        const m = s.match(/^([\d,\.]+)\s*([^\d\s（(〜~／\/]+)/);
        if (m) {
            const u = m[2] === "台" ? "unit" + (parseFloat(m[1].replace(/,/g, "")) > 1 ? "s" : "") : UNIT(m[2]);
            if (u)
                return m[1] + " " + u;
        }
        return "";
    }
    // 日本語を含む値から、英数字だけの部分を拾う（認証の名前・建値 など）
    function asciiPart(s: any) {
        s = String(s || "").trim();
        if (!s || !JA.test(s))
            return s;
        const out: string[] = [];
        s.split(/[・、，,／\n]+|\s+(?=[^\x00-\x7F])|(?<=[^\x00-\x7F])\s+/).forEach((p: string) => {
            p = p.trim();
            if (!p)
                return;
            if (!JA.test(p)) {
                out.push(p);
                return;
            }
            const m = p.match(/^[A-Za-z][A-Za-z0-9 .:\-\/()]*[A-Za-z0-9)]/);
            if (m) {
                // 「T/T 30日」の「30」のように、後ろの日本語の単位と組の数字は、単位が落ちると意味が変わるので入れない
                let v = m[0].trim();
                if (JA.test(p.charAt(m[0].length)) && /\s[\d,.%]+$/.test(v))
                    v = v.replace(/\s[\d,.%]+$/, "");
                if (v.replace(/[^A-Za-z0-9]/g, "").length >= 3)
                    out.push(v);
            }
        });
        return out.join(", ");
    }
    const oneOff = () => { const c = catNow(); const g = group(); return /中古車|建設機械|中古品/.test(c) || (!!g && g.k === "auto"); };
    let lastOmit: string[] = [];
    function briefEn(b: any, omit: string[]) {
        const o = Object.assign({}, b);
        const d = dd() || {};
        if (JA.test(String(o.origin || ""))) {
            omit.push(M("産地", "origin"));
            o.origin = "";
        }
        if (Array.isArray(o.st)) {
            const keep = o.st.filter((x: any) => !JA.test(String(x)));
            if (keep.length < o.st.length)
                omit.push(M(`商品の強み（${o.st.length - keep.length}件）`, `selling points (${o.st.length - keep.length})`));
            o.st = keep;
        }
        if (Array.isArray(o.strengths)) {
            const keep = o.strengths.filter((x: any) => !JA.test(String((x && x[0]) || "")) ).map((x: any) => [x[0], JA.test(String(x[1] || "")) ? "" : x[1]]);
            if (keep.length < o.strengths.length)
                omit.push(M(`商品の強み（${o.strengths.length - keep.length}件）`, `selling points (${o.strengths.length - keep.length})`));
            o.strengths = keep;
        }
        const conv = (k: string, nm: string, f: (s: any) => string) => { const v0 = String(o[k] || ""); if (v0 && JA.test(v0)) {
            const v1 = f(v0);
            if (!v1 || v1.length < v0.replace(/\s/g, "").length * 0.5)
                omit.push(nm + (v1 ? M("の一部", " (part)") : ""));
            o[k] = v1;
        } };
        conv("moq", "MOQ", qtyE);
        conv("cert", M("認証・規格", "certifications"), asciiPart);
        conv("term", M("取引条件", "trade terms"), asciiPart);
        conv("pay", M("支払条件", "payment terms"), asciiPart);
        conv("lead", M("リードタイム", "lead time"), () => "");
        conv("shelf", M("賞味期限・保証", "shelf life / warranty"), () => "");
        if (JA.test(String(o.cat || "")))
            o.cat = (enOf(o.cat) || "").toLowerCase();
        if (JA.test(String(o.item || "")) && d.itemEn && !JA.test(d.itemEn))
            o.item = d.itemEn;
        // 価格表の帯が数量でない（走行距離帯・稼働時間帯）ときは、どの帯の価格か分からないので、目安の価格は入れない
        if (o.price && nonQtyBand()) {
            omit.push(M("価格の目安（価格表の帯が数量でないため）", "indicative price (bands are not quantities)"));
            o.price = "";
        }
        return o;
    }
    const sigName = () => { try {
        const s = typeof v79obSig === "function" ? v79obSig() : null;
        return String((s && s.name) || "").trim();
    }
    catch (e) {
        return "";
    } };
    if (typeof v71obTpl === "function" && typeof v71obBrief === "function") {
        const __tp = v71obTpl, __br = v71obBrief;
        let on = 0, omit: string[] = [];
        v71obBrief = function (this: any) {
            const b = __br.apply(this, arguments as any);
            try {
                if (on)
                    return briefEn(b, omit);
            }
            catch (e) { }
            return b;
        };
        v71obTpl = function (this: any, L: any, run: any) {
            let res: any;
            omit = [];
            on++;
            try {
                const L2 = Object.assign({}, L, { biz: bizE(L && L.biz) });
                const run2 = Object.assign({}, run, { cty: ctyE(run && run.cty) });
                res = __tp.call(this, L2, run2);
            }
            finally {
                on--;
            }
            try {
                if (res && Array.isArray(res.seq)) {
                    const nm = sigName();
                    const used = oneOff();
                    res.seq.forEach((m: any) => {
                        let b = String(m.body || "");
                        if (nm)
                            b = b.split("[Your Name]").join(nm);
                        if (used) {
                            b = b.replace("We make ", "We export ").replace("We would be happy to send samples and our catalogue.", "We would be happy to send detailed photos, the inspection record and the specification sheet.")
                                .replace("who handles new Japanese products at your company?", "who handles vehicle and machinery imports at your company?")
                                .replace('simply reply "samples" and we will arrange them.', 'simply reply "details" and we will send photos and the inspection record.');
                            m.subj = String(m.subj || "").replace(/ samples$/, " details");
                        }
                        b = b.replace(/\n- MOQ: \n/, "\n").replace(/\n- Certifications: \n/, "\n");
                        m.body = b;
                    });
                    const om = omit.filter(x => !/^(リードタイム|賞味期限|支払条件|lead time|shelf life|payment)/.test(x));
                    if (om.length)
                        res.v92omit = Array.from(new Set(om));
                }
            }
            catch (e) {
                warn("tpl", e);
            }
            return res;
        };
    }
    // 署名を登録したあと：登録の名前だけを入れてあった所は、署名の全文に置き換えられるように戻す
    if (typeof v79obSigFill === "function") {
        const __sf = v79obSigFill;
        v79obSigFill = function (this: any, body: any) {
            try {
                const nm = sigName();
                let b = String(body || "");
                if (nm && b.indexOf("[Your Name]") < 0) {
                    const re = new RegExp("(regards,\\n)" + nm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\n[^\\n]*)?\\s*$", "i");
                    if (re.test(b))
                        b = b.replace(re, "$1[Your Name]$2");
                    return __sf.call(this, b);
                }
            }
            catch (e) { }
            return __sf.apply(this, arguments as any);
        };
    }
    // 直接連絡の英語テンプレート
    if (typeof dmTemplateEN === "function") {
        const __dm = dmTemplateEN;
        dmTemplateEN = function (this: any, b: any, id: any, cty: any, biz: any) {
            const omit: string[] = [];
            let res: any;
            const cE = ctyE(cty);
            const bz = String(biz || "");
            try {
                const b2 = briefEn(b || {}, omit);
                const known = !!BIZ_EN[bz] || (typeof V71OB_BIZ !== "undefined" && V71OB_BIZ.some((x: any) => x[1] === bz)) || (!!enOf(bz) && JA.test(bz));
                const bzE = known ? bizE(bz) : "";
                res = __dm.call(this, b2, id, cE, bzE || bz);
                if (res && typeof res.body === "string") {
                    let s = res.body;
                    // 業態が空・業態の位置に社名が入っている相手には「a leading 〈社名〉」と書かない
                    if (!bzE)
                        s = s.replace(/We understand you are a leading [^\n]*? in ([^\n]*?), and we believe/, bz && !JA.test(bz) ? `We are writing to ${bz} in $1, as we believe` : "We are writing to you in $1, as we believe");
                    s = s.replace(/based in , Japan\./, "based in Japan.").replace(/based in Japan, Japan\./, "based in Japan.").replace(/, a  maker based/, ", a Japanese maker based").replace(/, a ([a-z&' -]+) maker based/, (_a: string, x: string) => `, a Japanese ${x} maker based`);
                    // 自社で登録した相手（ID が MY-）：匿名の仲介の言い方にしない
                    if (/^MY-/.test(String(id || ""))) {
                        s = s.replace(/^Dear Sir or Madam \(Buyer ID [^)]*\),/, bz && !JA.test(bz) && !bzE ? `Dear ${bz} team,` : "Dear Sir or Madam,");
                        s = s.replace(/\n\(Sent via STANDAGE Trade Cloud AI Agent\. Your contact details remain private until you reply\.\)/, "");
                        const nm = sigName();
                        if (nm && !JA.test(nm))
                            s = s.replace(/\nBest regards,\n/, "\nBest regards,\n" + nm + "\n");
                    }
                    if (oneOff())
                        s = s.replace(/ maker based in/, " exporter based in").replace("our catalog, product samples, and a detailed quotation for your volumes", "detailed photos, the inspection record, and a quotation");
                    res.body = s;
                    res.v92omit = Array.from(new Set(omit));
                    lastOmit = res.v92omit;
                }
                return res;
            }
            catch (e) {
                warn("dm", e);
            }
            return res || __dm.apply(this, arguments as any);
        };
    }
    function jaParts(text: string) {
        const m = String(text || "").match(/[ぁ-んァ-ヶ一-龠々ー]+(?:[（）・、][ぁ-んァ-ヶ一-龠々ー]+)*/g) || [];
        return Array.from(new Set(m)).slice(0, 6) as string[];
    }
    function mailWarn(ta: any, omit: string[]) {
        if (!ta)
            return;
        const txt = String(ta.value || "");
        const latin = (txt.match(/[A-Za-z]/g) || []).length, ja = (txt.match(/[ぁ-んァ-ヶ一-龠々]/g) || []).length;
        const L: string[] = [];
        if (latin > ja * 3 && ja) {
            const P = jaParts(txt);
            L.push(M(`英語の文面に、日本語のままの所があります：${P.map(x => "「" + x + "」").join("")}${P.length >= 6 ? " ほか" : ""}。送る前に英語（ローマ字）に直してください。`,
                `The English message still contains Japanese text: ${P.map(x => "“" + x + "”").join(" ")}. Please rewrite it in English before sending.`));
        }
        const ph = txt.match(/\[(?:Your[^\]\n]{0,30}|Name|Title|Company)\]/i);
        if (ph)
            L.push(M(`「${ph[0]}」が残っています。お名前に直してください（「✍ 署名」に登録すると自動で入ります）。`, `“${ph[0]}” remains. Replace it with your name (register a signature to fill it automatically).`));
        if (latin > ja * 3 && omit && omit.length)
            L.push(M(`日本語で登録されているため、英語の文に入れていない項目：${omit.join("・")}。商品情報に英語でも入れるか、本文に英語で書き足してください。`,
                `Not included because they are registered in Japanese only: ${omit.join(", ")}. Add them in English in Product information or write them into the message.`));
        let box = ta.parentNode ? ta.parentNode.querySelector(".v92ct-mailwarn") : null;
        const sig = L.join("|");
        if (!L.length) {
            if (box)
                box.remove();
            return;
        }
        if (box && box.getAttribute("data-sig") === sig)
            return;
        css();
        if (!box) {
            box = document.createElement("div");
            box.className = "v92ct-mailwarn";
            box.setAttribute("role", "alert");
            box.setAttribute("data-noi18n", "");
            ta.parentNode.insertBefore(box, ta);
        }
        box.setAttribute("data-sig", sig);
        box.innerHTML = `<b>⚠ ${E(M("送る前に確かめてください", "Check before sending"))}</b><ul>${L.map(x => "<li>" + E(x) + "</li>").join("")}</ul>`;
    }
    function sweepMail() {
        const a = document.getElementById("v71obBody") as any;
        if (a) {
            let omit: string[] = [];
            try {
                const o = typeof v71obLead === "function" ? v71obLead(a.dataset.lead) : null;
                omit = (o && o.l && o.l.ap && o.l.ap.v92omit) || [];
            }
            catch (e) { }
            mailWarn(a, omit);
            if (!a.dataset.v92ct) {
                a.dataset.v92ct = "1";
                a.addEventListener("input", () => mailWarn(a, omit));
            }
        }
        const b = document.getElementById("dmB") as any;
        if (b) {
            mailWarn(b, lastOmit);
            if (!b.dataset.v92ct) {
                b.dataset.v92ct = "1";
                b.addEventListener("input", () => mailWarn(b, lastOmit));
            }
        }
    }

    /* ═════ (d) AIバイヤー開拓の業態：商材の大カテゴリーで言い分ける ═════ */
    const BX: any = {
        medical: { add: [["meddist", "医療機器・衛生用品の輸入販売会社（ディーラー）"], ["hosp", "病院・クリニック（購買部門）"], ["pharm", "ドラッグストア・薬局"], ["gov", "政府・公的機関の調達"]], drop: ["horeca", "spec"] },
        beauty: { add: [["pharm", "ドラッグストア・薬局"], ["salon", "エステ・サロン（業務用）"]], drop: ["horeca"] },
        industry: { add: [["maker", "メーカー・工場（直接の使い手）"], ["agrico", "農協・農業法人・農園（直接の使い手）"]], drop: ["horeca", "spec", "chain"] },
        auto: { add: [["dealer", "販売店・ディーラー"], ["fleet", "建設・レンタル・運送の会社（直接の使い手）"]], drop: ["horeca", "spec", "chain"] },
        culture: { add: [["school", "学校・教室・教育機関"]], drop: ["horeca"] },
        other: { add: [["petshop", "ペット専門店・動物病院"]], drop: ["horeca"], onlyCat: /ペット/ }
    };
    const BX_KEYS = ["meddist", "hosp", "pharm", "gov", "salon", "maker", "agrico", "dealer", "fleet", "school", "petshop"];
    const BX_EN: any = { meddist: "medical device distribution business", hosp: "hospital and clinic purchasing", pharm: "drugstore and pharmacy business", gov: "public procurement", salon: "salon and spa business", maker: "manufacturing business",
        agrico: "farming business", dealer: "dealership", fleet: "construction, rental or transport business", school: "school or education business", petshop: "pet store or veterinary business" };
    const BX_SMP: any = [["Meridian Medical Supply", "meddist"], ["Northgate Clinic Purchasing", "hosp"], ["Citycare Pharmacy Group", "pharm"], ["Lumina Salon & Spa Supply", "salon"], ["Delta Works Manufacturing", "maker"], ["Green Field Farm Cooperative", "agrico"],
        ["Summit Motors & Machinery", "dealer"], ["Ironbridge Rental & Construction", "fleet"], ["Bright Path Learning Centre", "school"], ["Happy Paws Pet Store", "petshop"]];
    function bxNow() {
        const g = group();
        const x = g && BX[g.k];
        if (!x)
            return null;
        if (x.onlyCat && !x.onlyCat.test(catNow()))
            return null;
        return x;
    }
    function bizSync() {
        try {
            if (typeof V71OB_BIZ === "undefined" || !Array.isArray(V71OB_BIZ))
                return;
            const x = bxNow();
            const want: any[] = x ? x.add : [];
            for (let i = V71OB_BIZ.length - 1; i >= 0; i--)
                if (BX_KEYS.indexOf(V71OB_BIZ[i][0]) >= 0 && !want.some(w => w[0] === V71OB_BIZ[i][0]))
                    V71OB_BIZ.splice(i, 1);
            let at = 1;
            want.forEach(w => { if (!V71OB_BIZ.some((y: any) => y[0] === w[0]))
                V71OB_BIZ.splice(Math.min(at, V71OB_BIZ.length), 0, [w[0], w[1]]); at++; });
            if (typeof V71OB_SMP !== "undefined" && Array.isArray(V71OB_SMP) && !V71OB_SMP.some((y: any) => y[1] === "meddist"))
                BX_SMP.slice().reverse().forEach((s: any) => V71OB_SMP.unshift([s[0], s[1]]));
            try {
                const f = typeof V71OB !== "undefined" && V71OB && V71OB.f;
                if (f && Array.isArray(f.biz))
                    f.biz = f.biz.filter((k: string) => V71OB_BIZ.some((y: any) => y[0] === k));
            }
            catch (e) { }
        }
        catch (e) {
            warn("biz", e);
        }
    }
    try {
        BX_KEYS.forEach(k => { let ja = ""; Object.keys(BX).forEach(g => BX[g].add.forEach((w: any) => { if (w[0] === k)
            ja = w[1]; })); if (ja)
            BIZ_EN[ja] = BX_EN[k]; });
        dict([["医療機器・衛生用品の輸入販売会社（ディーラー）", "Medical device & hygiene importers / dealers", "医疗器械・卫生用品进口经销商", "Importadores / distribuidores de productos médicos"],
            ["病院・クリニック（購買部門）", "Hospitals & clinics (purchasing)", "医院・诊所（采购部门）", "Hospitales y clínicas (compras)"], ["ドラッグストア・薬局", "Drugstores & pharmacies", "药妆店・药房", "Droguerías y farmacias"],
            ["政府・公的機関の調達", "Government / public procurement", "政府・公共机构采购", "Compras públicas"], ["エステ・サロン（業務用）", "Salons & spas (professional)", "美容院・沙龙（专业用）", "Salones y spas (profesional)"],
            ["メーカー・工場（直接の使い手）", "Manufacturers & factories (end users)", "制造商・工厂（直接用户）", "Fabricantes y fábricas (usuarios finales)"], ["農協・農業法人・農園（直接の使い手）", "Farm cooperatives & farms (end users)", "农协・农业企业・农场（直接用户）", "Cooperativas y explotaciones agrícolas"],
            ["販売店・ディーラー", "Dealers", "经销店", "Concesionarios"], ["建設・レンタル・運送の会社（直接の使い手）", "Construction, rental & transport companies (end users)", "建筑・租赁・运输公司（直接用户）", "Empresas de construcción, alquiler y transporte"],
            ["学校・教室・教育機関", "Schools & education providers", "学校・培训机构", "Escuelas e instituciones educativas"], ["ペット専門店・動物病院", "Pet stores & veterinary clinics", "宠物店・动物医院", "Tiendas de mascotas y veterinarias"]]);
    }
    catch (e) { }
    ["v71obPaint", "v71obHtml", "v71obBuild"].forEach(nm => {
        try {
            if (nm === "v71obPaint" && typeof v71obPaint === "function") {
                const f0 = v71obPaint;
                v71obPaint = function (this: any) { bizSync(); return f0.apply(this, arguments as any); };
            }
            if (nm === "v71obHtml" && typeof v71obHtml === "function") {
                const f0 = v71obHtml;
                v71obHtml = function (this: any) { bizSync(); return f0.apply(this, arguments as any); };
            }
            if (nm === "v71obBuild" && typeof v71obBuild === "function") {
                const f0 = v71obBuild;
                v71obBuild = function (this: any) { bizSync(); return f0.apply(this, arguments as any); };
            }
        }
        catch (e) { }
    });
    if (typeof v71obSample === "function") {
        const __sm = v71obSample;
        v71obSample = function (this: any, f: any, ready: any, kb: any) {
            try {
                bizSync();
                const x = bxNow();
                // 業態を選んでいないとき：その商材に合わない業態は、見本のリストに入れない（選べば出る）
                if (x && f && !(f.biz && f.biz.length)) {
                    const keys = V71OB_BIZ.map((y: any) => y[0]).filter((k: string) => x.drop.indexOf(k) < 0);
                    return __sm.call(this, Object.assign({}, f, { biz: keys }), ready, kb);
                }
            }
            catch (e) { }
            return __sm.apply(this, arguments as any);
        };
    }

    /* ═════ (e) そのほか ═════ */
    // 推奨FOBの試算：「¥1,800／個（FOB 大阪・税抜）」のような書き方の単価も読む（通関統計コネクトと同じ読み方＝v68trPxCells）
    if (typeof csCurFob === "function") {
        const __cf = csCurFob;
        csCurFob = function (this: any) {
            const r = __cf.apply(this, arguments as any);
            if (r)
                return r;
            try {
                const t = ten();
                if (!t || typeof v68trPxCells !== "function")
                    return r;
                const C = (v68trPxCells(t) || []).filter((c: any) => c && c.kind !== "int" && c.n > 0);
                if (!C.length)
                    return r;
                const cur0 = C[0].cur || "";
                if (cur0 !== "JPY" && cur0 !== "USD")
                    return r;
                const ns = C.filter((c: any) => (c.cur || "") === cur0).map((c: any) => +c.n);
                let fx = 150;
                try {
                    fx = ddpFx().rates.USD || 150;
                }
                catch (e) { }
                const mn = Math.min.apply(null, ns), mx = Math.max.apply(null, ns);
                const toUsd = (v: number) => cur0 === "JPY" ? v / fx : v;
                return { sym: cur0 === "JPY" ? "¥" : "US$", min: mn, max: mx, minUsd: toUsd(mn), maxUsd: toUsd(mx), fx };
            }
            catch (e) {
                return r;
            }
        };
    }
    // 用語集：画面に出る D/P・D/A と 510(k)
    try {
        if (typeof GL !== "undefined" && GL) {
            const g1 = "D/P は「支払渡し」。買い手が代金を払うのと引き換えに、銀行が船積書類を渡します。D/A は「引受渡し」。買い手が後日払う約束（手形の引受け）をすれば書類を渡すので、売り手には代金を回収できないおそれが残ります。どちらも銀行は支払いを保証しません（L/C との違い）。";
            const g2 = "米国 FDA への「市販前届出」。米国で売る医療機器のうち対象のものは、売る前に、すでに米国で合法に売られている機器と実質的に同等であることを FDA に届け出ます。対象かどうかは機器のクラス・種類で決まります（要確認）。";
            if (!GL["D/P・D/A"])
                GL["D/P・D/A"] = g1;
            if (!GL["510(k)"])
                GL["510(k)"] = g2;
            dict([[g1, "D/P (documents against payment): the bank releases the shipping documents when the buyer pays. D/A (documents against acceptance): the documents are released when the buyer accepts a bill to pay later, so the seller bears the risk of non-payment. In neither case does the bank guarantee payment (unlike an L/C)."],
                [g2, "Premarket notification to the US FDA. For devices that are subject to it, the seller notifies the FDA before marketing that the device is substantially equivalent to one already legally marketed in the US. Whether it applies depends on the device class and type (please confirm)."]]);
        }
    }
    catch (e) { }
    // スレッドの窓の「中継 未設定（管理者がサーバーを v2.2 に更新すると…）」：お客様には、いまどうなるかだけを言う
    if (typeof bmNoteHtml === "function") {
        const __bn = bmNoteHtml;
        bmNoteHtml = function (this: any) {
            let s = __bn.apply(this, arguments as any);
            try {
                if (typeof s === "string" && !isStaff())
                    s = s.replace('<span class="p lo">中継 未設定</span>（管理者がサーバーを v2.2 に更新すると実送受信が有効）', `<span class="p lo" data-noi18n>${E(M("メールの送信は未設定", "Email sending not set up"))}</span><span data-noi18n>${E(M("（この環境では、メールは相手に送られません。記録だけ残ります）", " (in this environment emails are not sent to the other party; only a record is kept)"))}</span>`);
            }
            catch (e) { }
            return s;
        };
    }
    // リチウム石けん基のグリースなどを「電池」と読まない。車両・建機は、リチウム電池と書いてあるときだけ
    const RE_NOTBATT = /リチウム\s*(?:石けん|石鹸|せっけん|セッケン|グリース|基|複合)[^\s、。|｜]*|lithium[\s-]*(?:soap|grease|complex|based?)[a-z]*/gi;
    const RE_BATT = /電池|バッテリー|battery|batteries|li-?ion|リチウムイオン|リチウムポリマー/i;
    const RE_LIB = /リチウム(?:イオン|ポリマー|金属)?\s*(?:二次)?\s*(?:電池|バッテリー)|lithium[\s-]*(?:ion|polymer|metal)?[\s-]*batter|li-?ion/i;
    const isVehicle = (hs: string, txt: string) => /^(87|8429|8430|8427|8426|8432|8433)/.test(hs) || /中古車|建設機械/.test(txt);
    function battOk(txt: string, hs: string) {
        const t = String(txt || "").replace(RE_NOTBATT, " ");
        if (isVehicle(hs, catNow()))
            return RE_LIB.test(t);
        return RE_BATT.test(t);
    }
    if (typeof v85docFlagsAuto === "function") {
        const __fa = v85docFlagsAuto;
        v85docFlagsAuto = function (this: any, d: any, hs: any) {
            const o = __fa.apply(this, arguments as any);
            try {
                if (o && o.lithium_battery === "品名・成分に電池の語" && typeof v85docText === "function" && !battOk(v85docText(d), String(hs || "")))
                    delete o.lithium_battery;
            }
            catch (e) { }
            return o;
        };
    }
    if (typeof v68regBatt === "function") {
        const __rb = v68regBatt;
        v68regBatt = function (this: any, p: any) {
            const r = __rb.apply(this, arguments as any);
            try {
                if (r && p) {
                    const rows = (x: any) => (Array.isArray(x) ? x : []).map((y: any) => (Array.isArray(y) ? y.join(" ") : "")).join(" ");
                    const txt = [p.item, p.itemEn, rows(p.compRows), rows(p.dimRows), (p.strengths || []).map((s: any) => Array.isArray(s) ? s.join(" ") : String(s || "")).join(" "), JSON.stringify(p.v68attr || p.attrs || {})].join(" ");
                    // 元の判定の文字（品名・表・属性）に、電池の語が残るかを確かめる。確かめられないときは元のまま
                    if (!battOk(txt, digits(p.hs)) && !RE_BATT.test(String(txt).replace(RE_NOTBATT, " ").replace(/リチウム/g, "")) )
                        return false;
                    if (isVehicle(digits(p.hs), String(p.cat || "")) && !RE_LIB.test(String(txt).replace(RE_NOTBATT, " ")))
                        return false;
                }
            }
            catch (e) { }
            return r;
        };
    }

    // AI ヒアリング：HS コードに「分からない」と答えたとき、実在しない番号（9999.99）を推定として登録しない（未登録のまま・この回はもう聞かない）
    try {
        if (typeof applyAnswer === "function") {
            const __aa = applyAnswer;
            applyAnswer = function (this: any, t: any, k: any) {
                const r = __aa.apply(this, arguments as any);
                try {
                    if (k === "hs" && t && String(t.hs || "") === "9999.99" && t.hsGuess) {
                        t.hs = "";
                        t.hsGuess = false;
                        t._hsNote = [["", "候補なし"]];
                        if (typeof FILL !== "undefined" && FILL)
                            FILL.skip = (FILL.skip || []).concat("hs");
                    }
                }
                catch (e) { }
                return r;
            };
        }
        if (typeof fillSay === "function") {
            const __fs = fillSay;
            fillSay = function (this: any, who: any, html: any) {
                try {
                    if (who === "ai" && typeof html === "string" && /商品名から<b>(?:9999\.99)?<\/b>/.test(html)) {
                        const args: any[] = Array.prototype.slice.call(arguments);
                        args[1] = html.replace(/商品名から<b>(?:9999\.99)?<\/b>.*?と推定しました。/, "HSコードは<b>未登録のまま</b>にしました（商品名とカテゴリーからは、候補を出せませんでした。実在しない番号は入れません）。あとで「規制を調べる」の HS コードの候補か、税関の事前教示で決められます。");
                        return __fs.apply(this, args as any);
                    }
                }
                catch (e) { }
                return __fs.apply(this, arguments as any);
            };
        }
        dict([["HSコードは<b>未登録のまま</b>にしました（商品名とカテゴリーからは、候補を出せませんでした。実在しない番号は入れません）。あとで「規制を調べる」の HS コードの候補か、税関の事前教示で決められます。",
            "The HS code was left <b>unregistered</b> (no candidate could be derived from the product name and category; a non-existent number is not entered). You can decide it later from the HS candidates in “Check regulations” or by an advance ruling from customs."]]);
    }
    catch (e) { }

    /* ═════ 描いたあとの仕上げ（画面の中の文言） ═════ */
    function sweepMisc() {
        // 同じ注意書き（🛡 貼った文・取り込んだ資料は…）が、同じ窓に2回
        try {
            const seen: any[] = [];
            document.querySelectorAll(".v80fsec-note").forEach((n: any) => {
                if (n.hidden || !n.offsetParent)
                    return;
                const host = n.closest(".dwbody, #dw, .dw, [role='dialog'], .stage") || document.body;
                const key = (n.textContent || "").trim();
                if (seen.some(x => x.host === host && x.key === key))
                    n.hidden = true;
                else
                    seen.push({ host, key });
            });
        }
        catch (e) { }
        // 規制の画面：「通関・出荷で使う書類」に、どの国の通関でも使う基本の書類が無いとき
        try {
            const box = document.getElementById("rO");
            if (box && !box.closest("[data-v92ct-h]")) {
                box.querySelectorAll("p.v54r-h").forEach((p: any) => {
                    if (!/^通関・出荷で使う書類|^Documents for customs/.test((p.textContent || "").trim()))
                        return;
                    const row = p.nextElementSibling as any;
                    if (!row || row.querySelector("[data-v92ct]") || /インボイス|Invoice/i.test(row.textContent || ""))
                        return;
                    const dash = /^[—\-–\s]*$/.test(row.textContent || "");
                    if (dash)
                        row.textContent = "";
                    row.insertAdjacentHTML("beforeend", `<span class="p on" data-v92ct="1" data-noi18n title="${E(M("どの国の通関でも使う基本の書類です（カテゴリーのひな形の表には入っていません）", "Basic documents used for customs in any country (not listed in the category template)"))}">${E(M("インボイス", "Commercial invoice"))}</span><span class="p on" data-noi18n>${E(M("パッキングリスト", "Packing list"))}</span><span class="nn" data-noi18n style="margin-left:4px">${E(M("（どの国の通関でも使う基本の書類。このほかは下の「確かめる点」を）", "(basic documents for any customs clearance; see “Points to check” below for others)"))}</span>`);
                });
            }
        }
        catch (e) { }
        // 営業資料：未翻訳の下書きなのに「完成しました！」／件数の言い方をそろえる
        try {
            const ok = document.querySelector("#k-deckdone .k-okbox b") as any;
            if (ok && /営業資料が完成しました！/.test(ok.textContent || "")) {
                const card = document.getElementById("k-deckdone") as any;
                const st = document.querySelector(".stage") || document.body;
                const draft = /未翻訳の下書き/.test(card.textContent || "") || /未翻訳の下書き/.test((st.querySelector("#dk3res1") || { textContent: "" } as any).textContent || "");
                const ng = /送れない\s*[1-9]|重大な問題\s*[1-9]/.test(st.textContent || "");
                if (draft || ng) {
                    ok.setAttribute("data-noi18n", "");
                    ok.textContent = draft ? M("下書きができました（未翻訳の所があります）", "Draft created (some parts are untranslated)") : M("営業資料ができました（送る前に直す所があります）", "Deck created (some points need fixing before sending)");
                    const sm = ok.parentNode.querySelector("small");
                    if (sm) {
                        sm.setAttribute("data-noi18n", "");
                        sm.textContent = M("まだ完成ではありません。下の点検で「送れない」と出た所を直してから、バイヤーに送ってください。", "Not finished yet. Fix the points marked “cannot send” in the check below before sending to buyers.");
                    }
                }
            }
            const tag = (Array.from(document.querySelectorAll("#dk3res1 .p.no, .stage .p.no")) as any[]).find(x => /^未入力 \d+項目・重大な問題 \d+件$/.test((x.textContent || "").trim()));
            if (tag) {
                const mm = (tag.textContent || "").trim().match(/^未入力 (\d+)項目・重大な問題 (\d+)件$/);
                (Array.from(document.querySelectorAll(".stage *")) as any[]).filter(x => !x.children.length && /^重大な問題 \d+件（下に表示）$/.test((x.textContent || "").trim())).forEach(x => {
                    const n = +(x.textContent.match(/\d+/) || [0])[0];
                    if (mm && n === +mm[2] + 1) {
                        x.setAttribute("data-noi18n", "");
                        x.textContent = M(`送れない点 ${n}件（未入力 ${mm[1]}項目のまとめ 1件＋重大な問題 ${mm[2]}件・下に表示）`, `${n} blocking points (1 for ${mm[1]} missing items + ${mm[2]} critical; shown below)`);
                    }
                });
            }
        }
        catch (e) { }
        // 業態が空のバイヤー：業態の位置に社名を出さない（刷新版の「選択中のバイヤー」・案件一覧）
        try {
            const sel = document.getElementById("rddbsel");
            if (sel) {
                const nm = ((sel.querySelector("b") || {}) as any).textContent || "";
                sel.querySelectorAll("dl.rd-kv dt").forEach((dt: any) => { const ddEl = dt.nextElementSibling as any; if (/^業態$/.test((dt.textContent || "").trim()) && ddEl && nm && (ddEl.textContent || "").trim() === nm.replace(/^🔒\s*/, "").trim()) {
                    ddEl.setAttribute("data-noi18n", "");
                    ddEl.textContent = M("未登録", "Not registered");
                    ddEl.title = "";
                } });
            }
            document.querySelectorAll("td.c-who").forEach((td: any) => {
                const b = td.querySelector("b"), sm = td.querySelector("small");
                if (!b || !sm || sm.dataset.v92ct)
                    return;
                const nm = (b.textContent || "").trim(), s = (sm.textContent || "").trim();
                if (nm && s.indexOf(nm + " · ") === 0) {
                    sm.dataset.v92ct = "1";
                    sm.textContent = s.slice(nm.length + 3);
                }
            });
        }
        catch (e) { }
        // 直接連絡の窓：自社で登録した相手（ID MY-）に、匿名の仲介の説明を出さない
        try {
            const dm = document.getElementById("dmB") as any;
            const host = dm && (dm.closest(".dwbody, #dw, .dw, [role='dialog']") || dm.parentNode);
            if (host) {
                const p = (Array.from(host.querySelectorAll("p.nn")) as any[]).find(x => /ID MY-/.test(x.textContent || "") && /連絡先は開示されないまま/.test(x.textContent || ""));
                if (p) {
                    const to = (p.textContent || "").split("連絡先は開示されないまま")[0].replace("🔒", "").trim();
                    p.setAttribute("data-noi18n", "");
                    p.innerHTML = E(to) + "<br>" + E(M("自社で登録した相手です。貴社の名前で送る文面です（文面・交渉はお客様ご自身で。費用はかかりません）。", "A buyer you registered yourself. The message is sent in your company's name (you handle the wording and negotiation; no fee)."));
                }
            }
        }
        catch (e) { }
        // AI商社マンの入力欄の例：登録の国・数量の単位で
        try {
            const ta = document.getElementById("aiq") as any;
            if (ta && ta.placeholder && /香港に500袋/.test(ta.placeholder)) {
                const p2 = fixExamples(ta.placeholder);
                if (p2 !== ta.placeholder)
                    ta.placeholder = p2;
            }
        }
        catch (e) { }
        // 食品・健康美容の編集の窓：「中古品として扱う」は、チェックが入っていなければ出さない
        try {
            const g = group();
            if (g && (g.k === "food" || g.k === "beauty"))
                document.querySelectorAll("input[data-v68opt='used']").forEach((i: any) => { const lb = i.closest("label"); if (lb && !i.checked && !lb.hidden)
                    lb.hidden = true; });
        }
        catch (e) { }
        // 商品情報：「数量帯があるので…即答できます」（価格表の帯が数量でないとき）
        try {
            const band = nonQtyBand();
            if (band) {
                const S = "数量帯があるので、「その数量ならいくら」を即答できます";
                (Array.from(document.querySelectorAll(".stage p, .stage div, .stage li, .stage span")) as any[]).filter(x => x.children.length < 4 && (x.textContent || "").indexOf(S) >= 0 && x.innerHTML.indexOf(S) >= 0).forEach(x => {
                    x.innerHTML = x.innerHTML.split(S).join(E(M(`価格は「${band}」ごとの帯です（数量帯ではありません）。どの帯に当たるかを確かめてから答えます`, `Prices are banded by “${band}” (not by quantity); the applicable band must be confirmed first`)));
                });
            }
        }
        catch (e) { }
    }
    let tm: any = 0;
    function sweep() {
        tm = 0;
        if (busy)
            return;
        try {
            sweepMis();
        }
        catch (e) {
            warn("sweepMis", e);
        }
        try {
            sweepMail();
        }
        catch (e) {
            warn("sweepMail", e);
        }
        try {
            sweepMisc();
        }
        catch (e) {
            warn("sweepMisc", e);
        }
    }
    const kick = () => { if (!tm && !busy)
        tm = setTimeout(sweep, 220); };
    try {
        const mo = new MutationObserver(() => kick());
        const startMo = () => { try {
            mo.observe(document.body, { childList: true, subtree: true });
            kick();
        }
        catch (e) { } };
        if (document.body)
            startMo();
        else
            document.addEventListener("DOMContentLoaded", startMo);
    }
    catch (e) { }
})();
