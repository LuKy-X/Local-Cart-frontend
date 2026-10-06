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
            <span class="text-gray-600 text-sm">Sudah punya akun?</span>
            <router-link to="/login" class="text-sm text-primary hover:text-primary-dark font-medium">
              Masuk
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="container-custom py-12">
      <div class="max-w-2xl mx-auto">
        <!-- Registration Card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-primary to-primary-light p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white mb-2">Daftar sebagai Pelanggan</h2>
                <p class="text-white opacity-90">Mulai belanja produk UMKM terbaik</p>
              </div>
              <div class="bg-white bg-opacity-20 p-3 rounded-lg">
                <i class="fas fa-user-plus text-white text-2xl"></i>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <i class="fas fa-exclamation-circle text-red-500 mr-3"></i>
              <div>
                <p class="text-red-700 font-medium">{{ error }}</p>
                <p v-if="validationErrors" class="text-red-600 text-sm mt-1">
                  <span v-for="(err, field) in validationErrors" :key="field">
                    {{ err[0] }}<br>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Registration Form -->
          <form @submit.prevent="handleSubmit" class="p-6">
            <div class="space-y-6">
              <!-- Personal Information Section -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  <i class="fas fa-user-circle mr-2 text-primary"></i>
                  Informasi Pribadi
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nama Lengkap -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="formData.nama_customer"
                        type="text"
                        required
                        placeholder="Nama lengkap Anda"
                        :disabled="loading"
                        class="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                      <i class="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="formData.email"
                        type="email"
                        required
                        placeholder="email@example.com"
                        :disabled="loading"
                        class="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                      <i class="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <!-- Telepon -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <div class="relative">
                      <input
                        v-model="formData.telepon"
                        type="tel"
                        placeholder="081234567890"
                        :disabled="loading"
                        class="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                      <i class="fas fa-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <!-- Kecamatan -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Kecamatan
                    </label>
                    <div class="relative">
                      <select
                        v-model="formData.kecamatan_id"
                        :disabled="loading"
                        class="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none"
                      >
                        <option value="" selected>Pilih kecamatan (opsional)</option>
                        <option v-for="kecamatan in kecamatans" :key="kecamatan.id" :value="kecamatan.id">
                          {{ kecamatan.nama_kecamatan }}
                        </option>
                      </select>
                      <i class="fas fa-map-marker-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <i class="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>
                </div>

                <!-- Alamat -->
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Alamat
                  </label>
                  <textarea
                    v-model="formData.alamat"
                    rows="2"
                    placeholder="Alamat lengkap (opsional)"
                    :disabled="loading"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  ></textarea>
                </div>
              </div>

              <!-- Account Security Section -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  <i class="fas fa-shield-alt mr-2 text-primary"></i>
                  Keamanan Akun
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Password -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Password <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="formData.password"
                        :type="showPassword ? 'text' : 'password'"
                        required
                        placeholder="Minimal 8 karakter"
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
                    <p class="mt-1 text-xs text-gray-500">Gunakan kombinasi huruf, angka, dan simbol</p>
                  </div>

                  <!-- Confirm Password -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="formData.password_confirmation"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        required
                        placeholder="Ulangi password"
                        :disabled="loading"
                        class="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                      <i class="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <button
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Password Strength -->
                <div v-if="formData.password" class="mt-4">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-medium text-gray-700">Kekuatan password:</span>
                    <span class="text-xs font-medium" :class="passwordStrength.color">
                      {{ passwordStrength.text }}
                    </span>
                  </div>
                  <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      class="h-full transition-all duration-300"
                      :class="passwordStrength.color"
                      :style="{ width: passwordStrength.width }"
                    ></div>
                  </div>
                  <ul class="mt-2 space-y-1">
                    <li class="flex items-center text-xs" :class="passwordCriteria.minLength ? 'text-green-600' : 'text-gray-400'">
                      <i :class="passwordCriteria.minLength ? 'fas fa-check-circle' : 'far fa-circle'" class="mr-2"></i>
                      Minimal 8 karakter
                    </li>
                    <li class="flex items-center text-xs" :class="passwordCriteria.hasNumber ? 'text-green-600' : 'text-gray-400'">
                      <i :class="passwordCriteria.hasNumber ? 'fas fa-check-circle' : 'far fa-circle'" class="mr-2"></i>
                      Mengandung angka
                    </li>
                    <li class="flex items-center text-xs" :class="passwordCriteria.hasMixed ? 'text-green-600' : 'text-gray-400'">
                      <i :class="passwordCriteria.hasMixed ? 'fas fa-check-circle' : 'far fa-circle'" class="mr-2"></i>
                      Huruf besar & kecil
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Terms & Conditions -->
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-start">
                  <input
                    v-model="acceptTerms"
                    type="checkbox"
                    required
                    :disabled="loading"
                    class="mt-1 mr-3 rounded text-primary focus:ring-primary"
                    id="terms"
                  />
                  <label for="terms" class="text-sm text-gray-700">
                    Saya menyetujui
                    <a href="#" class="text-primary hover:text-primary-dark font-medium">Syarat & Ketentuan</a> dan
                    <a href="#" class="text-primary hover:text-primary-dark font-medium">Kebijakan Privasi</a> LocalCart.
                  </label>
                </div>
                <div class="mt-3 flex items-start">
                  <input
                    v-model="acceptNewsletter"
                    type="checkbox"
                    :disabled="loading"
                    class="mt-1 mr-3 rounded text-primary focus:ring-primary"
                    id="newsletter"
                  />
                  <label for="newsletter" class="text-sm text-gray-700">
                    Saya ingin menerima informasi promo, penawaran khusus, dan tips belanja melalui email.
                  </label>
                </div>
              </div>

              <!-- Submit Buttons -->
              <div class="flex flex-col sm:flex-row gap-4">
                <router-link
                  to="/login"
                  class="flex-1 text-center border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                >
                  <i class="fas fa-arrow-left mr-2"></i>
                  Kembali ke Login
                </router-link>

                <button
                  type="submit"
                  :disabled="loading || !acceptTerms"
                  class="flex-1 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="loading" class="flex items-center justify-center">
                    <i class="fas fa-spinner fa-spin mr-3"></i>
                    Membuat Akun...
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <i class="fas fa-user-plus mr-2"></i>
                    Daftar Sekarang
                  </span>
                </button>
              </div>

              <!-- Alternative Registration -->
              <div class="text-center">
                <p class="text-sm text-gray-600 mb-4">Atau daftar sebagai</p>
                <router-link
                  to="/register/umkm"
                  class="inline-flex items-center text-primary hover:text-primary-dark font-medium"
                >
                  <i class="fas fa-store mr-2"></i>
                  Pemilik UMKM
                </router-link>
              </div>
            </div>
          </form>
        </div>

        <!-- Login Redirect -->
        <div class="text-center mt-8">
          <p class="text-gray-600">
            Sudah punya akun?
            <router-link to="/login" class="text-primary hover:text-primary-dark font-medium">
              Masuk di sini
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const router = useRouter()
const authStore = useAuthStore()

