---
layout: sesh
title: Create an account
permalink: /signup
search_exclude: true
---
<!-- Creates the account in the backend (POST /api/user) -->
<section class="auth">
  <div class="auth__card card">
    <h1>Create an account</h1>
    <form class="form" id="signup-form">
      <label class="field">Name<input type="text" name="name" required autocomplete="name"></label>
      <label class="field">Username<input type="text" name="uid" required minlength="3" maxlength="40" pattern="[A-Za-z0-9._\-]+" autocomplete="username" placeholder="Letters, numbers, dots or dashes"></label>
      <div class="field-pair">
        <label class="field">Email<input type="email" name="email" autocomplete="email" placeholder="Optional"></label>
        <label class="field">Phone<input type="tel" name="phone" autocomplete="tel" placeholder="Optional"></label>
      </div>
      <div class="field-pair">
        <label class="field">Password<input type="password" name="password" required minlength="6" autocomplete="new-password" placeholder="At least 6 characters"></label>
        <label class="field">Confirm password<input type="password" name="confirm" required minlength="6" autocomplete="new-password"></label>
      </div>
      <button class="sesh__btn large accent fill auth__submit">Create account</button>
      <p class="status-msg is-error" id="signup-message" role="status"></p>
    </form>
    <p class="auth__alt">Already have an account? <a href="{{site.baseurl}}/login">Log in</a></p>
  </div>
</section>

<script type="module" src="{{site.baseurl}}/assets/js/sesh/signup.js"></script>
