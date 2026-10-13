import type { Product } from "@/types/product.types";

export type CartItem = {
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
  id: number;
  userId: number;
  items: ApiCartItem[];
  totalAmount: number;
};
