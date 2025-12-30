import * as tagsApi from './tagsApi';

/**
 * Categories API - Thin wrapper around tagsApi for CATEGORY type tags
 * Provides type-safe category management operations
 */

/**
 * Get all categories with optional pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size
 * @returns {Promise} Response with categories data
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

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
