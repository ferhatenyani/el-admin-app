import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, memo } from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';
import * as dashboardApi from '../../services/dashboardApi';

/**
 * Modern minimalist SalesChart component with isolated data fetching
 * Features:
 * - Self-contained time filter state (no parent coupling)
 * - Independent React Query data fetching
 * - Only this chart re-renders when its filter changes
 * - Clean line chart design matching modern UI standards
 * - Custom dots on data points
 * - Refined tooltip styling
 * - Responsive design (down to 320px)
 * - Advanced filtering: Year and Month selectors with custom styled dropdowns
 */
const SalesChart = memo(() => {
  // Local state - completely isolated
  const [timeRange, setTimeRange] = useState('mois');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);
  const monthDropdownRef = useRef(null);

  const timeRangeOptions = ['Aujourd\'hui', 'Cette semaine', 'mois', 'Année'];

  // Generate year options (current year and 4 previous years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Month options (French names)
  const monthOptions = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  // State for API data
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  // Fetch sales data when timeRange, selectedYear, or selectedMonth changes
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        // Fetch data from API
        const rawData = await dashboardApi.getSalesChartData(timeRange, selectedYear, selectedMonth);

        // Transform backend data to frontend format
        // Backend returns: [{ name: "...", sales: BigDecimal }]
        // Frontend expects: [{ name: "...", sales: number }]
        const transformedData = rawData.map(point => ({
          name: point.name,
          sales: Number(point.sales) || 0,
        }));

        setData(transformedData);
      } catch (err) {
        console.error('Error fetching sales chart data:', err);
        setIsError(true);
        setError(err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, [timeRange, selectedYear, selectedMonth]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
        setIsMonthDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle time range change - purely local
  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
    setIsDropdownOpen(false);
    // Query will automatically refetch with new timeRange
  };

  // Handle year change
  const handleYearChange = (year) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
    // Query will automatically refetch with new year
  };

  // Handle month change
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setIsMonthDropdownOpen(false);
    // Query will automatically refetch with new month
  };

  // Custom dot component for data points
  const CustomDot = (props) => {
    const { cx, cy } = props;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#2563eb"
        stroke="#fff"
        strokeWidth={2}
        className="transition-all duration-200 hover:r-6"
      />
    );
  };

  // Get chart title based on time range
  const getChartTitle = () => {
    switch(timeRange) {
      case 'Aujourd\'hui': return 'Ventes aujourd\'hui';
      case 'Cette semaine': return 'Ventes cette semaine';
      case 'mois':
        return `Ventes - ${monthOptions.find(m => m.value === selectedMonth)?.label || 'mois'}`;
      case 'Année': return `Ventes - ${selectedYear}`;
      default: return 'Aperçu des ventes';
    }
  };

  // Get chart subtitle based on time range
  const getChartSubtitle = () => {
    switch(timeRange) {
      case 'Aujourd\'hui': return 'Répartition horaire';
      case 'Cette semaine': return 'Répartition quotidienne';
      case 'mois': return 'Répartition hebdomadaire';
      case 'Année': return 'Répartition mensuelle';
      default: return '';
    }
  };

  // Check if we should show secondary selector
  const showYearSelector = timeRange === 'Année';
  const showMonthSelector = timeRange === 'mois';

  // Create unique key for chart transitions
  const chartKey = `${timeRange}-${selectedYear}-${selectedMonth}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* Header Section with dynamic title and dropdown */}
      <div className="p-4 sm:p-6 pb-3">
        <div className="flex flex-row items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{getChartTitle()}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{getChartSubtitle()}</p>
          </div>

          {/* Filter Controls Container - Always on the right */}
          <div className="flex flex-wrap items-center justify-end gap-2 flex-shrink-0 ml-auto">
            {/* Time Range Dropdown */}
            <div ref={dropdownRef} className="relative z-30">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="
                  flex items-center gap-1.5
                  bg-gray-50 hover:bg-gray-100
                  text-gray-700
                  text-xs font-medium
                  px-2.5 sm:px-3 py-1.5
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

            {/* Year Selector - Shows when "Année" is selected */}
            {showYearSelector && (
              <div ref={yearDropdownRef} className="relative z-20">
                <button
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="
                    flex items-center gap-1.5
                    bg-blue-50 hover:bg-blue-100
                    text-blue-700
                    text-xs font-medium
                    px-2.5 sm:px-3 py-1.5
                    rounded-lg
                    border border-blue-200
                    cursor-pointer
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    whitespace-nowrap
                  "
                >
                  <span className="text-left">{selectedYear}</span>
                  <motion.div
                    animate={{ rotate: isYearDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isYearDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="
                        absolute top-full left-0 mt-2
                        min-w-full
                        bg-white
                        border border-gray-200
                        rounded-lg
                        shadow-lg
                        overflow-hidden
                        z-50
                        max-h-[200px]
                        overflow-y-auto
                      "
                    >
                      {yearOptions.map((year) => (
                        <button
                          key={year}
                          onClick={() => handleYearChange(year)}
                          className={`
                            w-full
                            flex items-center justify-between
                            px-3 py-2
                            text-xs font-medium
                            text-left
                            transition-colors duration-150
                            whitespace-nowrap
                            ${selectedYear === year
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                            }
                          `}
                        >
                          <span>{year}</span>
                          {selectedYear === year && (
                            <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Month Selector - Shows when "mois" is selected */}
            {showMonthSelector && (
              <div ref={monthDropdownRef} className="relative z-20">
                <button
                  onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                  className="
                    flex items-center gap-1.5
                    bg-blue-50 hover:bg-blue-100
                    text-blue-700
                    text-xs font-medium
                    px-2.5 sm:px-3 py-1.5
                    rounded-lg
                    border border-blue-200
                    cursor-pointer
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    whitespace-nowrap
                  "
                >
                  <span className="text-left">
                    {monthOptions.find(m => m.value === selectedMonth)?.label || 'Mois'}
                  </span>
                  <motion.div
                    animate={{ rotate: isMonthDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isMonthDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="
                        absolute top-full right-0 mt-2
                        min-w-[120px]
                        bg-white
                        border border-gray-200
                        rounded-lg
                        shadow-lg
                        overflow-hidden
                        z-50
                        max-h-[200px]
                        overflow-y-auto
                        [&::-webkit-scrollbar]:hidden
                      "
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {monthOptions.map((month) => (
                        <button
                          key={month.value}
                          onClick={() => handleMonthChange(month.value)}
                          className={`
                            w-full
                            flex items-center justify-between
                            px-3 py-2
                            text-xs font-medium
                            text-left
                            transition-colors duration-150
                            whitespace-nowrap
                            ${selectedMonth === month.value
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                            }
                          `}
                        >
                          <span>{month.label}</span>
                          {selectedMonth === month.value && (
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
        </div>
      </div>

      {/* Chart Container with responsive padding */}
      <div className="px-2 sm:px-6 pb-4 sm:pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px] sm:h-[350px]">
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-500">Chargement du graphique...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-[250px] sm:h-[350px]">
            <div className="text-center max-w-md px-4">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-red-600 font-medium">Erreur de chargement</p>
              <p className="text-xs text-gray-500 mt-1">{error?.message || 'Une erreur est survenue'}</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={chartKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 250 : 350}>
                <LineChart
                  data={data}
                  margin={{
                    top: 20,
                    right: window.innerWidth < 640 ? 5 : 20,
                    left: window.innerWidth < 640 ? -20 : -10,
                    bottom: 20
                  }}
                >
                  <defs>
                    {/* Gradient for the line (optional) */}
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                    </linearGradient>
                  </defs>

                  {/* Minimal grid - horizontal lines only */}
                  <CartesianGrid
                    strokeDasharray="0"
                    stroke="#f3f4f6"
                    vertical={false}
                    horizontal={true}
                  />

              {/* Clean X-Axis */}
              <XAxis
                dataKey="name"
                stroke="transparent"
                style={{
                  fontSize: window.innerWidth < 640 ? '10px' : '13px',
                  fontWeight: '400',
                  fill: '#9ca3af'
                }}
                tickLine={false}
                axisLine={false}
                dy={10}
                interval={window.innerWidth < 640 ? 'preserveStartEnd' : 0}
              />

              {/* Clean Y-Axis */}
              <YAxis
                stroke="transparent"
                style={{
                  fontSize: window.innerWidth < 640 ? '10px' : '13px',
                  fontWeight: '400',
                  fill: '#9ca3af'
                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => window.innerWidth < 640 ? `${value}€` : `€${value}`}
                dx={0}
                width={window.innerWidth < 640 ? 35 : 60}
              />

              {/* Minimal Tooltip */}
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  padding: window.innerWidth < 640 ? '6px 10px' : '8px 12px',
                  fontSize: window.innerWidth < 640 ? '11px' : '13px',
                }}
                labelStyle={{
                  color: '#d1d5db',
                  fontWeight: '500',
                  fontSize: window.innerWidth < 640 ? '10px' : '11px',
                  marginBottom: '2px'
                }}
                itemStyle={{
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: window.innerWidth < 640 ? '12px' : '14px',
                  padding: '2px 0'
                }}
                formatter={(value) => [`€${value}`, '']}
                cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              />

              {/* Clean line with custom dots */}
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={window.innerWidth < 640 ? 2 : 3}
                dot={<CustomDot />}
                activeDot={{ r: window.innerWidth < 640 ? 5 : 7, fill: '#2563eb', stroke: '#fff', strokeWidth: window.innerWidth < 640 ? 2 : 3 }}
                isAnimationActive={false}
              />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
});

SalesChart.displayName = 'SalesChart';

export default SalesChart;
