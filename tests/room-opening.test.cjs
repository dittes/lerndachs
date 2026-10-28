const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {resolve}=require('node:path');
const vm=require('node:vm');
const {parseHTML}=require('linkedom');

const root=resolve(__dirname,'..');
const read=name=>readFileSync(resolve(root,name),'utf8');

function loadGame(saved,{realAudio=false,reducedMotion=false}={}){
 const {window}=parseHTML(read('index.html')),document=window.document,timers=new Map(),notes=[];
 let now=0,nextTimer=0,stored=saved?JSON.stringify(saved):null;
 const schedule=(fn,delay=0,interval=0)=>{const id=++nextTimer;timers.set(id,{fn,at:now+delay,interval});return id};
 const prototype=window.HTMLElement.prototype;
 Object.defineProperty(prototype,'open',{configurable:true,get(){return this.hasAttribute('open')}});
 prototype.showModal=function(){this.setAttribute('open','')};
 prototype.close=function(){if(this.open){this.removeAttribute('open');this.dispatchEvent(new window.Event('close'))}};
 prototype.scrollTo=function({left}){this.scrollLeft=left};
 prototype.scrollBy=function({left}){this.scrollLeft+=left};
 window.Element.prototype.setPointerCapture=function(){};
 const scene=document.querySelector('#scene-scroll');scene.scrollLeft=0;
 Object.defineProperty(scene,'clientWidth',{value:800});Object.defineProperty(scene,'scrollWidth',{value:1600});
 Object.defineProperty(document.querySelector('#world'),'clientWidth',{value:1600});
 document.querySelector('#world').getScreenCTM=()=>({inverse:()=>({})});
 function audioNode(){
  const parameter={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}};
  return {frequency:{...parameter,setValueAtTime(value){notes.push(value)}},gain:parameter,threshold:{},knee:{},ratio:{},attack:{},release:{},connect(node){return node},disconnect(){},start(){},stop(){schedule(()=>this.onended?.())}};
 }
 class AudioContext{
  currentTime=0;sampleRate=8000;destination={};
  resume(){return Promise.resolve()}
  suspend(){}
  createGain(){return audioNode()}
  createDynamicsCompressor(){return audioNode()}
  createOscillator(){return audioNode()}
  createBufferSource(){return audioNode()}
  createBiquadFilter(){return audioNode()}
  createBuffer(channels,length){return {getChannelData:()=>new Float32Array(length)}}
 }
 const events=new window.EventTarget();
 const context={document,console,crypto,structuredClone,AudioContext,Event:window.Event,CustomEvent:window.CustomEvent,
  DOMPoint:class{constructor(x,y){this.x=x;this.y=y}matrixTransform(){return this}},
  navigator:{},location:{protocol:'http:'},performance:{now:()=>now},innerWidth:800,
  localStorage:{getItem:()=>stored,setItem:(key,value)=>{stored=value}},
  matchMedia:()=>({matches:reducedMotion}),
  setTimeout:(fn,delay)=>schedule(fn,delay),clearTimeout:id=>timers.delete(id),
  setInterval:(fn,delay)=>schedule(fn,delay,delay),clearInterval:id=>timers.delete(id),
  requestAnimationFrame:fn=>schedule(fn,16),MutationObserver:class{observe(){}},
  addEventListener:(...args)=>events.addEventListener(...args),removeEventListener:(...args)=>events.removeEventListener(...args),dispatchEvent:event=>events.dispatchEvent(event)
 };
 context.window=context;vm.createContext(context);vm.runInContext(read('app.js'),context,{filename:'app.js'});
 if(!realAudio)context.WorldSound={effect(){},sync(){},nextStation(){},stopSample(){}};
 const advance=milliseconds=>{
  const end=now+milliseconds;
  while(true){
   const next=[...timers].filter(([,timer])=>timer.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];
   if(!next)break;
   const [id,timer]=next;now=timer.at;timers.delete(id);if(timer.interval)timers.set(id,{...timer,at:now+timer.interval});timer.fn();
  }
  now=end;
 };
 const click=selector=>{const button=document.querySelector(selector);assert.ok(button,`Missing button: ${selector}`);button.click()};
 return {context,document,advance,click,notes,snapshot:()=>context.Lernwelt.snapshot(),saved:()=>JSON.parse(stored),
  pointer(type,x,y,selector){const event=new context.Event(type,{bubbles:true,cancelable:true});Object.assign(event,{clientX:x,clientY:y,pointerId:1,button:0});if(selector)document.querySelector(selector).dispatchEvent(event);else context.dispatchEvent(event)},
  tap(id){context.Lernwelt.use(id);advance(250)}};
}

