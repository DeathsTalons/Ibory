# Ibory (phone app)

A single-player, real-time remake of Evony Age 1, set in North March. One HTML file, no build step.

## Files
- `index.html`: the whole game
- `sw.js`: offline worker. **Bump `CACHE` (ibory-vNN) on every release.**
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
- Michelangelo's Script: every upgrade to level 10 (any building) uses one. Dropped by level 5+ NPC cities, 0.5% at level 5 rising to 1% at level 10. Save v39 to v40, existing saves migrate on load.
