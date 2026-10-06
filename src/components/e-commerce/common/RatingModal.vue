<template>
  <transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <!-- Modal Header -->
        <div class="modal-header">
          <h3 class="text-2xl font-bold text-gray-900">Beri Rating & Ulasan</h3>
          <button @click="close" class="modal-close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <div class="mb-8">
            <p class="text-gray-600">Pesanan: {{ order.kode_order }}</p>
            <p class="font-medium">Beri penilaian untuk produk pada pesanan ini</p>
          </div>

          <div v-for="(item, index) in order.order_items" :key="item.id" class="mb-8 p-4 border border-gray-200 rounded-lg">
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  :src="item.product?.foto || getPlaceholderImage()"
                  :alt="item.product?.nama_produk"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="ml-4">
                <h5 class="font-bold">{{ item.product?.nama_produk }}</h5>
                <p class="text-gray-600 text-sm">Kuantitas: {{ item.quantity }}</p>
                <p class="text-gray-600 text-sm">Harga: {{ formatCurrency(item.harga_satuan) }}</p>
              </div>
            </div>

            <!-- Rating -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Rating</label>
              <div class="flex items-center">
                <button
                  v-for="star in 5"
                  :key="star"
                  :disabled="isReadOnly"
                  @click="!isReadOnly && (ratings[index] = star)"
                  class="text-3xl focus:outline-none"
                >
                  <i
                    :class="[
                      star <= ratings[index] ? 'fas fa-star text-yellow-500' : 'far fa-star text-gray-300'
                    ]"
                  ></i>
                </button>
                <span class="ml-4 text-gray-700 font-medium">{{ ratings[index] }}/5</span>
              </div>
            </div>

            <!-- Review -->
            <div>
              <label class="block text-gray-700 mb-2">Ulasan</label>
              <textarea
                v-model="reviews[index]"
                placeholder="Bagaimana pengalaman Anda dengan produk ini? (Opsional)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                rows="3"
                :maxlength="500"
                :disabled="isReadOnly"
              ></textarea>
              <p class="text-right text-sm text-gray-500 mt-1">
                {{ reviews[index].length }}/500 karakter
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button @click="close" class="btn-outline px-6 py-3">
            Batal
          </button>
          <button
            v-if="!isReadOnly"
            @click="submitRating"
            class="btn-primary px-6 py-3"
          >
            <span v-if="!submitting">
              <i class="fas fa-star mr-2"></i> Kirim Rating
            </span>
            <span v-else>
              <i class="fas fa-spinner fa-spin mr-2"></i> Mengirim...
            </span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'submit-rating'])

const ratings = ref([])
const reviews = ref([])
const submitting = ref(false)

// Initialize ratings and reviews for each order item
watch(() => props.order, () => {
  if (!props.order?.order_items) return

  ratings.value = props.order.order_items.map(item =>
    item.rating ? item.rating.rating : 5
  )

  reviews.value = props.order.order_items.map(item =>
    item.rating ? item.rating.review : ''
  )
}, { immediate: true })


function close() {
  emit('close')
}

const isReadOnly = computed(() => {
  return props.order.has_rating
})


function submitRating() {
  submitting.value = true

  const requests = props.order.order_items.map((item, index) => {
    return {
      product_id: item.product_id,
      rating: ratings.value[index],
      review: reviews.value[index]
    }
  })

  emit('submit-rating', requests)

  setTimeout(() => {
    submitting.value = false
  }, 1000)
}


function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
}

function getPlaceholderImage() {
  return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50;
}

.modal-container {
  @apply bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply sticky top-0 bg-white px-8 py-6 border-b border-gray-200 flex justify-between items-center z-10;
}

.modal-close-button {
  @apply text-gray-400 hover:text-gray-600 text-2xl;
}

.modal-body {
  @apply px-8 py-6;
}

.modal-footer {
  @apply sticky bottom-0 bg-white px-8 py-6 border-t border-gray-200 flex justify-end space-x-4;
}

.btn-outline {
  @apply border border-primary text-primary font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300;
}

.btn-primary {
  @apply bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary-light transition-all duration-300;
}

/* Transition effects */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
