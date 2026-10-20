// Ibory offline worker. Bump CACHE on every release so phones pick up the new index.html.
const CACHE = "ibory-v0.1.212";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "badge-96.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(FILES.map((f) => fetch(new Request(f, { cache: "reload" })).then((r) => { if (!r.ok) throw new Error(f); return c.put(f, r); })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // only the game's own files and its fonts are cached; live data (the high scores server) always goes to the network
  const u = new URL(e.request.url);
  if (u.origin !== self.location.origin && !/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        // keep fonts and anything else the game pulls in for offline play
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match("index.html"));
    })
  );
});

// 0.1.206: pushes from the server (rally calls and results, private messages). If Ibory is open on screen it already shows these itself,
// so nothing pops up; otherwise the phone shows the notification.
self.addEventListener("push", (e) => {
  let m = {}; try { m = e.data ? e.data.json() : {}; } catch (x) { m = { b: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    if (m.k !== "test" && cs.some((c) => c.visibilityState === "visible")) return;
    return self.registration.showNotification(m.t || "Ibory", { body: m.b || "", icon: "icon-192.png", badge: "badge-96.png", tag: m.tag || "ibory-" + (m.k || "push"), renotify: true, data: { k: m.k || "" } });
  }));
});

// tapping a game notification brings Ibory back to the front (and to the rallies or your messages)
self.addEventListener("notificationclick", (e) => {
  e.notification.close(); const k = (e.notification.data && e.notification.data.k) || "";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    if (cs.length) { cs[0].postMessage({ ibory: "open", k }); return cs[0].focus(); }
    return self.clients.openWindow("./" + (k ? "#go-" + k : ""));
  }));
});
