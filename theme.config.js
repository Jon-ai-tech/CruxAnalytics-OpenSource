/** @type {const} */
const themeColors = {
  primary: { light: '#14B8A6', dark: '#14B8A6' }, // Teal 500 - Vanguard Precision Palette
  background: { light: '#FFFFFF', dark: '#020617' }, // Slate 950 - Vanguard dark background
  surface: { light: '#F8F9FA', dark: '#0F172A' }, // Slate 900 - Vanguard surface
  foreground: { light: '#1A1A1A', dark: '#FFFFFF' },
  muted: { light: '#687076', dark: '#9BA1A6' },
  border: { light: '#E5E7EB', dark: 'rgba(255, 255, 255, 0.1)' }, // White/10 for dark mode
  success: { light: '#86EFAC', dark: '#86EFAC' }, // Mint 400 - Vanguard success
  warning: { light: '#FB923C', dark: '#FB923C' }, // Coral 500 - Vanguard warning
  error: { light: '#EF4444', dark: '#F87171' },
  tint: { light: '#14B8A6', dark: '#14B8A6' },
  // Vanguard accent colors
  'accent-mint': { light: '#86EFAC', dark: '#86EFAC' },
  'accent-coral': { light: '#FB923C', dark: '#FB923C' },
  'accent-teal': { light: '#14B8A6', dark: '#14B8A6' },
  'gradient-start': { light: '#14B8A6', dark: '#14B8A6' },
  'gradient-end': { light: '#86EFAC', dark: '#86EFAC' },
};

module.exports = { themeColors };
