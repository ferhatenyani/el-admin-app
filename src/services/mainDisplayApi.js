import axios from 'axios';
import { getCookie } from '../utils/cookies';
import { getBookCoverUrl } from './booksApi';

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
 * Process main display data to normalize image URLs and transform data structure
 * Backend returns: { id, nameEn, nameFr, type, active, imageUrl, books }
 * Frontend expects: { id, name, books }
 * @param {Object|Array} data - Single main display or array of main displays
 * @returns {Object|Array} Processed data with normalized structure
 */
const processMainDisplayData = (data) => {
  const transformMainDisplay = (display) => {
    if (!display) return null;

    return {
      id: display.id,
      name: display.nameEn || display.nameFr, // Use English name, fallback to French
      nameEn: display.nameEn,
      nameFr: display.nameFr,
      type: display.type,
      active: display.active,
      image: display.id ? `${API_BASE_URL}/api/tags/${display.id}/image` : null,
      imageUrl: display.imageUrl,
      books: display.books || [],
      deletedAt: display.deletedAt,
      deletedBy: display.deletedBy,
    };
  };

  if (Array.isArray(data)) {
    return data.map(transformMainDisplay);
  }

  if (data && typeof data === 'object') {
    // Handle paginated response
    if (data.content && Array.isArray(data.content)) {
      return {
        ...data,
        content: data.content.map(transformMainDisplay)
      };
    }
    return transformMainDisplay(data);
  }

  return data;
};

/**
 * Transform frontend main display data to backend format
 * @param {Object} displayData - Main display data from frontend
 * @returns {Object} Main display data in backend format
 */
const transformToBackendFormat = (displayData) => {
  return {
    id: displayData.id,
    nameEn: displayData.nameEn,
    nameFr: displayData.nameFr,
    type: 'MAIN_DISPLAY',
    active: displayData.active !== false,
    imageUrl: displayData.imageUrl || '',
  };
};

/**
 * Get main displays with server-side filtering, sorting, and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size (default: 20)
 * @param {string} params.search - Search query
 * @param {string} params.sort - Sort parameter (e.g., 'nameEn,asc')
 * @param {boolean} params.includeBooks - Whether to fetch books for each main display (default: true)
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise} Response with main displays data and pagination info
 */
export const getMainDisplays = async (params = {}, signal = null) => {
  try {
    const queryParams = {
      type: 'MAIN_DISPLAY', // Filter to only get MAIN_DISPLAY tags
      page: params.page || 0,
      size: params.size || 20,
      ...(params.search && { search: params.search }),
      ...(params.sort && { sort: params.sort }),
    };

    const response = await api.get('/api/tags', {
      params: queryParams,
      signal,
    });

    // Process response data
    const processedData = processMainDisplayData(response.data);

    // Fetch books for each main display if requested (default: true)
    if (params.includeBooks !== false) {
      const displays = processedData.content || processedData;

      if (Array.isArray(displays)) {
        // Fetch books for each display in parallel
        const displaysWithBooks = await Promise.all(
          displays.map(async (display) => {
            try {
              const booksResponse = await api.get('/api/books', {
                params: {
                  mainDisplayId: display.id,
                  page: 0,
                  size: 1000, // Get all books for this display
                },
                signal,
              });
              const books = booksResponse.data.content || booksResponse.data;
              // Transform books to match expected format
              const transformedBooks = Array.isArray(books)
                ? books.map(book => ({
                    ...book,
                    image: getBookCoverUrl(book.id), // Use the same pattern as BooksTable
                    coverImageUrl: getBookCoverUrl(book.id),
                    author: typeof book.author === 'object' && book.author !== null
                      ? `${book.author.firstName || ''} ${book.author.lastName || ''}`.trim()
                      : book.author || 'Unknown Author',
                  }))
                : [];
              return {
                ...display,
                books: transformedBooks,
              };
            } catch (error) {
              console.error(`Error fetching books for main display ${display.id}:`, error);
              return {
                ...display,
                books: [],
              };
            }
          })
        );

        // Return with same structure
        if (processedData.content) {
          return {
            ...processedData,
            content: displaysWithBooks,
          };
        }
        return displaysWithBooks;
      }
    }

    return processedData;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error('REQUEST_CANCELLED');
    }
    throw error;
  }
};

