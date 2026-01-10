import { motion } from 'framer-motion';
import { Eye, Search } from 'lucide-react';
import { formatDate } from '../../utils/format';
import CustomSelect from '../common/CustomSelect';
import Pagination from '../common/Pagination';

const UsersTable = ({
  users,
  onViewUser,
  onToggleActive,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  loading = false,
  pagination = null,
  onPageChange = null,
  onPageSizeChange = null
}) => {
  // Use users directly (server-side pagination)
  const displayUsers = users || [];
  const totalCount = pagination?.totalElements || users.length;

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' }
  ];

  const sortOptions = [
    { value: 'createdDate,desc', label: 'Date (récent)' },
    { value: 'createdDate,asc', label: 'Date (ancien)' },
    { value: 'lastName,asc', label: 'Nom (A-Z)' },
    { value: 'lastName,desc', label: 'Nom (Z-A)' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tous les utilisateurs</h2>

        <div className="flex flex-col sm:flex-row justify-between gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des utilisateurs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 sm:ml-auto">
            <div className="min-w-[140px]">
              <CustomSelect
                value={statusFilter}
                onChange={onStatusFilterChange}
                options={statusOptions}
                placeholder="Tous les statuts"
              />
            </div>

            <div className="min-w-[160px]">
              <CustomSelect
                value={sortBy}
                onChange={onSortChange}
                options={sortOptions}
                placeholder="Trier"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500">Chargement...</p>
          </div>
        </div>
      )}

      {/* Desktop table */}
      {!loading && (
        <div className="hidden md:block overflow-x-auto overflow-y-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscrit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayUsers.map((user) => {
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.login || 'N/A';
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-200 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(user.createdDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleActive(user.id)}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        style={{ backgroundColor: user.activated ? '#22c55e' : '#d1d5db' }}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            user.activated ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => onViewUser(user)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {!loading && (
        <div className="md:hidden p-4 space-y-4">
          {displayUsers.map((user) => {
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.login || 'N/A';
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4 space-y-3"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{fullName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{user.email || 'N/A'}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Inscrit</p>
                    <p className="text-sm text-gray-900">{formatDate(user.createdDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Statut :</span>
                    <button
                      onClick={() => onToggleActive(user.id)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                      style={{ backgroundColor: user.activated ? '#22c55e' : '#d1d5db' }}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.activated ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onViewUser(user)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4" />
                  Voir les détails
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && displayUsers.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500">Aucun utilisateur trouvé</p>
        </div>
      )}

      {/* Pagination - Server-side */}
      {!loading && displayUsers.length > 0 && pagination && onPageChange && (
        <Pagination
          currentPage={pagination.page + 1}
          totalPages={pagination.totalPages}
          onPageChange={(page) => onPageChange(page - 1)}
          itemsPerPage={pagination.size}
          totalItems={pagination.totalElements}
          onItemsPerPageChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default UsersTable;
