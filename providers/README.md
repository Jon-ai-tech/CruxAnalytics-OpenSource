# Providers

This directory contains React context providers that are used throughout the application.

## Files

- `i18n-provider.tsx` - Internationalization provider for multi-language support (English/Spanish)
- `theme-provider.tsx` - Theme provider for dark/light mode support

## Usage

Import providers from this directory:

```tsx
import { I18nProvider, useTranslation } from '@/providers/i18n-provider';
import { ThemeProvider, useThemeContext } from '@/providers/theme-provider';
```

## Migration Note

These files were previously located in `lib/`. The old paths (`@/lib/i18n-context` and `@/lib/theme-provider`) still work via compatibility shims but are deprecated.
