import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { 
  FadeIn,
  FadeInUp,
  SlideInLeft
} from 'react-native-reanimated';
import NavBar from '@/components/navigation/NavBar';

interface IoTDevice {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  features: string[];
  price: string;
  compatibility: string[];
}

export default function AddIoTScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);

  const iotDevices: IoTDevice[] = [
    {
      id: 'sensor-01',
      name: 'Soil Moisture Sensor',
      type: 'sensor',
      icon: 'water-drop',
      description: 'Advanced soil moisture sensor with wireless connectivity',
      features: ['Real-time monitoring', 'Battery powered', 'Weatherproof', '2-year warranty'],
      price: '$89.99',
      compatibility: ['WiFi', 'LoRaWAN', 'Bluetooth']
    },
    {
      id: 'sensor-02',
      name: 'Temperature & Humidity Sensor',
      type: 'sensor',
      icon: 'thermostat',
      description: 'Precision climate monitoring for optimal crop conditions',
      features: ['±0.3°C accuracy', 'Solar powered', 'Long range', 'Data logging'],
      price: '$64.99',
      compatibility: ['WiFi', 'Zigbee']
    },
    {
      id: 'pump-01',
      name: 'Smart Water Pump',
      type: 'irrigation',
      icon: 'electric-bolt',
      description: 'Automated irrigation pump with flow control',
      features: ['Variable speed', 'Remote control', 'Energy efficient', 'Pressure sensing'],
      price: '$299.99',
      compatibility: ['WiFi', '4G']
    },
    {
      id: 'valve-01',
      name: 'Smart Irrigation Valve',
      type: 'irrigation',
      icon: 'water',
      description: 'Precision water control valve for zone irrigation',
      features: ['Zone control', 'Schedule programming', 'Manual override', 'Flow detection'],
      price: '$149.99',
      compatibility: ['WiFi', 'LoRaWAN']
    },
    {
      id: 'camera-01',
      name: 'Field Monitoring Camera',
      type: 'monitoring',
      icon: 'camera-alt',
      description: 'AI-powered crop monitoring with pest detection',
      features: ['4K recording', 'Night vision', 'Motion detection', 'Cloud storage'],
      price: '$399.99',
      compatibility: ['WiFi', '4G', 'Ethernet']
    },
    {
      id: 'weather-01',
      name: 'Weather Station Pro',
      type: 'monitoring',
      icon: 'wb-sunny',
      description: 'Complete weather monitoring station',
      features: ['Wind speed/direction', 'Rainfall measurement', 'UV index', 'Barometric pressure'],
      price: '$799.99',
      compatibility: ['WiFi', 'LoRaWAN']
    },
    {
      id: 'drone-01',
      name: 'Agricultural Drone',
      type: 'monitoring',
      icon: 'flight',
      description: 'Autonomous crop surveying and spraying drone',
      features: ['GPS navigation', 'HD mapping', 'Precision spraying', '45min flight time'],
      price: '$2,499.99',
      compatibility: ['4G', 'WiFi']
    },
    {
      id: 'pest-01',
      name: 'Smart Pest Control',
      type: 'protection',
      icon: 'shield',
      description: 'Automated pest detection and treatment system',
      features: ['AI detection', 'Targeted spraying', 'Safe chemicals', 'Usage tracking'],
      price: '$549.99',
      compatibility: ['WiFi', 'LoRaWAN']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Devices', icon: 'devices' },
    { id: 'sensor', name: 'Sensors', icon: 'sensors' },
    { id: 'irrigation', name: 'Irrigation', icon: 'water-drop' },
    { id: 'monitoring', name: 'Monitoring', icon: 'visibility' },
    { id: 'protection', name: 'Protection', icon: 'shield' }
  ];

  const filteredDevices = iotDevices.filter(device => {
    const matchesCategory = selectedCategory === 'all' || device.type === selectedCategory;
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDeviceSelect = (device: IoTDevice) => {
    setSelectedDevice(device);
    setShowDetails(true);
  };

  const handleAddDevice = () => {
    if (selectedDevice) {
      Alert.alert(
        'Add IoT Device',
        `Add ${selectedDevice.name} to your farm?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add Device',
            onPress: () => {
              setShowDetails(false);
              Alert.alert('Success', `${selectedDevice.name} has been added to your farm!`);
              router.back();
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeIn.duration(600)}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.brandText}>ADD IOT DEVICE</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <MaterialIcons name="person" size={18} color="white" style={styles.profileIcon} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <Animated.View 
          style={styles.searchSection}
          entering={FadeInUp.delay(200).duration(800)}
        >
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={18} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search IoT devices..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
        </Animated.View>

        {/* Categories */}
        <Animated.View 
          style={styles.categoriesSection}
          entering={SlideInLeft.delay(400).duration(800)}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => (
              <Animated.View
                key={category.id}
                entering={SlideInLeft.delay(500 + index * 100).duration(600)}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.id && styles.categoryCardSelected
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <MaterialIcons name={category.icon as any} size={20} color={selectedCategory === category.id ? '#2196F3' : '#666'} style={styles.categoryIcon} />
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextSelected
                  ]}>{category.name}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Device Grid */}
        <Animated.View 
          style={styles.devicesSection}
          entering={FadeInUp.delay(800).duration(800)}
        >
          <Text style={styles.sectionTitle}>Available Devices ({filteredDevices.length})</Text>
          <View style={styles.deviceGrid}>
            {filteredDevices.map((device, index) => (
              <Animated.View
                key={device.id}
                style={styles.deviceCard}
                entering={FadeInUp.delay(1000 + index * 150).duration(600)}
              >
                <TouchableOpacity
                  style={styles.deviceCardContent}
                  onPress={() => handleDeviceSelect(device)}
                  activeOpacity={0.8}
                >
                  <View style={styles.deviceHeader}>
                    <MaterialIcons name={device.icon as any} size={24} color="#666" style={styles.deviceIcon} />
                    <Text style={styles.devicePrice}>{device.price}</Text>
                  </View>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceDescription}>{device.description}</Text>
                  
                  <View style={styles.deviceFeatures}>
                    {device.features.slice(0, 2).map((feature, idx) => (
                      <View key={idx} style={styles.featureTag}>
                        <Text style={styles.featureText}>• {feature}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.compatibilityRow}>
                    {device.compatibility.map((comp, idx) => (
                      <View key={idx} style={styles.compatibilityTag}>
                        <Text style={styles.compatibilityText}>{comp}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.addToCartButton}>
                    <Text style={styles.addToCartText}>View Details</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Device Details Modal */}
      <Modal
        visible={showDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={styles.modalContent}
            entering={SlideInLeft.duration(400)}
          >
            {selectedDevice && (
              <>
                <View style={styles.modalHeader}>
                  <MaterialIcons name={selectedDevice.icon as any} size={40} color="#2196F3" style={styles.modalDeviceIcon} />
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>{selectedDevice.name}</Text>
                    <Text style={styles.modalPrice}>{selectedDevice.price}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowDetails(false)}
                  >
                    <MaterialIcons name="close" size={20} color="#666" style={styles.closeIcon} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <Text style={styles.modalDescription}>{selectedDevice.description}</Text>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Features</Text>
                    {selectedDevice.features.map((feature, index) => (
                      <View key={index} style={styles.modalFeatureItem}>
                        <MaterialIcons name="check" size={16} color="#4CAF50" style={styles.modalFeatureBullet} />
                        <Text style={styles.modalFeatureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Compatibility</Text>
                    <View style={styles.modalCompatibilityGrid}>
                      {selectedDevice.compatibility.map((comp, index) => (
                        <View key={index} style={styles.modalCompatibilityTag}>
                          <Text style={styles.modalCompatibilityText}>{comp}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Installation</Text>
                    <Text style={styles.modalInstallText}>
                      • Professional installation available
                      • Setup wizard included
                      • 24/7 technical support
                      • Mobile app integration
                    </Text>
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowDetails(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addDeviceButton}
                    onPress={handleAddDevice}
                  >
                    <Text style={styles.addDeviceButtonText}>Add to Farm</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>

      <NavBar currentRoute="iot-control" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  brandText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 18,
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchSection: {
    paddingVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesSection: {
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryCardSelected: {
    backgroundColor: '#4CAF50',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  devicesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deviceCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceCardContent: {
    padding: 15,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceIcon: {
    fontSize: 24,
  },
  devicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  deviceDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    lineHeight: 16,
  },
  deviceFeatures: {
    marginBottom: 10,
  },
  featureTag: {
    marginBottom: 2,
  },
  featureText: {
    fontSize: 10,
    color: '#888',
  },
  compatibilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  compatibilityTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  compatibilityText: {
    fontSize: 9,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalDeviceIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 2,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalFeatureBullet: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 10,
    fontWeight: 'bold',
  },
  modalFeatureText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  modalCompatibilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalCompatibilityTag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  modalCompatibilityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalInstallText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addDeviceButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addDeviceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
