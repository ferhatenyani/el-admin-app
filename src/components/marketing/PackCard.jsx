import { Edit2, Trash2, Package } from 'lucide-react';

const PackCard = ({ pack, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200 flex flex-col h-[420px] sm:h-[460px] md:h-[500px]">
      {/* Pack Header with Title and Badges */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 border-b border-gray-200">
        {/* Pack Name */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-1">
          {pack.name}
        </h3>

        {/* Badges Row */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Price Badge */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-md">
            {pack.price} DZD
          </div>

          {/* Book Count Badge */}
          <div className="bg-white px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold text-gray-800 flex items-center gap-1.5 sm:gap-2 shadow-md border border-gray-200">
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600" />
            {pack.books.length} livres
          </div>
        </div>
      </div>

      {/* Pack Content - Controlled Height */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col flex-1 min-h-0">
        {/* Description */}
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] flex-shrink-0">
          {pack.description}
        </p>

        {/* Books Preview - Scrollable when needed */}
        <div className="flex-1 min-h-0 flex flex-col">
          <p className="text-[10px] sm:text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5 sm:mb-2 pb-1.5 sm:pb-2 border-b border-gray-200 flex-shrink-0">
            Livres Inclus
          </p>
          <div className="overflow-y-auto space-y-1 sm:space-y-1.5 md:space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {pack.books.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 border border-gray-100 hover:border-blue-200 transition-colors flex-shrink-0"
              >
                <span
                  className="text-[10px] sm:text-xs md:text-sm text-gray-800 font-medium truncate max-w-[100px] sm:max-w-[140px] md:max-w-[180px]"
                  title={book.title}
                >
                  {book.title}
                </span>
                <span className="px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-0.5 md:py-1 text-[9px] sm:text-xs font-semibold text-blue-700 bg-blue-100 rounded-full flex-shrink-0 ml-1.5 sm:ml-2 border border-blue-200">
                  {book.language || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed to Bottom */}
      <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-5 mt-auto flex-shrink-0">
        <div className="flex gap-1.5 sm:gap-2 md:gap-3 pt-1.5 sm:pt-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-md sm:rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 font-semibold text-[10px] sm:text-xs md:text-sm shadow-sm hover:shadow-md border border-blue-200"
          >
            <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span className="hidden xs:inline">Modifier</span>
            <span className="xs:hidden">Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-md sm:rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-200 font-semibold text-[10px] sm:text-xs md:text-sm shadow-sm hover:shadow-md border border-red-200"
          >
            <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span className="hidden xs:inline">Supprimer</span>
            <span className="xs:hidden">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackCard;
