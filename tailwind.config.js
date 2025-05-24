/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  // Enable CSS nesting support
  experimental: {
    optimizeUniversalDefaults: true,
  },
  corePlugins: {
    preflight: true,
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  // Ensure JIT mode is enabled for better performance
  mode: 'jit',
  // Safelist any dynamic classes that might be used
  safelist: [
    'bg-primary-500',
    'hover:bg-primary-600',
    'text-primary-500',
    'hover:text-primary-600',
    'border-primary-500',
    'hover:border-primary-600',
  ],
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx}",
    "./public/**/*.html"
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Base primary color
          600: '#16a34a', // Hover state
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Neutral color palette
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Base colors
        base: {
          DEFAULT: '#ffffff',
          content: '#1f2937',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Status colors
        success: {
          DEFAULT: '#10b981',
          content: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          content: '#ffffff',
        },
        error: {
          DEFAULT: '#ef4444',
          content: '#ffffff',
        },
        info: {
          DEFAULT: '#3b82f6',
          content: '#ffffff',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  // Enable all variants
  variants: {
    extend: {
      backgroundColor: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
      textColor: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
      borderColor: ['responsive', 'hover', 'focus', 'active'],
      opacity: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
      scale: ['responsive', 'hover', 'focus', 'active'],
      transform: ['responsive', 'hover', 'focus', 'active'],
      transitionProperty: ['responsive', 'hover', 'focus'],
      transitionDuration: ['responsive', 'hover', 'focus'],
      transitionTimingFunction: ['responsive', 'hover', 'focus'],
      translate: ['responsive', 'hover', 'focus', 'active'],
    },
  },
  daisyui: {
    themes: ["light", "dark", "cupcake"],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
  },
};
