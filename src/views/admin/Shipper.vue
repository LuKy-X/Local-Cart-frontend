<template>
  <div class="p-1">
    <!-- Alert Notification -->
    <AlertNotification ref="alertRef" :auto-remove="3000" />

    <!-- Header dan Stats Cards -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manajemen Shipper</h2>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Tambah Shipper
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <!-- Total Shippers Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Shipper</p>
            <p class="text-2xl font-bold text-gray-800">{{ shipperStore.statistics.total_shippers }}</p>
          </div>
        </div>
      </div>

      <!-- Total Orders Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Order</p>
            <p class="text-2xl font-bold text-gray-800">{{ shipperStore.statistics.total_orders }}</p>
          </div>
        </div>
      </div>

      <!-- Average Orders Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Rata-rata Order/Shipper</p>
            <p class="text-2xl font-bold text-gray-800">{{ shipperStore.statistics.average_orders_per_shipper }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Most Orders Shipper Card -->
    <div v-if="shipperStore.statistics.most_orders_shipper" class="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-indigo-500">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Shipper dengan Order Terbanyak</p>
            <p class="text-xl font-bold text-gray-800">
              {{ shipperStore.statistics.most_orders_shipper.name }}
              <span class="text-lg text-gray-600 ml-2">
                ({{ shipperStore.statistics.most_orders_shipper.count }} order)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search Input -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Shipper</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nama shipper..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleSearch"
          >
        </div>

        <!-- Sort Options -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
          <div class="flex gap-2">
            <select
              v-model="filters.sort_field"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="fetchShippers"
            >
              <option value="created_at">Tanggal Dibuat</option>
              <option value="shipper_name">Nama Shipper</option>
              <option value="orders_count">Jumlah Order</option>
              <option value="updated_at">Terakhir Diupdate</option>
            </select>
            <select
              v-model="filters.sort_direction"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="fetchShippers"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Shipper Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipper</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Order</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="shipper in shipperStore.shippers" :key="shipper.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span class="text-white font-semibold text-sm">
                        {{ getInitials(shipper.shipper_name) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ shipper.shipper_name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                    shipper.orders_count > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ shipper.orders_count }} order
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(shipper.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="openDetailModal(shipper)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Lihat Detail"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button
                    @click="openEditModal(shipper)"
                    class="text-green-600 hover:text-green-900"
                    title="Edit Shipper"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    @click="deleteShipper(shipper.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Hapus Shipper"
                    :disabled="shipper.orders_count > 0"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading State -->
      <div v-if="shipperStore.showLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Memuat data...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!shipperStore.hasShippers" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada Shipper</h3>
        <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat shipper pertama Anda.</p>
        <div class="mt-6">
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Tambah Shipper
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="shipperStore.hasShippers" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Menampilkan
              <span class="font-medium">{{ (shipperStore.currentPage - 1) * 10 + 1 }}</span>
              sampai
              <span class="font-medium">{{ Math.min(shipperStore.currentPage * 10, shipperStore.totalItems) }}</span>
              dari
              <span class="font-medium">{{ shipperStore.totalItems }}</span>
              hasil
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="shipperStore.currentPage === 1 || shipperStore.loading"
              @click="changePage(shipperStore.currentPage - 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                shipperStore.currentPage === 1 || shipperStore.loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              ]"
            >
              Sebelumnya
            </button>
            <button
              :disabled="shipperStore.currentPage === shipperStore.totalPages || shipperStore.loading"
              @click="changePage(shipperStore.currentPage + 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                shipperStore.currentPage === shipperStore.totalPages || shipperStore.loading
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

    <!-- Modal Detail Shipper -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDetailModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">Detail Shipper</h3>
              <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <hr class="mb-3">

            <div v-if="selectedShipper" class="space-y-6">
              <!-- Header Info -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span class="text-white font-semibold text-lg">
                      {{ getInitials(selectedShipper.shipper_name) }}
                    </span>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="text-xl font-semibold text-gray-900">{{ selectedShipper.shipper_name }}</h4>
                  <p class="text-gray-600">{{ selectedShipper.orders_count }} order</p>
                </div>
              </div>

              <!-- Main Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Informasi</h5>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600">Tanggal Dibuat:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedShipper.created_at) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600">Terakhir Diupdate:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedShipper.updated_at) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Statistik Order</h5>
                    <div class="bg-gray-50 rounded-lg p-4 text-center">
                      <p class="text-3xl font-bold text-indigo-600">{{ selectedShipper.orders_count }}</p>
                      <p class="text-sm text-gray-600">Total Order yang dikirim oleh Shipper</p>
                    </div>
                  </div>

                  <div v-if="selectedShipper.orders && selectedShipper.orders.length > 0">
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Order Terbaru</h5>
                    <div class="space-y-2 max-h-60 overflow-y-auto">
                      <div
                        v-for="order in selectedShipper.orders"
                        :key="order.id"
                        class="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div class="h-10 w-10 rounded bg-gray-300 flex items-center justify-center">
                          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">Order #{{ order.kode_order }}</p>
                          <div class="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{{ order.umkm?.nama_umkm }}</span>
                            <span>•</span>
                            <span>{{ order.customer?.nama }}</span>
                            <span>•</span>
                            <span>Rp {{ formatPrice(order.grand_total) }}</span>
                          </div>
                        </div>
                        <div class="flex items-center space-x-1">
                          <span :class="getStatusBadgeClasses(order.status)" class="text-xs font-medium px-2 py-1 rounded-full">
                            {{ getStatusText(order.status) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  @click="closeDetailModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Tutup
                </button>
                <button
                  @click="openEditModal(selectedShipper)"
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  Edit Shipper
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit Shipper -->
    <div v-if="showFormModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeFormModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">
                {{ isEditing ? 'Edit Shipper' : 'Tambah Shipper' }}
              </h3>
              <button @click="closeFormModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <hr class="mb-3">

            <form @submit.prevent="submitForm">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nama Shipper</label>
                  <input
                    v-model="formData.shipper_name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama shipper"
                  >
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  @click="closeFormModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="formLoading"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="formLoading">Menyimpan...</span>
                  <span v-else>{{ isEditing ? 'Update' : 'Simpan' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useShipperStore } from '@/stores/shipper'
import { useNotificationStore } from '@/stores/notification'

// Stores
const shipperStore = useShipperStore()
const notificationStore = useNotificationStore()

// State
const showDetailModal = ref(false)
const showFormModal = ref(false)
const selectedShipper = ref(null)
const isEditing = ref(false)
const formLoading = ref(false)
const searchTimeout = ref(null)

// Form Data
const formData = reactive({
  shipper_name: ''
})

// Filters
const filters = reactive({
  search: '',
  sort_field: 'created_at',
  sort_direction: 'desc'
})

// Methods
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    fetchShippers()
  }, 50)
}

const fetchShippers = async () => {
  try {
    await shipperStore.fetchShippers(filters)
  } catch (error) {
    console.error('Error fetching shippers:', error)
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat data shipper'
    })
  }
}

