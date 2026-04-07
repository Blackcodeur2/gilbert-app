import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, getPublicUrl } from '../services/supabase';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) {
        setUser({ 
          id: userId, 
          email: email, 
          fullName: data.full_name, 
          phone: data.phone || '',
          avatarUrl: getPublicUrl('userprofilimage', data.avatar_url),
        });
      } else {
        setUser({ id: userId, email: email, fullName: '', phone: '', avatarUrl: '' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
       setUser({ id: userId, email: email, fullName: '', phone: '', avatarUrl: '' });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: 'Email ou mot de passe incorrect' };
    return { success: true };
  }, []);

  const register = useCallback(async (fullName: string, email: string, phone: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        }
      }
    });
    
    if (error) return { success: false, error: error.message };
    
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updateUser = useCallback(async (updates: Partial<AuthUser>) => {
    if (!user) return;
    
    setUser(prev => prev ? { ...prev, ...updates } : null);
    
    const profileUpdates: any = {};
    if (updates.fullName) profileUpdates.full_name = updates.fullName;
    if (updates.phone) profileUpdates.phone = updates.phone;
    if (updates.avatarUrl !== undefined) profileUpdates.avatar_url = updates.avatarUrl;
    
    if (Object.keys(profileUpdates).length > 0) {
      await supabase.from('profiles').update(profileUpdates).eq('id', user.id);
    }
  }, [user]);

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
