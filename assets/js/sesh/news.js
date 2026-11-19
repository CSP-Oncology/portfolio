---
---
// Sesh's news from the backend (GET /api/news), which keeps it synced with oncologysesh.com/news
// (flask: model/news.py), like the Poway Recovery Center calendar. Used on the News page
// (#news-list) and the home page (#home-news). Each page already shows a saved copy of the news,
// which stays if the backend can't be reached.
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

const NEWS_PAGE = '{{ "/sesh/news" | relative_url }}';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// The story on Sesh's own site (its own page if it has one, otherwise Sesh's News page)
function sourceLink(article, className) {
  const link = el('a', className, "Read on Sesh's site ↗");
  link.href = article.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function time(article) {
  const node = el('time', '', article.date);
  if (article.datetime) node.dateTime = article.datetime;
  return node;
}

async function getNews(limit) {
  const query = limit ? `?limit=${limit}` : '';
  const response = await fetch(`${pythonURI}/api/news${query}`, { ...fetchOptions, cache: 'no-store' });
  if (!response.ok) throw new Error(`News request failed: ${response.status}`);
  const data = await response.json();
  if (!data.articles?.length) throw new Error('No news yet');
  return data;
}

// News page: every story, with its full text under "Read full story"
async function fillNewsPage(list) {
  const { articles } = await getNews();
  list.replaceChildren(...articles.map(article => {
    const item = el('li');
    item.id = `news-${article.id}`;
    const story = el('article');
    const meta = el('p', 'news-list__meta');
    meta.append(time(article), ` · ${article.category}${article.featured ? ' · Featured' : ''}`);
    story.append(meta, el('h2', '', article.title), el('p', '', article.excerpt));
    if (article.content) {
      const more = el('details', 'news-list__more');
      more.append(el('summary', '', 'Read full story'), el('p', '', article.content));
      if (article.author) more.append(el('p', 'news-list__author', `By ${article.author}`));
      story.append(more);
    }
    if (article.url) story.append(sourceLink(article, 'news-list__source'));
    item.append(story);
    return item;
  }));
  // Opened from the home page (/sesh/news#news-3): open that story
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) {
    target.querySelector('details')?.setAttribute('open', '');
    target.scrollIntoView();
  }
}

// Home page: the featured story large, the next few as rows beside it
async function fillHome(list) {
  const { articles } = await getNews(Number(list.dataset.limit) || 5);
  const [featured, ...rest] = articles;
  const link = article => `${NEWS_PAGE}#news-${article.id}`;

  const card = document.getElementById('home-news-featured');
  if (card && featured) {
    const body = el('div', 'home-news__body');
    const meta = el('p', 'home-news__meta', `${featured.featured ? 'Featured · ' : ''}${featured.category} · `);
    meta.append(time(featured));
    const more = el('a', 'sesh__btn accent fill', 'Read full story');
    more.href = link(featured);
    const actions = el('div', 'home-news__actions');
    actions.append(more);
    if (featured.url) actions.append(sourceLink(featured, 'sesh__btn accent'));
    body.append(meta, el('h3', '', featured.title), el('p', '', featured.excerpt), actions);
    const parts = [];
    if (featured.image_url) {
      const figure = el('div', 'home-news__image');
      const img = el('img');
      img.src = featured.image_url;
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', () => figure.remove());  // Sesh moved or removed the picture
      figure.append(img);
      parts.push(figure);
    }
    card.replaceChildren(...parts, body);
  }

  list.replaceChildren(...rest.map(article => {
    const item = el('li');
    const row = el('a', 'home-news__row');
    row.href = link(article);
    const tag = el('span', 'home-news__tag', `${article.category} · `);
    tag.append(time(article));
    row.append(tag, el('span', 'home-news__title', article.title));
    item.append(row);
    return item;
  }));
}

const newsList = document.getElementById('news-list');
const homeList = document.getElementById('home-news');
if (newsList) fillNewsPage(newsList).catch(() => {});
if (homeList) fillHome(homeList).catch(() => {});
