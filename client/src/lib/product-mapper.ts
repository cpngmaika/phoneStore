import { getApiAssetUrl } from "@/api/client";
import type { ApiProduct, Product } from "@/types/product.types";

/**
 * Maps the backend ProductResponse DTO into the frontend Product view model.
 * Pure and isomorphic so it can run both in Server Components and in the browser.
 */
export function toProduct(product: ApiProduct): Product {
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
      imageUrl: getApiAssetUrl(imageUrl) ?? imageUrl,
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
