/* 21.94 r9g：AI商社マンの画面の「成長レベル」の箱（円グラフと周りの表示）の釣り合いを直す（利用者の指摘 2026-11-16・画像 1.png）
   見た目だけを変える。数字（%・点・段階）・文言・ボタンの動きは変えない。今の版（本体だけ）と刷新版の両方で起きていたので本体の層で直す。
   原因（どれもこの作業の層より前から。21.91〔8801〕・21.93〔8820〕・本体だけ〔8803〕で同じ）：
   ① 21.90 の目標の層（v90goalGrowSm が #well に .v90g-aiw を付け、#v90gcss が
      `.v90g-aiw .c.grow .g2top{grid-template-columns:clamp(110px,22cqi,140px) minmax(0,1fr)!important}`）で、AI商社マンの画面だけ
      円グラフの列を 110〜140px に縮めた（箱は 645px）。!important のため、390 幅では本体の「1列に積む」指定（@container max-width:379.98px）
      より勝ち、文字の列が 110px に押し込まれて1行2〜6文字で折り返していた。
   ② 本体の文字の下限の層（ux19Floor・v37）が、円の中の数字の大きさ（本体の clamp(36px,22cqi,60px)＝輪の幅に比例）を、輪が縮む前の
      幅で計った値（55〜59px）に丸めて style 属性に !important で固定する → 131px の輪の中に 55px の数字 → 「32」が輪からはみ出し、
      「%」「成長レベル」（13px に固定）が輪の線にかかる。
   ③ 一人前ラインの印（.gmark）は半径 42〜58 の細い線で、輪の帯（45〜55）より外へ出る → 「針」に見える。しかも輪は分野ごとの区画
      （区画の長さ＝配点）の中を塗る形なので、90% の位置（最後の区画の中）に意味がなかった。
   ④ 左の箱（.g2hero）は右の 6分野の高さまで伸び、中身を縦の真ん中に置く（justify-content:center）＋輪が小さい → 上下に大きな空き。
      文字の列（段階・あと何点・次の段階・凡例・次の一手・ボタン・説明）が輪の横の細い列に全部入り、詰まって見えた。
   直し：
   (1) 輪を「積み上げの進み具合」で描き直す：12時から時計回りに、分野ごとの点（分野の点の合計＝成長レベルの %）を分野の色で続けて塗る。
       残りは薄い帯、内側は白い円。一人前ライン（90%）の位置に、輪の帯をまたぐ短い印（濃紺の太い棒・白い縁。凡例の印と同じ色・形・向き）。
       分野ごとの data-k・data-fill・data-rest・<title> は残す（伸びる動き〔growAnimate〕・分野にカーソルを当てたときの強調・
       v73 の描き直し〔v73dashGrowLive〕がそのまま動く）。
   (2) 並べ方を CSS で決め直す（#v2192r9gcss。.g2sec を display:contents にして、中の行を1つずつ置く）：
       上の段＝輪｜段階・あと何点・次の段階・凡例（輪と縦の真ん中でそろえる）、その下に箱の幅いっぱいで「いちばん伸びる次の一手」と
       ボタン、いちばん下に5段階の帯。輪の大きさは箱の幅で段階に（220/204/184/168/148px、スマホは 184px で上に置いて中央そろえ）、
       円の中の数字も輪に合わせて段階に（整数の px なので ux19Floor は固定しない）。右の6分野は少しだけ詰める（左の箱と高さをそろえる）。
   (3) ux19Floor を包み、円の中の数字・%・「成長レベル」に付いた固定の大きさ（style 属性）を外す（前の描画で付いたものも）。 */
