---
---
// RELOAD quiz: one question at a time, shows the right answer and a short explanation
const QUESTIONS = [
  { q: 'What does a liquid biopsy test?', choices: ['A blood sample', 'A piece of the tumor', 'A urine sample', 'An X-ray'], answer: 0,
    why: 'Liquid biopsy reads tumor DNA (cfDNA) found in the blood.', topic: 'liquid-biopsy' },
  { q: 'What does the "LOH" in HLA LOH stand for?', choices: ['Level of hormone', 'Loss of heterozygosity', 'Lack of hemoglobin', 'Length of helix'], answer: 1,
    why: 'Loss of heterozygosity means the tumor lost one of its two gene copies.', topic: 'biomarkers' },
  { q: 'What do HLA molecules do?', choices: ['Carry oxygen', 'Digest food', 'Show pieces of proteins to immune cells', 'Make DNA copies'], answer: 2,
    why: 'HLA works like an ID badge that T cells check.', topic: 'cancer-biology' },
  { q: 'Why can HLA LOH make immunotherapy less effective?', choices: ['It makes the tumor grow faster', 'Immune cells have a harder time recognizing the tumor', 'It blocks blood flow', 'It destroys the medicine'], answer: 1,
    why: 'With fewer HLA "badges," T cells may not notice the tumor.', topic: 'cancer-biology' },
  { q: 'What is cfDNA?', choices: ['DNA inside healthy cells only', 'A type of protein', 'DNA floating freely in the blood', 'A cancer drug'], answer: 2,
    why: 'Cell-free DNA is released into the blood, including from tumors.', topic: 'liquid-biopsy' },
  { q: 'What kind of biomarker helps predict if a treatment will work?', choices: ['Diagnostic', 'Predictive', 'Prognostic', 'Random'], answer: 1,
    why: 'Predictive biomarkers hint at how a patient will respond to a treatment.', topic: 'biomarkers' },
  { q: 'Which is an advantage of liquid biopsy?', choices: ['It needs surgery', 'It only sees one spot of the tumor', 'It can be repeated easily over time', 'It takes months'], answer: 2,
    why: 'A blood draw can be repeated for serial monitoring.', topic: 'liquid-biopsy' },
  { q: 'What does "tumor heterogeneity" mean?', choices: ['All tumor cells are identical', 'Different parts of a tumor can have different changes', 'The tumor is harmless', 'The tumor has no DNA'], answer: 1,
    why: 'One tissue sample can miss changes in other parts of the tumor.', topic: 'biomarkers' },
  { q: 'What does immunotherapy do?', choices: ['Helps the immune system attack cancer', 'Removes the tumor with surgery', 'Uses radiation', 'Replaces blood'], answer: 0,
    why: 'Immunotherapy boosts the body\'s own immune response.', topic: 'cancer-biology' },
  { q: 'What does NGS stand for?', choices: ['New genome study', 'Next-generation sequencing', 'Normal gene sample', 'Nucleic growth signal'], answer: 1,
    why: 'Next-generation sequencing reads millions of DNA pieces at once.', topic: 'liquid-biopsy' }
];

const TOPICS = {
  'cancer-biology': 'Cancer biology',
  'precision-oncology': 'Precision oncology',
  'biomarkers': 'Biomarkers',
  'liquid-biopsy': 'Liquid biopsy'
};
const BASE = '{{ site.baseurl }}';
const $ = id => document.getElementById(id);
let index = 0, score = 0, missed = [];

function render() {
  const item = QUESTIONS[index];
  $('quiz-count').textContent = `Question ${index + 1} of ${QUESTIONS.length}`;
  $('quiz-score').textContent = `Score: ${score}`;
  $('quiz-question').textContent = item.q;
  $('quiz-feedback').textContent = '';
  $('quiz-feedback').className = 'feedback';
  $('quiz-next').hidden = true;
  $('quiz-choices').replaceChildren(...item.choices.map((text, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.textContent = text;
    button.addEventListener('click', () => answer(i));
    return button;
  }));
}

function answer(picked) {
  const item = QUESTIONS[index];
  const buttons = [...$('quiz-choices').children];
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === item.answer) button.classList.add('is-right');
    else if (i === picked) button.classList.add('is-wrong');
  });
  const right = picked === item.answer;
  if (right) score++; else missed.push(item);
  $('quiz-score').textContent = `Score: ${score}`;
  $('quiz-feedback').textContent = (right ? 'Correct! ' : 'Not quite. ') + item.why;
  $('quiz-feedback').className = 'feedback ' + (right ? 'is-right' : 'is-wrong');
  $('quiz-next').textContent = index === QUESTIONS.length - 1 ? 'See results' : 'Next question';
  $('quiz-next').hidden = false;
  $('quiz-next').focus();
}

// Results: one row per missed question with the page that explains it
function finish() {
  $('quiz-count').textContent = 'Done';
  $('quiz-question').textContent = `You got ${score} out of ${QUESTIONS.length}.`;
  $('quiz-feedback').textContent = missed.length ? 'Reread these, then try again:' : 'Perfect score. You know this material.';
  $('quiz-feedback').className = 'feedback';
  const review = document.createElement('ul');
  review.className = 'review';
  review.replaceChildren(...missed.map(item => {
    const li = document.createElement('li');
    const q = document.createElement('strong');
    q.textContent = item.q;
    const answer = document.createElement('span');
    answer.textContent = `Answer: ${item.choices[item.answer]}. `;
    const link = document.createElement('a');
    link.href = `${BASE}/sesh/science/${item.topic}`;
    link.textContent = `Read ${TOPICS[item.topic]} →`;
    li.append(q, answer, link);
    return li;
  }));
  $('quiz-choices').replaceChildren(review);
  $('quiz-next').textContent = 'Play again';
  $('quiz-next').hidden = false;
}

$('quiz-next').addEventListener('click', () => {
  if (index === QUESTIONS.length) { index = 0; score = 0; missed = []; render(); return; }
  index++;
  if (index === QUESTIONS.length) finish(); else render();
});

render();
