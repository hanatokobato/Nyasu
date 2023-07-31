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
        'menu-avatar': "url('/menu-avatar.png')"
      },
      colors: {
        'main-center': '#f8f8f8',
        'slate-100': '#ececec',
        error: '#EB5757',
        success: '#23AC38',
      },
    },
  },
  plugins: [],
};
