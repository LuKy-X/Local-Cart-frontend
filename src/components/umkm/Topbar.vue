<template>
  <div class="top-bar">

    <!-- Breadcrumb -->
    <div class="-intro-x breadcrumb mr-auto sm:flex">
      <p class="font-bold text-gray-800">UMKM Dashboard</p>
      <i data-feather="chevron-right" class="breadcrumb__icon"></i>
      <p class="">Selamat datang </p>
    </div>

    <!-- User Dropdown -->
    <div class="intro-x relative" ref="dropdownContainer">
      <button
        @click="toggleDropdown"
        class="dropdown-toggle w-10 h-10 rounded-full overflow-hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <!-- Avatar dengan inisial -->
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
          {{ userInitials }}
        </div>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="dropdownOpen"
        class="dropdown-box absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200"
        @click.stop
      >
        <!-- User Info -->
        <div class="px-4 py-3 border-b border-gray-100">
          <div class="font-semibold text-gray-800">{{ currentUser.name }}</div>
          <div class="text-sm text-gray-600 truncate">{{ currentUser.email }}</div>
          <div class="mt-1">
            <span class="inline-block px-2 py-1 text-xs font-medium rounded-full bg-theme-9 text-white">
              UMKM
            </span>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          <router-link
            to="/umkm/profile"
            @click="closeDropdown"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Edit Profile
          </router-link>
          <router-link
            to="/local-cart"
            @click="closeDropdown"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Kembali ke Local Cart
          </router-link>
          <button
            @click="logout"
            class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Refs
const dropdownOpen = ref(false)
const dropdownContainer = ref(null)

// User data
const currentUser = ref({
  name: 'Toko Maju Jaya',
  email: 'umkm@tokomaju.com',
  role: 'umkm'
})

// Computed
const userInitials = computed(() => {
  const name = currentUser.value.name || ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

// Methods
const toggleDropdown = (event) => {
  event.stopPropagation()
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    closeDropdown()
  }
}

const logout = () => {
  // Logout logic here
  console.log('Logging out...')
  router.push('/login')
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-box {
  animation: slideDown 0.15s ease-out;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
