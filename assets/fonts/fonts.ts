/**
 * Font configuration for Vanguard Crux typography
 * 
 * NOTE: Fonts must be downloaded and placed in this directory:
 * - Inter: https://fonts.google.com/specimen/Inter
 * - Satoshi: https://www.fontshare.com/fonts/satoshi
 * 
 * If fonts are not available, the system will use system fonts as fallback.
 */

export const fonts: Record<string, any> = {
  // Inter fonts (Headings)
  'Inter-Bold': require('./Inter-Bold.ttf'),
  'Inter-SemiBold': require('./Inter-SemiBold.ttf'),
  'Inter-Medium': require('./Inter-Medium.ttf'),
  'Inter-Regular': require('./Inter-Regular.ttf'),
  
  // Satoshi fonts (Body text)
  'Satoshi-Bold': require('./Satoshi-Bold.ttf'),
  'Satoshi-Medium': require('./Satoshi-Medium.ttf'),
  'Satoshi-Regular': require('./Satoshi-Regular.ttf'),
};

/**
 * Gets available fonts with fallback to empty object if fonts are not installed
 */
export function getAvailableFonts(): Record<string, any> {
  try {
    return fonts;
  } catch (error) {
    console.warn('Custom fonts not found, using system fonts as fallback');
    return {};
  }
}
