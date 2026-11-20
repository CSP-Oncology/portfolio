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

// News page: every story as a row, with its full text under "Read full story"
async function fillNewsPage(list) {
  const { articles } = await getNews();
  list.replaceChildren(...articles.map(article => {
    const item = el('li', 'news-card');
    item.id = `news-${article.id}`;
    if (article.image_url) item.append(picture(article.image_url, 'news-card__media'));
    const story = el('article', 'news-card__body');
    const meta = el('p', 'news-card__meta');
    meta.append(el('span', 'news-card__tag', article.category));
    if (article.featured) meta.append(el('span', 'news-card__tag', 'Featured'));
    meta.append(time(article));
    story.append(meta, el('h2', '', article.title), el('p', 'news-card__excerpt', article.excerpt));
    if (article.content) {
      const more = el('details', 'news-card__more');
      more.append(el('summary', '', 'Read full story'), el('p', '', article.content));
      if (article.author) more.append(el('p', 'news-card__author', `By ${article.author}`));
      story.append(more);
    }
    if (article.url) story.append(sourceLink(article, 'news-card__source'));
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

// Home page: the featured story large, with the next few as "More news" beside it
function picture(url, className) {
  const box = el(className === 'home-news__thumb' ? 'span' : 'div', className);
  const img = el('img');
  img.src = url;
  img.alt = '';
  img.loading = 'lazy';
  img.addEventListener('error', () => box.remove());  // Sesh moved or removed the picture
  box.append(img);
  return box;
}

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
    card.replaceChildren(...(featured.image_url ? [picture(featured.image_url, 'home-news__image')] : []), body);
  }

  list.replaceChildren(...rest.map(article => {
    const item = el('li');
    const row = el('a', 'home-news__row');
    row.href = link(article);
    if (article.image_url) row.append(picture(article.image_url, 'home-news__thumb'));
    const text = el('span', 'home-news__text');
    const tag = el('span', 'home-news__tag', `${article.category} · `);
    tag.append(time(article));
    text.append(tag, el('span', 'home-news__title', article.title));
    row.append(text);
    item.append(row);
    return item;
  }));
}

const newsList = document.getElementById('news-list');
const homeList = document.getElementById('home-news');
if (newsList) fillNewsPage(newsList).catch(() => {});
if (homeList) fillHome(homeList).catch(() => {});
