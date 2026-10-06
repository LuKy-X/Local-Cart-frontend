<template>
  <section class="bg-gray-100 py-6">
    <div class="container mx-auto px-4">
      <div class="relative overflow-hidden rounded-xl shadow-lg">
        <!-- Carousel Slides -->
        <div class="relative h-64 md:h-96">
          <div
            v-for="(slide, index) in slides"
            :key="index"
            v-show="currentSlide === index"
            class="carousel-slide absolute inset-0 w-full h-full flex items-center"
            :class="{'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index}"
          >
            <div
              class="w-full h-full bg-cover bg-center"
              :style="{ backgroundImage: `url(${slide.image})` }"
            >
              <div class="w-full h-full flex items-center bg-black bg-opacity-30 p-8 md:p-16">
                <div class="max-w-xl">
                  <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">{{ slide.title }}</h2>
                  <p class="text-white text-lg mb-6">{{ slide.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Controls -->
        <button
          @click="prevSlide"
          class="carousel-control left-4"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button
          @click="nextSlide"
          class="carousel-control right-4"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <!-- Carousel Indicators -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            @click="currentSlide = index"
            class="w-3 h-3 rounded-full transition"
            :class="currentSlide === index ? 'bg-primary' : 'bg-white bg-opacity-70 hover:bg-opacity-100'"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Carousel',
  data() {
    return {
      currentSlide: 0,
      slides: [
        {
          title: 'Dukung UMKM Lokal',
          description: 'Temukan produk berkualitas dari pengusaha lokal di seluruh Indonesia. Dukung perekonomian daerah dengan belanja di LocalCart.',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          buttonText: 'Jelajahi Produk',
          link: '/products'
        },
        {
          title: 'Produk Handmade Eksklusif',
          description: 'Kerajinan tangan unik dengan kualitas terbaik langsung dari pembuatnya. Setiap produk memiliki cerita tersendiri.',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
          buttonText: 'Lihat Kerajinan',
          link: '/products?category=handmade'
        },
        {
          title: 'Makanan & Minuman Lokal',
          description: 'Rasa autentik dari berbagai daerah Indonesia. Produk segar dan berkualitas langsung dari produsen.',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
          buttonText: 'Cicipi Sekarang',
          link: '/products?category=food'
        }
      ]
    }
  },
  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length
    },
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length
    },
    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide()
      }, 5000)
    },
    stopAutoSlide() {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval)
      }
    }
  },
  mounted() {
    this.startAutoSlide()
  },
  beforeUnmount() {
    this.stopAutoSlide()
  }
}
</script>

<style scoped>
.carousel-slide {
  transition: opacity 0.5s ease-in-out;
}

.carousel-control {
  @apply absolute top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-md transition;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-primary-dark transition-colors;
}
</style>
