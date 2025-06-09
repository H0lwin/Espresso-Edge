
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useToast } from "@/hooks/use-toast";

// Define User and Token types for JWT
interface User {
  id: string;
  name?: string; // Name can be derived from username or separate fields
  email: string;
  avatarUrl?: string;
  username?: string; // If your backend /users/me/ provides it
}

interface AuthTokensResponse {
  access: string;
  refresh?: string;
}

interface AuthContextType {
  user: User | null | undefined; // undefined for initial loading state
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ANONYMOUS_CART_ID_STORAGE_KEY = 'espressoEdgeAnonymousCartId'; // Consistent with CartContext

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // For redirect after login
  const { toast } = useToast();

  const fetchUserDetails = async (token: string) => {
    try {
      // Adjust endpoint if your /users/me/ is different (e.g., djoser default)
      const currentUser = await apiClient<User>('/api/auth/users/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(currentUser);
      localStorage.setItem('authUser', JSON.stringify(currentUser)); // Persist user for faster load
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      // If user details can't be fetched with a token, it might be invalid/expired
      logout(); // Log out to clear inconsistent state
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('authUser');

      if (accessToken) {
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          // Optionally re-validate token or refresh user details in the background
          // For now, we assume if token exists, and we have stored user, it's good enough for initial paint
          // For higher security, always call fetchUserDetails or a token verification endpoint
          fetchUserDetails(accessToken).catch(() => {/* error handled in fetchUserDetails */});
        } else {
          // If no stored user but token exists, fetch user details
          await fetchUserDetails(accessToken);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array: run once on mount

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Assuming /api/auth/jwt/create/ for djangorestframework-simplejwt
      const response = await apiClient<AuthTokensResponse>('/api/auth/jwt/create/', {
        method: 'POST',
        body: { email, password }, // Django SimpleJWT uses email or username based on config
        skipAuth: true,
      });

      localStorage.setItem('accessToken', response.access);
      if (response.refresh) {
        localStorage.setItem('refreshToken', response.refresh);
      }

      await fetchUserDetails(response.access); // Fetch and set user details

      toast({
        title: "ورود موفق",
        description: "خوش آمدید!",
      });

      const redirectPath = searchParams.get('redirect') || '/';
      router.push(redirectPath);
      router.refresh(); // To ensure server components re-render with auth state
      return true;
    } catch (error: any) {
      setUser(null);
      toast({
        title: "خطا در ورود",
        description: error.message || "ایمیل یا رمز عبور نامعتبر است.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Assuming /api/auth/users/ for djoser or similar registration endpoint
      await apiClient<{ id?: string; email?: string; username?: string }>('/api/auth/users/', {
        method: 'POST',
        // Backend might expect 'username'. If so, it could be same as email or derived.
        // Adjust 'name' if backend expects 'first_name'/'last_name'.
        body: { email, password, username: email, name: name },
        skipAuth: true,
      });

      toast({
        title: "ثبت نام موفق",
        description: "حساب کاربری شما ایجاد شد. لطفاً وارد شوید.",
      });
      router.push('/auth/login?registrationSuccess=true'); // Redirect to login after registration
      router.refresh();
      return true;
    } catch (error: any) {
      toast({
        title: "خطا در ثبت نام",
        description: error.message || "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true); // Prevent UI flicker by setting loading true during logout
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY); // Clear anonymous cart ID on logout

    // Optional: Call a backend endpoint to blacklist the refresh token if your setup supports it
    // const currentRefreshToken = localStorage.getItem('refreshToken');
    // if (currentRefreshToken) {
    //   apiClient('/api/auth/jwt/logout/', { // Or similar endpoint
    //     method: 'POST',
    //     body: { refresh: currentRefreshToken },
    //   }).catch(err => console.error("JWT Logout API call failed:", err));
    // }

    if (pathname.startsWith('/checkout') || pathname.startsWith('/profile') || pathname.startsWith('/cart')) { // Added /cart
        router.push('/auth/login');
    } else {
        router.push('/');
    }
    setIsLoading(false);
    router.refresh();
  };

  const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Assuming /api/auth/users/reset_password/ for djoser
      await apiClient('/api/auth/users/reset_password/', {
        method: 'POST',
        body: { email },
        skipAuth: true,
      });
      toast({
        title: "ایمیل ارسال شد",
        description: "اگر حساب کاربری با این ایمیل وجود داشته باشد، دستورالعمل‌های بازیابی رمز عبور ارسال خواهد شد.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "مشکلی در ارسال ایمیل بازیابی پیش آمد.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
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
