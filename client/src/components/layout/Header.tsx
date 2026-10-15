"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/hooks/cart.hooks";
import { logout } from "@/api/auth.service";
import { dispatchAuthChange, useCurrentUser } from "@/hooks/use-current-user";

function SearchForm({ id }: { id: string }) {
  return (
    <form
      action="/"
      method="get"
      role="search"
      className="flex items-center gap-2 rounded-full border border-border bg-bg-soft py-1.5 pl-5 pr-1.5 transition focus-within:border-border-strong focus-within:bg-surface"
    >
      <input
        id={id}
        type="text"
        name="keyword"
        placeholder="Tìm kiếm sản phẩm..."
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-text outline-none placeholder:text-text-muted"
      />
      <button
        type="submit"
        aria-label="Tìm kiếm sản phẩm"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-dark"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}

const navLink =
  "rounded-full px-3 py-2 text-sm font-medium text-text transition hover:bg-surface-muted";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, setUser } = useCurrentUser(pathname);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function signOut() {
    setLogoutError(null);
    try {
      await logout();
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Không thể đăng xuất.",
      );
    } finally {
      setUser(null);
      dispatchAuthChange();
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Trang chủ PhoneStore"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
              P
            </span>
            <span className="font-display hidden text-xl text-text sm:block">
              PhoneStore
            </span>
          </Link>

          <div className="mx-6 hidden max-w-xl flex-1 md:block">
            <SearchForm id="desktop-search" />
          </div>

          <nav className="flex shrink-0 items-center gap-1">
            <Link href="/products" className={`${navLink} hidden sm:inline-block`}>
              Cửa hàng
            </Link>
            <Link href="/coupons" className={`${navLink} hidden sm:inline-block`}>
              Ưu đãi
            </Link>
            {user ? (
              <>
                <Link href="/orders" className={`${navLink} hidden sm:inline-block`}>
                  Đơn hàng
                </Link>
                <Link href="/profile" className={`${navLink} hidden sm:inline-block`}>
                  Tài khoản
                </Link>
                {user.role === "ADMIN" ? (
                  <Link
                    href="/admin"
                    className={`${navLink} hidden text-primary sm:inline-block`}
                  >
                    Quản trị
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={signOut}
                  className={`${navLink} hidden text-text-muted lg:inline-block`}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-text transition hover:border-border-strong"
              >
                Đăng nhập
              </Link>
            )}
            <Link
              href="/cart"
              className="ml-1 flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-text transition hover:border-border-strong"
            >
              Giỏ
              <span className="flex min-w-5 justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-white">
                {itemCount}
              </span>
            </Link>
          </nav>
        </div>

        <div className="pb-3 md:hidden">
          <SearchForm id="mobile-search" />
        </div>
      </div>

      {logoutError ? (
        <p
          role="alert"
          className="border-t border-red-200 bg-red-50 px-5 py-2 text-center text-sm text-red-700"
        >
          {logoutError}
        </p>
      ) : null}
    </header>
  );
}
