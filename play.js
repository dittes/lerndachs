/* Original procedural effects and five original, gently voiced radio stations. */
(()=>{
const musicNotes=new Set();
let ctx,master,music,enabled=state.audioSettings.enabled!==false,volume=state.audioSettings.volume??.6,station=state.audioSettings.station??0,timer,step=0,playing=false,voices=0,water,sampleNodes=[],sampleActive=false,sampleResume,activated=false;
const stations=[
 {name:'Wiesenklang · Akustik',base:196,beat:360,voice:'pluck',melody:[0,4,7,12,7,4,2,7,5,9,12,9,7,4,2,null],roots:[0,-5,-3,-5]},
 {name:'Mondcafé · Sanfter Jazz',base:174.61,beat:430,voice:'piano',melody:[0,null,7,11,12,9,7,4,2,5,9,null,11,7,4,2],roots:[0,-3,-5,-7]},
 {name:'Wolkenreise · Ambient',base:146.83,beat:760,voice:'pad',melody:[12,null,7,null,14,null,12,null,7,null,4,null,9,null,7,null],roots:[0,-5,-3,-5]},
 {name:'Sonnenhüpfer · Marimba',base:220,beat:300,voice:'wood',melody:[0,7,12,9,7,4,2,4,5,9,12,14,12,9,7,null],roots:[0,-5,-3,-5]},
 {name:'Sternenzeit · Spieluhr',base:261.63,beat:560,voice:'bell',melody:[0,7,12,16,14,12,7,null,5,9,12,17,16,12,7,null],roots:[0,-5,-3,-5]}
];
const names=stations.map(s=>s.name);station=Number.isInteger(station)&&station>=0&&station<names.length?station:0;
function persistAudio(){state.audioSettings={enabled,volume,station,gainVersion:1,radioSwitchVersion:1};save()}
function init(){if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=0;const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-14;limiter.knee.value=12;limiter.ratio.value=5;limiter.attack.value=.012;limiter.release.value=.24;const warmth=ctx.createBiquadFilter();warmth.type='lowpass';warmth.frequency.value=3800;warmth.Q.value=.45;master.connect(warmth);warmth.connect(limiter);limiter.connect(ctx.destination);music=ctx.createGain();music.gain.value=0;music.connect(master)}ctx.resume().catch(()=>{});master.gain.setTargetAtTime(enabled?volume:0,ctx.currentTime,.03)}
function tone(hz,d=.3,type='sine',gain=.06,delay=0,dest=master){if(!ctx||voices>32)return;voices++;d=Math.max(.15,d);const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+delay,attack=Math.min(.06,d*.25);o.type=type;o.frequency.setValueAtTime(Math.max(50,hz),t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain*(dest===music?1:.62)),t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+d);const note={o,g};if(dest===music)musicNotes.add(note);o.connect(g).connect(dest);o.start(t);o.stop(t+d+.03);o.onended=()=>{voices--;musicNotes.delete(note);o.disconnect();g.disconnect()};return o}
function noise(d=.25,gain=.015,freq=900){if(!ctx||voices>32)return;voices++;const n=ctx.createBufferSource(),b=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*d),ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++){const t=i/a.length;a[i]=(Math.random()*2-1)*Math.sin(Math.PI*t)**2}n.buffer=b;const f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='lowpass';f.frequency.value=freq;f.Q.value=.4;g.gain.value=gain*.65;n.connect(f).connect(g).connect(master);n.start();n.onended=()=>{voices--;n.disconnect();f.disconnect();g.disconnect()};return n}
function effect(id){if(!enabled)return;activated=true;init();
 if(id==='reward'){[392,493.88,587.33,783.99].forEach((h,i)=>tone(h,.65,'sine',.07,i*.13));return}
 if(['sofa','bed','cushion','blanket','rug'].includes(id)){tone(147,.2,'triangle',.08);tone(220,.28,'sine',.06,.08);return}
 if(['plant','flower','hanging','tree','curtain'].includes(id)){noise(.3,.018,1000);tone(523,.3,'sine',.035,.1);return}
 if(['watering','cloud','counter'].includes(id)){noise(.45,.045,900);[392,523,659].forEach((h,i)=>tone(h,.24,'sine',.028,i*.14));return}
 if(['table','stool','shelf','books','basket','drop','tap'].includes(id)){tone(262,.12,'triangle',.09);tone(392,.16,'sine',.035,.055);return}
 if(['tea','jar','kettle','fishbowl'].includes(id)){tone(659,.55,'sine',.05);tone(988,.4,'sine',.018,.07);return}
 if(['lamp','pendant','fridge','cabinet','fan','clock','radio'].includes(id)){tone(330,.08,'triangle',.07);tone(494,.14,'sine',.05,.07);return}
 if(id==='camera'){noise(.16,.02,1200);tone(523,.22,'triangle',.035,.1);return}
 if(id==='cat'){tone(110,.6,'triangle',.025);tone(165,.45,'sine',.04,.12);return}
 if(id==='dog'){tone(196,.13,'triangle',.08);tone(147,.18,'triangle',.07,.16);return}
 if(id==='rabbit'){[587,784].forEach((h,i)=>tone(h,.14,'sine',.06,i*.12));return}
 if(id==='balloon'){[392,523,784].forEach((h,i)=>tone(h,.2,'sine',.055,i*.065));return}
 if(id==='dachs'){[392,494,587].forEach((h,i)=>tone(h,.18,'triangle',.06,i*.1));return}
 if(id==='guitar'){[196,246.94,293.66,392].forEach((h,i)=>tone(h,.9,'triangle',.07,i*.05));return}
 const pitch=({radio:659,sun:659,picture:523,poster:587,cake:659,fruit:587,toaster:440})[id]||523.25;
 tone(pitch,.24,'sine',.07);tone(pitch*1.25,.28,'sine',.04,.065);
}
function instrument(hz,voice,d=.65,gain=.06,delay=0){
 tone(hz,d,voice==='pluck'||voice==='wood'?'triangle':'sine',gain,delay,music);
 if(voice==='piano')tone(hz*2,d*.6,'sine',gain*.12,delay+.012,music);
 if(voice==='bell')tone(hz*3,d*.45,'sine',gain*.08,delay+.015,music);
 if(voice==='pad')tone(hz*1.003,d,'sine',gain*.25,delay+.08,music);
}
function tick(){if(!playing||!enabled||document.hidden)return;init();const s=stations[station],n=s.melody[step%16],root=s.roots[Math.floor(step/8)%4],bass=s.base*2**(root/12),delay=s.voice==='piano'&&step%2?.055:0;
 if(n!==null)instrument(s.base*2**(n/12),s.voice,({pluck:.72,piano:.9,pad:1.8,wood:.38,bell:1.15})[s.voice],s.voice==='pad'?.045:.065,delay);
 if(step%4===0){tone(bass/2,s.voice==='pad'?2.5:.95,'sine',.065,0,music);if(['piano','pad'].includes(s.voice))for(const interval of [0,root===-3?3:4,7,...(s.voice==='piano'?[root===-3?10:11]:[])])instrument(bass*2**(interval/12),s.voice,s.voice==='pad'?2.7:1.3,.016,interval*.008)}
 if(s.voice==='pluck'&&step%2===0)instrument(bass*2**([7,12,4,7][step/2%4]/12),'pluck',.8,.022,.12);
 if(s.voice==='wood'&&step%2===1)tone(bass/2,.3,'sine',.025,.04,music);step++;
}
// This single stream belongs to the radio. There is no second ambient soundtrack.
function radio(on){
 if(ctx)for(const {o,g} of musicNotes){g.gain.cancelScheduledValues?.(ctx.currentTime);g.gain.setTargetAtTime(.0001,ctx.currentTime,.018);try{o.stop(ctx.currentTime+.08)}catch{}}
 playing=!!on;clearInterval(timer);
 if(playing){init();music.gain.setTargetAtTime(.55,ctx.currentTime,.12);tick();timer=setInterval(tick,stations[station].beat)}
 else if(ctx)music.gain.setTargetAtTime(0,ctx.currentTime,.07);
}
function sync(){
 const shouldPlay=activated&&enabled&&!sampleActive&&current().some(o=>o.id==='radio'&&o.on);
 if(playing!==shouldPlay)radio(shouldPlay);
 if(water&&!current().some(o=>o.id==='counter'&&o.on)){water.stop();water=null}
}
function setEnabled(on){enabled=on;activated=true;init();const b=document.querySelector('#sound-toggle');b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?'Töne ausschalten':'Töne einschalten');b.style.opacity=on?'1':'.65';if(!on&&water){water.stop();water=null}sync();persistAudio()}
document.querySelector('#sound-toggle').onclick=()=>{setEnabled(!enabled);if(enabled)effect('tea')};
function setStation(n){station=(Number(n)+names.length)%names.length;step=0;if(playing)radio(true);persistAudio()}
function cycleRadio(o){activated=true;if(!o.on){for(const other of current().filter(x=>x.id==='radio'))other.on=false;o.on=true;setStation(0)}else if(station<names.length-1)setStation(station+1);else{o.on=false;step=0}sync();toast(o.on?'♪ '+names[station]+' · '+(station+1)+' / '+names.length:'Radio aus');}
window.addEventListener('world-use',e=>{if(e.detail.id!=='counter')return;setTimeout(()=>{if(water){water.stop();water=null}if(!enabled||!current().find(o=>o.uid===e.detail.uid)?.on)return;init();const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*.008;water=ctx.createBufferSource();water.buffer=b;water.loop=true;const f=ctx.createBiquadFilter();f.frequency.value=900;water.connect(f).connect(master);water.start()},0)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)ctx?.suspend();else if(enabled)ctx?.resume()});
function stopSample(){clearTimeout(sampleResume);for(const node of sampleNodes){try{node?.stop()}catch{}}sampleNodes=[];sampleActive=false;sync()}
function playSample(sample){
 stopSample();sampleActive=true;enabled=true;activated=true;init();radio(false);persistAudio();
 const button=document.querySelector('#sound-toggle');button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Töne ausschalten');
 let duration=0;for(const [hz,durationSeconds,gain,delay] of sample.notes){sampleNodes.push(tone(hz,durationSeconds,'sine',gain,delay));duration=Math.max(duration,(delay+durationSeconds)*1000)}
 sampleResume=setTimeout(stopSample,duration+100);return duration;
}
window.WorldSound={effect,radio,cycleRadio,get stations(){return [...names]},nextStation(){setStation((station+1)%names.length)},playSample,stopSample,sync,setVolume(v){volume=Math.max(0,Math.min(1,Number(v)||0));persistAudio();if(ctx)master.gain.setTargetAtTime(enabled?volume:0,ctx.currentTime,.05)},get status(){return {enabled,playing,station,volume,voices,sampleActive}}};
const soundButton=document.querySelector('#sound-toggle');soundButton.setAttribute('aria-pressed',enabled);soundButton.setAttribute('aria-label',enabled?'Töne ausschalten':'Töne einschalten');
function activate(){if(activated)return;activated=true;sync();document.removeEventListener('pointerdown',activate,true);document.removeEventListener('keydown',activate,true)}document.addEventListener('pointerdown',activate,true);document.addEventListener('keydown',activate,true);
const obs=new MutationObserver(()=>{const c=document.querySelector('#panel-content');if(activePanel==='help'&&!document.querySelector('#volume-control')){const row=document.createElement('label');row.className='volume-setting';row.innerHTML='Lautstärke <input id="volume-control" type="range" min="0" max="1" step="0.05" value="'+volume+'">';c.append(row);row.querySelector('input').oninput=e=>WorldSound.setVolume(e.target.value)}});obs.observe(document.querySelector('#panel-content'),{childList:true});
})();

;
/* Draft-only wardrobe controls shared by initial choice and later edits. */
(()=>{'use strict';const A=LerndachsAvatar;
const svg=(id,a)=>`<svg viewBox="-80 -258 160 280" aria-hidden="true">${A.art(id,a)}</svg>`;
function mount(host,getId,initial,expanded=true){let id=getId(),draft=A.normalize(id,initial),tab='hair';const drafts=new Map([[id,draft]]);host.className='avatar-editor';host.innerHTML=`<button type="button" class="avatar-disclosure" aria-expanded="${expanded}">Aussehen ändern <span aria-hidden="true">✎</span></button><div class="avatar-workspace" ${expanded?'':'hidden'}><div class="avatar-stage"><div class="avatar-preview" role="img" aria-label="Vorschau deiner Figur"></div><p>So siehst du aus!</p><button type="button" class="avatar-reset">Neu anfangen</button></div><div class="avatar-controls"><div class="avatar-tabs" role="tablist" aria-label="Aussehen ändern">${[['hair','Haare'],['face','Gesicht'],['clothes','Kleidung'],['shoes','Schuhe'],['extras','Extras']].map(([key,label])=>`<button type="button" role="tab" id="avatar-tab-${key}" aria-controls="avatar-options" data-avatar-tab="${key}" aria-selected="${key===tab}" tabindex="${key===tab?0:-1}">${label}</button>`).join('')}</div><div id="avatar-options" role="tabpanel" aria-labelledby="avatar-tab-hair"></div></div></div>`;
const panel=host.querySelector('#avatar-options'),preview=host.querySelector('.avatar-preview'),workspace=host.querySelector('.avatar-workspace'),disclosure=host.querySelector('.avatar-disclosure');
function swatches(key,title,palette){return `<fieldset><legend>${title}</legend><div class="avatar-swatches">${palette.map(([v,label])=>`<button type="button" data-avatar-key="${key}" data-avatar-value="${v}" aria-label="${title}: ${label}" aria-pressed="${draft[key]===v}" style="--swatch:${v}"><span aria-hidden="true">${draft[key]===v?'✓':''}</span></button>`).join('')}</div></fieldset>`}
function tiles(key,title){return `<fieldset><legend>${title}</legend><div class="avatar-tiles">${A.choices[key].map(([v,label])=>`<button type="button" data-avatar-key="${key}" data-avatar-value="${v}" aria-pressed="${draft[key]===v}"><span class="avatar-sample ${key==='outfit'?'sample-outfit':'sample-face'}">${svg(id,{...draft,[key]:v})}</span><span>${label}</span></button>`).join('')}</div></fieldset>`}
function renderOptions(){panel.setAttribute('aria-labelledby','avatar-tab-'+tab);const human=A.human(id);panel.innerHTML=tab==='hair'?(human?tiles('hairStyle','Frisur')+swatches('hair','Haarfarbe',A.colors.hair):'<p class="avatar-hint">Pippa und Mo behalten ihren Tierkopf. Kleidung, Schminke und Accessoires kannst du frei kombinieren.</p>'):tab==='face'?(human?swatches('skin','Hautfarbe',A.colors.skin):'')+tiles('makeup','Schminke'):tab==='clothes'?tiles('outfit','Das ziehe ich an')+swatches('top','Oberteil',A.colors.fabric)+swatches('bottom','Hose oder Rock',A.colors.fabric):tab==='shoes'?swatches('shoes','Schuhfarbe',A.colors.fabric):tiles('headwear','Für den Kopf')+tiles('eyewear','Brillen')}
function update(){preview.innerHTML=svg(id,draft);drafts.set(id,{...draft});renderOptions()}
function chooseTab(key,focus=false){tab=key;host.querySelectorAll('[role="tab"]').forEach(b=>{const active=b.dataset.avatarTab===tab;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;if(active&&focus)b.focus()});renderOptions()}
host.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;if(b===disclosure){workspace.hidden=!workspace.hidden;disclosure.setAttribute('aria-expanded',!workspace.hidden)}else if(b.classList.contains('avatar-reset')){draft=A.defaults(id);update()}else if(b.dataset.avatarTab)chooseTab(b.dataset.avatarTab);else if(b.dataset.avatarKey){const key=b.dataset.avatarKey,value=b.dataset.avatarValue;draft=A.normalize(id,{...draft,[key]:value});update();const selected=[...panel.querySelectorAll('[data-avatar-key]')].find(e=>e.dataset.avatarKey===key&&e.dataset.avatarValue===value);selected?.focus({preventScroll:true})}});
host.querySelector('.avatar-tabs').addEventListener('keydown',ev=>{const tabs=[...host.querySelectorAll('[role="tab"]')],i=tabs.indexOf(ev.target);if(i<0)return;let next;if(ev.key==='ArrowRight')next=(i+1)%tabs.length;if(ev.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(ev.key==='Home')next=0;if(ev.key==='End')next=tabs.length-1;if(next!==undefined){ev.preventDefault();chooseTab(tabs[next].dataset.avatarTab,true)}});
update();return {value:()=>({...draft}),change(next){id=next;draft={...(drafts.get(id)||A.defaults(id))};update()}}}
window.LerndachsAvatarEditor={mount};
})();

;
(()=>{
const J=LerndachsJourney,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dialog=document.createElement('dialog');dialog.id='character-dialog';dialog.setAttribute('aria-labelledby','character-title');document.body.append(dialog);
let mode,chosen,personUid,callback,residentTab='people';
function open(next='add',done,who){mode=next;callback=done;personUid=who;const person=J.people().find(p=>p.uid===(who||J.profile.playerUid));chosen=next==='add'||next==='initial'?'milo':person?.id||'milo';
 document.querySelector('#panel').close();document.querySelector('#learning-dialog').close();
 dialog.innerHTML=`<div class="dialog-top"><div><h2 id="character-title">${next==='initial'?'Wer zieht hier ein?':next==='add'?'Neuer Freund':'Deine Figur'}</h2></div><button class="icon-button" id="close-character" aria-label="Schließen">×</button></div><div class="people-grid">${(next==='initial'?WorldArt.cast.slice(0,4):WorldArt.cast).map(i=>`<button data-person="${i.id}" aria-pressed="${chosen===i.id}">${J.preview(i)}<strong>${esc(i.name)}</strong></button>`).join('')}</div><div id="avatar-editor-host"></div><form id="person-form"><label class="pet-name-label">Name <input id="character-name" required maxlength="24" autocomplete="off" aria-label="Name deiner Figur"></label><button id="confirm-character" class="journey-primary wide">${next==='initial'?'Einziehen!':next==='add'?'Freund hinzufügen':'Speichern'} →</button><p class="note">${next==='initial'?'':'Deine Figur kostet keine Sterne.'}</p><p id="character-error" role="status"></p></form>`;
 dialog.querySelector('#character-name').value=next==='initial'||next==='add'?WorldArt.names[chosen]:person?.name||WorldArt.names[chosen];
 const editor=LerndachsAvatarEditor.mount(dialog.querySelector('#avatar-editor-host'),()=>chosen,(next==='initial'||next==='add')?undefined:person?.appearance,next!=='initial');
 dialog.querySelectorAll('[data-person]').forEach(b=>b.onclick=()=>{const input=dialog.querySelector('input');if(input.value===WorldArt.names[chosen])input.value=WorldArt.names[b.dataset.person];chosen=b.dataset.person;editor.change(chosen);dialog.querySelectorAll('[data-person]').forEach(btn=>btn.setAttribute('aria-pressed',btn.dataset.person===chosen))});
 dialog.querySelector('#close-character')?.addEventListener('click',()=>dialog.close());
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();if(!J.person(chosen,dialog.querySelector('input').value,mode,personUid,editor.value())){dialog.querySelector('#character-error').textContent='Bitte wähle einen Namen. In deiner Welt können bis zu 20 Figuren mitspielen.';return}dialog.close();callback?.();if(mode!=='initial')window.dispatchEvent(new CustomEvent('learning-celebration',{detail:{kind:'stars'}}))};
 dialog.showModal();
}
function renderPeople(c){c.querySelector('.card-grid')?.remove();c.querySelectorAll('.note,.wide').forEach(e=>e.remove());const body=document.createElement('div');body.innerHTML=`<div class="friends-actions"><button class="journey-primary" data-friend-mode="change">Meine Figur ändern</button><button class="journey-primary" data-friend-mode="add">+ Freund hinzufügen</button></div><div class="card-grid">${J.people().map(o=>`<article class="item-card"><div class="item-art">${J.preview(o)}</div><div class="item-body"><h3>${esc(o.name)}</h3><p>${o.player?'Das bist du':'Dein Freund'}</p><button data-person-edit="${o.uid}">Figur ändern</button><button data-person-show="${o.uid}">Ins Zimmer holen</button></div></article>`).join('')}</div><p class="note">Du entscheidest, wer mitspielt. Namen bleiben auf diesem Gerät gespeichert. Eingepackte Freunde findest du auch in deiner Tasche.</p>`;c.append(body)}
function render(c){c.innerHTML=`<div class="resident-tabs" aria-label="Figuren und Tiere"><button data-resident-tab="people" aria-pressed="${residentTab==='people'}">Figuren</button><button data-resident-tab="pets" aria-pressed="${residentTab==='pets'}">Tiere</button></div>`;if(residentTab==='people'){renderPeople(c);return}
 const owned=J.pets();const body=document.createElement('div');body.className='card-grid pet-catalogue';body.innerHTML=LerndachsWorld.pets.map(p=>{const pet=owned.find(o=>o.id===p.id);return `<article class="item-card"><div class="item-art">${J.preview(p)}</div><div class="item-body"><h3>${esc(pet?.name||p.name)}</h3><p>${esc(p.note)}</p>${pet?`<button data-pet-visit="${pet.uid}">Besuchen & spielen</button><button data-pet-bring="${pet.uid}">Ins Zimmer holen</button>`:`<button data-action="buy" data-id="${p.id}">Für ${p.price} Sterne einziehen lassen</button><button data-action="learn">Sterne sammeln</button>`}</div></article>`}).join('');c.append(body);const note=document.createElement('p');note.className='note';note.textContent='Deine Tiere bleiben auf diesem Gerät gespeichert. Mit einem Besuch holst du sie aus der Tasche oder einem anderen Zimmer zu dir.';c.append(note);
}
 document.querySelector('#panel-content').addEventListener('click',e=>{const b=e.target.closest('button');if(b?.dataset.residentTab){residentTab=b.dataset.residentTab;render(document.querySelector('#panel-content'));return}if(b?.dataset.petVisit){J.visitPet(b.dataset.petVisit);return}if(b?.dataset.petBring){const id=b.dataset.petBring;J.visitPet(id);document.querySelector('#panel').close();return}if(b?.dataset.friendMode)open(b.dataset.friendMode);if(b?.dataset.personEdit)open(J.profile.playerUid===b.dataset.personEdit?'change':'edit',null,b.dataset.personEdit);if(b?.dataset.personShow)J.showPerson(b.dataset.personShow)});
window.LerndachsFriends={open,render};
window.LerndachsBundles={render(c){c.querySelector('.card-grid')?.remove();c.querySelectorAll('.note,.wide').forEach(e=>e.remove());const grid=document.createElement('div');grid.className='bundle-grid';grid.innerHTML=LerndachsBundleData.map(b=>{const counts={};b.items.forEach(id=>counts[id]=(counts[id]||0)+1);const value=b.items.reduce((sum,id)=>sum+J.catalogue.find(i=>i.id===id).price,0);return `<article class="bundle-card"><div class="bundle-art">${b.items.slice(0,3).map(id=>J.preview({id})).join('')}</div><h3>${b.name}</h3><p>${b.note}</p><strong>300 ✦ · Inhalt im Wert von ${value} ✦</strong><p>${Object.entries(counts).map(([id,n])=>`${n} × ${esc(WorldArt.names[id])}`).join(' · ')}</p><button class="journey-primary" data-bundle="${b.id}" ${Lernwelt.snapshot().balance<b.price?'disabled':''}>Paket für 300 Sterne öffnen</button><small>${b.items.length} Dinge · Du sparst 200 Sterne · Kommt in deine Tasche</small></article>`}).join('');c.append(grid);grid.onclick=e=>{const button=e.target.closest('[data-bundle]');if(!button)return;button.disabled=true;const b=LerndachsBundleData.find(b=>b.id===button.dataset.bundle),result=J.purchaseBundle(b);if(!result.ok){toast(result.message);button.disabled=false;return}grid.innerHTML=`<div class="empty"><strong>${b.name} ausgepackt!</strong>${b.items.length} Dinge warten in deiner Tasche.<button class="journey-primary" id="bundle-bag">Meine Tasche öffnen →</button></div>`;grid.querySelector('button').onclick=()=>showPanel('bag')}}};
})();

