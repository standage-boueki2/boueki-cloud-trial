/* 21.92 r7b：刷新版の層（7巡目の直し：AIバイヤー開拓と受信箱〔確認・承認〕）。今の部品は差し替えず、RDX.after を包む
   ① 受信箱にも右上の「次は」（出どころは本体の層の v92r6a.now()＝ほかの画面と同じ）。
      承認待ちの初回の営業メールがある間は「この画面で承認して送る（N件）」（押すと「確認・承認」を開いて「承認して送る」を光らせる）。
      手順が済んだら「次は 商談を進める」（auto-S01・daily-S04・xcut-S06・indagri-S04）
   ② 「次は」が光らせたボタンは、続けて押しても毎回 光る（前の光を消すタイマーが、付け直した光を消していた。health-S04）
   ③ 規制を調べる：調べる枠の中を実際に操作したときだけ済み（見ただけ・「次は」を押しただけでは済みにしない。culture-N17）
   ④ AIバイヤー開拓の「連絡した相手」の数え方を、目標と道筋の根拠と同じに（other-S03）／販売先国の目次（auto-Q03） */
(function () {
  'use strict';
  const RD = window.RDX;
  if (!RD || RD._v92r7b) return;
  RD._v92r7b = 1;
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

  /* ───── ② 光：続けて押しても、3秒あまりは光ったまま ───── */
  const live = new Set();
  let liveT = 0;
  function keep(el, ms) {
    if (!el) return;
    el.__r7bU = Date.now() + (ms || 3200);
    live.add(el);
    if (!liveT) liveT = setInterval(() => {
      const t = Date.now();
      live.forEach((x) => {
        if (!x.isConnected || t >= x.__r7bU) { live.delete(x); try { if (x.isConnected && t >= x.__r7bU) x.classList.remove('k-r5c-pulse'); } catch (e) { /* 無視 */ } return; }
        if (!x.classList.contains('k-r5c-pulse')) { x.__r7bSelf = Date.now(); x.classList.add('k-r5c-pulse'); }
      });
      if (!live.size) { clearInterval(liveT); liveT = 0; }
    }, 120);
  }
  function pulse(el, noScroll) {
    if (!el) return;
    if (!noScroll) { try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { try { el.scrollIntoView(); } catch (x) { /* 無視 */ } } }
    el.__r7bSelf = Date.now();
    el.classList.remove('k-r5c-pulse');
    void el.offsetWidth;
    el.classList.add('k-r5c-pulse');
    keep(el, 3200);
    try { if (/^(BUTTON|A|INPUT|SELECT)$/.test(el.tagName)) el.focus({ preventScroll: true }); } catch (e) { /* 無視 */ }
  }

  /* ───── ① 受信箱の「次は」 ───── */
  const okBtn = (w) => { const b = $('#v84q .v84q-cur [data-act="card.qok"]', w); return vis(b) ? b : null; };
  const okIsOb = (b) => /^ob:/.test(String((b && b.getAttribute('data-arg')) || ''));
  function fixInbox(w, k) {
    const hero = $('[data-rdhero]', w);
    let b = hero && $('.k-r7b-next', hero);
    const N = k === 'inbox' && !fwd() ? now() : null;
    if (!hero || !N || !N.next) { if (b) b.remove(); return; }
    const act = N.r7b === 'inbox';
    const label = act ? M('この画面で承認して送る（' + N.pend + '件）', 'Approve & send on this screen (' + N.pend + ')', '在本页确认后发送（' + N.pend + '件）', 'Aprobar y enviar aquí (' + N.pend + ')') : N.label;
    const title = act
      ? M('承認待ちの営業メールが ' + N.pend + '件あります。押すと「確認・承認」を開き、「承認して送る」を光らせます（1件でも送ると、手順「バイヤーを探す」が済みになります）', N.pend + ' sales e-mail(s) are waiting for approval. Press to open “Review & approve” and highlight “Approve and send” (sending one completes the “Find buyers” step)', '有 ' + N.pend + ' 件营业邮件等待确认。按下后打开“确认・批准”并高亮“批准并发送”（发送1件即完成“寻找买家”步骤）', 'Hay ' + N.pend + ' correo(s) pendientes de aprobación. Pulse para abrir «Revisar y aprobar» y resaltar «Aprobar y enviar»')
      : M('次の手順：' + N.next.t + '（はじめの設定の、まだの手順）', 'Next: ' + N.label + ' (the next unfinished setup step)', '下一步：' + N.label + '（初始设置中尚未完成的步骤）', 'Siguiente: ' + N.label + ' (paso pendiente)');
    const sig = (act ? 'act' : 'go:' + N.key) + '|' + label + '|' + lang();
    if (!b) {
      b = document.createElement('button');
      b.type = 'button'; b.className = 'k92c-hnext k-r7b-next';
      hero.appendChild(b);
    }
    if (b.dataset.sig !== sig) {
      b.dataset.sig = sig;
      b.dataset.r7b = act ? 'act' : 'go';
      if (act) delete b.dataset.r6astep; else b.dataset.r6astep = N.key;   // 移るときは、ほかの画面の「次は」と同じ受け口（r6a）で動く
      b.title = title;
      b.innerHTML = '<small data-noi18n="1">' + esc(NEXT_W()) + '</small><b data-noi18n="1">' + esc(label) + '</b>' + I('arr', 16, 2.4);
    }
    b.classList.toggle('k-r5c-here', act);
  }
  function actInbox() {
    const w = well();
    let b = okBtn(w);
    if (b && okIsOb(b)) { pulse(b); return; }
    try { if (A7().openApprove) A7().openApprove(); } catch (e) { /* 無視 */ }
    let n = 0;
    const tm = setInterval(() => {
      n++;
      const x = okBtn(well());
      if (x) { clearInterval(tm); pulse(x); } else if (n > 12) clearInterval(tm);
    }, 250);
  }

  /* ───── ③ 規制を調べる：調べる枠の中の操作で済み ───── */
  const regOn = () => !locked() && !fwd() && curKey() === 'ops:reg';
  function regDone() {
    try {
      if (A7().regOp && A7().regOp()) {
        try { RD.after(); } catch (e) { /* 無視 */ }
        setTimeout(apply, 80);
        try { const tt = G('toast'); if (typeof tt === 'function') tt(M('規制を確かめました（はじめの設定の「規制を調べる」が済みになりました）', 'Regulations reviewed (setup step done)', '已确认法规（初始设置的该步骤已完成）', 'Regulaciones revisadas (paso completado)')); } catch (e) { /* 無視 */ }
      }
    } catch (e) { /* 無視 */ }
  }
  const REG_CTL = 'button, a[href], select, input, summary, label, [data-act], [data-onclick]';
  const regHit = (t) => !!(t && t.closest && t.closest('#sec-0') && !t.closest('.k-q') && !t.closest('.k-r7b-reghint') && t.closest(REG_CTL));
  function fixReg(w, k) {
    const s = k === 'ops:reg' && !fwd() ? $('#sec-0', w) : null;
    let h = $('.k-r7b-reghint', w);
    const N = s ? now() : null;
    const need = !!(N && N.next && N.next.id === 'reg');
    if (!need) { if (h) h.remove(); return; }
    const t = M('この手順は、この枠の中を操作すると済みになります（送り先の国を選ぶ・表の「対応済みにする」などを押す・「AIで最新規制を詳細調査」を押す）。開いただけ・見ただけでは済みになりません。',
      'This step is completed when you operate something in this box (choose the destination country, press a button in the table such as “Mark as done”, or run the AI research). Just opening or viewing it does not complete it.',
      '在此框内进行操作后，本步骤才算完成（选择目的国、点击表中的“标记为已处理”等按钮，或点击“用AI详细调查最新法规”）。仅打开或查看不会算作完成。',
      'Este paso se completa al operar algo en este cuadro (elegir el país de destino, pulsar un botón de la tabla o ejecutar la investigación con IA). Solo abrirlo o verlo no lo completa.');
    if (!h) {
      h = document.createElement('p');
      h.className = 'k-r7b-reghint'; h.setAttribute('data-noi18n', '1'); h.setAttribute('role', 'note');
      const rc = $('#rC', s);
      const host = (rc && (rc.closest('.rw, .g2, p, div') || rc.parentElement)) || null;
      if (host && host !== s) host.insertAdjacentElement('afterend', h); else s.insertAdjacentElement('afterbegin', h);
    }
    setTxt(h, t);
  }

  /* ───── ④ AIバイヤー開拓：「連絡した相手」の数え方（目標と道筋の根拠と同じ：商談の記録だけの相手は数えない） ───── */
  function fixDbCount(w, k) {
    if (k !== 'db') return;
    try {
      const T = G('TEN');
      const ths = Object.values((T && T.dmThreads) || {}).filter((th) => th && Array.isArray(th.msgs) && th.msgs.length);
      const real = ths.filter((th) => th.msgs.some((m) => m && !m.sim && (m.w !== 'me' || !/^商談の記録（/.test(String(m.subj || ''))))).length;
      const tile = $$('.rd-x .rd-tile, .rd-x .k-tile', w).find((x) => /^(連絡した相手|Buyers contacted)$/.test((((($('b, .k-tl', x) || {}).textContent) || '').trim())));
      if (!tile) return;
      const tn = $('.rd-tn, .k-tn', tile);
      const shown = tn ? parseInt(String(tn.textContent).replace(/[^\d]/g, ''), 10) : NaN;
      const total = ths.length;
      if (!(shown >= 0) || !(total >= 0)) return;
      const rec = Math.max(0, total - real);
      let note = $('.k-r7b-cnt', tile);
      if (!rec) { if (note) note.remove(); return; }
      if (tn && shown !== real) { const u = $('small', tn); tn.textContent = String(real); if (u) tn.appendChild(u); }
      const t = M('ほかに、商談の記録だけの相手 ' + rec + '社（まだ送っていません）', 'Plus ' + rec + ' with a meeting record only (nothing sent yet)', '另有仅有商谈记录的对象 ' + rec + ' 家（尚未发送）', 'Además, ' + rec + ' solo con registro de negociación (sin envío)');
      if (!note) { note = document.createElement('small'); note.className = 'k-r7b-cnt'; note.setAttribute('data-noi18n', '1'); (tn && tn.parentElement ? tn.parentElement : tile).appendChild(note); }
      setTxt(note, t);
      tile.title = M('連絡した相手＝メッセージを送った・受け取った相手（目標と道筋の「連絡した相手」と同じ数え方）。商談の記録だけの相手は別に数えます', 'Buyers contacted = buyers you have exchanged messages with (same count as in Goal & roadmap). Buyers with only a meeting record are counted separately', '已联系对象＝有消息往来的对象（与“目标与路径”相同的统计方式）。仅有商谈记录的对象另计', 'Contactados = con mensajes enviados o recibidos (igual que en Objetivo y hoja de ruta). Los que solo tienen registro se cuentan aparte');
      // 下の一覧の見出し（全部の相手が並ぶ）
      $$('.rd-x .rd-card .rd-ch', w).forEach((ch) => {
        const h = $('h2', ch);
        if (h && h.textContent === '連絡した相手' && !h.dataset.r7b) { h.dataset.r7b = '1'; h.setAttribute('data-noi18n', '1'); h.textContent = M('連絡した相手・商談を記録した相手', 'Buyers contacted or with a meeting record', '已联系或已记录商谈的对象', 'Contactados o con registro de negociación'); }
      });
    } catch (e) { /* 無視 */ }
  }
  /* 販売先国：確定した国が AI の推奨と違うとき、目次の「② 分析結果と推奨3か国」に、確定は別であることを一言（auto-Q03） */
  function fixCtyToc(w, k) {
    if (k !== 'cty') return;
    try {
      const T = G('TEN');
      const ch = (T && T.ctySel && Array.isArray(T.ctySel.chosen)) ? T.ctySel.chosen.filter(Boolean) : [];
      const top = (T && T.ctySel && Array.isArray(T.ctySel.top)) ? T.ctySel.top.filter(Boolean) : [];
      const diff = ch.length && top.length && (ch.length !== top.length || ch.some((c) => top.indexOf(c) < 0));
      $$('a, button, li, [role=tab], .k-toc *, [class*=toc] *', w).forEach((x) => {
        if (x.children.length > 6) return;
        const t = (x.textContent || '').trim();
        if (!/^② 分析結果と推奨3か国|^② Analysis results/.test(t) || t.length > 120) return;
        if (x.querySelector('a, button, li') && !x.matches('a, button')) return;
        let n = $('.k-r7b-toc', x);
        if (!diff) { if (n) n.remove(); return; }
        const s = M('（AI の推奨。確定は ' + ch.join('・') + '）', ' (AI recommendation; confirmed: ' + ch.join(', ') + ')', '（AI 的推荐；已确定：' + ch.join('・') + '）', ' (recomendación de IA; confirmados: ' + ch.join(', ') + ')');
        if (!n) { n = document.createElement('small'); n.className = 'k-r7b-toc'; n.setAttribute('data-noi18n', '1'); x.appendChild(n); }
        setTxt(n, s);
      });
    } catch (e) { /* 無視 */ }
  }

  function apply() {
    try {
      if (locked() || fwd()) return;
      const w = well(), k = curKey();
      fixInbox(w, k); fixReg(w, k); fixDbCount(w, k); fixCtyToc(w, k);
    } catch (e) { console.error('[rd v92r7b]', e); }
  }
  const old = RD.after;
  RD.after = function () {
    const r = old.apply(this, arguments);
    apply();
    return r;
  };

  // 前の層（r6a）の受け口のあとで受ける（window の同じ段で、あとから登録した順）
  window.addEventListener('click', (e) => {
    const t = e.target;
    if (!t || !t.closest) return;
    try {
      const mine = t.closest('.k-r7b-next[data-r7b="act"]');
      if (mine) { e.preventDefault(); e.stopPropagation(); actInbox(); return; }
      if (regOn() && regHit(t)) regDone();
    } catch (x) { /* 無視 */ }
  }, true);
  window.addEventListener('change', (e) => { try { if (regOn() && e.target && e.target.closest && e.target.closest('#sec-0')) regDone(); } catch (x) { /* 無視 */ } }, true);
  // r6a が付けた光（前の層の受け口は、あとの受け口を止めるので、光が付いたこと自体を見る）：
  //   ・続けて押して付け直した光は、前の光を消すタイマーに消されないよう、付け直してから3秒あまり保つ
  //   ・規制を調べる：枠の全体ではなく、最初に操作する「送り先の国」を光らせる
  try {
    new MutationObserver((recs) => {
      for (const r of recs) {
        const x = r.target;
        if (!x || !x.classList || !x.classList.contains('k-r5c-pulse')) continue;
        if (x.__r7bSelf && Date.now() - x.__r7bSelf < 80) continue;
        if (x.id === 'sec-0' && curKey() === 'ops:reg') {
          const rc = document.getElementById('rC');
          if (rc && vis(rc)) {
            x.classList.remove('k-r5c-pulse');
            pulse(rc);
            const h = $('.k-r7b-reghint'); if (h) { h.classList.remove('k-r7b-blink'); void h.offsetWidth; h.classList.add('k-r7b-blink'); }
            continue;
          }
        }
        keep(x, 3200);
      }
    }).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });
  } catch (e) { /* 無視 */ }

  // 画面の中だけが描き直されたとき（承認した・見送った・相手を選んだ）も、すぐ合わせる
  let t1 = 0, t2 = 0, t3 = 0;
  const soon = () => { try { if (A7().pendingReset) A7().pendingReset(); } catch (e) { /* 無視 */ } clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); t1 = setTimeout(apply, 300); t2 = setTimeout(() => { try { if (A7().pendingReset) A7().pendingReset(); } catch (e) { /* 無視 */ } apply(); }, 1700); t3 = setTimeout(() => { try { if (A7().pendingReset) A7().pendingReset(); } catch (e) { /* 無視 */ } apply(); }, 3600); };
  document.addEventListener('click', soon, false);
  document.addEventListener('change', soon, false);
  const lg = document.getElementById('lang');
  if (lg) lg.addEventListener('change', () => setTimeout(apply, 750));
})();
