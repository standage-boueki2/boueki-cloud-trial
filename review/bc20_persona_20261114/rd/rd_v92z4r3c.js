/* 貿易クラウドAI商社マン 21.92 r3c（刷新版の層・いちばん後ろに読む）：多言語の残り（xi18n-73）
   左メニューの札・上の帯のボタンのツールチップ（title・aria-label）は、刷新版の層が描き直すたびに日本語で付け直す
   （例：「要対応 5件（相手の返信に、まだ返していない案件。…）」「文字の大きさ（表示の密度）：標準」）。
   辞書の当て込みのあとで付け直されるので、英語・中国語・スペイン語でも日本語のまま残っていた。
   → RDX.after（描き直しのたびに呼ばれる）のいちばん最後で、左メニューと上の帯の属性だけを、いまの辞書（i18nStr）に通す。
   日本語の画面では何もしない。今の関数は差し替えず、RDX.after を包むだけ。 */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD.__v92r3c) return;
  RD.__v92r3c = 1;
  const JP = /[ぁ-ゖァ-ヺ一-鿿々]/;
  const miss = Object.create(null);
  let nMiss = 0;
  function fix() {
    if (typeof I18N === "undefined" || !I18N || I18N.lang === "ja" || typeof i18nStr !== "function") return;
    const d = I18N.dict && I18N.dict[I18N.lang];
    if (!d) return;
    const els = document.querySelectorAll("#rdside [title], #rdside [aria-label], .bar [title], .bar [aria-label], .k-top [title], .k-top [aria-label]");
    for (let i = 0; i < els.length && i < 400; i++) {
      const e = els[i];
      for (const a of ["title", "aria-label"]) {
        const v = e.getAttribute(a);
        if (!v || !JP.test(v)) continue;
        const mk = I18N.lang + "\u0001" + v;
        if (miss[mk]) continue;
        let t = null;
        try { t = i18nStr(v, d); } catch (err) { t = null; }
        if (t == null || t === v) { if (nMiss < 3000) { miss[mk] = 1; nMiss++; } continue; }
        try {
          const o = I18N.attr.get(e) || {};
          o[a] = v;
          I18N.attr.set(e, o);
        } catch (err) { }
        e.setAttribute(a, t);
      }
    }
  }
  const prev = RD.after;
  RD.after = function () {
    const r = typeof prev === "function" ? prev.apply(this, arguments) : undefined;
    try { fix(); } catch (e) { }
    return r;
  };
})();
