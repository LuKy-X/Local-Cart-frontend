<template>
  <div class="py-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Kategori Produk</h1>
        <p class="text-gray-600 mt-1">Kelola kategori untuk produk UMKM Anda</p>
      </div>
      <button
        @click="showAddModal = true"
        class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-localcart-600 hover:bg-localcart-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-localcart-500"
      >
        <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Tambah Kategori
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Kategori</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="p-3 rounded-lg bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Produk</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalProducts }}</p>
          </div>
          <div class="p-3 rounded-lg bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Kategori Terpopuler</p>
            <p class="text-lg font-bold text-gray-900 truncate">{{ stats.popularCategory }}</p>
          </div>
          <div class="p-3 rounded-lg bg-purple-100 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Rata-rata Produk/Kategori</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.avgProductsPerCategory }}</p>
          </div>
          <div class="p-3 rounded-lg bg-yellow-100 text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center" :style="{ backgroundColor: category.color + '20', color: category.color }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
                <p class="text-sm text-gray-500">ID: {{ category.id }}</p>
              </div>
            </div>
            <div class="relative">
              <button
                @click="toggleCategoryMenu(category.id)"
                class="p-1 rounded-full hover:bg-gray-100"
              >
                <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              <!-- Dropdown Menu -->
              <div
                v-if="activeMenu === category.id"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
              >
                <button
                  @click="editCategory(category)"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  @click="deleteCategory(category)"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>

          <p class="text-gray-600 mb-4">{{ category.description }}</p>

          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center">
              <svg class="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span class="text-gray-600">{{ category.productCount }} produk</span>
            </div>
            <div class="flex items-center">
              <svg class="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-gray-600">{{ formatDate(category.updatedAt) }}</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Status:</span>
            <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              {{ category.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="categories.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada kategori</h3>
      <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat kategori pertama Anda.</p>
      <div class="mt-6">
        <button
          @click="showAddModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-localcart-600 hover:bg-localcart-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-localcart-500"
        >
          <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Kategori
        </button>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full" :class="editCategoryData ? 'bg-blue-100' : 'bg-green-100'">
              <svg class="h-6 w-6" :class="editCategoryData ? 'text-blue-600' : 'text-green-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="editCategoryData" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ editCategoryData ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
              </h3>
            </div>
          </div>
          <div class="mt-5">
            <form @submit.prevent="saveCategory">
              <div class="space-y-4">
                <div>
                  <label for="category-name" class="block text-sm font-medium text-gray-700">Nama Kategori</label>
                  <input
                    type="text"
                    id="category-name"
                    v-model="categoryForm.name"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-localcart-500 focus:border-localcart-500 sm:text-sm"
                    placeholder="Contoh: Makanan"
                  />
                </div>
                <div>
                  <label for="category-description" class="block text-sm font-medium text-gray-700">Deskripsi</label>
                  <textarea
                    id="category-description"
                    v-model="categoryForm.description"
                    rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-localcart-500 focus:border-localcart-500 sm:text-sm"
                    placeholder="Deskripsi kategori (opsional)"
                  ></textarea>
                </div>
                <div>
                  <label for="category-color" class="block text-sm font-medium text-gray-700">Warna</label>
                  <div class="mt-1 flex items-center space-x-2">
                    <div
                      v-for="color in colorOptions"
                      :key="color"
                      @click="categoryForm.color = color"
                      class="h-8 w-8 rounded-full cursor-pointer border-2"
                      :class="[
                        categoryForm.color === color ? 'border-gray-400' : 'border-transparent'
                      ]"
                      :style="{ backgroundColor: color }"
                    ></div>
                  </div>
                </div>
                <div>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="categoryForm.status"
                      true-value="active"
                      false-value="inactive"
                      class="h-4 w-4 text-localcart-600 focus:ring-localcart-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Aktifkan kategori</span>
                  </label>
                </div>
              </div>
              <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-localcart-600 text-base font-medium text-white hover:bg-localcart-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-localcart-500 sm:col-start-2 sm:text-sm"
                >
                  {{ editCategoryData ? 'Simpan Perubahan' : 'Tambah Kategori' }}
                </button>
                <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-localcart-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  @click="closeModal"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// State
const showAddModal = ref(false)
const showEditModal = ref(false)
const activeMenu = ref(null)
const editCategoryData = ref(null)

// Stats
const stats = ref({
  total: 8,
  totalProducts: 156,
  popularCategory: 'Makanan',
  avgProductsPerCategory: 19.5
})

// Category form
const categoryForm = reactive({
  name: '',
  description: '',
  color: '#3B82F6',
  status: 'active'
})

// Color options
const colorOptions = ref([
  '#3B82F6', // blue
  '#10B981', // green
  '#8B5CF6', // purple
  '#F59E0B', // yellow
  '#EF4444', // red
  '#EC4899'  // pink
])

// Categories data
const categories = ref([
  {
    id: 1,
    name: 'Makanan',
    description: 'Produk makanan dan bahan makanan',
    color: '#10B981',
    productCount: 45,
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10'
  },
  {
    id: 2,
    name: 'Minuman',
    description: 'Minuman berbagai jenis',
    color: '#3B82F6',
    productCount: 28,
    status: 'active',
    createdAt: '2024-01-16',
    updatedAt: '2024-03-08'
  },
  {
    id: 3,
    name: 'Pakaian',
    description: 'Pakaian pria, wanita, dan anak',
    color: '#8B5CF6',
    productCount: 32,
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-05'
  },
  {
    id: 4,
    name: 'Elektronik',
    description: 'Alat elektronik rumah tangga',
    color: '#F59E0B',
    productCount: 18,
    status: 'active',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-01'
  },
  {
    id: 5,
    name: 'Rumah Tangga',
    description: 'Peralatan rumah tangga',
    color: '#EF4444',
    productCount: 25,
    status: 'active',
    createdAt: '2024-02-05',
    updatedAt: '2024-02-28'
  },
  {
    id: 6,
    name: 'Kesehatan',
    description: 'Produk kesehatan dan obat',
    color: '#EC4899',
    productCount: 8,
    status: 'inactive',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-25'
  }
])

// Methods
const toggleCategoryMenu = (categoryId) => {
  activeMenu.value = activeMenu.value === categoryId ? null : categoryId
}

const editCategory = (category) => {
  editCategoryData.value = { ...category }
  categoryForm.name = category.name
  categoryForm.description = category.description
  categoryForm.color = category.color
  categoryForm.status = category.status
  activeMenu.value = null
  showEditModal.value = true
}

const deleteCategory = (category) => {
  if (confirm(`Hapus kategori "${category.name}"?`)) {
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      stats.value.total--
    }
  }
  activeMenu.value = null
}

const saveCategory = () => {
  if (editCategoryData.value) {
    // Update existing category
    const index = categories.value.findIndex(c => c.id === editCategoryData.value.id)
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index],
        name: categoryForm.name,
        description: categoryForm.description,
        color: categoryForm.color,
        status: categoryForm.status,
        updatedAt: new Date().toISOString().split('T')[0]
      }
    }
  } else {
    // Add new category
    const newCategory = {
      id: categories.value.length + 1,
      name: categoryForm.name,
      description: categoryForm.description,
      color: categoryForm.color,
      productCount: 0,
      status: categoryForm.status,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    categories.value.push(newCategory)
    stats.value.total++
  }

  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editCategoryData.value = null
  resetForm()
}

const resetForm = () => {
  categoryForm.name = ''
  categoryForm.description = ''
  categoryForm.color = '#3B82F6'
  categoryForm.status = 'active'
}

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
