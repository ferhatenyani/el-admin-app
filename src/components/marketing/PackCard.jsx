import { Edit2, Trash2, Package } from 'lucide-react';

const PackCard = ({ pack, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col h-[380px] hover:shadow-lg transition-shadow duration-200">
      {/* Pack Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Pack Name */}
          <h3 className="text-base font-semibold text-white line-clamp-1 flex-1">
            {pack.name}
          </h3>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={onEdit}
              className="p-2 bg-white/15 hover:bg-white/25 rounded-lg transition-colors duration-200"
              title="Modifier le pack"
              aria-label="Modifier le pack"
            >
              <Edit2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white/15 hover:bg-red-500 rounded-lg transition-colors duration-200"
              title="Supprimer le pack"
              aria-label="Supprimer le pack"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Badges Row */}
        <div className="flex items-center gap-2">
          {/* Price Badge */}
          <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-md font-semibold text-sm shadow-sm">
            {pack.price} DZD
          </div>

          {/* Book Count Badge */}
          <div className="bg-white/90 px-2.5 py-1 rounded-md text-sm font-medium text-gray-800 flex items-center gap-1.5 shadow-sm">
            <Package className="w-4 h-4 text-green-600" />
            {pack.books.length} livres
          </div>
        </div>
      </div>

      {/* Pack Content */}
      <div className="px-4 py-4 flex flex-col flex-1 min-h-0">
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem] flex-shrink-0">
          {pack.description}
        </p>

        {/* Books Preview */}
        <div className="flex-1 min-h-0 flex flex-col">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 pb-2 border-b border-gray-200 flex-shrink-0">
            Livres Inclus
          </p>
          <div className="overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {pack.books.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between bg-gray-50 rounded-md p-2 border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors flex-shrink-0"
              >
                <span
                  className="text-xs text-gray-800 font-medium truncate max-w-[140px] sm:max-w-[180px]"
                  title={book.title}
                >
                  {book.title}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded flex-shrink-0 ml-2">
                  {book.language || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackCard;
