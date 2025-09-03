import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { 
  FadeIn,
  FadeInUp,
  SlideInLeft,
  SlideInRight
} from 'react-native-reanimated';
import NavBar from '@/components/navigation/NavBar';

export default function IotControlScreen() {
  const [wateringActive, setWateringActive] = useState(true);
  const [wateringFrequency, setWateringFrequency] = useState(2); // 0-4 scale (Once to 5x daily)
  const [waterAmount, setWaterAmount] = useState(2); // 0-3 scale (Light to Heavy)
  const [pestControlActive, setPestControlActive] = useState(true);
  const [pestControlMode, setPestControlMode] = useState('preventive'); // 'preventive' or 'targeted'
  const [pestIntensity, setPestIntensity] = useState(2); // 0-3 scale
  const [microbialActive, setMicrobialActive] = useState(false);
  const [microbialRatio, setMicrobialRatio] = useState(1); // 0-2 scale (1:1, 1:3, 1:5)
  const [microbialSchedule, setMicrobialSchedule] = useState('weekly');

  const getFrequencyText = (value: number) => {
    const frequencies = ['Once', 'Daily', 'Twice daily', '3x daily', '4x daily', '5x daily'];
    return frequencies[value] || 'Twice daily';
  };

  const getWaterAmountText = (value: number) => {
    const amounts = ['Light (100ml)', 'Medium (250ml)', 'Heavy (400ml)', 'Maximum (500ml)'];
    return amounts[value] || 'Medium (250ml)';
  };

  const getMicrobialRatioText = (value: number) => {
    const ratios = ['Standard (1:1)', 'Standard (1:3)', 'Concentrated (1:5)'];
    return ratios[value] || 'Standard (1:3)';
  };

  const getPestIntensityText = (value: number) => {
    const intensities = ['Low', 'Medium', 'High', 'Maximum'];
    return intensities[value] || 'Medium';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeIn.duration(600)}
      >
        <View style={styles.headerLeft}>
          <MaterialIcons name="eco" size={20} color="white" style={styles.leafIcon} />
          <Text style={styles.brandText}>GROWTH FARM</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/add-iot' as any)}
          >
            <Text style={styles.addButtonText}>ADD+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <MaterialIcons name="person" size={18} color="white" style={styles.profileIcon} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={styles.titleSection}
          entering={FadeInUp.delay(200).duration(800)}
        >
          <Text style={styles.pageTitle}>IoT Control Center</Text>
          <Text style={styles.pageSubtitle}>Manage your smart farming devices</Text>
        </Animated.View>

        {/* Watering Schedule */}
        <Animated.View 
          style={styles.controlSection}
          entering={SlideInLeft.delay(400).duration(800)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Watering Schedule</Text>
            <View style={styles.toggleContainer}>
              <Text style={[styles.statusText, { color: wateringActive ? '#4CAF50' : '#666' }]}>
                {wateringActive ? 'Active' : 'Inactive'}
              </Text>
              <Switch
                value={wateringActive}
                onValueChange={setWateringActive}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                thumbColor={wateringActive ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.controlContent}>
            <View style={styles.sliderSection}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Frequency</Text>
                <Text style={styles.sliderValue}>{getFrequencyText(wateringFrequency)}</Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View 
                    style={[
                      styles.sliderFill, 
                      { width: `${(wateringFrequency / 5) * 100}%` }
                    ]} 
                  />
                  <TouchableOpacity 
                    style={[
                      styles.sliderThumb, 
                      { left: `${(wateringFrequency / 5) * 100}%` }
                    ]}
                  />
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderEndLabel}>Once</Text>
                  <Text style={styles.sliderEndLabel}>5x daily</Text>
                </View>
              </View>
            </View>

            <View style={styles.sliderSection}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Water amount</Text>
                <Text style={styles.sliderValue}>{getWaterAmountText(waterAmount)}</Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View 
                    style={[
                      styles.sliderFill, 
                      { width: `${(waterAmount / 3) * 100}%` }
                    ]} 
                  />
                  <TouchableOpacity 
                    style={[
                      styles.sliderThumb, 
                      { left: `${(waterAmount / 3) * 100}%` }
                    ]}
                  />
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderEndLabel}>Light</Text>
                  <Text style={styles.sliderEndLabel}>Heavy</Text>
                </View>
              </View>
            </View>

            <View style={styles.scheduleGrid}>
              <View style={styles.scheduleCard}>
                <Text style={styles.scheduleLabel}>Next watering</Text>
                <View style={styles.scheduleTime}>
                  <Text style={styles.timeIcon}>🕕</Text>
                  <View>
                    <Text style={styles.timeText}>Today, 6:00 PM</Text>
                  </View>
                </View>
              </View>
              <View style={styles.scheduleCard}>
                <Text style={styles.scheduleLabel}>Last watering</Text>
                <View style={styles.scheduleTime}>
                  <Text style={styles.timeIcon}>🔄</Text>
                  <View>
                    <Text style={styles.timeText}>Today, 8:30 AM</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Pest Control */}
        <Animated.View 
          style={styles.controlSection}
          entering={SlideInRight.delay(600).duration(800)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pest Control</Text>
            <View style={styles.toggleContainer}>
              <Text style={[styles.statusText, { color: pestControlActive ? '#4CAF50' : '#666' }]}>
                {pestControlActive ? 'Active' : 'Inactive'}
              </Text>
              <Switch
                value={pestControlActive}
                onValueChange={setPestControlActive}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                thumbColor={pestControlActive ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.controlContent}>
            <View style={styles.radioGroup}>
              <TouchableOpacity 
                style={[
                  styles.radioOption,
                  pestControlMode === 'preventive' && styles.radioOptionSelected
                ]}
                onPress={() => setPestControlMode('preventive')}
              >
                <View style={[
                  styles.radioCircle,
                  pestControlMode === 'preventive' && styles.radioCircleSelected
                ]}>
                  {pestControlMode === 'preventive' && <View style={styles.radioDot} />}
                </View>
                <View style={styles.radioContent}>
                  <Text style={styles.radioTitle}>Preventive</Text>
                  <Text style={styles.radioSubtitle}>Regular low-intensity treatment</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.radioOption,
                  pestControlMode === 'targeted' && styles.radioOptionSelected
                ]}
                onPress={() => setPestControlMode('targeted')}
              >
                <View style={[
                  styles.radioCircle,
                  pestControlMode === 'targeted' && styles.radioCircleSelected
                ]}>
                  {pestControlMode === 'targeted' && <View style={styles.radioDot} />}
                </View>
                <View style={styles.radioContent}>
                  <Text style={styles.radioTitle}>Targeted</Text>
                  <Text style={styles.radioSubtitle}>High-intensity spot treatment</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.sliderSection}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Treatment intensity</Text>
                <Text style={styles.sliderValue}>{getPestIntensityText(pestIntensity)}</Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View 
                    style={[
                      styles.sliderFill, 
                      { width: `${(pestIntensity / 3) * 100}%` }
                    ]} 
                  />
                  <TouchableOpacity 
                    style={[
                      styles.sliderThumb, 
                      { left: `${(pestIntensity / 3) * 100}%` }
                    ]}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.manualButton}>
              <Text style={styles.manualButtonText}>Run Manual Scan</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Microbial Mix */}
        <Animated.View 
          style={styles.controlSection}
          entering={SlideInLeft.delay(800).duration(800)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Microbial Mix</Text>
            <View style={styles.toggleContainer}>
              <Text style={[styles.statusText, { color: microbialActive ? '#4CAF50' : '#666' }]}>
                {microbialActive ? 'Active' : 'Inactive'}
              </Text>
              <Switch
                value={microbialActive}
                onValueChange={setMicrobialActive}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                thumbColor={microbialActive ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.controlContent}>
            <View style={styles.sliderSection}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Mix ratio</Text>
                <Text style={styles.sliderValue}>{getMicrobialRatioText(microbialRatio)}</Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View 
                    style={[
                      styles.sliderFill, 
                      { width: `${(microbialRatio / 2) * 100}%` }
                    ]} 
                  />
                  <TouchableOpacity 
                    style={[
                      styles.sliderThumb, 
                      { left: `${(microbialRatio / 2) * 100}%` }
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.scheduleOptions}>
              <Text style={styles.scheduleOptionsTitle}>Schedule application</Text>
              <View style={styles.scheduleButtonsRow}>
                <TouchableOpacity 
                  style={[
                    styles.scheduleButton,
                    microbialSchedule === 'weekly' && styles.scheduleButtonSelected
                  ]}
                  onPress={() => setMicrobialSchedule('weekly')}
                >
                  <Text style={[
                    styles.scheduleButtonText,
                    microbialSchedule === 'weekly' && styles.scheduleButtonTextSelected
                  ]}>Weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.scheduleButton,
                    microbialSchedule === 'biweekly' && styles.scheduleButtonSelected
                  ]}
                  onPress={() => setMicrobialSchedule('biweekly')}
                >
                  <Text style={[
                    styles.scheduleButtonText,
                    microbialSchedule === 'biweekly' && styles.scheduleButtonTextSelected
                  ]}>Bi-weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.scheduleButton,
                    microbialSchedule === 'monthly' && styles.scheduleButtonSelected
                  ]}
                  onPress={() => setMicrobialSchedule('monthly')}
                >
                  <Text style={[
                    styles.scheduleButtonText,
                    microbialSchedule === 'monthly' && styles.scheduleButtonTextSelected
                  ]}>Monthly</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.activateButton}>
              <Text style={styles.activateButtonText}>Activate System</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
  titleSection: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  controlSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  controlContent: {
    flex: 1,
  },
  sliderSection: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sliderLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sliderValue: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  sliderContainer: {
    marginBottom: 10,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    position: 'relative',
    marginBottom: 10,
  },
  sliderFill: {
    height: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    position: 'absolute',
    top: -7,
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderEndLabel: {
    fontSize: 12,
    color: '#666',
  },
  scheduleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  scheduleCard: {
    flex: 1,
    backgroundColor: '#f0f8f0',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  scheduleLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  scheduleTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  radioGroup: {
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radioOptionSelected: {
    backgroundColor: '#f0f8f0',
    borderColor: '#4CAF50',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#4CAF50',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  radioContent: {
    flex: 1,
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  radioSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  manualButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  manualButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleOptions: {
    marginBottom: 20,
  },
  scheduleOptionsTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 15,
  },
  scheduleButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  scheduleButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  scheduleButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  scheduleButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  activateButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  activateButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
