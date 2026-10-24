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
