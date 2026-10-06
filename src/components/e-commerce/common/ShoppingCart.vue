<template>
  <transition name="slide-fade">
    <div v-if="showCart" class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeCart"></div>

      <div class="absolute inset-y-0 right-0 max-w-full flex">
        <div class="relative w-screen max-w-md">
          <div class="h-full flex flex-col bg-white shadow-xl">
            <!-- Cart Header -->
            <div class="flex items-center justify-between p-6 border-b">
              <h2 class="text-2xl font-bold text-gray-900">Keranjang Belanja</h2>
              <button
                @click="closeCart"
                class="text-gray-400 hover:text-gray-500"
              >
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>

            <!-- Cart Items -->
            <div class="flex-1 overflow-y-auto p-6">
              <div v-if="cartItems.length === 0" class="text-center py-12">
                <i class="fas fa-shopping-cart text-gray-300 text-6xl mb-4"></i>
                <p class="text-gray-500 text-lg">Keranjang belanja Anda masih kosong</p>
                <button
                  @click="closeCart"
                  class="btn-primary mt-6 px-6 py-3 rounded-lg font-medium"
                >
                  Mulai Belanja
                </button>
              </div>

              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex items-center py-4 border-b"
              >
                <div class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
                </div>

                <div class="ml-4 flex-1">
                  <div class="flex justify-between">
                    <h4 class="text-gray-900 font-medium">{{ item.name }}</h4>
                    <span class="font-bold text-gray-900">Rp {{ formatPrice(item.price * item.quantity) }}</span>
                  </div>
                  <p class="text-gray-500 text-sm mt-1">{{ item.seller }}</p>

                  <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center border border-gray-300 rounded-lg">
                      <button
                        @click="decreaseQuantity(item)"
                        class="px-3 py-1 text-gray-600 hover:text-primary"
                      >
                        -
                      </button>
                      <span class="px-3 py-1 border-x border-gray-300">{{ item.quantity }}</span>
                      <button
                        @click="increaseQuantity(item)"
                        class="px-3 py-1 text-gray-600 hover:text-primary"
                      >
                        +
                      </button>
                    </div>
                    <button
                      @click="removeFromCart(item)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cart Footer -->
            <div v-if="cartItems.length > 0" class="border-t p-6">
              <div class="flex justify-between mb-4">
                <span class="text-gray-700">Subtotal</span>
                <span class="font-bold text-gray-900">Rp {{ formatPrice(cartTotal) }}</span>
              </div>
              <div class="flex justify-between mb-6">
                <span class="text-gray-700">Biaya Pengiriman</span>
                <span class="font-bold text-gray-900">Rp 15.000</span>
              </div>
              <div class="flex justify-between mb-6 text-lg">
                <span class="font-bold">Total</span>
                <span class="font-bold text-primary">Rp {{ formatPrice(cartTotal + 15000) }}</span>
              </div>
              <button class="btn-primary w-full py-3 rounded-lg font-semibold mb-3">
                Lanjut ke Pembayaran
              </button>
              <button
                @click="closeCart"
                class="border border-primary text-primary w-full py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Lanjut Belanja
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ShoppingCart',
  data() {
    return {
      showCart: false,
      cartItems: [
        {
          id: 2,
          name: 'Tas Anyaman Rotan',
          seller: 'UMKM Craft.id',
          price: 125000,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
          quantity: 1
        },
        {
          id: 3,
          name: 'Madu Hutan Asli',
          seller: 'UMKM Madu Alam',
          price: 75000,
          image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
          quantity: 2
        }
      ]
    }
  },
  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    }
  },
  methods: {
    closeCart() {
      this.showCart = false
    },
    openCart() {
      this.showCart = true
    },
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    removeFromCart(item) {
      this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id)
    },
    increaseQuantity(item) {
      item.quantity++
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        this.removeFromCart(item)
      }
    }
  },
  created() {
    // Listen for cart toggle events
    // this.$root.$on('toggle-cart', () => {
    //   this.showCart = !this.showCart
    // })
  }
}
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
