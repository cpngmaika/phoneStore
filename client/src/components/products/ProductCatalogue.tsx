import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductsToolbar } from "@/components/products/ProductsToolbar";
import { SsrPagination } from "@/components/products/SsrPagination";
import {
  parseProductSearchParams,
  productCategories,
  type SearchParamsLike,
} from "@/lib/product-search";
import { fetchBrands, fetchProductsPage } from "@/lib/server-api";

function resolveTitle(keyword: string, category: string): string {
  if (keyword) return `Kết quả cho “${keyword}”`;
  if (category !== "ALL") {
    const match = productCategories.find((item) => item.value === category);
    if (match) return match.label;
  }
  return "Tất cả sản phẩm";
}

/**
 * The single SSR product catalogue implementation. Rendered by both `/` and
 * `/products` so there is exactly one product-list implementation.
 */
export async function ProductCatalogue({
  searchParams,
  basePath,
}: {
  searchParams: SearchParamsLike;
  basePath: string;
}) {
  const query = parseProductSearchParams(searchParams);

  const [brands, pageResult] = await Promise.all([
    fetchBrands().catch(() => []),
    fetchProductsPage(query).catch(() => null),
  ]);

  const title = resolveTitle(query.keyword, query.category);

  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            PhoneStore
          </p>
          <h1 className="font-display mt-4 text-4xl text-text sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-text-muted">
            Khám phá bộ sưu tập thiết bị công nghệ được tuyển chọn. Lọc theo
            danh mục, thương hiệu và mức giá phù hợp với bạn.
          </p>
        </div>
      </section>

      {pageResult ? (
        <ProductsToolbar
          key={JSON.stringify(query)}
          brands={brands}
          totalElements={pageResult.totalElements}
        />
      ) : null}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        {!pageResult ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700"
          >
            Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.
          </div>
        ) : pageResult.products.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-12 text-center">
            <h2 className="font-display text-2xl text-text">
              Không tìm thấy sản phẩm
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-muted">
              Chưa có sản phẩm nào khớp với bộ lọc hiện tại. Hãy thử nới rộng
              khoảng giá hoặc bỏ một vài điều kiện lọc.
            </p>
            <Link
              href={basePath}
              className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageResult.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <SsrPagination
              query={query}
              totalPages={pageResult.totalPages}
              basePath={basePath}
            />
          </>
        )}
      </section>
    </main>
  );
}
