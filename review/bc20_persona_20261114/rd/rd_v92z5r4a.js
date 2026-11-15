/* 21.92 r4a（刷新版の層）：書類まわりの直し。
   中身の直しは本体の層（logic_v2192r4a.ts）にある。ここは、刷新版が画面を描き直したあとにも、本体の層の「描いたあとの直し」
   （契約書の相手の選択・この案件の書類の注記・点検の欄）が残るよう、RDX.after の最後で呼び直すだけ。 */
(function () {
  'use strict';
  if (window.__rdV92r4a) return;
  window.__rdV92r4a = 1;
  try {
    if (typeof RDX === 'undefined' || !RDX || typeof RDX.after !== 'function') return;
    var __a = RDX.after;
    RDX.after = function () {
      var r = __a.apply(this, arguments);
      try { if (window.v92r4a && typeof window.v92r4a.after === 'function') window.v92r4a.after(); } catch (e) {}
      return r;
    };
  } catch (e) {}
})();
