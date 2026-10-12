"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/hooks/cart.hooks";
import { logout } from "@/api/auth.service";
import { useCurrentUser } from "@/hooks/use-current-user";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user } = useCurrentUser(pathname);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function signOut() {
    setLogoutError(null);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Không thể đăng xuất.");
    }
  }

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
        <form action="/" method="get" className="hidden md:flex flex-1 mx-8 items-center rounded-full border border-border bg-surface shadow-sm hover:shadow-md transition-shadow py-1.5 pl-6 pr-2">
          <input 
            type="text"
            name="keyword"
            placeholder="Tìm kiếm tên sản phẩm..."
            className="flex-1 bg-transparent outline-none text-sm font-medium text-text placeholder:text-text-muted pr-4"
          />
          
          <button type="submit" aria-label="Search products" className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

        </form>

        {/* Bên phải: Xóa chữ flex-end bị sai */}
        <nav className="flex items-center gap-3 text-sm font-medium text-text shrink-0">
          <Link
            href="/"
            className="rounded-full px-4 py-2 transition hover:bg-surface-muted hidden sm:block"
          >
            Shop
          </Link>
          {user ? (
            <>
              <Link href="/orders" className="hidden rounded-full px-3 py-2 transition hover:bg-surface-muted sm:block">Đơn hàng</Link>
              <Link href="/profile" className="hidden rounded-full px-3 py-2 transition hover:bg-surface-muted sm:block">Tài khoản</Link>
              {user.role === "ADMIN" ? <Link href="/admin" className="hidden rounded-full px-3 py-2 text-primary transition hover:bg-primary-soft sm:block">Quản trị</Link> : null}
              <button type="button" onClick={signOut} className="hidden rounded-full px-3 py-2 text-text-muted transition hover:bg-surface-muted sm:block">Đăng xuất</button>
            </>
          ) : (
            <Link href="/login" className="rounded-full px-3 py-2 transition hover:bg-surface-muted">Đăng nhập</Link>
          )}
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
      {logoutError ? <p role="alert" className="border-t border-red-200 bg-red-50 px-5 py-2 text-center text-sm text-red-700">{logoutError}</p> : null}
    </header>
  );
}