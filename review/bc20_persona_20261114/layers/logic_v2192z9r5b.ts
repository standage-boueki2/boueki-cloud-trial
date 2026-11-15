/* 21.92 r5b：5巡目の直し（分析の数字・案件・商談・目標と道筋・入り直したときの状態）
   今の関数は包むだけ。数字・事実は作らない。各ブロックの頭に、課題の番号と直し方を書く */
declare const TENS: any, D: any, SES: any, I18N: any, SHIPS: any, SHIPA: any, DASH: any, V68DASH: any, TIDX: any, SYNC: any;
declare let TEN: any, PID: any, cur: any, buildNav: any;
declare function loadTen(): any;
declare function syncTenant(): any;
declare function scoreOf(t: any): any;
declare let render: any, toast: any, dashOrders: any, dashAgg: any, vDash: any, dashDrill: any, v90anaDashNotes: any;
declare function dashScopeUnits(): any[];
declare function dashMoney(L: any[]): any;
declare function dashRate(): any;
declare function amtParse(s: any): any;
declare function v61dlCasesOf(id: any): any[];
declare function v61dlEffPrice(rec: any): any;
declare function v61dlNum(s: any): any;
declare function v88Tens(): any[];
declare const TODAYS: any;
declare let v38DashWait: any, v70dealActive: any, b30Remove: any;
declare function taskStats(): any;
declare function v38WaitCounts(): any;
declare function v30Norm(s: any): string;
declare function b30Find(k: string): any;
declare function b30Collect(): any[];
declare function saveTen(): void;
declare let v88Sig: any, v88Phases: any, ux32Setup: any, v56dCmpHtml: any, v56dCmpPlain: any;
(function () {
    const W: any = window;
    if (W.__v2192r5b) return;
    W.__v2192r5b = 1;
    const API: any = (W.v92r5b = W.v92r5b || {});
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const lang = () => { try { if (typeof I18N !== "undefined" && I18N && I18N.lang) { const v = String(I18N.lang); return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja"; } } catch (e) { } return "ja"; };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    API.M = M;
    const warn = (k: string, e: any) => { try { console.warn("[v92r5b] " + k, e); } catch (x) { } };
    const ten = () => { try { return (typeof TEN !== "undefined" && TEN) ? TEN : null; } catch (e) { return null; } };
    const dd = () => { try { return (typeof D !== "undefined" && D) ? D : null; } catch (e) { return null; } };
    const ships = (): any[] | null => { try { return (typeof SHIPS !== "undefined" && Array.isArray(SHIPS) && SHIPS.length && (typeof PID === "undefined" || SHIPS._pid === PID)) ? SHIPS : null; } catch (e) { return null; } };

    /* ── (1) food-Q01（major）：「累計受注金額」と「見積金額」が、最後に「書類をつくる」で開いた案件で入れ替わる
          原因：dashOrders は「受注が1件でもある商品の D.ship」を無条件で受注に数える。D.ship は“いま開いている案件”なので、
                見積の案件を開くとその額が受注に、見本の受注（1行目）は見積に回る。受注を記録しただけ（書類なし）の額はどこにも入らない。
          直し：① D.ship を受注に数えるのは、完成形の見本の、見本そのものの案件（1行目・利用者の案件でないもの）だけ。ほかの案件は今ある決まり
                  （発注書／商談の記録が「受注」→ 受注、ほかは見積）で分ける。どの案件を開いていても同じ結果になる
                ② 状況が「受注」の商談の記録で、まだ出荷案件（書類）が無いものは、確定単価（無ければ記録の単価）× 数量 を受注に数える。
                   案件を作ったあとは、その案件の Invoice の額に替わる（二重には数えない） */
    const isUserCase = (c: any) => { try { const S = c && c.ship; return !!(c && c.po) || !!(S && (S.poNo || S.v61fb || S.v56shipFb || S.v54copy)); } catch (e) { return true; } };
    const REC_NO = () => M("商談の記録", "Meeting record", "商谈记录", "Registro de reunión");
    const recOrders = (us: any[], have: any[]): any[] => {
        const out: any[] = [];
        try {
            (us || []).forEach((u: any) => {
                const fb = (u && u.D && u.D.fb) || [];
                fb.forEach((r: any) => {
                    try {
                        if (!r || Array.isArray(r) || r.st !== "受注" || !r.user) return;
                        if (u.act && r.v61id && typeof v61dlCasesOf === "function" && (v61dlCasesOf(r.v61id) || []).length) return;
                        if (have.some((o: any) => o && o.ref === u.ref && String(o.buyer || "") === String(r.b || "") && o.src !== "v92rec")) return;
                        const p = typeof v61dlEffPrice === "function" ? v61dlEffPrice(r) : null;
                        const a = p ? amtParse(p.s) : null;
                        const q = typeof v61dlNum === "function" ? v61dlNum(r.lot) : null;
                        if (!a || !a.cur || !(a.v > 0) || !(q > 0)) return;
                        const v = Math.round(a.v * q * 100) / 100;
                        const total = (a.cur === "USD" ? "US$" : "¥") + v.toLocaleString("en-US", a.cur === "USD" ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 });
                        out.push({ no: REC_NO(), buyer: r.b || "—", cty: r.c || "—", item: u.item, co: u.co, qty: r.lot || "—", unit: p.s, total, a: { cur: a.cur, v }, docRate: 0, dISO: String(r.d || "").slice(0, 10), ref: u.ref, src: "v92rec", v68k: "fb", v92rec: 1 });
                    }
                    catch (e) { }
                });
            });
        }
        catch (e) { warn("recOrders", e); }
        return out;
    };
    try {
        if (typeof dashOrders === "function") {
            const o = dashOrders;
            dashOrders = function (this: any, us: any) {
                let us2 = us;
                try {
                    const S = ships();
                    if (S && Array.isArray(us)) {
                        us2 = us.map((u: any) => {
                            if (!u || !u.act || !u.D || !u.D.ship) return u;
                            const s0 = S[0] && S[0].ship;
                            const own = (u.kind === "demo" && s0 && !isUserCase(S[0])) ? s0 : null;
                            if (u.D.ship === own) return u;
                            if (!own && !S.some((c: any) => c && c.ship === u.D.ship)) return u;
                            const D2 = Object.create(u.D);
                            D2.ship = own;
                            return Object.assign({}, u, { D: D2 });
                        });
                    }
                }
                catch (e) { warn("orders-us", e); us2 = us; }
                const out = o.call(this, us2) || [];
                try { recOrders(us, out).forEach((x) => out.push(x)); } catch (e) { warn("orders-rec", e); }
                return out;
            };
        }
    }
    catch (e) { warn("orders", e); }

    /* ── (2) health-Q02・other-M07：「見積を出している案件」の件数
          ・完成形の見本：件数が見本の決まった数のままで、自分で足した見積の記録が入らない → 自分で足した記録（価格あり／見積提示・サンプル発送・受注）を足す
          ・自社の商品：札は「状況が見積提示・サンプル発送・受注」の件数、押して出る一覧は「価格を書いた記録」で、0件なのに1行出る
            → 札も一覧も「価格を書いた記録、または状況が見積提示・サンプル発送・受注の記録」にそろえる（注記の「価格を出した商談の記録」と同じ） */
    const isQ = (r: any) => !!r && !Array.isArray(r) && ((!!r.price && r.price !== "—") || /見積提示|サンプル発送|受注/.test(String(r.st || "")));
    try {
        if (typeof dashAgg === "function") {
            const o = dashAgg;
            dashAgg = function (this: any, us: any) {
                const A = o.apply(this, arguments as any);
                try {
                    if (A && A.K && !A.per && !A.v92r5bQ) {
                        A.v92r5bQ = 1;
                        (A.us || us || []).forEach((u: any) => {
                            const fb = (u && u.D && u.D.fb) || [];
                            if (u.kind === "demo") A.K.quotes += fb.filter((r: any) => r && r.user && isQ(r)).length;
                            else A.K.quotes += Math.max(0, fb.filter(isQ).length - (+((u.D.kpi || {}).quotes) || 0));
                        });
                    }
                    if (A && API._qd && Array.isArray(A.fb)) A.fb.forEach((r: any) => { if (isQ(r) && !(r.price && r.price !== "—")) r.price = M("（価格の記録なし）", "(no price recorded)", "（未记录价格）", "(sin precio)"); });
                }
                catch (e) { warn("agg", e); }
                return A;
            };
        }
        if (typeof dashDrill === "function") {
            const o = dashDrill;
            dashDrill = function (this: any, kind: any, arg: any) {
                const q = kind === "funnel" && /見積/.test(String(arg || ""));
                if (q) API._qd = 1;
                let r: any;
                try { r = o.apply(this, arguments as any); } finally { if (q) API._qd = 0; }
                try {
                    if (kind === "orders") {
                        // 商談の記録から数えた受注（書類なし）の行：受注No の列に「商談の記録」と出し、✎（受注内容の編集）は出さない
                        const pn = document.getElementById("pn") || document.getElementById("dw");
                        if (pn) pn.querySelectorAll("tr").forEach((tr: any) => {
                            const td = tr.querySelector("td");
                            if (!td || String(td.textContent || "").trim() !== REC_NO()) return;
                            const b = tr.querySelector("button");
                            if (b && b.parentElement) b.parentElement.innerHTML = `<span class="nn" data-noi18n style="font-size:9.5px;margin:0">${E(M("単価×数量（書類をつくると Invoice の額に替わります）", "unit price × qty (replaced by the invoice amount once documents are made)", "单价×数量（制作单据后改为发票金额）", "precio × cantidad (se sustituye por la factura al crear documentos)"))}</span>`;
                        });
                    }
                }
                catch (e) { warn("drill", e); }
                return r;
            };
        }
    }
    catch (e) { warn("quotes", e); }

    /* ── (3) auto-Q05：受注の案件に見積書（PI）があるのに「まだ見積書がありません」／culture-N12：分析の「見積金額」に換算レートが無い */
    try {
        if (typeof vDash === "function") {
            const o = vDash;
            vDash = function (this: any) {
                let h = o.apply(this, arguments as any);
                try {
                    if (typeof h !== "string" || h.indexOf('id="v68qkd"') < 0) return h;
                    // health-Q02：見積書が1つできて行の文が長くなると、刷新版の「長い説明は ? へたたむ」に入って金額の行ごと見えなくなる → 金額の行はたたまない
                    h = h.replace('<div class="kd" id="v68qkd">', '<div class="kd" id="v68qkd" data-kqn="1">');
                    const A = dashAgg(dashScopeUnits());
                    const nOrd =(A.orders || []).filter((x: any) => x && x.src !== "base").length;
                    if (nOrd) {
                        h = h.replace("見積金額は見積書（PI）の合計で、まだ見積書がありません", M("見積金額は、受注がまだ決まっていない案件の見積書（PI）の合計です。受注が決まった案件の分は、累計受注金額に入れています", "", "", ""));
                        h = h.replace("The quoted amount is the total of quotations (PI); none yet", "The quoted amount is the total of quotations (PI) for cases not yet ordered; confirmed orders are counted in the order total");
                        h = h.replace(/(<span class="n" id="v68qamt">)(金額の記録なし|no amount recorded)(<\/span>)/, (m: string, a: string, b: string, c: string) => a + E(M("受注未確定の見積書はありません", "no open quotations", "没有未确定的报价单", "sin cotizaciones abiertas")) + c);
                    }
                    const qs = (A.quotes || []).filter((x: any) => x && x.a && x.a.cur === "USD");
                    if (qs.length && (!DASH || DASH.cur !== "USD")) {
                        const r = dashRate();
                        const rates: string[] = [];
                        qs.forEach((x: any) => { const t = x.docRate ? M(`${x.docRate}円（見積書に書いたレート）`, `¥${x.docRate} (rate on the quotation)`, `${x.docRate}日元（报价单上的汇率）`, `¥${x.docRate} (tipo de la cotización)`) : M(`${r.v.toFixed(2)}円（参照レート ${r.d || ""}）`, `¥${r.v.toFixed(2)} (reference rate ${r.d || ""})`, `${r.v.toFixed(2)}日元（参考汇率 ${r.d || ""}）`, `¥${r.v.toFixed(2)} (tipo de referencia ${r.d || ""})`); if (rates.indexOf(t) < 0) rates.push(t); });
                        const a = h.indexOf('id="v68qkd"'), b = a >= 0 ? h.indexOf("</div>", a) : -1;
                        if (b > a) h = h.slice(0, b) + `<br><span class="v92r5b-qrate" data-noi18n style="font-size:9px">${E(M("換算：1 US$＝", "Converted at 1 US$ = ", "换算：1 US$＝", "Conversión: 1 US$ = "))}${E(rates.join("／"))}</span>` + h.slice(b);
                    }
                }
                catch (e) { warn("vdash", e); }
                return h;
            };
        }
    }
    catch (e) { warn("vdash-wrap", e); }

    /* ── (4) other-Q02・indagri-Q02：建値が違うときの文が、先方の希望（CIF／CFR など）が自社の FOB より高いときにも「実際の差はもっと大きくなります」
          → 高いときは「運賃などを足すと、先方が高い分（余裕）は小さくなります（足りなくなることもあります）」、範囲内のときは「先方の希望のほうが低くなることがあります」。
            低いときは今のまま。金額（US$38500 など）に桁区切りを入れる */
    try {
        const comma = (s: string) => s.replace(/US\$(\d{4,})(\.\d+)?/g, (m: string, a: string, b: string) => "US$" + a.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (b || ""));
        const dirOf = (h: string) => h.indexOf("<span>高い金額です。</span>") >= 0 ? "high" : h.indexOf("自社の価格表の範囲に入っています") >= 0 ? "same" : "low";
        if (typeof v56dCmpHtml === "function") {
            const o = v56dCmpHtml;
            v56dCmpHtml = function (this: any, c: any) {
                let h = o.apply(this, arguments as any);
                try {
                    if (typeof h === "string" && h) {
                        const key = "の価格に運賃などを足して比べる必要があるので、実際の差はもっと大きくなります。";
                        const i = h.indexOf(key);
                        if (i >= 0) {
                            const d = dirOf(h);
                            const t = d === "high" ? M("の価格に運賃などを足して比べる必要があるので、先方が高い分（余裕）は小さくなります（運賃しだいで、足りなくなることもあります）。", " price needs freight etc. added before comparing, so the buyer's margin above your price becomes smaller (and may turn negative depending on freight). ", "的价格需加上运费等再比较，因此对方高出的部分（余量）会变小（视运费而定，也可能不够）。", " debe sumar el flete, etc. antes de comparar, por lo que el margen a favor se reduce (y puede volverse negativo según el flete). ")
                                : d === "same" ? M("の価格に運賃などを足して比べる必要があるので、足したあとは、先方の希望のほうが低くなることがあります。", " price needs freight etc. added before comparing; after that the buyer's offer may be lower than your price. ", "的价格需加上运费等再比较，加上之后对方的期望价可能更低。", " debe sumar el flete, etc. antes de comparar; después la oferta puede quedar por debajo. ") : "";
                            if (t) h = h.slice(0, i) + `</span><span data-noi18n>${E(t)}</span><span>` + h.slice(i + key.length);
                        }
                        h = comma(h);
                    }
                }
                catch (e) { }
                return h;
            };
        }
        if (typeof v56dCmpPlain === "function") {
            const o = v56dCmpPlain;
            v56dCmpPlain = function (this: any, c: any) {
                let s = o.apply(this, arguments as any);
                try {
                    if (typeof s === "string" && s) {
                        const key = "の価格に運賃などを足して比べるため、実際の差はもっと大きい";
                        if (s.indexOf(key) >= 0) {
                            const hi = /先方の希望は自社の価格より .* 高い/.test(s), same = /先方の希望は価格表の範囲内/.test(s);
                            if (hi) s = s.replace(key, "の価格に運賃などを足して比べるため、先方が高い分（余裕）は小さくなる（足りなくなることもある）");
                            else if (same) s = s.replace(key, "の価格に運賃などを足して比べるため、足したあとは先方の希望のほうが低くなることがある");
                        }
                        s = comma(s);
                    }
                }
                catch (e) { }
                return s;
            };
        }
    }
    catch (e) { warn("cmp", e); }

    /* ── (5) culture-Q01・food-M03・indagri-M03／N12・auto-M06：目標と道筋の ✓ と段の札・帯
          原因：手順の ✓ は「いまの段階の番号 ≧ その手順の番号」で付く。段階は、後ろの合図（バイヤーを1社足した・商談を1件記録した）だけでも上がるので、
                やっていない手前の手順（商標・展示会 など）にも ✓ が付き、段の札も「✓ 済み」になる。「バイヤーに連絡を始めた」は、相手を一覧に足しただけでも立つ
          直し：① ✓ は、その手順そのものの事実があるときだけ（下の表）。事実を持てない手順（商標・OEM・テスト販売 など）は、その手順のタスクを完了にしたとき
                ② 段の札「✓ 済み」は、中の手順が全部 ✓ のときだけ
                ③ 段階の合図：「バイヤーに連絡を始めた」は実際に連絡した記録（送信・直接連絡・相手からの返信）があるとき。販売先国・規制は、はじめの設定と同じ判定。価格は価格表があれば立つ
             完成形の見本（TEN.src==="sample"）の手順の ✓ は今のまま（②だけ効く） */
    const cnt = (a: any) => Array.isArray(a) ? a.length : 0;
    const rmTens = (): any[] => { try { if (typeof v88Tens === "function") return v88Tens() || []; } catch (e) { } const t = ten(); return t ? [t] : []; };
    const isSample = () => { const t = ten(); return !!(t && t.src === "sample"); };
    const setupDone = (): any => { const o: any = {}; try { const S = (typeof ux32Setup === "function") ? ux32Setup() : null; if (Array.isArray(S)) S.forEach((r: any) => { if (Array.isArray(r)) o[r[0]] = !!r[4]; }); else return null; } catch (e) { return null; } return o; };
    const contacted = (): number => {
        let n = 0;
        try {
            rmTens().forEach((t: any) => {
                n += cnt(t.outreach) + cnt(t.netConnects);
                Object.values(t.dmThreads || {}).forEach((th: any) => {
                    const ms = (th && Array.isArray(th.msgs)) ? th.msgs : [];
                    if (ms.some((m: any) => m && !m.sim && (m.w !== "me" || !/^商談の記録（/.test(String(m.subj || ""))))) n++;
                });
            });
        }
        catch (e) { }
        return n;
    };
    const hasPriceTable = (): boolean => { try { const d = dd(); if (d && cnt(d.priceRows)) return true; return rmTens().some((t: any) => cnt(t.priceRows) || t.fobIn || Object.keys(t.ddpPx || {}).length); } catch (e) { return false; } };
    const fbAll = (): any[] => { const L: any[] = []; try { rmTens().forEach((t: any) => (Array.isArray(t.fbx) ? t.fbx : []).forEach((f: any) => { if (f && !Array.isArray(f)) L.push(f); })); } catch (e) { } return L; };
    const taskDone = (re: RegExp): string => {
        try {
            const L: any[] = [];
            rmTens().forEach((t: any) => (t.xtasks || []).forEach((x: any) => L.push(x)));
            const d = dd(); if (d && Array.isArray(d.tasks)) d.tasks.forEach((x: any) => { L.push(x); (x.kids || []).forEach((k: any) => L.push(k)); });
            const x = L.find((y: any) => y && y.st === "完了" && re.test(String(y.n || "")));
            return x ? String(x.n || "").replace(/^🧭\s*/, "") : "";
        }
        catch (e) { return ""; }
    };
    API.contacted = contacted;
    try {
        if (typeof v88Sig === "function") {
            const o = v88Sig;
            v88Sig = function (this: any) {
                const s = o.apply(this, arguments as any);
                try {
                    if (s && !isSample()) {
                        s.reach = contacted() ? 1 : 0;
                        if (hasPriceTable()) s.price = 1;
                        const SD = setupDone();
                        if (SD && SD.cty === false) s.tg = 0;
                        if (SD && SD.reg === false) s.reg = 0;
                    }
                }
                catch (e) { warn("sig", e); }
                return s;
            };
        }
        if (typeof v88Phases === "function") {
            const o = v88Phases;
            v88Phases = function (this: any, G: any, B: any, st: any) {
                const ph = o.apply(this, arguments as any);
                try {
                    const sig = (st && st.sig) || {};
                    const smp = isSample();
                    const W1 = (ja: string, en: string, zh: string, es: string) => M("済みの根拠：", "Done because: ", "已完成的依据：", "Hecho porque: ") + M(ja, en, zh, es);
                    const byTask = (a: any, re: RegExp) => { const n = taskDone(re); if (n) { a.done = true; a.why = W1(`タスク「${n}」を完了`, `task “${n}” completed`, `任务“${n}”已完成`, `tarea “${n}” completada`); } else { a.done = false; delete a.why; } };
                    const set = (a: any, ok: boolean, why: string) => { if (ok) { a.done = true; a.why = why; } else { a.done = false; delete a.why; } };
                    if (!smp) (ph || []).forEach((p: any) => (p.acts || []).forEach((a: any) => {
                        if (!a) return;
                        const t = String(a.t || "");
                        if (a.tag === "tm") byTask(a, /商標|trademark/i);
                        else if (a.tag === "fair") {
                            if (/^展示会に出る|^Exhibit/.test(t)) { const n = fbAll().filter((f: any) => /展示会/.test(String(f.ch || ""))).length; if (n) set(a, true, W1(`チャネルが「展示会」の商談の記録 ${n}件`, `${n} meeting record(s) with channel “Trade show”`, `渠道为“展会”的商谈记录 ${n} 条`, `${n} registro(s) con canal “Feria”`)); else byTask(a, /展示会|trade show/i); }
                            else byTask(a, /認知|awareness/i);
                        }
                        else if (a.tag === "ec") byTask(a, /テスト販売|越境EC|e-commerce/i);
                        else if (/^OEM|^Summarise how you take OEM/.test(t)) byTask(a, /OEM/);
                        else if (/^輸出の価格|^Set export prices/.test(t)) set(a, hasPriceTable(), W1("価格表・輸出価格あり", "prices on file", "已有价格表・出口价格", "precios registrados"));
                        else if (/^AIバイヤー開拓で毎月|^Reach out to buyers/.test(t)) { const n = contacted(); set(a, n > 0, W1(`バイヤーへの連絡の記録あり（${n}件）`, `buyer outreach on file (${n})`, `已有联系买家的记录（${n} 条）`, `contactos con compradores registrados (${n})`)); }
                        else if (/^返事が来たら|^Reply fast/.test(t)) { const n = fbAll().length; set(a, n > 0, W1(`商談の記録 ${n}件`, `${n} meeting record(s)`, `商谈记录 ${n} 条`, `${n} registro(s) de reunión`)); }
                        else if (a.tag === "sample") { if (!sig.sample) { a.done = false; delete a.why; } }
                        else if (/^契約の条件|^Agree terms/.test(t)) { if (!sig.nego) { a.done = false; delete a.why; } }
                        else if (/^初回の出荷|^Prepare the first shipment/.test(t)) { if (!sig.deal) { a.done = false; delete a.why; } }
                        else if (/^2回目の注文|^Turn the first order/.test(t)) { if (!((sig.deals | 0) >= 2 || (sig.orders | 0) >= 2)) { a.done = false; delete a.why; } }
                        else if (/^2か国目へ|^Add a second market/.test(t)) { if (Object.keys(sig.dealCty || {}).length < 2) { a.done = false; delete a.why; } }
                        else if (/^国ごとの代理店|^Standardise distributor/.test(t)) byTask(a, /代理店|distributor/i);
                    }));
                    (ph || []).forEach((p: any) => { if (p && p.done && !(p.acts || []).every((a: any) => a && a.done)) p.done = false; });
                }
                catch (e) { warn("phases", e); }
                return ph;
            };
        }
    }
    catch (e) { warn("rm", e); }

    /* ── (6) culture-Q04：はじめの設定の「まだの理由：まだの理由：…」→ 理由の文の頭の見出しを取る（見出しは画面の側が付ける） */
    try {
        if (typeof ux32Setup === "function") {
            const o = ux32Setup;
            ux32Setup = function (this: any) {
                const S = o.apply(this, arguments as any);
                try { if (Array.isArray(S)) S.forEach((r: any) => { if (Array.isArray(r) && typeof r[5] === "string") r[5] = r[5].replace(/^(まだの理由：|Not yet: |Why not yet: |未完成的原因：|Pendiente: |Por qué falta: )/, ""); }); } catch (e) { }
                return S;
            };
        }
    }
    catch (e) { warn("setup", e); }

    /* ── (7) 入り直した直後に、商品が無い状態（「商品情報を登録」・はじめの設定 0/6・「はじめまして」の窓）に見える／同じ商品が2件になる（food・indagri・medical の観察）
          原因：続きのセッション（ログインの画面を通らない入り直し）では、読み込みの途中（後ろの層が読まれる前）に入る。その時点では、この端末に保存した
                商品を読めず（保存の読み書きを包む層がまだ無い）、商品 0件のまま画面が出る。商品が出るのは、同期サーバーへのログインと取得が終わったあと
                （syncReloadState）だけ。サーバーの返事が遅い間（1回の呼び出しは最長 30秒）は 0件に見え、サーバーに届かないときは、その回はずっと 0件のまま。
                この間に同じ資料を登録し直すと、あとから元の商品が読み込まれて同じ商品が2件になる。保存は消えていないので、次に入り直すと元どおり。
          直し：全部の層が読まれた時点（ここ）で、まだ商品が読まれていなければ、この端末の保存から先に読み込んで表示する（サーバーの返事を待たない）。
                同期が終わったあとは今までどおり（サーバーのほうが新しければ、その内容で読み直す）。保存に商品が無いアカウントは今までどおり */
    try {
        const early = () => {
            try {
                if (typeof SES === "undefined" || !SES || SES.t !== "trial" || SES.role === "fwd") return false;
                if (typeof PID !== "undefined" && PID) return false;
                if (document.getElementById("lgv") || document.body.classList.contains("locked")) return false;
                const t = loadTen();
                if (!t) return false;
                TEN = t; PID = "custom";
                try { syncTenant(); } catch (e) { }
                try { cur = scoreOf(TEN).missing.length ? "up" : "dash"; } catch (e) { }
                try { const w = document.getElementById("welv"); if (w) w.remove(); } catch (e) { }
                API._early = (API._early | 0) + 1;
                try { buildNav(); } catch (e) { }
                try { render(); } catch (e) { }
                return true;
            }
            catch (e) { warn("early", e); return false; }
        };
        API.early = early;
        if (!early()) {
            // 入るのがこの層より後になる場合（認証の確かめが先に走る版）に備えて、少しのあいだだけ見る
            let n = 0;
            const iv = setInterval(() => { n++; try { if (early() || (typeof PID !== "undefined" && PID) || n > 40) clearInterval(iv); } catch (e) { clearInterval(iv); } }, 150);
        }
    }
    catch (e) { warn("boot", e); }

    /* ── (8) daily-Q02：分析の「対応待ち」の「期限が今日まで 0」と、タスク・進行の「期限切れ 2件」
          原因：対応待ちの札は「自分の番のもの」（自分が担当・担当なし）だけを数える。タスク・進行は会社全体のタスク。数え方が札に書かれていない
          直し：札の小さい字を「自分の番のもの（過ぎたものを含む）」に。会社全体の期限切れ・今日までのタスクのほうが多いときは、その数も書く（数は変えない） */
    try {
        if (typeof v38DashWait === "function") {
            const o = v38DashWait;
            v38DashWait = function (this: any) {
                let h = String(o.apply(this, arguments as any));
                try {
                    let all = 0;
                    try {
                        const S = taskStats();
                        const td = String((typeof TODAYS !== "undefined" && TODAYS) || "").slice(0, 10);
                        if (td) all = (S.all || []).filter((t: any) => t && t.e && !/^(完了|中止)$/.test(String(t.st || "")) && String(t.e).slice(0, 10) <= td).length;
                    }
                    catch (e) { }
                    let mine = 0;
                    try { mine = (v38WaitCounts() || {}).today | 0; } catch (e) { }
                    const sub = M("自分の番のもの（過ぎたものを含む）", "Yours only (incl. overdue)", "仅自己负责的（含已过期）", "Solo lo suyo (incl. vencido)")
                        + (all > mine ? M(`。会社全体のタスクでは ${all}件（タスク・進行）`, `. Company-wide tasks: ${all} (Tasks)`, `。全公司任务为 ${all} 件（任务・进度）`, `. Tareas de toda la empresa: ${all} (Tareas)`) : "");
                    h = h.replace(/(data-v38wf="today">[\s\S]*?<span class="v38ws")(>)[^<]*(<\/span>)/, (m: string, a: string, b: string, c: string) => a + " data-noi18n" + b + E(sub) + c);
                }
                catch (e) { }
                return h;
            };
        }
    }
    catch (e) { warn("wait", e); }

    /* ── (9) food-M05 の残り：バイヤー一覧から削除した相手（r4b が一覧から外した相手）が、分析・今日やることの「やりとり中の相手」と案件一覧に残る
          → 「やりとり中の相手」の数（v70dealActive）からも外す。案件一覧（刷新版）が外せるよう、削除のときに相手のスレッドの ID も覚える */
    const hidList = (): any[] => { try { const t = ten(); return ((t ? t.v92r4bHid : W.__v92r4bHid) || []) as any[]; } catch (e) { return []; } };
    API.hidThreads = (): string[] => { const out: string[] = []; try { hidList().forEach((h: any) => { (h.th || []).forEach((id: any) => out.push(String(id))); (h.k || []).forEach((k: any) => { const m = /^my:(.+)$/.exec(String(k)); if (m) out.push(m[1]); }); }); } catch (e) { } return out; };
    try {
        const nrm = (s: any) => { try { if (typeof v30Norm === "function") return v30Norm(s); } catch (e) { } return String(s || "").toLowerCase().replace(/\s+/g, ""); };
        if (typeof v70dealActive === "function") {
            const o = v70dealActive;
            v70dealActive = function (this: any) {
                const A = o.apply(this, arguments as any);
                try {
                    const H = hidList();
                    if (H.length && A && Array.isArray(A.rows)) {
                        const set: any = {};
                        H.forEach((h: any) => (h.k || []).forEach((k: string) => { set[k] = 1; }));
                        const rows = A.rows.filter((r: any) => { if (!r || r.my) return true; const n = nrm(r.name); return !(set[String(r.key)] || set["nm:" + n + "|" + (r.cty || "")] || set["nm:" + n + "|"]); });
                        if (rows.length !== A.rows.length) { A.rows = rows; A.n = rows.length; A.hot = rows.filter((r: any) => r.prob === "高").length; A.ctys = new Set(rows.map((r: any) => r.cty).filter(Boolean)).size; }
                    }
                }
                catch (e) { }
                return A;
            };
            try { W.V70DEAL_ACTIVE = v70dealActive; } catch (e) { }
        }
        if (typeof b30Remove === "function") {
            const o = b30Remove;
            b30Remove = function (this: any, key: string) {
                let ids: string[] = [], n0 = 0;
                try {
                    const r0 = b30Find(key);
                    n0 = hidList().length;
                    if (r0) { [].concat(r0.ths || [], r0.th ? [r0.th] : []).forEach((x: any) => { const id = x && (x.id || (x.th && x.th.id)); if (id) ids.push(String(id)); }); if (r0.my && r0.my.id) ids.push(String(r0.my.id)); }
                }
                catch (e) { }
                const r = o.apply(this, arguments as any);
                try { const H = hidList(); if (H.length > n0 && ids.length) { H[H.length - 1].th = ids.filter((x, i) => ids.indexOf(x) === i); try { saveTen(); } catch (e) { } } } catch (e) { }
                return r;
            };
        }
    }
    catch (e) { warn("hid", e); }

    /* ── (10) indagri-Q07：バイヤーを足した直後、タブ「バイヤー一覧（9）」と一覧「すべて（失注を除く）10」
           原因：タブは画面を描いたときに1回だけ作り、一覧だけ描き直すと数が古いまま → 描き直しのたびにタブの数を一覧（失注を除く）の数に合わせる
       ── (11) auto-Q04・culture（「往復 2」）：「＋ 新しい出荷案件」の窓の「直接メッセージでやり取り中のBuyer」が、自分で登録した相手でも「国のバイヤー＋ID」
           → 自分で登録した相手は社名（国）で出す。「往復 N通」は「やりとり N通」
       ── (12) health-Q05：完成形の見本に足した記録は、アプリを開き直すと残らない → 記録の窓の注意に書く */
    try {
        const tabFix = () => {
            try {
                const b = document.querySelector("#b30tabs .optab b");
                if (!b || typeof b30Collect !== "function") return;
                const n = b30Collect().filter((r: any) => r && r.lead !== "失注").length;
                const t = String(b.textContent || "");
                const u = t.replace(/[（(]\d+[）)]/, (m: string) => m.charAt(0) + n + m.charAt(m.length - 1));
                if (u !== t) b.textContent = u;
            }
            catch (e) { }
        };
        const dwFix = () => {
            try {
                const dw = document.getElementById("dw");
                if (!dw) return;
                const MB: any[] = (() => { try { const t = ten(); return (t && Array.isArray(t.myBuyers)) ? t.myBuyers : []; } catch (e) { return []; } })();
                dw.querySelectorAll('[data-shipgo="dm"]:not([data-v92r5b])').forEach((btn: any) => {
                    btn.setAttribute("data-v92r5b", "1");
                    const row = btn.parentElement;
                    if (!row) return;
                    const m = /（ID ([^）]+)）\s*$/.exec(String(btn.getAttribute("data-buyer") || ""));
                    const b = m ? MB.find((x: any) => x && String(x.id) === m[1] && x.co) : null;
                    const tw = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, null);
                    let n: any; const T: any[] = [];
                    while ((n = tw.nextNode())) T.push(n);
                    T.forEach((x: any) => { if (/往復 \d+通/.test(x.nodeValue)) x.nodeValue = x.nodeValue.replace(/往復 (\d+)通/, (q: string, k: string) => M(`やりとり ${k}通`, `${k} message(s)`, `往来 ${k} 条`, `${k} mensaje(s)`)); });
                    if (b) {
                        const cty = btn.getAttribute("data-cty") || b.cty || "";
                        const first = T.find((x: any) => String(x.nodeValue || "").trim() && !btn.contains(x));
                        if (first) first.nodeValue = b.co + (cty ? `（${cty}）` : "");
                        btn.setAttribute("data-buyer", b.co);
                    }
                });
                const w = dw.querySelector(".v79dtgt-w:not([data-v92r5b])") as any;
                if (w && /見本の商品です|sample product/.test(String(w.textContent || ""))) {
                    w.setAttribute("data-v92r5b", "1");
                    if (isSample()) w.insertAdjacentHTML("beforeend", ` <span data-noi18n>${E(M("完成形の見本に足した記録は、アプリを開き直すと残りません（見本は毎回、最初の状態に戻ります）。", "Records added to a full sample are not kept when you reopen the app (the sample resets each time).", "添加到完整示例中的记录，重新打开应用后不会保留（示例每次都会恢复到初始状态）。", "Los registros añadidos al ejemplo completo no se conservan al reabrir la aplicación (el ejemplo se reinicia cada vez)."))}</span>`);
                }
            }
            catch (e) { }
        };
        let tm: any = 0;
        const soon = () => { if (tm) return; tm = setTimeout(() => { tm = 0; tabFix(); dwFix(); }, 80); };
        if (typeof render === "function") { const o = render; render = function (this: any) { const r = o.apply(this, arguments as any); soon(); return r; }; }
        document.addEventListener("click", () => { soon(); setTimeout(soon, 400); }, true);
        document.addEventListener("input", soon, true);
    }
    catch (e) { warn("dom", e); }
})();
