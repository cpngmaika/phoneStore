"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createReview } from "@/api/reviews.service";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductSpecs } from "@/components/products/ProductSpecs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatCurrency } from "@/lib/product.utils";
import type { Product } from "@/types/product.types";
import type { WarrantyPolicy } from "@/types/warranty.types";

export function ProductDetail({
  product,
  reviewsError,
  warrantyPolicy,
  warrantyPolicyError,
}: {
  product: Product;
  reviewsError: string | null;
  warrantyPolicy: WarrantyPolicy | null;
  warrantyPolicyError: string | null;
}) {
  const { user } = useCurrentUser();
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState(product.reviews);
  const primaryImage = product.images.find((image) => image.isPrimary);
  const galleryImages = [
    primaryImage,
    ...product.images.filter((image) => !image.isPrimary),
  ].filter(Boolean);
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) /
      reviews.length
    : null;

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingReview(true);
    setReviewError(null);
    try {
      const review = await createReview({
        productId: Number(product.id),
        rating,
        content: reviewContent.trim(),
      });
      setReviews((current) => [
        {
          id: review.id,
          reviewerName: review.reviewerName,
          rating: review.rating,
          content: review.content,
        },
        ...current,
      ]);
      setReviewContent("");
    } catch (requestError) {
      setReviewError(
        requestError instanceof Error
          ? requestError.message
          : "Không thể gửi đánh giá.",
      );
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(24rem,0.8fr)]">
        <section className="grid gap-4 sm:grid-cols-2">
          {galleryImages.map((image, index) => (
            <div
              key={image?.imageUrl}
              className={`overflow-hidden rounded-lg bg-surface-muted ${
                index === 0 ? "sm:col-span-2" : ""
              }`}
            >
              {image ? (
                <div
                  className={`relative ${index === 0 ? "aspect-[4/3]" : "aspect-square"}`}
                >
                  <Image
                    src={image.imageUrl}
                    alt={`${product.name} image ${index + 1}`}
                    fill
                    unoptimized
                    priority={index === 0}
                    sizes={index === 0 ? "(min-width: 1024px) 60vw, 100vw" : "50vw"}
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-primary">{product.brand.name}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-text">
              {product.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium text-text-muted">
              <span>
                {averageRating === null ? (
                  "No reviews yet"
                ) : (
                  <>
                    <span className="text-star">★</span> {averageRating.toFixed(1)}
                  </>
                )}
              </span>
              <span>{reviews.length} reviews</span>
              <span>SKU {product.sku}</span>
            </div>
          </div>

          <p className="text-lg leading-8 text-text-muted">{product.description}</p>

          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-text-muted">Price</p>
                <p className="mt-1 text-3xl font-semibold text-text">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <span className="rounded-full bg-surface-muted px-4 py-2 text-sm font-semibold text-text">
                {product.status === "ACTIVE" ? "In stock" : "Out of stock"}
              </span>
            </div>
            <div className="mt-5">
              <AddToCartButton product={product} />
            </div>
          </div>

          <ProductSpecs product={product} />

          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-text">
              Chính sách bảo hành
            </h2>
            {warrantyPolicyError ? (
              <p role="alert" className="mt-3 text-sm text-red-700">
                Không thể tải chính sách bảo hành: {warrantyPolicyError}
              </p>
            ) : warrantyPolicy ? (
              <div className="mt-4 space-y-3 text-sm leading-6 text-text-muted">
                <p className="font-semibold text-text">{warrantyPolicy.name}</p>
                <p>
                  <span className="font-medium text-text">Thời hạn:</span>{" "}
                  {warrantyPolicy.durationMonths} tháng
                </p>
                <p>
                  <span className="font-medium text-text">Phạm vi bảo hành:</span>{" "}
                  {warrantyPolicy.coverage || "Chưa cập nhật."}
                </p>
                <p>
                  <span className="font-medium text-text">Điều kiện loại trừ:</span>{" "}
                  {warrantyPolicy.exclusions || "Chưa cập nhật."}
                </p>
                <p>
                  <span className="font-medium text-text">Thông tin liên hệ:</span>{" "}
                  {warrantyPolicy.contactInfo || "Chưa cập nhật."}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-text-muted">
                Sản phẩm chưa có chính sách bảo hành.
              </p>
            )}
          </section>

          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-text">Reviews</h2>
            {reviewsError ? (
              <p role="alert" className="mt-3 text-sm text-red-700">
                Không thể tải đánh giá: {reviewsError}
              </p>
            ) : null}
            <div className="mt-4 space-y-4">
              {reviews.map((review, index) => (
                <blockquote
                  key={review.id ?? `${review.content}-${index}`}
                  className="rounded-lg bg-surface-muted p-4 text-sm leading-6 text-text-muted"
                >
                  <p className="font-semibold text-text">
                    {review.reviewerName ?? "Khách hàng"} · {review.rating}.0 ★
                  </p>
                  <p className="mt-1">
                    {review.content}
                  </p>
                </blockquote>
              ))}
              {reviews.length === 0 && !reviewsError ? (
                <p className="text-sm text-text-muted">Chưa có đánh giá nào.</p>
              ) : null}
            </div>
            <div className="mt-6 border-t border-border pt-5">
              <h3 className="font-semibold text-text">Viết đánh giá</h3>
              {user ? (
                <form onSubmit={submitReview} className="mt-3 space-y-3">
                  <label className="block text-sm font-medium text-text">
                    Số sao
                    <select
                      value={rating}
                      onChange={(event) => setRating(Number(event.target.value))}
                      className="mt-1 block h-10 rounded-lg border border-border px-3"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>{value} sao</option>
                      ))}
                    </select>
                  </label>
                  <textarea
                    required
                    minLength={2}
                    maxLength={2000}
                    value={reviewContent}
                    onChange={(event) => setReviewContent(event.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn"
                    className="min-h-24 w-full rounded-lg border border-border p-3 text-sm"
                  />
                  {reviewError ? (
                    <p role="alert" className="text-sm text-red-700">{reviewError}</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </form>
              ) : (
                <p className="mt-2 text-sm text-text-muted">
                  <Link href="/login" className="font-semibold text-primary">Đăng nhập</Link> để gửi đánh giá.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
