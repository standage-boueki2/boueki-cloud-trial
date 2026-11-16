/* 21.92 r8a（刷新版の層）
   health-T08：受注を記録した（次の行動は空）あとも、案件一覧・案件の詳細の「次の行動」が前の記録の「サンプルを送る」のままだった
     → window.v92r3a.next（rd_v92z1r3a が使う1か所）を包み、いちばん新しい記録が「受注」で次の行動が空のときは、前の記録の次の行動を返さない
       （そのときは r6a・r6x の「受注の書類を確かめて送る」などが出る）。判定は本体の層 v92r8a.staleNext。
   other-T09：AIバイヤー開拓・拠点の「最近のアクティビティ」で、送っていない商談の記録に「送信」の札が付いていた → 「記録」 */
(function () {
  'use strict';
  const RD = window.RDX;
  if (!RD || RD._v92r8a) return;
  RD._v92r8a = 1;
  const { $$ } = RD;
  const lang = () => { try { const el = document.getElementById('lang'); const v = String((el && el.value) || (window.I18N && window.I18N.lang) || document.documentElement.lang || 'ja'); return /^en/.test(v) ? 'en' : /^zh/.test(v) ? 'zh' : /^es/.test(v) ? 'es' : 'ja'; } catch (e) { return 'ja'; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === 'en' ? en : l === 'zh' ? (zh || en) : l === 'es' ? (es || en) : ja; };
  const well = () => document.getElementById('well') || document.querySelector('.stage') || document.body;
  const curKey = () => { try { return RD.curKey ? RD.curKey() : ''; } catch (e) { return ''; } };

  /* health-T08 */
  const wrapNext = () => {
    try {
      const A = window.v92r3a, B = window.v92r8a;
      if (!A || typeof A.next !== 'function' || A.next._r8a || !B || typeof B.staleNext !== 'function') return;
      const o = A.next;
      const f = function (id) {
        const N = o.apply(this, arguments);
        try {
          if (!N || !N.t) return N;
          const c = (RD.allCases ? (RD.allCases() || []) : []).find((x) => x && String(x.id) === String(id));
          if (c && c.name && B.staleNext(c.name, N.t)) return null;
        } catch (e) { /* 無視 */ }
        return N;
      };
      f._r8a = 1;
      A.next = f;
    } catch (e) { /* 無視 */ }
  };
  wrapNext();

  /* other-T09 */
  function actTags(w) {
    $$('.rd-li[data-rddba]', w).forEach((b) => {
      const tg = b.querySelector('.rd-tag');
      const lt = b.querySelector('.rd-lt');
      if (!tg || !lt || tg.dataset.r8a) return;
      if (/^送信$/.test(String(tg.textContent || '').trim()) && /^商談の記録（|^Meeting record \(/.test(String(lt.textContent || '').trim())) {
        tg.dataset.r8a = '1';
        tg.textContent = M('記録', 'Record', '记录', 'Registro');
        tg.setAttribute('data-noi18n', '1');
        tg.classList.remove('or');
        tg.title = M('商談の記録です（相手には送っていません）', 'A meeting record (not sent to the buyer)', '商谈记录（未发送给对方）', 'Registro de reunión (no enviado)');
      }
    });
  }
  function apply() {
    try {
      wrapNext();
      const k = curKey();
      if (k === 'db') actTags(well());
    } catch (e) { console.error('[rd v92r8a]', e); }
  }
  const old = RD.after;
  RD.after = function () { const r = old.apply(this, arguments); apply(); return r; };
  let t1 = 0;
  document.addEventListener('click', () => { clearTimeout(t1); t1 = setTimeout(apply, 350); }, false);
})();
