/* 21.94 r9b：刷新版の層（9巡目の直し）。今の部品は差し替えず、RDX.after を包む
   ① 用語集の入口：左の帯の用語集の箱が見えている間は、見出しの下の「📖 用語集」のリンクだけを外す（説明の行は残す。other-U02）。
      r8b の判定（箱が見えるか）は、21.93 の層が箱を描き直す前に読んで外れていた（r8x の記録）→ 描いたあと少し遅れて見直す
   ② スマホ幅：表が枠の中で横に送れるときは、送れることを表の上に書く（xcut-U06。目標と道筋の年ごとの表は CSS で縦に積む）
   ③ 「次は 受信箱で承認して送る（残り N件）」の吹き出し（title）を、受信箱の同じボタンと同じ文に（daily-U04）
   ④ メンバー・権限：完成形の見本を開いている間は、見本の商品も「登録している商品」に数える（商品一覧と同じ数。food-U05）
   ⑤ 中古車・建設機械：入力欄の例文（相手の会社名・建値の場所・荷印・港）と、営業資料の画面の「価格表（単価・数量帯）」「図面で見積」を商材に合わせる（auto-08・auto-N16）
   （CSS：目標と道筋の年ごとの表を 390 で縦に積む・「Coming Soon・開発中」の札・確定した販売先国のカード） */
