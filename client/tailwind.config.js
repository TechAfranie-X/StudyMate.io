/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        // Design System Colors
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        'surface-alt': 'var(--color-surface-alt)',
        
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          rgb: 'rgb(var(--color-primary-rgb))',
          5: 'rgb(var(--color-primary-rgb) / 0.05)',
          10: 'rgb(var(--color-primary-rgb) / 0.1)',
          20: 'rgb(var(--color-primary-rgb) / 0.2)',
          30: 'rgb(var(--color-primary-rgb) / 0.3)',
          50: 'rgb(var(--color-primary-rgb) / 0.5)',
          100: 'rgb(var(--color-primary-rgb) / 0.1)',
          200: 'rgb(var(--color-primary-rgb) / 0.2)',
          300: 'rgb(var(--color-primary-rgb) / 0.3)',
          400: 'rgb(var(--color-primary-rgb) / 0.4)',
          500: 'rgb(var(--color-primary-rgb) / 0.5)',
          600: 'rgb(var(--color-primary-rgb) / 0.6)',
          700: 'rgb(var(--color-primary-rgb) / 0.7)',
          800: 'rgb(var(--color-primary-rgb) / 0.8)',
          900: 'rgb(var(--color-primary-rgb) / 0.9)',
          950: 'rgb(var(--color-primary-rgb) / 0.95)',
        },
        
        accent: {
          DEFAULT: 'var(--color-accent)',
          rgb: 'rgb(var(--color-accent-rgb))',
          10: 'rgb(var(--color-accent-rgb) / 0.1)',
          20: 'rgb(var(--color-accent-rgb) / 0.2)',
          50: 'rgb(var(--color-accent-rgb) / 0.05)',
          100: 'rgb(var(--color-accent-rgb) / 0.1)',
          200: 'rgb(var(--color-accent-rgb) / 0.2)',
          300: 'rgb(var(--color-accent-rgb) / 0.3)',
          400: 'rgb(var(--color-accent-rgb) / 0.4)',
          500: 'rgb(var(--color-accent-rgb) / 0.5)',
          600: 'rgb(var(--color-accent-rgb) / 0.6)',
          700: 'rgb(var(--color-accent-rgb) / 0.7)',
          800: 'rgb(var(--color-accent-rgb) / 0.8)',
          900: 'rgb(var(--color-accent-rgb) / 0.9)',
          950: 'rgb(var(--color-accent-rgb) / 0.95)',
        },
        
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        
        border: {
          DEFAULT: 'var(--color-border)',
          light: 'var(--color-border-light)',
        },
        
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
      
      spacing: {
        '2': 'var(--spacing-1)',
        '3': 'var(--spacing-2)',
        '4': 'var(--spacing-3)',
        '5': 'var(--spacing-4)',
        '6': 'var(--spacing-5)',
        '8': 'var(--spacing-6)',
        '10': 'var(--spacing-8)',
        '12': 'var(--spacing-10)',
        '16': 'var(--spacing-12)',
      },
      
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        'full': 'var(--radius-full)',
      },
      
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
      
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
        'slow': 'var(--transition-slow)',
      },
      
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      animation: {
        'fade-in': 'fadeIn var(--transition-normal) ease-out',
        'slide-up': 'slideUp var(--transition-normal) ease-out',
        'scale-in': 'scaleIn var(--transition-normal) ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [forms(), typography()],
}

