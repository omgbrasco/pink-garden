const VER = "dumpling-v9";
self.addEventListener("install", e => { self.skipWaiting(); });
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
  e.respondWith(fetch(e.request, { cache: "no-store" }).catch(() => caches.match(e.request)));
});
