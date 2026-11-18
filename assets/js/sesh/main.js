---
---
// Site-wide behavior: mobile menu and "Log in" → "My profile" when logged in
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
import { syncFromAccount } from '{{ site.baseurl }}/assets/js/sesh/settings.js';

const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Logged in (CSP-Oncology/flask: GET /api/id)? Point the account links at the profile
fetch(pythonURI + '/api/id', { ...fetchOptions, cache: 'no-store' })
  .then(response => response.ok ? response.json() : null)
  .then(user => {
    if (!user) return;
    syncFromAccount(user);
    document.querySelectorAll('[data-account-link]').forEach(link => {
      link.href = '{{ "/profile" | relative_url }}';
      link.textContent = 'My profile';
    });
  })
  .catch(() => {});
