<template>
  <div class="p-1">
    <!-- Header dan Stats Cards -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manajemen Customer</h2>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <!-- Total Customers Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Customer</p>
            <p class="text-2xl font-bold text-gray-800">{{ customerStore.statistics.total_customers }}</p>
          </div>
        </div>
      </div>

      <!-- Customers with Orders Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Customer Berbelanja</p>
            <p class="text-2xl font-bold text-gray-800">{{ customerStore.statistics.total_with_orders }}</p>
          </div>
        </div>
      </div>

      <!-- Customers with Ratings Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Memberi Rating</p>
            <p class="text-2xl font-bold text-gray-800">{{ customerStore.statistics.total_with_ratings }}</p>
          </div>
        </div>
      </div>

      <!-- New Customers This Month Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Baru Bulan Ini</p>
            <p class="text-2xl font-bold text-gray-800">{{ customerStore.statistics.new_customers_this_month }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Customer</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nama customer atau email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleSearch"
          >
        </div>

        <!-- Kecamatan Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
          <select
            v-model="filters.kecamatan_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchCustomers"
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
              @change="fetchCustomers"
            >
              <option value="created_at">Tanggal Daftar</option>
              <option value="nama_customer">Nama Customer</option>
              <option value="updated_at">Terakhir Diupdate</option>
            </select>
            <select
              v-model="filters.sort_direction"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="fetchCustomers"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statistik</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="customer in customerStore.customers" :key="customer.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-white font-semibold text-sm">
                        {{ getInitials(customer.nama_customer) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ customer.nama_customer }}</div>
                    <div class="text-sm text-gray-500">{{ customer.user?.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ customer.telepon || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ customer.kecamatan?.nama_kecamatan }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-2 text-xs">
                  <span class="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {{ customer.orders_count || 0 }} order
                  </span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {{ customer.ratings_count || 0 }} rating
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(customer.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="openModal(customer)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Lihat Detail"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading State -->
      <div v-if="customerStore.showLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Memuat data...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!customerStore.hasCustomers" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada Customer</h3>
        <p class="mt-1 text-sm text-gray-500">Tidak ada customer yang sesuai dengan filter yang dipilih.</p>
      </div>

      <!-- Pagination -->
      <div v-if="customerStore.hasCustomers" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Menampilkan
              <span class="font-medium">{{ (customerStore.currentPage - 1) * 10 + 1 }}</span>
              sampai
              <span class="font-medium">{{ Math.min(customerStore.currentPage * 10, customerStore.totalItems) }}</span>
              dari
              <span class="font-medium">{{ customerStore.totalItems }}</span>
              hasil
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="customerStore.currentPage === 1"
              @click="changePage(customerStore.currentPage - 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                customerStore.currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              ]"
            >
              Sebelumnya
            </button>
            <button
              :disabled="customerStore.currentPage === customerStore.totalPages"
              @click="changePage(customerStore.currentPage + 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                customerStore.currentPage === customerStore.totalPages
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

    <!-- Modal Detail Customer -->
    <div v-if="showModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">Detail Customer</h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <hr class="mb-3">

            <div v-if="selectedCustomer" class="space-y-6">
              <!-- Header Info -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                    <span class="text-white font-semibold text-lg">
                      {{ getInitials(selectedCustomer.nama_customer) }}
                    </span>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="text-xl font-semibold text-gray-900">{{ selectedCustomer.nama_customer }}</h4>
                  <p class="text-gray-600">{{ selectedCustomer.user?.email }}</p>
                  <div class="flex space-x-2 mt-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      {{ selectedCustomer.orders_count || 0 }} Order
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {{ selectedCustomer.ratings_count || 0 }} Rating
                    </span>
                  </div>
                </div>
              </div>

              <!-- Main Info Grid -->
              <div class="grid grid-cols-1 gap-6">
                <!-- Customer Details -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Alamat</h5>
                    <p class="text-gray-900">{{ selectedCustomer.alamat }}</p>
                    <p class="text-gray-600 mt-1">{{ selectedCustomer.kecamatan?.nama_kecamatan }}</p>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Kontak</h5>
                    <p class="text-gray-900">{{ selectedCustomer.telepon || '-' }}</p>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Tanggal Bergabung</h5>
                    <p class="text-gray-900">{{ formatDate(selectedCustomer.created_at) }}</p>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Statistik Detail</h5>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <p class="text-2xl font-bold text-blue-600">{{ selectedCustomer.orders_count || 0 }}</p>
                        <p class="text-sm text-gray-600">Total Order</p>
                      </div>
                      <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <p class="text-2xl font-bold text-purple-600">{{ selectedCustomer.ratings_count || 0 }}</p>
                        <p class="text-sm text-gray-600">Total Rating</p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useCustomerStore } from '@/stores/customer'
import { useKecamatanStore } from '@/stores/kecamatan'

// Stores
const customerStore = useCustomerStore()
const kecamatanStore = useKecamatanStore()

// State
const showModal = ref(false)
const selectedCustomer = ref(null)
const searchTimeout = ref(null)

// Filters
const filters = reactive({
  search: '',
  kecamatan_id: '',
  sort_field: 'created_at',
  sort_direction: 'desc'
})

// Methods - PERBAIKAN DEBOUNCE
const handleSearch = () => {
  // Clear timeout sebelumnya dengan segera
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // Gunakan timeout yang sangat pendek (50ms) untuk responsivitas
  searchTimeout.value = setTimeout(() => {
    fetchCustomers()
  }, 50)
}

const fetchCustomers = async () => {
  try {
    await customerStore.fetchCustomers(filters)
  } catch (error) {
    console.error('Error fetching customers:', error)
  }
}

const changePage = (page) => {
  fetchCustomers(page)
}

const openModal = (customer) => {
  selectedCustomer.value = customer
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCustomer.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getInitials = (name) => {
  if (!name) return 'C'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Lifecycle
onMounted(() => {
  // Hanya fetch data jika belum pernah di-load sebelumnya
  if (!customerStore.initialized) {
    customerStore.fetchStatistics()
    fetchCustomers()
  }
  kecamatanStore.fetchKecamatans()
})

// Cleanup
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>
