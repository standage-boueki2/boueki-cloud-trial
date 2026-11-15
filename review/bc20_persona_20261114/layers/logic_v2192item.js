(function () {
    const W = window;
    if (W.__v2192item)
        return;
    W.__v2192item = 1;
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const lang = () => {
        try {
            const el = document.getElementById("lang");
            const v = String((el && el.value) || "ja");
            return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
        }
        catch (e) {
            return "ja";
        }
    };
    const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const NF = (s) => {
        let x = String(s == null ? "" : s);
        try {
            x = x.normalize("NFKC");
        }
        catch (e) { }
        return x;
    };
    const hasV = (v) => Array.isArray(v) ? v.length > 0 : !!(v != null && String(v).trim());
    const fn = (name) => {
        try {
            const f = W[name];
            return typeof f === "function" ? f : null;
        }
        catch (e) {
            return null;
        }
    };
    const say = (m) => {
        try {
            const t = fn("toast");
            if (t)
                t(m);
        }
        catch (e) { }
    };
    const warn = (k, e) => {
        try {
            console.warn("[v2192item] " + k, e);
        }
        catch (x) { }
    };
    const userTen = () => {
        try {
            return (typeof TEN !== "undefined" && TEN && (TEN.src === "upload" || TEN.src === "sample2")) ? TEN : null;
        }
        catch (e) {
            return null;
        }
    };
    const indOf = (t) => {
        try {
            const f = fn("v68indOf");
            return f ? String(f(t) || "other") : "other";
        }
        catch (e) {
            return "other";
        }
    };
    const catOf = (t) => String((t && t.cat) || "").trim();
    let BUSY = 0;
    const persist = (t) => {
        if (BUSY)
            return;
        BUSY = 1;
        try {
            const sv = fn("saveTen");
            if (sv)
                sv();
        }
        catch (e) { }
        BUSY = 0;
    };
    const OPENB = "（(［[【「『〔", CLOSEB = "）)］]】」』〕";
    const P_COMMA = "", P_COL = "", P_FCOL = "", P_EQ = "", P_FEQ = "", P_SL = "";
    const protectNum = (s) => String(s == null ? "" : s).replace(/(\d)[,，](?=\d{3}(?!\d))/g, "$1" + P_COMMA);
    function protectIn(s) {
        let d = 0, o = "";
        for (const ch of Array.from(String(s == null ? "" : s))) {
            if (OPENB.indexOf(ch) >= 0)
                d++;
            else if (CLOSEB.indexOf(ch) >= 0)
                d = Math.max(0, d - 1);
            o += d > 0 ? (ch === ":" ? P_COL : ch === "：" ? P_FCOL : ch === "=" ? P_EQ : ch === "＝" ? P_FEQ : ch) : ch;
        }
        return o;
    }
    const restore = (s) => String(s == null ? "" : s).replace(//g, ",").replace(//g, ":").replace(//g, "：").replace(//g, "=").replace(//g, "＝").replace(//g, "／");
    const hasP = (s) => /[-]/.test(String(s == null ? "" : s));
    function splitTop(s, isSep) {
        const out = [];
        const A = Array.from(String(s));
        let c = "", d = 0, sep = "";
        for (let i = 0; i < A.length; i++) {
            const ch = A[i];
            if (OPENB.indexOf(ch) >= 0)
                d++;
            else if (CLOSEB.indexOf(ch) >= 0)
                d = Math.max(0, d - 1);
            if (d === 0 && isSep(ch, A[i - 1] || "", A[i + 1] || "")) {
                out.push({ t: c, sep });
                c = "";
                sep = ch;
                continue;
            }
            c += ch;
        }
        out.push({ t: c, sep });
        return out;
    }
    const SEP_LIST = (ch, a, b) => "、，,;；\n／".indexOf(ch) >= 0 || (ch === "/" && !/\d/.test(a) && !/\d/.test(b));
    const SEP_DOT = (ch, a, b) => ch === "・" || ch === "･" || SEP_LIST(ch, a, b);
    const JP = /[ぁ-んァ-ヶ一-龠々]/;
    function kvOf(x) {
        const A = Array.from(String(x));
        let d = 0, n = 0;
        for (let i = 0; i < A.length; i++) {
            const ch = A[i];
            if (OPENB.indexOf(ch) >= 0)
                d++;
            else if (CLOSEB.indexOf(ch) >= 0)
                d = Math.max(0, d - 1);
            if (d === 0 && (ch === ":" || ch === "：" || ch === "=" || ch === "＝")) {
                const k = A.slice(0, i).join("").trim(), v = A.slice(i + 1).join("").trim();
                if (!k || !v || k.length > 20 || !/[^\d\s.]/.test(k) || (ch === ":" && /^\/\//.test(v)))
                    return null;
                return [k, v];
            }
            if (d === 0)
                n++;
            if (n > 22)
                return null;
        }
        return null;
    }
    function pairOf(x) {
        const m = String(x).match(/^([^\s　\d（(:：=＝]{1,14})[ 　]+(\S.{0,40})$/);
        if (!m)
            return null;
        const k = m[1], v = m[2].trim();
        if (!(/\d/.test(v) || JP.test(k)))
            return null;
        return [k, v];
    }
    const cleanLabel = (l) => String(l == null ? "" : l).replace(/^[\s【\[「『・]+|[\s】\]」』:：]+$/g, "").trim().slice(0, 24) || "成分・材質";
    const cell = (s, n) => restore(String(s == null ? "" : s)).replace(/\s+/g, " ").trim().slice(0, n);
    function parseSpec(label, value) {
        const lab = cleanLabel(label);
        const s = protectNum(String(value == null ? "" : value).replace(/\r/g, "")).trim();
        if (!s)
            return [];
        const rows = [];
        const toks = splitTop(s, SEP_LIST).map(x => ({ t: x.t.trim(), sep: x.sep })).filter(x => x.t);
        if (toks.some(x => !!kvOf(x.t))) {
            let curRow = null;
            const pre = [];
            toks.forEach(tk => {
                const kv = kvOf(tk.t);
                if (kv) {
                    curRow = [kv[0], kv[1], ""];
                    rows.push(curRow);
                }
                else if (curRow)
                    curRow[1] += (tk.sep === "\n" || !tk.sep ? "／" : tk.sep) + tk.t;
                else
                    pre.push(tk.t);
            });
            if (pre.length)
                rows.unshift([lab, pre.join("、"), ""]);
        }
        else {
            const ps = splitTop(s, SEP_DOT).map(x => x.t.trim()).filter(Boolean);
            const pr = ps.map(pairOf);
            if (ps.length >= 2 && pr.filter(Boolean).length >= 2) {
                const rest = ps.filter((x, i) => !pr[i]);
                if (rest.length)
                    rows.push([lab, rest.join("・"), ""]);
                pr.forEach(p => {
                    if (p)
                        rows.push([p[0], p[1], ""]);
                });
            }
            else
                rows.push([lab, s, ""]);
        }
        return rows.map(r => [cell(r[0], 40), cell(r[1], 300), cell(r[2], 120)]).filter(r => r[0] || r[1]);
    }
    const INTAKE = /^(?:1日|一日|1回|一回|毎日|朝晩|朝夕|食後|食前|就寝前)[^、。]{0,24}?(?:\d+|[一二三四五六七八九十]+)\s*(?:粒|錠|カプセル|包|袋|本|杯|さじ|スプーン|ml|g|滴)|^(?:摂取|お?召し上がり|飲み方)(?:の)?(?:目安|方法|方)/i;
    const NOTNAME = /(?:なし|無し|不使用|無添加|不検出|済み?|適合|対応|以上|以下|未満|処理|保存|使用|可能|あり)$/;
    const nameLike = (p) => p.length >= 2 && p.length <= 30 && /[ぁ-んァ-ヶ一-龠々a-zA-Z]/.test(p) && !/^[A-Za-z]?\d/.test(NF(p)) && !/^[A-Za-z]\d*$/.test(NF(p)) && !NOTNAME.test(p) && !INTAKE.test(NF(p));
    const PCT = /^(.+?)\s*(\d+(?:\.\d+)?\s*[%％])$/;
    function fixFoodRows(t) {
        const rows = Array.isArray(t.compRows) ? t.compRows : [];
        const out = [], intake = [];
        let ch = false;
        rows.forEach((r) => {
            if (!Array.isArray(r)) {
                out.push(r);
                return;
            }
            const a = String(r[0] == null ? "" : r[0]).trim(), b = String(r[1] == null ? "" : r[1]).trim(), c = String(r[2] == null ? "" : r[2]).trim();
            if (!a || b || /^アレルゲン/.test(a)) {
                out.push(r);
                return;
            }
            if (INTAKE.test(NF(a))) {
                intake.push(a);
                ch = true;
                return;
            }
            const ps = splitTop(protectNum(a), (x) => x === "・" || x === "･").map(x => restore(x.t).trim()).filter(Boolean);
            if (ps.length >= 2 && ps.every(p => PCT.test(p))) {
                ps.forEach(p => { const m = p.match(PCT); out.push([m[1].trim(), m[2].replace(/\s+/g, ""), c]); });
                ch = true;
                return;
            }
            if (ps.length >= 2 && ps.every(nameLike)) {
                ps.forEach(p => out.push([p, "", c]));
                ch = true;
                return;
            }
            const m = ps.length ? ps[0].match(PCT) : null;
            if (m && ps.slice(1).every(p => !nameLike(p) && !PCT.test(p))) {
                out.push([m[1].trim(), m[2].replace(/\s+/g, ""), [ps.slice(1).join("・"), c].filter(Boolean).join("・")]);
                ch = true;
                return;
            }
            out.push(r);
        });
        if (ch)
            t.compRows = out;
        return { ch, intake };
    }
    const isSupp = (t) => catOf(t) === "健康食品";
    const INTAKE_ROW = "摂取・召し上がり方の目安";
    function putIntake(t, list) {
        if (!list.length)
            return;
        const txt = list.join("／").slice(0, 120);
        if (isSupp(t)) {
            const A = t.v68attrs = (t.v68attrs && typeof t.v68attrs === "object") ? t.v68attrs : {};
            if (!hasV(A.siIntake)) {
                A.siIntake = txt;
                t.v68src = Object.assign({}, t.v68src || {}, { siIntake: "資料" });
            }
        }
        else if (Array.isArray(t.compRows))
            t.compRows.push([INTAKE_ROW, txt, ""]);
    }
    function tidyIntake(t) {
        try {
            if (!t || !isSupp(t) || !Array.isArray(t.compRows))
                return false;
            const i = t.compRows.findIndex((r) => Array.isArray(r) && String(r[0] || "") === INTAKE_ROW && hasV(r[1]));
            if (i < 0)
                return false;
            const M0 = t.v84cf && t.v84cf["tbl:comp"], fp = fn("v84cfFp");
            const same = !!(M0 && fp && M0.fp === fp(t, "tbl:comp"));
            const A = t.v68attrs = (t.v68attrs && typeof t.v68attrs === "object") ? t.v68attrs : {};
            if (!hasV(A.siIntake)) {
                A.siIntake = String(t.compRows[i][1]).slice(0, 120);
                t.v68src = Object.assign({}, t.v68src || {}, { siIntake: "資料" });
            }
            t.compRows.splice(i, 1);
            if (same)
                M0.fp = fp(t, "tbl:comp");
            return true;
        }
        catch (e) {
            return false;
        }
    }
    const isAllergenRow = (r) => Array.isArray(r) && /^アレルゲン/.test(String(r[0] || ""));
    function compFromPairs(t, cp) {
        if (!t || !Array.isArray(cp) || !cp.length)
            return false;
        const ind = indOf(t);
        if (ind === "cosmetics")
            return false;
        const before = JSON.stringify([t.compCols || [], t.compRows || []]);
        if (ind === "food") {
            const r = fixFoodRows(t);
            putIntake(t, r.intake);
        }
        else {
            let rows = [];
            cp.forEach(p => { rows = rows.concat(parseSpec(p[0], p[1])); });
            if (!rows.length)
                return false;
            const keep = (Array.isArray(t.compRows) ? t.compRows : []).filter(isAllergenRow);
            if (!(Array.isArray(t.compCols) && t.compCols.length >= 3))
                t.compCols = ["項目", "内容", "備考"];
            const n = t.compCols.length;
            t.compRows = keep.concat(rows.map(r => {
                const x = r.slice(0, n);
                while (x.length < n)
                    x.push("");
                return x;
            }));
        }
        return JSON.stringify([t.compCols || [], t.compRows || []]) !== before;
    }
    const compPairs = (pairs) => {
        const seen = {};
        return (Array.isArray(pairs) ? pairs : []).filter(p => p && p[2] === "comp" && hasV(p[1])).filter(p => {
            const k = NF(p[0]) + "|" + NF(p[1]);
            if (seen[k])
                return false;
            seen[k] = 1;
            return true;
        });
    };
    function remarkComp(t, cp, srcName) {
        try {
            const mk = fn("v84cfMark");
            const M0 = t && t.v84cf && t.v84cf["tbl:comp"];
            if (!mk || !M0 || !cp.length)
                return;
            if (!(M0.by === "rule" || (M0.by === "chg" && /^rule/.test(String(M0.was || "")))))
                return;
            const p = cp[0];
            mk(t, "tbl:comp", { by: "rule", lv: "h", why: "資料の表のラベルから読み取りました", ev: String(p[0]).slice(0, 30) + "：" + String(p[1]).slice(0, 40), src: M0.src || srcName || ((t.sources && t.sources[0] && t.sources[0].name) || t.file || ""), sk: "text", ok: M0.ok });
        }
        catch (e) {
            warn("remark", e);
        }
    }
    const cfNorm = (s) => { const f = fn("v84cfNorm"); return f ? String(f(s)) : NF(s).toLowerCase().replace(/[\s,、。・:;'"()\[\]「」『』【】\-–—~〜_\/]+/g, ""); };
    function fixEvidence(t, pairs, onlyRecent) {
        let ch = false;
        try {
            const C = t && t.v84cf;
            if (!C || typeof C !== "object" || !Array.isArray(pairs) || !pairs.length)
                return false;
            const val = fn("v84cfVal");
            Object.keys(C).forEach(k => {
                const m = C[k];
                if (!m || m.by !== "rule" || m.sk !== "text" || !m.ev)
                    return;
                if (onlyRecent && Date.now() - (+m.at || 0) > 8000)
                    return;
                const i = String(m.ev).search(/[：:]/);
                if (i < 0 || cfNorm(String(m.ev).slice(i + 1)))
                    return;
                let p = null;
                if (k === "tbl:comp")
                    p = compPairs(pairs)[0] || null;
                if (!p && val) {
                    const nv = cfNorm(val(t, k));
                    p = nv ? pairs.find(q => q && q[1] != null && cfNorm(q[1]) && (cfNorm(q[1]).indexOf(nv) >= 0 || nv.indexOf(cfNorm(q[1])) >= 0)) : null;
                }
                if (p)
                    m.ev = (String(p[0]).slice(0, 30) + "：" + String(p[1]).slice(0, 40)).slice(0, 80);
                else {
                    m.ev = "";
                    m.lv = "m";
                    m.why = "資料の表から読み取り、形を整えました";
                }
                ch = true;
            });
        }
        catch (e) {
            warn("evidence", e);
        }
        return ch;
    }
    if (typeof v54upldApply === "function") {
        const __ua92i = v54upldApply;
        v54upldApply = function (t, pairs) {
            const got = __ua92i.apply(this, arguments);
            try {
                if (t && Array.isArray(pairs) && pairs.length) {
                    const cp = compPairs(pairs);
                    if (Array.isArray(got) && got.indexOf("compRows") >= 0 && cp.length) {
                        if (compFromPairs(t, cp))
                            remarkComp(t, cp);
                    }
                    fixEvidence(t, pairs, true);
                }
            }
            catch (e) {
                warn("upldApply", e);
            }
            return got;
        };
    }
    if (typeof v54upldComp === "function") {
        const __uc92i = v54upldComp;
        v54upldComp = function (raw) {
            const s0 = String(raw == null ? "" : raw), s1 = protectNum(s0);
            if (s1 === s0)
                return __uc92i.apply(this, arguments);
            const r = __uc92i.call(this, s1);
            try {
                if (r) {
                    ["items", "allergens", "notes"].forEach(k => {
                        if (Array.isArray(r[k]))
                            r[k] = r[k].map(restore);
                    });
                }
            }
            catch (e) { }
            return r;
        };
    }
    if (typeof v68pSplitLV === "function") {
        const __sl92i = v68pSplitLV;
        v68pSplitLV = function (s) {
            const r = __sl92i.apply(this, arguments);
            try {
                if (r && r[0]) {
                    let d = 0;
                    for (const ch of Array.from(String(r[0])))
                        d += OPENB.indexOf(ch) >= 0 ? 1 : CLOSEB.indexOf(ch) >= 0 ? -1 : 0;
                    if (d > 0) {
                        const r2 = __sl92i.call(this, protectIn(s));
                        return r2 ? [restore(r2[0]), restore(r2[1])] : null;
                    }
                }
            }
            catch (e) { }
            return r;
        };
    }
    function protectCont(s) {
        const toks = splitTop(s, SEP_LIST);
        if (toks.filter(x => !!kvOf(x.t.trim())).length < 2)
            return s;
        let o = "", prevKv = false;
        toks.forEach((tk, i) => {
            const kv = !!kvOf(tk.t.trim());
            if (i > 0)
                o += (!kv && prevKv && (tk.sep === "／" || tk.sep === "/")) ? P_SL : tk.sep;
            o += tk.t;
            if (kv)
                prevKv = true;
            else if (!(tk.sep === "／" || tk.sep === "/"))
                prevKv = false;
        });
        return o;
    }
    if (typeof v68hearCompFix === "function") {
        const __hf92i = v68hearCompFix;
        v68hearCompFix = function (t, raw) {
            const s0 = String(raw == null ? "" : raw);
            let s1 = s0;
            try {
                s1 = protectCont(protectIn(protectNum(s0)));
            }
            catch (e) {
                s1 = s0;
            }
            const r = __hf92i.call(this, t, s1);
            try {
                if (r && t) {
                    const fix = (v) => hasP(v) ? restore(v) : v;
                    if (Array.isArray(t.compRows))
                        t.compRows = t.compRows.map((x) => Array.isArray(x) ? x.map(fix) : x);
                    if (Array.isArray(t.v68comp))
                        t.v68comp.forEach((m) => {
                            if (m) {
                                m.part = fix(m.part);
                                m.mat = fix(m.mat);
                            }
                        });
                    try {
                        if (typeof V54U !== "undefined" && V54U && V54U.say && hasP(V54U.say.txt))
                            V54U.say.txt = restore(V54U.say.txt);
                    }
                    catch (e) { }
                    const rows = Array.isArray(t.compRows) ? t.compRows : [];
                    const spec = rows.filter((x) => Array.isArray(x) && /^(精米歩合|アルコール分|日本酒度|酸度|原料米|内容量|保存方法|補足)$/.test(String(x[0])));
                    const body = rows.filter((x) => spec.indexOf(x) < 0);
                    const n = (Array.isArray(t.compCols) && t.compCols.length) || 3;
                    const fit = (x) => {
                        const y = x.slice(0, n);
                        while (y.length < n)
                            y.push("");
                        return y;
                    };
                    const flagged = body.some((x) => hasV(x[2])) || (Array.isArray(t.v68comp) && t.v68comp.some((m) => m && (m.food != null || m.test)));
                    if (body.length >= 1 && (body.length === 1 || body.every((x) => !hasV(x[1]))) && !/\n/.test(s0.trim()) && !flagged && !splitTop(protectNum(s0), SEP_LIST).some(x => !!kvOf(x.t.trim()))) {
                        const first = /^(部材|部位)$/.test(String((t.compCols || [])[0] || "")) ? "全体" : "成分・材質";
                        const ps = parseSpec(first, s0);
                        const b0 = body[0];
                        if (ps.length >= 2 || (ps.length === 1 && (body.length > 1 || !hasV(b0[1])))) {
                            t.compRows = ps.map(fit).concat(spec);
                            if (Array.isArray(t.v68comp))
                                t.v68comp = ps.map(x => ({ part: x[0] === first ? "" : x[0], mat: x[1], food: null, test: null }));
                            try {
                                if (typeof V54U !== "undefined" && V54U && V54U.say && V54U.say.k === "compRows")
                                    V54U.say.txt = t.compRows.length + "項目";
                            }
                            catch (e) { }
                        }
                    }
                }
            }
            catch (e) {
                warn("hearComp", e);
            }
            return r;
        };
    }
    if (typeof applyAnswer === "function") {
        const __aa92i = applyAnswer;
        applyAnswer = function (t, k, raw) {
            const ok = __aa92i.apply(this, arguments);
            try {
                if (ok && t && k === "compRows" && indOf(t) === "food") {
                    const r = fixFoodRows(t);
                    putIntake(t, r.intake);
                }
            }
            catch (e) {
                warn("answer", e);
            }
            return ok;
        };
    }
    const strip = (s) => NF(s).replace(/[\s、,，。．・･:：=＝;；\/／|｜—–\-ー()\[\]「」『』【】〔〕]/g, "").toLowerCase();
    const HEADRE = /^(?:[【\[]\s*)?(?:原材料名?|全成分(?:表示)?|成分(?:表示)?|配合成分|材料|添加物|食品添加物|原料|ingredients?|inci(?:名)?)\s*(?:[】\]])?\s*(?:[:：]|は)\s*/i;
    function srcPairs(t) {
        const out = [];
        try {
            const tp = fn("v54upldTextPairs");
            if (!tp)
                return out;
            (Array.isArray(t.sources) ? t.sources : []).forEach((s) => {
                if (s && s.on !== false && s.txt && !/AI読取/.test(String(s.kind || "")))
                    (tp(s.txt) || []).forEach((p) => out.push(p));
            });
        }
        catch (e) { }
        return out;
    }
    function migrate(t) {
        if (!t || t.src !== "upload" || t.v92icf)
            return false;
        if (t._pend && !hasV(t.compRows))
            return false;
        let ch = false;
        const pairs = srcPairs(t);
        const cp = compPairs(pairs);
        try {
            if (cp.length && hasV(t.compRows)) {
                const body = t.compRows.filter((r) => Array.isArray(r) && !isAllergenRow(r));
                const curTxt = strip(body.map((r) => r.join("")).join(""));
                const raw = strip(cp.map(p => p[1]).join("")), raw2 = strip(cp.map(p => String(p[1]).replace(HEADRE, "")).join("")), raw3 = strip(cp.map(p => String(p[0]) + String(p[1])).join(""));
                if (curTxt && (curTxt === raw || curTxt === raw2 || curTxt === raw3)) {
                    if (compFromPairs(t, cp)) {
                        remarkComp(t, cp);
                        ch = true;
                    }
                }
            }
        }
        catch (e) {
            warn("migrate", e);
        }
        if (fixEvidence(t, pairs, false))
            ch = true;
        t.v92icf = 1;
        return ch;
    }
    W.v92itemMigrate = migrate;
    if (typeof syncTenant === "function") {
        const __st92i = syncTenant;
        syncTenant = function () {
            let ch = false;
            try {
                const t = userTen();
                if (t && !BUSY) {
                    ch = migrate(t);
                    if (tidyIntake(t))
                        ch = true;
                }
            }
            catch (e) {
                warn("sync", e);
            }
            const r = __st92i.apply(this, arguments);
            if (ch)
                persist(userTen());
            return r;
        };
    }
    const FOODWARE = /食器|皿|プレート|茶碗|椀|丼|鉢|コップ|グラス|マグ|カップ|タンブラー|水筒|ボトル|ジョッキ|湯呑|湯のみ|急須|ポット|ケトル|やかん|弁当|ランチボックス|箸|カトラリー|スプーン|フォーク|ナイフ|包丁|まな板|鍋|フライパン|キッチン|調理|保存容器|ストロー|哺乳|離乳|ピッチャー|酒器|徳利|ぐい呑|おちょこ|ザル|ボウル|おろし|ピーラー|栓抜き|tableware|kitchen|cookware|tumbler|bottle|\bcups?\b|\bmugs?\b|\bplates?\b|\bbowls?\b|chopstick|cutlery|lunch\s*box|flask|kettle|teapot/i;
    const FOODHS = /^(3924|4419|6911|6912|7013|7323|7418|7615|8211|8215|9617)/;
    function foodContactGoods(t) {
        try {
            if (!t)
                return false;
            if (FOODWARE.test([t.item, t.itemEn].filter(Boolean).join(" ")))
                return true;
            if (FOODHS.test(String(t.hs || "").replace(/\D/g, "")))
                return true;
            if (Array.isArray(t.v68comp) && t.v68comp.some((m) => m && m.food === true))
                return true;
            return (Array.isArray(t.compRows) ? t.compRows : []).some((r) => Array.isArray(r) && /食品|飲み口|口に|食洗機|電子レンジ/.test(r.join(" ")));
        }
        catch (e) {
            return true;
        }
    }
    W.v92itemFoodContact = foodContactGoods;
    if (typeof v79pFoodUnk === "function") {
        const __fu92i = v79pFoodUnk;
        v79pFoodUnk = function (t) {
            try {
                if (t && !foodContactGoods(t))
                    return [];
            }
            catch (e) { }
            return __fu92i.apply(this, arguments);
        };
    }
    if (typeof benchRows === "function") {
        const __br92i = benchRows;
        benchRows = function () {
            const rows = __br92i.apply(this, arguments);
            try {
                const t = userTen();
                const cells = fn("v68trPxCells"), calc = fn("v56tariffRowCalc"), fmt = fn("v68trFmt");
                if (!t || !cells || !calc || !Array.isArray(rows) || !rows.some((r) => r && !r.base && !r.v68noExp))
                    return rows;
                const C = (cells(t) || []).filter((c) => c && c.kind !== "int" && c.n > 0);
                if (!C.length)
                    return rows;
                const cur0 = C[0].cur || "";
                const n = Math.min.apply(null, C.filter((c) => (c.cur || "") === cur0).map((c) => c.n));
                const base = cur0 === "JPY" ? "¥" + Math.round(n).toLocaleString("en-US") : cur0 === "USD" ? "US$" + (n < 1000 ? n.toFixed(2) : Math.round(n).toLocaleString("en-US")) : (fmt ? fmt(cur0, n) : String(n));
                return rows.map((r) => (r && !r.base && !r.v68noExp) ? calc(Object.assign({}, r, { base })) : r);
            }
            catch (e) {
                warn("bench", e);
            }
            return rows;
        };
    }
    if (typeof v56tariffAdvCell === "function") {
        const __ac92i = v56tariffAdvCell;
        v56tariffAdvCell = function (x) {
            try {
                const V = x && x.v56tariffRow;
                if (V && !V.ng && !V.K && !x.v68noExp && !(V.fob > 0) && V.T && Array.isArray(V.T.unk) && !V.T.unk.some((n) => /^関税/.test(String(n)))) {
                    const noPx = !(typeof D !== "undefined" && D && hasV(D.priceRows));
                    return `<div><span data-noi18n>${E(noPx ? M("価格表がまだ無いため、計算していません。「✎ 価格表を編集」で単価を入れると計算します。", "Not calculated because there is no price list yet. Add a unit price via “Edit price list”.", "尚无价格表，因此未计算。请在“编辑价格表”中填写单价。", "No se calculó porque aún no hay lista de precios. Añada un precio en «Editar lista de precios».")
                        : M("価格表の単価を数字として読めないため、計算していません。「✎ 価格表を編集」で、単価を「¥1,800」「US$12.50」のように入れると計算します。", "Not calculated because the unit price in the price list could not be read as a number. Enter it like “¥1,800” or “US$12.50” via “Edit price list”.", "无法将价格表的单价读取为数字，因此未计算。请在“编辑价格表”中按“¥1,800”“US$12.50”的形式填写单价。", "No se calculó porque el precio unitario no se pudo leer como número. Introdúzcalo como «¥1,800» o «US$12.50» en «Editar lista de precios»."))}</span></div>`;
                }
            }
            catch (e) { }
            return __ac92i.apply(this, arguments);
        };
    }
    try {
        const mny = fn("v56tariffMoney");
        if (mny)
            W.v56tariffMoney = function (sym, n) {
                try {
                    if (/[¥￥]/.test(String(sym || "")) && n != null && isFinite(n) && Math.abs(n - Math.round(n)) < 0.005)
                        return String(sym) + Math.round(n).toLocaleString("en-US");
                }
                catch (e) { }
                return mny.apply(this, arguments);
            };
    }
    catch (e) { }
    const TAXNAME = {
        "シンガポール": "GST（物品・サービス税・参考値）", "オーストラリア": "GST（物品・サービス税・参考値）", "ニュージーランド": "GST（物品・サービス税・参考値）",
        "カナダ": "GST（連邦の物品・サービス税。州の税は別・参考値）", "インド": "IGST（統合物品・サービス税。品目で率が変わります・参考値）",
        "台湾": "営業税（参考値）", "中国": "増値税（品目で率が変わります・参考値）"
    };
    const TAX_MY = "売上税（SST。原則10%・品目により5%または免税）";
    if (typeof v56tariffTaxOf === "function") {
        const __to92i = v56tariffTaxOf;
        v56tariffTaxOf = function (c) {
            const T = __to92i.apply(this, arguments);
            try {
                if (T && Array.isArray(T.items)) {
                    const cc = String(c || "");
                    if (cc === "マレーシア") {
                        const i = T.items.findIndex((it) => it && it.k === "vat" && it.ref);
                        if (i >= 0) {
                            T.items.splice(i, 1);
                            if (Array.isArray(T.unk) && T.unk.indexOf(TAX_MY) < 0)
                                T.unk.push(TAX_MY);
                            if (Array.isArray(T.notes))
                                T.notes.push("マレーシアには VAT（付加価値税）は無く、輸入品には売上税（SST）がかかります。率は品目で違うため、概算には入れていません（要確認）。");
                        }
                    }
                    else if (TAXNAME[cc])
                        T.items.forEach((it) => {
                            if (it && it.k === "vat" && it.ref)
                                it.nm = TAXNAME[cc];
                        });
                }
            }
            catch (e) { }
            return T;
        };
    }
    const UNITRE = /\d[\d,]*(?:\.\d+)?\s*(ケース|カートン|セット|パック|ボトル|ダース|ロット|個|本|袋|箱|台|枚|缶|瓶|巻|組|点|足|着|冊|脚|粒|錠|kg|pcs|pieces?|cases?|cartons?|ctns?|sets?|units?|boxes|box|bottles?|bags?)(?![A-Za-zァ-ヶ一-龠])/i;
    if (typeof v83pxMoqRegUnit === "function") {
        const __mu92i = v83pxMoqRegUnit;
        v83pxMoqRegUnit = function (t) {
            try {
                const s = String((t && t.moq) || "").trim();
                if (s) {
                    const s2 = s.replace(/[（(][^（）()]*[）)]/g, " ").replace(/\s+/g, " ").trim();
                    const m = NF(s2).match(UNITRE);
                    if (m)
                        return m[1];
                    if (s2 && s2 !== s)
                        return String(__mu92i.call(this, Object.assign({}, t, { moq: s2 })) || "").replace(/[）)\]】]+$/, "");
                }
            }
            catch (e) { }
            return String(__mu92i.apply(this, arguments) || "").replace(/[）)\]】]+$/, "");
        };
    }
    if (typeof openHealth === "function") {
        const __oh92i = openHealth;
        openHealth = function () {
            const r = __oh92i.apply(this, arguments);
            try {
                const pn = document.getElementById("pn");
                const box = pn ? pn.querySelector("#v83pxhl") : null;
                const ok = pn ? Array.from(pn.querySelectorAll("p.nn")).find(p => /問題は見つかりませんでした/.test(p.textContent || "")) : null;
                if (pn && box && ok && !ok.getAttribute("data-v92i")) {
                    ok.setAttribute("data-v92i", "1");
                    ok.setAttribute("data-noi18n", "");
                    ok.innerHTML = `<b style="color:var(--warn,#B25E00)">${E(M("確認したい点が 1件 あります（下）。", "1 item needs your attention (below).", "有 1 项需要确认（见下）。", "Hay 1 punto por revisar (abajo)."))}</b>` +
                        E(M("会話文がそのまま入ったような不自然な値は、見つかりませんでした。", " No unnatural values (such as chat text saved as data) were found.", "未发现不自然的值（如对话文字被原样保存）。", " No se encontraron valores extraños."));
                    const h = pn.querySelector("h3");
                    if (h && !h.querySelector(".p"))
                        h.insertAdjacentHTML("beforeend", ` <span class="p or" data-noi18n>${E(M("確認 1件", "1 to check", "待确认 1 项", "1 por revisar"))}</span>`);
                }
            }
            catch (e) {
                warn("health", e);
            }
            return r;
        };
    }
    try {
        if (typeof V68P_G !== "undefined" && V68P_G) {
            const reOf = (f, w) => { f.w = w; f.re = new RegExp("^(?:" + w + ")$", "i"); f.loose = new RegExp(w, "i"); };
            if (!V68P_G.v92isupp) {
                const F = [
                    { k: "siIntake", ja: "摂取の目安（1日あたり）", en: "Suggested daily intake", ex: "例：1日2粒を目安に、水またはぬるま湯で", w: "摂取目安量?|摂取の目安|1日の目安|1日の摂取目安量?|目安量|お?召し上がり方" },
                    { k: "siForm", ja: "形状・内容量", en: "Form / net contents", ex: "例：タブレット 250mg×60粒", w: "形状|剤形|形状・内容量" },
                    { k: "siClaim", ja: "表示の区分（日本／相手国）", en: "Product classification (Japan / destination)", ex: "例：日本では一般の健康食品（機能性表示なし）。相手国の区分・届出は要確認" }
                ];
                V68P_G.v92isupp = { ja: "健康食品の項目", f: F.map(x => {
                        const f = { k: x.k, ja: x.ja, ex: x.ex, g: "v92isupp" };
                        if (x.w)
                            reOf(f, x.w);
                        return f;
                    }) };
                if (typeof V68P_GL !== "undefined" && V68P_GL)
                    V68P_GL.v92isupp = ["健康食品の項目", "Health food / supplement details", "保健食品项目", "Datos del suplemento"];
                if (typeof V68P_FL !== "undefined" && V68P_FL)
                    F.forEach(x => { V68P_FL[x.k] = [x.ja, x.en, x.ja, x.en]; });
            }
            if (V68P_G.v92living && Array.isArray(V68P_G.v92living.f) && !V68P_G.v92living.f.some((f) => f && f.k === "lvVariant")) {
                const add = [["lvVariant", "色・サイズの展開", "Colors / sizes", "例：ホワイト・グレー・ネイビー／フェイス・バスの2サイズ"], ["lvCare", "取り扱い・洗濯の表示", "Care / washing instructions", "例：洗濯機可・塩素系漂白剤は不可・タンブル乾燥は低温"]];
                add.forEach(x => {
                    V68P_G.v92living.f.push({ k: x[0], ja: x[1], ex: x[3], g: "v92living" });
                    if (typeof V68P_FL !== "undefined" && V68P_FL)
                        V68P_FL[x[0]] = [x[1], x[2], x[1], x[2]];
                });
            }
            const WORDS = {
                mcHours: "稼働時間|稼動時間|アワーメーター|アワメーター|使用時間|hour\\s*meter|operating\\s*hours?", mcSerial: "機番|機体番号|シリアル番号|製造番号|serial(?:\\s*no\\.?|\\s*number)?",
                mcWeight: "機械質量|機体質量|運転質量|機械重量", mcEmission: "排ガス|排出ガス|排ガス規制|排ガス基準|排出ガス基準|排出ガスの基準", mcCond: "足回り|整備|整備状況|整備の状態|整備状態",
                agReg: "肥料登録|農薬登録|肥料の登録|登録番号", agSds: "sds|安全データシート|危険物区分|危険物の区分", agUse: "希釈倍率|希釈|対象作物|散布方法",
                mdClass: "クラス分類|医療機器クラス|医療機器の分類", mdSterile: "滅菌|滅菌方法|滅菌の有無", mdReg: "届出番号|認証番号|承認番号"
            };
            Object.keys(V68P_G).forEach(g => {
                if (/^v92/.test(g))
                    (V68P_G[g].f || []).forEach((f) => {
                        if (f && WORDS[f.k] && !f.re)
                            reOf(f, WORDS[f.k]);
                    });
            });
        }
        if (typeof v68pGroups === "function" && typeof V68P_G !== "undefined" && V68P_G && V68P_G.v92isupp) {
            const __pg92i = v68pGroups;
            v68pGroups = function (t) {
                const g = __pg92i.apply(this, arguments);
                try {
                    if (Array.isArray(g) && t && isSupp(t) && g.indexOf("v92isupp") < 0) {
                        const i = g.indexOf("basic");
                        g.splice(i >= 0 ? i + 1 : 0, 0, "v92isupp");
                    }
                }
                catch (e) { }
                return g;
            };
        }
    }
    catch (e) {
        warn("groups", e);
    }
    const EX = {
        "建設機械": { year: "例：2017年式（製造銘板の写真あり）", condition: "例：稼働良好・オイル漏れなし・足回り70%（点検記録つき）", accessories: "例：標準バケット・取扱説明書・予備キー（アタッチメントは別途）", warranty: "例：現状渡し（出荷前に動作確認・点検記録を提出）" },
        "中古車": { year: "例：2019年式（初度登録 2019年6月）", condition: "例：評価点4・修復歴なし・内装B", accessories: "例：スペアキー・取扱説明書・整備記録簿・スペアタイヤ", warranty: "例：現状渡し（船積み前に動作確認）" }
    };
    function withEx(t, run) {
        const ov = EX[catOf(t)];
        const saved = [];
        try {
            if (ov && typeof V68P_G !== "undefined" && V68P_G && V68P_G.used)
                V68P_G.used.f.forEach((f) => {
                    if (f && ov[f.k]) {
                        saved.push([f, f.ex]);
                        f.ex = ov[f.k];
                    }
                });
            try {
                const b = typeof V68P_G !== "undefined" && V68P_G && V68P_G.basic ? V68P_G.basic.f.find((f) => f && f.k === "bShelf") : null;
                const nd = t && typeof V68IND !== "undefined" && V68IND && typeof V68IND.need === "function" ? V68IND.need("shelf", t) : null;
                if (b && nd && nd.ex) {
                    saved.push([b, b.ex]);
                    b.ex = String(nd.ex) + (/なし/.test(String(nd.ex)) ? "" : "（無ければ「該当なし」）");
                }
            }
            catch (e) { }
            return run();
        }
        finally {
            saved.forEach(x => { x[0].ex = x[1]; });
        }
    }
    function shelfName(t) {
        try {
            if (t && typeof V68IND !== "undefined" && V68IND && typeof V68IND.need === "function") {
                const n = String(V68IND.need("shelf", t).n || "");
                if (n && n !== "賞味期限・保証期間")
                    return n;
            }
        }
        catch (e) { }
        return "";
    }
    W.v92itemShelfName = shelfName;
    if (typeof v68pFL === "function") {
        const __fl92i = v68pFL;
        v68pFL = function (k) {
            try {
                if (k === "bShelf" && lang() === "ja") {
                    const n = shelfName(userTen());
                    if (n)
                        return n;
                }
            }
            catch (e) { }
            return __fl92i.apply(this, arguments);
        };
    }
    if (typeof v90ctyOptMiss === "function") {
        const __om92i = v90ctyOptMiss;
        v90ctyOptMiss = function () {
            const L = __om92i.apply(this, arguments);
            try {
                if (Array.isArray(L) && typeof V68P_G !== "undefined" && V68P_G && typeof NEED !== "undefined") {
                    const ref = {};
                    Object.keys(V68P_G).forEach(g => (V68P_G[g].f || []).forEach((f) => {
                        if (f && f.ref && NEED.some((n) => n && n.k === f.ref))
                            ref["v68:" + f.k] = 1;
                    }));
                    return L.filter((x) => !(x && ref[x.k]));
                }
            }
            catch (e) { }
            return L;
        };
    }
    const needOk = (t, x) => hasV(t[x.k]) && !(x.k === "hs" && t.hsGuess);
    function missList(t) {
        try {
            if (!t || typeof NEED === "undefined" || !Array.isArray(NEED))
                return [];
            return NEED.filter((x) => x && !needOk(t, x)).sort((a, b) => (b.w >= 5 ? 1 : 0) - (a.w >= 5 ? 1 : 0) || b.w - a.w);
        }
        catch (e) {
            return [];
        }
    }
    function fillPct(t) {
        try {
            const sum = NEED.reduce((a, x) => a + x.w, 0);
            return sum ? Math.round(NEED.filter((x) => needOk(t, x)).reduce((a, x) => a + x.w, 0) / sum * 100) : 0;
        }
        catch (e) {
            return null;
        }
    }
    const tr = (s2) => {
        try {
            const l = lang();
            if (l !== "ja" && typeof I18N !== "undefined" && I18N && I18N.dict && I18N.dict[l] && I18N.dict[l][s2])
                return String(I18N.dict[l][s2]);
        }
        catch (e) { }
        return s2;
    };
    const needName = (k, t) => {
        try {
            if (k === "hs" && t && t.hsGuess && hasV(t.hs))
                return M("HSコード（推定のまま・未確定）", "HS code (estimated, not confirmed)", "HS编码（推定・未确定）", "Código HS (estimado, sin confirmar)");
            const f = fn("v79pNeedName");
            const n = f ? String(f(k, t) || "") : "";
            if (n)
                return tr(n);
        }
        catch (e) { }
        const x = (typeof NEED !== "undefined" ? NEED : []).find((y) => y && y.k === k);
        return x ? tr(x.n) : k;
    };
    const needEx = (k, t) => {
        try {
            if (typeof V68IND !== "undefined" && V68IND && typeof V68IND.need === "function") {
                const e = String(V68IND.need(k, t).ex || "");
                if (e)
                    return e;
            }
        }
        catch (e) { }
        const x = (typeof NEED !== "undefined" ? NEED : []).find((y) => y && y.k === k);
        return (x && x.ex) || "";
    };
    W.v92itemMiss = (t) => { const x = t || userTen(); return x ? missList(x).map((n) => ({ k: n.k, n: needName(n.k, x), req: n.w >= 5 })) : null; };
    W.v92itemPct = (t) => { const x = t || userTen(); return x ? fillPct(x) : null; };
    const pending = () => {
        try {
            const t = userTen();
            return !!(t && t._pend && document.getElementById("v188pend"));
        }
        catch (e) {
            return false;
        }
    };
    W.v92itemPending = pending;
    function css() {
        if (document.getElementById("v92itemcss"))
            return;
        const st = document.createElement("style");
        st.id = "v92itemcss";
        st.textContent = ".v92if .v92ir{margin:10px 0;padding-bottom:10px;border-bottom:1px dashed var(--line-2,#e6e9ee)}" +
            ".v92if .v92ir label{display:block;font-size:13px;font-weight:700;color:var(--ink,#1b2a3a);line-height:1.5;margin:0 0 4px}.v92if .v92ir input,.v92if .v92ir select{width:100%;box-sizing:border-box}" +
            ".v92if .v92iu{margin-top:4px;font-size:11.5px;color:var(--ink-3,#6b7a90);line-height:1.6}.v92if .v92irq{display:inline-block;margin-left:5px;padding:0 6px;border-radius:999px;background:var(--or-soft,#FFF4E8);color:var(--or-deep,#B25E00);font-size:10.5px;font-weight:700}" +
            ".v92if .v92ich{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px}.v92if .v92ich button{font-size:11.5px;padding:2px 9px}" +
            ".v92icat{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin:8px 0 2px;padding:8px 11px;border:1px solid var(--line,#DDE3EA);border-radius:10px;background:var(--surface-2,#F7F9FC);font-size:12.5px;line-height:1.6;color:var(--ink,#1b2a3a)}" +
            ".v92icat b{font-weight:800}.v92icat small{color:var(--ink-3,#6b7a90);font-size:11.5px}.v92icat .btn{padding:3px 10px;font-size:12px}" +
            ".v92imiss{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.v92imiss .btn{font-size:12px;padding:4px 11px}" +
            ".v92ilack{margin-top:6px;padding:0}.v92ilack .btn{font-size:11.5px;padding:3px 10px}" +
            "span.rw.v92istr{flex-wrap:nowrap!important;align-items:flex-start!important}span.rw.v92istr>.stno{flex:none}span.rw.v92istr>.stt{min-width:0}";
        (document.head || document.documentElement).appendChild(st);
    }
    const catChips = () => {
        try {
            const n = NEED.find((x) => x && x.k === "cat");
            return (n && Array.isArray(n.chips)) ? n.chips.slice() : [];
        }
        catch (e) {
            return [];
        }
    };
    function catSelectHtml(id, curCat, withEmpty) {
        const chips = catChips(), G8 = Array.isArray(W.V92_GROUPS) ? W.V92_GROUPS : [];
        const l = lang();
        const used = {};
        const opt = (c) => `<option value="${E(c)}"${c === curCat ? " selected" : ""}>${E(c)}</option>`;
        let h = withEmpty ? `<option value="">${E(M("（選んでください）", "(choose)", "（请选择）", "(elija)"))}</option>` : "";
        G8.forEach((g) => {
            const cs = (g.cats || []).filter((c) => chips.indexOf(c) >= 0);
            if (!cs.length)
                return;
            cs.forEach((c) => { used[c] = 1; });
            h += `<optgroup label="${E((l !== "ja" && g[l]) || g.ja)}">${cs.map(opt).join("")}</optgroup>`;
        });
        const rest = chips.filter(c => !used[c]);
        if (rest.length)
            h += rest.map(opt).join("");
        if (curCat && chips.indexOf(curCat) < 0)
            h += opt(curCat);
        return `<select class="sel" id="${id}">${h}</select>`;
    }
    const DEFTITLE = /^(成分表(・材質表)?|全成分表（INCI）|材質・素材表|車両情報表|素材・仕様表|構成・規格表|成分・スペック表|状態・仕様表|材質・仕様表|成分・分量表|原材料・栄養成分表|機械情報表|成分・規格表)$/;
    function applyCat(t, v) {
        const c = String(v || "").trim();
        if (!t || !c || c === catOf(t))
            return false;
        let ok = false;
        try {
            ok = !!applyAnswer(t, "cat", c);
        }
        catch (e) {
            ok = false;
        }
        if (!ok || catOf(t) !== c) {
            t.cat = c;
            try {
                const ck = fn("catKeyOf");
                t.catKey = ck ? ck(c) : t.catKey;
            }
            catch (e) { }
        }
        delete t.v92catAsk;
        t.v92catWhy = "商品情報の画面で選び直し";
        try {
            if (!t.compTitle || DEFTITLE.test(String(t.compTitle))) {
                const want = c === "健康食品" ? "原材料・栄養成分表" : c === "建設機械" ? "機械情報表" : c === "農業資材" ? "成分・規格表" : (c === "文化・教育用品" || c === "ペット用品") ? "材質・素材表" : "";
                const f = fn("v68indCompTitle");
                const nt = want || (f ? String(f(t) || "") : "");
                if (nt)
                    t.compTitle = nt;
            }
        }
        catch (e) { }
        return true;
    }
    function afterEdit(msg) {
        try {
            if (typeof syncTenant === "function")
                syncTenant();
        }
        catch (e) { }
        persist(userTen());
        try {
            const c = fn("closeDW");
            if (c)
                c();
        }
        catch (e) { }
        try {
            if (typeof render === "function")
                render();
        }
        catch (e) { }
        if (msg)
            say(msg);
    }
    function catOpen() {
        const t = userTen(), open = fn("openDW");
        if (!t || !open)
            return;
        css();
        const g = typeof W.v92catGroupOf === "function" ? W.v92catGroupOf(catOf(t)) : null;
        const free = String(t.v79indFree || "").trim();
        open(`<div class="dwhead" data-noi18n><h3>✎ ${E(M("商材カテゴリーを選び直す", "Change product category", "重新选择商品类别", "Cambiar la categoría del producto"))}</h3></div>
  <div class="dwbody v92if" data-noi18n style="overflow:auto;display:block;padding:12px 18px 16px">
    <p class="nn" style="margin:0 0 8px">${E(M("商材カテゴリーは、規制の調べ方・関税と必要書類のひな形・「④ 業種ごとの項目」・営業資料の型に使います。変えると、これらが新しいカテゴリーに合わせて切り替わります（入力済みの値は消えません）。", "The category drives regulation research, duty/document templates, industry-specific fields and the sales deck type. Changing it switches these to the new category (entered values are kept).", "商品类别用于法规调查方式、关税与单据模板、“④ 行业专属项目”和营业资料的类型。更改后这些会切换到新类别（已填写的值不会消失）。", "La categoría determina la investigación regulatoria, las plantillas, los campos del sector y el tipo de presentación. Al cambiarla se adaptan (los valores introducidos se conservan)."))}</p>
    <div class="v92ir"><label for="v92icatSel">${E(M("商材カテゴリー", "Product category", "商品类别", "Categoría"))}</label><div>${catSelectHtml("v92icatSel", catOf(t), !catOf(t))}
      <div class="v92iu">${E(M("いま：", "Now: ", "当前：", "Ahora: "))}<b>${E(catOf(t) || M("未登録", "not set", "未登记", "sin registrar"))}</b>${g ? E(M(`（大分類：${g.ja}）`, ` (group: ${g.en})`, `（大类：${g.zh || g.ja}）`, ` (grupo: ${g.es || g.en})`)) : ""}${t.catRaw && t.catRaw !== catOf(t) ? E(M(`／資料の記載：${t.catRaw}`, ` / in your file: ${t.catRaw}`, `／资料中的记载：${t.catRaw}`, ` / en su archivo: ${t.catRaw}`)) : ""}</div></div></div>
    <div class="v92ir"><label for="v92icatFree">${E(M("商材の種類（ひとことで・任意）", "Kind of product (optional)", "商品种类（一句话・可选）", "Tipo de producto (opcional)"))}</label><div><input class="sel" id="v92icatFree" value="${E(free)}" placeholder="${E(M("例：釣具／楽器／園芸用品", "e.g. fishing tackle, musical instruments", "例：渔具／乐器／园艺用品", "p. ej. artículos de pesca, instrumentos"))}" autocomplete="off" maxlength="40">
      <div class="v92iu">${E(M("選択肢に合うものが無いときは「その他」を選び、ここに種類を書いてください。AI商社マンの答えと規制の調べ方に使います。", "If nothing fits, choose “Other” and describe it here. It is used for AI answers and regulation research.", "没有合适的选项时请选择“其他”，并在此填写种类。", "Si nada encaja, elija «Otros» y descríbalo aquí."))}</div></div></div>
    <div class="rw" style="margin-top:12px;gap:6px"><span style="flex:1"></span><button class="btn" type="button" id="v92icatSave">${E(M("保存して反映", "Save", "保存并反映", "Guardar"))}</button><button class="btn g" type="button" id="v92icatCancel">${E(M("キャンセル", "Cancel", "取消", "Cancelar"))}</button></div></div>`);
        try {
            const pn0 = document.getElementById("pn");
            if (pn0)
                pn0.classList.add("dwr");
            const dc = fn("dwChrome");
            if (dc)
                dc();
        }
        catch (e) { }
        const sv = document.getElementById("v92icatSave"), cn = document.getElementById("v92icatCancel");
        if (cn)
            cn.addEventListener("click", () => {
                const c = fn("closeDW");
                if (c)
                    c();
            });
        if (sv)
            sv.addEventListener("click", () => {
                const sel = document.getElementById("v92icatSel"), fr = document.getElementById("v92icatFree");
                const v = String((sel && sel.value) || "").trim(), f = String((fr && fr.value) || "").trim().slice(0, 40);
                if (!v) {
                    say(M("商材カテゴリーを選んでください", "Please choose a category", "请选择商品类别", "Elija una categoría"));
                    return;
                }
                const ch = applyCat(t, v);
                let ch2 = false;
                if (f !== String(t.v79indFree || "").trim()) {
                    if (f)
                        t.v79indFree = f;
                    else
                        delete t.v79indFree;
                    ch2 = true;
                }
                try {
                    const lg = fn("logU");
                    if (lg && (ch || ch2))
                        lg("fill", "商材カテゴリーを選び直し:" + v);
                }
                catch (e) { }
                afterEdit(ch ? M(`商材カテゴリーを「${v}」にしました（規制・業種ごとの項目に反映）`, `Category changed to “${v}”`, `已将商品类别改为“${v}”`, `Categoría cambiada a «${v}»`) : ch2 ? M("保存しました", "Saved", "已保存", "Guardado") : "");
            });
    }
    W.v92itemCatOpen = catOpen;
    const TBL = { priceRows: ["price", "✎ 価格表を編集", "Edit price list"], dimRows: ["dim", "✎ 寸法を編集", "Edit dimensions"], compRows: ["comp", "✎ 表を編集", "Edit table"], strengths: ["str", "＋ 強みを追加", "Add a strength"] };
    function fillOpen(only) {
        const t = userTen(), open = fn("openDW");
        if (!t || !open)
            return;
        css();
        let L = missList(t);
        if (Array.isArray(only) && only.length) {
            const L2 = L.filter(x => only.indexOf(x.k) >= 0);
            if (L2.length)
                L = L2;
        }
        if (!L.length) {
            say(M("登録の項目は、すべて入っています", "All registration items are filled in", "登记项目已全部填写", "Todos los campos están completos"));
            return;
        }
        const row = (x) => {
            const k = x.k, nm = needName(k, t), ex = needEx(k, t), req = x.w >= 5 ? `<span class="v92irq">${E(M("必須", "required", "必填", "obligatorio"))}</span>` : "";
            const use = x.use ? M(`使いみち：${x.use}`, "", "", "") : "";
            let body = "";
            if (TBL[k])
                body = `<button class="btn g" type="button" data-v92ijump="${TBL[k][0]}">${E(M(TBL[k][1], TBL[k][2], TBL[k][1], TBL[k][2]))}</button><div class="v92iu">${E(M("表・カードの編集の窓が開きます。", "Opens the editor.", "将打开编辑窗口。", "Abre el editor."))}${use ? " " + E(use) : ""}</div>`;
            else if (k === "cat")
                body = catSelectHtml("v92if_cat", "", true) + `<div class="v92iu">${E(use)}</div>`;
            else {
                const chips = Array.isArray(x.chips) && k !== "targets" ? x.chips.filter((c) => !/まだ決めていない/.test(c)) : [];
                const ph = k === "hs" ? M("例：0902.10（6桁。分からなければ空のままで）", "e.g. 0902.10 (6 digits; leave blank if unknown)", "例：0902.10（6位，不清楚可留空）", "p. ej. 0902.10 (6 dígitos)") : k === "targets" ? M("例：台湾・香港・シンガポール（国名を「・」で区切る）", "e.g. Taiwan, Hong Kong, Singapore", "例：台湾・香港・新加坡", "p. ej. Taiwán, Hong Kong, Singapur") : k === "term" ? M("例：FOB 横浜（FOB・CIF・EXW など）", "e.g. FOB Yokohama", "例：FOB 横滨", "p. ej. FOB Yokohama") : (ex || "");
                body = `<input class="sel" data-v92ik="${E(k)}" id="v92if_${E(k)}" placeholder="${E(ph)}" autocomplete="off" maxlength="200">` +
                    (chips.length ? `<div class="v92ich">${chips.map((c) => `<button class="btn g" type="button" data-v92ichip="${E(k)}" data-v="${E(c)}">${E(c)}</button>`).join("")}</div>` : "") +
                    `<div class="v92iu">${E(k === "hs" ? ((t.hsGuess && hasV(t.hs) ? M(`いまは推定の番号（${t.hs}）が入っています。合っていれば、同じ番号を入れると確定します。`, `An estimated code (${t.hs}) is set now. If it is right, enter the same code to confirm it. `, `目前填入的是推定编码（${t.hs}）。如正确，请输入相同编码以确定。`, `Ahora hay un código estimado (${t.hs}). Si es correcto, introdúzcalo para confirmarlo. `) : "") + M("分からないときは「規制を調べる」の画面で候補を出せます。関税率と必要書類の判定に使います。", "If unknown, candidates are available on the Regulations screen.", "不清楚时可在“调查法规”页面查看候选。", "Si no lo sabe, hay candidatos en la pantalla de regulaciones.")) : use)}</div>`;
            }
            return `<div class="v92ir" data-v92irow="${E(k)}"><label for="v92if_${E(k)}">${E(nm)}${req}</label><div>${body}</div></div>`;
        };
        const nReq = L.filter(x => x.w >= 5).length;
        open(`<div class="dwhead" data-noi18n><h3>✎ ${E(M("足りない項目を入れる", "Fill in missing items", "填写缺少的项目", "Completar campos que faltan"))} <span class="p or">${L.length}${E(M("件", "", "项", ""))}</span></h3></div>
  <div class="dwbody v92if" data-noi18n style="overflow:auto;display:block;padding:12px 18px 16px">
    <p class="nn" style="margin:0 0 4px">${E(M(`登録の項目（全体 21件）のうち、まだ入っていないものです${nReq ? `（うち必須 ${nReq}件）` : ""}。分かるものだけ入れて「保存して反映」を押してください。空のままの欄は変えません。AI に1問ずつ聞いてもらうこともできます。`, `These registration items are still empty${nReq ? ` (${nReq} required)` : ""}. Fill in what you know and press Save. Blank fields are left unchanged. You can also let the AI ask you one by one.`, `以下登记项目尚未填写${nReq ? `（其中必填 ${nReq} 项）` : ""}。请填写已知内容后点击“保存并反映”。留空的栏不会更改。也可以让 AI 逐项提问。`, `Estos campos siguen vacíos${nReq ? ` (${nReq} obligatorios)` : ""}. Complete lo que sepa y pulse Guardar. También puede dejar que la IA le pregunte uno por uno.`))}</p>
    ${L.map(row).join("")}
    <div class="rw" style="margin-top:12px;gap:6px;flex-wrap:wrap"><button class="btn g" type="button" id="v92ifHear">🤖 ${E(M("AI に1問ずつ聞いてもらう", "Let the AI ask one by one", "让 AI 逐项提问", "Que la IA pregunte"))}</button><span style="flex:1"></span><button class="btn" type="button" id="v92ifSave">${E(M("保存して反映", "Save", "保存并反映", "Guardar"))}</button><button class="btn g" type="button" id="v92ifCancel">${E(M("閉じる", "Close", "关闭", "Cerrar"))}</button></div></div>`);
        try {
            const pn0 = document.getElementById("pn");
            if (pn0)
                pn0.classList.add("dwr");
            const dc = fn("dwChrome");
            if (dc)
                dc();
        }
        catch (e) { }
        const pn = document.getElementById("pn");
        if (!pn)
            return;
        pn.querySelectorAll("[data-v92ichip]").forEach((b) => b.addEventListener("click", () => {
            const i = document.getElementById("v92if_" + b.getAttribute("data-v92ichip"));
            if (i) {
                i.value = b.getAttribute("data-v") || "";
                i.focus();
            }
        }));
        pn.querySelectorAll("[data-v92ijump]").forEach((b) => b.addEventListener("click", () => {
            const k = b.getAttribute("data-v92ijump");
            try {
                if (k === "str") {
                    const f = fn("openStrEdit");
                    if (f)
                        f(-1);
                }
                else {
                    const f = fn("openTableEdit");
                    if (f)
                        f(k);
                }
            }
            catch (e) { }
        }));
        const cn = document.getElementById("v92ifCancel"), sv = document.getElementById("v92ifSave"), hr = document.getElementById("v92ifHear");
        if (cn)
            cn.addEventListener("click", () => {
                const c = fn("closeDW");
                if (c)
                    c();
            });
        if (hr)
            hr.addEventListener("click", () => {
                try {
                    const c = fn("closeDW");
                    if (c)
                        c();
                    hearGo();
                }
                catch (e) { }
            });
        if (sv)
            sv.addEventListener("click", () => {
                const done = [], bad = [];
                const cs = document.getElementById("v92if_cat");
                if (cs && cs.value) {
                    if (applyCat(t, cs.value))
                        done.push(needName("cat", t));
                }
                pn.querySelectorAll("input[data-v92ik]").forEach((i) => {
                    const k = String(i.getAttribute("data-v92ik")), v = String(i.value || "").trim();
                    if (!v)
                        return;
                    let ok = false;
                    try {
                        if (k === "hs" && !/\d{4}[.．\-]?\d{2}/.test(NF(v)))
                            ok = false;
                        else
                            ok = !!applyAnswer(t, k, v);
                    }
                    catch (e) {
                        ok = false;
                    }
                    (ok && hasV(t[k]) ? done : bad).push(needName(k, t));
                });
                if (!done.length && !bad.length) {
                    say(M("入れる値がありません（分かる欄に入力してください）", "Nothing to save (fill in at least one field)", "没有要保存的值", "Nada que guardar"));
                    return;
                }
                try {
                    const lg = fn("logU");
                    if (lg && done.length)
                        lg("fill", "商品情報の画面で入力:" + done.length + "件");
                }
                catch (e) { }
                const msg = (done.length ? M(`登録しました：${done.join("・")}`, `Saved: ${done.join(", ")}`, `已登记：${done.join("・")}`, `Guardado: ${done.join(", ")}`) : "") +
                    (bad.length ? (done.length ? "／" : "") + M(`入れられませんでした：${bad.join("・")}（HSコードは6桁、取引条件は FOB・CIF などで）`, `Could not save: ${bad.join(", ")} (HS code needs 6 digits; trade terms need an Incoterm)`, `未能登记：${bad.join("・")}`, `No se pudo guardar: ${bad.join(", ")}`) : "");
                afterEdit(msg);
                if (bad.length)
                    setTimeout(() => {
                        try {
                            fillOpen(only);
                            say(msg);
                        }
                        catch (e) { }
                    }, 60);
            });
    }
    W.v92itemFillOpen = fillOpen;
    function hearGo() {
        try {
            const g = fn("go");
            if (typeof FILL !== "undefined" && FILL && FILL.on) {
                if (g)
                    g("up");
                return;
            }
            const bn = fn("buildNav"), fs = fn("fillStart");
            if (fs && bn) {
                cur = "up";
                bn();
                fs();
                try {
                    window.scrollTo({ top: 0 });
                }
                catch (e) { }
            }
            else if (g)
                g("up");
        }
        catch (e) {
            warn("hear", e);
        }
    }
    W.v92itemHearGo = hearGo;
    document.addEventListener("click", ev => {
        try {
            const tg = ev.target;
            if (!tg || !tg.closest)
                return;
            const a = tg.closest("[data-v92iact]");
            if (!a)
                return;
            ev.preventDefault();
            const k = a.getAttribute("data-v92iact");
            if (k === "cat")
                catOpen();
            else if (k === "fill")
                fillOpen(String(a.getAttribute("data-keys") || "").split(",").filter(Boolean));
            else if (k === "hear")
                hearGo();
        }
        catch (e) {
            warn("click", e);
        }
    });
    if (typeof v68pCard === "function") {
        const __cd92i = v68pCard;
        v68pCard = function (t) {
            let h = String(withEx(t, () => __cd92i.apply(this, arguments)));
            try {
                if (t && (t.src === "upload" || t.src === "sample2")) {
                    css();
                    const c = catOf(t), g = typeof W.v92catGroupOf === "function" ? W.v92catGroupOf(c) : null;
                    const free = String(t.v79indFree || "").trim();
                    const line = `<div class="v92icat" data-noi18n data-v92icatline><span>${E(M("商材カテゴリー", "Product category", "商品类别", "Categoría"))}：<b>${E(c || M("未登録", "not set", "未登记", "sin registrar"))}</b>${g && g.ja !== c ? ` <small>${E(M(`（大分類：${g.ja}）`, `(group: ${g.en})`, `（大类：${g.zh || g.ja}）`, `(grupo: ${g.es || g.en})`))}</small>` : ""}${free && free !== c ? ` <small>${E(M(`／種類：${free}`, `/ kind: ${free}`, `／种类：${free}`, `/ tipo: ${free}`))}</small>` : ""}</span>` +
                        `<button class="btn g" type="button" data-v92iact="cat">✎ ${E(M("カテゴリーを選び直す", "Change category", "重新选择类别", "Cambiar categoría"))}</button></div>`;
                    const i = h.indexOf('<p class="nn">');
                    h = i >= 0 ? h.slice(0, i) + line + h.slice(i) : h;
                }
            }
            catch (e) {
                warn("card", e);
            }
            return h;
        };
    }
    if (typeof v68pEdit === "function") {
        const __ed92i = v68pEdit;
        v68pEdit = function () {
            const t = userTen();
            return withEx(t, () => __ed92i.apply(this, arguments));
        };
    }
    function itemDom() {
        if (typeof cur === "undefined" || cur !== "item")
            return;
        const w = document.getElementById("well"), t = userTen();
        if (!w || !t)
            return;
        css();
        w.querySelectorAll("span.rw > .stno").forEach((n) => {
            if (n.parentElement)
                n.parentElement.classList.add("v92istr");
        });
        const L = pending() ? [] : missList(t);
        if (L.length && !w.querySelector("[data-v92imiss]")) {
            const tw = document.createTreeWalker(w, NodeFilter.SHOW_TEXT);
            let host = null;
            while (tw.nextNode()) {
                const n = tw.currentNode;
                if (n.nodeValue && /1問ずつ伺います/.test(n.nodeValue) && n.parentElement && !n.parentElement.closest(".rd-x")) {
                    host = n.parentElement;
                    break;
                }
            }
            if (host) {
                const box = host.closest("div[style*='or-soft']") || host;
                const d = document.createElement("div");
                d.className = "v92imiss";
                d.setAttribute("data-v92imiss", "1");
                d.setAttribute("data-noi18n", "");
                d.innerHTML = `<button class="btn" type="button" data-v92iact="fill">✎ ${E(M(`この画面で入れる（${L.length}件）`, `Fill in here (${L.length})`, `在此页面填写（${L.length}项）`, `Completar aquí (${L.length})`))}</button>` +
                    `<button class="btn g" type="button" data-v92iact="hear">🤖 ${E(M("AI に1問ずつ聞いてもらう", "Let the AI ask one by one", "让 AI 逐项提问", "Que la IA pregunte"))}</button>`;
                const dv = box.querySelector("[data-v68summ]");
                if (dv)
                    dv.insertAdjacentElement("beforebegin", d);
                else
                    box.appendChild(d);
            }
        }
        const tile = Array.from(w.querySelectorAll("p.lbl")).find(p => /登録済みの項目/.test(p.textContent || "") && !p.closest(".rd-x"));
        if (tile && tile.parentElement && !tile.parentElement.querySelector("[data-v92ilack]")) {
            const d = document.createElement("div");
            d.className = "v92ilack";
            d.setAttribute("data-v92ilack", "1");
            d.setAttribute("data-noi18n", "");
            if (L.length) {
                const names = L.slice(0, 4).map(x => needName(x.k, t)).join("・") + (L.length > 4 ? M(` ほか${L.length - 4}件`, ` +${L.length - 4}`, ` 等${L.length - 4}项`, ` +${L.length - 4}`) : "");
                d.innerHTML = `<button class="btn g" type="button" data-v92iact="fill" title="${E(names)}">✎ ${E(M(`未登録の ${L.length}件を入れる`, `Fill in ${L.length} missing`, `填写未登记的 ${L.length} 项`, `Completar ${L.length}`))}</button>`;
                tile.parentElement.appendChild(d);
            }
        }
    }
    W.v92itemDom = itemDom;
    if (typeof render === "function") {
        const __rd92i = render;
        render = function () {
            try {
                const t0 = userTen();
                if (t0 && t0.src === "upload" && !t0.v92icf && hasV(t0.compRows) && typeof cur !== "undefined" && cur === "item" && typeof syncTenant === "function")
                    syncTenant();
            }
            catch (e) { }
            const r = __rd92i.apply(this, arguments);
            try {
                itemDom();
            }
            catch (e) {
                warn("dom", e);
            }
            return r;
        };
    }
    W.v92itemT = { parseSpec, fixFoodRows, kvOf, pairOf, protectCont, protectIn, restore, compFromPairs, missList, fillPct };
    try {
        if (typeof I18N !== "undefined" && I18N && I18N.dict) {
            const R = [
                ["GST（物品・サービス税・参考値）", "GST (goods and services tax, reference)", "GST（商品及服务税・参考值）", "GST (impuesto sobre bienes y servicios, referencia)"],
                ["GST（連邦の物品・サービス税。州の税は別・参考値）", "GST (federal; provincial taxes separate, reference)", "GST（联邦商品及服务税，省税另计・参考值）", "GST (federal; impuestos provinciales aparte, referencia)"],
                ["IGST（統合物品・サービス税。品目で率が変わります・参考値）", "IGST (integrated GST; rate varies by item, reference)", "IGST（综合商品及服务税，税率因品目而异・参考值）", "IGST (la tasa varía según el producto, referencia)"],
                ["営業税（参考値）", "Business tax (reference)", "营业税（参考值）", "Impuesto comercial (referencia)"],
                ["増値税（品目で率が変わります・参考値）", "VAT (rate varies by item, reference)", "增值税（税率因品目而异・参考值）", "IVA (la tasa varía según el producto, referencia)"],
                [TAX_MY, "Sales tax (SST; 10% in principle, 5% or exempt for some items)", "销售税（SST，原则上10%，部分品目5%或免税）", "Impuesto sobre ventas (SST; 10% en principio, 5% o exento según el producto)"],
                ["健康食品の項目", "Health food / supplement details", "保健食品项目", "Datos del suplemento"], ["摂取の目安（1日あたり）", "Suggested daily intake", "每日建议摄入量", "Ingesta diaria sugerida"],
                ["形状・内容量", "Form / net contents", "形态・内容量", "Forma / contenido neto"], ["表示の区分（日本／相手国）", "Product classification (Japan / destination)", "标示类别（日本／对方国家）", "Clasificación (Japón / destino)"],
                ["色・サイズの展開", "Colors / sizes", "颜色・尺码", "Colores / tallas"], ["取り扱い・洗濯の表示", "Care / washing instructions", "保养・洗涤标示", "Cuidado / lavado"],
                ["成分・材質", "Ingredients / materials", "成分・材质", "Ingredientes / materiales"], ["登録中", "In progress", "登记中", "En curso"], ["摂取・召し上がり方の目安", "Suggested intake / how to take", "建议摄入量・食用方法", "Ingesta sugerida"]
            ];
            R.forEach(r => {
                ["en", "zh", "es"].forEach((l, i) => {
                    if (I18N.dict[l] && !I18N.dict[l][r[0]])
                        I18N.dict[l][r[0]] = r[i + 1];
                });
            });
        }
    }
    catch (e) { }
})();
