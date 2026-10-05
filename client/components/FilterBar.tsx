"use client";

import type { ProductCategory } from "@/lib/types";

type FilterBarProps = {
  brands: string[];
  selectedCategory: "ALL" | ProductCategory;
  selectedBrand: string;
  selectedPrice: string;
  onCategoryChange: (category: "ALL" | ProductCategory) => void;
  onBrandChange: (brand: string) => void;
  onPriceChange: (price: string) => void;
};

export function FilterBar({
  brands,
  selectedBrand,
  onBrandChange,
}: FilterBarProps) {
  return (
    <section className="">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 space-y-4">
        
        {/* Hàng 1: Các nút bộ lọc */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Nút Bộ lọc màu đỏ */}
          <button className="flex items-center gap-2 rounded-lg border border-primary bg-primary-soft px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Bộ lọc
          </button>
          
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-4 py-2 text-sm font-medium text-text transition hover:border-border-strong">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            Sẵn hàng
          </button>
          
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-4 py-2 text-sm font-medium text-text transition hover:border-border-strong">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Hàng mới về
          </button>

          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-4 py-2 text-sm font-medium text-text transition hover:border-border-strong">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>
            Xem theo giá
          </button>

          {/* Nút dropdown Hãng sản xuất (Kết nối với logic hiện tại) */}
          <select
            value={selectedBrand}
            onChange={(event) => onBrandChange(event.target.value)}
            className="h-[38px] rounded-lg border border-border bg-surface-muted px-3 text-sm font-medium text-text outline-none transition focus:border-primary hover:border-border-strong"
          >
            <option value="ALL">Hãng sản xuất</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          {/* Các nút dropdown tĩnh khác */}
          {["Nhu cầu sử dụng", "CPU", "Dung lượng RAM", "Ổ cứng", "Card đồ họa", "Kích thước màn hình"].map(filterName => (
            <button key={filterName} className="flex items-center gap-1 rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm font-medium text-text transition hover:border-border-strong">
              {filterName}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          ))}
        </div>

        {/* Hàng 2: Sắp xếp theo */}
        <div className="flex items-center gap-4 pt-2">
          <span className="text-base font-bold text-text">Sắp xếp theo</span>
          
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 rounded-full border border-blue-500 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Phổ biến
            </button>

            <button className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition hover:bg-surface-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              Khuyến mãi HOT
            </button>

            <button className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition hover:bg-surface-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
              Giá Thấp - Cao
            </button>

            <button className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition hover:bg-surface-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              Giá Cao - Thấp
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}