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
  function terrace() {
    return r(1600,514,752,386,'#e8b98f',0,'none')+p('M1600 516h752v368','none','#ad7e60',5)+
      [565,621,681,746,817,890].map(y=>p(`M1600 ${y}h751`,'none','#c89774',2)).join('')+
      [[1740,516,565],[2100,516,565],[1880,565,621],[2240,565,621],[1650,621,681],[2040,621,681],[1790,681,746],[2210,681,746],[1960,746,817],[1690,817,890],[2150,817,890]].map(([x,y,z])=>p(`M${x} ${y}v${z-y}`,'none','#c89774',2)).join('')+
      [[1680,590],[2070,785],[2260,850],[1830,850]].map(([x,y])=>p(`M${x} ${y}q17-5 34 0m-26 6h15`,'none','#d5a27b',2)).join('')+
      p('M2352 519v381','none',C.ink,3)+p('M2360 535v365','none','#f2d2a5',13)+
      // A light pergola frames the sky; the walking area stays open.
      p('M1660 515V217m590 298V217','none',C.ink,12)+p('M1660 515V217m590 298V217','none',C.wood,6)+
      p('M1628 220h655','none',C.ink,14)+p('M1628 220h655','none','#edc292',8)+
      p('M1680 235q268 105 546 0','none',C.ink,2.5)+[1701,1780,1860,1940,2020,2100,2180].map((x,i)=>g(p('M-8 0v15q8 11 16 0V0Z',i%3===0?C.coral:i%3===1?C.cream:C.yellow,C.ink,2.3),`translate(${x} ${247+Math.sin((x-1680)/546*Math.PI)*42})`)).join('')+
      // Woven outdoor bench, tucked against the back of the deck.
      g(e(0,8,164,17,'#363c4818')+p('M-128-20v36m256-36v36','none',C.ink,9)+r(-147,-142,294,125,C.cream,21)+r(-134,-128,268,67,'#a8d7bd',13)+[-104,-68,-32,4,40,76,112].map(x=>p(`M${x}-119v49`,'none','#7fb8a0',3)).join('')+r(-141,-66,282,47,C.mint,12)+r(-157,-100,23,90,C.wood,9)+r(134,-100,23,90,C.wood,9)+g(r(-33,-35,66,65,C.coral,13)+p('M-18-19l36 36m-36-15 15 15m6-36 15 15','none',C.cream,3),'translate(-86 -85) rotate(-10)')+g(r(-30,-32,60,61,C.yellow,13)+e(0,-2,13,13,C.cream,C.ink,2.5),'translate(88 -86) rotate(9)'), 'translate(1963 589)')+
      // Small round table and a tray of lemonade.
      g(e(0,11,78,12,'#363c4815')+p('M-46-56-57 8m103-64L57 8','none',C.ink,10)+p('M-46-56-57 8m103-64L57 8','none',C.wood,5)+e(0,-61,89,27,C.wood,C.ink)+e(0,-68,89,24,C.cream,C.ink)+e(0,-70,49,13,C.coral,C.ink,2.5)+r(-27,-108,22,36,'#fff3d7',4,C.ink,2.5)+r(8,-102,21,31,'#fff3d7',4,C.ink,2.5)+p('M-16-103v-16l10-4m25 25v-16l10-4','none',C.deep,2.5)+p('M-23-89h15m20 4h13','none',C.yellow,6),'translate(2095 722)')+
      // Floor cushion and potted foliage leave a broad route through the middle.
      g(e(0,4,69,13,'#363c4815')+p('M-65-17Q-65-55 0-50T65-17Q61 5 0 6T-65-17Z',C.purple)+p('M-48-18q48 20 96 0','none','#dfd2ed',3)+e(0,-24,5,3,C.cream,C.ink,2),'translate(1821 813)')+
      pot(1690,592,1.05)+pot(2293,806,1.15,C.pink)+
      // Sandals, a sun hat, and a woven basket suggest an afternoon outside.
      g(e(-12,0,12,23,C.coral,C.ink,2.5)+e(15,-8,12,23,C.yellow,C.ink,2.5)+p('M-22-5q10-14 20 0m3-8q10-14 21 0','none',C.cream,5),'translate(1652 847) rotate(-15)')+
      g(e(0,0,43,14,C.yellow,C.ink,2.8)+p('M-25-3v-18q25-28 50 0v18Z',C.yellow)+p('M-25-6q25 10 50 0','none',C.coral,6),'translate(2206 578) rotate(8)');
  }
  function raisedBed() {
    return g(e(0,12,168,18,'#363c4817')+r(-157,-54,314,81,C.wood,10)+p('M-157-22h314m-296 16h277','none','#b98360',2.5)+p('M-137 26v-83m274 83v-83','none',C.ink,5)+e(0,-55,157,35,'#e8b58b',C.ink)+e(0,-57,141,25,'#8a6754',C.ink,2.5)+[-99,-33,33,99].map((x,i)=>g(p('M0 0v-45','none',C.deep,3)+leaf(0,-12,-70,.8)+leaf(0,-27,65,.85)+(i%2?bloom(0,-48,.65,C.pink):leaf(0,-43,-10,.7,'#b1d99e')),`translate(${x} -61)`)).join('')+p('M-121 5h18m100 0h18m100 0h18','none','#f4d0a4',3),'translate(3098 759)');
  }
  function garden() {
    let a = '';
    // The winding path meets the full, unobstructed edge of the terrace.
    a += p('M2359 762Q2509 783 2600 708T2775 622Q2852 610 2884 557','none','#789e77',103);
    a += p('M2359 754Q2509 775 2600 700T2775 614Q2852 602 2884 549','none','#ecd3a9',89);
    a += [[2415,754,22,9],[2501,745,25,9],[2582,704,24,10],[2640,667,22,9],[2721,625,20,8],[2800,606,17,8]].map(([x,y,rx,ry])=>e(x,y,rx,ry,'#f8e5bf','#ceb188',2)).join('');
    a += tree(2668,574,1.13,true)+tree(3436,579,1.25);
    // Birdhouse on its own post, with an open round entry and a tiny perch.
    a += g(e(0,6,53,9,'#363c4814')+p('M0 0v-138','none',C.ink,10)+p('M0 0v-138','none',C.wood,5)+r(-38,-209,76,77,C.cream,5)+p('M-49-207 0-252 49-207Z',C.coral)+e(0,-180,14,15,C.ink)+p('M-18-151h36','none',C.ink,4)+p('M-26-135h52','none',C.wood,6)+p('M-26-233 0-257 26-233','none',C.cream,3),'translate(3285 601)');
    a += raisedBed();
    // A watering can rests next to the planting bed.
    a += g(e(0,8,41,7,'#363c4814')+p('M20-43q40-17 35 12-2 11-24 12','none',C.ink,8)+p('M20-43q40-17 35 12-2 11-24 12','none',C.mint,3)+p('M-27-34-56-53-61-44-29-11Z',C.mint)+r(-30,-49,63,52,C.mint,12)+e(0,-49,30,8,'#a3d9bd',C.ink,2.5)+p('M-57-55-65-40','none',C.ink,5)+p('M-19-24q19 8 38 0','none',C.cream,3),'translate(3325 808) rotate(8)');
    a += g(p('M-45 0Q-66-24-44-48Q-46-82-12-81Q6-107 30-79Q67-84 62-48Q88-17 55 1Z','#82bfa0')+leaf(-26,-15,-30,.8,'#b0d7a2')+leaf(29,-30,65,.8,'#b0d7a2'),'translate(2477 604)');
    const flowers=[[2443,854,.7,C.cream],[2481,869,.55,C.coral],[2530,843,.65,C.pink],[2736,832,.75,C.cream],[2770,850,.6,C.yellow],[2820,807,.7,C.pink],[3379,698,.7,C.cream],[3423,721,.8,C.coral],[3470,698,.65,C.cream],[3516,748,.65,C.pink],[3530,849,.8,C.cream],[3452,868,.55,C.yellow],[2928,558,.5,C.cream]];
    a += flowers.map(([x,y,s,c])=>bloom(x,y,s,c)).join('');
    a += [[2411,618],[2600,849],[2685,763],[2848,869],[2917,832],[3214,605],[3354,876],[3546,613],[3536,784]].map(([x,y])=>p(`M${x-9} ${y}l-3-9m12 8 1-14m5 14 7-9`,'none','#659d79',2.5)).join('');
    // Friendly small garden discoveries, with no characters or labels.
    a += g(e(0,3,27,5,'#363c4813')+p('M-20 0v-16q0-24 17-24t17 24V0Z',C.cream)+p('M-31-22q4-26 28-26t28 26Z',C.coral)+e(-11,-32,4,3,C.cream)+e(5,-38,4,3,C.cream)+e(13,-28,3,3,C.cream),'translate(3513 576)');
    a += g(p('M-3 0Q-30-24-21-35Q-4-42 0-12Q5-44 23-34Q33-19 3 0Q29-7 24 9Q12 24 1 4Q-11 24-24 10Q-31-6-3 0Z',C.yellow,C.ink,2.3)+p('M0-7v17m-2-19-6-7m10 7 6-7','none',C.ink,2),'translate(2864 423) rotate(-17)');
    a += g(p('M-3 0Q-30-24-21-35Q-4-42 0-12Q5-44 23-34Q33-19 3 0Q29-7 24 9Q12 24 1 4Q-11 24-24 10Q-31-6-3 0Z',C.pink,C.ink,2.3)+p('M0-7v17','none',C.ink,2),'translate(3175 480) rotate(22) scale(.65)');
    return a;
  }
  function render() {
    return `<g class="outdoors garden-art" aria-hidden="true">`+
      r(1600,0,2000,900,C.sky,0,'none')+
      e(3114,122,47,47,C.yellow)+
      p('M1775 133q-3-21 20-23 5-26 31-16 18-12 32 8 27-3 31 20 0 12-20 12Z',C.white,'none')+
      p('M2821 191q-4-20 20-22 6-27 32-18 20-14 35 9 28-1 29 21 0 12-20 12Z',C.white,'none')+
      p('M1600 414q179-104 353-37t361-2 366-32 354 4 566 21V900H1600Z','#b5d5ae','none')+
      p('M1600 477q245-97 476-18t468-21 477-3 579-7V900H1600Z','#93bea1','none')+
      // A low distant fence has an opening behind the garden path.
      p('M2420 450h310m240 0h630','none','#759e8b',5)+[2440,2500,2560,2620,2680,3000,3060,3120,3180,3240,3300,3360,3420,3480,3540].map(x=>p(`M${x} 432v47`,'none','#759e8b',6)).join('')+
      p('M2352 530q311-44 603 6 304-42 645-8v372H2352Z','#aed092','none')+
      p('M2381 841q168-69 324-6 185 55 351 8 255-81 544-21v78H2381Z','#9bc284','none')+
      terrace()+garden()+'</g>';
  }
  window.LerndachsGardenArt = Object.freeze({render});
})();
