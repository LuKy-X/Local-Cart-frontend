<template>
  <div class="orders-page">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary to-primary-light py-12">
      <div class="container-custom">
        <div class="text-center text-white">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Pesanan Saya</h1>
          <p class="text-xl opacity-90">Kelola dan lacak pesanan Anda</p>
        </div>
      </div>
    </section>

    <!-- Orders Section -->
    <section class="py-12">
      <div class="container-custom">
        <!-- Tabs -->
        <div class="mb-8">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                :class="[
                  'py-4 px-1 font-medium text-sm border-b-2 transition-colors',
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                ]"
              >
                {{ tab.name }}
                <span class="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                  {{ getOrderCountByTab(tab.key) }}
                </span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Orders List -->
        <div v-if="orderStore.loading && orderStore.orders.length === 0" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p class="mt-4 text-gray-600">Memuat pesanan...</p>
        </div>

        <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
          <div class="mx-auto w-24 h-24 text-gray-400 mb-4">
            <i class="fas fa-box-open text-6xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada pesanan</h3>
          <p class="text-gray-600">Anda belum memiliki pesanan di tab ini.</p>
          <router-link
            to="/products"
            class="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Mulai Belanja
          </router-link>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <!-- Order Header -->
            <div class="p-6 border-b border-gray-200">
              <div class="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div class="flex items-center space-x-4">
                    <h3 class="text-lg font-bold text-gray-900">{{ order.kode_order }}</h3>
                    <span :class="statusBadgeClass(order.status)">
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>
                  <p class="text-gray-600 mt-1">
                    {{ formatDate(order.created_at) }} • {{ order.order_items_count }} item
                  </p>
                </div>
                <div class="mt-4 md:mt-0">
                  <p class="text-2xl font-bold text-primary">
                    {{ formatCurrency(order.grand_total) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Order Items Preview -->
            <div class="p-6">
              <div class="flex space-x-4 overflow-x-auto">
                <div
                  v-for="item in order.order_items.slice(0, 3)"
                  :key="item.id"
                  class="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    :src="item.product?.foto || getPlaceholderImage()"
                    :alt="item.product?.nama_produk"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div v-if="order.order_items.length > 3" class="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span class="text-gray-500 font-bold">+{{ order.order_items.length - 3 }}</span>
                </div>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="p-6 border-t border-gray-200 bg-gray-50">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-gray-600">
                    UMKM: <span class="font-medium">{{ order.umkm?.nama_umkm }}</span>
                  </p>
                </div>
                <div class="flex space-x-3">
                  <button
                    @click="viewOrderDetail(order)"
                    class="btn-outline px-4 py-2"
                  >
                    <i class="fas fa-eye mr-2"></i> Detail
                  </button>
                  <button
                    v-if="order.status === 'pending'"
                    @click="openCancelConfirmation(order)"
                    class="btn-outline px-4 py-2 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <i class="fas fa-times mr-2"></i> Batalkan
                  </button>
                  <button
                    v-if="order.status === 'delivered' && !order.has_rating"
                    @click="openRatingModal(order)"
                    class="btn-primary px-4 py-2"
                  >
                    <i class="fas fa-star mr-2"></i> Beri Rating
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="orderStore.hasMoreOrders && !orderStore.loading" class="text-center mt-12">
          <button
            @click="loadMoreOrders"
            :disabled="loadingMore"
            class="btn-outline px-8 py-3 text-lg font-medium"
          >
            <span v-if="!loadingMore">
              <i class="fas fa-sync-alt mr-2"></i> Muat Lebih Banyak
            </span>
            <span v-else>
              <i class="fas fa-spinner fa-spin mr-2"></i> Memuat...
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Order Detail Modal -->
    <OrderDetailModal
      v-if="selectedOrder"
      :order="selectedOrder"
      :show="showDetailModal"
      @close="showDetailModal = false"
      @cancel-order="handleCancelOrder"
      @open-rating="openRatingModal"
    />

    <!-- Cancel Confirmation Modal -->
    <ConfirmationModal
      v-if="orderToCancel"
      :show="showCancelModal"
      title="Batalkan Pesanan"
      subtitle="Konfirmasi pembatalan pesanan"
      type="cancel-order"
      variant="warning"
      :data="orderToCancel"
      confirm-text="Ya, Batalkan"
      cancel-text="Kembali"
      icon="fas fa-exclamation-triangle"
      confirm-icon="fas fa-times"
      :loading="cancelling"
      @close="closeCancelModal"
      @confirm="confirmCancelOrder"
    />

    <!-- Rating Modal -->
    <RatingModal
      v-if="ratingOrder"
      :order="ratingOrder"
      :show="showRatingModal"
      @close="showRatingModal = false"
      @submit-rating="handleSubmitRating"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCustomerOrderStore } from '@/stores/customer-orders'
import OrderDetailModal from '@/components/e-commerce/common/OrderDetailModal.vue'
import RatingModal from '@/components/e-commerce/common/RatingModal.vue'
import ConfirmationModal from '@/components/e-commerce/common/ConfirmationModal.vue'
import { useNotificationStore } from '@/stores/notification'

const orderStore = useCustomerOrderStore()
const notificationStore = useNotificationStore()

const activeTab = ref('process')
const showDetailModal = ref(false)
const showRatingModal = ref(false)
const showCancelModal = ref(false)
const selectedOrder = ref(null)
const ratingOrder = ref(null)
const orderToCancel = ref(null)
const cancelling = ref(false)
const loadingMore = ref(false)

const tabs = [
  { key: 'process', name: 'Dalam Proses' },
  { key: 'completed', name: 'Selesai' },
  { key: 'cancelled', name: 'Dibatalkan' }
]

const statusByTab = {
  process: ['pending', 'processing', 'shipped'],
  completed: ['delivered'],
  cancelled: ['cancelled']
}


const filteredOrders = computed(() => {
  const statuses = statusByTab[activeTab.value]
  return orderStore.orders.filter(order => statuses.includes(order.status))
})

function getOrderCountByTab(tabKey) {
  const statuses = statusByTab[tabKey]
  return orderStore.orders.filter(order => statuses.includes(order.status)).length
}

function statusBadgeClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return `inline-flex px-3 py-1 rounded-full text-xs font-medium ${classes[status] || 'bg-gray-100 text-gray-800'}`
}

