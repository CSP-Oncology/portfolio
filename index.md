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
    <ol class="steps">
      <li><div><strong>Non-invasive collection</strong><span>A blood draw replaces a tissue biopsy</span></div></li>
      <li><div><strong>Advanced analysis</strong><span>Sequencing finds hard-to-detect biomarkers</span></div></li>
      <li><div><strong>Actionable insights</strong><span>Reports guide treatment decisions</span></div></li>
    </ol>
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
      <div class="home-news__body">
        <p class="home-news__meta">Featured · {{ featured.category }} · <time datetime="{{ featured.datetime }}">{{ featured.date }}</time></p>
        <h3>{{ featured.title }}</h3>
        <p>{{ featured.summary }}</p>
        <div class="home-news__actions">
          <a class="sesh__btn accent fill" href="{{ '/sesh/news' | relative_url }}">Read full story</a>
          <a class="sesh__btn accent" href="https://www.oncologysesh.com/news" target="_blank" rel="noopener noreferrer">Read on Sesh's site ↗</a>
        </div>
      </div>
    </article>
    <div class="home-news__more">
      <h3>More updates</h3>
      <ol class="home-news__list" id="home-news" data-limit="5">
        {%- for item in site.data.sesh_news offset: 1 limit: 4 %}
        <li><a class="home-news__row" href="{{ '/sesh/news' | relative_url }}"><span class="home-news__tag">{{ item.category }} · <time datetime="{{ item.datetime }}">{{ item.date }}</time></span><span class="home-news__title">{{ item.title }}</span></a></li>
        {%- endfor %}
      </ol>
    </div>
  </div>
</section>

<section class="wrap home-index">
<ul class="index-grid">
  <li><a href="{{ '/sesh/reload' | relative_url }}">
    <span class="index-grid__num">01</span>
    <span class="index-grid__title">RELOAD</span>
    <span class="index-grid__text">The liquid biopsy test</span>
    <span class="index-grid__go" aria-hidden="true">→</span>
  </a></li>
  <li><a href="{{ '/sesh/science' | relative_url }}">
    <span class="index-grid__num">02</span>
    <span class="index-grid__title">Science</span>
    <span class="index-grid__text">Cancer, biomarkers, liquid biopsy</span>
    <span class="index-grid__go" aria-hidden="true">→</span>
  </a></li>
  <li><a href="{{ '/sesh/learn' | relative_url }}">
    <span class="index-grid__num">03</span>
    <span class="index-grid__title">Learn</span>
    <span class="index-grid__text">Games and a quiz</span>
    <span class="index-grid__go" aria-hidden="true">→</span>
  </a></li>
  <li><a href="{{ '/sesh/glossary' | relative_url }}">
    <span class="index-grid__num">04</span>
    <span class="index-grid__title">Glossary</span>
    <span class="index-grid__text">Key terms</span>
    <span class="index-grid__go" aria-hidden="true">→</span>
  </a></li>
  <li><a href="{{ '/sesh/about' | relative_url }}#faq">
    <span class="index-grid__num">05</span>
    <span class="index-grid__title">FAQ</span>
    <span class="index-grid__text">Common questions</span>
    <span class="index-grid__go" aria-hidden="true">→</span>
  </a></li>
  <li><a href="{{ '/sesh/background' | relative_url }}">
    <span class="index-grid__num">06</span>
    <span class="index-grid__title">Background</span>
    <span class="index-grid__text">About Sesh</span>
    <span class="index-grid__go" aria-hidden="true">→</span>
  </a></li>
  <li><a href="{{ '/sesh/news' | relative_url }}">
    <span class="index-grid__num">07</span>
    <span class="index-grid__title">News</span>
    <span class="index-grid__text">Updates</span>
    <span class="index-grid__go" aria-hidden="true">→</span>
  </a></li>
  <li><a href="{{ '/sesh/about' | relative_url }}">
    <span class="index-grid__num">08</span>
    <span class="index-grid__title">About &amp; Contact</span>
    <span class="index-grid__text">Send us a message</span>
    <span class="index-grid__go" aria-hidden="true">→</span>
  </a></li>
</ul>
</section>
<script type="module" src="{{ '/assets/js/sesh/news.js' | relative_url }}"></script>
