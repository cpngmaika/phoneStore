import { ProductList } from "@/components/products/ProductList";
import { products } from "@/modules/products/product.service";

export default function Home() {
  return <ProductList products={products.filter((product) => product.status !== "HIDDEN")} />;
}