;
/* Original Lerndachs tasks, informed by the user-supplied curricula. See CURRICULUM.md. */
window.LerndachsCurriculum = Object.freeze({
  "version": 2,
  "sources": {
    "math": {
      "title": "Mathematik",
      "file": "rahmenlehrplan-teil-c_mathe-1-10 (1).pdf",
      "edition": "2023",
      "scope": "Schulanfangsphase, Niveaustufen A/B",
      "sections": "3.1 Zahlen und Operationen; 3.2 Größen und Messen; 3.3 Raum und Form; 3.4 Muster"
    },
    "german": {
      "title": "Deutsch",
      "file": "rlp-deutsch_1-10-teil-c (1).pdf",
      "edition": "2023",
      "scope": "Jahrgangsstufen 1/2, Niveaustufen A/B",
      "sections": "2.5 Richtig schreiben; 2.7 Lesefertigkeiten; 2.8 Textverständnis; 2.12 Sprachbewusstheit; 3.1 und Wissensbestände A/B"
    },
    "science": {
      "title": "Sachunterricht",
      "file": "Teil_C_Sachunterricht_2015_11_16.pdf",
      "edition": "2015",
      "scope": "Ausgewählte Themen aus Jahrgangsstufen 1–4, für 5–8 Jahre vereinfacht",
      "sections": "2.4 Handeln; 3.1 Erde; 3.2 Kind; 3.3 Markt; 3.5 Tier; 3.6 Wasser; 3.7 Wohnen; 3.8 Zeit"
    },
    "music": {
      "title": "Musik",
      "file": "Teil_C_Musik_2015_11_16.pdf",
      "edition": "2015",
      "scope": "Niveaustufen A/B, Grundlagen Jahrgangsstufen 1–4",
      "sections": "2.1 Wahrnehmen und deuten; 2.2 Gestalten und aufführen; 3.1 Grundlagen der Musik"
    },
    "art": {
      "title": "Kunst",
      "file": "Teil_C_Kunst_2015_11_10.pdf",
      "edition": "2015",
      "scope": "Niveaustufen A/B und Doppeljahrgangsstufe 1/2",
      "sections": "2.1 Wahrnehmen; 2.2 Gestalten; 3.1 Material, Malen, Bauen und Collagieren"
    }
  },
  "paths": [
    {
      "id": "numbers",
      "title": "Zahlenzauber",
      "subject": "math",
      "tag": "ZÄHLEN & RECHNEN",
      "color": "yellow",
      "icon": "123",
      "desc": "Zahlen und Formen in deinem Zuhause.",
      "items": [
        [
          "fruit",
          "Die Obstschale wartet!",
          "Du hast 2 Äpfel und bekommst 3 dazu. Wie viele sind es?",
          [
            "4",
            "5",
            "6"
          ],
          1,
          "2 + 3 = 5. Zusammen sind es fünf Äpfel.",
          "🍎 🍎 + 🍎 🍎 🍎",
          {
            "id": "numbers0",
            "level": "start",
            "skill": "Mengen zusammenfügen",
            "source": "math",
            "pages": [
              38,
              39
            ],
            "hint": "Zähle erst zwei, dann noch drei weiter."
          }
        ],
        [
          "tea",
          "Zeit für eine Teepause.",
          "Milo und Lumi bekommen je eine Tasse. Wie viele brauchst du?",
          [
            "1",
            "2",
            "3"
          ],
          1,
          "Eine für Milo und eine für Lumi: zwei Tassen.",
          "☕ + ☕",
          {
            "id": "numbers1",
            "level": "start",
            "skill": "Eins-zu-eins-Zuordnung",
            "source": "math",
            "pages": [
              38
            ],
            "hint": "Stelle dir vor: Jede Figur bekommt genau eine Tasse."
          }
        ],
        [
          "toaster",
          "Der Toaster duftet.",
          "4 Toastscheiben sind fertig. Du isst eine. Wie viele bleiben?",
          [
            "2",
            "3",
            "5"
          ],
          1,
          "4 − 1 = 3. Drei Toastscheiben bleiben.",
          "4 − 1 = ?",
          {
            "id": "numbers2",
            "level": "start",
            "skill": "Mengen verringern",
            "source": "math",
            "pages": [
              39
            ],
            "hint": "Lege vier Finger hin und klappe einen weg."
          }
        ],
        [
          "clock",
          "Eine Form an der Wand.",
          "Die Vorderseite der Uhr ist rund. Welche Form ist das?",
          [
            "Dreieck",
            "Kreis",
            "Quadrat"
          ],
          1,
          "Ein Kreis ist rund und hat keine Ecken.",
          "○",
          {
            "id": "math-circle",
            "level": "start",
            "skill": "Grundformen erkennen",
            "source": "math",
            "pages": [
              50
            ],
            "hint": "Fahre den Rand mit dem Finger in der Luft nach."
          }
        ],
        [
          "cake",
          "Teilen macht Freude.",
          "6 Kuchenstücke werden gerecht auf 2 Teller verteilt. Wie viele liegen auf jedem Teller?",
          [
            "2",
            "4",
            "3"
          ],
          2,
          "Lege immer abwechselnd ein Stück auf jeden Teller. Dann liegen auf jedem drei.",
          "● ● ● ● ● ●\n→ 2 Teller",
          {
            "id": "math-share-six",
            "level": "start",
            "skill": "Gleiche Mengen herstellen",
            "source": "math",
            "pages": [
              38,
              39,
              56
            ],
            "hint": "Verteile abwechselnd: ein Stück hier, ein Stück dort."
          }
        ],
        [
          "stool",
          "Hocker für die Freunde.",
          "2 Hocker haben je 4 Beine. Wie viele Beine sind es zusammen?",
          [
            "6",
            "8",
            "10"
          ],
          1,
          "4 + 4 = 8. Zusammen sind es acht Beine.",
          "4 + 4 = ?",
          {
            "id": "numbers5",
            "level": "start",
            "skill": "Verdoppeln mit Material",
            "source": "math",
            "pages": [
              39
            ],
            "hint": "Zähle vier Beine und dann noch einmal vier."
          }
        ],
        [
          "fruit",
          "Ein voller Obstkorb.",
          "Im Korb sind 10 Äpfel. 7 kommen dazu. Wie viele sind es jetzt?",
          [
            "16",
            "17",
            "18"
          ],
          1,
          "10 + 7 = 17. Ein Zehner und sieben Einer ergeben siebzehn.",
          "10 + 7 = ?",
          {
            "id": "numbers6",
            "level": "weiter",
            "skill": "Zehner und Einer verknüpfen",
            "source": "math",
            "pages": [
              38,
              39
            ],
            "hint": "Starte bei zehn und zähle sieben weiter."
          }
        ],
        [
          "jar",
          "Kekse für alle.",
          "15 Kekse sind in der Dose. 6 werden verteilt. Wie viele bleiben?",
          [
            "9",
            "8",
            "11"
          ],
          0,
          "15 − 5 = 10 und noch einen weg: 9.",
          "15 − 6 = ?",
          {
            "id": "numbers7",
            "level": "weiter",
            "skill": "Subtrahieren über den Zehner",
            "source": "math",
            "pages": [
              39
            ],
            "hint": "Nimm zuerst fünf weg. Dann fehlt noch ein Keks."
          }
        ],
        [
          "books",
          "Die Lücke im Regal.",
          "4 Bücher stehen im Regal. Wie viele fehlen noch bis 10?",
          [
            "5",
            "7",
            "6"
          ],
          2,
          "4 + 6 = 10. Es fehlen sechs Bücher.",
          "4 + □ = 10",
          {
            "id": "numbers8",
            "level": "weiter",
            "skill": "Ergänzen bis zehn",
            "source": "math",
            "pages": [
              38,
              56
            ],
            "hint": "Zähle von vier weiter, bis du bei zehn bist."
          }
        ],
        [
          "basket",
          "Ein kleiner Einkauf.",
          "Ein Apfel kostet 2 Euro, ein Brot 3 Euro. Was kostet beides zusammen?",
          [
            "6 Euro",
            "5 Euro",
            "1 Euro"
          ],
          1,
          "2 Euro + 3 Euro = 5 Euro.",
          "2 € + 3 €",
          {
            "id": "numbers9",
            "level": "weiter",
            "skill": "Mit Geldbeträgen rechnen",
            "source": "math",
            "pages": [
              29,
              44
            ],
            "hint": "Beide Preise werden zusammengezählt."
          }
        ],
        [
          "clock",
          "Eine Stunde Spielzeit.",
          "Wie viele Minuten hat eine Stunde?",
          [
            "30",
            "100",
            "60"
          ],
          2,
          "60 Minuten ergeben eine Stunde.",
          "1 Stunde = ?",
          {
            "id": "numbers3",
            "level": "weiter",
            "skill": "Zeiteinheiten zuordnen",
            "source": "math",
            "pages": [
              44
            ],
            "hint": "Eine halbe Stunde hat 30 Minuten. Nimm sie zweimal."
          }
        ],
        [
          "garland",
          "Ein Zahlenmuster leuchtet.",
          "Die Lichter tragen die Zahlen 2, 4, 6. Welche Zahl kommt als Nächstes?",
          [
            "8",
            "7",
            "10"
          ],
          0,
          "Die Zahlen werden immer um zwei größer: 2, 4, 6, 8.",
          "2 · 4 · 6 · ?",
          {
            "id": "numbers11",
            "level": "weiter",
            "skill": "Zahlenmuster fortsetzen",
            "source": "math",
            "pages": [
              33,
              57
            ],
            "hint": "Vergleiche zwei Nachbarzahlen. Wie groß ist der Schritt?"
          }
        ]
      ]
    },
    {
      "id": "words",
      "title": "Wörterwald",
      "subject": "german",
      "tag": "LESEN & ENTDECKEN",
      "color": "purple",
      "icon": "Aa",
      "desc": "Buchstaben werden zu Geschichten.",
      "items": [
        [
          "cat",
          "Krümel hat ein Rätsel.",
          "Mit welchem Buchstaben beginnt KATZE?",
          [
            "K",
            "M",
            "T"
          ],
          0,
          "K wie Katze! Sprich das Wort langsam: K-a-t-z-e.",
          "KATZE",
          {
            "id": "words0",
            "level": "start",
            "skill": "Anfangsbuchstaben zuordnen",
            "source": "german",
            "pages": [
              21,
              26
            ],
            "hint": "Sprich den Anfang von Katze ganz langsam."
          }
        ],
        [
          "sun",
          "Ein warmer Buchstabengruß.",
          "Welches Wort passt zur Sonne?",
          [
            "kalt",
            "warm",
            "nass"
          ],
          1,
          "Die Sonne gibt uns Licht und Wärme.",
          "☀",
          {
            "id": "words1",
            "level": "start",
            "skill": "Wörter und Bedeutung verbinden",
            "source": "german",
            "pages": [
              26,
              27
            ],
            "hint": "Denke daran, wie sich Sonnenstrahlen auf deiner Haut anfühlen."
          }
        ],
        [
          "books",
          "Die Bücher flüstern.",
          "Was reimt sich auf HAUS?",
          [
            "Baum",
            "Maus",
            "Buch"
          ],
          1,
          "Haus und Maus klingen am Ende gleich.",
          "HAUS → ?",
          {
            "id": "words2",
            "level": "start",
            "skill": "Reimwörter erkennen",
            "source": "german",
            "pages": [
              26,
              43
            ],
            "hint": "Sprich Haus und dann jedes Antwortwort laut."
          }
        ],
        [
          "balloon",
          "Ein Wort hebt ab.",
          "Wie viele Silben hat „Bal-lon“?",
          [
            "1",
            "2",
            "3"
          ],
          1,
          "Klatsche mit: Bal – lon. Das sind zwei Silben.",
          "BAL · LON",
          {
            "id": "words3",
            "level": "start",
            "skill": "Wörter in Silben gliedern",
            "source": "german",
            "pages": [
              26,
              43
            ],
            "hint": "Klatsche bei jedem gesprochenen Wortteil einmal."
          }
        ],
        [
          "plant",
          "Ein grünes Wort.",
          "Ergänze den fehlenden Buchstaben: B _ U M",
          [
            "A",
            "E",
            "I"
          ],
          0,
          "B-A-U-M. Zusammen wird daraus BAUM.",
          "B _ U M",
          {
            "id": "words4",
            "level": "start",
            "skill": "Ein bekanntes Wort ergänzen",
            "source": "german",
            "pages": [
              21,
              26
            ],
            "hint": "Sprich Baum langsam. Welcher Buchstabe fehlt nach dem B?"
          }
        ],
        [
          "guitar",
          "Musik für deine Ohren.",
          "Welches Wort gehört zur Gitarre?",
          [
            "backen",
            "schwimmen",
            "Musik"
          ],
          2,
          "Eine Gitarre ist ein Musikinstrument.",
          "♪ ♫ ♪",
          {
            "id": "words5",
            "level": "start",
            "skill": "Wörter nach Bedeutung zuordnen",
            "source": "german",
            "pages": [
              26,
              27
            ],
            "hint": "Was machen die Saiten, wenn du sie zupfst?"
          }
        ],
        [
          "cat",
          "Krümels kleine Geschichte.",
          "Lies: „Die Katze schläft auf dem Sofa.“ Wo schläft die Katze?",
          [
            "Im Bett",
            "Auf dem Sofa",
            "Im Garten"
          ],
          1,
          "Im Satz steht „auf dem Sofa“. Dort schläft die Katze.",
          "Die Katze schläft\nauf dem Sofa.",
          {
            "id": "words6",
            "level": "weiter",
            "skill": "Informationen aus einem Satz entnehmen",
            "source": "german",
            "pages": [
              27,
              38
            ],
            "hint": "Suche im Satz die Wörter nach „schläft“."
          }
        ],
        [
          "books",
          "Ein Buch bleibt selten allein.",
          "Ein Buch, zwei …?",
          [
            "Buchen",
            "Buche",
            "Bücher"
          ],
          2,
          "Die Mehrzahl von Buch ist Bücher.",
          "1 Buch → 2 ?",
          {
            "id": "words7",
            "level": "weiter",
            "skill": "Einzahl und Mehrzahl unterscheiden",
            "source": "german",
            "pages": [
              33
            ],
            "hint": "Sprich: Im Regal stehen viele …"
          }
        ],
        [
          "tea",
          "Zwei Wörter werden eins.",
          "Aus „Tee“ und „Tasse“ wird welches Wort?",
          [
            "Teetasse",
            "Teehaus",
            "Kaffeetasse"
          ],
          0,
          "Tee + Tasse = Teetasse. Zwei Wörter bilden ein neues Wort.",
          "TEE + TASSE",
          {
            "id": "words8",
            "level": "weiter",
            "skill": "Zusammengesetzte Wörter bilden",
            "source": "german",
            "pages": [
              33
            ],
            "hint": "Setze die beiden Wörter direkt hintereinander."
          }
        ],
        [
          "cat",
          "Eine Frage an Krümel.",
          "Welches Zeichen gehört ans Ende: „Wo ist die Katze“?",
          [
            ".",
            "!",
            "?"
          ],
          2,
          "„Wo ist die Katze?“ ist eine Frage und endet mit einem Fragezeichen.",
          "Wo ist die Katze _",
          {
            "id": "words9",
            "level": "weiter",
            "skill": "Satzschlusszeichen zuordnen",
            "source": "german",
            "pages": [
              21,
              43
            ],
            "hint": "Der Satz möchte etwas wissen."
          }
        ],
        [
          "watering",
          "Ein Wort für eine Tätigkeit.",
          "Welches Wort sagt, was jemand tut?",
          [
            "grün",
            "gießen",
            "Gießkanne"
          ],
          1,
          "Gießen ist eine Tätigkeit. Ein solches Wort nennt man Verb.",
          "Was tut Lumi?",
          {
            "id": "words10",
            "level": "weiter",
            "skill": "Tätigkeitswörter erkennen",
            "source": "german",
            "pages": [
              33
            ],
            "hint": "Du kannst sagen: Ich … die Pflanze."
          }
        ],
        [
          "cushion",
          "Ein Kissen wird beschrieben.",
          "Welches Wort beschreibt, wie ein Kissen sein kann?",
          [
            "weich",
            "Kissen",
            "sitzen"
          ],
          0,
          "Weich beschreibt eine Eigenschaft. Solche Wörter heißen Adjektive.",
          "Wie ist das Kissen?",
          {
            "id": "words11",
            "level": "weiter",
            "skill": "Eigenschaftswörter erkennen",
            "source": "german",
            "pages": [
              33
            ],
            "hint": "Denke daran, wie sich ein Kissen anfühlt."
          }
        ]
      ]
    },
    {
      "id": "nature",
      "title": "Wunderforscher",
      "subject": "science",
      "tag": "NATUR & ALLTAG",
      "color": "teal",
      "icon": "✿",
      "desc": "Wasser, Tiere und dein Zusammenleben.",
      "items": [
        [
          "plant",
          "Deine Pflanze braucht dich.",
          "Welches Paar hilft einer Pflanze beim Wachsen?",
          [
            "Wasser & Licht",
            "Limonade & Dunkelheit",
            "Salz & Eis"
          ],
          0,
          "Pflanzen brauchen unter anderem Wasser und Licht zum Wachsen.",
          "☀ + 💧 → 🌱",
          {
            "id": "nature0",
            "level": "start",
            "skill": "Lebensbedingungen von Pflanzen entdecken",
            "source": "science",
            "pages": [
              28,
              38
            ],
            "hint": "Überlege, wo eine Pflanze gut wächst: hell oder dunkel?"
          }
        ],
        [
          "cloud",
          "Schau mal nach draußen.",
          "Was kann aus einer Regenwolke fallen?",
          [
            "Watte",
            "Regentropfen",
            "Sand"
          ],
          1,
          "Bei Regen fallen Wassertropfen aus der Wolke.",
          "☁ → ?",
          {
            "id": "science-rain",
            "level": "start",
            "skill": "Wetter beobachten",
            "source": "science",
            "pages": [
              28,
              38
            ],
            "hint": "Womit werden deine Schuhe bei Regen nass?"
          }
        ],
        [
          "fishbowl",
          "Ein kleiner Wasserfreund.",
          "Wo lebt ein Fisch?",
          [
            "Im Wasser",
            "Auf einem Baum",
            "In einer trockenen Schublade"
          ],
          0,
          "Fische leben im Wasser. Ihr Lebensraum muss zu ihnen passen.",
          "><(((°>",
          {
            "id": "science-fish-home",
            "level": "start",
            "skill": "Tieren Lebensräume zuordnen",
            "source": "science",
            "pages": [
              36
            ],
            "hint": "Denke an einen Teich oder einen Fluss."
          }
        ],
        [
          "fridge",
          "Frisch bleibt frisch.",
          "Warum stellen wir frische Milch in den Kühlschrank?",
          [
            "Für die Farbe",
            "Damit sie singt",
            "Damit sie länger frisch bleibt"
          ],
          2,
          "Im Kühlschrank hält sich frische Milch länger.",
          "❄",
          {
            "id": "nature3",
            "level": "start",
            "skill": "Lebensmittel im Alltag aufbewahren",
            "source": "science",
            "pages": [
              32
            ],
            "hint": "Was ist im Kühlschrank anders als im warmen Zimmer?"
          }
        ],
        [
          "counter",
          "Wasser ist wertvoll.",
          "Was machst du beim Zähneputzen mit dem Wasserhahn?",
          [
            "Zudrehen",
            "Laufen lassen",
            "Ganz aufdrehen"
          ],
          0,
          "Wenn du den Hahn während des Putzens zudrehst, sparst du Wasser.",
          "💧",
          {
            "id": "nature4",
            "level": "start",
            "skill": "Mit Wasser sorgsam umgehen",
            "source": "science",
            "pages": [
              19,
              38
            ],
            "hint": "Muss das Wasser laufen, während du mit der Bürste putzt?"
          }
        ],
        [
          "sun",
          "Der Tag geht schlafen.",
          "Was folgt im täglichen Wechsel auf den Tag?",
          [
            "Winter",
            "Nacht",
            "Sommer"
          ],
          1,
          "Tag und Nacht wechseln sich regelmäßig ab.",
          "☀ → ?",
          {
            "id": "science-day-after",
            "level": "start",
            "skill": "Zeitliche Abläufe erkennen",
            "source": "science",
            "pages": [
              42
            ],
            "hint": "Nach dem Abend wird es draußen dunkel."
          }
        ],
        [
          "kettle",
          "Wasser verwandelt sich.",
          "Wie heißt Wasser, wenn es gefroren ist?",
          [
            "Dampf",
            "Eis",
            "Sand"
          ],
          1,
          "Gefrorenes Wasser ist fest und heißt Eis.",
          "💧 + Kälte → ?",
          {
            "id": "nature6",
            "level": "weiter",
            "skill": "Zustände von Wasser unterscheiden",
            "source": "science",
            "pages": [
              38
            ],
            "hint": "Denke an einen Eiswürfel."
          }
        ],
        [
          "radio",
          "Mit offenen Ohren.",
          "Mit welchem Sinn nimmst du die Musik aus dem Radio wahr?",
          [
            "Schmecken",
            "Riechen",
            "Hören"
          ],
          2,
          "Mit dem Hörsinn nimmst du Klänge und Geräusche wahr.",
          "♫ → ?",
          {
            "id": "nature7",
            "level": "weiter",
            "skill": "Sinne und Wahrnehmungen zuordnen",
            "source": "science",
            "pages": [
              30
            ],
            "hint": "Welchen Körperteil brauchst du zum Zuhören?"
          }
        ],
        [
          "books",
          "Papier bekommt ein zweites Leben.",
          "Wohin gehört ein sauberes, altes Blatt Papier beim Mülltrennen?",
          [
            "Altpapier",
            "Biomüll",
            "Glascontainer"
          ],
          0,
          "Sauberes Papier kann im Altpapier gesammelt und wiederverwertet werden.",
          "Altes Papier → ?",
          {
            "id": "nature8",
            "level": "weiter",
            "skill": "Materialien und Ressourcen sorgsam nutzen",
            "source": "science",
            "pages": [
              19,
              32
            ],
            "hint": "Überlege, aus welchem Material das Blatt besteht."
          }
        ],
        [
          "sofa",
          "Ein Platz für beide.",
          "Milo und Lumi wollen denselben Platz. Was hilft ihnen?",
          [
            "Sich anschreien",
            "Ruhig absprechen und abwechseln",
            "Den anderen wegschubsen"
          ],
          1,
          "Sie können miteinander sprechen und eine faire Lösung finden.",
          "Milo + Lumi → ?",
          {
            "id": "nature9",
            "level": "weiter",
            "skill": "Konflikte gemeinsam lösen",
            "source": "science",
            "pages": [
              19,
              40
            ],
            "hint": "Welche Lösung hört die Wünsche von beiden an?"
          }
        ],
        [
          "tree",
          "Der Baum verändert sich.",
          "In welcher Jahreszeit werden bei vielen heimischen Laubbäumen die Blätter bunt?",
          [
            "Frühling",
            "Sommer",
            "Herbst"
          ],
          2,
          "Im Herbst verfärben sich bei vielen Laubbäumen die Blätter und fallen ab.",
          "🍃 → 🍂",
          {
            "id": "nature10",
            "level": "weiter",
            "skill": "Jahreszeitliche Veränderungen beobachten",
            "source": "science",
            "pages": [
              28,
              42
            ],
            "hint": "Welche Jahreszeit liegt zwischen Sommer und Winter?"
          }
        ],
        [
          "sun",
          "Ein Blick auf unsere Erde.",
          "Warum wechseln sich Tag und Nacht ab?",
          [
            "Die Erde dreht sich",
            "Die Sonne geht schlafen",
            "Der Mond schaltet das Licht aus"
          ],
          0,
          "Die Erde dreht sich. Die Seite, die zur Sonne zeigt, hat Tag.",
          "☀ → 🌍",
          {
            "id": "nature5",
            "level": "weiter",
            "skill": "Tag und Nacht mit einem Modell erklären",
            "source": "science",
            "pages": [
              28,
              42
            ],
            "hint": "Stelle dir eine Lampe und einen Ball vor, den du langsam drehst."
          }
        ]
      ]
    },
    {
      "id": "music",
      "title": "Klangwerkstatt",
      "subject": "music",
      "tag": "HÖREN & MUSIK",
      "color": "coral",
      "icon": "♫",
      "desc": "Ohren auf: Töne und Rhythmen spielen.",
      "items": [
        [
          "guitar",
          "Zwei Töne hüpfen.",
          "Höre die zwei Töne. Welcher ist höher?",
          [
            "Der erste",
            "Der zweite",
            "Beide gleich hoch"
          ],
          1,
          "Der zweite Ton klingt höher als der erste.",
          "♫ → ♫",
          {
            "id": "music0",
            "level": "start",
            "skill": "Tonhöhen unterscheiden",
            "source": "music",
            "pages": [
              15
            ],
            "hint": "Höre noch einmal und summ die beiden Töne mit.",
            "audio": {
              "notes": [
                [
                  262,
                  0.35,
                  0.13,
                  0
                ],
                [
                  524,
                  0.35,
                  0.13,
                  0.7
                ]
              ]
            }
          }
        ],
        [
          "radio",
          "Leise oder laut?",
          "Höre die zwei Klänge. Welcher ist leiser?",
          [
            "Der erste",
            "Der zweite",
            "Beide gleich laut"
          ],
          0,
          "Der erste Klang ist leiser. Die Tonhöhe bleibt dabei gleich.",
          "♪ · ♪",
          {
            "id": "music1",
            "level": "start",
            "skill": "Lautstärken unterscheiden",
            "source": "music",
            "pages": [
              15
            ],
            "hint": "Achte auf die Stärke des Klangs, nicht auf seine Höhe.",
            "audio": {
              "notes": [
                [
                  440,
                  0.3,
                  0.035,
                  0
                ],
                [
                  440,
                  0.3,
                  0.16,
                  0.7
                ]
              ]
            }
          }
        ],
        [
          "table",
          "Klopf, klopf!",
          "Wie viele Klopfklänge hörst du?",
          [
            "1",
            "2",
            "3"
          ],
          1,
          "Du hörst zwei Klopfklänge. Du kannst bei jedem einen Finger heben.",
          "● … ●",
          {
            "id": "music2",
            "level": "start",
            "skill": "Klangereignisse zählen",
            "source": "music",
            "pages": [
              15,
              22
            ],
            "hint": "Hebe bei jedem gehörten Klopfen einen Finger.",
            "audio": {
              "notes": [
                [
                  180,
                  0.09,
                  0.18,
                  0
                ],
                [
                  180,
                  0.09,
                  0.18,
                  0.6
                ]
              ]
            }
          }
        ],
        [
          "clock",
          "Ein Takt zum Mitgehen.",
          "Höre zwei Gruppen mit je drei Tönen. Welche Gruppe ist schneller?",
          [
            "Die erste",
            "Beide gleich schnell",
            "Die zweite"
          ],
          2,
          "In der zweiten Gruppe liegen die Töne dichter beieinander. Das Tempo ist schneller.",
          "♫     ♫",
          {
            "id": "music3",
            "level": "start",
            "skill": "Tempi vergleichen",
            "source": "music",
            "pages": [
              15,
              22
            ],
            "hint": "Vergleiche die Pausen zwischen den Tönen.",
            "audio": {
              "notes": [
                [
                  330,
                  0.12,
                  0.12,
                  0
                ],
                [
                  330,
                  0.12,
                  0.12,
                  0.55
                ],
                [
                  330,
                  0.12,
                  0.12,
                  1.1
                ],
                [
                  440,
                  0.12,
                  0.12,
                  2
                ],
                [
                  440,
                  0.12,
                  0.12,
                  2.22
                ],
                [
                  440,
                  0.12,
                  0.12,
                  2.44
                ]
              ]
            }
          }
        ],
        [
          "guitar",
          "So klingt die Gitarre.",
          "Was bringst du bei einer Gitarre zum Klingen?",
          [
            "Saiten",
            "Tasten",
            "Wasser"
          ],
          0,
          "Beim Zupfen schwingen die Saiten der Gitarre und erzeugen Töne.",
          "♪ GITARRE",
          {
            "id": "music4",
            "level": "start",
            "skill": "Klangerzeugung erkennen",
            "source": "music",
            "pages": [
              16,
              22
            ],
            "hint": "Denke an die dünnen gespannten Fäden auf der Gitarre."
          }
        ],
        [
          "milo",
          "Dein Körper macht Musik.",
          "Wie kannst du ohne Instrument einen Rhythmus machen?",
          [
            "Nur schauen",
            "In die Hände klatschen",
            "Ein Bild ansehen"
          ],
          1,
          "Mit Klatschen, Stampfen oder Schnipsen kann dein Körper Rhythmen spielen.",
          "👏 · 👏",
          {
            "id": "music5",
            "level": "start",
            "skill": "Körper als Klangerzeuger kennen",
            "source": "music",
            "pages": [
              16,
              22
            ],
            "hint": "Welche Bewegung macht selbst ein Geräusch?"
          }
        ],
        [
          "guitar",
          "Eine kleine Tonleiter.",
          "Höre die drei Töne. Wie verändert sich die Tonhöhe?",
          [
            "Sie bleibt gleich",
            "Sie wird tiefer",
            "Sie wird höher"
          ],
          1,
          "Jeder Ton klingt etwas tiefer als der vorherige.",
          "♫ ♫ ♫",
          {
            "id": "music6",
            "level": "weiter",
            "skill": "Tonfolgen vergleichen",
            "source": "music",
            "pages": [
              15,
              22
            ],
            "hint": "Summ den ersten Ton und folge dann der Tonfolge.",
            "audio": {
              "notes": [
                [
                  660,
                  0.35,
                  0.13,
                  0
                ],
                [
                  524,
                  0.35,
                  0.13,
                  0.6
                ],
                [
                  392,
                  0.35,
                  0.13,
                  1.2
                ]
              ]
            }
          }
        ],
        [
          "table",
          "Ein längerer Klopfrhythmus.",
          "Wie viele Klopfklänge hörst du diesmal?",
          [
            "3",
            "5",
            "4"
          ],
          2,
          "In dieser Hörprobe sind es vier einzelne Klopfklänge.",
          "● ● ● ●",
          {
            "id": "music7",
            "level": "weiter",
            "skill": "Rhythmen aufmerksam verfolgen",
            "source": "music",
            "pages": [
              15,
              22
            ],
            "hint": "Zähle mit den Fingern bei jedem Klang weiter.",
            "audio": {
              "notes": [
                [
                  180,
                  0.09,
                  0.18,
                  0
                ],
                [
                  180,
                  0.09,
                  0.18,
                  0.3
                ],
                [
                  180,
                  0.09,
                  0.18,
                  0.9
                ],
                [
                  180,
                  0.09,
                  0.18,
                  1.2
                ]
              ]
            }
          }
        ],
        [
          "radio",
          "Die Melodie kommt wieder.",
          "Höre zwei Tonfolgen. Sind sie gleich oder verschieden?",
          [
            "Gleich",
            "Verschieden",
            "Es gibt nur einen Ton"
          ],
          0,
          "Beide Tonfolgen bestehen aus denselben drei Tönen in derselben Reihenfolge.",
          "♫ ♫ ♫ | ♫ ♫ ♫",
          {
            "id": "music8",
            "level": "weiter",
            "skill": "Wiederholungen erkennen",
            "source": "music",
            "pages": [
              15
            ],
            "hint": "Vergleiche die Reihenfolge der Töne in beiden Gruppen.",
            "audio": {
              "notes": [
                [
                  330,
                  0.2,
                  0.12,
                  0
                ],
                [
                  440,
                  0.2,
                  0.12,
                  0.3
                ],
                [
                  524,
                  0.2,
                  0.12,
                  0.6
                ],
                [
                  330,
                  0.2,
                  0.12,
                  1.4
                ],
                [
                  440,
                  0.2,
                  0.12,
                  1.7
                ],
                [
                  524,
                  0.2,
                  0.12,
                  2
                ]
              ]
            }
          }
        ],
        [
          "kettle",
          "Ein Ton hält an.",
          "Welcher der beiden Töne klingt länger?",
          [
            "Der erste",
            "Beide gleich lang",
            "Der zweite"
          ],
          2,
          "Der zweite Ton dauert länger. Beide haben dieselbe Tonhöhe.",
          "♪ — ♪",
          {
            "id": "music9",
            "level": "weiter",
            "skill": "Tondauern unterscheiden",
            "source": "music",
            "pages": [
              15,
              22
            ],
            "hint": "Achte darauf, wann jeder Ton wieder aufhört.",
            "audio": {
              "notes": [
                [
                  440,
                  0.18,
                  0.14,
                  0
                ],
                [
                  440,
                  0.8,
                  0.14,
                  0.7
                ]
              ]
            }
          }
        ],
        [
          "clock",
          "Platz für eine Pause.",
          "Was bedeutet eine Pause beim Musizieren?",
          [
            "Immer lauter spielen",
            "Für eine Zeit nicht spielen",
            "So schnell wie möglich spielen"
          ],
          1,
          "In einer Pause setzt der Klang aus. Auch Stille gehört zur Musik.",
          "♫ … ♫",
          {
            "id": "music10",
            "level": "weiter",
            "skill": "Stille als musikalisches Element erkennen",
            "source": "music",
            "pages": [
              15,
              22
            ],
            "hint": "Denke an den stillen Moment zwischen zwei Klängen."
          }
        ],
        [
          "guitar",
          "Erfinde deinen Rhythmus.",
          "Du willst „lang – kurz – kurz“ klatschen. Welche Folge passt?",
          [
            "— · ·",
            "· — ·",
            "· · —"
          ],
          0,
          "Ein langer Klang und zwei kurze Klänge passen zu „lang – kurz – kurz“. Probiere es aus!",
          "lang · kurz · kurz",
          {
            "id": "music11",
            "level": "weiter",
            "skill": "Einen Rhythmus mit Zeichen verbinden",
            "source": "music",
            "pages": [
              16,
              22
            ],
            "hint": "Beginne mit dem langen Zeichen und füge zwei kurze an."
          }
        ]
      ]
    },
    {
      "id": "art",
      "title": "Farbenatelier",
      "subject": "art",
      "tag": "FARBEN & GESTALTEN",
      "color": "sky",
      "icon": "✎",
      "desc": "Farben mischen, Materialien entdecken.",
      "items": [
        [
          "picture",
          "Eine Farbe im Bild.",
          "Welche Farbe zeigt der blaue Kreis?",
          [
            "Rot",
            "Blau",
            "Gelb"
          ],
          1,
          "Der Kreis ist blau. Schau dich um: Wo findest du Blau in deiner Welt?",
          "🔵",
          {
            "id": "art0",
            "level": "start",
            "skill": "Farben wahrnehmen und benennen",
            "source": "art",
            "pages": [
              13,
              20
            ],
            "hint": "Vergleiche die Farbe des Kreises mit dem Himmel."
          }
        ],
        [
          "flower",
          "Eine neue Farbe entsteht.",
          "Du mischst rote und gelbe Wasserfarbe. Welche Farbe entsteht meistens?",
          [
            "Grün",
            "Orange",
            "Blau"
          ],
          1,
          "Aus roter und gelber Wasserfarbe kannst du Orange mischen.",
          "🔴 + 🟡",
          {
            "id": "art1",
            "level": "start",
            "skill": "Farbmischungen erkunden",
            "source": "art",
            "pages": [
              20
            ],
            "hint": "Denke an die Farbe einer reifen Orange."
          }
        ],
        [
          "books",
          "Fühle das Material.",
          "Aus welchem Material bestehen die Seiten eines gewöhnlichen Buches?",
          [
            "Holzklötzen",
            "Glas",
            "Papier"
          ],
          2,
          "Buchseiten bestehen meist aus Papier. Papier lässt sich falten und bemalen.",
          "BUCH → ?",
          {
            "id": "art2",
            "level": "start",
            "skill": "Materialien unterscheiden",
            "source": "art",
            "pages": [
              13,
              14,
              20
            ],
            "hint": "Welches Material lässt sich gut zu einer Seite umblättern?"
          }
        ],
        [
          "easel",
          "Spuren auf dem Blatt.",
          "Mit welchem Werkzeug kannst du gut eine Linie zeichnen?",
          [
            "Bleistift",
            "Teetasse",
            "Kissen"
          ],
          0,
          "Mit einem Bleistift kannst du Linien und Formen zeichnen.",
          "✎ → 〰",
          {
            "id": "art3",
            "level": "start",
            "skill": "Werkzeuge passend auswählen",
            "source": "art",
            "pages": [
              13,
              20
            ],
            "hint": "Welches Werkzeug hinterlässt beim Ziehen eine schmale Spur?"
          }
        ],
        [
          "poster",
          "Eine Form im Bild.",
          "Wie viele Ecken hat ein Dreieck?",
          [
            "4",
            "3",
            "0"
          ],
          1,
          "Ein Dreieck hat drei Ecken. Fahre sie mit dem Finger in der Luft nach.",
          "△",
          {
            "id": "art4",
            "level": "start",
            "skill": "Formen bewusst wahrnehmen",
            "source": "art",
            "pages": [
              13,
              20
            ],
            "hint": "Zähle die Stellen, an denen sich zwei Seiten treffen."
          }
        ],
        [
          "basket",
          "Deine kleine Sammlung.",
          "Du möchtest alle Blätter nach ihrer Farbe ordnen. Welche Gruppe passt zusammen?",
          [
            "Rot, blau, gelb",
            "Nur grüne Blätter",
            "Blatt, Stein, Tasse"
          ],
          1,
          "Nur grüne Blätter gehören zur gleichen Farbgruppe. Danach kannst du ein Bild daraus legen.",
          "🍃 🍃 🍃",
          {
            "id": "art5",
            "level": "start",
            "skill": "Sammeln und nach Merkmalen ordnen",
            "source": "art",
            "pages": [
              14,
              20
            ],
            "hint": "Gesucht ist eine gemeinsame Farbe."
          }
        ],
        [
          "flower",
          "Eine grüne Mischung.",
          "Du mischst blaue und gelbe Wasserfarbe. Welche Farbe entsteht meistens?",
          [
            "Violett",
            "Orange",
            "Grün"
          ],
          2,
          "Blau und Gelb lassen sich zu Grün mischen. Probiere verschiedene Mengen aus.",
          "🔵 + 🟡",
          {
            "id": "art6",
            "level": "weiter",
            "skill": "Farben mischen und vergleichen",
            "source": "art",
            "pages": [
              20
            ],
            "hint": "Denke an das Grün der Pflanzen in deiner Welt."
          }
        ],
        [
          "picture",
          "Noch eine neue Farbe.",
          "Du mischst rote und blaue Wasserfarbe. Welche Farbe entsteht meistens?",
          [
            "Violett",
            "Grün",
            "Gelb"
          ],
          0,
          "Rot und Blau lassen sich zu Violett mischen.",
          "🔴 + 🔵",
          {
            "id": "art7",
            "level": "weiter",
            "skill": "Farbmischungen erproben",
            "source": "art",
            "pages": [
              20
            ],
            "hint": "Die Farbe liegt zwischen Rot und Blau."
          }
        ],
        [
          "poster",
          "Ein Bild aus vielen Teilen.",
          "Du klebst Papierstücke, Blätter und Bilder auf ein Blatt. Wie heißt so ein Bild?",
          [
            "Melodie",
            "Collage",
            "Kühlschrank"
          ],
          1,
          "Eine Collage entsteht, wenn du verschiedene Stücke zu einem neuen Bild zusammenfügst.",
          "✂ + Papier + 🍃",
          {
            "id": "art8",
            "level": "weiter",
            "skill": "Collagieren kennenlernen",
            "source": "art",
            "pages": [
              14,
              20
            ],
            "hint": "Die Stücke werden gesammelt, ausgesucht und zusammengeklebt."
          }
        ],
        [
          "camera",
          "Ein Blick auf dein Zuhause.",
          "Du möchtest dein eingerichtetes Zimmer als Bild festhalten. Was hilft dir?",
          [
            "Gießkanne",
            "Kissen",
            "Kamera"
          ],
          2,
          "Eine Kamera kann ein Foto aufnehmen. Du entscheidest, welcher Ausschnitt zu sehen ist.",
          "▣ → Bild",
          {
            "id": "art9",
            "level": "weiter",
            "skill": "Bilder und Bildausschnitte erkunden",
            "source": "art",
            "pages": [
              13,
              20
            ],
            "hint": "Welches Gerät nimmt ein Foto auf?"
          }
        ],
        [
          "lamp",
          "Ein Schattenspiel.",
          "Was brauchst du, damit ein Gegenstand einen deutlichen Schatten auf die Wand wirft?",
          [
            "Eine Lichtquelle",
            "Musik",
            "Einen weichen Teppich"
          ],
          0,
          "Wenn der Gegenstand Licht abschirmt, entsteht dahinter ein Schatten.",
          "☀ → Objekt → ▰",
          {
            "id": "art10",
            "level": "weiter",
            "skill": "Mit Licht und Schatten gestalten",
            "source": "art",
            "pages": [
              20
            ],
            "hint": "Denke an eine Lampe und deine Hand davor."
          }
        ],
        [
          "cabinet",
          "Bauen und erfinden.",
          "Du möchtest ein kleines Modellhaus bauen. Welche Materialien eignen sich dafür?",
          [
            "Nur Musik",
            "Karton und Kleber",
            "Nur Licht"
          ],
          1,
          "Aus Karton und Kleber kannst du ein Modellhaus bauen und selbst gestalten.",
          "▱ → ⌂",
          {
            "id": "art11",
            "level": "weiter",
            "skill": "Material für ein Vorhaben auswählen",
            "source": "art",
            "pages": [
              13,
              20
            ],
            "hint": "Welche Materialien kannst du schneiden, falten und verbinden?"
          }
        ]
      ]
    }
  ]
});

