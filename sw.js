const VER = "dumpling-v24";
const V = VER.replace("dumpling-v", "");
const PRECACHE = [
  "./",
  "./?v=" + V,
  "styles.css?v=" + V,
  "app.js?v=" + V,
  "manifest.webmanifest?v=" + V,
  "assets/skin-blue.webp?v=" + V,
  "assets/garden.webp?v=" + V,
  "assets/moon.webp?v=" + V,
  "assets/dumpling-avatar.webp?v=" + V,
  "assets/dumpling-icon.png?v=" + V
];
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VER).then(cache =>
      Promise.all(PRECACHE.map(url =>
        fetch(url).then(res => { if (res && res.ok) return cache.put(url, res); }).catch(() => {})
      ))
    ).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VER).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  const isImg = /\.(png|jpg|jpeg|webp|gif)$/i.test(url.pathname);
  if (isImg) {
    e.respondWith(
      caches.open(VER).then(cache =>
        cache.match(e.request).then(hit => {
          if (hit) return hit;
          return fetch(e.request).then(res => {
            if (res && res.ok) cache.put(e.request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }
  e.respondWith(
    fetch(e.request, { cache: "no-store" })
      .then(res => {
        if (res && res.ok && e.request.method === "GET") {
          caches.open(VER).then(cache => cache.put(e.request, res.clone()));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
