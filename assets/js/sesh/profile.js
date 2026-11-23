---
---
// Profile page: your details and password, read from and saved to the backend (PUT /api/user)
import { apiRequest, baseurl } from '{{ site.baseurl }}/assets/js/sesh/api.js';
import { currentUser, say } from '{{ site.baseurl }}/assets/js/sesh/account.js';

const user = await currentUser;

if (!user) {
  window.location.href = baseurl + '/login';
} else {
  const form = document.getElementById('profile-form');
  const passwordForm = document.getElementById('password-form');

  function show(u) {
    document.getElementById('account-title').textContent = `Hi, ${u.name.split(' ')[0]}`;
    document.getElementById('member-since').textContent = u.created_at
      ? new Date(u.created_at + 'Z').toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '—';
    document.getElementById('member-role').textContent = u.role;
    form.uid.value = u.uid; form.name.value = u.name; form.email.value = u.email; form.phone.value = u.phone;
  }
  show(user);
  document.getElementById('profile-page').hidden = false;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const message = document.getElementById('profile-message');
    say(message, 'Saving…');
    try {
      const saved = await apiRequest('/api/user', 'PUT', { name: form.name.value, email: form.email.value, phone: form.phone.value });
      show(saved);
      document.dispatchEvent(new CustomEvent('sesh:user', { detail: saved }));  // header shows the new name
      say(message, 'Saved.');
    } catch (err) { say(message, err.message, true); }
  });

  passwordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const message = document.getElementById('password-message');
    if (passwordForm.new_password.value !== passwordForm.confirm.value) { say(message, 'New passwords do not match.', true); return; }
    say(message, 'Updating…');
    try {
      await apiRequest('/api/user', 'PUT', { current_password: passwordForm.current_password.value, new_password: passwordForm.new_password.value });
      passwordForm.reset();
      say(message, 'Password updated.');
    } catch (err) { say(message, err.message, true); }
  });
}
