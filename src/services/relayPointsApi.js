import axios from 'axios';
import { getCookie } from '../utils/cookies';

/**
 * Relay Points API Service
 *
 * This service provides access to relay point (Point de Relais / Stopdesk) data
 * from Yalidine and ZR Express delivery providers via the backend API.
 *
 * The backend should implement endpoints to fetch relay points from:
 * - Yalidine API: https://api.yalidine.app/v1/
 * - ZR Express / Procolis API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance for relay points API
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add Bearer token and CSRF token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';

  // Add CSRF token for mutating requests
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Wilaya mapping for API compatibility
 * Maps wilaya names to their IDs for API calls
 */
export const WILAYA_ID_MAP = {
  'Adrar': 1,
  'Chlef': 2,
  'Laghouat': 3,
  'Oum El Bouaghi': 4,
  'Batna': 5,
  'Béjaïa': 6,
  'Biskra': 7,
  'Béchar': 8,
  'Blida': 9,
  'Bouira': 10,
  'Tamanrasset': 11,
  'Tébessa': 12,
  'Tlemcen': 13,
  'Tiaret': 14,
  'Tizi Ouzou': 15,
  'Alger': 16,
  'Djelfa': 17,
  'Jijel': 18,
  'Sétif': 19,
  'Saïda': 20,
  'Skikda': 21,
  'Sidi Bel Abbès': 22,
  'Annaba': 23,
  'Guelma': 24,
  'Constantine': 25,
  'Médéa': 26,
  'Mostaganem': 27,
  "M'Sila": 28,
  'Mascara': 29,
  'Ouargla': 30,
  'Oran': 31,
  'El Bayadh': 32,
  'Illizi': 33,
  'Bordj Bou Arreridj': 34,
  'Boumerdès': 35,
  'El Tarf': 36,
  'Tindouf': 37,
  'Tissemsilt': 38,
  'El Oued': 39,
  'Khenchela': 40,
  'Souk Ahras': 41,
  'Tipaza': 42,
  'Mila': 43,
  'Aïn Defla': 44,
  'Naâma': 45,
  'Aïn Témouchent': 46,
  'Ghardaïa': 47,
  'Relizane': 48,
  "El M'Ghair": 49,
  'El Meniaa': 50,
  'Ouled Djellal': 51,
  'Bordj Baji Mokhtar': 52,
  'Béni Abbès': 53,
  'Timimoun': 54,
  'Touggourt': 55,
  'Djanet': 56,
  'In Salah': 57,
  'In Guezzam': 58,
};

/**
 * Get relay points (stopdesks/centers) for a specific provider and wilaya
 *
 * @param {string} provider - YALIDINE or ZR
 * @param {string} wilayaName - Name of the wilaya
 * @returns {Promise<Array>} Array of relay points
 */
export const getRelayPoints = async (provider, wilayaName) => {
  const wilayaId = WILAYA_ID_MAP[wilayaName];
  if (!wilayaId) {
    console.warn(`Unknown wilaya: ${wilayaName}`);
    return [];
  }

  const response = await api.get('/api/relay-points', {
    params: {
      provider,
      wilayaId,
    },
  });
  return response.data;
};

/**
 * Get all relay points for a provider
 * @param {string} provider - YALIDINE or ZR
 * @returns {Promise<Array>} Array of all relay points
 */
export const getAllRelayPoints = async (provider) => {
  const response = await api.get('/api/relay-points', {
    params: { provider },
  });
  return response.data;
};

/**
 * Get a specific relay point by ID
 * @param {string} relayPointId - The relay point ID
 * @returns {Promise<Object>} Relay point data
 */
export const getRelayPointById = async (relayPointId) => {
  const response = await api.get(`/api/relay-points/${relayPointId}`);
  return response.data;
};

/**
 * Search relay points by query
 * @param {string} provider - YALIDINE or ZR
 * @param {string} query - Search query
 * @param {string} wilayaName - Optional wilaya to filter by
 * @returns {Promise<Array>} Filtered relay points
 */
export const searchRelayPoints = async (provider, query = '', wilayaName = null) => {
  const params = { provider };

  if (query && query.trim()) {
    params.search = query.trim();
  }

  if (wilayaName) {
    const wilayaId = WILAYA_ID_MAP[wilayaName];
    if (wilayaId) {
      params.wilayaId = wilayaId;
    }
  }

  const response = await api.get('/api/relay-points/search', {
    params,
  });
  return response.data;
};

export default {
  getRelayPoints,
  getAllRelayPoints,
  getRelayPointById,
  searchRelayPoints,
  WILAYA_ID_MAP,
};
