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
import Sidebar from '@/components/admin/Sidebar.vue'
import Topbar from '@/components/admin/Topbar.vue'
import { loadTemplateAssets, unloadTemplateAssets } from '@/assets/template-loader'

export default {
  name: 'AdminLayout',
  components: {
    Sidebar,
    Topbar
  },
  mounted() {
    console.log('AdminLayout mounted - loading template')
    loadTemplateAssets()
  },
  beforeUnmount() {
    console.log('AdminLayout unmounting - unloading template')
    unloadTemplateAssets()
  }
}
</script>

<style>
/* Reset template influence outside admin */
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
</style>
