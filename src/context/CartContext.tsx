
"use client";

import type { ReactNode } from 'react';
<<<<<<< HEAD
import { createContext, useContext, useState, useEffect } from 'react';
import type { MenuItem } from '@/app/menu/page'; // Assuming this type structure
=======
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MenuItem } from '@/app/menu/page';
import { useAuth } from './AuthContext';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)

export interface CartItem extends MenuItem { // Extend MenuItem or define a specific CartItemType
  quantity: number;
}

interface AnonymousCart {
  uuid: string;
  items: CartItem[];
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
<<<<<<< HEAD
  addItemToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItemFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
=======
  isLoading: boolean; // Global loading state for cart operations
  addItemToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  removeItemFromCart: (itemId: string | number) => Promise<void>;
  updateItemQuantity: (itemId: string | number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getCartTotal: () => string; // Returns formatted total price string
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const ANONYMOUS_CART_ID_STORAGE_KEY = 'espressoEdgeAnonymousCartId';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
<<<<<<< HEAD

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('espressoEdgeCart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('espressoEdgeCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(ci => ci.id === item.id);
      if (existingItem) {
        return prevItems.map(ci =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + (item.quantity || 1) } : ci
        );
      }
      return [...prevItems, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeItemFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
=======
  const [isLoading, setIsLoading] = useState(false); // For cart operations
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
      const response = await apiClient<AnonymousCart>('/anonymous-cart/create/', { method: 'POST' });
      if (response && response.uuid) {
        localStorage.setItem(ANONYMOUS_CART_ID_STORAGE_KEY, response.uuid);
        setAnonymousCartId(response.uuid);
        setCartItems(response.items || []); // API should return items
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
      const response = await apiClient<AnonymousCart>(`/anonymous-cart/${cartId}/`);
      setCartItems(response.items || []);
    } catch (error: any) {
      console.error("Failed to fetch anonymous cart items:", error);
      // If cart not found (e.g. expired UUID on backend), clear local ID and create a new one
      if (error.message && error.message.includes("404")) { // Or specific error code
        localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY);
        setAnonymousCartId(null);
        await checkOrCreateAnonymousCart(); // This will create a new one and fetch its (empty) items
      } else {
        toast({ title: "خطا", description: error.message || "خطا در دریافت سبد خرید مهمان.", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, checkOrCreateAnonymousCart]);

  const syncUserCartWithBackend = useCallback(async () => {
    if (!user || !token) return;
    setIsLoading(true);
    try {
      const backendCart = await apiClient<CartItem[]>('/cart/');
      setCartItems(backendCart || []);
    } catch (error) {
      console.error("Failed to sync user cart with backend:", error);
      toast({ title: "خطا", description: "خطا در همگام‌سازی سبد خرید شما.", variant: "destructive" });
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
        // This might be an extra fetch, or backend can handle empty guestCartId gracefully
        const guestCart = await apiClient<AnonymousCart>(`/anonymous-cart/${guestCartId}/`);
        if (guestCart && guestCart.items && guestCart.items.length > 0) {
            await apiClient('/cart/migrate-anonymous/', {
            method: 'POST',
            body: { anonymous_cart_id: guestCartId },
            });
            toast({ title: "انتقال سبد خرید", description: "اقلام سبد خرید مهمان شما به حساب کاربری‌تان منتقل شد." });
        }
      } catch (error: any) {
        console.error("Failed to migrate anonymous cart:", error);
        toast({ title: "خطا در انتقال", description: error.message || "خطا در انتقال سبد خرید مهمان.", variant: "destructive" });
      } finally {
        localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY);
        setAnonymousCartId(null);
      }
    }
    await syncUserCartWithBackend(); // Fetch authenticated user's cart (now potentially merged)
    setIsLoading(false);
  }, [user, token, syncUserCartWithBackend, toast]);

  useEffect(() => {
    if (!isAuthLoading) {
      if (user && token) {
        handleUserLogin();
      } else {
        // Guest user
        localStorage.removeItem('espressoEdgeGuestCart'); // Clear old guest cart mechanism
        const storedAnonId = localStorage.getItem(ANONYMOUS_CART_ID_STORAGE_KEY);
        if (storedAnonId) {
          setAnonymousCartId(storedAnonId);
          fetchAnonymousCartItems(storedAnonId);
        } else {
          // Don't create a cart immediately on load, wait for user action.
          // checkOrCreateAnonymousCart will be called by cart operations if needed.
          setCartItems([]); // Ensure cart is empty if no ID
        }
      }
    }
  }, [user, token, isAuthLoading, handleUserLogin, fetchAnonymousCartItems]);


  const addItemToCart = async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setIsLoading(true);
    const quantityToAdd = item.quantity || 1;
    const itemPrice = item.price;

    try {
      if (user && token) {
        const updatedCart = await apiClient<CartItem[]>('/cart/add/', {
          method: 'POST',
          body: { productId: item.id, quantity: quantityToAdd },
        });
        setCartItems(updatedCart || []);
      } else {
        const cartId = await checkOrCreateAnonymousCart();
        if (!cartId) throw new Error("سبد خرید مهمان در دسترس نیست.");
        const response = await apiClient<AnonymousCart>(`/anonymous-cart/${cartId}/add-item/`, {
          method: 'POST',
          body: { productId: item.id, quantity: quantityToAdd },
        });
        setCartItems(response.items || []);
      }
      toast({ title: "اضافه شد!", description: `«${item.name}» به سبد خرید شما اضافه شد.` });
      openCart();
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
        const updatedCart = await apiClient<CartItem[]>('/cart/remove/', {
          method: 'POST',
          body: { productId: itemId },
        });
        setCartItems(updatedCart || []);
      } else {
        const cartId = anonymousCartId;
        if (!cartId) throw new Error("سبد خرید مهمان در دسترس نیست.");
        const response = await apiClient<AnonymousCart>(`/anonymous-cart/${cartId}/remove-item/`, {
          method: 'POST',
          body: { productId: itemId },
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
>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
<<<<<<< HEAD
      removeItemFromCart(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
=======
      await removeItemFromCart(itemId);
      return;
    }
    setIsLoading(true);
    try {
      if (user && token) {
        const updatedCart = await apiClient<CartItem[]>('/cart/update/', {
          method: 'POST',
          body: { productId: itemId, quantity },
        });
        setCartItems(updatedCart || []);
      } else {
        const cartId = anonymousCartId;
        if (!cartId) throw new Error("سبد خرید مهمان در دسترس نیست.");
        // Assuming an endpoint for updating quantity in anonymous cart
        const response = await apiClient<AnonymousCart>(`/anonymous-cart/${cartId}/update-item/`, {
          method: 'POST',
          body: { productId: itemId, quantity },
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
        await apiClient<void>('/cart/clear/', { method: 'POST' });
        setCartItems([]);
      } else {
        const cartId = anonymousCartId;
        if (cartId) {
          // Assuming an endpoint for clearing anonymous cart
          await apiClient<void>(`/anonymous-cart/${cartId}/clear/`, { method: 'POST' });
          setCartItems([]);
          // Optionally clear anonymousCartId from localStorage if preferred,
          // or let it persist for the next session (new cart will be created if old one is gone on backend)
          // localStorage.removeItem(ANONYMOUS_CART_ID_STORAGE_KEY);
          // setAnonymousCartId(null);
        } else {
           setCartItems([]); // If no cartId, just clear local state
        }
      }
      toast({ title: "سبد خرید پاک شد!" });
    } catch (error: any) {
      console.error("Failed to clear cart:", error);
      toast({ title: "خطا", description: error.message || "خطا در پاک کردن سبد خرید.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

<<<<<<< HEAD
  const openCart = () => {
    setIsCartOpen(true);
  };
  
  const closeCart = () => {
    setIsCartOpen(false);
=======
  const getTotalNumeric = (): number => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartTotal = (): string => {
    const total = getTotalNumeric();
    return `${total.toLocaleString('fa-IR')} تومان`;
>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)
  };

  const getCartTotal = (): string => {
    const total = cartItems.reduce((sum, item) => {
      // Basic price parsing (e.g., "120,000 تومان" -> 120000)
      // This is a simplification and needs robust parsing for real-world currency
      const priceNumber = parseFloat(item.price.replace(/[^0-9.-]+/g,""));
      return sum + (isNaN(priceNumber) ? 0 : priceNumber * item.quantity);
    }, 0);
    return `${total.toLocaleString('fa-IR')} تومان`; // Format for Persian
  };


  return (
<<<<<<< HEAD
    <CartContext.Provider value={{ cartItems, isCartOpen, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart, toggleCart, openCart, closeCart, getCartTotal }}>
=======
    <CartContext.Provider value={{
      cartItems, isCartOpen, isLoading,
      addItemToCart, removeItemFromCart, updateItemQuantity,
      clearCart,
      toggleCart, openCart, closeCart,
      getCartTotal, getTotalNumeric
    }}>
>>>>>>> 865b30b (A backend developer has requested a change in the frontend of the site.)
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
