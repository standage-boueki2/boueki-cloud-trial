/* 貿易クラウドAI商社マン 21.92 up（刷新版の層・rd_v92per.js のあとに読む）
   2026-11-14 の「8カテゴリー×ペルソナ評価」のうち、商品情報を登録・商品情報の上のカード（刷新版が足した部品）の直し。
   今のアプリの関数・刷新版の前の層は差し替えず、RDX.after を包む。数字・文はアプリが持っているものだけ。
   ① 「読み取り結果」の「規格」の欄：登録の前は品番、あとは梱包の文が入っていた（culture-17・indagri-19・auto-06）
      → 「品番」と「梱包・入数」（車両・機械は「積み方」）に分ける。「建値」は 取引条件＋仕出港（FOB 横浜港）
   ② 「AIヒアリング」の箱：質問の順番が、実際に聞かれる順（重要な順）と違った（medical-02）。質問が途中で切れた（auto-16・daily-19・food-16・medical-12）
      → 本体の層（logic_v2192up の v92upHearOrder）の順で、質問の1文目を全部出す。仕出港は所在地に近い港を先に（other-12）
   ③ 情報がそろったあと、登録した取引条件・支払条件・仕出港を見る・直す場所への入口（auto-04）
   ④ ヒアリングを開いている間に上の「AIの質問に答える」を押すと、会話が最初からになっていた → いまの質問の欄へ送るだけ
   ⑤ ホーム「はじめの設定 次：足りない情報を埋める」→ 登録メニューを通らず、質問の欄へ直接（other-07・indagri-12） */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92up) return;
  RD._v92up = 1;
  const { $, $$, esc } = RD;
  const ten = () => { try { return RD.G("TEN") || null; } catch (e) { return null; } };
  const isJa = () => { const s = document.getElementById("lang"); return !s || !s.value || /^ja/.test(s.value); };
  const L = (ja, en) => (isJa() ? ja : en);

  /* ① 読み取り結果：品番／梱包・入数／建値 */
  function fixKv(card, T) {
    const dl = $("dl.rd-kv", card);
    if (!dl || dl.dataset.v92up) return;
    dl.dataset.v92up = "1";
    const dts = $$("dt", dl);
    const row = (re) => { const dt = dts.find((x) => re.test((x.textContent || "").trim())); return dt ? [dt, dt.nextElementSibling] : null; };
    const put = (dd, v) => { if (!dd) return; const s = String(v || "").trim(); dd.textContent = s || "未入力"; dd.title = s; dd.classList.toggle("miss", !s); };
    const spec = row(/^規格/);
    if (spec) {
      let kind = "";
      try { kind = window.v92upKindOf ? window.v92upKindOf(T) : ""; } catch (e) { kind = ""; }
      spec[0].textContent = "品番";
      put(spec[1], T.sku);
      const dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = kind === "machine" || kind === "car" ? "積み方" : "梱包・入数";
      put(dd, T.ctn);
      spec[1].after(dt, dd);
    }
    const term = row(/^建値/);
    if (term) {
      const t = String(T.term || "").trim(), p = String(T.pol || "").trim();
      const plain = /^[A-Za-z&]{3}$/.test(t);
      put(term[1], t ? (p && plain ? t + " " + p : t) : "");
      if (t && p && plain) term[1].title = L("取引条件 " + t + "／仕出港 " + p, "Terms " + t + " / Port " + p);
    }
  }

  /* ② AIヒアリングの箱：実際に聞く順・質問の文は切らない */
  function fixQs(card) {
    const warm = $(".rd-warm", card);
    if (!warm || warm.dataset.v92up || typeof window.v92upHearOrder !== "function") return;
    if (/既存の商品は表示していません/.test((($("#well") || {}).textContent) || "")) return; // 新しい会社の登録の表示（質問の例）はそのまま
    const olds = $$(":scope > div", warm).filter((d) => !d.classList.contains("rd-askhd") && !d.classList.contains("rd-empty") && $$(":scope > b", d).length >= 2);
    if (!olds.length) return;
    let Q = [];
    try { Q = window.v92upHearOrder() || []; } catch (e) { Q = []; }
    if (!Q.length) return;
    warm.dataset.v92up = "1";
    const G8 = Array.isArray(window.V92_GROUPS) ? window.V92_GROUPS : null;
    const html = Q.slice(0, 2).map((q, i) => {
      let chips = "";
      if (q.k === "cat" && G8) chips = `<div class="k-v92upqc" data-noi18n>${G8.map((g) => `<span class="rd-tag bl k-v92cat" title="${esc(g.hint)}">${esc(g.ja)}</span>`).join("")}</div><p class="k-v92catn">8つの分類から、近いものを選べます（細かい種類はそのあとで）。</p>`;
      else if (q.chips && q.chips.length) chips = `<div class="k-v92upqc"><span class="k-v92exl">選択肢の例：</span>${q.chips.slice(0, 5).map((c) => `<span class="rd-tag bl k-v92ex">${esc(c)}</span>`).join("")}</div>`;
      return `<div class="k-v92upq" data-v92="1" data-v92h="1"><b class="k-v92upqn">Q${i + 1}</b><b class="k-v92upqt" title="${esc(q.q)}">${esc(q.q || q.n)}</b>${chips}</div>`;
    }).join("");
    olds[0].insertAdjacentHTML("beforebegin", html);
    olds.forEach((d) => d.parentNode.removeChild(d));
    if (Q.length > 2 && !$(".k-v92upqm", warm)) {
      const b = $("#rdfill", warm);
      if (b) b.insertAdjacentHTML("beforebegin", `<p class="k-v92upqm" data-noi18n>${esc(L("ほかに " + (Q.length - 2) + "項目（重要な順に、1つずつ伺います）", (Q.length - 2) + " more item(s), asked one by one"))}</p>`);
    }
  }

  /* ③ そろったあと：登録した内容を見る・直す場所への入口 */
  function fixDone(card, mode) {
    const warm = $(".rd-warm", card), b = $("#rdfill", card);
    if (!warm || !b || mode !== "up" || $(".k-v92updone", warm)) return;
    if (!$(".rd-empty", warm)) return;
    b.insertAdjacentHTML("afterend", `<button type="button" class="k-link k-v92updone" data-v92upitem="1">登録した内容を見る・直す（商品情報）</button>`);
  }

  function apply() {
    if (RD.locked && RD.locked()) return;
    const w = $("#well");
    if (!w) return;
    const k = RD.curKey();
    if (k !== "up" && k !== "item") return;
    const card = $("[data-rdprod]", w), T = ten();
    if (!card || !T) return;
    try { fixKv(card, T); } catch (e) { console.error("[rd v92up] kv", e); }
    try { fixQs(card); } catch (e) { console.error("[rd v92up] qs", e); }
    try { fixDone(card, k); } catch (e) { console.error("[rd v92up] done", e); }
  }
  const prev = RD.after;
  RD.after = function () {
    const r = prev.apply(this, arguments);
    try { apply(); } catch (e) { console.error("[rd v92up]", e); }
    return r;
  };
  try { apply(); } catch (e) { /* 最初の描画の前 */ }

  /* ④⑤ 押したときの行き先（今のアプリのボタンより先に見る） */
  document.addEventListener("click", (e) => {
    try {
      const t = e.target;
      if (!t || !t.closest) return;
      if (t.closest("[data-v92upitem]")) { e.preventDefault(); e.stopPropagation(); RD.goKey("item"); return; }
      // ④ ヒアリングを開いている間の「AIの質問に答える」＝いまの質問の欄へ（会話を最初からにしない）
      if (t.closest("#rdfill") && typeof window.v92upHearing === "function" && window.v92upHearing()) {
        e.preventDefault(); e.stopImmediatePropagation();
        window.v92upShowBox();
        return;
      }
      // ⑤ ホーム「はじめの設定 次：足りない情報を埋める」
      const pill = t.closest('.k-pill[data-kbc="up"]');
      if (pill && /足りない|missing|缺少|falta/i.test(pill.textContent || "") && typeof window.v92upHearGo === "function") {
        if (window.v92upHearGo()) { e.preventDefault(); e.stopImmediatePropagation(); }
      }
    } catch (x) { console.error("[rd v92up] click", x); }
  }, true);
})();
