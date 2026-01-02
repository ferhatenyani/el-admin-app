import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import UsersTable from '../components/users/UsersTable';
import UserDetailsModal from '../components/users/UserDetailsModal';
import { getUsers, toggleUserActivation, exportUsers } from '../services/usersApi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, currentPage]);

  useEffect(() => {
    let result = [...users];

    // Apply search query (client-side filtering)
    if (searchQuery) {
      result = result.filter(
        (user) => {
          const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
          const email = (user.email || '').toLowerCase();
          const query = searchQuery.toLowerCase();
          return fullName.includes(query) || email.includes(query);
        }
      );
    }

    // Apply sorting (client-side)
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0));
    } else if (sortBy === 'name') {
      const getFullName = (user) => `${user.firstName || ''} ${user.lastName || ''}`;
      result.sort((a, b) => getFullName(a).localeCompare(getFullName(b)));
    }

    setFilteredUsers(result);
  }, [searchQuery, users, sortBy]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: 100, // Fetch all users for client-side filtering
      };

      // Apply server-side active filter if not 'all'
      if (statusFilter === 'active') {
        params.active = true;
      } else if (statusFilter === 'inactive') {
        params.active = false;
      }

      const response = await getUsers(params);

      // Handle Spring Data Page response
      const usersData = response.content || [];
      setUsers(usersData);
      setFilteredUsers(usersData);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
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

  if (loading) {
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

      <UsersTable
        users={filteredUsers}
        onViewUser={handleViewUser}
        onToggleActive={handleToggleActive}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
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
