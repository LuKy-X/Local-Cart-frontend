<template>
  <div class="product-detail-page">
    <!-- Breadcrumb -->
    <div class="bg-gray-50 py-4">
      <div class="container-custom">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <router-link to="/local-cart" class="text-gray-700 hover:text-primary">Beranda</router-link>
            </li>
            <li>
              <div class="flex items-center">
                <i class="fas fa-chevron-right text-gray-400 mx-2"></i>
                <router-link to="/local-cart/products" class="text-gray-700 hover:text-primary">Produk</router-link>
              </div>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <i class="fas fa-chevron-right text-gray-400 mx-2"></i>
                <span class="text-gray-500 truncate max-w-xs">{{ product?.nama_produk }}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Sticky Navigation -->
    <div
      :class="[
        'sticky-navigation-container',
        showStickyNav ? 'sticky-navigation-visible' : 'sticky-navigation-hidden'
      ]"
    >
      <div class="container-custom">
        <div class="sticky-navigation">
          <div class="flex space-x-8">
            <button
              v-for="nav in navigations"
              :key="nav.id"
              @click="scrollToSection(nav.id)"
              :class="[
                'nav-item py-4 font-medium text-lg relative transition-colors duration-300',
                activeNav === nav.id
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              {{ nav.name }}
              <span
                v-if="activeNav === nav.id"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-all duration-300"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom py-8">
      <!-- Loading State -->
      <div v-if="productStore.loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600 text-lg">Memuat detail produk...</p>
      </div>

      <!-- Product Not Found -->
      <div v-else-if="!productStore.product" class="text-center py-20">
        <div class="mx-auto w-24 h-24 text-gray-400 mb-4">
          <i class="fas fa-exclamation-circle text-6xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Produk tidak ditemukan</h3>
        <p class="text-gray-600 mb-6">Produk yang Anda cari tidak tersedia atau sudah dihapus</p>
        <router-link to="/local-cart/products" class="btn-primary px-6 py-3 rounded-lg font-medium">
          <i class="fas fa-arrow-left mr-2"></i>Kembali ke Katalog
        </router-link>
      </div>

      <!-- Product Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Column - 2/3 (8 kolom) -->
        <div class="lg:col-span-9">
          <!-- Detail Produk Section -->
          <section id="detail" ref="detailSection" class="mb-12">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Left Image Column (3 kolom) -->
              <div class="lg:col-span-5">
                <div class="sticky-image-container">
                  <div class="bg-white rounded-xl shadow-lg p-4">
                    <!-- Main Product Image -->
                    <div class="relative h-96 overflow-hidden rounded-lg mb-4">
                      <img
                        :src="productImage"
                        :alt="productStore.product.nama_produk"
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        @error="handleImageError"
                      >
                      <!-- Badges -->
                      <div class="absolute top-4 left-4 flex flex-col space-y-2">
                        <span v-if="isProductNew" class="bg-green-500 text-white px-3 py-1 rounded-lg font-bold text-lg shadow-lg">
                          BARU
                        </span>
                        <span v-if="productStore.product.stok <= 5 && productStore.product.stok > 0"
                          class="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-lg shadow-lg">
                          HAMPIR HABIS
                        </span>
                        <span v-if="productStore.product.stok === 0"
                          class="bg-gray-500 text-white px-3 py-1 rounded-lg font-bold text-lg shadow-lg">
                          HABIS
                        </span>
                      </div>
                    </div>

                    <!-- Product Stats -->
                    <div class="grid grid-cols-3 gap-2 text-center">
                      <div class="p-2 bg-gray-50 rounded-lg">
                        <div class="text-xl font-bold text-gray-900">{{ formatNumber(productStore.product.sales_count || 0) }}</div>
                        <div class="text-xs text-gray-600">Terjual</div>
                      </div>
                      <div class="p-2 bg-gray-50 rounded-lg">
                        <div class="text-xl font-bold text-gray-900">{{ formatNumber(productStore.product.total_views || 0) }}</div>
                        <div class="text-xs text-gray-600">Dilihat</div>
                      </div>
                      <div class="p-2 bg-gray-50 rounded-lg">
                        <div class="text-xl font-bold text-gray-900">{{ formatNumber(productStore.product.total_ratings || 0) }}</div>
                        <div class="text-xs text-gray-600">Ulasan</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Info Column (9 kolom) -->
              <div class="lg:col-span-7">
                <div class="bg-white rounded-xl shadow-lg p-6">
                  <!-- Product Header -->
                  <div class="mb-6">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ productStore.product.nama_produk }}</h1>

                    <!-- Rating and Stats -->
                    <div class="flex items-center mb-4">
                      <div class="flex items-center mr-4">
                        <div class="flex items-center">
                          <i
                            v-for="n in 5"
                            :key="n"
                            :class="[
                              'fas text-lg mr-1 transition-colors',
                              n <= Math.floor(productStore.product.average_rating || 0) ? 'fa-star text-yellow-400' :
                              n === Math.ceil(productStore.product.average_rating || 0) && (productStore.product.average_rating || 0) % 1 !== 0 ? 'fa-star-half-alt text-yellow-400' :
                              'far fa-star text-gray-300'
                            ]"
                          ></i>
                        </div>
                        <span class="ml-2 text-gray-700 font-medium">{{ (productStore.product.average_rating || 0).toFixed(1) }}</span>
                      </div>
                      <span class="text-gray-400 mx-2">•</span>
                      <span class="text-gray-600">{{ formatNumber(productStore.product.total_ratings || 0) }} ulasan</span>
                      <span class="text-gray-400 mx-2">•</span>
                      <span class="text-green-600 font-medium">{{ formatNumber(productStore.product.sales_count || 0) }} terjual</span>
                    </div>

                    <!-- Price -->
                    <div class="text-3xl font-bold text-gray-900 mb-2">
                      Rp {{ formatPrice(productStore.product.harga) }}
                    </div>

                    <!-- Category -->
                    <div class="mb-4">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-light text-white">
                        <i class="fas fa-tag mr-2"></i>
                        {{ productStore.product.category?.nama_kategori || 'Tidak ada kategori' }}
                      </span>
                    </div>
                  </div>

                  <!-- Product Description -->
                  <div class="space-y-6">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 mb-3">Deskripsi Produk</h3>
                      <div class="text-gray-700 leading-relaxed whitespace-pre-line">
                        {{ productStore.product.deskripsi || 'Tidak ada deskripsi tersedia untuk produk ini.' }}
                      </div>
                    </div>

                    <!-- Product Specifications -->
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 mb-3">Informasi Produk</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex">
                          <span class="text-gray-600 w-32 flex-shrink-0">Stok:</span>
                          <span :class="[
                            'font-medium',
                            productStore.product.stok > 10 ? 'text-green-600' :
                            productStore.product.stok > 0 ? 'text-yellow-600' : 'text-red-600'
                          ]">
                            {{ productStore.product.stok > 0 ? `${productStore.product.stok} tersedia` : 'Stok habis' }}
                          </span>
                        </div>
                        <div class="flex">
                          <span class="text-gray-600 w-32 flex-shrink-0">Status:</span>
                          <span :class="[
                            'px-2 py-1 rounded-full text-xs font-medium',
                            productStore.product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          ]">
                            {{ productStore.product.is_active ? 'Aktif' : 'Tidak Aktif' }}
                          </span>
                        </div>
                        <div class="flex">
                          <span class="text-gray-600 w-32 flex-shrink-0">Dibuat:</span>
                          <span class="text-gray-900">{{ formatDate(productStore.product.created_at) }}</span>
                        </div>
                        <div class="flex">
                          <span class="text-gray-600 w-32 flex-shrink-0">Diperbarui:</span>
                          <span class="text-gray-900">{{ formatDate(productStore.product.updated_at) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- UMKM Profile -->
                  <div class="mt-8 pt-8 border-t border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Tentang UMKM</h3>
                    <div class="flex items-center space-x-4">
                      <router-link
                        v-if="productStore.product.umkm"
                        :to="`/local-cart/umkm/${productStore.product.umkm.id}`"
                        class="flex items-center space-x-4 group"
                      >
                        <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-200 ring-2 ring-transparent group-hover:ring-primary transition-all">
                          <img
                            :src="productStore.product.umkm.foto_logo || getPlaceholderImage('umkm')"
                            :alt="productStore.product.umkm.nama_umkm"
                            class="w-full h-full object-cover"
                            @error="handleImageError"
                          >
                        </div>
                        <div>
                          <h4 class="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                            {{ productStore.product.umkm.nama_umkm }}
                          </h4>
                          <p class="text-gray-600 text-sm">
                            <i class="fas fa-map-marker-alt mr-1"></i>
                            {{ productStore.product.umkm.alamat }}
                          </p>
                          <p class="text-gray-600 text-sm">
                            <i class="fas fa-phone mr-1"></i>
                            {{ productStore.product.umkm.telepon || 'Tidak ada telepon' }}
                          </p>
                          <div v-if="productStore.product.umkm.kecamatan" class="mt-1">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              <i class="fas fa-map-marker-alt mr-1 text-xs"></i>
                              {{ productStore.product.umkm.kecamatan.nama_kecamatan }}
                            </span>
                          </div>
                        </div>
                      </router-link>
                      <div v-else class="flex items-center space-x-4">
                        <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <i class="fas fa-store text-gray-400 text-2xl"></i>
                        </div>
                        <div>
                          <h4 class="font-semibold text-gray-900">UMKM Lokal</h4>
                          <p class="text-gray-600 text-sm">Informasi UMKM tidak tersedia</p>
                        </div>
                      </div>
                      <router-link
                        v-if="productStore.product.umkm"
                        :to="`/local-cart/umkm/${productStore.product.umkm.id}`"
                        class="ml-auto btn-outline px-4 py-2 text-sm"
                      >
                        Lihat Produk Lainnya
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Ulasan Section -->
          <section id="ulasan" ref="ulasanSection" class="mb-12">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Left Filter Column (3 kolom) -->
              <div class="lg:col-span-4">
                <div class="sticky-filter-container">
                  <div class="bg-white rounded-xl shadow-lg p-6 ml-2">
                    <!-- Rating Summary -->
                    <div class="mb-6">
                      <h3 class="font-semibold text-gray-900 mb-4">Ringkasan Rating</h3>
                      <div class="text-center mb-4">
                        <div class="text-4xl font-bold text-gray-900 mb-2">
                          {{ productStore.reviewStats.average.toFixed(1) }}
                        </div>
                        <div class="flex items-center justify-center mb-2">
                          <i
                            v-for="n in 5"
                            :key="n"
                            :class="[
                              'fas text-lg mr-1',
                              n <= Math.floor(productStore.reviewStats.average) ? 'fa-star text-yellow-400' :
                              n === Math.ceil(productStore.reviewStats.average) && productStore.reviewStats.average % 1 !== 0 ? 'fa-star-half-alt text-yellow-400' :
                              'far fa-star text-gray-300'
                            ]"
                          ></i>
                        </div>
                        <p class="text-gray-600 text-sm">{{ formatNumber(productStore.reviewStats.total) }} ulasan</p>
                      </div>
                    </div>

                    <!-- Star Distribution -->
                    <div class="mb-6">
                      <h4 class="font-medium text-gray-700 mb-3">Distribusi Rating</h4>
                      <div class="space-y-2">
                        <div
                          v-for="star in [5, 4, 3, 2, 1]"
                          :key="star"
                          class="flex items-center"
                        >
                          <button
                            @click="filterByStar(star)"
                            :class="[
                              'flex items-center w-full p-2 rounded-lg transition-colors',
                              starFilter === star ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                            ]"
                          >
                            <div class="flex items-center mr-2">
                              <i
                                v-for="n in 5"
                                :key="n"
                                :class="[
                                  'fas text-sm',
                                  n <= star ? 'fa-star text-yellow-400' : 'far fa-star text-gray-300'
                                ]"
                              ></i>
                            </div>
                            <span class="text-gray-700">{{ star }} bintang</span>
                            <span class="ml-auto text-gray-500 text-sm">
                              {{ productStore.reviewStats.distribution[star] || 0 }}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Sort Options -->
                    <div>
                      <h4 class="font-medium text-gray-700 mb-3">Urutkan</h4>
                      <select
                        v-model="reviewSortBy"
                        @change="fetchReviews()"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="newest">Terbaru</option>
                        <option value="highest">Rating Tertinggi</option>
                        <option value="lowest">Rating Terendah</option>
                      </select>
                    </div>

                    <button
                      @click="resetReviewFilters"
                      class="w-full mt-4 btn-outline py-2"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              </div>

              <!-- Right Reviews Column (9 kolom) -->
              <div class="lg:col-span-8">
                <div class="bg-white rounded-xl shadow-lg p-6">
                  <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Ulasan Pembeli</h2>
                    <span class="text-gray-600">{{ formatNumber(productStore.reviewStats.total) }} ulasan</span>
                  </div>

                  <!-- Loading Reviews -->
                  <div v-if="productStore.loadingReviews" class="text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <p class="mt-2 text-gray-600">Memuat ulasan...</p>
                  </div>

                  <!-- Reviews List -->
                  <div v-else-if="productStore.reviews.length > 0" class="space-y-6">
                    <div
                      v-for="review in productStore.reviews"
                      :key="review.id"
                      class="border-b border-gray-200 pb-6 last:border-b-0"
                    >
                      <div class="flex items-start mb-3">
                        <div class="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                          <i class="fas fa-user text-gray-400"></i>
                        </div>
                        <div class="flex-1">
                          <div class="flex justify-between items-start">
                            <div>
                              <h4 class="font-semibold text-gray-900">
                                {{ review.customer?.nama_customer || 'Pembeli' }}
                              </h4>
                              <div class="flex items-center mt-1">
                                <div class="flex items-center">
                                  <i
                                    v-for="n in 5"
                                    :key="n"
                                    :class="[
                                      'fas text-sm mr-1',
                                      n <= review.rating ? 'fa-star text-yellow-400' : 'far fa-star text-gray-300'
                                    ]"
                                  ></i>
                                </div>
                                <span class="text-gray-500 text-sm ml-2">{{ formatDate(review.created_at) }}</span>
                              </div>
                            </div>
                            <span v-if="review.order?.kode_order" class="text-gray-500 text-sm">
                              Order: {{ review.order.kode_order }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p class="text-gray-700 mb-3 whitespace-pre-line">{{ review.review || 'Tidak ada komentar' }}</p>
                      <div v-if="review.order" class="text-sm text-gray-500">
                        <i class="fas fa-shopping-bag mr-1"></i>
                        {{ review.order.kode_order }}
                      </div>
                    </div>

                    <!-- Pagination -->
                    <div v-if="productStore.hasMoreReviews" class="flex justify-center items-center space-x-2 mt-8 pt-6 border-t border-gray-200">
                      <button
                        @click="loadMoreReviews"
                        :disabled="productStore.loadingReviews"
                        class="btn-outline px-6 py-2 flex items-center"
                      >
                        <span v-if="!productStore.loadingReviews">
                          <i class="fas fa-sync-alt mr-2"></i> Muat Lebih Banyak
                        </span>
                        <span v-else>
                          <i class="fas fa-spinner fa-spin mr-2"></i> Memuat...
                        </span>
                      </button>
                    </div>
                  </div>

                  <!-- No Reviews -->
                  <div v-else class="text-center py-12">
                    <div class="mx-auto w-16 h-16 text-gray-400 mb-4">
                      <i class="fas fa-comment-dots text-4xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada ulasan</h3>
                    <p class="text-gray-600">Jadilah yang pertama memberikan ulasan untuk produk ini</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column - 1/3 (4 kolom) -->
        <div class="lg:col-span-3">
          <div class="sticky-order-container">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <!-- Stock Status -->
              <div v-if="productStore.product.stock === 0" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center">
                  <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                  <span class="text-red-700 font-medium">Stok Habis</span>
                </div>
                <p class="text-red-600 text-sm mt-1">Produk ini sedang tidak tersedia</p>
              </div>

              <!-- Price Summary -->
              <div class="mb-6 pt-6 border-t border-gray-200">
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Harga satuan</span>
                    <span class="font-medium">Rp {{ formatPrice(productStore.product.harga) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Jumlah</span>
                    <span class="font-medium">{{ quantity }}</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span>Subtotal</span>
                    <span class="text-primary">Rp {{ formatPrice(subtotal) }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <button
                  @click="addToCart"
                  :disabled="productStore.product.stok === 0 || productStore.cartLoading"
                  :class="[
                    'btn-primary w-full py-3 flex items-center justify-center',
                    productStore.product.stok === 0 || productStore.cartLoading ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                >
                  <template v-if="productStore.cartLoading">
                    <i class="fas fa-spinner fa-spin mr-2"></i>
                    <span>Menambahkan...</span>
                  </template>
                  <template v-else>
                    <i class="fas fa-cart-plus mr-2"></i>
                    <span>{{ productStore.product.stok > 0 ? '+ Keranjang' : 'Stok Habis' }}</span>
                  </template>
                </button>

                <button
                  @click="openDirectOrderModal"
                  :disabled="productStore.product.stok === 0"
                  :class="[
                    'btn-secondary w-full py-3 flex items-center justify-center',
                    productStore.product.stok === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                >
                  <i class="fas fa-bolt mr-2"></i>
                  <span>Beli Langsung</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Full Width Recommendations -->
      <section id="rekomendasi" ref="rekomendasiSection" class="mt-12">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Produk Rekomendasi</h2>
            <router-link
              to="/local-cart/products"
              class="text-primary hover:text-primary-light font-medium transition-colors"
            >
              Lihat Semua Produk <i class="fas fa-arrow-right ml-1"></i>
            </router-link>
          </div>

          <!-- Loading Recommended -->
          <div v-if="productStore.loadingRecommended" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p class="mt-2 text-gray-600">Memuat rekomendasi...</p>
          </div>

          <!-- Recommended Products Grid - Menggunakan ProductCard -->
          <div v-else-if="productStore.recommendedProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <ProductCard
              v-for="product in formattedRecommendedProducts"
              :key="product.id"
              :product="product"
              @add-to-cart="handleAddToCartFromRecommendation"
            />
          </div>

          <!-- No Recommendations -->
          <div v-else class="text-center py-8">
            <div class="mx-auto w-16 h-16 text-gray-400 mb-4">
              <i class="fas fa-box-open text-4xl"></i>
            </div>
            <p class="text-gray-600">Belum ada produk rekomendasi</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Direct Order Modal -->
    <DirectOrderModal
      v-if="showDirectOrderModal"
      :show="showDirectOrderModal"
      :product="productStore.product"
      :quantity="directOrderQuantity"
      @close="closeDirectOrderModal"
      @update:quantity="updateDirectOrderQuantity"
      @order-created="handleOrderCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductDetailStore } from '@/stores/public-productDetail'
import ProductCard from '@/components/e-commerce/common/ProductCard.vue'
import DirectOrderModal from '@/components/e-commerce/common/DirectOrderModal.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductDetailStore()

// Refs
const showStickyNav = ref(false)
const activeNav = ref('detail')
const quantity = ref(1)
const starFilter = ref(null)
const reviewSortBy = ref('newest')
const showDirectOrderModal = ref(false)
const directOrderQuantity = ref(1)

const navigations = [
  { id: 'detail', name: 'Detail Produk' },
  { id: 'ulasan', name: 'Ulasan' },
  { id: 'rekomendasi', name: 'Rekomendasi' }
]

// Computed
const productImage = computed(() => {
  if (!productStore.product) return getPlaceholderImage('product')
  return productStore.product.foto || getPlaceholderImage('product')
})


const subtotal = computed(() => {
  if (!productStore.product) return 0
  return productStore.product.harga * quantity.value
})

const formattedRecommendedProducts = computed(() => {
  if (!productStore.recommendedProducts) return []

  return productStore.recommendedProducts.map(product => ({
    id: product.id,
    name: product.nama_produk,
    seller: product.umkm?.nama_umkm || 'UMKM Lokal',
    harga: product.harga,
    rating: product.average_rating || 0,
    reviewCount: product.total_ratings || 0,
    image: product.foto || getPlaceholderImage('product'),
    isFavorite: false,
    stock: product.stok,
    salesCount: product.sales_count || 0,
    isNew: isProductNew(product.created_at)
  }))
})

// Methods
function getPlaceholderImage(type = 'product') {
  const placeholders = {
    product: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    umkm: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    user: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
  return placeholders[type] || placeholders.product
}

function handleImageError(event) {
  event.target.src = getPlaceholderImage()
}

function formatPrice(price) {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0"
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'rb'
  }
  return num.toString()
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function increaseQuantity() {
  if (productStore.product && quantity.value < productStore.product.stok) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function openDirectOrderModal() {
  if (!productStore.product || productStore.product.stok === 0) {
    showNotification('error', 'Stok produk habis')
    return
  }

  // Periksa apakah user sudah login
  const token = localStorage.getItem('token')
  if (!token) {
    showNotification('error', 'Anda harus login terlebih dahulu')
    router.push('/login')
    return
  }

  showDirectOrderModal.value = true
}

function closeDirectOrderModal() {
  showDirectOrderModal.value = false
}

function updateDirectOrderQuantity(newQuantity) {
  directOrderQuantity.value = newQuantity
}

function handleOrderCreated(orderData) {
  console.log('Order created:', orderData)
  showNotification('success', `Pesanan berhasil dibuat! Kode: ${orderData.kode_order}`)

  // Redirect ke halaman order detail
  setTimeout(() => {
    router.push(`/orders/${orderData.id}`)
  }, 2000)
}

function isProductNew(createdAt) {
  if (!createdAt) return false
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return new Date(createdAt) > oneWeekAgo
}

async function handleAddToCartFromRecommendation(product) {
  try {
    await productStore.addToCart(product.id, 1)
    showNotification('success', `${product.name} ditambahkan ke keranjang`)
  } catch (error) {
    showNotification('error', error.message || 'Gagal menambahkan ke keranjang')
  }
}

async function addToCart() {
  if (!productStore.product || productStore.product.stok === 0) return

  try {
    await productStore.addToCart(productStore.product.id, quantity.value)
    showNotification('success', `${productStore.product.nama_produk} ditambahkan ke keranjang`)
  } catch (error) {
    showNotification('error', error.message || 'Gagal menambahkan ke keranjang')
  }
}

function filterByStar(star) {
  starFilter.value = starFilter.value === star ? null : star
  fetchReviews()
}

function resetReviewFilters() {
  starFilter.value = null
  reviewSortBy.value = 'newest'
  fetchReviews()
}

async function fetchReviews() {
  const filters = {}
  if (starFilter.value) {
    filters.rating = starFilter.value
  }
  if (reviewSortBy.value !== 'newest') {
    filters.sort_by = reviewSortBy.value
  }

  await productStore.fetchReviews(route.params.id, 1, filters)
}

async function loadMoreReviews() {
  const nextPage = productStore.reviewPagination.current_page + 1
  const filters = {}
  if (starFilter.value) filters.rating = starFilter.value
  if (reviewSortBy.value !== 'newest') filters.sort_by = reviewSortBy.value

  await productStore.fetchReviews(route.params.id, nextPage, filters)
}

function showNotification(type, message) {
  const event = new CustomEvent('show-notification', {
    detail: { type, message }
  })
  window.dispatchEvent(event)
}

function scrollToSection(sectionId) {
  activeNav.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    const offset = 120
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    })
  }
}

function handleScroll() {
  showStickyNav.value = window.scrollY > 200

  // Determine active navigation based on scroll position
  const sections = ['detail', 'ulasan', 'rekomendasi']
  let currentActive = activeNav.value

  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentActive = section
      }
    }
  }

  activeNav.value = currentActive
}

