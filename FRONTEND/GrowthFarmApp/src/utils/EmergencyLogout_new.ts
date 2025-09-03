import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export default class EmergencyLogout {
  // Force logout and clean up all data
  static async forceLogout(shouldNavigate: boolean = true): Promise<void> {
    try {
      console.log('Emergency logout initiated');
      
      // Clear all auth data
      await AsyncStorage.multiRemove([
        'growth_farm_token',
        'growth_farm_user', 
        'growth_farm_guest_mode',
        'growth_farm_remember_me'
      ]);
      
      console.log('All auth data cleared');
      
      if (shouldNavigate) {
        // Simple navigation to home
        router.replace('/');
      }
      
    } catch (error) {
      console.error('Emergency logout failed:', error);
      
      // Try to at least clear critical data
      try {
        await AsyncStorage.removeItem('growth_farm_token');
        await AsyncStorage.removeItem('growth_farm_guest_mode');
      } catch (clearError) {
        console.error('Failed to clear even basic auth data:', clearError);
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
        console.log('Conflicting auth states detected');
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
      console.log('Quick logout completed');
    } catch (error) {
      console.error('Quick logout failed:', error);
    }
  }

  // Logout with user confirmation
  static async logoutWithConfirmation(isGuest: boolean = false): Promise<boolean> {
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
            onPress: () => resolve(false)
          },
          {
            text: isGuest ? 'Exit Demo' : 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              await this.forceLogout(false);
              resolve(true);
            }
          }
        ]
      );
    });
  }
}
