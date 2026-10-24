/* The world has one quiet invitation: a badger head, with no floating action tray. */
(()=>{
const head=document.querySelector('#adventure-button');head.title='Eine neue Aufgabe entdecken';
function refresh(){head.hidden=false;const waiting=!document.querySelector('#learning-dialog').open;head.classList.toggle('has-task',waiting);const q=Learning.currentTask;head.setAttribute('aria-label',q?'Aufgabe anzeigen: '+q[1]:'Nächste Aufgabe entdecken')}
window.addEventListener('world-saved',refresh);window.addEventListener('task-waiting',refresh);document.querySelector('#learning-dialog').addEventListener('close',refresh);refresh();
})();
