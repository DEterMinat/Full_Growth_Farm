import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../config/apiConfig';

const API_BASE_URL = apiConfig.BASE_URL;

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Generic API client function
const apiClient = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from AsyncStorage
  const token = await AsyncStorage.getItem('userToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  if (token) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error(`API Error: ${response.status}`, data);
      throw new ApiError(
        data.message || data.detail || `HTTP ${response.status}`,
        response.status,
        data
      );
    }

    console.log(`API Success: ${response.status}`, data);
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    throw new ApiError(
      'Network error. Please check your internet connection.',
      0,
      error
    );
  }
};

export default apiClient;