import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Upload, Trash2, Save, Shield } from 'lucide-react';
import ChangePasswordForm from './ChangePasswordForm';
import useScrollLock from '../../hooks/useScrollLock';

/**
 * EditProfileModal Component
 * Modal for editing admin profile information and changing password
 */
const EditProfileModal = ({ isOpen, onClose, admin, onSaveProfile, onChangePassword, initialTab = 'profile' }) => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    profileImage: admin?.profileImage || ''
  });
  const [previewImage, setPreviewImage] = useState(admin?.profileImage || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordFormRef = useRef(null);

  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  // Reset form when modal opens/closes or admin changes
  useEffect(() => {
    if (isOpen && admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        profileImage: admin.profileImage || ''
      });
      setPreviewImage(admin.profileImage || '');
      setActiveTab(initialTab);
      setErrors({});
    }
  }, [isOpen, admin, initialTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profileImage: 'Veuillez sélectionner un fichier image valide' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'La taille de l\'image doit être inférieure à 5MB' }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
        setErrors(prev => ({ ...prev, profileImage: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    setFormData(prev => ({ ...prev, profileImage: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'e-mail est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse e-mail valide';
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
      await onSaveProfile(formData);

      // Show success and close after delay
      setTimeout(() => {
        onClose();
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (passwordData) => {
    setIsSubmitting(true);
    try {
      await onChangePassword(passwordData);

      // Show success and close after delay
      setTimeout(() => {
        onClose();
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error changing password:', error);
      setIsSubmitting(false);
    }
  };

  if (!admin) return null;

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30">
                <div className="flex-1 min-w-0 pr-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Modifier le Profil</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Mettez à jour vos informations et paramètres</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50/50">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-3 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold transition-all relative ${
                    activeTab === 'profile'
                      ? 'text-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Informations du profil</span>
                    <span className="sm:hidden">Profil</span>
                  </div>
                  {activeTab === 'profile' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`flex-1 px-3 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold transition-all relative ${
                    activeTab === 'password'
                      ? 'text-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Changer le mot de passe</span>
                    <span className="sm:hidden">Sécurité</span>
                  </div>
                  {activeTab === 'password' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                    />
                  )}
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'profile' ? (
                      <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-5 sm:space-y-6"
                      >
                      {/* Profile Image Upload */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Photo de Profil
                        </label>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                          {/* Preview */}
                          <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-100 shadow-sm">
                              {previewImage ? (
                                <img
                                  src={previewImage}
                                  alt="Aperçu du profil"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Upload/Remove Buttons */}
                          <div className="flex-1 w-full space-y-2">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer font-medium text-sm">
                                <Upload className="w-4 h-4" />
                                <span className="hidden sm:inline">Télécharger une photo</span>
                                <span className="sm:hidden">Télécharger</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>
                              {previewImage && (
                                <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Supprimer
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
                            </p>
                            {errors.profileImage && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-red-600 font-medium"
                              >
                                {errors.profileImage}
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                          Nom Complet
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-2.5 sm:py-3 border ${
                              errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base`}
                            placeholder="Entrez votre nom complet"
                          />
                        </div>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 font-medium"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                          Adresse Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-2.5 sm:py-3 border ${
                              errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base`}
                            placeholder="votre.email@exemple.com"
                          />
                        </div>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 font-medium"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>

                      {/* Role (Read-only) */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Rôle Système
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-900 font-medium flex-1">{admin.role}</span>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Lecture seule</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="password"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <ChangePasswordForm
                        ref={passwordFormRef}
                        onSubmit={handlePasswordChange}
                        onCancel={onClose}
                        hideButtons={true}
                        isSubmitting={isSubmitting}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons - Fixed at Bottom */}
              <div className="flex-shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                  type="submit"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    if (activeTab === 'password') {
                      e.preventDefault();
                      passwordFormRef.current?.submitForm();
                    }
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {activeTab === 'profile' ? 'Enregistrement...' : 'Mise à jour...'}
                    </>
                  ) : (
                    <>
                      {activeTab === 'profile' ? (
                        <>
                          <Save className="w-4 h-4" />
                          Enregistrer
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Mettre à Jour
                        </>
                      )}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
