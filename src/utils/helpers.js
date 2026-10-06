// Helper untuk format harga
export const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0'
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

// Helper untuk proses image URL
export const processImageUrl = (fotoPath) => {
  if (!fotoPath) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }

  if (fotoPath.startsWith('http')) {
    return fotoPath
  }

  const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:8000'
  const cleanPath = fotoPath.replace(/^storage\//, '')
  return `${baseUrl}/storage/${cleanPath}`
}

// Helper untuk debounce
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
