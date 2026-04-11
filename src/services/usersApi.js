import axios from 'axios';
import { createApiClient } from './apiClient';

const api = createApiClient();

/**
 * Get all app users with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size (default: 20)
 * @param {boolean} params.active - Filter by activation status (optional)
 * @param {string} params.search - Search query (searches name, email) - for future backend implementation
 * @param {string} params.sort - Sort parameter in format "field,direction" (e.g., "createdDate,desc", "lastName,asc")
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise} Response with users data
 */
export const getUsers = async (params = {}, signal = null) => {
  try {
    const queryParams = {
      page: params.page || 0,
      size: params.size || 20,
    };

    // Add active filter if provided
    if (params.active !== undefined && params.active !== null) {
      queryParams.active = params.active;
    }

    // Add search parameter if provided (for future backend implementation)
    if (params.search) {
      queryParams.search = params.search;
    }

    // Add sort parameter if provided (format: "field,direction")
    if (params.sort) {
      queryParams.sort = params.sort;
    }

    const response = await api.get('/api/admin/users', {
      params: queryParams,
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
 * Toggle user activation status (admin only)
 * @param {string} userId - The ID of the user to toggle
 * @returns {Promise} Response with status 204
 */
export const toggleUserActivation = async (userId) => {
  const response = await api.patch(`/api/admin/users/${userId}/toggle`);
  return response.data;
};

/**
 * Export all non-admin users to Excel (admin only)
 * @returns {Promise} Blob response containing the Excel file
 */
export const exportUsers = async () => {
  const response = await api.get('/api/admin/users/export', {
    responseType: 'blob',
  });
  return response;
};

export default {
  getUsers,
  toggleUserActivation,
  exportUsers,
};
