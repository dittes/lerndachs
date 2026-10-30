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
document.querySelector('#wall-fixtures').append(board);for(const type of ['pointerdown','pointerup'])board.addEventListener(type,e=>e.stopPropagation());board.addEventListener('click',open);board.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
window.LerndachsTimetable={open,getSnapshot:()=>structuredClone(plan())};
})();
