import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInLeft,
  SlideInRight
} from 'react-native-reanimated';
import { useAuth } from '@/src/contexts/AuthContext';
import { User } from '@/src/services/authService';
import NavBar from '@/components/navigation/NavBar';
import EmergencyLogout from '@/src/utils/EmergencyLogout';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Dashboard() {
  const { user: authUser, isLoading: authLoading, isGuest } = useAuth();
  const [user, setUser] = useState<User | null>(authUser);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  useEffect(() => {
    console.log('Dashboard useEffect - authUser:', authUser, 'authLoading:', authLoading);
    if (authUser) {
      setUser(authUser);
      console.log('Dashboard - User set:', authUser);
    }
    // Remove auto-redirect to prevent loops
  }, [authUser, authLoading]);

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');
      
      // Use EmergencyLogout for comprehensive logout
      const logoutSuccess = await EmergencyLogout.logoutWithConfirmation(isGuest);
      
      if (logoutSuccess) {
        console.log('Logout completed successfully');
      }
      
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Fallback: Force logout even if there's an error
      await EmergencyLogout.forceLogout(true);
    }
  };

  // Show loading only while AuthContext is loading
  if (authLoading) {
    console.log('Dashboard - showing loading state');
    return (
      <Animated.View 
        style={styles.loadingContainer}
        entering={FadeIn.duration(500)}
      >
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>
    );
  }

  // If no user, show dashboard anyway (for demo purposes)
  const currentUser = user || { 
    full_name: isGuest ? 'Guest User' : 'Demo User', 
    username: isGuest ? 'guest' : 'demo' 
  };

  return (
    <View style={styles.container}>
      <NavBar currentRoute="dashboard" />
      
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(600)}
      >
        <View style={styles.headerLeft}>
          <MaterialIcons name="eco" size={20} color="white" style={styles.leafIcon} />
          <Text style={styles.brandText}>GROWTH FARM</Text>
          {isGuest && (
            <View style={styles.guestBadge}>
              <Text style={styles.guestBadgeText}>DEMO MODE</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.welcomeUser}>Hi, {currentUser?.full_name || currentUser?.username}!</Text>
          <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
            <MaterialIcons name="person" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.content}>
        {/* Current Crop Status */}
        <Animated.View 
          style={styles.statusSection}
          entering={FadeInUp.delay(200).duration(800)}
        >
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Current Crop Status</Text>
            <Text style={styles.statusTime}>
              {isGuest ? 'Demo Data' : 'Updated 10 min ago'}
            </Text>
          </View>
          
          {isGuest && (
            <View style={styles.demoNotice}>
              <Text style={styles.demoNoticeText}>This is example data for demonstration purposes</Text>
            </View>
          )}
          
          <View style={styles.cropStatusGrid}>
            <Animated.View 
              style={styles.cropStatusCard}
              entering={SlideInLeft.delay(400).duration(600)}
            >
              <Text style={styles.cropLabel}>Crop Type</Text>
              <MaterialIcons name="grass" size={24} color="#4CAF50" style={styles.cropIcon} />
              <Text style={styles.cropValue}>Wheat</Text>
            </Animated.View>

            <Animated.View 
              style={styles.cropStatusCard}
              entering={SlideInRight.delay(500).duration(600)}
            >
              <Text style={styles.cropLabel}>Growth Stage</Text>
              <MaterialIcons name="trending-up" size={24} color="#4CAF50" style={styles.cropIcon} />
              <Text style={styles.cropValue}>Flowering</Text>
            </Animated.View>

            <Animated.View 
              style={styles.cropStatusCard}
              entering={SlideInLeft.delay(600).duration(600)}
            >
              <Text style={styles.cropLabel}>Plant Health</Text>
              <MaterialIcons name="favorite" size={24} color="#4CAF50" style={styles.cropIcon} />
              <Text style={styles.cropValue}>Healthy</Text>
            </Animated.View>

            <Animated.View 
              style={styles.cropStatusCard}
              entering={SlideInRight.delay(700).duration(600)}
            >
              <Text style={styles.cropLabel}>Soil Moisture</Text>
              <MaterialIcons name="water-drop" size={24} color="#2196F3" style={styles.cropIcon} />
              <Text style={styles.cropValue}>Optimal</Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Field Overview */}
        <Animated.View 
          style={styles.fieldSection}
          entering={FadeInUp.delay(800).duration(800)}
        >
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldTitle}>Field Overview</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/data-recording')}>
              <Text style={styles.viewDetails}>View Details</Text>
            </TouchableOpacity>
          </View>
          
          {isGuest && (
            <View style={styles.demoNotice}>
              <Text style={styles.demoNoticeText}>Example satellite/drone imagery data</Text>
            </View>
          )}
          
          <View style={styles.fieldImageContainer}>
            <View style={styles.fieldImage}>
              <MaterialIcons name="satellite" size={40} color="#4CAF50" />
              <Text style={styles.droneText}>Drone Survey View</Text>
            </View>
            <View style={styles.fieldLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>Healthy Areas</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.legendText}>Stressed Areas</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Notifications */}
        <Animated.View 
          style={styles.notificationsSection}
          entering={SlideInLeft.delay(1000).duration(800)}
        >
          <View style={styles.notificationsHeader}>
            <Text style={styles.notificationsTitle}>Notifications</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/notifications')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {isGuest && (
            <View style={styles.demoNotice}>
              <Text style={styles.demoNoticeText}>Example notifications and alerts</Text>
            </View>
          )}

          <Animated.View 
            style={styles.notificationItem}
            entering={FadeInUp.delay(1200).duration(600)}
          >
            <View style={[styles.notificationIcon, { backgroundColor: '#4CAF50' }]}>
              <MaterialIcons name="cloud" size={18} color="white" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Rain Expected</Text>
              <Text style={styles.notificationText}>80% chance in next 6 hours</Text>
            </View>
          </Animated.View>

          <Animated.View 
            style={styles.notificationItem}
            entering={FadeInUp.delay(1300).duration(600)}
          >
            <View style={[styles.notificationIcon, { backgroundColor: '#FF9800' }]}>
              <MaterialIcons name="battery-alert" size={18} color="white" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Sensor Battery Low</Text>
              <Text style={styles.notificationText}>Sector B3 needs attention</Text>
            </View>
          </Animated.View>

          <Animated.View 
            style={styles.notificationItem}
            entering={FadeInUp.delay(1400).duration(600)}
          >
            <View style={[styles.notificationIcon, { backgroundColor: '#4CAF50' }]}>
              <MaterialIcons name="thermostat" size={18} color="white" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Temperature Optimal</Text>
              <Text style={styles.notificationText}>Perfect growing conditions</Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Market Prices */}
        <Animated.View 
          style={styles.marketSection}
          entering={SlideInRight.delay(1500).duration(800)}
        >
          <View style={styles.marketHeader}>
            <Text style={styles.marketTitle}>Market Prices</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/marketplace')}>
              <Text style={styles.marketUpdate}>Today&apos;s Update</Text>
            </TouchableOpacity>
          </View>

          <Animated.View 
            style={styles.marketItem}
            entering={FadeInUp.delay(1700).duration(500)}
          >
            <View style={styles.marketCrop}>
              <MaterialIcons name="grass" size={20} color="#4CAF50" style={styles.marketIcon} />
              <Text style={styles.marketName}>Wheat</Text>
            </View>
            <View style={styles.marketPrice}>
              <Text style={styles.priceValue}>$7.25/bushel</Text>
              <MaterialIcons name="arrow-upward" size={16} color="#4CAF50" />
            </View>
          </Animated.View>

          <Animated.View 
            style={styles.marketItem}
            entering={FadeInUp.delay(1800).duration(500)}
          >
            <View style={styles.marketCrop}>
              <MaterialIcons name="grain" size={20} color="#FF9800" style={styles.marketIcon} />
              <Text style={styles.marketName}>Corn</Text>
            </View>
            <View style={styles.marketPrice}>
              <Text style={styles.priceValue}>$4.12/bushel</Text>
              <MaterialIcons name="arrow-downward" size={16} color="#f44336" />
            </View>
          </Animated.View>

          <Animated.View 
            style={styles.marketItem}
            entering={FadeInUp.delay(1900).duration(500)}
          >
            <View style={styles.marketCrop}>
              <MaterialIcons name="agriculture" size={20} color="#8BC34A" style={styles.marketIcon} />
              <Text style={styles.marketName}>Soybeans</Text>
            </View>
            <View style={styles.marketPrice}>
              <Text style={styles.priceValue}>$13.87/bushel</Text>
              <MaterialIcons name="arrow-upward" size={16} color="#4CAF50" />
            </View>
          </Animated.View>
        </Animated.View>

        {/* Voice Assistant */}
        <Animated.View 
          entering={FadeInUp.delay(2000).duration(800)}
        >
          <TouchableOpacity 
            style={styles.voiceAssistant}
            onPress={() => setShowVoiceModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.voiceIcon}>
              <MaterialIcons name="mic" size={24} color="white" />
            </View>
            <View style={styles.voiceContent}>
              <Text style={styles.voiceTitle}>Voice Assistant</Text>
              <Text style={styles.voiceText}>Ask about crop conditions or market prices</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="rgba(255, 255, 255, 0.8)" style={styles.voiceArrow} />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Voice Assistant Modal */}
      <Modal
        visible={showVoiceModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVoiceModal(false)}
        accessible={true}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={styles.modalContent}
            entering={FadeInUp.duration(400)}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Voice Assistant</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowVoiceModal(false)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Close voice assistant modal"
              >
                <MaterialIcons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.voiceModalBody}>
              <View style={styles.microphoneContainer}>
                <TouchableOpacity style={styles.microphoneButton}>
                  <MaterialIcons name="mic" size={32} color="white" />
                </TouchableOpacity>
                <Text style={styles.micStatus}>Tap to speak</Text>
              </View>

              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Try asking:</Text>
                <TouchableOpacity style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>• &ldquo;How is my wheat crop doing?&rdquo;</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>• &ldquo;What are today&apos;s market prices?&rdquo;</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>• &ldquo;Show me weather forecast&rdquo;</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>• &ldquo;Any alerts for my farm?&rdquo;</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.fullVoiceButton}
                onPress={() => {
                  setShowVoiceModal(false);
                  router.push('/(app)/voice-ai');
                }}
              >
                <Text style={styles.fullVoiceText}>Open Full Voice Assistant</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Navigation Bar */}
      <NavBar currentRoute="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leafIcon: {
    marginRight: 8,
  },
  brandText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  welcomeUser: {
    color: 'white',
    fontSize: 12,
    marginBottom: 5,
  },
  profileButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  statusSection: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusTime: {
    fontSize: 12,
    color: '#4CAF50',
  },
  cropStatusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cropStatusCard: {
    width: '48%',
    backgroundColor: '#f0f8f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  cropLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  cropIcon: {
    marginBottom: 8,
  },
  cropValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  fieldSection: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  fieldTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewDetails: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  fieldImageContainer: {
    alignItems: 'center',
  },
  fieldImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e8f5e8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  droneText: {
    fontSize: 14,
    color: '#666',
  },
  fieldLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  notificationsSection: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
  },
  marketSection: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  marketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  marketUpdate: {
    fontSize: 12,
    color: '#4CAF50',
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  marketCrop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marketIcon: {
    marginRight: 10,
  },
  marketName: {
    fontSize: 16,
    color: '#333',
  },
  marketPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  voiceAssistant: {
    backgroundColor: '#4CAF50',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  voiceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  voiceContent: {
    flex: 1,
  },
  voiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  voiceText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  voiceArrow: {
    marginLeft: 10,
  },
  bottomSpace: {
    height: 120,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceModalBody: {
    padding: 20,
  },
  microphoneContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  microphoneButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  micStatus: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#555',
  },
  fullVoiceButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  fullVoiceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guestBadge: {
    backgroundColor: '#FFE4B5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  guestBadgeText: {
    fontSize: 12,
    color: '#B8860B',
    fontWeight: '600',
  },
  demoNotice: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  demoNoticeText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
    textAlign: 'center',
  },
});
