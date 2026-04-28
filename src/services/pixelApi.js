import { createApiClient } from './apiClient';

const api = createApiClient();

export const getPixelEvents = async () => {
  const response = await api.get('/api/admin/pixel/events');
  return response.data;
};
