<template>
  <div class="flex">
    <!-- Checkbox -->
    <div class="flex items-start mr-4">
      <input
        type="checkbox"
        :checked="isItemSelected"
        @change="$emit('toggle-selection')"
        class="h-5 w-5 text-primary rounded focus:ring-primary border-gray-300 mt-1"
      >
    </div>

    <!-- Product Image -->
    <router-link
      :to="`/products/${item.product?.id}`"
      class="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 mr-4"
    >
      <img
        :src="processImageUrl(item.image)"
        :alt="item.name"
        class="w-full h-full object-cover"
      >
    </router-link>

    <!-- Product Info -->
    <div class="flex-1">
      <div class="flex justify-between">
        <div class="flex-1">
          <router-link
            :to="`/products/${item.product?.id}`"
            class="font-medium text-gray-900 hover:text-primary transition"
          >
            {{ item.name }}
          </router-link>
          <p class="text-sm text-gray-600 mb-2">{{ item.variant }}</p>
          <div class="flex items-center text-sm text-gray-600">
            <span :class="{'text-red-500 font-semibold': item.stock < 5}">
              Stok: {{ item.stock }}
            </span>
            <span v-if="item.stock < 5" class="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              Stok terbatas
            </span>
          </div>
        </div>
        <div class="text-right ml-4">
          <div class="text-xl font-bold text-gray-900 mb-2">
            Rp {{ formatPrice(item.price) }}
          </div>
          <div class="text-sm text-gray-500">
            Subtotal: Rp {{ formatPrice(item.price * item.quantity) }}
          </div>
        </div>
      </div>

      <!-- Quantity Controls -->
      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center">
          <button
            @click="decreaseQuantity"
            :disabled="item.quantity <= 1 || isUpdating"
            class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-lg transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <i class="fas fa-minus text-sm"></i>
          </button>
          <span class="w-12 h-8 flex items-center justify-center border-y border-gray-300 font-medium">
            {{ item.quantity }}
          </span>
          <button
            @click="increaseQuantity"
            :disabled="item.quantity >= item.stock || isUpdating"
            class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-lg transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <i class="fas fa-plus text-sm"></i>
          </button>
          <div class="ml-4 flex flex-col">
            <span class="text-sm text-gray-600">
              Rp {{ formatPrice(item.price * item.quantity) }}
            </span>
            <span v-if="isUpdating" class="text-xs text-blue-500">
              Memperbarui...
            </span>
          </div>
        </div>
        <button
          @click="$emit('remove-item')"
          :disabled="isUpdating"
          class="p-2 rounded-lg transition text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Hapus dari keranjang"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { formatPrice, processImageUrl } from '@/utils/helpers'

export default {
  props: {
    item: Object,
    isItemSelected: Boolean
  },

  computed: {
    ...mapGetters(useCartStore, ['isItemUpdating']),

    isUpdating() {
      return this.isItemUpdating(this.item.id)
    }
  },

  methods: {
    formatPrice,
    processImageUrl,

    decreaseQuantity() {
      if (this.item.quantity > 1) {
        this.$emit('update-quantity', this.item.quantity - 1)
      }
    },

    increaseQuantity() {
      if (this.item.quantity < this.item.stock) {
        this.$emit('update-quantity', this.item.quantity + 1)
      }
    }
  }
}
</script>
