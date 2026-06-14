const CACHE = "healthjourney-v7";
const ASSETS = ["./", "./index.html", "./app.js", "./manifest.json",
  "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;                  // never touch Liv's POST proxy
  const url = new URL(req.url);
  if (url.pathname.startsWith("/liv")) return;        // never cache the AI proxy
  if (req.mode === "navigate") {                      // page: network-first, offline fallback
    e.respondWith(fetch(req).then((r) => {
      const c = r.clone(); caches.open(CACHE).then((x) => x.put("./index.html", c)); return r;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(req).then((c) => c || fetch(req).then((r) => {
    const cc = r.clone(); caches.open(CACHE).then((x) => x.put(req, cc)); return r;
  }).catch(() => c)));
});
