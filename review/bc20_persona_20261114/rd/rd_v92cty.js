/* 貿易クラウドAI商社マン 21.92 cty の刷新版の層（rd_v92per.js のあとに読む）
   2026-11-14 の「8カテゴリー×ペルソナ評価」のうち、販売先国の選定（cty）の刷新版だけの直し。
   共通の層（rd_v92per.js ④）が済ませた分（カード・レーダーの「未評価」、国の詳細の間は上のカードをたたむ）には重ねない。
   今のアプリの関数・刷新版の前の層は差し替えず、RDX.after を包む。数字はアプリが持っているものだけ（本体の層 logic_v2192cty の v92ctyInfo）。
   ① 上の「選択中の販売先国」の帯・カードと、下の表のチェックが連動しなかった（auto-10・indagri-05）
      → 表のチェックを変えたら帯とカードを描き直す。カード・帯で変えた分は、本体の層の「選んだ国」（ctySel.v92pick）に写す
   ② おすすめのカード：内蔵の採点（AI 未接続）のときの決め方（進出希望国を先に・データ不足の国は入れない）に合わせて、
      見出し（まず検討する N か国）・札（進出希望国／データ不足）・決め方の説明・「入れていない国」を出す（auto-12・indagri-02・medical-05）
   ③ 「AI商社マンにおまかせ（1クリック）」が上下に2つ（daily-21・health-13・indagri-16）→ 上の大きいボタンがある間は、下の同じボタンを隠す
   ④ レーダーの軸の名前（規制・競合）が図形に重なる（daily-20）→ 軸の外へ。3か国とも未評価の軸は、名前の下に「未評価」
   ⑤ 比較の表の見出しが、送ると行に重なる（health-10）→ 見出しの固定をやめる（rd_v92cty.css）
   足す文言は、画面の言語（日本語・英語・中国語・スペイン語）に合わせて出す（M()。足した部品には data-noi18n） */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92cty) return;
  RD._v92cty = 1;
  const { $, $$, esc, I } = RD;
  const fn = (n) => { try { return typeof window[n] === "function" ? window[n] : null; } catch (e) { return null; } };
  const info = () => { try { const f = fn("v92ctyInfo"); return f ? f() : null; } catch (e) { return null; } };
  const orig = (w, sel) => $$(sel, w).filter((x) => !x.closest(".rd-x"));
  const isDeep = (w) => orig(w, "[data-onclick]").some((b) => /ctyDeepClose/.test(b.getAttribute("data-onclick") || ""));
  const recAll = () => { try { return RD.recCty ? RD.recCty() : []; } catch (e) { return []; } };
  const AXK = ["mkt", "reg", "comp", "base"];
  // 言語：この層が足す文言は、画面の言語に合わせて出す（足した部品には data-noi18n を付け、辞書の訳は通さない）
  const lang = () => { try { const v = String((typeof I18N !== "undefined" && I18N && I18N.lang) || "ja"); return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja"; } catch (e) { return "ja"; } }; // eslint-disable-line no-undef
  const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? en : l === "zh" ? zh || en : l === "es" ? es || en : ja; };
  const tc = (c) => { try { const f = fn("v30T"); return lang() !== "ja" && f ? String(f(c) || c) : c; } catch (e) { return c; } };
  const isNA = (sc, k) => !sc || sc[k] == null || (Array.isArray(sc.na) && sc.na.indexOf(k) >= 0);

  /* ① 表のチェック ⇔ 帯・カード */
  function syncFromDom() { try { const f = fn("v92ctyPickFromDom"); if (f && f()) { const p = fn("v92ctySelPaint"); if (p) p(); } } catch (e) { /* 無視 */ } }
  document.addEventListener("v92ctypick", () => {
    try {
      if (RD.locked && RD.locked()) return;
      if (RD.curKey() !== "cty") return;
      const a = document.activeElement;
      const el = a && a.matches && a.matches("input[data-ctypick]") ? a : null;
      const y0 = el ? el.getBoundingClientRect().top : null;
      RD.after(true);
      // 上の部品の高さが変わっても、押したチェックが画面の同じ位置に残るように（あとから入る飾り＝用語の印などの分も、少し待ってもう一度）
      const keep = () => { try { if (!el || y0 == null || !el.isConnected) return; const d = el.getBoundingClientRect().top - y0; if (Math.abs(d) > 1 && Math.abs(d) < 600) window.scrollBy(0, d); } catch (e) { /* 無視 */ } };
      keep(); setTimeout(keep, 120); setTimeout(keep, 420);
    } catch (e) { console.error("[rd v92cty] sync", e); }
  });
  // カードの下の「選択する」（入れていない国）：下の表のチェックを押すのと同じ（3か国までの確かめも同じ道を通る）
  function tick(w, c) {
    const b = orig(w, "input[data-ctypick]").find((x) => x.dataset.ctypick === c);
    if (!b) return;
    if (b.disabled) {
      // 確定のあと：今の版の「選び直す」と同じ道（確定していた国にチェックが入った状態に戻る）を通してから
      try { if (typeof toast === "function") toast(M("確定のあとは、先に「選び直す」を押してください（確定していた国にチェックが入った状態に戻ります）", "After confirming, press “Choose again” first (the confirmed countries come back ticked).", "确定后，请先点击“重新选择”（已确定的国家会恢复为勾选状态）。", "Tras confirmar, pulse primero «Elegir de nuevo» (los países confirmados vuelven marcados).")); } catch (e) { /* 無視 */ } // eslint-disable-line no-undef
      return;
    }
    b.focus({ preventScroll: true });
    b.click();
  }

  /* ② おすすめのカード */
  function fixCards(w, box, N) {
    const all = recAll();
    const rankOf = (c) => all.findIndex((r) => r.c === c) + 1;
    const tiles = $$(".k-tiles > .k-card", box).filter((c) => $("[data-rdcty]", c));
    if (!tiles.length) return;
    const warm = tiles[0].closest("section.k-card");
    const T = {
      hope: M("進出希望国", "Target market", "目标市场", "Mercado objetivo"), hopeT: M("商品の登録で選んだ進出希望国です", "A target market you chose at product registration", "商品登记时选择的目标市场", "Mercado objetivo elegido en el registro"),
      thin: M("データ不足", "Insufficient data", "数据不足", "Datos insuficientes"), thinT: M("市場性と競合がどちらも未評価です。総合点は、規制と拠点の2つの観点だけで出しています", "Market and Competition are both not rated. The total comes only from Regulation and Base", "市场性和竞争均未评估。综合分仅由法规和据点两项得出", "Mercado y Competencia sin evaluar. El total sale solo de Regulación y Base"),
      notHope: M("進出希望国ではない", "not a target market", "非目标市场", "no es mercado objetivo"),
    };
    tiles.forEach((card, i) => {
      if (card.dataset.v92c) return;
      card.dataset.v92c = "1";
      const c = $("[data-rdcty]", card).getAttribute("data-rdcty");
      const tags = $$(":scope > .k-tag", card);
      const abs = tags.find((t) => /position:\s*absolute/.test(t.getAttribute("style") || ""));
      const rk = tags.find((t) => t !== abs);
      if (N.rule && abs && rankOf(c) !== 1) abs.remove(); // 「総合点が最も高い」は、総合1位の国にだけ
      let h = "";
      if (N.hope.indexOf(c) >= 0) h += `<span class="k-tag bl k-v92hope" title="${esc(T.hopeT)}">${esc(T.hope)}</span>`;
      if (N.thin.indexOf(c) >= 0) h += `<span class="k-tag gy k-v92thin" title="${esc(T.thinT)}">${esc(T.thin)}</span>`;
      // 札は、順位の札の下の1行に（国によって札の数が違っても、国名の高さがそろうように）
      if (rk && (N.hope.length || N.thin.length)) rk.insertAdjacentHTML("afterend", '<div class="k-v92tags" data-noi18n>' + h + "</div>");
    });
    if (!N.rule || !warm || warm.dataset.v92r) return;
    warm.dataset.v92r = "1";
    const h2 = $(".k-h h2", warm);
    const n3 = tiles.length;
    if (h2) { h2.textContent = M("まず検討する " + n3 + "か国", n3 + (n3 > 1 ? " countries" : " country") + " to consider first", "优先考虑的" + n3 + "个国家", n3 + (n3 > 1 ? " países" : " país") + " para considerar primero"); h2.setAttribute("data-noi18n", ""); }
    const tg = $$(".k-h .k-tag", warm).find((x) => /総合点の高い順/.test(x.textContent || ""));
    if (tg) {
      tg.classList.add("k-v92wrap"); tg.setAttribute("data-noi18n", "");
      const t = Array.from(tg.childNodes).find((n) => n.nodeType === 3 && /総合点の高い順/.test(n.nodeValue || ""));
      if (t) t.nodeValue = N.hope.length
        ? M("進出希望国を先に・残りは総合点の高い順（AI商社マンの判断の前）", "Your target markets first, then by total score (before the AI Trade Agent's judgement)", "目标市场优先・其余按综合分排序（AI商社专员判断之前）", "Primero sus mercados objetivo; el resto por puntuación total (antes del juicio del Agente IA)")
        : M("データのある国を総合点の高い順（AI商社マンの判断の前）", "Countries with data, by total score (before the AI Trade Agent's judgement)", "有数据的国家按综合分排序（AI商社专员判断之前）", "Países con datos, por puntuación total (antes del juicio del Agente IA)");
    }
    const sc = (c) => { const r = all.find((x) => x.c === c); return r && r.sc ? Math.round(r.sc.total || 0) : null; };
    const chip = (c, why) => {
      const on = N.pick.indexOf(c) >= 0;
      const meta = M("総合 " + sc(c) + "点・" + rankOf(c) + "位", "Total " + sc(c) + " · rank " + rankOf(c), "综合 " + sc(c) + "分・第" + rankOf(c) + "位", "Total " + sc(c) + " · puesto " + rankOf(c)) + (why ? "・" + why : "");
      return `<span class="k-v92out">${RD.flag ? RD.flag(c, 18) : ""}<b>${esc(tc(c))}</b><small>${esc(meta)}</small><button type="button" class="k-btn ${on ? "" : "white"} k-mini" data-v92tick="${esc(c)}" title="${esc(on ? M("押すと外します", "Click to remove", "点击移除", "Pulse para quitar") : M("押すと選びます（3か国まで）", "Click to select (up to 3)", "点击选择（最多3个国家）", "Pulse para seleccionar (hasta 3)"))}">${I(on ? "check" : "plus", 14, 2.6)}${esc(on ? M("選択中（外す）", "Selected (remove)", "已选（移除）", "Seleccionado (quitar)") : M("選択する", "Select", "选择", "Seleccionar"))}</button></span>`;
    };
    const outH = N.hopeOut.map((c) => chip(c, N.thin.indexOf(c) >= 0 ? T.thin : "")).join("");
    const outO = N.higher.map((x) => chip(x.c, x.thin ? T.thin : T.notHope)).join("");
    const n = document.createElement("div");
    n.className = "k-v92rule"; n.setAttribute("role", "note"); n.setAttribute("data-noi18n", "");
    const pMain = N.hope.length
      ? M("内蔵の採点は、商品の特性（用途・価格帯・強み）を見ていません。そのため、商品の登録で選んだ<b>進出希望国を先に</b>、残りを総合点の高い順に選んでいます。",
        "The built-in scoring does not look at your product's characteristics (use, price range, strengths). So <b>the target markets you chose at registration come first</b>, and the rest are filled in by total score. ",
        "内置评分不考虑商品特性（用途・价格带・优势）。因此，<b>优先选择商品登记时选定的目标市场</b>，其余按综合分从高到低选择。",
        "La puntuación integrada no considera las características del producto. Por eso <b>van primero los mercados objetivo elegidos en el registro</b> y el resto se completa por puntuación total. ")
      : M("内蔵の採点は、商品の特性（用途・価格帯・強み）を見ていません。<b>データのある国</b>を総合点の高い順に選んでいます（進出希望国の登録が無いか、候補に入っていません）。",
        "The built-in scoring does not look at your product's characteristics. <b>Countries with data</b> are chosen by total score (no target market is registered, or none is among the candidates). ",
        "内置评分不考虑商品特性。按综合分从高到低选择<b>有数据的国家</b>（未登记目标市场，或不在候选中）。",
        "La puntuación integrada no considera las características del producto. Se eligen <b>los países con datos</b> por puntuación total (no hay mercados objetivo registrados o no están entre los candidatos). ");
    const pThin = M("市場性と競合がどちらも未評価の国は「データ不足」とし、進出希望国でなければ入れていません。AI が接続されると、商品の特性に照らして選び直します。",
      "Countries where both Market and Competition are not rated are marked “insufficient data” and are left out unless they are your target markets. When AI is connected, it re-selects in light of your product.",
      "市场性和竞争均未评估的国家标为“数据不足”，除非是目标市场，否则不列入。连接AI后，将结合商品特性重新选择。",
      "Los países sin evaluación de Mercado ni Competencia se marcan «datos insuficientes» y quedan fuera salvo que sean sus mercados objetivo. Con la IA conectada, se vuelve a elegir según su producto.");
    const pFlat = M("この商品は、通関統計と規制のひな形のデータが無いため、国ごとの点数の差は「STANDAGE が商談したバイヤーの数」と「拠点の開設の状況」だけで付いています（商品の売れやすさの差ではありません）。",
      "For this product there are no customs statistics and no regulation template, so the differences between countries come only from the number of buyers STANDAGE has talked with and the status of its bases (not from how well the product would sell).",
      "该商品没有海关统计和法规模板的数据，各国分数的差异仅来自“STANDAGE洽谈过的买家数量”和“据点的开设状况”（并非商品好卖程度的差异）。",
      "Para este producto no hay estadísticas aduaneras ni plantilla de regulación; las diferencias entre países provienen solo del número de compradores con los que STANDAGE ha negociado y del estado de sus bases.");
    n.innerHTML = `<div class="k-v92rh">${I("bulb", 18, 2.4)}<b>${esc(M("この" + n3 + "か国の決め方", "How these were chosen", "这" + n3 + "个国家的决定方式", "Cómo se eligieron"))}</b><span>${esc(M("（AI 未接続・内蔵の採点）", "(AI not connected · built-in scoring)", "（未连接AI・内置评分）", "(IA no conectada · puntuación integrada)"))}</span></div>
      <p>${pMain}${esc(pThin)}</p>
      ${N.flat ? "<p>" + esc(pFlat) + "</p>" : ""}
      ${outH ? `<div class="k-v92outs"><span class="k-v92ol">${esc(M("進出希望国のうち、3か国までのため入れていない国", "Target markets left out because the limit is 3", "因最多3个国家而未列入的目标市场", "Mercados objetivo fuera por el límite de 3"))}</span>${outH}</div>` : ""}
      ${outO ? `<div class="k-v92outs"><span class="k-v92ol">${esc(M("総合点は高いが、入れていない国", "Higher total score but not included", "综合分较高但未列入的国家", "Mayor puntuación total pero no incluidos"))}</span>${outO}</div>` : ""}
      <button type="button" class="k-link" data-v92totbl="1">${esc(M("すべての国の点数と、くわしい決め方（下の表）", "All countries' scores and the full explanation (table below)", "所有国家的分数和详细的决定方式（下表）", "Puntuaciones de todos los países y la explicación completa (tabla de abajo)"))}${I("arr", 14)}</button>`;
    const tl = $(".k-tiles", warm);
    if (tl) tl.after(n); else warm.appendChild(n);
    $$("[data-v92tick]", n).forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); tick(w, b.getAttribute("data-v92tick")); }));
    const go = $("[data-v92totbl]", n);
    if (go) go.addEventListener("click", (e) => { e.preventDefault(); const t = document.getElementById("v92ctyrule") || document.getElementById("v54ctyleg"); if (t) { try { t.scrollIntoView({ block: "start", behavior: "smooth" }); window.scrollBy(0, -90); } catch (x) { t.scrollIntoView(); } } });
  }

  /* ③ 「おまかせ」のボタンは1つ */
  function fixDup(w, box) {
    // 分析の前（結果がまだ無い）は、刷新版の上のカードに大きい「おまかせ」のボタンがある（言語が変わっても同じ見分け方）
    const top = !!box && !recAll().length && !!$("section.k-card.warm .k-btn.big", box);
    orig(w, ".ph button, .ph a").forEach((b) => { if (/ctyRun\(true\)/.test(b.getAttribute("data-onclick") || "")) b.classList.toggle("k-v92dup", !!top); });
  }

  /* ④ レーダー：軸の名前を図形の外へ */
  function fixRadar(box, rows) {
    const svg = $('svg[aria-label="主要指標の比較"]', box);
    if (!svg || svg.dataset.v92lab) return;
    svg.dataset.v92lab = "1";
    const cx = 150, cy = 135, R = 100;
    const naAll = AXK.map((k) => rows.length > 0 && rows.every((r) => isNA(r.sc, k)));
    const texts = $$("text", svg).slice(0, 4); // 市場性（上）・規制（右）・競合（下）・拠点（左）の順
    const pos = [[cx, naAll[0] ? cy - R - 26 : cy - R - 12, "middle"], [cx + R + 12, cy + 5, "start"], [cx, cy + R + 24, "middle"], [cx - R - 12, cy + 5, "end"]];
    texts.forEach((t, i) => {
      const p = pos[i];
      t.setAttribute("x", p[0]); t.setAttribute("y", p[1]); t.setAttribute("text-anchor", p[2]);
      if (naAll[i] && !$("tspan", t)) t.insertAdjacentHTML("beforeend", `<tspan x="${p[0]}" dy="14" font-size="10.5" font-weight="700" fill="#7C8AA0" data-noi18n>${esc(M("未評価", "Not rated", "未评估", "Sin evaluar"))}</tspan>`);
    });
    svg.setAttribute("viewBox", "-16 -4 332 292");
  }

  function apply() {
    if (RD.locked && RD.locked()) return;
    const w = $("#well");
    if (!w || RD.curKey() !== "cty") return;
    const box = $(".rd-x.rd-p2", w);
    if (!box) return;
    fixDup(w, box);
    if (isDeep(w)) return;
    syncFromDom();
    const N = info();
    if (!N || !N.on) return;
    try { fixCards(w, box, N); } catch (e) { console.error("[rd v92cty] cards", e); }
    const all = recAll();
    const rows = $$(".k-tiles > .k-card", box).map((card) => { const b = $("[data-rdcty]", card); return b ? all.find((x) => x.c === b.getAttribute("data-rdcty")) : null; }).filter((r) => r && r.sc);
    try { fixRadar(box, rows); } catch (e) { console.error("[rd v92cty] radar", e); }
  }
  const prev = RD.after;
  RD.after = function () {
    const r = prev.apply(this, arguments);
    try { apply(); } catch (e) { console.error("[rd v92cty]", e); }
    return r;
  };
  try { apply(); } catch (e) { /* 最初の描画の前 */ }
})();
