/* 21.94 r9g（刷新版の層）：AI商社マンの画面の上の「AI商社マンの成長」（rd_pages2.js の RD.page.ai のカード）の帯に、
   一人前ライン（90%＝本体の GROW_PRO）の印を付ける。下の「成長レベル」の輪の印・凡例と同じ濃紺の棒（rd_v92r9g.css の .k-g9bar）。
   カードの文「…・一人前は 90%」はそのまま。数字・帯の長さは変えない。RDX.after を包む（ほかの刷新版の層と同じ形）。 */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92r9g) return;
  RD._v92r9g = 1;
  const { $$ } = RD;
  const pro = () => { try { return typeof GROW_PRO !== "undefined" ? +GROW_PRO || 90 : 90; } catch (e) { return 90; } }; // eslint-disable-line no-undef
  function markBar(w) {
    const cards = $$(".k-card", w).filter((c) => !c.closest(".c.grow") && c.querySelector(".k-bar"));
    cards.forEach((c) => {
      const h = c.querySelector("h2, h3, .k-h b, .k-h");
      const t = (h && h.textContent) || "";
      if (!/AI商社マンの成長|AI trading|growth|成长|crecimiento/i.test(t) && !c.querySelector('[data-rdk="ai"]')) return;
      const bar = c.querySelector(".k-bar");
      if (!bar || bar.classList.contains("k-g9bar")) return;
      if (!/(一人前|90%|full|独当|completo)/i.test(c.textContent || "")) return;
      bar.classList.add("k-g9bar");
      bar.style.setProperty("--g9pro", pro() + "%");
    });
  }
  const prev = RD.after;
  RD.after = function () {
    const r = prev.apply(this, arguments);
    try { if (RD.curKey() === "ai") { const w = document.getElementById("well"); if (w) markBar(w); } } catch (e) { console.error("[rd v92r9g]", e); }
    return r;
  };
})();
