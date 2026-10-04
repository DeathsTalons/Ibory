// Ibory offline support.
// Navigations: try the network briefly, fall back to the saved game page no matter which URL opened the app.
// Everything else: serve from the cache first and refresh it quietly in the background.
const CACHE = "ibory-v34";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u =>
    fetch(u, {cache: "reload"}).then(r => { if (r.ok) return c.put(u, r); }).catch(() => {})
  ))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && (k.indexOf("ibory") === 0 || k.indexOf("stonewatch") === 0)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function savedPage() {
  return caches.open(CACHE).then(c => c.match("./index.html").then(r => r || c.match("./")))
    .then(r => r || caches.match("./index.html", {ignoreSearch: true}))
    .then(r => r || new Response("<h1>Ibory</h1><p>Open the app once with internet so it can save itself for offline play.</p>", {headers: {"Content-Type": "text/html"}}));
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (req.mode === "navigate") {
    e.respondWith(new Promise(resolve => {
      let done = false;
      const timer = setTimeout(() => { if (!done) { done = true; resolve(savedPage()); } }, 3500);
      fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy)); }
        if (!done) { done = true; clearTimeout(timer); resolve(res && res.ok ? res : savedPage()); }
      }).catch(() => { if (!done) { done = true; clearTimeout(timer); resolve(savedPage()); } });
    }));
    return;
  }
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => {
    const net = fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit || Response.error());
    return hit || net;
  }));
});
