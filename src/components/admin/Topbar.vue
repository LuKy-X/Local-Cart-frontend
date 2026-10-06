<template>
  <div class="top-bar">

    <AlertNotification ref="alertRef" :auto-remove="3000"/>

    <!-- Breadcrumb -->
    <div class="-intro-x breadcrumb mr-auto hidden sm:flex">
      <a href="" class="">Application</a>
      <i data-feather="chevron-right" class="breadcrumb__icon"></i>
      <a href="" class="breadcrumb--active">Dashboard</a>
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
          <div class="font-semibold text-gray-800">{{ authStore.user?.name || 'User' }}</div>
          <div class="text-sm text-gray-600 truncate">{{ authStore.user?.email || 'No email' }}</div>
          <div class="mt-1">
            <span :class="getRoleBadgeClass(authStore.user?.role)" class="inline-block px-2 py-1 text-xs font-medium rounded-full">
              {{ getRoleText(authStore.user?.role) }}
            </span>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          <button
            @click="openProfileModal"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Edit Profile
          </button>
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

    <!-- Profile Modal -->
    <div v-if="showProfileModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeProfileModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-fade-in">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-800">Edit Profile</h3>
          <button @click="closeProfileModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <form @submit.prevent="updateProfile" class="p-6 space-y-4">
          <!-- Name Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              v-model="profileForm.name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="{ 'border-red-500': formErrors.name }"
              placeholder="Masukkan nama lengkap"
            />
            <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</p>
          </div>

          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              v-model="profileForm.email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="{ 'border-red-500': formErrors.email }"
              placeholder="Masukkan email"
            />
            <p v-if="formErrors.email" class="mt-1 text-sm text-red-600">{{ formErrors.email }}</p>
          </div>

          <!-- Password Change Section -->
          <div class="pt-4 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Ganti Password</h4>

            <!-- Current Password -->
            <div class="mb-3">
              <label class="block text-xs font-medium text-gray-600 mb-1">Password Saat Ini</label>
              <div class="relative">
                <input
                  :type="showCurrentPassword ? 'text' : 'password'"
                  v-model="profileForm.current_password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                  :class="{ 'border-red-500': formErrors.current_password }"
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  tabindex="-1"
                >
                  <svg v-if="showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p v-if="formErrors.current_password" class="mt-1 text-xs text-red-600">{{ formErrors.current_password }}</p>
            </div>

            <!-- New Password -->
            <div class="mb-3">
              <label class="block text-xs font-medium text-gray-600 mb-1">Password Baru</label>
              <div class="relative">
                <input
                  :type="showNewPassword ? 'text' : 'password'"
                  v-model="profileForm.new_password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                  :class="{ 'border-red-500': formErrors.new_password }"
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  tabindex="-1"
                >
                  <svg v-if="showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p v-if="formErrors.new_password" class="mt-1 text-xs text-red-600">{{ formErrors.new_password }}</p>
            </div>

            <!-- Confirm New Password -->
            <div v-if="profileForm.new_password">
              <label class="block text-xs font-medium text-gray-600 mb-1">Konfirmasi Password Baru</label>
              <div class="relative">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="profileForm.new_password_confirmation"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                  placeholder="Ulangi password baru"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  tabindex="-1"
                >
                  <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p v-if="formErrors.new_password_confirmation" class="mt-1 text-xs text-red-600">{{ formErrors.new_password_confirmation }}</p>
            </div>
          </div>

          <!-- Messages -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-3">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm text-red-600">{{ errorMessage }}</span>
            </div>
          </div>

          <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-md p-3">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm text-green-600">{{ successMessage }}</span>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span class="ml-2 text-sm text-gray-600">Menyimpan perubahan...</span>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeProfileModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              :disabled="loading"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AuthApi from '@/api/auth'
import AlertNotification from '@/components/AlertNotification.vue'

const authStore = useAuthStore()
const router = useRouter()

