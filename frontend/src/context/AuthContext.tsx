'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { apiFetch } from '@/utils/api';

interface User {
  id: string;
  username: string;
  email: string;
  role?: {
    admin: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>; 
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadUserFromToken = useCallback(async (accessToken: string) => {
    try {
      const decoded: { id: string } = jwtDecode(accessToken);
      // fetch fresh data from DB
      const userData = await apiFetch<{ user: User }>(`/user/${decoded.id}`);
      setUser(userData.user);
    } catch (error) {
      console.error("Failed to load user profile", error);

    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      loadUserFromToken(storedToken).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [loadUserFromToken]);

  const login = async (accessToken: string) => {
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    await loadUserFromToken(accessToken);
    router.push('/profile');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    if (token) {
      await loadUserFromToken(token);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}