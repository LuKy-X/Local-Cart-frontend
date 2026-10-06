<template>
  <div class="category-card">
    <router-link
      :to="`/categories/${category.id}`"
      class="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div
        class="w-16 h-16 flex items-center justify-center rounded-full mb-3"
        :style="{ backgroundColor: category.color + '20' }"
      >
        <i :class="category.icon" class="text-2xl" :style="{ color: category.color }"></i>
      </div>
      <span class="text-center font-medium text-gray-800">{{ category.name }}</span>
      <span class="text-gray-500 text-sm mt-1">{{ category.count }} produk</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'CategoryCard',
  props: {
    category: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.category-card:hover {
  transform: translateY(-5px);
}
</style>
