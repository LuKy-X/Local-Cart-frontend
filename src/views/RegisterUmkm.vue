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
    <div class="container-custom py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Progress Steps -->
        <div class="mb-8">
          <div class="flex items-center justify-center">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                1
              </div>
              <div class="ml-2 text-sm font-medium text-primary">Data Akun</div>
            </div>
            <div class="w-20 h-0.5 bg-gray-300 mx-4"></div>
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-300 flex items-center justify-center">
                2
              </div>
              <div class="ml-2 text-sm font-medium text-gray-300">Data UMKM</div>
            </div>
          </div>
        </div>

        <!-- Form Container -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <!-- Form Header -->
          <div class="bg-gradient-to-r from-primary to-primary-light p-6">
            <h2 class="text-2xl font-bold text-white mb-2">Daftar sebagai UMKM</h2>
            <p class="text-white opacity-90">Mulai jualan online bersama ribuan UMKM lainnya</p>
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

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Kolom Kiri: Data Akun -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  <i class="fas fa-user mr-2 text-primary"></i>
                  Data Akun
                </h3>

                <!-- Nama Lengkap -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    placeholder="Nama lengkap pemilik"
                    :disabled="loading"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <!-- Email -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    :disabled="loading"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <!-- Password -->
                <div class="mb-4">
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
                      class="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Password harus minimal 8 karakter</p>
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
                      class="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
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

              <!-- Kolom Kanan: Data UMKM -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  <i class="fas fa-store mr-2 text-primary"></i>
                  Data UMKM
                </h3>

                <!-- Nama UMKM -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nama UMKM <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.nama_umkm"
                    type="text"
                    required
                    placeholder="Nama usaha/perusahaan"
                    :disabled="loading"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <!-- Telepon -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.telepon"
                    type="tel"
                    required
                    placeholder="081234567890"
                    :disabled="loading"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <!-- Kecamatan -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kecamatan <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.kecamatan_id"
                    required
                    :disabled="loading"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="" disabled selected>Pilih kecamatan</option>
                    <option v-for="kecamatan in kecamatans" :key="kecamatan.id" :value="kecamatan.id">
                      {{ kecamatan.nama_kecamatan }}
                    </option>
                  </select>
                </div>

                <!-- Alamat -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="formData.alamat"
                    required
                    rows="3"
                    placeholder="Alamat lengkap usaha"
                    :disabled="loading"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  ></textarea>
                </div>

                <!-- Deskripsi -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi UMKM
                  </label>
                  <textarea
                    v-model="formData.deskripsi"
                    rows="3"
                    placeholder="Deskripsikan usaha Anda (jenis produk, sejarah, dll)"
                    :disabled="loading"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  ></textarea>
                  <p class="mt-1 text-xs text-gray-500">Opsional, dapat diisi nanti</p>
                </div>
              </div>
            </div>

            <!-- Terms & Conditions -->
            <div class="mt-8 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-start">
                <input
                  v-model="acceptTerms"
                  type="checkbox"
                  required
                  :disabled="loading"
                  class="mt-1 mr-3"
                  id="terms"
                />
                <label for="terms" class="text-sm text-gray-700">
                  Saya menyetujui <a href="#" class="text-primary hover:text-primary-dark">Syarat & Ketentuan</a> dan
                  <a href="#" class="text-primary hover:text-primary-dark">Kebijakan Privasi</a> LocalCart. Saya memahami bahwa
                  pendaftaran UMKM memerlukan verifikasi dan persetujuan dari administrator.
                </label>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <router-link
                to="/login"
                class="flex-1 text-center border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition-all duration-300"
              >
                <i class="fas fa-arrow-left mr-2"></i>
                Kembali
              </router-link>

              <button
                type="submit"
                :disabled="loading || !acceptTerms"
                class="flex-1 bg-gradient-to-r from-secondary to-secondary-dark hover:from-secondary-dark hover:to-secondary text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <i class="fas fa-spinner fa-spin mr-3"></i>
                  Memproses...
                </span>
                <span v-else class="flex items-center justify-center">
                  <i class="fas fa-store mr-2"></i>
                  Daftar sebagai UMKM
                </span>
              </button>
            </div>

            <!-- Benefits -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <h4 class="text-sm font-semibold text-gray-900 mb-3">Keuntungan menjadi UMKM di LocalCart:</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="flex items-center text-sm text-gray-600">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  Gratis biaya pendaftaran
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  Akses ke ribuan pelanggan
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  Dashboard analitik lengkap
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  Sistem pesanan terintegrasi
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const router = useRouter()
const authStore = useAuthStore()

// Form Data
const formData = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'umkm',
  nama_umkm: '',
  alamat: '',
  telepon: '',
  deskripsi: '',
  kecamatan_id: ''
})

// UI State
const loading = ref(false)
const error = ref('')
const validationErrors = ref(null)
const acceptTerms = ref(false)
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

  loading.value = true
  error.value = ''
  validationErrors.value = null

  try {
    // Register user
    await authStore.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      role: 'umkm',
      nama_umkm: formData.nama_umkm,
      alamat: formData.alamat,
      telepon: formData.telepon,
      deskripsi: formData.deskripsi,
      kecamatan_id: formData.kecamatan_id
    })

    // Auto login after registration
    await authStore.login({
      email: formData.email,
      password: formData.password
    })

    // Show success message
    const event = new CustomEvent('show-notification', {
      detail: {
        type: 'success',
        message: 'Pendaftaran berhasil! Akun Anda sedang dalam proses verifikasi.'
      }
    })
    window.dispatchEvent(event)

    // Redirect to UMKM dashboard
    router.push('/umkm')

  } catch (err) {
    if (err.response?.status === 422) {
      validationErrors.value = err.response.data.errors
      error.value = 'Terdapat kesalahan dalam pengisian data'
    } else {
      error.value = err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.'
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
</script>

<style scoped>
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
</style>
