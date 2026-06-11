import axios from 'axios';
import { getCookie } from '../utils/cookies';

// API base URL - should be configured in environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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
 * Get aggregate search statistics
 * Backend endpoint: GET /api/admin/search-logs/stats?days={days}
 * @param {number} days - Period in days (1-365)
 * @returns {Promise<Object>} { totalSearches, uniqueTerms, zeroResultSearches, zeroResultRate }
 */
export const getSearchStats = async (days = 30) => {
  const response = await api.get('/api/admin/search-logs/stats', { params: { days } });
  return response.data;
};

/**
 * Get most searched terms
 * Backend endpoint: GET /api/admin/search-logs/top-terms?days={days}&limit={limit}
 * @returns {Promise<Array>} [{ term, count, avgResults, lastSearchedAt }]
 */
export const getTopTerms = async (days = 30, limit = 10) => {
  const response = await api.get('/api/admin/search-logs/top-terms', { params: { days, limit } });
  return response.data;
};

/**
 * Get most searched terms that returned no results (stocking opportunities)
 * Backend endpoint: GET /api/admin/search-logs/zero-results?days={days}&limit={limit}
 * @returns {Promise<Array>} [{ term, count, avgResults, lastSearchedAt }]
 */
export const getZeroResultTerms = async (days = 30, limit = 10) => {
  const response = await api.get('/api/admin/search-logs/zero-results', { params: { days, limit } });
  return response.data;
};

/**
 * Get daily search counts for trend chart
 * Backend endpoint: GET /api/admin/search-logs/trend?days={days}
 * @returns {Promise<Array>} [{ date: 'YYYY-MM-DD', count }]
 */
export const getSearchTrend = async (days = 30) => {
  const response = await api.get('/api/admin/search-logs/trend', { params: { days } });
  return response.data;
};

/**
 * Get recent individual searches (paginated)
 * Backend endpoint: GET /api/admin/search-logs?page={page}&size={size}
 * @returns {Promise<Object>} Spring Page of { id, searchTerm, resultsCount, userLogin, visitorId, searchedAt }
 */
export const getRecentSearches = async (page = 0, size = 10) => {
  const response = await api.get('/api/admin/search-logs', { params: { page, size } });
  return response.data;
};

export default {
  getSearchStats,
  getTopTerms,
  getZeroResultTerms,
  getSearchTrend,
  getRecentSearches,
};
