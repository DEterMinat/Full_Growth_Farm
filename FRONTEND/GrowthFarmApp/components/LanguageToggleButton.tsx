import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../src/contexts/LanguageContext';
import { useThemeColor } from '../hooks/useThemeColor';

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
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  const [isPressed, setIsPressed] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32, iconSize: 16, fontSize: 12 };
      case 'large':
        return { width: 48, height: 48, iconSize: 28, fontSize: 18 };
      default:
        return { width: 40, height: 40, iconSize: 24, fontSize: 14 };
    }
  };

  const { width, height, iconSize, fontSize } = getSize();

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

  // Enhanced color scheme - White theme
  const getButtonColors = () => {
    const isTheme = currentLanguage === 'th';
    
    return {
      background: isPressed 
        ? '#f8f8f8' 
        : '#ffffff',
      border: isPressed 
        ? '#e0e0e0' 
        : '#f0f0f0',
      shadowColor: isPressed 
        ? '#d0d0d0' 
        : '#e8e8e8',
      iconColor: isPressed 
        ? '#666666' 
        : '#333333',
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
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
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
