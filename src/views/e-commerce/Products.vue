<template>
  <div class="products-page">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary to-primary-light py-12">
      <div class="container-custom">
        <div class="text-center text-white">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Semua Produk</h1>
          <p class="text-xl opacity-90">Temukan produk terbaik dari UMKM lokal</p>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section class="py-12">
      <div class="container-custom">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Filters -->
          <div class="lg:w-1/4">
            <ProductFilter v-model="filters" @update:modelValue="fetchProducts" />
          </div>

          <!-- Products Grid -->
          <div class="lg:w-3/4">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Produk UMKM</h2>
                <p class="text-gray-600">{{ totalProducts }} produk ditemukan</p>
              </div>

              <!-- Sort -->
              <div class="mt-4 md:mt-0">
                <select
                  v-model="sortBy"
                  @change="handleSortChange"
                  class="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="newest">Terbaru</option>
                  <option value="price_low">Harga: Rendah ke Tinggi</option>
                  <option value="price_high">Harga: Tinggi ke Rendah</option>
                  <option value="rating">Rating Tertinggi</option>
                  <option value="popular">Terlaris</option>
                </select>
              </div>
            </div>

            <!-- Products Grid -->
            <div v-if="!productStore.loading && productStore.allProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductCard
                v-for="product in productStore.allProducts"
                :key="product.id"
                :product="formatProduct(product)"
                @toggle-favorite="toggleFavorite"
                @view-product="trackProductView"
                @add-to-cart="handleAddToCartFromRecommendation"
              />
            </div>

            <!-- Loading State -->
            <div v-if="productStore.loading" class="col-span-full text-center py-12">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p class="mt-4 text-gray-600">Memuat produk...</p>
            </div>

            <!-- Empty State -->
            <div v-if="!productStore.loading && productStore.allProducts.length === 0" class="col-span-full text-center py-12">
              <div class="mx-auto w-24 h-24 text-gray-400 mb-4">
                <i class="fas fa-search text-6xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Produk tidak ditemukan</h3>
              <p class="text-gray-600">Coba ubah filter pencarian Anda</p>
              <button
                @click="clearFilters"
                class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Hapus Filter
              </button>
            </div>

            <!-- Load More -->
            <div v-if="productStore.hasMoreProducts && !productStore.loading" class="text-center mt-12">
              <button
                @click="loadMoreProducts"
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
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/public-products'
import { useNotificationStore } from '@/stores/notification'
import ProductCard from '@/components/e-commerce/common/ProductCard.vue'
import ProductFilter from '@/components/e-commerce/common/ProductFilter.vue'

const productStore = useProductStore()
const notificationStore = useNotificationStore()

// Reactive data
const filters = ref({})
const sortBy = ref('newest')
const loadingMore = ref(false)
const currentPage = ref(1)
const viewMode = ref('grid')

// Computed
const products = computed(() => productStore.allProducts)
const totalProducts = computed(() => productStore.allProducts.length)

// Methods
async function fetchProducts() {
  const params = {
    ...filters.value,
    sort_by: sortBy.value,
    page: currentPage.value
  }

  // Clean up empty params
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === '' || (Array.isArray(params[key]) && params[key].length === 0)) {
      delete params[key]
    }
  })

  console.log("filter value: ", filters.value)

  await productStore.fetchProducts(params)
}

async function loadMoreProducts() {
  loadingMore.value = true
  try {
    const params = {
      ...filters.value,
      sort_by: sortBy.value
    }

    await productStore.fetchMoreProducts(params)
  } catch (error) {
    console.error('Error loading more products:', error)
  } finally {
    loadingMore.value = false
  }
}

function handleSortChange() {
  currentPage.value = 1
  fetchProducts()
}

function formatProduct(product) {
  const isNew = isProductNew(product.created_at)

  return {
    id: product.id,
    name: product.nama_produk,
    seller: product.umkm?.nama_umkm || 'UMKM Lokal',
    harga: product.harga,
    originalPrice: null,
    discount: 0,
    rating: product.average_rating || 0,
    reviewCount: product.total_ratings || 0,
    image: product.foto || getPlaceholderImage(),
    isFavorite: false,
    isNew: isNew,
    stock: product.stok
  }
}

function isProductNew(createdAt) {
  if (!createdAt) return false
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return new Date(createdAt) > oneWeekAgo
}

function getPlaceholderImage() {
  return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
}


function toggleFavorite(product) {
  product.isFavorite = !product.isFavorite
  const message = product.isFavorite
    ? `${product.name} ditambahkan ke favorit`
    : `${product.name} dihapus dari favorit`
  emitNotification('info', message)
}

async function trackProductView(product) {
  try {
    await productStore.trackProductView({
      productId: product.id,
      data: {}
    })
  } catch (error) {
    console.error('Error tracking view:', error)
  }
}

function clearFilters() {
  filters.value = {}
  sortBy.value = 'newest'
  fetchProducts()
}

function emitNotification(type, message) {
  const event = new CustomEvent('show-notification', {
    detail: { type, message }
  })
  window.dispatchEvent(event)
}

async function handleAddToCartFromRecommendation(product) {
  try {
    await productStore.addToCart(product.id, 1)
    notificationStore.showNotification({
      type: 'success',
      message: `${product.name} ditambahkan ke keranjang`
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    notificationStore.showNotification({
      type: 'error',
      message: error.message || 'Gagal menambahkan ke keranjang'
    })
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Load initial data
  await Promise.all([
    fetchProducts(),
    productStore.fetchCategories(),
    productStore.fetchKecamatans()
  ])
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
}

.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.btn-outline {
  @apply border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors;
}
</style>
