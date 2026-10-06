<template>
  <div class="p-1">
    <!-- Alert Notification -->
    <AlertNotification ref="alertRef" :auto-remove="3000" />

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Profile UMKM</h2>
        <p class="text-gray-600 mt-1">Kelola informasi dan data UMKM Anda</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <span :class="profileStore.isApproved
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
        " class="inline-flex px-3 py-1 rounded-full text-sm font-semibold">
          {{ profileStore.isApproved ? 'Terverifikasi' : 'Menunggu Verifikasi' }}
        </span>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Products Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Produk</p>
            <p class="text-2xl font-bold text-gray-800">{{ statistics.total_products }}</p>
          </div>
        </div>
      </div>

      <!-- Total Orders Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Order</p>
            <p class="text-2xl font-bold text-gray-800">{{ statistics.total_orders }}</p>
          </div>
        </div>
      </div>

      <!-- Total Revenue Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Pendapatan</p>
            <p class="text-2xl font-bold text-gray-800">Rp {{ formatPrice(statistics.total_revenue) }}</p>
          </div>
        </div>
      </div>

      <!-- Pending Orders Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Order Pending</p>
            <p class="text-2xl font-bold text-gray-800">{{ statistics.pending_orders }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Form -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Loading State -->
      <div v-if="profileStore.loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Memuat data profile...</p>
      </div>

      <!-- Profile Content -->
      <div v-else class="p-6">
        <!-- Form Header -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">Informasi UMKM</h3>
          <button
            @click="toggleEditMode"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              isEditing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            {{ isEditing ? 'Batal Edit' : 'Edit Profile' }}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Logo & Info -->
          <div class="lg:col-span-1">
            <!-- Logo Upload -->
            <div class="mb-8">
              <h4 class="text-sm font-medium text-gray-700 mb-4">Logo UMKM</h4>
              <div class="flex flex-col items-center space-y-4">
                <!-- Current Logo -->
                <div class="relative">
                  <div class="h-48 w-48 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                    <img
                      v-if="profileStore.hasLogo && !newLogo"
                      :src="profileStore.profile.foto_logo"
                      :alt="profileStore.profile.nama_umkm"
                      class="h-full w-full object-cover"
                      @error="handleImageError"
                    >
                    <img
                      v-else-if="newLogo"
                      :src="newLogoPreview"
                      :alt="profileStore.profile.nama_umkm"
                      class="h-full w-full object-cover"
                    >
                    <div v-else class="text-gray-400">
                      <svg class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="mt-2 text-sm">Belum ada logo</p>
                    </div>
                  </div>

                  <!-- Edit Logo Button -->
                  <div v-if="isEditing" class="mt-4 text-center">
                    <label class="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ profileStore.hasLogo ? 'Ganti Logo' : 'Upload Logo' }}
                      <input
                        type="file"
                        ref="logoInput"
                        class="hidden"
                        accept="image/*"
                        @change="handleLogoUpload"
                      >
                    </label>
                    <p v-if="newLogo" class="text-sm text-green-600 mt-2">
                      Logo baru dipilih
                    </p>
                    <p class="text-xs text-gray-500 mt-2">
                      Format: JPG, PNG, JPEG. Maks: 2MB
                    </p>
                  </div>
                </div>

                <!-- Basic Info -->
                <div class="w-full">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Informasi Dasar</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600">Status Verifikasi:</span>
                      <span :class="profileStore.isApproved
                        ? 'text-green-600 font-semibold'
                        : 'text-yellow-600 font-semibold'
                      ">
                        {{ profileStore.isApproved ? 'Terverifikasi' : 'Belum Diverifikasi' }}
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600">Total Produk:</span>
                      <span class="text-sm font-medium text-gray-900">{{ profileStore.profile.products_count || 0 }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600">Total Order:</span>
                      <span class="text-sm font-medium text-gray-900">{{ profileStore.profile.orders_count || 0 }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600">Tanggal Bergabung:</span>
                      <span class="text-sm text-gray-900">{{ formatJoinDate(profileStore.profile.created_at) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Account Info -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Informasi Akun</h4>
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-gray-500">Nama Pemilik</p>
                  <p class="text-sm font-medium text-gray-900">{{ profileStore.profile.user?.name || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Email</p>
                  <p class="text-sm font-medium text-gray-900">{{ profileStore.profile.user?.email || '-' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Form -->
          <div class="lg:col-span-2">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Nama UMKM -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nama UMKM <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.nama_umkm"
                  type="text"
                  :disabled="!isEditing"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
                    isEditing
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  ]"
                  required
                >
              </div>

              <!-- Deskripsi -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi UMKM
                </label>
                <textarea
                  v-model="formData.deskripsi"
                  :disabled="!isEditing"
                  rows="4"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
                    isEditing
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  ]"
                  placeholder="Deskripsikan UMKM Anda..."
                ></textarea>
              </div>

              <!-- Kecamatan -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Kecamatan <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.kecamatan_id"
                  :disabled="!isEditing || kecamatansLoading"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
                    isEditing
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  ]"
                  required
                >
                  <option value="">Pilih Kecamatan</option>
                  <option
                    v-for="kecamatan in profileStore.kecamatans"
                    :key="kecamatan.id"
                    :value="kecamatan.id"
                  >
                    {{ kecamatan.nama_kecamatan }}
                  </option>
                </select>
                <p v-if="kecamatansLoading" class="text-xs text-gray-500 mt-1">
                  Memuat data kecamatan...
                </p>
              </div>

              <!-- Alamat -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="formData.alamat"
                  :disabled="!isEditing"
                  rows="3"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
                    isEditing
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  ]"
                  required
                ></textarea>
              </div>

              <!-- Telepon -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.telepon"
                  type="tel"
                  :disabled="!isEditing"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
                    isEditing
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  ]"
                  required
                >
              </div>

              <!-- Submit Button -->
              <div v-if="isEditing" class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="toggleEditMode"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="profileStore.updating || !isFormValid"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="profileStore.updating">
                    <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Menyimpan...
                  </span>
                  <span v-else>Simpan Perubahan</span>
                </button>
              </div>
            </form>

            <!-- Verification Status Info -->
            <div v-if="!profileStore.isApproved" class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex">
                <svg class="h-5 w-5 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-yellow-800">Menunggu Verifikasi</h4>
                  <p class="text-sm text-yellow-700 mt-1">
                    UMKM Anda sedang dalam proses verifikasi oleh admin. Pastikan data yang Anda berikan sudah lengkap dan valid.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUmkmProfileStore } from '@/stores/umkm-profile'
import { useNotificationStore } from '@/stores/notification'

// Stores
const profileStore = useUmkmProfileStore()
const notificationStore = useNotificationStore()

// Refs
const alertRef = ref(null)
const logoInput = ref(null)
const kecamatansLoading = ref(false)
const isEditing = ref(false)
const newLogo = ref(null)
const newLogoPreview = ref(null)

// Form Data
const formData = reactive({
  nama_umkm: '',
  deskripsi: '',
  kecamatan_id: '',
  alamat: '',
  telepon: '',
  foto_logo: null
})

// Statistics
const statistics = reactive({
  total_products: 0,
  total_orders: 0,
  total_revenue: 0,
  pending_orders: 0
})

// Computed
const isFormValid = computed(() => {
  return formData.nama_umkm.trim() !== '' &&
         formData.kecamatan_id !== '' &&
         formData.alamat.trim() !== '' &&
         formData.telepon.trim() !== ''
})

// Methods
const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
   notificationStore.showNotification({
      type: 'error',
      message: 'Ukuran file terlalu besar. Maksimal 2MB.'
    })
    return
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    notificationStore.showNotification({
      type: 'error',
      message: 'Format file tidak valid. Gunakan JPG, JPEG, atau PNG.'
    })
    return
  }

  newLogo.value = file
  newLogoPreview.value = URL.createObjectURL(file)
  formData.foto_logo = file
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.classList.add('bg-gray-200')
}

const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    resetFormData()
    newLogo.value = null
    newLogoPreview.value = null
    formData.foto_logo = null
  }
}

