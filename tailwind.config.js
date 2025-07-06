/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        glow: 'var(--color-glow)',
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(to bottom right, var(--color-bg-gradient-from), var(--color-bg-gradient-to))',
      },
    },
  },
  plugins: [],
};
