import { useState, forwardRef, useImperativeHandle } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ChangePasswordForm Component
 * Allows admin to change their password with validation
 */
const ChangePasswordForm = forwardRef(({ onSubmit, onCancel, hideButtons = false, isSubmitting: externalIsSubmitting = false }, ref) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expose submitForm method to parent via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit({ preventDefault: () => {} });
    }
  }));

  // Use external isSubmitting state if provided, otherwise use internal
  const submitting = hideButtons ? externalIsSubmitting : isSubmitting;

  // Password validation
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Le mot de passe doit contenir au moins une lettre majuscule';
    }
    if (!/[a-z]/.test(password)) {
      return 'Le mot de passe doit contenir au moins une lettre minuscule';
    }
    if (!/[0-9]/.test(password)) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Le mot de passe actuel est requis';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre nouveau mot de passe';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe doit être différent du mot de passe actuel';
    }

    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Submit the form
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      console.error('Error response data:', error.response?.data);

      // Handle specific error cases
      const errorMessage = error.response?.data?.message;
      const errorDetail = error.response?.data?.detail;

      if (errorMessage === 'error.invalidcurrentpassword') {
        setErrors({
          currentPassword: 'Le mot de passe actuel est incorrect'
        });
      } else if (errorDetail && errorDetail.includes('error.invalidcurrentpassword')) {
        // Check if error message is nested in detail string
        setErrors({
          currentPassword: 'Le mot de passe actuel est incorrect'
        });
      } else if (error.response?.status === 400) {
        // Generic bad request error
        setErrors({
          currentPassword: 'Une erreur est survenue. Veuillez vérifier vos informations.'
        });
      } else {
        // Generic error handling
        setErrors({
          currentPassword: 'Une erreur est survenue lors de la modification du mot de passe'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;

    let label = '';
    let color = '';

    if (strength < 40) {
      label = 'Faible';
      color = 'bg-red-500';
    } else if (strength < 70) {
      label = 'Moyen';
      color = 'bg-yellow-500';
    } else {
      label = 'Fort';
      color = 'bg-green-500';
    }

    return { strength, label, color };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* Current Password */}
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-900 mb-2">
          Mot de Passe Actuel
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPasswords.current ? 'text' : 'password'}
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={`block w-full pl-10 pr-10 py-2.5 sm:py-3 border ${
              errors.currentPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base`}
            placeholder="Entrez votre mot de passe actuel"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPasswords.current ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.currentPassword && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.currentPassword}
          </motion.p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-900 mb-2">
          Nouveau Mot de Passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPasswords.new ? 'text' : 'password'}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={`block w-full pl-10 pr-10 py-2.5 sm:py-3 border ${
              errors.newPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base`}
            placeholder="Créez un nouveau mot de passe"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPasswords.new ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.newPassword && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength.strength}%` }}
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                />
              </div>
              <span className={`text-xs font-medium ${
                passwordStrength.strength < 40 ? 'text-red-600' :
                passwordStrength.strength < 70 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}

        {errors.newPassword && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.newPassword}
          </motion.p>
        )}

        {/* Password Requirements */}
        <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50/30 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-gray-900 mb-2.5">Exigences du mot de passe :</p>
          <ul className="space-y-1.5 text-xs text-gray-700">
            <li className="flex items-center gap-2">
              <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={formData.newPassword.length >= 8 ? 'text-green-700 font-medium' : ''}>Au moins 8 caractères</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={/[A-Z]/.test(formData.newPassword) ? 'text-green-700 font-medium' : ''}>Une lettre majuscule</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${/[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={/[a-z]/.test(formData.newPassword) ? 'text-green-700 font-medium' : ''}>Une lettre minuscule</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={/[0-9]/.test(formData.newPassword) ? 'text-green-700 font-medium' : ''}>Un chiffre</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
          Confirmer le Mot de Passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`block w-full pl-10 pr-10 py-2.5 sm:py-3 border ${
              errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors text-sm sm:text-base`}
            placeholder="Confirmez votre nouveau mot de passe"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPasswords.confirm ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.confirmPassword}
          </motion.p>
        )}
        {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-green-600 flex items-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            Les mots de passe correspondent
          </motion.p>
        )}
      </div>

      {/* Action Buttons */}
      {!hideButtons && (
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Annuler
          </button>
          <motion.button
            whileHover={{ scale: submitting ? 1 : 1.01 }}
            whileTap={{ scale: submitting ? 1 : 0.99 }}
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Mettre à Jour
              </>
            )}
          </motion.button>
        </div>
      )}
    </form>
  );
});

ChangePasswordForm.displayName = 'ChangePasswordForm';

export default ChangePasswordForm;
