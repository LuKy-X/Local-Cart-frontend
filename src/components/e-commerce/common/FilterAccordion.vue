<template>
  <div class="filter-accordion border border-gray-200 rounded-lg overflow-hidden">
    <button
      @click="$emit('toggle')"
      class="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <span class="font-semibold text-gray-900">{{ title }}</span>
      <i
        :class="[
          'fas transform transition-transform duration-300',
          isOpen ? 'fa-chevron-up text-primary' : 'fa-chevron-down text-gray-500'
        ]"
      ></i>
    </button>

    <transition name="slide-fade">
      <div v-if="isOpen" class="px-4 py-3 bg-white border-t border-gray-200">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'FilterAccordion',
  props: {
    title: {
      type: String,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle']
}
</script>

<style scoped>
.filter-accordion {
  transition: all 0.3s ease;
}
</style>
