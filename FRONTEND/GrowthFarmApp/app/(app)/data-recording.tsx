import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import NavBar from '@/components/navigation/NavBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function DataRecordingScreen() {
  const recentRecords = [
    { id: 1, type: 'Temperature', value: '28°C', time: '2 min ago', status: 'normal' },
    { id: 2, type: 'Humidity', value: '65%', time: '5 min ago', status: 'normal' },
    { id: 3, type: 'Soil Moisture', value: '72%', time: '10 min ago', status: 'high' },
    { id: 4, type: 'pH Level', value: '6.8', time: '15 min ago', status: 'normal' },
    { id: 5, type: 'Light Intensity', value: '850 lux', time: '20 min ago', status: 'low' },
  ];

  const dataCategories = [
    { id: 1, title: 'Environmental', icon: 'thermostat', count: 1250, color: '#4CAF50' },
    { id: 2, title: 'Soil Data', icon: 'eco', count: 890, color: '#FF9800' },
    { id: 3, title: 'Crop Health', icon: 'agriculture', count: 567, color: '#2196F3' },
    { id: 4, title: 'Irrigation', icon: 'water-drop', count: 432, color: '#00BCD4' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialIcons name="analytics" size={32} color="#2196F3" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Data Recording</Text>
          <Text style={styles.headerSubtitle}>Track and analyze your farm data</Text>
        </View>

        {/* Data Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Categories</Text>
          <View style={styles.categoriesGrid}>
            {dataCategories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <MaterialIcons name={category.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryCount}>{category.count} records</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Real-time Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Records</Text>
          {recentRecords.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <View style={styles.recordInfo}>
                <Text style={styles.recordType}>{record.type}</Text>
                <Text style={styles.recordTime}>{record.time}</Text>
              </View>
              <View style={styles.recordValue}>
                <Text style={styles.recordValueText}>{record.value}</Text>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: 
                    record.status === 'normal' ? '#4CAF50' :
                    record.status === 'high' ? '#FF9800' : '#F44336'
                  }
                ]}>
                  <Text style={styles.statusText}>{record.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Export Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Data</Text>
          <View style={styles.exportGrid}>
            <TouchableOpacity style={styles.exportButton}>
              <MaterialIcons name="description" size={20} color="#4CAF50" style={styles.exportIcon} />
              <Text style={styles.exportText}>CSV Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <MaterialIcons name="table-chart" size={20} color="#2196F3" style={styles.exportIcon} />
              <Text style={styles.exportText}>Excel Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <MaterialIcons name="trending-up" size={20} color="#FF9800" style={styles.exportIcon} />
              <Text style={styles.exportText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <MaterialIcons name="cloud-upload" size={20} color="#9C27B0" style={styles.exportIcon} />
              <Text style={styles.exportText}>Cloud Sync</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <NavBar currentRoute="data-recording" />
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  recordCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordInfo: {
    flex: 1,
  },
  recordType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recordTime: {
    fontSize: 12,
    color: '#666',
  },
  recordValue: {
    alignItems: 'flex-end',
  },
  recordValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  exportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exportButton: {
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
  exportIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  exportText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
