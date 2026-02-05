import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, View, useColorScheme as useSystemColorScheme } from "react-native";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SchemeColors, type ColorScheme } from "@/constants/theme";

type ThemeMode = 'light' | 'dark' | 'auto';

const THEME_STORAGE_KEY = '@business_case_analyzer:theme_mode';

type ThemeContextValue = {
  colorScheme: ColorScheme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? "light";
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark'); // Force dark mode by default
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('dark'); // Force dark mode by default

  // Load saved theme preference on mount, default to dark mode
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto')) {
          setThemeModeState(savedMode as ThemeMode);
          if (savedMode !== 'auto') {
            setColorSchemeState(savedMode as ColorScheme);
          }
        } else {
          // No saved preference, set dark mode as default
          await AsyncStorage.setItem(THEME_STORAGE_KEY, 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    loadThemePreference();
  }, []);

  // Listen to system theme changes when in auto mode
  useEffect(() => {
    if (themeMode === 'auto') {
      setColorSchemeState(systemScheme);
    }
  }, [systemScheme, themeMode]);

  const applyScheme = useCallback((scheme: ColorScheme) => {
    nativewindColorScheme.set(scheme);
    Appearance.setColorScheme?.(scheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = scheme;
      root.classList.toggle("dark", scheme === "dark");
      const palette = SchemeColors[scheme];
      Object.entries(palette).forEach(([token, value]) => {
        root.style.setProperty(`--color-${token}`, value);
      });
    }
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      
      if (mode === 'auto') {
        setColorSchemeState(systemScheme);
        applyScheme(systemScheme);
      } else {
        setColorSchemeState(mode as ColorScheme);
        applyScheme(mode as ColorScheme);
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [systemScheme, applyScheme]);

  useEffect(() => {
    applyScheme(colorScheme);
  }, [applyScheme, colorScheme]);

  const themeVariables = useMemo(
    () =>
      vars({
        "color-primary": SchemeColors[colorScheme].primary,
        "color-background": SchemeColors[colorScheme].background,
        "color-surface": SchemeColors[colorScheme].surface,
        "color-foreground": SchemeColors[colorScheme].foreground,
        "color-muted": SchemeColors[colorScheme].muted,
        "color-border": SchemeColors[colorScheme].border,
        "color-success": SchemeColors[colorScheme].success,
        "color-warning": SchemeColors[colorScheme].warning,
        "color-error": SchemeColors[colorScheme].error,
      }),
    [colorScheme],
  );

  const value = useMemo(
    () => ({
      colorScheme,
      themeMode,
      setThemeMode,
    }),
    [colorScheme, themeMode, setThemeMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVariables]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}
