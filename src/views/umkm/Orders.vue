<template>
  <div class="p-1">
    <!-- Alert Notification -->
    <AlertNotification ref="alertRef" :auto-remove="3000" />

    <!-- Header dan Stats Cards -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manajemen Orders UMKM</h2>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      <!-- Pending Orders Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <p class="text-2xl font-bold text-gray-800">{{ orderStore.statistics.total_pending }}</p>
            <p v-if="orderStore.statistics.orders_without_shipper > 0" class="text-xs text-red-600 mt-1">
              {{ orderStore.statistics.orders_without_shipper }} tanpa shipper
            </p>
          </div>
        </div>
      </div>

      <!-- Processing Orders Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Processing</p>
            <p class="text-2xl font-bold text-gray-800">{{ orderStore.statistics.total_processing }}</p>
            <p v-if="orderStore.statistics.orders_without_resi > 0" class="text-xs text-yellow-600 mt-1">
              {{ orderStore.statistics.orders_without_resi }} tanpa resi
            </p>
          </div>
        </div>
      </div>

      <!-- Shipped Orders -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Shipped</p>
            <p class="text-2xl font-bold text-gray-800">{{ orderStore.statistics.total_shipped }}</p>
          </div>
        </div>
      </div>

      <!-- Delivered Orders Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Delivered</p>
            <p class="text-2xl font-bold text-gray-800">{{ orderStore.statistics.total_delivered }}</p>
          </div>
        </div>
      </div>

      <!-- Cancelled Orders Card -->
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Cancelled</p>
            <p class="text-2xl font-bold text-gray-800">{{ orderStore.statistics.total_cancelled }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Warning Alert untuk Orders tanpa Shipper -->
    <div v-if="orderStore.statistics.orders_without_shipper > 0" class="mb-6">
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              Anda memiliki <span class="font-semibold">{{ orderStore.statistics.orders_without_shipper }} order</span> yang belum memiliki shipper.
              Pilih shipper sebelum mengubah status menjadi shipped.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search Input -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Order</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Kode order, nomor resi, atau nama customer..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleSearch"
          >
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status Order</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchOrders"
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="without_shipper">Tanpa Shipper</option>
            <option value="without_resi">Tanpa No. Resi</option>
          </select>
        </div>

        <!-- Sort Options -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
          <div class="flex gap-2">
            <select
              v-model="filters.sort_field"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="fetchOrders"
            >
              <option value="created_at">Tanggal Dibuat</option>
              <option value="grand_total">Nilai Order</option>
              <option value="status">Status</option>
              <option value="nomor_resi">No. Resi</option>
            </select>
            <select
              v-model="filters.sort_direction"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="fetchOrders"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
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
            @change="fetchOrders"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
          <input
            v-model="filters.end_date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchOrders"
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

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Info</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipper & Resi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orderStore.orders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ order.kode_order }}</div>
                <div class="text-xs text-gray-400">{{ formatDate(order.created_at) }}</div>
                <div class="text-xs text-gray-400">{{ order.order_items_count }} item</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ order.customer?.nama_customer }}</div>
                <div class="text-sm text-gray-500">{{ order.customer?.user?.email }}</div>
                <div class="text-xs text-gray-400 truncate max-w-xs">{{ order.alamat_pengiriman }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">Rp {{ formatPrice(order.grand_total) }}</div>
                <div class="text-xs text-gray-500">Items: Rp {{ formatPrice(order.total_harga) }}</div>
                <div class="text-xs text-gray-500">Ongkir: Rp {{ formatPrice(order.ongkir) }}</div>
              </td>
              <td class="px-6 py-4">
                <div v-if="order.shipper" class="space-y-1">
                  <div class="text-sm font-medium text-gray-900">{{ order.shipper?.shipper_name }}</div>
                  <div v-if="order.nomor_resi" class="text-sm text-blue-600 font-semibold">
                    {{ order.nomor_resi }}
                  </div>
                  <div v-else class="text-xs text-red-500 italic">
                    Belum ada no. resi
                  </div>
                </div>
                <div v-else class="text-xs text-red-500 italic">
                  Shipper belum dipilih
                </div>
                <div v-if="order.estimasi_pengiriman" class="text-xs text-gray-500">
                  Est: {{ order.estimasi_pengiriman }} hari
                </div>
                <div v-if="order.jarak_km" class="text-xs text-gray-500">
                  Jarak: {{ order.jarak_km }} km
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClasses(order.status)" class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
                  {{ getStatusText(order.status) }}
                </span>
                <div v-if="order.status === 'processing' && !order.shipper_id" class="mt-1">
                  <span class="text-xs text-red-500">Butuh shipper</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="openDetailModal(order)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Lihat Detail"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button
                    @click="openStatusModal(order)"
                    class="text-green-600 hover:text-green-900"
                    title="Update Status"
                    :disabled="order.status === 'cancelled' || order.status === 'delivered'"
                    :class="{
                      'opacity-50 cursor-not-allowed': order.status === 'cancelled' || order.status === 'delivered',
                      'text-yellow-600': order.status === 'processing' && !order.shipper_id
                    }"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading State -->
      <div v-if="orderStore.showLoading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Memuat data...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!orderStore.hasOrders" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada Orders</h3>
        <p class="mt-1 text-sm text-gray-500">Belum ada order untuk UMKM Anda.</p>
      </div>

      <!-- Pagination -->
      <div v-if="orderStore.hasOrders" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Menampilkan
              <span class="font-medium">{{ (orderStore.currentPage - 1) * 10 + 1 }}</span>
              sampai
              <span class="font-medium">{{ Math.min(orderStore.currentPage * 10, orderStore.totalItems) }}</span>
              dari
              <span class="font-medium">{{ orderStore.totalItems }}</span>
              hasil
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="orderStore.currentPage === 1 || orderStore.loading"
              @click="changePage(orderStore.currentPage - 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                orderStore.currentPage === 1 || orderStore.loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              ]"
            >
              Sebelumnya
            </button>
            <button
              :disabled="orderStore.currentPage === orderStore.totalPages || orderStore.loading"
              @click="changePage(orderStore.currentPage + 1)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                orderStore.currentPage === orderStore.totalPages || orderStore.loading
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

    <!-- Modal Detail Order -->
    <div v-if="showDetailModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDetailModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">Detail Order</h3>
              <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <hr class="mb-3">

            <div v-if="selectedOrder" class="space-y-6">
              <!-- Header Info -->
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="text-xl font-semibold text-gray-900">{{ selectedOrder.kode_order }}</h4>
                  <p v-if="selectedOrder.nomor_resi" class="text-gray-600">
                    Resi: <span class="font-semibold text-blue-600">{{ selectedOrder.nomor_resi }}</span>
                  </p>
                  <p v-else class="text-red-500 italic">
                    No. Resi akan dibuat otomatis setelah memilih shipper
                  </p>
                </div>
                <div class="text-right">
                  <span :class="getStatusBadgeClasses(selectedOrder.status)" class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
                    {{ getStatusText(selectedOrder.status) }}
                  </span>
                  <p class="text-sm text-gray-500 mt-1">{{ formatDate(selectedOrder.created_at) }}</p>
                </div>
              </div>

              <!-- Main Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Informasi Customer</h5>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center space-x-3">
                        <div class="h-10 w-10 rounded bg-green-500 flex items-center justify-center">
                          <span class="text-white font-semibold text-sm">
                            {{ getInitials(selectedOrder.customer?.nama_customer) }}
                          </span>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ selectedOrder.customer?.nama_customer }}</p>
                          <p class="text-sm text-gray-500">{{ selectedOrder.customer?.user?.email }}</p>
                          <p class="text-xs text-gray-400">{{ selectedOrder.alamat_pengiriman }}</p>
                          <p class="text-xs text-gray-500">{{ selectedOrder.customer?.telepon }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Informasi Pengiriman</h5>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-600">Estimasi Pengiriman:</span>
                          <span class="text-sm font-medium text-gray-900">{{ selectedOrder.estimasi_pengiriman || '-' }} hari</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-600">Jarak:</span>
                          <span class="text-sm font-medium text-gray-900">{{ selectedOrder.jarak_km || '-' }} km</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-600">No. Resi:</span>
                          <span class="text-sm font-medium text-gray-900">
                            <span v-if="selectedOrder.nomor_resi" class="text-blue-600">{{ selectedOrder.nomor_resi }}</span>
                            <span v-else class="text-red-500">-</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                  <div>
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Ringkasan Pembayaran</h5>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-600">Subtotal Produk:</span>
                          <span class="text-sm font-medium text-gray-900">Rp {{ formatPrice(selectedOrder.total_harga) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-600">Ongkos Kirim:</span>
                          <span class="text-sm font-medium text-gray-900">Rp {{ formatPrice(selectedOrder.ongkir) }}</span>
                        </div>
                        <div class="flex justify-between border-t border-gray-300 pt-2">
                          <span class="text-sm font-semibold text-gray-700">Total:</span>
                          <span class="text-sm font-bold text-gray-900">Rp {{ formatPrice(selectedOrder.grand_total) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Update Shipper Section -->
                  <div v-if="selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered'">
                    <h5 class="text-sm font-medium text-gray-500 mb-2">Pilih Shipper</h5>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="space-y-3">
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-600">Shipper Saat Ini:</span>
                          <span class="text-sm font-medium text-gray-900">
                            {{ selectedOrder.shipper?.shipper_name || 'Belum dipilih' }}
                          </span>
                        </div>
                        <div class="text-sm text-gray-600 mb-2">
                          <span v-if="selectedOrder.shipper_id && selectedOrder.nomor_resi">
                            No. Resi: <span class="font-semibold text-blue-600">{{ selectedOrder.nomor_resi }}</span>
                          </span>
                          <span v-else-if="selectedOrder.shipper_id" class="text-yellow-600">
                            No. resi akan dibuat otomatis
                          </span>
                        </div>
                        <div class="flex space-x-2">
                          <select
                            v-model="selectedShipper"
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            :disabled="shipperLoading"
                          >
                            <option value="">Pilih Shipper...</option>
                            <option v-for="shipper in orderStore.shippers" :key="shipper.id" :value="shipper.id">
                              {{ shipper.shipper_name }}
                            </option>
                          </select>
                          <button
                            @click="updateShipper"
                            :disabled="!selectedShipper || selectedShipper === selectedOrder.shipper_id || shipperLoading"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span v-if="shipperLoading">Menyimpan...</span>
                            <span v-else>{{ selectedOrder.shipper_id ? 'Ganti' : 'Simpan' }}</span>
                          </button>
                        </div>
                        <p v-if="!selectedOrder.shipper_id" class="text-xs text-red-500">
                          * Shipper harus dipilih sebelum mengubah status menjadi shipped
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div>
                <h5 class="text-sm font-medium text-gray-500 mb-2">Detail Produk</h5>
                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Satuan</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="item in selectedOrder.order_items" :key="item.id">
                        <td class="px-4 py-3">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <img v-if="item.product?.foto" :src="item.product.foto" :alt="item.product.nama_produk" class="h-10 w-10 rounded object-cover">
                              <div v-else class="h-10 w-10 rounded bg-gray-300 flex items-center justify-center">
                                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ item.product?.nama_produk }}</div>
                              <div class="text-sm text-gray-500">Kategori: {{ item.product?.category?.nama_kategori }}</div>
                              <div class="text-xs text-gray-400">Stok: {{ item.product?.stok }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-900">Rp {{ formatPrice(item.harga_satuan) }}</td>
                        <td class="px-4 py-3 text-sm text-gray-900">{{ item.quantity }}</td>
                        <td class="px-4 py-3 text-sm font-semibold text-gray-900">Rp {{ formatPrice(item.subtotal) }}</td>
                      </tr>
                    </tbody>
                    <tfoot class="bg-gray-50">
                      <tr>
                        <td colspan="3" class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total:</td>
                        <td class="px-4 py-3 text-sm font-bold text-gray-900">Rp {{ formatPrice(selectedOrder.total_harga) }}</td>
                      </tr>
                    </tfoot>
                  </table>
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
                  v-if="selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered'"
                  @click="openStatusModal(selectedOrder)"
                  :disabled="selectedOrder.status === 'processing' && !selectedOrder.shipper_id"
                  :class="[
                    'px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 transition-colors',
                    selectedOrder.status === 'processing' && !selectedOrder.shipper_id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  ]"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Update Status -->
    <div v-if="showStatusModal" class="fixed inset-0 z-60 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeStatusModal"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-2xl font-bold text-gray-800">Update Status Order</h3>
              <button @click="closeStatusModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <hr class="mb-3">

            <div v-if="selectedOrder" class="space-y-4">
              <div>
                <p class="text-sm text-gray-600 mb-2">Order: <span class="font-semibold">{{ selectedOrder.kode_order }}</span></p>
                <p class="text-sm text-gray-600">Status saat ini:
                  <span :class="getStatusBadgeClasses(selectedOrder.status)" class="font-semibold px-2 py-1 rounded-full text-xs">
                    {{ getStatusText(selectedOrder.status) }}
                  </span>
                </p>
                <div v-if="selectedOrder.shipper" class="mt-2 text-sm text-gray-600">
                  Shipper: <span class="font-semibold">{{ selectedOrder.shipper.shipper_name }}</span>
                  <div v-if="selectedOrder.nomor_resi" class="text-sm text-blue-600">
                    No. Resi: {{ selectedOrder.nomor_resi }}
                  </div>
                </div>
              </div>

              <!-- Warning jika ingin update ke shipped tanpa shipper -->
              <div v-if="newStatus === 'shipped' && !selectedOrder.shipper_id" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <div class="flex">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <div class="ml-2">
                    <p class="text-sm font-medium">Shipper belum dipilih</p>
                    <p class="text-xs mt-1">Anda harus memilih shipper terlebih dahulu sebelum mengubah status menjadi shipped.</p>
                    <button
                      @click="closeStatusModal(); openDetailModal(selectedOrder)"
                      class="mt-2 text-xs text-red-600 underline hover:text-red-800"
                    >
                      Pilih shipper sekarang →
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Status Baru</label>
                <div class="space-y-2">
                  <div v-for="statusOption in filteredStatusOptions" :key="statusOption.value" class="flex items-start">
                    <input
                      :id="`status-${statusOption.value}`"
                      v-model="newStatus"
                      :value="statusOption.value"
                      :disabled="statusOption.disabled"
                      type="radio"
                      class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                    >
                    <label :for="`status-${statusOption.value}`" class="ml-3 block text-sm font-medium text-gray-700">
                      <span :class="getStatusBadgeClasses(statusOption.value)" class="px-3 py-1 rounded-full">
                        {{ statusOption.label }}
                      </span>
                      <p class="text-xs text-gray-500 mt-1">{{ statusOption.description }}</p>
                      <p v-if="statusOption.requirement" class="text-xs text-red-500 mt-1">
                        {{ statusOption.requirement }}
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  @click="closeStatusModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Batal
                </button>
                <button
                  @click="updateOrderStatus"
                  :disabled="!newStatus || newStatus === selectedOrder.status || statusLoading || (newStatus === 'shipped' && !selectedOrder.shipper_id)"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="statusLoading">Memperbarui...</span>
                  <span v-else>Update Status</span>
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
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useUmkmOrderStore } from '@/stores/umkm-order'
import { useNotificationStore } from '@/stores/notification'

// Stores
const orderStore = useUmkmOrderStore()
const notificationStore = useNotificationStore()

// Alert Reference
const alertRef = ref(null)

// State
const showDetailModal = ref(false)
const showStatusModal = ref(false)
const selectedOrder = ref(null)
const statusLoading = ref(false)
const shipperLoading = ref(false)
const searchTimeout = ref(null)
const newStatus = ref('')
const selectedShipper = ref('')

// Status Options dengan requirement
const statusOptions = [
  {
    value: 'pending',
    label: 'Pending',
    description: 'Order menunggu konfirmasi'
  },
  {
    value: 'processing',
    label: 'Processing',
    description: 'Order sedang diproses'
  },
  {
    value: 'shipped',
    label: 'Shipped',
    description: 'Order sedang dikirim',
    requirement: 'Shipper harus dipilih'
  },
  {
    value: 'delivered',
    label: 'Delivered',
    description: 'Order telah diterima'
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    description: 'Order dibatalkan'
  }
]

// Compute filtered status options berdasarkan status saat ini dan shipper
const filteredStatusOptions = computed(() => {
  if (!selectedOrder.value) return statusOptions

  const currentStatus = selectedOrder.value.status
  const allowedTransitions = {
    pending: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: []
  }

  return statusOptions.map(option => {
    // Nonaktifkan jika tidak ada dalam transisi yang diizinkan
    let disabled = !allowedTransitions[currentStatus]?.includes(option.value)

    // Nonaktifkan shipped jika shipper belum dipilih
    if (option.value === 'shipped' && !selectedOrder.value.shipper_id) {
      disabled = true
    }

    // Nonaktifkan jika status sama dengan saat ini
    if (option.value === currentStatus) {
      disabled = true
    }

    return {
      ...option,
      disabled
    }
  })
})

// Filters
const filters = reactive({
  search: '',
  status: '',
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
    fetchOrders()
  }, 50)
}

const fetchOrders = async (page = 1) => {
  try {
    await orderStore.fetchOrders(filters, page)
  } catch (error) {
    console.error('Error fetching orders:', error)
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat data orders'
    })
  }
}

const resetFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.start_date = ''
  filters.end_date = ''
  filters.sort_field = 'created_at'
  filters.sort_direction = 'desc'
  fetchOrders()
}

const changePage = (page) => {
  fetchOrders(page)
}

const openDetailModal = async (order) => {
  try {
    showDetailModal.value = true;
    selectedOrder.value = order;
    selectedShipper.value = order.shipper_id || '';

    // Fetch shippers jika belum ada
    if (orderStore.shippers.length === 0) {
      await orderStore.fetchShippers();
    }

    // Fetch detail jika diperlukan
    if (!order.order_items) {
      const orderDetail = await orderStore.fetchOrderDetail(order.id);
      selectedOrder.value = orderDetail;
    }

  } catch (error) {
    console.error('Error fetching order detail:', error);
    notificationStore.showNotification({
      type: 'error',
      message: 'Gagal memuat data orders'
    })
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
  selectedShipper.value = ''
}

const openStatusModal = (order) => {
  selectedOrder.value = order
  newStatus.value = ''
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  newStatus.value = ''
}

const updateOrderStatus = async () => {
  if (!newStatus.value || newStatus.value === selectedOrder.value.status) return

  // Validasi frontend untuk status shipped
  if (newStatus.value === 'shipped' && !selectedOrder.value.shipper_id) {
    notificationStore.showNotification({
      type: 'error',
      message: 'Shipper harus dipilih sebelum mengubah status menjadi shipped'
    })
    return
  }

  statusLoading.value = true
  try {
    const response = await orderStore.updateOrderStatus(selectedOrder.value.id, newStatus.value)

    // Jika backend mengembalikan error terkait shipper
    if (response?.requires_shipper) {
      notificationStore.showNotification({
        type: 'error',
        message: 'Shipper harus dipilih sebelum mengubah status menjadi shipped'
      })
      closeStatusModal()
      openDetailModal(selectedOrder.value)
      return
    }

    // Update order in the list
    const orderIndex = orderStore.orders.findIndex(o => o.id === selectedOrder.value.id)
    if (orderIndex !== -1) {
      orderStore.orders[orderIndex] = {
        ...orderStore.orders[orderIndex],
        status: newStatus.value,
        shipper: selectedOrder.value.shipper,
        nomor_resi: selectedOrder.value.nomor_resi
      }
    }

    // Update selected order
    selectedOrder.value = {
      ...selectedOrder.value,
      status: newStatus.value
    }

    // Refresh statistics
    await orderStore.fetchStatistics()

    notificationStore.showNotification({
      type: 'success',
      message: 'Status order berhasil diperbarui'
    })
    closeStatusModal()
  } catch (error) {
    console.error('Error updating order status:', error)

    // Tangani error khusus shipper
    if (error.response?.status === 422 && error.response?.data?.requires_shipper) {
      notificationStore.showNotification({
        type: 'error',
        message: 'Shipper harus dipilih'
      })
      closeStatusModal()
      openDetailModal(selectedOrder.value)
    } else {
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui status order'
      notificationStore.showNotification({
      type: 'error',
      message: errorMessage
    })
    }
  } finally {
    statusLoading.value = false
  }
}

const updateShipper = async () => {
  if (!selectedShipper.value || selectedShipper.value === selectedOrder.value.shipper_id) return

  shipperLoading.value = true
  try {
    const updatedOrder = await orderStore.updateShipper(selectedOrder.value.id, selectedShipper.value)

    // Update order in the list
    const orderIndex = orderStore.orders.findIndex(o => o.id === selectedOrder.value.id)
    if (orderIndex !== -1) {
      orderStore.orders[orderIndex] = {
        ...orderStore.orders[orderIndex],
        shipper_id: selectedShipper.value,
        shipper: updatedOrder.data.shipper,
        nomor_resi: updatedOrder.data.nomor_resi
      }
    }

    // Update selected order
    selectedOrder.value = {
      ...selectedOrder.value,
      shipper_id: selectedShipper.value,
      shipper: updatedOrder.data.shipper,
      nomor_resi: updatedOrder.data.nomor_resi
    }

    notificationStore.showNotification({
      type: 'success',
      message: 'Shipper berhasil diperbarui. No. resi dibuat: ' + updatedOrder.data.nomor_resi
    })
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Gagal memperbarui shipper'
    notificationStore.showNotification({
      type: 'error',
      message: errorMessage
    })
  } finally {
    shipperLoading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  if (!price) return '0'
  return new Intl.NumberFormat('id-ID').format(price)
}

const getInitials = (name) => {
  if (!name) return '??'
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
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  }
  return texts[status] || status
}

// Lifecycle
onMounted(async () => {
  if (!orderStore.initialized) {
    try {
      await Promise.allSettled([
        fetchOrders(),
        orderStore.fetchStatistics()
      ])
      await orderStore.fetchShippers()
    } catch (error) {
      console.error('Error initializing:', error)
    }
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
