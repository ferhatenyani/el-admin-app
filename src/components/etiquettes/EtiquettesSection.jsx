import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronUp, Tag, Tags, Download } from 'lucide-react';
import EtiquetteCard from './EtiquetteCard';
import AddEtiquetteModal from './AddEtiquetteModal';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import Pagination from '../common/Pagination';
import usePagination from '../../hooks/usePagination';
import * as etiquettesApi from '../../services/etiquettesApi';

/**
 * EtiquettesSection Component
 * Main section for managing book labels/tags (etiquettes)
 * Features:
 * - Collapsible panel to save space
 * - Grid layout for etiquette cards
 * - Add/edit/delete functionality
 * - Mock data with local state management
 */
const EtiquettesSection = () => {
  // State management for etiquettes
  const [etiquettes, setEtiquettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingEtiquette, setEditingEtiquette] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [etiquetteToDelete, setEtiquetteToDelete] = useState(null);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedEtiquettes,
    handlePageChange,
    handleItemsPerPageChange,
    totalItems
  } = usePagination(etiquettes, 5);

  // Fetch etiquettes from API
  const fetchEtiquettes = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: 0,
        size: 100, // Fetch all etiquettes for client-side pagination
      };
      const response = await etiquettesApi.getEtiquettes(params);
      setEtiquettes(response.content || response);
    } catch (err) {
      console.error('Error fetching etiquettes:', err);
      setError('Failed to load etiquettes. Please try again.');
      setEtiquettes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch etiquettes on component mount
  useEffect(() => {
    fetchEtiquettes();
  }, []);

  // Handle adding a new etiquette
  const handleAddEtiquette = () => {
    setEditingEtiquette(null);
    setIsModalOpen(true);
  };

  // Handle editing an existing etiquette
  const handleEditEtiquette = (etiquette) => {
    setEditingEtiquette(etiquette);
    setIsModalOpen(true);
  };

  // Handle etiquette submission (add or update)
  const handleSubmitEtiquette = async (etiquetteData) => {
    try {
      if (editingEtiquette) {
        // Update existing etiquette
        await etiquettesApi.updateEtiquette(
          editingEtiquette.id,
          { nameEn: etiquetteData.nameEn, nameFr: etiquetteData.nameFr, colorHex: etiquetteData.color }
        );
      } else {
        // Create new etiquette
        await etiquettesApi.createEtiquette({
          nameEn: etiquetteData.nameEn,
          nameFr: etiquetteData.nameFr,
          colorHex: etiquetteData.color
        });
      }
      await fetchEtiquettes(); // Refresh list after operation
      setIsModalOpen(false);
      setEditingEtiquette(null);
    } catch (err) {
      console.error('Error saving etiquette:', err);
      setError('Failed to save etiquette. Please try again.');
    }
  };

  // Handle deleting an etiquette
  const handleDeleteEtiquette = (etiquette) => {
    setEtiquetteToDelete(etiquette);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteEtiquette = async () => {
    if (!etiquetteToDelete) return;
    try {
      await etiquettesApi.deleteEtiquette(etiquetteToDelete.id);
      await fetchEtiquettes(); // Refresh list after deletion
      setDeleteConfirmOpen(false);
      setEtiquetteToDelete(null);
    } catch (err) {
      console.error('Error deleting etiquette:', err);
      setError('Failed to delete etiquette. Please try again.');
      setDeleteConfirmOpen(false);
      setEtiquetteToDelete(null);
    }
  };

  const cancelDeleteEtiquette = () => {
    setDeleteConfirmOpen(false);
    setEtiquetteToDelete(null);
  };

  // Toggle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle export
  const handleExport = () => {
    console.log('Export triggered for etiquettes');
    // TODO: Implement export logic
  };

  return (
    <div className="space-y-4">
      {/* Section header with collapse button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        {/* Header bar */}
        <div className="bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
              {/* Icon and Title */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-500 to-orange-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                  <Tags className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span className="truncate">Étiquettes</span>
                    <span className="text-xs sm:text-sm font-normal text-gray-500 flex-shrink-0">
                      ({etiquettes.length})
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden xs:block">
                    Organisez vos livres avec des étiquettes colorées
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/30 font-medium transition-all text-xs sm:text-sm"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Exporter</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddEtiquette}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-lg hover:from-pink-700 hover:to-orange-700 shadow-lg shadow-pink-500/30 font-medium transition-all text-xs sm:text-sm"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Ajouter</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleExpand}
                className="p-2 sm:p-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
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

        {/* Etiquettes grid - Collapsible */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-6">
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Loading State */}
                {loading && etiquettes.length === 0 ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                  </div>
                ) : etiquettes.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                      {paginatedEtiquettes.map((etiquette, index) => (
                        <EtiquetteCard
                          key={etiquette.id}
                          etiquette={etiquette}
                          onDelete={handleDeleteEtiquette}
                          onEdit={handleEditEtiquette}
                          index={index}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {etiquettes.length > 0 && (
                      <div className="mt-4 sm:mt-6">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          itemsPerPage={itemsPerPage}
                          totalItems={totalItems}
                          onItemsPerPageChange={handleItemsPerPageChange}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 sm:py-16 px-3"
                  >
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-gray-100 rounded-full">
                        <Tag className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                      <div className="max-w-sm">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                          Aucune étiquette pour le moment
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                          Créez votre première étiquette pour organiser vos livres
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddEtiquette}
                          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium shadow-lg shadow-pink-500/30 text-sm"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          Ajouter votre première étiquette
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add/Edit etiquette modal */}
      <AddEtiquetteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEtiquette(null);
        }}
        onSubmit={handleSubmitEtiquette}
        initialData={editingEtiquette}
      />

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmOpen}
        onConfirm={confirmDeleteEtiquette}
        onCancel={cancelDeleteEtiquette}
        itemName={etiquetteToDelete?.nameFr || "cette étiquette"}
      />
    </div>
  );
};

export default EtiquettesSection;
