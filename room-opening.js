(()=>{
const J=LerndachsJourney,p=J.profile,guide=document.querySelector('#room-guide');
const lines={explore:'Schau dich um. Fass alles an!',couch:'Findest du das Sofa?',dachs:'Wo steckt Dachs?', 'move-in':'Gefunden! Wer zieht hier ein?',shop:'Willkommen! Such dir etwas aus.','second-item':'Was gefällt dir noch?',earn:'Für ein Rätsel gibt’s Sterne. Machst du mit?'};
function show(){
 document.body.dataset.opening=p.opening;
 guide.hidden=p.opening==='done';
 if(guide.hidden)return;
 document.querySelector('#room-guide-text').textContent=lines[p.opening];
 const action=document.querySelector('#room-guide-action');
 action.hidden=['explore','dachs'].includes(p.opening);
 action.textContent=p.opening==='couch'?'Zeig mal':p.opening==='move-in'?'Ich!':p.opening==='earn'?'Sterne sammeln':'Zum Laden';
 document.querySelector('#room-guide-read').hidden=!('speechSynthesis'in window);
}
function moveIn(){
 p.opening='shop';J.grantStarter();show();
}
function startLearning(){
 if(p.opening==='earn'||p.opening==='done'){
  p.opening='done';J.save();show();Learning.nextFresh(true);
 }else show();
}
function hideBehindSofa(){
 const sofa=Lernwelt.find('sofa'),dachs=Lernwelt.find('dachs');
 if(sofa&&dachs){dachs.x=sofa.x+110*(sofa.s||1);dachs.y=sofa.y-130*(sofa.s||1);dachs.layer=2.9;dachs.pose='curled';J.render()}
}
function explore(id){
 if(p.opening==='explore'){
  p.openingTouches=(p.openingTouches||0)+1;
  if(p.openingTouches>=3){p.opening='couch';J.bring('sofa')}
 }else if(p.opening==='couch'&&id==='sofa'){
  p.opening='dachs';hideBehindSofa();WorldSound.effect('dachs');
 }else if(p.opening==='dachs'&&id==='dachs'){
  p.opening='move-in';const dachs=Lernwelt.find('dachs'),sofa=Lernwelt.find('sofa');dachs.x=sofa?sofa.x+260:1020;dachs.y=790;dachs.layer=4;dachs.pose='standing';J.render();WorldSound.effect('reward');window.dispatchEvent(new CustomEvent('learning-celebration',{detail:{kind:'stars'}}));
 }else return;
 J.save();show();
}
document.querySelector('#room-guide-action').onclick=()=>{
 if(p.opening==='couch'){J.bring('sofa');Lernwelt.focus('sofa')}
 else if(p.opening==='move-in'){if(J.player())moveIn();else LerndachsFriends.open('initial',moveIn)}
 else if(p.opening==='earn')startLearning();
 else J.showShop();
};
document.querySelector('#room-guide-read').onclick=()=>{
 speechSynthesis.cancel();const speech=new SpeechSynthesisUtterance(lines[p.opening]);speech.lang='de-DE';speech.rate=.85;speechSynthesis.speak(speech);
};
window.addEventListener('world-use',e=>setTimeout(()=>explore(e.detail.id),220));
window.addEventListener('world-move',e=>{if(['explore','couch','dachs'].includes(p.opening)&&e.detail.id==='sofa')hideBehindSofa();explore(e.detail.id)});
window.addEventListener('world-touch',()=>explore());
window.addEventListener('request-opening',show);
window.addEventListener('request-earn-stars',startLearning);
window.addEventListener('opening-changed',show);
document.querySelector('#welcome-hint').hidden=true;
const dachs=Lernwelt.find('dachs');
if(dachs&&!dachs.pose){
 if(['explore','couch','dachs'].includes(p.opening))hideBehindSofa();
 else{dachs.pose='standing';dachs.y=790;dachs.layer=4;J.render()}
}
show();
})();
