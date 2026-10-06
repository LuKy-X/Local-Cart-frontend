<template>
  <div class="p-1">
    <AlertNotification ref="alertRef" :auto-remove="3000"/>

    <!-- Header dan Stats Cards -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Manajemen Produk</h2>
        <p class="text-gray-600">Kelola produk-produk dari UMKM Anda</p>
      </div>
      <button
        @click="openCreateModal"
        class="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Tambah Produk Baru
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
            <p class="text-2xl font-bold text-gray-800">{{ productStore.statistics.total_products }}</p>
          </div>
        </div>
      </div>

      <!-- Active Products Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Produk Aktif</p>
            <p class="text-2xl font-bold text-gray-800">{{ productStore.activeProducts }}</p>
          </div>
        </div>
      </div>

      <!-- Inactive Products Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Produk Nonaktif</p>
            <p class="text-2xl font-bold text-gray-800">{{ productStore.inactiveProducts }}</p>
          </div>
        </div>
      </div>

      <!-- Low Stock Products Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Stok Menipis</p>
            <p class="text-2xl font-bold text-gray-800">{{ productStore.lowStockProducts }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Search Input - Lebih panjang -->
        <div class="md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Produk</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nama produk..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleSearch"
          >
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <select
            v-model="filters.category_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchProducts"
          >
            <option value="">Semua Kategori</option>
            <option v-for="category in productStore.categories" :key="category.id" :value="category.id">
              {{ category.nama_kategori }}
            </option>
          </select>
        </div>



      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <!-- Status Filter - Setengah container -->
        <div class="lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.is_active"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchProducts"
          >
            <option value="">Semua Status</option>
            <option value="1">Aktif</option>
            <option value="0">Nonaktif</option>
          </select>
        </div>

        <!-- Sort Options dan Reset Button dalam satu div -->
        <div class="lg:col-span-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Sort Options -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
              <div class="flex gap-2">
                <select
                  v-model="filters.sort_field"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="fetchProducts"
                >
                  <option value="created_at">Tanggal Dibuat</option>
                  <option value="nama_produk">Nama Produk</option>
                  <option value="harga">Harga</option>
                  <option value="stok">Stok</option>
                  <option value="updated_at">Terakhir Diupdate</option>
                </select>
                <select
                  v-model="filters.sort_direction"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="fetchProducts"
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>

            <!-- Reset Filter Button -->
            <div class="flex items-end">
              <button
                @click="resetFilters"
                class="w-full px-4 py-2 border bg-blue-600 text-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori & Harga</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating & View</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in productStore.products" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <img
                      v-if="product.foto"
                      class="h-12 w-12 rounded-lg object-cover"
                      :src="product.foto"
                      :alt="product.nama_produk"
                    >
                    <div
                      v-else
                      class="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center"
                    >
                      <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.nama_produk }}</div>
                    <div
                      class="text-sm text-gray-500 line-clamp-2 max-w-xs"
                      :title="product.deskripsi"
                    >
                      {{ truncateDescription(product.deskripsi, 50) }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ product.category?.nama_kategori || 'Tidak ada kategori' }}</div>
                <div class="text-lg font-bold text-blue-600">Rp {{ formatPrice(product.harga) }}</div>
                <div class="text-xs text-gray-500">Dibuat: {{ formatDateShort(product.created_at) }}</div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    product.stok > 10
                      ? 'bg-green-100 text-green-800'
                      : product.stok > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ product.stok }} unit
                </span>
                <div class="text-xs text-gray-500 mt-1">
                  <span v-if="product.stok === 0" class="text-red-600">Stok habis!</span>
                  <span v-else-if="product.stok < 10" class="text-yellow-600">Stok menipis</span>
                  <span v-else class="text-green-600">Stok cukup</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-sm font-medium text-gray-900">
                      {{ product.average_rating ? product.average_rating.toFixed(1) : '0.0' }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-500">
                    ({{ product.total_ratings || 0 }})
                  </div>
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  {{ product.total_views || 0 }} views
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    product.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ product.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="openEditModal(product)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Edit Produk"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    @click="openDetailModal(product)"
                    class="text-green-600 hover:text-green-900"
                    title="Lihat Detail"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button
                    @click="toggleProductStatus(product.id)"
                    :class="[
                      product.is_active
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-green-600 hover:text-green-900'
                    ]"
                    :title="product.is_active ? 'Nonaktifkan Produk' : 'Aktifkan Produk'"
                  >
                    <svg v-if="product.is_active" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  <button
                    @click="confirmDelete(product.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Hapus Produk"
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
      <div v-if="productStore.showLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Memuat data produk...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!productStore.hasProducts" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada Produk</h3>
        <p class="mt-1 text-sm text-gray-500">Tidak ada produk yang sesuai dengan filter yang dipilih.</p>
      </div>

      <!-- Pagination -->
      <div v-if="productStore.hasProducts" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Menampilkan
              <span class="font-medium">{{ (productStore.currentPage - 1) * 10 + 1 }}</span>
              sampai
              <span class="font-medium">{{ Math.min(productStore.currentPage * 10, productStore.totalItems) }}</span>
              dari
              <span class="font-medium">{{ productStore.totalItems }}</span>
              hasil
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="productStore.currentPage === 1 || productStore.loading"
              @click="changePage(productStore.currentPage - 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                productStore.currentPage === 1 || productStore.loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              ]"
            >
              Sebelumnya
            </button>
            <button
              :disabled="productStore.currentPage === productStore.totalPages || productStore.loading"
              @click="changePage(productStore.currentPage + 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                productStore.currentPage === productStore.totalPages || productStore.loading
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

    <!-- Modal Detail Produk -->
    <div v-if="showDetailModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDetailModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">Detail Produk</h3>
              <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <hr class="mb-3">

            <div v-if="selectedProduct" class="space-y-6">

              <!-- Main Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                  <!-- Product Info -->
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                      <img
                        v-if="selectedProduct.foto"
                        class="h-20 w-20 rounded-lg object-cover border"
                        :src="selectedProduct.foto"
                        :alt="selectedProduct.nama_produk"
                      >
                      <div
                        v-else
                        class="h-20 w-20 rounded-lg bg-gray-300 flex items-center justify-center border"
                      >
                        <svg class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-xl font-semibold text-gray-900">{{ selectedProduct.nama_produk }}</h4>
                      <p class="text-gray-600">{{ selectedProduct.category?.nama_kategori || 'Tidak ada kategori' }}</p>
                      <div class="flex space-x-2 mt-2">
                        <span
                          :class="[
                            'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                            selectedProduct.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          ]"
                        >
                          {{ selectedProduct.is_active ? 'Aktif' : 'Nonaktif' }}
                        </span>
                        <span
                          :class="[
                            'inline-flex px-3 py-1 text-sm font-semibold rounded-full',
                            selectedProduct.stok > 10
                              ? 'bg-green-100 text-green-800'
                              : selectedProduct.stok > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          ]"
                        >
                          Stok: {{ selectedProduct.stok }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Deskripsi Produk</h5>
                    <div class="text-gray-900 bg-gray-200 p-3 rounded-lg">
                      <p v-if="showFullDescription || !selectedProduct.deskripsi || selectedProduct.deskripsi.length <= 200">
                        {{ selectedProduct.deskripsi || 'Tidak ada deskripsi' }}
                      </p>
                      <p v-else>
                        {{ truncateDescription(selectedProduct.deskripsi, 200) }}
                      </p>
                      <button
                        v-if="selectedProduct.deskripsi && selectedProduct.deskripsi.length > 200"
                        @click="showFullDescription = !showFullDescription"
                        class="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {{ showFullDescription ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya' }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Tanggal</h5>
                    <div class="space-y-1 bg-gray-200 p-3 rounded-lg">
                      <p class="text-gray-900">Dibuat: {{ formatDate(selectedProduct.created_at) }}</p>
                      <p class="text-gray-900">Diupdate: {{ formatDate(selectedProduct.updated_at) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Detail Harga & Stok</h5>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gray-200 rounded-lg p-4 text-center">
                        <p class="text-2xl font-bold text-blue-600">Rp {{ formatPrice(selectedProduct.harga) }}</p>
                        <p class="text-sm text-gray-600">Harga</p>
                      </div>
                      <div class="bg-gray-200 rounded-lg p-4 text-center">
                        <p class="text-2xl font-bold text-green-600">{{ selectedProduct.stok }}</p>
                        <p class="text-sm text-gray-600">Stok Tersedia</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Statistik</h5>
                    <div class="grid grid-cols-3 gap-2">
                      <div class="bg-gray-200 rounded-lg p-3 text-center">
                        <p class="text-xl font-bold text-yellow-600">{{ selectedProduct.average_rating ? selectedProduct.average_rating.toFixed(1) : '0.0' }}</p>
                        <p class="text-xs text-gray-600">Rating</p>
                      </div>
                      <div class="bg-gray-200 rounded-lg p-3 text-center">
                        <p class="text-xl font-bold text-blue-600">{{ selectedProduct.total_views || 0 }}</p>
                        <p class="text-xs text-gray-600">View</p>
                      </div>
                      <div class="bg-gray-200 rounded-lg p-3 text-center">
                        <p class="text-xl font-bold text-purple-600">{{ selectedProduct.total_ratings || 0 }}</p>
                        <p class="text-xs text-gray-600">Ulasan</p>
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
                  @click="openEditModal(selectedProduct)"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Edit Produk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit Produk -->
    <div v-if="showEditModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeEditModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-gray-800">
                {{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}
              </h3>
              <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="submitProductForm">
              <div class="space-y-6">
                <!-- Product Image Upload -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Foto Produk</label>
                  <div class="mt-1 flex items-center space-x-4">
                    <div v-if="productForm.foto_preview || (isEditing && selectedProduct?.foto)" class="flex-shrink-0">
                      <img
                        :src="productForm.foto_preview || selectedProduct?.foto"
                        alt="Preview"
                        class="h-32 w-32 rounded-lg object-cover border"
                      />
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center">
                        <input
                          type="file"
                          ref="fileInput"
                          @change="handleFileUpload"
                          accept="image/*"
                          class="hidden"
                        />
                        <button
                          type="button"
                          @click="$refs.fileInput.click()"
                          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Pilih Gambar
                        </button>
                        <span class="ml-3 text-sm text-gray-500">
                          PNG, JPG, JPEG maks. 2MB
                        </span>
                      </div>
                      <div v-if="productForm.foto_preview" class="mt-2">
                        <button
                          type="button"
                          @click="removeImage"
                          class="text-sm text-red-600 hover:text-red-800"
                        >
                          Hapus gambar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Product Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nama Produk *</label>
                  <input
                    v-model="productForm.nama_produk"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Kue Lapis Legit"
                  />
                  <p v-if="formErrors.nama_produk" class="mt-1 text-sm text-red-600">
                    {{ formErrors.nama_produk }}
                  </p>
                </div>

                <!-- Category Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                  <select
                    v-model="productForm.category_id"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Kategori</option>
                    <option v-for="category in productStore.categories" :key="category.id" :value="category.id">
                      {{ category.nama_kategori }}
                    </option>
                  </select>
                  <p v-if="formErrors.category_id" class="mt-1 text-sm text-red-600">
                    {{ formErrors.category_id }}
                  </p>
                </div>

                <!-- Price and Stock -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Harga (Rp) *</label>
                    <input
                      v-model="productForm.harga"
                      type="number"
                      required
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 75000"
                    />
                    <p v-if="formErrors.harga" class="mt-1 text-sm text-red-600">
                      {{ formErrors.harga }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Stok *</label>
                    <input
                      v-model="productForm.stok"
                      type="number"
                      required
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 15"
                    />
                    <p v-if="formErrors.stok" class="mt-1 text-sm text-red-600">
                      {{ formErrors.stok }}
                    </p>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi Produk</label>
                  <textarea
                    v-model="productForm.deskripsi"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsikan produk Anda secara detail..."
                  ></textarea>
                  <p v-if="formErrors.deskripsi" class="mt-1 text-sm text-red-600">
                    {{ formErrors.deskripsi }}
                  </p>
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div class="flex items-center">
                    <input
                      v-model="productForm.is_active"
                      type="checkbox"
                      true-value="1"
                      false-value="0"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label class="ml-2 block text-sm text-gray-900">
                      Aktifkan produk (produk akan ditampilkan kepada customer)
                    </label>
                  </div>
                </div>

                <!-- Error Messages -->
                <div v-if="submitError" class="bg-red-50 border border-red-200 rounded-md p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">
                        {{ submitError }}
                      </h3>
                    </div>
                  </div>
                </div>

                <!-- Loading State -->
                <div v-if="submitLoading" class="flex items-center justify-center py-4">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span class="ml-2 text-sm text-gray-600">
                    {{ isEditing ? 'Menyimpan perubahan...' : 'Menyimpan produk...' }}
                  </span>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    @click="closeEditModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    :disabled="submitLoading"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    :disabled="submitLoading"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ isEditing ? 'Simpan Perubahan' : 'Tambah Produk' }}
                  </button>
                </div>
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
import { useUmkmProductStore } from '@/stores/umkm-product'
import { useNotificationStore } from '@/stores/notification'

// Stores
const productStore = useUmkmProductStore()
const notificationStore = useNotificationStore()

// State
const alertRef = ref(null)
const showDetailModal = ref(false)
const showEditModal = ref(false)
const selectedProduct = ref(null)
const showFullDescription = ref(false)
const searchTimeout = ref(null)
const isEditing = ref(false)
const submitLoading = ref(false)
const submitError = ref('')

// Filters
const filters = reactive({
  search: '',
  category_id: '',
  is_active: '',
  sort_field: 'created_at',
  sort_direction: 'desc'
})

// Form data
const productForm = reactive({
  id: null,
  nama_produk: '',
  deskripsi: '',
  harga: '',
  stok: '',
  category_id: '',
  foto: null,
  foto_preview: null,
  is_active: '1'
})

const formErrors = reactive({
  nama_produk: '',
  deskripsi: '',
  harga: '',
  stok: '',
  category_id: ''
})

// Methods
const truncateDescription = (text, maxLength = 100) => {
  if (!text) return 'Tidak ada deskripsi'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    fetchProducts()
  }, 500)
}

const fetchProducts = async () => {
  try {
    await productStore.fetchMyProducts(filters)
  } catch (error) {
    console.error('Error fetching products:', error)
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat data produk'
    })
  }
}

const resetFilters = () => {
  filters.search = '';
  filters.category_id = '';
  filters.is_active = '';
  filters.sort_field = 'created_at';
  filters.sort_direction = 'desc';

  fetchProducts();
}

const changePage = (page) => {
  fetchProducts(page)
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

const formatDateShort = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('id-ID').format(price)
}

const openDetailModal = (product) => {
  selectedProduct.value = product
  showDetailModal.value = true
  showFullDescription.value = false
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedProduct.value = null
  showFullDescription.value = false
}

const openEditModal = (product = null) => {
  isEditing.value = !!product
  selectedProduct.value = product

  if (product) {
    // Edit existing product
    productForm.id = product.id
    productForm.nama_produk = product.nama_produk
    productForm.deskripsi = product.deskripsi || ''
    productForm.harga = product.harga
    productForm.stok = product.stok
    productForm.category_id = product.category?.id || ''
    productForm.foto = product.foto
    productForm.foto_preview = null
    productForm.is_active = product.is_active ? '1' : '0'
  } else {
    // Create new product
    resetProductForm()
  }

  showEditModal.value = true
  submitError.value = ''
  Object.keys(formErrors).forEach(key => formErrors[key] = '')
}

const closeEditModal = () => {
  showEditModal.value = false
  resetProductForm()
}

const resetProductForm = () => {
  productForm.id = null
  productForm.nama_produk = ''
  productForm.deskripsi = ''
  productForm.harga = ''
  productForm.stok = ''
  productForm.category_id = ''
  productForm.foto = null
  productForm.foto_preview = null
  productForm.is_active = '1'
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      notificationStore.showNotification({
        type: 'error',
        message: 'Ukuran file maksimal 2MB'
      })
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      notificationStore.showNotification({
        type: 'error',
        message: 'File harus berupa gambar'
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.foto_preview = e.target.result
    }
    reader.readAsDataURL(file)

    // Store file for upload
    productForm.foto = file
  }
}

const removeImage = () => {
  productForm.foto = null
  productForm.foto_preview = null
  if (selectedProduct.value) {
    selectedProduct.value.foto = null
  }
}

const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(formErrors).forEach(key => formErrors[key] = '')

  if (!productForm.nama_produk.trim()) {
    formErrors.nama_produk = 'Nama produk wajib diisi'
    isValid = false
  }

  if (!productForm.category_id) {
    formErrors.category_id = 'Kategori wajib dipilih'
    isValid = false
  }

  if (!productForm.harga || productForm.harga <= 0) {
    formErrors.harga = 'Harga harus lebih dari 0'
    isValid = false
  }

  if (productForm.stok === '' || productForm.stok < 0) {
    formErrors.stok = 'Stok tidak boleh negatif'
    isValid = false
  }

  return isValid
}

