/* Original Kunterbunt terrace and garden. No IDs, external assets or setup required. */
(() => {
  'use strict';
  const C = {ink:'#363c48',cream:'#fff3d7',white:'#fffdf4',mint:'#79c5ad',deep:'#4b978b',pink:'#eeb5ca',coral:'#f29880',yellow:'#f6cc72',purple:'#b4a4d3',sky:'#bde4e8',wood:'#dca577'};
  const p = (d,f='none',s=C.ink,w=3.2) => `<path d="${d}" fill="${f}" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const e = (x,y,rx,ry,f,s='none',w=3.2) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" stroke="${s}" stroke-width="${w}"/>`;
  const r = (x,y,w,h,f,rad=0,s=C.ink,sw=3.2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${f}" stroke="${s}" stroke-width="${sw}"/>`;
  const g = (s,t='') => `<g transform="${t}">${s}</g>`;
  const leaf = (x,y,a=0,s=1,col=C.mint) => g(p('M0 0Q-24-5-20-29Q8-29 0 0Z',col)+p('M0 0-12-20','none',C.deep,2),`translate(${x} ${y}) rotate(${a}) scale(${s})`);
  function bloom(x,y,s=1,color=C.cream) {
    return g(p('M0 0v34','none',C.deep,3)+leaf(0,25,-75,.45)+[0,72,144,216,288].map(a=>g(e(0,-10,8,12,color,C.ink,2.3),`rotate(${a})`)).join('')+e(0,0,7,7,C.yellow,C.ink,2.3),`translate(${x} ${y}) scale(${s})`);
  }
  function tree(x,y,s=1,fruit=false) {
    return g(e(0,5,103,16,'#363c4812')+p('M-15-7-12-162h30L20-7Z','#be8e69')+p('M2-80-35-128m38 15 34-37','none',C.ink,6)+p('M-75-107Q-128-113-118-170Q-151-216-109-253Q-106-308-49-309Q-9-352 35-312Q96-332 112-278Q163-247 130-203Q150-147 97-133Q80-79 32-102Q-21-72-75-107Z',C.mint)+p('M-104-220Q-87-253-61-248m78-58q33-6 48 17m28 139q18-7 18-27','none','#b8dfb0',5)+leaf(-58,-151,-20,.8,'#a4d6aa')+leaf(55,-245,72,.8,'#a4d6aa')+(fruit?[[-67,-224],[-18,-278],[64,-210],[23,-150]].map(([a,b])=>e(a,b,12,13,C.coral,C.ink,2.6)+p(`M${a} ${b-12}l3-7`,'none',C.ink,2)).join(''):''),`translate(${x} ${y}) scale(${s})`);
  }
  function pot(x,y,s=1,color=C.coral) {
    return g(e(0,3,39,7,'#363c4815')+p('M0-54v-72','none',C.deep,4)+leaf(0,-68,-70,.9)+leaf(0,-92,65,1.1)+leaf(0,-113,-20,.9)+p('M-35-51h70L26-4Q0 6-26-4Z',color)+r(-39,-58,78,14,color,5)+p('M-24-31q24 7 48 0','none',C.cream,4),`translate(${x} ${y}) scale(${s})`);
  }
  function raisedBed() {
    return g(e(0,12,168,18,'#363c4817')+r(-157,-54,314,81,C.wood,10)+p('M-157-22h314m-296 16h277','none','#b98360',2.5)+p('M-137 26v-83m274 83v-83','none',C.ink,5)+e(0,-55,157,35,'#e8b58b',C.ink)+e(0,-57,141,25,'#8a6754',C.ink,2.5)+[-99,-33,33,99].map((x,i)=>g(p('M0 0v-45','none',C.deep,3)+leaf(0,-12,-70,.8)+leaf(0,-27,65,.85)+(i%2?bloom(0,-48,.65,C.pink):leaf(0,-43,-10,.7,'#b1d99e')),`translate(${x} -61)`)).join('')+p('M-121 5h18m100 0h18m100 0h18','none','#f4d0a4',3),'translate(0 0)');
  }
  const artFns = {
    'yard-bench': () => e(0,8,164,17,'#363c4818')+p('M-128-20v36m256-36v36','none',C.ink,9)+r(-147,-142,294,125,C.cream,21)+r(-134,-128,268,67,'#a8d7bd',13)+[-104,-68,-32,4,40,76,112].map(x=>p(`M${x}-119v49`,'none','#7fb8a0',3)).join('')+r(-141,-66,282,47,C.mint,12)+r(-157,-100,23,90,C.wood,9)+r(134,-100,23,90,C.wood,9)+g(r(-33,-35,66,65,C.coral,13)+p('M-18-19l36 36m-36-15 15 15m6-36 15 15','none',C.cream,3),'translate(-86 -85) rotate(-10)')+g(r(-30,-32,60,61,C.yellow,13)+e(0,-2,13,13,C.cream,C.ink,2.5),'translate(88 -86) rotate(9)'),
    'yard-table': () => e(0,11,78,12,'#363c4815')+p('M-46-56-57 8m103-64L57 8','none',C.ink,10)+p('M-46-56-57 8m103-64L57 8','none',C.wood,5)+e(0,-61,89,27,C.wood,C.ink)+e(0,-68,89,24,C.cream,C.ink)+p('M-49-71q43-11 96 0','none','#d9b98e',3),
    'yard-lemonade': () => e(0,2,26,7,C.coral,C.ink,2.5)+r(-18,-49,36,46,C.cream,5,C.ink,2.5)+p('M-13-24h26','none',C.yellow,16)+p('M5-34v-29l13-6','none',C.deep,3)+e(-14,-40,10,10,C.yellow,C.ink,2.3)+p('M-20-40h12m-6-6v12','none',C.cream,2),
    'yard-pot': () => pot(0,0),
    'yard-pot-pink': () => pot(0,0,1,C.pink),
    'yard-tree': () => tree(0,0,1,true),
    'yard-tree-mint': () => tree(0,0,1,false),
    'yard-birdhouse': () => e(0,6,53,9,'#363c4814')+p('M0 0v-138','none',C.ink,10)+p('M0 0v-138','none',C.wood,5)+r(-38,-209,76,77,C.cream,5)+p('M-49-207 0-252 49-207Z',C.coral)+e(0,-180,14,15,C.ink)+p('M-18-151h36','none',C.ink,4)+p('M-26-135h52','none',C.wood,6)+p('M-26-233 0-257 26-233','none',C.cream,3),
    'yard-bed': raisedBed,
    'yard-watering': () => e(0,8,41,7,'#363c4814')+p('M20-43q40-17 35 12-2 11-24 12','none',C.ink,8)+p('M20-43q40-17 35 12-2 11-24 12','none',C.mint,3)+p('M-27-34-56-53-61-44-29-11Z',C.mint)+r(-30,-49,63,52,C.mint,12)+e(0,-49,30,8,'#a3d9bd',C.ink,2.5)+p('M-57-55-65-40','none',C.ink,5)+p('M-19-24q19 8 38 0','none',C.cream,3),
    'yard-flowers': () => bloom(-30,-39,.7,C.cream)+bloom(0,-55,.85,C.pink)+bloom(33,-28,.65,C.coral),
    'yard-butterfly': () => p('M-3 0Q-30-24-21-35Q-4-42 0-12Q5-44 23-34Q33-19 3 0Q29-7 24 9Q12 24 1 4Q-11 24-24 10Q-31-6-3 0Z',C.yellow,C.ink,2.3)+p('M0-7v17m-2-19-6-7m10 7 6-7','none',C.ink,2),
    'yard-sun': () => [0,45,90,135,180,225,270,315].map(a=>g(p('M0-61v-12','none',C.yellow,5),`rotate(${a})`)).join('')+e(0,0,47,47,C.yellow,C.ink)+p('M-16-7v4m32-4v4m-25 15q9 9 18 0','none',C.ink,3)+e(-28,9,7,4,C.coral)+e(28,9,7,4,C.coral),
    'yard-lights': () => p('M-273-53q268 105 546 0','none',C.ink,2.5)+[-252,-173,-93,-13,67,147,227].map((x,i)=>g(p('M-8 0v15q8 11 16 0V0Z',i%3===0?C.coral:i%3===1?C.cream:C.yellow,C.ink,2.3),`translate(${x} ${-41+Math.sin((x+273)/546*Math.PI)*42})`)).join(''),
    'yard-cushion': () => e(0,4,69,13,'#363c4815')+p('M-65-17Q-65-55 0-50T65-17Q61 5 0 6T-65-17Z',C.purple)+p('M-48-18q48 20 96 0','none','#dfd2ed',3)+e(0,-24,5,3,C.cream,C.ink,2),
    'yard-hat': () => e(0,0,43,14,C.yellow,C.ink,2.8)+p('M-25-3v-18q25-28 50 0v18Z',C.yellow)+p('M-25-6q25 10 50 0','none',C.coral,6),
    'yard-mushroom': () => e(0,3,27,5,'#363c4813')+p('M-20 0v-16q0-24 17-24t17 24V0Z',C.cream)+p('M-31-22q4-26 28-26t28 26Z',C.coral)+e(-11,-32,4,3,C.cream)+e(5,-38,4,3,C.cream)+e(13,-28,3,3,C.cream)
  };
  const bounds = {
    'yard-bench':[-166,-145,332,172], 'yard-table':[-92,-95,184,120], 'yard-lemonade':[-29,-72,58,83],
    'yard-pot':[-42,-145,84,158], 'yard-pot-pink':[-42,-145,84,158],
    'yard-tree':[-140,-336,283,360], 'yard-tree-mint':[-140,-336,283,360],
    'yard-birdhouse':[-56,-260,112,278], 'yard-bed':[-171,-160,342,191],
    'yard-watering':[-69,-60,132,78], 'yard-flowers':[-49,-76,98,81], 'yard-butterfly':[-28,-39,57,62],
    'yard-sun':[-77,-77,154,154], 'yard-lights':[-276,-57,552,87],
    'yard-cushion':[-72,-55,144,75], 'yard-hat':[-46,-44,92,61], 'yard-mushroom':[-34,-51,68,62]
  };
  const names = {
    'yard-bench':'Terrassenbank','yard-table':'Gartentisch','yard-lemonade':'Zitronenlimonade',
    'yard-pot':'Terrassenpflanze','yard-pot-pink':'Rosafarbener Blumentopf','yard-tree':'Apfelbaum','yard-tree-mint':'Gartenbaum',
    'yard-birdhouse':'Vogelhäuschen','yard-bed':'Kräuterbeet','yard-watering':'Gießkanne','yard-flowers':'Bunte Gartenblumen',
    'yard-butterfly':'Schmetterling','yard-sun':'Gartensonne','yard-lights':'Lichterkette','yard-cushion':'Gartenkissen','yard-hat':'Sonnenhut','yard-mushroom':'Kleiner Gartenpilz'
  };
  const behaviours = {
    'yard-bench':'sit','yard-table':'tap','yard-lemonade':'drink','yard-pot':'grow','yard-pot-pink':'grow',
    'yard-tree':'sway','yard-tree-mint':'sway','yard-birdhouse':'chirp','yard-bed':'grow','yard-watering':'water',
    'yard-flowers':'grow','yard-butterfly':'flutter','yard-sun':'shine','yard-lights':'chime','yard-cushion':'bounce','yard-hat':'wear','yard-mushroom':'bounce'
  };
  function objects() {
    const placements = [
      ['sun','yard-sun',1514,122,1,0],['lights','yard-lights',405,288,1,0.5],
      ['apple','yard-tree',1080,574,1.13,1],['tree','yard-tree-mint',1830,579,1.14,1],
      ['birdhouse','yard-birdhouse',1670,601,1,1.5],['bench','yard-bench',405,589,1,2],
      ['pot','yard-pot',103,592,1.05,2],['hat','yard-hat',625,578,1,2.1],
      ['table','yard-table',575,722,1,3],['lemonade','yard-lemonade',575,654,1,3.1],
      ['cushion','yard-cushion',245,813,1,3],['pot-pink','yard-pot-pink',760,806,1.15,3],
      ['bed','yard-bed',1500,759,1,3],['watering','yard-watering',1730,808,1,3.2],
      ['flowers-a','yard-flowers',970,871,1,3],['flowers-b','yard-flowers',1200,849,1,3],
      ['flowers-c','yard-flowers',1830,743,1,3],['flowers-d','yard-flowers',1880,880,1,3],
      ['mushroom','yard-mushroom',1913,576,1,2],
      ['butterfly-a','yard-butterfly',1270,423,1,4],['butterfly-b','yard-butterfly',1580,480,.7,4]
    ];
    return placements.map(([uid,id,x,y,s,layer])=>({uid:'yard-'+uid,id,x,y,s,layer}));
  }
  function background() {
    return '<g class="garden-background" aria-hidden="true">'+r(0,0,2000,900,C.sky,0,'none')+
      p('M175 133q-3-21 20-23 5-26 31-16 18-12 32 8 27-3 31 20 0 12-20 12Z',C.white,'none')+
      p('M1221 191q-4-20 20-22 6-27 32-18 20-14 35 9 28-1 29 21 0 12-20 12Z',C.white,'none')+
      p('M0 414q179-104 353-37t361-2 366-32 354 4 566 21V900H0Z','#b5d5ae','none')+
      p('M0 477q245-97 476-18t468-21 477-3 579-7V900H0Z','#93bea1','none')+
      p('M920 450h210m240 0h630','none','#759e8b',5)+[940,1000,1060,1400,1460,1520,1580,1640,1700,1760,1820,1880,1940].map(x=>p(`M${x} 432v47`,'none','#759e8b',6)).join('')+
      p('M850 530q311-44 550 6 300-42 600-8v372H850Z','#aed092','none')+
      p('M850 841q168-69 324-6 185 55 351 8 255-81 475-21v78H850Z','#9bc284','none')+
      p('M849 762Q1009 783 1100 708T1275 622Q1352 610 1384 557','none','#789e77',103)+
      p('M849 754Q1009 775 1100 700T1275 614Q1352 602 1384 549','none','#ecd3a9',89)+
      [[915,754,22,9],[1001,745,25,9],[1082,704,24,10],[1140,667,22,9],[1221,625,20,8],[1300,606,17,8]].map(([x,y,rx,ry])=>e(x,y,rx,ry,'#f8e5bf','#ceb188',2)).join('')+
      r(0,514,850,386,'#e8b98f',0,'none')+p('M0 516h850v368','none','#ad7e60',5)+
      [565,621,681,746,817,890].map(y=>p(`M0 ${y}h850`,'none','#c89774',2)).join('')+
      [[140,516,565],[500,516,565],[280,565,621],[640,565,621],[50,621,681],[440,621,681],[190,681,746],[610,681,746],[360,746,817],[90,817,890],[550,817,890]].map(([x,y,z])=>p(`M${x} ${y}v${z-y}`,'none','#c89774',2)).join('')+
      [[80,590],[470,785],[660,850],[230,850]].map(([x,y])=>p(`M${x} ${y}q17-5 34 0m-26 6h15`,'none','#d5a27b',2)).join('')+
      p('M850 519v381','none',C.ink,3)+p('M858 535v365','none','#f2d2a5',13)+
      p('M60 515V217m690 298V217','none',C.ink,12)+p('M60 515V217m690 298V217','none',C.wood,6)+
      p('M28 220h755','none',C.ink,14)+p('M28 220h755','none','#edc292',8)+
      [[911,618],[1000,849],[1085,763],[1248,869],[1317,832],[1614,605],[1754,876],[1946,613],[1936,784]].map(([x,y])=>p(`M${x-9} ${y}l-3-9m12 8 1-14m5 14 7-9`,'none','#659d79',2.5)).join('')+'</g>';
  }
  function art(id) {return artFns[id] ? artFns[id]() : '';}
  window.LerndachsGardenArt = Object.freeze({width:2000,height:900,background,objects,art,bounds,names,behaviours});
})();
