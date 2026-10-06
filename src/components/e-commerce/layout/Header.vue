<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container-custom">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <router-link to="/local-cart" class="flex items-center space-x-3">
          <div class="bg-primary w-12 h-12 rounded-lg flex items-center justify-center">
            <i class="fas fa-shopping-cart text-white text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">LocalCart</h1>
            <p class="text-sm text-gray-600 -mt-1">UMKM Marketplace</p>
          </div>
        </router-link>

        <!-- Search Bar -->
        <div class="hidden lg:flex flex-grow max-w-2xl mx-8">
          <div class="relative w-full">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="performSearch"
              placeholder="Cari produk atau UMKM..."
              class="w-full px-6 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              :disabled="searchLoading"
            >
            <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <div v-if="searchLoading" class="absolute right-4 top-1/2 transform -translate-y-1/2">
              <i class="fas fa-spinner fa-spin text-primary"></i>
            </div>
            <div v-else class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              Tekan Enter
            </div>
          </div>
        </div>

        <!-- Right Side Icons -->
        <div class="flex items-center space-x-6">
          <!-- Cart Icon -->
          <router-link to="/local-cart/cart" class="relative text-gray-700 hover:text-primary transition">
            <i class="fas fa-shopping-cart text-2xl"></i>
            <span v-if="cartStore.cartItemCount > 0" class="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
              {{ cartStore.cartItemCount > 99 ? '99+' : cartStore.cartItemCount }}
            </span>
          </router-link>

          <!-- User Authentication -->
          <div v-if="!authStore.isLoggedIn" class="flex items-center space-x-4">
            <router-link to="/login" class="btn-outline px-4 py-2">
              Masuk
            </router-link>
            <div class="relative group">
              <button class="btn-primary px-4 py-2">
                Daftar <i class="fas fa-chevron-down ml-2 text-sm"></i>
              </button>
              <div class="absolute hidden group-hover:block right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                <router-link to="/register/customer" class="block px-4 py-3 text-gray-700 hover:bg-gray-50">
                  <i class="fas fa-user mr-3"></i> Sebagai Pelanggan
                </router-link>
                <router-link to="/register/umkm" class="block px-4 py-3 text-gray-700 hover:bg-gray-50">
                  <i class="fas fa-store mr-3"></i> Sebagai UMKM
                </router-link>
              </div>
            </div>
          </div>

          <!-- User Profile (if logged in) -->
          <div v-else class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-gray-700 hover:text-primary transition"
            >
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <template v-if="authStore.userRole === 'customer' && authStore.user?.customer?.foto">
                  <img
                    :src="processCustomerImage(authStore.user.customer.foto)"
                    :alt="authStore.userName"
                    class="w-full h-full object-cover"
                  >
                </template>
                <template v-else-if="authStore.user?.avatar">
                  <img :src="authStore.user.avatar" :alt="authStore.userName" class="w-full h-full object-cover">
                </template>
                <template v-else>
                  <i class="fas fa-user text-gray-600"></i>
                </template>
              </div>
              <span class="hidden md:inline font-medium">{{ authStore.userName }}</span>
              <i class="fas fa-chevron-down text-sm"></i>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
              v-click-outside="closeUserMenu"
            >
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="font-semibold text-gray-900">{{ authStore.userName }}</p>
                <p class="text-sm text-gray-500">{{ authStore.userEmail }}</p>
                <span class="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-primary-light text-white">
                  {{ getUserRoleText(authStore.userRole) }}
                </span>
              </div>

              <router-link
                to="/local-cart/profile"
                class="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                @click="closeUserMenu"
              >
                <i class="fas fa-user mr-3"></i> Profil Saya
              </router-link>

              <!-- Menu berdasarkan role -->
              <template v-if="authStore.userRole === 'customer'">
                <router-link
                  to="/local-cart/orders"
                  class="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-box mr-3"></i> Pesanan Saya
                </router-link>
              </template>

              <template v-if="authStore.userRole === 'umkm'">
                <router-link
                  :to="`/umkm`"
                  class="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-chart-line mr-3"></i> Dashboard UMKM
                </router-link>
                <router-link
                  :to="`/umkm/products`"
                  class="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-boxes mr-3"></i> Produk Saya
                </router-link>
                <router-link
                  :to="`/umkm/orders`"
                  class="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-clipboard-list mr-3"></i> Pesanan
                </router-link>
              </template>

              <template v-if="authStore.userRole === 'admin'">
                <router-link
                  to="/admin"
                  class="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-tachometer-alt mr-3"></i> Dashboard Admin
                </router-link>
                <router-link
                  to="/admin/umkm"
                  class="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-store mr-3"></i> Kelola UMKM
                </router-link>
                <router-link
                  to="/admin/product"
                  class="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-boxes mr-3"></i> Kelola Produk
                </router-link>
                <router-link
                  to="/admin/order"
                  class="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-clipboard-list mr-3"></i> Kelola Pesanan
                </router-link>
              </template>

              <div class="border-t border-gray-100 my-2"></div>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                <i class="fas fa-sign-out-alt mr-3"></i> Keluar
              </button>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="lg:hidden text-gray-700"
          >
            <i class="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Search -->
      <div v-if="showMobileMenu" class="lg:hidden py-4 border-t border-gray-200">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            placeholder="Cari produk atau UMKM..."
            class="w-full px-6 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            :disabled="searchLoading"
          >
          <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <div v-if="searchLoading" class="absolute right-4 top-1/2 transform -translate-y-1/2">
            <i class="fas fa-spinner fa-spin text-primary"></i>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useSearchStore } from '@/stores/search'

