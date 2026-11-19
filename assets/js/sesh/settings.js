// Account preferences are stored in the format consumed by the OCS preference module.
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
