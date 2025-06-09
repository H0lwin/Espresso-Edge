
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MenuItem } from '@/app/menu/page'; // MenuItem now has price: number
import { useAuth } from './AuthContext';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

export interface CartItem extends MenuItem { // price is now number
  quantity: number;
}

interface AnonymousCartAPIResponse {
  uuid: string;
  items: CartItem[]; // Assuming API returns items matching CartItem structure (price as number)
}


interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  addItemToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  removeItemFromCart: (itemId: string | number) => Promise<void>;
  updateItemQuantity: (itemId: string | number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getCartTotal: () => string;
  getTotalNumeric: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const ANONYMOUS_CART_ID_STORAGE_KEY = 'espressoEdgeAnonymousCartId';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [anonymousCartId, setAnonymousCartId] = useState<string | null>(null);
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  const checkOrCreateAnonymousCart = useCallback(async (): Promise<string | null> => {
    if (anonymousCartId) return anonymousCartId;

    let storedId = localStorage.getItem(ANONYMOUS_CART_ID_STORAGE_KEY);
    if (storedId) {
      setAnonymousCartId(storedId);
      return storedId;
    }

    setIsLoading(true);
    try {
      const response = await apiClient<AnonymousCartAPIResponse>('/api/anonymous-cart/create/', { method: 'POST', skipAuth: true });
      if (response && response.uuid) {
        localStorage.setItem(ANONYMOUS_CART_ID_STORAGE_KEY, response.uuid);
        setAnonymousCartId(response.uuid);
        setCartItems(response.items || []);
        setIsLoading(false);
        return response.uuid;
      }
      throw new Error("Failed to create anonymous cart: No UUID received.");
    } catch (error: any) {
      console.error("Failed to create anonymous cart:", error);
      toast({ title: "خطا", description: error.message || "خطا در ایجاد سبد خرید مهمان.", variant: "destructive" });
      setIsLoading(false);
      return null;
    }
  }, [anonymousCartId, toast]);

  const fetchAnonymousCartItems = useCallback(async (cartId: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient<AnonymousCartAPIResponse>(`/api/anonymous-cart/${cartId}/`, { skipAuth: true });
      setCartItems(response.items || []);
    } catch (error: any) {
      console.error("Failed to fetch anonymous cart items:", error);
      if (error.message && (error.message.includes("404") || error.message.toLowerCase().includes("not found"))) {
        localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY);
        setAnonymousCartId(null);
        // Don't automatically create a new one here, let actions trigger it or first load.
        setCartItems([]); // Clear items if cart was not found
      } else {
        toast({ title: "خطا", description: error.message || "خطا در دریافت سبد خرید مهمان.", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const syncUserCartWithBackend = useCallback(async () => {
    if (!user || !token) return;
    setIsLoading(true);
    try {
      const backendCart = await apiClient<CartItem[]>('/api/cart/'); // Assumes this endpoint returns CartItem[]
      setCartItems(backendCart || []);
    } catch (error: any) {
      console.error("Failed to sync user cart with backend:", error);
      toast({ title: "خطا", description: error.message || "خطا در همگام‌سازی سبد خرید شما.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [user, token, toast]);


  const handleUserLogin = useCallback(async () => {
    if (!user || !token) return;
    setIsLoading(true);
    const guestCartId = localStorage.getItem(ANONYMOUS_CART_ID_STORAGE_KEY);

    if (guestCartId) {
      try {
        // Check if anonymous cart has items before attempting migration
        const guestCart = await apiClient<AnonymousCartAPIResponse>(`/api/anonymous-cart/${guestCartId}/`, { skipAuth: true });
        if (guestCart && guestCart.items && guestCart.items.length > 0) {
            await apiClient('/api/cart/migrate-anonymous/', {
            method: 'POST',
            body: { anonymous_cart_id: guestCartId },
            });
            toast({ title: "انتقال سبد خرید", description: "اقلام سبد خرید مهمان شما به حساب کاربری‌تان منتقل شد." });
        }
      } catch (error: any)
      {
        // Handle cases where guest cart might not exist on backend anymore, or other migration errors
        if (error.message && (error.message.includes("404") || error.message.toLowerCase().includes("not found"))) {
            console.warn("Guest cart for migration not found on backend, proceeding without migration.");
        } else {
            console.error("Failed to migrate anonymous cart:", error);
            toast({ title: "خطا در انتقال", description: error.message || "خطا در انتقال سبد خرید مهمان.", variant: "destructive" });
        }
      } finally {
        localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY);
        setAnonymousCartId(null);
      }
    }
    await syncUserCartWithBackend();
    setIsLoading(false);
  }, [user, token, syncUserCartWithBackend, toast]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (user && token) {
        handleUserLogin();
      } else {
        const storedAnonId = localStorage.getItem(ANONYMOUS_CART_ID_STORAGE_KEY);
        if (storedAnonId) {
          setAnonymousCartId(storedAnonId);
          fetchAnonymousCartItems(storedAnonId);
        } else {
          setCartItems([]);
        }
      }
    }
  }, [user, token, isAuthLoading, handleUserLogin, fetchAnonymousCartItems]);


  const addItemToCart = async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setIsLoading(true);
    const quantityToAdd = item.quantity || 1;

    try {
      if (user && token) {
        const updatedCart = await apiClient<CartItem[]>('/api/cart/add/', {
          method: 'POST',
          body: { productId: item.id, quantity: quantityToAdd },
        });
        setCartItems(updatedCart || []);
      } else {
        const cartId = await checkOrCreateAnonymousCart();
        if (!cartId) throw new Error("سبد خرید مهمان در دسترس نیست.");
        const response = await apiClient<AnonymousCartAPIResponse>(`/api/anonymous-cart/${cartId}/add-item/`, {
          method: 'POST',
          body: { productId: item.id, quantity: quantityToAdd },
          skipAuth: true,
        });
        setCartItems(response.items || []);
      }
      toast({ title: "اضافه شد!", description: `«${item.name}» به سبد خرید شما اضافه شد.` });
      // openCart(); // Already handled in ProductCard
    } catch (error: any) {
      console.error("Failed to add item to cart:", error);
      toast({ title: "خطا", description: error.message || "خطا در افزودن آیتم به سبد خرید.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItemFromCart = async (itemId: string | number) => {
    setIsLoading(true);
    try {
      if (user && token) {
        const updatedCart = await apiClient<CartItem[]>('/api/cart/remove/', {
          method: 'POST',
          body: { productId: itemId },
        });
        setCartItems(updatedCart || []);
      } else {
        const cartId = anonymousCartId; // Should exist if there are items to remove
        if (!cartId) {
            console.warn("Attempted to remove item from non-existent anonymous cart.");
            setIsLoading(false);
            return;
        };
        const response = await apiClient<AnonymousCartAPIResponse>(`/api/anonymous-cart/${cartId}/remove-item/`, {
          method: 'POST',
          body: { productId: itemId },
          skipAuth: true,
        });
        setCartItems(response.items || []);
      }
      toast({ title: "حذف شد", description: "آیتم از سبد خرید شما حذف شد." });
    } catch (error: any) {
      console.error("Failed to remove item from cart:", error);
      toast({ title: "خطا", description: error.message || "خطا در حذف آیتم از سبد خرید.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: string | number, quantity: number) => {
    if (quantity <= 0) {
      await removeItemFromCart(itemId);
      return;
    }
    setIsLoading(true);
    try {
      if (user && token) {
        const updatedCart = await apiClient<CartItem[]>('/api/cart/update/', {
          method: 'POST',
          body: { productId: itemId, quantity },
        });
        setCartItems(updatedCart || []);
      } else {
        const cartId = anonymousCartId; // Should exist
        if (!cartId) {
            console.warn("Attempted to update item quantity in non-existent anonymous cart.");
            setIsLoading(false);
            return;
        }
        const response = await apiClient<AnonymousCartAPIResponse>(`/api/anonymous-cart/${cartId}/update-item/`, {
          method: 'POST',
          body: { productId: itemId, quantity },
          skipAuth: true,
        });
        setCartItems(response.items || []);
      }
      toast({ title: "به‌روز شد", description: "تعداد آیتم در سبد خرید به‌روز شد." });
    } catch (error: any) {
      console.error("Failed to update item quantity:", error);
      toast({ title: "خطا", description: error.message || "خطا در به‌روزرسانی تعداد آیتم.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      if (user && token) {
        await apiClient<void>('/api/cart/clear/', { method: 'POST' });
        setCartItems([]);
      } else {
        const cartId = anonymousCartId;
        if (cartId) {
          await apiClient<void>(`/api/anonymous-cart/${cartId}/clear/`, { method: 'POST', skipAuth: true });
          setCartItems([]);
        } else {
           setCartItems([]);
        }
      }
      toast({ title: "سبد خرید پاک شد!" });
    } catch (error: any) {
      console.error("Failed to clear cart:", error);
      toast({ title: "خطا", description: error.message || "خطا در پاک کردن سبد خرید.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const getTotalNumeric = (): number => {
    return cartItems.reduce((sum, item) => {
        // Ensure price is treated as a number.
        const priceValue = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return sum + (isNaN(priceValue) ? 0 : priceValue * item.quantity);
    }, 0);
  };

  const getCartTotal = (): string => {
    const total = getTotalNumeric();
    return `${total.toLocaleString('fa-IR')} تومان`;
  };


  return (
    <CartContext.Provider value={{
      cartItems, isCartOpen, isLoading,
      addItemToCart, removeItemFromCart, updateItemQuantity,
      clearCart,
      toggleCart, openCart, closeCart,
      getCartTotal, getTotalNumeric
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
