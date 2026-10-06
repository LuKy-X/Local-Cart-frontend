<template>
  <div class="product-filters bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Filter Produk</h3>
      <button
        @click="clearFilters"
        class="text-sm text-primary hover:text-primary-dark font-medium flex items-center"
        v-if="hasActiveFilters"
      >
        <i class="fas fa-times mr-1"></i>
        Hapus Filter
      </button>
    </div>

    <!-- Category Filter -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-700 mb-3 flex items-center justify-between">
        <span>Kategori</span>
        <span class="text-xs text-gray-500">{{ localSelectedCategories.length }} terpilih</span>
      </h4>
      <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
        <label
          v-for="category in productStore.categories"
          :key="category.id"
          class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <input
            type="checkbox"
            :value="category.id"
            v-model="localSelectedCategories"
            @change="applyFilters"
            class="rounded text-primary focus:ring-primary h-4 w-4"
          />
          <span class="ml-3 text-gray-600 text-sm">{{ category.nama_kategori }}</span>
          <span class="ml-auto text-xs text-gray-500">{{ category.products_count || 0 }}</span>
        </label>
      </div>
    </div>

    <!-- Price Range -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-700 mb-3">Rentang Harga</h4>
      <div class="space-y-4">
        <div class="flex items-center justify-between space-x-2">
          <div class="flex-1">
            <label class="block text-xs text-gray-500 mb-1">Minimum</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">Rp</span>
              <input
                type="number"
                v-model="localMinPrice"
                placeholder="0"
                @input="handlePriceChange"
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                min="0"
              />
            </div>
          </div>
          <div class="flex-1">
            <label class="block text-xs text-gray-500 mb-1">Maksimum</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">Rp</span>
              <input
                type="number"
                v-model="localMaxPrice"
                placeholder="1000000"
                @input="handlePriceChange"
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- UMKM Location -->
    <div class="mb-6" v-if="!props.hideKecamatanFilter && productStore.kecamatans.length > 0">
      <h4 class="font-medium text-gray-700 mb-3 flex items-center justify-between">
        <span>Lokasi UMKM</span>
        <span class="text-xs text-gray-500">{{ localSelectedKecamatans.length }} terpilih</span>
      </h4>
      <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
        <label
          v-for="kecamatan in productStore.kecamatans"
          :key="kecamatan.id"
          class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <input
            type="checkbox"
            :value="kecamatan.id"
            v-model="localSelectedKecamatans"
            @change="applyFilters"
            class="rounded text-primary focus:ring-primary h-4 w-4"
          />
          <span class="ml-3 text-gray-600 text-sm">{{ kecamatan.nama_kecamatan }}</span>
          <span class="ml-auto text-xs text-gray-500">{{ kecamatan.umkms_count || 0 }}</span>
        </label>
      </div>
    </div>

    <!-- Stock Availability -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-700 mb-3">Ketersediaan</h4>
      <div class="space-y-2">
        <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input
            type="checkbox"
            v-model="localInStockOnly"
            @change="applyFilters"
            class="rounded text-primary focus:ring-primary h-4 w-4"
          />
          <span class="ml-3 text-gray-600 text-sm">Stok Tersedia Saja</span>
        </label>
      </div>
    </div>

    <!-- Sort Options -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-700 mb-3">Urutkan Berdasarkan</h4>
      <select
        v-model="localSortBy"
        @change="applyFilters"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary bg-white"
      >
        <option value="newest">Terbaru</option>
        <option value="price_low">Harga: Rendah ke Tinggi</option>
        <option value="price_high">Harga: Tinggi ke Rendah</option>
        <option value="rating">Rating Tertinggi</option>
        <option value="popular">Terlaris</option>
      </select>
    </div>

    <!-- Clear All Button at Bottom -->
    <button
      v-if="hasActiveFilters"
      @click="clearFilters"
      class="w-full py-2.5 px-4 border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center"
    >
      <i class="fas fa-times-circle mr-2"></i>
      Hapus Semua Filter
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useProductStore } from '@/stores/public-products'

const productStore = useProductStore()

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },

  hideKecamatanFilter: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Local state with watchers to sync with props
const localSelectedCategories = ref(props.modelValue.categories || [])
const localSelectedKecamatans = ref(props.modelValue.kecamatans || [])
const localMinPrice = ref(props.modelValue.min_price || null)
const localMaxPrice = ref(props.modelValue.max_price || null)
const localInStockOnly = ref(props.modelValue.in_stock || false)
const localSortBy = ref(props.modelValue.sort_by || 'newest')

// Watch for changes in props to update local state
watch(() => props.modelValue, (newValue) => {
  localSelectedCategories.value = newValue.categories || []
  localSelectedKecamatans.value = newValue.kecamatans || []
  localMinPrice.value = newValue.min_price || null
  localMaxPrice.value = newValue.max_price || null
  localInStockOnly.value = newValue.in_stock || false
  localSortBy.value = newValue.sort_by || 'newest'
}, { deep: true })

// Computed
const filters = computed(() => {
  return {
    categories: localSelectedCategories.value,
    kecamatans: localSelectedKecamatans.value,
    min_price: localMinPrice.value,
    max_price: localMaxPrice.value,
    in_stock: localInStockOnly.value,
    sort_by: localSortBy.value
  }
})

const hasActiveFilters = computed(() => {
  return (
    localSelectedCategories.value.length > 0 ||
    localSelectedKecamatans.value.length > 0 ||
    localMinPrice.value !== null ||
    localMaxPrice.value !== null ||
    localInStockOnly.value !== false ||
    localSortBy.value !== 'newest'
  )
})

// Methods
function applyFilters() {
  emit('update:modelValue', filters.value)
}

function handlePriceChange() {
  // Debounce price changes
  clearTimeout(window.priceTimeout)
  window.priceTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

function clearFilters() {
  localSelectedCategories.value = []
  localSelectedKecamatans.value = []
  localMinPrice.value = null
  localMaxPrice.value = null
  localInStockOnly.value = false
  localSortBy.value = 'newest'

  // Emit immediately
  applyFilters()
}

// Lifecycle
onMounted(async () => {
  if (productStore.categories.length === 0) {
    await productStore.fetchCategories()
  }
  if (productStore.kecamatans.length === 0) {
    await productStore.fetchKecamatans()
  }
})
</script>

<style scoped>
.product-filters {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

/* Custom scrollbar */
.product-filters::-webkit-scrollbar {
  width: 4px;
}

.product-filters::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.product-filters::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.product-filters::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
