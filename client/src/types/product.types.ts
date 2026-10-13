export type ProductCategory =
  | "SMARTPHONE"
  | "TABLET"
  | "EARPHONE"
  | "CHARGER"
  | "CABLE"
  | "CASE";

export type ProductStatus = "ACTIVE" | "HIDDEN" | "OUT_OF_STOCK";
export type ApiProductStatus =
  | "IN_STOCK"
  | "OUT_OF_STOCK"
  | "DISCONTINUED";

export type Brand = {
  id: string;
  name: string;
  logoUrl: string;
};

export type ProductImage = {
  imageUrl: string;
  isPrimary: boolean;
};

export type ProductReview = {
  id?: number;
  reviewerName?: string;
  rating: number;
  content: string;
};

type BaseProduct = {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  brand: Brand;
  images: ProductImage[];
  reviews: ProductReview[];
  warrantyPolicyId?: string | null;
};

export type SmartDeviceProduct = BaseProduct & {
  category: "SMARTPHONE" | "TABLET";
  chipset?: string;
  storageGb?: number;
  screenSize?: number;
  screenTech?: string;
  batteryMah?: number;
  mainCameraMp?: number;
  os?: string;
  color?: string;
  supports5G?: boolean;
  hasCellular?: boolean;
};

export type EarphoneProduct = BaseProduct & {
  category: "EARPHONE";
  connectionType?: string;
  hasANC?: boolean;
  batteryLifeHours?: number;
  isWireless?: boolean;
};

export type PowerAccessoryProduct = BaseProduct & {
  category: "CHARGER" | "CABLE" | "CASE";
  wattageW?: number;
  portType?: string;
  fastChargingTech?: string;
  lengthMeters?: number;
  connectorFrom?: string;
  connectorTo?: string;
  material?: string;
  color?: string;
  compatibleModel?: string;
};

export type Product =
  | SmartDeviceProduct
  | EarphoneProduct
  | PowerAccessoryProduct;

export type ApiProduct = {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ApiProductStatus;
  brandId: number;
  brandName: string;
  warrantyPolicyId: number | null;
  imageUrls: string[];
  specifications: {
    chipset?: string | null;
    storageGb?: number | null;
    screenSize?: number | null;
    screenTech?: string | null;
    batteryMah?: number | null;
    mainCameraMp?: number | null;
    os?: string | null;
    color?: string | null;
    supports5G?: boolean | null;
    hasCellular?: boolean | null;
    connectionType?: string | null;
    hasANC?: boolean | null;
    batteryLifeHours?: number | null;
    wattage?: number | null;
    portType?: string | null;
    fastChargingTech?: string | null;
    lengthMeters?: number | null;
    connectorFrom?: string | null;
    connectorTo?: string | null;
    material?: string | null;
    compatibleModel?: string | null;
  };
};

export type ProductRequest = {
  sku: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ApiProductStatus;
  brandId: number;
  warrantyPolicyId?: number | null;
  clearWarrantyPolicy?: boolean;
  imageUrls: string[];
  chipset?: string;
  storageGb?: number;
  screenSize?: number;
  screenTech?: string;
  batteryMah?: number;
  mainCameraMp?: number;
  os?: string;
  color?: string;
  supports5G?: boolean;
  hasCellular?: boolean;
  connectionType?: string;
  hasANC?: boolean;
  batteryLifeHours?: number;
  wattage?: number;
  portType?: string;
  fastChargingTech?: string;
  lengthMeters?: number;
  connectorFrom?: string;
  connectorTo?: string;
  material?: string;
  compatibleModel?: string;
};
