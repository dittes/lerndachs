/* Ephemeral gestures live inside the sprite, never in saved world coordinates. */
(()=>{
'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),active=new Map(),turns=new Map();
let nextIdle=performance.now()+6500,celebrate=false;
const blocked=()=>document.hidden||reduced.matches||document.body.classList.contains('no-motion');
const busy=()=>!!document.querySelector('dialog[open]')||document.body.classList.contains('is-dragging');
const people=()=>[...document.querySelectorAll('#objects .person')];
function sync(){
 const now=performance.now();
 if(blocked()){active.clear();celebrate=false}
 for(const el of people()){
  const action=el.querySelector('.character-action'),gesture=active.get(el.dataset.uid);
  if(!action)continue;
  if(!gesture||now>=gesture.end||blocked()){
   if(gesture&&now>=gesture.end)active.delete(el.dataset.uid);
   action.removeAttribute('data-gesture');action.style.removeProperty('--gesture-delay');continue;
  }
  // Rebuilds after a tap/drag resume the same gesture instead of restarting it.
  if(action.dataset.gesture!==gesture.type){
   action.style.setProperty('--gesture-delay',`${-(now-gesture.start)}ms`);
   action.dataset.gesture=gesture.type;
  }
 }
}
function gesture(el,type,delay=0){
 if(!el||blocked())return;
 const uid=el.dataset.uid;
 // Objects held at a fixed hand position should not be left floating during a hop.
 const snapshot=window.Lernwelt?.snapshot();
 const objects=snapshot?.placed?Object.values(snapshot.placed).flat():[];
 const carrying=(Array.isArray(objects)?objects:[]).some(o=>o.carrier===uid);
 if(carrying)type='look';
 const start=performance.now()+delay;
 active.set(uid,{type,start,end:start+1800});sync();
}
window.addEventListener('world-use',({detail})=>{
 if(!WorldArt.chars.has(detail.id))return;
 const el=people().find(e=>e.dataset.uid===detail.uid),n=turns.get(detail.uid)||0;
 turns.set(detail.uid,n+1);gesture(el,['wave','hop','look'][n%3]);
});
window.addEventListener('character-celebrate',()=>{celebrate=true});
document.addEventListener('visibilitychange',()=>{active.clear();nextIdle=performance.now()+6500;sync()});
reduced.addEventListener('change',sync);
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
setInterval(()=>{
 sync();if(blocked()||busy())return;
 const now=performance.now();
 if(celebrate){celebrate=false;people().forEach((el,i)=>gesture(el,'hop',i*220));nextIdle=now+9000;return}
 if(now<nextIdle)return;
 const list=people(),el=list[Math.floor(Math.random()*list.length)];
 if(el&&!active.has(el.dataset.uid))gesture(el,Math.random()<.45?'wave':'look');
 nextIdle=now+7000+Math.random()*5000;
},180);
window.LerndachsCharacters=Object.freeze({sync});
})();
