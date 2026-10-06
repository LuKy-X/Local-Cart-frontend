<template>
  <div class="auth-layout">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
  mounted() {
    // Hapus Midone CSS jika masih ada
    this.removeMidoneAssets();
  },
  methods: {
    removeMidoneAssets() {
      // Hapus Midone CSS
      const midoneCSS = document.querySelector('link[href*="app.css"]');
      if (midoneCSS) {
        midoneCSS.remove();
      }

      // Hapus Midone JS
      const midoneJS = document.querySelector('script[src*="app.js"]');
      if (midoneJS) {
        midoneJS.remove();
      }
    }
  }
}
</script>
