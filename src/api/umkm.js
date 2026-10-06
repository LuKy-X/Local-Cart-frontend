import api from './axios';

export default {
  getUmkmsStatistics() {
    return api.get('umkms/statistics');
  },

  getAdminList(params) {
    return api.get('umkms/admin-list', { params });
  },

  approveUmkm(umkmId) {
    return api.put(`umkms/${umkmId}/approve`);
  },

  rejectUmkm(umkmId) {
    return api.put(`umkms/${umkmId}/reject`);
  },

  getUmkmDetail(umkmId) {
    return api.get(`umkms/${umkmId}`);
  },

  getMyProducts(params = {}) {
    return api.get('/umkm/my-products', { params });
  },

  getAnalytics() {
    return api.get('/umkm/analytics');
  },

  getMyOrders(params = {}) {
    return api.get('/umkm/orders', { params });
  },

  updateOrderStatus(orderId, status) {
    return api.put(`/umkm/orders/${orderId}/update-status`, { status });
  },

  // ================PROFILE=================
  getMyUmkm() {
    return api.get('/profile/umkm');
  },

  updateUmkm(data) {
    return api.put('/profile/umkm', data);
  },

  getUmkmProfile() {
    return api.get('profile/umkm');
  },

  updateUmkmProfile(data) {
    return api.post('profile/umkm', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getKecamatans() {
    return api.get('kecamatans');
  },

  getUmkmStatistics() {
    return api.get('umkm/analytics');
  }
};
