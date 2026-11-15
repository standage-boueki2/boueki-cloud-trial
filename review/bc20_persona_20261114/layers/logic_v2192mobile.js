(function () {
    const W = window;
    if (W.__v2192mobile)
        return;
    W.__v2192mobile = 1;
    const MQ = (q) => { try {
        return !!(W.matchMedia && W.matchMedia(q).matches);
    }
    catch (e) {
        return false;
    } };
    const isM = () => MQ("(max-width:820px)");
    const isS = () => MQ("(max-width:560px)");
    const isJa = () => { try {
        return typeof I18N === "undefined" || !I18N || !I18N.lang || I18N.lang === "ja";
    }
    catch (e) {
        return true;
    } };
    const M4 = (ja, en, zh, es) => { let l = "ja"; try {
        l = (typeof I18N !== "undefined" && I18N && I18N.lang) || "ja";
    }
    catch (e) { } return l === "en" ? en : l === "zh" ? zh : l === "es" ? es : ja; };
    const $ = (s, r) => (r || document).querySelector(s);
    const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
    try {
        const st = document.createElement("style");
        st.id = "v2192mobile-css";
        st.textContent = [
            ".v92mnw{white-space:nowrap!important}",
            "table.b30tbl td.nm{min-width:132px}",
            "@media (min-width:821px) and (max-width:1366px){#well table.b30tbl th,#well table.b30tbl td{padding-left:8px!important;padding-right:8px!important}}",
            "@media (min-width:821px) and (max-width:1366px){",
            "#well table.ux32inbox th,#well table.ux32inbox td{padding-left:6px!important;padding-right:6px!important}",
            "#well table.ux32inbox td:nth-child(1){white-space:normal!important;min-width:0!important;width:5.4em}",
            "#well table.ux32inbox td:nth-child(3){min-width:6.8em!important}",
            "#well table.ux32inbox td:nth-child(4){min-width:8.2em!important}",
            "#well table.ux32inbox td:nth-child(5){min-width:8em!important}",
            "#well table.ux32inbox td:nth-child(6){min-width:6em!important}",
            "#well table.ux32inbox td:nth-child(9) .btn{padding-left:8px!important;padding-right:8px!important}",
            "}",
            "@media (max-width:820px){",
            'table.ux32inbox tr{grid-template-columns:minmax(0,1fr) auto!important;grid-template-areas:"no st" "co co" "rt rt" "cg cg" "qt qt" "dt dt" "bt bt" "ng ng"!important}',
            "table.ux32inbox td:nth-child(9){grid-area:ng}",
            "table.ux32inbox td:nth-child(2){white-space:nowrap!important}",
            "table.ux32inbox td.v33fwst .btn{font-size:13px!important;min-height:36px}",
            "#well span.src{white-space:normal!important;overflow-wrap:anywhere;word-break:break-all;max-width:100%;min-width:0;box-sizing:border-box}",
            "#dw[data-open=\"true\"] .pn:not(.dwr) > .cl{position:fixed!important;top:8px!important;right:10px!important;z-index:8;background:var(--surface,#fff);border-radius:50%;box-shadow:0 1px 5px rgba(20,26,34,.22)}",
            "#dw .pn > .cl{min-width:40px;min-height:40px}",
            "#well .b30star,#well .v33sigb,#well .v33tab,#well .v33sigf{min-height:36px;min-width:36px}",
            "#well table input[type=checkbox]{width:22px;height:22px}",
            "#well .v40gb{min-height:38px}",
            "#well .b30sum button{min-height:38px}",
            "#well .lwpal button{min-width:34px;min-height:36px}",
            "#well td.v33selc input[type=checkbox]{width:26px;height:26px}",
            "#well .nn > a[data-onclick]{display:inline-block;padding-top:8px;padding-bottom:8px}",
            "#well summary{padding-top:5px;padding-bottom:5px}",
            ".v41net > *{min-width:0}",
            ".v41net select,.v41net .mapw{max-width:100%;box-sizing:border-box}",
            ".v92mhit{position:relative!important}",
            ".v92mhit::after{content:\"\";position:absolute;left:-10px;right:-10px;top:-8px;bottom:-8px}",
            "#uxtop.v92mhide{opacity:0!important;pointer-events:none!important}",
            "#uxtop{transition:opacity .18s}",
            ".composer.v92mcmin > :not(#mtext){display:none!important}",
            ".composer.v92mcmin > #mtext{height:46px!important;min-height:46px!important;max-height:46px!important;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding-top:11px!important;padding-bottom:9px!important}",
            ".v88prop.v92mfold > :not(.v88prop-h):not(.v88prop-t):not(.v92mfb){display:none!important}",
            ".v88prop.v92mfold .v88prop-t{font-size:15px!important;line-height:1.5;margin:4px 0 0!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
            ".v88prop .v92mfb{display:flex;align-items:center;justify-content:center;gap:4px;width:100%;min-height:38px;margin-top:6px;border:0;background:none;color:var(--bl,#1F6FD1);font:inherit;font-weight:700;font-size:13.5px;cursor:pointer}",
            "#welv{grid-template-columns:minmax(0,1fr)}",
            "#welv > .wc{min-width:0;max-width:100%;box-sizing:border-box}",
            "#well .th-row .th-t{white-space:normal!important;overflow:visible!important;overflow-wrap:anywhere}",
            "#pn .v92mpill{width:auto!important;min-width:30px;padding:0 8px!important;border-radius:999px!important;white-space:nowrap}",
            ".v1811c{position:relative}",
            ".v92mx{position:sticky;top:0;float:right;z-index:3;width:40px;height:40px;margin:-6px -6px 0 8px;border:1px solid var(--line,#d8dee8);border-radius:50%;background:var(--surface,#fff);color:var(--ink-2,#44546a);font-size:18px;line-height:1;cursor:pointer}",
            "}",
            "@media (min-width:821px){.v88prop .v92mfb,.v92mx{display:none!important}}",
            "@media (max-width:820px) and (pointer:coarse){",
            "#well input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=button]):not([type=submit]),#well select,#well textarea,#dw input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]),#dw select,#dw textarea{font-size:16px!important}",
            "}",
            "@media (max-width:560px){",
            '#dw div[style*="grid-template-columns:1fr 1fr"]{grid-template-columns:minmax(0,1fr)!important}',
            '#dw div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:minmax(0,1fr)!important}',
            "#dw .dwbody{overflow-x:hidden}",
            "table.v92mcards{display:block;min-width:0!important;width:100%!important}",
            "table.v92mcards thead{display:none}",
            "table.v92mcards tbody{display:block}",
            "table.v92mcards tr{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 10px;align-items:start;border:1px solid var(--line,#d8dee8);border-radius:12px;padding:10px 12px;margin:0 0 10px;background:var(--surface,#fff)}",
            "table.v92mcards td{display:block;border:0!important;padding:1px 0!important;text-align:left!important;min-width:0!important;white-space:normal!important}",
            "table.v92mcards td{background:transparent!important}",
            ".tw:has(> table.v92mcards){max-height:72vh!important}",
            "table.b30tbl td.nm{min-width:170px}",
            "table.v92mcards td:nth-child(1){grid-column:1;grid-row:1}",
            "table.v92mcards td:nth-child(2){grid-column:2;grid-row:1;text-align:right!important}",
            "table.v92mcards td:nth-child(n+3){grid-column:1/-1}",
            "table.v92mcards td:nth-child(3) br{display:none}",
            "table.v92mcards td:nth-child(3) .nn{margin-left:8px}",
            "table.v92mcards td[data-v92ml]:not(:empty)::before{content:attr(data-v92ml) \"：\";font-size:12.5px;color:var(--ink-3,#6b7a90);font-weight:700;margin-right:2px}",
            "table.v92mcards td:last-child .btn{min-height:40px;padding:6px 18px!important;width:100%}",
            "}",
            "#mapw .pin.v92mdot > span{display:none!important}",
            "#mapw .pin.v92mleft{flex-direction:row-reverse}",
            "#mapw .pin.v92mleft > span{position:absolute;right:100%;left:auto!important;margin-right:3px;white-space:nowrap}",
        ].join("\n");
        (document.head || document.documentElement).appendChild(st);
    }
    catch (e) { }
    try {
        if (typeof openDW === "function") {
            const __od92m = openDW;
            openDW = function () {
                const r = __od92m.apply(this, arguments);
                try {
                    const pn = document.getElementById("pn");
                    if (pn) {
                        pn.scrollTop = 0;
                        pn.scrollLeft = 0;
                    }
                }
                catch (e) { }
                try {
                    setTimeout(afterDraw, 0);
                }
                catch (e) { }
                return r;
            };
        }
    }
    catch (e) { }
    function markTables() {
        const well = document.getElementById("well");
        if (!well)
            return;
        $$("table", well).forEach((t) => {
            if (t.classList.contains("ux32inbox") || t.closest(".rd-x"))
                return;
            const rows = t.rows;
            if (!rows || rows.length > 400)
                return;
            for (let i = 0; i < rows.length; i++) {
                const cs = rows[i].cells;
                for (let j = 0; j < cs.length; j++) {
                    const c = cs[j];
                    if (c.__v92m === c.childNodes.length + ":" + (c.textContent || "").length)
                        continue;
                    c.__v92m = c.childNodes.length + ":" + (c.textContent || "").length;
                    const tx = (c.textContent || "").replace(/\s+/g, " ").trim();
                    const short = tx.length > 0 && tx.length <= 9 && !c.querySelector("button,input,select,textarea,br,div,p,ul");
                    c.classList.toggle("v92mnw", short);
                }
            }
        });
        const tb = document.getElementById("bmTb");
        const t = tb && tb.closest ? tb.closest("table") : null;
        if (t && !t.classList.contains("v92mcards"))
            t.classList.add("v92mcards");
        if (t) {
            const ths = $$("thead th", t).map((h) => (h.textContent || "").trim());
            $$("tbody tr", t).forEach((tr) => { const c3 = tr.cells[2], c4 = tr.cells[3]; if (c3 && ths[2] && !c3.getAttribute("data-v92ml"))
                c3.setAttribute("data-v92ml", ths[2]); if (c4 && ths[3] && !c4.getAttribute("data-v92ml"))
                c4.setAttribute("data-v92ml", ths[3]); });
        }
    }
    function markHits() {
        if (!isM())
            return;
        const well = document.getElementById("well");
        if (!well)
            return;
        $$("button,a", well).forEach((b) => {
            if (b.__v92h)
                return;
            b.__v92h = 1;
            const tx = (b.textContent || "").trim();
            if (tx === "✎" || tx === "☆" || tx === "★" || tx === "?" || tx === "？" || /^[👍🙏🎉❤️✓]+\s*\d*$/u.test(tx)) {
                try {
                    const cs = getComputedStyle(b);
                    if (cs.position === "static" && cs.overflow !== "hidden")
                        b.classList.add("v92mhit");
                }
                catch (e) { }
            }
        });
    }
    function compFix() {
        const c = $("#well .composer.fx19c") || $("#well .composer");
        if (!c)
            return;
        const ta = $("#mtext", c);
        if (!ta || ta.parentElement !== c)
            return;
        const want = isM() && !c.contains(document.activeElement) && !String(ta.value || "").trim() && !c.__v92open;
        if (c.classList.contains("v92mcmin") !== want)
            c.classList.toggle("v92mcmin", want);
    }
    try {
        document.addEventListener("focusin", (e) => { try {
            const c = e.target && e.target.closest && e.target.closest(".composer");
            if (c) {
                c.__v92open = 1;
                compFix();
            }
        }
        catch (x) { } });
        document.addEventListener("pointerdown", (e) => { try {
            const c = e.target && e.target.closest && e.target.closest(".composer.v92mcmin");
            if (c) {
                c.__v92open = 1;
                c.classList.remove("v92mcmin");
            }
            else {
                const o = $("#well .composer");
                if (o && !(e.target && e.target.closest && e.target.closest(".composer"))) {
                    o.__v92open = 0;
                    setTimeout(compFix, 250);
                }
            }
        }
        catch (x) { } }, true);
        document.addEventListener("focusout", () => { setTimeout(() => { try {
            const o = $("#well .composer");
            if (o && !o.contains(document.activeElement)) {
                o.__v92open = 0;
                compFix();
            }
        }
        catch (x) { } }, 300); });
    }
    catch (e) { }
    const COPY = [
        ["お手元のExcelをドラッグするだけ", "お手元のExcelなどの資料を選ぶだけ"],
        ["ここにファイルをドラッグ＆ドロップしてもアップロードできます", "ここを押してファイルを選んでもアップロードできます"],
        ["「ここにファイルをドラッグ＆ドロップ」に入れます（クリックして選んでも同じ。", "「ここを押してファイルを選ぶ」から入れます（"],
        ["ここにファイルをドラッグ＆ドロップ", "ここを押してファイルを選ぶ"],
        ["またはクリックしてファイルを選択", "押すとファイルを選べます"],
        ["資料をここにドロップ", "資料をここで選ぶ"],
        ["ここにドロップしてください（クリックして選ぶこともできます）", "ここを押して選んでください"],
        ["クリックして", "押して"], ["クリックで", "押すと"], ["クリックすると", "押すと"], ["をクリック", "を押す"],
    ];
    const copyStr = (v) => { let o = v; for (const [a, b] of COPY)
        if (o.indexOf(a) >= 0)
            o = o.split(a).join(b); return o; };
    const copyOn = () => isM() && MQ("(pointer:coarse)") && isJa();
    try {
        if (typeof toast === "function") {
            const __t92m = toast;
            toast = function (m) { try {
                if (typeof m === "string" && copyOn())
                    arguments[0] = copyStr(m);
            }
            catch (e) { } return __t92m.apply(this, arguments); };
        }
    }
    catch (e) { }
    function pillFix() {
        const pn = document.getElementById("pn");
        if (!pn)
            return;
        $$('span[style*="border-radius: 50%"],span[style*="border-radius:50%"]', pn).forEach((e) => { if (e.children.length === 0 && (e.textContent || "").trim().length >= 3 && e.scrollWidth > e.clientWidth + 1 && !e.classList.contains("v92mpill"))
            e.classList.add("v92mpill"); });
    }
    function copyFix() {
        if (!copyOn())
            return;
        [document.getElementById("well"), document.getElementById("welv"), document.getElementById("v1811ov")].forEach((box) => {
            if (!box)
                return;
            const tw = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
            let n;
            while ((n = tw.nextNode())) {
                const v = n.nodeValue || "";
                if (v.length < 4 || (v.indexOf("ドラッグ") < 0 && v.indexOf("ドロップ") < 0 && v.indexOf("クリック") < 0))
                    continue;
                const o = copyStr(v);
                if (o !== v)
                    n.nodeValue = o;
            }
        });
        $$("textarea[placeholder],input[placeholder]").forEach((el) => {
            const p = el.getAttribute("placeholder") || "";
            if (!/Enter|ドラッグ|ドロップ/.test(p))
                return;
            let q = p.replace(/[（(][^（）()]*(?:Enter|ドラッグ|ドロップ)[^（）()]*[）)]/g, "").replace(/[\s　]*(?:Enterで送信・Shift\+Enterで改行|Ctrl\+Enterで送信)[。]?/g, "").trim();
            if (!q)
                q = "ここに入力";
            if (q !== p) {
                el.setAttribute("placeholder", q);
                if (!el.getAttribute("data-v92ph"))
                    el.setAttribute("data-v92ph", p);
            }
        });
    }
    function firstRunFix() {
        if (!isM())
            return;
        const ov = document.getElementById("v1811ov");
        if (!ov)
            return;
        const box = $(".v1811c", ov);
        if (!box || $(".v92mx", box))
            return;
        const closer = $$("button", box).find((b) => /閉じる|Close|关闭|Cerrar/.test(b.textContent || ""));
        if (!closer)
            return;
        const x = document.createElement("button");
        x.type = "button";
        x.className = "v92mx";
        x.setAttribute("data-noi18n", "1");
        x.setAttribute("aria-label", M4("閉じる（このまま画面を見る）", "Close", "关闭", "Cerrar"));
        x.textContent = "×";
        x.addEventListener("click", () => { try {
            closer.click();
        }
        catch (e) { } });
        box.insertBefore(x, box.firstChild);
    }
    function mapFix() {
        const m = document.getElementById("mapw");
        if (!m)
            return;
        const mr = m.getBoundingClientRect();
        if (mr.width < 10)
            return;
        const pins = $$(".pin", m);
        pins.forEach((p) => { p.classList.remove("v92mdot"); p.classList.remove("v92mleft"); });
        const placed = [];
        pins.sort((a, b) => (b.classList.contains("o") ? 1 : 0) - (a.classList.contains("o") ? 1 : 0));
        pins.forEach((p) => {
            const s = p.querySelector("span");
            if (!s)
                return;
            if (!p.getAttribute("title"))
                p.setAttribute("title", (s.textContent || "").trim());
            let r = s.getBoundingClientRect();
            if (r.width < 1)
                return;
            if (r.right > mr.right - 2) {
                p.classList.add("v92mleft");
                r = s.getBoundingClientRect();
            }
            const hitFn = (x) => placed.some((q) => !(x.right < q.left - 1 || x.left > q.right + 1 || x.bottom < q.top + 2 || x.top > q.bottom - 2));
            let hit = hitFn(r);
            if (hit && !p.classList.contains("v92mleft")) {
                p.classList.add("v92mleft");
                const r2 = s.getBoundingClientRect();
                if (r2.left >= mr.left + 2 && !hitFn(r2)) {
                    r = r2;
                    hit = false;
                }
                else
                    p.classList.remove("v92mleft");
            }
            if (hit || r.left < mr.left)
                p.classList.add("v92mdot");
            else
                placed.push(r);
        });
    }
    try {
        const mapSoon = (e) => { try {
            if (e.target && e.target.closest && e.target.closest("#mapw")) {
                setTimeout(mapFix, 320);
                setTimeout(mapFix, 900);
            }
        }
        catch (x) { } };
        document.addEventListener("click", mapSoon, true);
        document.addEventListener("wheel", mapSoon, { passive: true, capture: true });
        document.addEventListener("pointerup", mapSoon, true);
    }
    catch (e) { }
    function propFix() {
        $$(".v88prop").forEach((c) => {
            if (c.__v92p)
                return;
            c.__v92p = 1;
            let open = false;
            try {
                open = sessionStorage.getItem("v92m_prop") === "1";
            }
            catch (e) { }
            const b = document.createElement("button");
            b.type = "button";
            b.className = "v92mfb";
            b.setAttribute("data-noi18n", "1");
            const lab = () => { const f = c.classList.contains("v92mfold"); b.textContent = f ? M4("くわしく見る ▾", "Show details ▾", "查看详情 ▾", "Ver detalles ▾") : M4("たたむ ▴", "Hide ▴", "收起 ▴", "Ocultar ▴"); b.setAttribute("aria-expanded", f ? "false" : "true"); };
            if (!open)
                c.classList.add("v92mfold");
            b.addEventListener("click", () => { c.classList.toggle("v92mfold"); try {
                sessionStorage.setItem("v92m_prop", c.classList.contains("v92mfold") ? "0" : "1");
            }
            catch (e) { } lab(); });
            lab();
            c.appendChild(b);
        });
    }
    let lastY = 0, upT = 0, upShown = false;
    function upCheck() {
        const b = document.getElementById("uxtop");
        if (!b)
            return;
        if (!isM()) {
            b.classList.remove("v92mhide");
            return;
        }
        let hide = !upShown;
        if (!hide) {
            try {
                const r = b.getBoundingClientRect();
                if (r.width > 0) {
                    const pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 3, r.top + 3], [r.right - 3, r.top + 3], [r.left + 3, r.bottom - 3], [r.right - 3, r.bottom - 3]];
                    for (const p of pts) {
                        const els = document.elementsFromPoint(p[0], p[1]) || [];
                        for (const el of els) {
                            if (el === b)
                                continue;
                            if (el.closest && el.closest("button,a[href],input,select,textarea,[role=button],[data-onclick],[data-act],summary,label,.composer")) {
                                hide = true;
                            }
                            break;
                        }
                        if (hide)
                            break;
                    }
                }
            }
            catch (e) { }
        }
        b.classList.toggle("v92mhide", hide);
    }
    try {
        addEventListener("scroll", () => {
            const y = W.scrollY || 0;
            if (y < lastY - 6) {
                upShown = true;
                clearTimeout(upT);
                upT = setTimeout(() => { upShown = false; upCheck(); }, 3500);
            }
            else if (y > lastY + 6)
                upShown = false;
            lastY = y;
            upCheck();
        }, { passive: true });
    }
    catch (e) { }
    try {
        document.addEventListener("click", (e) => {
            try {
                const t = e.target && e.target.closest && e.target.closest("#tabbar [data-tb]");
                if (!t)
                    return;
                const id = t.getAttribute("data-tb");
                if (id !== "reply" && id !== "appr")
                    return;
                const jump = (n) => {
                    try {
                        const tabs = $("#well .v33tabs");
                        if (tabs && (W.scrollY || 0) < 40) {
                            const y = tabs.getBoundingClientRect().top + (W.scrollY || 0) - 84;
                            if (y > 120)
                                W.scrollTo({ top: y });
                        }
                        else if (!tabs && n > 0)
                            setTimeout(() => jump(n - 1), 300);
                    }
                    catch (x) { }
                };
                setTimeout(() => jump(3), 450);
                setTimeout(() => jump(0), 1100);
            }
            catch (x) { }
        }, true);
    }
    catch (e) { }
    function afterDraw() {
        try {
            markTables();
        }
        catch (e) { }
        try {
            markHits();
        }
        catch (e) { }
        try {
            compFix();
        }
        catch (e) { }
        try {
            copyFix();
        }
        catch (e) { }
        try {
            firstRunFix();
        }
        catch (e) { }
        try {
            mapFix();
        }
        catch (e) { }
        try {
            propFix();
        }
        catch (e) { }
        try {
            pillFix();
        }
        catch (e) { }
        try {
            upCheck();
        }
        catch (e) { }
    }
    let adT = 0;
    const soon = () => { clearTimeout(adT); adT = setTimeout(afterDraw, 120); };
    try {
        if (typeof render === "function") {
            const __r92m = render;
            render = function () { const r = __r92m.apply(this, arguments); soon(); return r; };
        }
        if (typeof fwdRender === "function") {
            const __f92m = fwdRender;
            fwdRender = function () { const r = __f92m.apply(this, arguments); soon(); return r; };
        }
    }
    catch (e) { }
    try {
        const start = () => {
            try {
                const w = document.getElementById("well");
                if (w)
                    new MutationObserver(soon).observe(w, { childList: true, subtree: true });
                const pn = document.getElementById("pn");
                if (pn)
                    new MutationObserver(soon).observe(pn, { childList: true, subtree: true });
                new MutationObserver(() => { if (document.getElementById("v1811ov") || document.getElementById("welv") || document.querySelector(".v88prop"))
                    soon(); }).observe(document.body, { childList: true });
            }
            catch (e) { }
            soon();
        };
        if (document.readyState === "loading")
            document.addEventListener("DOMContentLoaded", start);
        else
            start();
        addEventListener("resize", soon);
    }
    catch (e) { }
})();
