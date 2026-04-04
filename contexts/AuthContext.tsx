import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'gilbertpro_auth_user';

// Mock credentials
const MOCK_USERS: Array<{ email: string; password: string; fullName: string; phone: string }> = [
  { email: 'test@example.com', password: '123456', fullName: 'Marie Kouassi', phone: '+225 07 12 34 56 78' },
  { email: 'admin@gilbertpro.ci', password: 'admin123', fullName: 'Gilbert Admin', phone: '+225 07 07 07 07 07' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(AUTH_KEY);
        if (saved) setUser(JSON.parse(saved));
      } catch {} finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (user) {
      AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      AsyncStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(res => setTimeout(res, 800));
    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      const authUser: AuthUser = {
        id: `user-${Date.now()}`,
        email: found.email,
        fullName: found.fullName,
        phone: found.phone,
      };
      setUser(authUser);
      return { success: true };
    }
    // Allow any registration to work as login with mock
    const registered = await AsyncStorage.getItem('gilbertpro_registered_users');
    if (registered) {
      const users = JSON.parse(registered) as typeof MOCK_USERS;
      const found2 = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (found2) {
        const authUser: AuthUser = {
          id: `user-${Date.now()}`,
          email: found2.email,
          fullName: found2.fullName,
          phone: found2.phone,
        };
        setUser(authUser);
        return { success: true };
      }
    }
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }, []);

  const register = useCallback(async (fullName: string, email: string, phone: string, password: string) => {
    await new Promise(res => setTimeout(res, 1000));
    // Check duplicate
    const allMock = [...MOCK_USERS];
    const registered = await AsyncStorage.getItem('gilbertpro_registered_users');
    if (registered) {
      allMock.push(...JSON.parse(registered));
    }
    if (allMock.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Cet email est déjà utilisé' };
    }
    // Save new user
    const newUsers = registered ? JSON.parse(registered) : [];
    newUsers.push({ email, password, fullName, phone });
    await AsyncStorage.setItem('gilbertpro_registered_users', JSON.stringify(newUsers));
    const authUser: AuthUser = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      phone,
    };
    setUser(authUser);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  }), [user, isLoading, login, register, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
