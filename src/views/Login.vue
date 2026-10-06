<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="container-custom">
        <div class="flex justify-between items-center py-4">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
              <i class="fas fa-shopping-cart text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">LocalCart</h1>
              <p class="text-xs text-gray-600 -mt-1">UMKM Marketplace</p>
            </div>
          </router-link>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600 text-sm">Belum punya akun?</span>
            <router-link to="/register/customer" class="text-sm text-primary hover:text-primary-dark font-medium">
              Daftar
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="container-custom py-12">
      <div class="max-w-md mx-auto">
        <!-- Login Card -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Masuk ke LocalCart</h2>
            <p class="text-gray-600">Selamat datang kembali di marketplace UMKM terbaik</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <i class="fas fa-exclamation-circle text-red-500 mr-3"></i>
              <p class="text-red-700 text-sm">{{ error }}</p>
            </div>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div class="relative">
                <input
                  v-model="loginForm.email"
                  type="email"
                  required
                  placeholder="email@example.com"
                  :disabled="loading"
                  class="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
                <i class="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <!-- Password -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <div class="relative">
                <input
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Masukkan password"
                  :disabled="loading"
                  class="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
                <i class="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <i class="fas fa-spinner fa-spin mr-3"></i>
                Memproses...
              </span>
              <span v-else>Masuk</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">Atau daftar sebagai</span>
            </div>
          </div>

          <!-- Register Options -->
          <div class="space-y-4">
            <router-link
              to="/register/customer"
              class="block w-full text-center border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <i class="fas fa-user mr-2"></i>
              Pelanggan
            </router-link>

            <router-link
              to="/register/umkm"
              class="block w-full text-center bg-gradient-to-r from-secondary to-secondary-dark text-white hover:from-secondary-dark hover:to-secondary font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <i class="fas fa-store mr-2"></i>
              Pemilik UMKM
            </router-link>
          </div>

          <!-- Terms -->
          <p class="mt-8 text-center text-xs text-gray-500">
            Dengan masuk atau mendaftar, Anda menyetujui
            <a href="#" class="text-primary hover:text-primary-dark">Syarat & Ketentuan</a> dan
            <a href="#" class="text-primary hover:text-primary-dark">Kebijakan Privasi</a> kami
          </p>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-8">
          <router-link to="/" class="inline-flex items-center text-gray-600 hover:text-gray-900">
            <i class="fas fa-arrow-left mr-2"></i>
            Kembali ke Beranda
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''

    await authStore.login({
      email: loginForm.email,
      password: loginForm.password
    })

    // Redirect berdasarkan role
    const role = authStore.user.role
    const redirectPath = {
      'admin': '/admin',
      'umkm': '/umkm',
      'customer': '/local-cart'
    }[role] || '/'

    router.push(redirectPath)

  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
</style>
