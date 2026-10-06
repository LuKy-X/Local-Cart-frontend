import api from './axios';

export default {
  getCategories() {
    return api.get('categories');
  },

  getCategoryStatistics() {
    return api.get('categories/statistics');
  },

  getAdminList(params) {
    return api.get('categories/admin-list', {params});
  },

  getCategoryDetail(categoryId) {
    return api.get(`categories/${categoryId}/detail`);
  },

  createCategory(data) {
    return api.post('categories', data);
  },

  updateCategory(categoryId, data) {
    return api.put(`categories/${categoryId}`, data);
  },

  deleteCategory(categoryId) {
    return api.delete(`categories/${categoryId}`);
  }
};
