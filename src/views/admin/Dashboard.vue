<template>
  <div class="p-1">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Dashboard Admin</h2>
      <p class="text-gray-600">Ringkasan data dan statistik sistem</p>
    </div>

    <!-- Statistics Cards (4 Cards dengan loading cepat) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Customers -->
      <DashboardCard
        title="Total Customer"
        :value="dashboardStore.quickStats.total_customers"
        icon="users"
        color="blue"
        :loading="!dashboardStore.isQuickStatsLoaded"
        link="/admin/customer"
      />

      <!-- Total UMKM -->
      <DashboardCard
        title="Total UMKM"
        :value="dashboardStore.quickStats.total_umkms"
        icon="store"
        color="green"
        :loading="!dashboardStore.isQuickStatsLoaded"
        link="/admin/umkm"
      />

      <!-- Total Products -->
      <DashboardCard
        title="Total Produk"
        :value="dashboardStore.quickStats.total_products"
        icon="package"
        color="purple"
        :loading="!dashboardStore.isQuickStatsLoaded"
        link="/admin/produk"
      />

      <!-- Total Orders -->
      <DashboardCard
        title="Total Orders"
        :value="dashboardStore.quickStats.total_orders"
        icon="shopping-cart"
        color="yellow"
        :loading="!dashboardStore.isQuickStatsLoaded"
        link="/admin/orders"
      />
    </div>

    <!-- Pending Actions Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Pending Orders -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Order Menunggu</h3>
            <p class="text-sm text-gray-600">Order yang perlu diproses</p>
          </div>
          <span class="text-2xl font-bold text-yellow-600">
            {{ dashboardStore.quickStats.pending_orders }}
          </span>
        </div>
        <router-link
          to="/admin/orders?status=pending"
          class="inline-flex items-center text-sm text-yellow-600 hover:text-yellow-800"
        >
          Lihat semua order pending
          <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- Pending UMKM Approvals -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">UMKM Menunggu</h3>
            <p class="text-sm text-gray-600">UMKM perlu approval</p>
          </div>
          <span class="text-2xl font-bold text-orange-600">
            {{ dashboardStore.quickStats.pending_umkms }}
          </span>
        </div>
        <router-link
          to="/admin/umkm?status=pending"
          class="inline-flex items-center text-sm text-orange-600 hover:text-orange-800"
        >
          Lihat semua UMKM pending
          <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Charts Section (Load setelah data utama) -->
    <div v-if="dashboardStore.isFullDataLoaded" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Order Chart - Perbaikan tinggi batang -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">Order 4 Bulan Terakhir</h3>
          <span class="text-sm text-gray-500">
            Total: {{ totalOrdersChart }} orders
          </span>
        </div>

        <!-- Chart Container -->
        <div class="h-64 relative">
          <!-- Grid lines background -->
          <div class="absolute inset-0 flex flex-col justify-between">
            <div v-for="n in 5" :key="n" class="border-t border-gray-100">
              <div class="absolute left-0 -top-2 text-xs text-gray-400 transform -translate-y-1/2">
                {{ Math.round(maxOrderValue * (n / 5)) }}
              </div>
            </div>
            <!-- Horizontal baseline -->
            <div class="absolute bottom-0 left-0 right-0 border-t border-gray-300"></div>
          </div>

          <!-- Chart Content -->
          <div class="relative h-full flex items-end">
            <!-- Y-axis labels -->
            <div class="flex flex-col justify-between h-full py-4 pr-4 w-10">
              <div class="text-xs text-gray-500 text-right">{{ maxOrderValue }}</div>
              <div class="text-xs text-gray-500 text-right">{{ Math.round(maxOrderValue * 0.75) }}</div>
              <div class="text-xs text-gray-500 text-right">{{ Math.round(maxOrderValue * 0.5) }}</div>
              <div class="text-xs text-gray-500 text-right">{{ Math.round(maxOrderValue * 0.25) }}</div>
              <div class="text-xs text-gray-500 text-right">0</div>
            </div>

            <!-- Bars Container -->
            <div class="flex-1 flex items-end h-full px-4">
              <div
                v-for="(item, index) in dashboardStore.charts.order_chart"
                :key="index"
                class="flex flex-col items-center justify-end flex-1 px-2 group relative"
              >
                <!-- Bar dengan height yang proporsional -->
                <div class="relative w-10 flex flex-col items-center">
                  <!-- Value label on top -->
                  <div class="mb-2 text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {{ item.orders }}
                  </div>

                  <!-- Bar container dengan fixed height -->
                  <div class="relative w-full" style="height: 120px">
                    <!-- Bar shadow -->
                    <div
                      class="absolute bottom-0 left-0 right-0 bg-blue-100 rounded-t-lg transition-all duration-300"
                      :style="{
                        height: `${getOrderBarHeight(item.orders)}%`,
                        'min-height': '4px'
                      }"
                    ></div>

                    <!-- Main bar dengan gradient -->
                    <div
                      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-700 group-hover:via-blue-600 group-hover:to-blue-500 group-hover:shadow-lg"
                      :style="{
                        height: `${getOrderBarHeight(item.orders)}%`,
                        'min-height': '4px'
                      }"
                    >
                      <!-- Hover tooltip -->
                      <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div class="bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                          <div class="font-bold">{{ item.month }}</div>
                          <div>{{ item.orders }} orders</div>
                        </div>
                        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>

                    <!-- Bar highlight effect -->
                    <div
                      v-if="item.orders > 0"
                      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-300 rounded-t-lg opacity-50"
                      :style="{
                        height: `${Math.min(getOrderBarHeight(item.orders) * 0.1, 10)}%`,
                        'min-height': '2px'
                      }"
                    ></div>
                  </div>

                  <!-- Month label -->
                  <div class="mt-3 text-sm font-medium text-gray-700">{{ item.month }}</div>

                  <!-- Value label at bottom -->
                  <div class="mt-1 text-xs font-bold text-blue-600">
                    {{ item.orders }}
                  </div>
                </div>

                <!-- Connecting line (optional) -->
                <div v-if="index < dashboardStore.charts.order_chart.length - 1" class="absolute top-1/2 right-0 w-2 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Legend & Summary -->
        <div class="mt-6 pt-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row items-center justify-between">
            <div class="flex items-center mb-2 sm:mb-0">
              <div class="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 mr-2"></div>
              <span class="text-xs text-gray-600">Jumlah Order per Bulan</span>
            </div>
            <div class="text-xs text-gray-500">
              <span v-if="maxOrderValue > 0">Skala: 1:{{ Math.round(maxOrderValue / 5) }} orders per grid</span>
              <span v-else>Tidak ada data order</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Status Overview - Perbaikan tampilan lebih compact -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Status Order</h3>
          <span class="text-xs text-gray-500">
            Total: {{ totalOrdersByStatus }}
          </span>
        </div>

        <!-- Status Cards Grid -->
        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="(count, status) in dashboardStore.statistics.order_statuses"
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
              <div v-if="totalOrdersByStatus > 0" class="mt-1">
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    class="h-1.5 rounded-full transition-all duration-500"
                    :class="getStatusBarColor(status)"
                    :style="{ width: `${(count / totalOrdersByStatus) * 100}%` }"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ Math.round((count / totalOrdersByStatus) * 100) || 0 }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Summary -->
        <div class="mt-4 pt-3 border-t border-gray-100">
          <div class="flex flex-wrap items-center justify-between text-xs text-gray-600">
            <div class="flex items-center">
              <div class="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span class="mr-3">Delivered: {{ dashboardStore.statistics.order_statuses.delivered || 0 }}</span>
              <div class="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
              <span>Pending: {{ dashboardStore.statistics.order_statuses.pending || 0 }}</span>
            </div>
            <div class="text-gray-500">
              {{ getStatusSummary }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Data Section -->
    <div v-if="dashboardStore.isFullDataLoaded" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">Order Terbaru</h3>
            <router-link to="/admin/orders" class="text-sm text-blue-600 hover:text-blue-800">
              Lihat semua
            </router-link>
          </div>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="order in dashboardStore.statistics.recent_data.orders"
            :key="order.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-900">{{ order.kode_order }}</div>
                <div class="mt-1 text-sm text-gray-600">
                  {{ order.customer }} → {{ order.umkm }}
                </div>
              </div>
              <div class="text-right">
                <span :class="getStatusBadgeClasses(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="dashboardStore.statistics.recent_data.orders.length === 0" class="px-6 py-8 text-center">
            <p class="text-gray-500">Belum ada order</p>
          </div>
        </div>
      </div>

      <!-- Recent Customers -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">Customer Terbaru</h3>
            <router-link to="/admin/customer" class="text-sm text-blue-600 hover:text-blue-800">
              Lihat semua
            </router-link>
          </div>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="customer in dashboardStore.statistics.recent_data.customers"
            :key="customer.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span class="text-white font-semibold text-sm">
                  {{ getInitials(customer.nama) }}
                </span>
              </div>
              <div class="ml-4">
                <div class="font-medium text-gray-900">{{ customer.nama }}</div>
                <div class="text-sm text-gray-500">{{ customer.email }}</div>
              </div>
            </div>
          </div>
          <div v-if="dashboardStore.statistics.recent_data.customers.length === 0" class="px-6 py-8 text-center">
            <p class="text-gray-500">Belum ada customer</p>
          </div>
        </div>
      </div>

      <!-- Top UMKM -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">UMKM Teratas</h3>
            <router-link to="/admin/umkm" class="text-sm text-blue-600 hover:text-blue-800">
              Lihat semua
            </router-link>
          </div>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="(umkm, index) in dashboardStore.charts.top_umkms"
            :key="index"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 text-green-800 rounded-md">
                <span class="font-bold">{{ index + 1 }}</span>
              </div>
              <div class="ml-4 flex-1">
                <div class="font-medium text-gray-900">{{ umkm.nama_umkm }}</div>
                <div class="text-sm text-gray-500">{{ umkm.order_count }} order</div>
              </div>
            </div>
          </div>
          <div v-if="dashboardStore.charts.top_umkms.length === 0" class="px-6 py-8 text-center">
            <p class="text-gray-500">Belum ada data UMKM</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Stats -->
    <div v-if="dashboardStore.isFullDataLoaded" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- UMKM Status -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Status UMKM</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-600">{{ dashboardStore.statistics.umkm_statuses.approved }}</div>
            <div class="text-sm font-medium text-green-800">Approved</div>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ dashboardStore.statistics.umkm_statuses.pending }}</div>
            <div class="text-sm font-medium text-yellow-800">Pending</div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Produk Rating Tertinggi</h3>
        <div class="space-y-4">
          <div
            v-for="(product, index) in dashboardStore.charts.top_products"
            :key="index"
            class="flex items-center justify-between"
          >
            <div>
              <div class="font-medium text-gray-900">{{ product.nama_produk }}</div>
              <div class="text-sm text-gray-500">{{ product.umkm }}</div>
            </div>
            <div class="flex items-center">
              <div class="flex">
                <svg v-for="n in 5" :key="n"
                  :class="[
                    'h-4 w-4',
                    n <= Math.round(product.average_rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  ]"
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="ml-2 text-sm font-medium text-gray-900">{{ product.average_rating }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- System Info -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Info Sistem</h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Total Kategori</span>
            <span class="text-sm font-medium text-gray-900">{{ dashboardStore.statistics.basic_stats.total_categories }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Total Rating</span>
            <span class="text-sm font-medium text-gray-900">{{ dashboardStore.statistics.basic_stats.total_ratings }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Last Updated</span>
            <span class="text-sm font-medium text-gray-900">{{ currentTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton Loader untuk data tambahan -->
    <div v-if="!dashboardStore.isFullDataLoaded && dashboardStore.isQuickStatsLoaded" class="space-y-6">
      <!-- Charts Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div class="h-32 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div class="grid grid-cols-5 gap-2">
              <div class="h-16 bg-gray-100 rounded"></div>
              <div class="h-16 bg-gray-100 rounded"></div>
              <div class="h-16 bg-gray-100 rounded"></div>
              <div class="h-16 bg-gray-100 rounded"></div>
              <div class="h-16 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Data Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow-md p-6">
          <div class="animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div class="space-y-3">
              <div class="h-16 bg-gray-100 rounded"></div>
              <div class="h-16 bg-gray-100 rounded"></div>
              <div class="h-16 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Gagal memuat data</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
          </div>
          <button
            @click="retryLoading"
            class="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
          >
            Coba lagi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import DashboardCard from '@/components/admin/DashboardCard.vue'

const dashboardStore = useDashboardStore()
const currentTime = ref(new Date().toLocaleTimeString('id-ID'))
const error = ref(null)
const refreshInterval = ref(null)

const totalOrdersChart = computed(() => {
  if (!dashboardStore.charts.order_chart.length) return 0;
  return dashboardStore.charts.order_chart.reduce((sum, item) => sum + (Number(item.orders) || 0), 0);
});

const maxOrderValue = computed(() => {
  if (!dashboardStore.charts.order_chart.length) return 0;

  const orders = dashboardStore.charts.order_chart.map(item => {
    const orderCount = Number(item.orders);
    return isNaN(orderCount) ? 0 : orderCount;
  });

  const max = Math.max(...orders);
  return max === 0 ? 1 : max; // Minimal 1 untuk menghindari pembagian 0
});

const getOrderBarHeight = (orders) => {
  const numOrders = Number(orders) || 0;
  if (maxOrderValue.value <= 0 || numOrders <= 0) return 0;

  // Hitung persentase dengan skala yang baik
  const percentage = (numOrders / maxOrderValue.value) * 100;

  // Pastikan minimal 10% jika ada order (agar terlihat)
  return Math.max(percentage, numOrders > 0 ? 10 : 0);
};

const totalOrdersByStatus = computed(() => {
  const statuses = dashboardStore.statistics.order_statuses;
  return Object.values(statuses).reduce((sum, count) => sum + (count || 0), 0);
});

const getStatusSummary = computed(() => {
  const pending = dashboardStore.statistics.order_statuses.pending || 0;
  const delivered = dashboardStore.statistics.order_statuses.delivered || 0;
  const total = totalOrdersByStatus.value;

  if (total === 0) return 'Belum ada order';

  const deliveredPercentage = Math.round((delivered / total) * 100);
  const pendingPercentage = Math.round((pending / total) * 100);

  return `${deliveredPercentage}% delivered, ${pendingPercentage}% pending`;
});

// Tambahkan metode untuk styling status
const getStatusIconClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100',
    processing: 'bg-blue-100',
    shipped: 'bg-indigo-100',
    delivered: 'bg-green-100',
    cancelled: 'bg-red-100'
  };
  return classes[status] || 'bg-gray-100';
};

const getStatusIconSvgClass = (status) => {
  const classes = {
    pending: 'text-yellow-600',
    processing: 'text-blue-600',
    shipped: 'text-indigo-600',
    delivered: 'text-green-600',
    cancelled: 'text-red-600'
  };
  return classes[status] || 'text-gray-600';
};

const getStatusTextColor = (status) => {
  const classes = {
    pending: 'text-yellow-700',
    processing: 'text-blue-700',
    shipped: 'text-indigo-700',
    delivered: 'text-green-700',
    cancelled: 'text-red-700'
  };
  return classes[status] || 'text-gray-700';
};

const getStatusLabelColor = (status) => {
  const classes = {
    pending: 'text-yellow-600',
    processing: 'text-blue-600',
    shipped: 'text-indigo-600',
    delivered: 'text-green-600',
    cancelled: 'text-red-600'
  };
  return classes[status] || 'text-gray-600';
};

const getStatusBarColor = (status) => {
  const classes = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-indigo-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  };
  return classes[status] || 'bg-gray-500';
};

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

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const loadDashboardData = async () => {
  try {
    error.value = null

    // 1. Load data cepat dulu
    await dashboardStore.fetchQuickStats()

    // 2. Load data lengkap di background
    setTimeout(async () => {
      await dashboardStore.fetchDashboardData()
    }, 100)

  } catch (err) {
    console.error('Error loading dashboard:', err)
    error.value = err.message || 'Terjadi kesalahan saat memuat data'
  }
}

const retryLoading = () => {
  loadDashboardData()
}

// Lifecycle
onMounted(async () => {
  await loadDashboardData()

  // Update time setiap menit
  refreshInterval.value = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('id-ID')
  }, 60000)

  // Refresh data setiap 5 menit
  const refreshDataInterval = setInterval(async () => {
    if (dashboardStore.isFullDataLoaded) {
      await dashboardStore.refreshStatistics()
      await dashboardStore.refreshCharts()
    }
  }, 300000)

  // Cleanup interval on unmount
  onUnmounted(() => {
    if (refreshInterval.value) clearInterval(refreshInterval.value)
    if (refreshDataInterval) clearInterval(refreshDataInterval)
  })
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<style scoped>
/* Animasi untuk grafik batang */
@keyframes barGrow {
  from { height: 0; }
  to { height: var(--bar-height); }
}

.chart-bar {
  animation: barGrow 0.8s ease-out;
}

/* Responsive adjustments untuk status cards */
@media (max-width: 640px) {
  .status-card {
    padding: 0.5rem;
  }

  .status-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .status-count {
    font-size: 1rem;
  }

  .status-label {
    font-size: 0.65rem;
  }
}

/* Hover effects untuk grafik */
.bar-hover-effect {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-hover-effect:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}

/* Tooltip styling */
.chart-tooltip {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}
</style>
