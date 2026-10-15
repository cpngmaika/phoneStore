import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/product.utils";
import type { Product } from "@/types/product.types";

type ProductCardProps = {
  product: Product;
  actions?: {
    onEdit: () => void;
    onDelete: () => void;
    deleting?: boolean;
  };
};

export function ProductCard({ product, actions }: ProductCardProps) {
  const primaryImage =
    product.images.find((image) => image.isPrimary) ?? product.images[0];
  const rating = product.reviews.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length
    : null;

  return (
    <article className="group flex h-full flex-col">
      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden rounded-md bg-surface-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.imageUrl}
              alt={product.name}
              fill
              unoptimized={primaryImage.imageUrl.includes("/api/product-images/")}
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl font-semibold text-border-strong">
              {product.brand.name.charAt(0)}
            </div>
          )}
          {product.status === "OUT_OF_STOCK" ? (
            <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold text-text-muted backdrop-blur">
              Hết hàng
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {product.brand.name}
          </p>
          <h2 className="mt-1.5 line-clamp-2 text-base font-medium leading-6 text-text">
            {product.name}
          </h2>
          <div className="mt-auto flex items-baseline justify-between gap-3 pt-3">
            <p className="text-base font-semibold text-text">
              {formatCurrency(product.price)}
            </p>
            {rating !== null ? (
              <p className="text-sm text-text-muted">
                <span className="text-star">★</span> {rating.toFixed(1)}
              </p>
            ) : null}
          </div>
        </div>
      </Link>

      {actions ? (
        <div className="mt-4 flex items-center justify-end gap-4 border-t border-border pt-3 text-sm font-semibold">
          <button type="button" onClick={actions.onEdit} className="text-primary">
            Sửa
          </button>
          <button
            type="button"
            disabled={actions.deleting}
            onClick={actions.onDelete}
            className="text-red-700 disabled:opacity-60"
          >
            {actions.deleting ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      ) : null}
    </article>
  );
}
