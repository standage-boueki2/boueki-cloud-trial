/* 21.94 r8b：刷新版の層（8巡目の直し：21.93 の直しとこの作業の直しのかみ合わせ）。今の部品は差し替えず、RDX.after を包む
   ① 規制を調べる：「次は この画面で規制を確かめる」が光らせるのは、押すと済みになるボタン「表で確かめる（国名）」（daily-T02）。
      押すと、その国の表（必要な手続き）へ送って済みにする。「次は」を押しただけ・開いただけでは済みにしない（culture-N17 のまま）
   ② 受信箱の「次は」：承認待ちが残る間は「この画面で承認して送る（残り N件）」（xcut-T01）
   ③ 商品情報の円：真ん中は「入っている数/全体」と、数どおりの %（21.93 の数え方）にそろえる（other-T01）
   ④ ログイン：担当者名の欄から「任意」を外す（登録のあるアカウントでは要るため。daily-T10・medical-T08）
   ⑤ 用語集の入口：左の帯の箱があるときは、見出しの下の「📖 用語集」を出さない（food-T01） */
(function () {
  'use strict';
  const RD = window.RDX;
  if (!RD || RD._v92r8b) return;
  RD._v92r8b = 1;
  const { $, $$ } = RD;
  const lang = () => { try { const el = document.getElementById('lang'); const v = String((el && el.value) || (window.I18N && window.I18N.lang) || document.documentElement.lang || 'ja'); return /^en/.test(v) ? 'en' : /^zh/.test(v) ? 'zh' : /^es/.test(v) ? 'es' : 'ja'; } catch (e) { return 'ja'; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === 'en' ? en : l === 'zh' ? (zh || en) : l === 'es' ? (es || en) : ja; };
  const fwd = () => { try { return !!RD.isFwd(); } catch (e) { return false; } };
  const locked = () => { try { return !!RD.locked(); } catch (e) { return document.body.classList.contains('locked'); } };
  const setTxt = (el, t) => { if (el && el.textContent !== t) el.textContent = t; };
  const vis = (el) => !!(el && (el.offsetWidth || el.offsetHeight));
  const A6 = () => window.v92r6a || {};
  const A7 = () => window.v92r7b || {};
  const now = () => { try { return A6().now ? A6().now() : null; } catch (e) { return null; } };
  const well = () => document.getElementById('well') || document.querySelector('.stage') || document.body;
  const curKey = () => { try { return RD.curKey ? RD.curKey() : ''; } catch (e) { return ''; } };
  const esc = RD.esc || ((s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])));
  const I = RD.I || (() => '');
  const G = (n) => { try { return RD.G ? RD.G(n) : undefined; } catch (e) { return undefined; } };
  const NEXT_W = () => M('次は', 'Next', '下一步', 'Siguiente');

  function pulse(el) {
    if (!el) return;
    try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { try { el.scrollIntoView(); } catch (x) { /* 無視 */ } }
    el.classList.remove('k-r5c-pulse');
    void el.offsetWidth;
    el.classList.add('k-r5c-pulse');
    clearTimeout(el.__r8bT);
    el.__r8bT = setTimeout(() => { try { el.classList.remove('k-r5c-pulse'); } catch (e) { /* 無視 */ } }, 3400);
    try { el.focus({ preventScroll: true }); } catch (e) { /* 無視 */ }
  }

  /* ───── ① 規制を調べる ───── */
  const regNeed = () => { const N = now(); return !!(N && N.next && N.next.id === 'reg'); };
  const ctyNm = () => { const rc = $$('select#rC').find(vis) || document.getElementById('rC'); if (!rc) return ''; const o = rc.options && rc.options[rc.selectedIndex]; return String((o && o.textContent) || rc.value || '').trim(); };
  const regLbl = () => { const c = ctyNm(); return c ? M('表で確かめる（' + c + '）', 'Review the table (' + c + ')', '查看法规表（' + c + '）', 'Revisar la tabla (' + c + ')') : M('表で確かめる', 'Review the table', '查看法规表', 'Revisar la tabla'); };
  function fixReg(w, k) {
    const s = k === 'ops:reg' && !fwd() ? $('#sec-0', w) : null;
    let b = $('.k-r8b-regok', w);
    if (!s || !regNeed() || !$('#rO', s)) { if (b) b.remove(); return; }
    if (!b) {
      b = document.createElement('button');
      b.type = 'button'; b.className = 'btn k-r8b-regok'; b.setAttribute('data-noi18n', '1');
      const h = $('.k-r7b-reghint', s);
      const rc = $('#rC', s);
      const host = h || (rc && (rc.closest('.rw, .g2, p, div') || rc.parentElement)) || null;
      if (host && host !== s) host.insertAdjacentElement('afterend', b); else s.insertAdjacentElement('afterbegin', b);
    }
    setTxt(b, '✓ ' + regLbl());
    b.title = M('押すと、この国の「販売・出荷の前に必要な手続き」の表へ移り、はじめの設定の「規制を調べる」が済みになります', 'Jumps to this country’s table of required procedures and completes the setup step “Check regulations”', '跳转到该国“销售・出货前所需手续”表，并完成初始设置的“查法规”', 'Va a la tabla de trámites de este país y completa el paso «Revisar regulaciones»');
    // 枠の中の説明（r7b）：押すボタンを先に書く
    const h = $('.k-r7b-reghint', s);
    if (h) setTxt(h, M('この手順は、下の「表で確かめる」を押すと済みになります（送り先の国を選び替える・表の「対応済みにする」などを押す・「AIで最新規制を詳細調査」を押す、でも済みになります）。開いただけ・見ただけでは済みになりません。',
      'This step is completed when you press “Review the table” below (choosing another destination, pressing a button in the table such as “Mark as done”, or running the AI research also completes it). Just opening or viewing does not.',
      '点击下方“查看法规表”即可完成本步骤（选择其他目的国、点击表中的“标记为已处理”等按钮或“用AI详细调查最新法规”也可完成）。仅打开或查看不算完成。',
      'Este paso se completa al pulsar «Revisar la tabla» abajo (también al elegir otro destino, pulsar un botón de la tabla o ejecutar la investigación con IA). Solo abrir o ver no lo completa.'));
  }
  function regTable() {
    const o = document.getElementById('rO');
    if (!o) return null;
    return $$('.v54r-h', o).find(vis) || $$('p.lbl', o).find((x) => vis(x) && /必要な書類|Required documents/.test(x.textContent || '')) || o;
  }
  // 「表で確かめる」：済みにして（r7b と同じ受け口）、表へ送る
  document.addEventListener('click', (e) => {
    const b = e.target && e.target.closest && e.target.closest('.k-r8b-regok');
    if (!b) return;
    e.preventDefault();
    try {
      if (regNeed() && A7().regOp && A7().regOp()) {
        try { const tt = G('toast'); if (typeof tt === 'function') tt(M('規制を確かめました（はじめの設定の「規制を調べる」が済みになりました）', 'Regulations reviewed (setup step done)', '已确认法规（初始设置的该步骤已完成）', 'Regulaciones revisadas (paso completado)')); } catch (x) { /* 無視 */ }
      }
    } catch (x) { /* 無視 */ }
    const t = regTable();
    setTimeout(() => { try { RD.after(); } catch (x) { /* 無視 */ } const t2 = regTable() || t; if (t2) { try { t2.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (x) { /* 無視 */ } } }, 60);
  }, false);
  // 「次は この画面で規制を確かめる」：光らせるのは「表で確かめる」。前の層（r6a）が枠を光らせ、r7b が「送り先の国」へ移した光を、このボタンへ移す
  let regMv = 0;
  function moveRegPulse() {
    regMv = 0;
    try {
      if (locked() || fwd() || curKey() !== 'ops:reg' || !regNeed()) return;
      const b = $('.k-r8b-regok', well());
      if (!b || !vis(b)) return;
      ['rC', 'sec-0'].forEach((id) => { const x = document.getElementById(id); if (x) { x.__r7bU = 1; x.classList.remove('k-r5c-pulse'); } });
      b.__r7bSelf = Date.now();
      pulse(b);
    } catch (e) { /* 無視 */ }
  }
  try {
    new MutationObserver((recs) => {
      for (const r of recs) {
        const x = r.target;
        if (!x || (x.id !== 'rC' && x.id !== 'sec-0') || !x.classList || !x.classList.contains('k-r5c-pulse')) continue;
        if (!regMv) regMv = setTimeout(moveRegPulse, 30);
      }
    }).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });
  } catch (e) { /* 無視 */ }
  document.addEventListener('change', (e) => { try { if (e.target && e.target.id === 'rC') { const b = $('.k-r8b-regok'); if (b) setTxt(b, '✓ ' + regLbl()); } } catch (x) { /* 無視 */ } }, false);

  /* ───── ② 受信箱の「次は」：承認待ちが残る間 ───── */
  function fixInbox(w, k) {
    if (k !== 'inbox' || fwd()) return;
    const hero = $('[data-rdhero]', w);
    const b = hero && $('.k-r7b-next', hero);
    if (!b) return;
    const N = now();
    let P = null;
    try { P = A7().pending ? A7().pending() : null; } catch (e) { P = null; }
    if (!N || !N.next || !P || !(P.n > 0)) { if (b.dataset.r8b) { delete b.dataset.r8b; delete b.dataset.sig; } return; }
    const rest = !!N.rest || (N.next && N.next.id !== 'buyer');
    const label = rest ? M('この画面で承認して送る（残り ' + P.n + '件）', 'Approve & send on this screen (' + P.n + ' left)', '在本页确认后发送（剩余 ' + P.n + ' 件）', 'Aprobar y enviar aquí (quedan ' + P.n + ')')
      : M('この画面で承認して送る（' + P.n + '件）', 'Approve & send on this screen (' + P.n + ')', '在本页确认后发送（' + P.n + '件）', 'Aprobar y enviar aquí (' + P.n + ')');
    const sig = 'r8b|' + label + '|' + lang();
    if (b.dataset.r8b !== sig || b.dataset.r7b !== 'act') {
      b.dataset.r8b = sig;
      b.dataset.r7b = 'act';
      delete b.dataset.r6astep;
      b.title = M('承認待ちの営業メールが ' + P.n + '件あります。押すと「確認・承認」を開き、「承認して送る」を光らせます', P.n + ' sales e-mail(s) are waiting for approval. Press to open “Review & approve”.', '有 ' + P.n + ' 封营销邮件等待确认。点击后打开“确认・批准”。', 'Hay ' + P.n + ' correo(s) pendientes de aprobación. Pulse para abrir «Revisar y aprobar».');
      b.innerHTML = '<small data-noi18n="1">' + esc(NEXT_W()) + '</small><b data-noi18n="1">' + esc(label) + '</b>' + I('arr', 16, 2.4);
    }
    b.classList.add('k-r5c-here');
  }

  /* ───── ③ 商品情報の円 ───── */
  function fixRing(w, k) {
    if (k !== 'item') return;
    const f = window.v92prodFill;
    let t = null; try { t = G('TEN'); } catch (e) { t = null; }
    const K = typeof f === 'function' && t ? f(t) : null;
    const ring = $('.rd-p2 .k-ring', w) || $('.k-ring', w);
    if (!K || !ring) return;
    const optN = K.optMiss.length;
    const sub = K.full && optN ? '任意 あと' + optN + '件' : K.pct + '%';
    ring.style.setProperty('--p', String(K.pct));
    ring.setAttribute('data-v92prod-pct', String(K.pct));
    ring.classList.add('v92prod-ring');
    ring.classList.toggle('v92prod-done', !!K.allDone);
    ring.classList.toggle('v92prod-optleft', !!(K.full && optN && !K.allDone));
    const sp = ring.querySelector(':scope > span') || ring.appendChild(document.createElement('span'));
    const html = '<b class="v92prod-rn">' + K.c + '<small>/' + K.d + '</small></b><em class="v92prod-rs">' + esc(sub) + '</em>';
    if (sp.innerHTML !== html) sp.innerHTML = html;
  }

  /* ───── ④ ログイン：担当者名 ───── */
  function fixLogin() {
    const nm = document.getElementById('lg-name');
    if (!nm) return;
    const ph = M('ご担当者名（招待状・申し込みのときの氏名）', 'Your name (as on the invitation or application)', '负责人姓名（邀请函或申请时的姓名）', 'Su nombre (como en la invitación o la solicitud)');
    if (nm.getAttribute('placeholder') !== ph) nm.setAttribute('placeholder', ph);
    if (nm.getAttribute('aria-label') !== ph) nm.setAttribute('aria-label', ph);
  }

  /* ───── ⑤ 用語集の入口の重なり ───── */
  function fixGloss() {
    const side = document.querySelector('#rdside .v92misc-gl');
    const on = !!(side && vis(side));
    if (document.documentElement.classList.contains('k-r8b-glside') !== on) document.documentElement.classList.toggle('k-r8b-glside', on);
  }

  /* ───── ⑥ 販売先国の選定：確定した国のカードで、国名を途中で折り返さない（health-T10・indagri-T05） ───── */
  function fixCty(w, k) {
    if (k !== 'cty') return;
    $$('.k-tiles', w).forEach((t) => { if (!t.classList.contains('k-r8b-ctyt') && $('.k-card svg + b', t)) t.classList.add('k-r8b-ctyt'); });
  }

  function apply() {
    try { fixLogin(); } catch (e) { /* 無視 */ }
    try {
      if (locked() || fwd()) return;
      const w = well(), k = curKey();
      fixReg(w, k); fixInbox(w, k); fixRing(w, k); fixGloss(); fixCty(w, k);
    } catch (e) { console.error('[rd v92r8b]', e); }
  }
  const old = RD.after;
  RD.after = function () {
    const r = old.apply(this, arguments);
    apply();
    return r;
  };
  // 受信箱で承認したあと（画面の中だけが描き直される）も、すぐ合わせる
  let t1 = 0, t2 = 0;
  const soon = () => { clearTimeout(t1); clearTimeout(t2); t1 = setTimeout(apply, 380); t2 = setTimeout(apply, 1800); };
  document.addEventListener('click', soon, false);
  document.addEventListener('change', soon, false);
  setTimeout(apply, 600);
  try { const lg = document.getElementById('lang'); if (lg) lg.addEventListener('change', () => setTimeout(apply, 800)); } catch (e) { /* 無視 */ }
})();
