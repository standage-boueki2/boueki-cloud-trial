(function () {
    const W = window;
    if (W.__v2192r6a)
        return;
    W.__v2192r6a = 1;
    const LG = () => { try {
        return (typeof I18N !== "undefined" && I18N && I18N.lang) || document.documentElement.lang || "ja";
    }
    catch (e) {
        return "ja";
    } };
    const L2 = () => String(LG()).slice(0, 2);
    const M = (ja, en, zh, es) => { const l = L2(); return l === "en" ? en : l === "zh" ? (zh || en) : l === "es" ? (es || en) : ja; };
    const ten = () => { try {
        return typeof TEN !== "undefined" ? TEN : null;
    }
    catch (e) {
        return null;
    } };
    const API = (W.v92r6a = W.v92r6a || {});
    API.M = M;
    try {
        const ST = W.V92CORE_STEPS || [];
        const fb = ST.find((x) => x && x.id === "fb");
        if (fb && fb.key === "dash:home")
            fb.key = "deal";
    }
    catch (e) { }
    API.now = function () {
        try {
            const S = typeof W.v92coreSteps === "function" ? W.v92coreSteps() : null;
            if (!S || !S.has)
                return null;
            const nx = S.next;
            const def = nx ? ((W.V92CORE_STEPS || []).find((x) => x.id === nx.id) || {}) : {};
            return {
                S, idx: S.idx, done: S.done, all: S.all, next: nx,
                key: nx ? (nx.id === "fill" ? "up" : nx.key) : "",
                label: nx ? M(nx.t, def.en || nx.t, def.zh, def.es) : ""
            };
        }
        catch (e) {
            return null;
        }
    };
    API.dbList = function () {
        try {
            const t = ten();
            const runs = (t && t.v71ob && t.v71ob.runs) || [];
            const last = runs[runs.length - 1];
            const L = last ? (last.leads || last.list || last.items || last.rows || last.cands || []) : [];
            return { n: L.length, runs: runs.length };
        }
        catch (e) {
            return { n: 0, runs: 0 };
        }
    };
    try {
        const R5 = W.v92r5c;
        if (R5 && typeof R5.regMark === "function") {
            const mark0 = R5.regMark;
            let ok = 0;
            R5.regMark = function () { if (!ok)
                return false; return mark0.apply(this, arguments); };
            API.regLook = function () { ok = 1; try {
                return !!mark0.call(R5);
            }
            catch (e) {
                return false;
            }
            finally {
                ok = 0;
            } };
        }
    }
    catch (e) { }
    try {
        if (typeof I18N !== "undefined" && I18N && I18N.dict) {
            const DI = I18N.dict;
            ["en", "zh", "es"].forEach((l) => { if (!DI[l])
                DI[l] = {}; });
            const TR = (ja, en, zh, es) => { if (DI.en[ja] == null)
                DI.en[ja] = en; if (DI.zh[ja] == null)
                DI.zh[ja] = zh; if (DI.es[ja] == null)
                DI.es[ja] = es; };
            const L3 = (en, zh, es) => I18N.lang === "zh" ? zh : I18N.lang === "es" ? es : en;
            const PF = (re, f) => { if (Array.isArray(I18N.pat))
                I18N.pat.unshift({ re, en: f, zh: f, es: f }); };
            const DOCS = [
                ["受益者証明書", "Beneficiary's certificate", "受益人证明", "Certificado del beneficiario"],
                ["為替手形", "Bill of exchange (draft)", "汇票", "Letra de cambio"],
                ["航空運送状（AWB）", "Air waybill (AWB)", "航空运单（AWB）", "Guía aérea (AWB)"],
                ["保険証券（保険承認状）", "Insurance policy (insurance certificate)", "保险单（保险凭证）", "Póliza de seguro (certificado de seguro)"],
                ["検査証明書（第三者検査・船積前検査）", "Inspection certificate (third-party / pre-shipment inspection)", "检验证书（第三方检验・装运前检验）", "Certificado de inspección (de terceros / previa al embarque)"],
                ["認定輸出者の原産地申告（第二種）", "Origin declaration by an approved exporter (Type 2)", "经认定出口商的原产地声明（第二种）", "Declaración de origen de exportador autorizado (tipo 2)"],
                ["商工会議所のサイン証明", "Chamber of commerce signature certification", "商工会议所的签字认证", "Certificación de firma de la cámara de comercio"],
                ["危険物申告書（Shipper's Declaration／危険物明細書）", "Dangerous goods declaration (Shipper's Declaration / dangerous goods list)", "危险品申报书（Shipper's Declaration／危险品明细）", "Declaración de mercancías peligrosas (Shipper's Declaration)"],
                ["リチウム電池の UN38.3 試験概要", "UN38.3 test summary for lithium batteries", "锂电池 UN38.3 测试概要", "Resumen de ensayo UN38.3 de baterías de litio"],
                ["水産物の衛生証明書", "Health certificate for fishery products", "水产品卫生证书", "Certificado sanitario de productos pesqueros"],
                ["食肉・食肉製品の衛生証明書", "Health certificate for meat and meat products", "肉类・肉制品卫生证书", "Certificado sanitario de carne y productos cárnicos"],
                ["乳・乳製品の衛生証明書", "Health certificate for milk and dairy products", "乳・乳制品卫生证书", "Certificado sanitario de leche y productos lácteos"],
                ["卵・卵製品の衛生証明書", "Health certificate for eggs and egg products", "蛋・蛋制品卫生证书", "Certificado sanitario de huevos y ovoproductos"],
                ["加工食品などの衛生証明書（政府発行）", "Health certificate for processed foods etc. (government-issued)", "加工食品等的卫生证书（政府签发）", "Certificado sanitario de alimentos procesados, etc. (emitido por el gobierno)"],
                ["衛生に関する宣誓書＋商工会議所のサイン証明", "Sanitary affidavit + chamber of commerce signature certification", "卫生宣誓书＋商工会议所的签字认证", "Declaración jurada sanitaria + certificación de firma de la cámara de comercio"],
                ["ペットフード（飼料）の衛生証明書", "Health certificate for pet food (feed)", "宠物食品（饲料）卫生证书", "Certificado sanitario de alimentos para mascotas (piensos)"],
                ["輸出先向けの施設の認定・登録", "Facility approval / registration for the destination", "面向出口目的地的设施认定・注册", "Aprobación / registro de la instalación para el destino"],
                ["漁獲証明書", "Catch certificate", "捕捞证明书", "Certificado de captura"],
                ["輸出検疫証明書（動物検疫所）", "Export quarantine certificate (Animal Quarantine Service)", "出口检疫证明书（动物检疫所）", "Certificado de cuarentena de exportación (Servicio de Cuarentena Animal)"],
                ["木材こん包材の消毒と表示（ISPM No.15）", "Treatment and marking of wood packaging (ISPM No. 15)", "木质包装材料的处理与标识（ISPM No.15）", "Tratamiento y marcado de embalajes de madera (NIMF n.º 15)"],
                ["産地証明書（都道府県単位・原発事故関連）", "Certificate of place of production (by prefecture; related to the nuclear accident)", "产地证明书（按都道府县・核事故相关）", "Certificado de lugar de producción (por prefectura; relativo al accidente nuclear)"],
                ["輸出事業者証明書（香港向け）", "Exporter certificate (for Hong Kong)", "出口企业证明书（面向香港）", "Certificado de exportador (para Hong Kong)"],
                ["自由販売証明書（食品）", "Certificate of free sale (food)", "自由销售证明书（食品）", "Certificado de libre venta (alimentos)"],
                ["化粧品・医薬部外品の輸出証明（自由販売証明）", "Export certificate for cosmetics and quasi-drugs (certificate of free sale)", "化妆品・医药部外品的出口证明（自由销售证明）", "Certificado de exportación de cosméticos y cuasi-medicamentos (libre venta)"],
                ["ハラール証明書", "Halal certificate", "清真（Halal）证书", "Certificado halal"],
                ["製造所の衛生管理の証明（GMP・HACCP・ISO 22000 などの写し）", "Proof of hygiene management at the plant (copies of GMP, HACCP, ISO 22000, etc.)", "生产场所卫生管理证明（GMP・HACCP・ISO 22000 等的副本）", "Prueba de gestión higiénica de la planta (copias de GMP, HACCP, ISO 22000, etc.)"],
                ["酒類の輸出証明（製造地証明・製造日証明・放射性物質検査）", "Export certificates for alcoholic beverages (place / date of manufacture, radioactivity test)", "酒类出口证明（产地证明・生产日期证明・放射性物质检测）", "Certificados de exportación de bebidas alcohólicas (lugar / fecha de fabricación, radiactividad)"],
                ["FDA 食品施設登録", "FDA food facility registration", "FDA 食品设施注册", "Registro de instalación alimentaria ante la FDA"],
                ["FDA 事前通報（Prior Notice）", "FDA Prior Notice", "FDA 预先通报（Prior Notice）", "Notificación previa de la FDA (Prior Notice)"],
                ["FDA 缶詰・酸性化食品の登録（FCE と SID）", "FDA registration for canned / acidified foods (FCE and SID)", "FDA 罐头・酸化食品注册（FCE 与 SID）", "Registro FDA de conservas / alimentos acidificados (FCE y SID)"],
                ["FDA 化粧品の施設登録・製品リスト（MoCRA）", "FDA cosmetics facility registration & product listing (MoCRA)", "FDA 化妆品设施注册・产品列名（MoCRA）", "Registro de instalación y listado de productos cosméticos FDA (MoCRA)"],
                ["FDA 医療機器の施設登録・機器リスト・510(k) など", "FDA medical device establishment registration, device listing, 510(k), etc.", "FDA 医疗器械企业注册・器械列名・510(k) 等", "Registro de establecimiento, listado de dispositivos, 510(k), etc. ante la FDA"],
                ["CPNP 届出", "CPNP notification", "CPNP 通报", "Notificación CPNP"],
                ["英国 化粧品の責任者・SCPN 届出", "UK cosmetics Responsible Person & SCPN notification", "英国 化妆品责任人・SCPN 通报", "Reino Unido: persona responsable de cosméticos y notificación SCPN"],
                ["食品接触材の適合宣言・溶出試験", "Declaration of compliance & migration tests for food contact materials", "食品接触材料的符合性声明・迁移试验", "Declaración de conformidad y ensayos de migración de materiales en contacto con alimentos"],
                ["EU 森林破壊防止規則（EUDR）の産地の位置情報", "Geolocation of the place of production under the EU Deforestation Regulation (EUDR)", "欧盟零毁林法规（EUDR）的产地地理位置信息", "Geolocalización del lugar de producción según el Reglamento de la UE sobre deforestación (EUDR)"],
                ["米国レイシー法の申告データ（木材・植物の製品）", "US Lacey Act declaration data (wood and plant products)", "美国雷斯法案申报数据（木材・植物制品）", "Datos de declaración de la Ley Lacey de EE. UU. (productos de madera y plantas)"],
                ["中国 輸入食品の海外生産企業の在華登録番号", "China: registration number of overseas manufacturers of imported food", "中国 进口食品境外生产企业在华注册编号", "China: número de registro de fabricantes extranjeros de alimentos importados"],
                ["中国 化粧品の届出・登録（NMPA）", "China: cosmetics filing / registration (NMPA)", "中国 化妆品备案・注册（NMPA）", "China: notificación / registro de cosméticos (NMPA)"],
                ["韓国 海外製造業所の登録（MFDS）", "Korea: registration of foreign manufacturing facilities (MFDS)", "韩国 境外生产企业注册（MFDS）", "Corea: registro de instalaciones de fabricación extranjeras (MFDS)"],
                ["タイ FDA の輸入許可・製品登録", "Thai FDA import license & product registration", "泰国 FDA 的进口许可・产品注册", "Licencia de importación y registro de producto de la FDA de Tailandia"],
                ["ベトナムの自己公表・製品登録", "Vietnam: self-declaration / product registration", "越南的自我公布・产品注册", "Vietnam: autodeclaración / registro de producto"],
                ["インドネシア BPOM の登録（ML 番号）", "Indonesia: BPOM registration (ML number)", "印度尼西亚 BPOM 注册（ML 编号）", "Indonesia: registro BPOM (número ML)"],
                ["フィリピン FDA の LTO・CPR／届出", "Philippine FDA LTO & CPR / notification", "菲律宾 FDA 的 LTO・CPR／通报", "LTO y CPR / notificación de la FDA de Filipinas"],
                ["シンガポール SFA の輸入ライセンス", "Singapore SFA import licence", "新加坡 SFA 进口许可证", "Licencia de importación de la SFA de Singapur"],
                ["インドの輸入の登録（IEC・FSSAI・CDSCO・BIS）", "India: import registrations (IEC, FSSAI, CDSCO, BIS)", "印度的进口注册（IEC・FSSAI・CDSCO・BIS）", "India: registros de importación (IEC, FSSAI, CDSCO, BIS)"],
                ["豪州 BICON の輸入条件・輸入許可", "Australia: BICON import conditions & import permit", "澳大利亚 BICON 的进口条件・进口许可", "Australia: condiciones de importación BICON y permiso de importación"],
                ["カナダ SFC ライセンス（輸入者）", "Canada: SFC licence (importer)", "加拿大 SFC 许可证（进口商）", "Canadá: licencia SFC (importador)"],
                ["ブラジルの輸入ライセンス（LI/LPCO）・ANVISA・MAPA", "Brazil: import licence (LI/LPCO), ANVISA, MAPA", "巴西的进口许可证（LI/LPCO）・ANVISA・MAPA", "Brasil: licencia de importación (LI/LPCO), ANVISA, MAPA"],
                ["サウジ SABER の製品適合証明（PCoC）・出荷証明（SC）", "Saudi SABER product certificate of conformity (PCoC) & shipment certificate (SC)", "沙特 SABER 的产品符合性证书（PCoC）・装运证书（SC）", "SABER de Arabia Saudita: certificado de conformidad (PCoC) y de envío (SC)"],
                ["サウジ SFDA の製品登録・施設の登録", "Saudi SFDA product registration & facility registration", "沙特 SFDA 的产品注册・设施注册", "Registro de producto e instalación ante la SFDA saudí"],
                ["UAE の食品・化粧品の登録とラベル審査", "UAE: food / cosmetics registration and label assessment", "阿联酋的食品・化妆品注册与标签审查", "EAU: registro de alimentos / cosméticos y revisión de etiquetas"],
                ["エジプト ACI の ACID 番号・CargoX への入力", "Egypt: ACI ACID number & CargoX entry", "埃及 ACI 的 ACID 编号・CargoX 录入", "Egipto: número ACID del ACI y carga en CargoX"],
                ["エジプト GOEIC の工場登録", "Egypt: GOEIC factory registration", "埃及 GOEIC 的工厂注册", "Egipto: registro de fábrica en GOEIC"],
                ["ナイジェリア Form M・PAAR（輸入者）", "Nigeria: Form M & PAAR (importer)", "尼日利亚 Form M・PAAR（进口商）", "Nigeria: Form M y PAAR (importador)"],
                ["ナイジェリア SONCAP の製品証明（PC）・出荷証明（SC）", "Nigeria: SONCAP product certificate (PC) & SONCAP certificate (SC)", "尼日利亚 SONCAP 的产品证书（PC）・装运证书（SC）", "Nigeria: certificado de producto (PC) y certificado SONCAP (SC)"],
                ["ナイジェリア NAFDAC の登録", "Nigeria: NAFDAC registration", "尼日利亚 NAFDAC 注册", "Nigeria: registro NAFDAC"],
                ["南ア NRCS の承諾書（LOA）", "South Africa: NRCS Letter of Authority (LOA)", "南非 NRCS 的授权书（LOA）", "Sudáfrica: carta de autorización (LOA) del NRCS"],
                ["ワシントン条約の輸出許可書と輸出承認", "CITES export permit and export approval", "《华盛顿公约》（CITES）出口许可证与出口批准", "Permiso de exportación CITES y aprobación de exportación"],
                ["輸出承認（輸出貿易管理令 第2条）", "Export approval (Export Trade Control Order, Article 2)", "出口批准（出口贸易管理令 第2条）", "Aprobación de exportación (Orden de Control del Comercio de Exportación, art. 2)"],
                ["CPSR/PIF（化粧品の安全性報告書・製品情報ファイル）", "CPSR/PIF (cosmetic product safety report / product information file)", "CPSR/PIF（化妆品安全报告・产品信息档案）", "CPSR/PIF (informe de seguridad del producto cosmético / expediente de información)"]
            ];
            DOCS.forEach((r) => TR(r[0], r[1], r[2], r[3]));
            TR("市場・規制をすばやく調査", "Research markets and regulations fast", "快速调查市场与法规", "Investigue mercados y regulaciones con rapidez");
            TR("バイヤーの候補を提案", "Get buyer candidates suggested", "推荐买家候选", "Reciba propuestas de compradores");
            TR("商談・見積・出荷まで支援", "Support from negotiation and quotes to shipment", "支持从商谈、报价到出货", "Apoyo desde la negociación y la cotización hasta el envío");
            TR("今のペースでも届く見込み", "On track at the current pace", "按目前的节奏预计可达成", "Alcanzable al ritmo actual");
            TR("標準のペースで届く見込み", "Reachable at a standard pace", "按标准节奏预计可达成", "Alcanzable a un ritmo estándar");
            TR("挑戦のペースなら届く見込み", "Reachable at a stretch pace", "按挑战节奏预计可达成", "Alcanzable a un ritmo exigente");
            TR("今の道筋では届かない見込み", "Not reachable on the current path", "按目前的路径预计无法达成", "No alcanzable con la ruta actual");
            TR("目標と道筋を見る", "See goal & roadmap", "查看目标与路径", "Ver objetivo y hoja de ruta");
            TR("目標の金額が未記入", "Target amount not entered", "尚未填写目标金额", "Importe objetivo sin indicar");
            PF(/^(\d{4})年に海外売上 (.+)$/, (m) => L3("Overseas sales of " + m[2] + " by " + m[1], "到 " + m[1] + " 年海外销售额 " + m[2], "Ventas en el exterior de " + m[2] + " para " + m[1]));
            PF(/^(・?)いま「(.+)」・確からしさ (\d+)$/, (m) => (m[1] ? " · " : "") + L3("now “" + m[2] + "” · confidence " + m[3], "目前“" + m[2] + "”・可信度 " + m[3], "ahora «" + m[2] + "» · fiabilidad " + m[3]));
            const trS = (x) => { try {
                const r = i18nStr(String(x), DI[I18N.lang] || {});
                return r == null ? String(x) : r;
            }
            catch (e) {
                return String(x);
            } };
            PF(/^こんにちは。(.+)のAI物流マンです。$/, (m) => { const co = trS(m[1]), dot = /\.$/.test(co) ? " " : ". "; return L3("Hello. I'm the AI logistics agent for " + co + dot, "您好。我是" + co + "的AI物流专员。", "Hola. Soy el agente logístico de IA de " + co + dot); });
            PF(/^(.*?)・?記録した次の行動（先に送った連絡は、相手の返事待ち）$/, (m) => (m[1] ? trS(m[1]) + " · " : "") + L3("your recorded next action (the message you sent is awaiting a reply)", "已记录的下一步行动（先前发送的联系正在等待对方回复）", "su próxima acción registrada (el mensaje enviado espera respuesta)"));
            TR("続けてもう1件記録する", "Record another one", "继续再记录1件", "Registrar otra más");
        }
    }
    catch (e) { }
    try {
        const STN = {
            zh: ["尚未开始", "已登记商品", "已选择销售目标国", "已准备法规与价格", "外语营业资料已完成", "已开始联系买家", "商谈已开始", "样品・报价阶段", "合同谈判中", "交易已开始", "正在扩大交易"],
            es: ["Sin empezar", "Producto registrado", "Países de venta elegidos", "Regulaciones y precios preparados", "Presentación de ventas lista", "Contactando compradores", "Negociaciones iniciadas", "Muestras y cotizaciones", "Negociando el contrato", "Primeras operaciones", "Ampliando operaciones"]
        };
        API.stageName = function (n, def) { const a = STN[L2()]; return a ? (a[Math.max(0, Math.min(10, n | 0))] || def) : def; };
        if (typeof v88StNm === "function") {
            const __sn6 = v88StNm;
            v88StNm = function (n) { const r = __sn6.apply(this, arguments); try {
                return API.stageName(n, r);
            }
            catch (e) {
                return r;
            } };
        }
    }
    catch (e) { }
})();
