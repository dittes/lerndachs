/* Visible play time drives gentle recurring discoveries; hidden tabs never accumulate time. */
(()=>{
const J=LerndachsJourney,p=J.profile,interval=10*60*1000;
let last=performance.now(),lastSave=last;
p.playSincePrompt=Number.isFinite(p.playSincePrompt)?Math.max(0,Math.min(interval,p.playSincePrompt)):0;
function save(){J.save();lastSave=performance.now()}
function tick(){
 const now=performance.now(),elapsed=Math.max(0,Math.min(5000,now-last));last=now;
 if(document.hidden||!p.starterUnlocked||p.grade===null||p.opening!=='done')return;
 const busy=!!document.querySelector('dialog[open]')||document.body.classList.contains('is-dragging');
 if(!busy)p.playSincePrompt=Math.min(interval,p.playSincePrompt+elapsed);
 if(p.playSincePrompt>=interval&&!busy){p.playSincePrompt=0;p.taskWaiting=true;save();window.dispatchEvent(new Event('task-waiting'))}
 else if(now-lastSave>30000)save();
}
document.addEventListener('visibilitychange',()=>{last=performance.now();save()});window.addEventListener('pagehide',save);setInterval(tick,1000);
let confettiTimer,confettiEngine,celebrationNumber=0;
const celebrationKinds=['confetti','stars','bubbles'];
function celebrate(event){
 confettiEngine?.destroy();confettiEngine=null;document.querySelector('#learning-confetti')?.remove();clearTimeout(confettiTimer);
 const kind=event.detail?.kind||'confetti';
 if(kind==='confetti'&&window.confetti&&!matchMedia('(prefers-reduced-motion:reduce)').matches&&!document.body.classList.contains('no-motion')){
 const layer=document.createElement('div');layer.id='learning-confetti';layer.className='confetti-canvas-layer';(document.querySelector('dialog[open]')||document.body).append(layer);
 const canvasHost=document.createElement('div');canvasHost.id='confetti-burst-'+(++celebrationNumber);layer.append(canvasHost);
 window.confetti(canvasHost.id,{count:130,spread:95,startVelocity:48,gravity:1.05,decay:.92,scalar:1.1,ticks:220,origin:{x:.5,y:.65},colors:['#4fbaa8','#ffc958','#edb9cf','#f28c72','#ac9bd4'],disableForReducedMotion:true}).then(engine=>{if(layer.isConnected)confettiEngine=engine;else engine?.destroy()});confettiTimer=setTimeout(()=>{confettiEngine?.destroy();confettiEngine=null;layer.remove()},5000);return;
 }
 const layer=document.createElement('div');layer.id='learning-confetti';layer.className='celebration celebration-'+kind;layer.setAttribute('aria-hidden','true');
 const quiet=matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.classList.contains('no-motion');
 layer.classList.toggle('quiet-celebration',quiet);
 const count=quiet?12:kind==='confetti'?72:kind==='stars'?36:24;
 for(let i=0;i<count;i++){
  const particle=document.createElement('i'),shape=document.createElement('b'),angle=Math.random()*Math.PI*2,side=i%2?1:-1;
  const x=quiet?15+Math.random()*70:kind==='confetti'?(side===1?4:96):kind==='stars'?50:10+Math.random()*80;
  const y=quiet?20+Math.random()*50:kind==='confetti'?88:kind==='stars'?48:95;
  const dx=kind==='confetti'?side*(15+Math.random()*35):kind==='stars'?Math.cos(angle)*(10+Math.random()*28):(Math.random()-.5)*24;
  const dy=kind==='confetti'?-(45+Math.random()*35):kind==='stars'?Math.sin(angle)*(12+Math.random()*28):-80;
  particle.className='celebration-particle';shape.className='celebration-shape';
  particle.style.cssText=`--x:${x}%;--y:${y}%;--dx:${dx}vw;--dy:${dy}vh;--spin:${(Math.random()-.5)*1080}deg;--delay:${Math.random()*.3}s;--duration:${1.8+Math.random()*1.2}s;--size:${kind==='bubbles'?18+Math.random()*24:7+Math.random()*12}px;--color:${['#4fbaa8','#ffc958','#edb9cf','#f28c72','#ac9bd4'][i%5]}`;
  particle.append(shape);layer.append(particle);
 }
 const dialog=[...document.querySelectorAll('dialog[open]')].at(-1);(dialog||document.body).append(layer);
 confettiTimer=setTimeout(()=>layer.remove(),quiet?1300:3600);
}
window.addEventListener('learning-celebration',celebrate);
 new MutationObserver(()=>{if(document.body.classList.contains('no-motion')){confettiEngine?.destroy();confettiEngine=null;document.querySelector('#learning-confetti')?.remove()}}).observe(document.body,{attributes:true,attributeFilter:['class']});
})();
