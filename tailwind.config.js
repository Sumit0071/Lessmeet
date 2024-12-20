/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'custom-bg': "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOneqNCDvP3MY78lMScqXeobhXKIJQcngzYOIZy4iTy0CYZLr1WChVXRk&s')",
      },
      colors: {
        prime: '#212529',
        secondary: '#343a40',
        buttonPrimary: '#d90429'
      }
    },
  },
  plugins: [],
}
