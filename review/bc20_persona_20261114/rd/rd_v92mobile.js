/* 貿易クラウドAI商社マン 21.92 mobile（刷新版の層・rd_v92*.js のあとに読む）
   2026-11-15「スマホ幅と表示の評価」（xmobile-01〜27）のうち、刷新版が足した部品の直し。今のアプリの関数・前の層は差し替えず、RDX.after を包む。
   ① xmobile-01：スマホ・タブレットで、左メニューの項目を選んでもメニューと暗い幕が残った（荷主：案件・商品・書類をつくる・出荷・受注・この案件の書類／物流会社：全項目）
      原因：メニューを閉じるのは、今のアプリの go()（別の画面へ移るとき）と、今のメニューのボタン（.nb）だけ。刷新版のメニューのボタンは .nb ではなく、
      同じ画面の中の切り替え（dash:home → dash:prod、ops:reg → ops:doc）と物流会社の切り替え（fGo）は go() を通らない → メニューの項目を押したら必ず閉じる
   ② xmobile-08：物流会社のホームで、下のタブ「受信箱」を押しても動かない（ホームのあいだ今のアプリの画面は「受信箱」のままなので、同じ画面と見なされた）
      → ホームにいるときは受信箱へ移す。ホームでは下のタブを選ばれた表示にしない
   ③ xmobile-04：タスク「停滞中の案件」の相手名が切れる → 名前を1行目、日数とボタンを次の行に（rd_v92mobile.css。ここは印を付けるだけ）
   ④ xmobile-07：文字「ゆったり」のホームの一覧（rd_v92mobile.css） */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92mobile) return;
  RD._v92mobile = 1;
  const { $, $$ } = RD;
  const closeNav = () => { try { document.body.classList.remove("snav"); document.body.classList.remove("navopen"); } catch (e) { /* 無視 */ } };

  /* ① メニューの項目を押したら閉じる（「すべての機能」の開閉は閉じない） */
  document.addEventListener("click", (e) => {
    try {
      const t = e.target && e.target.closest ? e.target.closest("[data-rdk],[data-rdact]") : null; // 前の層が先にメニューを描き直すと、押したボタンはもうメニューの外にある。印だけで見る（メニューの外の同じ印でも、閉じて困ることはない）
      if (!t) return;
      setTimeout(closeNav, 0);
    } catch (x) { /* 無視 */ }
  }, true); // 取り込みの段で受ける（押したあとメニューが描き直され、押したボタンが外れるため）

  /* ② 物流会社のホーム：下のタブ「受信箱」 */
  const fwdHome = () => { try { return RD.isFwd() && RD.curKey() === "fhome"; } catch (e) { return false; } };
  document.addEventListener("click", (e) => {
    try {
      const t = e.target && e.target.closest ? e.target.closest("#tabbar [data-tb]") : null;
      if (!t || !fwdHome()) return;
      if (t.getAttribute("data-tb") === "finbox") { e.stopPropagation(); e.preventDefault(); RD.goKey("finbox"); }
    } catch (x) { /* 無視 */ }
  }, true);
  function tabMark() {
    const tb = $("#tabbar"); if (!tb) return;
    const home = fwdHome();
    if (home) $$(".tb", tb).forEach((b) => { if (b.classList.contains("on") || b.getAttribute("aria-current")) { b.classList.remove("on"); b.removeAttribute("aria-current"); b.setAttribute("data-v92moff", "1"); } });
    else $$(".tb[data-v92moff]", tb).forEach((b) => { b.removeAttribute("data-v92moff"); try { if (RD.isFwd() && b.getAttribute("data-tb") === RD.curKey()) { b.classList.add("on"); b.setAttribute("aria-current", "page"); } } catch (e) { /* 無視 */ } });
  }

  /* ③ 停滞中の案件のカードに印 */
  function markStale(w) {
    $$(".rd-x .k-card", w).forEach((c) => { if (c.classList.contains("k-v92mstale")) return; const h = $("h2, h3", c); if (h && /停滞中の案件/.test(h.textContent || "")) c.classList.add("k-v92mstale"); });
  }

  /* xmobile-18 スマホ（日本語の画面）：資料を入れる枠の「ここにファイルをドラッグ＆ドロップ」→「ここを押してファイルを選ぶ」 */
  function dropCopy(w) {
    let ok = false;
    try { ok = matchMedia("(max-width:820px) and (pointer:coarse)").matches && (typeof I18N === "undefined" || !I18N.lang || I18N.lang === "ja"); } catch (e) { ok = false; } // eslint-disable-line no-undef
    if (!ok) return;
    $$(".rd-drop b", w).forEach((b) => {
      if ((b.textContent || "").replace(/\s+/g, "") !== "ここにファイルをドラッグ＆ドロップ") return;
      const ns = Array.from(b.childNodes).filter((n) => n.nodeType === 3 && (n.nodeValue || "").trim());
      if (ns.length === 2) { ns[0].nodeValue = "ここを押して"; ns[1].nodeValue = "ファイルを選ぶ"; } else if (ns.length === 1) ns[0].nodeValue = "ここを押してファイルを選ぶ";
    });
  }

  /* xmobile-26 案件の詳細（や商品一覧）から別の画面へ進み、ブラウザの「戻る」を押すと、案件一覧（ホーム）に戻っていた
     原因：案件の詳細・商品一覧は、今のアプリでは同じ「ダッシュボード」の画面の中の切り替え（刷新版の dashMode）で、履歴には「ダッシュボード」としか残らない。
           戻ってきたとき、刷新版は「アプリが自分でダッシュボードへ移った＝ホーム」と見なしていた。
     直し：ダッシュボードを離れる前に見ていた中身（案件の詳細・商品一覧）を覚えておき、「戻る」で戻ってきたときはそれを開く */
  let lastDash = "", lastKey = "", popAt = 0;
  try { window.addEventListener("popstate", () => { popAt = Date.now(); }, true); } catch (e) { /* 無視 */ }
  function backFix(k) {
    try { if (RD.isFwd()) return false; } catch (e) { return false; }
    if (k.indexOf("dash:") === 0) {
      if (k === "dash:home" && lastKey && lastKey.indexOf("dash:") !== 0 && lastDash && lastDash !== k) {
        // 「戻る」の合図（popstate）は、画面の描き直しの少しあとに届くことがある → 少し待ってから確かめる
        const want = lastDash; lastKey = k; lastDash = k;
        setTimeout(() => { try { if (Date.now() - popAt < 700 && RD.curKey() === "dash:home") { popAt = 0; RD.goKey(want); } } catch (e) { /* 無視 */ } }, 90);
        return false;
      }
      lastDash = k;
    }
    lastKey = k;
    return false;
  }

  function apply() {
    const w = $("#well");
    tabMark();
    if (!w) return;
    let k = ""; try { k = RD.curKey(); } catch (e) { k = ""; }
    if (k && backFix(k)) return;
    if (k === "today") markStale(w);
    if (k === "up" || k === "item") dropCopy(w);
  }
  const prev = RD.after;
  RD.after = function () {
    const r = prev.apply(this, arguments);
    try { apply(); } catch (e) { console.error("[rd v92mobile]", e); }
    return r;
  };
  try { apply(); } catch (e) { /* 最初の描画の前 */ }
  try { const tb = $("#tabbar"); if (tb) new MutationObserver(() => { try { tabMark(); } catch (e) { /* 無視 */ } }).observe(tb, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] }); } catch (e) { /* 無視 */ }
})();
