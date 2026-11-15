/* 21.92 r6a：刷新版の層（6巡目の直し）。今の部品は差し替えず、RDX.after を包む
   ① 「いまの次の手順」を1か所（本体の層 window.v92r6a.now()）で決め、右上の「次は」・案件一覧の右上・空の案件一覧の大きいボタン・
      「はじめの設定 n/6 次：…」の札・手順の札が、どれも同じ手順・同じ行き先を指すようにそろえる
      （daily-R01・R02、food-R01、xcut-R01・R02、medical-R05、culture-R05、indagri-R01、auto-R04、other-13）
      ・AIバイヤー開拓：リストがまだ → 作る／リストあり・選んでいない → 選ぶ／選んだ → 確かめて送る・自社のバイヤーに入れる／済み → 商談を進める
      ・最後の手順「商談を進める」は、商談を記録する所（商談・バイヤー）へ1回で着く
      ・「次は」に出す名前は、言語に合わせる（商品情報の画面も）
   ② 規制を調べる：「次は」を押しただけでは済みにしない。調べる枠を見た（4秒）・枠の中を押した ときに済み（culture-N17）
   ③ 多言語の残り（xcut-R04・R05、daily-R07）と、言い回し（food-R04・health-R03・auto-N12・auto-Q03） */
(function () {
  'use strict';
  const RD = window.RDX;
  if (!RD || RD._v92r6a) return;
  RD._v92r6a = 1;
  const { $, $$ } = RD;
  const lang = () => { try { const el = document.getElementById('lang'); const v = String((el && el.value) || (window.I18N && window.I18N.lang) || document.documentElement.lang || 'ja'); return /^en/.test(v) ? 'en' : /^zh/.test(v) ? 'zh' : /^es/.test(v) ? 'es' : 'ja'; } catch (e) { return 'ja'; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === 'en' ? en : l === 'zh' ? (zh || en) : l === 'es' ? (es || en) : ja; };
  const fwd = () => { try { return !!RD.isFwd(); } catch (e) { return false; } };
  const locked = () => { try { return !!RD.locked(); } catch (e) { return document.body.classList.contains('locked'); } };
  const setTxt = (el, t) => { if (el && el.textContent !== t) el.textContent = t; };
  const vis = (el) => !!(el && (el.offsetWidth || el.offsetHeight));
  const A = () => window.v92r6a || {};
  const now = () => { try { return A().now ? A().now() : null; } catch (e) { return null; } };
  const well = () => document.getElementById('well') || document.querySelector('.stage') || document.body;
  const curKey = () => { try { return RD.curKey ? RD.curKey() : ''; } catch (e) { return ''; } };
  const esc = RD.esc || ((s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])));
  const I = RD.I || (() => '');
  const NEXT_W = () => M('次は', 'Next', '下一步', 'Siguiente');

  /* ───── ① 右上の「次は」 ───── */
  const PAGE_IDX = { up: 0, item: 0, cty: 1, 'ops:reg': 2, deck: 3, db: 4, deal: 5 };
  const byText = (w, sel, re) => $$(sel, w).find((x) => vis(x) && re.test((x.textContent || '').trim()));
  let dbOpened = false; // AIバイヤー開拓：上の札を押して、条件の欄まで来た
  let deckOpened = false; // 営業資料：「下書きを作る」を押して、言語の札まで来た
  // AIバイヤー開拓のいまの段階（リストの有無は本体の層、選んだ数は画面のチェック）
  function dbStage(w) {
    const st = (A().dbList ? A().dbList() : null) || { n: 0 };
    const ob = $('#v71ob', w);
    const rows = ob ? $$('input[type=checkbox][data-v71sel]', ob) : [];
    if (!st.n || !rows.length) return { s: st.n ? 'list' : 'make', n: st.n, ob };
    const sel = rows.filter((x) => x.checked).length;
    return { s: sel ? 'send' : 'pick', n: st.n, sel, ob };
  }
  // その画面の中の主な操作：{ el: 送り先の要素, label: 「次は」に出す言葉, also: いっしょに目立たせる要素 }
  function inPage(w, k) {
    if (k === 'cty') {
      const ok = byText(w, '.rd-p2 .k-btn.big, .rd-p2 .k-btn', /確定する|Confirm|确定|Confirmar/);
      const lb = M('この画面で国を確定する', 'Confirm the countries on this screen', '在本页确定销售国', 'Confirmar los países aquí');
      if (ok) return { el: ok, label: lb };
      const om = byText(w, '.rd-p2 .k-btn.big, .rd-p2 .k-btn, #well .btn', /おまかせ|Leave it to|交给|Dejar/);
      if (om) return { el: om, label: M('この画面で国を選ぶ（おまかせ）', 'Pick countries on this screen (auto)', '在本页选择销售国（交给AI）', 'Elegir países aquí (automático)') };
      return { el: $('#v54rCtyGo', w) || $('.rd-p2', w), label: lb };
    }
    if (k === 'ops:reg') return { el: $('#sec-0', w) || $('#rO', w), label: M('この画面で規制を確かめる', 'Review the regulations on this screen', '在本页确认法规', 'Revisar las regulaciones aquí') };
    if (k === 'deck') {
      const langs = $('.dk3-langs', w);
      if (deckOpened && vis(langs)) {
        const lb = $('button.v54rec', langs) || $('button[data-dk3lang]', langs);
        if (lb) return { el: lb, label: M('この画面で言語を選んで作る', 'Pick a language to create the deck', '在本页选择语言并制作', 'Elegir el idioma y crear aquí') };
      }
      const g = byText(w, '.rd-p2 .k-btn.big, .rd-p2 .k-btn.wide', /作る|つくる|生成|Create|Generate|Crear|Generar|制作/) || $('.rd-p2 .k-btn.big', w);
      return { el: g || $('.rd-p2', w), label: M('この画面で資料を作る', 'Create the deck on this screen', '在本页制作资料', 'Crear la presentación aquí') };
    }
    if (k === 'db') {
      const D = dbStage(w);
      if (D.s === 'make') {
        const mk = $('#rddbob', w), go = $('#v71obGo', w);
        // 上の札「条件を決めてリストを作る」を押したあとは、条件の欄の「AI商社マンにリストを作らせる」へ（上の札へ戻さない）
        return { el: (dbOpened && vis(go)) ? go : vis(mk) ? mk : (go || D.ob || $('.rd-p2', w)), label: M('この画面でリストを作る', 'Build the buyer list on this screen', '在本页制作买家名单', 'Crear la lista aquí') };
      }
      if (D.s === 'pick' || D.s === 'list') {
        const all = D.ob && $('[data-v71act=all]', D.ob);
        return { el: (vis(all) && all) || D.ob || $('.rd-p2', w), label: M('この画面で相手を選ぶ', 'Pick buyers on this screen', '在本页选择对象', 'Elegir compradores aquí'), title: M('リストはできています（' + D.n + '社）。行の左のチェックか「すべて選ぶ」で相手を選ぶと、「確かめて送る」「自社のバイヤーに入れる」が押せます', 'Your list is ready (' + D.n + '). Tick the rows or press “Select all”; then you can send or add them to your buyers', '名单已生成（' + D.n + '家）。勾选各行或按“全选”后，即可发送或加入自有买家', 'La lista está lista (' + D.n + '). Marque las filas o pulse «Seleccionar todo»; luego podrá enviar o añadirlos') };
      }
      const sd = $('[data-v71act=send]', D.ob), my = $('[data-v71act=my]', D.ob);
      return { el: (vis(sd) && sd) || D.ob, also: vis(my) ? my : null, label: M('この画面で確かめて送る／自社のバイヤーに入れる', 'Review & send, or add to your buyers', '在本页确认后发送／加入自有买家', 'Revisar y enviar, o añadir a sus compradores'), title: M('選んだ ' + D.sel + '社に、文面を1件ずつ確かめて送る（承認するまで送りません）か、「＋ 自社のバイヤーに入れる」で、この手順が済みます', 'Review and send to the ' + D.sel + ' selected (nothing is sent until you approve), or add them to your buyers — either finishes this step', '对所选 ' + D.sel + ' 家逐一确认后发送（批准前不会发送），或“加入自有买家”，即可完成此步骤', 'Revise y envíe a los ' + D.sel + ' seleccionados (nada se envía sin su aprobación) o añádalos a sus compradores') };
    }
    if (k === 'deal') {
      const r = $$('.rd-p2 .k-btn.big, #well [data-onclick="openDealForm()"]', w).find(vis) || byText(w, '.rd-p2 .k-btn.big, #well .btn', /商談を記録する|Record a deal|记录商谈|Registrar/);
      return { el: r || $('.rd-p2', w), label: M('この画面で商談を記録する', 'Record a meeting on this screen', '在本页记录商谈', 'Registrar una negociación aquí') };
    }
    return null;
  }
  function decide(w, k, b) {
    const N = now(), pi = PAGE_IDX[k];
    if (!N || pi == null || N.idx < 0) return null;                              // 全部済み：前の層のまま
    if (b.dataset.v92i || b.dataset.r4cfill || b.dataset.v92eDrop) return null;   // 商品の登録の途中（足りない情報・資料がまだ）の案内はそのまま
    if (N.idx === 0 && pi === 0) return null;
    if (N.idx === pi) {
      const ip = inPage(w, k);
      if (!ip || !ip.el) return null;
      return { mode: 'act', label: ip.label, title: ip.title || M('この画面の手順「' + N.next.t + '」がまだです。押すと、この画面の中の操作へ進みます', 'This step is not finished yet. Press to jump to the action on this screen', '本页的步骤尚未完成。按下后跳到本页中的操作', 'Este paso aún no está hecho. Pulse para ir a la acción en esta pantalla') };
    }
    return { mode: 'go', label: N.label, key: N.key, title: M('次の手順：' + N.next.t + '（はじめの設定の、まだの手順）', 'Next: ' + N.label + ' (the next unfinished setup step)', '下一步：' + N.label + '（初始设置中尚未完成的步骤）', 'Siguiente: ' + N.label + ' (paso pendiente)') };
  }
  function fixNext(w, k) {
    const b = $('[data-rdhero] .k-next', w);
    if (!b) return;
    const bb = $('b', b);
    if (!bb) return;
    const d = decide(w, k, b);
    if (!d) { if (b.dataset.r6a) { delete b.dataset.r6a; delete b.dataset.r6ago; } return; }
    if (b.dataset.r6a !== d.mode) b.dataset.r6a = d.mode;
    if ((b.dataset.r6ago || '') !== (d.key || '')) b.dataset.r6ago = d.key || '';
    if (b.hasAttribute('data-kbc')) b.removeAttribute('data-kbc');
    if (bb.getAttribute('data-noi18n') == null) bb.setAttribute('data-noi18n', '1');
    setTxt(bb, d.label);
    if (b.title !== d.title) b.title = d.title;
    const sm = $('small', b);
    if (sm) { if (sm.getAttribute('data-noi18n') == null) sm.setAttribute('data-noi18n', '1'); setTxt(sm, NEXT_W()); }
    const here = d.mode === 'act';
    if (b.classList.contains('k-r5c-here') !== here) b.classList.toggle('k-r5c-here', here);
  }
  function pulse(el, noFocus) {
    if (!el) return;
    try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { try { el.scrollIntoView(); } catch (x) { /* 無視 */ } }
    flash(el);
    try { if (!noFocus && /^(BUTTON|A|INPUT)$/.test(el.tagName)) el.focus({ preventScroll: true }); } catch (e) { /* 無視 */ }
  }
  function flash(el) {
    if (!el) return;
    el.classList.remove('k-r5c-pulse');
    void el.offsetWidth;
    el.classList.add('k-r5c-pulse');
    setTimeout(() => { try { el.classList.remove('k-r5c-pulse'); } catch (e) { /* 無視 */ } }, 3200);
  }
  function doAct(k) {
    const ip = inPage(well(), k);
    if (!ip || !ip.el) return;
    pulse(ip.el);
    if (ip.also) flash(ip.also);
  }
  // 「商談を進める」で商談・バイヤーに着いたら、「商談を記録する」を目立たせる（1回で着く）
  let arriveT = 0;
  function goStep(key) {
    if (!key) return;
    RD.goKey(key);
    if (key === 'deal') { clearTimeout(arriveT); arriveT = setTimeout(() => { try { const N = now(); if (curKey() === 'deal' && N && N.idx === 5) doAct('deal'); } catch (e) { /* 無視 */ } }, 900); }
  }
  // 前の層（r3a・r4c・r5c）より先に受ける（window で受ける）
  window.addEventListener('click', (e) => {
    const t = e.target;
    if (!t || !t.closest) return;
    const b = t.closest('.k-next[data-r6a]');
    if (b) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      if (b.dataset.r6a === 'go') { goStep(b.dataset.r6ago); return; }
      doAct(curKey());
      return;
    }
    // 案件一覧の「次は」・大きいボタン・札・手順の札：最後の手順は、商談を記録する所へ
    const h = t.closest('[data-r6astep]');
    if (h) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); goStep(h.dataset.r6astep); return; }
    const k = curKey();
    if (k === 'dash:home') {
      const N = now();
      if (N && N.idx === 5) {
        const pill = t.closest('.k-pills .k-pill[data-kbc]');
        const stp = t.closest('.k-clempty .k-clstep.on, .k-clempty .k-clstep:last-of-type');
        if ((pill && /はじめの設定|Getting started|Setup|入门设置|初始设置|Configuración inicial/i.test(pill.textContent || '')) || (stp && !stp.classList.contains('done') && /商談を進める|Advance your deals|推进商谈|Avanzar/.test(stp.textContent || ''))) {
          e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); goStep('deal'); return;
        }
      }
    }
    if (k === 'db' && t.closest('#rddbob')) dbOpened = true;
    if (k === 'deck' && t.closest('[data-kact]') && /下書き|作る|Create|draft|Crear|制作|草稿/i.test((t.closest('[data-kact]').textContent || ''))) deckOpened = true;
  }, true);

  /* ───── ①' AIバイヤー開拓：リストができたら、上の札・押せない理由も合わせる ───── */
  function fixDb(w, k) {
    if (k !== 'db') return;
    const D = dbStage(w);
    const box = $('[data-rddb]', w);
    if (box && D.n) {
      const mk = $('#rddbob', box);
      const card = mk && mk.closest('.rd-card');
      const p = card && $$('p', card).find((x) => !x.classList.contains('rd-note'));
      if (p) {
        const t = M('最新のリスト：' + D.n + '件（この下に出ています）', 'Latest list: ' + D.n + ' (shown below)', '最新名单：' + D.n + ' 家（显示在下方）', 'Última lista: ' + D.n + ' (abajo)');
        if (p.textContent !== t) { p.setAttribute('data-noi18n', '1'); p.textContent = t; p.style.color = ''; }
      }
      if (mk) {
        const tn = Array.from(mk.childNodes).find((n) => n.nodeType === 3 && n.nodeValue.trim());
        const t = M('リストを見る・条件を変えて作り直す ', 'See the list / rebuild with other conditions ', '查看名单／更改条件重新制作 ', 'Ver la lista / rehacerla ');
        if (tn && tn.nodeValue !== t) { mk.setAttribute('data-noi18n', '1'); tn.nodeValue = t; }
      }
      const em = $$('.rd-empty', box).find((x) => /まだ相手はいません|No buyers yet|还没有对象|Aún no hay/.test(x.textContent || ''));
      if (em) { em.setAttribute('data-noi18n', '1'); setTxt(em, M('まだ連絡した相手はいません。下のリストで相手を選んで送ると、ここに出ます', 'No one contacted yet. Pick buyers in the list below and send — they will appear here', '尚未联系任何对象。在下方名单中选择并发送后，会显示在这里', 'Aún no ha contactado a nadie. Elija en la lista de abajo y envíe')); }
    }
    // 押せない間は、理由を一言
    const ob = D.ob;
    const sd = ob && $('[data-v71act=send]', ob);
    let why = ob && $('.k-r6a-why', ob);
    if (sd && sd.disabled && vis(sd)) {
      const t = M('↑ 3つのボタンは、相手を選ぶと押せます（行の左のチェック、または「すべて選ぶ」）', '↑ These buttons work once you select buyers (tick the rows, or “Select all”)', '↑ 选择对象后即可按下（勾选各行，或“全选”）', '↑ Estos botones se activan al elegir compradores (marque las filas o «Seleccionar todo»)');
      if (!why) { why = document.createElement('p'); why.className = 'k-r6a-why'; why.setAttribute('data-noi18n', '1'); (sd.parentElement || ob).insertAdjacentElement('afterend', why); }
      setTxt(why, t);
      [sd, $('[data-v71act=my]', ob), $('[data-v71act=ap]', ob)].forEach((x) => { if (x && x.disabled && !x.title) x.title = M('相手を選ぶと押せます', 'Select buyers first', '请先选择对象', 'Elija compradores primero'); });
    } else if (why) why.remove();
  }

  /* ───── ①'' 案件一覧（ホーム）：右上・大きいボタン・札は、同じ「いまの次の手順」 ───── */
  function fixHome(w, k) {
    const H = document.documentElement;
    if (k !== 'dash:home') { if (H.classList.contains('k-r6a-goal')) H.classList.remove('k-r6a-goal'); return; }
    const N = now();
    const hero = $('[data-rdhero]', w), cta = hero && $('.k-hcta', hero);
    if (N && N.next) {
      const coreKey = N.next.id === 'fill' ? 'up' : N.next.key;
      // 右上：はじめの設定が終わるまでは「次は ◯◯」
      if (cta) {
        const sig = N.key + '|' + N.label + '|' + lang();
        if (cta.dataset.r6asig !== sig) {
          cta.dataset.r6asig = sig; cta.dataset.k92c = coreKey; cta.dataset.kbc = N.key; cta.dataset.r6astep = N.key;
          cta.className = 'k-hcta k92c-hnext';
          cta.title = M('次の手順：' + N.next.t, 'Next: ' + N.label, '下一步：' + N.label, 'Siguiente: ' + N.label);
          cta.innerHTML = '<small data-noi18n="1">' + esc(NEXT_W()) + '</small><b data-noi18n="1">' + esc(N.label) + '</b>' + I('arr', 16, 2.4);
        }
      }
      // 空の案件一覧の大きいボタン：5/6・6/6 の手前でも「次は：◯◯」（済んだ手順の「バイヤーを探す」に戻さない）
      const empty = $('.k-clempty', w);
      if (empty) {
        const btn = $$('.k-btn', empty).find((b) => b.dataset.kbc || b.dataset.r6astep);
        if (btn && N.idx >= 4) {
          const sig = N.key + '|' + N.label;
          if (btn.dataset.r6asig !== sig) {
            btn.dataset.r6asig = sig; btn.dataset.kbc = N.key; btn.dataset.r6astep = N.key;
            btn.setAttribute('data-noi18n', '1');
            btn.innerHTML = I('arr', 18, 2.4) + esc(M('次は：', 'Next: ', '下一步：', 'Siguiente: ') + N.label);
            btn.title = N.next.why || '';
          }
          let wy = $('.k92c-why', empty);
          if (N.next.why) { if (!wy) { btn.insertAdjacentHTML('afterend', '<small class="k92c-why"></small>'); wy = $('.k92c-why', empty); } setTxt(wy, N.next.why); }
          else if (wy) wy.remove();
        }
        // 大きいボタンが「商談を進める」のときは、同じ行き先の小さい入口は要らない
        const rec = $('.k-r5c-rec', empty) || $('.k-r5c-rec', w);
        if (rec) rec.style.display = N.idx === 5 ? 'none' : '';
      }
    } else if (cta && cta.dataset.r6asig) {
      // 6/6 になった：元の「＋ バイヤーを探す」に戻す
      delete cta.dataset.r6asig; delete cta.dataset.r6astep; delete cta.dataset.k92c;
      cta.dataset.kbc = 'db'; cta.className = 'k-btn k-hcta'; cta.title = '';
      cta.innerHTML = I('plus', 18, 2.4) + 'バイヤーを探す';
    }
    // 6/6 のあと・目標を入れる前：「次」に見えるのは提案の「目標を入れる」の1つ（右上は白いボタンに）
    const prop = $$('.v88prop .btn, [class*=v88prop] .btn', w).find((b) => vis(b) && b.getAttribute('data-act') === 'rm.form');
    const goal = !!(N && !N.next && prop);
    if (H.classList.contains('k-r6a-goal') !== goal) H.classList.toggle('k-r6a-goal', goal);
  }

  /* ───── ② 規制を調べる：調べる枠を見た（4秒）・枠の中を押した ときに済み ───── */
  let regN = 0;
  const regOn = () => !locked() && !fwd() && curKey() === 'ops:reg';
  function regDone() {
    try {
      if (A().regLook && A().regLook()) {
        setTimeout(apply, 60);
        try { RD.after(); } catch (e) { /* 無視 */ }
        try { const tt = RD.G && RD.G('toast'); if (typeof tt === 'function') tt(M('規制を確かめました（はじめの設定の「規制を調べる」が済みになりました）', 'Regulations reviewed (setup step done)', '已确认法规（初始设置的该步骤已完成）', 'Regulaciones revisadas (paso completado)')); } catch (e) { /* 無視 */ }
      }
    } catch (e) { /* 無視 */ }
  }
  setInterval(() => {
    try {
      if (!regOn() || document.hidden) { regN = 0; return; }
      const s = document.getElementById('sec-0');
      if (!s) { regN = 0; return; }
      const r = s.getBoundingClientRect(), vh = window.innerHeight || 800;
      const inView = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (inView >= Math.min(220, r.height * 0.6) && r.top < vh * 0.6) { regN++; if (regN >= 4) { regN = 0; regDone(); } } else regN = 0;
    } catch (e) { /* 無視 */ }
  }, 1000);
  window.addEventListener('click', (e) => { try { if (regOn() && e.target.closest && e.target.closest('#sec-0') && !e.target.closest('.k-q')) regDone(); } catch (x) { /* 無視 */ } }, true);

  /* ───── ③ 多言語の残り ───── */
  // 言語の印（CSS 用）
  function langClass() {
    const H = document.documentElement, l = lang();
    ['en', 'zh', 'es'].forEach((x) => { const on = l === x; if (H.classList.contains('k-r6a-' + x) !== on) H.classList.toggle('k-r6a-' + x, on); });
  }
  // ログイン画面：言葉の切れ目（span.k-nw）の間に空白が無く、英語・スペイン語で「isa／yourtrade」とつながる（culture-R06）
  function fixLoginGaps() {
    const l = lang();
    if (l !== 'en' && l !== 'es') return;
    $$('.k-lgcatch .k-nw').forEach((s) => {
      const nx = s.nextSibling;
      if (nx && nx.nodeType === 1 && nx.classList && nx.classList.contains('k-nw')) s.after(document.createTextNode(' '));
    });
  }
  // 物流会社：前の層が「日本語／英語」の2つだけで出している文（中国語・スペイン語で英語のまま。xcut-R05 (2)）
  const FW = {
    'Quote status:': ['报价状态：', 'Estado de la cotización:'],
    'Assignment:': ['负责・处理：', 'Asignación:'],
    'Requests with no matching rate:': ['因没有费率而未能报价的委托：', 'Solicitudes sin tarifa aplicable:'],
    'open / close': ['展开／收起', 'abrir / cerrar'],
    'What happens when you press Done': ['按“完成”后会怎样', 'Qué ocurre al pulsar «Hecho»'],
    'Register a rate to quote': ['登记费率并回复', 'Registrar tarifa y cotizar'],
    'Edit quoted rate': ['修改已回复的金额', 'Editar importe cotizado'],
    'Number details (requests received, AI auto-answers, lanes, holds)': ['数字明细（收到的委托・AI自动回复・已登记航线・暂留）', 'Detalle de cifras (solicitudes recibidas, respuestas automáticas de IA, rutas, reservas)'],
  };
  function fixFwdWords(w) {
    const l = lang();
    if (l !== 'zh' && l !== 'es') return;
    const ix = l === 'zh' ? 0 : 1;
    const tw = document.createTreeWalker(w, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      const v = n.nodeValue, t = v.trim();
      if (t.length < 8 || !/^[A-Za-z0-9]/.test(t)) continue;
      const hit = FW[t];
      if (hit) { n.nodeValue = v.replace(t, hit[ix]); continue; }
      const m = /^(\d+) days past the (\S+) target$/.exec(t);
      if (m) n.nodeValue = l === 'zh' ? '已超过处理目标日 ' + m[2] + ' ' + m[1] + ' 天' : m[1] + ' días después del objetivo del ' + m[2];
    }
  }

  /* ───── ④ 言い回し ───── */
  const cases = () => { try { return RD.allCases ? (RD.allCases() || []) : []; } catch (e) { return []; } };
  const WON = (c) => !!(c && /^(取引中|受注)$/.test(String(c.ss || '')));
  const T_FIRST = '最初の連絡を送る';
  const firstTxt = (el) => Array.from(el.childNodes).find((x) => x.nodeType === 3 && x.nodeValue.trim());
  const WAIT_RE = /・記録した次の行動・相手の返事待ち$/;
  const WAIT_TO = '・記録した次の行動（先に送った連絡は、相手の返事待ち）';
  const WON_T = () => M('受注の書類をつくる（見積書・請求書）', 'Create the order documents (quote / invoice)', '制作订单文件（报价单・发票）', 'Crear los documentos del pedido (cotización / factura)');
  const WON_S = () => M('受注を記録した案件です。「書類をつくる」で作れます（相手にはまだ送っていません）', 'An order is recorded for this case. Create them in “Create documents” (nothing has been sent yet)', '此案件已记录订单。可在“制作文件”中制作（尚未发送给对方）', 'Este caso tiene un pedido registrado. Créelos en «Crear documentos» (aún no se ha enviado nada)');
  // 案件一覧：受注を記録した相手の次の行動（food-R04）／自分の行動の行の「・相手の返事待ち」（health-R03）
  function paintRows(body) {
    const ord = RD._caseOrder || [];
    const L = cases();
    $$('tr.k-clrow', body).forEach((tr, i) => {
      const nx = $('.c-nx > span', tr);
      if (!nx) return;
      const sm = $('small', nx);
      if (sm && WAIT_RE.test(sm.textContent || '')) sm.textContent = sm.textContent.replace(WAIT_RE, WAIT_TO);
      const t = firstTxt(nx);
      if (t && t.nodeValue.trim() === T_FIRST) {
        const c = L.find((x) => x.key === ord[i]);
        if (WON(c)) { nx.setAttribute('data-noi18n', '1'); t.nodeValue = WON_T(); nx.title = WON_T(); if (sm) sm.textContent = WON_S(); }
      }
    });
  }
  function fixRows(w, k) {
    if (k !== 'dash:home') return;
    const body = $('#k-clbody', w);
    if (!body) return;
    paintRows(body);
    if (!body.dataset.r6ao) { body.dataset.r6ao = '1'; new MutationObserver(() => { try { paintRows(body); } catch (e) { /* 無視 */ } }).observe(body, { childList: true }); }
  }
  // 案件の詳細：同じ直し＋「見積の出し方」などは AI商社マンの画面へ移ることを先に書く（auto-N12）
  function fixCase(w, k) {
    if (k !== 'dash:case') return;
    const box = $('.k-cd', w);
    if (!box) return;
    const p = $('.k-cdnx', box);
    if (p) {
      const sm = $('small', p);
      if (sm && WAIT_RE.test(sm.textContent || '')) sm.textContent = sm.textContent.replace(WAIT_RE, WAIT_TO);
      const t = firstTxt(p);
      if (t && t.nodeValue.trim() === T_FIRST && WON(RD._case0)) { p.setAttribute('data-noi18n', '1'); t.nodeValue = WON_T(); if (sm) sm.textContent = WON_S(); }
    }
    const chips = $$('button.k-chip', box).filter((b) => !b.dataset.r6a);
    if (chips.length && !$('.k-r6a-ainote', box)) {
      const host = chips[0].parentElement;
      if (host) {
        const s = document.createElement('small');
        s.className = 'k-r6a-ainote'; s.setAttribute('data-noi18n', '1');
        s.textContent = M('↓ 押すと「AI商社マンに相談」の画面に移って答えます（案件へは、左の「案件」で戻れます）', '↓ Pressing one opens the “Ask the AI Trade Agent” screen with the answer (return via “Cases” on the left)', '↓ 按下后会转到“咨询AI商社人”页面作答（可从左侧“案件”返回）', '↓ Al pulsar se abre la pantalla «Consultar al agente de IA» con la respuesta (vuelva por «Casos» a la izquierda)');
        host.insertAdjacentElement('beforebegin', s);
      }
      chips.forEach((b) => { b.dataset.r6a = '1'; if (!b.title) b.title = M('押すと「AI商社マンに相談」の画面に移って答えます', 'Opens the AI Trade Agent screen with the answer', '将转到“咨询AI商社人”页面作答', 'Abre la pantalla del agente de IA con la respuesta'); });
    }
  }
  // 中古車・建設機械（1台から売る商材）：例の言葉が「個・サンプル・成分」のまま残る所（auto-07・08。日本語の画面）
  const isAuto = () => { try { const c = String(((RD.G && RD.G('TEN')) || {}).cat || ''); return c === '中古車' || c === '建設機械'; } catch (e) { return false; } };
  const AUTO_T = [['成分・仕様', '仕様・状態'], ['500個でいくら？', '1台でいくら？'], ['数量帯ごとの単価', '台数ごとの単価']];
  const AUTO_P = [['例：来月バイヤーが来日予定。サンプル3種を先送りしたい', '例：来月バイヤーが来日予定。先に仕様書と写真を送りたい'], ['例：38.00', '例：46000']];
  function fixAutoWords() {
    if (lang() !== 'ja' || !isAuto()) return;
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      const v = n.nodeValue;
      if (v.length < 5 || v.length > 400) continue;
      for (const p of AUTO_T) { if (v.indexOf(p[0]) >= 0) { const pe = n.parentElement; if (pe && !/^(SCRIPT|STYLE|TEXTAREA)$/.test(pe.tagName)) n.nodeValue = v.split(p[0]).join(p[1]); } }
    }
    $$('input[placeholder], textarea[placeholder]').forEach((el) => { for (const p of AUTO_P) { if (el.placeholder === p[0]) el.placeholder = p[1]; } });
  }
  function more(w, k) {
    langClass();
    if (fwd()) { fixFwdWords(w); return; }
    fixRows(w, k); fixCase(w, k); fixAutoWords();
  }
  /*__MORE__*/

  let lastK = '';
  function apply() {
    try {
      if (locked()) { langClass(); fixLoginGaps(); return; }
      const w = well(), k = curKey();
      if (k !== lastK) { lastK = k; if (k !== 'deck') deckOpened = false; if (k !== 'db') dbOpened = false; }
      if (!fwd()) { fixNext(w, k); fixDb(w, k); fixHome(w, k); }
      more(w, k);
    } catch (e) { console.error('[rd v92r6a]', e); }
  }
  const old = RD.after;
  RD.after = function () {
    const r = old.apply(this, arguments);
    apply();
    return r;
  };
  // 画面の中だけが描き直されたとき（リストを作った・相手を選んだ・商談を記録した）も、すぐ合わせる
  let t1 = 0, t2 = 0;
  const soon = () => { clearTimeout(t1); clearTimeout(t2); t1 = setTimeout(apply, 250); t2 = setTimeout(apply, 1600); };
  document.addEventListener('click', soon, false);
  document.addEventListener('change', soon, false);
  const lg = document.getElementById('lang');
  if (lg) lg.addEventListener('change', () => setTimeout(apply, 700));
})();
