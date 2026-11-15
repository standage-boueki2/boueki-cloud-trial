/* 貿易クラウドAI商社マン 21.92 per（刷新版の層・rd_v91smp.js のあとに読む）
   2026-11-14 の「8カテゴリー×ペルソナ評価」（食品／生活用品／工業・農業／健康・美容／医療・衛生／自動車・建機／文化・教育／その他 ×
   貿易素人・少し経験者・商社経験豊富、＋物流会社・ログイン・スマホ・言語・管理者）で見つかった、刷新版だけの課題の直し。
   今のアプリの関数・刷新版の前の層は差し替えず、RDX.after を包む（rd_v89fwd.js などと同じ形）。数字はアプリが持っているものだけ。
   ① 左のメニュー「すべての機能」の札（未読・対応待ちの合計）が、絵と「す」の字に重なっていた → ボタンの右上の角へ（rd_v92per.css）
   ② タスク（今日やること）の「停滞中の案件」：一覧は3件までなのに、札も「3件」と出て、下の見直しの件数（全件）と食い違った → 札は全件・一覧は「ほか N件」
   ③ 商品の登録・商品情報の「AIヒアリング」の箱：商材カテゴリーの質問の選択肢が先頭の4つだけ出て、ほかの業種は選べないように見えた
      → 8つの大カテゴリー（本体の層 logic_v2192cat の V92_GROUPS）を出す
   ④ 販売先国の選定：上位3か国のカードとレーダーが、データの無い観点を「0」（赤）と出し、下の表の「未評価」と食い違った → 「未評価」に。
      国の詳細を開くと上のカードが「選択中 0／3」になり、詳細は画面の下に出ていた → 詳細の間は上のカードをたたみ、詳細の見出しへ送る
   ⑤ 「？ 説明」が2つ並ぶ → 同じ場所の説明は1つの「？」にまとめる
   ⑥ AIヒアリングの箱：選択肢が押せるボタンに見える・質問が途中で切れる → 「選択肢の例」の見た目に・切れた文には「…」
   ⑦ 右下の「AI商社マンに聞く」が表やボタンに重なる → 下へ送ったら丸い小さなボタンに・画面のいちばん下に余白 */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92per) return;
  RD._v92per = 1;
  const { $, $$, esc } = RD;
  const DAY = 864e5;
  const threads = () => { try { return RD.dbThreads() || []; } catch (e) { return []; } };
  const isStale = (x) => x.at && (Date.now() - x.at) / DAY >= 30 && RD.stShort(x.st) !== "失注" && RD.stShort(x.st) !== "取引中";
  const drop = (el) => { if (el && el.parentNode) el.parentNode.removeChild(el); };

  /* ② タスク（今日やること）：停滞中の案件の件数 */
  function fixToday(w) {
    const card = $$(".rd-x .k-card", w).find((c) => { const h = $("h2, h3", c); return h && /停滞中の案件/.test(h.textContent || ""); });
    if (!card || card.dataset.v92) return;
    const all = threads().filter(isStale);
    const shown = $$(".k-rows > .k-row", card).length;
    card.dataset.v92 = "1";
    if (all.length <= shown) return;
    const tag = $$(".k-tag", card).find((t) => /^\d+件$/.test((t.textContent || "").trim()));
    if (tag) tag.textContent = all.length + "件";
    const rows = $(".k-rows", card);
    if (rows && !$(".k-v92more", card)) rows.insertAdjacentHTML("afterend", '<p class="k-v92more">ほか ' + (all.length - shown) + "件（下の「動きのない相手の見直し」に全部あります）</p>");
  }

  /* ③ AIヒアリングの箱：商材カテゴリーの質問は 8つの大カテゴリーで見せる */
  function fixHearCats(w) {
    const G8 = window.V92_GROUPS;
    if (!Array.isArray(G8)) return;
    $$("[data-rdprod] .rd-warm > div", w).forEach((q) => {
      if (q.dataset.v92 || !/商材カテゴリ/.test(q.textContent || "")) return;
      const tags = $$(".rd-tag", q);
      if (!tags.length) return;
      q.dataset.v92 = "1";
      const box = tags[0].parentElement;
      box.setAttribute("data-noi18n", "");
      box.innerHTML = G8.map((g) => '<span class="rd-tag bl k-v92cat" title="' + esc(g.hint) + '">' + esc(g.ja) + "</span>").join("");
      box.insertAdjacentHTML("afterend", '<p class="k-v92catn">8つの分類から、近いものを選べます（細かい種類はそのあとで）。</p>');
    });
  }

  /* ④ 販売先国の選定：データの無い観点は「0」ではなく「未評価」（下の表・詳細と同じ言い方に） */
  const AXK = { 市場性: "mkt", 規制: "reg", 競合: "comp", 拠点: "base" };
  const isNA = (sc, k) => !sc || sc[k] == null || (Array.isArray(sc.na) && sc.na.indexOf(k) >= 0);
  function fixCty(w) {
    const box = $(".rd-x.rd-p2", w);
    if (!box) return;
    // 国の詳細（国別戦略）を開いている間は、上のおすすめのカードをたたむ（選択中 0／3 と出て、選んだ国が消えたように見えていた）
    const deep = $$("[data-onclick]", w).some((b) => !b.closest(".rd-x") && /ctyDeepClose/.test(b.getAttribute("data-onclick") || ""));
    box.classList.toggle("k-v92deep", deep);
    if (deep) {
      if (!$(".k-v92deepn", box)) box.insertAdjacentHTML("afterbegin", '<p class="k-v92deepn">国別の詳細を表示しています。おすすめの3か国と選択中の国は、下の「← 一覧へ戻る」で戻ると表示されます（選んだ国はそのまま残っています）。</p>');
      if (!w.dataset.v92deep) {
        w.dataset.v92deep = "1";
        const h = $$(".lbl", w).find((x) => /COUNTRY DEEP-DIVE/.test(x.textContent || ""));
        if (h) setTimeout(() => { try { h.scrollIntoView({ block: "start" }); window.scrollBy(0, -90); } catch (e) { /* 無視 */ } }, 60);
      }
      return;
    }
    delete w.dataset.v92deep;
    const all = RD.recCty ? RD.recCty() : [];
    const rows = [];
    $$(".k-tiles > .k-card", box).forEach((card) => {
      const btn = $("[data-rdcty]", card);
      const r = btn ? all.find((x) => x.c === btn.getAttribute("data-rdcty")) : null;
      if (!r || !r.sc) return;
      rows.push(r);
      if (card.dataset.v92) return;
      card.dataset.v92 = "1";
      $$("[title]", card).forEach((cell) => {
        const m = /^(市場性|規制|競合|拠点)：/.exec(cell.getAttribute("title") || "");
        if (!m || !isNA(r.sc, AXK[m[1]])) return;
        const b = $("b", cell);
        if (b) { b.textContent = "未評価"; b.classList.add("k-v92na"); b.style.color = ""; }
        cell.setAttribute("title", m[1] + "：未評価（この国のデータが無いため、配点から外しています。0点ではありません）");
      });
    });
    // レーダー：未評価の観点には線を引かない（0点に見えないように）
    const svg = $('svg[aria-label="主要指標の比較"]', box);
    if (svg && !svg.dataset.v92 && rows.length) {
      svg.dataset.v92 = "1";
      const AX = ["mkt", "reg", "comp", "base"], cx = 150, cy = 135, R = 100, col = ["#F57C0F", "#1F6FD1", "#14995A"];
      const pt = (i, v) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 4, r = (R * Math.max(0, Math.min(100, v))) / 100; return [(cx + r * Math.cos(a)).toFixed(1), (cy + r * Math.sin(a)).toFixed(1)]; };
      if (rows.some((r) => AX.some((k) => isNA(r.sc, k)))) {
        $$("polygon[fill-opacity]", svg).forEach(drop);
        let g = "";
        rows.forEach((r, j) => {
          const P = AX.map((k, i) => (isNA(r.sc, k) ? null : pt(i, +r.sc[k] || 0))).filter(Boolean);
          if (P.length >= 3) g += '<polygon points="' + P.map((x) => x.join(",")).join(" ") + '" fill="' + col[j] + '" fill-opacity=".14" stroke="' + col[j] + '" stroke-width="2.2"/>';
          else if (P.length === 2) g += '<polyline points="' + P.map((x) => x.join(",")).join(" ") + '" fill="none" stroke="' + col[j] + '" stroke-width="2.2"/>';
          P.forEach((x) => { g += '<circle cx="' + x[0] + '" cy="' + x[1] + '" r="3.2" fill="' + col[j] + '"/>'; });
        });
        svg.insertAdjacentHTML("beforeend", g);
        const naAll = AX.filter((k) => rows.every((r) => isNA(r.sc, k)));
        const names = { mkt: "市場性", reg: "規制", comp: "競合", base: "拠点" };
        if (!$(".k-v92nan", box) && naAll.length) svg.insertAdjacentHTML("afterend", '<p class="k-v92nan">' + esc(naAll.map((k) => names[k]).join("・")) + "は未評価です（この国のデータが無いため、点を付けず、総合点の配点からも外しています）。</p>");
      }
    }
  }

  /* ⑤ 「？ 説明」が2つ並ぶ：同じ場所の説明は1つの「？」にまとめる */
  function mergeQlines(w) {
    const seen = new Map();
    $$(".k-qline", w).forEach((ql) => {
      const par = ql.parentElement;
      const first = seen.get(par);
      if (!first) { seen.set(par, ql); return; }
      // 間に見える本文をはさまないときだけ、前の「？」へまとめる
      let n = first.nextElementSibling, between = false;
      while (n && n !== ql) {
        if (!n.classList.contains("k-qhide") && !n.classList.contains("k-qline") && (n.textContent || "").trim() && n.offsetParent !== null) { between = true; break; }
        n = n.nextElementSibling;
      }
      if (between) { seen.set(par, ql); return; }
      const q0 = $(".k-q", first), q = $(".k-q", ql);
      if (q0 && q) q0.dataset.kq = (q0.dataset.kq || "") + "\n\n" + (q.dataset.kq || "");
      drop(ql);
    });
  }

  /* ⑥ AIヒアリングの箱：選択肢は「例」の見た目に（押せるボタンに見えていた）。途中で切れた質問には「…」 */
  function fixHearCard(w) {
    $$("[data-rdprod] .rd-warm > div", w).forEach((q) => {
      if (q.dataset.v92h) return;
      const bs = $$(":scope > b", q);
      if (bs.length < 2) return;
      q.dataset.v92h = "1";
      const t = bs[1];
      const tx = (t.textContent || "").trim();
      if (tx.length >= 46 && !/[？?。]$/.test(tx)) t.textContent = tx + "…";
      const tags = $$(".rd-tag", q);
      if (tags.length && !tags[0].classList.contains("k-v92cat")) {
        tags.forEach((x) => x.classList.add("k-v92ex"));
        if (!$(".k-v92exl", q)) tags[0].parentElement.insertAdjacentHTML("afterbegin", '<span class="k-v92exl">選択肢の例：</span>');
      }
    });
  }

  /* ⑦ 右下の「AI商社マンに聞く」：下へ送ったら丸い小さなボタンにする（表やボタンに重なる面積を減らす） */
  function fabWatch() {
    if (RD._v92fab) return;
    RD._v92fab = 1;
    const upd = () => { const f = document.getElementById("askfab"); if (f) f.classList.toggle("k-v92min", (window.scrollY || 0) > 160); };
    window.addEventListener("scroll", upd, { passive: true });
    upd();
  }

  /* ⑧ はじめての窓：「画面上部のオレンジのバーが…」は今の版の言い方。刷新版では見出しの右の「次は」のボタン */
  function fixWelcome() {
    const v = document.getElementById("welv");
    if (!v || v.dataset.v92) return;
    v.dataset.v92 = "1";
    $$("span, p", v).forEach((el) => {
      if (el.children.length === 0 && /オレンジのバー/.test(el.textContent || "")) el.textContent = "どの画面でも、見出しの右の「次は」のボタンが、次にやることを教えてくれます。";
    });
  }

  function apply() {
    try { fixWelcome(); } catch (e) { /* 無視 */ }
    if (RD.locked && RD.locked()) return;
    const w = $("#well");
    if (!w) return;
    const k = RD.curKey();
    if (k === "today") fixToday(w);
    if (k === "up" || k === "item") { fixHearCats(w); fixHearCard(w); }
    if (k === "cty") fixCty(w);
    mergeQlines(w);
    fabWatch();
  }
  const prev = RD.after;
  RD.after = function () {
    const r = prev.apply(this, arguments);
    try { apply(); } catch (e) { console.error("[rd v92per]", e); }
    return r;
  };
  try { apply(); } catch (e) { /* 最初の描画の前 */ }
})();
