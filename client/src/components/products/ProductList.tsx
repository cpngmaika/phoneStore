"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { getBrands } from "@/api/brands.service";
import { getProducts } from "@/api/products.service";
import { FilterBar, type ProductSort } from "@/components/products/FilterBar";
import { ProductCard } from "@/components/products/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import type { ApiBrand } from "@/types/brand.types";
import type { Product, ProductCategory } from "@/types/product.types";

function subscribeToSearch(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getSearchKeyword() {
  return new URLSearchParams(window.location.search).get("keyword")?.trim() ?? "";
}

function getServerSearchKeyword() {
  return "";
}

export function ProductList() {
  const pageSize = 12;
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [category, setCategory] = useState<"ALL" | ProductCategory>("ALL");
  const [brand, setBrand] = useState("ALL");
  const [price, setPrice] = useState("ALL");
  const [sort, setSort] = useState<ProductSort>("popular");
  const [page, setPage] = useState({ key: "", value: 1 });
  const keyword = useSyncExternalStore(
    subscribeToSearch,
    getSearchKeyword,
    getServerSearchKeyword,
  );
  const [completedRequestKey, setCompletedRequestKey] = useState<string | null>(
    null,
  );
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [productsError, setProductsError] = useState<{
    key: string;
    message: string;
  } | null>(null);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getBrands()
      .then((result) => {
        if (!cancelled) setBrands(result);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setBrandsError(
            error instanceof Error ? error.message : "Không thể tải thương hiệu.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingBrands(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const requestKey = JSON.stringify({ brand, category, keyword, price });
    const filters: Parameters<typeof getProducts>[0] = {};
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword) filters.keyword = trimmedKeyword;
    if (category !== "ALL") filters.category = category;
    if (brand !== "ALL") filters.brandId = Number(brand);
    if (price === "UNDER_2500000") filters.maxPrice = 2499999.99;
    if (price === "2500000_5000000") {
      filters.minPrice = 2500000;
      filters.maxPrice = 4999999.99;
    }
    if (price === "OVER_5000000") filters.minPrice = 5000000.01;

    getProducts(filters)
      .then((result) => {
        if (!cancelled) {
          setProducts(result);
          setProductsError(null);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setProductsError({
            key: requestKey,
            message:
              error instanceof Error
                ? error.message
                : "Không thể tải sản phẩm.",
          });
        }
      })
      .finally(() => {
        if (!cancelled) setCompletedRequestKey(requestKey);
      });

    return () => {
      cancelled = true;
    };
  }, [brand, category, keyword, price]);

  const requestKey = JSON.stringify({ brand, category, keyword, price });
  const loadingProducts = completedRequestKey !== requestKey;
  const currentProductsError =
    productsError?.key === requestKey ? productsError.message : null;
  const visibleProducts = useMemo(() => {
    const available = products.filter((product) => product.status !== "HIDDEN");

    if (sort === "price-ascending") {
      return [...available].sort((a, b) => a.price - b.price);
    }
    if (sort === "price-descending") {
      return [...available].sort((a, b) => b.price - a.price);
    }
    return available;
  }, [products, sort]);
  const paginationKey = JSON.stringify({ brand, category, keyword, price, sort });
  const pageCount = Math.ceil(visibleProducts.length / pageSize);
  const selectedPage = page.key === paginationKey ? page.value : 1;
  const currentPage = Math.min(selectedPage, Math.max(pageCount, 1));
  const paginatedProducts = visibleProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8 lg:pb-12 lg:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            PhoneStore
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            Thiết bị công nghệ cho mỗi ngày
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
            Khám phá điện thoại, máy tính bảng và phụ kiện từ những thương hiệu
            bạn yêu thích.
          </p>
        </div>
      </section>

      <FilterBar
        brands={brands}
        selectedCategory={category}
        selectedBrand={brand}
        selectedPrice={price}
        selectedSort={sort}
        onCategoryChange={setCategory}
        onBrandChange={setBrand}
        onPriceChange={setPrice}
        onSortChange={setSort}
      />

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              {loadingProducts ? "Đang cập nhật danh mục" : `${visibleProducts.length} sản phẩm`}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
              {keyword ? `Kết quả cho “${keyword}”` : "Sản phẩm nổi bật"}
            </h2>
          </div>
        </div>

        {brandsError ? (
          <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            Không thể tải danh sách thương hiệu: {brandsError}
          </p>
        ) : null}

        {loadingProducts ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted" role="status">
            Đang tải sản phẩm...
          </div>
        ) : currentProductsError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700" role="alert">
            Không thể tải sản phẩm: {currentProductsError}
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center text-text-muted">
            Không tìm thấy sản phẩm phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {!loadingProducts && !currentProductsError && visibleProducts.length > 0 ? (
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onPageChange={(value) => setPage({ key: paginationKey, value })}
          />
        ) : null}

        {loadingBrands ? (
          <p className="sr-only" role="status">Đang tải thương hiệu...</p>
        ) : null}
      </section>
    </>
  );
}
