"use client";

import type { ApiBrand } from "@/types/brand.types";
import type { ProductCategory } from "@/types/product.types";

export type ProductSort = "popular" | "price-ascending" | "price-descending";

type FilterBarProps = {
  brands: ApiBrand[];
  selectedCategory: "ALL" | ProductCategory;
  selectedBrand: string;
  selectedPrice: string;
  selectedSort: ProductSort;
  onCategoryChange: (category: "ALL" | ProductCategory) => void;
  onBrandChange: (brand: string) => void;
  onPriceChange: (price: string) => void;
  onSortChange: (sort: ProductSort) => void;
};

const categories: Array<{ value: "ALL" | ProductCategory; label: string }> = [
  { value: "ALL", label: "Tất cả danh mục" },
  { value: "SMARTPHONE", label: "Điện thoại" },
  { value: "TABLET", label: "Máy tính bảng" },
  { value: "EARPHONE", label: "Tai nghe" },
  { value: "CHARGER", label: "Sạc" },
  { value: "CABLE", label: "Cáp" },
];

const prices = [
  { value: "ALL", label: "Mọi mức giá" },
  { value: "UNDER_250", label: "Dưới $250" },
  { value: "250_800", label: "$250 – $800" },
  { value: "OVER_800", label: "Trên $800" },
];

const sortOptions: Array<{ value: ProductSort; label: string }> = [
  { value: "popular", label: "Nổi bật" },
  { value: "price-ascending", label: "Giá thấp đến cao" },
  { value: "price-descending", label: "Giá cao đến thấp" },
];

export function FilterBar({
  brands,
  selectedCategory,
  selectedBrand,
  selectedPrice,
  selectedSort,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <section className="border-y border-border bg-surface/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
        <label className="sr-only" htmlFor="category-filter">
          Lọc theo danh mục
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) =>
            onCategoryChange(event.target.value as "ALL" | ProductCategory)
          }
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="brand-filter">
          Lọc theo thương hiệu
        </label>
        <select
          id="brand-filter"
          value={selectedBrand}
          onChange={(event) => onBrandChange(event.target.value)}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary"
        >
          <option value="ALL">Tất cả thương hiệu</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="price-filter">
          Lọc theo giá
        </label>
        <select
          id="price-filter"
          value={selectedPrice}
          onChange={(event) => onPriceChange(event.target.value)}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary"
        >
          {prices.map((price) => (
            <option key={price.value} value={price.value}>
              {price.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="sort-filter">
          Sắp xếp sản phẩm
        </label>
        <select
          id="sort-filter"
          value={selectedSort}
          onChange={(event) =>
            onSortChange(event.target.value as ProductSort)
          }
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
