import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import NavBar from '@/components/navigation/NavBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function NotificationsScreen() {
  const [filter, setFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Low Soil Moisture Alert',
      message: 'Sector B soil moisture dropped to 45%. Irrigation recommended.',
      time: '5 min ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      title: 'Weather Update',
      message: 'Rain expected tomorrow afternoon. Consider adjusting irrigation schedule.',
      time: '1 hour ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'success',
      title: 'Harvest Ready',
      message: 'Tomatoes in greenhouse A are ready for harvest.',
      time: '2 hours ago',
      read: true,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Equipment Maintenance',
      message: 'Water pump #2 requires scheduled maintenance in 3 days.',
      time: '4 hours ago',
      read: true,
      priority: 'low'
    },
    {
      id: 5,
      type: 'info',
      title: 'Data Sync Complete',
      message: 'All sensor data has been successfully synchronized to cloud.',
      time: '6 hours ago',
      read: true,
      priority: 'low'
    },
    {
      id: 6,
      type: 'alert',
      title: 'Pest Detection',
      message: 'Unusual insect activity detected in corn field section C.',
      time: '8 hours ago',
      read: true,
      priority: 'high'
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'high', label: 'High Priority', count: notifications.filter(n => n.priority === 'high').length },
    { id: 'alerts', label: 'Alerts', count: notifications.filter(n => n.type === 'alert').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'high':
        return notification.priority === 'high';
      case 'alerts':
        return notification.type === 'alert';
      default:
        return true;
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return 'warning';
      case 'warning': return 'error-outline';
      case 'success': return 'check-circle';
      case 'info': return 'info';
      default: return 'description';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialIcons name="notifications" size={32} color="#FF9800" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>Stay updated with your farm alerts</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{notifications.filter(n => !n.read).length}</Text>
            <Text style={styles.summaryLabel}>Unread</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryNumber, { color: '#F44336' }]}>
              {notifications.filter(n => n.priority === 'high').length}
            </Text>
            <Text style={styles.summaryLabel}>High Priority</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryNumber, { color: '#FF9800' }]}>
              {notifications.filter(n => n.type === 'alert').length}
            </Text>
            <Text style={styles.summaryLabel}>Alerts</Text>
          </View>
        </View>

        {/* Filter Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter Notifications</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterButton,
                  filter === option.id && styles.activeFilterButton
                ]}
                onPress={() => setFilter(option.id)}
              >
                <Text style={[
                  styles.filterText,
                  filter === option.id && styles.activeFilterText
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.filterCount,
                  filter === option.id && styles.activeFilterCount
                ]}>
                  {option.count}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Notifications List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {filter === 'all' ? 'All Notifications' : 
             filter === 'unread' ? 'Unread Notifications' :
             filter === 'high' ? 'High Priority' : 'Alert Notifications'}
          </Text>
          {filteredNotifications.map((notification) => (
            <TouchableOpacity key={notification.id} style={[
              styles.notificationCard,
              !notification.read && styles.unreadCard
            ]}>
              <View style={styles.notificationHeader}>
                <View style={styles.notificationLeft}>
                  <MaterialIcons 
                    name={getNotificationIcon(notification.type) as any} 
                    size={20} 
                    color={notification.type === 'alert' ? '#F44336' : 
                           notification.type === 'warning' ? '#FF9800' :
                           notification.type === 'success' ? '#4CAF50' : '#2196F3'} 
                    style={styles.notificationIcon}
                  />
                  <View style={styles.notificationContent}>
                    <Text style={[
                      styles.notificationTitle,
                      !notification.read && styles.unreadTitle
                    ]}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                </View>
                <View style={[
                  styles.priorityDot,
                  { backgroundColor: getPriorityColor(notification.priority) }
                ]} />
              </View>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              {!notification.read && <View style={styles.unreadIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="check" size={20} color="#4CAF50" style={styles.actionIcon} />
              <Text style={styles.actionText}>Mark All Read</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="delete" size={20} color="#F44336" style={styles.actionIcon} />
              <Text style={styles.actionText}>Clear Read</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="settings" size={20} color="#666" style={styles.actionIcon} />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="send" size={20} color="#2196F3" style={styles.actionIcon} />
              <Text style={styles.actionText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <NavBar currentRoute="notifications" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingTop: 60,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  activeFilterText: {
    color: 'white',
  },
  filterCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  activeFilterCount: {
    color: '#4CAF50',
    backgroundColor: 'white',
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  unreadTitle: {
    color: '#000',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
