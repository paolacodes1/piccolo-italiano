// Lets the game work without internet after the first visit.
const CACHE='piccolo-v1';
const FILES=['./','index.html','icon-180.png','icon-192.png','manifest.webmanifest',
  'audio/common.json','audio/animali.json','audio/colori.json','audio/numeri.json','audio/cibo.json','audio/corpo.json','audio/veicoli.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// network first (so updates show up), saved copy when offline
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r&&(r.ok||r.type==='opaque')){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
