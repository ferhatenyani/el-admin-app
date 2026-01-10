import * as tagsApi from './tagsApi';

// API base URL - should be configured in environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Categories API - Thin wrapper around tagsApi for CATEGORY type tags
 * Provides type-safe category management operations
 */

/**
 * Get all categories with optional pagination and search
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size
 * @param {string} params.search - Search term for category names (optional)
 * @returns {Promise} Response with categories data (array)
 */
export const getCategories = async (params = {}) => {
  return tagsApi.getTagsByType('CATEGORY', params);
};

/**
 * Get category by ID
 * @param {number} id - Category ID
 * @returns {Promise} Category data
 */
export const getCategoryById = async (id) => {
  return tagsApi.getTagById(id);
};

/**
 * Create a new category
 * @param {Object} categoryData - Category data (nameEn, nameFr)
 * @param {File} image - Category image file (optional)
 * @returns {Promise} Created category data
 */
export const createCategory = async (categoryData, image = null) => {
  const tagData = { ...categoryData, type: 'CATEGORY' };
  return tagsApi.createTag(tagData, image);
};

/**
 * Update an existing category
 * @param {number} id - Category ID
 * @param {Object} categoryData - Updated category data (nameEn, nameFr)
 * @param {File} image - New category image file (optional)
 * @returns {Promise} Updated category data
 */
export const updateCategory = async (id, categoryData, image = null) => {
  const tagData = { ...categoryData, type: 'CATEGORY' };
  return tagsApi.updateTag(id, tagData, image);
};

/**
 * Delete a category
 * @param {number} id - Category ID
 * @returns {Promise} Success response
 */
export const deleteCategory = async (id) => {
  return tagsApi.deleteTag(id);
};

/**
 * Get category image URL
 * @param {number} id - The category ID
 * @param {boolean} placeholder - Return placeholder if image not found (default: false)
 * @returns {string} Category image URL with cache-busting timestamp
 */
export const getCategoryImageUrl = (id, placeholder = false) => {
  const baseUrl = `${API_BASE_URL}/api/tags/${id}/image`;
  const separator = placeholder ? '&' : '?';
  const placeholderParam = placeholder ? '?placeholder=true' : '';
  return `${baseUrl}${placeholderParam}${separator}t=${Date.now()}`;
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryImageUrl,
};
