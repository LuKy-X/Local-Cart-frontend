<template>
  <div
    :class="[
      'card overflow-hidden hover:shadow-lg transition-all duration-300 bg-white rounded-xl shadow-md',
      view === 'list' ? 'flex' : 'flex flex-col'
    ]"
  >
    <!-- Product Image -->
    <router-link
      :to="`/local-cart/products/${product.id}`"
      :class="[
        'relative overflow-hidden bg-gray-100 block',
        view === 'list' ? 'w-48 h-48 flex-shrink-0' : 'h-56'
      ]"
      @click="$emit('view-product', product)"
    >
      <!-- Loading Spinner -->
      <div
        v-if="!imageLoaded"
        class="absolute inset-0 flex items-center justify-center bg-gray-200"
      >
        <div class="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>

      <!-- Product Image -->
      <img
        v-show="imageLoaded"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        @load="imageLoaded = true"
        @error="handleImageError"
      />

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex flex-col space-y-2">
        <span v-if="product.isNew" class="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold">
          BARU
        </span>
        <span v-if="product.stock <= 5 && product.stock > 0" class="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">
          HAMPIR HABIS
        </span>
        <span v-if="product.stock === 0" class="bg-gray-500 text-white px-3 py-1 rounded text-sm font-bold">
          HABIS
        </span>
      </div>
    </router-link>

    <!-- Product Info -->
    <div :class="[
      'p-4 flex flex-col flex-grow',
      view === 'list' ? 'w-full' : ''
    ]">
      <!-- Seller -->
      <div class="flex items-center mb-2">
        <i class="fas fa-store text-gray-400 text-sm mr-2"></i>
        <span class="text-sm text-gray-600 truncate">{{ product.seller }}</span>
      </div>

      <!-- Product Name -->
      <router-link
        :to="`/local-cart/products/${product.id}`"
        class="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 hover:text-primary transition-colors"
        @click="$emit('view-product', product)"
      >
        {{ product.name }}
      </router-link>

      <!-- Rating -->
      <div class="flex items-center mb-3">
        <div class="flex items-center mr-2">
          <i
            v-for="n in 5"
            :key="n"
            :class="[
              'fas text-sm mr-1',
              n <= Math.floor(product.rating) ? 'fa-star text-yellow-400' :
              n === Math.ceil(product.rating) && product.rating % 1 !== 0 ? 'fa-star-half-alt text-yellow-400' :
              'far fa-star text-gray-300'
            ]"
          ></i>
        </div>
        <span class="text-gray-700 font-medium">{{ product.rating.toFixed(1) }}</span>
        <span class="text-gray-500 text-sm ml-2">({{ product.reviewCount }})</span>
      </div>

      <!-- Price -->
      <div class="mt-auto">
        <div class="flex items-center mb-3">
          <span class="text-2xl font-bold text-gray-900">Rp {{ formatPrice(product.harga) }}</span>
        </div>

        <!-- Stock Info -->
        <div v-if="product.stock <= 10" class="mb-3">
          <div class="flex items-center text-sm text-gray-600">
            <i class="fas fa-box text-gray-400 mr-2"></i>
            <span>Tersisa {{ product.stock }} buah</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-2">
          <button
            @click="handleAddToCart"
            :disabled="product.stock === 0 || isLoading"
            :class="[
              'btn-primary flex-grow flex items-center justify-center py-3 rounded-lg font-medium transition-colors duration-300',
              (product.stock === 0 || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
            ]"
          >
            <template v-if="isLoading">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              <span>Menambahkan...</span>
            </template>
            <template v-else>
              <i class="fas fa-cart-plus mr-2"></i>
              <span>{{ product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis' }}</span>
            </template>
          </button>
          <button
            v-if="view === 'list'"
            @click="$emit('view-product', product)"
            class="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i class="fas fa-eye text-gray-600"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({
        id: null,
        name: '',
        seller: '',
        harga: 0,
        rating: 0,
        reviewCount: 0,
        image: '',
        isFavorite: false,
        stock: 0,
        salesCount: 0,
        isNew: false
      })
    },
    view: {
      type: String,
      default: 'grid',
      validator: value => ['grid', 'list'].includes(value)
    }
  },
  data() {
    return {
      imageLoaded: false,
      isLoading: false
    }
  },
  watch: {
    // Reset loader saat produk berubah
    'product.image'() {
      this.imageLoaded = false
    }
  },
  methods: {
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    handleImageError(event) {
      event.target.src = this.getPlaceholderImage()
      this.imageLoaded = true
    },

    getPlaceholderImage() {
      return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },

    async handleAddToCart() {
      if (this.product.stock === 0 || this.isLoading) return

      this.isLoading = true

      try {
        // Emit event ke parent component
        this.$emit('add-to-cart', this.product)

        // Tambahkan animasi feedback
        const button = event.target.closest('button')
        if (button) {
          button.classList.add('bg-green-500')
          setTimeout(() => {
            button.classList.remove('bg-green-500')
          }, 500)
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
      } finally {
        // Beri delay singkat agar loading state terlihat
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      }
    }
  },
  emits: ['add-to-cart', 'toggle-favorite', 'view-product']
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-4px);
}

.btn-primary {
  background-color: #1C3FAA;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #152b7c;
}

/* Animasi untuk feedback tambah ke keranjang */
.bg-green-500 {
  background-color: #10B981 !important;
  transition: background-color 0.3s ease;
}
</style>
