// Order the steps: click the six RELOAD steps in order. A wrong pick explains what has to happen first.
const STEPS = [
  { text: 'A doctor orders the test', hint: 'Nothing happens until the care team decides the test could help.' },
  { text: 'The patient gives a blood sample', hint: 'The lab needs blood before it can do anything.' },
  { text: 'The lab separates cell-free DNA from the blood', hint: 'The tumor DNA has to be pulled out of the sample before it can be read.' },
  { text: 'Sequencing reads the DNA pieces', hint: 'The DNA has to be read before anyone can look for changes in it.' },
  { text: 'Analysis checks for lost HLA genes (HLA LOH)', hint: 'You can only check for HLA LOH once the DNA has been read.' },
  { text: 'A report goes back to the care team', hint: 'The report comes last, once the analysis is done.' }
];

const $ = id => document.getElementById(id);
const shuffle = list => list.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(p => p[1]);
let next = 0, mistakes = 0;

function start() {
  next = 0; mistakes = 0;
  $('order-slots').replaceChildren(...STEPS.map(() => {
    const li = document.createElement('li');
    li.textContent = '…';
    return li;
  }));
  $('order-pool').replaceChildren(...shuffle(STEPS.map((step, i) => ({ ...step, i }))).map(step => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.textContent = step.text;
    button.addEventListener('click', () => pick(button, step));
    return button;
  }));
  $('order-feedback').textContent = '';
  $('order-feedback').className = 'feedback';
  $('order-again').hidden = true;
  score();
}

function score() {
  $('order-score').textContent = `${next}/${STEPS.length} placed · ${mistakes} mistake${mistakes === 1 ? '' : 's'}`;
}

function pick(button, step) {
  if (step.i === next) {
    const slot = $('order-slots').children[next];
    slot.textContent = step.text;
    slot.classList.add('is-filled');
    button.remove();
    next++;
    $('order-feedback').textContent = next === STEPS.length
      ? `Done! The whole test, in order, with ${mistakes} mistake${mistakes === 1 ? '' : 's'}.`
      : 'Right.';
    $('order-feedback').className = 'feedback is-right';
    if (next === STEPS.length) $('order-again').hidden = false;
  } else {
    mistakes++;
    button.classList.add('is-wrong');
    setTimeout(() => button.classList.remove('is-wrong'), 700);
    $('order-feedback').textContent = `Not yet. ${STEPS[next].hint}`;
    $('order-feedback').className = 'feedback is-wrong';
  }
  score();
}

$('order-again').addEventListener('click', start);
start();
