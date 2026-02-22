export const colors = {
  // Primary Palette - Blue
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
    950: '#001E3C',
  },
  // Secondary Palette - Orange
  secondary: {
    50: '#FFF4E5',
    100: '#FFE7CC',
    200: '#FFD199',
    300: '#FFBA66',
    400: '#FFA433',
    500: '#FF8E00',
    600: '#CC7200',
    700: '#995500',
    800: '#663900',
    900: '#331C00',
    950: '#1A0800',
  },
  // Neutral Palette - Gray
  neutral: {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
    950: '#111827',
  },
  // Semantic Colors
  success: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
  },
  warning: {
    main: '#ED6C02',
    light: '#FF9800',
    dark: '#E65100',
  },
} as const;

export type ColorPalette = typeof colors;
