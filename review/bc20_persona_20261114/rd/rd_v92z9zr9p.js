/* 貿易クラウドAI商社マン 21.94 r9p の刷新版の層（いちばん後ろに読む）
   読み込みの仕組みの直し（RDX.after を読み込みの間は止めて最後に1回・見張りの空回りを飛ばす・「読み込み中」の表示）は
   rd_v92r9pboot.js（いちばん前に読む）と build.py（CSS・JS を1本ずつにまとめる）にある。ここは、読み込みのあとも止まらない描き直しの直し。
   ① 案件一覧ほかのボタンの data-kfull（rd_case.js の shortBtns の「済み」の印）が、1.5 秒おき（と RDX.after のたび）に同じ値で書き直され続けていた（8820 も同じ）。
      shortBtns は「印がある（中身が空でない）ボタンは飛ばす」形だが、縮めなかったボタンには空の印（""）を付けるため、毎回やり直しになる
      （getClientRects で配置の計算をさせ、属性を書き直す。1回 約100か所・CPU 1/4 で 1 回 約36ms。DOM の変化の知らせが 1秒に約100件）。
      直し：shortBtns が空の印を付けたら、中身を空白1文字にする（次からは「済み」として飛ばされる）。data-kfull の中身を読む所は無い
            （title は別に付く。CSS・ほかの層・本体は data-kfull の中身を読まない）。縮めたボタン（全文が入る）・ほかの層が付けた印はそのまま。
            ボタンの文字があとから書き換わったとき（右上の「次は」など、同じボタンの文言が変わる）は、印を空に戻して、shortBtns にもう一度見させる
            （今までどおり「次は：商品を登録（足りない情報を埋める）」→「次は：商品を登録」と縮む）。 */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92r9p) return;
  RD._v92r9p = 1;
  const S = (window.__rd92r9p = { kfull: 0, reset: 0 });
  const DONE = " ";
  const SEL = '[data-kfull=" "]';
  try {
    // shortBtns が付けた空の印 → 「済み」の印（自分が空に戻した分＝前の値が「済み」のものは、そのままにして shortBtns に見させる）
    const mo = new MutationObserver((recs) => {
      // 1回の知らせの中に同じボタンの変化が続けて入ることがある（自分の書き換え → 空に戻した分 など）。ボタンごとに、いちばん後ろの変化だけを見る：
      // 今の値が空で、その変化の前の値が「済み」でない（＝空に戻した分ではなく、shortBtns が付けた空の印）ときだけ「済み」にする
      const last = new Map();
      for (let i = 0; i < recs.length; i++) if (recs[i].target && recs[i].target.nodeType === 1) last.set(recs[i].target, recs[i].oldValue);
      last.forEach((old, t) => {
        if (old === DONE) return;
        if (t.getAttribute("data-kfull") === "") { t.setAttribute("data-kfull", DONE); S.kfull++; }
      });
    });
    mo.observe(document.body || document.documentElement, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ["data-kfull"] });
    // 「済み」のボタンの中の文字が変わったら、印を空に戻す
    const mo2 = new MutationObserver((recs) => {
      for (let i = 0; i < recs.length; i++) {
        let t = recs[i].target;
        if (t && t.nodeType !== 1) t = t.parentElement;
        const b = t && t.closest ? t.closest(SEL) : null;
        if (b) { b.setAttribute("data-kfull", ""); S.reset++; }
      }
    });
    mo2.observe(document.body || document.documentElement, { subtree: true, childList: true, characterData: true });
  } catch (e) { /* 無視 */ }
})();
