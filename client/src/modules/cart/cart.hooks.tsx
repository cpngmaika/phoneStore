"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { calculateCart, mockCart } from "@/modules/cart/cart.service";
import type { Cart } from "@/types/cart.types";
import type { Product } from "@/types/product.types";

type CartContextValue = {
  cart: Cart;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "phone-store-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => {
    if (typeof window === "undefined") {
      return mockCart;
    }

    try {
      const savedCart = window.localStorage.getItem(storageKey);
      return savedCart ? calculateCart(JSON.parse(savedCart).items) : mockCart;
    } catch {
      return mockCart;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setCart((currentCart) => {
      const existingItem = currentCart.items.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return calculateCart(
          currentCart.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        );
      }

      return calculateCart([
        ...currentCart.items,
        { product, quantity, subtotal: product.price * quantity },
      ]);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((currentCart) =>
      calculateCart(
        currentCart.items
          .map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.max(quantity, 1) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((currentCart) =>
      calculateCart(
        currentCart.items.filter((item) => item.product.id !== productId),
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart(calculateCart([]));
  }, []);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      cart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
    }),
    [addItem, cart, clearCart, itemCount, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
