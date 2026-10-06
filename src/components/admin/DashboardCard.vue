<template>
  <router-link :to="link" class="block">
    <div :class="cardClasses" class="rounded-lg shadow-md p-6 border-l-4 transition-all hover:shadow-lg">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">{{ title }}</p>
          <div v-if="!loading" class="text-2xl font-bold text-gray-800">{{ value }}</div>
          <div v-else class="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div :class="iconContainerClasses" class="p-3 rounded-full">
          <svg v-if="icon === 'users'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <svg v-else-if="icon === 'store'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <svg v-else-if="icon === 'package'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <svg v-else-if="icon === 'shopping-cart'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    required: true,
    validator: (value) => ['users', 'store', 'package', 'shopping-cart'].includes(value)
  },
  color: {
    type: String,
    required: true,
    validator: (value) => ['blue', 'green', 'purple', 'yellow'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: '#'
  }
})

const cardClasses = computed(() => {
  const colors = {
    blue: 'border-blue-500 hover:border-blue-600',
    green: 'border-green-500 hover:border-green-600',
    purple: 'border-purple-500 hover:border-purple-600',
    yellow: 'border-yellow-500 hover:border-yellow-600'
  }
  return colors[props.color] || 'border-gray-500'
})

const iconContainerClasses = computed(() => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  }
  return colors[props.color] || 'bg-gray-100 text-gray-600'
})
</script>
