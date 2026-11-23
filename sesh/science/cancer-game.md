---
layout: sesh
title: Cancer game
nav: science
heading: Cancer game
intro: Choose the best response in short cancer-care scenarios.
parent: Science
parent_url: /sesh/science
permalink: /sesh/science/cancer-game
---
<section class="section wrap">
  <div class="card lab-card">
    <div class="form-row">
      <h2 id="scenario-title">Scenario</h2>
      <span class="label" id="scenario-score">Score 0</span>
    </div>
    <p id="scenario-text"></p>
    <div class="setting-rows" id="scenario-options"></div>
    <p id="scenario-feedback" class="status-msg" role="status"></p>
  </div>
  <div class="next-link">
    <a class="sesh__btn accent" href="{{ '/sesh/science/cancer-cycle' | relative_url }}">← Back: Cancer cycle</a>
    <a class="sesh__btn accent" href="{{ '/sesh/science' | relative_url }}">Next: Science →</a>
  </div>
</section>
<script>
  const scenarios = [
    {
      text: 'A person wants to know whether a blood test can provide tumor information.',
      options: ['A tissue biopsy is always the only option', 'A liquid biopsy may read tumor DNA from blood', 'Blood tests cannot provide cancer information'],
      answer: 1,
      why: 'Liquid biopsy analyzes pieces of tumor DNA that may circulate in blood.'
    },
    {
      text: 'A tumor has lost some HLA markers that normally display tumor information.',
      options: ['It may be harder for immune cells to recognize the tumor', 'It guarantees immunotherapy will work', 'It makes the tumor disappear'],
      answer: 0,
      why: 'HLA markers act like display badges, and loss can help tumors hide.'
    },
    {
      text: 'Two patients have the same cancer type but different tumor changes.',
      options: ['Both will always need the same treatment', 'Treatment can be matched to each tumor', 'Tumor changes do not affect treatment'],
      answer: 1,
      why: 'Precision cancer care uses tumor genes and biomarkers to tailor decisions.'
    }
  ];
  let index = 0;
  let score = 0;
  const title = document.getElementById('scenario-title');
  const text = document.getElementById('scenario-text');
  const options = document.getElementById('scenario-options');
  const feedback = document.getElementById('scenario-feedback');
  const scoreLabel = document.getElementById('scenario-score');

  function render() {
    if (index >= scenarios.length) {
      title.textContent = 'Game complete';
      text.textContent = `You scored ${score} out of ${scenarios.length}.`;
      options.innerHTML = '';
      feedback.textContent = '';
      const restart = document.createElement('button');
      restart.type = 'button';
      restart.className = 'sesh__btn accent';
      restart.textContent = 'Play again';
      restart.addEventListener('click', () => { index = 0; score = 0; render(); });
      options.appendChild(restart);
      scoreLabel.textContent = `Score ${score}`;
      return;
    }

    const scenario = scenarios[index];
    title.textContent = `Scenario ${index + 1}`;
    text.textContent = scenario.text;
    feedback.textContent = '';
    scoreLabel.textContent = `Score ${score}`;
    options.innerHTML = '';
    scenario.options.forEach((choice, choiceIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sesh__btn block';
      button.textContent = choice;
      button.addEventListener('click', () => {
        const correct = choiceIndex === scenario.answer;
        if (correct) score += 1;
        feedback.textContent = `${correct ? 'Correct.' : 'Not quite.'} ${scenario.why}`;
        [...options.querySelectorAll('button')].forEach(item => item.disabled = true);
        const next = document.createElement('button');
        next.type = 'button';
        next.className = 'sesh__btn accent';
        next.textContent = index === scenarios.length - 1 ? 'Finish' : 'Next scenario';
        next.addEventListener('click', () => { index += 1; render(); });
        options.appendChild(next);
      });
      options.appendChild(button);
    });
  }

  render();
</script>
