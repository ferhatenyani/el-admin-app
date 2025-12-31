import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronUp, Users, UserCircle, Download } from 'lucide-react';
import AuthorCard from './AuthorCard';
import AddAuthorModal from './AddAuthorModal';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import Pagination from '../common/Pagination';
import usePagination from '../../hooks/usePagination';
import * as authorsApi from '../../services/authorsApi';

/**
 * AuthorsSection Component
 * Section principale pour gérer les auteurs de livres
 * Fonctionnalités :
 * - Panneau pliable pour économiser de l'espace
 * - Mise en page en grille pour les cartes d'auteurs
 * - Fonctionnalité d'ajout/suppression d'auteurs
 * - Données mock avec gestion d'état local
 */
const AuthorsSection = () => {
  // State management for authors
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedAuthors,
    handlePageChange,
    handleItemsPerPageChange,
    totalItems
  } = usePagination(authors, 5);

  // Fetch authors from API
  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: 0,
        size: 100, // Fetch all authors for client-side pagination
      };
      const response = await authorsApi.getAuthors(params);
      setAuthors(response.content || response);
    } catch (err) {
      console.error('Error fetching authors:', err);
      setError('Failed to load authors. Please try again.');
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch authors on component mount
  useEffect(() => {
    fetchAuthors();
  }, []);

  // Gérer l'ajout d'un nouvel auteur
  const handleAddAuthor = () => {
    setEditingAuthor(null);
    setIsModalOpen(true);
  };

  // Gérer la modification d'un auteur existant
  const handleEditAuthor = (author) => {
    // imageUrl is already set by the API (alias of profilePictureUrl)
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  // Gérer la soumission d'auteur (ajout ou mise à jour)
  const handleSubmitAuthor = async (authorData) => {
    try {
      if (editingAuthor) {
        // Update existing author
        await authorsApi.updateAuthor(
          editingAuthor.id,
          { name: authorData.name },
          authorData.imageUrl // File object from UploadImageInput
        );
      } else {
        // Create new author
        await authorsApi.createAuthor(
          { name: authorData.name },
          authorData.imageUrl // File object from UploadImageInput
        );
      }
      await fetchAuthors(); // Refresh list after operation
      setIsModalOpen(false);
      setEditingAuthor(null);
    } catch (err) {
      console.error('Error saving author:', err);
      setError('Failed to save author. Please try again.');
    }
  };

  // Gérer la suppression d'un auteur
  const handleDeleteAuthor = (author) => {
    setAuthorToDelete(author);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteAuthor = async () => {
    if (!authorToDelete) return;
    try {
      await authorsApi.deleteAuthor(authorToDelete.id);
      await fetchAuthors(); // Refresh list after deletion
      setDeleteConfirmOpen(false);
      setAuthorToDelete(null);
    } catch (err) {
      console.error('Error deleting author:', err);
      setError('Failed to delete author. Please try again.');
      setDeleteConfirmOpen(false);
      setAuthorToDelete(null);
    }
  };

  const cancelDeleteAuthor = () => {
    setDeleteConfirmOpen(false);
    setAuthorToDelete(null);
  };

  // Basculer entre développer/réduire
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Gérer l'export
  const handleExport = () => {
    console.log('Export déclenché pour les auteurs');
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
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
              {/* Icône et Titre */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span className="truncate">Auteurs</span>
                    <span className="text-xs sm:text-sm font-normal text-gray-500 flex-shrink-0">
                      ({authors.length})
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden xs:block">
                    Gérez les auteurs de vos livres
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
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
                onClick={handleAddAuthor}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 font-medium transition-all text-xs sm:text-sm"
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

        {/* Grille d'auteurs - Pliable */}
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
                {loading && authors.length === 0 ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  </div>
                ) : authors.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                      {paginatedAuthors.map((author, index) => (
                        <AuthorCard
                          key={author.id}
                          author={author}
                          onDelete={handleDeleteAuthor}
                          onEdit={handleEditAuthor}
                          index={index}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {authors.length > 0 && (
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
                        <UserCircle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                      <div className="max-w-sm">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                          Aucun auteur pour le moment
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                          Créez votre premier auteur pour organiser vos livres
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddAuthor}
                          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-500/30 text-sm"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          Ajouter votre premier auteur
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

      {/* Modal d'ajout/modification d'auteur */}
      <AddAuthorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAuthor(null);
        }}
        onSubmit={handleSubmitAuthor}
        initialData={editingAuthor}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmOpen}
        onConfirm={confirmDeleteAuthor}
        onCancel={cancelDeleteAuthor}
        itemName={authorToDelete?.name || "cet auteur"}
      />
    </div>
  );
};

export default AuthorsSection;
