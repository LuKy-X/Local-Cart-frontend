<template>
  <div class="app">
    <div class="flex">
      <Sidebar />
      <div class="content">
        <Topbar />
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/umkm/Sidebar.vue'
import Topbar from '@/components/umkm/Topbar.vue'
import { loadTemplateAssets, unloadTemplateAssets } from '@/assets/template-loader'

export default {
  name: 'UMKMLayout',
  components: {
    Sidebar,
    Topbar
  },
  mounted() {
    console.log('UMKMLayout mounted - loading template')
    loadTemplateAssets()
  },
  beforeUnmount() {
    console.log('UMKMLayout unmounting - unloading template')
    unloadTemplateAssets()
  }
}
</script>

<style>
/* Reset template influence outside umkm */
.app {
  all: initial;
}

.app * {
  box-sizing: border-box;
}

/* Allow template to style only within .app */
.app {
  font-family: inherit;
  line-height: inherit;
}

.content {
  flex: 1;
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>
