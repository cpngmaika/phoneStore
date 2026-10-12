export type ProductCategory =
  | "SMARTPHONE"
  | "TABLET"
  | "EARPHONE"
  | "CHARGER"
  | "CABLE";

export type ProductStatus = "ACTIVE" | "HIDDEN" | "OUT_OF_STOCK";

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
};

export type SmartDeviceProduct = BaseProduct & {
  category: "SMARTPHONE" | "TABLET";
  chipset: string;
  storageGb: number;
  screenSize: number;
  batteryMah: number;
  os: string;
  color: string;
};

export type EarphoneProduct = BaseProduct & {
  category: "EARPHONE";
  connectionType: string;
  hasANC: boolean;
  batteryLifeHours: number;
  isWireless: boolean;
};

export type PowerAccessoryProduct = BaseProduct & {
  category: "CHARGER" | "CABLE";
  lengthMeters: number;
  wattageW: number;
  isFastCharge: boolean;
};

export type Product =
  | SmartDeviceProduct
  | EarphoneProduct
  | PowerAccessoryProduct;
