<template>
  <div class="search-results-page">
    <!-- Search Header -->
    <div class="bg-gradient-to-r from-primary to-primary-light py-8">
      <div class="container-custom">
        <div class="text-center text-white">
          <h1 class="text-3xl md:text-4xl font-bold mb-3">Hasil Pencarian</h1>
          <p v-if="searchStore.searchQuery" class="text-lg opacity-90">
            Menampilkan hasil untuk: <span class="font-bold">"{{ searchStore.searchQuery }}"</span>
          </p>
          <p v-else class="text-lg opacity-90">
            Silakan gunakan search bar di header untuk mencari
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container-custom py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left Sidebar - Filters -->
        <div class="lg:w-1/4">
          <ProductFilter v-model="filters" @update:modelValue="fetchProducts" />
        </div>

        <!-- Right Content - Results -->
        <div class="lg:w-3/4">
          <!-- Tabs Navigation -->
          <div class="mb-6">
            <div class="flex border-b border-gray-200">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="switchTab(tab.id)"
                :class="[
                  'tab-button px-6 py-3 font-medium text-lg relative',
                  searchStore.activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                {{ tab.name }}
                <span v-if="tab.id === 'products'" class="ml-2 text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {{ formatNumber(searchStore.productsTotal) }}
                </span>
                <span v-else class="ml-2 text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {{ formatNumber(searchStore.umkmsTotal) }}
                </span>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="searchStore.error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <i class="fas fa-exclamation-circle text-red-500 mr-3"></i>
              <div>
                <p class="text-red-700 font-medium">{{ searchStore.error }}</p>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="searchStore.currentLoading" class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            <p class="mt-4 text-gray-600 text-lg">Mencari...</p>
          </div>

          <!-- No Results -->
          <div v-else-if="!searchStore.currentLoading && searchStore.currentTotal === 0" class="text-center py-20 bg-white rounded-xl shadow-lg">
            <div class="mx-auto w-24 h-24 text-gray-400 mb-4">
              <i class="fas fa-search text-6xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada hasil ditemukan</h3>
            <p class="text-gray-600 mb-6">Coba kata kunci lain atau ubah filter pencarian</p>
            <button @click="resetFilters" class="btn-primary px-6 py-3 rounded-lg font-medium">
              Reset Pencarian
            </button>
          </div>

          <!-- Results Content -->
          <div v-else>
            <!-- Products Results -->
            <div v-if="searchStore.activeTab === 'products'" class="space-y-6">
              <!-- Products Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard
                  v-for="product in searchStore.products"
                  :key="`product-${product.id}`"
                  :product="formatProduct(product)"
                  @add-to-cart="handleAddToCart"
                  @toggle-favorite="toggleFavorite"
                />
              </div>

              <!-- Products Pagination -->
              <div v-if="searchStore.productsPages > 1" class="flex justify-center items-center space-x-2 mt-8 pt-6 border-t border-gray-200">
                <button
                  @click="prevPage"
                  :disabled="searchStore.productsPage === 1"
                  class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>

                <button
                  v-for="page in searchStore.getVisiblePages()"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'w-10 h-10 rounded-lg font-medium transition-colors',
                    searchStore.productsPage === page
                      ? 'bg-primary text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>

                <button
                  @click="nextPage"
                  :disabled="searchStore.productsPage === searchStore.productsPages"
                  class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <!-- UMKM Results -->
            <div v-else class="space-y-6">
              <!-- UMKM Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="umkm in searchStore.umkms"
                  :key="`umkm-${umkm.id}`"
                  class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                  @click="goToUmkm(umkm.id)"
                >
                  <!-- UMKM Header -->
                  <div class="flex items-start mb-4">
                    <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        :src="umkm.foto_logo || getPlaceholderImage('umkm')"
                        :alt="umkm.nama_umkm"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="ml-4 flex-1">
                      <h3 class="font-semibold text-gray-900 mb-1">{{ umkm.nama_umkm }}</h3>
                      <div class="flex items-center text-sm text-gray-500 mb-1">
                        <i class="fas fa-map-marker-alt mr-1 text-xs"></i>
                        <span class="truncate">{{ umkm.alamat }}</span>
                      </div>
                      <div v-if="umkm.kecamatan" class="text-xs">
                        <span class="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                          {{ umkm.kecamatan.nama_kecamatan }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- UMKM Stats -->
                  <div class="grid grid-cols-3 gap-2 text-center mb-4">
                    <div class="p-2 bg-gray-50 rounded-lg">
                      <div class="text-lg font-bold text-gray-900">{{ umkm.product_count || 0 }}</div>
                      <div class="text-xs text-gray-600">Produk</div>
                    </div>
                    <div class="p-2 bg-gray-50 rounded-lg">
                      <div class="text-lg font-bold text-gray-900">{{ umkm.rating ? umkm.rating.toFixed(1) : 'N/A' }}</div>
                      <div class="text-xs text-gray-600">Rating</div>
                    </div>
                    <div class="p-2 bg-gray-50 rounded-lg">
                      <div class="text-lg font-bold text-gray-900">{{ umkm.sales_count || 0 }}</div>
                      <div class="text-xs text-gray-600">Terjual</div>
                    </div>
                  </div>

                  <!-- UMKM Description -->
                  <div class="mb-4">
                    <p class="text-gray-600 text-sm line-clamp-2">
                      {{ umkm.deskripsi || 'Tidak ada deskripsi tersedia' }}
                    </p>
                  </div>

                  <!-- Contact Info -->
                  <div class="flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center">
                      <i class="fas fa-phone mr-1"></i>
                      <span>{{ umkm.telepon || 'Tidak ada telepon' }}</span>
                    </div>
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      umkm.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    ]">
                      {{ umkm.is_approved ? 'Terverifikasi' : 'Pending' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- UMKM Pagination -->
              <div v-if="searchStore.umkmsPages > 1" class="flex justify-center items-center space-x-2 mt-8 pt-6 border-t border-gray-200">
                <button
                  @click="prevPage"
                  :disabled="searchStore.umkmsPage === 1"
                  class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>

                <button
                  v-for="page in searchStore.getVisiblePages()"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'w-10 h-10 rounded-lg font-medium transition-colors',
                    searchStore.umkmsPage === page
                      ? 'bg-primary text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>

                <button
                  @click="nextPage"
                  :disabled="searchStore.umkmsPage === searchStore.umkmsPages"
                  class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'
import ProductCard from '@/components/e-commerce/common/ProductCard.vue'
import ProductFilter from '@/components/e-commerce/common/ProductFilter.vue'

export default {
  name: 'SearchResults',

  components: {
    ProductCard
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const searchStore = useSearchStore()

    // Local reactive data
    const filtersLoading = ref(false)
    const priceFilter = ref({
      min: null,
      max: null
    })

    const tabs = [
      { id: 'products', name: 'Produk' },
      { id: 'umkms', name: 'UMKM' }
    ]

    // Computed
    const hasResults = computed(() => {
      return searchStore.currentTotal > 0
    })

    // Methods
    function formatNumber(num) {
      if (!num && num !== 0) return '0'
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace('.0', '') + 'jt'
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1).replace('.0', '') + 'rb'
      }
      return num.toString()
    }

    function getPlaceholderImage(type = 'product') {
      const placeholders = {
        product: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        umkm: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      }
      return placeholders[type] || placeholders.product
    }

    function handleImageError(event) {
      event.target.src = getPlaceholderImage('umkm')
    }

    function formatProduct(product) {
      return {
        id: product.id,
        name: product.nama_produk,
        seller: product.umkm?.nama_umkm || 'UMKM Lokal',
        price: product.harga,
        rating: product.average_rating || 0,
        reviewCount: product.total_ratings || 0,
        image: product.foto || getPlaceholderImage('product'),
        isFavorite: false,
        stock: product.stok,
        salesCount: product.sales_count || 0
      }
    }

    function handleAddToCart(product) {
      console.log('Add to cart:', product)
    }

    function toggleFavorite(product) {
      product.isFavorite = !product.isFavorite
    }

    function goToUmkm(umkmId) {
      router.push(`/umkm/${umkmId}`)
    }

    async function switchTab(tabId) {
      await searchStore.switchTab(tabId)
      updateURL()
    }

    async function applyProductFilters() {
      // Update price filter in store
      searchStore.updateProductFilters({
        minPrice: priceFilter.value.min,
        maxPrice: priceFilter.value.max
      })

      // Reset to first page and search
      searchStore.setProductsPage(1)
      await searchStore.searchProducts()
      updateURL()
    }

    async function applyUmkmFilters() {
      // Reset to first page and search
      searchStore.setUmkmsPage(1)
      await searchStore.searchUmkms()
      updateURL()
    }

    async function resetFilters() {
      searchStore.resetFilters()
      priceFilter.value = { min: null, max: null }
      await searchStore.performSearch()
      updateURL()
    }

    async function goToPage(page) {
      await searchStore.goToPage(page)
      updateURL()
    }

    async function nextPage() {
      await searchStore.nextPage()
      updateURL()
    }

    async function prevPage() {
      await searchStore.prevPage()
      updateURL()
    }

    function updateURL() {
      const query = {
        q: searchStore.searchQuery,
        tab: searchStore.activeTab
      }

      // Add page numbers
      if (searchStore.activeTab === 'products') {
        query.product_page = searchStore.productsPage
      } else {
        query.umkm_page = searchStore.umkmsPage
      }

      router.replace({ query })
    }

    async function loadFilterData() {
      filtersLoading.value = true
      try {
        await Promise.all([
          searchStore.fetchCategories(),
          searchStore.fetchKecamatans()
        ])
      } catch (error) {
        console.error('Error loading filter data:', error)
      } finally {
        filtersLoading.value = false
      }
    }

    async function initializeSearch() {
      // Initialize from route
      searchStore.initializeFromRoute(route.query)

      // Load filter data
      await loadFilterData()

      // Sync price filter from store
      priceFilter.value.min = searchStore.productFilters.minPrice
      priceFilter.value.max = searchStore.productFilters.maxPrice

      // Perform search if query exists
      if (searchStore.searchQuery) {
        await searchStore.performSearch()
      }
    }

    // Lifecycle
    onMounted(async () => {
      await initializeSearch()
    })

    // Watch route changes
    watch(
      () => route.query,
      async (newQuery) => {
        if (newQuery.q && newQuery.q !== searchStore.searchQuery) {
          await initializeSearch()
        }
      }
    )

    return {
      // Stores
      searchStore,

      // Local data
      filtersLoading,
      priceFilter,
      tabs,

      // Computed
      hasResults,

      // Methods
      formatNumber,
      getPlaceholderImage,
      handleImageError,
      formatProduct,
      handleAddToCart,
      toggleFavorite,
      goToUmkm,
      switchTab,
      applyProductFilters,
      applyUmkmFilters,
      resetFilters,
      goToPage,
      nextPage,
      prevPage
    }
  }
}
</script>

<style scoped>
.search-results-page {
  min-height: 100vh;
}

.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.btn-primary {
  @apply bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary-light transition-all duration-300;
}

.tab-button {
  position: relative;
  transition: all 0.3s ease;
}

.tab-button:hover::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #1C3FAA;
  opacity: 0.5;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for filter lists */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Sticky sidebar */
.sticky {
  position: sticky;
  top: 6rem; /* 24 = 96px (header) + 24px (top spacing) */
  align-self: flex-start;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}
</style>
