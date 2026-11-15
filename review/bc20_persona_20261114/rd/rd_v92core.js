/* 貿易クラウドAI商社マン 21.92 core（刷新版の層・rd_v92per.js のあとに読む）
   2026-11-14 の「8カテゴリー×ペルソナ評価」の、横断の課題（刷新版が足した部品）の直し。
   今のアプリの関数・刷新版の前の層は差し替えず、RDX.after を包む。数字・進み具合はアプリが持っているものだけ（本体の層 logic_v2192core の window.v92coreSteps()）。
   ① 手順の数え方を1つに（indagri-10・other-13・other-16・culture-13・health-12・medical-13・food-15）
      「はじめの設定」の6つの手順（商品を登録 → 販売先の国を選ぶ → 規制を調べる → 営業資料をつくる → バイヤーを探す → 商談を進める）を、
      画面の帯（商品情報を登録・商品情報・販売先国の選定・規制を調べる・営業資料・AIバイヤー開拓）・ホームの空の状態・タスク・スタートガイドで同じ名前・同じ数で出す。
      規制の画面のタブの帯（1〜4）は「出荷までの流れ」と名前を付けて区別する。画面の中の手順の帯には「この画面の中での進め方」と添える
   ② ホーム（案件）：はじめての人の「次にやること」を1つに。右上は「次は ○○」（ほかの画面と同じ場所・同じ言葉）、空の状態の主ボタンも同じ行き先。
      「はじめの設定 N/6」の札は空の状態の中へ（同じことを2か所で言わない）。目標の提案は小さくたたんで一覧の下へ（消さない）
   ③ スタートガイド：6つの手順に（「規制を調べる」を入れ、「営業資料」と「バイヤー」を分ける）。「困ったら AI商社マン」は番号の外に残す
   ④ 画面の題をメニュー・パンくずの名前に（daily-22）：規制を調べる／書類をつくる／AIバイヤー開拓・拠点／メンバー・権限・セキュリティ／用語集（貿易のことば）
   ⑤ 用語の「？」：二重（印の入れ子）をなくす・語の途中（関税？率・通関？にかかる日数）は語のあとへ（daily-18・health-09・medical-17）
   ⑥ 営業資料：ポイントの例（ISO・HACCP）と表紙の見本の区分（OTHER）を商材に合わせる（culture-10 の残り） */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92core) return;
  RD._v92core = 1;
  const { $, $$, esc, I } = RD;
  const fwd = () => { try { return !!RD.isFwd(); } catch (e) { return false; } };
  const locked = () => { try { return !!RD.locked(); } catch (e) { return true; } };
  const curKey = () => { try { return RD.curKey(); } catch (e) { return ""; } };
  // 進み具合（本体の層）。続けて何度も読むので、ごく短い間だけ控える（画面を描き直したら読み直す）
  let stMemo = null, stAt = 0;
  const steps = () => {
    const now = Date.now();
    if (stMemo && now - stAt < 250) return stMemo;
    try { stMemo = typeof window.v92coreSteps === "function" ? window.v92coreSteps() : null; } catch (e) { stMemo = null; }
    stAt = now;
    return stMemo;
  };
  const cases = () => { try { return (typeof RD.allCases === "function" ? RD.allCases() : RD.dbThreads()) || []; } catch (e) { return []; } };
  const dict = (l) => { try { return (typeof I18N !== "undefined" && I18N && I18N.dict && I18N.dict[l]) || null; } catch (e) { return null; } }; // eslint-disable-line no-undef
  const setTxt = (el, v) => { if (el && el.textContent !== v) el.textContent = v; };
  // 題・ボタンの言い直し：今の文字が「前の言い方」（日本語か、その訳）のときだけ替える
  function reword(el, oldJa, newJa) {
    if (!el) return false;
    const cur = (el.textContent || "").trim();
    if (cur === newJa) return false;
    if (cur === oldJa) { el.textContent = newJa; return true; }
    for (const l of ["en", "zh", "es"]) { const d = dict(l); if (d && d[oldJa] && cur === d[oldJa] && d[newJa]) { el.textContent = d[newJa]; return true; } }
    return false;
  }
  const stepKey = (s) => (s.id === "fill" ? (s.done ? "item" : "up") : s.key);
  const firstTimer = (S) => !!(S && S.has && S.idx >= 0 && S.idx < 4 && !cases().length); // バイヤーを探す前の準備の途中・案件はまだ無い

  /* ───── ① 6つの手順の帯 ───── */
  function flowHtml(S, on, cls) {
    const cells = S.steps.map((s, i) => {
      const here = s.key === on || (on === "item" && s.id === "fill");
      const c = here ? "on" : s.done ? "done" : s.now ? "nx" : "";
      return (i ? `<span class="k92c-ar" aria-hidden="true">${I("chevR", 15, 2.6)}</span>` : "") +
        `<button type="button" class="k92c-st ${c}" data-kbc="${esc(stepKey(s))}"${here ? ' aria-current="step"' : ""}><span class="k92c-n">${s.done ? I("check", 13, 3.2) : i + 1}</span><span class="k92c-t">${esc(s.t)}</span>${s.now && !here ? '<em class="k92c-nxt">次</em>' : ""}</button>`;
    }).join("");
    const sig = on + "|" + S.steps.map((s) => (s.done ? 1 : 0) + (s.now ? "n" : "")).join("");
    return `<div role="navigation" class="rd-x k92c-flow ${cls || ""}" data-k92cflow="${esc(sig)}" aria-label="はじめの設定（6つの手順）"><span class="k92c-fl"><span>はじめの設定</span> <b>${S.done}/${S.all}</b></span><div class="k92c-sts">${cells}</div></div>`;
  }
  function putFlow(w, k, S) {
    const old = $("[data-k92cflow]", w);
    // 商品情報を登録・販売先国の選定には、いつも出す（前の4つの帯の代わり）。ほかの手順の画面は、はじめの設定が終わるまで
    const want = k === "up" || k === "cty" || (S.has && (k === "item" || k === "ops:reg" || k === "deck" || k === "db") && S.done < S.all);
    if (!want) { if (old && !old.closest(".k-card")) old.remove(); return; }
    const html = flowHtml(S, k, "");
    const sig = (html.match(/data-k92cflow="([^"]*)"/) || [])[1];
    if (old && old.getAttribute("data-k92cflow") === sig) return;
    if (old) { old.outerHTML = html; return; }
    // 前の4つの帯（商品登録・国選定・規制確認・提案準備）は、この帯に置き換える
    const sb = $(".rd-stepbar[data-rdsb]", w);
    if (sb) { sb.outerHTML = html; return; }
    const c0 = k === "cty" ? $$(".rd-p2 > section.k-card", w).find((c) => { const st = $(":scope > .k-steps", c); return st && /規制確認|提案準備/.test(st.textContent || ""); }) : null;
    if (c0) { c0.outerHTML = html; return; }
    const hero = $("[data-rdhero]", w);
    if (hero) hero.insertAdjacentHTML("afterend", html);
  }
  // 画面の中の別の帯：名前を付けて、6つの手順と混ざらないように
  function capBands(w, k) {
    const cap = (el, t) => { if (!el || el.previousElementSibling && el.previousElementSibling.classList.contains("k92c-cap")) return; el.insertAdjacentHTML("beforebegin", `<div class="k92c-cap rd-x">${esc(t)}</div>`); };
    if (/^ops:/.test(k) || k === "ship") {
      const ot = $$(".optabs", w).find((x) => !x.closest(".rd-x") && /出荷を進める/.test(x.textContent || ""));
      cap(ot, "出荷までの流れ（下の 1〜4 は、この流れの中の順番です。タブで切り替えます）");
    }
    if (k === "deck") {
      const sb = $$(".k-steps", w).find((x) => /情報を確認/.test(x.textContent || ""));
      cap(sb, "この画面の中での進め方");
      if (sb) $$(".k-step b", sb).forEach((b) => reword(b, "バイヤーに提案", "バイヤーを探す"));
    }
    if (k === "db") {
      const vs = $$(".v71steps", w).find((x) => x.getClientRects().length);
      cap(vs, "この画面の中での進め方");
    }
    if (k === "cty") {
      // 「確定した国で次へ（規制確認）」→ 手順の名前に
      $$(".rd-p2 button", w).forEach((b) => { const t = Array.from(b.childNodes).find((n) => n.nodeType === 3 && /確定した国で次へ（規制確認）/.test(n.nodeValue)); if (t) t.nodeValue = t.nodeValue.replace("（規制確認）", "（規制を調べる）"); });
    }
  }
  // 「次は」の言葉を、手順の名前に
  function nextWords(w) {
    $$(".k-next", w).forEach((b) => {
      const k = b.dataset.kbc, bb = $("b", b);
      if (k === "cty" && reword(bb, "販売先国を選ぶ", "販売先の国を選ぶ")) b.title = "次の手順：販売先の国を選ぶ";
      if (k === "dash:home" && reword(bb, "案件を進める", "商談を進める")) b.title = "次の手順：商談を進める（案件の一覧へ）";
    });
  }

  /* ───── ② ホーム（案件）：次にやることを1つに ───── */
  // 空の状態の手順は、刷新版の部品（rd_case.js）が RD.exportSteps() の先頭3つを出す → 6つの手順を全部出す
  const exp0 = RD.exportSteps;
  RD.exportSteps = function () {
    try {
      const S = steps();
      if (S && S.has) {
        const a = S.steps.map((s) => ({ t: s.t, s: "", st: s.done ? "done" : s.now ? "on" : "", go: () => RD.goKey(stepKey(s)) }));
        a.slice = function () { return a; }; // 「先頭の3つ」ではなく6つとも出す
        return a;
      }
    } catch (e) { /* 前の形で */ }
    return exp0 ? exp0.apply(this, arguments) : [];
  };
  function fixHome(w) {
    const S = steps();
    if (!S || !S.has) return;
    const box = $(".k-cl[data-kcl]", w);
    if (!box) return;
    const ft = firstTimer(S), nx = S.next;
    // 「はじめの設定」の札：行き先と言葉を6つの手順に。空の状態に同じ内容が出ているときは出さない
    const pill = $$(".k-pills .k-pill", box).find((p) => /はじめの設定/.test(p.textContent || ""));
    const empty = $(".k-clempty", box);
    if (pill) {
      if (empty && nx) { const ps = pill.parentElement; pill.remove(); if (ps && !ps.children.length) ps.remove(); }
      else if (nx) {
        const key = stepKey(nx);
        if (pill.dataset.kbc !== key) pill.dataset.kbc = key;
        const b = $("b", pill), pn = $(".k-pn", pill);
        setTxt(b, S.done + "/" + S.all);
        setTxt(pn, "次：" + nx.t + (nx.sub ? "（" + nx.sub + "）" : ""));
      }
    }
    // 空の状態：主ボタンを、いま強調している手順（次の1手）に
    if (empty && nx) {
      const p = $("p", empty);
      if (p && !p.dataset.k92c) { p.dataset.k92c = "1"; p.insertAdjacentHTML("beforeend", ` <span class="k92c-ehint">その前に、はじめの設定（6つの手順）を順に進めます：<b>${S.done}/${S.all}</b></span>`); }
      const btn = $$(".k-btn", empty).find((b) => b.dataset.kbc);
      if (btn && S.idx < 4) {
        const key = stepKey(nx), sig = key + "|" + (nx.sub || "");
        if (btn.dataset.kbc !== key || btn.dataset.k92c !== sig) {
          btn.dataset.kbc = key; btn.dataset.k92c = sig;
          btn.innerHTML = `${I("arr", 18, 2.4)}次は：${esc(nx.t)}${nx.sub ? `（${esc(nx.sub)}）` : ""}`;
          btn.title = nx.why || "";
        }
        // 何が残っているか（アプリが出している「まだの理由」）をボタンの下に
        let wy = $(".k92c-why", empty);
        if (nx.why) {
          if (!wy) { btn.insertAdjacentHTML("afterend", '<small class="k92c-why"></small>'); wy = $(".k92c-why", empty); }
          setTxt(wy, nx.why);
        } else if (wy) wy.remove();
      }
    }
    // 右上：準備の途中は「次は ○○」（ほかの画面と同じ場所・同じ形）。準備が進んだら今の「バイヤーを探す」のまま
    const hero = $("[data-rdhero]", w), cta = hero && $(".k-hcta", hero);
    if (cta) {
      if (ft && nx) {
        const key = stepKey(nx);
        if (cta.dataset.k92c !== key) {
          cta.dataset.k92c = key; cta.dataset.kbc = key;
          cta.className = "k-hcta k92c-hnext"; // 「次は」と同じ見た目（k-next の名前は付けない：パンくずの層が、ホームの k-next を外すため）
          cta.title = "次の手順：" + nx.t;
          cta.innerHTML = `<small>次は</small><b>${esc(nx.t)}</b>${I("arr", 16, 2.4)}`;
        }
      }
    }
    // 目標の提案：準備の途中は、小さくたたんで一覧の下へ（主ボタンを1つにする。提案は消さない）
    const rm = $(".k-rm88", w);
    if (rm && ft) { subProp(rm); if (box.nextElementSibling !== rm) box.after(rm); }
  }
  function subProp(rm) {
    if (rm.classList.contains("k92c-sub")) return;
    rm.classList.add("k92c-sub");
    const ul = $(".v88prop .v88ul", rm);
    if (ul && !ul.closest("details")) { const d = document.createElement("details"); d.className = "k92c-more"; d.innerHTML = "<summary>くわしく</summary>"; ul.before(d); d.appendChild(ul); }
  }

  /* ───── タスク（今日やること）：「輸出のステップ」の帯も6つの手順で ───── */
  function fixToday(w) {
    const S = steps();
    if (!S || !S.has) return;
    // 準備の途中は、目標の提案の主ボタンを控えめに（次の1手は、下の帯の「次」）
    const rm = $(".k-rm88", w);
    if (rm && firstTimer(S)) subProp(rm);
    const card = $$(".rd-p2 > section.k-card", w).find((c) => { const h = $("h2", c); return h && /輸出のステップ|はじめの設定/.test(h.textContent || ""); });
    if (!card) return;
    const ks = $(".k-steps", card);
    if (ks) {
      const h = $("h2", card);
      if (h) h.textContent = "はじめの設定（6つの手順）";
      ks.outerHTML = flowHtml(S, "", "k92c-in") + `<p class="k92c-after">商談が始まったあとは：<button type="button" class="k-link" data-kbc="deal">見積・交渉</button><span aria-hidden="true"> → </span><button type="button" class="k-link" data-kbc="ops:doc">出荷・実行（書類と出荷の手配）</button></p>`;
      return;
    }
    const old = $("[data-k92cflow]", card);
    if (old) { const html = flowHtml(S, "", "k92c-in"); const sig = (html.match(/data-k92cflow="([^"]*)"/) || [])[1]; if (old.getAttribute("data-k92cflow") !== sig) old.outerHTML = html; }
  }

  /* ───── ③ スタートガイド（荷主）：6つの手順 ───── */
  const GUIDE = [
    { id: "fill", ic: "box", b: "商品の資料（PDF・Excel・写真など）をアップロードするだけ。AIが読み取り、足りない情報だけを質問します。", go: [["up", "商品を登録する"]] },
    { id: "cty", ic: "globe", b: "AIが、商品に合った国をデータでおすすめします。3か国まで選んで「確定」します。", go: [["cty", "販売先国の選定を開く"]] },
    { id: "reg", ic: "shield", b: "選んだ国の決まりごと・関税・必要な書類を、商品に合わせて確かめます。", go: [["ops:reg", "規制を調べるを開く"]] },
    { id: "deck", ic: "slides", b: "外国語の営業資料は、AIが商品に合わせて作ります。", go: [["deck", "営業資料を開く"]] },
    { id: "buyer", ic: "send", b: "「AIバイヤー開拓」で相手を見つけて、提案します。", go: [["db", "AIバイヤー開拓を開く"]] },
    { id: "fb", ic: "brief", b: "連絡した相手ごとに「案件」ができます（ログインすると最初に開く画面）。行を押すと、次の行動・やりとり・書類が1画面で見られます。", go: [["dash:home", "案件を開く"]] },
  ];
  function fixGuide() {
    const d = document.getElementById("k-qg");
    if (!d || d.dataset.k92c) return;
    if (!/荷主向け/.test((($(".k-qgchip", d) || {}).textContent) || "")) return; // 物流会社向けの5つの手順は今のまま
    const ol = $(".k-qgst", d);
    if (!ol) return;
    d.dataset.k92c = "1"; d.dataset.v90 = "1"; // ログイン前のボタンも、ここで付ける（rd_v90doc の後付けは要らない）
    const inApp = !locked();
    const S = inApp ? steps() : null;
    const names = (window.V92CORE_STEPS || []).reduce((m, s) => { m[s.id] = s.t; return m; }, {});
    const p = $(".k-qghd p", d);
    if (p) p.textContent = inApp ? "AI商社マンは、この6つの順で使います（「はじめの設定」と同じ並びです）。各手順のボタンから、その画面を開けます。" : "AI商社マンは、この6つの順で使います。各手順のボタンを押すとログインの欄へ進み、ログインすると、その画面が開きます。";
    const btn = (g) => (inApp ? `<button type="button" class="k-btn white k-mini" data-qggo="${esc(g[0])}">${esc(g[1])} ${I("chevR", 14, 2.4)}</button>` : `<button type="button" class="k-btn white k-mini" data-v90qg="${esc(g[0])}">${esc(g[1])}（ログインして開く）</button>`);
    const li = GUIDE.map((x, i) => {
      const s = S && S.has ? S.steps.find((y) => y.id === x.id) : null;
      const tag = s ? (s.done ? '<span class="k92c-gtag ok">済み</span>' : s.now ? `<span class="k92c-gtag nx">次はここ${s.sub ? "（" + esc(s.sub) + "）" : ""}</span>` : "") : "";
      return `<li><span class="k-qgn">${i + 1}</span><span class="k-qgi">${I(x.ic, 24, 1.9)}</span><div class="k-qgtx"><b>${esc(names[x.id] || "")}${tag}</b><p>${esc(x.b)}</p><div class="k-qggo">${x.go.map(btn).join("")}</div></div></li>`;
    }).join("");
    const help = `<li class="k92c-ghelp"><span class="k-qgn" aria-hidden="true">?</span><span class="k-qgi">${I("chat", 24, 1.9)}</span><div class="k-qgtx"><b>困ったら「AI商社マン」</b><p>わからないことは、日本語でそのまま聞けます。案件の中からも聞けます。説明は「？」を押すと出ます。</p><div class="k-qggo">${btn(["ai", "AI商社マンに聞く"])}</div></div></li>`;
    ol.innerHTML = li + help;
  }
  // 「5つの手順」の言い方（左下の入口・困ったとき）を6つに（荷主だけ。物流会社は5つのまま）
  function fixCount() {
    if (locked() || fwd()) return;
    const s = $("#rdside .rd-start small");
    if (s) reword(s, "5つの手順で、使い方の流れだけ", "6つの手順で、使い方の流れだけ");
    $$("#well [data-rdquick] small").forEach((x) => reword(x, "はじめての方へ（5つの手順・この画面の上で開きます）", "はじめての方へ（6つの手順・この画面の上で開きます）"));
  }

  /* ───── ④ 画面の題を、メニュー・パンくずの名前に ───── */
  const TITLE = { "ops:reg": ["規制・必要な書類", "規制を調べる"], "ops:doc": ["書類・出荷管理", "書類をつくる"], db: ["AIバイヤー開拓・商談", "AIバイヤー開拓・拠点"], team: ["メンバー・担当", "メンバー・権限・セキュリティ"], gloss: ["用語集", "用語集（貿易のことば）"] };
  function fixTitle(w, k) {
    const t = TITLE[k];
    if (!t) return;
    reword($("[data-rdhero] .rd-ht h1", w), t[0], t[1]);
  }

  /* ───── ⑤ 用語の「？」 ───── */
  const MARK = ".k-term:not(.k-termdemo), .tm, .v54term";
  const SUF = /^(率|額|費|法|士|手続き|手続|書類|番号|価格|条件|制度|申告|検査|統計)/;
  function fixMarks(w) {
    // 印の入れ子（刷新版の印の中に今のアプリの印）は、内側を外す
    $$(".k-term .tm, .k-term .v54term, .tm .k-term, .v54term .k-term", w).forEach((x) => { const p = x.parentNode; if (!p) return; while (x.firstChild) p.insertBefore(x.firstChild, x); p.removeChild(x); p.normalize(); });
    $$(MARK, w).forEach((el) => {
      if (el.dataset.k92m || el.classList.contains("k-t2")) return;
      const nx = el.nextSibling;
      if (!nx || nx.nodeType !== 3 || !nx.nodeValue) { return; }
      const par = el.parentElement;
      if (!par || par.closest("p.k-termhint")) return;
      const key = el.dataset.kterm || (el.dataset.term || el.textContent || "").trim();
      const full = (par.textContent || "").trim();
      // 短い見出し・ラベル（関税率・通関にかかる日数 など。かな・漢字だけが続くもの）：「？」はラベルの最後に。値・かっこ・空白が続くものは今のまま
      const label = full.length <= 12 && nx === par.lastChild && $$(MARK, par).length === 1 && /^[ぁ-んァ-ヶー一-龠々]{1,8}$/.test(nx.nodeValue);
      const m = label ? null : nx.nodeValue.match(SUF);
      if (!label && !m) return;
      el.dataset.k92m = "1";
      if (!el.dataset.kterm) el.dataset.kterm = key;
      if (label) { el.appendChild(nx); return; }
      const rest = nx.splitText(m[0].length);
      el.appendChild(nx);
      if (rest && !rest.nodeValue) rest.remove();
    });
  }

  /* ───── ⑥ 営業資料：例と見本の区分を商材に合わせる ───── */
  function deckKind() {
    try {
      const T = typeof TEN !== "undefined" ? TEN : null; // eslint-disable-line no-undef
      if (!T || typeof V85DK === "undefined" || !V85DK || typeof V85DK.cat !== "function") return null; // eslint-disable-line no-undef
      const J = V85DK.cat(T); // eslint-disable-line no-undef
      const k = String((J && J.k) || "");
      const P = (typeof V85DK_CATS !== "undefined" && V85DK_CATS && V85DK_CATS[k]) || null; // eslint-disable-line no-undef
      return { k, food: /^(food|fresh|tea|beverage_alcohol|supplement|pet|feed_agri)$/.test(k), en: (P && P.en) || "" };
    } catch (e) { return null; }
  }
  function fixDeck(w) {
    const K = deckKind();
    if (!K || !K.k) return;
    if (!K.food) {
      $$(".rd-p2 li span, .rd-x li span", w).forEach((s) => {
        if (s.children.length) return;
        reword(s, "認証・規格（ISO・HACCP など）があると、海外のバイヤーに安心感を与えられます", "認証・規格（ISO・製品の安全規格 など）があると、海外のバイヤーに安心感を与えられます");
      });
    }
    const sm = $(".k-cover .k-cvb small", w);
    if (sm && /^(OTHER|OTHERS)$/.test((sm.textContent || "").trim())) sm.textContent = K.en ? K.en.toUpperCase() : "MADE IN JAPAN";
  }

  /* ───── まとめて動かす ───── */
  function apply() {
    try { fixGuide(); } catch (e) { console.error("[rd v92core] guide", e); }
    if (locked()) return;
    try { fixCount(); } catch (e) { /* 無視 */ }
    if (fwd()) return;
    const w = $("#well");
    if (!w) return;
    const k = curKey();
    const S = steps();
    try { if (S) putFlow(w, k, S); } catch (e) { console.error("[rd v92core] flow", e); }
    try { capBands(w, k); } catch (e) { console.error("[rd v92core] bands", e); }
    try { nextWords(w); } catch (e) { /* 無視 */ }
    try { fixTitle(w, k); } catch (e) { /* 無視 */ }
    try { if (k === "dash:home") fixHome(w); } catch (e) { console.error("[rd v92core] home", e); }
    try { if (k === "today") fixToday(w); } catch (e) { console.error("[rd v92core] today", e); }
    try { if (k === "deck") fixDeck(w); } catch (e) { /* 無視 */ }
    try { fixMarks(w); } catch (e) { console.error("[rd v92core] marks", e); }
  }
  const prev = RD.after;
  RD.after = function () {
    const r = prev.apply(this, arguments);
    stMemo = null;
    try { apply(); } catch (e) { console.error("[rd v92core]", e); }
    return r;
  };
  // 描き直し（一覧の絞り込み・用語の印の付け直し・スタートガイドの窓）のあとにも同じ仕上げをする。どの直しも、済んでいれば何も書き換えない
  let tmo = 0, busy = false;
  const mo = new MutationObserver(() => { if (busy || tmo) return; tmo = setTimeout(() => { tmo = 0; busy = true; try { apply(); } catch (e) { /* 無視 */ } busy = false; }, 160); });
  const start = () => { try { mo.observe(document.body, { childList: true, subtree: true }); } catch (e) { /* 無視 */ } try { apply(); } catch (e) { /* 最初の描画の前 */ } };
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);

  /* ───── 足した文言の辞書（英語。手順の名前の中・西は本体の層に） ───── */
  try {
    const en = dict("en");
    if (en) {
      [
        ["はじめの設定（6つの手順）", "Getting started (6 steps)"],
        ["その前に、はじめの設定（6つの手順）を順に進めます：", "First, go through the 6 getting-started steps in order:"],
        ["次", "Next"], ["済み", "Done"], ["次はここ", "You are here next"], ["くわしく", "More"],
        ["この画面の中での進め方", "How to proceed on this screen"],
        ["出荷までの流れ（下の 1〜4 は、この流れの中の順番です。タブで切り替えます）", "Flow up to shipping (numbers 1–4 below are the order within this flow; switch with the tabs)"],
        ["商談が始まったあとは：", "Once deals have started:"], ["見積・交渉", "Quotes & negotiation"], ["出荷・実行（書類と出荷の手配）", "Shipping (documents and arrangements)"],
        ["6つの手順で、使い方の流れだけ", "The basics in 6 steps"],
        ["はじめての方へ（6つの手順・この画面の上で開きます）", "New here? (6 steps, opens on this screen)"],
        ["AI商社マンは、この6つの順で使います（「はじめの設定」と同じ並びです）。各手順のボタンから、その画面を開けます。", "Use the AI Trade Agent in these 6 steps (the same order as “Getting started”). Each step's button opens that screen."],
        ["AI商社マンは、この6つの順で使います。各手順のボタンを押すとログインの欄へ進み、ログインすると、その画面が開きます。", "Use the AI Trade Agent in these 6 steps. Each step's button takes you to sign-in, and the screen opens after you sign in."],
        ["選んだ国の決まりごと・関税・必要な書類を、商品に合わせて確かめます。", "Check the rules, duties and required documents of the countries you chose, for your product."],
        ["外国語の営業資料は、AIが商品に合わせて作ります。", "The AI creates a foreign-language sales deck tailored to your product."],
        ["「AIバイヤー開拓」で相手を見つけて、提案します。", "Find buyers with “AI buyer sourcing” and pitch to them."],
        ["規制を調べるを開く", "Open “Check regulations”"],
        ["認証・規格（ISO・製品の安全規格 など）があると、海外のバイヤーに安心感を与えられます", "Certifications and standards (ISO, product safety standards, etc.) reassure overseas buyers"],
      ].forEach((p) => { if (!en[p[0]]) en[p[0]] = p[1]; });
      const pat = (typeof I18N !== "undefined" && I18N && Array.isArray(I18N.pat)) ? I18N.pat : null; // eslint-disable-line no-undef
      if (pat) {
        const nm = (x, d) => (x === "商品を登録" ? "Register a product" : ((d && d[x]) || x)); // 帯・「次は」と同じ訳に
        pat.unshift({ re: /^次は：(.+?)(?:（(.+)）)?$/, en: (m, d) => "Next: " + nm(m[1], d) + (m[2] ? " (" + ((d && d[m[2]]) || m[2]) + ")" : "") });
        pat.unshift({ re: /^次はここ（(.+)）$/, en: (m, d) => "You are here next (" + ((d && d[m[1]]) || m[1]) + ")" });
        pat.unshift({ re: /^次の手順：(.+)（案件の一覧へ）$/, en: (m, d) => "Next step: " + ((d && d[m[1]]) || m[1]) + " (to the case list)" });
      }
      if (!en["足りない情報を埋める"]) en["足りない情報を埋める"] = "Fill in missing information";
    }
  } catch (e) { /* 辞書が無い版 */ }

  // AI商社マンの画面「貴社のいまの準備」の「次をひらく」：足した手順（規制を調べる）の行き先
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest('[data-kprep="reg"]');
    if (b) { try { RD.goKey("ops:reg"); } catch (x) { /* 無視 */ } }
  });
  // 「次は：商品を登録（足りない情報を埋める）」：商品情報を登録・AIヒアリングの層（up）に「質問の欄へ直接」の入口があれば、それを使う（無ければ商品情報を登録の画面へ）
  document.addEventListener("click", (e) => {
    try {
      const b = e.target.closest && e.target.closest('.k-clempty .k-btn[data-kbc="up"], .k92c-hnext[data-kbc="up"]');
      if (!b || typeof window.v92upHearGo !== "function") return;
      const S = steps();
      if (S && S.next && S.next.id === "fill" && S.next.sub && window.v92upHearGo()) { e.preventDefault(); e.stopImmediatePropagation(); }
    } catch (x) { /* 無視 */ }
  }, true);
})();
