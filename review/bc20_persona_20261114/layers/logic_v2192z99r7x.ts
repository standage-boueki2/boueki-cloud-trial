/* 21.92 r7x：7巡目の直し3本（r7a・r7b・r7c）を全部重ねた版の確かめで見つけた、組み合わせの残り（英・中・西の画面だけ。日本語の画面は変えない）
   ① 商談の記録を保存した後の「AI商社マンから」の助言のうち、状況が「見積提示」「失注」・反応「高」のときの文と、「失注」の欄の名前・理由が空のときの知らせが日本語のまま
      （r7c は「商談中」の記録の道だけを訳した。r7a の道＝2件目の記録を「見積提示」「受注」で入れる と重なると出る）。→ 辞書に訳を足すだけ。
   ② 商談を記録した知らせ「✓ Meeting recorded (Meridian Medical Supply（見本）). …」の中の（見本）
      （r7b が、打った名前を登録済みの見本の相手「…（見本）」にまとめる。r7c の訳は、名前だけの行に当たる形で、知らせの文の途中には当たらない）。
      → 知らせ（toast）の文の中の「英数字の名前（見本）」を、r7c と同じ言葉（ (sample)／（示例）／ (muestra)）にする。
   今の関数の中身は変えない（toast を包むだけ）。 */
declare const I18N: any;
declare let toast: any;
(function () {
    const W: any = window;
    if (W.__v2192r7x) return;
    W.__v2192r7x = 1;
    try {
        if (typeof I18N === "undefined" || !I18N || !I18N.dict) return;
        const DI: any = I18N.dict;
        ["en", "zh", "es"].forEach((l) => { if (!DI[l]) DI[l] = {}; });
        const TR = (ja: string, en: string, zh: string, es: string) => { if (DI.en[ja] == null) DI.en[ja] = en; if (DI.zh[ja] == null) DI.zh[ja] = zh; if (DI.es[ja] == null) DI.es[ja] = es; };
        /* ① 助言の文（太字で3つの節に分かれて描かれるので、節ごとに） */
        TR("見積提示後は", "After a quotation is sent, ", "报价之后，建议把", "Tras enviar la cotización, conviene crear como tarea ");
        TR("1週間後のリマインド", "a reminder one week later", "一周后的提醒", "un recordatorio una semana después");
        TR("をタスク化するのがおすすめです（タスク・進行のAI提案から作れます）", " is worth adding as a task (you can create it from the AI suggestions in Tasks & progress)", "设为任务（可从“任务・进度”的AI建议中创建）", " (puede crearlo desde las sugerencias de IA en Tareas y progreso)");
        TR("は最重要データです。ひと言でも残してください", " is the most important data. Please leave even a short note", "是最重要的数据。哪怕一句话也请记下来", " es el dato más importante. Deje aunque sea una nota breve");
        TR("反応「高」→", "Response “High” →", "反应“高”→", "Respuesta «Alta» →");
        TR("48時間以内のフォロー", "following up within 48 hours", "48小时内跟进", "hacer seguimiento en 48 horas");
        TR("が定石です。見積かサンプル提案まで進めましょう", " is the standard move. Take it as far as a quotation or a sample offer", "是常规做法。请推进到报价或样品提案", " es lo habitual. Avance hasta una cotización o una propuesta de muestra");
        /* 状況を「失注」にしたときの欄の名前と、理由が空のときの知らせ */
        TR("断られた理由（失注時は必ず）", "Reason declined (required when lost)", "被拒原因（失单时必填）", "Motivo de rechazo (obligatorio si se perdió)");
        TR("失注の場合は「断られた理由」をご入力ください（最重要データです）", "For a lost deal, please enter the “Reason declined” (it is the most important data)", "失单时请填写“被拒原因”（这是最重要的数据）", "Si el caso se perdió, indique el «Motivo de rechazo» (es el dato más importante)");
    } catch (e) { }
    /* ② 知らせの文の中の「…（見本）」 */
    try {
        if (typeof toast === "function") {
            const __t92x = toast;
            toast = function (this: any, m: any) {
                try {
                    const l = (typeof I18N !== "undefined" && I18N && I18N.lang) ? String(I18N.lang) : "ja";
                    if (typeof m === "string" && l !== "ja" && m.indexOf("（見本）") >= 0) {
                        const w = l === "zh" ? "（示例）" : l === "es" ? " (muestra)" : " (sample)";
                        arguments[0] = m.replace(/([\x21-\x7e])（見本）/g, (x: string, a: string) => a + w);
                    }
                } catch (e) { }
                return __t92x.apply(this, arguments as any);
            };
        }
    } catch (e) { }
})();
