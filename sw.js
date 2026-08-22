const CACHE='saving-guard-v6';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-512.png','./msal-browser.min.js','./lib/xlsx.full.min.js','./lib/chart.umd.js'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

// Network-first for the app shell (so a redeploy is picked up), cache-first for everything else, offline fallback to cache.
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
  e.respondWith(caches.match(e.request).then(r=>r || fetch(e.request)));
});
