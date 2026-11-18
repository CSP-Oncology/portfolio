---
layout: sesh
title: Settings
heading: Settings
intro: Saved to your account.
permalink: /settings
search_exclude: true
---
<section class="section wrap" id="settings-page" hidden>
  <div class="with-sidebar">
    <form class="profile-main" id="settings-form">
      <section class="card">
        <h2><span class="step-badge">1</span> Pick a theme</h2>
        <div class="theme-grid" role="radiogroup" aria-label="Theme">
          {%- assign themes = "light:Light,dark:Dark,sepia:Sepia,ocean:Ocean,contrast:High contrast" | split: "," %}
          {%- for t in themes %}{% assign parts = t | split: ":" %}
          <label class="theme-swatch" data-theme="{{ parts[0] }}">
            <input type="radio" name="theme" value="{{ parts[0] }}">
            <span class="theme-swatch__sample">Aa</span>
            <span class="theme-swatch__name">{{ parts[1] }}</span>
            <span class="theme-swatch__dots" aria-hidden="true"><i></i><i></i><i></i></span>
          </label>
          {%- endfor %}
        </div>
      </section>

      <section class="card">
        <h2><span class="step-badge">2</span> Fine-tune</h2>
        <div class="setting-rows">
          <fieldset class="setting">
            <legend>Text size</legend>
            <div class="segmented">
              <label><input type="radio" name="size" value="small"><span>Small</span></label>
              <label><input type="radio" name="size" value="normal"><span>Normal</span></label>
              <label><input type="radio" name="size" value="large"><span>Large</span></label>
              <label><input type="radio" name="size" value="larger"><span>Larger</span></label>
            </div>
          </fieldset>
          <fieldset class="setting">
            <legend>Font</legend>
            <div class="segmented">
              <label><input type="radio" name="font" value="default"><span>Default</span></label>
              <label><input type="radio" name="font" value="readable"><span>Easy to read</span></label>
              <label><input type="radio" name="font" value="serif"><span>Serif</span></label>
            </div>
          </fieldset>
          <fieldset class="setting">
            <legend>Line spacing</legend>
            <div class="segmented">
              <label><input type="radio" name="spacing" value="normal"><span>Normal</span></label>
              <label><input type="radio" name="spacing" value="relaxed"><span>Relaxed</span></label>
            </div>
          </fieldset>
          <fieldset class="setting">
            <legend>Animations</legend>
            <div class="segmented">
              <label><input type="radio" name="motion" value="on"><span>On</span></label>
              <label><input type="radio" name="motion" value="off"><span>Off</span></label>
            </div>
          </fieldset>
          <fieldset class="setting">
            <legend>Language</legend>
            <select class="input" name="language" id="settings-language" aria-label="Language">
              <option value="en">English</option>
            </select>
          </fieldset>
        </div>
      </section>

      <div class="form-row">
        <p class="status-msg" id="settings-message" role="status"></p>
        <span class="form-row__buttons">
          <button class="sesh__btn medium" type="button" id="settings-reset">Reset</button>
          <button class="sesh__btn medium accent fill">Save</button>
        </span>
      </div>
    </form>

    <aside class="sidebar">
      <div class="note">
        <h2>Contrast check</h2>
        <ul class="check-list" id="contrast-list"></ul>
      </div>
    </aside>
  </div>
</section>

<script type="module">
  import { pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
  import { DEFAULTS, loadLocal, saveLocal, apply, saveToAccount } from '{{site.baseurl}}/assets/js/sesh/settings.js';

  const form = document.getElementById('settings-form');
  const message = document.getElementById('settings-message');
  const say = (text, isError) => { message.textContent = text; message.classList.toggle('is-error', !!isError); };

  const user = await fetch(pythonURI + '/api/id', { ...fetchOptions, cache: 'no-store' })
    .then(r => r.ok ? r.json() : null).catch(() => null);
  if (!user) {
    window.location.href = '{{site.baseurl}}/login';
  } else {
    document.getElementById('settings-page').hidden = false;
    let saved = { ...DEFAULTS, ...loadLocal(), ...(user.preferences || {}) };

    const languageSelect = form.elements.language;
    const languages = window.SitePreferences?.LANGUAGES || {};
    for (const [code, language] of Object.entries(languages)) {
      if (!code || languageSelect.querySelector(`option[value="${code}"]`)) continue;
      languageSelect.add(new Option(language.name, code));
    }

    const current = () => Object.fromEntries(Object.keys(DEFAULTS).map(key => [key, form.elements[key].value || DEFAULTS[key]]));
    const fill = prefs => {
      for (const key of Object.keys(DEFAULTS)) {
        form.elements[key].value = key === 'language' ? (prefs[key] || 'en') : prefs[key];
      }
    };

    // WCAG contrast ratio between two computed CSS colors
    function luminance(color) {
      const [r, g, b] = color.match(/[\d.]+/g).slice(0, 3).map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    const ratio = (a, b) => {
      const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    function checkContrast() {
      const style = getComputedStyle(document.body);
      const probe = document.querySelector('a');
      const linkStyle = probe ? getComputedStyle(probe) : style;
      const rows = [
        ['Text is readable', ratio(style.color, style.backgroundColor)],
        ['Links and buttons stand out', ratio(linkStyle.color, style.backgroundColor)]
      ];
      document.getElementById('contrast-list').replaceChildren(...rows.map(([label, value]) => {
        const li = document.createElement('li');
        const verdict = value >= 7 ? 'Great' : value >= 4.5 ? 'Good' : 'Low';
        li.textContent = `${label}: ${value.toFixed(1)}:1, ${verdict} contrast`;
        return li;
      }));
    }

    // Every change shows right away on the whole page; Save keeps it
    function preview() {
      apply(current());
      checkContrast();
      const changed = JSON.stringify(current()) !== JSON.stringify(saved);
      say(changed ? 'Not saved yet.' : '');
    }

    fill(saved);
    preview();
    form.addEventListener('change', preview);

    document.getElementById('settings-reset').addEventListener('click', () => { fill(DEFAULTS); preview(); });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const prefs = current();
      const previousLanguage = loadLocal().language || 'en';
      saveLocal(prefs);
      say('Saving…');
      try {
        saved = { ...DEFAULTS, ...(await saveToAccount(prefs)) };
        say('Saved to your account.');
        if (prefs.language !== previousLanguage) {
          window.location.reload();
        }
      } catch (err) {
        say(`Saved in this browser, but not to your account: ${err.message}`, true);
        if (prefs.language !== previousLanguage) {
          window.location.reload();
        }
      }
    });

    // Leaving without saving puts the saved settings back
    window.addEventListener('pagehide', () => apply(saved));
  }
</script>
