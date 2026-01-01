import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, BookOpen, Loader } from 'lucide-react';
import BookSectionModal from './BookSectionModal';
import Pagination from '../common/Pagination';
import usePagination from '../../hooks/usePagination';
import { createMainDisplay, updateMainDisplay, addBooksToMainDisplay, removeBooksFromMainDisplay } from '../../services/mainDisplayApi';
import { getBookCoverUrl } from '../../services/booksApi';

const BookSectionManager = ({ sections, setSections, availableBooks, onDeleteRequest, loading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedSections,
    handlePageChange,
    handleItemsPerPageChange,
    totalItems
  } = usePagination(sections, 5);

  const handleAddSection = () => {
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleDeleteSection = (section) => {
    onDeleteRequest('section', section);
  };

  const handleRemoveBookFromSection = async (sectionId, book) => {
    try {
      // Call API to remove book from main display
      await removeBooksFromMainDisplay(sectionId, [book.id]);

      // Update local state
      setSections(sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            books: section.books.filter(b => b.id !== book.id)
          };
        }
        return section;
      }));
    } catch (error) {
      console.error('Error removing book from section:', error);
      alert('Une erreur est survenue lors de la suppression du livre. Veuillez réessayer.');
    }
  };

  const handleSaveSection = async (sectionData) => {
    try {
      setSaving(true);

      if (editingSection) {
        // Update existing section
        const updatedSection = await updateMainDisplay(editingSection.id, {
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

        // Update local state with the complete data
        setSections(sections.map(s =>
          s.id === editingSection.id
            ? { ...updatedSection, books: sectionData.books }
            : s
        ));
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

        // Update local state
        setSections([...sections, { ...newSection, books: sectionData.books }]);
      }

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
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Add Section Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddSection}
          disabled={loading}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Ajouter une Section</span>
          <span className="xs:hidden">Ajouter</span>
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300">
          <Loader className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-blue-600 mb-2 sm:mb-3 animate-spin" />
          <p className="text-gray-500 text-base sm:text-lg px-2">Chargement des sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-2 sm:mb-3" />
          <p className="text-gray-500 text-base sm:text-lg px-2">Aucune section de livres pour le moment</p>
          <p className="text-gray-400 text-xs sm:text-sm px-2">Cliquez sur "Ajouter une Section" pour créer votre premier carrousel</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {paginatedSections.map((section) => (
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
          {sections.length > 0 && (
            <div className="mt-6">
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
      )}

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
    </div>
  );
};

// Section Card Component with Carousel Preview
const SectionCard = ({ section, onEdit, onDelete, onRemoveBook }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [failedImages, setFailedImages] = useState(new Set());

  // Baseline reference: 700px viewport = 170px width, 250px height
  const getCardDimensions = () => {
    if (typeof window === 'undefined') return {
      width: 170,
      height: 250,
      visible: 4,
      scale: 1,
      imageHeight: 180,
      gap: 12
    };

    const viewportWidth = window.innerWidth;
    const baselineViewport = 700;
    const baselineCardWidth = 170;
    const baselineCardHeight = 250;
    const baselineImageHeight = 180; // h-45 = 11.25rem = 180px
    const baselineGap = 12; // gap-3 = 0.75rem = 12px

    // Calculate scale factor based on viewport
    const scale = viewportWidth / baselineViewport;

    // Calculate scaled dimensions maintaining exact ratios
    const cardWidth = Math.round(baselineCardWidth * scale);
    const cardHeight = Math.round(baselineCardHeight * scale);
    const imageHeight = Math.round(baselineImageHeight * scale);
    const gap = Math.round(baselineGap * scale);

    // Determine visible cards based on viewport
    let visible = 4;
    if (viewportWidth < 640) visible = 2;
    else if (viewportWidth < 1024) visible = 3;
    else visible = 4;

    return {
      width: cardWidth,
      height: cardHeight,
      visible,
      scale,
      imageHeight,
      gap
    };
  };

  const { width: cardWidth, height: cardHeight, visible: visibleCards, scale, imageHeight, gap } = getCardDimensions();

  const handleScrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 1));
  };

  const handleScrollRight = () => {
    setScrollPosition(Math.min(section.books.length - visibleCards, scrollPosition + 1));
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollPosition < section.books.length - visibleCards;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">{section.name}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{section.books.length} livre(s) dans cette section</p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onEdit}
            className="p-1.5 sm:p-2 md:p-2.5 bg-white rounded-md sm:rounded-lg hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-100"
            title="Modifier la section"
          >
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 sm:p-2 md:p-2.5 bg-white rounded-md sm:rounded-lg hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-100"
            title="Supprimer la section"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Carousel Preview */}
      {section.books.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500 font-medium text-sm sm:text-base">Aucun livre dans cette section</p>
          <button
            onClick={onEdit}
            className="text-blue-600 hover:underline text-xs sm:text-sm mt-2 font-semibold"
          >
            Ajouter des livres à cette section
          </button>
        </div>
      ) : (
        <div className="relative" style={{ padding: `0 ${Math.round(24 * scale)}px` }}>
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={handleScrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-200 border border-gray-200"
              style={{ padding: `${Math.round(8 * scale)}px` }}
            >
              <ChevronLeft className="text-gray-700" style={{ width: `${Math.round(20 * scale)}px`, height: `${Math.round(20 * scale)}px` }} />
            </button>
          )}

          {/* Books Container */}
          <div className="overflow-hidden" style={{ padding: `${Math.round(8 * scale)}px 0` }}>
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                gap: `${gap}px`,
                transform: `translateX(-${scrollPosition * (cardWidth + gap)}px)`
              }}
            >
              {section.books.map((book) => {
                // Calculate scaled values based on baseline (700px viewport)
                const borderRadius = Math.round(12 * scale); // baseline: rounded-xl = 12px
                const badgePadding = Math.round(12 * scale); // baseline: px-3 py-1.5 = 12px 6px
                const badgePaddingY = Math.round(6 * scale);
                const badgeFontSize = Math.round(12 * scale); // baseline: text-xs = 12px
                const badgePosition = Math.round(8 * scale); // baseline: top-2 right-2 = 8px
                const buttonPadding = Math.round(8 * scale); // baseline: p-2 = 8px
                const iconSize = Math.round(16 * scale); // baseline: w-4 h-4 = 16px
                const contentPaddingX = Math.round(12 * scale); // baseline: px-3 = 12px
                const contentPaddingY = Math.round(8 * scale); // baseline: py-2 = 8px
                const titleFontSize = Math.round(14 * scale); // baseline: text-sm = 14px
                const authorFontSize = Math.round(12 * scale); // baseline: text-xs = 12px
                const contentMarginBottom = Math.round(4 * scale); // baseline: mb-1 = 4px

                return (
                  <div
                    key={book.id}
                    className="flex-shrink-0 bg-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200 flex flex-col"
                    style={{
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      borderRadius: `${borderRadius}px`
                    }}
                  >
                    {/* Book Image Container */}
                    <div>
                      <div className="relative overflow-hidden shadow-sm" style={{ height: `${imageHeight}px` }}>
                        {failedImages.has(book.id) ? (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-gray-400" />
                          </div>
                        ) : (
                          <img
                            src={getBookCoverUrl(book.id, failedImages.has(`${book.id}-placeholder`))}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              // Try placeholder if not already tried
                              if (!failedImages.has(`${book.id}-placeholder`)) {
                                setFailedImages(prev => new Set(prev).add(`${book.id}-placeholder`));
                                e.target.src = getBookCoverUrl(book.id, true);
                              } else {
                                // Both failed, show icon
                                setFailedImages(prev => new Set(prev).add(book.id));
                              }
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Price Badge */}
                        <div
                          className="absolute bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full font-bold shadow-md backdrop-blur-sm"
                          style={{
                            top: `${badgePosition}px`,
                            right: `${badgePosition}px`,
                            padding: `${badgePaddingY}px ${badgePadding}px`,
                            fontSize: `${badgeFontSize}px`
                          }}
                        >
                          {book.price} DZD
                        </div>

                        {/* Language Badge */}
                        <div
                          className="absolute bg-white/95 backdrop-blur-md rounded-full font-semibold text-gray-800 shadow-sm border border-blue-200"
                          style={{
                            bottom: `${badgePosition}px`,
                            left: `${badgePosition}px`,
                            padding: `${badgePaddingY}px ${badgePadding}px`,
                            fontSize: `${badgeFontSize}px`
                          }}
                        >
                          {book.language || 'N/A'}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveBook(book)}
                          className="absolute bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-md"
                          title="Retirer de la section"
                          style={{
                            top: `${badgePosition}px`,
                            left: `${badgePosition}px`,
                            padding: `${buttonPadding}px`
                          }}
                        >
                          <Trash2 style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                        </button>
                      </div>
                    </div>

                    {/* Book Content */}
                    <div
                      className="flex flex-col"
                      style={{
                        padding: `${contentPaddingY}px ${contentPaddingX}px ${contentPaddingY}px`
                      }}
                    >
                      <h4
                        className="font-bold text-gray-900 line-clamp-2"
                        title={book.title}
                        style={{
                          fontSize: `${titleFontSize}px`,
                          marginBottom: `${contentMarginBottom}px`
                        }}
                      >
                        {book.title}
                      </h4>
                      <p
                        className="text-gray-600 truncate"
                        title={book.author}
                        style={{ fontSize: `${authorFontSize}px` }}
                      >
                        {book.author}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={handleScrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-200 border border-gray-200"
              style={{ padding: `${Math.round(8 * scale)}px` }}
            >
              <ChevronRight className="text-gray-700" style={{ width: `${Math.round(20 * scale)}px`, height: `${Math.round(20 * scale)}px` }} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSectionManager;
