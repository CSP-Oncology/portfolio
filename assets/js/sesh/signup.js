---
---
import { apiRequest, baseurl } from '{{ site.baseurl }}/assets/js/sesh/api.js';

// Same as Poway Recovery Center's js/signup.js: create the account (the backend logs it in), then go to the profile
const form = document.querySelector("#signup-form"), message = document.querySelector("#signup-message");
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (form.password.value !== form.confirm.value) { message.textContent = "Passwords do not match."; return; }
  message.textContent = "Creating your account…";
  try {
    await apiRequest("/api/user", "POST", {
      name: form.name.value, uid: form.uid.value, email: form.email.value, phone: form.phone.value, password: form.password.value
    });
    window.location.href = baseurl + "/profile";
  } catch (err) { message.textContent = err.message; }
});
