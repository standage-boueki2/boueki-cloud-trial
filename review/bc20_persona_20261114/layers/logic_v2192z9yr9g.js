(function () {
    const W = window;
    if (W.__v2192r9g)
        return;
    W.__v2192r9g = 1;
    const warn = (w, e) => { try {
        console.warn("[r9g] " + w, e);
    }
    catch (x) { } };
    const E = (s) => { try {
        return typeof esc === "function" ? esc(s) : String(s);
    }
    catch (e) {
        return String(s);
    } };
    const PRO = () => { try {
        return typeof GROW_PRO !== "undefined" ? +GROW_PRO || 90 : 90;
    }
    catch (e) {
        return 90;
    } };
    const isJa = () => { try {
        return typeof I18N === "undefined" || !I18N || !I18N.lang || I18N.lang === "ja";
    }
    catch (e) {
        return true;
    } };
    const COL = (k) => { try {
        return (typeof GROW_COL !== "undefined" && GROW_COL && GROW_COL[k]) || "var(--or)";
    }
    catch (e) {
        return "var(--or)";
    } };
    const R = 50, C = 2 * Math.PI * R;
    const ringSvg = (L) => {
        const cats = Array.isArray(L && L.cats) ? L.cats : [];
        const pct = Math.max(0, Math.min(100, +L.pct || 0));
        const raw = cats.map((c) => Math.max(0, (+c.pct || 0) * (+c.w || 0) / 100));
        const sum = raw.reduce((a, b) => a + b, 0);
        const k = sum > 0 ? pct / sum : 0;
        let off = 0;
        const gap = 0.9;
        const segs = cats.map((c, i) => {
            const len = C * raw[i] * k / 100;
            const fill = Math.max(0, len > gap * 2 ? len - gap : len);
            const s = `<circle class="gseg fg" data-k="${E(c.k)}" cx="60" cy="60" r="${R}" style="stroke:${COL(c.k)}" stroke-dasharray="0 ${C.toFixed(2)}" data-fill="${fill.toFixed(2)}" data-rest="${(C - fill).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}"><title>${E(c.nm)} ${E(c.pct)}%（${E(c.w)}点満点）</title></circle>`;
            off += len;
            return s;
        }).join("");
        const a = (PRO() / 100 * 360 - 90) * Math.PI / 180;
        const x = (r) => (60 + r * Math.cos(a)).toFixed(2);
        const y = (r) => (60 + r * Math.sin(a)).toFixed(2);
        const r1 = 42.5, r2 = 57.5;
        const mark = `<g class="g9mk"><line class="g9mkh" x1="${x(r1)}" y1="${y(r1)}" x2="${x(r2)}" y2="${y(r2)}"/><line class="gmark" x1="${x(r1)}" y1="${y(r1)}" x2="${x(r2)}" y2="${y(r2)}"/></g>`;
        return `<svg viewBox="0 0 120 120" role="img" aria-label="AI商社マンの成長レベル ${E(L.pct)}%">
      <circle class="g9hole" cx="60" cy="60" r="44.6"/><circle class="gseg bg g9trk" cx="60" cy="60" r="${R}"/>
      <g transform="rotate(-90 60 60)">${segs}</g>${mark}</svg>`;
    };
    const fixCard = (h) => {
        if (h.indexOf('class="g2ring"') < 0 || h.indexOf("g9trk") >= 0)
            return h;
        let L = null;
        try {
            L = typeof aiLevel === "function" ? aiLevel() : null;
        }
        catch (e) {
            L = null;
        }
        if (!L || !Array.isArray(L.cats) || !L.cats.length)
            return h;
        h = h.replace(/(<div class="g2ring">)\s*<svg[\s\S]*?<\/svg>/, (m0, a0) => a0 + ringSvg(L));
        if (isJa())
            h = h.replace(/^(\s*<div class="c grow")/, '$1 lang="ja"');
        return h;
    };
    if (typeof aiLevelCard === "function") {
        const __alc9g = aiLevelCard;
        aiLevelCard = function () {
            const h = __alc9g.apply(this, arguments);
            try {
                return fixCard(String(h || ""));
            }
            catch (e) {
                warn("card", e);
                return h;
            }
        };
    }
    const unpin = () => {
        try {
            const min = innerWidth <= 820 ? 13 : 12;
            document.querySelectorAll("#well .c.grow .g2ctr, #well .c.grow .g2ctr *").forEach((el) => {
                if (el.style && el.style.getPropertyValue("font-size"))
                    el.style.removeProperty("font-size");
                el.__fl19 = min;
            });
        }
        catch (e) { }
    };
    if (typeof ux19Floor === "function") {
        const __fl9g = ux19Floor;
        ux19Floor = function () {
            const r = __fl9g.apply(this, arguments);
            unpin();
            return r;
        };
    }
    try {
        if (!document.getElementById("v2192r9gcss")) {
            const st = document.createElement("style");
            st.id = "v2192r9gcss";
            st.textContent = `
#well .c.grow .growwrap{align-items:stretch}
#well .c.grow .g2hero{container-name:g9hero;justify-content:flex-start!important;gap:20px!important;padding:24px 26px 20px}
#well .c.grow .g2top{--g9r:204px;--g9n:52px;--g9u:20px;--g9l:14px;flex:1 1 auto;display:grid!important;grid-template-columns:var(--g9r) minmax(0,1fr)!important;grid-template-rows:1fr auto auto auto 1fr auto!important;grid-template-areas:"fig ." "fig pri" "fig nx" "fig mk" "fig ." "go go"!important;column-gap:32px!important;row-gap:0!important;align-items:center!important;justify-items:stretch!important;text-align:left!important}
#well .c.grow .g2sec{display:contents}
#well .c.grow .g2sec > :not(.g2nx):not(.g2mk):not(.g2go){grid-column:1 / -1}
#well .c.grow .g2ring{grid-area:fig;align-self:center;justify-self:center;width:var(--g9r)!important;max-width:100%;height:auto;aspect-ratio:1/1}
#well .c.grow .g2ring svg{overflow:visible}
#well .c.grow .g9hole{fill:var(--surface,#fff)}
#well .c.grow .gseg.bg.g9trk{fill:none;stroke:rgba(248,149,29,.17);stroke-width:10}
#well .c.grow .gseg.fg{stroke-width:10;stroke-linecap:butt}
#well .c.grow .gseg.fg.hl{stroke-width:13}
#well .c.grow .g9mkh{stroke:var(--surface,#fff);stroke-width:5.4;stroke-linecap:round}
#well .c.grow .gmark{stroke:var(--ink);stroke-width:2.8;stroke-linecap:round}
#well .c.grow .g2ctr{position:absolute;inset:14%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center}
#well .c.grow .g2ctr b{font-size:var(--g9n)!important;line-height:1!important;font-weight:800;letter-spacing:-.02em;white-space:nowrap}
#well .c.grow .g2ctr b small{font-size:var(--g9u)!important;font-weight:700;margin-left:2px;letter-spacing:0}
#well .c.grow .g2ctr span{margin:0!important;font-size:var(--g9l)!important;line-height:1.25;font-weight:700;color:var(--ink-2);max-width:100%;overflow-wrap:anywhere}
#well .c.grow .g2pri{grid-area:pri;display:flex;flex-direction:column;align-items:flex-start;gap:10px;min-width:0}
#well .c.grow .g2stage{font-size:15px!important;line-height:1.4;padding:4px 14px!important;font-weight:800}
#well .c.grow .g2to{margin:0!important;font-size:26px!important;line-height:1.3!important;font-weight:800;color:var(--ink)}
#well .c.grow .g2nx{grid-area:nx;margin:8px 0 0!important;font-size:var(--fs-md,15px);line-height:1.55!important;color:var(--ink-2);padding:0!important;border:0!important}
#well .c.grow .g2mk{grid-area:mk;margin:10px 0 0!important;display:flex!important;align-items:center;justify-content:flex-start!important;gap:9px;font-size:13px;line-height:1.45;color:var(--ink-2)}
#well .c.grow .g2mk i{display:block!important;flex:none;width:5px;height:18px;margin:0!important;border-radius:3px;background:var(--ink);box-shadow:0 0 0 2px var(--surface,#fff);transform:rotate(-36deg)}
#well .c.grow .g2nx,#well .c.grow .g2mk span,#well .c.grow .g2gos,#well .c.grow .g2to{word-break:auto-phrase;text-wrap:pretty}
#well .c.grow .g2go{grid-area:go;margin:20px 0 0!important;padding:16px 0 0!important;border-top:1px solid rgba(248,149,29,.32)!important;display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;align-items:center!important;justify-content:flex-start!important;column-gap:16px!important;row-gap:8px!important;min-width:0}
#well .c.grow .g2gol{flex-basis:100%!important;font-size:13px;font-weight:800;letter-spacing:.04em;color:var(--or-deep)}
#well .c.grow .g2go .btn{max-width:100%;white-space:normal;text-align:left;font-size:15px;min-height:42px;padding:9px 18px}
#well .c.grow .g2gos{flex:1 1 220px;min-width:0;font-size:var(--fs-sm,13px);line-height:1.55;color:var(--ink-2)}
#well .c.grow .g2track{flex:none;gap:6px!important}
#well .c.grow .g2st{gap:4px}
#well .c.grow .growcats{gap:7px}
#well .c.grow .growcat > summary{padding-top:9px;padding-bottom:9px}
@container g9hero (min-width:600px){#well .c.grow .g2top{--g9r:220px;--g9n:56px;--g9u:22px;--g9l:15px;column-gap:36px!important}}
@container g9hero (max-width:519.98px){#well .c.grow .g2top{--g9r:184px;--g9n:48px;--g9u:18px;--g9l:14px;column-gap:26px!important}#well .c.grow .g2to{font-size:22px!important}#well .c.grow .g2stage{font-size:14px!important}}
@container g9hero (max-width:439.98px){#well .c.grow .g2top{--g9r:168px;--g9n:44px;--g9u:18px;--g9l:13px;column-gap:22px!important}#well .c.grow .g2to{font-size:20px!important}#well .c.grow .g2go .btn{font-size:14px}}
@container g9hero (max-width:399.98px){#well .c.grow .g2top{--g9r:144px;--g9n:36px;--g9u:15px;--g9l:13px;column-gap:18px!important}#well .c.grow .g2ctr{gap:2px}#well .c.grow .g2ctr span{line-height:1.15}#well .c.grow .g2stage{font-size:13px!important;padding:3px 12px!important}#well .c.grow .g2nx{font-size:14px}#well .c.grow .g2track{gap:4px!important}#well .c.grow .g2st b{font-size:13px}}
@container g9hero (max-width:339.98px){
 #well .c.grow .g2top{--g9r:184px;--g9n:48px;--g9u:18px;--g9l:14px;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto!important;grid-template-areas:"fig" "pri" "nx" "mk" "go"!important;justify-items:center!important;text-align:center!important}
 #well .c.grow .g2ring{margin-bottom:16px}
 #well .c.grow .g2sec > :not(.g2nx):not(.g2mk):not(.g2go){grid-column:1}
 #well .c.grow .g2pri{align-items:center}
 #well .c.grow .g2mk{justify-content:center!important}
 #well .c.grow .g2go{flex-direction:column!important;align-items:center!important;width:100%}
 #well .c.grow .g2go .btn{text-align:center}
 #well .c.grow .g2gos{flex:none;text-align:center}
 #well .c.grow .g2gol{flex-basis:auto!important}
 #well .c.grow .g2st em{padding:0 6px}
 #well .c.grow .g2track{gap:4px!important}
 #well .c.grow .g2st b{letter-spacing:-.03em}
}
@media (max-width:480px){#well .c.grow .g2hero{padding:20px 14px 18px}}
`;
            document.head.appendChild(st);
        }
    }
    catch (e) {
        warn("css", e);
    }
})();
