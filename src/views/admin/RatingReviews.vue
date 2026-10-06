<template>
  <div class="p-1">
    <!-- Alert Notification -->
    <AlertNotification ref="alertRef" :auto-remove="3000" />

    <!-- Header dan Stats Cards -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manajemen Rating & Reviews</h2>
    </div>

    <!-- Statistics Cards (Maksimal 4) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Ratings Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Ratings</p>
            <p class="text-2xl font-bold text-gray-800">{{ ratingStore.statistics.total_ratings }}</p>
          </div>
        </div>
      </div>

      <!-- Average Rating Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Average Rating</p>
            <p class="text-2xl font-bold text-gray-800">{{ ratingStore.statistics.average_rating }}/5</p>
          </div>
        </div>
      </div>

      <!-- Approved Ratings Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Approved Ratings</p>
            <p class="text-2xl font-bold text-gray-800">{{ ratingStore.statistics.approved_ratings }}</p>
          </div>
        </div>
      </div>

      <!-- Pending Ratings Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Pending Ratings</p>
            <p class="text-2xl font-bold text-gray-800">{{ ratingStore.statistics.pending_ratings }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Stats Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Top Rated Product -->
      <div v-if="ratingStore.statistics.top_rated_product" class="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Produk dengan Rating Tertinggi</p>
            <p class="text-xl font-bold text-gray-800">
              {{ ratingStore.statistics.top_rated_product.name }}
              <span class="text-lg text-gray-600 ml-2">
                ({{ ratingStore.statistics.top_rated_product.average_rating }}/5)
              </span>
            </p>
            <p class="text-sm text-gray-600 mt-1">
              UMKM: {{ ratingStore.statistics.top_rated_product.umkm }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Rating Distribution -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Distribusi Rating</h3>
      <div class="space-y-3">
        <div v-for="n in 5" :key="n" class="flex items-center">
          <div class="w-16 text-sm font-medium text-gray-700">{{ n }} bintang</div>
          <div class="flex-1 ml-4">
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-yellow-400 h-2.5 rounded-full"
                :style="{ width: getRatingPercentage(n) + '%' }"
              ></div>
            </div>
          </div>
          <div class="w-16 text-right text-sm text-gray-500">
            {{ ratingStore.statistics.rating_distribution[n] || 0 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search Input -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Rating & Reviews</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Customer, produk, review, atau kode order..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleSearch"
          >
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.is_approved"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchRatings"
          >
            <option value="null">Semua Status</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
        </div>

        <!-- Rating Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <select
            v-model="filters.rating"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchRatings"
          >
            <option value="">Semua Rating</option>
            <option value="5">5 Bintang</option>
            <option value="4">4 Bintang</option>
            <option value="3">3 Bintang</option>
            <option value="2">2 Bintang</option>
            <option value="1">1 Bintang</option>
          </select>
        </div>
      </div>

      <!-- Date Range Filter -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
          <input
            v-model="filters.start_date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchRatings"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
          <input
            v-model="filters.end_date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchRatings"
          >
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Ratings Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="rating in ratingStore.ratings" :key="rating.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-white font-semibold text-sm">
                        {{ getInitials(rating.customer?.nama_customer) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ rating.customer?.nama_customer }}</div>
                    <div class="text-sm text-gray-500">Order: {{ rating.order?.kode_order }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ rating.product?.nama_produk }}</div>
                <div class="text-sm text-gray-500">{{ rating.product?.umkm?.nama_umkm }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex">
                    <svg v-for="n in 5" :key="n"
                      :class="[
                        'h-5 w-5',
                        n <= rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      ]"
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-2 text-sm font-medium text-gray-900">{{ rating.rating }}/5</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 line-clamp-2 max-w-xs">{{ rating.review || 'Tidak ada review' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                  rating.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ rating.is_approved ? 'Approved' : 'Pending' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(rating.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="openDetailModal(rating)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Lihat Detail"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button
                    v-if="!rating.is_approved"
                    @click="approveRating(rating.id)"
                    class="text-green-600 hover:text-green-900"
                    title="Approve Rating"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <button
                    v-if="rating.is_approved"
                    @click="unapproveRating(rating.id)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Unapprove Rating"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  <button
                    @click="deleteRating(rating.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Hapus Rating"
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
      <div v-if="ratingStore.showLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Memuat data...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!ratingStore.hasRatings" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada Rating</h3>
        <p class="mt-1 text-sm text-gray-500">Belum ada rating yang diberikan.</p>
      </div>

      <!-- Pagination -->
      <div v-if="ratingStore.hasRatings" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Menampilkan
              <span class="font-medium">{{ (ratingStore.currentPage - 1) * 10 + 1 }}</span>
              sampai
              <span class="font-medium">{{ Math.min(ratingStore.currentPage * 10, ratingStore.totalItems) }}</span>
              dari
              <span class="font-medium">{{ ratingStore.totalItems }}</span>
              hasil
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="ratingStore.currentPage === 1 || ratingStore.loading"
              @click="changePage(ratingStore.currentPage - 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                ratingStore.currentPage === 1 || ratingStore.loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              ]"
            >
              Sebelumnya
            </button>
            <button
              :disabled="ratingStore.currentPage === ratingStore.totalPages || ratingStore.loading"
              @click="changePage(ratingStore.currentPage + 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                ratingStore.currentPage === ratingStore.totalPages || ratingStore.loading
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

    <!-- Modal Detail Rating -->
    <div v-if="showDetailModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDetailModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">Detail Rating & Review</h3>
              <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <hr class="mb-3">

            <div v-if="selectedRating" class="space-y-6">
              <!-- Header Info -->
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-4">
                  <div class="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <span class="text-white font-semibold">
                      {{ getInitials(selectedRating.customer?.nama) }}
                    </span>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900">{{ selectedRating.customer?.nama }}</h4>
                    <p class="text-sm text-gray-500">Order: {{ selectedRating.order?.kode_order }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="flex items-center">
                    <div class="flex">
                      <svg v-for="n in 5" :key="n"
                        :class="[
                          'h-5 w-5',
                          n <= selectedRating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        ]"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span class="ml-2 text-lg font-bold text-gray-900">{{ selectedRating.rating }}/5</span>
                  </div>
                  <span :class="[
                    'inline-flex px-3 py-1 mt-1 text-sm font-semibold rounded-full',
                    selectedRating.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ selectedRating.is_approved ? 'Approved' : 'Pending' }}
                  </span>
                </div>
              </div>

              <!-- Review Content -->
              <div>
                <h5 class="text-sm font-medium text-gray-500 mb-2">Review</h5>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-gray-900 whitespace-pre-line">{{ selectedRating.review || 'Tidak ada review' }}</p>
                </div>
              </div>

              <!-- Product Info -->
              <div>
                <h5 class="text-sm font-medium text-gray-500 mb-2">Informasi Produk</h5>
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="h-16 w-16 rounded bg-gray-300 flex items-center justify-center">
                        <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1">
                      <h6 class="text-sm font-semibold text-gray-900">{{ selectedRating.product?.nama_produk }}</h6>
                      <p class="text-sm text-gray-500">UMKM: {{ selectedRating.product?.umkm?.nama_umkm }}</p>
                      <p class="text-sm text-gray-500">Kategori: {{ selectedRating.product?.category?.nama_kategori }}</p>
                      <p class="text-sm font-medium text-gray-900">Rp {{ formatPrice(selectedRating.product?.harga) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Info -->
              <div>
                <h5 class="text-sm font-medium text-gray-500 mb-2">Informasi Order</h5>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-600">Kode Order</p>
                      <p class="text-sm font-medium text-gray-900">{{ selectedRating.order?.kode_order }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Status Order</p>
                      <span :class="getStatusBadgeClasses(selectedRating.order?.status)" class="text-sm font-medium px-2 py-1 rounded-full">
                        {{ getStatusText(selectedRating.order?.status) }}
                      </span>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Tanggal Order</p>
                      <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedRating.order?.created_at) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Total Order</p>
                      <p class="text-sm font-medium text-gray-900">Rp {{ formatPrice(selectedRating.order?.grand_total) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Timestamps -->
              <div>
                <h5 class="text-sm font-medium text-gray-500 mb-2">Informasi Waktu</h5>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Tanggal Dibuat</p>
                    <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedRating.created_at) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Terakhir Diupdate</p>
                    <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedRating.updated_at) }}</p>
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
                  v-if="!selectedRating.is_approved"
                  @click="approveRating(selectedRating.id)"
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  Approve Rating
                </button>
                <button
                  v-if="selectedRating.is_approved"
                  @click="unapproveRating(selectedRating.id)"
                  class="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
                >
                  Unapprove Rating
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
import { useRatingStore } from '@/stores/rating'
import { useNotificationStore } from '@/stores/notification'

// Stores
const ratingStore = useRatingStore()
const notificationStore = useNotificationStore()


// State
const showDetailModal = ref(false)
const selectedRating = ref(null)
const searchTimeout = ref(null)

// Filters
const filters = reactive({
  search: '',
  is_approved: '',
  rating: '',
  start_date: '',
  end_date: '',
  sort_field: 'created_at',
  sort_direction: 'desc'
})

// Methods
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    fetchRatings()
  }, 50)
}

const fetchRatings = async () => {
  try {
    await ratingStore.fetchRatings(filters)
  } catch (error) {
    console.error('Error fetching ratings:', error)
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat data ratings'
    })
  }
}

