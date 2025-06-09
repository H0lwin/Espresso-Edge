
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
  // refreshToken: () => Promise<void>; // For future implementation
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ANONYMOUS_CART_ID_STORAGE_KEY = 'espressoEdgeAnonymousCartId';

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
        body: { email, password }, // Or 'username' if your backend uses that
        skipAuth: true, // Don't send auth header for login itself
      });

      setAccessToken(response.access);
      localStorage.setItem('accessToken', response.access);
      if (response.refresh) {
        localStorage.setItem('refreshToken', response.refresh);
      }

      await fetchUserDetails(response.access); // Fetch user details after getting token

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
        body: { name, email, password, username: email }, // 'username' might be required
        skipAuth: true,
      });

      // Option 1: Redirect to login with a success message
      router.push('/auth/login?registrationSuccess=true');
      // Option 2: Automatically log the user in (less secure if tokens are just passed around)
      // If your backend registration returns tokens, you can call login logic here.

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
    // Optional: Call a backend endpoint to blacklist the refresh token if your setup supports it
    // const currentRefreshToken = localStorage.getItem('refreshToken');
    // if (currentRefreshToken) {
    // try {
    // await apiClient('/auth/jwt/logout/', { // Or similar endpoint
    // method: 'POST',
    // body: { refresh: currentRefreshToken },
    // });
    // } catch (error) {
    // console.error("JWT Logout API call failed:", error);
    // }
    // }

    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY);

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
        skipAuth: true,
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

  // Placeholder for token refresh logic (advanced)
  // const refreshToken = async () => { ... }

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
