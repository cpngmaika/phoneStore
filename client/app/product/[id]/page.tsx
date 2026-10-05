import { notFound } from "next/navigation";
import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductSpecs } from "@/components/ProductSpecs";
import { formatCurrency } from "@/lib/format";
import { getProductById, products } from "@/lib/mock-data";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductDetailPage(props: PageProps<"/product/[id]">) {
  const { id } = await props.params;
  const product = getProductById(id);

  if (!product || product.status === "HIDDEN") {
    notFound();
  }

  const primaryImage = product.images.find((image) => image.isPrimary);
  const galleryImages = [
    primaryImage,
    ...product.images.filter((image) => !image.isPrimary),
  ].filter(Boolean);
  const rating =
    product.reviews.reduce((sum, review) => sum + review.rating, 0) /
    product.reviews.length;

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
                <div className={`relative ${index === 0 ? "aspect-[4/3]" : "aspect-square"}`}>
                  <Image
                    src={image.imageUrl}
                    alt={`${product.name} image ${index + 1}`}
                    fill
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
                <span className="text-star">★</span> {rating.toFixed(1)}
              </span>
              <span>{product.reviews.length} reviews</span>
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

          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-text">Reviews</h2>
            <div className="mt-4 space-y-4">
              {product.reviews.map((review) => (
                <blockquote
                  key={review.content}
                  className="rounded-lg bg-surface-muted p-4 text-sm leading-6 text-text-muted"
                >
                  <span className="font-semibold text-text">{review.rating}.0 ★ </span>
                  {review.content}
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
