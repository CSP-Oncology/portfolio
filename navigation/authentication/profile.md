---
layout: sesh-account
title: My profile
account_tab: profile
permalink: /profile
search_exclude: true
show_reading_time: false
---
<!-- Your details are read from and saved to the backend database (PUT /api/user): assets/js/sesh/profile.js.
     Admin lists have their own pages in the sidebar (Contact messages, Survey responses, Members). -->
<div class="profile-main" id="profile-page" hidden>
  <p class="muted">Member since <span id="member-since"></span> · <span id="member-role"></span></p>

  <section class="card">
    <h2>Your details</h2>
    <form class="form" id="profile-form">
      <div class="field-pair">
        <label class="field">Username<input type="text" name="uid" readonly></label>
        <label class="field">Name<input type="text" name="name" required autocomplete="name"></label>
      </div>
      <div class="field-pair">
        <label class="field">Email<input type="email" name="email" autocomplete="email"></label>
        <label class="field">Phone<input type="tel" name="phone" autocomplete="tel"></label>
      </div>
      <div class="form-row">
        <p class="status-msg" id="profile-message" role="status"></p>
        <button class="sesh__btn medium accent fill">Save changes</button>
      </div>
    </form>
  </section>

  <details class="card password-panel">
    <summary>Change password</summary>
    <form class="form" id="password-form">
      <label class="field">Current password<input type="password" name="current_password" required autocomplete="current-password"></label>
      <div class="field-pair">
        <label class="field">New password<input type="password" name="new_password" required minlength="6" autocomplete="new-password"></label>
        <label class="field">Confirm new password<input type="password" name="confirm" required minlength="6" autocomplete="new-password"></label>
      </div>
      <div class="form-row">
        <p class="status-msg" id="password-message" role="status"></p>
        <button class="sesh__btn medium accent">Update password</button>
      </div>
    </form>
  </details>
</div>

<script type="module" src="{{ '/assets/js/sesh/profile.js' | relative_url }}"></script>
