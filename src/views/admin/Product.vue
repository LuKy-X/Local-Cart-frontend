<template>
  <div class="p-1">
    <AlertNotification ref="alertRef" :auto-remove="3000"/>

    <!-- Header dan Stats Cards -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manajemen Produk</h2>
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
            <p class="text-2xl font-bold text-gray-800">{{ productStore.statistics.active_products }}</p>
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
            <p class="text-2xl font-bold text-gray-800">{{ productStore.statistics.inactive_products }}</p>
          </div>
        </div>
      </div>

      <!-- Total Categories Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Kategori</p>
            <p class="text-2xl font-bold text-gray-800">{{ productStore.statistics.total_categories }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Produk</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nama produk atau UMKM..."
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
            <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
              {{ category.nama_kategori }} ({{ category.products_count || 0 }})
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
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

        <!-- Stock Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status Stok</label>
          <select
            v-model="filters.stock_status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchProducts"
          >
            <option value="">Semua Stok</option>
            <option value="in_stock">Stok Tersedia</option>
            <option value="out_of_stock">Stok Habis</option>
          </select>
        </div>

        <!-- Sort Options -->
        <div class="md:col-span-2 lg:col-span-4">
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
      </div>
    </div>

    <!-- Product Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UMKM</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori & Harga</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating & View</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in productStore.products" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
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
                      {{ truncateDescription(product.deskripsi, 20) }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ product.umkm.nama_umkm }}</div>
                <div class="text-sm text-gray-500">{{ product.umkm.user.name }}</div>
                <div class="text-xs text-gray-400">{{ product.umkm.kecamatan.nama_kecamatan }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.category.nama_kategori }}</div>
                <div class="text-lg font-bold text-blue-600">Rp {{ formatPrice(product.harga) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    product.stok > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ product.stok }} unit
                </span>
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
              <td class="px-6 py-4 whitespace-nowrap">
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
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="openModal(product)"
                    class="text-blue-600 hover:text-blue-900"
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading State -->
      <div v-if="productStore.showLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Memuat data...</p>
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
    <div v-if="showModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">Detail Produk</h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
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
                      <p class="text-gray-600">{{ selectedProduct.umkm.nama_umkm }} • {{ selectedProduct.category.nama_kategori }}</p>
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
                            selectedProduct.stok > 0
                              ? 'bg-blue-100 text-blue-800'
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
                    <div class="text-gray-900 bg-gray-200 rounded-lg p-3">
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
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Informasi UMKM</h5>
                    <div class="bg-gray-200 rounded-lg p-4">
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span class="text-white font-semibold text-sm">
                              {{ getInitials(selectedProduct.umkm.nama_umkm) }}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ selectedProduct.umkm.nama_umkm }}</p>
                          <p class="text-sm text-gray-600">{{ selectedProduct.umkm.user.name }}</p>
                          <p class="text-sm text-gray-500">{{ selectedProduct.umkm.telepon }}</p>
                        </div>
                      </div>
                      <p class="text-sm text-gray-600 mt-2">{{ selectedProduct.umkm.alamat }}</p>
                      <p class="text-sm text-gray-500">{{ selectedProduct.umkm.kecamatan.nama_kecamatan }}</p>
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

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Informasi Kategori</h5>
                    <div class="bg-gray-200 rounded-lg p-3">
                      <p class="text-sm font-medium text-gray-900">{{ selectedProduct.category.nama_kategori }}</p>
                      <p class="text-sm text-gray-600">{{ selectedProduct.category.deskripsi || 'Tidak ada deskripsi kategori' }}</p>
                    </div>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Tanggal Dibuat</h5>
                    <p class="text-gray-900 bg-gray-200 rounded-lg p-3">{{ formatDate(selectedProduct.created_at) }}</p>
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
                  @click="toggleProductStatus(selectedProduct.id)"
                  :class="[
                    'px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 transition-colors',
                    selectedProduct.is_active
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  ]"
                >
                  {{ selectedProduct.is_active ? 'Nonaktifkan Produk' : 'Aktifkan Produk' }}
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
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { useNotificationStore } from '@/stores/notification'


// Stores
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const notificationStore = useNotificationStore()

// State
const showModal = ref(false)
const selectedProduct = ref(null)
const searchTimeout = ref(null)
const alertRef = ref(null)
const showFullDescription = ref(false)

// Filters
const filters = reactive({
  search: '',
  category_id: '',
  is_active: '',
  stock_status: '',
  sort_field: 'created_at',
  sort_direction: 'desc'
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
  }, 50)
}

const fetchProducts = async () => {
  try {
    await productStore.fetchProducts(filters)
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const changePage = (page) => {
  fetchProducts(page)
}

const openModal = (product) => {
  selectedProduct.value = product
  showModal.value = true
  showFullDescription.value = false
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
  showFullDescription.value = false
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
      message: `Status produk berhasil di${product.is_active ? 'nonaktifkan' : 'aktifkan'}.`
    })
  } catch (error) {
    console.error('Error toggling product status:', error)
    notificationStore.showNotification({
      type: 'error',
      message: `Gagal ${action} produk`
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
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Lifecycle
onMounted(() => {
  if (!productStore.initialized) {
    productStore.fetchStatistics()
    fetchProducts()
  }
  categoryStore.fetchCategories()
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
