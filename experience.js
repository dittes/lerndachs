/* Visible play time drives gentle recurring discoveries; hidden tabs never accumulate time. */
(()=>{
const J=LerndachsJourney,p=J.profile,interval=10*60*1000;
let last=performance.now(),lastSave=last;
p.playSincePrompt=Number.isFinite(p.playSincePrompt)?Math.max(0,Math.min(interval,p.playSincePrompt)):0;
function save(){J.save();lastSave=performance.now()}
function tick(){
 const now=performance.now(),elapsed=Math.max(0,Math.min(5000,now-last));last=now;
 if(document.hidden||!p.starterUnlocked)return;
 const busy=!!document.querySelector('dialog[open]')||document.body.classList.contains('is-dragging');
 if(!busy)p.playSincePrompt=Math.min(interval,p.playSincePrompt+elapsed);
 if(p.playSincePrompt>=interval&&!busy){p.playSincePrompt=0;p.taskWaiting=true;save();window.dispatchEvent(new Event('task-waiting'))}
 else if(now-lastSave>30000)save();
}
document.addEventListener('visibilitychange',()=>{last=performance.now();save()});window.addEventListener('pagehide',save);setInterval(tick,1000);
let confettiTimer;
function celebrate(){
 document.querySelector('#learning-confetti')?.remove();clearTimeout(confettiTimer);
 const layer=document.createElement('div');layer.id='learning-confetti';layer.setAttribute('aria-hidden','true');
 const quiet=matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.classList.contains('no-motion');layer.className=quiet?'quiet-confetti':'';
 for(let i=0;i<(quiet?18:144);i++){const piece=document.createElement('i');piece.style.cssText=`--left:${(i*37)%100}%;--drift:${(i%7-3)*30}px;--turn:${i%2?620:-480}deg;--delay:${i%8*.045}s;--color:${['#4fbaa8','#ffc958','#edb9cf','#f28c72','#ac9bd4'][i%5]}`;layer.append(piece)}
 // Dialog content is in the browser top layer; append confetti there for visible celebrations.
 const dialog=[...document.querySelectorAll('dialog[open]')].at(-1);(dialog||document.body).append(layer);
 confettiTimer=setTimeout(()=>layer.remove(),quiet?1300:3400);
}
window.addEventListener('learning-celebration',celebrate);
})();
