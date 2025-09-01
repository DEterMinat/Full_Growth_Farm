import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { ChatMessage, ChatResponse } from '../../src/services/geminiService';

interface VoiceAIModalProps {
  visible: boolean;
  onClose: () => void;
}

const VoiceAIModal: React.FC<VoiceAIModalProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    if (visible) {
      // Add welcome message when modal opens
      if (messages.length === 0) {
        setMessages([
          {
            id: 1,
            type: 'bot',
            text: 'สวัสดีครับ! ผมเป็น AI ผู้ช่วยเกษตรกรของคุณ 🌱 มีอะไรให้ช่วยเหลือไหมครับ?',
            timestamp: new Date().toISOString(),
          }
        ]);
      }
      
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, messages.length, fadeAnim, scaleAnim]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message to chat
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    // Auto scroll to bottom after adding user message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      console.log('Sending message to Gemini API:', userMessage.text);
      
      const response = await fetch(`${API_BASE_URL}/api/gemini/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversation_history: newMessages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data: ChatResponse = await response.json();
      console.log('Received response from API:', data);

      if (data.success && data.response) {
        const botMessage: ChatMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: data.response,
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.message || 'ไม่ได้รับการตอบกลับจาก AI');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: `ขออภัยครับ เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'ไม่สามารถเชื่อมต่อกับ AI ได้'}`,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    Alert.alert(
      'ล้างการสนทนา',
      'คุณต้องการล้างข้อความทั้งหมดใช่ไหม?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ล้าง',
          style: 'destructive',
          onPress: () => {
            setMessages([
              {
                id: 1,
                type: 'bot',
                text: 'สวัสดีครับ! ผมเป็น AI ผู้ช่วยเกษตรกรของคุณ 🌱 มีอะไรให้ช่วยเหลือไหมครับ?',
                timestamp: new Date().toISOString(),
              }
            ]);
          }
        }
      ]
    );
  };

  const renderMessage = (message: ChatMessage, index: number) => (
    <View
      key={message.id || index}
      style={[
        styles.messageContainer,
        message.type === 'user' ? styles.userMessage : styles.botMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.type === 'user' ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.type === 'user' ? styles.userText : styles.botText,
          ]}
        >
          {message.text}
        </Text>
        {message.timestamp && (
          <Text style={styles.timestampText}>
            {new Date(message.timestamp).toLocaleTimeString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.aiIcon}>🤖</Text>
                <View>
                  <Text style={styles.headerTitle}>AI เกษตรกร</Text>
                  <Text style={styles.headerSubtitle}>Powered by Gemini</Text>
                </View>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearChat}
                >
                  <Text style={styles.clearButtonText}>🗑️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((message, index) => renderMessage(message, index))}
              
              {isLoading && (
                <View style={[styles.messageContainer, styles.botMessage]}>
                  <View style={[styles.messageBubble, styles.botBubble]}>
                    <ActivityIndicator size="small" color="#4CAF50" />
                    <Text style={styles.loadingText}>AI กำลังพิมพ์...</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="พิมพ์ข้อความแล้วกด Enter..."
                placeholderTextColor="#999"
                multiline={false}
                maxLength={1000}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
                enablesReturnKeyAutomatically={true}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isLoading}
              >
                <Text style={styles.sendButtonText}>
                  {isLoading ? '⏳' : '📤'}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    padding: 8,
    marginRight: 5,
  },
  clearButtonText: {
    fontSize: 18,
    color: 'white',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 5,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#333',
  },
  timestampText: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  loadingText: {
    color: '#4CAF50',
    fontStyle: 'italic',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    fontSize: 18,
  },
});

export default VoiceAIModal;
