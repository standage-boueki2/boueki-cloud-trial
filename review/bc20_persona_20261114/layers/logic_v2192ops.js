(function () {
    const W = window;
    if (W.__v2192ops)
        return;
    W.__v2192ops = 1;
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
    const say = (m) => {
        try {
            if (typeof toast === "function")
                toast(m);
        }
        catch (e) { }
    };
    const warn = (k, e) => {
        try {
            (W.__v92opsErr = W.__v92opsErr || []).push(k + ":" + String((e && e.message) || e).slice(0, 160));
            console.warn("v2192ops " + k, e);
        }
        catch (x) { }
    };
    const flag = (o, k, v) => {
        try {
            Object.defineProperty(o, k, { value: v === undefined ? 1 : v, enumerable: false, configurable: true, writable: true });
        }
        catch (e) {
            try {
                o[k] = v === undefined ? 1 : v;
            }
            catch (x) { }
        }
    };
    const dict = (rows) => {
        try {
            if (typeof I18N === "undefined" || !I18N || !I18N.dict)
                return;
            rows.forEach(r => {
                if (r[1] && I18N.dict.en && !I18N.dict.en[r[0]])
                    I18N.dict.en[r[0]] = r[1];
                if (r[2] && I18N.dict.zh && !I18N.dict.zh[r[0]])
                    I18N.dict.zh[r[0]] = r[2];
                if (r[3] && I18N.dict.es && !I18N.dict.es[r[0]])
                    I18N.dict.es[r[0]] = r[3];
            });
        }
        catch (e) { }
    };
    const isStaff = () => {
        try {
            return typeof SES !== "undefined" && !!SES && (SES.t === "admin" || SES.role === "stg");
        }
        catch (e) {
            return false;
        }
    };
    const ten = () => {
        try {
            return (typeof TEN !== "undefined" && TEN) ? TEN : null;
        }
        catch (e) {
            return null;
        }
    };
    const dd = () => {
        try {
            return (typeof D !== "undefined" && D) ? D : null;
        }
        catch (e) {
            return null;
        }
    };
    const own = () => { const t = ten(); return !!t && (t.src === "upload" || t.src === "sample2"); };
    const P = () => {
        try {
            if (typeof v68regP === "function") {
                const p = v68regP();
                if (p)
                    return p;
            }
        }
        catch (e) { }
        return ten() || dd();
    };
    const persist = () => {
        try {
            if (own()) {
                if (typeof saveTen === "function")
                    saveTen();
                if (typeof syncTenant === "function")
                    syncTenant();
            }
        }
        catch (e) { }
    };
    function css() {
        if (document.getElementById("v92ocss"))
            return;
        const st = document.createElement("style");
        st.id = "v92ocss";
        st.textContent = ".v92o-sanc{margin:0 0 10px;padding:12px 14px;border:1.5px solid var(--crit,#c0392b);border-radius:10px;background:var(--crit-soft,#fdecea);color:var(--ink,#1b2a3a);font-size:12.5px;line-height:1.8}" +
            ".v92o-sanc b{display:block;font-size:13px;margin-bottom:2px}.v92o-sanc a{color:inherit;text-decoration:underline;font-weight:700}" +
            ".v92o-none{margin:2px 0 4px;padding:8px 10px;border:1px dashed var(--line,#d5dbe3);border-radius:8px;background:var(--surface-2,#f7f9fb);font-size:12px;line-height:1.7;color:var(--ink-2,#44546a)}" +
            ".v92o-none b{color:var(--ink,#1b2a3a)}" +
            ".v92o-chn{font-weight:500;color:var(--ink-3,#6b7a90);margin-left:4px}" +
            ".v92o-lead{margin:2px 0 4px;font-size:11.5px;line-height:1.7;color:var(--ink-2,#44546a)}" +
            ".v54r-row.v92o-cond .v54r-mk{width:1.4em;text-align:center;font-weight:800;color:var(--warn,#b45309)}" +
            ".v54r-row.v92o-cond.no{opacity:.72}.v54r-row.v92o-cond.no .v54r-mk{color:var(--ink-3,#6b7a90)}" +
            ".v92o-tag{font-size:10px;font-weight:700;border-radius:999px;padding:1px 7px;margin-left:6px;background:var(--warn-soft,#fff4e5);color:var(--warn,#b45309);white-space:nowrap}" +
            ".v92o-cond.no .v92o-tag{background:var(--surface-2,#eef1f5);color:var(--ink-3,#6b7a90)}" +
            ".v92o-why{margin:3px 0 0;font-size:11.5px;line-height:1.65;color:var(--ink-2,#44546a)}.v92o-why b{color:var(--ink,#1b2a3a)}" +
            ".v92o-btns{display:flex;flex-direction:column;gap:5px;flex:none}.v92o-btns .btn{white-space:nowrap}" +
            ".v92o-lk{border:0;background:none;padding:0;margin-left:6px;color:var(--bl,#1d5fd0);font:inherit;font-weight:700;cursor:pointer;text-decoration:underline}" +
            ".v92o-pts{margin-top:10px;padding:11px 13px;border:1px solid var(--line,#d5dbe3);border-left:4px solid var(--bl,#1d5fd0);border-radius:10px;background:var(--surface,#fff);font-size:12px;line-height:1.7}" +
            ".v92o-pts>b{display:block;font-size:13px}.v92o-pts .v92o-sub{margin:2px 0 6px;color:var(--ink-2,#44546a);font-size:11.5px}" +
            ".v92o-h3{margin:10px 0 3px;font-size:12px;font-weight:800;color:var(--ink,#1b2a3a)}.v92o-h3 small{font-weight:500;color:var(--ink-3,#6b7a90);margin-left:4px}" +
            ".v92o-ul{list-style:none;margin:0;padding:0}.v92o-ul>li{padding:6px 0;border-bottom:1px dashed var(--line-2,#e6e9ee)}.v92o-ul>li:last-child{border-bottom:0}" +
            ".v92o-ul>li>b{font-size:12px}.v92o-tc{display:block;color:var(--ink-2,#44546a)}" +
            ".v92o-lv{display:inline-block;font-size:10px;font-weight:700;border-radius:999px;padding:1px 7px;margin-right:6px;white-space:nowrap}" +
            ".v92o-lv.required{background:var(--crit-soft,#fdecea);color:var(--crit,#c0392b)}.v92o-lv.conditional{background:var(--warn-soft,#fff4e5);color:var(--warn,#b45309)}" +
            ".v92o-lv.check{background:var(--bl-soft,#e8f0fe);color:var(--bl,#1d5fd0)}.v92o-lv.ban{background:var(--crit,#c0392b);color:#fff}.v92o-lv.cf{background:var(--surface-2,#eef1f5);color:var(--ink-2,#44546a)}" +
            ".v92o-ul details{margin-top:2px}.v92o-ul summary{cursor:pointer;color:var(--bl,#1d5fd0);font-weight:700;font-size:11.5px}" +
            ".v92o-dt{margin:3px 0 0;color:var(--ink-2,#44546a);font-size:11.5px}.v92o-dt a{color:var(--bl,#1d5fd0)}" +
            ".v92o-ft{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:9px}" +
            ".v92o-dn{margin:3px 0 0;font-size:10.5px;line-height:1.5;color:var(--warn,#b45309);font-weight:600}" +
            ".v92o-mis{margin:0 0 10px;padding:10px 12px;border:1.5px solid var(--warn,#b45309);border-radius:10px;background:var(--warn-soft,#fff4e5);font-size:12px;line-height:1.75}" +
            ".v92o-tax{margin-top:8px;padding:9px 11px;border:1px solid var(--line,#d5dbe3);border-radius:8px;font-size:12px}" +
            "@media(max-width:640px){.v54r-row.v92o-cond{flex-wrap:wrap}.v92o-btns{flex-direction:row;width:100%}}";
        (document.head || document.documentElement).appendChild(st);
    }
    const digits = (s) => String(s == null ? "" : s).replace(/[^\d]/g, "");
    const textOf = (p) => {
        try {
            const rows = (a) => (Array.isArray(a) ? a : []).map((r) => Array.isArray(r) ? r.filter((x) => x != null).join(" ") : String(r == null ? "" : r)).join(" ");
            return [p && p.item, p && p.itemEn, p && p.cert, p && p.tagline, rows(p && p.compRows), rows(p && p.strengths)].filter(Boolean).join(" ");
        }
        catch (e) {
            return "";
        }
    };
    const RE_MACHINE = /建設機械|建機|重機|油圧ショベル|ショベルカー|パワーショベル|ユンボ|ブルドーザー?|ホイールローダー?|フォークリフト|クレーン|ロードローラー|excavator|bulldozer|wheel\s*loader|forklift|crane/i;
    const RE_TEA = /抹茶|緑茶|煎茶|ほうじ茶|玄米茶|紅茶|日本茶|茶葉|matcha|green\s*tea/i;
    const RE_HONEY = /はちみつ|蜂蜜|ハチミツ|ハニー|honey/i;
    const RE_TEXTILE = /タオル|ハンカチ|手ぬぐい|てぬぐい|ふきん|風呂敷|寝具|シーツ|毛布|布団|ブランケット|クッションカバー|カーテン|towel|blanket|bed\s*linen|handkerchief/i;
    function kind(p) {
        const o = { k: "other", ck: "", cat: "", hs: "", nm: "" };
        if (!p)
            return o;
        try {
            const cat = String(p.cat || "").trim();
            let ck = String(p.catKey || "");
            if (!ck || ck === "custom") {
                try {
                    ck = typeof catKeyOf === "function" ? catKeyOf(cat) : "";
                }
                catch (e) {
                    ck = "";
                }
            }
            const hs = digits(p.hs), nm = String((p.item || "") + " " + (p.itemEn || ""));
            const h2 = hs.length >= 2 ? +hs.slice(0, 2) : 0, h4 = hs.length >= 4 ? +hs.slice(0, 4) : 0;
            o.ck = ck;
            o.cat = cat;
            o.hs = hs;
            o.nm = nm;
            const isFoodCk = ck === "food" || ck === "supp";
            if (cat === "建設機械" || ck === "machine" || ((ck === "car" || cat === "中古車") && ((h4 >= 8426 && h4 <= 8430) || (h4 !== 8703 && RE_MACHINE.test(nm)))))
                o.k = "machine";
            else if (cat === "健康食品" || ck === "supp" || (isFoodCk && h4 === 2106 && /サプリ|錠|粒|カプセル|健康食品|栄養補助|supplement|tablet|capsule/i.test(nm)))
                o.k = "supp";
            else if (cat === "農業資材" || ck === "agri")
                o.k = "agri";
            else if (cat === "文化・教育用品" || ck === "culture")
                o.k = "culture";
            else if (cat === "ペット用品" || ck === "pet")
                o.k = "pet";
            else
                o.k = ck || "other";
            o.food = o.k === "food" || o.k === "supp" || ck === "food";
            o.tea = /^0902/.test(hs) || (hs.length < 4 && RE_TEA.test(nm));
            o.honey = o.food && o.k !== "supp" && (/^0409/.test(hs) || (hs.length < 4 && RE_HONEY.test(nm)));
            o.meat = o.food && (/^(02|0504|1601|1602)/.test(hs) || (hs.length < 4 && /(?:牛|豚|鶏|羊)肉|和牛|ハム|ソーセージ|ベーコン|beef|pork|chicken/i.test(nm)));
            o.animal = o.food && o.k !== "supp" && (o.honey || o.meat || (h2 >= 2 && h2 <= 5) || h2 === 16);
            o.textile = (h2 >= 50 && h2 <= 63) || (hs.length < 4 && ck === "daily" && RE_TEXTILE.test(nm));
            try {
                o.fc = typeof v68regFC === "function" ? !!v68regFC(p) : false;
            }
            catch (e) {
                o.fc = false;
            }
            try {
                o.ind = typeof v68regInd === "function" ? v68regInd(p) : "";
            }
            catch (e) {
                o.ind = "";
            }
            o.meddev = o.ind === "meddev";
            o.carMis = (ck === "car" || cat === "中古車") && o.k === "machine";
            o.used = /中古|ユーズド|used\b|pre-?owned/i.test(nm) || /中古/.test(cat);
        }
        catch (e) {
            warn("kind", e);
        }
        return o;
    }
    W.v92opsKind = (p) => kind(p || P());
    const NM_CFS = "医療機器の輸出証明（自由販売証明・CFS）";
    const NM_AGENT = "米国代理人（US Agent）の指名";
    const NM_FC = /^FDA食品接触材規制の確認/;
    function condWhy(nm, c, K) {
        const s = String(nm || "");
        if (NM_FC.test(s))
            return K.fc ? "" : M("飲食に使う物（食器・容器・調理の道具など）のときだけ要ります。", "Needed only for items used with food or drink (tableware, containers, cookware).");
        if (/^ハラル認証$/.test(s))
            return K.meat ? "" : M("肉・肉の加工品では必須です。そのほかの商品は、ハラルの表示をするときや、輸入者・売り先が求めるときに要ります。", "Mandatory for meat and meat products. For other goods it is needed when you use a halal claim or when the importer or retailer asks for it.");
        if (/^HSA 医療機器の製品登録（クラスB〜D）/.test(s))
            return M("シンガポールでのクラスが B〜D のときに要ります（クラス A は製品登録が免除され、届出が要ります）。", "Needed when the device is Class B–D in Singapore (Class A is exempt from product registration but must be notified).");
        if (/^保健省（MOH）クラスA届出/.test(s))
            return M("ベトナムでのクラスによって、手続き（届出か登録か）が変わります。クラスを確かめてから入れてください。", "The procedure in Vietnam (declaration or registration) depends on the device class. Confirm the class first.");
        if (/^FDA 510\(k\) 市販前届出/.test(s))
            return M("米国でのクラスと免除の有無で決まります（クラス II の多くは必要ですが、免除の品目もあります）。", "Depends on the US device class and exemptions (most Class II devices need it, but some are exempt).");
        if (s === NM_CFS)
            return M("相手国の登録・輸入の手続きで求められたときに要ります。", "Needed when the destination's registration or import procedure asks for it.");
        if (/（該当品目?）$/.test(s))
            return M("対象の品目にあたるときだけ要ります。", "Needed only when the product falls under the regulated items.");
        return "";
    }
    function condStore(t) {
        t = t || ten();
        if (t) {
            if (!t.regCond || typeof t.regCond !== "object")
                t.regCond = {};
            return t.regCond;
        }
        return (W.__v92cond = W.__v92cond || {});
    }
    function condGet(c, nm, t) { const S = condStore(t); return (S[c] && S[c][nm]) || ""; }
    function condSet(c, nm, v) {
        const S = condStore();
        S[c] = S[c] || {};
        if (v === "y" || v === "n")
            S[c][nm] = v;
        else
            delete S[c][nm];
        persist();
        try {
            if (typeof logU === "function")
                logU("reg", "条件つきの手続き:" + c + "・" + nm + "＝" + (v === "y" ? "該当する" : v === "n" ? "対象外" : "未確認"));
        }
        catch (e) { }
        try {
            if (typeof rReg === "function" && document.getElementById("rO"))
                rReg();
        }
        catch (e) { }
    }
    if (typeof v54rStatusFor === "function") {
        const __sf92 = v54rStatusFor;
        v54rStatusFor = function (c, r, cat, rows, t) {
            const st = __sf92.apply(this, arguments);
            try {
                if (st && Array.isArray(st.req)) {
                    const K = kind(t || P());
                    const cond = [];
                    const req = st.req.filter((d) => {
                        const why = condWhy(d, c, K);
                        if (!why)
                            return true;
                        const v = condGet(c, d, t);
                        cond.push({ nm: d, why, v });
                        return v === "y";
                    });
                    if (cond.length) {
                        st.req = req;
                        st.unmet = (st.unmet || []).filter((d) => req.indexOf(d) >= 0);
                        st.done = (st.done || []).filter((d) => req.indexOf(d) >= 0);
                    }
                    (st.docs || []).forEach((d) => {
                        const why = String(d) === NM_CFS ? condWhy(d, c, K) : "";
                        if (why)
                            cond.push({ nm: d, why, v: condGet(c, d, t), doc: 1 });
                    });
                    if (cond.some(x => x.doc && x.v !== "y"))
                        st.docs = st.docs.filter((d) => String(d) !== NM_CFS);
                    st.cond = cond;
                }
            }
            catch (e) {
                warn("status", e);
            }
            return st;
        };
    }
    const KNM = { pre: ["販売前の登録・届出", "Pre-market registration"], label: ["表示（ラベル）", "Labelling"], importer: ["輸入者の手続き", "Importer's procedure"], ship: ["出荷ごとの手続き", "Per-shipment procedure"], doc: ["証明書", "Certificate"] };
    function condHtml(c, st) {
        const L = (st.cond || []).filter((x) => x.v !== "y" || x.doc);
        if (!L.length)
            return "";
        const K = kind(P());
        const lead = K.meddev ? `<p class="v92o-lead">${E(M("医療機器は、先に「相手国でのクラス（リスクの区分）」を確かめてください。クラスは国ごとに決まり、日本のクラスと同じとは限りません。確かめ先：輸入者・現地の登録の代理人・相手国の当局の分類の手引き。クラスが分かったら、下で「該当する／対象外」を選びます。", "For medical devices, first confirm the device class in the destination country. Classes are set by each country and may differ from the Japanese class. Ask the importer, the local registration agent, or the authority's classification guidance. Then choose “Applies / Not applicable” below."))}</p>` : "";
        const rows = L.map((x) => {
            let kd = "doc";
            try {
                kd = typeof v54rKind === "function" ? v54rKind(x.nm) : "pre";
            }
            catch (e) { }
            let desc = "";
            try {
                desc = typeof v54rDesc === "function" ? String(v54rDesc(x.nm, c) || "") : "";
            }
            catch (e) { }
            const no = x.v === "n", yes = x.v === "y";
            const args = (v) => E(JSON.stringify([c, x.nm, v]));
            return `<div class="v54r-row v92o-cond ${no ? "no" : yes ? "yes" : "unk"}" data-v92cond="${E(x.nm)}"><span class="v54r-mk" aria-hidden="true">${no ? "－" : yes ? "✓" : "？"}</span>
      <div class="v54r-body"><b>${E(x.nm)}</b> <span class="v54r-kd" data-noi18n>${E(M(KNM[kd] ? KNM[kd][0] : "", KNM[kd] ? KNM[kd][1] : ""))}</span> <span class="v92o-tag" data-noi18n>${E(no ? M("対象外にしました", "Marked not applicable") : yes ? M("書類に入れています", "Added to the documents") : M("該当するか未確認", "Not yet confirmed"))}</span>
        <p class="v92o-why" data-noi18n><b>${E(M("条件", "Condition"))}</b>：${E(x.why)}</p>${desc ? `<p class="v92o-why">${E(desc)}</p>` : ""}</div>
      <span class="v92o-btns" data-noi18n>${(no || yes) ? `<button class="btn g" type="button" data-act="v92ops.cond" data-args="${args("")}">${E(M("未確認に戻す", "Back to unconfirmed"))}</button>`
                : `<button class="btn g" type="button" data-act="v92ops.cond" data-args="${args("y")}">${E(x.doc ? M("求められた（書類に入れる）", "Requested (add to documents)") : M("該当する（必須に入れる）", "Applies (make it required)"))}</button><button class="btn g" type="button" data-act="v92ops.cond" data-args="${args("n")}">${E(M("対象外にする", "Not applicable"))}</button>`}</span></div>`;
        }).join("");
        return `<p class="v54r-h v92o-ch" data-noi18n>${E(M("該当するときだけ必要な手続き", "Procedures needed only when they apply"))}<span class="v92o-chn">${E(M("（必須の件数には入れていません）", "(not counted as required)"))}</span></p>${lead}${rows}`;
    }
    if (typeof v54rDocsHtml === "function") {
        const __dh92 = v54rDocsHtml;
        v54rDocsHtml = function (c, st) {
            let h = String(__dh92.apply(this, arguments));
            try {
                const blk = condHtml(c, st);
                if (blk) {
                    const k = h.lastIndexOf('<p class="v54r-h">');
                    h = k > 0 ? h.slice(0, k) + blk + h.slice(k) : h + blk;
                }
            }
            catch (e) {
                warn("docsHtml", e);
            }
            return h;
        };
    }
    try {
        if (W.BCACT && BCACT.on)
            BCACT.on("v92ops.cond", (el) => {
                try {
                    const a = JSON.parse(String(el.getAttribute("data-args") || "[]"));
                    if (a.length === 3)
                        condSet(a[0], a[1], a[2]);
                }
                catch (e) {
                    warn("cond", e);
                }
            }, { replace: true });
    }
    catch (e) { }
    try {
        if (typeof V54R_KIND !== "undefined" && Array.isArray(V54R_KIND))
            V54R_KIND.unshift([/^医療機器の輸出証明（自由販売証明/, "doc"], [/^米国代理人（US Agent）/, "pre"]);
    }
    catch (e) { }
    const W_HALAL = "ハラル認証は、肉・肉の加工品では必須です。そのほかの食品は、ハラルの表示をするときや、輸入者・売り先が求めるときに要ります（品目と売り先によるため要確認）。";
    const W_BPOM = "BPOM登録が必要です。" + W_HALAL;
    const W_ANIMAL = "動物性の食品は、相手国が日本からの輸入を認めている品目か・衛生証明書が要るかを、先に確かめてください（「規制を調べる」の「確かめる点」・要確認）。";
    dict([[W_HALAL, "Halal certification is mandatory for meat and meat products. For other foods it is needed when you use a halal claim or when the importer or retailer asks for it (depends on the product and the buyer; please confirm)."],
        [W_BPOM, "BPOM registration is required. Halal certification is mandatory for meat and meat products. For other foods it is needed when you use a halal claim or when the importer or retailer asks for it (depends on the product and the buyer; please confirm)."],
        [W_ANIMAL, "For foods of animal origin, first confirm whether the destination accepts this product from Japan and whether a health certificate is required (see “Points to check” under “Check regulations”; please confirm)."],
        [NM_CFS, "Export certificate for medical devices (Certificate of Free Sale, CFS)"], [NM_AGENT, "Designation of a US Agent"]]);
    function adj(c, r, p) {
        if (!r || typeof r !== "object" || r.__v92o)
            return r;
        flag(r, "__v92o");
        try {
            p = p || P();
            if (!p)
                return r;
            const K = kind(p);
            const docs0 = Array.isArray(r.docs) ? r.docs.slice() : [];
            let docs = docs0.slice();
            const notes = [];
            if (K.ck === "daily" && !K.fc && K.textile) {
                const n0 = docs.length;
                docs = docs.filter((d) => !NM_FC.test(String(d)));
                if (docs.length !== n0)
                    notes.push("nofc");
                if (/飲食に使う器物はFDA/.test(String(r.warn || "")))
                    r.warn = "";
            }
            if (K.food) {
                if (!K.tea && /茶葉/.test(String(r.warn || ""))) {
                    r.warn = "";
                    notes.push("notea");
                }
                if (!K.meat && /ハラル認証が必須です/.test(String(r.warn || ""))) {
                    r.warn = W_HALAL;
                    notes.push("halal");
                }
                else if (!K.meat && /BPOM登録とハラル認証が必要です/.test(String(r.warn || ""))) {
                    r.warn = W_BPOM;
                    notes.push("halal");
                }
                if (K.animal) {
                    const n0 = docs.length;
                    docs = docs.filter((d) => String(d) !== "残留農薬証明");
                    if (docs.length !== n0)
                        notes.push("nomrl");
                    if (/残留農薬/.test(String(r.warn || "")))
                        r.warn = "";
                    if (!r.warn)
                        r.warn = W_ANIMAL;
                }
            }
            if (K.meddev && docs.indexOf(NM_CFS) < 0 && docs.some((d) => /ISO13485|医療機器|MOH|MOHAP|Kemenkes|510\(k\)/.test(String(d))))
                docs.push(NM_CFS);
            if (K.meddev && docs.indexOf(NM_AGENT) < 0) {
                const i = docs.findIndex((d) => /^FDA 施設登録・機器リスティング/.test(String(d)));
                if (i >= 0)
                    docs.splice(i + 1, 0, NM_AGENT);
            }
            if (docs.length !== docs0.length || docs.some((d, i) => d !== docs0[i]))
                r.docs = docs;
            flag(r, "_v92o", { k: K.k, notes });
        }
        catch (e) {
            warn("adj", e);
        }
        return r;
    }
    const tplAlias = (cat) => {
        try {
            if (String(cat) === "supp" && !(typeof RD2 !== "undefined" && RD2 && RD2.supp))
                return "food";
        }
        catch (e) { }
        return cat;
    };
    if (typeof regsFor === "function") {
        const __rf92 = regsFor;
        regsFor = function (cat, targets) {
            const out = __rf92.call(this, tplAlias(cat), targets);
            try {
                const p = P();
                Object.keys(out || {}).forEach(c => adj(c, out[c], p));
            }
            catch (e) {
                warn("regsFor", e);
            }
            return out;
        };
    }
    if (typeof v5322TplList === "function") {
        const __tl92 = v5322TplList;
        v5322TplList = function (cat) { return __tl92.call(this, tplAlias(cat)); };
    }
    function adjAll() {
        try {
            const d = dd();
            if (!d || !d.regs)
                return;
            const p = P();
            Object.keys(d.regs).forEach(c => adj(c, d.regs[c], p));
        }
        catch (e) { }
    }
    if (typeof v54rDesc === "function") {
        const __ds92 = v54rDesc;
        v54rDesc = function (nm, c) {
            let s = __ds92.apply(this, arguments);
            try {
                const n = String(nm || "");
                if (n === NM_CFS)
                    return M("相手国での登録・輸入の手続きで、日本で適法に製造・販売されていることの証明（自由販売証明・CFS）を求められることがあります。日本では、厚生労働省が医療機器の輸出用の証明書を発給します（申請の窓口と日数は要確認）。", "A destination's registration or import procedure may ask for proof that the device is lawfully made and sold in Japan (Certificate of Free Sale). In Japan, the Ministry of Health, Labour and Welfare issues export certificates for medical devices (please confirm the application route and lead time).");
                if (n === NM_AGENT)
                    return M("米国の外にある製造所は、FDA への施設登録のときに、米国内の代理人（US Agent）を指名します（21 CFR 807.40）。FDA からの連絡の窓口になります。代理人を替えたときは、届け出が要ります。", "An establishment outside the US must designate a US Agent located in the United States when registering with the FDA (21 CFR 807.40). The agent is the FDA's point of contact. A change of agent must be reported.");
                if (/^栄養成分表示$/.test(n) && kind(P()).k === "supp")
                    return M("サプリメント（ダイエタリーサプリメント）は、米国では「Supplement Facts」の形式で表示します（一般の食品の Nutrition Facts とは別の形式です）。日本の表示のままでは使えません（要確認）。", "In the US, dietary supplements carry a “Supplement Facts” panel (a different format from the Nutrition Facts panel for conventional foods). The Japanese label cannot be used as is (please confirm).");
            }
            catch (e) { }
            return s;
        };
    }
    const GENERIC = new Set(["CI", "PL", "SI", "SHIP_MARK", "BL", "AWB", "EXP_DEC", "INS", "ISF_DATA", "CO_GEN", "CO_EPA_3P", "CO_EPA_AE", "CO_EPA_SELF", "ORIGIN_EVID", "BENE_CERT", "DRAFT", "SIGN_CERT", "INV_LEGAL", "E_ATTEST", "FUMI", "EXP_LICENSE", "INSP_CERT", "SPEC_EN"]);
    const DUP = { FDA_FFR: /FDA食品施設登録/, FDA_PN: /事前通知|Prior Notice/i, SG_SFA: /SFA/, TH_FDA: /タイFDA/, CIFER: /GACC/, HALAL: /ハラル/, RAD_TEST: /放射性物質/, FDA_MOCRA: /MoCRA|製品リスティング/, EU_RP: /EU域内責任者/, EU_CPSR: /CPSR/, EU_CPNP: /CPNP/,
        UK_SCPN: /SCPN/, NMPA: /NMPA/, ID_BPOM: /BPOM/, FDA_DEVICE: /FDA 施設登録|510\(k\)/, AU_BICON: /BICON/, TW_TFDA: /TFDA|査験/, COA: /成分分析表|全成分表|成分表（INCI）/, GAIHI: /該非判定書/, IN_IMPORT: /FSSAI|CDSCO|BIS/, FSC_MD: /自由販売証明/, KR_MFDS: /食品等の輸入申告/,
        FCM_DOC: /食品接触|食品器具|GB 4806|溶出試験|器具・容器包装/, SAKE_CERT: /製造地証明/, ORIGIN_PREF: /産地証明書/, LABEL: /ラベル|表示|表記/, AE_REG: /ESMA/, CONFORMITY: /UKCA|CE|RoHS/ };
    const RE_MEDHS = /^(9018|9019|9020|9021|9022|902511|3005|3006|9402)/;
    const RE_FCWORD = /食品に触れ|食品接触|食器|弁当|ランチ|タンブラー|水筒|マグ|コップ|カップ|グラス|茶碗|椀|皿|箸|カトラリー|スプーン|フォーク|まな板|調理|フライパン|鍋|保存容器|食品容器|哺乳瓶|紙皿|紙コップ|food|tableware|kitchen|lunch|bento|tumbler|cup|plate/i;
    function notFoodContact(hs, txt) { return /^4823/.test(hs) && !/^48236/.test(hs) && !RE_FCWORD.test(txt); }
    if (typeof v85docFlagsAuto === "function") {
        const __fa92 = v85docFlagsAuto;
        v85docFlagsAuto = function (d, hs) {
            const o = __fa92.apply(this, arguments);
            try {
                if (o && o.food_contact && notFoodContact(digits(hs), textOf(d)))
                    delete o.food_contact;
            }
            catch (e) { }
            return o;
        };
    }
    if (typeof v85docRuleHit === "function") {
        const __rh92 = v85docRuleHit;
        v85docRuleHit = function (r, F) {
            try {
                const h = (r && r.w && r.w.h) || [];
                if (F && F.hs && /^4823/.test(String(F.hs)) && h.indexOf("4823") >= 0 && h.indexOf("6911") >= 0 && notFoodContact(String(F.hs), String(F.item || "") + " " + String(F.itemEn || "") + " " + textOf(dd()))) {
                    if (!h.some((x) => x !== "4823" && String(F.hs).indexOf(String(x)) === 0))
                        return null;
                }
            }
            catch (e) { }
            return __rh92.apply(this, arguments);
        };
    }
    const LVN = { required: ["必須", "Required"], conditional: ["条件つき", "Conditional"], check: ["確かめること", "To check"], ban: ["輸入の停止・禁止の情報", "Import stop / ban"] };
    const LVO = { ban: 4, required: 3, conditional: 2, check: 1 };
    function tableHits(c, r, K) {
        const out = { rows: [], ban: [], cc: "", prov: false, need: "" };
        try {
            if (typeof V85DOC_D === "undefined" || !V85DOC_D || !Array.isArray(V85DOC_D.rules) || typeof v85docRuleHit !== "function" || typeof v85docCC !== "function")
                return out;
            const cc = v85docCC(c);
            out.cc = cc;
            if (!cc)
                return out;
            const d = dd() || {}, t = ten();
            const hs0 = (typeof v85docHsDigits === "function") ? v85docHsDigits(d.hs || (t && t.hs) || "") : digits(d.hs || (t && t.hs) || "").slice(0, 10);
            if (!hs0) {
                out.need = "hs";
                return out;
            }
            let fa = {};
            try {
                fa = (typeof v85docFlagsAuto === "function") ? (v85docFlagsAuto(d, hs0) || {}) : {};
            }
            catch (e) {
                fa = {};
            }
            const flags = {};
            Object.keys(fa).forEach(k => { flags[k] = true; });
            let pref = "";
            try {
                if (typeof v85docPref === "function") {
                    pref = v85docPref(d.origin || (t && t.origin) || "") || v85docPref(d.city || (t && t.city) || "") || v85docPref((t && t.corp && t.corp.addr) || "");
                    if (!pref) {
                        const m = textOf(t || d).match(/(北海道|[^\s（()）、。・「」]{2,3}[都府県])産/);
                        if (m)
                            pref = v85docPref(m[1]);
                    }
                }
            }
            catch (e) { }
            const tplDocs = (r && Array.isArray(r.docs)) ? r.docs.map((x) => String(x)) : [];
            const tplHasReg = tplDocs.some((x) => /登録|届出|備案|公示|ライセンス|許可/.test(x));
            const rows = {};
            const run = (hs, prov) => {
                const F = { hs, hsProv: null, item: d.item || "", itemEn: d.itemEn || "", dest: cc, mode: "sea", inc: "", lc: false, pref, flags, epa: false };
                V85DOC_D.rules.forEach((R) => {
                    try {
                        const keys = (R.k || []).filter((k) => !GENERIC.has(k));
                        if (!keys.length)
                            return;
                        const w = R.w || {};
                        const hsAll = (w.h || []).indexOf("*") >= 0, dAll = (w.d || []).indexOf("*") >= 0;
                        if (hsAll && dAll && !w.f)
                            return;
                        if (prov && !(w.h || []).some((x) => RE_MEDHS.test(String(x))))
                            return;
                        const h = v85docRuleHit(R, F);
                        if (!h)
                            return;
                        const pend = h.pend || [];
                        if (pend.indexOf("hs") >= 0 || pend.indexOf("dest") >= 0)
                            return;
                        const needPref = pend.indexOf("pref") >= 0, prefN = pend.indexOf("prefn") >= 0;
                        let note = "";
                        try {
                            note = typeof v85docNoteFor === "function" ? v85docNoteFor(R.n, cc) : String(R.n || "");
                        }
                        catch (e) {
                            note = "";
                        }
                        const src = { s: String(R.s || ""), u: String(R.u || ""), ok: String(R.ok || "") };
                        keys.forEach((k) => {
                            if (k === "IMPORT_BAN") {
                                if (!out.ban.some((b) => b.id === R.id))
                                    out.ban.push({ id: R.id, c: String(R.c || ""), note, src, needPref: needPref || prefN, pref: (!needPref && !prefN && w.op && pref) ? pref : "" });
                                return;
                            }
                            if (needPref)
                                return;
                            if (DUP[k] && tplDocs.some((x) => DUP[k].test(x)))
                                return;
                            if (k === "DEST_REG" && tplHasReg)
                                return;
                            const di = (V85DOC_D.docs || {})[k] || [k, "", "", "", 0];
                            const row = rows[k] || (rows[k] = { k, ja: di[0], en: di[1], is: R.is || (typeof v85docIssuer === "function" ? v85docIssuer(di[2]) : ""), ld: 0, lv: "check", why: [], notes: [], src: [], prov });
                            const lv = prefN ? "check" : R.lv;
                            if (LVO[lv] > LVO[row.lv])
                                row.lv = lv;
                            row.ld = Math.max(row.ld || 0, +R.ld || 0, +di[4] || 0);
                            const cTxt = String(R.c || "") + (prefN ? M("（産地の都道府県を登録すると判定できます）", " (register the prefecture of origin to judge this)") : "");
                            if (cTxt && row.why.indexOf(cTxt) < 0)
                                row.why.push(cTxt);
                            if (note && row.notes.indexOf(note) < 0)
                                row.notes.push(note);
                            if (!row.src.some((x) => x.s === src.s && x.ok === src.ok))
                                row.src.push(src);
                        });
                    }
                    catch (e) { }
                });
            };
            run(hs0, false);
            if (K.meddev && !RE_MEDHS.test(hs0)) {
                out.prov = true;
                run("9018", true);
            }
            out.rows = Object.keys(rows).map(k => rows[k]).sort((a, b) => (LVO[b.lv] - LVO[a.lv]) || ((b.ld || 0) - (a.ld || 0)));
        }
        catch (e) {
            warn("table", e);
        }
        return out;
    }
    const srcHtml = (x) => {
        let u = "";
        try {
            u = typeof v85docUrl === "function" ? v85docUrl(x.u) : "";
        }
        catch (e) { }
        const nm = x.s ? (u ? `<a href="${E(u)}" target="_blank" rel="noopener noreferrer">${E(x.s)}</a>` : E(x.s)) : "";
        return nm + (nm && x.ok ? "　" : "") + E(x.ok || M("要確認", "to be confirmed"));
    };
    function tableHtml(T, c) {
        if (!T || (!T.rows.length && !T.ban.length))
            return "";
        const lv = (k) => `<span class="v92o-lv ${k}" data-noi18n>${E(M(LVN[k][0], LVN[k][1]))}</span>`;
        const tr = (x) => {
            try {
                const l = lang();
                return (l !== "ja" && I18N.dict[l] && I18N.dict[l][x]) || x;
            }
            catch (e) {
                return x;
            }
        };
        const nmOf = (x) => (lang() !== "ja" && x.en) ? x.en : x.ja;
        const ban = T.ban.map((b) => `<li>${lv("ban")}<b>${E(tr(b.c))}</b>${b.pref ? `<span class="v92o-tc" data-noi18n>${E(M("登録の産地（" + b.pref + "）が、この産地に当たります。出荷の前に、最新の状況を必ず確かめてください（要確認）。", "The registered origin (" + b.pref + ") falls under these prefectures. Be sure to check the latest status before shipping."))}</span>` : ""}${b.needPref ? `<span class="v92o-tc" data-noi18n>${E(M("産地の都道府県で決まります。商品情報に産地（都道府県）を入れると、当たるかどうかを判定できます（要確認）。", "This depends on the prefecture of origin. Register the prefecture in Product information to judge it (please confirm)."))}</span>` : ""}
        <details><summary data-noi18n>${E(M("くわしく（出どころ）", "Details (source)"))}</summary>${b.note ? `<p class="v92o-dt">${E(b.note)}</p>` : ""}<p class="v92o-dt"><span data-noi18n>${E(M("出どころ", "Source"))}</span>：${srcHtml(b.src)}</p></details></li>`).join("");
        const rows = T.rows.slice(0, 10).map((x) => `<li>${lv(x.lv)}<b data-noi18n>${E(nmOf(x))}</b>${x.prov ? ` <span class="v92o-lv cf" data-noi18n>${E(M("区分（医療機器）から当てはめ・要確認", "Applied from the category (medical device); please confirm"))}</span>` : ""}
        <span class="v92o-tc">${x.why.slice(0, 2).map((w) => E(tr(w))).join("<br>")}</span>
        <details><summary data-noi18n>${E(M("くわしく（発行元・日数・出どころ）", "Details (issuer, lead time, source)"))}</summary>${x.notes.slice(0, 2).map((n) => `<p class="v92o-dt">${E(n)}</p>`).join("")}
        <p class="v92o-dt"><span data-noi18n>${E(M("発行・作る人", "Issued / prepared by"))}</span>：${E(x.is || "—")}${x.ld ? `　<span data-noi18n>${E(M("準備の目安（アプリの表の値）", "Lead time (app table)"))}：${E(M("約" + x.ld + "日", "about " + x.ld + " days"))}</span>` : ""}</p>
        ${x.src.slice(0, 2).map((s) => `<p class="v92o-dt"><span data-noi18n>${E(M("出どころ", "Source"))}</span>：${srcHtml(s)}</p>`).join("")}</details></li>`).join("");
        const more = T.rows.length > 10 ? `<p class="v92o-dt" data-noi18n>${E(M("ほか " + (T.rows.length - 10) + " 件は「書類をつくる」で見られます。", (T.rows.length - 10) + " more in “Create documents”."))}</p>` : "";
        return `<p class="v92o-h3" data-noi18n>${E(M("「書類をつくる」の判断の表（HS コード × 送り先）に当たるもの", "From the app's document decision table (HS code × destination)"))}<small>${E(M("上のひな形の表に入っていない分・出どころつき", "items not in the template above, with sources"))}</small></p>
      <ul class="v92o-ul">${ban}${rows}</ul>${more}`;
    }
    const PT_ANIMAL_FOOD = { t: ["動物性の食品：輸入が認められているか・衛生証明書", "Foods of animal origin: is import allowed, and is a health certificate needed?"],
        d: ["はちみつ・肉・乳・卵・水産物などの動物性の食品は、相手国が「日本からの輸入を認めている品目か」「認定・登録された施設で作ったものか」を決めていることがあり、日本の公的な衛生証明書を求められることがあります。この国・この商品で要るかを、輸入者と、農林水産省の国別の案内で確かめてください（要確認）。",
            "For honey, meat, dairy, eggs and seafood, the destination may decide whether the product may be imported from Japan and whether it must come from an approved or registered facility, and may ask for an official Japanese health certificate. Confirm with the importer and the Ministry of Agriculture's country guidance (please confirm)."] };
    const PTS = {
        culture: [
            { re: /毛|膠|にかわ|皮|革|骨|角|貝|羽|象牙|べっ甲|鼈甲|珊瑚|サンゴ|絹|ウール|フェルト/, t: ["動物由来の材料（毛・膠・皮・骨・貝 など）：動物検疫とワシントン条約", "Animal-derived materials (hair, glue, leather, bone, shell): quarantine and CITES"],
                d: ["筆の毛（馬・羊・いたち など）や墨の膠のような動物由来の材料は、相手国の動物検疫で、動物の種類と加工の方法の申告・証明を求められることがあります。野生動物の毛・象牙・べっ甲・一部のサンゴなどは、ワシントン条約（CITES）の対象になり得ます。対象なら、日本の輸出の承認（経済産業省）と相手国の輸入の許可が要ります。使っている動物の種類を、仕入れ先に確かめてください（要確認）。",
                    "Animal-derived materials such as brush hair (horse, sheep, weasel) or the animal glue in ink sticks may need a declaration or certificate of species and processing for the destination's animal quarantine. Hair of wild animals, ivory, tortoiseshell and some corals can fall under CITES; if so, a Japanese export approval (METI) and the destination's import permit are required. Confirm the species with your supplier (please confirm)."] },
            { re: /木|竹|籐|い草|わら|藁|麻|和紙|桐|檀|種/, t: ["木・竹・わらなどの植物の材料：植物検疫と木材の決まり", "Wood, bamboo, straw and other plant materials: plant quarantine and timber rules"],
                d: ["木・竹・わらなどは、相手国の植物検疫の対象になることがあります（加工の度合いで扱いが変わります）。紫檀（ローズウッド）・黒檀の一部など、ワシントン条約の対象の木もあります（楽器・工芸品）。材料の種類を確かめてください。木のパレット・木箱で送るときは、消毒と表示（ISPM 15）が要ります（要確認）。",
                    "Wood, bamboo and straw may be subject to plant quarantine in the destination (treatment depends on the degree of processing). Some timbers such as certain rosewoods and ebonies are listed under CITES (instruments, crafts). Confirm the species. Wooden pallets and crates need ISPM 15 treatment and marking (please confirm)."] },
            { t: ["子ども向けの製品・玩具にあたるとき：安全規格と表示", "If it counts as a children's product or toy: safety standards and labelling"],
                d: ["子どもが使う製品・玩具は、多くの国で、安全規格への適合と表示が求められます（例：EU は CE マーキングと玩具の規格 EN 71、米国は CPSIA と ASTM F963。日本の ST マークは任意の制度です）。学校・教室向けでも、対象の年齢によって当たることがあります。対象になるか・どの試験が要るかを、輸入者に確かめてください（要確認）。",
                    "Products and toys for children must meet safety standards and labelling rules in many countries (e.g. CE marking and EN 71 in the EU; CPSIA and ASTM F963 in the US; Japan's ST mark is voluntary). Goods for schools and classes may also be covered depending on the target age. Confirm with the importer whether your product is covered and which tests are needed (please confirm)."] },
            { re: /墨|絵具|絵の具|インク|塗料|接着|のり|糊|粘土|クレヨン|スプレー/, t: ["墨・絵具・接着剤などの成分：表示・SDS・輸送", "Ink, paints, adhesives: labelling, SDS and transport"],
                d: ["墨汁・絵具・接着剤などは、成分の表示や安全データシート（SDS）を求められることがあります（例：米国の画材は、健康への害についての表示の規格 ASTM D-4236 への適合の表示）。液体・スプレー・燃えやすい物は、輸送で危険物にあたらないかを物流会社に確かめてください（要確認）。",
                    "Liquid ink, paints and adhesives may need ingredient labelling or a safety data sheet (e.g. art materials in the US carry a statement of conformance to ASTM D-4236 on chronic health hazards). For liquids, sprays and flammables, check with your forwarder whether they are dangerous goods (please confirm)."] },
            { t: ["絵柄・キャラクター・教材の文章：権利の確認", "Designs, characters and teaching texts: rights clearance"],
                d: ["キャラクター・絵柄・教材の文章・音楽・ブランド名は、売る国での権利（著作権・商標・ライセンスの地域）を確かめてください。産地や伝統工芸の名称・マークを表示に使うときは、相手国での表示の決まりも確かめます（要確認）。",
                    "For characters, designs, teaching texts, music and brand names, confirm the rights in the country of sale (copyright, trademark, licence territory). If you use origin or traditional-craft names and marks, also check the destination's labelling rules (please confirm)."] }
        ],
        pet: [
            { re: /フード|おやつ|またたび|キャットニップ|ガム|ミルク|サプリ|飼料|草|種/, t: ["口に入る物・植物や動物由来の原料：検疫と飼料の決まり", "Edible items and plant/animal-derived ingredients: quarantine and feed rules"],
                d: ["ペットフード・おやつ・またたびのように動物が口にする物や、植物・動物由来の原料を含む物は、相手国の動物検疫・植物検疫・飼料の決まり（登録・輸入の許可・証明書）の対象になることがあります。本体は対象外でも、付属品（またたびの粉 など）だけが対象になることがあります。原料と加工の方法を伝えて、輸入者に確かめてください（要確認）。",
                    "Items that animals eat (pet food, treats, silver vine/catnip) or that contain plant or animal materials may fall under the destination's animal or plant quarantine or feed rules (registration, import permit, certificates). Even if the main product is not covered, an accessory such as silver-vine powder may be. Tell the importer the ingredients and processing and confirm (please confirm)."] },
            { t: ["材質と表示：天然素材・注意書き", "Materials and labelling: natural materials and warnings"],
                d: ["木・麻・わら・羽根などの天然素材は、相手国の検疫の対象になることがあります。ペット用品には、人の玩具のような統一の安全規格が無い国が多いですが、材質・原産国の表示や、誤って飲み込むことへの注意書きを求める売り先（小売チェーン・EC）があります（要確認）。",
                    "Natural materials such as wood, hemp, straw or feathers may be subject to quarantine. Many countries have no unified safety standard for pet products like those for toys, but retailers and marketplaces may ask for material and origin labelling and choking warnings (please confirm)."] },
            { t: ["うたい文句：虫よけ・抗菌・健康の効能", "Claims: insect-repellent, antibacterial or health effects"],
                d: ["ノミ・ダニよけ、抗菌・消臭、健康への効能をうたうと、相手国で動物用の薬や殺虫剤・殺菌剤の登録の対象になることがあります。パッケージと商品ページの表現を、輸入者と確かめてください（要確認）。",
                    "Claims such as flea/tick repellent, antibacterial, deodorising or health benefits can bring the product under veterinary-drug or pesticide/biocide registration in the destination. Review the wording on the package and listings with the importer (please confirm)."] },
            { re: /電池|電動|充電|USB|自動|ヒーター|ライト|LED/, t: ["電気・電池を使う物", "Electrical or battery-powered items"],
                d: ["電気の安全・電波の認証と、電池の輸送の決まり（危険物）を確かめてください（要確認）。", "Check electrical safety and radio approvals, and the dangerous-goods rules for shipping batteries (please confirm)."] }
        ],
        machine: [
            { re: /中古|used/i, t: ["相手国の中古機械の輸入の決まり（年式・検査・許可）", "Destination rules for used machinery (age, inspection, permits)"],
                d: ["中古の建設機械は、国によって、製造からの年数の制限・輸入の許可・船積み前の検査の決まりがあります。製造年を示す資料（製造銘板の写真・メーカーの証明）と稼働時間の記録を求められることが多いです。この機械で輸入できるかを、輸入者と現地の通関業者に先に確かめてください（要確認）。",
                    "For used construction machinery, countries may set age limits, import permits or pre-shipment inspection. Proof of the year of manufacture (nameplate photo, maker's statement) and operating hours is often requested. Confirm first with the importer and local customs broker that this machine can be imported (please confirm)."] },
            { t: ["排出ガス・騒音などの基準", "Emission and noise standards"],
                d: ["相手国の排出ガスの基準に合わないと、輸入・登録・使用ができない国があります。エンジンの型式と、適合している基準を伝えて確かめてください（要確認）。",
                    "Some countries do not allow import, registration or use of machines that fail their emission standards. Give the engine model and the standard it meets, and confirm (please confirm)."] },
            { t: ["輸出管理：該非判定と、輸出の禁止・規制の措置", "Export control: classification and export bans/restrictions"],
                d: ["機械は、通関で該非判定書を求められます（メーカーから取り寄せます）。仕向国・用途・買い手によっては、キャッチオール規制の確認や、特定の国向けの輸出の禁止の措置にあたることがあります。経済産業省の最新の案内で確かめてください（要確認）。",
                    "Customs asks for an export-control classification statement for machinery (obtain it from the maker). Depending on the destination, end use and buyer, catch-all controls or export bans to specific countries may apply. Check METI's latest guidance (please confirm)."] },
            { t: ["洗浄と検疫（土・植物・虫の付着）", "Cleaning and quarantine (soil, plants, insects)"],
                d: ["中古の機械に土・植物・虫が付いていると、相手国の検疫で止められ、洗浄・消毒の費用がかかることがあります。船積みの前に洗浄し、写真つきの記録を残してください（要確認）。",
                    "Used machines carrying soil, plant matter or insects may be held by quarantine and incur cleaning or disinfection costs. Clean before shipment and keep a photo record (please confirm)."] },
            { t: ["輸送：大きさ・重さ・燃料・バッテリー", "Transport: size, weight, fuel and batteries"],
                d: ["RORO 船か、フラットラックなどの特殊なコンテナかで、費用と条件が変わります。燃料の残り・バッテリー・作動油の扱いは、船会社の決まり（危険物）に合わせます。寸法と重さを先に物流会社へ伝えてください。",
                    "Cost and conditions differ between RORO and special containers such as flat racks. Remaining fuel, batteries and hydraulic oil must follow the carrier's dangerous-goods rules. Give dimensions and weight to your forwarder early."] },
            { t: ["ナンバーの付いた機械（公道を走る登録のあるもの）", "Machines with licence plates (registered for public roads)"],
                d: ["建設機械には、ふつう自動車のような輸出抹消の手続きはありません。ただし、ナンバーを付けて公道を走る登録をしている機械は、抹消の手続きが要ることがあります。登録の有無を確かめてください（要確認）。",
                    "Construction machines normally do not need the export deregistration used for cars. However, machines registered with plates for public roads may need deregistration. Check whether yours is registered (please confirm)."] }
        ],
        supp: [
            { t: ["相手国での区分：一般の食品か、健康食品（登録・届出の区分）か、医薬品か", "Classification in the destination: ordinary food, health food (registration/notification) or medicine"],
                d: ["サプリメントは、国によって「一般の食品」「健康食品・保健食品（登録や届出が要る区分）」「医薬品」のどれになるかが違います。区分は、成分・1日の量・形（錠剤・カプセル）・うたい文句で決まります。上の表は「食品」としてのひな形です。最初に、輸入者と当局の区分を確かめてください（要確認）。",
                    "Supplements may be treated as ordinary food, as health food requiring registration or notification, or as medicine, depending on the country. The classification depends on ingredients, daily dose, form (tablet, capsule) and claims. The table above is the template for food. First confirm the classification with the importer and the authority (please confirm)."] },
            { t: ["成分と量：使える成分・上限", "Ingredients and amounts: permitted ingredients and limits"],
                d: ["ビタミン・ミネラルの上限、使える菌株・植物エキス・添加物は、国ごとに違います。日本で食品に使える成分が、相手国では医薬品の成分や、承認の要る新しい食品にあたることがあります。全成分と配合量の英文の規格書を用意して確かめます（要確認）。",
                    "Limits for vitamins and minerals and the permitted strains, botanical extracts and additives differ by country. An ingredient allowed in food in Japan may be a medicinal ingredient or a novel food needing approval elsewhere. Prepare an English specification with all ingredients and amounts and confirm (please confirm)."] },
            { t: ["製品の登録・届出", "Product registration / notification"],
                d: ["売る前に、製品ごとの登録・届出（ふつうは輸入者の名義）が要る国があります。自由販売証明・GMP の証明・分析成績書を求められることがあり、期間もかかります。この枠の「判断の表」にこの国の手続きが出ていれば、それも確かめてください（要確認）。",
                    "Some countries require product-by-product registration or notification before sale (usually in the importer's name). A certificate of free sale, GMP certificate and analysis report may be requested, and it takes time. If the decision table in this box lists a procedure for this country, check it too (please confirm)."] },
            { t: ["表示と、うたえる効能", "Labelling and permitted claims"],
                d: ["成分・1日の目安量・注意書きの表示の形式は、国ごとに違います（例：米国は Supplement Facts の形式）。病気の治療・予防をうたう表現は、ほとんどの国で食品には認められません。日本の機能性表示・特定保健用食品の表示は、そのままでは使えません（要確認）。",
                    "The format for ingredients, daily intake and warnings differs by country (e.g. the Supplement Facts panel in the US). Claims to treat or prevent disease are not allowed for foods in most countries. Japanese functional-claim or FOSHU wording cannot be used as is (please confirm)."] },
            { re: /ゼラチン|カプセル|乳(?!酸菌)|コラーゲン|魚|プラセンタ|gelatin/i, t: ["カプセル・原料の由来（ゼラチン・乳・魚 など）", "Origin of capsules and ingredients (gelatin, dairy, fish)"],
                d: ["動物由来の原料は、相手国の検疫や、ハラルの確認の対象になることがあります。原料の由来を確かめてください（要確認）。", "Animal-derived ingredients may be subject to quarantine or halal checks in the destination. Confirm their origin (please confirm)."] }
        ],
        meddev: [
            { t: ["相手国でのクラス（リスクの区分）を先に確かめる", "First confirm the device class in the destination"],
                d: ["医療機器は、相手国でのクラスによって、要る手続き（届出・登録・承認）と期間が大きく変わります。クラスは国ごとに決まり、日本のクラスと同じとは限りません。輸入者・現地の登録の代理人・相手国の当局の分類の手引きで確かめてください（要確認）。",
                    "For medical devices, the required procedure (notification, registration, approval) and lead time depend heavily on the class in the destination. Classes are set per country and may differ from Japan's. Confirm with the importer, a local registration agent or the authority's classification guidance (please confirm)."] },
            { t: ["登録の名義人（現地の輸入者・代理店・責任者）", "Who holds the registration (local importer, distributor or representative)"],
                d: ["医療機器の登録は、相手国の会社（輸入者・代理店・現地の責任者）の名義で行う国が多く、名義人を替えると登録をやり直すことがあります。代理店の契約の前に、登録を誰の名義にするかを決めてください（要確認）。",
                    "In many countries a medical device is registered in the name of a local company (importer, distributor or local representative), and changing that holder can mean registering again. Decide who will hold the registration before signing a distribution agreement (please confirm)."] }
        ],
        textile: [
            { t: ["繊維製品の表示（繊維の組成・原産国・取扱い方法）", "Textile labelling (fibre composition, origin, care)"],
                d: ["タオルなどの繊維製品は、多くの国で、繊維の組成（例：綿100%）・原産国・取扱い方法の表示が求められます。表示の項目と言語は国ごとに違います。この枠の「判断の表」にこの国の例が出ていれば、それも確かめてください（要確認）。",
                    "Towels and other textile products must be labelled with fibre composition (e.g. 100% cotton), country of origin and care instructions in many countries. Items and language differ by country. If the decision table in this box shows an entry for this country, check it too (please confirm)."] },
            { t: ["肌に触れる製品の化学物質の基準", "Chemical limits for products in contact with skin"],
                d: ["ホルムアルデヒドや特定の染料など、繊維製品の化学物質の基準がある国があります。試験の成績（例：OEKO-TEX の認証）があれば、輸入者への説明に使えます（要確認）。",
                    "Some countries limit chemicals such as formaldehyde or certain dyes in textiles. Test results (e.g. an OEKO-TEX certificate) help when explaining to importers (please confirm)."] },
            { t: ["子ども向け・寝具などの追加の決まり", "Extra rules for children's items and bedding"],
                d: ["乳幼児向けの製品・ねまき・寝具には、燃えにくさや小さな部品の安全の決まりがある国があります。対象にあたるかを輸入者に確かめてください（要確認）。",
                    "Some countries have flammability or small-parts rules for infant products, sleepwear and bedding. Confirm with the importer whether yours is covered (please confirm)."] }
        ]
    };
    const AGRI = [
        { re: /肥料|液肥|堆肥|たい肥|培養土|土壌改良|fertili[sz]er/i, pts: [
                { t: ["相手国での肥料の登録・輸入の許可", "Fertiliser registration / import permit in the destination"],
                    d: ["肥料は、多くの国で、売る前に相手国の当局への登録（製品ごと）や輸入の許可が要ります。ふつうは現地の輸入者・代理店の名義で申請し、成分の分析成績書・ラベルの案・試験のデータを求められます。期間がかかるため、最初に輸入者と確かめてください（要確認）。",
                        "In many countries a fertiliser must be registered with the authority (per product) or have an import permit before sale. The local importer or agent usually applies, with an analysis report, draft label and trial data. It takes time, so confirm with the importer first (please confirm)."] },
                { re: /魚|骨|血|ふん|糞|鶏|牛|豚|油かす|米ぬか|海藻|堆肥|有機|アミノ酸/, t: ["動物・植物由来の原料：検疫", "Animal- or plant-derived raw materials: quarantine"],
                    d: ["魚・骨・ふん・植物などに由来する原料の肥料は、相手国の動物検疫・植物検疫で、輸入の許可や、加熱などの処理の証明を求められることがあります。原料と作り方（加熱の温度・時間）を伝えて確かめてください（要確認）。",
                        "Fertilisers made from fish, bone, manure or plant materials may need an import permit or proof of treatment (such as heating) for the destination's animal or plant quarantine. Give the raw materials and process (heating temperature and time) and confirm (please confirm)."] },
                { t: ["SDS・ラベル・成分の基準", "SDS, label and composition limits"],
                    d: ["安全データシート（SDS）と、相手国の言語のラベル（成分の保証値・使い方・注意）を求められるのが一般的です。重金属（カドミウム・ヒ素・鉛 など）の上限を決めている国もあります。分析成績書を用意しておきます（要確認）。",
                        "A safety data sheet and a label in the local language (guaranteed analysis, directions, cautions) are commonly required. Some countries set limits for heavy metals (cadmium, arsenic, lead). Keep an analysis report ready (please confirm)."] },
                { re: /有機|オーガニック|organic|JAS/i, t: ["「有機」の表示", "“Organic” claims"],
                    d: ["「有機」「オーガニック」と表示して売るには、相手国の有機の制度で使える資材として認められていることが要る場合があります。日本の有機 JAS 適合資材の扱いは国ごとに違います（要確認）。",
                        "To sell with an “organic” claim, the input may need to be recognised under the destination's organic scheme. Treatment of Japanese JAS-compliant inputs differs by country (please confirm)."] },
                { t: ["輸送：液体・危険物にあたらないか", "Transport: liquids and dangerous goods"],
                    d: ["液体は、漏れ・凍結・ふくらみに注意します。一部の肥料は、輸送で危険物にあたります。SDS の「輸送上の注意」の項を物流会社に見せて確かめてください（要確認）。",
                        "Watch for leakage, freezing and swelling of liquids. Some fertilisers are dangerous goods in transport. Show the transport section of the SDS to your forwarder (please confirm)."] }
            ] },
        { re: /農薬|殺虫|殺菌|除草|pesticide/i, pts: [{ t: ["相手国での農薬の登録", "Pesticide registration in the destination"],
                    d: ["農薬は、ほとんどの国で、相手国で登録された製品だけが輸入・販売できます。登録は現地の法人の名義で行い、時間と費用がかかります。日本から出すときに輸出の承認が要る物質もあります（経済産業省・要確認）。",
                        "In most countries only pesticides registered there can be imported and sold. Registration is in the name of a local entity and takes time and cost. Some substances also need export approval from Japan (METI; please confirm)."] }] },
        { re: /種子|種苗|苗|球根|seeds?/i, pts: [{ t: ["種子・苗：植物検疫と品種の権利", "Seeds and seedlings: plant quarantine and variety rights"],
                    d: ["種子・苗・球根は、日本の植物防疫所の輸出検査と植物検疫証明書、相手国の輸入の許可が要るのが一般的です。登録品種には、海外への持ち出しが制限されているものがあります（種苗法・要確認）。",
                        "Seeds, seedlings and bulbs generally need export inspection and a phytosanitary certificate from Japan's plant protection station and an import permit in the destination. Some registered varieties are restricted from being taken overseas (Plant Variety Protection and Seed Act; please confirm)."] }] },
        { re: /飼料|feed/i, pts: [{ t: ["飼料：相手国の登録と検疫", "Feed: registration and quarantine in the destination"],
                    d: ["飼料・飼料添加物は、相手国の登録や輸入の許可、動物由来の原料の検疫の対象になることがあります。原料と作り方を伝えて、輸入者に確かめてください（要確認）。",
                        "Feed and feed additives may need registration or an import permit in the destination, and animal-derived materials may be subject to quarantine. Give the ingredients and process to the importer and confirm (please confirm)."] }] }
    ];
    const PT_AGRI_GEN = { t: ["農業資材は、種類ごとに相手国の登録の制度があります", "Agricultural inputs have destination registration schemes by type"],
        d: ["肥料・農薬・種苗・飼料は、多くの国で、相手国での登録や輸入の許可が要ります。商品名や成分表に種類（肥料／農薬／種苗／飼料）が分かる言葉を入れると、確かめる点をしぼれます（要確認）。",
            "Fertilisers, pesticides, seeds and feed need registration or an import permit in many countries. If the product name or composition table shows the type, the points to check can be narrowed down (please confirm)."] };
    const PT_HONEY = { t: ["はちみつ：残留物質の基準・規格・表示", "Honey: residue limits, standards and labelling"],
        d: ["はちみつは、抗生物質などの残留物質や農薬の基準が国ごとに違い、検査の成績書を求められることがあります。「はちみつ」と表示できる条件（加糖・加熱の有無 など）や、乳児に与えない旨の注意書きの決まりも国ごとに違います（要確認）。",
            "Limits for residues such as antibiotics and pesticides in honey differ by country, and a test report may be requested. The conditions for calling a product “honey” (added sugar, heating) and warnings about not feeding infants also differ (please confirm)."] };
    function viewpoints(K, p) {
        const txt = textOf(p) + " " + String((p && p.cat) || "");
        const pick = (L) => (L || []).filter(x => !x.re || x.re.test(txt));
        let L = [];
        if (K.k === "agri") {
            AGRI.forEach((g) => {
                if (g.re.test(txt))
                    L = L.concat(pick(g.pts));
            });
            if (!L.length)
                L = [PT_AGRI_GEN];
        }
        else if (PTS[K.k])
            L = pick(PTS[K.k]);
        if (K.food && K.animal) {
            L = [PT_ANIMAL_FOOD].concat(K.honey ? [PT_HONEY] : [], L);
        }
        if (K.textile && !K.meddev && K.ck !== "medical" && K.k !== "culture" && K.k !== "pet")
            L = L.concat(pick(PTS.textile));
        if (K.meddev)
            L = L.concat(pick(PTS.meddev));
        return L;
    }
    function ptsHtml(L, K) {
        if (!L.length)
            return "";
        const i = lang() === "ja" ? 0 : 1;
        const nm = K.honey ? M("はちみつ・動物性の食品", "honey / foods of animal origin") : K.k === "supp" ? M("健康食品（サプリメント）", "health foods / supplements") : K.k === "machine" ? M("建設機械", "construction machinery") : K.k === "agri" ? M("農業資材", "agricultural inputs")
            : K.k === "culture" ? M("文化・教育用品", "culture & education goods") : K.k === "pet" ? M("ペット用品", "pet supplies") : K.meddev ? M("医療機器", "medical devices") : K.textile ? M("繊維製品", "textile products") : (K.cat || "");
        return `<p class="v92o-h3" data-noi18n>${E(M("この業種で確かめる観点", "Points to check for this type of product"))}<small>${E(nm)}${E(M("・一般的な注意です。国ごとの細目は入っていません（要確認）", " — general guidance without country details (please confirm)"))}</small></p>
      <ul class="v92o-ul" data-noi18n>${L.map(x => `<li><span class="v92o-lv cf">${E(M("要確認", "Confirm"))}</span><b>${E(x.t[i])}</b><span class="v92o-tc">${E(x.d[i])}</span></li>`).join("")}</ul>`;
    }
    function askStandage(c) {
        try {
            const d = dd() || {};
            if (typeof s30TkNew !== "function") {
                say(M("この画面からは送れません。「やりとり」から、STANDAGE の担当にご相談ください。", "Cannot send from this screen. Please contact your STANDAGE representative from “Messages”."));
                try {
                    go("msg");
                }
                catch (e) { }
                return;
            }
            s30TkNew();
            const v = (id, x) => {
                const e = document.getElementById(id);
                if (e)
                    e.value = x;
            };
            v("s30tc", "そのほか");
            v("s30tp", M("規制を調べる", "Check regulations"));
            v("s30ts", M("規制の調査の依頼：", "Regulation research request: ") + [c, d.item].filter(Boolean).join("・").slice(0, 60));
            v("s30tb", M(`次の商品・国の規制（販売・出荷の前に必要な登録・届出・表示・証明書、関税）を調べてください。\n商品：${d.item || ""}（HS ${d.hs || "未登録"}・${d.cat || ""}）\n送り先の国：${c || ""}\n知りたいこと：\n希望の時期：`, `Please research the regulations (registration, notification, labelling, certificates and duty needed before sale/shipment) for the product and country below.\nProduct: ${d.itemEn || d.item || ""} (HS ${d.hs || "n/a"}, ${d.cat || ""})\nDestination: ${c || ""}\nWhat I want to know:\nTiming:`));
        }
        catch (e) {
            warn("ask", e);
        }
    }
    try {
        if (W.BCACT && BCACT.on) {
            BCACT.on("v92ops.ask", (el) => askStandage(String((el && el.getAttribute("data-arg")) || "")), { replace: true });
            BCACT.on("v92ops.ai", () => {
                try {
                    regAI();
                }
                catch (e) { }
            }, { replace: true });
            BCACT.on("v92ops.file", () => {
                try {
                    opsTab = "doc";
                    render();
                    window.scrollTo(0, 0);
                }
                catch (e) { }
            }, { replace: true });
            BCACT.on("v92ops.item", () => {
                try {
                    go("item");
                }
                catch (e) { }
            }, { replace: true });
        }
    }
    catch (e) { }
    function ptsBox(c, r, K, p) {
        const T = tableHits(c, r, K);
        const L = viewpoints(K, p);
        const a = tableHtml(T, c), b = ptsHtml(L, K);
        if (!a && !b)
            return { html: "", req: 0, n: 0 };
        const d = dd() || {};
        const fb = (isStaff() ? "" : `<button class="btn g" type="button" data-act="v92ops.ask" data-arg="${E(c)}">✉ ${E(M("STANDAGE に規制の調査を依頼する", "Ask STANDAGE to research"))}</button>`) +
            (a ? `<button class="btn g" type="button" data-act="v92ops.file">📄 ${E(M("「書類をつくる」で全部を見る", "See all in “Create documents”"))}</button>` : "");
        const ft = fb ? `<div class="v92o-ft" data-noi18n>${fb}</div>` : "";
        const html = `<div class="v92o-pts" data-v92pts="1" role="note"><b data-noi18n>🔎 ${E(M("この商品と送り先で確かめる点", "Points to check for this product and destination"))}（${E(c)}・HS ${E(d.hs || "—")}）</b>
      <p class="v92o-sub" data-noi18n>${E(M("上の表（カテゴリーのひな形・概算）に入っていない点です。必須かどうかは、商品の細かい条件と相手国の最新の決まりで変わります。出荷の前に確かめてください。", "These are points not covered by the template table above (a rough guide by category). Whether they are mandatory depends on product details and the destination's latest rules. Check before shipping."))}</p>${a}${b}${ft}</div>`;
        return { html, req: T.rows.filter((x) => x.lv === "required").length, ban: T.ban.length, n: T.rows.length + L.length };
    }
    const TPL_HS = { food: ["0902", "茶"], cosme: ["3304", "スキンケア"], parts: ["8482", "軸受"], daily: ["9617", "魔法瓶"], liquor: ["2206", "清酒"], apparel: ["6203", "綿のズボン"], car: ["8703", "乗用車"], medical: ["3005", "衛生材料"] };
    const SANC = { "ロシア": 1, "ベラルーシ": 1, "北朝鮮": 2, "イラン": 3, "シリア": 3, "イラク": 3, "リビア": 3, "アフガニスタン": 3, "ミャンマー": 3, "スーダン": 3, "南スーダン": 3, "ソマリア": 3, "中央アフリカ": 3, "コンゴ民主共和国": 3, "レバノン": 3 };
    function sancUrl(c) {
        try {
            if (typeof V56REG_SANC !== "undefined" && V56REG_SANC && V56REG_SANC[c] && V56REG_SANC[c].url)
                return String(V56REG_SANC[c].url);
            if (typeof V56REG_XC !== "undefined" && V56REG_XC && V56REG_XC.url)
                return String(V56REG_XC.url);
        }
        catch (e) { }
        return "";
    }
    function sancMsg(c, lv) {
        const h = lv === 2 ? M(`⛔ ${c}向けの輸出は、日本の措置（外為法）で、原則として禁止されています`, `⛔ Exports to ${c} are, in principle, prohibited under Japan's measures (Foreign Exchange and Foreign Trade Act)`)
            : lv === 1 ? M(`⚠ ${c}は、日本の輸出の禁止・規制の措置（外為法）の対象になりうる国です`, `⚠ ${c} may be subject to Japan's export bans and restrictions (Foreign Exchange and Foreign Trade Act)`)
                : M(`⚠ ${c}は、輸出管理の確認が厳しくなることがある国・地域です`, `⚠ Export-control checks may be stricter for ${c}`);
        const b = lv === 2 ? M("出荷はできない前提で考え、必ず経済産業省の最新の案内を確かめてください。", "Assume you cannot ship, and be sure to check the latest guidance from METI (Japan's Ministry of Economy, Trade and Industry).")
            : lv === 1 ? M("この商品が対象の品目にあたるかは、この画面の表では判定していません。商談・見積・出荷の前に、経済産業省の最新の措置（対象の品目の一覧）と該非判定を必ず確かめてください（要確認）。", "The table on this screen does not judge whether your product is a covered item. Before negotiating, quoting or shipping, be sure to check METI's latest measures (the list of covered items) and your export-control classification.")
                : M("国連の武器禁輸などの対象で、日本の輸出管理（外為法・キャッチオール規制）の確認が厳しくなることがあります。この画面の表では判定していません。出荷の前に、経済産業省の最新の案内と該非判定を必ず確かめてください（要確認）。", "Measures such as UN arms embargoes apply, and Japan's export controls (catch-all) may require stricter checks. The table on this screen does not judge this. Be sure to check METI's latest guidance and your export-control classification before shipping.");
        const u = sancUrl(c);
        return `<b>${E(h)}</b><span>${E(b)}</span>${u && /^https:\/\//.test(u) ? ` <a href="${E(u)}" target="_blank" rel="noopener noreferrer">${E(M("経済産業省の案内を開く ↗", "Open METI's guidance ↗"))}</a>` : ""}`;
    }
    function sancNote(box, c) {
        const lv = SANC[c] || 0;
        const old = document.getElementById("v92sanc");
        if (!lv) {
            if (old)
                old.remove();
            return;
        }
        if (old)
            old.remove();
        const d = document.createElement("div");
        d.id = "v92sanc";
        d.setAttribute("data-c", c);
        d.setAttribute("data-noi18n", "");
        if (box.querySelector('[data-v56reg="sanc"]')) {
            d.hidden = true;
            box.appendChild(d);
            return;
        }
        d.className = "v92o-sanc";
        d.setAttribute("role", "alert");
        d.innerHTML = sancMsg(c, lv);
        box.insertAdjacentElement("afterbegin", d);
    }
    function fixEmpty(box, r) {
        const docs = box.querySelector(".v54r-docs");
        if (!docs || docs.querySelector(".v54r-row:not(.v92o-cond)") || docs.querySelector(".v92o-none"))
            return;
        const p = Array.from(docs.querySelectorAll("p.nn")).find((x) => !x.closest(".v54r-row"));
        const noTpl = /ひな形は、アプリにまだありません/.test(String((r && r.warn) || ""));
        const xc = !!(p && p.classList.contains("v68reg-noreq") && /該非判定/.test(p.textContent || ""));
        const txt = xc ? "" : noTpl
            ? M("<b>未調査です。</b>この商材・この国の規制のひな形が、アプリにまだありません。「手続きが無い」という意味ではありません。下の「この商品と送り先で確かめる点」と、AI の詳細調査で確かめてください。", "<b>Not yet researched.</b> The app has no regulation template for this product category and country. This does not mean no procedure is required. See “Points to check for this product and destination” below and the AI research.")
            : M("<b>アプリの表（概算）には、この国の必須の手続きは入っていません。</b>「手続きが無い」と確かめたものではありません。出荷の前に、下の「確かめる点」や AI の詳細調査で確かめてください（要確認）。", "<b>The app's rough table lists no mandatory procedure for this country.</b> This has not been confirmed as “none required”. Check the points below or the AI research before shipping.");
        if (p) {
            p.classList.remove("nn");
            p.classList.add("v92o-none");
            p.setAttribute("data-kqn", "1");
            p.setAttribute("data-rdcl", "1");
            if (txt) {
                p.setAttribute("data-noi18n", "");
                p.innerHTML = txt;
            }
        }
        else if (txt) {
            const h = docs.querySelector("p.v54r-h");
            if (h)
                h.insertAdjacentHTML("afterend", `<p class="v92o-none" data-noi18n data-kqn="1" data-rdcl="1">${txt}</p>`);
        }
    }
    function taxBox(box, c, r, K) {
        try {
            if (box.querySelector(".v56tariff-tax") || typeof v56tariffTaxOf !== "function" || typeof v56tariffTaxBox !== "function")
                return;
            const cd = r && r.v56tariffCond;
            if (cd && cd.lvl === "ng")
                return;
            const d = dd();
            const cat = (typeof v56tariffCatOf === "function") ? v56tariffCatOf(d) : "";
            const T = v56tariffTaxOf(c, r, cat, (cat === "car" && typeof v56tariffCarSpec === "function") ? v56tariffCarSpec(d) : {});
            if (!T || (!T.items.length && !T.unk.length))
                return;
            const at = box.querySelector(".v54r-hs") || box.querySelector(".v54r-us") || box.querySelector(".g3");
            if (at)
                at.insertAdjacentHTML("afterend", v56tariffTaxBox(T));
        }
        catch (e) {
            warn("tax", e);
        }
    }
    function dutyNote(box, r, K) {
        try {
            const cells = (box.querySelector(".g3") || {}).children || [];
            const cell = cells[1];
            if (!cell || cell.querySelector(".v92o-dn"))
                return;
            const T = TPL_HS[K.ck === "supp" ? "food" : K.ck];
            const duty = String((r && r.duty) || "");
            if (!T || !K.hs || K.hs.length < 4 || K.hs.slice(0, 4) === T[0] || !duty || /要確認/.test(duty) || !own())
                return;
            const hs = K.hs.slice(0, 4) + (K.hs.length >= 6 ? "." + K.hs.slice(4, 6) : "");
            cell.insertAdjacentHTML("beforeend", `<p class="v92o-dn" data-noi18n>${E(M(`カテゴリーの代表的な品目（${T[1]}・HS ${T[0]}）の目安です。この商品（HS ${hs}）の税率は、相手国の関税率表で確かめてください（要確認）`, `A guide for a typical item of this category (HS ${T[0]}). Check the destination's tariff schedule for the rate for your product (HS ${hs}).`))}</p>`);
        }
        catch (e) { }
    }
    const US_MORE_NF = "鉄鋼・アルミ・自動車など232条の対象品は、扱いが違います（品目ごとに要確認）。裁判で争われていて変わることがあるため、出荷の前に最新の税率を確かめてください。";
    dict([[US_MORE_NF, "Items covered by Section 232 (steel, aluminium, automobiles and others) are treated differently (confirm per item). The measures are being litigated and may change, so check the latest rate before shipping.",
            "钢铁、铝、汽车等232条款的对象品目处理方式不同（请按品目确认）。因诉讼可能发生变化，请在发货前确认最新税率。", "Los artículos de la Sección 232 (acero, aluminio, automóviles, etc.) tienen un trato distinto (confirme por artículo). Las medidas están en litigio y pueden cambiar; compruebe el tipo vigente antes de enviar."]]);
    function usMore(box, K) {
        try {
            if (K.food || typeof V54R_US_MORE === "undefined")
                return;
            const tr = (s) => {
                try {
                    const l = lang();
                    return (l !== "ja" && I18N.dict[l] && I18N.dict[l][s]) || s;
                }
                catch (e) {
                    return s;
                }
            };
            Array.from(box.querySelectorAll(".v54r-us p")).forEach((p) => {
                const t = (p.textContent || "").trim();
                if (t === V54R_US_MORE || t === tr(V54R_US_MORE))
                    p.textContent = tr(US_MORE_NF);
            });
        }
        catch (e) { }
    }
    function staffWords(box) {
        if (isStaff())
            return;
        try {
            Array.from(box.querySelectorAll("button")).forEach((b) => {
                const t = (b.textContent || "");
                if (/社内規制DBの関連レポートを見る/.test(t) && !b.dataset.v92o) {
                    b.dataset.v92o = "1";
                    b.setAttribute("data-noi18n", "");
                    b.textContent = "🌐 " + M("くわしい調べ方を見る（AI・STANDAGE への相談）", "How to research further (AI / ask STANDAGE)");
                }
            });
            Array.from(box.querySelectorAll("span.nn")).forEach((s) => {
                if (/詳細はAI調査と社内規制DBのレポートで確認できます/.test(s.textContent || "")) {
                    s.setAttribute("data-noi18n", "");
                    s.textContent = M("上の表は概算です。くわしくは、AI の詳細調査か、STANDAGE の担当への相談で確かめられます。", "The table above is a rough guide. For details, use the AI research or ask your STANDAGE representative.");
                }
            });
        }
        catch (e) { }
    }
    function hsBackFallback(box) {
        try {
            const t = ten();
            if (!own() || !t || !t.v92hsPrev || String(t.hs || "") !== String(t.v92hsPrev.to || "") || box.querySelector("[data-v54hsback]"))
                return;
            const cell = ((box.querySelector(".g3") || {}).children || [])[0];
            if (!cell)
                return;
            cell.insertAdjacentHTML("beforeend", `<p class="v92o-dn" data-noi18n>${E(M("HS コードを " + t.v92hsPrev.from + " から書き換えました。", "HS code changed from " + t.v92hsPrev.from + "."))}<button type="button" class="v92o-lk" data-v54hsback="${E(t.v92hsPrev.from)}">${E(M(t.v92hsPrev.from + " に戻す", "Revert to " + t.v92hsPrev.from))}</button></p>`);
            const b = cell.querySelector("[data-v54hsback]");
            if (b)
                b.onclick = () => {
                    try {
                        v54rHsSet(b.dataset.v54hsback, 1);
                    }
                    catch (e) { }
                };
        }
        catch (e) { }
    }
    function decorate() {
        const box = document.getElementById("rO"), sel = document.getElementById("rC");
        if (!box || !sel)
            return;
        const d = dd();
        if (!d || !d.regs)
            return;
        css();
        const c = String(sel.value || "");
        let r = d.regs[c] || null;
        if (!r && c) {
            try {
                r = typeof v5322RegOf === "function" ? v5322RegOf(c) : null;
            }
            catch (e) {
                r = null;
            }
        }
        if (!r || box.querySelector("[data-v92done]")) {
            if (c)
                sancNote(box, c);
            return;
        }
        box.insertAdjacentHTML("beforeend", `<span data-v92done="1" hidden></span>`);
        const p = P(), K = kind(p);
        if (K.carMis && !box.querySelector(".v92o-mis"))
            box.insertAdjacentHTML("afterbegin", `<div class="v92o-mis" data-noi18n role="note"><b>${E(M("⚠ カテゴリー「中古車」と、HS コード・品名（建設機械）が食い違っています", "⚠ The category “Used cars” does not match the HS code / product name (construction machinery)"))}</b><br>${E(M("下の表は、中古の乗用車向けのひな形（年式・ハンドル位置・輸出抹消・船積み前の検査）です。建設機械には当てはまらない項目があります。商品情報で、商材カテゴリーを「建設機械」に直してください。", "The table below is the template for used passenger cars (age, steering side, export deregistration, pre-shipment inspection). Some items do not apply to construction machinery. Please change the category to “Construction machinery” in Product information."))}
        <div class="rw" style="margin-top:6px"><button class="btn g" type="button" data-act="v92ops.item">${E(M("商品情報を開く", "Open Product information"))}</button></div></div>`);
        taxBox(box, c, r, K);
        dutyNote(box, r, K);
        usMore(box, K);
        fixEmpty(box, r);
        hsBackFallback(box);
        try {
            let st = null;
            try {
                st = v54rStatusFor(c, r, (typeof v54rCatOf === "function") ? v54rCatOf(d) : "", d.compRows || []);
            }
            catch (e) {
                st = null;
            }
            const cond = (st && st.cond) || [];
            box.querySelectorAll(".v54r-row").forEach((row) => {
                const b = row.querySelector("[data-v54req]");
                if (!b || row.querySelector(".v92o-yes"))
                    return;
                const x = cond.find((y) => y.nm === b.dataset.v54req && y.v === "y");
                if (!x)
                    return;
                const body = row.querySelector(".v54r-body");
                if (body)
                    body.insertAdjacentHTML("beforeend", `<p class="v92o-why v92o-yes" data-noi18n><b>${E(M("条件つきの手続き", "Conditional procedure"))}</b>：${E(M("「該当する」にしたので、必須に入れています。", "You marked it as applicable, so it is counted as required."))}<button type="button" class="v92o-lk" data-act="v92ops.cond" data-args="${E(JSON.stringify([c, x.nm, ""]))}">${E(M("未確認に戻す", "Back to unconfirmed"))}</button></p>`);
            });
            const unk = cond.filter((x) => !x.v).length;
            const stEl = box.querySelector(".v54r-st");
            if (stEl && unk && !stEl.querySelector(".v92o-cn"))
                stEl.insertAdjacentHTML("beforeend", `<p class="v92o-cn" data-noi18n>${E(M(`このほかに、該当するか未確認の手続きが ${unk}件あります（上の「該当するときだけ必要な手続き」で、該当する／対象外を選んでください）。`, `In addition, ${unk} procedure(s) are not yet confirmed as applicable (choose “Applies / Not applicable” under “Procedures needed only when they apply” above).`))}</p>`);
        }
        catch (e) {
            warn("yes", e);
        }
        try {
            if (!box.querySelector("[data-v92pts]")) {
                const B = ptsBox(c, r, K, p);
                if (B.html) {
                    const at = box.querySelector(".v54r-st") || box.querySelector(".v54r-docs");
                    if (at)
                        at.insertAdjacentHTML("afterend", B.html);
                    else
                        box.insertAdjacentHTML("beforeend", B.html);
                    const stEl = box.querySelector(".v54r-st.info:not(.v56reg-st)");
                    if (stEl && !(B.req || B.ban || K.k === "supp") && B.n && !stEl.querySelector(".v92o-cn2"))
                        stEl.insertAdjacentHTML("beforeend", `<p class="v92o-cn2" data-noi18n>${E(M(`下の「この商品と送り先で確かめる点」に、確かめることが ${B.n}件あります。`, `There are ${B.n} point(s) to check under “Points to check for this product and destination” below.`))}</p>`);
                    if (stEl && (B.req || B.ban || K.k === "supp")) {
                        stEl.classList.remove("info");
                        stEl.classList.add("warn");
                        stEl.setAttribute("data-noi18n", "");
                        stEl.innerHTML = `<b>${E(M("⚠ 必須の手続きがあるかは要確認です", "⚠ Whether mandatory procedures apply needs to be confirmed"))}</b><p>${E(B.req || B.ban
                            ? M(`上のひな形の表（概算）には手続きの名前が入っていませんが、アプリの書類の判断の表（「書類をつくる」で使っている表）には、この商品とこの国に当たる手続きがあります（必須 ${B.req}件${B.ban ? "・輸入の停止の情報 " + B.ban + "件" : ""}）。下の「この商品と送り先で確かめる点」をご覧ください。`, `The template table above lists no procedure, but the app's document decision table has entries for this product and country (${B.req} required${B.ban ? ", " + B.ban + " import-stop notice(s)" : ""}). See “Points to check for this product and destination” below.`)
                            : M("健康食品（サプリメント）は、国によって登録・届出が要ります。上の表は食品としてのひな形で、「手続きが無い」と確かめたものではありません。下の「この商品と送り先で確かめる点」をご覧ください。", "Health foods (supplements) need registration or notification in some countries. The table above is the template for food and has not been confirmed as “none required”. See “Points to check for this product and destination” below."))}</p>`;
                    }
                }
            }
        }
        catch (e) {
            warn("pts", e);
        }
        staffWords(box);
        if (c)
            sancNote(box, c);
    }
    if (typeof rReg === "function") {
        const __rr92 = rReg;
        rReg = function () {
            try {
                adjAll();
            }
            catch (e) { }
            const out = __rr92.apply(this, arguments);
            try {
                decorate();
            }
            catch (e) {
                warn("deco", e);
            }
            return out;
        };
    }
    if (typeof vOpsReg === "function") {
        const __vor92 = vOpsReg;
        vOpsReg = function () {
            try {
                adjAll();
            }
            catch (e) { }
            return __vor92.apply(this, arguments);
        };
    }
    if (typeof v54rHsRule === "function") {
        const __hr92 = v54rHsRule;
        v54rHsRule = function (item, cat) {
            const R = __hr92.apply(this, arguments);
            try {
                if (R && R.car) {
                    const L = [ten(), dd()].filter(Boolean);
                    const p = L.find((x) => String(x.item || "") === String(item || "")) || null;
                    if (p) {
                        const hs = digits(p.hs);
                        if (hs.length >= 4 && hs.slice(0, 4) !== "8703" && (p.hsGuess === false || RE_MACHINE.test(String(p.item || "") + " " + String(p.itemEn || ""))))
                            return null;
                    }
                }
            }
            catch (e) { }
            return R;
        };
    }
    if (typeof v54rHsSet === "function") {
        const __hs92 = v54rHsSet;
        v54rHsSet = function (code, back) {
            const t = ten();
            try {
                if (t && back && t.v92hsPrev && String(t.v92hsPrev.from) === String(code)) {
                    const pv = t.v92hsPrev;
                    t.hs = pv.from;
                    t.hsGuess = !!pv.guess;
                    if (pv.note)
                        t._hsNote = pv.note;
                    else
                        delete t._hsNote;
                    t._v54hs = 1;
                    delete t._v54hsFrom;
                    delete t._v54hsTo;
                    delete t.v92hsPrev;
                    try {
                        if (typeof syncTenant === "function")
                            syncTenant();
                        if (typeof saveTen === "function")
                            saveTen();
                    }
                    catch (e) { }
                    try {
                        if (typeof logU === "function")
                            logU("fill", "HSコードを元に戻す（規制を調べる）:" + code);
                    }
                    catch (e) { }
                    say(M("HSコードを " + code + " に戻しました", "HS code reverted to " + code));
                    try {
                        if (typeof render === "function")
                            render();
                    }
                    catch (e) { }
                    return;
                }
            }
            catch (e) {
                warn("hsback", e);
            }
            let prev = t ? { from: String(t.hs || ""), guess: !!t.hsGuess, note: t._hsNote || null } : null;
            if (t && prev && t.v92hsPrev && String(t.v92hsPrev.to) === prev.from)
                prev = { from: String(t.v92hsPrev.from), guess: !!t.v92hsPrev.guess, note: t.v92hsPrev.note || null };
            if (t && !back && prev && prev.from && prev.from !== String(code)) {
                t.v92hsPrev = { from: prev.from, to: String(code), guess: prev.guess, note: prev.note };
            }
            else if (t && back)
                delete t.v92hsPrev;
            return __hs92.apply(this, arguments);
        };
    }
    if (typeof v54rHsHtml === "function") {
        const __hh92 = v54rHsHtml;
        v54rHsHtml = function () {
            let h = String(__hh92.apply(this, arguments) || "");
            try {
                const t = ten();
                if (h && own() && t && t.v92hsPrev && String(t.hs || "") === String(t.v92hsPrev.to || "") && h.indexOf("data-v54hsback") < 0) {
                    const add = `<p class="v54r-hsn" data-noi18n>ℹ ${E(M("HSコードを " + t.v92hsPrev.from + " から " + t.v92hsPrev.to + " に書き換えました。合わなければ、元に戻せます。", "The HS code was changed from " + t.v92hsPrev.from + " to " + t.v92hsPrev.to + ". You can revert it if it does not fit."))}</p><div class="rw" style="margin-top:5px" data-noi18n><button class="btn g" data-v54hsback="${E(t.v92hsPrev.from)}">${E(M(t.v92hsPrev.from + " に戻す", "Revert to " + t.v92hsPrev.from))}</button></div>`;
                    const k = h.indexOf('<p class="nn">正式な分類は');
                    h = k > 0 ? h.slice(0, k) + add + h.slice(k) : h.replace(/<\/div>\s*$/, add + "</div>");
                }
            }
            catch (e) { }
            return h;
        };
    }
    if (typeof regAIView === "function") {
        const __rv92 = regAIView;
        regAIView = function (c) {
            const r = __rv92.apply(this, arguments);
            try {
                css();
                const o = document.getElementById("regaiO");
                const host = o && o.parentElement;
                if (o && host) {
                    const lv = SANC[String(c || "")] || 0;
                    if (lv && !host.querySelector(".v92o-sanc") && !host.querySelector('[data-v56reg="sanc"]') && !/輸出禁止の措置（外為法）の対象国です|すべての品目の輸出が禁止/.test(host.textContent || ""))
                        o.insertAdjacentHTML("beforebegin", `<div class="v92o-sanc" data-noi18n role="alert" style="margin-top:8px">${sancMsg(String(c), lv)}</div>`);
                    if (!isStaff()) {
                        Array.from(host.querySelectorAll("p.nn")).forEach((p) => {
                            if (/概算表・社内規制DBのレポートと突き合わせてご利用ください/.test(p.innerHTML))
                                p.innerHTML = p.innerHTML.replace("概算表・社内規制DBのレポートと突き合わせてご利用ください。", E(M("上の概算の表と突き合わせてご利用ください。", "Use it together with the rough table above.")));
                        });
                        if (/「🌐 社内規制DB」のレポートをご利用ください/.test(o.innerHTML))
                            o.innerHTML = o.innerHTML.replace(/それまでは上の概算表と「🌐 社内規制DB」のレポートをご利用ください。/, E(M("それまでは、上の概算の表と「この商品と送り先で確かめる点」をご覧ください。急ぐときは、STANDAGE の担当に調査を依頼できます（下の「🌐 くわしい調べ方」）。", "Until then, see the rough table and “Points to check for this product and destination”. If urgent, you can ask your STANDAGE representative to research (see “🌐 How to research further” below).")))
                                .replace(/もう一度お試しいただくか、「🌐 社内規制DB」のレポートをご利用ください。/, E(M("もう一度お試しいただくか、STANDAGE の担当に調査を依頼してください（下の「🌐 くわしい調べ方」）。", "Please try again, or ask your STANDAGE representative to research (see “🌐 How to research further” below).")));
                        Array.from(host.querySelectorAll("button")).forEach((b) => {
                            if (/^\s*🌐?\s*社内規制DB\s*$/.test(b.textContent || "")) {
                                b.setAttribute("data-noi18n", "");
                                b.textContent = "🌐 " + M("くわしい調べ方", "How to research further");
                            }
                        });
                    }
                }
            }
            catch (e) {
                warn("aiview", e);
            }
            return r;
        };
    }
    try {
        if (typeof GL !== "undefined" && GL) {
            const dv = (k) => {
                try {
                    const x = V85DOC_D.docs[k];
                    const is = (V85DOC_D.issuers || {})[x[2]] || "";
                    return { is, ld: +x[4] || 0 };
                }
                catch (e) {
                    return { is: "", ld: 0 };
                }
            };
            const tail = (k) => { const v = dv(k); return (v.is ? "発行・作る人：" + v.is + "（国と品目で変わります）。" : "") + (v.ld ? "準備の目安：約" + v.ld + "日（アプリの書類の表の値・要確認）。" : ""); };
            const tailEn = (k, isEn) => { const v = dv(k); return (isEn ? " Issued/prepared by: " + isEn + " (varies by country and product)." : "") + (v.ld ? " Lead time: about " + v.ld + " days (value in the app's document table; please confirm)." : ""); };
            const add = (nm, ja, en) => {
                if (!GL[nm]) {
                    GL[nm] = ja;
                    dict([[ja, en]]);
                }
            };
            add("放射性物質検査証明書", "放射性物質の検査の結果を示す証明書です。原発事故に関連して、一部の国が、産地（都道府県）と品目によって求めます。要るかどうかは、国・産地・品目で決まります。" + tail("RAD_TEST"), "A certificate showing the results of radioactive-substance testing. Some countries require it, depending on the prefecture of origin and the product, in connection with the nuclear accident." + tailEn("RAD_TEST", "Ministry of Agriculture, Forestry and Fisheries (regional offices)"));
            add("成分分析表", "成分・微生物・重金属・残留農薬・栄養成分などの分析の結果をまとめた書類（COA・試験成績書）です。輸入者・相手国での製品の登録・L/C が求めたときに使います。項目は、相手国の基準に合わせます。" + tail("COA"), "A document (COA / test report) summarising analysis results such as ingredients, microbes, heavy metals, pesticide residues and nutrition. Used when the importer, product registration in the destination or the L/C asks for it. Items follow the destination's standards." + tailEn("COA", "the maker or a testing laboratory"));
            add("残留農薬証明", "残留農薬の検査の結果を示す成績書です。茶・青果などで、相手国の残留農薬の基準に合うことを確かめるために使います。" + tail("COA"), "A test report on pesticide residues, used mainly for tea and fresh produce to show compliance with the destination's residue limits." + tailEn("COA", "the maker or a testing laboratory"));
            add("衛生証明書", "食品が衛生的に作られたことを、日本の公的な機関が証明する書類です。動物性の食品や、一部の国向けの食品で求められます。発行する機関は、品目と国で違います（農林水産省・地方厚生局・都道府県・保健所 など）。" + (dv("HC_FOOD").ld ? "準備の目安：約" + dv("HC_FOOD").ld + "日（アプリの書類の表の値・要確認）。" : ""), "A document in which a Japanese public body certifies that the food was produced hygienically. Required for foods of animal origin and for foods to some countries. The issuing body depends on the product and country." + tailEn("HC_FOOD", ""));
            add("自由販売証明書", "その商品が日本で適法に作られ、自由に売られていることを、日本の公的な機関が証明する書類です。相手国での製品の登録や輸入の手続きで求められることがあります。発行する機関は、食品・化粧品・医療機器で違います（農林水産省・厚生労働省 など・要確認）。", "A document in which a Japanese public body certifies that the product is lawfully made and freely sold in Japan. It may be requested for product registration or import procedures in the destination. The issuing body differs for food, cosmetics and medical devices (please confirm).");
            try {
                if (typeof v54rDesc === "function")
                    ["ISO13485証明書", "滅菌証明書（該当品）"].forEach(nm => {
                        const d0 = String(v54rDesc(nm, "") || "");
                        if (d0 && !GL[nm] && !/^この国の通関・出荷で使う書類です/.test(d0) && d0.indexOf('"') < 0)
                            GL[nm] = d0;
                    });
            }
            catch (e) { }
            add(NM_CFS, "相手国での登録・輸入の手続きで求められることがある、医療機器の輸出用の証明書（自由販売証明）です。" + tail("FSC_MD"), "An export certificate for medical devices (Certificate of Free Sale) that may be requested for registration or import procedures in the destination." + tailEn("FSC_MD", "Ministry of Health, Labour and Welfare"));
        }
    }
    catch (e) {
        warn("gl", e);
    }
    if (typeof v90regEvOpen === "function") {
        const __eo92 = v90regEvOpen;
        v90regEvOpen = function (c, nm) {
            const r = __eo92.apply(this, arguments);
            try {
                if (!/COLA/i.test(String(nm || ""))) {
                    const short = String(nm || "").replace(/（[^）]*）/g, "").trim().slice(0, 24);
                    const m = document.getElementById("v90regEvMemo"), dc = document.getElementById("v90regEvDoc");
                    if (m)
                        m.setAttribute("placeholder", M(`例：輸入者の担当に確認。「${short}」の登録（届出）の番号を受け取った`, `e.g. Confirmed with the importer; received the registration/notification number for “${short}”`));
                    if (dc)
                        dc.setAttribute("placeholder", M("例：登録番号・受理番号／届出の控え／試験の成績書の番号", "e.g. registration or receipt number / copy of the notification / test report number"));
                }
            }
            catch (e) { }
            return r;
        };
    }
    if (typeof ctyRiskLocal === "function") {
        const __cr92 = ctyRiskLocal;
        ctyRiskLocal = function () {
            let s = __cr92.apply(this, arguments);
            try {
                if (typeof s === "string" && !kind(P()).food)
                    s = s.replace("・茶・コーヒー・香辛料などは対象外の可能性", "");
            }
            catch (e) { }
            return s;
        };
    }
    if (typeof v54rAnsAdd === "function") {
        const __aa92 = v54rAnsAdd;
        v54rAnsAdd = function () {
            let a = __aa92.apply(this, arguments);
            try {
                if (typeof a === "string" && typeof V54R_US_MORE !== "undefined" && !kind(P()).food)
                    a = a.split(V54R_US_MORE).join(US_MORE_NF);
            }
            catch (e) { }
            return a;
        };
    }
    if (typeof ansComp === "function") {
        const __ac92 = ansComp;
        ansComp = function () {
            const res = __ac92.apply(this, arguments);
            try {
                const d = dd();
                const regs = (d && d.regs) || {};
                const ks = Object.keys(regs);
                const noTpl = !ks.length || ks.every(c => /ひな形は、アプリにまだありません/.test(String((regs[c] && regs[c].warn) || "")));
                if (res && typeof res.a === "string" && noTpl)
                    res.a = res.a.replace("この内容を各国の規制と突き合わせて、参入できるかどうかを判定しています。", "この内容は、各国の規制と突き合わせるための材料です。この商材は、規制のひな形がアプリにまだ無いため、参入できるかどうかの判定はまだしていません。「規制を調べる」の「この商品と送り先で確かめる点」と、AI の詳細調査で確かめてください。");
            }
            catch (e) { }
            return res;
        };
        dict([["この内容は、各国の規制と突き合わせるための材料です。この商材は、規制のひな形がアプリにまだ無いため、参入できるかどうかの判定はまだしていません。「規制を調べる」の「この商品と送り先で確かめる点」と、AI の詳細調査で確かめてください。",
                "This information is the input for checking against each country's regulations. The app has no regulation template for this product category yet, so market-entry feasibility has not been judged. See “Points to check for this product and destination” under “Check regulations”, and the AI research."]]);
    }
    if (typeof buildShip === "function") {
        const __bs92 = buildShip;
        buildShip = function (d, t) {
            const S = __bs92.apply(this, arguments);
            try {
                if (S && t && (t.src === "upload" || t.src === "sample2") && typeof S.no === "string") {
                    const pre = String(t.sku || "NEW").slice(0, 6).toUpperCase();
                    const old = pre + "-2608-01";
                    if (S.no === old) {
                        const pre2 = pre.replace(/[^0-9A-Z]+$/, "").replace(/[^0-9A-Z]+/g, "-") || "NEW";
                        let ym = "";
                        try {
                            const b = t._born ? new Date(+t._born) : null;
                            if (b && !isNaN(b.getTime()))
                                ym = String(b.getFullYear()).slice(2) + String(b.getMonth() + 1).padStart(2, "0");
                        }
                        catch (e) { }
                        if (!ym)
                            ym = "2608";
                        const neu = pre2 + "-" + ym + "-01";
                        let used = false;
                        try {
                            used = !!(t.shipSeed && t.shipSeed.no === old) || !!(t.v85docs && t.v85docs.cases && t.v85docs.cases[old]) || JSON.stringify([t.shipCases || null, t.poCases || null]).indexOf(old) >= 0 ||
                                !!(typeof FWDB !== "undefined" && FWDB && Array.isArray(FWDB.reqs) && FWDB.reqs.some((q) => q && q.caseNo === old));
                        }
                        catch (e) {
                            used = true;
                        }
                        if (neu !== old && !used)
                            S.no = neu;
                    }
                }
            }
            catch (e) {
                warn("ship", e);
            }
            try {
                if (S && Array.isArray(S.docs) && S.docs.length) {
                    const K = kind(t), c = S.country;
                    S.docs = S.docs.filter((x) => {
                        if (!Array.isArray(x))
                            return true;
                        const why = condWhy(x[0], c, K);
                        if (!why)
                            return true;
                        const v = condGet(c, x[0], t);
                        if (v === "n")
                            return false;
                        if (v !== "y" && String(x[2] || "").indexOf("【該当するときだけ】") < 0)
                            x[2] = "【該当するときだけ】" + why + (x[2] ? " " + x[2] : "");
                        return true;
                    });
                }
            }
            catch (e) {
                warn("shipdocs", e);
            }
            return S;
        };
    }
    const SMP_NM = { "Harbor Fine Foods Trading": "Harbor Bridge Trading", "Umami Online Market": "Kumo Online Market", "Pacific Gourmet Importers": "Pacific Select Importers", "Tokyo Taste Partners": "Tokyo Link Partners" };
    if (typeof v71obSample === "function") {
        const __os92 = v71obSample;
        v71obSample = function () {
            const out = __os92.apply(this, arguments);
            try {
                const K = kind(P());
                if (Array.isArray(out) && !K.food && K.ck !== "liquor")
                    out.forEach((x) => {
                        if (!x || !x.smp)
                            return;
                        const nm0 = String(x.name || "").replace(/^\[見本\]\s*/, "");
                        const nm = SMP_NM[nm0];
                        if (!nm)
                            return;
                        const slug = nm.toLowerCase().replace(/[^a-z]+/g, "-");
                        x.name = "[見本] " + nm;
                        x.url = "https://" + slug + ".example.com/";
                        x.contact = "info@" + slug + ".example.com";
                    });
            }
            catch (e) { }
            return out;
        };
    }
})();
