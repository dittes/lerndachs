'use strict';
const $=s=>document.querySelector(s);
const A=WorldArt,{C,R,E,P,cast,homes,decor,bounds,chars}=A;
const art=(id,home,appearance)=>window.LerndachsAvatar?.art(id,appearance)||window.KunterbuntArt?.art(id)||window.LerndachsSeason?.art(id)||LerndachsWorld.petArt(id)||LerndachsPeopleArt.art(id)||A.art(id,home);
const escapeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={settings:'<path d="m9 2-1 4-4 1-2 4 3 3-1 4 4 2 4-2 4 2 4-2-1-4 3-3-2-4-4-1-1-4Z"/><circle cx="12" cy="12" r="3"/>',house:'<path d="m3 11 9-8 9 8v10H3Zm6 10v-8h6v8M7 8V4"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',moon:'<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>',sound:'<path d="m11 4-6 5H2v6h3l6 5Zm4 5q3 3 0 6m3-9q6 6 0 12"/>',friends:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-4a7 7 0 0 1 14 0v4M17 3a4 4 0 0 1 0 8m1 3q4 1 4 7"/>',chair:'<path d="M5 14V8q0-5 7-5t7 5v6M5 12q-4-3-4 2v4h22v-4q0-5-4-2M4 18v4m16-4v4M5 15h14"/>',shop:'<path d="M3 10v12h18V10M2 3h20l1 6q-3 5-6 0-2 5-5 0-3 5-6 0-3 5-5 0Zm7 19v-8h6v8"/>',bag:'<path d="M5 7h14l3 15H2Zm3 0V5a4 4 0 0 1 8 0v2M8 12h.01M16 12h.01m-7 4q3 3 6 0"/>',spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',flip:'<path d="M12 2v20M2 18l6-12v12Zm20 0L16 6v12Z"/>',left:'<path d="m14 5-7 7 7 7m-6-7h12"/>',right:'<path d="m10 5 7 7-7 7m6-7H4"/>',pause:'<path d="M8 5v14m8-14v14" stroke-width="4"/>',play:'<path d="m8 4 12 8-12 8Z"/>'};
function icon(n){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]||icons.spark}</svg>`}
document.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon));
const KEY='lerndachs.world.v3';
const allItems=[...cast,...decor,...homes];
const item=id=>allItems.find(i=>i.id===id);
const uid=()=>crypto.randomUUID();
function fresh(){return {version:3,balance:0,owned:['garden','radio',...LerndachsWorld.environment],home:'garden',night:false,paused:false,wallpapers:{},placed:{garden:LerndachsWorld.empty()},stored:{},receipts:[],journey:{grade:null,starterEarned:false,starterUnlocked:false,done:[],active:null,index:0,target:null,together:false,turn:1,worldMoves:[],practice:0,badges:[]}}}
let state=fresh(),storageOK=true,newWorld=true;
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved?.version===3&&saved.journey&&Number.isSafeInteger(saved.balance)&&saved.balance>=0&&Array.isArray(saved.owned)&&saved.placed&&saved.stored&&Array.isArray(saved.receipts)&&homes.some(h=>h.id===saved.home)){newWorld=false;state=saved;state.journey={...fresh().journey,...saved.journey};state.wallpapers??={}}}catch{}
const visitDay=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
let resetGame=false;
try{const url=new URL(location.href);resetGame=url.searchParams.get('reset')==='1';if(url.searchParams.has('intro')||url.searchParams.has('reset')||url.searchParams.has('update')){url.searchParams.delete('intro');url.searchParams.delete('reset');url.searchParams.delete('update');history.replaceState(history.state,'',url)}}catch{}
if(resetGame){state=fresh();newWorld=true}
// The curtain belongs exclusively to a new player's first visit or explicit reset.
if(newWorld)Object.assign(state.journey,{onboardingVersion:2,curtainFlowVersion:1,opening:'grade',firstVisitDay:visitDay()});
if(!newWorld&&state.journey.onboardingVersion===2&&state.journey.opening==='curtain'&&state.journey.grade===null)state.journey.opening='grade';
// A previously completed welcome must never replay because of an old recovery marker.
if(!newWorld&&state.journey.introReturnOpening){state.journey.opening=state.journey.introReturnOpening;delete state.journey.introReturnOpening}
// Existing friends are preserved. New worlds choose their sole first figure explicitly.
const allPeople=()=>[...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].filter(o=>chars.has(o.id));
for(const person of allPeople())if(person.characterName==='undefined')person.characterName=item(person.id)?.name||'Freund';
if(!state.journey.playerUid&&allPeople().length)state.journey.playerUid=allPeople()[0].uid;
if(!state.radioWelcomed){if(![...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].some(o=>o.id==='radio'))state.placed[state.home].push({uid:uid(),id:'radio',x:1180,y:790,s:.8,layer:3.6,on:false});if(!state.owned.includes('radio'))state.owned.push('radio');state.radioWelcomed=true}
state.audioSettings??={enabled:true,volume:.6,station:0};if(!state.audioSettings.gainVersion){if(state.audioSettings.volume===.35)state.audioSettings.volume=.6;state.audioSettings.gainVersion=1}
if(!state.audioSettings.radioSwitchVersion){for(const o of [...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].filter(o=>o.id==='radio'))o.on=false;state.audioSettings.radioSwitchVersion=1}
if(!state.journey.starterUnlocked){
 state.journey.opening??='explore';
 const existing=[...Object.values(state.placed).flat(),...Object.values(state.stored).flat()];
 for(const o of LerndachsWorld.starterObjects('garden')){
  if(!existing.some(placed=>placed.id===o.id))state.placed.garden.push(o);
  if(!state.owned.includes(o.id))state.owned.push(o.id);
 }
 if(!existing.some(o=>o.id==='dachs'))state.placed.garden.push({uid:'room-dachs',id:'dachs',x:885,y:500,s:1,layer:2.9,pose:'curled'});
}else state.journey.opening??='done';
if(!allItems.some(i=>i.id===state.journey.target&&['decor','pet'].includes(i.kind)))state.journey.target=null;
// Window frames belong to the room, including in existing saved worlds.
for(const home of new Set([...Object.keys(state.placed),...Object.keys(state.stored)])){if(home.endsWith('-outdoor'))continue;
 const fixed=A.defaults(home).find(o=>o.id==='window');if(!fixed)continue;
 const frame=(state.placed[home]||[]).find(o=>o.id==='window')||(state.stored[home]||[]).find(o=>o.id==='window')||fixed;
 Object.assign(frame,fixed,{uid:frame.uid});delete frame.carrier;delete frame.flip;
 state.placed[home]=(state.placed[home]||[]).filter(o=>o.id!=='window');state.placed[home].push(frame);
 if(state.stored[home])state.stored[home]=state.stored[home].filter(o=>o.id!=='window');
}
LerndachsRoomExpansion.migrate(state);
const objectName=o=>o.characterName||o.petName||item(o.id)?.name||A.names[o.id]||'Objekt';
let activePanel='',furnitureTab='props',sound=false,selected=null,drag=null,pan=null,audio;
const reactions=new Map();
const areaKey=()=>state.zone==='outdoor'?state.home+'-outdoor':state.home;
const worldWidth=()=>state.zone==='outdoor'?2000:1600;
const current=()=>state.placed[areaKey()]??=(state.zone==='outdoor'?LerndachsGardenArt.objects():LerndachsWorld.empty(state.home));
const stored=()=>state.stored[areaKey()]??=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{storageOK=false}if(window.LerndachsRewards)LerndachsRewards.sync(state.balance);else $('#balance').textContent=state.balance;$('#bag-count').textContent=stored().length;window.dispatchEvent(new Event('world-saved'))}
let toastTimer;
function toast(message,undo){const t=$('#toast');t.textContent=message;if(undo){const b=document.createElement('button');b.textContent='Rückgängig';b.className='toast-undo';b.onclick=()=>{undo();t.classList.remove('visible')};t.append(b)}t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),undo?6500:2800)}
function syncCarried(){for(const o of current()){if(!o.carrier)continue;const c=current().find(c=>c.uid===o.carrier);if(!c){delete o.carrier;continue}o.x=c.x+(o.dx||55);o.y=c.y+(o.dy??-91);o.layer=5}}
function transform(o){return `translate(${o.x} ${o.y}) scale(${(o.flip?-1:1)*(o.s||1)*(o.sx||1)} ${o.s||1})`}
function specialArt(o){let s=o.id==='dachs'?A.badger(o.pose):art(o.id,state.home,o.appearance);if(o.grown)s=`<g transform="scale(1.12)">${s}</g>`;if(o.id==='yard-lights'&&o.on)s+=E(0,-20,320,55,'#ffe58744');if(o.id==='fridge'&&o.on){s+=`${R(-59,-268,117,246,'#e6edda',10)}${P('M-55-187H55m-110 82H55','none','#8eb5a6',5)}${R(-37,-244,27,46,'#ffd383',5)}${R(12,-228,29,32,'#edb9cf',6)}${E(-13,-141,24,19,C.coral,C.ink,2)}${P('M-12-160v-9','none',C.leaf,3)}${P('M-68-276l-73 27v239l73 13Z','#c5e9db')}${P('M-130-217v40','none',C.deep,6)}`}
 if(o.id==='cabinet'&&o.on)s+=`${R(-130,-126,260,110,C.brown,8)}${R(-116,-110,90,15,C.cream,3)}${R(33,-107,65,38,C.pink,8)}${P('M-139-135l-47 18v107l47 5Z',C.light)}`;
 if(o.id==='fan'&&o.on)s=s.replace('class="fan-spin"','class="fan-spin" style="animation-play-state:paused"');
 if(o.id==='radio')s+=`<g class="radio-light">${E(39,-44,3.5,3.5,o.on?C.yellow:'#a67c6b',C.ink,1)}</g>`;
 if(o.id==='counter'&&o.on)s+=`<g class="water-stream">${P('M63-227v49','none','#84d9ed',7)}${E(73,-175,24,4,'#d3f4f8')}</g>`;
 if(['lamp','pendant'].includes(o.id)&&o.on)s+=E(0,o.id==='lamp'?-55:-25,78,60,'#ffe58738');
 return s;
}
function renderObjects(){syncCarried();const markup=current().filter(o=>o.id!=='dachs'||state.journey.opening!=='done').slice().sort((a,b)=>(a.layer??3)-(b.layer??3)||a.y-b.y).map((o,i)=>{const b=o.id==='dachs'&&o.pose==='curled'?[-80,-95,170,110]:bounds[o.id]||[-50,-100,100,110],isChar=chars.has(o.id),isSmall=b[2]<170&&o.id!=='balloon';return `<g class="${o.id==='window'?'room-fixture':'movable'} ${chars.has(o.id)?'person':''} ${selected===o.uid?'selected':''} ${o.layer===0?'sky-object':''} ${reactions.has(o.uid)?'reacting':''}" data-uid="${o.uid}" data-kind="${o.id}" data-pose="${o.pose||''}" data-on="${!!o.on}" transform="${transform(o)}" tabindex="${o.id==='window'?-1:0}" role="${o.id==='window'?'img':'button'}" aria-label="${o.id==='window'?'Fest eingebauter Fensterrahmen':escapeText(objectName(o))+': bewegen, benutzen oder einpacken'}" style="--idle-delay:${i%7*.37}s"><title>${escapeText(objectName(o))}</title>${R(b[0]-5,b[1]-5,b[2]+10,b[3]+10,'none',13,C.white,4).replace('<rect','<rect class="selection-outline"')}${isSmall?R(Math.min(-38,b[0]),Math.min(-75,b[1]),Math.max(76,b[2]),Math.max(76,b[3]),'transparent',0,'none'):isChar?R(-61,-229,122,235,'transparent',0,'none'):''}<g class="sprite">${specialArt(o)}</g></g>`});$('#objects').innerHTML=markup.filter((s,i)=>!s.includes('data-kind="tree"')).join('');const trees=$('#tree-layer');if(trees)trees.innerHTML=markup.filter(s=>s.includes('data-kind="tree"')).join('');updateSelection();window.WorldSound?.sync();window.LerndachsCharacters?.sync();}
function render(){
 const width=worldWidth();$('#world').setAttribute('viewBox',`0 0 ${width} 900`);$('#world').style.width=`max(100%,calc(100dvh * ${width/900}))`;$('#world').style.aspectRatio=width+'/900';$('#backdrop').innerHTML=state.zone==='outdoor'?LerndachsGardenArt.background():A.shell(state.home,state.wallpapers[state.home]||0);document.body.dataset.zone=state.zone==='outdoor'?'outdoor':'room';for(const id of ['#wall-phone','#wall-schedule']){const node=document.querySelector(id);if(node)node.style.display=state.zone==='outdoor'?'none':''}renderDoor();$('.playground').classList.toggle('night',state.night);document.body.classList.toggle('no-motion',state.paused);
 $('#location').textContent=state.zone==='outdoor'?'Terrasse und Garten':homes.find(h=>h.id===state.home).name;$('#day-label').textContent=state.night?'Geschichten unterm Sternenhimmel.':'Dein Tag. Deine Geschichte.';
 $('#day-toggle').innerHTML=icon(state.night?'moon':'sun');$('#day-toggle').setAttribute('aria-pressed',state.night);$('#day-toggle').setAttribute('aria-label',state.night?'Zum Tag wechseln':'Zur Nacht wechseln');$('#motion-toggle').innerHTML=icon(state.paused?'play':'pause');$('#motion-toggle').setAttribute('aria-pressed',state.paused);$('#motion-toggle').setAttribute('aria-label',state.paused?'Animationen starten':'Animationen pausieren');
 renderObjects();save();panButtons();
}
function select(o){if(o?.id==='window')o=null;selected=o?.uid||null;document.querySelectorAll('.movable.selected').forEach(e=>e.classList.remove('selected'));if(selected)document.querySelector(`[data-uid="${selected}"]`)?.classList.add('selected');updateSelection()}
function updateSelection(){const o=current().find(o=>o.uid===selected);$('#selection').hidden=!o;if(o)$('#selected-name').textContent=objectName(o)}
function worldPoint(e){return new DOMPoint(e.clientX,e.clientY).matrixTransform($('#world').getScreenCTM().inverse())}
function bagHit(x,y){const r=$('#bag-button').getBoundingClientRect();return x>=r.left-20&&x<=r.right+20&&y>=r.top-20&&y<=r.bottom+20}
function effect(o,type='spark'){
 const g=document.createElementNS('http://www.w3.org/2000/svg','g');let x=o.x,y=o.y-(chars.has(o.id)?250:90),s='';
 if(type==='rain'){for(let i=0;i<9;i++)s+=`<path class="fx-drop" style="animation-delay:${i*.07}s" d="M${x-45+i*12} ${o.y+18}l-4 11" stroke="#56b6d1" stroke-width="5" stroke-linecap="round"/>`}
 else if(type==='music'){for(let i=0;i<4;i++)s+=`<text class="fx-note" x="${x-40+i*27}" y="${y-i%2*18}" fill="${[C.coral,C.deep,C.purple][i%3]}" font-size="35" style="animation-delay:${i*.15}s">${i%2?'♫':'♪'}</text>`}
 else if(type==='hearts'){for(let i=0;i<4;i++)s+=`<text class="fx-note" x="${x-35+i*24}" y="${y-i%2*16}" fill="${C.coral}" font-size="28" style="animation-delay:${i*.12}s">♥</text>`}
 else{for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=`<path class="fx-particle" style="--dx:${Math.cos(a)*62}px;--dy:${Math.sin(a)*55-32}px;animation-delay:${i*.025}s" d="m${x+Math.cos(a)*14} ${y+Math.sin(a)*15} 4-8 4 8 8 4-8 4-4 8-4-8-8-4Z" fill="${[C.yellow,C.coral,C.teal,C.pink][i%4]}"/>`}}
 if(o.uid)g.setAttribute('data-source-uid',o.uid);g.innerHTML=s;$('#effects').append(g);setTimeout(()=>g.remove(),2200);
}
function pourWater(o,nozzle={x:69,y:-58,dir:1}){
 const layer=document.createElementNS('http://www.w3.org/2000/svg','g');layer.classList.add('watering-pour');layer.setAttribute('data-source-uid',o.uid);layer.setAttribute('aria-hidden','true');
 const sx=(o.flip?-1:1)*(o.s||1)*(o.sx||1),sy=o.s||1,plant=current().filter(p=>['plant','flower','yard-pot','yard-pot-pink','yard-bed'].includes(p.id)).sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y))[0];let end={x:nozzle.x+nozzle.dir*89,y:45};if(plant){const x=(plant.x-o.x)/sx,y=(plant.y-50-o.y)/sy;if((x-nozzle.x)*nozzle.dir>20&&Math.abs(x-nozzle.x)<300&&y>nozzle.y+20&&y<240)end={x,y}}
 const start={x:nozzle.x,y:nozzle.y},control={x:start.x+nozzle.dir*Math.min(55,Math.abs(end.x-start.x)*.5),y:start.y-50};layer.innerHTML=`<path class="pour-stream" d="M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}" fill="none" stroke="#84cddd" stroke-width="2" stroke-linecap="round" opacity=".55"/>`;
 const quiet=state.paused||matchMedia('(prefers-reduced-motion:reduce)').matches;for(let i=0;i<15;i++){const drop=document.createElementNS('http://www.w3.org/2000/svg','circle');drop.setAttribute('r',String(1.8+i%3*.4));drop.setAttribute('fill',i%2?'#aeeaf1':'#61b7cd');layer.append(drop);const frames=Array.from({length:31},(_,n)=>{const t=n/30,x=(1-t)**2*start.x+2*(1-t)*t*control.x+t*t*end.x,y=(1-t)**2*start.y+2*(1-t)*t*control.y+t*t*end.y;return {offset:t,transform:`translate(${x}px,${y}px)`,opacity:t<.08?t/.08:t>.9?(1-t)/.1:.95}});if(quiet){const t=(i+1)/16,f=frames[Math.round(t*30)];drop.style.transform=f.transform}else drop.animate(frames,{duration:950,delay:i*65,fill:'both',easing:'linear'})}
 queueMicrotask(()=>{const sprite=document.querySelector(`[data-uid="${o.uid}"] .sprite`);if(sprite)sprite.append(layer);else{layer.setAttribute('transform',transform(o));document.querySelector('#effects').append(layer)}});const media=matchMedia('(prefers-reduced-motion:reduce)'),halt=()=>{if(state.paused||media.matches){for(const drop of layer.querySelectorAll('circle'))for(const a of drop.getAnimations())a.cancel();layer.remove()}},observer=new MutationObserver(halt);observer.observe(document.body,{attributes:true,attributeFilter:['class']});media.addEventListener?.('change',halt);setTimeout(()=>{observer.disconnect();media.removeEventListener?.('change',halt);layer.remove()},2200);
}
function animate(o){
 clearTimeout(reactions.get(o.uid));
 reactions.set(o.uid,setTimeout(()=>{reactions.delete(o.uid);document.querySelector(`[data-uid="${o.uid}"]`)?.classList.remove('reacting')},850));
 const el=document.querySelector(`[data-uid="${o.uid}"]`);if(el){el.classList.remove('reacting');void el.getBoundingClientRect();el.classList.add('reacting')}
}
function use(o){
 if(!o)return;select(o);animate(o);window.dispatchEvent(new CustomEvent('world-use',{detail:{id:o.id,uid:o.uid}}));if(window.WorldSound)WorldSound.effect(o.id);if(o.id==='dachs'){select(null);effect(o);if(state.journey.starterUnlocked&&!['curtain','dachs','waking','move-in'].includes(state.journey.opening))window.dispatchEvent(new Event('request-partner-learning'));return}if(o.id==='balloon'){effect(o);return}if(o.id==='clock'){const h=document.querySelector(`[data-uid="${o.uid}"] .clock-hand`);if(!state.paused)h?.animate([{transform:'rotate(0deg)'},{transform:'rotate(720deg)'}],{duration:1000});effect(o);return}
 if(LerndachsWorld.pets.some(p=>p.id===o.id)){effect(o,'hearts');showPet(o);return}
 if(o.id.startsWith('yard-')){const kind=LerndachsGardenArt.behaviours[o.id],sprite=document.querySelector(`[data-uid="${o.uid}"] .sprite`),person=current().find(c=>c.uid===state.journey.playerUid)||current().find(c=>chars.has(c.id));const calm=state.paused||matchMedia('(prefers-reduced-motion:reduce)').matches;if(kind==='sit'&&person){person.x=o.x;person.y=o.y-42;renderObjects();effect(person,'hearts')}else if(kind==='drink'){effect(o,'hearts');toast('Mmmh, Zitronenlimonade!');WorldSound.effect('tea')}else if(kind==='water'){pourWater(o,{x:-61,y:-47,dir:-1})}else if(kind==='shine'){state.night=!state.night;render()}else if(kind==='wear'&&person){if(o.carrier){delete o.carrier;o.y=person.y-5}else{o.carrier=person.uid;o.dx=0;o.dy=-230;o.layer=5}renderObjects()}else if(kind==='grow'){o.grown=!o.grown;renderObjects();effect(o,'hearts')}else if(kind==='chime'){o.on=!o.on;renderObjects();effect(o,'music');WorldSound.effect('guitar')}else{if(!calm)sprite?.animate(kind==='flutter'?[{transform:'translate(0,0)'},{transform:'translate(70px,-50px) rotate(12deg)'},{transform:'translate(-25px,-30px) rotate(-8deg)'},{transform:'translate(0,0)'}]:[{transform:'rotate(0deg)'},{transform:'rotate(-5deg)'},{transform:'rotate(5deg)'},{transform:'rotate(0deg)'}],{duration:1200,easing:'ease-in-out'});effect(o,kind==='chirp'?'music':'spark');if(kind==='chirp')WorldSound.effect('rabbit')}save();return}
 if(o.id==='watering'){pourWater(o,{x:-61,y:-47,dir:-1});return}
 if(o.id==='sun'){sunClick();state.night=!state.night;render();effect(o);return}
 if(o.id==='cloud'){effect(o,'rain');return}
 if(o.id==='radio'){if(window.WorldSound)WorldSound.cycleRadio(o);else o.on=!o.on;renderObjects();if(o.on){effect(o,'music')}else document.querySelectorAll(`[data-source-uid="${o.uid}"]`).forEach(node=>node.remove());save();return}if(o.id==='guitar'){effect(o,'music');save();return}
 if(['lamp','pendant','fridge','counter','cabinet'].includes(o.id)){o.on=!o.on;renderObjects();animate(o);save();return}
 if(o.id==='camera'){const flash=document.createElement('div');flash.className='flash';$('.game-shell').append(flash);setTimeout(()=>flash.remove(),500);effect(o);return}
 if(o.id==='sofa'||o.id==='bed'){const c=current().filter(c=>chars.has(c.id)).sort((a,b)=>Math.abs(a.x-o.x)-Math.abs(b.x-o.x))[0];if(c){c.x=o.x+(c.x<o.x?-65:65);c.y=o.y-52;renderObjects();animate(c)}effect(o);return}
 if(o.id==='fan'){o.on=!o.on;const el=document.querySelector(`[data-uid="${o.uid}"] .fan-spin`);if(el)el.style.animationPlayState=o.on?'paused':'running';save();return}
 effect(o);
}
function pack(o){
 if(!o||['dachs','window'].includes(o.id))return;const home=areaKey(),copy=structuredClone(o),carried=current().filter(x=>x.carrier===o.uid);for(const x of carried)delete x.carrier;
 state.placed[home]=current().filter(x=>x.uid!==o.uid);delete o.carrier;stored().push(o);select(null);renderObjects();save();toast(`${item(o.id)?.name} ist in deiner Tasche.`,()=>{if(!state.stored[home].some(x=>x.uid===copy.uid))return;state.stored[home]=state.stored[home].filter(x=>x.uid!==copy.uid);state.placed[home].push(copy);if(areaKey()===home)renderObjects();save()});
}
function countWelcomeItem(){if(!['shop','second-item'].includes(state.journey.opening))return;state.journey.welcomeItemsPlaced=(state.journey.welcomeItemsPlaced||0)+1;if(state.journey.welcomeItemsPlaced>=3){state.journey.opening='done';renderObjects();window.dispatchEvent(new Event('opening-changed'))}}
function restore(uidToRestore){if(current().length>=120){toast('Packe erst etwas ein, damit Platz bleibt.');return}const o=stored().find(o=>o.uid===uidToRestore);if(!o)return;state.stored[areaKey()]=stored().filter(x=>x.uid!==uidToRestore);delete o.carrier;current().push(o);renderObjects();countWelcomeItem();save();$('#panel').close();focusObject(o);effect(o);toast(`${item(o.id)?.name} ist wieder da.`)}
function focusObject(o){const s=$('#scene-scroll'),scale=$('#world').clientWidth/worldWidth();s.scrollTo({left:Math.max(0,o.x*scale-s.clientWidth/2),behavior:state.paused?'instant':'smooth'});select(o)}
function carryOrDrop(o){if(o.id==='window'||chars.has(o.id)||!bounds[o.id]||bounds[o.id][2]>165||['sun','cloud','hanging','balloon'].includes(o.id))return;const c=current().find(c=>chars.has(c.id)&&Math.abs(c.x-o.x)<72&&Math.abs(c.y-91-o.y)<72);if(c){o.carrier=c.uid;o.dx=o.x<c.x?-55:55;o.layer=5;syncCarried();effect(c)}}
$('#world').addEventListener('pointerdown',e=>{
 const el=e.target.closest('.movable');if(!el||e.button>0||drag)return;e.preventDefault();e.stopPropagation();
 const o=current().find(o=>o.uid===el.dataset.uid);
 const p=worldPoint(e);
 drag={el,o,start:p,ox:o.x,oy:o.y,carrier:o.carrier,layer:o.layer,moved:false,ready:false,latest:e,pointer:e.pointerId};
 select(o);el.setPointerCapture(e.pointerId);$('#welcome-hint').hidden=true;
 drag.timer=setTimeout(()=>{
  drag.ready=true;delete o.carrier;drag.el=document.querySelector(`[data-uid="${o.uid}"]`);drag.el.setPointerCapture(drag.pointer);drag.el.classList.add('dragging');drag.el.parentElement.append(drag.el);document.body.classList.add('is-dragging');WorldSound.effect('tap');moveDraggedObject(drag.latest);
 },320);
});
function moveDraggedObject(e){
 if(!drag||e.pointerId!==drag.pointer)return;
 drag.latest=e;if(!drag.ready)return;
 const p=worldPoint(e);if(p.x!==drag.start.x||p.y!==drag.start.y)drag.moved=true;
 drag.o.x=Math.max(40,Math.min(worldWidth()-40,drag.ox+p.x-drag.start.x));drag.o.y=Math.max(85,Math.min(864,drag.oy+p.y-drag.start.y));drag.el.setAttribute('transform',transform(drag.o));syncCarried();for(const o of current().filter(o=>o.carrier===drag.o.uid))document.querySelector(`[data-uid="${o.uid}"]`)?.setAttribute('transform',transform(o));
 $('#bag-button').classList.toggle('drop-ready',bagHit(e.clientX,e.clientY));const s=$('#scene-scroll');if(e.clientX<40)s.scrollLeft-=12;else if(e.clientX>innerWidth-40)s.scrollLeft+=12;

}
window.addEventListener('pointermove',moveDraggedObject);
function finishDrag(e){
 if(!drag||e.pointerId!==drag.pointer)return;
 const d=drag;drag=null;clearTimeout(d.timer);document.body.classList.remove('is-dragging');$('#bag-button').classList.remove('drop-ready');d.el.classList.remove('dragging');
 if(e.type==='pointercancel'){d.o.x=d.ox;d.o.y=d.oy;d.o.layer=d.layer;if(d.carrier)d.o.carrier=d.carrier}
 else if(d.moved&&bagHit(e.clientX,e.clientY)){d.o.x=d.ox;d.o.y=d.oy;pack(d.o);return}
 else if(d.moved){carryOrDrop(d.o);animate(d.o);WorldSound.effect('drop')}
 else if(!d.ready)use(d.o);
 renderObjects();save();if(d.moved&&e.type!=='pointercancel')window.dispatchEvent(new CustomEvent('world-move',{detail:{uid:d.o.uid,id:d.o.id}}));
}
window.addEventListener('pointerup',finishDrag);window.addEventListener('pointercancel',finishDrag);
$('#world').addEventListener('keydown',e=>{
 const el=e.target.closest('.movable');if(!el)return;const o=current().find(o=>o.uid===el.dataset.uid),delta={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,-15],ArrowDown:[0,15]}[e.key];select(o);
 if(delta){e.preventDefault();delete o.carrier;o.x=Math.max(40,Math.min(worldWidth()-40,o.x+delta[0]));o.y=Math.max(85,Math.min(864,o.y+delta[1]));carryOrDrop(o);el.setAttribute('transform',transform(o));syncCarried();for(const held of current().filter(x=>x.carrier===o.uid))document.querySelector(`[data-uid="${held.uid}"]`)?.setAttribute('transform',transform(held));save();window.dispatchEvent(new CustomEvent('world-move',{detail:{uid:o.uid,id:o.id}}))}
 if(e.key==='Enter'||e.key===' '){e.preventDefault();use(o)}if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();pack(o)}if(e.key==='Escape')select(null);
});
$('#world').addEventListener('focusin',e=>{const el=e.target.closest('.movable');if(el){const o=current().find(x=>x.uid===el.dataset.uid);select(o);focusObject(o)}});
const scene=$('#scene-scroll');
scene.addEventListener('pointerdown',e=>{if(e.target.closest('.movable')||e.button>0)return;pan={x:e.clientX,scroll:scene.scrollLeft,y:e.clientY,moved:false};scene.setPointerCapture(e.pointerId)});
scene.addEventListener('pointermove',e=>{if(!pan||drag)return;if(Math.abs(e.clientX-pan.x)>5)pan.moved=true;scene.style.scrollBehavior='auto';scene.scrollLeft=pan.scroll+pan.x-e.clientX});
scene.addEventListener('pointerup',e=>{if(!pan)return;if(!pan.moved){select(null);const p=worldPoint(e);if(state.zone!=='outdoor'&&p.x<1600&&p.y<580){state.wallpapers[state.home]=((state.wallpapers[state.home]||0)+1)%3;$('#backdrop').innerHTML=A.shell(state.home,state.wallpapers[state.home]);renderObjects();save()}else effect({x:p.x,y:p.y+90});WorldSound.effect('tap');window.dispatchEvent(new Event('world-touch'))}pan=null;scene.style.scrollBehavior=''});
scene.addEventListener('pointercancel',()=>{pan=null});
function panButtons(){const s=$('#scene-scroll'),start=s.scrollLeft<8,end=s.scrollLeft>=s.scrollWidth-s.clientWidth-8,outdoor=state.zone==='outdoor';for(const [id,exit,disabled,label,arrow]of [['pan-left',start&&outdoor,start&&!outdoor,'Zurück ins Zimmer','left'],['pan-right',end&&!outdoor,end&&outdoor,'Zur Terrasse und zum Garten','right']]){const button=$('#'+id);button.disabled=disabled;button.classList.toggle('area-exit',exit);button.setAttribute('aria-label',exit?label:arrow==='left'?'Nach links schauen':'Nach rechts schauen');button.innerHTML=exit?'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 28V4h15v24M20 4 29 1v27l-9-1M2 28h21"/><path d="m10 13 5 3-5 3"/><circle cx="24" cy="16" r="1" fill="currentColor" stroke="none"/></svg>':icon(arrow)}}
scene.addEventListener('scroll',()=>{panButtons();},{passive:true});window.addEventListener('resize',()=>{centerScene();panButtons()});
$('#pan-left').onclick=()=>{if(state.zone==='outdoor'&&scene.scrollLeft<8)switchZone('room');else scene.scrollBy({left:-scene.clientWidth*.65,behavior:state.paused?'instant':'smooth'})};$('#pan-right').onclick=()=>{if(state.zone!=='outdoor'&&scene.scrollLeft>=scene.scrollWidth-scene.clientWidth-8)switchZone('outdoor');else scene.scrollBy({left:scene.clientWidth*.65,behavior:state.paused?'instant':'smooth'})};
function centerScene(){const s=$('#scene-scroll');s.scrollTo({left:Math.max(0,$('#world').clientWidth/worldWidth()*(state.zone==='outdoor'?600:800)-s.clientWidth/2),behavior:'instant'});panButtons();}
function switchZone(zone){if(!['room','outdoor'].includes(zone))return;const from=areaKey(),player=current().find(o=>o.uid===state.journey.playerUid),held=player?current().filter(o=>o.carrier===player.uid):[];if(player){player.zonePositions??={};player.zonePositions[from]={x:player.x,y:player.y,s:player.s,layer:player.layer};state.placed[from]=current().filter(o=>o.uid!==player.uid&&!held.includes(o))}state.zone=zone;if(player){const position=player.zonePositions[areaKey()]||{x:zone==='outdoor'?600:700,y:790,s:1,layer:4};Object.assign(player,position);current().push(player,...held)}selected=null;render();$('#panel').close();centerScene()}
function renderDoor(){document.querySelector('#zone-door')?.remove()}
function chime(){if(window.WorldSound){WorldSound.effect('reward');return}if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();[523.25,659.25,783.99].forEach((hz,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.13;o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.31)})}catch{}}
const panelTitles={shop:['','Einrichten'],residents:['WER SPIELT HEUTE MIT?','Deine Figuren'],furniture:['','Einrichten'],map:['','Wohin möchtest du?'],bag:['WEGGELEGT IST NICHT VERLOREN','Deine Tasche'],rewards:['','Deine Sterne'],help:['WILLKOMMEN BEI LERNDACHS','Einfach alles ausprobieren.']};
function showPanel(type){if(!state.journey.starterUnlocked&&['shop','furniture','map','residents'].includes(type)){window.dispatchEvent(new Event('request-starter'));return}activePanel=type;$('#panel-title').textContent=panelTitles[type][1];renderPanel();if(!$('#panel').open)$('#panel').showModal();$('#panel-content button:not(:disabled)')?.focus({preventScroll:true});if(type==='rewards')window.LerndachsRewards?.open();if(['shop','furniture'].includes(type)){const wanted=item(state.journey.target);if(wanted&&wanted.price<=state.balance&&!state.owned.includes(wanted.id)){const tile=document.querySelector(`.furnishing-item[data-id="${wanted.id}"]`);tile?.focus({preventScroll:true});tile?.scrollIntoView?.({block:'center',behavior:'auto'})}}}
function preview(i,isHouse=false){const b=isHouse?[-105,-160,210,180]:bounds[i.id]||[-65,-140,130,160];return `<svg viewBox="${b.join(' ')}" aria-hidden="true">${isHouse?A.houseArt(i):art(i.id,state.home,i.appearance)}</svg>`}
function card(i,type='decor',storedObject){const own=state.owned.includes(i.id),isHouse=type==='houses',isChar=type==='figures';let action='place',label=isChar?'Mitspielen':'Hinstellen',disabled=false;
 if(storedObject){action='restore';label='Zurückholen'}else if(activePanel==='shop'){action='buy';label=own&&!i.repeatable?'Schon deins':`${i.price} ✦ · Holen`;disabled=own&&!i.repeatable}
 else if(isHouse){action=own?'visit':'store';label=state.home===i.id?'Hier bist du':own?'Besuchen':`${i.price} ✦ · Laden`;disabled=state.home===i.id}
 else if(isChar&&current().some(o=>o.id===i.id)){label='✓ Spielt mit';disabled=true}
 const displayName=storedObject?objectName(storedObject):current().find(o=>o.id===i.id)?.petName||i.name;
 return `<article class="item-card"><div class="item-art">${preview(storedObject?{...i,...storedObject}:i,isHouse)}</div><div class="item-body"><h3>${escapeText(displayName)}</h3>${activePanel==='shop'?'':`<p>${i.note||'Bereit für die nächste Geschichte.'}</p>`}<button data-action="${action}" data-id="${storedObject?.uid||i.id}" ${disabled?'disabled':''}>${label}</button></div></article>`;
}
const furnishingGroups=[['Sitzen & Schlafen',['sofa','bed','stool','cushion','blanket']],['Tische & Stauraum',['table','cabinet','shelf','radio-shelf','basket']],['Küche & Alltag',['fridge','counter','tea','kettle','jar','toaster','fruit','cake']],['Licht & Technik',['lamp','pendant','garland','clock','fan','radio','camera']],['Pflanzen & Dekoration',['plant','flower','hanging','watering','rug','picture','poster','curtain','balloon']],['Musik & Kreativität',['guitar','books','easel']]];
const furnishingIds=new Set(furnishingGroups.flatMap(([,ids])=>ids));
function renderFurnishings(c){const intro=state.journey.opening!=='done',target=item(state.journey.target),missing=target?target.price-state.balance:0,groups=intro?[['Für deinen Einzug',LerndachsWorld.shopStock],...furnishingGroups.map(([name,ids])=>[name,ids.filter(id=>!LerndachsWorld.shopStock.includes(id))])]:furnishingGroups;c.innerHTML=`<div class="furnishing-balance" aria-label="Dein Guthaben">✦ ${state.balance}</div>${missing>0?`<div class="shop-invitation" role="status"><p>Noch ${missing} Sterne für ${escapeText(target.name)}.</p><button class="journey-primary" data-action="learn">Sterne sammeln</button></div>`:''}<div class="furnishing-catalogue first-shop">${groups.map(([name,ids])=>{const items=ids.map(item).filter(i=>i&&(!intro||state.owned.includes(i.id)||LerndachsWorld.shopStock.includes(i.id)));if(!items.length)return '';return `<section class="furnishing-category"><h3>${name}</h3><div class="furnishing-grid">${items.map(i=>{const own=state.owned.includes(i.id),action=own?'place':'buy';return `<button class="furnishing-item ${state.journey.target===i.id?'wish-item':''}" data-action="${action}" data-id="${i.id}" aria-label="${escapeText(i.name)}${own?' · anzeigen':', '+i.price+' Sterne'}"><span class="furnishing-art">${preview(i)}</span><span class="item-tooltip">${escapeText(i.name)}</span>${own?'':`<span class="item-price">${i.price} ✦</span>`}</button>`}).join('')}</div></section>`}).join('')}</div>`}
function renderPanel(){const c=$('#panel-content');
 if(activePanel==='shop'||activePanel==='furniture')renderFurnishings(c);
 else if(activePanel==='residents'&&window.LerndachsFriends){c.innerHTML='';LerndachsFriends.render(c)}
 else if(activePanel==='residents')c.innerHTML=`<div class="card-grid">${[...cast,...decor.filter(i=>i.kind==='pet')].filter(i=>state.owned.includes(i.id)).map(i=>card(i,'figures')).join('')}</div><p class="note">Tippe auf eine Figur, damit sie mitspielt. Figuren in deiner Tasche kannst du dort zurückholen.</p><button class="text-button" data-action="store">Neue Freunde im Laden →</button>`;

 else if(activePanel==='bag')c.innerHTML=stored().length?`<div class="furnishing-grid bag-grid">${stored().map(o=>`<button class="furnishing-item" data-action="restore" data-id="${o.uid}" aria-label="${escapeText(objectName(o))} zurückholen"><span class="furnishing-art">${preview({...item(o.id),...o})}</span><span class="item-tooltip">${escapeText(objectName(o))}</span></button>`).join('')}</div>`:'<div class="empty"><strong>Deine Tasche ist leer.</strong>Hier bleiben deine eingepackten Dinge.</div>';
 else if(activePanel==='map')c.innerHTML=`<div class="area-choices"><button data-action="zone" data-id="room">${icon('house')}<strong>Zimmer</strong></button><button data-action="zone" data-id="outdoor">${icon('sun')}<strong>Terrasse und Garten</strong></button></div>${homes.filter(i=>state.owned.includes(i.id)).length>1?`<div class="card-grid">${homes.filter(i=>state.owned.includes(i.id)).map(i=>card(i,'houses')).join('')}</div>`:''}`;
 else if(activePanel==='rewards')c.innerHTML=`<div class="stars-total" role="img" aria-label="${state.balance} Sterne"><span aria-hidden="true">✦</span><strong id="rewards-count" aria-hidden="true">0</strong></div><button class="primary wide" data-action="learn">Mehr Sterne sammeln</button>`;
 else c.innerHTML=`<div class="info-list"><p><strong>Alles ist zum Anfassen da.</strong><br>Figuren, Möbel, Pflanzen, Lampen, Sonne und Wolken: Tippe etwas an oder zieh es an einen neuen Platz.</p><p><strong>Einpacken & zurückholen.</strong><br>Zieh ein Objekt auf die Tasche oder tippe nach dem Auswählen auf das Taschen-Symbol. Die Dinge bleiben erhalten.</p><p><strong>Kleine Überraschungen.</strong><br>Öffne den Kühlschrank, dreh den Wasserhahn auf, lass es regnen, spiele Gitarre oder setze eine Figur aufs Sofa. Kleine Dinge kannst du einer Figur in die Hand ziehen.</p><p><strong>Deine Welt, dein Tempo.</strong><br>Mit den Pfeilen oder durch Ziehen am Hintergrund schaust du dich um. Tippe auf eine Wand, um ihre Farbe zu ändern. Oben kannst du Animationen und Töne umschalten.</p><p><strong>Tastatur.</strong><br>Tab wählt aus, Pfeiltasten bewegen, Enter benutzt, Entf packt ein. Escape hebt die Auswahl auf.</p></div><div class="settings-actions"><button data-action="tidy">Zimmer aufräumen</button><button data-action="fullscreen">Vollbild umschalten</button><button data-install-app>App installieren</button></div><p class="note">${storageOK?'Lokal in diesem Browser gespeichert.':'Lokale Speicherung ist nicht verfügbar.'} Lerndachs ist ein eigenständiger Entwurf mit neu erstellten Grafiken und Klängen. Keine Verbindung zu Toca Boca oder Duolingo. Arbeitstitel.</p>`;
}
$('#panel-content').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.id,action=b.dataset.action;if(b.dataset.furnitureTab){if(b.dataset.furnitureTab==='shop')showPanel('shop');else{furnitureTab=b.dataset.furnitureTab;showPanel('furniture')}return}
 if(action==='buy'){
  if(!state.journey.starterUnlocked||!(LerndachsWorld.shopStock.includes(id)||(state.journey.opening==='done'&&(item(id)?.kind==='pet'||furnishingIds.has(id)))))return;
  const i=item(id);if(current().length>=120){toast('Packe erst etwas ein.');return}
  const result=WunderEconomy.purchase(state,i);
  if(!result.purchased){
   if(result.reason==='insufficient'){toast('Dafür fehlen dir noch '+Math.max(0,item(id).price-state.balance)+' Sterne.');state.journey.target=id;if(state.journey.opening==='second-item')state.journey.opening='earn';save();renderPanel();window.dispatchEvent(new Event('opening-changed'))}
   return;
  }
  if(state.journey.target===id)state.journey.target=null;
  if(state.journey.opening==='shop')state.journey.opening='second-item';
  save();place(id,true);animate(current().at(-1));chime();window.dispatchEvent(new CustomEvent('learning-celebration',{detail:{kind:'bubbles'}}));toast('Das gehört dir!');window.dispatchEvent(new Event('opening-changed'));
 }
 if(action==='learn'){$('#panel').close();window.dispatchEvent(new Event('request-earn-stars'))}
 if(action==='place')place(id);if(action==='restore')restore(id);
 if(action==='zone'){switchZone(id);return}if(action==='visit'){state.zone='room';state.home=id;selected=null;current();render();$('#panel').close();centerScene()}
 if(action==='store')showPanel('shop')
 if(action==='tidy'){const home=areaKey(),old=structuredClone({placed:current(),stored:stored()}),defaults=state.zone==='outdoor'?LerndachsGardenArt.objects():A.defaults(home);for(const o of [...current(),...stored()]){const d=defaults.find(d=>d.id===o.id);if(d){o.x=d.x;o.y=d.y}delete o.carrier}state.placed[home]=[...current(),...stored()];state.stored[home]=[];selected=null;render();$('#panel').close();toast('Deine vorhandenen Dinge sind aufgeräumt.',()=>{state.placed[home]=old.placed;state.stored[home]=old.stored;if(areaKey()===home)render();save()})}
 if(action==='fullscreen'){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>toast('Vollbild ist hier nicht verfügbar.'))}
});
function place(id,purchased=false){if(!state.journey.starterUnlocked||!state.owned.includes(id))return;if(!purchased){const bag=stored().find(o=>o.id===id);if(bag){restore(bag.uid);return}const existing=!item(id)?.repeatable&&current().find(o=>o.id===id);if(existing){$('#panel').close();focusObject(existing);toast('Das ist schon in deinem Zimmer. Weitere Exemplare gibt es im Laden.');return}const elsewhere=!item(id)?.repeatable&&(Object.values(state.placed).flat().some(o=>o.id===id)||Object.values(state.stored).flat().some(o=>o.id===id));if(elsewhere){toast('Das steht in einem anderen Zuhause. Besuche es über die Nachbarschaft.');return}}if(chars.has(id)&&current().some(o=>o.id===id))return;if(current().length>=120){toast('Ganz schön voll. Packe zuerst etwas ein.');return}const isPet=item(id)?.kind==='pet',x=(scene.scrollLeft+scene.clientWidth*(isPet?.28:.5))/$('#world').clientWidth*worldWidth(),o={uid:uid(),id,x,y:chars.has(id)?790:isPet?815:['picture','poster'].includes(id)?330:735,s:1,layer:isPet?4.1:A.layer(id)};current().push(o);renderObjects();countWelcomeItem();save();$('#panel').close();select(o);effect(o)}
function credit(payload){const result=WunderEconomy.credit(state,payload);save();return result}
window.Lerndachs=Object.freeze({version:3,getSnapshot:()=>structuredClone(state)});
$('#map-button').onclick=()=>showPanel('map');$('#wallet').onclick=()=>showPanel('rewards');$('#help').onclick=()=>showPanel('help');$('#bag-button').onclick=()=>showPanel('bag');
document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>showPanel(b.dataset.panel));$('#close-panel').onclick=()=>$('#panel').close();$('#panel').addEventListener('click',e=>{if(e.target===$('#panel')){const r=$('#panel').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#panel').close()}});
$('#day-toggle').onclick=()=>{sunClick();state.night=!state.night;render()};$('#motion-toggle').onclick=()=>{state.paused=!state.paused;render()};$('#sound-toggle').onclick=()=>{sound=!sound;$('#sound-toggle').setAttribute('aria-pressed',sound);$('#sound-toggle').setAttribute('aria-label',sound?'Töne ausschalten':'Töne einschalten');if(sound)chime()};$('#dismiss-hint').onclick=()=>{$('#welcome-hint').hidden=true};
$('#deselect').onclick=()=>select(null);$('#pack-object').onclick=()=>pack(current().find(o=>o.uid===selected));$('#use-object').onclick=()=>use(current().find(o=>o.uid===selected));$('#flip-object').onclick=()=>{const o=current().find(o=>o.uid===selected);if(o){o.flip=!o.flip;renderObjects();save()}};
setInterval(()=>{if(state.paused||document.hidden)return;for(const o of current().filter(o=>o.id==='radio'&&o.on))effect(o,'music')},2600);
if(matchMedia('(prefers-reduced-motion: reduce)').matches)state.paused=true;
render();centerScene();setTimeout(()=>{$('#welcome-hint').hidden=true},8500);

window.Lernwelt={switchZone,snapshot:()=>structuredClone(state),find:id=>current().find(o=>o.id===id),focus:id=>{const o=current().find(o=>o.id===id);if(o)focusObject(o);return !!o},reward:(receiptId,stars)=>credit({receiptId,stars}),use:id=>use(current().find(o=>o.id===id)),pack:id=>pack(current().find(o=>o.id===id)),restore};

// Preserve the original adapter name for existing integrations.
window.MeineKleineWelt=window.Lerndachs;

function grantStarter(){
 if(state.journey.starterUnlocked)return false;
 state.journey.starterUnlocked=true;state.journey.starterEarned=true;
 WunderEconomy.credit(state,{receiptId:'welcome-home',stars:LerndachsWorld.welcomeStars});
 render();effect({x:800,y:500});window.dispatchEvent(new CustomEvent('learning-celebration',{detail:{kind:'confetti'}}));return true;
}
function showPet(o){
 selected=o.uid;const i=item(o.id);$('#panel-title').textContent=o.petName||i.name;activePanel='pet';
 $('#panel-content').innerHTML=`<div class="pet-portrait">${preview(i)}</div><p class="pet-bond">${'♥'.repeat(Math.min(5,o.bond||0))}${'♡'.repeat(5-Math.min(5,o.bond||0))}</p><p class="note">Zeit zusammen ist schön. Dein Tier wartet ohne Zeitdruck auf dich.</p><div class="pet-actions"><button data-care="stroke">♡ Streicheln</button><button data-care="feed">♧ Füttern</button><button data-care="play">✦ Spielen</button></div><p id="pet-feedback" role="status">Was möchtet ihr zusammen machen?</p><label class="pet-name-label">Name <input id="pet-name" maxlength="24" value=""></label><button id="save-pet-name" class="primary wide">Namen speichern</button>`;
 $('#pet-name').value=o.petName||i.name;
 $('#panel-content').querySelectorAll('[data-care]').forEach(b=>b.onclick=()=>{o.bond=Math.min(5,(o.bond||0)+1);save();$('#panel-content .pet-bond').textContent='♥'.repeat(o.bond)+'♡'.repeat(5-o.bond);$('#pet-feedback').textContent=({stroke:'Dein Freund genießt die kleine Pause.',feed:'Lecker! Gemeinsam kümmert ihr euch um euren Alltag.',play:'Was für ein schöner Spielmoment!'})[b.dataset.care];effect(o);WorldSound?.effect(o.id);animate(o)});
 $('#save-pet-name').onclick=()=>{const name=$('#pet-name').value.trim();if(name){o.petName=name;save();$('#panel-title').textContent=name;renderObjects();toast('Name gespeichert.')}};
 if(!$('#panel').open)$('#panel').showModal();
}
window.LerndachsJourney={get profile(){return state.journey},save,grantStarter,get catalogue(){return allItems},art,preview,showShop(){showPanel('shop')},reward(id,stars=15){if(state.journey.done.includes(id))return false;const r=WunderEconomy.credit(state,{receiptId:'task-'+id,stars});if(r.credited){state.journey.done.push(id);if(state.journey.together)state.journey.turn=state.journey.turn===1?2:1}save();return r.credited},focusObject,render};
// A mission can retrieve already-owned props without granting unearned items.
function bringOwned(id){
 if(!state.owned.includes(id)||current().some(o=>o.id===id))return;
 for(const [home,objects] of Object.entries(state.stored)){const index=objects.findIndex(o=>o.id===id);if(index>=0){const [o]=objects.splice(index,1);delete o.carrier;current().push(o);renderObjects();save();return}}
 for(const [home,objects] of Object.entries(state.placed)){if(home===state.home)continue;const index=objects.findIndex(o=>o.id===id);if(index>=0){const [o]=objects.splice(index,1);delete o.carrier;current().push(o);renderObjects();save();return}}
}
LerndachsJourney.bring=bringOwned;

LerndachsJourney.prepare=goal=>{
 if(goal==='water'){const can=current().find(o=>o.id==='watering'),plant=current().find(o=>o.id==='plant');if(can&&plant&&Math.hypot(can.x-plant.x,can.y-plant.y)>350){can.x=plant.x+120;can.y=plant.y-200;can.flip=false;can.layer=3.4;renderObjects();save()}}
 if(goal==='left'){const table=current().find(o=>o.id==='table'),stool=current().find(o=>o.id==='stool');if(table&&stool&&Math.abs(table.x-stool.x)>250){stool.x=table.x+200;stool.y=table.y+35;renderObjects();save()}}
};

LerndachsJourney.getTimetable=()=>state.timetable;
LerndachsJourney.setTimetable=plan=>{state.timetable=plan;save()};

// Seven sun interactions form one persistent bonus receipt.
function sunClick(){
 if(state.journey.opening!=='done'||state.journey.grade===null)return;
 state.journey.sunClicks=(Number.isSafeInteger(state.journey.sunClicks)?state.journey.sunClicks:0)+1;
 if(state.journey.sunClicks%7===0){const r=credit({receiptId:'sun-bonus-'+state.journey.sunClicks/7,stars:250});if(r.credited){toast('Sonnengeheimnis! +250 Sterne für deine Welt.');window.dispatchEvent(new Event('learning-celebration'))}}
 else save();
}

window.addEventListener('request-world-help',()=>showPanel('help'));

LerndachsJourney.people=()=>allPeople().map(o=>({...o,name:objectName(o),player:o.uid===state.journey.playerUid}));
LerndachsJourney.player=()=>allPeople().find(o=>o.uid===state.journey.playerUid);
LerndachsJourney.person=(id,name,mode='add',personUid,appearance)=>{
 if(!chars.has(id)||typeof name!=='string'||!name.trim())return false;
 let o=mode==='initial'?null:allPeople().find(o=>o.uid===(personUid||state.journey.playerUid));
 if(mode==='add')o=null;
 if(!o){if(current().length>=120||allPeople().length>=20){toast('Deine Welt ist schon gut besucht.');return false}o={uid:uid(),id,x:700+allPeople().length%5*105,y:790,s:1,layer:4};current().push(o)}
 o.id=id;o.characterName=name.trim().slice(0,24);if(appearance)o.appearance=LerndachsAvatar.normalize(id,appearance);if(mode==='initial'||mode==='change')state.journey.playerUid=o.uid;
 if(!state.owned.includes(id))state.owned.push(id);renderObjects();save();window.dispatchEvent(new Event('character-celebrate'));return true;
};
LerndachsJourney.showPerson=personUid=>{const o=allPeople().find(o=>o.uid===personUid);if(!o)return;for(const map of [state.placed,state.stored])for(const [home,list] of Object.entries(map))map[home]=list.filter(x=>x.uid!==personUid);delete o.carrier;current().push(o);renderObjects();countWelcomeItem();save();$('#panel').close();focusObject(o)};
LerndachsJourney.pets=()=>[...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].filter(o=>item(o.id)?.kind==='pet').map(o=>({...o,name:objectName(o)}));
LerndachsJourney.visitPet=petUid=>{const pet=[...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].find(o=>o.uid===petUid&&item(o.id)?.kind==='pet');if(!pet)return;for(const map of [state.placed,state.stored])for(const [home,list] of Object.entries(map))map[home]=list.filter(o=>o.uid!==petUid);delete pet.carrier;current().push(pet);renderObjects();save();focusObject(pet);showPet(pet)};
LerndachsJourney.getAudio=()=>({...state.audioSettings});
LerndachsJourney.setAudio=values=>{Object.assign(state.audioSettings,values);save()};
LerndachsJourney.purchaseBundle=bundle=>{
 if(!state.journey.starterUnlocked||!LerndachsBundleData.includes(bundle))return {ok:false,message:'Dein Einzugspaket wartet zuerst.'};
 if(state.balance<bundle.price)return {ok:false,message:`Dir fehlen noch ${bundle.price-state.balance} Sterne.`};
 if(stored().length+bundle.items.length>200)return {ok:false,message:'Hole zuerst einige Dinge aus deiner Tasche.'};
 state.balance-=bundle.price;for(const id of bundle.items){stored().push({uid:uid(),id,x:800,y:750,s:1,layer:A.layer(id)});if(!state.owned.includes(id))state.owned.push(id)}
 save();window.dispatchEvent(new Event('learning-celebration'));WorldSound.effect('reward');return {ok:true};
};
