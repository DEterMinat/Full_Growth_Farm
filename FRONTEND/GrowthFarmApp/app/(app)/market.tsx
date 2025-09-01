import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { 
  FadeIn,
  FadeInUp,
  SlideInLeft,
  SlideInRight
} from 'react-native-reanimated';
import NavBar from '@/components/navigation/NavBar';

export default function Market() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeIn.duration(600)}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.marketIcon}>🏪</Text>
          <Text style={styles.brandText}>MARKET PRICES</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Prices */}
        <Animated.View 
          style={styles.section}
          entering={FadeInUp.delay(200).duration(800)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Prices</Text>
            <Text style={styles.updateTime}>Updated 5 min ago</Text>
          </View>
          
          <Animated.View 
            style={styles.priceCard}
            entering={SlideInLeft.delay(400).duration(600)}
          >
            <View style={styles.priceHeader}>
              <View style={styles.cropInfo}>
                <Text style={styles.cropIcon}>🌾</Text>
                <Text style={styles.cropName}>Wheat</Text>
              </View>
              <View style={styles.priceChange}>
                <Text style={[styles.changeText, styles.positive]}>↗ +2.5%</Text>
              </View>
            </View>
            <Text style={styles.currentPrice}>$7.25/bushel</Text>
            <Text style={styles.previousPrice}>Yesterday: $7.07</Text>
          </Animated.View>

          <Animated.View 
            style={styles.priceCard}
            entering={SlideInRight.delay(500).duration(600)}
          >
            <View style={styles.priceHeader}>
              <View style={styles.cropInfo}>
                <Text style={styles.cropIcon}>🌽</Text>
                <Text style={styles.cropName}>Corn</Text>
              </View>
              <View style={styles.priceChange}>
                <Text style={[styles.changeText, styles.negative]}>↘ -1.2%</Text>
              </View>
            </View>
            <Text style={styles.currentPrice}>$4.12/bushel</Text>
            <Text style={styles.previousPrice}>Yesterday: $4.17</Text>
          </Animated.View>

          <Animated.View 
            style={styles.priceCard}
            entering={SlideInLeft.delay(600).duration(600)}
          >
            <View style={styles.priceHeader}>
              <View style={styles.cropInfo}>
                <Text style={styles.cropIcon}>🫘</Text>
                <Text style={styles.cropName}>Soybeans</Text>
              </View>
              <View style={styles.priceChange}>
                <Text style={[styles.changeText, styles.positive]}>↗ +4.1%</Text>
              </View>
            </View>
            <Text style={styles.currentPrice}>$13.87/bushel</Text>
            <Text style={styles.previousPrice}>Yesterday: $13.32</Text>
          </Animated.View>
        </Animated.View>

        {/* Market Trends */}
        <Animated.View 
          style={styles.section}
          entering={FadeInUp.delay(800).duration(800)}
        >
          <Text style={styles.sectionTitle}>Weekly Trends</Text>
          <Animated.View 
            style={styles.trendCard}
            entering={SlideInLeft.delay(1000).duration(600)}
          >
            <Text style={styles.trendTitle}>🔥 Hot This Week</Text>
            <Text style={styles.trendDescription}>Soybeans showing strong upward momentum</Text>
            <View style={styles.trendStats}>
              <Text style={styles.trendStat}>+12.5% this week</Text>
            </View>
          </Animated.View>
          
          <Animated.View 
            style={styles.trendCard}
            entering={SlideInRight.delay(1100).duration(600)}
          >
            <Text style={styles.trendTitle}>📉 Watch Out</Text>
            <Text style={styles.trendDescription}>Corn prices declining due to oversupply</Text>
            <View style={styles.trendStats}>
              <Text style={[styles.trendStat, styles.negative]}>-5.8% this week</Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Market Actions */}
        <Animated.View 
          style={styles.section}
          entering={FadeInUp.delay(1200).duration(800)}
        >
          <Text style={styles.sectionTitle}>Market Actions</Text>
          <View style={styles.actionGrid}>
            <Animated.View entering={SlideInLeft.delay(1400).duration(500)}>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>💰</Text>
                <Text style={styles.actionTitle}>Sell Crops</Text>
                <Text style={styles.actionSubtitle}>Get best prices</Text>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View entering={SlideInRight.delay(1500).duration(500)}>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>📈</Text>
                <Text style={styles.actionTitle}>Price Alerts</Text>
                <Text style={styles.actionSubtitle}>Set notifications</Text>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View entering={SlideInLeft.delay(1600).duration(500)}>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>🔍</Text>
                <Text style={styles.actionTitle}>Market Analysis</Text>
                <Text style={styles.actionSubtitle}>Detailed reports</Text>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View entering={SlideInRight.delay(1700).duration(500)}>
              <TouchableOpacity style={styles.actionCard}>
                <Text style={styles.actionIcon}>🤝</Text>
                <Text style={styles.actionTitle}>Find Buyers</Text>
                <Text style={styles.actionSubtitle}>Connect locally</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        {/* News & Updates */}
        <Animated.View 
          style={styles.section}
          entering={FadeInUp.delay(1800).duration(800)}
        >
          <Text style={styles.sectionTitle}>Market News</Text>
          <View style={styles.newsList}>
            <Animated.View 
              style={styles.newsItem}
              entering={FadeInUp.delay(2000).duration(500)}
            >
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>Global wheat demand increases</Text>
                <Text style={styles.newsSubtitle}>Export opportunities rising for local farmers</Text>
                <Text style={styles.newsTime}>2 hours ago</Text>
              </View>
            </Animated.View>
            
            <Animated.View 
              style={styles.newsItem}
              entering={FadeInUp.delay(2100).duration(500)}
            >
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>Weather forecast affects corn prices</Text>
                <Text style={styles.newsSubtitle}>Expected rain may impact harvest schedules</Text>
                <Text style={styles.newsTime}>5 hours ago</Text>
              </View>
            </Animated.View>
            
            <Animated.View 
              style={styles.newsItem}
              entering={FadeInUp.delay(2200).duration(500)}
            >
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>New trade agreement benefits soybean exports</Text>
                <Text style={styles.newsSubtitle}>Farmers can expect higher demand next quarter</Text>
                <Text style={styles.newsTime}>1 day ago</Text>
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Navigation Bar */}
      <NavBar currentRoute="market" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#FF9800',
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
  marketIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  brandText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  refreshButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: 18,
    color: 'white',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  updateTime: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  priceCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  cropName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceChange: {},
  changeText: {
    fontSize: 14,
    fontWeight: 'bold',
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
    marginBottom: 4,
  },
  previousPrice: {
    fontSize: 14,
    color: '#666',
  },
  trendCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  trendDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  trendStats: {},
  trendStat: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  newsList: {
    gap: 12,
  },
  newsItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  newsSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  newsTime: {
    fontSize: 12,
    color: '#999',
  },
  bottomSpace: {
    height: 120,
  },
});
