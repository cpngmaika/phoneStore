"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const disabled = product.status !== "ACTIVE";

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          addItem(product);
          setAdded(true);
        }}
        className="h-12 w-full rounded-lg bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-border-strong"
      >
        {disabled ? "Out of stock" : added ? "Added to cart" : "Add to Cart"}
      </button>
      {added ? (
        <Link
          href="/cart"
          className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-surface px-6 text-sm font-semibold text-text transition hover:border-border-strong"
        >
          View Cart
        </Link>
      ) : null}
    </div>
  );
}
