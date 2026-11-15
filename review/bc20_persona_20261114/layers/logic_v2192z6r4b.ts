/* 21.92 r4b：4巡目の直し（案件・商談・バイヤー・やりとり・受信箱・今日やること・タスク・会議メモ・目標と道筋・分析・ゴミ箱・取り込んだ情報・チーム、画面どうしの数の食い違い）
   今の関数は包むだけ。数字・事実は作らない。各ブロックの頭に、課題の番号と直し方を書く */
declare const TEN: any, TENS: any, D: any, SES: any, V54D: any, I18N: any, V33TR: any, V33AU_ACT: any, SHIPS: any, SHIPA: any, PID: any, DASH: any, cur: any;
declare let render: any, toast: any, openDealForm: any, dealSave: any, shipCaseNew: any, dmNow: any, a30Collect: any, v30Tens: any, v30Ten: any, v61dlCaseListHtml: any,
    v90anaDashNotes: any, b30Collect: any, b30Remove: any, shipEnsure: any, l30Events: any, dashAgg: any, vDash: any, v56dCmp: any, v56dCmpHtml: any, v56dCmpPlain: any;
declare function isDemoClock(): boolean;
declare function todayISO(): string;
declare function saveTen(): void;
declare function v30Norm(s: any): string;
declare function dashScopeUnits(): any[];
declare function v70dashOpenUnit(): any;
declare function v70dashInScope(L: any, o: any): boolean;
declare function v61dlSumOf(rec: any): any;
declare function v61dlQtyTxt(n: any, u: any): string;
declare function b30Find(k: string): any;
declare function v68CaseByNo(no: any): any;
declare function dashMoney(L: any[]): any;
declare function v56dIncoCode(s: any): string;
declare function v33TrashPut(kind: string, ref: any, name: string, data: any): any;
declare function v33TrashRestore(id: any): any;
declare function v33Undo(t: string, fn: any, ms?: number): any;
declare function v33AuLog(a: any, b?: any, c?: any): any;
declare function srcList(): any[];
declare function srcSave(): void;
declare function tenantToD(t: any): any;
(function () {
    const W: any = window;
    if (W.__v2192r4b) return;
    W.__v2192r4b = 1;
    const API: any = (W.v92r4b = W.v92r4b || {});
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const lang = () => { try { if (typeof I18N !== "undefined" && I18N && I18N.lang) { const v = String(I18N.lang); return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja"; } } catch (e) { } return "ja"; };
    const M = (ja: string, en: string, zh?: string, es?: string) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    API.M = M;
    const warn = (k: string, e: any) => { try { console.warn("[v92r4b] " + k, e); } catch (x) { } };
    const ten = () => { try { return (typeof TEN !== "undefined" && TEN) ? TEN : null; } catch (e) { return null; } };
    const dd = () => { try { return (typeof D !== "undefined" && D) ? D : null; } catch (e) { return null; } };
    const norm = (s: any) => { try { if (typeof v30Norm === "function") return v30Norm(s); } catch (e) { } return String(s || "").toLowerCase().replace(/\s+/g, ""); };
    const save = () => { try { if (typeof saveTen === "function") saveTen(); } catch (e) { } };

    /* ── (1) health-M09・indagri-M09：完成形の見本の中で自分が記録したもの（商談・送信・出荷案件）が、見本の時計（2026-08-04）の日付になる
          → 利用者が今つくる記録だけ、実際の今日の日付にする（見本のデータと、見本の時計そのものは変えない） */
    const demo = () => { try { return typeof isDemoClock === "function" && isDemoClock(); } catch (e) { return false; } };
    const realScope = (fn: () => any) => {
        let ok = false;
        try { if (typeof V54D !== "undefined" && V54D && typeof V54D.realClock === "number") { V54D.realClock++; ok = true; } } catch (e) { }
        const done = () => { if (ok) { ok = false; try { V54D.realClock--; } catch (e) { } } };
        let r: any;
        try { r = fn(); } catch (e) { done(); throw e; }
        if (r && typeof r.then === "function") { try { r.then(done, done); } catch (e) { done(); } } else done();
        return r;
    };
    try {
        if (typeof openDealForm === "function") {
            const o = openDealForm;
            openDealForm = function (this: any) {
                const isDemo = demo();
                const r = o.apply(this, arguments as any);
                try {
                    if (isDemo && typeof todayISO === "function") {
                        const el: any = document.getElementById("dfD");
                        if (el && el.value === "2026-08-04") { el.value = todayISO(); el.title = M("今日の日付を入れています（見本のデータは 2026年夏ごろの日付です）", "Set to today's date (the sample data is dated around summer 2026)", "已填入今天的日期（示例数据的日期为2026年夏季前后）", "Se puso la fecha de hoy (los datos de muestra son de mediados de 2026)"); }
                    }
                }
                catch (e) { warn("dfD", e); }
                return r;
            };
        }
        if (typeof dealSave === "function") { const o = dealSave; dealSave = function (this: any) { const a = arguments; return demo() ? realScope(() => o.apply(this, a as any)) : o.apply(this, a as any); }; }
        if (typeof shipCaseNew === "function") {
            const o = shipCaseNew;
            shipCaseNew = function (this: any) {
                const a = arguments;
                if (!demo()) return o.apply(this, a as any);
                const c = realScope(() => o.apply(this, a as any));
                try { if (c && c.ship && !c.ship.date && !c.ship.orderDate && typeof todayISO === "function") c.ship.date = todayISO(); } catch (e) { }
                return c;
            };
        }
        if (typeof dmNow === "function") { const o = dmNow; dmNow = function (this: any) { const a = arguments; return demo() ? realScope(() => o.apply(this, a as any)) : o.apply(this, a as any); }; }
    }
    catch (e) { warn("clock", e); }

    /* ── (2) health-M03・health-N18：分析の「直近7日の活動」に、集計範囲に入っていない見本の商品の記録が入る
          → 上の集計範囲（dashScopeUnits）に入っていない商品の分は数えない（表示中の商品が範囲の外のときだけ）
          other-M03：商談の記録から作っただけ（送っていない）の1行目は「アプローチ」（こちらから送った連絡）に数えない */
    try {
        if (typeof a30Collect === "function") {
            const o = a30Collect;
            a30Collect = function (this: any, R: any) {
                let allow: any[] | null = null;
                try {
                    if (typeof dashScopeUnits === "function" && typeof v70dashOpenUnit === "function" && typeof v70dashInScope === "function" && typeof TENS !== "undefined") {
                        const L = dashScopeUnits() || [], op = v70dashOpenUnit();
                        if (op && L.length && !v70dashInScope(L, op)) allow = L.map((u: any) => (u && u.i != null) ? TENS[u.i] : null).filter(Boolean);
                    }
                }
                catch (e) { allow = null; }
                let out: any;
                if (allow && allow.length && typeof v30Tens === "function" && typeof v30Ten === "function") {
                    // 範囲に入っている商品（会社ごと）だけを数える。表示中の商品（範囲の外）の記録・タスク・メモは入れない
                    const vt = v30Tens, v1 = v30Ten, A = allow as any[];
                    const cos = A.map((t: any) => t.co || "").filter((c: string, i: number, a: string[]) => a.indexOf(c) === i);
                    try {
                        v30Tens = function () { return (vt() || []).filter((t: any) => A.indexOf(t) >= 0); };
                        cos.forEach((co: string) => {
                            v30Ten = function () { return { co, src: "upload", v92r4bFake: 1 }; };
                            const part = o.call(this, R);
                            Object.keys(part || {}).forEach((k) => { const L = (part[k] || []).filter((x: any) => x && Object.prototype.hasOwnProperty.call(x, "item")); if (!out) out = {}; out[k] = (out[k] || []).concat(L); });
                        });
                    }
                    finally { v30Tens = vt; v30Ten = v1; }
                    if (out) { Object.keys(out).forEach((k) => out[k].sort((a: any, c: any) => c.at - a.at)); out.v92r4bScoped = 1; }
                    else out = o.apply(this, arguments as any);
                }
                else out = o.apply(this, arguments as any);
                try { if (out && Array.isArray(out.appr)) out.appr = out.appr.filter((x: any) => !(x && /直接連絡/.test(String(x.how || "")) && /^商談の記録（\d{4}-\d\d-\d\d）/.test(String(x.txt || "")))); } catch (e) { }
                return out;
            };
        }
    }
    catch (e) { warn("a30", e); }

    /* ── (3) culture-M10：受注内容を記録より多い数量に直すと「残り -20個」→「商談の記録（300個）より 20個 多い」 */
    try {
        if (typeof v61dlCaseListHtml === "function") {
            const o = v61dlCaseListHtml;
            v61dlCaseListHtml = function (this: any, rec: any) {
                let h = o.apply(this, arguments as any);
                try {
                    const s = v61dlSumOf(rec);
                    if (h && s && s.dq != null && s.rem < 0) {
                        const over = v61dlQtyTxt(-s.rem, s.u), dq = v61dlQtyTxt(s.dq, s.u), sum = v61dlQtyTxt(s.sum, s.u);
                        const t = M(`合計 ${sum}（商談の記録の ${dq} より ${over} 多い）`, `Total ${sum} (${over} more than the ${dq} in the meeting record)`, `合计 ${sum}（比商谈记录的 ${dq} 多 ${over}）`, `Total ${sum} (${over} más que los ${dq} del registro)`);
                        h = String(h).replace(/(<b class="v61dlsum">)[\s\S]*?(<\/b>)/, (m: string, a: string, b: string) => a + E(t) + b);
                    }
                }
                catch (e) { warn("dlsum", e); }
                return h;
            };
        }
    }
    catch (e) { warn("dl", e); }

    /* ── (4) food-M05：商談の記録・やりとりがある相手をバイヤー一覧から削除しても、記録から行が作り直されて一覧に残る（件数も変わらない）
          → 削除した相手は一覧から外す（商談の記録そのものは残る）。ゴミ箱から戻す・同じ相手の商談をもう一度記録すると、また一覧に出る */
    const hidStore = (): any[] => { const t = ten(); if (t) { if (!Array.isArray(t.v92r4bHid)) t.v92r4bHid = []; return t.v92r4bHid; } W.__v92r4bHid = W.__v92r4bHid || []; return W.__v92r4bHid; };
    const hidRead = (): any[] => { const t = ten(); return (t ? t.v92r4bHid : W.__v92r4bHid) || []; };
    const hidKeysOf = (r: any): string[] => { const nm = norm(r.name || (r.base && r.base.co) || ""), c = r.cty || (r.base && r.base.cty) || ""; const K = [String(r.key || "")]; if (nm) { K.push("nm:" + nm + "|" + c); K.push("nm:" + nm + "|"); } if (r.my && r.my.id) K.push("my:" + r.my.id); return K.filter((k, i) => k && K.indexOf(k) === i); };
    const unhide = (test: (h: any) => boolean) => { try { const t = ten(); const L = hidRead(); if (!L.length) return; const N = L.filter((h: any) => !test(h)); if (N.length !== L.length) { if (t) t.v92r4bHid = N; else W.__v92r4bHid = N; save(); } } catch (e) { } };
    try {
        if (typeof b30Collect === "function") {
            const o = b30Collect;
            b30Collect = function (this: any) {
                const L = o.apply(this, arguments as any);
                try {
                    const H = hidRead();
                    if (!H.length || !Array.isArray(L)) return L;
                    const set: any = {};
                    H.forEach((h: any) => (h.k || []).forEach((k: string) => { set[k] = 1; }));
                    return L.filter((r: any) => !(r && !r.my && set[String(r.key)]));
                }
                catch (e) { return L; }
            };
        }
        if (typeof b30Remove === "function") {
            const o = b30Remove;
            b30Remove = function (this: any, key: string) {
                let r0: any = null, keys: string[] = [], nm = "";
                try { r0 = b30Find(key); if (r0) { keys = hidKeysOf(r0); nm = r0.name || ""; } } catch (e) { }
                const had = !!(r0 && ((r0.fbs && r0.fbs.length) || (r0.ths && r0.ths.length) || (r0.logs && r0.logs.length)));
                const r = o.apply(this, arguments as any);
                try {
                    if (r0 && had) {
                        let still: any = null, gone = false;
                        try { const L = b30Collect(); still = L.find((x: any) => keys.indexOf(String(x.key)) >= 0) || null; gone = !L.some((x: any) => x.key === key && x.my); } catch (e) { }
                        if (gone && still) {
                            hidStore().push({ k: keys, n: nm, at: Date.now() });
                            save();
                            try { render(); } catch (e) { }
                            try { toast(M(`「${nm}」を一覧から外しました（商談の記録・やりとりは残っています。ゴミ箱から元に戻せます）`, `Removed "${nm}" from the list (its meeting records and messages are kept; you can restore it from Trash)`, `已将「${nm}」从列表中移除（商谈记录和往来仍保留，可从回收站恢复）`, `Se quitó "${nm}" de la lista (sus registros y mensajes se conservan; puede restaurarlo desde la Papelera)`)); } catch (e) { }
                        }
                    }
                }
                catch (e) { warn("b30rm", e); }
                return r;
            };
        }
        if (typeof V33TR !== "undefined" && V33TR && V33TR.restore && typeof V33TR.restore.myb === "function") {
            const o = V33TR.restore.myb;
            V33TR.restore.myb = function (this: any, e: any) {
                const r = o.apply(this, arguments as any);
                try { const b = e && e.data && e.data.b; if (b && r !== false) { const nm = norm(b.co || b.name || ""); unhide((h) => (h.k || []).some((k: string) => k === "my:" + b.id || (nm && k.indexOf("nm:" + nm + "|") === 0))); } } catch (x) { }
                return r;
            };
        }
        if (typeof dealSave === "function") {
            const o = dealSave;
            dealSave = function (this: any) {
                try { const el: any = document.getElementById("dfB"); const nm = el ? norm(el.value) : ""; if (nm) unhide((h) => (h.k || []).some((k: string) => k.indexOf("nm:" + nm + "|") === 0)); } catch (e) { }
                return o.apply(this, arguments as any);
            };
        }
    }
    catch (e) { warn("hid", e); }

    /* ── (5) medical-N12：国を確定し直しても、見本の出荷行（想定の相手）が前の国のまま残る（自分の案件を開いている間に国を変えたとき）
          → 見本の行は、確定のたびに作り直される見本の案件（D.ship）に合わせる。手を入れた行・自分の案件には触らない */
    try {
        if (typeof shipEnsure === "function") {
            const o = shipEnsure;
            shipEnsure = function (this: any) {
                try {
                    const d = dd();
                    if (d && d.ship && typeof SHIPS !== "undefined" && SHIPS && SHIPS[0] && SHIPS[0].seed && !SHIPS[0].custom && SHIPS._pid === PID && SHIPA !== 0 && SHIPS[SHIPA] && SHIPS[SHIPA].custom) {
                        const s0 = SHIPS[0].ship, fresh = d.ship;
                        if (fresh !== SHIPS[SHIPA].ship && fresh !== s0 && /^（想定）/.test(String(fresh.buyer || "")) && !fresh.poNo && !Object.keys(SHIPS[0].mods || {}).length) SHIPS[0].ship = fresh;
                    }
                }
                catch (e) { warn("seed", e); }
                const r = o.apply(this, arguments as any);
                try {
                    const t = ten();
                    if (t && (t.src === "upload" || t.src === "sample2") && Array.isArray(t.targets) && t.targets.length && typeof SHIPS !== "undefined" && SHIPS && SHIPS[0] && SHIPS[0].seed && !SHIPS[0].custom && SHIPA !== 0 && !Object.keys(SHIPS[0].mods || {}).length) {
                        const s0 = SHIPS[0].ship;
                        if (s0 && /^（想定）/.test(String(s0.buyer || "")) && !s0.poNo && t.targets.indexOf(s0.country) < 0 && typeof tenantToD === "function" && !API._seedBusy) {
                            API._seedBusy = 1;
                            try { const f = tenantToD(t); if (f && f.ship && /^（想定）/.test(String(f.ship.buyer || "")) && t.targets.indexOf(f.ship.country) >= 0) { Object.keys(s0).forEach((k) => { if (/^v\d/.test(k) && f.ship[k] === undefined) f.ship[k] = s0[k]; }); SHIPS[0].ship = f.ship; } } finally { API._seedBusy = 0; }
                        }
                    }
                }
                catch (e) { warn("seed2", e); }
                return r;
            };
        }
    }
    catch (e) { warn("ship", e); }

    /* ── (6) medical-M02 の残り：商談の記録から作っただけの1行目が、タスクの「この案件で起きたこと」に「送信」と出る →「記録」 */
    try {
        if (typeof l30Events === "function") {
            const o = l30Events;
            l30Events = function (this: any) {
                const L = o.apply(this, arguments as any);
                try { (L || []).forEach((e: any) => { if (e && e.src === "直接連絡" && /：送信「商談の記録（\d{4}-/.test(String(e.txt || ""))) { e.txt = String(e.txt).replace("：送信「商談の記録（", "：" + M("記録", "Logged", "记录", "Registro") + "「商談の記録（"); e.src = "商談記録"; } }); } catch (e) { }
                return L;
            };
        }
    }
    catch (e) { warn("l30", e); }

    /* ── (7) other-M07・health-M11：見積書をまだ出していないのに、見本の案件から写した値のままの下書きの金額が「見積金額」に入る
          → 数量・単価が見本から写した値のままの下書き（S.v54copy）は金額に入れず、別に件数だけ書く */
    try {
        if (typeof dashAgg === "function") {
            const o = dashAgg;
            dashAgg = function (this: any) {
                const A = o.apply(this, arguments as any);
                try {
                    if (A && Array.isArray(A.quotes) && A.quotes.length && typeof v68CaseByNo === "function") {
                        const isCopy = (q: any) => { try { const c = v68CaseByNo(q.no); const S = c && c.ship; return !!(S && S.v54copy && !S.poNo); } catch (e) { return false; } };
                        const keep = A.quotes.filter((q: any) => !isCopy(q));
                        A.v92r4bDraft = A.quotes.length - keep.length;
                        if (A.v92r4bDraft) { A.quotes = keep; A.qmoney = (typeof dashMoney === "function") ? dashMoney(keep) : A.qmoney; }
                    }
                }
                catch (e) { warn("agg", e); }
                return A;
            };
        }
        if (typeof vDash === "function") {
            const o = vDash;
            vDash = function (this: any) {
                let h = o.apply(this, arguments as any);
                try {
                    const A = dashAgg(dashScopeUnits());
                    const n = (A && A.v92r4bDraft) || 0;
                    if (n && typeof h === "string") {
                        const a = h.indexOf('id="v68qkd">'), b = a >= 0 ? h.indexOf("</div>", a) : -1;
                        if (b > a) {
                            const t = M(`ほかに、見積書の下書き ${n}件（数量・単価が見本の案件から写した値のまま）は、金額に入れていません`, `${n} draft quote(s) whose quantity and unit price are still copied from the sample case are not included`, `另有 ${n} 份报价草稿（数量和单价仍是从示例案件复制的值）未计入金额`, `Además hay ${n} borrador(es) de cotización con cantidad y precio copiados del caso de muestra; no se incluyen`);
                            h = h.slice(0, b) + `<br><span class="nn v92r4b-draft" data-noi18n style="margin:0">${E(t)}</span>` + h.slice(b);
                        }
                    }
                }
                catch (e) { warn("vdash", e); }
                return h;
            };
        }
    }
    catch (e) { warn("quote", e); }
    try {
        if (typeof v90anaDashNotes === "function") {
            const o = v90anaDashNotes;
            v90anaDashNotes = function (this: any) {
                let h = o.apply(this, arguments as any);
                try { if (typeof h === "string") h = h.replace("（まだ相手に送っていない下書きも入ります。件数は商談の記録、金額は見積書から数えるので、0件でも金額が出ることがあります）", "（まだ相手に送っていない下書きも入ります。ただし、数量・単価が見本の案件から写した値のままの下書きは入れません。件数は商談の記録、金額は見積書から数えるので、0件でも金額が出ることがあります）"); } catch (e) { }
                return h;
            };
        }
    }
    catch (e) { warn("dnote", e); }

    /* ── (8) other-M08：商品の建値を CIF にすると、FOB と書いてある価格表を「CIF ¥1,150」と呼んで先方の CIF 希望と比べる
          → 価格表に建値が書いてあるとき（例：「（FOB 博多・税抜）」）は、その建値で比べる。商品の建値と違うことも書く（今ある「建値が違います」の注意がそのまま出る） */
    const tableInco = (): string => {
        try {
            const d = dd() || {}, t = ten() || {};
            const S: string[] = [];
            const add = (x: any) => { if (x == null) return; if (Array.isArray(x)) x.forEach(add); else if (typeof x === "string") S.push(x); };
            add(d.priceRows); add(d.priceHead); add(d.priceHdr); add(d.priceNote); add(t.priceRows); add(t.priceHead); add(t.priceNote); add(t.price);
            const found: any = {};
            const re = /(?:^|[^A-Za-z])(EXW|FCA|CPT|CIP|DAP|DPU|DDP|FAS|FOB|CFR|CIF|C&F|CNF)(?![A-Za-z])/gi;
            S.forEach((s) => { const u = String(s).normalize("NFKC"); let m; re.lastIndex = 0; while ((m = re.exec(u))) { const c = v56dIncoCode(m[1]); if (c) found[c] = 1; } });
            const K = Object.keys(found);
            return K.length === 1 ? K[0] : "";
        }
        catch (e) { return ""; }
    };
    API.tableInco = tableInco;
    try {
        if (typeof v56dCmp === "function") {
            const o = v56dCmp;
            v56dCmp = function (this: any) {
                const c = o.apply(this, arguments as any);
                try { if (c) { const ti = tableInco(); if (ti && c.ot && ti !== c.ot) { c.v92r4bProdInco = c.ot; c.ot = ti; } else if (ti && !c.ot) c.ot = ti; } } catch (e) { }
                return c;
            };
        }
        const noteOf = (c: any) => (c && c.v92r4bProdInco) ? M(`自社の価格表は ${c.ot} の価格です（価格表に書いてある建値。商品情報の建値は ${c.v92r4bProdInco} ですが、価格表の金額は ${c.ot} のままです）。`, `Your price list is in ${c.ot} terms (as written on the list; the product's trade term is set to ${c.v92r4bProdInco}, but the listed prices are still ${c.ot}).`, `贵司价格表是 ${c.ot} 价格（价格表上写明的贸易条件。商品信息的贸易条件为 ${c.v92r4bProdInco}，但价格表金额仍为 ${c.ot}）。`, `Su lista de precios está en ${c.ot} (según la lista; el término del producto es ${c.v92r4bProdInco}, pero los precios siguen en ${c.ot}).`) : "";
        if (typeof v56dCmpHtml === "function") { const o = v56dCmpHtml; v56dCmpHtml = function (this: any, c: any) { let h = o.apply(this, arguments as any); try { const n = noteOf(c); if (n && h) h += `<br><span class="nn" data-noi18n style="margin:0">${E(n)}</span>`; } catch (e) { } return h; }; }
        if (typeof v56dCmpPlain === "function") { const o = v56dCmpPlain; v56dCmpPlain = function (this: any, c: any) { let h = o.apply(this, arguments as any); try { const n = noteOf(c); if (n && h) h += "\n" + n; } catch (e) { } return h; }; }
    }
    catch (e) { warn("cmp", e); }

    /* ── (9) auto-M05・food-M04：取り込んだ情報の 🗑 → ゴミ箱に入れる（30日以内なら元に戻せる）。大きすぎて入らないときだけ、今までの「元に戻せません」の確かめ */
    try {
        if (typeof V33TR !== "undefined" && V33TR && V33TR.restore) {
            V33TR.restore.src = function (e: any) {
                try {
                    const x = e && e.data && e.data.x;
                    if (!x) return false;
                    const L = srcList();
                    if (L.some((y: any) => y && ((x.id && y.id === x.id) || (!x.id && y.name === x.name)))) return true;
                    const i = Math.max(0, Math.min(L.length, +e.data.i || 0));
                    L.splice(i, 0, x);
                    srcSave();
                    try { render(); } catch (z) { }
                    return true;
                }
                catch (z) { return false; }
            };
            if (V33TR.label && !V33TR.label.src) V33TR.label.src = "取り込んだ情報";
        }
        window.addEventListener("click", (ev: any) => {
            try {
                const b = ev.target && ev.target.closest ? ev.target.closest("[data-srcdel]") : null;
                if (!b || b.dataset.r3aok) return;
                const idx = +b.dataset.srcdel;
                const x = (typeof srcList === "function") ? srcList()[idx] : null;
                if (!x || typeof v33TrashPut !== "function" || typeof V33TR === "undefined") return;
                let js = "";
                try { js = JSON.stringify(x); } catch (e) { js = ""; }
                if (!js || js.length > 300000) return; // 大きい資料は今までの確かめ（r3a）へ
                const nm = String(x.name || "");
                const ok = window.confirm(M(`「${nm}」を、取り込んだ情報から削除しますか？\n\n・AI商社マンの参照から外れます\n・ゴミ箱に入ります（30日以内なら「ゴミ箱」から元に戻せます）\n・登録済みの商品情報は消えません`, `Delete "${nm}" from Imported sources?\n\n- The AI agent will stop referring to it\n- It goes to Trash (you can restore it within 30 days)\n- Registered product information is not deleted`, `要从“已导入的信息”中删除「${nm}」吗？\n\n・AI 将不再参考它\n・会放入回收站（30天内可恢复）\n・已登记的商品信息不会被删除`, `¿Eliminar "${nm}" de la información importada?\n\n- El agente dejará de consultarlo\n- Va a la Papelera (se puede restaurar en 30 días)\n- La información del producto registrada no se borra`));
                if (!ok) { ev.preventDefault(); ev.stopImmediatePropagation(); ev.stopPropagation(); return; }
                b.dataset.r3aok = "1";
                const tid = v33TrashPut("src", x.id || nm, M("取り込んだ情報：", "Imported source: ", "已导入的信息：", "Fuente importada: ") + nm, { x: JSON.parse(js), i: idx });
                try { if (typeof V33AU_ACT !== "undefined" && V33AU_ACT && V33AU_ACT.src_del && typeof v33AuLog === "function") v33AuLog("src_del", nm); } catch (e) { }
                setTimeout(() => { try { if (tid && typeof v33Undo === "function") v33Undo(M(`「${nm}」をゴミ箱に移しました`, `Moved "${nm}" to Trash`, `已将「${nm}」移入回收站`, `"${nm}" se movió a la Papelera`), () => { v33TrashRestore(tid); }, 10000); } catch (e) { } }, 60);
            }
            catch (e) { warn("srcdel", e); }
        }, true);
    }
    catch (e) { warn("src", e); }
})();

/* ── 2つ目のかたまり：入り直し・書き出しの対応表・返信案の宛名・目標と道筋・多言語の辞書 ── */
declare let showWelcome: any, v68ExpMapHtml: any, bmOfflineAdvice: any, v72TplDraft: any, v72Prep: any, v88Sig: any, v90goalRealHtml: any;
declare const BM: any, V68_EXP_MAP: any, V33IXV: any, V38: any;
declare let vInbox33: any, openDMThread: any, v68hearNeed: any;
declare const V68H_TX: any;
declare let fwdSituFor: any, openFwdQuote: any, v56regFillNote: any;
declare const V56REG_FILL: any;
declare function go(id: string): void;
declare function fmtJPY(n: any): string;
(function () {
    const W: any = window;
    if (W.__v2192r4b2) return;
    W.__v2192r4b2 = 1;
    const API: any = (W.v92r4b = W.v92r4b || {});
    const M = API.M || ((ja: string) => ja);
    const E = (s: any) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]));
    const warn = (k: string, e: any) => { try { console.warn("[v92r4b] " + k, e); } catch (x) { } };
    const ten = () => { try { return (typeof TEN !== "undefined" && TEN) ? TEN : null; } catch (e) { return null; } };
    const dd = () => { try { return (typeof D !== "undefined" && D) ? D : null; } catch (e) { return null; } };
    /* 刷新版の層が出す日本語の文の訳（辞書に足す） */
    const dict = (ja: string, en: string, zh?: string, es?: string) => { try { if (typeof I18N === "undefined" || !I18N || !I18N.dict) return; const DI = I18N.dict; if (DI.en && DI.en[ja] == null) DI.en[ja] = en; if (DI.zh && DI.zh[ja] == null) DI.zh[ja] = zh || en; if (DI.es && DI.es[ja] == null) DI.es[ja] = es || en; } catch (e) { } };
    API.dict = dict;
    dict("メンバーの招待・担当する商品の割り当て・役割の変更・停止・削除。すべての商品と案件を扱えます", "Invite members, assign products, change roles, suspend and delete. Can work on every product and case", "邀请成员、分配负责的商品、更改角色、停用和删除。可处理所有商品和案件", "Invitar miembros, asignar productos, cambiar roles, suspender y eliminar. Puede trabajar en todos los productos y casos");
    dict("担当する商品の案件を見る・やりとりに投稿する（担当する商品は、招待のときに管理者が選びます）", "View the cases of the assigned products and post messages (the admin chooses the assigned products when inviting)", "查看所负责商品的案件并在往来中发言（负责的商品由管理员在邀请时选择）", "Ver los casos de los productos asignados y publicar mensajes (el administrador elige los productos al invitar)");

    /* ── (10) other-M04：見本（業種サンプル）で使っているアカウントは、案件・商談があっても、入り直すたびに「はじめまして」と「商品情報を登録」から始まる
          → 商談の記録・やりとり・自分で足したバイヤーが1件でもあれば、ようこそは出さず、ホーム（案件）から始める */
    const hasWork = (): boolean => {
        try {
            const L: any[] = (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS : [];
            const wk = (t: any) => !!t && (t.src === "upload" || t.src === "sample2") && (((Array.isArray(t.fbx) ? t.fbx.length : 0) > 0) || (t.dmThreads && Object.keys(t.dmThreads).length > 0) || (Array.isArray(t.myBuyers) && t.myBuyers.length > 0));
            if (L.some(wk)) return true;
            const t = ten(), d = dd();
            return !!(t && (t.src === "upload" || t.src === "sample2") && d && Array.isArray(d.fb) && d.fb.length);
        }
        catch (e) { return false; }
    };
    API.hasWork = hasWork;
    try {
        if (typeof showWelcome === "function") {
            const o = showWelcome;
            showWelcome = function (this: any) {
                try {
                    if (!(typeof SES !== "undefined" && SES && (SES.role === "fwd" || SES.t === "fwd" || SES.t === "admin")) && hasWork()) {
                        try { if (SES && SES.code) localStorage.setItem("bc20_wel_" + SES.code, "1"); } catch (e) { }
                        const home = () => { try { if (typeof cur !== "undefined" && cur === "up" && !document.getElementById("welv")) { if (W.RDX && typeof W.RDX.goKey === "function") W.RDX.goKey("dash:home"); else go("dash"); } } catch (e) { } };
                        let touched = false;
                        const mark = () => { touched = true; };
                        try { window.addEventListener("pointerdown", mark, { capture: true, once: true }); window.addEventListener("keydown", mark, { capture: true, once: true }); } catch (e) { }
                        [60, 600, 1500].forEach((ms) => setTimeout(() => { if (!touched) home(); }, ms));
                        return;
                    }
                }
                catch (e) { warn("wel", e); }
                return o.apply(this, arguments as any);
            };
        }
    }
    catch (e) { warn("welcome", e); }
    /* 入り直しのときは、この層が読まれる前に「ようこそ」が出ている（続きのセッションは読み込みの途中で入る）→ 出ていたら閉じてホームへ */
    try {
        let touched0 = false;
        const mark0 = () => { touched0 = true; };
        try { window.addEventListener("pointerdown", mark0, { capture: true, once: true }); window.addEventListener("keydown", mark0, { capture: true, once: true }); } catch (e) { }
        const fixBoot = () => {
            try {
                if (touched0) return;
                if (typeof SES === "undefined" || !SES || SES.t !== "trial" || SES.role === "fwd") return;
                if (document.body.classList.contains("locked") || !hasWork()) return;
                const v = document.getElementById("welv");
                if (v) { try { if (SES.code) localStorage.setItem("bc20_wel_" + SES.code, "1"); } catch (e) { } v.remove(); }
                if (!API._bootHome && typeof cur !== "undefined" && cur === "up" && !document.getElementById("v1811ov")) {
                    API._bootHome = 1;
                    if (W.RDX && typeof W.RDX.goKey === "function") W.RDX.goKey("dash:home"); else go("dash");
                }
            }
            catch (e) { warn("boot", e); }
        };
        [0, 300, 900, 1800].forEach((ms) => setTimeout(fixBoot, ms));
    }
    catch (e) { warn("boot0", e); }

    /* ── (11) culture-N25：書き出しの対応表で、上の一覧にある「材質・素材表」などが「成分表・材質表（いまはデータがありません）」と出る
          → 対応表のどの行にも当たらない表のシートが1つだけあり、「成分表・材質表」の行が空のときは、そのシートの名前で出す */
    try {
        if (typeof v68ExpMapHtml === "function" && typeof V68_EXP_MAP !== "undefined") {
            const o = v68ExpMapHtml;
            v68ExpMapHtml = function (this: any, sheets: any) {
                let h = o.apply(this, arguments as any);
                try {
                    const have: string[] = Array.from(new Set((sheets || []).map((s: any) => String((s && s.name) || "")))).filter(Boolean) as string[];
                    const keys: string[] = V68_EXP_MAP.map((r: any) => String(r[0]));
                    const key = "成分表・材質表";
                    if (!have.some((x) => x === key || x.indexOf(key) === 0)) {
                        const un = have.filter((x) => !keys.some((k) => x === k || x.indexOf(k) === 0) && /(成分|材質|素材|仕様|機械情報|スペック|原材料).{0,8}表|表$/.test(x) && !/寸法|価格|梱包/.test(x));
                        if (un.length === 1 && typeof h === "string") {
                            const re = /<tr class="v68no"><td>— ([^<]*)<\/td><td>([^<]*(?:商品情報|Product info|商品信息|Información del producto)[^<]*(?:成分|Ingredients|Ingredientes)[^<]*)<span class="nn">[^<]*<\/span><\/td><\/tr>/;
                            h = h.replace(re, (m: string, a: string, b: string) => `<tr class=""><td>✅ ${E(un[0])}</td><td>${b}</td></tr>`);
                        }
                    }
                }
                catch (e) { warn("expmap", e); }
                return h;
            };
        }
    }
    catch (e) { warn("exp", e); }

    /* ── (12) food-N09 の残り：担当者名を登録していても、返信案（内蔵）の宛名が「Dear Purchasing Team,」
          → 自社で登録した相手で、担当者名が英字で入っているときは「Dear ◯◯,」にする（名前は作らない。無いときは今のまま） */
    const contactOf = (th: any): string => {
        try {
            const id = String((th && th.id) || "");
            if (!/^MY-/.test(id)) return "";
            const L: any[] = [];
            ((typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS : []).concat(ten() ? [ten()] : []).forEach((t: any) => { if (t && Array.isArray(t.myBuyers)) t.myBuyers.forEach((b: any) => L.push(b)); });
            const b = L.find((x: any) => x && x.id === id);
            let c = String((b && b.contact) || "").normalize("NFKC").trim();
            c = c.split(/[（(／\/,、<]|\s[-–—]\s/)[0].trim();
            if (!/^[A-Za-z][A-Za-z .'\-]{1,38}$/.test(c) || /@/.test(c)) return "";
            if (/^(purchasing|sales|buyer|team|manager|dept|department)\b/i.test(c)) return "";
            return c;
        }
        catch (e) { return ""; }
    };
    const dear = (s: any, nm: string) => (nm && typeof s === "string") ? s.replace(/Dear Purchasing Team,/g, "Dear " + nm + ",") : s;
    try {
        if (typeof bmOfflineAdvice === "function") {
            const o = bmOfflineAdvice;
            bmOfflineAdvice = function (this: any, th: any) {
                let h = o.apply(this, arguments as any);
                try { const nm = contactOf(th); if (nm) { h = dear(h, E(nm)); if (typeof BM !== "undefined" && BM && typeof BM.lastDraft === "string") BM.lastDraft = dear(BM.lastDraft, nm); } } catch (e) { }
                return h;
            };
        }
        let prepTh: any = null;
        if (typeof v72Prep === "function") {
            const o = v72Prep;
            v72Prep = function (this: any, id: any) {
                try { const L: any = (ten() && ten().dmThreads) || {}; prepTh = L[id] || { id }; } catch (e) { prepTh = { id }; }
                return o.apply(this, arguments as any);
            };
        }
        if (typeof v72TplDraft === "function") {
            const o = v72TplDraft;
            v72TplDraft = function (this: any) {
                const r = o.apply(this, arguments as any);
                try {
                    const nm = prepTh ? contactOf(prepTh) : "";
                    if (nm && r) {
                        if (typeof r === "string") return dear(r, nm);
                        Object.keys(r).forEach((k) => { if (typeof r[k] === "string") r[k] = dear(r[k], nm); });
                    }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { warn("dear", e); }

    /* ── (14) culture-M08：受信箱の「返信 1」を押すと、出るのは「商流を決めます」の承認の札だけ（返事がどれかが分からない）
          → その札の下に「この相手から返事が届いています」と、やりとりの窓を開くボタンを出す（札そのものは今のまま） */
    try {
        if (typeof vInbox33 === "function") {
            const o = vInbox33;
            vInbox33 = function (this: any) {
                let h = o.apply(this, arguments as any);
                try {
                    if (typeof h === "string" && typeof V33IXV !== "undefined" && V33IXV && V33IXV.f === "reply" && typeof V38 !== "undefined" && V38 && V38.lists && Array.isArray(V38.lists.f)) {
                        const L: any[] = V38.lists.f;
                        const parts = h.split('<li class="v38li');
                        if (parts.length === L.length + 1) {
                            for (let i = 0; i < L.length; i++) {
                                const x = L[i];
                                const m = x && x.k === "appr" ? /(?:^|:)th:([^:]+):/.exec(String(x.key || "")) : null;
                                if (!m || !/reply/.test(String(x.key || "").split(":").pop() || "")) continue;
                                const j = parts[i + 1].indexOf("</li>");
                                if (j < 0) continue;
                                const row = `<div class="v92r4b-rp" data-noi18n style="margin-top:6px;padding:6px 9px;border-left:3px solid var(--or,#f08300);background:var(--surface-2,#f6f7f9);border-radius:6px;font-size:12.5px"><span>↩ ${E(M("この相手から返事が届いています（まだ返していません）。上の承認とは別に、返事を読んで返信できます。", "This buyer has replied (not answered yet). Apart from the approval above, you can read the reply and answer it.", "该对象已回复（尚未答复）。除上面的批准外，可以阅读回复并作答。", "Este comprador respondió (aún sin contestar). Aparte de la aprobación de arriba, puede leer la respuesta y contestar."))}</span> <button class="btn g" type="button" data-v92r4bth="${E(m[1])}" style="margin-left:6px">${E(M("返事を読んで返信する", "Read the reply and answer", "阅读回复并作答", "Leer y responder"))}</button></div>`;
                                parts[i + 1] = parts[i + 1].slice(0, j) + row + parts[i + 1].slice(j);
                            }
                            h = parts.join('<li class="v38li');
                        }
                    }
                }
                catch (e) { warn("ixreply", e); }
                return h;
            };
        }
        document.addEventListener("click", (ev: any) => {
            try {
                const b = ev.target && ev.target.closest ? ev.target.closest("[data-v92r4bth]") : null;
                if (!b) return;
                ev.preventDefault(); ev.stopPropagation();
                if (typeof openDMThread === "function") openDMThread(b.getAttribute("data-v92r4bth"));
            }
            catch (e) { warn("ixopen", e); }
        }, true);
    }
    catch (e) { warn("inbox", e); }

    /* ── (15) indagri-M06：「リンクを登録」で URL を入れると表示名に URL が自動で入り、そこへ続けて打つと「URL＋表示名」がつながった名前になる
          → 自動で入った表示名の欄に入ったら全部を選んだ状態にする（打つと置き換わる）。自分で直した名前には何もしない */
    try {
        document.addEventListener("focusin", (ev: any) => {
            try {
                const n = ev.target;
                if (!n || n.id !== "d30ln") return;
                const u: any = document.getElementById("d30lu");
                const auto = u ? String(u.value || "").replace(/^https?:\/\//, "").slice(0, 60) : "";
                if (auto && n.value === auto) setTimeout(() => { try { n.select(); } catch (e) { } }, 0);
            }
            catch (e) { }
        }, true);
    }
    catch (e) { warn("d30ln", e); }

    /* ── (16) food-M08 の後半：商談の記録から作ったタスクの「関連・根拠」が「商談記録：Golden Harvest Tradi」と20字で切れる
          → 相手の名前を全部入れる（商談の記録にある名前。切れた20字が先頭に一致する記録があるときだけ） */
    const fixRefs = () => {
        try {
            const d = dd();
            if (!d || !Array.isArray(d.tasks) || !Array.isArray(d.fb)) return;
            let ch = 0;
            d.tasks.forEach((t: any) => {
                const m = t && typeof t.ref === "string" ? /^商談記録：(.{20})$/.exec(t.ref) : null;
                if (!m) return;
                const f = d.fb.find((r: any) => r && typeof r.b === "string" && r.b.length > 20 && r.b.slice(0, 20) === m[1]);
                if (f) { t.ref = "商談記録：" + f.b.slice(0, 80); ch++; }
            });
            if (ch) { try { if (typeof saveTen === "function") saveTen(); } catch (e) { } }
        }
        catch (e) { }
    };
    try {
        if (typeof dealSave === "function") {
            const o = dealSave;
            dealSave = function (this: any) {
                const r = o.apply(this, arguments as any);
                try { if (r && typeof r.then === "function") r.then(() => { fixRefs(); try { if (typeof cur !== "undefined" && cur === "task") render(); } catch (e) { } }, () => { }); else fixRefs(); } catch (e) { }
                return r;
            };
        }
        if (typeof render === "function") {
            const o = render;
            let seen: any = null;
            render = function (this: any) {
                try { const d = dd(); if (d && d !== seen) { seen = d; fixRefs(); } } catch (e) { }
                return o.apply(this, arguments as any);
            };
        }
    }
    catch (e) { warn("refs", e); }

    /* ── (17) culture-M09：文化・教育用品（食品でない）にも「賞味期限・保証期間」という項目名が出る
          → 文化・教育用品は「保証・品質の条件」（アパレルと同じ聞き方。今ある文を使う）。画面に残る分は刷新版の層が言い換える */
    const nonFoodShelf = (t: any) => !!t && String(t.cat || "").trim() === "文化・教育用品";
    API.nonFoodShelf = () => nonFoodShelf(ten());
    try {
        if (typeof v68hearNeed === "function" && typeof V68H_TX !== "undefined" && V68H_TX && V68H_TX.shelf && V68H_TX.shelf.apparel) {
            const o = v68hearNeed;
            v68hearNeed = function (this: any, base: any, p: any) {
                const r = o.apply(this, arguments as any);
                try {
                    if (base && base.k === "shelf" && r && r.n === "賞味期限・保証期間" && nonFoodShelf(p)) { const a = V68H_TX.shelf.apparel; return Object.assign({}, r, { n: a.n, q: a.q, ex: a.ex }); }
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { warn("shelf", e); }

    /* ── (18) cross-18 の残り：内蔵の情勢メモが「8〜10月が繁忙期」のように時期を書いているのに、時期外（11月など）でも所要日数に「情勢見込み +2日」を足している
          → 時期の書いてある内蔵のメモは、時期外のあいだは日数に足さない（メモの文は残し、足していないことを書く）。時期の無いメモ・物流会社が登録したメモは今のまま */
    try {
        if (typeof fwdSituFor === "function") {
            const o = fwdSituFor;
            fwdSituFor = function (this: any) {
                const L = o.apply(this, arguments as any);
                try {
                    const mo = new Date().getMonth() + 1;
                    (L || []).forEach((x: any) => {
                        if (!x || x.src !== "内蔵" || !(+x.delay > 0)) return;
                        const t = String(x.t || "");
                        const m = /(\d{1,2})\s*〜\s*(\d{1,2})月/.exec(t);
                        if (!m) return;
                        const a = +m[1], b = +m[2];
                        if (!(a >= 1 && a <= 12 && b >= 1 && b <= 12)) return;
                        const off = a <= b ? (mo < a || mo > b) : (mo < a && mo > b);
                        if (!off) return;
                        const d = +x.delay;
                        x.delay = 0;
                        x.v92r4bOff = d;
                        if (t.indexOf("日数には足していません") < 0) x.t = t + M(`（いまは時期外のため、見込みの +${d}日は所要日数に足していません）`, ` (out of season now, so the expected +${d} days are not added to the transit time)`, `（目前为淡季，预计的 +${d} 天未计入所需天数）`, ` (fuera de temporada: los +${d} días previstos no se suman al tránsito)`);
                    });
                }
                catch (e) { }
                return L;
            };
        }
    }
    catch (e) { warn("situ", e); }
    /* 前に組んだ見積（繁忙期のうちに組んだもの）の窓：メモは「時期外」と言い、日数には +2日が入ったまま → その +2日がいつのものかを書く */
    try {
        if (typeof openFwdQuote === "function") {
            const o = openFwdQuote;
            openFwdQuote = function (this: any) {
                const r = o.apply(this, arguments as any);
                const fix = () => {
                    try {
                        const pn = document.getElementById("pn") || document.getElementById("dw");
                        if (!pn) return;
                        const tw = document.createTreeWalker(pn, NodeFilter.SHOW_TEXT);
                        let n: any;
                        while ((n = tw.nextNode())) {
                            const v = String(n.nodeValue || "");
                            if (/時期外/.test(v) && /（\+\d+日見込み）/.test(v))
                                n.nodeValue = v.replace(/（\+(\d+)日見込み）/, (m: string, d: string) => M(`（この見積の日数に入っている +${d}日は、見積を組んだ日の見込みです。いまは時期外のため、これから組む見積の日数には足しません）`, ` (the +${d} days in this quote were the estimate on the day it was built; out of season now, so new quotes do not add them)`, `（本报价天数中的 +${d} 天是报价当日的预计。目前为淡季，今后生成的报价不再加算）`, ` (los +${d} días de esta cotización eran la previsión del día en que se generó; ahora fuera de temporada, no se suman en las nuevas)`));
                        }
                    }
                    catch (e) { }
                };
                try { fix(); setTimeout(fix, 400); } catch (e) { }
                return r;
            };
        }
    }
    catch (e) { warn("fq", e); }

    /* ── (19) culture-N23 の残り：トライアルなのに、ヒアリングの答えが「STANDAGEの担当（FS）が、国ごとに次の日までに調べ…」（同じ答えの中に「通知は行われません」）
          → トライアルでは、タスクの言い方（「規制を調べる」で自社で確かめる。STANDAGE への調査の依頼もそこから）にそろえる。日付はタスクの期限のまま */
    try {
        if (typeof v56regFillNote === "function" && typeof V56REG_FILL !== "undefined") {
            const o = v56regFillNote;
            v56regFillNote = function (this: any) {
                let h = o.apply(this, arguments as any);
                try {
                    if (typeof h === "string" && typeof SES !== "undefined" && SES && SES.t === "trial") {
                        const key = E(V56REG_FILL.whoP), a = h.indexOf(key);
                        const b = a >= 0 ? h.indexOf("。", a + key.length) : -1;
                        if (a >= 0 && b > a) {
                            const due = h.slice(a + key.length, b);
                            const t = M(`トライアルでは、STANDAGE の担当への調査の依頼は出ていません。国ごとの調査のタスクを「タスク・進行」に入れました（期限の目安：`, `In the trial, no research request has been sent to STANDAGE staff. A research task per country was added to "Tasks" (target dates: `, `试用期间不会向 STANDAGE 负责人发出调查委托。已在“任务・进度”中按国家添加调查任务（期限参考：`, `En la prueba no se envía la solicitud al personal de STANDAGE. Se añadió una tarea por país en "Tareas" (fechas: `)
                                + due + M(`）。「規制を調べる」で自社で確かめられます（STANDAGE への調査の依頼も、その画面から）`, `). You can check them yourself in "Check regulations" (a request to STANDAGE can also be made there)`, `）。可在“调查法规”中自行确认（也可从该页面委托 STANDAGE 调查）`, `). Puede comprobarlo en "Consultar regulaciones" (también puede pedirlo a STANDAGE desde allí)`);
                            h = h.slice(0, a) + `<span data-noi18n>${t}</span>` + h.slice(b);
                            const tr = E(V56REG_FILL.trial);
                            h = h.replace(`<br><span style="color:var(--ink-3);font-size:11px">${tr}</span>`, "");
                        }
                    }
                }
                catch (e) { warn("regfill", e); }
                return h;
            };
        }
    }
    catch (e) { warn("n23", e); }

    /* ── (13) indagri-N12：完成形の見本の「目標と道筋」
          ・「商談・やりとりのある相手 24社」：見本の商談の記録は相手の名前が取れず、1件ごとに別の相手として数えていた → バイヤー一覧と同じ数（商談の記録・やりとりのある相手）に
          ・1社あたりの推定額（単価×MOQ×年4回）が、受注の実績より小さい → 推定の説明の下に、分析・レポートの受注の実績（件数・合計・1件あたり）を参考として出す（推定の計算は変えない） */
    try {
        if (typeof v88Sig === "function") {
            const o = v88Sig;
            v88Sig = function (this: any) {
                const s = o.apply(this, arguments as any);
                try {
                    const t = ten();
                    if (t && t.src === "sample" && typeof b30Collect === "function") {
                        const n = (b30Collect() || []).filter((r: any) => r && ((r.fbs && r.fbs.length) || (r.ths && r.ths.length))).length;
                        if (n > 0 && n < (s.met | 0)) s.met = n;
                    }
                }
                catch (e) { }
                return s;
            };
        }
        if (typeof v90goalRealHtml === "function") {
            const o = v90goalRealHtml;
            v90goalRealHtml = function (this: any, pl: any) {
                let h = o.apply(this, arguments as any);
                try {
                    if (h && pl && pl.per && pl.per.src !== "input" && typeof dashAgg === "function") {
                        const A = dashAgg(dashScopeUnits());
                        const n = (A && A.orders && A.orders.length) || 0;
                        const m = n && typeof dashMoney === "function" ? dashMoney(A.orders) : null;
                        if (n && m && m.jpy > 0 && typeof fmtJPY === "function") {
                            const t = M(`参考：分析・レポートの受注の実績は ${n}件・合計 ${fmtJPY(m.jpy)}（1件あたり 約 ${fmtJPY(Math.round(m.jpy / n))}）です。1社あたりの額を実績に合わせて入れ直すと、必要な社数が変わります（「目標を直す」から）`, `For reference: confirmed orders so far are ${n}, total ${fmtJPY(m.jpy)} (about ${fmtJPY(Math.round(m.jpy / n))} each). Re-entering the per-buyer amount to match changes the number of buyers needed ("Edit the goal")`, `参考：分析报告中的订单实绩为 ${n} 件，合计 ${fmtJPY(m.jpy)}（每件约 ${fmtJPY(Math.round(m.jpy / n))}）。按实绩重新填写每家金额后，所需家数会变化（从“修改目标”）`, `Referencia: pedidos confirmados ${n}, total ${fmtJPY(m.jpy)} (aprox. ${fmtJPY(Math.round(m.jpy / n))} cada uno). Si ajusta el importe por comprador, cambia el número necesario ("Editar el objetivo")`);
                            const key = "1社あたりの取引額が推定・仮の値です。実際の額が大きければ、必要な社数はその分だけ減ります";
                            const keyEn = "The per-buyer amount is an estimate; a larger real amount reduces the buyers needed";
                            const ins = `<br><span class="v92r4b-ref" data-noi18n>${E(t)}</span>`;
                            if (h.indexOf(key) >= 0) h = h.replace(key, key + ins);
                            else if (h.indexOf(keyEn) >= 0) h = h.replace(keyEn, keyEn + ins);
                        }
                    }
                }
                catch (e) { warn("goal", e); }
                return h;
            };
        }
    }
    catch (e) { warn("rm", e); }
})();
