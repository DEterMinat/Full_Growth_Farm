import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, usePathname } from 'expo-router';
import SideMenu from './SideMenu';
import VoiceAIModal from './VoiceAIModal';
import { LanguageToggleButton } from '../LanguageToggleButton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

/*interface NavBarProps {
  currentRoute?: string;
  onMenuPress?: () => void;
}*/

export default function NavBar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  //const [activeTab, setActiveTab] = useState(currentRoute || pathname);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);

  const handleMenuPress = () => {
    setSideMenuVisible(true);
  };

  const closeSideMenu = () => {
    setSideMenuVisible(false);
  };

  const handleVoicePress = () => {
    setVoiceModalVisible(true);
  };

  const closeVoiceModal = () => {
    setVoiceModalVisible(false);
  };

  const handleTabPress = (routePath: string) => {
    if (routePath) { // เช็คว่า routePath ไม่ใช่ค่าว่าง
      router.push(routePath as any);
    }
  };

  const tabs = [
    {
      id: 'menu',
      label: t('common.menu') || 'Menu',
      icon: 'menu',
      route: '',
      isMenu: true,
      isActive: false
    },
    {
      id: 'home',
      label: t('navigation.dashboard') || 'Home',
      icon: 'home',
      route: '/(app)/dashboard',
      //isActive: activeTab === 'home' || activeTab === '/(app)/dashboard'
    },
    {
      id: 'crops',
      label: t('navigation.crops') || 'Crops',
      icon: 'grass',
      route: '/(app)/crops',
      //isActive: activeTab === 'crops' || activeTab === '/(app)/crops'
    },
    {
      id: 'market',
      label: t('navigation.market') || 'Market',
      icon: 'store',
      route: '/(app)/market',
      //isActive: activeTab === 'market' || activeTab === '/(app)/market'
    },
    {
      id: 'marketplace',
      label: t('navigation.marketplace') || 'Marketplace',
      icon: 'storefront',
      route: '/(app)/marketplace',
      //isActive: activeTab === 'marketplace' || activeTab === '/(app)/marketplace'
    },
    {
      id: 'profile',
      label: t('navigation.profile') || 'Profile',
      icon: 'person',
      route: '/(app)/profile',
      //isActive: activeTab === 'profile' || activeTab === '/(app)/profile'
    }
  ];

  return (
    <>
      {/* Floating Voice AI Button */}
      <TouchableOpacity
        style={styles.floatingVoiceButton}
        onPress={handleVoicePress}
        activeOpacity={0.8}
      >
        <View style={styles.floatingVoiceIconContainer}>
          <MaterialIcons name="smart-toy" size={26} color="white" />
        </View>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.container}>
        <View style={styles.navBar}>
          {tabs.map((tab) => {
            const isActive = tab.route ? pathname.startsWith(tab.route) : false;
            if (tab.isMenu) {
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.tabButton}
                  onPress={handleMenuPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.tabContent}>
                    <MaterialIcons 
                      name={tab.icon as any} 
                      size={20} 
                      color="#666" 
                      style={styles.menuIcon} 
                    />
                    <Text style={styles.tabLabel}>{tab.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  isActive && styles.activeTabButton
                ]}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                <View style={styles.tabContent}>
                  <MaterialIcons 
                    name={tab.icon as any} 
                    size={20} 
                    color={isActive ? "#4CAF50" : "#666"}
                    style={styles.tabIcon}
                  />
                  <Text style={[
                    styles.tabLabel,
                    isActive && styles.activeTabLabel
                  ]}>
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Side Menu */}
        <SideMenu
          visible={sideMenuVisible}
          onClose={closeSideMenu}
        />

        {/* Voice AI Modal */}
        <VoiceAIModal
          visible={voiceModalVisible}
          onClose={closeVoiceModal}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    /*position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,*/
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#f8f9fa',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginBottom: 2,
  },
  activeTabIcon: {
    color: '#4CAF50',
  },
  tabLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  menuIcon: {
    marginBottom: 2,
  },
  // Language Toggle Button Styles
  topLanguageToggle: {
    position: 'absolute',
    top: 60, // Below status bar
    left: 20, // Changed from right to left to avoid collision
    zIndex: 1000,
  },
  // Floating Voice AI Button Styles
  floatingVoiceButton: {
    position: 'absolute',
    bottom: 120, // Position above the navbar
    right: 20,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingVoiceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'white',
  },
  floatingVoiceIcon: {
    // removed - now using MaterialIcons directly
  },
});
