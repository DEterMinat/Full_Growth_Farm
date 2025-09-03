import { Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Emergency logout utility - can be called from anywhere in the app
export class EmergencyLogout {
  
  // Force clear all authentication data and redirect to welcome
  static async forceLogout(showAlert: boolean = true) {
    try {
      console.log('Emergency logout initiated...');
      
      // Clear all possible auth-related keys
      await this.clearAllStorageData();
      
      // Force redirect to welcome page
      this.forceRedirectToWelcome();
      
      if (showAlert) {
        setTimeout(() => {
          Alert.alert(
            'Signed Out',
            'You have been successfully signed out for security reasons.',
            [{ text: 'OK', style: 'default' }]
          );
        }, 500);
      }
      
      console.log('✅ Emergency logout completed');
      
    } catch (error) {
      console.error('Emergency logout error:', error);
      
      // Still try to redirect even if clearing data fails
      this.forceRedirectToWelcome();
    }
  }
  
  // Clear all authentication-related data from storage
  static async clearAllStorageData() {
    try {
      console.log('Clearing all storage data...');
      
      // Get all keys first
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('All storage keys:', allKeys);
      
      // Filter for auth-related keys
      const authKeys = allKeys.filter(key => 
        key.toLowerCase().includes('token') || 
        key.toLowerCase().includes('auth') || 
        key.toLowerCase().includes('user') || 
        key.toLowerCase().includes('login') || 
        key.toLowerCase().includes('growth_farm')
      );
      
      // Remove auth-related keys
      if (authKeys.length > 0) {
        await AsyncStorage.multiRemove(authKeys);
        console.log('Removed auth keys:', authKeys);
      }
      
      // Also remove specific known keys
      const specificKeys = [
        'growth_farm_token',
        'growth_farm_user',
        'growth_farm_guest_mode',
        'access_token',
        'refresh_token',
        'user_session',
        'auth_token'
      ];
      
      await AsyncStorage.multiRemove(specificKeys);
      console.log('Removed specific keys:', specificKeys);
      
      console.log('✅ All auth data cleared');
      
    } catch (error) {
      console.error('Error clearing storage:', error);
      
      // Try to clear everything as last resort
      try {
        await AsyncStorage.clear();
        console.log('Emergency: Cleared all storage');
      } catch (clearError) {
        console.error('Failed to clear all storage:', clearError);
      }
    }
  }
  
  // Force navigation to welcome page
  static forceRedirectToWelcome() {
    try {
      console.log('Force redirecting to welcome page...');
      
      // Simple redirect to index (welcome screen)
      router.replace('/');
      
    } catch (error) {
      console.error('Navigation error:', error);
      
      // Fallback: Try push instead of replace
      try {
        router.push('/');
      } catch (pushError) {
        console.error('Push navigation also failed:', pushError);
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
      
      // No issues detected
      return false;
      
    } catch (error) {
      console.error('Security check error:', error);
      return false;
    }
  }
  
  // Logout with user confirmation
  static async logoutWithConfirmation(isGuest: boolean = false) {
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

export default EmergencyLogout;
