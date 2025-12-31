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
 * Process tag data to normalize image URLs
 * @param {Object|Array} data - Single tag or array of tags
 * @returns {Object|Array} Processed data with normalized image URLs
 */
const processTagData = (data) => {
  if (Array.isArray(data)) {
    return data.map(tag => ({
      ...tag,
      imageUrl: normalizeImageUrl(tag.imageUrl)
    }));
  }

  if (data && typeof data === 'object') {
    return {
      ...data,
      imageUrl: normalizeImageUrl(data.imageUrl)
    };
  }

  return data;
};

/**
 * Get all tags with optional filtering
 * @param {Object} params - Query parameters
 * @param {string} params.type - Filter by tag type (CATEGORY, ETIQUETTE, MAIN_DISPLAY)
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size
 * @returns {Promise} Response with tags data
 */
export const getTags = async (params = {}) => {
  const response = await api.get('/api/tags', { params });
  return processTagData(response.data);
};

/**
 * Get tags by type
 * @param {string} type - Tag type (CATEGORY, ETIQUETTE, MAIN_DISPLAY)
 * @param {Object} params - Additional query parameters
 * @returns {Promise} Response with tags data
 */
export const getTagsByType = async (type, params = {}) => {
  const queryParams = {
    ...params,
    type,
    page: params.page || 0,
    size: params.size || 100,
  };

  const response = await api.get('/api/tags', { params: queryParams });
  return processTagData(response.data);
};

/**
 * Get tag by ID
 * @param {number} id - Tag ID
 * @returns {Promise} Tag data
 */
export const getTagById = async (id) => {
  const response = await api.get(`/api/tags/${id}`);
  return processTagData(response.data);
};

/**
 * Create a new tag
 * @param {Object} tagData - Tag data
 * @param {File} image - Tag image file (optional)
 * @returns {Promise} Created tag data
 */
export const createTag = async (tagData, image = null) => {
  const formData = new FormData();

  // Add tag data as JSON blob with proper content type
  const tagBlob = new Blob([JSON.stringify(tagData)], {
    type: 'application/json'
  });
  formData.append('tag', tagBlob);

  // Add image if provided
  if (image) {
    formData.append('image', image);
  }

  // Interceptor will auto-detect FormData and remove Content-Type header
  const response = await api.post('/api/tags', formData);

  return processTagData(response.data);
};

/**
 * Update an existing tag
 * @param {number} id - Tag ID
 * @param {Object} tagData - Updated tag data
 * @param {File} image - New tag image file (optional)
 * @returns {Promise} Updated tag data
 */
export const updateTag = async (id, tagData, image = null) => {
  const formData = new FormData();

  // Add tag data as JSON blob with proper content type
  const tagBlob = new Blob([JSON.stringify({ ...tagData, id })], {
    type: 'application/json'
  });
  formData.append('tag', tagBlob);

  // Add image only if provided
  if (image) {
    formData.append('image', image);
  }

  // Interceptor will auto-detect FormData and remove Content-Type header
  const response = await api.put(`/api/tags/${id}`, formData);

  return processTagData(response.data);
};

/**
 * Delete a tag
 * @param {number} id - Tag ID
 * @returns {Promise} Success response
 */
export const deleteTag = async (id) => {
  const response = await api.delete(`/api/tags/${id}`);
  return response.data;
};

/**
 * Change tag color (ETIQUETTE type only)
 * @param {number} id - Tag ID
 * @param {string} color - New color (hex format)
 * @returns {Promise} Updated tag data
 */
export const changeTagColor = async (id, color) => {
  const response = await api.post(`/api/tags/${id}/change-color`, { color });
  return response.data;
};

/**
 * Add books to a tag
 * @param {number} tagId - Tag ID
 * @param {number[]} bookIds - Array of book IDs
 * @returns {Promise} Success response
 */
export const addBooksToTag = async (tagId, bookIds) => {
  const response = await api.post(`/api/tags/${tagId}/books/add`, bookIds);
  return response.data;
};

/**
 * Remove books from a tag
 * @param {number} tagId - Tag ID
 * @param {number[]} bookIds - Array of book IDs
 * @returns {Promise} Success response
 */
export const removeBooksFromTag = async (tagId, bookIds) => {
  const response = await api.post(`/api/tags/${tagId}/books/remove`, bookIds);
  return response.data;
};

export default {
  getTags,
  getTagsByType,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  changeTagColor,
  addBooksToTag,
  removeBooksFromTag,
};
