import { defineStore } from "pinia";
import UmkmApi from "@/api/umkm";
import ProductApi from "@/api/product";

export const useUmkmProductStore = defineStore("umkmProduct", {
  state: () => ({
    statistics: {
      total_products: 0,
      total_orders: 0,
      total_revenue: 0,
      pending_orders: 0,
    },
    products: [],
    categories: [],
    meta: {
      total: 0,
      current_page: 1,
      last_page: 1,
      per_page: 10,
    },
    loading: false,
    initialized: false,
    umkmInfo: null,
  }),

  actions: {
    async fetchStatistics() {
      try {
        const { data } = await UmkmApi.getAnalytics();
        this.statistics = {
          total_products: data.total_products || 0,
          total_orders: data.total_orders || 0,
          total_revenue: data.total_revenue || 0,
          pending_orders: data.pending_orders || 0,
        };
        return data;
      } catch (error) {
        console.error("Error fetching umkm statistics:", error);
        throw error;
      }
    },

    async fetchMyProducts(filters = {}, page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          per_page: 10,
          ...filters
        };

        const { data } = await UmkmApi.getMyProducts(params);

        // Process products to ensure image URLs are complete
        this.products = data.data.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto),
          // Ensure category exists
          category: product.category || {
            id: 0,
            nama_kategori: 'Uncategorized',
            deskripsi: ''
          },
        }));

        this.meta = {
          total: data.meta?.total || 0,
          current_page: data.meta?.current_page || 1,
          last_page: data.meta?.last_page || 1,
          per_page: data.meta?.per_page || 10,
        };

        this.initialized = true;
        return data;
      } catch (error) {
        console.error("Error fetching my products:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        const { data } = await ProductApi.getCategories();
        this.categories = data.data || data;
        return this.categories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },

    async createProduct(productData) {
      try {
        const { data } = await ProductApi.createProduct(productData);

        // Add to local state
        const newProduct = {
          ...data,
          foto: this.processImageUrl(data.foto),
          category: data.category || {
            id: 0,
            nama_kategori: 'Uncategorized',
            deskripsi: ''
          },
        };

        this.products.unshift(newProduct);
        this.statistics.total_products++;

        return data;
      } catch (error) {
        console.error("Error creating product:", error);
        throw error;
      }
    },

    async updateProduct(productId, productData) {
      try {
        productData.append('_method', 'PUT'); // Tambahkan ini jika menggunakan FormData

        const { data } = await ProductApi.updateProduct(productId, productData);

        // Update local state
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
          this.products[index] = {
            ...this.products[index],
            ...data,
            foto: this.processImageUrl(data.foto || this.products[index].foto),
            category: data.category || this.products[index].category,
          };
        }


        return data;
      } catch (error) {
        console.error("Error updating product:", error);
        throw error;
      }
    },

    async deleteProduct(productId) {
      try {
        await ProductApi.deleteProduct(productId);

        // Remove from local state
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
          this.products.splice(index, 1);
          this.statistics.total_products--;
        }

        return true;
      } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
      }
    },

    async toggleProductStatus(productId) {
      try {
        const { data } = await ProductApi.toggleStatus(productId);

        // Update local state
        const product = this.products.find(p => p.id === productId);
        if (product) {
          product.is_active = data.is_active;
          product.foto = this.processImageUrl(data.foto || product.foto);
        }

        return data;
      } catch (error) {
        console.error("Error toggling product status:", error);
        throw error;
      }
    },

    async fetchUmkmInfo() {
      try {
        const { data } = await UmkmApi.getMyUmkm();
        this.umkmInfo = data;
        return data;
      } catch (error) {
        console.error("Error fetching umkm info:", error);
        throw error;
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
      const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000';

      // Untuk storage path dari Laravel
      if (fotoPath.startsWith('storage/')) {
        return `${baseUrl}/${fotoPath}`;
      }

      // Untuk path lainnya
      return `${baseUrl}/storage/${fotoPath}`;
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
      this.umkmInfo = null;
    }
  },

  getters: {
    hasProducts: (state) => state.products.length > 0,
    totalPages: (state) => state.meta.last_page,
    currentPage: (state) => state.meta.current_page,
    totalItems: (state) => state.meta.total,
    showLoading: (state) => state.loading && !state.initialized,
    activeProducts: (state) => state.products.filter(p => p.is_active).length,
    inactiveProducts: (state) => state.products.filter(p => !p.is_active).length,
    lowStockProducts: (state) => state.products.filter(p => p.stok < 10 && p.stok > 0).length,
    outOfStockProducts: (state) => state.products.filter(p => p.stok === 0).length,
  }
});
