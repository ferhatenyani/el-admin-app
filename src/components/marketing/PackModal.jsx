import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Upload, Search, Check, BookOpen } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';
import { getBookCoverUrl } from '../../services/booksApi';

const PackModal = ({ isOpen, onClose, onSave, pack, availableBooks = [], saving = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    books: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      console.log('PackModal opened');
      console.log('Available books:', availableBooks);
      console.log('Pack data:', pack);
    }
  }, [isOpen, availableBooks, pack]);

  // Initialize form data when editing
  useEffect(() => {
    if (pack) {
      setFormData({
        name: pack.name || '',
        description: pack.description || '',
        price: pack.price || '',
        image: pack.image || '',
        coverUrl: pack.coverUrl || '', // Keep original coverUrl for updates
        books: pack.books || []
      });
      setImagePreview(pack.image || '');
      setCoverImageFile(null);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        books: []
      });
      setImagePreview('');
      setCoverImageFile(null);
    }
    setErrors({});
    setSearchQuery('');
    setIsSubmitting(false);
  }, [pack, isOpen]);

  // Filter books based on search query
  const filteredBooks = React.useMemo(() => {
    if (!Array.isArray(availableBooks)) {
      console.warn('availableBooks is not an array:', availableBooks);
      return [];
    }

    return availableBooks.filter(book => {
      if (!book) return false;

      const title = book.title || '';
      const author = book.author?.name || book.author || '';
      const searchLower = (searchQuery || '').toLowerCase();

      return title.toLowerCase().includes(searchLower) ||
             author.toLowerCase().includes(searchLower);
    });
  }, [availableBooks, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Veuillez sélectionner un fichier image valide' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'La taille de l\'image doit être inférieure à 5 MB' });
        return;
      }

      // Store the file for upload
      setCoverImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrors({ ...errors, image: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleBook = (book) => {
    const isSelected = formData.books.some(b => b.id === book.id);
    if (isSelected) {
      setFormData({
        ...formData,
        books: formData.books.filter(b => b.id !== book.id)
      });
    } else {
      setFormData({
        ...formData,
        books: [...formData.books, book]
      });
    }
    setErrors({ ...errors, books: '' });
  };

  const isBookSelected = (bookId) => {
    return formData.books.some(b => b.id === bookId);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du pack est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Veuillez entrer un prix valide';
    }

    // For new packs, image is required. For updates, it's optional
    if (!pack && !coverImageFile && !imagePreview) {
      newErrors.image = 'L\'image du pack est requise';
    }

    if (formData.books.length === 0) {
      newErrors.books = 'Veuillez sélectionner au moins un livre';
    } else if (formData.books.length < 2) {
      newErrors.books = 'Un pack doit contenir au moins 2 livres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare pack data
      const packData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        coverUrl: formData.coverUrl || '', // Keep original coverUrl for updates
        books: formData.books
      };

      // Call onSave with pack data and cover image file
      await onSave(packData, coverImageFile);
    } catch (error) {
      console.error('Error saving pack:', error);
      setErrors({
        ...errors,
        submit: 'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.'
      });
    } finally {
      setIsSubmitting(false);
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
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
              {/* Header - Professional with green accent */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-white/15 p-2 rounded-lg flex-shrink-0">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                        {pack ? 'Modifier le Pack' : 'Nouveau Pack'}
                      </h2>
                      <p className="text-xs sm:text-sm text-green-50 hidden sm:block">
                        Créer une offre groupée de livres
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
                {/* Pack Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom du Pack <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="ex: Pack Littérature Classique"
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs mt-1.5 font-medium"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Décrivez ce qui rend ce pack spécial..."
                    rows={3}
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.description
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  />
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs mt-1.5 font-medium"
                    >
                      {errors.description}
                    </motion.p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prix (DZD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="ex: 5000"
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.price
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  />
                  {errors.price && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs mt-1.5 font-medium"
                    >
                      {errors.price}
                    </motion.p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image du Pack <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Aperçu du pack"
                          className="w-28 h-28 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex-1">
                      <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all">
                        <Upload className="w-7 h-7 text-gray-400 mb-1.5" />
                        <span className="text-xs text-gray-500">Cliquer pour télécharger</span>
                        <span className="text-xs text-gray-400 mt-0.5">Max: 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  {errors.image && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs mt-1.5 font-medium"
                    >
                      {errors.image}
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
                      {formData.books.length} livre(s) (min: 2)
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
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Books Grid */}
                  <div className="border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50 max-h-64 overflow-y-auto">
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
                              className={`relative cursor-pointer rounded-lg border transition-all duration-200 ${
                                selected
                                  ? 'border-green-500 bg-green-50 shadow-sm'
                                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
                              }`}
                            >
                              {/* Selection Indicator */}
                              {selected && (
                                <div className="absolute top-1.5 right-1.5 bg-green-600 text-white rounded-full p-0.5 z-10 shadow-sm">
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
                                <p className="text-xs text-gray-500 truncate mb-1" title={book.author?.name || book.author || 'Auteur inconnu'}>
                                  {book.author?.name || book.author || 'Auteur inconnu'}
                                </p>
                                <div className="flex items-center justify-between gap-1">
                                  <span className="inline-block px-1.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                                    {book.language || 'N/A'}
                                  </span>
                                  <span className="text-xs font-semibold text-green-600">
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
                {formData.books.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                      Livres Sélectionnés
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.books.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-2.5 py-1.5 rounded-lg text-xs"
                        >
                          <span className="truncate max-w-[120px] sm:max-w-[160px] font-medium">{book.title}</span>
                          <button
                            onClick={() => handleToggleBook(book)}
                            className="hover:bg-green-100 rounded-full p-0.5 transition-colors"
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
              <div className="flex flex-col gap-2.5 px-4 py-4 sm:px-6 border-t bg-gray-50">
                {/* Error Message */}
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-xs"
                  >
                    {errors.submit}
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-2.5">
                  <button
                    onClick={onClose}
                    disabled={isSubmitting || saving}
                    className="px-5 py-2.5 text-sm border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || saving}
                    className="px-5 py-2.5 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {(isSubmitting || saving) && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {pack ? 'Mettre à Jour' : 'Créer le Pack'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PackModal;
