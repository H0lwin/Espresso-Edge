
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
<<<<<<< HEAD
}

interface AuthContextType {
  user: User | null | undefined; // Allow undefined for initial loading state
=======
  username?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null | undefined;
>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ANONYMOUS_CART_ID_STORAGE_KEY = 'espressoEdgeAnonymousCartId'; // For cleanup on logout

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined); // Initialize as undefined
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
<<<<<<< HEAD
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
=======
      const storedToken = localStorage.getItem('authToken');

      if (storedToken) {
        try {
          const currentUser = await apiClient<User>('/auth/user/', {
            headers: { Authorization: `Token ${storedToken}` }
          });
          setUser(currentUser);
          setToken(storedToken);
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem('authToken');
          localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY); // Clean up anonymous cart on auth failure
          setUser(null);
          setToken(null);
        }
>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)
      } else {
        setUser(null); // Set to null if no user found after check
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
<<<<<<< HEAD
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === "user@example.com" && password === "password123") {
      const loggedInUser: User = { id: "1", name: "کاربر نمونه", email, avatarUrl: `https://placehold.co/100x100.png?text=U` };
      setUser(loggedInUser);
      localStorage.setItem('authUser', JSON.stringify(loggedInUser));
      setIsLoading(false);

      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get('redirect') || '/';
      router.push(redirectPath);
=======
    try {
      const response = await apiClient<AuthResponse>('/auth/login/', {
        method: 'POST',
        body: { email, password },
      });

      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('authToken', response.token);

      const redirectPath = searchParams.get('redirect') || '/';
      router.push(redirectPath);
      router.refresh();
>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)
      return true;
    }
    setUser(null); // Ensure user is null on failed login attempt if it was undefined
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
<<<<<<< HEAD
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
=======
    try {
      const response = await apiClient<AuthResponse | { detail: string }>('/auth/register/', {
        method: 'POST',
        body: { name, email, password, username: email },
      });

      if ('token' in response && 'user' in response) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('authToken', response.token);
        // After successful registration and login, cart migration will be handled by CartContext's useEffect
        router.push('/');
      } else {
        router.push('/auth/login?registrationSuccess=true');
      }
      router.refresh();
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const currentToken = localStorage.getItem('authToken');
    if (currentToken) {
        try {
          await apiClient('/auth/logout/', {
            method: 'POST',
            headers: { Authorization: `Token ${currentToken}` }
          });
        } catch (error) {
          console.error("Logout API call failed:", error);
        }
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY); // Clear anonymous cart ID on logout
    // CartContext will see user is null and re-initialize for guest (or do nothing if no cart actions are taken)

>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)
    if (pathname.startsWith('/checkout') || pathname.startsWith('/profile')) {
        router.push('/auth/login');
    } else {
        router.push('/');
    }
<<<<<<< HEAD
=======
    setIsLoading(false);
    router.refresh();
>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)
  };

  const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
    setIsLoading(true);
<<<<<<< HEAD
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Password reset email sent to ${email} (simulated)`);
    setIsLoading(false);
    return true;
=======
    try {
      await apiClient('/auth/password/reset/', {
        method: 'POST',
        body: { email },
      });
      return true;
    } catch (error) {
      console.error("Password reset request failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)
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
