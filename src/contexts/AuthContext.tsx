import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authAPI } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; role: 'farmer' | 'user'; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('agro_user');
        const storedToken = localStorage.getItem('agro_token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    localStorage.setItem('agro_user', JSON.stringify(response.user));
    localStorage.setItem('agro_token', response.token);
    setUser(response.user);
  };

  const register = async (data: { email: string; password: string; name: string; role: 'farmer' | 'user'; phone?: string }) => {
    const response = await authAPI.register(data);
    localStorage.setItem('agro_user', JSON.stringify(response.user));
    localStorage.setItem('agro_token', response.token);
    setUser(response.user);
  };

  const logout = async () => {
    await authAPI.logout();
    localStorage.removeItem('agro_user');
    localStorage.removeItem('agro_token');
    localStorage.removeItem('agro_cart');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('agro_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
