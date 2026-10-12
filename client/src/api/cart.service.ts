import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type { ApiCart, Cart, CartItem } from "@/types/cart.types";

export function getCart() {
  return requestData<ApiCart>(apiEndpoints.cart.current);
}

export function addCartItem(productId: number, quantity = 1) {
  return requestData<ApiCart>(apiEndpoints.cart.items, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItem(itemId: number, quantity: number) {
  return requestData<ApiCart>(apiEndpoints.cart.item(itemId), {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId: number) {
  return requestData<ApiCart>(apiEndpoints.cart.item(itemId), {
    method: "DELETE",
  });
}

export function clearCart() {
  return requestData<ApiCart>(apiEndpoints.cart.clear, { method: "DELETE" });
}

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
