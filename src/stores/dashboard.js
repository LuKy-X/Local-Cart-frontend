import { defineStore } from "pinia";
import DashboardApi from "@/api/dashboard";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    // State minimal untuk loading cepat
    quickStats: {
      total_customers: 0,
      total_umkms: 0,
      total_products: 0,
      total_orders: 0,
      pending_orders: 0,
      pending_umkms: 0,
    },

    // Data lengkap akan di-load setelah quick stats
    statistics: {
      basic_stats: {
        total_customers: 0,
        total_umkms: 0,
        total_products: 0,
        total_categories: 0,
        total_orders: 0,
        total_ratings: 0,
      },
      order_statuses: {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      },
      umkm_statuses: {
        approved: 0,
        pending: 0,
      },
      recent_data: {
        customers: [],
        umkms: [],
        orders: [],
      },
    },

    charts: {
      order_chart: [],
      top_umkms: [],
      top_products: [],
    },

    loading: false,
    quickStatsLoaded: false,
    fullDataLoaded: false,
  }),

  actions: {
    // Load data cepat dulu
    async fetchQuickStats() {
      try {
        const { data } = await DashboardApi.getQuickStats();
        this.quickStats = data;
        this.quickStatsLoaded = true;
        return data;
      } catch (e) {
        console.error("Gagal fetch quick stats:", e);
        throw e;
      }
    },

    // Load data lengkap setelah quick stats
    async fetchDashboardData() {
      if (this.fullDataLoaded) return;

      this.loading = true;
      try {
        // Load statistik dan charts secara paralel
        const [statsResponse, chartsResponse] = await Promise.all([
          DashboardApi.getDashboardStatistics(),
          DashboardApi.getDashboardCharts(),
        ]);

        this.statistics = statsResponse.data;
        this.charts = chartsResponse.data;
        this.fullDataLoaded = true;
      } catch (e) {
        console.error("Gagal fetch dashboard data:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    // Refresh data tertentu saja
    async refreshStatistics() {
      try {
        const { data } = await DashboardApi.getDashboardStatistics();
        this.statistics = data;
      } catch (e) {
        console.error("Gagal refresh statistics:", e);
      }
    },

    async refreshCharts() {
      try {
        const { data } = await DashboardApi.getDashboardCharts();
        this.charts = data;
      } catch (e) {
        console.error("Gagal refresh charts:", e);
      }
    },

    // Reset state
    reset() {
      this.quickStatsLoaded = false;
      this.fullDataLoaded = false;
      this.loading = false;
    }
  },

  getters: {
    isLoading: (state) => state.loading,
    isQuickStatsLoaded: (state) => state.quickStatsLoaded,
    isFullDataLoaded: (state) => state.fullDataLoaded,

    // Getter untuk data yang sering digunakan
    totalPendingOrders: (state) => state.quickStats.pending_orders,
    totalPendingUmkms: (state) => state.quickStats.pending_umkms,

    // Status ringkasan
    summaryStatus: (state) => ({
      customers: state.quickStats.total_customers,
      umkms: state.quickStats.total_umkms,
      products: state.quickStats.total_products,
      orders: state.quickStats.total_orders,
      pendingOrders: state.quickStats.pending_orders,
      pendingUmkms: state.quickStats.pending_umkms,
    }),
  },
});
