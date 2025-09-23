import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import NavBar from '@/components/navigation/NavBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LanguageToggleButton } from '@/components/LanguageToggleButton';
import {
  cropsService,
  Crop,
  CreateCropRequest,
  UpdateCropRequest
} from '@/src/services/cropsService';

export default function Crops() {
  const { t } = useTranslation();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [searchText, setSearchText] = useState('');

  const [newCrop, setNewCrop] = useState<CreateCropRequest>({
    name: '',
    variety: '',
    plantingDate: '',
    expectedHarvestDate: '',
    area: 0,
    areaUnit: 'acres',
    stage: 'Seeding',
    status: 'healthy',
    farmId: 1,
    zoneId: 1,
    notes: '',
  });

  useEffect(() => {
    loadCrops();
  }, []);

  // Debug useEffect to track form state
  useEffect(() => {
    console.log('📝 Form state changed:', {
      name: newCrop.name,
      isEmpty: !newCrop.name && !newCrop.variety && newCrop.area === 0
    });
  }, [newCrop]);

  // Debug useEffect to track modal state
  useEffect(() => {
    console.log('🚪 Modal state changed - Add:', isAddModalVisible, 'Edit:', isEditModalVisible);
  }, [isAddModalVisible, isEditModalVisible]);

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return '#4CAF50'; // Green
      case 'monitor':
        return '#FF9800'; // Orange
      case 'critical':
        return '#F44336'; // Red
      default:
        return '#4CAF50'; // Default to healthy green
    }
  };

  // Helper function to get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'monitor':
        return 'Monitor';
      case 'critical':
        return 'Critical';
      default:
        return status;
    }
  };

  const loadCrops = async () => {
    try {
      setLoading(true);
      const fetchedCrops = await cropsService.getAllCrops();
      setCrops(fetchedCrops);
    } catch (error) {
      console.error('Error loading crops:', error);
      Alert.alert('Error', 'Failed to load crops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    console.log('🔄 Resetting crop form');
    setNewCrop({
      name: '',
      variety: '',
      plantingDate: '',
      expectedHarvestDate: '',
      area: 0,
      areaUnit: 'acres',
      stage: 'Seeding',
      status: 'healthy',
      farmId: 1,
      zoneId: 1,
      notes: '',
    });
  };

  const handleAddCrop = async () => {
    if (!newCrop.name || !newCrop.plantingDate || !newCrop.expectedHarvestDate || newCrop.area <= 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      console.log('➕ Adding crop:', newCrop.name);
      setIsSubmitting(true);
      await cropsService.createCrop(newCrop);
      await loadCrops();
      console.log('✅ Crop added successfully, resetting form');
      resetForm(); // Reset form before closing modal
      setIsAddModalVisible(false);
      Alert.alert('Success', 'Crop added successfully!');
    } catch (error) {
      console.error('❌ Error adding crop:', error);
      Alert.alert('Error', 'Failed to add crop. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancelAdd = () => {
    console.log('❌ Cancel add crop');
    setIsAddModalVisible(false);
    resetForm();
  };

  const handleEditCrop = (crop: Crop) => {
    console.log('✏️ Starting edit crop:', crop);
    
    setEditingCrop(crop);
    
    // แปลง date ให้ถูกต้อง
    const plantingDate = typeof crop.plantingDate === 'string' 
      ? crop.plantingDate.split('T')[0] 
      : new Date(crop.plantingDate).toISOString().split('T')[0];
      
    const harvestDate = typeof crop.expectedHarvestDate === 'string'
      ? crop.expectedHarvestDate.split('T')[0]
      : new Date(crop.expectedHarvestDate).toISOString().split('T')[0];
    
    const formData = {
      name: crop.name,
      variety: crop.variety || '',
      plantingDate: plantingDate,
      expectedHarvestDate: harvestDate,
      area: crop.area || 0, // [!] แก้ไข: ป้องกันค่า null ทำให้แอปแครช
      areaUnit: crop.areaUnit,
      stage: crop.stage,
      status: crop.status,
      farmId: crop.farmId,
      zoneId: 1, // Set default zoneId since Crop interface doesn't include it
      notes: crop.notes || '',
    };
    
    console.log('📝 Setting form data:', formData);
    setNewCrop(formData);
    setIsEditModalVisible(true);
  };

  const handleUpdateCrop = async () => {
    console.log('🔄 Starting update crop process...');
    console.log('📝 editingCrop:', editingCrop);
    console.log('📝 newCrop data:', newCrop);
    
    if (!editingCrop || !editingCrop.id) {
      console.log('❌ No editing crop or missing ID');
      Alert.alert('Error', 'No crop selected for editing');
      return;
    }

    if (!newCrop.name || !newCrop.plantingDate || !newCrop.expectedHarvestDate || newCrop.area <= 0) {
      console.log('❌ Validation failed:', {
        name: newCrop.name,
        plantingDate: newCrop.plantingDate,
        expectedHarvestDate: newCrop.expectedHarvestDate,
        area: newCrop.area
      });
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    try {
      console.log('⏳ Setting submitting to true...');
      setIsSubmitting(true);
      
      const updatePayload: UpdateCropRequest = {
        id: editingCrop.id,
        name: newCrop.name,
        variety: newCrop.variety,
        plantingDate: newCrop.plantingDate,
        expectedHarvestDate: newCrop.expectedHarvestDate,
        area: newCrop.area,
        areaUnit: newCrop.areaUnit,
        stage: newCrop.stage,
        status: newCrop.status,
        farmId: newCrop.farmId,
        notes: newCrop.notes,
      };
      
      console.log('📤 Sending update request with payload:', updatePayload);
      const updatedCrop = await cropsService.updateCrop(editingCrop.id, updatePayload);
      console.log('✅ Update response:', updatedCrop);
      
      console.log('✅ Update successful, reloading crops...');
      await loadCrops();
      
      console.log('🚪 Closing modal and resetting state...');
      setIsEditModalVisible(false);
      setEditingCrop(null);
      resetForm();
      
      console.log('✅ Update process completed successfully');
      Alert.alert('Success', 'Crop updated successfully!');
    } catch (error) {
      console.error('❌ Error updating crop:', error);
      Alert.alert('Error', `Failed to update crop: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.log('🔄 Setting submitting to false...');
      setIsSubmitting(false);
    }
  };
  
  const handleCancelEdit = () => {
    console.log('❌ Cancel edit crop');
    setIsEditModalVisible(false);
    setEditingCrop(null);
    resetForm();
  };

  const handleDeleteCrop = (crop: Crop) => {
    // เช็คว่าตอนนี้แอปกำลังรันบนแพลตฟอร์มไหน
    if (Platform.OS === 'web') {
      // --- โค้ดสำหรับ Web ---
      // ใช้ confirm() ของเบราว์เซอร์โดยตรง
      const userConfirmed = confirm(`Are you sure you want to delete "${crop.name}"?`);

      if (userConfirmed) {
        if (!crop.id) return;
        
        cropsService.deleteCrop(crop.id)
          .then(() => {
            loadCrops(); // รีเฟรชข้อมูลเมื่อลบสำเร็จ
          })
          .catch(error => {
            console.error('Error deleting crop on web:', error);
            alert('Failed to delete crop. Please check the console for more details.');
          });
      }
    } else {
      // --- โค้ดสำหรับ Mobile (iOS, Android) ---
      // ใช้ Alert.alert() แบบเดิม
      Alert.alert(
        'Delete Crop',
        `Are you sure you want to delete "${crop.name}"? This action cannot be undone.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              if (!crop.id) return;
              try {
                await cropsService.deleteCrop(crop.id);
                await loadCrops();
              } catch (error) {
                console.error('Error deleting crop on native:', error);
                Alert.alert('Error', 'Failed to delete crop. Please try again.');
              }
            },
          },
        ]
      );
    }
  };

  // Filter crops based on search text
  const filteredCrops = crops.filter(crop => 
    crop.name.toLowerCase().includes(searchText.toLowerCase()) ||
    crop.variety?.toLowerCase().includes(searchText.toLowerCase()) ||
    crop.stage.toLowerCase().includes(searchText.toLowerCase()) ||
    crop.status.toLowerCase().includes(searchText.toLowerCase())
  );

  // --- ส่วนของ UI เหมือนเดิม ไม่มีการเปลี่ยนแปลง ---
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="grass" size={24} color="#4CAF50" style={styles.leafIcon} />
          <Text style={styles.brandText}>{t('crops.crops_management')}</Text>
        </View>
        <View style={styles.headerRight}>
          <LanguageToggleButton size="small" />
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="settings" size={20} color="#666" style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.searchTitle}>{t('crops.search_crops')}</Text>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput} 
            placeholder={t('crops.search_placeholder')} 
            value={searchText} 
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchButton}>
            <MaterialIcons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Crops Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('crops.current_crops')}</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Loading crops...</Text>
            </View>
          ) : filteredCrops.length === 0 ? (
            <View style={styles.emptyCropsContainer}>
              <MaterialIcons name="grass" size={48} color="#ccc" />
              <Text style={styles.emptyCropsText}>
                {searchText ? `No crops found matching "${searchText}"` : 'No crops found'}
              </Text>
              <Text style={styles.emptyCropsSubtext}>
                {searchText ? 'Try a different search term' : 'Start by adding your first crop'}
              </Text>
            </View>
          ) : (
            filteredCrops.map((crop) => (
              <View key={crop.id} style={styles.cropCard}>
                <View style={styles.cropHeader}>
                  <View style={styles.cropInfo}>
                    <MaterialIcons name="grass" size={20} color="#FFB74D" style={styles.cropIcon} />
                    <View>
                      <Text style={styles.cropName}>{crop.name}</Text>
                      <Text style={styles.cropStage}>{crop.stage}</Text>
                    </View>
                  </View>
                  <View style={styles.cropActions}>
                    <View style={styles.cropStatus}>
                      <Text style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(crop.status) }
                      ]}>
                        {getStatusText(crop.status)}
                      </Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditCrop(crop)}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="edit" size={18} color="#2196F3" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteCrop(crop)}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="delete" size={18} color="#F44336" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.cropStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>{t('crops.area')}</Text>
                    <Text style={styles.statValue}>{crop.area} {crop.areaUnit}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>{t('crops.planted')}</Text>
                    <Text style={styles.statValue}>{new Date(crop.plantingDate).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>{t('crops.harvest')}</Text>
                    <Text style={styles.statValue}>{new Date(crop.expectedHarvestDate).toLocaleDateString()}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('crops.quick_actions')}</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                console.log('🚀 Opening Add Crop modal');
                resetForm(); // Ensure form is clean when opening modal
                setIsAddModalVisible(true);
              }}
            >
              <MaterialIcons name="add" size={24} color="#4CAF50" style={styles.actionIcon} />
              <Text style={styles.actionTitle}>{t('crops.add_new_crop')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="analytics" size={24} color="#2196F3" style={styles.actionIcon} />
              <Text style={styles.actionTitle}>{t('crops.view_analytics')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="water-drop" size={24} color="#00BCD4" style={styles.actionIcon} />
              <Text style={styles.actionTitle}>{t('crops.irrigation')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <MaterialIcons name="science" size={24} color="#9C27B0" style={styles.actionIcon} />
              <Text style={styles.actionTitle}>{t('crops.soil_test')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('crops.recent_activities')}</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <MaterialIcons name="water-drop" size={20} color="#00BCD4" style={styles.activityIcon} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{t('crops.irrigation_completed')}</Text>
                <Text style={styles.activityTime}>2 {t('crops.hours_ago')}</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <MaterialIcons name="eco" size={20} color="#4CAF50" style={styles.activityIcon} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{t('crops.growth_stage_updated')}</Text>
                <Text style={styles.activityTime}>5 {t('crops.hours_ago')}</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <MaterialIcons name="science" size={20} color="#9C27B0" style={styles.activityIcon} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{t('crops.soil_analysis_report')}</Text>
                <Text style={styles.activityTime}>1 {t('crops.day_ago')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Navigation Bar */}
      <NavBar />

      {/* Add Crop Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelAdd}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modern Header with Gradient */}
            <View style={styles.modalHeader}>
              <View style={styles.headerContent}>
                <View style={styles.headerIconContainer}>
                  <MaterialIcons name="grass" size={24} color="#4CAF50" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Add New Crop</Text>
                  <Text style={styles.modalSubtitle}>Fill in the details below</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleCancelAdd}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Crop Name - Modern Input */}
              <View style={styles.modernFormGroup}>
                <Text style={styles.modernFormLabel}>
                  Crop Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="grass" size={20} color="#4CAF50" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modernFormInput}
                    value={newCrop.name}
                    onChangeText={(text) => setNewCrop(prev => ({ ...prev, name: text }))}
                    placeholder="e.g., Wheat, Corn, Rice"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Variety */}
              <View style={styles.modernFormGroup}>
                <Text style={styles.modernFormLabel}>Variety</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="eco" size={20} color="#4CAF50" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modernFormInput}
                    value={newCrop.variety}
                    onChangeText={(text) => setNewCrop(prev => ({ ...prev, variety: text }))}
                    placeholder="Enter variety (optional)"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Area & Unit - Modern Row */}
              <View style={styles.modernFormRow}>
                <View style={[styles.modernFormGroup, { flex: 2 }]}>
                  <Text style={styles.modernFormLabel}>
                    Area <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="crop-landscape" size={20} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                      style={styles.modernFormInput}
                      value={newCrop.area.toString()}
                      onChangeText={(text) => setNewCrop(prev => ({ ...prev, area: parseFloat(text) || 0 }))}
                      placeholder="e.g., 25.5"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={[styles.modernFormGroup, { flex: 1 }]}>
                  <Text style={styles.modernFormLabel}>Unit</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.modernFormInput, { paddingLeft: 15 }]}
                      value={newCrop.areaUnit}
                      onChangeText={(text) => setNewCrop(prev => ({ ...prev, areaUnit: text }))}
                      placeholder="acres"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              {/* Dates Row */}
              <View style={styles.modernFormRow}>
                <View style={[styles.modernFormGroup, { flex: 1 }]}>
                  <Text style={styles.modernFormLabel}>
                    Planting Date <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="event" size={20} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                      style={styles.modernFormInput}
                      value={newCrop.plantingDate}
                      onChangeText={(text) => setNewCrop(prev => ({ ...prev, plantingDate: text }))}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
                <View style={[styles.modernFormGroup, { flex: 1 }]}>
                  <Text style={styles.modernFormLabel}>
                    Harvest Date <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="schedule" size={20} color="#4CAF50" style={styles.inputIcon} />
                    <TextInput
                      style={styles.modernFormInput}
                      value={newCrop.expectedHarvestDate}
                      onChangeText={(text) => setNewCrop(prev => ({ ...prev, expectedHarvestDate: text }))}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              {/* Growth Stage */}
              <View style={styles.modernFormGroup}>
                <Text style={styles.modernFormLabel}>Growth Stage</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="trending-up" size={20} color="#4CAF50" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modernFormInput}
                    value={newCrop.stage}
                    onChangeText={(text) => setNewCrop(prev => ({ ...prev, stage: text }))}
                    placeholder="e.g., Flowering Stage, Vegetative Growth"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Modern Status Selection */}
              <View style={styles.modernFormGroup}>
                <Text style={styles.modernFormLabel}>Status</Text>
                <View style={styles.modernStatusRow}>
                  <TouchableOpacity
                    style={[
                      styles.modernStatusOption,
                      styles.healthyOption,
                      newCrop.status === 'healthy' && styles.modernStatusSelected,
                      newCrop.status === 'healthy' && { backgroundColor: getStatusColor('healthy') }
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'healthy' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={newCrop.status === 'healthy' ? 'white' : getStatusColor('healthy')}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'healthy' ? 'white' : getStatusColor('healthy') }
                    ]}>
                      {getStatusText('healthy')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modernStatusOption,
                      styles.monitorOption,
                      newCrop.status === 'monitor' && styles.modernStatusSelected,
                      newCrop.status === 'monitor' && { backgroundColor: getStatusColor('monitor') }
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'monitor' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="warning"
                      size={20}
                      color={newCrop.status === 'monitor' ? 'white' : getStatusColor('monitor')}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'monitor' ? 'white' : getStatusColor('monitor') }
                    ]}>
                      {getStatusText('monitor')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modernStatusOption,
                      styles.criticalOption,
                      newCrop.status === 'critical' && styles.modernStatusSelected,
                      newCrop.status === 'critical' && { backgroundColor: getStatusColor('critical') }
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'critical' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="error"
                      size={20}
                      color={newCrop.status === 'critical' ? 'white' : getStatusColor('critical')}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'critical' ? 'white' : getStatusColor('critical') }
                    ]}>
                      {getStatusText('critical')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notes - Modern Text Area */}
              <View style={styles.modernFormGroup}>
                <Text style={styles.modernFormLabel}>Notes</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <MaterialIcons name="notes" size={20} color="#4CAF50" style={[styles.inputIcon, styles.textAreaIcon]} />
                  <TextInput
                    style={[styles.modernFormInput, styles.modernTextArea]}
                    value={newCrop.notes}
                    onChangeText={(text) => setNewCrop(prev => ({ ...prev, notes: text }))}
                    placeholder="Additional notes (optional)"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>

              <View style={styles.modalFormPadding} />
            </ScrollView>

            {/* Modern Footer */}
            <View style={styles.modernModalFooter}>
              <TouchableOpacity
                style={styles.modernCancelButton}
                onPress={handleCancelAdd}
                activeOpacity={0.8}
              >
                <Text style={styles.modernCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modernSaveButton,
                  isSubmitting && styles.disabledButton
                ]}
                onPress={handleAddCrop}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <View style={styles.modernLoadingContainer}>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={styles.modernSaveButtonText}>Adding...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="add" size={20} color="white" />
                    <Text style={styles.modernSaveButtonText}>Add Crop</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Crop Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modern Header with Gradient */}
            <View style={styles.modalHeader}>
              <View style={styles.headerContent}>
                <View style={styles.headerIconContainer}>
                  <MaterialIcons name="edit" size={24} color="#2196F3" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Edit Crop</Text>
                  <Text style={styles.modalSubtitle}>Update crop information</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleCancelEdit}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Same form fields as Add Modal but for editing */}
              <View style={styles.modernFormGroup}>
                <Text style={styles.modernFormLabel}>
                  Crop Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="grass" size={20} color="#2196F3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modernFormInput}
                    value={newCrop.name}
                    onChangeText={(text) => setNewCrop(prev => ({ ...prev, name: text }))}
                    placeholder="e.g., Wheat, Corn, Rice"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.modernFormGroup}>
                <Text style={styles.modernFormLabel}>Variety</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="eco" size={20} color="#2196F3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modernFormInput}
                    value={newCrop.variety}
                    onChangeText={(text) => setNewCrop(prev => ({ ...prev, variety: text }))}
                    placeholder="Enter variety (optional)"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.modernFormRow}>
                <View style={[styles.modernFormGroup, { flex: 2 }]}>
                  <Text style={styles.modernFormLabel}>
                    Area <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="crop-landscape" size={20} color="#2196F3" style={styles.inputIcon} />
                    <TextInput
                      style={styles.modernFormInput}
                      value={newCrop.area.toString()}
                      onChangeText={(text) => setNewCrop(prev => ({ ...prev, area: parseFloat(text) || 0 }))}
                      placeholder="e.g., 25.5"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={[styles.modernFormGroup, { flex: 1 }]}>
                  <Text style={styles.modernFormLabel}>Unit</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.modernFormInput, { paddingLeft: 15 }]}
                      value={newCrop.areaUnit}
                      onChangeText={(text) => setNewCrop(prev => ({ ...prev, areaUnit: text }))}
                      placeholder="acres"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.modernFormRow}>
                <View style={[styles.modernFormGroup, { flex: 1 }]}>
                  <Text style={styles.modernFormLabel}>
                    Planting Date <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="event" size={20} color="#2196F3" style={styles.inputIcon} />
                    <TextInput
                      style={styles.modernFormInput}
                      value={newCrop.plantingDate}
                      onChangeText={(text) => setNewCrop(prev => ({ ...prev, plantingDate: text }))}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
                <View style={[styles.modernFormGroup, { flex: 1 }]}>
                  <Text style={styles.modernFormLabel}>
                    Harvest Date <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="schedule" size={20} color="#2196F3" style={styles.inputIcon} />
                    <TextInput
                      style={styles.modernFormInput}
                      value={newCrop.expectedHarvestDate}
                      onChangeText={(text) => setNewCrop(prev => ({ ...prev, expectedHarvestDate: text }))}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.modernFormGroup}>
                <Text style={styles.modernFormLabel}>Growth Stage</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="trending-up" size={20} color="#2196F3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modernFormInput}
                    value={newCrop.stage}
                    onChangeText={(text) => setNewCrop(prev => ({ ...prev, stage: text }))}
                    placeholder="e.g., Flowering Stage, Vegetative Growth"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.modernFormGroup}>
                <Text style={styles.modernFormLabel}>Status</Text>
                <View style={styles.modernStatusRow}>
                  <TouchableOpacity
                    style={[
                      styles.modernStatusOption,
                      styles.healthyOption,
                      newCrop.status === 'healthy' && styles.modernStatusSelected,
                      newCrop.status === 'healthy' && { backgroundColor: getStatusColor('healthy') }
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'healthy' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={newCrop.status === 'healthy' ? 'white' : getStatusColor('healthy')}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'healthy' ? 'white' : getStatusColor('healthy') }
                    ]}>
                      {getStatusText('healthy')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modernStatusOption,
                      styles.monitorOption,
                      newCrop.status === 'monitor' && styles.modernStatusSelected,
                      newCrop.status === 'monitor' && { backgroundColor: getStatusColor('monitor') }
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'monitor' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="warning"
                      size={20}
                      color={newCrop.status === 'monitor' ? 'white' : getStatusColor('monitor')}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'monitor' ? 'white' : getStatusColor('monitor') }
                    ]}>
                      {getStatusText('monitor')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modernStatusOption,
                      styles.criticalOption,
                      newCrop.status === 'critical' && styles.modernStatusSelected,
                      newCrop.status === 'critical' && { backgroundColor: getStatusColor('critical') }
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'critical' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="error"
                      size={20}
                      color={newCrop.status === 'critical' ? 'white' : getStatusColor('critical')}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'critical' ? 'white' : getStatusColor('critical') }
                    ]}>
                      {getStatusText('critical')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modernFormGroup}>
                <Text style={styles.modernFormLabel}>Notes</Text>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <MaterialIcons name="notes" size={20} color="#2196F3" style={[styles.inputIcon, styles.textAreaIcon]} />
                  <TextInput
                    style={[styles.modernFormInput, styles.modernTextArea]}
                    value={newCrop.notes}
                    onChangeText={(text) => setNewCrop(prev => ({ ...prev, notes: text }))}
                    placeholder="Additional notes (optional)"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>

              <View style={styles.modalFormPadding} />
            </ScrollView>

            <View style={styles.modernModalFooter}>
              <TouchableOpacity
                style={styles.modernCancelButton}
                onPress={handleCancelEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.modernCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modernUpdateButton,
                  isSubmitting && styles.disabledButton
                ]}
                onPress={() => {
                  console.log('🔘 Update button pressed!');
                  handleUpdateCrop();
                }}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <View style={styles.modernLoadingContainer}>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={styles.modernSaveButtonText}>Updating...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="save" size={20} color="white" />
                    <Text style={styles.modernSaveButtonText}>Update Crop</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
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
    gap: 8,
  },
  leafIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  brandText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 16,
    color: 'white',
  },
  // Search Section Styles
  searchSection: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f0f8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 8,
    color: '#333',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cropCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cropStage: {
    fontSize: 12,
    color: '#666',
  },
  cropStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cropStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 3,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  activityList: {
    gap: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  activityIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    marginBottom: 1,
  },
  activityTime: {
    fontSize: 10,
    color: '#999',
  },
  bottomSpace: {
    height: 120,
  },
  // Loading styles
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  // Empty state styles
  emptyCropsContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyCropsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyCropsSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12, // Minimal horizontal padding
    paddingVertical: 40, // Minimal vertical padding
  },
  modalContainer: {
    width: '100%',
    maxWidth: '100%', // Ensure full width
    height: '85%', // Use fixed height percentage
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20, // Increased from 16 to 20
    paddingBottom: 16, // Increased from 12 to 16
    backgroundColor: '#f8fffe',
    borderBottomWidth: 1,
    borderBottomColor: '#e8f5e8',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconContainer: {
    width: 48, // Increased from 40 to 48
    height: 48, // Increased from 40 to 48
    backgroundColor: '#e8f5e8',
    borderRadius: 24, // Adjusted to match new size
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16, // Increased from 12 to 16
  },
  modalTitle: {
    fontSize: 20, // Increased from 18 to 20
    fontWeight: 'bold',
    color: '#1a5d1a',
    marginBottom: 4, // Increased from 2 to 4
  },
  modalSubtitle: {
    fontSize: 14, // Increased from 12 to 14
    color: '#666',
    fontWeight: '500',
  },
  closeButton: {
    width: 40, // Increased from 32 to 40
    height: 40, // Increased from 32 to 40
    backgroundColor: '#f0f0f0',
    borderRadius: 20, // Adjusted to match new size
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20, // Increased padding from 16 to 20
    paddingTop: 16,
  },

  // Modern Form Styles
  modernFormGroup: {
    marginBottom: 20, // Increased from 16 to 20
  },
  modernFormRow: {
    flexDirection: 'row',
    gap: 16, // Increased gap from 12 to 16
    marginBottom: 20, // Increased from 16 to 20
  },
  modernFormLabel: {
    fontSize: 16, // Increased from 14 to 16
    fontWeight: '600',
    color: '#1a5d1a',
    marginBottom: 10, // Increased from 8 to 10
  },
  requiredStar: {
    color: '#e53e3e',
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fffe',
    borderWidth: 1.5,
    borderColor: '#e8f5e8',
    borderRadius: 12,
    paddingHorizontal: 16, // Increased from 12 to 16
    paddingVertical: 4, // Increased from 2 to 4
    minHeight: 52, // Increased from 44 to 52
  },
  inputIcon: {
    marginRight: 8,
  },
  modernFormInput: {
    flex: 1,
    fontSize: 16, // Increased from 14 to 16
    color: '#333',
    paddingVertical: 12, // Increased from 10 to 12
    minHeight: 20, // Increased from 18 to 20
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 8, // Increased from 6 to 8
    minHeight: 80, // Increased from 70 to 80
  },
  textAreaIcon: {
    alignSelf: 'flex-start',
    marginTop: 8, // Increased from 6 to 8
  },
  modernTextArea: {
    minHeight: 60, // Increased from 50 to 60
    maxHeight: 120, // Increased from 100 to 120
    textAlignVertical: 'top',
    paddingTop: 8, // Increased from 6 to 8
  },

  // Modern Status Selection
  modernStatusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modernStatusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16, // Increased from 12 to 16
    paddingHorizontal: 12, // Increased from 8 to 12
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: 'white',
    gap: 8, // Increased from 6 to 8
  },
  healthyOption: {
    borderColor: '#c6f6d5',
    backgroundColor: '#f0fff4',
  },
  monitorOption: {
    borderColor: '#fed7aa',
    backgroundColor: '#fffbeb',
  },
  criticalOption: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  modernStatusSelected: {
    transform: [{ scale: 1.02 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  // Selected state backgrounds
  healthySelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  monitorSelected: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  criticalSelected: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  modernStatusText: {
    fontSize: 14, // Increased from 12 to 14
    fontWeight: '600',
  },
  modernStatusTextSelected: {
    color: 'white',
  },

  // Modern Footer
  modernModalFooter: {
    flexDirection: 'row',
    padding: 20, // Increased from 16 to 20
    paddingTop: 16, // Increased from 12 to 16
    backgroundColor: '#f8fffe',
    borderTopWidth: 1,
    borderTopColor: '#e8f5e8',
    gap: 12, // Increased from 10 to 12
  },
  modernCancelButton: {
    flex: 1,
    padding: 16, // Increased from 12 to 16
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  modernSaveButton: {
    flex: 2,
    padding: 16, // Increased from 12 to 16
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modernLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modernCancelButtonText: {
    color: '#666',
    fontSize: 16, // Increased from 14 to 16
    fontWeight: '600',
  },
  modernSaveButtonText: {
    color: 'white',
    fontSize: 16, // Increased from 14 to 16
    fontWeight: '700',
  },
  // Crop card action styles
  cropActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  editButton: {
    width: 28,
    height: 28,
    backgroundColor: '#e3f2fd',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  deleteButton: {
    width: 28,
    height: 28,
    backgroundColor: '#ffebee',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },

  // Modern Update Button (different color from Save)
  modernUpdateButton: {
    flex: 2,
    padding: 16, // Increased from 12 to 16
    borderRadius: 12,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalFormPadding: {
    height: 16, // Increased from 12 to 16
  },
});
