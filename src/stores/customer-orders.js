import { defineStore } from 'pinia'
import api from '@/api/axios'
import OrdersApi from '@/api/order'

export const useCustomerOrderStore = defineStore('customerOrders', {
  state: () => ({
    orders: [],
    loading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    }
  }),

  getters: {
    processOrders: (state) => state.orders.filter(order =>
      ['pending', 'processing', 'shipped'].includes(order.status)
    ),
    completedOrders: (state) => state.orders.filter(order =>
      order.status === 'delivered'
    ),
    cancelledOrders: (state) => state.orders.filter(order =>
      order.status === 'cancelled'
    ),
    hasMoreOrders: (state) =>
      state.pagination.current_page < state.pagination.last_page
  },

  actions: {
    async fetchOrders(params = {}) {
      this.loading = true
      try {
        const response = await OrdersApi.getMyOrders(params)
        console.log('Fetched customer orders:', response.data)
        this.orders = response.data.data.map(order => ({
          ...order,
          order_items: order.order_items.map(item => ({
            ...item,
            product: {
              ...item.product,
              foto: this.processImageUrl(item.product?.foto)
            }
          }))
        }))
        if (response.data.meta) {
          this.pagination = response.data.meta
        }
        return response.data
      } catch (error) {
        console.error('Error fetching orders:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async cancelOrder(orderId) {
      try {
        const response = await OrdersApi.cancelOrder(orderId)
        // Update order in the list
        const index = this.orders.findIndex(order => order.id === orderId)
        if (index !== -1) {
          this.orders[index] = response.data.data
        }
        return response.data
      } catch (error) {
        console.error('Error cancelling order:', error)
        throw error
      }
    },

    async addRating(orderId, ratingData) {
      const response = await OrdersApi.rateOrder(orderId, ratingData)

      const index = this.orders.findIndex(o => o.id === orderId)
      if (index !== -1) {
        this.orders[index] = {
          ...this.orders[index],
          has_rating: true,
          order_items: this.orders[index].order_items.map(item => {
            if (item.product_id === ratingData.product_id) {
              return {
                ...item,
                rating: {
                  rating: ratingData.rating,
                  review: ratingData.review
                }
              }
            }
            return item
          })
        }
      }

      return response.data
    },


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
  }
})
