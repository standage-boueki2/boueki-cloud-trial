(function () {
    const W = window;
    if (W.__v2192docs)
        return;
    W.__v2192docs = 1;
    W.__v92docsErr = [];
    const warn = (k, e) => { try {
        if (W.__v92docsErr.length < 30)
            W.__v92docsErr.push(k + ": " + String((e && e.message) || e));
    }
    catch (x) { } };
    const E = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const lang = () => {
        try {
            const el = document.getElementById("lang");
            const v = String((el && el.value) || (typeof I18N !== "undefined" && I18N && I18N.lang) || "ja");
            return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja";
        }
        catch (e) {
            return "ja";
        }
    };
    const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const NK = (s) => { let x = String(s == null ? "" : s); try {
        x = x.normalize("NFKC");
    }
    catch (e) { } return x; };
    const noComma = (s) => NK(s).replace(/(\d),(?=\d{3}(?!\d))/g, "$1");
    const getD = () => { try {
        return (typeof D !== "undefined" && D) || null;
    }
    catch (e) {
        return null;
    } };
    const getT = () => { try {
        return (typeof TEN !== "undefined" && TEN) || null;
    }
    catch (e) {
        return null;
    } };
    const getS = () => { const d = getD(); return (d && d.ship) || null; };
    const curDoc = () => String(W.__poDocK || "pi");
    const fmt = (n, dp) => n.toLocaleString("en-US", { maximumFractionDigits: dp == null ? 1 : dp });
    const dictAdd = (rows) => {
        try {
            if (typeof I18N === "undefined" || !I18N || !I18N.dict)
                return;
            rows.forEach(r => ["en", "zh", "es"].forEach((l, i) => { if (r[i + 1] && I18N.dict[l] && !I18N.dict[l][r[0]])
                I18N.dict[l][r[0]] = r[i + 1]; }));
        }
        catch (e) { }
    };
    if (typeof v68trKgOf === "function") {
        const __kg92 = v68trKgOf;
        v68trKgOf = function (s, head) { return __kg92.call(this, noComma(s), head); };
    }
    if (typeof v56shipKg === "function") {
        const __skg92 = v56shipKg;
        v56shipKg = function (s) { return __skg92.call(this, noComma(s)); };
    }
    const UNIT_ROW = /車両重量|車両総重量|機械質量|運転質量|機体質量|機体重量|本体質量/;
    const isUnitGoods = (d) => {
        try {
            d = d || getD();
            if (!d)
                return false;
            const cat = String(d.cat || ""), ck = String(d.catKey || "");
            const hs = String(d.hs || "").replace(/\D/g, "");
            if (/^(8701|8702|8703|8704|8705|8711|8429|8430|8426|8427|8433|8432)/.test(hs) && !/部品|パーツ|parts/i.test(String(d.item || "")))
                return true;
            if (ck === "car" || /中古車|建設機械|建機|車両/.test(cat)) {
                if (hs && /^(8708|8714|8431|4011|8507|8511|8512)/.test(hs))
                    return false;
                return true;
            }
            return (d.dimRows || []).some((r) => Array.isArray(r) && UNIT_ROW.test(String(r[0] || "")));
        }
        catch (e) {
            return false;
        }
    };
    const unitInfo = (d) => {
        const o = { kg: 0, kgLabel: "", dim: null, dimTxt: "" };
        try {
            d = d || getD() || {};
            const rows = (d.dimRows || []).filter(Array.isArray);
            rows.forEach((r) => {
                const lab = NK(r[0] || ""), tx = noComma(r.slice(1).join(" "));
                if (!o.kg && (UNIT_ROW.test(lab) || /^(重量|質量|本体重量|寸法・重量|サイズ・重量)/.test(lab))) {
                    const m = tx.match(/(\d+(?:\.\d+)?)\s*(kg|t|トン|キロ)(?![a-z])/i);
                    if (m) {
                        o.kg = /^(t|トン)$/i.test(m[2]) ? +m[1] * 1000 : +m[1];
                        o.kgLabel = UNIT_ROW.test(lab) ? lab : "";
                    }
                }
                if (!o.dim) {
                    const src = noComma(lab + " " + r.slice(1).join(" ")).replace(/全長|全幅|全高|長さ|高さ|幅|[（(]輸送時[)）]|\b[LWH]\b/g, " ").replace(/(\d)\s*(mm|cm|m)\s*[×xX＊*]/gi, "$1$2×");
                    let dm = null;
                    try {
                        dm = (typeof v56shipDims === "function") ? v56shipDims(src) : null;
                    }
                    catch (e) { }
                    if (dm && dm.m && dm.m.every((n) => n > 0)) {
                        o.dim = dm;
                        const mm = dm.m.map((n) => Math.round(n * 1000));
                        o.dimTxt = mm.map((n) => fmt(n, 0)).join(" × ") + " mm";
                    }
                }
            });
        }
        catch (e) {
            warn("unitInfo", e);
        }
        return o;
    };
    if (typeof v68trPackInfo === "function") {
        const __pi92 = v68trPackInfo;
        v68trPackInfo = function () {
            let dd = null, keep = null, changed = false;
            try {
                dd = (typeof v68trD === "function" ? v68trD() : getD()) || null;
                if (dd && typeof dd.ctn === "string" && /\d\s*(?:ft|フィート|feet|')/i.test(NK(dd.ctn))) {
                    keep = dd.ctn;
                    dd.ctn = NK(dd.ctn).replace(/\d+(?:\.\d+)?\s*(?:ft|フィート|feet|')\s*(?:コンテナ|container)?/gi, " ");
                    changed = true;
                }
            }
            catch (e) { }
            let r;
            try {
                r = __pi92.apply(this, arguments);
            }
            finally {
                if (changed && dd)
                    dd.ctn = keep;
            }
            try {
                if (!r)
                    return r;
                if (isUnitGoods(dd)) {
                    const u = unitInfo(dd);
                    return Object.assign({}, r, { per: 0, kg: 0, ukg: 0, dim: null, v92unit: u });
                }
                if (!(r.ukg > 0) && dd) {
                    const rows = (dd.dimRows || []).filter(Array.isArray);
                    for (const row of rows) {
                        const lab = NK(row[0] || "");
                        if (/外装|外箱|カートン|ケース|梱包|包装|荷姿|入数|carton|case|packing/i.test(lab))
                            continue;
                        if (!/寸法・重量|サイズ・重量|重量|重さ|質量|単品|個装|本体|製品|weight/i.test(lab))
                            continue;
                        const segs = noComma(row.slice(1).join(" ")).split(/[／\/;；・、]/).filter((x) => !/外装|外箱|カートン|ケース|入り|入数/.test(x));
                        let kg = 0;
                        for (const sg of segs) {
                            const m = sg.match(/(\d+(?:\.\d+)?)\s*(kg|g|キロ|グラム)(?![a-z])/i);
                            if (m) {
                                kg = /^(g|グラム)$/i.test(m[2]) ? +m[1] / 1000 : +m[1];
                                break;
                            }
                        }
                        if (kg > 0) {
                            r = Object.assign({}, r, { ukg: kg, v92ukgFrom: lab });
                            break;
                        }
                    }
                }
            }
            catch (e) {
                warn("packInfo", e);
            }
            return r;
        };
    }
    const qtyUnitJa = (S) => { try {
        return ((NK(S && S.qty).match(/^\s*\d[\d,]*(?:\.\d+)?\s*([^\s（(0-9]{1,4})/) || [])[1] || "").replace(/（.*$/, "");
    }
    catch (e) {
        return "";
    } };
    const qtyN = (S) => { try {
        const m = NK(S && S.qty).match(/\d[\d,]*(?:\.\d+)?/);
        return m ? parseFloat(m[0].replace(/,/g, "")) : 0;
    }
    catch (e) {
        return 0;
    } };
    const MISS = () => M("（要入力）", "(to be entered)", "（待填写）", "(por completar)");
    if (typeof v68trPlFill === "function") {
        const __pf92 = v68trPlFill;
        v68trPlFill = function (S) {
            const r = __pf92.apply(this, arguments);
            try {
                if (r && S && S.v68pl === 1 && isUnitGoods()) {
                    const R = S.docRows, row = R.plRows[0], q = qtyN(S), u = unitInfo();
                    const tot = (u.kg && q) ? u.kg * q : 0;
                    row[2] = q ? fmt(q, 0) + (q === 1 ? " unit" : " units") : "—";
                    row[3] = tot ? fmt(tot) + " kg" : "—";
                    const keep = (Array.isArray(R.plEx) ? R.plEx : []).filter((x) => Array.isArray(x) && !/^(Packing|Carton size|Carton weight|Total cartons|Gross \/ Net weight|Volume|Dimensions \(per unit\)|Weight \(per unit\)|Total units|Total weight|Chassis \/ Serial No\.)$/.test(String(x[0])));
                    R.plEx = [["Packing", "Unpacked unit cargo (no cartons)"], ["Dimensions (per unit)", u.dimTxt || "—"], ["Weight (per unit)", u.kg ? fmt(u.kg) + " kg" : "—"],
                        ["Total units", q ? fmt(q, 0) : "—"], ["Total weight", tot ? fmt(tot) + " kg" : "—"], ["Chassis / Serial No.", "—"]].concat(keep);
                    S.v92unitpl = 1;
                }
                else if (S && S.v92unitpl)
                    delete S.v92unitpl;
            }
            catch (e) {
                warn("plFill", e);
            }
            return r;
        };
    }
    if (typeof v68trPackNote === "function") {
        const __pn92 = v68trPackNote;
        v68trPackNote = function (S) {
            try {
                if (isUnitGoods()) {
                    const q = qtyN(S), u = unitInfo(), un = qtyUnitJa(S) || "台";
                    const L = [];
                    L.push(M(`台数 ${fmt(q, 0)}${un}`, `${fmt(q, 0)} unit(s)`, `台数 ${fmt(q, 0)}`, `${fmt(q, 0)} unidad(es)`));
                    if (u.kg)
                        L.push(M(`重量 ＝ 1${un}の重量 ${fmt(u.kg)}kg（寸法表の${u.kgLabel ? "「" + u.kgLabel + "」" : "登録の値"}）× ${fmt(q, 0)}${un} ＝ ${fmt(u.kg * q)}kg`, `Weight = ${fmt(u.kg)} kg per unit (registered) × ${fmt(q, 0)} = ${fmt(u.kg * q)} kg`, `重量 ＝ 每台 ${fmt(u.kg)}kg（登记值）× ${fmt(q, 0)} ＝ ${fmt(u.kg * q)}kg`, `Peso = ${fmt(u.kg)} kg por unidad (registrado) × ${fmt(q, 0)} = ${fmt(u.kg * q)} kg`));
                    if (u.dimTxt)
                        L.push(M(`1${un}の寸法 ${u.dimTxt}（寸法表の値）`, `Dimensions per unit ${u.dimTxt} (registered)`, `每台尺寸 ${u.dimTxt}（登记值）`, `Medidas por unidad ${u.dimTxt} (registrado)`));
                    const miss = [];
                    if (!u.kg)
                        miss.push(M(`1${un}の重量`, "weight per unit", "每台重量", "peso por unidad"));
                    if (!u.dimTxt)
                        miss.push(M(`1${un}の寸法`, "dimensions per unit", "每台尺寸", "medidas por unidad"));
                    miss.push(M("車台番号・製造番号（Chassis / Serial No.）", "chassis / serial No.", "车架号・序列号", "n.º de chasis / serie"));
                    let h = `<span data-noi18n>${E(M("車両・機械は、1台ごとの貨物として出しています（カートンの数・入数は計算しません）：", "Vehicles and machines are listed as unit cargo (no carton calculation): ", "车辆・机械按整台货物列出（不计算箱数）：", "Los vehículos y máquinas se listan por unidad (sin cálculo de cajas): "))}${E(L.join(M("／", " / ", "／", " / ")))}</span>`;
                    h += `<br><span class="v68trnote" data-noi18n>${E(M(`足りない項目${MISS()}：${miss.join("・")}。積み方（RORO・コンテナ・フラットラック）と、梱包後の総重量は、物流会社と決めてから入れてください（推し量った値は入れていません）。`, `Missing ${MISS()}: ${miss.join(", ")}. Enter the loading method (RORO / container / flat rack) and the gross weight after you agree them with your forwarder (no estimated values are filled in).`, `缺少${MISS()}：${miss.join("・")}。装载方式和毛重请与物流公司确定后填写（未填入估算值）。`, `Falta ${MISS()}: ${miss.join(", ")}. Indique el método de carga y el peso bruto tras acordarlos con su transitario (no se rellenan valores estimados).`))}</span>`;
                    return h;
                }
            }
            catch (e) {
                warn("packNote", e);
            }
            return __pn92.apply(this, arguments);
        };
    }
    const originNorm = (s) => {
        let x = String(s == null ? "" : s);
        x = x.replace(/[（(]\s*(?:日本国?|国産|Japan)\s*[（(]([^（）()]*)[）)]\s*[）)]/i, "($1)");
        x = x.replace(/[（(]\s*(?:日本国?|国産|Japan)\s*[・、,\s]\s*([^（）()]+)[）)]/i, "($1)");
        x = x.replace(/^(\s*Japan)\s*[（(]\s*(?:日本国?|国産|Japan)\s*[）)]/i, "$1");
        return x;
    };
    if (typeof v56docOriginEn === "function") {
        const __oe92 = v56docOriginEn;
        v56docOriginEn = function (s) {
            let r = __oe92.call(this, originNorm(s));
            try {
                r = String(r).replace(/^(\s*Japan(?:\s*\([^()]*\))?)\s*[)）]+\s*$/, "$1");
            }
            catch (e) { }
            return r;
        };
    }
    if (typeof v56shipTermPlace === "function") {
        const __tp92 = v56shipTermPlace;
        v56shipTermPlace = function (s, code) {
            const r = __tp92.apply(this, arguments);
            try {
                if (r && /^[A-Za-z]/.test(r)) {
                    const x = NK(s).replace(/[（(][^）)]*[）)]/g, " ");
                    const i = x.indexOf(r);
                    if (i >= 0) {
                        const words = x.slice(i).split(/\s+/);
                        const out = [];
                        for (const w of words) {
                            if (out.length >= 4 || !/^[A-Za-z][A-Za-z.'\-]*,?$/.test(w) || /^(incoterms?|price|unit|usd|jpy|eur|per|japan)$/i.test(w.replace(/,$/, "")))
                                break;
                            out.push(w.replace(/,$/, ""));
                            if (/,$/.test(w))
                                break;
                        }
                        if (out.length > 1)
                            return out.join(" ");
                    }
                }
            }
            catch (e) {
                warn("termPlace", e);
            }
            return r;
        };
    }
    const incOf = (s) => { try {
        return typeof v56docInc === "function" ? v56docInc(s) : ((NK(s).toUpperCase().match(/\b(EXW|FCA|FAS|FOB|CFR|CNF|CIF|CPT|CIP|DAP|DPU|DDP)\b/) || [])[1] || "");
    }
    catch (e) {
        return "";
    } };
    const priceClean = (v) => { const s = String(v == null ? "" : v); const m = NK(s).match(/^\s*((?:US\$|USD|\$|¥|￥|JPY|EUR|€)\s*[\d,]+(?:\.\d+)?)\s*[\/／]\s*\S{1,6}\s*$/i); return m ? m[1] : s; };
    const rowsFix = (S) => {
        try {
            const R = S && S.docRows;
            if (!R)
                return;
            if (Array.isArray(R.ex) && S.term && incOf(S.term) && !S.poNo) {
                const d = R.ex.find((r) => r && r[0] === "Delivery");
                if (d && String(d[1]) !== String(S.term))
                    d[1] = String(S.term);
            }
            if (Array.isArray(R.pi))
                R.pi.forEach((r) => { if (Array.isArray(r) && r.length >= 3)
                    r[2] = priceClean(r[2]); });
        }
        catch (e) {
            warn("rowsFix", e);
        }
    };
    if (typeof v54docSyncRows === "function") {
        const __sr92 = v54docSyncRows;
        v54docSyncRows = function (S) { const r = __sr92.apply(this, arguments); rowsFix(S); return r; };
    }
    const BAND_NAME = { km: ["走行距離", "mileage"], hour: ["稼働時間", "operating hours"], year: ["年式", "model year"] };
    const bandOf = (t) => {
        try {
            if (!t || !Array.isArray(t.priceRows) || t.priceRows.length < 2)
                return null;
            const cols = (t.priceCols || []).map((c) => NK(c));
            const head = String(cols[0] || "").trim();
            const cells = t.priceRows.filter(Array.isArray).map((r) => noComma(r[0] || ""));
            let kind = "";
            if (/走行|距離|mileage|odometer|\bkm\b/i.test(head))
                kind = "km";
            else if (/稼働|稼動|アワー|使用時間|運転時間|hour/i.test(head))
                kind = "hour";
            else if (/年式|model\s*year/i.test(head))
                kind = "year";
            else if (!/数量|ロット|qty|quantity|個数|本数|枚数|台数|MOQ|発注|注文/i.test(head)) {
                if (cells.filter((c) => /\d\s*(km|キロ)/i.test(c)).length >= 2)
                    kind = "km";
                else if (cells.filter((c) => /\d\s*(時間|hrs?|hours?)/i.test(c)).length >= 2)
                    kind = "hour";
            }
            if (!kind)
                return null;
            const rows = [];
            t.priceRows.forEach((r, idx) => {
                if (!Array.isArray(r))
                    return;
                const c = noComma(r[0] || "");
                const ns = (c.match(/\d+(?:\.\d+)?/g) || []).map(Number).map((n) => (/万/.test(c) && n < 1000 ? n * 10000 : n));
                let lo = 0, hi = Infinity;
                if (ns.length >= 2) {
                    lo = ns[0];
                    hi = ns[1];
                }
                else if (ns.length === 1) {
                    if (/^\s*[〜～~\-]|以下|未満|まで|under|up to|<\s*\d/i.test(c))
                        hi = ns[0];
                    else if (/[〜～~\-]\s*$|以上|超|over|\+\s*$|>\s*\d/i.test(c))
                        lo = ns[0];
                    else {
                        lo = ns[0];
                        hi = ns[0];
                    }
                }
                else
                    return;
                let pv = "";
                for (let i = 1; i < r.length; i++) {
                    let p = null;
                    try {
                        p = typeof v54docPrice === "function" ? v54docPrice(r[i]) : null;
                    }
                    catch (e) { }
                    if (p && p.v && p.cur) {
                        pv = p.v;
                        break;
                    }
                }
                if (pv)
                    rows.push({ idx, lo, hi, label: String(r[0]).trim(), v: pv });
            });
            if (rows.length < 2)
                return null;
            let val = null, valTxt = "";
            const txtRows = [].concat(t.compRows || [], t.specRows || [], t.dimRows || []).filter(Array.isArray);
            const free = noComma([t.item, t.itemEn, t.material, t.spec, t.desc].filter(Boolean).join(" ／ "));
            const pick = (labRe, valRe, freeRe, mul) => {
                for (const r of txtRows) {
                    if (!labRe.test(NK(r[0] || "")))
                        continue;
                    const m = noComma(r.slice(1).join(" ")).match(valRe);
                    if (m) {
                        val = mul ? mul(m) : +m[1];
                        valTxt = m[0].trim();
                        return;
                    }
                }
                const m = free.match(freeRe);
                if (m) {
                    val = mul ? mul(m) : +m[1];
                    valTxt = m[0].trim();
                }
            };
            if (kind === "km")
                pick(/走行|mileage|odometer/i, /(\d+(?:\.\d+)?)\s*(万)?\s*(?:km|キロ)/i, /(?:走行(?:距離)?|mileage)\s*[:：]?\s*(\d+(?:\.\d+)?)\s*(万)?\s*(?:km|キロ)/i, m => +m[1] * (m[2] ? 10000 : 1));
            else if (kind === "hour")
                pick(/稼働|稼動|アワー|hour/i, /(\d+(?:\.\d+)?)\s*(?:時間|hrs?|hours?|h)(?![a-z])/i, /(?:(?:稼働|稼動|アワーメーター|hour\s*meter)\s*[:：]?\s*(\d+(?:\.\d+)?)\s*(?:時間|hrs?|hours?|h)(?![a-z]))|(?:(\d+(?:\.\d+)?)\s*(?:hrs|hours))/i, m => +(m[1] || m[2]));
            else if (kind === "year")
                pick(/年式|製造年|model\s*year/i, /((?:19|20)\d{2})/, /((?:19|20)\d{2})\s*年式/);
            if (val != null)
                valTxt = kind === "km" ? fmt(val, 0) + "km" : kind === "hour" ? fmt(val, 0) + "時間" : String(val) + "年";
            let auto = -1;
            if (val != null) {
                const hit = rows.filter(r => val >= r.lo && val <= r.hi);
                if (hit.length)
                    auto = hit[0].idx;
            }
            let chosen = -1;
            const cz = t.v92band;
            if (cz && typeof cz === "object" && cz.h === head && rows.some(r => r.idx === +cz.i))
                chosen = +cz.i;
            return { kind, head, rows, val, valTxt, auto, chosen, out: val != null && auto < 0 };
        }
        catch (e) {
            warn("bandOf", e);
            return null;
        }
    };
    W.v92docsBandOf = bandOf;
    const bandApply = (d, t) => {
        try {
            const S = d && d.ship;
            if (!S || !t || S.poNo || !S.v54gen)
                return;
            delete S.v92band;
            const B = bandOf(t);
            if (!B)
                return;
            const P = S.v54price || {};
            const manual = P.k === "manual";
            const idx = B.chosen >= 0 ? B.chosen : B.auto;
            const info = { kind: B.kind, head: B.head, valTxt: B.valTxt, how: B.chosen >= 0 ? "chosen" : (B.auto >= 0 ? "auto" : "need"), out: B.out, manual };
            if (idx >= 0 && !manual) {
                const row = B.rows.find((r) => r.idx === idx);
                info.label = row.label;
                info.v = row.v;
                if (String(S.unitPrice) !== String(row.v)) {
                    S.unitPrice = row.v;
                    const q = (typeof v54docNum === "function" ? v54docNum(S.qty) : qtyN(S)) || 0;
                    const m = (typeof v54docMoney === "function" && q) ? v54docMoney(row.v, q) : null;
                    if (m)
                        S.total = m;
                }
                S.v54price = { k: "table", v: row.v };
                if (typeof v54docSyncRows === "function")
                    v54docSyncRows(S);
            }
            else if (idx < 0)
                info.first = (B.rows[0] || {}).label;
            S.v92band = info;
        }
        catch (e) {
            warn("bandApply", e);
        }
    };
    if (typeof tenantToD === "function") {
        const __ttd92 = tenantToD;
        tenantToD = function (t) {
            const d = __ttd92.apply(this, arguments);
            try {
                bandApply(d, t);
                if (d && d.ship && d.ship.v54gen && !d.ship.poNo)
                    rowsFix(d.ship);
            }
            catch (e) {
                warn("ttd", e);
            }
            return d;
        };
    }
    const bandNoteHtml = (S) => {
        const b = S && S.v92band;
        if (!b)
            return "";
        const t = getT(), B = bandOf(t);
        if (!B)
            return "";
        const nm = (BAND_NAME[b.kind] || ["", ""]);
        const sel = `<select class="sel" data-v92band="1" style="font-size:11px;padding:2px 6px;max-width:260px" aria-label="${E(b.head)}"><option value="">${E(M("（行を選ぶ）", "(choose a row)", "（选择一行）", "(elija una fila)"))}</option>${B.rows.map((r) => `<option value="${r.idx}"${B.chosen === r.idx ? " selected" : ""}>${E(r.label)} → ${E(r.v)}</option>`).join("")}</select>`;
        if (b.manual)
            return "";
        if (b.how === "auto")
            return `<br><span data-noi18n>${E(M(`この価格表は「${b.head}」ごとの価格です（数量で決まる価格ではありません）。この商品の${nm[0]}（${b.valTxt}）に当たる行「${b.label}」の ${b.v} を入れています。`, `This price list is by ${nm[1]} (“${b.head}”), not by quantity. The row “${b.label}” (${b.v}) matching this product's ${nm[1]} (${b.valTxt}) is used.`, `本价格表按“${b.head}”定价（不是按数量）。已使用与本商品（${b.valTxt}）相符的一行“${b.label}”的 ${b.v}。`, `Esta lista de precios es por «${b.head}» (no por cantidad). Se usa la fila «${b.label}» (${b.v}) que corresponde a este producto (${b.valTxt}).`))}</span> <span data-noi18n>${E(M("違う行にする：", "Use another row: ", "改用其他行：", "Usar otra fila: "))}</span>${sel}`;
        if (b.how === "chosen")
            return `<br><span data-noi18n>${E(M(`この価格表は「${b.head}」ごとの価格です（数量で決まる価格ではありません）。あなたが選んだ行「${b.label}」の ${b.v} を入れています。`, `This price list is by ${nm[1]} (“${b.head}”), not by quantity. The row you chose, “${b.label}” (${b.v}), is used.`, `本价格表按“${b.head}”定价（不是按数量）。已使用您选择的一行“${b.label}”的 ${b.v}。`, `Esta lista de precios es por «${b.head}» (no por cantidad). Se usa la fila que eligió, «${b.label}» (${b.v}).`))}</span> <span data-noi18n>${E(M("選び直す：", "Change: ", "重新选择：", "Cambiar: "))}</span>${sel}`;
        return `<br><span class="v68trnote" style="color:var(--warn)" data-noi18n>⚠ ${E(M(`この価格表は「${b.head}」ごとの価格です（数量で決まる価格ではありません）。${b.out ? `この商品の${nm[0]}（${b.valTxt}）は、価格表のどの行にも入りません。` : `この商品の${nm[0]}が登録に無いため、どの行の価格かを決められません。`}いまの単価は、価格表のいちばん上の行「${b.first}」の値が仮に入っています。この車両・機械に当たる行を選んでください：`, `This price list is by ${nm[1]} (“${b.head}”), not by quantity. ${b.out ? `This product's ${nm[1]} (${b.valTxt}) is outside every row.` : `This product's ${nm[1]} is not registered, so the row cannot be decided.`} The unit price now shows the first row “${b.first}” provisionally. Choose the row for this unit: `, `本价格表按“${b.head}”定价（不是按数量）。${b.out ? `本商品（${b.valTxt}）不在任何一行内。` : `本商品的该数值未登记，无法确定对应的行。`}当前单价暂用第一行“${b.first}”的值。请选择对应的行：`, `Esta lista de precios es por «${b.head}» (no por cantidad). ${b.out ? `El valor de este producto (${b.valTxt}) queda fuera de todas las filas.` : `El valor de este producto no está registrado.`} El precio muestra provisionalmente la primera fila «${b.first}». Elija la fila: `))}</span>${sel}`;
    };
    const priceInc = (t) => {
        try {
            if (!t)
                return "";
            const a = incOf((t.priceCols || []).join(" "));
            if (a)
                return a;
            const rows = (t.priceRows || []).filter(Array.isArray);
            for (const r of rows) {
                const x = incOf(r.join(" "));
                if (x)
                    return x;
            }
        }
        catch (e) { }
        return "";
    };
    const termGap = (S) => {
        try {
            if (!S || S.poNo)
                return null;
            const P = S.v54price || {};
            if (P.k === "manual" || (P.k === "tier" && String(S.unitPrice) !== String(P.v)))
                return null;
            const di = incOf(S.term), pi = priceInc(getT());
            if (!di || !pi || di === pi)
                return null;
            return { doc: di, price: pi };
        }
        catch (e) {
            return null;
        }
    };
    const GROUP_C = /^(CFR|CIF|CPT|CIP|DAP|DPU|DDP)$/;
    const gapText = (g) => {
        const more = GROUP_C.test(g.doc) && !GROUP_C.test(g.price);
        return M(`単価は ${g.price} の登録値（価格表）のままです。この書類の建値は ${g.doc} です。${more ? "運賃・保険料などを足した単価に直してください" : "建値に合う単価に直してください"}（自動では足し引きしていません。「受注内容を編集」の「単価」で直せます）。`, `The unit price is still the registered ${g.price} price from the price list, but this document's trade term is ${g.doc}. ${more ? "Add freight, insurance, etc. to the unit price" : "Adjust the unit price to the trade term"} (nothing is added automatically; edit “Unit price” in the order details).`, `单价仍是价格表登记的 ${g.price} 价格，而本单证的贸易术语为 ${g.doc}。${more ? "请改为加上运费・保险费等的单价" : "请改为符合该术语的单价"}（系统不会自动加减）。`, `El precio unitario sigue siendo el ${g.price} registrado, pero el término de este documento es ${g.doc}. ${more ? "Añada flete, seguro, etc. al precio" : "Ajuste el precio al término"} (no se añade nada automáticamente).`);
    };
    if (typeof v54docSrcNote === "function") {
        const __sn92 = v54docSrcNote;
        v54docSrcNote = function (S) {
            let h = __sn92.apply(this, arguments);
            try {
                const k = curDoc();
                if (k === "pi" || k === "ci") {
                    const g = termGap(S);
                    if (g)
                        h = `<span class="v68trnote v92docs-gap" style="color:var(--warn);font-weight:700" data-noi18n>⚠ ${E(gapText(g))}</span><br>` + String(h);
                    h = String(h) + bandNoteHtml(S);
                }
            }
            catch (e) {
                warn("srcNote", e);
            }
            return h;
        };
    }
    if (typeof v33CkQuote === "function") {
        const __ck92 = v33CkQuote;
        v33CkQuote = function () {
            let F = __ck92.apply(this, arguments) || [];
            try {
                const S = getS(), k = curDoc();
                if (k === "pl")
                    F = F.filter((f) => !/振込先|Bank details|お振込先/.test(String((f && f.t) || "")));
                else if (S && (k === "pi" || k === "ci")) {
                    const g = termGap(S);
                    if (g && !F.some((f) => f && f.v92 === "gap"))
                        F.push({ lv: "yel", v92: "gap", t: M(`単価が ${g.price} の登録値のまま、書類の建値は ${g.doc} です`, `The unit price is the registered ${g.price} price, but the document's term is ${g.doc}`, `单价为登记的 ${g.price} 价格，但单证术语为 ${g.doc}`, `El precio es el ${g.price} registrado, pero el término es ${g.doc}`), how: M("建値に合う単価（運賃・保険料などを含む／含まない）に直してから送ってください。自動では足していません", "Adjust the unit price to the trade term before sending. Nothing is added automatically", "请改为符合术语的单价后再发送", "Ajuste el precio al término antes de enviar"), go: (typeof v54docSetBuyer === "function") ? () => v54docSetBuyer() : null });
                    const b = S.v92band;
                    if (b && b.how === "need" && !b.manual && !F.some((f) => f && f.v92 === "band"))
                        F.push({ lv: "yel", v92: "band", t: M(`価格表は「${b.head}」ごとの価格です。どの行の価格かを選んでいません`, `The price list is by “${b.head}”. The row has not been chosen`, `价格表按“${b.head}”定价，尚未选择对应的行`, `La lista es por «${b.head}». No se ha elegido la fila`), how: M("書類の下の注記で、この車両・機械に当たる行を選んでください（いまは、いちばん上の行の値が仮に入っています）", "Choose the row in the note under the document (the first row is shown provisionally)", "请在单证下方的注记中选择对应的行", "Elija la fila en la nota bajo el documento"), go: null });
                }
            }
            catch (e) {
                warn("ck", e);
            }
            return F;
        };
    }
    if (typeof v54docSetBuyer === "function") {
        const __sb92 = v54docSetBuyer;
        v54docSetBuyer = function () {
            try {
                if (typeof cur !== "undefined" && cur === "ops" && typeof opsTab !== "undefined" && opsTab === "doc" && typeof openStepEdit === "function") {
                    try {
                        if (typeof closeDW === "function")
                            closeDW();
                    }
                    catch (e) { }
                    setTimeout(() => {
                        try {
                            openStepEdit((typeof shipStep !== "undefined" && shipStep) || 0);
                            setTimeout(() => { const b = document.getElementById("seB"); if (b) {
                                b.focus();
                                try {
                                    b.select();
                                }
                                catch (e) { }
                            } }, 80);
                        }
                        catch (e) {
                            warn("setBuyer", e);
                        }
                    }, 60);
                    return;
                }
            }
            catch (e) { }
            return __sb92.apply(this, arguments);
        };
    }
    const unitEn = (S) => {
        try {
            const u = qtyUnitJa(S);
            if (!u)
                return "";
            if (/^[A-Za-z]+$/.test(u))
                return u;
            const X = Object.assign({ 台: "units", 個: "pcs", 本: "bottles", 袋: "bags", 箱: "boxes", 枚: "sheets", 缶: "cans", 瓶: "bottles", セット: "sets", 着: "pcs", 点: "pcs", 足: "pairs", 脚: "pcs", 冊: "copies", 巻: "rolls", kg: "kg" }, (typeof V85UNIT !== "undefined" && V85UNIT) || {});
            return X[u] || "";
        }
        catch (e) {
            return "";
        }
    };
    const dlPairs = (doc) => { const out = []; doc.querySelectorAll(".dl").forEach(dl => { const c = Array.from(dl.children); for (let i = 0; i + 1 < c.length; i += 2)
        out.push({ k: String(c[i].textContent || "").trim(), ke: c[i], v: c[i + 1], dl }); }); return out; };
    const decorate = (k) => {
        const o = document.getElementById("dO");
        const doc = o && o.querySelector(".doc");
        const S = getS(), d = getD();
        if (!o || !doc || !S || !d)
            return;
        const P = dlPairs(doc);
        const has = (re) => P.some(p => re.test(p.k));
        const R = S.docRows || {};
        if (k === "ci") {
            const anchor = P.find(p => /^(B\/L No\.|AWB No\.)$/.test(p.k)) || P.find(p => /^ETD/.test(p.k));
            if (anchor) {
                const add = [];
                const row = (a, html) => add.push(`<span data-noi18n data-v92ci="1">${E(a)}</span><span data-v92ci="1">${html}</span>`);
                if (!has(/^(Delivery|Incoterms|Terms of delivery)$/)) {
                    const raw = (((R.ex || []).find((r) => r && r[0] === "Delivery") || [])[1]) || S.term || "";
                    let h = "";
                    try {
                        h = typeof v56docDelivHtml === "function" ? v56docDelivHtml(raw, S) : `<span data-noi18n>${E(raw)}</span>`;
                    }
                    catch (e) {
                        h = `<span data-noi18n>${E(raw)}</span>`;
                    }
                    row("Terms of delivery", h);
                }
                if (!has(/^(Payment|Payment terms)$/)) {
                    let pv = String((((R.ex || []).find((r) => r && r[0] === "Payment") || [])[1]) || "");
                    if (!pv) {
                        try {
                            pv = typeof v54docPayEn === "function" ? v54docPayEn(S.pay || "") : String(S.pay || "");
                        }
                        catch (e) {
                            pv = String(S.pay || "");
                        }
                    }
                    row("Payment", pv ? `<span data-noi18n>${E(pv)}</span>` : `<span class="v56docmiss" data-noi18n>${E(MISS())}</span>`);
                }
                if (!has(/^HS code$/)) {
                    const hs = String(S.hs || d.hs || "").trim();
                    row("HS code", hs ? `<span data-noi18n>${E(hs)}</span>` : `<span class="v56docmiss" data-noi18n>${E(M("（HS コードが未登録です。商品情報で入れてください）", "(HS code not registered)", "（HS 编码未登记）", "(código SA no registrado)"))}</span>`);
                }
                if (!has(/^(Origin|Country of origin)$/)) {
                    let ov = String((((R.plEx || []).find((r) => r && r[0] === "Origin") || [])[1]) || "");
                    try {
                        if (ov && typeof v56docOriginEn === "function")
                            ov = v56docOriginEn(ov);
                    }
                    catch (e) { }
                    row("Country of origin", ov && !/[぀-ヿ㐀-鿿]/.test(ov) ? `<span data-noi18n>${E(ov)}</span>` : `<span class="v56docmiss" data-noi18n>${E(MISS())}</span>`);
                }
                const ue = unitEn(S);
                if (ue && !has(/^Unit of quantity$/))
                    row("Unit of quantity", `<span data-noi18n>${E(ue)}</span>`);
                if (add.length)
                    anchor.ke.insertAdjacentHTML("beforebegin", add.join(""));
            }
        }
        if (k === "pi" || k === "ci") {
            dlPairs(doc).forEach(p => {
                if (/^(Delivery|Incoterms|Terms of delivery)$/.test(p.k) && !/Incoterms/i.test(p.v.textContent || "") && !p.v.querySelector(".v56docmiss") && incOf(p.v.textContent || ""))
                    p.v.insertAdjacentHTML("beforeend", ` <span data-noi18n class="v92docs-inc">(Incoterms® 2020)</span>`);
            });
        }
        if (k === "pl" && S.v92unitpl) {
            doc.querySelectorAll("table thead th").forEach(th => { const t = String(th.textContent || "").trim(); if (t === "Cartons") {
                th.textContent = "Units";
                th.setAttribute("data-noi18n", "");
            } });
            doc.querySelectorAll("table tbody td").forEach(td => { const t = String(td.textContent || "").trim(); if (/^\d[\d,]*\s*CTN$/i.test(t))
                td.textContent = t.replace(/\s*CTN$/i, Number(t.replace(/\D/g, "")) === 1 ? " unit" : " units"); });
            dlPairs(doc).forEach(p => {
                if (/^(Dimensions \(per unit\)|Weight \(per unit\)|Total weight|Chassis \/ Serial No\.|Total units)$/.test(p.k) && /^\s*[—\-–]?\s*$/.test(p.v.textContent || ""))
                    p.v.innerHTML = `<span class="v56docmiss" data-noi18n>${E(MISS())}</span>`;
            });
            const prow = (R.plRows || [])[0] || [];
            doc.querySelectorAll("table tbody tr").forEach(tr => {
                const td = Array.from(tr.children);
                const isTot = /^\s*Total\s*$/.test(String((td[0] && td[0].textContent) || ""));
                if (isTot && td.length === 4) {
                    td[2].textContent = String(prow[2] || "—");
                    td[3].textContent = String(prow[3] || "—");
                }
                const last = td[td.length - 1];
                if (last && td.length >= 2 && /^\s*[—–]\s*$/.test(last.textContent || ""))
                    last.innerHTML = `<span class="v56docmiss" data-noi18n>${E(MISS())}</span>`;
            });
        }
        if (k === "pl" && !S.v92unitpl && !S.poNo) {
            dlPairs(doc).forEach(p => {
                if (/^(Carton size|Packing|Total cartons|Gross \/ Net weight)$/.test(p.k) && /^\s*[—–]\s*$/.test(p.v.textContent || ""))
                    p.v.innerHTML = `<span class="v56docmiss" data-noi18n>${E(MISS())}</span>`;
            });
        }
        try {
            const card = o.closest(".c");
            const old = card && card.querySelector(".v92docs-edit");
            if (old)
                old.remove();
            if (card && !S.poNo && S.v54gen && typeof v54docSetBuyer === "function") {
                const hasBtn = Array.from(card.querySelectorAll("button")).some(b => /相手の社名・条件を入れる/.test(b.textContent || "") && b.offsetParent);
                if (!hasBtn) {
                    const div = document.createElement("div");
                    div.className = "rw v92docs-edit";
                    div.setAttribute("style", "margin-top:8px;gap:6px;flex-wrap:wrap;align-items:center");
                    div.innerHTML = `<button class="btn g" type="button" data-v92docs="edit" data-noi18n>${E(M("✎ 受注内容を編集（相手・数量・単価・取引条件・支払）", "✎ Edit order details (buyer, quantity, price, terms, payment)", "✎ 编辑订单内容（对方・数量・单价・条件・付款）", "✎ Editar el pedido (comprador, cantidad, precio, términos, pago)"))}</button><span class="nn" style="margin:0;font-size:10.5px" data-noi18n>${E(M("直した内容は、見積書・請求書・梱包明細に入ります。", "Changes are reflected in the PI, CI and packing list.", "修改内容会反映到各单证。", "Los cambios se reflejan en los documentos."))}</span>`;
                    o.insertAdjacentElement("beforebegin", div);
                }
            }
        }
        catch (e) {
            warn("editBtn", e);
        }
        try {
            if (W.__v92docsScroll && Date.now() - W.__v92docsScroll < 2500) {
                W.__v92docsScroll = 0;
                const card = o.closest(".c") || o;
                setTimeout(() => { try {
                    card.scrollIntoView({ block: "start", behavior: "auto" });
                }
                catch (e) { } }, 60);
            }
        }
        catch (e) { }
    };
    if (typeof rDoc === "function") {
        const __rd92 = rDoc;
        rDoc = function (k) {
            try {
                const S = getS();
                if (S && !S.poNo)
                    rowsFix(S);
            }
            catch (e) { }
            const r = __rd92.apply(this, arguments);
            try {
                decorate(String(k || "pi"));
            }
            catch (e) {
                warn("decorate", e);
            }
            return r;
        };
    }
    document.addEventListener("click", (ev) => {
        try {
            const el = ev.target && ev.target.closest ? ev.target.closest("[data-v92docs],[data-onclick]") : null;
            if (!el)
                return;
            if (el.getAttribute("data-v92docs") === "edit") {
                ev.preventDefault();
                if (typeof v54docSetBuyer === "function")
                    v54docSetBuyer();
                return;
            }
            const oc = String(el.getAttribute("data-onclick") || "");
            if (/^opsTab='doc';window\.__poDocK=/.test(oc))
                W.__v92docsScroll = Date.now();
        }
        catch (e) { }
    }, true);
    document.addEventListener("change", (ev) => {
        try {
            const el = ev.target;
            if (!el || !el.getAttribute || el.getAttribute("data-v92band") !== "1")
                return;
            const t = getT();
            if (!t)
                return;
            const B = bandOf(t);
            if (!B)
                return;
            if (el.value === "")
                delete t.v92band;
            else
                t.v92band = { h: B.head, i: +el.value };
            try {
                if (typeof saveTen === "function")
                    saveTen();
            }
            catch (e) { }
            try {
                if (typeof syncTenant === "function")
                    syncTenant();
            }
            catch (e) { }
            try {
                if (typeof render === "function")
                    render();
            }
            catch (e) { }
            try {
                if (typeof toast === "function")
                    toast(M("価格表の行を選び、単価に入れました", "The price-list row was applied to the unit price", "已将所选行的价格填入单价", "Se aplicó la fila elegida al precio"));
            }
            catch (e) { }
        }
        catch (e) {
            warn("bandChange", e);
        }
    }, true);
    try {
        if (typeof V85DOC_D !== "undefined" && V85DOC_D && V85DOC_D.docs && Array.isArray(V85DOC_D.rules)) {
            V85DOC_D.issuers = V85DOC_D.issuers || {};
            if (!V85DOC_D.issuers.mlit)
                V85DOC_D.issuers.mlit = "運輸支局（国土交通省）・軽自動車検査協会";
            if (!V85DOC_D.issuers.psi_body)
                V85DOC_D.issuers.psi_body = "検査機関（JEVIC・QISJ など。仕向国が指定する機関）";
            if (!V85DOC_D.docs.EXP_DEREG)
                V85DOC_D.docs.EXP_DEREG = ["輸出抹消仮登録証明書（または輸出予定届出証明書・英訳つき）", "Export Certificate (Export Deregistration Certificate) with English translation", "mlit", "external", 5];
            if (!V85DOC_D.docs.PSI_VEH)
                V85DOC_D.docs.PSI_VEH = ["中古車の船積前検査証明書（JEVIC・QISJ など）", "Pre-shipment Inspection Certificate for Used Vehicles", "psi_body", "external", 7];
            const VH = ["8702", "8703", "8704", "8711"];
            if (!V85DOC_D.rules.some((r) => r && r.id === "v92d01"))
                V85DOC_D.rules.push({ id: "v92d01", k: ["EXP_DEREG"], w: { h: VH, d: ["*"], f: ["used_goods"] }, lv: "required", c: "登録のあった中古の自動車を輸出する時（輸出の通関で税関に出す）", is: "運輸支局（国土交通省）・軽自動車検査協会", ld: 5,
                    n: "登録中の車は輸出抹消仮登録、一時抹消ずみの車は輸出予定届出。相手国の登録に使うため、英訳をつけて輸入者へ送ることが多い。手続きの細目・期限は運輸支局と通関業者に要確認", s: "", u: "", ok: "要確認（一般事項。運輸支局・通関業者に確かめる）" });
            if (!V85DOC_D.rules.some((r) => r && r.id === "v92d02"))
                V85DOC_D.rules.push({ id: "v92d02", k: ["PSI_VEH"], w: { h: VH, d: ["*"], f: ["used_goods"] }, lv: "conditional", c: "仕向国が中古車の船積前検査（走行距離・年式・放射線・検疫など）を求める時。国ごとに違う", is: "検査機関（仕向国が指定する機関）", ld: 7,
                    n: "検査の要否・指定の検査機関・検査の中身は国ごとに違う。輸入者と検査機関に要確認", s: "", u: "", ok: "要確認（輸入者・検査機関に確かめる）" });
            V85DOC_D.flags = V85DOC_D.flags || {};
            if (!V85DOC_D.flags.animal_material)
                V85DOC_D.flags.animal_material = "動物由来の材料を含む（毛・膠・皮・骨・貝 など）";
            if (!V85DOC_D.docs.ANIMAL_CHECK)
                V85DOC_D.docs.ANIMAL_CHECK = ["動物由来の材料の確認（動物検疫・ワシントン条約の対象か）", "Check of animal-derived materials (animal quarantine / CITES)", "importer", "external", 7];
            if (!V85DOC_D.rules.some((r) => r && r.id === "v92d03"))
                V85DOC_D.rules.push({ id: "v92d03", k: ["ANIMAL_CHECK"], w: { h: ["*"], d: ["*"], f: ["animal_material"] }, lv: "check", c: "素材に動物由来の語（毛・膠・皮・骨・貝 など）がある時。動物の種類と、仕向国の動物検疫・ワシントン条約の対象かを確かめる", is: "輸入者・動物検疫所（対象のときは経済産業省）", ld: 7,
                    n: "動物の種類（学名）・加工の方法を仕入先に確かめる。対象かどうかは品目と国で違う。輸入者と動物検疫所に要確認", s: "", u: "", ok: "要確認（輸入者・動物検疫所に確かめる）" });
            V85DOC_D.rules.forEach((r) => { if (r && typeof r.c === "string" && /epa 表で/.test(r.c))
                r.c = r.c.replace(/epa 表で/g, "「EPA（関税が下がる協定）」の欄で"); });
        }
    }
    catch (e) {
        warn("v85 rules", e);
    }
    if (typeof v85docFlagsAuto === "function") {
        const __fa92d = v85docFlagsAuto;
        v85docFlagsAuto = function (d, hs) {
            const o = __fa92d.apply(this, arguments);
            try {
                const ch = +String(hs || "").replace(/\D/g, "").slice(0, 2);
                if (o && !o.animal_material && !(ch >= 1 && ch <= 24) && !(ch >= 50 && ch <= 63) && !(ch >= 41 && ch <= 43)) {
                    const rows = (d && d.compRows) || [];
                    const t = [d && d.item, d && d.material, (d && d.compTitle) || "", rows.map((r) => (r || []).join(" ")).join(" ")].filter(Boolean).join(" ");
                    const m = String(t).match(/馬毛|羊毛|山羊毛|豚毛|獣毛|狸毛|鼬毛|いたち毛|イタチ毛|動物の毛|膠|にかわ|ニカワ|毛皮|羽毛|本革|牛革|鹿革|馬革|牛骨|鹿角|水牛の角|貝殻|螺鈿|蝶貝/);
                    if (m)
                        o.animal_material = "素材に動物由来の語（" + m[0] + "）";
                }
            }
            catch (e) { }
            return o;
        };
    }
    const CHIP = {
        self: "自社で作る（上の「① ここで作る」で下書き）",
        app: "発行機関へ申請する（申請用の下書きを作れます）",
        tpl: "自社・メーカーで用意する（ひな形を作れます）",
        fwd: "物流会社が発行する",
        cb: "通関業者が申告する（税関の許可）",
        imp: "輸入者（相手側）が手配する",
        ins: "保険会社が発行する",
        ext: "発行機関に申請・依頼して取得する",
        mk: "メーカー（製造者）から取り寄せる",
        lab: "検査機関に依頼して取得する",
        cond: "条件に当たる時だけ：",
        chk: "要るか確かめる："
    };
    dictAdd([
        [CHIP.self, "Made by you (draft in “① Create here” above)", "自行制作（在上方“① 在此制作”中起草）", "Lo prepara usted (borrador arriba)"],
        [CHIP.app, "Apply to the issuing body (application draft available)", "向签发机构申请（可生成申请草稿）", "Solicitar al organismo emisor (borrador disponible)"],
        [CHIP.tpl, "Prepared by you or the maker (template available)", "由本公司或制造商准备（可生成模板）", "Lo prepara usted o el fabricante (plantilla disponible)"],
        [CHIP.fwd, "Issued by the forwarder / carrier", "由物流公司签发", "Lo emite el transitario"],
        [CHIP.cb, "Filed by the customs broker (customs permit)", "由报关行申报（海关许可）", "Lo presenta el agente de aduanas"],
        [CHIP.imp, "Arranged by the importer (buyer side)", "由进口方办理", "Lo gestiona el importador"],
        [CHIP.ins, "Issued by the insurer", "由保险公司签发", "Lo emite la aseguradora"],
        [CHIP.ext, "Request from the issuing body", "向签发机构申请取得", "Solicitar al organismo emisor"],
        [CHIP.mk, "Obtain from the maker", "向制造商索取", "Solicitar al fabricante"], [CHIP.lab, "Request from a testing / inspection body", "委托检验机构取得", "Solicitar a un laboratorio"],
        [CHIP.cond + CHIP.mk, "Only if the condition applies: obtain from the maker"], [CHIP.cond + CHIP.lab, "Only if the condition applies: request from a testing / inspection body"],
        [CHIP.chk + CHIP.mk, "Check if needed: obtain from the maker"], [CHIP.chk + CHIP.lab, "Check if needed: request from a testing / inspection body"],
        [CHIP.cond + CHIP.self, "Only if the condition applies: made by you"], [CHIP.cond + CHIP.app, "Only if the condition applies: apply to the issuing body (draft available)"],
        [CHIP.cond + CHIP.tpl, "Only if the condition applies: prepared by you or the maker (template available)"], [CHIP.cond + CHIP.fwd, "Only if the condition applies: issued by the forwarder"],
        [CHIP.cond + CHIP.cb, "Only if the condition applies: filed by the customs broker"], [CHIP.cond + CHIP.imp, "Only if the condition applies: arranged by the importer"],
        [CHIP.cond + CHIP.ins, "Only if the condition applies: issued by the insurer"], [CHIP.cond + CHIP.ext, "Only if the condition applies: request from the issuing body"],
        [CHIP.chk + CHIP.self, "Check if needed: made by you"], [CHIP.chk + CHIP.app, "Check if needed: apply to the issuing body (draft available)"],
        [CHIP.chk + CHIP.tpl, "Check if needed: prepared by you or the maker"], [CHIP.chk + CHIP.fwd, "Check if needed: issued by the forwarder"],
        [CHIP.chk + CHIP.cb, "Check if needed: filed by the customs broker"], [CHIP.chk + CHIP.imp, "Check if needed: arranged by the importer"],
        [CHIP.chk + CHIP.ins, "Check if needed: issued by the insurer"], [CHIP.chk + CHIP.ext, "Check if needed: request from the issuing body"]
    ]);
    const docKeyByJa = (ja) => {
        try {
            const T = V85DOC_D.docs;
            return Object.keys(T).find(k => T[k] && T[k][0] === ja) || "";
        }
        catch (e) {
            return "";
        }
    };
    if (typeof v5320Chip === "function") {
        const __chip92 = v5320Chip;
        v5320Chip = function (S, k) {
            const r = __chip92.apply(this, arguments);
            try {
                if (!r)
                    return r;
                const key = docKeyByJa(String(k || ""));
                if (!key || key === "CI" || key === "PL" || key === "SI")
                    return r;
                if (!r[1] && !/^申請・取得が必要$/.test(String(r[0])))
                    return r;
                const x = V85DOC_D.docs[key], is = x[2], mk = x[3];
                let t = mk === "auto" ? CHIP.self : mk === "draft_application" ? CHIP.app : mk === "draft_template" ? CHIP.tpl
                    : is === "forwarder" ? CHIP.fwd : is === "customs_broker" ? CHIP.cb : (is === "importer" || is === "local_rp" || is === "fda_agent") ? CHIP.imp : is === "insurer" ? CHIP.ins : is === "maker" ? CHIP.mk : is === "lab" ? CHIP.lab : CHIP.ext;
                const row = ((S && S.docs) || []).find((d) => d && d[0] === k);
                const desc = String((row && row[2]) || "");
                if (/^条件つき/.test(desc))
                    t = CHIP.cond + t;
                else if (/^確かめること/.test(desc))
                    t = CHIP.chk + t;
                return [t, false];
            }
            catch (e) {
                warn("chip", e);
                return r;
            }
        };
    }
    if (typeof vOps === "function") {
        const __vo92 = vOps;
        vOps = function () {
            try {
                if (getS() && typeof v85docSyncShip === "function")
                    v85docSyncShip();
            }
            catch (e) { }
            return __vo92.apply(this, arguments);
        };
    }
    if (typeof v85docDue === "function") {
        const __due92 = v85docDue;
        v85docDue = function (ld) {
            const r = __due92.apply(this, arguments);
            try {
                const S = typeof v85docShip === "function" ? v85docShip() : getS();
                if (r && r.late && S && typeof v54docIsSmp === "function" && v54docIsSmp(S))
                    return { t: String(r.t) + M("・見本の出港日での計算。実際の出港日を入れると計算し直します", " (calculated from the sample sailing date)", "・按样本出港日计算", " (según la fecha de salida de muestra)"), late: 0 };
            }
            catch (e) { }
            return r;
        };
    }
    try {
        if (typeof PRODUCTS !== "undefined" && PRODUCTS) {
            Object.keys(PRODUCTS).forEach(key => {
                const p = PRODUCTS[key], S = p && p.ship;
                if (!S || !S.docRows || !Array.isArray(S.docRows.plRows) || S.docRows.plRows.length !== 1)
                    return;
                const row = S.docRows.plRows[0];
                const cm = String(row[2] || "").match(/^(\d[\d,]*)\s*CTN$/i), gm = String(row[3] || "").match(/G\.W\.\s*([\d,.]+)\s*kg/i);
                if (!cm || !gm)
                    return;
                const cols = (p.dimCols || []).map((c) => String(c));
                const wi = cols.findIndex((c) => /外装重量|カートン重量|外箱重量/.test(c));
                const di = cols.findIndex((c) => /外装.*W|外装サイズ|外装寸法/.test(c));
                if (wi < 0)
                    return;
                const dimTxt = String((((S.docRows.plEx || []).find((x) => x && x[0] === "Carton size") || [])[1]) || "").replace(/\s*mm\s*$/i, "").replace(/\s+/g, "");
                const rows = (p.dimRows || []).filter(Array.isArray);
                const hit = rows.filter((r) => di >= 0 && dimTxt && String(r[di] || "").replace(/\s+/g, "") === dimTxt);
                const use = (hit.length >= 1 && hit.every((r) => String(r[wi]) === String(hit[0][wi]))) ? hit[0] : (rows.length === 1 ? rows[0] : null);
                if (!use)
                    return;
                const km = noComma(use[wi]).match(/(\d+(?:\.\d+)?)\s*kg/i);
                if (!km)
                    return;
                const n = parseInt(cm[1].replace(/,/g, ""), 10), old = parseFloat(gm[1].replace(/,/g, ""));
                const calc = Math.round(n * +km[1] * 100) / 100;
                if (!(calc > 0) || Math.abs(calc - old) / calc < 0.02)
                    return;
                const oldTxt = gm[1], neu = String(calc);
                const swap = (o, depth) => {
                    if (!o || depth > 5)
                        return;
                    Object.keys(o).forEach(k2 => {
                        const v = o[k2];
                        if (typeof v === "string") {
                            if (v.indexOf(oldTxt) >= 0 && /総重量|G\.W\./.test(v))
                                o[k2] = v.split(oldTxt + "kg").join(neu + "kg").split(oldTxt + " kg").join(neu + " kg");
                        }
                        else if (v && typeof v === "object")
                            swap(v, depth + 1);
                    });
                };
                swap(S, 0);
            });
        }
    }
    catch (e) {
        warn("sample gw", e);
    }
})();
