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
