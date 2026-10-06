import axios from '@/api/axios'

export const statsApi = {
  // Get dashboard statistics
  getHomeStats() {
    return axios.get('/home-stats')
  },

  // Get UMKM statistics
  getUmkmStats() {
    return axios.get('/umkms/stats')
  }
}
