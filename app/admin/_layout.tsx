import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{ headerTitle: 'Panel Admin', headerTintColor: '#7C3AED' }}
      />
      <Stack.Screen
        name="event/[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
