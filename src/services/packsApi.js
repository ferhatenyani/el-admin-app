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
      deliveryFee: pack.deliveryFee,
      automaticDeliveryFee: pack.automaticDeliveryFee,
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
    coverUrl: '', // Always send empty string
    price: parseFloat(packData.price),
    books: (packData.books || []).map(book => ({ id: book.id })), // Only send book IDs
    automaticDeliveryFee: packData.automaticDeliveryFee || false,
    deliveryFee: packData.deliveryFee || 0,
  };
};

/**
 * Get book packs with server-side filtering, sorting, and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size (default: 20)
 * @param {string} params.search - Search query
 * @param {number} params.minPrice - Minimum price filter
 * @param {number} params.maxPrice - Maximum price filter
 * @param {Array<number>|number} params.author - Author ID(s) filter
 * @param {Array<number>} params.categories - Array of category IDs
 * @param {number} params.categoryId - Single category ID filter
 * @param {Array<string>|string} params.language - Language filter(s)
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise} Response with packs data and pagination info
 */
export const getPacks = async (params = {}, signal = null) => {
  try {
    const queryParams = {
      page: params.page !== undefined ? params.page : 0,
      size: params.size !== undefined ? params.size : 20,
    };

    // Add search filter
    if (params.search) {
      queryParams.search = params.search;
    }

    // Add price filters
    if (params.minPrice !== undefined) {
      queryParams.minPrice = params.minPrice;
    }
    if (params.maxPrice !== undefined) {
      queryParams.maxPrice = params.maxPrice;
    }

    // Add category filters (for array of categories, axios will handle it)
    if (params.categories && Array.isArray(params.categories) && params.categories.length > 0) {
      queryParams.categoryId = params.categories.map(cat =>
        typeof cat === 'object' ? cat.id : cat
      );
    }

    // Add single categoryId filter if provided (for backward compatibility)
    if (params.categoryId !== undefined) {
      queryParams.categoryId = params.categoryId;
    }

    // Add author filter(s)
    if (params.author) {
      queryParams.author = params.author;
    }

    // Add language filter(s) with mapping
    if (params.language) {
      const languageMap = {
        'Français': 'FR',
        'English': 'EN',
        'العربية': 'AR'
      };

      if (Array.isArray(params.language)) {
        queryParams.language = params.language.map(lang =>
          languageMap[lang] || lang.toUpperCase()
        );
      } else {
        queryParams.language = languageMap[params.language] || params.language.toUpperCase();
      }
    }

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
 * Create a new book pack
 * @param {Object} packData - Pack data (name, description, price, books)
 * @returns {Promise} Created pack data
 */
export const createPack = async (packData) => {
  const formData = new FormData();

  // Transform to backend format
  const backendData = transformToBackendFormat(packData);

  // Add pack data as JSON blob with proper content type
  const packBlob = new Blob([JSON.stringify(backendData)], {
    type: 'application/json'
  });
  formData.append('bookPack', packBlob);

  // Add empty file as coverImage to satisfy backend requirement
  const emptyFile = new File([''], '', { type: 'application/octet-stream' });
  formData.append('coverImage', emptyFile);

  // Interceptor will auto-detect FormData and remove Content-Type header
  const response = await api.post('/api/book-packs', formData);

  return processPackData(response.data);
};

/**
 * Update an existing book pack
 * @param {number} id - Pack ID
 * @param {Object} packData - Updated pack data
 * @returns {Promise} Updated pack data
 */
export const updatePack = async (id, packData) => {
  const formData = new FormData();

  // Transform to backend format and ensure ID is set
  const backendData = transformToBackendFormat({ ...packData, id });

  // Add pack data as JSON blob with proper content type
  const packBlob = new Blob([JSON.stringify(backendData)], {
    type: 'application/json'
  });
  formData.append('bookPack', packBlob);

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
