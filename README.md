# ArthSetu v3 — modernized, iPhone-ready PWA

## What changed from v2
- **App-shell redesign**: native-feeling tab navigation (Guard / Add / History / Settings) instead of one long scroll, using Apple's system type scale, grouped inset lists, and translucent blurred bars — matches iOS look and feel.
- **"Guard Ring" signature visual**: an Activity-ring-style progress ring on Home showing expected saving vs. your ₹25,000 target (green/amber/red), replacing the flat progress bar.
- **Data trust fixes** (this was the reported issue — entries were saved but there was no confirmation they persisted):
  - Every save now shows a toast: "✓ Saved — N entries stored".
  - Settings shows live storage stats: entry count, last-saved timestamp, last backup date — read back directly from storage after each write, not just assumed.
  - Service worker changed from cache-first (could serve a stale app after updates) to **network-first for the app shell**, with an in-app "Update ready — Reload" banner.
- Dark mode follows the system automatically.

## Test locally first (recommended before deploying)
1. On your Mac:
   ```
   cd saving-guard-v2
   python3 -m http.server 8000
   ```
2. Open `http://localhost:8000` in Safari/Chrome on the Mac and test entering expenses, switching tabs, exporting/importing a backup.
3. To test the real iPhone install experience (Add to Home Screen, offline caching) you need HTTPS — `localhost` alone won't work from a phone on your Wi-Fi. Two easy options:
   - **Temporary tunnel**: `npx localtunnel --port 8000` or `cloudflared tunnel --url http://localhost:8000` — gives you a temporary HTTPS URL to open in iPhone Safari.
   - **Free static host**: push this folder to GitHub Pages / Netlify / Vercel as a private/unlisted deploy first, test there, then treat that same URL as your "promoted" version once you're happy.
4. On iPhone: open the HTTPS URL in **Safari** → Share → **Add to Home Screen** → Add. Open from the Home Screen icon.

## OneDrive auto-sync setup
The code is wired in but needs one value from you:
1. In `index.html`, find `const ONEDRIVE_CLIENT_ID = 'YOUR_AZURE_CLIENT_ID';` near the bottom of the `<script>` block.
2. Replace it with your Azure "Application (client) ID" (from Azure Portal → App registrations → your app → Overview).
3. Make sure the app's redirect URI (Azure Portal → Authentication) is set to a **Single-page application (SPA)** platform, with the value exactly matching your deployed URL (e.g. `https://yourname.github.io/saving-guard/index.html` or `.../saving-guard/` — match whichever URL the app actually loads from).
4. Deploy, open the app, go to **Settings → Connect OneDrive**, sign in with your personal Microsoft account, approve the permission (it only asks for access to a private app folder — `Apps/<your Azure app's display name>` inside your OneDrive, not your whole Drive). Name the Azure app registration itself "ArthSetu" in Step 2 above so this folder is actually called `Apps/ArthSetu`.
5. From then on, every expense you save also syncs to that OneDrive folder automatically. "Sync now" forces an immediate sync; "Disconnect" signs out.

This won't work over `http://localhost` for the popup login in all cases — test it on the real deployed HTTPS URL.

## Important — about data persistence
Data is stored in the browser's local storage on that device only. This is fast and works fully offline, but:
- Clearing Safari website data, or deleting and reinstalling from Home Screen, **will erase it**.
- There is no cloud sync in this version — it's one device only.
- Use **Settings → Export backup** regularly (or before any iOS update) and keep the JSON file somewhere safe (e.g. iCloud Drive, email to yourself). Settings also shows how long it's been since your last backup.

If reliable persistence across reinstalls/devices matters, the next real fix is a lightweight cloud sync (e.g. a small backend or Firebase) rather than trusting on-device storage alone — worth doing before wide "promotion" of the app.

## Files
- `index.html` — the whole app (HTML/CSS/JS, no build step)
- `sw.js` — service worker (offline cache, network-first shell)
- `manifest.webmanifest` — PWA metadata
- `icon-180.png`, `icon-512.png` — home screen icons (unchanged from v2)