function exploreAndMoveIn(game){
 const {context,document,click}=game;
 assert.ok(document.querySelector('[data-kind="dachs"] .badger-curled'));
 game.tap('tea');game.tap('books');game.tap('plant');
 assert.equal(context.LerndachsJourney.profile.opening,'couch');
 game.tap('sofa');assert.equal(context.LerndachsJourney.profile.opening,'dachs');
 game.tap('dachs');assert.equal(context.LerndachsJourney.profile.opening,'move-in');
 assert.ok(document.querySelector('[data-kind="dachs"] .badger-standing'));
 assert.equal(context.Lernwelt.find('dachs').y,790);
 assert.equal(document.querySelectorAll('dialog[open]').length,0);
 click('#room-guide-action');
 assert.equal(document.querySelector('#character-dialog').open,true);
 click('#close-character');
 assert.equal(document.querySelector('#character-dialog').open,false);
 assert.equal(context.LerndachsJourney.profile.opening,'move-in');
 click('#room-guide-action');
 assert.equal(document.querySelectorAll('[data-person]').length,4);
 click('[data-person="lumi"]');
 document.querySelector('#person-form').dispatchEvent(new context.Event('submit',{cancelable:true}));
 assert.equal(context.LerndachsJourney.player().characterName,'Lumi');
}

test('play, discover, move in, buy, then choose a class and earn the next item',()=>{
 const game=loadGame(),{context,document,click}=game;
 assert.equal(document.querySelectorAll('dialog[open]').length,0);
 assert.ok(context.Lernwelt.find('sofa'));assert.ok(context.Lernwelt.find('dachs'));
 assert.match(document.querySelector('[data-kind="dachs"]').getAttribute('aria-label'),/^Dachs:/);
 exploreAndMoveIn(game);
 assert.equal(game.snapshot().balance,35);assert.equal(game.snapshot().journey.grade,null);
 click('#room-guide-action');assert.equal(document.querySelectorAll('[data-action="buy"]').length,3);
 click('[data-action="buy"][data-id="balloon"]');
 assert.equal(game.snapshot().balance,15);assert.equal(game.snapshot().journey.opening,'second-item');
 click('#room-guide-action');click('[data-action="buy"][data-id="flower"]');
 assert.equal(game.snapshot().balance,15);assert.equal(game.snapshot().journey.opening,'earn');
 assert.equal(document.querySelector('#learning-dialog').open,false);
 assert.match(document.querySelector('.shop-invitation').textContent,/Noch 10 Sterne/);
 click('[data-action="learn"]');
 assert.equal(document.querySelector('#learning-dialog').open,true);
 assert.match(document.querySelector('#learn-title').textContent,/Klasse/);
 click('[data-grade="0"]');click('#confirm-grade');
 const task=context.Learning.currentTask;
 assert.ok(task[7].grades.includes(0));assert.equal(task[7].type,'garden');
 click('#garden-add');click('#garden-add');click('#garden-add');click('#check-garden');
 assert.equal(game.snapshot().balance,30);assert.equal(document.querySelector('#reward-shop').hidden,false);
 click('#reward-shop');click('[data-action="buy"][data-id="flower"]');
 assert.equal(game.snapshot().balance,5);assert.ok(context.Lernwelt.find('flower'));
 assert.equal(document.querySelector('#room-guide').hidden,true);
 assert.equal(context.LerndachsJourney.reward(task[7].id+'-g0'),false);
});

test('every first shop choice is affordable, with too few stars for a second item',()=>{
 for(const first of ['balloon','flower','picture']){
  const game=loadGame(),{context,click}=game,p=context.LerndachsJourney.profile;
  p.opening='shop';context.LerndachsJourney.grantStarter();context.LerndachsJourney.showShop();
  click(`[data-action="buy"][data-id="${first}"]`);
  const prices=context.LerndachsWorld.shopStock.map(id=>context.LerndachsJourney.catalogue.find(item=>item.id===id).price);
  assert.ok(context.Lernwelt.find(first));assert.ok(game.snapshot().balance<Math.min(...prices));
 }
});

