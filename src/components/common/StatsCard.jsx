import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, ChevronDown, Check, Info, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useScrollLock from '../../hooks/useScrollLock';
import { getStats } from '../../mock/mockApi';
import { formatCurrency } from '../../utils/format';

/**
 * Modern StatsCard component with isolated data fetching
 * Features:
 * - Self-contained time filter state (no parent coupling)
 * - Independent React Query data fetching with unique query key
 * - Only this card re-renders when its filter changes
 * - Automatic caching via React Query
 * - Loading and error states
 * - Interactive popup with detailed stats
 */
const StatsCard = memo(({
  title,
  icon: Icon,
  color = 'blue',
  delay = 0,
  metricKey, // 'books' | 'users' | 'orders' | 'sales' - determines which data to extract
  showTimeSelector = true,
  detailsDataBuilder = null, // Function to build details data: (stats, recentOrders) => detailsData
}) => {
  // Local state - completely isolated from parent and siblings
  const [timeRange, setTimeRange] = useState('Ce mois-ci');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const dropdownRef = useRef(null);
  const cardRef = useRef(null);
  const popupRef = useRef(null);

  // Lock background scroll when popup is visible
  useScrollLock(isPopupVisible);

  const timeRangeOptions = ['Aujourd\'hui', 'Cette semaine', 'Ce mois-ci'];

  // Isolated data fetching - unique query key per card + timeRange
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['stats', metricKey, timeRange],
    queryFn: () => getStats(timeRange),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Extract metric-specific data
  const getMetricData = () => {
    if (!data) return { value: 0, growth: { value: 0, isPositive: true } };

    const metricMap = {
      books: {
        value: data.totalBooks,
        growth: data.growth.books,
      },
      users: {
        value: data.totalUsers,
        growth: data.growth.users,
      },
      orders: {
        value: data.totalOrders,
        growth: data.growth.orders,
      },
      sales: {
        value: formatCurrency(data.monthlySales),
        growth: data.growth.sales,
      },
    };

    return metricMap[metricKey] || { value: 0, growth: { value: 0, isPositive: true } };
  };

  const { value, growth } = getMetricData();
  const detailsData = detailsDataBuilder && data ? detailsDataBuilder(data, timeRange) : null;

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

  // Close popup when clicking outside the card and scroll to top
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isPopupVisible && cardRef.current && !cardRef.current.contains(event.target)) {
        setIsPopupVisible(false);
        // Smooth scroll to top when closing popup
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPopupVisible]);

  // Auto-scroll to make popup fully visible when opened
  useEffect(() => {
    if (isPopupVisible && popupRef.current) {
      // Small delay to ensure popup is fully rendered
      setTimeout(() => {
        const popupRect = popupRef.current.getBoundingClientRect();
        const popupBottom = popupRect.bottom;
        const viewportHeight = window.innerHeight;

        if (popupBottom > viewportHeight - 40) {
          const scrollAmount = popupBottom - viewportHeight + 60; // Extra padding
          window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [isPopupVisible]);

  // Handle card click for popup - single click to toggle
  const handleCardClick = (e) => {
    // Don't trigger if clicking on dropdown
    if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
      return;
    }

    if (detailsData) {
      setIsPopupVisible(!isPopupVisible);
    }
  };

  // Handle time range change - purely local, no parent notification
  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
    setIsDropdownOpen(false);
    // Query will automatically refetch with new timeRange
  };
  // Modern color schemes with gradients and enhanced contrast
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      icon: 'bg-gradient-to-br from-blue-400 to-blue-600',
      shadow: 'hover:shadow-blue-200',
      ring: 'hover:ring-blue-100',
    },
    green: {
      bg: 'from-emerald-500 to-emerald-600',
      icon: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
      shadow: 'hover:shadow-emerald-200',
      ring: 'hover:ring-emerald-100',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      icon: 'bg-gradient-to-br from-purple-400 to-purple-600',
      shadow: 'hover:shadow-purple-200',
      ring: 'hover:ring-purple-100',
    },
    red: {
      bg: 'from-rose-500 to-rose-600',
      icon: 'bg-gradient-to-br from-rose-400 to-rose-600',
      shadow: 'hover:shadow-rose-200',
      ring: 'hover:ring-rose-100',
    },
  };

  const colors = colorClasses[color];

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="relative bg-white rounded-2xl border border-gray-100 p-6"
      >
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="relative bg-white rounded-2xl border border-red-200 p-6"
      >
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-red-600 font-medium">Erreur de chargement</p>
          <p className="text-xs text-gray-500">{error?.message || 'Une erreur est survenue'}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0] // Custom easing for smoother animation
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }}
      onClick={handleCardClick}
      className={`
        relative
        bg-white rounded-2xl
        border border-gray-100
        p-6
        hover:shadow-xl ${colors.shadow}
        hover:ring-2 ${colors.ring}
        transition-all duration-300
        cursor-pointer
        group
        ${isPopupVisible ? 'z-[100]' : 'z-0'}
      `}
      style={{ overflow: 'visible' }}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none overflow-hidden rounded-2xl">
        <div className={`w-full h-full bg-gradient-to-br ${colors.bg} rounded-full blur-2xl`} />
      </div>

      {/* Card Content - Structured Layout */}
      <div className="relative space-y-4">
        {/* Header Row: Title and Time Selector */}
        <div className="flex items-start justify-between gap-3">
          {/* Title */}
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide flex-1">
            {title}
          </p>

          {/* Custom Time Range Selector */}
          {showTimeSelector && (
            <div ref={dropdownRef} className="relative flex-shrink-0 z-20">
              {/* Dropdown Trigger Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="
                  flex items-center gap-1.5
                  bg-gray-50 hover:bg-gray-100
                  text-gray-700
                  text-xs font-medium
                  px-3 py-1.5
                  rounded-lg
                  border border-gray-200
                  cursor-pointer
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  whitespace-nowrap
                "
              >
                <span className="text-left">{timeRange}</span>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                </motion.div>
              </button>

              {/* Custom Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="
                      absolute top-full right-0 mt-2
                      min-w-full
                      bg-white
                      border border-gray-200
                      rounded-lg
                      shadow-lg
                      overflow-hidden
                      z-50
                    "
                  >
                    {timeRangeOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleTimeRangeChange(option)}
                        className={`
                          w-full
                          flex items-center justify-between
                          px-3 py-2
                          text-xs font-medium
                          text-left
                          transition-colors duration-150
                          whitespace-nowrap
                          ${timeRange === option
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span>{option}</span>
                        {timeRange === option && (
                          <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Main Content Row: Value and Icon */}
        <div className="flex items-center justify-between gap-3">
          {/* Value */}
          <div className="flex-1 min-w-0">
            <p className="text-4xl font-bold text-gray-900 tracking-tight truncate">
              {value}
            </p>
          </div>

          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className={`
              flex-shrink-0
              w-14 h-14
              flex items-center justify-center
              rounded-xl
              ${colors.icon}
              shadow-lg
              group-hover:shadow-xl
              transition-shadow duration-300
            `}
          >
            <Icon className="w-6 h-6 text-white" strokeWidth={2} />
          </motion.div>
        </div>

        {/* Growth Indicator Row */}
        {growth && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`
              flex items-center gap-1 px-2.5 py-1 rounded-full
              ${growth.isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
              }
            `}>
              {growth.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span className="text-xs font-bold">
                {growth.isPositive ? '+' : '-'}{growth.value}%
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {timeRange === 'Aujourd\'hui' ? 'depuis hier' :
               timeRange === 'Cette semaine' ? 'depuis la semaine dernière' :
               'depuis le mois dernier'}
            </span>
          </div>
        )}
      </div>


      {/* Interactive Popup with Details */}
      <AnimatePresence>
        {isPopupVisible && detailsData && (
          <motion.div
              ref={popupRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1] // Smooth cubic-bezier easing
              }}
              className="absolute left-0 right-0 top-full mt-4 z-[200] px-2 sm:px-0"
              style={{ pointerEvents: 'none' }}
            >
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-w-sm mx-auto sm:mx-0 relative ring-4 ring-black/5">
              {/* Popup Header */}
              <div className={`bg-gradient-to-r ${colors.bg} px-4 py-3`}>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-white" />
                  <h3 className="text-white font-semibold text-sm">Détails de {title}</h3>
                </div>
              </div>

              {/* Popup Content */}
              <div className="p-4 space-y-4">
                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {detailsData.description}
                </p>

                {/* Breakdown Section */}
                {detailsData.breakdown && detailsData.breakdown.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Répartition
                    </h4>
                    <div className="space-y-2">
                      {detailsData.breakdown.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-sm text-gray-700 font-medium">
                            {item.label}
                          </span>
                          <span className={`text-sm font-bold ${item.color}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comparison Section */}
                {detailsData.comparison && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {detailsData.comparison.period}
                      </span>
                      <div className={`
                        flex items-center gap-1 px-2 py-1 rounded-full
                        ${detailsData.comparison.isPositive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                        }
                      `}>
                        {detailsData.comparison.isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span className="text-xs font-bold">
                          {detailsData.comparison.change}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                {detailsData.lastUpdated && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">
                      {detailsData.lastUpdated}
                    </p>
                  </div>
                )}
              </div>

              {/* Popup Arrow pointing upward (since popup is always below card) */}
              <div
                className="absolute w-3 h-3 bg-white border transform rotate-45 -top-1.5 left-6 border-b-0 border-r-0 border-gray-200"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;
