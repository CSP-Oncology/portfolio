---
layout: sesh
title: Log in
permalink: /login
search_exclude: true
---
<!-- Same as Poway Recovery Center's login.html; logs in with the backend, CSP-Oncology/flask (POST /api/authenticate) -->
<section class="auth">
  <div class="auth__card card">
    <h1>Log in</h1>
    <form class="form" id="login-form">
      <label class="field">Username or email<input type="text" name="uid" required autocomplete="username"></label>
      <label class="field">Password<input type="password" name="password" required minlength="6" autocomplete="current-password"></label>
      <button class="sesh__btn large accent fill auth__submit">Log in</button>
      <p class="status-msg is-error" id="login-message" role="status"></p>
    </form>
    <p class="auth__alt">New here? <a href="{{site.baseurl}}/signup">Create an account</a></p>
  </div>
</section>

<script type="module" src="{{site.baseurl}}/assets/js/sesh/login.js"></script>
