# Ibory (phone app)

Version 0.1.56

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
Settings has save codes and Save to file / Load from file. Current save version: 48.

## Release notes
### 0.1.56
- Settings: Update now button (clears the game's cached files and the offline worker, fetches the newest version and reloads; the save is not touched). A Saving line tells you if the browser is keeping your save (private browsing doesn't) and asks the browser not to clear it. No save or Worker change.
### 0.1.55
- Repeat marches now keep going through losses. Each relaunch sends whatever of the original army is home, and stops only if the attack fails, fewer than half the original troops are home, or food, a hero or a slot is missing. A new checkbox, Stop repeating if it loses any troops, brings the old behavior back. No save or Worker change.
### 0.1.54
- High scores show each player's picture and frame next to their name (yours instantly, others from the server, loaded only for the rows on screen). Needs the matching Worker (scores-worker 0.1.54): board rows now carry the player's cloud account link and a new GET /me/img serves pictures as plain images. Players appear with a picture after their game next syncs with a cloud save.
### 0.1.53
- Character image: any picture works, including phone screenshots (PNG), WebP, GIF and others. Whatever you pick is converted to a small JPEG, so the file type never matters. Files whose type the phone doesn't report are accepted too.
### 0.1.52
- Fix: the offline worker could save an old copy of the game under the new version name (it re-used the browser's cached files when installing an update), so an update looked installed but never showed. It now always downloads fresh files when updating. If 0.1.51 is stuck on your phone, this release replaces it.
### 0.1.51
- The Me tab is gone. Your character picture now sits at the top left of the screen (with your frame), and tapping it opens the Me page. No save or Worker change.
### 0.1.50
- New Me tab: your account stats (prestige, cities, troops killed and lost, top hero, best star set, achievements, War College stars, Kingdom rep, War Marks, days played), your alliance and honor, and your character image.
- Character image: upload a picture, it is cropped to a small 128x128 square and kept in your save. With a cloud save it is sent to the Worker, and alliance mates see it with your frame on the Members list.
- Frames: cosmetic borders around the character image, optional (None is the default). Tap a frame, or tap your picture, to switch between the ones you own. The first is Bug Hunter, which every account owns for now (FRAMES_FOR_ALL in index.html; empty it at the beta cutoff). Save version 48.
- Alliance chat can be pinned to the bottom of every page (tick Pin chat to bottom on the Alliance chat page).
- March presets: Copy and Paste buttons move troops, hero and stop-on-loss between presets.
- Repeat marches: tick Repeat on an attack or conquer march (or tap Repeat on a march in progress) and the same army relaunches each time it is home. It stops on any loss, a failed fight, a busy hero, a missing army or not enough food.
- The Quests button hides once every quest is done.
- High scores has a new Invasion honor board. The server reads honor from your verified cloud account, so it can't be faked.
- Worker update needed (scores-worker 0.1.50): new profiles table, POST /me/set and /me/get, honor column on players, POST /admin/api/avatar {key,name,ban} to remove a picture.
### 0.1.49
- Star upgrade odds reworked to follow Age 2: a steeper curve, and the number of gems per try now matters a lot. Four Flawless gems are 95% at 0 stars, 90% at 5 and 50% at 11, then keep falling about 6 or 7 points a star. Each gem fewer than four takes off 15 points (one Flawless is 45% at 5 stars). Four Delicate gems are 90% at 0 stars and lose 5 points a star (65% at 5, 60% at 6); each gem fewer takes off about 8 points (one Delicate is 40% at 5 stars). Never below 1%. The hero stat bonus (up to +10 points) still applies. What a failure drops you to is unchanged.
- Existing saves: every piece of gear above 5 stars goes back to 5 stars on load (save version 47). Other gear stats are untouched.
- No Worker change.
### 0.1.48
- Valleys and flats no longer drop Delicate or Flawless Gems or gear crafting materials (Rough Ore, Fine Ingot, Mithril, Star Metal). Their medals, books and other items are unchanged.
- NPC cities only drop medals, medal boxes and items when their troop garrison is full when the fight begins (every troop type back at its full count; fortifications don't count). Otherwise you still get the resources, and the march message says why nothing dropped. The NPC tile carries a hint about it.
- No Worker change.
### 0.1.47
- High scores, Quests, Achievements and Settings now open as tabs (like Items and Wheel) instead of pop-ups or a full-screen window. Their header buttons highlight while you are on them, and any normal tab takes you back out. On the Battlefield they still open as pop-ups.
- No Worker change.
### 0.1.46
- Medic Camp: an Auto-heal toggle (per city). While it is on, the wounded are healed as soon as there is gold for them, oldest first, and gold you hold back in the Warehouse reserve is left alone.
- Tabs are now two rows that fit the screen without scrolling. Row 1: City, Map, Army, Farms, Heroes, Reports. Row 2: Alliance, Kingdom, War Room, War College. Items (with its ready count) and the Wheel are buttons in the top right; Achievements is now an icon with its count so the row fits.
- Alliance tab: an "All alliances" page inside your alliance shows the ranked list (prestige, members, cities, honor) while you are in one, with your own marked.
- No Worker change since 0.1.45.
### 0.1.45
- Monster Arena: an alliance can have as many monsters up at once as it has Arena slots (5, up to 10 with Arena Marshals). Each has its own 5-minute window and card on the Arena page; your Arena slots are shared across all of them. The chip next to Help shows how many are up and the soonest countdown.
- Monsters rebalanced for top heroes (attack in the 800s, high star sets): level 10 now takes roughly 10 to 15 full marches of the right troops with heroes like that.
- Iron Titan extra drops lowered: Fine Ingot 3% + 4% per level, Mithril 1% + 1.5% per level, Star Metal 0.5% + 0.5% per level (level 10: 43%, 16%, 5.5%).
- Needs the updated Worker (worker.js).
### 0.1.44
- Alliance Warehouse (built in the Alliance City): every member gets a private box in their own save, safe from plunder. Level 1 takes 100 million resources a day in any mix (resets at midnight UTC), doubling with each level; Alliance Vault adds 10% per level. Take things out any time, into any city, even after leaving the alliance.
- Monster Arena (built in the Alliance City; new Arena page in the Alliance tab):
  - Five monsters, levels 1 to 10. Level N needs the Arena at level N and a kill of level N-1 of that monster.
  - Goblin (food): weak to mounted troops, decimates archers. Drops Delicate Gems.
  - Ent (lumber): weak to foot soldiers, decimates mounted troops. Drops Annals of Conquest (level squared) and some of each resource.
  - Golem (stone): weak to foot soldiers, decimates siege engines. Drops 15-minute speed-ups (1, 2, 4, 8...).
  - Iron Titan (iron): only siege really hurts it (everything else does 15%), stomps foot soldiers. Drops 1 Rough Ore plus chances of Fine Ingot, Mithril and Star Metal that grow with level.
  - Dragon (gold): weak to archers, decimates mounted troops. Drops Flawless Gems.
  - Weak-to class does 2.5x damage, others 50%; the class a monster decimates takes 2.5x losses.
  - 10 free summons a day per alliance (Monster Lore adds 1 per level). After that a summon costs its resource from the bank: 10M at level 1, x10 each level. Members with the bank permission can keep back an amount paid summons can't touch. Summoning needs the monster permission.
  - A summoned monster waits 5 minutes. Send marches from the Arena page (the usual march sheet, presets work): they need a hero, use Arena slots (5, plus Arena Marshals, a new Alliance-tree research) instead of the Rally Spot, and travel 1 minute plus 15 seconds per map square, faster with march speed bonuses and Swift Allies.
  - When the window closes, every march fights together. Nobody dies: losses come home wounded to the city's Medic Camp. If it falls, everyone who joined gets the same reward.
  - A chip next to Help shows the countdown while a monster is up.
- Needs the updated Worker (worker.js). Save version 46.
### 0.1.43
- Alliance City (Alliance tab, Alliance City): the alliance bank, construction and the University's research tree.
  - Donate resources from any city to the bank (every 1,000 is a contribution point).
  - Lend a city's Academy to the alliance (research points: Academy level x 100 an hour, faster with Scholarship and your researcher; it can't research for its city meanwhile) and 0, 1 or 2 of its builders (construction points: Town Hall level x 100 an hour each, faster with Construction and your mayor; they can't build at home). Points keep coming while the game is closed, and every 100 is a contribution point.
  - Construction points build the University and upgrade the Alliance City (levels 1-10; buildings can't pass the city's level). The University appears on the alliance map as a 3 x 3 block.
  - Research points go into the University's research: four trees (Production, Construction, Alliance, Army), each in tiers. Tier N needs University level N and every tier N-1 research of that tree finished. One research at a time (Second Desk adds another). Starting research needs the research permission; building needs the bank permission.
  - Bonuses that already work: production per resource and overall, gold, Warehouse protection, build and research speed, march speed, hero experience, troop attack, defense and life, carrying load, troops per march, +1 city, help time, member cap, research and construction point boosts. The rest (Alliance Vault, Swift Allies, Shield Wall, Monster Lore, Hall of Envoys) are researchable now and start working with the Warehouse, reinforcements and monsters.
  - Contribution ranking and a list of what finished.
  - Pace: a tier-1 level-1 research is 500k points (about a day for 10 members lending one Academy each); each level costs 1.35x more and each tier 2.5x. University level 1 is 120k construction points; each building or city level costs 1.8x more.
- Needs the updated Worker (worker.js).
### 0.1.42
- The alliance map is now 15 x 15, with the Alliance City as a 3 x 3 block in the middle (alliance buildings will be 3 x 3 too unless noted). Maps made with 0.1.41 start over with everyone placed around the city. To move the city, tap it, Move the city, then tap where its middle should go: the whole 3 x 3 block must be free.
### 0.1.41
- Alliance map (Alliance tab, Map): a 20 x 20 grid shared by the whole alliance. The Alliance City takes one square in the middle; every member has one square for their kingdom (all their cities together). New members are placed on the free square nearest the city, and existing alliances get everyone placed automatically.
- Tap any square to see who's there, their prestige and cities, and how far it is from your kingdom. Move your own kingdom to any free square (tap your square, Move my kingdom, then tap where; or tap a free square and Move my kingdom here). Moving the Alliance City or other members' kingdoms needs the map permission.
- Map distance will set how long reinforcements take (next update). Donations and alliance buildings come after that.
- Needs the updated Worker (worker.js): it adds the map table by itself.
### 0.1.40
- Alliance help: every build and research you start (in any city) is posted to your alliance as a project, and closes when it finishes or is cancelled. A Help button (raised hand, with a count) appears right of Settings whenever there's something you can help with: one tap helps every open project. Each member helps each project once; each help takes 1 minute off. Help you receive is applied to your timers on the next sync (within a minute), with a message saying what was helped.
- New Projects page in the Alliance tab: everyone's running projects, time left, how many have helped, and a Help all button.
- Needs the updated Worker (worker.js): it adds the projects table by itself.
### 0.1.39
- Player alliances, part 1 (new Alliance tab; needs a cloud save):
  - Browse every alliance, ranked by prestige, members, cities and honor. Apply with an optional message, withdraw, or found your own (name, 2-4 letter tag, description). Room for 10 members to start.
  - Five ranks (Founder, Officer, Veteran, Member, Recruit by default). The founder renames them and picks what each rank can do: answer applications, remove members, change ranks, edit the description, moderate chat, and (for later parts) spend the alliance bank, move things on the alliance map, summon monsters, start alliance research. Everyone can only act on ranks below their own. The founder hands the alliance on before leaving, or disbands it when alone.
  - Alliance chat: updates every few seconds while open (even while you type), with an unread count on the tab. Remove your own messages; moderators remove any and can mute members.
  - Member prestige and cities come from each member's latest cloud save, so they update about hourly.
- Honor: a new stat, the prestige of enemy troops you kill in invasions (alliance wars will add to it later). Battlefield doesn't count.
- The old alliance with AI lords is now called your Kingdom (Kingdom tab, Kingdom War, kingdom rep).
- Needs the updated Worker (worker.js): it adds the alliance tables and an honor column by itself.
### 0.1.38
- March presets can be loaded in the Hide troops in the woods menu (troops and the preset's hero).
### 0.1.37
- Hiding troops reworked: the button sits at the top of the Map tab, every group is its own march with its troops listed, each takes a Rally Spot slot and the usual army size limit, and hidden troops hunt for their own food. (Folded into the 0.1.36 notes below.)
### 0.1.36
- Research with 5 minutes or less left can be finished free, like buildings.
- The build and research queues now live in a "Queued" dropdown inside the running-work dropdown at the top, instead of on the City and Academy pages.
- Hide troops in the woods (button at the top of the Map tab): send troops (and a hero) out of the city where attackers won't find them. Each group is its own march, listed with its troops, and "Recall now" brings it back instantly. Hidden troops hunt for their own food. Each group takes a Rally Spot slot and the usual army size limit.
### 0.1.35
- Camps reworked: an Occupy march now has a "Stay and make camp" box. If it wins, that army (and its hero) stays on the tile as a camp; nobody can join it later. Without the box, the army comes home as before. Pick the camp under "March from" to attack, scout or occupy from it; those marches return to the camp and send their plunder home. Camps show on the map as a red tent on the held tile, so others can spot them; attacks on camps come later, with invasions and player alliances. Station-troops marches from 0.1.34 are gone.
### 0.1.34
- Camps: station troops (and a hero) on a valley or flat you hold. When you attack, scout or occupy, pick the camp under "March from" and the march leaves from that tile: shorter trips to far targets. The army comes back to the camp, and its plunder goes straight home. The held tile's panel shows the camp, lets you station more troops, and packs it up (everyone marches home). Releasing the tile packs up its camp. A camp counts as one of your marches. Camps can't be attacked.
- Share reports: a Share button on any full battle report sends a copy to the server and gives you a link anyone can open (no app needed). Links last 30 days; sharing the same report again keeps it 30 more days.
- Needs the updated Worker (worker.js): it adds a table for shared reports by itself.
### 0.1.33
- Fortification goals: the same line system as troop goals, in Walls and fortifications. Turn on Auto-build and the wall crews build from the first unfinished line whenever they're free, leftmost short fortification first, and go back to line 1 the moment an attack knocks it short. Each line has its own order and batch size (Auto is about 30 minutes of work). Lines can be typed like tp:100,ab:50,at:20 (tp traps, ab abatis, at archer towers, rl rolling logs, tb trebuchets). Locked kinds, or ones with no wall space left, are skipped. Respects the Warehouse reserve.
### 0.1.32
- Troop goals are now lines, worked top to bottom (Army tab). Auto-train finishes line 1 before starting line 2, and goes straight back to the first line that falls short, after a battle say. Within the active line, idle Barracks take the leftmost short unit. Counts include troops training and out on marches.
- Each line has its own unit order and its own batch size (how many one Barracks trains at a time; Auto is about 30 minutes of work). Make line 1 one of every layer at batch 1 to rebuild layered defenses first, then bigger lines below.
- Lines can be typed or pasted as text, like wa:1,pi:1,sw:1,ar:1 (wo, wa, sc, pi, sw, ar, tr, cav, cata, ba, ra, cp; bot-style w, s, p, a, t, c, b, r work too). Units the city can't train yet are skipped so they never stall a line. Lines can be moved, copied and deleted.
- Old goals and priority order become line 1 automatically.
- All cities: a read-only overview (first button on the city bar) with every city's resources and rates, population, marches out, troops (tap for the breakdown: out, training, wounded) and every running timer, with a Go button to switch.
### 0.1.31
- Saves can't silently reset any more. If your saved game fails to open, Ibory keeps the original untouched, stops saving, and shows a recovery screen: restore a safety copy, copy the unopened save for the developer, or start fresh on purpose.
- Safety copies: the game keeps copies on the device (one every half hour while you play, your strongest game, and one right before a new city, a save load or a cloud restore replaces your game). Settings > Safety copies restores any of them. If a game is missing but copies exist, Ibory offers to restore one.
- Starting a new city now needs you to type RESET.
- Settings has a separate Gift codes box. The Developer box takes only the developer password.
- March info shows which hero is leading, including heroes picked automatically by a preset ("No hero" when none). Wave plans list the leaders.
- High scores: the Top hero board shows each player's hero name next to the level.
- The server's cheat checks count plunder from attacks as income, so NPC farming no longer trips the resource flag. Flags only ever show on the admin page; nothing is blocked.
- Valleys and flats you attack in the 5 hours before the daily reset (or with an army still marching to them across it) skip that night's level-up, so a farming preset doesn't meet a tougher garrison while you're away. They level up normally from the next reset. Keep hitting one every day in that window and it stays put.
- Fixed heroes stuck as "marching" with no march out: the game now checks every tick that only heroes on a real march count as away, which also frees ones already stuck in existing saves.
- Needs the updated Worker (worker.js): it adds a hero name column to the players table by itself.
### 0.1.30
- The daily reset (valleys and flats gaining a level, daily alliance tasks) now happens at midnight Eastern time (New York, with daylight saving) for everyone, instead of at each phone's own midnight. Nothing jumps when you update: every valley and flat keeps its current level and the day number is kept; only the time of the next rollover moves.
### 0.1.29
- Invasions: after you've been invaded you choose how long you stay safe: 24 hours, 72 hours, 7 days or 14 days (a setting in the Invasions section; 72 hours until you pick). Short means more invasions and more War Marks.
- The invader can leave an invasion at any time. If they haven't attacked anything it is cancelled and nothing counts; if they have, they must wait an hour after their latest attack (scouting doesn't count). A cancelled invasion that was already fighting still charges any March Speed-ups used.
- Needs the updated Worker (worker.js): it adds a column to the invasion players table by itself.
### 0.1.28
- Starforged tuned: per tier it adds +1 point to Delicate and Flawless Gem drops, +0.1 point to ingot and ore chances, and +0.01 point to mithril, starmetal and Dragon Scale chances.
### 0.1.27
- Starforged now adds flat percentage points instead of multiplying: each tier adds +1 to the chance of a Delicate Gem (35% base), a Flawless Gem, a Dragon Scale and a crafting ore. Tier 5 is +5 points.
### 0.1.26
- Invasions (testers only for now, Alliance tab): opt in with a cloud backup and at least two cities, press Find a target, and the server pairs you with a player of similar army strength. Your camp lands on their map, you scout for up to 6 hours (pick a target by hour 6, or it is cancelled), then the two camps fight for 6 hours. Raiding only: troops fall and resources are plundered above the Warehouse's protection; no city changes hands.
- The city that goes out is marked (away): its troops leave with the camp and its builds, research and training wait until it is home. The result comes from the server's ledger and is applied once: troops lost, forts lost, plunder, War Marks and used Teleports or March Speed-ups. A restored backup cannot undo a loss.
- Defenders see the landing, can scout the camp with their own scouts, and fight with a copy of the picked city. Close the gate to hide troops.
- Needs the updated scores Worker (worker.js) deployed first: its tables create themselves. Admin page has a new Invasions tab.
- Save version 42 (adds War Marks and the invasion log).
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
