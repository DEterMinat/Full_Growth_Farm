import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import 'react-native-reanimated';
import { router, useRootNavigationState } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import React, { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { LanguageProvider } from '@/src/contexts/LanguageContext';
import '@/src/i18n/i18n';

// --- สร้าง "ผู้ควบคุม" (RootLayoutNav) ---
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key || isLoading) {
      // ถ้ายังไม่พร้อม หรือกำลังโหลด ให้รอ
      return;
    }

    if (isAuthenticated) {
      // ถ้าล็อกอินแล้ว ให้พาไปที่หน้าหลัก (app)
      router.replace('/(app)/dashboard');
    } else {
      // ถ้ายังไม่ได้ล็อกอิน ให้พาไปที่หน้าต้อนรับ (auth)
      router.replace('/(auth)/welcome');
    }
  }, [isAuthenticated, isLoading, navigationState?.key]); // ให้ทำงานเมื่อค่าเหล่านี้เปลี่ยน

  // ระหว่างที่กำลังตรวจสอบสถานะ เราจะยังไม่แสดงหน้าจอใดๆ
  if (isLoading || !navigationState?.key) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
            <Text style={{ fontSize: 18, color: '#2e7d32' }}>Checking Authentication...</Text>
        </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 18, color: '#2e7d32' }}>Loading Fonts...</Text>
      </View>
    );
  }

  // ในฟังก์ชัน RootLayout (แก้ไขแล้ว)
  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

