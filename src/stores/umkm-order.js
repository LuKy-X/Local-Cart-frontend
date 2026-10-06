import { defineStore } from "pinia";
import UmkmOrderApi from "@/api/order";

export const useUmkmOrderStore = defineStore("umkmOrder", {
  state: () => ({
    statistics: {
      total_pending: 0,
      total_processing: 0,
      total_shipped: 0,
      total_delivered: 0,
      total_cancelled: 0,
    },
    orders: [],
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
        const { data } = await UmkmOrderApi.getUmkmOrderStatistics();
        this.statistics = data;
      } catch (e) {
        console.error("Gagal fetch statistics:", e);
        throw e;
      }
    },

    async fetchOrders(filters = {}, page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          per_page: 10,
          ...filters
        };
        const { data } = await UmkmOrderApi.getUmkmOrders(params);
        this.orders = data.data || data;
        this.meta = data.meta || {
          total: data.length || 0,
          current_page: 1,
          last_page: 1,
          per_page: 10,
        };
        this.initialized = true;
        return data;
      } catch (e) {
        console.error("Gagal fetch orders:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchOrderDetail(orderId) {
      try {
        const response = await UmkmOrderApi.getUmkmOrderDetail(orderId);
        const order = response.data.data || response.data;

        if (order.umkm?.foto_logo) {
          order.umkm.foto_logo = this.processImageUrl(order.umkm.foto_logo);
        }

        if (order.order_items && Array.isArray(order.order_items)) {
          order.order_items = order.order_items.map(item => {
            if (item.product) {
              return {
                ...item,
                product: {
                  ...item.product,
                  foto: this.processImageUrl(item.product.foto)
                }
              };
            }
            return item;
          });
        }
        return order;
      } catch (e) {
        console.error("Gagal fetch order detail:", e);
        throw e;
      }
    },

    async fetchShippers() {
      try {
        const { data } = await UmkmOrderApi.getAvailableShippers();
        this.shippers = data.data || data;
        return this.shippers;
      } catch (e) {
        console.error("Gagal fetch shippers:", e);
        throw e;
      }
    },

    async updateOrderStatus(orderId, status) {
      try {
        const { data } = await UmkmOrderApi.updateUmkmOrderStatus(orderId, status);
        return data;
      } catch (e) {
        console.error("Gagal update order status:", e);
        throw e;
      }
    },

    async updateShipper(orderId, shipperId) {
      try {
        const { data } = await UmkmOrderApi.updateOrderShipper(orderId, shipperId);
        console.log("Update shipper response:", data);
        return data;
      } catch (e) {
        console.error("Gagal update shipper:", e);
        throw e;
      }
    },

    processImageUrl(fotoPath) {
      if (!fotoPath) return null;

      const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000'
      const cleanPath = fotoPath.replace(/^storage\//, '')
      return `${baseUrl}/storage/${cleanPath}`
    },

    reset() {
      this.orders = [];
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
    hasOrders: (state) => state.orders.length > 0,
    totalPages: (state) => state.meta.last_page,
    currentPage: (state) => state.meta.current_page,
    totalItems: (state) => state.meta.total,
    showLoading: (state) => state.loading && !state.initialized,
  }
});
