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
<style>
.cycle-lab{display:grid;grid-template-columns:minmax(260px,.9fr) minmax(320px,1.1fr);gap:18px}.cycle-canvas{width:100%;height:auto;display:block;background:var(--mist);border:1px solid var(--line)}.cycle-panel{display:grid;gap:12px}.gene-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border:1px solid var(--line);background:var(--surface)}.gene-row strong{display:block}.gene-row small{color:var(--muted)}.gene-toggle{min-width:72px}.phase-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.phase-grid button{min-width:0}.gate-options{display:grid;gap:8px}.gate-options button{text-align:left}.lab-status{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.lab-status div{border:1px solid var(--line);padding:8px;text-align:center}.lab-status strong{display:block;font-size:1.2rem}@media(max-width:760px){.cycle-lab{grid-template-columns:1fr}.phase-grid{grid-template-columns:repeat(2,1fr)}}
</style>
<section class="section wrap">
  <div class="cycle-lab">
    <div class="card">
      <h2>Cell cycle</h2>
      <canvas id="cycle-canvas" class="cycle-canvas" width="680" height="420" aria-label="Animated cell cycle diagram"></canvas>
      <div class="lab-status">
        <div><strong id="cycle-score">0</strong>Score</div>
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
      <div class="card">
        <h2>Checkpoint gate</h2>
        <p id="gate-question">What releases E2F and allows S phase entry?</p>
        <div class="gate-options" id="gate-options"></div>
        <p id="gate-feedback" class="status-msg" role="status"></p>
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
 {id:'g1',name:'G1 Phase',info:'The cell grows and decides whether to commit to division.',q:'What allows a cell to pass the G1/S checkpoint?',options:['CDK4/Cyclin D phosphorylates Rb','p53 always stops cell growth','DNA replication starts during G1'],answer:0},
 {id:'s',name:'S Phase',info:'The cell copies its DNA and creates two copies of each chromosome.',q:'What problem can tobacco carcinogens create during DNA replication?',options:['Base-pair mutations','Instant cell division','Perfect DNA repair'],answer:0},
 {id:'g2',name:'G2 Phase',info:'The cell verifies replicated DNA before mitosis.',q:'What should happen when p53 detects damaged DNA?',options:['The cycle may pause for repair','The spindle separates immediately','The cell ignores the damage'],answer:0},
 {id:'m',name:'M Phase',info:'The duplicated chromosomes separate and two cells form.',q:'What does the spindle checkpoint verify?',options:['Every chromosome is attached to the spindle','DNA has not been copied','The cell has no organelles'],answer:0}
];
let current=0,score=0,hits=0,mutation=0,paused=false;
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
function selectPhase(i){current=i;const p=phases[i];document.getElementById('phase-title').textContent=p.name;document.getElementById('phase-info').textContent=p.info;document.getElementById('gate-question').textContent=p.q;renderGate();renderPhases();}
function renderGate(){const p=phases[current],box=document.getElementById('gate-options'),feedback=document.getElementById('gate-feedback');box.innerHTML='';feedback.textContent='';p.options.forEach((option,i)=>{const b=document.createElement('button');b.type='button';b.className='sesh__btn';b.textContent=option;b.onclick=()=>{const correct=i===p.answer;if(correct)score+=100;else mutation=Math.min(100,mutation+10);feedback.textContent=correct?'Correct. The checkpoint is working.':'Not quite. The damage can weaken the checkpoint.';updateStats();[...box.querySelectorAll('button')].forEach(x=>x.disabled=true)};box.appendChild(b)})}
function renderGenes(){const box=document.getElementById('gene-list');box.innerHTML='';genes.forEach((g,i)=>{const row=document.createElement('div');row.className='gene-row';row.innerHTML=`<div><strong>${g.name}</strong><small>${g.desc}</small></div>`;const b=document.createElement('button');b.type='button';b.className='sesh__btn small gene-toggle';b.textContent=g.on?'Active':'Mutated';b.onclick=()=>{g.on=!g.on;if(!g.on&&g.name==='RAS')mutation=Math.min(100,mutation+18);if(g.on||g.name==='RAS'){}else mutation=Math.min(100,mutation+12);hits++;b.textContent=g.on?'Active':'Mutated';updateStats();draw()};row.appendChild(b);box.appendChild(row)})}
function updateStats(){document.getElementById('cycle-score').textContent=score;document.getElementById('cycle-hits').textContent=hits;document.getElementById('cycle-mutation').textContent=mutation+'%'}
let angle=0;
function draw(){angle+=paused?0:.008;const w=canvas.width,h=canvas.height,cx=ctx;cx.clearRect(0,0,w,h);cx.fillStyle=getComputedStyle(document.body).backgroundColor;cx.fillRect(0,0,w,h);const ox=w/2,oy=h/2+8,outer=150,inner=62;const colors=['#A8C5BE','#6F9CAF','#A8C5BE','#647985'];for(let i=0;i<4;i++){const a0=-Math.PI/2+i*Math.PI/2+angle*.12,a1=a0+Math.PI/2-.05;cx.beginPath();cx.moveTo(ox,oy);cx.arc(ox,oy,outer,a0,a1);cx.closePath();cx.fillStyle=i===current?colors[i]:colors[i]+'55';cx.fill();cx.beginPath();cx.moveTo(ox,oy);cx.arc(ox,oy,inner,a0,a1);cx.closePath();cx.fillStyle=getComputedStyle(document.body).backgroundColor;cx.fill()}cx.beginPath();cx.arc(ox,oy,inner,0,Math.PI*2);cx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--surface')||'#fff';cx.fill();cx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--ink')||'#123047';cx.textAlign='center';cx.font='600 22px sans-serif';cx.fillText(phases[current].name.replace(' Phase',''),ox,oy);cx.font='11px sans-serif';cx.fillText('Cell cycle',ox,oy+22);requestAnimationFrame(draw)}
renderPhases();renderGate();renderGenes();updateStats();draw();
</script>
