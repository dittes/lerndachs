/* Local prototype economy. No trusted reward verification or real payments. */
(function(root){
'use strict';
function credit(state,{receiptId,stars}={}){
 if(typeof receiptId!=='string'||receiptId.length<1||receiptId.length>200||!Number.isSafeInteger(stars)||stars<1||stars>1000)throw new TypeError('Ungültige Belohnung');
 if(state.receipts.includes(receiptId))return {credited:false,balance:state.balance};
 if(!Number.isSafeInteger(state.balance+stars))throw new RangeError('Sternelimit erreicht');
 state.balance+=stars;state.receipts.push(receiptId);return {credited:true,balance:state.balance};
}
function purchase(state,item){
 if(!item||typeof item.id!=='string'||!Number.isSafeInteger(item.price)||item.price<0)throw new TypeError('Ungültiger Artikel');
 if(state.owned.includes(item.id)&&!item.repeatable)return {purchased:false,reason:'owned'};
 if(state.balance<item.price)return {purchased:false,reason:'insufficient'};
 state.balance-=item.price;if(!state.owned.includes(item.id))state.owned.push(item.id);return {purchased:true,balance:state.balance};
}
const api=Object.freeze({credit,purchase});if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WunderEconomy=api;
})(typeof window!=='undefined'?window:globalThis);

