/* 貿易クラウドAI商社マン 21.92 i18n（刷新版の層・rd_v90i18n.js のあとに読む）
   刷新版の英語の辞書（RDX.v90i18nDict）のうち、部品ごとの差し替えで文が壊れていた訳を、本体の層 logic_v2192i18n の直した訳に合わせる（xi18n-74）。
   刷新版の部品の中は rd_v90i18n が自分の辞書を優先して当てるため、ここで同じ鍵の値だけを差し替える（鍵は足さない・ほかは変えない）。 */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92i18n) return;
  RD._v92i18n = 1;
  try {
    const MY = RD.v90i18nDict, OV = window.__v2192i18nOV;
    if (MY && OV && OV.en) Object.keys(OV.en).forEach((k) => { if (MY[k]) MY[k] = OV.en[k]; });
  } catch (e) { /* 無視 */ }
})();
