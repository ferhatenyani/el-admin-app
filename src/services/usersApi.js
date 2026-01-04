import axios from 'axios';
import { getCookie } from '../utils/cookies';

// API base URL - should be configured in environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: Enable session cookie transmission
});

// Request interceptor to add Bearer token and CSRF token
api.interceptors.request.use((config) => {
  // Add Bearer token from localStorage
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Set Content-Type for JSON requests
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  // Add CSRF token for POST, PUT, DELETE, PATCH requests
  if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
  }
  return config;
});

// Response interceptor for handling authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401/403 errors by redirecting to login
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Get all app users with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size (default: 20)
 * @param {boolean} params.active - Filter by activation status (optional)
 * @returns {Promise} Response with users data
 */
export const getUsers = async (params = {}) => {
  const queryParams = {
    page: params.page || 0,
    size: params.size || 20,
  };

  // Add active filter if provided
  if (params.active !== undefined && params.active !== null) {
    queryParams.active = params.active;
  }

  const response = await api.get('/api/admin', { params: queryParams });
  return response.data;
};

/**
 * Toggle user activation status (admin only)
 * @param {string} userId - The ID of the user to toggle
 * @returns {Promise} Response with status 204
 */
export const toggleUserActivation = async (userId) => {
  const response = await api.patch(`/api/admin/${userId}/toggle`);
  return response.data;
};

/**
 * Export all non-admin users to Excel (admin only)
 * @returns {Promise} Blob response containing the Excel file
 */
export const exportUsers = async () => {
  const response = await api.get('/api/admin/export', {
    responseType: 'blob',
  });
  return response;
};

export default {
  getUsers,
  toggleUserActivation,
  exportUsers,
};
