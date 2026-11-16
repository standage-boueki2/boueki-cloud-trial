/* 21.92 r8c の刷新版の層：xcut-T03（英語・中国語・スペイン語で、販売先国の同点の説明が2か所に出る）
   21.93 の刷新版の層（rd_v92reg）が「点数と順位の見方」の欄に、同点の説明と順位の言い方の注記を出す。
   同じ文が候補の表の下（アプリの層 logic_v2192reg の p.nn.v92reg-tie・v92reg-rk）にもある。
   日本語では表の下の注記は「？説明」へたたまれる（rd_case の foldNotes は日本語だけ）ので1か所。日本語以外は2か所に出ていた。
   → 日本語以外で「点数と順位の見方」の欄があるときは、表の下の同じ注記を出さない（欄の中の同じ文を見る）。日本語の画面は何もしない */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92r8c) return;
  RD._v92r8c = 1;
  const { $, $$ } = RD;
  const isJa = () => { const s = document.getElementById("lang"); return !s || !s.value || /^ja/.test(s.value); };
  const chain = (k, f) => { const p0 = RD.page[k]; RD.page[k] = (w, kk) => { if (p0) p0(w, kk); try { f(w, kk); } catch (e) { console.error("[rd] v92r8c " + k, e); } }; };
  const norm = (s) => String(s || "").replace(/\s+/g, " ").trim();
  /* 訳す前の文で見比べる（訳が当たる時刻が欄と表で違っても同じに見える） */
  const src = (el) => {
    let I = null;
    try { I = (typeof I18N !== "undefined" && I18N && I18N.orig) ? I18N.orig : null; } catch (e) { I = null; } // eslint-disable-line no-undef
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let s = "", n;
    while ((n = w.nextNode())) s += (I && I.has(n)) ? String(I.get(n)) : String(n.nodeValue || "");
    return norm(s);
  };
  function dedupe(w) {
    const root = w || document;
    const card = $(".k-v92cty", root);
    const notes = $$("p.v92reg-tie, p.v92reg-rk", root).filter((p) => !p.closest(".k-v92cty"));
    if (!notes.length) return;
    if (isJa() || !card) { notes.forEach((p) => { if (p.dataset.v92r8c) { p.hidden = false; delete p.dataset.v92r8c; } }); return; }
    const inCard = new Set($$("p", card).map((p) => src(p)));
    notes.forEach((p) => {
      const same = inCard.has(src(p));
      if (same && !p.hidden) { p.hidden = true; p.dataset.v92r8c = "dup"; }
      else if (!same && p.dataset.v92r8c) { p.hidden = false; delete p.dataset.v92r8c; }
    });
  }
  chain("cty", (w) => { dedupe(w); setTimeout(() => dedupe(document.getElementById("well")), 400); });
})();
