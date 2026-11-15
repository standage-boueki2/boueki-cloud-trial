/* 21.92 r6x：刷新版の層（6巡目の直しを重ねた版の確かめで見つけた食い違い）。今の部品は差し替えず、RDX.after を包む
   ① 受注を記録した案件の「次の行動」（r6a の food-R04）と、受注の案件の書類（r6b の caseList）の食い違い
      r6a は、状況が 取引中 で次の行動が「最初の連絡を送る」の案件を、いつも
      「受注の書類をつくる（見積書・請求書）／…「書類をつくる」で作れます」にする（書類があるかは見ていない）。
      書類をつくり「受注内容を編集」で直したあとも「作れます」のままで、分析の内訳（r6b）は同じ案件を
      「金額の出どころ：書類の額」と出す。→ その案件に書類（出荷案件）があるかを r6b の window.v92r6b.cases() の
      1か所で見て、あれば「受注の書類を確かめて送る／書類は「書類をつくる」に入っています（案件 No.）」にする。
      書類が無い間は r6a の文のまま。案件一覧の行と、案件の詳細の両方。 */
(function () {
  'use strict';
  const RD = window.RDX;
  if (!RD || RD._v92r6x) return;
  RD._v92r6x = 1;
  const { $, $$ } = RD;
  const lang = () => { try { const el = document.getElementById('lang'); const v = String((el && el.value) || (window.I18N && window.I18N.lang) || document.documentElement.lang || 'ja'); return /^en/.test(v) ? 'en' : /^zh/.test(v) ? 'zh' : /^es/.test(v) ? 'es' : 'ja'; } catch (e) { return 'ja'; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === 'en' ? en : l === 'zh' ? (zh || en) : l === 'es' ? (es || en) : ja; };
  const well = () => document.getElementById('well') || document.querySelector('.stage') || document.body;
  const curKey = () => { try { return RD.curKey ? RD.curKey() : ''; } catch (e) { return ''; } };
  const fwd = () => { try { return !!RD.isFwd(); } catch (e) { return false; } };
  const locked = () => { try { return !!RD.locked(); } catch (e) { return document.body.classList.contains('locked'); } };

  // r6a が入れる文（4つの言語）と、もとの文。どちらが出ていても同じ扱いにする
  const T_FIRST = '最初の連絡を送る';
  const R6A_T = ['受注の書類をつくる（見積書・請求書）', 'Create the order documents (quote / invoice)', '制作订单文件（报价单・发票）', 'Crear los documentos del pedido (cotización / factura)'];
  const DOC_ALL = ['受注の書類を確かめて送る（見積書・請求書）', 'Review and send the order documents (quote / invoice)', '确认并发送订单文件（报价单・发票）', 'Revisar y enviar los documentos del pedido (cotización / factura)'];
  const DOC_T = () => M(DOC_ALL[0], DOC_ALL[1], DOC_ALL[2], DOC_ALL[3]);
  const DOC_S = (no) => M(`受注を記録した案件です。書類は「書類をつくる」に入っています（案件 No. ${no}）。相手にはまだ送っていません`,
    `An order is recorded for this case. Its documents are in “Create documents” (case no. ${no}). Nothing has been sent yet`,
    `此案件已记录订单。文件已在“制作文件”中（案件编号 ${no}）。尚未发送给对方`,
    `Este caso tiene un pedido registrado. Sus documentos están en «Crear documentos» (caso n.º ${no}). Aún no se ha enviado nada`);
  const WON = (c) => !!(c && /^(取引中|受注)$/.test(String(c.ss || '')));
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const firstTxt = (el) => Array.from(el.childNodes).find((x) => x.nodeType === 3 && x.nodeValue.trim());
  // 受注の案件のうち、書類（出荷案件）があるもの。r6b の caseList が決めた「受注」と「書類の案件 No.」だけを使う
  const wonDocs = () => { try { const A = window.v92r6b; return A && A.cases ? (A.cases() || []).filter((x) => x && x.stage === 'won' && x.S && x.no) : []; } catch (e) { return []; } };
  const docOf = (c, L) => {
    if (!WON(c) || !c.name) return null;
    const n = norm(c.name);
    return L.find((x) => norm(x.buyer) === n && (c.pi == null || !x.u || x.u.i == null || x.u.i === c.pi)) || null;
  };
  function paint(host, c, L) {
    const t = firstTxt(host);
    if (!t) return;
    const v = t.nodeValue.trim();
    if (v !== T_FIRST && R6A_T.indexOf(v) < 0 && DOC_ALL.indexOf(v) < 0) return;
    const d = docOf(c, L);
    if (!d) return;
    const sm0 = $('small', host);
    if (v === DOC_T() && (!sm0 || sm0.textContent === DOC_S(d.no))) return;
    host.setAttribute('data-noi18n', '1');
    t.nodeValue = DOC_T();
    if (host.title) host.title = DOC_T();
    const sm = $('small', host);
    if (sm) sm.textContent = DOC_S(d.no);
  }
  function paintRows(body) {
    const ord = RD._caseOrder || [];
    let C = []; try { C = RD.allCases ? (RD.allCases() || []) : []; } catch (e) { C = []; }
    const L = wonDocs();
    if (!L.length) return;
    $$('tr.k-clrow', body).forEach((tr, i) => {
      const nx = $('.c-nx > span', tr);
      if (!nx) return;
      paint(nx, C.find((x) => x.key === ord[i]), L);
    });
  }
  function apply() {
    try {
      if (locked() || fwd()) return;
      const w = well(), k = curKey();
      if (k === 'dash:home') {
        const body = $('#k-clbody', w);
        if (body) {
          paintRows(body);
          if (!body.dataset.r6xo) { body.dataset.r6xo = '1'; new MutationObserver(() => { try { paintRows(body); } catch (e) { /* 無視 */ } }).observe(body, { childList: true, subtree: true, characterData: true }); }
        }
      } else if (k === 'dash:case') {
        const p = $('.k-cd .k-cdnx', w);
        if (p) { const L = wonDocs(); if (L.length) paint(p, RD._case0, L); }
      }
    } catch (e) { console.error('[rd v92r6x]', e); }
  }
  const old = RD.after;
  RD.after = function () {
    const r = old.apply(this, arguments);
    apply();
    return r;
  };
  let t1 = 0, t2 = 0;
  const soon = () => { clearTimeout(t1); clearTimeout(t2); t1 = setTimeout(apply, 300); t2 = setTimeout(apply, 1700); };
  document.addEventListener('click', soon, false);
  const lg = document.getElementById('lang');
  if (lg) lg.addEventListener('change', () => setTimeout(apply, 800));
})();
