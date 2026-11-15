---
layout: sesh
title: Final quiz
nav: learn
heading: Final quiz
intro: Ten questions across every topic, with a reading list for anything you miss.
parent: Learn
parent_url: /sesh/learn
permalink: /sesh/learn/quiz
---
<section class="section wrap">
    <div class="game" id="quiz">
      <div class="game__bar"><span id="quiz-count"></span><span id="quiz-score"></span></div>
      <p class="game__prompt" id="quiz-question"></p>
      <div class="choices" id="quiz-choices"></div>
      <p class="feedback" id="quiz-feedback" role="status"></p>
      <button class="sesh__btn accent fill" type="button" id="quiz-next" hidden>Next question</button>
    </div>
</section>
<script type="module" src="{{ '/assets/js/sesh/quiz.js' | relative_url }}"></script>
