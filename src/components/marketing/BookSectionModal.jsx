import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Search, Check, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';
import { getBookCoverUrl } from '../../services/booksApi';

const BookSectionModal = ({ isOpen, onClose, onSave, section, availableBooks, saving, totalSections = 0 }) => {
  const [nameEn, setNameEn] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const scrollContainerRef = useRef(null);
  const [failedImages, setFailedImages] = useState(new Set());

  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  // Max position: totalSections for editing (same pool), totalSections + 1 for creating
  const maxPosition = section ? totalSections : totalSections + 1;

  // Initialize form data when editing
  useEffect(() => {
    if (section) {
      setNameEn(section.nameEn || '');
      setNameFr(section.nameFr || '');
      setDisplayOrder(section.displayOrder != null ? section.displayOrder + 1 : 1);
      setSelectedBooks(section.books || []);
    } else {
      setNameEn('');
      setNameFr('');
      setDisplayOrder(maxPosition || 1);
      setSelectedBooks([]);
    }
    setErrors({});
    setSearchQuery('');
  }, [section, isOpen, maxPosition]);

  // Filter books based on search query
  const filteredBooks = (availableBooks || []).filter(book => {
    const authorName = typeof book?.author === 'string' ? book.author : book?.author?.name || '';
    return book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleToggleBook = (book) => {
    const isSelected = selectedBooks.some(b => b.id === book.id);
    if (isSelected) {
      setSelectedBooks(selectedBooks.filter(b => b.id !== book.id));
    } else {
      setSelectedBooks([...selectedBooks, book]);
      setErrors({ ...errors, books: '' });
    }
  };

  const isBookSelected = (bookId) => {
    return selectedBooks.some(b => b.id === bookId);
  };

  // Check scroll position and update scroll button visibility
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Update scroll buttons when books change
  useEffect(() => {
    checkScrollButtons();
  }, [filteredBooks]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 100);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!nameEn.trim()) {
      newErrors.nameEn = 'Le nom en anglais est requis';
    }

    if (!nameFr.trim()) {
      newErrors.nameFr = 'Le nom en français est requis';
    }

    if (!displayOrder || displayOrder < 1 || displayOrder > maxPosition) {
      newErrors.displayOrder = `La position doit être entre 1 et ${maxPosition}`;
    }

    if (selectedBooks.length === 0) {
      newErrors.books = 'Veuillez sélectionner au moins un livre';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        nameEn,
        nameFr,
        displayOrder: displayOrder - 1, // Convert to 0-indexed for backend
        books: selectedBooks
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Professional with color accent */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-white/15 p-2 rounded-lg flex-shrink-0">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                        {section ? 'Modifier la Section' : 'Nouvelle Section'}
                      </h2>
                      <p className="text-xs sm:text-sm text-blue-50 hidden sm:block">
                        Gérer les livres de la section carrousel
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/15 transition-colors flex-shrink-0"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Section Name Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* English Name Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom en Anglais <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => {
                        setNameEn(e.target.value);
                        setErrors({ ...errors, nameEn: '' });
                      }}
                      placeholder="ex: New Releases, Best Sellers..."
                      className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.nameEn
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.nameEn && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs mt-1.5 font-medium"
                      >
                        {errors.nameEn}
                      </motion.p>
                    )}
                  </div>

                  {/* French Name Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom en Français <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nameFr}
                      onChange={(e) => {
                        setNameFr(e.target.value);
                        setErrors({ ...errors, nameFr: '' });
                      }}
                      placeholder="ex: Nos Nouveautés, Meilleures Ventes..."
                      className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.nameFr
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.nameFr && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs mt-1.5 font-medium"
                      >
                        {errors.nameFr}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Display Order Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Position d'affichage <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={maxPosition}
                      value={displayOrder}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setDisplayOrder(isNaN(val) ? '' : val);
                        setErrors({ ...errors, displayOrder: '' });
                      }}
                      className={`w-24 px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.displayOrder
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      sur {maxPosition} {maxPosition <= 1 ? 'position' : 'positions'}
                    </span>
                  </div>
                  {errors.displayOrder && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs mt-1.5 font-medium"
                    >
                      {errors.displayOrder}
                    </motion.p>
                  )}
                </div>

                {/* Book Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Sélectionner les Livres <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-gray-500 font-medium">
                      {selectedBooks.length} {selectedBooks.length <= 1 ? 'livre' : 'livres'}
                    </span>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher par titre ou auteur..."
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Books Grid */}
                  <div className="relative border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
                    {/* Left Scroll Button */}
                    {showLeftScroll && (
                      <button
                        onClick={() => handleScroll('left')}
                        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white rounded-lg p-1.5 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                        aria-label="Défiler vers la gauche"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-700" />
                      </button>
                    )}

                    {/* Right Scroll Button */}
                    {showRightScroll && (
                      <button
                        onClick={() => handleScroll('right')}
                        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white rounded-lg p-1.5 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
                        aria-label="Défiler vers la droite"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-700" />
                      </button>
                    )}

                    <div
                      ref={scrollContainerRef}
                      onScroll={checkScrollButtons}
                      className="max-h-72 overflow-y-auto overflow-x-auto"
                    >
                      {filteredBooks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Aucun livre trouvé</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {filteredBooks.map((book) => {
                            const selected = isBookSelected(book.id);
                            return (
                              <div
                                key={book.id}
                                onClick={() => handleToggleBook(book)}
                                className={`relative rounded-lg border transition-all duration-200 ${
                                  selected
                                    ? 'cursor-pointer border-blue-500 bg-blue-50 shadow-sm'
                                    : 'cursor-pointer border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                                }`}
                              >
                                {/* Selection Indicator */}
                                {selected && (
                                  <div className="absolute top-1.5 right-1.5 bg-blue-600 text-white rounded-full p-0.5 z-10 shadow-sm">
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                )}

                                {/* Book Card */}
                                {failedImages.has(book.id) ? (
                                  <div className="w-full h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                                    <BookOpen className="w-7 h-7 text-gray-400" />
                                  </div>
                                ) : (
                                  <img
                                    src={getBookCoverUrl(book.id, failedImages.has(`${book.id}-placeholder`))}
                                    alt={book.title}
                                    className="w-full h-28 object-cover rounded-t-lg"
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
                                <div className="p-2.5">
                                  <h4 className="font-semibold text-xs text-gray-800 truncate mb-0.5" title={book.title}>
                                    {book.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 truncate mb-1" title={book.author?.name || book.author}>
                                    {book.author?.name || book.author}
                                  </p>
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="inline-block px-1.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                                      {book.language || 'N/A'}
                                    </span>
                                    <span className="text-xs font-semibold text-blue-600">
                                      {book.price} DZD
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {errors.books && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs mt-1.5 font-medium"
                    >
                      {errors.books}
                    </motion.p>
                  )}
                </div>

                {/* Selected Books Preview */}
                {selectedBooks.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                      Livres Sélectionnés
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedBooks.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1.5 rounded-lg text-xs"
                        >
                          <span className="truncate max-w-[120px] sm:max-w-[160px] font-medium">{book.title}</span>
                          <button
                            onClick={() => handleToggleBook(book)}
                            className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                            aria-label={`Retirer ${book.title}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2.5 px-4 py-4 sm:px-6 border-t bg-gray-50">
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <Loader className="w-4 h-4 animate-spin" />}
                  {saving ? 'Enregistrement...' : (section ? 'Mettre à Jour' : 'Créer')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookSectionModal;
