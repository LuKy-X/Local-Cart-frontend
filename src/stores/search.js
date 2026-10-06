import { defineStore } from "pinia"
import searchApi from "@/api/search"
import { useProductStore } from "@/stores/public-products"

export const useSearchStore = defineStore("search", {
  state: () => ({
    // Products search results
    searchProducts: [],
    productPagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    },

    // UMKM search results
    searchUmkms: [],
    umkmPagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    },

    // Counts for both tabs (always calculated)
    productCount: 0,
    umkmCount: 0,

    // Search query and state
    searchQuery: '',
    activeTab: 'products', // 'products' or 'umkms'
    loading: false,
    searchPerformed: false,

    // Filters
    productFilters: {},
    umkmFilters: {},
  }),

  getters: {
    hasMoreProducts: (state) =>
      state.productPagination.current_page < state.productPagination.last_page,

    hasMoreUmkms: (state) =>
      state.umkmPagination.current_page < state.umkmPagination.last_page,

    totalResults: (state) => {
      if (state.activeTab === 'products') {
        return state.productPagination.total
      }
      return state.umkmPagination.total
    },

    // Get counts for tabs
    productsTabCount: (state) => state.productCount,
    umkmsTabCount: (state) => state.umkmCount,
  },

  actions: {
    async performSearch(query, tab = 'products') {
      this.searchQuery = query
      this.activeTab = tab
      this.searchPerformed = true
      this.loading = true

      try {
        // Perform main search for active tab
        if (tab === 'products') {
          await this.searchProductsByQuery(query)
        } else {
          await this.searchUmkmsByQuery(query)
        }

        // Always fetch counts for both tabs in parallel
        await this.fetchCountsForBothTabs(query)

      } catch (error) {
        console.error('Search error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Fetch counts for both tabs (always called)
    async fetchCountsForBothTabs(query) {
      try {
        await Promise.all([
          this.fetchProductCount(query),
          this.fetchUmkmCount(query)
        ])
      } catch (error) {
        console.error('Error fetching counts:', error)
      }
    },

    // Fetch only product count
    async fetchProductCount(query) {
      try {
        const { data } = await searchApi.searchProducts({
          q: query,
          page: 1,
          per_page: 1 // Only need to get total count
        })

        this.productCount = data.meta?.total || 0
        return data.meta?.total || 0
      } catch (error) {
        console.error('Error fetching product count:', error)
        this.productCount = 0
        return 0
      }
    },

    // Fetch only UMKM count
    async fetchUmkmCount(query) {
      try {
        const { data } = await searchApi.searchUmkms({
          q: query,
          page: 1,
          per_page: 1 // Only need to get total count
        })

        this.umkmCount = data.meta?.total || 0
        return data.meta?.total || 0
      } catch (error) {
        console.error('Error fetching UMKM count:', error)
        this.umkmCount = 0
        return 0
      }
    },

    async searchProductsByQuery(query, filters = {}) {
      this.loading = true
      try {
        const { data } = await searchApi.searchProducts({
          q: query,
          ...filters,
          page: 1
        })

        this.searchProducts = data.data.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto)
        }))

        if (data.meta) {
          this.productPagination = {
            current_page: data.meta.current_page,
            last_page: data.meta.last_page,
            per_page: data.meta.per_page,
            total: data.meta.total
          }
          this.productCount = data.meta.total // Update count as well
        }

        this.productFilters = filters
        return data
      } catch (error) {
        console.error('Error searching products:', error)

        // Fallback to empty results on error
        this.searchProducts = []
        this.productPagination = {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0
        }
        this.productCount = 0

        throw error
      } finally {
        this.loading = false
      }
    },

    async searchUmkmsByQuery(query, filters = {}) {
      this.loading = true
      try {
        const { data } = await searchApi.searchUmkms({
          q: query,
          ...filters,
          page: 1
        })

        this.searchUmkms = data.data.map(umkm => ({
          ...umkm,
          foto_logo: umkm.foto_logo || this.getUmkmPlaceholderImage()
        }))

        if (data.meta) {
          this.umkmPagination = {
            current_page: data.meta.current_page,
            last_page: data.meta.last_page,
            per_page: data.meta.per_page,
            total: data.meta.total
          }
          this.umkmCount = data.meta.total // Update count as well
        }

        this.umkmFilters = filters
        return data
      } catch (error) {
        console.error('Error searching UMKM:', error)

        // Fallback to empty results on error
        this.searchUmkms = []
        this.umkmPagination = {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0
        }
        this.umkmCount = 0

        throw error
      } finally {
        this.loading = false
      }
    },

    async loadMoreProducts() {
      if (!this.hasMoreProducts) return

      try {
        const nextPage = this.productPagination.current_page + 1
        const { data } = await searchApi.searchProducts({
          q: this.searchQuery,
          ...this.productFilters,
          page: nextPage
        })

        const newProducts = data.data.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto)
        }))

        this.searchProducts = [...this.searchProducts, ...newProducts]

        if (data.meta) {
          this.productPagination = {
            current_page: data.meta.current_page,
            last_page: data.meta.last_page,
            per_page: data.meta.per_page,
            total: data.meta.total
          }
        }

        return data
      } catch (error) {
        console.error('Error loading more products:', error)
        throw error
      }
    },

    async loadMoreUmkms() {
      if (!this.hasMoreUmkms) return

      try {
        const nextPage = this.umkmPagination.current_page + 1
        const { data } = await searchApi.searchUmkms({
          q: this.searchQuery,
          ...this.umkmFilters,
          page: nextPage
        })

        const newUmkms = data.data.map(umkm => ({
          ...umkm,
          foto_logo: umkm.foto_logo || this.getUmkmPlaceholderImage()
        }))

        this.searchUmkms = [...this.searchUmkms, ...newUmkms]

        if (data.meta) {
          this.umkmPagination = {
            current_page: data.meta.current_page,
            last_page: data.meta.last_page,
            per_page: data.meta.per_page,
            total: data.meta.total
          }
        }

        return data
      } catch (error) {
        console.error('Error loading more UMKM:', error)
        throw error
      }
    },

    setActiveTab(tab) {
      this.activeTab = tab
      if (this.searchQuery && this.searchPerformed) {
        if (tab === 'products') {
          this.searchProductsByQuery(this.searchQuery, this.productFilters)
        } else {
          this.searchUmkmsByQuery(this.searchQuery, this.umkmFilters)
        }
      }
    },

    async updateProductFilters(filters) {
      this.productFilters = filters
      if (this.searchQuery) {
        await this.searchProductsByQuery(this.searchQuery, filters)
        // Update UMKM count with current filters (if applicable)
        await this.fetchUmkmCount(this.searchQuery)
      }
    },

    async updateUmkmFilters(filters) {
      this.umkmFilters = filters
      if (this.searchQuery) {
        await this.searchUmkmsByQuery(this.searchQuery, filters)
        // Update product count with current filters (if applicable)
        await this.fetchProductCount(this.searchQuery)
      }
    },

    clearSearch() {
      this.searchQuery = ''
      this.searchProducts = []
      this.searchUmkms = []
      this.searchPerformed = false
      this.productFilters = {}
      this.umkmFilters = {}
      this.productCount = 0
      this.umkmCount = 0
      this.productPagination = {
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0
      }
      this.umkmPagination = {
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0
      }
    },

    // Helper function untuk mengubah path gambar menjadi URL lengkap
    processImageUrl(imagePath) {
      if (!imagePath) {
        return null
      }

      if (imagePath.startsWith('http')) {
        return imagePath
      }

      const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000'
      const cleanPath = imagePath.replace(/^storage\//, '')
      return `${baseUrl}/storage/${cleanPath}`
    },

    getUmkmPlaceholderImage() {
      return 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
  }
})
