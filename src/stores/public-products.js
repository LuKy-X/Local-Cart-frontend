import { defineStore } from "pinia"
import productApi from "@/api/product"
import { normalizeProduct } from "@/utils/normalizeProduct"
import api from "@/api/axios"
import umkm from "@/api/umkm"

export const useProductStore = defineStore("products", {
  state: () => ({
    featuredProducts: [],
    newProducts: [],
    popularProducts: [],
    mostViewedProducts: [],
    allProducts: [],
    categories: [],
    umkms: [],
    kecamatans: [],
    productDetail: null,
    categories: [],
    umkmCount: 0,
    productCount: 0,
    categoryCount: 0,

    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0
    },

    loading: false,
    initialized: false
  }),

  getters: {
    hasMoreProducts: (state) =>
      state.pagination.current_page < state.pagination.last_page,

    showLoading: (state) =>
      state.loading && !state.initialized
  },

  actions: {
    async home() {
      this.loading = true
      try {
        const { data } = await productApi.getHome()
        this.featuredProducts = data.featured_products.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto)
        }))
        this.newProducts = data.new_products.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto)
        }))
        this.popularProducts = data.popular_products.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto)
        }))
        this.mostViewedProducts = data.most_viewed_products.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto)
        }))
        this.categories = data.categories || []
        this.umkmCount = data.umkm_count
        this.productCount = data.product_count
        this.categoryCount = data.category_count
        return data
      } catch (e) {
        console.error("Error fetching home data:", e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchFeaturedProducts() {
      this.loading = true
      try {
        const { data } = await productApi.getFeaturedProducts()
        this.featuredProducts = data.data.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto)
        }))

        return data
      } catch (e) {
        console.error("Error fetching featured products:", e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchNewProducts() {
      this.loading = true
      try {
        const { data } = await productApi.getNewProducts()
        this.newProducts = data.data.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto)
        }))
        return data
      } catch (e) {
        console.error("Error fetching new products:", e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchPopularProducts() {
      this.loading = true
      try {
        const { data } = await productApi.getPopularProducts()
        this.popularProducts = data.data.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto)
        }))
        return data
      } catch (e) {
        console.error("Error fetching popular products:", e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchMostViewedProducts() {
      this.loading = true
      try {
        const { data } = await productApi.getMostViewedProducts()
        this.mostViewedProducts = data.data.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto)
        }))
        return data
      } catch (e) {
        console.error("Error fetching most viewed products:", e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchProducts(params = {}) {
      this.loading = true
      try {
        const { data } = await productApi.getProducts(params)
        this.allProducts = data.data.map(product => ({
          ...product,
          foto: this.processImageUrl(product.foto)
        }))
        if (data.meta) this.pagination = data.meta
        this.initialized = true
        return data
      } catch (e) {
        console.error("Error fetching products:", e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchMoreProducts(params = {}) {
      if (!this.hasMoreProducts) return

      try {
        const nextPage = this.pagination.current_page + 1
        const { data } = await productApi.getProducts({
          ...params,
          page: nextPage
        })

        this.allProducts.push(...data.data)
        if (data.meta) this.pagination = data.meta
        return data
      } catch (e) {
        console.error("Error fetching more products:", e)
        throw e
      }
    },

    async fetchProductDetail(id) {
      this.loading = true
      try {
        const { data } = await productApi.getProduct(id)
        this.productDetail = normalizeProduct(data.data)
        return data
      } catch (e) {
        console.error("Error fetching product detail:", e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const { data } = await productApi.getCategories()
        this.categories = data.data
        return data
      } catch (e) {
        console.error("Error fetching categories:", e)
        throw e
      }
    },

    async fetchUmkms() {
      try {
        const { data } = await productApi.getUmkms()
        this.umkms = data.data
        return data
      } catch (e) {
        console.error("Error fetching UMKMs:", e)
        throw e
      }
    },

    async fetchKecamatans() {
      try {
        const { data } = await productApi.getKecamatans()
        this.kecamatans = data.data
        return data
      } catch (e) {
        console.error("Error fetching kecamatans:", e)
        throw e
      }
    },

    async fetchUmkmsCount() {
      try {
        const { data } = await productApi.getUmkmsCount()
        return data.umkm_count
      } catch (e) {
        console.error("Error fetching UMKMs count:", e)
        throw e
      }
    },

    async fetchProductsCount() {
      try {
        const { data } = await productApi.getProductsCount()
        return data.product_count
      } catch (e) {
        console.error("Error fetching products count:", e)
        throw e
      }
    },

    async trackProductView({ productId, data }) {
      try {
        await productApi.trackProductView(productId, data)
      } catch (e) {
        console.error("Error tracking product view:", e)
      }
    },

    async addToCart(productId, quantity = 1) {
      this.cartLoading = true
      try {
        const response = await api.post('/customer/cart/add', {
          product_id: productId,
          quantity: quantity
        })

        if (response.data.success) {
          return {
            success: true,
            message: response.data.message,
            data: response.data.data
          }
        } else {
          throw new Error(response.data.message || 'Gagal menambahkan ke keranjang')
        }
      } catch (error) {
        console.error("Error adding to cart:", error)

        // Handle specific error cases
        if (error.response) {
          const { data } = error.response
          if (data.available_stock !== undefined) {
            throw new Error(`Stok tidak cukup. Stok tersedia: ${data.available_stock}`)
          }
          if (data.message) {
            throw new Error(data.message)
          }
        }
        throw new Error('Gagal menambahkan ke keranjang')
      } finally {
        this.cartLoading = false
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
      this.featuredProducts = []
      this.newProducts = []
      this.popularProducts = []
      this.mostViewedProducts = []
      this.allProducts = []
      this.productDetail = null
      this.pagination = {
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0
      }
      this.loading = false
      this.initialized = false
    }
  }
})
