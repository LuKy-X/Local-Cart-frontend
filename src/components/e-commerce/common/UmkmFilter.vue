<template>
  <div class="umkm-filters bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Filter UMKM</h3>
      <button
        @click="clearFilters"
        class="text-sm text-primary hover:text-primary-dark font-medium flex items-center"
        v-if="hasActiveFilters"
      >
        <i class="fas fa-times mr-1"></i>
        Hapus Filter
      </button>
    </div>

    <!-- Kecamatan Filter -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-700 mb-3 flex items-center justify-between">
        <span>Lokasi</span>
        <span class="text-xs text-gray-500">{{ localSelectedKecamatans.length }} terpilih</span>
      </h4>
      <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
        <label
          v-for="kecamatan in kecamatans"
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

    <!-- Approval Status -->
    <div class="mb-6">
      <h4 class="font-medium text-gray-700 mb-3">Status Verifikasi</h4>
      <div class="space-y-2">
        <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input
            type="checkbox"
            v-model="localShowVerifiedOnly"
            @change="applyFilters"
            class="rounded text-primary focus:ring-primary h-4 w-4"
          />
          <span class="ml-3 text-gray-600 text-sm">Terverifikasi Saja</span>
        </label>
        <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input
            type="checkbox"
            v-model="localShowPendingOnly"
            @change="applyFilters"
            class="rounded text-primary focus:ring-primary h-4 w-4"
          />
          <span class="ml-3 text-gray-600 text-sm">Menunggu Verifikasi</span>
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
        <option value="relevance">Relevansi</option>
        <option value="name_asc">Nama A-Z</option>
        <option value="name_desc">Nama Z-A</option>
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
        <option value="product_count">Jumlah Produk</option>
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
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Local state with watchers to sync with props
const localSelectedKecamatans = ref(props.modelValue.kecamatans || [])
const localShowVerifiedOnly = ref(props.modelValue.is_approved === true)
const localShowPendingOnly = ref(props.modelValue.is_approved === false)
const localSortBy = ref(props.modelValue.sort_by || 'relevance')

// Watch for changes in props to update local state
watch(() => props.modelValue, (newValue) => {
  localSelectedKecamatans.value = newValue.kecamatans || []
  localShowVerifiedOnly.value = newValue.is_approved === true
  localShowPendingOnly.value = newValue.is_approved === false
  localSortBy.value = newValue.sort_by || 'relevance'
}, { deep: true })

// Computed
const kecamatans = computed(() => productStore.kecamatans)

const filters = computed(() => {
  const filters = {
    kecamatans: localSelectedKecamatans.value,
    sort_by: localSortBy.value
  }

  if (localShowVerifiedOnly.value && !localShowPendingOnly.value) {
    filters.is_approved = true
  } else if (localShowPendingOnly.value && !localShowVerifiedOnly.value) {
    filters.is_approved = false
  }

  return filters
})

const hasActiveFilters = computed(() => {
  return (
    localSelectedKecamatans.value.length > 0 ||
    localShowVerifiedOnly.value !== false ||
    localShowPendingOnly.value !== false ||
    localSortBy.value !== 'relevance'
  )
})

// Methods
function applyFilters() {
  emit('update:modelValue', filters.value)
}

function clearFilters() {
  localSelectedKecamatans.value = []
  localShowVerifiedOnly.value = false
  localShowPendingOnly.value = false
  localSortBy.value = 'relevance'
  applyFilters()
}

// Lifecycle
onMounted(async () => {
  if (productStore.kecamatans.length === 0) {
    await productStore.fetchKecamatans()
  }
})
</script>

<style scoped>
.umkm-filters {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

/* Custom scrollbar */
.umkm-filters::-webkit-scrollbar {
  width: 4px;
}

.umkm-filters::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.umkm-filters::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.umkm-filters::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
