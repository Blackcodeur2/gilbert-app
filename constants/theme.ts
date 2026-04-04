import { Platform } from 'react-native';

export const theme = {
  // Primary - Rose
  primary: '#E8507E',
  primaryLight: '#F7C1D0',
  primaryDark: '#C23B66',
  primarySoft: 'rgba(232, 80, 126, 0.08)',
  primaryMedium: 'rgba(232, 80, 126, 0.15)',

  // Secondary - Gold
  secondary: '#D4A574',
  secondaryLight: '#E8CDB0',
  secondaryDark: '#B8864E',

  // Accent
  accent: '#F5C26B',

  // Background
  background: '#FFFAF7',
  backgroundSecondary: '#FFF0EA',
  surface: '#FFFFFF',

  // Text
  textPrimary: '#2D1B2E',
  textSecondary: '#8B7085',
  textMuted: '#B8A5B2',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',

  // Status
  success: '#4CAF50',
  successLight: '#E8F5E9',
  error: '#E53935',
  errorLight: '#FFEBEE',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  info: '#42A5F5',
  infoLight: '#E3F2FD',

  // Booking status
  statusPending: '#FF9800',
  statusConfirmed: '#4CAF50',
  statusCancelled: '#E53935',
  statusCompleted: '#42A5F5',

  // Border
  border: '#F0E0DA',
  borderLight: '#F8EDE8',
  divider: '#F5EBE6',

  // Overlay
  overlay: 'rgba(45, 27, 46, 0.5)',
  overlayLight: 'rgba(45, 27, 46, 0.3)',
};

export const typography = {
  hero: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  h1: { fontSize: 26, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '600' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  captionBold: { fontSize: 13, fontWeight: '600' as const },
  small: { fontSize: 11, fontWeight: '500' as const, textTransform: 'uppercase' as const, letterSpacing: 0.8 },
  price: { fontSize: 20, fontWeight: '700' as const },
  priceSmall: { fontSize: 16, fontWeight: '700' as const },
  priceLarge: { fontSize: 28, fontWeight: '700' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
  tab: { fontSize: 11, fontWeight: '600' as const },
  sectionTitle: { fontSize: 20, fontWeight: '700' as const },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#2D1B2E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }),
  cardElevated: Platform.select({
    ios: {
      shadowColor: '#2D1B2E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: { elevation: 5 },
    default: {},
  }),
  button: Platform.select({
    ios: {
      shadowColor: '#E8507E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    default: {},
  }),
};
