<template>
  <div class="search-page">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-400 py-12">
      <div class="container-custom">
        <div class="text-center text-white">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Hasil Pencarian</h1>
          <p class="text-xl opacity-90">
            Menemukan {{ totalResults }} hasil untuk "{{ searchStore.searchQuery }}"
          </p>
        </div>
      </div>
    </section>

    <!-- Search Content Section -->
    <section class="py-12">
      <div class="container-custom">

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Filters -->
          <div class="lg:w-1/4">
            <ProductFilter
              v-show="searchStore.activeTab === 'products'"
              v-model="productFilters"
              @update:modelValue="applyProductFilters"
            />
            <UmkmFilter
              v-show="searchStore.activeTab === 'umkms'"
              v-model="umkmFilters"
              @update:modelValue="applyUmkmFilters"
            />
          </div>

          <!-- Main Content -->
          <div class="lg:w-3/4">
            <!-- Header with sort and results count -->
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  {{
                    searchStore.activeTab === 'products'
                      ? 'Produk Ditemukan'
                      : 'UMKM Ditemukan'
                  }}
                </h2>
                <p class="text-gray-600">
                  Menampilkan {{ currentItems.length }} dari {{ searchStore.totalResults }} hasil
                </p>
              </div>

              <!-- Sort Options -->
              <div class="mt-4 md:mt-0">
                <select
                  v-model="sortBy"
                  @change="handleSortChange"
                  class="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="relevance">Relevansi</option>
                  <option v-if="searchStore.activeTab === 'products'" value="price_low">
                    Harga: Rendah ke Tinggi
                  </option>
                  <option v-if="searchStore.activeTab === 'products'" value="price_high">
                    Harga: Tinggi ke Rendah
                  </option>
                  <option v-if="searchStore.activeTab === 'products'" value="rating">
                    Rating Tertinggi
                  </option>
                  <option v-if="searchStore.activeTab === 'umkms'" value="name_asc">
                    Nama A-Z
                  </option>
                  <option v-if="searchStore.activeTab === 'umkms'" value="name_desc">
                    Nama Z-A
                  </option>
                  <option value="newest">Terbaru</option>
                </select>
              </div>
            </div>

            <!-- Tabs Navigation -->
            <div class="mb-8 border-b border-gray-200">
              <nav class="flex space-x-8">
                <button
                  @click="switchTab('products')"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm relative',
                    searchStore.activeTab === 'products'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <i class="fas fa-box mr-2"></i>
                  Produk
                  <span
                    v-if="searchStore.productsTabCount > 0"
                    class="ml-2 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                  >
                    {{ searchStore.productsTabCount }}
                  </span>
                  <span
                    v-else
                    class="ml-2 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                  >
                    0
                  </span>
                </button>
                <button
                  @click="switchTab('umkms')"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm relative',
                    searchStore.activeTab === 'umkms'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <i class="fas fa-store mr-2"></i>
                  UMKM
                  <span
                    v-if="searchStore.umkmsTabCount > 0"
                    class="ml-2 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                  >
                    {{ searchStore.umkmsTabCount }}
                  </span>
                  <span
                    v-else
                    class="ml-2 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                  >
                    0
                  </span>
                </button>
              </nav>
            </div>

            <!-- Loading State -->
            <div v-if="searchStore.loading" class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p class="mt-4 text-gray-600">Mencari "{{ searchStore.searchQuery }}"...</p>
            </div>

            <!-- Products Grid -->
            <div v-if="searchStore.activeTab === 'products' && !searchStore.loading">
              <div v-if="searchStore.searchProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard
                  v-for="product in searchStore.searchProducts"
                  :key="product.id"
                  :product="formatProduct(product)"
                  @toggle-favorite="toggleFavorite"
                  @view-product="trackProductView"
                  @add-to-cart="handleAddToCartFromRecommendation"
                />
              </div>

              <!-- Empty State for Products -->
              <div v-if="searchStore.searchProducts.length === 0 && searchStore.searchPerformed" class="text-center py-12">
                <div class="mx-auto w-24 h-24 text-gray-400 mb-4">
                  <i class="fas fa-search text-6xl"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada produk ditemukan untuk "{{ searchStore.searchQuery }}"
                </h3>
                <p class="text-gray-600 mb-4">Coba gunakan kata kunci lain atau filter yang berbeda</p>
                <button
                  @click="clearFilters"
                  class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Hapus Filter
                </button>
              </div>
            </div>

            <!-- UMKM Grid -->
            <div v-if="searchStore.activeTab === 'umkms' && !searchStore.loading">
              <div v-if="searchStore.searchUmkms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UmkmCard
                  v-for="umkm in searchStore.searchUmkms"
                  :key="umkm.id"
                  :umkm="formatUmkm(umkm)"
                  :is-active="isUmkmActive(umkm)"
                  @view-umkm="handleViewUmkm"
                />
              </div>

              <!-- Empty State for UMKM -->
              <div v-if="searchStore.searchUmkms.length === 0 && searchStore.searchPerformed" class="text-center py-12">
                <div class="mx-auto w-24 h-24 text-gray-400 mb-4">
                  <i class="fas fa-store text-6xl"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada UMKM ditemukan untuk "{{ searchStore.searchQuery }}"
                </h3>
                <p class="text-gray-600 mb-4">
                  {{ hasActiveFilters ? 'Coba hapus beberapa filter atau gunakan kata kunci lain' : 'Coba gunakan kata kunci lain' }}
                </p>
                <button
                  v-if="hasActiveFilters"
                  @click="clearFilters"
                  class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <i class="fas fa-times mr-2"></i>
                  Hapus Filter
                </button>
                <button
                  v-else
                  @click="$router.push('/products')"
                  class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <i class="fas fa-shopping-bag mr-2"></i>
                  Lihat Semua Produk
                </button>
              </div>
            </div>

            <!-- Load More Button -->
            <div
              v-if="(searchStore.activeTab === 'products' && searchStore.hasMoreProducts) ||
                    (searchStore.activeTab === 'umkms' && searchStore.hasMoreUmkms)"
              class="text-center mt-12"
            >
              <button
                @click="loadMore"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'
