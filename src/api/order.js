import api from './axios';

export default {
  getOrders() {
    return api.get('orders');
  },

  getOrderStatistics() {
    return api.get('orders/statistics');
  },

  getAdminList(params) {
    return api.get('orders/admin-list', {params});
  },

  getOrderDetail(orderId) {
    return api.get(`orders/${orderId}/detail`);
  },

  updateOrderStatus(orderId, status) {
    return api.put(`orders/${orderId}/update-status`, { status });
  },

  // ===============UMKM=================

  getUmkmOrders(params) {
    return api.get('umkm/orders', { params });
  },

  getUmkmOrderStatistics() {
    return api.get('umkm/orders/statistics');
  },

  getUmkmOrderDetail(orderId) {
    return api.get(`umkm/orders/${orderId}/detail`);
  },

  updateUmkmOrderStatus(orderId, status) {
    return api.put(`umkm/orders/${orderId}/update-status`, { status });
  },

  updateOrderShipper(orderId, shipperId) {
    return api.put(`umkm/orders/${orderId}/update-shipper`, { shipper_id: shipperId });
  },

  getAvailableShippers() {
    return api.get('shippers');
  },

  updateOrderShipper(orderId, shipperId) {
    return api.put(`umkm/orders/${orderId}/update-shipper`, { shipper_id: shipperId });
  },


  getMyOrders(params = {}) {
    return api.get('/customer/orders', { params })
  },

  cancelOrder(id) {
    return api.put(`/customer/orders/${id}/cancel`)
  },

  rateOrder(orderId, data) {
    return api.post(`/customer/orders/${orderId}/rate`, data)
  },
};
