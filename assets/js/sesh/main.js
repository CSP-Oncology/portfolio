---
---
// Site-wide behavior: mobile menu and "Log in" → your name when logged in
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Logged in (GET /api/id)? The account button shows your name and opens your profile, as on OCS
function showAccount(user) {
  document.querySelectorAll('[data-account-link]').forEach(link => {
    link.href = '{{ "/profile" | relative_url }}';
    link.textContent = user.name || user.uid;
    link.title = `Signed in as ${user.uid}. Open your profile`;
  });
}

fetch(pythonURI + '/api/id', { ...fetchOptions, cache: 'no-store' })
  .then(response => response.ok ? response.json() : null)
  .then(user => { if (user) showAccount(user); })
  .catch(() => {});

// Profile page saved a new name
document.addEventListener('sesh:user', event => showAccount(event.detail));
