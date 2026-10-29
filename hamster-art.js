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
