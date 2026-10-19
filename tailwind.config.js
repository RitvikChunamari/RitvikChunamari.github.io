/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        'cinema-black': '#050507',
        'cinema-white': '#ededed',
        'cinema-gray': '#8e8e93',
        'brand-red': '#FF3B30',
        'warm-white': '#F5F5F0',
      },
      cursor: {
        'none': 'none',
      },
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'slow': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'blur-in': 'blurIn 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-y': 'scaleY 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'scale-x': 'scaleX 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        blurIn: {
          '0%': { filter: 'blur(10px)', opacity: '0', transform: 'translateY(10px)' },
          '100%': { filter: 'blur(0)', opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleY: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
        scaleX: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
