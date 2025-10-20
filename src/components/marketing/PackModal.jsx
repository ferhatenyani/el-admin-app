import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Upload, Search, Check } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';

const PackModal = ({ isOpen, onClose, onSave, pack, availableBooks }) => {
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

  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  // Initialize form data when editing
  useEffect(() => {
    if (pack) {
      setFormData({
        name: pack.name || '',
        description: pack.description || '',
        price: pack.price || '',
        image: pack.image || '',
        books: pack.books || []
      });
      setImagePreview(pack.image || '');
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        books: []
      });
      setImagePreview('');
    }
    setErrors({});
    setSearchQuery('');
  }, [pack, isOpen]);

  // Filter books based on search query
  const filteredBooks = availableBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        setErrors({ ...errors, image: 'Please select a valid image file' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 5MB' });
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
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
      newErrors.name = 'Pack name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.image) {
      newErrors.image = 'Pack image is required';
    }

    if (formData.books.length === 0) {
      newErrors.books = 'Please select at least one book';
    } else if (formData.books.length < 2) {
      newErrors.books = 'A pack must contain at least 2 books';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
        books: formData.books
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
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {pack ? 'Modifier le Pack' : 'Ajouter un Nouveau Pack'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Créer une offre spéciale ou un ensemble de livres groupés
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
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-green-500'
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
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.description
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  />
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
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
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.price
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  />
                  {errors.price && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
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
                  <div className="flex gap-4">
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Aperçu du pack"
                          className="w-32 h-32 object-cover rounded-xl border-2 border-gray-300"
                        />
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex-1">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Cliquez pour télécharger une image</span>
                        <span className="text-xs text-gray-400 mt-1">Taille max: 5MB</span>
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
                      className="text-red-500 text-sm mt-2"
                    >
                      {errors.image}
                    </motion.p>
                  )}
                </div>

                {/* Book Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sélectionner les Livres <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    {formData.books.length} livre(s) sélectionné(s) (minimum 2 requis)
                  </p>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher des livres par titre ou auteur..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Books Grid */}
                  <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 max-h-64 overflow-y-auto">
                    {filteredBooks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Aucun livre trouvé correspondant à votre recherche
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredBooks.map((book) => {
                          const selected = isBookSelected(book.id);
                          return (
                            <div
                              key={book.id}
                              onClick={() => handleToggleBook(book)}
                              className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                                selected
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 bg-white hover:border-green-300'
                              }`}
                            >
                              {/* Selection Indicator */}
                              {selected && (
                                <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-1">
                                  <Check className="w-4 h-4" />
                                </div>
                              )}

                              {/* Book Card */}
                              <img
                                src={book.image}
                                alt={book.title}
                                className="w-full h-32 object-cover rounded-t-lg"
                              />
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
                                <p className="text-sm font-bold text-green-600 mt-1">
                                  {book.price} DZD
                                </p>
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
                      className="text-red-500 text-sm mt-2"
                    >
                      {errors.books}
                    </motion.p>
                  )}
                </div>

                {/* Selected Books Preview */}
                {formData.books.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Aperçu des Livres Sélectionnés
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.books.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm"
                        >
                          <span className="truncate max-w-[150px]">{book.title}</span>
                          <button
                            onClick={() => handleToggleBook(book)}
                            className="hover:bg-green-200 rounded-full p-0.5"
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
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  {pack ? 'Mettre à Jour le Pack' : 'Créer le Pack'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PackModal;
