import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import EmergencyLogout from '@/src/utils/EmergencyLogout';
import { useAuth } from '@/src/contexts/AuthContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function LogoutTestComponent() {
  const { user, isGuest, isAuthenticated } = useAuth();
  
  if (!__DEV__) {
    return null; // Only show in development mode
  }

  const showStatus = () => {
    Alert.alert(
      'Auth Status',
      `User: ${user?.username || 'None'}\nGuest: ${isGuest}\nAuthenticated: ${isAuthenticated}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const testEmergencyLogout = async () => {
    Alert.alert(
      'Test Emergency Logout',
      'This will forcefully clear all auth data and redirect. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Test',
          style: 'destructive',
          onPress: () => EmergencyLogout.forceLogout(true)
        }
      ]
    );
  };

  const testSecurityCheck = async () => {
    try {
      const shouldLogout = await EmergencyLogout.shouldForceLogout();
      Alert.alert(
        'Security Check Result',
        `Should force logout: ${shouldLogout}`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('Error', `Security check failed: ${error}`);
    }
  };

  const clearAllStorage = async () => {
    Alert.alert(
      'Clear All Storage',
      'This will clear ALL storage data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await EmergencyLogout.quickLogout();
            Alert.alert('Success', 'All storage data cleared');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Logout Test Panel</Text>
      <Text style={styles.subtitle}>Development Mode Only</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={showStatus}>
          <Text style={styles.buttonText}>Show Auth Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.emergencyButton} onPress={testEmergencyLogout}>
          <Text style={styles.buttonText}>Test Emergency Logout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testSecurityCheck}>
          <Text style={styles.buttonText}>Security Check</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.warningButton} onPress={clearAllStorage}>
          <Text style={styles.buttonText}>Clear All Storage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 12,
    minWidth: 200,
    zIndex: 9999,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  emergencyButton: {
    backgroundColor: '#FF5722',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  warningButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
