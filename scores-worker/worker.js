// Ibory high scores: a Cloudflare Worker with a D1 database bound as DB, and a secret ADMIN_KEY.
// Endpoints
//   POST /submit   {id, token, name, ver, s:{...stats}}  save a player's latest numbers
//   GET  /board?cat=prestige&id=...                      top 50 for a category (+ your own rank)
//   POST /leave    {id, token}                           a player removes themselves
//   GET  /admin                                          admin page (asks for ADMIN_KEY)
//   POST /admin/api/list  {key}                          every player, newest first
//   POST /admin/api/ban   {key, id, ban:true|false}      hide/unhide a player (hidden players can't post)

const UNITS = ["Workers", "Warriors", "Scouts", "Pikemen", "Swordsmen", "Archers", "Transporters", "Cavalry", "Cataphracts", "Ballistas", "Battering Rams", "Catapults"];
const HC_LEVELS = [12, 14, 16, 18];

// every board: its title, the SQL value it ranks by, and the order
const CATS = {
  prestige: { t: "Prestige", v: "prestige", dir: "DESC" },
  kills: { t: "Enemies killed (all troops)", v: "kills", dir: "DESC" },
  deaths: { t: "Troops lost", v: "deaths", dir: "DESC" },
  hero: { t: "Highest level hero", v: "hero_lv", dir: "DESC" },
  stars: { t: "Best star set", v: "star_set", dir: "DESC" },
  cities: { t: "Cities", v: "cities", dir: "DESC" },
  rep: { t: "Alliance reputation", v: "rep", dir: "DESC" },
  college: { t: "War College ratings", v: "college", dir: "DESC" },
};
UNITS.forEach((u, i) => { CATS["kill" + i] = { t: "Killed: " + u, v: "json_extract(kills_by,'$[" + i + "]')", dir: "DESC" }; });
HC_LEVELS.forEach((L) => { CATS["hc" + L] = { t: "First to take a level " + L + " historic city", v: "hc" + L, dir: "ASC", first: 10 }; });

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS players (
     id TEXT PRIMARY KEY, token TEXT NOT NULL, name TEXT NOT NULL, ver TEXT, joined INTEGER, updated INTEGER,
     banned INTEGER NOT NULL DEFAULT 0,
     prestige INTEGER DEFAULT 0, kills INTEGER DEFAULT 0, kills_by TEXT DEFAULT '[]', deaths INTEGER DEFAULT 0,
     hero_lv INTEGER DEFAULT 0, star_set INTEGER DEFAULT 0, cities INTEGER DEFAULT 0, rep INTEGER DEFAULT 0,
     hc12 INTEGER, hc14 INTEGER, hc16 INTEGER, hc18 INTEGER)`,
  `CREATE INDEX IF NOT EXISTS players_prestige ON players(banned, prestige)`,
];
// columns added after launch: added to existing databases automatically
const ADDED = ["college INTEGER DEFAULT 0"];
let schemaReady = false;
async function ensureSchema(env) {
  if (schemaReady) return;
  for (const q of SCHEMA) await env.DB.prepare(q).run();
  for (const col of ADDED) { try { await env.DB.prepare("ALTER TABLE players ADD COLUMN " + col).run(); } catch (e) { /* already there */ } }
  schemaReady = true;
}

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...CORS } });
const num = (x, max = 1e15) => { x = Number(x); return Number.isFinite(x) && x >= 0 ? Math.min(Math.floor(x), max) : 0; };
const cleanName = (n) => String(n || "").replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 20);
const okId = (s) => typeof s === "string" && /^[a-f0-9]{16,64}$/.test(s);

async function readJson(req) { try { return await req.json(); } catch (e) { return null; } }

async function submit(req, env) {
  const b = await readJson(req);
  if (!b || !okId(b.id) || !okId(b.token)) return json({ error: "bad id" }, 400);
  const name = cleanName(b.name);
  if (name.length < 2) return json({ error: "name must be 2 to 20 characters" }, 400);
  const s = b.s || {};
  const killsBy = Array.isArray(s.killsBy) ? s.killsBy.slice(0, 12).map((x) => num(x)) : [];
  while (killsBy.length < 12) killsBy.push(0);
  const now = Date.now();
  const row = await env.DB.prepare("SELECT token, banned, updated, hc12, hc14, hc16, hc18 FROM players WHERE id=?").bind(b.id).first();
  if (row && row.token !== b.token) return json({ error: "this player id belongs to another save" }, 403);
  if (row && row.banned) return json({ ok: true, removed: true });
  if (row && now - (row.updated || 0) < 15000) return json({ ok: true, skipped: true }); // at most one save every 15 seconds
  // first time this player reports owning each historic level: the server's own clock stamps it, and it never changes
  const hc = {};
  HC_LEVELS.forEach((L) => { const had = row && row["hc" + L]; hc[L] = had ? had : (s.hc && s.hc[L] ? now : null); });
  const vals = [name, String(b.ver || "").slice(0, 12), now,
    num(s.prestige), killsBy.reduce((a, x) => a + x, 0), JSON.stringify(killsBy), num(s.deaths),
    num(s.hero, 100000), num(s.stars, 1000), num(s.cities, 1000), num(s.rep), hc[12], hc[14], hc[16], hc[18], num(s.college, 10000)];
  if (row) {
    await env.DB.prepare(`UPDATE players SET name=?, ver=?, updated=?, prestige=?, kills=?, kills_by=?, deaths=?, hero_lv=?, star_set=?, cities=?, rep=?, hc12=?, hc14=?, hc16=?, hc18=?, college=? WHERE id=?`)
      .bind(...vals, b.id).run();
  } else {
    await env.DB.prepare(`INSERT INTO players (name, ver, updated, prestige, kills, kills_by, deaths, hero_lv, star_set, cities, rep, hc12, hc14, hc16, hc18, college, id, token, joined) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .bind(...vals, b.id, b.token, now).run();
  }
  return json({ ok: true });
}

