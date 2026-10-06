// api/auth.js
import api from './axios'

export default {
  login(data) {
    return api.post('/login', data)
  },

  register(data) {
    return api.post('/register', data)
  },

  getUserStats() {
    return api.get('user/stats')
  },

  updateProfile(data) {
    return api.put('/profile', data, {
      headers: { Authorization: `Bearer ${this.token}` }
    })
  },

  updateCustomerProfile(data) {
    return api.post('/profile/customer', data, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  logout() {
    return api.post('/logout', null, {
      headers: { Authorization: `Bearer ${this.token}` }
    })
  },

  getUser() {
    return api.get('/user')
  }
}
