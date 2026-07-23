import api from './api';

export const reportService = {
  getDashboardStats: async () => {
    return await api.get('/reports/dashboard');
  },
  getChartData: async () => {
    return await api.get('/reports/charts');
  },
};

export default reportService;
