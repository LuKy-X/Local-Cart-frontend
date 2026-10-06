// stores/public-productDetail.js
import { defineStore } from "pinia"
import axios from "@/api/axios"

export const useProductDetailStore = defineStore("productDetail", {
  state: () => ({
    product: null,
    recommendedProducts: [],
    reviews: [],
    loading: false,
    loadingReviews: false,
    loadingRecommended: false,
    reviewPagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    initialized: false,
    cartLoading: false
  }),

  getters: {
    hasMoreReviews: (state) => {
      return state.reviewPagination.current_page < state.reviewPagination.last_page
    },
    reviewStats: (state) => {
      if (!state.product?.ratings || state.product.ratings.length === 0) {
        return {
          average: 0,
          total: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      }
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      state.product.ratings.forEach(r => {
        const star = Math.round(r.rating)
        if (distribution[star] !== undefined) {
          distribution[star]++
        }
      })
      return {
        average: state.product.average_rating || 0,
        total: state.product.total_ratings || 0,
        distribution
      }
    },
    showLoading: (state) => state.loading && !state.initialized
  },

  actions: {
    async fetchProductDetail(productId) {
      this.loading = true
      try {
        const response = await axios.get(`/products/${productId}/detail`)
        if (response.data.data) {
          this.product = response.data.data
          this.initialized = true
        }
        return response.data
      } catch (e) {
        console.error("Gagal fetch product detail:", e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchRecommendedProducts(productId) {
      this.loadingRecommended = true
      try {
        const response = await axios.get(`/products/${productId}/recommended`)
        if (response.data.data) {
          this.recommendedProducts = response.data.data
        }
        return response.data
      } catch (e) {
        console.error("Gagal fetch recommended products:", e)
        throw e
      } finally {
        this.loadingRecommended = false
      }
    },

    async fetchReviews(productId, page = 1, filters = {}) {
      this.loadingReviews = true
      try {
        const params = { page, ...filters }
        const response = await axios.get(`/products/${productId}/reviews`, { params })
        if (response.data.data) {
          if (page === 1) {
            this.reviews = response.data.data
          } else {
            this.reviews.push(...response.data.data)
          }
          this.reviewPagination = response.data.meta || this.reviewPagination
        }
        return response.data
      } catch (e) {
        console.error("Gagal fetch reviews:", e)
        throw e
      } finally {
        this.loadingReviews = false
      }
    },

    async addToCart(productId, quantity = 1) {
      this.cartLoading = true
      try {
        const response = await axios.post('/customer/cart/add', {
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

    async calculateShipping(umkmId) {
      try {
        const response = await axios.post('/customer/cart/calculate-shipping', {
          umkm_ids: [umkmId]
        })

        if (response.data.success) {
          return response.data.data
        }
        throw new Error('Gagal menghitung ongkir')
      } catch (error) {
        console.error("Error calculating shipping:", error)
        throw error
      }
    },

    async createDirectOrder(orderData) {
      try {
        const response = await axios.post('/customer/orders', orderData)

        if (response.data.success) {
          return response.data.data
        }
        throw new Error('Gagal membuat order')
      } catch (error) {
        console.error("Error creating order:", error)
        throw error
      }
    },

    reset() {
      this.product = null
      this.recommendedProducts = []
      this.reviews = []
      this.reviewPagination = {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      }
      this.loading = false
      this.loadingReviews = false
      this.loadingRecommended = false
      this.initialized = false
      this.cartLoading = false
    }
  }
})
