import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Alert 
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReAnimated, { 
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInLeft
} from 'react-native-reanimated';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginAsGuest } = useAuth();

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
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call AuthContext login
      await login(email, password);
      
      console.log('Login successful, redirecting to dashboard...');
      // Direct redirect to dashboard
      router.push('/(app)/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
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
      console.log('🎭 loginAsGuest type:', typeof loginAsGuest);
      setIsLoading(true);
      
      // Check if loginAsGuest function exists
      if (typeof loginAsGuest === 'function') {
        await loginAsGuest();
      } else {
        console.warn('⚠️ loginAsGuest function not available, using fallback');
        // Fallback: Set guest mode directly in AsyncStorage
        await AsyncStorage.setItem('growth_farm_guest_mode', 'true');
        await AsyncStorage.setItem('growth_farm_user', JSON.stringify({
          id: 'guest',
          username: 'Guest User',
          email: 'guest@growthfarm.com',
          full_name: 'Demo User',
          is_guest: true
        }));
      }
      
      console.log('🎭 Guest login successful, redirecting to dashboard...');
      // Use replace instead of push to prevent going back to login
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Header */}
        <ReAnimated.View 
          style={styles.header}
          entering={FadeInDown.duration(600)}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBackToWelcome}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
          <View style={styles.placeholder} />
        </ReAnimated.View>

        {/* Brand Section */}
        <ReAnimated.View 
          style={styles.brandSection}
          entering={FadeInUp.delay(200).duration(800)}
        >
          <Text style={styles.brandIcon}>🌱</Text>
          <Text style={styles.brandText}>GROWTH FARM</Text>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.subText}>Sign in to your account</Text>
        </ReAnimated.View>

        {/* Login Form */}
        <ReAnimated.View 
          style={styles.formContainer}
          entering={SlideInLeft.delay(400).duration(800)}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}>📧</Text>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Guest Login Button */}
          <TouchableOpacity 
            style={styles.guestButton} 
            onPress={handleGuestLogin}
            disabled={isLoading}
          >
            <Text style={styles.guestIcon}>👤</Text>
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </ReAnimated.View>

        {/* Register Link */}
        <ReAnimated.View 
          style={styles.registerSection}
          entering={FadeIn.delay(600).duration(600)}
        >
          <Text style={styles.registerText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </ReAnimated.View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
});
