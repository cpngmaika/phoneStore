import type { Product } from "@/types/product.types";

export type CartItem = {
  /** id của LineItem trên server, dùng cho PUT/DELETE /api/cart/items/{itemId} */
  itemId?: number;
  product: Product;
  quantity: number;
  subtotal: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
  total: number;
};

export type ApiCartItem = {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string | null;
  quantity: number;
  subtotal: number;
};

export type ApiCart = {
  id: number | null;
  userId: number;
  items: ApiCartItem[];
  totalAmount: number;
};