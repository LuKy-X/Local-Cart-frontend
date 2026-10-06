import api from './axios';

export default {
  getKecamatans() {
    return api.get('kecamatans');
  },

  getKecamatanStatistics() {
    return api.get('kecamatans/statistics');
  },

  getAdminList(params) {
    return api.get('kecamatans/admin-list', {params});
  },

  getKecamatanDetail(kecamatanId) {
    return api.get(`kecamatans/${kecamatanId}/detail`);
  },

  createKecamatan(data) {
    return api.post('kecamatans', data);
  },

  updateKecamatan(id, data) {
    return api.put(`kecamatans/${id}`, data);
  },

  deleteKecamatan(id) {
    return api.delete(`kecamatans/${id}`);
  },
};
