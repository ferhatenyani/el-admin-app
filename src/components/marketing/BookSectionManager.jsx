import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import BookSectionModal from './BookSectionModal';
import Pagination from '../common/Pagination';
import usePagination from '../../hooks/usePagination';

const BookSectionManager = ({ sections, setSections, availableBooks, onDeleteRequest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

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

  const handleRemoveBookFromSection = (sectionId, book) => {
    onDeleteRequest('section-book', {
      sectionId,
      bookId: book.id,
      bookTitle: book.title
    });
  };

  const handleSaveSection = (sectionData) => {
    if (editingSection) {
      // Update existing section
      setSections(sections.map(s =>
        s.id === editingSection.id
          ? { ...sectionData, id: editingSection.id }
          : s
      ));
    } else {
      // Add new section
      const newSection = {
        ...sectionData,
        id: Date.now() // Simple ID generation
      };
      setSections([...sections, newSection]);
    }
    setIsModalOpen(false);
    setEditingSection(null);
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Add Section Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddSection}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Ajouter une Section</span>
          <span className="xs:hidden">Ajouter</span>
        </button>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
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
      />
    </div>
  );
};

// Section Card Component with Carousel Preview
const SectionCard = ({ section, onEdit, onDelete, onRemoveBook }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const cardWidth = 160; // Width of each book card (responsive)
  const visibleCards = typeof window !== 'undefined' && window.innerWidth < 640 ? 2 : 4; // 2 on mobile, 4 on larger screens

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
        <div className="relative px-4 sm:px-6 md:px-8">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={handleScrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 sm:p-2 md:p-2.5 shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-200 border border-gray-200"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
            </button>
          )}

          {/* Books Container */}
          <div className="overflow-hidden py-2 sm:py-3 md:py-4">
            <div
              className="flex gap-2 sm:gap-3 md:gap-5 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${scrollPosition * (cardWidth + (window.innerWidth < 640 ? 8 : 20))}px)` }}
            >
              {section.books.map((book) => (
                <div
                  key={book.id}
                  className="flex-shrink-0 bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200 flex flex-col"
                  style={{ width: `${cardWidth}px` }}
                >
                  {/* Book Image Container with Padding */}
                  <div className="p-2 sm:p-3 md:p-4">
                    <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden rounded-lg sm:rounded-xl shadow-sm">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Price Badge */}
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-bold text-[10px] sm:text-xs shadow-md backdrop-blur-sm">
                        {book.price} DZD
                      </div>

                      {/* Language Badge */}
                      <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-white/95 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold text-gray-800 shadow-sm border border-blue-200">
                        {book.language || 'N/A'}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveBook(book)}
                        className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-red-500 text-white rounded-full p-1.5 sm:p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-md"
                        title="Retirer de la section"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Book Content */}
                  <div className="px-2 pb-2 sm:px-3 sm:pb-3 md:px-4 md:pb-4 flex flex-col flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 mb-1 min-h-[2rem] sm:min-h-[2.5rem]" title={book.title}>
                      {book.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-600 truncate mb-1 sm:mb-2" title={book.author}>
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
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 sm:p-2 md:p-2.5 shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-200 border border-gray-200"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSectionManager;