test('reloading keeps discovery progress and the first purchase without duplicate gifts',()=>{
 let game=loadGame();game.tap('tea');game.tap('books');game.tap('plant');game.tap('sofa');
 const before=game.snapshot();game=loadGame(game.saved());
 assert.equal(game.snapshot().journey.opening,'dachs');assert.equal(game.snapshot().placed.garden.length,before.placed.garden.length);
 game.tap('dachs');game.click('#room-guide-action');
 game.document.querySelector('#person-form').dispatchEvent(new game.context.Event('submit',{cancelable:true}));
 game.click('#room-guide-action');game.click('[data-action="buy"][data-id="picture"]');
 game=loadGame(game.saved());
 assert.equal(game.snapshot().journey.opening,'second-item');assert.equal(game.snapshot().balance,0);
 assert.equal(game.context.LerndachsJourney.grantStarter(),false);
 assert.equal(game.snapshot().receipts.filter(id=>id==='welcome-home').length,1);
 assert.equal(game.snapshot().placed.garden.filter(item=>item.id==='picture').length,1);
});

test('existing worlds keep their characters, furniture, stars and learning progress',()=>{
 const saved={version:3,balance:77,home:'garden',owned:['garden','sofa','milo'],stored:{garden:[]},receipts:['task-numbers1'],
  placed:{garden:[{uid:'old-sofa',id:'sofa',x:400,y:650,layer:3},{uid:'old-player',id:'milo',x:700,y:790,layer:4,characterName:'Ada'}]},
  journey:{grade:2,starterUnlocked:true,done:['numbers1'],active:null}};
 const game=loadGame(saved),snapshot=game.snapshot();
 assert.equal(snapshot.balance,77);assert.equal(snapshot.journey.opening,'done');assert.equal(snapshot.journey.grade,2);
 assert.equal(game.context.LerndachsJourney.player().characterName,'Ada');
 assert.deepEqual(Array.from(snapshot.journey.done),['numbers1']);
 assert.equal(game.context.Lernwelt.find('sofa').x,400);
 assert.equal(game.document.querySelectorAll('dialog[open]').length,0);assert.equal(game.context.Lernwelt.find('dachs'),undefined);
});

test('tap reactions survive redraws, end cleanly, and balloons remain playable',()=>{
 const game=loadGame(),{context,document}=game;
 context.Lernwelt.use('sofa');context.LerndachsJourney.render();
 assert.ok(document.querySelector('[data-kind="sofa"]').classList.contains('reacting'));
 game.advance(900);assert.equal(document.querySelector('[data-kind="sofa"]').classList.contains('reacting'),false);
 context.LerndachsJourney.profile.opening='shop';context.LerndachsJourney.grantStarter();context.LerndachsJourney.showShop();
 game.click('[data-action="buy"][data-id="balloon"]');game.tap('balloon');game.tap('balloon');
 assert.ok(context.Lernwelt.find('balloon'));assert.equal(game.snapshot().stored.garden.length,0);
 assert.equal(loadGame(undefined,{reducedMotion:true}).document.body.classList.contains('no-motion'),true);
});

test('soft furnishings and plants have different sounds, and mute is respected',()=>{
 const game=loadGame(undefined,{realAudio:true}),{context,notes}=game;
 context.WorldSound.effect('sofa');const sofa=notes.slice();game.advance(900);notes.length=0;
 context.WorldSound.effect('plant');const plant=notes.slice();
 assert.ok(sofa.length>0);assert.ok(plant.length>0);assert.notDeepEqual(sofa,plant);
 game.click('#sound-toggle');notes.length=0;context.WorldSound.effect('sofa');assert.equal(notes.length,0);
});

