import axios from 'axios';
import { getCookie } from '../utils/cookies';
import { refreshAccessToken } from './authApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const redirectToLogin = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('id_token');
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/admin/login';
  }
};

// Returned after we trigger a redirect: never resolves or rejects,
// so the caller's .catch handler can't run an alert/toast before
// navigation tears down the JS context. Garbage-collected on unload.
const silentPending = () => new Promise(() => {});

/**
 * Create an axios instance wired up with:
 *  - Bearer token injection
 *  - CSRF header injection (with exempt URL list)
 *  - Automatic access-token refresh + one-time retry on 401
 *  - Fallback to login on refresh failure or network/CORS errors
 *    (backends that drop CORS headers on 401 surface as network errors,
 *    so we treat those as likely auth failures too)
 *
 * @param {{ csrfExempt?: string[] }} [options]
 * @returns {import('axios').AxiosInstance}
 */
export const createApiClient = ({ csrfExempt = [] } = {}) => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
      const isExempt = csrfExempt.includes(config.url);
      if (!isExempt) {
        const csrfToken = getCookie('XSRF-TOKEN');
        if (csrfToken) {
          config.headers['X-XSRF-TOKEN'] = csrfToken;
        }
      }
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;
      const hasToken = !!localStorage.getItem('access_token');

      // Detect the silent-token-expiry scenario: either an explicit 401,
      // or a network/CORS failure on an authenticated request (the backend
      // strips Access-Control-Allow-Origin on 401 so axios sees no response).
      // Guarded by hasToken so we don't loop on a truly-down backend at login.
      const looksLikeAuthFailure =
        hasToken && (status === 401 || !error.response);

      if (looksLikeAuthFailure && originalRequest) {
        if (!originalRequest._retry) {
          originalRequest._retry = true;

          let newToken;
          try {
            newToken = await refreshAccessToken();
          } catch {
            // Refresh itself failed — session is dead. Redirect silently
            // so the caller never sees an error to alert on.
            redirectToLogin();
            return silentPending();
          }

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Let the retry propagate naturally. If it fails with a real
          // error (500, validation, etc.), the caller handles it. If it
          // fails with another auth-looking error, _retry is set so we
          // fall through to the silent redirect below.
          return api(originalRequest);
        }

        // Already retried once and still auth-failing. Give up silently.
        redirectToLogin();
        return silentPending();
      }

      if (status === 403) {
        redirectToLogin();
        return silentPending();
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export { API_BASE_URL };
