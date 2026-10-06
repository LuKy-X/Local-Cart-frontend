import { defineStore } from "pinia";
import KecamatanApi from "@/api/kecamatan";

export const useKecamatanStore = defineStore("kecamatan", {
  state: () => ({
    statistics: {
      total_kecamatans: 0,
      kecamatans_with_umkm: 0,
      kecamatans_with_customers: 0,
      kecamatans_without_data: 0,
      most_umkm_kecamatan: null,
      most_customer_kecamatan: null,
    },
    kecamatans: [],
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
        const { data } = await KecamatanApi.getKecamatanStatistics();
        this.statistics = data;
      } catch (e) {
        console.error("Gagal fetch statistics:", e);
        throw e;
      }
    },

    async fetchKecamatans(filters = {}, page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          per_page: 10,
          ...filters
        };
        const { data } = await KecamatanApi.getAdminList(params);
        this.kecamatans = data.data;
        this.meta = data.meta;
        this.initialized = true;
        return data;
      } catch (e) {
        console.error("Gagal fetch kecamatans:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchKecamatanDetail(kecamatanId) {
      try {
        const response = await KecamatanApi.getKecamatanDetail(kecamatanId)
        return response.data || response
      } catch (e) {
        console.error("Gagal fetch kecamatan detail:", e)
        throw e
      }
    },

    async createKecamatan(kecamatanData) {
      try {
        const { data } = await KecamatanApi.createKecamatan(kecamatanData);
        return data;
      } catch (e) {
        console.error("Gagal create kecamatan:", e);
        throw e;
      }
    },

    async updateKecamatan(kecamatanId, kecamatanData) {
      try {
        const { data } = await KecamatanApi.updateKecamatan(kecamatanId, kecamatanData);
        return data;
      } catch (e) {
        console.error("Gagal update kecamatan:", e);
        throw e;
      }
    },

    async deleteKecamatan(kecamatanId) {
      try {
        await KecamatanApi.deleteKecamatan(kecamatanId);
      } catch (e) {
        console.error("Gagal delete kecamatan:", e);
        throw e;
      }
    },

    reset() {
      this.kecamatans = [];
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
    hasKecamatans: (state) => state.kecamatans.length > 0,
    totalPages: (state) => state.meta.last_page,
    currentPage: (state) => state.meta.current_page,
    totalItems: (state) => state.meta.total,
    showLoading: (state) => state.loading && !state.initialized,
  }
});
