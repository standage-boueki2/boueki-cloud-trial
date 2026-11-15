/* 貿易クラウドAI商社マン 21.92 admin（刷新版の層）：管理者の上の帯の直し（xi18n-91）
   ③ 上の帯の「STANDAGE 管理者」のメニューに、荷主向けの「表示している会社：未登録・商品情報を登録してください」が出ていた
      → 管理者のときは、その区切りをたたむ（部品はそのまま残し、見せないだけ。印は .k-dd.k-v92adm。見た目は rd_v92admin.css）
   今のアプリの関数・刷新版の前の層は差し替えず、RDX.after を包む。 */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92admin) return;
  RD._v92admin = 1;
  const isAdm = () => { try { return typeof SES !== "undefined" && !!SES && SES.t === "admin"; } catch (e) { return false; } }; // eslint-disable-line no-undef
  function mark() {
    const dd = document.querySelector(".k-dd");
    if (!dd) return;
    const on = isAdm();
    if (dd.classList.contains("k-v92adm") !== on) dd.classList.toggle("k-v92adm", on);
  }
  const old = RD.after;
  RD.after = function () { const r = old.apply(this, arguments); try { mark(); } catch (e) { /* 無視 */ } return r; };
  setInterval(() => { try { mark(); } catch (e) { /* 無視 */ } }, 1500);
  try { mark(); } catch (e) { /* まだ */ }
})();
