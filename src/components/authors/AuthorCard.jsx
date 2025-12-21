import { motion } from 'framer-motion';
import { Trash2, Edit2, User, MoreVertical } from 'lucide-react';
import { useState } from 'react';

/**
 * AuthorCard Component
 * Displays a single author with image, name, bio, and edit/delete actions
 * Modern, discreet, and user-friendly design
 */
const AuthorCard = ({ author, onDelete, onEdit, index = 0 }) => {
  const [showActions, setShowActions] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(author);
    setShowActions(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(author);
    setShowActions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200/80 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group relative p-6"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Circular Author Image */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 overflow-hidden border-4 border-white shadow-lg">
            {author.imageUrl ? (
              <img
                src={author.imageUrl}
                alt={author.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>

          {/* Discreet action menu button */}
          <div className="absolute -top-3 -right-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1.5 bg-white/95 backdrop-blur-sm text-gray-700 rounded-lg shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </motion.button>

            {/* Dropdown menu */}
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-1.5 w-36 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10"
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

        {/* Author Name */}
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {author.name}
          </h3>
        </div>
      </div>

      {/* Subtle hover indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl" />
    </motion.div>
  );
};

export default AuthorCard;