const submitProductForm = async () => {
  if (!validateForm()) return

  submitLoading.value = true
  submitError.value = ''

  try {
    const formData = new FormData()

    // Add form data
    formData.append('nama_produk', productForm.nama_produk)
    formData.append('deskripsi', productForm.deskripsi)
    formData.append('harga', productForm.harga)
    formData.append('stok', productForm.stok)
    formData.append('category_id', productForm.category_id)
    formData.append('is_active', productForm.is_active)

    // Add image if uploaded
    if (productForm.foto && typeof productForm.foto !== 'string') {
      formData.append('foto', productForm.foto)
    }

    if (isEditing.value && productForm.id) {
      // Update product
      const response = await productStore.updateProduct(productForm.id, formData)
      // Perbarui selectedProduct dengan data terbaru
      if (response && response.data) {
        // Jika API mengembalikan data produk yang diperbarui
        const updatedProduct = response.data

        // Pastikan foto diproses dengan benar
        if (updatedProduct.foto) {
          updatedProduct.foto = productStore.processImageUrl(updatedProduct.foto)
        }

        Object.assign(selectedProduct.value, updatedProduct)
      }
      notificationStore.showNotification({
        type: 'success',
        message: `Produk berhasil diperbarui`
      })
    } else {
      // Create product
      await productStore.createProduct(formData)
      notificationStore.showNotification({
        type: 'success',
        message: `Produk berhasil ditambahkan`
      })
    }

    closeEditModal()
    fetchProducts()

  } catch (error) {
    console.error('Error submitting product:', error)

    if (error.response?.status === 422) {
      // Handle validation errors
      const errors = error.response.data.errors
      Object.keys(errors).forEach(key => {
        if (formErrors.hasOwnProperty(key)) {
          formErrors[key] = errors[key][0]
        }
      })
      submitError.value = 'Periksa kembali data yang diisi'
    } else if (error.response?.data?.message) {
      submitError.value = error.response.data.message
    } else {
      submitError.value = 'Terjadi kesalahan saat menyimpan produk'
    }

    notificationStore.showNotification({
      type: 'error',
      message: `Gagal menyimpan produk`
    })
  } finally {
    submitLoading.value = false
  }
}

