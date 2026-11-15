/* 21.92 r4c：刷新版の層（4巡目の直し）。今の部品は差し替えず、RDX.after を包む
   ① 商品情報を登録：資料を入れたあと、足りない項目が残っている間の「次は」を「足りない情報に答える（残り N項目）」に（xcut-M06）
   ② 商品が0件のあいだ：左メニューの、まだ開けない項目を薄くして理由を添える（xlogin-07）
   ③ ヘルプの窓：「5つの手順」→「6つの手順」、くわしい版のガイドに「絵と道順は刷新前の配置」と一言（culture-13・health-12・indagri-N13・xlogin-12）
   ④ 物流会社の見積受信箱：上の説明をたたみ、状況の札と行の高さを詰めて、依頼の表を1画面目に（other F2）
   出どころは本体の層 window.v92r4c（商品の有無・足りない項目の数） */
(function () {
  'use strict';
  const RD = window.RDX;
  if (!RD || RD._v92r4c) return;
  RD._v92r4c = 1;
  const { $, $$ } = RD;
  const lang = () => { try { return String((window.I18N && window.I18N.lang) || document.documentElement.lang || 'ja').slice(0, 2); } catch (e) { return 'ja'; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === 'en' ? en : l === 'zh' ? (zh || en) : l === 'es' ? (es || en) : ja; };
  const fwd = () => { try { return !!RD.isFwd(); } catch (e) { return false; } };
  const locked = () => { try { return !!RD.locked(); } catch (e) { return document.body.classList.contains('locked'); } };
  const state = () => { try { return window.v92r4c.state(); } catch (e) { return { n: 0, has: false, miss: 0, names: [] }; } };
  const setTxt = (el, t) => { if (el && el.textContent !== t) el.textContent = t; };

  /* ①' 「次は」：はじめの設定で、この画面より前の手順がまだのときは、その手順を出す（手順の帯・ホームと同じ。culture-N17・other-N16） */
  const PAGE_IDX = { up: 0, item: 0, cty: 1, 'ops:reg': 2, deck: 3, db: 4, deal: 5 };
  const coreSteps = () => { try { return window.v92coreSteps ? window.v92coreSteps() : null; } catch (e) { return null; } };
  function fixStepNext(w, k) {
    const b = $('[data-rdhero] .k-next', w);
    if (!b) return;
    const bb = $('b', b);
    if (!bb || b.dataset.r4cfill || b.dataset.v92i) return;
    const pi = PAGE_IDX[k];
    const S = coreSteps();
    const want = (pi != null && S && S.has && S.next && S.idx >= 0 && S.idx < pi) ? S.next : null;
    if (want) {
      const def = (window.V92CORE_STEPS || []).find((x) => x.id === want.id) || {};
      const label = M(want.t, def.en || want.t, def.zh, def.es);
      if (b.dataset.r4cstep !== want.id || bb.textContent !== label) {
        if (!b.dataset.r4cstep) { b.dataset.r4ckbc = b.getAttribute('data-kbc') || ''; b.dataset.r4cold = bb.textContent; }
        b.removeAttribute('data-kbc'); delete b.dataset.r3ago;
        b.dataset.r4cstep = want.id;
        bb.setAttribute('data-noi18n', '1');
        setTxt(bb, label);
        b.title = M('次の手順：' + want.t + '（はじめの設定の、いまの手順）', 'Next: ' + label + ' (the current setup step)', '下一步：' + label + '（初始设置的当前步骤）', 'Siguiente: ' + label + ' (paso actual)');
      }
    } else if (b.dataset.r4cstep) {
      delete b.dataset.r4cstep;
      bb.removeAttribute('data-noi18n');
      if (b.dataset.r4ckbc) b.setAttribute('data-kbc', b.dataset.r4ckbc);
      if (b.dataset.r4cold) { setTxt(bb, b.dataset.r4cold); b.title = '次の手順：' + b.dataset.r4cold; }
    }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('.k-next[data-r4cstep]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    const S = coreSteps();
    const s = S && S.next;
    if (s) RD.goKey(s.id === 'fill' ? 'up' : s.key);
  }, true);

  /* ① 「次は」：足りない情報に答える */
  function fixUpNext(w, k) {
    if (k !== 'up' && k !== 'item') return;
    const b = $('[data-rdhero] .k-next', w);
    if (!b) return;
    const bb = $('b', b);
    if (!bb || b.dataset.v92i) return;
    const st = state();
    if (st.has && st.miss > 0 && !st.pend) {
      const t = M(`足りない情報に答える（残り ${st.miss}項目）`, `Answer the missing items (${st.miss} left)`, `回答缺少的信息（还剩 ${st.miss} 项）`, `Responder lo que falta (${st.miss})`);
      if (b.dataset.r4cfill !== '1' || bb.textContent !== t) {
        if (!b.dataset.r4cfill) { b.dataset.r4cfkbc = k === 'up' ? (b.dataset.v92eKbc || b.getAttribute('data-kbc') || 'item') : (b.getAttribute('data-kbc') || ''); b.dataset.r4cfold = k === 'up' ? (b.dataset.v92eOld || bb.textContent) : bb.textContent; }
        b.removeAttribute('data-kbc'); delete b.dataset.v92eDrop; delete b.dataset.r3ago;
        b.dataset.r4cfill = '1';
        bb.setAttribute('data-noi18n', '1');
        setTxt(bb, t);
        b.title = M('次の手順：AI の質問に答えて、足りない項目（' + st.names.join('・') + '）を入れる', 'Next: answer the AI questions to fill the missing items', '下一步：回答 AI 的提问，补全缺少的项目', 'Siguiente: responda a las preguntas de la IA');
      }
    } else if (b.dataset.r4cfill) {
      delete b.dataset.r4cfill;
      bb.removeAttribute('data-noi18n');
      if (b.dataset.r4cfkbc) b.setAttribute('data-kbc', b.dataset.r4cfkbc);
      setTxt(bb, b.dataset.r4cfold || '商品情報を確かめる');
      b.title = '次の手順：' + bb.textContent;
    }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('.k-next[data-r4cfill]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    const open = () => {
      const go = document.getElementById('rdfill') || $$('#well button').find((x) => /AIの質問に答える|Answer the AI/.test(x.textContent || ''));
      if (go) { try { go.scrollIntoView({ block: 'center' }); } catch (x) { /* 無視 */ } go.click(); }
      else { const box = $('#well .v54hear, #well #chat, #well .chat'); if (box) box.scrollIntoView({ block: 'center' }); }
    };
    if ((RD.curKey ? RD.curKey() : '') !== 'up') { RD.goKey('up'); setTimeout(open, 900); } else open();
  }, true);

  /* ①'' ホーム（案件）：はじめの設定が終わるまでは、「次」として目立たせるのを「はじめの設定 n/6 次：…」の1つにする
        （右上の「バイヤーを探す」と提案の「目標を入れる」は白いボタンに。押せるのは今のまま）（other-13） */
  function fixHomeOne(w, k) {
    const S = k === 'dash:home' ? coreSteps() : null;
    const on = !!(S && S.has && S.next);
    const H = document.documentElement;
    if (H.classList.contains('k-r4c-one') !== on) H.classList.toggle('k-r4c-one', on);
  }

  /* ② 商品が0件のあいだの左メニュー */
  const OPEN0 = { item: 1, up: 1 };
  function fixZeroNav() {
    const side = document.getElementById('rdside');
    if (!side) return;
    const zero = !locked() && !fwd() && state().n === 0;
    const tip = M('商品を1つ登録する（または「サンプルで試す」）と使えます', 'Available after you register a product (or try a sample)', '登记1个商品（或“试用样本”）后即可使用', 'Disponible tras registrar un producto (o probar una muestra)');
    if (zero === (side.dataset.r4czero === '1') && (!zero || side.dataset.r4cl === lang())) return;
    side.dataset.r4czero = zero ? '1' : '';
    side.dataset.r4cl = lang();
    $$('.rd-ni[data-rdk]', side).forEach((x) => {
      const key = String(x.getAttribute('data-rdk') || '').split(':')[0];
      const off = zero && !OPEN0[key];
      x.classList.toggle('k-r4c-off', off);
      if (off) { if (!x.dataset.r4ct) x.dataset.r4ct = x.title || ' '; x.title = tip; }
      else if (x.dataset.r4ct) { x.title = x.dataset.r4ct.trim(); delete x.dataset.r4ct; }
    });
  }

  /* ③ ヘルプの窓・ログイン画面の案内 */
  function fixHelp() {
    const dw = document.getElementById('dw');
    if (dw && !fwd()) {
      $$('[data-rdquick] small', dw).forEach((x) => { if (/5つの手順/.test(x.textContent || '')) x.textContent = x.textContent.replace('5つの手順', '6つの手順'); });
      $$('a[href^="guide"]', dw).forEach((a) => {
        const s = $('small', a);
        if (!s || s.dataset.r4c) return;
        s.dataset.r4c = '1';
        s.setAttribute('data-noi18n', '1');
        s.textContent = M('目次から、知りたいところだけ読めます（別のタブ）。絵と道順は刷新前の配置です。いまの場所は、左メニューの名前か、各画面の「使い方を見る」の上に出る「刷新版での場所」で確かめられます。',
          'Read only what you need from the contents (new tab). Its pictures and paths show the previous layout; find the current place by the left-menu names or “Where it is now” above each “How to use”.',
          '可从目录中只阅读需要的部分（新标签页）。图片和路径为改版前的布局；现在的位置请以左侧菜单名称或各画面“查看用法”上方的“改版后的位置”为准。',
          'Lea solo lo que necesite desde el índice (pestaña nueva). Las imágenes y rutas muestran el diseño anterior; la ubicación actual está en el menú izquierdo.');
      });
      try { if (window.v92r4c && window.v92r4c.helpWords) window.v92r4c.helpWords(); } catch (e) { /* 無視 */ }
    }
    if (locked()) {
      $$('a[href^="guide"]').forEach((a) => {
        if (a.dataset.r4c || a.closest('#dw')) return;
        if (!/くわしい版/.test(a.textContent || '')) return;
        a.dataset.r4c = '1';
        const n = document.createElement('small');
        n.className = 'k-r4c-gnote'; n.setAttribute('data-noi18n', '1');
        n.textContent = M('※ くわしい版の絵と道順は、刷新前の配置です', '* The detailed guide shows the previous layout', '※ 详细版的图片和路径为改版前的布局', '* La guía detallada muestra el diseño anterior');
        a.insertAdjacentElement('afterend', n);
      });
    }
  }

  /* ④ 物流会社の見積受信箱 */
  function fixFinbox(w, k) {
    const on = fwd() && k === 'finbox';
    const H = document.documentElement;
    if (H.classList.contains('k-r4c-finbox') !== on) H.classList.toggle('k-r4c-finbox', on);
    if (!on) return;
    const bar = $$(':scope > .k-v90smpbar', w)[0];
    let d = $('.k-r4c-fold', w);
    if (d) { if (bar) d.appendChild(bar); return; }
    const card = $$(':scope > .rd-x', w).find((x) => !x.classList.contains('rd-hero') && $('.rd-card', x) && !$('table', x));
    if (!bar && !card) return;
    d = document.createElement('details');
    d.className = 'k-r4c-fold';
    const sum = document.createElement('summary');
    sum.setAttribute('data-noi18n', '1');
    sum.textContent = bar && !bar.hidden
      ? M('この画面には、見本（架空）の物流会社のレート・回答が入っています／AI の自動回答について — 押すと説明を開きます', 'This screen includes rates and replies from sample (fictitious) forwarders / about AI auto-reply — press to open', '本画面包含样本（虚构）物流公司的运价和回复／关于 AI 自动回复 — 点击展开说明', 'Esta pantalla incluye tarifas de transitarios de muestra (ficticios) / sobre la respuesta automática — pulse para abrir')
      : M('この画面の説明（AI の自動回答について）— 押すと開きます', 'About this screen (AI auto-reply) — press to open', '本画面的说明（关于 AI 自动回复）— 点击展开', 'Acerca de esta pantalla (respuesta automática de la IA) — pulse para abrir');
    d.appendChild(sum);
    const first = bar || card;
    first.parentNode.insertBefore(d, first);
    if (bar) d.appendChild(bar);
    if (card) d.appendChild(card);
  }

  const old = RD.after;
  RD.after = function () {
    const r = old.apply(this, arguments);
    try {
      const w = document.getElementById('well') || document.querySelector('.stage') || document.body;
      const k = RD.curKey ? RD.curKey() : '';
      if (!fwd()) { fixUpNext(w, k); fixStepNext(w, k); fixHomeOne(w, k); }
      fixZeroNav();
      fixHelp();
      fixFinbox(w, k);
    } catch (e) { console.error('[rd v92r4c]', e); }
    return r;
  };
  // 窓（ヘルプ）とログイン画面は、描き直しの外で開くことがある
  document.addEventListener('click', () => { setTimeout(() => { try { fixHelp(); } catch (e) { /* 無視 */ } }, 300); }, false);
  setTimeout(() => { try { fixHelp(); fixZeroNav(); } catch (e) { /* 無視 */ } }, 1200);
})();
