const API_BASE_URL = 'http://119.59.102.61:30039';

export interface ChatMessage {
  id?: number;
  type: 'user' | 'bot';
  text: string;
  timestamp?: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  response: string;
  timestamp: string;
  conversation?: any;
  suggestions?: any;
  detectedDialect?: any;
  source?: string;
  note?: string;
}

class GeminiAPIClient {
  private baseURL: string;

  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Helper method to handle API errors
  private async handleResponse(response: Response): Promise<ChatResponse> {
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Transform the backend response to match our interface
    return {
      success: true,
      message: 'Response received',
      response: data.response || data.message || '',
      timestamp: new Date().toISOString(),
      conversation: data.conversation,
      suggestions: data.suggestions,
      detectedDialect: data.detectedDialect,
      source: data.source,
      note: data.note
    };
  }

  // Chat with AI
  async chatWithAI(message: string, conversationHistory?: ChatMessage[]): Promise<ChatResponse> {
    try {
      console.log('Sending chat request:', { message, conversationHistory });
      
      // Convert conversation history to context string
      const context = conversationHistory?.map(msg => 
        `${msg.type === 'user' ? 'User' : 'Bot'}: ${msg.text}`
      ).join('\n') || '';
      
      const response = await fetch(`${this.baseURL}/ai/demo/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: context || undefined,
        }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error chatting with AI:', error);
      throw error;
    }
  }

  // Get weather advice
  async getWeatherAdvice(weatherData: {
    temperature?: number;
    humidity?: number;
    rainfall?: number;
    wind_speed?: number;
    condition?: string;
  }): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseURL}/ai/weather-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weatherData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting weather advice:', error);
      throw error;
    }
  }

  // Get crop advice
  async getCropAdvice(cropType: string, growthStage?: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseURL}/ai/crop-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop_type: cropType,
          growth_stage: growthStage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting crop advice:', error);
      throw error;
    }
  }

  // Analyze sensor data
  async analyzeSensorData(sensorData: {
    soil_moisture?: number;
    ph_level?: number;
    light_intensity?: number;
    soil_temperature?: number;
  }): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseURL}/ai/sensor-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sensorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing sensor data:', error);
      throw error;
    }
  }

  // Quick question
  async askQuickQuestion(questionType: string): Promise<ChatResponse> {
    try {
      console.log('Sending quick question:', questionType);
      
      // Use the demo chat endpoint for quick questions as well
      const response = await fetch(`${this.baseURL}/ai/demo/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: questionType,
          context: 'quick_question'
        }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error asking quick question:', error);
      throw error;
    }
  }

  // Check AI status
  async getAIStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/ai/status`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting AI status:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const geminiAPI = new GeminiAPIClient();
export default geminiAPI;
