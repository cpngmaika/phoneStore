"use client";

import Image from "next/image";
import { formatCurrency } from "@/modules/products/product.utils";
import { useCart } from "@/modules/cart/cart.hooks";
import type { CartItem as CartItemData } from "@/types/cart.types";

export function CartItem({ item }: { item: CartItemData }) {
  const { updateQuantity, removeItem } = useCart();
  const image = item.product.images.find(
    (productImage) => productImage.isPrimary,
  );

  return (
    <article className="grid grid-cols-[5.5rem_1fr] gap-4 rounded-lg border border-border bg-surface p-4">
      <div className="relative h-[5.5rem] w-[5.5rem] overflow-hidden rounded-lg bg-surface-muted">
        {image ? (
          <Image
            src={image.imageUrl}
            alt={item.product.name}
            fill
            sizes="5.5rem"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-text">{item.product.name}</h3>
            <p className="mt-1 text-sm text-text-muted">
              {item.product.brand.name}
            </p>
          </div>
          <p className="font-semibold text-text">{formatCurrency(item.subtotal)}</p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex h-10 items-center rounded-full border border-border">
            <button
              type="button"
              className="h-10 w-10 text-lg font-semibold text-text"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              aria-label={`Decrease ${item.product.name} quantity`}
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-semibold text-text">
              {item.quantity}
            </span>
            <button
              type="button"
              className="h-10 w-10 text-lg font-semibold text-text"
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              aria-label={`Increase ${item.product.name} quantity`}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="text-sm font-semibold text-primary"
            onClick={() => removeItem(item.product.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
