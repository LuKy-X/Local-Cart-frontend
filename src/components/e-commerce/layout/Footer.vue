<template>
  <footer class="bg-gray-900 text-white pt-12 pb-6">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <!-- Company Info -->
        <div>
          <div class="flex items-center space-x-2 mb-6">
            <div class="bg-white w-10 h-10 rounded-lg flex items-center justify-center">
              <i class="fas fa-shopping-cart text-primary text-xl"></i>
            </div>
            <span class="text-2xl font-bold text-white">Local<span class="text-secondary">Cart</span></span>
          </div>
          <p class="text-gray-400 mb-6">
            Platform e-commerce yang mendukung UMKM lokal untuk berkembang dan menjangkau pasar yang lebih luas.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="social-icon">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-xl font-bold mb-6">Tautan Cepat</h3>
          <ul class="space-y-3">
            <li><a href="#" class="footer-link">Tentang Kami</a></li>
            <li><a href="#" class="footer-link">Cara Berbelanja</a></li>
            <li><a href="#" class="footer-link">Pembayaran</a></li>
            <li><a href="#" class="footer-link">Pengiriman</a></li>
            <li><a href="#" class="footer-link">Kebijakan Privasi</a></li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-xl font-bold mb-6">Kategori</h3>
          <ul class="space-y-3">
            <li><a href="#" class="footer-link">Makanan & Minuman</a></li>
            <li><a href="#" class="footer-link">Kerajinan Tangan</a></li>
            <li><a href="#" class="footer-link">Fashion</a></li>
            <li><a href="#" class="footer-link">Kecantikan</a></li>
            <li><a href="#" class="footer-link">Perlengkapan Rumah</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-xl font-bold mb-6">Hubungi Kami</h3>
          <ul class="space-y-4">
            <li class="flex items-start">
              <i class="fas fa-map-marker-alt text-primary mr-3 mt-1"></i>
              <span class="text-gray-400">Jl. UMKM No. 123, Jakarta, Indonesia</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-phone text-primary mr-3"></i>
              <span class="text-gray-400">(021) 1234-5678</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-envelope text-primary mr-3"></i>
              <span class="text-gray-400">info@localcart.id</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-500 text-sm mb-4 md:mb-0">&copy; 2023 LocalCart. Hak Cipta Dilindungi.</p>
        <div class="flex space-x-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Visa_2021.svg" alt="Visa" class="h-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" class="h-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Logo_BCA.png" alt="BCA" class="h-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Mandiri_logo.svg" alt="Mandiri" class="h-8">
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer-link {
  @apply text-gray-400 hover:text-white transition;
}

.social-icon {
  @apply bg-gray-800 hover:bg-primary w-10 h-10 rounded-full flex items-center justify-center transition;
}
</style>
