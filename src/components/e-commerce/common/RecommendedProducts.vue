<template>
  <div v-if="products && products.length > 0" class="mt-12">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Rekomendasi untuk Anda</h2>

    <!-- Product Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition"
      >
        <router-link v-if="product.id" :to="`/products/${product.id}`" class="block">
          <div class="h-32 overflow-hidden rounded mb-3">
            <img
              :src="processImageUrl(product.foto)"
              :alt="product.nama_produk"
              class="w-full h-full object-cover"
            />

            <!-- Stock Indicator -->
            <div v-if="(product.stok || 0) <= 5" class="absolute top-2 right-2">
              <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {{ product.stok }} tersisa
              </span>
            </div>
          </div>
          <h4 class="font-medium text-gray-900 mb-2 line-clamp-2">{{ product.nama_produk || 'Produk' }}</h4>
          <div class="text-lg font-bold text-gray-900 mb-3">Rp {{ formatPrice(product.harga || 0) }}</div>
          <p class="text-xs text-gray-500">
            {{ product.category?.nama_kategori || 'Kategori' }}
          </p>
        </router-link>

        <button
          @click="$emit('add-to-cart', product)"
          :disabled="loading || (product.stok || 0) === 0"
          class="btn-primary w-full py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-4"
        >
          <template v-if="loading && loadingProductId === product.id">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            <span>Menambahkan...</span>
          </template>
          <template v-else>
            <i v-if="(product.stok || 0) > 0" class="fas fa-shopping-cart mr-2"></i>
            <i v-else class="fas fa-ban mr-2"></i>
            <span>{{ (product.stok || 0) > 0 ? '+ Keranjang' : 'Stok Habis' }}</span>
          </template>
        </button>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="showLoadMore && hasMoreProducts" class="text-center mt-8">
      <button
        @click="$emit('load-more')"
        class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
      >
        <i class="fas fa-chevron-down mr-2"></i>
        Tampilkan Lebih Banyak
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { formatPrice, processImageUrl } from '@/utils/helpers'

export default {
  name: 'RecommendedProducts',

  props: {
    products: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingProductId: {
      type: [String, Number],
      default: null
    },
    showLoadMore: {
      type: Boolean,
      default: true
    },
    hasMoreProducts: {
      type: Boolean,
      default: false
    }
  },

  emits: ['add-to-cart', 'load-more'],

  setup() {
    return {
      formatPrice,
      processImageUrl
    }
  }
}
</script>

<style scoped>
.btn-primary {
  @apply bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-all duration-300;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom positioning for stock badge */
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}
</style>
