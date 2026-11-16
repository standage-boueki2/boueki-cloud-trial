/* 21.94 r9c：刷新版の層（9巡目の直し：英語・中国語・スペイン語）。今の部品は差し替えず、RDX.after を包む
   ① 受信箱の「今日のまとめ」の札（xcut-T01）：日本語以外では「確認・承認：—」「急ぎの対応はありません」のままだった。
      札は受信箱のタブの文字（訳したあとの文字）から数を読んでいたため。訳す前の文字（I18N.orig）から読み、無ければ右上の「残り N件」と同じ数（承認待ちの数）を使う。
      数・まずの案内・ボタンを、その言語で出す（日本語の画面は何もしない）
   ② スペイン語の「(quedan 1)」→「(queda 1)」（xcut-U09 (1)） */
(function () {
  'use strict';
  const RD = window.RDX;
  if (!RD || RD._v92r9c) return;
  RD._v92r9c = 1;
  const { $, $$ } = RD;
  // I18N は今のアプリのスクリプトの const（window の持ち物ではない）ので名前で読む。言語の欄の値を先に見る
  const I18 = () => { try { return typeof I18N !== 'undefined' ? I18N : null; } catch (e) { return null; } }; // eslint-disable-line no-undef
  const lang = () => { try { const el = document.getElementById('lang'); const v = String((el && el.value) || (I18() && I18().lang) || 'ja'); return /^en/.test(v) ? 'en' : /^zh/.test(v) ? 'zh' : /^es/.test(v) ? 'es' : 'ja'; } catch (e) { return 'ja'; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === 'en' ? en : l === 'zh' ? (zh || en) : l === 'es' ? (es || en) : ja; };
  const esc = RD.esc || ((s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])));
  const I = RD.I || (() => '');
  const fwd = () => { try { return !!RD.isFwd(); } catch (e) { return false; } };
  const locked = () => { try { return !!RD.locked(); } catch (e) { return document.body.classList.contains('locked'); } };
  const curKey = () => { try { return RD.curKey ? RD.curKey() : ''; } catch (e) { return ''; } };
  const well = () => document.getElementById('well') || document.querySelector('.stage') || document.body;
  // 訳す前の文字（今のアプリの辞書の仕組みが元の日本語を持っている）
  const origText = (el) => {
    let s = '';
    try {
      const o = I18() && I18().orig;
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())) s += (o && o.has(n)) ? String(o.get(n)) : String(n.nodeValue || '');
    } catch (e) { s = String(el.textContent || ''); }
    return s.replace(/\s+/g, ' ').trim();
  };
  const tabsOf = (w) => $$('.v38ix button, .v33ix button, .v33tab', w).filter((x) => !x.closest('.rd-x')).map((b) => ({ b, t: origText(b) }));
  const numOf = (tabs, re) => { const x = tabs.find((y) => re.test(y.t)); const m = x && x.t.match(/(\d+)/); return m ? +m[1] : null; };
  const pendN = () => { try { const P = window.v92r7b && window.v92r7b.pending ? window.v92r7b.pending() : null; return P && P.n > 0 ? +P.n : 0; } catch (e) { return 0; } };
  const cnt = (n) => M(n + '件', n === 1 ? '1 item' : n + ' items', n + ' 件', n === 1 ? '1 pendiente' : n + ' pendientes');

  function fixInboxCard(w, k) {
    if (k !== 'inbox' || fwd() || lang() === 'ja') return;
    const ul = $('ul.k-ck', w) || $('.stage ul.k-ck') || $('ul.k-ck');
    const sec = ul && ul.closest('section.k-card');
    if (!sec) return;
    const tabs = tabsOf(w);
    // タブの文字は、訳す前の日本語のことも、はじめからその言語のこともある
    let appr = numOf(tabs, /確認・承認|Review & approve|确认・审批|确认・批准|Revisar y aprobar/);
    const mine = numOf(tabs, /自分の番|My turn|轮到我|我的回合|Mi turno|Su turno/);
    if (!appr) { const p = pendN(); if (p) appr = p; }
    const lis = $$(':scope > li', ul);
    const li = lis[2];
    const tag = li && $('.k-tag', li);
    const first = appr ? 'appr' : mine ? 'mine' : '';
    const sig = 'r9c|' + lang() + '|' + appr + '|' + mine;
    if (sec.dataset.r9c === sig && (!tag || tag.dataset.r9c === sig)) return;
    if (tag) {
      tag.setAttribute('data-noi18n', '1');
      tag.textContent = appr == null ? '—' : cnt(appr);
      tag.classList.toggle('or', !!appr); tag.classList.toggle('gr', !appr);
      tag.dataset.r9c = sig;
    }
    const box = ul.nextElementSibling;
    if (box && first) {
      const nm = first === 'appr' ? M('確認・承認', 'Review & approve', '确认・审批', 'Revisar y aprobar') : M('自分の番', 'Your turn', '轮到我', 'Su turno');
      const n = first === 'appr' ? appr : mine;
      box.setAttribute('data-noi18n', '1');
      box.innerHTML = `<b style="font-size:15px;line-height:1.5;display:block;margin-bottom:10px">${I('spark', 18)} ${esc(M('まずは「' + nm + '」の ' + n + '件から対応しましょう', 'Start with the ' + (n === 1 ? '1 item' : n + ' items') + ' in “' + nm + '”', '先处理“' + nm + '”中的 ' + n + ' 件', 'Empiece por ' + (n === 1 ? 'el elemento' : 'los ' + n + ' elementos') + ' de «' + nm + '»'))}</b><button type="button" class="k-btn wide" data-r9c-go="${first}">${esc(M(nm + 'を開く', 'Open ' + nm, '打开' + nm, 'Abrir ' + nm))} ${I('chevR', 18, 2.4)}</button>`;
      const go = $('[data-r9c-go]', box);
      if (go) go.addEventListener('click', () => {
        try {
          const re = first === 'appr' ? /確認・承認|Review & approve|确认・审批|确认・批准|Revisar y aprobar/ : /自分の番|My turn|轮到我|我的回合|Mi turno|Su turno/;
          const x = tabsOf(well()).find((y) => re.test(y.t));
          if (x) { x.b.click(); setTimeout(() => { const s = document.getElementById('sec-1') || x.b; try { s.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { /* 無視 */ } }, 60); }
        } catch (e) { /* 無視 */ }
      });
    }
    sec.dataset.r9c = sig;
  }

  function fixQuedan() {
    if (lang() !== 'es') return;
    $$('.k-r7b-next b, .k-next b, .k92c-hnext b', document).forEach((b) => {
      const t = String(b.textContent || '');
      if (/\(quedan 1\)/.test(t)) b.textContent = t.replace('(quedan 1)', '(queda 1)');
    });
  }

  function apply() {
    try {
      if (locked() || fwd() || lang() === 'ja') return;
      const w = well(), k = curKey();
      fixInboxCard(w, k); fixQuedan();
    } catch (e) { console.error('[rd v92r9c]', e); }
  }
  const old = RD.after;
  RD.after = function () {
    const r = old.apply(this, arguments);
    apply();
    return r;
  };
  let t1 = 0, t2 = 0;
  const soon = () => { if (lang() === 'ja') return; clearTimeout(t1); clearTimeout(t2); t1 = setTimeout(apply, 460); t2 = setTimeout(apply, 1900); };
  document.addEventListener('click', soon, false);
  document.addEventListener('change', soon, false);
  setTimeout(apply, 700);
})();
