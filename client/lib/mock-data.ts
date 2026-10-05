import type { Brand, Cart, Product } from "./types";

export const brands: Brand[] = [
  {
    id: "brand-apple",
    name: "Apple",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    id: "brand-samsung",
    name: "Samsung",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  },
  {
    id: "brand-google",
    name: "Google",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    id: "brand-anker",
    name: "Anker",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Anker_logo.svg",
  },
];

const brandById = Object.fromEntries(brands.map((brand) => [brand.id, brand]));

export const products: Product[] = [
  {
    id: "iphone-16-pro",
    sku: "APL-IP16P-256-TI",
    name: "iPhone 16 Pro",
    description:
      "A compact flagship smartphone with pro cameras, all-day battery life, and a bright titanium finish.",
    price: 1099,
    category: "SMARTPHONE",
    status: "ACTIVE",
    brand: brandById["brand-apple"],
    images: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80",
        isPrimary: true,
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=1200&q=80",
        isPrimary: false,
      },
    ],
    reviews: [
      { rating: 5, content: "Fast, polished, and the camera is excellent in low light." },
      { rating: 4, content: "Expensive, but the display and battery make it feel premium." },
    ],
    chipset: "A18 Pro",
    storageGb: 256,
    screenSize: 6.3,
    batteryMah: 3582,
    os: "iOS 18",
    color: "Natural Titanium",
  },
  {
    id: "galaxy-s25-ultra",
    sku: "SMS-S25U-512-BLK",
    name: "Galaxy S25 Ultra",
    description:
      "A large-screen productivity phone with an integrated pen, advanced zoom camera, and fast charging.",
    price: 1299,
    category: "SMARTPHONE",
    status: "ACTIVE",
    brand: brandById["brand-samsung"],
    images: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80",
        isPrimary: true,
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=80",
        isPrimary: false,
      },
    ],
    reviews: [
      { rating: 5, content: "The screen is huge and sharp without feeling sluggish." },
      { rating: 5, content: "Zoom shots look much better than my old phone." },
    ],
    chipset: "Snapdragon 8 Elite",
    storageGb: 512,
    screenSize: 6.9,
    batteryMah: 5000,
    os: "Android 16",
    color: "Titanium Black",
  },
  {
    id: "pixel-10",
    sku: "GOO-PX10-128-OBS",
    name: "Pixel 10",
    description:
      "A clean Android phone tuned for helpful AI features, excellent photos, and compact everyday use.",
    price: 799,
    category: "SMARTPHONE",
    status: "ACTIVE",
    brand: brandById["brand-google"],
    images: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=1200&q=80",
        isPrimary: true,
      },
    ],
    reviews: [
      { rating: 4, content: "Great software and photos. The size is just right." },
      { rating: 5, content: "Best point-and-shoot camera I have used." },
    ],
    chipset: "Tensor G5",
    storageGb: 128,
    screenSize: 6.2,
    batteryMah: 4700,
    os: "Android 16",
    color: "Obsidian",
  },
  {
    id: "ipad-air-13",
    sku: "APL-IPADAIR13-256-BLU",
    name: "iPad Air 13",
    description:
      "A thin 13-inch tablet for creative work, streaming, note taking, and multitasking on the go.",
    price: 799,
    category: "TABLET",
    status: "ACTIVE",
    brand: brandById["brand-apple"],
    images: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80",
        isPrimary: true,
      },
    ],
    reviews: [
      { rating: 5, content: "Light enough to carry every day and powerful enough for design apps." },
    ],
    chipset: "Apple M3",
    storageGb: 256,
    screenSize: 13,
    batteryMah: 9705,
    os: "iPadOS 19",
    color: "Blue",
  },
  {
    id: "galaxy-tab-s10",
    sku: "SMS-TABS10-256-SLV",
    name: "Galaxy Tab S10",
    description:
      "A vivid Android tablet with a smooth AMOLED display, included pen, and a slim aluminum body.",
    price: 899,
    category: "TABLET",
    status: "OUT_OF_STOCK",
    brand: brandById["brand-samsung"],
    images: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=1200&q=80",
        isPrimary: true,
      },
    ],
    reviews: [
      { rating: 4, content: "Fantastic display for reading and video editing." },
    ],
    chipset: "Dimensity 9300+",
    storageGb: 256,
    screenSize: 12.4,
    batteryMah: 10090,
    os: "Android 16",
    color: "Moonstone Silver",
  },
  {
    id: "airpods-pro-3",
    sku: "APL-APP3-WHT",
    name: "AirPods Pro 3",
    description:
      "Wireless earbuds with adaptive noise cancellation, spatial audio, and a pocket-sized charging case.",
    price: 249,
    category: "EARPHONE",
    status: "ACTIVE",
    brand: brandById["brand-apple"],
    images: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1200&q=80",
        isPrimary: true,
      },
    ],
    reviews: [
      { rating: 5, content: "The ANC makes flights much easier." },
      { rating: 4, content: "Comfortable and easy to pair." },
    ],
    connectionType: "Bluetooth 5.4",
    hasANC: true,
    batteryLifeHours: 8,
    isWireless: true,
  },
  {
    id: "galaxy-buds-4-pro",
    sku: "SMS-GB4P-GPH",
    name: "Galaxy Buds4 Pro",
    description:
      "Compact wireless earbuds with deep bass, active noise cancellation, and smart device switching.",
    price: 229,
    category: "EARPHONE",
    status: "ACTIVE",
    brand: brandById["brand-samsung"],
    images: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
        isPrimary: true,
      },
    ],
    reviews: [
      { rating: 4, content: "Strong battery and clear calls." },
    ],
    connectionType: "Bluetooth 5.4",
    hasANC: true,
    batteryLifeHours: 9,
    isWireless: true,
  },
  {
    id: "anker-prime-100w",
    sku: "ANK-CHG100W-BLK",
    name: "Anker Prime 100W Charger",
    description:
      "A compact wall charger with enough power for a laptop, tablet, and phone from one outlet.",
    price: 84,
    category: "CHARGER",
    status: "ACTIVE",
    brand: brandById["brand-anker"],
    images: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80",
        isPrimary: true,
      },
    ],
    reviews: [
      { rating: 5, content: "Replaced three chargers in my bag." },
    ],
    lengthMeters: 0,
    wattageW: 100,
    isFastCharge: true,
  },
  {
    id: "anker-usbc-cable-2m",
    sku: "ANK-CBL240W-2M-WHT",
    name: "Anker USB-C Cable 2m",
    description:
      "A durable braided USB-C cable rated for fast charging phones, tablets, and laptops.",
    price: 24,
    category: "CABLE",
    status: "ACTIVE",
    brand: brandById["brand-anker"],
    images: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1619334084726-84b6ef981af8?auto=format&fit=crop&w=1200&q=80",
        isPrimary: true,
      },
    ],
    reviews: [
      { rating: 4, content: "Long, sturdy, and does not kink easily." },
    ],
    lengthMeters: 2,
    wattageW: 240,
    isFastCharge: true,
  },
];

export const mockCart: Cart = {
  id: "cart-demo",
  items: [
    {
      product: products[0],
      quantity: 1,
      subtotal: products[0].price,
    },
    {
      product: products[8],
      quantity: 2,
      subtotal: products[8].price * 2,
    },
  ],
  total: products[0].price + products[8].price * 2,
};

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}
