/* 21.92 r5a：刷新版の層。5巡目の書類まわりの直しは本体の層（logic_v2192r5a）で行う（今の版と刷新版の両方に効かせるため）。
   ここは、刷新版が画面を描き直したあとに本体の層の「描いたあとの直し」（出港の予定日の注記・書類の下の注記・宛先）をもう一度呼ぶだけ。 */
(function () {
  if (window.__rdV92r5a) return;
  window.__rdV92r5a = 1;
  try {
    if (window.RDX && typeof RDX.after === "function") {
      var _a = RDX.after;
      RDX.after = function () {
        var r = _a.apply(this, arguments);
        try { if (window.v92r5a && window.v92r5a.after) setTimeout(window.v92r5a.after, 200); } catch (e) {}
        return r;
      };
    }
  } catch (e) {}
})();
