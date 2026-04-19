// src/theme/index.js
// Central design system: colors, typography, spacing

export const darkTheme = {
  mode: 'dark',
  colors: {
    background: '#0A0A0F',
    surface: '#12121A',
    surfaceElevated: '#1C1C2A',
    primary: '#00D4FF',       // Cyan accent
    primaryDim: '#0099BB',
    secondary: '#7B61FF',     // Purple accent
    danger: '#FF4D6D',
    warning: '#FFB347',
    success: '#00E676',
    text: '#F0F0FF',
    subtext: '#8888AA',
    border: '#2A2A3F',
    cardBg: '#16162A',
    alarmActive: '#00D4FF22',
    alarmInactive: '#ffffff08',
  },
  typography: {
    fontFamily: 'System',
    sizes: { xs: 11, sm: 13, md: 15, lg: 18, xl: 24, xxl: 32, hero: 56 },
    weights: { regular: '400', medium: '500', semibold: '600', bold: '700', heavy: '800' },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius: { sm: 8, md: 14, lg: 20, xl: 28, full: 999 },
};

export const lightTheme = {
  mode: 'light',
  colors: {
    background: '#F0F4FF',
    surface: '#FFFFFF',
    surfaceElevated: '#E8EDFF',
    primary: '#0066CC',
    primaryDim: '#004499',
    secondary: '#6B4FCC',
    danger: '#E53935',
    warning: '#F57C00',
    success: '#00897B',
    text: '#0A0A1F',
    subtext: '#555577',
    border: '#CCCCEE',
    cardBg: '#FFFFFF',
    alarmActive: '#0066CC15',
    alarmInactive: '#00000008',
  },
  typography: {
    fontFamily: 'System',
    sizes: { xs: 11, sm: 13, md: 15, lg: 18, xl: 24, xxl: 32, hero: 56 },
    weights: { regular: '400', medium: '500', semibold: '600', bold: '700', heavy: '800' },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius: { sm: 8, md: 14, lg: 20, xl: 28, full: 999 },
};
