import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronUp, FolderOpen, BookOpen, Download } from 'lucide-react';
import CategoryCard from './CategoryCard';
import AddCategoryModal from './AddCategoryModal';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';

/**
 * CategoriesSection Component
 * Section principale pour gérer les catégories de livres
 * Fonctionnalités :
 * - Panneau pliable pour économiser de l'espace
 * - Mise en page en grille pour les cartes de catégories
 * - Fonctionnalité d'ajout/suppression de catégories
 * - Données mock avec gestion d'état local
 */
const CategoriesSection = () => {
  // Données de catégories initiales (mock)
  const [categories, setCategories] = useState([
    {
      id: 1,
      nameEn: 'Science Fiction',
      nameFr: 'Science-Fiction',
      imageUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=500',
    },
    {
      id: 2,
      nameEn: 'Mystery & Thriller',
      nameFr: 'Mystère et Thriller',
      imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500',
    },
    {
      id: 3,
      nameEn: 'Romance',
      nameFr: 'Romance',
      imageUrl: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=500',
    },
    {
      id: 4,
      nameEn: 'Biography',
      nameFr: 'Biographie',
      imageUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500',
    },
    {
      id: 5,
      nameEn: 'Self-Help',
      nameFr: 'Développement Personnel',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
    },
    {
      id: 6,
      nameEn: 'Technology',
      nameFr: 'Technologie',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Générer un ID unique pour les nouvelles catégories
  const generateId = () => {
    return categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
  };

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
  const handleSubmitCategory = (categoryData) => {
    if (editingCategory) {
      // Mettre à jour la catégorie existante
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat
        )
      );
    } else {
      // Ajouter une nouvelle catégorie
      const newCategory = {
        id: generateId(),
        ...categoryData,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // Gérer la suppression d'une catégorie
  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
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

  // Gérer l'export
  const handleExport = () => {
    console.log('Export déclenché pour les catégories');
    // TODO: Implémenter la logique d'export
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
            <div className="flex items-center gap-4 flex-1">
              {/* Icône et Titre */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Catégories de livres
                    <span className="text-sm font-normal text-gray-500">
                      ({categories.length})
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Organisez vos livres en catégories
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/30 font-medium transition-all"
              >
                <Download className="w-5 h-5" />
                Exporter
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddCategory}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 font-medium transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajouter
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleExpand}
                className="p-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                title={isExpanded ? 'Réduire' : 'Développer'}
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
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
              <div className="p-6">
                {categories.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {categories.map((category, index) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        onDelete={handleDeleteCategory}
                        onEdit={handleEditCategory}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Aucune catégorie pour le moment
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Créez votre première catégorie pour organiser vos livres
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddCategory}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30"
                        >
                          <Plus className="w-5 h-5" />
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
};

export default CategoriesSection;
