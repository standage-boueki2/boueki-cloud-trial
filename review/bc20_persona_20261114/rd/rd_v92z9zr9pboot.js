/* 貿易クラウドAI商社マン 21.94 r9p：読み込みの遅さと、読み込み中の画面のカクつき（刷新版の層の「いちばん前」に読む。build.py が rd.js の前に置く）
   計測（fix/r9p/notes.txt）で分かったこと：
   ・「更新」のあと、刷新版の層（約60本）が1本ずつ読まれる間に、画面が何度も別の形で描かれる
     （本体の前のデザインのダッシュボード → 途中まで仕上げた画面 →「こんばんは！」の前のホーム → 案件一覧）。layout shift の合計 約1.0（8820 も同じ）。
   ・rd.js の見張り（0.5秒おき・最初の20秒）が、何も変わっていなくても毎回 RDX.after（この作業で 34 層に包まれた）を最後まで回す。
     1回 約40ms（CPU 1/4 の条件で 約150ms）× 約40回。読み込みのあとも 20〜30 秒、画面のどこかが描き直され続ける。
     自分の描いた変化（見出しを #well に入れる）で見張りがもう一度動き、同じ仕上げを2回することもある。
   直し（全部の層に効く仕組み。特定の層の中身には頼らない）：
   ① 読み込みの間（文書の解析が終わる＝DOMContentLoaded まで）は RDX.after を動かさない（呼ばれたら「あとで1回」に印だけ付ける）。
      全部の層がそろったあと（rd.js の start の見張り）に1回だけ仕上げる。この間、画面は build.py が head に入れた「読み込み中」の表示で隠す。
   ② 読み込みのあと：rd.js の見張り（0.5秒おき・#well の子の入れ替え）から来た RDX.after は、前に仕上げてから
      アプリが画面を入れ替えて（#well の子の足し引き・#well そのものの入れ替え＝rd.js の見張りが見ているのと同じ所）おらず、
      状態（画面のキー・言語・鍵・ホーム／分析・幅・商品・body の class）も変わっていなければ飛ばす。
      ほかの層・アプリが直接呼んだ RDX.after は、今までどおり毎回動かす。
      仕上げが #well の子を足し引きしたときは、今までその変化で見張りがもう一度動いて必ず2回目があったので、同じ2回目をその場で1回だけ行う
      （後ろの層が前の層の仕上げた所を書き換える順のものが、2回目でそろう）。
   ③ 最初の仕上げが終わったら「読み込み中」を外して、仕上がった画面を1回で出す（鍵のかかった画面＝ログインはすぐ出す。5秒たっても仕上げが来なければ出す。
      それでも外れないときは CSS の側で 15 秒で出る） */
