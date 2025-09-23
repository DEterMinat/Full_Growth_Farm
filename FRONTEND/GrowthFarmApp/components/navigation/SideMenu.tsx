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
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const { t } = useTranslation();
  const { isGuest, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const menuItems = [
    {
      id: 'voice-ai',
      title: t('sidemenu.voice_ai_title'),
      subtitle: t('sidemenu.voice_ai_subtitle'),
      icon: 'mic',
      color: '#8B5CF6',
      route: '/(app)/voice-ai'
    },
    {
      id: 'iot-control',
      title: t('sidemenu.iot_control_title'),
      subtitle: t('sidemenu.iot_control_subtitle'),
      icon: 'smart-toy',
      color: '#3B82F6',
      route: '/(app)/iot-control'
    },
    {
      id: 'notifications',
      title: t('sidemenu.notifications_title'),
      subtitle: t('sidemenu.notifications_subtitle'),
      icon: 'notifications',
      color: '#F59E0B',
      route: '/(app)/notifications'
    },
  ];

  const handleMenuItemPress = (route?: string) => {
    console.log('🎯 Menu item pressed:', route);
    onClose();
    if (route) {
      console.log('🚀 Navigating to:', route);
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
      console.log('🎯 SideMenu calling logout()...');
      await logout();
      
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
            { 
              transform: [{ translateX: slideAnim }],
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            }
          ]}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={(e) => e.stopPropagation()}
            style={{ flex: 1 }}
          >
            {/* Header */}
            <View style={styles.header}>
              <MaterialIcons name="eco" size={24} color="#4CAF50" />
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
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <ScrollView 
              style={styles.menuContainer} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              bounces={Platform.OS === 'ios'}
            >
              {menuItems.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => {
                      console.log('🎯 Menu item clicked:', item.title, item.route);
                      handleMenuItemPress(item.route);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.menuItemIcon, { backgroundColor: item.color }]}>
                      <MaterialIcons name={item.icon as any} size={20} color="white" />
                    </View>
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color="#999" />
                  </TouchableOpacity>
                );
              })}

              {/* Sign Out Section */}
              <View style={styles.signOutSection}>
                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={handleSignOut}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuItemIcon, { backgroundColor: '#EF4444' }]}>
                    <MaterialIcons name="logout" size={20} color="white" />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={[styles.menuItemTitle, { color: '#EF4444' }]}>
                      {isGuest ? t('sidemenu.exit_demo') : t('sidemenu.sign_out')}
                    </Text>
                    <Text style={styles.menuItemSubtitle}>
                      {isGuest ? t('sidemenu.return_welcome') : t('sidemenu.sign_out_subtitle')}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color="#EF4444" />
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
    width: Math.min(320, width * 0.85), // เพิ่มขนาดสำหรับหน้าจอเล็ก
    height: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8fafc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
    minHeight: 60, // กำหนดความสูงขั้นต่ำ
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
    paddingVertical: 8,
    paddingHorizontal: 4, // เพิ่ม padding ซ้าย-ขวา
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
    minHeight: 56, // กำหนดความสูงขั้นต่ำสำหรับ touch target
    backgroundColor: 'transparent', // กลับเป็น transparent
    ...Platform.select({
      ios: {
        backgroundColor: 'transparent',
      },
      android: {
        backgroundColor: 'transparent',
        borderRadius: 8,
      },
    }),
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    marginTop: 16,
    paddingTop: 16,
    marginHorizontal: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 0,
    borderRadius: 8,
    minHeight: 56,
    backgroundColor: 'transparent',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    minHeight: 60, // กำหนดความสูงขั้นต่ำ
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
