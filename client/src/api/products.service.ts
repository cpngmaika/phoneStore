import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import { toProduct } from "@/lib/product-mapper";
import type { ApiProduct, Product, ProductRequest } from "@/types/product.types";

export type ProductFilters = {
  keyword?: string;
  category?: Product["category"];
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
};

export function getProductImageStoragePath(imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    return url.pathname.includes("/api/product-images/")
      ? url.pathname
      : imageUrl;
  } catch {
    return imageUrl;
  }
}

export async function getProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }
  const query = params.size ? `?${params.toString()}` : "";
  const products = await requestData<ApiProduct[]>(
    `${apiEndpoints.products.list}${query}`,
  );

  return products.map(toProduct);
}

export async function getProductById(id: number | string) {
  const product = await requestData<ApiProduct>(
    apiEndpoints.products.byId(id),
  );

  return toProduct(product);
}

function toMultipartFormData(payload: ProductRequest, images: File[]) {
  const formData = new FormData();
  formData.append("product", JSON.stringify(payload));
  images.forEach((image) => formData.append("images", image));
  return formData;
}

export function createProduct(payload: ProductRequest, images: File[] = []) {
  return requestData<ApiProduct>(apiEndpoints.products.list, {
    method: "POST",
    body: toMultipartFormData(payload, images),
  });
}

export function updateProduct(
  id: number | string,
  payload: ProductRequest,
  images: File[] = [],
) {
  return requestData<ApiProduct>(apiEndpoints.products.byId(id), {
    method: "PUT",
    body: toMultipartFormData(payload, images),
  });
}

export function deleteProduct(id: number | string) {
  return requestData<null>(apiEndpoints.products.byId(id), {
    method: "DELETE",
  });
}
