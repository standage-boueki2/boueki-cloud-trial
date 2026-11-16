/* 21.92 r9a（刷新版の層）
   ① 受注のあとの「次の行動」（medical-U01・health-T08）
      ・営業メールを送ったあとに受注になった案件が「相手の返事を待つ／フォローの連絡」のままだった
        → 受注（取引中）の案件は、受注のあとに送った連絡が無い限り、受注の行動（書類があれば「受注の書類を確かめて送る」＋案件 No.、無ければ「受注の書類をつくる」）。
          文は r6a・r6x と同じ（案件 No. は r6b の案件の書類 No.＝「書類をつくる」が開く案件）。
      ・アプリを開き直した直後の案件一覧で、前の記録の次の行動（サンプルを送る）が残っていた（r3a が先に描き、r8a の判定が後から入るため）
        → 描いたあとと、開いた直後（少し待って）にも、同じ判定（本体の層 v92r8a.staleNext）で直す。
   ② 案件の詳細の「商談の記録」：確定単価だけの記録に価格の行が無かった（daily-U02） → 確定単価（希望価格があれば併記）を出す */
(function () {
  'use strict';
  const RD = window.RDX;
  if (!RD || RD._v92r9a) return;
  RD._v92r9a = 1;
  const { $, $$ } = RD;
  const lang = () => { try { const el = document.getElementById('lang'); const v = String((el && el.value) || (window.I18N && window.I18N.lang) || document.documentElement.lang || 'ja'); return /^en/.test(v) ? 'en' : /^zh/.test(v) ? 'zh' : /^es/.test(v) ? 'es' : 'ja'; } catch (e) { return 'ja'; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === 'en' ? en : l === 'zh' ? (zh || en) : l === 'es' ? (es || en) : ja; };
  const well = () => document.getElementById('well') || document.querySelector('.stage') || document.body;
  const curKey = () => { try { return RD.curKey ? RD.curKey() : ''; } catch (e) { return ''; } };
  const locked = () => { try { return !!RD.locked(); } catch (e) { return document.body.classList.contains('locked'); } };
  const fwd = () => { try { return !!RD.isFwd(); } catch (e) { return false; } };
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const firstTxt = (el) => Array.from(el.childNodes).find((x) => x.nodeType === 3 && x.nodeValue.trim());
  const WON = (c) => !!(c && /^(取引中|受注)$/.test(String(c.ss || '')));
  // r6a・r6x と同じ文
  const DOC_T = () => M('受注の書類を確かめて送る（見積書・請求書）', 'Review and send the order documents (quote / invoice)', '确认并发送订单文件（报价单・发票）', 'Revisar y enviar los documentos del pedido (cotización / factura)');
  const DOC_S = (no) => M(`受注を記録した案件です。書類は「書類をつくる」に入っています（案件 No. ${no}）。相手にはまだ送っていません`,
    `An order is recorded for this case. Its documents are in “Create documents” (case no. ${no}). Nothing has been sent yet`,
    `此案件已记录订单。文件已在“制作文件”中（案件编号 ${no}）。尚未发送给对方`,
    `Este caso tiene un pedido registrado. Sus documentos están en «Crear documentos» (caso n.º ${no}). Aún no se ha enviado nada`);
  const WON_T = () => M('受注の書類をつくる（見積書・請求書）', 'Create the order documents (quote / invoice)', '制作订单文件（报价单・发票）', 'Crear los documentos del pedido (cotización / factura)');
  const WON_S = () => M('受注を記録した案件です。「書類をつくる」で作れます（相手にはまだ送っていません）', 'An order is recorded for this case. Create them in “Create documents” (nothing has been sent yet)', '此案件已记录订单。可在“制作文件”中制作（尚未发送给对方）', 'Este caso tiene un pedido registrado. Créelos en «Crear documentos» (aún no se ha enviado nada)');
  const R6cases = () => { try { const A = window.v92r6b; return A && A.cases ? (A.cases() || []) : []; } catch (e) { return []; } };
  const caseOf = (c, L) => { const n = norm(c && c.name); return n ? (L.find((x) => x && norm(x.buyer) === n && (c.pi == null || !x.u || x.u.i == null || x.u.i === c.pi)) || null) : null; };
  const ymdOf = (ms) => { try { const d = new Date(+ms); if (isNaN(d.getTime())) return ''; return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); } catch (e) { return ''; } };
  const wonDay = (x) => { try { const W = (x.recs || []).filter((y) => y && y.r && y.r.st === '受注').map((y) => String(y.r.d || '').slice(0, 10)).sort(); return W[W.length - 1] || String(x.wonD || ''); } catch (e) { return ''; } };
  const stale = (c, t) => { try { const B = window.v92r8a; return !!(B && typeof B.staleNext === 'function' && c && c.name && B.staleNext(c.name, t)); } catch (e) { return false; } };

  /* その案件の「次の行動」を受注の行動にするか。返す：{ t, s } か null */
  function wonNext(c, host, L) {
    if (!WON(c) || !c.next) return null;
    const k = c.next.kind;
    if (k === 'reply' || k === 'lost') return null;                        // 相手からの返事がある・失注は、そのまま
    const t0 = firstTxt(host);
    if (!t0) return null;
    const v = String(host.title || t0.nodeValue || '').trim();
    const sm = $('small', host);
    const smT = String((sm && sm.textContent) || '');
    const x = caseOf(c, L);
    const fromRec = /記録した次の行動|商談の記録の「次の行動」/.test(smT);
    if (fromRec) { if (!stale(c, v)) return null; }                       // 記録した次の行動は、受注の後も生きているものはそのまま
    else if (k !== 'wait' && k !== 'follow') return null;                   // 「最初の連絡を送る」は r6a・r6x が受注の行動にする
    else {
      // 受注の後に、こちらから送った連絡がある（書類を送ったなど）ときは「返事を待つ」のまま
      const me = c.lastMe ? ymdOf(c.lastMe.at) : '';
      const wd = x ? wonDay(x) : '';
      if (me && wd && me > wd) return null;
    }
    if (x && x.S && x.no) return { t: DOC_T(), s: DOC_S(x.no) };
    return { t: WON_T(), s: WON_S() };
  }
  function paintOne(host, c, L) {
    try {
      const N = wonNext(c, host, L);
      if (!N) return;
      const t = firstTxt(host);
      const sm = $('small', host);
      if (t.nodeValue.trim() === N.t && (!sm || sm.textContent === N.s)) return;
      host.setAttribute('data-noi18n', '1');
      t.nodeValue = N.t;
      if (host.title) host.title = N.t;
      if (sm) sm.textContent = N.s;
      else { const s = document.createElement('small'); s.textContent = N.s; host.appendChild(s); }
      const td = host.closest('td'); if (td) td.classList.remove('k-r3aod');
    } catch (e) { /* 無視 */ }
  }
  function paintRows(body) {
    const ord = RD._caseOrder || [];
    let C = []; try { C = RD.allCases ? (RD.allCases() || []) : []; } catch (e) { C = []; }
    const L = R6cases();
    $$('tr.k-clrow', body).forEach((tr, i) => {
      const nx = $('.c-nx > span', tr);
      if (!nx) return;
      const c = C.find((x) => x.key === ord[i]);
      if (c) paintOne(nx, c, L);
    });
  }
  /* ② 案件の詳細の「商談の記録」：価格の行（確定単価 ＞ 希望価格） */
  function recPrice(box, c) {
    try {
      const sec = $$('section.k-card', box).find((s) => { const h = $('h2', s); return h && /^(商談の記録|Meeting records?|商谈记录|Registros?)/.test(String(h.textContent || '').trim()); });
      if (!sec || !c || !c.named) return;
      const DLs = $$('dl.k-kv', sec);
      if (!DLs.length) return;
      let F = []; try { F = ((typeof D !== 'undefined' && D && D.fb) || []).slice(); } catch (e) { F = []; } // eslint-disable-line no-undef
      F = F.filter((r) => r && String(r.b || '').trim() === c.name).sort((a, b) => String(b.d || '').localeCompare(String(a.d || '')));
      const P = window.v92r9a && window.v92r9a.priceTxt;
      if (typeof P !== 'function') return;
      DLs.forEach((dl, i) => {
        const r = F[i];
        if (!r || dl.dataset.r9a) return;
        dl.dataset.r9a = '1';
        const p = P(r);
        if (!p || !p.fixed) return;
        const nm = (s) => { const m = String(s || '').replace(/,/g, '').match(/\d+(?:\.\d+)?/); return m ? +m[0] : NaN; };
        const val = p.s + M('（確定単価）', ' (confirmed)', '（确定单价）', ' (confirmado)') + (r.price && String(r.price).trim() !== p.s && nm(r.price) !== nm(p.s) ?M(`・希望 ${r.price}`, ` · requested ${r.price}`, `・期望 ${r.price}`, ` · deseado ${r.price}`) : '');
        const dts = $$('dt', dl);
        const pd = dts.find((d) => /^(価格|Price|价格|Precio)$/.test(String(d.textContent || '').trim()));
        if (pd && pd.nextElementSibling) { pd.nextElementSibling.textContent = val; pd.nextElementSibling.setAttribute('data-noi18n', '1'); }
        else {
          const d0 = dts[0];
          const dt = document.createElement('dt'); dt.textContent = M('価格', 'Price', '价格', 'Precio'); dt.setAttribute('data-noi18n', '1');
          const dv = document.createElement('dd'); dv.textContent = val; dv.setAttribute('data-noi18n', '1');
          const after = d0 && d0.nextElementSibling ? d0.nextElementSibling : null;
          if (after) { after.insertAdjacentElement('afterend', dt); dt.insertAdjacentElement('afterend', dv); } else { dl.appendChild(dt); dl.appendChild(dv); }
        }
      });
    } catch (e) { /* 無視 */ }
  }
  function apply() {
    try {
      if (locked() || fwd()) return;
      const w = well(), k = curKey();
      if (k === 'dash:home') {
        const body = $('#k-clbody', w);
        if (body) {
          paintRows(body);
          if (!body.dataset.r9ao) {
            body.dataset.r9ao = '1';
            let tm = 0;
            new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => { try { if (document.body.contains(body)) paintRows(body); } catch (e) { /* 無視 */ } }, 60); }).observe(body, { childList: true, subtree: true, characterData: true });
          }
        }
      } else if (k === 'dash:case') {
        const box = $('.k-cd', w);
        const p = box && $('.k-cdnx', box);
        if (p && RD._case0) paintOne(p, RD._case0, R6cases());
        if (box) recPrice(box, RD._case0);
      }
    } catch (e) { console.error('[rd v92r9a]', e); }
  }
  const old = RD.after;
  RD.after = function () {
    const r = old.apply(this, arguments);
    apply();
    setTimeout(apply, 60);
    return r;
  };
  let t1 = 0, t2 = 0;
  document.addEventListener('click', () => { clearTimeout(t1); clearTimeout(t2); t1 = setTimeout(apply, 380); t2 = setTimeout(apply, 1800); }, false);
  // 開いた直後：ほかの層が先に描いた一覧を、データがそろってから直す（health-T08）
  [300, 1200, 3000, 6000].forEach((ms) => setTimeout(apply, ms));
  const lg = document.getElementById('lang');
  if (lg) lg.addEventListener('change', () => setTimeout(apply, 900));
})();
