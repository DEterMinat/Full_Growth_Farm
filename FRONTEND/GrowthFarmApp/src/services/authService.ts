import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../config/apiConfig';

const API_BASE_URL = apiConfig.BASE_URL;

export interface User {
  id: number | string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: string;
  created_at?: string;
  is_guest?: boolean;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
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
      const errorData = await response.json().catch(() => ({
        error: { message: 'An unexpected network error occurred.' }
      }));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
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
        // Transform user data before storing
        const transformedUser = {
          ...response.user,
          fullName: response.user.firstName && response.user.lastName 
            ? `${response.user.firstName} ${response.user.lastName}`.trim()
            : response.user.firstName || response.user.lastName || '',
          phone: response.user.phoneNumber || '',
          role: response.user.role || 'USER'
        };
        await AsyncStorage.setItem('user', JSON.stringify(transformedUser));
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
          login: credentials.username,
          password: credentials.password
        }),
      });

      // Store token
      if (response.token) {
        await AsyncStorage.setItem('access_token', response.token);
      }
      
      if (response.user) {
        // Transform user data before storing
        const transformedUser = {
          ...response.user,
          fullName: response.user.firstName && response.user.lastName 
            ? `${response.user.firstName} ${response.user.lastName}`.trim()
            : response.user.firstName || response.user.lastName || '',
          phone: response.user.phoneNumber || '',
          role: response.user.role || 'USER'
        };
        await AsyncStorage.setItem('user', JSON.stringify(transformedUser));
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
      await this.makeRequest('/api/auth/logout', {
        method: 'POST',
      });
      console.log('✅ Server logout endpoint called successfully.');
    
    } catch (error) {
      console.error('❌ Server logout failed, but proceeding with local cleanup:', error);
    
    } finally {
      console.log('🧹 Clearing local storage');
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');
      console.log('✅ Local storage cleared');
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.makeRequest('/api/auth/me');
      const user = response.user;
      
      // Transform API response to match our User interface
      return {
        ...user,
        fullName: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`.trim()
          : user.firstName || user.lastName || '',
        phone: user.phoneNumber || '',
        role: user.role || 'USER',
        created_at: user.created_at || user.createdAt
      };
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

  async updateProfile(userData: {
    username?: string;
    email?: string;
    fullName?: string;
    phone?: string;
  }): Promise<AuthResponse> {
    try {
      // Convert fullName to firstName and lastName
      const nameParts = userData.fullName?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const requestData = {
        username: userData.username,
        email: userData.email,
        firstName,
        lastName,
        phoneNumber: userData.phone,
      };

      const response = await this.makeRequest('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(requestData),
      });

      // Update stored user data if successful
      if (response.success && response.user) {
        const transformedUser = {
          ...response.user,
          fullName: response.user.firstName && response.user.lastName 
            ? `${response.user.firstName} ${response.user.lastName}`.trim()
            : response.user.firstName || response.user.lastName || '',
          phone: response.user.phoneNumber || '',
          role: response.user.role || 'USER'
        };
        await AsyncStorage.setItem('user', JSON.stringify(transformedUser));
        // Update the response with transformed user
        response.user = transformedUser;
      }

      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
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
