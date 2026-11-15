(function () {
    const W = window;
    if (W.__v2192fwd)
        return;
    const V92F = W.__v2192fwd = { ver: "21.92", err: [], snap: null, last: null, undo: null, imp: null, n: {} };
    const err = (k, e) => {
        try {
            V92F.err.push(k + ": " + String((e && e.message) || e).slice(0, 200));
            if (V92F.err.length > 40)
                V92F.err.shift();
        }
        catch (x) { }
    };
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const lang = () => {
        try {
            return (typeof I18N !== "undefined" && I18N && I18N.lang) || "ja";
        }
        catch (e) {
            return "ja";
        }
    };
    const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? (en || ja) : l === "zh" ? (zh || en || ja) : l === "es" ? (es || en || ja) : ja; };
    const Y = (n) => "¥" + Math.round(+n || 0).toLocaleString();
    const UP = (s) => String(s || "").toUpperCase();
    const on = () => {
        try {
            return typeof FWDON !== "undefined" && !!FWDON && typeof FWDB !== "undefined" && !!FWDB;
        }
        catch (e) {
            return false;
        }
    };
    const fvMode = () => {
        try {
            return on() && FWDB.f2l === 1 && FWDB.fv === 1;
        }
        catch (e) {
            return false;
        }
    };
    const realMode = () => {
        try {
            return fvMode() && FWDB.w === "real";
        }
        catch (e) {
            return false;
        }
    };
    const me = () => {
        try {
            return (typeof fwdCo === "function") ? fwdCo() : String((FWDB && FWDB.profile && FWDB.profile.co) || "");
        }
        catch (e) {
            return "";
        }
    };
    const today = () => {
        try {
            if (typeof TODAYS !== "undefined" && TODAYS)
                return String(TODAYS).slice(0, 10);
        }
        catch (e) { }
        const d = new Date();
        return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    };
    const polKey = (s) => {
        try {
            if (typeof v56shipPolKey === "function")
                return v56shipPolKey(s);
        }
        catch (e) { }
        return String(s || "").replace(/\s+/g, "").replace(/(?:国際)?(?:空港|港)$/, "").toLowerCase();
    };
    const isAir = (m) => /AIR|COURIER/.test(UP(m));
    const isAirM = (m) => /AIR/.test(UP(m));
    const valid = (r) => {
        try {
            return typeof fwdRateValid === "function" ? !!fwdRateValid(r) : true;
        }
        catch (e) {
            return true;
        }
    };
    const say = (m) => {
        try {
            if (typeof toast === "function")
                toast(m);
        }
        catch (e) { }
    };
    const coOf = (x) => String((x && x.co) || (FWDB && FWDB.profile && FWDB.profile.co) || "");
    function ctxOf(r) {
        try {
            if (typeof V56SHIP === "undefined" || !r || !r.pol)
                return null;
            const term = String(r.term || "");
            const code = (typeof v56shipTermCode === "function") ? v56shipTermCode(term) : "";
            return { pol: String(r.pol), polKey: polKey(r.pol), code, fob: code === "FOB", term, cty: r.cty || "" };
        }
        catch (e) {
            return null;
        }
    }
    function withCtx(r, fn) {
        if (typeof V56SHIP === "undefined" || !V56SHIP || V56SHIP.req)
            return fn();
        const c = ctxOf(r);
        if (!c)
            return fn();
        V56SHIP.req = c;
        try {
            return fn();
        }
        finally {
            V56SHIP.req = null;
        }
    }
    function withCargo(r, fn) {
        if (typeof V60 === "undefined" || !V60)
            return fn();
        const keep = V60.ctx;
        let pk = r.pack || "";
        try {
            if (!pk && typeof v60PackOf === "function")
                pk = v60PackOf(r.cargo);
        }
        catch (e) { }
        V60.ctx = { weight: +r.weight || 0, pack: pk, cartons: +r.cartons || 0, cbm: +r.cbm || 0, mode: r.mode || "", pol: r.pol || "" };
        try {
            return fn();
        }
        finally {
            V60.ctx = keep;
        }
    }
    const legPod = (l) => l.pod || ((typeof FWD_POD !== "undefined" && FWD_POD) ? FWD_POD[l.cty] : "") || l.cty;
    function buildLeg(r, l) { return withCtx(r, () => withCargo(r, () => fwdLegBuild(l.cty, legPod(l), r.mode, r.cbm || 2, r.etd || "", r.toCo || ""))); }
    const podsOf = (l) => [...new Set([l.pod, l.cty, (typeof FWD_POD !== "undefined" && FWD_POD) ? FWD_POD[l.cty] : "", l.v802pod].filter(Boolean).map(String))];
    const podHit = (x, pods) => { const P = String((x && x.pod) || ""), N = String((x && x.note) || ""); return pods.some(p => P === p || (!!P && (P.includes(p) || p.includes(P))) || N.includes(p)); };
    const rKey = (x) => [coOf(x), String(x.pol || ""), String(x.pod || ""), UP(x.mode), x.dfw ? "d" + x.dfw : ""].join("|");
    const rSig = (x) => [+x.price || 0, x.cur || "", x.unit || "", x.tt == null ? "" : x.tt, x.valid || "", x.note || "", valid(x) ? 1 : 0].join("|");
    function snap() {
        try {
            if (!on())
                return;
            V92F.snap = { rates: JSON.parse(JSON.stringify((FWDB.rates || []).filter(Boolean))), situ: JSON.parse(JSON.stringify((FWDB.situ || []).filter(Boolean))), at: Date.now() };
        }
        catch (e) {
            err("snap", e);
        }
    }
    function diff() {
        const S = V92F.snap;
        if (!S)
            return null;
        const grp = (R) => {
            const m = new Map();
            (R || []).forEach(x => {
                if (!x)
                    return;
                const k = rKey(x);
                if (!m.has(k))
                    m.set(k, []);
                m.get(k).push(x);
            });
            return m;
        };
        const sg = (a) => (a || []).map(rSig).sort().join(";");
        const A = grp(S.rates), B = grp(FWDB.rates || []);
        const rates = [];
        new Set([...A.keys(), ...B.keys()]).forEach(k => {
            const a = A.get(k) || [], b = B.get(k) || [];
            if (sg(a) !== sg(b))
                rates.push({ k, o: a[0] || null, n: b[b.length - 1] || null });
        });
        const sm = (L) => {
            const m = new Map();
            (L || []).forEach(x => {
                if (x && x.id)
                    m.set(String(x.id), x);
            });
            return m;
        };
        const SA = sm(S.situ), SB = sm(FWDB.situ || []);
        const situ = [];
        const ss = (x) => x ? [x.reg, x.t, x.delay, x.risk].join("|") : "";
        new Set([...SA.keys(), ...SB.keys()]).forEach(k => {
            if (ss(SA.get(k)) !== ss(SB.get(k)))
                situ.push(SB.get(k) || SA.get(k));
        });
        return { rates, situ, prev: S.rates, now: (FWDB.rates || []).filter(Boolean) };
    }
    function legTouched(r, l, CH) {
        try {
            if (CH.situ.length) {
                const s = String(l.cty || "") + " " + String(l.pod || "");
                if (CH.situ.some((x) => String((x && x.reg) || "").split(/[|｜、,\s]+/).filter(Boolean).some(k => s.includes(k))))
                    return true;
            }
            const c = ctxOf(r), airReq = isAirM(r.mode), pods = podsOf(l);
            for (const ch of CH.rates) {
                for (const x of [ch.o, ch.n]) {
                    if (!x)
                        continue;
                    const co = coOf(x);
                    if ((l.offers || []).some((o) => o && o.co === co && o.rate && String(o.rate.pol) === String(x.pol) && String(o.rate.pod) === String(x.pod) && UP(o.rate.mode) === UP(x.mode)))
                        return true;
                    if (r.toCo && co !== r.toCo)
                        continue;
                    const xa = isAir(x.mode);
                    if (c && c.polKey && polKey(x.pol) !== c.polKey && !(x.dfw && xa))
                        continue;
                    if (c && c.fob && (airReq ? !isAirM(x.mode) : xa))
                        continue;
                    if (podHit(x, pods))
                        return true;
                    if (c && c.fob && !airReq && !xa) {
                        const has = (R) => (R || []).some(y => y && coOf(y) === co && polKey(y.pol) === c.polKey && !isAir(y.mode) && valid(y) && podHit(y, pods));
                        if (!has(CH.prev) || !has(CH.now))
                            return true;
                    }
                }
            }
        }
        catch (e) {
            err("touched", e);
            return true;
        }
        return false;
    }
    const ownOffer = (l) => { const m = me(); return (l && l.ok && (l.offers || []).find((o) => o && o.co === m)) || null; };
    function brief(l) {
        const o = ownOffer(l), q = (l && l.quote) || null;
        return { ok: !!(l && l.ok), tot: q ? +q.total || 0 : null, lane: q ? String(q.lane || "") : "", mode: q ? String(q.mode || "") : "", rec: l ? String(l.rec || "") : "", sel: l ? String(l.sel || l.co || "") : "", n: ((l && l.offers) || []).length,
            own: o ? +o.quote.total || 0 : null, ownTt: o && o.rate ? o.rate.tt : null, ownValid: o && o.rate ? String(o.rate.valid || "") : "", fob: !!(l && (l.v56shipFob || (q && q.v56shipFob))) };
    }
    if (typeof fwdReevalPending === "function") {
        const __re92 = fwdReevalPending;
        fwdReevalPending = function () {
            const self = this, args = arguments;
            if (!on() || fvMode() || !Array.isArray(FWDB.reqs))
                return __re92.apply(self, args);
            const F = FWDB, all = F.reqs;
            let n = 0;
            const rep = [];
            let CH = null;
            try {
                F.reqs = [];
                try {
                    __re92.apply(self, args);
                }
                catch (e) {
                    err("re0", e);
                }
                finally {
                    F.reqs = all;
                }
                CH = diff();
                all.forEach((r) => {
                    if (!r || !Array.isArray(r.legs))
                        return;
                    const T = r.legs.filter((l) => l && !l.hold && (!CH || legTouched(r, l, CH)));
                    if (!T.length)
                        return;
                    const before = T.map(brief);
                    const view = Object.assign({}, r, { legs: T });
                    let k = 0;
                    F.reqs = [view];
                    try {
                        k = +withCtx(r, () => __re92.apply(self, args)) || 0;
                    }
                    catch (e) {
                        err("re1", e);
                    }
                    finally {
                        F.reqs = all;
                    }
                    if (view.msgs !== r.msgs)
                        r.msgs = view.msgs;
                    const gone = [];
                    T.forEach((l) => {
                        if (!l.ok || l.hold)
                            return;
                        let nl = null;
                        try {
                            nl = buildLeg(r, l);
                        }
                        catch (e) {
                            err("re2", e);
                        }
                        if (!nl || nl.ok)
                            return;
                        const c = ctxOf(r), pods = podsOf(l);
                        const exp = (F.rates || []).some((x) => x && !valid(x) && (!c || !c.polKey || polKey(x.pol) === c.polKey) && podHit(x, pods) && (!r.toCo || coOf(x) === r.toCo));
                        const was = (l.quote && l.quote.lane) || "";
                        const keep = {};
                        ["v802reg", "v802pod"].forEach(kk => {
                            if (l[kk] != null)
                                keep[kk] = l[kk];
                        });
                        Object.keys(l).forEach(kk => { delete l[kk]; });
                        Object.assign(l, nl, keep);
                        l.ok = 0;
                        if (exp)
                            l.v82why = "exp";
                        l.v92why = exp ? "exp" : "gone";
                        l.v82was = was;
                        gone.push(l);
                    });
                    if (gone.length) {
                        k += gone.length;
                        r.msgs = (r.msgs || []).concat([{ f: "物", t: gone.map((l) => `${E(l.cty)}：${l.v92why === "exp" ? "有効期限の切れたレートしか無くなったため" : "この区間で使えるレートが無くなったため"}、見積${l.v82was ? "（" + E(l.v82was) + "）" : ""}を取り下げました。新しいレートが登録されると、自動でお見積します`).join("<br>"), at: today() }]);
                    }
                    try {
                        r.status = fwdReqStatus(r);
                    }
                    catch (e) { }
                    if (k)
                        r._m = Date.now();
                    n += k;
                    T.forEach((l, i) => {
                        const b = before[i], a = brief(l);
                        const same = b.ok === a.ok && b.tot === a.tot && b.rec === a.rec && b.sel === a.sel && b.own === a.own && b.ownTt === a.ownTt && b.ownValid === a.ownValid && b.n === a.n;
                        if (!b.ok && !a.ok)
                            return;
                        rep.push({ id: r.id, cty: l.cty, pol: r.pol || "", pod: l.pod || "", mode: r.mode || "", term: r.term || "", b, a, same, why: l.v92why || "" });
                    });
                });
            }
            catch (e) {
                err("re", e);
                F.reqs = all;
            }
            V92F.last = { at: Date.now(), n, rep, all: CH === null, nRate: CH ? CH.rates.length : 0, nSitu: CH ? CH.situ.length : 0, total: all.length, toasted: 0 };
            snap();
            V92F.n.re = (V92F.n.re || 0) + 1;
            return n;
        };
    }
    if (typeof fwdRatesFor === "function") {
        const __rf92 = fwdRatesFor;
        fwdRatesFor = function (pod, mode, coFilter) {
            let c = null;
            try {
                c = (typeof V56SHIP !== "undefined" && V56SHIP) ? V56SHIP.req : null;
            }
            catch (e) { }
            if (!c || !c.fob || !isAirM(mode) || c.v92air)
                return __rf92.apply(this, arguments);
            let air = [];
            try {
                V56SHIP.req = Object.assign({}, c, { fob: false, v92air: 1 });
                air = (__rf92.apply(this, arguments) || []).filter((r) => r && isAirM(r.mode));
            }
            catch (e) {
                air = [];
            }
            finally {
                V56SHIP.req = c;
            }
            return air.map((r) => Object.assign({}, r, { v56shipFob: 1 }));
        };
    }
    const airFobTxt = (s) => String(s).replace(/海上運賃は買い手の負担/g, "航空運賃は買い手の負担").replace(/で本船に積むまでの費用（THC等諸掛・書類費）/g, "で航空機に積むまでの費用（取扱いの諸掛・書類費）").replace(/FOB（本船渡し）のため/g, "FOB のため").replace(/までの海上の所要/g, "までの航空の所要").replace(/・船は買い手が手配/g, "・航空便は買い手が手配");
    if (typeof fwdLegBuild === "function") {
        const __lb92 = fwdLegBuild;
        fwdLegBuild = function () {
            const l = __lb92.apply(this, arguments);
            try {
                if (l && l.ok && l.v56shipFob && l.quote && isAirM(l.quote.mode) && Array.isArray(l.recWhy))
                    l.recWhy = l.recWhy.map(airFobTxt);
            }
            catch (e) { }
            return l;
        };
    }
    if (typeof fwdLegLine === "function") {
        const __ll92 = fwdLegLine;
        fwdLegLine = function (l) {
            const s = __ll92.apply(this, arguments);
            try {
                if (l && l.ok && l.v56shipFob && l.quote && isAirM(l.quote.mode))
                    return String(s).replace(/で本船渡しまで・FOB）/, "で積み込みまで・FOB）").replace(/THC等諸掛＋書類費。海上運賃は買い手の負担/, "取扱いの諸掛＋書類費。航空運賃は買い手の負担");
            }
            catch (e) { }
            return s;
        };
    }
    const coTag = (co) => co ? co + (co === me() ? M("（自社）", " (you)") : "") : "—";
    function repLine(x) {
        const lane = `${x.pol || "—"} → ${x.a.ok ? (x.a.lane.replace(/^.*?→\s*/, "") || x.pod || x.cty) : (x.pod || x.cty)}`;
        const head = `${x.id} ${x.cty}（${lane}・${x.mode || "LCL"}${x.a.fob || x.b.fob ? "・FOB" : ""}）`;
        const portOnly = x.a.ok && /（本船渡しまで）/.test(x.a.lane) ? `。この依頼は FOB のため、仕向地までのレートが無くても、同じ仕出港（${x.pol}）のレートがあれば、港で積むまでの費用を回答します（最初の回答と同じ決まり）` : "";
        if (!x.b.ok && x.a.ok)
            return `${head}：新しく見積が付きました ${Y(x.a.tot)}${x.a.fob ? "（FOB：積むまでの費用だけ）" : ""}・推奨 ${coTag(x.a.rec)}${portOnly}`;
        if (x.b.ok && !x.a.ok)
            return `${head}：${x.why === "exp" ? "有効期限の切れたレートしか無くなったため" : "使えるレートが無くなったため"}、見積 ${Y(x.b.tot)} を取り下げました（レーン未登録＝要確認に戻しました）`;
        if (!x.a.ok)
            return `${head}：まだ見積を出せません（この区間・この仕出港のレートがありません）`;
        const p = [];
        if (x.b.own != null || x.a.own != null) {
            if (x.b.own === x.a.own)
                p.push(`貴社の見積 ${Y(x.a.own)} のまま${x.a.fob ? "（FOB は港で積むまでの費用だけの見積のため、運賃の変更は金額に出ません）" : ""}`);
            else
                p.push(`貴社の見積 ${x.b.own == null ? "なし" : Y(x.b.own)} → ${x.a.own == null ? "なし" : Y(x.a.own)}`);
            if (x.b.ownTt != null && x.a.ownTt != null && String(x.b.ownTt) !== String(x.a.ownTt))
                p.push(`日数 ${x.b.ownTt}日 → ${x.a.ownTt}日`);
            if (x.b.ownValid && x.a.ownValid && x.b.ownValid !== x.a.ownValid)
                p.push(`有効期限 ${x.b.ownValid} → ${x.a.ownValid}`);
        }
        if (x.b.tot !== x.a.tot)
            p.push(`荷主に出ている見積 ${Y(x.b.tot)} → ${Y(x.a.tot)}`);
        p.push(x.b.rec === x.a.rec ? `推奨 ${coTag(x.a.rec)} のまま` : `推奨 ${coTag(x.b.rec)} → ${coTag(x.a.rec)}`);
        if (x.b.n !== x.a.n)
            p.push(`回答 ${x.b.n}社 → ${x.a.n}社`);
        return `${head}：${p.join("／")}`;
    }
    function repToast(L) {
        const ch = L.rep.filter((x) => !x.same);
        const rest = L.total - new Set(L.rep.map((x) => x.id)).size;
        if (!L.rep.length)
            return L.nRate ? `（このレートに関係する依頼はありません。依頼 ${L.total}件の見積は変えていません）` : "";
        const one = (x) => {
            if (!x.b.ok && x.a.ok)
                return `${x.id} ${x.cty} に見積 ${Y(x.a.tot)}${x.a.fob ? "（FOB：積むまでの費用だけ）" : ""}`;
            if (x.b.ok && !x.a.ok)
                return `${x.id} ${x.cty} の見積を取り下げ（要確認に戻しました）`;
            if (!x.a.ok)
                return `${x.id} ${x.cty} はまだ出せません`;
            const own = x.b.own != null || x.a.own != null;
            const amt = own ? (x.b.own === x.a.own ? `貴社の見積 ${Y(x.a.own)} のまま${x.a.fob ? "（FOB：港の費用だけ）" : ""}` : `貴社の見積 ${x.b.own == null ? "なし" : Y(x.b.own)}→${x.a.own == null ? "なし" : Y(x.a.own)}`) : (x.b.tot === x.a.tot ? `見積 ${Y(x.a.tot)} のまま` : `見積 ${Y(x.b.tot)}→${Y(x.a.tot)}`);
            return `${x.id} ${x.cty}：${amt}・推奨${x.b.rec === x.a.rec ? "は" + (x.a.rec === me() ? "貴社" : x.a.rec) + "のまま" : " " + x.b.rec + "→" + x.a.rec}`;
        };
        const src = ch.length ? ch : L.rep;
        return `（計算し直した見積 ${L.rep.length}件：${src.slice(0, 2).map(one).join("、")}${src.length > 2 ? " ほか" : ""}${rest > 0 ? `。ほかの依頼 ${rest}件は変えていません` : ""}）`;
    }
    if (typeof toast === "function") {
        const __to92 = toast;
        toast = function (m) {
            try {
                const L = V92F.last;
                if (L && !L.toasted && Date.now() - L.at < 4000 && on() && !fvMode() && typeof m === "string" && (L.nRate || L.rep.length)) {
                    L.toasted = 1;
                    const s = repToast(L);
                    m = m.replace(/（見積 \d+件の推奨を(?:更新|再計算)）|\s*\(\d+ quotes updated\)|（已更新 \d+ 件报价的推荐）|\s*\(\d+ cotizaciones actualizadas\)/g, "") + s;
                    arguments[0] = m;
                }
            }
            catch (e) { }
            return __to92.apply(this, arguments);
        };
    }
    function repBoxHtml() {
        const L = V92F.last;
        if (!L || Date.now() - L.at > 10 * 60e3 || (!L.nRate && !L.rep.length))
            return "";
        const rest = L.total - new Set(L.rep.map((x) => x.id)).size;
        return `<div class="v92fre" role="status" data-noi18n><b>${E(M("この変更で計算し直した見積", "Quotes recalculated by this change"))}（${L.rep.length}${E(M("件", ""))}）</b>
      ${L.rep.length ? `<ul>${L.rep.map((x) => `<li class="${x.b.ok && !x.a.ok ? "ng" : !x.b.ok && x.a.ok ? "ok" : ""}">${E(repLine(x))}</li>`).join("")}</ul>` : `<p>${E(M("このレートに関係する依頼はありません。", "No request is affected by this rate."))}</p>`}
      <p class="v92fren">${E(M(`計算し直すのは、直したレートの区間（依頼の仕出港・仕向港）に関係する依頼だけです。依頼の条件（仕出港・FOB なら積むまでの費用だけ）は、最初の回答と同じ決まりで当てます。${rest > 0 ? `ほかの依頼 ${rest}件は変えていません。` : ""}`, `Only requests on the edited lane are recalculated, with the same rules as the first answer (port of loading; FOB = charges up to loading only).${rest > 0 ? ` The other ${rest} request(s) were not changed.` : ""}`))}</p></div>`;
    }
    const nfkc = (v) => {
        let s = String(v == null ? "" : v);
        try {
            s = s.normalize("NFKC");
        }
        catch (e) { }
        return s.trim();
    };
    const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12, january: 1, february: 2, march: 3, april: 4, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
    function normDate(v) {
        let s = nfkc(v);
        if (!s)
            return { empty: 1 };
        s = s.replace(/\s*(?:まで|迄|限り)\s*$/, "").trim();
        const mk = (y, m, d) => {
            if (!(y >= 2000 && y <= 2100))
                return { why: `年（${y}）が読めません` };
            if (!(m >= 1 && m <= 12))
                return { why: `${m}月はありません` };
            const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
            if (!(d >= 1 && d <= dim))
                return { why: `${m}月${d}日はありません` };
            return { ymd: y + "-" + String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0") };
        };
        let m;
        if (/^\d{5}(?:\.\d+)?$/.test(s)) {
            const n = Math.floor(+s);
            if (n >= 36526 && n <= 73415) {
                const d = new Date(Date.UTC(1899, 11, 30) + n * 864e5);
                return mk(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
            }
        }
        if ((m = s.match(/^(\d{4})\s*[-\/.年]\s*(\d{1,2})\s*[-\/.月]\s*(\d{1,2})\s*日?(?:[T\s]\d.*)?$/)))
            return mk(+m[1], +m[2], +m[3]);
        if ((m = s.match(/^(\d{4})(\d{2})(\d{2})$/)))
            return mk(+m[1], +m[2], +m[3]);
        if ((m = s.match(/^(令和|平成|R|H)\s*(\d{1,2}|元)\s*[年.\/-]\s*(\d{1,2})\s*[月.\/-]\s*(\d{1,2})\s*日?$/i)))
            return mk((/^(令和|R)$/i.test(m[1]) ? 2018 : 1988) + (m[2] === "元" ? 1 : +m[2]), +m[3], +m[4]);
        if ((m = s.match(/^(\d{1,2})[-\s\/.]+([A-Za-z]{3,9})\.?[-\s\/.,]+(\d{4})$/)) && MON[m[2].toLowerCase()])
            return mk(+m[3], MON[m[2].toLowerCase()], +m[1]);
        if ((m = s.match(/^([A-Za-z]{3,9})\.?[-\s\/.]+(\d{1,2})(?:st|nd|rd|th)?[-\s\/.,]+(\d{4})$/)) && MON[m[1].toLowerCase()])
            return mk(+m[3], MON[m[1].toLowerCase()], +m[2]);
        if ((m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/))) {
            const a = +m[1], b = +m[2];
            if (a > 12 && b <= 12)
                return mk(+m[3], b, a);
            if (b > 12 && a <= 12)
                return mk(+m[3], a, b);
            if (a === b)
                return mk(+m[3], a, b);
            return { why: `月と日の順が決められません（${a}月${b}日／${b}月${a}日）。年-月-日（例：${m[3]}-12-31）で入れてください` };
        }
        if (/^\d{4}\s*[-\/.年]\s*\d{1,2}\s*月?$/.test(s))
            return { why: "日が書かれていません" };
        return { why: "日付として読めません" };
    }
    V92F.normDate = normDate;
    const realToday = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
    if (typeof fwdRateValid === "function") {
        const __rv92 = fwdRateValid;
        fwdRateValid = function (r) {
            const o = __rv92.apply(this, arguments);
            try {
                const v = r && r.valid;
                if (v == null || v === "")
                    return o;
                const d = normDate(v);
                if (d.empty)
                    return o;
                if (d.why)
                    return false;
                if (d.ymd !== String(v).replace(/\//g, "-"))
                    return d.ymd >= today() && d.ymd >= realToday();
            }
            catch (e) { }
            return o;
        };
    }
    function fixDates() {
        try {
            if (!on())
                return 0;
            let n = 0;
            (FWDB.rates || []).forEach((r) => {
                if (!r || r.valid == null || r.valid === "" || /^\d{4}-\d{2}-\d{2}$/.test(String(r.valid)))
                    return;
                const d = normDate(r.valid);
                if (d.ymd && d.ymd !== r.valid) {
                    r.valid = d.ymd;
                    n++;
                }
            });
            return n;
        }
        catch (e) {
            err("fixdates", e);
            return 0;
        }
    }
    const PORT_EN = { "HONG KONG": "香港", "HONGKONG": "香港", "SINGAPORE": "シンガポール", "KEELUNG": "基隆", "KAOHSIUNG": "高雄", "TAICHUNG": "台中", "TAIPEI": "台北", "BUSAN": "釜山", "PUSAN": "釜山", "INCHEON": "仁川", "INCHON": "仁川",
        "SHANGHAI": "上海", "QINGDAO": "青島", "TIANJIN": "天津", "XINGANG": "天津新港", "NINGBO": "寧波", "SHENZHEN": "深圳", "DALIAN": "大連", "XIAMEN": "厦門", "GUANGZHOU": "広州",
        "LOS ANGELES": "ロサンゼルス", "LONG BEACH": "ロングビーチ", "OAKLAND": "オークランド", "SEATTLE": "シアトル", "TACOMA": "タコマ", "NEW YORK": "ニューヨーク", "SAVANNAH": "サバンナ", "HOUSTON": "ヒューストン", "CHICAGO": "シカゴ", "VANCOUVER": "バンクーバー",
        "HO CHI MINH": "ホーチミン", "HO CHI MINH CITY": "ホーチミン", "HOCHIMINH": "ホーチミン", "HAIPHONG": "ハイフォン", "HAI PHONG": "ハイフォン", "LAEM CHABANG": "レムチャバン", "BANGKOK": "バンコク", "PORT KLANG": "ポートケラン", "PORT KELANG": "ポートケラン",
        "JAKARTA": "ジャカルタ", "SURABAYA": "スラバヤ", "MANILA": "マニラ", "CEBU": "セブ", "COLOMBO": "コロンボ", "JEBEL ALI": "ジェベルアリ", "DUBAI": "ドバイ", "NHAVA SHEVA": "ナバシェバ", "MUMBAI": "ムンバイ", "CHENNAI": "チェンナイ",
        "SYDNEY": "シドニー", "MELBOURNE": "メルボルン", "BRISBANE": "ブリスベン", "AUCKLAND": "オークランド（NZ）", "HAMBURG": "ハンブルク", "ROTTERDAM": "ロッテルダム", "ANTWERP": "アントワープ", "LE HAVRE": "ルアーブル", "FELIXSTOWE": "フェリクストウ", "SOUTHAMPTON": "サウサンプトン",
        "GENOA": "ジェノバ", "BARCELONA": "バルセロナ", "LONDON": "ロンドン", "PARIS": "パリ", "FRANKFURT": "フランクフルト",
        "YOKOHAMA": "横浜港", "TOKYO": "東京港", "NAGOYA": "名古屋港", "KOBE": "神戸港", "OSAKA": "大阪港", "HAKATA": "博多港", "MOJI": "門司港", "SHIMIZU": "清水港", "YOKKAICHI": "四日市港", "NARITA": "成田空港", "HANEDA": "羽田空港", "KANSAI": "関西空港", "KIX": "関西空港", "NRT": "成田空港", "HND": "羽田空港", "CHUBU": "中部空港", "NGO": "中部空港" };
    function portJa(v) {
        const s = nfkc(v);
        if (!s || !/^[\x20-\x7e]+$/.test(s))
            return { v: s, from: "", en: 0 };
        const k = s.toUpperCase().replace(/[.,]/g, " ").replace(/^PORT\s+OF\s+/, "").replace(/\s+(?:PORT|PT|AIRPORT|CY|CFS)$/, "").replace(/\s+/g, " ").trim();
        const j = PORT_EN[k] || PORT_EN[k.replace(/\s+/g, "")];
        return j ? { v: j, from: s, en: 0 } : { v: s, from: "", en: 1 };
    }
    function parsePrice(v) {
        const s = nfkc(v);
        if (!s)
            return { why: "運賃が空欄です" };
        const usd = /US\$|USD|\$/i.test(s);
        const t = s.replace(/US\$|USD|JPY|円|¥|￥|\$/gi, "").replace(/[,\s]/g, "").replace(/\/?(?:m3|m³|㎥|cbm|kg|本|個|rt|r\/t|w\/m|unit)$/i, "");
        if (!/^[-+]?\d+(?:\.\d+)?$/.test(t))
            return { why: `運賃「${s}」は数字として読めません` };
        const n = Math.round(parseFloat(t));
        if (!(n > 0))
            return { why: `運賃「${s}」は 0 以下です（正の数だけ登録できます）` };
        return { price: n, usd };
    }
    const HDRX = { price: /運賃|料金|価格|金額|単価|rate|price|charge|freight|o\/f/i };
    const defValid = () => {
        try {
            return (typeof v422DefValid === "function") ? v422DefValid() : (today().slice(0, 4) + "-12-31");
        }
        catch (e) {
            return today().slice(0, 4) + "-12-31";
        }
    };
    const unitOf = (mode) => mode === "LCL" ? "/m³" : mode === "AIR" ? "/kg" : mode === "COURIER" ? "/個" : "/本";
    function analyzeGrids(grids) {
        if (typeof FWD_HDR === "undefined" || !FWD_HDR || typeof fwdNormMode !== "function")
            return null;
        const rows = [], skipped = [];
        let headered = false;
        const dv = defValid(), td = realToday();
        (grids || []).forEach((g, gi) => {
            if (!g || !g.length)
                return;
            let hi = -1, map = null;
            for (let i = 0; i < Math.min(g.length, 12); i++) {
                const row = g[i] || [], m = {};
                row.forEach((c, ci) => {
                    Object.keys(FWD_HDR).forEach(k => {
                        const re = k === "price" ? HDRX.price : FWD_HDR[k];
                        if (m[k] === undefined && re.test(String(c || "")))
                            m[k] = ci;
                    });
                });
                if (m.pod !== undefined && m.price !== undefined && m.pod !== m.price) {
                    hi = i;
                    map = m;
                    break;
                }
            }
            if (hi < 0) {
                map = { pol: 0, pod: 1, mode: 2, price: 3, tt: 4, valid: 5, note: 6, v92pos: 1 };
                const first = g[0] || [];
                if (first.length >= 4 && parsePrice(first[3]).why && !(g.slice(1).every((r) => parsePrice((r || [])[3]).why)))
                    hi = 0;
            }
            else
                headered = true;
            let lastPol = "";
            for (let i = hi + 1; i < g.length; i++) {
                const r = (g[i] || []).map((c) => c == null ? "" : c);
                if (!r.some((c) => String(c).trim()))
                    continue;
                const line = i + 1, raw = r.map((c) => String(c).trim()).join(", ").slice(0, 90);
                const cell = (k) => map[k] !== undefined ? nfkc(r[map[k]]) : "";
                const skip = (why) => skipped.push({ line, gi, raw, why });
                if (map.v92pos && r.length < 4) {
                    skip("列が足りません（仕出港,仕向港,形態,運賃 の4列以上が要ります）");
                    continue;
                }
                const podRaw = cell("pod");
                if (!podRaw) {
                    skip("仕向港が空欄です");
                    continue;
                }
                const pv = parsePrice(map.price !== undefined ? r[map.price] : "");
                if (pv.why) {
                    skip(pv.why);
                    continue;
                }
                const notes = [];
                let polRaw = cell("pol");
                if (!polRaw) {
                    polRaw = lastPol || "横浜港";
                    notes.push(lastPol ? `仕出港が空欄のため、上の行と同じ ${polRaw} としました` : "仕出港が空欄のため 横浜港 としました");
                }
                lastPol = polRaw;
                const P = portJa(polRaw), Q = portJa(podRaw);
                if (P.from)
                    notes.push(`仕出港 ${P.from} → ${P.v} と読み替えました`);
                if (Q.from)
                    notes.push(`仕向港 ${Q.from} → ${Q.v} と読み替えました`);
                if (P.en || Q.en)
                    notes.push(`港名が英語のままです（${[P.en ? P.v : "", Q.en ? Q.v : ""].filter(Boolean).join("・")}）。依頼の区間は日本語の港名で当てるので、和名で登録し直すと確実です`);
                const mRaw = cell("mode"), mode = fwdNormMode(mRaw);
                if (mRaw && mode === "LCL" && !/LCL|混載|CFS|LESS/i.test(mRaw))
                    notes.push(`形態「${mRaw}」は LCL として読みました`);
                if (!mRaw)
                    notes.push("形態が空欄のため LCL としました");
                const ttRaw = cell("tt"), ttN = parseInt(ttRaw, 10);
                if (!(ttN > 0))
                    notes.push(ttRaw ? `日数「${ttRaw}」を読めないため 10日 としました` : "日数が空欄のため 10日 としました");
                const vRaw = cell("valid");
                let valid = dv, exp = false;
                if (vRaw) {
                    const d = normDate(vRaw);
                    if (d.why) {
                        skip(`有効期限「${vRaw}」は${d.why === "日付として読めません" ? "日付として読めません" : "ありえない日付です（" + d.why + "）"}`);
                        continue;
                    }
                    valid = d.ymd;
                    if (d.ymd !== vRaw)
                        notes.push(`有効期限 ${vRaw} → ${d.ymd} と読み替えました`);
                    if (d.ymd < td)
                        exp = true;
                }
                else
                    notes.push(`有効期限が空欄のため ${dv} としました`);
                const rate = { pol: P.v, pod: Q.v, mode, price: pv.price, cur: pv.usd ? "US$" : "¥", unit: unitOf(mode), tt: ttN > 0 ? ttN : 10, valid, note: cell("note") + (pv.usd ? "（USD建て）" : "") };
                rows.push({ line, gi, raw, rate, notes, exp, use: !exp });
            }
        });
        return { rows, skipped, headered };
    }
    if (typeof fwdRatesFromGrids === "function") {
        const __rg92 = fwdRatesFromGrids;
        fwdRatesFromGrids = function (grids) {
            const out = __rg92.apply(this, arguments);
            V92F.diag = null;
            try {
                if (on()) {
                    const A = analyzeGrids(grids);
                    if (A) {
                        V92F.diag = Object.assign(A, { at: Date.now() });
                        return { rates: A.rows.map((x) => x.rate), headered: A.headered };
                    }
                }
            }
            catch (e) {
                err("grids", e);
                V92F.diag = null;
            }
            return out;
        };
    }
    const laneTxt = (r) => `${r.pol} → ${r.pod}・${r.mode}`;
    const priceTxt = (r) => `${r.cur || "¥"}${(+r.price || 0).toLocaleString()}${r.unit || ""}`;
    function stage(rs, how, fname) {
        const D = (V92F.diag && Date.now() - V92F.diag.at < 60000) ? V92F.diag : null;
        V92F.diag = null;
        let co = "";
        try {
            const i = document.getElementById("frCo");
            co = (i && String(i.value || "").trim()) || me();
        }
        catch (e) {
            co = me();
        }
        const td = realToday();
        let rows;
        const skipped = D ? D.skipped.slice() : [];
        if (D && D.rows.length === rs.length && D.rows.every((x, i) => x.rate === rs[i]))
            rows = D.rows.map((x) => Object.assign({}, x));
        else {
            rows = [];
            rs.forEach((r, i) => {
                const notes = [];
                let exp = false;
                if (r.valid) {
                    const d = normDate(r.valid);
                    if (d.why) {
                        skipped.push({ line: i + 1, gi: 0, raw: `${laneTxt(r)} ${priceTxt(r)}`, why: `有効期限「${r.valid}」は日付として読めません` });
                        return;
                    }
                    if (d.ymd && d.ymd !== r.valid) {
                        notes.push(`有効期限 ${r.valid} → ${d.ymd} と読み替えました`);
                        r.valid = d.ymd;
                    }
                    exp = !!d.ymd && d.ymd < td;
                }
                if (!(+r.price > 0)) {
                    skipped.push({ line: i + 1, gi: 0, raw: `${laneTxt(r)}`, why: "運賃が 0 以下です" });
                    return;
                }
                rows.push({ line: i + 1, gi: 0, raw: "", rate: r, notes, exp, use: !exp });
            });
        }
        const key = (r) => [co, r.pol, r.pod, r.mode].join("|");
        const lastOf = {};
        rows.forEach((x, i) => { lastOf[key(x.rate)] = i; });
        rows.forEach((x, i) => {
            const k = key(x.rate), j = lastOf[k];
            if (j !== i) {
                x.dup = rows[j].line;
                x.use = false;
                return;
            }
            const old = (FWDB.rates || []).find((y) => y && !y.dfw && [coOf(y), y.pol, y.pod, y.mode].join("|") === k);
            if (old)
                x.old = { price: old.price, cur: old.cur, unit: old.unit, valid: old.valid, tt: old.tt };
        });
        const B = { fname: fname || "", how: how || "", co, rows, skipped, at: Date.now() };
        V92F.imp = V92F.imp || { batches: [] };
        V92F.imp.batches = V92F.imp.batches.filter((b) => b.fname !== B.fname).concat([B]);
        V92F.impRes = null;
        drawImp();
        say(M(`${fname ? fname + "：" : ""}読めた行 ${rows.length}・読めなかった行 ${skipped.length}。内容を確かめて「登録する」を押してください（まだ登録していません）`, `${fname ? fname + ": " : ""}${rows.length} rows read, ${skipped.length} unreadable. Check and press Register (nothing is registered yet)`));
        try {
            const st = document.getElementById("fwdupst");
            if (st)
                st.scrollIntoView({ block: "center", behavior: "smooth" });
        }
        catch (e) { }
    }
    function impHtml() {
        const I = V92F.imp;
        if (!I || !I.batches.length)
            return "";
        let h = "";
        I.batches.forEach((b, bi) => {
            const use = b.rows.filter((x) => x.use).length, MAX = 60;
            h += `<div class="v92fimp" data-noi18n role="group" aria-label="${E(M("取り込みの確認", "Import check"))}">
        <p class="v92fimph"><b>${E(M("取り込みの確認", "Import check"))}${b.fname ? "：" + E(b.fname) : ""}</b> <span class="p mid" style="font-size:10px">${E(M("まだ登録していません", "Not registered yet"))}</span></p>
        <p class="v92fimps">${E(M(`読めた行 ${b.rows.length}行／読めなかった行 ${b.skipped.length}行。物流会社名：${b.co}。チェックの付いた ${use}行を登録します。登録すると、見積の自動回答にすぐ使われます。`, `${b.rows.length} rows read / ${b.skipped.length} unreadable. Company: ${b.co}. The ${use} checked rows will be registered and used for automatic quotes right away.`))}</p>
        ${b.rows.length ? `<div class="v92fimpt"><table><thead><tr><th></th><th>${E(M("行", "Row"))}</th><th>${E(M("区間・確かめること", "Lane / notes"))}</th><th class="num">${E(M("運賃", "Rate"))}</th><th class="num">${E(M("日数", "Days"))}</th><th>${E(M("有効期限", "Valid until"))}</th></tr></thead><tbody>
          ${b.rows.slice(0, MAX).map((x, i) => {
                const r = x.rate;
                const nt = x.notes.slice();
                if (x.dup)
                    nt.unshift(M(`同じ区間が ${x.dup}行目にもあります。あとの行（${x.dup}行目）を使うので、この行は登録しません`, `Same lane also on row ${x.dup}; the later row is used`));
                if (x.exp)
                    nt.unshift(M(`期限切れ（${r.valid} は過ぎた日付）。見積に使われないので、チェックを外してあります`, `Expired (${r.valid}); unchecked by default`));
                if (x.old && !x.dup)
                    nt.push(M(`登録済みの同じ区間を置き換えます（${priceTxt(x.old)}・期限 ${x.old.valid || "—"} → ${priceTxt(r)}・期限 ${r.valid}）`, `Replaces the registered lane (${priceTxt(x.old)} → ${priceTxt(r)})`));
                return `<tr class="${x.exp ? "exp" : ""}${x.dup ? " dup" : ""}"><td><input type="checkbox" data-v92fimpc="${bi}:${i}"${x.use ? " checked" : ""}${x.dup ? " disabled" : ""} aria-label="${E(laneTxt(r))}"></td><td class="n">${x.line}</td><td><b>${E(r.pol)} → ${E(r.pod)}</b> <span class="p ${r.mode === "LCL" ? "on" : "or"}">${E(r.mode)}</span>${nt.length ? `<div class="v92fnt">${nt.map(E).join("<br>")}</div>` : ""}</td><td class="num">${E(priceTxt(r))}</td><td class="num">${E(r.tt)}${E(M("日", "d"))}</td><td class="n">${E(r.valid)}</td></tr>`;
            }).join("")}
          </tbody></table></div>${b.rows.length > MAX ? `<p class="v92fimps">${E(M(`ほか ${b.rows.length - MAX}行（同じように登録します）`, `and ${b.rows.length - MAX} more rows`))}</p>` : ""}` : ""}
        ${b.skipped.length ? `<p class="v92fimpk"><b>${E(M(`読めなかった行（${b.skipped.length}行・登録しません）`, `Unreadable rows (${b.skipped.length}, not registered)`))}</b></p><ul class="v92fimpu">${b.skipped.slice(0, 40).map((s) => `<li><b>${s.line}${E(M("行目", ""))}</b>：${E(s.why)}${s.raw ? `<code class="raw">${E(s.raw)}</code>` : ""}</li>`).join("")}${b.skipped.length > 40 ? `<li>${E(M(`ほか ${b.skipped.length - 40}行`, `and ${b.skipped.length - 40} more`))}</li>` : ""}</ul><p class="v92fimps">${E(M("読めなかった行は、元の表を直してもう一度取り込むか、下の「手入力で1レーン追加」で登録してください。", "Fix these rows in the sheet and import again, or add them by hand below."))}</p>` : ""}
        <div class="rw" style="margin-top:8px;gap:8px"><button type="button" class="btn" data-v92fimpgo="${bi}"${use ? "" : " disabled"}>${E(M(`この ${use}行を登録する`, `Register these ${use} rows`))}</button><button type="button" class="btn g" data-v92fimpno="${bi}">${E(M("やめる（登録しない）", "Cancel"))}</button></div></div>`;
        });
        return h;
    }
    function impResHtml() {
        const R = V92F.impRes;
        if (!R || Date.now() - R.at > 10 * 60e3)
            return "";
        return `<div class="v92fimp res" data-noi18n role="status"><p class="v92fimph"><b>${E(M("取り込みの結果", "Import result"))}${R.fname ? "：" + E(R.fname) : ""}</b></p>
      <p class="v92fimps">${E(M(`登録した行 ${R.done}行${R.rep ? `（うち ${R.rep}行は登録済みの同じ区間を置き換え）` : ""}／登録しなかった行 ${R.off}行／読めなかった行 ${R.skipped.length}行`, `${R.done} registered${R.rep ? ` (${R.rep} replaced)` : ""} / ${R.off} not registered / ${R.skipped.length} unreadable`))}</p>
      ${R.skipped.length ? `<ul class="v92fimpu">${R.skipped.slice(0, 40).map((s) => `<li><b>${s.line}${E(M("行目", ""))}</b>：${E(s.why)}${s.raw ? `<code class="raw">${E(s.raw)}</code>` : ""}</li>`).join("")}</ul>` : ""}</div>`;
    }
    function drawImp() {
        try {
            const st = document.getElementById("fwdupst");
            if (!st)
                return;
            const h = impHtml();
            st.querySelectorAll(".v92fimp").forEach(x => x.remove());
            if (h) {
                st.innerHTML = h;
                return;
            }
            const r = impResHtml();
            if (r)
                st.insertAdjacentHTML("beforeend", r);
        }
        catch (e) {
            err("drawimp", e);
        }
    }
    let __rd92 = null;
    if (typeof fwdRateDone === "function") {
        __rd92 = fwdRateDone;
        fwdRateDone = function (rs, how, fname) {
            let aiKeep = null;
            try {
                if (on() && Array.isArray(rs) && !V92F.gate && /AI/.test(String(how || ""))) {
                    const bad = [];
                    const keep = rs.filter((r) => {
                        if (!r)
                            return false;
                        if (!(+r.price > 0)) {
                            bad.push(`${laneTxt(r)}：運賃が 0 以下`);
                            return false;
                        }
                        if (r.valid) {
                            const d = normDate(r.valid);
                            if (d.why) {
                                bad.push(`${laneTxt(r)}：有効期限「${r.valid}」は日付として読めません`);
                                return false;
                            }
                            if (d.ymd)
                                r.valid = d.ymd;
                        }
                        const P = portJa(r.pol), Q = portJa(r.pod);
                        r.pol = P.v || r.pol;
                        r.pod = Q.v || r.pod;
                        return true;
                    });
                    if (bad.length)
                        say(M(`読めなかった行 ${bad.length}行は登録しません：${bad.slice(0, 2).join("／")}${bad.length > 2 ? " ほか" : ""}`, `${bad.length} unreadable row(s) are not registered`));
                    aiKeep = keep;
                }
                else if (on() && Array.isArray(rs) && !V92F.gate && typeof fwdCur !== "undefined" && fwdCur === "frates" && document.getElementById("fwdupst")) {
                    stage(rs, String(how || ""), String(fname || ""));
                    return;
                }
            }
            catch (e) {
                err("stage", e);
                aiKeep = null;
            }
            if (aiKeep) {
                if (!aiKeep.length)
                    return;
                return __rd92.call(this, aiKeep, how, fname);
            }
            return __rd92.apply(this, arguments);
        };
    }
    function impCommit(bi) {
        const I = V92F.imp, b = I && I.batches[bi];
        if (!b || !__rd92)
            return;
        const use = b.rows.filter((x) => x.use && !x.dup);
        if (!use.length)
            return;
        I.batches.splice(bi, 1);
        const rates = use.map((x) => Object.assign(x.rate, { co: b.co }));
        V92F.impRes = { fname: b.fname, done: rates.length, rep: use.filter((x) => x.old).length, off: b.rows.length - use.length, skipped: b.skipped, at: Date.now() };
        V92F.gate = 1;
        try {
            __rd92.call(null, rates, b.how, b.fname);
        }
        catch (e) {
            err("commit", e);
        }
        finally {
            V92F.gate = 0;
        }
        drawImp();
    }
    const median = (a) => {
        const b = a.filter(x => x > 0).sort((x, y) => x - y);
        if (!b.length)
            return 0;
        const m = b.length >> 1;
        return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
    };
    document.addEventListener("click", ev => {
        try {
            const t = ev.target;
            if (!t || !t.closest || !on())
                return;
            const stop = () => { ev.preventDefault(); ev.stopImmediatePropagation(); };
            if (t.closest("#frAdd")) {
                const g = (id) => { const el = document.getElementById(id); return el ? nfkc(el.value) : ""; };
                const price = +String(g("frPrice")).replace(/[,\s¥円]/g, "");
                if (!(price > 0) || !g("frPol") || !g("frPod"))
                    return;
                const mode = g("frMode") || "LCL", unit = /FCL/.test(mode) ? "/本" : /AIR/.test(mode) ? "/kg" : "/m³";
                const vIn = g("frValid"), msgs = [];
                if (/^\d{4}-\d{2}-\d{2}$/.test(vIn) && vIn < realToday())
                    msgs.push(M(`有効期限 ${vIn} は、きょう（${realToday()}）より前の日付です。\nこのまま登録すると「期限切れ」になり、見積には使われません（この区間でほかに使えるレートが無い依頼は、見積を取り下げて要確認に戻します）。`, `The validity ${vIn} is before today (${realToday()}). The rate will be registered as expired and not used in quotes.`));
                const co = document.getElementById("frCo") ? g("frCo") || me() : me();
                const k = [co, g("frPol"), g("frPod"), mode].join("|");
                const peers = (FWDB.rates || []).filter((r) => r && UP(r.mode) === UP(mode) && String(r.unit || "") === unit && !/US\$|USD|\$/.test(String(r.cur || "")) && valid(r) && [coOf(r), r.pol, r.pod, r.mode].join("|") !== k).map((r) => +r.price || 0);
                if (peers.length >= 2) {
                    const med = median(peers), x = med ? price / med : 1;
                    if (x >= 5 || x <= 0.2)
                        msgs.push(M(`運賃 ¥${price.toLocaleString()}${unit} は、同じ形態（${mode}）の登録 ${peers.length}本の中央値 ¥${Math.round(med).toLocaleString()}${unit} の約${x >= 1 ? Math.round(x) + "倍" : Math.round(1 / x) + "分の1"}です。\n桁の打ち間違いではありませんか？ 登録すると、見積の自動回答にすぐ使われます。`, `The rate ¥${price.toLocaleString()}${unit} is about ${x >= 1 ? Math.round(x) + "×" : "1/" + Math.round(1 / x)} of the median (¥${Math.round(med).toLocaleString()}${unit}) of ${peers.length} registered ${mode} rates. It will be used for automatic quotes right away.`));
                }
                if (msgs.length && !window.confirm(msgs.join("\n\n") + "\n\n" + M("このまま登録しますか？", "Register anyway?"))) {
                    stop();
                    const f = document.getElementById(/有効期限|validity/i.test(msgs[0]) ? "frValid" : "frPrice");
                    if (f)
                        try {
                            f.focus();
                        }
                        catch (e) { }
                    say(M("登録していません。値を直して、もう一度「追加」を押してください。", "Not registered. Correct the value and press Add again."));
                }
                return;
            }
            const del = t.closest("[data-frdel]");
            if (del) {
                const r = (FWDB.rates || [])[+del.getAttribute("data-frdel")];
                V92F.delPend = r ? { rate: JSON.parse(JSON.stringify(r)), n: (FWDB.rates || []).length, at: Date.now() } : null;
                return;
            }
            const c = t.closest("[data-v92fimpc]");
            if (c) {
                const [bi, i] = String(c.getAttribute("data-v92fimpc")).split(":").map(Number);
                const b = V92F.imp && V92F.imp.batches[bi];
                if (b && b.rows[i]) {
                    b.rows[i].use = !!c.checked;
                    const n = b.rows.filter((x) => x.use).length;
                    const go = document.querySelector(`[data-v92fimpgo="${bi}"]`);
                    if (go) {
                        go.textContent = M(`この ${n}行を登録する`, `Register these ${n} rows`);
                        go.disabled = !n;
                    }
                }
                return;
            }
            const go = t.closest("[data-v92fimpgo]");
            if (go) {
                stop();
                impCommit(+go.getAttribute("data-v92fimpgo"));
                return;
            }
            const no = t.closest("[data-v92fimpno]");
            if (no) {
                stop();
                if (V92F.imp)
                    V92F.imp.batches.splice(+no.getAttribute("data-v92fimpno"), 1);
                const st = document.getElementById("fwdupst");
                if (st)
                    st.innerHTML = "";
                drawImp();
                say(M("取り込みをやめました（レートは登録していません）", "Import cancelled (nothing was registered)"));
                return;
            }
            const un = t.closest("[data-v92fundo]");
            if (un) {
                stop();
                undoDel();
            }
        }
        catch (e) {
            err("click", e);
        }
    }, true);
    function undoDel() {
        const U = V92F.undo;
        if (!U || !U.rate)
            return;
        V92F.undo = null;
        try {
            const r = Object.assign({}, U.rate, { at: Date.now() });
            const k = (typeof fwdRateKey === "function") ? fwdRateKey(r) : "";
            if (Array.isArray(FWDB.rateDel) && k) {
                for (let i = FWDB.rateDel.length - 1; i >= 0; i--) {
                    if (FWDB.rateDel[i] && FWDB.rateDel[i].k === k) {
                        FWDB.rateDel.splice(i, 1);
                        break;
                    }
                }
            }
            if (!(FWDB.rates || []).some((x) => x && rKey(x) === rKey(r)))
                FWDB.rates = (FWDB.rates || []).concat([r]);
            try {
                fwdHist(`レートの削除を元に戻す：${coOf(r)}／${r.pol}→${r.pod}（${r.mode}）`);
            }
            catch (e) { }
            fwdReevalPending();
            fwdSave();
            fwdRender();
            say(M(`元に戻しました：${laneTxt(r)} ${priceTxt(r)}`, `Restored: ${laneTxt(r)} ${priceTxt(r)}`));
        }
        catch (e) {
            err("undo", e);
        }
    }
    function undoBar(w) {
        try {
            const P = V92F.delPend;
            if (P && Date.now() - P.at < 5000 && !(FWDB.rates || []).some((x) => x && rKey(x) === rKey(P.rate) && rSig(x) === rSig(P.rate))) {
                V92F.undo = { rate: P.rate, at: Date.now() };
                V92F.delPend = null;
            }
            const old = w.querySelector(".v92fundo");
            if (old)
                old.remove();
            const U = V92F.undo;
            if (!U || Date.now() - U.at > 10 * 60e3)
                return;
            const t = [...w.querySelectorAll("table")].find(x => x.querySelector("tbody [data-frdel]"));
            const anchor = (t && (t.closest(".tw") || t)) || document.getElementById("fwdupst");
            if (!anchor)
                return;
            const r = U.rate;
            anchor.insertAdjacentHTML("beforebegin", `<div class="v92fundo" role="status" data-noi18n><span>${E(M(`削除しました：${coOf(r)}／${laneTxt(r)} ${priceTxt(r)}`, `Deleted: ${coOf(r)} / ${laneTxt(r)} ${priceTxt(r)}`))}</span><button type="button" class="btn g" data-v92fundo="1">${E(M("元に戻す", "Undo"))}</button></div>`);
        }
        catch (e) {
            err("undobar", e);
        }
    }
    function coField(w) {
        try {
            const co = document.getElementById("frCo");
            if (!co || co.dataset.v92)
                return;
            co.dataset.v92 = "1";
            const row = co.parentElement;
            if (!row)
                return;
            if (realMode()) {
                const lb = row.querySelector(".lbl");
                if (lb)
                    lb.textContent = M("登録する物流会社名（貴社）", "Company (yours)");
                return;
            }
            const det = document.createElement("details");
            det.className = "v92fco";
            det.setAttribute("data-noi18n", "");
            det.innerHTML = `<summary>${E(M(`登録する物流会社：${me()}（貴社）`, `Company: ${me()} (yours)`))}<span>${E(M("体験用：ほかの会社の見本を足す", "Demo: add another sample company"))}</span></summary>
        <p class="nn v92fcon">${E(M("体験用の欄です。ここを別の会社名に変えて登録すると、その名前の見本の物流会社としてレートが入り、相見積の社数が増えます（本番の物流会社アカウントでは、貴社の会社名でだけ登録され、この欄は変えられません）。ふだんは変えずに、貴社のレートを登録してください。", "Demo only. If you change this name, the rates are registered as another sample forwarder and the number of companies in comparisons increases. In a live forwarder account rates are always registered under your own company name."))}</p>`;
            row.insertAdjacentElement("beforebegin", det);
            det.appendChild(row);
            const hint = [...row.querySelectorAll(".nn")].find(x => /複数社|相見積/.test(x.textContent || ""));
            if (hint)
                hint.style.display = "none";
            const lb = row.querySelector(".lbl");
            if (lb)
                lb.textContent = M("見本として登録する会社名", "Sample company name");
            const sync = () => {
                const v = String(co.value || "").trim(), mine = !v || v === me();
                det.classList.toggle("other", !mine);
                const s = det.querySelector("summary");
                if (s && s.firstChild)
                    s.firstChild.nodeValue = mine ? M(`登録する物流会社：${me()}（貴社）`, `Company: ${me()} (yours)`) : M(`登録する物流会社：${v}（体験用の見本の会社として登録します・貴社ではありません）`, `Company: ${v} (registered as a sample company, not yours)`);
                if (!mine)
                    det.open = true;
            };
            co.addEventListener("input", sync);
            sync();
        }
        catch (e) {
            err("cofield", e);
        }
    }
    const others = (reqs) => {
        const m = me(), S = new Set();
        try {
            (reqs || FWDB.reqs || []).forEach((r) => (r && r.legs || []).forEach((l) => (l && l.offers || []).forEach((o) => {
                if (o && o.co && o.co !== m)
                    S.add(String(o.co));
            })));
            if (!reqs)
                (FWDB.rates || []).forEach((r) => {
                    if (r && r.co && r.co !== m)
                        S.add(String(r.co));
                });
        }
        catch (e) { }
        return [...S];
    };
    const othersTxt = (L) => L.length ? L.slice(0, 3).map(x => "「" + x + "」").join("") + (L.length > 3 ? "など" : "") : "";
    function unitCap() {
        try {
            const md = document.getElementById("frMode"), cap = document.getElementById("v92fpu");
            if (!md || !cap)
                return;
            const m = UP(md.value || "LCL");
            cap.textContent = /FCL/.test(m) ? M("運賃（円／本＝コンテナ1本）", "Rate (JPY per container)") : /AIR/.test(m) ? M("運賃（円／kg）", "Rate (JPY per kg)") : M("運賃（円／m³）", "Rate (JPY per m³)");
        }
        catch (e) { }
    }
    function manualForm(w) {
        try {
            const pol = document.getElementById("frPol");
            if (!pol)
                return;
            if (!pol.closest(".v92ffl")) {
                const row = pol.closest(".rw");
                const cap = (id, text, ph, capId) => {
                    const el = document.getElementById(id);
                    if (!el || el.closest(".v92ffl"))
                        return;
                    const lb = document.createElement("label");
                    lb.className = "v92ffl";
                    lb.setAttribute("data-noi18n", "");
                    lb.innerHTML = `<span${capId ? ` id="${capId}"` : ""}>${E(text)}</span>`;
                    el.insertAdjacentElement("beforebegin", lb);
                    lb.appendChild(el);
                    if (ph)
                        el.placeholder = ph;
                };
                cap("frPol", M("仕出港", "Port of loading"), M("例：横浜港", "e.g. Yokohama"));
                cap("frPod", M("仕向港（港の名前）", "Destination port"), M("例：香港", "e.g. Hong Kong"));
                cap("frMode", M("形態", "Mode"), "");
                cap("frPrice", M("運賃（円／m³）", "Rate (JPY per m³)"), M("例：9500", "e.g. 9500"), "v92fpu");
                cap("frTt", M("日数（日）", "Transit days"), M("例：7", "e.g. 7"));
                const pr = document.getElementById("frPrice"), tt = document.getElementById("frTt");
                if (pr)
                    pr.setAttribute("inputmode", "numeric");
                if (tt)
                    tt.setAttribute("inputmode", "numeric");
                const vl = w.querySelector("label.v68vl");
                if (vl)
                    vl.classList.add("v92ffl");
                if (row) {
                    row.classList.add("v92ffr");
                    let lbl = row.previousElementSibling;
                    while (lbl && !(lbl.matches && lbl.matches("p.lbl")))
                        lbl = lbl.previousElementSibling;
                    if (lbl && !lbl.closest(".v92fman")) {
                        const man = document.createElement("div");
                        man.className = "v92fman";
                        lbl.insertAdjacentElement("beforebegin", man);
                        let n = lbl;
                        while (n) {
                            const nx = n.nextElementSibling;
                            man.appendChild(n);
                            n = nx;
                        }
                        man.insertAdjacentHTML("beforeend", `<p class="nn v92fmann" data-noi18n>${E(M("運賃は形態ごとの単位で入れます（LCL＝1m³あたり・FCL＝コンテナ1本あたり・AIR＝1kgあたり）。小包（クーリエ）の料金は重量帯ごとの表のため、レート表の取り込みで登録します。", "Enter the rate in the unit of the mode (LCL per m³, FCL per container, AIR per kg). Courier tariffs are weight-band tables, so register them by importing a rate sheet."))}</p>`);
                    }
                }
            }
            unitCap();
        }
        catch (e) {
            err("manform", e);
        }
    }
    document.addEventListener("change", ev => {
        try {
            const t = ev.target;
            if (t && t.id === "frMode")
                unitCap();
        }
        catch (e) { }
    }, true);
    document.addEventListener("input", ev => {
        try {
            const t = ev.target;
            if (t && t.id === "frMode")
                unitCap();
        }
        catch (e) { }
    }, true);
    function ratesTable(w) {
        try {
            const t = [...w.querySelectorAll("table")].find(x => x.querySelector("tbody [data-frdel]"));
            if (!t || t.dataset.v92)
                return;
            t.dataset.v92 = "1";
            const R = FWDB.rates || [];
            const canon = (p) => {
                try {
                    return (typeof window.v90fCanon === "function") ? window.v90fCanon(p) : String(p || "").trim();
                }
                catch (e) {
                    return String(p || "").trim();
                }
            };
            const gk = (r) => [UP(r.mode), canon(r.pod), String(r.co || ""), polKey(r.pol)].join("|");
            const grp = {};
            R.forEach((r) => {
                if (r)
                    (grp[gk(r)] = grp[gk(r)] || []).push(r);
            });
            const hr = t.querySelector("thead tr");
            if (hr && !hr.querySelector(".v92fnoteh")) {
                const th = document.createElement("th");
                th.className = "v92fnoteh";
                th.textContent = M("備考", "Notes");
                hr.insertBefore(th, hr.lastElementChild);
            }
            t.querySelectorAll("tbody tr").forEach((tr) => {
                const b = tr.querySelector("[data-frdel]");
                if (!b)
                    return;
                const r = R[+b.dataset.frdel];
                if (!r)
                    return;
                if (!tr.querySelector("td.v92fnote")) {
                    const td = document.createElement("td");
                    td.className = "v92fnote";
                    td.setAttribute("data-lb", M("備考", "Notes"));
                    td.textContent = String(r.note || "");
                    tr.insertBefore(td, tr.lastElementChild);
                }
                const dup = tr.querySelector(".v90fdup");
                if (dup) {
                    const G = grp[gk(r)] || [];
                    const names = [...new Set(G.map((x) => `${x.pol} → ${x.pod}`))];
                    if (G.length < 2)
                        dup.remove();
                    else {
                        dup.textContent = M(`同じ区間の登録 ${G.length}本（書き方違い）`, `${G.length} entries for the same lane`);
                        dup.title = M(`同じ会社・同じ形態で、同じ区間が ${G.length}本あります：${names.join("／")}。書き方をそろえて1本にすると、置き換えが効きます。`, `Same company and mode: ${names.join(" / ")}`);
                    }
                }
                const vc = tr.children[5];
                if (vc && r.valid && !vc.querySelector(".v92fbadv")) {
                    const d = normDate(r.valid);
                    if (d.why)
                        vc.insertAdjacentHTML("beforeend", `<br><span class="p mid v92fbadv" data-noi18n style="font-size:8.5px" title="${E(M("有効期限を日付として読めないため、このレートは見積に使いません。「入れ直す」か、表を直して取り込み直してください。", "The validity cannot be read as a date, so this rate is not used."))}">${E(M("期限を読めません", "Unreadable date"))}</span>`);
                }
            });
            try {
                const card = t.closest(".c");
                if (card && typeof uxApplyFilter === "function" && (card.querySelector("[data-uxq]") || {}).value)
                    uxApplyFilter(card);
            }
            catch (e) { }
        }
        catch (e) {
            err("ratestable", e);
        }
    }
    function tabOk(tr) {
        try {
            const f = (typeof V33FW !== "undefined" && V33FW) ? String(V33FW.f || "") : "";
            if (!f)
                return true;
            const st = tr.dataset.v33st || "none", need = tr.dataset.v33rv === "1";
            return f === "rv" ? (need && st !== "done") : st === f;
        }
        catch (e) {
            return true;
        }
    }
    function filterFix(card) {
        try {
            if (!card || !on())
                return;
            const tb = card.querySelector("table tbody");
            if (!tb)
                return;
            const inbox = !!card.querySelector("table[data-v33fw]"), rates = !!tb.querySelector("[data-frdel]");
            if (!inbox && !rates)
                return;
            const rows = [...tb.rows];
            if (inbox)
                rows.forEach(tr => {
                    if (!tr.hidden && !tabOk(tr))
                        tr.hidden = true;
                });
            const tbl = tb.closest("table");
            const folded = (tr) => rates && tbl && tbl.classList.contains("v89fhide") && tr.classList.contains("v89fexp");
            const vis = rows.filter(tr => !tr.hidden && !folded(tr)).length;
            const c = card.querySelector("[data-uxn]");
            if (c)
                c.textContent = `${vis}/${rows.length}${M("件", "")}`;
            const tw = (tb.closest(".tw") || tbl);
            let em = card.querySelector(".v92fempty");
            if (vis || !rows.length) {
                if (em)
                    em.remove();
                return;
            }
            if (!em) {
                em = document.createElement("div");
                em.className = "v92fempty";
                em.setAttribute("role", "status");
                em.setAttribute("data-noi18n", "");
                tw.insertAdjacentElement("afterend", em);
            }
            const q = String((card.querySelector("[data-uxq]") || {}).value || "").trim();
            const chip = card.querySelector("[data-uxf].on");
            const chipT = chip && chip.dataset.kw ? String(chip.textContent || "").trim() : "";
            const tab = inbox ? card.querySelector('.v33tab[aria-selected="true"]') : null;
            const tabT = tab && tab.dataset.fwf ? String((tab.firstChild && tab.firstChild.nodeValue) || tab.textContent || "").trim() : "";
            const cond = [q ? `「${q}」` : "", chipT ? (inbox ? M("見積の状況：", "Status: ") : M("形態：", "Mode: ")) + chipT : "", tabT ? M("担当・対応：", "Assignment: ") + tabT : ""].filter(Boolean).join("・");
            em.innerHTML = `${E(inbox ? M("この絞り込みに当たる依頼はありません", "No requests match these filters") : M("この絞り込みに当たるレートはありません", "No rates match these filters"))}${cond ? `（${E(cond)}）` : ""}。<br><button type="button" class="btn g" data-v92fclr="1">${E(M("絞り込みを外して、すべて表示", "Clear filters"))}</button>`;
        }
        catch (e) {
            err("filter", e);
        }
    }
    if (typeof uxApplyFilter === "function") {
        const __af92 = uxApplyFilter;
        uxApplyFilter = function (card) {
            const o = __af92.apply(this, arguments);
            try {
                filterFix(card);
            }
            catch (e) { }
            return o;
        };
    }
    document.addEventListener("click", ev => {
        try {
            const t = ev.target;
            const b = t && t.closest && t.closest("[data-v92fclr]");
            if (!b || !on())
                return;
            ev.preventDefault();
            const card = b.closest(".c");
            if (!card)
                return;
            const q = card.querySelector("[data-uxq]");
            if (q)
                q.value = "";
            card.querySelectorAll("[data-uxf]").forEach((x) => x.classList.toggle("on", !x.dataset.kw));
            if (card.querySelector("table[data-v33fw]") && typeof V33FW !== "undefined" && V33FW && V33FW.f) {
                V33FW.f = "";
                fwdRender();
                return;
            }
            if (typeof uxApplyFilter === "function")
                uxApplyFilter(card);
        }
        catch (e) {
            err("clr", e);
        }
    }, true);
    const md2 = (ms) => { const d = new Date(ms); return (d.getMonth() + 1) + "/" + d.getDate(); };
    function inboxFix(w) {
        try {
            const R = FWDB.reqs || [];
            const ov = { at: Date.now() };
            w.querySelectorAll(".v70fov [data-v70fgo]").forEach((b) => { const n = b.querySelector("b"); ov[b.getAttribute("data-v70fgo")] = n ? +String(n.textContent).replace(/[^\d]/g, "") || 0 : 0; });
            const ex = w.querySelector(".v70fov [data-v90fov] b");
            if (ex)
                ov.exp = +String(ex.textContent).replace(/[^\d]/g, "") || 0;
            if (w.querySelector(".v70fov"))
                V92F.ov = ov;
            const ac = w.querySelector(".uxfb .acfilt");
            if (ac && !ac.querySelector(".v92fcap") && w.querySelector("table[data-v33fw]"))
                ac.insertAdjacentHTML("afterbegin", `<span class="v92fcap" data-noi18n>${E(M("見積の状況：", "Quote status:"))}</span>`);
            const tabs = w.querySelector(".v33tabs");
            if (tabs && !tabs.querySelector(".v92fcap"))
                tabs.insertAdjacentHTML("afterbegin", `<span class="v92fcap" data-noi18n>${E(M("担当・対応：", "Assignment:"))}</span>`);
            w.querySelectorAll(".v33fwtask li.v33li").forEach((li) => {
                const bd = li.querySelector(".v33lv");
                if (!bd || bd.dataset.v92)
                    return;
                const m = /RQ-[A-Za-z0-9]+/.exec(li.textContent || "");
                if (!m)
                    return;
                let a = null;
                try {
                    a = (typeof v33FaOf === "function") ? v33FaOf(m[0]) : null;
                }
                catch (e) { }
                const due = a && a.task && +a.task.due;
                if (!due)
                    return;
                const r = R.find((x) => x && x.id === m[0]);
                bd.dataset.v92 = "1";
                const d = Math.round((new Date(due).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 864e5);
                if (d >= 0) {
                    bd.title = M(`対応の目安：${md2(due)}（依頼を受信した日${r && r.d ? " " + r.d : ""} から2日）`, `Target: ${md2(due)} (2 days after receipt)`);
                    return;
                }
                bd.removeAttribute("data-v38st");
                bd.classList.remove("v38st");
                bd.removeAttribute("tabindex");
                bd.setAttribute("data-noi18n", "");
                bd.textContent = M(`対応の目安 ${md2(due)} を ${-d}日 超過`, `${-d} days past the ${md2(due)} target`);
                bd.title = M(`対応の目安は、依頼を受信した日${r && r.d ? "（" + r.d + "）" : ""}から2日です（レートの有効期限ではありません）。この区間のレートを登録して見積を出すか、別の方法で荷主に答えたら「済み」を押してください。`, `The target is 2 days after the request was received (not a rate validity). Register a rate for this lane, or press Done after answering another way.`);
            });
            const lg = w.querySelector(".v79fwdlg");
            if (lg && /デモ物流①〜⑤株式会社など/.test(lg.textContent || "")) {
                const O = others().filter(x => !/^デモ物流[①-⑤]/.test(x));
                if (O.length || !others().length)
                    lg.textContent = String(lg.textContent).replace(/デモ物流①〜⑤株式会社など体験の世界のほかの物流会社（架空）には（他社）/, O.length ? `${othersTxt(O)}など見本（架空）のほかの物流会社には（他社）` : "ほかの物流会社には（他社）");
            }
            w.querySelectorAll("[data-v90fansopen]").forEach((b) => {
                if (b.dataset.v92)
                    return;
                b.dataset.v92 = "1";
                const r = R.find((x) => x && x.id === b.getAttribute("data-v90fansopen"));
                const has = !!r && (r.legs || []).some((l) => ownOffer(l));
                b.textContent = has ? M("回答の金額を直す", "Edit quoted rate") : M("レートを登録して回答", "Register a rate to quote");
                b.title = has ? M("貴社の見積のもとになっている「区間のレート」を直します（この依頼だけの金額ではなく、同じ区間のほかの依頼にも同じレートが使われます）。直すまで何も変わりません。", "Edits the lane rate behind your quote (it also applies to other requests on the same lane).")
                    : M("この依頼の区間のレートを登録すると、AI物流マンが見積を出します。", "Register a rate for this lane and the AI quotes it.");
            });
        }
        catch (e) {
            err("inbox", e);
        }
    }
    function inboxLayout(w) {
        try {
            const kids = [...w.children];
            const list = kids.find(c => c.classList && c.classList.contains("c") && c.querySelector("table[data-v33fw]"));
            if (!list)
                return;
            const g4 = kids.find(c => c.classList && c.classList.contains("g4") && c.querySelector(".kv"));
            if (g4 && !w.querySelector("details.k-v92more")) {
                const how = kids.find(c => c !== list && c.classList && c.classList.contains("c") && /AI物流マンのしくみ|How the AI|AI物流专员/.test((c.querySelector("h3") || {}).textContent || ""));
                const det = document.createElement("details");
                det.className = "k-v92more";
                det.innerHTML = `<summary data-noi18n>${E(M("数字の内訳（受信した依頼・AI自動回答・登録レーン・仮押さえ）", "Number details (requests received, AI auto-answers, lanes, holds)"))}${how ? E(M("と、AI物流マンのしくみ", " and how AI Logistics works")) : ""}</summary>`;
                list.insertAdjacentElement("afterend", det);
                det.appendChild(g4);
                if (how)
                    det.appendChild(how);
            }
            const tk = list.querySelector(".v33fwtask");
            if (!tk)
                return;
            const nt = tk.querySelector(".v73fnote");
            if (nt && !nt.closest("details.k-v92fold")) {
                const d = document.createElement("details");
                d.className = "k-v92fold";
                d.setAttribute("data-noi18n", "");
                d.innerHTML = `<summary>${E(M("「済み」を押すとどうなるか", "What happens when you press Done"))}</summary>`;
                nt.insertAdjacentElement("beforebegin", d);
                d.appendChild(nt);
            }
            if (!tk.querySelector(":scope > details.k-v92task")) {
                const lis = [...tk.querySelectorAll("li.v33li")];
                const lanes = lis.map(li => { const b = li.querySelector(".v33li-m b"); const m = b && /「(.+?)」/.exec(b.textContent || ""); return m ? m[1] : ""; }).filter(Boolean);
                const h4 = tk.querySelector(":scope > h4");
                const d = document.createElement("details");
                d.className = "k-v92task";
                let open = null;
                try {
                    open = sessionStorage.getItem("k-v92task");
                }
                catch (e) { }
                let rv = false;
                try {
                    rv = typeof V33FW !== "undefined" && !!V33FW && V33FW.f === "rv";
                }
                catch (e) { }
                d.open = open === "1" || (open == null && (rv || lis.length <= 1));
                const sm = document.createElement("summary");
                sm.setAttribute("data-noi18n", "");
                const ttl = h4 && h4.firstChild && h4.firstChild.nodeType === 3 ? String(h4.firstChild.nodeValue) : M("要確認のタスク", "Tasks to check");
                sm.innerHTML = `<span class="k-v92tt">${E(ttl)}<span class="v33cnt">${lis.length}</span></span><span class="k-v92ts">${E(M("レートが無くて見積を出せなかった依頼：", "Requests with no matching rate: "))}${E(lanes.slice(0, 4).join("／"))}${lanes.length > 4 ? E(M(" ほか", " …")) : ""}</span><span class="k-v92to">${E(M("開く・閉じる", "open / close"))}</span>`;
                d.appendChild(sm);
                [...tk.childNodes].forEach(n => {
                    if (n === h4) {
                        h4.remove();
                        return;
                    }
                    d.appendChild(n);
                });
                tk.appendChild(d);
                d.addEventListener("toggle", () => {
                    try {
                        sessionStorage.setItem("k-v92task", d.open ? "1" : "0");
                    }
                    catch (e) { }
                });
            }
        }
        catch (e) {
            err("inboxlayout", e);
        }
    }
    if (typeof v90fAnsOpen === "function") {
        const __ao92 = v90fAnsOpen;
        v90fAnsOpen = function (id) {
            const o = __ao92.apply(this, arguments);
            try {
                const sh = document.getElementById("v33sheet");
                const r = (FWDB.reqs || []).find((x) => x && x.id === id);
                if (!sh || !r || sh.querySelector(".v92fansn"))
                    return o;
                const h = [...sh.querySelectorAll("h3, h2, .v33sh-t, b")].find(x => /見積回答（金額を直す）|Quote reply/.test(x.textContent || ""));
                if (h && h.firstChild && h.firstChild.nodeType === 3)
                    h.firstChild.nodeValue = String(h.firstChild.nodeValue).replace("見積回答（金額を直す）", "回答の金額を直す（区間のレートを直します）");
                else if (h && !h.children.length)
                    h.textContent = String(h.textContent).replace("見積回答（金額を直す）", "回答の金額を直す（区間のレートを直します）");
                const p = sh.querySelector("p.nn");
                const way = fvMode() ? M("荷主が次に画面を開いたときに、この依頼の見積が組み直されて届きます。", "The shipper gets the re-built quote next time they open the screen.") : M("関係する依頼だけを同じ決まりで計算し直し、何が いくら→いくら になったかを画面に出します。", "Only the related requests are recalculated with the same rules, and the before/after amounts are shown.");
                const txt = M(`ここで直すのは「区間のレート」です。この依頼だけの金額（スポットの見積）は出せません。同じ区間のレートは、同じ区間のほかの依頼の見積にも使われます。「この区間の金額を直す」を押すと、物流レート管理の手入力の欄に今の値が入ります。直して「追加」を押すと、${way}「追加」を押すまで何も変わりません。`, `This edits the lane rate (a one-off price for this request alone is not available). The same lane rate is used for other requests on the lane. Press “Edit this lane's price” to prefill the manual form; after you press Add, ${way} Nothing changes until you press Add.`);
                if (p) {
                    p.textContent = txt;
                    p.classList.add("v92fansn");
                    p.setAttribute("data-noi18n", "");
                }
                const L = (typeof window.v90fOwnLegs === "function") ? window.v90fOwnLegs(r) : (r.legs || []).map((l) => ({ l, o: ownOffer(l) }));
                const cards = [...sh.querySelectorAll(".v90fansc")];
                L.forEach((it, i) => {
                    const c = cards[i], q = it && it.o && it.o.quote, rt = it && it.o && it.o.rate;
                    if (!c || !q || c.querySelector(".v92fansb"))
                        return;
                    const air = isAir(q.mode || (rt && rt.mode));
                    const fob = !!q.v56shipFob;
                    const rateT = rt ? `${rt.cur || "¥"}${(+rt.price || 0).toLocaleString()}${rt.unit || ""}` : "";
                    const brk = fob ? M(`見積合計 ${Y(q.total)} の内訳：${air ? "取扱いの諸掛" : "THC等諸掛"} ${Y(q.thc)}＋書類費 ${Y(q.doc)}。この依頼は FOB（${r.term || "FOB"}）のため、${air ? "航空運賃" : "海上運賃"}（${rateT}）は買い手の負担で、見積合計に入りません。運賃を直しても、この依頼の見積合計は変わりません（日数・有効期限は相見積の比較に反映されます）。`, `Total ${Y(q.total)} = terminal charges ${Y(q.thc)} + documentation ${Y(q.doc)}. This request is FOB, so the freight (${rateT}) is paid by the buyer and not included.`)
                        : M(`見積合計 ${Y(q.total)} の内訳：運賃 ${Y(q.freight)}（${rateT}${q.basis ? " × " + q.basis : ""}）＋${q.courier ? "" : `THC等諸掛 ${Y(q.thc)}＋書類費 ${Y(q.doc)}`}。運賃を直すと、見積合計も変わります。`, `Total ${Y(q.total)} = freight ${Y(q.freight)} (${rateT}${q.basis ? " × " + q.basis : ""}) + charges ${Y((+q.thc || 0) + (+q.doc || 0))}.`);
                    const k = c.querySelector(".v90fansk");
                    (k || c).insertAdjacentHTML(k ? "afterend" : "beforeend", `<div class="v92fansb" data-noi18n>${E(brk)}</div>`);
                });
                sh.querySelectorAll("[data-v90fans]").forEach((b) => {
                    if (/この区間の金額を直す/.test(b.textContent || ""))
                        b.textContent = M("この区間の金額を直す（レート管理で）", "Edit this lane's price (in Rates)");
                });
            }
            catch (e) {
                err("ansopen", e);
            }
            return o;
        };
    }
    const offSeason = (x) => {
        try {
            const m = /(\d{1,2})\s*〜\s*(\d{1,2})月/.exec(String((x && x.t) || ""));
            if (!m)
                return false;
            const mo = +today().slice(5, 7), a = +m[1], b = +m[2];
            if (!(mo >= 1 && mo <= 12) || !(a >= 1 && a <= 12) || !(b >= 1 && b <= 12))
                return false;
            return a <= b ? (mo < a || mo > b) : (mo < a && mo > b);
        }
        catch (e) {
            return false;
        }
    };
    if (typeof fwdScoreOffers === "function") {
        const __so92 = fwdScoreOffers;
        fwdScoreOffers = function (rs, mode, cbm, etd, situ) {
            try {
                if (Array.isArray(situ) && situ.some((x) => x && x.risk && offSeason(x))) {
                    const a = [...arguments];
                    a[4] = situ.map((x) => (x && x.risk && offSeason(x)) ? Object.assign({}, x, { risk: 0 }) : x);
                    return __so92.apply(this, a);
                }
            }
            catch (e) { }
            return __so92.apply(this, arguments);
        };
    }
    if (typeof openFwdQuote === "function") {
        const __oq92 = openFwdQuote;
        openFwdQuote = function (id) {
            const o = __oq92.apply(this, arguments);
            try {
                const pn = document.getElementById("pn");
                if (pn && on()) {
                    const r = (FWDB.reqs || []).find((x) => x && x.id === id);
                    const tw = document.createTreeWalker(pn, NodeFilter.SHOW_TEXT, null);
                    const hit = [];
                    while (tw.nextNode()) {
                        const v = tw.currentNode.nodeValue || "";
                        if (/時期外/.test(v) && /（逼迫区間のため最速案に加点）/.test(v))
                            hit.push(tw.currentNode);
                    }
                    hit.forEach(n => { n.nodeValue = String(n.nodeValue).replace(/（逼迫区間のため最速案に加点）/g, "（この順位は、見積を組んだ日の繁忙期の加点＝最速案に＋5点が入ったままです。いまは時期外のため、順位は要確認）"); });
                    const nt = pn.querySelector(".v69fownnote");
                    if (nt && /デモ物流①〜⑤株式会社などは/.test(nt.textContent || "")) {
                        const O = others(r ? [r] : undefined).filter(x => !/^デモ物流[①-⑤]/.test(x));
                        const all = others(r ? [r] : undefined);
                        if (O.length || !all.length)
                            nt.textContent = String(nt.textContent).replace(/デモ物流①〜⑤株式会社などは、体験の世界の別の物流会社（架空）です。/, O.length ? `${othersTxt(O)}は、見本（架空）の別の物流会社です。` : "");
                    }
                }
            }
            catch (e) {
                err("quote", e);
            }
            return o;
        };
    }
    if (typeof uxPalItems === "function") {
        const __pal92 = uxPalItems;
        uxPalItems = function () {
            let items = __pal92.apply(this, arguments) || [];
            try {
                const RD = window.RDX;
                if (on() && RD && typeof RD.goKey === "function" && RD.fhome !== undefined)
                    items = items.map((i) => (i && i.v70f && /全体の状況（ダッシュボード）|Overview \(dashboard\)/.test(String(i.t || ""))) ? Object.assign({}, i, { t: M("全体の状況（ダッシュボード）→ ホーム", "Overview (dashboard) → Home"), run: () => {
                            try {
                                if (typeof RD.v92fGoOv === "function")
                                    RD.v92fGoOv();
                                else
                                    RD.goKey("fhome");
                            }
                            catch (e) { }
                        } }) : i);
            }
            catch (e) { }
            return items;
        };
    }
    function afterRender() {
        if (!on())
            return;
        snap();
        const w = document.getElementById("well");
        if (!w)
            return;
        const pg = (typeof fwdCur !== "undefined" && fwdCur) || "finbox";
        if (pg === "finbox") {
            inboxFix(w);
            inboxLayout(w);
        }
        if (pg === "finbox" || pg === "frates") {
            try {
                w.querySelectorAll(".c").forEach((c) => {
                    if (c.querySelector("table[data-v33fw]") || c.querySelector("tbody [data-frdel]"))
                        filterFix(c);
                });
            }
            catch (e) { }
        }
        if (pg === "frates") {
            try {
                manualForm(w);
                ratesTable(w);
                coField(w);
                drawImp();
                undoBar(w);
                const h = repBoxHtml();
                const old = w.querySelector(".v92fre");
                if (old)
                    old.remove();
                if (h) {
                    const st = document.getElementById("fwdupst");
                    if (st)
                        st.insertAdjacentHTML("afterend", h);
                }
            }
            catch (e) {
                err("repbox", e);
            }
        }
    }
    if (typeof fwdLoad === "function") {
        const __fl92 = fwdLoad;
        fwdLoad = function () {
            const o = __fl92.apply(this, arguments);
            try {
                fixDates();
            }
            catch (e) { }
            return o;
        };
    }
    if (typeof fwdRateFile === "function") {
        const __rff92 = fwdRateFile;
        fwdRateFile = async function (f) {
            V92F.diag = null;
            const o = await __rff92.apply(this, arguments);
            try {
                const D = V92F.diag;
                if (D && on() && !D.rows.length && D.skipped.length) {
                    V92F.diag = null;
                    const st = document.getElementById("fwdupst");
                    if (st && !st.querySelector(".v92fimp"))
                        st.insertAdjacentHTML("beforeend", `<div class="v92fimp res" data-noi18n role="status"><p class="v92fimpk"><b>${E(M(`読めなかった行（${D.skipped.length}行）と理由`, `Unreadable rows (${D.skipped.length}) and reasons`))}${f && f.name ? "：" + E(f.name) : ""}</b></p><ul class="v92fimpu">${D.skipped.slice(0, 40).map((s) => `<li><b>${s.line}${E(M("行目", ""))}</b>：${E(s.why)}${s.raw ? `<code class="raw">${E(s.raw)}</code>` : ""}</li>`).join("")}</ul></div>`);
                }
            }
            catch (e) {
                err("ratefile", e);
            }
            return o;
        };
    }
    if (typeof fwdRender === "function") {
        const __fr92 = fwdRender;
        fwdRender = function () {
            const o = __fr92.apply(this, arguments);
            try {
                afterRender();
            }
            catch (e) {
                err("after", e);
            }
            return o;
        };
    }
    try {
        const st = document.createElement("style");
        st.id = "v92fwdcss";
        st.textContent = `.v92fre{margin:10px 0 0;padding:10px 12px;border:1px solid var(--line,#DCE5F0);border-left:4px solid var(--bl,#0064BF);border-radius:8px;background:var(--surface-2,#F7FAFE);font-size:12px;line-height:1.7}
.v92fre ul{margin:6px 0 0;padding-left:18px}.v92fre li{margin:2px 0}.v92fre li.ng{color:var(--crit,#C0392B);font-weight:700}.v92fre li.ok{color:var(--good,#1B7F4B);font-weight:700}.v92fre .v92fren{margin:6px 0 0;font-size:11px;color:var(--ink-3,#6B7A90)}
.v92fimp{margin:8px 0 0;padding:11px 13px;border:1px solid var(--or,#E8730C);border-radius:8px;background:var(--surface,#fff);font-size:12px;line-height:1.7;color:var(--ink,#1F2D3D)}
.v92fimp.res{border-color:var(--line,#DCE5F0);background:var(--surface-2,#F7FAFE)}
.v92fimp .v92fimph{margin:0 0 2px;font-size:13px}.v92fimp .v92fimps{margin:2px 0 6px;font-size:11.5px;color:var(--ink-2,#4A5A70)}.v92fimp .v92fimpk{margin:8px 0 2px;color:var(--crit,#C0392B)}
.v92fimpt{overflow:auto;max-height:340px;border:1px solid var(--line,#DCE5F0);border-radius:6px}
.v92fimpt table{width:100%;border-collapse:collapse;font-size:11.5px}.v92fimpt th,.v92fimpt td{padding:5px 8px;border-bottom:1px solid var(--line,#DCE5F0);text-align:left;vertical-align:top}
.v92fimpt th{position:sticky;top:0;background:var(--surface-2,#F3F6FA);font-weight:700;white-space:nowrap}.v92fimpt td.num,.v92fimpt th.num{text-align:right;white-space:nowrap}.v92fimpt td.n{white-space:nowrap}
.v92fimpt td b{white-space:nowrap}.v92fimpt td .v92fnt{margin-top:3px;font-size:11px;line-height:1.55;color:var(--warn,#8A5A00)}
.v92fimpt tr.exp td,.v92fimpt tr.dup td{background:var(--surface-2,#F7F7F7);color:var(--ink-3,#6B7A90)}
.v92fimpu{margin:2px 0 4px;padding-left:18px}.v92fimpu li{margin:2px 0}.v92fimpu .raw{display:block;font:inherit;font-size:11px;color:var(--ink-3,#6B7A90);background:none;padding:0;white-space:normal;word-break:break-all}
.v92fundo{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin:8px 0;padding:8px 12px;border:1px solid var(--line,#DCE5F0);border-left:4px solid var(--or,#E8730C);border-radius:8px;background:var(--surface-2,#FFF8F0);font-size:12px}
.v92fundo span{flex:1 1 220px}
.v92fco{margin-top:8px;border:1px dashed var(--line,#DCE5F0);border-radius:8px;padding:6px 10px;font-size:12px}
.v92fco summary{cursor:pointer;font-weight:700;list-style-position:inside}.v92fco summary span{margin-left:10px;font-weight:400;font-size:11px;color:var(--ink-3,#6B7A90);text-decoration:underline dotted}
.v92fco.other{border-color:var(--or,#E8730C);background:var(--surface-2,#FFF8F0)}.v92fco .v92fcon{margin:6px 0 2px}
.v92ffl{display:inline-flex;flex-direction:column;gap:2px;font-size:10.5px;font-weight:700;color:var(--ink-2,#4A5A70);vertical-align:bottom}
.v92ffl > span{white-space:nowrap}.v92ffr{align-items:flex-end !important;gap:8px !important}.v92fman .v92fmann{margin-top:6px}
.v92fcap{font-size:10.5px;font-weight:700;color:var(--ink-3,#6B7A90);margin-right:4px;align-self:center}
.v92fempty{margin:8px 0 0;padding:14px;border:1px dashed var(--line,#DCE5F0);border-radius:8px;text-align:center;font-size:12px;color:var(--ink-2,#4A5A70);line-height:1.8}
.v92fnote{font-size:10.5px;color:var(--ink-2,#4A5A70);max-width:18em}
.v92fansb{flex:1 1 100%;font-size:11px;line-height:1.65;color:var(--ink-2,#4A5A70);background:var(--surface-2,#F7FAFE);border-radius:6px;padding:6px 9px}
/* cross-04 物流レート管理：1列にして、登録済みレートの表を画面の幅いっぱいに。枠の高さの上限はやめる（区間は折り返さない） */
#well .g2:has(#frAdd){grid-template-columns:minmax(0,1fr) !important}
#well .g2:has(#frAdd) .tw:has([data-frdel]){max-height:none !important;overflow-x:auto}
#well .tw table:has([data-frdel]){width:100%}
#well .tw table:has([data-frdel]) td:nth-child(2) b,#well .tw table:has([data-frdel]) td:nth-child(3),#well .tw table:has([data-frdel]) td:nth-child(4),#well .tw table:has([data-frdel]) td:nth-child(5),#well .tw table:has([data-frdel]) td:nth-child(6),#well .tw table:has([data-frdel]) td:last-child{white-space:nowrap}
#well .tw table:has([data-frdel]) td.v92fnote{min-width:8em;max-width:22em}
/* cross-03 見積受信箱：依頼の表を枠に収める（担当・状態の列は折り返す／区間・貨物の列に幅）。スマホのカード表示（820px 以下）は今のまま */
@media (min-width:821px){
#well table.ux32inbox{width:100%;min-width:0 !important}
#well table.ux32inbox td.v33fwst{white-space:normal !important;min-width:10.5em}
#well table.ux32inbox td.v33fwst .btn{display:block;margin:5px 0 0 !important;width:100%;white-space:nowrap;text-align:center}
#well table.ux32inbox td.v33fwst .v33lv{display:inline-block;margin:0 3px 2px 0;white-space:nowrap}
#well table.ux32inbox td:nth-child(3){min-width:7.5em}
#well table.ux32inbox td:nth-child(4){min-width:9.6em}
#well table.ux32inbox td:nth-child(5){min-width:9.5em}
#well table.ux32inbox td:nth-child(6){min-width:8.5em}
#well table.ux32inbox td:last-child{white-space:nowrap;width:1%}
#well table.ux32inbox .ux32clamp{max-width:14em}
}
/* cross-10 見積受信箱：たたんだ箱 */
#well details.k-v92more{margin-top:14px}
#well details.k-v92more > summary{cursor:pointer;font-weight:700;padding:8px 4px}
#well details.k-v92more[open] > summary{margin-bottom:8px}
#well details.k-v92fold{margin:4px 0 8px}
#well details.k-v92fold > summary{cursor:pointer;font-weight:700;color:var(--bl,#0064BF)}
#well .v33fwtask details.k-v92task > summary{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;cursor:pointer;list-style:none}
#well .v33fwtask details.k-v92task > summary::-webkit-details-marker{display:none}
#well .v33fwtask .k-v92tt{font-weight:800;display:inline-flex;align-items:center;gap:8px}
#well .v33fwtask .k-v92ts{flex:1 1 300px;min-width:0;color:var(--ink-2,#4A5A70);line-height:1.5}
#well .v33fwtask .k-v92to{font-weight:700;color:var(--bl,#0064BF);white-space:nowrap}
#well .v33fwtask .k-v92to::before{content:"▸ "}
#well .v33fwtask details[open].k-v92task .k-v92to::before{content:"▾ "}
#well .v33fwtask details.k-v92task[open] > summary{margin-bottom:8px}`;
        document.head.appendChild(st);
    }
    catch (e) { }
})();
