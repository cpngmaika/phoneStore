"use client";

import { formatCurrency } from "@/modules/products/product.utils";
import { useCart } from "@/modules/cart/cart.hooks";

export function CartSummary() {
  const { cart } = useCart();
  const shipping = cart.total > 0 ? 12 : 0;
  const tax = Math.round(cart.total * 0.08);
  const orderTotal = cart.total + shipping + tax;

  return (
    <aside className="rounded-lg border border-border bg-surface p-6 lg:sticky lg:top-32">
      <h2 className="text-xl font-semibold text-text">Order summary</h2>
      <div className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between text-text-muted">
          <span>Subtotal</span>
          <span>{formatCurrency(cart.total)}</span>
        </div>
        <div className="flex justify-between text-text-muted">
          <span>Delivery</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between text-text-muted">
          <span>Estimated tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>
      <div className="mt-6 flex justify-between border-t border-border pt-6 text-lg font-semibold text-text">
        <span>Total</span>
        <span>{formatCurrency(orderTotal)}</span>
      </div>
      <button
        type="button"
        className="mt-6 h-12 w-full rounded-lg bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        Place Order
      </button>
      <p className="mt-4 text-sm leading-6 text-text-muted">
        Payments are mocked for now. The cart state is stored locally while the
        backend is not connected.
      </p>
    </aside>
  );
}
