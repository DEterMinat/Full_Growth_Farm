import { Stack } from 'expo-router';
import { CartProvider } from '@/src/contexts/CartContext';
import React from 'react';

export default function AppLayout() {
  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="dashboard" options={{ headerShown: false, title: 'Dashboard' }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="crops" options={{ headerShown: false }} />
        <Stack.Screen name="marketplace" options={{ headerShown: false }} />
        <Stack.Screen name="iot-control" options={{ headerShown: false }} />
        <Stack.Screen name="data-recording" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="team-communication" options={{ headerShown: false }} />
        <Stack.Screen name="plan-access" options={{ headerShown: false }} />
        <Stack.Screen name="voice-ai" options={{ headerShown: false }} />
      </Stack>
    </CartProvider>
  );
}
