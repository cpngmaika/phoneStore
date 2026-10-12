import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";
import { getProductById, products } from "@/modules/products/product.service";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductDetailPage(props: PageProps<"/products/[id]">) {
  const { id } = await props.params;
  const product = getProductById(id);

  if (!product || product.status === "HIDDEN") {
    notFound();
  }

  return <ProductDetail product={product} />;
}