const resetFilters = () => {
  filters.search = ''
  filters.is_approved = null
  filters.rating = ''
  filters.start_date = ''
  filters.end_date = ''
  filters.sort_field = 'created_at'
  filters.sort_direction = 'desc'
  fetchRatings()
}

const changePage = (page) => {
  fetchRatings(page)
}

const openDetailModal = async (rating) => {
  try {
    const response = await ratingStore.fetchRatingDetail(rating.id)
    const ratingData = (response && response.data) ? response.data : response
    selectedRating.value = ratingData
    showDetailModal.value = true
  } catch (error) {
    console.error('Error fetching rating detail:', error)
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat detail rating'
    })
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedRating.value = null
}

const approveRating = async (ratingId) => {
  if (!confirm('Apakah Anda yakin ingin approve rating ini?')) return

  try {
    await ratingStore.updateRatingApproval(ratingId, true)

    // Update local state
    const ratingIndex = ratingStore.ratings.findIndex(r => r.id === ratingId)
    if (ratingIndex !== -1) {
      ratingStore.ratings[ratingIndex].is_approved = true
    }

    // Update selected rating if in modal
    if (selectedRating.value && selectedRating.value.id === ratingId) {
      selectedRating.value.is_approved = true
    }

    await ratingStore.fetchStatistics()
    notificationStore.showNotification({
      type: 'success',
      message: 'Rating berhasil diapprove'
    })
  } catch (error) {
    console.error('Error approving rating:', error)
    const errorMessage = error.response?.data?.message || 'Gagal approve rating'
    notificationStore.showNotification({
      type: 'error',
      message: errorMessage
    })
  }
}

