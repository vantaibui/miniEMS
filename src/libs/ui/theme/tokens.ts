import { colors } from './colors';

export const tokens = {
  colors: {
    ...colors,
    brand: {
      primary: colors.primary,
      secondary: colors.secondary,
      neutral: colors.neutral,
    },
    action: {
      active: colors.primary[500],
      hover: colors.primary[600],
      selected: colors.primary[50],
      disabled: colors.neutral[300],
    },
  },
  typography: {
    fontFamily: {
      sans: "'Inter', system-ui, -apple-system, sans-serif",
      mono: "'Fira Code', monospace",
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  shape: {
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      full: 9999,
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  zIndex: {
    tooltip: 1500,
    modal: 1300,
    drawer: 1200,
    appBar: 1100,
  },
  components: {
    chip: {
      height: {
        sm: '20px',
        md: '24px',
      },
      fontSize: {
        sm: '0.7rem',
        md: '0.75rem',
      },
    },
    tab: {
      minHeight: '40px',
    },
  },
} as const;
