/* Generated offline shell. Updates activate only when the player chooses. */
const CACHE='lerndachs-shell-cf894f9f0da7bfdd';
const ASSETS=["./index.html","./impressum.html","./app.js","./style.css","./immersive.css","./learning.css","./journey.css","./favicon.svg","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png","./adults.css","./social.css","./room-opening.css","./celebrations.css","./living.css","./avatar-editor.css","./card-dock.css","./stage-onboarding.css","./audio/welcome.mp3","./audio/find-dachs.mp3","./audio/found-you.mp3","./audio/move-in.mp3","./assets/avatar-style-catalog.svg","./vendor/confetti.min.js","./vendor/pdf-lib.min.js"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('lerndachs-shell-')&&key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()])));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;
 if(request.mode==='navigate'){event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(request,{ignoreSearch:true}))||(await cache.match('./index.html'))||fetch(request)));return}
 event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(request,{ignoreSearch:true}))||fetch(request)));
});
