/* Original procedural effects and three original algorithmic radio loops. */
(()=>{
let ctx,master,music,enabled=false,volume=.35,station=0,timer,step=0,playing=false,voices=0,water,sampleNodes=[];
const names=['Wiesenklang · Akustik','Pixelparty · Elektro','Mondcafé · Jazz'];
function init(){if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);music=ctx.createGain();music.gain.value=.28;music.connect(master)}ctx.resume().catch(()=>{});master.gain.setTargetAtTime(enabled?volume:0,ctx.currentTime,.03)}
function tone(hz,d=.2,type='sine',gain=.12,delay=0,dest=master){if(!ctx||voices>18)return;voices++;let o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+delay;o.type=type;o.frequency.setValueAtTime(Math.max(30,hz),t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(dest);o.start(t);o.stop(t+d+.02);o.onended=()=>{voices--;o.disconnect();g.disconnect()};return o}
function noise(d=.2,gain=.1,freq=1200){if(!ctx||voices>18)return;voices++;const n=ctx.createBufferSource(),b=ctx.createBuffer(1,ctx.sampleRate*d,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);n.buffer=b;const f=ctx.createBiquadFilter(),g=ctx.createGain();f.type='lowpass';f.frequency.value=freq;g.gain.value=gain;n.connect(f).connect(g).connect(master);n.start();n.onended=()=>{voices--;n.disconnect();f.disconnect();g.disconnect()};return n}
function effect(id){if(!enabled)return;init();if(['tea','jar','fishbowl'].includes(id)){tone(1300,.12,'sine',.1);tone(1920,.09,'sine',.04,.04)}else if(['books','plant','flower','hanging','tree','curtain','blanket'].includes(id))noise(.35,.16,2200);else if(['counter','watering','cloud'].includes(id))noise(.8,.19,650);else if(id==='balloon'){noise(.13,.4,450);tone(140,.12,'triangle',.25)}else if(id==='cat'){tone(330,.4,'triangle',.1);tone(440,.25,'sine',.08,.15)}else if(id==='dog'){tone(180,.16,'triangle',.1);tone(130,.2,'triangle',.08,.12)}else if(id==='rabbit'){noise(.22,.08,1800);tone(540,.12,'sine',.03)}else if(id==='camera'){noise(.05,.25,3500);noise(.12,.12,750)}else if(id==='clock'){[0,.08,.16,.24].forEach(t=>tone(900,.04,'square',.04,t))}else if(id==='guitar'){[196,246.94,293.66,392].forEach((h,i)=>tone(h,1.2,'triangle',.12,i*.04))}else if(['fridge','cabinet','toaster'].includes(id)){noise(.12,.2,300);tone(180,.12,'triangle',.08)}else if(id==='radio')noise(.2,.11,2200);else if(id==='reward'){[523,659,784,1046].forEach((h,i)=>tone(h,.4,'sine',.1,i*.09))}else tone(({sun:660,sofa:110,rug:140,stool:210,table:260,kettle:950,fruit:440})[id]||360,.18,'triangle',.12)}
function tick(){if(!playing||!enabled||document.hidden)return;init();const melodies=[[0,4,7,12,7,4,2,7,5,9,12,9,7,4,2,4],[0,12,7,3,10,7,15,12,0,7,12,15,10,7,3,7],[0,4,7,11,14,11,7,4,2,5,9,12,16,12,9,5]];let base=[196,220,146.83][station],n=melodies[station][step%16],hz=base*2**(n/12);tone(hz,[.7,.18,.45][station],['triangle','square','sine'][station],[.09,.035,.12][station],0,music);if(step%4===0)tone(base/2,.65,'sine',.14,0,music);if(station===2&&step%2===0){tone(hz*1.25,.4,'sine',.04,.06,music);tone(hz*1.5,.4,'sine',.04,.06,music)}step++}
function radio(on){playing=on;clearInterval(timer);if(on){if(!enabled)setEnabled(true);init();tick();timer=setInterval(tick,[320,180,420][station])}document.querySelector('#radio-dock').hidden=!on;document.querySelector('#radio-station').textContent=names[station]}
function setEnabled(on){enabled=on;init();const b=document.querySelector('#sound-toggle');b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?'Töne ausschalten':'Töne einschalten');b.style.opacity=on?'1':'.65';if(!on&&water){water.stop();water=null}}
document.querySelector('#sound-toggle').onclick=()=>{setEnabled(!enabled);if(enabled)effect('tea')};
document.querySelector('#radio-tune').onclick=()=>{station=(station+1)%3;effect('radio');step=0;radio(true)};
document.querySelector('#radio-power').onclick=()=>{for(const o of current().filter(o=>o.id==='radio'))o.on=false;save();radio(false)};
window.addEventListener('world-use',e=>{if(e.detail.id!=='counter')return;setTimeout(()=>{if(water){water.stop();water=null}if(!enabled||!current().find(o=>o.uid===e.detail.uid)?.on)return;init();const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*.03;water=ctx.createBufferSource();water.buffer=b;water.loop=true;const f=ctx.createBiquadFilter();f.frequency.value=900;water.connect(f).connect(master);water.start()},0)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)ctx?.suspend();else if(enabled)ctx?.resume()});
function stopSample(){for(const node of sampleNodes){try{node?.stop()}catch{}}sampleNodes=[]}
function playSample(sample){
 stopSample();setEnabled(true);radio(false);
 for(const o of current().filter(o=>o.id==='radio'))o.on=false;
 save();let duration=0;
 for(const [hz,durationSeconds,gain,delay] of sample.notes){sampleNodes.push(tone(hz,durationSeconds,'sine',gain,delay));duration=Math.max(duration,(delay+durationSeconds)*1000)}
 return duration;
}
window.WorldSound={effect,radio,playSample,stopSample,sync(){if(playing&&!current().some(o=>o.id==='radio'&&o.on))radio(false);if(water&&!current().some(o=>o.id==='counter'&&o.on)){water.stop();water=null}},setVolume(v){volume=Number(v);if(ctx)master.gain.setTargetAtTime(enabled?volume:0,ctx.currentTime,.05)},get status(){return {enabled,playing,station,volume,voices}}};
const obs=new MutationObserver(()=>{const c=document.querySelector('#panel-content');if(activePanel==='help'&&!document.querySelector('#volume-control')){const row=document.createElement('label');row.className='volume-setting';row.innerHTML='Lautstärke <input id="volume-control" type="range" min="0" max="0.7" step="0.05" value="'+volume+'">';c.append(row);row.querySelector('input').oninput=e=>WorldSound.setVolume(e.target.value)}});obs.observe(document.querySelector('#panel-content'),{childList:true});
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
 const g=grades[progress.grade];document.querySelector('#grade-button').textContent=g?g.label+' ⌄':'Klasse wählen ⌄';
 const b=document.querySelector('#adventure-button');b.querySelector('small').textContent=!progress.starterUnlocked?'DEIN EINZUG WARTET':progress.target?'DEIN SPARZIEL':'SPIEL DICH SCHLAU';
 const target=J.catalogue.find(i=>i.id===progress.target),balance=Lernwelt.snapshot().balance;
 b.querySelector('strong').textContent=!progress.starterUnlocked?progress.starterEarned?'Dein Paket ist da!':'Dein erstes Zuhause':target?target.name:'Ein kleines Abenteuer?';
 b.querySelector('em').textContent=!progress.starterUnlocked?progress.starterEarned?'Jetzt auspacken →':'Eine Aufgabe öffnet dein Einzugspaket →':target?balance>=target.price?'Ziel erreicht · Im Laden holen →':`${balance} / ${target.price} Sterne · noch ${Math.ceil((target.price-balance)/15)} Aufgaben →`:'Mit Dachs die Welt entdecken →';
}
window.addEventListener('world-saved',updateHUD);
function chooseGrade(){
 cleanup();mode='grades';pendingGrade=progress.grade;document.querySelector('#panel').close();
 content.innerHTML=`<div class="class-intro"><div class="guide-face">${badger}</div><p class="learn-eyebrow">WILLKOMMEN BEI LERNDACHS</p><h2 id="learn-title">Deine Klasse. Dein Abenteuer.</h2><p>Wo lernst du gerade? Ich suche passende Aufgaben für dich aus.</p><div class="class-grid" role="group" aria-label="Klasse auswählen">${Object.entries(grades).map(([id,g])=>`<button data-grade="${id}" aria-pressed="${pendingGrade===Number(id)}"><span>${id==='0'?'✿':id}</span><strong>${g.label}</strong><small>${g.note}</small></button>`).join('')}</div><button id="confirm-grade" class="journey-primary" ${pendingGrade===null?'disabled':''}>${progress.starterUnlocked?'Weiter in meine Welt →':'Mein Abenteuer starten →'}</button><p class="learning-footnote">Du kannst die Klasse später ändern. Dein Zuhause und deine Sterne bleiben erhalten.</p></div>`;
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
 content.innerHTML=`<div class="learn-intro"><div class="guide-face">${badger}</div><p class="learn-eyebrow">LERNDACHS · ${grades[progress.grade].label.toUpperCase()}</p><h2 id="learn-title">Welche Idee wächst heute?</h2><p>Eine neue gelöste Aufgabe bringt 15 Sterne. Daraus werden Möbel, Pflanzen und tierische Freunde.</p><div class="discovery-count">${n} / ${eligible.length} Aufgaben für ${grades[progress.grade].label} entdeckt</div></div>${targetCard()}<div class="journey-options"><button id="change-grade">${grades[progress.grade].label} ändern ⌄</button><button id="together-toggle" aria-pressed="${progress.together}">${progress.together?'✓ Wir spielen zu zweit':'♡ Gemeinsam spielen'}</button></div>${progress.together?'<p class="together-note">Ein Gerät, zwei Ideen: Eine Person spielt, die andere erklärt oder hilft. Nach einer neuen gelösten Aufgabe tauscht ihr die Rollen.</p>':''}<div class="path-grid">${paths.map(p=>{
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
 const q=currentTask();if(!q)return;document.querySelector('#panel').close();cleanup();mode='question';correct=false;worldAttemptDone=false;document.querySelector('#learn-close').hidden=false;
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
 if(correct)return;correct=true;stopSample();const already=finished(q);J.reward(taskKey(q));if(!already)window.dispatchEvent(new Event('character-celebrate'));
 const feedback=document.querySelector('#answer-feedback');feedback.classList.add('correct-feedback');feedback.textContent='Geschafft! '+q[5]+(already?'':' +15 Sterne für deine Welt.');
 document.querySelector('#next-question').hidden=false;document.querySelector('#skip-question').hidden=true;content.querySelectorAll('[data-answer],#check-garden,#enter-world-task').forEach(b=>b.disabled=true);WorldSound.effect('reward');
 for(const [n,name] of [[1,'Erster Schritt'],[5,'Ideensammler'],[20,'Weltgestalter'],[50,'Entdeckerprofi']])if(progress.done.length>=n&&!progress.badges.includes(name))progress.badges.push(name);persist();
}
function answer(i){if(correct)return;const q=currentTask(),button=content.querySelector(`[data-answer="${i}"]`);if(i!==q[4]){button.classList.add('try-again');button.disabled=true;document.querySelector('#answer-feedback').textContent='Noch nicht ganz. '+q[7].hint+' Probiere es noch einmal.';WorldSound.effect('tea');return}button.classList.add('is-correct');success(q)}
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
 else{memoryBusy=true;document.querySelector('#answer-feedback').textContent='Diese beiden gehören nicht zusammen. Merke dir ihre Plätze und probiere weiter.';memoryTimer=setTimeout(()=>{a.open=b.open=false;memoryOpen=[];memoryBusy=false;if(mode==='question'&&currentTask()?.[7].type==='memory')renderMemory()},900)}
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
 else if(b.dataset.introAnswer!==undefined){if(correct)return;const q=LerndachsIntro[progress.grade];if(Number(b.dataset.introAnswer)===q[2]){correct=true;progress.starterEarned=true;persist();WorldSound.effect('reward');packScreen()}else{b.disabled=true;b.classList.add('try-again');document.querySelector('#intro-feedback').textContent='Noch nicht ganz. Schau dir die Kisten oder die Zahlen in Ruhe an und versuche es erneut.'}}
 else if(b.id==='claim-starter'){if(J.grantStarter()){close();resetStrip();toast('12 Dinge ausgepackt. Dein Zuhause wächst jetzt mit deinen Ideen!')}}
 else if(b.dataset.path)begin(b.dataset.path);
 else if(b.dataset.answer!==undefined)answer(Number(b.dataset.answer));
 else if(b.dataset.memory!==undefined)memoryFlip(Number(b.dataset.memory));
 else if(b.id==='change-grade')chooseGrade();
 else if(b.id==='together-toggle'){progress.together=!progress.together;persist();menu()}
 else if(b.id==='target-shop'||b.id==='finish-shop'){close();const t=J.catalogue.find(i=>i.id===progress.target);J.showShop(t?.kind==='pet'?'pets':'decor')}
 else if(b.id==='start-practice')newPractice();
 else if(b.id==='enter-world-task'){prepareMission(currentTask());close();toast(currentTask()[2])}
 else if(b.id==='garden-add'&&!correct){gardenCount=Math.min(24,gardenCount+1);renderGarden()}
 else if(b.id==='garden-remove'&&!correct){gardenCount=Math.max(0,gardenCount-1);renderGarden()}
 else if(b.id==='check-garden'){if(gardenCount===gardenTarget())success(currentTask());else document.querySelector('#answer-feedback').textContent='Dein Beet hat '+gardenCount+' Samen. Lies den Auftrag noch einmal und verändere die Menge.'}
 else if(b.id==='next-question'||b.id==='skip-question')next();
 else if(b.id==='question-back')close();
 else if(b.id==='finish-menu')menu();
 else if(b.id==='curriculum-info')curriculumInfo();
 else if(b.id==='task-hint'){const hint=document.querySelector('#task-hint-text');hint.hidden=!hint.hidden;b.setAttribute('aria-expanded',!hint.hidden)}
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
document.querySelector('#grade-button').onclick=chooseGrade;
document.querySelector('#adventure-button').onclick=open;document.querySelector('#learn-button').onclick=open;
window.addEventListener('request-starter',starter);window.addEventListener('request-learning',open);
window.Learning={get progress(){return structuredClone(progress)},get currentTask(){return currentTask()},get currentTasks(){return currentTasks()},paths,sources,grades};
updateHUD();chooseGrade();
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
const people=()=>[...document.querySelectorAll('#objects [data-kind="milo"],#objects [data-kind="lumi"]')];
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
 const uid=el.dataset.uid;
 // Objects held at a fixed hand position should not be left floating during a hop.
 const snapshot=window.Lernwelt?.snapshot();
 const objects=snapshot?.placed?Object.values(snapshot.placed).flat():[];
 const carrying=(Array.isArray(objects)?objects:[]).some(o=>o.carrier===uid);
 if(carrying)type='look';
 const start=performance.now()+delay;
 active.set(uid,{type,start,end:start+1800});sync();
}
window.addEventListener('world-use',({detail})=>{
 if(!['milo','lumi'].includes(detail.id))return;
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
