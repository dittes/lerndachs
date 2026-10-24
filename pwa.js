/* Installability and user-controlled updates. No push subscriptions or tracking. */
(()=>{
let installPrompt,registration;
const notice=document.querySelector('#pwa-notice');
function announce(text,label,action){notice.replaceChildren();const span=document.createElement('span');span.textContent=text;notice.append(span);if(label){const b=document.createElement('button');b.textContent=label;b.onclick=action;notice.append(b)}const close=document.createElement('button');close.textContent='×';close.setAttribute('aria-label','Hinweis schließen');close.onclick=()=>notice.hidden=true;notice.append(close);notice.hidden=false}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;document.body.classList.add('can-install')});
window.addEventListener('appinstalled',()=>{installPrompt=null;document.body.classList.remove('can-install');announce('Lerndachs ist installiert. Viel Spaß in deiner Welt!')});
async function install(){document.querySelector('#panel')?.close();if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;return}announce('Du kannst Lerndachs über die Installationsfunktion deines Browsers zum Startbildschirm hinzufügen, wenn dein Browser das unterstützt.')}
document.addEventListener('click',e=>{if(e.target.closest('[data-install-app]'))install()});
if('serviceWorker'in navigator&&/^https?:$/.test(location.protocol)){
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>{
  registration=r;
  const ready=()=>announce('Eine neue Version von Lerndachs ist bereit. Dein Spielstand bleibt gespeichert.','Aktualisieren',()=>{LerndachsJourney.save();r.waiting?.postMessage({type:'ACTIVATE_UPDATE'});navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true})});
  if(r.waiting)ready();r.addEventListener('updatefound',()=>{const w=r.installing;w?.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)ready()})});
 }).catch(()=>{document.body.dataset.offlineCache='unavailable'});
}
window.LerndachsPWA={install,get registration(){return registration}};
})();
