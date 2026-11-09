/* ═══ 21.85 R04（ニコラさんの 11/6 のレビュー）＋ 11/8 の再レビュー（R04-N8-01・R04-N8-02・送信元の結びつけ）：メールの送信の状態を、同期サーバーの答えどおりに出す ═══
   前（21.82〜21.85.1）：30 秒で待つのをやめ、ok でない答えはどれも「❌ 送信失敗」。送れたか分からないときの文言は「10分」。送信の番号（idem）を送っていなかった。
   ・送信の番号：会社・画面のスレッド（dmThreads の id。サーバーが付け替える返信の鍵ではない）・宛先・CC・件名・本文から作る（"bc-"＋SHA-256 の先頭40桁）。
     同じ送信の確かめ直し・二重押し・鍵の付け替えの後の同じ文面は同じ番号＝サーバーが二重には送らない（R04-N8-02）。
     メッセージに m.idem として残す（読み込み直しても同じ番号）。最初に送った時の鍵 m.v2185ok と、サーバーが決めた鍵（スレッドの th.key）を残す
   ・状態：sent（送信済。前の送信で送れていた＝dup かつ dst:"sent" も）／checking（応答が遅いので同じ番号で確かめ中）／
     unknown（送れたか確かめられない＝届いた場合もある。新しい版のサーバーは24時間、v42 は10分、同じメールを送り直せない）／failed（送る前に止まった＝送っていない）
   ・待ち時間は 60 秒。それでも答えが無い・通信が切れた・サーバーの例外は、同じ番号で確かめる。確かめる時刻は「最初に送った時刻」からの絶対の時刻
     （+10 秒・+40 秒・+2 分・+5 分）で、前の答えから少なくとも 10 秒あける（サーバーでまだ処理中の最初の送信を待つ）。遅れて動いたタイマー（スリープ）・
     読み込み直しの後でも、送る直前に毎回「最初に送った時刻から 6 分以内」かを確かめ、過ぎていれば送らずに「未確認」にする
     （v42 の同じ番号の枠 10 分より前に、どの確かめも届く。R04-N8-01）。前の確かめの答えを待った時間も含む
   ・送信元の結びつけ：最初に送った時のアカウント m.v2185k を残す。確かめ直す・読み込み直して再開するときは、そのアカウントで、同じスレッドに残っている
     メッセージのときだけ送る。今のアカウントが違えば送らず、画面も書き換えない（古いタイマーが新しく選んだアカウントやスレッドを書き換えない）。
     同期で画面のデータが読み直されても、メッセージの固有の番号 m.v2185id で同じメッセージを探して続ける
   ・確かめの答え：ok＝最初の送信はサーバーに届いていなかった→今送れた／dup＋dst:"sent"＝前の送信で送れていた／
     unknown（サーバーも送れたか分からない）・v42 の dup（届いたかを返さない）＝すぐ未確認（もう聞いても同じ）／
     held（最初の送信がまだ処理中か分からない）・送る前に断られた（store など）・通信の失敗＝次の時刻にもう一度（6 分の内だけ）
   ・読み込み直しの直後でアカウントがまだ決まっていない（SYNC.kid が空）ときは、送らずに 2 秒ずつ待つ（6 分の内だけ）。別のアカウントなら何もしない
   ・11/9 の再レビュー（R04-N9-01）：最初の送信の答えを、本体の bmSend の古い then／catch に渡さない（答えの来ない約束を返す）。
     本体の古い処理が、取り込んだ古いメッセージを書き換えたり、ページを離れる時の通信の中断を「未送信」と保存したりしないため。
     答えはこの層だけが受け、今の画面のメッセージ（v2185id で探す）に当てる（成功・送る前に断られた・答えが無い）。
     最初の送信の間は、受け付けた時に送信元・最初の時刻・番号つきで「送信中」を保存しておく。読み込み直した後に「送信中」が残っていれば、
     このページで送っている途中のもの（V2185M.fly）でない限り、結果が分からない最初の送信として、同じ番号・同じ期限で確かめ直す（期限を過ぎていれば未確認）。
     番号を作る前に止まった（番号が無い）ものは、サーバーに出ていないので「未送信」。期限（6 分）を過ぎた「確認中」は、タイマーが動いていなくても未確認と出す
   ・11/9 23:23 の再レビュー（R04-N9-02・H07）：番号（idem）を入れた保存が、ブラウザの保存先（localStorage の bc20_ten_）に本当に残ったかを、
     送る前に読み直して確かめる（v2185mKept：同じ v2185id のメッセージに同じ番号・送信元・最初の時刻があること）。確かめられなければ送らない
     （サーバーに出さず「未送信」と理由。新しい番号は作らず、自動で送り直さない）。これで「番号の無い送信中」が保存に残るのは、本当に送っていないときだけになり、
     読み込み直した後の「未送信」が正しくなる。保存の対象でない商品（saveTen が残さない src）のメッセージは、保存に何も残らず取り違えようがないので確かめない
   ・ほかの層の bmSend・syncCall・bmChip の上に重ねる（最後の層）。DOM のハンドラは足さない（21.84 の CSP のまま） */
