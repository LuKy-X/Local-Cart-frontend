import { defineStore } from "pinia";
import AuthApi from "@/api/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
    userRole: (state) => state.user?.role || 'customer',
    userUmkm: (state) => state.user?.umkm,
    userCustomer: (state) => state.user?.customer,
    userInitials: (state) => {
      const name = state.user?.name || '';
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
  },

  actions: {
    async login(data) {
      this.loading = true
      this.error = null
      try {
        const response = await AuthApi.login(data)
        const { token, user } = response.data

        this.token = token
        this.user = user

        // Simpan token di localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        // Load cart setelah login
        const cartStore = useCartStore()
        await cartStore.fetchCart()

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login gagal'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await AuthApi.register(userData)
        const { token, user } = response.data

        this.token = token
        this.user = user

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Registrasi gagal'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateUser(updatedUserData) {
      const oldUserData = { ...this.user };

      try {
        this.user = {
          ...oldUserData,
          ...updatedUserData,
          umkm: updatedUserData.umkm || oldUserData.umkm,
          customer: updatedUserData.customer || oldUserData.customer
        };

        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (error) {
        this.user = oldUserData;
        throw error;
      }
    },

    async logout() {
      try {
        await AuthApi.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear semua state
        this.token = null
        this.user = null
        this.error = null

        // Clear token dari localStorage
        localStorage.removeItem('token')

        // Clear cart store
        const cartStore = useCartStore()
        cartStore.clearCart()
      }
    },

    async updateProfile(profileData) {
      this.loading = true
      this.error = null
      try {
        const response = await AuthApi.updateProfile(profileData)
        this.user = response.data.data
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Update profil gagal'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateCustomerProfile(profileData) {
      this.loading = true
      this.error = null
      try {
        const response = await AuthApi.updateCustomerProfile(profileData)
        this.user = response.data.data
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Update profil gagal'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },


  },

  persist: {
    paths: ['token', 'user']
  }
});
