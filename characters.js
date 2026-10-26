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
   const x=distance?dx/distance*4.8*strength:0,y=distance?dy/distance*4.6*strength:0;
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
