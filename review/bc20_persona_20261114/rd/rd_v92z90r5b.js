/* 貿易クラウドAI商社マン 21.92 r5b の刷新版の層（いちばん後ろに読む）
   ① medical-Q03：入り直した直後に、案件一覧ではなく「こんばんは！」の前のホーム（「まずやること 3つのステップ」）が出ることがある
      原因：rd.js は読み込まれてすぐ 0.5 秒おきの見張りを始める。続きのセッション（鍵のかかっていない状態）では、後ろの rd の層
            （rd_case.js＝案件一覧 ほか約40本）が読み終わる前に見張りが動き、その時点にある部品だけでホームを仕上げてしまう
            （仕上げたホームは、描き直しまで組み直さない）。読み込みが遅いほど起きやすい
      直し：いちばん後ろのこの層が読まれた時点で、先に仕上げられた画面があれば、アプリの画面を1回描き直す（全部の層がそろった状態で仕上げ直す）
   ほかは下の各ブロックの頭に書く */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92r5b) return;
  RD._v92r5b = 1;
  const { $, $$ } = RD;
  const safe = (fn) => { try { return fn(); } catch (e) { return undefined; } };
  const A = () => window.v92r5b || {};
  const M = (ja, en, zh, es) => (A().M ? A().M(ja, en, zh, es) : ja);

  /* ① 先に仕上げられた画面の描き直し */
  const redo = () => {
    try {
      if (document.body.classList.contains("locked")) return false;
      const w = $("#well");
      if (!w || !$("[data-rdhero]", w)) return false; // まだ仕上げられていない（ふつうの順）
      if (typeof render !== "function") return false; // eslint-disable-line no-undef
      // 入力の途中・開いている窓があるときは触らない
      const ae = document.activeElement;
      if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && w.contains(ae)) return false;
      render(); // eslint-disable-line no-undef
      return true;
    } catch (e) { return false; }
  };
  RD._v92r5bEarly = redo() ? 1 : 0;
  // 念のため：描き直しのあとも前のホームが残っていたら（見張りの順のずれ）、もう1回だけ
  /* ② auto-Q02：案件一覧で、ステータスの札（見積提示 0 など）で絞ったあと「すべて」を押しても戻らない
        原因：「すべて」はタブの絞り込みだけを外し、ステータスの札の絞り込みは残る → 「すべて」を押したら、ステータスの札も外す */
  document.addEventListener("click", (e) => {
    try {
      const b = e.target.closest && e.target.closest('[data-kclf="all"]');
      if (!b) return;
      const box = b.closest("[data-kcl]") || document;
      const on = $(".k-stc.on", box);
      if (on) on.click(); // 札をもう一度押すのと同じ動き（絞り込みを外して描き直す）
    } catch (x) { /* 無視 */ }
  }, true);

  /* ③ food-M05 の残り：バイヤー一覧から削除した相手（一覧から外した相手）が、案件一覧に残る
        → 案件一覧を作る間だけ、外した相手のスレッドを見せない（やりとり・商談の記録そのものは残る。ゴミ箱から戻すと、また出る） */
  if (typeof RD.homeView === "function") {
    const hv = RD.homeView;
    RD.homeView = function (w) {
      let t = null, orig = null;
      try {
        const ids = (A().hidThreads ? A().hidThreads() : []);
        t = typeof TEN !== "undefined" ? TEN : null; // eslint-disable-line no-undef
        if (ids.length && t && t.dmThreads && typeof t.dmThreads === "object") {
          const keep = {};
          let cut = 0;
          Object.keys(t.dmThreads).forEach((k) => { const th = t.dmThreads[k]; if (th && ids.indexOf(String(th.id)) >= 0) cut++; else keep[k] = th; });
          if (cut) { orig = t.dmThreads; t.dmThreads = keep; }
        }
      } catch (e) { orig = null; }
      try { return hv.apply(this, arguments); } finally { if (orig && t) t.dmThreads = orig; }
    };
  }

  setTimeout(() => { try { if (RD.homeView && $("#well .rd-home") && !$("#well [data-kcl]") && safe(() => RD.curKey()) === "dash:home") { RD._v92r5bEarly = 2; redo(); } } catch (e) { /* 無視 */ } }, 700);
})();
