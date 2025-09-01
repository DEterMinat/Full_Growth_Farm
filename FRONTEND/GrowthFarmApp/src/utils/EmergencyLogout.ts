import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export default class EmergencyLogout {
  // Force logout and clean up all data
  static async forceLogout(shouldNavigate: boolean = true): Promise<void> {
    try {
      console.log('🚨 Emergency logout initiated');
      
      // Clear ALL data for a clean logout (more aggressive approach)
      await AsyncStorage.clear();
      console.log('🧹 All storage cleared');
      
      if (shouldNavigate) {
        console.log('🚀 Navigating to welcome screen...');
        // Force navigation to welcome
        router.replace('/');
        console.log('✅ Navigation completed');
      }
      
    } catch (error) {
      console.error('❌ Emergency logout failed:', error);
      
      // Force navigation even if clearing fails
      if (shouldNavigate) {
        try {
          router.replace('/');
          console.log('🆘 Fallback navigation completed');
        } catch (navError) {
          console.error('❌ Navigation also failed:', navError);
        }
      }
    }
  }

  // Check if user should be logged out (security check)
  static async shouldForceLogout(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('growth_farm_token');
      const guestMode = await AsyncStorage.getItem('growth_farm_guest_mode');
      
      // Check if token exists but is potentially invalid
      if (token && token === 'invalid_token') {
        return true;
      }
      
      // Check for conflicting states
      if (token && guestMode === 'true') {
        console.log('⚠️ Conflicting auth states detected');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error in shouldForceLogout:', error);
      return true; // Force logout on error for safety
    }
  }

  // Get current auth state for debugging
  static async getDebugInfo(): Promise<string> {
    try {
      const token = await AsyncStorage.getItem('growth_farm_token');
      const guestMode = await AsyncStorage.getItem('growth_farm_guest_mode');
      const userData = await AsyncStorage.getItem('growth_farm_user');
      
      return `Debug Info:
Token: ${token ? 'exists' : 'none'}
Guest: ${guestMode}
User: ${userData ? 'exists' : 'none'}`;
    } catch (error) {
      return `Debug Error: ${error}`;
    }
  }

  // Quick logout without navigation
  static async quickLogout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        'growth_farm_token',
        'growth_farm_user',
        'growth_farm_guest_mode'
      ]);
      console.log('✅ Quick logout completed');
    } catch (error) {
      console.error('❌ Quick logout failed:', error);
    }
  }

  // Logout with user confirmation
  static async logoutWithConfirmation(isGuest: boolean = false): Promise<boolean> {
    console.log('📋 Showing logout confirmation dialog...');
    
    const title = isGuest ? 'Exit Demo' : 'Sign Out';
    const message = isGuest 
      ? 'Are you sure you want to exit demo mode?' 
      : 'Are you sure you want to sign out? This will clear all your session data.';
    
    return new Promise<boolean>((resolve) => {
      Alert.alert(
        title,
        message,
        [
          { 
            text: 'Cancel', 
            style: 'cancel',
            onPress: () => {
              console.log('❌ User cancelled logout');
              resolve(false);
            }
          },
          {
            text: isGuest ? 'Exit Demo' : 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              console.log('✅ User confirmed logout, performing logout...');
              await this.forceLogout(true); // Change to true to navigate
              console.log('🎯 Logout process completed');
              resolve(true);
            }
          }
        ]
      );
    });
  }
}
