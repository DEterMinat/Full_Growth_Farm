import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/contexts/AuthContext';
import NavBar from '@/components/navigation/NavBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LanguageToggleButton } from '@/components/LanguageToggleButton';

export default function Profile() {
  const { t } = useTranslation();
  const { user, isLoading, isGuest, logout } = useAuth();
  //const [user, setUser] = useState<User | null>(authUser);
  //const [isLoading, setIsLoading] = useState(false);

  /*const loadUserData = async () => {
    try {
      setIsLoading(true);
      await refreshUser();
    } catch (error: any) {
      Alert.alert(t('profile.error'), t('profile.failed_load_user') + error.message);
      router.push('/(auth)/login');
    } finally {
      setIsLoading(false);
    }
  };*/

  /*useEffect(() => {
    if (authUser) {
      setUser(authUser);
    } else {
      loadUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);*/

  const handleLogout = async () => {
  console.log('Testing direct logout call (bypassing Alert)...');
    try {
      // เรียก logout() โดยตรง ไม่ต้องมี Alert
      await logout();
      console.log('Direct logout call successful!');
    } catch (error) {
      console.error('Direct logout call failed:', error);
      // ในกรณีที่เกิด error จริงๆ ให้แสดง Alert แบบเดิม
      Alert.alert('Error', 'An unexpected error occurred during logout.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('profile.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="person" size={20} color="white" style={styles.profileIcon} />
          <Text style={styles.brandText}>{t('profile.profile_header')}</Text>
          {isGuest && (
            <View style={styles.guestBadge}>
              <Text style={styles.guestBadgeText}>{t('profile.demo_badge')}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <LanguageToggleButton size="small" />
          <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.section}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="person" size={40} color="#4CAF50" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.infoValue}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userRole}>
                {t('profile.farm_owner')}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>{t('profile.farms')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>85.5</Text>
              <Text style={styles.statLabel}>{t('profile.total_acres')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>{t('profile.crop_types')}</Text>
            </View>
          </View>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.account_information')}</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('profile.username')}</Text>
              <Text style={styles.infoValue}>{user?.username}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('profile.email')}</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            {user?.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('profile.phone')}</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('profile.member_since')}</Text>
              <Text style={styles.infoValue}>
                {new Date(user?.created_at || '').toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.account_settings')}</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="edit" size={18} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('profile.edit_profile')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={18} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('profile.notification')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="lock" size={18} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('profile.privacy_security')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="payment" size={18} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('profile.subscription')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.app_settings')}</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="dark-mode" size={18} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('profile.dark_mode')}</Text>
            </View>
            <View style={styles.toggle}>
              <Text style={styles.toggleText}>{t('profile.off')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="language" size={18} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('profile.language')}</Text>
            </View>
            <Text style={styles.settingValue}>English</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="analytics" size={18} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('profile.data_analytics')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Support & Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.support_help')}</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="help" size={18} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('profile.help_center')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="support" size={18} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('profile.contact_support')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="star-rate" size={18} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('profile.rate_app')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="description" size={18} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>{t('profile.terms_privacy')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={18} color="#f44336" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>{t('profile.sign_out')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Navigation Bar */}
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileIcon: {
    marginRight: 8,
  },
  brandText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  editButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
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
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
  toggle: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  toggleText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 12,
    paddingVertical: 15,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 120,
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
  guestBadge: {
    backgroundColor: '#FFE4B5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  guestBadgeText: {
    fontSize: 10,
    color: '#B8860B',
    fontWeight: '600',
  },
});
