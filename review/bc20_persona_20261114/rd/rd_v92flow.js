/* 貿易クラウドAI商社マン 21.92 flow（刷新版の層・ほかの rd_v92*.js のあとに読む）
   2026-11-15 の2回目の評価：商談 → 見積 → 書類の流れと、数字・状態の食い違いのうち、刷新版が足した部品の直し。
   今のアプリの関数・刷新版の前の層は差し替えず、RDX.after を包む。数字はアプリが持っているものだけ（本体の層 logic_v2192flow と同じ出どころ）。
   ① 商談・バイヤーの上の「商談の状況」：刷新版は直接連絡のスレッドだけを数えていた（下のバイヤー一覧の札は、商談の記録・スレッドを合わせた1社1行）
      → バイヤー一覧の札と同じ行（b30Collect・失注を除く）から数える。「商談中」はサンプル出荷を別の数に分ける（health-N03・N05・daily-N03・food-N12・indagri-N09・other-N03・auto-N04）
   ② 案件一覧・案件の詳細の「次の行動」：商談の記録から作った案件（まだ送っていない）は「最初の連絡を送る」。「今日に送信」→「今日 送信済み」（health-N17）
   ③ 案件の詳細の「〇〇への輸出に要る書類」：条件つきの手続き（規制の画面で「該当するときだけ」）に印（medical-N07）。注意書きが3列に割れる（other-N02・auto-N11）
   ④ タスク・進行の「タスク全体の状況」：刷新版は端末の今日で数え、分析・レポート（アプリの時計＝見本の会社は見本の日付）と食い違った（food-N04：期限切れ 10件と 2件）
      → アプリの数（taskStats）にそろえ、見本の会社では「見本の日付で数えています」と書く
   ⑤ 荷主が開く「AI見積」の窓：物流会社向けの言葉（荷主へ提出・貴社のレート）を、荷主の言葉に（medical-N02・daily-N02）
   ⑥ 商談の記録の表：日付・国が欄の中で割れる（other-N09） */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92flow) return;
  RD._v92flow = 1;
  const { $, $$, esc, I } = RD;
  const G = (n) => { try { return RD.G ? RD.G(n) : undefined; } catch (e) { return undefined; } };
  const isFwd = () => { const S = G("SES"); return !!(S && (S.role === "fwd" || S.t === "fwd")); };
  const safe = (fn) => { try { return fn(); } catch (e) { return undefined; } };

  /* ① 商談の状況 */
  function fixDeal(w) {
    const sec = $$(".rd-x section.k-card", w).find((s) => /商談の状況/.test((s.firstElementChild && s.firstElementChild.textContent) || ""));
    if (!sec || sec.dataset.v92f) return;
    const rows = safe(() => b30Collect()); // eslint-disable-line no-undef
    if (!Array.isArray(rows)) return;
    sec.dataset.v92f = "1";
    const act = rows.filter((r) => r && r.lead !== "失注");
    const n = (st) => act.filter((r) => r.st === st).length;
    const cells = $$(":scope > div", sec).slice(1);
    const set = (i, label, v) => { const c = cells[i]; if (!c) return; const sm = $("small", c), b = $("b", c); if (sm && label) sm.textContent = label; if (b) b.textContent = String(v); };
    set(0, "商談中", n("商談中"));
    set(1, "提案済み（見積提示）", n("見積提示"));
    set(2, "受注見込み（契約交渉）", n("契約交渉"));
    set(3, "取引中", n("取引中"));
    const extra = [["コンタクト中", n("コンタクト中")], ["サンプル出荷", n("サンプル出荷")]].filter((x) => x[1] > 0);
    const hs = $(".k-hs", sec);
    if (hs) hs.textContent = "（下のバイヤー一覧の札と同じ数え方・失注を除く）";
    if (extra.length && !$(".k-v92fx", sec)) sec.insertAdjacentHTML("beforeend", `<span class="k-v92fx">ほかに ${extra.map((x) => `${esc(x[0])} <b>${x[1]}</b>社`).join("・")}</span>`);
  }

  /* ② 次の行動の言い方 */
  const sentTxt = (s) => String(s || "").replace(/^(.+?)に送信$/, "$1 送信済み");
  function caseByKey(k) { return (safe(() => RD.allCases()) || []).find((c) => c.key === k) || null; }
  const logOnly = (c) => !!(c && c.msgs && c.msgs.length && c.msgs.every((m) => m && m.v92fb));
  function fixHome(w) {
    const body = $("#k-clbody", w);
    if (!body) return;
    const paint = () => {
      const ord = RD._caseOrder || [];
      $$("tr.k-clrow", body).forEach((tr, i) => {
        if (tr.dataset.v92f) return;
        tr.dataset.v92f = "1";
        const c = caseByKey(ord[i]);
        const nx = $(".c-nx > span", tr);
        if (!nx) return;
        const sm = $("small", nx);
        if (c && logOnly(c) && c.ss !== "失注") {
          const t = Array.from(nx.childNodes).find((n) => n.nodeType === 3);
          if (t) t.nodeValue = "最初の連絡を送る";
          if (sm) sm.textContent = "商談の記録から作った案件（まだ送っていません）";
          const who = $(".c-last .k-who", tr); if (who) who.textContent = "記録";
        } else if (sm) sm.textContent = sentTxt(sm.textContent);
      });
    };
    paint();
    if (!body.dataset.v92fo) { body.dataset.v92fo = "1"; new MutationObserver(() => paint()).observe(body, { childList: true }); }
  }

  /* ③ 案件の詳細 */
  function fixCase(w) {
    const box = $(".k-cd", w);
    if (!box || box.dataset.v92f) return;
    box.dataset.v92f = "1";
    const c = RD._case0;
    const p = $(".k-cdnx", box);
    if (p) {
      const sm = $("small", p);
      if (c && logOnly(c) && c.ss !== "失注") {
        const t = Array.from(p.childNodes).find((n) => n.nodeType === 3);
        if (t) t.nodeValue = "最初の連絡を送る";
        if (sm) sm.textContent = "商談の記録から作った案件です（相手にはまだ送っていません）";
        $$(".k-tl .k-who.me", box).forEach((x) => { x.textContent = "記録"; });
      } else if (sm) sm.textContent = sentTxt(sm.textContent);
    }
    // 注意書き：絵と文の2列に（文の中の用語の印で列が割れない）
    $$(".k-cdwarn", box).forEach((x) => { if ($(":scope > .k-v92ft", x)) return; const sp = document.createElement("span"); sp.className = "k-v92ft"; Array.from(x.childNodes).forEach((n) => { if (!(n.nodeType === 1 && n.tagName.toLowerCase() === "svg")) sp.appendChild(n); }); x.appendChild(sp); });
    // 条件つきの手続きの印（規制の画面と同じ判断：本体の層 ops の v54rStatusFor().cond）
    if (!c) return;
    const cond = safe(() => { const d = D, r = d.regs && d.regs[c.cty]; if (!r) return []; const st = v54rStatusFor(c.cty, r, typeof v54rCatOf === "function" ? v54rCatOf(d) : "", d.compRows || []); return (st && st.cond) || []; }) || []; // eslint-disable-line no-undef
    if (!cond.length) return;
    let n = 0;
    $$(".k-docs .k-doc", box).forEach((el) => {
      const nm = (el.textContent || "").trim();
      const x = cond.find((y) => String(y.nm) === nm);
      if (!x || x.v === "y") return;
      el.classList.add("k-v92cond"); if (x.v === "n") el.classList.add("no");
      el.title = x.why || "";
      el.insertAdjacentHTML("beforeend", `<em>${x.v === "n" ? "対象外" : "該当するときだけ"}</em>`);
      n++;
    });
    const docs = $(".k-docs", box);
    if (n && docs && !$(".k-v92cn", box)) docs.insertAdjacentHTML("afterend", `<p class="k-cdsm k-v92cn">「該当するときだけ」の印は、条件に当たるときだけ要る手続きです（必須の件数には入れていません）。当たるかどうかは「${esc(c.cty)}の規制」で選べます。</p>`);
  }

  /* ④ タスク全体の状況：アプリの数にそろえる */
  function fixTask(w) {
    const S = safe(() => taskStats()); // eslint-disable-line no-undef
    if (!S || !S.total) return;
    const tiles = $$(".rd-x .k-tile", w);
    if (!tiles.length || tiles[0].dataset.v92f) return;
    tiles[0].dataset.v92f = "1";
    const set = (re, v) => tiles.filter((t) => { const l = $(".k-tl", t); return l && re.test((l.textContent || "").trim()); }).forEach((t) => { const nEl = $(".k-tn", t); if (!nEl) return; const tx = Array.from(nEl.childNodes).find((n) => n.nodeType === 3); if (tx) tx.nodeValue = String(v); t.classList.toggle("rd", /^期限切れ$/.test(($(".k-tl", t).textContent || "").trim()) && v > 0); t.classList.toggle("crit", /対応必須/.test($(".k-tl", t).textContent || "") && v > 0); if (/^開始が遅れている$/.test(($(".k-tl", t).textContent || "").trim())) t.classList.toggle("hot", v > 0); });
    set(/^期限切れ(（対応必須）)?$/, S.overdue);
    set(/^(期限7日以内|7日以内の予定)$/, S.soon);
    set(/^開始が遅れている$/, S.late);
    const td = safe(() => TODAYS) || ""; // eslint-disable-line no-undef
    const demo = !!safe(() => isDemoClock()); // eslint-disable-line no-undef
    // 「次にやること」の札と日数も、同じ日付で
    if (td) {
      const day = (s) => new Date(String(s).slice(0, 10) + "T00:00:00");
      $$(".rd-x table.rd-tbl tbody tr", w).forEach((tr) => {
        const tds = $$("td", tr); if (tds.length < 5) return;
        const tag = $(".k-tag", tds[0]); const m = (tds[3].textContent || "").match(/\d{4}-\d{2}-\d{2}/);
        if (!tag || !m) return;
        const d = Math.round((day(m[0]) - day(td)) / 864e5);
        const lab = d < 0 ? ["期限切れ", "rdf"] : d <= 3 ? ["期限間近", "or"] : ["予定", "bl"];
        const b = $("b", tag); const no = b ? b.textContent : "";
        tag.className = "k-tag " + lab[1]; tag.innerHTML = `<b>${esc(no)}</b>　${lab[0]}`;
        const sm = $("small", tds[3]); if (sm) { sm.textContent = d < 0 ? -d + "日前" : "あと" + d + "日"; sm.style.color = d < 0 ? "var(--k-rd)" : "var(--k-ink3)"; }
      });
    }
    const card = tiles[0].closest(".k-card");
    if (card && !$(".k-v92fn", card)) card.insertAdjacentHTML("beforeend", `<p class="rd-note k-v92fn">期限切れ・7日以内の数は、分析・レポートと同じ数え方です${demo && td ? `（見本の会社は、見本の日付 ${esc(td)} を「今日」として数えています）` : ""}。</p>`);
  }

  /* ⑤ 荷主が開く「AI見積」の窓 */
  function fixQuoteDw() {
    if (isFwd()) return;
    const dw = document.getElementById("dw");
    const hd = dw && $(".k-qhd", dw);
    if (!hd || hd.dataset.v92f) return;
    hd.dataset.v92f = "1";
    const id = ((dw.textContent || "").match(/RQ-[A-Z0-9]+/) || [])[0];
    const F = G("FWDB") || {};
    const r = id && (F.reqs || []).find((x) => x && x.id === id);
    const legs = (r && r.legs) || [];
    const got = legs.filter((lg) => (lg.offers || []).some((o) => o && o.quote)).length;
    const steps = $$(".k-steps .k-step", hd);
    const stepTxt = ["依頼を出した", "物流会社の見積を待つ", "比べて選ぶ"];
    steps.forEach((s, i) => { const b = $("b", s); if (b && stepTxt[i]) b.textContent = stepTxt[i]; });
    if (steps[1]) { steps[1].classList.toggle("done", got > 0); steps[1].classList.toggle("on", !got); }
    if (steps[2]) { steps[2].classList.remove("done"); steps[2].classList.toggle("on", got > 0); }
    $$(".k-tile", hd).forEach((t) => {
      const l = $(".k-tl", t), s = $(".k-ts", t), nEl = $(".k-tn", t);
      const lt = (l && l.textContent) || "";
      if (/貴社の概算見積/.test(lt)) {
        l.textContent = `物流会社の見積（${got}/${legs.length}か国）`;
        if (s) s.textContent = got ? "下の一覧で比べられます" : "まだ届いていません";
        if (nEl && !got) nEl.textContent = "—";
        if (nEl && got) nEl.textContent = got + "か国";
      }
      if (/確認状況/.test(lt) && s && /提出前に確認/.test(s.textContent || "")) s.textContent = "依頼の内容を確かめてください";
    });
    $$(".k-card", hd).forEach((c) => {
      const h = $("h2, h3", c);
      if (h && /見積の内訳（貴社のレート）/.test(h.textContent || "")) {
        h.textContent = "届いた見積";
        const b = $$("div, p", c).find((x) => /貴社のレートでの見積はありません/.test(x.textContent || "") && !x.querySelector("div, p"));
        if (b) b.textContent = "物流会社の見積はまだ届いていません。届くと、この窓の下の一覧と「出荷を進める」に出ます。";
        const nt = $$(".rd-note", c).find((x) => /レート管理/.test(x.textContent || "")); if (nt) nt.style.display = "none";
      }
    });
  }
  let qt = 0;
  const startObs = () => {
    const dw = document.getElementById("dw");
    if (!dw || RD._v92flowObs) return;
    RD._v92flowObs = 1;
    new MutationObserver(() => { clearTimeout(qt); qt = setTimeout(() => { try { fixQuoteDw(); } catch (e) { /* 無視 */ } }, 120); }).observe(dw, { childList: true, subtree: true });
  };
  startObs(); setTimeout(startObs, 1500);

  const old = RD.after;
  RD.after = function () {
    const r = old.apply(this, arguments);
    try {
      startObs();
      const w = document.getElementById("well") || document.querySelector(".stage") || document.body;
      const k = RD.curKey ? RD.curKey() : "";
      if (k === "deal") fixDeal(w);
      if (k === "dash:home" || k === "dash") fixHome(w);
      if (k === "dash:case") fixCase(w);
      if (k === "task") fixTask(w);
    } catch (e) { console.error("[rd v92flow]", e); }
    return r;
  };
})();
