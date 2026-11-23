---
layout: sesh-account
title: Members
intro: Everyone with an account. Change a role with the menu; it saves right away.
account_tab: members
admin: true
permalink: /admin/members
search_exclude: true
---
<div class="table-scroll">
  <table class="data-table" id="members-table">
    <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead>
    <tbody></tbody>
  </table>
</div>
<p class="status-msg" id="admin-message" role="status"></p>
<script type="module" src="{{ '/assets/js/sesh/admin.js' | relative_url }}"></script>
