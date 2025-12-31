import { motion } from 'framer-motion';
import { Trash2, Edit2, Languages, MoreVertical, FolderOpen } from 'lucide-react';
import { useState } from 'react';

/**
 * CategoryCard Component
 * Displays a single category with image, names in both languages, and edit/delete actions
 * Modern, discreet, and user-friendly design
 */
const CategoryCard = ({ category, onDelete, onEdit, index = 0, getCategoryImageUrl }) => {
  const [showActions, setShowActions] = useState(false);
  const [failedImage, setFailedImage] = useState(false);
  const [triedPlaceholder, setTriedPlaceholder] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(category);
    setShowActions(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(category);
    setShowActions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200/80 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group relative overflow-hidden"
    >
      {/* Category Image Container - with padding and rounded corners */}
      <div className="relative h-24 sm:h-32 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 overflow-hidden">
        {failedImage ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="p-2 sm:p-2.5 bg-white/80 backdrop-blur-sm rounded-full">
              <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
          </div>
        ) : (
          <img
            src={getCategoryImageUrl(category.id, triedPlaceholder)}
            alt={category.nameEn}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            onError={(e) => {
              // Try placeholder if not already tried
              if (!triedPlaceholder) {
                setTriedPlaceholder(true);
                e.target.src = getCategoryImageUrl(category.id, true);
              } else {
                // Both failed, show icon
                setFailedImage(true);
              }
            }}
          />
        )}

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Discreet action menu button */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-1 sm:p-1.5 bg-white/95 backdrop-blur-sm text-gray-700 rounded-lg shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="Actions"
          >
            <MoreVertical className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </motion.button>

          {/* Dropdown menu */}
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-1 sm:mt-1.5 w-32 sm:w-36 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10"
            >
              <button
                onClick={handleEdit}
                className="w-full flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors border-t border-gray-100"
              >
                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Supprimer
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Category Info - Clean and minimalistic */}
      <div className="space-y-0.5 p-2 sm:p-3">
        {/* English Name */}
        <div>
          <span className="text-[8px] sm:text-[9px] font-medium text-gray-400 uppercase tracking-wider">English</span>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate mt-0.5">
            {category.nameEn}
          </h3>
        </div>

        {/* French Name */}
        <div>
          <span className="text-[8px] sm:text-[9px] font-medium text-gray-400 uppercase tracking-wider">Français</span>
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate mt-0.5">
            {category.nameFr}
          </p>
        </div>
      </div>

    </motion.div>
  );
};

export default CategoryCard;
