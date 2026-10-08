Ibory phone app
Files: index.html (the game), sw.js (offline worker), manifest.webmanifest, three icons.
Upload all of them to the root of your GitHub Pages repo, replacing the old ones.
Each release: change CACHE in sw.js (ibory-vNN) to a new value.
Updating the phone: open the app online, close it, open it again.
Saves stay in the phone's localStorage and are not affected by updates.