;
/* Grade selection and original tasks for primary classes. Age is not a diagnosis. */
(()=>{
const bank=LerndachsCurriculum;
bank.sources.math.scope='Auswahl aus Niveaustufen A bis C für Vorschule und Klasse 1–4';
bank.sources.german.scope='Auswahl aus den Inhalten für Jahrgangsstufen 1/2 und 3/4';
for(const p of bank.paths)for(const q of p.items){q[7].type='choice';q[7].grades=q[7].level==='start'?[0,1]:p.subject==='music'||p.subject==='art'?[2,3,4]:[2];if(q[7].id==='math-share-six'||q[7].id==='numbers5'||q[7].id==='words4')q[7].grades=[1]}
const additions=[
  {
    "path": "numbers",
    "task": [
      "fruit",
      "Eine große Obsternte.",
      "Im Garten sind 125 Äpfel und 75 Birnen geerntet. Wie viele Früchte sind es zusammen?",
      [
        "190",
        "200",
        "210"
      ],
      1,
      "125 + 75 = 200. Du kannst erst 125 + 25 = 150 und dann +50 rechnen.",
      "125 + 75",
      {
        "id": "g3-numbers-0",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Addieren im Zahlenraum bis 1000",
        "source": "math",
        "pages": [
          38,
          39
        ],
        "hint": "Ergänze zuerst bis zum nächsten vollen Fünfziger."
      }
    ]
  },
  {
    "path": "numbers",
    "task": [
      "jar",
      "Kekse für die Nachbarschaft.",
      "6 Tüten bekommen jeweils 7 Kekse. Wie viele Kekse brauchst du?",
      [
        "13",
        "36",
        "42"
      ],
      2,
      "6 · 7 = 42. Sechs gleich große Gruppen mit je sieben Keksen.",
      "6 · 7",
      {
        "id": "g3-numbers-1",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Multiplikation in Sachsituationen",
        "source": "math",
        "pages": [
          39
        ],
        "hint": "5 · 7 sind 35. Eine weitere Siebenergruppe kommt dazu."
      }
    ]
  },
  {
    "path": "numbers",
    "task": [
      "shelf",
      "Platz im Bücherregal.",
      "48 Bücher werden gleichmäßig auf 6 Regalbretter verteilt. Wie viele stehen auf jedem Brett?",
      [
        "8",
        "6",
        "9"
      ],
      0,
      "48 : 6 = 8, denn 6 · 8 = 48.",
      "48 : 6",
      {
        "id": "g3-numbers-2",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Division als Verteilen",
        "source": "math",
        "pages": [
          39
        ],
        "hint": "Welche Zahl ergibt mit sechs multipliziert 48?"
      }
    ]
  },
  {
    "path": "numbers",
    "task": [
      "table",
      "Ein Brett für den Tisch.",
      "Ein Brett ist 1 Meter lang. Wie viele Zentimeter sind das?",
      [
        "10 cm",
        "100 cm",
        "1000 cm"
      ],
      1,
      "1 Meter besteht aus 100 Zentimetern.",
      "1 m = ? cm",
      {
        "id": "g3-numbers-3",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Längeneinheiten umrechnen",
        "source": "math",
        "pages": [
          44
        ],
        "hint": "Auf einem Meterstab findest du hundert Zentimeter."
      }
    ]
  },
  {
    "path": "numbers",
    "task": [
      "clock",
      "Zeit für ein Hörspiel.",
      "Das Hörspiel beginnt um 14 Uhr und endet um 14:30 Uhr. Wie lange dauert es?",
      [
        "15 Minuten",
        "60 Minuten",
        "30 Minuten"
      ],
      2,
      "Von 14:00 bis 14:30 vergeht eine halbe Stunde: 30 Minuten.",
      "14:00 → 14:30",
      {
        "id": "g3-numbers-4",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Zeitspannen bestimmen",
        "source": "math",
        "pages": [
          44,
          45
        ],
        "hint": "Vergleiche die Minuten am Anfang und am Ende."
      }
    ]
  },
  {
    "path": "numbers",
    "task": [
      "rug",
      "Der rechteckige Teppich.",
      "Ein Rechteck ist 4 m lang und 2 m breit. Wie groß ist sein Umfang?",
      [
        "12 m",
        "8 m",
        "6 m"
      ],
      0,
      "Der Rand besteht aus 4 + 2 + 4 + 2 = 12 Metern.",
      "4 m × 2 m",
      {
        "id": "g3-numbers-5",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Umfang aus Seitenlängen bestimmen",
        "source": "math",
        "pages": [
          44
        ],
        "hint": "Zähle alle vier Seiten zusammen, nicht nur zwei."
      }
    ]
  },
  {
    "path": "numbers",
    "task": [
      "cabinet",
      "Große Zahlen im Lager.",
      "Für ein Möbelprojekt sind 1250 Bausteine da. 750 kommen hinzu. Wie viele sind es dann?",
      [
        "1900",
        "2000",
        "2100"
      ],
      1,
      "1250 + 750 = 2000. 250 + 750 ergeben einen weiteren Tausender.",
      "1250 + 750",
      {
        "id": "g4-numbers-0",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Stellenwerte und Addition nutzen",
        "source": "math",
        "pages": [
          38,
          39
        ],
        "hint": "Ergänze die 250 auf einen vollen Tausender."
      }
    ]
  },
  {
    "path": "numbers",
    "task": [
      "books",
      "Bücher für alle Klassen.",
      "8 Klassen bekommen je 24 Bücher. Wie viele Bücher sind das?",
      [
        "162",
        "184",
        "192"
      ],
      2,
      "8 · 24 = 8 · 20 + 8 · 4 = 160 + 32 = 192.",
      "8 · 24",
      {
        "id": "g4-numbers-1",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Multiplikation zerlegen",
        "source": "math",
        "pages": [
          39
        ],
        "hint": "Zerlege 24 in 20 und 4."
      }
    ]
  },
  {
    "path": "numbers",
    "task": [
      "jar",
      "Ein fairer Vorrat.",
      "144 Kekse werden auf 12 Gruppen verteilt. Wie viele bekommt jede Gruppe?",
      [
        "12",
        "14",
        "24"
      ],
      0,
      "144 : 12 = 12. Zwölf Gruppen mit zwölf Keksen ergeben 144.",
      "144 : 12",
      {
        "id": "g4-numbers-2",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Division durch Umkehroperation lösen",
        "source": "math",
        "pages": [
          39
        ],
        "hint": "Prüfe deine Antwort, indem du sie mit 12 multiplizierst."
      }
    ]
  },
  {
    "path": "numbers",
    "task": [
      "basket",
      "Geld für die Klassenkasse.",
      "Ein Projekt kostet 18 Euro. Ihr habt 25 Euro. Wie viel bleibt übrig?",
      [
        "6 Euro",
        "7 Euro",
        "8 Euro"
      ],
      1,
      "25 − 18 = 7. In der Kasse bleiben sieben Euro.",
      "25 € − 18 €",
      {
        "id": "g4-numbers-3",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Geldbeträge in Sachsituationen berechnen",
        "source": "math",
        "pages": [
          29,
          44
        ],
        "hint": "Von 18 bis 20 fehlen zwei Euro und bis 25 noch fünf."
      }
    ]
  },
  {
    "path": "numbers",
    "task": [
      "clock",
      "Ein Ausflug am Nachmittag.",
      "Ihr startet um 14:20 Uhr und seid um 15:05 Uhr zurück. Wie lange seid ihr unterwegs?",
      [
        "35 Minuten",
        "40 Minuten",
        "45 Minuten"
      ],
      2,
      "Bis 15 Uhr sind es 40 Minuten, danach noch 5: insgesamt 45 Minuten.",
      "14:20 → 15:05",
      {
        "id": "g4-numbers-4",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Zeitspannen über eine volle Stunde berechnen",
        "source": "math",
        "pages": [
          44,
          45
        ],
        "hint": "Rechne zuerst bis 15 Uhr und dann bis 15:05 Uhr."
      }
    ]
  },
  {
    "path": "numbers",
    "task": [
      "poster",
      "Ein Muster wächst.",
      "In der Folge 3, 6, 12, 24 wird jede Zahl verdoppelt. Welche folgt?",
      [
        "48",
        "36",
        "30"
      ],
      0,
      "24 · 2 = 48. Die nächste Zahl ist 48.",
      "3 · 6 · 12 · 24 · ?",
      {
        "id": "g4-numbers-5",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Bildungsregeln in Zahlenfolgen nutzen",
        "source": "math",
        "pages": [
          57
        ],
        "hint": "Nimm die letzte Zahl zweimal."
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "books",
      "Eine Nachricht von Lumi.",
      "Lies: „Lumi gießt die Pflanze. Danach stellt sie die Kanne ins Regal.“ Was tut Lumi zuerst?",
      [
        "Sie liest ein Buch",
        "Sie gießt die Pflanze",
        "Sie räumt das Regal aus"
      ],
      1,
      "Das Gießen steht vor „danach“. Lumi gießt zuerst die Pflanze.",
      "Zuerst … danach …",
      {
        "id": "g3-words-0",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Handlungsfolgen aus einem Text erschließen",
        "source": "german",
        "pages": [
          27,
          39
        ],
        "hint": "Achte auf das Wort „danach“."
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "cat",
      "Ein Wort für Krümels Bewegung.",
      "Welches Wort ist im Satz „Die Katze springt auf das Sofa“ das Verb?",
      [
        "Katze",
        "Sofa",
        "springt"
      ],
      2,
      "Springt sagt, was die Katze tut. Es ist das Verb.",
      "Die Katze springt.",
      {
        "id": "g3-words-1",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Wortarten im Satz bestimmen",
        "source": "german",
        "pages": [
          33,
          44
        ],
        "hint": "Frage: Was tut die Katze?"
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "books",
      "Ein Wort aus der Familie.",
      "Welches Wort gehört zur Wortfamilie „spielen“?",
      [
        "Spielplatz",
        "Schule",
        "Garten"
      ],
      0,
      "Im Wort Spielplatz steckt der Wortstamm „spiel“.",
      "spielen → ?",
      {
        "id": "g3-words-2",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Wortfamilien erkennen",
        "source": "german",
        "pages": [
          33,
          44
        ],
        "hint": "Suche den gemeinsamen Wortstamm."
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "picture",
      "Ein Wort wird größer.",
      "Welche Steigerung passt: klein, kleiner, …?",
      [
        "kleinig",
        "am kleinsten",
        "Kleinheit"
      ],
      1,
      "Klein – kleiner – am kleinsten sind die drei Steigerungsformen.",
      "klein → kleiner → ?",
      {
        "id": "g3-words-3",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Adjektive steigern",
        "source": "german",
        "pages": [
          44
        ],
        "hint": "Die letzte Form beginnt oft mit „am“."
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "cat",
      "Eine Geschichte von gestern.",
      "Welche Form passt: „Gestern … Milo in den Garten.“?",
      [
        "gehen",
        "geht",
        "ging"
      ],
      2,
      "„Gestern ging Milo in den Garten.“ verwendet eine Vergangenheitsform.",
      "Gestern …",
      {
        "id": "g3-words-4",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Zeitformen im Kontext erkennen",
        "source": "german",
        "pages": [
          44
        ],
        "hint": "Der Satz erzählt, was schon passiert ist."
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "shelf",
      "Ordnung nach dem ABC.",
      "Welches Wort steht im Wörterbuch zuerst: Baum, Buch oder Blume?",
      [
        "Baum",
        "Blume",
        "Buch"
      ],
      0,
      "Alle beginnen mit B. Beim zweiten Buchstaben kommt a vor l und u.",
      "Baum · Buch · Blume",
      {
        "id": "g3-words-5",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Wörter alphabetisch ordnen",
        "source": "german",
        "pages": [
          44
        ],
        "hint": "Vergleiche den zweiten Buchstaben jedes Wortes."
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "books",
      "Die kleine Suchgeschichte.",
      "Lumi sucht ihre Kanne. Milo sagt: „Ich habe sie nach dem Gießen unter das Regal gestellt.“ Wo sollte Lumi suchen?",
      [
        "Im Kühlschrank",
        "Unter dem Regal",
        "Auf dem Sofa"
      ],
      1,
      "Milo nennt den Ort ausdrücklich: unter dem Regal.",
      "Eine Spur von Milo",
      {
        "id": "g4-words-0",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Informationen gezielt aus einem Text entnehmen",
        "source": "german",
        "pages": [
          27,
          44
        ],
        "hint": "Suche nach der Ortsangabe in Milos Satz."
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "cat",
      "Wer handelt hier?",
      "Welches Wort ist das Subjekt im Satz „Krümel schläft auf dem Sofa“?",
      [
        "schläft",
        "Sofa",
        "Krümel"
      ],
      2,
      "Mit „Wer schläft?“ fragst du nach dem Subjekt: Krümel.",
      "Krümel schläft.",
      {
        "id": "g4-words-1",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Subjekt im Satz erkennen",
        "source": "german",
        "pages": [
          44
        ],
        "hint": "Frage nach „Wer oder was?“."
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "guitar",
      "Genau beschreiben.",
      "Welches Wort bedeutet ungefähr dasselbe wie „leise“?",
      [
        "still",
        "schnell",
        "hell"
      ],
      0,
      "Still und leise haben hier eine ähnliche Bedeutung.",
      "leise → ?",
      {
        "id": "g4-words-2",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Wortbedeutungen vergleichen",
        "source": "german",
        "pages": [
          33,
          44
        ],
        "hint": "Es geht um einen Klang mit geringer Lautstärke."
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "books",
      "Eine ganze Wortfamilie.",
      "Welches Wort gehört NICHT zur Wortfamilie „lesen“?",
      [
        "Leserin",
        "leise",
        "vorlesen"
      ],
      1,
      "Leserin und vorlesen gehören zu lesen. „Leise“ hat einen anderen Wortstamm.",
      "lesen → ?",
      {
        "id": "g4-words-3",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Wortfamilien abgrenzen",
        "source": "german",
        "pages": [
          33,
          44
        ],
        "hint": "Ähnlicher Klang allein genügt nicht. Vergleiche Wortstamm und Bedeutung."
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "clock",
      "Ein Plan für morgen.",
      "Welcher Satz steht im Futur?",
      [
        "Milo spielte Gitarre.",
        "Milo spielt Gitarre.",
        "Milo wird Gitarre spielen."
      ],
      2,
      "„Wird spielen“ ist die Zukunftsform Futur.",
      "Morgen …",
      {
        "id": "g4-words-4",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Zeitformen unterscheiden",
        "source": "german",
        "pages": [
          44
        ],
        "hint": "Die Zukunft kann mit „wird“ und einer Grundform gebildet werden."
      }
    ]
  },
  {
    "path": "words",
    "task": [
      "picture",
      "Ein guter Texttitel.",
      "Ein Text erklärt Schritt für Schritt, wie man Papier zu einem Boot faltet. Welche Überschrift passt am besten?",
      [
        "So faltest du ein Papierboot",
        "Unser Garten im Herbst",
        "Die schlafende Katze"
      ],
      0,
      "Die passende Überschrift nennt den Inhalt der Anleitung.",
      "Falten · Schritt für Schritt",
      {
        "id": "g4-words-5",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Überschrift und Textzweck verbinden",
        "source": "german",
        "pages": [
          27,
          44
        ],
        "hint": "Was soll jemand mit dieser Anleitung herstellen können?"
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "cloud",
      "Wasser wird unsichtbar.",
      "Eine kleine Pfütze verschwindet an einem warmen Tag. Was ist mit einem Teil des Wassers passiert?",
      [
        "Er wurde zu Stein",
        "Er ist verdunstet",
        "Er wurde zu Papier"
      ],
      1,
      "Ein Teil des Wassers ist als unsichtbarer Wasserdampf in die Luft gelangt.",
      "Pfütze → Luft",
      {
        "id": "g3-nature-0",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Wasserveränderungen erklären",
        "source": "science",
        "pages": [
          38
        ],
        "hint": "Denke an Wasser, das in die Luft übergeht."
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "plant",
      "Ein guter Vergleich.",
      "Du willst prüfen, ob Licht einer Pflanze hilft. Was solltest du bei zwei ähnlichen Pflanzen gleich halten?",
      [
        "Nur die Topffarbe",
        "Gar nichts",
        "Wassermenge und Pflanzenart"
      ],
      2,
      "Wenn du nur das Licht veränderst, sollte anderes möglichst gleich bleiben. So wird der Vergleich aussagekräftiger.",
      "Nur Licht verändern",
      {
        "id": "g3-nature-1",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Einen einfachen Vergleich planen",
        "source": "science",
        "pages": [
          15,
          28,
          38
        ],
        "hint": "Verändere möglichst nur die Eigenschaft, die du untersuchen willst."
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "fishbowl",
      "Ein Lebensraum unter Wasser.",
      "Warum brauchen Fische ein zu ihrer Art passendes Aquarium?",
      [
        "Weil Platz und Wasserbedingungen zu ihnen passen müssen",
        "Nur wegen der Farbe",
        "Damit sie Bücher lesen"
      ],
      0,
      "Die Bedingungen des Lebensraums müssen zu den Bedürfnissen der Tiere passen.",
      "Tier ↔ Lebensraum",
      {
        "id": "g3-nature-2",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Bedürfnisse von Haustieren berücksichtigen",
        "source": "science",
        "pages": [
          36
        ],
        "hint": "Denke an ausreichend Platz und geeignetes Wasser."
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "tree",
      "Aus Blättern wird neuer Boden.",
      "Was kann mit vielen abgestorbenen Blättern auf einem Kompost geschehen?",
      [
        "Sie werden zu Glas",
        "Sie werden von Lebewesen zersetzt",
        "Sie bleiben immer unverändert"
      ],
      1,
      "Kleine Lebewesen und Pilze können abgestorbene Pflanzenteile zersetzen. Dabei entsteht nach und nach humusreiches Material.",
      "🍂 → Kompost",
      {
        "id": "g3-nature-3",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Veränderungen in der Natur beobachten",
        "source": "science",
        "pages": [
          28
        ],
        "hint": "Auf dem Kompost sind auch kleine Lebewesen und Pilze aktiv."
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "counter",
      "Sauberes Wasser unterwegs.",
      "Warum sollte man schmutziges Pinselwasser nicht in einen Bach kippen?",
      [
        "Damit der Bach bunter wird",
        "Weil Pinsel schwimmen",
        "Weil es Lebewesen und Wasser belasten kann"
      ],
      2,
      "Ein Bach ist Lebensraum. Stoffe im Pinselwasser können ihn belasten.",
      "Wasser schützen",
      {
        "id": "g3-nature-4",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Verantwortlichen Umgang mit Wasser begründen",
        "source": "science",
        "pages": [
          19,
          38
        ],
        "hint": "Überlege, welche Lebewesen im Wasser leben."
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "sofa",
      "Gemeinsam entscheiden.",
      "Eure Gruppe möchte die Spielecke umgestalten. Was hilft bei einer gemeinsamen Entscheidung?",
      [
        "Ideen anhören und gemeinsam abstimmen",
        "Nur die lauteste Person entscheidet",
        "Niemand darf etwas sagen"
      ],
      0,
      "Alle können Ideen äußern. Danach könnt ihr gemeinsam entscheiden, wie ihr die Ecke gestaltet.",
      "Unsere Spielecke",
      {
        "id": "g3-nature-5",
        "level": "grade3",
        "grades": [
          3
        ],
        "skill": "Mitbestimmung und Zusammenleben gestalten",
        "source": "science",
        "pages": [
          19,
          30,
          40
        ],
        "hint": "Eine faire Entscheidung gibt allen eine Stimme."
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "sun",
      "Tag und Nacht im Modell.",
      "Ein Globus wird von einer Lampe beleuchtet. Du drehst ihn langsam. Welche Seite hat im Modell Tag?",
      [
        "Die von der Lampe abgewandte",
        "Die von der Lampe beleuchtete",
        "Immer nur die obere"
      ],
      1,
      "Die beleuchtete Seite steht für den Tag. Durch das Drehen wechseln Orte zwischen Licht und Schatten.",
      "Lampe + Globus",
      {
        "id": "g4-nature-0",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Ein Modell für Tag und Nacht erklären",
        "source": "science",
        "pages": [
          15,
          28,
          42
        ],
        "hint": "Die Lampe stellt die Sonne dar."
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "cloud",
      "Ein Kreislauf aus Wasser.",
      "Welche Reihenfolge beschreibt einen Teil des Wasserkreislaufs sinnvoll?",
      [
        "Regen → Stein → Wolke",
        "Wolke → Papier → Meer",
        "Verdunsten → Wolkenbildung → Regen"
      ],
      2,
      "Wasser verdunstet. Es kann in Wolken zu Tröpfchen werden und als Niederschlag zurückkehren.",
      "Wasser unterwegs",
      {
        "id": "g4-nature-1",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Zusammenhänge im Wasserkreislauf erklären",
        "source": "science",
        "pages": [
          38
        ],
        "hint": "Wie gelangt Wasser zuerst vom Boden in die Luft?"
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "poster",
      "Ein kleiner Lageplan.",
      "Auf einem Plan ist Norden oben. Welche Himmelsrichtung liegt dann rechts?",
      [
        "Osten",
        "Westen",
        "Süden"
      ],
      0,
      "Wenn Norden oben liegt, ist Osten rechts und Westen links.",
      "N ↑   ? →",
      {
        "id": "g4-nature-2",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Sich auf einem Plan orientieren",
        "source": "science",
        "pages": [
          28,
          40
        ],
        "hint": "Merke dir im Uhrzeigersinn: Norden, Osten, Süden, Westen."
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "lamp",
      "Energie im Alltag.",
      "Warum ist es sinnvoll, beim Verlassen eines leeren Zimmers das Licht auszuschalten?",
      [
        "Damit die Möbel wachsen",
        "Weil dann für die Lampe keine unnötige elektrische Energie verbraucht wird",
        "Damit es draußen heller wird"
      ],
      1,
      "Wenn niemand das Licht braucht, kann die ausgeschaltete Lampe elektrische Energie sparen.",
      "Licht an oder aus?",
      {
        "id": "g4-nature-3",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Ressourcenbewusstes Handeln begründen",
        "source": "science",
        "pages": [
          19,
          40
        ],
        "hint": "Frage dich, ob gerade jemand das Licht nutzt."
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "plant",
      "Eine Beobachtung prüfen.",
      "Eine Pflanze wächst am Fenster besser als im dunklen Schrank. Was ist eine passende Vermutung?",
      [
        "Pflanzen bestehen aus Glas",
        "Pflanzen mögen nur Schränke",
        "Licht kann ihr Wachstum unterstützen"
      ],
      2,
      "Die Beobachtung passt zur Vermutung, dass Licht beim Wachsen hilft. Für einen Vergleich sollten andere Bedingungen ähnlich sein.",
      "Beobachtung → Vermutung",
      {
        "id": "g4-nature-4",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Aus Beobachtungen begründet vermuten",
        "source": "science",
        "pages": [
          15,
          28
        ],
        "hint": "Welche Bedingung unterscheidet Fenster und dunklen Schrank?"
      }
    ]
  },
  {
    "path": "nature",
    "task": [
      "basket",
      "Bewusst einkaufen.",
      "Du kaufst jede Woche ein. Welche Möglichkeit erzeugt im Alltag meist weniger neue Tragetaschen?",
      [
        "Einen vorhandenen Korb wiederverwenden",
        "Jedes Mal mehrere neue Tüten nehmen",
        "Jeden Korb nach einem Einkauf wegwerfen"
      ],
      0,
      "Ein vorhandener Korb kann immer wieder genutzt werden. So brauchst du weniger neue Tragetaschen.",
      "Ein Korb, viele Einkäufe",
      {
        "id": "g4-nature-5",
        "level": "grade4",
        "grades": [
          4
        ],
        "skill": "Wiederverwendung im Alltag begründen",
        "source": "science",
        "pages": [
          19,
          32
        ],
        "hint": "Was lässt sich wiederholt benutzen?"
      }
    ]
  }
];
for(const entry of additions){entry.task[7].type='choice';bank.paths.find(p=>p.id===entry.path).items.push(entry.task)}
const missions=[
['tea','Ein Platz für Milo.','Gib Milo die Teetasse in die Hand. Ziehe sie an seine Hand, bis er sie hält.',[],0,'Du hast die Tasse gezielt zu Milo bewegt. Erzähl ihm, wo du sie gefunden hast.','☕ → Milo',{id:'world-tea',grades:[0,1,2,3,4],type:'world',goal:'carry',skill:'Gegenstände räumlich zuordnen und eine Handlung beschreiben',source:'german',pages:[27,38],hint:'Milos Hand ist etwa auf Höhe seines Bauchs. Ziehe die Tasse nah genug heran.'}],
['watering','Eine Pflanze zieht ein.','Ziehe die Gießkanne zur Monstera und tippe dann die Gießkanne an.',[],0,'Du hast der Pflanze Wasser gegeben. Beobachte Pflanzen auch im echten Alltag gemeinsam mit Erwachsenen.','💧 → 🌱',{id:'world-water',grades:[0,1,2,3,4],type:'world',goal:'water',skill:'Einen alltagsnahen Handlungsablauf erproben',source:'science',pages:[15,28,38],hint:'Die Kanne muss nah bei der Pflanze stehen. Dann kannst du sie benutzen.'}],
['stool','Links vom Tisch.','Stelle einen Hocker links neben den Sofatisch. Probiere aus, wie die Dinge zusammenpassen.',[],0,'Dein Hocker steht links neben dem Tisch. Beschreibe die Lage mit deinen eigenen Worten.','Hocker ← Tisch',{id:'world-left',grades:[0,1,2,3,4],type:'world',goal:'left',skill:'Räumliche Lagebeziehungen handelnd erkunden',source:'math',pages:[50],hint:'Links ist auf deinem Bildschirm die Seite des linken Pfeils. Der Hocker soll nahe beim Tisch stehen.'}],
['sun','Licht und Schatten.','Tippe auf die Sonne und verwandle den Tag in eine Nacht. Wenn schon Nacht ist, mache erst Tag.',[],0,'Die Spielwelt wurde dunkel. Im echten Leben entsteht Nacht durch die Drehung der Erde.','☀ → ☾',{id:'world-night',grades:[0,1,2,3,4],type:'world',goal:'night',skill:'Eine Veränderung beobachten und beschreiben',source:'science',pages:[15,28,42],hint:'Die Sonne findest du draußen vor dem Fenster.'}],
['plant','Dein kleines Gartenbeet.','Lege die passende Anzahl Samen ins Beet.',[],0,'Du hast die Menge durch eigenes Legen überprüft.','🌱',{id:'garden-seeds',grades:[0,1,2,3,4],type:'garden',skill:'Mengen legen und Rechengeschichten handelnd lösen',source:'math',pages:[38,39,56],hint:'Du kannst Samen hinzufügen und wieder herausnehmen. Prüfe die Anzahl Schritt für Schritt.'}],
['books','Ein Spiel für zwei Gedächtnisse.','Decke zwei Karten auf und finde die zusammengehörenden Paare.',[],0,'Du hast alle Paare gefunden. Zeigt und erklärt euch ein Lieblingspaar.','▣ ▣ ▣',{id:'word-memory',grades:[0,1,2,3,4],type:'memory',skill:'Bilder und Wörter bzw. ähnliche Bedeutungen zuordnen',source:'german',pages:[26,27,33],hint:'Merke dir die Positionen. Karten ohne Paar kannst du später erneut aufdecken.'}]
];
for(const task of missions){const path=task[7].type==='garden'?'numbers':task[7].type==='memory'||task[7].goal==='carry'?'words':task[7].goal==='left'?'numbers':'nature';bank.paths.find(p=>p.id===path).items.unshift(task)}
window.LerndachsGrades={0:{label:'Vorschule',note:'Bilder, kleine Mengen & Entdecken'},1:{label:'Klasse 1',note:'Zählen, erste Wörter & Alltag'},2:{label:'Klasse 2',note:'Rechnen bis 20 & kurze Sätze'},3:{label:'Klasse 3',note:'Rechnen bis 1000 & Texte verstehen'},4:{label:'Klasse 4',note:'Größere Zahlen & Zusammenhänge'}};
})();

;
/* Original media scenarios. Dimensions follow the six KMK areas; not a diagnostic test. */
(()=>{
const source='https://www.kmk.org/aktuelles/pressearchiv/mitteilung/strategie-bildung-in-der-digitalen-welt.html';
LerndachsCurriculum.sources.media={title:'Medienkompetenz',file:'Eigene Alltagsszenarien zu den sechs KMK-Kompetenzbereichen',edition:'2026',scope:'Erste Orientierung, keine vollständige Kompetenzmessung',sections:'Suchen; Kommunizieren; Gestalten; Schützen; Problemlösen; Reflektieren',url:source};
const dimensions=[['search','Suchen & Informationen prüfen'],['communicate','Miteinander kommunizieren'],['create','Gestalten & Präsentieren'],['protect','Sicher & gesund handeln'],['solve','Probleme lösen'],['reflect','Medien verstehen']];
// [dimension, younger question, older question, choices younger, choices older, correct, explanation]
const rows=[
[0,'Du suchst ein Bild von einem Dachs. Was suchst du?','Welche Suchanfrage hilft für einen Steckbrief über die Nahrung des Dachses?',['Dachs','Irgendwas','123'],['Dachs Nahrung Steckbrief','lustig','Tiere alles'],0,'Eine genaue Suche passt zu deiner Frage.'],
[0,'Du weißt nicht, ob ein Tierbild stimmt. Wer kann helfen?','Zwei Webseiten nennen verschiedene Fakten. Was hilft?',['Ein Erwachsener schaut mit dir nach.','Du glaubst alles.','Du rätst einfach.'],['Die erste Seite hat immer recht.','Die Fakten in weiteren verlässlichen Quellen prüfen.','Die bunteste Seite wählen.'],1,'Frage nach und prüfe Informationen gemeinsam.'],
[1,'Lumi hat ein Bild gemalt. Was schreibst du freundlich?','Wie gibst du hilfreiches Feedback zu einer digitalen Geschichte?',['Dein Bild gefällt mir!','Das ist blöd!','Geh weg!'],['Du kannst gar nichts.','Das Ende gefällt mir. Den Anfang könntest du erklären.','Ich lache dich aus.'],1,'Freundliche, genaue Rückmeldungen helfen beim gemeinsamen Lernen.'],
[1,'Du willst ein Foto von Milo zeigen. Was tust du zuerst?','Du möchtest ein Gruppenfoto im Klassenchat teilen. Was ist wichtig?',['Alle sofort schicken.','Milo vorher fragen.','Seinen Namen ändern.'],['Alle abgebildeten Personen um Erlaubnis bitten.','Einfach hochladen.','Nur die Datei umbenennen.'],0,'Frage die abgebildeten Menschen vor dem Teilen um Erlaubnis.'],
[2,'Du möchtest eine kleine Geschichte aufnehmen. Was brauchst du?','Du planst eine Tonaufnahme für einen Tier-Steckbrief. Was hilft zuerst?',['Ein Mikrofon.','Einen Löffel.','Einen Schuh.'],['Einen kurzen Text und einen Aufnahmeplan.','Möglichst laute Musik.','Viele unbekannte Dateien.'],0,'Mit einem Plan und dem passenden Werkzeug wird deine Idee verständlich.'],
[2,'Du malst am Tablet ein Bild. Was hilft, es wiederzufinden?','Wie findest du deine digitale Zeichnung nächste Woche wieder?',['Sofort alles löschen.','Das Tablet verstecken.','Das Bild mit einem passenden Namen speichern.'],['Jede Datei gleich nennen.','Gar nicht speichern.','Im passenden Ordner mit erkennbarem Namen speichern.'],2,'Ein passender Dateiname hilft dir beim Wiederfinden.'],
[3,'Ein fremder Mensch fragt im Spiel nach deiner Adresse. Was tust du?','Ein unbekannter Chatkontakt fragt nach deiner Schule und Adresse. Was tust du?',['Ich gebe sie nicht weiter und hole Hilfe.','Ich schicke meine Adresse.','Ich verrate auch mein Passwort.'],['Ich teile die Daten nicht und spreche mit einer vertrauten Person.','Ich schicke alle Daten.','Ich treffe die Person allein.'],0,'Private Daten bleiben privat. Vertraute Erwachsene können helfen.'],
[3,'Deine Augen sind müde vom Bildschirm. Was hilft?','Du spielst schon länger und merkst, dass du müde wirst. Was hilft?',['Noch näher an den Bildschirm gehen.','Eine Pause und Bewegung.','Einfach immer weiterspielen.'],['Die Müdigkeit ignorieren.','Eine Bildschirmpause, Bewegung und ein Blick in die Ferne.','Die Bildschirmhelligkeit ganz hochstellen.'],1,'Pausen und Bewegung gehören zu einem guten Umgang mit Medien.'],
[4,'Der Ton ist aus. Was prüfst du zuerst?','Du hörst bei einer Lernaufnahme nichts. Was prüfst du zuerst?',['Ob die Lautstärke aus ist.','Ob das Fenster offen ist.','Ob du einen Stift hast.'],['Ob Ton und Lautstärke eingeschaltet sind.','Ob du alle Dateien löschen kannst.','Ob der Bildschirm bunt ist.'],0,'Prüfe zuerst einfache Einstellungen. Hole dir Hilfe, wenn du nicht weiterkommst.'],
[4,'Du willst ein Bild malen und behalten. Was kommt zuerst?','Welche Reihenfolge hilft beim Erstellen einer digitalen Zeichnung?',['Malen, dann speichern.','Löschen, dann schließen.','Speichern, ohne etwas zu malen.'],['Löschen, schließen, suchen.','Datei öffnen, gestalten, speichern.','Ausschalten, malen, öffnen.'],1,'Eine sinnvolle Reihenfolge macht Aufgaben leichter.'],
[5,'Ein bunter Knopf sagt: Jetzt kaufen! Was machst du?','Ein Spiel verspricht einen Preis, wenn du etwas kaufst. Was ist klug?',['Sofort kaufen.','Erst einen Erwachsenen fragen.','So oft wie möglich tippen.'],['Erst prüfen, ob Werbung und Kosten dahinterstecken.','Sofort bezahlen.','Dein Passwort eingeben.'],0,'Werbung möchte zum Kaufen anregen. Nimm dir Zeit und frage nach.'],
[5,'Im Video fliegt ein Elefant. Muss das echt sein?','Ein sehr echtes Bild zeigt etwas Unglaubliches. Was gilt?',['Ja, jedes Video ist echt.','Ja, wenn es bunt ist.','Nein, Bilder und Videos können verändert sein.'],['Alles im Internet ist wahr.','Nur Fotos sind immer wahr.','Bilder können bearbeitet oder mit KI erzeugt sein.'],2,'Bilder können erfunden oder verändert sein. Prüfe, bevor du etwas glaubst.']
];
// Correct options differ by age for some scenarios; explicit keys avoid accidental mismatches.
const youngKeys=[0,0,0,1,0,2,0,1,0,0,1,2],olderKeys=[0,1,1,0,0,2,0,1,0,1,0,2];
const items=[];for(let age=0;age<2;age++)rows.forEach((r,i)=>{
 const d=dimensions[r[0]],grades=age?[3,4]:[0,1,2],answer=(age?olderKeys:youngKeys)[i];
 items.push(['books','Mit Medien die Welt entdecken.',r[age?2:1],r[age?4:3],answer,r[6],'Dachs entdeckt Medien',{id:`media-${age}-${i}`,type:'choice',level:age?'grade3':'start',grades,source:'media',pages:[],dimension:d[0],skill:d[1],hint:'Überlege: Was ist freundlich, sicher und hilft beim Lernen?'}]);
});
LerndachsCurriculum.paths.push({id:'media',title:'Medienfüchse',subject:'media',color:'blue',icon:'▣',tag:'SICHER & KREATIV',desc:'Prüfen, gestalten und freundlich miteinander umgehen.',items});
window.LerndachsMedia={dimensions,source};
})();

;
/* Observations, not grades: only actual interactions receive detail records. */
(()=>{
const J=LerndachsJourney,p=J.profile;let current=null;
if(!Array.isArray(p.evidence))p.evidence=[];
const key=q=>['garden','memory'].includes(q[7].type)?q[7].id+'-g'+p.grade:q[7].id;
function start(q,path){current={id:key(q),grade:p.grade,subject:LerndachsCurriculum.paths.find(x=>x.id===path)?.subject||'math',skill:q[7].skill,dimension:q[7].dimension||null,errors:0,hints:0}}
function finish(q){if(!current||current.id!==key(q))return;const row={...current,at:new Date().toISOString()};if(!p.evidence.some(e=>e.id===row.id&&e.grade===row.grade)){p.evidence.push(row);J.save()}}
function summary(subject,dimension){
 const tasks=LerndachsCurriculum.paths.filter(x=>x.subject===subject).flatMap(x=>x.items).filter(q=>q[7].grades.includes(p.grade)&&(!dimension||q[7].dimension===dimension));
 const allowed=new Set(tasks.map(key));
 const rows=p.evidence.filter(e=>e.grade===p.grade&&e.subject===subject&&(!dimension||e.dimension===dimension));
 const eligible=rows.filter(e=>allowed.has(e.id)),unique=new Map(eligible.map(e=>[e.id,e])),observed=[...unique.values()];
 // Generated math exercises also count, while the catalogue progress stays separate.
 const practice=dimension?[]:rows.filter(e=>e.id.startsWith('practice-g'+p.grade+'-'));
 const evidence=[...observed,...practice],known=tasks.filter(q=>p.done.includes(key(q))).length;
 const independent=evidence.filter(e=>!e.errors&&!e.hints).length,skills=new Set(evidence.map(e=>e.skill)).size;
 let stage=evidence.length===0?'Noch offen':evidence.length<3?'Entdecken':evidence.length>=6&&independent/evidence.length>=.8&&skills>=3?'Anwenden':'Üben';
 return {stage,known,total:tasks.length,observed:evidence.length,independent,hints:evidence.filter(e=>e.hints>0).length,retries:evidence.filter(e=>e.errors>0).length,legacy:Math.max(0,known-observed.length),skills};
}
window.LerndachsEvidence={start,finish,mistake(){if(current)current.errors++},hint(){if(current)current.hints++},summary};
})();

;
/* Local German recordings. Generated with scripts/generate-speech.cjs. */
(()=>{'use strict';const bank={"version":1,"voice":"Eddy (German (Germany))","wordsPerMinute":145,"clips":{"0":"audio/speech/5feceb66ffc86f38.mp3","1":"audio/speech/6b86b273ff34fce1.mp3","2":"audio/speech/d4735e3a265e16ee.mp3","3":"audio/speech/4e07408562bedb8b.mp3","4":"audio/speech/4b227777d4dd1fc6.mp3","5":"audio/speech/ef2d127de37b942b.mp3","6":"audio/speech/e7f6c011776e8db7.mp3","7":"audio/speech/7902699be42c8a8e.mp3","8":"audio/speech/2c624232cdd22177.mp3","9":"audio/speech/19581e27de7ced00.mp3","10":"audio/speech/4a44dc15364204a8.mp3","11":"audio/speech/4fc82b26aecb47d2.mp3","12":"audio/speech/6b51d431df5d7f14.mp3","13":"audio/speech/3fdba35f04dc8c46.mp3","14":"audio/speech/8527a891e2241369.mp3","15":"audio/speech/e629fa6598d73276.mp3","16":"audio/speech/b17ef6d19c7a5b1e.mp3","17":"audio/speech/4523540f1504cd17.mp3","18":"audio/speech/4ec9599fc203d176.mp3","19":"audio/speech/9400f1b21cb527d7.mp3","20":"audio/speech/f5ca38f748a1d6ea.mp3","21":"audio/speech/6f4b6612125fb3a0.mp3","22":"audio/speech/785f3ec7eb32f30b.mp3","23":"audio/speech/535fa30d7e25dd8a.mp3","24":"audio/speech/c2356069e9d1e79c.mp3","25":"audio/speech/b7a56873cd771f2c.mp3","26":"audio/speech/5f9c4ab08cac7457.mp3","27":"audio/speech/670671cd97404156.mp3","28":"audio/speech/59e19706d51d39f6.mp3","29":"audio/speech/35135aaa6cc23891.mp3","30":"audio/speech/624b60c58c9d8bfb.mp3","31":"audio/speech/eb1e33e8a81b697b.mp3","32":"audio/speech/e29c9c180c6279b0.mp3","33":"audio/speech/c6f3ac57944a5314.mp3","34":"audio/speech/86e5014965866131.mp3","35":"audio/speech/9f14025af0065b30.mp3","36":"audio/speech/76a50887d8f1c2e9.mp3","37":"audio/speech/7a61b53701befdae.mp3","38":"audio/speech/aea92132c4cbeb26.mp3","39":"audio/speech/0b918943df0962bc.mp3","40":"audio/speech/d59eced1ded07f84.mp3","41":"audio/speech/3d914f9348c9cc0f.mp3","42":"audio/speech/73475cb40a568e8d.mp3","43":"audio/speech/44cb730c420480a0.mp3","44":"audio/speech/71ee45a3c0db9a98.mp3","45":"audio/speech/811786ad1ae74adf.mp3","46":"audio/speech/25fc0e7096fc6537.mp3","47":"audio/speech/31489056e0916d59.mp3","48":"audio/speech/98010bd9270f9b10.mp3","49":"audio/speech/0e17daca5f3e175f.mp3","50":"audio/speech/1a6562590ef19d10.mp3","51":"audio/speech/031b4af5197ec30a.mp3","52":"audio/speech/41cfc0d1f2d127b0.mp3","53":"audio/speech/2858dcd1057d3eae.mp3","54":"audio/speech/2fca346db6561871.mp3","55":"audio/speech/02d20bbd7e394ad5.mp3","56":"audio/speech/7688b6ef52555962.mp3","57":"audio/speech/c837649cce43f272.mp3","58":"audio/speech/6208ef0f7750c111.mp3","59":"audio/speech/3e1e967e9b793e90.mp3","60":"audio/speech/39fa9ec190eee7b6.mp3","61":"audio/speech/d029fa3a95e174a1.mp3","62":"audio/speech/81b8a03f97e8787c.mp3","63":"audio/speech/da4ea2a5506f2693.mp3","64":"audio/speech/a68b412c4282555f.mp3","65":"audio/speech/108c995b953c8a35.mp3","66":"audio/speech/3ada92f28b4ceda3.mp3","67":"audio/speech/49d180ecf5613281.mp3","68":"audio/speech/a21855da08cb102d.mp3","69":"audio/speech/c75cb66ae28d8ebc.mp3","70":"audio/speech/ff5a1ae012afa5d4.mp3","71":"audio/speech/7f2253d7e228b22a.mp3","72":"audio/speech/8722616204217edd.mp3","73":"audio/speech/96061e92f58e4bdc.mp3","74":"audio/speech/eb624dbe56eb6620.mp3","75":"audio/speech/f369cb89fc627e66.mp3","76":"audio/speech/f74efabef12ea619.mp3","77":"audio/speech/a88a7902cb4ef697.mp3","78":"audio/speech/349c41201b62db85.mp3","79":"audio/speech/98a3ab7c340e8a03.mp3","80":"audio/speech/48449a14a4ff7d79.mp3","81":"audio/speech/5316ca1c5ddca8e6.mp3","82":"audio/speech/a46e37632fa6ca51.mp3","83":"audio/speech/bbb965ab0c80d653.mp3","84":"audio/speech/44c8031cb036a735.mp3","85":"audio/speech/b4944c6ff08dc6f4.mp3","86":"audio/speech/434c9b5ae514646b.mp3","87":"audio/speech/bdd2d3af3a5a1213.mp3","88":"audio/speech/8b940be7fb78aaa6.mp3","89":"audio/speech/cd70bea023f752a0.mp3","90":"audio/speech/69f59c273b6e669a.mp3","91":"audio/speech/1da51b8d8ff98f6a.mp3","92":"audio/speech/8241649609f88ccd.mp3","93":"audio/speech/6e4001871c0cf27c.mp3","94":"audio/speech/e3d6c4d4599e0088.mp3","95":"audio/speech/ad48ff99415b2f00.mp3","96":"audio/speech/7b1a278f5abe8e9d.mp3","97":"audio/speech/d6d824abba4afde8.mp3","98":"audio/speech/29db0c6782dbd500.mp3","99":"audio/speech/8c1f1046219ddd21.mp3","100":"audio/speech/ad57366865126e55.mp3","200":"audio/speech/27badc983df1780b.mp3","300":"audio/speech/983bd614bb5afece.mp3","400":"audio/speech/26d228663f13a885.mp3","500":"audio/speech/0604cd3138feed20.mp3","600":"audio/speech/284b7e6d788f363f.mp3","700":"audio/speech/99ee50221221864d.mp3","800":"audio/speech/1a1cf797fabe7f95.mp3","900":"audio/speech/bdc5d8a48c238979.mp3","lege die passende anzahl samen ins beet":"audio/speech/424e64d2e2ad2424.mp3","du kannst samen hinzufügen und wieder herausnehmen. prüfe die anzahl schritt für schritt":"audio/speech/d2a6de51f86c46ad.mp3","du hast die menge durch eigenes legen überprüft":"audio/speech/033c302a6d08c2e0.mp3","stelle einen hocker links neben den sofatisch. probiere aus, wie die dinge zusammenpassen":"audio/speech/eb99df81978e6a65.mp3","links ist auf deinem bildschirm die seite des linken pfeils. der hocker soll nahe beim tisch stehen":"audio/speech/aa27888e544a7f7b.mp3","dein hocker steht links neben dem tisch. beschreibe die lage mit deinen eigenen worten":"audio/speech/aa90685dadb31b3f.mp3","du hast 2 äpfel und bekommst 3 dazu. wie viele sind es? die antworten sind: 4, 5, oder 6":"audio/speech/91921fe9dc0dd178.mp3","zähle erst zwei, dann noch drei weiter":"audio/speech/14dc9767f5735424.mp3","2 + 3 = 5. zusammen sind es fünf äpfel":"audio/speech/58e1b17e0e2e0dfa.mp3","milo und lumi bekommen je eine tasse. wie viele brauchst du? die antworten sind: 1, 2, oder 3":"audio/speech/c4bd70af073f04e3.mp3","stelle dir vor: jede figur bekommt genau eine tasse":"audio/speech/ef7b5d1079da317f.mp3","eine für milo und eine für lumi: zwei tassen":"audio/speech/37ac0042345c6591.mp3","4 toastscheiben sind fertig. du isst eine. wie viele bleiben? die antworten sind: 2, 3, oder 5":"audio/speech/5bb56964d299749f.mp3","lege vier finger hin und klappe einen weg":"audio/speech/6b2f1ec8363842e1.mp3","4 − 1 = 3. drei toastscheiben bleiben":"audio/speech/32f3d63d43a95b35.mp3","die vorderseite der uhr ist rund. welche form ist das? die antworten sind: dreieck, kreis, oder quadrat":"audio/speech/5cdfaa567cace943.mp3","fahre den rand mit dem finger in der luft nach":"audio/speech/a0b3c985d69ca922.mp3","ein kreis ist rund und hat keine ecken":"audio/speech/0da5d4cf47340771.mp3","6 kuchenstücke werden gerecht auf 2 teller verteilt. wie viele liegen auf jedem teller? die antworten sind: 2, 4, oder 3":"audio/speech/07c05bb252e1ea00.mp3","verteile abwechselnd: ein stück hier, ein stück dort":"audio/speech/33f6522b6e2e7bde.mp3","lege immer abwechselnd ein stück auf jeden teller. dann liegen auf jedem drei":"audio/speech/aa87be21a8000c40.mp3","2 hocker haben je 4 beine. wie viele beine sind es zusammen? die antworten sind: 6, 8, oder 10":"audio/speech/bf0ebcfba8f94795.mp3","zähle vier beine und dann noch einmal vier":"audio/speech/6d5e7f0cf06358e2.mp3","4 + 4 = 8. zusammen sind es acht beine":"audio/speech/3ed6f500b960c60c.mp3","im korb sind 10 äpfel. 7 kommen dazu. wie viele sind es jetzt? die antworten sind: 16, 17, oder 18":"audio/speech/b1be2449df2fc8f6.mp3","starte bei zehn und zähle sieben weiter":"audio/speech/cb38c2544a4f96d8.mp3","10 + 7 = 17. ein zehner und sieben einer ergeben siebzehn":"audio/speech/0d716bc9a66ad59b.mp3","15 kekse sind in der dose. 6 werden verteilt. wie viele bleiben? die antworten sind: 9, 8, oder 11":"audio/speech/69a9d6d0f77b13ce.mp3","nimm zuerst fünf weg. dann fehlt noch ein keks":"audio/speech/491a2f7a2548fcb1.mp3","15 − 5 = 10 und noch einen weg: 9":"audio/speech/17a08f38d831f5b4.mp3","4 bücher stehen im regal. wie viele fehlen noch bis 10? die antworten sind: 5, 7, oder 6":"audio/speech/471fdf34b9448b6d.mp3","zähle von vier weiter, bis du bei zehn bist":"audio/speech/e3cf35b5fffc3f03.mp3","4 + 6 = 10. es fehlen sechs bücher":"audio/speech/820361006089d7c8.mp3","ein apfel kostet 2 euro, ein brot 3 euro. was kostet beides zusammen? die antworten sind: 6 euro, 5 euro, oder 1 euro":"audio/speech/26b414aae917e014.mp3","beide preise werden zusammengezählt":"audio/speech/0ee763482b178c7a.mp3","2 euro + 3 euro = 5 euro":"audio/speech/f352c8b9d460840a.mp3","wie viele minuten hat eine stunde? die antworten sind: 30, 100, oder 60":"audio/speech/64155e39e3a7597b.mp3","eine halbe stunde hat 30 minuten. nimm sie zweimal":"audio/speech/22dffd13b483ec66.mp3","60 minuten ergeben eine stunde":"audio/speech/15b6865f6e0dfe6d.mp3","die lichter tragen die zahlen 2, 4, 6. welche zahl kommt als nächstes? die antworten sind: 8, 7, oder 10":"audio/speech/883cd0dc12b223bd.mp3","vergleiche zwei nachbarzahlen. wie groß ist der schritt":"audio/speech/32cfde7b8471cbd1.mp3","die zahlen werden immer um zwei größer: 2, 4, 6, 8":"audio/speech/b46c8a2868310b9b.mp3","im garten sind 125 äpfel und 75 birnen geerntet. wie viele früchte sind es zusammen? die antworten sind: 190, 200, oder 210":"audio/speech/8740d97eb2648666.mp3","ergänze zuerst bis zum nächsten vollen fünfziger":"audio/speech/b419b489c82d6ad1.mp3","125 + 75 = 200. du kannst erst 125 + 25 = 150 und dann +50 rechnen":"audio/speech/a8505acf6d91ad55.mp3","6 tüten bekommen jeweils 7 kekse. wie viele kekse brauchst du? die antworten sind: 13, 36, oder 42":"audio/speech/0e6a5e35873409db.mp3","5 · 7 sind 35. eine weitere siebenergruppe kommt dazu":"audio/speech/72816e10fc412d53.mp3","6 · 7 = 42. sechs gleich große gruppen mit je sieben keksen":"audio/speech/4d145efeda5eb68e.mp3","48 bücher werden gleichmäßig auf 6 regalbretter verteilt. wie viele stehen auf jedem brett? die antworten sind: 8, 6, oder 9":"audio/speech/6cffcb4f0827c1c7.mp3","welche zahl ergibt mit sechs multipliziert 48":"audio/speech/08f6949a8a68f51d.mp3","48 : 6 = 8, denn 6 · 8 = 48":"audio/speech/202d689eb8a49983.mp3","ein brett ist 1 meter lang. wie viele zentimeter sind das? die antworten sind: 10 cm, 100 cm, oder 1000 cm":"audio/speech/5a033f6179299a2c.mp3","auf einem meterstab findest du hundert zentimeter":"audio/speech/2153e6c435525a27.mp3","1 meter besteht aus 100 zentimetern":"audio/speech/d53824686d375d3e.mp3","das hörspiel beginnt um 14 uhr und endet um 14:30 uhr. wie lange dauert es? die antworten sind: 15 minuten, 60 minuten, oder 30 minuten":"audio/speech/b49fa29d23431b6a.mp3","vergleiche die minuten am anfang und am ende":"audio/speech/2d66521306da3b79.mp3","von 14:00 bis 14:30 vergeht eine halbe stunde: 30 minuten":"audio/speech/582a3a85bf2fa34d.mp3","ein rechteck ist 4 m lang und 2 m breit. wie groß ist sein umfang? die antworten sind: 12 m, 8 m, oder 6 m":"audio/speech/3f2a1b7a223c3711.mp3","zähle alle vier seiten zusammen, nicht nur zwei":"audio/speech/042f0b6e4185a4a7.mp3","der rand besteht aus 4 + 2 + 4 + 2 = 12 metern":"audio/speech/aa614caed7352014.mp3","für ein möbelprojekt sind 1250 bausteine da. 750 kommen hinzu. wie viele sind es dann? die antworten sind: 1900, 2000, oder 2100":"audio/speech/8c48cffa56f8ab5c.mp3","ergänze die 250 auf einen vollen tausender":"audio/speech/0414bac8b694c61e.mp3","1250 + 750 = 2000. 250 + 750 ergeben einen weiteren tausender":"audio/speech/f0d688acc1d03b5e.mp3","8 klassen bekommen je 24 bücher. wie viele bücher sind das? die antworten sind: 162, 184, oder 192":"audio/speech/899c33c3de543121.mp3","zerlege 24 in 20 und 4":"audio/speech/12081cfb23bdf18a.mp3","8 · 24 = 8 · 20 + 8 · 4 = 160 + 32 = 192":"audio/speech/426a6783f2333d73.mp3","144 kekse werden auf 12 gruppen verteilt. wie viele bekommt jede gruppe? die antworten sind: 12, 14, oder 24":"audio/speech/fbc3fe8f0a048843.mp3","prüfe deine antwort, indem du sie mit 12 multiplizierst":"audio/speech/f8fd6242f8e6722b.mp3","144 : 12 = 12. zwölf gruppen mit zwölf keksen ergeben 144":"audio/speech/5a99dfd27c3a648b.mp3","ein projekt kostet 18 euro. ihr habt 25 euro. wie viel bleibt übrig? die antworten sind: 6 euro, 7 euro, oder 8 euro":"audio/speech/487fcecd92c775bd.mp3","von 18 bis 20 fehlen zwei euro und bis 25 noch fünf":"audio/speech/4450823cc3936f9c.mp3","25 − 18 = 7. in der kasse bleiben sieben euro":"audio/speech/378d2c9e90ea6593.mp3","ihr startet um 14:20 uhr und seid um 15:05 uhr zurück. wie lange seid ihr unterwegs? die antworten sind: 35 minuten, 40 minuten, oder 45 minuten":"audio/speech/f051529419353c07.mp3","rechne zuerst bis 15 uhr und dann bis 15:05 uhr":"audio/speech/b127ce142f263048.mp3","bis 15 uhr sind es 40 minuten, danach noch 5: insgesamt 45 minuten":"audio/speech/375508cb17e9d13a.mp3","in der folge 3, 6, 12, 24 wird jede zahl verdoppelt. welche folgt? die antworten sind: 48, 36, oder 30":"audio/speech/ffa83e7344e77029.mp3","nimm die letzte zahl zweimal":"audio/speech/148a20fe94248762.mp3","24 · 2 = 48. die nächste zahl ist 48":"audio/speech/f59817559561ba6c.mp3","decke zwei karten auf und finde die zusammengehörenden paare":"audio/speech/533f73577fec8990.mp3","merke dir die positionen. karten ohne paar kannst du später erneut aufdecken":"audio/speech/ff8969f242f0d0ef.mp3","du hast alle paare gefunden. zeigt und erklärt euch ein lieblingspaar":"audio/speech/0bf0a31223effcdf.mp3","gib deiner figur die teetasse in die hand. ziehe sie an seine hand, bis er sie hält":"audio/speech/d0af50d915226d4a.mp3","milos hand ist etwa auf höhe seines bauchs. ziehe die tasse nah genug heran":"audio/speech/7f706c99ec28db4c.mp3","du hast die tasse gezielt zu milo bewegt. erzähl ihm, wo du sie gefunden hast":"audio/speech/c6e4d59c5f97416d.mp3","mit welchem buchstaben beginnt katze? die antworten sind: k, m, oder t":"audio/speech/01352bd434f65871.mp3","sprich den anfang von katze ganz langsam":"audio/speech/8498fec6d3f34ad8.mp3","k wie katze! sprich das wort langsam: k-a-t-z-e":"audio/speech/dbc8f7f84a15fcf6.mp3","welches wort passt zur sonne? die antworten sind: kalt, warm, oder nass":"audio/speech/c99eaeffdfae0061.mp3","denke daran, wie sich sonnenstrahlen auf deiner haut anfühlen":"audio/speech/7a336eeb3571d41c.mp3","die sonne gibt uns licht und wärme":"audio/speech/9235de7c6a7d67fe.mp3","was reimt sich auf haus? die antworten sind: baum, maus, oder buch":"audio/speech/0aacffe5ed49776e.mp3","sprich haus und dann jedes antwortwort laut":"audio/speech/f2e96c22be4a12b6.mp3","haus und maus klingen am ende gleich":"audio/speech/83cc0907988d8c75.mp3","wie viele silben hat „bal-lon“? die antworten sind: 1, 2, oder 3":"audio/speech/f4d9dbae1075f2db.mp3","klatsche bei jedem gesprochenen wortteil einmal":"audio/speech/512ff9e66a249ab8.mp3","klatsche mit: bal – lon. das sind zwei silben":"audio/speech/7b28ecf5683343b0.mp3","ergänze den fehlenden buchstaben: b _ u m die antworten sind: a, e, oder i":"audio/speech/de9849b98742f201.mp3","sprich baum langsam. welcher buchstabe fehlt nach dem b":"audio/speech/2b859688a2f0bbf4.mp3","b-a-u-m. zusammen wird daraus baum":"audio/speech/5d747bb25aa0c628.mp3","welches wort gehört zur gitarre? die antworten sind: backen, schwimmen, oder musik":"audio/speech/3d3a66d4805ad503.mp3","was machen die saiten, wenn du sie zupfst":"audio/speech/d58c169ae4e85d5c.mp3","eine gitarre ist ein musikinstrument":"audio/speech/2711a1167e35a214.mp3","lies: „die katze schläft auf dem sofa.“ wo schläft die katze? die antworten sind: im bett, auf dem sofa, oder im garten":"audio/speech/7814dffb77386fc9.mp3","suche im satz die wörter nach „schläft“":"audio/speech/4f130f07f1cdbfa4.mp3","im satz steht „auf dem sofa“. dort schläft die katze":"audio/speech/5d17835c471d7abb.mp3","ein buch, zwei …? die antworten sind: buchen, buche, oder bücher":"audio/speech/7556cea8f4a7c879.mp3","sprich: im regal stehen viele …":"audio/speech/9885139d07ca6b20.mp3","die mehrzahl von buch ist bücher":"audio/speech/7c7c8bbd4c1c6b0c.mp3","aus „tee“ und „tasse“ wird welches wort? die antworten sind: teetasse, teehaus, oder kaffeetasse":"audio/speech/cf9d6a075b5e9a36.mp3","setze die beiden wörter direkt hintereinander":"audio/speech/c2db75923615861a.mp3","tee + tasse = teetasse. zwei wörter bilden ein neues wort":"audio/speech/ac3b117d08177bd7.mp3","welches zeichen gehört ans ende: „wo ist die katze“? die antworten sind: ., !, oder ":"audio/speech/3fe24eba68a3307d.mp3","der satz möchte etwas wissen":"audio/speech/56e18e4d78d3e781.mp3","„wo ist die katze?“ ist eine frage und endet mit einem fragezeichen":"audio/speech/997b8a1862b43989.mp3","welches wort sagt, was jemand tut? die antworten sind: grün, gießen, oder gießkanne":"audio/speech/8b771f4f889d9948.mp3","du kannst sagen: ich … die pflanze":"audio/speech/fd0c00d479f69a83.mp3","gießen ist eine tätigkeit. ein solches wort nennt man verb":"audio/speech/035656e314a67434.mp3","welches wort beschreibt, wie ein kissen sein kann? die antworten sind: weich, kissen, oder sitzen":"audio/speech/32ac027df8ad514c.mp3","denke daran, wie sich ein kissen anfühlt":"audio/speech/562a9374f676958e.mp3","weich beschreibt eine eigenschaft. solche wörter heißen adjektive":"audio/speech/0a88842801aff9df.mp3","lies: „lumi gießt die pflanze. danach stellt sie die kanne ins regal.“ was tut lumi zuerst? die antworten sind: sie liest ein buch, sie gießt die pflanze, oder sie räumt das regal aus":"audio/speech/87297c6f11d70617.mp3","achte auf das wort „danach“":"audio/speech/457ce0927b8cdd53.mp3","das gießen steht vor „danach“. lumi gießt zuerst die pflanze":"audio/speech/54f9d95ff2ff6493.mp3","welches wort ist im satz „die katze springt auf das sofa“ das verb? die antworten sind: katze, sofa, oder springt":"audio/speech/907885eb84aac522.mp3","frage: was tut die katze":"audio/speech/d65c25436594a003.mp3","springt sagt, was die katze tut. es ist das verb":"audio/speech/f90c20f9de5f5ff5.mp3","welches wort gehört zur wortfamilie „spielen“? die antworten sind: spielplatz, schule, oder garten":"audio/speech/70092960eaefcdee.mp3","suche den gemeinsamen wortstamm":"audio/speech/e15ad5a482e7bc87.mp3","im wort spielplatz steckt der wortstamm „spiel“":"audio/speech/d83f5899f35786f8.mp3","welche steigerung passt: klein, kleiner, …? die antworten sind: kleinig, am kleinsten, oder kleinheit":"audio/speech/2c8ea5a122cacb75.mp3","die letzte form beginnt oft mit „am“":"audio/speech/67b39cee5894642a.mp3","klein – kleiner – am kleinsten sind die drei steigerungsformen":"audio/speech/3492d311298e29bf.mp3","welche form passt: „gestern … milo in den garten.“? die antworten sind: gehen, geht, oder ging":"audio/speech/718409b759de5e00.mp3","der satz erzählt, was schon passiert ist":"audio/speech/11aab36b147c267b.mp3","„gestern ging milo in den garten.“ verwendet eine vergangenheitsform":"audio/speech/d1459ac491061ca8.mp3","welches wort steht im wörterbuch zuerst: baum, buch oder blume? die antworten sind: baum, blume, oder buch":"audio/speech/9769fe3252291f54.mp3","vergleiche den zweiten buchstaben jedes wortes":"audio/speech/8d9e4c4ce648bd1c.mp3","alle beginnen mit b. beim zweiten buchstaben kommt a vor l und u":"audio/speech/63b1eb42046ea996.mp3","lumi sucht ihre kanne. milo sagt: „ich habe sie nach dem gießen unter das regal gestellt.“ wo sollte lumi suchen? die antworten sind: im kühlschrank, unter dem regal, oder auf dem sofa":"audio/speech/79ae9c25bbbafb47.mp3","suche nach der ortsangabe in milos satz":"audio/speech/3f09baa1b47b9a4e.mp3","milo nennt den ort ausdrücklich: unter dem regal":"audio/speech/efd12949e3704270.mp3","welches wort ist das subjekt im satz „krümel schläft auf dem sofa“? die antworten sind: schläft, sofa, oder krümel":"audio/speech/8c52dbfc214d4abf.mp3","frage nach „wer oder was?“":"audio/speech/5ca2c31a4c2f4a97.mp3","mit „wer schläft?“ fragst du nach dem subjekt: krümel":"audio/speech/31ae0469d7d64569.mp3","welches wort bedeutet ungefähr dasselbe wie „leise“? die antworten sind: still, schnell, oder hell":"audio/speech/83a11f9206d2fd8c.mp3","es geht um einen klang mit geringer lautstärke":"audio/speech/e647692792271c50.mp3","still und leise haben hier eine ähnliche bedeutung":"audio/speech/8a97bc094c66ff47.mp3","welches wort gehört nicht zur wortfamilie „lesen“? die antworten sind: leserin, leise, oder vorlesen":"audio/speech/eabea9395a1b4ee2.mp3","ähnlicher klang allein genügt nicht. vergleiche wortstamm und bedeutung":"audio/speech/57f65acf0a2f6371.mp3","leserin und vorlesen gehören zu lesen. „leise“ hat einen anderen wortstamm":"audio/speech/852f2602e3c37fde.mp3","welcher satz steht im futur? die antworten sind: milo spielte gitarre., milo spielt gitarre., oder milo wird gitarre spielen":"audio/speech/296f51efa7da3ca5.mp3","die zukunft kann mit „wird“ und einer grundform gebildet werden":"audio/speech/34826384ab00a7cb.mp3","„wird spielen“ ist die zukunftsform futur":"audio/speech/ee1b332765ccd44d.mp3","ein text erklärt schritt für schritt, wie man papier zu einem boot faltet. welche überschrift passt am besten? die antworten sind: so faltest du ein papierboot, unser garten im herbst, oder die schlafende katze":"audio/speech/92120302b88cc876.mp3","was soll jemand mit dieser anleitung herstellen können":"audio/speech/5faaaeda590e5b49.mp3","die passende überschrift nennt den inhalt der anleitung":"audio/speech/b21d8402b61d6206.mp3","tippe auf die sonne und verwandle den tag in eine nacht. wenn schon nacht ist, mache erst tag":"audio/speech/52427018adc97ffa.mp3","die sonne findest du draußen vor dem fenster":"audio/speech/f9671d3b0bcdc294.mp3","die spielwelt wurde dunkel. im echten leben entsteht nacht durch die drehung der erde":"audio/speech/76944bcc8b4883dc.mp3","ziehe die gießkanne zur monstera und tippe dann die gießkanne an":"audio/speech/a6678c4c1b26a132.mp3","die kanne muss nah bei der pflanze stehen. dann kannst du sie benutzen":"audio/speech/dfc0a9ecedee5f33.mp3","du hast der pflanze wasser gegeben. beobachte pflanzen auch im echten alltag gemeinsam mit erwachsenen":"audio/speech/13c779258fb472fb.mp3","welches paar hilft einer pflanze beim wachsen? die antworten sind: wasser & licht, limonade & dunkelheit, oder salz & eis":"audio/speech/01e18a3d42300c7a.mp3","überlege, wo eine pflanze gut wächst: hell oder dunkel":"audio/speech/3922ea8fddc1ef1b.mp3","pflanzen brauchen unter anderem wasser und licht zum wachsen":"audio/speech/a04fce55cccf0863.mp3","was kann aus einer regenwolke fallen? die antworten sind: watte, regentropfen, oder sand":"audio/speech/8d3c0275f548cd98.mp3","womit werden deine schuhe bei regen nass":"audio/speech/ae3046ad858f3ecb.mp3","bei regen fallen wassertropfen aus der wolke":"audio/speech/76ae94cbb98bccba.mp3","wo lebt ein fisch? die antworten sind: im wasser, auf einem baum, oder in einer trockenen schublade":"audio/speech/c8d4c193923f1eed.mp3","denke an einen teich oder einen fluss":"audio/speech/1315e4998df1169b.mp3","fische leben im wasser. ihr lebensraum muss zu ihnen passen":"audio/speech/63a5ba7b17dd2bf4.mp3","warum stellen wir frische milch in den kühlschrank? die antworten sind: für die farbe, damit sie singt, oder damit sie länger frisch bleibt":"audio/speech/ff7a705765ca4ae9.mp3","was ist im kühlschrank anders als im warmen zimmer":"audio/speech/89bddf55d3c9a9e7.mp3","im kühlschrank hält sich frische milch länger":"audio/speech/a798b9db39f11197.mp3","was machst du beim zähneputzen mit dem wasserhahn? die antworten sind: zudrehen, laufen lassen, oder ganz aufdrehen":"audio/speech/29170c8d0291e2c5.mp3","muss das wasser laufen, während du mit der bürste putzt":"audio/speech/5301776e058774f5.mp3","wenn du den hahn während des putzens zudrehst, sparst du wasser":"audio/speech/355c78369a8d3305.mp3","was folgt im täglichen wechsel auf den tag? die antworten sind: winter, nacht, oder sommer":"audio/speech/b67b869c8ce22ce8.mp3","nach dem abend wird es draußen dunkel":"audio/speech/6cb4451a232d7675.mp3","tag und nacht wechseln sich regelmäßig ab":"audio/speech/655f00e0dd241fb2.mp3","wie heißt wasser, wenn es gefroren ist? die antworten sind: dampf, eis, oder sand":"audio/speech/f3400c578c6a0c3e.mp3","denke an einen eiswürfel":"audio/speech/971ea9fc7005bb16.mp3","gefrorenes wasser ist fest und heißt eis":"audio/speech/3a06314b4868ddfb.mp3","mit welchem sinn nimmst du die musik aus dem radio wahr? die antworten sind: schmecken, riechen, oder hören":"audio/speech/529f8a0351f6d559.mp3","welchen körperteil brauchst du zum zuhören":"audio/speech/13b91909305a3122.mp3","mit dem hörsinn nimmst du klänge und geräusche wahr":"audio/speech/d7dbe8a1119fab06.mp3","wohin gehört ein sauberes, altes blatt papier beim mülltrennen? die antworten sind: altpapier, biomüll, oder glascontainer":"audio/speech/83acbf36b83a7ebe.mp3","überlege, aus welchem material das blatt besteht":"audio/speech/527d62a131c6c8f5.mp3","sauberes papier kann im altpapier gesammelt und wiederverwertet werden":"audio/speech/2b1dcace02ce3e30.mp3","milo und lumi wollen denselben platz. was hilft ihnen? die antworten sind: sich anschreien, ruhig absprechen und abwechseln, oder den anderen wegschubsen":"audio/speech/c089c39e28f59f39.mp3","welche lösung hört die wünsche von beiden an":"audio/speech/173dee4de33efacc.mp3","sie können miteinander sprechen und eine faire lösung finden":"audio/speech/556e537e1847aaf5.mp3","in welcher jahreszeit werden bei vielen heimischen laubbäumen die blätter bunt? die antworten sind: frühling, sommer, oder herbst":"audio/speech/f9d3ee2d733a76d9.mp3","welche jahreszeit liegt zwischen sommer und winter":"audio/speech/7b816e8a08847369.mp3","im herbst verfärben sich bei vielen laubbäumen die blätter und fallen ab":"audio/speech/f928eb7974121a38.mp3","warum wechseln sich tag und nacht ab? die antworten sind: die erde dreht sich, die sonne geht schlafen, oder der mond schaltet das licht aus":"audio/speech/bf0426f88d998b8a.mp3","stelle dir eine lampe und einen ball vor, den du langsam drehst":"audio/speech/80965bd1ffeabc74.mp3","die erde dreht sich. die seite, die zur sonne zeigt, hat tag":"audio/speech/2b68c3acee9a37f6.mp3","eine kleine pfütze verschwindet an einem warmen tag. was ist mit einem teil des wassers passiert? die antworten sind: er wurde zu stein, er ist verdunstet, oder er wurde zu papier":"audio/speech/be4679f291608e03.mp3","denke an wasser, das in die luft übergeht":"audio/speech/a98e7804c28c631b.mp3","ein teil des wassers ist als unsichtbarer wasserdampf in die luft gelangt":"audio/speech/b77823d48c6af2a9.mp3","du willst prüfen, ob licht einer pflanze hilft. was solltest du bei zwei ähnlichen pflanzen gleich halten? die antworten sind: nur die topffarbe, gar nichts, oder wassermenge und pflanzenart":"audio/speech/9571ddb12a861ffe.mp3","verändere möglichst nur die eigenschaft, die du untersuchen willst":"audio/speech/ac2bc226960db81c.mp3","wenn du nur das licht veränderst, sollte anderes möglichst gleich bleiben. so wird der vergleich aussagekräftiger":"audio/speech/69ac9dd365f9c4a5.mp3","warum brauchen fische ein zu ihrer art passendes aquarium? die antworten sind: weil platz und wasserbedingungen zu ihnen passen müssen, nur wegen der farbe, oder damit sie bücher lesen":"audio/speech/7b2ff98eaf3cbe15.mp3","denke an ausreichend platz und geeignetes wasser":"audio/speech/dacc0ff377bc5850.mp3","die bedingungen des lebensraums müssen zu den bedürfnissen der tiere passen":"audio/speech/9a7818b35f58b89c.mp3","was kann mit vielen abgestorbenen blättern auf einem kompost geschehen? die antworten sind: sie werden zu glas, sie werden von lebewesen zersetzt, oder sie bleiben immer unverändert":"audio/speech/e52eb34ff38decef.mp3","auf dem kompost sind auch kleine lebewesen und pilze aktiv":"audio/speech/1767440992927545.mp3","kleine lebewesen und pilze können abgestorbene pflanzenteile zersetzen. dabei entsteht nach und nach humusreiches material":"audio/speech/1cf3b82a33a76d6b.mp3","warum sollte man schmutziges pinselwasser nicht in einen bach kippen? die antworten sind: damit der bach bunter wird, weil pinsel schwimmen, oder weil es lebewesen und wasser belasten kann":"audio/speech/698712f048c43718.mp3","überlege, welche lebewesen im wasser leben":"audio/speech/91fa34802f06a11d.mp3","ein bach ist lebensraum. stoffe im pinselwasser können ihn belasten":"audio/speech/7653160eab4030cb.mp3","eure gruppe möchte die spielecke umgestalten. was hilft bei einer gemeinsamen entscheidung? die antworten sind: ideen anhören und gemeinsam abstimmen, nur die lauteste person entscheidet, oder niemand darf etwas sagen":"audio/speech/932a21702ce9136b.mp3","eine faire entscheidung gibt allen eine stimme":"audio/speech/d0162d27298e60be.mp3","alle können ideen äußern. danach könnt ihr gemeinsam entscheiden, wie ihr die ecke gestaltet":"audio/speech/8898cadf08d86842.mp3","ein globus wird von einer lampe beleuchtet. du drehst ihn langsam. welche seite hat im modell tag? die antworten sind: die von der lampe abgewandte, die von der lampe beleuchtete, oder immer nur die obere":"audio/speech/aeab539acf3f27ed.mp3","die lampe stellt die sonne dar":"audio/speech/641527781a96a52c.mp3","die beleuchtete seite steht für den tag. durch das drehen wechseln orte zwischen licht und schatten":"audio/speech/1813d10ca60e463a.mp3","welche reihenfolge beschreibt einen teil des wasserkreislaufs sinnvoll? die antworten sind: regen → stein → wolke, wolke → papier → meer, oder verdunsten → wolkenbildung → regen":"audio/speech/d02d4bad00402d83.mp3","wie gelangt wasser zuerst vom boden in die luft":"audio/speech/5f71e9c8f7cd3021.mp3","wasser verdunstet. es kann in wolken zu tröpfchen werden und als niederschlag zurückkehren":"audio/speech/b94888d704127644.mp3","auf einem plan ist norden oben. welche himmelsrichtung liegt dann rechts? die antworten sind: osten, westen, oder süden":"audio/speech/0f23fedde6c19f78.mp3","merke dir im uhrzeigersinn: norden, osten, süden, westen":"audio/speech/94f8f24d53c95926.mp3","wenn norden oben liegt, ist osten rechts und westen links":"audio/speech/4dcd6d540b18af01.mp3","warum ist es sinnvoll, beim verlassen eines leeren zimmers das licht auszuschalten? die antworten sind: damit die möbel wachsen, weil dann für die lampe keine unnötige elektrische energie verbraucht wird, oder damit es draußen heller wird":"audio/speech/20bdaf86f4fe19a5.mp3","frage dich, ob gerade jemand das licht nutzt":"audio/speech/a6486fe0af3485fc.mp3","wenn niemand das licht braucht, kann die ausgeschaltete lampe elektrische energie sparen":"audio/speech/af421b547efdcc28.mp3","eine pflanze wächst am fenster besser als im dunklen schrank. was ist eine passende vermutung? die antworten sind: pflanzen bestehen aus glas, pflanzen mögen nur schränke, oder licht kann ihr wachstum unterstützen":"audio/speech/ee5061719943bb46.mp3","welche bedingung unterscheidet fenster und dunklen schrank":"audio/speech/8c2dedd5b7c71a9e.mp3","die beobachtung passt zur vermutung, dass licht beim wachsen hilft. für einen vergleich sollten andere bedingungen ähnlich sein":"audio/speech/a23ac002cfef79ac.mp3","du kaufst jede woche ein. welche möglichkeit erzeugt im alltag meist weniger neue tragetaschen? die antworten sind: einen vorhandenen korb wiederverwenden, jedes mal mehrere neue tüten nehmen, oder jeden korb nach einem einkauf wegwerfen":"audio/speech/2c7a41753cd5f98b.mp3","was lässt sich wiederholt benutzen":"audio/speech/075e00fbd9bad95a.mp3","ein vorhandener korb kann immer wieder genutzt werden. so brauchst du weniger neue tragetaschen":"audio/speech/54c791a64ce8f78a.mp3","höre die zwei töne. welcher ist höher? die antworten sind: der erste, der zweite, oder beide gleich hoch":"audio/speech/42a5fa09858d886e.mp3","höre noch einmal und summ die beiden töne mit":"audio/speech/c849f8e697d4ae5e.mp3","der zweite ton klingt höher als der erste":"audio/speech/d52f583d0aa4391f.mp3","höre die zwei klänge. welcher ist leiser? die antworten sind: der erste, der zweite, oder beide gleich laut":"audio/speech/5178797e0bae07ff.mp3","achte auf die stärke des klangs, nicht auf seine höhe":"audio/speech/91162c798e49423b.mp3","der erste klang ist leiser. die tonhöhe bleibt dabei gleich":"audio/speech/46a3c15435e6f539.mp3","wie viele klopfklänge hörst du? die antworten sind: 1, 2, oder 3":"audio/speech/b55888334c882554.mp3","hebe bei jedem gehörten klopfen einen finger":"audio/speech/8cb9aa585de28aa2.mp3","du hörst zwei klopfklänge. du kannst bei jedem einen finger heben":"audio/speech/bb43c6baccbff0fb.mp3","höre zwei gruppen mit je drei tönen. welche gruppe ist schneller? die antworten sind: die erste, beide gleich schnell, oder die zweite":"audio/speech/11cd96aa82f9c1de.mp3","vergleiche die pausen zwischen den tönen":"audio/speech/af32100e39d51967.mp3","in der zweiten gruppe liegen die töne dichter beieinander. das tempo ist schneller":"audio/speech/ad36a023deef5040.mp3","was bringst du bei einer gitarre zum klingen? die antworten sind: saiten, tasten, oder wasser":"audio/speech/be6e8ab97e31f3c4.mp3","denke an die dünnen gespannten fäden auf der gitarre":"audio/speech/f153d87919d80a33.mp3","beim zupfen schwingen die saiten der gitarre und erzeugen töne":"audio/speech/ce710ea8a1ee5486.mp3","wie kannst du ohne instrument einen rhythmus machen? die antworten sind: nur schauen, in die hände klatschen, oder ein bild ansehen":"audio/speech/38a8c5d58d499ca4.mp3","welche bewegung macht selbst ein geräusch":"audio/speech/e0aac2f40cf64f0d.mp3","mit klatschen, stampfen oder schnipsen kann dein körper rhythmen spielen":"audio/speech/142fed9f95bee7d4.mp3","höre die drei töne. wie verändert sich die tonhöhe? die antworten sind: sie bleibt gleich, sie wird tiefer, oder sie wird höher":"audio/speech/75a7138b547579e6.mp3","summ den ersten ton und folge dann der tonfolge":"audio/speech/f690c041707c517d.mp3","jeder ton klingt etwas tiefer als der vorherige":"audio/speech/7542d5e7db756d5f.mp3","wie viele klopfklänge hörst du diesmal? die antworten sind: 3, 5, oder 4":"audio/speech/d6327f31abe6878f.mp3","zähle mit den fingern bei jedem klang weiter":"audio/speech/c65f716f06d8ed45.mp3","in dieser hörprobe sind es vier einzelne klopfklänge":"audio/speech/3109f0e891da5db8.mp3","höre zwei tonfolgen. sind sie gleich oder verschieden? die antworten sind: gleich, verschieden, oder es gibt nur einen ton":"audio/speech/901911926c7bb506.mp3","vergleiche die reihenfolge der töne in beiden gruppen":"audio/speech/1cb8dd7c0224eca3.mp3","beide tonfolgen bestehen aus denselben drei tönen in derselben reihenfolge":"audio/speech/f621448f9257d8ca.mp3","welcher der beiden töne klingt länger? die antworten sind: der erste, beide gleich lang, oder der zweite":"audio/speech/66ad2d563ddb7224.mp3","achte darauf, wann jeder ton wieder aufhört":"audio/speech/544df6c21f39e872.mp3","der zweite ton dauert länger. beide haben dieselbe tonhöhe":"audio/speech/1f323e1b1d505778.mp3","was bedeutet eine pause beim musizieren? die antworten sind: immer lauter spielen, für eine zeit nicht spielen, oder so schnell wie möglich spielen":"audio/speech/d316c1b54ad0072f.mp3","denke an den stillen moment zwischen zwei klängen":"audio/speech/e7b69e3c685311e2.mp3","in einer pause setzt der klang aus. auch stille gehört zur musik":"audio/speech/f60b0ad5e8bc169a.mp3","du willst „lang – kurz – kurz“ klatschen. welche folge passt? die antworten sind: — · ·, · — ·, oder · · —":"audio/speech/b0d36a4f4c2f94c0.mp3","beginne mit dem langen zeichen und füge zwei kurze an":"audio/speech/6f64b428e8df7156.mp3","ein langer klang und zwei kurze klänge passen zu „lang – kurz – kurz“. probiere es aus":"audio/speech/5ea2428e4199d3b4.mp3","welche farbe zeigt der blaue kreis? die antworten sind: rot, blau, oder gelb":"audio/speech/049277fb59d4842c.mp3","vergleiche die farbe des kreises mit dem himmel":"audio/speech/50018c4bffd53b46.mp3","der kreis ist blau. schau dich um: wo findest du blau in deiner welt":"audio/speech/6ee5d346849e5654.mp3","du mischst rote und gelbe wasserfarbe. welche farbe entsteht meistens? die antworten sind: grün, orange, oder blau":"audio/speech/2f5995cf59d7204a.mp3","denke an die farbe einer reifen orange":"audio/speech/ffcb5af95c8052cd.mp3","aus roter und gelber wasserfarbe kannst du orange mischen":"audio/speech/160da56be3349240.mp3","aus welchem material bestehen die seiten eines gewöhnlichen buches? die antworten sind: holzklötzen, glas, oder papier":"audio/speech/5f0dce3b222b5ca9.mp3","welches material lässt sich gut zu einer seite umblättern":"audio/speech/1baa1925bf9f55cd.mp3","buchseiten bestehen meist aus papier. papier lässt sich falten und bemalen":"audio/speech/56f1135d49f102c6.mp3","mit welchem werkzeug kannst du gut eine linie zeichnen? die antworten sind: bleistift, teetasse, oder kissen":"audio/speech/ac680a0c8eab02d4.mp3","welches werkzeug hinterlässt beim ziehen eine schmale spur":"audio/speech/c4f224863f2badf0.mp3","mit einem bleistift kannst du linien und formen zeichnen":"audio/speech/5087d6b5c795508e.mp3","wie viele ecken hat ein dreieck? die antworten sind: 4, 3, oder 0":"audio/speech/376a585d1929c681.mp3","zähle die stellen, an denen sich zwei seiten treffen":"audio/speech/d0742c91661dd1f1.mp3","ein dreieck hat drei ecken. fahre sie mit dem finger in der luft nach":"audio/speech/31767fd02bd3bbe3.mp3","du möchtest alle blätter nach ihrer farbe ordnen. welche gruppe passt zusammen? die antworten sind: rot, blau, gelb, nur grüne blätter, oder blatt, stein, tasse":"audio/speech/2324c74a15b6d5b2.mp3","gesucht ist eine gemeinsame farbe":"audio/speech/a355b26f1ecc46de.mp3","nur grüne blätter gehören zur gleichen farbgruppe. danach kannst du ein bild daraus legen":"audio/speech/7e5d089951392121.mp3","du mischst blaue und gelbe wasserfarbe. welche farbe entsteht meistens? die antworten sind: violett, orange, oder grün":"audio/speech/71f8be044fe06c9f.mp3","denke an das grün der pflanzen in deiner welt":"audio/speech/b0781d8e5370ec10.mp3","blau und gelb lassen sich zu grün mischen. probiere verschiedene mengen aus":"audio/speech/9188971b61447606.mp3","du mischst rote und blaue wasserfarbe. welche farbe entsteht meistens? die antworten sind: violett, grün, oder gelb":"audio/speech/beafce034e0d47ea.mp3","die farbe liegt zwischen rot und blau":"audio/speech/d753ca96a85efff8.mp3","rot und blau lassen sich zu violett mischen":"audio/speech/a1c5f441fe826f71.mp3","du klebst papierstücke, blätter und bilder auf ein blatt. wie heißt so ein bild? die antworten sind: melodie, collage, oder kühlschrank":"audio/speech/412be4ce9520bb5b.mp3","die stücke werden gesammelt, ausgesucht und zusammengeklebt":"audio/speech/44dfd448fd4542ec.mp3","eine collage entsteht, wenn du verschiedene stücke zu einem neuen bild zusammenfügst":"audio/speech/162baa715137ed7e.mp3","du möchtest dein eingerichtetes zimmer als bild festhalten. was hilft dir? die antworten sind: gießkanne, kissen, oder kamera":"audio/speech/a1bdaa40a78fbab6.mp3","welches gerät nimmt ein foto auf":"audio/speech/1b79b6f642461930.mp3","eine kamera kann ein foto aufnehmen. du entscheidest, welcher ausschnitt zu sehen ist":"audio/speech/b78c000173affa9c.mp3","was brauchst du, damit ein gegenstand einen deutlichen schatten auf die wand wirft? die antworten sind: eine lichtquelle, musik, oder einen weichen teppich":"audio/speech/3d90c16b9949c4ba.mp3","denke an eine lampe und deine hand davor":"audio/speech/95779f458556bd36.mp3","wenn der gegenstand licht abschirmt, entsteht dahinter ein schatten":"audio/speech/3a54d4331b80a91c.mp3","du möchtest ein kleines modellhaus bauen. welche materialien eignen sich dafür? die antworten sind: nur musik, karton und kleber, oder nur licht":"audio/speech/186165a9e85d9d51.mp3","welche materialien kannst du schneiden, falten und verbinden":"audio/speech/f7c2d142275712f3.mp3","aus karton und kleber kannst du ein modellhaus bauen und selbst gestalten":"audio/speech/098c85db9492abaf.mp3","du suchst ein bild von einem dachs. was suchst du? die antworten sind: dachs, irgendwas, oder 123":"audio/speech/c488a94e9ec3edd4.mp3","überlege: was ist freundlich, sicher und hilft beim lernen":"audio/speech/5846521be8e9c68c.mp3","eine genaue suche passt zu deiner frage":"audio/speech/3acbc3f2780d3dbc.mp3","du weißt nicht, ob ein tierbild stimmt. wer kann helfen? die antworten sind: ein erwachsener schaut mit dir nach., du glaubst alles., oder du rätst einfach":"audio/speech/bee4a78fe06d11e0.mp3","frage nach und prüfe informationen gemeinsam":"audio/speech/d04e375d5977bc55.mp3","lumi hat ein bild gemalt. was schreibst du freundlich? die antworten sind: dein bild gefällt mir!, das ist blöd!, oder geh weg":"audio/speech/e6623a315b395e58.mp3","freundliche, genaue rückmeldungen helfen beim gemeinsamen lernen":"audio/speech/e4a1522c141db061.mp3","du willst ein foto von milo zeigen. was tust du zuerst? die antworten sind: alle sofort schicken., milo vorher fragen., oder seinen namen ändern":"audio/speech/d1c83dd198e8f9cd.mp3","frage die abgebildeten menschen vor dem teilen um erlaubnis":"audio/speech/bb880eb514cb82ef.mp3","du möchtest eine kleine geschichte aufnehmen. was brauchst du? die antworten sind: ein mikrofon., einen löffel., oder einen schuh":"audio/speech/a0013b81a8ee04b0.mp3","mit einem plan und dem passenden werkzeug wird deine idee verständlich":"audio/speech/cbdfa94e8d77af42.mp3","du malst am tablet ein bild. was hilft, es wiederzufinden? die antworten sind: sofort alles löschen., das tablet verstecken., oder das bild mit einem passenden namen speichern":"audio/speech/0d43123ff73030b5.mp3","ein passender dateiname hilft dir beim wiederfinden":"audio/speech/f25d823eb2287dee.mp3","ein fremder mensch fragt im spiel nach deiner adresse. was tust du? die antworten sind: ich gebe sie nicht weiter und hole hilfe., ich schicke meine adresse., oder ich verrate auch mein passwort":"audio/speech/c5b673ccdde186a5.mp3","private daten bleiben privat. vertraute erwachsene können helfen":"audio/speech/e6d6a3db69c733e0.mp3","deine augen sind müde vom bildschirm. was hilft? die antworten sind: noch näher an den bildschirm gehen., eine pause und bewegung., oder einfach immer weiterspielen":"audio/speech/e4ccfb203b754037.mp3","pausen und bewegung gehören zu einem guten umgang mit medien":"audio/speech/e2a4112628e7807f.mp3","der ton ist aus. was prüfst du zuerst? die antworten sind: ob die lautstärke aus ist., ob das fenster offen ist., oder ob du einen stift hast":"audio/speech/03cf5079b815ec60.mp3","prüfe zuerst einfache einstellungen. hole dir hilfe, wenn du nicht weiterkommst":"audio/speech/ea6aa2561f7929b2.mp3","du willst ein bild malen und behalten. was kommt zuerst? die antworten sind: malen, dann speichern., löschen, dann schließen., oder speichern, ohne etwas zu malen":"audio/speech/d6c736f47d84d8b8.mp3","eine sinnvolle reihenfolge macht aufgaben leichter":"audio/speech/9ed71dcec4aeac8a.mp3","ein bunter knopf sagt: jetzt kaufen! was machst du? die antworten sind: sofort kaufen., erst einen erwachsenen fragen., oder so oft wie möglich tippen":"audio/speech/2ccfabde91fa2a63.mp3","werbung möchte zum kaufen anregen. nimm dir zeit und frage nach":"audio/speech/8a093599fe6eab7c.mp3","im video fliegt ein elefant. muss das echt sein? die antworten sind: ja, jedes video ist echt., ja, wenn es bunt ist., oder nein, bilder und videos können verändert sein":"audio/speech/c9fad152b815d998.mp3","bilder können erfunden oder verändert sein. prüfe, bevor du etwas glaubst":"audio/speech/5b856eb2dbd00e47.mp3","welche suchanfrage hilft für einen steckbrief über die nahrung des dachses? die antworten sind: dachs nahrung steckbrief, lustig, oder tiere alles":"audio/speech/ba395a4617c336f6.mp3","zwei webseiten nennen verschiedene fakten. was hilft? die antworten sind: die erste seite hat immer recht., die fakten in weiteren verlässlichen quellen prüfen., oder die bunteste seite wählen":"audio/speech/5928e8458b1ba226.mp3","wie gibst du hilfreiches feedback zu einer digitalen geschichte? die antworten sind: du kannst gar nichts., das ende gefällt mir. den anfang könntest du erklären., oder ich lache dich aus":"audio/speech/216e5bd30ef8e27e.mp3","du möchtest ein gruppenfoto im klassenchat teilen. was ist wichtig? die antworten sind: alle abgebildeten personen um erlaubnis bitten., einfach hochladen., oder nur die datei umbenennen":"audio/speech/7fede9074f47c20e.mp3","du planst eine tonaufnahme für einen tier-steckbrief. was hilft zuerst? die antworten sind: einen kurzen text und einen aufnahmeplan., möglichst laute musik., oder viele unbekannte dateien":"audio/speech/66bf966fb9f3a99f.mp3","wie findest du deine digitale zeichnung nächste woche wieder? die antworten sind: jede datei gleich nennen., gar nicht speichern., oder im passenden ordner mit erkennbarem namen speichern":"audio/speech/f18bcd76794dd45d.mp3","ein unbekannter chatkontakt fragt nach deiner schule und adresse. was tust du? die antworten sind: ich teile die daten nicht und spreche mit einer vertrauten person., ich schicke alle daten., oder ich treffe die person allein":"audio/speech/ac0ffbc3d9030648.mp3","du spielst schon länger und merkst, dass du müde wirst. was hilft? die antworten sind: die müdigkeit ignorieren., eine bildschirmpause, bewegung und ein blick in die ferne., oder die bildschirmhelligkeit ganz hochstellen":"audio/speech/55b80c5b64ed578e.mp3","du hörst bei einer lernaufnahme nichts. was prüfst du zuerst? die antworten sind: ob ton und lautstärke eingeschaltet sind., ob du alle dateien löschen kannst., oder ob der bildschirm bunt ist":"audio/speech/9c359bc660fecc89.mp3","welche reihenfolge hilft beim erstellen einer digitalen zeichnung? die antworten sind: löschen, schließen, suchen., datei öffnen, gestalten, speichern., oder ausschalten, malen, öffnen":"audio/speech/3b4fc1789805c472.mp3","ein spiel verspricht einen preis, wenn du etwas kaufst. was ist klug? die antworten sind: erst prüfen, ob werbung und kosten dahinterstecken., sofort bezahlen., oder dein passwort eingeben":"audio/speech/523d237ce2faf206.mp3","ein sehr echtes bild zeigt etwas unglaubliches. was gilt? die antworten sind: alles im internet ist wahr., nur fotos sind immer wahr., oder bilder können bearbeitet oder mit ki erzeugt sein":"audio/speech/5c10d78a831616eb.mp3","hallo, schön dass du da bist. wollen wir spielen":"audio/speech/e478dbe974c818ee.mp3","wo steckt der dachs":"audio/speech/7e2da0b7cf826e57.mp3","du hast mich aber schnell gefunden":"audio/speech/6c7cfa9ec34d4986.mp3","gefunden! wer zieht hier ein":"audio/speech/6cfd52490947f172.mp3","schau dich um. fass alles an":"audio/speech/d3d261cdb7fc00b8.mp3","findest du das sofa":"audio/speech/f39e107e7cb59712.mp3","willkommen! such dir etwas aus":"audio/speech/b0dd78f372c550b0.mp3","was gefällt dir noch":"audio/speech/6ab01eb0ffd246a0.mp3","für ein rätsel gibt’s sterne. machst du mit":"audio/speech/28564d594b47899f.mp3","komm, wir sammeln sterne! was möchtest du spielen":"audio/speech/ee4cd584352616e0.mp3","geschafft! das haben wir toll gemacht":"audio/speech/d78ab881ac29ced2.mp3","schön, dass du da bist! ich schenke dir heute 25 sterne. magst du mit einem rätsel noch mehr verdienen":"audio/speech/bc4f924ede693228.mp3","hallo! magst du mit mir eine aufgabe lösen und sterne sammeln":"audio/speech/ff19741eb10da7d2.mp3","deine welt wartet auf dich. viel spaß beim spielen":"audio/speech/dca94fcfeadb39e5.mp3","die antworten sind":"audio/speech/2a1f047cf3437da5.mp3","zähle mit den fingern oder lege kleine gegenstände dazu":"audio/speech/ed5d00860354a1a9.mp3","nimm die kleinere zahl schrittweise weg":"audio/speech/125aded3997c59c2.mp3","zerlege die zahlen in kleinere schritte":"audio/speech/919f6443186b9caa.mp3","samen und":"audio/speech/b34f69ba26815e38.mp3","samen kommen in ein beet. wie viele sind es":"audio/speech/ef77e50332cd3093.mp3","bücher stehen im regal":"audio/speech/429537684155d0bc.mp3","kommen dazu. wie viele sind es":"audio/speech/e577eae658d4807c.mp3","von":"audio/speech/43ce6022b9318e93.mp3","blumen werden":"audio/speech/a1b7eeacad2b0f9b.mp3","verschenkt. wie viele bleiben":"audio/speech/4e5931bdf80cc406.mp3","für dein projekt sind":"audio/speech/3374314a787e4cf8.mp3","steine da":"audio/speech/a08573c3da2bb720.mp3","kisten enthalten je":"audio/speech/3367d2e2e96b195b.mp3","bausteine. wie viele sind es zusammen":"audio/speech/aa834d847b935429.mp3","das ergebnis ist":"audio/speech/b5451871614e9ee1.mp3","erkläre, wie du gerechnet hast":"audio/speech/297e1fd8f626f935.mp3"},"tasks":{"garden-seeds":"audio/speech/424e64d2e2ad2424.mp3","world-left":"audio/speech/eb99df81978e6a65.mp3","numbers0":"audio/speech/91921fe9dc0dd178.mp3","numbers1":"audio/speech/c4bd70af073f04e3.mp3","numbers2":"audio/speech/5bb56964d299749f.mp3","math-circle":"audio/speech/5cdfaa567cace943.mp3","math-share-six":"audio/speech/07c05bb252e1ea00.mp3","numbers5":"audio/speech/bf0ebcfba8f94795.mp3","numbers6":"audio/speech/b1be2449df2fc8f6.mp3","numbers7":"audio/speech/69a9d6d0f77b13ce.mp3","numbers8":"audio/speech/471fdf34b9448b6d.mp3","numbers9":"audio/speech/26b414aae917e014.mp3","numbers3":"audio/speech/64155e39e3a7597b.mp3","numbers11":"audio/speech/883cd0dc12b223bd.mp3","g3-numbers-0":"audio/speech/8740d97eb2648666.mp3","g3-numbers-1":"audio/speech/0e6a5e35873409db.mp3","g3-numbers-2":"audio/speech/6cffcb4f0827c1c7.mp3","g3-numbers-3":"audio/speech/5a033f6179299a2c.mp3","g3-numbers-4":"audio/speech/b49fa29d23431b6a.mp3","g3-numbers-5":"audio/speech/3f2a1b7a223c3711.mp3","g4-numbers-0":"audio/speech/8c48cffa56f8ab5c.mp3","g4-numbers-1":"audio/speech/899c33c3de543121.mp3","g4-numbers-2":"audio/speech/fbc3fe8f0a048843.mp3","g4-numbers-3":"audio/speech/487fcecd92c775bd.mp3","g4-numbers-4":"audio/speech/f051529419353c07.mp3","g4-numbers-5":"audio/speech/ffa83e7344e77029.mp3","word-memory":"audio/speech/533f73577fec8990.mp3","world-tea":"audio/speech/d0af50d915226d4a.mp3","words0":"audio/speech/01352bd434f65871.mp3","words1":"audio/speech/c99eaeffdfae0061.mp3","words2":"audio/speech/0aacffe5ed49776e.mp3","words3":"audio/speech/f4d9dbae1075f2db.mp3","words4":"audio/speech/de9849b98742f201.mp3","words5":"audio/speech/3d3a66d4805ad503.mp3","words6":"audio/speech/7814dffb77386fc9.mp3","words7":"audio/speech/7556cea8f4a7c879.mp3","words8":"audio/speech/cf9d6a075b5e9a36.mp3","words9":"audio/speech/3fe24eba68a3307d.mp3","words10":"audio/speech/8b771f4f889d9948.mp3","words11":"audio/speech/32ac027df8ad514c.mp3","g3-words-0":"audio/speech/87297c6f11d70617.mp3","g3-words-1":"audio/speech/907885eb84aac522.mp3","g3-words-2":"audio/speech/70092960eaefcdee.mp3","g3-words-3":"audio/speech/2c8ea5a122cacb75.mp3","g3-words-4":"audio/speech/718409b759de5e00.mp3","g3-words-5":"audio/speech/9769fe3252291f54.mp3","g4-words-0":"audio/speech/79ae9c25bbbafb47.mp3","g4-words-1":"audio/speech/8c52dbfc214d4abf.mp3","g4-words-2":"audio/speech/83a11f9206d2fd8c.mp3","g4-words-3":"audio/speech/eabea9395a1b4ee2.mp3","g4-words-4":"audio/speech/296f51efa7da3ca5.mp3","g4-words-5":"audio/speech/92120302b88cc876.mp3","world-night":"audio/speech/52427018adc97ffa.mp3","world-water":"audio/speech/a6678c4c1b26a132.mp3","nature0":"audio/speech/01e18a3d42300c7a.mp3","science-rain":"audio/speech/8d3c0275f548cd98.mp3","science-fish-home":"audio/speech/c8d4c193923f1eed.mp3","nature3":"audio/speech/ff7a705765ca4ae9.mp3","nature4":"audio/speech/29170c8d0291e2c5.mp3","science-day-after":"audio/speech/b67b869c8ce22ce8.mp3","nature6":"audio/speech/f3400c578c6a0c3e.mp3","nature7":"audio/speech/529f8a0351f6d559.mp3","nature8":"audio/speech/83acbf36b83a7ebe.mp3","nature9":"audio/speech/c089c39e28f59f39.mp3","nature10":"audio/speech/f9d3ee2d733a76d9.mp3","nature5":"audio/speech/bf0426f88d998b8a.mp3","g3-nature-0":"audio/speech/be4679f291608e03.mp3","g3-nature-1":"audio/speech/9571ddb12a861ffe.mp3","g3-nature-2":"audio/speech/7b2ff98eaf3cbe15.mp3","g3-nature-3":"audio/speech/e52eb34ff38decef.mp3","g3-nature-4":"audio/speech/698712f048c43718.mp3","g3-nature-5":"audio/speech/932a21702ce9136b.mp3","g4-nature-0":"audio/speech/aeab539acf3f27ed.mp3","g4-nature-1":"audio/speech/d02d4bad00402d83.mp3","g4-nature-2":"audio/speech/0f23fedde6c19f78.mp3","g4-nature-3":"audio/speech/20bdaf86f4fe19a5.mp3","g4-nature-4":"audio/speech/ee5061719943bb46.mp3","g4-nature-5":"audio/speech/2c7a41753cd5f98b.mp3","music0":"audio/speech/42a5fa09858d886e.mp3","music1":"audio/speech/5178797e0bae07ff.mp3","music2":"audio/speech/b55888334c882554.mp3","music3":"audio/speech/11cd96aa82f9c1de.mp3","music4":"audio/speech/be6e8ab97e31f3c4.mp3","music5":"audio/speech/38a8c5d58d499ca4.mp3","music6":"audio/speech/75a7138b547579e6.mp3","music7":"audio/speech/d6327f31abe6878f.mp3","music8":"audio/speech/901911926c7bb506.mp3","music9":"audio/speech/66ad2d563ddb7224.mp3","music10":"audio/speech/d316c1b54ad0072f.mp3","music11":"audio/speech/b0d36a4f4c2f94c0.mp3","art0":"audio/speech/049277fb59d4842c.mp3","art1":"audio/speech/2f5995cf59d7204a.mp3","art2":"audio/speech/5f0dce3b222b5ca9.mp3","art3":"audio/speech/ac680a0c8eab02d4.mp3","art4":"audio/speech/376a585d1929c681.mp3","art5":"audio/speech/2324c74a15b6d5b2.mp3","art6":"audio/speech/71f8be044fe06c9f.mp3","art7":"audio/speech/beafce034e0d47ea.mp3","art8":"audio/speech/412be4ce9520bb5b.mp3","art9":"audio/speech/a1bdaa40a78fbab6.mp3","art10":"audio/speech/3d90c16b9949c4ba.mp3","art11":"audio/speech/186165a9e85d9d51.mp3","media-0-0":"audio/speech/c488a94e9ec3edd4.mp3","media-0-1":"audio/speech/bee4a78fe06d11e0.mp3","media-0-2":"audio/speech/e6623a315b395e58.mp3","media-0-3":"audio/speech/d1c83dd198e8f9cd.mp3","media-0-4":"audio/speech/a0013b81a8ee04b0.mp3","media-0-5":"audio/speech/0d43123ff73030b5.mp3","media-0-6":"audio/speech/c5b673ccdde186a5.mp3","media-0-7":"audio/speech/e4ccfb203b754037.mp3","media-0-8":"audio/speech/03cf5079b815ec60.mp3","media-0-9":"audio/speech/d6c736f47d84d8b8.mp3","media-0-10":"audio/speech/2ccfabde91fa2a63.mp3","media-0-11":"audio/speech/c9fad152b815d998.mp3","media-1-0":"audio/speech/ba395a4617c336f6.mp3","media-1-1":"audio/speech/5928e8458b1ba226.mp3","media-1-2":"audio/speech/216e5bd30ef8e27e.mp3","media-1-3":"audio/speech/7fede9074f47c20e.mp3","media-1-4":"audio/speech/66bf966fb9f3a99f.mp3","media-1-5":"audio/speech/f18bcd76794dd45d.mp3","media-1-6":"audio/speech/ac0ffbc3d9030648.mp3","media-1-7":"audio/speech/55b80c5b64ed578e.mp3","media-1-8":"audio/speech/9c359bc660fecc89.mp3","media-1-9":"audio/speech/3b4fc1789805c472.mp3","media-1-10":"audio/speech/523d237ce2faf206.mp3","media-1-11":"audio/speech/5c10d78a831616eb.mp3"},"numbers":{"0":"audio/speech/5feceb66ffc86f38.mp3","1":"audio/speech/6b86b273ff34fce1.mp3","2":"audio/speech/d4735e3a265e16ee.mp3","3":"audio/speech/4e07408562bedb8b.mp3","4":"audio/speech/4b227777d4dd1fc6.mp3","5":"audio/speech/ef2d127de37b942b.mp3","6":"audio/speech/e7f6c011776e8db7.mp3","7":"audio/speech/7902699be42c8a8e.mp3","8":"audio/speech/2c624232cdd22177.mp3","9":"audio/speech/19581e27de7ced00.mp3","10":"audio/speech/4a44dc15364204a8.mp3","11":"audio/speech/4fc82b26aecb47d2.mp3","12":"audio/speech/6b51d431df5d7f14.mp3","13":"audio/speech/3fdba35f04dc8c46.mp3","14":"audio/speech/8527a891e2241369.mp3","15":"audio/speech/e629fa6598d73276.mp3","16":"audio/speech/b17ef6d19c7a5b1e.mp3","17":"audio/speech/4523540f1504cd17.mp3","18":"audio/speech/4ec9599fc203d176.mp3","19":"audio/speech/9400f1b21cb527d7.mp3","20":"audio/speech/f5ca38f748a1d6ea.mp3","21":"audio/speech/6f4b6612125fb3a0.mp3","22":"audio/speech/785f3ec7eb32f30b.mp3","23":"audio/speech/535fa30d7e25dd8a.mp3","24":"audio/speech/c2356069e9d1e79c.mp3","25":"audio/speech/b7a56873cd771f2c.mp3","26":"audio/speech/5f9c4ab08cac7457.mp3","27":"audio/speech/670671cd97404156.mp3","28":"audio/speech/59e19706d51d39f6.mp3","29":"audio/speech/35135aaa6cc23891.mp3","30":"audio/speech/624b60c58c9d8bfb.mp3","31":"audio/speech/eb1e33e8a81b697b.mp3","32":"audio/speech/e29c9c180c6279b0.mp3","33":"audio/speech/c6f3ac57944a5314.mp3","34":"audio/speech/86e5014965866131.mp3","35":"audio/speech/9f14025af0065b30.mp3","36":"audio/speech/76a50887d8f1c2e9.mp3","37":"audio/speech/7a61b53701befdae.mp3","38":"audio/speech/aea92132c4cbeb26.mp3","39":"audio/speech/0b918943df0962bc.mp3","40":"audio/speech/d59eced1ded07f84.mp3","41":"audio/speech/3d914f9348c9cc0f.mp3","42":"audio/speech/73475cb40a568e8d.mp3","43":"audio/speech/44cb730c420480a0.mp3","44":"audio/speech/71ee45a3c0db9a98.mp3","45":"audio/speech/811786ad1ae74adf.mp3","46":"audio/speech/25fc0e7096fc6537.mp3","47":"audio/speech/31489056e0916d59.mp3","48":"audio/speech/98010bd9270f9b10.mp3","49":"audio/speech/0e17daca5f3e175f.mp3","50":"audio/speech/1a6562590ef19d10.mp3","51":"audio/speech/031b4af5197ec30a.mp3","52":"audio/speech/41cfc0d1f2d127b0.mp3","53":"audio/speech/2858dcd1057d3eae.mp3","54":"audio/speech/2fca346db6561871.mp3","55":"audio/speech/02d20bbd7e394ad5.mp3","56":"audio/speech/7688b6ef52555962.mp3","57":"audio/speech/c837649cce43f272.mp3","58":"audio/speech/6208ef0f7750c111.mp3","59":"audio/speech/3e1e967e9b793e90.mp3","60":"audio/speech/39fa9ec190eee7b6.mp3","61":"audio/speech/d029fa3a95e174a1.mp3","62":"audio/speech/81b8a03f97e8787c.mp3","63":"audio/speech/da4ea2a5506f2693.mp3","64":"audio/speech/a68b412c4282555f.mp3","65":"audio/speech/108c995b953c8a35.mp3","66":"audio/speech/3ada92f28b4ceda3.mp3","67":"audio/speech/49d180ecf5613281.mp3","68":"audio/speech/a21855da08cb102d.mp3","69":"audio/speech/c75cb66ae28d8ebc.mp3","70":"audio/speech/ff5a1ae012afa5d4.mp3","71":"audio/speech/7f2253d7e228b22a.mp3","72":"audio/speech/8722616204217edd.mp3","73":"audio/speech/96061e92f58e4bdc.mp3","74":"audio/speech/eb624dbe56eb6620.mp3","75":"audio/speech/f369cb89fc627e66.mp3","76":"audio/speech/f74efabef12ea619.mp3","77":"audio/speech/a88a7902cb4ef697.mp3","78":"audio/speech/349c41201b62db85.mp3","79":"audio/speech/98a3ab7c340e8a03.mp3","80":"audio/speech/48449a14a4ff7d79.mp3","81":"audio/speech/5316ca1c5ddca8e6.mp3","82":"audio/speech/a46e37632fa6ca51.mp3","83":"audio/speech/bbb965ab0c80d653.mp3","84":"audio/speech/44c8031cb036a735.mp3","85":"audio/speech/b4944c6ff08dc6f4.mp3","86":"audio/speech/434c9b5ae514646b.mp3","87":"audio/speech/bdd2d3af3a5a1213.mp3","88":"audio/speech/8b940be7fb78aaa6.mp3","89":"audio/speech/cd70bea023f752a0.mp3","90":"audio/speech/69f59c273b6e669a.mp3","91":"audio/speech/1da51b8d8ff98f6a.mp3","92":"audio/speech/8241649609f88ccd.mp3","93":"audio/speech/6e4001871c0cf27c.mp3","94":"audio/speech/e3d6c4d4599e0088.mp3","95":"audio/speech/ad48ff99415b2f00.mp3","96":"audio/speech/7b1a278f5abe8e9d.mp3","97":"audio/speech/d6d824abba4afde8.mp3","98":"audio/speech/29db0c6782dbd500.mp3","99":"audio/speech/8c1f1046219ddd21.mp3","100":"audio/speech/ad57366865126e55.mp3","200":"audio/speech/27badc983df1780b.mp3","300":"audio/speech/983bd614bb5afece.mp3","400":"audio/speech/26d228663f13a885.mp3","500":"audio/speech/0604cd3138feed20.mp3","600":"audio/speech/284b7e6d788f363f.mp3","700":"audio/speech/99ee50221221864d.mp3","800":"audio/speech/1a1cf797fabe7f95.mp3","900":"audio/speech/bdc5d8a48c238979.mp3"},"assets":["audio/speech/424e64d2e2ad2424.mp3","audio/speech/d2a6de51f86c46ad.mp3","audio/speech/033c302a6d08c2e0.mp3","audio/speech/eb99df81978e6a65.mp3","audio/speech/aa27888e544a7f7b.mp3","audio/speech/aa90685dadb31b3f.mp3","audio/speech/91921fe9dc0dd178.mp3","audio/speech/14dc9767f5735424.mp3","audio/speech/58e1b17e0e2e0dfa.mp3","audio/speech/c4bd70af073f04e3.mp3","audio/speech/ef7b5d1079da317f.mp3","audio/speech/37ac0042345c6591.mp3","audio/speech/5bb56964d299749f.mp3","audio/speech/6b2f1ec8363842e1.mp3","audio/speech/32f3d63d43a95b35.mp3","audio/speech/5cdfaa567cace943.mp3","audio/speech/a0b3c985d69ca922.mp3","audio/speech/0da5d4cf47340771.mp3","audio/speech/07c05bb252e1ea00.mp3","audio/speech/33f6522b6e2e7bde.mp3","audio/speech/aa87be21a8000c40.mp3","audio/speech/bf0ebcfba8f94795.mp3","audio/speech/6d5e7f0cf06358e2.mp3","audio/speech/3ed6f500b960c60c.mp3","audio/speech/b1be2449df2fc8f6.mp3","audio/speech/cb38c2544a4f96d8.mp3","audio/speech/0d716bc9a66ad59b.mp3","audio/speech/69a9d6d0f77b13ce.mp3","audio/speech/491a2f7a2548fcb1.mp3","audio/speech/17a08f38d831f5b4.mp3","audio/speech/471fdf34b9448b6d.mp3","audio/speech/e3cf35b5fffc3f03.mp3","audio/speech/820361006089d7c8.mp3","audio/speech/26b414aae917e014.mp3","audio/speech/0ee763482b178c7a.mp3","audio/speech/f352c8b9d460840a.mp3","audio/speech/64155e39e3a7597b.mp3","audio/speech/22dffd13b483ec66.mp3","audio/speech/15b6865f6e0dfe6d.mp3","audio/speech/883cd0dc12b223bd.mp3","audio/speech/32cfde7b8471cbd1.mp3","audio/speech/b46c8a2868310b9b.mp3","audio/speech/8740d97eb2648666.mp3","audio/speech/b419b489c82d6ad1.mp3","audio/speech/a8505acf6d91ad55.mp3","audio/speech/0e6a5e35873409db.mp3","audio/speech/72816e10fc412d53.mp3","audio/speech/4d145efeda5eb68e.mp3","audio/speech/6cffcb4f0827c1c7.mp3","audio/speech/08f6949a8a68f51d.mp3","audio/speech/202d689eb8a49983.mp3","audio/speech/5a033f6179299a2c.mp3","audio/speech/2153e6c435525a27.mp3","audio/speech/d53824686d375d3e.mp3","audio/speech/b49fa29d23431b6a.mp3","audio/speech/2d66521306da3b79.mp3","audio/speech/582a3a85bf2fa34d.mp3","audio/speech/3f2a1b7a223c3711.mp3","audio/speech/042f0b6e4185a4a7.mp3","audio/speech/aa614caed7352014.mp3","audio/speech/8c48cffa56f8ab5c.mp3","audio/speech/0414bac8b694c61e.mp3","audio/speech/f0d688acc1d03b5e.mp3","audio/speech/899c33c3de543121.mp3","audio/speech/12081cfb23bdf18a.mp3","audio/speech/426a6783f2333d73.mp3","audio/speech/fbc3fe8f0a048843.mp3","audio/speech/f8fd6242f8e6722b.mp3","audio/speech/5a99dfd27c3a648b.mp3","audio/speech/487fcecd92c775bd.mp3","audio/speech/4450823cc3936f9c.mp3","audio/speech/378d2c9e90ea6593.mp3","audio/speech/f051529419353c07.mp3","audio/speech/b127ce142f263048.mp3","audio/speech/375508cb17e9d13a.mp3","audio/speech/ffa83e7344e77029.mp3","audio/speech/148a20fe94248762.mp3","audio/speech/f59817559561ba6c.mp3","audio/speech/533f73577fec8990.mp3","audio/speech/ff8969f242f0d0ef.mp3","audio/speech/0bf0a31223effcdf.mp3","audio/speech/d0af50d915226d4a.mp3","audio/speech/7f706c99ec28db4c.mp3","audio/speech/c6e4d59c5f97416d.mp3","audio/speech/01352bd434f65871.mp3","audio/speech/8498fec6d3f34ad8.mp3","audio/speech/dbc8f7f84a15fcf6.mp3","audio/speech/c99eaeffdfae0061.mp3","audio/speech/7a336eeb3571d41c.mp3","audio/speech/9235de7c6a7d67fe.mp3","audio/speech/0aacffe5ed49776e.mp3","audio/speech/f2e96c22be4a12b6.mp3","audio/speech/83cc0907988d8c75.mp3","audio/speech/f4d9dbae1075f2db.mp3","audio/speech/512ff9e66a249ab8.mp3","audio/speech/7b28ecf5683343b0.mp3","audio/speech/de9849b98742f201.mp3","audio/speech/2b859688a2f0bbf4.mp3","audio/speech/5d747bb25aa0c628.mp3","audio/speech/3d3a66d4805ad503.mp3","audio/speech/d58c169ae4e85d5c.mp3","audio/speech/2711a1167e35a214.mp3","audio/speech/7814dffb77386fc9.mp3","audio/speech/4f130f07f1cdbfa4.mp3","audio/speech/5d17835c471d7abb.mp3","audio/speech/7556cea8f4a7c879.mp3","audio/speech/9885139d07ca6b20.mp3","audio/speech/7c7c8bbd4c1c6b0c.mp3","audio/speech/cf9d6a075b5e9a36.mp3","audio/speech/c2db75923615861a.mp3","audio/speech/ac3b117d08177bd7.mp3","audio/speech/3fe24eba68a3307d.mp3","audio/speech/56e18e4d78d3e781.mp3","audio/speech/997b8a1862b43989.mp3","audio/speech/8b771f4f889d9948.mp3","audio/speech/fd0c00d479f69a83.mp3","audio/speech/035656e314a67434.mp3","audio/speech/32ac027df8ad514c.mp3","audio/speech/562a9374f676958e.mp3","audio/speech/0a88842801aff9df.mp3","audio/speech/87297c6f11d70617.mp3","audio/speech/457ce0927b8cdd53.mp3","audio/speech/54f9d95ff2ff6493.mp3","audio/speech/907885eb84aac522.mp3","audio/speech/d65c25436594a003.mp3","audio/speech/f90c20f9de5f5ff5.mp3","audio/speech/70092960eaefcdee.mp3","audio/speech/e15ad5a482e7bc87.mp3","audio/speech/d83f5899f35786f8.mp3","audio/speech/2c8ea5a122cacb75.mp3","audio/speech/67b39cee5894642a.mp3","audio/speech/3492d311298e29bf.mp3","audio/speech/718409b759de5e00.mp3","audio/speech/11aab36b147c267b.mp3","audio/speech/d1459ac491061ca8.mp3","audio/speech/9769fe3252291f54.mp3","audio/speech/8d9e4c4ce648bd1c.mp3","audio/speech/63b1eb42046ea996.mp3","audio/speech/79ae9c25bbbafb47.mp3","audio/speech/3f09baa1b47b9a4e.mp3","audio/speech/efd12949e3704270.mp3","audio/speech/8c52dbfc214d4abf.mp3","audio/speech/5ca2c31a4c2f4a97.mp3","audio/speech/31ae0469d7d64569.mp3","audio/speech/83a11f9206d2fd8c.mp3","audio/speech/e647692792271c50.mp3","audio/speech/8a97bc094c66ff47.mp3","audio/speech/eabea9395a1b4ee2.mp3","audio/speech/57f65acf0a2f6371.mp3","audio/speech/852f2602e3c37fde.mp3","audio/speech/296f51efa7da3ca5.mp3","audio/speech/34826384ab00a7cb.mp3","audio/speech/ee1b332765ccd44d.mp3","audio/speech/92120302b88cc876.mp3","audio/speech/5faaaeda590e5b49.mp3","audio/speech/b21d8402b61d6206.mp3","audio/speech/52427018adc97ffa.mp3","audio/speech/f9671d3b0bcdc294.mp3","audio/speech/76944bcc8b4883dc.mp3","audio/speech/a6678c4c1b26a132.mp3","audio/speech/dfc0a9ecedee5f33.mp3","audio/speech/13c779258fb472fb.mp3","audio/speech/01e18a3d42300c7a.mp3","audio/speech/3922ea8fddc1ef1b.mp3","audio/speech/a04fce55cccf0863.mp3","audio/speech/8d3c0275f548cd98.mp3","audio/speech/ae3046ad858f3ecb.mp3","audio/speech/76ae94cbb98bccba.mp3","audio/speech/c8d4c193923f1eed.mp3","audio/speech/1315e4998df1169b.mp3","audio/speech/63a5ba7b17dd2bf4.mp3","audio/speech/ff7a705765ca4ae9.mp3","audio/speech/89bddf55d3c9a9e7.mp3","audio/speech/a798b9db39f11197.mp3","audio/speech/29170c8d0291e2c5.mp3","audio/speech/5301776e058774f5.mp3","audio/speech/355c78369a8d3305.mp3","audio/speech/b67b869c8ce22ce8.mp3","audio/speech/6cb4451a232d7675.mp3","audio/speech/655f00e0dd241fb2.mp3","audio/speech/f3400c578c6a0c3e.mp3","audio/speech/971ea9fc7005bb16.mp3","audio/speech/3a06314b4868ddfb.mp3","audio/speech/529f8a0351f6d559.mp3","audio/speech/13b91909305a3122.mp3","audio/speech/d7dbe8a1119fab06.mp3","audio/speech/83acbf36b83a7ebe.mp3","audio/speech/527d62a131c6c8f5.mp3","audio/speech/2b1dcace02ce3e30.mp3","audio/speech/c089c39e28f59f39.mp3","audio/speech/173dee4de33efacc.mp3","audio/speech/556e537e1847aaf5.mp3","audio/speech/f9d3ee2d733a76d9.mp3","audio/speech/7b816e8a08847369.mp3","audio/speech/f928eb7974121a38.mp3","audio/speech/bf0426f88d998b8a.mp3","audio/speech/80965bd1ffeabc74.mp3","audio/speech/2b68c3acee9a37f6.mp3","audio/speech/be4679f291608e03.mp3","audio/speech/a98e7804c28c631b.mp3","audio/speech/b77823d48c6af2a9.mp3","audio/speech/9571ddb12a861ffe.mp3","audio/speech/ac2bc226960db81c.mp3","audio/speech/69ac9dd365f9c4a5.mp3","audio/speech/7b2ff98eaf3cbe15.mp3","audio/speech/dacc0ff377bc5850.mp3","audio/speech/9a7818b35f58b89c.mp3","audio/speech/e52eb34ff38decef.mp3","audio/speech/1767440992927545.mp3","audio/speech/1cf3b82a33a76d6b.mp3","audio/speech/698712f048c43718.mp3","audio/speech/91fa34802f06a11d.mp3","audio/speech/7653160eab4030cb.mp3","audio/speech/932a21702ce9136b.mp3","audio/speech/d0162d27298e60be.mp3","audio/speech/8898cadf08d86842.mp3","audio/speech/aeab539acf3f27ed.mp3","audio/speech/641527781a96a52c.mp3","audio/speech/1813d10ca60e463a.mp3","audio/speech/d02d4bad00402d83.mp3","audio/speech/5f71e9c8f7cd3021.mp3","audio/speech/b94888d704127644.mp3","audio/speech/0f23fedde6c19f78.mp3","audio/speech/94f8f24d53c95926.mp3","audio/speech/4dcd6d540b18af01.mp3","audio/speech/20bdaf86f4fe19a5.mp3","audio/speech/a6486fe0af3485fc.mp3","audio/speech/af421b547efdcc28.mp3","audio/speech/ee5061719943bb46.mp3","audio/speech/8c2dedd5b7c71a9e.mp3","audio/speech/a23ac002cfef79ac.mp3","audio/speech/2c7a41753cd5f98b.mp3","audio/speech/075e00fbd9bad95a.mp3","audio/speech/54c791a64ce8f78a.mp3","audio/speech/42a5fa09858d886e.mp3","audio/speech/c849f8e697d4ae5e.mp3","audio/speech/d52f583d0aa4391f.mp3","audio/speech/5178797e0bae07ff.mp3","audio/speech/91162c798e49423b.mp3","audio/speech/46a3c15435e6f539.mp3","audio/speech/b55888334c882554.mp3","audio/speech/8cb9aa585de28aa2.mp3","audio/speech/bb43c6baccbff0fb.mp3","audio/speech/11cd96aa82f9c1de.mp3","audio/speech/af32100e39d51967.mp3","audio/speech/ad36a023deef5040.mp3","audio/speech/be6e8ab97e31f3c4.mp3","audio/speech/f153d87919d80a33.mp3","audio/speech/ce710ea8a1ee5486.mp3","audio/speech/38a8c5d58d499ca4.mp3","audio/speech/e0aac2f40cf64f0d.mp3","audio/speech/142fed9f95bee7d4.mp3","audio/speech/75a7138b547579e6.mp3","audio/speech/f690c041707c517d.mp3","audio/speech/7542d5e7db756d5f.mp3","audio/speech/d6327f31abe6878f.mp3","audio/speech/c65f716f06d8ed45.mp3","audio/speech/3109f0e891da5db8.mp3","audio/speech/901911926c7bb506.mp3","audio/speech/1cb8dd7c0224eca3.mp3","audio/speech/f621448f9257d8ca.mp3","audio/speech/66ad2d563ddb7224.mp3","audio/speech/544df6c21f39e872.mp3","audio/speech/1f323e1b1d505778.mp3","audio/speech/d316c1b54ad0072f.mp3","audio/speech/e7b69e3c685311e2.mp3","audio/speech/f60b0ad5e8bc169a.mp3","audio/speech/b0d36a4f4c2f94c0.mp3","audio/speech/6f64b428e8df7156.mp3","audio/speech/5ea2428e4199d3b4.mp3","audio/speech/049277fb59d4842c.mp3","audio/speech/50018c4bffd53b46.mp3","audio/speech/6ee5d346849e5654.mp3","audio/speech/2f5995cf59d7204a.mp3","audio/speech/ffcb5af95c8052cd.mp3","audio/speech/160da56be3349240.mp3","audio/speech/5f0dce3b222b5ca9.mp3","audio/speech/1baa1925bf9f55cd.mp3","audio/speech/56f1135d49f102c6.mp3","audio/speech/ac680a0c8eab02d4.mp3","audio/speech/c4f224863f2badf0.mp3","audio/speech/5087d6b5c795508e.mp3","audio/speech/376a585d1929c681.mp3","audio/speech/d0742c91661dd1f1.mp3","audio/speech/31767fd02bd3bbe3.mp3","audio/speech/2324c74a15b6d5b2.mp3","audio/speech/a355b26f1ecc46de.mp3","audio/speech/7e5d089951392121.mp3","audio/speech/71f8be044fe06c9f.mp3","audio/speech/b0781d8e5370ec10.mp3","audio/speech/9188971b61447606.mp3","audio/speech/beafce034e0d47ea.mp3","audio/speech/d753ca96a85efff8.mp3","audio/speech/a1c5f441fe826f71.mp3","audio/speech/412be4ce9520bb5b.mp3","audio/speech/44dfd448fd4542ec.mp3","audio/speech/162baa715137ed7e.mp3","audio/speech/a1bdaa40a78fbab6.mp3","audio/speech/1b79b6f642461930.mp3","audio/speech/b78c000173affa9c.mp3","audio/speech/3d90c16b9949c4ba.mp3","audio/speech/95779f458556bd36.mp3","audio/speech/3a54d4331b80a91c.mp3","audio/speech/186165a9e85d9d51.mp3","audio/speech/f7c2d142275712f3.mp3","audio/speech/098c85db9492abaf.mp3","audio/speech/c488a94e9ec3edd4.mp3","audio/speech/5846521be8e9c68c.mp3","audio/speech/3acbc3f2780d3dbc.mp3","audio/speech/bee4a78fe06d11e0.mp3","audio/speech/d04e375d5977bc55.mp3","audio/speech/e6623a315b395e58.mp3","audio/speech/e4a1522c141db061.mp3","audio/speech/d1c83dd198e8f9cd.mp3","audio/speech/bb880eb514cb82ef.mp3","audio/speech/a0013b81a8ee04b0.mp3","audio/speech/cbdfa94e8d77af42.mp3","audio/speech/0d43123ff73030b5.mp3","audio/speech/f25d823eb2287dee.mp3","audio/speech/c5b673ccdde186a5.mp3","audio/speech/e6d6a3db69c733e0.mp3","audio/speech/e4ccfb203b754037.mp3","audio/speech/e2a4112628e7807f.mp3","audio/speech/03cf5079b815ec60.mp3","audio/speech/ea6aa2561f7929b2.mp3","audio/speech/d6c736f47d84d8b8.mp3","audio/speech/9ed71dcec4aeac8a.mp3","audio/speech/2ccfabde91fa2a63.mp3","audio/speech/8a093599fe6eab7c.mp3","audio/speech/c9fad152b815d998.mp3","audio/speech/5b856eb2dbd00e47.mp3","audio/speech/ba395a4617c336f6.mp3","audio/speech/5928e8458b1ba226.mp3","audio/speech/216e5bd30ef8e27e.mp3","audio/speech/7fede9074f47c20e.mp3","audio/speech/66bf966fb9f3a99f.mp3","audio/speech/f18bcd76794dd45d.mp3","audio/speech/ac0ffbc3d9030648.mp3","audio/speech/55b80c5b64ed578e.mp3","audio/speech/9c359bc660fecc89.mp3","audio/speech/3b4fc1789805c472.mp3","audio/speech/523d237ce2faf206.mp3","audio/speech/5c10d78a831616eb.mp3","audio/speech/e478dbe974c818ee.mp3","audio/speech/7e2da0b7cf826e57.mp3","audio/speech/6c7cfa9ec34d4986.mp3","audio/speech/6cfd52490947f172.mp3","audio/speech/d3d261cdb7fc00b8.mp3","audio/speech/f39e107e7cb59712.mp3","audio/speech/b0dd78f372c550b0.mp3","audio/speech/6ab01eb0ffd246a0.mp3","audio/speech/28564d594b47899f.mp3","audio/speech/ee4cd584352616e0.mp3","audio/speech/d78ab881ac29ced2.mp3","audio/speech/bc4f924ede693228.mp3","audio/speech/ff19741eb10da7d2.mp3","audio/speech/dca94fcfeadb39e5.mp3","audio/speech/2a1f047cf3437da5.mp3","audio/speech/ed5d00860354a1a9.mp3","audio/speech/125aded3997c59c2.mp3","audio/speech/919f6443186b9caa.mp3","audio/speech/b34f69ba26815e38.mp3","audio/speech/ef77e50332cd3093.mp3","audio/speech/429537684155d0bc.mp3","audio/speech/e577eae658d4807c.mp3","audio/speech/43ce6022b9318e93.mp3","audio/speech/a1b7eeacad2b0f9b.mp3","audio/speech/4e5931bdf80cc406.mp3","audio/speech/3374314a787e4cf8.mp3","audio/speech/a08573c3da2bb720.mp3","audio/speech/3367d2e2e96b195b.mp3","audio/speech/aa834d847b935429.mp3","audio/speech/b5451871614e9ee1.mp3","audio/speech/297e1fd8f626f935.mp3","audio/speech/5feceb66ffc86f38.mp3","audio/speech/6b86b273ff34fce1.mp3","audio/speech/d4735e3a265e16ee.mp3","audio/speech/4e07408562bedb8b.mp3","audio/speech/4b227777d4dd1fc6.mp3","audio/speech/ef2d127de37b942b.mp3","audio/speech/e7f6c011776e8db7.mp3","audio/speech/7902699be42c8a8e.mp3","audio/speech/2c624232cdd22177.mp3","audio/speech/19581e27de7ced00.mp3","audio/speech/4a44dc15364204a8.mp3","audio/speech/4fc82b26aecb47d2.mp3","audio/speech/6b51d431df5d7f14.mp3","audio/speech/3fdba35f04dc8c46.mp3","audio/speech/8527a891e2241369.mp3","audio/speech/e629fa6598d73276.mp3","audio/speech/b17ef6d19c7a5b1e.mp3","audio/speech/4523540f1504cd17.mp3","audio/speech/4ec9599fc203d176.mp3","audio/speech/9400f1b21cb527d7.mp3","audio/speech/f5ca38f748a1d6ea.mp3","audio/speech/6f4b6612125fb3a0.mp3","audio/speech/785f3ec7eb32f30b.mp3","audio/speech/535fa30d7e25dd8a.mp3","audio/speech/c2356069e9d1e79c.mp3","audio/speech/b7a56873cd771f2c.mp3","audio/speech/5f9c4ab08cac7457.mp3","audio/speech/670671cd97404156.mp3","audio/speech/59e19706d51d39f6.mp3","audio/speech/35135aaa6cc23891.mp3","audio/speech/624b60c58c9d8bfb.mp3","audio/speech/eb1e33e8a81b697b.mp3","audio/speech/e29c9c180c6279b0.mp3","audio/speech/c6f3ac57944a5314.mp3","audio/speech/86e5014965866131.mp3","audio/speech/9f14025af0065b30.mp3","audio/speech/76a50887d8f1c2e9.mp3","audio/speech/7a61b53701befdae.mp3","audio/speech/aea92132c4cbeb26.mp3","audio/speech/0b918943df0962bc.mp3","audio/speech/d59eced1ded07f84.mp3","audio/speech/3d914f9348c9cc0f.mp3","audio/speech/73475cb40a568e8d.mp3","audio/speech/44cb730c420480a0.mp3","audio/speech/71ee45a3c0db9a98.mp3","audio/speech/811786ad1ae74adf.mp3","audio/speech/25fc0e7096fc6537.mp3","audio/speech/31489056e0916d59.mp3","audio/speech/98010bd9270f9b10.mp3","audio/speech/0e17daca5f3e175f.mp3","audio/speech/1a6562590ef19d10.mp3","audio/speech/031b4af5197ec30a.mp3","audio/speech/41cfc0d1f2d127b0.mp3","audio/speech/2858dcd1057d3eae.mp3","audio/speech/2fca346db6561871.mp3","audio/speech/02d20bbd7e394ad5.mp3","audio/speech/7688b6ef52555962.mp3","audio/speech/c837649cce43f272.mp3","audio/speech/6208ef0f7750c111.mp3","audio/speech/3e1e967e9b793e90.mp3","audio/speech/39fa9ec190eee7b6.mp3","audio/speech/d029fa3a95e174a1.mp3","audio/speech/81b8a03f97e8787c.mp3","audio/speech/da4ea2a5506f2693.mp3","audio/speech/a68b412c4282555f.mp3","audio/speech/108c995b953c8a35.mp3","audio/speech/3ada92f28b4ceda3.mp3","audio/speech/49d180ecf5613281.mp3","audio/speech/a21855da08cb102d.mp3","audio/speech/c75cb66ae28d8ebc.mp3","audio/speech/ff5a1ae012afa5d4.mp3","audio/speech/7f2253d7e228b22a.mp3","audio/speech/8722616204217edd.mp3","audio/speech/96061e92f58e4bdc.mp3","audio/speech/eb624dbe56eb6620.mp3","audio/speech/f369cb89fc627e66.mp3","audio/speech/f74efabef12ea619.mp3","audio/speech/a88a7902cb4ef697.mp3","audio/speech/349c41201b62db85.mp3","audio/speech/98a3ab7c340e8a03.mp3","audio/speech/48449a14a4ff7d79.mp3","audio/speech/5316ca1c5ddca8e6.mp3","audio/speech/a46e37632fa6ca51.mp3","audio/speech/bbb965ab0c80d653.mp3","audio/speech/44c8031cb036a735.mp3","audio/speech/b4944c6ff08dc6f4.mp3","audio/speech/434c9b5ae514646b.mp3","audio/speech/bdd2d3af3a5a1213.mp3","audio/speech/8b940be7fb78aaa6.mp3","audio/speech/cd70bea023f752a0.mp3","audio/speech/69f59c273b6e669a.mp3","audio/speech/1da51b8d8ff98f6a.mp3","audio/speech/8241649609f88ccd.mp3","audio/speech/6e4001871c0cf27c.mp3","audio/speech/e3d6c4d4599e0088.mp3","audio/speech/ad48ff99415b2f00.mp3","audio/speech/7b1a278f5abe8e9d.mp3","audio/speech/d6d824abba4afde8.mp3","audio/speech/29db0c6782dbd500.mp3","audio/speech/8c1f1046219ddd21.mp3","audio/speech/ad57366865126e55.mp3","audio/speech/27badc983df1780b.mp3","audio/speech/983bd614bb5afece.mp3","audio/speech/26d228663f13a885.mp3","audio/speech/0604cd3138feed20.mp3","audio/speech/284b7e6d788f363f.mp3","audio/speech/99ee50221221864d.mp3","audio/speech/1a1cf797fabe7f95.mp3","audio/speech/bdc5d8a48c238979.mp3"]};
const normalize=text=>String(text||'').replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'').toLocaleLowerCase('de-DE');let serial=0,current,settle;
function stop(){serial++;if(current){current.pause();current=null}settle?.(false);settle=null}
function number(n){n=Number(n);if(!Number.isInteger(n)||n<0||n>999)return [];if(bank.numbers[n])return [bank.numbers[n]];const h=Math.floor(n/100)*100;return h?[bank.numbers[h],...number(n-h)]:[]}
function parts(text){const direct=bank.clips[normalize(text)];if(direct)return [direct];const result=[];for(const part of String(text).split(/(\d+)/)){if(!part.trim()||/^[.,!?;: ]+$/.test(part))continue;if(/^\d+$/.test(part)){const ns=number(part);if(!ns.length)return [];result.push(...ns)}else{const f=bank.clips[normalize(part)];if(!f)return [];result.push(f)}}return result}
async function play(files){stop();if(!files.length||document.hidden||window.WorldSound?.status?.enabled===false)return false;const run=serial;for(const file of files){if(run!==serial)return false;const ok=await new Promise(resolve=>{settle=resolve;current=new Audio(file);current.volume=window.WorldSound?.status?.volume??.6;current.onended=()=>resolve(true);current.onerror=()=>resolve(false);current.play().catch(()=>resolve(false))});if(!ok||run!==serial){if(run===serial){current=null;settle=null}return false}}current=null;settle=null;return true}
function speak(text){const files=parts(text);if(!files.length){window.dispatchEvent(new CustomEvent('speech-missing',{detail:{text:String(text)}}));return Promise.resolve(false)}return play(files)}
function task(q){if(!q)return Promise.resolve(false);const file=bank.tasks[q[7]?.id];if(file)return play([file]);const question=parts(q[2]);if(!question.length)return speak(q[2]);const answers=q[3].flatMap(a=>number(a));return play([...question,...(answers.length?[bank.clips[normalize('Die Antworten sind.')],...answers]:[])])}
window.LerndachsSpeech={speak,task,stop,has:text=>parts(text).length>0,get recordingCount(){return bank.assets.length},get playing(){return !!current}};
window.addEventListener('world-saved',()=>{if(window.WorldSound?.status?.enabled===false)stop();else if(current)current.volume=WorldSound?.status?.volume??.6});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
})();

;
/* Lerndachs class-based learning journey and in-world activities. */
(()=>{
const badger=`<svg viewBox="-76 -139 152 145" aria-hidden="true">${WorldArt.badger('portrait')}</svg>`;
for(const selector of ['.badger-icon','.brand-badger'])document.querySelector(selector).innerHTML=badger;
const {paths,sources}=LerndachsCurriculum,grades=LerndachsGrades,J=LerndachsJourney,progress=J.profile;
const dialog=document.querySelector('#learning-dialog'),content=document.querySelector('#learning-content'),strip=document.querySelector('#quest-strip');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let mode='world',correct=false,pendingGrade=progress.grade,afterGrade,sampleTimer,memoryTimer,memoryCards=[],memoryOpen=[],memoryBusy=false,gardenCount=0,worldAttemptDone=false;
const tasksFor=p=>p.items.filter(q=>q[7].grades.includes(progress.grade));
const active=()=>progress.active==='practice'?{id:'practice',title:'Deine Übungswerkstatt',items:[progress.practiceQuestion],color:'yellow'}:paths.find(p=>p.id===progress.active);
const currentTasks=()=>progress.active==='practice'?[progress.practiceQuestion]:active()?tasksFor(active()):[];
const currentTask=()=>currentTasks()[progress.index];
const taskKey=q=>['garden','memory'].includes(q[7].type)?q[7].id+'-g'+progress.grade:q[7].id;
const finished=q=>progress.done.includes(taskKey(q));
function persist(){J.save()}
function stopSample(){clearTimeout(sampleTimer);window.WorldSound?.stopSample?.()}
function cleanup(){dialog.classList.remove('task-complete');stopSample();clearTimeout(memoryTimer);window.LerndachsSpeech?.stop()}
function reveal(){if(!dialog.open)dialog.showModal();dialog.scrollTop=0}
function close(){cleanup();dialog.close();mode='world';if(progress.active)seek()}
function resetStrip(){strip.hidden=true;document.querySelector('#adventure-button').hidden=false}
function updateHUD(){
 const g=grades[progress.grade];document.querySelector('#grade-label').textContent=g?g.label:'';
 const b=document.querySelector('#adventure-button');b.querySelector('small').textContent='';
 b.querySelector('strong').textContent='Sterne sammeln';b.querySelector('em').textContent='Ein Rätsel mit Dachs';
}
window.addEventListener('world-saved',updateHUD);
function chooseGrade(next){
 cleanup();mode='grades';afterGrade=next;pendingGrade=progress.grade;document.querySelector('#panel').close();
 content.innerHTML=`<div class="class-intro"><div class="guide-face">${badger}</div><h2 id="learn-title">In welche Klasse gehst du?</h2><div class="class-grid" role="group" aria-label="Klasse auswählen">${Object.entries(grades).map(([id,g])=>`<button data-grade="${id}" aria-pressed="${pendingGrade===Number(id)}"><span>${id==='0'?'✿':id}</span><strong>${g.label}</strong></button>`).join('')}</div><button id="confirm-grade" class="journey-primary" ${pendingGrade===null?'disabled':''}>Los geht’s!</button></div>`;
 document.querySelector('#learn-close').hidden=false;reveal();
}
function starter(){window.dispatchEvent(new Event('request-opening'))}

function targetCard(){const i=J.catalogue.find(i=>i.id===progress.target);if(!i)return '';const balance=Lernwelt.snapshot().balance,remaining=Math.max(0,i.price-balance);return `<div class="target-card"><div class="target-art">${J.preview(i,WorldArt.homes.some(h=>h.id===i.id))}</div><div><small>DEIN NÄCHSTES ZIEL</small><strong>${escape(i.name)}</strong><span>${balance} / ${i.price} Sterne · ${remaining?`noch ${Math.ceil(remaining/15)} neue Aufgaben`:'Du hast genug Sterne!'}</span><progress max="${i.price||1}" value="${Math.min(balance,i.price)}" aria-label="Sterne für dein Sparziel"></progress></div><button id="target-shop">${remaining?'Laden':'Holen'} →</button></div>`}
function open(){if(!progress.starterUnlocked||progress.opening!=='done'){starter();return}if(progress.grade===null){chooseGrade(()=>Learning.nextFresh(true));return}cleanup();document.querySelector('#panel').close();mode='menu';menu();reveal()}
const partnerInvitation='Komm, wir sammeln Sterne!';
function readPartnerInvitation(){LerndachsSpeech.speak(partnerInvitation+' Was möchtest du spielen?')}
function invite(){
 if(!progress.starterUnlocked){starter();return}
 cleanup();document.querySelector('#panel').close();mode='menu';document.querySelector('#learn-close').hidden=false;
 const labels={numbers:'Rechnen',words:'Lesen',nature:'Natur',music:'Musik',art:'Farben',media:'Medien'};
 content.innerHTML=`<div class="learn-intro partner-intro"><div class="guide-face">${badger}</div><h2 id="learn-title">${partnerInvitation}</h2><p>Was möchtest du spielen?</p>${!!window.LerndachsSpeech?`<button id="read-partner" class="task-icon" aria-label="Vorlesen">${icon('sound')}</button>`:''}</div><div class="path-grid partner-paths">${paths.map(p=>`<button class="learning-path ${p.color}" data-path="${p.id}"><span class="path-symbol" aria-hidden="true">${p.icon}</span><strong>${labels[p.id]}</strong></button>`).join('')}</div>`;
 reveal();if(!!window.LerndachsSpeech&&WorldSound.status.enabled)readPartnerInvitation();
}

function menu(){
 cleanup();mode='menu';document.querySelector('#learn-close').hidden=false;
 const eligible=paths.flatMap(tasksFor),n=eligible.filter(finished).length;
 content.innerHTML=`<div class="learn-intro"><div class="guide-face">${badger}</div><h2 id="learn-title">Was möchtest du spielen?</h2><p>Für jedes neue Rätsel gibt’s 15 Sterne.</p><div class="discovery-count">${n} / ${eligible.length} Aufgaben für ${grades[progress.grade].label} entdeckt</div></div>${targetCard()}<div class="journey-options"><button id="together-toggle" aria-pressed="${progress.together}">${progress.together?'✓ Wir spielen zu zweit':'♡ Gemeinsam spielen'}</button></div>${progress.together?'<p class="together-note">Ein Gerät, zwei Ideen: Eine Person spielt, die andere erklärt oder hilft. Nach einer neuen gelösten Aufgabe tauscht ihr die Rollen.</p>':''}<div class="path-grid">${paths.map(p=>{
 const tasks=tasksFor(p),count=tasks.filter(finished).length;return `<button class="learning-path ${p.color}" data-path="${p.id}"><span class="path-symbol">${p.icon}</span><strong>${({numbers:"Rechnen",words:"Lesen",nature:"Natur",music:"Musik",art:"Farben",media:"Medien"})[p.id]||p.title}</strong><span>${({numbers:"Zählen und rechnen.",words:"Wörter lesen und schreiben.",nature:"Tiere und Natur entdecken.",music:"Hören und Musik machen.",art:"Farben und Formen entdecken.",media:"Mit Handy und Computer sicher umgehen."})[p.id]||p.desc}</span><div class="path-dots">${Array.from({length:tasks.length},(_,i)=>`<i class="${i<count?'done':''}"></i>`).join('')}<b>${count}/${tasks.length}</b></div><em>${count===tasks.length?'Noch mal entdecken ↗':'Los geht’s →'}</em></button>`;
 }).join('')}</div><button id="start-practice" class="practice-button">Neue Rechenaufgabe</button><div class="badge-row">${[[1,'Erster Schritt'],[5,'Ideensammler'],[20,'Weltgestalter'],[50,'Entdeckerprofi']].map(([count,title])=>`<span class="${progress.done.length>=count?'earned':''}">${progress.done.length>=count?'✦':'◇'} ${title}</span>`).join('')}</div><p class="learning-footnote">Du darfst dir Zeit lassen und Hilfe holen.</p><button id="curriculum-info" class="curriculum-link">Für Erwachsene: Lernziele & Spielkonzept ↗</button>`;
}
function begin(id){if(progress.grade===null){chooseGrade(()=>begin(id));return}if(progress.opening!=='done'){progress.opening='done';window.dispatchEvent(new Event('opening-changed'))}progress.active=id;const tasks=currentTasks(),index=tasks.findIndex(q=>!finished(q));progress.index=index<0?0:index;progress.worldMoves=[];worldAttemptDone=false;persist();question()}
function seek(){
 const q=currentTask(),p=active();if(!q||!p){resetStrip();return}mode='world';
 strip.hidden=false;document.querySelector('#adventure-button').hidden=true;
 const world=q[7].type==='world';
 strip.innerHTML=`<div class="mini-dachs">${badger}</div><div><small>${p.title.toUpperCase()} · ${progress.index+1} / ${currentTasks().length}</small><strong>${escape(q[1])}</strong><span>${world?'Mitmachen in deiner Welt':Lernwelt.find(q[0])?'Finde: '+escape(WorldArt.names[q[0]]||q[0]):'Im Rätsel entdecken'}</span></div><button id="quest-locate" aria-label="Aufgabenobjekt zeigen">⌖</button><button id="quest-open" aria-label="Aufgabe öffnen">→</button><button id="quest-stop" aria-label="Abenteuer beenden">×</button>`;
 document.querySelector('#quest-locate').onclick=()=>{if(world)prepareMission(q);if(!Lernwelt.focus(q[0]))question();else toast(world?q[2]:'Hier wartet dein nächstes Rätsel.')};
 document.querySelector('#quest-open').onclick=question;
 document.querySelector('#quest-stop').onclick=()=>{progress.active=null;persist();resetStrip()};
}
function prepareMission(q){if(q[7].goal==='carry'&&J.player())J.showPerson(J.player().uid);const need=({carry:[J.player()?.id,'tea'],water:['plant','watering'],left:['table','stool'],night:['sun']})[q[7].goal]||[];for(const id of need)J.bring(id);J.prepare(q[7].goal);Lernwelt.focus(q[0])}
function taskText(q,text){return q[7].goal==='carry'?text.replaceAll('Milo',J.player()?.characterName||WorldArt.names[J.player()?.id]||'deine Figur'):text}
function commonQuestion(q){const meta=q[7],visual=q[6].length<=32&&!/[a-zäöüß]/.test(q[6]);return `<div class="task-copy"><h2 id="learn-title">${escape(taskText(q,q[1]))}</h2><p class="task-description">${escape(taskText(q,q[2]))}</p></div><div class="task-tools"><button id="read-question" class="task-icon" aria-label="Aufgabe vorlesen" title="Vorlesen">${icon('sound')}</button><button id="task-hint" class="task-icon" aria-label="Tipp anzeigen" title="Tipp anzeigen" aria-expanded="false">💡</button>${meta.audio?'<button id="play-sample" class="sample-button">▶ Anhören</button>':''}</div>${visual&&meta.type==='choice'?`<div class="task-visual" aria-hidden="true">${escape(q[6])}</div>`:''}<div id="task-hint-text" class="task-hint" hidden>${escape(meta.hint)}</div>`}
function footer(){return '<div id="answer-feedback" role="status" aria-live="polite"></div><div class="question-actions"><button id="question-back">← Zur Welt</button><button id="skip-question">Später</button><button id="reward-shop" hidden>Einrichten</button><button id="next-question" hidden>Weiter →</button></div>'}
function question(){
 const q=currentTask();if(!q)return;document.querySelector('#panel').close();cleanup();mode='question';correct=false;worldAttemptDone=false;window.LerndachsEvidence?.start(q,progress.active);document.querySelector('#learn-close').hidden=false;
 let interaction='';
 if(q[7].type==='world')interaction='<div class="world-task-actions"><button id="enter-world-task" class="journey-primary">In meiner Welt ausprobieren →</button></div>';
 else if(q[7].type==='garden'){gardenCount=0;interaction='<div class="garden-game"><p id="garden-order" hidden></p><div id="garden-bed" aria-label="Dein bepflanztes Beet"></div><div class="garden-controls"><button id="garden-remove" aria-label="Einen Samen herausnehmen">−</button><span id="garden-count" aria-live="polite">0 Samen</span><button id="garden-add" aria-label="Einen Samen pflanzen">+ Samen</button></div><button id="check-garden" class="journey-primary">Mein Beet prüfen →</button></div>'}
 else if(q[7].type==='memory')interaction='<div class="memory-game"><p id="memory-rule" hidden></p><div id="memory-grid"></div><p id="memory-count" aria-live="polite"></p></div>';
 else interaction=`<div class="answer-grid">${q[3].map((a,i)=>`<button data-answer="${i}"><b>${String.fromCharCode(65+i)}</b>${escape(a)}</button>`).join('')}</div>`;
 content.innerHTML=commonQuestion(q)+interaction+footer();
 if(q[7].type==='garden')renderGarden();if(q[7].type==='memory')startMemory();
 if(!(!!window.LerndachsSpeech))document.querySelector('#read-question').hidden=true;reveal();
}
function success(q){
 if(correct)return;correct=true;stopSample();window.LerndachsEvidence?.finish(q);window.dispatchEvent(new Event('learning-celebration'));const already=finished(q);J.reward(taskKey(q));window.dispatchEvent(new Event('character-celebrate'));dialog.classList.add('task-complete');
 const feedback=document.querySelector('#answer-feedback');feedback.classList.add('correct-feedback');feedback.textContent=already?'Geschafft!':'Geschafft! +15 Sterne';
 const target=J.catalogue.find(i=>i.id===progress.target);
 document.querySelector('#reward-shop').hidden=!target||Lernwelt.snapshot().balance<target.price;
 document.querySelector('#next-question').hidden=false;document.querySelector('#skip-question').hidden=true;content.querySelectorAll('[data-answer],#check-garden,#enter-world-task').forEach(b=>b.disabled=true);WorldSound.effect('reward');
 for(const [n,name] of [[1,'Erster Schritt'],[5,'Ideensammler'],[20,'Weltgestalter'],[50,'Entdeckerprofi']])if(progress.done.length>=n&&!progress.badges.includes(name))progress.badges.push(name);persist();window.dispatchEvent(new CustomEvent('learning-success',{detail:{subject:active()?.subject||'math'}}));
}
function answer(i){if(correct)return;const q=currentTask(),button=content.querySelector(`[data-answer="${i}"]`);if(i!==q[4]){window.LerndachsEvidence?.mistake();button.classList.add('try-again');button.disabled=true;document.querySelector('#answer-feedback').textContent='Versuch es noch einmal.';WorldSound.effect('tea');return}button.classList.add('is-correct');success(q)}
function gardenTarget(){return [3,5,8,12,18][progress.grade]}
function renderGarden(){
 const orders=['Pflanze 3 Samen.','Pflanze 5 Samen.','Pflanze zuerst 5 Samen und dann noch 3.','Lege 3 Reihen mit je 4 Samen.','Lege 4 Reihen mit je 4 Samen und dann noch 2 Samen.'];
 document.querySelector('#garden-order').textContent=orders[progress.grade];document.querySelector('.task-description').textContent=orders[progress.grade];
 document.querySelector('#garden-bed').innerHTML=Array.from({length:Math.max(4,gardenCount)},(_,i)=>`<span class="${i<gardenCount?'planted':''}">${i<gardenCount?'🌱':'·'}</span>`).join('');document.querySelector('#garden-count').textContent=gardenCount+' Samen';document.querySelector('#garden-remove').disabled=gardenCount===0;
}
function startMemory(){
 const iconPairs=[['🐱','🐱'],['☀','☀'],['🌳','🌳']],wordPairs=[['🐱','Katze'],['☀','Sonne'],['🌳','Baum'],['☕','Tasse']];
 const pairs=progress.grade===0?iconPairs:progress.grade===1?wordPairs.slice(0,3):progress.grade===2?wordPairs:progress.grade===3?[['schnell','flink'],['leise','still'],['groß','riesig'],['klein','winzig']]:[['hell','dunkel'],['warm','kalt'],['laut','leise'],['groß','klein']];
 memoryCards=pairs.flatMap((pair,g)=>pair.map(text=>({text,group:g,matched:false,open:false}))).sort(()=>Math.random()-.5);memoryOpen=[];memoryBusy=false;
 document.querySelector('#memory-rule').textContent=progress.grade===0?'Finde gleiche Bilder.':progress.grade<3?'Finde Bild und passendes Wort.':progress.grade===3?'Finde Wörter mit ähnlicher Bedeutung.':'Finde Wörter mit gegenteiliger Bedeutung.';document.querySelector('.task-description').textContent=document.querySelector('#memory-rule').textContent;renderMemory();
}
function renderMemory(){document.querySelector('#memory-grid').innerHTML=memoryCards.map((c,i)=>`<button data-memory="${i}" class="memory-card ${c.open||c.matched?'face-up':''} ${c.matched?'matched':''}" aria-label="${c.open||c.matched?escape(c.text):'Verdeckte Karte '+(i+1)}" ${c.matched?'disabled':''}>${c.open||c.matched?escape(c.text):'?'}</button>`).join('');document.querySelector('#memory-count').textContent=memoryCards.filter(c=>c.matched).length/2+' / '+memoryCards.length/2+' Paare'}
function memoryFlip(index){
 if(memoryBusy||correct)return;const c=memoryCards[index];if(c.open||c.matched)return;c.open=true;memoryOpen.push(index);renderMemory();if(memoryOpen.length<2)return;
 const [a,b]=memoryOpen.map(i=>memoryCards[i]);if(a.group===b.group){a.matched=b.matched=true;memoryOpen=[];renderMemory();WorldSound.effect('tea');if(memoryCards.every(c=>c.matched))success(currentTask())}
 else{window.LerndachsEvidence?.mistake();memoryBusy=true;document.querySelector('#answer-feedback').textContent='Diese beiden gehören nicht zusammen. Merke dir ihre Plätze und probiere weiter.';memoryTimer=setTimeout(()=>{a.open=b.open=false;memoryOpen=[];memoryBusy=false;if(mode==='question'&&currentTask()?.[7].type==='memory')renderMemory()},900)}
}
function next(){
 const p=active();if(progress.active==='practice'){newPractice();return}
 if(progress.index<currentTasks().length-1){progress.index++;persist();question();return}
 const tasks=currentTasks(),n=tasks.filter(finished).length,complete=n===tasks.length;
 content.innerHTML=`<div class="learn-finish"><div class="guide-face">${badger}</div><h2 id="learn-title">${p.title}: ${complete?'geschafft!':'Runde beendet!'}</h2><p>${n} / ${tasks.length} Aufgaben für ${grades[progress.grade].label} entdeckt.</p><div class="finish-stars">✦ ✦ ✦</div><p>${progress.together?'Erzählt euch: Was habt ihr heute herausgefunden?':'Was war deine schönste Entdeckung? Erzähle sie jemandem.'}</p><button id="finish-shop">Einrichten</button><button id="finish-menu">${complete?'Ein neues Abenteuer':'Offene Aufgaben entdecken'}</button></div>`;progress.active=null;persist();resetStrip();mode='finish';dialog.scrollTop=0;
}
function newPractice(){
 progress.practice++;const g=progress.grade,n=progress.practice;let a,b,answer,text;
 if(g===0){a=n%4+1;b=(n*3)%4+1;answer=a+b;text=`${a} Samen und ${b} Samen kommen in ein Beet. Wie viele sind es?`}
 else if(g===1){a=n%7+1;b=(n*3)%5+1;answer=a+b;text=`${a} Bücher stehen im Regal. ${b} kommen dazu. Wie viele sind es?`}
 else if(g===2){a=n%10+10;b=(n*3)%8+1;answer=a-b;text=`Von ${a} Blumen werden ${b} verschenkt. Wie viele bleiben?`}
 else if(g===3){a=(n*37)%700+100;b=(n*13)%90+10;answer=a+b;text=`Für dein Projekt sind ${a} Steine da. ${b} kommen dazu. Wie viele sind es?`}
 else{a=n%15+11;b=n%7+2;answer=a*b;text=`${b} Kisten enthalten je ${a} Bausteine. Wie viele sind es zusammen?`}
 const answers=[String(answer+1),String(answer),String(Math.max(0,answer-1))];
 progress.practiceQuestion=['books','Eine neue Idee zum Üben.',text,answers,1,`Das Ergebnis ist ${answer}. Erkläre, wie du gerechnet hast.`,g===0?'🌱 + 🌱':`${a} ${g===2?'−':g===4?'·':'+'} ${b} = ?`,{id:'practice-g'+g+'-'+n,grades:[g],type:'choice',source:'math',pages:[38,39],skill:'Eine Rechengeschichte lösen',hint:g<2?'Zähle mit den Fingern oder lege kleine Gegenstände dazu.':g===2?'Nimm die kleinere Zahl schrittweise weg.':'Zerlege die Zahlen in kleinere Schritte.'}];
 progress.active='practice';progress.index=0;persist();question();
}
function curriculumInfo(){
 cleanup();mode='source';content.innerHTML=`<div class="curriculum-info"><h2 id="learn-title">Lernen mit Lerndachs</h2><p>Die Klassenauswahl filtert die Aufgaben. Vorschule und Klasse 1 nutzen kleine Mengen, erste Wörter und alltägliches Entdecken. Klasse 2 erweitert Rechnen und Lesen. Für Klasse 3 und 4 kommen größere Zahlen, Textverständnis und begründete Zusammenhänge hinzu. Dies ist eine Auswahl aus den bereitgestellten Lehrplänen, keine vollständige Abdeckung und keine automatische Diagnose.</p><p>Kinder erkunden zuerst das eingerichtete Zimmer. Beim Einzug bekommen sie 35 Sterne für ihren ersten Einkauf. Neue Lösungen bringen je 15 Sterne. Der kleine Laden bietet zunächst drei Dinge. Tipps und neue Versuche sind erlaubt. Bereits gelöste Rätsel bringen keine weiteren Sterne.</p><p>Mitmachaufgaben, ein Mengenbeet, Wörter-Memory und freies Einrichten ergänzen die Wissensfragen. Im lokalen Partner-Modus wechseln zwei Personen am selben Gerät die Rollen Spielen und Erklären. Das ersetzt keine echte Lerngruppe.</p>${paths.map(p=>{const s=sources[p.subject];return `<details><summary>${s.title}</summary><p>${escape(s.file)} · Fassung ${s.edition}<br>${escape(s.sections)}<br>Die Aufgaben führen ihre Lernziele und PDF-Seiten im Aufgabenkatalog mit.</p></details>`}).join('')}<p class="source-note">Alle Aufgaben sind eigene Formulierungen. Die PDFs bleiben lokal. Alte Prototyp-Spielstände unter den bisherigen Speicherschlüsseln werden nicht überschrieben. Die neue Lernreise nutzt einen getrennten Spielstand.</p><button id="finish-menu" class="sample-button">← Zu den Abenteuern</button></div>`;dialog.scrollTop=0;
}
content.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.grade!==undefined){pendingGrade=Number(b.dataset.grade);content.querySelectorAll('[data-grade]').forEach(btn=>btn.setAttribute('aria-pressed',Number(btn.dataset.grade)===pendingGrade));document.querySelector('#confirm-grade').disabled=false}
 else if(b.id==='confirm-grade'){if(pendingGrade===null)return;if(progress.grade!==pendingGrade){progress.active=null;progress.index=0;resetStrip()}progress.grade=pendingGrade;const next=afterGrade;afterGrade=null;persist();close();next?.()}
 else if(b.dataset.path)begin(b.dataset.path);
 else if(b.dataset.answer!==undefined)answer(Number(b.dataset.answer));
 else if(b.dataset.memory!==undefined)memoryFlip(Number(b.dataset.memory));
 else if(b.id==='together-toggle'){progress.together=!progress.together;persist();menu()}
 else if(b.id==='target-shop'||b.id==='finish-shop'||b.id==='reward-shop'){close();J.showShop()}
 else if(b.id==='start-practice')newPractice();
 else if(b.id==='enter-world-task'){prepareMission(currentTask());close();toast(currentTask()[2])}
 else if(b.id==='garden-add'&&!correct){gardenCount=Math.min(24,gardenCount+1);renderGarden()}
 else if(b.id==='garden-remove'&&!correct){gardenCount=Math.max(0,gardenCount-1);renderGarden()}
 else if(b.id==='check-garden'){if(gardenCount===gardenTarget())success(currentTask());else{window.LerndachsEvidence?.mistake();document.querySelector('#answer-feedback').textContent='Dein Beet hat '+gardenCount+' Samen. Lies den Auftrag noch einmal und verändere die Menge.'}}
 else if(b.id==='next-question'||b.id==='skip-question')next();
 else if(b.id==='question-back')close();
 else if(b.id==='finish-menu')menu();
 else if(b.id==='curriculum-info')curriculumInfo();
 else if(b.id==='task-hint'){window.LerndachsEvidence?.hint();const hint=document.querySelector('#task-hint-text');hint.hidden=!hint.hidden;b.setAttribute('aria-expanded',!hint.hidden)}
 else if(b.id==='play-sample'){stopSample();const duration=WorldSound.playSample(currentTask()[7].audio);b.textContent='♫ Hör gut hin …';sampleTimer=setTimeout(()=>{if(b.isConnected)b.textContent='↻ Noch einmal hören'},duration+100)}
 else if(b.id==='read-partner')readPartnerInvitation();
 else if(b.id==='read-question')LerndachsSpeech.task(currentTask())
});
function completeWorld(q){if(worldAttemptDone)return;worldAttemptDone=true;question();worldAttemptDone=true;success(q)}
window.addEventListener('world-move',()=>{
 const q=currentTask();if(mode!=='world'||q?.[7].type!=='world'||worldAttemptDone)return;
 const snap=Lernwelt.snapshot(),objects=snap.placed[snap.home];
 if(q[7].goal==='carry'&&objects.some(o=>o.id==='tea'&&o.carrier===J.profile.playerUid))completeWorld(q);
 if(q[7].goal==='left'){const table=objects.find(o=>o.id==='table');if(table&&objects.some(o=>o.id==='stool'&&o.x<table.x&&table.x-o.x<250&&Math.abs(o.y-table.y)<150))completeWorld(q)}
});
window.addEventListener('world-use',e=>{
 const q=currentTask();if(!q)return;
 if(q[7].type==='world'&&mode==='world'){
  if(q[7].goal==='water'&&e.detail.id==='watering'){const objects=Lernwelt.snapshot().placed[Lernwelt.snapshot().home],can=objects.find(o=>o.uid===e.detail.uid);if(can&&objects.some(o=>o.id==='plant'&&Math.hypot(o.x-can.x,o.y-can.y)<170))setTimeout(()=>completeWorld(q),200)}
  if(q[7].goal==='night'&&e.detail.id==='sun'&&!Lernwelt.snapshot().night)setTimeout(()=>{if(currentTask()===q&&Lernwelt.snapshot().night)completeWorld(q)},200);
 }else if(mode==='world'&&q[0]===e.detail.id){const id=taskKey(q);setTimeout(()=>{if(currentTask()&&taskKey(currentTask())===id)question()},180)}
});
document.querySelector('#learn-close').onclick=close;
dialog.addEventListener('close',cleanup);
window.addEventListener('request-grade-settings',()=>chooseGrade());
document.querySelector('#adventure-button').onclick=()=>{progress.taskWaiting=false;persist();invite()};document.querySelector('#learn-button').onclick=open;
window.addEventListener('request-starter',starter);window.addEventListener('request-learning',open);window.addEventListener('request-partner-learning',invite);
window.Learning={get progress(){return structuredClone(progress)},get currentTask(){return currentTask()},get currentTasks(){return currentTasks()},paths,sources,grades,openSubject(subject){const p=paths.find(p=>p.subject===subject);if(!progress.starterUnlocked||progress.opening!=='done'){starter();return}if(p){if(progress.grade===null)chooseGrade(()=>begin(p.id));else begin(p.id)}},nextFresh(manual=false){if(!progress.starterUnlocked||progress.opening!=='done'){starter();return}if(progress.grade===null){chooseGrade(()=>Learning.nextFresh(manual));return}const candidates=paths.flatMap(p=>tasksFor(p).filter(q=>!finished(q)).map(q=>({p,q})));if(!candidates.length){newPractice();return}const hit=candidates[(progress.promptNumber||0)%candidates.length];progress.promptNumber=(progress.promptNumber||0)+1;progress.active=hit.p.id;progress.index=tasksFor(hit.p).indexOf(hit.q);progress.worldMoves=[];persist();question();if(manual)return;const note=document.createElement('p');note.className='timed-discovery-note';note.textContent='Zehn Minuten gespielt – eine neue Entdeckung wartet!';content.prepend(note)}};
if(!Number.isInteger(progress.grade)||!grades[progress.grade]){progress.grade=null;progress.active=null}
updateHUD();if(progress.starterUnlocked&&progress.active&&progress.opening==='done')seek();
})();

;
/* Child-editable weekly timetable. Demo content is explicitly labelled. */
(()=>{
const J=LerndachsJourney,dialog=document.querySelector('#schedule-dialog'),body=document.querySelector('#schedule-content');
const days=['Montag','Dienstag','Mittwoch','Donnerstag','Freitag'],shortDays=['Mo','Di','Mi','Do','Fr'];
const subjects=[['Deutsch','Aa','purple'],['Mathematik','123','yellow'],['Sachunterricht','✿','teal'],['Musik','♫','coral'],['Kunst','✎','sky'],['Sport','↗','mint'],['Englisch','Hi','sky'],['Pause','☀','yellow'],['Freie Spielzeit','✦','teal']];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let day=0,editing=null,undoPlan=null;
function demo(){const pre=J.profile.grade===0;return {demo:true,basedOnDemo:true,rows:[
{start:'08:00',end:'08:45',slots:pre?['Freie Spielzeit','Kunst','Freie Spielzeit','Musik','Freie Spielzeit']:['Deutsch','Mathematik','Deutsch','Mathematik','Deutsch']},
{start:'08:45',end:'09:30',slots:pre?['Musik','Freie Spielzeit','Kunst','Freie Spielzeit','Sport']:['Mathematik','Deutsch','Sachunterricht','Deutsch','Mathematik']},
{start:'09:30',end:'10:00',slots:['Pause','Pause','Pause','Pause','Pause']},
{start:'10:00',end:'10:45',slots:pre?['Sport','Sachunterricht','Musik','Kunst','Freie Spielzeit']:['Sachunterricht','Sport','Mathematik','Musik','Kunst']},
{start:'10:45',end:'11:30',slots:pre?['Kunst','Musik','Freie Spielzeit','Sport','Musik']:['Kunst','Sachunterricht','Sport','Sachunterricht',J.profile.grade>=3?'Englisch':'Musik']}
]}}
function plan(){const s=J.getTimetable();if(!s||!Array.isArray(s.rows)){J.setTimetable(demo());return J.getTimetable()}return s}
function subjectInfo(name){return subjects.find(s=>s[0]===name)||[name,'✦','paper']}
function save(s){J.setTimetable(s)}
function message(text){const e=document.querySelector('#schedule-status');if(e)e.textContent=text}
function open(){document.querySelector('#panel').close();document.querySelector('#learning-dialog').close();editing=null;render();dialog.showModal()}
function render(){
 const s=plan();
 body.innerHTML=`<div class="schedule-heading"><h2 id="schedule-title">Mein Stundenplan</h2><p>${s.demo?'Das ist ein Beispielplan. Ersetze die Fächer und Zeiten durch deinen eigenen Plan.':s.basedOnDemo?'Dein angepasster Beispielplan. Prüfe auch die anderen Fächer und Zeiten.':'Dein eigener Plan. Tippe auf ein Fach oder eine Uhrzeit, um es zu ändern.'}</p></div><div class="schedule-day-tabs" role="group" aria-label="Wochentag anzeigen">${days.map((d,i)=>`<button data-schedule-day="${i}" aria-pressed="${i===day}" aria-label="${d}">${shortDays[i]}</button>`).join('')}</div><div class="schedule-table" role="table" aria-label="Wochenstundenplan"><div class="schedule-row schedule-header" role="row"><span role="columnheader">Zeit</span>${days.map((d,i)=>`<span role="columnheader" class="schedule-day-${i} ${day===i?'selected-day':''}">${d}</span>`).join('')}</div>${s.rows.map((row,r)=>`<div class="schedule-row" role="row"><button class="lesson-time" data-edit-time="${r}" aria-label="Zeit von Zeile ${r+1} ändern"><b>${r+1}</b><span>${escape(row.start)}<br>${escape(row.end)}</span><small>✎</small></button>${row.slots.map((name,c)=>{const [_,icon,color]=subjectInfo(name);return `<div role="cell" class="schedule-day-${c} ${day===c?'selected-day':''}"><button class="lesson-cell ${color} ${name?'':'empty-lesson'}" data-edit-slot="${r},${c}" aria-label="${days[c]}, Zeile ${r+1}: ${escape(name||'Fach eintragen')}"><span aria-hidden="true">${name?icon:'+'}</span><strong>${escape(name||'Fach eintragen')}</strong><small>✎</small></button></div>`}).join('')}</div>`).join('')}</div><div class="schedule-actions"><button id="add-lesson">+ Stunde ergänzen</button><button id="blank-schedule">Leeren Plan beginnen</button><button id="demo-schedule">Beispielplan laden</button>${undoPlan?'<button id="undo-schedule">↶ Rückgängig</button>':''}</div><p id="schedule-status" role="status" aria-live="polite">${s.demo?'Beispieldaten · kein echter Schulstundenplan':'Dein Plan wird auf diesem Gerät gespeichert.'}</p><div id="schedule-editor" hidden></div>`;
}
function editSlot(r,c){
 editing={kind:'slot',r,c};const name=plan().rows[r].slots[c],editor=document.querySelector('#schedule-editor');editor.hidden=false;
 editor.innerHTML=`<div class="schedule-edit-top"><div><h3>${days[c]}: ${r+1}. Stunde</h3></div><button id="close-schedule-editor" aria-label="Bearbeitung schließen">×</button></div><div class="subject-palette">${subjects.map(([label,icon,color])=>`<button data-subject="${escape(label)}" class="${color}"><span>${icon}</span>${escape(label)}</button>`).join('')}</div><label class="schedule-custom-label">Eigenes Fach<input id="custom-subject" maxlength="40" placeholder="z. B. Klassenrat" value="${escape(name)}"></label><div class="schedule-edit-actions"><button id="save-subject" class="journey-primary">Fach übernehmen</button><button id="clear-subject">Feld leeren</button></div>`;
 editor.scrollIntoView({behavior:'auto',block:'nearest'});editor.querySelector('[data-subject]')?.focus({preventScroll:true});
}
function editTime(r){
 editing={kind:'time',r};const row=plan().rows[r],editor=document.querySelector('#schedule-editor');editor.hidden=false;
 editor.innerHTML=`<div class="schedule-edit-top"><div><h3>Zeiten für die ${r+1}. Stunde</h3></div><button id="close-schedule-editor" aria-label="Bearbeitung schließen">×</button></div><div class="time-inputs"><label>Beginn<input id="lesson-start" type="time" value="${row.start}" required></label><label>Ende<input id="lesson-end" type="time" value="${row.end}" required></label></div><div class="schedule-edit-actions"><button id="save-lesson-time" class="journey-primary">Zeit übernehmen</button><button id="remove-lesson">Diese Zeile entfernen</button></div><p id="time-error" role="alert"></p>`;
 editor.scrollIntoView({behavior:'auto',block:'nearest'});document.querySelector('#lesson-start').focus({preventScroll:true});
}
function setSubject(value){const s=plan();undoPlan=structuredClone(s);s.rows[editing.r].slots[editing.c]=value.trim().slice(0,40);s.demo=false;save(s);editing=null;render();message('Gespeichert! Du kannst noch weitere Fächer ändern.')}
body.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.scheduleDay!==undefined){day=Number(b.dataset.scheduleDay);editing=null;render()}
 else if(b.dataset.editSlot){const [r,c]=b.dataset.editSlot.split(',').map(Number);editSlot(r,c)}
 else if(b.dataset.editTime!==undefined)editTime(Number(b.dataset.editTime));
 else if(b.dataset.subject)setSubject(b.dataset.subject);
 else if(b.id==='save-subject')setSubject(document.querySelector('#custom-subject').value);
 else if(b.id==='clear-subject')setSubject('');
 else if(b.id==='close-schedule-editor'){editing=null;document.querySelector('#schedule-editor').hidden=true}
 else if(b.id==='save-lesson-time'){
  const start=document.querySelector('#lesson-start').value,end=document.querySelector('#lesson-end').value;
  if(!start||!end||end<=start){document.querySelector('#time-error').textContent='Das Ende muss nach dem Beginn liegen.';return}
  const s=plan();undoPlan=structuredClone(s);Object.assign(s.rows[editing.r],{start,end});s.demo=false;save(s);render();message('Die Uhrzeiten sind gespeichert.');
 }
 else if(b.id==='remove-lesson'){const s=plan();undoPlan=structuredClone(s);s.rows.splice(editing.r,1);s.demo=false;save(s);render();message('Zeile entfernt. Du kannst das rückgängig machen.')}
 else if(b.id==='add-lesson'){
  const s=plan();if(s.rows.length>=10){message('Du hast schon zehn Zeilen.');return}undoPlan=structuredClone(s);const endTime=s.rows.at(-1)?.end||'08:00';const [hours,minutes]=endTime.split(':').map(Number);const endMinutes=Math.min(1439,hours*60+minutes+45);const nextEnd=String(Math.floor(endMinutes/60)).padStart(2,'0')+':'+String(endMinutes%60).padStart(2,'0');s.rows.push({start:endTime,end:nextEnd,slots:['','','','','']});s.demo=false;save(s);render();editTime(s.rows.length-1);
 }
 else if(b.id==='blank-schedule'){undoPlan=structuredClone(plan());const s=demo();s.demo=false;s.basedOnDemo=false;s.rows.forEach(r=>r.slots=['','','','','']);save(s);render();message('Dein leerer Plan ist bereit. Tippe auf ein Feld.')}
 else if(b.id==='demo-schedule'){undoPlan=structuredClone(plan());save(demo());render();message('Beispielplan geladen. Du kannst ihn an deine Woche anpassen.')}
 else if(b.id==='undo-schedule'&&undoPlan){const old=undoPlan;undoPlan=null;save(old);render();message('Die letzte Änderung wurde rückgängig gemacht.')}
});
body.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='custom-subject'){e.preventDefault();setSubject(e.target.value)}});
document.querySelector('#schedule-close').onclick=()=>dialog.close();
// A fixed hanging timetable is the entry point, not a dock tool.
const board=document.createElementNS('http://www.w3.org/2000/svg','g');board.id='wall-schedule';board.setAttribute('transform','translate(1380 220)');board.setAttribute('role','button');board.setAttribute('tabindex','0');board.setAttribute('aria-label','Stundenplan an der Wand öffnen');
board.innerHTML=`<title>Mein Stundenplan</title><path d="M-65-61 0-101 65-61" fill="none" stroke="#363c48" stroke-width="3"/><circle cy="-101" r="4" fill="#f6cc72" stroke="#363c48" stroke-width="2"/><rect x="-94" y="-65" width="188" height="139" rx="10" fill="#b4a4d3" stroke="#363c48" stroke-width="4"/><rect x="-85" y="-56" width="170" height="121" rx="6" fill="#fff3d7" stroke="#363c48" stroke-width="2"/><text y="-30" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#363c48">STUNDENPLAN</text>${['Mo','Di','Mi','Do','Fr'].map((day,i)=>`<g transform="translate(${-68+i*34} -12)"><text text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#363c48">${day}</text>${['#79c5ad','#f29880','#f6cc72'].map((color,j)=>`<rect x="-12" y="${7+j*18}" width="24" height="13" rx="3" fill="${color}" stroke="#363c48" stroke-width="1"/>`).join('')}</g>`).join('')}`;
document.querySelector('#wall-fixtures').append(board);for(const type of ['pointerdown','pointerup'])board.addEventListener(type,e=>e.stopPropagation());board.addEventListener('click',open);board.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
window.LerndachsTimetable={open,getSnapshot:()=>structuredClone(plan())};
})();

;
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

;
/* Only the pupils follow the pointer; world positions and body transforms are untouched. */
(()=>{
'use strict';
let pointer=null,frame=0;
function paint(){frame=0;const pause=document.hidden||document.body.classList.contains('no-motion');
 for(const pupils of document.querySelectorAll('.character-pupils')){
  if(!pointer||pause){pupils.removeAttribute('transform');continue}
  const parent=pupils.parentElement,matrix=parent.getScreenCTM?.();if(!matrix)continue;
  try{const local=new DOMPoint(pointer.x,pointer.y).matrixTransform(matrix.inverse()),box=pupils.getBBox();
   const dx=local.x-(box.x+box.width/2),dy=local.y-(box.y+box.height/2),distance=Math.hypot(dx,dy),strength=Math.min(1,distance/100);
   const x=distance?dx/distance*(pupils.classList.contains('pet-pupils')?2:4.8)*strength:0,y=distance?dy/distance*(pupils.classList.contains('pet-pupils')?2:4.6)*strength:0;
   pupils.setAttribute('transform',`translate(${x.toFixed(3)} ${y.toFixed(3)})`);
  }catch{pupils.removeAttribute('transform')}
 }
}
function schedule(){if(!frame)frame=requestAnimationFrame(paint)}
function follow(e){if(e.pointerType==='touch'&&e.type==='pointermove')return;pointer={x:e.clientX,y:e.clientY};schedule()}
window.addEventListener('pointermove',follow,{passive:true});window.addEventListener('pointerdown',follow,{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{pointer=null;schedule()});window.addEventListener('blur',()=>{pointer=null;schedule()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pointer=null;schedule()});
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
window.LerndachsCharacters=Object.freeze({sync:schedule});
})();

;
/* Settings and grown-up areas share the world's palette and local profile. */
(()=>{
const J=LerndachsJourney,E=LerndachsEvidence,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shell=document.createElement('dialog');shell.id='adult-dialog';shell.setAttribute('aria-labelledby','adult-title');shell.innerHTML='<button id="adult-close" aria-label="Bereich schließen">×</button><nav class="adult-tabs" aria-label="Erwachsenenbereich"><button data-adult="settings">Einstellungen</button><button data-adult="parents">Für Eltern</button><button data-adult="teachers">Für Lehrkräfte</button></nav><div id="adult-content"></div>';document.body.append(shell);
const content=shell.querySelector('#adult-content');let mode='settings';
const subjects=()=>Object.entries(LerndachsCurriculum.sources).map(([id,s])=>({id,label:s.title}));
function open(next='settings'){
 mode=next;document.querySelectorAll('dialog[open]').forEach(d=>{if(d!==shell)d.close()});
 shell.querySelectorAll('[data-adult]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.adult===mode));
 if(mode==='settings')settings();else if(mode==='parents')parents();else window.LerndachsWorksheets?.render(content);
 if(!shell.open)shell.showModal();shell.scrollTop=0;
}
function settings(){const g=Learning.grades[J.profile.grade];content.innerHTML=`<div class="adult-heading"><h2 id="adult-title">Einstellungen</h2><p>Die Klasse bleibt auf diesem Gerät gespeichert. Hier kannst du sie ändern.</p></div><div class="settings-card"><span class="adult-symbol">▦</span><div><h3>${g?.label||'Noch keine Klasse gewählt'}</h3><p>Passende Aufgaben für deinen Lernweg.</p></div><button id="settings-grade">Klasse ändern →</button></div><div class="adult-entry-grid"><button data-adult="parents"><span>♡</span><strong>Für Eltern</strong><small>Lernwege, Fächer und Medienkompetenz im Blick.</small></button><button data-adult="teachers"><span>✎</span><strong>Für Lehrkräfte</strong><small>Aufgaben auswählen und als PDF mitnehmen.</small></button></div><div class="settings-tools"><button id="settings-help">Hilfe zum Spiel</button><button id="settings-reset">Neues Spiel starten</button><button data-install-app>App installieren</button></div><a id="settings-impressum" class="settings-legal" href="impressum.html" target="_blank" rel="noopener">Impressum</a><p class="adult-note">Ein gemeinsamer Lernstand pro Browser. Die Bereiche sind keine getrennten Konten und haben keinen Passwortschutz. Alle Lernbeobachtungen bleiben auf diesem Gerät.</p>`}
function metric(s){return `<span class="level-tag">${s.stage}</span><div class="level-track" aria-label="Lerndachs-Stufe ${s.stage}">${['Entdecken','Üben','Anwenden'].map((x,i)=>`<i class="${['Entdecken','Üben','Anwenden'].indexOf(s.stage)>=i?'lit':''}"></i>`).join('')}</div>`}
function parents(){
 const g=Learning.grades[J.profile.grade],all=subjects().map(x=>({...x,...E.summary(x.id)})),observed=all.reduce((n,s)=>n+s.observed,0),known=all.reduce((n,s)=>n+s.known,0),range=['A als Einstieg','A bis B','B','B bis C','C'][J.profile.grade]||'noch offen';
 const recent=J.profile.evidence.filter(e=>e.grade===J.profile.grade).slice(-6).reverse();
 content.innerHTML=`<div class="adult-heading"><h2 id="adult-title">Für Eltern</h2><p>Ein Blick auf den Lernweg Ihres Kindes – aus den Aufgaben und Versuchen in dieser App.</p></div><div class="parent-stats"><article><strong>${known}</strong><span>Katalogaufgaben gelöst</span></article><article><strong>${observed}</strong><span>mit Detailbeobachtung</span></article><article><strong>${J.profile.evidence.filter(e=>e.grade===J.profile.grade&&!e.errors&&!e.hints).length}</strong><span>ohne Fehlversuch oder Tipp</span></article></div><section class="level-explainer"><h3>Orientierungsrahmen: ${range}</h3><p>Die Klassenwahl bestimmt die Aufgaben. Die Angabe A–C beschreibt nur den groben curricularen Bezug unserer Auswahl; sie ist keine gemessene Niveaustufe Ihres Kindes. Deutsch, Mathematik und die weiteren Fächer haben eigene Anforderungen.</p><p><b>Der Lerndachs-Lernweg:</b> Noch offen = keine Detaildaten. Entdecken = 1–2 verschiedene Lösungen. Üben = ab 3 Lösungen. Anwenden = mindestens 6 Lösungen, davon 80 % ohne Fehlversuch oder Tipp, aus mindestens 3 Lernzielen. Das sind appinterne Hinweise, keine Schulnoten.</p></section><div class="subject-grid">${all.map(s=>`<article class="subject-card"><h3>${s.label}</h3><p>${s.known} / ${s.total} Aufgaben gelöst</p>${metric(s)}<p>${s.observed?`${s.independent} von ${s.observed} beobachteten Lösungen ohne Fehlversuch oder Tipp. ${s.retries} mit erneutem Versuch, ${s.hints} mit Tipp.`:'Noch keine Detailbeobachtungen. Beginnen Sie mit einer gemeinsamen Aufgabe.'}</p>${s.legacy?`<small>${s.legacy} frühere Lösungen ohne Versuchsdaten.</small>`:''}<button data-parent-practice="${s.id}">Gemeinsam entdecken →</button></article>`).join('')}</div><section class="media-report"><h3>Medien sicher nutzen</h3><p>Die Alltagsszenarien orientieren sich an den sechs <a href="${LerndachsMedia.source}" target="_blank" rel="noopener">Kompetenzbereichen der KMK</a>. Richtige Antworten zeigen Wissen in der App; praktische Fertigkeiten im Alltag müssen gemeinsam beobachtet werden.</p><div class="media-grid">${LerndachsMedia.dimensions.map(([id,label])=>{const s=E.summary('media',id);return `<article><strong>${label}</strong><span>${s.known}/${s.total} Szenarien gelöst</span><small>${s.observed?`${s.independent}/${s.observed} ohne Fehlversuch oder Tipp`:'Noch keine Beobachtung'}</small><p>${s.known?'Fragen Sie nach einem Beispiel aus dem Alltag.':'Probieren Sie ein Szenario gemeinsam aus.'}</p></article>`}).join('')}</div></section><section><h3>Zuletzt entdeckt</h3>${recent.length?`<ul class="recent-learning">${recent.map(e=>`<li><span>${esc(e.skill)}</span><small>${new Date(e.at).toLocaleDateString('de-DE')} · ${e.errors?'mit neuem Versuch':e.hints?'mit Tipp':'ohne Fehlversuch oder Tipp'}</small></li>`).join('')}</ul>`:'<p>Neue Lösungen erscheinen hier mit Datum. Frühere Antworten bleiben als Katalogfortschritt erhalten.</p>'}</section><p class="adult-note">Keine standardisierte Diagnostik. Vorlesefunktion, Hilfe außerhalb der App und Zusammenarbeit werden nicht vollständig erfasst. Lernstand dieses Browsers; mehrere Kinder am selben Gerät teilen sich diese Daten.</p>`;
}
shell.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.adult)open(b.dataset.adult);if(b.id==='adult-close')shell.close();if(b.id==='settings-grade'){shell.close();window.dispatchEvent(new Event('request-grade-settings'))}if(b.id==='settings-reset'){if(!confirm('Neues Spiel starten? Deine Sterne, Figuren und Einrichtung werden zurückgesetzt.'))return;const url=new URL(location.href);url.searchParams.set('reset','1');location.assign(url.href)}if(b.id==='settings-help'){shell.close();window.dispatchEvent(new Event('request-world-help'))}if(b.dataset.parentPractice){shell.close();Learning.openSubject(b.dataset.parentPractice)}});
document.querySelector('#help').onclick=()=>open();
window.LerndachsAdults={open,subjects,escape:esc};
})();

;
/* Offline PDF generation; shared task bank and exact selected answer key. pdf-lib MIT. */
(()=>{
const A=LerndachsAdults,J=LerndachsJourney,esc=A.escape;
let config={grade:J.profile.grade??1,subject:'math',count:6,title:'Meine kleine Entdeckerrunde',solutions:true},selection=[],rotation=0,host;
function available(){return Learning.paths.filter(p=>config.subject==='all'||p.subject===config.subject).flatMap(p=>p.items).filter(q=>q[7].type==='choice'&&!q[7].audio&&q[7].grades.includes(config.grade))}
function pick(){const all=available();selection=Array.from({length:Math.min(config.count,all.length)},(_,i)=>all[(rotation+i)%all.length]);}
function render(node){host=node;pick();host.innerHTML=`<div class="adult-heading"><h2 id="adult-title">Arbeitsblatt erstellen</h2><p>Aus dem Lerndachs-Aufgabenkatalog: nach Klasse und Fach auswählen, Vorschau prüfen und ein fertiges PDF herunterladen.</p></div><form id="worksheet-form" class="worksheet-form"><label>Klasse<select id="worksheet-grade">${Object.entries(Learning.grades).map(([id,g])=>`<option value="${id}" ${Number(id)===config.grade?'selected':''}>${g.label}</option>`).join('')}</select></label><label>Fach<select id="worksheet-subject"><option value="all">Bunte Mischung</option>${A.subjects().map(s=>`<option value="${s.id}" ${s.id===config.subject?'selected':''}>${s.label}</option>`).join('')}</select></label><label>Aufgaben<select id="worksheet-count">${[3,6,9,12].map(n=>`<option ${n===config.count?'selected':''}>${n}</option>`).join('')}</select></label><label class="worksheet-title-field">Titel<input id="worksheet-title" value="${esc(config.title)}" maxlength="70"></label><label class="worksheet-check"><input id="worksheet-solutions" type="checkbox" ${config.solutions?'checked':''}> Lösungsseiten für die Lehrkraft anhängen</label></form><div class="worksheet-actions"><button id="worksheet-shuffle">Auswahl neu mischen ↻</button><button id="worksheet-download" class="journey-primary">PDF herunterladen ↓</button></div><p id="worksheet-status" role="status"></p><div id="worksheet-preview"></div><p class="adult-note">Es werden eigene Multiple-Choice-Aufgaben ohne Hörproben verwendet. Platz für Kreuze und einen eigenen Lösungsweg ist enthalten. Der PDF-Download funktioniert nach dem ersten Laden auch offline. Die Auswahl hier ändert die Klasse des Kindes nicht.</p>`;preview();
 host.querySelector('#worksheet-form').addEventListener('submit',e=>e.preventDefault());
 host.querySelector('#worksheet-form').addEventListener('change',()=>{readConfig();pick();preview()});
 host.querySelector('#worksheet-title').addEventListener('input',()=>{readConfig();preview()});
 host.querySelector('#worksheet-shuffle').onclick=()=>{readConfig();rotation+=selection.length===available().length?1:Math.max(1,selection.length);pick();preview()};
 host.querySelector('#worksheet-download').onclick=download;
}
function readConfig(){config={grade:Number(host.querySelector('#worksheet-grade').value),subject:host.querySelector('#worksheet-subject').value,count:Number(host.querySelector('#worksheet-count').value),title:host.querySelector('#worksheet-title').value.trim()||'Meine Entdeckerrunde',solutions:host.querySelector('#worksheet-solutions').checked}}
function preview(){host.querySelector('#worksheet-preview').innerHTML=`<div class="worksheet-paper"><div class="paper-brand"><img src="icons/icon-192.png" alt=""><b>Lerndachs</b><small>AUFGABENBLATT · ${Learning.grades[config.grade].label.toUpperCase()}</small></div><h3>${esc(config.title)}</h3><p>Name: _____________________ Datum: __________</p>${selection.map((q,i)=>`<article><span class="paper-task-number">${i+1}</span><div><small>${esc(q[7].skill)}</small><h4>${esc(q[2])}</h4><ul>${q[3].map(a=>`<li>□ ${esc(a)}</li>`).join('')}</ul><p class="thinking-line">Mein Gedanke: ___________________________________</p></div></article>`).join('')}</div>`;host.querySelector('#worksheet-status').textContent=`${selection.length} passende Aufgaben ausgewählt${selection.length<config.count?' – für diese Auswahl sind nicht mehr schriftliche Aufgaben vorhanden.':'.'}`;host.querySelector('#worksheet-download').disabled=!selection.length}
async function createPDF(){
 const {PDFDocument,StandardFonts,rgb}=PDFLib,doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica),bold=await doc.embedFont(StandardFonts.HelveticaBold);
 doc.setTitle(config.title);doc.setAuthor('Lerndachs');doc.setSubject('Eigene Lernaufgaben für '+Learning.grades[config.grade].label);
 const color={ink:rgb(.22,.26,.30),paper:rgb(1,.98,.94),teal:rgb(.31,.73,.66),yellow:rgb(1,.85,.48),soft:rgb(.91,.95,.91)};
 const clean=value=>[...String(value).replace(/[–—−]/g,'-').replace(/→/g,' -> ').replace(/←/g,' <- ').replace(/↔/g,' <-> ').replace(/\u00a0/g,' ')].map(c=>{try{font.encodeText(c);return c}catch{return '?'}}).join('');
 const text=(page,value,x,y,size=11,strong=false,shade=color.ink)=>page.drawText(clean(value),{x,y,size,font:strong?bold:font,color:shade});
 function wrap(value,width,size,strong=false){const f=strong?bold:font,lines=[];let line='';for(const word of clean(value).split(/\s+/)){const next=line?line+' '+word:word;if(f.widthOfTextAtSize(next,size)>width&&line){lines.push(line);line=''}for(const char of (line?' ':'')+word){if(f.widthOfTextAtSize(line+char,size)>width&&line){lines.push(line);line=''}line+=char}}if(line)lines.push(line);return lines}
 function lines(page,value,x,y,width,size,strong=false){const rows=wrap(value,width,size,strong);rows.forEach((r,i)=>text(page,r,x,y-i*(size+4),size,strong));return y-rows.length*(size+4)}
 const logo=await doc.embedPng(await (await fetch('icons/icon-192.png')).arrayBuffer());
 function rounded(page,x,y,w,h,fill,border=color.ink){const r=12;page.drawSvgPath(`M ${r} 0 H ${w-r} Q ${w} 0 ${w} ${r} V ${h-r} Q ${w} ${h} ${w-r} ${h} H ${r} Q 0 ${h} 0 ${h-r} V ${r} Q 0 0 ${r} 0 Z`,{x,y:y+h,color:fill,borderColor:border,borderWidth:1})}
 function pageHeader(solution=false){const page=doc.addPage([595.28,841.89]);page.drawRectangle({x:0,y:0,width:595.28,height:841.89,color:color.paper});page.drawImage(logo,{x:34,y:770,width:52,height:52});text(page,'Lerndachs',95,797,23,true);text(page,solution?'LÖSUNGEN FÜR DIE LEHRKRAFT':'DEINE IDEEN MACHEN DIE WELT BUNTER',95,778,8,true);page.drawCircle({x:545,y:797,size:18,color:color.yellow});text(page,'+',539,790,22,true);const titleSize=wrap(config.title,520,21,true).length>2?14:21;lines(page,config.title,36,746,520,titleSize,true);text(page,Learning.grades[config.grade].label+'  |  '+(A.subjects().find(s=>s.id===config.subject)?.label||'Bunte Mischung'),36,701,10);if(!solution)text(page,'Name: ____________________________      Datum: ______________',36,680,11);return page}
 for(let offset=0;offset<selection.length;offset+=3){const page=pageHeader();selection.slice(offset,offset+3).forEach((q,i)=>{const top=660-i*207;rounded(page,35,top-193,525,193,i%2?color.soft:rgb(1,.96,.84));page.drawCircle({x:58,y:top-24,size:13,color:color.teal});text(page,String(offset+i+1),54,top-28,11,true);text(page,q[7].skill,82,top-19,8,true);let y=lines(page,q[2],82,top-42,454,12,true)-1;q[3].forEach(option=>{page.drawRectangle({x:83,y:y-2,width:8,height:8,borderColor:color.ink,borderWidth:1});y=lines(page,option,99,y,437,10)-4});text(page,'Mein Gedanke:',82,top-167,9);page.drawLine({start:{x:157,y:top-168},end:{x:536,y:top-168},thickness:.5,color:color.ink})});}
 if(config.solutions)for(let offset=0;offset<selection.length;offset+=6){const page=pageHeader(true);let y=681;selection.slice(offset,offset+6).forEach((q,i)=>{text(page,`${offset+i+1}. ${q[3][q[4]]}`,36,y,12,true);y=lines(page,q[5],36,y-20,520,10)-22})}
 const pages=doc.getPages();pages.forEach((page,i)=>{text(page,'Lerndachs  |  Zeit zum Denken. Platz für eigene Ideen.',36,25,8);text(page,`${i+1} / ${pages.length}`,523,25,8)});
 return doc.save();
}
async function download(){const button=host.querySelector('#worksheet-download'),status=host.querySelector('#worksheet-status');button.disabled=true;status.textContent='Dein Aufgabenblatt wird vorbereitet …';try{readConfig();const bytes=await createPDF(),url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),link=document.createElement('a');link.href=url;link.download=`lerndachs-${config.grade===0?'vorschule':'klasse-'+config.grade}-${config.subject}.pdf`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent='Fertig! Das PDF mit '+selection.length+' Aufgaben wurde heruntergeladen.'}catch(error){console.error(error);status.textContent='Das PDF konnte nicht erstellt werden. Bitte erneut versuchen.'}finally{button.disabled=false}}
window.LerndachsWorksheets={render};
})();

;
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

;
/* A cross-subject challenge; each success is recorded from real learning evidence. */
(()=>{
const J=LerndachsJourney,p=J.profile,paths=LerndachsCurriculum.paths,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
p.halloween??={started:false,unlocked:false,enabled:false,subjects:[],costumes:{}};const h=p.halloween;h.costumes??={};
const props=[{id:'halloween-pumpkin',name:'Kürbislicht',x:390,y:800},{id:'halloween-ghost',name:'Freundliches Gespenst',x:1060,y:420},{id:'halloween-bats',name:'Fledermaus-Girlande',x:640,y:150},{id:'halloween-candy',name:'Süße Schale',x:920,y:780}];
function art(id){const {R,E,P,C}=WorldArt;
 if(id==='halloween-pumpkin')return `${E(0,0,65,10,'#363c4820')}${P('M-4-91q-2-25 15-22','none',C.leaf,9)}${E(0,-44,61,47,'#f6a34f',C.ink)}${E(0,-44,28,47,'#ffbd63',C.ink,2)}${P('M-35-48l16-19 9 21Zm45 2 9-21 16 19ZM-31-27l16 12 15-10 15 10 16-12-10 22h-42Z','#fff2ac',C.ink,2)}`;
 if(id==='halloween-ghost')return `${P('M-55 0v-70q0-77 55-77t55 77V0L35-17 17 0 0-17-17 0-35-17Z','#fffdf4',C.ink)}${E(-18,-81,7,12,C.ink)}${E(18,-81,7,12,C.ink)}${P('M-10-51q10 13 20 0','none',C.ink,3)}${E(-35,-57,9,5,C.pink)}${E(35,-57,9,5,C.pink)}`;
 if(id==='halloween-bats')return `${P('M-160-25Q0 30 160-25','none',C.ink,3)}${[-110,0,110].map(x=>`<g transform="translate(${x} 0)">${P('M0-8l-28-20-20 25 23-1 10 16L0 6 15 12 25-4l23 1-20-25Z','#67546e',C.ink,2)}${E(-5,-1,2,3,C.white)}${E(5,-1,2,3,C.white)}</g>`).join('')}`;
 if(id==='halloween-candy')return `${E(0,-25,53,17,'#b4a4d3',C.ink)}${P('M-53-25q8 57 53 57t53-57Z','#b4a4d3',C.ink)}${[-25,0,25].map((x,i)=>`<g transform="translate(${x} -32)">${P('M-10-10l-10-7v24l10-7m20-10 10-7v24L10 0','#f29880',C.ink,2)}${R(-11,-14,22,24,['#f6cc72','#93d6eb','#edb9cf'][i],7)}</g>`).join('')}`;
 return '';
}
for(const prop of props){WorldArt.bounds[prop.id]=prop.id==='halloween-bats'?[-170,-45,340,90]:[-70,-155,140,195];WorldArt.names[prop.id]=prop.name;J.catalogue.push({id:prop.id,name:prop.name,note:'Deine Halloween-Belohnung.',price:0,kind:'season'})}
function dress(){for(const el of document.querySelectorAll('#objects .person')){el.querySelectorAll('.halloween-costume').forEach(n=>n.remove());if(!h.enabled)continue;const costume=h.costumes[el.dataset.uid]||'witch';if(costume==='none')continue;const sprite=el.querySelector('.sprite'),g=document.createElementNS('http://www.w3.org/2000/svg','g');g.classList.add('halloween-costume');g.setAttribute('pointer-events','none');g.innerHTML=costume==='cat'?'<path d="M-40-209l3-45 27 29m20 0 27-29 3 45" fill="#67546e" stroke="#363c48" stroke-width="3"/><path d="m-5-140 5 6 5-6Z" fill="#f29880" stroke="#363c48" stroke-width="2"/><path d="M-18-132l-24-5m24 11-24 4m60-10 24-5m-24 11 24 4" stroke="#363c48" stroke-width="2"/>':costume==='hero'?'<path d="M-32-112l-39 98 71-15 71 15-39-98Z" fill="#b4a4d3" stroke="#363c48" stroke-width="3"/><path d="M-38-160q38-15 76 0l-4 20-27 2-7-8-7 8-27-2Z" fill="#f29880" stroke="#363c48" stroke-width="2"/><ellipse cx="-17" cy="-151" rx="6" ry="4" fill="#fffdf4"/><ellipse cx="17" cy="-151" rx="6" ry="4" fill="#fffdf4"/>':'<path d="m-49-214 41-73 38 73Z" fill="#67546e" stroke="#363c48" stroke-width="3"/><ellipse cx="0" cy="-212" rx="62" ry="11" fill="#67546e" stroke="#363c48" stroke-width="3"/><path d="M-23-234h46" stroke="#f6b34f" stroke-width="8"/><path d="m-25-135 3-8 3 8 8 3-8 3-3 8-3-8-8-3Z" fill="#b4a4d3"/>';if(sprite.querySelector('.k-cast')){g.setAttribute('transform',costume==='hero'?'translate(0 -20)':'translate(0 -56)');sprite.querySelector('.body-rig').append(g)}else{if(el.dataset.kind==='mo')g.setAttribute('transform','translate(0 45)');(sprite.querySelector('.character-head')||sprite.querySelector('.character-breathe')||sprite).append(g)}}}
let syncing=false;
function sync(){if(syncing)return;syncing=true;document.body.classList.toggle('halloween-world',!!h.enabled);for(const el of document.querySelectorAll('[data-kind^="halloween-"]'))el.style.display=h.enabled?'':'none';dress();syncing=false}
const baseRender=J.render;J.render=()=>{baseRender();sync()};new MutationObserver(sync).observe(document.querySelector('#objects'),{childList:true});
function reward(){if(h.unlocked)return;h.unlocked=true;h.enabled=true;for(const prop of props){if(!state.owned.includes(prop.id))state.owned.push(prop.id);state.placed[state.home].push({...prop,uid:'reward-'+prop.id,s:1,layer:prop.id==='halloween-bats'?2:3.8})}J.render();window.dispatchEvent(new Event('learning-celebration'));toast('Geschafft! Deine Halloween-Welt ist freigeschaltet.')}
function observe(){if(!h.started||h.unlocked)return;let changed=false;for(const e of p.evidence||[])if((h.baseline||[]).indexOf(e.id)<0&&!h.subjects.includes(e.subject)&&paths.some(path=>path.subject===e.subject)){h.subjects.push(e.subject);changed=true}if(h.subjects.length===paths.length)reward();else if(changed)J.save()}
window.addEventListener('learning-celebration',()=>{observe();sync()});
const button=document.createElement('button');button.id='halloween-button';button.className='round-button';button.setAttribute('aria-label','Halloween-Challenge öffnen');button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6q-1-4 3-4M12 6C0 3 0 23 12 21 24 23 24 3 12 6Z"/><path d="m6 12 3-3 1 4Zm8 1 1-4 3 3ZM7 16l3 2 2-1 2 1 3-2"/></svg>';/* Seasonal collection remains available in saved worlds; no seasonal navigation. */
const dialog=document.createElement('dialog');dialog.id='halloween-dialog';dialog.setAttribute('aria-labelledby','halloween-title');document.body.append(dialog);
function open(){if(!p.starterUnlocked){window.dispatchEvent(new Event('request-starter'));return}dialog.innerHTML=`<div class="dialog-top"><div><h2 id="halloween-title">Die Halloween-Challenge</h2></div><button class="icon-button" id="halloween-close" aria-label="Schließen">×</button></div><p>Löse ab dem Start eine Aufgabe aus jedem Aufgabenbereich. Tipps und neue Versuche sind erlaubt. Bereits gelöste Aufgaben kannst du dafür wiederholen.</p><div class="challenge-list">${paths.map(path=>`<button data-challenge="${path.subject}" ${h.unlocked?'disabled':''}><span>${h.subjects.includes(path.subject)?'✓':path.icon}</span><strong>${esc(LerndachsCurriculum.sources[path.subject].title)}</strong><small>${h.subjects.includes(path.subject)?'Geschafft':'Eine Aufgabe entdecken →'}</small></button>`).join('')}</div>${h.unlocked?`<button id="halloween-toggle" class="journey-primary wide">Halloween ${h.enabled?'ausschalten':'einschalten'}</button><h3>Verkleiden & schminken</h3><div class="costume-list">${J.people().map(o=>`<label>${esc(o.name)}<select data-costume="${o.uid}" aria-label="Kostüm für ${esc(o.name)}">${[['witch','Zauberhut & Sternschminke'],['cat','Katzenohren & Schnurrhaare'],['hero','Superheld & Maske'],['none','Ohne Kostüm']].map(([id,label])=>`<option value="${id}" ${(h.costumes[o.uid]||'witch')===id?'selected':''}>${label}</option>`).join('')}</select></label>`).join('')}</div>`:`<p class="note">Deine Belohnung: Kürbislicht, Gespenst, Fledermäuse und eine Süßigkeitenschale. Dazu Kostüme und Gesichtsschminke für alle Figuren.</p><button id="challenge-start" class="journey-primary wide">${h.started?'Weiter zur ersten offenen Aufgabe':'Challenge starten'} →</button>`}`;
 dialog.querySelector('#halloween-close').onclick=()=>dialog.close();dialog.querySelector('#challenge-start')?.addEventListener('click',()=>{start();const path=paths.find(path=>!h.subjects.includes(path.subject));dialog.close();Learning.openSubject(path.subject)});dialog.querySelectorAll('[data-challenge]').forEach(b=>b.onclick=()=>{start();dialog.close();Learning.openSubject(b.dataset.challenge)});dialog.querySelector('#halloween-toggle')?.addEventListener('click',()=>{h.enabled=!h.enabled;J.save();sync();open()});dialog.querySelectorAll('[data-costume]').forEach(select=>select.onchange=()=>{h.costumes[select.dataset.costume]=select.value;J.save();sync()});if(!dialog.open)dialog.showModal()}
function start(){if(!h.started){h.started=true;h.baseline=(p.evidence||[]).map(e=>e.id);J.save()}}
window.addEventListener('learning-success',({detail})=>{if(!h.started||h.unlocked||!paths.some(path=>path.subject===detail.subject))return;if(!h.subjects.includes(detail.subject)){h.subjects.push(detail.subject);if(h.subjects.length===paths.length)reward();else J.save()}});
button.onclick=open;window.LerndachsSeason={art,sync,open};sync();
})();

;
(()=>{
const J=LerndachsJourney,p=J.profile,guide=document.querySelector('#room-guide'),modern=p.onboardingVersion===2;
const quiet=()=>document.body.classList.contains('no-motion')||matchMedia('(prefers-reduced-motion:reduce)').matches;
const lines={curtain:'',waking:'',explore:'Schau dich um. Fass alles an!',couch:'Findest du das Sofa?',dachs:'Wo steckt der Dachs?','move-in':'Gefunden! Wer zieht hier ein?',shop:'Willkommen! Such dir etwas aus.','second-item':'Was gefällt dir noch?',earn:'Für ein Rätsel gibt’s Sterne. Machst du mit?'};
let voice,voiceDone,voiceQueue=Promise.resolve(),welcomed=false,waking=false,stage,stageTimer;
function play(name){if(document.hidden||window.WorldSound?.status.enabled===false)return Promise.resolve(false);return new Promise(resolve=>{voice?.pause();voiceDone?.(false);voiceDone=resolve;voice=new Audio('audio/'+name+'.mp3');voice.volume=WorldSound?.status.volume??.6;voice.onended=()=>resolve(true);voice.onerror=()=>resolve(false);voice.play().then(()=>{if(name==='welcome')welcomed=true}).catch(()=>resolve(false))})}
function enqueue(name){voiceQueue=voiceQueue.then(()=>play(name));return voiceQueue}
function show(){document.querySelector('#room-guide-later').hidden=!['shop','second-item','earn'].includes(p.opening);document.body.dataset.opening=p.opening;guide.hidden=['curtain','waking','done'].includes(p.opening);if(guide.hidden)return;document.querySelector('#room-guide-text').textContent=lines[p.opening]||'';const action=document.querySelector('#room-guide-action');action.hidden=['explore','dachs'].includes(p.opening);action.textContent=p.opening==='couch'?'Zeig mal':p.opening==='move-in'?'Ich':p.opening==='earn'?'Sterne sammeln':p.opening==='second-item'?'Weiter':'Einrichten';document.querySelector('#room-guide-read').hidden=false;guide.classList.toggle('found-speech',modern&&p.opening==='move-in');if(modern&&p.opening==='move-in')requestAnimationFrame(()=>{const head=document.querySelector('[data-kind="dachs"] .badger-head')?.getBoundingClientRect();if(head){guide.style.setProperty('--found-top',Math.max(95,head.top-guide.offsetHeight-20)+'px');guide.style.setProperty('--found-left',Math.max(15,Math.min(innerWidth-guide.offsetWidth-15,head.left+head.width/2-80))+'px')}})}
function moveIn(){p.opening=p.introReturnOpening||'shop';delete p.introReturnOpening;J.grantStarter();J.save();J.render();show()}
function startLearning(){if(p.opening==='earn'||p.opening==='done'){p.opening='done';J.save();show();Learning.nextFresh(true)}else show()}
function sleepBehindSofa(){const sofa=Lernwelt.find('sofa')||{x:800,y:680},d=Lernwelt.find('dachs');if(d){d.x=sofa.x-60;d.y=sofa.y-180;d.s=.9;d.layer=2.9;d.pose='curled';J.render()}}
function awaken(){if(waking)return;waking=true;p.opening='waking';show();const d=Lernwelt.find('dachs'),sofa=Lernwelt.find('sofa');d.pose='waking';J.render();const head=document.querySelector('[data-kind="dachs"] .badger-sleep-head');if(!quiet())head?.animate([{filter:'brightness(.94)'},{filter:'brightness(1)'}],{duration:850});setTimeout(()=>{d.pose='standing';d.y=sofa?.y||680;J.render();const body=document.querySelector('[data-kind="dachs"] .badger-body');if(!quiet())body?.animate([{transform:'translateY(60px)'},{transform:'translateY(0)'}],{duration:650,easing:'ease-out'});setTimeout(()=>{const start={x:d.x,y:d.y};d.x=(sofa?.x||800)-25;d.y=790;d.s=1.15;d.layer=4;J.render();const node=document.querySelector(`[data-uid="${d.uid}"]`),sprite=node?.querySelector('.sprite'),gait=[];if(!quiet()){sprite?.animate([{transform:`translate(${start.x-d.x}px,${start.y-d.y}px)`},{transform:'translate(0,0)'}],{duration:1800,easing:'ease-in-out'});for(const leg of node?.querySelectorAll('.badger-leg')||[]){const sign=leg.classList.contains('left')?1:-1;gait.push(leg.animate([{transform:`rotate(${sign*22}deg)`},{transform:`rotate(${-sign*22}deg)`},{transform:`rotate(${sign*22}deg)`}],{duration:450,iterations:4}))}}setTimeout(()=>{gait.forEach(a=>a.cancel());p.opening='move-in';J.save();show();enqueue('found-you');enqueue('move-in');window.dispatchEvent(new Event('opening-changed'))},quiet()?0:1800)},quiet()?0:650)},quiet()?0:850)}
function curtain(){sleepBehindSofa();stage=document.createElement('dialog');stage.id='stage-dialog';stage.setAttribute('aria-label','Willkommen bei Lerndachs');stage.innerHTML=`<div class="stage-peek"><svg viewBox="-85 -145 190 180" aria-hidden="true">${WorldArt.badger('portrait')}<g class="stage-wave"><ellipse cx="73" cy="-22" rx="16" ry="20" fill="#9ba4a1" stroke="#363c48" stroke-width="4"/><path d="M66-30v7m8-9v8m8-5v7" stroke="#363c48" stroke-width="2" stroke-linecap="round"/></g></svg></div><div class="curtain-panel curtain-left"></div><div class="curtain-panel curtain-right"></div><div class="curtain-valance"></div><div class="stage-greeting" hidden><p>Hallo, schön dass du da bist.<br>Wollen wir spielen?</p><div><button id="stage-yes">Ja</button><button id="stage-listen" aria-label="Begrüßung anhören">${icon('sound')}</button></div></div>`;document.body.append(stage);stage.addEventListener('cancel',e=>e.preventDefault());stage.showModal();function align(){const head=document.querySelector('[data-kind="dachs"] .badger-sleep-head'),box=head?.getBoundingClientRect();const x=Math.max(70,Math.min(innerWidth-70,box?box.x+box.width/2:innerWidth*.5)),y=Math.max(210,Math.min(innerHeight-150,box?box.y+box.height/2:innerHeight*.55));stage.style.setProperty('--seam',x+'px');stage.style.setProperty('--peek-y',y+'px')}align();window.addEventListener('resize',align);stageTimer=setTimeout(()=>{align();stage.classList.add('peeking');stage.querySelector('.stage-greeting').hidden=false;stage.querySelector('#stage-yes').focus({preventScroll:true});voiceQueue=play('welcome')},1500);stage.querySelector('#stage-listen').onclick=()=>{voiceQueue=play('welcome')};const openCurtain=()=>{if(!stage.classList.contains('peeking')||stage.classList.contains('opening'))return;clearTimeout(stageTimer);if(!welcomed)enqueue('welcome');p.opening='dachs';J.save();show();stage.classList.add('opening');setTimeout(()=>{stage.close();stage.remove();window.removeEventListener('resize',align);enqueue('find-dachs')},quiet()?0:1500)};stage.querySelector('#stage-yes').onclick=openCurtain;stage.addEventListener('click',e=>{if(!e.target.closest('#stage-listen'))openCurtain()})}
function explore(id){if(modern){if(p.opening==='dachs'&&id==='dachs')awaken();return}if(p.opening==='explore'){p.openingTouches=(p.openingTouches||0)+1;if(p.openingTouches>=3){p.opening='couch';J.bring('sofa')}}else if(p.opening==='couch'&&id==='sofa'){p.opening='dachs';sleepBehindSofa();WorldSound.effect('dachs')}else if(p.opening==='dachs'&&id==='dachs'){p.opening='move-in';const d=Lernwelt.find('dachs'),s=Lernwelt.find('sofa');d.x=s?s.x+260:1020;d.y=790;d.s=1.15;d.layer=4;d.pose='standing';J.render()}else return;J.save();show()}
document.querySelector('#room-guide-action').onclick=()=>{if(p.opening==='couch'){J.bring('sofa');Lernwelt.focus('sofa')}else if(p.opening==='move-in'){if(J.player())moveIn();else LerndachsFriends.open('initial',moveIn)}else if(p.opening==='earn')startLearning();else if(p.opening==='second-item'){p.opening='earn';J.save();show()}else J.showShop()};
document.querySelector('#room-guide-later').onclick=()=>{if(!p.starterUnlocked)return;p.opening='done';J.save();J.render();show();window.dispatchEvent(new Event('opening-changed'))};
document.querySelector('#room-guide-read').onclick=()=>{if(p.opening==='dachs')enqueue('find-dachs');else if(p.opening==='move-in')enqueue('move-in');else window.LerndachsSpeech?.speak(lines[p.opening])};
window.addEventListener('world-use',e=>setTimeout(()=>explore(e.detail.id),180));window.addEventListener('world-move',e=>{if(!modern){if(['explore','couch','dachs'].includes(p.opening)&&e.detail.id==='sofa')sleepBehindSofa();explore(e.detail.id)}});window.addEventListener('world-touch',()=>{if(!modern)explore()});window.addEventListener('request-opening',show);window.addEventListener('request-earn-stars',startLearning);window.addEventListener('opening-changed',show);window.addEventListener('world-saved',()=>{if(voice){voice.volume=WorldSound?.status.volume??.6;if(WorldSound?.status.enabled===false){voice.pause();voiceDone?.(false)}}});
document.querySelector('#welcome-hint').hidden=true;if(modern&&p.opening==='curtain'){Lernwelt.switchZone('room');curtain();}else if(modern&&p.opening==='waking'){p.opening='dachs';sleepBehindSofa()}else if(modern&&p.opening==='dachs')sleepBehindSofa();else{const d=Lernwelt.find('dachs');if(d&&!d.pose){if(['explore','couch','dachs'].includes(p.opening))sleepBehindSofa();else{d.pose='standing';d.y=790;d.s=1.15;d.layer=4;J.render()}}}show();
window.addEventListener('resize',()=>{if(p.opening==='move-in')show()});
window.LerndachsOnboarding={replay:()=>enqueue(p.opening==='dachs'?'find-dachs':'move-in')};
})();

;
/* One compact, keyboard- and touch-accessible settings disclosure. */
(()=>{
const head=document.querySelector('#adventure-button');head.hidden=true;head.style.display='none';
const host=document.querySelector('.utility-buttons'),menu=document.createElement('div');menu.id='world-menu';menu.className='world-menu';menu.hidden=true;
const trigger=document.createElement('button');trigger.id='menu-toggle';trigger.className='round-button';trigger.innerHTML=icon('settings');trigger.setAttribute('aria-label','Menü öffnen');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',menu.id);
for(const [id,label] of [['day-toggle','Tag / Nacht'],['motion-toggle','Animationen'],['sound-toggle','Ton'],['help','Einstellungen']]){const b=document.getElementById(id);b.removeAttribute('title');menu.append(b)}
for(const [mode,symbol,label] of [['parents',icon('friends'),'Eltern'],['teachers','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3h20v14H11M16 17v4m-4 0h8M5 14v8m-4 0v-5q0-3 4-3t4 3v5M9 14l6-5"/><circle cx="5" cy="9" r="3"/></svg>','Lehrkräfte']]){const b=document.createElement('button');b.className='round-button';b.innerHTML=`<span aria-hidden="true">${symbol}</span><span class="menu-label">${label}</span>`;b.setAttribute('aria-label',label);b.onclick=()=>{setOpen(false);LerndachsAdults.open(mode)};menu.append(b)}
const avatar=document.createElement('button');avatar.id='avatar-editor-button';avatar.className='round-button';avatar.setAttribute('aria-label','Meine Figur');avatar.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4q-4 5-8 0Z"/></svg><span class="menu-label">Meine Figur</span>';avatar.onclick=()=>{setOpen(false);LerndachsFriends.open('change')};avatar.hidden=!LerndachsJourney.player();menu.append(avatar);window.addEventListener('world-saved',()=>{avatar.hidden=!LerndachsJourney.player()});
const legal=document.createElement('a');legal.href='impressum.html';legal.className='round-button';legal.setAttribute('aria-label','Impressum');legal.innerHTML='<span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v6m-2 0h4"/><circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none"/></svg></span><span class="menu-label">Impressum</span>';menu.append(legal);host.replaceChildren(trigger,menu);
function label(){for(const [id,text] of [['day-toggle',Lernwelt.snapshot().night?'Nacht · zu Tag wechseln':'Tag · zu Nacht wechseln'],['motion-toggle',document.body.classList.contains('no-motion')?'Animationen aus':'Animationen an'],['sound-toggle',document.getElementById('sound-toggle').getAttribute('aria-pressed')==='true'?'Ton an':'Ton aus'],['help','Einstellungen']]){const b=document.getElementById(id);let span=b.querySelector('.menu-label');if(!span){span=document.createElement('span');span.className='menu-label';b.append(span)}span.textContent=text}}
function setOpen(open){menu.hidden=!open;trigger.setAttribute('aria-expanded',String(open));if(open)label()}
trigger.onclick=()=>setOpen(menu.hidden);host.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')setOpen(true)});host.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!host.contains(document.activeElement))setOpen(false)});
host.addEventListener('focusout',()=>setTimeout(()=>{if(!host.contains(document.activeElement)&&!host.matches(':hover'))setOpen(false)},0));
menu.addEventListener('click',()=>{label()});document.addEventListener('pointerdown',e=>{if(!host.contains(e.target))setOpen(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){setOpen(false);trigger.focus()}});window.addEventListener('world-saved',()=>{if(!menu.hidden)label()});
})();

;
/* Visits and gestures are transient. Reward receipts and home positions are persistent. */
(()=>{
'use strict';
const J=LerndachsJourney,quiet=()=>document.body.classList.contains('no-motion')||matchMedia('(prefers-reduced-motion:reduce)').matches;
const running=new Set(),restores=new Set();
function animate(node,frames,options){if(!node||quiet())return;const a=node.animate(frames,options);running.add(a);a.finished.catch(()=>{}).finally(()=>running.delete(a));return a}
function stop(){for(const restore of restores)restore();restores.clear();for(const a of running)a.cancel();running.clear()}
new MutationObserver(()=>{if(quiet())stop()}).observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});matchMedia('(prefers-reduced-motion:reduce)').addEventListener?.('change',()=>{if(quiet())stop()});
function gesture(node,kind='cheer'){
 if(!node||quiet())return;const body=node.querySelector('.character-action,.pet-breathe,.cat-breathe,.badger-body')||node.querySelector('.sprite');if(!body)return;
 const dance=kind==='dance';animate(body,dance?[{transform:'translate(0,0) rotate(0)'},{transform:'translate(-9px,-4px) rotate(-9deg)'},{transform:'translate(9px,-8px) rotate(9deg)'},{transform:'translate(-9px,-4px) rotate(-9deg)'},{transform:'translate(0,0) rotate(0)'}]:[{transform:'translateY(0)'},{transform:'translateY(4px)',offset:.12},{transform:'translateY(-44px)',offset:.32},{transform:'translateY(4px)',offset:.52},{transform:'translateY(-24px)',offset:.7},{transform:'translateY(0)'}],{duration:dance?1800:1500,easing:'ease-in-out'});
 node.querySelectorAll('.character-arm').forEach(arm=>{if(!dance){raiseArms(arm);return;}const left=arm.classList.contains('character-arm-left'),angle=(left?1:-1)*(dance?65:155);animate(arm,[{transform:'rotate(0)'},{transform:`rotate(${angle}deg)`,offset:.23},{transform:`rotate(${angle+(dance?45:0)}deg)`,offset:.7},{transform:'rotate(0)'}],{duration:dance?1800:1500,easing:'ease-in-out'})});
}
function raiseArms(arm){
 // Rigid shoulder rotation preserves every path, sleeve and hand length.
 const left=arm.classList.contains('character-arm-left'),soft=arm.classList.contains('soft-arm'),leaf=arm.closest('[data-kind="mo"]');
 const sx=(left?-1:1)*(soft?44:leaf?40:36),sy=soft?-132:leaf?-81:-95;
 arm.style.transformOrigin=`${sx}px ${sy}px`;arm.style.transformBox='view-box';
 animate(arm,[{transform:'rotate(0deg)'},{transform:`rotate(${left?125:-125}deg)`,offset:.23},{transform:`rotate(${left?125:-125}deg)`,offset:.75},{transform:'rotate(0deg)'}],{duration:1500,easing:'ease-in-out'});
}
window.addEventListener('world-use',e=>{const node=document.querySelector(`[data-uid="${e.detail.uid}"]`);if(node?.classList.contains('person')||LerndachsWorld.pets.some(p=>p.id===e.detail.id))gesture(node,Math.random()<.5?'dance':'cheer')});
window.addEventListener('character-celebrate',()=>document.querySelectorAll('#objects .person,#objects [data-kind="dachs"],#dachs-visit:not([hidden])').forEach(n=>gesture(n)));
// Hover previews are visual only: they never invoke use(), sounds, purchases or saving.
const hoverRuns=new WeakMap(),hoverTimes=new WeakMap();
const hoverSelector='.movable,.furnishing-item,.people-grid>button,.card-grid .item-card,.pet-portrait,.avatar-preview,.avatar-tiles>button';
function hoverPreview(node){if(!node||quiet()||document.hidden||document.body.classList.contains('is-dragging')||performance.now()-(hoverTimes.get(node)||-2000)<900)return;hoverTimes.set(node,performance.now());const actor=node.querySelector('.character-action,.pet-breathe,.cat-breathe')||node.querySelector('.sprite,svg>g');if(!actor)return;const motions=[];if(!actor.classList.contains('character-action')&&!actor.classList.contains('character-breathe')){actor.style.transformBox='fill-box';actor.style.transformOrigin='center'}const a=animate(actor,[{transform:'translateY(0) rotate(0deg)'},{transform:'translateY(-6px) rotate(-3deg)',offset:.32},{transform:'translateY(-3px) rotate(3deg)',offset:.65},{transform:'translateY(0) rotate(0deg)'}],{duration:650,easing:'ease-in-out'});if(a)motions.push(a);for(const arm of node.querySelectorAll('.character-arm')){const sign=arm.classList.contains('character-arm-left')?1:-1;const a=animate(arm,[{transform:'rotate(0deg)'},{transform:`rotate(${sign*28}deg)`},{transform:'rotate(0deg)'}],{duration:650,easing:'ease-in-out'});if(a)motions.push(a)}for(const part of node.querySelectorAll('.pet-tail,.pet-ears')){part.style.transformBox='fill-box';part.style.transformOrigin='bottom center';const a=animate(part,[{transform:'rotate(0deg)'},{transform:'rotate(-9deg)'},{transform:'rotate(9deg)'},{transform:'rotate(0deg)'}],{duration:650,easing:'ease-in-out'});if(a)motions.push(a)}hoverRuns.set(node,motions)}
document.addEventListener('pointerover',e=>{if(e.pointerType==='touch'||e.buttons)return;const node=e.target.closest(hoverSelector);if(node&&!node.contains(e.relatedTarget))hoverPreview(node)});
document.addEventListener('pointerout',e=>{const node=e.target.closest(hoverSelector);if(node&&!node.contains(e.relatedTarget)){for(const a of hoverRuns.get(node)||[])a.cancel();hoverRuns.delete(node)}});
document.addEventListener('focusin',e=>{const node=e.target.closest(hoverSelector);if(node)hoverPreview(node)});
// Move the sprite only. Dragging, saving, or changing rooms never changes its home coordinates.
function roam(){if(document.hidden||quiet()||document.querySelector('dialog[open]')||document.body.classList.contains('is-dragging'))return;
 const nodes=[...document.querySelectorAll('#objects [data-kind="cat"],#objects [data-kind="dog"],#objects [data-kind="rabbit"],#objects [data-kind="hamster"]')];const node=nodes[Math.floor(Math.random()*nodes.length)];if(!node||node.classList.contains('selected'))return;
 const o=Lernwelt.find(node.dataset.kind),dx=o?.x>1300?-85:o?.x<150?85:Math.random()<.5?-85:85;
 animate(node.querySelector('.sprite'),[{transform:'translate(0,0)'},{transform:`translate(${dx/2}px,-7px)`,offset:.15},{transform:`translate(${dx}px,0)`,offset:.3},{transform:`translate(${dx}px,-5px)`,offset:.5},{transform:`translate(${dx/2}px,-7px)`,offset:.75},{transform:'translate(0,0)'}],{duration:6500,easing:'ease-in-out'});setTimeout(()=>{if(node.isConnected)gesture(node,'dance')},2100);
}
setInterval(roam,19000);document.querySelector('#world').addEventListener('pointerdown',stop,{capture:true});
// Keep the actual wallet unchanged in the top layer while stars arrive from a modal.
let target=Lernwelt.snapshot().balance,displayed=target,pending=0,pulse,placeholder,walletStyle,walletPortal,countFrame=0,countTarget=null,lastReminder=0;
const balance=document.querySelector('#balance'),wallet=document.querySelector('#wallet'),panel=document.querySelector('#panel');
function positionWalletPortal(){if(!placeholder||!walletPortal)return;const focused=document.activeElement?.closest('dialog[open]'),modal=focused||[...document.querySelectorAll('dialog[open]')].at(-1),parent=modal||document.body;if(walletPortal.parentElement!==parent){if(wallet.matches(':popover-open'))wallet.hidePopover();parent.append(walletPortal)}if(!wallet.matches(':popover-open'))wallet.showPopover()}
function liftWallet(){if(placeholder||!wallet.showPopover)return;const rect=wallet.getBoundingClientRect();placeholder=document.createElement('span');placeholder.setAttribute('aria-hidden','true');placeholder.style.cssText=`display:block;width:${rect.width}px;min-width:${rect.width}px;height:${rect.height}px`;wallet.before(placeholder);walletStyle=wallet.getAttribute('style');walletPortal=document.createElement('div');walletPortal.className='game-hud wallet-portal';const right=document.createElement('div');right.className='hud-right';walletPortal.append(right);right.append(wallet);wallet.setAttribute('popover','manual');Object.assign(wallet.style,{position:'fixed',inset:'auto',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',margin:'0',overflow:'visible'});positionWalletPortal()}
function lowerWallet(){if(!placeholder)return;if(wallet.matches(':popover-open'))wallet.hidePopover();wallet.removeAttribute('popover');placeholder.replaceWith(wallet);if(walletStyle===null)wallet.removeAttribute('style');else wallet.setAttribute('style',walletStyle);walletPortal.remove();placeholder=null;walletPortal=null}
new MutationObserver(positionWalletPortal).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
function eat(){if(quiet()||document.hidden)return;pulse?.cancel();pulse=animate(wallet,[{transform:'scale(1)'},{transform:'scale(1.12)',offset:.35},{transform:'scale(1)'}],{duration:160,easing:'ease-out'})}
function countUp(from=0){cancelAnimationFrame(countFrame);const node=document.querySelector('#rewards-count');if(!node||!panel.open)return;const to=Lernwelt.snapshot().balance;countTarget=to;node.parentElement.setAttribute('aria-label',to+' Sterne');if(quiet()){node.textContent=to;return}const start=performance.now();node.textContent=from;function frame(now){if(!node.isConnected||!panel.open)return;const t=Math.min(1,(now-start)/1100),value=Math.round(from+(to-from)*(1-(1-t)**3));node.textContent=value;if(t<1)countFrame=requestAnimationFrame(frame)}countFrame=requestAnimationFrame(frame)}
window.LerndachsRewards={sync(value){target=value;if(!pending){displayed=value;balance.textContent=value}const node=document.querySelector('#rewards-count');if(node&&panel.open&&countTarget!==value)countUp(Number(node.textContent)||0)},open(){countUp(0)},get pending(){return pending}};
panel.addEventListener('close',()=>{cancelAnimationFrame(countFrame);countTarget=null});
const profile=J.profile;if(!Number.isFinite(profile.walletReminderSince)){profile.walletReminderSince=Date.now();J.save()}
window.addEventListener('learning-success',()=>{profile.lastTaskAt=Date.now();lastReminder=Date.now();J.save()});
function remind(){const now=Date.now(),last=profile.lastTaskAt||profile.walletReminderSince;if(quiet()||document.hidden||profile.opening!=='done'||pending||document.querySelector('dialog[open]')||document.body.classList.contains('is-dragging')||now-last<300000||now-lastReminder<120000)return;lastReminder=now;animate(wallet,[{transform:'rotate(0deg)'},{transform:'rotate(-5deg)'},{transform:'rotate(5deg)'},{transform:'rotate(-3deg)'},{transform:'rotate(3deg)'},{transform:'rotate(0deg)'}],{duration:750,easing:'ease-in-out'})}
setInterval(remind,15000);
window.addEventListener('stars-earned',({detail})=>{
 const {from,to,stars}=detail;target=to;if(!pending)displayed=from;pending++;balance.textContent=displayed;
 queueMicrotask(()=>{
 const source=(document.querySelector('#learning-dialog[open] #answer-feedback')||document.querySelector('#dachs-visit:not([hidden]) svg')||document.querySelector('#world')).getBoundingClientRect();
 const dest=wallet.getBoundingClientRect(),layer=document.createElement('div');layer.className='star-flight-layer';layer.setAttribute('popover','manual');layer.setAttribute('aria-hidden','true');document.body.append(layer);layer.showPopover?.();if(!quiet())liftWallet();
 const count=quiet()?1:Math.min(stars,40);let arrived=0,applied=0;
 const finish=()=>{arrived++;const earned=Math.round(stars*arrived/count);displayed+=earned-applied;applied=earned;balance.textContent=displayed;eat();window.dispatchEvent(new CustomEvent('wallet-star-arrived',{detail:{balance:displayed}}));if(arrived===count){pending--;if(!pending){displayed=target;balance.textContent=target;setTimeout(()=>{if(!pending)lowerWallet()},180)}setTimeout(()=>layer.remove(),250)}};
 for(let i=0;i<count;i++){const star=document.createElement('span');star.className='flying-star';star.textContent='✦';const x=Math.max(24,Math.min(innerWidth-24,source.left+source.width/2)),y=Math.max(90,Math.min(innerHeight-70,source.top+source.height/2));star.style.cssText=`left:${x}px;top:${y}px`;layer.append(star);
 if(quiet()){star.remove();finish();continue}const dx=dest.left+dest.width/2-x,dy=dest.top+dest.height/2-y;
 const bend=90+(i%5)*18,side=dx>=0?-1:1,cx=dx*.45+side*bend,cy=dy*.4-100-(i%3)*20;
 const frames=Array.from({length:41},(_,step)=>{const t=step/40,px=2*(1-t)*t*cx+t*t*dx,py=2*(1-t)*t*cy+t*t*dy;return {offset:t,transform:`translate(calc(-50% + ${px}px),calc(-50% + ${py}px)) rotate(${(i%2?1:-1)*t*180}deg) scale(${.55+Math.sin(t*Math.PI)*.55})`,opacity:Math.min(1,t*8)}});
 const a=animate(star,frames,{duration:3400+i%3*180,delay:i*95,easing:'cubic-bezier(.35,0,.65,1)',fill:'both'});let done=false;const settle=()=>{if(done)return;done=true;star.remove();finish()};if(a)a.finished.then(settle,settle);else settle();
 }
 });
});
// The phone is fixed to the wall, independent of furniture and the scrolling scene.
const phone=document.createElementNS('http://www.w3.org/2000/svg','g');phone.id='wall-phone';phone.setAttribute('transform','translate(1120 270)');phone.setAttribute('tabindex','0');phone.setAttribute('role','button');phone.setAttribute('aria-label','Dachs anrufen');phone.innerHTML=`<title>Dachs anrufen</title><rect x="-42" y="-65" width="84" height="130" rx="20" fill="#f6cc72" stroke="#363c48" stroke-width="4"/><path d="M-24-38Q-47 0-24 36l13-12-8-14V-9l8-16Z" fill="#79c5ad" stroke="#363c48" stroke-width="4"/><path d="M-21 38q-15 35 10 35t20-26" fill="none" stroke="#363c48" stroke-width="3"/>${[0,1,2,3,4,5].map(i=>`<circle cx="${6+i%2*17}" cy="${-15+Math.floor(i/2)*18}" r="4" fill="#363c48"/>`).join('')}<text x="9" y="-39" text-anchor="middle" font-size="12" font-weight="bold" fill="#363c48">DACHS</text>`;document.querySelector('#wall-fixtures').append(phone);
for(const type of ['pointerdown','pointerup'])phone.addEventListener(type,e=>e.stopPropagation());phone.addEventListener('click',()=>visit('call'));phone.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();visit('call')}});
const visitor=document.createElement('aside');visitor.id='dachs-visit';visitor.hidden=true;visitor.setAttribute('aria-label','Dachs ist zu Besuch');visitor.innerHTML=`<div class="visit-speech"><p role="status" aria-live="polite"></p><div><button id="visit-read" aria-label="Vorlesen">${icon('sound')}</button><button id="visit-play">Zusammen spielen</button><button id="visit-later">Später</button></div></div><svg viewBox="-100 -260 200 280" aria-hidden="true">${WorldArt.badger()}</svg>`;document.querySelector('.game-shell').append(visitor);
let leaveTimer,arrivalTimer,visiting=false;
const day=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
let gait=[],visitSerial=0;
function walk(duration){
 gait.forEach(a=>a?.cancel());gait=[];if(quiet())return;
 const cycles=duration/460;
 const step=(node,frames)=>{const a=animate(node,frames,{duration:460,iterations:cycles,easing:'linear'});if(a)gait.push(a)};
 for(const [i,leg] of [...visitor.querySelectorAll('.badger-leg')].entries()){
 const sign=i?-1:1;step(leg,[{transform:`translateY(0) rotate(${sign*27}deg)`},{transform:`translateY(${i?-7:0}px) rotate(0deg)`},{transform:`translateY(0) rotate(${-sign*27}deg)`},{transform:`translateY(${i?0:-7}px) rotate(0deg)`},{transform:`translateY(0) rotate(${sign*27}deg)`}]);
 }
 for(const [i,arm] of [...visitor.querySelectorAll('.badger-arm')].entries()){const sign=i?1:-1;step(arm,[{transform:`rotate(${sign*22}deg)`},{transform:`rotate(${-sign*22}deg)`},{transform:`rotate(${sign*22}deg)`}])}
 step(visitor.querySelector('.badger-body'),[{transform:'translateY(0) rotate(-1deg)'},{transform:'translateY(-4px) rotate(0deg)'},{transform:'translateY(0) rotate(1deg)'},{transform:'translateY(-4px) rotate(0deg)'},{transform:'translateY(0) rotate(-1deg)'}]);
}
function stopWalking(){gait.forEach(a=>a?.cancel());gait=[];visitor.classList.remove('is-walking')}
function departure(){
 const serial=++visitSerial;clearTimeout(leaveTimer);clearTimeout(arrivalTimer);visiting=false;visitor.classList.add('is-walking');visitor.querySelector('svg').style.transform='scaleX(-1)';
 const distance=visitor.getBoundingClientRect().left+visitor.offsetWidth+40,duration=1700;walk(duration);
 const a=animate(visitor,[{transform:'translateX(0)'},{transform:`translateX(${-distance}px)`}],{duration,easing:'linear',fill:'forwards'});
 const done=()=>{if(serial!==visitSerial)return;visitor.hidden=true;stopWalking();a?.cancel()};if(a)a.finished.then(done,done);else done();
}
function wave(node){const arm=node.querySelector('.badger-wave,.badger-arm');if(!arm||quiet())return;animate(arm,[{transform:'rotate(0deg)'},{transform:'rotate(-30deg)'},{transform:'rotate(10deg)'},{transform:'rotate(-30deg)'},{transform:'rotate(0deg)'}],{duration:1000,easing:'ease-in-out'})}
function visit(reason='invite'){
 if(document.hidden||document.querySelector('dialog[open]'))return;
 if(reason==='call'){const resident=document.querySelector('#objects [data-kind="dachs"]');if(resident){wave(resident);return}if(visiting&&!visitor.hidden){wave(visitor);return}}
 if(J.profile.opening!=='done')return;
 const serial=++visitSerial;clearTimeout(leaveTimer);clearTimeout(arrivalTimer);visitor.getAnimations().forEach(a=>a.cancel());stopWalking();visitor.hidden=false;visiting=true;visitor.querySelector('svg').style.transform='';
 const eligible=!J.profile.firstVisitDay||day()>J.profile.firstVisitDay;
 const daily=eligible&&!Lernwelt.snapshot().receipts.includes('daily-visit-'+day());
 visitor.querySelector('p').textContent=reason==='success'?'Geschafft! Das haben wir toll gemacht!':daily?'Schön, dass du da bist! Ich schenke dir heute 25 Sterne. Magst du mit einem Rätsel noch mehr verdienen?':'Hallo! Magst du mit mir eine Aufgabe lösen und Sterne sammeln?';
 visitor.querySelector('.visit-speech > div').hidden=false;
 const duration=2200,distance=visitor.getBoundingClientRect().left+visitor.querySelector('svg').getBoundingClientRect().width+30;
 if(!quiet())visitor.classList.add('is-walking');walk(duration);
 animate(visitor,[{transform:`translateX(${-distance}px)`},{transform:'translateX(0)'}],{duration,easing:'linear'});
 arrivalTimer=setTimeout(()=>{if(!visiting||serial!==visitSerial)return;stopWalking();window.LerndachsSpeech?.speak(visitor.querySelector('p').textContent);if(daily)Lernwelt.reward('daily-visit-'+day(),25);if(reason==='success'){gesture(visitor);const player=J.player();if(player)gesture(document.querySelector(`[data-uid="${player.uid}"]`));leaveTimer=setTimeout(departure,2200)}},quiet()?0:duration);
 if(reason!=='success')leaveTimer=setTimeout(departure,24000);
}
visitor.querySelector('#visit-play').onclick=()=>{departure();if(J.profile.opening!=='done')window.dispatchEvent(new Event('request-opening'));else Learning.nextFresh(true)};visitor.querySelector('#visit-later').onclick=departure;
window.addEventListener('task-waiting',()=>visit());
visitor.querySelector('#visit-read').onclick=()=>window.LerndachsSpeech?.speak(visitor.querySelector('p').textContent);
function welcome(){if(J.profile.firstVisitDay&&day()<=J.profile.firstVisitDay)return;if(J.profile.onboardingVersion===2&&J.profile.opening!=='done')return;if(!visiting&&!document.querySelector('dialog[open]')&&!Lernwelt.snapshot().receipts.includes('daily-visit-'+day()))visit('welcome')}
setTimeout(welcome,1800);setInterval(welcome,30000);window.addEventListener('opening-changed',()=>setTimeout(welcome,1200));
window.LerndachsLiving={visit,departure,roam,gesture,wave};
})();

;
/* Modal chrome stays outside its independently scrolling content. */
(()=>{let queued=false;const ids='#close-panel,#close-character,#adult-close,#learn-close,#schedule-close,#halloween-close';function tidy(){queued=false;for(const dialog of document.querySelectorAll('dialog[open]:not(#stage-dialog)')){const close=dialog.querySelector(ids);if(!close)continue;close.hidden=false;dialog.classList.add('fixed-menu');let scroll=dialog.querySelector(':scope > .menu-scroll-content');if(!scroll){scroll=document.createElement('div');scroll.className='menu-scroll-content';for(const child of [...dialog.childNodes])if(child!==close&&!child.classList?.contains('wallet-portal'))scroll.append(child);dialog.append(scroll)}if(close.parentElement!==dialog)dialog.append(close);for(const child of [...dialog.childNodes])if(child!==scroll&&child!==close&&!child.classList?.contains('wallet-portal'))scroll.append(child)}}new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(tidy)}}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open']});tidy()})();
