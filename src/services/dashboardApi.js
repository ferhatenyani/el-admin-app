import { createApiClient } from './apiClient';

const api = createApiClient();

/**
 * Map frontend time range to backend time range enum
 * Frontend: 'Aujourd'hui', 'Cette semaine', 'Ce mois-ci'
 * Backend: 'TODAY', 'THIS_WEEK', 'THIS_MONTH'
 * @param {string} frontendTimeRange - Time range from frontend
 * @returns {string} Backend time range enum value
 */
const mapTimeRangeToBackend = (frontendTimeRange) => {
  const timeRangeMap = {
    "Aujourd'hui": 'TODAY',
    'Cette semaine': 'THIS_WEEK',
    'Ce mois-ci': 'THIS_MONTH',
  };
  return timeRangeMap[frontendTimeRange] || 'THIS_MONTH';
};

/**
 * Map frontend sales period to backend period enum
 * Frontend: 'Aujourd'hui', 'Cette semaine', 'mois', 'Année'
 * Backend: 'TODAY', 'THIS_WEEK', 'MONTH', 'YEAR'
 * @param {string} frontendPeriod - Sales period from frontend
 * @returns {string} Backend period enum value
 */
const mapSalesPeriodToBackend = (frontendPeriod) => {
  const periodMap = {
    "Aujourd'hui": 'TODAY',
    'Cette semaine': 'THIS_WEEK',
    'mois': 'MONTH',
    'Année': 'YEAR',
  };
  return periodMap[frontendPeriod] || 'MONTH';
};

/**
 * Get dashboard statistics
 * Backend endpoint: GET /api/dashboard/stats?timeRange={TODAY|THIS_WEEK|THIS_MONTH}
 * @param {string} timeRange - Time range filter ('Aujourd'hui', 'Cette semaine', 'Ce mois-ci')
 * @returns {Promise<Object>} Dashboard stats DTO
 */
export const getDashboardStats = async (timeRange = 'Ce mois-ci') => {
  const backendTimeRange = mapTimeRangeToBackend(timeRange);
  const response = await api.get('/api/dashboard/stats', {
    params: { timeRange: backendTimeRange },
  });
  return response.data;
};

/**
 * Get sales chart data
 * Backend endpoint: GET /api/dashboard/sales?period={TODAY|THIS_WEEK|MONTH|YEAR}&year={year}&month={month}
 * @param {string} period - Period type ('Aujourd'hui', 'Cette semaine', 'mois', 'Année')
 * @param {number} year - Year for YEAR or MONTH period (optional)
 * @param {number} month - Month for MONTH period (optional, 1-12)
 * @returns {Promise<Array>} Array of sales data points
 */
export const getSalesChartData = async (period = 'mois', year = null, month = null) => {
  const backendPeriod = mapSalesPeriodToBackend(period);

  const params = {
    period: backendPeriod,
  };

  // Add year parameter for YEAR or MONTH period
  if ((backendPeriod === 'YEAR' || backendPeriod === 'MONTH') && year) {
    params.year = year;
  }

  // Add month parameter for MONTH period
  if (backendPeriod === 'MONTH' && month) {
    params.month = month;
  }

  const response = await api.get('/api/dashboard/sales', { params });
  return response.data;
};

export default {
  getDashboardStats,
  getSalesChartData,
};
