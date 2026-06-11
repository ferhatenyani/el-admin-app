import { createApiClient } from './apiClient';

const api = createApiClient();

/**
 * Get aggregate search statistics
 * Backend endpoint: GET /api/admin/search-logs/stats?days={days}
 * @returns {Promise<Object>} { totalSearches, uniqueTerms, zeroResultSearches, zeroResultRate }
 */
export const getSearchStats = async (days = 30, signal) => {
  const response = await api.get('/api/admin/search-logs/stats', { params: { days }, signal });
  return response.data;
};

/**
 * Get most searched terms
 * Backend endpoint: GET /api/admin/search-logs/top-terms?days={days}&limit={limit}
 * @returns {Promise<Array>} [{ term, count, avgResults, lastSearchedAt }]
 */
export const getTopTerms = async (days = 30, limit = 10, signal) => {
  const response = await api.get('/api/admin/search-logs/top-terms', { params: { days, limit }, signal });
  return response.data;
};

/**
 * Get most searched terms that returned no results (stocking opportunities)
 * Backend endpoint: GET /api/admin/search-logs/zero-results?days={days}&limit={limit}
 * @returns {Promise<Array>} [{ term, count, avgResults, lastSearchedAt }]
 */
export const getZeroResultTerms = async (days = 30, limit = 10, signal) => {
  const response = await api.get('/api/admin/search-logs/zero-results', { params: { days, limit }, signal });
  return response.data;
};

/**
 * Get daily search counts for trend chart
 * Backend endpoint: GET /api/admin/search-logs/trend?days={days}
 * @returns {Promise<Array>} [{ date: 'YYYY-MM-DD', count }]
 */
export const getSearchTrend = async (days = 30, signal) => {
  const response = await api.get('/api/admin/search-logs/trend', { params: { days }, signal });
  return response.data;
};

/**
 * Get recent individual searches (paginated)
 * Backend endpoint: GET /api/admin/search-logs?page={page}&size={size}
 * @returns {Promise<Object>} Spring Page of { id, searchTerm, resultsCount, userLogin, visitorId, searchedAt }
 */
export const getRecentSearches = async (page = 0, size = 10, signal) => {
  const response = await api.get('/api/admin/search-logs', { params: { page, size }, signal });
  return response.data;
};
