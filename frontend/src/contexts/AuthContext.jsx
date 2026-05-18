import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('agro_user');
        const storedToken = localStorage.getItem('agro_token');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          // Restore Supabase SDK Session client-side to align all context instances
          await supabase.auth.setSession({
            access_token: storedToken,
            refresh_token: ''
          });
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
    
    // Sync Supabase SDK client-side session immediately
    await supabase.auth.setSession({
      access_token: response.token,
      refresh_token: ''
    });

    setUser(response.user);
    return response;
  };

  const signUp = async (data) => {
    const response = await authAPI.register(data);
    if (response.token && response.token !== 'SESSION_PENDING') {
      localStorage.setItem('agro_user', JSON.stringify(response.user));
      localStorage.setItem('agro_token', response.token);
      
      // Sync Supabase SDK client-side session immediately
      await supabase.auth.setSession({
        access_token: response.token,
        refresh_token: ''
      });

      setUser(response.user);
    }
    return response;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn('Logout API call failed');
    }
    // Log out client-side Supabase instance too
    await supabase.auth.signOut();
    
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
        register: signUp,
        signUp,
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
