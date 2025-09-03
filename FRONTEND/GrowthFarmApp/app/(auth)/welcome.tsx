import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function WelcomeLayout() {
  const authContext = useAuth();
  
  // Check if loginAsGuest function exists
  const loginAsGuest = authContext?.loginAsGuest;
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.sequence([
      // Logo animation
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Fade and slide animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Button animation
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, logoScale, buttonScale]);

  const handleLogin = () => {
    // Navigate to login page
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('./login');
    });
  };

  const handleGuestDemo = async () => {
    // Navigate to dashboard as guest
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      try {
        console.log('🎭 Starting guest login from welcome...');
        
        if (typeof loginAsGuest !== 'function') {
          console.error('❌ loginAsGuest is not a function:', typeof loginAsGuest);
          throw new Error('Guest login function is not available');
        }
        
        await loginAsGuest();
        console.log('✅ Guest login successful, navigating to dashboard...');
        router.replace('/(app)/dashboard');
      } catch (error) {
        console.error('❌ Guest login error:', error);
        // Fallback to login page
        router.push('./login');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Logo Section with the Growth Farm logo */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }]
            }
          ]}
        >
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Main Title */}
        <Animated.Text 
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          GROWTH FARM
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text 
          style={[
            styles.subtitle,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          Your central hub for managing all farm{'\n'}activities efficiently and sustainably
        </Animated.Text>

        {/* Description */}
        <Animated.Text 
          style={[
            styles.description,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          Track crops, monitor soil conditions, and{'\n'}optimize your farm&apos;s productivity all in one{'\n'}place
        </Animated.Text>

        {/* Features List */}
        <Animated.View 
          style={[
            styles.featuresContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <MaterialIcons name="eco" size={32} color="#4CAF50" style={styles.featureEmoji} />
            </View>
            <Text style={styles.featureText}>Smart{'\n'}monitoring</Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <MaterialIcons name="analytics" size={32} color="#2196F3" style={styles.featureEmoji} />
            </View>
            <Text style={styles.featureText}>Yield{'\n'}optimization</Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <MaterialIcons name="wb-sunny" size={32} color="#FFB74D" style={styles.featureEmoji} />
            </View>
            <Text style={styles.featureText}>Weather{'\n'}integration</Text>
          </View>
        </Animated.View>

        {/* Login Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              width: '100%',
              transform: [{ scale: buttonScale }]
            }
          ]}
        >
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Guest Demo Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              width: '100%',
              transform: [{ scale: buttonScale }]
            }
          ]}
        >
          <TouchableOpacity style={styles.guestButton} onPress={handleGuestDemo}>
            <Text style={styles.guestButtonText}>Try as Guest (Demo)</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Info Text */}
        <Animated.View 
          style={[
            styles.infoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.infoText}>Choose Login for full access or Guest to explore features</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 60,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    flex: 1,
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 30,
    marginTop: 20,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureEmoji: {
    fontSize: 18,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  buttonContainer: {
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 15,
  },
  infoText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
});