// Refs
const dropdownOpen = ref(false)
const dropdownContainer = ref(null)
const showProfileModal = ref(false)
const loading = ref(false)
const formErrors = ref({})
const alertRef = ref(null)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const profileForm = ref({
  name: '',
  email: '',
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

// Computed
const userInitials = computed(() => {
  const name = authStore.user?.name || ''
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

const openProfileModal = () => {
  // Isi form dengan data user saat ini
  profileForm.value = {
    name: authStore.user?.name || '',
    email: authStore.user?.email || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  }
  formErrors.value = {}
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
  showProfileModal.value = true
  closeDropdown()
}

const closeProfileModal = () => {
  showProfileModal.value = false
}

const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'bg-red-100 text-red-800',
    umkm: 'bg-green-100 text-green-800',
    customer: 'bg-blue-100 text-blue-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const getRoleText = (role) => {
  const texts = {
    admin: 'Admin',
    umkm: 'UMKM',
    customer: 'Customer'
  }
  return texts[role] || role
}

const validateForm = () => {
  formErrors.value = {}
  let isValid = true

  // Validate name
  if (!profileForm.value.name.trim()) {
    formErrors.value.name = 'Nama tidak boleh kosong'
    isValid = false
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!profileForm.value.email) {
    formErrors.value.email = 'Email tidak boleh kosong'
    isValid = false
  } else if (!emailRegex.test(profileForm.value.email)) {
    formErrors.value.email = 'Format email tidak valid'
    isValid = false
  }

  // Validate password if new password is provided
  if (profileForm.value.new_password) {
    if (!profileForm.value.current_password) {
      formErrors.value.current_password = 'Password saat ini diperlukan'
      isValid = false
    }

    if (profileForm.value.new_password.length < 8) {
      formErrors.value.new_password = 'Password minimal 8 karakter'
      isValid = false
    }

    if (profileForm.value.new_password !== profileForm.value.new_password_confirmation) {
      formErrors.value.new_password = 'Konfirmasi password tidak cocok'
      isValid = false
    }
  }

  return isValid
}

const updateProfile = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    const payload = {
      name: profileForm.value.name,
      email: profileForm.value.email
    }

    // Tambahkan password jika diisi
    if (profileForm.value.new_password) {
      payload.current_password = profileForm.value.current_password
      payload.new_password = profileForm.value.new_password
      payload.new_password_confirmation = profileForm.value.new_password_confirmation
    }

    // Kirim ke API updateProfile
    const response = await AuthApi.updateProfile(payload)

    // PERBAIKAN: Response dari updateProfile sekarang memiliki format { user, message }
    // Simpan data user ke store dan localStorage
    authStore.user = response.data.user
    localStorage.setItem('user', JSON.stringify(response.data.user))

    // Tampilkan pesan sukses
    alertRef.value?.addAlert(response.data.message || 'Profile berhasil diperbarui!', 'success')

    // Tutup modal setelah 1.5 detik
    setTimeout(() => {
      closeProfileModal()
    }, 1500)

  } catch (error) {
    console.error('Error updating profile:', error)

    // PERBAIKAN: Tidak perlu restore dari localStorage karena data di store masih valid
    if (error.response?.status === 422) {
      const errors = error.response.data.errors
      formErrors.value = Object.keys(errors).reduce((acc, key) => {
        acc[key] = errors[key][0]
        return acc
      }, {})
      alertRef.value?.addAlert('Terjadi kesalahan validasi', 'error')
    } else if (error.response?.data?.message) {
      alertRef.value?.addAlert(error.response.data.message, 'error')
    } else {
      alertRef.value?.addAlert('Terjadi kesalahan saat memperbarui profile', 'error')
    }
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  try {
    // Panggil API logout server-side
    await AuthApi.logout()
  } catch (error) {
    console.error('Error logging out:', error)
    // Tetap lanjutkan logout client-side meski API error
  } finally {
    // Clear store dan localStorage
    authStore.logout()

    // Redirect ke login page
    router.push('/login')
  }
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

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

button:focus {
  outline: none;
}
</style>
