import { defineStore } from "pinia";
import UmkmApi from "@/api/umkm";

export const useUmkmStore = defineStore("umkm", {
  state: () => ({
    statistics: {
      total_umkms: 0,
      total_pending: 0,
      total_approved: 0,
    },
    umkms: [],
    meta: {
      total: 0,
      current_page: 1,
      last_page: 1,
      per_page: 10,
    },
    loading: false,
    initialized: false, // Tambahkan ini
  }),

  actions: {
    async fetchStatistics() {
      try {
        const { data } = await UmkmApi.getUmkmsStatistics();
        this.statistics = data;
      } catch (e) {
        console.error("Gagal fetch statistics:", e);
        throw e;
      }
    },

    async fetchUmkms(filters = {}, page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          per_page: 10,
          ...filters
        };
        const { data } = await UmkmApi.getAdminList(params);

        this.umkms = data.data
        this.meta = data.meta;
        this.initialized = true; // Set initialized
        return data;
      } catch (e) {
        console.error("Gagal fetch umkms:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async approveUmkm(umkmId) {
      this.loading = true;
      try {
        await UmkmApi.approveUmkm(umkmId);
        await this.fetchStatistics();
      } catch (e) {
        console.error("Gagal approve umkm:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async rejectUmkm(umkmId) {
      this.loading = true;
      try {
        await UmkmApi.rejectUmkm(umkmId);
        await this.fetchStatistics();
      } catch (e) {
        console.error("Gagal reject umkm:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    processImageUrl(fotoPath) {
      if (!fotoPath) return null;

      const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000'
      const cleanPath = fotoPath.replace(/^storage\//, '')
      return `${baseUrl}/storage/${cleanPath}`
    },

    // Reset state
    reset() {
      this.umkms = [];
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
    hasUmkms: (state) => state.umkms.length > 0,
    totalPages: (state) => state.meta.last_page,
    currentPage: (state) => state.meta.current_page,
    totalItems: (state) => state.meta.total,
    showLoading: (state) => state.loading && ! state.initialized,
  }
});
