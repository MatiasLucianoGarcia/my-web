/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background
        'bg-base': 'var(--color-bg-base)',
        'bg-elevated': 'var(--color-bg-elevated)',
        'bg-muted': 'var(--color-bg-muted)',
        // Text
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        // Accents
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-glow': 'var(--color-accent-glow)',
        // Borders
        border: 'var(--color-border)',
        'border-muted': 'var(--color-border-muted)',
        // Semantic
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '600' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        card: '12px',
        panel: '16px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
        accent: '0 0 24px rgba(124,108,245,0.3)',
        'accent-sm': '0 0 12px rgba(124,108,245,0.2)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out both',
        'fade-in': 'fadeIn 0.4s ease-out both',
        shimmer: 'shimmer 2s infinite linear',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        glass: '12px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: 'var(--color-text-primary)',
            a: {
              color: 'var(--color-accent)',
              '&:hover': { color: 'var(--color-accent-hover)' },
            },
            h1: { color: 'var(--color-text-primary)', fontFamily: '"Plus Jakarta Sans", Inter, system-ui, sans-serif' },
            h2: { color: 'var(--color-text-primary)', fontFamily: '"Plus Jakarta Sans", Inter, system-ui, sans-serif' },
            h3: { color: 'var(--color-text-primary)', fontFamily: '"Plus Jakarta Sans", Inter, system-ui, sans-serif' },
            h4: { color: 'var(--color-text-primary)' },
            strong: { color: 'var(--color-text-primary)' },
            code: {
              color: 'var(--color-accent-hover)',
              backgroundColor: 'var(--color-bg-muted)',
              padding: '0.2em 0.4em',
              borderRadius: '4px',
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: '400',
              fontSize: '0.875em',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            },
            blockquote: {
              borderLeftColor: 'var(--color-accent)',
              color: 'var(--color-text-secondary)',
            },
            hr: { borderColor: 'var(--color-border)' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
