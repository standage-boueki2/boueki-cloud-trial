/* 貿易クラウドAI商社マン 21.92 item（刷新版の層・rd_v92per.js のあとに読む）
   2026-11-14「8カテゴリー×ペルソナ評価」の、商品情報（item）の画面の刷新版だけの直し。RDX.after を包む（今の部品は差し替えない）。
   数字はアプリが持っているものだけ。押したときの働きは、本体の層（logic_v2192item）の窓（data-v92iact）を呼ぶ。
   ① データの充足度の円：推定のままの HS コードを「入っている」と数えて 100% と出し、横の「全体 20/21・必須 8/9」と食い違った（auto-17）
      → 円・「登録済み／登録中」の札・4つの区分の件数を、同じ数え方（推定の HS は未登録）にそろえる
   ② 足りない項目（必須を含む）を入れる入口が無い（indagri-14）→ 区分の行（「基本情報 一部未入力（2）」）を押すと入れる窓が開く。
      「登録の項目で未登録 N件：…」と「足りない項目を入れる」のボタンを出す。右上の「次は」も、必須が足りない間は「必須の項目を入れる」に
   ③ 商材カテゴリーを、上のカードの札の横で選び直せるようにする（other-02）
   ④ 「未登録の項目へ」は任意の項目へ移るボタンなので、「任意の項目へ」と書く */
