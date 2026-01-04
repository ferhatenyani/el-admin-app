import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle } from 'lucide-react';
import ProfileCard from '../components/profile/ProfileCard';
import EditProfileModal from '../components/profile/EditProfileModal';
import { getAdminProfile, updateAdminProfile, fetchAdminPictureBlob, changeAdminPassword } from '../services/adminApi';

/**
 * Profile Page Component
 * Displays and allows editing of admin profile information
 */
const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState('profile');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch admin profile from backend
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const profileData = await getAdminProfile();

        // Fetch profile picture if imageUrl exists
        let profileImageBlob = '';
        if (profileData.imageUrl) {
          profileImageBlob = await fetchAdminPictureBlob();
        }

        // Transform backend data to frontend format
        const adminProfile = {
          id: profileData.id,
          name: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 'Administrateur',
          email: profileData.email,
          role: 'Administrateur', // Backend doesn't return role, hardcoded for admin
          profileImage: profileImageBlob,
          joinedDate: profileData.createdDate ? new Date(profileData.createdDate).toISOString().split('T')[0] : '',
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone || '',
        };

        setAdmin(adminProfile);
      } catch (error) {
        console.error('Error loading admin profile:', error);
        // Fallback to mock data if API fails
        const mockAdmin = {
          id: 1,
          name: 'Administrateur',
          email: 'admin@espritlivre.com',
          role: 'Administrateur',
          profileImage: '',
          joinedDate: '2024-01-15',
        };
        setAdmin(mockAdmin);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleEditClick = (tab = 'profile') => {
    setModalInitialTab(tab);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = async (updatedData, profilePictureFile = null) => {
    try {
      // Split name into firstName and lastName
      const nameParts = updatedData.name.trim().split(/\s+/);
      let firstName = '';
      let lastName = '';

      if (nameParts.length === 1) {
        // Single word - put it in lastName
        lastName = nameParts[0];
      } else {
        // Multiple words - first word is firstName, rest is lastName
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }

      // Prepare API payload
      const profilePayload = {
        firstName,
        lastName,
        email: updatedData.email,
        phone: admin.phone || '', // Include existing phone or empty string
      };

      console.log('Updating profile with payload:', profilePayload);
      console.log('Profile picture file:', profilePictureFile ? profilePictureFile.name : 'none');

      // Call backend API with multipart data
      await updateAdminProfile(profilePayload, profilePictureFile);

      console.log('Profile update successful, refetching from server...');

      // Refetch the profile from the backend to get the updated data
      const refreshedProfile = await getAdminProfile();

      // Fetch updated profile picture if it exists
      let updatedProfileImage = '';
      if (refreshedProfile.imageUrl) {
        updatedProfileImage = await fetchAdminPictureBlob();
      }

      // Transform the refreshed data
      const updatedAdmin = {
        id: refreshedProfile.id,
        name: `${refreshedProfile.firstName || ''} ${refreshedProfile.lastName || ''}`.trim() || 'Administrateur',
        email: refreshedProfile.email,
        role: 'Administrateur',
        profileImage: updatedProfileImage,
        joinedDate: refreshedProfile.createdDate ? new Date(refreshedProfile.createdDate).toISOString().split('T')[0] : '',
        firstName: refreshedProfile.firstName,
        lastName: refreshedProfile.lastName,
        phone: refreshedProfile.phone || '',
      };

      setAdmin(updatedAdmin);

      // Afficher le message de succès
      setSuccessMessage('Profil mis à jour avec succès !');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      console.error('Error details:', error.response?.data);

      // Parse error message from backend response
      let errorMsg = 'Erreur lors de la mise à jour du profil';

      if (error.response?.data) {
        const errorData = error.response.data;

        // Check for the specific email exists error
        if (errorData.message === 'error.emailexists') {
          errorMsg = 'Cette adresse email est déjà utilisée par un autre compte';
        } else if (errorData.detail) {
          // Check if detail contains nested error information
          if (errorData.detail.includes('error.emailexists')) {
            errorMsg = 'Cette adresse email est déjà utilisée par un autre compte';
          } else if (errorData.detail.includes('ProblemDetailWithCause')) {
            // Try to extract the message from the nested problem detail
            const messageMatch = errorData.detail.match(/message=([^,}]+)/);
            if (messageMatch && messageMatch[1] === 'error.emailexists') {
              errorMsg = 'Cette adresse email est déjà utilisée par un autre compte';
            } else {
              errorMsg = errorData.title || errorData.detail;
            }
          } else {
            errorMsg = errorData.detail;
          }
        } else if (errorData.title) {
          errorMsg = errorData.title;
        }
      }

      setSuccessMessage(errorMsg);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      throw error; // Re-throw to let the modal handle it
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      // Call the API to change password
      await changeAdminPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Afficher le message de succès
      setSuccessMessage('Mot de passe modifié avec succès !');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      // Show error message
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Erreur lors du changement de mot de passe';
      setSuccessMessage(errorMsg);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      throw error; // Re-throw to let the modal handle it
    }
  };

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Message de Succès */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-[60] bg-white border border-green-200 rounded-xl shadow-lg p-4 flex items-center gap-3 max-w-sm"
        >
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{successMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Section En-tête - Corporate Style */}
      <div className="bg-white border-b border-gray-200 mb-6 sm:mb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profil Administrateur</h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 ml-11 sm:ml-14">
              Gérez vos informations personnelles et paramètres de sécurité
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne Principale - Profile Card */}
          <div className="lg:col-span-2">
            <ProfileCard admin={admin} onEditClick={handleEditClick} />
          </div>

          {/* Colonne Latérale - Quick Actions & Status */}
          <div className="space-y-6">
            {/* Carte Statut du Compte */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">Statut</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">État du compte</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-700">Actif</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Privilèges</span>
                  <span className="text-sm font-medium text-gray-900">Complets</span>
                </div>
              </div>
            </motion.div>

            {/* Carte Actions Rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 shadow-sm p-5"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-3">Actions Rapides</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleEditClick('profile')}
                  className="w-full text-left px-4 py-3 bg-white hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200"
                >
                  Modifier le profil
                </button>
                <button
                  onClick={() => handleEditClick('password')}
                  className="w-full text-left px-4 py-3 bg-white hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200"
                >
                  Changer le mot de passe
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section Conseils de Sécurité - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Bonnes Pratiques de Sécurité</h3>
              <p className="text-sm text-gray-600 mt-1">
                Suivez ces recommandations pour garantir la sécurité de votre compte
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Photo professionnelle</p>
                <p className="text-xs text-gray-600 mt-0.5">Utilisez une image claire et professionnelle</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email à jour</p>
                <p className="text-xs text-gray-600 mt-0.5">Maintenez votre adresse email actuelle</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Mot de passe fort</p>
                <p className="text-xs text-gray-600 mt-0.5">Combinez lettres, chiffres et symboles</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Changements réguliers</p>
                <p className="text-xs text-gray-600 mt-0.5">Renouvelez vos identifiants périodiquement</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal d'Édition de Profil */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        admin={admin}
        onSaveProfile={handleSaveProfile}
        onChangePassword={handleChangePassword}
        initialTab={modalInitialTab}
      />
    </div>
  );
};

export default Profile;
