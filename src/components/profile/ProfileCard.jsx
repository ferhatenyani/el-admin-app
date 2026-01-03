import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Edit2 } from 'lucide-react';
import { formatDate } from '../../utils/format';

/**
 * ProfileCard Component
 * Displays admin profile information in a modern card layout
 */
const ProfileCard = ({ admin, onEditClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Header Section - Clean Corporate Style */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Profile Picture */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="relative flex-shrink-0"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden bg-white">
              {admin.profileImage ? (
                <img
                  src={admin.profileImage}
                  alt={admin.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <User className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                </div>
              )}
            </div>
            {/* Online Status Indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </motion.div>

          {/* Name and Role */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{admin.name}</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">{admin.role}</span>
            </div>
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Membre depuis {formatDate(admin.joinedDate)}</span>
            </div>
          </div>

          {/* Edit Button - Desktop */}
          <div className="hidden sm:block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEditClick}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm hover:shadow"
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-sm">Modifier</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Informations de Contact</h3>
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 mb-1">Adresse Email</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{admin.email}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 mb-1">Rôle Système</p>
              <p className="text-sm font-semibold text-gray-900">{admin.role}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Button - Mobile */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onEditClick}
          className="sm:hidden w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
        >
          <Edit2 className="w-5 h-5" />
          Modifier le Profil
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
