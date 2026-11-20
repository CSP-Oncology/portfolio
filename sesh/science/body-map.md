---
layout: sesh
title: Body map
nav: science
heading: Body map
intro: Select a body region to learn which cancer types can affect it.
parent: Science
parent_url: /sesh/science
permalink: /sesh/science/body-map
---
<section class="section wrap">
  <div class="card" style="max-width:760px;margin-inline:auto">
    <h2>Choose a region</h2>
    <div class="segmented" id="body-regions" style="flex-wrap:wrap">
      <button type="button" class="sesh__btn accent" data-region="brain">Brain</button>
      <button type="button" class="sesh__btn accent" data-region="lung">Lungs</button>
      <button type="button" class="sesh__btn accent" data-region="blood">Blood</button>
      <button type="button" class="sesh__btn accent" data-region="skin">Skin</button>
      <button type="button" class="sesh__btn accent" data-region="breast">Breast</button>
      <button type="button" class="sesh__btn accent" data-region="digestive">Digestive system</button>
    </div>
    <div class="card" id="body-result" style="margin-top:16px" aria-live="polite">
      <h3>Select a region</h3>
      <p>Each cancer is a different disease and may affect people differently.</p>
    </div>
  </div>
  <div class="next-link">
    <a class="sesh__btn accent" href="{{ '/sesh/science' | relative_url }}">← Back: Science</a>
    <a class="sesh__btn accent" href="{{ '/sesh/science/cancer-cycle' | relative_url }}">Next: Cancer cycle →</a>
  </div>
</section>
<script>
  const facts = {
    brain: ['Brain tumors', 'Glioma'],
    lung: ['Lung cancer', 'Small-cell and non-small-cell lung cancer'],
    blood: ['Leukemia', 'Lymphoma'],
    skin: ['Melanoma', 'Basal cell carcinoma'],
    breast: ['Breast cancer', 'Invasive and in situ breast cancers'],
    digestive: ['Colorectal cancer', 'Stomach and esophageal cancer']
  };
  const result = document.getElementById('body-result');
  document.getElementById('body-regions').addEventListener('click', event => {
    const button = event.target.closest('[data-region]');
    if (!button) return;
    const [name, detail] = facts[button.dataset.region];
    result.innerHTML = `<h3>${name}</h3><p>${detail}.</p>`;
  });
</script>
