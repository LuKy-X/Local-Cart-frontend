// stores/customer.js
import { defineStore } from "pinia";
import CustomerApi from "@/api/customer";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    statistics: {
      total_customers: 0,
      total_with_orders: 0,
      total_with_ratings: 0,
      new_customers_this_month: 0,
    },
    customers: [],
    meta: {
      total: 0,
      current_page: 1,
      last_page: 1,
      per_page: 10,
    },
    loading: false,
    initialized: false,
  }),

  actions: {
    async fetchStatistics() {
      try {
        const { data } = await CustomerApi.getCustomerStatistics();
        this.statistics = data;
      } catch (e) {
        console.error("Gagal fetch statistics:", e);
        throw e;
      }
    },

    async fetchCustomers(filters = {}, page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          per_page: 10,
          ...filters
        };
        const { data } = await CustomerApi.getAdminList(params);
        this.customers = data.data;
        this.meta = data.meta;
        this.initialized = true;
        return data;
      } catch (e) {
        console.error("Gagal fetch customers:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    reset() {
      this.customers = [];
      this.meta = {
        total: 0,
        current_page: 1,
        last_page: 1,
        per_page: 10,
      };
      this.loading = false;
      this.initialized = false;
    }
  },

  getters: {
    hasCustomers: (state) => state.customers.length > 0,
    totalPages: (state) => state.meta.last_page,
    currentPage: (state) => state.meta.current_page,
    totalItems: (state) => state.meta.total,
    showLoading: (state) => state.loading && ! state.initialized,
  }
});
