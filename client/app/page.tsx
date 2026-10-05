import { ProductGrid } from "@/components/ProductGrid";
import { products } from "@/lib/mock-data";

export default function Home() {
  return <ProductGrid products={products.filter((product) => product.status !== "HIDDEN")} />;
}