const toggleProductStatus = async (productId) => {
  const product = productStore.products.find(p => p.id === productId)
  const action = product.is_active ? 'menonaktifkan' : 'mengaktifkan'

  if (!confirm(`Apakah Anda yakin ingin ${action} produk ini?`)) return

  try {
    await productStore.toggleProductStatus(productId)
    if (selectedProduct.value && selectedProduct.value.id === productId) {
      selectedProduct.value.is_active = !selectedProduct.value.is_active
    }
    notificationStore.showNotification({
      type: 'success',
      message: `Berhasil ${action} produk`
    })
  } catch (error) {
    console.error('Error toggling product status:', error)
    notificationStore.showNotification({
      type: 'error',
      message: `Gagal ${action} produk`
    })
  }
}

const confirmDelete = (productId) => {
  const product = productStore.products.find(p => p.id === productId)

  if (!confirm(`Apakah Anda yakin ingin menghapus produk "${product.nama_produk}"?`)) return

  deleteProduct(productId)
}

const deleteProduct = async (productId) => {
  try {
    await productStore.deleteProduct(productId)
    notificationStore.showNotification({
      type: 'success',
      message: `Produk berhasil dihapus`
    })

    // Close modal if viewing deleted product
    if (selectedProduct.value && selectedProduct.value.id === productId) {
      closeDetailModal()
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    notificationStore.showNotification({
      type: 'error',
      message: `Gagal menghapus produk`
    })
  }
}

const openCreateModal = () => {
  openEditModal()
}

// Lifecycle
onMounted(async () => {
  try {
    // Load initial data
    if (!productStore.initialized) {
      productStore.fetchStatistics()
      fetchProducts()
    }
    productStore.fetchCategories()
  } catch (error) {
    console.error('Error initializing product page:', error)
    notificationStore.showNotification({
      type: 'error',
      message: `Gagal memuat data awal`
    })
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
