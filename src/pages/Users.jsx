import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import UsersTable from '../components/users/UsersTable';
import UserDetailsModal from '../components/users/UserDetailsModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        result = result.filter((user) => user.active === true);
      } else if (statusFilter === 'inactive') {
        result = result.filter((user) => user.active === false);
      }
    }

    // Apply search query
    if (searchQuery) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.joinedDate || 0) - new Date(a.joinedDate || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredUsers(result);
  }, [searchQuery, users, sortBy, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call
      const data = [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
      // TODO: Replace with real API call
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };


  const handleExport = () => {
    console.log('Export triggered for users');
    // TODO: Implement export logic
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
