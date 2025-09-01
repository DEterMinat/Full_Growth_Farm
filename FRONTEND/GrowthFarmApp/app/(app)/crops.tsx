import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import NavBar from '@/components/navigation/NavBar';

export default function Crops() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.leafIcon}>🌾</Text>
          <Text style={styles.brandText}>CROPS MANAGEMENT</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Crops Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Crops</Text>
          
          <View style={styles.cropCard}>
            <View style={styles.cropHeader}>
              <View style={styles.cropInfo}>
                <Text style={styles.cropIcon}>🌾</Text>
                <View>
                  <Text style={styles.cropName}>Wheat</Text>
                  <Text style={styles.cropStage}>Flowering Stage</Text>
                </View>
              </View>
              <View style={styles.cropStatus}>
                <Text style={styles.statusBadge}>Healthy</Text>
              </View>
            </View>
            
            <View style={styles.cropStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Area</Text>
                <Text style={styles.statValue}>25.5 acres</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Planted</Text>
                <Text style={styles.statValue}>Mar 15</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Harvest</Text>
                <Text style={styles.statValue}>Jul 20</Text>
              </View>
            </View>
          </View>

          <View style={styles.cropCard}>
            <View style={styles.cropHeader}>
              <View style={styles.cropInfo}>
                <Text style={styles.cropIcon}>🌽</Text>
                <View>
                  <Text style={styles.cropName}>Corn</Text>
                  <Text style={styles.cropStage}>Vegetative Growth</Text>
                </View>
              </View>
              <View style={styles.cropStatus}>
                <Text style={[styles.statusBadge, styles.warningBadge]}>Monitor</Text>
              </View>
            </View>
            
            <View style={styles.cropStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Area</Text>
                <Text style={styles.statValue}>18.2 acres</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Planted</Text>
                <Text style={styles.statValue}>Apr 02</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Harvest</Text>
                <Text style={styles.statValue}>Aug 15</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>➕</Text>
              <Text style={styles.actionTitle}>Add New Crop</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionTitle}>View Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>🚿</Text>
              <Text style={styles.actionTitle}>Irrigation</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>🔬</Text>
              <Text style={styles.actionTitle}>Soil Test</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>💧</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Irrigation completed - Wheat Field A</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>🌱</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Growth stage updated - Corn Field B</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>🔬</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Soil analysis report available</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Navigation Bar */}
      <NavBar currentRoute="crops" />
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
    fontSize: 20,
    marginRight: 8,
  },
  brandText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  filterButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  cropCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cropName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cropStage: {
    fontSize: 14,
    color: '#666',
  },
  cropStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  warningBadge: {
    backgroundColor: '#FF9800',
  },
  cropStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
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
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  bottomSpace: {
    height: 120,
  },
});
