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
