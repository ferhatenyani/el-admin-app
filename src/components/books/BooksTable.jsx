import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Search, ChevronDown, ChevronUp, Plus, Download, BookOpen } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import CustomSelect from '../common/CustomSelect';
import Pagination from '../common/Pagination';
import { useState } from 'react';
import { getBookCoverUrl } from '../../services/booksApi';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  out_of_stock: 'bg-red-100 text-red-800',
};

// Language code to display name mapping
const LANGUAGE_DISPLAY = {
  'FR': 'Français',
  'EN': 'English',
  'AR': 'العربية'
};

const BooksTable = ({
  books,
  onEdit,
  onDelete,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  onAddBook,
  onExport,
  loading = false,
  pagination = null,
  onPageChange = null,
  onPageSizeChange = null,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [failedImages, setFailedImages] = useState(new Set());

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actif' },
    { value: 'out_of_stock', label: 'Rupture de stock' }
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Plus récent' },
    { value: 'date_asc', label: 'Plus ancien' },
    { value: 'title', label: 'Trier par titre' },
    { value: 'price', label: 'Trier par prix' }
  ];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Use server-side pagination if provided, otherwise show all books
  const displayBooks = books || [];
  const totalCount = pagination?.totalElements || books.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Barre d'en-tête avec gradient */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
            {/* Icône et Titre */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-1 sm:gap-2 flex-wrap">
                  <span className="truncate">Tous les livres</span>
                  <span className="text-xs sm:text-sm font-normal text-gray-500 flex-shrink-0">
                    ({totalCount})
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden xs:block">
                  Gérez votre inventaire de livres
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExport}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/30 font-medium transition-all text-xs sm:text-sm"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Exporter</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddBook}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 font-medium transition-all text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Ajouter</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleExpand}
              className="p-2 sm:p-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              title={isExpanded ? 'Réduire' : 'Développer'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Section de filtres et recherche */}
      <div className="p-3 sm:p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-2 sm:gap-3 sm:ml-auto">
            <div className="flex-1 sm:flex-none sm:min-w-[140px]">
              <CustomSelect
                value={statusFilter}
                onChange={onStatusFilterChange}
                options={statusOptions}
                placeholder="Statuts"
              />
            </div>

            <div className="flex-1 sm:flex-none sm:min-w-[150px]">
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

      {/* Table content - Collapsible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-500">Chargement...</p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && displayBooks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">Aucun livre trouvé</p>
                <p className="text-sm text-gray-500 text-center">
                  {searchQuery
                    ? "Essayez de modifier vos critères de recherche"
                    : "Commencez par ajouter votre premier livre"}
                </p>
              </div>
            )}

            {/* Desktop table */}
            {!loading && displayBooks.length > 0 && (
              <div className="hidden md:block overflow-x-auto">
                <div className="min-w-[800px]">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Couverture
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Titre
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Auteur
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Langue
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayBooks.map((book) => {
                        // Determine status based on stock quantity
                        const status = book.stockQuantity === 0 ? 'out_of_stock' : 'active';
                        const statusLabel = status === 'active' ? 'Actif' : 'Rupture de stock';

                        return (
                          <motion.tr
                            key={book.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              {failedImages.has(book.id) ? (
                                <div className="w-10 h-14 lg:w-12 lg:h-16 bg-gray-200 rounded flex items-center justify-center">
                                  <BookOpen className="w-6 h-6 text-gray-400" />
                                </div>
                              ) : (
                                <img
                                  src={getBookCoverUrl(book.id, failedImages.has(`${book.id}-placeholder`))}
                                  alt={book.title}
                                  className="w-10 h-14 lg:w-12 lg:h-16 object-cover rounded"
                                  onError={(e) => {
                                    // Try placeholder if not already tried
                                    if (!failedImages.has(`${book.id}-placeholder`)) {
                                      setFailedImages(prev => new Set(prev).add(`${book.id}-placeholder`));
                                      e.target.src = getBookCoverUrl(book.id, true);
                                    } else {
                                      // Both failed, show icon
                                      setFailedImages(prev => new Set(prev).add(book.id));
                                    }
                                  }}
                                />
                              )}
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{book.title}</div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {book.author?.name || 'Auteur inconnu'}
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {book.tags?.find(tag => tag.type === 'CATEGORY')?.nameFr || 'Non catégorisé'}
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                {LANGUAGE_DISPLAY[book.language] || book.language || 'Inconnue'}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(book.price)}
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {book.stockQuantity || 0}
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
                                {statusLabel}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onEdit(book)}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onDelete(book)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mobile cards */}
            {!loading && displayBooks.length > 0 && (
              <div className="md:hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
                {displayBooks.map((book) => {
                  // Determine status based on stock quantity
                  const status = book.stockQuantity === 0 ? 'out_of_stock' : 'active';
                  const statusLabel = status === 'active' ? 'Actif' : 'Rupture';

                  return (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {failedImages.has(book.id) ? (
                          <div className="w-14 h-18 sm:w-16 sm:h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                          </div>
                        ) : (
                          <img
                            src={getBookCoverUrl(book.id, failedImages.has(`${book.id}-placeholder`))}
                            alt={book.title}
                            className="w-14 h-18 sm:w-16 sm:h-20 object-cover rounded flex-shrink-0"
                            onError={(e) => {
                              // Try placeholder if not already tried
                              if (!failedImages.has(`${book.id}-placeholder`)) {
                                setFailedImages(prev => new Set(prev).add(`${book.id}-placeholder`));
                                e.target.src = getBookCoverUrl(book.id, true);
                              } else {
                                // Both failed, show icon
                                setFailedImages(prev => new Set(prev).add(book.id));
                              }
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">{book.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{book.author?.name || 'Auteur inconnu'}</p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {book.tags?.find(tag => tag.type === 'CATEGORY')?.nameFr || 'Non catégorisé'}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                            {LANGUAGE_DISPLAY[book.language] || book.language || 'Inconnue'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(book.price)}</p>
                          <p className="text-xs text-gray-600">Stock: {book.stockQuantity || 0}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
                          {statusLabel}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-gray-200">
                        <button
                          onClick={() => onEdit(book)}
                          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm"
                        >
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">Modifier</span>
                          <span className="xs:hidden">Éditer</span>
                        </button>
                        <button
                          onClick={() => onDelete(book)}
                          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination - Server-side */}
            {!loading && displayBooks.length > 0 && pagination && onPageChange && (
              <Pagination
                currentPage={pagination.page + 1}
                totalPages={pagination.totalPages}
                onPageChange={(page) => onPageChange(page - 1)}
                itemsPerPage={pagination.size}
                totalItems={pagination.totalElements}
                onItemsPerPageChange={onPageSizeChange}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BooksTable;
