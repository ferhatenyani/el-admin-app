import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Modern minimalist SalesChart component
 * Features:
 * - Clean line chart design matching modern UI standards
 * - Receives data and time range from parent component
 * - Individual time filter dropdown in top-right corner
 * - Simplified header with clear title
 * - Minimal grid lines for cleaner look
 * - Custom dots on data points
 * - Refined tooltip styling
 * - Smooth blue color scheme
 * - Responsive design with proper spacing
 */
const SalesChart = ({ data = [], timeRange = 'Ce mois-ci', onTimeRangeChange = null }) => {
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const timeRangeOptions = ['Aujourd\'hui', 'Cette semaine', 'Ce mois-ci'];

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

  // Handle time range change
  const handleTimeRangeChange = (newTimeRange) => {
    setIsDropdownOpen(false);
    if (onTimeRangeChange) {
      onTimeRangeChange(newTimeRange);
    }
  };

  // Custom dot component for data points
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;

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
      case 'Ce mois-ci': return 'Ventes ce mois-ci';
      default: return 'Aperçu des ventes';
    }
  };

  // Get chart subtitle based on time range
  const getChartSubtitle = () => {
    switch(timeRange) {
      case 'Aujourd\'hui': return 'Répartition horaire';
      case 'Cette semaine': return 'Répartition quotidienne';
      case 'Ce mois-ci': return 'Répartition hebdomadaire';
      default: return '';
    }
  };

  return (
    <motion.div
      key={timeRange} // Re-animate when time range changes
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {/* Header Section with dynamic title and dropdown */}
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{getChartTitle()}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{getChartSubtitle()}</p>
          </div>

          {/* Time Range Dropdown */}
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
        </div>
      </div>

      {/* Chart Container with minimal padding */}
      <div className="px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chargement du graphique...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
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
                  fontSize: '13px',
                  fontWeight: '400',
                  fill: '#9ca3af'
                }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />

              {/* Clean Y-Axis */}
              <YAxis
                stroke="transparent"
                style={{
                  fontSize: '13px',
                  fontWeight: '400',
                  fill: '#9ca3af'
                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `€${value}`}
                dx={0}
              />

              {/* Minimal Tooltip */}
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  padding: '8px 12px',
                  fontSize: '13px',
                }}
                labelStyle={{
                  color: '#d1d5db',
                  fontWeight: '500',
                  fontSize: '11px',
                  marginBottom: '2px'
                }}
                itemStyle={{
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '14px',
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
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 7, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default SalesChart;
