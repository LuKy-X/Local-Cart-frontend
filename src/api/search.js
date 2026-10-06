import axios from './axios'

export default {
  // Search products
  searchProducts(params = {}) {
    return axios.get('/search/products', { params })
  },

  // Search UMKM
  searchUmkms(params = {}) {
    return axios.get('/search/umkms', { params })
  },

  // Get categories for filter
  getCategories(params = {}) {
    return axios.get('/search/categories', { params })
  },

  // Get kecamatans for filter
  getKecamatans(params = {}) {
    return axios.get('/search/kecamatans', { params })
  },

  getProductCount(params = {}) {
    return axios.get('/search/products/count', { params })
  },

  // Get UMKM count only
  getUmkmCount(params = {}) {
    return axios.get('/search/umkms/count', { params })
  }
}
