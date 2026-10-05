"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
      {/* Thêm justify-between vào đây */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 gap-4">
        
        {/* Bên trái: Logo PhoneStore */}
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="PhoneStore home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
            P
          </span>
          <span className="text-lg font-semibold tracking-normal text-text hidden sm:block">
            PhoneStore
          </span>
        </Link>

        {/* Ở giữa: Xóa max-w-xl, giữ flex-1 và thêm mx-8 để cách đều 2 bên */}
        <div className="hidden md:flex flex-1 mx-8 items-center rounded-full border border-border bg-surface shadow-sm hover:shadow-md transition-shadow py-1.5 pl-6 pr-2">
          
          <input 
            type="text"
            placeholder="Tìm kiếm tên sản phẩm..."
            className="flex-1 bg-transparent outline-none text-sm font-medium text-text placeholder:text-text-muted pr-4"
          />
          
          {/* Nút Kính lúp màu đỏ (Accent color) */}
          <button className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

        </div>

        {/* Bên phải: Xóa chữ flex-end bị sai */}
        <nav className="flex items-center gap-3 text-sm font-medium text-text shrink-0">
          <Link
            href="/"
            className="rounded-full px-4 py-2 transition hover:bg-surface-muted hidden sm:block"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 transition hover:border-border-strong hover:shadow-soft"
          >
            Cart
            <span className="flex min-w-6 justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
              {itemCount}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}