import { products as mockProducts } from "@/modules/products/mock-data";

export const products = mockProducts;

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}
