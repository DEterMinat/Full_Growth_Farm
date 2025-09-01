const API_BASE_URL = 'http://localhost:8000';

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
    return await response.json();
  }

  // Chat with AI
  async chatWithAI(message: string, conversationHistory?: ChatMessage[]): Promise<ChatResponse> {
    try {
      console.log('Sending chat request:', { message, conversationHistory });
      
      const response = await fetch(`${this.baseURL}/api/gemini/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_history: conversationHistory,
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
      const response = await fetch(`${this.baseURL}/api/gemini/weather-advice`, {
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
      const response = await fetch(`${this.baseURL}/api/gemini/crop-advice`, {
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
      const response = await fetch(`${this.baseURL}/api/gemini/sensor-analysis`, {
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
      
      const response = await fetch(`${this.baseURL}/api/gemini/quick-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_type: questionType,
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
      const response = await fetch(`${this.baseURL}/api/gemini/status`);

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