(function () {
  "use strict";
  if (window.__rdBoot) return;
  const now = () => (window.performance && performance.now ? performance.now() : Date.now());
  const B = (window.__rdBoot = { on: true, pend: 0, runs: 0, second: 0, skips: 0, gated: 0, depth: 0, dirty: true, sig: "", last: 0, shown: false, t: {} });
  const html = document.documentElement;
  const locked = () => !!(document.body && document.body.classList.contains("locked"));
  // 画面を出す（「読み込み中」を外す）
  function reveal(why) {
    if (B.shown) return;
    B.shown = true;
    B.t.reveal = Math.round(now());
    B.why = why;
    const go = () => { try { html.classList.add("rd-ready"); } catch (e) { /* 無視 */ } };
    // 仕上げた DOM を同じフレームで出す（次の描画の前に印を付ける）
    try { requestAnimationFrame(go); } catch (e) { go(); }
    setTimeout(go, 100);
  }
  B.reveal = reveal;
  // 状態の印：これが変わったら仕上げ直す
  function sigNow(R) {
    const g = (f) => { try { return f(); } catch (e) { return ""; } };
    return [
      g(() => R.curKey()),
      g(() => (typeof cur !== "undefined" ? cur : "")), // eslint-disable-line no-undef
      g(() => (typeof fwdCur !== "undefined" ? fwdCur : "")), // eslint-disable-line no-undef
      g(() => (typeof opsTab !== "undefined" ? opsTab : "")), // eslint-disable-line no-undef
      g(() => R.dashMode),
      g(() => (typeof I18N !== "undefined" && I18N ? I18N.lang : "") + "/" + html.lang), // eslint-disable-line no-undef
      locked() ? "L" : "U",
      g(() => (R.isFwd && R.isFwd() ? "F" : "S")),
      innerWidth <= 760 ? "m" : innerWidth <= 1100 ? "t" : "d",
      g(() => (typeof PID !== "undefined" ? PID : "")), // eslint-disable-line no-undef
      g(() => (typeof TENS !== "undefined" && TENS ? TENS.length : "")), // eslint-disable-line no-undef
      document.body ? document.body.className : "",
    ].join("|");
  }
  // 画面の入れ替え（アプリの描き直し＝#well の子の入れ替え・#well そのものの入れ替え）を見る。RDX.after が自分で描いた分は数えない。
  //   rd.js の見張り（MutationObserver）が見ているのと同じ所。中の細かい変化（ほかの層の 1.5 秒おきの仕上げ など）は数えない
  let mo = null, well = null;
  function watch() {
    try {
      if (!mo) mo = new MutationObserver(() => { B.dirty = true; });
      const w = document.getElementById("well");
      if (w !== well) { well = w; B.dirty = true; mo.disconnect(); if (w) mo.observe(w, { childList: true }); }
    } catch (e) { mo = null; B.dirty = true; }
  }
  function settle(R) {
    // 仕上げた直後の状態を覚える（仕上げが描いた分の変化の知らせは捨てる）
    watch();
    try { if (mo) mo.takeRecords(); } catch (e) { /* 無視 */ }
    B.dirty = !mo;
    B.sig = sigNow(R);
    B.last = now();
  }
  function install(R) {
    if (!R || typeof R !== "object" || R.__rdBootGate) return;
    R.__rdBootGate = 1;
    let cur = null;
    const gate = (f) => {
      if (typeof f !== "function" || f.__rdGate) return f;
      const g = function () {
        // 層の中で前の層を呼ぶときは、そのまま通す
        if (B.depth > 0) return f.apply(this, arguments);
        if (B.on) { B.pend++; B.gated++; return undefined; }
        // rd.js の見張り（onWell の中＝R._busy）から来て、前に仕上げてから何も変わっていなければ飛ばす
        if (R._busy && mo) {
          watch(); // #well が入れ替わっていたら見直す（そのときは仕上げる）
          // rd.js の見張りは、この見張りより先に知らせを受ける（先に作られたため）。まだ届いていない知らせもここで読む
          try { if (mo.takeRecords().length) B.dirty = true; } catch (e) { B.dirty = true; }
          if (!B.dirty && B.sig && sigNow(R) === B.sig) { B.skips++; return undefined; }
        }
        B.depth++;
        B.runs++;
        try {
          const r = f.apply(this, arguments);
          // 仕上げが #well の子を足し引きしたとき（見出し・案件一覧などを入れたとき）は、続けてもう1回だけ通す。
          //   今までは、その足し引きで rd.js の見張りがもう一度動き、2回目の仕上げが必ずあった。後ろの層が前の層の仕上げた所を書き換える順のもの
          //   （例：案件一覧の「次は：商品を登録（足りない情報を埋める）」を、文言が入ったあとで shortBtns が縮める）は、その2回目でそろっていた。
          //   同じ2回目を、知らせを待たずにこの場で行う（3回目以降の空回りはしない）
          let echo = false;
          try { echo = !!(mo && mo.takeRecords().length); } catch (e) { echo = false; }
          if (echo && !locked()) { B.second++; try { f.apply(this, arguments); } catch (e) { /* 無視 */ } }
          return r;
        } finally {
          B.depth--;
          settle(R);
          if (!B.shown) reveal("after");
        }
      };
      g.__rdGate = 1;
      return g;
    };
    try {
      cur = gate(R.after);
      Object.defineProperty(R, "after", { configurable: true, enumerable: true, get() { return cur; }, set(f) { cur = gate(f); } });
    } catch (e) { /* 包めないときは今までどおり */ }
  }
  // window.RDX ができた瞬間に包む（rd.js の「const RD = (window.RDX = {…})」）
  try {
    if (window.RDX) install(window.RDX);
    else {
      let rdx;
      Object.defineProperty(window, "RDX", {
        configurable: true, enumerable: true,
        get() { return rdx; },
        set(v) {
          rdx = v;
          try { install(v); } catch (e) { /* 無視 */ }
          try { Object.defineProperty(window, "RDX", { value: v, writable: true, configurable: true, enumerable: true }); } catch (e) { /* 無視 */ }
        },
      });
    }
  } catch (e) { B.on = false; }
  // 文書の解析が終わったら（全部の層がそろったら）止めるのをやめる。rd.js の start（このあとの DOMContentLoaded）が仕上げを呼ぶ
  function end() {
    if (!B.on) return;
    B.on = false;
    B.t.end = Math.round(now());
    watch();
    // 鍵のかかった画面（ログイン）は仕上げを待たずに出す。仕上げが来ないときも 5 秒で出す
    setTimeout(() => { if (locked()) reveal("locked"); }, 0);
    setTimeout(() => reveal("timeout"), 5000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", end); else end();
  window.addEventListener("load", () => { end(); setTimeout(() => reveal("load"), 1500); });
})();
