import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInLeft,
  SlideInRight
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/contexts/AuthContext';
import { LanguageToggleButton } from '@/components/LanguageToggleButton';
import { User } from '@/src/services/authService';
import { weatherService, WeatherData } from '@/src/services/weatherService';
import NavBar from '@/components/navigation/NavBar';
import EmergencyLogout from '@/src/utils/EmergencyLogout';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(authUser);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const isGuest = !authUser || authUser.username === 'guest';
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser, authLoading]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await weatherService.getCurrentWeather();
        setWeather(data);
      } catch (error) {
        console.error("Failed to load weather on dashboard:", error);
        setWeather({
          city: "N/A",
          temperature: 0,
          condition: "Cloudy",
          humidity: 0,
          windSpeed: 0,
        });
      }
    };
    fetchWeather();
  }, []);


  const handleLogout = async () => {
    try {
      const logoutSuccess = await EmergencyLogout.logoutWithConfirmation(isGuest);
      if (logoutSuccess) {
        console.log('Logout completed successfully');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      await EmergencyLogout.forceLogout(true);
    }
  };

  const WeatherCard = ({ data }: { data: WeatherData }) => {
    const weatherIcons = {
      Sunny: 'wb-sunny',
      Cloudy: 'cloud',
      Rainy: 'grain',
      Stormy: 'flash-on',
      Windy: 'filter-drama'
    };
    const currentCondition = data.condition || 'Cloudy';
    const iconName = weatherIcons[currentCondition] || 'cloud';

    return (
      <Animated.View style={styles.weatherSection} entering={FadeInUp.duration(800)}>
        <View style={styles.weatherHeader}>
          <MaterialIcons name="location-on" size={16} color="#333" />
          <Text style={styles.weatherCity}>{data.city || 'Unknown City'}</Text>
        </View>
        <View style={styles.weatherBody}>
          <View style={styles.weatherTempContainer}>
            <MaterialIcons name={iconName as any} size={48} color="#4a90e2" />
            <Text style={styles.weatherTemp}>{data.temperature || 0}°C</Text>
            <Text style={styles.weatherCondition}>{t(`weather.${currentCondition.toLowerCase()}`)}</Text>
          </View>
          <View style={styles.weatherDetails}>
            <View style={styles.detailItem}>
              <MaterialIcons name="opacity" size={16} color="#666" />
              <Text style={styles.detailText}>{t('weather.humidity')}: {data.humidity || 0}%</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="toys" size={16} color="#666" />
              <Text style={styles.detailText}>{t('weather.wind')}: {data.windSpeed || 0} km/h</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  if (authLoading) {
    return (
      <Animated.View
        style={styles.loadingContainer}
        entering={FadeIn.duration(500)}
      >
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>
    );
  }

  const currentUser = user || {
    full_name: isGuest ? 'Guest User' : 'Demo User',
    username: isGuest ? 'guest' : 'demo'
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar ด้านบน */}
      <NavBar currentRoute="dashboard" />
      
      {/* Header */}
      <Animated.View
        style={styles.header}
        entering={FadeInDown.duration(600)}
      >
        <View style={styles.headerLeft}>
          <MaterialIcons name="eco" size={20} color="white" style={styles.leafIcon} />
          <Text style={styles.brandText}>{t('dashboard.growth_farm')}</Text>
          {isGuest && (
            <View style={styles.guestBadge}>
              <Text style={styles.guestBadgeText}>{t('common.demo_mode')}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeUser}>{t('dashboard.hi_user')}, {currentUser?.full_name || currentUser?.username}!</Text>
          </View>
          <LanguageToggleButton size="small" style={styles.languageButton} />
          <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
            <MaterialIcons name="person" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.content}>
        
        {/* Weather Card */}
        {weather && <WeatherCard data={weather} />}

        {/* Current Crop Status */}
        <Animated.View
          style={styles.statusSection}
          entering={FadeInUp.delay(200).duration(800)}
        >
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>{t('dashboard.current_crop_status')}</Text>
            <Text style={styles.statusTime}>
              {isGuest ? t('common.demo_data') : t('common.updated') + ' 10 min ago'}
            </Text>
          </View>
          
          {isGuest && (
            <View style={styles.demoNotice}>
              <Text style={styles.demoNoticeText}>{t('dashboard.demo_notice')}</Text>
            </View>
          )}
          
          <View style={styles.cropStatusGrid}>
            <Animated.View
              style={styles.cropStatusCard}
              entering={SlideInLeft.delay(400).duration(600)}
            >
              <Text style={styles.cropLabel}>{t('dashboard.crop_type')}</Text>
              <MaterialIcons name="grass" size={24} color="#4CAF50" style={styles.cropIcon} />
              <Text style={styles.cropValue}>{t('dashboard.wheat')}</Text>
            </Animated.View>

            <Animated.View
              style={styles.cropStatusCard}
              entering={SlideInRight.delay(500).duration(600)}
            >
              <Text style={styles.cropLabel}>{t('dashboard.growth_stage')}</Text>
              <MaterialIcons name="trending-up" size={24} color="#4CAF50" style={styles.cropIcon} />
              <Text style={styles.cropValue}>{t('dashboard.flowering')}</Text>
            </Animated.View>

            <Animated.View
              style={styles.cropStatusCard}
              entering={SlideInLeft.delay(600).duration(600)}
            >
              <Text style={styles.cropLabel}>{t('dashboard.plant_health')}</Text>
              <MaterialIcons name="favorite" size={24} color="#4CAF50" style={styles.cropIcon} />
              <Text style={styles.cropValue}>{t('dashboard.healthy')}</Text>
            </Animated.View>

            <Animated.View
              style={styles.cropStatusCard}
              entering={SlideInRight.delay(700).duration(600)}
            >
              <Text style={styles.cropLabel}>{t('dashboard.soil_moisture')}</Text>
              <MaterialIcons name="water-drop" size={24} color="#2196F3" style={styles.cropIcon} />
              <Text style={styles.cropValue}>{t('dashboard.optimal')}</Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Field Overview */}
        <Animated.View
          style={styles.fieldSection}
          entering={FadeInUp.delay(800).duration(800)}
        >
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldTitle}>{t('dashboard.field_overview')}</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/data-recording')}>
              <Text style={styles.viewDetails}>{t('dashboard.view_details')}</Text>
            </TouchableOpacity>
          </View>
          
          {isGuest && (
            <View style={styles.demoNotice}>
              <Text style={styles.demoNoticeText}>{t('dashboard.example_satellite_data')}</Text>
            </View>
          )}
          
          <View style={styles.fieldImageContainer}>
            <View style={styles.fieldImage}>
              <MaterialIcons name="satellite" size={40} color="#4CAF50" />
              <Text style={styles.droneText}>{t('dashboard.drone_survey_view')}</Text>
            </View>
            <View style={styles.fieldLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>{t('dashboard.healthy_areas')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.legendText}>{t('dashboard.stressed_areas')}</Text>
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
            <Text style={styles.notificationsTitle}>{t('notifications.title')}</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/notifications')}>
              <Text style={styles.seeAll}>{t('dashboard.see_all')}</Text>
            </TouchableOpacity>
          </View>

          {isGuest && (
            <View style={styles.demoNotice}>
              <Text style={styles.demoNoticeText}>{t('dashboard.example_notifications')}</Text>
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
              <Text style={styles.notificationTitle}>{t('dashboard.rain_expected')}</Text>
              <Text style={styles.notificationText}>{t('dashboard.rain_expected_desc')}</Text>
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
              <Text style={styles.notificationTitle}>{t('dashboard.sensor_battery_low')}</Text>
              <Text style={styles.notificationText}>{t('dashboard.sensor_battery_desc')}</Text>
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
              <Text style={styles.notificationTitle}>{t('dashboard.temperature_optimal')}</Text>
              <Text style={styles.notificationText}>{t('dashboard.temperature_desc')}</Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Market Prices */}
        <Animated.View
          style={styles.marketSection}
          entering={SlideInRight.delay(1500).duration(800)}
        >
          <View style={styles.marketHeader}>
            <Text style={styles.marketTitle}>{t('dashboard.market_prices')}</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/marketplace')}>
              <Text style={styles.marketUpdate}>{t('dashboard.todays_update')}</Text>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={styles.marketItem}
            entering={FadeInUp.delay(1700).duration(500)}
          >
            <View style={styles.marketCrop}>
              <MaterialIcons name="grass" size={20} color="#4CAF50" style={styles.marketIcon} />
              <Text style={styles.marketName}>{t('dashboard.wheat')}</Text>
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
              <Text style={styles.marketName}>{t('dashboard.corn')}</Text>
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
              <Text style={styles.marketName}>{t('dashboard.soybeans')}</Text>
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
              <Text style={styles.voiceTitle}>{t('dashboard.voice_assistant')}</Text>
              <Text style={styles.voiceText}>{t('dashboard.voice_assistant_desc')}</Text>
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
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={styles.modalContent}
            entering={FadeInUp.duration(400)}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('dashboard.voice_assistant')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowVoiceModal(false)}
              >
                <MaterialIcons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.voiceModalBody}>
              <View style={styles.microphoneContainer}>
                <TouchableOpacity style={styles.microphoneButton}>
                  <MaterialIcons name="mic" size={32} color="white" />
                </TouchableOpacity>
                <Text style={styles.micStatus}>{t('voice_ai.tap_to_speak')}</Text>
              </View>

              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>{t('voice_ai.try_asking')}</Text>
                <TouchableOpacity style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{t('voice_ai.wheat_crop_question')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{t('voice_ai.market_prices_question')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{t('voice_ai.weather_forecast_question')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{t('voice_ai.farm_alerts_question')}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.fullVoiceButton}
                onPress={() => {
                  setShowVoiceModal(false);
                  router.push('/(app)/voice-ai');
                }}
              >
                <Text style={styles.fullVoiceText}>{t('voice_ai.open_full_assistant')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Navigation Bar ด้านล่าง */}
      <NavBar currentRoute="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  // Weather Card Styles
  weatherSection: {
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
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  weatherCity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  weatherBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherTempContainer: {
    alignItems: 'center',
    flex: 1,
  },
  weatherTemp: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherCondition: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  weatherDetails: {
    flex: 1,
    paddingLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },

  // General Styles
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButton: {
    marginBottom: 5,
    marginRight: 10,
  },
  welcomeContainer: {
    marginRight: 10,
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