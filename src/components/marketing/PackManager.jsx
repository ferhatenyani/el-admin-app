import { useState, useEffect, useCallback } from 'react';
import { Plus, Package, Loader2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PackCard from './PackCard';
import PackModal from './PackModal';
import Pagination from '../common/Pagination';
import { createPack, updatePack, getPacks } from '../../services/packsApi';

const PackManager = ({ availableBooks, onDeleteRequest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [packs, setPacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Fetch packs from API
  const fetchPacks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPacks({
        page: currentPage,
        size: itemsPerPage,
        search: searchQuery || undefined,
      });

      const packsData = response.content || response;
      setPacks(Array.isArray(packsData) ? packsData : []);

      if (response.totalPages !== undefined) {
        setTotalPages(response.totalPages);
        setTotalItems(response.totalElements || 0);
      } else {
        setTotalPages(1);
        setTotalItems(packsData.length);
      }
    } catch (error) {
      console.error('Error fetching packs:', error);
      setPacks([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  // Fetch packs on mount and when dependencies change
  useEffect(() => {
    fetchPacks();
  }, [fetchPacks]);

  // Reset to page 0 when search query changes
  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(0);
  };

  const handleAddPack = () => {
    setEditingPack(null);
    setIsModalOpen(true);
  };

  const handleEditPack = (pack) => {
    setEditingPack(pack);
    setIsModalOpen(true);
  };

  const handleDeletePack = (pack) => {
    onDeleteRequest('pack', pack, fetchPacks);
  };

  const handleSavePack = async (packData, coverImage) => {
    try {
      setSaving(true);
      let result;

      if (editingPack) {
        // Update existing pack
        result = await updatePack(editingPack.id, packData, coverImage);
      } else {
        // Create new pack
        result = await createPack(packData, coverImage);
      }

      // Refresh the list after save
      await fetchPacks();

      setIsModalOpen(false);
      setEditingPack(null);
    } catch (error) {
      console.error('Error saving pack:', error);
      throw error; // Let the modal handle the error
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
            {/* Icon and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-1 sm:gap-2 flex-wrap">
                  <span className="truncate">Packs de Livres</span>
                  <span className="text-xs sm:text-sm font-normal text-gray-500 flex-shrink-0">
                    ({totalItems})
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden xs:block">
                  Gérez vos packs de livres groupés
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddPack}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 font-medium transition-all text-xs sm:text-sm"
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

      {/* Search Section */}
      <div className="p-3 sm:p-6 border-b border-gray-200 bg-white">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher des packs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Content - Collapsible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-green-600 mb-3 animate-spin" />
                <p className="text-gray-600 text-base font-medium">Chargement des packs...</p>
              </div>
            ) : packs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <Package className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-gray-800 text-base font-semibold mb-1.5">
                  {searchQuery ? 'Aucun pack trouvé' : 'Aucun pack de livres'}
                </p>
                <p className="text-gray-500 text-sm max-w-md text-center px-4">
                  {searchQuery
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Créez votre premier pack de livres groupés'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-3 sm:p-6">
                  {packs.map((pack) => (
                    <PackCard
                      key={pack.id}
                      pack={pack}
                      onEdit={() => handleEditPack(pack)}
                      onDelete={() => handleDeletePack(pack)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalItems > 0 && (
                  <div className="px-3 sm:px-6 pb-6">
                    <Pagination
                      currentPage={currentPage + 1}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      itemsPerPage={itemsPerPage}
                      totalItems={totalItems}
                      onItemsPerPageChange={handleItemsPerPageChange}
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <PackModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPack(null);
        }}
        onSave={handleSavePack}
        pack={editingPack}
        availableBooks={availableBooks}
        saving={saving}
      />
    </div>
  );
};

export default PackManager;