;
/* Original vector art. Each visible prop is a separate interactive entity. */
(function(root){
'use strict';
const C={ink:'#38434c',cream:'#fff4d9',white:'#fffdf4',teal:'#4fbaa8',mint:'#a8d8bb',deep:'#2a877d',coral:'#f28c72',orange:'#f6b34f',yellow:'#ffe07e',pink:'#edb9cf',purple:'#ac9bd4',blue:'#93d6eb',wood:'#c88855',light:'#e7ad73',brown:'#855643',green:'#7fbb72',leaf:'#4c9464'};
const R=(x,y,w,h,c,r=0,stroke=C.ink,sw=3)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" stroke="${stroke}" stroke-width="${sw}"/>`;
const E=(x,y,rx,ry,c,stroke='none',sw=3)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" stroke="${stroke}" stroke-width="${sw}"/>`;
const P=(d,c='none',stroke=C.ink,sw=3)=>`<path d="${d}" fill="${c}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
const G=(s,cls='',attr='')=>`<g class="${cls}" ${attr}>${s}</g>`;
const shadow=(rx=38)=>E(0,4,rx,8,'#38434c20');
function face(y=-150,skin=C.cream){return `${G(`${E(-18,y,11,14,C.white,C.ink,2)}${E(18,y,11,14,C.white,C.ink,2)}${G(`${E(-15,y+2,5,8,C.ink)}${E(21,y+2,5,8,C.ink)}${E(-17,y-1,1.8,2.5,C.white)}${E(19,y-1,1.8,2.5,C.white)}`,'character-pupils')}`,'eyes')}${E(-32,y+16,10,5,'#ef967e')}${E(32,y+16,10,5,'#ef967e')}${P(`M-9 ${y+23}q9 9 18 0`,skin)}${P(`M-2 ${y+8}q4 4 7 0`,'none',C.ink,2)}`}
function human(id){const lumi=id==='lumi',skin=lumi?'#f6bf96':'#b47b56',hair=lumi?'#685376':'#454039',shirt=lumi?'#ffc958':C.teal;
return shadow(51)+G(G(`${lumi?P('M-59-130q-10-89 60-89t62 89v35H-59Z',hair):''}${P('M-20-52v42m40-42v42','none',lumi?'#b0a1ca':'#3e777d',20)}${R(-36,-17,31,18,lumi?C.cream:C.coral,8)}${R(5,-17,31,18,lumi?C.cream:C.coral,8)}${G(P('M-36-95l-17 32','none',skin,17)+E(-53,-63,9,10,skin),'character-arm character-arm-left')}${G(P('M37-95l16 32','none',skin,17)+E(53,-63,9,10,skin),'character-arm character-arm-right')}${R(-41,-116,82,69,shirt,23)}${lumi?P('M-36-80h72m-64 16h56','none','#fff0ab',5):`${P('M-28-115v25h56v-25m-56 25v40h56v-40','#408e9a')}${R(-13,-83,26,23,'#5da9b2',6)}${E(-22,-94,3,3,C.yellow)}${E(22,-94,3,3,C.yellow)}`}${G(`${E(-50,-145,10,15,skin,C.ink)}${E(50,-145,10,15,skin,C.ink)}${R(-51,-199,102,91,skin,39)}${lumi?P('M-53-166q-5-46 22-42 13-22 48-11 36 3 39 43-28-1-45-29-14 29-64 39Z',hair):`${P('M-52-171q-3-38 30-39 25-30 63 0l14 43-16-18-17 5-14-16-20 18-17-8-23 15Z',hair)}${[-39,-18,5,26,43].map((x,i)=>E(x,-196-(i%2)*11,17,17,hair,C.ink,2)).join('')}`}${face(-151,skin)}${lumi?`${P('M28-205q-19-18-7-23 13-3 16 13 16-15 23-6 4 12-18 16Z',C.coral)}${E(37,-211,6,6,C.yellow,C.ink,2)}`:''}`,'character-head')}`,'character-breathe'),'character-action')}
function fox(){return shadow(49)+G(`${P('M35-51q65 2 47-56-25 30-46 31','#e59658')}${P('M75-88q11 8 10 20l-20-2Z',C.cream)}${P('M-21-50v40m42-40v40','none',C.brown,18)}${R(-35,-15,28,16,'#4f6a79',7)}${R(7,-15,28,16,'#4f6a79',7)}${P('M-34-93l-17 33m86-33 17 33','none','#e59658',16)}${R(-40,-115,80,70,C.teal,22)}${P('M0-109v62')}${R(-27,-81,17,18,'#7cd3bd',4)}${R(10,-81,17,18,'#7cd3bd',4)}${P('M-47-160l-8-70 43 42m23 0 44-42-8 70','#e59658')}${P('M-41-180l-4-30 18 21m67 9 4-30-18 21','#f1b7a2')}${R(-52,-196,104,89,'#e59658',37)}${P('M-49-154q23-15 49 12 26-27 49-12-7 45-49 45t-49-45Z',C.cream,'none')}${face(-151)}${E(0,-135,6,4,C.ink)}`,'character-breathe')}
function leafling(){return shadow(47)+G(`${P('M-21-39v28m42-28v28','none',C.deep,18)}${R(-36,-16,30,17,C.orange,7)}${R(6,-16,30,17,C.orange,7)}${P('M-40-81l-19 22m99-22 19 22','none',C.green,16)}${P('M-49-51q-15-88 6-112 32-33 44-1 21-38 48-1 18 32 0 114Z','#9ec96d')}${P('M-2-157q-53-6-48-46 43-10 51 31 9-44 46-40 9 36-43 55Z',C.leaf)}${face(-106,'#9ec96d')}${P('M-25-51q26 19 50 0v17h-50Z',C.teal)}${E(0,-40,5,5,C.yellow,C.ink,2)}`,'character-breathe')}
function plant(id){const hanging=id==='hanging';return `${hanging?P('M-34-72 0-155 34-72','none',C.cream,4):shadow(35)}${G(`${P('M0-15v-99m0 42q-50 5-43-42 41-2 43 42m0-14q43 5 40-40-41-1-40 40m-2 31q-44 9-46-25 35-14 46 25m3 4q39 8 48-27-30-17-48 27',C.leaf)}${P('M-23-106q10 3 17 15m21-14L4-90','none','#9ed58d',2)}${hanging?P('M-28-55q-43 22-19 62 22 20 4 38m71-99q43 22 19 62-22 20-4 38','none',C.leaf,10):''}`,'plant-sway')}${P('M-31-49h62l-6 43q-25 12-50 0Z',hanging?C.pink:C.orange)}${R(-35,-54,70,12,hanging?'#d29ab8':'#ed9b44',5)}${P('M-22-23h44','none','#ffe1a0',3)}${id==='flower'?G(`${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-132" rx="11" ry="18" fill="${C.coral}" stroke="${C.ink}" stroke-width="2" transform="rotate(${a} 0 -117)"/>`).join('')}${E(0,-117,10,10,C.yellow,C.ink,2)}`,'flower-nod'):''}`}
function art(id,variant='garden'){
const accent=variant==='atelier'?C.purple:variant==='orchard'?C.coral:C.teal;
switch(id){
case'milo':case'lumi':return human(id);case'pippa':return fox();case'mo':return leafling();
case'sun':return `${G(Array.from({length:12},(_,i)=>P('M0-65v-14','none','#ffe58c',5).replace('<path',`<path transform="rotate(${i*30})"`)).join(''),'sun-rays')}${E(0,0,51,51,'#ffe797','#f8bd59',3)}${G(`${E(-17,-5,4.5,6,C.ink)}${E(17,-5,4.5,6,C.ink)}`,'eyes')}${E(-28,9,8,5,C.coral)}${E(28,9,8,5,C.coral)}${P('M-10 12q10 13 20 0')}`;
case'cloud':return G(`${P('M-67 8q-20-38 13-43 0-37 34-27 20-40 48-12 32-4 32 25 39 3 30 36 24 28-17 30H-47q-43 0-20-9Z',C.white,'#c9e6eb',2)}${E(-10,-12,2.7,4,'#7b9ca3')}${E(12,-12,2.7,4,'#7b9ca3')}${P('M-3-2q5 4 10 0','none','#7b9ca3',2)}`,'cloud-drift');
case'tree':return `${P('M-14 10v-143h28V10Z',C.light)}${P('M0-65l-41-44m42 17 38-41','none',C.light,13)}${G(`${E(-47,-148,54,58,C.green,C.ink)}${E(27,-172,62,72,'#8ec578',C.ink)}${E(-11,-217,57,49,'#9dd183',C.ink)}${E(56,-134,47,51,C.green,C.ink)}${E(-8,-139,49,60,'#8ec578')}${[[-42,-158],[17,-215],[49,-130],[-4,-100]].map(([x,y])=>`${E(x,y,12,13,C.coral,C.ink,2)}${P(`M${x} ${y-11}q3-13 12-10`,'none',C.leaf,3)}`).join('')}`,'tree-sway')}`;
case'window':return `${P('M-254 0v-401q0-71 70-71h368q70 0 70 71V0Z','none','#fff5d8',14)}${P('M-87-465V0m174-465V0m-333-237h492','none','#fff5d8',9)}${R(-269,-9,538,23,C.light,7)}${P('M-235-421l87-43m-87 78 55-27m302 319 84-45','none','#ffffff60',7)}`;
case'curtain':return `${P('M-50-365q23 12 55 0v365q-14-20-27-4-16-19-28-2Z',C.pink)}${P('M-36-345v327m15-326v327','none','#d898b9',4)}${P('M-59-373H11','none',C.ink,6)}`;
case'sofa':return `${shadow(145)}${P('M-125-20v24m250-24v24','none',C.brown,10)}${R(-143,-154,286,137,accent,37)}${R(-129,-132,120,84,'#8ad3b5',27)}${R(9,-132,120,84,'#8ad3b5',27)}${R(-132,-69,264,48,'#77c5aa',15)}${R(-164,-105,42,92,accent,17)}${R(122,-105,42,92,accent,17)}${P('M-143-102v62m286-62v62','none','#b4e4c9',4)}`;
case'rug':return `${E(0,-4,228,63,'#f6c772',C.ink)}${E(0,-4,207,49,'#ffe7ad','#ddaa62',3)}${P('M-130-4q40-40 87 0t87 0 87 0','none','#dc9d62',8)}${P('M-130 15q40-40 87 0t87 0 87 0','none','#76b6ac',8)}`;
case'cushion':return `${P('M-30-59q-18-23-29-5-18 25 4 33-21 22-1 35 24 12 31-9 24 25 39 4 9-22-11-29 23-22 1-38-18-9-34 9Z',C.pink)}${E(-14,-32,19,19,C.yellow,C.ink)}${E(-20,-34,2.5,3,C.ink)}${E(-8,-34,2.5,3,C.ink)}${P('M-19-25q5 5 10 0','none',C.ink,2)}`;
case'table':return `${shadow(98)}${P('M-76-67l-14 65m152-65L76-2','none',C.brown,11)}${E(0,-67,125,41,C.wood,C.ink,4)}${E(0,-74,125,35,C.light,C.ink)}${P('M-84-75q68-25 143-2m-120 14q56 13 102-1','none','#f4c28e',3)}`;
case'stool':return `${P('M-25-60l-11 59m36-56v55m25-58 11 59','none',C.brown,8)}${E(0,-66,42,14,accent,C.ink)}${E(0,-72,42,14,'#8bcdb9',C.ink)}`;
case'cabinet':return `${shadow(130)}${P('M-110-13v15m220-15v15','none',C.brown,9)}${R(-135,-141,270,129,'#edb56e',8)}${R(-121,-127,113,102,C.light,5)}${R(8,-127,113,102,C.light,5)}${E(-24,-77,4,4,C.ink)}${E(24,-77,4,4,C.ink)}${P('M-144-145h288v14h-288Z',C.cream)}${P('M-107-106h70m-70 15h70m80 62h64','none','#f7cb8e',3)}`;
case'fridge':return `${shadow(64)}${R(-72,-283,144,280,'#a5d9ce',20)}${R(-62,-272,124,102,'#c5e9db',14)}${R(-62,-159,124,144,'#c5e9db',12)}${P('M-48-249v47m0 67v47','none',C.deep,7)}${R(7,-226,39,39,'#fff2bb',3)}${P('M15-198l10-15 12 12','none',C.green,5)}${E(34,-217,4,4,C.coral)}${E(18,-83,9,9,C.pink,C.ink,2)}`;
case'counter':return `${shadow(151)}${R(-163,-161,326,155,'#e6ac69',4)}${R(-150,-144,139,124,'#f4cc8b',4)}${R(2,-144,148,124,'#f4cc8b',4)}${R(-175,-175,350,21,C.cream,6)}${P('M-136-128h109m-109 19h109m-109 19h109m-109 19h109','none','#d49a5e',2)}${P('M-81-99h23m110 0h30','none',C.brown,6)}${E(73,-175,52,12,'#a6cec5',C.ink)}${E(73,-175,40,7,'#6eaea7',C.ink,2)}${P('M93-181v-48q0-21-20-15-10 3-10 17','none',C.ink,9)}${P('M93-181v-48q0-21-20-15-10 3-10 17','none','#e0e6d3',5)}`;
case'shelf':return `${R(-124,-17,248,15,C.wood,4)}${P('M-91-2v24m182-24v24','none',C.brown,9)}${P('M-126-17h252','none','#f1bd87',3)}`;
case'books':return `${R(-43,-72,22,72,C.coral,3)}${R(-19,-86,23,86,C.yellow,3)}${R(6,-65,22,65,C.teal,3)}${P('M33-3 20-68l22-4L56-8Z',C.purple)}${P('M-36-59h8m15-13h10m8 20h8m-55 40h8m12 0h10','none',C.cream,3)}`;
case'picture':return `${R(-44,-91,88,91,C.wood,5)}${R(-35,-82,70,73,C.cream,2)}${E(0,-49,24,27,'#98cab6')}${E(-9,-50,3,4,C.ink)}${E(9,-50,3,4,C.ink)}${P('M-7-36q7 7 14 0','none',C.ink,2)}${P('M-28-74h6m-6 6h6','none',C.orange,3)}`;
case'poster':return `${R(-51,-92,102,92,C.cream,3)}${R(-41,-82,82,72,'#e4b6cb',0,C.ink,1)}${E(17,-63,13,13,C.yellow)}${P('M-40-12v-13l25-28 21 24 16-17 20 34Z',C.teal,'none')}`;
case'clock':return `${E(0,-46,47,47,C.orange,C.ink,4)}${E(0,-46,38,38,C.cream,C.ink,2)}${[0,1,2,3].map(i=>P('M0-77v5','none',C.ink,3).replace('<path',`<path transform="rotate(${i*90} 0 -46)"`)).join('')}${G(P('M0-46v-23'),'clock-hand')}${P('M0-46l16 12','none',C.ink,4)}${E(0,-46,4,4,C.coral,C.ink,2)}`;
case'pendant':return `${P('M0-154v83','none',C.ink,4)}${G(`${P('M-46-30q0-42 46-42t46 42Z',accent)}${E(0,-29,46,11,C.cream,C.ink)}${E(0,-25,12,12,C.yellow,C.ink,2)}${E(0,5,65,45,'#ffe58c20')}`,'lamp-swing')}`;
case'garland':return `${P('M-226-30Q0 57 226-30')}${[-195,-130,-65,0,65,130,195].map((x,i)=>{let y=-8+Math.sin((i+1)/8*Math.PI)*27;return `${P(`M${x} ${y-17}v18`,'none',C.ink,2)}${G(E(x,y+7,10,14,i%2?C.yellow:C.cream,C.ink,2),'bulb',`style="--delay:${i*.4}s"`)}`}).join('')}`;
case'tea':return `${shadow(31)}${E(0,-2,37,7,C.cream,C.ink,2)}${P('M22-40q27-6 23 13-2 12-24 7','none',C.ink,6)}${P('M22-40q27-6 23 13-2 12-24 7','none',C.orange,3)}${R(-25,-50,50,48,C.orange,10)}${E(0,-48,23,6,'#9d654d',C.ink,2)}${P('M-13-22h26','none',C.yellow,3)}${G(P('M-9-62q-11-12 0-24m19 24q-11-12 0-24','none',C.white,4),'steam')}`;
case'cake':return `${shadow(36)}${E(0,-3,43,9,'#bbdacf',C.ink,2)}${R(-32,-38,64,34,'#e5a779',7)}${P('M-34-36q-6-18 13-16 9-15 21-5 14-10 21 5 18-2 13 16-11 12-17 0-10 14-17 0-11 13-17 0-9 13-17 0Z',C.cream)}${E(0,-65,11,12,C.coral,C.ink,2)}${P('M0-75q2-12 12-8','none',C.leaf,3)}${P('M-24-16h48','none',C.cream,5)}`;
case'radio':return `${shadow(50)}${P('M-22-66v-14h44v14m12 0 25-47','none',C.ink,4)}${R(-56,-65,112,65,C.coral,14)}${E(-22,-32,23,23,C.cream,C.ink)}${[-10,-3,4,11].map(y=>P(`M-37 ${-32+y}h30`,'none',C.wood,2)).join('')}${R(11,-50,33,12,C.cream,3)}${E(21,-20,7,7,C.teal,C.ink,2)}${E(40,-20,5,5,C.yellow,C.ink,2)}`;
case'lamp':return `${shadow(45)}${P('M-10-7v-71h20v51q0 12 17 12v12h-54v-12Z',C.cream)}${P('M-59-67q2-64 59-64t59 64Z',C.coral)}${E(-27,-84,10,8,C.cream,C.ink,2)}${E(13,-109,13,9,C.cream,C.ink,2)}${E(32,-78,8,6,C.cream,C.ink,2)}${G(E(0,-62,60,14,'#ffe58c70'),'bulb')}`;
case'kettle':return `${shadow(34)}${P('M-21-58q-38-14-40 16m89-3 23-17v22L27-17',C.teal)}${P('M-30-52q-19 37 0 46h56q20-9 0-46Z',C.teal)}${R(-22,-61,44,10,C.deep,5)}${E(0,-67,7,7,C.yellow,C.ink,2)}${E(0,-28,13,12,C.cream,C.ink,2)}${G(P('M42-69q-9-11 0-23m12 19q-9-12 0-23','none',C.white,4),'steam')}`;
case'fruit':return `${P('M-55-30q8 37 55 37t55-37Z',C.purple)}${E(-22,-38,22,22,C.coral,C.ink,2)}${E(16,-40,22,23,C.orange,C.ink,2)}${P('M-24-59q0-16 16-12','none',C.leaf,4)}${P('M-1-63q18 16 40-12 15 33-10 37Q9-25-1-63Z',C.yellow)}${P('M-49-24h98','none','#ccbce9',4)}`;
case'jar':return `${R(-22,-52,44,51,'#afdcd6',9)}${R(-25,-60,50,13,C.teal,4)}${R(-16,-41,32,27,C.cream,4)}${E(0,-27,9,9,C.orange,C.ink,2)}`;
case'toaster':return `${shadow(49)}${R(-49,-54,98,53,C.yellow,13)}${P('M-54-9h108','none',C.brown,5)}${R(-30,-74,60,29,'#eac695',9)}${R(-23,-69,46,18,'#f5ddad',6)}${P('M39-41v19m0-12h16')}${E(23,-20,5,5,C.coral,C.ink,2)}`;
case'balloon':return `${P('M0-28q-22 37-3 66T0 107','none',C.ink,2)}${G(`${E(0,-78,39,51,C.pink,C.ink)}${P('M-5-30l5-9 5 9Z',C.pink)}${P('M-22-99q-6 16-4 27','none','#ffe5ee',7)}`,'balloon-bob')}`;
case'cat':return shadow(43)+G(`${P('M36-12q43-5 35-40','none','#c79975',13)}${E(0,-25,42,32,'#c79975',C.ink)}${P('M-34-48l-2-40 27 21m19 0 27-21-3 40','#c79975')}${R(-37,-72,74,55,'#c79975',22)}${G(P('M-23-47q6-8 12 0m22 0q6-8 12 0'),'eyes')}${P('M-4-35l4 4 4-4Z',C.coral)}${P('M0-31q-4 7-10 1m10-1q4 7 10 1m-27-4-18-4m18 11-18 2m52-9 18-4m-18 11 18 2','none',C.ink,2)}`,'cat-breathe');
case'fishbowl':return `${shadow(44)}${P('M-32-78q-3 14-15 26-21 49 10 55h74q31-6 10-55-12-12-15-26Z','#b4e6ed')}${P('M-43-50q43-12 86 0v38q-43 31-86 0Z','#7bd1df','none')}${E(0,-78,34,8,C.white,C.ink)}${G(`${E(2,-28,21,12,C.orange,C.ink,2)}${P('M-17-29l-16-10v21Z',C.orange)}${E(12,-30,3,3,C.ink)}`,'fish-swim')}${G(`${E(20,-50,4,4,'none',C.white,2)}${E(28,-62,3,3,'none',C.white,2)}`,'bubbles')}${P('M-29-9q-10-19 0-24m3 24q17-13 5-23','none',C.leaf,4)}`;
case'watering':return `${shadow(40)}${P('M-28-51q-38-26-37 11 0 21 31 16','none',C.ink,6)}${P('M-28-51q-38-26-37 11 0 21 31 16','none',C.teal,3)}${R(-35,-53,70,50,C.teal,10)}${P('M31-36 64-64l14 15-43 35Z',C.teal)}${P('M63-69 83-48','none',C.ink,8)}`;
case'camera':return `${shadow(36)}${R(-45,-52,90,51,C.purple,10)}${R(-28,-64,30,13,C.purple,5)}${E(4,-27,21,21,C.cream,C.ink)}${E(4,-27,13,13,C.deep,C.ink,2)}${E(8,-31,4,4,C.white)}${R(29,-43,10,7,C.yellow,2)}`;
case'guitar':return `${P('M-9-107v-65h18v65','none',C.ink,11)}${P('M-9-107v-65h18v65','none',C.light,6)}${P('M-13-113q-36-7-28 25 3 9-12 20-20 47 20 61h66q40-14 20-61-15-11-12-20 8-32-28-25Z',C.orange)}${E(0,-61,17,17,C.brown,C.ink)}${R(-18,-28,36,7,C.wood,2)}${P('M-4-153v125m8-125v125','none',C.cream,1.5)}${R(-14,-174,28,24,C.wood,5)}`;
case'blanket':return `${P('M-51-96h102l5 92q-18 12-28-1-16 12-28 0-16 12-28 0-17 11-28-1Z',C.coral)}${P('M-39-80h78m-78 20h78m-78 20h78m-78 20h78','none',C.yellow,6)}${P('M-34-93v88m34-88v88','none','#fbe3b4',3)}`;
case'basket':return `${shadow(40)}${P('M-38-51q38-17 76 0l-5 49h-66Z',C.light)}${E(0,-51,38,11,C.cream,C.ink)}${P('M-28-28h56m-55 13h54m-42-30v38m14-38v38m14-38v38','none','#bc844f',2)}${P('M-24-57v-18q24-26 48 0v18','none',C.ink,6)}`;
case'plant':case'flower':case'hanging':return plant(id);
case'fan':return `${P('M0-90v40','none',C.ink,7)}${G(P('M-6-17q-94 35-93 5 4-22 92-7m19-10q27-98 47-75 13 22-37 79m-4 12q75 69 45 78-25 5-53-66Z','#edc58d'),'fan-spin')}${E(0,-13,17,17,C.cream,C.ink)}`;
case'bed':return `${P('M-141-25v27m282-27v27','none',C.brown,10)}${R(-156,-201,312,175,'#acb6d5',35)}${R(-147,-144,294,121,C.cream,14)}${R(-132,-160,98,44,C.pink,14)}${R(-24,-160,98,44,C.pink,14)}${R(-147,-101,294,77,C.teal,10)}${P('M-121-81h244m-244 23h244','none','#b9e3cc',9)}${R(-163,-35,326,20,'#acb6d5',8)}`;
case'easel':return `${P('M-4-173v168m-46 5 44-166L46 0','none',C.wood,10)}${R(-60,-154,120,119,C.cream,4)}${P('M-47-50l26-51 37 31 30-57','none',C.teal,13)}${E(28,-130,12,12,C.coral)}${R(-68,-31,136,12,C.light,3)}`;
default:return R(-25,-50,50,50,C.pink,12);
}}
const cast=[{id:'milo',name:'Milo',note:'Hat immer eine neue Idee.',price:0},{id:'lumi',name:'Lumi',note:'Sammelt Farben und Geschichten.',price:0},{id:'pippa',name:'Pippa',note:'Bereit für jedes kleine Abenteuer.',price:120},{id:'mo',name:'Mo',note:'Ein Blatt voller guter Laune.',price:180}];
const homes=[{id:'garden',name:'Gartenloft',note:'Licht, Pflanzen und jede Menge Platz.',price:0,color:C.teal},{id:'atelier',name:'Wolkenatelier',note:'Dein buntes Zuhause zum Erfinden.',price:240,color:C.purple},{id:'orchard',name:'Pfirsichhaus',note:'Ein sonniger Winkel im Obstgarten.',price:360,color:C.coral}];
const names={plant:'Monstera',flower:'Blumentopf',hanging:'Hängepflanze',cushion:'Blumenkissen',tea:'Teetasse',radio:'Kofferradio',cake:'Beerentörtchen',lamp:'Pilzlampe',sofa:'Sofa',rug:'Wellenteppich',table:'Sofatisch',stool:'Hocker',cabinet:'Kommode',fridge:'Kühlschrank',counter:'Kücheninsel',shelf:'Wandregal',books:'Lieblingsbücher',picture:'Freundebild',poster:'Bergposter',clock:'Wanduhr',pendant:'Hängelampe',garland:'Lichterkette',kettle:'Teekessel',fruit:'Obstschale',jar:'Keksdose',toaster:'Toaster',balloon:'Luftballon',cat:'Kater Krümel',fishbowl:'Fischglas',watering:'Gießkanne',camera:'Sofortbildkamera',guitar:'Gitarre',blanket:'Kuscheldecke',basket:'Weidenkorb',fan:'Deckenventilator',bed:'Wolkenbett',easel:'Staffelei',sun:'Sonne',cloud:'Wolke',tree:'Pfirsichbaum',window:'Panoramafenster',curtain:'Vorhang'};
const prices={radio:90,cake:70,lamp:100,bed:140,easel:110};
const bounds={cushion:[-65,-85,130,105],milo:[-65,-235,130,245],lumi:[-65,-238,130,248],pippa:[-65,-238,155,248],mo:[-65,-225,130,235],sun:[-85,-85,170,170],cloud:[-90,-100,200,135],tree:[-110,-280,230,300],window:[-275,-482,550,510],curtain:[-65,-382,83,395],sofa:[-170,-160,340,180],rug:[-230,-70,460,135],table:[-130,-115,260,130],stool:[-50,-95,100,105],cabinet:[-150,-150,300,165],fridge:[-78,-290,156,305],counter:[-180,-255,360,270],shelf:[-130,-28,260,55],books:[-50,-90,115,100],picture:[-48,-95,96,100],poster:[-55,-96,110,103],clock:[-52,-99,104,110],pendant:[-70,-160,140,215],garland:[-235,-40,470,100],tea:[-40,-100,95,115],cake:[-46,-95,92,110],radio:[-62,-120,130,135],lamp:[-65,-137,130,150],kettle:[-65,-110,135,125],fruit:[-60,-90,120,110],jar:[-30,-65,60,75],toaster:[-58,-80,116,95],balloon:[-45,-140,90,255],cat:[-50,-100,130,115],fishbowl:[-56,-95,112,110],watering:[-72,-75,160,90],camera:[-50,-70,100,85],guitar:[-65,-180,130,190],blanket:[-60,-105,120,120],basket:[-45,-100,90,115],hanging:[-78,-160,156,245],plant:[-65,-140,130,160],flower:[-65,-160,130,180],fan:[-105,-110,210,190],bed:[-170,-210,340,230],easel:[-74,-180,148,195]};
const decor=Object.keys(names).map(id=>({id,name:names[id],note:({radio:'Antippen und mittanzen.',cake:'Ein Stück für dich?',lamp:'Für gemütliche Nächte.',fishbowl:'Ein kleiner Freund zieht seine Kreise.',cat:'Schnurrt am liebsten in der Sonne.'})[id]||'Anfassen, verschieben, neu erfinden.',price:prices[id]||0}));
const chars=new Set(cast.map(x=>x.id));
function layer(id){if(chars.has(id))return 4;if(['sun','cloud','tree'].includes(id))return 0;if(['window','curtain'].includes(id))return 1;if(id==='rug')return 1.5;if(['shelf','picture','poster','clock','garland','hanging','pendant','fan'].includes(id))return 2;return 3}
function defaults(home='garden'){
let list=[],n=0;const add=(id,x,y,s=1,l=layer(id),extra={})=>list.push({uid:home+'-'+(++n),id,x,y,s,layer:l,...extra});
add('sun',745,173);add('cloud',287,193,1.15);add('cloud',924,273,.8);add('cloud',509,332,.62);add('tree',159,537,1.05);add('tree',974,529,.9);
add('window',550,535,1,1,{sx:1.82});add('curtain',94,527);add('curtain',1048,527,1,1,{flip:true});
add('garland',720,91,1.36);add('hanging',157,218,.95);add('hanging',975,210,.85);add('pendant',1084,260,.9);add('fan',620,155,.68);
add('picture',1137,285,.9);add('poster',1535,291,.85);add('clock',1383,237,.9);
add('shelf',1311,355);add('books',1269,337,.75,2.1);add('radio',1351,337,.8,2.1);add('jar',1415,337,.65,2.1);
add('shelf',285,353,.65);add('flower',254,337,.55,2.1);add('camera',325,337,.6,2.1);
add('rug',762,760,1.1);add(home==='orchard'?'bed':'sofa',760,647,1.13);add('cushion',685,557,.9,3.1);add('blanket',880,631,.85,3.1);
add('cabinet',270,665,.9);add('fishbowl',243,529,.9,3.1);add('plant',355,529,.65,3.1);add('basket',145,713,.9);add('guitar',455,683,.92);
add('fridge',1510,661,.94);add('counter',1224,669,1.03);add('kettle',1125,488,.75,3.1);add('toaster',1218,488,.75,3.1);add('fruit',1350,488,.8,3.1);
add('plant',1058,682,1.18);add('plant',53,715,1.35);add('watering',90,780,.85);add('flower',1552,755,.85);
add('table',792,797,1.05);add('tea',742,724,.8,3.2);add('cake',844,724,.85,3.2);add('stool',1105,815);add('stool',1342,814);add('tea',1269,491,.6,3.1);add('jar',1169,492,.65,3.1);
add('cat',416,822,.95);add('balloon',1038,486,.9);add('milo',700,790,1.05);add('lumi',900,803,1.05);
if(home==='atelier'){add('easel',469,682);add('lamp',1398,492,.65,3.1)}
if(home==='orchard'){add('fruit',305,532,.6,3.1);add('tree',563,529,.65)}
return list;
}
function shell(home,wallpaper=0){const wall=home==='atelier'?'#d8cce7':home==='orchard'?'#f5ceaf':'#f9dfb1';const tint=wallpaper%3===1?'#d0e5c5':wallpaper%3===2?'#d7d9ed':wall;
return `${R(0,0,1600,900,'#a9e0ed',0,'none')}${P('M0 395q150-150 320-32 134-120 298-5 192-167 442 16v240H0Z','#a5c9a3','none')}${P('M0 462q186-157 366-14 143-83 307-21 171-123 400 0v190H0Z','#79b196','none')}<g id="tree-layer"></g>${R(0,0,1600,76,tint,0,'none')}${R(0,76,80,506,tint,0,'none')}${R(1020,76,580,506,tint,0,'none')}${R(80,535,940,48,tint,0,'none')}${R(1049,301,551,281,'#b7d5bd',0,C.ink,3)}${Array.from({length:10},(_,i)=>P(`M${1050+i*64} 301v281`,'none','#8cb9a5',2)).join('')}${Array.from({length:5},(_,i)=>P(`M1050 ${319+i*55}h550`,'none','#8cb9a5',2)).join('')}${R(0,552,1050,35,'#6db3a2',0,C.ink,3)}${P('M0 580h1600v320H0Z','#e9c59e',C.ink,3)}${[631,699,783,884].map((y,i)=>P(`M0 ${y}h1600`,'none','#c69a75',2)).join('')}${[0,1,2,3,4,5,6,7].map(i=>P(`M${i*220-100} 580l${i*30-75} 320`,'none','#c69a75',2)).join('')}${P('M0 601h1600','none','#f6d9b1',5)}${R(0,68,1600,15,C.wood,0,C.ink,3)}${P('M0 72h1600','none','#edbb81',3)}${Array.from({length:10},(_,i)=>P(`M${80+i*147} ${715+i%2*56}l36 4m-24 7h11`,'none','#d4ab82',2)).join('')}`}
function houseArt(h){return `${P('M-72 0v-90H72V0Z',C.cream)}${P('M-88-90 0-149 88-90Z',h.color)}${R(-20,-62,40,62,h.color,18)}${R(-58,-64,26,30,C.blue,7)}${R(32,-64,26,30,C.blue,7)}${P('M-83 0H83','none',C.ink,5)}${E(0,-111,10,10,C.yellow,C.ink,2)}`}
root.WorldArt=Object.freeze({C,R,E,P,G,art,cast,homes,decor,names,bounds,chars,defaults,shell,houseArt,layer});
})(window);

