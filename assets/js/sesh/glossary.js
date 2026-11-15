// Glossary filter: hides terms that don't match the search box
const search = document.getElementById('glossary-search');
const items = [...document.querySelectorAll('.glossary__item')];
const empty = document.getElementById('glossary-empty');

search.addEventListener('input', () => {
  const query = search.value.trim().toLowerCase();
  let shown = 0;
  items.forEach(item => {
    const match = item.textContent.toLowerCase().includes(query);
    item.hidden = !match;
    if (match) shown++;
  });
  empty.hidden = shown > 0;
});
