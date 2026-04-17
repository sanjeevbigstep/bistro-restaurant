import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../utils/helper';
import { ROLES } from '../constants';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isStaff: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseJwt(token: string): { sub: string; email: string; role: string; name?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        setUser({ id: payload.sub, email: payload.email, role: payload.role, name: payload.name ?? payload.email });
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ accessToken: string; refreshToken: string }>('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    const payload = parseJwt(data.accessToken);
    if (payload) {
      setUser({ id: payload.sub, email: payload.email, role: payload.role, name: payload.name ?? payload.email });
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await api.post<{ accessToken: string; refreshToken: string }>('/auth/register', { name, email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    const payload = parseJwt(data.accessToken);
    if (payload) {
      setUser({ id: payload.sub, email: payload.email, role: payload.role, name: payload.name ?? name });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  const isAdmin = useCallback(() => user?.role === ROLES.ADMIN, [user]);
  const isStaff = useCallback(() => user?.role === ROLES.STAFF || user?.role === ROLES.ADMIN, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
