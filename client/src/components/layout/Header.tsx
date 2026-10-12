"use client";

import Link from "next/link";
import { useCart } from "@/modules/cart/cart.hooks";
import { useAuth } from "@/modules/auth/auth.context";

export function Header() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
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

        {/* Ở giữa: Thanh tìm kiếm */}
        <div className="hidden md:flex flex-1 mx-8 items-center rounded-full border border-border bg-surface shadow-sm hover:shadow-md transition-shadow py-1.5 pl-6 pr-2">
          <input 
            type="text"
            placeholder="Tìm kiếm tên sản phẩm..."
            className="flex-1 bg-transparent outline-none text-sm font-medium text-text placeholder:text-text-muted pr-4"
          />
          <button className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {/* Bên phải: Navigation */}
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

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/users"
                  className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 transition hover:border-border-strong hover:bg-surface-muted"
              >
                {user.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-6 w-6 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {user.fullName}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                className="rounded-full px-2.5 py-1 text-xs text-text-muted transition hover:text-red-500"
                title="Đăng xuất"
              >
                Thoát
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 transition hover:bg-surface-muted"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-4 py-2 text-white font-semibold transition hover:bg-primary-dark hidden sm:inline"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}