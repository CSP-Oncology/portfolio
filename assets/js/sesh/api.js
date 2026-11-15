---
---
// Backend calls for the Sesh pages (same as Poway Recovery Center's js/api/config.js and js/api/login.js).
// The backend address comes from the template's assets/js/api/config.js (localhost:8587 when running locally).
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';

export const baseurl = "{{ site.baseurl }}";

// Shared request helper: returns parsed JSON, or throws an Error with the server's message
export async function apiRequest(path, method = 'GET', body) {
    let response;
    try {
        response = await fetch(pythonURI + path, {
            ...fetchOptions,
            method,
            cache: 'no-store',
            body: body ? JSON.stringify(body) : undefined
        });
    } catch (error) {
        // Network failure: backend not running, or blocked by CORS
        console.log('Possible CORS or Service Down error: ' + error);
        throw new Error(`Can't reach the Sesh server at ${pythonURI}. Please try again shortly.`);
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw Object.assign(new Error(data.message || `Request failed: ${response.status}`), { status: response.status });
    }
    return data;
}

// User Login Function
export function login(options) {
    document.getElementById(options.message).textContent = "";
    return apiRequest('/api/authenticate', 'POST', options.body)
        .then(() => options.callback())
        .catch(error => { document.getElementById(options.message).textContent = error.message; });
}

// Current user from the backend, or null when logged out / server unreachable
export function getCredentials() {
    return apiRequest('/api/id').catch(() => null);
}
