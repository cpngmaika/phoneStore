"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/product.utils";
import {
  buildProductsHref,
  countActiveFilters,
  parseProductSearchParams,
  pricePresets,
  productCategories,
  productSortOptions,
  type ProductQuery,
} from "@/lib/product-search";
import type { ApiBrand } from "@/types/brand.types";
import type { ProductCategory } from "@/types/product.types";

const selectClass =
  "h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text outline-none transition focus:border-primary";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted";

export function ProductsToolbar({
  brands,
  totalElements,
}: {
  brands: ApiBrand[];
  totalElements: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(
    () => parseProductSearchParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  function apply(next: Partial<ProductQuery>) {
    router.push(buildProductsHref({ ...query, ...next, page: 1 }, pathname));
  }

  function clearAll() {
    router.push(pathname);
    setMobileOpen(false);
  }

  function submitPrice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const minRaw = String(data.get("minPrice") ?? "").trim();
    const maxRaw = String(data.get("maxPrice") ?? "").trim();
    apply({
      minPrice: minRaw ? Number(minRaw) : null,
      maxPrice: maxRaw ? Number(maxRaw) : null,
    });
    setMobileOpen(false);
  }

  const activeFilters = countActiveFilters(query);
  const activeBrand =
    brands.find((brand) => Number(brand.id) === query.brandId) ?? null;
  const activeCategory =
    query.category === "ALL"
      ? null
      : productCategories.find((item) => item.value === query.category) ?? null;

  function renderControls() {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelClass} htmlFor="filter-category">
            Danh mục
          </label>
          <select
            id="filter-category"
            value={query.category}
            onChange={(event) =>
              apply({ category: event.target.value as ProductCategory | "ALL" })
            }
            className={selectClass}
          >
            <option value="ALL">Tất cả danh mục</option>
            {productCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="filter-brand">
            Thương hiệu
          </label>
          <select
            id="filter-brand"
            value={query.brandId ?? "ALL"}
            onChange={(event) =>
              apply({
                brandId:
                  event.target.value === "ALL" ? null : Number(event.target.value),
              })
            }
            className={selectClass}
          >
            <option value="ALL">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={submitPrice} className="sm:col-span-2">
          <span className={labelClass}>Khoảng giá (VND)</span>
          <div className="flex items-center gap-2">
            <input
              name="minPrice"
              type="number"
              min={0}
              step={100000}
              inputMode="numeric"
              defaultValue={query.minPrice ?? ""}
              placeholder="Từ"
              className={selectClass}
            />
            <span className="text-text-muted">–</span>
            <input
              name="maxPrice"
              type="number"
              min={0}
              step={100000}
              inputMode="numeric"
              defaultValue={query.maxPrice ?? ""}
              placeholder="Đến"
              className={selectClass}
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-md border border-border px-4 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
            >
              Áp dụng
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {pricePresets.map((preset) => {
              const isActive =
                (preset.minPrice ?? null) === query.minPrice &&
                (preset.maxPrice ?? null) === query.maxPrice;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() =>
                    apply({
                      minPrice: preset.minPrice,
                      maxPrice: preset.maxPrice,
                    })
                  }
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    isActive
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border text-text-muted hover:border-border-strong"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </form>
      </div>
    );
  }

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            <span className="font-semibold text-text">{totalElements}</span>{" "}
            sản phẩm
            {query.keyword ? (
              <>
                {" "}
                cho “<span className="font-medium text-text">{query.keyword}</span>”
              </>
            ) : null}
          </p>

          <div className="flex items-center gap-3">
            <label className="sr-only" htmlFor="filter-sort">
              Sắp xếp
            </label>
            <select
              id="filter-sort"
              value={query.sort}
              onChange={(event) => apply({ sort: event.target.value as ProductQuery["sort"] })}
              className="h-11 rounded-md border border-border bg-surface px-3 text-sm text-text outline-none transition focus:border-primary"
            >
              {productSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold text-text transition hover:border-border-strong lg:hidden"
            >
              Bộ lọc
              {activeFilters > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
                  {activeFilters}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div className="mt-5 hidden lg:block">{renderControls()}</div>

        {activeFilters > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Đang lọc
            </span>
            {query.keyword ? (
              <FilterChip label={`“${query.keyword}”`} onRemove={() => apply({ keyword: "" })} />
            ) : null}
            {activeCategory ? (
              <FilterChip
                label={activeCategory.label}
                onRemove={() => apply({ category: "ALL" })}
              />
            ) : null}
            {activeBrand ? (
              <FilterChip label={activeBrand.name} onRemove={() => apply({ brandId: null })} />
            ) : null}
            {query.minPrice != null || query.maxPrice != null ? (
              <FilterChip
                label={priceRangeLabel(query.minPrice, query.maxPrice)}
                onRemove={() => apply({ minPrice: null, maxPrice: null })}
              />
            ) : null}
            <button
              type="button"
              onClick={clearAll}
              className="ml-1 text-xs font-semibold text-primary hover:underline"
            >
              Xóa tất cả
            </button>
          </div>
        ) : null}
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Đóng bộ lọc"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-surface p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl text-text">Bộ lọc</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Đóng"
                className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-text-muted hover:bg-surface-muted"
              >
                ×
              </button>
            </div>
            {renderControls()}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="mt-6 h-12 rounded-md bg-primary text-sm font-semibold text-white"
            >
              Xem kết quả
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function priceRangeLabel(min: number | null, max: number | null): string {
  if (min != null && max != null) {
    return `${formatCurrency(min)} – ${formatCurrency(max)}`;
  }
  if (min != null) return `Từ ${formatCurrency(min)}`;
  if (max != null) return `Đến ${formatCurrency(max)}`;
  return "";
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Bỏ lọc ${label}`}
        className="text-text-muted transition hover:text-primary"
      >
        ×
      </button>
    </span>
  );
}
