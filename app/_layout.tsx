import '../global.css';
import React, { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Stack, useRouter, usePathname } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Platform, TouchableOpacity, Text } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const INTRO_SEEN_KEY = 'intro_seen';

const queryClient = new QueryClient();

function CloseAuthButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.replace('/(tabs)')}
      hitSlop={12}
      style={{ marginLeft: 8, paddingHorizontal: 4 }}
    >
      <Text style={{ color: '#B87333', fontSize: 15, fontWeight: '600' }}>Cerrar</Text>
    </TouchableOpacity>
  );
}

const AUTH_HEADER_LEFT = () => <CloseAuthButton />;

function PasswordRecoveryHandler() {
  const { isPasswordRecovery } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isPasswordRecovery) {
      router.replace('/auth/reset-password');
    }
  }, [isPasswordRecovery]);
  return null;
}

function IntroRedirector() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Intro uses GSAP + HTML elements, only available on web
    if (Platform.OS !== 'web') return;
    // Don't redirect if already on intro (avoids remount loop)
    if (pathname === '/intro') return;

    let seen = false;
    try { seen = localStorage.getItem(INTRO_SEEN_KEY) === '1'; } catch {}
    if (!seen) {
      router.replace('/intro');
    }
  }, [pathname]);

  return null;
}

function AppNavigator() {
  const { isDark, colors } = useTheme();
  const themedHeader = {
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: '#B87333',
    headerTitleStyle: { color: colors.text },
  };

  return (
    <>
      <PasswordRecoveryHandler />
      <IntroRedirector />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="intro"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="lupa"
          options={{
            ...themedHeader,
            presentation: 'card',
            headerShown: true,
            headerTitle: 'La Lupa del Tiempo',
            headerBackTitle: 'Inicio',
          }}
        />
        <Stack.Screen
          name="event/[id]"
          options={{
            ...themedHeader,
            presentation: 'card',
            headerShown: true,
            headerTitle: 'Evento',
            headerBackTitle: 'Volver',
          }}
        />
        <Stack.Screen
          name="auth/login"
          options={{
            ...themedHeader,
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Iniciar Sesión',
            headerTitleAlign: 'center',
            headerLeft: AUTH_HEADER_LEFT,
          }}
        />
        <Stack.Screen
          name="auth/register"
          options={{
            ...themedHeader,
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Crear Cuenta',
            headerTitleAlign: 'center',
            headerLeft: AUTH_HEADER_LEFT,
          }}
        />
        <Stack.Screen
          name="auth/forgot-password"
          options={{
            ...themedHeader,
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Recuperar Contraseña',
            headerTitleAlign: 'center',
            headerLeft: AUTH_HEADER_LEFT,
          }}
        />
        <Stack.Screen
          name="auth/reset-password"
          options={{
            ...themedHeader,
            presentation: 'card',
            headerShown: true,
            headerTitle: 'Nueva Contraseña',
            headerTitleAlign: 'center',
            headerBackVisible: false,
          }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Analytics />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppNavigator />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
