---
layout: sesh
title: About & Contact
nav: about
heading: About &amp; Contact
permalink: /sesh/about
---
<!-- Contact form: messages are saved by the backend (POST /api/contact);
     admins read them on their profile page and at Data -> Contact Messages in the backend -->
<section class="section wrap">
  <div class="with-sidebar">
    <div class="card">
      <h2>Send a message</h2>
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
    <aside class="sidebar">
      <div class="note">
        <h2>The project</h2>
        <p>A CSP capstone about precision oncology, built by the CSP-Oncology team.</p>
      </div>
      <div class="note">
  <h2>Team</h2>
  <ul>
    <li>Salma Zaghloul · Scrum Master · zaghloulsalma@hotmail.com</li>
    <li>Anika Seksaria · Product Owner · anika.seksaria@gmail.com</li>
    <li>Aashi Hegu · System Architect · aashihegu1@gmail.com</li>
    <li>Jailene Tang · Education Liaison · tangjailene@gmail.com</li>
  </ul>
</div>
      <a class="sesh__btn block" href="{{ '/sesh/background' | relative_url }}">About Sesh <span aria-hidden="true">→</span></a>
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
