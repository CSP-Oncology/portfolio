---
layout: sesh
title: Match the term
nav: learn
heading: Match the term
intro: Pair each word with what it means.
parent: Learn
parent_url: /sesh/learn
permalink: /sesh/learn/match
---
<section class="section wrap">
    <div class="game" id="match">
      <div class="game__bar"><span>Pick a term, then its meaning</span><span id="match-score"></span></div>
      <div class="match-board">
        <div class="match-col" id="match-terms"></div>
        <div class="match-col" id="match-defs"></div>
      </div>
      <p class="feedback" id="match-feedback" role="status"></p>
      <button class="sesh__btn accent fill" type="button" id="match-again" hidden>New round</button>
    </div>
</section>
<script type="application/json" id="glossary-data">{{ site.data.sesh_glossary | jsonify }}</script>
<script type="module" src="{{ '/assets/js/sesh/match.js' | relative_url }}"></script>