const unapproveRating = async (ratingId) => {
  if (!confirm('Apakah Anda yakin ingin unapprove rating ini?')) return

  try {
    await ratingStore.updateRatingApproval(ratingId, false)

    // Update local state
    const ratingIndex = ratingStore.ratings.findIndex(r => r.id === ratingId)
    if (ratingIndex !== -1) {
      ratingStore.ratings[ratingIndex].is_approved = false
    }

    // Update selected rating if in modal
    if (selectedRating.value && selectedRating.value.id === ratingId) {
      selectedRating.value.is_approved = false
    }

    await ratingStore.fetchStatistics()
    notificationStore.showNotification({
      type: 'success',
      message: 'Rating berhasil diunapprove'
    })
  } catch (error) {
    console.error('Error unapproving rating:', error)
    const errorMessage = error.response?.data?.message || 'Gagal unapprove rating'
    notificationStore.showNotification({
      type: 'error',
      message: errorMessage
    })
  }
}

const deleteRating = async (ratingId) => {
  if (!confirm('Apakah Anda yakin ingin menghapus rating ini?')) return

  try {
    await ratingStore.deleteRating(ratingId)

    // Remove from local state
    const ratingIndex = ratingStore.ratings.findIndex(r => r.id === ratingId)
    if (ratingIndex !== -1) {
      ratingStore.ratings.splice(ratingIndex, 1)
    }

    await ratingStore.fetchStatistics()
    notificationStore.showNotification({
      type: 'success',
      message: 'Rating berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting rating:', error)
    const errorMessage = error.response?.data?.message || 'Gagal menghapus rating'
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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('id-ID').format(price)
}

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getRatingPercentage = (rating) => {
  const total = ratingStore.statistics.total_ratings
  if (total === 0) return 0
  const count = ratingStore.statistics.rating_distribution[rating] || 0
  return (count / total) * 100
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
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  }
  return texts[status] || status
}

// Lifecycle
onMounted(() => {
  if (!ratingStore.initialized) {
    ratingStore.fetchStatistics()
    fetchRatings()
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
