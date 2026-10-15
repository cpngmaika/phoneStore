import { apiEndpoints } from "@/api/endpoints";
import { getApiAssetUrl } from "@/api/client";
import { requestData } from "@/api/response";
import type { ApiCart, Cart, CartItem } from "@/types/cart.types";
import type { Product } from "@/types/product.types";

/* ---------- Gọi CartServlet (/api/cart/*) ---------- */

// GET /api/cart  -> CartServlet.doGet
export function getCart() {
  return requestData<ApiCart>(apiEndpoints.cart.current);
}

// POST /api/cart/items  -> CartServlet.doPost
export function addCartItem(productId: number, quantity = 1) {
  return requestData<ApiCart>(apiEndpoints.cart.items, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

// PUT /api/cart/items/{itemId}  -> CartServlet.doPut
export function updateCartItem(itemId: number, quantity: number) {
  return requestData<ApiCart>(apiEndpoints.cart.item(itemId), {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

// DELETE /api/cart/items/{itemId}  -> CartServlet.doDelete
export function removeCartItem(itemId: number) {
  return requestData<ApiCart>(apiEndpoints.cart.item(itemId), {
    method: "DELETE",
  });
}

// DELETE /api/cart/clear  -> CartServlet.doDelete
export function clearCart() {
  return requestData<ApiCart>(apiEndpoints.cart.clear, { method: "DELETE" });
}

/* ---------- Chuyển dữ liệu server -> kiểu dùng trên giao diện ---------- */

export function toCart(apiCart: ApiCart): Cart {
  const items: CartItem[] = apiCart.items.map((item) => {
    const product: Product = {
      id: String(item.productId),
      sku: "",
      name: item.productName,
      description: "",
      price: Number(item.productPrice),
      category: "SMARTPHONE",
      status: "ACTIVE",
      brand: { id: "", name: "", logoUrl: "" },
      images: item.productImage
          ? [
            {
              imageUrl: getApiAssetUrl(item.productImage) ?? item.productImage,
              isPrimary: true,
            },
          ]
          : [],
      reviews: [],
    };

    return {
      itemId: item.id,
      product,
      quantity: item.quantity,
      subtotal: Number(item.subtotal),
    };
  });

  return {
    id: apiCart.id == null ? "empty-cart" : String(apiCart.id),
    items,
    total: Number(apiCart.totalAmount ?? 0),
  };
}

// apiClient ném lỗi dạng "API request failed (401): Unauthorized"
export function isUnauthorizedError(error: unknown) {
  return error instanceof Error && error.message.includes("(401)");
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