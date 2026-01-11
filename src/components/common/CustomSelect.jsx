import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Search } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, placeholder = "Select option", onOpen, searchable = false, alwaysVisibleSearch = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && !alwaysVisibleSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen && !alwaysVisibleSearch) {
      setSearchQuery('');
    }
  }, [isOpen, searchable, alwaysVisibleSearch]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    if (!alwaysVisibleSearch) {
      setSearchQuery('');
    }
  };

  const selectedOption = options.find(opt => opt.value === value);

  // Filter options based on search query
  const filteredOptions = (searchable || alwaysVisibleSearch) && searchQuery
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  return (
    <div className="relative" ref={dropdownRef}>
      {alwaysVisibleSearch ? (
        // Always visible search input mode
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (!isOpen && onOpen) {
                  onOpen();
                }
                setIsOpen(true);
              }}
              placeholder={placeholder}
              className={`w-full pl-9 pr-10 py-3 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                isOpen ? 'border-blue-500 focus:ring-blue-500 shadow-md' : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
              }`}
            />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="absolute right-0 top-0 bottom-0 px-3 hover:bg-gray-100 rounded-r-lg transition-colors flex items-center"
            >
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
          {selectedOption && selectedOption.value !== '' && searchQuery === '' && (
            <div className="absolute left-9 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <span className="text-sm text-gray-700 font-medium truncate">
                {selectedOption.label}
              </span>
            </div>
          )}
        </div>
      ) : (
        // Traditional select mode
        <div
          className={`flex items-center bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            isOpen ? 'border-blue-500 shadow-md' : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={() => {
            if (!isOpen && onOpen) {
              onOpen();
            }
            setIsOpen(!isOpen);
          }}
        >
          <div className="flex items-center flex-1 py-3 px-4 overflow-hidden leading-tight">
            <span className={`text-sm truncate leading-tight ${selectedOption ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!isOpen && onOpen) {
                onOpen();
              }
              setIsOpen(!isOpen);
            }}
            className="py-3 px-3 hover:bg-gray-100 rounded-r-lg transition-colors flex items-center flex-shrink-0"
          >
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden"
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-600">
                  {filteredOptions.length} {filteredOptions.length === 1 ? 'option' : 'options'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {searchable && !alwaysVisibleSearch && (
                <div className="px-3 py-2 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    Aucun résultat trouvé
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors flex items-center border-b border-gray-100 last:border-b-0 ${
                        value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                      title={option.label}
                    >
                      <div className={`w-3 h-3 border-2 rounded-full mr-3 flex-shrink-0 ${
                        value === option.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}></div>
                      <span className="font-medium break-words">{option.label}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
