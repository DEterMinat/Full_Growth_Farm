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

  const handleAddCrop = async () => {
    if (!newCrop.name || !newCrop.plantingDate || !newCrop.expectedHarvestDate || newCrop.area <= 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      setIsSubmitting(true);
      const payload: CreateCropRequest = {
        ...newCrop,
        plantingDate: new Date(newCrop.plantingDate).toISOString(),
        expectedHarvestDate: new Date(newCrop.expectedHarvestDate).toISOString(),
      };
      await cropsService.createCrop(newCrop);
      await loadCrops();
      setIsAddModalVisible(false);
      Alert.alert('Success', 'Crop added successfully!');
    } catch (error) {
      console.error('Error adding crop:', error);
      Alert.alert('Error', 'Failed to add crop. Please try again.');
    } finally {
      setIsSubmitting(false);
      // Reset form only after submission finishes
      setNewCrop({
        name: '', variety: '', plantingDate: '', expectedHarvestDate: '',
        area: 0, areaUnit: 'acres', stage: 'Seeding', status: 'healthy', farmId: 1, notes: '',
      });
    }
  };
  
  const handleCancelAdd = () => {
    setIsAddModalVisible(false);
    setNewCrop({
        name: '', variety: '', plantingDate: '', expectedHarvestDate: '',
        area: 0, areaUnit: 'acres', stage: 'Seeding', status: 'healthy', farmId: 1, notes: '',
    });
  };

  const handleEditCrop = (crop: Crop) => {
    setEditingCrop(crop);
    setNewCrop({
      name: crop.name,
      variety: crop.variety || '',
      plantingDate: new Date(crop.plantingDate).toISOString().split('T')[0],
      expectedHarvestDate: new Date(crop.expectedHarvestDate).toISOString().split('T')[0],
      area: crop.area || 0, // [!] แก้ไข: ป้องกันค่า null ทำให้แอปแครช
      areaUnit: crop.areaUnit,
      stage: crop.stage,
      status: crop.status,
      farmId: crop.farmId,
      notes: crop.notes || '',
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateCrop = async () => {
    if (!editingCrop || !editingCrop.id) return;

    if (!newCrop.name || !newCrop.plantingDate || !newCrop.expectedHarvestDate || newCrop.area <= 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      setIsSubmitting(true);
      const updatePayload: UpdateCropRequest = {
        ...newCrop,
        id: editingCrop.id,
      };
      await cropsService.updateCrop(editingCrop.id, updatePayload);
      await loadCrops();
      setIsEditModalVisible(false);
      setEditingCrop(null);
      Alert.alert('Success', 'Crop updated successfully!');
    } catch (error) {
      console.error('Error updating crop:', error);
      Alert.alert('Error', 'Failed to update crop. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    setEditingCrop(null);
    setNewCrop({
        name: '', variety: '', plantingDate: '', expectedHarvestDate: '',
        area: 0, areaUnit: 'acres', stage: 'Seeding', status: 'healthy', farmId: 1, notes: '',
    });
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
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="settings" size={20} color="#666" style={styles.filterIcon} />
        </TouchableOpacity>
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
                        crop.status === 'monitor' && styles.warningBadge,
                        crop.status === 'critical' && styles.criticalBadge
                      ]}>
                        {crop.status}
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
              onPress={() => setIsAddModalVisible(true)}
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
                      newCrop.status === 'healthy' && styles.healthySelected
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'healthy' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={newCrop.status === 'healthy' ? 'white' : '#4CAF50'}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'healthy' ? 'white' : '#4CAF50' }
                    ]}>
                      Healthy
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modernStatusOption,
                      styles.monitorOption,
                      newCrop.status === 'monitor' && styles.modernStatusSelected,
                      newCrop.status === 'monitor' && styles.monitorSelected
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'monitor' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="warning"
                      size={20}
                      color={newCrop.status === 'monitor' ? 'white' : '#FF9800'}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'monitor' ? 'white' : '#FF9800' }
                    ]}>
                      Monitor
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modernStatusOption,
                      styles.criticalOption,
                      newCrop.status === 'critical' && styles.modernStatusSelected,
                      newCrop.status === 'critical' && styles.criticalSelected
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'critical' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="error"
                      size={20}
                      color={newCrop.status === 'critical' ? 'white' : '#F44336'}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'critical' ? 'white' : '#F44336' }
                    ]}>
                      Critical
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
                      newCrop.status === 'healthy' && styles.healthySelected
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'healthy' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={newCrop.status === 'healthy' ? 'white' : '#4CAF50'}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'healthy' ? 'white' : '#4CAF50' }
                    ]}>
                      Healthy
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modernStatusOption,
                      styles.monitorOption,
                      newCrop.status === 'monitor' && styles.modernStatusSelected,
                      newCrop.status === 'monitor' && styles.monitorSelected
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'monitor' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="warning"
                      size={20}
                      color={newCrop.status === 'monitor' ? 'white' : '#FF9800'}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'monitor' ? 'white' : '#FF9800' }
                    ]}>
                      Monitor
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modernStatusOption,
                      styles.criticalOption,
                      newCrop.status === 'critical' && styles.modernStatusSelected,
                      newCrop.status === 'critical' && styles.criticalSelected
                    ]}
                    onPress={() => setNewCrop(prev => ({ ...prev, status: 'critical' }))}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name="error"
                      size={20}
                      color={newCrop.status === 'critical' ? 'white' : '#F44336'}
                    />
                    <Text style={[
                      styles.modernStatusText,
                      { color: newCrop.status === 'critical' ? 'white' : '#F44336' }
                    ]}>
                      Critical
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
                onPress={handleUpdateCrop}
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
  // Search Section Styles
  searchSection: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f0f8f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
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
  // Loading styles
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  // Empty state styles
  emptyCropsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyCropsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  emptyCropsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  // Additional badge style
  criticalBadge: {
    backgroundColor: '#F44336',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    maxWidth: 450,
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 20,
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
    width: 48,
    height: 48,
    backgroundColor: '#e8f5e8',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a5d1a',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  closeButton: {
    width: 36,
    height: 36,
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 24,
    paddingTop: 20,
  },

  // Modern Form Styles
  modernFormGroup: {
    marginBottom: 24,
  },
  modernFormRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  modernFormLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a5d1a',
    marginBottom: 12,
  },
  requiredStar: {
    color: '#e53e3e',
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fffe',
    borderWidth: 2,
    borderColor: '#e8f5e8',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 2,
    minHeight: 48,
  },
  inputIcon: {
    marginRight: 12,
  },
  modernFormInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    minHeight: 20,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 8,
    minHeight: 88,
  },
  textAreaIcon: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  modernTextArea: {
    minHeight: 68,
    maxHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 8,
  },

  // Modern Status Selection
  modernStatusRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modernStatusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: 'white',
    gap: 8,
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
    fontSize: 14,
    fontWeight: '600',
  },
  modernStatusTextSelected: {
    color: 'white',
  },

  // Modern Footer
  modernModalFooter: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
    backgroundColor: '#f8fffe',
    borderTopWidth: 1,
    borderTopColor: '#e8f5e8',
    gap: 12,
  },
  modernCancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  modernSaveButton: {
    flex: 2,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    fontSize: 16,
    fontWeight: '600',
  },
  modernSaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  // Crop card action styles
  cropActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  deleteButton: {
    width: 32,
    height: 32,
    backgroundColor: '#ffebee',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },

  // Modern Update Button (different color from Save)
  modernUpdateButton: {
    flex: 2,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalFormPadding: {
    height: 20,
  },

  // Old Modal styles (keeping for compatibility)
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Status selection styles
  statusRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  statusSelected: {
    backgroundColor: '#4CAF50',
  },
  statusMonitor: {
    borderColor: '#FF9800',
  },
  statusCritical: {
    borderColor: '#F44336',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  statusTextSelected: {
    color: 'white',
  },
});
