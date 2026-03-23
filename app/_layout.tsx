import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';

const queryClient = new QueryClient();

export default function RootLayout() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
            }}
          />
          <Stack.Screen
            name="auth/register"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Crear Cuenta',
              headerTintColor: '#7C3AED',
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
