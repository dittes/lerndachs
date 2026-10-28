/* The world has one quiet invitation: a badger head, with no floating action tray. */
(()=>{
const head=document.querySelector('#adventure-button');head.title='Mit Dachs Sterne sammeln';
function refresh(){head.hidden=LerndachsJourney.profile.opening!=='done';const waiting=!document.querySelector('#learning-dialog').open;head.classList.toggle('has-task',waiting);head.setAttribute('aria-label','Mit Dachs Sterne sammeln')}
window.addEventListener('world-saved',refresh);window.addEventListener('task-waiting',refresh);document.querySelector('#learning-dialog').addEventListener('close',refresh);refresh();
})();
