---
---
// Site settings (theme, text size, font, spacing, motion): read, apply and save.
// Saved in this browser so every page can apply them before it paints (see _layouts/sesh.html),
// and in the logged-in user's account (PUT /api/user { preferences }) so they follow them to other devices.
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

export const DEFAULTS = { theme: 'light', size: 'normal', font: 'default', spacing: 'normal', motion: 'on', language: 'en' };
const KEY = 'sesh-settings';

export function loadLocal() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; }
}

export function saveLocal(prefs) {
  try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
}

export function apply(prefs, root = document.documentElement) {
  const all = { ...DEFAULTS, ...prefs };
  for (const key of Object.keys(DEFAULTS)) root.setAttribute('data-' + key, all[key]);
  applyLanguage(all.language);
}

export function applyLanguage(language) {
  const lang = language === 'es' ? 'es' : '';
  rootSetLanguage(lang);
}

function clearTranslationCookies() {
  const domain = window.location.hostname;
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
}

function rootSetLanguage(language) {
  document.documentElement.setAttribute('data-translate-lang', language);

  if (!document.getElementById('google-translate-hide-css')) {
    const style = document.createElement('style');
    style.id = 'google-translate-hide-css';
    style.textContent = '.goog-te-banner-frame,.goog-te-balloon-frame{display:none!important}body{top:0!important;position:static!important}.goog-te-gadget,#google_translate_element{display:none!important}';
    document.head.appendChild(style);
  }

  clearTranslationCookies();

  if (!language) {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = '';
      select.dispatchEvent(new Event('change'));
    }
    return;
  }

  const domain = window.location.hostname;
  document.cookie = `googtrans=/en/${language}; path=/;`;
  document.cookie = `googtrans=/en/${language}; path=/; domain=${domain};`;

  if (!window.googleTranslateElementInit) {
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };
  }

  if (!document.getElementById('google_translate_element')) {
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.hidden = true;
    document.body.appendChild(container);
  }

  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }

  const selectLanguage = (attempt = 0) => {
    if (attempt > 100) return;
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = language;
      select.dispatchEvent(new Event('change'));
    } else {
      window.setTimeout(() => selectLanguage(attempt + 1), 50);
    }
  };
  selectLanguage();
}

export async function saveToAccount(prefs) {
  const response = await fetch(pythonURI + '/api/user', {
    ...fetchOptions, method: 'PUT', cache: 'no-store', body: JSON.stringify({ preferences: prefs })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`);
  return data.preferences || prefs;
}

// Called on every page once we know who's logged in: the account's settings win over this browser's
export function syncFromAccount(user) {
  const saved = user && user.preferences;
  if (!saved || !Object.keys(saved).length) return;
  if (JSON.stringify(saved) === JSON.stringify(loadLocal())) return;
  saveLocal(saved);
  apply(saved);
}
