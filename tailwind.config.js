/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        grid: {
          header: '#f0f0f0',
          border: '#d4d4d4',
          selection: '#b4d7ff',
          hover: '#e8f0fe',
        },
      },
    },
  },
  plugins: [],
}
