import { createApiClient, API_BASE_URL } from './apiClient';

const api = createApiClient();

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
