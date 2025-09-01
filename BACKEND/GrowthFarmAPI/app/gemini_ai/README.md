# Gemini AI Integration for Growth Farm

## 🤖 Overview

This module integrates Google Gemini AI into the Growth Farm backend to provide intelligent farming assistance through natural language processing.

## 📁 Structure

```
app/gemini_ai/
├── __init__.py          # Module initialization
├── service.py           # Gemini AI service logic
├── schemas.py           # Pydantic models for requests/responses
└── router.py            # FastAPI endpoints
```

## 🚀 API Endpoints

### Chat with AI
- **POST** `/api/gemini/chat`
- General conversation with farming AI assistant

### Weather Advice
- **POST** `/api/gemini/weather-advice`
- Get farming recommendations based on weather conditions

### Crop Advice
- **POST** `/api/gemini/crop-advice`
- Get specific advice for crop types and growth stages

### Sensor Analysis
- **POST** `/api/gemini/sensor-analysis`
- Analyze IoT sensor data and get recommendations

### Quick Questions
- **POST** `/api/gemini/quick-question`
- Fast responses to common farming questions

### Status Check
- **GET** `/api/gemini/status`
- Check AI service availability

## 🔧 Configuration

Add to your `.env` file:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📱 Frontend Integration

The frontend uses `geminiService.ts` to communicate with the AI backend:

```typescript
import { geminiAPI } from '@/src/services/geminiService';

// Chat with AI
const response = await geminiAPI.chatWithAI(message, conversationHistory);

// Quick questions
const answer = await geminiAPI.askQuickQuestion('สภาพอากาศวันนี้');
```

## 🌟 Features

- **Smart Farming Context**: AI is pre-trained with farming knowledge
- **Conversation Memory**: Maintains context across multiple messages
- **Multiple Analysis Types**: Weather, crops, sensors, quick questions
- **Thai Language Support**: Responds naturally in Thai
- **Error Handling**: Graceful fallbacks when AI is unavailable

## 🛠️ Dependencies

- `google-generativeai>=0.8.5`
- `fastapi`
- `pydantic`

## 📖 Usage Examples

### Chat Request
```json
{
  "message": "วิธีดูแลต้นมะม่วงให้ได้ผลดี",
  "conversation_history": [
    {
      "type": "user",
      "text": "สวัสดีครับ"
    },
    {
      "type": "bot", 
      "text": "สวัสดีครับ มีอะไรให้ช่วยเหลือไหม"
    }
  ]
}
```

### Weather Analysis Request
```json
{
  "temperature": 32,
  "humidity": 75,
  "rainfall": 0,
  "wind_speed": 5,
  "condition": "sunny"
}
```

### Response Format
```json
{
  "success": true,
  "message": "AI response generated successfully",
  "response": "ควรรดน้ำช่วงเช้าและเย็น เพราะอากาศร้อน...",
  "timestamp": "2025-08-01T13:30:00"
}
```

## 🔐 Security

- API key is stored securely in environment variables
- Input validation through Pydantic schemas
- Error handling prevents sensitive information leakage

## 🎯 AI Capabilities

The Gemini AI is specifically configured for:
- **Crop Management**: Planting, growing, harvesting advice
- **Weather Analysis**: Weather-based farming recommendations
- **IoT Data Interpretation**: Sensor reading analysis
- **Disease & Pest Control**: Problem identification and solutions
- **Market Insights**: Price trends and market advice
- **Equipment Guidance**: IoT device setup and troubleshooting

## 📊 Performance

- **Response Time**: Typically 1-3 seconds
- **Context Awareness**: Remembers last 5 messages
- **Language**: Optimized for Thai agricultural terminology
- **Availability**: 24/7 with fallback responses
