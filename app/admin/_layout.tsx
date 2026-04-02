import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== 'admin') {
      router.replace('/(tabs)');
    }
  }, [user, isLoading]);

  if (isLoading || !user || user.role !== 'admin') return null;

  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="event/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="event/edit/[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