/**
 * Get main display by ID
 * @param {number} id - Main display ID
 * @returns {Promise} Main display data
 */
export const getMainDisplayById = async (id) => {
  const response = await api.get(`/api/tags/${id}`);
  return processMainDisplayData(response.data);
};

/**
 * Create a new main display section
 * @param {Object} displayData - Main display data
 * @param {string} displayData.nameEn - English name (required)
 * @param {string} displayData.nameFr - French name (required)
 * @param {Array} displayData.books - Array of selected books
 * @param {File} imageFile - Image file (optional)
 * @returns {Promise} Created main display data
 */
export const createMainDisplay = async (displayData, imageFile = null) => {
  const formData = new FormData();

  // Transform to backend format
  const backendData = transformToBackendFormat(displayData);

  // Add tag data as JSON blob with proper content type
  const tagBlob = new Blob([JSON.stringify(backendData)], {
    type: 'application/json'
  });
  formData.append('tag', tagBlob);

  // Add image file (optional)
  if (imageFile) {
    formData.append('image', imageFile);
  }

  // Interceptor will auto-detect FormData and remove Content-Type header
  const response = await api.post('/api/tags', formData);

  return processMainDisplayData(response.data);
};

/**
 * Update an existing main display section
 * @param {number} id - Main display ID
 * @param {Object} displayData - Updated main display data
 * @param {string} displayData.nameEn - English name (required)
 * @param {string} displayData.nameFr - French name (required)
 * @param {Array} displayData.books - Array of selected books
 * @param {File} imageFile - New image file (optional)
 * @returns {Promise} Updated main display data
 */
export const updateMainDisplay = async (id, displayData, imageFile = null) => {
  const formData = new FormData();

  // Transform to backend format and ensure ID is set
  const backendData = transformToBackendFormat({ ...displayData, id });

  // Add tag data as JSON blob with proper content type
  const tagBlob = new Blob([JSON.stringify(backendData)], {
    type: 'application/json'
  });
  formData.append('tag', tagBlob);

  // Add image file only if provided
  if (imageFile) {
    formData.append('image', imageFile);
  }

  // Interceptor will auto-detect FormData and remove Content-Type header
  const response = await api.put(`/api/tags/${id}`, formData);

  return processMainDisplayData(response.data);
};

/**
 * Delete a main display section (soft delete)
 * @param {number} id - Main display ID
 * @returns {Promise} Success response
 */
export const deleteMainDisplay = async (id) => {
  const response = await api.delete(`/api/tags/${id}`);
  return response.data;
};

/**
 * Add books to a main display section
 * @param {number} id - Main display ID
 * @param {Array<number>} bookIds - Array of book IDs to add
 * @returns {Promise} Updated main display data
 */
export const addBooksToMainDisplay = async (id, bookIds) => {
  const response = await api.post(`/api/tags/${id}/books/add`, bookIds);
  return processMainDisplayData(response.data);
};

/**
 * Remove books from a main display section
 * @param {number} id - Main display ID
 * @param {Array<number>} bookIds - Array of book IDs to remove
 * @returns {Promise} Updated main display data
 */
export const removeBooksFromMainDisplay = async (id, bookIds) => {
  const response = await api.post(`/api/tags/${id}/books/remove`, bookIds);
  return processMainDisplayData(response.data);
};

/**
 * Get main display image URL
 * @param {number} id - The main display ID
 * @returns {string} Image URL
 */
export const getMainDisplayImageUrl = (id) => {
  if (!id) return null;
  return `${API_BASE_URL}/api/tags/${id}/image`;
};

export default {
  getMainDisplays,
  getMainDisplayById,
  createMainDisplay,
  updateMainDisplay,
  deleteMainDisplay,
  addBooksToMainDisplay,
  removeBooksFromMainDisplay,
  getMainDisplayImageUrl,
};
