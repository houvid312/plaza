import '../global.css';
import React, { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Stack, useRouter } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const queryClient = new QueryClient();

function CloseAuthButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.replace('/(tabs)')}
      hitSlop={12}
      style={{ marginLeft: 8, paddingHorizontal: 4 }}
    >
      <Text style={{ color: '#7C3AED', fontSize: 15, fontWeight: '600' }}>Cerrar</Text>
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

function AppNavigator() {
  const { isDark, colors } = useTheme();
  const themedHeader = {
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: '#7C3AED',
    headerTitleStyle: { color: colors.text },
  };

  return (
    <>
      <PasswordRecoveryHandler />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
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
