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
 if(progress.grade===null){chooseGrade();return}if(progress.starterUnlocked){open();return}if(progress.starterEarned){packScreen();return}
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
function prepareMission(q){const need=({carry:['milo','tea'],water:['plant','watering'],left:['table','stool'],night:['sun']})[q[7].goal]||[];for(const id of need)J.bring(id);J.prepare(q[7].goal);Lernwelt.focus(q[0])}
function commonQuestion(q){const meta=q[7],p=active(),bounds=WorldArt.bounds[q[0]];return `<div class="question-heading"><span class="learn-eyebrow">${p.title} · ${grades[progress.grade].label}</span><span class="question-reward">✦ +${finished(q)?0:15}</span></div><div class="question-art ${p.color}"><svg viewBox="${bounds.join(' ')}" aria-hidden="true">${J.art(q[0])}</svg><span>${escape(q[6])}</span></div><p class="task-skill">${escape(meta.skill)}</p>${progress.together?`<p class="turn-label">Spieler ${progress.turn} spielt · Spieler ${progress.turn===1?2:1} hilft und erklärt.</p>`:''}<h2 id="learn-title">${escape(q[2])}</h2><div class="task-tools"><button id="read-question" class="read-button">♫ Vorlesen</button><button id="task-hint" class="read-button">✦ Kleiner Tipp</button>${meta.audio?'<button id="play-sample" class="sample-button">▶ Hörprobe</button>':''}</div>${meta.audio?'<p class="audio-note">Die Hörprobe schaltet den Ton ein. Höre beliebig oft oder wähle „Später“.</p>':''}<div id="task-hint-text" class="task-hint" hidden>${escape(meta.hint)}</div>`}
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
 for(const [n,name] of [[1,'Erster Schritt'],[5,'Ideensammler'],[20,'Weltgestalter'],[50,'Entdeckerprofi']])if(progress.done.length>=n&&!progress.badges.includes(name))progress.badges.push(name);persist();
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
 if(q[7].goal==='carry'&&objects.some(o=>o.id==='tea'&&objects.find(c=>c.uid===o.carrier)?.id==='milo'))completeWorld(q);
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
document.querySelector('#adventure-button').onclick=open;document.querySelector('#learn-button').onclick=open;
window.addEventListener('request-starter',starter);window.addEventListener('request-learning',open);
window.Learning={get progress(){return structuredClone(progress)},get currentTask(){return currentTask()},get currentTasks(){return currentTasks()},paths,sources,grades,nextFresh(){if(!progress.starterUnlocked)return;const candidates=paths.flatMap(p=>tasksFor(p).filter(q=>!finished(q)).map(q=>({p,q})));if(!candidates.length){newPractice();return}const hit=candidates[(progress.promptNumber||0)%candidates.length];progress.promptNumber=(progress.promptNumber||0)+1;progress.active=hit.p.id;progress.index=tasksFor(hit.p).indexOf(hit.q);progress.worldMoves=[];persist();question();const note=document.createElement('p');note.className='timed-discovery-note';note.textContent='Zehn Minuten gespielt – eine neue Entdeckung wartet!';content.prepend(note)}};
updateHUD();if(!Number.isInteger(progress.grade)||!grades[progress.grade]){progress.grade=null;chooseGrade()}else if(!progress.starterUnlocked)starter();else if(progress.active)seek();
})();
