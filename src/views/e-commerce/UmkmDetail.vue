<template>
  <div class="umkm-detail-page">
    <!-- Loading State -->
    <div v-if="store.loading && !store.umkm" class="container-custom py-12">
      <div class="flex justify-center">
        <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>

    <!-- UMKM Header -->
    <div v-if="store.umkm" class="bg-white border-b border-gray-200">
      <div class="container-custom py-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <!-- UMKM Info -->
          <div class="flex items-center space-x-4">
            <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-200 ring-4 ring-white shadow-lg">
              <img
                :src="store.umkm.foto_logo ?? getUmkmPlaceholderImage()"
                :alt="store.umkm.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              >
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ store.umkm.nama_umkm }}</h1>
              <div class="flex items-center mt-2">
                <i class="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                <span class="text-gray-600">{{ store.umkm.location }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons (Simplified) -->
          <div class="flex items-center space-x-4">
            <button class="btn-primary px-6 py-2">
              <i class="fas fa-shopping-cart mr-2"></i> Belanja Sekarang
            </button>
          </div>
        </div>

        <!-- Rating Summary (Only visible in reviews tab) -->
        <div v-if="activeTab === 'ulasan'" class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex flex-col md:flex-row md:items-center gap-6">
            <!-- Rating Summary -->
            <div class="text-center">
              <div class="text-4xl font-bold text-gray-900">
                {{ store.umkm.rating ? store.umkm.rating.toFixed(1) : '0.0' }}
              </div>
              <div class="flex items-center justify-center mt-2">
                <i
                  v-for="n in 5"
                  :key="n"
                  :class="[
                    'fas text-lg',
                    n <= Math.floor(store.umkm.rating) ? 'fa-star text-yellow-400' :
                    n === Math.ceil(store.umkm.rating) && store.umkm.rating % 1 !== 0 ? 'fa-star-half-alt text-yellow-400' :
                    'far fa-star text-gray-300'
                  ]"
                ></i>
              </div>
              <p class="text-gray-600 mt-2">
                {{ store.umkm.ratingCount || 0 }} ulasan
              </p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
              <div class="text-center">
                <div class="text-xl font-bold text-gray-900">
                  {{ store.umkm.totalSold || 0 }}
                </div>
                <div class="text-sm text-gray-600">Produk Terjual</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-gray-900">
                  {{ store.umkm.productCount || 0 }}
                </div>
                <div class="text-sm text-gray-600">Produk</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-gray-900">
                  {{ store.umkm.joinYear || new Date().getFullYear() }}
                </div>
                <div class="text-sm text-gray-600">Tahun Bergabung</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div v-if="store.umkm" class="sticky top-20 bg-white border-b border-gray-200 z-30 shadow-sm">
      <div class="container-custom">
        <div class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 font-medium text-lg relative transition-colors duration-300',
              activeTab === tab.id
                ? 'text-primary'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ tab.name }}
            <span
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-all duration-300"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="store.umkm" class="container-custom py-8">
      <!-- Products Tab -->
      <div v-if="activeTab === 'produk'" class="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-2">
          <ProductFilter
            v-model="store.productFilters"
            @update:modelValue="handleProductFilterChange"
            hide-kecamatan-filter
          />
        </div>

        <!-- Products Grid -->
        <div class="lg:col-span-4">
          <!-- Loading Products -->
          <div v-if="store.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="h-48 bg-gray-200 animate-pulse"></div>
              <div class="p-4">
                <div class="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded mb-4 w-2/3 animate-pulse"></div>
                <div class="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <!-- Products List -->
          <div v-else>
            <div v-if="store.products.length === 0" class="text-center py-12">
              <i class="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
              <p class="text-gray-600">Belum ada produk tersedia</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductCard
                v-for="product in store.products"
                :key="product.id"
                :product="formatProduct(product)"
                @view-product="viewProduct"
                @add-to-cart="handleAddToCartFromRecommendation"
              />
            </div>

            <!-- Pagination -->
            <div v-if="store.productsMeta.last_page > 1" class="flex justify-center items-center space-x-2 mt-12">
              <button
                @click="goToProductPage(store.productsMeta.current_page - 1)"
                :disabled="store.productsMeta.current_page === 1"
                class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                v-for="page in store.visibleProductPages"
                :key="page"
                @click="goToProductPage(page)"
                :class="[
                  'w-10 h-10 rounded-lg font-medium transition-colors',
                  store.productsMeta.current_page === page
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="goToProductPage(store.productsMeta.current_page + 1)"
                :disabled="store.productsMeta.current_page === store.productsMeta.last_page"
                class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Tab -->
      <div v-else-if="activeTab === 'ulasan'" class="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg p-6 sticky top-40">
            <h3 class="text-lg font-bold text-gray-900 mb-6">Filter Ulasan</h3>

            <!-- Star Filter -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-700 mb-3">Berdasarkan Bintang</h4>
              <div class="space-y-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="filterByStar(star)"
                  :class="[
                    'flex items-center w-full p-2 rounded-lg transition-colors',
                    store.reviewFilters.star === star ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-center mr-2">
                    <i
                      v-for="n in 5"
                      :key="n"
                      :class="[
                        'fas text-sm',
                        n <= star ? 'fa-star text-yellow-400' : 'far fa-star text-gray-300'
                      ]"
                    ></i>
                  </div>
                  <span class="text-gray-700">{{ star }} bintang</span>
                  <span class="ml-auto text-gray-500 text-sm">{{ store.starDistribution[star] }}</span>
                </button>
              </div>
            </div>

            <!-- Sort Options -->
            <div>
              <h4 class="font-medium text-gray-700 mb-3">Urutkan</h4>
              <select
                v-model="store.reviewFilters.sort_by"
                @change="handleReviewSortChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Terbaru</option>
                <option value="highest">Rating Tertinggi</option>
                <option value="lowest">Rating Terendah</option>
              </select>
            </div>

            <button
              @click="resetReviewFilters"
              class="w-full mt-6 btn-outline py-2"
            >
              Reset Filter
            </button>
          </div>
        </div>

        <!-- Reviews Content -->
        <div class="lg:col-span-4">
          <!-- Loading Reviews -->
          <div v-if="store.loading" class="space-y-6">
            <div v-for="n in 3" :key="n" class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex items-start mb-4">
                <div class="w-12 h-12 rounded-full bg-gray-200 mr-4 animate-pulse"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
              <div class="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded mb-2 w-2/3 animate-pulse"></div>
            </div>
          </div>

          <!-- Reviews List -->
          <div v-else>
            <div v-if="store.reviews.length === 0" class="text-center py-12">
              <i class="fas fa-comments text-4xl text-gray-300 mb-4"></i>
              <p class="text-gray-600">Belum ada ulasan untuk UMKM ini</p>
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="review in store.filteredReviews"
                :key="review.id"
                class="bg-white rounded-xl shadow-lg p-6"
              >
                <div class="flex items-start mb-4">
                  <div class="h-10 w-10 rounded-full bg-blue-500 mr-4 flex items-center justify-center">
                      <span class="text-white font-semibold text-sm">
                        {{ getInitials(review.user.name) }}
                      </span>
                    </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <div>
                        <h4 class="font-semibold text-gray-900">{{ review.user.name }}</h4>
                        <div class="flex items-center mt-1">
                          <div class="flex items-center">
                            <i
                              v-for="n in 5"
                              :key="n"
                              :class="[
                                'fas text-sm mr-1',
                                n <= review.rating ? 'fa-star text-yellow-400' : 'far fa-star text-gray-300'
                              ]"
                            ></i>
                          </div>
                          <span class="text-gray-500 text-sm ml-2">{{ formatDate(review.created_at) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mb-4">
                  <p class="text-gray-700 mb-2">{{ review.review }}</p>
                  <div v-if="review.product" class="text-sm text-gray-600">
                    <span class="font-medium">Produk:</span> {{ review.product }}
                  </div>
                </div>
                <div v-if="review.images && review.images.length > 0" class="flex space-x-2 mb-4">
                  <img
                    v-for="(img, index) in review.images"
                    :key="index"
                    :src="processReviewImage(img)"
                    :alt="`Review image ${index + 1}`"
                    class="w-24 h-24 object-cover rounded-lg"
                  >
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="store.reviewsMeta.last_page > 1" class="flex justify-center items-center space-x-2 mt-12">
              <button
                @click="goToReviewPage(store.reviewsMeta.current_page - 1)"
                :disabled="store.reviewsMeta.current_page === 1"
                class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                v-for="page in store.visibleReviewPages"
                :key="page"
                @click="goToReviewPage(page)"
                :class="[
                  'w-10 h-10 rounded-lg font-medium transition-colors',
                  store.reviewsMeta.current_page === page
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="goToReviewPage(store.reviewsMeta.current_page + 1)"
                :disabled="store.reviewsMeta.current_page === store.reviewsMeta.last_page"
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUmkmDetailStore } from '@/stores/umkm-detail'
import { useNotificationStore } from '@/stores/notification'
import ProductFilter from '@/components/e-commerce/common/ProductFilter.vue'
import ProductCard from '@/components/e-commerce/common/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const store = useUmkmDetailStore()
const notificationStore = useNotificationStore()
const activeTab = ref('produk')

const tabs = [
  { id: 'produk', name: 'Produk' },
  { id: 'ulasan', name: 'Ulasan' }
]

const umkmId = computed(() => route.params.id)

// Computed properties
const totalResults = computed(() => {
  return activeTab.value === 'produk'
    ? store.productsMeta.total
    : store.reviewsMeta.total
})

const currentItems = computed(() => {
  return activeTab.value === 'produk'
    ? store.products
    : store.filteredReviews
})

// Lifecycle hooks
onMounted(async () => {
  await loadUmkmData()
})

onUnmounted(() => {
  store.reset()
})

// Watchers
watch(activeTab, (newTab) => {
  if (newTab === 'produk' && store.umkm) {
    loadProducts()
  } else if (newTab === 'ulasan' && store.umkm) {
    loadReviews()
  }
})

watch(umkmId, async (newId) => {
  if (newId) {
    await loadUmkmData()
  }
})

// Methods
const loadUmkmData = async () => {
  try {
    await store.fetchUmkmDetail(umkmId.value)
    await loadProducts()
    await store.fetchUmkmCategories(umkmId.value)
  } catch (error) {
    console.error('Gagal memuat data UMKM:', error)
    emitNotification('error', 'Gagal memuat data UMKM')
  }
}

const loadProducts = async () => {
  try {
    await store.fetchUmkmProducts(umkmId.value, store.productsMeta.current_page)
  } catch (error) {
    console.error('Gagal memuat produk:', error)
    emitNotification('error', 'Gagal memuat produk')
  }
}

const loadReviews = async () => {
  try {
    await store.fetchUmkmReviews(umkmId.value, store.reviewsMeta.current_page)
  } catch (error) {
    console.error('Gagal memuat ulasan:', error)
    emitNotification('error', 'Gagal memuat ulasan')
  }
}

const handleProductFilterChange = async (filters) => {
  await store.applyProductFilters(filters)
  await loadProducts()
}

const handleReviewFilterChange = async () => {
  await loadReviews()
}

const handleReviewSortChange = async () => {
  await loadReviews()
}

const filterByStar = async (star) => {
  const newStar = store.reviewFilters.star === star ? null : star
  store.reviewFilters.star = newStar
  await loadReviews()
}

const resetReviewFilters = async () => {
  store.resetReviewFilters()
  await loadReviews()
}

const goToProductPage = async (page) => {
  if (page >= 1 && page <= store.productsMeta.last_page) {
    store.productsMeta.current_page = page
    await loadProducts()
    scrollToTop()
  }
}

const goToReviewPage = async (page) => {
  if (page >= 1 && page <= store.reviewsMeta.last_page) {
    store.reviewsMeta.current_page = page
    await loadReviews()
    scrollToTop()
  }
}

const viewProduct = (product) => {
  router.push(`/products/${product.id}`)
}

const markHelpful = async (review) => {
  try {
    review.helpful++
    // Call API to update helpful count
  } catch (error) {
    console.error('Gagal menandai membantu:', error)
    emitNotification('error', 'Gagal menandai ulasan sebagai membantu')
  }
}

const formatProduct = (product) => {
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
    stock: product.stok,
  }
}

