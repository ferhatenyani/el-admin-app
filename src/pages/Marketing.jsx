import { useState } from 'react';
import { LayoutGrid, BookOpen } from 'lucide-react';
import BookSectionManager from '../components/marketing/BookSectionManager';
import PackManager from '../components/marketing/PackManager';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

// Mock book data for selection with actual images
const mockBooks = [
  { id: 1, title: "L'Étranger", author: "Albert Camus", price: 1500, language: "Français", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400", isbn: "978-2070360024" },
  { id: 2, title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", price: 1200, language: "Français", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400", isbn: "978-2070612758" },
  { id: 3, title: "Les Misérables", author: "Victor Hugo", price: 2500, language: "Français", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", isbn: "978-2253096344" },
  { id: 4, title: "Madame Bovary", author: "Gustave Flaubert", price: 1800, language: "Français", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400", isbn: "978-2253004080" },
  { id: 5, title: "Germinal", author: "Émile Zola", price: 2000, language: "Français", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400", isbn: "978-2253004226" },
  { id: 6, title: "Le Rouge et le Noir", author: "Stendhal", price: 1900, language: "Français", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", isbn: "978-2253004103" },
  { id: 7, title: "Candide", author: "Voltaire", price: 1300, language: "Français", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", isbn: "978-2253006329" },
  { id: 8, title: "Notre-Dame de Paris", author: "Victor Hugo", price: 2200, language: "Français", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", isbn: "978-2253002864" },
  { id: 9, title: "Le Comte de Monte-Cristo", author: "Alexandre Dumas", price: 2800, language: "Français", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400", isbn: "978-2253098058" },
  { id: 10, title: "Thérèse Raquin", author: "Émile Zola", price: 1600, language: "Français", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400", isbn: "978-2253006329" },
];

const Marketing = () => {
  // Book Sections State
  const [bookSections, setBookSections] = useState([]);

  // Book Packs State
  const [bookPacks, setBookPacks] = useState([]);

  // Confirmation modal state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'section', 'section-book', 'pack'

  // Handlers for deletion confirmation
  const handleDeleteRequest = (type, item) => {
    setDeleteType(type);
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (deleteType === 'section') {
      setBookSections(bookSections.filter(s => s.id !== itemToDelete.id));
    } else if (deleteType === 'section-book') {
      const { sectionId, bookId } = itemToDelete;
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
      setBookPacks(bookPacks.filter(p => p.id !== itemToDelete.id));
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
          availableBooks={mockBooks}
          onDeleteRequest={handleDeleteRequest}
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
          availableBooks={mockBooks}
          onDeleteRequest={handleDeleteRequest}
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
