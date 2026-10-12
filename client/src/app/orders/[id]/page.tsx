"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrderById } from "@/api/orders.service";
import { formatCurrency } from "@/lib/product.utils";
import type { ApiOrder } from "@/types/order.types";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrderById(id)
      .then((result) => {
        if (!cancelled) setOrder(result);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Không tìm thấy đơn hàng.");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) return <main className="mx-auto max-w-4xl px-5 py-16"><p role="alert" className="text-red-700">{error}</p><Link href="/orders" className="mt-4 inline-block text-primary">Quay lại đơn hàng</Link></main>;
  if (!order) return <main className="mx-auto max-w-4xl px-5 py-16 text-text-muted" role="status">Đang tải đơn hàng...</main>;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-5 py-10 sm:px-8">
      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="text-sm font-semibold text-primary">Đặt hàng thành công</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">{order.orderCode}</h1>
        <p className="mt-3 text-text-muted">Trạng thái: <span className="font-semibold text-text">{order.status}</span></p>
      </div>
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold text-text">Sản phẩm trong đơn</h2>
        <div className="mt-4 divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between gap-4 py-4 text-sm">
              <div><p className="font-semibold text-text">{item.productName}</p><p className="mt-1 text-text-muted">{item.quantity} × {formatCurrency(item.unitPrice)}</p></div>
              <p className="font-semibold text-text">{formatCurrency(item.subtotal)}</p>
            </div>
          ))}
        </div>
        {order.couponCode ? <p className="mt-3 text-sm text-text-muted">Mã giảm giá: {order.couponCode}</p> : null}
        <p className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold text-text"><span>Tổng cộng</span><span>{formatCurrency(order.totalAmount)}</span></p>
      </section>
      <Link href="/orders" className="inline-flex font-semibold text-primary">Xem tất cả đơn hàng</Link>
    </main>
  );
}
