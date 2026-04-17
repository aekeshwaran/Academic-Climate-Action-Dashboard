import axios from 'axios';

/**
 * Centralized Axios instance.
 * Base URL is read from VITE_API_BASE_URL in client/.env — never hardcode it.
 * Import this `api` object in every component instead of using axios directly.
 *
 * Usage:
 *   import api from '@/lib/api';
 *   const { data } = await api.get('/api/energy');
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler — logs 401s for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API] Unauthorized — token may be expired');
    }
    return Promise.reject(error);
  }
);

export default api;