const changePage = (page) => {
  fetchShippers(page)
}

const openDetailModal = async (shipper) => {
  try {
    const response = await shipperStore.fetchShipperDetail(shipper.id)

    // Universal data extraction
    const shipperData = (response && response.data) ? response.data : response

    selectedShipper.value = shipperData
    showDetailModal.value = true

  } catch (error) {
    console.error('Error fetching shipper detail:', error)
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat detail shipper'
    })
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedShipper.value = null
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showFormModal.value = true
}

const openEditModal = (shipper) => {
  isEditing.value = true
  selectedShipper.value = shipper
  formData.shipper_name = shipper.shipper_name
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.shipper_name = ''
  isEditing.value = false
}

const submitForm = async () => {
  formLoading.value = true
  try {
    if (isEditing.value) {
      await shipperStore.updateShipper(selectedShipper.value.id, formData)
      Object.assign(selectedShipper.value, {
        shipper_name: formData.shipper_name,
        updated_at: new Date().toISOString()
      })
      notificationStore.showNotification({
        type: 'success',
        message: `Shipper berhasil diupdate`
      })
    } else {
      await shipperStore.createShipper(formData)
      notificationStore.showNotification({
        type: 'success',
        message: 'Shipper berhasil ditambahkan'
      })
    }

    await fetchShippers()
    await shipperStore.fetchStatistics()
    closeFormModal()
  } catch (error) {
    console.error('Error saving shipper:', error)

    // Cek apakah error memiliki pesan dari response
    const errorMessage = error.response?.data?.message || 'Gagal menyimpan shipper'
    notificationStore.showNotification({
      type: 'error',
      message: errorMessage
    })
  } finally {
    formLoading.value = false
  }
}

const deleteShipper = async (shipperId) => {
  const shipper = shipperStore.shippers.find(s => s.id === shipperId)

  if (shipper.orders_count > 0) {
    notificationStore.showNotification({
      type: 'error',
      message: `Shipper dengan order tidak dapat dihapus`
    })
    return
  }

  if (!confirm('Apakah Anda yakin ingin menghapus shipper ini?')) return

  try {
    await shipperStore.deleteShipper(shipperId)
    await fetchShippers()
    await shipperStore.fetchStatistics()
    notificationStore.showNotification({
      type: 'success',
      message: `Berhasil menghapus shipper`
    })
  } catch (error) {
    console.error('Error deleting shipper:', error)

    // Cek apakah error memiliki pesan khusus
    const errorMessage = error.response?.data?.message || 'Gagal menghapus shipper'
    notificationStore.showNotification({
      type: 'error',
      message: errorMessage
    })
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('id-ID').format(price)
}

const getInitials = (name) => {
  if (!name) return 'S'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getStatusBadgeClasses = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Menunggu',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Terkirim',
    cancelled: 'Dibatalkan'
  }
  return texts[status] || status
}

// Lifecycle
onMounted(() => {
  if (!shipperStore.initialized) {
    shipperStore.fetchStatistics()
    fetchShippers()
  }
})

// Cleanup
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
