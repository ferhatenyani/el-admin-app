import { useState, useEffect, useRef, useCallback } from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import UsersTable from '../components/users/UsersTable';
import UserDetailsModal from '../components/users/UserDetailsModal';
import { getUsers, toggleUserActivation, exportUsers } from '../services/usersApi';
import { useDebounce } from '../hooks/useDebounce';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('createdDate,desc'); // Format: "field,direction"
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  // Ref for request cancellation
  const abortControllerRef = useRef(null);

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Reset to page 0 when search query changes
  useEffect(() => {
    if (pagination.page !== 0) {
      setPagination(prev => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchQuery]);

  /**
   * Fetch users with current filters and pagination
   * Uses AbortController to cancel in-flight requests
   */
  const fetchUsers = useCallback(async () => {
    try {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {
        page: pagination.page,
        size: pagination.size,
      };

      // Add search query if present
      if (debouncedSearchQuery) {
        params.search = debouncedSearchQuery;
      }

      // Apply server-side active filter if not 'all'
      if (statusFilter === 'active') {
        params.active = true;
      } else if (statusFilter === 'inactive') {
        params.active = false;
      }

      // Add sort parameter (format: "field,direction")
      if (sortBy) {
        params.sort = sortBy;
      }

      const response = await getUsers(params, abortControllerRef.current.signal);

      // Handle Spring Data Page response
      const usersData = response.content || [];
      setUsers(usersData);
      setPagination({
        page: response.number || response.page || 0,
        size: response.size || 20,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
      });
    } catch (err) {
      // Ignore cancelled requests
      if (err.message === 'REQUEST_CANCELLED') {
        return;
      }

      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [pagination.page, pagination.size, debouncedSearchQuery, statusFilter, sortBy]);

  /**
   * Initial load and refetch when dependencies change
   */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Clean up abort controller on unmount
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Handle search query changes
   */
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  /**
   * Handle sort changes
   * Reset to page 0 when sort changes
   */
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    if (pagination.page !== 0) {
      setPagination(prev => ({ ...prev, page: 0 }));
    }
  };

  /**
   * Handle status filter changes
   */
  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    if (pagination.page !== 0) {
      setPagination(prev => ({ ...prev, page: 0 }));
    }
  };

  /**
   * Handle page changes
   */
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  /**
   * Handle page size changes
   */
  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, size: newSize, page: 0 }));
  };

  /**
   * Handle view user - Transform user data to match modal expected structure
   */
  const handleViewUser = (user) => {
    // Transform user data to match UserDetailsModal expected structure
    const transformedUser = {
      ...user,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.login || user.email,
      joinedDate: user.createdDate,
      active: user.activated !== false,
      totalOrders: 0, // Default values as backend doesn't provide these yet
      totalSpent: 0,
    };

    setSelectedUser(transformedUser);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (userId) => {
    try {
      await toggleUserActivation(userId);
      // Refresh users list after toggle
      await fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Erreur lors de la modification du statut de l\'utilisateur');
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportUsers();

      // Create a download link for the blob
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'users_export.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting users:', error);
      alert('Erreur lors de l\'export des utilisateurs');
    }
  };

  // No client-side sorting needed - all sorting is done server-side

  // Error state with retry
  if (error && users.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-600 text-center">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold">Error Loading Users</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
        <button
          onClick={() => fetchUsers()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (initialLoad && loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-600 mt-1">Gérez les comptes utilisateurs et les permissions</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm"
        >
          <Download className="w-5 h-5" />
          Exporter
        </motion.button>
      </div>

      {/* Error banner (non-blocking) */}
      {error && users.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      <UsersTable
        users={users}
        onViewUser={handleViewUser}
        onToggleActive={handleToggleActive}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;
