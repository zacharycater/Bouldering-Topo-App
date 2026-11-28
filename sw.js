const V='bl-v23',SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{}))))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='tiles').map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.hostname.endsWith('tile.openstreetmap.org')||u.hostname==='server.arcgisonline.com'||u.hostname==='api.maptiler.com'){
  e.respondWith(caches.open('tiles').then(async c=>{
   const m=await c.match(e.request);if(m)return m;
   try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}catch(_){return Response.error()}}));return}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(m=>m||fetch(e.request)));
});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
