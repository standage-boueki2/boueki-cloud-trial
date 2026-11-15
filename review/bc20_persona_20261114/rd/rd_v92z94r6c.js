/* 21.92 r6c：刷新版の層。6巡目の書類・物流 AI の直しは本体の層（logic_v2192r6c）で行う（今の版と刷新版の両方に効かせるため）。
   ここは、刷新版が画面を描き直したあとに本体の層の「描いたあとの直し」（仕向港の食い違いの箱・出港済みの注記・ボタンのそばの理由）をもう一度呼ぶだけ。 */
(function () {
  if (window.__rdV92r6c) return;
  window.__rdV92r6c = 1;
  try {
    if (window.RDX && typeof RDX.after === "function") {
      var _a = RDX.after;
      RDX.after = function () {
        var r = _a.apply(this, arguments);
        try { if (window.v92r6c && window.v92r6c.after) setTimeout(window.v92r6c.after, 220); } catch (e) {}
        return r;
      };
    }
  } catch (e) {}
})();
