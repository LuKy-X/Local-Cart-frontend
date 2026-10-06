import api from './axios';

export default {
  getRatings() {
    return api.get('ratings');
  },

  getRatingStatistics() {
    return api.get('ratings/statistics');
  },

  getAdminList(params) {
    return api.get('ratings/admin-list', {params});
  },

  getRatingDetail(ratingId) {
    return api.get(`ratings/${ratingId}/detail`);
  },

  updateRatingApproval(ratingId, data) {
    return api.put(`ratings/${ratingId}/approval`, data);
  },

  deleteRating(ratingId) {
    return api.delete(`ratings/${ratingId}`);
  },

  getUmkmReviews(umkmId, params = {}) {
    return api.get(`umkms/${umkmId}/reviews`, { params });
  },
};
