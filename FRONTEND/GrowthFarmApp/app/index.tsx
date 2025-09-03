import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const authContext = useAuth();
  const { isAuthenticated, isLoading, isGuest } = authContext;
  const loginAsGuest = authContext?.loginAsGuest;

  const handleGuestLogin = async () => {
    try {
      console.log('🎭 Handling Guest login from welcome screen...');
      console.log('🎭 loginAsGuest type:', typeof loginAsGuest);
      console.log('🎭 loginAsGuest function:', loginAsGuest);
      
      if (typeof loginAsGuest !== 'function') {
        console.log('🔧 loginAsGuest not available, using manual guest login...');
        
        // Manual guest login fallback
        await AsyncStorage.setItem('growth_farm_guest_mode', 'true');
        await AsyncStorage.removeItem('growth_farm_token');
        
        console.log('✅ Manual guest login completed');
        router.replace('/(app)/dashboard');
        return;
      }
      
      await loginAsGuest();
      console.log('🎭 Guest login successful, navigating to dashboard...');
      router.replace('/(app)/dashboard');
    } catch (error) {
      console.error('🎭 Guest login error:', error);
      
      try {
        // Emergency fallback
        console.log('🆘 Using emergency guest login...');
        await AsyncStorage.setItem('growth_farm_guest_mode', 'true');
        await AsyncStorage.removeItem('growth_farm_token');
        router.replace('/(app)/dashboard');
      } catch (fallbackError) {
        console.error('All guest login methods failed:', fallbackError);
        // Last resort: Navigate to login page
        router.push('/(auth)/login');
      }
    }
  };

  useEffect(() => {
    // Redirect if user is authenticated or in guest mode
    if (!isLoading && (isAuthenticated || isGuest)) {
      console.log('🔄 Index: Redirecting to dashboard', { isAuthenticated, isGuest });
      router.replace('/(app)/dashboard');
    }
  }, [isAuthenticated, isLoading, isGuest]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="eco" size={40} color="#4CAF50" />
        <Text style={styles.loadingText}>Growth Farm</Text>
        <Text style={styles.subText}>Initializing...</Text>
      </View>
    );
  }

  // Show welcome screen for non-authenticated users
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="eco" size={64} color="#4CAF50" style={styles.logo} />
          <Text style={styles.title}>Growth Farm</Text>
          <Text style={styles.subtitle}>Smart Agriculture Management</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestLogin}
          >
            <MaterialIcons name="person" size={18} color="#007AFF" />
            <Text style={styles.guestButtonText}>Try as Guest</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>
          Manage your farm efficiently with IoT monitoring, market insights, and AI-powered recommendations.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#2e7d32',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#2e7d32',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  guestButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  guestButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
});
