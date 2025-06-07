
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { MenuItem } from '@/app/menu/page'; // Assuming this type structure

export interface CartItem extends MenuItem { // Extend MenuItem or define a specific CartItemType
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addItemToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItemFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getCartTotal: () => string; // Returns formatted total price string
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
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
    <CartContext.Provider value={{ cartItems, isCartOpen, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart, toggleCart, openCart, closeCart, getCartTotal }}>
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
