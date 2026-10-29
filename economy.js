/* Local prototype economy. No trusted reward verification or real payments. */
(function(root){
'use strict';
function credit(state,{receiptId,stars}={}){
 if(typeof receiptId!=='string'||receiptId.length<1||receiptId.length>200||!Number.isSafeInteger(stars)||stars<1||stars>1000)throw new TypeError('Ungültige Belohnung');
 if(state.receipts.includes(receiptId))return {credited:false,balance:state.balance};
 if(!Number.isSafeInteger(state.balance+stars))throw new RangeError('Sternelimit erreicht');
 const from=state.balance;state.balance+=stars;state.receipts.push(receiptId);if(typeof window!=='undefined'&&window.dispatchEvent)window.dispatchEvent(new CustomEvent('stars-earned',{detail:{from,to:state.balance,stars,receiptId}}));return {credited:true,balance:state.balance};
}
function purchase(state,item){
 if(!item||typeof item.id!=='string'||!Number.isSafeInteger(item.price)||item.price<0)throw new TypeError('Ungültiger Artikel');
 if(state.owned.includes(item.id)&&!item.repeatable)return {purchased:false,reason:'owned'};
 if(state.balance<item.price)return {purchased:false,reason:'insufficient'};
 state.balance-=item.price;if(!state.owned.includes(item.id))state.owned.push(item.id);return {purchased:true,balance:state.balance};
}
const api=Object.freeze({credit,purchase});if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WunderEconomy=api;
})(typeof window!=='undefined'?window:globalThis);
