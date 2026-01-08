import axios from 'axios';
import { getCookie } from '../utils/cookies';

// API base URL - should be configured in environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance WITHOUT default Content-Type
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

  // Set Content-Type ONLY for non-FormData requests
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
 * Process author data to set proper image URLs using the picture endpoint
 * Backend returns /api/authors/{id}/picture endpoint for fetching images
 * @param {Object|Array} data - Single author or array of authors
 * @returns {Object|Array} Processed data with proper image URLs
 */
const processAuthorData = (data) => {
  if (Array.isArray(data)) {
    return data.map(author => {
      const pictureUrl = author.id ? `${API_BASE_URL}/api/authors/${author.id}/picture?t=${Date.now()}` : null;
      return {
        ...author,
        profilePictureUrl: pictureUrl,
        imageUrl: pictureUrl // Add imageUrl alias for consistency with UI components
      };
    });
  }

  if (data && typeof data === 'object') {
    const pictureUrl = data.id ? `${API_BASE_URL}/api/authors/${data.id}/picture?t=${Date.now()}` : null;
    return {
      ...data,
      profilePictureUrl: pictureUrl,
      imageUrl: pictureUrl // Add imageUrl alias for consistency with UI components
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

  // Add author data with empty string for profilePictureUrl to satisfy @NotNull validation
  const authorWithUrl = {
    ...authorData,
    profilePictureUrl: ''
  };

  // Add author data as JSON blob with proper content type
  const authorBlob = new Blob([JSON.stringify(authorWithUrl)], {
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

  // Always send empty string for profilePictureUrl - backend manages the actual path
  const authorWithUrl = {
    ...authorData,
    id,
    profilePictureUrl: ''
  };

  console.log('=== updateAuthor DEBUG ===');
  console.log('id:', id);
  console.log('authorData received:', authorData);
  console.log('authorWithUrl:', authorWithUrl);
  console.log('JSON being sent:', JSON.stringify(authorWithUrl));
  console.log('profilePicture:', profilePicture);

  // Add author data as JSON blob with proper content type
  const authorBlob = new Blob([JSON.stringify(authorWithUrl)], {
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

/**
 * Get author profile picture URL
 * @param {number} id - The author ID
 * @returns {string} Profile picture URL
 */
export const getAuthorPictureUrl = (id) => {
  if (!id) return null;
  return `${API_BASE_URL}/api/authors/${id}/picture`;
};

export default {
  getAuthors,
  getAuthorById,
  getTopAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorPictureUrl,
};
