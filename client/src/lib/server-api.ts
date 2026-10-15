import { toProduct } from "@/lib/product-mapper";
import { PRODUCTS_PAGE_SIZE, type ProductQuery } from "@/lib/product-search";
import type { ApiBrand } from "@/types/brand.types";
import type {
  ApiPagedProducts,
  ApiProduct,
  PagedProducts,
  Product,
} from "@/types/product.types";
import type { ApiReview, ReviewSummary } from "@/types/review.types";
import type { WarrantyPolicy } from "@/types/warranty.types";

/**
 * Server-only access to the Java backend.
 *
 * This module must only be imported from Server Components / server-side code.
 * `BACKEND_URL` is a private (non NEXT_PUBLIC) environment variable, so the
 * backend origin is never shipped to the browser. No authentication cookies are
 * forwarded here: it is used exclusively for public catalogue data.
 */
const backendBaseUrl = (
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080/server-1.0-SNAPSHOT"
).replace(/\/+$/, "");

type ApiEnvelope<T> = { success: boolean; message: string; data: T };

async function backendGet<T>(path: string, revalidate: number): Promise<T> {
  const response = await fetch(`${backendBaseUrl}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });

  if (!response.ok) {
    console.error({"call url: ": backendBaseUrl + path,
      "body":  (await response.json())
    })
    
    throw new Error(`Backend request failed (${response.status}) for ${path}`);
  }

  const body = (await response.json()) as ApiEnvelope<T>;
  if (!body.success) {
    throw new Error(body.message || "Backend request failed");
  }
  console.log(body)
  return body.data;
}

function buildProductSearchPath(query: ProductQuery, size: number): string {
  const params = new URLSearchParams();
  if (query.keyword.trim()) params.set("keyword", query.keyword.trim());
  if (query.category !== "ALL") params.set("category", query.category);
  if (query.brandId != null) params.set("brandId", String(query.brandId));
  if (query.minPrice != null) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice != null) params.set("maxPrice", String(query.maxPrice));
  if (query.sort !== "default") params.set("sort", query.sort);
  params.set("page", String(query.page));
  params.set("size", String(size));
  return `/api/products/search?${params.toString()}`;
}

export async function fetchProductsPage(
  query: ProductQuery,
  size: number = PRODUCTS_PAGE_SIZE,
): Promise<PagedProducts> {
  const data = await backendGet<ApiPagedProducts>(
    buildProductSearchPath(query, size),
    30,
  );
  return {
    products: data.content.map(toProduct),
    page: data.page,
    size: data.size,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
  };
}

export async function fetchBrands(): Promise<ApiBrand[]> {
  return backendGet<ApiBrand[]>("/api/brands", 300);
}

export async function fetchProductById(id: number | string): Promise<Product> {
  const product = await backendGet<ApiProduct>(`/api/products/${id}`, 60);
  return toProduct(product);
}

export async function fetchProductReviews(
  id: number | string,
): Promise<ApiReview[]> {
  return backendGet<ApiReview[]>(`/api/reviews?productId=${id}`, 30);
}

export async function fetchReviewSummary(
  id: number | string,
): Promise<ReviewSummary> {
  return backendGet<ReviewSummary>(`/api/reviews/summary?productId=${id}`, 30);
}

export async function fetchWarrantyPolicy(
  id: number | string,
): Promise<WarrantyPolicy | null> {
  try {
    return await backendGet<WarrantyPolicy>(`/api/warranty-policies/${id}`, 300);
  } catch {
    return null;
  }
}
