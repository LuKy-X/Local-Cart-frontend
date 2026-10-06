<template>
  <div class="sticky top-24">
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 class="text-xl font-bold text-gray-900 mb-6">Ringkasan Belanja</h3>

      <!-- Selected Items Summary -->
      <div v-if="selectedItems.length > 0" class="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
        <div
          v-for="item in selectedItems"
          :key="item.id"
          class="flex items-start"
        >
          <div class="w-12 h-12 rounded overflow-hidden flex-shrink-0 mr-3">
            <img
              :src="processImageUrl(item.image)"
              :alt="item.name"
              class="w-full h-full object-cover"
            >
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900 line-clamp-1">{{ item.name }}</p>
            <p class="text-xs text-gray-600">{{ item.quantity }} x Rp {{ formatPrice(item.price) }}</p>
          </div>
          <div class="text-sm font-medium text-gray-900 ml-2">
            Rp {{ formatPrice(item.price * item.quantity) }}
          </div>
        </div>
      </div>

      <div v-else class="text-center py-4 mb-6 border border-dashed border-gray-300 rounded-lg">
        <i class="fas fa-shopping-cart text-gray-400 text-2xl mb-2"></i>
        <p class="text-gray-500 text-sm">Belum ada produk terpilih</p>
        <p class="text-gray-400 text-xs mt-1">Centang produk untuk melihat ringkasan</p>
      </div>

      <!-- Summary Details -->
      <div class="space-y-3 mb-6">
        <div class="flex justify-between">
          <span class="text-gray-600">Total Harga</span>
          <span class="font-medium">Rp {{ formatPrice(summary.selectedTotal) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Total Ongkos Kirim</span>
          <span class="font-medium">Rp {{ formatPrice(summary.shippingCost) }}</span>
        </div>
      </div>

      <!-- Total -->
      <div class="border-t border-gray-200 pt-4 mb-6">
        <div class="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span class="text-primary">Rp {{ formatPrice(summary.totalAmount) }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          {{ summary.selectedCount }} produk dari {{ summary.selectedUmkmCount }} toko
        </p>
      </div>

      <!-- Kecamatan Notice -->
      <div v-if="!hasKecamatan" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div class="flex items-start">
          <i class="fas fa-exclamation-circle text-yellow-500 mt-1 mr-3"></i>
          <div>
            <p class="text-sm text-yellow-800">
              <span class="font-semibold">Lengkapi profil Anda</span> untuk menghitung ongkos kirim.
            </p>
            <router-link
              to="/profile"
              class="text-yellow-600 text-sm font-medium mt-2 hover:text-yellow-800 inline-block"
            >
              Lengkapi Profil
            </router-link>
          </div>
        </div>
      </div>

      <!-- Checkout Button -->
      <button
        @click="$emit('checkout')"
        :disabled="isCheckoutDisabled"
        :class="[
          'w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center',
          isCheckoutDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'btn-secondary hover:bg-secondary-dark transform hover:scale-[1.02] active:scale-[0.98]'
        ]"
      >
        <i v-if="summary.selectedCount > 0" class="fas fa-shopping-bag mr-2"></i>
        {{ getCheckoutButtonText }}
      </button>

      <p v-if="summary.selectedCount > 0 && !hasKecamatan" class="text-red-500 text-sm mt-3 text-center">
        Lengkapi profil terlebih dahulu untuk checkout
      </p>
    </div>

    <!-- Security Info -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center text-sm text-gray-600">
        <i class="fas fa-shield-alt text-green-500 mr-3 text-lg"></i>
        <div>
          <p class="font-medium">Transaksi Aman & Terjamin</p>
          <p class="text-xs mt-1">Uang kamu dilindungi sampai barang sampai</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice, processImageUrl } from '@/utils/helpers'

export default {
  props: {
    selectedItems: Array,
    summary: Object,
    hasKecamatan: Boolean,
    isCheckoutDisabled: Boolean
  },

  computed: {
    getCheckoutButtonText() {
      if (this.summary.selectedCount === 0) return 'Pilih Produk'
      if (!this.hasKecamatan) return 'Lengkapi Profil'
      return `Checkout (${this.summary.selectedCount})`
    }
  },

  methods: {
    formatPrice,
    processImageUrl
  }
}
</script>
