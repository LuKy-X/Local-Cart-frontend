<template>
  <div class="p-1">
    <!-- Alert Notification -->
    <AlertNotification ref="alertRef" :auto-remove="3000" />

    <!-- Header dan Stats Cards -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manajemen Kecamatan</h2>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Tambah Kecamatan
      </button>
    </div>

    <!-- Statistics Cards (Maksimal 4) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Kecamatan Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Kecamatan</p>
            <p class="text-2xl font-bold text-gray-800">{{ kecamatanStore.statistics.total_kecamatans }}</p>
          </div>
        </div>
      </div>

      <!-- Kecamatan dengan UMKM Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Kecamatan Berisi UMKM</p>
            <p class="text-2xl font-bold text-gray-800">{{ kecamatanStore.statistics.kecamatans_with_umkm }}</p>
          </div>
        </div>
      </div>

      <!-- Kecamatan dengan Customer Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Kecamatan Berisi Customer</p>
            <p class="text-2xl font-bold text-gray-800">{{ kecamatanStore.statistics.kecamatans_with_customers }}</p>
          </div>
        </div>
      </div>

      <!-- Kecamatan Tanpa Data Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Kecamatan Tanpa Data</p>
            <p class="text-2xl font-bold text-gray-800">{{ kecamatanStore.statistics.kecamatans_without_data }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Most Active Kecamatan Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Kecamatan dengan UMKM Terbanyak -->
      <div v-if="kecamatanStore.statistics.most_umkm_kecamatan" class="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Kecamatan dengan UMKM Terbanyak</p>
            <p class="text-xl font-bold text-gray-800">
              {{ kecamatanStore.statistics.most_umkm_kecamatan.name }}
              <span class="text-lg text-gray-600 ml-2">
                ({{ kecamatanStore.statistics.most_umkm_kecamatan.count }} UMKM)
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Kecamatan dengan Customer Terbanyak -->
      <div v-if="kecamatanStore.statistics.most_customer_kecamatan" class="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Kecamatan dengan Customer Terbanyak</p>
            <p class="text-xl font-bold text-gray-800">
              {{ kecamatanStore.statistics.most_customer_kecamatan.name }}
              <span class="text-lg text-gray-600 ml-2">
                ({{ kecamatanStore.statistics.most_customer_kecamatan.count }} customer)
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Kecamatan</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nama kecamatan..."
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
              @change="fetchKecamatans"
            >
              <option value="nama_kecamatan">Nama Kecamatan</option>
              <option value="umkms_count">Jumlah UMKM</option>
              <option value="customers_count">Jumlah Customer</option>
              <option value="created_at">Tanggal Dibuat</option>
              <option value="updated_at">Terakhir Diupdate</option>
            </select>
            <select
              v-model="filters.sort_direction"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="fetchKecamatans"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Kecamatan Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Koordinat</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah UMKM</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="kecamatan in kecamatanStore.kecamatans" :key="kecamatan.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-white font-semibold text-sm">
                        {{ getInitials(kecamatan.nama_kecamatan) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ kecamatan.nama_kecamatan }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <span v-if="kecamatan.latitude && kecamatan.longitude">
                    {{ kecamatan.latitude }}, {{ kecamatan.longitude }}
                  </span>
                  <span v-else class="text-gray-400">Belum diatur</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                    kecamatan.umkms_count > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ kecamatan.umkms_count }} UMKM
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                    kecamatan.customers_count > 0
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ kecamatan.customers_count }} customer
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(kecamatan.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="openDetailModal(kecamatan)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Lihat Detail"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button
                    @click="openEditModal(kecamatan)"
                    class="text-green-600 hover:text-green-900"
                    title="Edit Kecamatan"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    @click="deleteKecamatan(kecamatan.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Hapus Kecamatan"
                    :disabled="kecamatan.umkms_count > 0 || kecamatan.customers_count > 0"
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
      <div v-if="kecamatanStore.showLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Memuat data...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!kecamatanStore.hasKecamatans" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada Kecamatan</h3>
        <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat kecamatan pertama Anda.</p>
        <div class="mt-6">
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Tambah Kecamatan
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="kecamatanStore.hasKecamatans" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Menampilkan
              <span class="font-medium">{{ (kecamatanStore.currentPage - 1) * 10 + 1 }}</span>
              sampai
              <span class="font-medium">{{ Math.min(kecamatanStore.currentPage * 10, kecamatanStore.totalItems) }}</span>
              dari
              <span class="font-medium">{{ kecamatanStore.totalItems }}</span>
              hasil
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="kecamatanStore.currentPage === 1 || kecamatanStore.loading"
              @click="changePage(kecamatanStore.currentPage - 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                kecamatanStore.currentPage === 1 || kecamatanStore.loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              ]"
            >
              Sebelumnya
            </button>
            <button
              :disabled="kecamatanStore.currentPage === kecamatanStore.totalPages || kecamatanStore.loading"
              @click="changePage(kecamatanStore.currentPage + 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                kecamatanStore.currentPage === kecamatanStore.totalPages || kecamatanStore.loading
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

    <!-- Modal Detail Kecamatan -->
    <div v-if="showDetailModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDetailModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">Detail Kecamatan</h3>
              <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <hr class="mb-3">

            <div v-if="selectedKecamatan" class="space-y-6">
              <!-- Header Info -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                    <span class="text-white font-semibold text-lg">
                      {{ getInitials(selectedKecamatan.nama_kecamatan) }}
                    </span>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="text-xl font-semibold text-gray-900">{{ selectedKecamatan.nama_kecamatan }}</h4>
                  <div class="flex items-center space-x-4 mt-1">
                    <span class="text-gray-600">{{ selectedKecamatan.umkms_count }} UMKM</span>
                    <span class="text-gray-400">•</span>
                    <span class="text-gray-600">{{ selectedKecamatan.customers_count }} customer</span>
                  </div>
                </div>
              </div>

              <!-- Main Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Koordinat Geografis</h5>
                    <div v-if="selectedKecamatan.latitude && selectedKecamatan.longitude" class="bg-gray-50 rounded-lg p-4">
                      <div class="flex justify-between mb-2">
                        <span class="text-sm text-gray-600">Latitude:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedKecamatan.latitude }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600">Longitude:</span>
                        <span class="text-sm font-medium text-gray-900">{{ selectedKecamatan.longitude }}</span>
                      </div>
                    </div>
                    <div v-else class="bg-gray-50 rounded-lg p-4 text-center">
                      <p class="text-sm text-gray-500">Koordinat belum diatur</p>
                    </div>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Informasi</h5>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600">Tanggal Dibuat:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedKecamatan.created_at) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600">Terakhir Diupdate:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedKecamatan.updated_at) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Statistik</h5>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-green-50 rounded-lg p-4 text-center">
                        <p class="text-2xl font-bold text-green-600">{{ selectedKecamatan.umkms_count }}</p>
                        <p class="text-sm text-gray-600">UMKM</p>
                      </div>
                      <div class="bg-purple-50 rounded-lg p-4 text-center">
                        <p class="text-2xl font-bold text-purple-600">{{ selectedKecamatan.customers_count }}</p>
                        <p class="text-sm text-gray-600">Customer</p>
                      </div>
                    </div>
                  </div>

                  <div v-if="selectedKecamatan.umkms && selectedKecamatan.umkms.length > 0">
                    <h5 class="text-sm font-medium text-gray-500 mb-2">UMKM Terbaru</h5>
                    <div class="space-y-2 max-h-60 overflow-y-auto">
                      <div
                        v-for="umkm in selectedKecamatan.umkms"
                        :key="umkm.id"
                        class="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div class="h-10 w-10 rounded bg-gray-300 flex items-center justify-center">
                          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">{{ umkm.nama_umkm }}</p>
                          <div class="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{{ umkm.email }}</span>
                            <span>•</span>
                            <span>{{ umkm.products_count }} produk</span>
                          </div>
                        </div>
                        <span :class="[
                          'text-xs font-medium px-2 py-1 rounded-full',
                          umkm.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        ]">
                          {{ umkm.is_active ? 'Aktif' : 'Nonaktif' }}
                        </span>
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
                  @click="openEditModal(selectedKecamatan)"
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  Edit Kecamatan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit Kecamatan -->
    <div v-if="showFormModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeFormModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">
                {{ isEditing ? 'Edit Kecamatan' : 'Tambah Kecamatan' }}
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nama Kecamatan</label>
                  <input
                    v-model="formData.nama_kecamatan"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama kecamatan"
                  >
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      v-model="formData.latitude"
                      type="number"
                      step="any"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="-7.123456"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      v-model="formData.longitude"
                      type="number"
                      step="any"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="110.123456"
                    >
                  </div>
                </div>
                <p class="text-xs text-gray-500">Catatan: Koordinat bersifat opsional. Contoh: -7.123456, 110.123456</p>
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
import { useKecamatanStore } from '@/stores/kecamatan'
import { useNotificationStore } from '@/stores/notification'

