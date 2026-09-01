'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService, type AuthResponse } from '@/lib/services/auth.service';
import { setAuthToken } from '@/lib/services/api-client';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    company?: string;
    accountType: 'buyer' | 'supplier';
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setAuthToken(token);
      authService.getMe()
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem('auth_token');
          setAuthToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    localStorage.setItem('auth_token', result.token);
    setUser(result.user);
  }, []);

  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    company?: string;
    accountType: 'buyer' | 'supplier';
  }) => {
    const result = await authService.register(data);
    localStorage.setItem('auth_token', result.token);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    localStorage.removeItem('auth_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
