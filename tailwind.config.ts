import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'on-primary': 'var(--on-primary)',
        'primary-container': 'var(--primary-container)',
        secondary: 'var(--secondary)',
        'on-secondary': 'var(--on-secondary)',
        'secondary-container': 'var(--secondary-container)',
        error: 'var(--error)',
        'on-error': 'var(--on-error)',
        'error-container': 'var(--error-container)',
        surface: 'var(--surface)',
        'on-surface': 'var(--on-surface)',
        'surface-container': 'var(--surface-container)',
        'surface-container-high': 'var(--surface-container-high)',
        'on-surface-variant': 'var(--on-surface-variant)',
        outline: 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
        success: 'var(--success)',
        'success-container': 'var(--success-container)',
        warning: 'var(--warning)',
        'warning-container': 'var(--warning-container)',
      },
      borderRadius: {
        xs: 'var(--shape-extra-small)',
        sm: 'var(--shape-small)',
        md: 'var(--shape-medium)',
        lg: 'var(--shape-large)',
        xl: 'var(--shape-extra-large)',
        full: 'var(--shape-full)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-xxl)',
      },
    },
  },
  plugins: [],
} satisfies Config;