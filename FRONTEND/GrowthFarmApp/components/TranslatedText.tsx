import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTranslation } from 'react-i18next';

interface TranslatedTextProps extends TextProps {
  textKey: string;
  fallback?: string;
  values?: Record<string, any>;
  children?: never; // Prevent children to enforce using textKey
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  textKey,
  fallback,
  values,
  style,
  ...textProps
}) => {
  const { t } = useTranslation();
  
  const translatedText = t(textKey, values);
  const displayText = translatedText === textKey && fallback ? fallback : translatedText;
  
  return (
    <Text style={style} {...textProps}>
      {displayText}
    </Text>
  );
};

export default TranslatedText;
