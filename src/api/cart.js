import axios from '@/api/axios'

const cartApi = {
  // Get cart
  getCart() {
    return axios.get('/customer/cart')
  },

  // Add to cart
  addToCart(productId, quantity = 1) {
    return axios.post('/customer/cart/add', {
      product_id: productId,
      quantity: quantity
    })
  },

  // Update cart item
  updateCartItem(cartItemId, quantity) {
    return axios.put(`/customer/cart/${cartItemId}`, { quantity })
  },

  // Remove from cart
  removeFromCart(cartItemId) {
    return axios.delete(`/customer/cart/${cartItemId}`)
  },

  // Clear cart
  clearCart() {
    return axios.delete('/customer/cart')
  },

  // Calculate shipping
  calculateShipping(umkmIds) {
    return axios.post('/customer/cart/calculate-shipping', {
      umkm_ids: umkmIds
    })
  },

  // Remove selected items
  removeSelected(cartItemIds) {
    return axios.post('/customer/cart/remove-selected', {
      cart_item_ids: cartItemIds
    })
  },

  // Get new products (for recommendations)
  getNewProducts() {
    return axios.get('/products/new')
  },

  // Get popular products
  getPopularProducts() {
    return axios.get('/products/popular')
  },

  // Get featured products
  getFeaturedProducts() {
    return axios.get('/products/featured')
  },

  // Bulk update quantities
  bulkUpdate(items) {
    return axios.post('/customer/cart/bulk-update', { items })
  },

  checkout(data) {
    return axios.post('/customer/orders', data)
  }
}

export default cartApi
