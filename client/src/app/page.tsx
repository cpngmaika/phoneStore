import type { Metadata } from "next";
import { ProductCatalogue } from "@/components/products/ProductCatalogue";
import type { SearchParamsLike } from "@/lib/product-search";

export const metadata: Metadata = {
  title: "PhoneStore | Sản phẩm",
  description:
    "Tìm kiếm và lọc điện thoại, máy tính bảng và phụ kiện chính hãng tại PhoneStore.",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParamsLike>;
}) {
  const params = await searchParams;
  return <ProductCatalogue searchParams={params} basePath="/" />;
}
