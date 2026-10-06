import api from './axios';

export default {
  getShippers() {
    return api.get('shippers');
  },

  getShipperStatistics() {
    return api.get('shippers/statistics');
  },

  getAdminList(params) {
    return api.get('shippers/admin-list', {params});
  },

  getShipperDetail(shipperId) {
    return api.get(`shippers/${shipperId}/detail`);
  },

  createShipper(data) {
    return api.post('shippers', data);
  },

  updateShipper(shipperId, data) {
    return api.put(`shippers/${shipperId}`, data);
  },

  deleteShipper(shipperId) {
    return api.delete(`shippers/${shipperId}`);
  }
};