;
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

;
/* Original variants of the Lerndachs cast. */
(()=>{
const A=WorldArt;
const variants={nia:{base:'lumi',name:'Nia',skin:'#bc865e',hair:'#302b35',shirt:'#b4a0da',extra:'<path d="M-29-151h23m12 0h23" fill="none" stroke="#38434c" stroke-width="3"/><circle cx="-17" cy="-151" r="13" fill="none" stroke="#38434c" stroke-width="3"/><circle cx="17" cy="-151" r="13" fill="none" stroke="#38434c" stroke-width="3"/>'},jona:{base:'milo',name:'Jona',skin:'#f2c5a7',hair:'#bd7546',shirt:'#93d6eb',extra:'<path d="M-43-205q40-49 86 0Z" fill="#f28c72" stroke="#38434c" stroke-width="3"/><path d="M-40-206h93" stroke="#38434c" stroke-width="5"/>'},sami:{base:'milo',name:'Sami',skin:'#84523e',hair:'#292e35',shirt:'#f6b34f',extra:'<path d="m-14-116 14 17 14-17" fill="none" stroke="#fff4d9" stroke-width="6"/>'},ella:{base:'lumi',name:'Ella',skin:'#f6bf96',hair:'#cc8856',shirt:'#8dc9b0',extra:'<path d="m0-113 5 11 12 1-9 8 2 12-10-6-10 6 2-12-9-8 12-1Z" fill="#ffe07e" stroke="#38434c" stroke-width="2"/>'}};
for(const [id,v] of Object.entries(variants)){A.cast.push({id,name:v.name,note:'Dein Freund für neue Ideen.',price:0});A.names[id]=v.name;A.bounds[id]=A.bounds[v.base];A.chars.add(id)}
for(const c of A.cast){c.price=0;A.names[c.id]=c.name}
window.LerndachsPeopleArt={art(id){const v=variants[id];if(!v)return ['pippa','mo'].includes(id)?'<g class="character-action">'+A.art(id)+'</g>':'';let s=A.art(v.base);const palette=v.base==='lumi'?['#f6bf96','#685376','#ffc958']:['#b47b56','#454039',A.C.teal];[v.skin,v.hair,v.shirt].forEach((color,i)=>s=s.split(palette[i]).join(color));const marker=['nia','jona'].includes(id)?'character-head':'character-breathe';const start=s.indexOf('<g class="'+marker+'"');if(start<0)return s+v.extra;const tags=/<\/?g\b[^>]*>/g;tags.lastIndex=start;let depth=0,match;while((match=tags.exec(s))){depth+=match[0].startsWith('</')?-1:1;if(!depth)return s.slice(0,match.index)+v.extra+s.slice(match.index)}return s}};
})();

;
window.LerndachsBundleData=[
{id:'cozy',name:'Gemütliches Zuhause',note:'Eine Leseecke und ein kuscheliger Schlafplatz.',price:300,items:['sofa','bed','table','rug','lamp','shelf','books','cushion','tea','cushion']},
{id:'garden',name:'Grünes Glück',note:'Pflanzen, Blüten und ein Platz zum Zusammensitzen.',price:300,items:['plant','plant','plant','flower','flower','hanging','hanging','watering','basket','stool','stool','table','garland','tea']},
{id:'creative',name:'Kleine Ideenwerkstatt',note:'Malen, musizieren und Geschichten sammeln.',price:300,items:['easel','guitar','camera','cabinet','shelf','books','picture','poster','stool']}];

