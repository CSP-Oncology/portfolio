---
layout: sesh
title: My profile
permalink: /profile
search_exclude: true
show_reading_time: false
---
<!-- Your details are read from and saved to
     the backend database (PUT /api/user). Admins also see every account. -->
<div id="profile-page" hidden>
  <section class="page-head">
    <div class="wrap">
      <h1>Hi, <span id="profile-name"></span></h1>
      <p>Member since <span id="member-since"></span></p>
    </div>
  </section>

  <section class="section wrap">
    <div class="with-sidebar">
      <div class="profile-main">
        <section class="card">
          <h2>Your details</h2>
          <form class="form" id="profile-form">
            <div class="field-pair">
              <label class="field">Username<input type="text" name="uid" readonly></label>
              <label class="field">Name<input type="text" name="name" required autocomplete="name"></label>
            </div>
            <div class="field-pair">
              <label class="field">Email<input type="email" name="email" autocomplete="email"></label>
              <label class="field">Phone<input type="tel" name="phone" autocomplete="tel"></label>
            </div>
            <div class="form-row">
              <p class="status-msg" id="profile-message" role="status"></p>
              <button class="sesh__btn medium accent fill">Save changes</button>
            </div>
          </form>
        </section>

        <details class="card password-panel">
          <summary>Change password</summary>
          <form class="form" id="password-form">
            <label class="field">Current password<input type="password" name="current_password" required autocomplete="current-password"></label>
            <div class="field-pair">
              <label class="field">New password<input type="password" name="new_password" required minlength="6" autocomplete="new-password"></label>
              <label class="field">Confirm new password<input type="password" name="confirm" required minlength="6" autocomplete="new-password"></label>
            </div>
            <div class="form-row">
              <p class="status-msg" id="password-message" role="status"></p>
              <button class="sesh__btn medium accent">Update password</button>
            </div>
          </form>
        </details>
      </div>

      <aside class="sidebar">
        <nav class="note" aria-label="Shortcuts">
          <h2>Shortcuts</h2>
          <div class="shortcut-list">
            <a class="sesh__btn block" href="{{site.baseurl}}/settings">Settings: theme, language, voice <span aria-hidden="true">→</span></a>
            <a class="sesh__btn block" href="{{site.baseurl}}/sesh/reload">RELOAD <span aria-hidden="true">→</span></a>
            <a class="sesh__btn block" href="{{site.baseurl}}/sesh/science">Science topics <span aria-hidden="true">→</span></a>
            <a class="sesh__btn block" href="{{site.baseurl}}/sesh/glossary">Glossary <span aria-hidden="true">→</span></a>
            <a class="sesh__btn block" href="{{site.baseurl}}/sesh/about">Contact us <span aria-hidden="true">→</span></a>
            <a class="sesh__btn block" href="{{site.baseurl}}/sesh/survey">Take a quick survey <span aria-hidden="true">→</span></a>
          </div>
        </nav>
        <a class="sesh__btn alert-red" id="logout" href="{{site.baseurl}}/logout">Log out</a>
      </aside>
    </div>
  </section>

  <!-- Admins only: contact messages, survey responses and everyone registered in the database -->
  <section class="section wrap" id="admin-messages" hidden>
    <div class="section-title"><h2>Messages <span id="messages-count"></span></h2></div>
    <div id="messages-list"></div>
    <p class="status-msg is-error" id="messages-message" role="status"></p>
  </section>
  <section class="section wrap" id="admin-surveys" hidden>
    <div class="section-title"><h2>Survey responses <span id="surveys-count"></span></h2></div>
    <div class="table-scroll">
      <table class="data-table" id="surveys-table">
        <thead></thead>
        <tbody></tbody>
      </table>
    </div>
    <p class="status-msg is-error" id="surveys-message" role="status"></p>
  </section>
  <section class="section wrap" id="admin" hidden>
    <div class="section-title"><h2>Members <span id="members-count"></span></h2></div>
    <div class="table-scroll">
      <table class="data-table" id="members-table">
        <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>
    <p class="status-msg is-error" id="members-message" role="status"></p>
  </section>
</div>

