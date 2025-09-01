import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, usePathname } from 'expo-router';
import SideMenu from './SideMenu';
import VoiceAIModal from './VoiceAIModal';

interface NavBarProps {
  currentRoute?: string;
  onMenuPress?: () => void;
}

export default function NavBar({ currentRoute }: NavBarProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(currentRoute || pathname);
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

  const handleTabPress = (route: string, routePath: string) => {
    setActiveTab(route);
    if (routePath !== pathname) {
      router.push(routePath as any);
    }
  };

  const tabs = [
    {
      id: 'menu',
      label: 'Menu',
      icon: '☰',
      route: '',
      isMenu: true,
      isActive: false
    },
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      route: '/(app)/dashboard',
      isActive: activeTab === 'home' || activeTab === '/(app)/dashboard'
    },
    {
      id: 'crops',
      label: 'Crops',
      icon: '🌾',
      route: '/(app)/crops',
      isActive: activeTab === 'crops' || activeTab === '/(app)/crops'
    },
    {
      id: 'voice',
      label: '',
      icon: '🎤',
      route: '',
      isVoice: true,
      isActive: false
    },
    {
      id: 'market',
      label: 'Market',
      icon: '🏪',
      route: '/(app)/market',
      isActive: activeTab === 'market' || activeTab === '/(app)/market'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      route: '/(app)/profile',
      isActive: activeTab === 'profile' || activeTab === '/(app)/profile'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {tabs.map((tab) => {
          if (tab.isMenu) {
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabButton}
                onPress={handleMenuPress}
                activeOpacity={0.7}
              >
                <View style={styles.tabContent}>
                  <Text style={styles.menuIcon}>{tab.icon}</Text>
                  <Text style={styles.tabLabel}>{tab.label}</Text>
                </View>
              </TouchableOpacity>
            );
          }

          if (tab.isVoice) {
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.voiceButton}
                onPress={handleVoicePress}
                activeOpacity={0.8}
              >
                <View style={styles.voiceIconContainer}>
                  <Text style={styles.voiceIcon}>{tab.icon}</Text>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                tab.isActive && styles.activeTabButton
              ]}
              onPress={() => handleTabPress(tab.id, tab.route)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Text style={[
                  styles.tabIcon,
                  tab.isActive && styles.activeTabIcon
                ]}>
                  {tab.icon}
                </Text>
                <Text style={[
                  styles.tabLabel,
                  tab.isActive && styles.activeTabLabel
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
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    fontSize: 20,
    marginBottom: 2,
    color: '#666',
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
  voiceButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  voiceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  voiceIcon: {
    fontSize: 22,
    color: 'white',
  },
  menuIcon: {
    fontSize: 20,
    marginBottom: 2,
    color: '#666',
  },
});
