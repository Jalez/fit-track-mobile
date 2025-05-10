import React, { createContext, useState, useContext } from 'react';

type AuthContextType = {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    // Mock authentication
    console.log('Login attempt with:', email, password);
    
    // Simulate successful login after delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Set user and authentication state
    setUser({ id: '1', email, name: 'Demo User' });
    setIsAuthenticated(true);
  };

  const register = async (email: string, password: string, name: string) => {
    // Mock registration
    console.log('Register attempt with:', email, password, name);
    
    // Simulate successful registration after delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Set user and authentication state
    setUser({ id: '1', email, name });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
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