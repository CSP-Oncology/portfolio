---
layout: sesh
title: News
nav: news
heading: News
intro: Updates on Sesh's research, funding and company milestones.
permalink: /sesh/news
---
<section class="section wrap" aria-label="Company updates">
  <!-- Filled from the backend by assets/js/sesh/news.js (synced with Sesh's News page); this saved copy shows until then.
       One row per story, newest first. -->
  <ol class="news-feed" id="news-list">
    {% for item in site.data.sesh_news %}
    <li class="news-card">
      {% if item.image %}<div class="news-card__media"><img src="{{ item.image | relative_url }}" alt="" loading="lazy"></div>{% endif %}
      <article class="news-card__body">
        <p class="news-card__meta"><span class="news-card__tag">{{ item.category }}</span><time datetime="{{ item.datetime }}">{{ item.date }}</time></p>
        <h2>{{ item.headline | default: item.title }}</h2>
        <p class="news-card__excerpt">{{ item.summary }}</p>
      </article>
    </li>
    {% endfor %}
  </ol>
  <p class="news-source">Summaries based on Sesh's official updates. <a href="https://www.oncologysesh.com/news" target="_blank" rel="noopener noreferrer">Read the original news ↗</a></p>
</section>
<script type="module" src="{{ '/assets/js/sesh/news.js' | relative_url }}"></script>
