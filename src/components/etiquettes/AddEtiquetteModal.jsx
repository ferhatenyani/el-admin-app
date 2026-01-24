import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Loader2 } from 'lucide-react';
import ColorPicker from '../common/ColorPicker';
import useScrollLock from '../../hooks/useScrollLock';

/**
 * AddEtiquetteModal Component
 * Form modal for adding/editing an etiquette with name and color selection
 */
const AddEtiquetteModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    nameFr: '',
    nameEn: '',
    color: '#3B82F6',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  // Reset form when opening/closing modal or when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        nameFr: initialData.nameFr,
        nameEn: initialData.nameEn,
        color: initialData.colorHex || initialData.color || '#3B82F6',
      });
    } else {
      setFormData({
        nameFr: '',
        nameEn: '',
        color: '#3B82F6',
      });
    }
    setErrors({});
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

  const handleColorChange = (color) => {
    setFormData((prev) => ({ ...prev, color }));
    if (errors.color) {
      setErrors((prev) => ({ ...prev, color: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nameFr.trim()) {
      newErrors.nameFr = "Le nom français de l'étiquette est requis";
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = "Le nom anglais de l'étiquette est requis";
    }

    if (!formData.color || !/^#[0-9A-F]{6}$/i.test(formData.color)) {
      newErrors.color = 'Une couleur valide est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit({
          ...formData,
          nameFr: formData.nameFr.trim(),
          nameEn: formData.nameEn.trim(),
        });
      } finally {
        setIsSubmitting(false);
      }
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-pink-600 to-orange-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {initialData ? "Modifier l'étiquette" : 'Ajouter une nouvelle étiquette'}
                    </h2>
                    <p className="text-pink-100 mt-1 font-medium">
                      {initialData ? "Mettre à jour les informations de l'étiquette" : "Créez une étiquette pour organiser vos livres"}
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

              {/* Scrollable form content */}
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="p-6 space-y-6">
                  {/* Etiquette Name - French */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      Nom de l'étiquette (Français) *
                    </label>
                    <input
                      type="text"
                      name="nameFr"
                      value={formData.nameFr}
                      onChange={handleChange}
                      placeholder="ex: Nouveau, Bestseller, Promotion..."
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        errors.nameFr
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-pink-500'
                      }`}
                    />
                    {errors.nameFr && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.nameFr}
                      </motion.p>
                    )}
                  </div>

                  {/* Etiquette Name - English */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      Nom de l'étiquette (English) *
                    </label>
                    <input
                      type="text"
                      name="nameEn"
                      value={formData.nameEn}
                      onChange={handleChange}
                      placeholder="ex: New, Bestseller, Promotion..."
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        errors.nameEn
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-pink-500'
                      }`}
                    />
                    {errors.nameEn && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.nameEn}
                      </motion.p>
                    )}
                  </div>

                  {/* Color Picker */}
                  <div>
                    <ColorPicker
                      value={formData.color}
                      onChange={handleColorChange}
                      label="Couleur de l'étiquette *"
                    />
                    {errors.color && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.color}
                      </motion.p>
                    )}
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      Aperçu
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <Tag className="w-5 h-5 text-gray-400" />
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">FR:</span>
                            <span
                              className="px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-sm"
                              style={{ backgroundColor: formData.color }}
                            >
                              {formData.nameFr || 'Nom de l\'étiquette'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">EN:</span>
                            <span
                              className="px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-sm"
                              style={{ backgroundColor: formData.color }}
                            >
                              {formData.nameEn || 'Label name'}
                            </span>
                          </div>
                        </div>
                      </div>
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
                    className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-orange-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-orange-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting
                      ? (initialData ? 'Mise à jour...' : 'Création...')
                      : (initialData ? 'Mettre à jour' : "Créer l'étiquette")}
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

export default AddEtiquetteModal;
