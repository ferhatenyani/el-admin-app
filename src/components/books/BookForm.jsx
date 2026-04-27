import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Tag, Percent, BadgeDollarSign, Eye, EyeOff } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import UploadImageInput from '../common/UploadImageInput';
import CustomSelect from '../common/CustomSelect';
import InlineMDInput from '../common/InlineMDInput';
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
    preorderDate: '',
    description: '',
    etiquetteId: null,
    coverImage: null,
    deliveryFee: '',
    automaticDeliveryFee: false,
    onSale: false,
    discountType: 'PERCENTAGE',
    discountValue: '',
    visibleInCatalog: true,
  });

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [etiquettes, setEtiquettes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const authorOptions = authors.map(author => ({
    value: author.id,
    label: author.name
  }));

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.nameFr
  }));

  const languageOptions = [
    { value: 'FRENCH', label: 'Français' },
    { value: 'ENGLISH', label: 'Anglais' },
    { value: 'ARABIC', label: 'Arabe' }
  ];

  const etiquetteOptions = etiquettes.map(etiquette => ({
    value: etiquette.id,
    label: etiquette.nameFr || etiquette.nameEn
  }));

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
        price: initialData.price ?? '',
        stockQuantity: initialData.stockQuantity ?? '',
        preorderDate: initialData.preorderDate ?? '',
        description: initialData.description || '',
        coverImage: null, // Don't prefill file input
        imageUrl: initialData.imageUrl || initialData.coverImageUrl || null, // For existing image preview
        deliveryFee: initialData.deliveryFee ?? '',
        automaticDeliveryFee: initialData.automaticDeliveryFee || false,
        onSale: initialData.onSale || false,
        discountType: initialData.discountType || 'PERCENTAGE',
        discountValue: initialData.discountValue ?? '',
        visibleInCatalog: initialData.visibleInCatalog ?? true,
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
        preorderDate: '',
        description: '',
        etiquetteId: null,
        coverImage: null,
        deliveryFee: '',
        automaticDeliveryFee: false,
        onSale: false,
        discountType: 'PERCENTAGE',
        discountValue: '',
        visibleInCatalog: true,
      });
    }
    setErrors({});
    setImageRemoved(false); // Reset image removal state when modal opens/closes
    setIsSubmitting(false); // Reset submitting state when modal opens/closes
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Le titre doit contenir au moins 2 caractères';
    }

    // Author validation
    if (!formData.authorId) {
      newErrors.authorId = 'Veuillez sélectionner un auteur';
    }

    // Category validation
    if (!formData.categoryId) {
      newErrors.categoryId = 'Veuillez sélectionner une catégorie';
    }

    // Language validation
    if (!formData.language) {
      newErrors.language = 'Veuillez sélectionner une langue';
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Le prix est requis';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    // Stock validation
    if (formData.stockQuantity === '' || formData.stockQuantity === null) {
      newErrors.stockQuantity = 'La quantité en stock est requise';
    } else if (parseInt(formData.stockQuantity, 10) < 0) {
      newErrors.stockQuantity = 'La quantité ne peut pas être négative';
    }

    // Cover image validation (required)
    if (!formData.coverImage && !initialData?.imageUrl) {
      newErrors.coverImage = 'Veuillez télécharger une image de couverture';
    }

    // Discount validation
    if (formData.onSale) {
      if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
        newErrors.discountValue = 'Veuillez entrer une valeur de remise valide';
      } else if (formData.discountType === 'PERCENTAGE' && parseFloat(formData.discountValue) >= 100) {
        newErrors.discountValue = 'La remise en pourcentage doit être inférieure à 100%';
      } else if (formData.discountType === 'FIXED_AMOUNT' && parseFloat(formData.discountValue) >= parseFloat(formData.price || 0)) {
        newErrors.discountValue = 'La remise fixe doit être inférieure au prix du livre';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert form language value back to backend code
      const backendLanguage = LANGUAGE_FORM_TO_CODE[formData.language] || formData.language;

      // Build book data object matching backend structure
      const bookData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        language: backendLanguage,
        active: true,
        description: formData.description.trim() || '',
        automaticDeliveryFee: formData.automaticDeliveryFee,
        deliveryFee: formData.automaticDeliveryFee ? 0 : (parseFloat(formData.deliveryFee) || 0),
        preorderDate: formData.preorderDate || null,
        onSale: formData.onSale,
        discountType: formData.onSale ? formData.discountType : null,
        discountValue: formData.onSale ? parseFloat(formData.discountValue) : null,
        // visibleInCatalog is immutable after creation — only set on create
        ...(!initialData && { visibleInCatalog: formData.visibleInCatalog }),
      };

      // Add author reference if selected
      if (formData.authorId) {
        bookData.author = { id: formData.authorId };
      }

      // Pass book data, cover image, categoryId, and etiquetteId separately
      await onSubmit(bookData, formData.coverImage, formData.categoryId, formData.etiquetteId);
    } finally {
      setIsSubmitting(false);
    }
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
                      <InlineMDInput
                        value={formData.title}
                        onChange={(value) => {
                          setFormData((prev) => ({ ...prev, title: value }));
                          if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                        }}
                        placeholder="Entrez le titre du livre"
                        error={errors.title}
                      />
                      {errors.title && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.title}
                        </motion.p>
                      )}
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Auteur *
                      </label>
                      <CustomSelect
                        value={formData.authorId}
                        onChange={(value) => {
                          setFormData((prev) => ({ ...prev, authorId: value }));
                          if (errors.authorId) {
                            setErrors((prev) => ({ ...prev, authorId: '' }));
                          }
                        }}
                        options={authorOptions}
                        placeholder="Sélectionnez un auteur"
                        error={errors.authorId}
                        alwaysVisibleSearch={true}
                      />
                      {errors.authorId && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.authorId}
                        </motion.p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Catégorie *
                      </label>
                      <CustomSelect
                        value={formData.categoryId}
                        onChange={(value) => {
                          setFormData((prev) => ({ ...prev, categoryId: value }));
                          if (errors.categoryId) {
                            setErrors((prev) => ({ ...prev, categoryId: '' }));
                          }
                        }}
                        options={categoryOptions}
                        placeholder="Sélectionnez une catégorie"
                        error={errors.categoryId}
                        alwaysVisibleSearch={true}
                      />
                      {errors.categoryId && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.categoryId}
                        </motion.p>
                      )}
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Langue *
                      </label>
                      <CustomSelect
                        value={formData.language}
                        onChange={(value) => {
                          setFormData((prev) => ({ ...prev, language: value }));
                          if (errors.language) {
                            setErrors((prev) => ({ ...prev, language: '' }));
                          }
                        }}
                        options={languageOptions}
                        placeholder="Sélectionnez une langue"
                        error={errors.language}
                        alwaysVisibleSearch={true}
                      />
                      {errors.language && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.language}
                        </motion.p>
                      )}
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Prix (DZD) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                          errors.price
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {errors.price && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.price}
                        </motion.p>
                      )}
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
                        placeholder="0"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                          errors.stockQuantity
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {errors.stockQuantity && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.stockQuantity}
                        </motion.p>
                      )}
                    </div>

                    {/* Preorder Date */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Date de précommande
                      </label>
                      <input
                        type="date"
                        name="preorderDate"
                        value={formData.preorderDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Disponibilité affichée si stock = 0
                      </p>
                    </div>

                    {/* Delivery Fee */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Frais de livraison (DZD)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          step="0.01"
                          name="deliveryFee"
                          value={formData.deliveryFee}
                          onChange={handleChange}
                          placeholder="0.00"
                          disabled={formData.automaticDeliveryFee}
                          className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 border-gray-300 focus:ring-blue-500 ${
                            formData.automaticDeliveryFee ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                          }`}
                        />
                        <label className="flex items-center gap-2 cursor-pointer select-none whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={formData.automaticDeliveryFee}
                            onChange={(e) => setFormData((prev) => ({ ...prev, automaticDeliveryFee: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Auto</span>
                        </label>
                      </div>
                    </div>

                    {/* Promotion */}
                    <div className="md:col-span-2">
                      <div className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                        formData.onSale
                          ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}>
                        {/* Toggle Header */}
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors duration-200 ${
                              formData.onSale ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                              <Tag className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Promotion</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formData.onSale ? 'Ce livre est en promotion' : 'Activer une remise sur ce livre'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              onSale: !prev.onSale,
                              discountValue: !prev.onSale ? prev.discountValue : '',
                            }))}
                            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              formData.onSale ? 'bg-orange-500' : 'bg-gray-300'
                            }`}
                          >
                            <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              formData.onSale ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        {/* Discount Fields - visible when onSale is true */}
                        {formData.onSale && (
                          <div className="px-4 pb-4 space-y-3 border-t border-orange-200">
                            <div className="grid grid-cols-2 gap-3 pt-3">
                              {/* Discount Type Selector */}
                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                                  Type de remise
                                </label>
                                <div className="flex rounded-lg overflow-hidden border border-gray-300">
                                  <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, discountType: 'PERCENTAGE' }))}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                                      formData.discountType === 'PERCENTAGE'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white text-gray-600 hover:bg-orange-50'
                                    }`}
                                  >
                                    <Percent className="w-3.5 h-3.5" />
                                    Pourcentage
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, discountType: 'FIXED_AMOUNT' }))}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold border-l border-gray-300 transition-colors duration-150 ${
                                      formData.discountType === 'FIXED_AMOUNT'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white text-gray-600 hover:bg-orange-50'
                                    }`}
                                  >
                                    <BadgeDollarSign className="w-3.5 h-3.5" />
                                    Montant fixe
                                  </button>
                                </div>
                              </div>

                              {/* Discount Value */}
                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                                  {formData.discountType === 'PERCENTAGE' ? 'Remise (%)' : 'Remise (DZD)'}
                                </label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    step={formData.discountType === 'PERCENTAGE' ? '1' : '0.01'}
                                    min="0"
                                    max={formData.discountType === 'PERCENTAGE' ? '99' : undefined}
                                    value={formData.discountValue}
                                    onChange={(e) => {
                                      setFormData(prev => ({ ...prev, discountValue: e.target.value }));
                                      if (errors.discountValue) setErrors(prev => ({ ...prev, discountValue: '' }));
                                    }}
                                    placeholder={formData.discountType === 'PERCENTAGE' ? 'ex: 20' : 'ex: 500'}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                                      errors.discountValue
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-orange-400'
                                    }`}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                                    {formData.discountType === 'PERCENTAGE' ? '%' : 'DZD'}
                                  </span>
                                </div>
                                {errors.discountValue && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-xs text-red-600"
                                  >
                                    {errors.discountValue}
                                  </motion.p>
                                )}
                              </div>
                            </div>

                            {/* Price Preview */}
                            {formData.price && formData.discountValue && parseFloat(formData.discountValue) > 0 && (
                              <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-orange-200">
                                <div className="text-sm text-gray-500 line-through font-medium">
                                  {parseFloat(formData.price).toFixed(2)} DZD
                                </div>
                                <span className="text-orange-400 font-bold">→</span>
                                <div className="text-base font-bold text-orange-600">
                                  {(() => {
                                    const price = parseFloat(formData.price);
                                    const val = parseFloat(formData.discountValue);
                                    if (isNaN(price) || isNaN(val)) return '—';
                                    if (formData.discountType === 'PERCENTAGE') {
                                      return Math.max(0, price * (1 - val / 100)).toFixed(2) + ' DZD';
                                    }
                                    return Math.max(0, price - val).toFixed(2) + ' DZD';
                                  })()}
                                </div>
                                <div className="ml-auto bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                  {formData.discountType === 'PERCENTAGE'
                                    ? `-${formData.discountValue}%`
                                    : `-${formData.discountValue} DZD`}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visibilité catalogue */}
                    <div className="md:col-span-2">
                      {initialData ? (
                        /* Edit mode: read-only badge */
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Visibilité catalogue</span>
                          {formData.visibleInCatalog ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                              <Eye className="w-3.5 h-3.5" />
                              Visible dans le catalogue
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                              <EyeOff className="w-3.5 h-3.5" />
                              Pack uniquement
                            </span>
                          )}
                          <span className="text-xs text-gray-400 italic">Non modifiable après création</span>
                        </div>
                      ) : (
                        /* Create mode: interactive toggle */
                        <div className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                          !formData.visibleInCatalog
                            ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50'
                            : 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50'
                        }`}>
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg transition-colors duration-200 ${
                                formData.visibleInCatalog ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                              }`}>
                                {formData.visibleInCatalog ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Visibilité catalogue</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {formData.visibleInCatalog
                                    ? 'Ce livre sera affiché dans le catalogue'
                                    : 'Ce livre ne sera pas affiché dans le catalogue. Il peut être utilisé dans des packs uniquement.'}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, visibleInCatalog: !prev.visibleInCatalog }))}
                              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                formData.visibleInCatalog ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                            >
                              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                formData.visibleInCatalog ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                        </div>
                      )}
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
                        alwaysVisibleSearch={true}
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Description
                      </label>
                      <div data-color-mode="light" className="rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
                        <MDEditor
                          value={formData.description}
                          onChange={(value) => setFormData((prev) => ({ ...prev, description: value || '' }))}
                          preview="live"
                          height={280}
                          style={{ borderRadius: 0 }}
                        />
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Image de couverture *
                      </label>
                      <UploadImageInput
                        value={formData.coverImage}
                        onChange={(file) => {
                          if (file) {
                            // Validate file type
                            if (!file.type.startsWith('image/')) {
                              setErrors((prev) => ({ ...prev, coverImage: 'Veuillez sélectionner un fichier image valide' }));
                              return;
                            }

                            // Validate file size (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              setErrors((prev) => ({ ...prev, coverImage: 'La taille de l\'image doit être inférieure à 5MB' }));
                              return;
                            }

                            // Reset imageRemoved when new file is selected
                            setImageRemoved(false);
                          } else {
                            // Mark image as removed when null is passed
                            setImageRemoved(true);
                          }

                          setFormData((prev) => ({ ...prev, coverImage: file }));
                          if (errors.coverImage) {
                            setErrors((prev) => ({ ...prev, coverImage: '' }));
                          }
                        }}
                        existingImageUrl={!imageRemoved ? initialData?.imageUrl : null}
                      />
                      {errors.coverImage && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.coverImage}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions - Fixed at bottom */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-100 border border-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting
                      ? (initialData ? 'Mise à jour...' : 'Création...')
                      : (initialData ? 'Mettre à jour' : 'Créer le livre')}
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
