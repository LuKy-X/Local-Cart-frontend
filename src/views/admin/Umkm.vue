<template>
  <div class="p-1">
    <!-- Header dan Stats Cards -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manajemen UMKM</h2>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Total UMKM Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total UMKM</p>
            <p class="text-2xl font-bold text-gray-800">{{ umkmStore.statistics.total_umkms }}</p>
          </div>
        </div>
      </div>

      <!-- Approved UMKM Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">UMKM Approved</p>
            <p class="text-2xl font-bold text-gray-800">{{ umkmStore.statistics.total_approved }}</p>
          </div>
        </div>
      </div>

      <!-- Pending UMKM Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">UMKM Pending</p>
            <p class="text-2xl font-bold text-gray-800">{{ umkmStore.statistics.total_pending }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Search Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari UMKM</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nama UMKM atau pemilik..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleSearch"
          >
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchUmkms"
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        <!-- Kecamatan Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
          <select
            v-model="filters.kecamatan_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchUmkms"
          >
            <option value="">Semua Kecamatan</option>
            <option v-for="kecamatan in kecamatanStore.kecamatans" :key="kecamatan.id" :value="kecamatan.id">
              {{ kecamatan.nama_kecamatan }}
            </option>
          </select>
        </div>

        <!-- Sort Options -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
          <div class="flex gap-2">
            <select
              v-model="filters.sort_field"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="fetchUmkms"
            >
              <option value="created_at">Tanggal Daftar</option>
              <option value="nama_umkm">Nama UMKM</option>
            </select>
            <select
              v-model="filters.sort_direction"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="fetchUmkms"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- UMKM Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UMKM</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemilik</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="umkm in umkmStore.umkms" :key="umkm.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="umkm.foto_logo"
                      class="h-10 w-10 rounded-full object-cover"
                      :src="umkm.foto_logo"
                      :alt="umkm.nama_umkm"
                    >
                    <div
                      v-else
                      class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                    >
                      <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ umkm.nama_umkm }}</div>
                    <div class="text-sm text-gray-500">{{ umkm.products_count }} produk</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ umkm.user.name }}</div>
                <div class="text-sm text-gray-500">{{ umkm.user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ umkm.telepon }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ umkm.kecamatan.nama_kecamatan }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    umkm.is_approved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ umkm.is_approved ? 'Approved' : 'Pending' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(umkm.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="openModal(umkm)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Lihat Detail"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button
                    v-if="!umkm.is_approved"
                    @click="approveUmkm(umkm.id)"
                    class="text-green-600 hover:text-green-900"
                    title="Approve UMKM"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <button
                    v-if="umkm.is_approved"
                    @click="rejectUmkm(umkm.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Reject UMKM"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading State -->
      <div v-if="umkmStore.showLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Memuat data...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!umkmStore.hasUmkms" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada UMKM</h3>
        <p class="mt-1 text-sm text-gray-500">Tidak ada UMKM yang sesuai dengan filter yang dipilih.</p>
      </div>

      <!-- Pagination -->
      <div v-if="umkmStore.hasUmkms" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Menampilkan
              <span class="font-medium">{{ (umkmStore.currentPage - 1) * 10 + 1 }}</span>
              sampai
              <span class="font-medium">{{ Math.min(umkmStore.currentPage * 10, umkmStore.totalItems) }}</span>
              dari
              <span class="font-medium">{{ umkmStore.totalItems }}</span>
              hasil
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="umkmStore.currentPage === 1"
              @click="changePage(umkmStore.currentPage - 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                umkmStore.currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              ]"
            >
              Sebelumnya
            </button>
            <button
              :disabled="umkmStore.currentPage === umkmStore.totalPages"
              @click="changePage(umkmStore.currentPage + 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                umkmStore.currentPage === umkmStore.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              ]"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detail UMKM - PERBAIKAN -->
    <div v-if="showModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">Detail UMKM</h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <hr class="mb-3">

            <div v-if="selectedUmkm" class="space-y-6">
              <!-- Header Info -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <img
                    v-if="selectedUmkm.foto_logo"
                    class="h-16 w-16 rounded-lg object-cover border"
                    :src="selectedUmkm.foto_logo"
                    :alt="selectedUmkm.nama_umkm"
                  >
                  <div
                    v-else
                    class="h-16 w-16 rounded-lg bg-gray-300 flex items-center justify-center border"
                  >
                    <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="text-xl font-semibold text-gray-900">{{ selectedUmkm.nama_umkm }}</h4>
                  <p class="text-gray-600">{{ selectedUmkm.user?.name }} • {{ selectedUmkm.user?.email }}</p>
                  <span
                    :class="[
                      'inline-flex mt-2 px-3 py-1 text-sm font-semibold rounded-full',
                      selectedUmkm.is_approved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    ]"
                  >
                    {{ selectedUmkm.is_approved ? 'Approved' : 'Pending Approval' }}
                  </span>
                </div>
              </div>

              <!-- Main Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Deskripsi UMKM</h5>
                    <p class="text-gray-900 whitespace-pre-line">{{ selectedUmkm.deskripsi || 'Tidak ada deskripsi' }}</p>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Alamat</h5>
                    <p class="text-gray-900">{{ selectedUmkm.alamat }}</p>
                    <p class="text-gray-600 mt-1">{{ selectedUmkm.kecamatan?.nama_kecamatan }}</p>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Kontak</h5>
                    <p class="text-gray-900">{{ selectedUmkm.telepon || '-' }}</p>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Statistik</h5>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <p class="text-2xl font-bold text-blue-600">{{ selectedUmkm.products_count || 0 }}</p>
                        <p class="text-sm text-gray-600">Produk</p>
                      </div>
                      <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <p class="text-2xl font-bold text-green-600">{{ selectedUmkm.orders_count || 0 }}</p>
                        <p class="text-sm text-gray-600">Order</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Tanggal Bergabung</h5>
                    <p class="text-gray-900">{{ formatDate(selectedUmkm.created_at) }}</p>
                  </div>

                  <div v-if="selectedUmkm.products && selectedUmkm.products.length > 0">
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Produk Terbaru</h5>
                    <div class="space-y-2">
                      <div
                        v-for="product in selectedUmkm.products.slice(0, 3)"
                        :key="product.id"
                        class="flex items-center space-x-3 p-2 bg-gray-50 rounded"
                      >
                        <img
                          v-if="product.foto"
                          class="h-8 w-8 rounded object-cover"
                          :src="product.foto"
                          :alt="product.nama_produk"
                        >
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900">{{ product.nama_produk }}</p>
                          <p class="text-xs text-gray-500">Rp {{ formatPrice(product.harga) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  @click="closeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Tutup
                </button>
                <button
                  v-if="!selectedUmkm.is_approved"
                  @click="approveUmkm(selectedUmkm.id)"
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  Approve UMKM
                </button>
                <button
                  v-if="selectedUmkm.is_approved"
                  @click="rejectUmkm(selectedUmkm.id)"
                  class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Reject UMKM
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUmkmStore } from '@/stores/umkm'
import { useNotificationStore } from '@/stores/notification'
import { useKecamatanStore } from '@/stores/kecamatan'

// Stores
const umkmStore = useUmkmStore()
const kecamatanStore = useKecamatanStore()
const notificationStore = useNotificationStore()

// State
const showModal = ref(false)
const selectedUmkm = ref(null)

// Filters
const filters = reactive({
  search: '',
  status: '',
  kecamatan_id: '',
  sort_field: 'created_at',
  sort_direction: 'desc'
})

// Methods
const handleSearch = () => {
  if (window.searchTimeout) {
    clearTimeout(window.searchTimeout)
  }

  window.searchTimeout = setTimeout(() => {
    fetchUmkms()
  }, 50)
}

const fetchUmkms = async () => {
  try {
    await umkmStore.fetchUmkms(filters)
  } catch (error) {
    console.error('Error fetching UMKM:', error)
  }
}

const changePage = (page) => {
  fetchUmkms(page)
}

const openModal = (umkm) => {
  selectedUmkm.value = umkm
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUmkm.value = null
}

const approveUmkm = async (umkmId) => {
  try {
    await umkmStore.approveUmkm(umkmId)
    await fetchUmkms() // Refresh list
    closeModal()
  } catch (error) {
    console.error('Error approving UMKM:', error)
  }
}

const rejectUmkm = async (umkmId) => {
  try {
    await umkmStore.rejectUmkm(umkmId)
    await fetchUmkms() // Refresh list
    closeModal()
  } catch (error) {
    console.error('Error rejecting UMKM:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  if (!umkmStore.initialized) {
    umkmStore.fetchStatistics()
    fetchUmkms()
  }
  kecamatanStore.fetchKecamatans()
})
</script>

