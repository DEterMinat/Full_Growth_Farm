import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '../services/authService';

// Interface ไม่มีการเปลี่ยนแปลง
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isGuest: boolean;
  loginAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- ✨ [จุดแก้ไขหลัก] ---
  // 1. ลบการประกาศ state ที่ซ้ำซ้อนออก
  // 2. ให้ isAuthenticated และ isGuest เป็นค่าที่คำนวณจาก state 'user' โดยตรง
  const isAuthenticated = !!user;
  const isGuest = !!user && user.is_guest === true;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // ไม่ได้ตั้งค่า isLoading ที่นี่แล้ว เพื่อให้ค่าเริ่มต้นเป็น true
    try {
      const token = await authService.getToken();
      if (token) {
        const userData = await authService.getProfile();
        setUser(userData); // getProfile จะ return user object โดยตรงแล้ว
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed, clearing session:', error);
      setUser(null);
      await authService.logout(); // เคลียร์ token ที่อาจหมดอายุ
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    await authService.login({ username, password });
    await checkAuthStatus();
  };

  const register = async (userData: any) => {
    await authService.register(userData);
    await checkAuthStatus();
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    // การ Redirect จะถูกจัดการโดย _layout.tsx
  };

  const loginAsGuest = async () => {
    const guestUser: User = {
      id: 'guest',
      username: 'Guest User',
      email: 'guest@growthfarm.com',
      fullName: 'Demo User',
      role: 'GUEST',
      is_guest: true,
    };
    setUser(guestUser);
  };

  const refreshUser = async () => {
    await checkAuthStatus();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isGuest,
    login,
    register,
    logout,
    refreshUser,
    loginAsGuest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};