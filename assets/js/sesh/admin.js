---
---
// Admin pages (/admin/messages, /admin/surveys, /admin/members): each fills the list on its own page.
// account.js has already sent anyone who isn't an admin away.
import { apiRequest } from '{{ site.baseurl }}/assets/js/sesh/api.js';
import { currentUser, el, say, when, setCount } from '{{ site.baseurl }}/assets/js/sesh/account.js';

const user = await currentUser;

// Contact messages: newest first, each with "Mark handled"
async function loadMessages(list, status) {
  const messages = await apiRequest('/api/contact');
  setCount('messages', messages.filter(m => !m.handled).length);
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
      await apiRequest('/api/contact', 'PUT', { id: m.id, handled: !m.handled }).catch(err => say(status, err.message, true));
      loadMessages(list, status);
    });
    card.append(head, el('p', 'message__body', m.message), reply, toggle);
    return card;
  }));
}

// Survey responses: one card per response, each question with its answer
async function loadSurveys(list) {
  const { questions, responses } = await apiRequest('/api/survey');
  setCount('surveys', responses.length);
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

// Members: everyone registered, with a role menu (PUT /api/user/role). Your own role can't be lowered.
async function loadMembers(tbody, status) {
  const members = await apiRequest('/api/user');
  setCount('members', members.length);
  tbody.replaceChildren(...members.map(m => {
    const tr = el('tr');
    [m.name, m.uid, m.email || '—', m.phone || '—'].forEach(value => tr.append(el('td', null, value)));
    const role = el('select', 'role-select');
    role.setAttribute('aria-label', `Role for ${m.name}`);
    ['User', 'Admin'].forEach(name => {
      const option = el('option', null, name);
      option.selected = name === m.role;
      role.append(option);
    });
    const isSelf = m.uid === user.uid;
    role.disabled = isSelf;
    if (isSelf) role.title = "You can't change your own role";
    role.addEventListener('change', async () => {
      role.disabled = true;
      say(status, `Saving ${m.name}…`);
      try {
        const saved = await apiRequest('/api/user/role', 'PUT', { uid: m.uid, role: role.value });
        say(status, `${saved.name} is now ${saved.role === 'Admin' ? 'an Admin' : 'a User'}.`);
      } catch (err) {
        role.value = m.role;
        say(status, err.message, true);
      }
      role.disabled = false;
      m.role = role.value;
    });
    const cell = el('td');
    cell.append(role);
    tr.append(cell);
    return tr;
  }));
}

if (user?.is_admin) {
  const messages = document.getElementById('messages-list');
  const surveys = document.getElementById('surveys-list');
  const members = document.querySelector('#members-table tbody');
  const status = document.getElementById('admin-message');
  const fail = err => say(status, err.message, true);
  if (messages) loadMessages(messages, status).catch(fail);
  if (surveys) loadSurveys(surveys).catch(fail);
  if (members) loadMembers(members, status).catch(fail);
}
