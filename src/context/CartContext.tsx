import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, PackSize, packSizeMultipliers } from '@/data/products';

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback((product: Product, packSize: PackSize, quantity = 1) => {
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
