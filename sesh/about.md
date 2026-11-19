---
layout: sesh
title: About
nav: about
heading: About
permalink: /sesh/about
---
<!-- Contact form: messages are saved by the backend (POST /api/contact);
     admins read them on their profile page and at Data -> Contact Messages in the backend -->
{% include sesh/collaborators.html %}

<section class="section wrap" id="faq" aria-labelledby="faq-heading">
  <h2 id="faq-heading">Frequently asked questions</h2>
  <div class="faq-list">
    <details><summary>What is immunotherapy?</summary><p>A cancer treatment that helps the patient's own immune system find and attack cancer cells.</p></details>
    <details><summary>What is the process for testing a patient with RELOAD?</summary><p>A blood sample is drawn, the lab sequences the cell-free DNA in it, and a report goes back to the care team.</p></details>
    <details><summary>How is a liquid biopsy different from a tissue biopsy?</summary><p>A tissue biopsy removes a piece of the tumor. A liquid biopsy uses a blood draw and reads tumor DNA in the blood.</p></details>
    <details><summary>Who is RELOAD for?</summary><p>RELOAD is being developed first for non-small cell lung cancer, where HLA loss is common, to help oncologists predict whether immunotherapy is likely to work before treatment begins.</p></details>
  </div>
</section>

<section class="section wrap">
  <div class="with-sidebar">
    <div>
      <section id="company-contact" aria-labelledby="company-contact-heading">
        <h2 id="company-contact-heading">Contact Sesh</h2>
        <div class="sesh-team">
          {% for person in site.data.sesh_team %}
          <article class="sesh-team__person">
            <img src="{{ person.image | relative_url }}" alt="{{ person.name }}" width="96" height="96" loading="lazy">
            <div>
              <h3>{{ person.name }}</h3>
              <p>{{ person.role }}</p>
              <a href="{{ person.linkedin }}" target="_blank" rel="noopener noreferrer" aria-label="{{ person.name }} on LinkedIn (opens in a new tab)">LinkedIn ↗</a>
            </div>
          </article>
          {% endfor %}
        </div>
      </section>
      <div class="section">
      <div class="card">
        <h2>Send us a message</h2>
          <form class="form" id="contact-form">
            <div class="field-pair">
              <label class="field">Name<input name="name" required autocomplete="name"></label>
              <label class="field">What's it about?<select name="topic" id="contact-topic"><option value="general">General inquiry</option></select></label>
            </div>
            <div class="field-pair">
              <label class="field">Email<input name="email" type="email" required autocomplete="email"></label>
              <label class="field">Phone<input name="phone" type="tel" autocomplete="tel" placeholder="Optional"></label>
            </div>
            <label class="field">Message<textarea name="message" rows="3" required></textarea></label>
            <div class="form-row">
              <p class="status-msg" id="contact-message" role="status"></p>
              <button class="sesh__btn medium accent fill">Send message</button>
            </div>
          </form>
      </div>
      </div>
    </div>
    <aside class="sidebar">
      <div class="note">
        <h2>About Sesh</h2>
        <p>Sesh is a San Diego precision-oncology company developing RELOAD, a liquid biopsy that helps oncologists choose the right immunotherapy.</p>
      </div>
      <a class="sesh__btn block" href="{{ '/sesh/background' | relative_url }}">Our story <span aria-hidden="true">→</span></a>
      <a class="sesh__btn block" href="{{ '/sesh/news' | relative_url }}">News <span aria-hidden="true">→</span></a>
    </aside>
  </div>
</section>

<script type="module">
    import { pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    const api = async (path, method = 'GET', body) => {
        const response = await fetch(pythonURI + path, { ...fetchOptions, method, cache: 'no-store', body: body ? JSON.stringify(body) : undefined });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`);
        return data;
    };
    const form = document.getElementById('contact-form'), status = document.getElementById('contact-message');
    const say = (text, isError) => { status.textContent = text; status.classList.toggle('is-error', !!isError); };

    // Topics come from the backend; logged-in users get their details filled in
    api('/api/contact/topics').then(topics => form.topic.replaceChildren(...topics.map(t => new Option(t.label, t.value)))).catch(() => {});
    api('/api/id').then(u => { form.name.value = u.name; form.email.value = u.email; form.phone.value = u.phone; }).catch(() => {});

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const send = form.querySelector('button');
        send.disabled = true;
        say('Sending…');
        try {
            const result = await api('/api/contact', 'POST', {
                name: form.name.value, email: form.email.value,
                phone: form.phone.value, topic: form.topic.value, message: form.message.value
            });
            form.message.value = '';
            say(result.message);
        } catch (err) { say(err.message, true); }
        send.disabled = false;
    });
</script>
