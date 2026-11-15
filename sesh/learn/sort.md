---
layout: sesh
title: Tissue or liquid?
nav: learn
heading: Tissue or liquid?
intro: Sort each fact into tissue biopsy or liquid biopsy.
parent: Learn
parent_url: /sesh/learn
permalink: /sesh/learn/sort
---
<section class="section wrap">
    <div class="game" id="sort">
      <div class="game__bar"><span id="sort-count"></span><span id="sort-score"></span></div>
      <div class="sort-card" id="sort-card"></div>
      <div class="sort-buttons">
        <button class="sesh__btn large accent" type="button" data-answer="tissue">Tissue biopsy</button>
        <button class="sesh__btn large accent" type="button" data-answer="liquid">Liquid biopsy</button>
      </div>
      <p class="feedback" id="sort-feedback" role="status"></p>
      <button class="sesh__btn accent fill" type="button" id="sort-next" hidden>Next card</button>
    </div>
</section>
<script type="module" src="{{ '/assets/js/sesh/sort.js' | relative_url }}"></script>
