import { defineStore } from "pinia";
import ShipperApi from "@/api/shipper";

export const useShipperStore = defineStore("shipper", {
  state: () => ({
    statistics: {
      total_shippers: 0,
      shippers_with_orders: 0,
      shippers_without_orders: 0,
      total_orders: 0,
      most_orders_shipper: null,
      average_orders_per_shipper: 0,
    },
    shippers: [],
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
        const { data } = await ShipperApi.getShipperStatistics();
        this.statistics = data;
      } catch (e) {
        console.error("Gagal fetch statistics:", e);
        throw e;
      }
    },

    async fetchShippers(filters = {}, page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          per_page: 10,
          ...filters
        };
        const { data } = await ShipperApi.getAdminList(params);
        this.shippers = data.data;
        this.meta = data.meta;
        this.initialized = true;
        return data;
      } catch (e) {
        console.error("Gagal fetch shippers:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchShipperDetail(shipperId) {
      try {
        const response = await ShipperApi.getShipperDetail(shipperId)
        return response.data || response
      } catch (e) {
        console.error("Gagal fetch shipper detail:", e)
        throw e
      }
    },

    async createShipper(shipperData) {
      try {
        const { data } = await ShipperApi.createShipper(shipperData);
        return data;
      } catch (e) {
        console.error("Gagal create shipper:", e);
        throw e;
      }
    },

    async updateShipper(shipperId, shipperData) {
      try {
        const { data } = await ShipperApi.updateShipper(shipperId, shipperData);
        return data;
      } catch (e) {
        console.error("Gagal update shipper:", e);
        throw e;
      }
    },

    async deleteShipper(shipperId) {
      try {
        await ShipperApi.deleteShipper(shipperId);
      } catch (e) {
        console.error("Gagal delete shipper:", e);
        throw e;
      }
    },

    reset() {
      this.shippers = [];
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
    hasShippers: (state) => state.shippers.length > 0,
    totalPages: (state) => state.meta.last_page,
    currentPage: (state) => state.meta.current_page,
    totalItems: (state) => state.meta.total,
    showLoading: (state) => state.loading && !state.initialized,
  }
});
