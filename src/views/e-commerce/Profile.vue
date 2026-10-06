<template>
  <div class="profile-page min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-gradient-to-r from-primary to-primary-light py-8">
      <div class="container-custom">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">Profil Saya</h1>
            <p class="text-white opacity-90 mt-1">Kelola informasi akun dan profil Anda</p>
          </div>
          <router-link
            to="/local-cart/orders"
            class="btn-outline bg-white hover:bg-gray-50 px-6 py-3"
          >
            <i class="fas fa-box mr-2"></i> Pesanan Saya
          </router-link>
        </div>
      </div>
    </section>

    <!-- Content -->
    <div class="container-custom py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <!-- Profile Photo -->
            <div class="text-center mb-6">
              <div class="relative inline-block">
                <div
                  class="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto bg-gray-200"
                  @click="triggerFileInput"
                >
                  <img
                    v-if="profile.foto_url || tempPhotoPreview"
                    :src="tempPhotoPreview || profile.foto_url"
                    alt="Profile Photo"
                    class="w-full h-full object-cover cursor-pointer"
                  >
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center cursor-pointer"
                  >
                    <i class="fas fa-user text-gray-400 text-6xl"></i>
                  </div>
                </div>
                <input
                  type="file"
                  ref="fileInput"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload"
                >
                <button
                  @click="triggerFileInput"
                  class="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition"
                >
                  <i class="fas fa-camera"></i>
                </button>
              </div>
              <h2 class="text-xl font-bold mt-4">{{ profile.user?.name || 'Nama Pengguna' }}</h2>
              <p class="text-gray-600">{{ profile.user?.email || 'email@example.com' }}</p>
              <span class="inline-block mt-2 px-3 py-1 bg-primary-light text-white text-xs font-medium rounded-full">
                Pelanggan
              </span>
            </div>

            <!-- Stats -->
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <i class="fas fa-box text-primary mr-3"></i>
                  <span>Total Pesanan</span>
                </div>
                <span class="font-bold">{{ profile.orders_count || 0 }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <i class="fas fa-star text-yellow-500 mr-3"></i>
                  <span>Ulasan Diberikan</span>
                </div>
                <span class="font-bold">{{ profile.ratings_count || 0 }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <i class="fas fa-shopping-cart text-green-500 mr-3"></i>
                  <span>Item di Keranjang</span>
                </div>
                <span class="font-bold">{{ profile.carts_count || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg">
            <!-- Loading State -->
            <div v-if="loading" class="p-8 text-center">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p class="mt-4 text-gray-600">Memuat data profil...</p>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="updateProfile" class="p-8">
              <!-- Success/Error Messages -->
              <div v-if="successMessage" class="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                <i class="fas fa-check-circle mr-2"></i> {{ successMessage }}
              </div>
              <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                <i class="fas fa-exclamation-circle mr-2"></i> {{ errorMessage }}
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Personal Information -->
                <div class="md:col-span-2">
                  <h3 class="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    <i class="fas fa-user-circle mr-2 text-primary"></i>
                    Informasi Pribadi
                  </h3>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    v-model="profile.user.email"
                    type="email"
                    disabled
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                  <p class="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Telepon
                  </label>
                  <input
                    v-model="form.telepon"
                    type="tel"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Contoh: 081234567890"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kecamatan
                  </label>
                  <select
                    v-model="form.kecamatan_id"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Pilih Kecamatan</option>
                    <option v-for="kecamatan in kecamatans" :key="kecamatan.id" :value="kecamatan.id">
                      {{ kecamatan.nama_kecamatan }}
                    </option>
                  </select>
                </div>

                <!-- Address -->
                <div class="md:col-span-2">
                  <h3 class="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 mt-6">
                    <i class="fas fa-map-marker-alt mr-2 text-primary"></i>
                    Alamat
                  </h3>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap
                  </label>
                  <textarea
                    v-model="form.alamat"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Masukkan alamat lengkap"
                  ></textarea>
                </div>

                <!-- Password Section -->
                <div class="md:col-span-2">
                  <h3 class="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 mt-6">
                    <i class="fas fa-lock mr-2 text-primary"></i>
                    Keamanan Akun
                  </h3>
                  <p class="text-sm text-gray-600 mb-4">Kosongkan jika tidak ingin mengubah password</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Password Baru
                  </label>
                  <input
                    v-model="form.password"
                    type="password"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Masukkan password baru"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password
                  </label>
                  <input
                    v-model="form.password_confirmation"
                    type="password"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Konfirmasi password baru"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="resetForm"
                  class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                  :disabled="updating"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  class="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition flex items-center"
                  :disabled="updating"
                >
                  <i v-if="updating" class="fas fa-spinner fa-spin mr-2"></i>
                  <i v-else class="fas fa-save mr-2"></i>
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Photo Upload -->
    <ConfirmationModal
      v-if="showPhotoModal"
      :show="showPhotoModal"
      title="Ubah Foto Profil"
      subtitle="Foto profil akan ditampilkan di halaman profil dan komentar Anda"
      variant="default"
      confirm-text="Simpan Foto"
      cancel-text="Batal"
      @close="showPhotoModal = false"
      @confirm="savePhoto"
    >
      <div class="space-y-4">
        <div class="text-center">
          <div class="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-white shadow-lg">
            <img
              v-if="tempPhotoPreview"
              :src="tempPhotoPreview"
              alt="Preview"
              class="w-full h-full object-cover"
            >
          </div>
          <p class="text-sm text-gray-600 mt-2">Preview foto profil baru</p>
        </div>
      </div>
    </ConfirmationModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import api from '@/api/axios'
import ConfirmationModal from '@/components/e-commerce/common/ConfirmationModal.vue'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Reactive state
const profile = ref({})
const kecamatans = ref([])
const loading = ref(true)
const updating = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showPhotoModal = ref(false)
const tempPhotoFile = ref(null)
const tempPhotoPreview = ref(null)
const fileInput = ref(null)

// Form data
const form = ref({
  name: '',
  alamat: '',
  telepon: '',
  kecamatan_id: null,
  password: '',
  password_confirmation: '',
})

// Computed
const userRoleText = computed(() => {
  const roleTexts = {
    'admin': 'Administrator',
    'umkm': 'Pemilik UMKM',
    'customer': 'Pelanggan'
  }
  return roleTexts[authStore.userRole] || authStore.userRole
})

// Methods
function processImageUrl(fotoPath) {
  if (!fotoPath) {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
  if (fotoPath.startsWith('http')) {
    return fotoPath
  }
  const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000'
  const cleanPath = fotoPath.replace(/^storage\//, '')
  return `${baseUrl}/storage/${cleanPath}`
}

async function fetchProfile() {
  loading.value = true
  try {
    const response = await api.get('/profile/customer')
    profile.value = response.data.data

    // Initialize form with profile data
    form.value = {
      name: profile.value.user?.name || '',
      alamat: profile.value.alamat || '',
      telepon: profile.value.telepon || '',
      kecamatan_id: profile.value.kecamatan_id,
      password: '',
      password_confirmation: '',
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat data profil'
    })
  } finally {
    loading.value = false
  }
}

async function fetchKecamatans() {
  try {
    const response = await api.get('/kecamatans')
    kecamatans.value = response.data.data
  } catch (error) {
    console.error('Error fetching kecamatans:', error)
  }
}

async function updateProfile() {
  updating.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const payload = { ...form.value }

    // Remove empty password fields
    if (!payload.password) {
      delete payload.password
      delete payload.password_confirmation
    }

    const response = await api.put('/profile/customer', payload)
    profile.value = response.data.data

    // Update auth store with new data
    authStore.updateProfile({
      name: form.value.name,
      customer: profile.value
    })

    successMessage.value = 'Profil berhasil diperbarui'
    notificationStore.showNotification({
      type: 'success',
      message: 'Profil berhasil diperbarui'
    })

    // Clear password fields
    form.value.password = ''
    form.value.password_confirmation = ''
  } catch (error) {
    console.error('Error updating profile:', error)
    const message = error.response?.data?.message || 'Gagal memperbarui profil'
    errorMessage.value = message
    notificationStore.showNotification({
      type: 'error',
      message: message
    })
  } finally {
    updating.value = false
  }
}

function resetForm() {
  form.value = {
    name: profile.value.user?.name || '',
    alamat: profile.value.alamat || '',
    telepon: profile.value.telepon || '',
    kecamatan_id: profile.value.kecamatan_id,
    password: '',
    password_confirmation: '',
  }
  successMessage.value = ''
  errorMessage.value = ''
}

function triggerFileInput() {
  fileInput.value.click()
}

function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    notificationStore.showNotification({
      type: 'error',
      message: 'File harus berupa gambar'
    })
    return
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    notificationStore.showNotification({
      type: 'error',
      message: 'Ukuran gambar maksimal 2MB'
    })
    return
  }

  tempPhotoFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    tempPhotoPreview.value = e.target.result
    showPhotoModal.value = true
  }
  reader.readAsDataURL(file)
}

async function savePhoto() {
  if (!tempPhotoFile.value) return

  updating.value = true
  try {
    const formData = new FormData()
    formData.append('foto', tempPhotoFile.value)

    const response = await api.post('/profile/customer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    profile.value = response.data.data
    tempPhotoPreview.value = processImageUrl(profile.value.foto)

    // Update auth store
    authStore.updateProfile({
      customer: profile.value
    })

    notificationStore.showNotification({
      type: 'success',
      message: 'Foto profil berhasil diperbarui'
    })
  } catch (error) {
    console.error('Error uploading photo:', error)
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal mengupload foto profil'
    })
  } finally {
    updating.value = false
    showPhotoModal.value = false
    tempPhotoFile.value = null
  }
}

// Lifecycle hooks
onMounted(async () => {
  await Promise.all([
    fetchProfile(),
    fetchKecamatans()
  ])
})
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 80px);
}
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
.btn-outline {
  @apply border border-primary text-primary font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300;
}
</style>
