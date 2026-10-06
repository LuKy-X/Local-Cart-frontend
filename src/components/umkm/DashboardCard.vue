<template>
  <div class="bg-white rounded-lg shadow-md p-6" :class="`border-l-4 border-${color}-500`">
    <div class="flex items-center">
      <div :class="`p-3 rounded-full bg-${color}-100 text-${color}-600 mr-4`">
        <svg v-if="icon === 'currency'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="icon === 'package'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <svg v-else-if="icon === 'star'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <svg v-else-if="icon === 'users'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 6.147a6 6 0 01-9 0m0 0a6 6 0 00-9 0" />
        </svg>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <div v-if="loading" class="mt-2">
          <div class="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <p v-else class="text-2xl font-bold text-gray-800">{{ value }}</p>
        <p v-if="description && !loading" class="text-xs text-gray-500 mt-1">{{ description }}</p>
      </div>
    </div>
    <div v-if="link && !loading" class="mt-4">
      <router-link :to="link" class="text-sm text-blue-600 hover:text-blue-800">
        Lihat detail →
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true,
    validator: (value) => ['currency', 'package', 'star', 'users'].includes(value)
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'purple', 'yellow', 'green', 'red', 'indigo'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  }
})
</script>
