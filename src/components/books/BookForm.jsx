import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import UploadImageInput from '../common/UploadImageInput';
import CustomSelect from '../common/CustomSelect';
import useScrollLock from '../../hooks/useScrollLock';

const BookForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    language: '',
    price: '',
    stock: '',
    status: 'active',
    coverUrl: '',
  });

  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  const categoryOptions = [
    { value: '', label: 'Sélectionnez une catégorie' },
    { value: 'Fiction', label: 'Fiction' },
    { value: 'Non-Fiction', label: 'Non-Fiction' },
    { value: 'Technologie', label: 'Technologie' },
    { value: 'Science', label: 'Science' },
    { value: 'Biographie', label: 'Biographie' },
    { value: 'Développement personnel', label: 'Développement personnel' },
    { value: 'Psychologie', label: 'Psychologie' },
    { value: 'Business', label: 'Business' }
  ];

  const languageOptions = [
    { value: '', label: 'Sélectionnez une langue' },
    { value: 'Français', label: 'Français' },
    { value: 'Anglais', label: 'Anglais' },
    { value: 'Arabe', label: 'Arabe' },
    { value: 'Espagnol', label: 'Espagnol' },
    { value: 'Allemand', label: 'Allemand' },
    { value: 'Italien', label: 'Italien' },
    { value: 'Portugais', label: 'Portugais' },
    { value: 'Chinois', label: 'Chinois' },
    { value: 'Japonais', label: 'Japonais' },
    { value: 'Russe', label: 'Russe' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'out_of_stock', label: 'Rupture de stock' }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        author: '',
        category: '',
        language: '',
        price: '',
        stock: '',
        status: 'active',
        coverUrl: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    });
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
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                        placeholder="Nom de l'auteur"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Catégorie *
                      </label>
                      <CustomSelect
                        value={formData.category}
                        onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
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
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Statut *
                      </label>
                      <CustomSelect
                        value={formData.status}
                        onChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                        options={statusOptions}
                        placeholder="Sélectionnez un statut"
                      />
                    </div>

                    {/* Cover Image */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Image de couverture
                      </label>
                      <UploadImageInput
                        value={formData.coverUrl}
                        onChange={(url) => setFormData((prev) => ({ ...prev, coverUrl: url }))}
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