// Stores
const kecamatanStore = useKecamatanStore()
const notificationStore = useNotificationStore()


// State
const showDetailModal = ref(false)
const showFormModal = ref(false)
const selectedKecamatan = ref(null)
const isEditing = ref(false)
const formLoading = ref(false)
const searchTimeout = ref(null)

// Form Data
const formData = reactive({
  nama_kecamatan: '',
  latitude: null,
  longitude: null
})

// Filters
const filters = reactive({
  search: '',
  sort_field: 'nama_kecamatan',
  sort_direction: 'asc'
})

// Methods
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    fetchKecamatans()
  }, 50)
}

const fetchKecamatans = async () => {
  try {
    await kecamatanStore.fetchKecamatans(filters)
  } catch (error) {
    console.error('Error fetching kecamatans:', error)
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat data kecamatan'
    })
  }
}

const changePage = (page) => {
  fetchKecamatans(page)
}

const openDetailModal = async (kecamatan) => {
  try {
    const response = await kecamatanStore.fetchKecamatanDetail(kecamatan.id)

    // Universal data extraction
    const kecamatanData = (response && response.data) ? response.data : response

    selectedKecamatan.value = kecamatanData
    showDetailModal.value = true

  } catch (error) {
    console.error('Error fetching kecamatan detail:', error)
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat detail kecamatan'
    })
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedKecamatan.value = null
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showFormModal.value = true
}

