import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product, PackSize } from '@/data/products';

export type SubscriptionFrequency = 'once' | '14days' | '1month' | '2months';

export interface CartItem {
  product: Product;
  packSize: PackSize;
  quantity: number;
  isSubscription: boolean;
  subscriptionFrequency?: SubscriptionFrequency;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, packSize: PackSize, quantity?: number, isSubscription?: boolean, subscriptionFrequency?: SubscriptionFrequency) => void;
  removeFromCart: (productId: string, packSize: PackSize) => void;
  updateQuantity: (productId: string, packSize: PackSize, quantity: number) => void;
  updateSubscription: (productId: string, packSize: PackSize, isSubscription: boolean, frequency?: SubscriptionFrequency) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  freeShippingThreshold: number;
  hasReachedFreeShipping: boolean;
  amountToFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 25; // £25 for UK

const STORAGE_KEY = 'snusfriend_cart';

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load cart from storage:', e);
  }
  return [];
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart to storage:', e);
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());
  const [isOpen, setIsOpen] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback((
    product: Product,
    packSize: PackSize,
    quantity = 1,
    isSubscription = false,
    subscriptionFrequency: SubscriptionFrequency = '1month'
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.packSize === packSize
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          isSubscription,
          subscriptionFrequency: isSubscription ? subscriptionFrequency : undefined,
        };
        return updated;
      }

      return [...prev, {
        product,
        packSize,
        quantity,
        isSubscription,
        subscriptionFrequency: isSubscription ? subscriptionFrequency : undefined,
      }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, packSize: PackSize) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.packSize === packSize))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, packSize: PackSize, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, packSize);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId && item.packSize === packSize
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const updateSubscription = useCallback(
    (productId: string, packSize: PackSize, isSubscription: boolean, frequency?: SubscriptionFrequency) => {
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId && item.packSize === packSize
            ? {
                ...item,
                isSubscription,
                subscriptionFrequency: isSubscription ? (frequency || '1month') : undefined,
              }
            : item
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const price = item.product.prices[item.packSize];
    return sum + price * item.quantity;
  }, 0);

  const hasReachedFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSubscription,
        clearCart,
        totalItems,
        totalPrice,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        hasReachedFreeShipping,
        amountToFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
