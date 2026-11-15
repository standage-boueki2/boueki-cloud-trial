/* 21.92 r5c：刷新版の層（5巡目の直し）。今の部品は差し替えず、RDX.after を包む
   ① 右上の「次は」：その画面の手順がまだなら、その画面の中の主な操作へ送る（行き来しない）。済みなら、まだの次の手順へ。
      全部済みの商品情報は「商談を進める」へ（medical-Q02・food-Q02・health-Q04・xcut-Q03・indagri-Q04）
   ② 規制を調べる：開いただけでは済みにしない。画面の中を見た（下へ送った・押した）ときに済みにする（culture-N17。印は本体の層 window.v92r5c）
   ③ 空の案件一覧：手元に相手がいる人のために「商談を記録する」も置く（indagri-Q04）
   ④ 物流会社の見積受信箱：表を枠に収める（other-Q03）
   ⑤ ログイン画面（390）の入力例・「マウスを乗せると」・見出しの「?」の大きさ（xcut-Q04） */
(function () {
  'use strict';
  const RD = window.RDX;
  if (!RD || RD._v92r5c) return;
  RD._v92r5c = 1;
  const { $, $$ } = RD;
  const lang = () => { try { return String((window.I18N && window.I18N.lang) || document.documentElement.lang || 'ja').slice(0, 2); } catch (e) { return 'ja'; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === 'en' ? en : l === 'zh' ? (zh || en) : l === 'es' ? (es || en) : ja; };
  const fwd = () => { try { return !!RD.isFwd(); } catch (e) { return false; } };
  const locked = () => { try { return !!RD.locked(); } catch (e) { return document.body.classList.contains('locked'); } };
  const setTxt = (el, t) => { if (el && el.textContent !== t) el.textContent = t; };
  const vis = (el) => !!(el && (el.offsetWidth || el.offsetHeight));
  const coreSteps = () => { try { return window.v92coreSteps ? window.v92coreSteps() : null; } catch (e) { return null; } };
  const A = () => window.v92r5c || {};
  const well = () => document.getElementById('well') || document.querySelector('.stage') || document.body;
  const touch = RD.after ? () => { try { RD.after(); } catch (e) { /* 無視 */ } } : () => { };

  /* ───── ① 右上の「次は」 ───── */
  const PAGE_IDX = { up: 0, item: 0, cty: 1, 'ops:reg': 2, deck: 3, db: 4, deal: 5 };
  const byText = (w, sel, re) => $$(sel, w).find((x) => vis(x) && re.test((x.textContent || '').trim()));
  // その画面の中の主な操作：[送り先の要素, 「次は」に出す言葉]
  function inPage(w, k) {
    if (k === 'cty') {
      const ok = byText(w, '.rd-p2 .k-btn.big, .rd-p2 .k-btn', /確定する|Confirm|确定|Confirmar/);
      if (ok) return [ok, M('この画面で国を確定する', 'Confirm the countries on this screen', '在本页确定销售国', 'Confirmar los países aquí')];
      const om = byText(w, '.rd-p2 .k-btn.big, .rd-p2 .k-btn, #well .btn', /おまかせ|Leave it to|交给|Dejar/);
      if (om) return [om, M('この画面で国を選ぶ（おまかせ）', 'Pick countries on this screen (auto)', '在本页选择销售国（交给AI）', 'Elegir países aquí (automático)')];
      return [$('#v54rCtyGo', w) || $('.rd-p2', w), M('この画面で国を確定する', 'Confirm the countries on this screen', '在本页确定销售国', 'Confirmar los países aquí')];
    }
    if (k === 'ops:reg') return [$('#sec-0', w) || $('#rO', w), M('この画面で規制を確かめる', 'Review the regulations on this screen', '在本页确认法规', 'Revisar las regulaciones aquí')];
    if (k === 'deck') {
      const g = byText(w, '.rd-p2 .k-btn.big, .rd-p2 .k-btn.wide', /作る|つくる|生成|Create|Generate|Crear|Generar|制作/) || $('.rd-p2 .k-btn.big', w);
      return [g || $('.rd-p2', w), M('この画面で資料を作る', 'Create the deck on this screen', '在本页制作资料', 'Crear la presentación aquí')];
    }
    if (k === 'db') {
      const mk = $('#rddbob', w);
      if (vis(mk)) return [mk, M('この画面でリストを作る', 'Build the buyer list on this screen', '在本页制作买家名单', 'Crear la lista aquí')];
      const ob = $('#v71obGo', w);
      const box = (ob && ob.closest('.c')) || byText(w, '#well .c h3', /AIバイヤー開拓|AI buyer/);
      return [box || $('.rd-p2', w), M('この画面で相手を選んで連絡する', 'Pick a buyer and contact them on this screen', '在本页选择对象并联系', 'Elegir y contactar aquí')];
    }
    if (k === 'deal') {
      const r = byText(w, '.rd-p2 .k-btn.big, #well .btn', /商談を記録する|Record a deal|记录商谈|Registrar/);
      return [r || $('.rd-p2', w), M('この画面で商談を記録する', 'Record a deal on this screen', '在本页记录商谈', 'Registrar una negociación aquí')];
    }
    return null;
  }
  function restoreNext(b, bb) {
    if (!b.dataset.r5c) return;
    delete b.dataset.r5c; delete b.dataset.r5cgo;
    b.classList.remove('k-r5c-here');
    bb.removeAttribute('data-noi18n');
    if (b.dataset.r5ckbc) b.setAttribute('data-kbc', b.dataset.r5ckbc);
    if (b.dataset.r5cold) { setTxt(bb, b.dataset.r5cold); b.title = '次の手順：' + b.dataset.r5cold; }
    const sm = $('small', b); if (sm && sm.dataset.r5c) { sm.removeAttribute('data-noi18n'); delete sm.dataset.r5c; setTxt(sm, '次は'); }
  }
  function setNext(b, bb, mode, label, title, goKey) {
    if (!b.dataset.r5c) { b.dataset.r5ckbc = b.getAttribute('data-kbc') || ''; b.dataset.r5cold = bb.textContent; }
    if (b.hasAttribute('data-kbc')) b.removeAttribute('data-kbc');
    if (b.dataset.r5c !== mode) b.dataset.r5c = mode;
    if ((b.dataset.r5cgo || '') !== (goKey || '')) b.dataset.r5cgo = goKey || '';
    if (bb.getAttribute('data-noi18n') == null) bb.setAttribute('data-noi18n', '1');
    setTxt(bb, label);
    if (b.title !== title) b.title = title;
    const here = mode === 'act';
    if (b.classList.contains('k-r5c-here') !== here) b.classList.toggle('k-r5c-here', here);
  }
  function fixNext(w, k) {
    const b = $('[data-rdhero] .k-next', w);
    if (!b) return;
    const bb = $('b', b);
    if (!bb) return;
    const pi = PAGE_IDX[k];
    const S = coreSteps();
    if (pi == null || !S || !S.has || b.dataset.v92i || b.dataset.r4cfill || b.dataset.r4cstep || b.dataset.v92eDrop) { restoreNext(b, bb); return; }
    const stepName = (s) => { const def = (window.V92CORE_STEPS || []).find((x) => x.id === s.id) || {}; return M(s.t, def.en || s.t, def.zh, def.es); };
    if (S.idx >= 0 && S.idx < pi) { restoreNext(b, bb); return; } // 前の手順がまだ：r4c の層が、その手順を出す
    const me = S.steps[pi];
    if (pi >= 1 && me && !me.done) {
      const ip = inPage(w, k);
      if (ip && ip[0]) {
        setNext(b, bb, 'act', ip[1], M('この画面の手順「' + me.t + '」がまだです。押すと、この画面の中の操作へ進みます', 'This step is not finished yet. Press to jump to the action on this screen', '本页的步骤尚未完成。按下后跳到本页中的操作', 'Este paso aún no está hecho. Pulse para ir a la acción en esta pantalla'));
        return;
      }
      restoreNext(b, bb); return;
    }
    if (S.next && S.idx > pi) {
      if (pi === 0 && b.dataset.r3ago) { restoreNext(b, bb); return; } // 商品情報：r3a の層が同じ手順を出している
      const nm = stepName(S.next);
      setNext(b, bb, 'go', nm, M('次の手順：' + S.next.t + '（はじめの設定の、まだの手順）', 'Next: ' + nm + ' (the next unfinished setup step)', '下一步：' + nm + '（初始设置中尚未完成的步骤）', 'Siguiente: ' + nm + ' (paso pendiente)'), S.next.id === 'fill' ? 'up' : S.next.key);
      return;
    }
    if (S.idx < 0 && k === 'item') {
      // はじめの設定が全部済み：商品情報の「次は」は、国選びへ戻さず、案件へ
      const nm = M('商談を進める', 'Advance your deals', '推进商谈', 'Avanzar las negociaciones');
      setNext(b, bb, 'go', nm, M('次の手順：商談を進める（案件の一覧へ）', 'Next: advance your deals (deal list)', '下一步：推进商谈（案件一览）', 'Siguiente: avanzar las negociaciones'), 'dash:home');
      return;
    }
    restoreNext(b, bb);
  }
  function pulse(el) {
    if (!el) return;
    try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { try { el.scrollIntoView(); } catch (x) { /* 無視 */ } }
    el.classList.remove('k-r5c-pulse');
    void el.offsetWidth;
    el.classList.add('k-r5c-pulse');
    setTimeout(() => { try { el.classList.remove('k-r5c-pulse'); } catch (e) { /* 無視 */ } }, 3200);
    try { if (/^(BUTTON|A|INPUT)$/.test(el.tagName)) el.focus({ preventScroll: true }); } catch (e) { /* 無視 */ }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('.k-next[data-r5c]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    const k = RD.curKey ? RD.curKey() : '';
    if (b.dataset.r5c === 'go') { if (b.dataset.r5cgo) RD.goKey(b.dataset.r5cgo); return; }
    const ip = inPage(well(), k);
    if (ip && ip[0]) pulse(ip[0]);
    if (k === 'ops:reg') { try { if (A().regMark && A().regMark()) setTimeout(touch, 400); } catch (x) { /* 無視 */ } }
  }, true);

  /* ───── ② 規制を調べる：中を見たら済み ───── */
  let regT = 0;
  const regSeen = () => {
    if (locked() || fwd()) return;
    if ((RD.curKey ? RD.curKey() : '') !== 'ops:reg') return;
    try { if (A().regMark && A().regMark()) { clearTimeout(regT); regT = setTimeout(touch, 300); } } catch (e) { /* 無視 */ }
  };
  window.addEventListener('scroll', () => { try { if ((window.scrollY || document.documentElement.scrollTop || 0) > 260) regSeen(); } catch (e) { /* 無視 */ } }, { passive: true });
  document.addEventListener('click', (e) => { try { if (e.target.closest && e.target.closest('#sec-0')) regSeen(); } catch (x) { /* 無視 */ } }, false);

  /* ───── ③ 空の案件一覧：「商談を記録する」も置く ───── */
  function fixHomeRec(w, k) {
    if (k !== 'dash:home') return;
    const S = coreSteps();
    const nb = byText(w, '.k-btn', /^(次は：|Next:|下一步：|Siguiente:)/);
    const old = $('.k-r5c-rec', w);
    const on = !!(nb && S && S.has && S.steps[0].done && S.steps[1].done && !S.steps[5].done);
    if (!on) { if (old) old.remove(); return; }
    if (old) return;
    const p = document.createElement('p');
    p.className = 'k-r5c-rec';
    p.setAttribute('data-noi18n', '1');
    const sp = document.createElement('span');
    sp.textContent = M('すでに話をしている相手がいる方は：', 'Already talking to a buyer? ', '已经有在谈的对象：', '¿Ya habla con un comprador? ');
    const bt = document.createElement('button');
    bt.type = 'button'; bt.className = 'k-btn white k-mini';
    bt.textContent = M('商談を記録する', 'Record a deal', '记录商谈', 'Registrar una negociación');
    bt.title = M('「商談・バイヤー」の画面で、相手を追加して商談を記録します（案件の一覧に出ます）', 'Add the buyer and record the deal on the Deals & buyers screen', '在“商谈·买家”页面添加对象并记录商谈', 'Añada el comprador y registre la negociación');
    bt.addEventListener('click', () => RD.goKey('deal'));
    p.appendChild(sp); p.appendChild(bt);
    const host = nb.parentNode;
    if (nb.nextSibling) host.insertBefore(p, nb.nextSibling.nextSibling || null); else host.appendChild(p);
  }

  /* ───── ⑥ 商品情報を登録：開き直した直後（会話の欄が閉じている）でも、選択肢の札で答えられる（indagri-Q01） ───── */
  const chatReady = () => vis(document.getElementById('fans')) || $$('[data-chip]').some((b) => vis(b) && !b.closest('.rd-x'));
  function pickAfterOpen(tg) {
    const go = document.getElementById('rdfill') || $$('#well button').find((x) => vis(x) && /AIの質問に答える|Answer the AI|回答AI|Responder a la IA/.test(x.textContent || ''));
    if (!go) return false;
    const tx = (tg.textContent || '').trim();
    go.click();
    let n = 0;
    const iv = setInterval(() => {
      n++;
      if (chatReady()) {
        clearInterval(iv);
        // 描き直しで札が作り直されることがある：同じ文字の札を探して押す
        setTimeout(() => {
          const t2 = (tg.isConnected ? tg : null) || $$('.k92r3b-pick').find((x) => (x.textContent || '').trim() === tx);
          if (t2) { t2.dataset.r5cgo = '1'; t2.click(); delete t2.dataset.r5cgo; }
          else { const fa = document.getElementById('fans'); if (fa) { fa.value = tx; try { fa.dispatchEvent(new Event('input', { bubbles: true })); fa.focus(); } catch (e) { /* 無視 */ } } }
        }, 250);
      } else if (n > 24) clearInterval(iv);
    }, 150);
    return true;
  }
  const onPick = (e) => {
    const tg = e.target.closest && e.target.closest('.k92r3b-pick');
    if (!tg || tg.dataset.r5cgo) return;
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    if (chatReady()) return;
    if (pickAfterOpen(tg)) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }
  };
  document.addEventListener('click', onPick, true);
  document.addEventListener('keydown', onPick, true);

  /* ───── ⑤ スマホ（マウスの無い画面）：「押すか、マウスを乗せると説明が出ます」→「押すと説明が出ます」（xcut-Q04） ───── */
  const touchy = () => { try { return window.innerWidth <= 820 || window.matchMedia('(hover: none)').matches; } catch (e) { return window.innerWidth <= 820; } };
  function fixHoverWords(w) {
    if (lang() !== 'ja' || !touchy()) return;
    $$('[data-rdhero], .k-qline, .v90glh', w).forEach((root) => {
      if ((root.textContent || '').indexOf('マウスを乗せると') < 0) return;
      const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = tw.nextNode())) { if (n.nodeValue.indexOf('押すか、マウスを乗せると') >= 0) n.nodeValue = n.nodeValue.replace('押すか、マウスを乗せると', '押すと'); }
    });
  }

  /* ───── ⑦ 販売先国：確定したあとは、「3か国までのため入れていない国」から確定済みの国を外す（auto-Q03） ───── */
  function fixCtyOuts(w, k) {
    if (k !== 'cty') return;
    const box = $('.k-v92outs', w);
    if (!box) return;
    let chosen = [];
    try { const t = RD.G('TEN'); chosen = (t && t.ctySel && Array.isArray(t.ctySel.chosen)) ? t.ctySel.chosen.map((x) => String((x && (x.c || x.cty || x.name)) || x)) : []; } catch (e) { chosen = []; }
    if (!chosen.length) return;
    $$('.k-v92out', box).forEach((el) => { const b = $('[data-v92tick]', el); const c = b ? b.getAttribute('data-v92tick') : ''; if (c && chosen.indexOf(c) >= 0) el.remove(); });
    if (!$('.k-v92out', box)) box.remove();
  }

  const old = RD.after;
  RD.after = function () {
    const r = old.apply(this, arguments);
    try {
      const w = well();
      const k = RD.curKey ? RD.curKey() : '';
      if (!fwd() && !locked()) { fixNext(w, k); fixHomeRec(w, k); }
      if (!locked()) fixHoverWords(w);
      if (!locked() && !fwd()) fixCtyOuts(w, k);
    } catch (e) { console.error('[rd v92r5c]', e); }
    return r;
  };
})();
