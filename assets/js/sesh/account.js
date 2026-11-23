---
---
// Account pages (_layouts/sesh-account.html): who is logged in, the sidebar's admin section and counts,
// and the guard on admin pages. Page scripts import `currentUser` from here so /api/id is asked once.
import { apiRequest, getCredentials, baseurl } from '{{ site.baseurl }}/assets/js/sesh/api.js';

export const currentUser = getCredentials();

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export const say = (node, text, isError) => { node.textContent = text; node.classList.toggle('is-error', !!isError); };

export const when = iso => new Date(iso + 'Z').toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

// A number beside a sidebar link (unread messages, responses, members)
export function setCount(name, value) {
  document.querySelectorAll(`[data-count="${name}"]`).forEach(badge => {
    badge.textContent = value;
    badge.hidden = !value;
  });
}

const user = await currentUser;
const adminPage = document.querySelector('[data-admin-page]');

if (adminPage && !user) {
  window.location.href = baseurl + '/login';
} else if (adminPage && !user.is_admin) {
  window.location.href = baseurl + '/profile';
}

document.querySelectorAll('[data-logged-in-only]').forEach(node => { node.hidden = !user; });

if (user?.is_admin) {
  document.querySelectorAll('[data-admin-only]').forEach(node => { node.hidden = false; });
  // Counts for the sidebar; each admin page refreshes its own after a change
  apiRequest('/api/contact').then(list => setCount('messages', list.filter(m => !m.handled).length)).catch(() => {});
  apiRequest('/api/survey').then(data => setCount('surveys', data.responses.length)).catch(() => {});
  apiRequest('/api/user').then(list => setCount('members', list.length)).catch(() => {});
}
