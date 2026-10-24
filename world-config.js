/* Lerndachs progression catalogue. Original pet artwork; no external assets. */
(()=>{
const A=WorldArt,{C,R,E,P,G}=A;
const environment=new Set(['sun','cloud','tree','window']);
const prices={plant:30,flower:25,hanging:45,cushion:20,tea:20,radio:80,cake:25,lamp:50,sofa:90,rug:60,table:60,stool:35,cabinet:80,fridge:140,counter:120,shelf:40,books:30,picture:35,poster:30,clock:60,pendant:55,garland:50,kettle:45,fruit:30,jar:25,toaster:65,balloon:20,watering:35,camera:80,guitar:100,blanket:30,basket:35,fan:80,bed:110,easel:70,curtain:40,cat:360,fishbowl:300};
const pets=[{id:'cat',name:'Kater Krümel',note:'Ein neugieriger Freund mit einem leisen Schnurren.',price:360,kind:'pet'},
{id:'dog',name:'Hündin Nala',note:'Wedelt, spielt und bleibt gern an deiner Seite.',price:450,kind:'pet'},
{id:'rabbit',name:'Kaninchen Fips',note:'Ein kleiner Hüpfer mit großen Ohren.',price:330,kind:'pet'},
{id:'fishbowl',name:'Aquarium mit Flossi',note:'Eine kleine Unterwasserwelt zum Beobachten.',price:300,kind:'pet'}];
for(const i of A.decor){i.price=prices[i.id]??0;i.kind=environment.has(i.id)?'environment':pets.some(p=>p.id===i.id)?'pet':'decor';i.repeatable=i.kind==='decor';if(i.id==='fishbowl'){i.name='Aquarium mit Flossi';i.note=pets[3].note}}
for(const p of pets){const old=A.decor.find(i=>i.id===p.id);if(old)Object.assign(old,p);else A.decor.push(p);A.names[p.id]=p.name}
A.homes.find(h=>h.id==='atelier').price=500;A.homes.find(h=>h.id==='orchard').price=700;
A.bounds.dog=[-80,-140,185,155];A.bounds.rabbit=[-55,-155,110,170];A.bounds.fishbowl=[-95,-110,190,125];
function petArt(id){
 if(id==='dog')return `${E(0,0,62,10,'#38434c20')}${G(`${P('M47-35q40-37 39-6','none',C.wood,13)}${E(7,-35,50,30,C.light,C.ink)}${R(-35,-32,19,33,C.light,8)}${R(29,-32,19,33,C.light,8)}${E(-24,-75,43,36,C.light,C.ink)}${G(`${E(-58,-77,16,38,C.brown,C.ink)}${E(7,-77,15,35,C.brown,C.ink)}`,'pet-ears')}${E(-25,-63,26,16,C.cream,C.ink,2)}${E(-37,-82,5,7,C.ink)}${E(-12,-82,5,7,C.ink)}${E(-24,-66,8,5,C.ink)}${P('M-24-61v8m-10-2q10 11 20 0','none',C.ink,2)}${P('M-23-52q10 12 12-2',C.coral,C.ink,2)}${P('M-44-40l39 6','none',C.teal,7)}`,'pet-breathe')}`;
 if(id==='rabbit')return `${E(0,0,43,8,'#38434c20')}${G(`${E(0,-35,38,37,C.cream,C.ink)}${G(`${E(-17,-105,12,42,C.cream,C.ink)}${E(15,-104,12,41,C.cream,C.ink)}${E(-17,-110,5,28,C.pink)}${E(15,-110,5,27,C.pink)}`,'pet-ears')}${E(0,-62,35,29,C.cream,C.ink)}${E(-13,-68,5,7,C.ink)}${E(13,-68,5,7,C.ink)}${P('M-4-54l4 4 4-4Z',C.coral)}${P('M0-50v7m-9-2q9 8 18 0','none',C.ink,2)}${E(-17,-7,17,9,C.cream,C.ink)}${E(17,-7,17,9,C.cream,C.ink)}${E(35,-25,13,13,C.white,C.ink)}${E(-23,-54,6,4,C.pink)}${E(23,-54,6,4,C.pink)}`,'pet-breathe')}`;
 if(id==='fishbowl')return `${E(0,2,90,9,'#38434c20')}${R(-88,-100,176,99,'#c7edf2',13)}${R(-82,-85,164,77,C.blue,8,'none')}${P('M-80-15q18-12 38 0t40 0 40 0 40 0v13H-80Z',C.light,'none')}${P('M-62-15q-18-40 0-55m4 54q23-31 2-43','none',C.leaf,5)}${G(`${E(20,-47,23,13,C.orange,C.ink,2)}${P('M0-47l-17-11v22Z',C.orange,C.ink,2)}${E(31,-50,3,3,C.ink)}`,'fish-swim')}${G(`${E(52,-64,4,4,'none',C.white,2)}${E(43,-78,3,3,'none',C.white,2)}`,'bubbles')}${R(-93,-106,186,13,C.teal,5)}`;
 return '';
}
function empty(home='garden'){return [...A.defaults(home).filter(o=>environment.has(o.id)),{uid:'welcome-radio-'+home,id:'radio',x:1180,y:790,s:.8,layer:3.6,on:true}]}
const starter=['sofa','rug','table','stool','plant','counter','shelf','books','tea','cushion','blanket','watering'];
function starterObjects(home='garden'){return starter.map(id=>{const entries=A.defaults(home).filter(o=>o.id===id);const o=id==='plant'?entries.find(o=>o.x>1000):entries[0];return {...o,uid:'starter-'+home+'-'+id}})}
window.LerndachsWorld={environment,pets,petArt,empty,starter,starterObjects,taskReward:15};
})();
