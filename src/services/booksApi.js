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
    // Check if endpoint is exempt from CSRF protection
    const isExempt = config.url === '/api/orders' || config.url === '/api/contact';

    if (!isExempt) {
      const csrfToken = getCookie('XSRF-TOKEN');
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
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
 * Process book data to add cover image URL with cache-busting timestamp
 * @param {Object|Array} data - Single book or array of books
 * @returns {Object|Array} Processed data with image URLs
 */
const processBookData = (data) => {
  const transformBook = (book) => {
    const coverImageUrl = book.id ? `${API_BASE_URL}/api/books/${book.id}/cover?t=${Date.now()}` : null;
    return {
      ...book,
      coverImageUrl, // Add coverImageUrl with cache-busting timestamp
      imageUrl: coverImageUrl, // Add imageUrl alias for UploadImageInput compatibility
      // Author already has 'name' property from backend, keep as-is
      author: book.author || null,
    };
  };

  if (Array.isArray(data)) {
    return data.map(transformBook);
  }

  if (data && typeof data === 'object') {
    return transformBook(data);
  }

  return data;
};

/**
 * Get books with server-side filtering, sorting, and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size (default: 20)
 * @param {string} params.search - Search query (searches title, author, tags)
 * @param {string} params.author - Filter by author name
 * @param {number} params.categoryId - Filter by category tag ID
 * @param {number} params.minPrice - Minimum price filter
 * @param {number} params.maxPrice - Maximum price filter
 * @param {string} params.sort - Sort parameter (e.g., 'title,asc' or 'price,desc')
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise} Response with books data and pagination info
 */
export const getBooks = async (params = {}, signal = null) => {
  try {
    const queryParams = {
      page: params.page || 0,
      size: params.size || 20,
      ...(params.search && { search: params.search }),
      ...(params.author && { author: params.author }),
      ...(params.categoryId && { categoryId: params.categoryId }),
      ...(params.minPrice && { minPrice: params.minPrice }),
      ...(params.maxPrice && { maxPrice: params.maxPrice }),
      ...(params.sort && { sort: params.sort }),
    };

    const response = await api.get('/api/books', {
      params: queryParams,
      signal,
    });

    // Process response data to normalize image URLs
    const data = response.data;
    if (data.content) {
      // Paginated response
      return {
        ...data,
        content: processBookData(data.content)
      };
    }

    // Array response
    return processBookData(data);
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error('REQUEST_CANCELLED');
    }
    throw error;
  }
};

/**
 * Get book suggestions for autocomplete/search
 * @param {string} query - Search term
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise} Array of book suggestions
 */
export const getBookSuggestions = async (query, signal = null) => {
  try {
    const response = await api.get('/api/books/suggestions', {
      params: { q: query },
      signal,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error('REQUEST_CANCELLED');
    }
    throw error;
  }
};

/**
 * Get book by ID
 * @param {number} id - Book ID
 * @returns {Promise} Book data
 */
export const getBookById = async (id) => {
  const response = await api.get(`/api/books/${id}`);
  return processBookData(response.data);
};

/**
 * Create a new book with cover image
 * @param {Object} bookData - Book data
 * @param {File} coverImage - Cover image file
 * @returns {Promise} Created book data
 */
export const createBook = async (bookData, coverImage) => {
  const formData = new FormData();

  // Add book data as JSON blob with proper content type
  const bookBlob = new Blob([JSON.stringify(bookData)], {
    type: 'application/json'
  });
  formData.append('book', bookBlob);

  // Add cover image if provided
  if (coverImage) {
    formData.append('coverImage', coverImage);
  }

  // Interceptor will auto-detect FormData and remove Content-Type header
  const response = await api.post('/api/books', formData);

  return processBookData(response.data);
};

/**
 * Update an existing book
 * @param {number} id - Book ID
 * @param {Object} bookData - Updated book data
 * @param {File} coverImage - New cover image file (optional)
 * @returns {Promise} Updated book data
 */
export const updateBook = async (id, bookData, coverImage = null) => {
  const formData = new FormData();

  // Add book data as JSON blob with proper content type
  const bookBlob = new Blob([JSON.stringify({ ...bookData, id })], {
    type: 'application/json'
  });
  formData.append('book', bookBlob);

  // Add cover image only if provided
  if (coverImage) {
    formData.append('coverImage', coverImage);
  }

  // Interceptor will auto-detect FormData and remove Content-Type header
  const response = await api.put(`/api/books/${id}`, formData);

  return processBookData(response.data);
};

/**
 * Soft delete a book (sets active=false)
 * @param {number} id - Book ID
 * @returns {Promise} Success response
 */
export const deleteBook = async (id) => {
  const response = await api.delete(`/api/books/${id}`);
  return response.data;
};

/**
 * Permanently delete a book (hard delete)
 * @param {number} id - Book ID
 * @returns {Promise} Success response
 */
export const deleteBookPermanently = async (id) => {
  const response = await api.delete(`/api/books/${id}/forever`);
  return response.data;
};

/**
 * Add tags to a book
 * @param {number} bookId - Book ID
 * @param {number[]} tagIds - Array of tag IDs to add
 * @returns {Promise} Updated book data
 */
export const addTagsToBook = async (bookId, tagIds) => {
  const response = await api.post(`/api/books/${bookId}/tags/add`, tagIds);
  return response.data;
};

/**
 * Remove tags from a book
 * @param {number} bookId - Book ID
 * @param {number[]} tagIds - Array of tag IDs to remove
 * @returns {Promise} Updated book data
 */
export const removeTagsFromBook = async (bookId, tagIds) => {
  const response = await api.post(`/api/books/${bookId}/tags/remove`, tagIds);
  return response.data;
};

/**
 * Get book cover image URL
 * @param {number} id - The book ID
 * @param {boolean} placeholder - Return placeholder if cover not found (default: false)
 * @returns {string} Cover image URL with cache-busting timestamp
 */
export const getBookCoverUrl = (id, placeholder = false) => {
  const baseUrl = `${API_BASE_URL}/api/books/${id}/cover`;
  const separator = placeholder ? '&' : '?';
  const placeholderParam = placeholder ? '?placeholder=true' : '';
  return `${baseUrl}${placeholderParam}${separator}t=${Date.now()}`;
};

export default {
  getBooks,
  getBookSuggestions,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  deleteBookPermanently,
  addTagsToBook,
  removeTagsFromBook,
  getBookCoverUrl,
};
