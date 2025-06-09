
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import apiClient, { setRefreshTokenFunction } from '@/lib/apiClient';
import { useToast } from "@/hooks/use-toast";

interface User {
  username: string;
  email: string;
  // id is not provided by the /api/auth/profile/ endpoint in the spec.
  // If your backend provides it (e.g., via a custom serializer), you can add it here.
}

interface AuthTokensResponse {
  access: string;
  refresh: string; // Refresh token is mandatory as per the new spec
}

interface RefreshTokenResponse {
  access: string;
}

interface RegisterResponse {
  message: string; // e.g., "User created"
}


interface AuthContextType {
  user: User | null | undefined; // undefined for initial loading state
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<boolean>; // Kept for completeness, though not in JWT spec
  refreshAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ANONYMOUS_CART_ID_STORAGE_KEY = 'espressoEdgeAnonymousCartId';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const fetchUserDetails = useCallback(async (token: string): Promise<User | null> => {
    try {
      const currentUser = await apiClient<User>('/api/auth/profile/', {
        headers: { Authorization: `Bearer ${token}` } // Ensure apiClient uses this specific token for this call
      });
      setUser(currentUser);
      localStorage.setItem('authUser', JSON.stringify(currentUser));
      return currentUser;
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      // Don't logout here directly, let the caller handle 401s by trying to refresh
      throw error; // Re-throw to be caught by caller
    }
  }, []);

  const refreshAuthToken = useCallback(async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log("No refresh token available for refreshAuthToken.");
      logout(); // No refresh token, so log out
      return null;
    }

    try {
      const response = await apiClient<RefreshTokenResponse>('/api/auth/refresh/', {
        method: 'POST',
        body: { refresh: refreshToken },
        skipAuth: true, // This request itself doesn't need an access token
      });
      localStorage.setItem('accessToken', response.access);
      console.log("Access token refreshed successfully.");
      return response.access;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout(); // If refresh fails, log out the user
      return null;
    }
  }, [toast, router, pathname]); // Added dependencies for logout

  // Expose refreshAuthToken to apiClient
  useEffect(() => {
    setRefreshTokenFunction(refreshAuthToken);
  }, [refreshAuthToken]);


  const logout = useCallback(() => { // Wrapped in useCallback
    setIsLoading(true);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY);

    // No need to call backend logout for JWT if it's stateless (tokens are just cleared client-side)
    // If your backend has a JWT blacklist mechanism, you might call an endpoint here.

    if (pathname.startsWith('/checkout') || pathname.startsWith('/profile') || pathname.startsWith('/cart')) {
        router.push('/auth/login');
    } else {
        // router.push('/'); // Optional: redirect to home on logout
    }
    setIsLoading(false);
    router.refresh();
  }, [pathname, router]); // Added dependencies


  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('authUser');

      if (accessToken) {
        try {
          // Prefer fetching fresh user details to validate token, rather than relying on storedUser
          await fetchUserDetails(accessToken);
        } catch (error: any) {
          // If fetching user details fails (e.g. 401 due to expired access token)
          console.log("Access token might be expired, trying to refresh...");
          const newAccessToken = await refreshAuthToken();
          if (newAccessToken) {
            try {
              await fetchUserDetails(newAccessToken); // Try fetching user details again with new token
            } catch (finalError) {
              console.error("Failed to fetch user details even after refresh:", finalError);
              logout(); // If still fails, logout
            }
          } else {
            // refreshAuthToken already handles logout if it can't refresh
          }
        }
      } else {
        setUser(null); // No access token, user is not logged in
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [fetchUserDetails, refreshAuthToken, logout]);


  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiClient<AuthTokensResponse>('/api/auth/login/', {
        method: 'POST',
        body: { username, password },
        skipAuth: true,
      });

      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);

      await fetchUserDetails(response.access);

      toast({
        title: "ورود موفق",
        description: "خوش آمدید!",
      });

      const redirectPath = searchParams.get('redirect') || '/';
      router.push(redirectPath);
      router.refresh();
      return true;
    } catch (error: any) {
      setUser(null);
      toast({
        title: "خطا در ورود",
        description: error.message || "نام کاربری یا رمز عبور نامعتبر است.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await apiClient<RegisterResponse>('/api/auth/register/', {
        method: 'POST',
        body: { username, email, password },
        skipAuth: true,
      });

      toast({
        title: "ثبت نام موفق",
        description: "حساب کاربری شما ایجاد شد. لطفاً وارد شوید.",
      });
      router.push('/auth/login?registrationSuccess=true');
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

  // Kept sendPasswordResetEmail for completeness, though not part of the strict JWT spec provided.
  // Ensure your backend supports this if you intend to use it.
  const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await apiClient('/api/auth/users/reset_password/', { // This endpoint is from djoser, adjust if different
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
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, sendPasswordResetEmail, refreshAuthToken }}>
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
