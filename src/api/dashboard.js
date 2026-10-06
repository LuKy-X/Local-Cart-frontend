import api from './axios';

export default {
  getDashboardStatistics() {
    return api.get('dashboard/statistics');
  },

  getDashboardCharts() {
    return api.get('dashboard/charts');
  },

  getQuickStats() {
    return api.get('dashboard/quick-stats');
  },


  // ================UMKM=================
  getDashboardData() {
    return api.get('umkm/dashboard');
  },

  getMonthlyRevenue() {
    return api.get('umkm/dashboard/monthly-revenue');
  },

  getRecentOrders() {
    return api.get('umkm/dashboard/recent-orders');
  },

  getTopProducts() {
    return api.get('umkm/dashboard/top-products');
  },

  getRecentReviews() {
    return api.get('umkm/dashboard/recent-reviews');
  },

  getTodayStats() {
    return api.get('umkm/dashboard/today-stats');
  },
};
