/* 21.92 r3b（刷新版の層）
   ① 販売先国の選定：確定のあとは、上のカードと「主要指標の比較」を、確定した国で出す（auto-N10・indagri-N15）。
      この商品を登録・輸入できない国（規制の判定が「できません」）には、カードにその札を付け、「総合点が最も高い」の札は外す
   ② ヒアリングの「選択肢の例：」の札：押すと、下の会話の同じ選択肢を押す（無ければ答えの欄に入れる）（daily-08） */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92r3b) return;
  RD._v92r3b = 1;
  const { $, $$, esc } = RD;
  const lang = () => { try { return String((window.I18N && window.I18N.lang) || document.documentElement.lang || "ja").slice(0, 2); } catch (e) { return "ja"; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
  const ten = () => { try { return typeof TEN !== "undefined" ? TEN : null; } catch (e) { return null; } }; // eslint-disable-line no-undef
  const dd = () => { try { return typeof D !== "undefined" ? D : null; } catch (e) { return null; } }; // eslint-disable-line no-undef
  const chosen = () => { const S = (ten() || {}).ctySel || {}; return (Array.isArray(S.chosen) ? S.chosen : []).map((x) => (typeof x === "string" ? x : x && (x.c || x.cty))).filter(Boolean); };
  const ngOf = (c) => { try { const r = ((dd() || {}).regs || {})[c]; const cd = r && r.v56tariffCond; return !!(cd && cd.lvl === "ng"); } catch (e) { return false; } };

  /* ① 確定のあとのカード：確定した国で描く（描く間だけ、おすすめの並びを確定した国に替える。保存の中身は変えない） */
  let swapped = false;
  if (RD.page && typeof RD.page.cty === "function") {
    const p0 = RD.page.cty;
    RD.page.cty = function (w) {
      const t = ten();
      const S = t && t.ctySel;
      const ch = chosen();
      const rec = S && Array.isArray(S.rec) ? S.rec.filter((x) => x && x.c).map((x) => x.c) : [];
      const want = ch.filter((c) => rec.indexOf(c) >= 0);
      swapped = false;
      if (!S || !want.length) return p0.apply(this, arguments);
      const cur = (Array.isArray(S.top) ? S.top : []).filter((c) => rec.indexOf(c) >= 0).slice(0, 3);
      const same = cur.length === want.length && want.every((c) => cur.indexOf(c) >= 0);
      if (same) return p0.apply(this, arguments);
      const top0 = S.top, ai0 = S.ai, hasTop = Object.prototype.hasOwnProperty.call(S, "top"), hasAi = Object.prototype.hasOwnProperty.call(S, "ai");
      try {
        S.top = want.slice(0, 3);
        S.ai = null;
        swapped = true;
        return p0.apply(this, arguments);
      } finally {
        if (hasTop) S.top = top0; else delete S.top;
        if (hasAi) S.ai = ai0; else delete S.ai;
      }
    };
  }
  function fixCty(w) {
    const box = w;
    const tiles = $$(".k-tiles > .k-card", box).filter((c) => $("[data-rdcty]", c));
    if (!tiles.length) return;
    const warm = tiles[0].closest("section.k-card");
    const ch = chosen();
    const shown = tiles.map((c) => $("[data-rdcty]", c).getAttribute("data-rdcty"));
    const allChosen = ch.length > 0 && shown.every((c) => ch.indexOf(c) >= 0);
    if (warm && allChosen && !warm.dataset.v92r3b) {
      warm.dataset.v92r3b = "1";
      const h2 = $(".k-h h2", warm);
      if (h2) { h2.textContent = M("確定した販売先国（" + shown.length + "か国）", "Confirmed sales countries (" + shown.length + ")", "已确定的销售国（" + shown.length + "个）", "Países de venta confirmados (" + shown.length + ")"); h2.setAttribute("data-noi18n", ""); }
      const tg = $$(".k-h .k-tag", warm).find((x) => /総合点|おすすめ|進出希望国を先に|データのある国/.test(x.textContent || ""));
      if (tg) {
        const missing = ch.filter((c) => shown.indexOf(c) < 0);
        tg.setAttribute("data-noi18n", "");
        const tn = Array.from(tg.childNodes).find((n) => n.nodeType === 3 && (n.nodeValue || "").trim());
        const txt = M("確定した国を出しています（選び直すと、おすすめの並びに戻ります）", "Showing your confirmed countries (choose again to return to the suggested order)", "显示已确定的国家（重新选择后恢复推荐顺序）", "Se muestran los países confirmados (elija de nuevo para volver al orden sugerido)")
          + (missing.length ? M("。点数の無い国：" + missing.join("・"), ". No score: " + missing.join(", ")) : "");
        if (tn) tn.nodeValue = txt; else tg.appendChild(document.createTextNode(txt));
      }
    }
    tiles.forEach((card) => {
      const c = $("[data-rdcty]", card).getAttribute("data-rdcty");
      const abs = $$(":scope > .k-tag", card).find((t) => /position:\s*absolute/.test(t.getAttribute("style") || ""));
      if (allChosen && abs && !abs.dataset.v92r3b) {
        // 確定した国だけを並べているので、「総合点が最も高い／最もおすすめ」の札は、全体の1位の国にだけ
        const all = RD.recCty ? RD.recCty() : [];
        if (!(all[0] && all[0].c === c)) abs.remove();
      }
      if (ngOf(c) && !$(".k92r3b-ng", card)) {
        const abs2 = $$(":scope > .k-tag", card).find((t) => /position:\s*absolute/.test(t.getAttribute("style") || ""));
        if (abs2) abs2.remove();
        const nm = $("b", card);
        const at = nm && nm.parentElement ? nm.parentElement : card.firstElementChild;
        if (at) at.insertAdjacentHTML("afterend", `<p class="k92r3b-ng" data-noi18n style="margin:6px 0 0;padding:6px 10px;border-radius:10px;background:#FDECEC;color:#B42318;font-size:12.5px;font-weight:800;line-height:1.5">⛔ ${esc(M("この商品は、この国では登録・輸入できない判定です（「規制を調べる」で理由を確認）。点数は参考です", "Judged not registrable / importable in this country for this product (see “Check regulations”). The score is for reference only", "判定为本商品在该国无法登记・进口（请在“查询法规”确认原因）。分数仅供参考", "Este producto se considera no registrable / importable en este país (véase «Consultar normativa»). La puntuación es solo de referencia"))}</p>`);
      }
    });
  }

  /* ② 「選択肢の例：」の札 */
  function fixTags(w) {
    $$(".rd-tag.k-v92ex", w).forEach((tg) => {
      if (tg.dataset.v92r3b) return;
      tg.dataset.v92r3b = "1";
      tg.classList.add("k92r3b-pick");
      tg.setAttribute("role", "button");
      tg.setAttribute("tabindex", "0");
      tg.title = M("押すと、この選択肢で答えます", "Press to answer with this option", "点击即以此选项回答", "Pulse para responder con esta opción");
      const pick = () => {
        const tx = (tg.textContent || "").trim();
        const chip = $$("[data-chip]").find((b) => !b.closest(".rd-x") && ((b.dataset.chip || "").trim() === tx || (b.textContent || "").trim() === tx));
        if (chip) { chip.click(); return; }
        const fa = document.getElementById("fans");
        if (fa) { fa.value = tx; try { fa.dispatchEvent(new Event("input", { bubbles: true })); fa.focus(); fa.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (e) { /* 無視 */ } }
      };
      tg.addEventListener("click", pick);
      tg.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
    });
    const l = $(".k-v92exl", w);
    if (l && !l.dataset.v92r3b) { l.dataset.v92r3b = "1"; l.textContent = M("選択肢（押すと答えます）：", "Options (press to answer):", "选项（点击回答）：", "Opciones (pulse para responder):"); l.setAttribute("data-noi18n", ""); }
  }

  function apply() {
    if (RD.locked && RD.locked()) return;
    const w = $("#well");
    if (!w) return;
    const k = RD.curKey();
    if (k === "cty") fixCty(w);
    if (k === "up" || k === "item") fixTags(w);
  }
  const prev = RD.after;
  RD.after = function () {
    const r = prev.apply(this, arguments);
    try { apply(); } catch (e) { console.error("[rd v92r3b]", e); }
    return r;
  };
  try { apply(); } catch (e) { /* 最初の描画の前 */ }
})();