const isProductNew = (createdAt) => {
  if (!createdAt) return false
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return new Date(createdAt) > oneWeekAgo
}

const getPlaceholderImage = () => {
  return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
}

function getUmkmPlaceholderImage() {
  return 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleImageError = (event) => {
  event.target.src = '/images/default-umkm.jpg'
}

const handleAvatarError = (event) => {
  event.target.src = '/images/default-avatar.jpg'
}

const processReviewImage = (imagePath) => {
  if (!imagePath) return '/images/default-product.jpg'
  const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000'
  return `${baseUrl}/storage/${imagePath}`
}

const scrollToTop = () => {
  window.scrollTo({ top: 300, behavior: 'smooth' })
}

const emitNotification = (type, message) => {
  const event = new CustomEvent('show-notification', {
    detail: { type, message }
  })
  window.dispatchEvent(event)
}

async function handleAddToCartFromRecommendation(product) {
  try {
    await store.addToCart(product.id, 1)
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

const getInitials = (name) => {
  if (!name) return 'C'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Expose to template
defineExpose({
  store,
  activeTab,
  tabs,
  currentItems,
  totalResults,
  handleProductFilterChange,
  handleReviewFilterChange,
  handleReviewSortChange,
  filterByStar,
  resetReviewFilters,
  goToProductPage,
  goToReviewPage,
  viewProduct,
  markHelpful,
  formatProduct,
  formatDate,
  handleImageError,
  handleAvatarError,
  processReviewImage,
  scrollToTop,
})
</script>

<style scoped>
.umkm-detail-page {
  min-height: calc(100vh - 140px);
}

/* Typography */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Buttons */
.btn-outline {
  @apply border border-primary text-primary font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300;
}

.btn-primary {
  @apply bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-light transition-all duration-300;
}

/* Sticky elements */
.sticky {
  position: sticky;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-500 {
  transition-duration: 500ms;
}

/* Shadow utilities */
.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.shadow-lg {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.container-custom {
  @apply container mx-auto px-1;
}
</style>
