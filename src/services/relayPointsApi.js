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
 * Updated: December 2025 - 69 Wilayas (including 11 new wilayas added November 16, 2025)
 */
export const WILAYA_ID_MAP = {
  // Original 58 Wilayas (1-58)
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
  'Bordj Bou Arréridj': 34,
  'Boumerdès': 35,
  'El Tarf': 36,
  'Tindouf': 37,
  'Tissemsilt': 38,
  'El Oued': 39,
  'Khenchela': 40,
  'Souk Ahras': 41,
  'Tipaza': 42,
  'Mila': 43,
  'Ain Defla': 44,
  'Naâma': 45,
  'Ain Témouchent': 46,
  'Ghardaïa': 47,
  'Relizane': 48,
  'Timimoun': 49,
  'Bordj Badji Mokhtar': 50,
  'Ouled Djellal': 51,
  'Béni Abbès': 52,
  'In Salah': 53,
  'In Guezzam': 54,
  'Touggourt': 55,
  'Djanet': 56,
  "El M'Ghair": 57,
  'El Meniaa': 58,
  // New 11 Wilayas (59-69) - Added November 16, 2025
  'Aflou': 59,
  'Barika': 60,
  'Ksar Chellala': 61,
  'Messaad': 62,
  'Aïn Oussera': 63,
  'Bou Saâda': 64,
  'El Abiodh Sidi Cheikh': 65,
  'El Kantara': 66,
  'Bir El Ater': 67,
  'Ksar El Boukhari': 68,
  'El Aricha': 69,
};

/**
 * Get relay points (stopdesks/centers) for a specific provider and wilaya
 *
 * @param {string} provider - YALIDINE or ZR
 * @param {string} wilayaName - Name of the wilaya
 * @returns {Promise<Array>} Array of relay points
 */
export const getRelayPoints = async (provider, wilayaName) => {
  if (!wilayaName) {
    console.warn('Wilaya name is required');
    return [];
  }

  const wilayaId = WILAYA_ID_MAP[wilayaName];
  // Clean wilaya name by removing diacritics (é -> e, ï -> i, etc.)
  const cleanWilayaName = wilayaName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const response = await api.get('/api/relay-points', {
    params: {
      provider,
      wilayaName: cleanWilayaName,
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
 * Get a specific stop desk by ID
 * @param {string} stopDeskId - The stop desk ID
 * @returns {Promise<Object>} Stop desk data
 */
export const getStopDeskById = async (stopDeskId) => {
  const response = await api.get(`/api/relay-points/${stopDeskId}`);
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
  getStopDeskById,
  searchRelayPoints,
  WILAYA_ID_MAP,
};
