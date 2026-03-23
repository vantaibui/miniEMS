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
    surface: {
      // Note: these use exact hex values found in component code — do not replace with nearest palette shade
      pageBg: '#f1f5f9',           // PageLayout page content background
      modalHeader: '#f8fafc',      // modal header/toolbar surface (neutral-50ish)
      tableHead: '#e5eaf2',        // table head row background (neutral-100)
      dividerSubtle: '#e2e8f0',    // subtle dividers in modal surfaces
    },
    sidebar: {
      overlay: 'rgba(255, 255, 255, 0.08)',
      overlayHover: 'rgba(255, 255, 255, 0.10)',
      overlayActive: 'rgba(255, 255, 255, 0.15)',
    },
    dialog: {
      iconErrorBg: 'rgba(211, 47, 47, 0.08)',
      iconWarningBg: 'rgba(237, 108, 2, 0.10)',
      iconSuccessBg: 'rgba(46, 125, 50, 0.10)',
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
    btnPrimary: '0px 4px 12px rgba(11, 87, 208, 0.20)',
    modal: '0px 20px 40px rgba(15, 23, 42, 0.20)',
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
