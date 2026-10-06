import { defineStore } from "pinia";
import UmkmDashboardApi from "@/api/dashboard";

export const useUmkmDashboardStore = defineStore("umkmDashboard", {
  state: () => ({
    dashboardData: {
      totalRevenue: 0,
      totalOrders: 0,
      activeProducts: 0,
      averageRating: 0,
      pendingOrders: 0,
      lowStockProducts: 0
    },
    monthlyRevenue: [],
    orderStatuses: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    },
    recentOrders: [],
    topProducts: [],
    recentReviews: [],
    todayStats: {
      todayOrders: 0,
      todayRevenue: 0,
      productViews: 0
    },
    umkmInfo: null,
    loading: false,
    initialized: false
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true;
      try {
        const { data } = await UmkmDashboardApi.getDashboardData();

        // Update dashboard data
        this.dashboardData = {
          totalRevenue: data.total_revenue || 0,
          totalOrders: data.total_orders || 0,
          activeProducts: data.active_products || 0,
          averageRating: data.average_rating || 0,
          pendingOrders: data.pending_orders || 0,
          lowStockProducts: data.low_stock_products || 0
        };

        // Update order statuses
        if (data.order_statuses) {
          this.orderStatuses = data.order_statuses;
        }

        // Update recent orders
        if (data.recent_orders) {
          this.recentOrders = data.recent_orders;
        }

        // Update top products
        if (data.top_products) {
          this.topProducts = data.top_products;
        }

        // Update recent reviews
        if (data.recent_reviews) {
          this.recentReviews = data.recent_reviews;
        }

        // Update today stats
        if (data.today_stats) {
          this.todayStats = data.today_stats;
        }

        // Update UMKM info
        if (data.umkm_info) {
          this.umkmInfo = data.umkm_info;
        }

        this.initialized = true;
        return data;
      } catch (e) {
        console.error("Gagal fetch dashboard data:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchMonthlyRevenue() {
      try {
        const { data } = await UmkmDashboardApi.getMonthlyRevenue();
        this.monthlyRevenue = data.data || data;
        return this.monthlyRevenue;
      } catch (e) {
        console.error("Gagal fetch monthly revenue:", e);
        throw e;
      }
    },

    async fetchRecentOrders() {
      try {
        const { data } = await UmkmDashboardApi.getRecentOrders();
        this.recentOrders = data.data || data;
        return this.recentOrders;
      } catch (e) {
        console.error("Gagal fetch recent orders:", e);
        throw e;
      }
    },

    async fetchTopProducts() {
      try {
        const { data } = await UmkmDashboardApi.getTopProducts();
        this.topProducts = data.data || data;
        return this.topProducts;
      } catch (e) {
        console.error("Gagal fetch top products:", e);
        throw e;
      }
    },

    async fetchRecentReviews() {
      try {
        const { data } = await UmkmDashboardApi.getRecentReviews();
        this.recentReviews = data.data || data;
        return this.recentReviews;
      } catch (e) {
        console.error("Gagal fetch recent reviews:", e);
        throw e;
      }
    },

    async fetchTodayStats() {
      try {
        const { data } = await UmkmDashboardApi.getTodayStats();
        this.todayStats = data.data || data;
        return this.todayStats;
      } catch (e) {
        console.error("Gagal fetch today stats:", e);
        throw e;
      }
    },

    reset() {
      this.dashboardData = {
        totalRevenue: 0,
        totalOrders: 0,
        activeProducts: 0,
        averageRating: 0,
        pendingOrders: 0,
        lowStockProducts: 0
      };
      this.monthlyRevenue = [];
      this.orderStatuses = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };
      this.recentOrders = [];
      this.topProducts = [];
      this.recentReviews = [];
      this.todayStats = {
        todayOrders: 0,
        todayRevenue: 0,
        productViews: 0
      };
      this.umkmInfo = null;
      this.loading = false;
      this.initialized = false;
    }
  },

  getters: {
    totalRevenueChart: (state) => {
      return state.monthlyRevenue.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
    },
    maxRevenueValue: (state) => {
      if (!state.monthlyRevenue.length) return 0;
      const revenues = state.monthlyRevenue.map(item => {
        const revenue = Number(item.revenue);
        return isNaN(revenue) ? 0 : revenue;
      });
      const max = Math.max(...revenues);
      return max === 0 ? 1 : max;
    },
    totalOrdersByStatus: (state) => {
      const statuses = state.orderStatuses;
      return Object.values(statuses).reduce((sum, count) => sum + (count || 0), 0);
    },
    isDataLoaded: (state) => state.initialized && !state.loading
  }
});
