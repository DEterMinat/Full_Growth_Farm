import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
  currentLanguage: string;
  toggleLanguage: () => Promise<void>;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('th');
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('user-language');
      const lang = savedLanguage || 'th'; // Default to Thai
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
    } catch (error) {
      console.error('Error loading saved language:', error);
      await i18n.changeLanguage('th');
      setCurrentLanguage('th');
    } finally {
      setIsReady(true);
    }
  };

  const toggleLanguage = async () => {
    try {
      const newLanguage = currentLanguage === 'th' ? 'en' : 'th';
      await i18n.changeLanguage(newLanguage);
      await AsyncStorage.setItem('user-language', newLanguage);
      setCurrentLanguage(newLanguage);
    } catch (error) {
      console.error('Error toggling language:', error);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    toggleLanguage,
    isReady,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
