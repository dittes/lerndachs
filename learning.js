/* Lerndachs class-based learning journey and in-world activities. */
(()=>{
const badger=`<svg viewBox="-76 -139 152 145" aria-hidden="true">${WorldArt.badger('portrait')}</svg>`;
for(const selector of ['.badger-icon','.brand-badger'])document.querySelector(selector).innerHTML=badger;
const {paths,sources}=LerndachsCurriculum,grades=LerndachsGrades,J=LerndachsJourney,progress=J.profile;
const dialog=document.querySelector('#learning-dialog'),content=document.querySelector('#learning-content'),strip=document.querySelector('#quest-strip');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let answerOrder=[];const mixedIndices=n=>{const a=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
let roundCount=0;let mode='world',correct=false,pendingGrade=progress.grade,afterGrade,sampleTimer,memoryTimer,memoryCards=[],memoryOpen=[],memoryBusy=false,gardenCount=0,worldAttemptDone=false;
const tasksFor=p=>p.items.filter(q=>q[7].grades.includes(progress.grade));
const active=()=>progress.active==='practice'?{id:'practice',title:'Deine Übungswerkstatt',items:[progress.practiceQuestion],color:'yellow'}:paths.find(p=>p.id===progress.active);
const currentTasks=()=>progress.active==='practice'?[progress.practiceQuestion]:active()?tasksFor(active()):[];
const currentTask=()=>currentTasks()[progress.index];
const taskKey=q=>['garden','memory'].includes(q[7].type)?q[7].id+'-g'+progress.grade:q[7].id;
const finished=q=>progress.done.includes(taskKey(q));
function persist(){J.save()}
function stopSample(){clearTimeout(sampleTimer);window.WorldSound?.stopSample?.()}
function cleanup(){dialog.classList.remove('task-complete');stopSample();clearTimeout(memoryTimer);window.LerndachsSpeech?.stop()}
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
function readPartnerInvitation(){LerndachsSpeech.speak(partnerInvitation+' Was möchtest du spielen?')}
function invite(){
 if(!progress.starterUnlocked){starter();return}
 cleanup();document.querySelector('#panel').close();mode='menu';document.querySelector('#learn-close').hidden=false;
 const labels={numbers:'Rechnen',words:'Lesen',nature:'Natur',music:'Musik',art:'Farben',media:'Medien'};
 content.innerHTML=`<div class="learn-intro partner-intro"><div class="guide-face">${badger}</div><h2 id="learn-title">${partnerInvitation}</h2><p>Was möchtest du spielen?</p>${!!window.LerndachsSpeech?`<button id="read-partner" class="task-icon" aria-label="Vorlesen">${icon('sound')}</button>`:''}</div><div class="path-grid partner-paths">${paths.map(p=>`<button class="learning-path ${p.color}" data-path="${p.id}"><span class="path-symbol" aria-hidden="true">${p.icon}</span><strong>${labels[p.id]}</strong></button>`).join('')}</div>`;
 reveal();if(!!window.LerndachsSpeech&&WorldSound.status.enabled)readPartnerInvitation();
}

function menu(){
 cleanup();mode='menu';document.querySelector('#learn-close').hidden=false;
 const eligible=paths.flatMap(tasksFor),n=eligible.filter(finished).length;
 content.innerHTML=`<div class="learn-intro"><div class="guide-face">${badger}</div><h2 id="learn-title">Was möchtest du spielen?</h2><p>Für jedes neue Rätsel gibt’s 15 Sterne.</p><div class="discovery-count">${n} / ${eligible.length} Aufgaben für ${grades[progress.grade].label} entdeckt</div></div>${targetCard()}<div class="journey-options"><button id="together-toggle" aria-pressed="${progress.together}">${progress.together?'✓ Wir spielen zu zweit':'♡ Gemeinsam spielen'}</button></div>${progress.together?'<p class="together-note">Ein Gerät, zwei Ideen: Eine Person spielt, die andere erklärt oder hilft. Nach einer neuen gelösten Aufgabe tauscht ihr die Rollen.</p>':''}<div class="path-grid">${paths.map(p=>{
 const tasks=tasksFor(p),count=tasks.filter(finished).length;return `<button class="learning-path ${p.color}" data-path="${p.id}"><span class="path-symbol">${p.icon}</span><strong>${({numbers:"Rechnen",words:"Lesen",nature:"Natur",music:"Musik",art:"Farben",media:"Medien"})[p.id]||p.title}</strong><span>${({numbers:"Zählen und rechnen.",words:"Wörter lesen und schreiben.",nature:"Tiere und Natur entdecken.",music:"Hören und Musik machen.",art:"Farben und Formen entdecken.",media:"Mit Handy und Computer sicher umgehen."})[p.id]||p.desc}</span><div class="path-dots">${Array.from({length:Math.min(12,tasks.length)},(_,i)=>`<i class="${i<Math.round(count/tasks.length*Math.min(12,tasks.length))?'done':''}"></i>`).join('')}<b>${count}/${tasks.length}</b></div><em>${count===tasks.length?'Noch mal entdecken ↗':'Los geht’s →'}</em></button>`;
 }).join('')}</div><button id="start-practice" class="practice-button">Neue Rechenaufgabe</button><div class="badge-row">${[[1,'Erster Schritt'],[5,'Ideensammler'],[20,'Weltgestalter'],[50,'Entdeckerprofi']].map(([count,title])=>`<span class="${progress.done.length>=count?'earned':''}">${progress.done.length>=count?'✦':'◇'} ${title}</span>`).join('')}</div><p class="learning-footnote">Du darfst dir Zeit lassen und Hilfe holen.</p><button id="curriculum-info" class="curriculum-link">Für Erwachsene: Lernziele & Spielkonzept ↗</button>`;
}
function begin(id){roundCount=0;progress.catalogueReturn=false;if(progress.grade===null){chooseGrade(()=>begin(id));return}if(progress.opening!=='done'){progress.opening='done';window.dispatchEvent(new Event('opening-changed'))}progress.active=id;const tasks=currentTasks(),hit=LerndachsMissionProgress.recommend(tasks.map(q=>({p:active(),q})));progress.index=hit?tasks.indexOf(hit.q):0;progress.worldMoves=[];worldAttemptDone=false;persist();question()}
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
function taskText(q,text){return q[7].goal==='carry'?text.replace(/Milo|Max/g,J.player()?.characterName||WorldArt.names[J.player()?.id]||'deine Figur'):text}
function commonQuestion(q){const meta=q[7],visual=q[6].length<=32&&!/[a-zäöüß]/.test(q[6]);return `<div class="task-copy"><h2 id="learn-title">${escape(taskText(q,q[1]))}</h2><p class="task-description">${escape(taskText(q,q[2]))}</p></div><div class="task-tools"><button id="read-question" class="task-icon" aria-label="Aufgabe vorlesen" title="Vorlesen">${icon('sound')}</button><button id="task-hint" class="task-icon" aria-label="Tipp anzeigen" title="Tipp anzeigen" aria-expanded="false">💡</button>${meta.audio?'<button id="play-sample" class="sample-button">▶ Anhören</button>':''}</div>${visual&&meta.type==='choice'?`<div class="task-visual" aria-hidden="true">${escape(q[6])}</div>`:''}<div id="task-hint-text" class="task-hint" hidden>${escape(meta.hint)}</div>`}
function footer(){return '<div id="answer-feedback" role="status" aria-live="polite"></div><div class="question-actions"><button id="question-back">← Zur Welt</button><button id="skip-question">Später</button><button id="reward-shop" hidden>Einrichten</button><button id="next-question" hidden>Weiter →</button></div>'}
function question(){
 const q=currentTask();if(!q)return;document.querySelector('#panel').close();cleanup();mode='question';correct=false;worldAttemptDone=false;window.LerndachsEvidence?.start(q,progress.active);document.querySelector('#learn-close').hidden=false;
 answerOrder=mixedIndices(q[3].length);let interaction='';
 if(q[7].type==='world')interaction='<div class="world-task-actions"><button id="enter-world-task" class="journey-primary">In meiner Welt ausprobieren →</button></div>';
 else if(q[7].type==='garden'){gardenCount=0;interaction='<div class="garden-game"><p id="garden-order" hidden></p><div id="garden-bed" aria-label="Dein bepflanztes Beet"></div><div class="garden-controls"><button id="garden-remove" aria-label="Einen Samen herausnehmen">−</button><span id="garden-count" aria-live="polite">0 Samen</span><button id="garden-add" aria-label="Einen Samen pflanzen">+ Samen</button></div><button id="check-garden" class="journey-primary">Mein Beet prüfen →</button></div>'}
 else if(q[7].type==='memory')interaction='<div class="memory-game"><p id="memory-rule" hidden></p><div id="memory-grid"></div><p id="memory-count" aria-live="polite"></p></div>';
 else interaction=`<div class="answer-grid">${answerOrder.map((i,position)=>`<button data-answer="${i}"><b>${String.fromCharCode(65+position)}</b>${escape(q[3][i])}</button>`).join('')}</div>`;
 if(q[7].response==='number')interaction='<form id="number-answer-form" class="mission-number"><label for="number-answer">Deine Zahl</label><input id="number-answer" inputmode="numeric" autocomplete="off" maxlength="8" aria-describedby="answer-feedback"><button class="journey-primary" type="submit">Prüfen →</button></form>';
 if(q[7].response==='order'){const steps=q[7].sequence;interaction='<div class="mission-order"><p>Tippe die Schritte in der richtigen Reihenfolge an.</p><ol id="order-picked" aria-live="polite"></ol><div>'+mixedIndices(steps.length).map(n=>{return `<button data-order="${n}">${escape(steps[n])}</button>`}).join('')+'</div><button id="order-reset">Neu ordnen</button></div>'}
 content.innerHTML=commonQuestion(q)+interaction+footer();
 if(q[7].phase){const badge=document.createElement('p');badge.className='mission-phase';badge.textContent=q[7].phase+' · '+q[7].skill;content.prepend(badge)}
 const form=content.querySelector('#number-answer-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();if(correct)return;const value=content.querySelector('#number-answer').value.trim();if(!/^\d+$/.test(value)){document.querySelector('#answer-feedback').textContent='Trage eine ganze Zahl ein.';return}if(Number(value)===Number(q[7].expected))success(q);else{window.LerndachsEvidence?.mistake();document.querySelector('#answer-feedback').textContent='Prüfe noch einmal. '+q[7].hint}});
 if(q[7].type==='garden')renderGarden();if(q[7].type==='memory')startMemory();
 if(!(!!window.LerndachsSpeech))document.querySelector('#read-question').hidden=true;reveal();
}
function success(q){
 if(correct)return;correct=true;stopSample();window.LerndachsEvidence?.finish(q);window.dispatchEvent(new Event('learning-celebration'));const already=finished(q);J.reward(taskKey(q));window.dispatchEvent(new Event('character-celebrate'));dialog.classList.add('task-complete');
 const feedback=document.querySelector('#answer-feedback');feedback.classList.add('correct-feedback');feedback.textContent=(already?'Geschafft! ':'Geschafft! +15 Sterne. ')+q[5];if(q[7].reflection){const reflection=document.createElement('p');reflection.className='mission-reflection';reflection.textContent=q[7].reflection;feedback.append(reflection)}
 const target=J.catalogue.find(i=>i.id===progress.target);
 document.querySelector('#reward-shop').hidden=!target||Lernwelt.snapshot().balance<target.price;
 document.querySelector('#next-question').hidden=false;document.querySelector('#skip-question').hidden=true;content.querySelectorAll('[data-answer],[data-order],#number-answer-form button,#number-answer,#check-garden,#enter-world-task').forEach(b=>b.disabled=true);WorldSound.effect('reward');
 for(const [n,name] of [[1,'Erster Schritt'],[5,'Ideensammler'],[20,'Weltgestalter'],[50,'Entdeckerprofi']])if(progress.done.length>=n&&!progress.badges.includes(name))progress.badges.push(name);persist();window.dispatchEvent(new CustomEvent('learning-success',{detail:{subject:active()?.subject||'math'}}));
}
function answer(i){if(correct)return;const q=currentTask(),button=content.querySelector(`[data-answer="${i}"]`);if(i!==q[4]){window.LerndachsEvidence?.mistake();button.classList.add('try-again');button.disabled=true;document.querySelector('#answer-feedback').textContent='Prüfe noch einmal. '+q[7].hint;WorldSound.effect('tea');return}button.classList.add('is-correct');success(q)}
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
 if(progress.catalogueReturn){progress.catalogueReturn=false;close();LerndachsAdults.open('tasks');return}
 if(correct)roundCount++;
 if(roundCount>=5){roundCount=0;content.innerHTML='<div class="learn-finish"><h2 id="learn-title">Fünf Entdeckungen geschafft!</h2><p>Was hat dir beim Lösen geholfen? Zeige oder erzähle eine Idee.</p><button id="question-back">In meiner Welt weiterspielen</button><button id="finish-menu">Noch etwas entdecken</button></div>';mode='finish';return}
 const remaining=currentTasks().filter(q=>q!==currentTask()&&!finished(q));if(remaining.length){const hit=LerndachsMissionProgress.recommend(remaining.map(q=>({p,q})));progress.index=currentTasks().indexOf(hit.q);persist();question();return}
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
 else if(b.dataset.order!==undefined){if(correct)return;const list=content.querySelector('#order-picked'),q=currentTask(),n=Number(b.dataset.order);if(n!==list.children.length){window.LerndachsEvidence?.mistake();document.querySelector('#answer-feedback').textContent='Was kommt zuerst? '+q[7].hint;return}const li=document.createElement('li');li.textContent=q[7].sequence[n];list.append(li);b.disabled=true;if(list.children.length===q[7].sequence.length)success(q)}
 else if(b.id==='order-reset'&&!correct){content.querySelector('#order-picked').innerHTML='';content.querySelectorAll('[data-order]').forEach(b=>b.disabled=false)}
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
 else if(b.id==='task-hint'){window.LerndachsEvidence?.hint();const hint=document.querySelector('#task-hint-text'),q=currentTask();if(!hint.hidden&&q[7].example&&!hint.dataset.example){hint.textContent=q[7].hint+' '+q[7].example;hint.dataset.example='1';b.title='Tipp ausblenden'}else hint.hidden=!hint.hidden;b.setAttribute('aria-expanded',!hint.hidden)}
 else if(b.id==='play-sample'){stopSample();const duration=WorldSound.playSample(currentTask()[7].audio);b.textContent='♫ Hör gut hin …';sampleTimer=setTimeout(()=>{if(b.isConnected)b.textContent='↻ Noch einmal hören'},duration+100)}
 else if(b.id==='read-partner')readPartnerInvitation();
 else if(b.id==='read-question')LerndachsSpeech.task(currentTask(),answerOrder)
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
window.Learning={chooseGrade,openTask(id,grade=progress.grade){roundCount=0;const path=paths.find(p=>p.items.some(q=>q[7].id===id&&q[7].grades.includes(grade)));if(!path)return false;const launch=()=>{progress.active=path.id;progress.index=tasksFor(path).findIndex(q=>q[7].id===id);progress.catalogueReturn=true;progress.worldMoves=[];persist();question()};if(progress.grade!==grade){chooseGrade(()=>{if(progress.grade===grade)launch()});pendingGrade=grade;content.querySelectorAll('[data-grade]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.grade)===grade));document.querySelector('#confirm-grade').disabled=false}else launch();return true},get progress(){return structuredClone(progress)},get currentTask(){return currentTask()},get currentTasks(){return currentTasks()},paths,sources,grades,openSubject(subject){const p=paths.find(p=>p.subject===subject);if(!progress.starterUnlocked||progress.opening!=='done'){starter();return}if(p){if(progress.grade===null)chooseGrade(()=>begin(p.id));else begin(p.id)}},nextFresh(manual=false){if(!progress.starterUnlocked||progress.opening!=='done'){starter();return}if(progress.grade===null){chooseGrade(()=>Learning.nextFresh(manual));return}const candidates=paths.flatMap(p=>tasksFor(p).filter(q=>!finished(q)).map(q=>({p,q})));if(!candidates.length){const all=paths.flatMap(p=>tasksFor(p).map(q=>({p,q})));const hit=LerndachsMissionProgress.recommend(all);if(hit){progress.active=hit.p.id;progress.index=tasksFor(hit.p).indexOf(hit.q);persist();question()}else newPractice();return}roundCount=0;const all=paths.flatMap(p=>tasksFor(p).map(q=>({p,q})));const hit=LerndachsMissionProgress.recommend(all);progress.lastMissionPath=hit.p.id;progress.catalogueReturn=false;progress.promptNumber=(progress.promptNumber||0)+1;progress.active=hit.p.id;progress.index=tasksFor(hit.p).indexOf(hit.q);progress.worldMoves=[];persist();question();if(manual)return;const note=document.createElement('p');note.className='timed-discovery-note';note.textContent='Zehn Minuten gespielt – eine neue Entdeckung wartet!';content.prepend(note)}};
if(!Number.isInteger(progress.grade)||!grades[progress.grade]){progress.grade=null;progress.active=null}
updateHUD();if(progress.starterUnlocked&&progress.active&&progress.opening==='done')seek();
})();
