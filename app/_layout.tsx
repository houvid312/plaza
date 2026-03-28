import '../global.css';
import React, { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Stack, useRouter } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

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

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
        <PasswordRecoveryHandler />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="event/[id]"
            options={{
              presentation: 'card',
              headerShown: true,
              headerTitle: 'Evento',
              headerBackTitle: 'Volver',
              headerTintColor: '#7C3AED',
            }}
          />
          <Stack.Screen
            name="auth/login"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Iniciar Sesión',
              headerTintColor: '#7C3AED',
              headerTitleAlign: 'center',
              headerLeft: AUTH_HEADER_LEFT,
            }}
          />
          <Stack.Screen
            name="auth/register"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Crear Cuenta',
              headerTintColor: '#7C3AED',
              headerTitleAlign: 'center',
              headerLeft: AUTH_HEADER_LEFT,
            }}
          />
          <Stack.Screen
            name="auth/forgot-password"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Recuperar Contraseña',
              headerTintColor: '#7C3AED',
              headerTitleAlign: 'center',
              headerLeft: AUTH_HEADER_LEFT,
            }}
          />
          <Stack.Screen
            name="auth/reset-password"
            options={{
              presentation: 'card',
              headerShown: true,
              headerTitle: 'Nueva Contraseña',
              headerTintColor: '#7C3AED',
              headerTitleAlign: 'center',
              headerBackVisible: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
        <Analytics />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
