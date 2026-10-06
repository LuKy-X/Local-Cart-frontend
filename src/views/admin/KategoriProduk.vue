<template>
  <div class="p-1">
    <AlertNotification ref="alertRef" :auto-remove="3000"/>

    <!-- Header dan Stats Cards -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manajemen Kategori Produk</h2>
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Tambah Kategori
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Categories Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Kategori</p>
            <p class="text-2xl font-bold text-gray-800">{{ categoryStore.statistics.total_categories }}</p>
          </div>
        </div>
      </div>

      <!-- Categories with Products Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Kategori Berisi Produk</p>
            <p class="text-2xl font-bold text-gray-800">{{ categoryStore.statistics.categories_with_products }}</p>
          </div>
        </div>
      </div>

      <!-- Total Products Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Produk</p>
            <p class="text-2xl font-bold text-gray-800">{{ categoryStore.statistics.total_products }}</p>
          </div>
        </div>
      </div>

      <!-- Average Products Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Rata-rata Produk/Kategori</p>
            <p class="text-2xl font-bold text-gray-800">{{ categoryStore.statistics.average_products_per_category }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Most Products Category Card -->
    <div v-if="categoryStore.statistics.most_products_category" class="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-indigo-500">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Kategori dengan Produk Terbanyak</p>
            <p class="text-xl font-bold text-gray-800">
              {{ categoryStore.statistics.most_products_category.name }}
              <span class="text-lg text-gray-600 ml-2">
                ({{ categoryStore.statistics.most_products_category.count }} produk)
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Kategori</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nama kategori atau deskripsi..."
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
              @change="fetchCategories"
            >
              <option value="created_at">Tanggal Dibuat</option>
              <option value="nama_kategori">Nama Kategori</option>
              <option value="products_count">Jumlah Produk</option>
              <option value="updated_at">Terakhir Diupdate</option>
            </select>
            <select
              v-model="filters.sort_direction"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="fetchCategories"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Produk</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="category in categoryStore.categories" :key="category.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span class="text-white font-semibold text-sm">
                        {{ getInitials(category.nama_kategori) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ category.nama_kategori }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 line-clamp-2 max-w-xs">{{ category.deskripsi || 'Tidak ada deskripsi' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                    category.products_count > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ category.products_count }} produk
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(category.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="openDetailModal(category)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Lihat Detail"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button
                    @click="openEditModal(category)"
                    class="text-green-600 hover:text-green-900"
                    title="Edit Kategori"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    @click="deleteCategory(category.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Hapus Kategori"
                    :disabled="category.products_count > 0"
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
      <div v-if="categoryStore.showLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Memuat data...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!categoryStore.hasCategories" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada Kategori</h3>
        <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat kategori pertama Anda.</p>
        <div class="mt-6">
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Tambah Kategori
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="categoryStore.hasCategories" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Menampilkan
              <span class="font-medium">{{ (categoryStore.currentPage - 1) * 10 + 1 }}</span>
              sampai
              <span class="font-medium">{{ Math.min(categoryStore.currentPage * 10, categoryStore.totalItems) }}</span>
              dari
              <span class="font-medium">{{ categoryStore.totalItems }}</span>
              hasil
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="categoryStore.currentPage === 1 || categoryStore.loading"
              @click="changePage(categoryStore.currentPage - 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                categoryStore.currentPage === 1 || categoryStore.loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              ]"
            >
              Sebelumnya
            </button>
            <button
              :disabled="categoryStore.currentPage === categoryStore.totalPages || categoryStore.loading"
              @click="changePage(categoryStore.currentPage + 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                categoryStore.currentPage === categoryStore.totalPages || categoryStore.loading
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

    <!-- Modal Detail Kategori -->
    <div v-if="showDetailModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDetailModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">Detail Kategori</h3>
              <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <hr class="mb-3">

            <div v-if="selectedCategory" class="space-y-6">
              <!-- Header Info -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span class="text-white font-semibold text-lg">
                      {{ getInitials(selectedCategory.nama_kategori) }}
                    </span>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="text-xl font-semibold text-gray-900">{{ selectedCategory.nama_kategori }}</h4>
                  <p class="text-gray-600">{{ selectedCategory.products_count }} produk</p>
                </div>
              </div>

              <!-- Main Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Deskripsi Kategori</h5>
                    <p class="text-gray-900 whitespace-pre-line">{{ selectedCategory.deskripsi || 'Tidak ada deskripsi' }}</p>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Informasi</h5>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600">Tanggal Dibuat:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedCategory.created_at) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600">Terakhir Diupdate:</span>
                        <span class="text-sm font-medium text-gray-900">{{ formatDate(selectedCategory.updated_at) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Statistik Produk</h5>
                    <div class="bg-gray-50 rounded-lg p-4 text-center">
                      <p class="text-3xl font-bold text-indigo-600">{{ selectedCategory.products_count }}</p>
                      <p class="text-sm text-gray-600">Total Produk dalam Kategori</p>
                    </div>
                  </div>

                  <div v-if="selectedCategory.products && selectedCategory.products.length > 0">
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Produk Terbaru</h5>
                    <div class="space-y-2 max-h-60 overflow-y-auto">
                      <div
                        v-for="product in selectedCategory.products"
                        :key="product.id"
                        class="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <img
                          v-if="product.foto"
                          class="h-10 w-10 rounded object-cover"
                          :src="product.foto"
                          :alt="product.nama_produk"
                        >
                        <div
                          v-else
                          class="h-10 w-10 rounded bg-gray-300 flex items-center justify-center"
                        >
                          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">{{ product.nama_produk }}</p>
                          <div class="flex items-center space-x-2 text-xs text-gray-500">
                            <span>Rp {{ formatPrice(product.harga) }}</span>
                            <span>•</span>
                            <span>{{ product.umkm.nama_umkm }}</span>
                          </div>
                        </div>
                        <div class="flex items-center space-x-1">
                          <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          <span class="text-xs font-medium">{{ product.average_rating ? product.average_rating.toFixed(1) : '0.0' }}</span>
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
                  @click="openEditModal(selectedCategory)"
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  Edit Kategori
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit Kategori -->
    <div v-if="showFormModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeFormModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">
                {{ isEditing ? 'Edit Kategori' : 'Tambah Kategori' }}
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nama Kategori</label>
                  <input
                    v-model="formData.nama_kategori"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama kategori"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    v-model="formData.deskripsi"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan deskripsi kategori (opsional)"
                  ></textarea>
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
import { useCategoryStore } from '@/stores/category'
import { useNotificationStore } from '@/stores/notification'

// Stores
const categoryStore = useCategoryStore()
const notificationStore = useNotificationStore()
// Alert Reference
const alertRef = ref(null)

// State
const showDetailModal = ref(false)
const showFormModal = ref(false)
const selectedCategory = ref(null)
const isEditing = ref(false)
const formLoading = ref(false)
const searchTimeout = ref(null)

// Form Data
const formData = reactive({
  nama_kategori: '',
  deskripsi: ''
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
    fetchCategories()
  }, 50)
}

const fetchCategories = async () => {
  try {
    await categoryStore.fetchCategories(filters)
  } catch (error) {
    console.error('Error fetching categories:', error)
    notificationStore.showNotification({
      type: 'error',
      message: `Gagal memuat data kategori`
    })
  }
}

const changePage = (page) => {
  fetchCategories(page)
}

const openDetailModal = async (category) => {
  try {
    const response = await categoryStore.fetchCategoryDetail(category.id)

    // Universal data extraction
    const categoryData = (response && response.data) ? response.data : response

    selectedCategory.value = categoryData
    showDetailModal.value = true

  } catch (error) {
    console.error('Error fetching category detail:', error)
    notificationStore.showNotification({
      type: 'error',
      message: `Gagal memuat detail kategori`
    })
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedCategory.value = null
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showFormModal.value = true
}

const openEditModal = (category) => {
  isEditing.value = true
  selectedCategory.value = category
  formData.nama_kategori = category.nama_kategori
  formData.deskripsi = category.deskripsi || ''
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.nama_kategori = ''
  formData.deskripsi = ''
  isEditing.value = false
}

const submitForm = async () => {
  formLoading.value = true
  try {
    if (isEditing.value) {
      await categoryStore.updateCategory(selectedCategory.value.id, formData)
      Object.assign(selectedCategory.value, {
        nama_kategori: formData.nama_kategori,
        deskripsi: formData.deskripsi,
        updated_at: new Date().toISOString()
      })
      notificationStore.showNotification({
        type: 'success',
        message: `Kategori berhasil diperbarui`
      })
    } else {
      await categoryStore.createCategory(formData)
      notificationStore.showNotification({
        type: 'success',
        message: `Kategori berhasil ditambahkan`
      })
    }

    await fetchCategories()
    await categoryStore.fetchStatistics()
    closeFormModal()
  } catch (error) {
    console.error('Error saving category:', error)

    // Cek apakah error memiliki pesan dari response
    const errorMessage = error.response?.data?.message || 'Gagal menyimpan kategori'
    notificationStore.showNotification({
      type: 'error',
      message: errorMessage
    })
  } finally {
    formLoading.value = false
  }
}

const deleteCategory = async (categoryId) => {
  const category = categoryStore.categories.find(c => c.id === categoryId)

  if (category.products_count > 0) {
    notificationStore.showNotification({
      type: 'error',
      message: `Tidak dapat menghapus kategori yang masih memiliki produk`
    })
    return
  }

  if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return

  try {
    await categoryStore.deleteCategory(categoryId)
    await fetchCategories()
    await categoryStore.fetchStatistics()
    notificationStore.showNotification({
      type: 'success',
      message: `Kategori berhasil dihapus`
    })
  } catch (error) {
    console.error('Error deleting category:', error)

    // Cek apakah error memiliki pesan khusus
    const errorMessage = error.response?.data?.message || 'Gagal menghapus kategori'
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
  if (!name) return 'K'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Lifecycle
onMounted(() => {
  if (!categoryStore.initialized) {
    categoryStore.fetchStatistics()
    fetchCategories()
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
