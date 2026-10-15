import Link from "next/link";
import {
  buildProductsHref,
  PRODUCTS_ROUTE,
  type ProductQuery,
} from "@/lib/product-search";

function pageWindow(current: number, total: number): number[] {
  const max = 5;
  let start = Math.max(1, current - Math.floor(max / 2));
  const end = Math.min(total, start + max - 1);
  start = Math.max(1, end - max + 1);
  const pages: number[] = [];
  for (let i = start; i <= end; i += 1) pages.push(i);
  return pages;
}

const baseItem =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-border px-3 text-sm font-medium text-text transition hover:border-border-strong";

export function SsrPagination({
  query,
  totalPages,
  basePath = PRODUCTS_ROUTE,
}: {
  query: ProductQuery;
  totalPages: number;
  basePath?: string;
}) {
  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(query.page, 1), totalPages);
  const pages = pageWindow(current, totalPages);
  const pageHref = (page: number) =>
    buildProductsHref({ ...query, page }, basePath);

  return (
    <nav
      aria-label="Phân trang"
      className="mt-14 flex items-center justify-center gap-2"
    >
      {current > 1 ? (
        <Link
          href={pageHref(current - 1)}
          className={baseItem}
          rel="prev"
        >
          Trước
        </Link>
      ) : (
        <span className={`${baseItem} pointer-events-none opacity-40`}>Trước</span>
      )}

      {pages[0] > 1 ? (
        <>
          <Link href={pageHref(1)} className={baseItem}>
            1
          </Link>
          {pages[0] > 2 ? <span className="px-1 text-text-muted">…</span> : null}
        </>
      ) : null}

      {pages.map((pageNumber) =>
        pageNumber === current ? (
          <span
            key={pageNumber}
            aria-current="page"
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-primary bg-primary px-3 text-sm font-semibold text-white"
          >
            {pageNumber}
          </span>
        ) : (
          <Link
            key={pageNumber}
            href={pageHref(pageNumber)}
            className={baseItem}
          >
            {pageNumber}
          </Link>
        ),
      )}

      {pages[pages.length - 1] < totalPages ? (
        <>
          {pages[pages.length - 1] < totalPages - 1 ? (
            <span className="px-1 text-text-muted">…</span>
          ) : null}
          <Link
            href={pageHref(totalPages)}
            className={baseItem}
          >
            {totalPages}
          </Link>
        </>
      ) : null}

      {current < totalPages ? (
        <Link
          href={pageHref(current + 1)}
          className={baseItem}
          rel="next"
        >
          Sau
        </Link>
      ) : (
        <span className={`${baseItem} pointer-events-none opacity-40`}>Sau</span>
      )}
    </nav>
  );
}
