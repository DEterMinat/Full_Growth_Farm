import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../src/contexts/LanguageContext';

interface LanguageToggleButtonProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
  showText?: boolean;
}

export const LanguageToggleButton: React.FC<LanguageToggleButtonProps> = ({
  size = 'medium',
  style,
  showText = false,
}) => {
  const { t } = useTranslation();
  const { currentLanguage, toggleLanguage } = useLanguage();
  
  const [isPressed, setIsPressed] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 28, height: 28, fontSize: 10, paddingHorizontal: 6 };
      case 'large':
        return { width: 48, height: 48, fontSize: 16, paddingHorizontal: 12 };
      default:
        return { width: 36, height: 36, fontSize: 12, paddingHorizontal: 8 };
    }
  };

  const { width, height, fontSize, paddingHorizontal } = getSize();

  const handleToggle = async () => {
    await toggleLanguage();
  };

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Enhanced color scheme - Green theme compatible
  const getButtonColors = () => {
    return {
      background: isPressed 
        ? 'rgba(255, 255, 255, 0.9)' 
        : 'rgba(255, 255, 255, 0.15)',
      border: isPressed 
        ? 'rgba(255, 255, 255, 0.8)' 
        : 'rgba(255, 255, 255, 0.3)',
      shadowColor: isPressed 
        ? 'rgba(0, 0, 0, 0.2)' 
        : 'rgba(0, 0, 0, 0.1)',
      iconColor: isPressed 
        ? '#4CAF50' 
        : '#ffffff',
    };
  };

  const colors = getButtonColors();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.container,
          {
            width: showText ? 'auto' : width,
            height,
            backgroundColor: colors.background,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
            paddingHorizontal: showText ? paddingHorizontal + 4 : paddingHorizontal,
          },
          styles.enhancedShadow,
          style,
        ]}
        onPress={handleToggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          {showText && (
            <Text style={[styles.text, { color: colors.iconColor, fontSize }]}>
              {currentLanguage === 'th' ? t('language.thai') : t('language.english')}
            </Text>
          )}
          {!showText && (
            <Text style={[styles.languageCode, { color: colors.iconColor, fontSize: fontSize + 2 }]}>
              {currentLanguage.toUpperCase()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enhancedShadow: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWithText: {
    marginRight: 6,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  languageCode: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
