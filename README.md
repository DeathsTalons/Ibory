# Ibory (phone app)

Version 0.1.25

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
### 0.1.25
- Optimize layers: "Layers may use" checkboxes for every troop type. Untick a troop (say Ballistas, until you have thousands) and the optimizer never puts it in a mix. The choice is remembered and also applies to the Battlefield's Optimize button.
### 0.1.24
- Optimize layers (War Room): keeps your main troop and march size and searches hundreds of layer mixes against the defender you've set up, then fills in the best one. Pick "Fewest troops lost" (fewest wounded) or "Least prestige lost". Works with any troops by default; tick "only layers I have" to limit it to what's at home. Shows your setup vs plain troops vs optimized (80 battles each, same dice), and can save the result as a march preset. Runs in the background with a progress bar and Cancel.
- The same button on the Battlefield send screen (single-player), using your reserve against that building's guards.
### 0.1.23
- Every march shows what's in it: troops by unit, the hero leading it, and any cargo or plunder it's carrying (in the march strip and on the Map tab).
- Army tab: new Troop totals section with home, out marching, this city's total and the total across all cities per unit, plus each city's total.
- Fix: scouting and ally-guard marches showed "undefined" on the Map tab's march list.
### 0.1.22
- Hourly snapshots and cheat checks: each cloud save carries a small summary (army, troops ever trained, prestige, resources, production, cities, best hero, game time). The server keeps two weeks of them and compares each with the one before: troops that appear without being trained, training without the prestige it always earns, game time running ahead of real time (device clock moved forward), resources far beyond production, an army worth far more than the prestige earned, giant heroes, and developer tools on. Nothing is blocked; flags appear on the admin page.
- Admin page: new Saves tab with every cloud save, its flags (30 days), and per player the flag history, hourly snapshots and a download of the latest save (for fixing a game by hand).
- Needs the updated scores Worker (worker.js): its tables create themselves.
### 0.1.21
- Cloud saves sync between devices. The game saves to the cloud every hour while open and whenever you switch away. Opening the game (or coming back to it) checks the cloud: if another device saved a newer game, that one loads automatically, and this device's copy is kept for a week (Settings > Cloud backup > Undo). If two devices play at once, the second one to save is asked which game to keep instead of silently overwriting. Older game versions still back up as before.
- Players without a cloud save are asked to set one up when they open the game ("Not now" asks again in 3 days).
- Needs the updated scores Worker (worker.js): two columns are added to the backups table automatically.
### 0.1.20
- Warehouse shows its plunder protection: the effect line and "What each level does" list how much of each resource it keeps safe (and what the next level adds), the description explains the rule (50,000 x (1+2+...+level) of every resource per Warehouse, Warehouses add up, Stockpile +10% a level), and the Warehouse page opens with a Plunder protection section: each Warehouse, the Stockpile bonus, the total, and how much of each resource is open to raiders right now.
### 0.1.19
- Fix: conquering an NPC city (or an AI lord's) now gives you one of every building at that city's level, plus its walls, along with the six cottages and twelve fields it already came with. Before, it arrived with only ten buildings and no walls.
- Backport: on first load, cities you conquered before this fix are found (by the layout a conquest left) and filled in at the level you took them at: missing buildings are added, lower ones raised to that level, walls raised to it. Anything you upgraded higher stays; buildings mid-construction are left alone; a building you'd queued on an empty plot is placed there. A message lists what changed. Founded and historic cities are untouched.
### 0.1.18
- PvP Battlefield opens to testers: entering the tester code in Settings' developer box unlocks it on that save (developer tools still show it too).
- Battlefield rating: Elo, everyone starts at 1,000. A pair's first 3 matches each day are rated; forfeits count. Rating board in the PvP section; lobby shows each side's rating; the result screen shows the change. Each save gets its own PvP identity (carried by cloud backups).
- Building guards in PvP scale to the smaller side: three of its full marches (no more than a quarter of its army), 30k to 400k, with walls and traps scaled to match.
- Server (worker.js): rating and match-log tables create themselves. Admin page (/admin) now has tabs: High scores, PvP matches (result, rating change, guard size, flags, full field log) and PvP ratings (remove/restore from the board). Looser limits for real late-game saves (research to 18, big heroes); suspicious saves are flagged, never blocked.
### 0.1.17
- PvP Battlefield (testing, hidden unless developer tools are unlocked): 1v1 against a real player on the Battlefield field for 25 real minutes. Create a match for a 6-character code or join one, pick a city, both ready, 10-second countdown. Same map, send sheet, presets, scouting, Beacon intel and War Wizard as the single-player Battlefield; camp-to-camp routes bend around The Keep. The server keeps the clock; drop for a minute and an autopilot plays for you. Results: March Speed-ups used are deducted, spoils from the Battlefield ladder, a Field Surgeon's Kit for the winner. Needs the updated scores Worker (worker.js): the pvp table creates itself.
### 0.1.16
- Cloud backup (Settings): pick a backup name and password, and the game backs itself up to the Ibory server about twice a day while open, plus "Back up now". On a new device, sign in with the same name and password to restore. The server keeps the latest copy and one at least most of a day older. Saves are gzipped (about 8x smaller); passwords are stored only as salted hashes; 10 wrong passwords lock a name for 15 minutes. Needs the updated scores Worker (worker.js): the backups table creates itself.
### 0.1.15
- Valleys and flats muster a full garrison again right after every fight (loot still refills over 4 hours). Spam-farming one means beating it every time.
- Map: a hit NPC city fades, then regains its color from the bottom up as its loot refills (4 hours). Tile info shows troops and loot recovery with time left.
### 0.1.14
- Every march preset (normal, auto-farm, timed waves and Battlefield) can pick its hero as Best attack (your strongest free hero) or Any free hero (your weakest free one, so the best stay home), as well as a named hero or none. Auto-farm never waits on Best/Any: if nobody is free it goes without. Timed waves give each preset a different hero.
### 0.1.13
- A secret package hides somewhere in the game. Once per save.
### 0.1.12
- High scores: saves that were removed, or that left, can still browse every board (no sending scores); leavers get a Rejoin option above the boards.
- War Wizard reads in plain words: a round summary (what each side lost, forts and wall included), then "Your side" and "Their side" with plain sentences ("Your Archers shot their Pikemen"), kills on the right in green or red, and a small line for distance, damage modifiers, overkill and forts used up. Numbers keep the true firing order.
### 0.1.11
- War Wizard: replay any battle round by round. Every battle report (attacks, raids on your cities, ally defenses, camps) and every War College wave has a War Wizard button. The engine keeps each real fight's exact inputs and dice (about 400 bytes per report), so the replay is the same battle, not a re-roll. Field view with every unit group's position and count, this round's shots as arrows, a numbered list of who hit what at what distance with the damage modifier (melee bonuses, half damage past half reach, quarter damage on melee targets that can strike back, half damage to walls), rolled vs actual kills, trap/abatis/log/treb/tower strikes, and a per-round tally with reach. Reports from before this version have no replay. Trace mode (SIM.fight opts.trace) changes no results.
### 0.1.10
- Battlefield map: your side, the rivals and the three buildings on one field, colored by owner; tap a building to attack, scout or reinforce, or a rival camp to scout it. March lines with moving markers and timers.
- Beacon Tower on the Battlefield (the city you bring): below 8 enemy routes only, 8 how many marches per route, 9 the troops in each march, 10 exact landing times.
- Your marches panel: mission, target, troops, hero, progress, landing time, Recall and Speed up; held buildings with Withdraw.
- Scouting on the Battlefield: scouts fight scouts (Informatics on both sides, rivals at 10), twice as fast; reports show exact troops, walls and forts.
- Hero per march on the Battlefield; each hero leads one march at a time.
- Battlefield presets: six of their own, editable from the Alliance tab or mid-battle. All buttons per troop in the send screen, which now fits a phone.
- Ally orders: Fire at will, Attack a building, or Sync with my attacks. AI lords build layered marches (main stack behind one of each other troop); smart lords simulate their options, allies with a troop focus always layer.
- World map: moving markers on every march, out and back.
- Fixes: tapping Send right after typing could miss; 999,999 showed as 1000.0k.
### 0.1.9
- War College Defense: 6 attack themes (Open Field, Horse Lords, The Horde, Siege Train, Arrow Storm, Shut Gates) at three sizes: Skirmish (2 waves), Assault (3), Onslaught (4). You spend a prestige budget on troops the city owns and on fortifications (free to place, no need to build them), at a wall level fixed by the puzzle; each theme sets which troops and forts are allowed (or shuts the gate). Waves hit in order and your survivors and forts carry over. Losses count in prestige (troops + forts). Victory = hold; Commanding/Masterful = loss caps from optimizer plans at the same decent/high reference gear as Sieges. Data block WC_DEFS is generated (tools in war-college-tools).
- War College Defense: Trick Shots, 4 one-off defenses built on battlefield quirks: Engineers' Duel (siege engines only: Ballistas + one Ram + one Catapult), Short Field (enemy Archery 10: stretching the field helps whoever shoots better, so the answer depends on your own Archery), Thousand Cuts (6 waves on a tight budget), Skeleton Crew (125k budget vs 80k infantry, every layer counts). 150 War College ratings in total.
- Fix: "Remove wave" in War College no longer opens the field screen.
- Automated test browsers never join the real high scores.
### 0.1.8
- War College Sieges: 6 player-style cities (Treb Fort, Archer Keep, Pike Hedge, Siege Battery, Trap Field, Warlord's Seat), each with one weak spot and an allowed-troop rule, at three sizes: Outpost (3 waves, all three ratings are loss caps), Stronghold (5 waves), Citadel (6 waves, level 10 walls). Victory = break in (Outposts: capped); Commanding/Masterful = loss caps from optimizer plans at decent (research 8, Atk 200) and high (research 10, Atk 300, x2 set) gear. Data block WC_SIEGES is generated, not hand-edited.
### 0.1.7
- War College tab: battle puzzles run on the real engine with the current city's troops, heroes, gear and research (simulated, nothing dies). Fixed seed 7 per attempt, so a plan always gives the same result.
- Valleys 1-10 (1 wave, no siege; loss caps 0/1/1/1/3x6), NPC 1-5 (1 wave, no losses), NPC 6-10 (up to 4 waves; Victory = win, Commanding = loss caps 3,700/5,600/7,800/11,100/25,400, Masterful = 70/160/420/1,700/2,600).
- Ratings pay out once; saved in S.college {best, got}. High scores get a "War College" board (worker adds the column itself).
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