declare let aiLevelCard: any, ux19Floor: any;
declare const aiLevel: any, GROW_COL: any, GROW_PRO: any, esc: any, I18N: any;
(function () {
    const W: any = window;
    if (W.__v2192r9g) return;
    W.__v2192r9g = 1;
    const warn = (w: string, e: any) => { try { console.warn("[r9g] " + w, e); } catch (x) { } };
    const E = (s: any) => { try { return typeof esc === "function" ? esc(s) : String(s); } catch (e) { return String(s); } };
    const PRO = () => { try { return typeof GROW_PRO !== "undefined" ? +GROW_PRO || 90 : 90; } catch (e) { return 90; } };
    const isJa = () => { try { return typeof I18N === "undefined" || !I18N || !I18N.lang || I18N.lang === "ja"; } catch (e) { return true; } };
    const COL = (k: string) => { try { return (typeof GROW_COL !== "undefined" && GROW_COL && GROW_COL[k]) || "var(--or)"; } catch (e) { return "var(--or)"; } };

    /* ── (1) 輪：積み上げの進み具合 ── */
    const R = 50, C = 2 * Math.PI * R;
    const ringSvg = (L: any): string => {
        const cats: any[] = Array.isArray(L && L.cats) ? L.cats : [];
        const pct = Math.max(0, Math.min(100, +L.pct || 0));
        const raw = cats.map((c: any) => Math.max(0, (+c.pct || 0) * (+c.w || 0) / 100));
        const sum = raw.reduce((a: number, b: number) => a + b, 0);
        const k = sum > 0 ? pct / sum : 0; // 分野の点の合計を、表示の % にそろえる（丸めの差だけ）
        let off = 0;
        const gap = 0.9; // 分野の切れ目（輪の単位）
        const segs = cats.map((c: any, i: number) => {
            const len = C * raw[i] * k / 100;
            const fill = Math.max(0, len > gap * 2 ? len - gap : len);
            const s = `<circle class="gseg fg" data-k="${E(c.k)}" cx="60" cy="60" r="${R}" style="stroke:${COL(c.k)}" stroke-dasharray="0 ${C.toFixed(2)}" data-fill="${fill.toFixed(2)}" data-rest="${(C - fill).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}"><title>${E(c.nm)} ${E(c.pct)}%（${E(c.w)}点満点）</title></circle>`;
            off += len;
            return s;
        }).join("");
        const a = (PRO() / 100 * 360 - 90) * Math.PI / 180;
        const x = (r: number) => (60 + r * Math.cos(a)).toFixed(2);
        const y = (r: number) => (60 + r * Math.sin(a)).toFixed(2);
        const r1 = 42.5, r2 = 57.5;
        const mark = `<g class="g9mk"><line class="g9mkh" x1="${x(r1)}" y1="${y(r1)}" x2="${x(r2)}" y2="${y(r2)}"/><line class="gmark" x1="${x(r1)}" y1="${y(r1)}" x2="${x(r2)}" y2="${y(r2)}"/></g>`;
        return `<svg viewBox="0 0 120 120" role="img" aria-label="AI商社マンの成長レベル ${E(L.pct)}%">
      <circle class="g9hole" cx="60" cy="60" r="44.6"/><circle class="gseg bg g9trk" cx="60" cy="60" r="${R}"/>
      <g transform="rotate(-90 60 60)">${segs}</g>${mark}</svg>`;
    };
    const fixCard = (h: string): string => {
        if (h.indexOf('class="g2ring"') < 0 || h.indexOf("g9trk") >= 0) return h;
        let L: any = null;
        try { L = typeof aiLevel === "function" ? aiLevel() : null; } catch (e) { L = null; }
        if (!L || !Array.isArray(L.cats) || !L.cats.length) return h;
        h = h.replace(/(<div class="g2ring">)\s*<svg[\s\S]*?<\/svg>/, (m0: string, a0: string) => a0 + ringSvg(L));
        // 日本語の画面では、この箱に lang="ja" を付ける（ページの <html> に lang が無いため。文節で折り返す word-break:auto-phrase が効く
        // →「一人前に到達しま／した」「あと／18点」のような切れ方をしない）。ほかの言語では付けない
        if (isJa()) h = h.replace(/^(\s*<div class="c grow")/, '$1 lang="ja"');
        return h;
    };
    if (typeof aiLevelCard === "function") {
        const __alc9g = aiLevelCard;
        aiLevelCard = function (this: any) {
            const h = __alc9g.apply(this, arguments as any);
            try { return fixCard(String(h || "")); } catch (e) { warn("card", e); return h; }
        };
    }

    /* ── (3) 円の中の文字の固定の大きさを外す ── */
    const unpin = () => {
        try {
            const min = innerWidth <= 820 ? 13 : 12;
            document.querySelectorAll("#well .c.grow .g2ctr, #well .c.grow .g2ctr *").forEach((el: any) => {
                if (el.style && el.style.getPropertyValue("font-size")) el.style.removeProperty("font-size");
                el.__fl19 = min;
            });
        } catch (e) { }
    };
    if (typeof ux19Floor === "function") {
        const __fl9g = ux19Floor;
        ux19Floor = function (this: any) {
            const r = __fl9g.apply(this, arguments as any);
            unpin();
            return r;
        };
    }

    /* ── (2) 並べ方 ── */
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
    } catch (e) { warn("css", e); }
})();
