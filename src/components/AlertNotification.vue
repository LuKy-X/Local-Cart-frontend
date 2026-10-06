<template>
  <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
    <transition-group name="slide-fade">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        :class="getAlertClasses(alert.type)"
        class="rounded-md flex items-center px-4 py-3 mb-2 shadow-lg transition-all duration-300"
      >
        <i :class="getIconClasses(alert.type)" class="w-5 h-5 mr-3"></i>
        <div class="flex-1">
          <p class="text-sm font-medium">{{ alert.message }}</p>
        </div>
        <button
          @click="removeAlert(alert.id)"
          class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const alerts = computed(() => notificationStore.alerts)

const getAlertClasses = (type) => {
  const classes = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    primary: 'bg-indigo-100 text-indigo-800 border border-indigo-200'
  }
  return classes[type] || classes.info
}

const getIconClasses = (type) => {
  const icons = {
    success: 'fas fa-check-circle text-green-500',
    error: 'fas fa-times-circle text-red-500',
    warning: 'fas fa-exclamation-triangle text-yellow-500',
    info: 'fas fa-info-circle text-blue-500',
    primary: 'fas fa-bell text-indigo-500'
  }
  return icons[type] || 'fas fa-info-circle text-gray-500'
}

const removeAlert = (id) => {
  notificationStore.removeNotification(id)
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
