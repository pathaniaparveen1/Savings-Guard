const CACHE='saving-guard-v12';
// Precached at install: everything needed for the core app to work offline immediately.
// Large OCR assets (wasm core, language data) are NOT precached here — they'd slow down or
// risk failing the initial install on a slow connection. Instead they're cached opportunistically
// the first time they're actually fetched (see the fetch handler below), so OCR works offline
// from the second use onward without penalizing first install. pdf.min.js is small enough to
// precache directly; pdf.worker.min.js (~1MB) is left to the opportunistic path.
const ASSETS=[
  './','./index.html','./manifest.webmanifest','./icon-180.png','./icon-512.png',
  './msal-browser.min.js','./lib/xlsx.full.min.js','./lib/chart.umd.js',
  './lib/tesseract.min.js','./lib/tesseract-worker.min.js','./lib/pdf.min.js'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

// Network-first for the app shell (so a redeploy is picked up), cache-first for everything else,
// offline fallback to cache. Anything fetched from ./lib/ that wasn't precached (the big OCR
// wasm/language files) gets stored into the cache on first successful fetch, so it's available
// offline afterwards too.
self.addEventListener('fetch', e=>{
  const isShell = e.request.mode==='navigate' || e.request.url.endsWith('/index.html');
  if(isShell){
    e.respondWith(
      fetch(e.request).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, copy));
        return res;
      }).catch(()=>caches.match(e.request).then(r=>r || caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached) return cached;
      return fetch(e.request).then(res=>{
        if(res && res.ok && e.request.url.includes('/lib/')){
          const copy=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
