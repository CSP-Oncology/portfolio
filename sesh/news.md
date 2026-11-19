---
layout: sesh
title: News
nav: news
heading: News
intro: Updates on Sesh's research, funding and company milestones.
permalink: /sesh/news
---
<section class="section wrap" aria-label="Company updates">
  <!-- Filled from the backend by assets/js/sesh/news.js (synced with Sesh's News page); this saved copy shows until then -->
  <ol class="steps news-list" id="news-list">
    {% for item in site.data.sesh_news %}
    <li>
      <article>
        <p class="news-list__meta"><time datetime="{{ item.datetime }}">{{ item.date }}</time> · {{ item.category }}</p>
        <h2>{{ item.title }}</h2>
        <p>{{ item.summary }}</p>
      </article>
    </li>
    {% endfor %}
  </ol>
  <p class="news-source">Summaries based on Sesh's official updates. <a href="https://www.oncologysesh.com/news" target="_blank" rel="noopener noreferrer">Read the original news ↗</a></p>
</section>
<script type="module" src="{{ '/assets/js/sesh/news.js' | relative_url }}"></script>
