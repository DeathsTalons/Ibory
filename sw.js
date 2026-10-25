// Ibory offline worker. Bump CACHE on every release so phones pick up the new index.html.
const CACHE = "ibory-v0.2.1";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "badge-96.png"];
// 0.1.235: the art lives in art/ (it used to be base64 inside index.html). ART is built from art/FILES.json by art/tools/build_art.py; keep it in step.
const ART = ["art/hero-alaric.jpg", "art/hero-alexander-the-great.jpg", "art/hero-attila.jpg", "art/hero-belisarius.jpg", "art/hero-boudica.jpg", "art/hero-charlemagne.jpg", "art/hero-charles-martel.jpg", "art/hero-cleopatra.jpg", "art/hero-constantine.jpg", "art/hero-cyrus-the-great.jpg", "art/hero-dracula.jpg", "art/hero-el-cid.jpg", "art/hero-frederick-barbarossa.jpg", "art/hero-genghis-khan.jpg", "art/hero-hadrian.jpg", "art/hero-hannibal-barca.jpg", "art/hero-harald-hardrada.jpg", "art/hero-joan-of-arc.jpg", "art/hero-julius-caesar.jpg", "art/hero-justinian.jpg", "art/hero-leonidas.jpg", "art/hero-marcus-aurelius.jpg", "art/hero-octavian.jpg", "art/hero-otto-the-great.jpg", "art/hero-pericles.jpg", "art/hero-ramesses-ii.jpg", "art/hero-richard-the-lionheart.jpg", "art/hero-robert-the-bruce.jpg", "art/hero-saladin.jpg", "art/hero-scipio-africanus.jpg", "art/hero-spartacus.jpg", "art/hero-sun-tzu.jpg", "art/hero-themistocles.jpg", "art/hero-theodoric.jpg", "art/hero-tomyris.jpg", "art/hero-trajan.jpg", "art/hero-vercingetorix.jpg", "art/hero-william-the-conqueror.jpg", "art/hero-william-wallace.jpg", "art/hero-xerxes.jpg", "art/hero-zenobia.jpg", "art/pack-bridges.png", "art/pack-castlewalls.png", "art/pack-caves.png", "art/pack-cottage.png", "art/pack-farm.png", "art/pack-flowers.png", "art/pack-ruins.png", "art/pack-temple.png", "art/pack-undead.png", "art/pack-village.png", "art/pack-wild.png", "art/road-road-px-brick.png", "art/road-road-px-cobble.png", "art/road-road-px-sand.png", "art/road-road-px-slate.png", "art/road-road-px-terra.png", "art/tile-hc12.png", "art/tile-hc14.png", "art/tile-hc16.png", "art/tile-hc18.png", "art/tile-npc10.png", "art/vamp-1.png", "art/vamp-2.png", "art/vamp-3.png", "art/wiz-1.png", "art/wiz-2.png"];

self.addEventListener("install", (e) => {
  // the game files are fetched fresh; the art is copied over from the previous cache when its bytes are the same release-to-release (same URL = same picture), so an update costs the page, not 1.6 MB of art
  e.waitUntil(caches.open(CACHE).then(async (c) => {
    await Promise.all(FILES.map((f) => fetch(new Request(f, { cache: "reload" })).then((r) => { if (!r.ok) throw new Error(f); return c.put(f, r); })));
    const old = (await caches.keys()).filter((k) => k !== CACHE && k.startsWith("ibory-v"));
    const prev = old.length ? await caches.open(old[old.length - 1]) : null;
    await Promise.all(ART.map(async (f) => {
      const hit = prev ? await prev.match(f) : null;
      if (hit) return c.put(f, hit);
      const r = await fetch(new Request(f, { cache: "reload" })); if (!r.ok) throw new Error(f); return c.put(f, r);
    }));
  }).then(() => self.skipWaiting()));
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
