---
---
// Preferences from the logged-in account, on every page (the Settings page is
// navigation/authentication/settings.html). The account's copy wins over this browser's,
// so a theme saved on one device shows on the next page you open on another.
//
// Stored the way the Open Coding Society scripts read them: 'sitePreferences' (theme, language,
// voice) is applied by assets/js/user-preferences.js.

const PREFS_KEY = 'sitePreferences';

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
}

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

/** user: GET /api/id. Applies the account's preferences here if this browser has different ones. */
export function syncFromAccount(user) {
  const saved = (user && user.preferences) || {};

  // No theme saved to the account yet: keep what this browser has
  if (!saved.bg && !saved.text) return;
  if (JSON.stringify(saved) === JSON.stringify(read(PREFS_KEY))) return;

  write(PREFS_KEY, saved);
  try { localStorage.removeItem('preferencesReset'); } catch (e) {}
  window.SitePreferences?.applyPreferences(saved);
}