// Lifecycle Hooks
onMounted(async () => {
  const productId = route.params.id

  try {
    // Load product detail
    await productStore.fetchProductDetail(productId)

    // Load recommendations
    await productStore.fetchRecommendedProducts(productId)

    // Load initial reviews
    await fetchReviews()

    // Setup scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })
  } catch (error) {
    console.error('Error loading product detail:', error)
    showNotification('error', 'Gagal memuat detail produk')
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  productStore.reset()
})

// Watch for route changes
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      quantity.value = 1
      starFilter.value = null
      reviewSortBy.value = 'newest'

      await productStore.fetchProductDetail(newId)
      await productStore.fetchRecommendedProducts(newId)
      await fetchReviews()
    }
  }
)
</script>

<style scoped>
.product-detail-page {
  position: relative;
  min-height: 100vh;
}

/* Sticky Navigation */
.sticky-navigation-container {
  @apply bg-white border-b border-gray-200 z-40 w-full;
  top: 80px;
  position: fixed;
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.sticky-navigation-visible {
  transform: translateY(0);
  opacity: 1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.sticky-navigation-hidden {
  transform: translateY(-100%);
  opacity: 0;
}

.sticky-navigation {
  @apply py-2;
}

.nav-item {
  position: relative;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #1C3FAA;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-item:hover::after {
  width: 100%;
}

/* Sticky Containers */
.sticky-image-container,
.sticky-filter-container,
.sticky-order-container {
  position: sticky;
  top: 140px;
  z-index: 20;
  align-self: flex-start;
  height: fit-content;
  margin-bottom: 1rem;
}

/* Buttons */
.btn-outline {
  @apply border border-primary text-primary font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300;
}

.btn-primary {
  @apply bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary-light transition-all duration-300;
}

.btn-secondary {
  @apply bg-secondary text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300;
}

/* Container */
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .sticky-image-container,
  .sticky-filter-container,
  .sticky-order-container {
    position: relative;
    top: 0;
  }
}
</style>
