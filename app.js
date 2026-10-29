/* Local prototype economy. No trusted reward verification or real payments. */
(function(root){
'use strict';
function credit(state,{receiptId,stars}={}){
 if(typeof receiptId!=='string'||receiptId.length<1||receiptId.length>200||!Number.isSafeInteger(stars)||stars<1||stars>1000)throw new TypeError('Ungültige Belohnung');
 if(state.receipts.includes(receiptId))return {credited:false,balance:state.balance};
 if(!Number.isSafeInteger(state.balance+stars))throw new RangeError('Sternelimit erreicht');
 const from=state.balance;state.balance+=stars;state.receipts.push(receiptId);if(typeof window!=='undefined'&&window.dispatchEvent)window.dispatchEvent(new CustomEvent('stars-earned',{detail:{from,to:state.balance,stars,receiptId}}));return {credited:true,balance:state.balance};
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
function badgerFace(sleepy=false){
 const fur='#8d9290',mask='#454e50',cream='#fff8e8';
 const eyes=sleepy?`${P('M-36-61q9 9 18 0m36 0q9 9 18 0','none',C.ink,3)}`:`${[-27,27].map(x=>`${E(x,-65,11,13,C.white)}${E(x+1,-63,5.5,8,C.ink)}${E(x-1,-67,2.2,3,C.white)}`).join('')}${P('M-38-86q9-6 17 0m42 0q9-6 17 0','none',mask,3)}`;
 return `<g class="badger-face">${E(-48,-102,21,23,fur,C.ink)}${E(48,-102,21,23,fur,C.ink)}${E(-48,-102,12,14,'#e9b6aa')}${E(48,-102,12,14,'#e9b6aa')}${P('M-60-68q-4-38 33-48l9-13 10 10 13-11 9 13q47 4 49 49 8 41-32 56-31 13-61-2-35-17-30-54Z',cream)}${P('M-45-102q23 7 28 34l-7 34q-22-1-31-26-5-21 10-42Zm90 0q-23 7-28 34l7 34q22-1 31-26 5-21-10-42Z',mask,'none')}${eyes}${E(-43,-39,10,5,'#edb7a6')}${E(43,-39,10,5,'#edb7a6')}${E(0,-33,27,20,cream)}${P('M-10-45q10-5 20 0 0 10-10 12-10-2-10-12Z',C.ink,C.ink,2)}${E(-3,-44,3,1.5,'#7c8582')}${P('M0-33v7m-14-5q14 16 28 0','none',C.ink,2.5)}</g>`;
}
function badger(pose='standing'){
 const fur='#8d9290',light='#afb4ae';
 if(pose==='portrait')return badgerFace();
 if(pose==='curled')return `<g class="badger-body badger-curled">${shadow(67)}${E(10,-43,64,44,fur,C.ink)}${E(19,-43,43,30,'#f3ead7')}${P('M57-62q35 7 21 39-12 28-49 17 28 0 29-18-5-13-19-10',light)}${E(-30,-9,22,10,fur,C.ink)}<g transform="translate(-29 6) rotate(-14) scale(.65)">${badgerFace(true)}</g>${P('M8-67q5 15 17 20l-17 11-10-17Z',C.teal)}</g>`;
 return `<g class="badger-body badger-standing">${shadow(54)}${P('M34-50q46-5 36 29-10 19-39-1',light)}${E(0,-66,44,62,fur,C.ink)}${E(0,-63,27,39,'#f3ead7')}${E(-27,-7,25,12,fur,C.ink)}${E(27,-7,25,12,fur,C.ink)}${P('M-39-6v5m12-5v5m42-5v5m12-5v5','none',C.ink,2)}${P('M-35-91q-20 12-18 42','none',C.ink,19)}${P('M-35-91q-20 12-18 42','none',fur,13)}${E(-53,-46,12,14,fur,C.ink)}<g class="badger-wave">${P('M34-91q28-5 28-41','none',C.ink,19)}${P('M34-91q28-5 28-41','none',fur,13)}${E(62,-139,13,17,fur,C.ink)}${P('M58-150v8m8-8v8','none',C.ink,2)}</g><g transform="translate(0 -100)">${badgerFace()}</g>${P('M-35-111q35 16 70 0l-1 17q-32 13-68-1Z',C.teal)}${P('M23-99l23 25-23 5-9-25Z',C.teal)}${E(26,-99,9,9,'#83cdb5',C.ink,2)}</g>`;
}
function face(y=-150,skin=C.cream){return `${G(`${E(-18,y,11,14,C.white,C.ink,2)}${E(18,y,11,14,C.white,C.ink,2)}${G(`${E(-18,y,5,8,C.ink)}${E(18,y,5,8,C.ink)}${E(-20,y-3,1.8,2.5,C.white)}${E(16,y-3,1.8,2.5,C.white)}`,'character-pupils')}`,'eyes')}${E(-32,y+16,10,5,'#ef967e')}${E(32,y+16,10,5,'#ef967e')}${P(`M-9 ${y+23}q9 9 18 0`,skin)}${P(`M-2 ${y+8}q4 4 7 0`,'none',C.ink,2)}`}
function human(id){const lumi=id==='lumi',skin=lumi?'#f6bf96':'#b47b56',hair=lumi?'#685376':'#454039',shirt=lumi?'#ffc958':C.teal;
return shadow(51)+G(G(`${lumi?P('M-59-130q-10-89 60-89t62 89v35H-59Z',hair):''}${P('M-20-52v42m40-42v42','none',lumi?'#b0a1ca':'#3e777d',20)}${R(-36,-17,31,18,lumi?C.cream:C.coral,8)}${R(5,-17,31,18,lumi?C.cream:C.coral,8)}${G(P('M-36-95l-17 32','none',skin,17)+E(-53,-63,9,10,skin),'character-arm character-arm-left')}${G(P('M37-95l16 32','none',skin,17)+E(53,-63,9,10,skin),'character-arm character-arm-right')}${R(-41,-116,82,69,shirt,23)}${lumi?P('M-36-80h72m-64 16h56','none','#fff0ab',5):`${P('M-28-115v25h56v-25m-56 25v40h56v-40','#408e9a')}${R(-13,-83,26,23,'#5da9b2',6)}${E(-22,-94,3,3,C.yellow)}${E(22,-94,3,3,C.yellow)}`}${G(`${E(-50,-145,10,15,skin,C.ink)}${E(50,-145,10,15,skin,C.ink)}${R(-51,-199,102,91,skin,39)}${lumi?P('M-53-166q-5-46 22-42 13-22 48-11 36 3 39 43-28-1-45-29-14 29-64 39Z',hair):`${P('M-52-171q-3-38 30-39 25-30 63 0l14 43-16-18-17 5-14-16-20 18-17-8-23 15Z',hair)}${[-39,-18,5,26,43].map((x,i)=>E(x,-196-(i%2)*11,17,17,hair,C.ink,2)).join('')}`}${face(-151,skin)}${lumi?`${P('M28-205q-19-18-7-23 13-3 16 13 16-15 23-6 4 12-18 16Z',C.coral)}${E(37,-211,6,6,C.yellow,C.ink,2)}`:''}`,'character-head')}`,'character-breathe'),'character-action')}
function fox(){return shadow(49)+G(`${P('M35-51q65 2 47-56-25 30-46 31','#e59658')}${P('M75-88q11 8 10 20l-20-2Z',C.cream)}${P('M-21-50v40m42-40v40','none',C.brown,18)}${R(-35,-15,28,16,'#4f6a79',7)}${R(7,-15,28,16,'#4f6a79',7)}${G(P('M-34-93l-17 33','none','#e59658',16),'character-arm character-arm-left')}${G(P('M35-93l17 33','none','#e59658',16),'character-arm character-arm-right')}${R(-40,-115,80,70,C.teal,22)}${P('M0-109v62')}${R(-27,-81,17,18,'#7cd3bd',4)}${R(10,-81,17,18,'#7cd3bd',4)}${P('M-47-160l-8-70 43 42m23 0 44-42-8 70','#e59658')}${P('M-41-180l-4-30 18 21m67 9 4-30-18 21','#f1b7a2')}${R(-52,-196,104,89,'#e59658',37)}${P('M-49-154q23-15 49 12 26-27 49-12-7 45-49 45t-49-45Z',C.cream,'none')}${face(-151)}${E(0,-135,6,4,C.ink)}`,'character-breathe')}
function leafling(){return shadow(47)+G(`${P('M-21-39v28m42-28v28','none',C.deep,18)}${R(-36,-16,30,17,C.orange,7)}${R(6,-16,30,17,C.orange,7)}${G(P('M-40-81l-19 22','none',C.green,16),'character-arm character-arm-left')}${G(P('M40-81l19 22','none',C.green,16),'character-arm character-arm-right')}${P('M-49-51q-15-88 6-112 32-33 44-1 21-38 48-1 18 32 0 114Z','#9ec96d')}${P('M-2-157q-53-6-48-46 43-10 51 31 9-44 46-40 9 36-43 55Z',C.leaf)}${face(-106,'#9ec96d')}${P('M-25-51q26 19 50 0v17h-50Z',C.teal)}${E(0,-40,5,5,C.yellow,C.ink,2)}`,'character-breathe')}
function plant(id){const hanging=id==='hanging';return `${hanging?P('M-34-72 0-155 34-72','none',C.cream,4):shadow(35)}${G(`${P('M0-15v-99m0 42q-50 5-43-42 41-2 43 42m0-14q43 5 40-40-41-1-40 40m-2 31q-44 9-46-25 35-14 46 25m3 4q39 8 48-27-30-17-48 27',C.leaf)}${P('M-23-106q10 3 17 15m21-14L4-90','none','#9ed58d',2)}${hanging?P('M-28-55q-43 22-19 62 22 20 4 38m71-99q43 22 19 62-22 20-4 38','none',C.leaf,10):''}`,'plant-sway')}${P('M-31-49h62l-6 43q-25 12-50 0Z',hanging?C.pink:C.orange)}${R(-35,-54,70,12,hanging?'#d29ab8':'#ed9b44',5)}${P('M-22-23h44','none','#ffe1a0',3)}${id==='flower'?G(`${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-132" rx="11" ry="18" fill="${C.coral}" stroke="${C.ink}" stroke-width="2" transform="rotate(${a} 0 -117)"/>`).join('')}${E(0,-117,10,10,C.yellow,C.ink,2)}`,'flower-nod'):''}`}
function art(id,variant='garden'){
const accent=variant==='atelier'?C.purple:variant==='orchard'?C.coral:C.teal;
switch(id){
case'dachs':return badger();
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
root.WorldArt=Object.freeze({C,R,E,P,G,art,cast,homes,decor,names,bounds,chars,defaults,shell,houseArt,layer,badger});
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
function eyes(xs,y,r=7){return xs.map(x=>E(x,y,r,r*1.2,C.white,C.ink,1.5)).join('')+G(xs.map(x=>E(x,y,3.4,4.7,C.ink)+E(x-1,y-2,1.1,1.5,C.white)).join(''),'character-pupils pet-pupils')}
function petArt(id){
 if(id==='cat')return A.art('cat').replace(/<g class="eyes"[^>]*>[\s\S]*?<\/g>/,eyes([-17,17],-48));
 if(id==='dog')return `${E(0,0,62,10,'#38434c20')}${G(`${P('M47-35q40-37 39-6','none',C.wood,13)}${E(7,-35,50,30,C.light,C.ink)}${R(-35,-32,19,33,C.light,8)}${R(29,-32,19,33,C.light,8)}${E(-24,-75,43,36,C.light,C.ink)}${G(`${E(-58,-77,16,38,C.brown,C.ink)}${E(7,-77,15,35,C.brown,C.ink)}`,'pet-ears')}${E(-25,-63,26,16,C.cream,C.ink,2)}${eyes([-37,-12],-82)}${E(-24,-66,8,5,C.ink)}${P('M-24-61v8m-10-2q10 11 20 0','none',C.ink,2)}${P('M-23-52q10 12 12-2',C.coral,C.ink,2)}${P('M-44-40l39 6','none',C.teal,7)}`,'pet-breathe')}`;
 if(id==='rabbit')return `${E(0,0,43,8,'#38434c20')}${G(`${E(0,-35,38,37,C.cream,C.ink)}${G(`${E(-17,-105,12,42,C.cream,C.ink)}${E(15,-104,12,41,C.cream,C.ink)}${E(-17,-110,5,28,C.pink)}${E(15,-110,5,27,C.pink)}`,'pet-ears')}${E(0,-62,35,29,C.cream,C.ink)}${eyes([-13,13],-68)}${P('M-4-54l4 4 4-4Z',C.coral)}${P('M0-50v7m-9-2q9 8 18 0','none',C.ink,2)}${E(-17,-7,17,9,C.cream,C.ink)}${E(17,-7,17,9,C.cream,C.ink)}${E(35,-25,13,13,C.white,C.ink)}${E(-23,-54,6,4,C.pink)}${E(23,-54,6,4,C.pink)}`,'pet-breathe')}`;
 if(id==='fishbowl')return `${E(0,2,90,9,'#38434c20')}${R(-88,-100,176,99,'#c7edf2',13)}${R(-82,-85,164,77,C.blue,8,'none')}${P('M-80-15q18-12 38 0t40 0 40 0 40 0v13H-80Z',C.light,'none')}${P('M-62-15q-18-40 0-55m4 54q23-31 2-43','none',C.leaf,5)}${G(`${E(20,-47,23,13,C.orange,C.ink,2)}${P('M0-47l-17-11v22Z',C.orange,C.ink,2)}${eyes([31],-50,5)}`,'fish-swim')}${G(`${E(52,-64,4,4,'none',C.white,2)}${E(43,-78,3,3,'none',C.white,2)}`,'bubbles')}${R(-93,-106,186,13,C.teal,5)}`;
 return '';
}
function empty(home='garden'){return [...A.defaults(home).filter(o=>environment.has(o.id)),{uid:'welcome-radio-'+home,id:'radio',x:1180,y:790,s:.8,layer:3.6,on:false}]}
const starter=['sofa','rug','table','stool','plant','counter','shelf','books','tea','cushion','blanket','watering'];
function starterObjects(home='garden'){return starter.map(id=>{const entries=A.defaults(home).filter(o=>o.id===id);const o=id==='plant'?entries.find(o=>o.x>1000):entries[0];return {...o,uid:'starter-'+home+'-'+id}})}
A.names.dachs='Dachs';A.bounds.dachs=[-80,-235,165,250];
window.LerndachsWorld={environment,pets,petArt,empty,starter,starterObjects,shopStock:['balloon','flower','picture'],welcomeStars:35,taskReward:15};
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
/* Lerndachs Option B: original flat vector shapes, rounded ink outlines, continuous arms. */
(()=>{'use strict';const C={ink:'#363c48',cream:'#fff3d7',white:'#fffdf4',mint:'#79c5ad',deep:'#4b978b',pink:'#eeb5ca',coral:'#f29880',yellow:'#f6cc72',purple:'#b4a4d3',sky:'#bde4e8',wood:'#dca577',skinM:'#c28a64',skinL:'#f4c59d',hairM:'#48443e',hairL:'#67546e'};
const p=(d,f='none',s=C.ink,w=3.2)=>`<path d="${d}" fill="${f}" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,e=(x,y,rx,ry,f,s='none',w=3.2)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" stroke="${s}" stroke-width="${w}"/>`,r=(x,y,w,h,f,rad=0,s=C.ink,sw=3.2)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${f}" stroke="${s}" stroke-width="${sw}"/>`,g=(s,t='',c='')=>`<g transform="${t}" class="${c}">${s}</g>`;
function flower(x,y,z=1){return g([0,60,120,180,240,300].map(a=>`<ellipse cx="0" cy="-12" rx="8" ry="12" fill="${C.cream}" stroke="${C.ink}" stroke-width="2.5" transform="rotate(${a})"/>`).join('')+e(0,0,9,9,C.yellow,C.ink,2.5),`translate(${x} ${y}) scale(${z})`)}
function person(id){const l=id==='lumi',skin=l?C.skinL:C.skinM,hair=l?C.hairL:C.hairM,shirt=l?C.coral:C.cream;
function arm(side){return `<g class="soft-arm ${side}" data-skin="${skin}" data-shirt="${shirt}"><path class="arm-outline" fill="none" stroke="${C.ink}" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/><path class="arm-fill" fill="none" stroke="${skin}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path class="sleeve-outline" fill="none" stroke="${C.ink}" stroke-width="27" stroke-linecap="round"/><path class="sleeve-fill" fill="none" stroke="${shirt}" stroke-width="20" stroke-linecap="round"/></g><g class="upper ${side}" visibility="hidden"><g class="fore"><g class="hand"/></g></g>`}
return `<g class="person ${id}" data-person="${id}">${e(0,5,48,9,'#363c4820').replace('<ellipse','<ellipse class="ground-shadow"')}<g class="body-rig">
${l?p('M-58-48v-143q-5-61 61-61 65 0 61 61v141q-17 9-31-2-18 12-33 0-16 12-31 0-12 11-27 4Z',hair):''}
${[-1,1].map((s,i)=>g(p(`M${s*21}-62v43`,'none',C.ink,25)+p(`M${s*21}-62v43`,'none',l?skin:C.deep,18)+(l?p(`M${s*21}-33v15`,'none',C.cream,18):p(`M${s*21-8}-27h16`,'none',C.mint,3))+r(i?8:-41,-18,33,21,l?C.purple:C.coral,8)+p(`M${i?11:-38} 0h27`,'none',C.cream,4)+p(`M${i?17:-32}-10h11`,'none',C.cream,2),'',`leg ${i?'right-leg':'left-leg'}`)).join('')}
${arm('left')}${arm('right')}
${p('M-38-143q38-13 76 0l8 74q-46 13-92 0Z',shirt)}${p('M-18-149q18 18 36 0',skin)}
${l?`${p('M-41-92h82l9 32q-50 14-100 0Z',C.purple)}${p('M-26-86l-4 24m30-24v27m26-27 4 24','none','#8e7fae',2.4)}${flower(17,-122,.53)}${p('M-29-106h18','none',C.cream,3)}`:`${p('M-31-143v33h62v-33','none',C.ink,13)}${p('M-31-143v33h62v-33','none',C.mint,7)}${r(-36,-112,72,49,C.mint,7)}${r(-17,-102,34,24,'#a1dac0',6,C.ink,2.5)}${p('M-12-97h24','none',C.white,2)}${e(-29,-114,4,4,C.yellow,C.ink,2)}${e(29,-114,4,4,C.yellow,C.ink,2)}`}
<g class="head-rig" transform="translate(0 -158)">${e(-58,-29,10,14,skin,C.ink)}${e(58,-29,10,14,skin,C.ink)}${p('M-60-49q-2-49 60-49t60 49v24Q58 14 0 19-58 14-60-25Z',skin)}
${l?`${p('M-61-31q-10-63 32-71 37-17 72 11 27 19 19 58-20-1-38-35-30 35-85 37Z',hair)}${p('M-45-57q33-7 52-25','none','#947b96',3)}${g(p('M-13-3q-25-23-27-2-2 19 27 7m9-5q25-23 28-2 2 19-28 7',C.coral)+e(-8,1,7,8,C.yellow,C.ink,2.5),'translate(39 -90) rotate(14)')}`:`${p('M-60-42q-14-15 0-29-8-23 17-27 5-25 29-18 20-20 39-2 25-5 32 18 24 7 16 29 12 22-12 31l-12-20-22 9-21-14-21 16-18-8Z',hair)}${p('M-39-88q8-10 20-3m27-10q10-4 18 3','none','#756b56',3)}`}
${e(-37,-8,11,6,l?'#ec9e8c':'#b9735e')}${e(37,-8,11,6,l?'#ec9e8c':'#b9735e')}
<g class="eye-set">${[-23,23].map(x=>e(x,-31,11,14,C.white,C.ink,2.6)+g(e(x,-30,5,8,C.ink)+e(x-1.5,-33,1.5,2.2,C.white),'','pupil')+p(`M${x-8}-50q8-4 16 0`,'none',C.ink,3)).join('')}</g>
${p('M-2-21q-3 7 4 7','none',l?'#c18e70':'#8e5c44',2)}${p('M-10 1q10 10 20 0','none',C.ink,2.6)}${[-35,-29,30,36].map((x,i)=>e(x,-14+i%2*4,1.2,1.2,l?'#b17965':'#875b48')).join('')}
</g></g><ellipse class="focus-ring" cx="0" cy="-116" rx="78" ry="151"/></g>`}
function room(){return `<defs><clipPath id="view-out">${r(117,83,358,324,C.sky,92,'none')}</clipPath><radialGradient id="glow"><stop stop-color="#ffe5a0" stop-opacity=".8"/><stop offset="1" stop-color="#ffe5a0" stop-opacity="0"/></radialGradient></defs>
${r(0,0,1200,760,C.cream,0,'none')}${r(0,414,1200,108,'#c4ddcb',0,'none')}${Array.from({length:19},(_,i)=>p(`M${i*70} 420v99`,'none','#98bbaa',2)).join('')}${r(0,409,1200,12,C.mint,0,C.ink,3)}${r(0,516,1200,244,'#e9bc91',0,'none')}${r(0,515,1200,12,C.deep,0,C.ink,3)}
${[566,621,686,750].map(y=>p(`M0 ${y}h1200`,'none','#c39370',2)).join('')}${Array.from({length:9},(_,i)=>p(`M${i*170-70} 527l${(i-4)*32} 233`,'none','#c39370',2)).join('')}${[83,310,902,1100].map((x,i)=>p(`M${x} ${586+i%2*81}q17-4 37 0m-25 6h15`,'none','#cd9c73',2)).join('')}
${r(107,73,378,344,C.wood,98)}${r(117,83,358,324,C.sky,90)}<g clip-path="url(#view-out)">${p('M105 332q95-103 201-16 76-62 189-22v122H105Z','#a4cc9a','none')}${p('M105 367q146-74 266-12 81-33 124-7v75H105Z','#79ad93','none')}${g(p('M0 70V-25','none',C.wood,10)+e(-26,-45,42,55,'#83b68c')+e(15,-69,44,59,'#9bc78d')+e(37,-32,38,43,'#83b68c'),'translate(164 327)')}${e(391,155,30,30,C.yellow)}${p('M379 155v3m23-3v3m-19 10q9 7 15-2','none',C.ink,2.5)}${p('M151 153l47-39m-46 62 30-25','none',C.white,5)}</g>
${p('M294 84v323m-175-162h353','none',C.ink,11)}${p('M294 84v323m-175-162h353','none',C.cream,5)}${r(97,401,397,17,C.cream,7)}
${p('M85 97q32 11 58 0l-16 287q-19-12-42 0Z',C.pink)}${p('M106 115l-9 247','none','#d58eae',3)}${p('M477 97q32 11 58 0v287q-20-12-42 0Z',C.pink)}${p('M507 115l13 247','none','#d58eae',3)}${p('M76 91h468','none',C.ink,5)}
${g(p('M-80 5v22m150-22v22','none',C.ink,7)+r(-110,-4,220,13,C.wood,4)+r(-91,-67,21,62,C.coral,3)+r(-66,-83,22,78,C.yellow,3)+r(-40,-60,19,55,C.purple,3)+p('M-86-54h10m15-16h12m-6 52h9','none',C.cream,2.5)+g(p('M0-39v-49m0 31q-34-11-28-34 28 1 28 34m0 1q35-9 28-31-26 1-28 31',C.mint)+p('M-24-40h48l-6 32h-36Z',C.coral),'translate(55 0)'), 'translate(696 260)')}
${g(r(-53,-66,106,112,C.purple,10)+r(-43,-56,86,92,C.cream,4)+p('M0 15v-39m0 30q-29-7-25-28 24-1 25 28m0-4q30-8 25-28-24-1-25 28',C.mint)+p('M-12 23h24','none',C.coral,4),'translate(1058 183) rotate(5)')}
${g(p('M0 0v72','none',C.ink,4)+p('M-51 126q1-51 51-51t51 51Z',C.yellow)+e(0,127,51,10,C.cream,C.ink)+e(0,134,10,5,C.yellow),'translate(846 0)')}
${e(605,645,432,88,'#b88c6b40')}${e(605,635,426,85,C.yellow,C.ink,3.5)}${e(605,635,398,70,'#ffe5a3','#dcac5a',3)}${p('M291 633q45-35 90 0t90 0 90 0 90 0 90 0 90 0','none',C.mint,8)}${p('M291 652q45-35 90 0t90 0 90 0 90 0 90 0 90 0','none',C.coral,6)}`}
function sofa(){return e(0,8,182,15,'#363c481b')+p('M-148-10v23m296-23v23','none',C.ink,12)+r(-174,-168,348,160,C.mint,34)+r(-154,-146,147,94,'#a7ddbd',24)+r(7,-146,147,94,'#a7ddbd',24)+r(-163,-64,326,48,C.mint,13)+p('M-148-53h296','none','#b9ead0',3)+r(-192,-109,39,104,C.deep,17)+r(153,-109,39,104,C.deep,17)+g(r(-43,-48,86,79,C.yellow,17)+flower(0,-9,.9),'translate(-89 -92) rotate(-9)')+g(r(-38,-46,76,76,C.pink,14)+p('M-25-24l45 38m-45-12 20 17m3-43 15 12','none',C.cream,4),'translate(105 -91) rotate(10)')}
function table(){return e(0,6,109,13,'#363c481b')+p('M-68-61l-12 66m136-66L70 5','none',C.ink,14)+p('M-68-61l-12 66m136-66L70 5','none','#ad7c57',8)+e(0,-65,117,37,'#c58f60',C.ink)+e(0,-74,117,31,'#edbd85',C.ink)+p('M-73-76q69-19 136-1','none','#ffdda7',4)+e(60,-70,13,3,'none','#c99566',2)}
function plant(){return e(0,6,49,8,'#363c481b')+g(p('M0-58v-118m0 63-37-32m37 11 36-33','none',C.ink,5)+[[-34,-130,-43],[31,-155,40],[-16,-177,-20],[37,-113,55]].map(([x,y,a])=>g(p('M0 24q-34-22-13-52 36-3 29 27Q15 15 0 24Z',C.mint)+p('M0 17 5-20','none',C.deep,2.5),'translate('+x+' '+y+') rotate('+a+')')).join(''),'','leaves')+p('M-41-64h82L31-5q-32 13-62 0Z',C.coral)+r(-46,-68,92,14,'#ffb095',5)+p('M-29-42q29 9 58 0','none',C.cream,4)+e(-11,-23,2.5,3,C.ink)+e(11,-23,2.5,3,C.ink)+p('M-4-15q4 4 8 0','none',C.ink,2)}
function radio(){return p('M-25-77v-16h50v16m19 4 21-43','none',C.ink,4)+r(-63,-77,126,77,C.coral,14)+r(-55,-69,110,60,'#ffb99b',9,C.ink,2)+e(-24,-39,24,24,C.cream,C.ink,3)+[-12,-5,2,9].map(y=>p(`M-40 ${-39+y}h32`,'none','#a77c63',2)).join('')+r(12,-59,34,14,C.cream,3,C.ink,2)+p('M18-52h21','none',C.deep,2)+e(23,-28,8,8,C.mint,C.ink,2.5)+e(44,-27,5,5,C.yellow,C.ink,2)+`<g class="music-notes" opacity="0">${p('M10-95v-23l17-4v20','none',C.ink,3)}${e(5,-95,6,4,C.ink)}${e(22,-102,6,4,C.ink)}</g>`}
function lamp(){return e(0,3,36,7,'#363c481b')+r(-7,-75,14,73,C.cream,5)+e(0,-2,32,8,C.cream,C.ink)+p('M-54-69q0-58 54-58t54 58Z',C.coral)+e(0,-69,54,10,C.cream,C.ink)+e(-24,-92,9,7,C.cream)+e(16,-108,11,8,C.cream)+e(33,-84,6,5,C.cream)+`<ellipse class="night-glow" cx="0" cy="-24" rx="105" ry="90" fill="url(#glow)" opacity="0"/>`}
function tea(){return e(0,0,32,6,C.cream,C.ink,2.5)+p('M20-33q27-3 19 13-3 6-18 4','none',C.ink,7)+p('M20-33q27-3 19 13-3 6-18 4','none',C.purple,3)+r(-23,-44,46,40,C.purple,9)+e(0,-43,21,5,'#9a715b',C.ink,2)+p('M-13-30v12','none','#e1d4ef',3)+`<g class="steam">${p('M-7-57q-8-9 0-19m15 20q-8-9 0-19','none',C.white,3)}</g>`}
function obj(id,s,x,y,z=1,label=id){return `<g class="interact" role="button" tabindex="0" data-object="${id}" aria-label="${label}" transform="translate(${x} ${y}) scale(${z})">${s}</g>`}
function scene(){return room()+g(sofa(),'translate(303 553)')+g(p('M-91-1v15m182-15v15','none',C.ink,9)+r(-106,-122,212,120,C.yellow,9)+r(-94,-108,88,93,'#ffdda0',5)+r(6,-108,88,93,'#ffdda0',5)+p('M-20-60h-7m47 0h7','none',C.ink,5)+r(-114,-132,228,15,C.cream,5),'translate(1000 512)')+obj('plant',plant(),1120,606,1.12,'Pflanze berühren')+obj('lamp',lamp(),1048,378,.88,'Pilzlampe einschalten')+obj('radio',radio(),937,378,.88,'Radio wechseln')+obj('milo',person('milo'),580,663,1.2,'Milo winken lassen')+obj('lumi',person('lumi'),801,679,1.2,'Lumi winken lassen')+obj('table',table(),350,684,1,'Tisch antippen')+obj('tea',tea(),324,607,.95,'Tasse antippen')+g(r(-25,-12,50,12,C.coral,3)+r(-22,-9,44,6,C.cream,1,'none')+r(-28,-23,52,11,C.mint,3),'translate(394 613) rotate(7)')+'<g id="particles" pointer-events="none"></g>'}
window.KunterbuntShapes={C,p,e,r,g,person,sofa,table,plant,radio,lamp,tea,flower};})();

;
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

;
/* Original Kunterbunt wardrobe: composable SVG assets, no external image requests. */
(()=>{'use strict';const K=KunterbuntShapes,{C,p,e,r,g}=K;
const colors={skin:[['#f4d5ba','Porzellan'],['#f4c59d','Pfirsich'],['#dba579','Honig'],['#c28a64','Karamell'],['#a86f4d','Kastanie'],['#875b43','Kakao'],['#684637','Mokka'],['#49352f','Espresso']],hair:[['#302e33','Schwarz'],['#48443e','Dunkelbraun'],['#8c5d42','Braun'],['#bf7c4b','Kupfer'],['#e7bf72','Blond'],['#e6e2d8','Silber'],['#67546e','Pflaume'],['#d58eae','Rosa'],['#4b978b','Türkis']],fabric:[['#dc635b','Rot'],['#fff3d7','Vanille'],['#79c5ad','Mint'],['#4b978b','Petrol'],['#f29880','Koralle'],['#f6cc72','Sonnengelb'],['#b4a4d3','Lavendel'],['#bde4e8','Himmelblau'],['#eeb5ca','Rosa'],['#48443e','Dunkelbraun']]};
const choices={hairStyle:[['curly','Locken'],['short','Kurz'],['bob','Bob'],['long','Lang'],['bun','Dutt']],outfit:[['overalls','Latzhose'],['shirt','Shirt & Hose'],['dress','Kleid'],['hoodie','Hoodie']],makeup:[['none','Ohne'],['blush','Wangenrot'],['freckles','Sommersprossen'],['stars','Sternchen'],['hearts','Herzchen']],headwear:[['none','Ohne'],['bow','Schleife'],['flower','Blume'],['cap','Kappe'],['headband','Haarband']],eyewear:[['none','Ohne'],['round','Runde Brille'],['square','Eckige Brille']]};
const bases={milo:{skin:'#c28a64',hair:'#e7bf72',hairStyle:'curly',outfit:'hoodie',top:'#dc635b',bottom:C.deep,shoes:C.cream},lumi:{skin:'#f4c59d',hair:'#67546e',hairStyle:'long',outfit:'dress',top:C.coral,bottom:C.purple,shoes:C.purple,headwear:'bow'},nia:{skin:'#c28a64',hair:'#302e33',hairStyle:'bun',outfit:'dress',top:C.purple,bottom:C.purple,shoes:C.mint,eyewear:'round'},jona:{skin:'#f4c59d',hair:'#bf7c4b',hairStyle:'short',outfit:'overalls',top:C.sky,bottom:C.mint,shoes:C.coral,headwear:'cap'},sami:{skin:'#875b43',hair:'#302e33',hairStyle:'curly',outfit:'overalls',top:C.yellow,bottom:C.mint,shoes:C.coral},ella:{skin:'#f4c59d',hair:'#bf7c4b',hairStyle:'bob',outfit:'dress',top:C.mint,bottom:C.purple,shoes:C.purple,headwear:'flower'},pippa:{skin:'#e5a06c'},mo:{skin:'#a4cc78'}};
function defaults(id){return {skin:C.skinM,hair:C.hairM,hairStyle:'curly',outfit:'overalls',top:C.cream,bottom:C.mint,shoes:C.coral,makeup:'none',headwear:'none',eyewear:'none',...bases[id]}}
function normalize(id,input){const d=defaults(id),a={...d};if(!input||typeof input!=='object')return a;for(const key of Object.keys(choices))if(choices[key].some(([v])=>v===input[key]))a[key]=input[key];for(const key of ['skin','hair','top','bottom','shoes'])if((colors[key]||colors.fabric).some(([v])=>v===input[key]))a[key]=input[key];return a}
const star=(x,y,z=.22)=>g(p('M0-20 6-6 21-5 10 5 13 20 0 12-13 20-10 5-21-5-6-6Z',C.yellow,C.ink,2),`translate(${x} ${y}) scale(${z})`);
function hairBack(a){return a.hairStyle==='long'?p('M-59-45v-148q-4-60 61-60t61 60v148q-17 11-32 0-15 11-31 0-17 11-31 0-15 9-28 0Z',a.hair):a.hairStyle==='bob'?p('M-63-155v-43q0-55 63-55t63 55v43q-23 17-43 3H-20q-21 14-43-3Z',a.hair):''}
function hairFront(a){if(a.hairStyle==='curly')return p('M-60-42q-14-15 0-29-8-23 17-27 5-25 29-18 20-20 39-2 25-5 32 18 24 7 16 29 12 22-12 31l-12-20-22 9-21-14-21 16-18-8Z',a.hair)+p('M-39-88q8-10 20-3m27-10q10-4 18 3','none','#fff3d740',3);
 if(a.hairStyle==='short')return p('M-60-40q-13-59 39-63l16-15 12 14q60-3 56 61L41-66q-25 9-41-8-22 21-44 12Z',a.hair)+p('M-26-83q22 6 43-3','none','#fff3d740',3);
 if(a.hairStyle==='bun')return e(0,-110,28,24,a.hair,C.ink)+p('M-62-40q-5-64 62-64t62 64q-39 1-62-35-21 35-62 35Z',a.hair)+p('M-13-116q16-12 28 2','none','#fff3d740',3);
 return p('M-61-31q-10-63 32-71 37-17 72 11 27 19 19 58-20-1-38-35-30 35-85 37Z',a.hair)+p('M-45-57q33-7 52-25','none','#fff3d740',3)}
function facePaint(a){if(a.makeup==='blush')return e(-38,-9,12,7,'#ed9c98')+e(38,-9,12,7,'#ed9c98');if(a.makeup==='freckles')return [-43,-34,-25,25,34,43].map((x,i)=>e(x,-13+i%2*5,1.8,1.8,'#93604b')).join('');if(a.makeup==='stars')return star(-40,-11)+star(40,-11);if(a.makeup==='hearts')return [-39,39].map(x=>g(p('M0 5C-19-6-9-16 0-7 9-16 19-6 0 5Z',C.coral,'none'),`translate(${x} -8) scale(.55)`)).join('');return ''}
function glasses(a){if(a.eyewear==='none')return '';return p('M-9-31h18m-45-3-20-5m92 5 20-5','none',C.ink,3)+ (a.eyewear==='round'?e(-24,-31,18,19,'#bde4e82a',C.ink,3)+e(24,-31,18,19,'#bde4e82a',C.ink,3):r(-43,-47,36,31,'#bde4e82a',8,C.ink,3)+r(7,-47,36,31,'#bde4e82a',8,C.ink,3))}
function headwear(a){if(a.headwear==='bow')return g(p('M-4 0q-29-29-32-5-2 21 30 12m8-7q29-29 32-5 2 21-30 12',C.coral)+e(0,2,8,9,C.yellow,C.ink,2.5),'translate(39 -95) rotate(14)');if(a.headwear==='flower')return K.flower(-40,-91,.65);if(a.headwear==='cap')return p('M-55-84q5-46 55-44 46 2 51 44Z',a.bottom)+p('M-57-81h121','none',C.ink,6)+r(-10,-115,23,17,C.yellow,5,C.ink,2)+star(1,-106,.2);if(a.headwear==='headband')return p('M-57-57q-5-55 57-55t57 55','none',C.ink,12)+p('M-57-57q-5-55 57-55t57 55','none',a.bottom,6)+g(p('M0-6q-16-17-20-2 1 12 18 7m4-5q16-17 20-2-1 12-18 7',a.bottom)+e(0,0,5,5,C.yellow,C.ink,2),'translate(32 -103) rotate(14)');return ''}
function arm(a,side){const sign=side==='left'?-1:1;return `<g class="soft-arm ${side} character-arm character-arm-${side}" data-skin="${a.skin}" data-shirt="${a.top}">${p(`M${sign*44}-132Q${sign*51}-105 ${sign*54}-76`,'none',C.ink,21).replace('<path','<path class="arm-outline"')}${p(`M${sign*44}-132Q${sign*51}-105 ${sign*54}-76`,'none',a.skin,14).replace('<path','<path class="arm-fill"')}${p(`M${sign*44}-132l${sign*2} 9`,'none',C.ink,27).replace('<path','<path class="sleeve-outline"')}${p(`M${sign*44}-132l${sign*2} 9`,'none',a.top,20).replace('<path','<path class="sleeve-fill"')}</g>`}
function outfit(a){let s=p('M-38-143q38-13 76 0l8 74q-46 13-92 0Z',a.top)+p('M-18-149q18 18 36 0',a.skin);if(a.outfit==='overalls')s+=p('M-31-143v33h62v-33','none',C.ink,13)+p('M-31-143v33h62v-33','none',a.bottom,7)+r(-36,-112,72,49,a.bottom,7)+r(-17,-102,34,24,a.top,6,C.ink,2.5)+e(-29,-114,4,4,C.yellow,C.ink,2)+e(29,-114,4,4,C.yellow,C.ink,2);
 if(a.outfit==='dress')s+=p('M-41-92h82l9 32q-50 14-100 0Z',a.bottom)+p('M-26-86l-4 24m30-24v27m26-27 4 24','none',C.ink+'70',2.4)+K.flower(17,-122,.53);
 if(a.outfit==='shirt')s+=p('M-43-76h86','none',C.ink,3)+star(0,-113,.65);
 if(a.outfit==='hoodie')s+=p('M-29-143q29 31 58 0','none',C.ink,3)+p('M-15-135v24m30-24v24','none',C.cream,2.5)+p('M-21-96h42l5 18h-52Z',a.top,C.ink,2)+p('M-43-70h86','none',C.ink,3);return s}
function animalHead(id){const s=KunterbuntArt.character(id),start=s.indexOf('<g class="head-rig');if(start<0)return '';const re=/<\/?g\b[^>]*>/g;re.lastIndex=start;let m,n=0;while((m=re.exec(s))){n+=m[0].startsWith('</')?-1:1;if(!n)return s.slice(start,m.index+m[0].length)}return ''}
function art(id,input){if(!input)return '';const a=normalize(id,input),animal=['pippa','mo'].includes(id);const legs=[-1,1].map((sign,i)=>g(p(`M${sign*21}-62v43`,'none',C.ink,25)+p(`M${sign*21}-62v43`,'none',a.outfit==='dress'?a.skin:a.bottom,18)+r(i?8:-41,-18,33,21,a.shoes,8)+p(`M${i?11:-38} 0h27`,'none',C.cream,4)+p(`M${i?17:-32}-10h11`,'none',C.cream,2),'',`leg ${i?'right-leg':'left-leg'}`)).join('');
 const head=animal?animalHead(id).replace(/<\/g>$/,facePaint(a)+glasses(a)+headwear(a)+'</g>'):g(e(-58,-29,10,14,a.skin,C.ink)+e(58,-29,10,14,a.skin,C.ink)+p('M-60-49q-2-49 60-49t60 49v24Q58 14 0 19-58 14-60-25Z',a.skin)+hairFront(a)+e(-38,-8,10,5,'#ed9c9860')+e(38,-8,10,5,'#ed9c9860')+[-23,23].map(x=>e(x,-31,11,14,C.white,C.ink,2.6)+g(e(x,-30,5,8,C.ink)+e(x-1.5,-33,1.5,2.2,C.white),'','pupil character-pupils')+p(`M${x-8}-50q8-4 16 0`,'none',C.ink,3)).join('')+p('M-2-21q-3 7 4 7','none','#93604b',2)+p('M-10 1q10 10 20 0','none',C.ink,2.6)+facePaint(a)+glasses(a)+headwear(a),'translate(0 -158)','head-rig character-head');
 return g(g(e(0,5,48,9,'#363c4820').replace('<ellipse','<ellipse class="ground-shadow"')+g((animal?'':hairBack(a))+legs+arm(a,'left')+arm(a,'right')+outfit(a)+head,'','body-rig character-breathe'),'','k-character character-action'),'scale(.86)','k-cast avatar-art')}
window.LerndachsAvatar={art,normalize,defaults,colors,choices,human:id=>!['pippa','mo'].includes(id)};
})();

;
/* Original Kunterbunt companions. Load after kunterbunt-shapes.js.
 * Artwork only: callers own catalogue routing, bounds and animation policy.
 */
(()=>{
'use strict';
const {C,p,e,r,g}=window.KunterbuntShapes;
const peach='#ffc4a5',lilac='#d5c8e6',paleMint='#bce2cf';
const shadow=w=>e(0,3,w,6,'#363c4819');
const group=(content,cls)=>g(content,'',cls);

// The complete pupil pair shares one group so gaze cannot drift between eyes.
function eyes(points,rx=9,ry=11){
 return points.map(([x,y])=>e(x,y,rx,ry,C.white,C.ink,2.5)).join('')+
  group(points.map(([x,y])=>e(x+.5,y+1,rx*.44,ry*.59,C.ink)+e(x-1,y-1.7,1.35,1.8,C.white)).join(''),'character-pupils pet-pupils');
}
function paw(x,y,fill,w=14){
 return group(e(x,y,w,8,fill,C.ink,2.8)+p(`M${x-3} ${y+2}v3m6-3v3`,'none',C.ink,1.7),'pet-leg');
}
function cat(){
 const tail=group(p('M30-18C72-12 88-43 72-60 62-71 50-61 54-52','none',C.ink,16)+p('M30-18C72-12 88-43 72-60 62-71 50-61 54-52','none',C.coral,10)+p('M71-57q-5-7-11-3','none',C.cream,8),'pet-tail');
 const body=p('M-28-48C-43-29-40-7-23-5H26C44-9 40-35 28-48Z',C.coral)+e(0,-25,20,21,C.cream)+p('M-14-29v18m28-18v18','none',C.ink,2.5);
 const ears=group(p('M-37-78-42-111Q-42-117-36-114L-14-96M15-96 37-116Q43-118 42-111L38-78',C.coral)+p('M-34-103-31-86-22-96M24-96 34-104 33-87',C.pink,'none'),'pet-ears');
 const head=p('M-37-92C-23-105 24-105 38-90 47-78 45-53 32-44 19-34-21-34-35-45-48-56-48-79-37-92Z',C.coral)+p('M-40-61Q-22-73 0-57 23-73 40-61 37-39 0-38-36-38-40-61Z',C.cream,'none')+p('M-9-101l3 11m11-11-1 11','none','#ca796d',3.5)+eyes([[-19,-72],[19,-72]])+e(-31,-53,6,3.5,C.pink)+e(31,-53,6,3.5,C.pink)+p('M-5-57Q0-61 5-57L0-52Z',C.ink,C.ink,2)+p('M0-52v5m0 0q-6 6-11 0m11 0q6 6 11 0','none',C.ink,2.2)+p('M-33-57l-17-4m18 10-18 2m83-6 17-4m-18 10 18 2','none',C.ink,2);
 return shadow(45)+group(tail+body+ears+head+paw(-18,-7,C.cream)+paw(18,-7,C.cream),'cat-breathe');
}
function dog(){
 const tail=group(p('M40-35Q67-43 70-69','none',C.ink,16)+p('M40-35Q67-43 70-69','none',C.coral,10)+p('M69-62l1-6','none',C.cream,10),'pet-tail');
 const body=p('M-25-48Q-12-61 21-55 47-50 48-24L40-7H-28Q-44-26-25-48Z',C.cream)+p('M23-53Q47-48 47-29 32-23 23-35Z',C.coral,'none')+group(r(-31,-27,20,25,C.cream,8)+p('M-25-6h8','none',C.ink,1.8),'pet-leg')+group(r(25,-28,21,26,C.cream,8)+p('M31-6h8','none',C.ink,1.8),'pet-leg');
 const ears=group(p('M-46-103Q-64-110-68-88L-68-62Q-67-48-54-53-40-60-37-88Z',C.coral)+p('M19-104Q39-112 45-87L47-65Q48-50 35-52 20-57 13-87Z',C.coral)+p('M-59-89q-4 11-2 20m96-20 4 18','none',peach,3),'pet-ears');
 const head=p('M-45-103Q-29-120-7-117 15-119 27-100L31-71Q28-48-8-46-46-46-50-69Z',C.cream)+p('M9-116Q27-111 29-89L25-75Q8-68 0-82-9-97 9-116Z',peach,'none')+eyes([[-28,-89],[10,-89]],9,11)+e(-9,-64,26,14,C.white)+e(-39,-68,6,3.5,C.pink)+e(22,-68,6,3.5,C.pink)+p('M-17-71Q-9-77-1-71-2-64-9-63-16-64-17-71Z',C.ink,C.ink,2)+p('M-9-63v7m-13-2q13 14 26 0','none',C.ink,2.5)+p('M-10-50v5q2 10 9 6 4-3 3-11',C.coral,C.ink,2)+p('M-4-47v5','none','#ca796d',1.5);
 const collar=group(p('M-33-46Q-9-38 16-46L14-38Q-9-30-31-39Z',C.mint,C.ink,2.5)+e(-8,-31,4.5,5,C.yellow,C.ink,1.8),'pet-collar');
 return shadow(56)+group(tail+body+collar+ears+group(head,'pet-head'),'pet-breathe');
}
function rabbit(){
 const tail=group(p('M33-29Q40-38 48-32 56-31 54-22 57-14 48-11 40-6 34-15Z',C.white,C.ink,2.8),'pet-tail');
 const body=p('M-26-49Q-41-31-31-12-22 0 3-2 35 0 35-25 34-43 21-51Z',lilac)+e(0,-25,19,21,C.cream)+p('M-14-31l3 17m23-17-2 17','none',C.ink,2.3);
 const ears=group(p('M-26-91Q-45-116-38-148-35-163-26-160-9-157-10-102Z',lilac)+p('M11-102Q9-144 30-155 45-163 48-147 50-136 39-126L27-91Z',lilac)+p('M-27-109Q-36-137-29-147-22-145-23-116Z',C.pink,'none')+p('M21-112Q23-137 35-144 39-145 37-139L29-112Z',C.pink,'none')+p('M39-127q-4-5-10-4','none',C.ink,2.2),'pet-ears');
 const head=p('M-29-101Q-15-110 5-107 31-108 39-85 49-57 20-47 1-40-24-48-49-56-42-79-39-92-29-101Z',lilac)+p('M-38-64Q-19-76 0-62 23-76 38-63 31-44 0-45-27-45-38-64Z',C.cream,'none')+eyes([[-18,-78],[19,-78]],9,11)+e(-31,-61,6,3.5,C.pink)+e(31,-61,6,3.5,C.pink)+p('M-4-62q4-3 8 0l-4 5Z',C.coral,C.ink,1.8)+p('M0-57v5m-10 0q10 10 20 0','none',C.ink,2.1)+r(-4,-49,8,8,C.white,2,C.ink,1.8)+p('M0-48v5','none',C.ink,1.4)+p('M-31-61l-15-2m16 8-14 3m75-9 15-2m-16 8 14 3','none',C.ink,1.8);
 const bow=p('M-4-39q-19-15-20-2-1 13 20 5m5-3q18-15 20-2 1 13-20 5',C.mint,C.ink,2.2)+e(-1,-38,5,5,paleMint,C.ink,2);
 return shadow(42)+group(tail+body+ears+head+bow+paw(-19,-7,C.cream,17)+paw(19,-7,C.cream,17),'pet-breathe');
}
function fishbowl(){
 const glass=p('M-76-104H76L83-38Q85-12 64-8H-64Q-85-12-83-38Z',C.sky)+p('M-78-77Q-41-85-1-77 38-69 78-77L81-36Q82-15 62-12H-62Q-82-15-81-36Z','#91d4d4','none');
 const sand=p('M-80-27Q-57-32-29-24-3-16 24-25 52-33 80-27 78-12 62-12H-62Q-78-12-80-27Z',C.cream,'none')+e(-43,-19,6,2.5,C.coral)+e(34,-19,4,2,C.purple)+e(48,-22,5,2,C.yellow);
 const plant=p('M-59-26v-33m0 16q-18-4-14-16 14-2 14 16m0 5q17-5 15-17-14 1-15 17',C.mint,C.ink,2.2)+p('M61-24v-18m0 8q-11-1-10-11 10-1 10 11m0-5q12-2 10-13-12 2-10 13',paleMint,C.ink,2.2);
 const fish=group(group(p('M-14-53Q-28-70-34-65L-31-51-34-38Q-27-33-14-49Z',C.coral,C.ink,2.5)+p('M-29-58l9 6-10 7','none',peach,2),'pet-tail')+p('M-1-67Q5-81 14-73L21-65M0-40Q8-29 17-40',C.yellow,C.ink,2.2)+p('M-20-52Q-13-72 8-70 32-70 38-52 33-35 10-34-13-33-20-52Z',C.coral,C.ink,2.7)+p('M-5-67q-9 15 1 29','none',peach,5)+p('M7-49q-12-8-12 1 2 9 12 3',C.yellow,C.ink,2)+eyes([[22,-54]],7,8.5)+e(30,-43,4,2.4,C.pink)+p('M34-47q4 2 5-1','none',C.ink,1.8),'fish-swim');
 const bubbles=group(e(48,-69,4,4,'none',C.white,2.2)+e(40,-85,3,3,'none',C.white,2)+e(55,-94,2,2,C.white),'bubbles');
 const rim=r(-88,-110,176,13,C.mint,6)+p('M-72-104H70','none',paleMint,3)+r(-73,-10,146,10,C.mint,5)+p('M-72-86l-2 22m0 9v5','none',C.white,3.5)+p('M72-41q2 15-8 18','none',C.white,3);
 return shadow(77)+group(glass+sand+plant+fish+bubbles+rim,'pet-breathe aquarium');
}
const renderers={cat,dog,rabbit,fishbowl};
const bounds={cat:[-58,-122,146,137],dog:[-76,-126,157,141],rabbit:[-56,-167,116,182],fishbowl:[-96,-118,192,133]};
function art(id){return Object.prototype.hasOwnProperty.call(renderers,id)?group(renderers[id](),'k-art pets-art pet-'+id):''}
window.LerndachsPetsArt={art,ids:Object.keys(renderers),bounds};
})();

// The same new pets appear in the world, catalogue and all previews.
(()=>{const pets=LerndachsPetsArt,previous=WorldArt,prior=KunterbuntArt.art;Object.assign(previous.bounds,pets.bounds);KunterbuntArt.art=id=>pets.art(id)||prior(id);LerndachsWorld.petArt=id=>pets.art(id);window.WorldArt=Object.freeze({...previous,art:(id,...args)=>pets.art(id)||previous.art(id,...args)});})();

;
/* Original small Kunterbunt hamster. Load after kunterbunt-shapes.js.
 * Artwork only; catalogue, routing and animation policy belong to the caller.
 */
(()=>{
'use strict';
const {C,p,e,g}=window.KunterbuntShapes;
const group=(content,cls)=>g(content,'',cls);

function hamster(){
 const ears=group(
  e(-27,-75,11,12,C.yellow,C.ink,3)+e(27,-75,11,12,C.yellow,C.ink,3)+
  e(-27,-75,5.5,6.5,C.pink)+e(27,-75,5.5,6.5,C.pink),
  'pet-ears');
 // A single plump outline keeps the tiny companion legible at room scale.
 const body=p('M-30-68Q-21-79 0-79 21-79 30-68 35-60 36-52 47-41 42-25 39-10 23-5 0 2-23-5-39-10-42-25-47-41-36-52-35-60-30-68Z',C.yellow)+
  p('M-37-44Q-28-52-16-44-6-38 0-39 6-38 16-44 28-52 37-44 44-32 32-20 27-6 0-5-27-6-32-20-44-32-37-44Z',C.cream,'none')+
  p('M-6-74q3 5 2 9m8-9q2 3 1 6','none','#dca85e',2.5);
 const eyeWhites=e(-16,-53,8,9.5,C.white,C.ink,2.3)+e(16,-53,8,9.5,C.white,C.ink,2.3);
 const pupils=group(
  [-16,16].map(x=>e(x+.5,-52,3.9,5.6,C.ink)+e(x-1,-54,1.3,1.6,C.white)).join(''),
  'character-pupils pet-pupils');
 const face=eyeWhites+pupils+
  e(-29,-38,6.5,4,C.pink)+e(29,-38,6.5,4,C.pink)+
  p('M-4-40Q0-43 4-40L0-36Z',C.coral,C.ink,1.8)+
  p('M0-36v4m-8-1q4 5 8 1 4 4 8-1','none',C.ink,1.9)+
  p('M-3-30h6v5q-3 2-6 0Z',C.white,C.ink,1.6)+
  p('M-34-40l-10-3m10 9-11 1m79-7 10-3m-10 9 11 1','none',C.ink,1.7);
 const seed=group(
  p('M0-28Q11-21 8-12 5-5 0-4-5-5-8-12-11-21 0-28Z',C.wood,C.ink,2.2)+
  p('M0-24Q-3-14 0-8','none',C.cream,2.2),
  'hamster-seed');
 const hands=group(
  e(-10,-17,7,5,C.cream,C.ink,2.2)+e(10,-17,7,5,C.cream,C.ink,2.2)+
  p('M-10-17l3 1m17-1-3 1','none',C.ink,1.4),
  'hamster-paws');
 const feet=[-19,19].map(x=>group(
  e(x,-4,10,5.5,C.cream,C.ink,2.5)+
  p(`M${x-2}-3v2m4-2v2`,'none',C.ink,1.5),
  'pet-leg')).join('');
 return e(0,4,37,5,'#363c4819')+
  group(ears+body+face+seed+hands+feet,'pet-breathe');
}
function art(id){return id==='hamster'?group(hamster(),'k-art pets-art pet-hamster'):''}
window.LerndachsHamsterArt={art,bounds:{hamster:[-49,-91,98,102]}};
})();

;
/* Original Kunterbunt terrace and garden. No IDs, external assets or setup required. */
(() => {
  'use strict';
  const C = {ink:'#363c48',cream:'#fff3d7',white:'#fffdf4',mint:'#79c5ad',deep:'#4b978b',pink:'#eeb5ca',coral:'#f29880',yellow:'#f6cc72',purple:'#b4a4d3',sky:'#bde4e8',wood:'#dca577'};
  const p = (d,f='none',s=C.ink,w=3.2) => `<path d="${d}" fill="${f}" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const e = (x,y,rx,ry,f,s='none',w=3.2) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" stroke="${s}" stroke-width="${w}"/>`;
  const r = (x,y,w,h,f,rad=0,s=C.ink,sw=3.2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${f}" stroke="${s}" stroke-width="${sw}"/>`;
  const g = (s,t='') => `<g transform="${t}">${s}</g>`;
  const leaf = (x,y,a=0,s=1,col=C.mint) => g(p('M0 0Q-24-5-20-29Q8-29 0 0Z',col)+p('M0 0-12-20','none',C.deep,2),`translate(${x} ${y}) rotate(${a}) scale(${s})`);
  function bloom(x,y,s=1,color=C.cream) {
    return g(p('M0 0v34','none',C.deep,3)+leaf(0,25,-75,.45)+[0,72,144,216,288].map(a=>g(e(0,-10,8,12,color,C.ink,2.3),`rotate(${a})`)).join('')+e(0,0,7,7,C.yellow,C.ink,2.3),`translate(${x} ${y}) scale(${s})`);
  }
  function tree(x,y,s=1,fruit=false) {
    return g(e(0,5,103,16,'#363c4812')+p('M-15-7-12-162h30L20-7Z','#be8e69')+p('M2-80-35-128m38 15 34-37','none',C.ink,6)+p('M-75-107Q-128-113-118-170Q-151-216-109-253Q-106-308-49-309Q-9-352 35-312Q96-332 112-278Q163-247 130-203Q150-147 97-133Q80-79 32-102Q-21-72-75-107Z',C.mint)+p('M-104-220Q-87-253-61-248m78-58q33-6 48 17m28 139q18-7 18-27','none','#b8dfb0',5)+leaf(-58,-151,-20,.8,'#a4d6aa')+leaf(55,-245,72,.8,'#a4d6aa')+(fruit?[[-67,-224],[-18,-278],[64,-210],[23,-150]].map(([a,b])=>e(a,b,12,13,C.coral,C.ink,2.6)+p(`M${a} ${b-12}l3-7`,'none',C.ink,2)).join(''):''),`translate(${x} ${y}) scale(${s})`);
  }
  function pot(x,y,s=1,color=C.coral) {
    return g(e(0,3,39,7,'#363c4815')+p('M0-54v-72','none',C.deep,4)+leaf(0,-68,-70,.9)+leaf(0,-92,65,1.1)+leaf(0,-113,-20,.9)+p('M-35-51h70L26-4Q0 6-26-4Z',color)+r(-39,-58,78,14,color,5)+p('M-24-31q24 7 48 0','none',C.cream,4),`translate(${x} ${y}) scale(${s})`);
  }
  function raisedBed() {
    return g(e(0,12,168,18,'#363c4817')+r(-157,-54,314,81,C.wood,10)+p('M-157-22h314m-296 16h277','none','#b98360',2.5)+p('M-137 26v-83m274 83v-83','none',C.ink,5)+e(0,-55,157,35,'#e8b58b',C.ink)+e(0,-57,141,25,'#8a6754',C.ink,2.5)+[-99,-33,33,99].map((x,i)=>g(p('M0 0v-45','none',C.deep,3)+leaf(0,-12,-70,.8)+leaf(0,-27,65,.85)+(i%2?bloom(0,-48,.65,C.pink):leaf(0,-43,-10,.7,'#b1d99e')),`translate(${x} -61)`)).join('')+p('M-121 5h18m100 0h18m100 0h18','none','#f4d0a4',3),'translate(0 0)');
  }
  const artFns = {
    'yard-bench': () => e(0,8,164,17,'#363c4818')+p('M-128-20v36m256-36v36','none',C.ink,9)+r(-147,-142,294,125,C.cream,21)+r(-134,-128,268,67,'#a8d7bd',13)+[-104,-68,-32,4,40,76,112].map(x=>p(`M${x}-119v49`,'none','#7fb8a0',3)).join('')+r(-141,-66,282,47,C.mint,12)+r(-157,-100,23,90,C.wood,9)+r(134,-100,23,90,C.wood,9)+g(r(-33,-35,66,65,C.coral,13)+p('M-18-19l36 36m-36-15 15 15m6-36 15 15','none',C.cream,3),'translate(-86 -85) rotate(-10)')+g(r(-30,-32,60,61,C.yellow,13)+e(0,-2,13,13,C.cream,C.ink,2.5),'translate(88 -86) rotate(9)'),
    'yard-table': () => e(0,11,78,12,'#363c4815')+p('M-46-56-57 8m103-64L57 8','none',C.ink,10)+p('M-46-56-57 8m103-64L57 8','none',C.wood,5)+e(0,-61,89,27,C.wood,C.ink)+e(0,-68,89,24,C.cream,C.ink)+p('M-49-71q43-11 96 0','none','#d9b98e',3),
    'yard-lemonade': () => e(0,2,26,7,C.coral,C.ink,2.5)+r(-18,-49,36,46,C.cream,5,C.ink,2.5)+p('M-13-24h26','none',C.yellow,16)+p('M5-34v-29l13-6','none',C.deep,3)+e(-14,-40,10,10,C.yellow,C.ink,2.3)+p('M-20-40h12m-6-6v12','none',C.cream,2),
    'yard-pot': () => pot(0,0),
    'yard-pot-pink': () => pot(0,0,1,C.pink),
    'yard-tree': () => tree(0,0,1,true),
    'yard-tree-mint': () => tree(0,0,1,false),
    'yard-birdhouse': () => e(0,6,53,9,'#363c4814')+p('M0 0v-138','none',C.ink,10)+p('M0 0v-138','none',C.wood,5)+r(-38,-209,76,77,C.cream,5)+p('M-49-207 0-252 49-207Z',C.coral)+e(0,-180,14,15,C.ink)+p('M-18-151h36','none',C.ink,4)+p('M-26-135h52','none',C.wood,6)+p('M-26-233 0-257 26-233','none',C.cream,3),
    'yard-bed': raisedBed,
    'yard-watering': () => e(0,8,41,7,'#363c4814')+p('M20-43q40-17 35 12-2 11-24 12','none',C.ink,8)+p('M20-43q40-17 35 12-2 11-24 12','none',C.mint,3)+p('M-27-34-56-53-61-44-29-11Z',C.mint)+r(-30,-49,63,52,C.mint,12)+e(0,-49,30,8,'#a3d9bd',C.ink,2.5)+p('M-57-55-65-40','none',C.ink,5)+p('M-19-24q19 8 38 0','none',C.cream,3),
    'yard-flowers': () => bloom(-30,-39,.7,C.cream)+bloom(0,-55,.85,C.pink)+bloom(33,-28,.65,C.coral),
    'yard-butterfly': () => p('M-3 0Q-30-24-21-35Q-4-42 0-12Q5-44 23-34Q33-19 3 0Q29-7 24 9Q12 24 1 4Q-11 24-24 10Q-31-6-3 0Z',C.yellow,C.ink,2.3)+p('M0-7v17m-2-19-6-7m10 7 6-7','none',C.ink,2),
    'yard-sun': () => [0,45,90,135,180,225,270,315].map(a=>g(p('M0-61v-12','none',C.yellow,5),`rotate(${a})`)).join('')+e(0,0,47,47,C.yellow,C.ink)+p('M-16-7v4m32-4v4m-25 15q9 9 18 0','none',C.ink,3)+e(-28,9,7,4,C.coral)+e(28,9,7,4,C.coral),
    'yard-lights': () => p('M-273-53q268 105 546 0','none',C.ink,2.5)+[-252,-173,-93,-13,67,147,227].map((x,i)=>g(p('M-8 0v15q8 11 16 0V0Z',i%3===0?C.coral:i%3===1?C.cream:C.yellow,C.ink,2.3),`translate(${x} ${-41+Math.sin((x+273)/546*Math.PI)*42})`)).join(''),
    'yard-cushion': () => e(0,4,69,13,'#363c4815')+p('M-65-17Q-65-55 0-50T65-17Q61 5 0 6T-65-17Z',C.purple)+p('M-48-18q48 20 96 0','none','#dfd2ed',3)+e(0,-24,5,3,C.cream,C.ink,2),
    'yard-hat': () => e(0,0,43,14,C.yellow,C.ink,2.8)+p('M-25-3v-18q25-28 50 0v18Z',C.yellow)+p('M-25-6q25 10 50 0','none',C.coral,6),
    'yard-mushroom': () => e(0,3,27,5,'#363c4813')+p('M-20 0v-16q0-24 17-24t17 24V0Z',C.cream)+p('M-31-22q4-26 28-26t28 26Z',C.coral)+e(-11,-32,4,3,C.cream)+e(5,-38,4,3,C.cream)+e(13,-28,3,3,C.cream)
  };
  const bounds = {
    'yard-bench':[-166,-145,332,172], 'yard-table':[-92,-95,184,120], 'yard-lemonade':[-29,-72,58,83],
    'yard-pot':[-42,-145,84,158], 'yard-pot-pink':[-42,-145,84,158],
    'yard-tree':[-140,-336,283,360], 'yard-tree-mint':[-140,-336,283,360],
    'yard-birdhouse':[-56,-260,112,278], 'yard-bed':[-171,-160,342,191],
    'yard-watering':[-69,-60,132,78], 'yard-flowers':[-49,-76,98,81], 'yard-butterfly':[-28,-39,57,62],
    'yard-sun':[-77,-77,154,154], 'yard-lights':[-276,-57,552,87],
    'yard-cushion':[-72,-55,144,75], 'yard-hat':[-46,-44,92,61], 'yard-mushroom':[-34,-51,68,62]
  };
  const names = {
    'yard-bench':'Terrassenbank','yard-table':'Gartentisch','yard-lemonade':'Zitronenlimonade',
    'yard-pot':'Terrassenpflanze','yard-pot-pink':'Rosafarbener Blumentopf','yard-tree':'Apfelbaum','yard-tree-mint':'Gartenbaum',
    'yard-birdhouse':'Vogelhäuschen','yard-bed':'Kräuterbeet','yard-watering':'Gießkanne','yard-flowers':'Bunte Gartenblumen',
    'yard-butterfly':'Schmetterling','yard-sun':'Gartensonne','yard-lights':'Lichterkette','yard-cushion':'Gartenkissen','yard-hat':'Sonnenhut','yard-mushroom':'Kleiner Gartenpilz'
  };
  const behaviours = {
    'yard-bench':'sit','yard-table':'tap','yard-lemonade':'drink','yard-pot':'grow','yard-pot-pink':'grow',
    'yard-tree':'sway','yard-tree-mint':'sway','yard-birdhouse':'chirp','yard-bed':'grow','yard-watering':'water',
    'yard-flowers':'grow','yard-butterfly':'flutter','yard-sun':'shine','yard-lights':'chime','yard-cushion':'bounce','yard-hat':'wear','yard-mushroom':'bounce'
  };
  function objects() {
    const placements = [
      ['sun','yard-sun',1514,122,1,0],['lights','yard-lights',405,288,1,0.5],
      ['apple','yard-tree',1080,574,1.13,1],['tree','yard-tree-mint',1830,579,1.14,1],
      ['birdhouse','yard-birdhouse',1670,601,1,1.5],['bench','yard-bench',405,589,1,2],
      ['pot','yard-pot',103,592,1.05,2],['hat','yard-hat',625,578,1,2.1],
      ['table','yard-table',575,722,1,3],['lemonade','yard-lemonade',575,654,1,3.1],
      ['cushion','yard-cushion',245,813,1,3],['pot-pink','yard-pot-pink',760,806,1.15,3],
      ['bed','yard-bed',1500,759,1,3],['watering','yard-watering',1730,808,1,3.2],
      ['flowers-a','yard-flowers',970,871,1,3],['flowers-b','yard-flowers',1200,849,1,3],
      ['flowers-c','yard-flowers',1830,743,1,3],['flowers-d','yard-flowers',1880,880,1,3],
      ['mushroom','yard-mushroom',1913,576,1,2],
      ['butterfly-a','yard-butterfly',1270,423,1,4],['butterfly-b','yard-butterfly',1580,480,.7,4]
    ];
    return placements.map(([uid,id,x,y,s,layer])=>({uid:'yard-'+uid,id,x,y,s,layer}));
  }
  function background() {
    return '<g class="garden-background" aria-hidden="true">'+r(0,0,2000,900,C.sky,0,'none')+
      p('M175 133q-3-21 20-23 5-26 31-16 18-12 32 8 27-3 31 20 0 12-20 12Z',C.white,'none')+
      p('M1221 191q-4-20 20-22 6-27 32-18 20-14 35 9 28-1 29 21 0 12-20 12Z',C.white,'none')+
      p('M0 414q179-104 353-37t361-2 366-32 354 4 566 21V900H0Z','#b5d5ae','none')+
      p('M0 477q245-97 476-18t468-21 477-3 579-7V900H0Z','#93bea1','none')+
      p('M920 450h210m240 0h630','none','#759e8b',5)+[940,1000,1060,1400,1460,1520,1580,1640,1700,1760,1820,1880,1940].map(x=>p(`M${x} 432v47`,'none','#759e8b',6)).join('')+
      p('M850 530q311-44 550 6 300-42 600-8v372H850Z','#aed092','none')+
      p('M850 841q168-69 324-6 185 55 351 8 255-81 475-21v78H850Z','#9bc284','none')+
      p('M849 762Q1009 783 1100 708T1275 622Q1352 610 1384 557','none','#789e77',103)+
      p('M849 754Q1009 775 1100 700T1275 614Q1352 602 1384 549','none','#ecd3a9',89)+
      [[915,754,22,9],[1001,745,25,9],[1082,704,24,10],[1140,667,22,9],[1221,625,20,8],[1300,606,17,8]].map(([x,y,rx,ry])=>e(x,y,rx,ry,'#f8e5bf','#ceb188',2)).join('')+
      r(0,514,850,386,'#e8b98f',0,'none')+p('M0 516h850v368','none','#ad7e60',5)+
      [565,621,681,746,817,890].map(y=>p(`M0 ${y}h850`,'none','#c89774',2)).join('')+
      [[140,516,565],[500,516,565],[280,565,621],[640,565,621],[50,621,681],[440,621,681],[190,681,746],[610,681,746],[360,746,817],[90,817,890],[550,817,890]].map(([x,y,z])=>p(`M${x} ${y}v${z-y}`,'none','#c89774',2)).join('')+
      [[80,590],[470,785],[660,850],[230,850]].map(([x,y])=>p(`M${x} ${y}q17-5 34 0m-26 6h15`,'none','#d5a27b',2)).join('')+
      p('M850 519v381','none',C.ink,3)+p('M858 535v365','none','#f2d2a5',13)+
      p('M60 515V217m690 298V217','none',C.ink,12)+p('M60 515V217m690 298V217','none',C.wood,6)+
      p('M28 220h755','none',C.ink,14)+p('M28 220h755','none','#edc292',8)+
      [[911,618],[1000,849],[1085,763],[1248,869],[1317,832],[1614,605],[1754,876],[1946,613],[1936,784]].map(([x,y])=>p(`M${x-9} ${y}l-3-9m12 8 1-14m5 14 7-9`,'none','#659d79',2.5)).join('')+'</g>';
  }
  function art(id) {return artFns[id] ? artFns[id]() : '';}
  window.LerndachsGardenArt = Object.freeze({width:2000,height:900,background,objects,art,bounds,names,behaviours});
})();

;
/* Original terrace, garden, radio shelf and the small hamster extend the same world. */
(()=>{'use strict';const K=KunterbuntShapes,{C,p,e,r,g}=K,old=WorldArt;
const shelf=()=>p('M-103-9v102m206-102v102','none',C.ink,12)+p('M-103-9v102m206-102v102','none',C.wood,6)+r(-119,-22,238,17,C.wood,5)+r(-119,84,238,17,C.wood,5)+p('M-107-17h214m-214 106h214','none','#ffe0ad',3);
old.decor.push({id:'radio-shelf',name:'Radioregal',note:'Ein Regal für Radio und Lieblingsdinge.',price:55,kind:'decor',repeatable:true});old.names['radio-shelf']='Radioregal';old.bounds['radio-shelf']=[-124,-29,248,142];
const hamster={id:'hamster',name:'Hamster Pünktchen',note:'Ein kleiner Freund mit dicken Backen und neugierigen Augen.',price:280,kind:'pet'};old.decor.push(hamster);LerndachsWorld.pets.push(hamster);old.names.hamster=hamster.name;Object.assign(old.bounds,LerndachsHamsterArt.bounds);
function art(id){if(LerndachsGardenArt.art(id))return LerndachsGardenArt.art(id);return id==='radio-shelf'?g(shelf(),'','k-art'):id==='hamster'?LerndachsHamsterArt.art(id):id==='milo'?LerndachsAvatar.art('milo',LerndachsAvatar.defaults('milo')):''}
for(const [id,name]of Object.entries(LerndachsGardenArt.names)){old.decor.push({id,name,note:'Zum Spielen und Entdecken.',price:0,kind:'yard',repeatable:false});old.names[id]=name}Object.assign(old.bounds,LerndachsGardenArt.bounds);
const priorK=KunterbuntArt.art;KunterbuntArt.art=id=>art(id)||priorK(id);const priorShell=old.shell;window.WorldArt=Object.freeze({...old,art:(id,...args)=>art(id)||old.art(id,...args),shell:(...args)=>priorShell(...args)});
const empty=LerndachsWorld.empty;LerndachsWorld.empty=(home='garden')=>{const list=empty(home),radio=list.find(o=>o.id==='radio');if(radio){radio.x=1250;radio.y=390;radio.layer=2.9}list.push({id:'radio-shelf',uid:'radio-shelf-'+home,x:1250,y:412,s:1,layer:2.8});return list};
window.LerndachsRoomExpansion={width:3600,migrate(state){for(const [home,list]of Object.entries(state.placed)){if(!state.radioShelfVersion){const radio=list.find(o=>o.id==='radio');if(radio){if(radio.x===1180&&radio.y===790){radio.x=1250;radio.y=390;radio.layer=2.9}if(!list.some(o=>o.id==='radio-shelf'))list.push({id:'radio-shelf',uid:'radio-shelf-'+home,x:radio.x,y:radio.y+22,s:1,layer:2.8})}}}if(!state.owned.includes('radio-shelf'))state.owned.push('radio-shelf');state.radioShelfVersion=1;for(const person of [...Object.values(state.placed).flat(),...Object.values(state.stored).flat()])if(person.id==='milo'&&person.appearance?.outfit==='overalls'&&person.appearance.hair==='#48443e'&&person.appearance.top==='#fff3d7')person.appearance=LerndachsAvatar.defaults('milo')}};
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
const art=(id,home,appearance)=>window.LerndachsAvatar?.art(id,appearance)||window.KunterbuntArt?.art(id)||window.LerndachsSeason?.art(id)||LerndachsWorld.petArt(id)||LerndachsPeopleArt.art(id)||A.art(id,home);
const escapeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={settings:'<path d="m9 2-1 4-4 1-2 4 3 3-1 4 4 2 4-2 4 2 4-2-1-4 3-3-2-4-4-1-1-4Z"/><circle cx="12" cy="12" r="3"/>',house:'<path d="m3 11 9-8 9 8v10H3Zm6 10v-8h6v8M7 8V4"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',moon:'<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>',sound:'<path d="m11 4-6 5H2v6h3l6 5Zm4 5q3 3 0 6m3-9q6 6 0 12"/>',friends:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-4a7 7 0 0 1 14 0v4M17 3a4 4 0 0 1 0 8m1 3q4 1 4 7"/>',chair:'<path d="M5 14V8q0-5 7-5t7 5v6M5 12q-4-3-4 2v4h22v-4q0-5-4-2M4 18v4m16-4v4M5 15h14"/>',shop:'<path d="M3 10v12h18V10M2 3h20l1 6q-3 5-6 0-2 5-5 0-3 5-6 0-3 5-5 0Zm7 19v-8h6v8"/>',bag:'<path d="M5 7h14l3 15H2Zm3 0V5a4 4 0 0 1 8 0v2M8 12h.01M16 12h.01m-7 4q3 3 6 0"/>',spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',flip:'<path d="M12 2v20M2 18l6-12v12Zm20 0L16 6v12Z"/>',left:'<path d="m14 5-7 7 7 7m-6-7h12"/>',right:'<path d="m10 5 7 7-7 7m6-7H4"/>',pause:'<path d="M8 5v14m8-14v14" stroke-width="4"/>',play:'<path d="m8 4 12 8-12 8Z"/>'};
function icon(n){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]||icons.spark}</svg>`}
document.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon));
const KEY='lerndachs.world.v3';
const allItems=[...cast,...decor,...homes];
const item=id=>allItems.find(i=>i.id===id);
const uid=()=>crypto.randomUUID();
function fresh(){return {version:3,balance:0,owned:['garden','radio',...LerndachsWorld.environment],home:'garden',night:false,paused:false,wallpapers:{},placed:{garden:LerndachsWorld.empty()},stored:{},receipts:[],journey:{grade:null,starterEarned:false,starterUnlocked:false,done:[],active:null,index:0,target:null,together:false,turn:1,worldMoves:[],practice:0,badges:[]}}}
let state=fresh(),storageOK=true,newWorld=true;
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved?.version===3&&saved.journey&&Number.isSafeInteger(saved.balance)&&saved.balance>=0&&Array.isArray(saved.owned)&&saved.placed&&saved.stored&&Array.isArray(saved.receipts)&&homes.some(h=>h.id===saved.home)){newWorld=false;state=saved;state.journey={...fresh().journey,...saved.journey};state.wallpapers??={}}}catch{}
const visitDay=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
if(newWorld)Object.assign(state.journey,{onboardingVersion:2,opening:'curtain',firstVisitDay:visitDay()});
// Existing friends are preserved. New worlds choose their sole first figure explicitly.
const allPeople=()=>[...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].filter(o=>chars.has(o.id));
for(const person of allPeople())if(person.characterName==='undefined')person.characterName=item(person.id)?.name||'Freund';
if(!state.journey.playerUid&&allPeople().length)state.journey.playerUid=allPeople()[0].uid;
if(!state.radioWelcomed){if(![...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].some(o=>o.id==='radio'))state.placed[state.home].push({uid:uid(),id:'radio',x:1180,y:790,s:.8,layer:3.6,on:false});if(!state.owned.includes('radio'))state.owned.push('radio');state.radioWelcomed=true}
state.audioSettings??={enabled:true,volume:.6,station:0};if(!state.audioSettings.gainVersion){if(state.audioSettings.volume===.35)state.audioSettings.volume=.6;state.audioSettings.gainVersion=1}
if(!state.audioSettings.radioSwitchVersion){for(const o of [...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].filter(o=>o.id==='radio'))o.on=false;state.audioSettings.radioSwitchVersion=1}
if(!state.journey.starterUnlocked){
 state.journey.opening??='explore';
 const existing=[...Object.values(state.placed).flat(),...Object.values(state.stored).flat()];
 for(const o of LerndachsWorld.starterObjects('garden')){
  if(!existing.some(placed=>placed.id===o.id))state.placed.garden.push(o);
  if(!state.owned.includes(o.id))state.owned.push(o.id);
 }
 if(!existing.some(o=>o.id==='dachs'))state.placed.garden.push({uid:'room-dachs',id:'dachs',x:885,y:500,s:1,layer:2.9,pose:'curled'});
}else state.journey.opening??='done';
if(!allItems.some(i=>i.id===state.journey.target&&['decor','pet'].includes(i.kind)))state.journey.target=null;
// Window frames belong to the room, including in existing saved worlds.
for(const home of new Set([...Object.keys(state.placed),...Object.keys(state.stored)])){if(home.endsWith('-outdoor'))continue;
 const fixed=A.defaults(home).find(o=>o.id==='window');if(!fixed)continue;
 const frame=(state.placed[home]||[]).find(o=>o.id==='window')||(state.stored[home]||[]).find(o=>o.id==='window')||fixed;
 Object.assign(frame,fixed,{uid:frame.uid});delete frame.carrier;delete frame.flip;
 state.placed[home]=(state.placed[home]||[]).filter(o=>o.id!=='window');state.placed[home].push(frame);
 if(state.stored[home])state.stored[home]=state.stored[home].filter(o=>o.id!=='window');
}
LerndachsRoomExpansion.migrate(state);
const objectName=o=>o.characterName||o.petName||item(o.id)?.name||A.names[o.id]||'Objekt';
let activePanel='',furnitureTab='props',sound=false,selected=null,drag=null,pan=null,audio;
const reactions=new Map();
const areaKey=()=>state.zone==='outdoor'?state.home+'-outdoor':state.home;
const worldWidth=()=>state.zone==='outdoor'?2000:1600;
const current=()=>state.placed[areaKey()]??=(state.zone==='outdoor'?LerndachsGardenArt.objects():LerndachsWorld.empty(state.home));
const stored=()=>state.stored[areaKey()]??=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{storageOK=false}if(window.LerndachsRewards)LerndachsRewards.sync(state.balance);else $('#balance').textContent=state.balance;$('#bag-count').textContent=stored().length;window.dispatchEvent(new Event('world-saved'))}
let toastTimer;
function toast(message,undo){const t=$('#toast');t.textContent=message;if(undo){const b=document.createElement('button');b.textContent='Rückgängig';b.className='toast-undo';b.onclick=()=>{undo();t.classList.remove('visible')};t.append(b)}t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),undo?6500:2800)}
function syncCarried(){for(const o of current()){if(!o.carrier)continue;const c=current().find(c=>c.uid===o.carrier);if(!c){delete o.carrier;continue}o.x=c.x+(o.dx||55);o.y=c.y+(o.dy??-91);o.layer=5}}
function transform(o){return `translate(${o.x} ${o.y}) scale(${(o.flip?-1:1)*(o.s||1)*(o.sx||1)} ${o.s||1})`}
function specialArt(o){let s=o.id==='dachs'?A.badger(o.pose):art(o.id,state.home,o.appearance);if(o.grown)s=`<g transform="scale(1.12)">${s}</g>`;if(o.id==='yard-lights'&&o.on)s+=E(0,-20,320,55,'#ffe58744');if(o.id==='fridge'&&o.on){s+=`${R(-59,-268,117,246,'#e6edda',10)}${P('M-55-187H55m-110 82H55','none','#8eb5a6',5)}${R(-37,-244,27,46,'#ffd383',5)}${R(12,-228,29,32,'#edb9cf',6)}${E(-13,-141,24,19,C.coral,C.ink,2)}${P('M-12-160v-9','none',C.leaf,3)}${P('M-68-276l-73 27v239l73 13Z','#c5e9db')}${P('M-130-217v40','none',C.deep,6)}`}
 if(o.id==='cabinet'&&o.on)s+=`${R(-130,-126,260,110,C.brown,8)}${R(-116,-110,90,15,C.cream,3)}${R(33,-107,65,38,C.pink,8)}${P('M-139-135l-47 18v107l47 5Z',C.light)}`;
 if(o.id==='fan'&&o.on)s=s.replace('class="fan-spin"','class="fan-spin" style="animation-play-state:paused"');
 if(o.id==='radio')s+=`<g class="radio-light">${E(39,-44,3.5,3.5,o.on?C.yellow:'#a67c6b',C.ink,1)}</g>`;
 if(o.id==='counter'&&o.on)s+=`<g class="water-stream">${P('M63-227v49','none','#84d9ed',7)}${E(73,-175,24,4,'#d3f4f8')}</g>`;
 if(['lamp','pendant'].includes(o.id)&&o.on)s+=E(0,o.id==='lamp'?-55:-25,78,60,'#ffe58738');
 return s;
}
function renderObjects(){syncCarried();const markup=current().filter(o=>o.id!=='dachs'||state.journey.opening!=='done').slice().sort((a,b)=>(a.layer??3)-(b.layer??3)||a.y-b.y).map((o,i)=>{const b=o.id==='dachs'&&o.pose==='curled'?[-80,-95,170,110]:bounds[o.id]||[-50,-100,100,110],isChar=chars.has(o.id),isSmall=b[2]<170&&o.id!=='balloon';return `<g class="${o.id==='window'?'room-fixture':'movable'} ${chars.has(o.id)?'person':''} ${selected===o.uid?'selected':''} ${o.layer===0?'sky-object':''} ${reactions.has(o.uid)?'reacting':''}" data-uid="${o.uid}" data-kind="${o.id}" data-pose="${o.pose||''}" data-on="${!!o.on}" transform="${transform(o)}" tabindex="${o.id==='window'?-1:0}" role="${o.id==='window'?'img':'button'}" aria-label="${o.id==='window'?'Fest eingebauter Fensterrahmen':escapeText(objectName(o))+': bewegen, benutzen oder einpacken'}" style="--idle-delay:${i%7*.37}s"><title>${escapeText(objectName(o))}</title>${R(b[0]-5,b[1]-5,b[2]+10,b[3]+10,'none',13,C.white,4).replace('<rect','<rect class="selection-outline"')}${isSmall?R(Math.min(-38,b[0]),Math.min(-75,b[1]),Math.max(76,b[2]),Math.max(76,b[3]),'transparent',0,'none'):isChar?R(-61,-229,122,235,'transparent',0,'none'):''}<g class="sprite">${specialArt(o)}</g></g>`});$('#objects').innerHTML=markup.filter((s,i)=>!s.includes('data-kind="tree"')).join('');const trees=$('#tree-layer');if(trees)trees.innerHTML=markup.filter(s=>s.includes('data-kind="tree"')).join('');updateSelection();window.WorldSound?.sync();window.LerndachsCharacters?.sync();}
function render(){
 const width=worldWidth();$('#world').setAttribute('viewBox',`0 0 ${width} 900`);$('#world').style.width=`max(100%,calc(100dvh * ${width/900}))`;$('#world').style.aspectRatio=width+'/900';$('#backdrop').innerHTML=state.zone==='outdoor'?LerndachsGardenArt.background():A.shell(state.home,state.wallpapers[state.home]||0);document.body.dataset.zone=state.zone==='outdoor'?'outdoor':'room';for(const id of ['#wall-phone','#wall-schedule']){const node=document.querySelector(id);if(node)node.style.display=state.zone==='outdoor'?'none':''}renderDoor();$('.playground').classList.toggle('night',state.night);document.body.classList.toggle('no-motion',state.paused);
 $('#location').textContent=state.zone==='outdoor'?'Terrasse und Garten':homes.find(h=>h.id===state.home).name;$('#day-label').textContent=state.night?'Geschichten unterm Sternenhimmel.':'Dein Tag. Deine Geschichte.';
 $('#day-toggle').innerHTML=icon(state.night?'moon':'sun');$('#day-toggle').setAttribute('aria-pressed',state.night);$('#day-toggle').setAttribute('aria-label',state.night?'Zum Tag wechseln':'Zur Nacht wechseln');$('#motion-toggle').innerHTML=icon(state.paused?'play':'pause');$('#motion-toggle').setAttribute('aria-pressed',state.paused);$('#motion-toggle').setAttribute('aria-label',state.paused?'Animationen starten':'Animationen pausieren');
 renderObjects();save();panButtons();
}
function select(o){if(o?.id==='window')o=null;selected=o?.uid||null;document.querySelectorAll('.movable.selected').forEach(e=>e.classList.remove('selected'));if(selected)document.querySelector(`[data-uid="${selected}"]`)?.classList.add('selected');updateSelection()}
function updateSelection(){const o=current().find(o=>o.uid===selected);$('#selection').hidden=!o;if(o)$('#selected-name').textContent=objectName(o)}
function worldPoint(e){return new DOMPoint(e.clientX,e.clientY).matrixTransform($('#world').getScreenCTM().inverse())}
function bagHit(x,y){const r=$('#bag-button').getBoundingClientRect();return x>=r.left-20&&x<=r.right+20&&y>=r.top-20&&y<=r.bottom+20}
function effect(o,type='spark'){
 const g=document.createElementNS('http://www.w3.org/2000/svg','g');let x=o.x,y=o.y-(chars.has(o.id)?250:90),s='';
 if(type==='rain'){for(let i=0;i<9;i++)s+=`<path class="fx-drop" style="animation-delay:${i*.07}s" d="M${x-45+i*12} ${o.y+18}l-4 11" stroke="#56b6d1" stroke-width="5" stroke-linecap="round"/>`}
 else if(type==='music'){for(let i=0;i<4;i++)s+=`<text class="fx-note" x="${x-40+i*27}" y="${y-i%2*18}" fill="${[C.coral,C.deep,C.purple][i%3]}" font-size="35" style="animation-delay:${i*.15}s">${i%2?'♫':'♪'}</text>`}
 else if(type==='hearts'){for(let i=0;i<4;i++)s+=`<text class="fx-note" x="${x-35+i*24}" y="${y-i%2*16}" fill="${C.coral}" font-size="28" style="animation-delay:${i*.12}s">♥</text>`}
 else{for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=`<path class="fx-particle" style="--dx:${Math.cos(a)*62}px;--dy:${Math.sin(a)*55-32}px;animation-delay:${i*.025}s" d="m${x+Math.cos(a)*14} ${y+Math.sin(a)*15} 4-8 4 8 8 4-8 4-4 8-4-8-8-4Z" fill="${[C.yellow,C.coral,C.teal,C.pink][i%4]}"/>`}}
 if(o.uid)g.setAttribute('data-source-uid',o.uid);g.innerHTML=s;$('#effects').append(g);setTimeout(()=>g.remove(),2200);
}
function pourWater(o,nozzle={x:69,y:-58,dir:1}){
 const layer=document.createElementNS('http://www.w3.org/2000/svg','g');layer.classList.add('watering-pour');layer.setAttribute('data-source-uid',o.uid);layer.setAttribute('aria-hidden','true');
 const sx=(o.flip?-1:1)*(o.s||1)*(o.sx||1),sy=o.s||1,plant=current().filter(p=>['plant','flower','yard-pot','yard-pot-pink','yard-bed'].includes(p.id)).sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y))[0];let end={x:nozzle.x+nozzle.dir*89,y:45};if(plant){const x=(plant.x-o.x)/sx,y=(plant.y-50-o.y)/sy;if((x-nozzle.x)*nozzle.dir>20&&Math.abs(x-nozzle.x)<300&&y>nozzle.y+20&&y<240)end={x,y}}
 const start={x:nozzle.x,y:nozzle.y},control={x:start.x+nozzle.dir*Math.min(55,Math.abs(end.x-start.x)*.5),y:start.y-50};layer.innerHTML=`<path class="pour-stream" d="M${start.x} ${start.y} Q${control.x} ${control.y} ${end.x} ${end.y}" fill="none" stroke="#84cddd" stroke-width="2" stroke-linecap="round" opacity=".55"/>`;
 const quiet=state.paused||matchMedia('(prefers-reduced-motion:reduce)').matches;for(let i=0;i<15;i++){const drop=document.createElementNS('http://www.w3.org/2000/svg','circle');drop.setAttribute('r',String(1.8+i%3*.4));drop.setAttribute('fill',i%2?'#aeeaf1':'#61b7cd');layer.append(drop);const frames=Array.from({length:31},(_,n)=>{const t=n/30,x=(1-t)**2*start.x+2*(1-t)*t*control.x+t*t*end.x,y=(1-t)**2*start.y+2*(1-t)*t*control.y+t*t*end.y;return {offset:t,transform:`translate(${x}px,${y}px)`,opacity:t<.08?t/.08:t>.9?(1-t)/.1:.95}});if(quiet){const t=(i+1)/16,f=frames[Math.round(t*30)];drop.style.transform=f.transform}else drop.animate(frames,{duration:950,delay:i*65,fill:'both',easing:'linear'})}
 queueMicrotask(()=>{const sprite=document.querySelector(`[data-uid="${o.uid}"] .sprite`);if(sprite)sprite.append(layer);else{layer.setAttribute('transform',transform(o));document.querySelector('#effects').append(layer)}});const media=matchMedia('(prefers-reduced-motion:reduce)'),halt=()=>{if(state.paused||media.matches){for(const drop of layer.querySelectorAll('circle'))for(const a of drop.getAnimations())a.cancel();layer.remove()}},observer=new MutationObserver(halt);observer.observe(document.body,{attributes:true,attributeFilter:['class']});media.addEventListener?.('change',halt);setTimeout(()=>{observer.disconnect();media.removeEventListener?.('change',halt);layer.remove()},2200);
}
function animate(o){
 clearTimeout(reactions.get(o.uid));
 reactions.set(o.uid,setTimeout(()=>{reactions.delete(o.uid);document.querySelector(`[data-uid="${o.uid}"]`)?.classList.remove('reacting')},850));
 const el=document.querySelector(`[data-uid="${o.uid}"]`);if(el){el.classList.remove('reacting');void el.getBoundingClientRect();el.classList.add('reacting')}
}
function use(o){
 if(!o)return;select(o);animate(o);window.dispatchEvent(new CustomEvent('world-use',{detail:{id:o.id,uid:o.uid}}));if(window.WorldSound)WorldSound.effect(o.id);if(o.id==='dachs'){select(null);effect(o);if(state.journey.starterUnlocked)window.dispatchEvent(new Event('request-partner-learning'));return}if(o.id==='balloon'){effect(o);return}if(o.id==='clock'){const h=document.querySelector(`[data-uid="${o.uid}"] .clock-hand`);if(!state.paused)h?.animate([{transform:'rotate(0deg)'},{transform:'rotate(720deg)'}],{duration:1000});effect(o);return}
 if(LerndachsWorld.pets.some(p=>p.id===o.id)){effect(o,'hearts');showPet(o);return}
 if(o.id.startsWith('yard-')){const kind=LerndachsGardenArt.behaviours[o.id],sprite=document.querySelector(`[data-uid="${o.uid}"] .sprite`),person=current().find(c=>c.uid===state.journey.playerUid)||current().find(c=>chars.has(c.id));const calm=state.paused||matchMedia('(prefers-reduced-motion:reduce)').matches;if(kind==='sit'&&person){person.x=o.x;person.y=o.y-42;renderObjects();effect(person,'hearts')}else if(kind==='drink'){effect(o,'hearts');toast('Mmmh, Zitronenlimonade!');WorldSound.effect('tea')}else if(kind==='water'){pourWater(o,{x:-61,y:-47,dir:-1})}else if(kind==='shine'){state.night=!state.night;render()}else if(kind==='wear'&&person){if(o.carrier){delete o.carrier;o.y=person.y-5}else{o.carrier=person.uid;o.dx=0;o.dy=-230;o.layer=5}renderObjects()}else if(kind==='grow'){o.grown=!o.grown;renderObjects();effect(o,'hearts')}else if(kind==='chime'){o.on=!o.on;renderObjects();effect(o,'music');WorldSound.effect('guitar')}else{if(!calm)sprite?.animate(kind==='flutter'?[{transform:'translate(0,0)'},{transform:'translate(70px,-50px) rotate(12deg)'},{transform:'translate(-25px,-30px) rotate(-8deg)'},{transform:'translate(0,0)'}]:[{transform:'rotate(0deg)'},{transform:'rotate(-5deg)'},{transform:'rotate(5deg)'},{transform:'rotate(0deg)'}],{duration:1200,easing:'ease-in-out'});effect(o,kind==='chirp'?'music':'spark');if(kind==='chirp')WorldSound.effect('rabbit')}save();return}
 if(o.id==='watering'){pourWater(o);return}
 if(o.id==='sun'){sunClick();state.night=!state.night;render();effect(o);return}
 if(o.id==='cloud'){effect(o,'rain');return}
 if(o.id==='radio'){if(window.WorldSound)WorldSound.cycleRadio(o);else o.on=!o.on;renderObjects();if(o.on){effect(o,'music')}else document.querySelectorAll(`[data-source-uid="${o.uid}"]`).forEach(node=>node.remove());save();return}if(o.id==='guitar'){effect(o,'music');save();return}
 if(['lamp','pendant','fridge','counter','cabinet'].includes(o.id)){o.on=!o.on;renderObjects();animate(o);save();return}
 if(o.id==='camera'){const flash=document.createElement('div');flash.className='flash';$('.game-shell').append(flash);setTimeout(()=>flash.remove(),500);effect(o);return}
 if(o.id==='sofa'||o.id==='bed'){const c=current().filter(c=>chars.has(c.id)).sort((a,b)=>Math.abs(a.x-o.x)-Math.abs(b.x-o.x))[0];if(c){c.x=o.x+(c.x<o.x?-65:65);c.y=o.y-52;renderObjects();animate(c)}effect(o);return}
 if(o.id==='fan'){o.on=!o.on;const el=document.querySelector(`[data-uid="${o.uid}"] .fan-spin`);if(el)el.style.animationPlayState=o.on?'paused':'running';save();return}
 effect(o);
}
function pack(o){
 if(!o||['dachs','window'].includes(o.id))return;const home=areaKey(),copy=structuredClone(o),carried=current().filter(x=>x.carrier===o.uid);for(const x of carried)delete x.carrier;
 state.placed[home]=current().filter(x=>x.uid!==o.uid);delete o.carrier;stored().push(o);select(null);renderObjects();save();toast(`${item(o.id)?.name} ist in deiner Tasche.`,()=>{if(!state.stored[home].some(x=>x.uid===copy.uid))return;state.stored[home]=state.stored[home].filter(x=>x.uid!==copy.uid);state.placed[home].push(copy);if(areaKey()===home)renderObjects();save()});
}
function restore(uidToRestore){if(current().length>=120){toast('Packe erst etwas ein, damit Platz bleibt.');return}const o=stored().find(o=>o.uid===uidToRestore);if(!o)return;state.stored[areaKey()]=stored().filter(x=>x.uid!==uidToRestore);delete o.carrier;current().push(o);renderObjects();save();$('#panel').close();focusObject(o);effect(o);toast(`${item(o.id)?.name} ist wieder da.`)}
function focusObject(o){const s=$('#scene-scroll'),scale=$('#world').clientWidth/worldWidth();s.scrollTo({left:Math.max(0,o.x*scale-s.clientWidth/2),behavior:state.paused?'instant':'smooth'});select(o)}
function carryOrDrop(o){if(o.id==='window'||chars.has(o.id)||!bounds[o.id]||bounds[o.id][2]>165||['sun','cloud','hanging','balloon'].includes(o.id))return;const c=current().find(c=>chars.has(c.id)&&Math.abs(c.x-o.x)<72&&Math.abs(c.y-91-o.y)<72);if(c){o.carrier=c.uid;o.dx=o.x<c.x?-55:55;o.layer=5;syncCarried();effect(c)}}
$('#world').addEventListener('pointerdown',e=>{
 const el=e.target.closest('.movable');if(!el||e.button>0||drag)return;e.preventDefault();e.stopPropagation();
 const o=current().find(o=>o.uid===el.dataset.uid);
 const p=worldPoint(e);
 drag={el,o,start:p,ox:o.x,oy:o.y,carrier:o.carrier,layer:o.layer,moved:false,ready:false,latest:e,pointer:e.pointerId};
 select(o);el.setPointerCapture(e.pointerId);$('#welcome-hint').hidden=true;
 drag.timer=setTimeout(()=>{
  drag.ready=true;delete o.carrier;drag.el=document.querySelector(`[data-uid="${o.uid}"]`);drag.el.setPointerCapture(drag.pointer);drag.el.classList.add('dragging');drag.el.parentElement.append(drag.el);document.body.classList.add('is-dragging');WorldSound.effect('tap');moveDraggedObject(drag.latest);
 },320);
});
function moveDraggedObject(e){
 if(!drag||e.pointerId!==drag.pointer)return;
 drag.latest=e;if(!drag.ready)return;
 const p=worldPoint(e);if(p.x!==drag.start.x||p.y!==drag.start.y)drag.moved=true;
 drag.o.x=Math.max(40,Math.min(worldWidth()-40,drag.ox+p.x-drag.start.x));drag.o.y=Math.max(85,Math.min(864,drag.oy+p.y-drag.start.y));drag.el.setAttribute('transform',transform(drag.o));syncCarried();for(const o of current().filter(o=>o.carrier===drag.o.uid))document.querySelector(`[data-uid="${o.uid}"]`)?.setAttribute('transform',transform(o));
 $('#bag-button').classList.toggle('drop-ready',bagHit(e.clientX,e.clientY));const s=$('#scene-scroll');if(e.clientX<40)s.scrollLeft-=12;else if(e.clientX>innerWidth-40)s.scrollLeft+=12;

}
window.addEventListener('pointermove',moveDraggedObject);
function finishDrag(e){
 if(!drag||e.pointerId!==drag.pointer)return;
 const d=drag;drag=null;clearTimeout(d.timer);document.body.classList.remove('is-dragging');$('#bag-button').classList.remove('drop-ready');d.el.classList.remove('dragging');
 if(e.type==='pointercancel'){d.o.x=d.ox;d.o.y=d.oy;d.o.layer=d.layer;if(d.carrier)d.o.carrier=d.carrier}
 else if(d.moved&&bagHit(e.clientX,e.clientY)){d.o.x=d.ox;d.o.y=d.oy;pack(d.o);return}
 else if(d.moved){carryOrDrop(d.o);animate(d.o);WorldSound.effect('drop')}
 else if(!d.ready)use(d.o);
 renderObjects();save();if(d.moved&&e.type!=='pointercancel')window.dispatchEvent(new CustomEvent('world-move',{detail:{uid:d.o.uid,id:d.o.id}}));
}
window.addEventListener('pointerup',finishDrag);window.addEventListener('pointercancel',finishDrag);
$('#world').addEventListener('keydown',e=>{
 const el=e.target.closest('.movable');if(!el)return;const o=current().find(o=>o.uid===el.dataset.uid),delta={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,-15],ArrowDown:[0,15]}[e.key];select(o);
 if(delta){e.preventDefault();delete o.carrier;o.x=Math.max(40,Math.min(worldWidth()-40,o.x+delta[0]));o.y=Math.max(85,Math.min(864,o.y+delta[1]));carryOrDrop(o);el.setAttribute('transform',transform(o));syncCarried();for(const held of current().filter(x=>x.carrier===o.uid))document.querySelector(`[data-uid="${held.uid}"]`)?.setAttribute('transform',transform(held));save();window.dispatchEvent(new CustomEvent('world-move',{detail:{uid:o.uid,id:o.id}}))}
 if(e.key==='Enter'||e.key===' '){e.preventDefault();use(o)}if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();pack(o)}if(e.key==='Escape')select(null);
});
$('#world').addEventListener('focusin',e=>{const el=e.target.closest('.movable');if(el){const o=current().find(x=>x.uid===el.dataset.uid);select(o);focusObject(o)}});
const scene=$('#scene-scroll');
scene.addEventListener('pointerdown',e=>{if(e.target.closest('.movable')||e.button>0)return;pan={x:e.clientX,scroll:scene.scrollLeft,y:e.clientY,moved:false};scene.setPointerCapture(e.pointerId)});
scene.addEventListener('pointermove',e=>{if(!pan||drag)return;if(Math.abs(e.clientX-pan.x)>5)pan.moved=true;scene.style.scrollBehavior='auto';scene.scrollLeft=pan.scroll+pan.x-e.clientX});
scene.addEventListener('pointerup',e=>{if(!pan)return;if(!pan.moved){select(null);const p=worldPoint(e);if(state.zone!=='outdoor'&&p.x<1600&&p.y<580){state.wallpapers[state.home]=((state.wallpapers[state.home]||0)+1)%3;$('#backdrop').innerHTML=A.shell(state.home,state.wallpapers[state.home]);renderObjects();save()}else effect({x:p.x,y:p.y+90});WorldSound.effect('tap');window.dispatchEvent(new Event('world-touch'))}pan=null;scene.style.scrollBehavior=''});
scene.addEventListener('pointercancel',()=>{pan=null});
function panButtons(){const s=$('#scene-scroll');$('#pan-left').disabled=s.scrollLeft<4;$('#pan-right').disabled=s.scrollLeft>s.scrollWidth-s.clientWidth-4}
scene.addEventListener('scroll',()=>{panButtons();},{passive:true});window.addEventListener('resize',()=>{centerScene();panButtons()});
$('#pan-left').onclick=()=>scene.scrollBy({left:-scene.clientWidth*.65,behavior:state.paused?'instant':'smooth'});$('#pan-right').onclick=()=>scene.scrollBy({left:scene.clientWidth*.65,behavior:state.paused?'instant':'smooth'});
function centerScene(){const s=$('#scene-scroll');s.scrollTo({left:Math.max(0,$('#world').clientWidth/worldWidth()*(state.zone==='outdoor'?600:800)-s.clientWidth/2),behavior:'instant'});panButtons();}
function switchZone(zone){if(!['room','outdoor'].includes(zone))return;const from=areaKey(),player=current().find(o=>o.uid===state.journey.playerUid),held=player?current().filter(o=>o.carrier===player.uid):[];if(player){player.zonePositions??={};player.zonePositions[from]={x:player.x,y:player.y,s:player.s,layer:player.layer};state.placed[from]=current().filter(o=>o.uid!==player.uid&&!held.includes(o))}state.zone=zone;if(player){const position=player.zonePositions[areaKey()]||{x:zone==='outdoor'?600:700,y:790,s:1,layer:4};Object.assign(player,position);current().push(player,...held)}selected=null;render();$('#panel').close();centerScene()}
function renderDoor(){let door=document.querySelector('#zone-door');if(!door){door=document.createElementNS('http://www.w3.org/2000/svg','g');door.id='zone-door';door.setAttribute('role','button');door.setAttribute('tabindex','0');$('#world').append(door);for(const t of ['pointerdown','pointerup'])door.addEventListener(t,e=>e.stopPropagation());door.addEventListener('click',()=>switchZone(state.zone==='outdoor'?'room':'outdoor'));door.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();switchZone(state.zone==='outdoor'?'room':'outdoor')}})}const outdoor=state.zone==='outdoor';door.setAttribute('transform',`translate(${outdoor?88:1512} 510)`);door.setAttribute('aria-label',outdoor?'Zurück ins Zimmer':'Zur Terrasse und zum Garten');door.innerHTML=`<title>${outdoor?'Ins Zimmer':'Zum Garten'}</title><rect x="-49" y="-72" width="98" height="144" rx="17" fill="#fff3d7" stroke="#363c48" stroke-width="4"/><path d="M-24 50V-51h48V50M-7-51V50m28-9 22-22-22-22m22 22H3" fill="none" stroke="#4b978b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><text y="96" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="bold" fill="#363c48">${outdoor?'Zimmer':'Garten'}</text>`}
function chime(){if(window.WorldSound){WorldSound.effect('reward');return}if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();[523.25,659.25,783.99].forEach((hz,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.13;o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.31)})}catch{}}
const panelTitles={shop:['','Einrichten'],residents:['WER SPIELT HEUTE MIT?','Deine Figuren'],furniture:['','Einrichten'],map:['','Wohin möchtest du?'],bag:['WEGGELEGT IST NICHT VERLOREN','Deine Tasche'],rewards:['','Deine Sterne'],help:['WILLKOMMEN BEI LERNDACHS','Einfach alles ausprobieren.']};
function showPanel(type){if(!state.journey.starterUnlocked&&['shop','furniture','map','residents'].includes(type)){window.dispatchEvent(new Event('request-starter'));return}activePanel=type;$('#panel-title').textContent=panelTitles[type][1];renderPanel();if(!$('#panel').open)$('#panel').showModal();$('#panel-content button:not(:disabled)')?.focus({preventScroll:true});if(type==='rewards')window.LerndachsRewards?.open();if(['shop','furniture'].includes(type)){const wanted=item(state.journey.target);if(wanted&&wanted.price<=state.balance&&!state.owned.includes(wanted.id)){const tile=document.querySelector(`.furnishing-item[data-id="${wanted.id}"]`);tile?.focus({preventScroll:true});tile?.scrollIntoView?.({block:'center',behavior:'auto'})}}}
function preview(i,isHouse=false){const b=isHouse?[-105,-160,210,180]:bounds[i.id]||[-65,-140,130,160];return `<svg viewBox="${b.join(' ')}" aria-hidden="true">${isHouse?A.houseArt(i):art(i.id,state.home,i.appearance)}</svg>`}
function card(i,type='decor',storedObject){const own=state.owned.includes(i.id),isHouse=type==='houses',isChar=type==='figures';let action='place',label=isChar?'Mitspielen':'Hinstellen',disabled=false;
 if(storedObject){action='restore';label='Zurückholen'}else if(activePanel==='shop'){action='buy';label=own&&!i.repeatable?'Schon deins':`${i.price} ✦ · Holen`;disabled=own&&!i.repeatable}
 else if(isHouse){action=own?'visit':'store';label=state.home===i.id?'Hier bist du':own?'Besuchen':`${i.price} ✦ · Laden`;disabled=state.home===i.id}
 else if(isChar&&current().some(o=>o.id===i.id)){label='✓ Spielt mit';disabled=true}
 const displayName=storedObject?objectName(storedObject):current().find(o=>o.id===i.id)?.petName||i.name;
 return `<article class="item-card"><div class="item-art">${preview(storedObject?{...i,...storedObject}:i,isHouse)}</div><div class="item-body"><h3>${escapeText(displayName)}</h3>${activePanel==='shop'?'':`<p>${i.note||'Bereit für die nächste Geschichte.'}</p>`}<button data-action="${action}" data-id="${storedObject?.uid||i.id}" ${disabled?'disabled':''}>${label}</button></div></article>`;
}
const furnishingGroups=[['Sitzen & Schlafen',['sofa','bed','stool','cushion','blanket']],['Tische & Stauraum',['table','cabinet','shelf','radio-shelf','basket']],['Küche & Alltag',['fridge','counter','tea','kettle','jar','toaster','fruit','cake']],['Licht & Technik',['lamp','pendant','garland','clock','fan','radio','camera']],['Pflanzen & Dekoration',['plant','flower','hanging','watering','rug','picture','poster','curtain','balloon']],['Musik & Kreativität',['guitar','books','easel']]];
const furnishingIds=new Set(furnishingGroups.flatMap(([,ids])=>ids));
function renderFurnishings(c){const intro=state.journey.opening!=='done',target=item(state.journey.target),missing=target?target.price-state.balance:0,groups=intro?[['Für deinen Einzug',LerndachsWorld.shopStock],...furnishingGroups.map(([name,ids])=>[name,ids.filter(id=>!LerndachsWorld.shopStock.includes(id))])]:furnishingGroups;c.innerHTML=`<div class="furnishing-balance" aria-label="Dein Guthaben">✦ ${state.balance}</div>${missing>0?`<div class="shop-invitation" role="status"><p>Noch ${missing} Sterne für ${escapeText(target.name)}.</p><button class="journey-primary" data-action="learn">Sterne sammeln</button></div>`:''}<div class="furnishing-catalogue first-shop">${groups.map(([name,ids])=>{const items=ids.map(item).filter(i=>i&&(!intro||state.owned.includes(i.id)||LerndachsWorld.shopStock.includes(i.id)));if(!items.length)return '';return `<section class="furnishing-category"><h3>${name}</h3><div class="furnishing-grid">${items.map(i=>{const own=state.owned.includes(i.id),action=own?'place':'buy';return `<button class="furnishing-item ${state.journey.target===i.id?'wish-item':''}" data-action="${action}" data-id="${i.id}" aria-label="${escapeText(i.name)}${own?' · anzeigen':', '+i.price+' Sterne'}"><span class="furnishing-art">${preview(i)}</span><span class="item-tooltip">${escapeText(i.name)}</span>${own?'':`<span class="item-price">${i.price} ✦</span>`}</button>`}).join('')}</div></section>`}).join('')}</div>`}
function renderPanel(){const c=$('#panel-content');
 if(activePanel==='shop'||activePanel==='furniture')renderFurnishings(c);
 else if(activePanel==='residents'&&window.LerndachsFriends){c.innerHTML='';LerndachsFriends.render(c)}
 else if(activePanel==='residents')c.innerHTML=`<div class="card-grid">${[...cast,...decor.filter(i=>i.kind==='pet')].filter(i=>state.owned.includes(i.id)).map(i=>card(i,'figures')).join('')}</div><p class="note">Tippe auf eine Figur, damit sie mitspielt. Figuren in deiner Tasche kannst du dort zurückholen.</p><button class="text-button" data-action="store">Neue Freunde im Laden →</button>`;

 else if(activePanel==='bag')c.innerHTML=`<p class="note" style="margin:0 0 18px">Zieh Dinge auf die Tasche oder wähle „Einpacken“. Hier kannst du sie jederzeit zurückholen.</p>${stored().length?`<div class="card-grid">${stored().map(o=>card(item(o.id),'decor',o)).join('')}</div>`:'<div class="empty"><strong>Hier ist noch Platz für deine Ideen.</strong>Deine eingepackten Dinge landen hier. Sie bleiben gespeichert.</div>'}`;
 else if(activePanel==='map')c.innerHTML=`<div class="area-choices"><button data-action="zone" data-id="room">${icon('house')}<strong>Zimmer</strong></button><button data-action="zone" data-id="outdoor">${icon('sun')}<strong>Terrasse und Garten</strong></button></div>${homes.filter(i=>state.owned.includes(i.id)).length>1?`<div class="card-grid">${homes.filter(i=>state.owned.includes(i.id)).map(i=>card(i,'houses')).join('')}</div>`:''}`;
 else if(activePanel==='rewards')c.innerHTML=`<div class="stars-total" role="img" aria-label="${state.balance} Sterne"><span aria-hidden="true">✦</span><strong id="rewards-count" aria-hidden="true">0</strong></div><button class="primary wide" data-action="learn">Mehr Sterne sammeln</button>`;
 else c.innerHTML=`<div class="info-list"><p><strong>Alles ist zum Anfassen da.</strong><br>Figuren, Möbel, Pflanzen, Lampen, Sonne und Wolken: Tippe etwas an oder zieh es an einen neuen Platz.</p><p><strong>Einpacken & zurückholen.</strong><br>Zieh ein Objekt auf die Tasche oder tippe nach dem Auswählen auf das Taschen-Symbol. Die Dinge bleiben erhalten.</p><p><strong>Kleine Überraschungen.</strong><br>Öffne den Kühlschrank, dreh den Wasserhahn auf, lass es regnen, spiele Gitarre oder setze eine Figur aufs Sofa. Kleine Dinge kannst du einer Figur in die Hand ziehen.</p><p><strong>Deine Welt, dein Tempo.</strong><br>Mit den Pfeilen oder durch Ziehen am Hintergrund schaust du dich um. Tippe auf eine Wand, um ihre Farbe zu ändern. Oben kannst du Animationen und Töne umschalten.</p><p><strong>Tastatur.</strong><br>Tab wählt aus, Pfeiltasten bewegen, Enter benutzt, Entf packt ein. Escape hebt die Auswahl auf.</p></div><div class="settings-actions"><button data-action="tidy">Zimmer aufräumen</button><button data-action="fullscreen">Vollbild umschalten</button><button data-install-app>App installieren</button></div><p class="note">${storageOK?'Lokal in diesem Browser gespeichert.':'Lokale Speicherung ist nicht verfügbar.'} Lerndachs ist ein eigenständiger Entwurf mit neu erstellten Grafiken und Klängen. Keine Verbindung zu Toca Boca oder Duolingo. Arbeitstitel.</p>`;
}
$('#panel-content').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.id,action=b.dataset.action;if(b.dataset.furnitureTab){if(b.dataset.furnitureTab==='shop')showPanel('shop');else{furnitureTab=b.dataset.furnitureTab;showPanel('furniture')}return}
 if(action==='buy'){
  if(!state.journey.starterUnlocked||!(LerndachsWorld.shopStock.includes(id)||(state.journey.opening==='done'&&(item(id)?.kind==='pet'||furnishingIds.has(id)))))return;
  const i=item(id);if(current().length>=120){toast('Packe erst etwas ein.');return}
  const result=WunderEconomy.purchase(state,i);
  if(!result.purchased){
   if(result.reason==='insufficient'){toast('Dafür fehlen dir noch '+Math.max(0,item(id).price-state.balance)+' Sterne.');state.journey.target=id;if(state.journey.opening==='second-item')state.journey.opening='earn';save();renderPanel();window.dispatchEvent(new Event('opening-changed'))}
   return;
  }
  if(state.journey.target===id)state.journey.target=null;
  if(state.journey.opening==='shop')state.journey.opening='second-item';
  save();place(id,true);animate(current().at(-1));chime();window.dispatchEvent(new CustomEvent('learning-celebration',{detail:{kind:'bubbles'}}));toast('Das gehört dir!');window.dispatchEvent(new Event('opening-changed'));
 }
 if(action==='learn'){$('#panel').close();window.dispatchEvent(new Event('request-earn-stars'))}
 if(action==='place')place(id);if(action==='restore')restore(id);
 if(action==='zone'){switchZone(id);return}if(action==='visit'){state.zone='room';state.home=id;selected=null;current();render();$('#panel').close();centerScene()}
 if(action==='store')showPanel('shop')
 if(action==='tidy'){const home=areaKey(),old=structuredClone({placed:current(),stored:stored()}),defaults=state.zone==='outdoor'?LerndachsGardenArt.objects():A.defaults(home);for(const o of [...current(),...stored()]){const d=defaults.find(d=>d.id===o.id);if(d){o.x=d.x;o.y=d.y}delete o.carrier}state.placed[home]=[...current(),...stored()];state.stored[home]=[];selected=null;render();$('#panel').close();toast('Deine vorhandenen Dinge sind aufgeräumt.',()=>{state.placed[home]=old.placed;state.stored[home]=old.stored;if(areaKey()===home)render();save()})}
 if(action==='fullscreen'){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>toast('Vollbild ist hier nicht verfügbar.'))}
});
function place(id,purchased=false){if(!state.journey.starterUnlocked||!state.owned.includes(id))return;if(!purchased){const bag=stored().find(o=>o.id===id);if(bag){restore(bag.uid);return}const existing=!item(id)?.repeatable&&current().find(o=>o.id===id);if(existing){$('#panel').close();focusObject(existing);toast('Das ist schon in deinem Zimmer. Weitere Exemplare gibt es im Laden.');return}const elsewhere=!item(id)?.repeatable&&(Object.values(state.placed).flat().some(o=>o.id===id)||Object.values(state.stored).flat().some(o=>o.id===id));if(elsewhere){toast('Das steht in einem anderen Zuhause. Besuche es über die Nachbarschaft.');return}}if(chars.has(id)&&current().some(o=>o.id===id))return;if(current().length>=120){toast('Ganz schön voll. Packe zuerst etwas ein.');return}const isPet=item(id)?.kind==='pet',x=(scene.scrollLeft+scene.clientWidth*(isPet?.28:.5))/$('#world').clientWidth*worldWidth(),o={uid:uid(),id,x,y:chars.has(id)?790:isPet?815:['picture','poster'].includes(id)?330:735,s:1,layer:isPet?4.1:A.layer(id)};current().push(o);renderObjects();save();$('#panel').close();select(o);effect(o)}
function credit(payload){const result=WunderEconomy.credit(state,payload);save();return result}
window.Lerndachs=Object.freeze({version:3,getSnapshot:()=>structuredClone(state)});
$('#map-button').onclick=()=>showPanel('map');$('#wallet').onclick=()=>showPanel('rewards');$('#help').onclick=()=>showPanel('help');$('#bag-button').onclick=()=>showPanel('bag');
document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>showPanel(b.dataset.panel));$('#close-panel').onclick=()=>$('#panel').close();$('#panel').addEventListener('click',e=>{if(e.target===$('#panel')){const r=$('#panel').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#panel').close()}});
$('#day-toggle').onclick=()=>{sunClick();state.night=!state.night;render()};$('#motion-toggle').onclick=()=>{state.paused=!state.paused;render()};$('#sound-toggle').onclick=()=>{sound=!sound;$('#sound-toggle').setAttribute('aria-pressed',sound);$('#sound-toggle').setAttribute('aria-label',sound?'Töne ausschalten':'Töne einschalten');if(sound)chime()};$('#dismiss-hint').onclick=()=>{$('#welcome-hint').hidden=true};
$('#deselect').onclick=()=>select(null);$('#pack-object').onclick=()=>pack(current().find(o=>o.uid===selected));$('#use-object').onclick=()=>use(current().find(o=>o.uid===selected));$('#flip-object').onclick=()=>{const o=current().find(o=>o.uid===selected);if(o){o.flip=!o.flip;renderObjects();save()}};
setInterval(()=>{if(state.paused||document.hidden)return;for(const o of current().filter(o=>o.id==='radio'&&o.on))effect(o,'music')},2600);
if(matchMedia('(prefers-reduced-motion: reduce)').matches)state.paused=true;
render();centerScene();setTimeout(()=>{$('#welcome-hint').hidden=true},8500);

window.Lernwelt={switchZone,snapshot:()=>structuredClone(state),find:id=>current().find(o=>o.id===id),focus:id=>{const o=current().find(o=>o.id===id);if(o)focusObject(o);return !!o},reward:(receiptId,stars)=>credit({receiptId,stars}),use:id=>use(current().find(o=>o.id===id)),pack:id=>pack(current().find(o=>o.id===id)),restore};

// Preserve the original adapter name for existing integrations.
window.MeineKleineWelt=window.Lerndachs;

function grantStarter(){
 if(state.journey.starterUnlocked)return false;
 state.journey.starterUnlocked=true;state.journey.starterEarned=true;
 WunderEconomy.credit(state,{receiptId:'welcome-home',stars:LerndachsWorld.welcomeStars});
 render();effect({x:800,y:500});window.dispatchEvent(new CustomEvent('learning-celebration',{detail:{kind:'confetti'}}));return true;
}
function showPet(o){
 selected=o.uid;const i=item(o.id);$('#panel-title').textContent=o.petName||i.name;activePanel='pet';
 $('#panel-content').innerHTML=`<div class="pet-portrait">${preview(i)}</div><p class="pet-bond">${'♥'.repeat(Math.min(5,o.bond||0))}${'♡'.repeat(5-Math.min(5,o.bond||0))}</p><p class="note">Zeit zusammen ist schön. Dein Tier wartet ohne Zeitdruck auf dich.</p><div class="pet-actions"><button data-care="stroke">♡ Streicheln</button><button data-care="feed">♧ Füttern</button><button data-care="play">✦ Spielen</button></div><p id="pet-feedback" role="status">Was möchtet ihr zusammen machen?</p><label class="pet-name-label">Name <input id="pet-name" maxlength="24" value=""></label><button id="save-pet-name" class="primary wide">Namen speichern</button>`;
 $('#pet-name').value=o.petName||i.name;
 $('#panel-content').querySelectorAll('[data-care]').forEach(b=>b.onclick=()=>{o.bond=Math.min(5,(o.bond||0)+1);save();$('#panel-content .pet-bond').textContent='♥'.repeat(o.bond)+'♡'.repeat(5-o.bond);$('#pet-feedback').textContent=({stroke:'Dein Freund genießt die kleine Pause.',feed:'Lecker! Gemeinsam kümmert ihr euch um euren Alltag.',play:'Was für ein schöner Spielmoment!'})[b.dataset.care];effect(o);WorldSound?.effect(o.id);animate(o)});
 $('#save-pet-name').onclick=()=>{const name=$('#pet-name').value.trim();if(name){o.petName=name;save();$('#panel-title').textContent=name;renderObjects();toast('Name gespeichert.')}};
 if(!$('#panel').open)$('#panel').showModal();
}
window.LerndachsJourney={get profile(){return state.journey},save,grantStarter,get catalogue(){return allItems},art,preview,showShop(){showPanel('shop')},reward(id,stars=15){if(state.journey.done.includes(id))return false;const r=WunderEconomy.credit(state,{receiptId:'task-'+id,stars});if(r.credited){state.journey.done.push(id);if(state.journey.together)state.journey.turn=state.journey.turn===1?2:1}save();return r.credited},focusObject,render};
// A mission can retrieve already-owned props without granting unearned items.
function bringOwned(id){
 if(!state.owned.includes(id)||current().some(o=>o.id===id))return;
 for(const [home,objects] of Object.entries(state.stored)){const index=objects.findIndex(o=>o.id===id);if(index>=0){const [o]=objects.splice(index,1);delete o.carrier;current().push(o);renderObjects();save();return}}
 for(const [home,objects] of Object.entries(state.placed)){if(home===state.home)continue;const index=objects.findIndex(o=>o.id===id);if(index>=0){const [o]=objects.splice(index,1);delete o.carrier;current().push(o);renderObjects();save();return}}
}
LerndachsJourney.bring=bringOwned;

LerndachsJourney.prepare=goal=>{
 if(goal==='water'){const can=current().find(o=>o.id==='watering'),plant=current().find(o=>o.id==='plant');if(can&&plant&&Math.hypot(can.x-plant.x,can.y-plant.y)>350){can.x=plant.x+120;can.y=plant.y-200;can.flip=true;can.layer=3.4;renderObjects();save()}}
 if(goal==='left'){const table=current().find(o=>o.id==='table'),stool=current().find(o=>o.id==='stool');if(table&&stool&&Math.abs(table.x-stool.x)>250){stool.x=table.x+200;stool.y=table.y+35;renderObjects();save()}}
};

LerndachsJourney.getTimetable=()=>state.timetable;
LerndachsJourney.setTimetable=plan=>{state.timetable=plan;save()};

// Seven sun interactions form one persistent bonus receipt.
function sunClick(){
 if(state.journey.opening!=='done'||state.journey.grade===null)return;
 state.journey.sunClicks=(Number.isSafeInteger(state.journey.sunClicks)?state.journey.sunClicks:0)+1;
 if(state.journey.sunClicks%7===0){const r=credit({receiptId:'sun-bonus-'+state.journey.sunClicks/7,stars:250});if(r.credited){toast('Sonnengeheimnis! +250 Sterne für deine Welt.');window.dispatchEvent(new Event('learning-celebration'))}}
 else save();
}

window.addEventListener('request-world-help',()=>showPanel('help'));

LerndachsJourney.people=()=>allPeople().map(o=>({...o,name:objectName(o),player:o.uid===state.journey.playerUid}));
LerndachsJourney.player=()=>allPeople().find(o=>o.uid===state.journey.playerUid);
LerndachsJourney.person=(id,name,mode='add',personUid,appearance)=>{
 if(!chars.has(id)||typeof name!=='string'||!name.trim())return false;
 let o=mode==='initial'?null:allPeople().find(o=>o.uid===(personUid||state.journey.playerUid));
 if(mode==='add')o=null;
 if(!o){if(current().length>=120||allPeople().length>=20){toast('Deine Welt ist schon gut besucht.');return false}o={uid:uid(),id,x:700+allPeople().length%5*105,y:790,s:1,layer:4};current().push(o)}
 o.id=id;o.characterName=name.trim().slice(0,24);if(appearance)o.appearance=LerndachsAvatar.normalize(id,appearance);if(mode==='initial'||mode==='change')state.journey.playerUid=o.uid;
 if(!state.owned.includes(id))state.owned.push(id);renderObjects();save();window.dispatchEvent(new Event('character-celebrate'));return true;
};
LerndachsJourney.showPerson=personUid=>{const o=allPeople().find(o=>o.uid===personUid);if(!o)return;for(const map of [state.placed,state.stored])for(const [home,list] of Object.entries(map))map[home]=list.filter(x=>x.uid!==personUid);delete o.carrier;current().push(o);renderObjects();save();$('#panel').close();focusObject(o)};
LerndachsJourney.pets=()=>[...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].filter(o=>item(o.id)?.kind==='pet').map(o=>({...o,name:objectName(o)}));
LerndachsJourney.visitPet=petUid=>{const pet=[...Object.values(state.placed).flat(),...Object.values(state.stored).flat()].find(o=>o.uid===petUid&&item(o.id)?.kind==='pet');if(!pet)return;for(const map of [state.placed,state.stored])for(const [home,list] of Object.entries(map))map[home]=list.filter(o=>o.uid!==petUid);delete pet.carrier;current().push(pet);renderObjects();save();focusObject(pet);showPet(pet)};
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

;
/* Draft-only wardrobe controls shared by initial choice and later edits. */
(()=>{'use strict';const A=LerndachsAvatar;
const svg=(id,a)=>`<svg viewBox="-80 -258 160 280" aria-hidden="true">${A.art(id,a)}</svg>`;
function mount(host,getId,initial,expanded=true){let id=getId(),draft=A.normalize(id,initial),tab='hair';const drafts=new Map([[id,draft]]);host.className='avatar-editor';host.innerHTML=`<button type="button" class="avatar-disclosure" aria-expanded="${expanded}">Aussehen ändern <span aria-hidden="true">✎</span></button><div class="avatar-workspace" ${expanded?'':'hidden'}><div class="avatar-stage"><div class="avatar-preview" role="img" aria-label="Vorschau deiner Figur"></div><p>So siehst du aus!</p><button type="button" class="avatar-reset">Neu anfangen</button></div><div class="avatar-controls"><div class="avatar-tabs" role="tablist" aria-label="Aussehen ändern">${[['hair','Haare'],['face','Gesicht'],['clothes','Kleidung'],['shoes','Schuhe'],['extras','Extras']].map(([key,label])=>`<button type="button" role="tab" id="avatar-tab-${key}" aria-controls="avatar-options" data-avatar-tab="${key}" aria-selected="${key===tab}" tabindex="${key===tab?0:-1}">${label}</button>`).join('')}</div><div id="avatar-options" role="tabpanel" aria-labelledby="avatar-tab-hair"></div></div></div>`;
const panel=host.querySelector('#avatar-options'),preview=host.querySelector('.avatar-preview'),workspace=host.querySelector('.avatar-workspace'),disclosure=host.querySelector('.avatar-disclosure');
function swatches(key,title,palette){return `<fieldset><legend>${title}</legend><div class="avatar-swatches">${palette.map(([v,label])=>`<button type="button" data-avatar-key="${key}" data-avatar-value="${v}" aria-label="${title}: ${label}" aria-pressed="${draft[key]===v}" style="--swatch:${v}"><span aria-hidden="true">${draft[key]===v?'✓':''}</span></button>`).join('')}</div></fieldset>`}
function tiles(key,title){return `<fieldset><legend>${title}</legend><div class="avatar-tiles">${A.choices[key].map(([v,label])=>`<button type="button" data-avatar-key="${key}" data-avatar-value="${v}" aria-pressed="${draft[key]===v}"><span class="avatar-sample ${key==='outfit'?'sample-outfit':'sample-face'}">${svg(id,{...draft,[key]:v})}</span><span>${label}</span></button>`).join('')}</div></fieldset>`}
function renderOptions(){panel.setAttribute('aria-labelledby','avatar-tab-'+tab);const human=A.human(id);panel.innerHTML=tab==='hair'?(human?tiles('hairStyle','Frisur')+swatches('hair','Haarfarbe',A.colors.hair):'<p class="avatar-hint">Pippa und Mo behalten ihren Tierkopf. Kleidung, Schminke und Accessoires kannst du frei kombinieren.</p>'):tab==='face'?(human?swatches('skin','Hautfarbe',A.colors.skin):'')+tiles('makeup','Schminke'):tab==='clothes'?tiles('outfit','Das ziehe ich an')+swatches('top','Oberteil',A.colors.fabric)+swatches('bottom','Hose oder Rock',A.colors.fabric):tab==='shoes'?swatches('shoes','Schuhfarbe',A.colors.fabric):tiles('headwear','Für den Kopf')+tiles('eyewear','Brillen')}
function update(){preview.innerHTML=svg(id,draft);drafts.set(id,{...draft});renderOptions()}
function chooseTab(key,focus=false){tab=key;host.querySelectorAll('[role="tab"]').forEach(b=>{const active=b.dataset.avatarTab===tab;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;if(active&&focus)b.focus()});renderOptions()}
host.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;if(b===disclosure){workspace.hidden=!workspace.hidden;disclosure.setAttribute('aria-expanded',!workspace.hidden)}else if(b.classList.contains('avatar-reset')){draft=A.defaults(id);update()}else if(b.dataset.avatarTab)chooseTab(b.dataset.avatarTab);else if(b.dataset.avatarKey){const key=b.dataset.avatarKey,value=b.dataset.avatarValue;draft=A.normalize(id,{...draft,[key]:value});update();const selected=[...panel.querySelectorAll('[data-avatar-key]')].find(e=>e.dataset.avatarKey===key&&e.dataset.avatarValue===value);selected?.focus({preventScroll:true})}});
host.querySelector('.avatar-tabs').addEventListener('keydown',ev=>{const tabs=[...host.querySelectorAll('[role="tab"]')],i=tabs.indexOf(ev.target);if(i<0)return;let next;if(ev.key==='ArrowRight')next=(i+1)%tabs.length;if(ev.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(ev.key==='Home')next=0;if(ev.key==='End')next=tabs.length-1;if(next!==undefined){ev.preventDefault();chooseTab(tabs[next].dataset.avatarTab,true)}});
update();return {value:()=>({...draft}),change(next){id=next;draft={...(drafts.get(id)||A.defaults(id))};update()}}}
window.LerndachsAvatarEditor={mount};
})();

;
(()=>{
const J=LerndachsJourney,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dialog=document.createElement('dialog');dialog.id='character-dialog';dialog.setAttribute('aria-labelledby','character-title');document.body.append(dialog);
let mode,chosen,personUid,callback,residentTab='people';
function open(next='add',done,who){mode=next;callback=done;personUid=who;const person=J.people().find(p=>p.uid===(who||J.profile.playerUid));chosen=next==='add'||next==='initial'?'milo':person?.id||'milo';
 document.querySelector('#panel').close();document.querySelector('#learning-dialog').close();
 dialog.innerHTML=`<div class="dialog-top"><div><h2 id="character-title">${next==='initial'?'Wer zieht hier ein?':next==='add'?'Neuer Freund':'Deine Figur'}</h2></div><button class="icon-button" id="close-character" aria-label="Schließen">×</button></div><div class="people-grid">${(next==='initial'?WorldArt.cast.slice(0,4):WorldArt.cast).map(i=>`<button data-person="${i.id}" aria-pressed="${chosen===i.id}">${J.preview(i)}<strong>${esc(i.name)}</strong></button>`).join('')}</div><div id="avatar-editor-host"></div><form id="person-form"><label class="pet-name-label">Name <input id="character-name" required maxlength="24" autocomplete="off" aria-label="Name deiner Figur"></label><button id="confirm-character" class="journey-primary wide">${next==='initial'?'Einziehen!':next==='add'?'Freund hinzufügen':'Speichern'} →</button><p class="note">${next==='initial'?'':'Deine Figur kostet keine Sterne.'}</p><p id="character-error" role="status"></p></form>`;
 dialog.querySelector('#character-name').value=next==='initial'||next==='add'?WorldArt.names[chosen]:person?.name||WorldArt.names[chosen];
 const editor=LerndachsAvatarEditor.mount(dialog.querySelector('#avatar-editor-host'),()=>chosen,(next==='initial'||next==='add')?undefined:person?.appearance,next!=='initial');
 dialog.querySelectorAll('[data-person]').forEach(b=>b.onclick=()=>{const input=dialog.querySelector('input');if(input.value===WorldArt.names[chosen])input.value=WorldArt.names[b.dataset.person];chosen=b.dataset.person;editor.change(chosen);dialog.querySelectorAll('[data-person]').forEach(btn=>btn.setAttribute('aria-pressed',btn.dataset.person===chosen))});
 dialog.querySelector('#close-character')?.addEventListener('click',()=>dialog.close());
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();if(!J.person(chosen,dialog.querySelector('input').value,mode,personUid,editor.value())){dialog.querySelector('#character-error').textContent='Bitte wähle einen Namen. In deiner Welt können bis zu 20 Figuren mitspielen.';return}dialog.close();callback?.();if(mode!=='initial')window.dispatchEvent(new CustomEvent('learning-celebration',{detail:{kind:'stars'}}))};
 dialog.showModal();
}
function renderPeople(c){c.querySelector('.card-grid')?.remove();c.querySelectorAll('.note,.wide').forEach(e=>e.remove());const body=document.createElement('div');body.innerHTML=`<div class="friends-actions"><button class="journey-primary" data-friend-mode="change">Meine Figur ändern</button><button class="journey-primary" data-friend-mode="add">+ Freund hinzufügen</button></div><div class="card-grid">${J.people().map(o=>`<article class="item-card"><div class="item-art">${J.preview(o)}</div><div class="item-body"><h3>${esc(o.name)}</h3><p>${o.player?'Das bist du':'Dein Freund'}</p><button data-person-edit="${o.uid}">Figur ändern</button><button data-person-show="${o.uid}">Ins Zimmer holen</button></div></article>`).join('')}</div><p class="note">Du entscheidest, wer mitspielt. Namen bleiben auf diesem Gerät gespeichert. Eingepackte Freunde findest du auch in deiner Tasche.</p>`;c.append(body)}
function render(c){c.innerHTML=`<div class="resident-tabs" aria-label="Figuren und Tiere"><button data-resident-tab="people" aria-pressed="${residentTab==='people'}">Figuren</button><button data-resident-tab="pets" aria-pressed="${residentTab==='pets'}">Tiere</button></div>`;if(residentTab==='people'){renderPeople(c);return}
 const owned=J.pets();const body=document.createElement('div');body.className='card-grid pet-catalogue';body.innerHTML=LerndachsWorld.pets.map(p=>{const pet=owned.find(o=>o.id===p.id);return `<article class="item-card"><div class="item-art">${J.preview(p)}</div><div class="item-body"><h3>${esc(pet?.name||p.name)}</h3><p>${esc(p.note)}</p>${pet?`<button data-pet-visit="${pet.uid}">Besuchen & spielen</button><button data-pet-bring="${pet.uid}">Ins Zimmer holen</button>`:`<button data-action="buy" data-id="${p.id}">Für ${p.price} Sterne einziehen lassen</button><button data-action="learn">Sterne sammeln</button>`}</div></article>`}).join('');c.append(body);const note=document.createElement('p');note.className='note';note.textContent='Deine Tiere bleiben auf diesem Gerät gespeichert. Mit einem Besuch holst du sie aus der Tasche oder einem anderen Zimmer zu dir.';c.append(note);
}
 document.querySelector('#panel-content').addEventListener('click',e=>{const b=e.target.closest('button');if(b?.dataset.residentTab){residentTab=b.dataset.residentTab;render(document.querySelector('#panel-content'));return}if(b?.dataset.petVisit){J.visitPet(b.dataset.petVisit);return}if(b?.dataset.petBring){const id=b.dataset.petBring;J.visitPet(id);document.querySelector('#panel').close();return}if(b?.dataset.friendMode)open(b.dataset.friendMode);if(b?.dataset.personEdit)open(J.profile.playerUid===b.dataset.personEdit?'change':'edit',null,b.dataset.personEdit);if(b?.dataset.personShow)J.showPerson(b.dataset.personShow)});
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
const badger=`<svg viewBox="-76 -139 152 145" aria-hidden="true">${WorldArt.badger('portrait')}</svg>`;
for(const selector of ['.badger-icon','.brand-badger'])document.querySelector(selector).innerHTML=badger;
const {paths,sources}=LerndachsCurriculum,grades=LerndachsGrades,J=LerndachsJourney,progress=J.profile;
const dialog=document.querySelector('#learning-dialog'),content=document.querySelector('#learning-content'),strip=document.querySelector('#quest-strip');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let mode='world',correct=false,pendingGrade=progress.grade,afterGrade,sampleTimer,memoryTimer,memoryCards=[],memoryOpen=[],memoryBusy=false,gardenCount=0,worldAttemptDone=false;
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
 const b=document.querySelector('#adventure-button');b.querySelector('small').textContent='';
 b.querySelector('strong').textContent='Sterne sammeln';b.querySelector('em').textContent='Ein Rätsel mit Dachs';
}
window.addEventListener('world-saved',updateHUD);
function chooseGrade(next){
 cleanup();mode='grades';afterGrade=next;pendingGrade=progress.grade;document.querySelector('#panel').close();
 content.innerHTML=`<div class="class-intro"><div class="guide-face">${badger}</div><h2 id="learn-title">In welche Klasse gehst du?</h2><div class="class-grid" role="group" aria-label="Klasse auswählen">${Object.entries(grades).map(([id,g])=>`<button data-grade="${id}" aria-pressed="${pendingGrade===Number(id)}"><span>${id==='0'?'✿':id}</span><strong>${g.label}</strong></button>`).join('')}</div><button id="confirm-grade" class="journey-primary" ${pendingGrade===null?'disabled':''}>Los geht’s!</button></div>`;
 document.querySelector('#learn-close').hidden=false;reveal();
}
function starter(){window.dispatchEvent(new Event('request-opening'))}

function targetCard(){const i=J.catalogue.find(i=>i.id===progress.target);if(!i)return '';const balance=Lernwelt.snapshot().balance,remaining=Math.max(0,i.price-balance);return `<div class="target-card"><div class="target-art">${J.preview(i,WorldArt.homes.some(h=>h.id===i.id))}</div><div><small>DEIN NÄCHSTES ZIEL</small><strong>${escape(i.name)}</strong><span>${balance} / ${i.price} Sterne · ${remaining?`noch ${Math.ceil(remaining/15)} neue Aufgaben`:'Du hast genug Sterne!'}</span><progress max="${i.price||1}" value="${Math.min(balance,i.price)}" aria-label="Sterne für dein Sparziel"></progress></div><button id="target-shop">${remaining?'Laden':'Holen'} →</button></div>`}
function open(){if(!progress.starterUnlocked||progress.opening!=='done'){starter();return}if(progress.grade===null){chooseGrade(()=>Learning.nextFresh(true));return}cleanup();document.querySelector('#panel').close();mode='menu';menu();reveal()}
const partnerInvitation='Komm, wir sammeln Sterne!';
function readPartnerInvitation(){
 speechSynthesis.cancel();const speech=new SpeechSynthesisUtterance(partnerInvitation+' Was möchtest du spielen?');speech.lang='de-DE';speech.rate=.85;speechSynthesis.speak(speech);
}
function invite(){
 if(!progress.starterUnlocked){starter();return}
 cleanup();document.querySelector('#panel').close();mode='menu';document.querySelector('#learn-close').hidden=false;
 const labels={numbers:'Rechnen',words:'Lesen',nature:'Natur',music:'Musik',art:'Farben',media:'Medien'};
 content.innerHTML=`<div class="learn-intro partner-intro"><div class="guide-face">${badger}</div><h2 id="learn-title">${partnerInvitation}</h2><p>Was möchtest du spielen?</p>${'speechSynthesis'in window?`<button id="read-partner" class="task-icon" aria-label="Vorlesen">${icon('sound')}</button>`:''}</div><div class="path-grid partner-paths">${paths.map(p=>`<button class="learning-path ${p.color}" data-path="${p.id}"><span class="path-symbol" aria-hidden="true">${p.icon}</span><strong>${labels[p.id]}</strong></button>`).join('')}</div>`;
 reveal();if('speechSynthesis'in window&&WorldSound.status.enabled)readPartnerInvitation();
}

function menu(){
 cleanup();mode='menu';document.querySelector('#learn-close').hidden=false;
 const eligible=paths.flatMap(tasksFor),n=eligible.filter(finished).length;
 content.innerHTML=`<div class="learn-intro"><div class="guide-face">${badger}</div><h2 id="learn-title">Was möchtest du spielen?</h2><p>Für jedes neue Rätsel gibt’s 15 Sterne.</p><div class="discovery-count">${n} / ${eligible.length} Aufgaben für ${grades[progress.grade].label} entdeckt</div></div>${targetCard()}<div class="journey-options"><button id="together-toggle" aria-pressed="${progress.together}">${progress.together?'✓ Wir spielen zu zweit':'♡ Gemeinsam spielen'}</button></div>${progress.together?'<p class="together-note">Ein Gerät, zwei Ideen: Eine Person spielt, die andere erklärt oder hilft. Nach einer neuen gelösten Aufgabe tauscht ihr die Rollen.</p>':''}<div class="path-grid">${paths.map(p=>{
 const tasks=tasksFor(p),count=tasks.filter(finished).length;return `<button class="learning-path ${p.color}" data-path="${p.id}"><span class="path-symbol">${p.icon}</span><strong>${({numbers:"Rechnen",words:"Lesen",nature:"Natur",music:"Musik",art:"Farben",media:"Medien"})[p.id]||p.title}</strong><span>${({numbers:"Zählen und rechnen.",words:"Wörter lesen und schreiben.",nature:"Tiere und Natur entdecken.",music:"Hören und Musik machen.",art:"Farben und Formen entdecken.",media:"Mit Handy und Computer sicher umgehen."})[p.id]||p.desc}</span><div class="path-dots">${Array.from({length:tasks.length},(_,i)=>`<i class="${i<count?'done':''}"></i>`).join('')}<b>${count}/${tasks.length}</b></div><em>${count===tasks.length?'Noch mal entdecken ↗':'Los geht’s →'}</em></button>`;
 }).join('')}</div><button id="start-practice" class="practice-button">Neue Rechenaufgabe</button><div class="badge-row">${[[1,'Erster Schritt'],[5,'Ideensammler'],[20,'Weltgestalter'],[50,'Entdeckerprofi']].map(([count,title])=>`<span class="${progress.done.length>=count?'earned':''}">${progress.done.length>=count?'✦':'◇'} ${title}</span>`).join('')}</div><p class="learning-footnote">Du darfst dir Zeit lassen und Hilfe holen.</p><button id="curriculum-info" class="curriculum-link">Für Erwachsene: Lernziele & Spielkonzept ↗</button>`;
}
function begin(id){if(progress.grade===null){chooseGrade(()=>begin(id));return}if(progress.opening!=='done'){progress.opening='done';window.dispatchEvent(new Event('opening-changed'))}progress.active=id;const tasks=currentTasks(),index=tasks.findIndex(q=>!finished(q));progress.index=index<0?0:index;progress.worldMoves=[];worldAttemptDone=false;persist();question()}
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
function taskText(q,text){return q[7].goal==='carry'?text.replaceAll('Milo',J.player()?.characterName||WorldArt.names[J.player()?.id]||'deine Figur'):text}
function commonQuestion(q){const meta=q[7],visual=q[6].length<=32&&!/[a-zäöüß]/.test(q[6]);return `<div class="task-copy"><h2 id="learn-title">${escape(taskText(q,q[1]))}</h2><p class="task-description">${escape(taskText(q,q[2]))}</p></div><div class="task-tools"><button id="read-question" class="task-icon" aria-label="Aufgabe vorlesen" title="Vorlesen">${icon('sound')}</button><button id="task-hint" class="task-icon" aria-label="Tipp anzeigen" title="Tipp anzeigen" aria-expanded="false">💡</button>${meta.audio?'<button id="play-sample" class="sample-button">▶ Anhören</button>':''}</div>${visual&&meta.type==='choice'?`<div class="task-visual" aria-hidden="true">${escape(q[6])}</div>`:''}<div id="task-hint-text" class="task-hint" hidden>${escape(meta.hint)}</div>`}
function footer(){return '<div id="answer-feedback" role="status" aria-live="polite"></div><div class="question-actions"><button id="question-back">← Zur Welt</button><button id="skip-question">Später</button><button id="reward-shop" hidden>Einrichten</button><button id="next-question" hidden>Weiter →</button></div>'}
function question(){
 const q=currentTask();if(!q)return;document.querySelector('#panel').close();cleanup();mode='question';correct=false;worldAttemptDone=false;window.LerndachsEvidence?.start(q,progress.active);document.querySelector('#learn-close').hidden=false;
 let interaction='';
 if(q[7].type==='world')interaction='<div class="world-task-actions"><button id="enter-world-task" class="journey-primary">In meiner Welt ausprobieren →</button></div>';
 else if(q[7].type==='garden'){gardenCount=0;interaction='<div class="garden-game"><p id="garden-order" hidden></p><div id="garden-bed" aria-label="Dein bepflanztes Beet"></div><div class="garden-controls"><button id="garden-remove" aria-label="Einen Samen herausnehmen">−</button><span id="garden-count" aria-live="polite">0 Samen</span><button id="garden-add" aria-label="Einen Samen pflanzen">+ Samen</button></div><button id="check-garden" class="journey-primary">Mein Beet prüfen →</button></div>'}
 else if(q[7].type==='memory')interaction='<div class="memory-game"><p id="memory-rule" hidden></p><div id="memory-grid"></div><p id="memory-count" aria-live="polite"></p></div>';
 else interaction=`<div class="answer-grid">${q[3].map((a,i)=>`<button data-answer="${i}"><b>${String.fromCharCode(65+i)}</b>${escape(a)}</button>`).join('')}</div>`;
 content.innerHTML=commonQuestion(q)+interaction+footer();
 if(q[7].type==='garden')renderGarden();if(q[7].type==='memory')startMemory();
 if(!('speechSynthesis' in window))document.querySelector('#read-question').hidden=true;reveal();
}
function success(q){
 if(correct)return;correct=true;stopSample();window.LerndachsEvidence?.finish(q);window.dispatchEvent(new Event('learning-celebration'));const already=finished(q);J.reward(taskKey(q));if(!already)window.dispatchEvent(new Event('character-celebrate'));
 const feedback=document.querySelector('#answer-feedback');feedback.classList.add('correct-feedback');feedback.textContent=already?'Geschafft!':'Geschafft! +15 Sterne';
 const target=J.catalogue.find(i=>i.id===progress.target);
 document.querySelector('#reward-shop').hidden=!target||Lernwelt.snapshot().balance<target.price;
 document.querySelector('#next-question').hidden=false;document.querySelector('#skip-question').hidden=true;content.querySelectorAll('[data-answer],#check-garden,#enter-world-task').forEach(b=>b.disabled=true);WorldSound.effect('reward');
 for(const [n,name] of [[1,'Erster Schritt'],[5,'Ideensammler'],[20,'Weltgestalter'],[50,'Entdeckerprofi']])if(progress.done.length>=n&&!progress.badges.includes(name))progress.badges.push(name);persist();window.dispatchEvent(new CustomEvent('learning-success',{detail:{subject:active()?.subject||'math'}}));
}
function answer(i){if(correct)return;const q=currentTask(),button=content.querySelector(`[data-answer="${i}"]`);if(i!==q[4]){window.LerndachsEvidence?.mistake();button.classList.add('try-again');button.disabled=true;document.querySelector('#answer-feedback').textContent='Versuch es noch einmal.';WorldSound.effect('tea');return}button.classList.add('is-correct');success(q)}
function gardenTarget(){return [3,5,8,12,18][progress.grade]}
function renderGarden(){
 const orders=['Pflanze 3 Samen.','Pflanze 5 Samen.','Pflanze zuerst 5 Samen und dann noch 3.','Lege 3 Reihen mit je 4 Samen.','Lege 4 Reihen mit je 4 Samen und dann noch 2 Samen.'];
 document.querySelector('#garden-order').textContent=orders[progress.grade];document.querySelector('.task-description').textContent=orders[progress.grade];
 document.querySelector('#garden-bed').innerHTML=Array.from({length:Math.max(4,gardenCount)},(_,i)=>`<span class="${i<gardenCount?'planted':''}">${i<gardenCount?'🌱':'·'}</span>`).join('');document.querySelector('#garden-count').textContent=gardenCount+' Samen';document.querySelector('#garden-remove').disabled=gardenCount===0;
}
function startMemory(){
 const iconPairs=[['🐱','🐱'],['☀','☀'],['🌳','🌳']],wordPairs=[['🐱','Katze'],['☀','Sonne'],['🌳','Baum'],['☕','Tasse']];
 const pairs=progress.grade===0?iconPairs:progress.grade===1?wordPairs.slice(0,3):progress.grade===2?wordPairs:progress.grade===3?[['schnell','flink'],['leise','still'],['groß','riesig'],['klein','winzig']]:[['hell','dunkel'],['warm','kalt'],['laut','leise'],['groß','klein']];
 memoryCards=pairs.flatMap((pair,g)=>pair.map(text=>({text,group:g,matched:false,open:false}))).sort(()=>Math.random()-.5);memoryOpen=[];memoryBusy=false;
 document.querySelector('#memory-rule').textContent=progress.grade===0?'Finde gleiche Bilder.':progress.grade<3?'Finde Bild und passendes Wort.':progress.grade===3?'Finde Wörter mit ähnlicher Bedeutung.':'Finde Wörter mit gegenteiliger Bedeutung.';document.querySelector('.task-description').textContent=document.querySelector('#memory-rule').textContent;renderMemory();
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
 content.innerHTML=`<div class="learn-finish"><div class="guide-face">${badger}</div><h2 id="learn-title">${p.title}: ${complete?'geschafft!':'Runde beendet!'}</h2><p>${n} / ${tasks.length} Aufgaben für ${grades[progress.grade].label} entdeckt.</p><div class="finish-stars">✦ ✦ ✦</div><p>${progress.together?'Erzählt euch: Was habt ihr heute herausgefunden?':'Was war deine schönste Entdeckung? Erzähle sie jemandem.'}</p><button id="finish-shop">Einrichten</button><button id="finish-menu">${complete?'Ein neues Abenteuer':'Offene Aufgaben entdecken'}</button></div>`;progress.active=null;persist();resetStrip();mode='finish';dialog.scrollTop=0;
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
 cleanup();mode='source';content.innerHTML=`<div class="curriculum-info"><h2 id="learn-title">Lernen mit Lerndachs</h2><p>Die Klassenauswahl filtert die Aufgaben. Vorschule und Klasse 1 nutzen kleine Mengen, erste Wörter und alltägliches Entdecken. Klasse 2 erweitert Rechnen und Lesen. Für Klasse 3 und 4 kommen größere Zahlen, Textverständnis und begründete Zusammenhänge hinzu. Dies ist eine Auswahl aus den bereitgestellten Lehrplänen, keine vollständige Abdeckung und keine automatische Diagnose.</p><p>Kinder erkunden zuerst das eingerichtete Zimmer. Beim Einzug bekommen sie 35 Sterne für ihren ersten Einkauf. Neue Lösungen bringen je 15 Sterne. Der kleine Laden bietet zunächst drei Dinge. Tipps und neue Versuche sind erlaubt. Bereits gelöste Rätsel bringen keine weiteren Sterne.</p><p>Mitmachaufgaben, ein Mengenbeet, Wörter-Memory und freies Einrichten ergänzen die Wissensfragen. Im lokalen Partner-Modus wechseln zwei Personen am selben Gerät die Rollen Spielen und Erklären. Das ersetzt keine echte Lerngruppe.</p>${paths.map(p=>{const s=sources[p.subject];return `<details><summary>${s.title}</summary><p>${escape(s.file)} · Fassung ${s.edition}<br>${escape(s.sections)}<br>Die Aufgaben führen ihre Lernziele und PDF-Seiten im Aufgabenkatalog mit.</p></details>`}).join('')}<p class="source-note">Alle Aufgaben sind eigene Formulierungen. Die PDFs bleiben lokal. Alte Prototyp-Spielstände unter den bisherigen Speicherschlüsseln werden nicht überschrieben. Die neue Lernreise nutzt einen getrennten Spielstand.</p><button id="finish-menu" class="sample-button">← Zu den Abenteuern</button></div>`;dialog.scrollTop=0;
}
content.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.grade!==undefined){pendingGrade=Number(b.dataset.grade);content.querySelectorAll('[data-grade]').forEach(btn=>btn.setAttribute('aria-pressed',Number(btn.dataset.grade)===pendingGrade));document.querySelector('#confirm-grade').disabled=false}
 else if(b.id==='confirm-grade'){if(pendingGrade===null)return;if(progress.grade!==pendingGrade){progress.active=null;progress.index=0;resetStrip()}progress.grade=pendingGrade;const next=afterGrade;afterGrade=null;persist();close();next?.()}
 else if(b.dataset.path)begin(b.dataset.path);
 else if(b.dataset.answer!==undefined)answer(Number(b.dataset.answer));
 else if(b.dataset.memory!==undefined)memoryFlip(Number(b.dataset.memory));
 else if(b.id==='together-toggle'){progress.together=!progress.together;persist();menu()}
 else if(b.id==='target-shop'||b.id==='finish-shop'||b.id==='reward-shop'){close();J.showShop()}
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
 else if(b.id==='read-partner')readPartnerInvitation();
 else if(b.id==='read-question'){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const q=currentTask(),u=new SpeechSynthesisUtterance(taskText(q,q[2])+'. '+q[3].join('. '));u.lang='de-DE';u.rate=.85;speechSynthesis.speak(u)}
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
dialog.addEventListener('close',cleanup);
window.addEventListener('request-grade-settings',()=>chooseGrade());
document.querySelector('#adventure-button').onclick=()=>{progress.taskWaiting=false;persist();invite()};document.querySelector('#learn-button').onclick=open;
window.addEventListener('request-starter',starter);window.addEventListener('request-learning',open);window.addEventListener('request-partner-learning',invite);
window.Learning={get progress(){return structuredClone(progress)},get currentTask(){return currentTask()},get currentTasks(){return currentTasks()},paths,sources,grades,openSubject(subject){const p=paths.find(p=>p.subject===subject);if(!progress.starterUnlocked||progress.opening!=='done'){starter();return}if(p){if(progress.grade===null)chooseGrade(()=>begin(p.id));else begin(p.id)}},nextFresh(manual=false){if(!progress.starterUnlocked||progress.opening!=='done'){starter();return}if(progress.grade===null){chooseGrade(()=>Learning.nextFresh(manual));return}const candidates=paths.flatMap(p=>tasksFor(p).filter(q=>!finished(q)).map(q=>({p,q})));if(!candidates.length){newPractice();return}const hit=candidates[(progress.promptNumber||0)%candidates.length];progress.promptNumber=(progress.promptNumber||0)+1;progress.active=hit.p.id;progress.index=tasksFor(hit.p).indexOf(hit.q);progress.worldMoves=[];persist();question();if(manual)return;const note=document.createElement('p');note.className='timed-discovery-note';note.textContent='Zehn Minuten gespielt – eine neue Entdeckung wartet!';content.prepend(note)}};
if(!Number.isInteger(progress.grade)||!grades[progress.grade]){progress.grade=null;progress.active=null}
updateHUD();if(progress.starterUnlocked&&progress.active)seek();
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
 body.innerHTML=`<div class="schedule-heading"><h2 id="schedule-title">Mein Stundenplan</h2><p>${s.demo?'Das ist ein Beispielplan. Ersetze die Fächer und Zeiten durch deinen eigenen Plan.':s.basedOnDemo?'Dein angepasster Beispielplan. Prüfe auch die anderen Fächer und Zeiten.':'Dein eigener Plan. Tippe auf ein Fach oder eine Uhrzeit, um es zu ändern.'}</p></div><div class="schedule-day-tabs" role="group" aria-label="Wochentag anzeigen">${days.map((d,i)=>`<button data-schedule-day="${i}" aria-pressed="${i===day}" aria-label="${d}">${shortDays[i]}</button>`).join('')}</div><div class="schedule-table" role="table" aria-label="Wochenstundenplan"><div class="schedule-row schedule-header" role="row"><span role="columnheader">Zeit</span>${days.map((d,i)=>`<span role="columnheader" class="schedule-day-${i} ${day===i?'selected-day':''}">${d}</span>`).join('')}</div>${s.rows.map((row,r)=>`<div class="schedule-row" role="row"><button class="lesson-time" data-edit-time="${r}" aria-label="Zeit von Zeile ${r+1} ändern"><b>${r+1}</b><span>${escape(row.start)}<br>${escape(row.end)}</span><small>✎</small></button>${row.slots.map((name,c)=>{const [_,icon,color]=subjectInfo(name);return `<div role="cell" class="schedule-day-${c} ${day===c?'selected-day':''}"><button class="lesson-cell ${color} ${name?'':'empty-lesson'}" data-edit-slot="${r},${c}" aria-label="${days[c]}, Zeile ${r+1}: ${escape(name||'Fach eintragen')}"><span aria-hidden="true">${name?icon:'+'}</span><strong>${escape(name||'Fach eintragen')}</strong><small>✎</small></button></div>`}).join('')}</div>`).join('')}</div><div class="schedule-actions"><button id="add-lesson">+ Stunde ergänzen</button><button id="blank-schedule">Leeren Plan beginnen</button><button id="demo-schedule">Beispielplan laden</button>${undoPlan?'<button id="undo-schedule">↶ Rückgängig</button>':''}</div><p id="schedule-status" role="status" aria-live="polite">${s.demo?'Beispieldaten · kein echter Schulstundenplan':'Dein Plan wird auf diesem Gerät gespeichert.'}</p><div id="schedule-editor" hidden></div>`;
}
function editSlot(r,c){
 editing={kind:'slot',r,c};const name=plan().rows[r].slots[c],editor=document.querySelector('#schedule-editor');editor.hidden=false;
 editor.innerHTML=`<div class="schedule-edit-top"><div><h3>${days[c]}: ${r+1}. Stunde</h3></div><button id="close-schedule-editor" aria-label="Bearbeitung schließen">×</button></div><div class="subject-palette">${subjects.map(([label,icon,color])=>`<button data-subject="${escape(label)}" class="${color}"><span>${icon}</span>${escape(label)}</button>`).join('')}</div><label class="schedule-custom-label">Eigenes Fach<input id="custom-subject" maxlength="40" placeholder="z. B. Klassenrat" value="${escape(name)}"></label><div class="schedule-edit-actions"><button id="save-subject" class="journey-primary">Fach übernehmen</button><button id="clear-subject">Feld leeren</button></div>`;
 editor.scrollIntoView({behavior:'auto',block:'nearest'});editor.querySelector('[data-subject]')?.focus({preventScroll:true});
}
function editTime(r){
 editing={kind:'time',r};const row=plan().rows[r],editor=document.querySelector('#schedule-editor');editor.hidden=false;
 editor.innerHTML=`<div class="schedule-edit-top"><div><h3>Zeiten für die ${r+1}. Stunde</h3></div><button id="close-schedule-editor" aria-label="Bearbeitung schließen">×</button></div><div class="time-inputs"><label>Beginn<input id="lesson-start" type="time" value="${row.start}" required></label><label>Ende<input id="lesson-end" type="time" value="${row.end}" required></label></div><div class="schedule-edit-actions"><button id="save-lesson-time" class="journey-primary">Zeit übernehmen</button><button id="remove-lesson">Diese Zeile entfernen</button></div><p id="time-error" role="alert"></p>`;
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
document.querySelector('#schedule-close').onclick=()=>dialog.close();
// A fixed hanging timetable is the entry point, not a dock tool.
const board=document.createElementNS('http://www.w3.org/2000/svg','g');board.id='wall-schedule';board.setAttribute('transform','translate(1380 220)');board.setAttribute('role','button');board.setAttribute('tabindex','0');board.setAttribute('aria-label','Stundenplan an der Wand öffnen');
board.innerHTML=`<title>Mein Stundenplan</title><path d="M-65-61 0-101 65-61" fill="none" stroke="#363c48" stroke-width="3"/><circle cy="-101" r="4" fill="#f6cc72" stroke="#363c48" stroke-width="2"/><rect x="-94" y="-65" width="188" height="139" rx="10" fill="#b4a4d3" stroke="#363c48" stroke-width="4"/><rect x="-85" y="-56" width="170" height="121" rx="6" fill="#fff3d7" stroke="#363c48" stroke-width="2"/><text y="-30" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#363c48">STUNDENPLAN</text>${['Mo','Di','Mi','Do','Fr'].map((day,i)=>`<g transform="translate(${-68+i*34} -12)"><text text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#363c48">${day}</text>${['#79c5ad','#f29880','#f6cc72'].map((color,j)=>`<rect x="-12" y="${7+j*18}" width="24" height="13" rx="3" fill="${color}" stroke="#363c48" stroke-width="1"/>`).join('')}</g>`).join('')}`;
document.querySelector('#world').append(board);for(const type of ['pointerdown','pointerup'])board.addEventListener(type,e=>e.stopPropagation());board.addEventListener('click',open);board.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
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
/* Only the pupils follow the pointer; world positions and body transforms are untouched. */
(()=>{
'use strict';
let pointer=null,frame=0;
function paint(){frame=0;const pause=document.hidden||document.body.classList.contains('no-motion');
 for(const pupils of document.querySelectorAll('.character-pupils')){
  if(!pointer||pause){pupils.removeAttribute('transform');continue}
  const parent=pupils.parentElement,matrix=parent.getScreenCTM?.();if(!matrix)continue;
  try{const local=new DOMPoint(pointer.x,pointer.y).matrixTransform(matrix.inverse()),box=pupils.getBBox();
   const dx=local.x-(box.x+box.width/2),dy=local.y-(box.y+box.height/2),distance=Math.hypot(dx,dy),strength=Math.min(1,distance/100);
   const x=distance?dx/distance*(pupils.classList.contains('pet-pupils')?2:4.8)*strength:0,y=distance?dy/distance*(pupils.classList.contains('pet-pupils')?2:4.6)*strength:0;
   pupils.setAttribute('transform',`translate(${x.toFixed(3)} ${y.toFixed(3)})`);
  }catch{pupils.removeAttribute('transform')}
 }
}
function schedule(){if(!frame)frame=requestAnimationFrame(paint)}
function follow(e){if(e.pointerType==='touch'&&e.type==='pointermove')return;pointer={x:e.clientX,y:e.clientY};schedule()}
window.addEventListener('pointermove',follow,{passive:true});window.addEventListener('pointerdown',follow,{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{pointer=null;schedule()});window.addEventListener('blur',()=>{pointer=null;schedule()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pointer=null;schedule()});
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
window.LerndachsCharacters=Object.freeze({sync:schedule});
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
function settings(){const g=Learning.grades[J.profile.grade];content.innerHTML=`<div class="adult-heading"><h2 id="adult-title">Einstellungen</h2><p>Die Klasse bleibt auf diesem Gerät gespeichert. Hier kannst du sie ändern.</p></div><div class="settings-card"><span class="adult-symbol">▦</span><div><h3>${g?.label||'Noch keine Klasse gewählt'}</h3><p>Passende Aufgaben für deinen Lernweg.</p></div><button id="settings-grade">Klasse ändern →</button></div><div class="adult-entry-grid"><button data-adult="parents"><span>♡</span><strong>Für Eltern</strong><small>Lernwege, Fächer und Medienkompetenz im Blick.</small></button><button data-adult="teachers"><span>✎</span><strong>Für Lehrkräfte</strong><small>Aufgaben auswählen und als PDF mitnehmen.</small></button></div><div class="settings-tools"><button id="settings-help">Hilfe zum Spiel</button><button data-install-app>App installieren</button></div><a id="settings-impressum" class="settings-legal" href="impressum.html" target="_blank" rel="noopener">Impressum</a><p class="adult-note">Ein gemeinsamer Lernstand pro Browser. Die Bereiche sind keine getrennten Konten und haben keinen Passwortschutz. Alle Lernbeobachtungen bleiben auf diesem Gerät.</p>`}
function metric(s){return `<span class="level-tag">${s.stage}</span><div class="level-track" aria-label="Lerndachs-Stufe ${s.stage}">${['Entdecken','Üben','Anwenden'].map((x,i)=>`<i class="${['Entdecken','Üben','Anwenden'].indexOf(s.stage)>=i?'lit':''}"></i>`).join('')}</div>`}
function parents(){
 const g=Learning.grades[J.profile.grade],all=subjects().map(x=>({...x,...E.summary(x.id)})),observed=all.reduce((n,s)=>n+s.observed,0),known=all.reduce((n,s)=>n+s.known,0),range=['A als Einstieg','A bis B','B','B bis C','C'][J.profile.grade]||'noch offen';
 const recent=J.profile.evidence.filter(e=>e.grade===J.profile.grade).slice(-6).reverse();
 content.innerHTML=`<div class="adult-heading"><h2 id="adult-title">Für Eltern</h2><p>Ein Blick auf den Lernweg Ihres Kindes – aus den Aufgaben und Versuchen in dieser App.</p></div><div class="parent-stats"><article><strong>${known}</strong><span>Katalogaufgaben gelöst</span></article><article><strong>${observed}</strong><span>mit Detailbeobachtung</span></article><article><strong>${J.profile.evidence.filter(e=>e.grade===J.profile.grade&&!e.errors&&!e.hints).length}</strong><span>ohne Fehlversuch oder Tipp</span></article></div><section class="level-explainer"><h3>Orientierungsrahmen: ${range}</h3><p>Die Klassenwahl bestimmt die Aufgaben. Die Angabe A–C beschreibt nur den groben curricularen Bezug unserer Auswahl; sie ist keine gemessene Niveaustufe Ihres Kindes. Deutsch, Mathematik und die weiteren Fächer haben eigene Anforderungen.</p><p><b>Der Lerndachs-Lernweg:</b> Noch offen = keine Detaildaten. Entdecken = 1–2 verschiedene Lösungen. Üben = ab 3 Lösungen. Anwenden = mindestens 6 Lösungen, davon 80 % ohne Fehlversuch oder Tipp, aus mindestens 3 Lernzielen. Das sind appinterne Hinweise, keine Schulnoten.</p></section><div class="subject-grid">${all.map(s=>`<article class="subject-card"><h3>${s.label}</h3><p>${s.known} / ${s.total} Aufgaben gelöst</p>${metric(s)}<p>${s.observed?`${s.independent} von ${s.observed} beobachteten Lösungen ohne Fehlversuch oder Tipp. ${s.retries} mit erneutem Versuch, ${s.hints} mit Tipp.`:'Noch keine Detailbeobachtungen. Beginnen Sie mit einer gemeinsamen Aufgabe.'}</p>${s.legacy?`<small>${s.legacy} frühere Lösungen ohne Versuchsdaten.</small>`:''}<button data-parent-practice="${s.id}">Gemeinsam entdecken →</button></article>`).join('')}</div><section class="media-report"><h3>Medien sicher nutzen</h3><p>Die Alltagsszenarien orientieren sich an den sechs <a href="${LerndachsMedia.source}" target="_blank" rel="noopener">Kompetenzbereichen der KMK</a>. Richtige Antworten zeigen Wissen in der App; praktische Fertigkeiten im Alltag müssen gemeinsam beobachtet werden.</p><div class="media-grid">${LerndachsMedia.dimensions.map(([id,label])=>{const s=E.summary('media',id);return `<article><strong>${label}</strong><span>${s.known}/${s.total} Szenarien gelöst</span><small>${s.observed?`${s.independent}/${s.observed} ohne Fehlversuch oder Tipp`:'Noch keine Beobachtung'}</small><p>${s.known?'Fragen Sie nach einem Beispiel aus dem Alltag.':'Probieren Sie ein Szenario gemeinsam aus.'}</p></article>`}).join('')}</div></section><section><h3>Zuletzt entdeckt</h3>${recent.length?`<ul class="recent-learning">${recent.map(e=>`<li><span>${esc(e.skill)}</span><small>${new Date(e.at).toLocaleDateString('de-DE')} · ${e.errors?'mit neuem Versuch':e.hints?'mit Tipp':'ohne Fehlversuch oder Tipp'}</small></li>`).join('')}</ul>`:'<p>Neue Lösungen erscheinen hier mit Datum. Frühere Antworten bleiben als Katalogfortschritt erhalten.</p>'}</section><p class="adult-note">Keine standardisierte Diagnostik. Vorlesefunktion, Hilfe außerhalb der App und Zusammenarbeit werden nicht vollständig erfasst. Lernstand dieses Browsers; mehrere Kinder am selben Gerät teilen sich diese Daten.</p>`;
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
function render(node){host=node;pick();host.innerHTML=`<div class="adult-heading"><h2 id="adult-title">Arbeitsblatt erstellen</h2><p>Aus dem Lerndachs-Aufgabenkatalog: nach Klasse und Fach auswählen, Vorschau prüfen und ein fertiges PDF herunterladen.</p></div><form id="worksheet-form" class="worksheet-form"><label>Klasse<select id="worksheet-grade">${Object.entries(Learning.grades).map(([id,g])=>`<option value="${id}" ${Number(id)===config.grade?'selected':''}>${g.label}</option>`).join('')}</select></label><label>Fach<select id="worksheet-subject"><option value="all">Bunte Mischung</option>${A.subjects().map(s=>`<option value="${s.id}" ${s.id===config.subject?'selected':''}>${s.label}</option>`).join('')}</select></label><label>Aufgaben<select id="worksheet-count">${[3,6,9,12].map(n=>`<option ${n===config.count?'selected':''}>${n}</option>`).join('')}</select></label><label class="worksheet-title-field">Titel<input id="worksheet-title" value="${esc(config.title)}" maxlength="70"></label><label class="worksheet-check"><input id="worksheet-solutions" type="checkbox" ${config.solutions?'checked':''}> Lösungsseiten für die Lehrkraft anhängen</label></form><div class="worksheet-actions"><button id="worksheet-shuffle">Auswahl neu mischen ↻</button><button id="worksheet-download" class="journey-primary">PDF herunterladen ↓</button></div><p id="worksheet-status" role="status"></p><div id="worksheet-preview"></div><p class="adult-note">Es werden eigene Multiple-Choice-Aufgaben ohne Hörproben verwendet. Platz für Kreuze und einen eigenen Lösungsweg ist enthalten. Der PDF-Download funktioniert nach dem ersten Laden auch offline. Die Auswahl hier ändert die Klasse des Kindes nicht.</p>`;preview();
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
 if(document.hidden||!p.starterUnlocked||p.grade===null||p.opening!=='done')return;
 const busy=!!document.querySelector('dialog[open]')||document.body.classList.contains('is-dragging');
 if(!busy)p.playSincePrompt=Math.min(interval,p.playSincePrompt+elapsed);
 if(p.playSincePrompt>=interval&&!busy){p.playSincePrompt=0;p.taskWaiting=true;save();window.dispatchEvent(new Event('task-waiting'))}
 else if(now-lastSave>30000)save();
}
document.addEventListener('visibilitychange',()=>{last=performance.now();save()});window.addEventListener('pagehide',save);setInterval(tick,1000);
let confettiTimer,confettiEngine,celebrationNumber=0;
const celebrationKinds=['confetti','stars','bubbles'];
function celebrate(event){
 confettiEngine?.destroy();confettiEngine=null;document.querySelector('#learning-confetti')?.remove();clearTimeout(confettiTimer);
 const kind=event.detail?.kind||'confetti';
 if(kind==='confetti'&&window.confetti&&!matchMedia('(prefers-reduced-motion:reduce)').matches&&!document.body.classList.contains('no-motion')){
 const layer=document.createElement('div');layer.id='learning-confetti';layer.className='confetti-canvas-layer';(document.querySelector('dialog[open]')||document.body).append(layer);
 const canvasHost=document.createElement('div');canvasHost.id='confetti-burst-'+(++celebrationNumber);layer.append(canvasHost);
 window.confetti(canvasHost.id,{count:130,spread:95,startVelocity:48,gravity:1.05,decay:.92,scalar:1.1,ticks:220,origin:{x:.5,y:.65},colors:['#4fbaa8','#ffc958','#edb9cf','#f28c72','#ac9bd4'],disableForReducedMotion:true}).then(engine=>{if(layer.isConnected)confettiEngine=engine;else engine?.destroy()});confettiTimer=setTimeout(()=>{confettiEngine?.destroy();confettiEngine=null;layer.remove()},5000);return;
 }
 const layer=document.createElement('div');layer.id='learning-confetti';layer.className='celebration celebration-'+kind;layer.setAttribute('aria-hidden','true');
 const quiet=matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.classList.contains('no-motion');
 layer.classList.toggle('quiet-celebration',quiet);
 const count=quiet?12:kind==='confetti'?72:kind==='stars'?36:24;
 for(let i=0;i<count;i++){
  const particle=document.createElement('i'),shape=document.createElement('b'),angle=Math.random()*Math.PI*2,side=i%2?1:-1;
  const x=quiet?15+Math.random()*70:kind==='confetti'?(side===1?4:96):kind==='stars'?50:10+Math.random()*80;
  const y=quiet?20+Math.random()*50:kind==='confetti'?88:kind==='stars'?48:95;
  const dx=kind==='confetti'?side*(15+Math.random()*35):kind==='stars'?Math.cos(angle)*(10+Math.random()*28):(Math.random()-.5)*24;
  const dy=kind==='confetti'?-(45+Math.random()*35):kind==='stars'?Math.sin(angle)*(12+Math.random()*28):-80;
  particle.className='celebration-particle';shape.className='celebration-shape';
  particle.style.cssText=`--x:${x}%;--y:${y}%;--dx:${dx}vw;--dy:${dy}vh;--spin:${(Math.random()-.5)*1080}deg;--delay:${Math.random()*.3}s;--duration:${1.8+Math.random()*1.2}s;--size:${kind==='bubbles'?18+Math.random()*24:7+Math.random()*12}px;--color:${['#4fbaa8','#ffc958','#edb9cf','#f28c72','#ac9bd4'][i%5]}`;
  particle.append(shape);layer.append(particle);
 }
 const dialog=[...document.querySelectorAll('dialog[open]')].at(-1);(dialog||document.body).append(layer);
 confettiTimer=setTimeout(()=>layer.remove(),quiet?1300:3600);
}
window.addEventListener('learning-celebration',celebrate);
 new MutationObserver(()=>{if(document.body.classList.contains('no-motion')){confettiEngine?.destroy();confettiEngine=null;document.querySelector('#learning-confetti')?.remove()}}).observe(document.body,{attributes:true,attributeFilter:['class']});
})();

;
/* A cross-subject challenge; each success is recorded from real learning evidence. */
(()=>{
const J=LerndachsJourney,p=J.profile,paths=LerndachsCurriculum.paths,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
p.halloween??={started:false,unlocked:false,enabled:false,subjects:[],costumes:{}};const h=p.halloween;h.costumes??={};
const props=[{id:'halloween-pumpkin',name:'Kürbislicht',x:390,y:800},{id:'halloween-ghost',name:'Freundliches Gespenst',x:1060,y:420},{id:'halloween-bats',name:'Fledermaus-Girlande',x:640,y:150},{id:'halloween-candy',name:'Süße Schale',x:920,y:780}];
function art(id){const {R,E,P,C}=WorldArt;
 if(id==='halloween-pumpkin')return `${E(0,0,65,10,'#363c4820')}${P('M-4-91q-2-25 15-22','none',C.leaf,9)}${E(0,-44,61,47,'#f6a34f',C.ink)}${E(0,-44,28,47,'#ffbd63',C.ink,2)}${P('M-35-48l16-19 9 21Zm45 2 9-21 16 19ZM-31-27l16 12 15-10 15 10 16-12-10 22h-42Z','#fff2ac',C.ink,2)}`;
 if(id==='halloween-ghost')return `${P('M-55 0v-70q0-77 55-77t55 77V0L35-17 17 0 0-17-17 0-35-17Z','#fffdf4',C.ink)}${E(-18,-81,7,12,C.ink)}${E(18,-81,7,12,C.ink)}${P('M-10-51q10 13 20 0','none',C.ink,3)}${E(-35,-57,9,5,C.pink)}${E(35,-57,9,5,C.pink)}`;
 if(id==='halloween-bats')return `${P('M-160-25Q0 30 160-25','none',C.ink,3)}${[-110,0,110].map(x=>`<g transform="translate(${x} 0)">${P('M0-8l-28-20-20 25 23-1 10 16L0 6 15 12 25-4l23 1-20-25Z','#67546e',C.ink,2)}${E(-5,-1,2,3,C.white)}${E(5,-1,2,3,C.white)}</g>`).join('')}`;
 if(id==='halloween-candy')return `${E(0,-25,53,17,'#b4a4d3',C.ink)}${P('M-53-25q8 57 53 57t53-57Z','#b4a4d3',C.ink)}${[-25,0,25].map((x,i)=>`<g transform="translate(${x} -32)">${P('M-10-10l-10-7v24l10-7m20-10 10-7v24L10 0','#f29880',C.ink,2)}${R(-11,-14,22,24,['#f6cc72','#93d6eb','#edb9cf'][i],7)}</g>`).join('')}`;
 return '';
}
for(const prop of props){WorldArt.bounds[prop.id]=prop.id==='halloween-bats'?[-170,-45,340,90]:[-70,-155,140,195];WorldArt.names[prop.id]=prop.name;J.catalogue.push({id:prop.id,name:prop.name,note:'Deine Halloween-Belohnung.',price:0,kind:'season'})}
function dress(){for(const el of document.querySelectorAll('#objects .person')){el.querySelectorAll('.halloween-costume').forEach(n=>n.remove());if(!h.enabled)continue;const costume=h.costumes[el.dataset.uid]||'witch';if(costume==='none')continue;const sprite=el.querySelector('.sprite'),g=document.createElementNS('http://www.w3.org/2000/svg','g');g.classList.add('halloween-costume');g.setAttribute('pointer-events','none');g.innerHTML=costume==='cat'?'<path d="M-40-209l3-45 27 29m20 0 27-29 3 45" fill="#67546e" stroke="#363c48" stroke-width="3"/><path d="m-5-140 5 6 5-6Z" fill="#f29880" stroke="#363c48" stroke-width="2"/><path d="M-18-132l-24-5m24 11-24 4m60-10 24-5m-24 11 24 4" stroke="#363c48" stroke-width="2"/>':costume==='hero'?'<path d="M-32-112l-39 98 71-15 71 15-39-98Z" fill="#b4a4d3" stroke="#363c48" stroke-width="3"/><path d="M-38-160q38-15 76 0l-4 20-27 2-7-8-7 8-27-2Z" fill="#f29880" stroke="#363c48" stroke-width="2"/><ellipse cx="-17" cy="-151" rx="6" ry="4" fill="#fffdf4"/><ellipse cx="17" cy="-151" rx="6" ry="4" fill="#fffdf4"/>':'<path d="m-49-214 41-73 38 73Z" fill="#67546e" stroke="#363c48" stroke-width="3"/><ellipse cx="0" cy="-212" rx="62" ry="11" fill="#67546e" stroke="#363c48" stroke-width="3"/><path d="M-23-234h46" stroke="#f6b34f" stroke-width="8"/><path d="m-25-135 3-8 3 8 8 3-8 3-3 8-3-8-8-3Z" fill="#b4a4d3"/>';if(sprite.querySelector('.k-cast')){g.setAttribute('transform',costume==='hero'?'translate(0 -20)':'translate(0 -56)');sprite.querySelector('.body-rig').append(g)}else{if(el.dataset.kind==='mo')g.setAttribute('transform','translate(0 45)');(sprite.querySelector('.character-head')||sprite.querySelector('.character-breathe')||sprite).append(g)}}}
let syncing=false;
function sync(){if(syncing)return;syncing=true;document.body.classList.toggle('halloween-world',!!h.enabled);for(const el of document.querySelectorAll('[data-kind^="halloween-"]'))el.style.display=h.enabled?'':'none';dress();syncing=false}
const baseRender=J.render;J.render=()=>{baseRender();sync()};new MutationObserver(sync).observe(document.querySelector('#objects'),{childList:true});
function reward(){if(h.unlocked)return;h.unlocked=true;h.enabled=true;for(const prop of props){if(!state.owned.includes(prop.id))state.owned.push(prop.id);state.placed[state.home].push({...prop,uid:'reward-'+prop.id,s:1,layer:prop.id==='halloween-bats'?2:3.8})}J.render();window.dispatchEvent(new Event('learning-celebration'));toast('Geschafft! Deine Halloween-Welt ist freigeschaltet.')}
function observe(){if(!h.started||h.unlocked)return;let changed=false;for(const e of p.evidence||[])if((h.baseline||[]).indexOf(e.id)<0&&!h.subjects.includes(e.subject)&&paths.some(path=>path.subject===e.subject)){h.subjects.push(e.subject);changed=true}if(h.subjects.length===paths.length)reward();else if(changed)J.save()}
window.addEventListener('learning-celebration',()=>{observe();sync()});
const button=document.createElement('button');button.id='halloween-button';button.className='round-button';button.setAttribute('aria-label','Halloween-Challenge öffnen');button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6q-1-4 3-4M12 6C0 3 0 23 12 21 24 23 24 3 12 6Z"/><path d="m6 12 3-3 1 4Zm8 1 1-4 3 3ZM7 16l3 2 2-1 2 1 3-2"/></svg>';/* Seasonal collection remains available in saved worlds; no seasonal navigation. */
const dialog=document.createElement('dialog');dialog.id='halloween-dialog';dialog.setAttribute('aria-labelledby','halloween-title');document.body.append(dialog);
function open(){if(!p.starterUnlocked){window.dispatchEvent(new Event('request-starter'));return}dialog.innerHTML=`<div class="dialog-top"><div><h2 id="halloween-title">Die Halloween-Challenge</h2></div><button class="icon-button" id="halloween-close" aria-label="Schließen">×</button></div><p>Löse ab dem Start eine Aufgabe aus jedem Aufgabenbereich. Tipps und neue Versuche sind erlaubt. Bereits gelöste Aufgaben kannst du dafür wiederholen.</p><div class="challenge-list">${paths.map(path=>`<button data-challenge="${path.subject}" ${h.unlocked?'disabled':''}><span>${h.subjects.includes(path.subject)?'✓':path.icon}</span><strong>${esc(LerndachsCurriculum.sources[path.subject].title)}</strong><small>${h.subjects.includes(path.subject)?'Geschafft':'Eine Aufgabe entdecken →'}</small></button>`).join('')}</div>${h.unlocked?`<button id="halloween-toggle" class="journey-primary wide">Halloween ${h.enabled?'ausschalten':'einschalten'}</button><h3>Verkleiden & schminken</h3><div class="costume-list">${J.people().map(o=>`<label>${esc(o.name)}<select data-costume="${o.uid}" aria-label="Kostüm für ${esc(o.name)}">${[['witch','Zauberhut & Sternschminke'],['cat','Katzenohren & Schnurrhaare'],['hero','Superheld & Maske'],['none','Ohne Kostüm']].map(([id,label])=>`<option value="${id}" ${(h.costumes[o.uid]||'witch')===id?'selected':''}>${label}</option>`).join('')}</select></label>`).join('')}</div>`:`<p class="note">Deine Belohnung: Kürbislicht, Gespenst, Fledermäuse und eine Süßigkeitenschale. Dazu Kostüme und Gesichtsschminke für alle Figuren.</p><button id="challenge-start" class="journey-primary wide">${h.started?'Weiter zur ersten offenen Aufgabe':'Challenge starten'} →</button>`}`;
 dialog.querySelector('#halloween-close').onclick=()=>dialog.close();dialog.querySelector('#challenge-start')?.addEventListener('click',()=>{start();const path=paths.find(path=>!h.subjects.includes(path.subject));dialog.close();Learning.openSubject(path.subject)});dialog.querySelectorAll('[data-challenge]').forEach(b=>b.onclick=()=>{start();dialog.close();Learning.openSubject(b.dataset.challenge)});dialog.querySelector('#halloween-toggle')?.addEventListener('click',()=>{h.enabled=!h.enabled;J.save();sync();open()});dialog.querySelectorAll('[data-costume]').forEach(select=>select.onchange=()=>{h.costumes[select.dataset.costume]=select.value;J.save();sync()});if(!dialog.open)dialog.showModal()}
function start(){if(!h.started){h.started=true;h.baseline=(p.evidence||[]).map(e=>e.id);J.save()}}
window.addEventListener('learning-success',({detail})=>{if(!h.started||h.unlocked||!paths.some(path=>path.subject===detail.subject))return;if(!h.subjects.includes(detail.subject)){h.subjects.push(detail.subject);if(h.subjects.length===paths.length)reward();else J.save()}});
button.onclick=open;window.LerndachsSeason={art,sync,open};sync();
})();

;
(()=>{
const J=LerndachsJourney,p=J.profile,guide=document.querySelector('#room-guide'),modern=p.onboardingVersion===2;
const quiet=()=>document.body.classList.contains('no-motion')||matchMedia('(prefers-reduced-motion:reduce)').matches;
const lines={curtain:'',waking:'',explore:'Schau dich um. Fass alles an!',couch:'Findest du das Sofa?',dachs:'Wo steckt der Dachs?','move-in':'Gefunden! Wer zieht hier ein?',shop:'Willkommen! Such dir etwas aus.','second-item':'Was gefällt dir noch?',earn:'Für ein Rätsel gibt’s Sterne. Machst du mit?'};
let voice,voiceDone,voiceQueue=Promise.resolve(),welcomed=false,waking=false,stage,stageTimer;
function play(name){if(document.hidden||window.WorldSound?.status.enabled===false)return Promise.resolve(false);return new Promise(resolve=>{voice?.pause();voiceDone?.(false);voiceDone=resolve;voice=new Audio('audio/'+name+'.mp3');voice.volume=WorldSound?.status.volume??.6;voice.onended=()=>resolve(true);voice.onerror=()=>resolve(false);voice.play().then(()=>{if(name==='welcome')welcomed=true}).catch(()=>resolve(false))})}
function enqueue(name){voiceQueue=voiceQueue.then(()=>play(name));return voiceQueue}
function show(){document.body.dataset.opening=p.opening;guide.hidden=['curtain','waking','done'].includes(p.opening);if(guide.hidden)return;document.querySelector('#room-guide-text').textContent=lines[p.opening]||'';const action=document.querySelector('#room-guide-action');action.hidden=['explore','dachs'].includes(p.opening);action.textContent=p.opening==='couch'?'Zeig mal':p.opening==='move-in'?'Ich':p.opening==='earn'?'Sterne sammeln':'Einrichten';document.querySelector('#room-guide-read').hidden=false;guide.classList.toggle('found-speech',modern&&p.opening==='move-in');if(modern&&p.opening==='move-in')requestAnimationFrame(()=>{const head=document.querySelector('[data-kind="dachs"] .badger-head')?.getBoundingClientRect();if(head){guide.style.setProperty('--found-top',Math.max(95,head.top-guide.offsetHeight-20)+'px');guide.style.setProperty('--found-left',Math.max(15,Math.min(innerWidth-guide.offsetWidth-15,head.left+head.width/2-80))+'px')}})}
function moveIn(){p.opening='shop';J.grantStarter();show()}
function startLearning(){if(p.opening==='earn'||p.opening==='done'){p.opening='done';J.save();show();Learning.nextFresh(true)}else show()}
function sleepBehindSofa(){const sofa=Lernwelt.find('sofa'),d=Lernwelt.find('dachs');if(sofa&&d){d.x=sofa.x-60;d.y=sofa.y-180;d.s=.9;d.layer=2.9;d.pose='curled';J.render()}}
function awaken(){if(waking)return;waking=true;p.opening='waking';show();const d=Lernwelt.find('dachs'),sofa=Lernwelt.find('sofa');d.pose='waking';J.render();const head=document.querySelector('[data-kind="dachs"] .badger-sleep-head');if(!quiet())head?.animate([{filter:'brightness(.94)'},{filter:'brightness(1)'}],{duration:850});setTimeout(()=>{d.pose='standing';d.y=sofa?.y||680;J.render();const body=document.querySelector('[data-kind="dachs"] .badger-body');if(!quiet())body?.animate([{transform:'translateY(60px)'},{transform:'translateY(0)'}],{duration:650,easing:'ease-out'});setTimeout(()=>{const start={x:d.x,y:d.y};d.x=(sofa?.x||800)-25;d.y=790;d.s=1;d.layer=4;J.render();const node=document.querySelector(`[data-uid="${d.uid}"]`),sprite=node?.querySelector('.sprite'),gait=[];if(!quiet()){sprite?.animate([{transform:`translate(${start.x-d.x}px,${start.y-d.y}px)`},{transform:'translate(0,0)'}],{duration:1800,easing:'ease-in-out'});for(const leg of node?.querySelectorAll('.badger-leg')||[]){const sign=leg.classList.contains('left')?1:-1;gait.push(leg.animate([{transform:`rotate(${sign*22}deg)`},{transform:`rotate(${-sign*22}deg)`},{transform:`rotate(${sign*22}deg)`}],{duration:450,iterations:4}))}}setTimeout(()=>{gait.forEach(a=>a.cancel());p.opening='move-in';J.save();show();enqueue('found-you');enqueue('move-in');window.dispatchEvent(new Event('opening-changed'))},quiet()?0:1800)},quiet()?0:650)},quiet()?0:850)}
function curtain(){sleepBehindSofa();stage=document.createElement('dialog');stage.id='stage-dialog';stage.setAttribute('aria-label','Willkommen bei Lerndachs');stage.innerHTML=`<div class="stage-peek"><svg viewBox="-85 -145 190 180" aria-hidden="true">${WorldArt.badger('portrait')}<g class="stage-wave"><ellipse cx="73" cy="-22" rx="16" ry="20" fill="#9ba4a1" stroke="#363c48" stroke-width="4"/><path d="M66-30v7m8-9v8m8-5v7" stroke="#363c48" stroke-width="2" stroke-linecap="round"/></g></svg></div><div class="curtain-panel curtain-left"></div><div class="curtain-panel curtain-right"></div><div class="curtain-valance"></div><div class="stage-greeting" hidden><p>Hallo, schön dass du da bist.<br>Wollen wir spielen?</p><div><button id="stage-yes">Ja</button><button id="stage-listen" aria-label="Begrüßung anhören">${icon('sound')}</button></div></div>`;document.body.append(stage);stage.addEventListener('cancel',e=>e.preventDefault());stage.showModal();function align(){const head=document.querySelector('[data-kind="dachs"] .badger-sleep-head'),box=head?.getBoundingClientRect();const x=Math.max(70,Math.min(innerWidth-70,box?box.x+box.width/2:innerWidth*.5)),y=Math.max(210,Math.min(innerHeight-150,box?box.y+box.height/2:innerHeight*.55));stage.style.setProperty('--seam',x+'px');stage.style.setProperty('--peek-y',y+'px')}align();window.addEventListener('resize',align);stageTimer=setTimeout(()=>{align();stage.classList.add('peeking');stage.querySelector('.stage-greeting').hidden=false;stage.querySelector('#stage-yes').focus({preventScroll:true});voiceQueue=play('welcome')},1500);stage.querySelector('#stage-listen').onclick=()=>{voiceQueue=play('welcome')};stage.querySelector('#stage-yes').onclick=()=>{clearTimeout(stageTimer);if(!welcomed)enqueue('welcome');p.opening='dachs';J.save();show();stage.classList.add('opening');setTimeout(()=>{stage.close();stage.remove();window.removeEventListener('resize',align);enqueue('find-dachs')},quiet()?0:1500)}}
function explore(id){if(modern){if(p.opening==='dachs'&&id==='dachs')awaken();return}if(p.opening==='explore'){p.openingTouches=(p.openingTouches||0)+1;if(p.openingTouches>=3){p.opening='couch';J.bring('sofa')}}else if(p.opening==='couch'&&id==='sofa'){p.opening='dachs';sleepBehindSofa();WorldSound.effect('dachs')}else if(p.opening==='dachs'&&id==='dachs'){p.opening='move-in';const d=Lernwelt.find('dachs'),s=Lernwelt.find('sofa');d.x=s?s.x+260:1020;d.y=790;d.layer=4;d.pose='standing';J.render()}else return;J.save();show()}
document.querySelector('#room-guide-action').onclick=()=>{if(p.opening==='couch'){J.bring('sofa');Lernwelt.focus('sofa')}else if(p.opening==='move-in'){if(J.player())moveIn();else LerndachsFriends.open('initial',moveIn)}else if(p.opening==='earn')startLearning();else J.showShop()};
document.querySelector('#room-guide-read').onclick=()=>{if(p.opening==='dachs')enqueue('find-dachs');else if(p.opening==='move-in')enqueue('move-in');else if('speechSynthesis'in window){speechSynthesis.cancel();const s=new SpeechSynthesisUtterance(lines[p.opening]);s.lang='de-DE';s.rate=.85;speechSynthesis.speak(s)}};
window.addEventListener('world-use',e=>setTimeout(()=>explore(e.detail.id),180));window.addEventListener('world-move',e=>{if(!modern){if(['explore','couch','dachs'].includes(p.opening)&&e.detail.id==='sofa')sleepBehindSofa();explore(e.detail.id)}});window.addEventListener('world-touch',()=>{if(!modern)explore()});window.addEventListener('request-opening',show);window.addEventListener('request-earn-stars',startLearning);window.addEventListener('opening-changed',show);window.addEventListener('world-saved',()=>{if(voice){voice.volume=WorldSound?.status.volume??.6;if(WorldSound?.status.enabled===false){voice.pause();voiceDone?.(false)}}});
document.querySelector('#welcome-hint').hidden=true;if(modern&&p.opening==='curtain')curtain();else if(modern&&p.opening==='waking'){p.opening='dachs';sleepBehindSofa()}else if(modern&&p.opening==='dachs')sleepBehindSofa();else{const d=Lernwelt.find('dachs');if(d&&!d.pose){if(['explore','couch','dachs'].includes(p.opening))sleepBehindSofa();else{d.pose='standing';d.y=790;d.layer=4;J.render()}}}show();
window.addEventListener('resize',()=>{if(p.opening==='move-in')show()});
window.LerndachsOnboarding={replay:()=>enqueue(p.opening==='dachs'?'find-dachs':'move-in')};
})();

;
/* One compact, keyboard- and touch-accessible settings disclosure. */
(()=>{
const head=document.querySelector('#adventure-button');head.hidden=true;head.style.display='none';
const host=document.querySelector('.utility-buttons'),menu=document.createElement('div');menu.id='world-menu';menu.className='world-menu';menu.hidden=true;
const trigger=document.createElement('button');trigger.id='menu-toggle';trigger.className='round-button';trigger.innerHTML=icon('settings');trigger.setAttribute('aria-label','Menü öffnen');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',menu.id);
for(const [id,label] of [['day-toggle','Tag / Nacht'],['motion-toggle','Animationen'],['sound-toggle','Ton'],['help','Einstellungen']]){const b=document.getElementById(id);b.removeAttribute('title');menu.append(b)}
for(const [mode,symbol,label] of [['parents',icon('friends'),'Eltern'],['teachers','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3h20v14H11M16 17v4m-4 0h8M5 14v8m-4 0v-5q0-3 4-3t4 3v5M9 14l6-5"/><circle cx="5" cy="9" r="3"/></svg>','Lehrkräfte']]){const b=document.createElement('button');b.className='round-button';b.innerHTML=`<span aria-hidden="true">${symbol}</span><span class="menu-label">${label}</span>`;b.setAttribute('aria-label',label);b.onclick=()=>{setOpen(false);LerndachsAdults.open(mode)};menu.append(b)}
const avatar=document.createElement('button');avatar.id='avatar-editor-button';avatar.className='round-button';avatar.setAttribute('aria-label','Meine Figur');avatar.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4q-4 5-8 0Z"/></svg><span class="menu-label">Meine Figur</span>';avatar.onclick=()=>{setOpen(false);LerndachsFriends.open('change')};avatar.hidden=!LerndachsJourney.player();menu.append(avatar);window.addEventListener('world-saved',()=>{avatar.hidden=!LerndachsJourney.player()});
const legal=document.createElement('a');legal.href='impressum.html';legal.className='round-button';legal.setAttribute('aria-label','Impressum');legal.innerHTML='<span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v6m-2 0h4"/><circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none"/></svg></span><span class="menu-label">Impressum</span>';menu.append(legal);host.replaceChildren(trigger,menu);
function label(){for(const [id,text] of [['day-toggle',Lernwelt.snapshot().night?'Nacht · zu Tag wechseln':'Tag · zu Nacht wechseln'],['motion-toggle',document.body.classList.contains('no-motion')?'Animationen aus':'Animationen an'],['sound-toggle',document.getElementById('sound-toggle').getAttribute('aria-pressed')==='true'?'Ton an':'Ton aus'],['help','Einstellungen']]){const b=document.getElementById(id);let span=b.querySelector('.menu-label');if(!span){span=document.createElement('span');span.className='menu-label';b.append(span)}span.textContent=text}}
function setOpen(open){menu.hidden=!open;trigger.setAttribute('aria-expanded',String(open));if(open)label()}
trigger.onclick=()=>setOpen(menu.hidden);host.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')setOpen(true)});host.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!host.contains(document.activeElement))setOpen(false)});
host.addEventListener('focusout',()=>setTimeout(()=>{if(!host.contains(document.activeElement)&&!host.matches(':hover'))setOpen(false)},0));
menu.addEventListener('click',()=>{label()});document.addEventListener('pointerdown',e=>{if(!host.contains(e.target))setOpen(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){setOpen(false);trigger.focus()}});window.addEventListener('world-saved',()=>{if(!menu.hidden)label()});
})();

;
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
window.addEventListener('character-celebrate',()=>document.querySelectorAll('#objects .person').forEach(n=>gesture(n)));
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
const phone=document.createElementNS('http://www.w3.org/2000/svg','g');phone.id='wall-phone';phone.setAttribute('transform','translate(1120 270)');phone.setAttribute('tabindex','0');phone.setAttribute('role','button');phone.setAttribute('aria-label','Dachs anrufen');phone.innerHTML=`<title>Dachs anrufen</title><rect x="-42" y="-65" width="84" height="130" rx="20" fill="#f6cc72" stroke="#363c48" stroke-width="4"/><path d="M-24-38Q-47 0-24 36l13-12-8-14V-9l8-16Z" fill="#79c5ad" stroke="#363c48" stroke-width="4"/><path d="M-21 38q-15 35 10 35t20-26" fill="none" stroke="#363c48" stroke-width="3"/>${[0,1,2,3,4,5].map(i=>`<circle cx="${6+i%2*17}" cy="${-15+Math.floor(i/2)*18}" r="4" fill="#363c48"/>`).join('')}<text x="9" y="-39" text-anchor="middle" font-size="12" font-weight="bold" fill="#363c48">DACHS</text>`;document.querySelector('#world').append(phone);
for(const type of ['pointerdown','pointerup'])phone.addEventListener(type,e=>e.stopPropagation());phone.addEventListener('click',()=>visit('call'));phone.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();visit('call')}});
const visitor=document.createElement('aside');visitor.id='dachs-visit';visitor.hidden=true;visitor.setAttribute('aria-label','Dachs ist zu Besuch');visitor.innerHTML=`<div class="visit-speech"><p role="status" aria-live="polite"></p><div><button id="visit-play">Zusammen spielen</button><button id="visit-later">Später</button></div></div><svg viewBox="-100 -260 200 280" aria-hidden="true">${WorldArt.badger()}</svg>`;document.querySelector('.game-shell').append(visitor);
let leaveTimer,arrivalTimer,celebrateAfterTask=false,visiting=false;
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
function visit(reason='invite'){
 if(document.hidden||document.querySelector('dialog[open]'))return;
 const serial=++visitSerial;clearTimeout(leaveTimer);clearTimeout(arrivalTimer);visitor.getAnimations().forEach(a=>a.cancel());stopWalking();visitor.hidden=false;visiting=true;visitor.querySelector('svg').style.transform='';
 if(J.profile.onboardingVersion===2&&J.profile.opening!=='done')return;
 const eligible=!J.profile.firstVisitDay||day()>J.profile.firstVisitDay;
 const daily=eligible&&!Lernwelt.snapshot().receipts.includes('daily-visit-'+day());
 visitor.querySelector('p').textContent=reason==='success'?'Geschafft! Das haben wir toll gemacht!':daily?'Schön, dass du da bist! Ich schenke dir heute 25 Sterne. Magst du mit einem Rätsel noch mehr verdienen?':'Hallo! Magst du mit mir eine Aufgabe lösen und Sterne sammeln?';
 visitor.querySelector('.visit-speech > div').hidden=reason==='success';
 const duration=2200,distance=visitor.getBoundingClientRect().left+visitor.querySelector('svg').getBoundingClientRect().width+30;
 if(!quiet())visitor.classList.add('is-walking');walk(duration);
 animate(visitor,[{transform:`translateX(${-distance}px)`},{transform:'translateX(0)'}],{duration,easing:'linear'});
 arrivalTimer=setTimeout(()=>{if(!visiting||serial!==visitSerial)return;stopWalking();if(daily)Lernwelt.reward('daily-visit-'+day(),25);if(reason==='success'){gesture(visitor);const player=J.player();if(player)gesture(document.querySelector(`[data-uid="${player.uid}"]`));leaveTimer=setTimeout(departure,2200)}},quiet()?0:duration);
 if(reason!=='success')leaveTimer=setTimeout(departure,24000);
}
visitor.querySelector('#visit-play').onclick=()=>{departure();if(J.profile.opening!=='done')window.dispatchEvent(new Event('request-opening'));else Learning.nextFresh(true)};visitor.querySelector('#visit-later').onclick=departure;
window.addEventListener('task-waiting',()=>visit());
window.addEventListener('learning-success',()=>{celebrateAfterTask=true;const content=document.querySelector('#learning-content');content.querySelector('.success-friends')?.remove();const team=document.createElement('div');team.className='success-friends';team.setAttribute('aria-label','Dachs und deine Figur springen vor Freude');const player=J.player();team.innerHTML=`<svg viewBox="-100 -260 200 280" aria-hidden="true">${WorldArt.badger()}</svg>${player?`<svg viewBox="-100 -260 200 280" aria-hidden="true">${J.art(player.id,undefined,player.appearance)}</svg>`:''}`;content.querySelector('#answer-feedback')?.after(team);team.querySelectorAll('svg').forEach(n=>gesture(n));});
document.querySelector('#learning-dialog').addEventListener('close',()=>{if(celebrateAfterTask){celebrateAfterTask=false;setTimeout(()=>visit('success'),250)}});
function welcome(){if(J.profile.firstVisitDay&&day()<=J.profile.firstVisitDay)return;if(J.profile.onboardingVersion===2&&J.profile.opening!=='done')return;if(!visiting&&!document.querySelector('dialog[open]')&&!Lernwelt.snapshot().receipts.includes('daily-visit-'+day()))visit('welcome')}
setTimeout(welcome,1800);setInterval(welcome,30000);window.addEventListener('opening-changed',()=>setTimeout(welcome,1200));
window.LerndachsLiving={visit,departure,roam,gesture};
})();

;
/* Modal chrome stays outside its independently scrolling content. */
(()=>{let queued=false;const ids='#close-panel,#close-character,#adult-close,#learn-close,#schedule-close,#halloween-close';function tidy(){queued=false;for(const dialog of document.querySelectorAll('dialog[open]:not(#stage-dialog)')){const close=dialog.querySelector(ids);if(!close)continue;close.hidden=false;dialog.classList.add('fixed-menu');let scroll=dialog.querySelector(':scope > .menu-scroll-content');if(!scroll){scroll=document.createElement('div');scroll.className='menu-scroll-content';for(const child of [...dialog.childNodes])if(child!==close&&!child.classList?.contains('wallet-portal'))scroll.append(child);dialog.append(scroll)}if(close.parentElement!==dialog)dialog.append(close);for(const child of [...dialog.childNodes])if(child!==scroll&&child!==close&&!child.classList?.contains('wallet-portal'))scroll.append(child)}}new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(tidy)}}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open']});tidy()})();
