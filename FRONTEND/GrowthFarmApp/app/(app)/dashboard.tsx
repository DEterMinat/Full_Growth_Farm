import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
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
import { pricesService, CropPrice, WeeklyTrend } from '@/src/services/pricesService';
import NavBar from '@/components/navigation/NavBar';
import EmergencyLogout from '@/src/utils/EmergencyLogout';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(authUser);
  const isGuest = !authUser || authUser.username === 'guest';
  
  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherStatus, setWeatherStatus] = useState<string>('');
  const weatherIntervalRef = useRef<any>(null);

  // Market prices state
  const [todayPrices, setTodayPrices] = useState<CropPrice[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<WeeklyTrend[]>([]);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesLastUpdated, setPricesLastUpdated] = useState<string>('');

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser, authLoading]);

  // ฟังก์ชันสำหรับดึงข้อมูลราคาพืชผล
  const fetchPrices = async (showLoading = true) => {
    try {
      if (showLoading) setPricesLoading(true);
      
      // ดึงข้อมูลราคาปัจจุบันและแนวโน้มรายสัปดาห์แบบพร้อมกัน
      const [todayData, trendsData] = await Promise.all([
        pricesService.getTodayPrices(),
        pricesService.getWeeklyTrends()
      ]);
      
      setTodayPrices(todayData);
      setWeeklyTrends(trendsData);
      setPricesLastUpdated(new Date().toISOString());
      
      console.log('Prices updated:', { 
        todayCount: todayData.length, 
        trendsCount: trendsData.length,
        source: todayData[0]?.source || 'unknown'
      });
    } catch (error) {
      console.error("Failed to load market prices:", error);
    } finally {
      if (showLoading) setPricesLoading(false);
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลสภาพอากาศ
  const fetchWeather = async (showLoading = true) => {
    try {
      if (showLoading) setWeatherLoading(true);
      const data = await weatherService.getCurrentWeather();
      setWeather(data);
      setWeatherStatus(weatherService.getWeatherStatusMessage(data));
      console.log('Weather updated:', { city: data.city, temp: data.temperature, source: data.source });
    } catch (error) {
      console.error("Failed to load weather on dashboard:", error);
      setWeather({
        city: "ชลบุรี, ประเทศไทย",
        temperature: 30,
        condition: "Cloudy",
        humidity: 75,
        windSpeed: 10,
      });
      setWeatherStatus('ไม่สามารถดึงข้อมูลได้');
    } finally {
      if (showLoading) setWeatherLoading(false);
    }
  };

  // เริ่มต้นดึงข้อมูลสภาพอากาศและราคาตลาด พร้อมตั้ง interval สำหรับ auto-refresh
  useEffect(() => {
    fetchWeather();
    fetchPrices();

    // ตั้งค่าให้อัปเดตข้อมูลทุก 10 นาที (600,000 ms)
    weatherIntervalRef.current = setInterval(() => {
      fetchWeather(false); // ไม่แสดง loading indicator สำหรับการอัปเดตอัตโนมัติ
      fetchPrices(false); // ดึงข้อมูลราคาด้วย
    }, 600000);

    // Cleanup interval เมื่อ component ถูก unmount
    return () => {
      if (weatherIntervalRef.current) {
        clearInterval(weatherIntervalRef.current);
      }
    };
  }, []);

  // ฟังก์ชันช่วยเหลือสำหรับการแสดงผล
  const getPriceIcon = (cropName: string) => {
    const iconMap: { [key: string]: any } = {
      'ข้าวโพด': 'grain',
      'ข้าวสาลี': 'grass', 
      'ข้าว': 'eco',
      'ถั่วเหลือง': 'agriculture',
      'corn': 'grain',
      'wheat': 'grass',
      'rice': 'eco',
      'soybeans': 'agriculture'
    };
    return iconMap[cropName.toLowerCase()] || 'eco';
  };

  const getPriceIconColor = (cropName: string) => {
    const colorMap: { [key: string]: string } = {
      'ข้าวโพด': '#FFD54F',
      'ข้าวสาลี': '#FFB74D',
      'ข้าว': '#8BC34A',
      'ถั่วเหลือง': '#66BB6A',
      'corn': '#FFD54F',
      'wheat': '#FFB74D',
      'rice': '#8BC34A',
      'soybeans': '#66BB6A'
    };
    return colorMap[cropName.toLowerCase()] || '#4CAF50';
  };

  // ฟังก์ชันสำหรับรีเฟรชข้อมูลสภาพอากาศแบบ manual
  const refreshWeather = () => {
    fetchWeather(true);
  };

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
          <View style={styles.weatherLocationContainer}>
            <MaterialIcons name="location-on" size={16} color="#333" />
            <Text style={styles.weatherCity}>{data.city || 'Unknown City'}</Text>
          </View>
          <TouchableOpacity onPress={refreshWeather} style={styles.refreshButton}>
            <MaterialIcons 
              name="refresh" 
              size={20} 
              color={weatherLoading ? "#999" : "#4CAF50"} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Weather Status Bar */}
        <View style={styles.weatherStatusBar}>
          <Text style={[
            styles.weatherStatusText,
            { color: weatherService.isRealTimeData(data) ? '#4CAF50' : '#FF9800' }
          ]}>
            {weatherStatus}
          </Text>
          {weatherService.isRealTimeData(data) && (
            <MaterialIcons name="wifi" size={14} color="#4CAF50" />
          )}
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
    fullName: isGuest ? 'Guest User' : 'Demo User',
    username: isGuest ? 'guest' : 'demo'
  };

  return (
    <View style={styles.container}>
      
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
            <Text style={styles.welcomeUser} numberOfLines={1} ellipsizeMode="tail">
              {t('dashboard.hi_user')}, {currentUser?.fullName || currentUser?.username}!
            </Text>
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

        {/* Today's Prices */}
        <Animated.View
          style={styles.marketSection}
          entering={SlideInRight.delay(1500).duration(800)}
        >
          <View style={styles.marketHeader}>
            <Text style={styles.marketTitle}>{t('market.todays_prices') || "Today's Prices"}</Text>
            <TouchableOpacity onPress={() => fetchPrices(true)}>
              <Text style={styles.marketUpdate}>
                {pricesLoading ? 'Updating...' : 
                 pricesLastUpdated ? `Updated ${Math.floor((Date.now() - new Date(pricesLastUpdated).getTime()) / 60000)} min ago` :
                 'Tap to refresh'
                }
              </Text>
            </TouchableOpacity>
          </View>

          {pricesLoading && todayPrices.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading prices...</Text>
            </View>
          ) : (
            todayPrices.map((price, index) => (
              <Animated.View
                key={price.name}
                style={styles.priceCard}
                entering={FadeInUp.delay(1700 + index * 100).duration(500)}
              >
                <View style={styles.priceHeader}>
                  <View style={styles.cropInfo}>
                    <MaterialIcons 
                      name={getPriceIcon(price.name)} 
                      size={20} 
                      color={getPriceIconColor(price.name)} 
                      style={styles.marketCropIcon} 
                    />
                    <Text style={styles.cropName}>{price.name}</Text>
                  </View>
                  <View style={styles.priceChange}>
                    <Text style={[
                      styles.changeText, 
                      price.changePercent >= 0 ? styles.positive : styles.negative
                    ]}>
                      {pricesService.formatPercentage(price.changePercent)}
                    </Text>
                    <MaterialIcons 
                      name={price.changePercent >= 0 ? "arrow-upward" : "arrow-downward"} 
                      size={16} 
                      color={price.changePercent >= 0 ? "#4CAF50" : "#F44336"} 
                    />
                  </View>
                </View>
                <Text style={styles.currentPrice}>
                  {pricesService.formatPrice(price.price, price.currency)}/{price.unit}
                </Text>
                <Text style={styles.previousPrice}>
                  {t('market.yesterday') || 'Yesterday'}: {pricesService.formatPrice(price.previousPrice, price.currency)}
                </Text>
                {price.source && (
                  <Text style={styles.priceSource}>Source: {price.source}</Text>
                )}
              </Animated.View>
            ))
          )}
        </Animated.View>

        {/* Weekly Trends */}
        <Animated.View
          style={styles.trendsSection}
          entering={SlideInLeft.delay(2000).duration(800)}
        >
          <Text style={styles.sectionTitle}>{t('market.weekly_trends') || 'Weekly Trends'}</Text>
          
          {weeklyTrends.map((trend, index) => (
            <Animated.View
              key={trend.name}
              style={styles.trendCard}
              entering={FadeInUp.delay(2200 + index * 100).duration(500)}
            >
              <View style={styles.trendHeader}>
                <Text style={styles.trendTitle}>{trend.name}</Text>
                <View style={styles.trendIndicator}>
                  <MaterialIcons 
                    name={trend.trend === 'up' ? 'trending-up' : trend.trend === 'down' ? 'trending-down' : 'trending-flat'} 
                    size={20} 
                    color={trend.trend === 'up' ? '#4CAF50' : trend.trend === 'down' ? '#F44336' : '#FF9800'} 
                  />
                </View>
              </View>
              
              <Text style={styles.trendDescription}>
                {trend.trend === 'up' ? 'Strong upward trend' : 
                 trend.trend === 'down' ? 'Declining trend' : 
                 'Stable prices'}
              </Text>
              
              <View style={styles.trendStats}>
                <Text style={[
                  styles.trendStat,
                  trend.weeklyChangePercent >= 0 ? styles.positive : styles.negative
                ]}>
                  {pricesService.formatPercentage(trend.weeklyChangePercent)} this week
                </Text>
              </View>
              
              <Text style={styles.trendAverage}>
                Avg: {pricesService.formatPrice(trend.averagePrice, 'THB')}
              </Text>
            </Animated.View>
          ))}
          
          {weeklyTrends.length === 0 && !pricesLoading && (
            <Text style={styles.noDataText}>No trend data available</Text>
          )}
        </Animated.View>



        <View style={styles.bottomSpace} />
      </ScrollView>



      {/* Navigation Bar ด้านล่าง */}
      <NavBar />
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
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  weatherLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  refreshButton: {
    padding: 5,
    borderRadius: 15,
    backgroundColor: '#f0f8f0',
  },
  weatherStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  weatherStatusText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 5,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 60 : 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: Platform.OS === 'ios' ? 100 : 95,
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
    flex: 1,
    justifyContent: 'flex-end',
    maxWidth: '60%',
  },
  languageButton: {
    marginBottom: 0,
    marginRight: 8,
    marginLeft: 4,
  },
  welcomeContainer: {
    marginRight: 8,
    flex: 1,
    maxWidth: 120,
  },
  welcomeUser: {
    color: 'white',
    fontSize: 11,
    marginBottom: 5,
    textAlign: 'right',
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
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
  // New styles for enhanced Today's Prices and Weekly Trends
  priceCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marketCropIcon: {
    marginRight: 10,
  },
  cropName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  previousPrice: {
    fontSize: 12,
    color: '#666',
  },
  priceSource: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 2,
  },
  trendsSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  trendCard: {
    backgroundColor: '#f0f8f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  trendIndicator: {
    marginLeft: 10,
  },
  trendDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  trendStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendStat: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  trendAverage: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic',
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    padding: 20,
  },
  bottomSpace: {
    height: 120,
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