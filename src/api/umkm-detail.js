import api from './axios';

export default {
  getUmkmDetail(umkmId) {
    return api.get(`umkms/${umkmId}`);
  },

  getUmkmProducts(umkmId, params = {}) {
    return api.get(`products/by-umkm/${umkmId}`, { params });
  },

  getUmkmReviews(umkmId, params = {}) {
    return api.get(`umkms/${umkmId}/reviews`, { params });
  },

  getCategoriesByUmkm(umkmId) {
    return api.get(`categories/by-umkm/${umkmId}`);
  },
};
