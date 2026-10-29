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
