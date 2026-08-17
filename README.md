# Saving Guard — iPhone-ready PWA

## Install on iPhone 13
1. Put these files on an HTTPS web host (GitHub Pages, Cloudflare Pages, Netlify, Vercel, etc.).
2. Open the HTTPS address in **Safari** on the iPhone.
3. Tap **Share → Add to Home Screen → Add**.
4. Open **Saving Guard** from the Home Screen.

A PWA service worker requires HTTPS (localhost is the development exception).

## Included
- iPhone safe-area layout and touch-friendly controls
- Standalone PWA manifest
- Service worker/offline cache
- Home-screen icon
- Local expense storage
- Export/import JSON backup
- Editable salary
- Install instructions inside the app
- Existing ₹25K saving guard logic and travel quick-adds

## Important
The app is currently local-first: data stays in the browser/device. Export backups periodically.
Native scheduled iOS notifications require an additional push-notification/backend layer; this version does not pretend that local browser timers can reliably wake iOS in the background.

## Development
Serve over localhost:
`python -m http.server 8000`
Then open `http://localhost:8000` on a device/emulator on the same network as appropriate.

For real iPhone installation, deploy the folder to an HTTPS host.
