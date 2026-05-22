import { createApiClient } from './apiClient';

const api = createApiClient();

const PERIOD_MAP = { '24h': 'HOURS_24', '7d': 'DAYS_7', '30d': 'DAYS_30' };

export const getPixelEvents = async (period = '24h') => {
  const response = await api.get('/api/admin/pixel/events', {
    params: { period: PERIOD_MAP[period] ?? 'HOURS_24' },
  });
  return response.data;
};
