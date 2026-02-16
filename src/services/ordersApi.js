import axios from 'axios';
import { getCookie } from '../utils/cookies';

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

  // Set Content-Type for JSON requests
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  // Add CSRF token for POST, PUT, DELETE, PATCH requests
  if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
    // Orders endpoint is exempt from CSRF for guest checkout
    const isExempt = config.url === '/api/orders';

    if (!isExempt) {
      const csrfToken = getCookie('XSRF-TOKEN');
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
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
 * Get orders with server-side filtering, sorting, and pagination
 * Admins can see all orders, regular users see only their own orders
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size (default: 20)
 * @param {string} params.status - Filter by order status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
 * @param {string} params.search - Search query for order number, customer name, email, or phone
 * @param {string} params.dateFrom - Filter by creation date from (ISO 8601 format)
 * @param {string} params.dateTo - Filter by creation date to (ISO 8601 format)
 * @param {number} params.minAmount - Minimum total amount filter
 * @param {number} params.maxAmount - Maximum total amount filter
 * @param {string} params.sort - Sort parameter (e.g., 'createdAt,desc' or 'totalAmount,asc')
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise} Response with page data, pagination info, and optional statusRefreshInfo
 */
export const getOrders = async (params = {}, signal = null) => {
  try {
    const queryParams = {
      page: params.page || 0,
      size: params.size || 20,
      ...(params.status && { status: params.status }),
      ...(params.search && { search: params.search }),
      ...(params.dateFrom && { dateFrom: params.dateFrom }),
      ...(params.dateTo && { dateTo: params.dateTo }),
      ...(params.minAmount && { minAmount: params.minAmount }),
      ...(params.maxAmount && { maxAmount: params.maxAmount }),
      ...(params.sort && { sort: params.sort }),
    };

    const response = await api.get('/api/orders', {
      params: queryParams,
      signal,
    });

    const data = response.data;

    // Handle new response structure: { page: {...}, statusRefreshInfo: {...} }
    // Also maintain backwards compatibility with old structure
    if (data.page) {
      return {
        ...data.page,
        statusRefreshInfo: data.statusRefreshInfo || null,
      };
    }

    // Fallback for old response structure
    return data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error('REQUEST_CANCELLED');
    }
    throw error;
  }
};

/**
 * Get order by ID
 * Users can only access their own orders, admins can access all orders
 * @param {number} id - Order ID
 * @returns {Promise} Order data with order items
 */
export const getOrderById = async (id) => {
  const response = await api.get(`/api/orders/${id}`);
  return response.data;
};

/**
 * Create a new order
 * Can be created by authenticated users or as guest order
 * @param {Object} orderData - Order data
 * @param {string} orderData.fullName - Customer full name
 * @param {string} orderData.phone - Customer phone number (required, will be normalized to +213 format)
 * @param {string} orderData.email - Customer email
 * @param {string} orderData.streetAddress - Street address
 * @param {string} orderData.wilaya - Wilaya (required)
 * @param {string} orderData.city - City (required for home delivery)
 * @param {string} orderData.shippingProvider - Shipping provider (YALIDINE, ZR)
 * @param {string} orderData.shippingMethod - Shipping method (HOME_DELIVERY, SHIPPING_PROVIDER)
 * @param {number} orderData.shippingCost - Shipping cost
 * @param {Array} orderData.orderItems - Array of order items
 * @param {number} orderData.orderItems[].bookId - Book ID (for BOOK items)
 * @param {number} orderData.orderItems[].bookPackId - Book pack ID (for PACK items)
 * @param {number} orderData.orderItems[].quantity - Quantity (min: 1)
 * @param {number} orderData.orderItems[].unitPrice - Unit price
 * @param {string} orderData.orderItems[].itemType - Item type (BOOK or PACK)
 * @returns {Promise} Created order data
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/api/orders', orderData);
  return response.data;
};

/**
 * Update an existing order
 * Only admins can update orders
 * @param {number} id - Order ID
 * @param {Object} orderData - Updated order data
 * @param {string} orderData.status - Order status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
 * @param {string} orderData.fullName - Customer full name
 * @param {string} orderData.phone - Customer phone number
 * @param {string} orderData.email - Customer email
 * @param {string} orderData.streetAddress - Street address
 * @param {string} orderData.wilaya - Wilaya
 * @param {string} orderData.city - City
 * @param {string} orderData.shippingProvider - Shipping provider
 * @param {string} orderData.shippingMethod - Shipping method
 * @param {number} orderData.shippingCost - Shipping cost
 * @returns {Promise} Updated order data
 */
export const updateOrder = async (id, orderData) => {
  const response = await api.put(`/api/orders/${id}`, { ...orderData, id });
  return response.data;
};

/**
 * Get current user's orders
 * Returns only orders belonging to the authenticated user
 * @returns {Promise} Array of user's orders
 */
export const getCurrentUserOrders = async () => {
  const response = await api.get('/api/orders/user');
  return response.data;
};

/**
 * Update order status
 * Convenience method for updating only the order status
 * Only admins can update order status
 * @param {number} id - Order ID
 * @param {string} status - New status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
 * @returns {Promise} Updated order data
 */
export const updateOrderStatus = async (id, status) => {
  return updateOrder(id, { status });
};

/**
 * Soft delete an order (sets active=false or similar)
 * Only admins can delete orders
 * @param {number} id - Order ID
 * @returns {Promise} Success response
 */
export const deleteOrder = async (id) => {
  const response = await api.delete(`/api/orders/${id}`);
  return response.data;
};

/**
 * Export all orders to Excel (admin only)
 * @returns {Promise} Blob response containing the Excel file
 */
export const exportOrders = async () => {
  const response = await api.get('/api/orders/export', {
    responseType: 'blob',
  });
  return response;
};

/**
 * Calculate delivery fee based on cart items and destination
 * Calls the public endpoint POST /api/delivery-fee/calculate
 * @param {Object} request - Calculation request
 * @param {string} request.shippingProvider - YALIDINE or ZR
 * @param {string} request.wilaya - Destination wilaya name
 * @param {string} request.city - Destination city (optional)
 * @param {boolean} request.isStopDesk - Whether delivery is to a relay point
 * @param {Array} request.items - Cart items [{bookId, bookPackId, quantity}]
 * @returns {Promise} { success, fee, method, provider, errorMessage }
 */
export const calculateDeliveryFee = async (request) => {
  const response = await api.post('/api/delivery-fee/calculate', request);
  return response.data;
};

/**
 * Order status enum values
 */
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

/**
 * Shipping provider enum values
 */
export const SHIPPING_PROVIDER = {
  YALIDINE: 'YALIDINE',
  ZR: 'ZR',
};

/**
 * Shipping method enum values
 */
export const SHIPPING_METHOD = {
  HOME_DELIVERY: 'HOME_DELIVERY',
  SHIPPING_PROVIDER: 'SHIPPING_PROVIDER',
};

/**
 * Order item type enum values
 */
export const ORDER_ITEM_TYPE = {
  BOOK: 'BOOK',
  PACK: 'PACK',
};

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getCurrentUserOrders,
  updateOrderStatus,
  exportOrders,
  calculateDeliveryFee,
  ORDER_STATUS,
  SHIPPING_PROVIDER,
  SHIPPING_METHOD,
  ORDER_ITEM_TYPE,
};
