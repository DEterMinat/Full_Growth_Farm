import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const { isGuest, logout } = useAuth();
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      subtitle: 'Farm overview and analytics',
      icon: '📊',
      color: '#10B981',
      route: '/(app)/dashboard'
    },
    {
      id: 'crops',
      title: 'Crop Management',
      subtitle: 'Manage your crops and harvests',
      icon: '🌾',
      color: '#059669',
      route: '/(app)/crops'
    },
    {
      id: 'iot-control',
      title: 'IoT Control Center',
      subtitle: 'Monitor and control farm devices',
      icon: '🤖',
      color: '#3B82F6',
      route: '/(app)/iot-control'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      subtitle: 'Buy and sell agricultural products',
      icon: '🛒',
      color: '#9C27B0',
      route: '/(app)/marketplace'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Stay updated with alerts',
      icon: '🔔',
      color: '#F59E0B',
      route: '/(app)/notifications'
    },
    {
      id: 'voice-ai',
      title: 'Voice AI Assistant',
      subtitle: 'Get help with voice commands',
      icon: '🎤',
      color: '#8B5CF6',
      route: '/(app)/voice-ai'
    },
    {
      id: 'profile',
      title: 'Profile Settings',
      subtitle: 'Manage your account settings',
      icon: '👤',
      color: '#6B7280',
      route: '/(app)/profile'
    },
  ];

  const handleMenuItemPress = (route?: string) => {
    onClose();
    if (route) {
      router.push(route as any);
    }
  };

  const handleOverlayPress = () => {
    onClose();
  };

  const handleSignOut = async () => {
    console.log('🚪 SideMenu: Sign out button pressed');
    
    try {
      onClose(); // Close menu first
      
      console.log('🔄 Starting logout process...');
      
      // Call logout directly - it should handle navigation
      console.log('🎯 SideMenu calling logout(true)...');
      await logout(true);
      
    } catch (error) {
      console.error('❌ SideMenu logout error:', error);
      
      // Fallback - clear storage manually and navigate
      console.log('🔄 Fallback: Manual logout...');
      try {
        await AsyncStorage.clear();
        console.log('🗑️ Storage cleared manually');
        
        // Force navigation
        router.replace('/');
        console.log('🚀 Forced navigation to root');
      } catch (fallbackError) {
        console.error('❌ Fallback failed:', fallbackError);
        // Last resort - just navigate
        router.replace('/');
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleOverlayPress}
      >
        <Animated.View
          style={[
            styles.sideMenu,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerIcon}>🌱</Text>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Growth Farm</Text>
                <Text style={styles.headerSubtitle}>
                  {isGuest ? 'Guest Mode' : 'Smart Farming System'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.route)}
                >
                  <View style={[styles.menuItemIcon, { backgroundColor: item.color }]}>
                    <Text style={styles.menuItemIconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
              ))}

              {/* Sign Out Section */}
              <View style={styles.signOutSection}>
                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={handleSignOut}
                >
                  <View style={[styles.menuItemIcon, { backgroundColor: '#EF4444' }]}>
                    <Text style={styles.menuItemIconText}>🚪</Text>
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={[styles.menuItemTitle, { color: '#EF4444' }]}>
                      {isGuest ? 'Exit Demo' : 'Sign Out'}
                    </Text>
                    <Text style={styles.menuItemSubtitle}>
                      {isGuest ? 'Return to welcome screen' : 'Sign out of your account'}
                    </Text>
                  </View>
                  <Text style={[styles.menuItemArrow, { color: '#EF4444' }]}>›</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Version 1.0.0</Text>
              {isGuest && (
                <View style={styles.guestBadge}>
                  <Text style={styles.guestBadgeText}>GUEST MODE</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  sideMenu: {
    width: Math.min(300, width * 0.8),
    height: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemIconText: {
    fontSize: 18,
    color: '#ffffff',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  menuItemArrow: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  signOutSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  guestBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
  },
  guestBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#d97706',
  },
});