const V2185M = { ctx: null, live: {}, fly: {}, cap: 0, inner: null };
const V2185M_TIMEOUT = 60000, V2185M_CHECK = [10000, 40000, 120000, 300000], V2185M_SAFE_MS = 6 * 60000;
const V2185M_T = {
    sent2: { ja: "このメールは前の送信で送れています（二重には送っていません）。", en: "This email was already sent by the earlier attempt (it was not sent twice).",
        zh: "此邮件已在先前的发送中发出（没有重复发送）。", es: "Este correo ya se envió en el intento anterior (no se envió dos veces)." },
    chk: { ja: "応答が遅れているため、同じ送信の番号で結果を確かめています（二重には送りません）。", en: "The reply is slow, so we are checking the result with the same send ID (it will not be sent twice).",
        zh: "响应较慢，正在用同一发送编号确认结果（不会重复发送）。", es: "La respuesta tarda; estamos comprobando el resultado con el mismo identificador de envío (no se enviará dos veces)." },
    unk24: { ja: "送れたかどうか確かめられませんでした。届いている場合もあります。24時間は同じメールを送り直せません。相手に届いていないことを確かめてから、文面を少し変えて送ってください。",
        en: "We couldn't confirm whether the email was sent; it may have arrived. The same email can't be resent for 24 hours. Check that the recipient did not get it, then send it with slightly changed wording.",
        zh: "无法确认邮件是否已发出，对方可能已经收到。24小时内不能重发同样的邮件。请先确认对方没有收到，再稍微修改文字后发送。",
        es: "No pudimos confirmar si el correo se envió; puede que haya llegado. No se puede reenviar el mismo correo durante 24 horas. Compruebe que no lo recibió y envíelo con un texto ligeramente distinto." },
    unk10: { ja: "送れたかどうか確かめられませんでした。届いている場合もあります。同じメールは10分ほど送り直せません。相手に届いていないことを確かめてから送り直してください。",
        en: "We couldn't confirm whether the email was sent; it may have arrived. The same email can't be resent for about 10 minutes. Check that the recipient did not get it before sending it again.",
        zh: "无法确认邮件是否已发出，对方可能已经收到。同样的邮件约10分钟内不能重发。请先确认对方没有收到，再重新发送。",
        es: "No pudimos confirmar si el correo se envió; puede que haya llegado. No se puede reenviar el mismo correo durante unos 10 minutos. Compruebe que no lo recibió antes de volver a enviarlo." },
    dup10: { ja: "同じ内容のメールを少し前に送っています（届いたかは、この画面では確かめられません）。届いていないことを確かめてから、10分ほどたって送り直してください。",
        en: "An email with the same content was sent a moment ago (this screen can't confirm whether it arrived). Check that it did not arrive, then send it again after about 10 minutes.",
        zh: "刚才已发送过内容相同的邮件（此画面无法确认是否送达）。请确认对方没有收到后，约10分钟后再发送。",
        es: "Hace un momento se envió un correo con el mismo contenido (esta pantalla no puede confirmar si llegó). Compruebe que no llegó y vuelva a enviarlo en unos 10 minutos." },
    notSent: { ja: "送っていません。", en: "Not sent.", zh: "未发送。", es: "No enviado." },
    noKeep: { ja: "送っていません。この端末のブラウザに送信の記録（送信の番号）を保存できませんでした。保存容量を空けて（不要な商品・添付を整理して）から、もう一度送ってください。",
        en: "Not sent. This browser could not save the send record (send ID). Free up storage (remove unneeded products or attachments), then send again.",
        zh: "未发送。此浏览器无法保存发送记录（发送编号）。请腾出存储空间（整理不需要的商品或附件）后再发送。",
        es: "No enviado. Este navegador no pudo guardar el registro de envío (ID de envío). Libere espacio (elimine productos o adjuntos innecesarios) y vuelva a enviarlo." },
    cSent: { ja: "送信済", en: "Sent", zh: "已发送", es: "Enviado" },
    cChk: { ja: "送信を確認中", en: "Checking delivery", zh: "正在确认发送", es: "Comprobando el envío" },
    cUnk: { ja: "送れたか未確認", en: "Delivery unconfirmed", zh: "未确认是否发出", es: "Envío sin confirmar" },
    cFail: { ja: "送れませんでした（未送信）", en: "Not sent", zh: "未发送", es: "No enviado" }
};
function v2185mL(o) { try { if (typeof v81appL === "function") return v81appL(o); } catch (e) { } return o.ja; }
function v2185mE(s) { try { if (typeof esc === "function") return esc(s); } catch (e) { } return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
/* 送信の番号：会社・画面のスレッド・宛先・CC・件名・本文。画面のスレッドが分からない呼び出し（bmSend 以外）だけ、鍵で代える */
async function v2185mIdem(b, tid) {
    const s = ["bc2185n8", String(b.kid || ""), tid ? "t:" + String(tid) : "k:" + String(b.key || ""), String(b.to || "").toLowerCase(), String(b.cc || "").toLowerCase(), String(b.subject || ""), String(b.body || "")].join("\u0001");
    try {
        const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
        return "bc-" + Array.from(new Uint8Array(d)).slice(0, 20).map(x => x.toString(16).padStart(2, "0")).join("");
    }
    catch (e) {
        let h1 = 0x811c9dc5, h2 = 0x1b873593;
        for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 16777619) >>> 0; h2 = Math.imul(h2 ^ c, 2246822507) >>> 0; }
        return "bc-" + h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0");
    }
}
/* 答えの分け方（sent・sent2・unknown・dup10・failed）。新しい版のサーバーは dst を返す・v42 は返さない */
function v2185mKind(r) {
    if (!r || typeof r !== "object") return "unknown";
    if (r.ok) return "sent";
    const k = String(r.reason || ""), d = String(r.dst || "");
    if (d) V2185M.cap = 1;
    if (k === "dup") return d === "sent" ? "sent2" : (d ? "unknown" : "dup10");
    if (k === "held") return "unknown";
    if (k === "unknown" && (d || r.rel)) return "unknown";   /* 送れたか分からない（台帳にないアカウントの "unknown" は rel も dst も無い＝送る前に止まった） */
    return "failed";
}
function v2185mUnkText(r) { return v2185mL((r && (r.dst || r.reason === "held")) || V2185M.cap ? V2185M_T.unk24 : V2185M_T.unk10); }
/* 送信元の結びつけ：このメッセージを最初に送ったアカウントが今のアカウントで、今の画面のそのスレッドにまだあるか */
function v2185mKidNow() { try { return (typeof SYNC !== "undefined" && SYNC) ? String(SYNC.kid || "") : ""; } catch (e) { return ""; } }
/* 今の画面のそのメッセージ（同期で読み直されて別の物になっていても、送信元と固有の番号 v2185id で同じメッセージを探す）。別のアカウント・見つからない＝null */
function v2185mCur(m) {
    try {
        const k = v2185mKidNow();
        if (!m || !m.v2185k || !k || k !== m.v2185k) return null;
        const th = (typeof dmThreads === "function" ? dmThreads() : {})[m.v2185th];
        if (!th || !Array.isArray(th.msgs)) return null;
        if (th.msgs.indexOf(m) >= 0) return m;
        if (!m.v2185id) return null;
        for (const x of th.msgs) { if (x && x.v2185id === m.v2185id && x.v2185k === m.v2185k && x.idem === m.idem) return x; }
        return null;
    }
    catch (e) { return null; }
}
function v2185mSame(m) { return !!v2185mCur(m); }
/* R04-N9-02：番号（idem）を入れた保存が、ブラウザの保存先に本当に残ったか（読み直して確かめる）。保存の対象でない商品のメッセージは確かめない（何も残らない） */
function v2185mOwner(m) {
    try {
        const L = (typeof TENS !== "undefined" && Array.isArray(TENS)) ? TENS.slice() : [];
        if (typeof TEN !== "undefined" && TEN && L.indexOf(TEN) < 0) L.push(TEN);
        for (const t of L) { const th = t && t.dmThreads && t.dmThreads[m.v2185th]; if (th && Array.isArray(th.msgs) && th.msgs.indexOf(m) >= 0) return t; }
    }
    catch (e) { }
    return null;
}
function v2185mKept(m) {
    try {
        if (!m || !m.idem || !m.v2185id || !m.v2185th) return false;
        const ses = (typeof SES !== "undefined") ? SES : null;
        const raw = (ses && ses.code) ? localStorage.getItem("bc20_ten_" + ses.code) : null;
        const t = v2185mOwner(m);
        const need = !!(ses && ses.t === "trial" && ((t && (t.src === "upload" || t.src === "sample2")) || (raw && raw.indexOf(m.v2185id) >= 0)));
        if (!need) return true;
        if (!raw || raw.indexOf(m.idem) < 0 || raw.indexOf(m.v2185id) < 0) return false;
        const j = JSON.parse(raw);
        for (const s of (j && Array.isArray(j.list)) ? j.list : []) {
            const th = s && s.dmThreads && s.dmThreads[m.v2185th];
            for (const x of (th && Array.isArray(th.msgs)) ? th.msgs : []) {
                if (x && x.v2185id === m.v2185id) return x.idem === m.idem && x.v2185k === m.v2185k && +x.v2185t0 === +m.v2185t0;
            }
        }
        return false;
    }
    catch (e) { return false; }
}
/* 確かめられない：送らない（サーバーに出さない）。新しい番号は作らず、自動で送り直さない */
function v2185mNoKeep(id, m) {
    try { if (m && m.v2185id) delete V2185M.fly[m.v2185id]; } catch (e) { }
    const t = v2185mL(V2185M_T.noKeep), cm = v2185mCur(m);
    if (cm) { v2185mSet(id, cm, "failed", t, "❌ " + t); return; }
    try { m.st = "failed"; m.err = t; } catch (e) { }   /* アカウント・スレッドが変わった：今の画面は書き換えない（同じアカウントなら描き直して、残った「送信中」を未送信と出す） */
    try { if (v2185mKidNow() && v2185mKidNow() === m.v2185k && typeof bmRefresh === "function") bmRefresh(id); } catch (e) { }
}
/* 最初に送った時刻からの絶対の時刻と、送ってよい残りの時間 */
function v2185mDue(m, att) { return (+m.v2185t0 || 0) + V2185M_CHECK[att]; }
function v2185mLeft(m) { return (+m.v2185t0 || 0) + V2185M_SAFE_MS - Date.now(); }
function v2185mSet(id, m, st, err, msg) {
    try {
        m.st = st;
        if (err != null) m.err = err;
        if (typeof saveTen === "function") saveTen();
    }
    catch (e) { }
    try { if (typeof bmRefresh === "function") bmRefresh(id); } catch (e) { }
    try { if (typeof cur !== "undefined" && cur === "db" && typeof rDB === "function") rDB(); } catch (e) { }
    try { if (msg && typeof toast === "function") toast(msg); } catch (e) { }
}
function v2185mUnk(id, m, last) { const t = v2185mUnkText(last); v2185mSet(id, m, "unknown", t, "⚠ " + t); }
function v2185mSent(id, m, r, dupOk) {
    const okMsg = (r && r.from) ? "送信しました（中継：" + r.from + "）" : "送信しました";
    try {
        const th = (typeof dmThreads === "function" ? dmThreads() : {})[id];
        m.real = 1;
        if (dupOk) m.dupOk = 1;
        if (th) { th.real = 1; if (r && r.key) { th.key = r.key; m.v2185ck = r.key; } }   /* サーバーが決めた鍵（付け替えの後）。番号は画面のスレッドから作るので変わらない */
        if (r && r.at) m.at = r.at;
    }
    catch (e) { }
    v2185mSet(id, m, "sent", "", "✉ " + (dupOk ? v2185mL(V2185M_T.sent2) : (typeof v30T === "function" ? v30T(okMsg) : okMsg)));
}
/* 最初の送信の答え（R04-N9-01：本体の古い then／catch には渡さないので、成功・断られた・答えが無い、をこの層が今のメッセージに当てる） */
function v2185mAfter(id, m, req, r, err) {
    try {
        if (m && m.v2185id) delete V2185M.fly[m.v2185id];
        const cm = v2185mCur(m); if (!cm) return;   /* 答えを待つ間にアカウント・スレッドが変わった・消えた：今の画面を書き換えない */
        m = cm;
        if (m.st !== "sending") return;   /* ほかの道ですでに決まった */
        if (err) { v2185mSet(id, m, "checking", v2185mL(V2185M_T.chk), "⏳ " + v2185mL(V2185M_T.chk)); v2185mCheck(id, m, req, 0, null, Date.now()); return; }
        const k = v2185mKind(r);
        if (k === "sent") { v2185mSent(id, m, r, false); return; }
        if (k === "sent2") { v2185mSent(id, m, r, true); return; }
        if (k === "unknown") { v2185mUnk(id, m, r); return; }
        if (k === "dup10") { const t = v2185mL(V2185M_T.dup10); v2185mSet(id, m, "unknown", t, "⚠ " + t); return; }
        /* failed：送る前に断られた＝送っていない（本体と同じ文言） */
        const t = (r && r.msg) || "送信できませんでした";
        v2185mSet(id, m, "failed", t, "❌ " + t);
    }
    catch (e) { }
}
/* 同じ番号で確かめる。att＝次の確かめの番号（最初に送った時刻 + V2185M_CHECK[att] と、前の答え prevAt + V2185M_CHECK[0] の遅い方に動く）。
   送る直前に、結びつけと残りの時間を毎回確かめる */
