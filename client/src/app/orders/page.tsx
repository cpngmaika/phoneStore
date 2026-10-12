"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrders } from "@/api/orders.service";
import { formatCurrency } from "@/lib/product.utils";
import type { ApiOrder } from "@/types/order.types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getOrders()
      .then((result) => {
        if (!cancelled) setOrders(result);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Không thể tải đơn hàng.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8">
      <div>
        <p className="text-sm font-semibold text-primary">Lịch sử mua hàng</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">Đơn hàng của tôi</h1>
      </div>
      {loading ? <p role="status" className="text-text-muted">Đang tải đơn hàng...</p> : null}
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      {!loading && !error && orders.length === 0 ? <p className="rounded-xl border border-border bg-surface p-7 text-text-muted">Bạn chưa có đơn hàng nào.</p> : null}
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`} className="block rounded-xl border border-border bg-surface p-5 transition hover:border-primary">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-semibold text-text">{order.orderCode}</p><p className="mt-1 text-sm text-text-muted">{order.items.length} sản phẩm</p></div>
              <div className="text-right"><p className="font-semibold text-text">{formatCurrency(order.totalAmount)}</p><p className="mt-1 text-sm text-primary">{order.status}</p></div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
