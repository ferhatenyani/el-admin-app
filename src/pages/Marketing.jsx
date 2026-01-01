import { useState, useEffect } from 'react';
import { LayoutGrid, BookOpen } from 'lucide-react';
import BookSectionManager from '../components/marketing/BookSectionManager';
import PackManager from '../components/marketing/PackManager';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import { getPacks, deletePack } from '../services/packsApi';
import { getBooks } from '../services/booksApi';
import { getMainDisplays, deleteMainDisplay } from '../services/mainDisplayApi';


const Marketing = () => {
  // Book Sections State
  const [bookSections, setBookSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);

  // Book Packs State
  const [bookPacks, setBookPacks] = useState([]);
  const [loadingPacks, setLoadingPacks] = useState(true);

  // Available Books State
  const [availableBooks, setAvailableBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  // Confirmation modal state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'section', 'section-book', 'pack'

  // Fetch main displays (book sections) from API on mount
  useEffect(() => {
    const fetchMainDisplays = async () => {
      try {
        setLoadingSections(true);
        const response = await getMainDisplays({ page: 0, size: 1000 }); // Fetch all sections
        const displays = response.content || response;
        setBookSections(displays);
      } catch (error) {
        console.error('Error fetching main displays:', error);
      } finally {
        setLoadingSections(false);
      }
    };

    fetchMainDisplays();
  }, []);

  // Fetch packs from API on mount
  useEffect(() => {
    const fetchPacks = async () => {
      try {
        setLoadingPacks(true);
        const response = await getPacks({ page: 0, size: 1000 }); // Fetch all packs
        const packs = response.content || response;
        setBookPacks(packs);
      } catch (error) {
        console.error('Error fetching packs:', error);
      } finally {
        setLoadingPacks(false);
      }
    };

    fetchPacks();
  }, []);

  // Fetch available books from API on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingBooks(true);
        const response = await getBooks({ page: 0, size: 1000 }); // Fetch all books for selection
        const books = response.content || response;
        setAvailableBooks(books);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks();
  }, []);

  // Handlers for deletion confirmation
  const handleDeleteRequest = (type, item) => {
    setDeleteType(type);
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (deleteType === 'section') {
        // Call API to delete main display section
        await deleteMainDisplay(itemToDelete.id);
        // Update local state
        setBookSections(bookSections.filter(s => s.id !== itemToDelete.id));
      } else if (deleteType === 'section-book') {
        const { sectionId, bookId } = itemToDelete;
        // In the updated implementation, this will be handled through the API
        // For now, keep the local state update
        setBookSections(bookSections.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              books: section.books.filter(book => book.id !== bookId)
            };
          }
          return section;
        }));
      } else if (deleteType === 'pack') {
        // Call API to delete pack
        await deletePack(itemToDelete.id);
        // Update local state
        setBookPacks(bookPacks.filter(p => p.id !== itemToDelete.id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Une erreur est survenue lors de la suppression. Veuillez réessayer.');
      return;
    }

    setDeleteConfirmOpen(false);
    setItemToDelete(null);
    setDeleteType(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
    setDeleteType(null);
  };

  const getItemName = () => {
    if (!itemToDelete) return "cet élément";
    if (deleteType === 'section') return itemToDelete.name;
    if (deleteType === 'section-book') return itemToDelete.bookTitle;
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
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Sections de livres (Carrousels)</h2>
            <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">Créez et gérez les carrousels de livres de la page d'accueil</p>
          </div>
        </div>

        <BookSectionManager
          sections={bookSections}
          setSections={setBookSections}
          availableBooks={availableBooks}
          onDeleteRequest={handleDeleteRequest}
          loading={loadingSections || loadingBooks}
        />
      </div>

      {/* Book Packs */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl">
            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Packs de livres</h2>
            <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">Gérez les offres spéciales et les ensembles de livres groupés</p>
          </div>
        </div>

        <PackManager
          packs={bookPacks}
          setPacks={setBookPacks}
          availableBooks={availableBooks}
          onDeleteRequest={handleDeleteRequest}
          loading={loadingPacks || loadingBooks}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        itemName={getItemName()}
      />
    </div>
  );
};

export default Marketing;
