import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const THEME_KEY = 'app_dark_mode';

export const LIGHT_COLORS = {
  bg: '#FAF8F3',
  bgAlt: '#F7F4EE',
  surface: '#ffffff',
  surfaceAlt: '#FAF7F0',
  surfacePrimary: '#F5EDE0',
  surfacePrimaryLight: '#FAF5ED',
  text: '#1A1710',
  textAlt: '#111827',
  textSub: '#3D3628',
  textMuted: '#6B6355',
  textFaint: '#948B7A',
  border: '#F0EBE0',
  borderLight: '#F1EDE4',
  borderMedium: '#E2DDD2',
  borderPrimary: '#DDD0B8',
  borderPrimaryLight: '#F0EBE0',
  inputBorder: '#E5E0D5',
  tabBar: '#ffffff',
  tabBarBorder: '#EDE5D8',
};

export const DARK_COLORS = {
  bg: '#1A1710',
  bgAlt: '#1E1B14',
  surface: '#252117',
  surfaceAlt: '#302A1E',
  surfacePrimary: '#3A2E1A',
  surfacePrimaryLight: '#2D2415',
  text: '#F0E8DA',
  textAlt: '#EBE3D3',
  textSub: '#C8BFAE',
  textMuted: '#8A8070',
  textFaint: '#5E5649',
  border: '#3D3425',
  borderLight: '#302A1E',
  borderMedium: '#4A3F2E',
  borderPrimary: '#7A6340',
  borderPrimaryLight: '#5C4A30',
  inputBorder: '#4A3F2E',
  tabBar: '#252117',
  tabBarBorder: '#3D3425',
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
