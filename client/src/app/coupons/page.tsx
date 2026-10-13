"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAvailableCoupons } from "@/api/coupons.service";
import type { Coupon } from "@/types/coupon.types";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function discountLabel(coupon: Coupon) {
  return coupon.discountType === "PERCENTAGE"
    ? `Giảm ${coupon.discountValue}%`
    : `Giảm ${currency.format(coupon.discountValue)}`;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAvailableCoupons()
      .then((result) => {
        if (!cancelled) setCoupons(result);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải mã giảm giá.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function copyCode(code: string) {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
    } catch {
      setCopyError("Không thể sao chép mã. Vui lòng chọn và sao chép thủ công.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">Ưu đãi PhoneStore</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Mã giảm giá
          </h1>
          <p className="mt-3 text-text-muted">
            Chọn mã còn hiệu lực và nhập mã tại bước đặt hàng.
          </p>
        </div>
        <Link
          href="/cart"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Đến giỏ hàng
        </Link>
      </div>

      {error ? (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Không thể tải mã giảm giá: {error}
        </p>
      ) : null}
      {copyError ? (
        <p role="alert" className="mt-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          {copyError}
        </p>
      ) : null}

      {loading ? (
        <p role="status" className="mt-8 rounded-xl border border-border bg-surface p-8 text-center text-text-muted">
          Đang tải ưu đãi...
        </p>
      ) : error ? null : coupons.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-surface p-8 text-center text-text-muted">
          Hiện chưa có mã giảm giá khả dụng.
        </p>
      ) : (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <article
              key={coupon.id}
              className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
            >
              <div className="border-b border-dashed border-border bg-primary-soft p-5">
                <p className="text-sm font-semibold text-primary">ƯU ĐÃI</p>
                <p className="mt-1 text-2xl font-bold text-text">
                  {discountLabel(coupon)}
                </p>
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Mã giảm giá
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold tracking-wider text-text">
                    {coupon.code}
                  </p>
                </div>
                <p className="text-sm text-text-muted">
                  Đơn tối thiểu {currency.format(coupon.minOrderAmount)}
                </p>
                {coupon.discountType === "PERCENTAGE" && coupon.maxDiscountAmount !== null ? (
                  <p className="text-sm text-text-muted">
                    Giảm tối đa {currency.format(coupon.maxDiscountAmount)}
                  </p>
                ) : null}
                <p className="text-sm text-text-muted">
                  Hạn dùng đến {new Date(`${coupon.endDate}T00:00:00`).toLocaleDateString("vi-VN")}
                </p>
                <button
                  type="button"
                  onClick={() => copyCode(coupon.code)}
                  className="w-full rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-soft"
                >
                  {copiedCode === coupon.code ? "Đã sao chép mã" : "Sao chép mã"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
