<template>
  <div
    class="umkm-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20"
    :class="{'ring-2 ring-primary/10': isActive}"
  >
    <div class="p-6">
      <!-- UMKM Logo and Header -->
      <div class="flex items-center mb-4">
        <!-- Logo Container -->
        <div class="relative">
          <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mr-4 border-2 border-gray-200">
            <img
              v-if="umkm.foto_logo"
              :src="umkm.foto_logo"
              :alt="umkm.nama_umkm"
              class="w-full h-full object-cover"
            />
            <div v-else class="text-gray-400">
              <i class="fas fa-store text-2xl"></i>
            </div>
          </div>

          <!-- Verification Badge -->
          <div
            v-if="umkm.is_approved"
            class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white"
            :title="umkm.is_approved ? 'Terverifikasi' : 'Menunggu Verifikasi'"
          >
            <i class="fas fa-check text-white text-xs"></i>
          </div>
          <div
            v-else
            class="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white"
            :title="umkm.is_approved ? 'Terverifikasi' : 'Menunggu Verifikasi'"
          >
            <i class="fas fa-clock text-white text-xs"></i>
          </div>
        </div>

        <!-- UMKM Info -->
        <div class="flex-1">
          <h3 class="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
            {{ umkm.nama_umkm }}
          </h3>

          <!-- Rating and Product Count -->
          <div class="flex items-center space-x-4">
            <div v-if="umkm.rating" class="flex items-center">
              <div class="flex items-center">
                <i class="fas fa-star text-yellow-400 text-sm"></i>
                <span class="ml-1 text-sm font-semibold">{{ umkm.rating.toFixed(1) }}</span>
              </div>
            </div>

            <div class="flex items-center text-gray-500">
              <i class="fas fa-box text-sm mr-1"></i>
              <span class="text-sm">{{ umkm.products_count || 0 }} produk</span>
            </div>
          </div>
        </div>
      </div>

      <!-- UMKM Description -->
      <p
        class="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]"
        :title="umkm.deskripsi || 'Tidak ada deskripsi'"
      >
        {{ umkm.deskripsi || 'Tidak ada deskripsi' }}
      </p>

      <!-- UMKM Details -->
      <div class="space-y-2 text-sm mb-4">
        <!-- Alamat -->
        <div class="flex items-start text-gray-600">
          <i class="fas fa-map-marker-alt mr-2 text-gray-400 mt-0.5 flex-shrink-0"></i>
          <span
            class="truncate"
            :title="umkm.alamat"
          >
            {{ umkm.alamat }}
          </span>
        </div>

        <!-- Telepon -->
        <div v-if="umkm.telepon" class="flex items-center text-gray-600">
          <i class="fas fa-phone mr-2 text-gray-400 flex-shrink-0"></i>
          <span class="font-medium">{{ formatPhoneNumber(umkm.telepon) }}</span>
        </div>

        <!-- Kecamatan -->
        <div v-if="umkm.kecamatan" class="flex items-center text-gray-600">
          <i class="fas fa-map mr-2 text-gray-400 flex-shrink-0"></i>
          <span>{{ umkm.kecamatan.nama_kecamatan }}</span>
        </div>

        <!-- Last Active (Optional) -->
        <div v-if="umkm.last_active" class="flex items-center text-gray-500 text-xs">
          <i class="fas fa-clock mr-2 flex-shrink-0"></i>
          <span>Aktif {{ formatTimeAgo(umkm.last_active) }}</span>
        </div>
      </div>

      <!-- Action Button - Lihat UMKM -->
      <button
        @click="handleViewUmkm"
        class="w-full bg-primary text-white text-center py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-all duration-300 flex items-center justify-center group"
      >
        <i class="fas fa-eye mr-2 group-hover:animate-pulse"></i>
        <span>Lihat UMKM</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Props
const props = defineProps({
  umkm: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      nama_umkm: '',
      deskripsi: '',
      alamat: '',
      telepon: '',
      foto_logo: null,
      is_approved: false,
      kecamatan: null,
      products_count: 0,
      rating: null,
      last_active: null
    })
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['view-umkm'])

// Computed
const hasContactInfo = computed(() => {
  return props.umkm.telepon || props.umkm.alamat
})

// Methods
function formatPhoneNumber(phone) {
  if (!phone) return '-'
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')

  // Format based on length
  if (cleaned.length === 11) {
    // Format: 0812-3456-789
    return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 8)}-${cleaned.substring(8)}`
  } else if (cleaned.length === 12) {
    // Format: 08123-4567-89
    return `${cleaned.substring(0, 5)}-${cleaned.substring(5, 9)}-${cleaned.substring(9)}`
  } else if (cleaned.length === 10) {
    // Format: 081-2345-678
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 7)}-${cleaned.substring(7)}`
  }

  // Return original if doesn't match common formats
  return phone
}

function formatTimeAgo(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) {
    return `${diffMins} menit yang lalu`
  } else if (diffHours < 24) {
    return `${diffHours} jam yang lalu`
  } else if (diffDays < 30) {
    return `${diffDays} hari yang lalu`
  } else {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
}

function handleViewUmkm() {
  emit('view-umkm', props.umkm)
  router.push({
    name: 'UmkmDetail',
    params: { id: props.umkm.id }
  })
}
</script>

<style scoped>
.umkm-card {
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.umkm-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1);
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

.min-h-\[2\.5rem\] {
  min-height: 2.5rem;
}
</style>
