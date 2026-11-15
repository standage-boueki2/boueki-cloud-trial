// 同期サーバー（GAS）の簡易な代役。この環境からは本物に届かないため、画面の確認用に最小限の応答だけ返す。
// 本物の決まり（認証・台帳・メール・AI の中継）は再現しない。返せない op は { ok:false, reason:"unsupported" }。
function makeMock(cfg = {}) {
  const st = { ops: [], store: { acct: {}, fwd: { ver: 0, blob: '' } }, cfg, unknown: {} };
  const acctOf = (kid) => (cfg.accts && cfg.accts[kid]) || cfg.acct || { co: 'テスト商事株式会社', who: '山田 花子', st: 'active', role: '', created: Date.now() - 864e5, expires: Date.now() + 14 * 864e5, members: [], aiMode: 'solo' };
  const handler = async (route, url) => {
    if (!/script\.google\.com/.test(url)) return route.abort('internetdisconnected');
    let b = {}; try { b = JSON.parse(route.request().postData() || '{}'); } catch (e) {}
    const op = String(b.op || '');
    st.ops.push(op + (b.ns ? ':' + b.ns : ''));
    let r;
    switch (op) {
      case 'ping': r = { ok: true, ver: cfg.srvVer || '2.33', v: cfg.srvVer || '2.33', now: Date.now(), secf: 1 }; break;
      case 'lookup': r = { ok: true, acct: acctOf(b.kid) }; break;
      case 'login': r = { ok: true, acct: acctOf(b.kid), ver: { acct: (st.store.acct[b.kid] || {}).ver || 0, fwd: st.store.fwd.ver } }; break;
      case 'beat': r = { ok: true, ver: { acct: (st.store.acct[b.kid] || {}).ver || 0, fwd: st.store.fwd.ver } }; break;
      case 'pull': {
        if (b.ns === 'fwd') { const fb = st.store.fwd.blob || (cfg.fwdBlob ? JSON.stringify(cfg.fwdBlob) : ''); r = { ok: true, ver: st.store.fwd.ver || (fb ? 1 : 0), blob: fb }; }
        else { const a = st.store.acct[b.kid] || { ver: 0, blob: '' }; r = { ok: true, ver: a.ver, blob: a.blob }; }
        break;
      }
      case 'push': {
        if (b.ns === 'fwd') { st.store.fwd = { ver: st.store.fwd.ver + 1, blob: b.blob || '' }; r = { ok: true, ver: st.store.fwd.ver }; }
        else { const a = st.store.acct[b.kid] || { ver: 0, blob: '' }; st.store.acct[b.kid] = { ver: a.ver + 1, blob: b.blob || '' }; r = { ok: true, ver: a.ver + 1 }; }
        break;
      }
      case 'logout': r = { ok: true }; break;
      case 'fwd_ver': r = { ok: true, ver: st.store.fwd.ver }; break;
      case 'mail_status': r = { ok: true, configured: !!cfg.mail, from: cfg.mail ? 'trade@standage.example' : '', quota: cfg.mail ? 90 : null, note: '' }; break;
      case 'air_me': r = { ok: true, on: false, why: 'off' }; break;
      case 'deck_list': r = { ok: true, items: [] }; break;
      case 'pool_put': r = { ok: true }; break;
      case 'lw_pull': r = { ok: true, msgs: [], at: Date.now() }; break;
      case 'reg_at': r = { ok: true, at: 0 }; break;
      case 'kb_stats': r = { ok: true, on: 0 }; break;
      case 'stdkb_get': r = { ok: true, items: [], updated: 0 }; break;
      case 'llm_get': r = { ok: true }; break;
      case 'req_list': r = { ok: true, items: [] }; break;
      case 'me_seclog': case 'me_sessions': r = { ok: true, items: [] }; break;
      case 'fx_rates': r = { ok: true, nfx: 1, fx: { d: '2026-11-13', at: Date.now() - 36e5, jpy: { USD: 152.4, EUR: 164.8, GBP: 196.3, CNY: 21.1, HKD: 19.6, SGD: 114.2, TWD: 4.72, KRW: 0.111, THB: 4.35, AUD: 99.8, CAD: 109.6, AED: 41.5, MYR: 34.6, VND: 0.006, IDR: 0.0096, INR: 1.81, PHP: 2.64, CHF: 172.9 }, usd: { EUR: 0.9247, GBP: 0.7764, CNY: 7.223, HKD: 7.776, SGD: 1.3345, TWD: 32.29, KRW: 1373.0, THB: 35.03, AUD: 1.527, CAD: 1.3905, AED: 3.6725, MYR: 4.405 } } }; break;
      default: st.unknown[op] = (st.unknown[op] || 0) + 1; r = { ok: false, reason: 'unsupported', msg: 'mock' };
    }
    if (cfg.trace) console.log('[mock]', op, JSON.stringify(Object.keys(b)).slice(0, 200), '->', JSON.stringify(r).slice(0, 160));
    return route.fulfill({ status: 200, contentType: 'application/json; charset=utf-8', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(r) });
  };
  return { st, handler };
}
module.exports = { makeMock };
