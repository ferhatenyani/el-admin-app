import * as tagsApi from './tagsApi';

/**
 * Etiquettes API - Thin wrapper around tagsApi for ETIQUETTE type tags
 * Provides type-safe etiquette management operations
 */

/**
 * Get all etiquettes with optional pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size
 * @returns {Promise} Response with etiquettes data
 */
export const getEtiquettes = async (params = {}) => {
  return tagsApi.getTagsByType('ETIQUETTE', params);
};

/**
 * Get etiquette by ID
 * @param {number} id - Etiquette ID
 * @returns {Promise} Etiquette data
 */
export const getEtiquetteById = async (id) => {
  return tagsApi.getTagById(id);
};

/**
 * Create a new etiquette
 * @param {Object} etiquetteData - Etiquette data (nameEn, nameFr, color)
 * @param {File} image - Etiquette image file (optional)
 * @returns {Promise} Created etiquette data
 */
export const createEtiquette = async (etiquetteData, image = null) => {
  const tagData = { ...etiquetteData, type: 'ETIQUETTE' };
  return tagsApi.createTag(tagData, image);
};

/**
 * Update an existing etiquette
 * @param {number} id - Etiquette ID
 * @param {Object} etiquetteData - Updated etiquette data (nameEn, nameFr, color)
 * @param {File} image - New etiquette image file (optional)
 * @returns {Promise} Updated etiquette data
 */
export const updateEtiquette = async (id, etiquetteData, image = null) => {
  const tagData = { ...etiquetteData, type: 'ETIQUETTE' };
  return tagsApi.updateTag(id, tagData, image);
};

/**
 * Delete an etiquette
 * @param {number} id - Etiquette ID
 * @returns {Promise} Success response
 */
export const deleteEtiquette = async (id) => {
  return tagsApi.deleteTag(id);
};

/**
 * Change etiquette color
 * @param {number} id - Etiquette ID
 * @param {string} color - New color (hex format)
 * @returns {Promise} Updated etiquette data
 */
export const changeEtiquetteColor = async (id, color) => {
  return tagsApi.changeTagColor(id, color);
};

export default {
  getEtiquettes,
  getEtiquetteById,
  createEtiquette,
  updateEtiquette,
  deleteEtiquette,
  changeEtiquetteColor,
};
