<template>
  <div id="app" class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <AlertNotification />
      <router-view />
    </main>
    <AppFooter />
    <!-- <ShoppingCart /> -->
  </div>
</template>

<script>
import AppHeader from '@/components/e-commerce/layout/Header.vue'
import AppFooter from '@/components/e-commerce/layout/Footer.vue'
import ShoppingCart from '@/components/e-commerce/common/ShoppingCart.vue'
import AlertNotification from '@/components/AlertNotification.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    ShoppingCart,
    AlertNotification
  },
  data() {
    return {
      cart: []
    }
  }
}
</script>

<style>
/* Global styles can go here */
</style>
