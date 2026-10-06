import api from './axios';

export default {
  getCustomerStatistics() {
    return api.get('customers/statistics');
  },

  getAdminList(params) {
    return api.get('customers', { params });
  },

  getCustomerDetail(customerId) {
    return api.get(`customers/${customerId}`);
  },
};