async function board(url, env) {
  const cat = CATS[url.searchParams.get("cat")] ? url.searchParams.get("cat") : "prestige";
  const c = CATS[cat], id = url.searchParams.get("id");
  const where = "banned=0" + (c.first ? " AND " + c.v + " IS NOT NULL" : "");
  const limit = c.first || 50;
  const rs = await env.DB.prepare(`SELECT id, name, ${c.v} AS value FROM players WHERE ${where} ORDER BY value ${c.dir}, updated ASC LIMIT ${limit}`).all();
  const rows = (rs.results || []).map((r, i) => ({ rank: i + 1, name: r.name, value: r.value, me: !!id && r.id === id }));
  let me = null;
  if (okId(id) && !rows.some((r) => r.me)) {
    const mine = await env.DB.prepare(`SELECT ${c.v} AS value, banned FROM players WHERE id=?`).bind(id).first();
    if (mine && !mine.banned && mine.value != null) {
      const cmp = c.dir === "DESC" ? ">" : "<";
      const ahead = await env.DB.prepare(`SELECT COUNT(*) AS n FROM players WHERE ${where} AND ${c.v} ${cmp} ?`).bind(mine.value).first();
      me = { rank: (ahead ? ahead.n : 0) + 1, value: mine.value, outside: !!c.first };
    }
  }
  const total = await env.DB.prepare("SELECT COUNT(*) AS n FROM players WHERE banned=0").first();
  return json({ cat, title: c.t, first: c.first || 0, order: c.dir, rows, me, players: total ? total.n : 0,
    cats: Object.keys(CATS).map((k) => ({ k, t: CATS[k].t })) });
}

async function leave(req, env) {
  const b = await readJson(req);
  if (!b || !okId(b.id) || !okId(b.token)) return json({ error: "bad id" }, 400);
  const row = await env.DB.prepare("SELECT token, banned FROM players WHERE id=?").bind(b.id).first();
  if (!row) return json({ ok: true });
  if (row.token !== b.token) return json({ error: "not your save" }, 403);
  if (row.banned) return json({ ok: true }); // removed players stay removed
  await env.DB.prepare("DELETE FROM players WHERE id=?").bind(b.id).run();
  return json({ ok: true });
}

function adminOk(env, key) { return typeof env.ADMIN_KEY === "string" && env.ADMIN_KEY.length >= 6 && key === env.ADMIN_KEY; }

