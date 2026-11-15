/* 貿易クラウドAI商社マン 21.92 r4b の刷新版の層（いちばん後ろに読む）
   ① health-M13：ホームの「はじめの設定 n/6 次：商談を進める」の札を押しても何も起きない（行き先が今の画面）
      → 下の「これまでのダッシュボード」を開いて、はじめの設定の欄まで送る
   ほかは下の各ブロックの頭に書く */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92r4b) return;
  RD._v92r4b = 1;
  const { $, $$, esc } = RD;
  const safe = (fn) => { try { return fn(); } catch (e) { return undefined; } };
  const A = () => window.v92r4b || {};
  const M = (ja, en, zh, es) => (A().M ? A().M(ja, en, zh, es) : ja);
  const G = (n) => { try { return RD.G ? RD.G(n) : undefined; } catch (e) { return undefined; } };

  /* ① はじめの設定の札 */
  document.addEventListener("click", (e) => {
    try {
      const b = e.target.closest && e.target.closest(".k-pills .k-pill[data-kbc]");
      if (!b || !/はじめの設定|Getting started|Setup|入门设置|Configuración inicial/i.test(b.textContent || "")) return;
      const k = b.dataset.kbc, now = safe(() => RD.curKey());
      if (k && now && k !== now && !(k === "dash" && /^dash:home/.test(now))) return; // 別の画面へ行く札は今までどおり
      const old = $("details.k-oldb");
      if (!old) return;
      e.preventDefault(); e.stopImmediatePropagation();
      old.open = true;
      const t = $("#ux32setup", old) || old;
      setTimeout(() => {
        try {
          t.scrollIntoView({ block: "start", behavior: "smooth" });
          t.classList.add("k92r4b-flash");
          setTimeout(() => t.classList.remove("k92r4b-flash"), 2600);
        } catch (x) { /* 無視 */ }
      }, 60);
    } catch (x) { /* 無視 */ }
  }, true);

  const isFwd = () => { const S = G("SES"); return !!(S && (S.role === "fwd" || S.t === "fwd")); };
  const walk = (root, fn) => {
    try {
      const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const L = []; let n;
      while ((n = tw.nextNode())) L.push(n);
      L.forEach(fn);
    } catch (e) { /* 無視 */ }
  };

  /* ② culture-N07：足した商材カテゴリー（文化・教育用品・ペット用品 など）が、道筋の目安・物差しでは「その他」とだけ出る
        → 「その他」が、この商材の専用の区分が無いときの共通の区分であることを書く（数字・物差しそのものは変えない） */
  function fixOther(w) {
    const T = G("TEN");
    const cat = String((T && T.cat) || "").trim();
    if (!cat || /^(その他|未分類)$/.test(cat)) return;
    const shelf = cat === "文化・教育用品"; // culture-M09：食品でない商材の「賞味期限・保証期間」→「保証・品質の条件」
    const all = w.textContent || "";
    if (all.indexOf("その他（共通の物差し）") < 0 && all.indexOf("似た商材（その他）") < 0 && !(shelf && all.indexOf("賞味期限・保証期間") >= 0)) return;
    walk(w, (n) => {
      const s = n.nodeValue;
      if (!s) return;
      if (shelf && s.indexOf("賞味期限・保証期間") >= 0) { n.nodeValue = s.replace(/賞味期限・保証期間/g, "保証・品質の条件"); return; }
      if (s.indexOf("その他") < 0) return;
      let t = s;
      t = t.replace(/似た商材（その他）の STANDAGE の記録 (\d+)案件から/, (m, a) => `STANDAGE の記録 ${a}案件（さまざまな業種を含む区分「その他」。「${cat}」だけの記録はまだありません）から`);
      t = t.replace(/その他（共通の物差し）/g, `共通の物差し（「${cat}」専用の物差しはまだありません）`);
      if (t !== s) n.nodeValue = t;
    });
  }

  /* ③ other-N17：荷主のメンバーの画面の「誰が何をできる？」に、物流会社向けの言葉（レート・見積）が出る → 荷主の言葉に */
  function fixTeam(w) {
    if (isFwd()) return;
    $$(".k-tile .k-ts", w).forEach((el) => {
      const s = (el.textContent || "").trim();
      if (s === "招待・担当・役割・停止・削除。全部の案件とレートの管理") el.textContent = "メンバーの招待・担当する商品の割り当て・役割の変更・停止・削除。すべての商品と案件を扱えます";
      else if (s === "見る・投稿する・担当の仕事（割り当てられた見積・案件に対応）") el.textContent = "担当する商品の案件を見る・やりとりに投稿する（担当する商品は、招待のときに管理者が選びます）";
    });
  }

  /* ④ food-N13：リストを作ったあとも、上の札が「最新のリスト：0件」→ 最新のリストの相手の数（leads）を出す */
  function fixDbRun(w) {
    const T = G("TEN");
    const runs = safe(() => ((T || {}).v71ob || {}).runs) || [];
    const last = runs[runs.length - 1];
    const n = last ? (last.leads || last.list || last.items || last.rows || last.cands || []).length : 0;
    if (!n) return;
    $$("p", w).forEach((p) => { if (p.children.length === 0 && /^最新のリスト：0件$/.test((p.textContent || "").trim())) p.textContent = `最新のリスト：${n}件`; });
  }

  /* ⑤ other-13・indagri-10：ホームに「次にやること」が同時に3つ（右上「＋ バイヤーを探す」・提案の「目標を入れる」・「はじめの設定 n/6 次：…」）
        → はじめの設定が終わるまでは、主のボタンは「はじめの設定 次：…」の1つにする（ほかの2つは消さず、控えめな見た目に） */
  function fixHomeOne(w) {
    const pill = $$(".k-pills .k-pill[data-kbc]", w).find((p) => /はじめの設定|Getting started|Setup/.test(p.textContent || ""));
    const hero = $(".k-hcta", w);
    const prop = $$(".v88prop .btn, [class*='v88prop'] .btn", w).filter((b) => !b.classList.contains("g"));
    if (pill) {
      pill.classList.add("k92r4b-main");
      if (hero && pill.dataset.kbc !== hero.dataset.kbc) hero.classList.add("k92r4b-sub"); else if (hero) hero.classList.remove("k92r4b-sub");
      prop.forEach((b) => { b.classList.add("g"); b.dataset.k92r4bDem = "1"; });
    } else {
      if (hero) hero.classList.remove("k92r4b-sub");
      $$("[data-k92r4b-dem]", w).forEach((b) => { b.classList.remove("g"); delete b.dataset.k92r4bDem; });
    }
  }

  const old = RD.after;
  RD.after = function () {
    const r = old.apply(this, arguments);
    try {
      const w = document.getElementById("well") || document.querySelector(".stage") || document.body;
      const k = RD.curKey ? RD.curKey() : "";
      if (!isFwd()) {
        if (k === "ai" || k === "rm" || k === "dash:rep" || k === "dash:home" || k === "dash" || k === "today" || k === "item" || k === "up" || k === "task" || k === "dash:prod") fixOther(w);
        if (k === "dash:home" || k === "dash") fixHomeOne(w);
        if (k === "team") fixTeam(w);
        if (k === "db") fixDbRun(w);
      }
      // ⑥ cross-10：物流会社の見積受信箱は、依頼の表が1画面目に入るよう、上の札と表の行を詰める（中身は消さない。見た目は CSS）
      if (w.classList) w.classList.toggle("k92r4b-fin", isFwd() && k === "finbox");
      if (isFwd() && k === "finbox") safe(() => {
        // 見本の会社の説明：1行にたたむ（押すと全文）
        const bar = $(":scope > p.k-v90smpbar", w);
        if (bar && !bar.dataset.k92r4b) {
          bar.dataset.k92r4b = "1"; bar.classList.add("k92r4b-clamp"); bar.setAttribute("tabindex", "0"); bar.title = bar.textContent || "";
          const tg = (e) => { if (e.target.closest && e.target.closest("abbr,button,a")) return; bar.classList.toggle("k92r4b-clamp"); };
          bar.addEventListener("click", tg);
          bar.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tg(e); } });
        }
        // 「AI物流マン（内蔵エンジン）」「レート・AI設定」を、上の「AIが自動で見積回答します」の札の右へ（1段ぶん詰める）
        const card = $(":scope > [data-rdfin] .rd-card", w), ph = $(":scope > .ph", w);
        const rw = ph && ph.lastElementChild && ph.lastElementChild.classList.contains("rw") ? ph.lastElementChild : null;
        if (card && rw && rw.children.length) {
          let box = $(".k92r4b-phr", card);
          if (!box) { box = document.createElement("span"); box.className = "k92r4b-phr"; card.appendChild(box); }
          Array.from(rw.children).forEach((c) => box.appendChild(c));
          ph.classList.add("k92r4b-phempty");
        }
      });
      if (RD._r4bPages) RD._r4bPages.forEach((f) => { try { f(w, k); } catch (e) { console.error("[rd v92r4b]", e); } });
    } catch (e) { console.error("[rd v92r4b]", e); }
    return r;
  };
  RD._r4bPages = [];
})();
