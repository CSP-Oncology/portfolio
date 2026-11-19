---
layout: sesh
title: Glossary
nav: science
heading: Glossary
parent: Science
parent_url: /sesh/science
permalink: /sesh/glossary
---
<section class="section wrap">
  <form class="form glossary-search" role="search" onsubmit="return false">
    <label class="field">Search terms<input type="search" id="glossary-search" placeholder="e.g. cfDNA"></label>
  </form>
  <dl class="glossary" id="glossary">
    {%- for item in site.data.sesh_glossary %}
    <div class="glossary__item"><dt>{{ item.term }}</dt><dd>{{ item.def }}</dd></div>
    {%- endfor %}
  </dl>
  <p class="muted" id="glossary-empty" hidden>No terms match that search.</p>
</section>
<script type="module" src="{{ '/assets/js/sesh/glossary.js' | relative_url }}"></script>
