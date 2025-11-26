import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { MockService } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: (asRole: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hydrate from localStorage on mount (simulated)
  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem('novella_uid');
      if (storedUserId) {
        setIsLoading(true);
        MockService.getUser(storedUserId).then(u => {
          if (u) setUser(u);
          setIsLoading(false);
        });
      }
    } catch (e) {
      console.warn("LocalStorage access restricted:", e);
    }
  }, []);

  const login = async (role: UserRole) => {
    setIsLoading(true);
    // Simulate finding a user with that role
    // In a real app, this would be credentials based
    const id = role === UserRole.AUTHOR ? 'u1' : 'u2';
    const user = await MockService.getUser(id);
    if (user) {
      setUser(user);
      try {
        localStorage.setItem('novella_uid', user.id);
      } catch (e) {
        console.warn("LocalStorage access restricted:", e);
      }
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('novella_uid');
    } catch (e) {
      console.warn("LocalStorage access restricted:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};