(function () {
  "use strict";
  const RD = window.RDX;
  if (!RD || RD._v92item) return;
  RD._v92item = 1;
  const { $, $$, esc, I } = RD;
  const call = (n) => { try { return typeof window[n] === "function" ? window[n]() : null; } catch (e) { return null; } };
  const lang = () => { try { const v = String((document.getElementById("lang") || {}).value || "ja"); return /^en/.test(v) ? "en" : /^zh/.test(v) ? "zh" : /^es/.test(v) ? "es" : "ja"; } catch (e) { return "ja"; } };
  const M = (ja, en, zh, es) => { const l = lang(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
  const GROUPS = [["基本情報", ["co", "coEn", "item", "itemEn", "cat", "sku", "hs", "origin", "targets"]], ["価格・取引条件", ["priceRows", "moq", "term", "pay", "lead", "pol"]], ["成分・仕様", ["compRows", "dimRows", "shelf", "ctn", "cert"]], ["強み", ["strengths"]]];

  function fixItem(w) {
    const box = $(".rd-x.rd-p2", w);
    const ring = box && $(".k-ring", box);
    if (!ring || ring.dataset.v92i) return;
    const miss = call("v92itemMiss");
    if (!Array.isArray(miss)) return;
    ring.dataset.v92i = "1";
    const pct = call("v92itemPct");
    const col = ring.closest("div[style*='border-left']") || ring.parentElement.parentElement;
    const missK = miss.map((x) => x.k);
    const req = miss.filter((x) => x.req);
    const pend = !!call("v92itemPending"); // 読み取った内容が未反映の間は、先に「すべて登録する」
    /* ① 円・札・区分の件数 */
    if (pct != null) {
      ring.style.setProperty("--p", String(pct));
      const sp = $("span", ring);
      if (sp) sp.innerHTML = esc(pct) + "<small>%</small>";
      const tg = $$(".k-tag", box).find((x) => /^(登録済み|登録中)$/.test((x.textContent || "").trim()));
      if (tg) { const done = !miss.length; tg.className = "k-tag " + (done ? "gr" : "or"); tg.innerHTML = I("check", 13, 3) + (done ? "登録済み" : "登録中"); }
    }
    const ul = col && $(".k-ck", col);
    if (ul) {
      $$("li", ul).forEach((li) => {
        const nm = ($$("span", li)[1] || {}).textContent || "";
        const g = GROUPS.find((x) => x[0] === nm.trim());
        if (!g) return;
        const ng = g[1].filter((k) => missK.indexOf(k) >= 0);
        const names = miss.filter((x) => ng.indexOf(x.k) >= 0).map((x) => x.n);
        li.innerHTML = `<span class="${ng.length ? "ng" : "ok"}">${I(ng.length ? "alert" : "check", 16, 2.6)}</span><span class="k-v92inm" style="flex:1">${esc(g[0])}</span><b class="k-v92ist"${ng.length ? " data-noi18n" : ""} style="font-size:13px;color:${ng.length ? "#D25F00" : "var(--k-gr)"}">${ng.length ? `${esc(M(`未入力 ${ng.length}件`, `${ng.length} missing`, `未填 ${ng.length} 项`, `Faltan ${ng.length}`))}${pend ? "" : `<span class="k-v92ichev">${I("chevR", 13, 2.8)}</span>`}` : "入力済み"}</b>`;
        if (ng.length && !pend) {
          li.classList.add("k-v92ili");
          li.setAttribute("role", "button");
          li.setAttribute("tabindex", "0");
          li.setAttribute("data-v92iact", "fill");
          li.setAttribute("data-keys", ng.join(","));
          li.setAttribute("title", M("押すと、足りない項目（" + names.join("・") + "）を入れる窓が開きます", "Press to fill in: " + names.join(", "), "点击填写：" + names.join("・"), "Pulse para completar: " + names.join(", ")));
          li.setAttribute("aria-label", M(g[0] + "：一部未入力 " + ng.length + "件（" + names.join("・") + "）。押すと入れる窓が開きます", ng.length + " missing (" + names.join(", ") + "). Press to fill in", ng.length + " 项未填（" + names.join("・") + "）。点击填写", "Faltan " + ng.length + " (" + names.join(", ") + "). Pulse para completar"));
          li.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); li.click(); } });
        }
      });
    }
    /* ② 登録の項目で未登録のもの＋入れるボタン */
    if (col && pend && !$(".k-v92imiss", col)) {
      const n = document.createElement("div");
      n.className = "k-v92imiss";
      n.setAttribute("role", "note");
      n.setAttribute("data-noi18n", "");
      n.innerHTML = `<p>${I("alert", 15, 2.4)}<span>${esc(M("資料から読み取った内容が、まだ反映されていません。先に「すべて登録する」を押すと、読み取った価格表などが入ります。", "What was read from your file is not applied yet. Press “Register all” first to apply the price list and other items.", "从资料读取的内容尚未反映。请先点击“全部登记”。", "Lo leído del archivo aún no se ha aplicado. Pulse primero «Registrar todo»."))}</span></p><button type="button" class="k-btn k-mini" data-v92ipend="1">${I("chevR", 14, 2.6)}${esc(M("未反映の内容へ", "Go to the pending items", "前往未反映的内容", "Ir a lo pendiente"))}</button>`;
      const opt = $(".k-v90opt", col);
      if (opt) col.insertBefore(n, opt); else col.appendChild(n);
      const pb = $("[data-v92ipend]", n);
      if (pb) pb.addEventListener("click", (e) => { e.preventDefault(); const el = document.getElementById("v188pend"); if (el) { try { el.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (x) { el.scrollIntoView(); } el.style.boxShadow = "0 0 0 3px #F57C0F"; setTimeout(() => { el.style.boxShadow = ""; }, 2200); } });
    } else if (col && miss.length && !$(".k-v92imiss", col)) {
      const n = document.createElement("div");
      n.className = "k-v92imiss";
      n.setAttribute("role", "note");
      n.setAttribute("data-noi18n", "");
      const shown = miss.slice(0, 6).map((x) => esc(x.n) + (x.req ? `<small class="k-v92irq">${esc(M("必須", "required", "必填", "obligatorio"))}</small>` : "")).join(M("・", ", ", "・", ", "));
      n.innerHTML = `<p>${I("alert", 15, 2.4)}<span><b>${esc(M(`登録の項目で未登録 ${miss.length}件`, `${miss.length} registration item(s) missing`, `登记项目中有 ${miss.length} 项未填`, `Faltan ${miss.length} campos de registro`))}</b>${req.length ? esc(M(`（うち必須 ${req.length}件）`, ` (${req.length} required)`, `（其中必填 ${req.length} 项）`, ` (${req.length} obligatorios)`)) : ""}${M("：", ": ", "：", ": ")}${shown}${miss.length > 6 ? esc(M(` ほか${miss.length - 6}件`, ` +${miss.length - 6}`, ` 等${miss.length - 6}项`, ` +${miss.length - 6}`)) : ""}</span></p><button type="button" class="k-btn k-mini" data-v92iact="fill">${I("edit", 14)}${esc(M("足りない項目を入れる", "Fill in missing items", "填写缺少的项目", "Completar lo que falta"))}</button>`;
      const opt = $(".k-v90opt", col);
      if (opt) col.insertBefore(n, opt); else col.appendChild(n);
    }
    /* ④ 任意の項目へ */
    const ob = $("[data-v90opt]", col || box);
    if (ob && !ob.dataset.v92i) {
      ob.dataset.v92i = "1";
      const tn = Array.from(ob.childNodes).reverse().find((x) => x.nodeType === 3 && (x.nodeValue || "").trim());
      const lb = M("任意の項目へ", "Go to optional items", "前往可选项目", "Ir a campos opcionales");
      if (tn) tn.nodeValue = lb;
      ob.setAttribute("data-noi18n", "");
      ob.setAttribute("data-kfull", lb);
    }
    /* ③ 商材カテゴリーを選び直す */
    const chips = $(".k-chips", box);
    if (chips && !$("[data-v92iact='cat']", chips)) {
      const cat = $$(".k-tag.gr", chips).find((x) => !/^(登録済み|登録中)$/.test((x.textContent || "").trim()));
      const b = document.createElement("button");
      b.type = "button";
      b.className = "k-v92icatb";
      b.setAttribute("data-v92iact", "cat");
      b.setAttribute("data-noi18n", "");
      b.setAttribute("title", M("商材カテゴリーを選び直す（規制の調べ方・業種ごとの項目に使います）", "Change the product category (used for regulation research and industry-specific fields)", "重新选择商品类别", "Cambiar la categoría del producto"));
      b.innerHTML = I("edit", 12) + esc(cat ? M("変える", "Change", "更改", "Cambiar") : M("商材カテゴリーを選ぶ", "Choose a category", "选择商品类别", "Elegir categoría"));
      if (cat) cat.after(b); else chips.prepend(b);
    }
    /* ② 右上の「次は」：必須が足りない間は、先に入れる */
    const nb = $("[data-rdhero] .k-next", w);
    if (nb && req.length && !pend && !nb.dataset.v92i) {
      nb.dataset.v92i = "1";
      nb.removeAttribute("data-kbc");
      nb.setAttribute("data-v92iact", "fill");
      nb.setAttribute("data-keys", req.map((x) => x.k).join(","));
      nb.setAttribute("title", M("必須の項目（" + req.map((x) => x.n).join("・") + "）を入れてから、販売先国を選ぶと進めやすくなります", "Fill in the required items first (" + req.map((x) => x.n).join(", ") + "), then choose destination countries", "请先填写必填项目（" + req.map((x) => x.n).join("・") + "）", "Complete primero los campos obligatorios (" + req.map((x) => x.n).join(", ") + ")"));
      const bb = $("b", nb);
      if (bb) { bb.textContent = M("必須の項目を入れる（あと" + req.length + "件）", "Fill in required items (" + req.length + " left)", "填写必填项目（还剩" + req.length + "项）", "Completar obligatorios (faltan " + req.length + ")"); bb.setAttribute("data-noi18n", ""); }
    }
  }

  function apply() {
    if (RD.locked && RD.locked()) return;
    const w = $("#well");
    if (!w) return;
    if (RD.curKey() === "item") fixItem(w);
  }
  const prev = RD.after;
  RD.after = function () {
    const r = prev.apply(this, arguments);
    try { apply(); } catch (e) { console.error("[rd v92item]", e); }
    return r;
  };
  try { apply(); } catch (e) { /* 最初の描画の前 */ }
})();