(function () {
  'use strict';
  const RD = window.RDX;
  if (!RD || RD._v92r9b) return;
  RD._v92r9b = 1;
  const $ = RD.$ || ((s, r) => (r || document).querySelector(s));
  const $$ = RD.$$ || ((s, r) => Array.from((r || document).querySelectorAll(s)));
  const lang = () => { try { const el = document.getElementById('lang'); const v = String((el && el.value) || (window.I18N && window.I18N.lang) || document.documentElement.lang || 'ja'); return /^en/.test(v) ? 'en' : /^zh/.test(v) ? 'zh' : /^es/.test(v) ? 'es' : 'ja'; } catch (e) { return 'ja'; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === 'en' ? en : l === 'zh' ? (zh || en) : l === 'es' ? (es || en) : ja; };
  const fwd = () => { try { return !!RD.isFwd(); } catch (e) { return false; } };
  const locked = () => { try { return !!RD.locked(); } catch (e) { return document.body.classList.contains('locked'); } };
  const setTxt = (el, t) => { if (el && el.textContent !== t) el.textContent = t; };
  const vis = (el) => !!(el && (el.offsetWidth || el.offsetHeight));
  const curKey = () => { try { return RD.curKey ? RD.curKey() : ''; } catch (e) { return ''; } };
  const well = () => document.getElementById('well') || document.querySelector('.stage') || document.body;
  const G = (n) => { try { return RD.G ? RD.G(n) : window[n]; } catch (e) { return undefined; } };
  const now = () => { try { const A = window.v92r6a; return A && A.now ? A.now() : null; } catch (e) { return null; } };

  /* ───── ① 用語集の入口 ───── */
  const shown = (el) => {
    if (!el || !(el.offsetWidth || el.offsetHeight)) return false;
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    return c.visibility !== 'hidden' && r.right > 0 && r.left < window.innerWidth;
  };
  function fixGloss() {
    try {
      const s = document.querySelector('#rdside .v92misc-gl');
      // 見出しの下の行が「📖 用語集」だけになっている（説明の文が見えない）ときだけ外す。説明の文が見える幅では、文の中の「用語集」は残す
      const p = document.querySelector('.rd-hero.k-slim p.k-termhint.k-hint2');
      const only = !p || parseFloat(getComputedStyle(p).fontSize) === 0;
      const on = !!(s && only && shown(s) && shown(document.getElementById('rdside')));
      const h = document.documentElement;
      if (h.classList.contains('k-r9b-glside') !== on) h.classList.toggle('k-r9b-glside', on);
    } catch (e) { /* 無視 */ }
  }

  /* ───── ② スマホ幅：横に送れる表 ───── */
  function fixSwipe(w) {
    const narrow = window.innerWidth <= 640;
    $$('.k-r9b-swipe', w).forEach((p) => { const box = p.nextElementSibling; if (!narrow || !box || !(box.scrollWidth > box.clientWidth + 12)) p.remove(); });
    if (!narrow) return;
    $$('table', w).forEach((t) => {
      if (!vis(t)) return;
      let p = t.parentElement, box = null;
      for (let i = 0; p && p !== w && i < 4; i++, p = p.parentElement) { const c = getComputedStyle(p); if (/auto|scroll/.test(c.overflowX)) { box = p; break; } }
      if (!box || !(box.scrollWidth > box.clientWidth + 12)) return;
      const prev = box.previousElementSibling;
      if (prev && prev.classList.contains('k-r9b-swipe')) { setTxt(prev, M('← 表は横に動かせます →', '← Swipe the table sideways →', '← 表格可左右滑动 →', '← Deslice la tabla hacia los lados →')); return; }
      const h = document.createElement('p');
      h.className = 'k-r9b-swipe'; h.setAttribute('data-noi18n', '1');
      h.textContent = M('← 表は横に動かせます →', '← Swipe the table sideways →', '← 表格可左右滑动 →', '← Deslice la tabla hacia los lados →');
      box.before(h);
    });
  }

  /* ───── ③ 「次は 受信箱で承認して送る」の吹き出し ───── */
  function fixNextTitle(w) {
    const N = now();
    if (!N || N.r7b !== 'inbox' || !(N.pend > 0)) return;
    const t = M('承認待ちの営業メールが ' + N.pend + '件あります。押すと受信箱の「確認・承認」を開き、「承認して送る」を光らせます',
      N.pend + ' sales e-mail(s) are waiting for approval. Press to open “Review & approve” in the inbox.',
      '有 ' + N.pend + ' 封营销邮件等待确认。按下后打开收件箱的“确认・批准”。',
      'Hay ' + N.pend + ' correo(s) de ventas pendientes de aprobación. Pulse para abrir «Revisar y aprobar» en la bandeja.');
    const L = $$('[data-rdhero] .k-hcta, [data-rdhero] .k-next', w).filter((b) => vis(b) && /^次の手順：|^Next: |^下一步：|^Siguiente: /.test(b.title || ''));
    L.forEach((b) => { if (b.title !== t) b.title = t; });
  }

  /* ───── ④ メンバー・権限：登録している商品（完成形の見本を開いている間） ───── */
  function fixTeam(w, k) {
    if (k !== 'team') return;
    let T = null, TS = null;
    try { T = typeof TEN !== 'undefined' ? TEN : null; TS = typeof TENS !== 'undefined' ? TENS : null; } catch (e) { return; } // eslint-disable-line no-undef
    if (!T || T.src !== 'sample' || !Array.isArray(TS) || TS.indexOf(T) >= 0) return;
    const tile = $$('.rd-p2 .k-tile', w).find((x) => /^登録している商品$|^Registered products$|^已登记的商品$|^Productos registrados$/.test((($('.k-tl', x) || {}).textContent || '').trim()));
    if (!tile) return;
    const own = TS.length, n = own + 1;
    const tn = $('.k-tn', tile);
    if (tn && tn.dataset.r9b !== String(n)) {
      const u = $('small', tn);
      tn.textContent = String(n); if (u) tn.appendChild(u);
      tn.dataset.r9b = String(n); tn.dataset.v89n = String(n);
    }
    let s = $('.k-v92mix', tile);
    const col = ($('.k-ts', tile) || $('.k-tn', tile) || {}).parentElement || tile;
    if (!s) { s = document.createElement('small'); s.className = 'k-v92mix'; s.dataset.kqn = '1'; col.appendChild(s); }
    s.setAttribute('data-noi18n', '1');
    setTxt(s, M('内訳：見本（いま開いている完成形の見本・保存しません）1・御社が登録 ' + own, 'Breakdown: sample (the finished sample you are viewing; not saved) 1, registered by you ' + own, '明细：样本（当前打开的完成样本・不保存）1・贵公司登记 ' + own, 'Desglose: muestra (la muestra completa abierta; no se guarda) 1, registrados por usted ' + own));
  }

  /* ───── ⑤ 中古車・建設機械（1台から売る商材）：入力欄の例文を商材に合わせる（auto-08 の残り。日本語の画面） ───── */
  const AUTO_P = [
    ['例：Golden Harvest Trading', '例：Delta Heavy Equipment Trading'],
    ['場所（例：パリ・横浜港）', '場所（例：ハイフォン港・横浜港）'],
    ['例：ETINCELLE / SEOUL', '例：DHE / HAIPHONG / UNIT NO.1'],
    ['例：Le Havre／Bangkok', '例：Haiphong／Manila']
  ];
  function fixAutoPh() {
    if (lang() !== 'ja') return;
    let c = '';
    try { c = String(((typeof TEN !== 'undefined' && TEN) || {}).cat || ''); } catch (e) { return; } // eslint-disable-line no-undef
    if (c !== '中古車' && c !== '建設機械') return;
    $$('input[placeholder], textarea[placeholder]').forEach((el) => { for (const p of AUTO_P) { if (el.placeholder === p[0]) el.placeholder = p[1]; } });
    // 営業資料の画面：価格の言い方（1台ごと）と、次の一歩の選択肢（図面ではなく仕様書。資料の中身は本体の層で同じにしている。auto-N16）
    if (curKey() !== 'deck') return;
    const AUTO_T = [['価格表（単価・数量帯）', '価格表（1台ごとの価格）'], ['で数量帯と単価を入力', 'で1台の価格を入力'], ['図面で見積', '仕様書']];
    const w = well();
    const tw = document.createTreeWalker(w, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      const v = n.nodeValue;
      if (!v || v.length < 4 || v.length > 600) continue;
      let v2 = v;
      for (const p of AUTO_T) if (v2.indexOf(p[0]) >= 0) v2 = v2.split(p[0]).join(p[1]);
      if (v2 !== v) n.nodeValue = v2;
    }
  }

  function apply() {
    try {
      fixGloss();
      fixAutoPh();
      if (locked()) return;
      const w = well(), k = curKey();
      if (!fwd()) { fixNextTitle(w); fixTeam(w, k); }
      fixSwipe(w);
    } catch (e) { console.error('[rd v92r9b]', e); }
  }
  let t1 = 0, t2 = 0;
  const soon = () => { clearTimeout(t1); clearTimeout(t2); t1 = setTimeout(apply, 300); t2 = setTimeout(apply, 1500); };
  const old = RD.after;
  if (typeof old === 'function') RD.after = function () { const r = old.apply(this, arguments); try { apply(); } catch (e) { /* 無視 */ } soon(); return r; };
  document.addEventListener('click', soon, false);
  window.addEventListener('resize', soon);
  // 用語集の箱は、ほかの層があとから描き直す・html の class を書き直すことがある → そのたびに見直す
  let gT = 0;
  const gSoon = () => { clearTimeout(gT); gT = setTimeout(fixGloss, 60); };
  try { new MutationObserver(gSoon).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] }); } catch (e) { /* 無視 */ }
  const watchSide = () => { const sd = document.getElementById('rdside'); if (!sd) { setTimeout(watchSide, 600); return; } try { new MutationObserver(gSoon).observe(sd, { childList: true, subtree: true }); } catch (e) { /* 無視 */ } gSoon(); };
  watchSide();
  try { const lg = document.getElementById('lang'); if (lg) lg.addEventListener('change', () => setTimeout(apply, 900)); } catch (e) { /* 無視 */ }
  soon();
})();
