import { useState, useEffect } from 'react';
import BookSectionManager from '../components/marketing/BookSectionManager';
import PackManager from '../components/marketing/PackManager';
import PixelHealthDashboard from '../components/marketing/PixelHealthDashboard';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import ToastContainer from '../components/common/Toast';
import { deletePack, getPacks } from '../services/packsApi';
import { getBooks } from '../services/booksApi';
import { deleteMainDisplay } from '../services/mainDisplayApi';
import { useToast } from '../hooks/useToast';
import { getApiErrorMessage } from '../utils/apiErrors';


const Marketing = () => {
  // Available Books & Packs State (for modals)
  const [availableBooks, setAvailableBooks] = useState([]);
  const [availablePacks, setAvailablePacks] = useState([]);

  // Confirmation modal state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'section' or 'pack'
  const [onDeleteSuccess, setOnDeleteSuccess] = useState(null);

  // Toast notifications
  const { toasts, removeToast, success, error } = useToast();

  // Fetch available books and packs from API on mount (for modals)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks({ page: 0, size: 1000 });
        const books = response.content || response;
        setAvailableBooks(books);
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    };

    const fetchPacks = async () => {
      try {
        const response = await getPacks({ page: 0, size: 1000 });
        const packs = response.content || response;
        setAvailablePacks(Array.isArray(packs) ? packs : []);
      } catch (err) {
        console.error('Error fetching packs:', err);
      }
    };

    fetchBooks();
    fetchPacks();
  }, []);

  // Handlers for deletion confirmation
  const handleDeleteRequest = (type, item, onSuccess) => {
    setDeleteType(type);
    setItemToDelete(item);
    setOnDeleteSuccess(() => onSuccess);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (deleteType === 'section') {
        // Call API to delete main display section
        await deleteMainDisplay(itemToDelete.id);
        success('La section a été supprimée avec succès');
      } else if (deleteType === 'pack') {
        // Call API to delete pack
        await deletePack(itemToDelete.id);
        success('Le pack a été supprimé avec succès');
      }

      // Call success callback to refresh the component
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      error(getApiErrorMessage(err), 'Erreur lors de la suppression');
      return;
    }

    setDeleteConfirmOpen(false);
    setItemToDelete(null);
    setDeleteType(null);
    setOnDeleteSuccess(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
    setDeleteType(null);
    setOnDeleteSuccess(null);
  };

  const getItemName = () => {
    if (!itemToDelete) return "cet élément";
    if (deleteType === 'section') return itemToDelete.name;
    if (deleteType === 'pack') return itemToDelete.name;
    return "cet élément";
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 text-white">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Gestion du marketing et de la page d'accueil</h1>
        <p className="text-blue-100 text-xs sm:text-sm md:text-base">
          Contrôlez ce qui apparaît sur la page d'accueil des utilisateurs - gérez les carrousels de livres et les offres spéciales
        </p>
      </div>

      {/* Book Sections (Carousels) */}
      <BookSectionManager
        availableBooks={availableBooks}
        availablePacks={availablePacks}
        onDeleteRequest={handleDeleteRequest}
      />

      {/* Book Packs */}
      <PackManager
        availableBooks={availableBooks}
        onDeleteRequest={handleDeleteRequest}
      />

      {/* Pixel Health Dashboard */}
      <PixelHealthDashboard />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        itemName={getItemName()}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default Marketing;
