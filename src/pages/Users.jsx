import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import UsersTable from '../components/users/UsersTable';
import UserDetailsModal from '../components/users/UserDetailsModal';
import ToastContainer from '../components/common/Toast';
import { getUsers, toggleUserActivation, exportUsers } from '../services/usersApi';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import { getApiErrorMessage } from '../utils/apiErrors';

const Users = () => {
  // Deep link from other pages (e.g. /admin/users?login=xyz from Recherches):
  // pre-filter the table on the login and auto-open the matching user's modal.
  const [searchParams, setSearchParams] = useSearchParams();
  const pendingLoginRef = useRef(searchParams.get('login'));

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('login') || '');
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('createdDate,desc'); // Format: "field,direction"
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Ref for request cancellation
  const abortControllerRef = useRef(null);

  const { toasts, removeToast, error: showError } = useToast();

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
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    const params = {
      page: pagination.page,
      size: pagination.size,
    };

    if (debouncedSearchQuery) {
      params.search = debouncedSearchQuery;
    }
    if (statusFilter === 'active') {
      params.active = true;
    } else if (statusFilter === 'inactive') {
      params.active = false;
    }
    if (sortBy) {
      params.sort = sortBy;
    }

    try {
      const response = await getUsers(params, abortControllerRef.current.signal);
      const usersData = response.content || [];
      setUsers(usersData);
      const pageData = response.page ?? {};
      setPagination({
        page: pageData.number ?? response.number ?? 0,
        size: pageData.size ?? response.size ?? 20,
        totalElements: pageData.totalElements ?? response.totalElements ?? 0,
        totalPages: pageData.totalPages ?? response.totalPages ?? 0,
      });
      setLoading(false);
      setInitialLoad(false);
    } catch (err) {
      if (err.message === 'REQUEST_CANCELLED') {
        // Another request is already in flight — leave loading state alone
        return;
      }
      console.error('Error fetching users:', err);
      setError(getApiErrorMessage(err, 'Failed to load users. Please try again.'));
      setUsers([]);
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
   * Auto-open the user modal when arriving via ?login= deep link,
   * once the (login-filtered) results are in. One-shot: the param is
   * cleared so closing the modal doesn't reopen it.
   */
  useEffect(() => {
    if (!pendingLoginRef.current || loading) return;
    const match = users.find((u) => u.login === pendingLoginRef.current) || (users.length === 1 ? users[0] : null);
    pendingLoginRef.current = null;
    setSearchParams({}, { replace: true });
    if (match) {
      handleViewUser(match);
    }
  }, [users, loading]); // eslint-disable-line react-hooks/exhaustive-deps

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
      // Order stats come from the backend (active + DELIVERED orders).
      totalOrders: user.totalOrders ?? 0,
      totalSpent: user.totalSpent ?? 0,
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
      showError(getApiErrorMessage(error), 'Erreur lors de la modification du statut');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Export the currently filtered view (same active/search filters as the table)
      const exportParams = {};
      if (debouncedSearchQuery) {
        exportParams.search = debouncedSearchQuery;
      }
      if (statusFilter === 'active') {
        exportParams.active = true;
      } else if (statusFilter === 'inactive') {
        exportParams.active = false;
      }

      const response = await exportUsers(exportParams);

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
      showError(getApiErrorMessage(error), "Erreur lors de l'export");
    } finally {
      setIsExporting(false);
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
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-600 mt-1">Gérez les comptes utilisateurs et les permissions</p>
        </div>

        <motion.button
          whileHover={{ scale: isExporting ? 1 : 1.02 }}
          whileTap={{ scale: isExporting ? 1 : 0.98 }}
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isExporting
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : <Download className="w-5 h-5" />}
          {isExporting ? 'Export...' : 'Exporter'}
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
