---
layout: sesh
title: News
nav: news
heading: News
intro: Updates on Sesh's research, funding and company milestones.
permalink: /sesh/news
---
<section class="section wrap" aria-label="Company updates">
  <!-- Cards, newest first; a card opens the story in the viewer below (like the cards on the OCS Capstone page).
       Filled from the backend by assets/js/sesh/news.js (synced with Sesh's News page); this saved copy shows until then. -->
  <ul class="news-grid" id="news-list">
    {% for item in site.data.sesh_news %}
    <li>
      <a class="news-tile" href="#news-saved-{{ forloop.index }}">
        {% if item.image %}<span class="news-tile__media"><img src="{{ item.image | relative_url }}" alt="" loading="lazy"></span>{% else %}<span class="news-tile__media news-tile__media--empty" aria-hidden="true">{{ item.category }}</span>{% endif %}
        <span class="news-tile__body">
          <span class="news-tile__meta"><span class="news-tile__tag">{{ item.category }}</span><time datetime="{{ item.datetime }}">{{ item.date }}</time></span>
          <span class="news-tile__title">{{ item.headline | default: item.title }}</span>
          <span class="news-tile__excerpt">{{ item.summary }}</span>
        </span>
      </a>
    </li>
    {% endfor %}
  </ul>
  <p class="news-source">Summaries based on Sesh's official updates. <a href="https://www.oncologysesh.com/news" target="_blank" rel="noopener noreferrer">Read the original news ↗</a></p>
</section>

<!-- Story viewer: one story at a time, with Previous / Next (filled by news.js) -->
<dialog class="viewer" id="news-viewer" aria-labelledby="viewer-title">
  <div class="viewer__bar">
    <span class="viewer__position" id="viewer-position"></span>
    <button class="sesh__btn small" type="button" data-viewer="close">Close <span aria-hidden="true">✕</span></button>
  </div>
  <div class="viewer__media" id="viewer-media"></div>
  <div class="viewer__body">
    <p class="news-tile__meta" id="viewer-meta"></p>
    <h2 id="viewer-title"></h2>
    <div class="viewer__text" id="viewer-text"></div>
  </div>
  <div class="viewer__nav">
    <button class="sesh__btn" type="button" data-viewer="prev"><span aria-hidden="true">←</span> Previous</button>
    <a class="sesh__btn accent" id="viewer-source" target="_blank" rel="noopener noreferrer">Read on Sesh's site ↗</a>
    <button class="sesh__btn" type="button" data-viewer="next">Next <span aria-hidden="true">→</span></button>
  </div>
</dialog>

<script type="application/json" id="news-saved">{{ site.data.sesh_news | jsonify }}</script>
<script type="module" src="{{ '/assets/js/sesh/news.js' | relative_url }}"></script>
