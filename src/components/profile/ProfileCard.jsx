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
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 px-8 py-12 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

        <div className="relative flex flex-col items-center">
          {/* Profile Picture */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative mb-4"
          >
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              {admin.profileImage ? (
                <img
                  src={admin.profileImage}
                  alt={admin.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
            {/* Online Status Indicator */}
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-md" />
          </motion.div>

          {/* Name and Role */}
          <h2 className="text-3xl font-bold text-white mb-2">{admin.name}</h2>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <Shield className="w-4 h-4 text-white" />
            <span className="text-white font-medium text-sm">{admin.role}</span>
          </div>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="p-8">
        <div className="space-y-5">
          {/* Email */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Adresse email</p>
              <p className="text-sm font-medium text-gray-900 truncate">{admin.email}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Rôle</p>
              <p className="text-sm font-medium text-gray-900">{admin.role}</p>
            </div>
          </div>

          {/* Joined Date */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Membre depuis</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(admin.joinedDate)}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEditClick}
          className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Edit2 className="w-5 h-5" />
          Edition du profil
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
