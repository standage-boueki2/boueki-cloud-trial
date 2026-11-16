/* 21.94 r9p：読み込みのあとも続く処理（本体の層。今の版と刷新版の両方に効く）
   ① 21.84 の「保存の鍵の封」（v84k）が、30ms おきに止まらずに回り続けていた（8820・8803 も同じ）。
      v84kSeal（封をする）の中の v84kMarker が、セッション（sessionStorage の bc20_ses_v1）を同じ中身で書き直す
      → その書き込みを見張る v84kSesPut が v84kSealSoon（30ms 後にもう一度封をする）を呼ぶ → また v84kSeal … の繰り返し。
      1回ごとに暗号化と IndexedDB への書き込みがあり、読み込みのあと 11 秒の間の CPU の半分あまり（約0.5秒・CPU 1/4 では約2秒）がこれだった。
      直し：v84kMarker の中から呼ばれた v84kSealSoon だけ飛ばす（いま封をしている最中で、このあと同じ中身で封をするので、もう一度は要らない）。
            セッションの中身が変わったとき（ログイン・会社の切り替え など）は、今までどおり v84kSesPut から封をし直す。 */
declare let v84kMarker: any, v84kSealSoon: any;
(function () {
    const W: any = window;
    if (W.__v2192r9p) return;
    const S: any = (W.__v2192r9p = { sealSkip: 0 });
    try {
        if (typeof v84kMarker === "function" && typeof v84kSealSoon === "function") {
            let inMarker = 0;
            const __mk = v84kMarker, __ss = v84kSealSoon;
            v84kMarker = function (this: any) { inMarker++; try { return __mk.apply(this, arguments as any); } finally { inMarker--; } };
            v84kSealSoon = function (this: any) {
                if (inMarker) { S.sealSkip++; return; }
                return __ss.apply(this, arguments as any);
            };
        }
    } catch (e) { }
})();
