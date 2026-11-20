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

  <!-- Admins only (same layout as the Poway Recovery Center profile page): contact messages,
       survey responses and everyone registered in the database, one tab each -->
  <section class="section wrap admin" id="admin" hidden>
    <div class="section-title"><h2>Admin</h2></div>
    <div class="tabs" data-tabs>
      <div class="tabs__list" role="tablist" aria-label="Admin">
        <button class="tabs__tab" type="button" role="tab" id="tab-messages" aria-controls="panel-messages" aria-selected="true">Contact messages <span class="tabs__count" id="messages-count">0</span></button>
        <button class="tabs__tab" type="button" role="tab" id="tab-surveys" aria-controls="panel-surveys" aria-selected="false" tabindex="-1">Survey responses <span class="tabs__count" id="surveys-count">0</span></button>
        <button class="tabs__tab" type="button" role="tab" id="tab-members" aria-controls="panel-members" aria-selected="false" tabindex="-1">Members <span class="tabs__count" id="members-count">0</span></button>
      </div>
      <div class="tabs__panel" role="tabpanel" id="panel-messages" aria-labelledby="tab-messages" tabindex="0">
        <div id="messages-list"></div>
        <p class="status-msg is-error" id="messages-message" role="status"></p>
      </div>
      <div class="tabs__panel" role="tabpanel" id="panel-surveys" aria-labelledby="tab-surveys" tabindex="0" hidden>
        <div id="surveys-list"></div>
        <p class="status-msg is-error" id="surveys-message" role="status"></p>
      </div>
      <div class="tabs__panel" role="tabpanel" id="panel-members" aria-labelledby="tab-members" tabindex="0" hidden>
        <div class="table-scroll"><table class="data-table" id="members-table"><thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead><tbody></tbody></table></div>
        <p class="status-msg is-error" id="members-message" role="status"></p>
      </div>
    </div>
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

        const el = (tag, className, text) => {
            const node = document.createElement(tag);
            if (className) node.className = className;
            if (text !== undefined) node.textContent = text;
            return node;
        };
        const when = iso => new Date(iso + 'Z').toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

        // Tabs: click or arrow keys (WAI-ARIA tabs pattern, same as Poway Recovery Center's js/tabs.js)
        function initTabs(container) {
            const tabs = [...container.querySelectorAll('[role=tab]')];
            const select = (tab, focus) => {
                tabs.forEach(t => {
                    const on = t === tab;
                    t.setAttribute('aria-selected', on);
                    t.tabIndex = on ? 0 : -1;
                    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
                });
                if (focus) tab.focus();
            };
            tabs.forEach((tab, i) => {
                tab.addEventListener('click', () => select(tab));
                tab.addEventListener('keydown', e => {
                    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
                    if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
                });
            });
        }

        async function loadMembers() {
            const members = await apiRequest('/api/user');
            document.getElementById('members-count').textContent = members.length;
            document.querySelector('#members-table tbody').replaceChildren(...members.map(m => {
                const tr = el('tr');
                [m.name, m.uid, m.email || '—', m.phone || '—', m.role].forEach(value => tr.append(el('td', null, value)));
                return tr;
            }));
        }

        async function loadMessages() {
            const list = document.getElementById('messages-list');
            const messages = await apiRequest('/api/contact');
            document.getElementById('messages-count').textContent = messages.filter(m => !m.handled).length;
            if (!messages.length) { list.replaceChildren(el('p', 'muted', 'No messages yet.')); return; }
            list.replaceChildren(...messages.map(m => {
                const card = el('article', 'message' + (m.handled ? ' is-handled' : ''));
                const head = el('div', 'message__head');
                head.append(el('strong', null, m.name));
                if (m.organization) head.append(el('span', 'small muted', m.organization));
                head.append(el('span', 'tag', m.topic_label), el('span', 'small muted', when(m.created_at)));
                const reply = el('p', 'small muted', [m.email, m.phone].filter(Boolean).join(' · ') || 'No contact details left');
                const toggle = el('button', 'sesh__btn small ' + (m.handled ? 'accent' : 'accent fill'), m.handled ? 'Mark as new' : 'Mark handled');
                toggle.type = 'button';
                toggle.addEventListener('click', async () => {
                    toggle.disabled = true;
                    await apiRequest('/api/contact', 'PUT', { id: m.id, handled: !m.handled })
                        .catch(err => say(document.getElementById('messages-message'), err.message, true));
                    loadMessages();
                });
                card.append(head, el('p', 'message__body', m.message), reply, toggle);
                return card;
            }));
        }

        // Survey responses: one card per response, each question with its answer
        async function loadSurveys() {
            const list = document.getElementById('surveys-list');
            const { questions, responses } = await apiRequest('/api/survey');
            document.getElementById('surveys-count').textContent = responses.length;
            if (!responses.length) { list.replaceChildren(el('p', 'muted', 'No survey responses yet.')); return; }
            list.replaceChildren(...responses.map((r, i) => {
                const card = el('article', 'message');
                const head = el('div', 'message__head');
                head.append(el('strong', null, `Response ${responses.length - i}`),
                    el('span', 'tag', r.user || 'Not logged in'), el('span', 'small muted', when(r.created_at)));
                const answers = el('dl', 'survey-answers');
                questions.forEach(q => {
                    const value = r.answers[q.key];
                    if (!value || (Array.isArray(value) && !value.length)) return;
                    answers.append(el('dt', null, q.label), el('dd', null, Array.isArray(value) ? value.join(', ') : value));
                });
                card.append(head, answers);
                return card;
            }));
        }

        if (user.is_admin) {
            document.getElementById('admin').hidden = false;
            initTabs(document.querySelector('#admin [data-tabs]'));
            loadMessages().catch(err => say(document.getElementById('messages-message'), err.message, true));
            loadSurveys().catch(err => say(document.getElementById('surveys-message'), err.message, true));
            loadMembers().catch(err => say(document.getElementById('members-message'), err.message, true));
        }
    }
</script>
