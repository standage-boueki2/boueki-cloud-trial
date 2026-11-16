(function () {
    const W = window;
    if (W.__v2192r9p)
        return;
    const S = (W.__v2192r9p = { sealSkip: 0 });
    try {
        if (typeof v84kMarker === "function" && typeof v84kSealSoon === "function") {
            let inMarker = 0;
            const __mk = v84kMarker, __ss = v84kSealSoon;
            v84kMarker = function () { inMarker++; try {
                return __mk.apply(this, arguments);
            }
            finally {
                inMarker--;
            } };
            v84kSealSoon = function () {
                if (inMarker) {
                    S.sealSkip++;
                    return;
                }
                return __ss.apply(this, arguments);
            };
        }
    }
    catch (e) { }
})();
