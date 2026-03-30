import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const THEME_KEY = 'app_dark_mode';

export const LIGHT_COLORS = {
  bg: '#FAFAF8',
  bgAlt: '#FAFAFA',
  surface: '#ffffff',
  surfaceAlt: '#F8F7FF',
  surfacePrimary: '#EDE9FE',
  surfacePrimaryLight: '#F5F3FF',
  text: '#0F0A2A',
  textAlt: '#111827',
  textSub: '#374151',
  textMuted: '#64748B',
  textFaint: '#94A3B8',
  border: '#F3F0FD',
  borderLight: '#F1F5F9',
  borderMedium: '#E2E8F0',
  borderPrimary: '#DDD6FE',
  borderPrimaryLight: '#EEEBF8',
  inputBorder: '#E5E7EB',
  tabBar: '#ffffff',
  tabBarBorder: '#F0EDFD',
};

export const DARK_COLORS = {
  bg: '#0D0B1A',
  bgAlt: '#100E1F',
  surface: '#1A1730',
  surfaceAlt: '#221E3A',
  surfacePrimary: '#231A4A',
  surfacePrimaryLight: '#1A1336',
  text: '#EDE9F9',
  textAlt: '#E8E4F5',
  textSub: '#C4BFDB',
  textMuted: '#8B84AA',
  textFaint: '#5C577A',
  border: '#2A2448',
  borderLight: '#201C3A',
  borderMedium: '#362D58',
  borderPrimary: '#4C3D88',
  borderPrimaryLight: '#352A60',
  inputBorder: '#362D58',
  tabBar: '#1A1730',
  tabBarBorder: '#2A2448',
};

export type ThemeColors = typeof LIGHT_COLORS;

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggleTheme: () => {},
  colors: LIGHT_COLORS,
});

async function getStoredTheme(): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(THEME_KEY) === 'dark';
    }
    const val = await SecureStore.getItemAsync(THEME_KEY);
    return val === 'dark';
  } catch {
    return false;
  }
}

async function storeTheme(dark: boolean) {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
      return;
    }
    await SecureStore.setItemAsync(THEME_KEY, dark ? 'dark' : 'light');
  } catch {}
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    getStoredTheme().then(setIsDark);
  }, []);

  function toggleTheme() {
    setIsDark(prev => {
      const next = !prev;
      storeTheme(next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors: isDark ? DARK_COLORS : LIGHT_COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
