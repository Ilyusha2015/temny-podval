const CACHE = "temny-podval-v1";
const FILES = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(() => {})); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(resp => { if (resp && resp.ok) { const copy = resp.clone(); caches.open(CACHE).then(c => c.put(r, copy)); } return resp; })
    .catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match("index.html"))));
});