test('radio starts off, toggles, and stays off through other sounds and music samples',()=>{
 const game=loadGame(undefined,{realAudio:true}),{context}=game;
 assert.equal(context.Lernwelt.find('radio').on,false);assert.equal(context.WorldSound.status.playing,false);
 game.tap('books');assert.equal(context.WorldSound.status.playing,false);
 game.tap('radio');assert.equal(context.Lernwelt.find('radio').on,true);assert.equal(context.WorldSound.status.playing,true);
 game.click('#sound-toggle');assert.equal(context.WorldSound.status.playing,false);
 game.click('#sound-toggle');assert.equal(context.WorldSound.status.playing,true);
 game.tap('radio');assert.equal(context.Lernwelt.find('radio').on,false);assert.equal(context.WorldSound.status.playing,false);
 context.LerndachsJourney.render();assert.equal(context.WorldSound.status.playing,false);
 context.WorldSound.playSample({notes:[[440,.1,.04,0]]});game.advance(500);
 assert.equal(context.WorldSound.status.playing,false);
 assert.equal(loadGame(game.saved(),{realAudio:true}).context.Lernwelt.find('radio').on,false);
});

test('a quick sofa tap keeps cushions above it; only a hold enables dragging',()=>{
 const game=loadGame(),{context,document,pointer,advance}=game,selector='[data-kind="sofa"]';
 const order=()=>Array.from(document.querySelector('#objects').children,node=>node.dataset.uid);
 const originalOrder=order(),sofa=context.Lernwelt.find('sofa'),start={x:sofa.x,y:sofa.y};
 pointer('pointerdown',start.x,start.y,selector);advance(100);
 assert.deepEqual(order(),originalOrder);assert.equal(document.body.classList.contains('is-dragging'),false);
 pointer('pointermove',start.x+2,start.y+2);pointer('pointerup',start.x+2,start.y+2);
 assert.equal(sofa.x,start.x);assert.equal(sofa.y,start.y);assert.deepEqual(order(),originalOrder);
 pointer('pointerdown',start.x,start.y,selector);context.LerndachsJourney.render();advance(330);
 assert.equal(document.body.classList.contains('is-dragging'),true);
 pointer('pointermove',start.x+60,start.y+30);pointer('pointerup',start.x+60,start.y+30);
 assert.equal(sofa.x,start.x+60);assert.equal(sofa.y,start.y+30);
 assert.equal(document.body.classList.contains('is-dragging'),false);
});

test('moving before the hold and cancelling a pickup do not move the sofa',()=>{
 const game=loadGame(),{context,pointer,advance}=game,selector='[data-kind="sofa"]';
 const sofa=context.Lernwelt.find('sofa'),start={x:sofa.x,y:sofa.y};
 pointer('pointerdown',start.x,start.y,selector);pointer('pointermove',start.x+30,start.y);advance(400);pointer('pointerup',start.x+30,start.y);
 assert.equal(sofa.x,start.x);assert.equal(sofa.y,start.y);
 pointer('pointerdown',start.x,start.y,selector);advance(330);pointer('pointermove',start.x+80,start.y+20);pointer('pointercancel',start.x+80,start.y+20);
 assert.equal(sofa.x,start.x);assert.equal(sofa.y,start.y);
});

test('celebrations vary, stay above dialogs, clean up, and respect reduced motion',()=>{
 const game=loadGame(),{context,document,advance}=game,kinds=[];
 let previous;
 for(let i=0;i<3;i++){
  context.dispatchEvent(new context.Event('learning-celebration'));
  const layer=document.querySelector('#learning-confetti');kinds.push(layer.className);
  assert.ok(layer.children.length>0);if(previous)assert.equal(previous.isConnected,false);previous=layer;
 }
 assert.equal(new Set(kinds).size,3);
 const dialog=document.querySelector('#panel');dialog.showModal();
 context.dispatchEvent(new context.CustomEvent('learning-celebration',{detail:{kind:'stars'}}));
 assert.equal(document.querySelector('#learning-confetti').parentElement,dialog);
 advance(3700);assert.equal(document.querySelector('#learning-confetti'),null);
 const quiet=loadGame(undefined,{reducedMotion:true});quiet.context.dispatchEvent(new quiet.context.Event('learning-celebration'));
 const layer=quiet.document.querySelector('#learning-confetti');assert.ok(layer.classList.contains('quiet-celebration'));assert.equal(layer.children.length,12);
 quiet.advance(1400);assert.equal(quiet.document.querySelector('#learning-confetti'),null);
});