function getStatusText(status) {
  const texts = {
    pending: 'Dipending',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Selesai',
    cancelled: 'Dibatalkan'
  }
  return texts[status] || status
}

function formatDate(dateString) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
}

function getPlaceholderImage() {
  return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
}

function viewOrderDetail(order) {
  selectedOrder.value = order
  showDetailModal.value = true
}

async function cancelOrder(order) {
  if (!confirm(`Apakah Anda yakin ingin membatalkan pesanan ${order.kode_order}?`)) {
    return
  }
  try {
    await orderStore.cancelOrder(order.id)
    notificationStore.showNotification({
      type: 'success',
      message: 'Pesanan berhasil dibatalkan'
    })
  } catch (error) {
    console.error('Error canceling order:', error)
    notificationStore.showNotification({
      type: 'error',
      message: error.response?.data?.message || 'Gagal membatalkan pesanan'
    })
  }
}

function openRatingModal(order) {
  ratingOrder.value = order
  showRatingModal.value = true
  showDetailModal.value = false
}

async function handleSubmitRating(ratings) {
  try {
    // kirim semua rating
    await Promise.all(
      ratings.map(rating =>
        orderStore.addRating(ratingOrder.value.id, rating)

      )
    )

    // 🔑 tandai order sudah dirating (frontend sync)
    const index = orderStore.orders.findIndex(
      o => o.id === ratingOrder.value.id
    )

    if (index !== -1) {
      orderStore.orders[index] = {
        ...orderStore.orders[index],
        has_rating: true
      }
    }

    showRatingModal.value = false

    notificationStore.showNotification({
      type: 'success',
      message: 'Rating berhasil dikirim'
    })
  } catch (error) {
    notificationStore.showNotification({
      type: 'error',
      message: error.response?.data?.message || 'Gagal mengirim rating'
    })
  }
}



async function loadMoreOrders() {
  loadingMore.value = true
  try {
    const nextPage = orderStore.pagination.current_page + 1
    await orderStore.fetchOrders({ page: nextPage })
  } catch (error) {
    console.error('Error loading more orders:', error)
  } finally {
    loadingMore.value = false
  }
}

function openCancelConfirmation(order) {
  orderToCancel.value = order
  showCancelModal.value = true
  showDetailModal.value = false
}

function closeCancelModal() {
  orderToCancel.value = null
  showCancelModal.value = false
}

async function confirmCancelOrder() {
  cancelling.value = true
  try {
    await orderStore.cancelOrder(orderToCancel.value.id)
    notificationStore.showNotification({
      type: 'success',
      message: 'Pesanan berhasil dibatalkan'
    })
    closeCancelModal()
  } catch (error) {
    console.error('Error canceling order:', error)
    notificationStore.showNotification({
      type: 'error',
      message: error.response?.data?.message || 'Gagal membatalkan pesanan'
    })
  } finally {
    cancelling.value = false
  }
}

// Update OrderDetailModal methods
function handleCancelOrder(orderId) {
  // This will now be handled by the confirmation modal
  const order = orderStore.orders.find(o => o.id === orderId)
  if (order) {
    openCancelConfirmation(order)
  }
}

onMounted(async () => {
  try {
    await orderStore.fetchOrders()
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
})
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
}

.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.btn-outline {
  @apply border border-primary text-primary font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300;
}

.btn-primary {
  @apply bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary-light transition-all duration-300;
}
</style>