;
'use strict';
const $=s=>document.querySelector(s);
const A=WorldArt,{C,R,E,P,cast,homes,decor,bounds,chars}=A;
const art=(id,home)=>window.LerndachsSeason?.art(id)||LerndachsWorld.petArt(id)||LerndachsPeopleArt.art(id)||A.art(id,home);
const escapeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={settings:'<path d="m9 2-1 4-4 1-2 4 3 3-1 4 4 2 4-2 4 2 4-2-1-4 3-3-2-4-4-1-1-4Z"/><circle cx="12" cy="12" r="3"/>',house:'<path d="m3 11 9-8 9 8v10H3Zm6 10v-8h6v8M7 8V4"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',moon:'<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>',sound:'<path d="m11 4-6 5H2v6h3l6 5Zm4 5q3 3 0 6m3-9q6 6 0 12"/>',friends:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-4a7 7 0 0 1 14 0v4M17 3a4 4 0 0 1 0 8m1 3q4 1 4 7"/>',chair:'<path d="M5 14V8q0-5 7-5t7 5v6M5 12q-4-3-4 2v4h22v-4q0-5-4-2M4 18v4m16-4v4M5 15h14"/>',shop:'<path d="M3 10v12h18V10M2 3h20l1 6q-3 5-6 0-2 5-5 0-3 5-6 0-3 5-5 0Zm7 19v-8h6v8"/>',bag:'<path d="M5 7h14l3 15H2Zm3 0V5a4 4 0 0 1 8 0v2M8 12h.01M16 12h.01m-7 4q3 3 6 0"/>',spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',flip:'<path d="M12 2v20M2 18l6-12v12Zm20 0L16 6v12Z"/>',left:'<path d="m14 5-7 7 7 7m-6-7h12"/>',right:'<path d="m10 5 7 7-7 7m6-7H4"/>',pause:'<path d="M8 5v14m8-14v14" stroke-width="4"/>',play:'<path d="m8 4 12 8-12 8Z"/>'};
function icon(n){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]||icons.spark}</svg>`}
document.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon));
const KEY='lerndachs.world.v3';
const allItems=[...cast,...decor,...homes];
const item=id=>allItems.find(i=>i.id===id);
const uid=()=>crypto.randomUUID();
function fresh(){return {version:3,balance:0,owned:['garden','radio',...LerndachsWorld.environment],home:'garden',night:false,paused:false,wallpapers:{},placed:{garden:LerndachsWorld.empty()},stored:{},receipts:[],journey:{grade:null,starterEarned:false,starterUnlocked:false,done:[],active:null,index:0,target:'plant',together:false,turn:1,worldMoves:[],practice:0,badges:[]}}}
let state=fresh(),storageOK=true;
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved?.version===3&&saved.journey&&Number.isSafeInteger(saved.balance)&&saved.balance>=0&&Array.isArray(saved.owned)&&saved.placed&&saved.stored&&Array.isArray(saved.receipts)&&homes.some(h=>h.id===saved.home)){state=saved;state.journey={...fresh().journey,...saved.journey};state.wallpapers??={}}}catch{}
// Existing friends are preserved. New worlds choose their sole first figure explicitly.
const allPeople=()=>[...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].filter(o=>chars.has(o.id));
for(const person of allPeople())if(person.characterName==='undefined')person.characterName=item(person.id)?.name||'Freund';
if(!state.journey.playerUid&&allPeople().length)state.journey.playerUid=allPeople()[0].uid;
if(!state.radioWelcomed){if(![...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].some(o=>o.id==='radio'))state.placed[state.home].push({uid:uid(),id:'radio',x:1180,y:790,s:.8,layer:3.6,on:true});if(!state.owned.includes('radio'))state.owned.push('radio');state.radioWelcomed=true}
state.audioSettings??={enabled:true,volume:.6,station:0};if(!state.audioSettings.gainVersion){if(state.audioSettings.volume===.35)state.audioSettings.volume=.6;state.audioSettings.gainVersion=1}
const objectName=o=>o.characterName||o.petName||item(o.id)?.name||'Objekt';
let activePanel='',shopTab='decor',furnitureTab='props',sound=false,selected=null,drag=null,pan=null,audio;
const current=()=>state.placed[state.home]??=(LerndachsWorld.empty(state.home));
const stored=()=>state.stored[state.home]??=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{storageOK=false}$('#balance').textContent=state.balance;$('#bag-count').textContent=stored().length;window.dispatchEvent(new Event('world-saved'))}
let toastTimer;
function toast(message,undo){const t=$('#toast');t.textContent=message;if(undo){const b=document.createElement('button');b.textContent='Rückgängig';b.className='toast-undo';b.onclick=()=>{undo();t.classList.remove('visible')};t.append(b)}t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),undo?6500:2800)}
function syncCarried(){for(const o of current()){if(!o.carrier)continue;const c=current().find(c=>c.uid===o.carrier);if(!c){delete o.carrier;continue}o.x=c.x+(o.dx||55);o.y=c.y-91;o.layer=5}}
function transform(o){return `translate(${o.x} ${o.y}) scale(${(o.flip?-1:1)*(o.s||1)*(o.sx||1)} ${o.s||1})`}
function specialArt(o){let s=art(o.id,state.home);if(o.id==='fridge'&&o.on){s+=`${R(-59,-268,117,246,'#e6edda',10)}${P('M-55-187H55m-110 82H55','none','#8eb5a6',5)}${R(-37,-244,27,46,'#ffd383',5)}${R(12,-228,29,32,'#edb9cf',6)}${E(-13,-141,24,19,C.coral,C.ink,2)}${P('M-12-160v-9','none',C.leaf,3)}${P('M-68-276l-73 27v239l73 13Z','#c5e9db')}${P('M-130-217v40','none',C.deep,6)}`}
 if(o.id==='cabinet'&&o.on)s+=`${R(-130,-126,260,110,C.brown,8)}${R(-116,-110,90,15,C.cream,3)}${R(33,-107,65,38,C.pink,8)}${P('M-139-135l-47 18v107l47 5Z',C.light)}`;
 if(o.id==='fan'&&o.on)s=s.replace('class="fan-spin"','class="fan-spin" style="animation-play-state:paused"');
 if(o.id==='counter'&&o.on)s+=`<g class="water-stream">${P('M63-227v49','none','#84d9ed',7)}${E(73,-175,24,4,'#d3f4f8')}</g>`;
 if(['lamp','pendant'].includes(o.id)&&o.on)s+=E(0,o.id==='lamp'?-55:-25,78,60,'#ffe58738');
 return s;
}
function renderObjects(){syncCarried();const markup=current().slice().sort((a,b)=>(a.layer??3)-(b.layer??3)||a.y-b.y).map((o,i)=>{const b=bounds[o.id]||[-50,-100,100,110],isChar=chars.has(o.id),isSmall=b[2]<170&&o.id!=='balloon';return `<g class="movable ${chars.has(o.id)?'person':''} ${selected===o.uid?'selected':''} ${o.layer===0?'sky-object':''}" data-uid="${o.uid}" data-kind="${o.id}" data-on="${!!o.on}" transform="${transform(o)}" tabindex="0" role="button" aria-label="${escapeText(objectName(o))}: bewegen, benutzen oder einpacken" style="--idle-delay:${i%7*.37}s"><title>${escapeText(objectName(o))}</title>${R(b[0]-5,b[1]-5,b[2]+10,b[3]+10,'none',13,C.white,4).replace('<rect','<rect class="selection-outline"')}${isSmall?R(Math.min(-38,b[0]),Math.min(-75,b[1]),Math.max(76,b[2]),Math.max(76,b[3]),'transparent',0,'none'):isChar?R(-61,-229,122,235,'transparent',0,'none'):''}<g class="sprite">${specialArt(o)}</g></g>`});$('#objects').innerHTML=markup.filter((s,i)=>!s.includes('data-kind="tree"')).join('');const trees=$('#tree-layer');if(trees)trees.innerHTML=markup.filter(s=>s.includes('data-kind="tree"')).join('');updateSelection();window.WorldSound?.sync();window.LerndachsCharacters?.sync()}
function render(){
 $('#backdrop').innerHTML=A.shell(state.home,state.wallpapers[state.home]||0);$('.playground').classList.toggle('night',state.night);document.body.classList.toggle('no-motion',state.paused);
 $('#location').textContent=homes.find(h=>h.id===state.home).name;$('#day-label').textContent=state.night?'Geschichten unterm Sternenhimmel.':'Dein Tag. Deine Geschichte.';
 $('#day-toggle').innerHTML=icon(state.night?'moon':'sun');$('#day-toggle').setAttribute('aria-pressed',state.night);$('#day-toggle').setAttribute('aria-label',state.night?'Zum Tag wechseln':'Zur Nacht wechseln');$('#motion-toggle').innerHTML=icon(state.paused?'play':'pause');$('#motion-toggle').setAttribute('aria-pressed',state.paused);$('#motion-toggle').setAttribute('aria-label',state.paused?'Animationen starten':'Animationen pausieren');
 renderObjects();save();panButtons();
}
function select(o){selected=o?.uid||null;document.querySelectorAll('.movable.selected').forEach(e=>e.classList.remove('selected'));if(selected)document.querySelector(`[data-uid="${selected}"]`)?.classList.add('selected');updateSelection()}
function updateSelection(){const o=current().find(o=>o.uid===selected);$('#selection').hidden=!o;if(o)$('#selected-name').textContent=objectName(o)}
function worldPoint(e){return new DOMPoint(e.clientX,e.clientY).matrixTransform($('#world').getScreenCTM().inverse())}
function bagHit(x,y){const r=$('#bag-button').getBoundingClientRect();return x>=r.left-20&&x<=r.right+20&&y>=r.top-20&&y<=r.bottom+20}
function effect(o,type='spark'){
 const g=document.createElementNS('http://www.w3.org/2000/svg','g');let x=o.x,y=o.y-(chars.has(o.id)?250:90),s='';
 if(type==='rain'){for(let i=0;i<9;i++)s+=`<path class="fx-drop" style="animation-delay:${i*.07}s" d="M${x-45+i*12} ${o.y+18}l-4 11" stroke="#56b6d1" stroke-width="5" stroke-linecap="round"/>`}
 else if(type==='music'){for(let i=0;i<4;i++)s+=`<text class="fx-note" x="${x-40+i*27}" y="${y-i%2*18}" fill="${[C.coral,C.deep,C.purple][i%3]}" font-size="35" style="animation-delay:${i*.15}s">${i%2?'♫':'♪'}</text>`}
 else{for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=`<path class="fx-particle" style="--dx:${Math.cos(a)*62}px;--dy:${Math.sin(a)*55-32}px;animation-delay:${i*.025}s" d="m${x+Math.cos(a)*14} ${y+Math.sin(a)*15} 4-8 4 8 8 4-8 4-4 8-4-8-8-4Z" fill="${[C.yellow,C.coral,C.teal,C.pink][i%4]}"/>`}}
 g.innerHTML=s;$('#effects').append(g);setTimeout(()=>g.remove(),2200);
}
function animate(o){const el=document.querySelector(`[data-uid="${o.uid}"]`);el?.classList.remove('reacting');if(el){void el.getBoundingClientRect();el.classList.add('reacting');setTimeout(()=>el.classList.remove('reacting'),750)}}
function use(o){
 if(!o)return;select(o);animate(o);window.dispatchEvent(new CustomEvent('world-use',{detail:{id:o.id,uid:o.uid}}));if(window.WorldSound)WorldSound.effect(o.id);if(o.id==='balloon'){effect(o);pack(o);toast('Plopp! Dein Ballon wartet in der Tasche.',()=>restore(o.uid));return}if(o.id==='clock'){const h=document.querySelector(`[data-uid="${o.uid}"] .clock-hand`);if(!state.paused)h?.animate([{transform:'rotate(0deg)'},{transform:'rotate(720deg)'}],{duration:1000});effect(o);return}
 if(LerndachsWorld.pets.some(p=>p.id===o.id)){showPet(o);return}
 if(o.id==='watering'){const plant=current().find(p=>p.id==='plant'&&Math.hypot(p.x-o.x,p.y-o.y)<170);effect(plant||o,'rain');return}
 if(o.id==='sun'){sunClick();state.night=!state.night;render();effect(o);return}
 if(o.id==='cloud'){effect(o,'rain');chime();return}
 if(o.id==='radio'){o.on=true;window.WorldSound?.nextStation();effect(o,'music');save();return}if(o.id==='guitar'){effect(o,'music');save();return}
 if(['lamp','pendant','fridge','counter','cabinet'].includes(o.id)){o.on=!o.on;renderObjects();animate(o);chime();save();return}
 if(o.id==='camera'){const flash=document.createElement('div');flash.className='flash';$('.game-shell').append(flash);setTimeout(()=>flash.remove(),500);effect(o);return}
 if(o.id==='sofa'||o.id==='bed'){const c=current().filter(c=>chars.has(c.id)).sort((a,b)=>Math.abs(a.x-o.x)-Math.abs(b.x-o.x))[0];if(c){c.x=o.x+(c.x<o.x?-65:65);c.y=o.y-52;renderObjects();effect(c)}return}
 if(o.id==='fan'){o.on=!o.on;const el=document.querySelector(`[data-uid="${o.uid}"] .fan-spin`);if(el)el.style.animationPlayState=o.on?'paused':'running';save();return}
 effect(o,['cat','fishbowl'].includes(o.id)?'music':'spark');chime();
}
function pack(o){
 if(!o)return;const home=state.home,copy=structuredClone(o),carried=current().filter(x=>x.carrier===o.uid);for(const x of carried)delete x.carrier;
 state.placed[home]=current().filter(x=>x.uid!==o.uid);delete o.carrier;stored().push(o);select(null);renderObjects();save();toast(`${item(o.id)?.name} ist in deiner Tasche.`,()=>{if(!state.stored[home].some(x=>x.uid===copy.uid))return;state.stored[home]=state.stored[home].filter(x=>x.uid!==copy.uid);state.placed[home].push(copy);if(state.home===home)renderObjects();save()});
}
function restore(uidToRestore){if(current().length>=120){toast('Packe erst etwas ein, damit Platz bleibt.');return}const o=stored().find(o=>o.uid===uidToRestore);if(!o)return;state.stored[state.home]=stored().filter(x=>x.uid!==uidToRestore);delete o.carrier;current().push(o);renderObjects();save();$('#panel').close();focusObject(o);effect(o);toast(`${item(o.id)?.name} ist wieder da.`)}
function focusObject(o){const s=$('#scene-scroll'),scale=$('#world').clientWidth/1600;s.scrollTo({left:Math.max(0,o.x*scale-s.clientWidth/2),behavior:state.paused?'instant':'smooth'});select(o)}
function carryOrDrop(o){if(chars.has(o.id)||!bounds[o.id]||bounds[o.id][2]>165||['sun','cloud','hanging','balloon'].includes(o.id))return;const c=current().find(c=>chars.has(c.id)&&Math.abs(c.x-o.x)<72&&Math.abs(c.y-91-o.y)<72);if(c){o.carrier=c.uid;o.dx=o.x<c.x?-55:55;o.layer=5;syncCarried();effect(c)}}
$('#world').addEventListener('pointerdown',e=>{
 const el=e.target.closest('.movable');if(!el||e.button>0)return;e.preventDefault();e.stopPropagation();const o=current().find(o=>o.uid===el.dataset.uid),p=worldPoint(e);delete o.carrier;
 drag={el,o,start:p,ox:o.x,oy:o.y,moved:false,pointer:e.pointerId};select(o);el.classList.add('dragging');el.parentElement.append(el);el.setPointerCapture(e.pointerId);document.body.classList.add('is-dragging');$('#welcome-hint').hidden=true;
});
window.addEventListener('pointermove',e=>{
 if(!drag)return;const p=worldPoint(e);if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)>5)drag.moved=true;
 drag.o.x=Math.max(40,Math.min(1560,drag.ox+p.x-drag.start.x));drag.o.y=Math.max(85,Math.min(864,drag.oy+p.y-drag.start.y));drag.el.setAttribute('transform',transform(drag.o));syncCarried();for(const o of current().filter(o=>o.carrier===drag.o.uid))document.querySelector(`[data-uid="${o.uid}"]`)?.setAttribute('transform',transform(o));
 $('#bag-button').classList.toggle('drop-ready',bagHit(e.clientX,e.clientY));const s=$('#scene-scroll');if(e.clientX<40)s.scrollLeft-=12;else if(e.clientX>innerWidth-40)s.scrollLeft+=12;
});
function finishDrag(e){if(!drag)return;const d=drag;drag=null;document.body.classList.remove('is-dragging');$('#bag-button').classList.remove('drop-ready');d.el.classList.remove('dragging');if(e.type==='pointercancel'){d.o.x=d.ox;d.o.y=d.oy}else if(d.moved&&bagHit(e.clientX,e.clientY)){d.o.x=d.ox;d.o.y=d.oy;pack(d.o);return}else if(d.moved){carryOrDrop(d.o)}else use(d.o);renderObjects();save();if(d.moved)window.dispatchEvent(new CustomEvent('world-move',{detail:{uid:d.o.uid,id:d.o.id}}))}
window.addEventListener('pointerup',finishDrag);window.addEventListener('pointercancel',finishDrag);
$('#world').addEventListener('keydown',e=>{
 const el=e.target.closest('.movable');if(!el)return;const o=current().find(o=>o.uid===el.dataset.uid),delta={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,-15],ArrowDown:[0,15]}[e.key];select(o);
 if(delta){e.preventDefault();delete o.carrier;o.x=Math.max(40,Math.min(1560,o.x+delta[0]));o.y=Math.max(85,Math.min(864,o.y+delta[1]));carryOrDrop(o);el.setAttribute('transform',transform(o));syncCarried();for(const held of current().filter(x=>x.carrier===o.uid))document.querySelector(`[data-uid="${held.uid}"]`)?.setAttribute('transform',transform(held));save();window.dispatchEvent(new CustomEvent('world-move',{detail:{uid:o.uid,id:o.id}}))}
 if(e.key==='Enter'||e.key===' '){e.preventDefault();use(o)}if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();pack(o)}if(e.key==='Escape')select(null);
});
$('#world').addEventListener('focusin',e=>{const el=e.target.closest('.movable');if(el){const o=current().find(x=>x.uid===el.dataset.uid);select(o);focusObject(o)}});
const scene=$('#scene-scroll');
scene.addEventListener('pointerdown',e=>{if(e.target.closest('.movable')||e.button>0)return;pan={x:e.clientX,scroll:scene.scrollLeft,y:e.clientY,moved:false};scene.setPointerCapture(e.pointerId)});
scene.addEventListener('pointermove',e=>{if(!pan||drag)return;if(Math.abs(e.clientX-pan.x)>5)pan.moved=true;scene.style.scrollBehavior='auto';scene.scrollLeft=pan.scroll+pan.x-e.clientX});
scene.addEventListener('pointerup',e=>{if(!pan)return;if(!pan.moved){select(null);const p=worldPoint(e);if(p.y<580){state.wallpapers[state.home]=((state.wallpapers[state.home]||0)+1)%3;$('#backdrop').innerHTML=A.shell(state.home,state.wallpapers[state.home]);renderObjects();save()}else effect({x:p.x,y:p.y+90})}pan=null;scene.style.scrollBehavior=''});
scene.addEventListener('pointercancel',()=>{pan=null});
function panButtons(){const s=$('#scene-scroll');$('#pan-left').disabled=s.scrollLeft<4;$('#pan-right').disabled=s.scrollLeft>s.scrollWidth-s.clientWidth-4}
scene.addEventListener('scroll',panButtons,{passive:true});window.addEventListener('resize',()=>{centerScene();panButtons()});
$('#pan-left').onclick=()=>scene.scrollBy({left:-scene.clientWidth*.65,behavior:state.paused?'instant':'smooth'});$('#pan-right').onclick=()=>scene.scrollBy({left:scene.clientWidth*.65,behavior:state.paused?'instant':'smooth'});
function centerScene(){const s=$('#scene-scroll');s.scrollLeft=Math.max(0,$('#world').clientWidth*.5-s.clientWidth/2);panButtons()}
function chime(){if(window.WorldSound){WorldSound.effect('reward');return}if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();[523.25,659.25,783.99].forEach((hz,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.13;o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.31)})}catch{}}
const panelTitles={shop:['DEIN NÄCHSTES KLEINES ABENTEUER','Dein kleiner Laden'],residents:['WER SPIELT HEUTE MIT?','Deine Figuren'],furniture:['ALLES DARF ANDERS WERDEN','Deine Einrichtung'],map:['EIN NEUER ORT, EINE NEUE GESCHICHTE','Deine Nachbarschaft'],bag:['WEGGELEGT IST NICHT VERLOREN','Deine Tasche'],rewards:['AUS ERFOLGEN WERDEN MÖGLICHKEITEN','Sterne für deine Welt'],help:['WILLKOMMEN BEI LERNDACHS','Einfach alles ausprobieren.']};
function showPanel(type){if(!state.journey.starterUnlocked&&['shop','furniture','map','residents'].includes(type)){window.dispatchEvent(new Event('request-starter'));return}activePanel=type;$('#panel-kicker').textContent=panelTitles[type][0];$('#panel-title').textContent=panelTitles[type][1];renderPanel();if(!$('#panel').open)$('#panel').showModal();$('#panel-content button:not(:disabled)')?.focus({preventScroll:true})}
function preview(i,isHouse=false){const b=isHouse?[-105,-160,210,180]:bounds[i.id]||[-65,-140,130,160];return `<svg viewBox="${b.join(' ')}" aria-hidden="true">${isHouse?A.houseArt(i):art(i.id,state.home)}</svg>`}
function card(i,type='decor',storedObject){const own=state.owned.includes(i.id),isHouse=type==='houses',isChar=type==='figures';let action='place',label=isChar?'Mitspielen':'Hinstellen',disabled=false;
 if(storedObject){action='restore';label='Zurückholen'}else if(activePanel==='shop'){action='buy';label=own&&!i.repeatable?'✓ Schon deins':`${i.price} ✦ · ${own?'Noch eins':'Holen'}`;disabled=own&&!i.repeatable}
 else if(isHouse){action=own?'visit':'store';label=state.home===i.id?'Hier bist du':own?'Besuchen':`${i.price} ✦ · Laden`;disabled=state.home===i.id}
 else if(isChar&&current().some(o=>o.id===i.id)){label='✓ Spielt mit';disabled=true}
 const displayName=storedObject?objectName(storedObject):current().find(o=>o.id===i.id)?.petName||i.name;
 const targetButton=activePanel==='shop'&&!disabled?`<button class="target-button" data-action="target" data-id="${i.id}">${state.journey.target===i.id?'✓ Dein Sparziel':'Als Sparziel wählen'}</button>`:'';
 return `<article class="item-card"><div class="item-art">${preview(i,isHouse)}</div><div class="item-body"><h3>${escapeText(displayName)}</h3><p>${i.note||'Bereit für die nächste Geschichte.'}</p><button data-action="${action}" data-id="${storedObject?.uid||i.id}" ${disabled?'disabled':''}>${label}</button>${targetButton}</div></article>`}
function renderPanel(){const c=$('#panel-content');
 if(activePanel==='shop'){const items=shopTab==='figures'?cast:shopTab==='houses'?homes:shopTab==='pets'?decor.filter(i=>i.kind==='pet'):decor.filter(i=>i.kind==='decor');c.innerHTML=`<div class="tabs" aria-label="Ladenkategorien">${[['decor','Einrichtung'],['bundles','Pakete'],['pets','Haustiere'],['figures','Figuren'],['houses','Häuser']].map(([id,n])=>`<button data-tab="${id}" aria-pressed="${shopTab===id}">${n}</button>`).join('')}</div><div class="card-grid">${items.map(i=>card(i,shopTab)).join('')}</div><p class="note">Deine Sterne: <strong>${state.balance} ✦</strong> · Möbel ab 20 Sternen, Haustiere ab 300 Sternen. Jede neue Aufgabe bringt 15 Sterne.</p><button class="primary wide" data-action="learn">Sterne mit Aufgaben verdienen →</button>`}
 else if(activePanel==='residents'&&window.LerndachsFriends){c.innerHTML='';LerndachsFriends.render(c)}
 else if(activePanel==='residents')c.innerHTML=`<div class="card-grid">${[...cast,...decor.filter(i=>i.kind==='pet')].filter(i=>state.owned.includes(i.id)).map(i=>card(i,'figures')).join('')}</div><p class="note">Tippe auf eine Figur, damit sie mitspielt. Figuren in deiner Tasche kannst du dort zurückholen.</p><button class="text-button" data-action="store">Neue Freunde im Laden →</button>`;
 else if(activePanel==='furniture'){const building=['sofa','bed','table','cabinet','fridge','counter','stool','shelf','rug','window','curtain','easel'];const items=decor.filter(i=>state.owned.includes(i.id)&&(furnitureTab==='furniture'?building.includes(i.id):!building.includes(i.id)));c.innerHTML=`<div class="tabs">${[['props','Kleine Dinge'],['furniture','Möbel & Raum']].map(([id,n])=>`<button data-furniture-tab="${id}" aria-pressed="${furnitureTab===id}">${n}</button>`).join('')}</div><div class="card-grid">${items.map(i=>card(i)).join('')}</div><p class="note">Auch Sonne, Wolken, Fenster und Möbel kannst du verschieben und einpacken.</p>`}
 else if(activePanel==='bag')c.innerHTML=`<p class="note" style="margin:0 0 18px">Zieh Dinge auf die Tasche oder wähle „Einpacken“. Hier kannst du sie jederzeit zurückholen.</p>${stored().length?`<div class="card-grid">${stored().map(o=>card(item(o.id),'decor',o)).join('')}</div>`:'<div class="empty"><strong>Hier ist noch Platz für deine Ideen.</strong>Deine eingepackten Dinge landen hier. Sie bleiben gespeichert.</div>'}`;
 else if(activePanel==='map')c.innerHTML=`<div class="card-grid">${homes.map(i=>card(i,'houses')).join('')}</div><p class="note">Jedes Zuhause hat seine eigene Einrichtung und Tasche.</p>`;
 else if(activePanel==='rewards')c.innerHTML=`<div class="reward-art">✦</div><div class="dialog-copy"><p><strong>Aus deinen Ideen wird ein Zuhause.</strong></p><p>Eine neue gelöste Aufgabe bringt 15 Sterne. Mit Sternen holst du Möbel, Pflanzen und tierische Freunde. Tipps und neue Versuche sind immer erlaubt.</p><p>Dein Guthaben: <strong>${state.balance} Sterne</strong></p></div><button class="primary wide" data-action="learn">Nächste Aufgabe spielen →</button><p class="note">Keine Käufe mit Echtgeld. Keine Werbevideos. Mit einer kleinen Sonnen-Überraschung.</p>`;
 else c.innerHTML=`<div class="info-list"><p><strong>Alles ist zum Anfassen da.</strong><br>Figuren, Möbel, Pflanzen, Lampen, Sonne und Wolken: Tippe etwas an oder zieh es an einen neuen Platz.</p><p><strong>Einpacken & zurückholen.</strong><br>Zieh ein Objekt auf die Tasche oder tippe nach dem Auswählen auf das Taschen-Symbol. Die Dinge bleiben erhalten.</p><p><strong>Kleine Überraschungen.</strong><br>Öffne den Kühlschrank, dreh den Wasserhahn auf, lass es regnen, spiele Gitarre oder setze eine Figur aufs Sofa. Kleine Dinge kannst du einer Figur in die Hand ziehen.</p><p><strong>Deine Welt, dein Tempo.</strong><br>Mit den Pfeilen oder durch Ziehen am Hintergrund schaust du dich um. Tippe auf eine Wand, um ihre Farbe zu ändern. Oben kannst du Animationen und Töne umschalten.</p><p><strong>Tastatur.</strong><br>Tab wählt aus, Pfeiltasten bewegen, Enter benutzt, Entf packt ein. Escape hebt die Auswahl auf.</p></div><div class="settings-actions"><button data-action="tidy">Vorhandene Dinge aufräumen</button><button data-action="fullscreen">Vollbild umschalten</button><button data-install-app>App installieren</button></div><p class="note">${storageOK?'Lokal in diesem Browser gespeichert.':'Lokale Speicherung ist nicht verfügbar.'} Lerndachs ist ein eigenständiger Entwurf mit neu erstellten Grafiken und Klängen. Keine Verbindung zu Toca Boca oder Duolingo. Arbeitstitel.</p>`;
}
const originalRenderPanel=renderPanel;renderPanel=function(){originalRenderPanel();const c=$('#panel-content');if(activePanel==='shop'&&shopTab==='bundles')window.LerndachsBundles?.render(c);if(activePanel==='shop'&&shopTab==='figures')window.LerndachsFriends?.render(c)};
$('#panel-content').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.id,action=b.dataset.action;if(b.dataset.tab){shopTab=b.dataset.tab;renderPanel();return}if(b.dataset.furnitureTab){furnitureTab=b.dataset.furnitureTab;renderPanel();return}
 if(action==='buy'){const i=item(id);if(!state.journey.starterUnlocked)return;if(!homes.some(h=>h.id===id)&&current().length>=120){toast('Dein Raum ist voll. Packe zuerst etwas ein.');return}const r=WunderEconomy.purchase(state,i);if(!r.purchased){if(r.reason==='insufficient')toast(`Dir fehlen noch ${i.price-state.balance} Sterne. Mit der nächsten Aufgabe kommst du näher!`);return}save();if(!homes.some(h=>h.id===id))place(id,true);else renderPanel();chime();toast(`${i.name} gehört jetzt zu deiner Welt!`)}
 if(action==='target'){state.journey.target=id;save();renderPanel();toast('Sparziel gesetzt. Jede Aufgabe bringt dich näher!')}
 if(action==='learn'){$('#panel').close();window.dispatchEvent(new Event('request-learning'))}
 if(action==='place')place(id);if(action==='restore')restore(id);
 if(action==='visit'){state.home=id;selected=null;current();render();$('#panel').close();centerScene()}
 if(action==='store'){shopTab=homes.some(h=>h.id===id)?'houses':'figures';showPanel('shop')}
 if(action==='tidy'){const home=state.home,old=structuredClone({placed:current(),stored:stored()}),defaults=A.defaults(home);for(const o of [...current(),...stored()]){const d=defaults.find(d=>d.id===o.id);if(d){o.x=d.x;o.y=d.y}delete o.carrier}state.placed[home]=[...current(),...stored()];state.stored[home]=[];selected=null;render();$('#panel').close();toast('Deine vorhandenen Dinge sind aufgeräumt.',()=>{state.placed[home]=old.placed;state.stored[home]=old.stored;if(state.home===home)render();save()})}
 if(action==='fullscreen'){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>toast('Vollbild ist hier nicht verfügbar.'))}
});
function place(id,purchased=false){if(!state.journey.starterUnlocked||!state.owned.includes(id))return;if(!purchased){const bag=stored().find(o=>o.id===id);if(bag){restore(bag.uid);return}const existing=current().find(o=>o.id===id);if(existing){$('#panel').close();focusObject(existing);toast('Das ist schon in deinem Zimmer. Weitere Exemplare gibt es im Laden.');return}const elsewhere=Object.values(state.placed).flat().some(o=>o.id===id)||Object.values(state.stored).flat().some(o=>o.id===id);if(elsewhere){toast('Das steht in einem anderen Zuhause. Besuche es über die Nachbarschaft.');return}}if(chars.has(id)&&current().some(o=>o.id===id))return;if(current().length>=120){toast('Ganz schön voll. Packe zuerst etwas ein.');return}const isPet=item(id)?.kind==='pet',x=(scene.scrollLeft+scene.clientWidth*(isPet?.28:.5))/$('#world').clientWidth*1600,o={uid:uid(),id,x,y:chars.has(id)?790:isPet?815:735,s:1,layer:isPet?4.1:A.layer(id)};current().push(o);renderObjects();save();$('#panel').close();select(o);effect(o)}
function credit(payload){const result=WunderEconomy.credit(state,payload);save();return result}
window.Lerndachs=Object.freeze({version:3,getSnapshot:()=>structuredClone(state)});
$('#map-button').onclick=()=>showPanel('map');$('#wallet').onclick=()=>showPanel('rewards');$('#help').onclick=()=>showPanel('help');$('#bag-button').onclick=()=>showPanel('bag');
document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>showPanel(b.dataset.panel));$('#close-panel').onclick=()=>$('#panel').close();$('#panel').addEventListener('click',e=>{if(e.target===$('#panel')){const r=$('#panel').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#panel').close()}});
$('#day-toggle').onclick=()=>{sunClick();state.night=!state.night;render()};$('#motion-toggle').onclick=()=>{state.paused=!state.paused;render()};$('#sound-toggle').onclick=()=>{sound=!sound;$('#sound-toggle').setAttribute('aria-pressed',sound);$('#sound-toggle').setAttribute('aria-label',sound?'Töne ausschalten':'Töne einschalten');if(sound)chime()};$('#dismiss-hint').onclick=()=>{$('#welcome-hint').hidden=true};
$('#deselect').onclick=()=>select(null);$('#pack-object').onclick=()=>pack(current().find(o=>o.uid===selected));$('#use-object').onclick=()=>use(current().find(o=>o.uid===selected));$('#flip-object').onclick=()=>{const o=current().find(o=>o.uid===selected);if(o){o.flip=!o.flip;renderObjects();save()}};
setInterval(()=>{if(state.paused||document.hidden)return;for(const o of current().filter(o=>o.id==='radio'&&o.on))effect(o,'music')},2600);
if(matchMedia('(prefers-reduced-motion: reduce)').matches)state.paused=true;
render();centerScene();setTimeout(()=>{$('#welcome-hint').hidden=true},8500);

window.Lernwelt={snapshot:()=>structuredClone(state),find:id=>current().find(o=>o.id===id),focus:id=>{const o=current().find(o=>o.id===id);if(o)focusObject(o);return !!o},reward:(receiptId,stars)=>credit({receiptId,stars}),use:id=>use(current().find(o=>o.id===id)),pack:id=>pack(current().find(o=>o.id===id)),restore};

// Preserve the original adapter name for existing integrations.
window.MeineKleineWelt=window.Lerndachs;

function grantStarter(){
 if(state.journey.starterUnlocked||!state.journey.starterEarned)return false;
 state.journey.starterUnlocked=true;
 for(const o of LerndachsWorld.starterObjects('garden')){if(!state.owned.includes(o.id))state.owned.push(o.id);state.placed.garden.push(o)}
 state.home='garden';render();centerScene();effect({x:800,y:500});window.dispatchEvent(new Event('learning-celebration'));return true;
}
function showPet(o){
 selected=o.uid;const i=item(o.id);$('#panel-title').textContent=o.petName||i.name;$('#panel-kicker').textContent='DEIN TIERISCHER FREUND';activePanel='pet';
 $('#panel-content').innerHTML=`<div class="pet-portrait">${preview(i)}</div><p class="pet-bond">${'♥'.repeat(Math.min(5,o.bond||0))}${'♡'.repeat(5-Math.min(5,o.bond||0))}</p><p class="note">Zeit zusammen ist schön. Dein Tier wartet ohne Zeitdruck auf dich.</p><div class="pet-actions"><button data-care="stroke">♡ Streicheln</button><button data-care="feed">♧ Füttern</button><button data-care="play">✦ Spielen</button></div><p id="pet-feedback" role="status">Was möchtet ihr zusammen machen?</p><label class="pet-name-label">Name <input id="pet-name" maxlength="24" value=""></label><button id="save-pet-name" class="primary wide">Namen speichern</button>`;
 $('#pet-name').value=o.petName||i.name;
 $('#panel-content').querySelectorAll('[data-care]').forEach(b=>b.onclick=()=>{o.bond=Math.min(5,(o.bond||0)+1);save();$('#panel-content .pet-bond').textContent='♥'.repeat(o.bond)+'♡'.repeat(5-o.bond);$('#pet-feedback').textContent=({stroke:'Dein Freund genießt die kleine Pause.',feed:'Lecker! Gemeinsam kümmert ihr euch um euren Alltag.',play:'Was für ein schöner Spielmoment!'})[b.dataset.care];effect(o);WorldSound?.effect(o.id);animate(o)});
 $('#save-pet-name').onclick=()=>{const name=$('#pet-name').value.trim();if(name){o.petName=name;save();$('#panel-title').textContent=name;renderObjects();toast('Name gespeichert.')}};
 if(!$('#panel').open)$('#panel').showModal();
}
window.LerndachsJourney={get profile(){return state.journey},save,grantStarter,get catalogue(){return allItems},art,preview,showShop(tab='decor'){shopTab=tab;showPanel('shop')},reward(id,stars=15){if(state.journey.done.includes(id))return false;const r=WunderEconomy.credit(state,{receiptId:'task-'+id,stars});if(r.credited){state.journey.done.push(id);if(state.journey.together)state.journey.turn=state.journey.turn===1?2:1}save();return r.credited},focusObject,render};
// A mission can retrieve already-owned props without granting unearned items.
function bringOwned(id){
 if(!state.journey.starterUnlocked||!state.owned.includes(id)||current().some(o=>o.id===id))return;
 for(const [home,objects] of Object.entries(state.stored)){const index=objects.findIndex(o=>o.id===id);if(index>=0){const [o]=objects.splice(index,1);delete o.carrier;current().push(o);renderObjects();save();return}}
 for(const [home,objects] of Object.entries(state.placed)){if(home===state.home)continue;const index=objects.findIndex(o=>o.id===id);if(index>=0){const [o]=objects.splice(index,1);delete o.carrier;current().push(o);renderObjects();save();return}}
}
LerndachsJourney.bring=bringOwned;

LerndachsJourney.prepare=goal=>{
 if(goal==='water'){const can=current().find(o=>o.id==='watering'),plant=current().find(o=>o.id==='plant');if(can&&plant&&Math.hypot(can.x-plant.x,can.y-plant.y)>350){can.x=plant.x+120;can.y=plant.y-200;can.layer=3.4;renderObjects();save()}}
 if(goal==='left'){const table=current().find(o=>o.id==='table'),stool=current().find(o=>o.id==='stool');if(table&&stool&&Math.abs(table.x-stool.x)>250){stool.x=table.x+200;stool.y=table.y+35;renderObjects();save()}}
};

LerndachsJourney.getTimetable=()=>state.timetable;
LerndachsJourney.setTimetable=plan=>{state.timetable=plan;save()};

// Seven sun interactions form one persistent bonus receipt.
function sunClick(){
 state.journey.sunClicks=(Number.isSafeInteger(state.journey.sunClicks)?state.journey.sunClicks:0)+1;
 if(state.journey.sunClicks%7===0){const r=credit({receiptId:'sun-bonus-'+state.journey.sunClicks/7,stars:250});if(r.credited){toast('Sonnengeheimnis! +250 Sterne für deine Welt.');window.dispatchEvent(new Event('learning-celebration'))}}
 else save();
}

window.addEventListener('request-world-help',()=>showPanel('help'));

LerndachsJourney.people=()=>allPeople().map(o=>({...o,name:objectName(o),player:o.uid===state.journey.playerUid}));
LerndachsJourney.player=()=>allPeople().find(o=>o.uid===state.journey.playerUid);
LerndachsJourney.person=(id,name,mode='add',personUid)=>{
 if(!chars.has(id)||typeof name!=='string'||!name.trim())return false;
 let o=mode==='initial'?null:allPeople().find(o=>o.uid===(personUid||state.journey.playerUid));
 if(mode==='add')o=null;
 if(!o){if(current().length>=120||allPeople().length>=20){toast('Deine Welt ist schon gut besucht.');return false}o={uid:uid(),id,x:700+allPeople().length%5*105,y:790,s:1,layer:4};current().push(o)}
 o.id=id;o.characterName=name.trim().slice(0,24);if(mode==='initial'||mode==='change')state.journey.playerUid=o.uid;
 if(!state.owned.includes(id))state.owned.push(id);renderObjects();save();window.dispatchEvent(new Event('character-celebrate'));return true;
};
LerndachsJourney.showPerson=personUid=>{const o=allPeople().find(o=>o.uid===personUid);if(!o)return;for(const map of [state.placed,state.stored])for(const [home,list] of Object.entries(map))map[home]=list.filter(x=>x.uid!==personUid);delete o.carrier;current().push(o);renderObjects();save();$('#panel').close();focusObject(o)};
LerndachsJourney.getAudio=()=>({...state.audioSettings});
LerndachsJourney.setAudio=values=>{Object.assign(state.audioSettings,values);save()};
LerndachsJourney.purchaseBundle=bundle=>{
 if(!state.journey.starterUnlocked||!LerndachsBundleData.includes(bundle))return {ok:false,message:'Dein Einzugspaket wartet zuerst.'};
 if(state.balance<bundle.price)return {ok:false,message:`Dir fehlen noch ${bundle.price-state.balance} Sterne.`};
 if(stored().length+bundle.items.length>200)return {ok:false,message:'Hole zuerst einige Dinge aus deiner Tasche.'};
 state.balance-=bundle.price;for(const id of bundle.items){stored().push({uid:uid(),id,x:800,y:750,s:1,layer:A.layer(id)});if(!state.owned.includes(id))state.owned.push(id)}
 save();window.dispatchEvent(new Event('learning-celebration'));WorldSound.effect('reward');return {ok:true};
};

;
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

;
(()=>{
const J=LerndachsJourney,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dialog=document.createElement('dialog');dialog.id='character-dialog';dialog.setAttribute('aria-labelledby','character-title');document.body.append(dialog);
let mode,chosen,personUid,callback;
function open(next='add',done,who){mode=next;callback=done;personUid=who;const person=J.people().find(p=>p.uid===(who||J.profile.playerUid));chosen=next==='add'||next==='initial'?'milo':person?.id||'milo';
 document.querySelector('#panel').close();document.querySelector('#learning-dialog').close();
 dialog.innerHTML=`<div class="dialog-top"><div><p class="eyebrow">DEINE FIGUR · DEINE GESCHICHTE</p><h2 id="character-title">${next==='initial'?'Wer möchtest du sein?':next==='add'?'Ein neuer Freund':'Deine Figur gestalten'}</h2></div>${next==='initial'?'':'<button class="icon-button" id="close-character" aria-label="Schließen">×</button>'}</div><div class="people-grid">${WorldArt.cast.map(i=>`<button data-person="${i.id}" aria-pressed="${chosen===i.id}">${J.preview(i)}<strong>${esc(i.name)}</strong></button>`).join('')}</div><form id="person-form"><label class="pet-name-label">Name <input id="character-name" required maxlength="24" autocomplete="off" aria-label="Name deiner Figur"></label><button id="confirm-character" class="journey-primary wide">${next==='initial'?'Mein Abenteuer starten':next==='add'?'Freund hinzufügen':'Änderungen speichern'} →</button><p class="note">${next==='initial'?'Du startest mit einer Figur. Weitere Freunde kannst du später hinzufügen.':'Figuren und eigene Namen kosten keine Sterne.'}</p><p id="character-error" role="status"></p></form>`;
 dialog.querySelector('#character-name').value=next==='initial'||next==='add'?WorldArt.names[chosen]:person?.name||WorldArt.names[chosen];
 dialog.querySelectorAll('[data-person]').forEach(b=>b.onclick=()=>{const input=dialog.querySelector('input');if(input.value===WorldArt.names[chosen])input.value=WorldArt.names[b.dataset.person];chosen=b.dataset.person;dialog.querySelectorAll('[data-person]').forEach(btn=>btn.setAttribute('aria-pressed',btn.dataset.person===chosen))});
 dialog.querySelector('#close-character')?.addEventListener('click',()=>dialog.close());
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();if(!J.person(chosen,dialog.querySelector('input').value,mode,personUid)){dialog.querySelector('#character-error').textContent='Bitte wähle einen Namen. In deiner Welt können bis zu 20 Figuren mitspielen.';return}dialog.close();callback?.();window.dispatchEvent(new Event('learning-celebration'))};
 dialog.showModal();
}
 dialog.addEventListener('cancel',e=>{if(mode==='initial')e.preventDefault()});
function render(c){c.querySelector('.card-grid')?.remove();c.querySelectorAll('.note,.wide').forEach(e=>e.remove());const body=document.createElement('div');body.innerHTML=`<div class="friends-actions"><button class="journey-primary" data-friend-mode="change">Meine Figur ändern</button><button class="journey-primary" data-friend-mode="add">+ Freund hinzufügen</button></div><div class="card-grid">${J.people().map(o=>`<article class="item-card"><div class="item-art">${J.preview({id:o.id})}</div><div class="item-body"><h3>${esc(o.name)}</h3><p>${o.player?'Das bist du':'Dein Freund'}</p><button data-person-edit="${o.uid}">Figur & Namen ändern</button><button data-person-show="${o.uid}">In meine Welt holen</button></div></article>`).join('')}</div><p class="note">Du entscheidest, wer mitspielt. Namen bleiben auf diesem Gerät gespeichert. Eingepackte Freunde findest du auch in deiner Tasche.</p>`;c.append(body)}
 document.querySelector('#panel-content').addEventListener('click',e=>{const b=e.target.closest('button');if(b?.dataset.friendMode)open(b.dataset.friendMode);if(b?.dataset.personEdit)open(J.profile.playerUid===b.dataset.personEdit?'change':'edit',null,b.dataset.personEdit);if(b?.dataset.personShow)J.showPerson(b.dataset.personShow)});
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
window.LerndachsIntro={0:['Wie viele Umzugskisten siehst du?',['2','3','4'],1,'📦 📦 📦'],1:['2 Kisten stehen schon da. Eine kommt dazu. Wie viele sind es jetzt?',['2','3','4'],1,'📦 📦 + 📦'],2:['8 Bücher und 2 Bücher kommen in dein Regal. Wie viele sind es zusammen?',['9','10','12'],1,'8 + 2 = ?'],3:['30 Bücher und 20 Bücher warten im Umzugswagen. Wie viele sind es zusammen?',['40','50','60'],1,'30 + 20 = ?'],4:['120 Bausteine und 80 Bausteine gehören zum Einzug. Wie viele sind es zusammen?',['180','200','220'],1,'120 + 80 = ?']};
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
/* Lerndachs class-based learning journey and in-world activities. */
(()=>{
const badger=`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 44Q4 13 30 22L49 30 70 21Q95 11 85 45Q104 94 51 96 0 96 18 44" fill="#787d82" stroke="#38434c" stroke-width="3"/><path d="M25 29 41 43 33 78Q15 65 25 29m49 0L58 43l9 35q19-13 7-49" fill="#fff4d9"/><path d="M42 46h17l9 33q-18 22-36 0Z" fill="#fff4d9"/><ellipse cx="32" cy="55" rx="5" ry="7" fill="#38434c"/><ellipse cx="68" cy="55" rx="5" ry="7" fill="#38434c"/><circle cx="29" cy="53" r="2" fill="white"/><circle cx="66" cy="53" r="2" fill="white"/><path d="M43 73q7-8 14 0l-7 7Z" fill="#38434c"/><path d="M44 86q6 5 12 0" fill="none" stroke="#38434c" stroke-width="2"/><ellipse cx="22" cy="69" rx="8" ry="4" fill="#f28c72"/><ellipse cx="78" cy="69" rx="8" ry="4" fill="#f28c72"/><path d="m70 89 12-6 9 9-11 5Z" fill="#4fbaa8" stroke="#38434c" stroke-width="2"/></svg>`;
for(const selector of ['.badger-icon','.brand-badger'])document.querySelector(selector).innerHTML=badger;
const {paths,sources}=LerndachsCurriculum,grades=LerndachsGrades,J=LerndachsJourney,progress=J.profile;
const dialog=document.querySelector('#learning-dialog'),content=document.querySelector('#learning-content'),strip=document.querySelector('#quest-strip');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let mode='world',correct=false,pendingGrade=progress.grade,sampleTimer,memoryTimer,memoryCards=[],memoryOpen=[],memoryBusy=false,gardenCount=0,worldAttemptDone=false;
const tasksFor=p=>p.items.filter(q=>q[7].grades.includes(progress.grade));
const active=()=>progress.active==='practice'?{id:'practice',title:'Deine Übungswerkstatt',items:[progress.practiceQuestion],color:'yellow'}:paths.find(p=>p.id===progress.active);
const currentTasks=()=>progress.active==='practice'?[progress.practiceQuestion]:active()?tasksFor(active()):[];
const currentTask=()=>currentTasks()[progress.index];
const taskKey=q=>['garden','memory'].includes(q[7].type)?q[7].id+'-g'+progress.grade:q[7].id;
const finished=q=>progress.done.includes(taskKey(q));
function persist(){J.save()}
function stopSample(){clearTimeout(sampleTimer);window.WorldSound?.stopSample?.()}
function cleanup(){stopSample();clearTimeout(memoryTimer);window.speechSynthesis?.cancel()}
function reveal(){if(!dialog.open)dialog.showModal();dialog.scrollTop=0}
function close(){cleanup();dialog.close();mode='world';if(progress.active)seek()}
function resetStrip(){strip.hidden=true;document.querySelector('#adventure-button').hidden=false}
function updateHUD(){
 const g=grades[progress.grade];document.querySelector('#grade-label').textContent=g?g.label:'';
 const b=document.querySelector('#adventure-button');b.querySelector('small').textContent=!progress.starterUnlocked?'DEIN EINZUG WARTET':progress.target?'DEIN SPARZIEL':'SPIEL DICH SCHLAU';
 const target=J.catalogue.find(i=>i.id===progress.target),balance=Lernwelt.snapshot().balance;
 b.querySelector('strong').textContent=!progress.starterUnlocked?progress.starterEarned?'Dein Paket ist da!':'Dein erstes Zuhause':target?target.name:'Ein kleines Abenteuer?';
 b.querySelector('em').textContent=!progress.starterUnlocked?progress.starterEarned?'Jetzt auspacken →':'Eine Aufgabe öffnet dein Einzugspaket →':target?balance>=target.price?'Ziel erreicht · Im Laden holen →':`${balance} / ${target.price} Sterne · noch ${Math.ceil((target.price-balance)/15)} Aufgaben →`:'Mit Dachs die Welt entdecken →';
}
window.addEventListener('world-saved',updateHUD);
function chooseGrade(){
 cleanup();mode='grades';pendingGrade=progress.grade;document.querySelector('#panel').close();
 content.innerHTML=`<div class="class-intro"><div class="guide-face">${badger}</div><p class="learn-eyebrow">WILLKOMMEN BEI LERNDACHS</p><h2 id="learn-title">Deine Klasse. Dein Abenteuer.</h2><p>Wo lernst du gerade? Ich suche passende Aufgaben für dich aus.</p><div class="class-grid" role="group" aria-label="Klasse auswählen">${Object.entries(grades).map(([id,g])=>`<button data-grade="${id}" aria-pressed="${pendingGrade===Number(id)}"><span>${id==='0'?'✿':id}</span><strong>${g.label}</strong><small>${g.note}</small></button>`).join('')}</div><button id="confirm-grade" class="journey-primary" ${pendingGrade===null?'disabled':''}>${progress.starterUnlocked?'Weiter in meine Welt →':'Mein Abenteuer starten →'}</button><p class="learning-footnote">Du kannst die Klasse später in den Einstellungen ändern. Dein Zuhause und deine Sterne bleiben erhalten.</p></div>`;
 document.querySelector('#learn-close').hidden=progress.grade===null;reveal();
}
function starter(){
 if(progress.grade===null){chooseGrade();return}if(!J.player()){cleanup();dialog.close();LerndachsFriends.open('initial',starter);return}if(progress.starterUnlocked){open();return}if(progress.starterEarned){packScreen();return}
 cleanup();mode='intro';correct=false;const q=LerndachsIntro[progress.grade];
 content.innerHTML=`<div class="intro-task"><p class="learn-eyebrow">${grades[progress.grade].label.toUpperCase()} · DEIN ERSTES ABENTEUER</p><h2 id="learn-title">Ein Zuhause für deine Ideen.</h2><p>Noch ist dein Haus leer. Löse diese leichte Aufgabe und du bekommst ein Paket mit Sofa, Tisch, Pflanze und weiteren Dingen zum Einziehen.</p><div class="moving-boxes">${q[3]}</div><h3>${q[0]}</h3><button id="read-intro" class="read-button">♫ Vorlesen</button><div class="answer-grid">${q[1].map((a,i)=>`<button data-intro-answer="${i}"><b>${String.fromCharCode(65+i)}</b>${a}</button>`).join('')}</div><div id="intro-feedback" role="status">Du darfst ausprobieren. Es gibt keinen Zeitdruck.</div><div class="starter-preview">${['sofa','table','plant'].map(id=>`<div>${J.preview(J.catalogue.find(i=>i.id===id))}<span>${WorldArt.names[id]}</span></div>`).join('')}<span class="starter-more">+ 9 weitere Dinge</span></div></div>`;
 document.querySelector('#learn-close').hidden=false;reveal();
}
function packScreen(){
 cleanup();mode='pack';
 content.innerHTML=`<div class="pack-screen"><p class="learn-eyebrow">DEINE ERSTE AUFGABE IST GELÖST</p><div class="gift-box" aria-hidden="true">✦</div><h2 id="learn-title">Willkommen zu Hause!</h2><p>Dein Einzugspaket enthält 12 Dinge.<br>Eine Hälfte ist gemütlich. Die andere wartet auf deine Ideen.</p><div class="starter-preview">${['sofa','table','plant'].map(id=>`<div>${J.preview(J.catalogue.find(i=>i.id===id))}<span>${WorldArt.names[id]}</span></div>`).join('')}</div><button id="claim-starter" class="journey-primary">Mein Einzugspaket auspacken →</button><p class="learning-footnote">Das Paket gibt es einmal. Weitere Einrichtung und Haustiere erspielst du dir mit Aufgaben.</p></div>`;reveal();
}
function targetCard(){const i=J.catalogue.find(i=>i.id===progress.target);if(!i)return '';const balance=Lernwelt.snapshot().balance,remaining=Math.max(0,i.price-balance);return `<div class="target-card"><div class="target-art">${J.preview(i,WorldArt.homes.some(h=>h.id===i.id))}</div><div><small>DEIN NÄCHSTES ZIEL</small><strong>${escape(i.name)}</strong><span>${balance} / ${i.price} Sterne · ${remaining?`noch ${Math.ceil(remaining/15)} neue Aufgaben`:'Du hast genug Sterne!'}</span><progress max="${i.price||1}" value="${Math.min(balance,i.price)}" aria-label="Sterne für dein Sparziel"></progress></div><button id="target-shop">${remaining?'Laden':'Holen'} →</button></div>`}
function open(){if(!progress.starterUnlocked){starter();return}cleanup();document.querySelector('#panel').close();mode='menu';menu();reveal()}
function menu(){
 cleanup();mode='menu';document.querySelector('#learn-close').hidden=false;
 const eligible=paths.flatMap(tasksFor),n=eligible.filter(finished).length;
 content.innerHTML=`<div class="learn-intro"><div class="guide-face">${badger}</div><p class="learn-eyebrow">LERNDACHS · ${grades[progress.grade].label.toUpperCase()}</p><h2 id="learn-title">Welche Idee wächst heute?</h2><p>Eine neue gelöste Aufgabe bringt 15 Sterne. Daraus werden Möbel, Pflanzen und tierische Freunde.</p><div class="discovery-count">${n} / ${eligible.length} Aufgaben für ${grades[progress.grade].label} entdeckt</div></div>${targetCard()}<div class="journey-options"><button id="together-toggle" aria-pressed="${progress.together}">${progress.together?'✓ Wir spielen zu zweit':'♡ Gemeinsam spielen'}</button></div>${progress.together?'<p class="together-note">Ein Gerät, zwei Ideen: Eine Person spielt, die andere erklärt oder hilft. Nach einer neuen gelösten Aufgabe tauscht ihr die Rollen.</p>':''}<div class="path-grid">${paths.map(p=>{
 const tasks=tasksFor(p),count=tasks.filter(finished).length;return `<button class="learning-path ${p.color}" data-path="${p.id}"><span class="path-symbol">${p.icon}</span><small>${p.tag}</small><strong>${p.title}</strong><span>${p.desc}</span><div class="path-dots">${Array.from({length:tasks.length},(_,i)=>`<i class="${i<count?'done':''}"></i>`).join('')}<b>${count}/${tasks.length}</b></div><em>${count===tasks.length?'Noch mal entdecken ↗':'Los geht’s →'}</em></button>`;
 }).join('')}</div><button id="start-practice" class="practice-button">✦ Übungswerkstatt · neue Rechenaufgabe</button><div class="badge-row">${[[1,'Erster Schritt'],[5,'Ideensammler'],[20,'Weltgestalter'],[50,'Entdeckerprofi']].map(([count,title])=>`<span class="${progress.done.length>=count?'earned':''}">${progress.done.length>=count?'✦':'◇'} ${title}</span>`).join('')}</div><p class="learning-footnote">Ohne Zeitdruck. Tipps und neue Versuche sind willkommen.<br>Bereits gelöste Aufgaben geben keine zusätzlichen Sterne.</p><button id="curriculum-info" class="curriculum-link">Für Erwachsene: Lernziele & Spielkonzept ↗</button>`;
}
function begin(id){progress.active=id;const tasks=currentTasks(),index=tasks.findIndex(q=>!finished(q));progress.index=index<0?0:index;progress.worldMoves=[];worldAttemptDone=false;persist();question()}
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
function commonQuestion(q){const meta=q[7],p=active(),bounds=WorldArt.bounds[q[0]];return `<div class="question-heading"><span class="learn-eyebrow">${p.title} · ${grades[progress.grade].label}</span><span class="question-reward">✦ +${finished(q)?0:15}</span></div><div class="question-art ${p.color}"><svg viewBox="${bounds.join(' ')}" aria-hidden="true">${J.art(q[0])}</svg><span>${escape(q[6])}</span></div><p class="task-skill">${escape(meta.skill)}</p>${progress.together?`<p class="turn-label">Spieler ${progress.turn} spielt · Spieler ${progress.turn===1?2:1} hilft und erklärt.</p>`:''}<h2 id="learn-title">${escape(q[7].goal==='carry'?q[2].replaceAll('Milo',J.player()?.characterName||WorldArt.names[J.player()?.id]||'deine Figur'):q[2])}</h2><div class="task-tools"><button id="read-question" class="read-button">♫ Vorlesen</button><button id="task-hint" class="read-button">✦ Kleiner Tipp</button>${meta.audio?'<button id="play-sample" class="sample-button">▶ Hörprobe</button>':''}</div>${meta.audio?'<p class="audio-note">Die Hörprobe schaltet den Ton ein. Höre beliebig oft oder wähle „Später“.</p>':''}<div id="task-hint-text" class="task-hint" hidden>${escape(meta.hint)}</div>`}
function footer(){return '<div id="answer-feedback" role="status" aria-live="polite">Du hast Zeit. Probiere es aus!</div><div class="question-actions"><button id="question-back">← Zurück zur Welt</button><button id="skip-question">Später →</button><button id="next-question" hidden>Weiter entdecken →</button></div>'}
function question(){
 const q=currentTask();if(!q)return;document.querySelector('#panel').close();cleanup();mode='question';correct=false;worldAttemptDone=false;window.LerndachsEvidence?.start(q,progress.active);document.querySelector('#learn-close').hidden=false;
 let interaction='';
 if(q[7].type==='world')interaction='<div class="world-task-actions"><button id="enter-world-task" class="journey-primary">In meiner Welt ausprobieren →</button><p>Bewege die Dinge mit Maus oder Finger. Mit Tab und Pfeiltasten kannst du sie auch per Tastatur bewegen.</p></div>';
 else if(q[7].type==='garden'){gardenCount=0;interaction='<div class="garden-game"><p id="garden-order"></p><div id="garden-bed" aria-label="Dein bepflanztes Beet"></div><div class="garden-controls"><button id="garden-remove" aria-label="Einen Samen herausnehmen">−</button><span id="garden-count" aria-live="polite">0 Samen</span><button id="garden-add" aria-label="Einen Samen pflanzen">+ Samen</button></div><button id="check-garden" class="journey-primary">Mein Beet prüfen →</button></div>'}
 else if(q[7].type==='memory')interaction='<div class="memory-game"><p id="memory-rule"></p><div id="memory-grid"></div><p id="memory-count" aria-live="polite"></p></div>';
 else interaction=`<div class="answer-grid">${q[3].map((a,i)=>`<button data-answer="${i}"><b>${String.fromCharCode(65+i)}</b>${escape(a)}</button>`).join('')}</div>`;
 content.innerHTML=commonQuestion(q)+interaction+footer();
 if(q[7].type==='garden')renderGarden();if(q[7].type==='memory')startMemory();
 if(!('speechSynthesis' in window))document.querySelector('#read-question').hidden=true;reveal();
}
function success(q){
 if(correct)return;correct=true;stopSample();window.LerndachsEvidence?.finish(q);window.dispatchEvent(new Event('learning-celebration'));const already=finished(q);J.reward(taskKey(q));if(!already)window.dispatchEvent(new Event('character-celebrate'));
 const feedback=document.querySelector('#answer-feedback');feedback.classList.add('correct-feedback');feedback.textContent='Geschafft! '+q[5]+(already?'':' +15 Sterne für deine Welt.');
 document.querySelector('#next-question').hidden=false;document.querySelector('#skip-question').hidden=true;content.querySelectorAll('[data-answer],#check-garden,#enter-world-task').forEach(b=>b.disabled=true);WorldSound.effect('reward');
 for(const [n,name] of [[1,'Erster Schritt'],[5,'Ideensammler'],[20,'Weltgestalter'],[50,'Entdeckerprofi']])if(progress.done.length>=n&&!progress.badges.includes(name))progress.badges.push(name);persist();window.dispatchEvent(new CustomEvent('learning-success',{detail:{subject:active()?.subject||'math'}}));
}
function answer(i){if(correct)return;const q=currentTask(),button=content.querySelector(`[data-answer="${i}"]`);if(i!==q[4]){window.LerndachsEvidence?.mistake();button.classList.add('try-again');button.disabled=true;document.querySelector('#answer-feedback').textContent='Noch nicht ganz. '+q[7].hint+' Probiere es noch einmal.';WorldSound.effect('tea');return}button.classList.add('is-correct');success(q)}
function gardenTarget(){return [3,5,8,12,18][progress.grade]}
function renderGarden(){
 const orders=['Pflanze 3 Samen.','Pflanze 5 Samen.','Pflanze zuerst 5 Samen und dann noch 3.','Lege 3 Reihen mit je 4 Samen.','Lege 4 Reihen mit je 4 Samen und dann noch 2 Samen.'];
 document.querySelector('#garden-order').textContent=orders[progress.grade];
 document.querySelector('#garden-bed').innerHTML=Array.from({length:Math.max(4,gardenCount)},(_,i)=>`<span class="${i<gardenCount?'planted':''}">${i<gardenCount?'🌱':'·'}</span>`).join('');document.querySelector('#garden-count').textContent=gardenCount+' Samen';document.querySelector('#garden-remove').disabled=gardenCount===0;
}
function startMemory(){
 const iconPairs=[['🐱','🐱'],['☀','☀'],['🌳','🌳']],wordPairs=[['🐱','Katze'],['☀','Sonne'],['🌳','Baum'],['☕','Tasse']];
 const pairs=progress.grade===0?iconPairs:progress.grade===1?wordPairs.slice(0,3):progress.grade===2?wordPairs:progress.grade===3?[['schnell','flink'],['leise','still'],['groß','riesig'],['klein','winzig']]:[['hell','dunkel'],['warm','kalt'],['laut','leise'],['groß','klein']];
 memoryCards=pairs.flatMap((pair,g)=>pair.map(text=>({text,group:g,matched:false,open:false}))).sort(()=>Math.random()-.5);memoryOpen=[];memoryBusy=false;
 document.querySelector('#memory-rule').textContent=progress.grade===0?'Finde gleiche Bilder.':progress.grade<3?'Finde Bild und passendes Wort.':progress.grade===3?'Finde Wörter mit ähnlicher Bedeutung.':'Finde Wörter mit gegenteiliger Bedeutung.';renderMemory();
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
 content.innerHTML=`<div class="learn-finish"><div class="guide-face">${badger}</div><p class="learn-eyebrow">DEINE WELT WÄCHST MIT DIR</p><h2 id="learn-title">${p.title}: ${complete?'geschafft!':'Runde beendet!'}</h2><p>${n} / ${tasks.length} Aufgaben für ${grades[progress.grade].label} entdeckt.</p><div class="finish-stars">✦ ✦ ✦</div><p>${progress.together?'Erzählt euch: Was habt ihr heute herausgefunden?':'Was war deine schönste Entdeckung? Erzähle sie jemandem.'}</p><button id="finish-shop">Meine Welt verschönern →</button><button id="finish-menu">${complete?'Ein neues Abenteuer':'Offene Aufgaben entdecken'}</button></div>`;progress.active=null;persist();resetStrip();mode='finish';dialog.scrollTop=0;
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
 cleanup();mode='source';content.innerHTML=`<div class="curriculum-info"><p class="learn-eyebrow">LERNDACHS · FÜR ERWACHSENE</p><h2 id="learn-title">Lernen hat hier einen Platz.</h2><p>Die Klassenauswahl filtert die Aufgaben. Vorschule und Klasse 1 nutzen kleine Mengen, erste Wörter und alltägliches Entdecken. Klasse 2 erweitert Rechnen und Lesen. Für Klasse 3 und 4 kommen größere Zahlen, Textverständnis und begründete Zusammenhänge hinzu. Dies ist eine Auswahl aus den bereitgestellten Lehrplänen, keine vollständige Abdeckung und keine automatische Diagnose.</p><p>Das Einzugspaket folgt auf eine erste einfache Aufgabe. Neue Lösungen bringen je 15 Sterne. Möbel kosten 20–140 Sterne, Haustiere 300–450 Sterne. Tipps, Wiederholungen und Auslassen kosten nichts. Haustiere verlieren nichts durch Pausen; es gibt keine Ranglisten oder Zeitstrafen.</p><p>Mitmachaufgaben, ein Mengenbeet, Wörter-Memory und freies Einrichten ergänzen die Wissensfragen. Im lokalen Partner-Modus wechseln zwei Personen am selben Gerät die Rollen Spielen und Erklären. Das ersetzt keine echte Lerngruppe.</p>${paths.map(p=>{const s=sources[p.subject];return `<details><summary>${s.title}</summary><p>${escape(s.file)} · Fassung ${s.edition}<br>${escape(s.sections)}<br>Die Aufgaben führen ihre Lernziele und PDF-Seiten im Aufgabenkatalog mit.</p></details>`}).join('')}<p class="source-note">Alle Aufgaben sind eigene Formulierungen. Die PDFs bleiben lokal. Alte Prototyp-Spielstände unter den bisherigen Speicherschlüsseln werden nicht überschrieben. Die neue Lernreise nutzt einen getrennten Spielstand.</p><button id="finish-menu" class="sample-button">← Zu den Abenteuern</button></div>`;dialog.scrollTop=0;
}
content.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.grade!==undefined){pendingGrade=Number(b.dataset.grade);content.querySelectorAll('[data-grade]').forEach(btn=>btn.setAttribute('aria-pressed',Number(btn.dataset.grade)===pendingGrade));document.querySelector('#confirm-grade').disabled=false}
 else if(b.id==='confirm-grade'){if(pendingGrade===null)return;if(progress.grade!==pendingGrade){progress.active=null;progress.index=0;resetStrip()}progress.grade=pendingGrade;persist();document.querySelector('#learn-close').hidden=false;close();if(!progress.starterUnlocked)starter()}
 else if(b.dataset.introAnswer!==undefined){if(correct)return;const q=LerndachsIntro[progress.grade];if(Number(b.dataset.introAnswer)===q[2]){correct=true;window.dispatchEvent(new Event('learning-celebration'));progress.starterEarned=true;persist();WorldSound.effect('reward');packScreen()}else{b.disabled=true;b.classList.add('try-again');document.querySelector('#intro-feedback').textContent='Noch nicht ganz. Schau dir die Kisten oder die Zahlen in Ruhe an und versuche es erneut.'}}
 else if(b.id==='claim-starter'){if(J.grantStarter()){close();resetStrip();toast('12 Dinge ausgepackt. Dein Zuhause wächst jetzt mit deinen Ideen!')}}
 else if(b.dataset.path)begin(b.dataset.path);
 else if(b.dataset.answer!==undefined)answer(Number(b.dataset.answer));
 else if(b.dataset.memory!==undefined)memoryFlip(Number(b.dataset.memory));
 else if(b.id==='together-toggle'){progress.together=!progress.together;persist();menu()}
 else if(b.id==='target-shop'||b.id==='finish-shop'){close();const t=J.catalogue.find(i=>i.id===progress.target);J.showShop(t?.kind==='pet'?'pets':'decor')}
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
 else if(b.id==='read-question'||b.id==='read-intro'){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const q=b.id==='read-intro'?LerndachsIntro[progress.grade]:currentTask(),text=b.id==='read-intro'?q[0]+'. '+q[1].join('. '):q[2]+'. '+q[3].join('. ');const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.85;speechSynthesis.speak(u)}
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
dialog.addEventListener('cancel',e=>{if(progress.grade===null)e.preventDefault()});
dialog.addEventListener('close',cleanup);
window.addEventListener('request-grade-settings',chooseGrade);
document.querySelector('#adventure-button').onclick=()=>{progress.taskWaiting=false;persist();if(!progress.starterUnlocked)starter();else if(currentTask())question();else Learning.nextFresh(true)};document.querySelector('#learn-button').onclick=open;
window.addEventListener('request-starter',starter);window.addEventListener('request-learning',open);
window.Learning={get progress(){return structuredClone(progress)},get currentTask(){return currentTask()},get currentTasks(){return currentTasks()},paths,sources,grades,openSubject(subject){const p=paths.find(p=>p.subject===subject);if(p)begin(p.id)},nextFresh(manual=false){if(!progress.starterUnlocked)return;const candidates=paths.flatMap(p=>tasksFor(p).filter(q=>!finished(q)).map(q=>({p,q})));if(!candidates.length){newPractice();return}const hit=candidates[(progress.promptNumber||0)%candidates.length];progress.promptNumber=(progress.promptNumber||0)+1;progress.active=hit.p.id;progress.index=tasksFor(hit.p).indexOf(hit.q);progress.worldMoves=[];persist();question();if(manual)return;const note=document.createElement('p');note.className='timed-discovery-note';note.textContent='Zehn Minuten gespielt – eine neue Entdeckung wartet!';content.prepend(note)}};
updateHUD();if(!Number.isInteger(progress.grade)||!grades[progress.grade]){progress.grade=null;chooseGrade()}else if(!progress.starterUnlocked)starter();else if(progress.active)seek();
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
 body.innerHTML=`<div class="schedule-heading"><span class="learn-eyebrow">DEINE WOCHE, DEINE IDEEN</span><h2 id="schedule-title">Mein Stundenplan</h2><p>${s.demo?'Das ist ein Beispielplan. Ersetze die Fächer und Zeiten durch deinen eigenen Plan.':s.basedOnDemo?'Dein angepasster Beispielplan. Prüfe auch die anderen Fächer und Zeiten.':'Dein eigener Plan. Tippe auf ein Fach oder eine Uhrzeit, um es zu ändern.'}</p></div><div class="schedule-day-tabs" role="group" aria-label="Wochentag anzeigen">${days.map((d,i)=>`<button data-schedule-day="${i}" aria-pressed="${i===day}" aria-label="${d}">${shortDays[i]}</button>`).join('')}</div><div class="schedule-table" role="table" aria-label="Wochenstundenplan"><div class="schedule-row schedule-header" role="row"><span role="columnheader">Zeit</span>${days.map((d,i)=>`<span role="columnheader" class="schedule-day-${i} ${day===i?'selected-day':''}">${d}</span>`).join('')}</div>${s.rows.map((row,r)=>`<div class="schedule-row" role="row"><button class="lesson-time" data-edit-time="${r}" aria-label="Zeit von Zeile ${r+1} ändern"><b>${r+1}</b><span>${escape(row.start)}<br>${escape(row.end)}</span><small>✎</small></button>${row.slots.map((name,c)=>{const [_,icon,color]=subjectInfo(name);return `<div role="cell" class="schedule-day-${c} ${day===c?'selected-day':''}"><button class="lesson-cell ${color} ${name?'':'empty-lesson'}" data-edit-slot="${r},${c}" aria-label="${days[c]}, Zeile ${r+1}: ${escape(name||'Fach eintragen')}"><span aria-hidden="true">${name?icon:'+'}</span><strong>${escape(name||'Fach eintragen')}</strong><small>✎</small></button></div>`}).join('')}</div>`).join('')}</div><div class="schedule-actions"><button id="add-lesson">+ Stunde ergänzen</button><button id="blank-schedule">Leeren Plan beginnen</button><button id="demo-schedule">Beispielplan laden</button>${undoPlan?'<button id="undo-schedule">↶ Rückgängig</button>':''}</div><p id="schedule-status" role="status" aria-live="polite">${s.demo?'Beispieldaten · kein echter Schulstundenplan':'Dein Plan wird auf diesem Gerät gespeichert.'}</p><div id="schedule-editor" hidden></div>`;
}
function editSlot(r,c){
 editing={kind:'slot',r,c};const name=plan().rows[r].slots[c],editor=document.querySelector('#schedule-editor');editor.hidden=false;
 editor.innerHTML=`<div class="schedule-edit-top"><div><p class="learn-eyebrow">${days[c].toUpperCase()} · ${r+1}. ZEILE</p><h3>Was steht auf deinem Plan?</h3></div><button id="close-schedule-editor" aria-label="Bearbeitung schließen">×</button></div><div class="subject-palette">${subjects.map(([label,icon,color])=>`<button data-subject="${escape(label)}" class="${color}"><span>${icon}</span>${escape(label)}</button>`).join('')}</div><label class="schedule-custom-label">Eigenes Fach<input id="custom-subject" maxlength="40" placeholder="z. B. Klassenrat" value="${escape(name)}"></label><div class="schedule-edit-actions"><button id="save-subject" class="journey-primary">Fach übernehmen</button><button id="clear-subject">Feld leeren</button></div>`;
 editor.scrollIntoView({behavior:'auto',block:'nearest'});editor.querySelector('[data-subject]')?.focus({preventScroll:true});
}
function editTime(r){
 editing={kind:'time',r};const row=plan().rows[r],editor=document.querySelector('#schedule-editor');editor.hidden=false;
 editor.innerHTML=`<div class="schedule-edit-top"><div><p class="learn-eyebrow">ZEILE ${r+1}</p><h3>Wann beginnt deine Stunde?</h3></div><button id="close-schedule-editor" aria-label="Bearbeitung schließen">×</button></div><div class="time-inputs"><label>Beginn<input id="lesson-start" type="time" value="${row.start}" required></label><label>Ende<input id="lesson-end" type="time" value="${row.end}" required></label></div><div class="schedule-edit-actions"><button id="save-lesson-time" class="journey-primary">Zeit übernehmen</button><button id="remove-lesson">Diese Zeile entfernen</button></div><p id="time-error" role="alert"></p>`;
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
document.querySelector('#schedule-close').onclick=()=>dialog.close();document.querySelector('#schedule-button').onclick=open;
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
/* Ephemeral gestures live inside the sprite, never in saved world coordinates. */
(()=>{
'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),active=new Map(),turns=new Map();
let nextIdle=performance.now()+6500,celebrate=false;
const blocked=()=>document.hidden||reduced.matches||document.body.classList.contains('no-motion');
const busy=()=>!!document.querySelector('dialog[open]')||document.body.classList.contains('is-dragging');
const people=()=>[...document.querySelectorAll('#objects .person')];
function sync(){
 const now=performance.now();
 if(blocked()){active.clear();celebrate=false}
 for(const el of people()){
  const action=el.querySelector('.character-action'),gesture=active.get(el.dataset.uid);
  if(!action)continue;
  if(!gesture||now>=gesture.end||blocked()){
   if(gesture&&now>=gesture.end)active.delete(el.dataset.uid);
   action.removeAttribute('data-gesture');action.style.removeProperty('--gesture-delay');continue;
  }
  // Rebuilds after a tap/drag resume the same gesture instead of restarting it.
  if(action.dataset.gesture!==gesture.type){
   action.style.setProperty('--gesture-delay',`${-(now-gesture.start)}ms`);
   action.dataset.gesture=gesture.type;
  }
 }
}
function gesture(el,type,delay=0){
 if(!el||blocked())return;
 if(type==='wave'&&!el.querySelector('.character-arm-right'))type='hop';const uid=el.dataset.uid;
 // Objects held at a fixed hand position should not be left floating during a hop.
 const snapshot=window.Lernwelt?.snapshot();
 const objects=snapshot?.placed?Object.values(snapshot.placed).flat():[];
 const carrying=(Array.isArray(objects)?objects:[]).some(o=>o.carrier===uid);
 if(carrying)type='look';
 const start=performance.now()+delay;
 active.set(uid,{type,start,end:start+1800});sync();
}
window.addEventListener('world-use',({detail})=>{
 if(!WorldArt.chars.has(detail.id))return;
 const el=people().find(e=>e.dataset.uid===detail.uid),n=turns.get(detail.uid)||0;
 turns.set(detail.uid,n+1);gesture(el,['wave','hop','look'][n%3]);
});
window.addEventListener('character-celebrate',()=>{celebrate=true});
document.addEventListener('visibilitychange',()=>{active.clear();nextIdle=performance.now()+6500;sync()});
reduced.addEventListener('change',sync);
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
setInterval(()=>{
 sync();if(blocked()||busy())return;
 const now=performance.now();
 if(celebrate){celebrate=false;people().forEach((el,i)=>gesture(el,'hop',i*220));nextIdle=now+9000;return}
 if(now<nextIdle)return;
 const list=people(),el=list[Math.floor(Math.random()*list.length)];
 if(el&&!active.has(el.dataset.uid))gesture(el,Math.random()<.45?'wave':'look');
 nextIdle=now+7000+Math.random()*5000;
},180);
window.LerndachsCharacters=Object.freeze({sync});
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
function settings(){const g=Learning.grades[J.profile.grade];content.innerHTML=`<div class="adult-heading"><p class="learn-eyebrow">DEINE WELT · DEINE EINSTELLUNGEN</p><h2 id="adult-title">Ein Platz für alles.</h2><p>Die Klasse bleibt auf diesem Gerät gespeichert. Hier kannst du sie ändern.</p></div><div class="settings-card"><span class="adult-symbol">▦</span><div><h3>${g?.label||'Noch keine Klasse gewählt'}</h3><p>Passende Aufgaben für deinen Lernweg.</p></div><button id="settings-grade">Klasse ändern →</button></div><div class="adult-entry-grid"><button data-adult="parents"><span>♡</span><strong>Für Eltern</strong><small>Lernwege, Fächer und Medienkompetenz im Blick.</small></button><button data-adult="teachers"><span>✎</span><strong>Für Lehrkräfte</strong><small>Aufgaben auswählen und als PDF mitnehmen.</small></button></div><div class="settings-tools"><button id="settings-help">Spielhilfe & Aufräumen</button><button data-install-app>App installieren</button></div><p class="adult-note">Ein gemeinsamer Lernstand pro Browser. Die Bereiche sind keine getrennten Konten und haben keinen Passwortschutz. Alle Lernbeobachtungen bleiben auf diesem Gerät.</p>`}
function metric(s){return `<span class="level-tag">${s.stage}</span><div class="level-track" aria-label="Lerndachs-Stufe ${s.stage}">${['Entdecken','Üben','Anwenden'].map((x,i)=>`<i class="${['Entdecken','Üben','Anwenden'].indexOf(s.stage)>=i?'lit':''}"></i>`).join('')}</div>`}
function parents(){
 const g=Learning.grades[J.profile.grade],all=subjects().map(x=>({...x,...E.summary(x.id)})),observed=all.reduce((n,s)=>n+s.observed,0),known=all.reduce((n,s)=>n+s.known,0),range=['A als Einstieg','A bis B','B','B bis C','C'][J.profile.grade]||'noch offen';
 const recent=J.profile.evidence.filter(e=>e.grade===J.profile.grade).slice(-6).reverse();
 content.innerHTML=`<div class="adult-heading"><p class="learn-eyebrow">FÜR ELTERN · ${g?.label||'LERNDACHS'}</p><h2 id="adult-title">Jede Entdeckung zählt.</h2><p>Ein Blick auf den Lernweg Ihres Kindes – aus den Aufgaben und Versuchen in dieser App.</p></div><div class="parent-stats"><article><strong>${known}</strong><span>Katalogaufgaben gelöst</span></article><article><strong>${observed}</strong><span>mit Detailbeobachtung</span></article><article><strong>${J.profile.evidence.filter(e=>e.grade===J.profile.grade&&!e.errors&&!e.hints).length}</strong><span>ohne Fehlversuch oder Tipp</span></article></div><section class="level-explainer"><p class="learn-eyebrow">NIVEAUSTUFEN EINORDNEN</p><h3>Orientierungsrahmen: ${range}</h3><p>Die Klassenwahl bestimmt die Aufgaben. Die Angabe A–C beschreibt nur den groben curricularen Bezug unserer Auswahl; sie ist keine gemessene Niveaustufe Ihres Kindes. Deutsch, Mathematik und die weiteren Fächer haben eigene Anforderungen.</p><p><b>Der Lerndachs-Lernweg:</b> Noch offen = keine Detaildaten. Entdecken = 1–2 verschiedene Lösungen. Üben = ab 3 Lösungen. Anwenden = mindestens 6 Lösungen, davon 80 % ohne Fehlversuch oder Tipp, aus mindestens 3 Lernzielen. Das sind appinterne Hinweise, keine Schulnoten.</p></section><div class="subject-grid">${all.map(s=>`<article class="subject-card"><p class="learn-eyebrow">${s.label}</p><h3>${s.known} / ${s.total} entdeckt</h3>${metric(s)}<p>${s.observed?`${s.independent} von ${s.observed} beobachteten Lösungen ohne Fehlversuch oder Tipp. ${s.retries} mit erneutem Versuch, ${s.hints} mit Tipp.`:'Noch keine Detailbeobachtungen. Beginnen Sie mit einer gemeinsamen Aufgabe.'}</p>${s.legacy?`<small>${s.legacy} frühere Lösungen ohne Versuchsdaten.</small>`:''}<button data-parent-practice="${s.id}">Gemeinsam entdecken →</button></article>`).join('')}</div><section class="media-report"><p class="learn-eyebrow">MEDIENKOMPETENZ</p><h3>Sicher, kreativ und aufmerksam.</h3><p>Die Alltagsszenarien orientieren sich an den sechs <a href="${LerndachsMedia.source}" target="_blank" rel="noopener">Kompetenzbereichen der KMK</a>. Richtige Antworten zeigen Wissen in der App; praktische Fertigkeiten im Alltag müssen gemeinsam beobachtet werden.</p><div class="media-grid">${LerndachsMedia.dimensions.map(([id,label])=>{const s=E.summary('media',id);return `<article><strong>${label}</strong><span>${s.known}/${s.total} Szenarien gelöst</span><small>${s.observed?`${s.independent}/${s.observed} ohne Fehlversuch oder Tipp`:'Noch keine Beobachtung'}</small><p>${s.known?'Fragen Sie nach einem Beispiel aus dem Alltag.':'Probieren Sie ein Szenario gemeinsam aus.'}</p></article>`}).join('')}</div></section><section><h3>Zuletzt entdeckt</h3>${recent.length?`<ul class="recent-learning">${recent.map(e=>`<li><span>${esc(e.skill)}</span><small>${new Date(e.at).toLocaleDateString('de-DE')} · ${e.errors?'mit neuem Versuch':e.hints?'mit Tipp':'ohne Fehlversuch oder Tipp'}</small></li>`).join('')}</ul>`:'<p>Neue Lösungen erscheinen hier mit Datum. Frühere Antworten bleiben als Katalogfortschritt erhalten.</p>'}</section><p class="adult-note">Keine standardisierte Diagnostik. Vorlesefunktion, Hilfe außerhalb der App und Zusammenarbeit werden nicht vollständig erfasst. Lernstand dieses Browsers; mehrere Kinder am selben Gerät teilen sich diese Daten.</p>`;
}
shell.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.adult)open(b.dataset.adult);if(b.id==='adult-close')shell.close();if(b.id==='settings-grade'){shell.close();window.dispatchEvent(new Event('request-grade-settings'))}if(b.id==='settings-help'){shell.close();window.dispatchEvent(new Event('request-world-help'))}if(b.dataset.parentPractice){shell.close();Learning.openSubject(b.dataset.parentPractice)}});
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
function render(node){host=node;pick();host.innerHTML=`<div class="adult-heading"><p class="learn-eyebrow">FÜR LEHRKRÄFTE · DIE AUFGABENWERKSTATT</p><h2 id="adult-title">Eine Runde Lernen zum Mitnehmen.</h2><p>Aus dem Lerndachs-Aufgabenkatalog: nach Klasse und Fach auswählen, Vorschau prüfen und ein fertiges PDF herunterladen.</p></div><form id="worksheet-form" class="worksheet-form"><label>Klasse<select id="worksheet-grade">${Object.entries(Learning.grades).map(([id,g])=>`<option value="${id}" ${Number(id)===config.grade?'selected':''}>${g.label}</option>`).join('')}</select></label><label>Fach<select id="worksheet-subject"><option value="all">Bunte Mischung</option>${A.subjects().map(s=>`<option value="${s.id}" ${s.id===config.subject?'selected':''}>${s.label}</option>`).join('')}</select></label><label>Aufgaben<select id="worksheet-count">${[3,6,9,12].map(n=>`<option ${n===config.count?'selected':''}>${n}</option>`).join('')}</select></label><label class="worksheet-title-field">Titel<input id="worksheet-title" value="${esc(config.title)}" maxlength="70"></label><label class="worksheet-check"><input id="worksheet-solutions" type="checkbox" ${config.solutions?'checked':''}> Lösungsseiten für die Lehrkraft anhängen</label></form><div class="worksheet-actions"><button id="worksheet-shuffle">Auswahl neu mischen ↻</button><button id="worksheet-download" class="journey-primary">PDF herunterladen ↓</button></div><p id="worksheet-status" role="status"></p><div id="worksheet-preview"></div><p class="adult-note">Es werden eigene Multiple-Choice-Aufgaben ohne Hörproben verwendet. Platz für Kreuze und einen eigenen Lösungsweg ist enthalten. Der PDF-Download funktioniert nach dem ersten Laden auch offline. Die Auswahl hier ändert die Klasse des Kindes nicht.</p>`;preview();
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
 if(document.hidden||!p.starterUnlocked)return;
 const busy=!!document.querySelector('dialog[open]')||document.body.classList.contains('is-dragging');
 if(!busy)p.playSincePrompt=Math.min(interval,p.playSincePrompt+elapsed);
 if(p.playSincePrompt>=interval&&!busy){p.playSincePrompt=0;p.taskWaiting=true;save();window.dispatchEvent(new Event('task-waiting'))}
 else if(now-lastSave>30000)save();
}
document.addEventListener('visibilitychange',()=>{last=performance.now();save()});window.addEventListener('pagehide',save);setInterval(tick,1000);
let confettiTimer;
function celebrate(){
 document.querySelector('#learning-confetti')?.remove();clearTimeout(confettiTimer);
 const layer=document.createElement('div');layer.id='learning-confetti';layer.setAttribute('aria-hidden','true');
 const quiet=matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.classList.contains('no-motion');layer.className=quiet?'quiet-confetti':'';
 for(let i=0;i<(quiet?18:144);i++){const piece=document.createElement('i');piece.style.cssText=`--left:${(i*37)%100}%;--drift:${(i%7-3)*30}px;--turn:${i%2?620:-480}deg;--delay:${i%8*.045}s;--color:${['#4fbaa8','#ffc958','#edb9cf','#f28c72','#ac9bd4'][i%5]}`;layer.append(piece)}
 // Dialog content is in the browser top layer; append confetti there for visible celebrations.
 const dialog=[...document.querySelectorAll('dialog[open]')].at(-1);(dialog||document.body).append(layer);
 confettiTimer=setTimeout(()=>layer.remove(),quiet?1300:3400);
}
window.addEventListener('learning-celebration',celebrate);
})();

