import { Stack } from 'expo-router';

export default function AdminLayout() {
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
