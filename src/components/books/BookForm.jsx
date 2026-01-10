import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import UploadImageInput from '../common/UploadImageInput';
import CustomSelect from '../common/CustomSelect';
import useScrollLock from '../../hooks/useScrollLock';
import * as authorsApi from '../../services/authorsApi';
import * as tagsApi from '../../services/tagsApi';
import * as etiquettesApi from '../../services/etiquettesApi';
import { getBookCoverUrl } from '../../services/booksApi';

// Language code mapping: Backend codes ↔ Form values
const LANGUAGE_CODE_TO_FORM = {
  'FR': 'FRENCH',
  'EN': 'ENGLISH',
  'AR': 'ARABIC'
};

const LANGUAGE_FORM_TO_CODE = {
  'FRENCH': 'FR',
  'ENGLISH': 'EN',
  'ARABIC': 'AR'
};

const BookForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    authorId: null,
    categoryId: null,
    language: '',
    price: '',
    stockQuantity: '',
    description: '',
    etiquetteId: null,
    coverImage: null,
  });

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [etiquettes, setEtiquettes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  // Fetch authors and categories when modal opens
  useEffect(() => {
    const fetchFormData = async () => {
      if (!isOpen) return;

      setLoading(true);
      setError(null);

      try {
        const [authorsRes, categoriesRes, etiquettesRes] = await Promise.all([
          authorsApi.getAuthors({ page: 0, size: 100 }),
          tagsApi.getTagsByType('CATEGORY', { page: 0, size: 100 }),
          etiquettesApi.getEtiquettes({ page: 0, size: 100 })
        ]);

        setAuthors(authorsRes.content || authorsRes);
        setCategories(categoriesRes.content || categoriesRes);
        setEtiquettes(etiquettesRes.content || etiquettesRes);
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load authors, categories, and etiquettes');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [isOpen]);

  // Build dropdown options from API data
  const authorOptions = [
    { value: '', label: 'Sélectionnez un auteur' },
    ...authors.map(author => ({
      value: author.id,
      label: author.name
    }))
  ];

  const categoryOptions = [
    { value: '', label: 'Sélectionnez une catégorie' },
    ...categories.map(category => ({
      value: category.id,
      label: category.nameFr
    }))
  ];

  const languageOptions = [
    { value: '', label: 'Sélectionnez une langue' },
    { value: 'FRENCH', label: 'Français' },
    { value: 'ENGLISH', label: 'Anglais' },
    { value: 'ARABIC', label: 'Arabe' }
  ];

  const etiquetteOptions = [
    { value: '', label: 'Sélectionnez une étiquette' },
    ...etiquettes.map(etiquette => ({
      value: etiquette.id,
      label: etiquette.nameFr || etiquette.nameEn
    }))
  ];

  useEffect(() => {
    if (initialData) {
      // Convert backend language code to form value
      const backendLang = initialData.language || '';
      const formLang = LANGUAGE_CODE_TO_FORM[backendLang] || backendLang;

      // Extract nested properties from full book object
      const normalizedData = {
        id: initialData.id,
        title: initialData.title || '',
        authorId: initialData.author?.id || initialData.authorId || null,
        categoryId: initialData.tags?.find(t => t.type === 'CATEGORY')?.id || initialData.categoryId || null,
        etiquetteId: initialData.tags?.find(t => t.type === 'ETIQUETTE')?.id || initialData.etiquetteId || null,
        language: formLang,
        price: initialData.price || '',
        stockQuantity: initialData.stockQuantity || '',
        description: initialData.description || '',
        coverImage: null, // Don't prefill file input
        imageUrl: initialData.imageUrl || initialData.coverImageUrl || null, // For existing image preview
      };
      setFormData(normalizedData);
    } else {
      setFormData({
        title: '',
        authorId: null,
        categoryId: null,
        language: '',
        price: '',
        stockQuantity: '',
        description: '',
        etiquetteId: null,
        coverImage: null,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert form language value back to backend code
    const backendLanguage = LANGUAGE_FORM_TO_CODE[formData.language] || formData.language;

    // Build book data object matching backend structure
    const bookData = {
      title: formData.title,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity, 10),
      language: backendLanguage,
      active: true,
      description: formData.description || '',
    };

    // Add author reference if selected
    if (formData.authorId) {
      bookData.author = { id: formData.authorId };
    }

    // Pass book data, cover image, categoryId, and etiquetteId separately
    onSubmit(bookData, formData.coverImage, formData.categoryId, formData.etiquetteId);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - covers entire viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal - centered in viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {initialData ? 'Modifier le livre' : 'Ajouter un nouveau livre'}
                    </h2>
                    <p className="text-blue-100 mt-1 font-medium">
                      {initialData ? 'Mettre à jour les informations du livre' : 'Remplissez les informations du livre'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Scrollable Form Content */}
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Titre *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Entrez le titre du livre"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Auteur *
                      </label>
                      <CustomSelect
                        value={formData.authorId}
                        onChange={(value) => setFormData((prev) => ({ ...prev, authorId: value }))}
                        options={authorOptions}
                        placeholder="Sélectionnez un auteur"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Catégorie *
                      </label>
                      <CustomSelect
                        value={formData.categoryId}
                        onChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                        options={categoryOptions}
                        placeholder="Sélectionnez une catégorie"
                        required
                      />
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Langue *
                      </label>
                      <CustomSelect
                        value={formData.language}
                        onChange={(value) => setFormData((prev) => ({ ...prev, language: value }))}
                        options={languageOptions}
                        placeholder="Sélectionnez une langue"
                        required
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Prix (€) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Stock *
                      </label>
                      <input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        required
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Etiquette */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Étiquette
                      </label>
                      <CustomSelect
                        value={formData.etiquetteId}
                        onChange={(value) => setFormData((prev) => ({ ...prev, etiquetteId: value }))}
                        options={etiquetteOptions}
                        placeholder="Sélectionnez une étiquette"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Entrez une description du livre"
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Cover Image */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Image de couverture
                      </label>
                      <UploadImageInput
                        value={formData.coverImage}
                        onChange={(file) => setFormData((prev) => ({ ...prev, coverImage: file }))}
                        existingImageUrl={initialData?.imageUrl}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions - Fixed at bottom */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-100 border border-gray-300 transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {initialData ? 'Mettre à jour' : 'Créer le livre'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default BookForm;
