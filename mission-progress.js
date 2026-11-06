/* Transparent local practice history and conservative recommendation rules. */
(()=>{
const J=LerndachsJourney,p=J.profile;if(!p.missionHistory||typeof p.missionHistory!=='object')p.missionHistory={};
if(p.missionVersion!==1){if(p.active!=='practice'){p.active=null;p.index=0}p.catalogueReturn=false;p.missionVersion=1;J.save()}
const key=(q,g=p.grade)=>q[7].id+':'+g;
function record(q,g=p.grade){return p.missionHistory[key(q,g)]||null}
function status(q,g=p.grade){const r=record(q,g);if(r?.solved)return r.lastHints||r.lastErrors?'Mit Hilfe gelöst':r.independent>=2?'Mehrfach selbstständig':'Selbstständig gelöst';if(p.done.includes(['garden','memory'].includes(q[7].type)?q[7].id+'-g'+g:q[7].id))return 'Früher gelöst';return r?'Begonnen':'Offen'}
function start(q){const k=key(q),r=p.missionHistory[k]||{id:q[7].id,grade:p.grade,visits:0,solved:0,independent:0};r.visits++;r.seenAt=new Date().toISOString();p.missionHistory[k]=r;J.save()}
function finish(q,errors,hints){const r=record(q);if(!r)return;r.solved++;r.lastErrors=errors;r.lastHints=hints;r.lastAt=new Date().toISOString();if(!errors&&!hints)r.independent++;r.dueAt=new Date(Date.now()+[1,3,7,14][Math.min(3,Math.max(0,r.independent-1))]*864e5).toISOString();J.save()}
function recommend(candidates){
 const now=Date.now(),due=candidates.filter(({q})=>{const r=record(q);return r?.solved&&Date.parse(r.dueAt)<=now});
 // One due review every fourth recommendation; no pressure and no repeat star reward.
 if((p.promptNumber||0)%4===3&&due.length)return due.sort((a,b)=>Date.parse(record(a.q).dueAt)-Date.parse(record(b.q).dueAt))[0];
 const fresh=candidates.filter(({q})=>!p.done.includes(['garden','memory'].includes(q[7].type)?q[7].id+'-g'+p.grade:q[7].id));
 const catalogue=LerndachsCurriculum.paths.flatMap(p=>p.items.filter(q=>q[7].grades.includes(J.profile.grade)).map(q=>({p,q})));
 const skillLevel=q=>{const rows=catalogue.filter(x=>x.q[7].family===q[7].family).map(x=>record(x.q)).filter(Boolean);const strong=rows.filter(r=>r.solved&&r.lastHints===0&&r.lastErrors===0).length;return strong>=4?3:strong>=2?2:1};
 const recent=p.lastMissionPath;
 return fresh.sort((a,b)=>{const score=x=>{const r=record(x.q),d=x.q[7].difficulty||1;return Math.abs(d-skillLevel(x.q))*20+(x.p.id===recent?4:0)+catalogue.filter(y=>y.p.id===x.p.id&&record(y.q)).length*.25+(r&&!r.solved?-2:0)};return score(a)-score(b)||a.q[7].id.localeCompare(b.q[7].id,'de')})[0]||due[0]||candidates[0];
}
window.LerndachsMissionProgress={start,finish,status,record,recommend};
})();
