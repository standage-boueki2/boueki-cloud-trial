/* 貿易クラウドAI商社マン 21.92 fwd（刷新版の層・rd_v92per.js のあとに読む）
   2026-11-14「8カテゴリー×ペルソナ評価」の物流会社の画面の課題（cross-03・04・10〜14・18）のうち、刷新版が足した部品の直し。
   今のアプリの関数・刷新版の前の層は差し替えず、RDX.after を包む。数字はアプリが持っているものだけ（見積受信箱と同じ数＝本体の層 logic_v2192fwd が控えた数）。
   ① ホーム「今日やること N 件／この3つ」：件数と行の数の関係を書く。「14日で運用を始めるステップ」→ 開く中身（使い方ガイド）の名前に（cross-12）
   ② 手順の数え方：ホームの「見積から出荷までの流れ（6ステップ）」にそろえる。左下の「3分でわかるスタートガイド」・使い方ガイドの最初の箱も同じ6ステップに。
      「AI見積を確認して送る／承認・提出」→ 見積は自動で荷主に届く（承認の操作は無い）と書く（cross-12）
   ③ 「全体の状況」はホームの1か所に：ホームの札を、見積受信箱の上の数字と同じ札・同じ並びにそろえる（10枚＝5枚×2段）。
      見積受信箱の上の札は「受信箱の状況」と名前を変え、全体の状況はホームと書く。左メニューの「全体の状況」を押したら、その項目を選ばれた表示に（cross-11・14）
   ④ 見積受信箱：数字のカード（受信・AI自動回答・登録レーン・仮押さえ）と「AI物流マンのしくみ」は依頼の表の下へ。要確認のタスクの長い説明はたたむ（cross-10）
   ⑤ 用語の「？」が2つ付く（abbr.k-term の中に今のアプリの印 .tm）→ 印は1つに（cross-13）
   ⑥ 交渉記録の窓：輸送ルートの札が「横浜港 → ア…」で切れる・「問題なし」の絵が注意の三角・「荷主へ提出」の手順（提出の操作は無い）（cross-18）
   物流レート管理・見積受信箱の表の幅は rd_v92fwd.css */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92fwd) return;
  RD._v92fwd = { err: [], ovSel: false };
  const { $, $$, esc, I } = RD;
  const err = (k, e) => { try { RD._v92fwd.err.push(k + ": " + String((e && e.message) || e).slice(0, 160)); } catch (x) { /* 無視 */ } };
  const fwd = () => { try { return !RD.locked() && RD.isFwd(); } catch (e) { return false; } };
  const key = () => { try { return RD.curKey(); } catch (e) { return ""; } };
  const V = () => window.__v2192fwd || {};
  const ja = () => { try { return ((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja") === "ja"; } catch (e) { return true; } }; // eslint-disable-line no-undef
  const T = (j, e) => (ja() ? j : e); // 日本語の画面は日本語、ほかの言語は英語（要素には data-noi18n）

  /* 見積から出荷までの流れ（ホームの6ステップと同じ） */
  const SIX = [
    { ic: "db", t: "レート登録", b: "「物流レート管理」で、自社の運賃表（Excel・CSV）を取り込むか、1本ずつ手で入れます。取り込みは、読めた行・読めなかった行を確かめてから登録します。", go: [["frates", "物流レート管理を開く"]] },
    { ic: "mail", t: "見積対応", b: "レートのある区間の依頼には、AI物流マンが自動で見積を出し、そのまま荷主に届きます（承認・提出の操作はありません）。内容は「見積受信箱」の「交渉記録」で確かめます。", go: [["finbox", "見積受信箱を開く"]] },
    { ic: "alert", t: "例外対応", b: "レートが無い区間の依頼は「要確認のタスク」に出ます。その区間のレートを登録すると、見積が付きます。金額を直すときは、区間のレートを直します。", go: [["finbox", "要確認の依頼を見る"]] },
    { ic: "chart", t: "選ばれる工夫", b: "「相見積・AI推奨」で、ほかの会社との順位・差を見て、運賃・日数・有効期限を見直します。", go: [["fagg", "相見積・AI推奨を開く"]] },
    { ic: "hand", t: "仮押さえ", b: "荷主が貴社を選んで仮押さえすると、見積受信箱と案件に出ます。", go: [["finbox", "見積受信箱を開く"]] },
    { ic: "ship", t: "出荷手配", b: "「案件・出荷管理」で、B/L・本船・ETD/ETA を登録し、出荷完了まで進めます。", go: [["fcase", "案件・出荷管理を開く"]] },
  ];

  /* ───── ①③ ホーム ───── */
  function ovGo(k) {
    if (k === "frates" || k === "fcase") { RD.goKey(k); return; }
    if (k === "exp") { RD.goKey("frates"); setTimeout(() => { try { if (window.v89fShowExpired) window.v89fShowExpired(true); } catch (e) { /* 無視 */ } }, 250); return; }
    RD.goKey("finbox");
    setTimeout(() => { const b = $$('#well [data-v70fgo="' + k + '"]').find((x) => !x.closest(".rd-x")); if (b) b.click(); }, 80);
  }
  function fixHome(w) {
    const top = $(".rd-fhome-top", w); if (!top) return;
    // 今日やること：件数と行の数の関係
    const ch = $(".rd-warm .rd-ch", top);
    if (ch && !ch.dataset.v92) {
      const rows = $$(".rd-todo .rd-td", top);
      const need = rows.filter((r) => { const c = $(".rd-cnt", r); return c && !c.classList.contains("z"); }).length;
      const h2 = $("h2", ch), chs = $(".rd-chs", ch);
      if (h2 && chs && ja()) {
        ch.dataset.v92 = "1";
        h2.setAttribute("data-noi18n", ""); chs.setAttribute("data-noi18n", "");
        h2.innerHTML = `今日やること`;
        chs.className = "rd-chs k-v92todo";
        chs.textContent = need ? `下の${rows.length}つのうち、対応が要るのは ${need}つ です（右の数字は依頼・案件の件数）。` : `いま対応が要るものはありません（下の${rows.length}つは、いつでも開けます）。`;
      }
    }
    // はじめての方へ：開く中身（使い方ガイド）の名前に
    const hb = $("[data-rdact=help]", top);
    if (hb && !hb.dataset.v92 && ja()) {
      const sp = $$("span span", hb).find((x) => /14日で運用を始めるステップ/.test(x.textContent || ""));
      if (sp) { hb.dataset.v92 = "1"; sp.setAttribute("data-noi18n", ""); sp.textContent = "使い方ガイド（見積から出荷までの6ステップ）"; }
    }
    // 全体の状況：見積受信箱の上の数字と同じ札・同じ並び（10枚＝5枚×2段）
    const h = $$(".rd-card h2", w).find((x) => /^全体の状況/.test((x.textContent || "").trim()));
    const card = h && h.closest(".rd-card");
    const box = card && $(".rd-tiles", card);
    const ov = V().ov;
    if (box && ov && !box.dataset.v92 && $("[data-v90ftile]", box)) {
      box.dataset.v92 = "1";
      box.classList.add("k-v92ov");
      const Ti = (i) => $(`[data-rdtile="${i}"]`, box);
      const mk = (k, ic, l, n, u, s, cls, ord) => `<button type="button" class="rd-tile ${cls || ""}" data-v92ov="${k}" style="order:${ord}"><span class="rd-ti">${I(ic, 26)}</span><span><b>${esc(l)}</b><span class="rd-tn">${esc(n)}<small>${esc(u)}</small></span>${s ? `<span class="rd-ts" style="display:block">${esc(s)}</span>` : ""}</span></button>`;
      const n = (k) => (ov[k] == null ? 0 : ov[k]);
      const set = (el, ord) => { if (el) el.style.order = String(ord); };
      set(Ti(0), 1); set(Ti(1), 2); set(Ti(2), 5); set(Ti(3), 7); set($("[data-v90ftile]", box), 9);
      box.insertAdjacentHTML("beforeend",
        `<div class="k-v92ovg" style="order:0" data-noi18n>${T("依頼", "Requests")}</div>` +
        mk("rv", "alert", T("要確認", "Needs check"), n("rv"), T("件", ""), T("AIが見積を出せなかった依頼", "Requests the AI could not quote"), n("rv") ? "or" : "gr", 3) +
        mk("none", "users", T("未担当", "Unassigned"), n("none"), T("件", ""), T("担当を決めていない依頼", "Requests with no owner yet"), n("none") ? "or" : "gr", 4) +
        `<div class="k-v92ovg" style="order:6" data-noi18n>${T("レート・案件", "Rates & cases")}</div>` +
        mk("frates", "cal", T("30日以内に期限のレート", "Rates expiring within 30 days"), n("frates"), T("本", ""), T("早めに新しいレートへ", "Renew them soon"), n("frates") ? "or" : "gr", 8) +
        mk("rdy", "check", T("出せる状態（荷主待ち）", "Ready (awaiting shipper)"), n("rdy"), T("件", ""), T("貴社のレートで出せる依頼", "Quotable with your rates"), "", 10) +
        mk("fcase", "box", T("案件", "Cases"), n("fcase"), T("件", ""), T("荷主の会社×案件番号", "Shipper × case no."), "", 11));
      $$("[data-v92ov]", box).forEach((b) => b.setAttribute("data-noi18n", ""));
      $$("[data-v92ov]", box).forEach((b) => b.addEventListener("click", () => ovGo(b.dataset.v92ov)));
      const chs = $(".rd-chs", card);
      const tip = "物流会社の全体の状況（ダッシュボード）は、ここ1か所です。見積受信箱の上の「受信箱の状況」と同じ数え方で、依頼（受信・AI自動回答率・要確認・未担当・仮押さえ）と、レート・案件（登録レーン・30日以内に期限・期限切れ・出せる状態・案件）を出します。数字を押すと、その一覧に移ります。";
      if (chs && ja()) { chs.setAttribute("data-noi18n", ""); chs.textContent = "（見積受信箱の上の数字と同じ数え方です。数字を押すと、その一覧に移ります）"; }
      const q = h && $(".k-q", h); if (q && ja()) q.setAttribute("data-kq", tip);
    }
    // 「？」が後から付いたときも、説明をそろえる
    const q2 = h && $(".k-q", h);
    if (q2 && ja() && box && box.dataset.v92 && !/1か所/.test(q2.getAttribute("data-kq") || "")) q2.setAttribute("data-kq", "物流会社の全体の状況（ダッシュボード）は、ここ1か所です。見積受信箱の上の「受信箱の状況」と同じ数え方で、依頼（受信・AI自動回答率・要確認・未担当・仮押さえ）と、レート・案件（登録レーン・30日以内に期限・期限切れ・出せる状態・案件）を出します。数字を押すと、その一覧に移ります。");
    // AI自動回答率の内訳は短く（3行に折れない）
    const au = box && $(".v90fautos", box);
    if (au && !au.dataset.v92 && ja() && typeof window.v90fAutoSplit === "function") {
      const A = window.v90fAutoSplit(); au.dataset.v92 = "1"; au.title = au.textContent || "";
      au.textContent = A.warn ? `うち 期限切れ・港違いを含む ${A.warn}件（要確認）` : "期限切れ・港違いの見積なし";
    }
  }
  RD.v92fGoOv = function () {
    RD._v92fwd.ovSel = true;
    try { RD.goKey("fhome"); } catch (e) { err("ov", e); }
    let n = 0; const t = setInterval(() => { n++; const h = $$("#well .rd-card h2").find((x) => /^全体の状況/.test((x.textContent || "").trim())); if (h || n > 20) { clearInterval(t); if (h) h.closest(".rd-card").scrollIntoView({ block: "start", behavior: "smooth" }); navSel(); } }, 100);
  };
  /* 左メニューの「全体の状況」：押したら、その項目を選ばれた表示に（ほかの項目を押すまで） */
  function navSel() {
    const ov = $('#rdside [data-rdk="@ov"]'); if (!ov) return;
    const on = RD._v92fwd.ovSel && key() === "fhome";
    if (!on) RD._v92fwd.ovSel = false;
    const home = $('#rdside .rd-mains [data-rdk="fhome"]');
    const setA = (el, k, v) => { if (el && el.getAttribute(k) !== v) el.setAttribute(k, v); };
    if (on) { setA(ov, "aria-current", "true"); setA(home, "aria-current", "false"); }
    setA(ov, "title", "物流会社の全体の状況（ホームの「全体の状況」）：受信・AI回答・要確認・未担当・仮押さえ・レートの期限・案件の数");
  }
  document.addEventListener("click", (e) => {
    // 前の層（rd_v90fwd）が先に画面を移して左メニューを描き直すため、押したボタンはもう画面の外にある。印（data-rdk）だけで見る
    const b = e.target && e.target.closest && e.target.closest("[data-rdk]"); if (!b || !fwd()) return;
    RD._v92fwd.ovSel = b.getAttribute("data-rdk") === "@ov";
    if (RD._v92fwd.ovSel) { setTimeout(navSel, 0); setTimeout(navSel, 400); setTimeout(navSel, 1200); }
  }, true);

  /* ───── ③④ 見積受信箱 ───── */
  function fixInbox(w) {
    const ov = $(".v70fov", w);
    if (ov && !ov.dataset.v92 && ja()) {
      ov.dataset.v92 = "1";
      const h3 = $(".v70fov-h h3", ov), sp = $(".v70fov-h span", ov);
      if (h3) h3.textContent = "受信箱の状況";
      if (sp) sp.innerHTML = `数字を押すと、その一覧に移ります。全体の状況（ダッシュボード）は <button type="button" class="k-link" data-v92ovhome="1">ホームの「全体の状況」</button> にまとめています（同じ数え方）。`;
    }
    // 数字のカード・しくみ・要確認のタスクのたたみは、本体の層（logic_v2192fwd の inboxLayout）が今の版・刷新版の両方で行う。
    // 刷新版では「ここに届く依頼」の説明（？ 説明）も、同じ「数字の内訳」の中へ（上の「受信箱の状況」のすぐ下に依頼の表が来るように）
    const det = $("details.k-v92more", w);
    const st = $$(":scope > .k-qline", w).find((x) => x.nextElementSibling && x.nextElementSibling.classList.contains("v69fst"));
    if (det && st) { const nx = st.nextElementSibling; const sm = $(":scope > summary", det); if (sm) { sm.insertAdjacentElement("afterend", nx); sm.insertAdjacentElement("afterend", st); } }
    // 「推奨・選択中・（自社）（他社）」の説明の「？」は、担当・対応の絞り込みの行の右端へ（1行ぶん、表が上に来る）
    const tabs = $(".v33tabs", w);
    const ql = $$(".k-qline", w).find((x) => x.nextElementSibling && x.nextElementSibling.classList.contains("v79fwdlg"));
    if (tabs && ql && !tabs.contains(ql)) { ql.classList.add("k-v92ql"); const nx = ql.nextElementSibling; tabs.appendChild(ql); const s = $("span", ql); if (s && ja()) s.textContent = "推奨・選択中の見方"; if (nx) tabs.insertAdjacentElement("afterend", nx); }
  }
  document.addEventListener("click", (e) => { const b = e.target && e.target.closest && e.target.closest("[data-v92ovhome]"); if (!b) return; e.preventDefault(); RD.v92fGoOv(); }, true);

  /* ───── ⑤ 用語の印は1つに ───── */
  function fixTerms(root) {
    if (!root) return;
    // 今のアプリの印（ux25Terms の span.tm）は、abbr の中の文字にも付く（ABBR を除いていない）ため、刷新版の印（abbr.k-term）と二重になっていた。
    // 外して終わりにすると、今のアプリがまた付け直す（書き換え合う）ので、abbr に data-noterm（今のアプリが見る「付けない」印）を付けてから外す
    $$("abbr.k-term:not([data-noterm])", root).forEach((x) => { if (!x.closest(".k-termdemo")) x.setAttribute("data-noterm", ""); });
    $$("abbr.k-term .tm, abbr.k-term .v54term, abbr.k-term abbr.k-term", root).forEach((x) => { if (x.closest(".k-termdemo")) return; x.replaceWith(document.createTextNode(x.textContent || "")); });
    $$(".tm abbr.k-term, .v54term abbr.k-term", root).forEach((x) => { const p = x.closest(".tm, .v54term"); if (p && p.parentNode) p.replaceWith(x); });
    // 「ETD/ETA」「FCL20」のように記号・数字に続く英字は、刷新版（rd_v90doc の unmarkCodes）が番号・コードとみなして印を外している（span.v90no）。
    // ここにも今のアプリの印が付いたり付かなかったり（開いた直後だけ「ETA ？」）だったので、付けない側にそろえる
    $$("span.v90no:not([data-noterm])", root).forEach((x) => x.setAttribute("data-noterm", ""));
    $$("span.v90no .tm, span.v90no .v54term", root).forEach((x) => x.replaceWith(document.createTextNode(x.textContent || "")));
    $$(".tm > span.v90no:only-child, .v54term > span.v90no:only-child", root).forEach((x) => { const p = x.parentElement; if (p && p.parentNode && (p.textContent || "") === (x.textContent || "")) p.replaceWith(x); });
  }

  /* ───── ② スタートガイド・使い方ガイド：6ステップにそろえる ───── */
  function fixSide() {
    const sm = $("#rdside .rd-start small");
    if (sm && fwd() && ja() && !sm.dataset.v92) { sm.dataset.v92 = "1"; sm.setAttribute("data-noi18n", ""); sm.textContent = "見積から出荷までの6ステップ"; }
  }
  if (typeof RD.quickGuide === "function") {
    const qg = RD.quickGuide;
    RD.quickGuide = function () {
      const r = qg.apply(this, arguments);
      try {
        const d = document.getElementById("k-qg");
        if (d && fwd() && ja()) {
          const p = $(".k-qghd p", d); if (p) p.textContent = "AI物流マンは、この6つの順（ホームの「見積から出荷までの流れ」と同じ）で使います。各手順のボタンから、その画面を開けます。";
          const ol = $(".k-qgst", d);
          if (ol) ol.innerHTML = SIX.map((x, i) => `<li><span class="k-qgn">${i + 1}</span><span class="k-qgi">${I(x.ic, 24, 1.9)}</span><div class="k-qgtx"><b>${esc(x.t)}</b><p>${esc(x.b)}</p><div class="k-qggo">${x.go.map((g) => `<button type="button" class="k-btn white k-mini" data-qggo="${esc(g[0])}">${esc(g[1])} ${I("chevR", 14, 2.4)}</button>`).join("")}</div></div></li>`).join("");
          const ft = $(".k-qgft p", d); if (ft) ft.innerHTML = `${I("list", 16)}迷ったら「ホーム」の「今日やること」へ。わからないことは「AIに聞く」で聞けます。ほかの機能は、左のメニューの「<b>すべての機能</b>」に全部あります。`;
        }
      } catch (e) { err("qg", e); }
      return r;
    };
  }
  function fixHelp(pn) {
    const hd = $(".k-helphd2", pn); if (!hd || hd.dataset.v92 || !fwd() || !ja()) return;
    hd.dataset.v92 = "1";
    const card = $$(".k-card", hd).find((c) => /まずこの3ステップから/.test(c.textContent || ""));
    if (card) {
      const h = $$("h2, h3, b", card).find((x) => /まずこの3ステップから/.test(x.textContent || "")); if (h) h.textContent = "見積から出荷までの6ステップ（ホームと同じ流れ）";
      const st = $(".k-steps", card);
      if (st) {
        st.style.cssText += ";display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px";
        st.innerHTML = SIX.map((s, i) => `<button type="button" class="k-step" data-v92six="${esc(s.go[0][0])}"><span class="k-sn">${i + 1}</span><span class="k-si">${I(s.ic, 24)}</span><span style="min-width:0"><b style="white-space:nowrap">${esc(s.t)}</b></span></button>`).join("");
        st.insertAdjacentHTML("afterend", `<p class="rd-note" style="margin:10px 0 0">見積は、レートのある区間なら AI物流マンが自動で出し、そのまま荷主に届きます（承認・提出の操作はありません）。金額を直すときは、見積受信箱の「回答の金額を直す」から区間のレートを直します。</p>`);
        $$("[data-v92six]", st).forEach((b) => b.addEventListener("click", () => { try { closeDW(); } catch (e) { /* 無視 */ } RD.goKey(b.dataset.v92six); })); // eslint-disable-line no-undef
      }
    }
    // 今の版の説明「物流会社モードの3ステップ」は、上の6ステップと重なるのでたたむ（消さない）
    const lb = $$("p.lbl", pn).find((x) => /物流会社モードの3ステップ/.test(x.textContent || "") && !x.closest(".rd-x"));
    if (lb && !lb.closest("details")) {
      const d = document.createElement("details"); d.className = "k-v92fold"; d.setAttribute("data-noi18n", ""); d.style.margin = "10px 0";
      d.innerHTML = `<summary>今の版の説明（受け取る・レートを整える・相見積で速く返す）を開く</summary>`;
      lb.insertAdjacentElement("beforebegin", d);
      const grid = lb.nextElementSibling; // 見出しのすぐ下の、3つの手順の箱だけ（その下のボタン・お問い合わせはそのまま）
      d.appendChild(lb);
      if (grid && grid.tagName === "DIV" && !grid.classList.contains("rw") && !grid.querySelector("button")) d.appendChild(grid);
    }
  }

  /* ───── ⑥ 交渉記録の窓 ───── */
  function fixQuote(pn) {
    const hd = $(".k-qhd", pn); if (!hd || hd.dataset.v92) return;
    hd.dataset.v92 = "1";
    $$(".k-tile", hd).forEach((t) => {
      const l = (($(".k-tl", t) || {}).textContent || "").trim(), tn = $(".k-tn", t);
      if (l === "輸送ルート" && tn) { tn.classList.add("k-v92route"); tn.style.fontSize = "20px"; tn.style.lineHeight = "1.35"; tn.title = tn.textContent || ""; }
      if (l === "確認状況" && tn && /問題なし/.test(tn.textContent || "")) { const ti = $(".k-ti", t); if (ti) ti.innerHTML = I("check", 24, 2.6); }
      if (l === "見積依頼番号" && tn) { tn.style.fontSize = "22px"; }
    });
    if (ja()) {
      const st = $$(".k-steps .k-step b", hd).find((b) => (b.textContent || "").trim() === "荷主へ提出"); if (st) st.textContent = "荷主に届く（自動）";
      const st2 = $$(".k-steps .k-step b", hd).find((b) => (b.textContent || "").trim() === "AI見積を確認"); if (st2) st2.textContent = "AI見積の内容を確認";
      const nt = $$(".rd-note", hd).find((p) => /金額・納期を直すときは「レート管理」で更新します/.test(p.textContent || ""));
      const F = (() => { try { return typeof FWDB !== "undefined" ? FWDB : null; } catch (e) { return null; } })(); // eslint-disable-line no-undef
      const id = ((($(".dwhead h3", pn) || {}).textContent || "").match(/RQ-[A-Z0-9]+/) || [])[0];
      const r = F && id && (F.reqs || []).find((x) => x && x.id === id);
      const fob = r && (r.legs || []).some((l) => l && (l.v56shipFob || (l.quote && l.quote.v56shipFob)));
      if (nt && fob) nt.textContent = "FOB の依頼は、海上運賃（航空運賃）は買い手の負担のため ¥0 と出ます（見積は、港で積むまでの THC等・書類費だけ）。金額・納期を直すときは「レート管理」で区間のレートを更新します（同じ区間のほかの依頼にも同じレートが使われます）。";
    }
  }

  function apply() {
    if (!fwd()) return;
    const w = $("#well"); if (!w) return;
    const k = key();
    try { if (k === "fhome") fixHome(w); else if (k === "finbox") fixInbox(w); } catch (e) { err("apply", e); }
    try { fixTerms(w); } catch (e) { err("terms", e); }
    try { fixSide(); navSel(); } catch (e) { err("side", e); }
  }
  const prev = RD.after;
  RD.after = function () {
    const r = prev.apply(this, arguments);
    try { apply(); } catch (e) { err("after", e); }
    return r;
  };
  // ホームは見張りが後から描く・用語の印は後から付く → 画面の中が変わったら、少し後にもう一度
  let t1 = 0;
  const mo = new MutationObserver(() => { try { if (RD._v92fwd.ovSel) navSel(); } catch (e) { /* まだ */ } clearTimeout(t1); t1 = setTimeout(() => { try { apply(); } catch (e) { /* まだ */ } }, 60); });
  try { const w = document.getElementById("well"); if (w) mo.observe(w, { childList: true, subtree: true }); } catch (e) { err("mo", e); }
  let t2 = 0;
  const mo2 = new MutationObserver(() => { clearTimeout(t2); t2 = setTimeout(() => { try { const pn = document.getElementById("pn"), dw = document.getElementById("dw"); if (!pn || !dw || dw.dataset.open !== "true" || !fwd()) return; const t = pn.textContent || ""; if (/ヘルプ・使い方/.test(t)) fixHelp(pn); else if (/AI見積 RQ-/.test(t)) fixQuote(pn); fixTerms(pn); } catch (e) { err("pn", e); } }, 80); });
  try { const pn = document.getElementById("pn"); if (pn) mo2.observe(pn, { childList: true, subtree: true }); } catch (e) { err("mo2", e); }
  const mo3 = new MutationObserver(() => { try { if (fwd()) { fixSide(); navSel(); } } catch (e) { /* まだ */ } });
  try { const s = document.querySelector(".side"); if (s) mo3.observe(s, { childList: true, subtree: true }); } catch (e) { err("mo3", e); }
  try { apply(); } catch (e) { /* 最初の描画の前 */ }
})();
