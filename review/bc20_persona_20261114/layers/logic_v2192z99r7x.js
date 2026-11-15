(function () {
    const W = window;
    if (W.__v2192r7x)
        return;
    W.__v2192r7x = 1;
    try {
        if (typeof I18N === "undefined" || !I18N || !I18N.dict)
            return;
        const DI = I18N.dict;
        ["en", "zh", "es"].forEach((l) => { if (!DI[l])
            DI[l] = {}; });
        const TR = (ja, en, zh, es) => { if (DI.en[ja] == null)
            DI.en[ja] = en; if (DI.zh[ja] == null)
            DI.zh[ja] = zh; if (DI.es[ja] == null)
            DI.es[ja] = es; };
        TR("見積提示後は", "After a quotation is sent, ", "报价之后，建议把", "Tras enviar la cotización, conviene crear como tarea ");
        TR("1週間後のリマインド", "a reminder one week later", "一周后的提醒", "un recordatorio una semana después");
        TR("をタスク化するのがおすすめです（タスク・進行のAI提案から作れます）", " is worth adding as a task (you can create it from the AI suggestions in Tasks & progress)", "设为任务（可从“任务・进度”的AI建议中创建）", " (puede crearlo desde las sugerencias de IA en Tareas y progreso)");
        TR("は最重要データです。ひと言でも残してください", " is the most important data. Please leave even a short note", "是最重要的数据。哪怕一句话也请记下来", " es el dato más importante. Deje aunque sea una nota breve");
        TR("反応「高」→", "Response “High” →", "反应“高”→", "Respuesta «Alta» →");
        TR("48時間以内のフォロー", "following up within 48 hours", "48小时内跟进", "hacer seguimiento en 48 horas");
        TR("が定石です。見積かサンプル提案まで進めましょう", " is the standard move. Take it as far as a quotation or a sample offer", "是常规做法。请推进到报价或样品提案", " es lo habitual. Avance hasta una cotización o una propuesta de muestra");
        TR("断られた理由（失注時は必ず）", "Reason declined (required when lost)", "被拒原因（失单时必填）", "Motivo de rechazo (obligatorio si se perdió)");
        TR("失注の場合は「断られた理由」をご入力ください（最重要データです）", "For a lost deal, please enter the “Reason declined” (it is the most important data)", "失单时请填写“被拒原因”（这是最重要的数据）", "Si el caso se perdió, indique el «Motivo de rechazo» (es el dato más importante)");
    }
    catch (e) { }
    try {
        if (typeof toast === "function") {
            const __t92x = toast;
            toast = function (m) {
                try {
                    const l = (typeof I18N !== "undefined" && I18N && I18N.lang) ? String(I18N.lang) : "ja";
                    if (typeof m === "string" && l !== "ja" && m.indexOf("（見本）") >= 0) {
                        const w = l === "zh" ? "（示例）" : l === "es" ? " (muestra)" : " (sample)";
                        arguments[0] = m.replace(/([\x21-\x7e])（見本）/g, (x, a) => a + w);
                    }
                }
                catch (e) { }
                return __t92x.apply(this, arguments);
            };
        }
    }
    catch (e) { }
})();
