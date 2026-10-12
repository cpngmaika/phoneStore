"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { calculateCart } from "@/api/cart.service";
import type { Cart, CartItem } from "@/types/cart.types";
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
const storageKey = "phone-store-cart-v2";
const emptyCart: Cart = { id: "local-cart", items: [], total: 0 };
let cartSnapshot: Cart | null = null;
const listeners = new Set<() => void>();

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null || !("product" in value)) {
    return false;
  }
  const item = value as {
    product?: { id?: unknown; price?: unknown };
    quantity?: unknown;
  };
  return (
    typeof item.product?.id === "string" &&
    /^\d+$/.test(item.product.id) &&
    typeof item.product.price === "number" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

function getCartSnapshot() {
  if (cartSnapshot) return cartSnapshot;
  if (typeof window === "undefined") return emptyCart;

  const savedCart = window.localStorage.getItem(storageKey);
  if (!savedCart) {
    cartSnapshot = emptyCart;
    return cartSnapshot;
  }

  const parsedCart: unknown = JSON.parse(savedCart);
  if (
    typeof parsedCart !== "object" ||
    parsedCart === null ||
    !("items" in parsedCart) ||
    !Array.isArray(parsedCart.items) ||
    !parsedCart.items.every(isCartItem)
  ) {
    throw new Error("Saved cart data is invalid.");
  }
  cartSnapshot = calculateCart(parsedCart.items);
  return cartSnapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function saveCart(cart: Cart) {
  cartSnapshot = cart;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(cart));
  }
  listeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useSyncExternalStore(
    subscribe,
    getCartSnapshot,
    () => emptyCart,
  );

  const addItem = useCallback((product: Product, quantity = 1) => {
    const currentCart = getCartSnapshot();
      const existingItem = currentCart.items.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        saveCart(calculateCart(
          currentCart.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        ));
        return;
      }

      saveCart(calculateCart([
        ...currentCart.items,
        { product, quantity, subtotal: product.price * quantity },
      ]));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const currentCart = getCartSnapshot();
    saveCart(
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
    const currentCart = getCartSnapshot();
    saveCart(
      calculateCart(
        currentCart.items.filter((item) => item.product.id !== productId),
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    saveCart(calculateCart([]));
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