function v2185mCheck(id, m, req, att, last, prevAt) {
    if (!m || !m.idem) return;
    if (!m.v2185t0 || !m.v2185k || att >= V2185M_CHECK.length || v2185mLeft(m) <= 0) {
        delete V2185M.live[m.idem];
        const cm = v2185mCur(m);
        if (cm && cm.st === "checking") v2185mUnk(id, cm, last);
        return;
    }
    V2185M.live[m.idem] = 1;
    const due = Math.max(v2185mDue(m, att), (+prevAt || 0) + V2185M_CHECK[0]);
    const run = async () => {
        if (!v2185mKidNow()) { if (v2185mLeft(m) > 0) setTimeout(run, 2000); else delete V2185M.live[m.idem]; return; }   /* 読み込み直しの直後：アカウントが決まるまで送らずに待つ */
        let cm = v2185mCur(m);
        if (!cm) { delete V2185M.live[m.idem]; return; }   /* 送信元の結びつけ：別のアカウント・別のスレッドでは送らない（画面も書き換えない） */
        m = cm;
        if (m.st !== "checking") { delete V2185M.live[m.idem]; return; }   /* ほかの道ですでに決まった */
        if (v2185mLeft(m) <= 0) { delete V2185M.live[m.idem]; v2185mUnk(id, m, last); return; }   /* R04-N8-01：遅れて動いた＝送らずに未確認 */
        let r = null, err = null;
        try { r = await V2185M.inner.call(null, "mail_send", Object.assign({}, req, { kid: m.v2185k, idem: m.idem }), { timeout: V2185M_TIMEOUT }); }
        catch (e) { err = e; }
        cm = v2185mCur(m);
        if (!cm) { delete V2185M.live[m.idem]; return; }
        m = cm;
        const k = err ? "retry" : v2185mKind(r);
        if (k === "sent") { delete V2185M.live[m.idem]; v2185mSent(id, m, r, false); return; }
        if (k === "sent2") { delete V2185M.live[m.idem]; v2185mSent(id, m, r, true); return; }
        if (k === "dup10" || (k === "unknown" && String((r && r.reason) || "") === "unknown")) { delete V2185M.live[m.idem]; v2185mUnk(id, m, r); return; }   /* サーバーも分からない・v42 は答えない：もう聞いても同じ */
        let nx = att + 1;
        while (nx < V2185M_CHECK.length - 1 && v2185mDue(m, nx) <= Date.now()) nx++;   /* 遅れたタイマーで過ぎた時刻の分を続けて送らない */
        v2185mCheck(id, m, req, nx, err ? last : r, Date.now());
    };
    setTimeout(run, Math.max(0, due - Date.now()));
}
/* 読み込み直した後の「確認中」：最初に送ったアカウントのときだけ、残りの時間の中で確かめ直す（外なら未確認にする） */
function v2185mResume(m) {
    try {
        if (!m || !m.v2185th) return;
        if (m.st === "sending") {   /* R04-N9-01：読み込み直しで残った最初の送信 */
            if (m.v2185id && V2185M.fly[m.v2185id]) return;   /* このページで答えを待っている */
            const k = v2185mKidNow();
            if (m.v2185k && k && k !== m.v2185k) return;   /* 別のアカウント：触らない */
            if (!m.idem) { m.st = "failed"; m.err = v2185mL(V2185M_T.notSent); try { if (typeof saveTen === "function") saveTen(); } catch (e) { } return; }   /* 番号を作る前に止まった＝サーバーに出ていない */
            m.st = "checking"; m.err = v2185mL(V2185M_T.chk);
            try { if (typeof saveTen === "function") saveTen(); } catch (e) { }
        }
        if (!m.idem) return;
        if (m.st === "checking" && V2185M.live[m.idem] && m.v2185k && !(v2185mLeft(m) > 0)) { const k = v2185mKidNow(); if (!k || k === m.v2185k) { m.st = "unknown"; m.err = v2185mUnkText(null); } return; }   /* 期限を過ぎた：もう送らない（動いていないタイマーを待たない） */
        if (V2185M.live[m.idem]) return;
        if (!m.v2185k || !m.v2185t0 || !(v2185mLeft(m) > 0)) { if (!m.v2185k || !v2185mKidNow() || v2185mSame(m)) { m.st = "unknown"; m.err = v2185mUnkText(null); } return; }   /* 過ぎた：送らずに未確認（別のアカウントのときだけ触らない） */
        const id = m.v2185th, th = (typeof dmThreads === "function" ? dmThreads() : {})[id];
        if (!th) return;
        const req = Object.assign({ kid: m.v2185k, subject: m.subj || "", body: String(m.body || ""), key: th.key || m.v2185ck || m.key, idem: m.idem }, m.v2185rq || {});
        let att = 0;
        while (att < V2185M_CHECK.length - 1 && v2185mDue(m, att) <= Date.now()) att++;
        V2185M.live[m.idem] = 1;
        setTimeout(() => v2185mCheck(id, m, req, att, null, 0), 0);
    }
    catch (e) { }
}
if (typeof syncCall === "function") {
    const __sc2185 = syncCall;
    V2185M.inner = __sc2185;
    syncCall = function (op, body, opt) {
        if (op !== "mail_send") {
            if (op !== "ping") return __sc2185.apply(this, arguments);
            return Promise.resolve(__sc2185.apply(this, arguments)).then(r => { try { if (r && typeof r === "object" && (r.secm || r.secn || r.secp)) V2185M.cap = 1; } catch (e) { } return r; });
        }
        const self = this, ctx = V2185M.ctx;
        let m = null, id = null;
        try {
            if (ctx) {
                id = ctx.id;
                const th = (typeof dmThreads === "function" ? dmThreads() : {})[id];
                const L = (th && th.msgs) || [];
                for (let i = L.length - 1; i >= 0; i--) { const x = L[i]; if (x && x.w === "me" && x.st === "sending" && !x.v2185th) { m = x; break; } }
            }
        }
        catch (e) { m = null; }
        const b = Object.assign({}, body || {});
        if (m) {   /* 受け付けた時に、送信元・最初の時刻・最初の鍵を同期で残す（読み込み直し・アカウントの切り替えの前に） */
            m.v2185th = id; m.v2185k = String(b.kid || ""); m.v2185t0 = m.v2185t0 || Date.now(); m.v2185ok = m.v2185ok || String(b.key || "");
            m.v2185id = m.v2185id || (Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10));
            m.v2185rq = { to: b.to, cc: b.cc, name: b.name };
            V2185M.fly[m.v2185id] = 1;
        }
        return (async () => {
            try { if (!b.idem) b.idem = (m && m.idem) || await v2185mIdem(b, m ? id : ""); } catch (e) { }
            if (m) {
                m.idem = b.idem; try { if (typeof saveTen === "function") saveTen(); } catch (e) { }
                if (!v2185mKept(m)) { v2185mNoKeep(id, m); return new Promise(() => { }); }   /* R04-N9-02：番号の保存を確かめられなければ送らない */
            }
            const o = Object.assign({}, opt || {}, { timeout: Math.max(+((opt || {}).timeout) || 0, V2185M_TIMEOUT) });
            let r = null, err = null;
            try { r = await __sc2185.call(self, op, b, o); }
            catch (e) { err = e; }
            if (m) { v2185mAfter(id, m, b, r, err); return new Promise(() => { }); }   /* R04-N9-01：本体の古い then／catch には答えを渡さない */
            if (err) throw err;
            return r;
        })();
    };
}
if (typeof bmSend === "function") {
    const __bs2185 = bmSend;
    bmSend = function (id) { const prev = V2185M.ctx; V2185M.ctx = { id }; try { return __bs2185.apply(this, arguments); } finally { V2185M.ctx = prev; } };
}
if (typeof bmChip === "function") {
    const __ch2185 = bmChip;
    bmChip = function (m) {
        try {
            if (m && m.w === "me" && !m.v83 && m.v79how !== "form") {
                if (m.st === "sending" && m.v2185th) v2185mResume(m);
                if (m.st === "checking") { v2185mResume(m); if (m.st === "checking") return `<span class="p mid" title="${v2185mE(m.err || v2185mL(V2185M_T.chk))}">⏳ ${v2185mE(v2185mL(V2185M_T.cChk))}</span>`; }
                if (m.st === "unknown") return `<span class="p no" title="${v2185mE(m.err || v2185mUnkText(null))}">⚠ ${v2185mE(v2185mL(V2185M_T.cUnk))}</span>`;
                if (m.st === "failed") return `<span class="p no" title="${v2185mE(v2185mL(V2185M_T.notSent) + (m.err ? " " + m.err : ""))}">❌ ${v2185mE(v2185mL(V2185M_T.cFail))}</span>`;
                if (m.st === "sent" && m.dupOk) return `<span class="p hi" title="${v2185mE(v2185mL(V2185M_T.sent2))}">✅ ${v2185mE(v2185mL(V2185M_T.cSent))}</span>`;
            }
        }
        catch (e) { }
        return __ch2185.apply(this, arguments);
    };
}
