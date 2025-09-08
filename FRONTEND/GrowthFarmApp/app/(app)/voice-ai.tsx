import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { 
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInLeft,
  SlideInRight,
  ZoomIn
} from 'react-native-reanimated';
import { geminiAPI, ChatMessage } from '@/src/services/geminiService';
import { useTranslation } from 'react-i18next';
import { LanguageToggleButton } from '@/components/LanguageToggleButton';

export default function VoiceAIScreen() {
  const { t } = useTranslation();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'bot',
      text: t('voice_ai.greeting_message'),
      timestamp: '10:30 AM'
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const quickQuestions = [
    { id: 1, text: t('voice_ai.weather_today'), icon: 'wb-sunny' },
    { id: 2, text: t('voice_ai.latest_crop_prices'), icon: 'attach-money' },
    { id: 3, text: t('voice_ai.fruit_care'), icon: 'eco' },
    { id: 4, text: t('voice_ai.data_analysis'), icon: 'analytics' },
    { id: 5, text: t('voice_ai.task_notifications'), icon: 'notifications' },
  ];

  const addMessage = (text: string, type: 'user' | 'bot') => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      type,
      text,
      timestamp: new Date().toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleStartListening = async () => {
    if (isListening || isProcessing) return;
    
    setIsListening(true);
    
    // Simulate voice input (สามารถเพิ่ม speech recognition จริงได้ภายหลัง)
    setTimeout(async () => {
      setIsListening(false);
      setIsProcessing(true);
      
      // Add simulated user message
      const userMessage = t('voice_ai.weather_today') + '?';
      addMessage(userMessage, 'user');
      
      try {
        console.log('Sending voice message to AI:', userMessage);
        
        // Use Gemini AI for conversation
        const conversationHistory = messages.slice(-5); // Last 5 messages for context
        const response = await geminiAPI.chatWithAI(userMessage, conversationHistory);
        
        console.log('AI Response:', response); // Debug log
        
        if (response.success && response.response) {
          addMessage(response.response, 'bot');
        } else {
          console.log('API response not successful:', response);
          addMessage(t('voice_ai.processing_error'), 'bot');
        }
      } catch (error) {
        console.error('Error details:', error);
        // Fallback response
        addMessage(t('voice_ai.weather_fallback'), 'bot');
      } finally {
        setIsProcessing(false);
      }
    }, 3000);
  };

  const handleQuickQuestion = async (question: string) => {
    addMessage(question, 'user');
    
    setIsProcessing(true);
    try {
      console.log('Asking quick question:', question);
      
      // Use Gemini AI for quick questions
      const response = await geminiAPI.askQuickQuestion(question);
      
      console.log('Quick question response:', response); // Debug log
      
      if (response.success && response.response) {
        addMessage(response.response, 'bot');
      } else {
        console.log('Quick question API response not successful:', response);
        addMessage(t('voice_ai.answer_error'), 'bot');
      }
    } catch (error) {
      console.error('Quick question error details:', error);
      
      // Fallback to local responses if API fails
      let fallbackResponse = '';
      switch (question) {
        case t('voice_ai.weather_today'):
          fallbackResponse = t('voice_ai.weather_fallback');
          break;
        case t('voice_ai.latest_crop_prices'):
          fallbackResponse = t('voice_ai.prices_fallback');
          break;
        case t('voice_ai.fruit_care'):
          fallbackResponse = t('voice_ai.fruit_care_fallback');
          break;
        case t('voice_ai.data_analysis'):
          fallbackResponse = t('voice_ai.analysis_fallback');
          break;
        case t('voice_ai.task_notifications'):
          fallbackResponse = t('voice_ai.tasks_fallback');
          break;
        default:
          fallbackResponse = t('voice_ai.api_error');
      }
      
      addMessage(fallbackResponse, 'bot');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(600)}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('voice_ai.title')}</Text>
        <LanguageToggleButton />
      </Animated.View>

      {/* Conversation */}
      <ScrollView style={styles.conversation} showsVerticalScrollIndicator={false}>
        {messages.map((message, index) => (
          <Animated.View 
            key={message.id} 
            style={[
              styles.messageContainer,
              message.type === 'user' ? styles.userMessage : styles.botMessage
            ]}
            entering={message.type === 'user' ? 
              SlideInRight.delay(index * 100).duration(400) : 
              SlideInLeft.delay(index * 100).duration(400)
            }
          >
            <View style={[
              styles.messageContent,
              message.type === 'user' ? styles.userText : styles.botText
            ]}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
            <Text style={styles.timestamp}>{message.timestamp}</Text>
          </Animated.View>
        ))}
        
        {isProcessing && (
          <Animated.View 
            style={[styles.messageContainer, styles.botMessage]}
            entering={FadeIn.duration(400)}
          >
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>{t('voice_ai.thinking')}</Text>
              <View style={styles.typingDots}>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.dot}>•</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Quick Questions */}
      <Animated.View 
        style={styles.quickQuestionsSection}
        entering={FadeInUp.delay(800).duration(600)}
      >
        <Text style={styles.quickTitle}>{t('voice_ai.popular_questions')}</Text>
        <ScrollView 
          horizontal 
          style={styles.quickScroll}
          showsHorizontalScrollIndicator={false}
        >
          {quickQuestions.map((q, index) => (
            <Animated.View
              key={q.id}
              entering={FadeInUp.delay(1000 + index * 100).duration(400)}
            >
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => handleQuickQuestion(q.text)}
              >
                <MaterialIcons name={q.icon as any} size={20} color="#4CAF50" style={styles.quickIcon} />
                <Text style={styles.quickText}>{q.text}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Voice Input */}
      <Animated.View 
        style={styles.voiceSection}
        entering={ZoomIn.delay(1500).duration(800)}
      >
        <TouchableOpacity
          style={[
            styles.voiceButton,
            isListening && styles.voiceButtonActive
          ]}
          onPress={handleStartListening}
          disabled={isListening || isProcessing}
        >
          <MaterialIcons 
            name={isListening ? 'stop' : 'mic'} 
            size={32} 
            color="white" 
            style={styles.voiceButtonIcon} 
          />
        </TouchableOpacity>
        
        <Text style={styles.voiceStatus}>
          {isListening ? t('voice_ai.listening') : isProcessing ? t('voice_ai.processing') : t('voice_ai.tap_to_speak')}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  conversation: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageContent: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  botText: {
    backgroundColor: 'white',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
  },
  typingIndicator: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    fontSize: 20,
    color: '#4CAF50',
    marginHorizontal: 2,
  },
  quickQuestionsSection: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
    marginBottom: 10,
  },
  quickScroll: {
    paddingLeft: 15,
  },
  quickButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  quickText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  voiceSection: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  voiceButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  voiceButtonActive: {
    backgroundColor: '#FF4444',
    transform: [{ scale: 1.1 }],
  },
  voiceButtonIcon: {
    fontSize: 28,
  },
  voiceStatus: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});
