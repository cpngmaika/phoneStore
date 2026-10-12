import { products } from "@/modules/products/product.service";
import type { Cart, CartItem } from "@/types/cart.types";

export function calculateCart(items: CartItem[]): Cart {
  const normalizedItems = items.map((item) => ({
    ...item,
    subtotal: item.product.price * item.quantity,
  }));

  return {
    id: "cart-demo",
    items: normalizedItems,
    total: normalizedItems.reduce((sum, item) => sum + item.subtotal, 0),
  };
}

export const mockCart = calculateCart([
  { product: products[0], quantity: 1, subtotal: products[0].price },
  { product: products[8], quantity: 2, subtotal: products[8].price * 2 },
]);
