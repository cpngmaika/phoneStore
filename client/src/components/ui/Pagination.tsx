type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Phân trang"
      className="mt-8 flex items-center justify-center gap-4"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text disabled:opacity-50"
      >
        Trước
      </button>
      <span className="text-sm text-text-muted">
        Trang {page} / {pageCount}
      </span>
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text disabled:opacity-50"
      >
        Sau
      </button>
    </nav>
  );
}
