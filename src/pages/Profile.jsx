import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle } from 'lucide-react';
import ProfileCard from '../components/profile/ProfileCard';
import EditProfileModal from '../components/profile/EditProfileModal';

/**
 * Profile Page Component
 * Displays and allows editing of admin profile information
 */
const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Données admin fictives - dans une vraie app, cela viendrait d'une API ou du contexte d'authentification
  useEffect(() => {
    // Simuler la récupération des données admin depuis localStorage ou API
    const mockAdmin = {
      id: 1,
      name: 'Administrateur',
      email: 'admin@espritlivre.com',
      role: 'Administrateur',
      profileImage: '', // Vide pour l'avatar par défaut
      joinedDate: '2024-01-15',
    };

    // Vérifier s'il y a des données sauvegardées dans localStorage
    const savedProfile = localStorage.getItem('esprit_livre_admin_profile');
    if (savedProfile) {
      setAdmin(JSON.parse(savedProfile));
    } else {
      setAdmin(mockAdmin);
      localStorage.setItem('esprit_livre_admin_profile', JSON.stringify(mockAdmin));
    }
  }, []);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = async (updatedData) => {
    // Appel API fictif - simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mettre à jour les données admin
    const updatedAdmin = {
      ...admin,
      ...updatedData
    };

    setAdmin(updatedAdmin);

    // Sauvegarder dans localStorage
    localStorage.setItem('esprit_livre_admin_profile', JSON.stringify(updatedAdmin));

    // Afficher le message de succès
    setSuccessMessage('Profil mis à jour avec succès !');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);

    console.log('Profil mis à jour:', updatedData);
  };

  const handleChangePassword = async (passwordData) => {
    // Appel API fictif - simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Dans une vraie app, vous enverriez ceci à votre backend
    console.log('Changement de mot de passe demandé:', {
      currentPassword: '***',
      newPassword: '***'
    });

    // Afficher le message de succès
    setSuccessMessage('Mot de passe modifié avec succès !');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Message de Succès */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-[60] bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-900">{successMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Section En-tête Améliorée */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-xl mb-8 overflow-hidden relative"
      >
        {/* Éléments décoratifs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

        <div className="relative px-8 py-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Profil</h1>
              <p className="text-blue-100 text-lg mt-1">
                Gérez les paramètres et les préférences de votre compte
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Contenu Principal */}
      <div className="max-w-2xl mx-auto">
        <ProfileCard admin={admin} onEditClick={handleEditClick} />

        {/* Cartes d'Informations Supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Carte Sécurité */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Gardez votre compte sécurisé en utilisant un mot de passe fort et en le mettant à jour régulièrement.
            </p>
            <button
              onClick={() => {
                setIsEditModalOpen(true);
                // Switch to password tab would require passing a prop to EditProfileModal
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Changer le mot de passe →
            </button>
          </div>

          {/* Carte Activité */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Statut du compte</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Votre compte est actif et en règle.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-600 font-medium">Actif</span>
            </div>
          </div>
        </motion.div>

        {/* Section Conseils */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md border border-blue-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Conseils pour le profil</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Utilisez une photo de profil professionnelle pour une meilleure reconnaissance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Maintenez votre adresse e-mail à jour pour les notifications importantes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Changez votre mot de passe régulièrement pour maintenir la sécurité du compte</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Utilisez un mot de passe fort avec un mélange de lettres, chiffres et symboles</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Modal d'Édition de Profil */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        admin={admin}
        onSaveProfile={handleSaveProfile}
        onChangePassword={handleChangePassword}
      />
    </div>
  );
};

export default Profile;
