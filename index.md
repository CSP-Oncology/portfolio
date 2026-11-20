---
layout: sesh
title: Home
---
<section class="home-head">
  <video class="dna" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1">
    <source src="{{ site.baseurl }}/images/webdev/dna.mp4" type="video/mp4">
  </video>
  <script>
    // Start the DNA video as soon as it can play, and again when you come back to the page
    // (Back button, another tab), so it never sits on a blank frame until a reload
    (function () {
      var video = document.querySelector('.dna');
      if (!video) return;
      var play = function () {
        video.defaultPlaybackRate = video.playbackRate = 0.75;
        var started = video.play();
        if (started && started.catch) started.catch(function () {});
      };
      play();
      video.addEventListener('loadeddata', play);
      window.addEventListener('pageshow', play);
      document.addEventListener('visibilitychange', function () { if (!document.hidden) play(); });
    })();
  </script>
  <div class="wrap home-head__inner">
    <div>
      <span class="home-head__kicker">Precision cancer care</span>
      <h1>Improving Treatment Outcomes for Cancer Patients</h1>
      <p>Pioneering liquid biopsy technology to select the correct personalized immunotherapy treatment.</p>
    </div>
    <!-- Highlights: the most important parts of the site (_data/sesh_highlights.yml) -->
    <div class="home-updates">
      <h2 class="home-updates__head">Highlights</h2>
      <ol class="home-news__list">
        {%- for item in site.data.sesh_highlights %}
        <li><a class="home-news__row" href="{{ item.url | relative_url }}">
          <span class="home-news__text"><span class="home-news__tag">{{ item.label }}</span><span class="home-news__title">{{ item.title }}</span><span class="home-updates__text">{{ item.text }}</span></span>
          <span class="home-updates__go" aria-hidden="true">→</span>
        </a></li>
        {%- endfor %}
      </ol>
    </div>
  </div>
</section>

<!-- Latest news, the main part of the page: filled from the backend by assets/js/sesh/news.js
     (synced with Sesh's News page); the saved copy below shows until then -->
<section class="wrap home-news" aria-labelledby="home-news-title">
  <div class="home-news__head">
    <div>
      <span class="home-head__kicker">From Sesh</span>
      <h2 id="home-news-title">Latest news</h2>
    </div>
    <a class="sesh__btn small" href="{{ '/sesh/news' | relative_url }}">All news</a>
  </div>
  <div class="home-news__grid">
    {%- assign featured = site.data.sesh_news | first %}
    <article class="home-news__featured" id="home-news-featured">
      {%- if featured.image %}
      <div class="home-news__image"><img src="{{ featured.image | relative_url }}" alt=""></div>
      {%- endif %}
      <div class="home-news__body">
        <p class="home-news__meta">Featured · {{ featured.category }} · <time datetime="{{ featured.datetime }}">{{ featured.date }}</time></p>
        <h3>{{ featured.headline | default: featured.title }}</h3>
        <p>{{ featured.summary }}</p>
        <div class="home-news__actions">
          <a class="sesh__btn accent fill" href="{{ '/sesh/news' | relative_url }}">Read full story</a>
          <a class="sesh__btn accent" href="https://www.oncologysesh.com/news" target="_blank" rel="noopener noreferrer">Read on Sesh's site ↗</a>
        </div>
      </div>
    </article>
    <aside class="home-news__more" aria-labelledby="home-news-more">
      <h3 id="home-news-more">More news</h3>
      <ol class="home-news__list" id="home-news" data-limit="5">
        {%- for item in site.data.sesh_news offset: 1 limit: 4 %}
        <li><a class="home-news__row" href="{{ '/sesh/news' | relative_url }}">
          {%- if item.image %}<span class="home-news__thumb"><img src="{{ item.image | relative_url }}" alt="" loading="lazy"></span>{% endif -%}
          <span class="home-news__text"><span class="home-news__tag">{{ item.category }} · <time datetime="{{ item.datetime }}">{{ item.date }}</time></span><span class="home-news__title">{{ item.headline | default: item.title }}</span></span>
        </a></li>
        {%- endfor %}
      </ol>
      <a class="home-news__all" href="{{ '/sesh/news' | relative_url }}">See all news →</a>
    </aside>
  </div>
</section>

<script type="module" src="{{ '/assets/js/sesh/news.js' | relative_url }}"></script>
