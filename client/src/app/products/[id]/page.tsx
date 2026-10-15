import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/ProductDetail";
import {
  fetchProductById,
  fetchProductReviews,
  fetchReviewSummary,
  fetchWarrantyPolicy,
} from "@/lib/server-api";
import type { ProductReview } from "@/types/product.types";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id).catch(() => null);
  if (!product) return { title: "Sản phẩm | PhoneStore" };
  return {
    title: `${product.name} | PhoneStore`,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await fetchProductById(id).catch(() => null);
  if (!product) notFound();

  const [apiReviews, warrantyPolicy, reviewSummary] = await Promise.all([
    fetchProductReviews(id).catch(() => []),
    product.warrantyPolicyId
      ? fetchWarrantyPolicy(product.warrantyPolicyId)
      : Promise.resolve(null),
    fetchReviewSummary(id).catch(() => null),
  ]);

  const reviews: ProductReview[] = apiReviews
    .filter((review) => !review.isHidden)
    .map(({ id: reviewId, reviewerName, rating, content }) => ({
      id: reviewId,
      reviewerName,
      rating,
      content,
    }));

  return (
    <ProductDetail
      key={product.id}
      product={{ ...product, reviews }}
      reviewsError={null}
      warrantyPolicy={warrantyPolicy}
      warrantyPolicyError={null}
      reviewSummary={reviewSummary}
    />
  );
}
