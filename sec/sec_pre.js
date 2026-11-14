/* 貿易クラウドAI商社マン 21.91.1 sec（2026-11-14）— アプリより先に読む守り
   ・画面に入る HTML のうち、データに紛れた「自動で動く仕掛け」を止める
     （data-onerror はアプリ自身の 1 種類だけ／外から来た iframe・script・object など／javascript: の URL）
   ・端末に保存された商品・物流のデータを読むときに、HTML の仕掛けになる文字を無害な文字にそろえる
   ・外のサイトを新しいタブで開くとき、元の画面を操作されないようにする（noopener）
   アプリの関数は呼ばない（アプリより先に動くため）。アプリの後の守りは sec_post.js。 */
(function () {
  "use strict";
  if (window.__SEC92) return;
  var S = (window.__SEC92 = { v: "21.91.1-sec", n: {}, log: [], onNote: null });

  function note(k, d) {
    try {
      S.n[k] = (S.n[k] || 0) + 1;
      var x = { k: k, d: String(d == null ? "" : d).slice(0, 80), at: Date.now() };
      if (S.log.length < 80) S.log.push(x);
      if (typeof S.onNote === "function") S.onNote(x);
    } catch (e) { /* 記録に失敗しても守りは続ける */ }
  }
  S.note = note;

  /* ───── 1. 自動で動く仕掛け（data-onerror）はアプリ自身のものだけ ───── */
  var ONERR_OK = Object.create(null);
  ONERR_OK["this.parentElement.innerHTML='読込不可'"] = 1;
  S.onerrOk = function (v) { return ONERR_OK[String(v)] === 1; };

  /* アプリの「data-onerror を結びつける」処理より先に、窓（window）で受け止める */
  window.addEventListener("error", function (ev) {
    try {
      var t = ev.target;
      if (!t || t.nodeType !== 1 || !t.hasAttribute || !t.hasAttribute("data-onerror")) return;
      var v = t.getAttribute("data-onerror");
      if (S.onerrOk(v)) return;
      t.removeAttribute("data-onerror");
      ev.stopImmediatePropagation();
      note("onerror", (t.tagName || "") + ":" + v);
    } catch (e) { /* noop */ }
  }, true);

  /* ───── 2. 画面に入る HTML の見張り（innerHTML・outerHTML・insertAdjacentHTML） ───── */
  var DROP = { SCRIPT: 1, OBJECT: 1, EMBED: 1, APPLET: 1, BASE: 1, FRAME: 1, FRAMESET: 1, PORTAL: 1 };
  var RISK = /data-onerror|<\s*(?:script|iframe|frame|object|embed|base|meta|portal|applet)\b|srcdoc|javascript\s*:|vbscript\s*:/i;
  var SEL = "[data-onerror],iframe,script,object,embed,applet,base,frame,frameset,portal,meta[http-equiv],[srcdoc],[href],[src],[action],[formaction],[xlink\\:href]";
  var REGDB = "https://script.google.com/a/macros/standage.co.jp/";

  function badUrl(v) {
    var u = String(v == null ? "" : v).replace(/[\u0000- \u007f-\u009f]/g, "").toLowerCase();
    return u.indexOf("javascript:") === 0 || u.indexOf("vbscript:") === 0 || u.indexOf("data:text/html") === 0;
  }
  function frameSrcOk(v) {
    if (v == null || v === "") return true;
    var s = String(v).trim();
    if (s.indexOf(REGDB) === 0) return true;
    if (/^blob:/i.test(s)) return s.indexOf("blob:" + location.origin + "/") === 0;
    if (/^[a-z][a-z0-9+.\-]*:/i.test(s) || /^\/\//.test(s)) {
      try { return new URL(s, location.href).origin === location.origin; } catch (e) { return false; }
    }
    return true; /* 同じサイトの相対パス（cs.html・guide/ など） */
  }

  /* mo=true：アプリの見張り（MutationObserver）から呼ばれたとき。ページを読み込む途中の正規の <script> も通るので、要素は消さない
     （innerHTML などで入った要素は、下の差し込み口の見張りが消す） */
  function scrubEl(el, mo) {
    if (!el || el.nodeType !== 1) return false;
    var tag = String(el.tagName || "").toUpperCase();
    if (mo && (DROP[tag] || tag === "META")) return false;
    if (DROP[tag]) { note("el", tag); el.remove(); return true; }
    if (tag === "META") {
      if (/refresh|set-cookie|content-security-policy/i.test(el.getAttribute("http-equiv") || "")) { note("el", "META"); el.remove(); return true; }
      return false;
    }
    if (tag === "IFRAME") {
      var ok = el.hasAttribute("sandbox") && frameSrcOk(el.getAttribute("src")) && frameSrcOk(el.getAttribute("data-src")) &&
        (!el.hasAttribute("srcdoc") || el.id === "csFrame");
      if (!ok) { note("iframe", (el.getAttribute("src") || el.getAttribute("data-src") || "srcdoc").slice(0, 60)); el.remove(); return true; }
    }
    if (el.hasAttribute("data-onerror") && !S.onerrOk(el.getAttribute("data-onerror"))) {
      note("onerror", tag + ":" + el.getAttribute("data-onerror"));
      el.removeAttribute("data-onerror");
    }
    if (el.hasAttribute("srcdoc") && !(tag === "IFRAME" && el.id === "csFrame")) { note("srcdoc", tag); el.removeAttribute("srcdoc"); }
    var U = ["href", "src", "action", "formaction", "xlink:href", "data-src"];
    for (var i = 0; i < U.length; i++) {
      if (el.hasAttribute(U[i]) && badUrl(el.getAttribute(U[i]))) { note("url", tag + "." + U[i]); el.removeAttribute(U[i]); }
    }
    return false;
  }
  S.scrubEl = scrubEl;
  function scrubTree(root) {
    try {
      if (!root || !root.querySelectorAll) return;
      if (root.nodeType === 1 && root.matches && root.matches(SEL)) scrubEl(root);
      var L = root.querySelectorAll(SEL);
      for (var i = 0; i < L.length; i++) scrubEl(L[i]);
    } catch (e) { /* noop */ }
  }
  S.scrubTree = scrubTree;
  function risky(html) { return typeof html === "string" && html.length > 6 && RISK.test(html); }
  S.risky = risky;

  /* 新しく入った節（a の次から b の前まで）だけを見る。アプリがもともと置いた要素には触らない */
  function scrubRange(parent, a, b) {
    try {
      var nd = a ? a.nextSibling : parent && parent.firstChild, k = 0;
      while (nd && nd !== b && k < 5000) { var nx = nd.nextSibling; if (nd.nodeType === 1) scrubTree(nd); nd = nx; k++; }
    } catch (e) { /* noop */ }
  }

  try {
    var EP = Element.prototype;
    var dIn = Object.getOwnPropertyDescriptor(EP, "innerHTML");
    if (dIn && dIn.set) {
      Object.defineProperty(EP, "innerHTML", {
        configurable: true, enumerable: dIn.enumerable, get: dIn.get,
        set: function (v) {
          dIn.set.call(this, v);
          if (risky(v)) { var c = this.tagName === "TEMPLATE" && this.content ? this.content : this; scrubRange(c, null, null); }
        }
      });
    }
    var dOut = Object.getOwnPropertyDescriptor(EP, "outerHTML");
    if (dOut && dOut.set) {
      Object.defineProperty(EP, "outerHTML", {
        configurable: true, enumerable: dOut.enumerable, get: dOut.get,
        set: function (v) {
          var p = this.parentNode, a = this.previousSibling, b = this.nextSibling;
          dOut.set.call(this, v);
          if (risky(v) && p) scrubRange(p, a, b);
        }
      });
    }
    var iAH = EP.insertAdjacentHTML;
    EP.insertAdjacentHTML = function (pos, v) {
      var p = String(pos).toLowerCase(), par, a, b;
      if (p === "beforebegin") { par = this.parentNode; a = this.previousSibling; b = this; }
      else if (p === "afterend") { par = this.parentNode; a = this; b = this.nextSibling; }
      else if (p === "afterbegin") { par = this; a = null; b = this.firstChild; }
      else { par = this; a = this.lastChild; b = null; }
      var r = iAH.call(this, pos, v);
      if (risky(v) && par) scrubRange(par, a, b);
      return r;
    };
    if (typeof ShadowRoot !== "undefined") {
      var dSh = Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "innerHTML");
      if (dSh && dSh.set) {
        Object.defineProperty(ShadowRoot.prototype, "innerHTML", {
          configurable: true, enumerable: dSh.enumerable, get: dSh.get,
          set: function (v) { dSh.set.call(this, v); if (risky(v)) scrubRange(this, null, null); }
        });
      }
    }
    var cCF = Range.prototype.createContextualFragment;
    Range.prototype.createContextualFragment = function (v) {
      var f = cCF.call(this, v);
      if (risky(v)) scrubTree(f);
      return f;
    };
  } catch (e) { note("hookfail", String(e)); }

  /* ───── 3. 保存されたデータを読むときにそろえる（商品・会社＝bc20_ten_／物流＝bc20_fwd_v1） ───── */
  /* 書類・規制の画面などが値をそのまま描く欄。山かっこを全角にする（見た目はほぼ同じで、HTML にならない） */
  var SCALAR = ["hs", "pol", "pod", "term", "pay", "cur", "currency", "lead", "moq", "ctn", "unit", "origin", "shelf",
    "cert", "store", "msrp", "sku", "qty", "unitPrice", "total", "want", "pick", "bl", "vessel"];
  var CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
  function neut(s) { return String(s).replace(CTRL, "").replace(/</g, "＜").replace(/>/g, "＞"); }
  S.neut = neut;
  /* データの中に「押すと動く・自動で動く」属性や危ない要素が書かれていたら、その文はまるごと文字として扱う */
  var GADGET = /<\s*[a-z][^>]*?[\s/"'](?:on[a-z]+|data-(?:on[a-z]+|act[\w-]*|args?|kact|rd[\w-]*|k[a-z][\w-]*|qg[\w-]*|v\d[\w-]*|s|tm[\w-]*))\s*=|<\s*(?:script|iframe|frame|object|embed|base|meta|portal|applet|svg|math)\b/i;
  S.gadget = function (s) { return typeof s === "string" && s.indexOf("<") >= 0 && GADGET.test(s); };
  var MIME = /^[a-z]+\/[a-z0-9][a-z0-9.+\-]{0,80}$/i;
  var B64 = /^[A-Za-z0-9+/=_\-\s]*$/;
  /* 値がそのまま「入れ物の鍵」に使われる欄（会社名・案件番号・仕向国など）。__proto__ などはアプリ全体を壊すので別の文字にする */
  var KEYISH = { co: 1, coEn: 1, no: 1, dest: 1, item: 1, id: 1, name: 1, cty: 1, country: 1, key: 1 };
  var PROTO = { "__proto__": 1, "constructor": 1, "prototype": 1, "hasOwnProperty": 1, "toString": 1, "valueOf": 1, "isPrototypeOf": 1, "__defineGetter__": 1, "__defineSetter__": 1, "__lookupGetter__": 1 };
  var HTTPS = /^https:\/\/[^\s"'<>`]+$/;

  /* all=true：全部の文字の山かっこをそろえる（構造化されたデータ）／false：決まった欄と、仕掛けを含む文だけ */
  function deep(o, ctx, all) {
    var ch = 0, n = 0, seen = typeof WeakSet === "function" ? new WeakSet() : null;
    (function walk(x, depth, inAssets, scalarAll, inDocs) {
      if (!x || typeof x !== "object" || depth > 16 || n > 300000) return;
      if (seen) { if (seen.has(x)) return; seen.add(x); }
      if (Object.prototype.hasOwnProperty.call(x, "__proto__")) { try { delete x["__proto__"]; ch++; note("proto", ctx); } catch (e) { /* noop */ } }
      if (Object.prototype.hasOwnProperty.call(x, "b64") && (typeof x.b64 === "string" || x.b64 == null)) {
        if (x.mime != null && !MIME.test(String(x.mime))) { x.mime = inAssets ? "image/jpeg" : "application/octet-stream"; ch++; note("mime", ctx); }
        if (typeof x.b64 === "string" && x.b64.length && !B64.test(x.b64)) { x.b64 = ""; ch++; note("b64", ctx); }
      }
      var keys = Object.keys(x);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i], v = x[k];
        n++;
        if (typeof v === "string") {
          if (k === "b64" || k === "mime" || v.length === 0) continue;
          var nv = v;
          if ((scalarAll || SCALAR.indexOf(k) >= 0) && /[<>\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(nv)) nv = neut(nv);
          else if (nv.length < 400000 && S.gadget(nv)) { nv = neut(nv); note("gadget", ctx + "." + k); }
          if (KEYISH[k] === 1 && PROTO[nv.trim()] === 1) { nv = nv.trim() + "＿"; note("protoval", ctx + "." + k); }
          /* 書類の判定の行（v85docs）の重さの札は英小文字の名前だけ（画面の class に入るため） */
          if (inDocs && k === "lv" && !/^[a-z][a-z0-9_\-]{0,23}$/.test(nv)) { nv = "check"; note("lv", ctx); }
          if (ctx === "rm" && (k === "u" || k === "url") && nv && !HTTPS.test(nv.trim())) { nv = ""; note("url", ctx); }
          if (nv !== v) { try { x[k] = nv; ch++; } catch (e) { /* 読み取り専用 */ } }
        } else if (v && typeof v === "object") {
          walk(v, depth + 1, inAssets || k === "assets", scalarAll, inDocs || k === "v85docs");
        }
      }
    })(o, 0, false, !!all, false);
    return ch;
  }
  /* 商品（1件）をそろえる。変えた数を返す */
  S.normTen = function (t) { try { return t && typeof t === "object" ? deep(t, "ten", false) : 0; } catch (e) { return 0; } };
  /* 物流会社のデータ（他社が入力した値を含む）。レート・依頼・履歴・会社情報は全部の文字をそろえる */
  S.normFwd = function (F) {
    try {
      if (!F || typeof F !== "object") return 0;
      var ch = 0;
      ["rates", "reqs", "hist", "profile"].forEach(function (k) { if (F[k] && typeof F[k] === "object") ch += deep(F[k], "fwd." + k, true); });
      ch += deep(F, "fwd", false);
      return ch;
    } catch (e) { return 0; }
  };
  /* AI が資料から読み取った値（JSON）。データの欄なので HTML は入らない前提で、全部の文字をそろえる */
  S.normAiData = function (x) { try { return x && typeof x === "object" ? deep(x, "ai", true) : 0; } catch (e) { return 0; } };
  /* 目標と道筋（bc20_rm_v1・同期される）。出典のリンクは https だけ・仕掛けを含む文は文字に */
  S.normRm = function (A) { try { return A && typeof A === "object" ? deep(A, "rm", false) : 0; } catch (e) { return 0; } };

  function normStr(v, fn) {
    try {
      var j = JSON.parse(v);
      if (!j || typeof j !== "object") return v;
      var ch = fn(j);
      return ch ? JSON.stringify(j) : v;
    } catch (e) { return v; }
  }
  var last = { k: "", i: null, o: null };
  try {
    var SP = Storage.prototype, G0 = SP.getItem;
    SP.getItem = function (k) {
      var v = G0.call(this, k);
      try {
        if (typeof v !== "string" || typeof k !== "string" || v.length < 2) return v;
        var isTen = k.indexOf("bc20_ten_") === 0, isFwd = k.indexOf("bc20_fwd_v1") === 0, isRm = k.indexOf("bc20_rm_v1") === 0;
        if (!isTen && !isFwd && !isRm) return v;
        if (last.k === k && last.i === v) return last.o;
        var out = isTen ? normStr(v, function (j) {
          if (Array.isArray(j.list)) { var c = 0; j.list.forEach(function (t) { c += S.normTen(t); }); return c; }
          return S.normTen(j);
        }) : isFwd ? normStr(v, S.normFwd) : normStr(v, S.normRm);
        if (out !== v) note("load", isTen ? "ten" : isFwd ? "fwd" : "rm");
        last = { k: k, i: v, o: out };
        return out;
      } catch (e) { return v; }
    };
  } catch (e) { note("hookfail", "storage"); }

  /* ───── 4. 外のサイトを開くときは元の画面に触らせない ───── */
  try {
    var WO = window.open;
    window.open = function (u, t, f) {
      try {
        if (typeof u === "string" && /^\s*https?:/i.test(u)) {
          var x = new URL(u, location.href);
          if (x.origin !== location.origin && !/noopener/i.test(String(f || ""))) f = (f ? String(f) + "," : "") + "noopener,noreferrer";
        }
      } catch (e) { /* noop */ }
      return WO.call(window, u, t, f);
    };
  } catch (e) { /* noop */ }
})();
