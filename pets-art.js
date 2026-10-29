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
