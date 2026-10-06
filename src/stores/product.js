import { defineStore } from "pinia";
import ProductApi from "@/api/product";

export const useProductStore = defineStore("product", {
  state: () => ({
    statistics: {
      total_products: 0,
      active_products: 0,
      inactive_products: 0,
      out_of_stock_products: 0,
      products_with_ratings: 0,
      total_categories: 0,
    },
    products: [],
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
        const { data } = await ProductApi.getProductStatistics();
        this.statistics = data;
      } catch (e) {
        console.error("Gagal fetch statistics:", e);
        throw e;
      }
    },

    async fetchProducts(filters = {}, page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          per_page: 10,
          ...filters
        };
        const { data } = await ProductApi.getAdminList(params);

        // PROSES UTAMA: Mengubah path gambar menjadi URL lengkap
        this.products = data.data.map(product => ({
          ...product,
          // Jika 'foto' ada, tambahkan base URL
          foto: this.processImageUrl(product.foto)
        }));

        this.meta = data.meta;
        this.initialized = true;
        return data;
      } catch (e) {
        console.error("Gagal fetch products:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async toggleProductStatus(productId) {
      try {
        const { data } = await ProductApi.toggleStatus(productId);

        // Update local state
        const product = this.products.find(p => p.id === productId);
        if (product) {
          product.is_active = data.is_active;
          // Pastikan foto tetap memiliki URL lengkap
          if (data.foto && !data.foto.startsWith('http')) {
            product.foto = this.processImageUrl(data.foto);
          }
        }
        return data;
      } catch (e) {
        console.error("Gagal toggle product status:", e);
        throw e;
      }
    },

    // Helper function untuk mengubah path gambar menjadi URL lengkap
    processImageUrl(fotoPath) {
      if (!fotoPath) {
        return null;
      }

      // Jika sudah URL lengkap (http/https), kembalikan langsung
      if (fotoPath.startsWith('http')) {
        return fotoPath;
      }

      // Jika hanya nama file atau path relatif, tambahkan base URL
      // Ganti dengan base URL API Anda (sesuaikan dengan environment)
      const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000';

      // Hapus awalan 'storage/' jika ada (karena sudah di handle oleh Laravel)
      const cleanPath = fotoPath.replace(/^storage\//, '');

      return `${baseUrl}/storage/${cleanPath}`;
    },

    reset() {
      this.products = [];
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
    hasProducts: (state) => state.products.length > 0,
    totalPages: (state) => state.meta.last_page,
    currentPage: (state) => state.meta.current_page,
    totalItems: (state) => state.meta.total,
    showLoading: (state) => state.loading && !state.initialized,
  }
});
