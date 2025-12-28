import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, checkAuth, getCurrentUser, logout as apiLogout } from '../services/authApi';

const AuthContext = createContext(null);

/**
 * AuthProvider component
 * Manages authentication state for the entire application
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check authentication status and fetch user profile
   */
  const checkAuthStatus = async () => {
    try {
      const authenticated = await checkAuth();

      if (authenticated) {
        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with username and password
   * @param {string} username - Username
   * @param {string} password - Password
   */
  const login = async (username, password) => {
    try {
      // Call Keycloak token endpoint
      await apiLogin(username, password);

      // Fetch user profile after successful login
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  /**
   * Logout user and redirect to Keycloak logout
   */
  const logout = async () => {
    try {
      await apiLogout();
      // apiLogout handles the redirect to Keycloak logout URL
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Clear authentication state (used by interceptors)
   */
  const clearAuth = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use authentication context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
