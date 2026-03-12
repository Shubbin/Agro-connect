import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';



const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    localStorage.setItem('agro_user', JSON.stringify(response.user));
    localStorage.setItem('agro_token', response.token);
    setUser(response.user);
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    localStorage.setItem('agro_user', JSON.stringify(response.user));
    localStorage.setItem('agro_token', response.token);
    setUser(response.user);
  };

  const signUp = async (data) => {
    await authAPI.register(data);
  };

  const logout = async () => {
    await authAPI.logout();
    localStorage.removeItem('agro_user');
    localStorage.removeItem('agro_token');
    localStorage.removeItem('agro_cart');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
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
