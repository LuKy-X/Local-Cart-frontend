<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
  >
    <div
      class="bg-white rounded-2xl w-full max-w-md shadow-xl animate-scale-in"
      :class="sizeClass"
    >
      <!-- Modal Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">
            <i v-if="icon" :class="icon" class="mr-3" :style="{ color: iconColor }"></i>
            {{ title }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p v-if="subtitle" class="text-gray-600 text-sm mt-2">{{ subtitle }}</p>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <!-- Default slot for custom content -->
        <slot name="body">
          <div v-if="type === 'cancel-order'" class="space-y-4">
            <div class="flex items-center p-4 bg-yellow-50 rounded-lg">
              <i class="fas fa-exclamation-triangle text-yellow-500 text-xl mr-3"></i>
              <p class="text-yellow-700">
                Apakah Anda yakin ingin membatalkan pesanan <span class="font-bold">{{ data?.kode_order }}</span>?
              </p>
            </div>
            <div class="space-y-3 text-sm text-gray-700">
              <div class="flex justify-between">
                <span>Total Pesanan</span>
                <span class="font-medium">{{ formatCurrency(data?.grand_total) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Jumlah Item</span>
                <span class="font-medium">{{ data?.order_items_count }} produk</span>
              </div>
              <div class="flex justify-between">
                <span>UMKM</span>
                <span class="font-medium">{{ data?.umkm?.nama_umkm }}</span>
              </div>
            </div>
            <p class="text-xs text-red-500 mt-3">
              <i class="fas fa-info-circle mr-1"></i>
              Pesanan yang sudah dibatalkan tidak dapat dikembalikan
            </p>
          </div>

          <div v-else-if="type === 'delete-cart'" class="space-y-4">
            <div class="flex items-center p-4 bg-red-50 rounded-lg">
              <i class="fas fa-trash-alt text-red-500 text-xl mr-3"></i>
              <p class="text-red-700">
                Hapus {{ data?.count }} item dari keranjang?
              </p>
            </div>
            <p class="text-sm text-gray-600">
              Item yang dihapus akan dikeluarkan dari keranjang belanja Anda.
            </p>
          </div>

          <div v-else-if="type === 'clear-cart'" class="space-y-4">
            <div class="flex items-center p-4 bg-red-50 rounded-lg">
              <i class="fas fa-shopping-cart text-red-500 text-xl mr-3"></i>
              <p class="text-red-700 font-medium">
                Kosongkan Keranjang?
              </p>
            </div>
            <p class="text-sm text-gray-600">
              Semua item di keranjang belanja Anda akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <div v-else-if="type === 'logout'" class="space-y-4">
            <div class="flex items-center p-4 bg-blue-50 rounded-lg">
              <i class="fas fa-sign-out-alt text-blue-500 text-xl mr-3"></i>
              <p class="text-blue-700">
                Keluar dari akun Anda?
              </p>
            </div>
            <p class="text-sm text-gray-600">
              Anda perlu masuk kembali untuk mengakses fitur yang terbatas.
            </p>
          </div>

          <div v-else-if="type === 'remove-address'" class="space-y-4">
            <div class="flex items-center p-4 bg-red-50 rounded-lg">
              <i class="fas fa-map-marker-alt text-red-500 text-xl mr-3"></i>
              <p class="text-red-700">
                Hapus alamat ini?
              </p>
            </div>
            <div class="text-sm text-gray-700">
              <p class="font-medium">{{ data?.label }}</p>
              <p class="text-gray-600 mt-1">{{ data?.address }}</p>
            </div>
          </div>

          <div v-else-if="type === 'delete-product'" class="space-y-4">
            <div class="flex items-center p-4 bg-red-50 rounded-lg">
              <i class="fas fa-box text-red-500 text-xl mr-3"></i>
              <p class="text-red-700">
                Hapus produk "{{ data?.name }}"?
              </p>
            </div>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex justify-between">
                <span>Stok Tersedia</span>
                <span class="font-medium">{{ data?.stock }} unit</span>
              </div>
              <div class="flex justify-between">
                <span>Harga</span>
                <span class="font-medium">{{ formatCurrency(data?.price) }}</span>
              </div>
            </div>
            <p class="text-xs text-red-500 mt-3">
              <i class="fas fa-info-circle mr-1"></i>
              Produk yang dihapus tidak dapat dikembalikan
            </p>
          </div>

          <div v-else-if="type === 'custom'" class="space-y-4">
            <!-- Custom content will be passed via slot -->
            <slot></slot>
          </div>

          <div v-else class="text-center py-4">
            <p class="text-gray-700">{{ message }}</p>
          </div>
        </slot>
      </div>

      <!-- Modal Footer -->
      <div class="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        <div class="flex gap-3">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 py-3 rounded-xl font-medium border transition-all"
            :class="[
              variant === 'danger'
                ? 'border-red-300 text-red-700 hover:bg-red-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
            :disabled="loading"
          >
            {{ cancelText }}
          </button>

          <button
            type="button"
            @click="confirmAction"
            class="flex-1 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center"
            :class="[
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : variant === 'warning'
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : variant === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-secondary hover:bg-secondary-dark'
            ]"
            :disabled="loading"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else-if="confirmIcon" :class="confirmIcon" class="mr-2"></i>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['confirm', 'close'])

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Konfirmasi'
  },
  subtitle: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: 'Apakah Anda yakin ingin melanjutkan?'
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default',
      'cancel-order',
      'delete-cart',
      'clear-cart',
      'logout',
      'remove-address',
      'delete-product',
      'custom'
    ].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'danger', 'warning', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  confirmText: {
    type: String,
    default: 'Ya, Lanjutkan'
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  icon: {
    type: String,
    default: ''
  },
  confirmIcon: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

const sizeClass = computed(() => {
  const classes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  }
  return classes[props.size]
})

const iconColor = computed(() => {
  const colors = {
    danger: '#dc2626',
    warning: '#f59e0b',
    success: '#10b981',
    default: '#4f46e5'
  }
  return colors[props.variant]
})

function closeModal() {
  emit('close')
}

function confirmAction() {
  emit('confirm', props.data)
}

function formatCurrency(amount) {
  if (!amount) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
}
</script>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
