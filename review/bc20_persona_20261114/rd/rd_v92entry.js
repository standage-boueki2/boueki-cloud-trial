/* 貿易クラウドAI商社マン 21.92 entry（刷新版の層・ほかの rd_v92*.js のあとに読む）
   2026-11-15 評価（xlogin）の、入口と案内の課題のうち、刷新版が足した部品の直し。今のアプリの関数・前の層は差し替えず、RDX.after を包む。
   ① ログイン画面の言葉（3ステップの1・アクセスコードの札・ご担当者名の欄）（xlogin-04）
   ② 上の帯の会社名のボタン：見本を開いたまま再読み込みすると、切り替えの一覧と「貴社の商品に戻る」が出ない → 出す（xlogin-20）
      （前の層は「部品が見えているか」を、隠した親の中で確かめていたため、いちど隠れると戻らなかった）
   ③ 「商品情報を登録」で商品が0件のとき：「次は」を「資料をアップロード（下の枠へ）」に（xlogin-06）
   ④ はじめてガイド（使い方を見る・くわしい版）：窓の上に、そのページの「刷新版での場所」を今のメニューの名前で出す（xlogin-12）
      ※ ガイドの本文と絵（guide/ の別ファイル）は、窓の外からは書き換えられない（安全のための仕切りの中）。道順だけを窓の上で言い直す
   ⑤ 商品一覧のカード：カードを押しても、その商品に切り替わる（「？」の説明どおりに）（xlogin-21）
   ⑥ 通知センターの上の札：同じ名前の札（そのほか）を1枚にまとめる（xlogin-23）
   ⑦ はじめての窓の文（「どの画面でも」→「次は」のある画面の名前）（xlogin-13）／用語集の余分なリンク（xlogin-16）
   ⑧ お問い合わせの「どの画面で」に出す、刷新版の画面の名前（本体の層が window.v92entryRdName を読む）（xlogin-15） */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92entry) return;
  RD._v92entry = 1;
  const { $, $$, esc, I } = RD;
  const locked = () => { try { return !!RD.locked(); } catch (e) { return true; } };
  const fwd = () => { try { return !!RD.isFwd(); } catch (e) { return false; } };
  const curKey = () => { try { return RD.curKey(); } catch (e) { return ""; } };
  const setTxt = (el, v) => { if (el && el.textContent !== v) el.textContent = v; };
  const shown = (k) => { try { return !!k && !k.hidden && getComputedStyle(k).display !== "none" && !(k.tagName === "SELECT" && !k.options.length); } catch (e) { return false; } };

  /* ───── 画面の名前と道順（いまの左メニューの名前で） ───── */
  function mainLabel(key) {
    // 左メニューに実際に出ている名前を読む（前の層が名前を変えているため）
    try {
      const b = $$("#rdside [data-rdgo], #rdside [data-rdk], #rdside button, #rdside a").find((x) => (x.dataset.rdgo || x.dataset.rdk || x.dataset.k || "") === key);
      if (b) { const t = (b.querySelector("span, b") || b).textContent.trim(); if (t) return t.replace(/\s*\d+$/, ""); }
    } catch (e) { /* 無視 */ }
    return "";
  }
  const MAIN_FALL = { "dash:home": "案件", today: "タスク", item: "商品", msg: "やりとり", ai: "AI商社マン" };
  function pathOf(key) {
    const parts = ["左メニュー"];
    const M = (fwd() ? RD.MAIN_F : RD.MAIN_S) || [];
    const N = (fwd() ? RD.NAV_F : RD.NAV_S) || [];
    let nm = "", grp = "";
    N.forEach((g) => (g.items || []).forEach((it) => { if (!nm && String(it[0]) === key) { nm = it[1]; grp = g.g; } }));
    if (key === "dash:home") nm = "案件一覧（ホーム）";
    const main = M.find((m) => m[0] === key) || M.find((m) => Array.isArray(m[4]) && m[4].indexOf(key) >= 0);
    if (main) {
      const mk = main ? main[0] : key;
      const label = mainLabel(mk) || MAIN_FALL[mk] || (main && main[1]) || nm;
      parts.push(label);
      if (main && mk !== key && nm) parts.push(nm);
    } else {
      parts.push("すべての機能");
      if (grp) parts.push(grp);
      parts.push(nm || key);
    }
    return parts;
  }
  window.v92entryRdName = function () {
    try { const p = pathOf(curKey()); return p[p.length - 1] || ""; } catch (e) { return ""; }
  };

  /* ───── ① ログイン画面の言葉 ───── */
  function fixLogin() {
    const v = document.getElementById("lgv");
    if (!v || v.hidden) return;
    // 3ステップの1：実際に選ぶのは「メール・パスワード」か「アクセスコード」
    $$(".k-lgsteps .k-step", v).forEach((s) => {
      $$("b, small, span", s).forEach((el) => {
        if (el.children.length) return;
        const t = (el.textContent || "").trim();
        if (t === "お客様 または 管理者") el.textContent = "メール・パスワード か コード";
      });
    });
    // アクセスコードの箱の札：だれのための箱かを1つの言い方に
    $$(".k-lgp .k-lgph .k-tag", v).forEach((el) => { if ((el.textContent || "").trim() === "メール未登録の方") el.textContent = "体験用・デモ用のコードをお持ちの方"; });
    const nm = document.getElementById("lg-name");
    if (nm && /招待状に書かれた氏名/.test(nm.getAttribute("placeholder") || "") && !/任意/.test(nm.getAttribute("placeholder") || "")) {
      nm.setAttribute("placeholder", "ご担当者名（任意。招待された方は、招待状の氏名）");
    }
  }

  /* ───── ② 上の帯の会社名のボタン：切り替えの一覧と「貴社の商品に戻る」 ───── */
  function fixBar() {
    const dd = $(".bar .k-dd");
    if (!dd) return;
    const za = dd.querySelector('[data-z="a"]');
    if (!za) return;
    // 「貴社の商品に戻る」は、切り替えの区切りの中へ（帯の直下に置かれたままだと、刷新版の帯では見えない）
    const back = document.getElementById("v84smpBack");
    if (back && back.parentElement !== za) za.appendChild(back);
    let changed = false;
    $$(".k-ddr", dd).forEach((r) => {
      if (r.style.display !== "none") return;
      // 隠したままでは中の部品が「見えていない」と数えられる → いちど出してから、中の部品そのものを確かめる
      r.style.display = "";
      const has = Array.from(r.children).some(shown);
      if (!has) { r.style.display = "none"; return; }
      const h = r.previousElementSibling;
      if (h && h.tagName === "H4") h.style.display = "";
      changed = true;
    });
    if (changed && typeof RD.buildBar2 === "function") { try { RD.buildBar2(); } catch (e) { /* 無視 */ } }
  }

  /* ───── ③ 商品が0件のときの「次は」 ───── */
  const noProduct = () => { try { const T = RD.G("TENS"); return !(Array.isArray(T) && T.length > 0); } catch (e) { return false; } };
  function fixUpNext(w) {
    const b = $(".k-next", w);
    if (!b) return;
    const none = noProduct();
    const bb = $("b", b);
    if (none && b.dataset.kbc === "item") {
      b.dataset.v92eKbc = "item";
      b.removeAttribute("data-kbc");
      b.dataset.v92eDrop = "1";
      b.title = "次の手順：商品の資料をアップロードする（下の枠へ進みます）";
      if (bb) { b.dataset.v92eOld = bb.textContent; bb.textContent = "資料をアップロード（下の枠へ）"; }
    } else if (!none && b.dataset.v92eDrop) {
      b.dataset.kbc = b.dataset.v92eKbc || "item";
      delete b.dataset.v92eDrop;
      if (bb && b.dataset.v92eOld) bb.textContent = b.dataset.v92eOld;
      b.title = "次の手順：" + ((bb && bb.textContent) || "");
    }
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest(".k-next[data-v92e-drop]");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    try {
      const fin = document.getElementById("fin");
      const box = (fin && (fin.closest("label, .drop, .dz, [class*=drop]") || fin.parentElement)) || $("#well [class*=drop]");
      if (box) {
        box.scrollIntoView({ block: "center", behavior: "smooth" });
        box.classList.add("k92e-flash");
        setTimeout(() => box.classList.remove("k92e-flash"), 2200);
      }
    } catch (x) { /* 無視 */ }
  }, true);

  /* ───── ④ はじめてガイドの窓：刷新版での場所 ───── */
  const SLIDE_KEY = { s09: "up", s10: "up", s11: "item", s11b: "item", s12: "today", s13: "cty", s13b: "cty", s14: "ops:reg", s15: "deck", s16: "db", s17: "deal", s18: "deal", s18a: "msg", s18b: "msg", s18c: "msg",
    s19: "ops:doc", s19a: "ops:ship", s19b: "ops:ship", s20: "legal", s21: "docs", s22: "msg", s22b: "msg", s23: "team", s24: "task", s24b: "task", s25: "memo", s26: "dash:rep", s27: "dash:rep", s27b: "inbox",
    s27c: "deal", s27d: "rqp", s27e: "gloss", s27f: "trash", s28: "ai", s28a: "ai", s28b: "ai", s29: "ai" };
  let slideNow = "";
  function guideStrip() {
    const ov = document.getElementById("v40gd");
    if (!ov || ov.hidden) return;
    const dlg = $(".v40dlg", ov);
    if (!dlg) return;
    let s = $(".k92e-gd", dlg);
    if (!s) {
      s = document.createElement("div");
      s.className = "k92e-gd rd-x";
      s.setAttribute("role", "note");
      dlg.appendChild(s);
    }
    let id = slideNow;
    if (!id) { try { id = (typeof V40 !== "undefined" && V40 && V40.last) || ""; } catch (e) { id = ""; } } // eslint-disable-line no-undef
    const key = fwd() ? "" : SLIDE_KEY[id];
    const note = "このガイドの絵と道順は、刷新前の配置で書かれています";
    let html;
    if (key) {
      const p = pathOf(key);
      html = `<b>刷新版での場所</b><span class="k92e-gdp">${p.map((x, i) => (i ? '<i aria-hidden="true">›</i>' : "") + `<span>${esc(x)}</span>`).join("")}</span><small>${note}</small>`;
    } else {
      html = fwd() ? `<small>${note}</small>` : `<b>刷新版の左メニュー</b><span class="k92e-gdp"><span>案件／商品／タスク／やりとり／AI商社マン／困ったとき ＋ すべての機能</span></span><small>${note}（「ガイドバー」は、いまは見出しの右の「次は」ボタンです）</small>`;
    }
    if (s.dataset.h !== html) { s.innerHTML = html; s.dataset.h = html; }
  }
  window.addEventListener("message", (e) => {
    try {
      const d = e.data;
      if (!d || typeof d !== "object" || !d.bc20guide) return;
      if ((d.bc20guide === "page" || d.bc20guide === "ready") && typeof d.id === "string" && d.id) slideNow = d.id;
      guideStrip();
    } catch (x) { /* 無視 */ }
  });
  // 「使い方を見る」などで窓が開いたとき
  document.addEventListener("click", () => { setTimeout(() => { try { const ov = document.getElementById("v40gd"); if (ov && !ov.hidden) { try { slideNow = (typeof V40 !== "undefined" && V40 && V40.last) || slideNow; } catch (e) { /* 無視 */ } guideStrip(); } } catch (e) { /* 無視 */ } }, 150); }, true); // eslint-disable-line no-undef
  // 「くわしい版（はじめてガイド）」は、ログインしたあとは別のタブではなくこの窓で開く（上の「刷新版での場所」が付く）。Ctrl／中ボタンでは今までどおり別のタブ
  document.addEventListener("click", (e) => {
    try {
      const a = e.target.closest && e.target.closest('a[href="guide/"], a[href="guide/index.html"]');
      if (!a || locked() || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
      if (typeof v40Open !== "function") return; // eslint-disable-line no-undef
      e.preventDefault();
      slideNow = "s01";
      v40Open("s01", a); // eslint-disable-line no-undef
      setTimeout(guideStrip, 100);
    } catch (x) { /* 無視 */ }
  }, true);

  /* ───── ⑤ 商品一覧のカード：カードを押しても切り替わる ───── */
  function fixProdCards(w) {
    $$(".k-pc", w).forEach((c) => {
      if (c.dataset.v92e) return;
      const btn = $$(".k-pcacts button", c).find((b) => /商品情報/.test(b.textContent || ""));
      if (!btn) return;
      c.dataset.v92e = "1";
      c.classList.add("k92e-pc");
      c.title = "押すと、この商品に切り替えて、商品情報を開きます";
    });
  }
  document.addEventListener("click", (e) => {
    try {
      const c = e.target.closest && e.target.closest(".k-pc.k92e-pc");
      if (!c || e.target.closest("button, a, input, select, label, summary, [data-kact], abbr, .tm")) return;
      if (String(window.getSelection && window.getSelection()) !== "") return; // 文字を選んでいるときは動かさない
      const btn = $$(".k-pcacts button", c).find((b) => /商品情報/.test(b.textContent || ""));
      if (btn) btn.click();
    } catch (x) { /* 無視 */ }
  });

  /* ───── ⑥ 通知センターの上の札：同じ名前を1枚に ───── */
  function fixBellTiles() {
    const pn = document.getElementById("pn");
    if (!pn) return;
    $$(".k-tiles", pn).forEach((box) => {
      const seen = {};
      let removed = 0;
      $$(":scope > .k-tile", box).forEach((t) => {
        const l = $(".k-tl", t), n = $(".k-tn", t);
        if (!l || !n) return;
        const name = (l.textContent || "").trim();
        const num = parseInt((n.textContent || "").replace(/[^\d]/g, ""), 10);
        if (!name || isNaN(num)) return;
        if (seen[name]) {
          const n0 = $(".k-tn", seen[name].el);
          seen[name].num += num;
          const sm = n0.querySelector("small");
          const txt = Array.from(n0.childNodes).find((x) => x.nodeType === 3);
          if (txt) txt.nodeValue = String(seen[name].num); else n0.insertBefore(document.createTextNode(String(seen[name].num)), sm || null);
          if (t.classList.contains("hot")) seen[name].el.classList.add("hot");
          t.remove(); removed++;
        } else seen[name] = { el: t, num };
      });
      if (removed) { const left = $$(":scope > .k-tile", box).length; box.style.setProperty("--n", String(left)); }
    });
  }

  /* ───── ⑦ はじめての窓・用語集 ───── */
  function fixWelcome() {
    const v = document.getElementById("welv");
    if (!v) return;
    $$("span, p", v).forEach((el) => {
      if (el.children.length === 0 && (el.textContent || "").trim() === "どの画面でも、見出しの右の「次は」のボタンが、次にやることを教えてくれます。") {
        el.textContent = "「案件」（ホーム）と、商品・販売先の国・規制・営業資料・バイヤーの画面では、見出しの右の「次は」のボタンが、次にやることを教えてくれます。";
      }
    });
  }
  let prevKey = "", lastKey = "";
  // 用語集に足す語（インコタームズ 2020 の残り4つと、決済の D/P・D/A）。一覧にだけ足す（画面の文字への印は付けない）
  const GL_ADD = [
    ["FAS", "船側渡し。輸出港で、本船の横（岸壁やはしけの上）に貨物を置くまでが売り手の負担です。船に積む費用と、その先の運賃・保険は買い手が持ちます。主に、ばら積みの貨物で使います。"],
    ["CPT", "輸送費込み。売り手が、指定の仕向地までの運賃を払います。貨物のリスクは、最初の運送人に引き渡した時点で買い手に移ります（保険は付きません）。"],
    ["CIP", "輸送費保険料込み。CPT に、売り手が手配する貨物保険を足した条件です。コンテナ・航空など、どの輸送手段でも使えます。"],
    ["DPU", "荷卸込持込渡し。指定の仕向地で、貨物を荷卸しして引き渡すまでが売り手の負担です。輸入の通関と関税は買い手が持ちます。"],
    ["D/P", "支払渡し。銀行を通じて、買い手が代金を支払うのと引き換えに船積書類を渡す決済方法です（L/C のような銀行の支払保証はありません）。"],
    ["D/A", "引受渡し。買い手が期限付きの手形を引き受けると船積書類を渡し、代金は期日に支払われる決済方法です。売り手にとっては、D/P より回収のリスクが大きくなります。"],
  ];
  function fixGlossList(w) {
    const ul = $("#v90gll", w);
    if (!ul || ul.dataset.v92e) return;
    ul.dataset.v92e = "1";
    const lis = () => $$(":scope > li", ul);
    const nameOf = (li) => ((li.querySelector("b") || {}).textContent || "").trim();
    // 「仕向け国」と「仕向国」は同じ語 → 1つにまとめる
    const a = lis().find((li) => nameOf(li) === "仕向け国"), b = lis().find((li) => nameOf(li) === "仕向国");
    if (a && b) {
      const bb = a.querySelector("b"), p = a.querySelector("p");
      if (bb) bb.textContent = "仕向け国（仕向国）";
      if (p) p.textContent = "商品を送る先の国（輸出先の国）のことです。「仕向国」とも書きます。";
      a.dataset.q = (a.dataset.q || "") + " 仕向国";
      ul.removeChild(b);
    }
    const have = {};
    lis().forEach((li) => { have[nameOf(li)] = 1; });
    GL_ADD.forEach(([n, s0]) => {
      if (have[n]) return;
      const li = document.createElement("li");
      li.className = "k92e-gl";
      li.dataset.q = (n + " " + s0).toLowerCase();
      li.innerHTML = `<b>${esc(n)}</b><p>${esc(s0)}</p>`;
      const next = lis().find((x) => nameOf(x).localeCompare(n, "ja") > 0);
      ul.insertBefore(li, next || null);
    });
    const h = $("#v90glt", w);
    if (h) h.textContent = h.textContent.replace(/（\d+語）/, `（${lis().length}語）`);
  }
  function fixGloss(w) {
    try { fixGlossList(w); } catch (e) { /* 無視 */ }
    // 用語集の画面の中の「（一覧は「用語集」）」のリンクは、いま居る画面なので押せなくする
    $$(".k-link[data-kgloss]", w).forEach((b) => { if (!b.dataset.v92e) { b.dataset.v92e = "1"; b.disabled = true; b.classList.add("k92e-here"); b.title = "いま開いている画面です"; } });
    // 「← 外国語 営業資料」は、営業資料から来たときだけ。ほかの画面から来たときは、その画面へ戻る
    const a = $('a[data-v83go="deck"]', w);
    if (a && prevKey && prevKey !== "deck" && prevKey !== "gloss") {
      const p = pathOf(prevKey);
      const nm = p[p.length - 1];
      if (nm && a.dataset.v92eBack !== prevKey) { a.dataset.v92eBack = prevKey; a.textContent = "← " + nm; }
    }
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[data-v92e-back]");
    if (!a) return;
    e.preventDefault(); e.stopPropagation();
    try { RD.goKey(a.dataset.v92eBack); } catch (x) { /* 無視 */ }
  }, true);

  function apply() {
    try { fixWelcome(); } catch (e) { /* 無視 */ }
    try { fixBar(); } catch (e) { /* 無視 */ }
    try { fixBellTiles(); } catch (e) { /* 無視 */ }
    try { guideStrip(); } catch (e) { /* 無視 */ }
    if (locked()) { try { fixLogin(); } catch (e) { /* 無視 */ } return; }
    const w = $("#well");
    if (!w) return;
    const k = curKey();
    if (k !== lastKey) { prevKey = lastKey; lastKey = k; }
    if (fwd()) return;
    if (k === "up") fixUpNext(w);
    if (k === "dash:prod") fixProdCards(w);
    if (k === "gloss") fixGloss(w);
  }
  const prev = RD.after;
  RD.after = function () {
    const r = prev.apply(this, arguments);
    try { apply(); } catch (e) { console.error("[rd v92entry]", e); }
    return r;
  };
  // ログイン画面・上の帯・通知の窓は、#well の描き直しの外で変わる
  setInterval(() => { try { if (locked()) fixLogin(); else { fixBar(); fixBellTiles(); const w = $("#well"); if (w && curKey() === "up") fixUpNext(w); } fixWelcome(); } catch (e) { /* 無視 */ } }, 900);
  try { apply(); } catch (e) { /* 最初の描画の前 */ }
})();
