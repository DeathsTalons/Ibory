# Ibory (phone app)

Version 0.1.6

A single-player, real-time remake of Evony Age 1, set in North March. One HTML file, no build step.

## Files
- `index.html`: the whole game
- `sw.js`: offline worker. **Bump `CACHE` (ibory-vX.Y.Z) and `APP_VERSION` in index.html on every release.**
- `manifest.webmanifest` and three icons (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`)

## Hosting (GitHub Pages)
1. Put these files at the root of the repo (or in the folder Pages serves).
2. Open the site in Chrome on Android, menu, **Install app** / **Add to Home screen**.

## Updating the phone
1. Replace `index.html` and `sw.js` in the repo (keep the other files).
2. Open the app online, close it fully, then open it again.

## Saves
Saves live in the phone's localStorage under `stonewatch-save-v1` (the old name is kept on purpose).
Settings has save codes and Save to file / Load from file. Current save version: 40.

## Release notes
### 0.1.6
- High scores: trophy button in the header. Opt-in; sends name + prestige, kills by troop type, troops lost, best hero level, best star set, cities, alliance rep and historic levels taken to the Cloudflare Worker at LB_URL (source in scores-worker/worker.js). Syncs on open, every 5 minutes, and when the app is put away. 23 boards; "first to take" historic boards rank by the server's own clock.
- Admin: LB_URL + "/admin" with the ADMIN_KEY secret lists players with Remove/Restore.
- Alliance reputation keeps counting past 100,000 (the bar stays at 100%).
- Header: Settings shows only its gear icon on phones so all buttons fit on one row.
### 0.1.5
- Gear: every newly crafted piece adds Attack, Politics or Intelligence (pick at the Workshop; stored as `stat` on the piece). Older pieces keep their slot's stat.
- Equip best gear asks for a stat and takes pieces of that stat from other heroes. New Unequip all button.
- Historic heroes: captured at level 1, 120-130 in every stat, specialty 160-199 and matched to the person (HIST_SPEC).
- Battle reports can be saved (star); saved reports never roll off and keep full detail. New Saved filter.
- Screen lock: the main view keeps the tapped button in place when it rebuilds; hero sheet returns to the same spot after a gear menu.
- Building menus fit the phone width; one fixed button that reads Upgrade, or Add to queue when it can't start now (walls too).
- Notification toggles per type in Settings, plus optional phone notifications while the app is running.
- Troop training times x1.5 (Ballista 30 minutes).
### 0.1.1 to 0.1.4
- Local-midnight daily reset, claimed packages hide, gear presets, report fit-to-screen, valleys/flats +1 level a day, training split and queue, the Queen at TH10, naming gear and presets, Beta Tester Chest and Beta, wall upgrades in the walls dropdown.
### Earlier
- Michelangelo's Script: every upgrade to level 10 (any building) uses one. Dropped by level 5+ NPC cities, 0.5% at level 5 rising to 1% at level 10. Save v39 to v40, existing saves migrate on load.
- Farm planner (new Farms tab): each march preset can be set to Training (round trips just over 1 hour) or Resources (just over 4 hours) and fills its own farm list with unclaimed NPC cities its army beats, best value per travel time first. Clear all farm lists, Refill all lists. No save version change (the goal is stored on the preset as farmMode).
- Farm planner: each preset also has an NPC level dropdown (Any, or 1 to 10); the planner only picks NPCs of that level. Stored as farmLevel on the preset.
- Gear menus: tapping a slot on a hero's page now shows star and tier upgrades for the piece that hero is wearing. Closing, backdrop tap, Esc/back, equip and take-off all return to that hero's gear section instead of the main hero tab. New menus open scrolled to the top.

## Rename alliance and map
Settings now has "Alliance name" and "Map name" fields (the Alliance tab also has a quick rename box). Blank resets to the default.

## Lion medals
Level 2 to 5 NPC cities can now drop Lion medals (was 2 to 3).

## Craft from the hero gear menu
Each hero slot menu has Craft and Craft and wear (3 Rough Ore, Workshop 1).

## Developer lock
Testing tools are hidden behind a dev password in Settings. Locking resets game speed to 1x.

## Farm planner: closest first
Lists now fill with the nearest NPCs first (by round-trip time) so each rotation holds as many stops as possible.

## War Room starts blank
The battle simulator opens with zero troops, research and hero bonuses on both sides. Use My army, My research, My city defends, or pick an NPC level to load things.

## New app icon
The gold castle on dark green is now the home-screen icon. If your phone still shows the old one, remove the app and add it again.
