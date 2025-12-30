import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import UploadImageInput from '../common/UploadImageInput';
import useScrollLock from '../../hooks/useScrollLock';

/**
 * AddAuthorModal Component
 * Formulaire modal pour ajouter un nouvel auteur avec nom, bio et image
 */
const AddAuthorModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({});

  // Verrouiller le défilement de l'arrière-plan lorsque le modal est ouvert
  useScrollLock(isOpen);

  // Réinitialiser le formulaire lors de l'ouverture/fermeture du modal ou du changement de initialData
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        imageUrl: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur pour ce champ lorsque l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'auteur est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        name: formData.name.trim(),
      });
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - couvre tout le viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal - centré dans le viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* En-tête avec dégradé */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {initialData ? 'Modifier l\'auteur' : 'Ajouter un nouvel auteur'}
                    </h2>
                    <p className="text-emerald-100 mt-1 font-medium">
                      {initialData ? 'Mettre à jour les informations de l\'auteur' : 'Remplissez les informations de l\'auteur'}
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

              {/* Contenu du formulaire défilable */}
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="p-6 space-y-6">
                  {/* Author Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      Nom de l'auteur *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="ex: Victor Hugo"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        errors.name
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Author Image */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                      Image de l'auteur (Optionnel)
                    </label>
                    <UploadImageInput
                      value={formData.imageUrl}
                      onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                      label="Télécharger l'image de l'auteur"
                      existingImageUrl={initialData?.imageUrl}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Téléchargez une image ou fournissez une URL pour cet auteur
                    </p>
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
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {initialData ? 'Mettre à jour' : 'Créer l\'auteur'}
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

export default AddAuthorModal;
