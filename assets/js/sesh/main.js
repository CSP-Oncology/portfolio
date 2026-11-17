---
---
// Site-wide behavior: mobile menu, theme toggle, and "Log in" → "My profile" when logged in
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
import { syncFromAccount, loadLocal, saveLocal, apply } from '{{ site.baseurl }}/assets/js/sesh/settings.js';

const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

function updateThemeButtons(theme) {
  const buttons = document.querySelectorAll('[data-theme-toggle]');
  const nextLabel = theme === 'dark' ? 'Light mode' : 'Dark mode';
  buttons.forEach((button) => {
    button.textContent = nextLabel;
    button.setAttribute('aria-label', `Switch to ${nextLabel.toLowerCase()}`);
  });
}

function setTheme(theme) {
  const prefs = loadLocal();
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  prefs.theme = nextTheme;
  saveLocal(prefs);
  apply(prefs);
  updateThemeButtons(nextTheme);
}

document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
});

const savedTheme = loadLocal().theme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
updateThemeButtons(savedTheme);
setTheme(savedTheme);

// Logged in (CSP-Oncology/flask: GET /api/id)? Point the account links at the profile
fetch(pythonURI + '/api/id', { ...fetchOptions, cache: 'no-store' })
  .then(response => response.ok ? response.json() : null)
  .then(user => {
    if (!user) return;
    syncFromAccount(user);
    updateThemeButtons(document.documentElement.getAttribute('data-theme') || 'light');
    document.querySelectorAll('[data-account-link]').forEach(link => {
      link.href = '{{ "/profile" | relative_url }}';
      link.textContent = 'My profile';
    });
  })
  .catch(() => {});
