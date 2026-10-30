/* Original terrace, garden, radio shelf and the small hamster extend the same world. */
(()=>{'use strict';const K=KunterbuntShapes,{C,p,e,r,g}=K,old=WorldArt;
const shelf=()=>p('M-103-9v102m206-102v102','none',C.ink,12)+p('M-103-9v102m206-102v102','none',C.wood,6)+r(-119,-22,238,17,C.wood,5)+r(-119,84,238,17,C.wood,5)+p('M-107-17h214m-214 106h214','none','#ffe0ad',3);
old.decor.push({id:'radio-shelf',name:'Radioregal',note:'Ein Regal für Radio und Lieblingsdinge.',price:55,kind:'decor',repeatable:true});old.names['radio-shelf']='Radioregal';old.bounds['radio-shelf']=[-124,-29,248,142];
const hamster={id:'hamster',name:'Hamster Pünktchen',note:'Ein kleiner Freund mit dicken Backen und neugierigen Augen.',price:280,kind:'pet'};old.decor.push(hamster);LerndachsWorld.pets.push(hamster);old.names.hamster=hamster.name;Object.assign(old.bounds,LerndachsHamsterArt.bounds);
old.bounds.watering=LerndachsGardenArt.bounds['yard-watering'];
const gardenObjects=LerndachsGardenArt.objects;window.LerndachsGardenArt=Object.freeze({...LerndachsGardenArt,objects:()=>gardenObjects().map(o=>o.id==='yard-watering'?{...o,id:'watering'}:o)});
function art(id){if(id==='watering')return LerndachsGardenArt.art('yard-watering');if(LerndachsGardenArt.art(id))return LerndachsGardenArt.art(id);return id==='radio-shelf'?g(shelf(),'','k-art'):id==='hamster'?LerndachsHamsterArt.art(id):['milo','lumi'].includes(id)?LerndachsAvatar.art(id,LerndachsAvatar.defaults(id)):''}
for(const [id,name]of Object.entries(LerndachsGardenArt.names)){if(id==='yard-watering')continue;old.decor.push({id,name,note:'Zum Spielen und Entdecken.',price:0,kind:'yard',repeatable:false});old.names[id]=name}Object.assign(old.bounds,LerndachsGardenArt.bounds);
const priorK=KunterbuntArt.art;KunterbuntArt.art=id=>art(id)||priorK(id);const priorShell=old.shell;window.WorldArt=Object.freeze({...old,art:(id,...args)=>art(id)||old.art(id,...args),shell:(...args)=>priorShell(...args)});
const empty=LerndachsWorld.empty;LerndachsWorld.empty=(home='garden')=>{const list=empty(home),radio=list.find(o=>o.id==='radio');if(radio){radio.x=1250;radio.y=390;radio.layer=2.9}list.push({id:'radio-shelf',uid:'radio-shelf-'+home,x:1250,y:412,s:1,layer:2.8});return list};
const starterObjects=LerndachsWorld.starterObjects;LerndachsWorld.starterObjects=home=>starterObjects(home).filter(o=>o.id!=='watering');
window.LerndachsRoomExpansion={width:2000,migrate(state){
 if(!state.maxSophiaVersion){for(const person of [...Object.values(state.placed).flat(),...Object.values(state.stored).flat()]){
  if(person.id==='milo'){if(person.characterName==='Milo')person.characterName='Max';if(person.name==='Milo')person.name='Max';if(person.appearance?.skin==='#c28a64')person.appearance.skin='#f4c59d'}
  if(person.id==='lumi'){if(person.characterName==='Lumi')person.characterName='Sophia';if(person.name==='Lumi')person.name='Sophia';if(person.appearance?.hair==='#67546e')person.appearance.hair='#e7bf72'}
 }state.maxSophiaVersion=1}

 if(!state.singleWateringVersion){
  state.placed[state.home+'-outdoor']??=LerndachsGardenArt.objects();
  for(const group of [state.placed,state.stored])for(const [home,list]of Object.entries(group))group[home]=list.filter(o=>o.id!=='watering').map(o=>o.id==='yard-watering'?{...o,id:'watering'}:o);
  // Fresh outdoor placements already use the canonical name.
  const outside=state.placed[state.home+'-outdoor'];if(!outside.some(o=>o.id==='watering'))outside.push({...gardenObjects().find(o=>o.id==='yard-watering'),id:'watering'});
  if(!state.owned.includes('watering'))state.owned.push('watering');state.owned=state.owned.filter(id=>id!=='yard-watering');state.singleWateringVersion=1;
 }
 let keeper=false;for(const group of [state.placed,state.stored])for(const [home,list]of Object.entries(group))group[home]=list.filter(o=>{if(o.id!=='dachs')return true;if(keeper)return false;keeper=true;if(o.pose==='standing')o.s=1.15;return true});
for(const [home,list]of Object.entries(state.placed)){if(!state.radioShelfVersion){const radio=list.find(o=>o.id==='radio');if(radio){if(radio.x===1180&&radio.y===790){radio.x=1250;radio.y=390;radio.layer=2.9}if(!list.some(o=>o.id==='radio-shelf'))list.push({id:'radio-shelf',uid:'radio-shelf-'+home,x:radio.x,y:radio.y+22,s:1,layer:2.8})}}}if(!state.owned.includes('radio-shelf'))state.owned.push('radio-shelf');state.radioShelfVersion=1;for(const person of [...Object.values(state.placed).flat(),...Object.values(state.stored).flat()])if(person.id==='milo'&&person.appearance?.outfit==='overalls'&&person.appearance.hair==='#48443e'&&person.appearance.top==='#fff3d7')person.appearance=LerndachsAvatar.defaults('milo')}};
})();
