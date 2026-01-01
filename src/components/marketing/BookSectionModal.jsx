import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Search, Check, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';
import { getBookCoverUrl } from '../../services/booksApi';

const BookSectionModal = ({ isOpen, onClose, onSave, section, availableBooks, saving }) => {
  const [sectionName, setSectionName] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const scrollContainerRef = useRef(null);
  const [failedImages, setFailedImages] = useState(new Set());

  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  // Initialize form data when editing
  useEffect(() => {
    if (section) {
      setSectionName(section.name || '');
      setSelectedBooks(section.books || []);
    } else {
      setSectionName('');
      setSelectedBooks([]);
    }
    setErrors({});
    setSearchQuery('');
  }, [section, isOpen]);

  // Filter books based on search query
  const filteredBooks = (availableBooks || []).filter(book =>
    book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book?.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleBook = (book) => {
    const isSelected = selectedBooks.some(b => b.id === book.id);
    if (isSelected) {
      setSelectedBooks(selectedBooks.filter(b => b.id !== book.id));
    } else {
      // Check if we've reached the maximum limit
      if (selectedBooks.length >= 9) {
        setErrors({ ...errors, books: 'Vous ne pouvez sélectionner que 9 livres maximum par section' });
        return;
      }
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

    if (!sectionName.trim()) {
      newErrors.name = 'Section name is required';
    }

    if (selectedBooks.length === 0) {
      newErrors.books = 'Please select at least one book';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        name: sectionName,
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
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {section ? 'Modifier la Section' : 'Ajouter une Nouvelle Section'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Créer une section carrousel pour la page d'accueil
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Section Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la Section <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={sectionName}
                    onChange={(e) => {
                      setSectionName(e.target.value);
                      setErrors({ ...errors, name: '' });
                    }}
                    placeholder="ex: Nos Nouveautés, Meilleures Ventes, etc."
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Book Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sélectionner les Livres <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    {selectedBooks.length} livre(s) sélectionné(s) (maximum 9)
                  </p>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher des livres par titre ou auteur..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Books Grid */}
                  <div className="relative border border-gray-300 rounded-xl p-4 bg-gray-50">
                    {/* Left Scroll Button */}
                    {showLeftScroll && (
                      <button
                        onClick={() => handleScroll('left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-200 border border-gray-200"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                    )}

                    {/* Right Scroll Button */}
                    {showRightScroll && (
                      <button
                        onClick={() => handleScroll('right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-200 border border-gray-200"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    )}

                    <div
                      ref={scrollContainerRef}
                      onScroll={checkScrollButtons}
                      className="max-h-80 overflow-y-auto overflow-x-auto"
                    >
                      {filteredBooks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Aucun livre trouvé correspondant à votre recherche
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {filteredBooks.map((book) => {
                            const selected = isBookSelected(book.id);
                            const isDisabled = !selected && selectedBooks.length >= 9;
                            return (
                              <div
                                key={book.id}
                                onClick={() => !isDisabled && handleToggleBook(book)}
                                className={`relative rounded-lg border-2 transition-all duration-200 ${
                                  isDisabled
                                    ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-100'
                                    : selected
                                    ? 'cursor-pointer border-blue-500 bg-blue-50 hover:shadow-md'
                                    : 'cursor-pointer border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                                }`}
                              >
                                {/* Selection Indicator */}
                                {selected && (
                                  <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                                    <Check className="w-4 h-4" />
                                  </div>
                                )}

                                {/* Book Card */}
                                {failedImages.has(book.id) ? (
                                  <div className="w-full h-32 bg-gray-200 rounded-t-lg flex items-center justify-center">
                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                  </div>
                                ) : (
                                  <img
                                    src={getBookCoverUrl(book.id, failedImages.has(`${book.id}-placeholder`))}
                                    alt={book.title}
                                    className="w-full h-32 object-cover rounded-t-lg"
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
                                <div className="p-3">
                                  <h4 className="font-semibold text-sm text-gray-800 truncate" title={book.title}>
                                    {book.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 truncate" title={book.author}>
                                    {book.author}
                                  </p>
                                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                    {book.language || 'Langue inconnue'}
                                  </span>
                                  <p className="text-sm font-bold text-blue-600 mt-1">
                                    {book.price} DZD
                                  </p>
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
                      className="text-red-500 text-sm mt-2"
                    >
                      {errors.books}
                    </motion.p>
                  )}
                </div>

                {/* Selected Books Preview */}
                {selectedBooks.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Aperçu des Livres Sélectionnés
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedBooks.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm"
                        >
                          <span className="truncate max-w-[150px]">{book.title}</span>
                          <button
                            onClick={() => handleToggleBook(book)}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                  {saving && <Loader className="w-5 h-5 animate-spin" />}
                  {saving ? 'Enregistrement...' : (section ? 'Mettre à Jour la Section' : 'Créer la Section')}
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
