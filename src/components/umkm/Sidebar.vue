<template>
  <nav class="side-nav">
    <a href="" class="intro-x flex items-center pl-5 pt-4">
      <span class="hidden xl:block text-white text-lg ml-3"> Local<span class="font-medium">Cart</span> </span>
    </a>
    <div class="side-nav__devider my-6"></div>
    <ul>
      <li>
        <router-link to="/umkm" class="side-menu" :class="{'side-menu--active': isActive('/umkm')}">
          <div class="side-menu__icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div class="side-menu__title"> Dashboard </div>
        </router-link>
      </li>
      <li>
        <router-link to="/umkm/products" class="side-menu" :class="{'side-menu--active': isActive('/umkm/products')}">
          <div class="side-menu__icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div class="side-menu__title"> Produk </div>
        </router-link>
      </li>
      <li>
        <router-link to="/umkm/orders" class="side-menu" :class="{'side-menu--active': isActive('/umkm/orders')}">
          <div class="side-menu__icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div class="side-menu__title"> Pesanan </div>
        </router-link>
      </li>
      <li>
        <router-link to="/umkm/profile" class="side-menu" :class="{'side-menu--active': isActive('/umkm/profile')}">
          <div class="side-menu__icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="side-menu__title"> Profil </div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
  if (path === '/umkm') {
    return route.path === '/umkm'
  }
  return route.path.startsWith(path)
}
</script>
