module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#1C3FAA',
        'primary-light': '#2D53CC',
        'primary-dark': '#142E7A',
        secondary: '#FF7A00',
          "secondary-dark": "#4f46e5",
        accent: '#10B981'
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      container: {
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active'],
      transform: ['hover', 'focus'],
      scale: ['hover', 'active'],
    },
  },
  plugins: [],
}
