---
layout: sesh
title: Cancer cycle
nav: science
heading: Cancer cycle
intro: Explore how a cell moves through the cycle and how damage affects checkpoints.
parent: Science
parent_url: /sesh/science
permalink: /sesh/science/cancer-cycle
---
<section class="section wrap">
  <div class="cycle-lab">
    <div class="card">
      <h2>Cell cycle</h2>
      <canvas id="cycle-canvas" class="cycle-canvas" width="680" height="420" aria-label="Animated cell cycle diagram"></canvas>
      <div class="lab-status">
        <div><strong id="cycle-hits">0</strong>Disruptors</div>
        <div><strong id="cycle-mutation">0%</strong>Mutation load</div>
      </div>
    </div>
    <div class="cycle-panel">
      <div class="card">
        <h2 id="phase-title">G1 Phase</h2>
        <p id="phase-info">The cell grows and decides whether to commit to division.</p>
        <div class="phase-grid" id="phase-buttons"></div>
      </div>
      <div class="card">
        <h2>Gene control</h2>
        <div id="gene-list"></div>
      </div>
    </div>
  </div>
  <div class="next-link">
    <a class="sesh__btn accent" href="{{ '/sesh/science/body-map' | relative_url }}">← Back: Body map</a>
    <a class="sesh__btn accent" href="{{ '/sesh/science/cancer-game' | relative_url }}">Next: Cancer game →</a>
  </div>
</section>
<script>
const phases=[
 {id:'g1',name:'G1 Phase',info:'The cell grows and decides whether to commit to division.'},
 {id:'s',name:'S Phase',info:'The cell copies its DNA and creates two copies of each chromosome.'},
 {id:'g2',name:'G2 Phase',info:'The cell verifies replicated DNA before mitosis.'},
 {id:'m',name:'M Phase',info:'The duplicated chromosomes separate and two cells form.'}
];
let current=0,hits=0,mutation=0;
const genes=[
 {name:'p53',desc:'DNA damage monitor',on:true},
 {name:'Rb',desc:'G1/S checkpoint brake',on:true},
 {name:'RAS',desc:'Growth signal',on:false},
 {name:'BRCA1',desc:'DNA repair',on:true}
];
const canvas=document.getElementById('cycle-canvas'),ctx=canvas.getContext('2d');
function renderPhases(){
 const box=document.getElementById('phase-buttons');box.innerHTML='';
 phases.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.className='sesh__btn small '+(i===current?'accent':'');b.textContent=p.name.replace(' Phase','');b.onclick=()=>selectPhase(i);box.appendChild(b)});
}
function selectPhase(i){current=i;const p=phases[i];document.getElementById('phase-title').textContent=p.name;document.getElementById('phase-info').textContent=p.info;renderPhases();}
function renderGenes(){const box=document.getElementById('gene-list');box.innerHTML='';genes.forEach((g,i)=>{const row=document.createElement('div');row.className='gene-row';row.innerHTML=`<div><strong>${g.name}</strong><small>${g.desc}</small></div>`;const b=document.createElement('button');b.type='button';b.className='sesh__btn small gene-toggle';b.textContent=g.on?'Active':'Mutated';b.onclick=()=>{g.on=!g.on;if(!g.on&&g.name==='RAS')mutation=Math.min(100,mutation+18);if(g.on||g.name==='RAS'){}else mutation=Math.min(100,mutation+12);hits++;b.textContent=g.on?'Active':'Mutated';updateStats();draw()};row.appendChild(b);box.appendChild(row)})}
function updateStats(){document.getElementById('cycle-hits').textContent=hits;document.getElementById('cycle-mutation').textContent=mutation+'%'}
let angle=0;
function draw(){angle+=.008;const w=canvas.width,h=canvas.height,cx=ctx;cx.clearRect(0,0,w,h);cx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--mist')||'#eef3f2';cx.fillRect(0,0,w,h);const ox=w/2,oy=h/2+8,outer=150,inner=62;const colors=['#A8C5BE','#6F9CAF','#A8C5BE','#647985'];const labels=['G1','S','G2','M'];for(let i=0;i<4;i++){const a0=-Math.PI/2+i*Math.PI/2,a1=a0+Math.PI/2-.05;cx.beginPath();cx.moveTo(ox,oy);cx.arc(ox,oy,outer,a0,a1);cx.closePath();cx.fillStyle=i===current?colors[i]:colors[i]+'55';cx.fill();cx.beginPath();cx.moveTo(ox,oy);cx.arc(ox,oy,inner,a0,a1);cx.closePath();cx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--mist')||'#eef3f2';cx.fill();const labelAngle=a0+Math.PI/4,labelRadius=(outer+inner)/2;cx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--ink')||'#123047';cx.textAlign='center';cx.textBaseline='middle';cx.font='700 14px sans-serif';cx.fillText(labels[i],ox+Math.cos(labelAngle)*labelRadius,oy+Math.sin(labelAngle)*labelRadius)}cx.beginPath();cx.arc(ox,oy,inner,0,Math.PI*2);cx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--surface')||'#fff';cx.fill();const markerAngle=-Math.PI/2+angle,markerRadius=outer-18;cx.beginPath();cx.arc(ox+Math.cos(markerAngle)*markerRadius,oy+Math.sin(markerAngle)*markerRadius,7,0,Math.PI*2);cx.fillStyle='#D8A15D';cx.fill();cx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--ink')||'#123047';cx.textAlign='center';cx.textBaseline='middle';cx.font='600 22px sans-serif';cx.fillText(phases[current].name.replace(' Phase',''),ox,oy);cx.font='11px sans-serif';cx.fillText('Cell cycle',ox,oy+22);requestAnimationFrame(draw)}
renderPhases();renderGenes();updateStats();draw();
</script>
