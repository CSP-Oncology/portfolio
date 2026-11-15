// Tissue or liquid? Sort each fact into the right kind of biopsy
const CARDS = [
  { text: 'Needs only a blood draw', answer: 'liquid', why: 'Liquid biopsy reads tumor DNA from blood.' },
  { text: 'Takes a piece of the tumor with a needle or surgery', answer: 'tissue', why: 'That is what a tissue biopsy removes.' },
  { text: 'Reads cell-free DNA (cfDNA)', answer: 'liquid', why: 'cfDNA floats in the blood, so you need a blood sample.' },
  { text: 'Can miss changes in other parts of the tumor', answer: 'tissue', why: 'It only samples one spot, and tumors differ from spot to spot.' },
  { text: 'Easy to repeat every few weeks', answer: 'liquid', why: 'A blood draw is quick, so it can be repeated to track changes.' },
  { text: 'Hard to repeat because it is invasive', answer: 'tissue', why: 'Each tissue biopsy is a procedure with recovery time.' },
  { text: 'Picks up DNA shed from the whole tumor', answer: 'liquid', why: 'Tumor cells everywhere shed DNA into the blood.' },
  { text: 'Lets doctors look at tumor cells under a microscope', answer: 'tissue', why: 'You need actual tumor tissue to look at its cells.' },
  { text: 'The type of test RELOAD is', answer: 'liquid', why: 'RELOAD is a liquid biopsy test.' },
  { text: 'May need recovery time afterward', answer: 'tissue', why: 'Surgery or a needle into the tumor can take time to heal.' }
];
const LABEL = { tissue: 'tissue biopsy', liquid: 'liquid biopsy' };
const $ = id => document.getElementById(id);
const buttons = [...document.querySelectorAll('#sort [data-answer]')];
let deck = [], index = 0, score = 0, missed = [];

const shuffle = list => list.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(p => p[1]);

function render() {
  $('sort-count').textContent = `Card ${index + 1} of ${deck.length}`;
  $('sort-score').textContent = `Score: ${score}`;
  $('sort-card').textContent = deck[index].text;
  $('sort-feedback').textContent = '';
  $('sort-feedback').className = 'feedback';
  $('sort-next').hidden = true;
  buttons.forEach(b => { b.disabled = false; b.hidden = false; });
}

function start() {
  deck = shuffle(CARDS); index = 0; score = 0; missed = [];
  $('sort-review')?.remove();
  render();
}

buttons.forEach(button => button.addEventListener('click', () => {
  const card = deck[index];
  const right = button.dataset.answer === card.answer;
  if (right) score++; else missed.push(card);
  buttons.forEach(b => { b.disabled = true; });
  $('sort-score').textContent = `Score: ${score}`;
  $('sort-feedback').textContent = (right ? 'Correct, ' : 'Not quite, ') + `that's a ${LABEL[card.answer]}.` + (card.why ? ' ' + card.why : '');
  $('sort-feedback').className = 'feedback ' + (right ? 'is-right' : 'is-wrong');
  $('sort-next').textContent = index === deck.length - 1 ? 'See results' : 'Next card';
  $('sort-next').hidden = false;
  $('sort-next').focus();
}));

$('sort-next').addEventListener('click', () => {
  if (index >= deck.length) { start(); return; }
  index++;
  if (index < deck.length) { render(); return; }
  $('sort-count').textContent = 'Done';
  $('sort-card').textContent = `You sorted ${score} of ${deck.length} correctly.`;
  $('sort-feedback').textContent = missed.length ? 'The ones to remember:' : 'All correct.';
  $('sort-feedback').className = 'feedback';
  if (missed.length) {
    const review = document.createElement('ul');
    review.className = 'review';
    review.id = 'sort-review';
    review.replaceChildren(...missed.map(card => {
      const li = document.createElement('li');
      const fact = document.createElement('strong');
      fact.textContent = `${card.text}: ${LABEL[card.answer]}`;
      const why = document.createElement('span');
      why.textContent = card.why;
      li.append(fact, why);
      return li;
    }));
    $('sort-feedback').after(review);
  }
  buttons.forEach(b => { b.hidden = true; });
  $('sort-next').textContent = 'Play again';
});

start();
