<template>
  <div class="home">
    <!-- Carousel Section -->
    <Carousel />

    <!-- Products Tabs Section -->
    <section class="py-12">
      <div class="container-custom">
        <!-- Tabs Navigation -->
        <div class="flex space-x-1 border-b border-gray-200 mb-8 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="changeTab(tab.id)"
            :class="[
              'px-6 py-3 font-medium text-lg whitespace-nowrap',
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ tab.name }}
            <span v-if="getTabCount(tab.id)" class="ml-2 text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {{ getTabCount(tab.id) }}
            </span>
          </button>
        </div>

        <!-- Tab Content -->
        <div>
          <!-- Featured Products -->
          <div v-if="activeTab === 'featured'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <ProductCard
              v-for="product in productStore.featuredProducts"
              :key="product.id"
              :product="formatProduct(product)"
              @toggle-favorite="toggleFavorite"
              @view-product="trackProductView"
              @add-to-cart="handleAddToCartFromRecommendation"
            />
          </div>

          <!-- New Products -->
          <div v-if="activeTab === 'new'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <ProductCard
              v-for="product in productStore.newProducts"
              :key="product.id"
              :product="formatProduct(product)"
              @toggle-favorite="toggleFavorite"
              @view-product="trackProductView"
              @add-to-cart="handleAddToCartFromRecommendation"
            />
          </div>

          <!-- Popular Products -->
          <div v-if="activeTab === 'popular'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <ProductCard
              v-for="product in productStore.popularProducts"
              :key="product.id"
              :product="formatProduct(product)"
              @toggle-favorite="toggleFavorite"
              @view-product="trackProductView"
              @add-to-cart="handleAddToCartFromRecommendation"
            />
          </div>

          <!-- Most Viewed Products -->
          <div v-if="activeTab === 'most_viewed'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <ProductCard
              v-for="product in productStore.mostViewedProducts"
              :key="product.id"
              :product="formatProduct(product)"
              @toggle-favorite="toggleFavorite"
              @view-product="trackProductView"
              @add-to-cart="handleAddToCartFromRecommendation"
            />
          </div>

          <!-- Loading State -->
          <div v-if="productStore.loading && getCurrentProducts.length === 0" class="col-span-full text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p class="mt-4 text-gray-600">Memuat produk...</p>
          </div>

          <!-- Empty State -->
          <div v-if="!productStore.loading && getCurrentProducts.length === 0" class="col-span-full text-center py-12">
            <div class="mx-auto w-24 h-24 text-gray-400 mb-4">
              <i class="fas fa-box-open text-6xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada produk</h3>
            <p class="text-gray-600">Produk akan segera tersedia</p>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="showLoadMore" class="text-center mt-12">
          <button
            @click="loadMoreProducts"
            class="btn-outline px-8 py-3 text-lg font-medium"
            :disabled="loadingMore"
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

    <!-- Stats Banner -->
    <section class="py-12 bg-gradient-to-r from-primary to-primary-light">
      <div class="container-custom">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="flex flex-col md:flex-row items-center">
            <div class="md:w-2/5 p-8 md:p-12">
              <h3 class="text-3xl font-bold text-gray-900 mb-4">Dukung UMKM Lokal</h3>
              <p class="text-gray-600 text-lg mb-6">
                Temukan produk berkualitas langsung dari pengusaha lokal di daerah Anda.
                Dukung perekonomian lokal dengan belanja di LocalCart!
              </p>
              <div class="flex items-center space-x-4 mb-8">
                <div class="text-center">
                  <div class="text-3xl font-bold text-primary bg-blue-50 rounded-lg px-4 py-2">{{ stats.umkmCount || '0' }}</div>
                  <div class="text-sm text-gray-600 mt-1">UMKM Terdaftar</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-primary bg-blue-50 rounded-lg px-4 py-2">{{ stats.productCount || '0' }}</div>
                  <div class="text-sm text-gray-600 mt-1">Produk</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-primary bg-blue-50 rounded-lg px-4 py-2">{{ stats.categoryCount || '0' }}</div>
                  <div class="text-sm text-gray-600 mt-1">Kategori</div>
                </div>
              </div>
              <router-link
                to="/local-cart/products"
                class="btn-secondary inline-flex items-center px-8 py-3 rounded-lg font-semibold"
              >
                Jelajahi Semua Produk <i class="fas fa-arrow-right ml-2"></i>
              </router-link>
            </div>
            <div class="md:w-3/5">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="UMKM Lokal"
                class="w-full h-64 md:h-96 object-cover"
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-12 bg-gray-50">
      <div class="container-custom">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Kategori Produk</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
          >
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center">
              <i class="fas fa-tags text-white text-2xl"></i>
            </div>
            <h3 class="font-medium text-gray-900">{{ category.nama_kategori }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ category.products_count || 0 }} produk</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/public-products'
