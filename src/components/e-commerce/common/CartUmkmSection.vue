<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- UMKM Header -->
    <div class="p-6 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center">
        <input
          type="checkbox"
          :checked="isUmkmSelected"
          @change="$emit('toggle-umkm-selection', umkm.id)"
          class="h-4 w-4 text-primary rounded focus:ring-primary border-gray-300"
        >
        <div class="flex items-center ml-4 flex-1">
          <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img
              :src="processImageUrl(umkm.image)"
              :alt="umkm.name"
              class="w-full h-full object-cover"
            >
          </div>
          <div class="ml-3">
            <h3 class="font-semibold text-gray-900">{{ umkm.name }}</h3>
            <p class="text-sm text-gray-600">{{ umkm.location }}</p>
          </div>
        </div>
        <router-link
          v-if="umkm.id"
          :to="`/local-cart/umkm/${umkm.id}`"
          class="text-primary hover:text-primary-dark text-sm font-medium"
        >
          Lihat Toko
        </router-link>
      </div>
    </div>

    <!-- Products List -->
    <div class="divide-y divide-gray-200">
      <div
        v-for="item in umkm.items"
        :key="item.id"
        class="p-6 hover:bg-gray-50 transition"
      >
        <CartItem
          :item="item"
          @toggle-selection="$emit('toggle-item-selection', item.id)"
          @update-quantity="(qty) => $emit('update-quantity', item.id, qty)"
          @remove-item="$emit('remove-item', item.id)"
        />
      </div>
    </div>

    <!-- UMKM Footer -->
    <div class="p-6 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center">
        <span class="text-gray-600">
          {{ umkm.items.length }} produk • Total untuk {{ umkm.name }}:
        </span>
        <span class="text-xl font-bold text-gray-900">
          Rp {{ formatPrice(umkm.total) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice, processImageUrl } from '@/utils/helpers'

export default {
  props: {
    umkm: Object,
    isUmkmSelected: Boolean
  },

  methods: {
    formatPrice,
    processImageUrl
  }
}
</script>
