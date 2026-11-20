---
layout: sesh
title: Cancer cycle
nav: science
heading: Cancer cycle
intro: Put the cancer-immune cycle steps in the correct order.
parent: Science
parent_url: /sesh/science
permalink: /sesh/science/cancer-cycle
---
<section class="section wrap">
  <div class="card" style="max-width:760px;margin-inline:auto">
    <h2>Build the cycle</h2>
    <p>Choose the steps from 1 to 4.</p>
    <div id="cycle-options" class="setting-rows"></div>
    <p id="cycle-feedback" class="status-msg" role="status"></p>
    <button type="button" id="cycle-reset" class="sesh__btn accent">Reset</button>
  </div>
</section>
<script>
  const steps = [
    ['Cancer cells release antigens', 'The immune system is exposed to pieces of abnormal proteins.'],
    ['Antigen-presenting cells activate T cells', 'T cells learn to recognize the tumor signal.'],
    ['T cells find and enter the tumor', 'Activated immune cells travel to the cancer.'],
    ['T cells recognize and kill cancer cells', 'This can release more antigens and repeat the cycle.']
  ];
  const options = [...steps].sort(() => Math.random() - 0.5);
  const selected = [];
  const list = document.getElementById('cycle-options');
  const feedback = document.getElementById('cycle-feedback');

  function render() {
    list.innerHTML = '';
    options.forEach((step, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sesh__btn block';
      button.textContent = `${selected.length < 4 ? '' : ''}${step[0]}`;
      button.disabled = selected.includes(index);
      button.addEventListener('click', () => {
        selected.push(index);
        feedback.textContent = `${selected.length}. ${step[0]} — ${step[1]}`;
        render();
        if (selected.length === 4) {
          const correct = selected.every((item, position) => steps[position][0] === options[item][0]);
          feedback.textContent = correct ? 'Complete: you ordered the cancer-immune cycle correctly!' : 'The cycle is complete, but two steps are out of order. Reset and try again.';
        }
      });
      list.appendChild(button);
    });
  }

  document.getElementById('cycle-reset').addEventListener('click', () => {
    selected.length = 0;
    feedback.textContent = 'Choose step 1.';
    render();
  });
  render();
</script>
