
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // For redirection

// Define User type
interface User {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null | undefined; // Allow undefined for initial loading state
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined); // Initialize as undefined
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null); // Set to null if no user found after check
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === "user@example.com" && password === "password123") {
      const loggedInUser: User = { id: "1", name: "کاربر نمونه", email, avatarUrl: `https://placehold.co/100x100.png?text=U` };
      setUser(loggedInUser);
      localStorage.setItem('authUser', JSON.stringify(loggedInUser));
      setIsLoading(false);

      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get('redirect') || '/';
      router.push(redirectPath);
      return true;
    }
    setUser(null); // Ensure user is null on failed login attempt if it was undefined
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = { id: String(Date.now()), name, email, avatarUrl: `https://placehold.co/100x100.png?text=${name.charAt(0) || 'N'}` };
    setUser(newUser);
    localStorage.setItem('authUser', JSON.stringify(newUser));
    setIsLoading(false);
    router.push('/');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    if (pathname.startsWith('/checkout') || pathname.startsWith('/profile')) {
        router.push('/auth/login');
    } else {
        router.push('/');
    }
  };

  const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Password reset email sent to ${email} (simulated)`);
    setIsLoading(false);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, sendPasswordResetEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