// Form Data
const formData = reactive({
  name: '', // Untuk user
  email: '',
  password: '',
  password_confirmation: '',
  role: 'customer',
  nama_customer: '', // Untuk customer
  alamat: '',
  telepon: '',
  kecamatan_id: ''
})

// UI State
const loading = ref(false)
const error = ref('')
const validationErrors = ref(null)
const acceptTerms = ref(false)
const acceptNewsletter = ref(true)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const kecamatans = ref([])

// Fetch kecamatans
const fetchKecamatans = async () => {
  try {
    const response = await api.get('/kecamatans')
    kecamatans.value = response.data.data || []
  } catch (err) {
    console.error('Error fetching kecamatans:', err)
  }
}

// Password strength calculator
const passwordCriteria = computed(() => {
  const password = formData.password
  return {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasMixed: /[a-z]/.test(password) && /[A-Z]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
})

const passwordStrength = computed(() => {
  const criteria = passwordCriteria.value
  let strength = 0
  let color = 'bg-red-500'
  let text = 'Lemah'
  let width = '0%'

  if (criteria.minLength) strength += 25
  if (criteria.hasNumber) strength += 25
  if (criteria.hasMixed) strength += 25
  if (criteria.hasSpecial) strength += 25

  if (strength <= 25) {
    color = 'bg-red-500'
    text = 'Lemah'
  } else if (strength <= 50) {
    color = 'bg-yellow-500'
    text = 'Cukup'
  } else if (strength <= 75) {
    color = 'bg-blue-500'
    text = 'Baik'
  } else {
    color = 'bg-green-500'
    text = 'Sangat Baik'
  }

  width = `${strength}%`

  return { strength, color, text, width }
})

// Handle Form Submission
const handleSubmit = async () => {
  if (!acceptTerms.value) {
    error.value = 'Anda harus menyetujui syarat dan ketentuan'
    return
  }

  if (formData.password !== formData.password_confirmation) {
    error.value = 'Konfirmasi password tidak sesuai'
    return
  }

  if (formData.password.length < 8) {
    error.value = 'Password minimal 8 karakter'
    return
  }

  // Mapping field name untuk backend
  const payload = {
    name: formData.nama_customer, // Gunakan nama_customer untuk field name user
    email: formData.email,
    password: formData.password,
    password_confirmation: formData.password_confirmation,
    role: 'customer',
    nama_customer: formData.nama_customer,
    alamat: formData.alamat,
    telepon: formData.telepon,
    kecamatan_id: formData.kecamatan_id
  }

  loading.value = true
  error.value = ''
  validationErrors.value = null

  try {
    // Register user
    await authStore.register(payload)

    // Auto login after registration
    await authStore.login({
      email: formData.email,
      password: formData.password
    })

    // Show success message
    const event = new CustomEvent('show-notification', {
      detail: {
        type: 'success',
        message: 'Registrasi berhasil! Selamat datang di LocalCart.'
      }
    })
    window.dispatchEvent(event)

    // Redirect to home page
    router.push('/')

  } catch (err) {
    if (err.response?.status === 422) {
      validationErrors.value = err.response.data.errors
      error.value = 'Terdapat kesalahan dalam pengisian data'
    } else {
      error.value = err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.'
    }
    console.error('Registration error:', err)
  } finally {
    loading.value = false
  }
}

// Fetch kecamatans on mount
onMounted(() => {
  fetchKecamatans()
})

// Watch for password changes to trigger validation
watch(() => formData.password, () => {
  // Validation logic is handled by computed properties
})
</script>

<style scoped>
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* Custom checkbox styling */
input[type="checkbox"] {
  @apply rounded border-gray-300 text-primary focus:ring-primary;
}
</style>
