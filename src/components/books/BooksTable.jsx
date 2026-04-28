import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Search, ChevronDown, ChevronUp, Plus, BookOpen, Tag, Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import CustomSelect from '../common/CustomSelect';
import Pagination from '../common/Pagination';
import { useState, useEffect, useMemo } from 'react';
import { getBookCoverUrl } from '../../services/booksApi';

const LANGUAGE_DISPLAY = {
  FR: 'Français',
  EN: 'English',
  AR: 'العربية',
};

const BooksTable = ({
  books,
  onView,
  onEdit,
  onDelete,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  visibilityFilter,
  onVisibilityFilterChange,
  onAddBook,
  loading = false,
  pagination = null,
  onPageChange = null,
  onPageSizeChange = null,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  // Compute stable image URLs once per books change — not on every render.
  const imageUrls = useMemo(() => {
    const map = new Map();
    (books || []).forEach(book => {
      map.set(book.id, {
        normal: getBookCoverUrl(book.id),
        placeholder: getBookCoverUrl(book.id, true),
      });
    });
    return map;
  }, [books]);

  // Reset failed-image tracking on books change so images can recover.
  useEffect(() => {
    setFailedImages(new Set());
  }, [books]);

  // Auto-expand when a search query is present.
  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== '') {
      setIsExpanded(true);
    }
  }, [searchQuery]);

  const statusOptions = [
    { value: 'all', label: 'Tous' },
    { value: 'available', label: 'En stock' },
    { value: 'out_of_stock', label: 'Hors stock' },
  ];

  const visibilityOptions = [
    { value: 'all', label: 'Tous' },
    { value: 'catalog', label: 'Catalogue' },
    { value: 'pack_only', label: 'Pack uniquement' },
  ];

  const sortOptions = [
    { value: 'date_desc', label: '+ récents' },
    { value: 'date_asc', label: '+ anciens' },
    { value: 'title', label: 'Par titre' },
    { value: 'price', label: 'Par prix' },
  ];

  const toggleExpand = () => setIsExpanded(prev => !prev);

  const handleFilterClick = () => {
    if (!isExpanded) setIsExpanded(true);
  };

  const displayBooks = books || [];
  const totalCount = pagination?.totalElements ?? books.length;

  const CoverCell = ({ book }) => {
    const urls = imageUrls.get(book.id);
    if (failedImages.has(book.id)) {
      return (
        <div className="w-10 h-14 lg:w-12 lg:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-gray-300" />
        </div>
      );
    }
    return (
      <img
        src={failedImages.has(`${book.id}-placeholder`) ? urls?.placeholder : urls?.normal}
        alt={book.title}
        className="w-10 h-14 lg:w-12 lg:h-16 object-cover rounded-lg flex-shrink-0"
        onError={(e) => {
          if (!failedImages.has(`${book.id}-placeholder`)) {
            setFailedImages(prev => new Set(prev).add(`${book.id}-placeholder`));
            e.target.src = urls?.placeholder;
          } else {
            setFailedImages(prev => new Set(prev).add(book.id));
          }
        }}
      />
    );
  };

  const PriceCell = ({ book }) => {
    if (!book.onSale) return <span className="text-gray-900">{formatCurrency(book.price)}</span>;
    const discounted = book.discountType === 'PERCENTAGE'
      ? book.price * (1 - book.discountValue / 100)
      : Math.max(0, book.price - book.discountValue);
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-gray-400 line-through text-xs">{formatCurrency(book.price)}</span>
        <div className="flex items-center gap-1">
          <span className="text-orange-600 font-bold text-sm">{formatCurrency(discounted)}</span>
          <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
            <Tag className="w-2.5 h-2.5" />
            {book.discountType === 'PERCENTAGE' ? `-${book.discountValue}%` : `-${book.discountValue} DZD`}
          </span>
        </div>
      </div>
    );
  };

  const VisibilityBadge = ({ book }) =>
    book.visibleInCatalog === false ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
        <EyeOff className="w-3 h-3" />
        Pack only
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
        <Eye className="w-3 h-3" />
        Catalogue
      </span>
    );

  const ActionButtons = ({ book, layout }) => (
    <div className={`flex items-center ${layout === 'mobile' ? 'gap-2 flex-1' : 'gap-1.5'}`}>
      {/* View */}
      <button
        onClick={() => onView(book)}
        title="Voir"
        className={layout === 'mobile'
          ? 'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-xs font-medium transition-colors'
          : 'p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors'}
      >
        <Eye className="w-4 h-4" />
        {layout === 'mobile' && <span>Voir</span>}
      </button>

      {/* Edit */}
      <button
        onClick={() => onEdit(book)}
        title="Modifier"
        className={layout === 'mobile'
          ? 'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-xs font-medium transition-colors'
          : 'p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors'}
      >
        <Edit className="w-4 h-4" />
        {layout === 'mobile' && <span>Modifier</span>}
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(book)}
        title="Supprimer"
        className={layout === 'mobile'
          ? 'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-xs font-medium transition-colors'
          : 'p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors'}
      >
        <Trash2 className="w-4 h-4" />
        {layout === 'mobile' && <span>Supprimer</span>}
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 border-b border-gray-200">
        <div className="flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg shadow-lg flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 flex items-center gap-1 flex-wrap">
                <span className="truncate">Tous les livres</span>
                {loading && (
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-blue-600 border-t-transparent" />
                )}
                <span className="text-xs font-normal text-gray-500 flex-shrink-0">({totalCount})</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddBook}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 font-medium transition-all text-xs sm:text-sm"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Ajouter</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleExpand}
              className="p-1.5 sm:p-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              title={isExpanded ? 'Réduire' : 'Développer'}
            >
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters */}
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

          <div className="flex gap-2 sm:gap-3 sm:ml-auto min-w-0">
            <div className="flex-1 sm:flex-none sm:min-w-[140px] min-w-0">
              <CustomSelect
                value={statusFilter}
                onChange={onStatusFilterChange}
                options={statusOptions}
                placeholder="Statuts"
                onOpen={handleFilterClick}
              />
            </div>
            <div className="flex-1 sm:flex-none sm:min-w-[150px] min-w-0">
              <CustomSelect
                value={visibilityFilter}
                onChange={onVisibilityFilterChange}
                options={visibilityOptions}
                placeholder="Visibilité"
                onOpen={handleFilterClick}
              />
            </div>
            <div className="flex-1 sm:flex-none sm:min-w-[150px] min-w-0">
              <CustomSelect
                value={sortBy}
                onChange={onSortChange}
                options={sortOptions}
                placeholder="Trier"
                onOpen={handleFilterClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                  <p className="text-sm text-gray-500">Chargement...</p>
                </div>
              </div>
            )}

            {!loading && displayBooks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">Aucun livre trouvé</p>
                <p className="text-sm text-gray-500 text-center">
                  {searchQuery
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Commencez par ajouter votre premier livre'}
                </p>
              </div>
            )}

            {/* Desktop table */}
            {!loading && displayBooks.length > 0 && (
              <div className="hidden md:block overflow-x-auto overflow-y-hidden">
                <div className="min-w-[640px]">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Couverture', 'Titre', 'Auteur', 'Prix', 'Visibilité', 'Actions'].map(col => (
                          <th
                            key={col}
                            className="px-4 lg:px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {displayBooks.map(book => (
                        <motion.tr
                          key={book.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50/70 transition-colors duration-150"
                        >
                          <td className="px-4 lg:px-5 py-3.5 whitespace-nowrap">
                            <CoverCell book={book} />
                          </td>
                          <td className="px-4 lg:px-5 py-3.5">
                            <div className="text-sm font-semibold text-gray-900 max-w-[200px] truncate">
                              {book.title}
                            </div>
                          </td>
                          <td className="px-4 lg:px-5 py-3.5 whitespace-nowrap text-sm text-gray-500">
                            {book.author?.name || '—'}
                          </td>
                          <td className="px-4 lg:px-5 py-3.5 whitespace-nowrap">
                            <PriceCell book={book} />
                          </td>
                          <td className="px-4 lg:px-5 py-3.5 whitespace-nowrap">
                            <VisibilityBadge book={book} />
                          </td>
                          <td className="px-4 lg:px-5 py-3.5 whitespace-nowrap">
                            <ActionButtons book={book} layout="desktop" />
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mobile cards */}
            {!loading && displayBooks.length > 0 && (
              <div className="md:hidden p-3 sm:p-4 space-y-3">
                {displayBooks.map(book => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-3 border border-gray-100"
                  >
                    <div className="flex gap-3">
                      <CoverCell book={book} />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">{book.title}</h3>
                        <p className="text-xs text-gray-500 truncate">{book.author?.name || '—'}</p>
                        <div className="pt-0.5">
                          <PriceCell book={book} />
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <VisibilityBadge book={book} />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1 border-t border-gray-200">
                      <ActionButtons book={book} layout="mobile" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
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
