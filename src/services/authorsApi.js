import axios from 'axios';
import { getCookie } from '../utils/cookies';

// API base URL - should be configured in environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: Enable session cookie transmission
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Bearer token and CSRF token
api.interceptors.request.use((config) => {
  // Add Bearer token from localStorage
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
 * Normalize image URL - convert relative URLs to absolute URLs
 * @param {string} imageUrl - Image URL from backend
 * @returns {string} Absolute image URL
 */
const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // If already absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If relative URL, prepend API base URL
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${baseUrl}${path}`;
};

/**
 * Process author data to normalize image URLs
 * @param {Object|Array} data - Single author or array of authors
 * @returns {Object|Array} Processed data with normalized image URLs
 */
const processAuthorData = (data) => {
  if (Array.isArray(data)) {
    return data.map(author => ({
      ...author,
      profilePictureUrl: normalizeImageUrl(author.profilePictureUrl)
    }));
  }

  if (data && typeof data === 'object') {
    return {
      ...data,
      profilePictureUrl: normalizeImageUrl(data.profilePictureUrl)
    };
  }

  return data;
};

/**
 * Get all authors with optional pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size (default: 100 for dropdown usage)
 * @returns {Promise} Response with authors data
 */
export const getAuthors = async (params = {}) => {
  const queryParams = {
    page: params.page || 0,
    size: params.size || 100,
  };

  const response = await api.get('/api/authors', { params: queryParams });

  // Process response data to normalize image URLs
  const data = response.data;
  if (data.content) {
    // Paginated response
    return {
      ...data,
      content: processAuthorData(data.content)
    };
  }

  // Array response
  return processAuthorData(data);
};

/**
 * Get author by ID
 * @param {number} id - Author ID
 * @returns {Promise} Author data
 */
export const getAuthorById = async (id) => {
  const response = await api.get(`/api/authors/${id}`);
  return processAuthorData(response.data);
};

/**
 * Get top 10 authors
 * @returns {Promise} Array of top authors
 */
export const getTopAuthors = async () => {
  const response = await api.get('/api/authors/top');
  return processAuthorData(response.data);
};

/**
 * Create a new author
 * @param {Object} authorData - Author data
 * @param {File} profilePicture - Profile picture file (optional)
 * @returns {Promise} Created author data
 */
export const createAuthor = async (authorData, profilePicture = null) => {
  const formData = new FormData();

  // Add author data as JSON blob with proper content type
  const authorBlob = new Blob([JSON.stringify(authorData)], {
    type: 'application/json'
  });
  formData.append('author', authorBlob);

  // Add profile picture if provided
  if (profilePicture) {
    formData.append('profilePicture', profilePicture);
  }

  // Interceptor will auto-detect FormData and remove Content-Type header
  const response = await api.post('/api/authors', formData);

  return processAuthorData(response.data);
};

/**
 * Update an existing author
 * @param {number} id - Author ID
 * @param {Object} authorData - Updated author data
 * @param {File} profilePicture - New profile picture file (optional)
 * @returns {Promise} Updated author data
 */
export const updateAuthor = async (id, authorData, profilePicture = null) => {
  const formData = new FormData();

  // Add author data as JSON blob with proper content type
  const authorBlob = new Blob([JSON.stringify({ ...authorData, id })], {
    type: 'application/json'
  });
  formData.append('author', authorBlob);

  // Add profile picture only if provided
  if (profilePicture) {
    formData.append('profilePicture', profilePicture);
  }

  // Interceptor will auto-detect FormData and remove Content-Type header
  const response = await api.put(`/api/authors/${id}`, formData);

  return processAuthorData(response.data);
};

/**
 * Delete an author
 * @param {number} id - Author ID
 * @returns {Promise} Success response
 */
export const deleteAuthor = async (id) => {
  const response = await api.delete(`/api/authors/${id}`);
  return response.data;
};

export default {
  getAuthors,
  getAuthorById,
  getTopAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
