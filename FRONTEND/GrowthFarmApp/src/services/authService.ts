import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../config/apiConfig';

const API_BASE_URL = apiConfig.BASE_URL;

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: string;
  created_at?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

class AuthService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add token to headers if available
    const token = await this.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      // Store token
      if (response.token) {
        await AsyncStorage.setItem('access_token', response.token);
      }
      if (response.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      // Store token
      if (response.token) {
        await AsyncStorage.setItem('access_token', response.token);
      }
      if (response.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    console.log('🔐 AuthService logout started');
    try {
      const token = await this.getToken();
      console.log('🎫 Current token:', token ? 'exists' : 'not found');
      
      if (token) {
        // Try normal logout with token validation
        try {
          console.log('📡 Calling /api/auth/logout');
          await this.makeRequest('/api/auth/logout', {
            method: 'POST',
          });
          console.log('✅ Normal logout successful');
        } catch (error: any) {
          console.log('⚠️ Normal logout failed:', error.message);
          // If token is invalid/expired, use force logout
          if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            console.log('📡 Calling /api/auth/logout-force');
            await fetch(`${API_BASE_URL}/api/auth/logout-force`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log('✅ Force logout successful');
          } else {
            throw error;
          }
        }
      } else {
        // No token, use force logout
        console.log('📡 No token, calling /api/auth/logout-force');
        await fetch(`${API_BASE_URL}/api/auth/logout-force`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('✅ Force logout successful');
      }
    } catch (error) {
      console.error('❌ Logout API error:', error);
      // Continue with local cleanup even if server logout fails
    } finally {
      // Always clear local storage regardless of API call result
      console.log('🧹 Clearing local storage');
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');
      console.log('✅ Local storage cleared');
    }
  }

  async getProfile(): Promise<User> {
    try {
      return await this.makeRequest('/api/auth/me');
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) return false;

      // Verify token with backend
      await this.getProfile();
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token is invalid, clear storage
      await this.clearLocalStorage();
      return false;
    }
  }

  private async clearLocalStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Clear storage error:', error);
    }
  }
}

export default new AuthService();
