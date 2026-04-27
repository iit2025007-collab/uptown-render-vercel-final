const rawApiUrl = String(import.meta.env.VITE_API_URL || '').trim();
const runningOnLocalhost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_URL = rawApiUrl || (runningOnLocalhost ? 'http://localhost:4000/api' : '');

export function getToken() {
  return localStorage.getItem('uptown_token') || '';
}

export function setToken(token) {
  if (token) localStorage.setItem('uptown_token', token);
  else localStorage.removeItem('uptown_token');
}

export async function api(path, options = {}) {
  if (!API_URL) {
    throw new Error('API is not configured. Set VITE_API_URL to your backend URL ending with /api.');
  }
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  const hasBody = options.body !== undefined && options.body !== null;
  if (hasBody && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export function compactDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
