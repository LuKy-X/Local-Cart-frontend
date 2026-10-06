<template>
  <div class="cart-page">
    <div class="container-custom py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Keranjang</h1>
      <p class="text-gray-600 mb-8">Kelola produk yang ingin kamu beli</p>

      <!-- Loading State -->
      <div v-if="loading && (!carts || carts.length === 0)" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600">Memuat keranjang...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error && (!carts || carts.length === 0)" class="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <div class="flex items-center">
          <i class="fas fa-exclamation-circle text-red-500 text-xl mr-3"></i>
          <div>
            <h3 class="font-semibold text-red-800">Gagal memuat keranjang</h3>
            <p class="text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
        <button @click="fetchCart" class="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
          Coba Lagi
        </button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Cart Items -->
        <div class="lg:col-span-2">
          <!-- Select All -->
          <div v-if="cartByUmkm && cartByUmkm.length > 0" class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div class="flex items-center justify-between">
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="h-5 w-5 text-primary rounded focus:ring-primary border-gray-300"
                >
                <span class="ml-3 font-medium text-gray-900">
                  Pilih Semua ({{ selectedItemsCount || 0 }}/{{ allItemIds.length || 0 }})
                </span>
              </label>
              <button
                @click="removeSelectedItems"
                :disabled="selectedItemsCount === 0"
                class="text-red-500 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-trash mr-2"></i> Hapus Terpilih
              </button>
            </div>
          </div>

          <!-- Empty Cart State -->
          <div v-if="!cartByUmkm || cartByUmkm.length === 0" class="bg-white rounded-xl shadow-lg p-12 text-center">
            <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
              <i class="fas fa-shopping-cart text-6xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Keranjang Kosong</h3>
            <p class="text-gray-600 mb-8">Tambahkan produk ke keranjang untuk memulai belanja</p>
            <router-link to="/local-cart/products" class="btn-primary inline-flex items-center px-6 py-3">
              <i class="fas fa-shopping-bag mr-2"></i> Mulai Belanja
            </router-link>
          </div>

          <!-- Cart Items by UMKM -->
          <div v-else class="space-y-6">
            <div
              v-for="umkm in cartByUmkm"
              :key="umkm.id"
              class="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <!-- UMKM Header -->
              <div class="p-6 border-b border-gray-200 bg-gray-50">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    :checked="isUmkmSelected(umkm.id)"
                    @change="() => toggleUmkmSelection(umkm.id)"
                    class="h-4 w-4 text-primary rounded focus:ring-primary border-gray-300"
                  >
                  <div class="flex items-center ml-4 flex-1">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      <img
                        :src="processImageUrl(umkm.image)"
                        :alt="umkm.name"
                        class="w-full h-full object-cover"
                      >
                    </div>
                    <div class="ml-3">
                      <h3 class="font-semibold text-gray-900">{{ umkm.name || 'UMKM' }}</h3>
                      <p class="text-sm text-gray-600">{{ umkm.location || '' }}</p>
                    </div>
                  </div>
                  <router-link
                    v-if="umkm.id"
                    :to="`/local-cart/umkm/${umkm.id}`"
                    class="text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    Lihat Toko
                  </router-link>
                </div>
              </div>

              <!-- Products List -->
              <div class="divide-y divide-gray-200">
                <div
                  v-for="item in umkm.items"
                  :key="item.id"
                  class="p-6 hover:bg-gray-50 transition"
                >
                  <div class="flex">
                    <!-- Checkbox -->
                    <div class="flex items-start mr-4">
                      <input
                        type="checkbox"
                        :checked="selectedItems.includes(item.id)"
                        @change="() => toggleItemSelection(item.id)"
                        class="h-5 w-5 text-primary rounded focus:ring-primary border-gray-300 mt-1"
                      >
                    </div>

                    <!-- Product Image -->
                    <router-link
                      v-if="item.product"
                      :to="`/products/${item.product.id}`"
                      class="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 mr-4"
                    >
                      <img
                        :src="processImageUrl(item.image)"
                        :alt="item.name"
                        class="w-full h-full object-cover"
                      >
                    </router-link>
                    <div v-else class="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 mr-4 bg-gray-200"></div>

                    <!-- Product Info -->
                    <div class="flex-1">
                      <div class="flex justify-between">
                        <div class="flex-1">
                          <router-link
                            v-if="item.product"
                            :to="`/products/${item.product.id}`"
                            class="font-medium text-gray-900 hover:text-primary transition"
                          >
                            {{ item.name || 'Produk tidak ditemukan' }}
                          </router-link>
                          <p v-else class="font-medium text-gray-900">{{ item.name || 'Produk tidak ditemukan' }}</p>
                          <p class="text-sm text-gray-600 mb-2">{{ item.variant || '' }}</p>
                          <div class="flex items-center text-sm text-gray-600">
                            <span :class="{'text-red-500 font-semibold': (item.stock || 0) < 5}">
                              Stok: {{ item.stock || 0 }}
                            </span>
                            <span v-if="(item.stock || 0) < 5" class="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Stok terbatas
                            </span>
                          </div>
                        </div>
                        <div class="text-right ml-4">
                          <div class="text-xl font-bold text-gray-900 mb-2">
                            Rp {{ formatPrice(item.price) }}
                          </div>
                          <div class="text-sm text-gray-500">
                            Subtotal: Rp {{ formatPrice((item.price || 0) * (item.quantity || 0)) }}
                          </div>
                        </div>
                      </div>

                      <!-- Quantity Controls -->
                      <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center">
                          <button
                            @click="() => decreaseQuantity(item)"
                            :disabled="item.quantity <= 1 || isItemUpdating(item.id)"
                            :class="[
                              'w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-lg transition',
                              item.quantity <= 1 || isItemUpdating(item.id)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                            ]"
                          >
                            <i v-if="!isItemUpdating(item.id)" class="fas fa-minus text-sm"></i>
                            <i v-else class="fas fa-spinner fa-spin text-sm"></i>
                          </button>
                          <span class="w-12 h-8 flex items-center justify-center border-y border-gray-300 font-medium">
                            {{ item.quantity || 0 }}
                          </span>
                          <button
                            @click="() => increaseQuantity(item)"
                            :disabled="(item.quantity || 0) >= (item.stock || 0) || isItemUpdating(item.id)"
                            :class="[
                              'w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-lg transition',
                              (item.quantity || 0) >= (item.stock || 0) || isItemUpdating(item.id)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                            ]"
                          >
                            <i v-if="!isItemUpdating(item.id)" class="fas fa-plus text-sm"></i>
                            <i v-else class="fas fa-spinner fa-spin text-sm"></i>
                          </button>
                          <div class="ml-4 flex flex-col">
                            <span class="text-sm text-gray-600">
                              Rp {{ formatPrice((item.price || 0) * (item.quantity || 0)) }}
                            </span>
                            <span v-if="isItemUpdating(item.id)" class="text-xs text-blue-500">
                              Memperbarui...
                            </span>
                          </div>
                        </div>
                        <button
                          @click="() => removeItem(item)"
                          :disabled="isItemUpdating(item.id)"
                          :class="[
                            'p-2 rounded-lg transition',
                            isItemUpdating(item.id)
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                          ]"
                          title="Hapus dari keranjang"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- UMKM Footer -->
              <div class="p-6 border-t border-gray-200 bg-gray-50">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">
                    {{ (umkm.items && umkm.items.length) || 0 }} produk • Total untuk {{ umkm.name || 'UMKM' }}:
                  </span>
                  <span class="text-xl font-bold text-gray-900">
                    Rp {{ formatPrice(umkm.total || 0) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommended Products -->
          <div v-if="recommendedProducts && recommendedProducts.length > 0" class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Rekomendasi untuk Anda</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="product in recommendedProducts"
                :key="product.id"
                class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition"
              >
                <router-link v-if="product.id" :to="`/products/${product.id}`" class="block">
                  <div class="h-32 overflow-hidden rounded mb-3">
                    <img
                      :src="processImageUrl(product.foto)"
                      :alt="product.nama_produk"
                      class="w-full h-full object-cover"
                    >
                  </div>
                  <h4 class="font-medium text-gray-900 mb-2 line-clamp-2">{{ product.nama_produk || 'Produk' }}</h4>
                  <div class="text-lg font-bold text-gray-900 mb-3">Rp {{ formatPrice(product.harga || 0) }}</div>
                </router-link>
                <button
                  @click="() => addRecommendedProduct(product)"
                  :disabled="loading"
                  class="btn-primary w-full py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                  <span>+ Keranjang</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Order Summary (Sticky) -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 class="text-xl font-bold text-gray-900 mb-6">Ringkasan Belanja</h3>

              <!-- Selected Items Summary -->
              <div v-if="selectedCartItems && selectedCartItems.length > 0" class="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                <div
                  v-for="item in selectedCartItems"
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
                    <p class="text-sm text-gray-900 line-clamp-1">{{ item.name || 'Produk' }}</p>
                    <p class="text-xs text-gray-600">{{ item.quantity || 0 }} x Rp {{ formatPrice(item.price || 0) }}</p>
                  </div>
                  <div class="text-sm font-medium text-gray-900 ml-2">
                    Rp {{ formatPrice((item.price || 0) * (item.quantity || 0)) }}
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
                  <span class="font-medium">Rp {{ formatPrice(selectedItemsTotal || 0) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Total Ongkos Kirim</span>
                  <span class="font-medium">Rp {{ formatPrice(shippingCost || 0) }}</span>
                </div>
              </div>

              <!-- Total -->
              <div class="border-t border-gray-200 pt-4 mb-6">
                <div class="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span class="text-primary">Rp {{ formatPrice(totalAmount || 0) }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  {{ selectedItemsCount || 0 }} produk dari {{ selectedUmkmIds.length || 0 }} toko
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
                @click="openCheckoutModal"
                :disabled="selectedItemsCount === 0 || !hasKecamatan"
                :class="[
                  'w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center',
                  selectedItemsCount === 0 || !hasKecamatan
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-secondary hover:bg-secondary-dark'
                ]"
              >
                <i class="fas fa-shopping-bag mr-2"></i>
                {{ checkoutButtonText }}
              </button>


              <p v-if="selectedItemsCount > 0 && !hasKecamatan" class="text-red-500 text-sm mt-3 text-center">
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
        </div>
      </div>
    </div>
  </div>

  <!-- Checkout Confirmation Modal -->
  <div
    v-if="showCheckoutModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-scale-in">
      <h3 class="text-xl font-bold text-gray-900 mb-4">
        Konfirmasi Checkout
      </h3>

      <div class="space-y-3 text-sm text-gray-700 mb-6">
        <div class="flex justify-between">
          <span>Total Produk</span>
          <span class="font-medium">{{ selectedItemsCount }}</span>
        </div>
        <div class="flex justify-between">
          <span>Total UMKM</span>
          <span class="font-medium">{{ selectedUmkmIds.length }}</span>
        </div>
        <div class="flex justify-between border-t pt-3 text-base font-bold">
          <span>Total Bayar</span>
          <span class="text-primary">
            Rp {{ formatPrice(totalAmount) }}
          </span>
        </div>
      </div>

      <p class="text-xs text-gray-500 mb-6">
        Pesanan akan diproses menjadi beberapa order sesuai UMKM.
      </p>

      <div class="flex gap-3">
        <button
          @click="closeCheckoutModal"
          class="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Batal
        </button>

        <button
          @click="confirmCheckout"
          :disabled="isCheckingOut"
          class="flex-1 py-3 rounded-xl font-bold text-white bg-secondary hover:bg-secondary-dark flex items-center justify-center"
        >
          <i v-if="isCheckingOut" class="fas fa-spinner fa-spin mr-2"></i>
          Ya, Checkout
        </button>
      </div>
    </div>
  </div>

</template>

<script>
import { mapState, mapActions, mapGetters } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Cart',

  data() {
    return {
      shippingTimeout: null,
      showCheckoutModal: false,
      isCheckingOut: false
    }
  },

  computed: {
    ...mapState(useCartStore, [
      'carts',
      'selectedItems',
      'shippingCosts',
      'loading',
      'error',
      'recommendedProducts'
    ]),

    ...mapGetters(useCartStore, [
      'cartByUmkm',
      'selectedItemsCount',
      'selectedCartItems',
      'selectedItemsTotal',
      'shippingCost',
      'totalAmount',
      'hasKecamatan',
      'allItemIds',
      'isAllSelected',
      'selectedUmkmIds',
      'shippingDetails',
      'checkoutButtonText',
      'umkmNames',
      'isItemUpdating',
      'isUmkmSelected'
    ]),

    ...mapState(useAuthStore, ['user']),

    formatPrice() {
      return (price) => {
        const cartStore = useCartStore()
        return cartStore.formatPrice(price)
      }
    },

  },

  methods: {
    openCheckoutModal() {
      this.showCheckoutModal = true
    },

    closeCheckoutModal() {
      this.showCheckoutModal = false
    },

    async confirmCheckout() {
      this.isCheckingOut = true
      const result = await this.checkout()
      this.isCheckingOut = false
      this.showCheckoutModal = false
      return result
    },

    ...mapActions(useCartStore, [
      'fetchCart',
      'calculateShipping',
      'removeSelectedItems',
      'toggleSelectAll',
      'toggleUmkmSelection',
      'toggleItemSelection',
      'fetchRecommendedProducts',
      'increaseQuantity',
      'decreaseQuantity',
      'removeItem',
      'addRecommendedProduct',
      'checkoutWithConfirmation',
      'checkout',
      'formatPrice',
      'processImageUrl',
    ]),

     ...mapActions(useCartStore, ['processImageUrl', 'formatPrice']),

    isItemSelected(itemId) {
      return this.selectedItems.includes(itemId)
    },
  },

  async mounted() {
    await this.fetchCart()
    await this.fetchRecommendedProducts()
  },

  watch: {
    selectedItems: {
      handler(newItems) {
        if (newItems?.length > 0) {
          clearTimeout(this.shippingTimeout)
          this.shippingTimeout = setTimeout(() => {
            this.calculateShipping()
          }, 500)
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
/* Styles tetap sama seperti sebelumnya */
.cart-page {
  min-height: calc(100vh - 140px);
}

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

.sticky {
  position: sticky;
}

.btn-primary {
  @apply bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-all duration-300;
}

.btn-secondary {
  @apply bg-secondary text-white font-semibold px-4 py-2 rounded-lg hover:bg-secondary-dark transition-all duration-300;
}

.max-h-64::-webkit-scrollbar {
  width: 4px;
}

.max-h-64::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.max-h-64::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.max-h-64::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

button:active:not(:disabled) {
  transform: scale(0.95);
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

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

</style>