const resetFormData = () => {
  const profile = profileStore.profile
  formData.nama_umkm = profile.nama_umkm || ''
  formData.deskripsi = profile.deskripsi || ''
  formData.kecamatan_id = profile.kecamatan_id || ''
  formData.alamat = profile.alamat || ''
  formData.telepon = profile.telepon || ''
  formData.foto_logo = null
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    notificationStore.showNotification({
      type: 'error',
      message: 'Mohon lengkapi semua field yang wajib diisi.'
    })
    return
  }

  try {
    const submitData = { ...formData }

    // Remove empty values
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === null || submitData[key] === undefined || submitData[key] === '') {
        delete submitData[key]
      }
    })

    const response = await profileStore.updateProfile(submitData)

    // Reset form
    newLogo.value = null
    newLogoPreview.value = null
    isEditing.value = false

    // Refresh data
    await fetchStatistics()

    notificationStore.showNotification({
      type: 'success',
      message: 'Profile berhasil diperbarui'
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    const errorMessage = error.response?.data?.message || 'Gagal memperbarui profile'
    notificationStore.showNotification({
      type: 'error',
      message: errorMessage
    })
  }
}

const fetchProfile = async () => {
  try {
    await profileStore.fetchProfile()
    resetFormData()
  } catch (error) {
    console.error('Error fetching profile:', error)
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat data profile'
    })
  }
}

const fetchKecamatans = async () => {
  kecamatansLoading.value = true
  try {
    await profileStore.fetchKecamatans()
  } catch (error) {
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat data kecamatan'
    })
  } finally {
    kecamatansLoading.value = false
  }
}

const fetchStatistics = async () => {
  try {
    const stats = await profileStore.fetchStatistics()
    Object.assign(statistics, stats)
  } catch (error) {
    console.error('Error fetching statistics:', error)
  }
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatJoinDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchProfile(),
    fetchKecamatans(),
    fetchStatistics()
  ])
})
</script>

<style scoped>
input:disabled, textarea:disabled, select:disabled {
  cursor: not-allowed;
}
</style>
