import Link from "next/link";
import Image from "next/image";
import { formatCurrency, titleCase } from "@/lib/product.utils";
import type { Product } from "@/types/product.types";

export function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images.find((image) => image.isPrimary);
  const rating = product.reviews.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length
    : null;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <article className="h-full overflow-hidden rounded-lg bg-surface transition duration-200 hover:-translate-y-1 hover:shadow-soft">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : null}
        </div>
        <div className="space-y-3 px-1 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-text-muted">
                {product.brand.name}
              </p>
              <h2 className="mt-1 line-clamp-2 text-base font-semibold text-text">
                {product.name}
              </h2>
            </div>
            <span className="shrink-0 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
              {titleCase(product.category)}
            </span>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-text-muted">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-text">
              {formatCurrency(product.price)}
            </p>
            <p className="text-sm font-medium text-text-muted">
              {rating === null ? (
                null
              ) : (
                <>
                  <span className="text-star">★</span> {rating.toFixed(1)}
                </>
              )}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
