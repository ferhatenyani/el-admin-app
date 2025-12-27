import axios from 'axios';

// API base URL - should be configured in environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
 * Process book data to normalize image URLs
 * @param {Object|Array} data - Single book or array of books
 * @returns {Object|Array} Processed data with normalized image URLs
 */
const processBookData = (data) => {
  if (Array.isArray(data)) {
    return data.map(book => ({
      ...book,
      coverImageUrl: normalizeImageUrl(book.coverImageUrl)
    }));
  }

  if (data && typeof data === 'object') {
    return {
      ...data,
      coverImageUrl: normalizeImageUrl(data.coverImageUrl)
    };
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

  // Add book data as JSON
  formData.append('book', JSON.stringify(bookData));

  // Add cover image if provided
  if (coverImage) {
    formData.append('coverImage', coverImage);
  }

  const response = await api.post('/api/books', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

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

  // Add book data as JSON
  formData.append('book', JSON.stringify({ ...bookData, id }));

  // Add cover image if provided
  if (coverImage) {
    formData.append('coverImage', coverImage);
  }

  const response = await api.put(`/api/books/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

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
};
