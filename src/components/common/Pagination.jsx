import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, Check } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 5,
  totalItems,
  onItemsPerPageChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pageNumbers = [];
  const maxVisiblePages = 5;
  const itemsPerPageOptions = [5, 10, 20, 50];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemsPerPageChange = (value) => {
    onItemsPerPageChange(value);
    setIsDropdownOpen(false);
  };

  // Calculate which page numbers to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Afficher</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-[70px] justify-between"
          >
            <span className="font-medium">{itemsPerPage}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
              {itemsPerPageOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleItemsPerPageChange(option)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-blue-50 flex items-center justify-between transition-colors ${
                    itemsPerPage === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span className={itemsPerPage === option ? 'font-medium' : ''}>{option}</span>
                  {itemsPerPage === option && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-700">par page</span>
      </div>

      {/* Page info */}
      <div className="text-sm text-gray-700">
        Affichage de <span className="font-medium">{startItem}</span> à{' '}
        <span className="font-medium">{endItem}</span> sur{' '}
        <span className="font-medium">{totalItems}</span> résultats
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page button */}
        <button
          onClick={handleFirst}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
          title="Première page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
          title="Page précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm font-medium transition-colors"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </>
          )}

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm font-medium transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Mobile page indicator */}
        <div className="sm:hidden px-3 py-1.5 text-sm font-medium">
          Page {currentPage} / {totalPages}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
          title="Page suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page button */}
        <button
          onClick={handleLast}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
          title="Dernière page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
