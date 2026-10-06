import { defineStore } from "pinia";
import UmkmApi from "@/api/umkm";
import ProductApi from "@/api/product";
import RatingApi from "@/api/rating";
import api from "@/api/axios";

export const useUmkmDetailStore = defineStore("umkmDetail", {
  state: () => ({
    umkm: null,
    products: [],
    reviews: [],
    categories: [],
    loading: false,
    productsMeta: {
      total: 0,
      current_page: 1,
      last_page: 1,
      per_page: 12,
    },
    reviewsMeta: {
      total: 0,
      current_page: 1,
      last_page: 1,
      per_page: 5,
    },
    productFilters: {
      categories: [],
      min_price: null,
      max_price: null,
      sort_by: "newest",
      in_stock: false,
      umkmDetail: true,
    },
    reviewFilters: {
      star: null,
      sort_by: "newest",
      featured: false,
    },
  }),

  actions: {
    async fetchUmkmDetail(umkmId) {
      this.loading = true;
      try {
        const { data } = await UmkmApi.getUmkmDetail(umkmId);
        this.umkm = this.processUmkmData(data.data);
        return data;
      } catch (error) {
        console.error("Gagal fetch detail UMKM:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    processUmkmData(umkm) {
      return {
        ...umkm,
        image: this.processImageUrl(umkm.foto_logo),
        location: `${umkm.kecamatan?.nama_kecamatan || ''}, ${umkm.alamat}`,
        rating: umkm.average_rating || 0,
        ratingCount: umkm.total_ratings || 0,
        totalSold: umkm.total_sold || 0,
        productCount: umkm.products_count || 0,
        joinYear: new Date(umkm.created_at).getFullYear(),
      };
    },

    async fetchUmkmProducts(umkmId, page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          per_page: this.productsMeta.per_page,
          ...this.productFilters,
        };

        const { data } = await ProductApi.getProductsByUmkm(umkmId, params);
        this.products = data.data.map(product => ({
          ...product,
          image: this.processImageUrl(product.foto),
          sold: product.total_sold || 0,
        }));

        this.productsMeta = {
          total: data.meta.total,
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
          per_page: data.meta.per_page,
        };

        return data;
      } catch (error) {
        console.error("Gagal fetch produk UMKM:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUmkmReviews(umkmId, page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          per_page: this.reviewsMeta.per_page,
          sort_by: this.reviewFilters.sort_by,
        };

        if (this.reviewFilters.star) {
          params.star = this.reviewFilters.star;
        }

        const { data } = await RatingApi.getUmkmReviews(umkmId, params);
        this.reviews = data.data.map(review => ({
          ...review,
          user: {
            name: review.customer?.nama_customer || review.customer?.user?.name,
            avatar: this.processImageUrl(review.customer?.foto_profil),
          },
          product: review.product?.nama_produk,
          featured: review.is_approved,
          helpful: review.helpful_count || 0,
        }));

        this.reviewsMeta = {
          total: data.meta.total,
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
          per_page: data.meta.per_page,
        };

        return data;
      } catch (error) {
        console.error("Gagal fetch ulasan UMKM:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUmkmCategories(umkmId) {
      try {
        const { data } = await ProductApi.getCategoriesByUmkm(umkmId);
        this.categories = data.map(category => ({
          ...category,
          count: category.products_count || 0,
        }));
        return data;
      } catch (error) {
        console.error("Gagal fetch kategori UMKM:", error);
        throw error;
      }
    },

    async applyProductFilters(filters) {
      this.productFilters = { ...this.productFilters, ...filters };
      this.productsMeta.current_page = 1;
    },

    async applyReviewFilters(filters) {
      this.reviewFilters = { ...this.reviewFilters, ...filters };
      this.reviewsMeta.current_page = 1;
    },

    resetProductFilters() {
      this.productFilters = {
        categories: [],
        min_price: null,
        max_price: null,
        sort_by: "newest",
        in_stock: false,
      };
    },

    resetReviewFilters() {
      this.reviewFilters = {
        star: null,
        sort_by: "newest",
        featured: false,
      };
    },

    processImageUrl(path) {
      if (!path) return '/images/default-product.jpg';
      const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000';
      const cleanPath = path.replace(/^storage\//, '');
      return `${baseUrl}/storage/${cleanPath}`;
    },

    goToProductPage(page) {
      this.productsMeta.current_page = page;
    },

    goToReviewPage(page) {
      this.reviewsMeta.current_page = page;
    },

    async addToCart(productId, quantity = 1) {
      this.cartLoading = true
      try {
        const response = await api.post('/customer/cart/add', {
          product_id: productId,
          quantity: quantity
        })

        if (response.data.success) {
          return {
            success: true,
            message: response.data.message,
            data: response.data.data
          }
        } else {
          throw new Error(response.data.message || 'Gagal menambahkan ke keranjang')
        }
      } catch (error) {
        console.error("Error adding to cart:", error)

        // Handle specific error cases
        if (error.response) {
          const { data } = error.response
          if (data.available_stock !== undefined) {
            throw new Error(`Stok tidak cukup. Stok tersedia: ${data.available_stock}`)
          }
          if (data.message) {
            throw new Error(data.message)
          }
        }
        throw new Error('Gagal menambahkan ke keranjang')
      } finally {
        this.cartLoading = false
      }
    },

    reset() {
      this.umkm = null;
      this.products = [];
      this.reviews = [];
      this.categories = [];
      this.productsMeta = {
        total: 0,
        current_page: 1,
        last_page: 1,
        per_page: 12,
      };
      this.reviewsMeta = {
        total: 0,
        current_page: 1,
        last_page: 1,
        per_page: 5,
      };
      this.resetProductFilters();
      this.resetReviewFilters();
    },
  },

  getters: {
    starDistribution: (state) => {
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      if (!state.reviews || state.reviews.length === 0) {
        return distribution;
      }
      state.reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          distribution[Math.round(review.rating)]++;
        }
      });
      return distribution;
    },

    filteredProducts: (state) => {
      return state.products;
    },

    filteredReviews: (state) => {
      if (!state.reviews || state.reviews.length === 0) {
        return [];
      }

      let reviews = [...state.reviews];

      if (state.reviewFilters.star) {
        reviews = reviews.filter(review => Math.round(review.rating) === state.reviewFilters.star);
      }

      if (state.reviewFilters.featured) {
        reviews = reviews.filter(review => review.featured);
      }

      switch (state.reviewFilters.sort_by) {
        case 'newest':
          reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'highest':
          reviews.sort((a, b) => b.rating - a.rating);
          break;
        case 'lowest':
          reviews.sort((a, b) => a.rating - b.rating);
          break;
        case 'helpful':
          reviews.sort((a, b) => b.helpful - a.helpful);
          break;
      }

      return reviews;
    },

    visibleProductPages: (state) => {
      return getVisiblePages(state.productsMeta.current_page, state.productsMeta.last_page);
    },

    visibleReviewPages: (state) => {
      return getVisiblePages(state.reviewsMeta.current_page, state.reviewsMeta.last_page);
    },
  },
});

function getVisiblePages(currentPage, totalPages) {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}