const openEditModal = (kecamatan) => {
  isEditing.value = true
  selectedKecamatan.value = kecamatan
  formData.nama_kecamatan = kecamatan.nama_kecamatan
  formData.latitude = kecamatan.latitude
  formData.longitude = kecamatan.longitude
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.nama_kecamatan = ''
  formData.latitude = null
  formData.longitude = null
  isEditing.value = false
}

const submitForm = async () => {
  formLoading.value = true
  try {
    // Clean up empty values
    const cleanData = {
      nama_kecamatan: formData.nama_kecamatan,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null
    }

    if (isEditing.value) {
      await kecamatanStore.updateKecamatan(selectedKecamatan.value.id, cleanData)
      Object.assign(selectedKecamatan.value, {
        ...cleanData,
        updated_at: new Date().toISOString()
      })
      notificationStore.showNotification({
        type: 'success',
        message: `Kecamatan berhasil diperbarui`
      })
    } else {
      await kecamatanStore.createKecamatan(cleanData)
      notificationStore.showNotification({
        type: 'success',
        message: `Kecamatan berhasil ditambahkan`
      })
    }

    await fetchKecamatans()
    await kecamatanStore.fetchStatistics()
    closeFormModal()
  } catch (error) {
    console.error('Error saving kecamatan:', error)

    // Cek apakah error memiliki pesan dari response
    const errorMessage = error.response?.data?.message || 'Gagal menyimpan kecamatan'
    notificationStore.showNotification({
      type: 'error',
      message: errorMessage
    })
  } finally {
    formLoading.value = false
  }
}

const deleteKecamatan = async (kecamatanId) => {
  const kecamatan = kecamatanStore.kecamatans.find(k => k.id === kecamatanId)

  if (kecamatan.umkms_count > 0 || kecamatan.customers_count > 0) {
    notificationStore.showNotification({
      type: 'error',
      message: 'Tidak dapat menghapus kecamatan yang masih memiliki UMKM atau customer'
    })
    return
  }

  if (!confirm('Apakah Anda yakin ingin menghapus kecamatan ini?')) return

  try {
    await kecamatanStore.deleteKecamatan(kecamatanId)
    await fetchKecamatans()
    await kecamatanStore.fetchStatistics()
    notificationStore.showNotification({
      type: 'success',
      message: `Kecamatan berhasil dihapus`
    })
  } catch (error) {
    console.error('Error deleting kecamatan:', error)

    // Cek apakah error memiliki pesan khusus
    const errorMessage = error.response?.data?.message || 'Gagal menghapus kecamatan'
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

const getInitials = (name) => {
  if (!name) return 'K'
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Lifecycle
onMounted(() => {
  if (!kecamatanStore.initialized) {
    kecamatanStore.fetchStatistics()
    fetchKecamatans()
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
