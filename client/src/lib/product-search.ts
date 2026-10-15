import type { ProductCategory, ProductSort } from "@/types/product.types";

export const PRODUCTS_ROUTE = "/products";
export const PRODUCTS_PAGE_SIZE = 12;

export const productCategories: Array<{ value: ProductCategory; label: string }> = [
  { value: "SMARTPHONE", label: "Điện thoại" },
  { value: "TABLET", label: "Máy tính bảng" },
  { value: "EARPHONE", label: "Tai nghe" },
  { value: "CHARGER", label: "Sạc" },
  { value: "CABLE", label: "Cáp" },
  { value: "CASE", label: "Ốp lưng" },
];

export const productSortOptions: Array<{ value: ProductSort; label: string }> = [
  { value: "default", label: "Mặc định" },
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá thấp đến cao" },
  { value: "price_desc", label: "Giá cao đến thấp" },
  { value: "name_asc", label: "Tên A → Z" },
];

export const pricePresets: Array<{
  label: string;
  minPrice: number | null;
  maxPrice: number | null;
}> = [
  { label: "Mọi mức giá", minPrice: null, maxPrice: null },
  { label: "Dưới 5 triệu", minPrice: null, maxPrice: 5000000 },
  { label: "5 – 10 triệu", minPrice: 5000000, maxPrice: 10000000 },
  { label: "10 – 20 triệu", minPrice: 10000000, maxPrice: 20000000 },
  { label: "Trên 20 triệu", minPrice: 20000000, maxPrice: null },
];

const VALID_CATEGORIES = new Set<string>(productCategories.map((item) => item.value));
const VALID_SORTS = new Set<string>(productSortOptions.map((item) => item.value));

export type ProductQuery = {
  keyword: string;
  category: ProductCategory | "ALL";
  brandId: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  sort: ProductSort;
  page: number;
};

export type SearchParamsLike = Record<string, string | string[] | undefined>;

export const emptyProductQuery: ProductQuery = {
  keyword: "",
  category: "ALL",
  brandId: null,
  minPrice: null,
  maxPrice: null,
  sort: "default",
  page: 1,
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function toNonNegativeNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function parseProductSearchParams(params: SearchParamsLike): ProductQuery {
  const keyword = firstValue(params.keyword).trim();

  const categoryRaw = firstValue(params.category).trim().toUpperCase();
  const category = VALID_CATEGORIES.has(categoryRaw)
    ? (categoryRaw as ProductCategory)
    : "ALL";

  const brandIdRaw = firstValue(params.brandId).trim();
  const brandIdNumber = Number(brandIdRaw);
  const brandId =
    brandIdRaw && Number.isInteger(brandIdNumber) && brandIdNumber > 0
      ? brandIdNumber
      : null;

  const minRaw = firstValue(params.minPrice).trim();
  const maxRaw = firstValue(params.maxPrice).trim();

  const sortRaw = firstValue(params.sort).trim().toLowerCase();
  const sort = VALID_SORTS.has(sortRaw) ? (sortRaw as ProductSort) : "default";

  const pageRaw = Number(firstValue(params.page).trim());
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  return {
    keyword,
    category,
    brandId,
    minPrice: minRaw ? toNonNegativeNumber(minRaw) : null,
    maxPrice: maxRaw ? toNonNegativeNumber(maxRaw) : null,
    sort,
    page,
  };
}

export function buildProductSearchParams(query: ProductQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.keyword.trim()) params.set("keyword", query.keyword.trim());
  if (query.category !== "ALL") params.set("category", query.category);
  if (query.brandId != null) params.set("brandId", String(query.brandId));
  if (query.minPrice != null) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice != null) params.set("maxPrice", String(query.maxPrice));
  if (query.sort !== "default") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}

export function buildProductsHref(
  query: ProductQuery,
  basePath: string = PRODUCTS_ROUTE,
): string {
  const queryString = buildProductSearchParams(query).toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function countActiveFilters(query: ProductQuery): number {
  let count = 0;
  if (query.keyword) count += 1;
  if (query.category !== "ALL") count += 1;
  if (query.brandId != null) count += 1;
  if (query.minPrice != null || query.maxPrice != null) count += 1;
  return count;
}

export function formatPriceInput(value: number | null): string {
  return value == null ? "" : String(value);
}
