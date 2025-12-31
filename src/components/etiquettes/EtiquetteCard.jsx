import { motion } from 'framer-motion';
import { Trash2, Edit2, Tag, MoreVertical } from 'lucide-react';
import { useState } from 'react';

/**
 * EtiquetteCard Component
 * Displays a single etiquette (label) with its name and color, and edit/delete actions
 * Modern, discreet, and user-friendly design
 */
const EtiquetteCard = ({ etiquette, onDelete, onEdit, index = 0 }) => {
  const [showActions, setShowActions] = useState(false);

  // Ensure color is a valid hex value, fallback to default if not
  const displayColor = etiquette.colorHex || '#FFFFFF';

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(etiquette);
    setShowActions(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(etiquette);
    setShowActions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200/80 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group relative p-4"
    >
      {/* Etiquette Color Display */}
      <div className="relative flex items-center gap-4">
        {/* Color Circle */}
        <div className="relative">
          <div
            className="w-16 h-16 rounded-full shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-white"
            style={{ backgroundColor: displayColor }}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        {/* Etiquette Info */}
        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">FR:</span>
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {etiquette.nameFr}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">EN:</span>
              <h3 className="text-sm font-medium text-gray-700 truncate">
                {etiquette.nameEn}
              </h3>
            </div>
          </div>
          <p className="text-xs font-mono text-gray-500 mt-2 uppercase">
            {displayColor}
          </p>
        </div>

        {/* Discreet action menu button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="Actions"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>

          {/* Dropdown menu */}
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-full mr-2 top-0 w-36 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10"
            >
              <button
                onClick={handleEdit}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors border-t border-gray-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Supprimer
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Color-based bottom border indicator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl"
        style={{ backgroundColor: displayColor }}
      />
    </motion.div>
  );
};

export default EtiquetteCard;