;
/* A cross-subject challenge; each success is recorded from real learning evidence. */
(()=>{
const J=LerndachsJourney,p=J.profile,paths=LerndachsCurriculum.paths,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
p.halloween??={started:false,unlocked:false,enabled:false,subjects:[],costumes:{}};const h=p.halloween;h.costumes??={};
const props=[{id:'halloween-pumpkin',name:'Kürbislicht',x:390,y:800},{id:'halloween-ghost',name:'Freundliches Gespenst',x:1060,y:420},{id:'halloween-bats',name:'Fledermaus-Girlande',x:640,y:150},{id:'halloween-candy',name:'Süße Schale',x:920,y:780}];
function art(id){const {R,E,P,C}=WorldArt;
 if(id==='halloween-pumpkin')return `${E(0,0,65,10,'#38434c20')}${P('M-4-91q-2-25 15-22','none',C.leaf,9)}${E(0,-44,61,47,'#f6a34f',C.ink)}${E(0,-44,28,47,'#ffbd63',C.ink,2)}${P('M-35-48l16-19 9 21Zm45 2 9-21 16 19ZM-31-27l16 12 15-10 15 10 16-12-10 22h-42Z','#fff2ac',C.ink,2)}`;
 if(id==='halloween-ghost')return `${P('M-55 0v-70q0-77 55-77t55 77V0L35-17 17 0 0-17-17 0-35-17Z','#fffdf4',C.ink)}${E(-18,-81,7,12,C.ink)}${E(18,-81,7,12,C.ink)}${P('M-10-51q10 13 20 0','none',C.ink,3)}${E(-35,-57,9,5,C.pink)}${E(35,-57,9,5,C.pink)}`;
 if(id==='halloween-bats')return `${P('M-160-25Q0 30 160-25','none',C.ink,3)}${[-110,0,110].map(x=>`<g transform="translate(${x} 0)">${P('M0-8l-28-20-20 25 23-1 10 16L0 6 15 12 25-4l23 1-20-25Z','#685376',C.ink,2)}${E(-5,-1,2,3,C.white)}${E(5,-1,2,3,C.white)}</g>`).join('')}`;
 if(id==='halloween-candy')return `${E(0,-25,53,17,'#ac9bd4',C.ink)}${P('M-53-25q8 57 53 57t53-57Z','#ac9bd4',C.ink)}${[-25,0,25].map((x,i)=>`<g transform="translate(${x} -32)">${P('M-10-10l-10-7v24l10-7m20-10 10-7v24L10 0','#f28c72',C.ink,2)}${R(-11,-14,22,24,['#ffe07e','#93d6eb','#edb9cf'][i],7)}</g>`).join('')}`;
 return '';
}
for(const prop of props){WorldArt.bounds[prop.id]=prop.id==='halloween-bats'?[-170,-45,340,90]:[-70,-155,140,195];WorldArt.names[prop.id]=prop.name;J.catalogue.push({id:prop.id,name:prop.name,note:'Deine Halloween-Belohnung.',price:0,kind:'season'})}
function dress(){for(const el of document.querySelectorAll('#objects .person')){el.querySelectorAll('.halloween-costume').forEach(n=>n.remove());if(!h.enabled)continue;const costume=h.costumes[el.dataset.uid]||'witch';if(costume==='none')continue;const sprite=el.querySelector('.sprite'),g=document.createElementNS('http://www.w3.org/2000/svg','g');g.classList.add('halloween-costume');g.setAttribute('pointer-events','none');g.innerHTML=costume==='cat'?'<path d="M-40-209l3-45 27 29m20 0 27-29 3 45" fill="#685376" stroke="#38434c" stroke-width="3"/><path d="m-5-140 5 6 5-6Z" fill="#f28c72" stroke="#38434c" stroke-width="2"/><path d="M-18-132l-24-5m24 11-24 4m60-10 24-5m-24 11 24 4" stroke="#38434c" stroke-width="2"/>':costume==='hero'?'<path d="M-32-112l-39 98 71-15 71 15-39-98Z" fill="#ac9bd4" stroke="#38434c" stroke-width="3"/><path d="M-38-160q38-15 76 0l-4 20-27 2-7-8-7 8-27-2Z" fill="#f28c72" stroke="#38434c" stroke-width="2"/><ellipse cx="-17" cy="-151" rx="6" ry="4" fill="#fffdf4"/><ellipse cx="17" cy="-151" rx="6" ry="4" fill="#fffdf4"/>':'<path d="m-49-214 41-73 38 73Z" fill="#685376" stroke="#38434c" stroke-width="3"/><ellipse cx="0" cy="-212" rx="62" ry="11" fill="#685376" stroke="#38434c" stroke-width="3"/><path d="M-23-234h46" stroke="#f6b34f" stroke-width="8"/><path d="m-25-135 3-8 3 8 8 3-8 3-3 8-3-8-8-3Z" fill="#ac9bd4"/>';if(el.dataset.kind==='mo')g.setAttribute('transform','translate(0 45)');(sprite.querySelector('.character-head')||sprite.querySelector('.character-breathe')||sprite).append(g)}}
let syncing=false;
function sync(){if(syncing)return;syncing=true;document.body.classList.toggle('halloween-world',!!h.enabled);for(const el of document.querySelectorAll('[data-kind^="halloween-"]'))el.style.display=h.enabled?'':'none';dress();syncing=false}
const baseRender=J.render;J.render=()=>{baseRender();sync()};new MutationObserver(sync).observe(document.querySelector('#objects'),{childList:true});
function reward(){if(h.unlocked)return;h.unlocked=true;h.enabled=true;for(const prop of props){if(!state.owned.includes(prop.id))state.owned.push(prop.id);state.placed[state.home].push({...prop,uid:'reward-'+prop.id,s:1,layer:prop.id==='halloween-bats'?2:3.8})}J.render();window.dispatchEvent(new Event('learning-celebration'));toast('Geschafft! Deine Halloween-Welt ist freigeschaltet.')}
function observe(){if(!h.started||h.unlocked)return;let changed=false;for(const e of p.evidence||[])if((h.baseline||[]).indexOf(e.id)<0&&!h.subjects.includes(e.subject)&&paths.some(path=>path.subject===e.subject)){h.subjects.push(e.subject);changed=true}if(h.subjects.length===paths.length)reward();else if(changed)J.save()}
window.addEventListener('learning-celebration',()=>{observe();sync()});
const button=document.createElement('button');button.id='halloween-button';button.className='round-button';button.setAttribute('aria-label','Halloween-Challenge öffnen');button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6q-1-4 3-4M12 6C0 3 0 23 12 21 24 23 24 3 12 6Z"/><path d="m6 12 3-3 1 4Zm8 1 1-4 3 3ZM7 16l3 2 2-1 2 1 3-2"/></svg>';document.querySelector('.utility-buttons').append(button);
const dialog=document.createElement('dialog');dialog.id='halloween-dialog';dialog.setAttribute('aria-labelledby','halloween-title');document.body.append(dialog);
function open(){if(!p.starterUnlocked){window.dispatchEvent(new Event('request-starter'));return}dialog.innerHTML=`<div class="dialog-top"><div><p class="eyebrow">EIN KLEINES ABENTEUER DURCH ALLE FÄCHER</p><h2 id="halloween-title">Die Halloween-Challenge</h2></div><button class="icon-button" id="halloween-close" aria-label="Schließen">×</button></div><p>Löse ab dem Start eine Aufgabe aus jedem Aufgabenbereich. Tipps und neue Versuche sind erlaubt. Bereits gelöste Aufgaben kannst du dafür wiederholen.</p><div class="challenge-list">${paths.map(path=>`<button data-challenge="${path.subject}" ${h.unlocked?'disabled':''}><span>${h.subjects.includes(path.subject)?'✓':path.icon}</span><strong>${esc(LerndachsCurriculum.sources[path.subject].title)}</strong><small>${h.subjects.includes(path.subject)?'Geschafft':'Eine Aufgabe entdecken →'}</small></button>`).join('')}</div>${h.unlocked?`<button id="halloween-toggle" class="journey-primary wide">Halloween ${h.enabled?'ausschalten':'einschalten'}</button><h3>Verkleiden & schminken</h3><div class="costume-list">${J.people().map(o=>`<label>${esc(o.name)}<select data-costume="${o.uid}" aria-label="Kostüm für ${esc(o.name)}">${[['witch','Zauberhut & Sternschminke'],['cat','Katzenohren & Schnurrhaare'],['hero','Superheld & Maske'],['none','Ohne Kostüm']].map(([id,label])=>`<option value="${id}" ${(h.costumes[o.uid]||'witch')===id?'selected':''}>${label}</option>`).join('')}</select></label>`).join('')}</div>`:`<p class="note">Deine Belohnung: Kürbislicht, Gespenst, Fledermäuse und eine Süßigkeitenschale. Dazu Kostüme und Gesichtsschminke für alle Figuren.</p><button id="challenge-start" class="journey-primary wide">${h.started?'Weiter zur ersten offenen Aufgabe':'Challenge starten'} →</button>`}`;
 dialog.querySelector('#halloween-close').onclick=()=>dialog.close();dialog.querySelector('#challenge-start')?.addEventListener('click',()=>{start();const path=paths.find(path=>!h.subjects.includes(path.subject));dialog.close();Learning.openSubject(path.subject)});dialog.querySelectorAll('[data-challenge]').forEach(b=>b.onclick=()=>{start();dialog.close();Learning.openSubject(b.dataset.challenge)});dialog.querySelector('#halloween-toggle')?.addEventListener('click',()=>{h.enabled=!h.enabled;J.save();sync();open()});dialog.querySelectorAll('[data-costume]').forEach(select=>select.onchange=()=>{h.costumes[select.dataset.costume]=select.value;J.save();sync()});if(!dialog.open)dialog.showModal()}
function start(){if(!h.started){h.started=true;h.baseline=(p.evidence||[]).map(e=>e.id);J.save()}}
window.addEventListener('learning-success',({detail})=>{if(!h.started||h.unlocked||!paths.some(path=>path.subject===detail.subject))return;if(!h.subjects.includes(detail.subject)){h.subjects.push(detail.subject);if(h.subjects.length===paths.length)reward();else J.save()}});
button.onclick=open;window.LerndachsSeason={art,sync,open};sync();
})();

;
/* The world has one quiet invitation: a badger head, with no floating action tray. */
(()=>{
const head=document.querySelector('#adventure-button');head.title='Eine neue Aufgabe entdecken';
function refresh(){head.hidden=false;const waiting=!document.querySelector('#learning-dialog').open;head.classList.toggle('has-task',waiting);const q=Learning.currentTask;head.setAttribute('aria-label',q?'Aufgabe anzeigen: '+q[1]:'Nächste Aufgabe entdecken')}
window.addEventListener('world-saved',refresh);window.addEventListener('task-waiting',refresh);document.querySelector('#learning-dialog').addEventListener('close',refresh);refresh();
})();

;
/* Direct legal access is also available before onboarding or inside a modal. */
(()=>{function attach(){for(const dialog of document.querySelectorAll('dialog')){if(dialog.querySelector(':scope > .dialog-legal'))continue;const footer=document.createElement('footer');footer.className='dialog-legal';const link=document.createElement('a');link.href='impressum.html';link.target='_blank';link.rel='noopener';link.textContent='Impressum';footer.append(link);dialog.append(footer)}}new MutationObserver(attach).observe(document.body,{childList:true,subtree:true});attach()})();
