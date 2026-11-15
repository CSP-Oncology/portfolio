---
layout: sesh
title: Log out
permalink: /logout
search_exclude: True
---
<section class="auth">
  <div class="auth__card card"><p class="muted">Logging you out…</p></div>
</section>

<script type="module">
    import { pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';
    // Clears the login cookie on the backend (CSP-Oncology/flask: DELETE /api/authenticate)
    await fetch(pythonURI + '/api/authenticate', { ...fetchOptions, method: 'DELETE' }).catch(() => {});
    window.location.href = "{{site.baseurl}}/login";
</script>
