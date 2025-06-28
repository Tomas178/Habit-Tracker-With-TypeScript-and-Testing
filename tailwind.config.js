/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        founders: ['Founders Grotesque'],
      },
      fontSize: {
        primary: '1.5rem',
        secondary: '0.9rem',
      },
      fontWeight: {
        primary: '650',
      },
      colors: {
        'primary-light': 'var(--primary-light)',
        'primary-green': 'var(--primary-green)',
        'primary-dark': 'var(--primary-dark)',
        'primary-error': 'var(--primary-error)',

        'secondary-light': 'var(--secondary-light)',
      },
    },
  },
  plugins: [PrimeUI],
};
