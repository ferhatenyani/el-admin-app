import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronUp, FolderOpen, BookOpen } from 'lucide-react';
import CategoryCard from './CategoryCard';
import AddCategoryModal from './AddCategoryModal';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import Pagination from '../common/Pagination';
import usePagination from '../../hooks/usePagination';
import * as categoriesApi from '../../services/categoriesApi';
import { getCategoryImageUrl } from '../../services/categoriesApi';

/**
 * CategoriesSection Component
 * Section principale pour gérer les catégories de livres
 * Fonctionnalités :
 * - Panneau pliable pour économiser de l'espace
 * - Mise en page en grille pour les cartes de catégories
 * - Fonctionnalité d'ajout/suppression de catégories
 * - Données mock avec gestion d'état local
 * - Memoized to prevent unnecessary re-renders when parent state changes
 */
const CategoriesSection = memo(() => {
  // State management for categories
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedCategories,
    handlePageChange,
    handleItemsPerPageChange,
    totalItems
  } = usePagination(categories, 5);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: 0,
        size: 100, // Fetch all categories for client-side pagination
      };
      const response = await categoriesApi.getCategories(params);
      // API returns array directly (not wrapped in content)
      setCategories(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Gérer l'ajout d'une nouvelle catégorie
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  // Gérer la modification d'une catégorie existante
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  // Gérer la soumission de catégorie (ajout ou mise à jour)
  const handleSubmitCategory = async (categoryData) => {
    try {
      if (editingCategory) {
        // Update existing category
        await categoriesApi.updateCategory(
          editingCategory.id,
          { nameEn: categoryData.nameEn, nameFr: categoryData.nameFr },
          categoryData.imageUrl // File object from UploadImageInput
        );
      } else {
        // Create new category
        await categoriesApi.createCategory(
          { nameEn: categoryData.nameEn, nameFr: categoryData.nameFr },
          categoryData.imageUrl // File object from UploadImageInput
        );
      }
      await fetchCategories(); // Refresh list after operation
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Failed to save category. Please try again.');
    }
  };

  // Gérer la suppression d'une catégorie
  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await categoriesApi.deleteCategory(categoryToDelete.id);
      await fetchCategories(); // Refresh list after deletion
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again.');
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDeleteCategory = () => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  // Basculer entre développer/réduire
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-4">
      {/* En-tête de section avec bouton de réduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        {/* Barre d'en-tête */}
        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 border-b border-gray-200">
          <div className="flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-4">
            {/* Icône et Titre */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg shadow-lg flex-shrink-0">
                <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-lg font-bold text-gray-900 flex items-center gap-1 flex-wrap">
                  <span className="truncate">Catégories de livres</span>
                  <span className="text-xs font-normal text-gray-500 flex-shrink-0">
                    ({categories.length})
                  </span>
                </h2>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddCategory}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 font-medium transition-all text-xs sm:text-sm"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Ajouter</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleExpand}
                className="p-1.5 sm:p-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
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

        {/* Grille de catégories - Pliable */}
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
                {loading && categories.length === 0 ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : categories.length > 0 ? (
                  <>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 2xl:gap-7">
                      {paginatedCategories.map((category, index) => (
                        <CategoryCard
                          key={category.id}
                          category={category}
                          onDelete={handleDeleteCategory}
                          onEdit={handleEditCategory}
                          index={index}
                          getCategoryImageUrl={getCategoryImageUrl}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {categories.length > 0 && (
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
                        <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                      <div className="max-w-sm">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                          Aucune catégorie pour le moment
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                          Créez votre première catégorie pour organiser vos livres
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddCategory}
                          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30 text-sm"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          Ajouter votre première catégorie
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

      {/* Modal d'ajout/modification de catégorie */}
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmitCategory}
        initialData={editingCategory}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmOpen}
        onConfirm={confirmDeleteCategory}
        onCancel={cancelDeleteCategory}
        itemName={categoryToDelete?.nameEn || "cette catégorie"}
      />
    </div>
  );
});

CategoriesSection.displayName = 'CategoriesSection';

export default CategoriesSection;
