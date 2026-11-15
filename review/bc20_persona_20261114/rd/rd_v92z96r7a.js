/* 21.92 r7a（刷新版の層）
   health-S08：案件一覧・案件の詳細の「次の行動」。状況「見積提示」を記録した相手（アプリからはまだ連絡を送っていない）に
   「最初の連絡を送る」と出ていた → 状況に合った行動「見積の返事を確かめる」に（受注の相手は r6a が直している。ここは見積提示だけ）。 */
(function () {
  const RD = window.RDX;
  if (!RD || RD._v92r7a) return;
  RD._v92r7a = 1;
  const { $, $$ } = RD;
  const lang = () => { try { const el = document.getElementById('lang'); const v = String((el && el.value) || (window.I18N && window.I18N.lang) || document.documentElement.lang || 'ja'); return /^en/.test(v) ? 'en' : /^zh/.test(v) ? 'zh' : /^es/.test(v) ? 'es' : 'ja'; } catch (e) { return 'ja'; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === 'en' ? en : l === 'zh' ? (zh || en) : l === 'es' ? (es || en) : ja; };
  const well = () => document.getElementById('well') || document.querySelector('.stage') || document.body;
  const curKey = () => { try { return RD.curKey ? RD.curKey() : ''; } catch (e) { return ''; } };
  const cases = () => { try { return RD.allCases ? (RD.allCases() || []) : []; } catch (e) { return []; } };
  const T_FIRST = '最初の連絡を送る';
  const QUO = (c) => !!(c && /^見積提示/.test(String(c.ss || '')));
  const firstTxt = (el) => Array.from(el.childNodes).find((x) => x.nodeType === 3 && x.nodeValue.trim());
  const Q_T = () => M('見積の返事を確かめる', 'Check for a reply to the quote', '确认报价的回复', 'Comprobar la respuesta a la cotización');
  const Q_S = () => M('見積提示を記録した案件です（アプリからは、まだ連絡を送っていません。返事が来たら、商談の記録に残します）', 'A quote is recorded for this case (nothing has been sent from the app yet; record the reply when it arrives)', '此案件已记录报价（尚未从应用发送联系；收到回复后请记入商谈记录）', 'Hay una cotización registrada (aún no se ha enviado nada desde la app)');
  function rows(w) {
    const body = $('#k-clbody', w);
    if (!body) return;
    const ord = RD._caseOrder || [];
    const L = cases();
    $$('tr.k-clrow', body).forEach((tr, i) => {
      const nx = $('.c-nx > span', tr);
      if (!nx) return;
      const t = firstTxt(nx);
      if (!t || t.nodeValue.trim() !== T_FIRST) return;
      const c = L.find((x) => x.key === ord[i]);
      if (!QUO(c)) return;
      const sm = $('small', nx);
      nx.setAttribute('data-noi18n', '1'); t.nodeValue = Q_T(); nx.title = Q_T(); if (sm) sm.textContent = Q_S();
    });
    if (!body.dataset.r7ao) { body.dataset.r7ao = '1'; new MutationObserver(() => { try { rows(well()); } catch (e) { /* 無視 */ } }).observe(body, { childList: true }); }
  }
  function detail(w) {
    const p = $('.k-cd .k-cdnx', w);
    if (!p) return;
    const t = firstTxt(p);
    if (t && t.nodeValue.trim() === T_FIRST && QUO(RD._case0)) { p.setAttribute('data-noi18n', '1'); t.nodeValue = Q_T(); const sm = $('small', p); if (sm) sm.textContent = Q_S(); }
  }
  function apply() {
    try {
      const w = well(), k = curKey();
      if (k === 'dash:home') rows(w);
      if (k === 'dash:case') detail(w);
    } catch (e) { console.error('[rd v92r7a]', e); }
  }
  const old = RD.after;
  RD.after = function () { const r = old.apply(this, arguments); apply(); return r; };
  let t1 = 0;
  document.addEventListener('click', () => { clearTimeout(t1); t1 = setTimeout(apply, 300); }, false);
})();
