<!-- DirectOrderModal.vue - Perbaikan lengkap -->
<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="close"></div>

    <!-- Modal -->
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
      <div class="relative bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Beli Langsung</h3>
            <button @click="close" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-4">
          <!-- Product Info -->
          <div class="mb-6">
            <div class="flex items-start space-x-4">
              <img
                :src="productImage"
                :alt="product?.nama_produk"
                class="w-20 h-20 object-cover rounded-lg"
              >
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ product?.nama_produk }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ product?.umkm?.nama_umkm }}</p>
                <div class="mt-2 flex justify-between">
                  <span class="text-gray-600">Jumlah:</span>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="decreaseQuantity"
                      :disabled="quantity <= 1 || orderLoading"
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                    >
                      <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="font-medium">{{ quantity }}</span>
                    <button
                      @click="increaseQuantity"
                      :disabled="quantity >= maxStock || orderLoading"
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                    >
                      <i class="fas fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div class="mt-2">
                  <span class="text-gray-600">Stok tersedia: </span>
                  <span :class="[
                    'font-medium',
                    product?.stok > 10 ? 'text-green-600' :
                    product?.stok > 0 ? 'text-yellow-600' : 'text-red-600'
                  ]">
                    {{ product?.stok }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-3">Informasi Pengiriman</h4>

            <!-- Customer Address -->
            <div v-if="customer" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Alamat Pengiriman
              </label>
              <textarea
                v-model="alamatPengiriman"
                :disabled="orderLoading"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                placeholder="Masukkan alamat lengkap pengiriman"
              ></textarea>
              <div v-if="customer.kecamatan" class="mt-2 text-sm text-gray-600">
                <p>Kecamatan: {{ customer.kecamatan.nama_kecamatan }}</p>
              </div>
            </div>

            <!-- Shipping Cost Preview -->
            <div v-if="estimatedShipping" class="p-3 bg-blue-50 rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-900">Perkiraan Ongkir</p>
                  <p class="text-sm text-gray-600">
                    Estimasi: {{ estimatedShipping.estimasi_hari }} hari
                    <span v-if="estimatedShipping.jarak_km">({{ estimatedShipping.jarak_km }} km)</span>
                  </p>
                </div>
                <span class="font-bold text-lg text-primary">
                  Rp {{ formatPrice(estimatedShipping.tarif) }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-2">{{ estimatedShipping.keterangan }}</p>
            </div>

            <!-- Calculate Shipping Button -->
            <div v-if="!estimatedShipping" class="text-center">
              <button
                @click="calculateShipping"
                :disabled="!canCalculateShipping || loadingShipping"
                :class="[
                  'btn-outline py-2 px-4 w-full',
                  (!canCalculateShipping || loadingShipping) ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                <template v-if="loadingShipping">
                  <i class="fas fa-spinner fa-spin mr-2"></i>Menghitung...
                </template>
                <template v-else>
                  <i class="fas fa-calculator mr-2"></i>Hitung Ongkir
                </template>
              </button>
            </div>
          </div>

          <!-- Price Summary -->
          <div class="border-t border-gray-200 pt-4">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal Produk:</span>
                <span>Rp {{ formatPrice(productSubtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Biaya Pengiriman:</span>
                <span v-if="estimatedShipping">
                  Rp {{ formatPrice(estimatedShipping.tarif) }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </div>
              <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total Pembayaran:</span>
                <span class="text-primary">
                  Rp {{ formatPrice(grandTotal) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
              <span class="text-red-700 text-sm">{{ errorMessage }}</span>
            </div>
          </div>

          <!-- Warning Message -->
          <div v-if="warningMessage" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-center">
              <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
              <span class="text-yellow-700 text-sm">{{ warningMessage }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div class="flex space-x-3">
            <button
              @click="close"
              :disabled="orderLoading"
              class="flex-1 btn-outline py-3 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              @click="placeOrder"
              :disabled="!canPlaceOrder || orderLoading"
              :class="[
                'flex-1 btn-primary py-3 flex items-center justify-center',
                (!canPlaceOrder || orderLoading) ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <template v-if="orderLoading">
                <i class="fas fa-spinner fa-spin mr-2"></i>Memproses...
              </template>
              <template v-else>
                <i class="fas fa-bolt mr-2"></i>Buat Pesanan
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from '@/api/axios'

const props = defineProps({
  show: Boolean,
  product: Object,
  quantity: Number
})

const emit = defineEmits(['close', 'update:quantity', 'order-created'])

// Refs
const customer = ref(null)
const shippers = ref([])
const shipperId = ref(null)
const alamatPengiriman = ref('')
const estimatedShipping = ref(null)
const loadingShipping = ref(false)
const loadingShippers = ref(false)
const orderLoading = ref(false)
const errorMessage = ref('')
const warningMessage = ref('')

// Computed
const productImage = computed(() => {
  return props.product?.foto || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
})

const productSubtotal = computed(() => {
  return (props.product?.harga || 0) * props.quantity
})

const grandTotal = computed(() => {
  const shippingCost = estimatedShipping.value?.tarif || 0
  return productSubtotal.value + shippingCost
})

const maxStock = computed(() => {
  return props.product?.stok || 0
})

const canCalculateShipping = computed(() => {
  return !!customer.value?.kecamatan_id && !!props.product?.umkm_id
})

const canPlaceOrder = computed(() => {
  return (
    !!alamatPengiriman.value &&
    !!estimatedShipping.value &&
    props.quantity > 0 &&
    props.quantity <= maxStock.value
  )
})

// Methods
function formatPrice(price) {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0"
}

function increaseQuantity() {
  if (props.quantity < maxStock.value) {
    emit('update:quantity', props.quantity + 1)
    // Reset shipping estimation if quantity changes
    estimatedShipping.value = null
  }
}

function decreaseQuantity() {
  if (props.quantity > 1) {
    emit('update:quantity', props.quantity - 1)
    // Reset shipping estimation if quantity changes
    estimatedShipping.value = null
  }
}

async function fetchCustomerData() {
  try {
    const response = await axios.get('/profile/customer')
    if (response.data.data) {
      customer.value = response.data.data
      // Set default alamat if available
      if (customer.value.alamat) {
        alamatPengiriman.value = customer.value.alamat
      }
    }
  } catch (error) {
    console.error('Gagal mengambil data customer:', error)
    errorMessage.value = 'Gagal memuat data profil'
  }
}

async function fetchShippers() {
  loadingShippers.value = true
  try {
    const response = await axios.get('/shippers')
    if (response.data.success) {
      shippers.value = response.data.data
      // Set default shipper if available
      if (shippers.value.length > 0) {
        shipperId.value = shippers.value[0].id
      }
    }
  } catch (error) {
    console.error('Gagal mengambil data kurir:', error)
    warningMessage.value = 'Gagal memuat data kurir'
  } finally {
    loadingShippers.value = false
  }
}

async function calculateShipping() {
  if (!canCalculateShipping.value) {
    errorMessage.value = 'Data kecamatan tidak lengkap untuk menghitung ongkir'
    return
  }

  loadingShipping.value = true
  errorMessage.value = ''

  try {
    const response = await axios.post('/customer/orders/check-ongkir', {
      umkm_id: props.product.umkm_id,
      customer_id: customer.value.id
    })

    if (response.data.success) {
      estimatedShipping.value = {
        tarif: response.data.ongkir,
        estimasi_hari: response.data.estimasi_hari,
        keterangan: response.data.keterangan || 'Ongkir berdasarkan jarak'
      }
    } else {
      errorMessage.value = response.data.message || 'Gagal menghitung ongkir'
    }
  } catch (error) {
    console.error('Error calculating shipping:', error)
    if (error.response?.status === 422) {
      errorMessage.value = 'Tidak dapat menghitung ongkir. Pastikan UMKM dan Customer memiliki data kecamatan yang lengkap.'
    } else {
      errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat menghitung ongkir'
    }
  } finally {
    loadingShipping.value = false
  }
}

async function placeOrder() {
  if (!canPlaceOrder.value) return

  orderLoading.value = true
  errorMessage.value = ''

  try {
    // Prepare order data sesuai dengan StoreOrderRequest
    const orderData = {
      alamat_pengiriman: alamatPengiriman.value,
      order_items: [
        {
          product_id: props.product.id,
          quantity: props.quantity
        }
      ]
    }

    console.log('Sending order data:', orderData)

    // Create order
    const response = await axios.post('/customer/orders', orderData)

    if (response.data) {
      // Berhasil membuat order
      showNotification('success', 'Pesanan berhasil dibuat! Kode order: ' + response.data.kode_order)

      // Emit event dengan data order
      emit('order-created', response.data)

      // Tutup modal
      close()

      // Redirect ke halaman order detail
      setTimeout(() => {
        window.location.href = `/orders/${response.data.id}`
      }, 1500)
    } else {
      errorMessage.value = 'Gagal membuat pesanan'
    }
  } catch (error) {
    console.error('Error placing order:', error)

    // Display detailed error message
    if (error.response?.status === 422) {
      const errors = error.response.data.errors || {}
      const errorMessages = []

      // Collect all validation errors
      for (const field in errors) {
        if (errors[field]) {
          if (Array.isArray(errors[field])) {
            errorMessages.push(...errors[field])
          } else {
            errorMessages.push(errors[field])
          }
        }
      }

      if (errorMessages.length > 0) {
        errorMessage.value = errorMessages.join(', ')
      } else if (error.response.data.message) {
        errorMessage.value = error.response.data.message
      } else {
        errorMessage.value = 'Validasi gagal. Periksa data yang Anda masukkan.'
      }
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Terjadi kesalahan saat membuat pesanan'
    }
  } finally {
    orderLoading.value = false
  }
}

function close() {
  // Reset form
  estimatedShipping.value = null
  errorMessage.value = ''
  warningMessage.value = ''
  emit('close')
}

function showNotification(type, message) {
  const event = new CustomEvent('show-notification', {
    detail: { type, message }
  })
  window.dispatchEvent(event)
}

// Watchers
watch(() => props.quantity, () => {
  // Reset shipping estimation when quantity changes
  estimatedShipping.value = null
})

watch(() => alamatPengiriman.value, () => {
  // Reset shipping estimation when address changes
  estimatedShipping.value = null
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchCustomerData(),
    fetchShippers()
  ])

  // Set warning if customer doesn't have kecamatan
  if (customer.value && !customer.value.kecamatan_id) {
    warningMessage.value = 'Anda belum mengatur kecamatan. Silakan lengkapi profil terlebih dahulu untuk menghitung ongkir.'
  }
})
</script>

<style scoped>
.btn-outline {
  @apply border border-primary text-primary font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300;
}

.btn-primary {
  @apply bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary-light transition-all duration-300;
}
</style>
