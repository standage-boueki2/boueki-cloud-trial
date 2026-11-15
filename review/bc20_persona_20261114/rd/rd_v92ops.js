/* 貿易クラウドAI商社マン 21.92 ops（刷新版の層・rd_v92per.js のあとに読む）
   2026-11-14 の「8カテゴリー×ペルソナ評価」の、規制を調べる（ops:reg）の刷新版だけの課題。
   ① 「商品に合わせて表を直しました」などの枠（.info の箱）が、枠ごと2行でたたまれ、3行目が枠の下端で半分だけ見えていた
      （長い説明文を2行でたたむ仕組みが、段落の入った箱にも当たっていた）→ 箱はたたまない（中の長い段落は、今までどおり段落ごとにたたむ）
   今のアプリの関数・刷新版の前の層は差し替えず、RDX.after を包む。国を切り替えたとき（#rO の中だけ描き直る）にも効くよう、#rO を見張る。 */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92ops) return;
  RD._v92ops = 1;
  const { $$ } = RD;
  // 段落や見出しを中に持つ箱か（＝文ではなく枠）
  const isBox = (el) => !!el.querySelector(":scope > p, :scope > b, :scope > ul, :scope > div");
  const drop = (el) => { if (el && el.parentNode) el.parentNode.removeChild(el); };
  function unclamp(root) {
    $$(".info", root).forEach((el) => {
      if (el.closest(".rd-x") || !isBox(el)) return;
      // これからたたまれないように印を付け、もうたたまれていたら戻す
      el.dataset.rdcl = "1";
      el.classList.add("k-v92open");
      if (el.style.overflow === "hidden" || (el.style.webkitLineClamp && el.style.webkitLineClamp !== "unset")) {
        el.style.webkitLineClamp = "unset"; el.style.display = "block"; el.style.overflow = "visible";
      }
      const nx = el.nextElementSibling;
      if (nx && nx.classList.contains("rd-more")) drop(nx);
    });
  }
  function apply() {
    if (RD.locked && RD.locked()) return;
    if (RD.curKey() !== "ops:reg") return;
    const box = document.getElementById("rO");
    if (!box) return;
    unclamp(box);
    if (!box._v92mo) {
      box._v92mo = new MutationObserver(() => { try { unclamp(box); } catch (e) { /* 次の描き直しで */ } });
      box._v92mo.observe(box, { childList: true });
    }
  }
  const prev = RD.after;
  RD.after = function () {
    try { apply(); } catch (e) { console.error("[rd v92ops]", e); } // たたむ前に印を付ける
    const r = prev.apply(this, arguments);
    try { apply(); } catch (e) { console.error("[rd v92ops]", e); }
    return r;
  };
  try { apply(); } catch (e) { /* 最初の描画の前 */ }
})();
