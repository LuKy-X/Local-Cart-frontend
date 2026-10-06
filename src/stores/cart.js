import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useNotificationStore } from './notification'
import cartApi from '@/api/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    carts: [],
    selectedItems: [],
    shippingCosts: {},
    loading: false,
    error: null,
    recommendedProducts: [],
    updatingItems: new Set()
  }),

  getters: {
    cartByUmkm: (state) => {
      return state.carts.map(cart => ({
        id: cart.umkm_id,
        name: cart.umkm?.nama_umkm || 'Unknown UMKM',
        location: cart.umkm?.kecamatan?.nama_kecamatan || cart.umkm?.alamat || '',
        image: cart.umkm?.foto_logo
          ? cart.umkm.foto_logo
          : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        items: cart.cart_items.map(item => ({
          id: item.id,
          name: item.product?.nama_produk || 'Unknown Product',
          variant: item.product?.category?.nama_kategori || '',
          price: item.product?.harga || 0,
          originalPrice: null,
          quantity: item.quantity,
          stock: item.product?.stok || 0,
          image: item.product?.foto || null,
          product: item.product,
          umkm_id: cart.umkm_id
        })),
        total: cart.cart_items.reduce((sum, item) => {
          return sum + (item.product?.harga || 0) * item.quantity
        }, 0)
      }))
    },

    selectedItemsCount: (state) => state.selectedItems.length,

    selectedCartItems: (state) => {
      const items = []
      state.carts.forEach(cart => {
        cart.cart_items.forEach(item => {
          if (state.selectedItems.includes(item.id)) {
            items.push({
              id: item.id,
              name: item.product?.nama_produk,
              image: item.product?.foto || null,
              price: item.product?.harga || 0,
              quantity: item.quantity,
              umkm_id: cart.umkm_id
            })
          }
        })
      })
      return items
    },

    selectedItemsTotal: (state) => {
      const items = []
      state.carts.forEach(cart => {
        cart.cart_items.forEach(item => {
          if (state.selectedItems.includes(item.id)) {
            items.push({
              price: item.product?.harga || 0,
              quantity: item.quantity
            })
          }
        })
      })
      return items.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },

    formatPrice() {
      return (price) => {
        if (price === undefined || price === null || isNaN(price)) {
          return '0'
        }
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
    },

    selectedUmkmIds: (state) => {
      const umkmIds = new Set()
      state.carts.forEach(cart => {
        cart.cart_items.forEach(item => {
          if (state.selectedItems.includes(item.id) && cart.umkm_id) {
            umkmIds.add(cart.umkm_id)
          }
        })
      })
      return Array.from(umkmIds)
    },

    shippingCost: (state) => {
      return Object.values(state.shippingCosts).reduce((total, cost) => {
        return total + (cost.tarif || 0)
      }, 0)
    },

    totalAmount: (state) => {
      const selectedTotal = (() => {
        let total = 0
        state.carts.forEach(cart => {
          cart.cart_items.forEach(item => {
            if (state.selectedItems.includes(item.id)) {
              total += (item.product?.harga || 0) * item.quantity
            }
          })
        })
        return total
      })()

      const shippingTotal = Object.values(state.shippingCosts).reduce((total, cost) => {
        return total + (cost.tarif || 0)
      }, 0)

      return selectedTotal + shippingTotal
    },

    hasKecamatan: (state) => {
      const authStore = useAuthStore()
      return !!authStore.user?.customer?.kecamatan_id
    },

    cartItemCount: (state) => {
      return state.carts.reduce((total, cart) => {
        return total + cart.cart_items.reduce((sum, item) => sum + item.quantity, 0)
      }, 0)
    },

    allItemIds: (state) => {
      const itemIds = []
      state.carts.forEach(cart => {
        cart.cart_items.forEach(item => {
          itemIds.push(item.id)
        })
      })
      return itemIds
    },

    isAllSelected: (state) => {
      const allItemIds = []
      state.carts.forEach(cart => {
        cart.cart_items.forEach(item => {
          allItemIds.push(item.id)
        })
      })
      return allItemIds.length > 0 &&
             state.selectedItems.length === allItemIds.length &&
             allItemIds.every(id => state.selectedItems.includes(id))
    },

    shippingDetails: (state) => {
      return Object.keys(state.shippingCosts).length > 0
    },

    checkoutButtonText: (state) => {
      if (state.selectedItems.length === 0) return 'Pilih Produk'
      const authStore = useAuthStore()
      if (!authStore.user?.customer?.kecamatan_id) return 'Lengkapi Profil'
      return `Checkout (${state.selectedItems.length})`
    },

    umkmNames: (state) => {
      const names = {}
      state.carts.forEach(cart => {
        if (cart.umkm_id) {
          names[cart.umkm_id] = cart.umkm?.nama_umkm || 'UMKM'
        }
      })
      return names
    },

    isUmkmSelected: (state) => {
      return (umkmId) => {
        const umkmItemIds = []

        state.carts.forEach(cart => {
          if (cart.umkm_id === umkmId) {
            cart.cart_items.forEach(item => {
              umkmItemIds.push(item.id)
            })
          }
        })

        return (
          umkmItemIds.length > 0 &&
          umkmItemIds.every(id => state.selectedItems.includes(id))
        )
      }
    }
  },

  actions: {
    // Helper method untuk mendapatkan item IDs per UMKM
    getUmkmItemIds(umkmId) {
      const itemIds = []
      this.carts.forEach(cart => {
        if (cart.umkm_id === umkmId) {
          cart.cart_items.forEach(item => {
            itemIds.push(item.id)
          })
        }
      })
      return itemIds
    },

    async fetchCart() {
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn) {
        this.carts = []
        this.selectedItems = []
        return
      }

      this.loading = true
      try {
        const response = await cartApi.getCart()
        this.carts = response.data.data?.carts || []

        // Sync selected items
        const allItemIds = []
        this.carts.forEach(cart => {
          cart.cart_items.forEach(item => {
            allItemIds.push(item.id)
          })
        })
        this.selectedItems = this.selectedItems.filter(id => allItemIds.includes(id))
      } catch (error) {
        console.error('Failed to fetch cart:', error)
        this.error = error.response?.data?.message || 'Gagal memuat keranjang'
      } finally {
        this.loading = false
      }
    },

    async addToCart(productId, quantity = 1) {
      const authStore = useAuthStore()
      const notificationStore = useNotificationStore()

      if (!authStore.isLoggedIn) {
        notificationStore.showNotification({
          type: 'warning',
          message: 'Silakan login terlebih dahulu'
        })
        return { success: false, requiresLogin: true }
      }

      this.loading = true
      try {
        const response = await cartApi.addToCart(productId, quantity)

        await this.fetchCart()

        notificationStore.showNotification({
          type: 'success',
          message: 'Produk berhasil ditambahkan ke keranjang'
        })

        return { success: true, data: response.data.data }
      } catch (error) {
        const message = error.response?.data?.message || 'Gagal menambahkan ke keranjang'
        this.error = message

        notificationStore.showNotification({
          type: 'error',
          message: message
        })

        return { success: false, error: message }
      } finally {
        this.loading = false
      }
    },

    async updateCartItem(cartItemId, quantity) {
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn) return { success: false }

      this.updatingItems.add(cartItemId)

      // Optimistic update
      const itemIndex = this.findItemIndex(cartItemId)
      let oldQuantity = 1
      if (itemIndex !== -1) {
        const { cartIndex, itemCartIndex } = itemIndex
        oldQuantity = this.carts[cartIndex].cart_items[itemCartIndex].quantity
        this.carts[cartIndex].cart_items[itemCartIndex].quantity = quantity
      }

      try {
        await cartApi.updateCartItem(cartItemId, quantity)
        return { success: true }
      } catch (error) {
        // Rollback
        if (itemIndex !== -1) {
          const { cartIndex, itemCartIndex } = itemIndex
          this.carts[cartIndex].cart_items[itemCartIndex].quantity = oldQuantity
        }

        this.error = error.response?.data?.message || 'Gagal memperbarui keranjang'
        return { success: false, error: this.error }
      } finally {
        this.updatingItems.delete(cartItemId)
      }
    },

    async removeFromCart(cartItemId) {
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn) return { success: false }

      this.loading = true
      try {
        await cartApi.removeFromCart(cartItemId)
        await this.fetchCart()

        this.selectedItems = this.selectedItems.filter(id => id !== cartItemId)

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal menghapus dari keranjang'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async clearCart() {
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn) return { success: false }

      this.loading = true
      try {
        await cartApi.clearCart()
        this.carts = []
        this.selectedItems = []
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal mengosongkan keranjang'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async calculateShipping() {
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn || this.selectedUmkmIds.length === 0) {
        this.shippingCosts = {}
        return
      }

      try {
        const response = await cartApi.calculateShipping(this.selectedUmkmIds)
        this.shippingCosts = response.data.data?.shipping_costs || {}
      } catch (error) {
        console.error('Failed to calculate shipping:', error)
        this.shippingCosts = {}
      }
    },

    async removeSelectedItems() {
      const authStore = useAuthStore()
      const notificationStore = useNotificationStore()

      if (!authStore.isLoggedIn || this.selectedItems.length === 0) {
        return { success: false }
      }

      this.loading = true
      try {
        await cartApi.removeSelected(this.selectedItems)

        await this.fetchCart()
        this.selectedItems = []

        notificationStore.showNotification({
          type: 'success',
          message: 'Item terpilih berhasil dihapus dari keranjang'
        })

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal menghapus item terpilih'

        notificationStore.showNotification({
          type: 'error',
          message: this.error
        })

        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchRecommendedProducts() {
      try {
        const response = await cartApi.getNewProducts()
        this.recommendedProducts = response.data.data || []
      } catch (error) {
        console.error('Failed to fetch recommended products:', error)
        this.recommendedProducts = []
      }
    },

    // Toggle pilih semua
    toggleSelectAll() {
      const allItemIds = []
      this.carts.forEach(cart => {
        cart.cart_items.forEach(item => {
          allItemIds.push(item.id)
        })
      })

      if (this.isAllSelected) {
        this.selectedItems = []
      } else {
        this.selectedItems = [...allItemIds]
      }
      this.calculateShipping()
    },

    // Toggle selection per UMKM
    toggleUmkmSelection(umkmId) {
      const umkmItemIds = this.getUmkmItemIds(umkmId)
      const allSelected = this.isUmkmSelected(umkmId)

      if (allSelected) {
        // Hapus semua item dari UMKM ini dari selected
        this.selectedItems = this.selectedItems.filter(id => !umkmItemIds.includes(id))
      } else {
        // Tambahkan semua item dari UMKM ini ke selected
        const newSelected = [...this.selectedItems]
        umkmItemIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id)
          }
        })
        this.selectedItems = newSelected
      }
      this.calculateShipping()
    },

    // Toggle selection per item
    toggleItemSelection(itemId) {
      const index = this.selectedItems.indexOf(itemId)
      if (index === -1) {
        this.selectedItems.push(itemId)
      } else {
        this.selectedItems.splice(index, 1)
      }
      this.calculateShipping()
    },

    // Helper untuk mencari item
    findItemIndex(cartItemId) {
      for (let cartIndex = 0; cartIndex < this.carts.length; cartIndex++) {
        const cart = this.carts[cartIndex]
        for (let itemIndex = 0; itemIndex < cart.cart_items.length; itemIndex++) {
          if (cart.cart_items[itemIndex].id === cartItemId) {
            return { cartIndex, itemCartIndex: itemIndex }
          }
        }
      }
      return -1
    },

    clearCartLocal() {
      this.carts = []
      this.selectedItems = []
      this.shippingCosts = {}
      this.error = null
      this.updatingItems.clear()
    },

  async checkout() {
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()

    if (!authStore.isLoggedIn) {
      notificationStore.showNotification({
        type: 'warning',
        message: 'Silakan login terlebih dahulu'
      })
      return { success: false, requiresLogin: true }
    }

    const customer = authStore.user?.customer
    if (!customer) {
      notificationStore.showNotification({
        type: 'warning',
        message: 'Profil customer tidak ditemukan'
      })
      return { success: false }
    }

    if (this.selectedItems.length === 0) {
      notificationStore.showNotification({
        type: 'warning',
        message: 'Tidak ada item yang dipilih'
      })
      return { success: false }
    }

    // Kelompokkan item per UMKM
    const itemsByUmkm = {}
    this.carts.forEach(cart => {
      cart.cart_items.forEach(item => {
        if (this.selectedItems.includes(item.id)) {
          const umkmId = cart.umkm_id
          if (!itemsByUmkm[umkmId]) {
            itemsByUmkm[umkmId] = []
          }
          itemsByUmkm[umkmId].push({
            product_id: item.product.id,
            quantity: item.quantity
          })
        }
      })
    })

    const orders = []
    let hasError = false

    // Buat order untuk setiap UMKM
    for (const umkmId in itemsByUmkm) {
      const orderItems = itemsByUmkm[umkmId]

      try {
        const response = await cartApi.checkout({
          umkm_id: parseInt(umkmId),
          alamat_pengiriman: customer.alamat || '',
          order_items: orderItems
        })

        orders.push(response.data.data)
      } catch (error) {
        console.error(`Gagal membuat order untuk UMKM ${umkmId}:`, error)
        hasError = true
        notificationStore.showNotification({
          type: 'error',
          message: `Gagal membuat order untuk UMKM ${umkmId}: ${error.response?.data?.message || 'Terjadi kesalahan'}`
        })
        break
      }
    }

    if (hasError) {
      return { success: false }
    }

    // Hapus item yang diorder dari cart
    await this.removeSelectedItems()
    this.selectedItems = []

    notificationStore.showNotification({
      type: 'success',
      message: `Berhasil membuat ${orders.length} order`
    })

    return { success: true, orders }
  },

    // Getter untuk mengecek apakah item sedang diupdate
    isItemUpdating(itemId) {
      return this.updatingItems.has(itemId)
    },

    async increaseQuantity(item) {
        if (!item?.id) return { success: false }

        const { cartIndex, itemCartIndex } = this.findItemIndex(item.id)
        if (cartIndex === -1 || itemCartIndex === -1) return { success: false }

        const currentItem = this.carts[cartIndex].cart_items[itemCartIndex]
        if (currentItem.quantity >= currentItem.product?.stok) {
          return { success: false, error: 'Stok tidak mencukupi' }
        }

        return await this.updateCartItem(item.id, currentItem.quantity + 1)
      },

    async decreaseQuantity(item) {
      if (!item?.id) return { success: false }

      const { cartIndex, itemCartIndex } = this.findItemIndex(item.id)
      if (cartIndex === -1 || itemCartIndex === -1) return { success: false }

      const currentItem = this.carts[cartIndex].cart_items[itemCartIndex]
      if (currentItem.quantity <= 1) {
        return { success: false }
      }

      return await this.updateCartItem(item.id, currentItem.quantity - 1)
    },

    async removeItem(item) {
      if (!item?.id) return { success: false }
      return await this.removeFromCart(item.id)
    },

    async addRecommendedProduct(product) {
      if (!product?.id) return { success: false }
      const result = await this.addToCart(product.id, 1)
      if (result.success) {
        await this.fetchRecommendedProducts()
      }
      return result
    },

    // Helper untuk format harga
    formatPrice(price) {
      if (price === undefined || price === null || isNaN(price)) {
        return '0'
      }
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    // Helper untuk proses image URL
    processImageUrl(fotoPath) {
      if (!fotoPath) {
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }

      if (fotoPath.startsWith('http')) {
        return fotoPath
      }

      const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000'
      const cleanPath = fotoPath.replace(/^storage\//, '')
      return `${baseUrl}/storage/${cleanPath}`
    },

    persist: {
      paths: ['selectedItems']
    }
  },
})
