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

// News page: every story as a card; a card opens the story in the viewer (#news-viewer).
// Each card links to #news-<id>, so a story has its own address (the home page links to them).
const BASEURL = '{{ site.baseurl }}';
let stories = [];

// The saved copy in the page (_data/sesh_news.yml), in the backend's format
function savedStories() {
  const saved = JSON.parse(document.getElementById('news-saved')?.textContent || '[]');
  return saved.map((item, i) => ({
    id: `saved-${i + 1}`,
    title: item.headline || item.title,
    excerpt: item.summary || '',
    content: '',
    category: item.category || 'News',
    date: item.date || '',
    datetime: item.datetime || '',
    image_url: item.image ? BASEURL + item.image : '',
    url: item.url || 'https://www.oncologysesh.com/news',
  }));
}

function meta(article, className) {
  const line = el(className === 'p' ? 'p' : 'span', 'news-tile__meta');
  line.append(el('span', 'news-tile__tag', article.category));
  if (article.featured) line.append(el('span', 'news-tile__tag', 'Featured'));
  line.append(time(article));
  return line;
}

function card(article) {
  const item = el('li');
  const link = el('a', 'news-tile');
  link.href = `#news-${article.id}`;
  const media = el('span', 'news-tile__media');
  // No picture (or Sesh moved it): the story's topic fills the box instead
  const noPicture = () => {
    media.className = 'news-tile__media news-tile__media--empty';
    media.setAttribute('aria-hidden', 'true');
    media.replaceChildren(article.category);
  };
  if (article.image_url) {
    const img = el('img');
    img.src = article.image_url;
    img.alt = '';
    img.loading = 'lazy';
    img.addEventListener('error', noPicture);
    media.append(img);
  } else {
    noPicture();
  }
  const body = el('span', 'news-tile__body');
  body.append(meta(article), el('span', 'news-tile__title', article.title), el('span', 'news-tile__excerpt', article.excerpt));
  link.append(media, body);
  item.append(link);
  return item;
}

const viewer = document.getElementById('news-viewer');

function showStory(index) {
  const article = stories[index];
  if (!viewer || !article) return;
  viewer.dataset.index = index;
  document.getElementById('viewer-position').textContent = `Story ${index + 1} of ${stories.length}`;
  const media = document.getElementById('viewer-media');
  media.replaceChildren();
  media.hidden = !article.image_url;
  if (article.image_url) {
    const img = el('img');
    img.src = article.image_url;
    img.alt = article.title;
    media.append(img);
  }
  document.getElementById('viewer-meta').replaceWith(Object.assign(meta(article, 'p'), { id: 'viewer-meta' }));
  document.getElementById('viewer-title').textContent = article.title;
  const text = document.getElementById('viewer-text');
  text.replaceChildren(el('p', 'viewer__lead', article.excerpt));
  if (article.content && article.content !== article.excerpt) text.append(el('p', '', article.content));
  if (article.author) text.append(el('p', 'viewer__author', `By ${article.author}`));
  const source = document.getElementById('viewer-source');
  source.hidden = !article.url;
  if (article.url) source.href = article.url;
  viewer.querySelector('[data-viewer="prev"]').disabled = index === 0;
  viewer.querySelector('[data-viewer="next"]').disabled = index === stories.length - 1;
  if (!viewer.open) viewer.showModal();
}

// The address names the open story: #news-3 opens story 3, no hash closes the viewer
function syncWithAddress() {
  const index = stories.findIndex(article => location.hash === `#news-${article.id}`);
  if (index >= 0) showStory(index);
  else if (viewer?.open) viewer.close();
}

function go(index) {
  if (stories[index]) location.hash = `news-${stories[index].id}`;
}

if (viewer) {
  viewer.addEventListener('click', event => {
    const action = event.target.closest('[data-viewer]')?.dataset.viewer;
    const index = Number(viewer.dataset.index);
    if (action === 'close' || event.target === viewer) viewer.close();  // the button, or a click outside the story
    if (action === 'prev') go(index - 1);
    if (action === 'next') go(index + 1);
  });
  viewer.addEventListener('keydown', event => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (step) go(Number(viewer.dataset.index) + step);
  });
  // Closed (button, Esc or outside click): drop the story from the address, without a page jump
  viewer.addEventListener('close', () => {
    if (location.hash) history.pushState(null, '', location.pathname + location.search);
  });
  window.addEventListener('hashchange', syncWithAddress);
}

async function fillNewsPage(list) {
  stories = savedStories();
  syncWithAddress();
  try {
    stories = (await getNews()).articles;
    list.replaceChildren(...stories.map(card));
  } catch (error) {
    // Backend unreachable: keep the saved cards
  }
  syncWithAddress();
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
if (newsList) fillNewsPage(newsList);
if (homeList) fillHome(homeList).catch(() => {});
