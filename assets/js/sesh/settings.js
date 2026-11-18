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
  try {
    const shared = JSON.parse(localStorage.getItem('sitePreferences') || '{}');
    shared.language = prefs.language === 'en' ? '' : prefs.language;
    localStorage.setItem('sitePreferences', JSON.stringify(shared));
  } catch (e) {}
}

export function apply(prefs, root = document.documentElement) {
  const all = { ...DEFAULTS, ...prefs };
  for (const key of Object.keys(DEFAULTS)) root.setAttribute('data-' + key, all[key]);
  applyLanguage(all.language);
}

export function applyLanguage(language) {
  const langCode = language === 'en' ? '' : language;
  document.documentElement.setAttribute('lang', language || 'en');
  window.SitePreferences?.applyLanguage(langCode);
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
