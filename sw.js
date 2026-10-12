const C = "bc20-v21-4";
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(["./"]))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
    if (e.request.method !== "GET")
        return;
    let u;
    try {
        u = new URL(e.request.url);
    }
    catch (x) {
        return;
    }
    if (u.origin !== self.location.origin)
        return;
    const ver = /\/version\.json$/.test(u.pathname), fresh = e.request.mode === "navigate" || ver;
    const net = fresh ? fetch(e.request.url, { cache: "no-cache", credentials: "same-origin" }).then(r => r.redirected ? fetch(e.request) : r) : fetch(e.request);
    e.respondWith(net.then(r => { if (r && r.ok && !ver) {
        const cl = r.clone();
        caches.open(C).then(c => c.put(e.request, cl));
    } return r; })
        .catch(() => caches.match(e.request).then(m => m || caches.match("./"))));
});
