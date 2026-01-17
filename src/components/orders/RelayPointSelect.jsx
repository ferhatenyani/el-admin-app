import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, MapPin, Phone, Building2, Loader2 } from 'lucide-react';
import { getRelayPoints, getRelayPointById } from '../../services/relayPointsApi';
import useDebounce from '../../hooks/useDebounce';

/**
 * RelayPointSelect Component
 *
 * A searchable dropdown for selecting relay points (Points de Relais / Stopdesk)
 * from Yalidine or ZR Express delivery providers.
 *
 * Features:
 * - Search/autocomplete functionality
 * - Filters by wilaya when provided
 * - Displays relay point details (name, address, commune)
 * - Fetches data from backend API
 * - Responsive design
 */
const RelayPointSelect = ({
  value,
  onChange,
  provider,
  wilaya,
  placeholder = "Rechercher un point de retrait...",
  disabled = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [relayPoints, setRelayPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch relay points when provider or wilaya changes
  const fetchRelayPoints = useCallback(async () => {
    if (!provider || !wilaya) {
      setRelayPoints([]);
      return;
    }

    setLoading(true);
    setFetchError(null);

    try {
      const data = await getRelayPoints(provider, wilaya);
      setRelayPoints(data || []);
    } catch (err) {
      console.error('Error fetching relay points:', err);
      setFetchError('Erreur lors du chargement des points de retrait');
      setRelayPoints([]);
    } finally {
      setLoading(false);
    }
  }, [provider, wilaya]);

  // Fetch relay points when dependencies change
  useEffect(() => {
    fetchRelayPoints();
  }, [fetchRelayPoints]);

  // Fetch selected point details when value changes
  useEffect(() => {
    const fetchSelectedPoint = async () => {
      if (!value) {
        setSelectedPoint(null);
        return;
      }

      // First check if it's in the current list
      const pointInList = relayPoints.find(p => p.id === value);
      if (pointInList) {
        setSelectedPoint(pointInList);
        return;
      }

      // Otherwise fetch from API
      try {
        const point = await getRelayPointById(value);
        setSelectedPoint(point);
      } catch (err) {
        console.error('Error fetching selected relay point:', err);
        setSelectedPoint(null);
      }
    };

    fetchSelectedPoint();
  }, [value, relayPoints]);

  // Reset selection when provider or wilaya changes
  useEffect(() => {
    if (value && selectedPoint) {
      // If the selected point doesn't match the current wilaya, clear it
      if (wilaya && selectedPoint.wilaya !== wilaya) {
        onChange(null);
        setSelectedPoint(null);
      }
    }
  }, [provider, wilaya]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsTyping(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setIsTyping(false);
    }
  }, [isOpen]);

  // Filter relay points based on search query (client-side filtering of fetched data)
  const filteredPoints = relayPoints.filter(point => {
    if (!debouncedSearchQuery) return true;
    const query = debouncedSearchQuery.toLowerCase();
    return (
      point.name?.toLowerCase().includes(query) ||
      point.address?.toLowerCase().includes(query) ||
      point.commune?.toLowerCase().includes(query)
    );
  });

  const handleSelect = (point) => {
    onChange(point.id);
    setSelectedPoint(point);
    setIsOpen(false);
    setSearchQuery('');
    setIsTyping(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSelectedPoint(null);
    setSearchQuery('');
  };

  if (!provider) {
    return (
      <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm">
        Sélectionnez d'abord un fournisseur de livraison
      </div>
    );
  }

  if (!wilaya) {
    return (
      <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-400 text-sm">
        Sélectionnez d'abord une wilaya
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
        <input
          ref={searchInputRef}
          type="text"
          value={isTyping ? searchQuery : (selectedPoint ? selectedPoint.name : '')}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsTyping(true);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled || loading}
          className={`w-full pl-9 pr-10 py-3 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : isOpen
                ? 'border-blue-500 focus:ring-blue-500 shadow-md'
                : 'border-gray-300 focus:ring-blue-500 hover:border-gray-400'
          } ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : ''} ${
            selectedPoint && !isTyping ? 'text-gray-900 font-medium' : 'text-gray-900'
          }`}
        />
        <div className="absolute right-0 top-0 bottom-0 flex items-center">
          {loading && (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin mr-2" />
          )}
          {selectedPoint && !disabled && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <button
            type="button"
            onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
            disabled={disabled || loading}
            className="px-3 h-full hover:bg-gray-100 rounded-r-lg transition-colors flex items-center"
          >
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden"
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-600">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Chargement...
                    </span>
                  ) : (
                    <>
                      {filteredPoints.length} point{filteredPoints.length !== 1 ? 's' : ''} de retrait
                      {wilaya && <span className="text-gray-400"> à {wilaya}</span>}
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Options List */}
              <div className="max-h-60 overflow-y-auto">
                {fetchError ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-red-500">{fetchError}</p>
                    <button
                      type="button"
                      onClick={fetchRelayPoints}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      Réessayer
                    </button>
                  </div>
                ) : loading ? (
                  <div className="px-4 py-8 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
                    <p className="text-sm text-gray-500">Chargement des points de retrait...</p>
                  </div>
                ) : filteredPoints.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      {searchQuery
                        ? 'Aucun point de retrait trouvé'
                        : `Aucun point de retrait disponible à ${wilaya}`}
                    </p>
                  </div>
                ) : (
                  filteredPoints.map((point) => (
                    <button
                      type="button"
                      key={point.id}
                      onClick={() => handleSelect(point)}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        value === point.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-lg ${
                          value === point.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-semibold ${
                            value === point.id ? 'text-blue-700' : 'text-gray-900'
                          }`}>
                            {point.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 truncate">
                            {point.address}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-400">
                              {point.commune}
                            </span>
                            {point.phone && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {point.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Point Details (shown below input when selected) */}
      {selectedPoint && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-blue-900">
                {selectedPoint.name}
              </div>
              <div className="text-xs text-blue-700 mt-0.5">
                {selectedPoint.address}
              </div>
              <div className="text-xs text-blue-600 mt-0.5">
                {selectedPoint.commune}, {selectedPoint.wilaya}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RelayPointSelect;
