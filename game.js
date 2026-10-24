'use strict';
const $=s=>document.querySelector(s);
const A=WorldArt,{C,R,E,P,cast,homes,decor,bounds,chars}=A;
const art=(id,home)=>LerndachsWorld.petArt(id)||A.art(id,home);
const escapeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={house:'<path d="m3 11 9-8 9 8v10H3Zm6 10v-8h6v8M7 8V4"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',moon:'<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>',sound:'<path d="m11 4-6 5H2v6h3l6 5Zm4 5q3 3 0 6m3-9q6 6 0 12"/>',friends:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-4a7 7 0 0 1 14 0v4M17 3a4 4 0 0 1 0 8m1 3q4 1 4 7"/>',chair:'<path d="M5 14V8q0-5 7-5t7 5v6M5 12q-4-3-4 2v4h22v-4q0-5-4-2M4 18v4m16-4v4M5 15h14"/>',shop:'<path d="M3 10v12h18V10M2 3h20l1 6q-3 5-6 0-2 5-5 0-3 5-6 0-3 5-5 0Zm7 19v-8h6v8"/>',bag:'<path d="M5 7h14l3 15H2Zm3 0V5a4 4 0 0 1 8 0v2M8 12h.01M16 12h.01m-7 4q3 3 6 0"/>',spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',flip:'<path d="M12 2v20M2 18l6-12v12Zm20 0L16 6v12Z"/>',left:'<path d="m14 5-7 7 7 7m-6-7h12"/>',right:'<path d="m10 5 7 7-7 7m6-7H4"/>',pause:'<path d="M8 5v14m8-14v14" stroke-width="4"/>',play:'<path d="m8 4 12 8-12 8Z"/>'};
function icon(n){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]||icons.spark}</svg>`}
document.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon));
const KEY='lerndachs.world.v3';
const allItems=[...cast,...decor,...homes];
const item=id=>allItems.find(i=>i.id===id);
const uid=()=>crypto.randomUUID();
function fresh(){return {version:3,balance:0,owned:['garden','milo','lumi',...LerndachsWorld.environment],home:'garden',night:false,paused:false,wallpapers:{},placed:{garden:LerndachsWorld.empty()},stored:{},receipts:[],journey:{grade:null,starterEarned:false,starterUnlocked:false,done:[],active:null,index:0,target:'plant',together:false,turn:1,worldMoves:[],practice:0,badges:[]}}}
let state=fresh(),storageOK=true;
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved?.version===3&&saved.journey&&Number.isSafeInteger(saved.balance)&&saved.balance>=0&&Array.isArray(saved.owned)&&saved.placed&&saved.stored&&Array.isArray(saved.receipts)&&homes.some(h=>h.id===saved.home)){state=saved;state.journey={...fresh().journey,...saved.journey};state.wallpapers??={}}}catch{}
let activePanel='',shopTab='decor',furnitureTab='props',sound=false,selected=null,drag=null,pan=null,audio;
const current=()=>state.placed[state.home]??=(LerndachsWorld.empty(state.home));
const stored=()=>state.stored[state.home]??=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$('#save-status').textContent='Lokal gespeichert'}catch{storageOK=false;$('#save-status').textContent='Speichern nicht verfügbar'}$('#balance').textContent=state.balance;$('#bag-count').textContent=stored().length;window.dispatchEvent(new Event('world-saved'))}
let toastTimer;
function toast(message,undo){const t=$('#toast');t.textContent=message;if(undo){const b=document.createElement('button');b.textContent='Rückgängig';b.className='toast-undo';b.onclick=()=>{undo();t.classList.remove('visible')};t.append(b)}t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),undo?6500:2800)}
function syncCarried(){for(const o of current()){if(!o.carrier)continue;const c=current().find(c=>c.uid===o.carrier);if(!c){delete o.carrier;continue}o.x=c.x+(o.dx||55);o.y=c.y-91;o.layer=5}}
function transform(o){return `translate(${o.x} ${o.y}) scale(${(o.flip?-1:1)*(o.s||1)*(o.sx||1)} ${o.s||1})`}
function specialArt(o){let s=art(o.id,state.home);if(o.id==='fridge'&&o.on){s+=`${R(-59,-268,117,246,'#e6edda',10)}${P('M-55-187H55m-110 82H55','none','#8eb5a6',5)}${R(-37,-244,27,46,'#ffd383',5)}${R(12,-228,29,32,'#edb9cf',6)}${E(-13,-141,24,19,C.coral,C.ink,2)}${P('M-12-160v-9','none',C.leaf,3)}${P('M-68-276l-73 27v239l73 13Z','#c5e9db')}${P('M-130-217v40','none',C.deep,6)}`}
 if(o.id==='cabinet'&&o.on)s+=`${R(-130,-126,260,110,C.brown,8)}${R(-116,-110,90,15,C.cream,3)}${R(33,-107,65,38,C.pink,8)}${P('M-139-135l-47 18v107l47 5Z',C.light)}`;
 if(o.id==='fan'&&o.on)s=s.replace('class="fan-spin"','class="fan-spin" style="animation-play-state:paused"');
 if(o.id==='counter'&&o.on)s+=`<g class="water-stream">${P('M126-224v49','none','#84d9ed',7)}${E(121,-174,24,4,'#d3f4f8')}</g>`;
 if(['lamp','pendant'].includes(o.id)&&o.on)s+=E(0,o.id==='lamp'?-55:-25,78,60,'#ffe58738');
 return s;
}
function renderObjects(){syncCarried();$('#objects').innerHTML=current().slice().sort((a,b)=>(a.layer??3)-(b.layer??3)||a.y-b.y).map((o,i)=>{const b=bounds[o.id]||[-50,-100,100,110],isChar=chars.has(o.id),isSmall=b[2]<170&&o.id!=='balloon';return `<g class="movable ${selected===o.uid?'selected':''} ${o.layer===0?'sky-object':''}" data-uid="${o.uid}" data-kind="${o.id}" data-on="${!!o.on}" transform="${transform(o)}" tabindex="0" role="button" aria-label="${item(o.id)?.name||'Objekt'}: bewegen, benutzen oder einpacken" style="--idle-delay:${i%7*.37}s"><title>${item(o.id)?.name}</title>${R(b[0]-5,b[1]-5,b[2]+10,b[3]+10,'none',13,C.white,4).replace('<rect','<rect class="selection-outline"')}${isSmall?R(Math.min(-38,b[0]),Math.min(-75,b[1]),Math.max(76,b[2]),Math.max(76,b[3]),'transparent',0,'none'):isChar?R(-61,-229,122,235,'transparent',0,'none'):''}<g class="sprite">${specialArt(o)}</g></g>`}).join('');updateSelection();window.WorldSound?.sync();window.LerndachsCharacters?.sync()}
function render(){
 $('#backdrop').innerHTML=A.shell(state.home,state.wallpapers[state.home]||0);$('.playground').classList.toggle('night',state.night);document.body.classList.toggle('no-motion',state.paused);
 $('#location').textContent=homes.find(h=>h.id===state.home).name;$('#day-label').textContent=state.night?'Geschichten unterm Sternenhimmel.':'Dein Tag. Deine Geschichte.';
 $('#day-toggle').innerHTML=icon(state.night?'moon':'sun');$('#day-toggle').setAttribute('aria-pressed',state.night);$('#day-toggle').setAttribute('aria-label',state.night?'Zum Tag wechseln':'Zur Nacht wechseln');$('#motion-toggle').innerHTML=icon(state.paused?'play':'pause');$('#motion-toggle').setAttribute('aria-pressed',state.paused);$('#motion-toggle').setAttribute('aria-label',state.paused?'Animationen starten':'Animationen pausieren');
 renderObjects();save();panButtons();
}
function select(o){selected=o?.uid||null;document.querySelectorAll('.movable.selected').forEach(e=>e.classList.remove('selected'));if(selected)document.querySelector(`[data-uid="${selected}"]`)?.classList.add('selected');updateSelection()}
function updateSelection(){const o=current().find(o=>o.uid===selected);$('#selection').hidden=!o;if(o)$('#selected-name').textContent=item(o.id)?.name||'Objekt'}
function worldPoint(e){return new DOMPoint(e.clientX,e.clientY).matrixTransform($('#world').getScreenCTM().inverse())}
function bagHit(x,y){const r=$('#bag-button').getBoundingClientRect();return x>=r.left-20&&x<=r.right+20&&y>=r.top-20&&y<=r.bottom+20}
function effect(o,type='spark'){
 const g=document.createElementNS('http://www.w3.org/2000/svg','g');let x=o.x,y=o.y-(chars.has(o.id)?250:90),s='';
 if(type==='rain'){for(let i=0;i<9;i++)s+=`<path class="fx-drop" style="animation-delay:${i*.07}s" d="M${x-45+i*12} ${o.y+18}l-4 11" stroke="#56b6d1" stroke-width="5" stroke-linecap="round"/>`}
 else if(type==='music'){for(let i=0;i<4;i++)s+=`<text class="fx-note" x="${x-40+i*27}" y="${y-i%2*18}" fill="${[C.coral,C.deep,C.purple][i%3]}" font-size="35" style="animation-delay:${i*.15}s">${i%2?'♫':'♪'}</text>`}
 else{for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=`<path class="fx-particle" style="--dx:${Math.cos(a)*62}px;--dy:${Math.sin(a)*55-32}px;animation-delay:${i*.025}s" d="m${x+Math.cos(a)*14} ${y+Math.sin(a)*15} 4-8 4 8 8 4-8 4-4 8-4-8-8-4Z" fill="${[C.yellow,C.coral,C.teal,C.pink][i%4]}"/>`}}
 g.innerHTML=s;$('#effects').append(g);setTimeout(()=>g.remove(),2200);
}
function animate(o){const el=document.querySelector(`[data-uid="${o.uid}"]`);el?.classList.remove('reacting');if(el){void el.getBoundingClientRect();el.classList.add('reacting');setTimeout(()=>el.classList.remove('reacting'),750)}}
function use(o){
 if(!o)return;select(o);animate(o);window.dispatchEvent(new CustomEvent('world-use',{detail:{id:o.id,uid:o.uid}}));if(window.WorldSound)WorldSound.effect(o.id);if(o.id==='balloon'){effect(o);pack(o);toast('Plopp! Dein Ballon wartet in der Tasche.',()=>restore(o.uid));return}if(o.id==='clock'){const h=document.querySelector(`[data-uid="${o.uid}"] .clock-hand`);if(!state.paused)h?.animate([{transform:'rotate(0deg)'},{transform:'rotate(720deg)'}],{duration:1000});effect(o);return}
 if(LerndachsWorld.pets.some(p=>p.id===o.id)){showPet(o);return}
 if(o.id==='watering'){const plant=current().find(p=>p.id==='plant'&&Math.hypot(p.x-o.x,p.y-o.y)<170);effect(plant||o,'rain');return}
 if(o.id==='sun'){sunClick();state.night=!state.night;render();effect(o);return}
 if(o.id==='cloud'){effect(o,'rain');chime();return}
 if(o.id==='radio'){o.on=!o.on;window.WorldSound?.radio(o.on);effect(o,'music');save();return}if(o.id==='guitar'){effect(o,'music');save();return}
 if(['lamp','pendant','fridge','counter','cabinet'].includes(o.id)){o.on=!o.on;renderObjects();animate(o);chime();save();return}
 if(o.id==='camera'){const flash=document.createElement('div');flash.className='flash';$('.game-shell').append(flash);setTimeout(()=>flash.remove(),500);effect(o);return}
 if(o.id==='sofa'||o.id==='bed'){const c=current().filter(c=>chars.has(c.id)).sort((a,b)=>Math.abs(a.x-o.x)-Math.abs(b.x-o.x))[0];if(c){c.x=o.x+(c.x<o.x?-65:65);c.y=o.y-52;renderObjects();effect(c)}return}
 if(o.id==='fan'){o.on=!o.on;const el=document.querySelector(`[data-uid="${o.uid}"] .fan-spin`);if(el)el.style.animationPlayState=o.on?'paused':'running';save();return}
 effect(o,['cat','fishbowl'].includes(o.id)?'music':'spark');chime();
}
function pack(o){
 if(!o)return;const home=state.home,copy=structuredClone(o),carried=current().filter(x=>x.carrier===o.uid);for(const x of carried)delete x.carrier;
 state.placed[home]=current().filter(x=>x.uid!==o.uid);delete o.carrier;stored().push(o);select(null);renderObjects();save();toast(`${item(o.id)?.name} ist in deiner Tasche.`,()=>{if(!state.stored[home].some(x=>x.uid===copy.uid))return;state.stored[home]=state.stored[home].filter(x=>x.uid!==copy.uid);state.placed[home].push(copy);if(state.home===home)renderObjects();save()});
}
function restore(uidToRestore){const o=stored().find(o=>o.uid===uidToRestore);if(!o)return;state.stored[state.home]=stored().filter(x=>x.uid!==uidToRestore);delete o.carrier;current().push(o);renderObjects();save();$('#panel').close();focusObject(o);effect(o);toast(`${item(o.id)?.name} ist wieder da.`)}
function focusObject(o){const s=$('#scene-scroll'),scale=$('#world').clientWidth/1600;s.scrollTo({left:Math.max(0,o.x*scale-s.clientWidth/2),behavior:state.paused?'instant':'smooth'});select(o)}
function carryOrDrop(o){if(chars.has(o.id)||!bounds[o.id]||bounds[o.id][2]>165||['sun','cloud','hanging','balloon'].includes(o.id))return;const c=current().find(c=>chars.has(c.id)&&Math.abs(c.x-o.x)<72&&Math.abs(c.y-91-o.y)<72);if(c){o.carrier=c.uid;o.dx=o.x<c.x?-55:55;o.layer=5;syncCarried();effect(c)}}
$('#objects').addEventListener('pointerdown',e=>{
 const el=e.target.closest('.movable');if(!el||e.button>0)return;e.preventDefault();e.stopPropagation();const o=current().find(o=>o.uid===el.dataset.uid),p=worldPoint(e);delete o.carrier;
 drag={el,o,start:p,ox:o.x,oy:o.y,moved:false,pointer:e.pointerId};select(o);el.classList.add('dragging');el.parentElement.append(el);el.setPointerCapture(e.pointerId);document.body.classList.add('is-dragging');$('#welcome-hint').hidden=true;
});
window.addEventListener('pointermove',e=>{
 if(!drag)return;const p=worldPoint(e);if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)>5)drag.moved=true;
 drag.o.x=Math.max(40,Math.min(1560,drag.ox+p.x-drag.start.x));drag.o.y=Math.max(85,Math.min(864,drag.oy+p.y-drag.start.y));drag.el.setAttribute('transform',transform(drag.o));syncCarried();for(const o of current().filter(o=>o.carrier===drag.o.uid))document.querySelector(`[data-uid="${o.uid}"]`)?.setAttribute('transform',transform(o));
 $('#bag-button').classList.toggle('drop-ready',bagHit(e.clientX,e.clientY));const s=$('#scene-scroll');if(e.clientX<40)s.scrollLeft-=12;else if(e.clientX>innerWidth-40)s.scrollLeft+=12;
});
function finishDrag(e){if(!drag)return;const d=drag;drag=null;document.body.classList.remove('is-dragging');$('#bag-button').classList.remove('drop-ready');d.el.classList.remove('dragging');if(e.type==='pointercancel'){d.o.x=d.ox;d.o.y=d.oy}else if(d.moved&&bagHit(e.clientX,e.clientY)){d.o.x=d.ox;d.o.y=d.oy;pack(d.o);return}else if(d.moved){carryOrDrop(d.o)}else use(d.o);renderObjects();save();if(d.moved)window.dispatchEvent(new CustomEvent('world-move',{detail:{uid:d.o.uid,id:d.o.id}}))}
window.addEventListener('pointerup',finishDrag);window.addEventListener('pointercancel',finishDrag);
$('#objects').addEventListener('keydown',e=>{
 const el=e.target.closest('.movable');if(!el)return;const o=current().find(o=>o.uid===el.dataset.uid),delta={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,-15],ArrowDown:[0,15]}[e.key];select(o);
 if(delta){e.preventDefault();delete o.carrier;o.x=Math.max(40,Math.min(1560,o.x+delta[0]));o.y=Math.max(85,Math.min(864,o.y+delta[1]));carryOrDrop(o);el.setAttribute('transform',transform(o));syncCarried();for(const held of current().filter(x=>x.carrier===o.uid))document.querySelector(`[data-uid="${held.uid}"]`)?.setAttribute('transform',transform(held));save();window.dispatchEvent(new CustomEvent('world-move',{detail:{uid:o.uid,id:o.id}}))}
 if(e.key==='Enter'||e.key===' '){e.preventDefault();use(o)}if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();pack(o)}if(e.key==='Escape')select(null);
});
$('#objects').addEventListener('focusin',e=>{const el=e.target.closest('.movable');if(el){const o=current().find(x=>x.uid===el.dataset.uid);select(o);focusObject(o)}});
const scene=$('#scene-scroll');
scene.addEventListener('pointerdown',e=>{if(e.target.closest('.movable')||e.button>0)return;pan={x:e.clientX,scroll:scene.scrollLeft,y:e.clientY,moved:false};scene.setPointerCapture(e.pointerId)});
scene.addEventListener('pointermove',e=>{if(!pan||drag)return;if(Math.abs(e.clientX-pan.x)>5)pan.moved=true;scene.style.scrollBehavior='auto';scene.scrollLeft=pan.scroll+pan.x-e.clientX});
scene.addEventListener('pointerup',e=>{if(!pan)return;if(!pan.moved){select(null);const p=worldPoint(e);if(p.y<580){state.wallpapers[state.home]=((state.wallpapers[state.home]||0)+1)%3;$('#backdrop').innerHTML=A.shell(state.home,state.wallpapers[state.home]);save()}else effect({x:p.x,y:p.y+90})}pan=null;scene.style.scrollBehavior=''});
scene.addEventListener('pointercancel',()=>{pan=null});
function panButtons(){const s=$('#scene-scroll');$('#pan-left').disabled=s.scrollLeft<4;$('#pan-right').disabled=s.scrollLeft>s.scrollWidth-s.clientWidth-4}
scene.addEventListener('scroll',panButtons,{passive:true});window.addEventListener('resize',()=>{centerScene();panButtons()});
$('#pan-left').onclick=()=>scene.scrollBy({left:-scene.clientWidth*.65,behavior:state.paused?'instant':'smooth'});$('#pan-right').onclick=()=>scene.scrollBy({left:scene.clientWidth*.65,behavior:state.paused?'instant':'smooth'});
function centerScene(){const s=$('#scene-scroll');s.scrollLeft=Math.max(0,$('#world').clientWidth*.5-s.clientWidth/2);panButtons()}
function chime(){if(window.WorldSound){WorldSound.effect('reward');return}if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();[523.25,659.25,783.99].forEach((hz,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.13;o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.31)})}catch{}}
const panelTitles={shop:['DEIN NÄCHSTES KLEINES ABENTEUER','Dein kleiner Laden'],residents:['WER SPIELT HEUTE MIT?','Deine Figuren'],furniture:['ALLES DARF ANDERS WERDEN','Deine Einrichtung'],map:['EIN NEUER ORT, EINE NEUE GESCHICHTE','Deine Nachbarschaft'],bag:['WEGGELEGT IST NICHT VERLOREN','Deine Tasche'],rewards:['AUS ERFOLGEN WERDEN MÖGLICHKEITEN','Sterne für deine Welt'],help:['WILLKOMMEN BEI LERNDACHS','Einfach alles ausprobieren.']};
function showPanel(type){if(!state.journey.starterUnlocked&&['shop','furniture','map','residents'].includes(type)){window.dispatchEvent(new Event('request-starter'));return}activePanel=type;$('#panel-kicker').textContent=panelTitles[type][0];$('#panel-title').textContent=panelTitles[type][1];renderPanel();if(!$('#panel').open)$('#panel').showModal();$('#panel-content button:not(:disabled)')?.focus({preventScroll:true})}
function preview(i,isHouse=false){const b=isHouse?[-105,-160,210,180]:bounds[i.id]||[-65,-140,130,160];return `<svg viewBox="${b.join(' ')}" aria-hidden="true">${isHouse?A.houseArt(i):art(i.id,state.home)}</svg>`}
function card(i,type='decor',storedObject){const own=state.owned.includes(i.id),isHouse=type==='houses',isChar=type==='figures';let action='place',label=isChar?'Mitspielen':'Hinstellen',disabled=false;
 if(storedObject){action='restore';label='Zurückholen'}else if(activePanel==='shop'){action='buy';label=own&&!i.repeatable?'✓ Schon deins':`${i.price} ✦ · ${own?'Noch eins':'Holen'}`;disabled=own&&!i.repeatable}
 else if(isHouse){action=own?'visit':'store';label=state.home===i.id?'Hier bist du':own?'Besuchen':`${i.price} ✦ · Laden`;disabled=state.home===i.id}
 else if(isChar&&current().some(o=>o.id===i.id)){label='✓ Spielt mit';disabled=true}
 const displayName=storedObject?.petName||current().find(o=>o.id===i.id)?.petName||i.name;
 const targetButton=activePanel==='shop'&&!disabled?`<button class="target-button" data-action="target" data-id="${i.id}">${state.journey.target===i.id?'✓ Dein Sparziel':'Als Sparziel wählen'}</button>`:'';
 return `<article class="item-card"><div class="item-art">${preview(i,isHouse)}</div><div class="item-body"><h3>${escapeText(displayName)}</h3><p>${i.note||'Bereit für die nächste Geschichte.'}</p><button data-action="${action}" data-id="${storedObject?.uid||i.id}" ${disabled?'disabled':''}>${label}</button>${targetButton}</div></article>`}
function renderPanel(){const c=$('#panel-content');
 if(activePanel==='shop'){const items=shopTab==='figures'?cast:shopTab==='houses'?homes:shopTab==='pets'?decor.filter(i=>i.kind==='pet'):decor.filter(i=>i.kind==='decor');c.innerHTML=`<div class="tabs" aria-label="Ladenkategorien">${[['decor','Einrichtung'],['pets','Haustiere'],['figures','Figuren'],['houses','Häuser']].map(([id,n])=>`<button data-tab="${id}" aria-pressed="${shopTab===id}">${n}</button>`).join('')}</div><div class="card-grid">${items.map(i=>card(i,shopTab)).join('')}</div><p class="note">Deine Sterne: <strong>${state.balance} ✦</strong> · Möbel ab 20 Sternen, Haustiere ab 300 Sternen. Jede neue Aufgabe bringt 15 Sterne.</p><button class="primary wide" data-action="learn">Sterne mit Aufgaben verdienen →</button>`}
 else if(activePanel==='residents')c.innerHTML=`<div class="card-grid">${[...cast,...decor.filter(i=>i.kind==='pet')].filter(i=>state.owned.includes(i.id)).map(i=>card(i,'figures')).join('')}</div><p class="note">Tippe auf eine Figur, damit sie mitspielt. Figuren in deiner Tasche kannst du dort zurückholen.</p><button class="text-button" data-action="store">Neue Freunde im Laden →</button>`;
 else if(activePanel==='furniture'){const building=['sofa','bed','table','cabinet','fridge','counter','stool','shelf','rug','window','curtain','easel'];const items=decor.filter(i=>state.owned.includes(i.id)&&(furnitureTab==='furniture'?building.includes(i.id):!building.includes(i.id)));c.innerHTML=`<div class="tabs">${[['props','Kleine Dinge'],['furniture','Möbel & Raum']].map(([id,n])=>`<button data-furniture-tab="${id}" aria-pressed="${furnitureTab===id}">${n}</button>`).join('')}</div><div class="card-grid">${items.map(i=>card(i)).join('')}</div><p class="note">Auch Sonne, Wolken, Fenster und Möbel kannst du verschieben und einpacken.</p>`}
 else if(activePanel==='bag')c.innerHTML=`<p class="note" style="margin:0 0 18px">Zieh Dinge auf die Tasche oder wähle „Einpacken“. Hier kannst du sie jederzeit zurückholen.</p>${stored().length?`<div class="card-grid">${stored().map(o=>card(item(o.id),'decor',o)).join('')}</div>`:'<div class="empty"><strong>Hier ist noch Platz für deine Ideen.</strong>Deine eingepackten Dinge landen hier. Sie bleiben gespeichert.</div>'}`;
 else if(activePanel==='map')c.innerHTML=`<div class="card-grid">${homes.map(i=>card(i,'houses')).join('')}</div><p class="note">Jedes Zuhause hat seine eigene Einrichtung und Tasche.</p>`;
 else if(activePanel==='rewards')c.innerHTML=`<div class="reward-art">✦</div><div class="dialog-copy"><p><strong>Aus deinen Ideen wird ein Zuhause.</strong></p><p>Eine neue gelöste Aufgabe bringt 15 Sterne. Mit Sternen holst du Möbel, Pflanzen und tierische Freunde. Tipps und neue Versuche sind immer erlaubt.</p><p>Dein Guthaben: <strong>${state.balance} Sterne</strong></p></div><button class="primary wide" data-action="learn">Nächste Aufgabe spielen →</button><p class="note">Keine Käufe mit Echtgeld. Keine Werbevideos. Mit einer kleinen Sonnen-Überraschung.</p>`;
 else c.innerHTML=`<div class="info-list"><p><strong>Alles ist zum Anfassen da.</strong><br>Figuren, Möbel, Pflanzen, Lampen, Sonne und Wolken: Tippe etwas an oder zieh es an einen neuen Platz.</p><p><strong>Einpacken & zurückholen.</strong><br>Zieh ein Objekt auf die Tasche oder tippe nach dem Auswählen auf das Taschen-Symbol. Die Dinge bleiben erhalten.</p><p><strong>Kleine Überraschungen.</strong><br>Öffne den Kühlschrank, dreh den Wasserhahn auf, lass es regnen, spiele Gitarre oder setze eine Figur aufs Sofa. Kleine Dinge kannst du einer Figur in die Hand ziehen.</p><p><strong>Deine Welt, dein Tempo.</strong><br>Mit den Pfeilen oder durch Ziehen am Hintergrund schaust du dich um. Tippe auf eine Wand, um ihre Farbe zu ändern. Oben kannst du Animationen und Töne umschalten.</p><p><strong>Tastatur.</strong><br>Tab wählt aus, Pfeiltasten bewegen, Enter benutzt, Entf packt ein. Escape hebt die Auswahl auf.</p></div><div class="settings-actions"><button data-action="tidy">Vorhandene Dinge aufräumen</button><button data-action="fullscreen">Vollbild umschalten</button><button data-install-app>App installieren</button></div><p class="note">${storageOK?'Lokal in diesem Browser gespeichert.':'Lokale Speicherung ist nicht verfügbar.'} Lerndachs ist ein eigenständiger Entwurf mit neu erstellten Grafiken und Klängen. Keine Verbindung zu Toca Boca oder Duolingo. Arbeitstitel.</p>`;
}
$('#panel-content').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.id,action=b.dataset.action;if(b.dataset.tab){shopTab=b.dataset.tab;renderPanel();return}if(b.dataset.furnitureTab){furnitureTab=b.dataset.furnitureTab;renderPanel();return}
 if(action==='buy'){const i=item(id);if(!state.journey.starterUnlocked)return;if(!homes.some(h=>h.id===id)&&current().length>=120){toast('Dein Raum ist voll. Packe zuerst etwas ein.');return}const r=WunderEconomy.purchase(state,i);if(!r.purchased){if(r.reason==='insufficient')toast(`Dir fehlen noch ${i.price-state.balance} Sterne. Mit der nächsten Aufgabe kommst du näher!`);return}save();if(!homes.some(h=>h.id===id))place(id,true);else renderPanel();chime();toast(`${i.name} gehört jetzt zu deiner Welt!`)}
 if(action==='target'){state.journey.target=id;save();renderPanel();toast('Sparziel gesetzt. Jede Aufgabe bringt dich näher!')}
 if(action==='learn'){$('#panel').close();window.dispatchEvent(new Event('request-learning'))}
 if(action==='place')place(id);if(action==='restore')restore(id);
 if(action==='visit'){state.home=id;selected=null;current();render();$('#panel').close();centerScene()}
 if(action==='store'){shopTab=homes.some(h=>h.id===id)?'houses':'figures';showPanel('shop')}
 if(action==='tidy'){const home=state.home,old=structuredClone({placed:current(),stored:stored()}),defaults=A.defaults(home);for(const o of [...current(),...stored()]){const d=defaults.find(d=>d.id===o.id);if(d){o.x=d.x;o.y=d.y}delete o.carrier}state.placed[home]=[...current(),...stored()];state.stored[home]=[];selected=null;render();$('#panel').close();toast('Deine vorhandenen Dinge sind aufgeräumt.',()=>{state.placed[home]=old.placed;state.stored[home]=old.stored;if(state.home===home)render();save()})}
 if(action==='fullscreen'){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>toast('Vollbild ist hier nicht verfügbar.'))}
});
function place(id,purchased=false){if(!state.journey.starterUnlocked||!state.owned.includes(id))return;if(!purchased){const bag=stored().find(o=>o.id===id);if(bag){restore(bag.uid);return}const existing=current().find(o=>o.id===id);if(existing){$('#panel').close();focusObject(existing);toast('Das ist schon in deinem Zimmer. Weitere Exemplare gibt es im Laden.');return}const elsewhere=Object.values(state.placed).flat().some(o=>o.id===id)||Object.values(state.stored).flat().some(o=>o.id===id);if(elsewhere){toast('Das steht in einem anderen Zuhause. Besuche es über die Nachbarschaft.');return}}if(chars.has(id)&&current().some(o=>o.id===id))return;if(current().length>=120){toast('Ganz schön voll. Packe zuerst etwas ein.');return}const isPet=item(id)?.kind==='pet',x=(scene.scrollLeft+scene.clientWidth*(isPet?.28:.5))/$('#world').clientWidth*1600,o={uid:uid(),id,x,y:chars.has(id)?790:isPet?815:735,s:1,layer:isPet?4.1:A.layer(id)};current().push(o);renderObjects();save();$('#panel').close();select(o);effect(o)}
function credit(payload){const result=WunderEconomy.credit(state,payload);save();return result}
window.Lerndachs=Object.freeze({version:3,getSnapshot:()=>structuredClone(state)});
$('#map-button').onclick=()=>showPanel('map');$('#wallet').onclick=()=>showPanel('rewards');$('#help').onclick=()=>showPanel('help');$('#bag-button').onclick=()=>showPanel('bag');
document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>showPanel(b.dataset.panel));$('#close-panel').onclick=()=>$('#panel').close();$('#panel').addEventListener('click',e=>{if(e.target===$('#panel')){const r=$('#panel').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#panel').close()}});
$('#day-toggle').onclick=()=>{sunClick();state.night=!state.night;render()};$('#motion-toggle').onclick=()=>{state.paused=!state.paused;render()};$('#sound-toggle').onclick=()=>{sound=!sound;$('#sound-toggle').setAttribute('aria-pressed',sound);$('#sound-toggle').setAttribute('aria-label',sound?'Töne ausschalten':'Töne einschalten');if(sound)chime()};$('#dismiss-hint').onclick=()=>{$('#welcome-hint').hidden=true};
$('#deselect').onclick=()=>select(null);$('#pack-object').onclick=()=>pack(current().find(o=>o.uid===selected));$('#use-object').onclick=()=>use(current().find(o=>o.uid===selected));$('#flip-object').onclick=()=>{const o=current().find(o=>o.uid===selected);if(o){o.flip=!o.flip;renderObjects();save()}};
setInterval(()=>{if(state.paused||document.hidden)return;for(const o of current().filter(o=>o.id==='radio'&&o.on))effect(o,'music')},2600);
if(matchMedia('(prefers-reduced-motion: reduce)').matches)state.paused=true;
render();centerScene();setTimeout(()=>{$('#welcome-hint').hidden=true},8500);

window.Lernwelt={snapshot:()=>structuredClone(state),find:id=>current().find(o=>o.id===id),focus:id=>{const o=current().find(o=>o.id===id);if(o)focusObject(o);return !!o},reward:(receiptId,stars)=>credit({receiptId,stars}),use:id=>use(current().find(o=>o.id===id)),pack:id=>pack(current().find(o=>o.id===id)),restore};

// Preserve the original adapter name for existing integrations.
window.MeineKleineWelt=window.Lerndachs;

function grantStarter(){
 if(state.journey.starterUnlocked||!state.journey.starterEarned)return false;
 state.journey.starterUnlocked=true;
 for(const o of LerndachsWorld.starterObjects('garden')){if(!state.owned.includes(o.id))state.owned.push(o.id);state.placed.garden.push(o)}
 state.home='garden';render();centerScene();effect({x:800,y:500});return true;
}
function showPet(o){
 selected=o.uid;const i=item(o.id);$('#panel-title').textContent=o.petName||i.name;$('#panel-kicker').textContent='DEIN TIERISCHER FREUND';activePanel='pet';
 $('#panel-content').innerHTML=`<div class="pet-portrait">${preview(i)}</div><p class="pet-bond">${'♥'.repeat(Math.min(5,o.bond||0))}${'♡'.repeat(5-Math.min(5,o.bond||0))}</p><p class="note">Zeit zusammen ist schön. Dein Tier wartet ohne Zeitdruck auf dich.</p><div class="pet-actions"><button data-care="stroke">♡ Streicheln</button><button data-care="feed">♧ Füttern</button><button data-care="play">✦ Spielen</button></div><p id="pet-feedback" role="status">Was möchtet ihr zusammen machen?</p><label class="pet-name-label">Name <input id="pet-name" maxlength="24" value=""></label><button id="save-pet-name" class="primary wide">Namen speichern</button>`;
 $('#pet-name').value=o.petName||i.name;
 $('#panel-content').querySelectorAll('[data-care]').forEach(b=>b.onclick=()=>{o.bond=Math.min(5,(o.bond||0)+1);save();$('#panel-content .pet-bond').textContent='♥'.repeat(o.bond)+'♡'.repeat(5-o.bond);$('#pet-feedback').textContent=({stroke:'Dein Freund genießt die kleine Pause.',feed:'Lecker! Gemeinsam kümmert ihr euch um euren Alltag.',play:'Was für ein schöner Spielmoment!'})[b.dataset.care];effect(o);WorldSound?.effect(o.id);animate(o)});
 $('#save-pet-name').onclick=()=>{const name=$('#pet-name').value.trim();if(name){o.petName=name;save();$('#panel-title').textContent=name;renderObjects();toast('Name gespeichert.')}};
 if(!$('#panel').open)$('#panel').showModal();
}
window.LerndachsJourney={get profile(){return state.journey},save,grantStarter,get catalogue(){return allItems},art,preview,showShop(tab='decor'){shopTab=tab;showPanel('shop')},reward(id,stars=15){if(state.journey.done.includes(id))return false;const r=WunderEconomy.credit(state,{receiptId:'task-'+id,stars});if(r.credited){state.journey.done.push(id);if(state.journey.together)state.journey.turn=state.journey.turn===1?2:1}save();return r.credited},focusObject,render};
// A mission can retrieve already-owned props without granting unearned items.
function bringOwned(id){
 if(!state.journey.starterUnlocked||!state.owned.includes(id)||current().some(o=>o.id===id))return;
 for(const [home,objects] of Object.entries(state.stored)){const index=objects.findIndex(o=>o.id===id);if(index>=0){const [o]=objects.splice(index,1);delete o.carrier;current().push(o);renderObjects();save();return}}
 for(const [home,objects] of Object.entries(state.placed)){if(home===state.home)continue;const index=objects.findIndex(o=>o.id===id);if(index>=0){const [o]=objects.splice(index,1);delete o.carrier;current().push(o);renderObjects();save();return}}
}
LerndachsJourney.bring=bringOwned;

LerndachsJourney.prepare=goal=>{
 if(goal==='water'){const can=current().find(o=>o.id==='watering'),plant=current().find(o=>o.id==='plant');if(can&&plant&&Math.hypot(can.x-plant.x,can.y-plant.y)>350){can.x=plant.x+120;can.y=plant.y-200;can.layer=3.4;renderObjects();save()}}
 if(goal==='left'){const table=current().find(o=>o.id==='table'),stool=current().find(o=>o.id==='stool');if(table&&stool&&Math.abs(table.x-stool.x)>250){stool.x=table.x+200;stool.y=table.y+35;renderObjects();save()}}
};

LerndachsJourney.getTimetable=()=>state.timetable;
LerndachsJourney.setTimetable=plan=>{state.timetable=plan;save()};

// Seven sun interactions form one persistent bonus receipt.
function sunClick(){
 state.journey.sunClicks=(Number.isSafeInteger(state.journey.sunClicks)?state.journey.sunClicks:0)+1;
 if(state.journey.sunClicks%7===0){const r=credit({receiptId:'sun-bonus-'+state.journey.sunClicks/7,stars:250});if(r.credited){toast('Sonnengeheimnis! +250 Sterne für deine Welt.');window.dispatchEvent(new Event('learning-celebration'))}}
 else save();
}

window.addEventListener('request-world-help',()=>showPanel('help'));
