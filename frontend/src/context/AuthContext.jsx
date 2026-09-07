/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      localStorage.removeItem('expense_user');
    } catch {
      // Ignore storage errors
    }
    const saved = sessionStorage.getItem('expense_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((userData) => {
    sessionStorage.setItem('expense_user', JSON.stringify(userData));
    try {
      localStorage.removeItem('expense_user');
    } catch {
      // Ignore storage errors
    }
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('expense_user');
    try {
      localStorage.removeItem('expense_user');
    } catch {
      // Ignore storage errors
    }
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user && user.token),
    login,
    logout
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
