import axios from 'axios';

// API base URL - should match backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Keycloak configuration
const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:9080';
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || 'jhipster';
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'web_app';

// Create axios instance for backend API calls
const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: Enable session cookie transmission
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for Keycloak token endpoint
const keycloakApi = axios.create({
  baseURL: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

/**
 * Login with username and password using Keycloak Resource Owner Password Grant
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} Token response from Keycloak
 */
export const login = async (username, password) => {
  // Prepare form data for Keycloak token endpoint
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', KEYCLOAK_CLIENT_ID);
  params.append('username', username);
  params.append('password', password);
  params.append('scope', 'openid profile email');

  try {
    // Call Keycloak token endpoint
    const response = await keycloakApi.post('/token', params.toString());

    // Store tokens in localStorage
    const { access_token, refresh_token, id_token } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    if (id_token) {
      localStorage.setItem('id_token', id_token);
    }

    return response.data;
  } catch (error) {
    // Handle authentication errors
    if (error.response?.status === 401) {
      throw new Error('Invalid username or password');
    }
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const checkAuth = async () => {
  try {
    // Check if we have an access token
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }

    // Verify token is valid by calling backend
    await authApi.get('/api/authenticate', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token is invalid, clear storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('id_token');
      return false;
    }
    throw error;
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUser = async () => {
  const token = localStorage.getItem('access_token');
  const response = await authApi.get('/api/account', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Logout and redirect to Keycloak logout
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await authApi.post('/api/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { logoutUrl } = response.data;

    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');

    // Redirect to Keycloak logout URL
    if (logoutUrl) {
      window.location.href = logoutUrl;
    } else {
      // Fallback: redirect to login page if no logout URL provided
      window.location.href = '/admin/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Even if logout fails, clear tokens and redirect to login page
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');
    window.location.href = '/admin/login';
  }
};

/**
 * Get Keycloak configuration (optional, for debugging)
 * @returns {Promise<Object>} Auth info
 */
export const getAuthInfo = async () => {
  const response = await authApi.get('/api/auth-info');
  return response.data;
};

export default {
  login,
  checkAuth,
  getCurrentUser,
  logout,
  getAuthInfo,
};
