import api from './axios';

export default {
  getProductStatistics() {
    return api.get('products/statistics');
  },

  getAdminList(params) {
    return api.get('products/admin-list', { params });
  },

  getCategories() {
    return api.get('categories');
  },

  toggleStatus(productId) {
    return api.put(`products/${productId}/toggle-status`);
  },

  getProductDetail(productId) {
    return api.get(`products/${productId}`);
  },

  // Untuk UMKM: CRUD produk
  getProducts(params = {}) {
    return api.get('/products', { params });
  },

  getProductDetail(productId) {
    return api.get(`/products/${productId}`);
  },

  createProduct(data) {
    return api.post('/products', data);
  },

  updateProduct(productId, data) {
    return api.post(`/products/${productId}`, data);
  },

  deleteProduct(productId) {
    return api.delete(`/products/${productId}`);
  },

  // Mendapatkan kategori
  getCategories() {
    return api.get('/categories');
  },

  // =============== Public Product APIs ===============
  // Get featured products
  getFeaturedProducts(params = {}) {
    return api.get('/products/featured', { params })
  },

  // Get new products
  getNewProducts(params = {}) {
    return api.get('/products/new', { params })
  },

  // Get popular products
  getPopularProducts(params = {}) {
    return api.get('/products/popular', { params })
  },

  // Get most viewed products
  getMostViewedProducts(params = {}) {
    return api.get('/products/most-viewed', { params })
  },

  // Get all products with filters
  getProducts(params = {}) {
    return api.get('/products', { params })
  },

  // Get single product
  getProduct(id) {
    return api.get(`/products/${id}`)
  },

  // Get categories
  getCategories() {
    return api.get('/categories')
  },

  // Get UMKMs
  getUmkms() {
    return api.get('/umkms')
  },

  // Get kecamatans
  getKecamatans() {
    return api.get('/kecamatans')
  },

  // Track product view
  trackProductView(productId, data = {}) {
    return api.post(`/products/${productId}/view`, data)
  },

  getCategoriesByUmkm(umkmId) {
    return api.get(`categories/by-umkm/${umkmId}`);
  },

  getProductsByUmkm(umkmId, params = {}) {
    return api.get(`products/by-umkm/${umkmId}`, { params });
  },


  getUmkmsCount() {
    return api.get('umkms/count');
  },

  getProductsCount() {
    return api.get('products/count');
  },

  getHome() {
    return api.get('home');
  },
};
