// 共通ヘルパー：刷新版をローカルで開き、見本のアカウントで入る
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const SP = path.resolve(__dirname, '..');
const CHART = fs.readFileSync(path.join(SP, 'vendor/node_modules/chart.js/dist/chart.umd.js'));
const BASE = process.env.BASE || 'http://127.0.0.1:8801/';
const { makeMock } = require('./mock.cjs');
function seedScript(a) {
  // ページのスクリプトより先に動く。台帳（この端末の控え）とセッションを入れる
  try {
    const now = Date.now();
    const U = () => ({ logins: 0, uploads: 0, aiQ: 0, webQ: 0, fills: 0, screens: {}, lastActive: 0, first: 0, events: [] });
    let db = null;
    try { db = JSON.parse(localStorage.getItem('bc20_trial_v1')); } catch (e) {}
    if (!db || !db.accounts) db = { v: 1, admin: { id: 'standage', pw: '' }, accounts: [] };
    if (!db.accounts.some((x) => x.code === a.code)) db.accounts.push({ code: a.code, co: a.co, who: a.who || '', st: 'active', web: true, role: a.role || '', created: now, expires: now + 14 * 864e5, usage: U(), members: a.members || [] });
    localStorage.setItem('bc20_trial_v1', JSON.stringify(db));
    if (!sessionStorage.getItem('bc20_ses_v1') && !a.noSession) sessionStorage.setItem('bc20_ses_v1', JSON.stringify(a.ses || { t: 'trial', code: a.code, who: a.who || '', role: a.role || '' }));
    if (a.ls) for (const k of Object.keys(a.ls)) if (localStorage.getItem(k) == null) localStorage.setItem(k, a.ls[k]);
  } catch (e) {}
  // この環境は同期サーバーに届かないため、「つながっていません」の帯は隠す（実際の利用では出ない）
  try { const st = document.createElement('style'); st.textContent = '#v217bar{display:none!important}'; const put = () => (document.head || document.documentElement).appendChild(st); if (document.head) put(); else document.addEventListener('DOMContentLoaded', put); } catch (e) {}
}
async function open(opts = {}) {
  const ctxOpts = { viewport: opts.viewport || { width: 1440, height: 900 }, deviceScaleFactor: opts.dsf || 1, locale: 'ja-JP', timezoneId: 'Asia/Tokyo', ...(opts.mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' } : {}), ...(opts.ctx || {}) };
  let browser, context;
  if (opts.profile) {
    // profile を渡すと、前の実行の続き（登録した商品・設定）から始められる
    const dir = path.join(SP, 'profiles', String(opts.profile).replace(/[^0-9A-Za-z_.-]/g, '_'));
    fs.mkdirSync(dir, { recursive: true });
    context = await chromium.launchPersistentContext(dir, ctxOpts);
    browser = { close: () => context.close() };
  } else {
    browser = await chromium.launch();
    context = await browser.newContext(ctxOpts);
  }
  const log = { console: [], errors: [], failed: [], reqs: [] };
  // 同期サーバーの代役（既定で使う。opts.mock === false で「つながらない」状態）
  const a0 = opts.acct || {};
  const mock = opts.mock === false ? null : makeMock(Object.assign({ acct: { co: a0.co || 'テスト商事株式会社', who: a0.who || '', st: 'active', role: a0.role || '', created: Date.now() - 864e5, expires: Date.now() + 14 * 864e5, members: a0.members || [], aiMode: 'solo' } }, opts.mock || {}));
  await context.route('https://cdn.jsdelivr.net/**', (r) => r.fulfill({ status: 200, contentType: 'application/javascript', body: CHART }));
  await context.route(/^https:\/\/(?!fonts\.)[^/]+\//, (r) => {
    const u = r.request().url();
    if (/^https:\/\/cdn\.jsdelivr\.net\//.test(u)) return r.fallback();
    log.reqs.push(r.request().method() + ' ' + u.slice(0, 160));
    if (opts.onExt) return opts.onExt(r, u);
    if (mock) return mock.handler(r, u);
    return r.abort('internetdisconnected');
  });
  if (opts.acct) await context.addInitScript(seedScript, opts.acct);
  const page = (opts.profile && context.pages()[0]) || await context.newPage();
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/ERR_INTERNET_DISCONNECTED|ERR_FAILED/.test(m.text())) log.console.push(`[${m.type()}] ${m.text().slice(0, 400)}`); });
  page.on('pageerror', (e) => log.errors.push(String((e && e.stack) || e).slice(0, 600)));
  page.on('dialog', async (d) => { log.console.push('[dialog] ' + d.type() + ': ' + d.message().slice(0, 300)); try { await d.accept(); } catch (e) {} });
  return { browser, context, page, log, BASE, mock };
}
async function enter(page, opts = {}) {
  await page.goto(BASE + (opts.hash || ''), { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof RDX !== 'undefined' && !document.body.classList.contains('locked'), null, { timeout: 30000 });
  await page.waitForTimeout(opts.wait || 2500);
  // はじめての窓（ようこそ・登録メニュー）は、firstRun: true のとき以外は閉じる
  if (!opts.firstRun) await dismissFirstRun(page);
}
// はじめての窓（ようこそ・登録メニュー）を閉じる
async function dismissFirstRun(page) {
  for (let i = 0; i < 5; i++) {
    const st = await page.evaluate(() => { const vis = (id) => { const e = document.getElementById(id); if (!e) return false; const c = getComputedStyle(e), r = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && r.width > 0 && r.height > 0; }; return { wel: vis('welv'), menu: vis('v1811ov') }; });
    if (st.wel) { await page.getByText('さっそく始める', { exact: true }).first().click(); await page.waitForTimeout(800); continue; }
    if (st.menu) { await page.locator('#v1811ov').getByText('閉じる（このまま画面を見る）').first().click(); await page.waitForTimeout(800); continue; }
    break;
  }
}
// 見本を開く：food / cosme / parts（完成形の見本）・daily / car / liquor / apparel / medical（業種サンプル）
async function loadSample(page, key) {
  await page.evaluate(() => { try { RDX.goKey('up'); } catch (e) {} });
  await page.waitForTimeout(1500);
  const sel = `button.smp[data-smp="${key}"],button.smp[data-smp2="${key}"]`;
  // はじめての窓（ようこそ → 登録メニュー）を閉じる。見本のカードは画面の下にある
  for (let i = 0; i < 5; i++) {
    const st = await page.evaluate(() => { const vis = (id) => { const e = document.getElementById(id); if (!e) return false; const c = getComputedStyle(e), r = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && r.width > 0 && r.height > 0; }; return { wel: vis('welv'), menu: vis('v1811ov') }; });
    if (st.wel) { await page.getByText('さっそく始める', { exact: true }).first().click(); await page.waitForTimeout(800); continue; }
    if (st.menu) { await page.locator('#v1811ov').getByText('サンプルで試す', { exact: true }).first().click(); await page.waitForTimeout(1000); continue; }
    break;
  }
  // 見本のカードが出ていないときは、画面の「サンプルで試す」を押して出す
  for (let i = 0; i < 3 && !(await page.locator(sel).count()); i++) {
    const clicked = await page.evaluate(() => { const vis = (e) => { const c = getComputedStyle(e), r = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && r.width > 0; }; const b = Array.from(document.querySelectorAll('button')).find((x) => vis(x) && x.innerText.replace(/\s+/g, '') === 'サンプルで試す'); if (b) { b.click(); return true; } return false; });
    await page.waitForTimeout(clicked ? 1200 : 600);
    if (!clicked) { await page.evaluate(() => { try { RDX.goKey('up'); } catch (e) {} }); await page.waitForTimeout(1200); }
  }
  await page.waitForSelector(sel, { state: 'attached', timeout: 15000 });
  await page.evaluate((sel) => { const b = document.querySelector(sel); b.scrollIntoView({ block: 'center' }); }, sel);
  await page.waitForTimeout(300);
  await page.click(sel);
  await page.waitForTimeout(4500);
}
// ファイルを選ぶ欄に入れる（日本語の名前のファイルは、この環境ではパスで渡すと無視されるため、中身で渡す）
const MIME = { xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', csv: 'text/csv', txt: 'text/plain', pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', zip: 'application/zip' };
function fileObj(p) { const name = path.basename(p); const ext = name.split('.').pop().toLowerCase(); return { name, mimeType: MIME[ext] || 'application/octet-stream', buffer: fs.readFileSync(p) }; }
async function setFiles(page, selector, files) {
  const list = (Array.isArray(files) ? files : [files]).map((f) => (typeof f === 'string' ? fileObj(path.isAbsolute(f) ? f : path.join(SP, 'files', f)) : f));
  await page.locator(selector).first().setInputFiles(list);
}
// 新しい会社の商品を、資料のアップロードで登録する（はじめての窓からでも、登録の画面からでも）
async function registerByUpload(page, files, wait) {
  await page.evaluate(() => { try { if (RDX.curKey() !== 'up') RDX.goKey('up'); } catch (e) {} });
  await page.waitForTimeout(1200);
  for (let i = 0; i < 5; i++) {
    const st = await page.evaluate(() => { const vis = (id) => { const e = document.getElementById(id); if (!e) return false; const c = getComputedStyle(e), r = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && r.width > 0 && r.height > 0; }; return { wel: vis('welv'), menu: vis('v1811ov') }; });
    if (st.wel) { await page.getByText('さっそく始める', { exact: true }).first().click(); await page.waitForTimeout(800); continue; }
    if (st.menu) {
      const a = page.locator('#v1811ov').getByText('資料をアップロードして登録');
      if (await a.count()) { await a.first().click(); await page.waitForTimeout(1000); continue; }
      const b = page.locator('#v1811ov').getByText('新しい会社の商品を登録する');
      if (await b.count()) { await b.first().click(); await page.waitForTimeout(800); continue; }
    }
    break;
  }
  await setFiles(page, '#fin', files);
  await page.waitForTimeout(wait || 9000);
}
async function go(page, key, wait) {
  await page.evaluate((k) => RDX.goKey(k), key);
  await page.waitForTimeout(wait || 2500);
}
// 画面の文字（見えているものだけ）
async function text(page, sel) {
  return page.evaluate((sel) => { const el = sel ? document.querySelector(sel) : document.body; return el ? el.innerText.replace(/\n{3,}/g, '\n\n') : ''; }, sel || null);
}
async function shot(page, name, full) {
  let p = path.isAbsolute(name) ? name : path.join(SP, 'shots', name);
  if (!/\.(png|jpe?g)$/i.test(p)) p += '.png';
  fs.mkdirSync(path.dirname(p), { recursive: true });
  await page.screenshot({ path: p, fullPage: !!full });
  return p;
}
// いま見えている「押せるもの・入力欄」の一覧（sel の中だけ。既定は本文 .stage）
async function controls(page, sel, max) {
  return page.evaluate(({ sel, max }) => {
    const root = document.querySelector(sel || '.stage') || document.body;
    const vis = (e) => { const c = getComputedStyle(e), r = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && r.width > 1 && r.height > 1; };
    const out = [];
    root.querySelectorAll('button,a[href],input,select,textarea,[role=button],[role=tab],[data-act],[data-rdk],summary,[contenteditable=true]').forEach((e) => {
      if (!vis(e) || out.length >= (max || 250)) return;
      const lab = (e.innerText || e.value || e.placeholder || e.getAttribute('aria-label') || e.title || '').replace(/\s+/g, ' ').trim().slice(0, 60);
      const at = Array.from(e.attributes).filter((a) => /^(id|name|type|data-act|data-rdk|data-p|data-k|href|aria-label|title|disabled)$/.test(a.name)).map((a) => a.name + '=' + String(a.value).slice(0, 40)).join(' ');
      out.push(e.tagName.toLowerCase() + ' {' + at + '} ' + lab);
    });
    return out;
  }, { sel: sel || null, max: max || 0 });
}
// 開いている窓（ダイアログ・シート・トースト）の中身
async function overlays(page) {
  return page.evaluate(() => {
    const out = [];
    const seen = new Set();
    const add = (e) => { if (seen.has(e)) return; const c = getComputedStyle(e), r = e.getBoundingClientRect(); if (c.display === 'none' || c.visibility === 'hidden' || r.width < 40 || r.height < 20) return; const t = (e.innerText || '').trim(); if (!t) return; seen.add(e); out.push({ id: e.id || '', cls: String(e.className || '').slice(0, 60), role: e.getAttribute('role') || '', text: t.replace(/\n{3,}/g, '\n\n').slice(0, 4000) }); };
    document.querySelectorAll('[role=dialog],[role=alertdialog],dialog[open]').forEach(add);
    Array.from(document.body.children).forEach((e) => { if (/^(SCRIPT|STYLE|LINK)$/.test(e.tagName)) return; const c = getComputedStyle(e); if ((c.position === 'fixed' || c.position === 'absolute') && +c.zIndex >= 50 && !e.classList.contains('side') && e.id !== 'rdside') add(e); });
    return out;
  });
}
// 画面を上から区切って撮る（縦に長い画面でも文字が読める大きさで）
async function shots(page, prefix, max) {
  const n = max || 5;
  const H = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, vh: innerHeight }));
  const out = [];
  for (let i = 0; i < n; i++) {
    const y = i * (H.vh - 80);
    if (i > 0 && y >= H.h - 40) break;
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(350);
    out.push(await shot(page, `${prefix}_${i + 1}`));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return out;
}
// 文字で押す（scope を渡すと、その中だけ）
async function clickText(page, txt, scope, opts) {
  const root = scope ? page.locator(scope) : page;
  const loc = (opts && opts.exact === false) ? root.getByText(txt) : root.getByText(txt, { exact: true });
  const n = await loc.count();
  for (let i = 0; i < n; i++) { const el = loc.nth(i); if (await el.isVisible()) { await el.click({ timeout: 8000 }); await page.waitForTimeout((opts && opts.wait) || 900); return true; } }
  return false;
}
module.exports = { controls, overlays, shots, clickText, open, enter, dismissFirstRun, loadSample, registerByUpload, setFiles, fileObj, go, text, shot, SP, BASE };
