import { useTranslation } from 'react-i18next';
import { useLanguage } from '../src/contexts/LanguageContext';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  const { currentLanguage, toggleLanguage, isReady } = useLanguage();
  
  return {
    t,
    i18n,
    currentLanguage,
    toggleLanguage,
    isReady,
    // Helper function to get translated text with fallback
    getText: (key: string, fallback?: string) => {
      const translation = t(key);
      if (translation === key && fallback) {
        return fallback;
      }
      return translation;
    }
  };
};

export default useI18n;
