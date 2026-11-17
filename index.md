---
layout: sesh
title: Home
---
<style>
.home-head { position: relative; overflow: hidden; }
.home-head__inner { position: relative; z-index: 1; }
.dna {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
  opacity: 0.4;
}
[data-theme="dark"] .dna, .dark .dna {
  opacity: 0.3;
}
@media (prefers-reduced-motion: reduce) {
  .dna { display: none; }
}
</style>
<section class="home-head">
  <video class="dna" autoplay muted loop playsinline aria-hidden="true" tabindex="-1">
    <source src="{{ site.baseurl }}/images/webdev/dna.mp4" type="video/mp4">
  </video>
  <script>
    document.querySelector('.dna').playbackRate = 0.75;
  </script>
  <div class="wrap home-head__inner">
    <div>
      <span class="home-head__kicker">Precision immuno-oncology</span>
      <h1>How a blood test can guide cancer treatment</h1>
      <p>A student capstone about liquid biopsy, biomarkers and Sesh's RELOAD test.</p>
    </div>
    <ol class="steps">
      <li><div><strong>Non-invasive collection</strong><span>A blood draw replaces a tissue biopsy</span></div></li>
      <li><div><strong>Advanced analysis</strong><span>Sequencing finds hard-to-detect biomarkers</span></div></li>
      <li><div><strong>Actionable insights</strong><span>Reports guide treatment decisions</span></div></li>
    </ol>
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
  <li><a href="{{ '/sesh/faq' | relative_url }}">
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
    <span class="index-grid__title">About & Contact</span>
    <span class="index-grid__text">Our team, send a message</span>
    <span class="index-grid__go" aria-hidden="true">→</span>
  </a></li>
</ul>
</section>