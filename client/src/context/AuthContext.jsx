import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('flashads_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('flashads_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check and verify token on initial load
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('flashads_token');
      if (storedToken) {
        try {
          const { data } = await api.get('/auth/me');
          if (data?.success && data?.user) {
            setUser(data.user);
            localStorage.setItem('flashads_user', JSON.stringify(data.user));
          }
        } catch (error) {
          console.warn('Session expired or server unavailable, clearing local auth cache');
          // If server is not reachable, keep user state for offline/demo if available or clear
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data?.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('flashads_token', data.token);
        localStorage.setItem('flashads_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      if (data?.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('flashads_token', data.token);
        localStorage.setItem('flashads_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, message };
    }
  };

  // Demo Login (Simulated without live DB connection if needed)
  const demoLogin = (roleType) => {
    const demoAccounts = {
      client: {
        _id: 'demo-client-001',
        name: 'Rahul Kulkarni (Client Demo)',
        email: 'rahul.client@example.com',
        phone: '+91 98220 33333',
        role: 'client'
      },
      advertiser: {
        _id: 'demo-owner-001',
        name: 'Meena Deshmukh (Owner Demo)',
        email: 'meena.owner@example.com',
        phone: '+91 98220 22222',
        role: 'advertiser'
      },
      admin: {
        _id: 'demo-admin-001',
        name: 'FlashAds Super Admin',
        email: 'admin@flashads.in',
        phone: '+91 98220 11111',
        role: 'admin'
      }
    };

    const selectedUser = demoAccounts[roleType] || demoAccounts.client;
    const fakeToken = `demo_jwt_token_${roleType}_${Date.now()}`;
    
    setToken(fakeToken);
    setUser(selectedUser);
    localStorage.setItem('flashads_token', fakeToken);
    localStorage.setItem('flashads_user', JSON.stringify(selectedUser));
    return { success: true, user: selectedUser };
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('flashads_token');
    localStorage.removeItem('flashads_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    demoLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
