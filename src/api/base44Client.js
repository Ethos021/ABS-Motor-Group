import apiClient from './apiClient.js';

export const base44 = {
  entities: {
    Staff: {
      list: () => apiClient.list('staff'),
    },
  },
};