async function adminApi(path, req, env) {
  const b = await readJson(req);
  if (!b || !adminOk(env, b.key)) return json({ error: "wrong admin key" }, 401);
  if (path === "/admin/api/list") {
    const rs = await env.DB.prepare("SELECT id, name, ver, joined, updated, banned, prestige, kills, deaths, hero_lv, star_set, cities, rep, hc12, hc14, hc16, hc18 FROM players ORDER BY updated DESC LIMIT 1000").all();
    return json({ ok: true, players: rs.results || [] });
  }
  if (path === "/admin/api/ban") {
    if (!okId(b.id)) return json({ error: "bad id" }, 400);
    await env.DB.prepare("UPDATE players SET banned=? WHERE id=?").bind(b.ban ? 1 : 0, b.id).run();
    return json({ ok: true });
  }
  return json({ error: "not found" }, 404);
}

const ADMIN_PAGE = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ibory scores admin</title>
<style>body{font:15px system-ui,sans-serif;margin:0;padding:16px;background:#1f2421;color:#e9ece6}input,button{font:inherit;padding:8px 10px;border-radius:8px;border:1px solid #556}
button{background:#b8902f;color:#1f2421;border:0;font-weight:700;cursor:pointer}button.un{background:#4f7c78;color:#fff}table{border-collapse:collapse;width:100%;margin-top:14px}
td,th{padding:6px 5px;border-bottom:1px solid #3a423d;text-align:left;font-size:13px;vertical-align:top}tr.ban td{opacity:.5}.dur{color:#9aa39c;font-size:12px}#msg{margin-left:8px}</style></head><body>
<h2 style="margin:0 0 10px">Ibory high scores: players</h2>
<input id="k" type="password" placeholder="Admin key"> <button id="go">Load players</button><span id="msg" class="dur"></span>
<table><thead><tr><th>Name</th><th>Prestige</th><th>Kills / lost</th><th>Hero / stars / cities / rep</th><th></th></tr></thead><tbody id="t"></tbody></table>
<script>
var key=sessionStorage.getItem("k")||""; document.getElementById("k").value=key;
function f(n){ return Number(n||0).toLocaleString(); }
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function call(p,b){ return fetch(p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.assign({key:key},b||{}))}).then(function(r){ return r.json(); }); }
function load(){ key=document.getElementById("k").value; sessionStorage.setItem("k",key); document.getElementById("msg").textContent="Loading...";
  call("/admin/api/list").then(function(d){ if (!d.ok){ document.getElementById("msg").textContent=d.error||"Failed"; return; }
    document.getElementById("msg").textContent=d.players.length+" players";
    document.getElementById("t").innerHTML=d.players.map(function(p){ return '<tr class="'+(p.banned?'ban':'')+'"><td><b>'+esc(p.name)+'</b><div class="dur">v'+esc(p.ver||"?")+', seen '+new Date(p.updated).toLocaleString()+'</div></td><td>'+f(p.prestige)+'</td><td>'+f(p.kills)+' / '+f(p.deaths)+'</td><td>L'+p.hero_lv+' / '+p.star_set+'&#9733; / '+p.cities+' / '+f(p.rep)+'</td><td><button class="'+(p.banned?'un':'')+'" data-id="'+p.id+'" data-ban="'+(p.banned?0:1)+'">'+(p.banned?'Restore':'Remove')+'</button></td></tr>'; }).join("");
  }); }
document.getElementById("go").onclick=load;
document.getElementById("t").onclick=function(e){ var b=e.target.closest("button"); if (!b) return; var ban=b.dataset.ban==="1";
  if (ban && !confirm("Remove this player from the high scores? They can't post again until restored.")) return;
  call("/admin/api/ban",{id:b.dataset.id,ban:ban}).then(load); };
if (key) load();
</script></body></html>`;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (!env.DB) return json({ error: "The D1 database is not bound as DB yet" }, 500);
    try {
      await ensureSchema(env);
      if (url.pathname === "/submit" && req.method === "POST") return await submit(req, env);
      if (url.pathname === "/board" && req.method === "GET") return await board(url, env);
      if (url.pathname === "/leave" && req.method === "POST") return await leave(req, env);
      if (url.pathname === "/admin" && req.method === "GET") return new Response(ADMIN_PAGE, { headers: { "Content-Type": "text/html; charset=utf-8" } });
      if (url.pathname.startsWith("/admin/api/") && req.method === "POST") return await adminApi(url.pathname, req, env);
      if (url.pathname === "/") return json({ ok: true, service: "Ibory high scores" });
      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: "server error", detail: String(e && e.message || e) }, 500);
    }
  },
};
