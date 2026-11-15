// Match the term: pick a term on the left, then its meaning on the right
const ALL = JSON.parse(document.getElementById('glossary-data').textContent);
const PAIRS = 6;
const $ = id => document.getElementById(id);
let picked = null, matched = 0, misses = 0;

const shuffle = list => list.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(p => p[1]);

function makeButton(text, key, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'choice';
  button.textContent = text;
  button.dataset.key = key;
  button.addEventListener('click', () => onClick(button));
  return button;
}

function score() {
  $('match-score').textContent = `Matched ${matched}/${PAIRS} · Misses ${misses}`;
}

function pickTerm(button) {
  if (picked) picked.classList.remove('is-picked');
  picked = button;
  button.classList.add('is-picked');
  $('match-feedback').textContent = '';
}

function pickDef(button) {
  if (!picked) { $('match-feedback').textContent = 'Pick a term first.'; $('match-feedback').className = 'feedback'; return; }
  if (button.dataset.key === picked.dataset.key) {
    [picked, button].forEach(b => { b.classList.remove('is-picked'); b.classList.add('is-right', 'is-done'); b.disabled = true; });
    matched++;
    const term = ALL.find(t => t.term === button.dataset.key);
    $('match-feedback').textContent = `${term.term}: ${term.def}`;
    $('match-feedback').className = 'feedback is-right';
    picked = null;
    if (matched === PAIRS) {
      $('match-feedback').textContent = `All 6 matched with ${misses} miss${misses === 1 ? '' : 'es'}. New rounds pick different terms.`;
      $('match-again').hidden = false;
    }
  } else {
    misses++;
    button.classList.add('is-wrong');
    setTimeout(() => button.classList.remove('is-wrong'), 600);
    $('match-feedback').textContent = 'Not that one. Try again.';
    $('match-feedback').className = 'feedback is-wrong';
  }
  score();
}

function round() {
  picked = null; matched = 0; misses = 0;
  const set = shuffle(ALL).slice(0, PAIRS);
  $('match-terms').replaceChildren(...set.map(t => makeButton(t.term, t.term, pickTerm)));
  $('match-defs').replaceChildren(...shuffle(set).map(t => makeButton(t.short, t.term, pickDef)));
  $('match-feedback').textContent = '';
  $('match-again').hidden = true;
  score();
}

$('match-again').addEventListener('click', round);
round();
