import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type {
  ApiProduct,
  ProductRequest,
} from "@/types/product.types";
import type { Product } from "@/types/product.types";

export type ProductFilters = {
  keyword?: string;
  category?: Product["category"];
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
};

function toProduct(product: ApiProduct): Product {
  const status: Product["status"] =
    product.status === "IN_STOCK"
      ? "ACTIVE"
      : product.status === "DISCONTINUED"
        ? "HIDDEN"
        : "OUT_OF_STOCK";
  const base = {
    id: String(product.id),
    sku: product.sku,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    category: product.category,
    status,
    brand: {
      id: String(product.brandId),
      name: product.brandName,
      logoUrl: "",
    },
    images: product.imageUrls.map((imageUrl, index) => ({
      imageUrl,
      isPrimary: index === 0,
    })),
    reviews: [],
  };

  switch (product.category) {
    case "SMARTPHONE":
    case "TABLET":
      return { ...base, category: product.category };
    case "EARPHONE":
      return { ...base, category: product.category };
    case "CHARGER":
    case "CABLE":
    case "CASE":
      return { ...base, category: product.category };
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

export function createProduct(payload: ProductRequest) {
  return requestData<ApiProduct>(apiEndpoints.products.list, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id: number | string, payload: ProductRequest) {
  return requestData<ApiProduct>(apiEndpoints.products.byId(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: number | string) {
  return requestData<null>(apiEndpoints.products.byId(id), {
    method: "DELETE",
  });
}