import { useProductStore } from '@/stores/public-products'
import { useNotificationStore } from '@/stores/notification'
import ProductCard from '@/components/e-commerce/common/ProductCard.vue'
import UmkmCard from '@/components/e-commerce/common/UmkmCard.vue'
import ProductFilter from '@/components/e-commerce/common/ProductFilter.vue'
import UmkmFilter from '@/components/e-commerce/common/UmkmFilter.vue'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const productStore = useProductStore()
const notificationStore = useNotificationStore()

// Reactive data
const productFilters = ref({})
const umkmFilters = ref({})
const sortBy = ref('relevance')
const loadingMore = ref(false)
const initialLoadDone = ref(false)

// Computed properties
const currentItems = computed(() => {
  return searchStore.activeTab === 'products'
    ? searchStore.searchProducts
    : searchStore.searchUmkms
})

const totalResults = computed(() => searchStore.totalResults)

// Methods
async function performSearch() {
  const query = route.query.q || ''
  if (!query.trim()) {
    searchStore.clearSearch()
    return
  }

  // Always fetch counts for both tabs on initial search
  if (!initialLoadDone.value) {
    await Promise.all([
      searchStore.fetchProductCount(query),
      searchStore.fetchUmkmCount(query)
    ])
    initialLoadDone.value = true
  }

  // Perform main search for active tab
  await searchStore.performSearch(query, searchStore.activeTab)
}

function switchTab(tab) {
  searchStore.setActiveTab(tab)
  sortBy.value = 'relevance'
}

async function applyProductFilters(filters) {
  await searchStore.updateProductFilters(filters)
}

async function applyUmkmFilters(filters) {
  await searchStore.updateUmkmFilters(filters)
}

function handleSortChange() {
  if (searchStore.activeTab === 'products') {
    applyProductFilters({ ...productFilters.value, sort_by: sortBy.value })
  } else {
    applyUmkmFilters({ ...umkmFilters.value, sort_by: sortBy.value })
  }
}

async function loadMore() {
  loadingMore.value = true
  try {
    if (searchStore.activeTab === 'products') {
      await searchStore.loadMoreProducts()
    } else {
      await searchStore.loadMoreUmkms()
    }
  } catch (error) {
    console.error('Error loading more:', error)
  } finally {
    loadingMore.value = false
  }
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

function formatUmkm(umkm) {
  return {
    id: umkm.id,
    nama_umkm: umkm.nama_umkm || 'Nama UMKM',
    deskripsi: umkm.deskripsi,
    alamat: umkm.alamat,
    telepon: umkm.telepon,
    foto_logo: umkm.foto_logo || getUmkmPlaceholderImage(),
    is_approved: umkm.is_approved || false,
    kecamatan: umkm.kecamatan || null,
    products_count: umkm.products_count || umkm.total_products || 0,
    rating: umkm.rating || umkm.average_rating || null,
    last_active: umkm.updated_at || umkm.created_at
  }
}

function getUmkmPlaceholderImage() {
  return 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
}

function isUmkmActive(umkm) {
  // Logic to determine if UMKM is active (e.g., has recent activity)
  if (!umkm.updated_at) return false
  const lastUpdate = new Date(umkm.updated_at)
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  return lastUpdate > oneMonthAgo
}

const hasActiveFilters = computed(() => {
  if (searchStore.activeTab === 'products') {
    return Object.keys(productFilters.value).length > 0
  } else {
    return Object.keys(umkmFilters.value).length > 0
  }
})

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

function viewUmkmProducts(umkm) {
  router.push({
    name: 'Products',
    query: { umkm: umkm.id }
  })
}

async function clearFilters() {
  // Reset filter objects
  productFilters.value = {}
  umkmFilters.value = {}

  // Reset sort
  sortBy.value = 'relevance'

  // Reset pagination
  currentPage.value = 1

  // Reset filter components
  if (searchStore.activeTab === 'products') {
    // Trigger filter reset
    await searchStore.updateProductFilters({})
  } else {
    await searchStore.updateUmkmFilters({})
  }

  // Show notification
  emitNotification('success', 'Semua filter telah dihapus')
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

// Watch for route changes
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    initialLoadDone.value = false
    performSearch()
  }
}, { immediate: true })

// Lifecycle hooks
onMounted(async () => {
  if (route.query.q) {
    await performSearch()
  }

  // Pre-load categories and kecamatans for filters
  await Promise.all([
    productStore.fetchCategories(),
    productStore.fetchKecamatans()
  ])
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
}

.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.btn-outline {
  @apply border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