<script type="module">
    import { pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    // Call the backend; returns parsed JSON or throws an Error with the server's message
    async function apiRequest(path, method = 'GET', body) {
        const response = await fetch(pythonURI + path, {
            ...fetchOptions, method, cache: 'no-store', body: body ? JSON.stringify(body) : undefined
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`);
        return data;
    }

    const say = (node, text, isError) => { node.textContent = text; node.classList.toggle('is-error', !!isError); };

    const user = await apiRequest('/api/id').catch(() => null);
    if (!user) {
        window.location.href = '{{site.baseurl}}/login';
    } else {
        const form = document.getElementById('profile-form');
        const passwordForm = document.getElementById('password-form');

        function show(u) {
            document.getElementById('profile-name').textContent = u.name.split(' ')[0];
            document.getElementById('member-since').textContent = u.created_at
                ? new Date(u.created_at + 'Z').toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '—';
            form.uid.value = u.uid; form.name.value = u.name; form.email.value = u.email; form.phone.value = u.phone;
        }
        show(user);
        document.getElementById('profile-page').hidden = false;

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const message = document.getElementById('profile-message');
            say(message, 'Saving…');
            try {
                show(await apiRequest('/api/user', 'PUT', { name: form.name.value, email: form.email.value, phone: form.phone.value }));
                say(message, 'Saved.');
                if (user.is_admin) loadMembers();
            } catch (err) { say(message, err.message, true); }
        });

        passwordForm.addEventListener('submit', async e => {
            e.preventDefault();
            const message = document.getElementById('password-message');
            if (passwordForm.new_password.value !== passwordForm.confirm.value) { say(message, 'New passwords do not match.', true); return; }
            say(message, 'Updating…');
            try {
                await apiRequest('/api/user', 'PUT', { current_password: passwordForm.current_password.value, new_password: passwordForm.new_password.value });
                passwordForm.reset();
                say(message, 'Password updated.');
            } catch (err) { say(message, err.message, true); }
        });

        async function loadMembers() {
            const members = await apiRequest('/api/user');
            document.getElementById('members-count').textContent = `(${members.length})`;
            document.querySelector('#members-table tbody').replaceChildren(...members.map(m => {
                const tr = document.createElement('tr');
                [m.name, m.uid, m.email || '—', m.phone || '—', m.role].forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    tr.append(td);
                });
                return tr;
            }));
        }

        async function loadMessages() {
            const list = document.getElementById('messages-list');
            const messages = await apiRequest('/api/contact');
            document.getElementById('messages-count').textContent = `(${messages.filter(m => !m.handled).length} new)`;
            if (!messages.length) { list.textContent = 'No messages yet.'; return; }
            list.replaceChildren(...messages.map(m => {
                const card = document.createElement('article');
                card.className = 'message' + (m.handled ? ' is-handled' : '');
                const meta = document.createElement('div');
                meta.className = 'small muted';
                meta.textContent = [m.name, m.organization, m.topic_label,
                    new Date(m.created_at + 'Z').toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })].filter(Boolean).join(' · ');
                const body = document.createElement('p');
                body.textContent = m.message;
                const reply = document.createElement('div');
                reply.className = 'small muted';
                reply.textContent = [m.email, m.phone].filter(Boolean).join(' · ') || 'No contact details left';
                const toggle = document.createElement('button');
                toggle.type = 'button';
                toggle.className = 'sesh__btn small accent';
                toggle.textContent = m.handled ? 'Mark as new' : 'Mark handled';
                toggle.addEventListener('click', async () => {
                    toggle.disabled = true;
                    await apiRequest('/api/contact', 'PUT', { id: m.id, handled: !m.handled })
                        .catch(err => say(document.getElementById('messages-message'), err.message, true));
                    loadMessages();
                });
                card.append(meta, body, reply, toggle);
                return card;
            }));
        }

        async function loadSurveys() {
            const { questions, responses } = await apiRequest('/api/survey');
            document.getElementById('surveys-count').textContent = `(${responses.length})`;
            const cell = (tag, text) => { const el = document.createElement(tag); el.textContent = text; return el; };
            const head = document.createElement('tr');
            head.append(cell('th', 'Received'), cell('th', 'Account'), ...questions.map(q => cell('th', q.label)));
            document.querySelector('#surveys-table thead').replaceChildren(head);
            const body = document.querySelector('#surveys-table tbody');
            if (!responses.length) {
                const td = cell('td', 'No responses yet.');
                td.colSpan = questions.length + 2;
                const tr = document.createElement('tr');
                tr.append(td);
                body.replaceChildren(tr);
                return;
            }
            body.replaceChildren(...responses.map(r => {
                const tr = document.createElement('tr');
                const when = new Date(r.created_at + 'Z').toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
                tr.append(cell('td', when), cell('td', r.user || '—'), ...questions.map(q => {
                    const value = r.answers[q.key];
                    return cell('td', Array.isArray(value) ? value.join(', ') : (value || '—'));
                }));
                return tr;
            }));
        }

        if (user.is_admin) {
            document.getElementById('admin').hidden = false;
            document.getElementById('admin-messages').hidden = false;
            document.getElementById('admin-surveys').hidden = false;
            loadSurveys().catch(err => say(document.getElementById('surveys-message'), err.message, true));
            loadMembers().catch(err => say(document.getElementById('members-message'), err.message, true));
            loadMessages().catch(err => say(document.getElementById('messages-message'), err.message, true));
        }
    }
</script>
