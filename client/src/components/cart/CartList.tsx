"use client";

import { useCart } from "@/hooks/cart.hooks";
import { CartItem } from "@/components/cart/CartItem";

export function CartList() {
  const { cart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-text-muted">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <CartItem key={item.product.id} item={item} />
      ))}
    </div>
  );
}
