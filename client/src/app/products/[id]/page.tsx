"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductDetail } from "@/components/products/ProductDetail";
import { getProductById } from "@/api/products.service";
import { getReviewsByProduct } from "@/api/reviews.service";
import { getWarrantyPolicyById } from "@/api/warranty-policies.service";
import type { Product, ProductReview } from "@/types/product.types";
import type { WarrantyPolicy } from "@/types/warranty.types";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [warrantyPolicy, setWarrantyPolicy] = useState<WarrantyPolicy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [warrantyPolicyError, setWarrantyPolicyError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getProductById(params.id)
      .then(async (result) => {
        if (!cancelled) {
          setWarrantyPolicy(null);
          setWarrantyPolicyError(null);
        }

        const [apiReviews, policy] = await Promise.all([
          getReviewsByProduct(params.id).catch((requestError: unknown) => {
            if (!cancelled) {
              setReviewsError(
                requestError instanceof Error
                  ? requestError.message
                  : "Không thể tải đánh giá.",
              );
            }
            return [];
          }),
          result.warrantyPolicyId
            ? getWarrantyPolicyById(result.warrantyPolicyId).catch(
                (requestError: unknown) => {
                  if (!cancelled) {
                    setWarrantyPolicyError(
                      requestError instanceof Error
                        ? requestError.message
                        : "Không thể tải chính sách bảo hành.",
                    );
                  }
                  return null;
                },
              )
            : Promise.resolve(null),
        ]);

        if (!cancelled) {
          const reviews: ProductReview[] = apiReviews
            .filter((review) => !review.isHidden)
            .map(({ id, reviewerName, rating, content }) => ({
              id,
              reviewerName,
              rating,
              content,
            }));
          setWarrantyPolicy(policy);
          setProduct({ ...result, reviews });
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Không tìm thấy sản phẩm.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16 text-center">
        <p role="alert" className="text-red-700">{error}</p>
        <Link href="/" className="mt-5 inline-block font-semibold text-primary">
          Quay lại cửa hàng
        </Link>
      </main>
    );
  }

  if (!product) {
    return <main className="mx-auto max-w-7xl px-5 py-16 text-text-muted" role="status">Đang tải sản phẩm...</main>;
  }

  return (
    <ProductDetail
      key={product.id}
      product={product}
      reviewsError={reviewsError}
      warrantyPolicy={warrantyPolicy}
      warrantyPolicyError={warrantyPolicyError}
    />
  );
}
