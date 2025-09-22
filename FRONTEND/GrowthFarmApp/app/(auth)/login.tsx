import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Alert,
  Modal // <-- 1. เพิ่ม Modal เข้ามา
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/contexts/AuthContext';
import { LanguageToggleButton } from '@/components/LanguageToggleButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReAnimated, { 
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInLeft
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // --- ✨ [จุดที่ 1] เพิ่ม State สำหรับ Error Modal ---
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      setIsErrorModalVisible(true);
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      console.log('Login successful, redirecting to dashboard...');
      router.push('/(app)/dashboard');
    } catch (error: any) {
      // --- ✨ [จุดที่ 2] เรียกใช้ Modal แทน Alert ---
      console.error('Login error:', error);
      // Backend มักจะส่ง message กลับมา เราจะใช้ message นั้น
      setErrorMessage(error.message || 'An unknown error occurred. Please try again.');
      setIsErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('./register');
  };

  const handleGuestLogin = async () => {
    try {
      console.log('🎭 Handling Guest login...');
      setIsLoading(true);
      await AsyncStorage.setItem('growth_farm_guest_mode', 'true');
      await AsyncStorage.setItem('growth_farm_user', JSON.stringify({
        id: 'guest',
        username: 'Guest User',
        email: 'guest@growthfarm.com',
        full_name: 'Demo User',
        is_guest: true
      }));
      console.log('🎭 Guest login successful, redirecting to dashboard...');
      router.replace('/(app)/dashboard');
    } catch (error: any) {
      console.error('🎭 Guest login error:', error);
      Alert.alert('Error', 'Failed to login as guest');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWelcome = () => {
    router.back();
  };

  // --- ฟังก์ชันใหม่สำหรับปิด Error Modal ---
  const handleErrorModalClose = () => {
    setIsErrorModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ... (โค้ด UI ส่วนอื่นๆ เหมือนเดิมทั้งหมด) ... */}
      
      <View style={styles.languageToggle}>
        <LanguageToggleButton size="small" showText={false} />
      </View>
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ReAnimated.View 
          style={styles.header}
          entering={FadeInDown.duration(600)}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBackToWelcome}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </ReAnimated.View>

        <ReAnimated.View 
          style={styles.brandSection}
          entering={FadeInUp.delay(200).duration(800)}
        >
          <MaterialIcons name="eco" size={40} color="#4CAF50" />
          <Text style={styles.brandText}>GROWTH FARM</Text>
          <Text style={styles.welcomeText}>{t('auth.welcome_back')}</Text>
          <Text style={styles.subText}>{t('auth.sign_in_account')}</Text>
        </ReAnimated.View>

        <ReAnimated.View 
          style={styles.formContainer}
          entering={SlideInLeft.delay(400).duration(800)}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.email')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('auth.enter_email')}
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.password')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('auth.enter_password')}
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>{t('auth.forgot_password')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? t('common.loading') : t('common.login')}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <MaterialIcons name="email" size={20} color="#4285F4" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.guestButton} 
            onPress={handleGuestLogin}
            disabled={isLoading}
          >
            <MaterialIcons name="person" size={20} color="#666" />
            <Text style={styles.guestButtonText}>{t('auth.login_as_guest')}</Text>
          </TouchableOpacity>
        </ReAnimated.View>

        <ReAnimated.View 
          style={styles.registerSection}
          entering={FadeIn.delay(600).duration(600)}
        >
          <Text style={styles.registerText}>{t('auth.no_account')} </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerLink}>{t('common.register')}</Text>
          </TouchableOpacity>
        </ReAnimated.View>
      </Animated.View>

      {/* --- ✨ [จุดที่ 3] โค้ด UI ของ Error Modal --- */}
      <Modal
        visible={isErrorModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleErrorModalClose}
      >
        <View style={styles.errorModalOverlay}>
          <View style={styles.errorModalContainer}>
            <View style={styles.errorIconContainer}>
              <MaterialIcons name="error-outline" size={60} color="white" />
            </View>
            <Text style={styles.errorTitle}>Login Failed</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <TouchableOpacity style={styles.errorButton} onPress={handleErrorModalClose}>
              <Text style={styles.errorButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... (Style เดิมทั้งหมด)
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 20,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 1,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  socialIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  registerText: {
    fontSize: 16,
    color: '#666',
  },
  registerLink: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  languageToggle: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFA726',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#FFF8E1',
  },
  guestIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  guestButtonText: {
    fontSize: 16,
    color: '#F57C00',
    fontWeight: '600',
  },

  // --- ✨ [จุดที่ 4] Style ใหม่สำหรับ Error Modal ---
  errorModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorModalContainer: {
    width: '85%',
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F44336', // Red color for error
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  errorButton: {
    backgroundColor: '#F44336', // Red color for error
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 50,
    width: '100%',
    alignItems: 'center',
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});