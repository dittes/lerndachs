/* Original procedural effects and three original algorithmic radio loops. */
(()=>{
let ctx,master,music,enabled=state.audioSettings.enabled!==false,volume=state.audioSettings.volume??.6,station=state.audioSettings.station??0,timer,step=0,playing=false,voices=0,water,sampleNodes=[],sampleActive=false,sampleResume,activated=false;
const names=['Wiesenklang · Akustik','Pixelparty · Elektro','Mondcafé · Jazz'];
function persistAudio(){state.audioSettings={enabled,volume,station,gainVersion:1,radioSwitchVersion:1};save()}
function init(){if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=0;const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-8;limiter.knee.value=6;limiter.ratio.value=12;limiter.attack.value=.003;limiter.release.value=.15;master.connect(limiter);limiter.connect(ctx.destination);music=ctx.createGain();music.gain.value=0;music.connect(master)}ctx.resume().catch(()=>{});master.gain.setTargetAtTime(enabled?volume:0,ctx.currentTime,.03)}
function tone(hz,d=.2,type='sine',gain=.12,delay=0,dest=master){if(!ctx||voices>18)return;voices++;let o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+delay;o.type=type;o.frequency.setValueAtTime(Math.max(30,hz),t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain*(dest===music?1.25:2.5),t+.035);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(dest);o.start(t);o.stop(t+d+.02);o.onended=()=>{voices--;o.disconnect();g.disconnect()};return o}
function noise(d=.2,gain=.1,freq=1200){if(!ctx||voices>18)return;voices++;const n=ctx.createBufferSource(),b=ctx.createBuffer(1,ctx.sampleRate*d,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);n.buffer=b;const f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='lowpass';f.frequency.value=freq;g.gain.value=gain*2;n.connect(f).connect(g).connect(master);n.start();n.onended=()=>{voices--;n.disconnect();f.disconnect();g.disconnect()};return n}
function effect(id){if(!enabled)return;activated=true;init();
 if(id==='reward'){[523.25,659.25,783.99,1046.5].forEach((h,i)=>tone(h,.42,'sine',.09,i*.11));return}
 if(['sofa','bed','cushion','blanket','rug'].includes(id)){tone(147,.2,'triangle',.08);tone(220,.28,'sine',.06,.08);return}
 if(['plant','flower','hanging','tree','curtain'].includes(id)){noise(.2,.025,1600);tone(740,.18,'sine',.035,.1);return}
 if(['watering','cloud','counter'].includes(id)){noise(.45,.045,900);[660,880,1100].forEach((h,i)=>tone(h,.12,'sine',.035,i*.1));return}
 if(['table','stool','shelf','books','basket','drop','tap'].includes(id)){tone(262,.12,'triangle',.09);tone(392,.16,'sine',.035,.055);return}
 if(['tea','jar','kettle','fishbowl'].includes(id)){tone(1047,.4,'sine',.06);tone(1568,.25,'sine',.025,.035);return}
 if(['lamp','pendant','fridge','cabinet','fan','clock','radio'].includes(id)){tone(330,.08,'triangle',.07);tone(494,.14,'sine',.05,.07);return}
 if(id==='camera'){noise(.08,.035,2400);tone(784,.12,'triangle',.035,.1);return}
 if(id==='cat'){tone(110,.6,'triangle',.025);tone(165,.45,'sine',.04,.12);return}
 if(id==='dog'){tone(196,.13,'triangle',.08);tone(147,.18,'triangle',.07,.16);return}
 if(id==='rabbit'){[587,784].forEach((h,i)=>tone(h,.14,'sine',.06,i*.12));return}
 if(id==='balloon'){[392,523,784].forEach((h,i)=>tone(h,.2,'sine',.055,i*.065));return}
 if(id==='dachs'){[392,494,587].forEach((h,i)=>tone(h,.18,'triangle',.06,i*.1));return}
 if(id==='guitar'){[196,246.94,293.66,392].forEach((h,i)=>tone(h,.9,'triangle',.07,i*.05));return}
 const pitch=({radio:659,sun:659,picture:523,poster:587,cake:880,fruit:698,toaster:440})[id]||523.25;
 tone(pitch,.24,'sine',.07);tone(pitch*1.25,.28,'sine',.04,.065);
}
function tick(){if(!playing||!enabled||document.hidden)return;init();const melodies=[[0,4,7,12,7,4,2,7,5,9,12,9,7,4,2,4],[0,12,7,3,10,7,15,12,0,7,12,15,10,7,3,7],[0,4,7,11,14,11,7,4,2,5,9,12,16,12,9,5]];let base=[196,220,146.83][station],n=melodies[station][step%16],hz=base*2**(n/12);tone(hz,[.7,.18,.45][station],['triangle','triangle','sine'][station],[.09,.035,.12][station],0,music);if(step%4===0)tone(base/2,.65,'sine',.14,0,music);if(station===2&&step%2===0){tone(hz*1.25,.4,'sine',.04,.06,music);tone(hz*1.5,.4,'sine',.04,.06,music)}step++}
// This single stream belongs to the radio. There is no second ambient soundtrack.
function radio(on){
 playing=!!on;clearInterval(timer);
 if(playing){init();music.gain.setTargetAtTime(.34,ctx.currentTime,.04);tick();timer=setInterval(tick,[320,180,420][station])}
 else if(ctx)music.gain.setTargetAtTime(0,ctx.currentTime,.04);
}
function sync(){
 const shouldPlay=activated&&enabled&&!sampleActive&&current().some(o=>o.id==='radio'&&o.on);
 if(playing!==shouldPlay)radio(shouldPlay);
 if(water&&!current().some(o=>o.id==='counter'&&o.on)){water.stop();water=null}
}
function setEnabled(on){enabled=on;activated=true;init();const b=document.querySelector('#sound-toggle');b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?'Töne ausschalten':'Töne einschalten');b.style.opacity=on?'1':'.65';if(!on&&water){water.stop();water=null}sync();persistAudio()}
document.querySelector('#sound-toggle').onclick=()=>{setEnabled(!enabled);if(enabled)effect('tea')};
function setStation(n){station=(Number(n)+names.length)%names.length;step=0;if(playing)radio(true);persistAudio();toast('♪ '+names[station])}
window.addEventListener('world-use',e=>{if(e.detail.id!=='counter')return;setTimeout(()=>{if(water){water.stop();water=null}if(!enabled||!current().find(o=>o.uid===e.detail.uid)?.on)return;init();const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*.008;water=ctx.createBufferSource();water.buffer=b;water.loop=true;const f=ctx.createBiquadFilter();f.frequency.value=900;water.connect(f).connect(master);water.start()},0)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)ctx?.suspend();else if(enabled)ctx?.resume()});
function stopSample(){clearTimeout(sampleResume);for(const node of sampleNodes){try{node?.stop()}catch{}}sampleNodes=[];sampleActive=false;sync()}
function playSample(sample){
 stopSample();sampleActive=true;enabled=true;activated=true;init();radio(false);persistAudio();
 const button=document.querySelector('#sound-toggle');button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Töne ausschalten');
 let duration=0;for(const [hz,durationSeconds,gain,delay] of sample.notes){sampleNodes.push(tone(hz,durationSeconds,'sine',gain,delay));duration=Math.max(duration,(delay+durationSeconds)*1000)}
 sampleResume=setTimeout(stopSample,duration+100);return duration;
}
window.WorldSound={effect,radio,nextStation(){setStation((station+1)%names.length)},playSample,stopSample,sync,setVolume(v){volume=Math.max(0,Math.min(1,Number(v)||0));persistAudio();if(ctx)master.gain.setTargetAtTime(enabled?volume:0,ctx.currentTime,.05)},get status(){return {enabled,playing,station,volume,voices,sampleActive}}};
const soundButton=document.querySelector('#sound-toggle');soundButton.setAttribute('aria-pressed',enabled);soundButton.setAttribute('aria-label',enabled?'Töne ausschalten':'Töne einschalten');
function activate(){if(activated)return;activated=true;sync();document.removeEventListener('pointerdown',activate,true);document.removeEventListener('keydown',activate,true)}document.addEventListener('pointerdown',activate,true);document.addEventListener('keydown',activate,true);
const obs=new MutationObserver(()=>{const c=document.querySelector('#panel-content');if(activePanel==='help'&&!document.querySelector('#volume-control')){const row=document.createElement('label');row.className='volume-setting';row.innerHTML='Lautstärke <input id="volume-control" type="range" min="0" max="1" step="0.05" value="'+volume+'">';c.append(row);row.querySelector('input').oninput=e=>WorldSound.setVolume(e.target.value)}});obs.observe(document.querySelector('#panel-content'),{childList:true});
})();
