import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product, PackSize } from '@/data/products';

export interface CartItem {
  product: Product;
  packSize: PackSize;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, packSize: PackSize, quantity?: number) => void;
  removeFromCart: (productId: string, packSize: PackSize) => void;
  updateQuantity: (productId: string, packSize: PackSize, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  freeShippingThreshold: number;
  hasReachedFreeShipping: boolean;
  amountToFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Free shipping threshold is market-dependent — see src/lib/market.ts
// This hardcoded value is only used for the cart drawer's progress bar
// when no market context is available. The real threshold comes from market config.
const FREE_SHIPPING_THRESHOLD = 29; // €29 for default EUR market

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
        };
        return updated;
      }

      return [...prev, { product, packSize, quantity }];
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
