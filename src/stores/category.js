import { defineStore } from "pinia";
import CategoryApi from "@/api/category";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    statistics: {
      total_categories: 0,
      categories_with_products: 0,
      total_products: 0,
      average_products_per_category: 0,
    },
    categories: [],
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
        const { data } = await CategoryApi.getCategoryStatistics();
        this.statistics = data;
      } catch (e) {
        console.error("Gagal fetch statistics:", e);
        throw e;
      }
    },

    async fetchCategories(filters = {}, page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          per_page: 10,
          ...filters
        };
        const { data } = await CategoryApi.getAdminList(params);
        this.categories = data.data;
        this.meta = data.meta;
        this.initialized = true;
        return data;
      } catch (e) {
        console.error("Gagal fetch categories:", e);
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchCategoryDetail(categoryId) {
      try {
        const response = await CategoryApi.getCategoryDetail(categoryId)
        const kategori = response.data.data
        kategori.products = kategori.products.map(item => ({
          ...item,
          foto: this.processImageUrl(item.foto)
        }))
        return kategori || response
      } catch (e) {
        console.error("Gagal fetch category detail:", e)
        throw e
      }
    },

    async createCategory(categoryData) {
      try {
        const { data } = await CategoryApi.createCategory(categoryData);
        return data;
      } catch (e) {
        console.error("Gagal create category:", e);
        throw e;
      }
    },

    async updateCategory(categoryId, categoryData) {
      try {
        const { data } = await CategoryApi.updateCategory(categoryId, categoryData);
        return data;
      } catch (e) {
        console.error("Gagal update category:", e);
        throw e;
      }
    },

    async deleteCategory(categoryId) {
      try {
        await CategoryApi.deleteCategory(categoryId);
      } catch (e) {
        console.error("Gagal delete category:", e);
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
      this.categories = [];
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
    hasCategories: (state) => state.categories.length > 0,
    totalPages: (state) => state.meta.last_page,
    currentPage: (state) => state.meta.current_page,
    totalItems: (state) => state.meta.total,
    showLoading: (state) => state.loading && !state.initialized,
  }
});
