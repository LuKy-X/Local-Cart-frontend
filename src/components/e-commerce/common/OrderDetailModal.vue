<template>
  <transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <!-- Modal Header -->
        <div class="modal-header">
          <h3 class="text-2xl font-bold text-gray-900">Detail Pesanan</h3>
          <button @click="close" class="modal-close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Order Info -->
          <div class="mb-8">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-600">Kode Pesanan</p>
                <p class="text-lg font-bold">{{ order.kode_order }}</p>
              </div>
              <div>
                <span :class="statusBadgeClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-gray-600">Tanggal Pesanan</p>
                <p class="font-medium">{{ formatDate(order.created_at) }}</p>
              </div>
              <div>
                <p class="text-gray-600">Total Pembayaran</p>
                <p class="text-2xl font-bold text-primary">{{ formatCurrency(order.grand_total) }}</p>
              </div>
              <div>
                <p class="text-gray-600">Estimasi Pengiriman</p>
                <p class="font-medium">{{ formattedEstimasi }} hari</p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="mb-8">
            <h4 class="text-lg font-bold mb-4">Item Pesanan</h4>
            <div class="space-y-4">
              <div
                v-for="item in order.order_items"
                :key="item.id"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    :src="item.product?.foto || getPlaceholderImage()"
                    :alt="item.product?.nama_produk"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="ml-4 flex-grow">
                  <h5 class="font-bold">{{ item.product?.nama_produk }}</h5>
                  <p class="text-gray-600 text-sm">Kategori: {{ item.product?.category?.nama_kategori }}</p>
                  <p class="text-gray-600 text-sm">Kuantitas: {{ item.quantity }}</p>
                  <p class="text-gray-600 text-sm">Harga Satuan: {{ formatCurrency(item.harga_satuan) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="mb-8">
            <h4 class="text-lg font-bold mb-4">Ringkasan Pesanan</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <p class="text-gray-600">Total Harga</p>
                <p class="font-medium">{{ formatCurrency(order.total_harga) }}</p>
              </div>
              <div class="flex justify-between">
                <p class="text-gray-600">Ongkos Kirim</p>
                <p class="font-medium">{{ formatCurrency(order.ongkir) }}</p>
              </div>
              <div class="flex justify-between border-t pt-2">
                <p class="text-gray-900 font-bold">Grand Total</p>
                <p class="text-2xl font-bold text-primary">{{ formatCurrency(order.grand_total) }}</p>
              </div>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="mb-8">
            <h4 class="text-lg font-bold mb-4">Info Pengiriman</h4>
            <div class="p-4 border border-gray-200 rounded-lg">
              <p class="font-medium">Alamat Pengiriman</p>
              <p class="text-gray-600 mt-1">{{ order.alamat_pengiriman }}</p>

              <div v-if="order.shipper" class="mt-4">
                <p class="font-medium">Kurir</p>
                <p class="text-gray-600">{{ order.shipper.shipper_name }}</p>
              </div>

              <div v-if="order.nomor_resi" class="mt-4">
                <p class="font-medium">Nomor Resi</p>
                <p class="text-gray-600">{{ order.nomor_resi }}</p>
              </div>
            </div>
          </div>

          <!-- UMKM Info -->
          <div class="mb-8">
            <h4 class="text-lg font-bold mb-4">Info UMKM</h4>
            <div class="flex items-center p-4 border border-gray-200 rounded-lg">
              <div class="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                <img
                  :src="order.umkm?.foto_logo || getPlaceholderImage()"
                  :alt="order.umkm?.nama_umkm"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="ml-4">
                <h5 class="font-bold">{{ order.umkm?.nama_umkm }}</h5>
                <p class="text-gray-600 text-sm">{{ order.umkm?.alamat }}</p>
                <p class="text-gray-600 text-sm">Telepon: {{ order.umkm?.telepon }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
              v-if="order.status === 'pending'"
              @click="$emit('cancel-order', order)"
              class="btn-outline px-6 py-3 text-red-600 border-red-600 hover:bg-red-50"
            >
              <i class="fas fa-times mr-2"></i> Batalkan Pesanan
            </button>
          <button
            v-if="order.status === 'delivered' && !order.has_rating"
            @click="openRating"
            class="btn-primary px-6 py-3"
          >
            <i class="fas fa-star mr-2"></i> Beri Rating
          </button>
          <button @click="close" class="btn-outline px-6 py-3">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'cancel-order', 'open-rating'])

const formattedEstimasi = computed(() => {
  if (props.order?.estimasi_pengiriman == null) return '-'
  return Number(props.order.estimasi_pengiriman).toString().replace(/\.0$/, '')
})

function close() {
  emit('close')
}

function openRating() {
  emit('open-rating', props.order)
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
    pending: 'Menunggu Pembayaran',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Selesai',
    cancelled: 'Dibatalkan'
  }
  return texts[status] || status
}

function formatDate(dateString) {
  const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
}

function getPlaceholderImage() {
  return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50;
}

.modal-container {
  @apply bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply sticky top-0 bg-white px-8 py-6 border-b border-gray-200 flex justify-between items-center z-10;
}

.modal-close-button {
  @apply text-gray-400 hover:text-gray-600 text-2xl;
}

.modal-body {
  @apply px-8 py-6;
}

.modal-footer {
  @apply sticky bottom-0 bg-white px-8 py-6 border-t border-gray-200 flex justify-end space-x-4;
}

.btn-outline {
  @apply border border-primary text-primary font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300;
}

.btn-primary {
  @apply bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary-light transition-all duration-300;
}

/* Transition effects */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
