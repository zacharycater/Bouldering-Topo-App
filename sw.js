const V='bl-v1',SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='tiles').map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.hostname.endsWith('tile.openstreetmap.org')){
  e.respondWith(caches.open('tiles').then(async c=>{
   const m=await c.match(e.request);if(m)return m;
   try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}catch(_){return Response.error()}}));return}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(m=>m||fetch(e.request)));
});
