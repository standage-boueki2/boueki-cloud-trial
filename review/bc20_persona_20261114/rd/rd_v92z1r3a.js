/* 貿易クラウドAI商社マン 21.92 r3a の刷新版の層（rd_v92flow.js のあとに読む）
   ① 案件一覧・案件の詳細の「次の行動」：商談の記録から作った案件（まだ送っていない）は、記録した「次の行動・期限」を出す
      （出どころは本体の層 v92r3a.next＝バイヤー一覧の「次のアクション」と同じ）。記録に次の行動が無いときだけ「最初の連絡を送る」
      （auto-M02・medical-M02・health-M07・other-M03）
   ② 「要対応」の数：受信箱で「済み・あとで」にした分を、案件一覧のタブ・やりとりの札に内訳で書く（daily-N08）
   ほかは下の各ブロックの頭に書く */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92r3a) return;
  RD._v92r3a = 1;
  const { $, $$, esc } = RD;
  const safe = (fn) => { try { return fn(); } catch (e) { return undefined; } };
  const A = () => window.v92r3a || {};
  const G = (n) => { try { return RD.G ? RD.G(n) : undefined; } catch (e) { return undefined; } };
  const isFwd = () => { const S = G("SES"); return !!(S && (S.role === "fwd" || S.t === "fwd")); };
  const caseByKey = (k) => (safe(() => RD.allCases()) || []).find((c) => c.key === k) || null;
  const logOnly = (c) => !!(c && c.th && A().logOnly && A().logOnly(c.th));
  const setTxt = (el, t) => { const n = Array.from(el.childNodes).find((x) => x.nodeType === 3); if (n) n.nodeValue = t; else el.insertBefore(document.createTextNode(t), el.firstChild); };
  const nxSub = (N) => [N.due ? "期限 " + N.due + (N.when && N.when !== N.due ? "（" + N.when + "）" : "") : "期限なし", "商談の記録の「次の行動」（相手にはまだ送っていません）"].join("・");

  // 送ったあとの案件（相手の返事待ち）で、記録した次の行動があるとき（culture-M06）
  const nxSubW = (N, c) => [N.due ? "期限 " + N.due + (N.when && N.when !== N.due ? "（" + N.when + "）" : "") : "期限なし", "記録した次の行動", (c.next && c.next.kind === "follow") ? c.next.t : "相手の返事待ち"].join("・");

  /* ① 案件一覧 */
  function fixHome(w) {
    const body = $("#k-clbody", w);
    if (!body) return;
    const paint = () => {
      const ord = RD._caseOrder || [];
      $$("tr.k-clrow", body).forEach((tr, i) => {
        if (tr.dataset.r3a) return;
        tr.dataset.r3a = "1";
        const c = caseByKey(ord[i]);
        if (!c || c.ss === "失注") return;
        const lo = logOnly(c), wt = !lo && c.next && (c.next.kind === "wait" || c.next.kind === "follow");
        if (!lo && !wt) return; // 返信が要る案件は「返信する」が先
        const N = safe(() => A().next(c.id));
        const nx = $(".c-nx > span", tr);
        if (!nx || !N || !N.t) return;
        let sm = $("small", nx);
        setTxt(nx, N.t.length > 34 ? N.t.slice(0, 33) + "…" : N.t);
        nx.title = N.t;
        if (!sm) { sm = document.createElement("small"); nx.appendChild(sm); }
        sm.textContent = lo ? nxSub(N) : nxSubW(N, c);
        const td = nx.closest("td"); if (td && N.od) td.classList.add("k-r3aod");
      });
    };
    paint();
    if (!body.dataset.r3ao) { body.dataset.r3ao = "1"; new MutationObserver(() => paint()).observe(body, { childList: true }); }
    needNote(w);
  }
  /* ① 案件の詳細 */
  function fixCase(w) {
    const box = $(".k-cd", w);
    if (!box || box.dataset.r3a) return;
    box.dataset.r3a = "1";
    const c = RD._case0;
    const p = $(".k-cdnx", box);
    if (!p || !c || c.ss === "失注") return;
    const lo = logOnly(c), wt = !lo && c.next && (c.next.kind === "wait" || c.next.kind === "follow");
    if (!lo && !wt) return;
    const N = safe(() => A().next(c.id));
    if (!N || !N.t) return;
    let sm = $("small", p);
    setTxt(p, N.t);
    if (!sm) { sm = document.createElement("small"); p.appendChild(sm); }
    sm.textContent = lo ? nxSub(N) : nxSubW(N, c);
  }

  /* ② 「要対応」の内訳 */
  function needInfo() { return safe(() => A().needInfo && A().needInfo()) || null; }
  function needNote(w) {
    const S = needInfo();
    const tab = $('[data-kclf="todo"]', w);
    if (!tab) return;
    let n = $(".k-r3ann", w);
    if (!S || !S.done) { if (n) n.remove(); return; }
    const txt = `「要対応」${S.all}件のうち ${S.done}件は、受信箱で「済み／あとで」にした分です（相手への返信はまだ記録されていません。上の「返信が要る」と受信箱は、この分を除いた ${S.all - S.done}件）。`;
    if (!n) { n = document.createElement("p"); n.className = "k-r3ann"; const tool = tab.closest(".k-cltool"); if (tool) tool.after(n); else return; }
    n.textContent = txt;
  }
  function fixMsg(w) {
    const S = needInfo();
    if (!S || !S.done) return;
    const tile = $$(".rd-p2 .k-tile", w).find((x) => /^要対応/.test(((($(".k-tl", x) || {}).textContent) || "").trim()));
    const s = tile && $(".k-ts", tile);
    if (s && !s.dataset.r3a) { s.dataset.r3a = "1"; s.textContent = `相手から届いて、まだ返していない相手。うち ${S.done}件は受信箱で「済み／あとで」にした分（受信箱の「返信」はそれを除いた ${S.all - S.done}件）`; }
  }

  /* ③ 右上の「次は」（商品情報を登録・商品情報）：はじめの設定の手順（ホームの「次は」・手順の帯と同じ出どころ＝RD.exportSteps）に合わせる
        （daily-M01・medical-M03・health-M04・indagri-M07・other-N16）。商品がまだ無い間・必須の項目が足りない間の案内はそのまま */
  const curStep = () => { const S = safe(() => (RD.exportSteps ? RD.exportSteps() : [])) || []; if (!S.length || S[0].st !== "done") return null; return S.find((s) => s.st === "on") || null; };
  function fixNext(w, k) {
    if (k !== "up" && k !== "item") return;
    const b = $("[data-rdhero] .k-next", w);
    if (!b || b.dataset.v92i) return; // 商品情報の「必須の項目を入れる」はそのまま
    const s = curStep();
    if (!s) {
      const t0 = G("TEN");
      if (k === "up" && b.dataset.v92eDrop && t0 && (t0.item || t0.file)) {
        // 商品はある（手順1の途中、または全部済み）：「下の枠へ」ではなく、元の「商品情報を確かめる」に戻す
        b.dataset.kbc = b.dataset.v92eKbc || "item"; delete b.dataset.v92eDrop;
        const bb = $("b", b); if (bb && b.dataset.v92eOld) bb.textContent = b.dataset.v92eOld;
        b.title = "次の手順：" + ((bb && bb.textContent) || "");
      }
      return;
    }
    const bb = $("b", b);
    if (!bb) return;
    if (b.dataset.r3ago === s.t && bb.textContent === s.t) return;
    b.removeAttribute("data-kbc"); delete b.dataset.v92eDrop;
    b.dataset.r3ago = s.t;
    bb.textContent = s.t;
    b.title = "次の手順：" + s.t + "（はじめの設定の、いまの手順）";
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest(".k-next[data-r3ago]");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const s = curStep();
    if (s && typeof s.go === "function") s.go();
  }, true);

  /* ④ 案件の詳細の「返信の文案」「見積の出し方」など：AI商社マンの画面へ移る前に一言（auto-N12） */
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest(".k-cd .k-chip");
    if (!b || isFwd()) return;
    const k0 = RD.curKey ? RD.curKey() : "";
    setTimeout(() => {
      try {
        const k1 = RD.curKey ? RD.curKey() : "";
        if (k0 === "dash:case" && k1 === "ai") toast("AI商社マンの画面に移って答えます。案件へは、左の「案件」から戻れます。"); // eslint-disable-line no-undef
      } catch (x) { /* 無視 */ }
    }, 350);
  }, true);

  /* ⑤ 「やり取り中の相手」の数（daily-M05）：今日やることの札は、分析・商談と同じ数え方（失注・終了を除く＝v70dealDashCalc）に。
        AIバイヤー開拓の一覧（失注を含む・直接連絡のある相手）は「連絡した相手」と呼ぶ */
  function fixToday(w) {
    const n = safe(() => v70dealDashCalc().n); // eslint-disable-line no-undef
    const tile = $$(".rd-x .k-tile", w).find((x) => (((($(".k-tl", x) || {}).textContent) || "").trim() === "やりとり中の相手"));
    if (tile && typeof n === "number" && !tile.dataset.r3a) {
      tile.dataset.r3a = "1";
      const tn = $(".k-tn", tile);
      if (tn) { const u = $("small", tn); tn.textContent = String(n); if (u) tn.appendChild(u); }
      tile.title = "失注・終了を除く（商談・バイヤー、分析・レポートと同じ数え方）";
      const l = $(".k-tl", tile); if (l) l.textContent = "やりとり中の相手（失注を除く）";
    }
    dueCard(w);
  }
  function fixDb(w) {
    $$(".rd-x .rd-card .rd-ch", w).forEach((ch) => {
      const h = $("h2", ch), s = $(".rd-chs", ch);
      if (!h || h.textContent !== "やり取り中のバイヤー" || !s || s.dataset.r3a) return;
      s.dataset.r3a = "1";
      const t0 = G("TEN"); const lost = (safe(() => RD.allCases()) || []).filter((c) => c.t === t0 && c.ss === "失注").length;
      h.textContent = "連絡した相手";
      s.textContent = s.textContent.replace(/）$/, lost ? `・うち失注 ${lost}社）` : "）");
      s.title = "直接連絡のやりとりがある相手（失注を含む）。「やり取り中」の数（失注を除く）は、商談・バイヤーと分析・レポートに出ます";
    });
  }

  /* ⑥ 今日やること：期限切れ・今日までのタスク（health-M08・indagri-N06）。タスク・進行と同じ数え方（taskStats・アプリの日付） */
  function dueCard(w) {
    const x0 = $(".rd-x", w);
    if (!x0 || $(".k-r3adue", w)) return;
    const all = (safe(() => (taskStats() || {}).all) || []); // eslint-disable-line no-undef
    const td = String(safe(() => TODAYS) || "").slice(0, 10); // eslint-disable-line no-undef
    if (!td) return;
    const L = all.filter((t) => t && t.e && !/^(完了|中止)$/.test(String(t.st || "")) && String(t.e).slice(0, 10) <= td).sort((a, b) => String(a.e).localeCompare(String(b.e)));
    if (!L.length) return;
    const row = (t) => { const od = String(t.e).slice(0, 10) < td; return `<div class="k-row"><span class="k-tag ${od ? "rd" : "or"}">${od ? "期限切れ" : "今日まで"}</span><span class="k-rt"><b>${esc(t.n || "")}</b><small>期限 ${esc(String(t.e).slice(0, 10))}${t.w ? "・担当 " + esc(t.w) : ""}</small></span></div>`; };
    const sec = document.createElement("section");
    sec.className = "k-card k-r3adue";
    sec.setAttribute("style", "margin-bottom:18px;padding:14px 18px");
    sec.innerHTML = `<div class="k-h" style="margin-bottom:10px"><h2 style="font-size:18px">期限が今日まで・期限切れのタスク</h2><span class="k-hs">（${L.length}件。タスク・進行と同じ数え方）</span></div><div class="k-rows">${L.slice(0, 6).map(row).join("")}</div>${L.length > 6 ? `<p class="k-r3ann">ほか ${L.length - 6}件</p>` : ""}<button type="button" class="k-btn ghost" style="margin-top:10px" data-kbc="task">タスク・進行で開く</button>`;
    x0.insertBefore(sec, x0.firstChild);
  }

  /* ⑦ タスク・進行の「次にやること」の行を押すとタスクが開く（health-M15）：下の一覧の同じタスクの行と同じ動き */
  function fixTaskRows(w) {
    const card = $$(".rd-x .k-card", w).find((c) => { const h = $("h2", c); return h && /^次にやること/.test(h.textContent || ""); });
    if (!card || card.dataset.r3a) return;
    card.dataset.r3a = "1";
    $$("table.rd-tbl tbody tr", card).forEach((tr) => {
      const tds = $$("td", tr); if (tds.length < 2) return;
      const b = $("b", tds[1]);
      const name = ((b || tds[1]).textContent || "").trim();
      if (!name) return;
      tr.style.cursor = "pointer"; tr.tabIndex = 0; tr.title = "押すと、このタスクを開きます";
      const open = () => { const o = $$("#well tr[data-k30]").find((x) => (x.textContent || "").indexOf(name) >= 0); if (o) o.click(); else toast("下の一覧でこのタスクを探してください（絞り込みで隠れている場合があります）"); }; // eslint-disable-line no-undef
      tr.addEventListener("click", open);
      tr.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  }

  /* ⑧ 「入金の予定をタスクに入れる」（daily-M07）：タスクの新規作成の窓を、題つきで開く（本体の層 v92r3a.payTask） */
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("button, [role=button]");
    if (!b || isFwd() || !A().payTask) return;
    if ((RD.curKey ? RD.curKey() : "") !== "ops:ord") return;
    if (!/入金の予定をタスクに入れる/.test(b.textContent || "") || b.getAttribute("data-act") === "v90reg.task") return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    A().payTask();
  }, true);

  /* ⑨ 目標と道筋：言葉の言い直し（本体の層 v92r3a.rmWords）を、描き直しのたびに */
  function fixRm() { safe(() => A().rmWords && A().rmWords()); }

  const old = RD.after;
  RD.after = function () {
    const r = old.apply(this, arguments);
    try {
      if (isFwd()) return r;
      const w = document.getElementById("well") || document.querySelector(".stage") || document.body;
      const k = RD.curKey ? RD.curKey() : "";
      if (k === "dash:home" || k === "dash") fixHome(w);
      if (k === "dash:case") fixCase(w);
      if (k === "msg") fixMsg(w);
      fixNext(w, k);
      if (k === "today") fixToday(w);
      if (k === "db") fixDb(w);
      if (k === "task") fixTaskRows(w);
      if (k === "rm") fixRm();
      if (RD._r3aPages) RD._r3aPages.forEach((f) => { try { f(w, k); } catch (e) { console.error("[rd v92r3a]", e); } });
    } catch (e) { console.error("[rd v92r3a]", e); }
    return r;
  };
  RD._r3aPages = [];
})();
