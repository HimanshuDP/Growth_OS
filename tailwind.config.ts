import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      colors: {
        'bg-base': '#080C14',
        'bg-surface': '#0F1629',
        'bg-card': '#162040',
        'brand-orange': '#FF6B35',
        'brand-teal': '#00C9A7',
        'brand-gold': '#FFD166',
        'text-primary': '#F0F4FF',
        'text-secondary': '#8B9CC8',
        'text-muted': '#4A5A80',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-saffron': 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
        'gradient-teal': 'linear-gradient(135deg, #00C9A7 0%, #00E8C2 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
