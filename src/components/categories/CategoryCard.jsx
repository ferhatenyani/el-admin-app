import { motion } from 'framer-motion';
import { Trash2, Edit2, Languages, MoreVertical, FolderOpen } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

/**
 * CategoryCard Component
 * Displays a single category with image, names in both languages, and edit/delete actions
 * Modern, discreet, and user-friendly design
 */
const CategoryCard = ({ category, onDelete, onEdit, index = 0, getCategoryImageUrl }) => {
  const [showActions, setShowActions] = useState(false);
  const [failedImage, setFailedImage] = useState(false);
  const [triedPlaceholder, setTriedPlaceholder] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

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
      className="bg-white rounded-lg border border-gray-200/80 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group relative overflow-hidden w-[140px] sm:w-[180px] md:w-[200px] lg:w-[230px]"
    >
      {/* Category Image Container - 2:1 aspect ratio matching user app */}
      <div className="relative w-full aspect-[2/1] bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 overflow-hidden">
        {failedImage ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full">
              <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
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
        <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-0.5 sm:p-1 bg-white/95 backdrop-blur-sm text-gray-700 rounded-full shadow-md hover:bg-white transition-all duration-200"
            title="Actions"
          >
            <MoreVertical className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </motion.button>

          {/* Dropdown menu */}
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-0.5 sm:mt-1 w-24 sm:w-28 bg-white rounded-md shadow-xl border border-gray-200 overflow-hidden z-10"
            >
              <button
                onClick={handleEdit}
                className="w-full flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[9px] sm:text-[10px] text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[9px] sm:text-[10px] text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors border-t border-gray-100"
              >
                <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Supprimer
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Category Info - Clean and minimalistic */}
      <div className="space-y-0 p-1 sm:p-1.5">
        {/* English Name */}
        <div className="leading-snug">
          <span className="text-[6px] sm:text-[7px] font-medium text-gray-400 uppercase tracking-wider block mb-0.5">English</span>
          <h3 className="text-[8px] sm:text-[9px] font-semibold text-gray-900 truncate leading-snug">
            {category.nameEn}
          </h3>
        </div>

        {/* French Name */}
        <div className="mt-1 leading-snug">
          <span className="text-[6px] sm:text-[7px] font-medium text-gray-400 uppercase tracking-wider block mb-0.5">Français</span>
          <p className="text-[8px] sm:text-[9px] font-medium text-gray-600 truncate leading-snug">
            {category.nameFr}
          </p>
        </div>
      </div>

    </motion.div>
  );
};

export default CategoryCard;
