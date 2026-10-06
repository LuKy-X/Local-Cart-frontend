import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { createPinia } from 'pinia'
import { loadTemplateAssets } from '@/assets/template-loader'
import HomeView from '../views/HomeView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import UmkmLayout from '@/layouts/UmkmLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'umkm',
          name: 'AdminUmkm',
          component: () => import('@/views/admin/Umkm.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'produk',
          name: 'AdminProduk',
          component: () => import('@/views/admin/Product.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'kategori-produk',
          name: 'AdminKategoriProduk',
          component: () => import('@/views/admin/KategoriProduk.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'shipper',
          name: 'AdminShipper',
          component: () => import('@/views/admin/Shipper.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'kecamatan',
          name: 'AdminKecamatan',
          component: () => import('@/views/admin/Kecamatan.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'customer',
          name: 'AdminCustomer',
          component: () => import('@/views/admin/Customer.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'orders',
          name: 'AdminOrders',
          component: () => import('@/views/admin/Orders.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'rating-reviews',
          name: 'AdminRatingReviews',
          component: () => import('@/views/admin/RatingReviews.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'analytic-reports',
          name: 'AdminAnalyitcReports',
          component: () => import('@/views/admin/AnalyitcReports.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
      ]
    },
    {
      path: '/umkm',
      component: UmkmLayout,
      children: [
        {
          path: '',
          name: 'UmkmDashboard',
          component: () => import('@/views/umkm/Dashboard.vue'),
          meta: { requiresAuth: true, role: 'umkm' }
        },
        {
          path: 'products',
          name: 'UmkmProduk',
          component: () => import('@/views/umkm/Products.vue'), // Buat komponen ini
          meta: { requiresAuth: true, role: 'umkm' }
        },
        {
          path: 'orders',
          name: 'UmkmOrders',
          component: () => import('@/views/umkm/Orders.vue'), // Buat komponen ini
          meta: { requiresAuth: true, role: 'umkm' }
        },
        {
          path: 'profile',
          name: 'UmkmProfile',
          component: () => import('@/views/umkm/Profile.vue'), // Buat komponen ini
          meta: { requiresAuth: true, role: 'umkm' }
        },
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register/customer',
      name: 'RegisterCustomer',
      component: () => import('@/views/RegisterCustomer.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register/umkm',
      name: 'RegisterUmkm',
      component: () => import('@/views/RegisterUmkm.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/local-cart',
      component: () => import('@/layouts/E-CommerceLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/e-commerce/Home.vue'),
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('../views/e-commerce/Products.vue'),
        },
        {
          path: 'search',
          name: 'Search',
          component: () => import('@/views/e-commerce/Search.vue'),
          meta: {
            title: 'Pencarian - LocalCart',
            requiresAuth: false
          }
        },
        {
          path: 'products/:id',
          name: 'ProductDetail',
          component: () => import('@/views/e-commerce/ProductDetail.vue'),
          props: true
        },
        {
          path: 'umkm/:id',
          name: 'UmkmDetail',
          component: () => import('@/views/e-commerce/UmkmDetail.vue')
        },
        {
          path: 'cart',
          name: 'Cart',
          component: () => import('@/views/e-commerce/Cart.vue')
        },
        {
          path:'orders',
          name: 'Order',
          component: () => import('@/views/e-commerce/Orders.vue'),
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/e-commerce/Profile.vue'),
        }
      ]
    },
  ],
})


router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.token) {
    return next('/login')
  }

  // if (to.meta.role && auth.user?.role !== to.meta.role) {
  //   return next('/forbidden')  // atau halaman 403
  // }

  if (to.meta.requiresGuest && auth.token) {
    if (auth.user?.role === 'admin') return next('/admin');
    if (auth.user?.role === 'customer') return next('/local-cart');
    if (auth.user?.role === 'umkm') return next('/umkm');

    console.log('ROLE:', auth.user?.role)

    return next('/');
  }

  next()
})

// List of routes that need template
const TEMPLATE_ROUTES = ['/umkm', '/admin'] // tambahkan sesuai kebutuhan

const needsTemplate = (path) => {
  return TEMPLATE_ROUTES.some(route => path.startsWith(route))
}

router.beforeResolve(async (to, from) => {
  const toNeedsTemplate = needsTemplate(to.path)
  const fromNeedsTemplate = needsTemplate(from.path)

  if (toNeedsTemplate) {
    await loadTemplateAssets()
  }

})

export default router
