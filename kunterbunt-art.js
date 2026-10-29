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
 s=s.replace(/<g class="soft-arm (left|right)"([^>]*)>([\s\S]*?)<\/g>/g,(all,side,attrs,paths)=>{const sign=side==='left'?-1:1,d=`M${sign*44} -132 Q${sign*51} -105 ${sign*54} -76`;return `<g class="soft-arm ${side} character-arm character-arm-${side}"${attrs}>`+paths.replace('class="arm-outline"','class="arm-outline" d="'+d+'"').replace('class="arm-fill"','class="arm-fill" d="'+d+'"').replace('class="sleeve-outline"','class="sleeve-outline" d="M'+sign*44+' -132l'+sign*2+' 9"').replace('class="sleeve-fill"','class="sleeve-fill" d="M'+sign*44+' -132l'+sign*2+' 9"')+'</g>'});
 return g(s.replaceAll('data-person=', 'data-character-art='),'scale(.86)','k-cast');
}
function badger(pose='standing'){const fur='#9ba4a1',mask='#49515b';let head=e(-46,-104,19,20,fur,C.ink)+e(46,-104,19,20,fur,C.ink)+e(-46,-104,10,11,C.pink)+e(46,-104,10,11,C.pink)+p('M-60-70q0-46 47-49l13-12 13 12q47 3 47 49v12Q57-9 0-10-57-9-60-58Z',C.cream)+p('M-45-103q22 8 28 30l-7 36q-30-8-31-31-3-22 10-35Zm90 0q-22 8-28 30l7 36q30-8 31-31 3-22-10-35Z',mask,'none');
 head+=pose==='curled'?g(p('M-36-65q9 8 18 0m36 0q9 8 18 0','none',C.ink,3),'','badger-eyes-closed'):g(e(-27,-66,10,12,C.white)+e(27,-66,10,12,C.white)+g(e(-27,-65,4.5,7,C.ink)+e(27,-65,4.5,7,C.ink),'','character-pupils'),'','badger-eyes-open');head+=e(-39,-39,9,4,C.pink)+e(39,-39,9,4,C.pink)+p('M-10-42q10-4 20 0-2 12-10 12t-10-12Z',C.ink)+p('M0-30v6m-13-3q13 13 26 0','none',C.ink,2.5);
 if(pose==='portrait')return head;
 if(pose==='curled'||pose==='waking')return '<g class="badger-body badger-curled">'+shadow(62)+e(6,-38,62,40,fur,C.ink)+e(19,-39,37,24,C.cream)+g(head,'translate(-27 6) scale(.59)','badger-sleep-head')+p('M36-63q44 8 26 44','none',C.ink,13)+p('M36-63q44 8 26 44','none',fur,7)+'</g>';
 return shadow(51)+g(
 [-1,1].map(sign=>g(p(`M${sign*22}-40v29`,'none',C.ink,22)+p(`M${sign*22}-40v29`,'none',fur,15)+e(sign*26,-8,22,10,fur,C.ink)+p(`M${sign*26-5}-7v4m10-4v4`,'none',C.ink,1.6),'',`badger-leg ${sign<0?'left':'right'}`)).join('')+
 e(0,-68,43,53,fur,C.ink)+e(0,-65,25,32,C.cream)+
 [-1,1].map(sign=>g(p(`M${sign*35}-91q${sign*18} 17 ${sign*16} 41`,'none',C.ink,19)+p(`M${sign*35}-91q${sign*18} 17 ${sign*16} 41`,'none',fur,13)+e(sign*51,-48,10,11,fur,C.ink),'',`badger-arm ${sign<0?'left':'right'}`)).join('')+
 g(head,'translate(0 -102)','badger-head')+p('M-36-113q36 12 72 0v15q-36 12-72 0Z',C.mint)+p('M23-99l22 26-20 4-12-28Z',C.mint),'','badger-body badger-standing');
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
watering:()=>shadow(38)+p('M-26-47C-75-76-81-16-29-19','none',C.ink,12)+p('M-26-47C-75-76-81-16-29-19','none',C.mint,6)+p('M27-35 61-61 70-51 32-13Z',C.mint)+p('M-30-52h61l-2 37q-2 13-15 13H-13q-14 0-16-13Z',C.mint)+e(0,-52,31,8,C.deep,C.ink,3)+e(0,-53,23,4,'#377f75')+p('M-20-37v17q0 8 8 8','none','#bde7cf',4)+K.flower(7,-28,.33)+g(e(0,0,7,17,C.yellow,C.ink,3)+[-9,-3,3,9].map(y=>e(1,y,1.3,1.3,C.ink)).join(''),'translate(69 -58) rotate(-40)'),
camera:()=>shadow(35)+r(-45,-52,90,51,C.purple,10)+r(-29,-65,30,13,C.purple,5)+e(4,-27,21,21,C.cream,C.ink)+e(4,-27,13,13,C.deep,C.ink,2)+e(8,-31,4,4,C.white)+r(29,-43,10,7,C.yellow,2,C.ink,2),
guitar:()=>p('M-7-107v-65h14v65',C.wood)+p('M-13-113q-35-7-28 25 3 9-12 20-20 47 20 61h66q40-14 20-61-15-11-12-20 8-32-28-25Z',C.yellow)+e(0,-61,17,17,'#936c55',C.ink)+r(-18,-28,36,7,C.wood,2,C.ink,2)+p('M-4-153v125m4-125v125m4-125v125','none',C.cream,1.4)+r(-14,-174,28,24,C.wood,5)+p('M-19-166h6m26 9h-6','none',C.ink,3),
blanket:()=>p('M-51-96h102l5 92q-18 12-28-1-16 12-28 0-16 12-28 0-17 11-28-1Z',C.coral)+p('M-40-78h80m-80 22h80m-80 22h80','none',C.cream,7)+p('M-32-94v88m32-88v88m32-88v88','none',C.yellow,3),
basket:()=>shadow(38)+p('M-37-51q37-17 74 0l-5 49h-64Z',C.wood)+e(0,-51,37,10,C.cream,C.ink)+p('M-26-26h52m-51 13h50m-36-29v36m14-36v36m14-36v36','none','#a37854',2)+p('M-24-57v-18q24-25 48 0v18','none',C.ink,6),
fan:()=>p('M0-90v40','none',C.ink,7)+g(p('M-6-17q-94 35-93 5 4-22 92-7m19-10q27-98 47-75 13 22-37 79m-4 12q75 69 45 78-25 5-53-66Z',C.wood),'','fan-spin')+e(0,-13,17,17,C.cream,C.ink),
bed:()=>p('M-141-25v27m282-27v27','none',C.ink,10)+r(-156,-201,312,175,C.purple,35)+r(-147,-144,294,121,C.cream,14)+r(-132,-160,98,44,C.pink,14)+r(-24,-160,98,44,C.pink,14)+r(-147,-101,294,77,C.mint,10)+p('M-121-81h244m-244 24h244','none','#bce5cd',8)+r(-163,-35,326,20,C.purple,8)+K.flower(103,-181,.48),
easel:()=>p('M-4-173v168m-46 5 44-166L46 0','none',C.ink,13)+p('M-4-173v168m-46 5 44-166L46 0','none',C.wood,7)+r(-60,-154,120,119,C.cream,4)+p('M-47-50l26-51 37 31 30-57','none',C.mint,13)+e(28,-130,12,12,C.coral)+r(-68,-31,136,12,C.wood,3),
hanging:()=>p('M-32-61 0-153 32-61','none',C.ink,3)+g(K.plant(),'translate(0 22) scale(.7)')+g(p('M-25-55q-44 25-25 59 22 28 8 56m66-115q42 18 21 63-15 22-3 43','none',C.deep,7),'','plant-sway'),
curtain:()=>p('M-56-375q32 11 64 0L0-5q-25-13-56 0Z',C.pink)+p('M-34-352l-9 324m34-324L-10-29','none','#d58eae',3)+p('M-65-383h82','none',C.ink,5),
window:()=>p('M-254 0v-365q0-101 86-101h336q86 0 86 101V0Z','none',C.ink,9)+p('M-254 0v-365q0-101 86-101h336q86 0 86 101V0Z','none',C.wood,5)+p('M0-460V0m-247-220h494','none',C.ink,10)+p('M0-460V0m-247-220h494','none',C.cream,5)+r(-268,-8,536,17,C.cream,5)+p('M-224-351l37-35m-37 62 23-22','none',C.white,4),
sun:()=>e(0,0,49,49,C.yellow)+face(0,1),
cloud:()=>g(p('M-68 8q-18-31 9-39 0-31 28-27 17-33 42-14 30-7 36 23 33 1 30 27 19 25-13 30H-52q-28 0-16 0Z',C.white,'none'),'','cloud-drift'),
tree:()=>p('M-3 4v-147m0 68-35-35m35 19 30-44','none',C.wood,12)+g(e(-39,-148,48,57,'#83b68c')+e(20,-184,58,66,'#a4cc9a')+e(53,-133,44,49,'#83b68c')+e(0,-129,51,52,'#93c196')+[[-32,-152],[20,-210],[45,-130],[-8,-101]].map(([x,y])=>e(x,y,11,12,C.coral,C.ink,2)+p(`M${x} ${y-11}q2-11 10-10`,'none',C.deep,2)).join(''),'','tree-sway')
};
function petEyes(xs,y){return xs.map(x=>e(x,y,8,10,C.white,C.ink,2)).join('')+g(xs.map(x=>e(x,y+1,3.5,5,C.ink)+e(x-1,y-1,1,1.5,C.white)).join(''),'','character-pupils pet-pupils')}
const petArt={
 cat:()=>shadow(46)+g(g(p('M34-17q48 1 39-39','none',C.ink,13)+p('M34-17q48 1 39-39','none','#dfb48e',7),'','pet-tail')+e(0,-27,42,29,'#dfb48e',C.ink)+e(-21,-7,17,8,C.cream,C.ink)+e(21,-7,17,8,C.cream,C.ink)+p('M-34-57l-1-34 26 22m18 0 26-22-1 34','#dfb48e')+p('M-29-72v-10l10 11m39-1 9-10v10',C.pink,C.ink,2)+r(-37,-70,74,53,'#dfb48e',22)+petEyes([-16,16],-49)+p('M-4-35l4 4 4-4Z',C.coral)+p('M0-31v6m-8-2q8 9 16 0m-36-13-19-4m19 12-19 1m59-9 19-4m-19 12 19 1','none',C.ink,2),'','cat-breathe'),
 dog:()=>shadow(63)+g(g(p('M44-32q41-38 39-9','none',C.ink,14)+p('M44-32q41-38 39-9','none',C.wood,8),'','pet-tail')+e(7,-34,48,29,C.wood,C.ink)+[-26,30].map(x=>g(r(x,-29,18,29,C.cream,7),'','pet-leg')).join('')+e(-24,-76,40,33,'#edbd85',C.ink)+g(e(-57,-77,14,33,'#a77a59',C.ink)+e(8,-77,14,33,'#a77a59',C.ink),'','pet-ears')+petEyes([-38,-13],-81)+e(-25,-60,24,15,C.cream)+e(-25,-65,7,5,C.ink)+p('M-25-60v7m-10-1q10 11 20 0','none',C.ink,2)+p('M-23-49q9 11 11-3',C.coral,C.ink,2)+p('M-44-39l38 5','none',C.mint,7),'','pet-breathe'),
 rabbit:()=>shadow(41)+g(e(0,-34,36,33,C.cream,C.ink)+g(e(-16,-108,12,43,C.cream,C.ink)+e(16,-108,12,43,C.cream,C.ink)+e(-16,-111,5,28,C.pink)+e(16,-111,5,28,C.pink),'','pet-ears')+e(0,-64,34,28,C.cream,C.ink)+petEyes([-13,13],-68)+p('M-4-54l4 4 4-4Z',C.coral)+p('M0-50v7m-9-2q9 8 18 0','none',C.ink,2)+e(-17,-7,17,8,C.cream,C.ink)+e(17,-7,17,8,C.cream,C.ink)+e(34,-25,12,12,C.white,C.ink)+e(-23,-53,5,3,C.pink)+e(23,-53,5,3,C.pink),'','pet-breathe'),
 fishbowl:()=>shadow(87)+r(-87,-99,174,98,C.sky,12)+r(-80,-82,160,72,'#a8dce3',7,'none')+p('M-79-12q20-12 40 0t40 0 40 0 40 0v10H-79Z','#edbd85','none')+p('M-58-13q-18-35-2-54m5 51q20-28 2-40','none',C.mint,5)+g(p('M0-47l-17-11v22Z',C.coral,C.ink,2)+e(20,-47,23,13,C.coral,C.ink,2)+e(32,-50,5,6,C.white,C.ink,1)+g(e(33,-50,2.4,3.2,C.ink),'','character-pupils pet-pupils'),'','fish-swim')+g(e(52,-64,4,4,'none',C.white,2)+e(43,-78,3,3,'none',C.white,2),'','bubbles')+r(-92,-105,184,12,C.mint,5)
};
const seasonal={
 'halloween-pumpkin':()=>shadow(60)+p('M0-88q-4-23 13-23','none',C.deep,7)+e(0,-43,59,45,C.coral,C.ink)+e(0,-43,27,45,'#f5ba80',C.ink,2)+p('M-34-47l15-18 8 20Zm45 2 8-20 15 18ZM-29-26q29 30 58 0l-10 23h-38Z',C.yellow,C.ink,2),
 'halloween-ghost':()=>p('M-54 0v-70q0-75 54-75t54 75V0L34-16 17 0 0-16-17 0-34-16Z',C.white)+petEyes([-18,18],-81)+p('M-10-51q10 13 20 0','none',C.ink,3)+e(-35,-57,8,4,C.pink)+e(35,-57,8,4,C.pink),
 'halloween-bats':()=>p('M-160-25Q0 30 160-25','none',C.ink,3)+[-110,0,110].map(x=>g(p('M0-8l-28-20-20 25 23-1 10 16L0 6 15 12 25-4l23 1-20-25Z',C.purple,C.ink,2)+e(-5,-1,2,3,C.white)+e(5,-1,2,3,C.white),`translate(${x} 0)`)).join(''),
 'halloween-candy':()=>e(0,-25,53,17,C.purple,C.ink)+p('M-53-25q8 57 53 57t53-57Z',C.purple)+[-25,0,25].map((x,i)=>g(p('M-10-10l-10-7v24l10-7m20-10 10-7v24L10 0',C.coral,C.ink,2)+r(-11,-14,22,24,[C.yellow,C.sky,C.pink][i],7),`translate(${x} -32)`)).join('')
};
function shell(home,wallpaper=0){const wall=wallpaper%3===1?'#e6efd8':wallpaper%3===2?'#e7dff0':home==='atelier'?'#eee2f1':home==='orchard'?'#ffe8d5':C.cream;
return `<defs><clipPath id="k-outside"><path d="M80 535V185Q80 76 188 76h724q108 0 108 109v350Z"/></clipPath><radialGradient id="glow"><stop stop-color="#ffe5a0" stop-opacity=".8"/><stop offset="1" stop-color="#ffe5a0" stop-opacity="0"/></radialGradient></defs>`+r(0,0,1600,900,wall,0,'none')+`<g clip-path="url(#k-outside)">`+r(80,76,940,460,C.sky,0,'none')+p('M0 400q150-150 320-32 134-120 298-5 192-167 442 16v240H0Z','#a4cc9a','none')+p('M0 470q186-110 366-14 143-83 307-21 171-95 400 0v190H0Z','#79ad93','none')+'<g id="tree-layer"></g></g>'+r(0,535,1600,65,'#c4ddcb',0,'none')+Array.from({length:24},(_,i)=>p(`M${i*70} 540v60`,'none','#98bbaa',2)).join('')+r(0,535,1600,12,C.mint,0,C.ink,3)+r(0,596,1600,304,'#e9bc91',0,'none')+r(0,590,1600,12,C.deep,0,C.ink,3)+[648,712,791,881].map(y=>p(`M0 ${y}h1600`,'none','#c39370',2)).join('')+Array.from({length:10},(_,i)=>p(`M${i*190-70} 602l${(i-4)*27} 298`,'none','#c39370',2)).join('')+[83,310,902,1100,1450].map((x,i)=>p(`M${x} ${686+i%2*81}q17-4 37 0m-25 6h15`,'none','#cd9c73',2)).join('');
}
function houseArt(h){return p('M-72 0v-90H72V0Z',C.cream)+p('M-88-90 0-149 88-90Z',h.color)+r(-20,-62,40,62,h.color,17)+r(-58,-64,26,30,C.sky,7)+r(32,-64,26,30,C.sky,7)+p('M-45-62v26m-11-13h22m45-13v26m-11-13h22','none',C.cream,2)+p('M-83 0H83','none',C.ink,5)+e(0,-111,10,10,C.yellow,C.ink,2)}
function art(id){const s=A.chars.has(id)?character(id):id==='dachs'?badger():props[id]?.()||petArt[id]?.()||seasonal[id]?.();return s?g(s,'','k-art'):''}
for(const id of A.chars)A.bounds[id]=[-80,-250,160,265];
Object.assign(A.bounds,{mo:[-80,-266,160,280],pippa:[-80,-255,160,270],dachs:[-80,-240,160,255],sofa:[-172,-163,344,185],tea:[-38,-90,88,105],plant:[-66,-178,132,195],flower:[-62,-166,124,180],cat:[-54,-98,139,112]});
A.homes.forEach((h,i)=>h.color=[C.mint,C.purple,C.coral][i]);
window.KunterbuntArt={art,character,badger,shell,ids:[...A.chars,'dachs',...Object.keys(props),...Object.keys(petArt),...Object.keys(seasonal)]};
window.WorldArt=Object.freeze({...A,art,badger,shell,houseArt});
window.LerndachsPeopleArt.art=id=>A.chars.has(id)?art(id):'';
window.LerndachsWorld.petArt=id=>petArt[id]?art(id):'';
})();
