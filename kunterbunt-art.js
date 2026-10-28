/* Shared Kunterbunt artwork for world, catalogue, learning and teacher previews. */
(()=>{'use strict';const A=WorldArt,K=KunterbuntShapes,{C,p,e,r,g}=K;
Object.assign(A.C,{ink:C.ink,cream:C.cream,white:C.white,teal:C.mint,mint:'#a7ddbd',deep:C.deep,coral:C.coral,orange:'#efb16c',yellow:C.yellow,pink:C.pink,purple:C.purple,blue:C.sky,wood:C.wood,light:'#edbd85',brown:'#936c55',green:'#a4cc9a',leaf:'#64a487'});
const shadow=(w=40)=>e(0,3,w,8,'#363c481b');
const face=(x,y)=>e(x-15,y,4,6,C.ink)+e(x+15,y,4,6,C.ink)+p(`M${x-6} ${y+12}q6 6 12 0`,'none',C.ink,2.5);
const eyes=()=>`<g class="eye-set">${[-23,23].map(x=>e(x,-31,11,14,C.white,C.ink,2.6)+g(e(x,-30,5,8,C.ink)+e(x-1.5,-33,1.5,2.2,C.white),'','pupil character-pupils')).join('')}</g>`;
const variants={milo:{base:'milo'},lumi:{base:'lumi'},nia:{base:'lumi',skin:'#bd865e',hair:'#3d3945',shirt:C.purple},jona:{base:'milo',skin:'#f1c7a5',hair:'#b9774c',shirt:C.sky},sami:{base:'milo',skin:'#875b43',hair:'#373b43',shirt:C.yellow},ella:{base:'lumi',skin:'#f4c59d',hair:'#c48d59',shirt:C.mint}};
function character(id){const v=variants[id]||{base:'milo'},base=v.base;let s=K.person(base);if(v.skin)s=s.split(base==='milo'?C.skinM:C.skinL).join(v.skin);if(v.hair)s=s.split(base==='milo'?C.hairM:C.hairL).join(v.hair);if(v.shirt)s=s.split(base==='milo'?C.cream:C.coral).join(v.shirt);
 const end='</g></g><ellipse class="focus-ring"',at=s.lastIndexOf(end);let extra='';
 if(id==='nia')extra=p('M-10-31h20','none',C.ink,3)+e(-23,-31,18,19,'none',C.ink,3)+e(23,-31,18,19,'none',C.ink,3);
 if(id==='jona')extra=p('M-53-86q17-55 88-19l15 23Z',C.coral)+p('M-55-82h119','none',C.ink,5)+r(1,-108,20,12,C.yellow,4,C.ink,2);
 if(id==='ella')extra=K.flower(-38,-79,.55);
 if(extra)s=s.slice(0,at)+extra+s.slice(at);
 if(id==='pippa'||id==='mo'){
 const start=s.indexOf('<g class="head-rig"'),finish=s.lastIndexOf(end);let head;
 if(id==='pippa')head=p('M-54-58l-5-60 40 38m38 0 40-38-5 60', '#e5a06c')+p('M-44-78l-4-24 18 20m60 4 4-24-18 20',C.pink,C.ink,2)+p('M-58-54q0-40 58-40t58 40v27Q52 15 0 20-52 15-58-27Z','#e5a06c')+p('M-54-28q22-9 54 15 32-24 54-15-4 41-54 45-50-4-54-45Z',C.cream,'none')+eyes()+e(0,-13,7,5,C.ink)+p('M0-8v7m-9-1q9 9 18 0','none',C.ink,2.5);
 else head=p('M-57 0q-23-91 19-95 22-3 38 19 23-34 46-14Q75-64 57 0q-54 37-114 0Z','#a4cc78')+p('M0-89q-51-7-47-43 43-6 47 31 8-38 44-34 6 36-44 46Z',C.mint)+p('M-32-120l32 27 28-30','none',C.deep,2.5)+eyes()+e(-37,-9,9,5,'#d9a781')+e(37,-9,9,5,'#d9a781')+p('M-10 1q10 10 20 0','none',C.ink,2.5);
 s=s.slice(0,start)+'<g class="head-rig" transform="translate(0 -158)">'+head+s.slice(finish);s=s.split(C.skinM).join(id==='mo'?'#a4cc78':'#e5a06c');if(id==='pippa')s=s.replace('<g class="body-rig">','<g class="body-rig">'+g(p('M30-70q62 5 54-53-28 10-38 32Z','#e5a06c')+p('M78-116l-2 27-21-4Z',C.cream,C.ink,2),'','character-tail'));
 }
 s=s.replace('class="person ', 'class="k-character character-action ').replace('class="body-rig"','class="body-rig character-breathe"').replace('class="head-rig"','class="head-rig character-head"').replaceAll('class="pupil"','class="pupil character-pupils"');
 // Explicit neutral arms also work in non-animated shop / PDF previews.
 s=s.replace(/<g class="soft-arm (left|right)"([^>]*)>([\s\S]*?)<\/g>/g,(all,side,attrs,paths)=>{const sign=side==='left'?-1:1,d=`M${sign*44} -132 Q${sign*51} -105 ${sign*54} -76`;return `<g class="soft-arm ${side}"${attrs}>`+paths.replace('class="arm-outline"','class="arm-outline" d="'+d+'"').replace('class="arm-fill"','class="arm-fill" d="'+d+'"').replace('class="sleeve-outline"','class="sleeve-outline" d="M'+sign*44+' -132l'+sign*2+' 9"').replace('class="sleeve-fill"','class="sleeve-fill" d="M'+sign*44+' -132l'+sign*2+' 9"')+'</g>'});
 return g(s,'scale(.86)','k-cast');
}
function badger(pose='standing'){const fur='#9ba4a1',mask='#49515b';let head=e(-46,-104,19,20,fur,C.ink)+e(46,-104,19,20,fur,C.ink)+e(-46,-104,10,11,C.pink)+e(46,-104,10,11,C.pink)+p('M-60-70q0-46 47-49l13-12 13 12q47 3 47 49v12Q57-9 0-10-57-9-60-58Z',C.cream)+p('M-45-103q22 8 28 30l-7 36q-30-8-31-31-3-22 10-35Zm90 0q-22 8-28 30l7 36q30-8 31-31 3-22-10-35Z',mask,'none');
 head+=pose==='curled'?p('M-36-65q9 8 18 0m36 0q9 8 18 0','none',C.ink,3):e(-27,-66,10,12,C.white)+e(27,-66,10,12,C.white)+g(e(-27,-65,4.5,7,C.ink)+e(27,-65,4.5,7,C.ink),'','character-pupils');head+=e(-39,-39,9,4,C.pink)+e(39,-39,9,4,C.pink)+p('M-10-42q10-4 20 0-2 12-10 12t-10-12Z',C.ink)+p('M0-30v6m-13-3q13 13 26 0','none',C.ink,2.5);
 if(pose==='portrait')return head;
 if(pose==='curled')return shadow(62)+e(6,-38,62,40,fur,C.ink)+e(19,-39,37,24,C.cream)+g(head,'translate(-27 6) scale(.59)')+p('M36-63q44 8 26 44','none',C.ink,13)+p('M36-63q44 8 26 44','none',fur,7);
 return shadow(51)+g(e(0,-61,44,57,fur,C.ink)+e(0,-57,25,33,C.cream)+e(-27,-8,24,11,fur,C.ink)+e(27,-8,24,11,fur,C.ink)+p('M-35-88l-16 38m86-38 16 38','none',C.ink,20)+p('M-35-88l-16 38m86-38 16 38','none',fur,13)+g(head,'translate(0 -102)','badger-head')+p('M-36-113q36 12 72 0v15q-36 12-72 0Z',C.mint)+p('M23-99l22 26-20 4-12-28Z',C.mint),'','badger-body');
}
const props={
sofa:()=>g(K.sofa(),'scale(.85 .94)'),table:()=>K.table(),plant:()=>g(K.plant(),'scale(.76 .8)'),flower:()=>g(K.plant(),'scale(.7 .66)')+K.flower(0,-144,.65),radio:()=>g(K.radio(),'scale(.88 .85)'),lamp:()=>K.lamp(),tea:()=>K.tea(),
cushion:()=>shadow(34)+g(r(-39,-65,78,63,C.pink,17)+K.flower(0,-34,.8),'rotate(-6)'),
rug:()=>e(0,-4,227,62,C.yellow,C.ink)+e(0,-4,208,48,'#ffe5a3','#dda95e',2)+p('M-147-6q36-27 72 0t72 0 72 0 72 0','none',C.mint,7)+p('M-147 12q36-27 72 0t72 0 72 0 72 0','none',C.coral,6),
stool:()=>shadow(35)+p('M-25-60l-10 61m35-60v60m25-61 10 61','none',C.ink,10)+p('M-25-60l-10 61m35-60v60m25-61 10 61','none',C.wood,5)+e(0,-64,43,15,C.deep,C.ink)+e(0,-72,43,14,C.mint,C.ink)+p('M-25-76q25-8 50 0','none','#bde7cf',2),
cabinet:()=>shadow(128)+p('M-110-13v15m220-15v15','none',C.ink,9)+r(-135,-141,270,129,C.yellow,9)+r(-122,-127,114,102,'#ffdda0',6)+r(8,-127,114,102,'#ffdda0',6)+p('M-24-77h-8m56 0h8','none',C.ink,5)+r(-144,-151,288,17,C.cream,5),
fridge:()=>shadow(64)+r(-72,-283,144,280,C.mint,21)+r(-62,-272,124,102,'#bfe4cb',14)+r(-62,-159,124,144,'#bfe4cb',13)+p('M-48-247v44m0 70v43','none',C.ink,7)+g(r(-21,-26,42,48,C.cream,3,C.ink,2)+e(8,-14,5,5,C.yellow)+p('M-15 14l13-16 16 16Z',C.mint,C.ink,2),'translate(24 -210) rotate(6)')+e(17,-86,9,9,C.pink,C.ink,2.5),
counter:()=>shadow(149)+r(-163,-161,326,155,C.wood,5)+r(-150,-144,139,124,'#f5ce96',6)+r(2,-144,148,124,'#f5ce96',6)+p('M-136-112h111m-111 31h111m-111 31h111','none','#b4845c',2)+p('M-83-128h23m-23 32h23m-23 31h23m100-36h28','none',C.ink,5)+r(-175,-175,350,21,C.cream,6)+e(73,-175,52,12,C.mint,C.ink)+e(73,-175,40,7,C.deep,C.ink,2)+p('M93-181v-48q0-21-20-15-10 3-10 17','none',C.ink,10)+p('M93-181v-48q0-21-20-15-10 3-10 17','none','#dde6d8',5),
shelf:()=>p('M-91-4v27m182-27v27','none',C.ink,9)+r(-124,-18,248,16,C.wood,4)+p('M-110-13h220','none','#ffdaa5',3),
books:()=>r(-43,-72,22,72,C.coral,3)+r(-19,-86,23,86,C.yellow,3)+r(6,-65,22,65,C.mint,3)+p('M33-3 20-68l22-4L56-8Z',C.purple)+p('M-36-59h8m15-13h10m8 20h8m-55 40h8m12 0h10','none',C.cream,3),
picture:()=>r(-44,-91,88,91,C.purple,7)+r(-35,-82,70,73,C.cream,3)+g(p('M0 0v-39m0 27q-27-4-22-27 24 0 22 27m0-7q26-7 22-26-23-1-22 26',C.mint),'translate(0 -19)')+p('M-11-12h22','none',C.coral,3),
poster:()=>r(-51,-92,102,92,C.cream,4)+r(-42,-83,84,74,C.pink,1,C.ink,2)+e(20,-61,13,13,C.yellow)+p('M-41-11v-12l25-31 23 29 16-19 19 33Z',C.mint,C.ink,2)+p('M-21-48l5-6 9 11','none',C.white,3),
clock:()=>e(0,-46,47,47,C.coral,C.ink,4)+e(0,-46,37,37,C.cream,C.ink,2.5)+[0,90,180,270].map(a=>g(p('M0-78v5','none',C.ink,3),`rotate(${a} 0 -46)`)).join('')+g(p('M0-46v-24','none',C.ink,3),'','clock-hand')+p('M0-46l16 12','none',C.ink,4)+e(0,-46,4,4,C.mint,C.ink,2),
pendant:()=>p('M0-154v81','none',C.ink,4)+g(p('M-46-30q0-43 46-43t46 43Z',C.yellow)+e(0,-29,46,10,C.cream,C.ink)+e(0,-23,11,7,C.yellow),'','lamp-swing'),
garland:()=>p('M-226-30Q0 57 226-30','none',C.ink,3)+[-195,-130,-65,0,65,130,195].map((x,i)=>{const y=-8+Math.sin((i+1)/8*Math.PI)*27;return p(`M${x} ${y-17}v18`,'none',C.ink,2.5)+g(e(x,y+7,10,14,i%2?C.yellow:C.pink,C.ink,2.5),'','bulb')}).join(''),
cake:()=>shadow(36)+e(0,-3,43,8,C.mint,C.ink,2.5)+r(-32,-39,64,35,'#dca079',6)+p('M-33-36q-6-16 12-15 10-15 21-5 13-10 21 5 18-1 13 15-10 12-17 0-9 13-17 0-9 13-17 0-9 13-16 0Z',C.cream)+e(0,-65,10,12,C.coral,C.ink,2.5)+p('M0-76q5-12 13-6','none',C.deep,3)+p('M-25-15h50','none',C.cream,5),
kettle:()=>shadow(34)+p('M-25-46q-33 4-31-22 0-22 27-16','none',C.ink,9)+p('M-25-46q-33 4-31-22 0-22 27-16','none',C.deep,4)+p('M25-38l28-24 12 14-32 29Z',C.mint)+p('M-29-52q-18 41 0 47h57q18-8 0-47Z',C.mint)+r(-24,-61,48,11,C.deep,5)+e(0,-67,6,6,C.yellow,C.ink,2.5)+e(0,-28,13,12,C.cream,C.ink,2)+g(p('M48-69q-8-11 0-23','none',C.white,3),'','steam'),
fruit:()=>p('M-55-29q8 36 55 36t55-36Z',C.purple)+e(-23,-40,22,22,C.coral,C.ink)+e(17,-42,23,23,C.yellow,C.ink)+p('M-24-60q0-15 14-11','none',C.deep,4)+p('M-2-64q20 19 40-11 13 33-10 37Q9-27-2-64Z',C.yellow)+p('M-45-21h90','none','#dacced',3),
jar:()=>r(-23,-53,46,52,C.sky,10)+r(-26,-62,52,14,C.mint,5)+r(-16,-40,32,28,C.cream,4,C.ink,2)+e(0,-26,9,9,C.yellow,C.ink,2)+e(-3,-29,1.5,1.5,C.ink)+e(4,-24,1.5,1.5,C.ink),
toaster:()=>shadow(46)+r(-49,-54,98,53,C.yellow,14)+p('M-54-7h108','none',C.ink,5)+r(-30,-75,60,30,'#e9b77d',9)+r(-23,-68,46,18,'#ffe0aa',6,C.ink,2)+p('M39-41v19m0-12h16','none',C.ink,3)+e(23,-20,5,5,C.coral,C.ink,2),
balloon:()=>p('M0-28q-20 35-3 63T0 107','none',C.ink,2.5)+g(e(0,-78,39,51,C.pink,C.ink)+p('M-6-29l6-10 6 10Z',C.pink)+p('M-23-99q-6 15-4 26','none',C.cream,6),'','balloon-bob'),
watering:()=>shadow(38)+p('M-27-50q-37-27-37 10 0 20 29 16','none',C.ink,9)+p('M-27-50q-37-27-37 10 0 20 29 16','none',C.mint,4)+r(-35,-53,70,50,C.mint,10)+p('M31-36 64-64l14 15-43 35Z',C.mint)+p('M63-69 83-48','none',C.ink,7)+K.flower(-2,-28,.42),
camera:()=>shadow(35)+r(-45,-52,90,51,C.purple,10)+r(-29,-65,30,13,C.purple,5)+e(4,-27,21,21,C.cream,C.ink)+e(4,-27,13,13,C.deep,C.ink,2)+e(8,-31,4,4,C.white)+r(29,-43,10,7,C.yellow,2,C.ink,2),
guitar:()=>p('M-7-107v-65h14v65',C.wood)+p('M-13-113q-35-7-28 25 3 9-12 20-20 47 20 61h66q40-14 20-61-15-11-12-20 8-32-28-25Z',C.yellow)+e(0,-61,17,17,'#936c55',C.ink)+r(-18,-28,36,7,C.wood,2,C.ink,2)+p('M-4-153v125m4-125v125m4-125v125','none',C.cream,1.4)+r(-14,-174,28,24,C.wood,5)+p('M-19-166h6m26 9h-6','none',C.ink,3),
blanket:()=>p('M-51-96h102l5 92q-18 12-28-1-16 12-28 0-16 12-28 0-17 11-28-1Z',C.coral)+p('M-40-78h80m-80 22h80m-80 22h80','none',C.cream,7)+p('M-32-94v88m32-88v88m32-88v88','none',C.yellow,3),
basket:()=>shadow(38)+p('M-37-51q37-17 74 0l-5 49h-64Z',C.wood)+e(0,-51,37,10,C.cream,C.ink)+p('M-26-26h52m-51 13h50m-36-29v36m14-36v36m14-36v36','none','#a37854',2)+p('M-24-57v-18q24-25 48 0v18','none',C.ink,6),
fan:()=>p('M0-90v40','none',C.ink,7)+g(p('M-6-17q-94 35-93 5 4-22 92-7m19-10q27-98 47-75 13 22-37 79m-4 12q75 69 45 78-25 5-53-66Z',C.wood),'','fan-spin')+e(0,-13,17,17,C.cream,C.ink),
bed:()=>p('M-141-25v27m282-27v27','none',C.ink,10)+r(-156,-201,312,175,C.purple,35)+r(-147,-144,294,121,C.cream,14)+r(-132,-160,98,44,C.pink,14)+r(-24,-160,98,44,C.pink,14)+r(-147,-101,294,77,C.mint,10)+p('M-121-81h244m-244 24h244','none','#bce5cd',8)+r(-163,-35,326,20,C.purple,8)+K.flower(103,-181,.48),
e asel:null
};
