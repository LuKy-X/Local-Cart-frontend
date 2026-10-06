<template>
  <div class="p-1">
    <!-- Alert Notification -->
    <AlertNotification ref="alertRef" :auto-remove="3000" />

    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Dashboard UMKM</h2>
      <p class="text-gray-600">Ringkasan data dan statistik bisnis Anda</p>
    </div>

    <!-- Loading State -->
    <div v-if="dashboardStore.loading && !dashboardStore.initialized" class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-gray-200 mr-4">
              <div class="h-6 w-6 bg-gray-300 rounded"></div>
            </div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="h-8 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards (3 Cards) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Total Pendapatan -->
      <DashboardCard
        title="Total Pendapatan"
        :value="'Rp ' + formatPrice(dashboardStore.dashboardData.totalRevenue)"
        icon="currency"
        color="blue"
        :loading="dashboardStore.loading"
        description="Total dari semua pesanan yang sudah diterima"
      />

      <!-- Produk Aktif -->
      <DashboardCard
        title="Produk Aktif"
        :value="dashboardStore.dashboardData.activeProducts"
        icon="package"
        color="purple"
        :loading="dashboardStore.loading"
        description="Jumlah produk yang aktif dijual"
        link="/umkm/products"
      />

      <!-- Rating Rata-rata -->
      <DashboardCard
        title="Rating Rata-rata"
        :value="dashboardStore.dashboardData.averageRating.toFixed(1)"
        icon="star"
        color="yellow"
        :loading="dashboardStore.loading"
        description="Rata-rata rating dari semua produk"
      />
    </div>

    <!-- Pending Actions Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Pending Orders -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Pesanan Baru</h3>
            <p class="text-sm text-gray-600">Pesanan yang perlu diproses</p>
          </div>
          <span class="text-2xl font-bold text-yellow-600">
            {{ dashboardStore.dashboardData.pendingOrders }}
          </span>
        </div>
        <router-link
          to="/umkm/orders?status=pending"
          class="inline-flex items-center text-sm text-yellow-600 hover:text-yellow-800"
        >
          Lihat semua pesanan baru
          <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- Low Stock Products -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Stok Menipis</h3>
            <p class="text-sm text-gray-600">Produk dengan stok kurang dari 10</p>
          </div>
          <span class="text-2xl font-bold text-orange-600">
            {{ dashboardStore.dashboardData.lowStockProducts }}
          </span>
        </div>
        <router-link
          to="/umkm/products?stock_status=low_stock"
          class="inline-flex items-center text-sm text-orange-600 hover:text-orange-800"
        >
          Lihat produk stok menipis
          <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Pendapatan Chart -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">Pendapatan 4 Bulan Terakhir</h3>
          <span v-if="!dashboardStore.loading" class="text-sm text-gray-500">
            Total: Rp {{ formatPrice(dashboardStore.totalRevenueChart) }}
          </span>
        </div>

        <!-- Chart Container -->
        <div v-if="dashboardStore.loading" class="h-64 flex items-center justify-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else class="h-64 relative">
          <!-- Grid lines background -->
          <div class="absolute inset-0 flex flex-col justify-between">
            <div v-for="n in 5" :key="n" class="border-t border-gray-100">
              <div class="absolute left-0 -top-2 text-xs text-gray-400 transform -translate-y-1/2">
                Rp {{ formatPriceShort(dashboardStore.maxRevenueValue * (n / 5)) }}
              </div>
            </div>
            <!-- Horizontal baseline -->
            <div class="absolute bottom-0 left-0 right-0 border-t border-gray-300"></div>
          </div>

          <!-- Chart Content -->
          <div class="relative h-full flex items-end">
            <!-- Y-axis labels -->
            <div class="flex flex-col justify-between h-full py-4 pr-4 w-10">
              <div class="text-xs text-gray-500 text-right">Rp {{ formatPriceShort(dashboardStore.maxRevenueValue) }}</div>
              <div class="text-xs text-gray-500 text-right">Rp {{ formatPriceShort(dashboardStore.maxRevenueValue * 0.75) }}</div>
              <div class="text-xs text-gray-500 text-right">Rp {{ formatPriceShort(dashboardStore.maxRevenueValue * 0.5) }}</div>
              <div class="text-xs text-gray-500 text-right">Rp {{ formatPriceShort(dashboardStore.maxRevenueValue * 0.25) }}</div>
              <div class="text-xs text-gray-500 text-right">0</div>
            </div>

            <!-- Bars Container -->
            <div class="flex-1 flex items-end h-full px-4">
              <div
                v-for="(item, index) in dashboardStore.monthlyRevenue"
                :key="index"
                class="flex flex-col items-center justify-end flex-1 px-2 group relative"
              >
                <!-- Bar dengan height yang proporsional -->
                <div class="relative w-10 flex flex-col items-center">
                  <!-- Value label on top -->
                  <div class="mb-2 text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    Rp {{ formatPriceShort(item.revenue) }}
                  </div>

                  <!-- Bar container dengan fixed height -->
                  <div class="relative w-full" style="height: 120px">
                    <!-- Bar shadow -->
                    <div
                      class="absolute bottom-0 left-0 right-0 bg-green-100 rounded-t-lg transition-all duration-300"
                      :style="{
                        height: `${getRevenueBarHeight(item.revenue)}%`,
                        'min-height': '4px'
                      }"
                    ></div>

                    <!-- Main bar dengan gradient -->
                    <div
                      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-600 via-green-500 to-green-400 rounded-t-lg transition-all duration-300 group-hover:from-green-700 group-hover:via-green-600 group-hover:to-green-500 group-hover:shadow-lg"
                      :style="{
                        height: `${getRevenueBarHeight(item.revenue)}%`,
                        'min-height': '4px'
                      }"
                    >
                      <!-- Hover tooltip -->
                      <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div class="bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                          <div class="font-bold">{{ item.month }}</div>
                          <div>Rp {{ formatPrice(item.revenue) }}</div>
                        </div>
                        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>

                    <!-- Bar highlight effect -->
                    <div
                      v-if="item.revenue > 0"
                      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-green-300 rounded-t-lg opacity-50"
                      :style="{
                        height: `${Math.min(getRevenueBarHeight(item.revenue) * 0.1, 10)}%`,
                        'min-height': '2px'
                      }"
                    ></div>
                  </div>

                  <!-- Month label -->
                  <div class="mt-3 text-sm font-medium text-gray-700">{{ item.month }}</div>

                  <!-- Value label at bottom -->
                  <div class="mt-1 text-xs font-bold text-green-600">
                    Rp {{ formatPriceShort(item.revenue) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Status Overview -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Status Pesanan</h3>
          <span v-if="!dashboardStore.loading" class="text-xs text-gray-500">
            Total: {{ dashboardStore.totalOrdersByStatus }}
          </span>
        </div>

        <div v-if="dashboardStore.loading" class="grid grid-cols-5 gap-2">
          <div v-for="n in 5" :key="n" class="rounded-lg p-3 bg-gray-100 animate-pulse">
            <div class="text-center">
              <div class="mb-2 flex justify-center">
                <div class="w-8 h-8 rounded-full bg-gray-300"></div>
              </div>
              <div class="h-6 bg-gray-300 rounded w-8 mx-auto mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>

        <!-- Status Cards Grid -->
        <div v-else class="grid grid-cols-5 gap-2">
          <div
            v-for="(count, status) in dashboardStore.orderStatuses"
            :key="status"
            class="rounded-lg p-3 transition-all hover:scale-105 hover:shadow-md"
            :class="getStatusCardClass(status)"
          >
            <div class="text-center">
              <!-- Status Icon -->
              <div class="mb-2 flex justify-center">
                <div :class="getStatusIconClass(status)" class="w-8 h-8 rounded-full flex items-center justify-center">
                  <svg :class="getStatusIconSvgClass(status)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="status === 'pending'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path v-if="status === 'processing'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    <path v-if="status === 'shipped'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path v-if="status === 'delivered'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path v-if="status === 'cancelled'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <!-- Status Count -->
              <div class="text-xl font-bold" :class="getStatusTextColor(status)">
                {{ count }}
              </div>

              <!-- Status Label -->
              <div class="mt-1 text-xs font-medium capitalize" :class="getStatusLabelColor(status)">
                {{ getStatusText(status) }}
              </div>

              <!-- Percentage (if total > 0) -->
              <div v-if="dashboardStore.totalOrdersByStatus > 0" class="mt-1">
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    class="h-1.5 rounded-full transition-all duration-500"
                    :class="getStatusBarColor(status)"
                    :style="{ width: `${(count / dashboardStore.totalOrdersByStatus) * 100}%` }"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ Math.round((count / dashboardStore.totalOrdersByStatus) * 100) || 0 }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Data Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">Pesanan Terbaru</h3>
            <router-link to="/umkm/orders" class="text-sm text-blue-600 hover:text-blue-800">
              Lihat semua
            </router-link>
          </div>
        </div>

        <div v-if="dashboardStore.loading" class="p-4 space-y-4">
          <div v-for="n in 4" :key="n" class="animate-pulse">
            <div class="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="order in dashboardStore.recentOrders.slice(0, 4)"
            :key="order.id"
            class="px-6 py-4 hover:bg-gray-50 cursor-pointer"
            @click="$router.push(`/umkm/orders/${order.id}`)"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-900">{{ order.kode_order }}</div>
                <div class="mt-1 text-sm text-gray-600">
                  {{ order.customer_name }}
                </div>
                <div class="mt-1 text-xs text-gray-500">
                  {{ order.date }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">Rp {{ formatPrice(order.total) }}</div>
                <span :class="getStatusBadgeClasses(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">Produk Terlaris</h3>
            <router-link to="/umkm/products" class="text-sm text-blue-600 hover:text-blue-800">
              Lihat semua
            </router-link>
          </div>
        </div>

        <div v-if="dashboardStore.loading" class="p-4 space-y-4">
          <div v-for="n in 4" :key="n" class="animate-pulse">
            <div class="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="(product, index) in dashboardStore.topProducts.slice(0, 4)"
            :key="product.id"
            class="px-6 py-4 hover:bg-gray-50 cursor-pointer"
            @click="$router.push(`/umkm/products/${product.id}/edit`)"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 text-green-800 rounded-md">
                <span class="font-bold">{{ index + 1 }}</span>
              </div>
              <div class="ml-4 flex-1">
                <div class="font-medium text-gray-900 line-clamp-1">{{ product.name }}</div>
                <div class="text-sm text-gray-500">Terjual: {{ product.sold }} unit</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-blue-600">Rp {{ formatPrice(product.price) }}</div>
                <div class="flex items-center justify-end mt-1">
                  <svg v-for="n in 5" :key="n"
                    :class="[
                      'h-3 w-3',
                      n <= Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    ]"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reviews -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">Ulasan Terbaru</h3>
        </div>

        <div v-if="dashboardStore.loading" class="p-4 space-y-4">
          <div v-for="n in 4" :key="n" class="animate-pulse">
            <div class="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="review in dashboardStore.recentReviews.slice(0, 4)"
            :key="review.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex">
                  <svg v-for="n in 5" :key="n"
                    :class="[
                      'h-4 w-4',
                      n <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    ]"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">{{ review.customer_name }}</div>
                <div class="text-sm text-gray-600 mt-1">{{ truncateText(review.comment || 'Tidak ada komentar', 50) }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ review.date }}</div>
                <div class="text-xs text-blue-500 mt-1">Produk: {{ review.product_name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- UMKM Info -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Info UMKM</h3>
        <div v-if="dashboardStore.loading" class="space-y-3">
          <div v-for="n in 4" :key="n" class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        <div v-else class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Nama UMKM</span>
            <span class="text-sm font-medium text-gray-900">{{ dashboardStore.umkmInfo?.nama_umkm || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Bergabung sejak</span>
            <span class="text-sm font-medium text-gray-900">{{ dashboardStore.umkmInfo?.join_date || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Total Produk</span>
            <span class="text-sm font-medium text-gray-900">{{ dashboardStore.umkmInfo?.total_products || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Status</span>
            <span :class="dashboardStore.umkmInfo?.status === 'Aktif' ? 'text-green-600' : 'text-yellow-600'"
                  class="text-sm font-medium">
              {{ dashboardStore.umkmInfo?.status || '-' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
        <div class="space-y-3">
          <router-link
            to="/umkm/products/add"
            class="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span class="text-sm font-medium text-blue-700">Tambah Produk Baru</span>
          </router-link>
          <router-link
            to="/umkm/orders"
            class="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="text-sm font-medium text-green-700">Kelola Pesanan</span>
          </router-link>
          <router-link
            to="/umkm/profile"
            class="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-sm font-medium text-purple-700">Edit Profil UMKM</span>
          </router-link>
        </div>
      </div>

      <!-- Today Stats -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Statistik Hari Ini</h3>
        <div v-if="dashboardStore.loading" class="space-y-3">
          <div v-for="n in 4" :key="n" class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        <div v-else class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Pesanan Hari Ini</span>
            <span class="text-sm font-medium text-gray-900">{{ dashboardStore.todayStats.today_orders || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Pendapatan Hari Ini</span>
            <span class="text-sm font-medium text-gray-900">Rp {{ formatPrice(dashboardStore.todayStats.today_revenue || 0) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Pengunjung Produk</span>
            <span class="text-sm font-medium text-gray-900">{{ dashboardStore.todayStats.product_views || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Last Updated</span>
            <span class="text-sm font-medium text-gray-900">{{ currentTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUmkmDashboardStore } from '@/stores/umkm-dashboard'
import DashboardCard from '@/components/umkm/DashboardCard.vue'
import AlertNotification from '@/components/AlertNotification.vue'

// Stores
const dashboardStore = useUmkmDashboardStore()
const alertRef = ref(null)

// State
const currentTime = ref(new Date().toLocaleTimeString('id-ID'))
const refreshInterval = ref(null)

// Methods
const fetchDashboardData = async () => {
  try {
    await dashboardStore.fetchDashboardData()
    // Fetch additional data if needed
    await Promise.all([
      dashboardStore.fetchMonthlyRevenue(),
      dashboardStore.fetchTodayStats()
    ])
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    alertRef.value?.addAlert('Gagal memuat data dashboard', 'error')
  }
}

const getRevenueBarHeight = (revenue) => {
  const numRevenue = Number(revenue) || 0
  if (dashboardStore.maxRevenueValue <= 0 || numRevenue <= 0) return 0

  const percentage = (numRevenue / dashboardStore.maxRevenueValue) * 100
  return Math.max(percentage, numRevenue > 0 ? 10 : 0)
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatPriceShort = (price) => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}jt`
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}k`
  }
  return `${price}`
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Status styling methods
const getStatusIconClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100',
    processing: 'bg-blue-100',
    shipped: 'bg-indigo-100',
    delivered: 'bg-green-100',
    cancelled: 'bg-red-100'
  }
  return classes[status] || 'bg-gray-100'
}

const getStatusIconSvgClass = (status) => {
  const classes = {
    pending: 'text-yellow-600',
    processing: 'text-blue-600',
    shipped: 'text-indigo-600',
    delivered: 'text-green-600',
    cancelled: 'text-red-600'
  }
  return classes[status] || 'text-gray-600'
}

const getStatusTextColor = (status) => {
  const classes = {
    pending: 'text-yellow-700',
    processing: 'text-blue-700',
    shipped: 'text-indigo-700',
    delivered: 'text-green-700',
    cancelled: 'text-red-700'
  }
  return classes[status] || 'text-gray-700'
}

const getStatusLabelColor = (status) => {
  const classes = {
    pending: 'text-yellow-600',
    processing: 'text-blue-600',
    shipped: 'text-indigo-600',
    delivered: 'text-green-600',
    cancelled: 'text-red-600'
  }
  return classes[status] || 'text-gray-600'
}

const getStatusBarColor = (status) => {
  const classes = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-indigo-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  }
  return classes[status] || 'bg-gray-500'
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

const getStatusCardClass = (status) => {
  const classes = {
    pending: 'bg-yellow-50 border border-yellow-200',
    processing: 'bg-blue-50 border border-blue-200',
    shipped: 'bg-indigo-50 border border-indigo-200',
    delivered: 'bg-green-50 border border-green-200',
    cancelled: 'bg-red-50 border border-red-200'
  }
  return classes[status] || 'bg-gray-50 border border-gray-200'
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

// Auto refresh data every 5 minutes
const startAutoRefresh = () => {
  refreshInterval.value = setInterval(() => {
    fetchDashboardData()
    currentTime.value = new Date().toLocaleTimeString('id-ID')
  }, 5 * 60 * 1000) // 5 minutes
}

// Lifecycle
onMounted(() => {
  fetchDashboardData()
  startAutoRefresh()
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
