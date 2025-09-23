import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/contexts/AuthContext';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import authService from '@/src/services/authService';

interface EditableUser {
  username: string;
  email: string;
  fullName: string;
  phone: string;
}

export default function EditProfile() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<EditableUser>({
    username: '',
    email: '',
    fullName: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleCancel = React.useCallback(() => {
    // Check if form has been modified
    const hasChanges = user && (
      formData.username !== user.username ||
      formData.email !== user.email ||
      formData.fullName !== user.fullName ||
      formData.phone !== user.phone
    );

    if (hasChanges) {
      Alert.alert(
        '⚠️ ' + t('editProfile.discard_changes'),
        t('editProfile.discard_message'),
        [
          {
            text: t('editProfile.keep_editing'),
            style: 'cancel',
          },
          {
            text: t('editProfile.discard'),
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      // No changes, just go back
      router.back();
    }
  }, [user, formData, t]);

  // Handle Android back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleCancel();
        return true; // Prevent default back action
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [handleCancel])
  );

  const handleInputChange = (field: keyof EditableUser, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      Alert.alert(t('editProfile.error'), t('editProfile.username_required'));
      return false;
    }
    
    if (!formData.email.trim()) {
      Alert.alert(t('editProfile.error'), t('editProfile.email_required'));
      return false;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert(t('editProfile.error'), t('editProfile.invalid_email'));
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Update profile via API
      const response = await authService.updateProfile(formData);
      
      if (response.success) {
        // Refresh user data in context
        await refreshUser();
        
        // Show success alert with better messaging
        Alert.alert(
          '✅ ' + t('editProfile.success'),
          t('editProfile.profile_updated'),
          [
            {
              text: t('editProfile.ok'),
              onPress: () => router.back(),
            },
          ],
          { cancelable: false }
        );
      } else {
        throw new Error(response.message || t('editProfile.update_failed'));
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert(
        '❌ ' + t('editProfile.error'),
        error.message || t('editProfile.update_failed'),
        [{ text: t('editProfile.ok') }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>{t('editProfile.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleCancel}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('editProfile.edit_profile')}</Text>
        <TouchableOpacity
          style={[styles.headerButton, { opacity: isSaving ? 0.5 : 1 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialIcons name="check" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={60} color="#4CAF50" />
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <Text style={styles.changePhotoText}>{t('editProfile.change_photo')}</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>{t('editProfile.personal_information')}</Text>

          {/* Username */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{t('editProfile.username')}</Text>
            <TextInput
              style={styles.textInput}
              value={formData.username}
              onChangeText={(text) => handleInputChange('username', text)}
              placeholder={t('editProfile.enter_username')}
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{t('editProfile.email')}</Text>
            <TextInput
              style={styles.textInput}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder={t('editProfile.enter_email')}
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Full Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{t('editProfile.full_name')}</Text>
            <TextInput
              style={styles.textInput}
              value={formData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
              placeholder={t('editProfile.enter_full_name')}
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          </View>

          {/* Phone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{t('editProfile.phone')}</Text>
            <TextInput
              style={styles.textInput}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder={t('editProfile.enter_phone')}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>{t('editProfile.account_settings')}</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="lock" size={20} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('editProfile.change_password')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={20} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('editProfile.notification_preferences')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="privacy-tip" size={20} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('editProfile.privacy_settings')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>{t('editProfile.danger_zone')}</Text>
          
          <TouchableOpacity style={styles.dangerItem}>
            <MaterialIcons name="delete-forever" size={20} color="#f44336" style={styles.settingIcon} />
            <Text style={styles.dangerText}>{t('editProfile.delete_account')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 12,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
    borderRadius: 20,
  },
  changePhotoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 0,
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
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dangerSection: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 15,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dangerText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: '500',
  },
  bottomSpace: {
    height: 50,
  },
});