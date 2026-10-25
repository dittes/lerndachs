/* Original procedural effects and three original algorithmic radio loops. */
(()=>{
let ctx,master,music,enabled=state.audioSettings.enabled!==false,volume=state.audioSettings.volume??.6,station=state.audioSettings.station??0,timer,step=0,playing=false,voices=0,water,sampleNodes=[],sampleActive=false,sampleResume,activated=false;
const names=['Wiesenklang · Akustik','Pixelparty · Elektro','Mondcafé · Jazz'];
function persistAudio(){state.audioSettings={enabled,volume,station,gainVersion:1};save()}
function init(){if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=0;const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-8;limiter.knee.value=6;limiter.ratio.value=12;limiter.attack.value=.003;limiter.release.value=.15;master.connect(limiter);limiter.connect(ctx.destination);music=ctx.createGain();music.gain.value=.34;music.connect(master)}ctx.resume().catch(()=>{});master.gain.setTargetAtTime(enabled?volume:0,ctx.currentTime,.03)}
function tone(hz,d=.2,type='sine',gain=.12,delay=0,dest=master){if(!ctx||voices>18)return;voices++;let o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+delay;o.type=type;o.frequency.setValueAtTime(Math.max(30,hz),t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain*(dest===music?1.25:2.5),t+.035);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(dest);o.start(t);o.stop(t+d+.02);o.onended=()=>{voices--;o.disconnect();g.disconnect()};return o}
function noise(d=.2,gain=.1,freq=1200){if(!ctx||voices>18)return;voices++;const n=ctx.createBufferSource(),b=ctx.createBuffer(1,ctx.sampleRate*d,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);n.buffer=b;const f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='lowpass';f.frequency.value=freq;g.gain.value=gain*2;n.connect(f).connect(g).connect(master);n.start();n.onended=()=>{voices--;n.disconnect();f.disconnect();g.disconnect()};return n}
// Soft, rounded notes replace impact noise on every object interaction.
function effect(id){if(!enabled)return;init();
 if(id==='counter'){noise(.3,.025,650);return}
 if(['watering','cloud'].includes(id)){noise(.6,.045,650);return}
 if(id==='reward'){[523.25,659.25,783.99,1046.5].forEach((h,i)=>tone(h,.42,'sine',.09,i*.11));return}
 if(id==='guitar'){[196,246.94,293.66,392].forEach((h,i)=>tone(h,.9,'triangle',.07,i*.05));return}
 const pitch=({tea:784,jar:659,fishbowl:784,cat:440,dog:330,rabbit:587,camera:698,clock:880,radio:659,balloon:523,plant:523,flower:587,sun:659})[id]||523.25;
 tone(pitch,.24,'sine',.085);tone(pitch*1.25,.28,'sine',.045,.065);
}
function tick(){if(!playing||!enabled||document.hidden)return;init();const melodies=[[0,4,7,12,7,4,2,7,5,9,12,9,7,4,2,4],[0,12,7,3,10,7,15,12,0,7,12,15,10,7,3,7],[0,4,7,11,14,11,7,4,2,5,9,12,16,12,9,5]];let base=[196,220,146.83][station],n=melodies[station][step%16],hz=base*2**(n/12);tone(hz,[.7,.18,.45][station],['triangle','triangle','sine'][station],[.09,.035,.12][station],0,music);if(step%4===0)tone(base/2,.65,'sine',.14,0,music);if(station===2&&step%2===0){tone(hz*1.25,.4,'sine',.04,.06,music);tone(hz*1.5,.4,'sine',.04,.06,music)}step++}
// This single stream belongs to the radio. There is no second ambient soundtrack.
function radio(on=true){playing=!!on;clearInterval(timer);if(playing&&enabled){init();tick();timer=setInterval(tick,[320,180,420][station])}}
function setEnabled(on){enabled=on;activated=true;init();const b=document.querySelector('#sound-toggle');b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?'Töne ausschalten':'Töne einschalten');b.style.opacity=on?'1':'.65';if(!on&&water){water.stop();water=null}if(!sampleActive)radio(true);persistAudio()}
document.querySelector('#sound-toggle').onclick=()=>{setEnabled(!enabled);if(enabled)effect('tea')};
function setStation(n){station=(Number(n)+names.length)%names.length;step=0;for(const o of [...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].filter(o=>o.id==='radio'))o.on=true;activated=true;radio(true);persistAudio();toast('♪ '+names[station])}
window.addEventListener('world-use',e=>{if(e.detail.id!=='counter')return;setTimeout(()=>{if(water){water.stop();water=null}if(!enabled||!current().find(o=>o.uid===e.detail.uid)?.on)return;init();const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*.008;water=ctx.createBufferSource();water.buffer=b;water.loop=true;const f=ctx.createBiquadFilter();f.frequency.value=900;water.connect(f).connect(master);water.start()},0)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)ctx?.suspend();else if(enabled)ctx?.resume()});
function stopSample(){clearTimeout(sampleResume);for(const node of sampleNodes){try{node?.stop()}catch{}}sampleNodes=[];const resume=sampleActive;sampleActive=false;if(resume&&activated)radio(true)}
function playSample(sample){
 stopSample();sampleActive=true;enabled=true;activated=true;init();radio(false);persistAudio();
 const button=document.querySelector('#sound-toggle');button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Töne ausschalten');
 let duration=0;for(const [hz,durationSeconds,gain,delay] of sample.notes){sampleNodes.push(tone(hz,durationSeconds,'sine',gain,delay));duration=Math.max(duration,(delay+durationSeconds)*1000)}
 sampleResume=setTimeout(stopSample,duration+100);return duration;
}
window.WorldSound={effect,radio,nextStation(){setStation((station+1)%names.length)},playSample,stopSample,sync(){if(activated&&!sampleActive&&!playing)radio(true);if(water&&!current().some(o=>o.id==='counter'&&o.on)){water.stop();water=null}},setVolume(v){volume=Math.max(0,Math.min(1,Number(v)||0));persistAudio();if(ctx)master.gain.setTargetAtTime(enabled?volume:0,ctx.currentTime,.05)},get status(){return {enabled,playing,station,volume,voices,sampleActive}}};
for(const o of [...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].filter(o=>o.id==='radio'))o.on=true;
const soundButton=document.querySelector('#sound-toggle');soundButton.setAttribute('aria-pressed',enabled);soundButton.setAttribute('aria-label',enabled?'Töne ausschalten':'Töne einschalten');
function activate(){if(activated)return;activated=true;if(enabled)radio(true);document.removeEventListener('pointerdown',activate,true);document.removeEventListener('keydown',activate,true)}document.addEventListener('pointerdown',activate,true);document.addEventListener('keydown',activate,true);
const obs=new MutationObserver(()=>{const c=document.querySelector('#panel-content');if(activePanel==='help'&&!document.querySelector('#volume-control')){const row=document.createElement('label');row.className='volume-setting';row.innerHTML='Lautstärke <input id="volume-control" type="range" min="0" max="1" step="0.05" value="'+volume+'">';c.append(row);row.querySelector('input').oninput=e=>WorldSound.setVolume(e.target.value)}});obs.observe(document.querySelector('#panel-content'),{childList:true});
})();
