import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    alerts: []
  }),

  actions: {
    showNotification(notification) {
      const id = Date.now()
      const alert = {
        id,
        type: notification.type || 'success',
        message: notification.message,
        duration: notification.duration || 5000
      }

      this.alerts.push(alert)

      // Auto remove after duration
      if (alert.duration > 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, alert.duration)
      }

      return id
    },

    removeNotification(id) {
      const index = this.alerts.findIndex(alert => alert.id === id)
      if (index !== -1) {
        this.alerts.splice(index, 1)
      }
    },

    clearAll() {
      this.alerts = []
    }
  }
})