export default {
  name: 'Header',

  data() {
    return {
      searchQuery: '',
      showUserMenu: false,
      showMobileMenu: false,
      searchLoading: false,
      lastSearchTime: 0,
      searchDebounce: null
    }
  },

  computed: {
    ...mapState(useAuthStore, ['isLoggedIn', 'userName', 'userEmail', 'userRole', 'user']),
    ...mapState(useCartStore, ['cartItemCount']),

    authStore() {
      return useAuthStore()
    },

    cartStore() {
      return useCartStore()
    }
  },

  methods: {
    ...mapActions(useAuthStore, ['logout']),

    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },

    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },

    closeUserMenu() {
      this.showUserMenu = false
    },

    getUserRoleText(role) {
      const roleTexts = {
        'admin': 'Administrator',
        'umkm': 'Pemilik UMKM',
        'customer': 'Pelanggan'
      }
      return roleTexts[role] || role
    },

    async performSearch() {
      if (!this.searchQuery.trim()) {
        return
      }

      const now = Date.now()
      if (now - this.lastSearchTime < 1000) {
        return // Debounce
      }

      this.lastSearchTime = now
      this.searchLoading = true

      try {
        // Navigate to search page with query
        await this.$router.push({
          name: 'Search',
          query: {
            q: this.searchQuery.trim()
          }
        })

        // Clear search query in header
        this.searchQuery = ''
        this.showMobileMenu = false
      } catch (error) {
        console.error('Search navigation error:', error)
      } finally {
        this.searchLoading = false
      }
    },

    async handleLogout() {
      try {
        await this.authStore.logout()
        this.showUserMenu = false

        // Show success notification
        this.$emit('show-notification', {
          type: 'success',
          message: 'Anda telah berhasil logout'
        })

        // Redirect to home
        this.$router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
        this.$emit('show-notification', {
          type: 'error',
          message: 'Gagal logout'
        })
      }
    },

    processCustomerImage(fotoPath) {
      if (!fotoPath) {
        return null
      }
      if (fotoPath.startsWith('http')) {
        return fotoPath
      }
      const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000'
      const cleanPath = fotoPath.replace(/^storage\//, '')
      return `${baseUrl}/storage/${cleanPath}`
    },

  },
  directives: {
    'click-outside': {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  },
}
</script>

<style scoped>
header {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.btn-outline {
  @apply border border-primary text-primary font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300;
}

.btn-primary {
  @apply bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary-light transition-all duration-300;
}
</style>
