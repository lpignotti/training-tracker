import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user from sessionStorage on app start
  useEffect(() => {
    try {
      // Clean up any old localStorage data (migration from localStorage to sessionStorage)
      if (localStorage.getItem('auth_user')) {
        localStorage.removeItem('auth_user');
      }
      
      const savedUser = sessionStorage.getItem('auth_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser) as User;
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading saved user:', error);
      sessionStorage.removeItem('auth_user');
    }
    setIsInitialized(true);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Persist user data to sessionStorage
    sessionStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Remove user data from sessionStorage
    sessionStorage.removeItem('auth_user');
  };

  const isTrainer = (): boolean => {
    return user?.isTrainer || false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && isInitialized,
    login,
    logout,
    isTrainer
  };

  // Don't render children until auth state is initialized
  if (!isInitialized) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
