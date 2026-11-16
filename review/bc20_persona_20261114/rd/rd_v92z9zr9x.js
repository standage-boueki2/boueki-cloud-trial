/* 21.94 r9x：刷新版の層（9巡目の5本を重ねた版の確かめで見つけた違い）。RDX.after を包む
   ⑧ 商品情報を登録の「ほかに N項目（重要な順に、1つずつ伺います）」（rd_v92up.js の L(ja, en)。中・西の訳が無く英語の文が出る）
      r9b で「—」だけの値を未登録と数えるようになり、資料で登録した書道セット・建機の質問が 3つになって、この行が出るようになった
      （r9c の通しのスペイン語 02_report で英語の行が 1 つ増えた）。中・西のときだけ、その言語の文にする（英語・日本語は今までどおり）。 */
(function () {
  "use strict";
  if (window.__rd92r9x) return;
  window.__rd92r9x = 1;
  const RD = window.RDX;
  if (!RD || typeof RD.after !== "function") return;
  const lg = () => { try { return String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja").slice(0, 2); } catch (e) { return "ja"; } }; // eslint-disable-line no-undef
  function fixQm() {
    const l = lg();
    if (l !== "zh" && l !== "es") return;
    document.querySelectorAll(".k-v92upqm").forEach((p) => {
      const m = String(p.textContent || "").trim().match(/^(\d+) more item\(s\), asked one by one$/);
      if (!m) return;
      p.textContent = l === "zh" ? "另有 " + m[1] + " 项（按重要程度逐一询问）" : m[1] + " campo(s) más (se preguntan uno a uno, por orden de importancia)";
    });
  }
  const prev = RD.after;
  RD.after = function () {
    const r = prev.apply(this, arguments);
    try { fixQm(); } catch (e) { /* 無視 */ }
    return r;
  };
})();
