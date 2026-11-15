---
layout: sesh
title: Order the steps
nav: learn
heading: Order the steps
intro: Follow a blood sample through a RELOAD test, from the doctor's order to the report.
parent: Learn
parent_url: /sesh/learn
permalink: /sesh/learn/order
---
<section class="section wrap">
    <div class="game" id="order">
      <div class="game__bar"><span>Click the step that comes next</span><span id="order-score"></span></div>
      <ol class="order-slots" id="order-slots"></ol>
      <div class="order-pool" id="order-pool"></div>
      <p class="feedback" id="order-feedback" role="status"></p>
      <button class="sesh__btn accent fill" type="button" id="order-again" hidden>Play again</button>
    </div>
</section>
<script type="module" src="{{ '/assets/js/sesh/order.js' | relative_url }}"></script>
