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
  const apiSpecs = product.specifications ?? {};
  const specifications = {
    chipset: apiSpecs.chipset ?? undefined,
    storageGb: apiSpecs.storageGb ?? undefined,
    screenSize: apiSpecs.screenSize ?? undefined,
    screenTech: apiSpecs.screenTech ?? undefined,
    batteryMah: apiSpecs.batteryMah ?? undefined,
    mainCameraMp: apiSpecs.mainCameraMp ?? undefined,
    os: apiSpecs.os ?? undefined,
    color: apiSpecs.color ?? undefined,
    supports5G: apiSpecs.supports5G ?? undefined,
    hasCellular: apiSpecs.hasCellular ?? undefined,
    connectionType: apiSpecs.connectionType ?? undefined,
    hasANC: apiSpecs.hasANC ?? undefined,
    batteryLifeHours: apiSpecs.batteryLifeHours ?? undefined,
    wattageW: apiSpecs.wattage ?? undefined,
    portType: apiSpecs.portType ?? undefined,
    fastChargingTech: apiSpecs.fastChargingTech ?? undefined,
    lengthMeters: apiSpecs.lengthMeters ?? undefined,
    connectorFrom: apiSpecs.connectorFrom ?? undefined,
    connectorTo: apiSpecs.connectorTo ?? undefined,
    material: apiSpecs.material ?? undefined,
    compatibleModel: apiSpecs.compatibleModel ?? undefined,
  };
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
    warrantyPolicyId:
      product.warrantyPolicyId === null
        ? null
        : String(product.warrantyPolicyId),
    images: product.imageUrls.map((imageUrl, index) => ({
      imageUrl,
      isPrimary: index === 0,
    })),
    reviews: [],
    ...specifications,
  };

  switch (product.category) {
    case "SMARTPHONE":
      return { ...base, category: product.category };
    case "TABLET":
      return { ...base, category: product.category };
    case "EARPHONE":
      return {
        ...base,
        category: product.category,
        isWireless:
          specifications.connectionType == null
            ? undefined
            : specifications.connectionType.toLowerCase() !== "wired",
      };
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
