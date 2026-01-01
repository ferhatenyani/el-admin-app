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
 * Process pack data to normalize image URLs and transform data structure
 * Backend returns: { id, title, description, coverUrl, price, createdDate, lastModifiedDate, books }
 * Frontend expects: { id, name, description, image, price, books }
 * @param {Object|Array} data - Single pack or array of packs
 * @returns {Object|Array} Processed data with normalized structure
 */
const processPackData = (data) => {
  const transformPack = (pack) => {
    if (!pack) return null;

    return {
      id: pack.id,
      name: pack.title, // Backend uses 'title', frontend uses 'name'
      description: pack.description,
      image: pack.id ? `${API_BASE_URL}/api/book-packs/${pack.id}/cover` : null, // Use cover endpoint
      coverUrl: pack.coverUrl, // Keep original for updates
      price: pack.price,
      books: pack.books || [],
      createdDate: pack.createdDate,
      lastModifiedDate: pack.lastModifiedDate,
    };
  };

  if (Array.isArray(data)) {
    return data.map(transformPack);
  }

  if (data && typeof data === 'object') {
    return transformPack(data);
  }

  return data;
};

/**
 * Transform frontend pack data to backend format
 * @param {Object} packData - Pack data from frontend
 * @returns {Object} Pack data in backend format
 */
const transformToBackendFormat = (packData) => {
  return {
    id: packData.id,
    title: packData.name || packData.title, // Frontend uses 'name', backend uses 'title'
    description: packData.description,
    coverUrl: packData.coverUrl || '', // Backend requires this field
    price: parseFloat(packData.price),
    books: packData.books || [],
  };
};

/**
 * Get book packs with server-side filtering, sorting, and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size (default: 20)
 * @param {string} params.search - Search query
 * @param {Array<number>} params.author - Filter by author IDs
 * @param {number} params.minPrice - Minimum price filter
 * @param {number} params.maxPrice - Maximum price filter
 * @param {number} params.categoryId - Filter by category tag ID
 * @param {number} params.mainDisplayId - Filter by main display tag ID
 * @param {Array<string>} params.language - Filter by languages
 * @param {string} params.sort - Sort parameter (e.g., 'title,asc' or 'price,desc')
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise} Response with packs data and pagination info
 */
export const getPacks = async (params = {}, signal = null) => {
  try {
    const queryParams = {
      page: params.page || 0,
      size: params.size || 20,
      ...(params.search && { search: params.search }),
      ...(params.author && { author: params.author }),
      ...(params.minPrice && { minPrice: params.minPrice }),
      ...(params.maxPrice && { maxPrice: params.maxPrice }),
      ...(params.categoryId && { categoryId: params.categoryId }),
      ...(params.mainDisplayId && { mainDisplayId: params.mainDisplayId }),
      ...(params.language && { language: params.language }),
      ...(params.sort && { sort: params.sort }),
    };

    const response = await api.get('/api/book-packs', {
      params: queryParams,
      signal,
    });

    // Process response data to normalize structure and image URLs
    const data = response.data;
    if (data.content) {
      // Paginated response
      return {
        ...data,
        content: processPackData(data.content)
      };
    }

    // Array response
    return processPackData(data);
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error('REQUEST_CANCELLED');
    }
    throw error;
  }
};

/**
 * Get pack by ID
 * @param {number} id - Pack ID
 * @returns {Promise} Pack data
 */
export const getPackById = async (id) => {
  const response = await api.get(`/api/book-packs/${id}`);
  return processPackData(response.data);
};

/**
 * Create a new book pack with cover image
 * @param {Object} packData - Pack data (name, description, price, books)
 * @param {File} coverImage - Cover image file
 * @returns {Promise} Created pack data
 */
export const createPack = async (packData, coverImage) => {
  const formData = new FormData();

  // Transform to backend format
  const backendData = transformToBackendFormat(packData);

  // Add pack data as JSON blob with proper content type
  const packBlob = new Blob([JSON.stringify(backendData)], {
    type: 'application/json'
  });
  formData.append('bookPack', packBlob);

  // Add cover image (required for creation)
  if (coverImage) {
    formData.append('coverImage', coverImage);
  }

  // Interceptor will auto-detect FormData and remove Content-Type header
  const response = await api.post('/api/book-packs', formData);

  return processPackData(response.data);
};

/**
 * Update an existing book pack
 * @param {number} id - Pack ID
 * @param {Object} packData - Updated pack data
 * @param {File} coverImage - New cover image file (optional)
 * @returns {Promise} Updated pack data
 */
export const updatePack = async (id, packData, coverImage = null) => {
  const formData = new FormData();

  // Transform to backend format and ensure ID is set
  const backendData = transformToBackendFormat({ ...packData, id });

  // Add pack data as JSON blob with proper content type
  const packBlob = new Blob([JSON.stringify(backendData)], {
    type: 'application/json'
  });
  formData.append('bookPack', packBlob);

  // Add cover image only if provided
  if (coverImage) {
    formData.append('coverImage', coverImage);
  }

  // Interceptor will auto-detect FormData and remove Content-Type header
  const response = await api.put(`/api/book-packs/${id}`, formData);

  return processPackData(response.data);
};

/**
 * Delete a book pack
 * @param {number} id - Pack ID
 * @returns {Promise} Success response
 */
export const deletePack = async (id) => {
  const response = await api.delete(`/api/book-packs/${id}`);
  return response.data;
};

/**
 * Get pack cover image URL
 * @param {number} id - The pack ID
 * @returns {string} Cover image URL
 */
export const getPackCoverUrl = (id) => {
  if (!id) return null;
  return `${API_BASE_URL}/api/book-packs/${id}/cover`;
};

export default {
  getPacks,
  getPackById,
  createPack,
  updatePack,
  deletePack,
  getPackCoverUrl,
};
