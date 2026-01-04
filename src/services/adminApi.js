import axios from 'axios';

// API base URL - should match backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance for admin API calls
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get current admin profile
 * @returns {Promise<Object>} Admin profile data
 */
export const getAdminProfile = async () => {
  try {
    const response = await adminApi.get('/api/admin/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

/**
 * Update current admin profile
 * Admin can update firstName, lastName, email, and profile picture
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.firstName - First name
 * @param {string} profileData.lastName - Last name
 * @param {string} profileData.email - Email address
 * @param {string} profileData.phone - Phone number
 * @param {File|null} profilePicture - Profile picture file (optional)
 * @returns {Promise<void>}
 */
export const updateAdminProfile = async (profileData, profilePicture = null) => {
  try {
    const formData = new FormData();

    // Create the admin DTO object
    const adminDTO = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone,
    };

    // Add admin data as JSON blob
    formData.append('admin', new Blob([JSON.stringify(adminDTO)], { type: 'application/json' }));

    // Add profile picture if provided
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    const response = await adminApi.put('/api/admin/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw error;
  }
};

/**
 * Get the current admin's profile picture URL
 * Returns the URL that can be used in img src to display the picture
 * The backend will return the actual image or a placeholder
 * Note: This URL requires authentication, so it must include the token
 * @returns {string} Image URL with auth token as query parameter
 */
export const getAdminPictureUrl = () => {
  const token = localStorage.getItem('access_token');
  // Add timestamp to prevent caching issues
  // Token is passed as query param since <img> tags can't send custom headers
  return `${API_BASE_URL}/api/admin/picture?t=${Date.now()}&token=${token}`;
};

/**
 * Fetch the admin profile picture as a blob URL
 * This creates a blob URL that can be used in <img> tags
 * @returns {Promise<string>} Blob URL of the image
 */
export const fetchAdminPictureBlob = async () => {
  try {
    const response = await adminApi.get('/api/admin/picture', {
      responseType: 'blob',
    });

    // Create a blob URL from the response
    const blob = response.data;
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching admin picture:', error);
    return ''; // Return empty string if fetch fails
  }
};

/**
 * Change admin password
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<void>}
 */
export const changeAdminPassword = async (passwordData) => {
  try {
    const payload = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    };

    await adminApi.post('/api/admin/password', payload);
  } catch (error) {
    console.error('Error changing admin password:', error);
    throw error;
  }
};

export default {
  getAdminProfile,
  updateAdminProfile,
  getAdminPictureUrl,
  fetchAdminPictureBlob,
  changeAdminPassword,
};
