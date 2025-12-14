import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiCall } from '../supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  isAdmin: boolean;
  registeredAt: string;
  profile: {
    collectorSince?: string;
    location?: string;
    bio?: string;
    specialization?: string;
    isDiscoverable?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, membershipTier: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await apiCall('/auth/session', {}, token);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setAccessToken(token);
        } else {
          // Invalid token, clear it
          localStorage.removeItem('accessToken');
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setUser(data.user);
      setAccessToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (name: string, email: string, password: string, membershipTier: string) => {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, membershipTier }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await apiCall('/auth/logout', {
          method: 'POST',
        }, accessToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
    }
  };

  const refreshUser = async () => {
    if (accessToken) {
      try {
        const response = await apiCall('/auth/session', {}, accessToken);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Refresh user error:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, register, logout, refreshUser }}>
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