import { useNotificationStore } from '@/stores/notification'
import Carousel from '@/components/e-commerce/common/Carousel.vue'
import ProductCard from '@/components/e-commerce/common/ProductCard.vue'

const router = useRouter()
const productStore = useProductStore()
const notificationStore = useNotificationStore()

// Reactive data
const activeTab = ref('featured')
const loadingMore = ref(false)
const showLoadMore = ref(true)
const stats = ref({
  umkmCount: 0,
  productCount: 0,
  categoryCount: 0
})
const categories = ref([])

const tabs = [
  { id: 'featured', name: 'Produk Unggulan' },
  { id: 'new', name: 'Produk Terbaru' },
  { id: 'popular', name: 'Terlaris' },
  { id: 'most_viewed', name: 'Paling Banyak Dilihat' }
]

// Computed
const getCurrentProducts = computed(() => {
  switch (activeTab.value) {
    case 'featured':
      return productStore.featuredProducts
    case 'new':
      return productStore.newProducts
    case 'popular':
      return productStore.popularProducts
    case 'most_viewed':
      return productStore.mostViewedProducts
    default:
      return []
  }
})

// Methods
async function changeTab(tabId) {
  activeTab.value = tabId
  showLoadMore.value = true

  // Load data for the tab if not already loaded
  if (getCurrentProducts.value.length === 0) {
    await loadTabData()
  }
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

async function loadTabData() {
  try {
    switch (activeTab.value) {
      case 'featured':
        await productStore.fetchFeaturedProducts()
        break
      case 'new':
        await productStore.fetchNewProducts()
        break
      case 'popular':
        await productStore.fetchPopularProducts()
        break
      case 'most_viewed':
        await productStore.fetchMostViewedProducts()
        break
    }
  } catch (error) {
    console.error('Error loading products:', error)
    emitNotification('error', 'Gagal memuat produk')
  }
}

function getTabCount(tabId) {
  const products = productStore[`${tabId}Products`]
  return products ? products.length : 0
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
    image: product.foto || getPlaceholderImage(product.category_id),
    isFavorite: false,
    isNew: isNew,
    stock: product.stok,
    umkmId: product.umkm_id,
    categoryId: product.category_id
  }
}

function isProductNew(createdAt) {
  if (!createdAt) return false
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return new Date(createdAt) > oneWeekAgo
}

function getPlaceholderImage(categoryId) {
  const placeholders = {
    1: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    2: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    3: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
  return placeholders[categoryId] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
}


function toggleFavorite(product) {
  product.isFavorite = !product.isFavorite
  const message = product.isFavorite
    ? `${product.name} ditambahkan ke favorit`
    : `${product.name} dihapus dari favorit`
  emitNotification('info', message)
}

async function loadMoreProducts() {
  loadingMore.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Implement load more logic here
  } catch (error) {
    console.error('Error loading more products:', error)
  } finally {
    loadingMore.value = false
  }
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


async function loadStats() {
  try {
    stats.value.categoryCount = productStore.categoryCount

    stats.value.umkmCount = `${productStore.umkmCount - 1}+`

    stats.value.productCount = `${productStore.productCount - 1}+`

    categories.value = productStore.categories

  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

function emitNotification(type, message) {
  // Dispatch notification event
  const event = new CustomEvent('show-notification', {
    detail: { type, message }
  })
  window.dispatchEvent(event)
}

// Lifecycle hooks
onMounted(async () => {
  // Load initial data
  await productStore.home()
  await loadStats()
  await loadTabData()
})
</script>

<style scoped>
.home {
  overflow-x: hidden;
}

.category-card {
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-2px);
}

.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark transition-colors;
}

.btn-secondary {
  @apply bg-secondary text-white hover:bg-secondary-dark transition-colors;
}

.btn-outline {
  @apply border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors;
}
</style>
