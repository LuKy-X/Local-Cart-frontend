// template-loader.js - MULTI-ROUTE VERSION
let templateLoaded = false
let loadPromise = null

export const loadTemplateAssets = () => {
  // Jika sudah dimuat, return promise yang sudah selesai
  if (templateLoaded) {
    return Promise.resolve()
  }

  // Jika sedang loading, return promise yang sama
  if (loadPromise) {
    return loadPromise
  }

  // Buat promise baru untuk loading
  loadPromise = new Promise((resolve, reject) => {
    let cssLoaded = false
    let jsLoaded = false

    // Fungsi untuk cek semua sudah loaded
    const checkAllLoaded = () => {
      if (cssLoaded && jsLoaded) {
        templateLoaded = true
        resolve()
      }
    }

    // Load CSS
    const cssLink = document.querySelector('link[href*="app.css"]')
    if (cssLink) {
      cssLoaded = true
    } else {
      const templateCSS = document.createElement('link')
      templateCSS.rel = 'stylesheet'
      templateCSS.href = '/src/assets/template/css/app.css'
      templateCSS.onload = () => {
        cssLoaded = true
        checkAllLoaded()
      }
      templateCSS.onerror = (error) => {
        reject(error)
      }
      document.head.appendChild(templateCSS)
    }

    // Load JS
    const jsScript = document.querySelector('script[src*="app.js"]')
    if (jsScript) {
      jsLoaded = true
    } else {
      const templateJS = document.createElement('script')
      templateJS.src = '/src/assets/template/js/app.js'
      templateJS.onload = () => {
        jsLoaded = true
        checkAllLoaded()
      }
      templateJS.onerror = (error) => {
        reject(error)
      }
      document.body.appendChild(templateJS)
    }

    // Jika keduanya sudah ada
    if (cssLoaded && jsLoaded) {
      templateLoaded = true
      resolve()
    }

    // Timeout fallback (optional)
    setTimeout(() => {
      if (!templateLoaded) {
        templateLoaded = true
        resolve()
      }
    }, 3000) // 3 detik timeout
  })

  return loadPromise
}

export const unloadTemplateAssets = (force = false) => {
  // Hanya unload jika force = true atau kita yakin tidak butuh lagi
  if (force) {

    // Hapus CSS
    const css = document.querySelector('link[href*="app.css"]')
    if (css) {
      css.remove()
    }

    // Hapus JS
    const js = document.querySelector('script[src*="app.js"]')
    if (js) {
      js.remove()
    }

    templateLoaded = false
    loadPromise = null
  }
}

// Export status untuk debugging
export const isTemplateLoaded = () => templateLoaded
