import { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, BookOpen, Loader, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookSectionModal from './BookSectionModal';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import Pagination from '../common/Pagination';
import { createMainDisplay, updateMainDisplay, addBooksToMainDisplay, removeBooksFromMainDisplay, getMainDisplays } from '../../services/mainDisplayApi';
import { getBookCoverUrl } from '../../services/booksApi';

const BookSectionManager = ({ availableBooks, onDeleteRequest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, sectionId: null, book: null });
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [sections, setSections] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Fetch sections from API
  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMainDisplays({
        page: currentPage,
        size: itemsPerPage,
        search: searchQuery || undefined,
        includeBooks: true,
      });

      const sectionsData = response.content || response;
      setSections(Array.isArray(sectionsData) ? sectionsData : []);

      if (response.totalPages !== undefined) {
        setTotalPages(response.totalPages);
        setTotalItems(response.totalElements || 0);
      } else {
        setTotalPages(1);
        setTotalItems(sectionsData.length);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  // Fetch sections on mount and when dependencies change
  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

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

  const handleAddSection = () => {
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleDeleteSection = (section) => {
    onDeleteRequest('section', section, fetchSections);
  };

  const handleRemoveBookFromSection = (sectionId, book) => {
    // Show confirmation modal
    setConfirmDelete({ isOpen: true, sectionId, book });
  };

  const confirmRemoveBook = async () => {
    const { sectionId, book } = confirmDelete;

    try {
      // Call API to remove book from main display
      await removeBooksFromMainDisplay(sectionId, [book.id]);

      // Refresh the list after removal
      await fetchSections();

      // Close confirmation modal
      setConfirmDelete({ isOpen: false, sectionId: null, book: null });
    } catch (error) {
      console.error('Error removing book from section:', error);
      alert('Une erreur est survenue lors de la suppression du livre. Veuillez réessayer.');
      setConfirmDelete({ isOpen: false, sectionId: null, book: null });
    }
  };

  const cancelRemoveBook = () => {
    setConfirmDelete({ isOpen: false, sectionId: null, book: null });
  };

  const handleSaveSection = async (sectionData) => {
    try {
      setSaving(true);

      if (editingSection) {
        // Update existing section
        await updateMainDisplay(editingSection.id, {
          nameEn: sectionData.name,
          nameFr: sectionData.name,
          active: true,
        });

        // Handle book changes
        const currentBookIds = editingSection.books.map(b => b.id);
        const newBookIds = sectionData.books.map(b => b.id);

        // Books to add
        const booksToAdd = newBookIds.filter(id => !currentBookIds.includes(id));
        if (booksToAdd.length > 0) {
          await addBooksToMainDisplay(editingSection.id, booksToAdd);
        }

        // Books to remove
        const booksToRemove = currentBookIds.filter(id => !newBookIds.includes(id));
        if (booksToRemove.length > 0) {
          await removeBooksFromMainDisplay(editingSection.id, booksToRemove);
        }
      } else {
        // Create new section
        const newSection = await createMainDisplay({
          nameEn: sectionData.name,
          nameFr: sectionData.name,
          active: true,
        });

        // Add books to the new section
        if (sectionData.books.length > 0) {
          const bookIds = sectionData.books.map(b => b.id);
          await addBooksToMainDisplay(newSection.id, bookIds);
        }
      }

      // Refresh the list after save
      await fetchSections();

      setIsModalOpen(false);
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
            {/* Icon and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-1 sm:gap-2 flex-wrap">
                  <span className="truncate">Sections de Livres</span>
                  <span className="text-xs sm:text-sm font-normal text-gray-500 flex-shrink-0">
                    ({totalItems})
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 hidden xs:block">
                  Gérez les sections de la page d'accueil
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddSection}
              disabled={loading}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 font-medium transition-all text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
            placeholder="Rechercher des sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                <Loader className="w-12 h-12 text-blue-600 mb-3 animate-spin" />
                <p className="text-gray-600 text-base font-medium">Chargement des sections...</p>
              </div>
            ) : sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <p className="text-gray-800 text-base font-semibold mb-1.5">
                  {searchQuery ? 'Aucune section trouvée' : 'Aucune section de livres'}
                </p>
                <p className="text-gray-500 text-sm max-w-md text-center px-4">
                  {searchQuery
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Créez votre première section de livres pour la page d\'accueil'}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 p-3 sm:p-6">
                  {sections.map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      onEdit={() => handleEditSection(section)}
                      onDelete={() => handleDeleteSection(section)}
                      onRemoveBook={(book) => handleRemoveBookFromSection(section.id, book)}
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
      <BookSectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSection(null);
        }}
        onSave={handleSaveSection}
        section={editingSection}
        availableBooks={availableBooks}
        saving={saving}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={confirmDelete.isOpen}
        onConfirm={confirmRemoveBook}
        onCancel={cancelRemoveBook}
        itemName={confirmDelete.book ? `"${confirmDelete.book.title}"` : 'ce livre'}
      />
    </div>
  );
};

// Section Card Component - Professional Style
const SectionCard = ({ section, onEdit, onDelete, onRemoveBook }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [failedImages, setFailedImages] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef(null);

  // Mouse/Touch drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  // Responsive card dimensions - Professional sizing
  const getCardDimensions = () => {
    if (typeof window === 'undefined') return {
      width: 160,
      height: 240,
      visible: 4,
      imageHeight: 160,
      gap: 16
    };

    const viewportWidth = window.innerWidth;
    let cardWidth, imageHeight, visible, gap;

    if (viewportWidth >= 1280) {
      cardWidth = 180;
      imageHeight = 180;
      visible = 5;
      gap = 16;
    } else if (viewportWidth >= 1024) {
      cardWidth = 170;
      imageHeight = 170;
      visible = 4;
      gap = 16;
    } else if (viewportWidth >= 768) {
      cardWidth = 160;
      imageHeight = 160;
      visible = 3;
      gap = 14;
    } else if (viewportWidth >= 480) {
      cardWidth = 140;
      imageHeight = 140;
      visible = 2;
      gap = 12;
    } else {
      cardWidth = 120;
      imageHeight = 120;
      visible = 2;
      gap = 10;
    }

    const cardHeight = imageHeight + 76;

    return { width: cardWidth, height: cardHeight, visible, imageHeight, gap };
  };

  const { width: cardWidth, height: cardHeight, visible: visibleCards, imageHeight, gap } = getCardDimensions();

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -(cardWidth + gap),
        behavior: 'smooth'
      });
    }
    setScrollPosition(Math.max(0, scrollPosition - 1));
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: cardWidth + gap,
        behavior: 'smooth'
      });
    }
    setScrollPosition(Math.min(section.books.length - visibleCards, scrollPosition + 1));
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollPosition < section.books.length - visibleCards;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Section Header - Professional with subtle gradient accent */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white text-base sm:text-lg font-semibold mb-1 truncate">
              {section.name}
            </h3>
            <p className="text-blue-50 text-xs sm:text-sm font-medium">
              {section.books.length} {section.books.length === 1 ? 'livre' : 'livres'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={onEdit}
              className="p-2 bg-white/15 hover:bg-white/25 rounded-lg transition-colors duration-200"
              title="Modifier la section"
              aria-label="Modifier la section"
            >
              <Edit2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white/15 hover:bg-red-500 rounded-lg transition-colors duration-200"
              title="Supprimer la section"
              aria-label="Supprimer la section"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Content */}
      <div className="p-4 sm:p-5">
        {section.books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-300 rounded-lg">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <BookOpen className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium text-sm mb-2">Aucun livre dans cette section</p>
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-700 font-semibold text-xs hover:underline"
            >
              Ajouter des livres
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Left Arrow */}
            {canScrollLeft && (
              <button
                onClick={handleScrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-2 border border-gray-200"
                aria-label="Défiler vers la gauche"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}

            {/* Books Container */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab active:cursor-grabbing"
              style={{
                scrollBehavior: isDragging ? 'auto' : 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
            >
              <div
                className="flex"
                style={{
                  gap: `${gap}px`
                }}
              >
                {section.books.map((book) => (
                  <div
                    key={book.id}
                    className="flex-shrink-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200 group"
                    style={{
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`
                    }}
                  >
                    {/* Book Image Container */}
                    <div className="relative" style={{ height: `${imageHeight}px` }}>
                      {failedImages.has(book.id) ? (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                      ) : (
                        <img
                          src={getBookCoverUrl(book.id, failedImages.has(`${book.id}-placeholder`))}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            if (!failedImages.has(`${book.id}-placeholder`)) {
                              setFailedImages(prev => new Set(prev).add(`${book.id}-placeholder`));
                              e.target.src = getBookCoverUrl(book.id, true);
                            } else {
                              setFailedImages(prev => new Set(prev).add(book.id));
                            }
                          }}
                        />
                      )}

                      {/* Subtle Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Price Badge */}
                      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
                        {book.price} DZD
                      </div>

                      {/* Language Badge */}
                      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-0.5 rounded-md text-xs font-medium shadow-sm">
                        {book.language || 'N/A'}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveBook(book)}
                        className="absolute top-2 left-2 bg-red-500 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-md"
                        title="Retirer de la section"
                        aria-label="Retirer de la section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Book Content */}
                    <div className="p-2.5">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 mb-0.5 leading-snug" title={book.title}>
                        {book.title}
                      </h4>
                      <p className="text-gray-600 text-xs truncate" title={book.author}>
                        {book.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            {canScrollRight && (
              <button
                onClick={handleScrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-2 border border-gray-200"
                aria-label="Défiler vers la droite"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSectionManager;
