---
---
import { login, baseurl } from '{{ site.baseurl }}/assets/js/sesh/api.js';

// Same as Poway Recovery Center's js/login.js
const form = document.querySelector("#login-form"), message = document.querySelector("#login-message");
form.addEventListener("submit", e => {
  e.preventDefault();
  message.textContent = "Logging in…";
  login({
    body: { uid: form.uid.value, password: form.password.value },
    message: "login-message",
    callback: () => { window.location.href = baseurl + "/profile"; }
  });
});
