import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hms_token'));
  const [role, setRole] = useState(localStorage.getItem('hms_role'));
  const [loading, setLoading] = useState(true);

  const saveSession = useCallback((newToken, newRole, newUser) => {
    localStorage.setItem('hms_token', newToken);
    localStorage.setItem('hms_role', newRole);
    setToken(newToken);
    setRole(newRole);
    setUser(newUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_role');
    setToken(null);
    setRole(null);
    setUser(null);
  }, []);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Token is verified on each API call via interceptor
        setLoading(false);
      } catch {
        clearSession();
        setLoading(false);
      }
    };
    verifyToken();
  }, [token, clearSession]);

  const login = useCallback(async (endpoint, credentials) => {
    const response = await api.post(`/api/auth/${endpoint}`, credentials);
    const { token: newToken, ...userData } = response.data;

    let userRole;
    if (endpoint.includes('patient')) userRole = 'patient';
    else if (endpoint.includes('doctor')) userRole = 'doctor';
    else if (endpoint.includes('admin')) userRole = 'admin';

    const userObj = userData[userRole] || userData.patient;
    saveSession(newToken, userRole, userObj);
    return userObj;
  }, [saveSession]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = { user, token, role, loading, login, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

